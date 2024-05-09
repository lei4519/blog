use core::panic;
use once_cell::sync::Lazy;
use regex::Regex;
use std::collections::HashMap;

// 转换内容
pub fn convert(title: String, content: String) -> (HashMap<String, String>, String, String) {
    // 发布到 blog 和 issue 中的文章格式不一样
    let mut blog_content = String::with_capacity(content.capacity() + 100);
    let mut issue_content = String::with_capacity(content.capacity() + 100);

    let mut in_meta_block = false;

    let mut meta_data: HashMap<String, String> = HashMap::new();
    let mut prev_meta_key = String::from("");

    // 有内容的行号，用来判断 meta 是否存在
    let mut has_content_line_number = 0;

    let mut add_blog_line = |line: &str| {
        blog_content.push_str(line);
        blog_content.push('\n');
    };

    let mut add_issue_line = |line: &str| {
        issue_content.push_str(line);
        issue_content.push('\n');
    };

    static BLOCK_QUOTE_REG: Lazy<Regex> = Lazy::new(|| Regex::new(r"^>\s+\[!([^]]+)]").unwrap());
    static LINK_REG: Lazy<Regex> = Lazy::new(|| Regex::new(r"\]\(([^)]*)\)").unwrap());
    static ISSUE_LINK_REG: Lazy<Regex> = Lazy::new(|| Regex::new(r"^..\/(\d+)\/").unwrap());
    static IMG_REG: Lazy<Regex> = Lazy::new(|| Regex::new(r"\.(jpg|png|svg|jpeg)$").unwrap());

    // 处理文件内容
    for line in content.lines() {
        if line.trim().is_empty() {
            add_blog_line(line);
            add_issue_line(line);
            continue;
        }

        has_content_line_number += 1;

        if line.trim().eq("---") {
            // 处于实际上的第一行才会被视为 meta data
            // meta block 开始
            if has_content_line_number == 1 {
                in_meta_block = true;
                add_blog_line(line);
                continue;
            }

            // meta block 结束
            if in_meta_block {
                in_meta_block = false;

                // blog_content，添加缺省的 meta data
                {
                    let add_metas = [("title", title.clone()), ("description", title.clone())];

                    add_metas.iter().for_each(|(k, v)| {
                        if !meta_data.contains_key(*k) {
                            add_blog_line(&format!("{k}: {v}"));
                            meta_data.insert(k.to_string(), v.to_string());
                        }
                    });

                    let has_permalink = meta_data.contains_key("permalink");

                    if !has_permalink {
                        if let Some(issue) = meta_data.get("issue") {
                            add_blog_line(&format!("permalink: \"{}\"", issue));
                        }
                    }

                    add_blog_line(line);
                }

                // issue_content，添加创建时间即可
                if let Some(created) = meta_data.get("created") {
                    add_issue_line(&format!("<p align=\"right\"><time>{}</time></p>", created))
                }

                continue;
            }
        }

        // 处于 meta block 中
        if in_meta_block {
            let data = line
                .splitn(2, ':')
                .map(|v| String::from(v.trim()))
                .collect::<Vec<String>>();

            let mut key = data.first().unwrap().to_owned();
            let mut val = data.get(1).unwrap_or(&"".to_string()).to_owned();

            // 处理 meta data 中的 tags
            if val.is_empty() && key.starts_with('-') && !prev_meta_key.is_empty() {
                let cur_val = key.get(1..).unwrap().trim().to_string();

                val = if let Some(prev_val) = meta_data.get(&prev_meta_key) {
                    if prev_val.is_empty() {
                        cur_val
                    } else {
                        format!("{},{}", prev_val, cur_val)
                    }
                } else {
                    cur_val
                };
                key = prev_meta_key.clone();
            }

            prev_meta_key = key.clone();

            if key == "created" {
                // 格式为 %Y-%m-%dT%H:%M，丢掉时间
                val = val[0..10].to_string();
                add_blog_line(&format!("{}: {}", &key, &val));
            } else if key == "issue" {
                val = val.replace('"', "");
                add_blog_line(&format!("{}: {}", &key, &val));
            } else {
                add_blog_line(line);
            }

            meta_data.insert(key, val);
            continue;
        }

        // 处理 > [!TIP]
        if let Some(caps) = BLOCK_QUOTE_REG.captures(line) {
            add_blog_line(&format!("> **{}**  \n>  ", &caps[1].trim()));
            add_issue_line(line);
            continue;
        }

        // 处理链接
        let mut line_prev_idx = 0;
        let mut blog_line = String::with_capacity(line.len());
        let mut issue_line = String::with_capacity(line.len());

        LINK_REG.captures_iter(line).for_each(|link_caps| {
            let link = &link_caps[1];

            if link.starts_with("../") {
                let line_whole_match = link_caps.get(0).unwrap();
                let link_cap = link_caps.get(1).unwrap();

                let is_md = &link[link.len() - 3..] == ".md";
                let is_img = IMG_REG.is_match(link);

                if is_md || is_img {
                    let prefix = &line.get(line_prev_idx..link_cap.start()).unwrap();
                    // 先把要处理之外的前面部分加进去
                    blog_line.push_str(prefix);
                    issue_line.push_str(prefix);
                }

                if is_md {
                    if let Some(issue_caps) = ISSUE_LINK_REG.captures(link) {
                        // 处理要修改的部分
                        // &issue_caps[1] -> ../attachments/IMG_3655.jpg
                        // 全部
                        blog_line.push_str(&format!("./{}", &issue_caps[1]));
                        issue_line.push_str(&format!(
                            "https://github.com/lei4519/blog/issues/{}",
                            &issue_caps[1]
                        ));

                        line_prev_idx = line_whole_match.end();
                    } else {
                        panic!(
                            "[Convert Error] Internal links without issue property: {} in File: {}",
                            url_escape::decode(link),
                            &title,
                        );
                    }
                } else if is_img {
                    // 处理要修改的部分
                    // &issue_caps[1] -> ../attachments/IMG_3655.jpg
                    let link = format!(
                        "https://raw.githubusercontent.com/lei4519/blog/main/docs/{}",
                        &link_cap.as_str()[3..]
                    );
                    blog_line.push_str(&link);
                    issue_line.push_str(&link);

                    line_prev_idx = line_whole_match.end();
                }

                if is_md || is_img {
                    // 再把处理之外的后面补上
                    blog_line.push(')');
                    issue_line.push(')');
                    return;
                }

                panic!(
                    "[Convert Error] Unkonw relative path: {:#?} in File: {}",
                    url_escape::decode(link),
                    &title
                );
            }
        });

        // 剩余的部分
        let remain = &line[line_prev_idx..];
        blog_line.push_str(remain);
        issue_line.push_str(remain);

        add_blog_line(&blog_line);
        add_issue_line(&issue_line);
    }

    (meta_data, issue_content, blog_content)
}
