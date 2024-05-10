mod convert;
mod utils;
use anyhow::Result;
use octocrab::Octocrab;

use crate::convert::convert;
use chrono::prelude::*;
use serde_json::{json, Value};
use std::{env, fs};
use wcloud::{WordCloud, WordCloudSize};

async fn get_change_files(oct: &Octocrab, pr_number: u64) -> Result<Vec<String>> {
    let files = oct.pulls("lei4519", "blog").list_files(pr_number).await?;
    let filenames: Vec<String> = files.items.iter().map(|f| f.filename.clone()).collect();

    let mut files = vec![];

    filenames.iter().for_each(|path| {
        if path.starts_with("docs/") && path.ends_with(".md") {
            files.push(format!("./{}", path));
        }
    });

    println!("Change Md Files:\n{:?}", files);

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

    let is_merge = env::args()
        .collect::<Vec<String>>()
        .get(1)
        .is_some_and(|x| x == "--merge");

    let pr_number: u64 = env::var("PR_NUMBER")
        .expect("cannot found PR_NUMBER")
        .parse()
        .unwrap();

    let oct = octocrab::OctocrabBuilder::default()
        .personal_token(
            env::var("GITHUB_TOKEN").expect("cannot found GITHUB_PERSONAL_ACCESS_TOKEN"),
        )
        .build()?;

    if is_merge {
        oct.pulls("lei4519", "blog").merge(pr_number).send().await?;
        return Ok(());
    }

    // 操作 issue
    let repo_issue = oct.issues("lei4519", "blog");

    // 上次编译的元信息
    let mut doc_meta_data: Value = serde_json::from_str(
        &fs::read_to_string(META_DATA_PATH).unwrap_or_else(|_| "{}".to_string()),
    )
    .unwrap_or_default();

    // 收集所有内容，后面统一提交修改
    let mut contents: Vec<(String, u64, Vec<String>, String, String, String)> = vec![];

    for path in get_change_files(&oct, pr_number).await? {
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
