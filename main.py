#!/usr/bin/python
# -*- coding: utf-8 -*-

from functools import reduce
from typing import Tuple
from github import Github
from github.Issue import Issue
from github.Label import Label
from github.PaginatedList import PaginatedList
from github.Repository import Repository
import os
import time
import codecs
from word_cloud import WordCloudGenerator

user: Github
username: str
blogrepo: Repository
cur_time: str
blogname: str


def login():
    global user, username, blogname, blogrepo
    github_repo_env = os.environ.get("GITHUB_REPOSITORY")

    username = github_repo_env[0 : github_repo_env.index("/")]
    blogname = github_repo_env[github_repo_env.index("/") :]
    password = os.environ.get("GITHUB_TOKEN")
    user = Github(username, password)
    blogrepo = user.get_repo(os.environ.get("GITHUB_REPOSITORY"))


def bundle_summary_section():
    global blogrepo
    global cur_time
    global user
    global username
    global blogname

    # word cloud
    wordcloud_image_url = WordCloudGenerator(blogrepo).generate()

    list_by_labels_section = """<img src="%s" title="词云" alt="词云">""" % (
        wordcloud_image_url
    )

    summary_section = """
<p align='center'>
    <img src="https://badgen.net/github/issues/{0}{1}"/>
    <img src="https://badgen.net/badge/last-commit/{2}"/>
</p>

{3}
    """.format(username, blogname, cur_time, list_by_labels_section)

    # <img src="https://badgen.net/github/forks/{0}/{1}"/>
    # <img src="https://badgen.net/github/stars/{0}/{1}"/>
    # <img src="https://badgen.net/github/watchers/{0}/{1}"/>

    return summary_section


def format_issue(issue: Issue):
    return "<li><a href='%s'>%s</a></li>\n" % (
        # issue.created_at.strftime("%Y-%m-%d"),
        issue.html_url,
        issue.title,
    )


def update_readme_md_file(contents):
    with codecs.open("README.md", "w", encoding="utf-8") as f:
        f.writelines(contents)
        f.flush()
        f.close()


def bundle_list_by_labels_section():
    global blogrepo
    global user
    global username
    global blogname

    label_with_issues = sorted(
        map(
            lambda label: (label, blogrepo.get_issues(labels=[label], state="open")),
            blogrepo.get_labels(),
        ),
        key=lambda x: x[1].totalCount,
        reverse=True,
    )

    def get_content(string: str, item: Tuple[Label, PaginatedList[Issue]]):
        (label, issues) = item
        count = issues.totalCount

        if count == 0:
            return string

        content = reduce(
            lambda s, issue: "{0}{1}".format(s, format_issue(issue)), issues, ""
        )

        return """
%s

## %s

<details open>

<summary>[%s 篇]</summary>

<ul>
%s
</ul>

</details>""" % (string, label.name, count, content)

    return reduce(get_content, label_with_issues, "")


def execute():
    global cur_time
    # common
    cur_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

    # 1. login & init rope
    login()

    # 2. summary section
    summary_section = bundle_summary_section()
    print(summary_section)

    # 3. list by labels section
    list_by_labels_section = bundle_list_by_labels_section()
    print(list_by_labels_section)

    contents = [summary_section, list_by_labels_section]
    update_readme_md_file(contents)

    print("README.md updated successfully!!!")


if __name__ == "__main__":
    execute()
