import { Octokit } from '@octokit/rest';
import { convert } from './convert.js';
import * as fs from 'fs/promises';
import { existsSync } from 'fs';
import * as path from 'path';

// Word cloud library - using d3-cloud
// import * as d3Cloud from 'd3-cloud';
// import { createCanvas } from 'canvas';

type MetaDataMap = Record<string, MetaData>;

interface MetaData {
  title?: string;
  created?: string;
  tags?: string;
  issue?: string;
  [key: string]: string | undefined;
}

interface ContentItem {
  path: string;
  issueId: number;
  labels: string[];
  title: string;
  issueContent: string;
  blogContent: string;
}

function getChangeNoteFiles(): string[] {
  const content = process.env.CHANGED_FILES;
  if (!content) {
    throw new Error('cannot found CHANGED_FILES');
  }

  const cleanContent = content.replace(/\\/g, '');
  const files: string[] = [];

  cleanContent.split('\n').forEach((line) => {
    if (line.startsWith('notes/') && line.endsWith('.md')) {
      files.push(`./${line}`);
    }
  });

  console.log('Change Files:\n', files);
  return files;
}

const META_DATA_PATH = './assets/meta_data.json';

function getReadmeContent(docMetaData: MetaDataMap): [string, string] {
  const list: Array<[string, string, string, string]> = [];

  for (const [issue, meta] of Object.entries(docMetaData)) {
    list.push([
      issue,
      meta.title || '',
      meta.created || '',
      meta.tags || ''
    ]);
  }

  // Sort by date descending
  list.sort((a, b) => {
    const dateA = new Date(a[2]);
    const dateB = new Date(b[2]);
    return dateB.getTime() - dateA.getTime();
  });

  // Get current timestamp
  const now = new Date();
  const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);

  // Blog README (MDX format)
  let blogReadme = `---
title: Home
---

import Image from "next/image"
import Link from "next/link"

<div className="flex justify-center gap-4">
  <img src="https://badgen.net/github/issues/lei4519/blog" />
  <img src="https://badgen.net/badge/last-commit/${timestamp}" />
</div>

<Image
  src="https://github.com/lei4519/blog/raw/main/assets/wordcloud.webp"
  title="词云"
  alt="词云"
  width="1536"
  height="512"
/>

<ul>

`;


  // Issue README (Markdown format)
  let issueReadme = `
<p align='center'>
    <img src="https://badgen.net/github/issues/lei4519/blog"/>
    <img src="https://badgen.net/badge/last-commit/${timestamp}"/>
</p>

<img src="assets/wordcloud.webp" title="词云" alt="词云">

`;

  for (const [issue, title, created, _tags] of list) {
    blogReadme += `<li className="flex justify-between gap-2"><Link href="./docs/${issue}">${title}</Link><time className="text-sm flex-none font-mono text-gray-500">${created}</time></li>\n`;
    issueReadme += `- [${title}](https://github.com/lei4519/blog/issues/${issue}) -- ${created}\n`;
  }

  blogReadme += '</ul>';

  return [blogReadme, issueReadme];
}

async function genWordCloud(docMetaData: MetaDataMap): Promise<void> {
  let text = '';

  for (const meta of Object.values(docMetaData)) {
    if (meta.tags) {
      const tags = meta.tags.replace(/,/g, ' ');
      text += ' ' + tags;
    }
  }

  const excludeTags = [
    'FE',
    'Explanation',
    'HowTo',
    'Tutorials',
    'Reference',
    'TODO'
  ];

  for (const tag of excludeTags) {
    text = text.replace(new RegExp(tag, 'g'), '');
  }

  // Generate word cloud using d3-cloud
  // Split text into words and count frequency
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const wordCount = new Map<string, number>();

  for (const word of words) {
    wordCount.set(word, (wordCount.get(word) || 0) + 1);
  }

  const wordData = Array.from(wordCount.entries())
    .map(([text, size]) => ({ text, size: size * 10 }))
    .sort((a, b) => b.size - a.size)
    .slice(0, 100); // Limit to top 100 words

  console.log("wordData", wordData);
}

async function main(): Promise<void> {
  console.log('Token:', process.env.GITHUB_TOKEN ? "has token" : "no token");
  const changeNoteFiles = getChangeNoteFiles();

  if (changeNoteFiles.length === 0) {
    console.log('No files changed, exit!');
    return;
  }

  // Load previous metadata
  let docMetaData: MetaDataMap = {};
  try {
    if (existsSync(META_DATA_PATH)) {
      const metaContent = await fs.readFile(META_DATA_PATH, 'utf-8');
      docMetaData = JSON.parse(metaContent);
    }
  } catch (error) {
    console.warn('Could not load metadata, starting fresh', error);
    docMetaData = {};
  }

  // Collect all changes
  const contents: ContentItem[] = [];

  for (const filePath of changeNoteFiles) {
    console.log('convert file:', filePath);

    const content = await fs.readFile(filePath, 'utf-8');

    const fields = filePath.split('/');
    const issueId = fields.at(-2);
    const fileName = fields.at(-1);
    const title = fileName?.substring(0, fileName.length - 3);

    if (!issueId || !fileName || !title) {
      throw new Error(`invalid file path: ${filePath}`);
    }

    const { metaData, issueContent, blogContent } = convert(title, content);

    // Validate issue ID matches
    if (issueId !== metaData.issue) {
      throw new Error(`expect issue number ${issueId}, got ${metaData.issue}`);
    }

    docMetaData[issueId] = metaData;

    const issueIdNum = Number.parseInt(issueId, 10);

    if (Number.isNaN(issueIdNum)) {
      throw new Error(`issue_id not a number: ${issueId}`);
    }

    const labels = (metaData.tags || '')
      .split(',')
      .map(s => s.trim())
      .filter(s => !!s);

    contents.push({
      path: filePath,
      issueId: issueIdNum,
      labels,
      title,
      issueContent,
      blogContent
    });
  }

  // Update metadata
  await fs.writeFile(META_DATA_PATH, JSON.stringify(docMetaData, null, 2));

  // Generate word cloud
  // await genWordCloud(docMetaData);

  // Generate README files
  const [blog, issue] = getReadmeContent(docMetaData);
  await fs.writeFile('./content/docs/index.mdx', blog);
  await fs.writeFile('./README.md', issue);


  const githubToken = process.env.GITHUB_TOKEN;
  !githubToken && console.warn('cannot found GITHUB_TOKEN, update issue will be skipped')
  // Initialize Octokit
  const octokit = githubToken ? new Octokit({
    auth: githubToken
  }) : null;


  // Update GitHub issues
  for (const { issueId, labels, title, issueContent, blogContent } of contents) {
    if (octokit) {
      await octokit.issues.update({
        owner: 'lei4519',
        repo: 'blog',
        issue_number: issueId,
        title,
        body: issueContent,
        labels
      });
    }

    // Write blog content
    const blogPath = `./content/docs/${issueId}.md`;
    await fs.writeFile(blogPath, blogContent);
  }

  console.log('Convert success!');
}

// Run main
main()

