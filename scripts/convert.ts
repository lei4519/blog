type MetaData = Record<string, string>;

interface ConvertResult {
  metaData: MetaData;
  issueContent: string;
  blogContent: string;
}

// Convert markdown content for both blog and issue formats
export function convert(title: string, content: string): ConvertResult {
  // Separate content for blog and issue - pre-allocate capacity
  let blogContent = "";
  let issueContent = "";

  const metaData: MetaData = {};

  // Process file curLine() by curLine()
  const lines = content.trim().split("\n");

  let row = 0;

  const build = (props: {
    blog?: string;
    issue?: string;
  } | string) => {
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
  }

  const moveDown = () => {
    row++;
  }

  const buildAndMoveDown = (props: Parameters<typeof build>[0]) => {
    build(props)
    moveDown();
  }

  const isEnd = () => row >= lines.length;
  const nextLine = () => lines[row + 1];
  const curLine = () => lines[row];

  while (!isEnd()) {


    // Empty lines pass through
    if (curLine().trim() === "") {
      buildAndMoveDown(curLine());
      continue;
    }

    // metadata block
    if (row === 0 && curLine().trim() === "---") {
      // Handle meta block delimiters (---)
      // Only first non-empty curLine() can start meta block
      buildAndMoveDown({
        blog: curLine(), // --- start
      })

      // find until end or ---
      while (!isEnd() && curLine().trim() !== "---") {
      // Inside meta block - parse key-value pairs
        const parts = curLine().split(":");
        let key = parts[0]?.trim() || "";
        let val = parts.slice(1).join(":").trim();

        // ensure val is not empty
        if (!val) {
          // list
          if (nextLine().trim().startsWith('-')) {
            buildAndMoveDown({
              blog: curLine(), // tags:
            });

            const v = []

            while (curLine().trim().startsWith('-')) {
              const item = curLine().trim().slice(1).trim()

              buildAndMoveDown({
                blog: curLine(),
              });

              v.push(item);
            }

            val = v.join(",");
          } else {
            moveDown();

            while (!isEnd() && !curLine().trim()) {
              moveDown();
            }

            // wrap
            if (!curLine().includes(':')) {
              val = curLine().trim();
              buildAndMoveDown({
                blog: `${key}: "${val}"`,
              })
              metaData[key] = val;
              continue;
            }
          }
        } else if (key == "created") {
          // Format created date (strip time portion)
          val = val.substring(0, 10);
          buildAndMoveDown({
            blog: `${key}: ${val}`,
          });
        } else if (key === "issue") {
          // Remove quotes from issue number
          val = val.replace(/"/g, "");
          buildAndMoveDown({
            blog: `${key}: ${val}`,
          });
        } else {
          buildAndMoveDown({
            blog: curLine(),
          });
        }

        metaData[key] = val;
      }

      if (isEnd()) {
        throw new Error(
          `[Convert Error] Meta block not found in File: ${title}`,
        );
      }

      // Add default meta data for blog if missing
      const addMetas: Array<[string, string]> = [
        ["title", title],
        ["description", title],
      ];

      for (const [k, v] of addMetas) {
        if (!metaData[k]) {
          build({
            blog: `${k}: ${v}`,
          });

          metaData[k] = v;
        }
      }

      if (metaData.created) {
      // For issue content, add creation time
        build({
          issue: `<p align="right"><time>${metaData.created}</time></p>`,
        });
      }

      buildAndMoveDown({
        blog: curLine()
      }); // --- end token

      continue;
    }
    // Regex patterns - defined at module level like Rust's Lazy<Regex>
    const BLOCK_QUOTE_REG = /^(>\s+\[!)([^\]]+)\]/;
    // Handle block quotes like > [!TIP]
    const blockQuoteMatch = BLOCK_QUOTE_REG.exec(curLine());
    if (blockQuoteMatch) {
      const tag = blockQuoteMatch[2].trim();

      buildAndMoveDown({
        blog: `> **${tag}**  \n>  `,
        issue: `${blockQuoteMatch[1]}${tag}${curLine().substring(blockQuoteMatch[1].length + blockQuoteMatch[2].length)}`
      })
      continue;
    }

    // Handle links - process all links in the curLine()
    let linePrevIdx = 0;
    let blogLine = "";
    let issueLine = "";

    let linkMatch: RegExpExecArray | null;

    const LINK_REG = /\]\(([^)]*)\)/g;
    const ISSUE_LINK_REG = /^\.\.\/(\d+)\//;
    const IMG_REG = /\.(jpg|png|svg|jpeg|webp)$/;

    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    while ((linkMatch = LINK_REG.exec(curLine())) !== null) {
      const link = linkMatch[1];

      if (link.startsWith("../")) {
        const wholeMatchStart = linkMatch.index;
        const wholeMatchEnd = wholeMatchStart + linkMatch[0].length;
        const linkStart = wholeMatchStart + 2; // position after ](
        const linkEnd = linkStart + link.length;

        const isMd = link.endsWith(".md");
        const isImg = IMG_REG.test(link);

        if (isMd || isImg) {
          // Add prefix before the link
          const prefix = curLine().substring(linePrevIdx, linkStart);
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

    // Add remaining part of the curLine()
    const remain = curLine().substring(linePrevIdx);
    blogLine += remain;
    issueLine += remain;

    buildAndMoveDown({
      blog: blogLine,
      issue: issueLine
    });
  }

  return {
    metaData,
    issueContent,
    blogContent,
  };
}
