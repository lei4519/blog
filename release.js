function sh(commitMsg) {
  const spawn = require("child_process").spawn;
  const subProcess = spawn("bash");
  function onData(data) {
    process.stdout.write(data);
  }
  subProcess.on("error", function() {
    console.log("error");
    console.log(arguments);
  });
  subProcess.stdout.on("data", onData);
  subProcess.stderr.on("data", onData);
  subProcess.on("close", (code) => {
    console.log(`打包完成：${code}`);
    process.exit(code)
  });
  subProcess.stdin.write(`vuepress build src
  git add .
  git commit -m "${commitMsg}"
  git push`);
  subProcess.stdin.end();
}

if (!process.argv[2]) {
  process.stdin.on("data", (data) => {
    data = data.toString();
    if (!data.toString().trim()) {
      console.log("请输入git提交信息：");
    } else {
      sh(data)
    }
  });
  console.log("请输入git提交信息：");
} else {
  sh(process.argv[2])
}
