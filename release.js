let commitMsg = process.argv[2];

if (!commitMsg) {
  console.log("请输入git提交信息：");
} else {
  sh()
}
function sh() {
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
  subProcess.stdin.write(`yarn build
  git add .
  git commit -m ${commitMsg}
  git push`);
  subProcess.stdin.end();
}
process.stdin.on("data", (data) => {
  data = data.toString();
  if (!data.toString().trim()) {
    console.log("请输入git提交信息：");
  } else {
    commitMsg = data;
    sh()
  }
});
