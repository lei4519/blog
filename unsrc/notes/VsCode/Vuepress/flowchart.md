# vuepress-plugin-flowchart 语法

```md
@flowstart [vue, ant]
<!-- Your flowchart code here. -->
@flowend

[Variable]=>start: [Text]
start=>start: 开始

[Variable]=>end: [Text]
end=>end: 结束

[Variable]=>operation: [Text]
operation=>operation: 操作

[Variable]=>inputoutput: [Text]
inputoutput=>inputoutput: 输入输出

[Variable]=>subroutine: [Text]
subroutine=>subroutine: 子程序

[Variable]=>parallel: [Text]
[Variable](path1, direction)=>[Position]
[Variable](path2, direction)=>[Position]
parallel=>parallel: 并行任务
parallel(path1)=>process=>e
parallel(path2)=>e

[Variable]=>condition: [Text]
[Variable]([yesText])=>[Position]
[Variable]([noText])=>[Position]
condition=>condition: 条件
condition(yes)=>process=>e
condition(no)=>e

```
@flowstart

start=>start: 开始

end=>end: 结束

operation=>operation: 操作

inputoutput=>inputoutput: 输入输出

subroutine=>subroutine: 子程序

parallel=>parallel: 并行任务

condition=>condition: 条件

start->operation->condition
condition(yes)->inputoutput
condition(no)->subroutine
inputoutput->end
subroutine->end
@flowend