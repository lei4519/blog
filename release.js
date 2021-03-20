const shell = require('shelljs')
function sh(commitMsg) {
  shell.exec('vuepress build src')
  shell.exec('git add .')
  shell.exec(`git commit -m "${commitMsg}"`)
  shell.exec('git push')

  shell.echo('打包完成')
  shell.exit(0)
}

if (!process.argv[2]) {
  process.stdin.on('data', data => {
    data = data.toString()
    if (!data.toString().trim()) {
      console.log('请输入git提交信息：')
    } else {
      sh(data)
    }
  })
  console.log('请输入git提交信息：')
} else {
  sh(process.argv[2])
}
