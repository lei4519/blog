import matter from "gray-matter";

type MetaData = Record<string, unknown>;

interface ConvertResult {
  metaData: MetaData;
  issueContent: string;
  blogContent: string;
}

// Convert markdown content for both blog and issue formats
export function convert(title: string, content: string): ConvertResult {
  let blogContent = "";
  let issueContent = "";

  const trimmedContent = content.trim();

  // 使用 gray-matter 解析 frontmatter
  const parsed = matter(trimmedContent);
  const frontmatter = parsed.data;

  // 生成 blog frontmatter
  // 添加默认 title 和 description
  if (!frontmatter.title) {
    frontmatter.title = title;
  }
  if (!frontmatter.description) {
    frontmatter.description = title;
  }

  if (frontmatter.issue) {
    frontmatter.issue = Number(frontmatter.issue);
  }

  // 为 issue content 添加时间戳
  if (frontmatter.created) {
    const formatted = String(frontmatter.created).substring(0, 10);
    frontmatter.created = formatted;
    issueContent += `<p align="right"><time>${frontmatter.created}</time></p>\n`;
  }

  // 辅助函数：构建 blog 和 issue 内容
  const build = (
    props:
      | {
          blog?: string;
          issue?: string;
        }
      | string,
  ) => {
    if (typeof props === "string") {
      blogContent += props + "\n";
      issueContent += props + "\n";
    } else {
      if (props.blog !== undefined) {
        blogContent += props.blog + "\n";
      }
      if (props.issue !== undefined) {
        issueContent += props.issue + "\n";
      }
    }
  };

  build({
    blog: matter.stringify("", frontmatter).trim() + "\n",
  });

  // 处理正文内容
  const lines = parsed.content.split("\n");

  for (const line of lines) {
    // 空行直接传递
    if (line.trim() === "") {
      build(line);
      continue;
    }

    // Regex patterns
    const BLOCK_QUOTE_REG = /^(>\s+\[!)([^\]]+)\]/;
    // Handle block quotes like > [!TIP]
    const blockQuoteMatch = BLOCK_QUOTE_REG.exec(line);
    if (blockQuoteMatch) {
      const tag = blockQuoteMatch[2].trim();

      build({
        blog: `> **${tag}**  \n>  `,
        issue: `${blockQuoteMatch[1]}${tag}${line.substring(blockQuoteMatch[1].length + blockQuoteMatch[2].length)}`,
      });
      continue;
    }

    // Handle links - process all links in the line
    let linePrevIdx = 0;
    let blogLine = "";
    let issueLine = "";

    let linkMatch: RegExpExecArray | null;

    const LINK_REG = /\]\(([^)]*)\)/g;
    const ISSUE_LINK_REG = /^\.\.\/(\d+)\//;
    const IMG_REG = /\.(jpg|png|svg|jpeg|webp)$/;

    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    while ((linkMatch = LINK_REG.exec(line)) !== null) {
      const link = linkMatch[1];

      if (link.startsWith("../")) {
        const wholeMatchStart = linkMatch.index;
        const wholeMatchEnd = wholeMatchStart + linkMatch[0].length;
        const linkStart = wholeMatchStart + 2; // position after ](

        const isMd = link.endsWith(".md");
        const isImg = IMG_REG.test(link);

        if (isMd || isImg) {
          // Add prefix before the link
          const prefix = line.substring(linePrevIdx, linkStart);
          blogLine += prefix;
          issueLine += prefix;
        }

        if (isMd) {
          const issueMatch = link.match(ISSUE_LINK_REG);
          if (issueMatch) {
            const issueNum = issueMatch[1];
            // Convert internal links
            blogLine += `./${issueNum}`;
            issueLine += `https://github.com/lei4519/blog/issues/${issueNum}`;

            linePrevIdx = wholeMatchEnd;
          } else {
            throw new Error(
              `[Convert Error] Internal links without issue property: ${decodeURIComponent(link)} in File: ${title}`,
            );
          }
        } else if (isImg) {
          // Convert image paths
          const imageUrl = `https://raw.githubusercontent.com/lei4519/blog/main/notes/${link.substring(3)}`;
          blogLine += imageUrl;
          issueLine += imageUrl;

          linePrevIdx = wholeMatchEnd;
        }

        if (isMd || isImg) {
          // Add closing parenthesis
          blogLine += ")";
          issueLine += ")";
          continue;
        }

        throw new Error(
          `[Convert Error] Unknown relative path: ${decodeURIComponent(link)} in File: ${title}`,
        );
      }
    }

    // Add remaining part of the line
    const remain = line.substring(linePrevIdx);
    blogLine += remain;
    issueLine += remain;

    build({
      blog: blogLine,
      issue: issueLine,
    });
  }

  return {
    metaData: frontmatter,
    issueContent,
    blogContent,
  };
}
