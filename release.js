const { spawnSync } = require('child_process')
function sh(commitMsg) {
  spawnSync(`yarn build
git add .
ls
git commit -m "${commitMsg}"
git push
  `, {
    shell: true,
    stdio: 'inherit'
  })
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
