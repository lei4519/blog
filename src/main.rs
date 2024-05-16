mod convert;
mod test;
use anyhow::Result;

use crate::convert::convert;
use chrono::prelude::*;
use serde_json::{json, Value};
use std::{env, fs};
use wcloud::{WordCloud, WordCloudSize};

fn get_change_files() -> Result<Vec<String>> {
    let content = env::var("CHANGED_FILES")
        .expect("cannot found CHANGED_FILES")
        .replace('\\', "");

    let mut files = vec![];

    content.split('\n').for_each(|line| {
        if line.starts_with("docs/") && line.ends_with(".md") {
            files.push(format!("./{}", line));
        }
    });

    println!("Change Files:\n{:#?}", files);

    Ok(files)
}

// static DIR_PATH: &str = "./docs";
static META_DATA_PATH: &str = "./assets/meta_data.json";

fn get_readme_content(doc_meta_data: &Value) -> (String, String) {
    let mut list = vec![];

    if let Some(meta_data) = doc_meta_data.as_object() {
        for (issue, meta) in meta_data.iter() {
            list.push((
                issue,
                meta["title"].as_str().unwrap(),
                meta["created"].as_str().unwrap(),
                meta["tags"].as_str().unwrap(),
            ))
        }
    }

    list.sort_by(|a, b| {
        let a = NaiveDate::parse_from_str(a.2, "%Y-%m-%d").unwrap();
        let b = NaiveDate::parse_from_str(b.2, "%Y-%m-%d").unwrap();

        b.cmp(&a)
    });

    let header = format!(
        r#"
<p align='center'>
    <img src="https://badgen.net/github/issues/lei4519/blog"/>
    <img src="https://badgen.net/badge/last-commit/{}"/>
</p>

<img src="assets/wordcloud.png" title="词云" alt="词云">

"#,
        Local::now().format("%Y-%m-%d %H:%M:%S")
    );

    // 发布到 blog 和 issue 中的文章格式不一样
    let mut blog_readme = String::from(&header);
    let mut issue_readme = String::from(&header);

    for (issue, title, created, _tags) in list.iter() {
        // let labels: Vec<String> = tags.split(',').map(|s| s.to_string()).collect();
        // let blog_tags = labels
        //     .iter()
        //     .map(|s| format!("#[{}](./tags?name={})", s, s))
        //     .collect::<Vec<String>>()
        //     .join("，");

        blog_readme.push_str(&format!("- [{}](./{}) -- {}\n", title, issue, created));
        issue_readme.push_str(&format!(
            "- [{}](https://github.com/lei4519/blog/issues/{}) -- {}\n",
            title, issue, created
        ));
    }

    (blog_readme, issue_readme)
}

fn gen_word_cloud(doc_meta_data: &Value) {
    let mut text = String::from("");

    if let Some(meta_data) = doc_meta_data.as_object() {
        for (_, meta) in meta_data.iter() {
            let tags = meta["tags"].as_str().unwrap().replace(',', " ");
            text.push(' ');
            text.push_str(&tags);
        }
    }

    let wordcloud = WordCloud::default().with_rng_seed(0);

    let size = WordCloudSize::FromDimensions {
        width: 1920,
        height: 400,
    };

    let exclude_tags = ["FE", "Explanation", "HowTo", "Tutorials", "Reference"];

    exclude_tags.iter().for_each(|tag| {
        text = text.replace(tag, "");
    });

    let wordcloud_image = wordcloud.generate_from_text(&text, size, 1.0);

    wordcloud_image
        .save("./assets/wordcloud.png")
        .expect("Unable to save image");
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let is_dry = env::args()
        .collect::<Vec<String>>()
        .get(1)
        .is_some_and(|x| x == "--dry");

    let oct = octocrab::OctocrabBuilder::default()
        .personal_token(
            env::var("GITHUB_TOKEN").expect("cannot found GITHUB_PERSONAL_ACCESS_TOKEN"),
        )
        .build()?;

    // 操作 issue
    let repo_issue = oct.issues("lei4519", "blog");

    // 上次编译的元信息
    let mut doc_meta_data: Value = serde_json::from_str(
        &fs::read_to_string(META_DATA_PATH).unwrap_or_else(|_| "{}".to_string()),
    )
    .unwrap_or_default();

    // 收集所有内容，后面统一提交修改
    let mut contents: Vec<(String, u64, Vec<String>, String, String, String)> = vec![];

    for path in get_change_files()? {
        println!("convert file: {:#?}", path);

        let content = fs::read_to_string(&path)?;

        let fields: Vec<_> = path.split('/').collect();
        let issue_id = *fields.get(fields.len() - 2).expect("expect issue number");
        let title = *fields.last().expect("expect title, missing issue number");
        let title = &title[..title.len() - 3];

        let (meta_data, issue_content, blog_content) = convert(title.to_string(), content);

        assert_eq!(
            issue_id,
            meta_data.get("issue").expect("expect issue number")
        );

        doc_meta_data[issue_id] = json!(meta_data);

        let issue_id: u64 = issue_id.parse().expect("issue_id not a number");

        let labels: Vec<String> = meta_data
            .get("tags")
            .unwrap_or(&"".to_string())
            .split(',')
            .map(|s| s.to_string())
            .collect();

        contents.push((
            path.to_string(),
            issue_id,
            labels,
            title.to_string(),
            issue_content,
            blog_content,
        ));
    }

    if !is_dry {
        // 更新元信息
        fs::write(META_DATA_PATH, doc_meta_data.to_string())?;

        gen_word_cloud(&doc_meta_data);

        let (blog, issue) = get_readme_content(&doc_meta_data);

        fs::write("./index.md", blog)?;
        fs::write("./README.md", issue)?;

        for (path, issue_id, labels, title, issue_content, blog_content) in contents {
            // 修改 issue 内容
            repo_issue
                .update(issue_id)
                .title(&title)
                .body(&issue_content)
                .labels(&labels)
                .send()
                .await?;

            // 写入文件
            fs::write(path, blog_content).unwrap();
        }
    }

    println!("Convert success!");

    Ok(())
}
