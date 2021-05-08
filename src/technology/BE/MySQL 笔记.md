# MySQL

## MySQL常用命令

```sql
# 查看当前所有的数据库
show databases
# 打开指定的库
use 表名
# 显示库的结构
desc 表名
# 显示当前库的所有表
show tables
# 显示其他库的所有表
show tables form 库名
```

## 查询类

### 基础查询
```sql
select 查询列表 from 表名
# 查询列表：表中的字段，常量，表达式，函数
```

#### 别名两种方式
```sql
select 字段 as 别名
select 字段 别名
```

#### 去重 distinct
```sql
select distinct 字段 from 表名
```
#### + 运算符
- 都为数值则相加
- 为字符串则转换为数值想加，转换失败则为0
- 为null，则结果为null

#### concat 字符拼接
```sql
select concat（字段1，字段2…）
```

### 条件查询
```sql
select 查询列表 from 表名 where 条件
```
#### 条件运算符
```sql
# <> 不等于
# <=> 安全等于，可以判断null
=，!=，>，<，≥，≤，<>，<=>
```
#### 逻辑运算符
```sql
and，or，not
```
#### 模糊查询
```sql
like，in，between and，is null
# % 通配符：任意多个字符，包含0个
# _ 通配符：任意单个字符
# \ 转义字符
```

### 排序查询
```sql
order by 排序字段 asc | desc，排序字段 asc | desc…
# asc升序 desc降序
# 默认升序
```

### 常见函数
#### 字符函数
```sql
lower，upper
concat
substr（字符串，起始索引1开始计数，长度）
length
instr
lpad，rpad
trim
replace
```

#### 数学函数
```sql
round
ceil
floor
mod
truncate 截断指定小数位
```

#### 日期函数
```sql
now 日期时间
curdate 日期
curtime 时间
year，month，day
str_to_date
date_format
```

#### 流程控制
```sql
if（条件，true，false）
case 条件
when 常量 then 语句
else 默认值
end
```

#### 单行函数
```sql
concat，length，ifnull
```

### 多表连接查询

> 要查询的字段涉及到多个表时

```sql
select 查询列表
from 表1 连接类型
join 表2
on 连接条件
where 筛选条件
```

#### 笛卡尔乘积
n × m 表1中的每一行对表2进行匹配
原因：没有有效的连接条件

#### 内连接 inner
查询交集的部分

- 等值连接 =
- 非等值连接
- 自连接
  - 给同一个表起不同的别名，使用别名进行字段区分

#### 左外连接/右外连接 left/right

- 左连左边的是主表，反之亦然
- 显示所有主表字段，次表没有显示null

#### 全外连接 full

#### 交叉连接 cross
笛卡尔乘积

### 子查询

出现在其他语句中的select语句

1. 子查询放在小括号中
2. 子查询放在条件的右侧

#### where having 后面
##### 标量子查询（单行子查询）
- 一般搭配单行操作符
- 大于/等于/小于/不等

##### 列子查询（多行子查询）
- 一般搭配多行操作符
- IN / NOT IN：（不）包含在列表中
- ANY / SOME：与某一个值比较
- ALL：与所有值比较

##### 行子查询（多列多行）
```sql
SELECT * FROM 表
WHERE (a, b)=( SELECT A, B FROM 表 )
```

#### select 后面
```sql
SELECT d.*, (SELECT COUNT(*) FROM 表1) FROM 表2
```

#### from后面
将查询的结果集作为外面语句的数据源

#### exists后面（相关子查询）
- exists(查询语句)：返回查询结果是否有值，布尔

### 分页查询
```sql
LIMIT offset, size
# offset 偏移量
# size 数量
```
### 联合查询

将多条查询语句合并成一个结果，查询多个表并且表之间没有联合关系时使用。

- 查询的列数必须一致
- 尽可能保证多条查询语句的每一列类型和顺序一致
- 默认自动去重，使用UNION ALL查询全部

```sql
查询语句1 UNION 查询语句2
```

## DML语言
### insert
```sql
insert into 表名(列1，列2) values (值1，值2)，values(值1，值2)
# 支持插入多行
# 支持子查询

insert into 表名 set 列=值, ...
# 插入值的类型要和列的类型保持一致或兼容
# 不能为null的列，不能为空
# 列的顺序可以调换
# 列的个数和值一致
# 可以没有列名，此时值的顺序和个数与表保持一致
```

### update
#### 单表
```sql
update 表名 set 列=值 where 筛选条件
```

#### 多表
```sql
update 表1 inner/left/right join 表2
on 连接条件
set 列=值
where 筛选条件
```

### delete
```sql
delete form 表名 where 筛选条件
```

#### 全部删除
```sql
truncate table 表名
```

## DDL
库和表的管理

### 库的管理

#### create
```sql
create database 库名
create database if not exists 库名
```

#### alter
```sql
rename database 旧库名 to 新库名
alter database 库名 character set 新字符集
```

#### drop
```sql
drop database 库名
drop database if exists 库名
```

### 表的管理
#### create
```sql
create table 表名 （
  列名 列类型 约束
）
```

#### alter
```sql
# 修改列名
alter table 表名 change cloumn 旧列名 新列名 类型
# 修改类型或约束
alter table 表名 modify cloumn 列名 类型
# 添加新列
alter table 表名add cloumn 列名 类型
# 删除列
alter table 表名drop cloumn 列名
# 修改表名
alter table 表名 rename to 新表名
```

#### drop
```sql
drop table 表名
```

#### 表的复制
```sql
# 复制表的结构
create table 新表名 like 表名
# 复制结构 + 内容
create table 新表名 查询语句
```

## 数据类型
### 数值型
#### 整型
```sql
tinyint # 1字节 -128～127 0-255
smallint # 2字节
mediumint # 3字节
int # 4字节
bigint # 8字节
```
- 默认有符号，设置无符号 unsigned，
- 设置zerofill，默认无符号，长度不足补零
- 超出范围插入临界值
#### 小数

> 所选择的类型越简单越好，保存数值的类型越小越好（节省空间）

- M：指定 整数 + 小数 的总位数，默认10
- D：指定小数位数，默认0

##### 浮点数
```sql
float(M, D) # 4字节
double(M, D) # 8字节
```
- 随着插入数值的精度来决定

##### 定点数
```sql
# 可简写为 DEC(M, D)
DECIMAL(M, D)
```
- 相较浮点数更加精确

### 字符型

#### 短文本
```sql
# M 字符数

# 固定长度，默认为1
char(M)

# 可变长度，不可为空
varchar(M)

# 假设字符数为10，不管内容有几个字符，char都会开辟10个空间。varchar则会根据内容长度开辟。
# 由于varchar计算长度，所以性能相比char会较慢

# 保存较短的二进制
binary
varbinary

# 枚举，只能插入指定的值，不区分大小写
ENUM(a, b, c)

# 集合，可以存储0～64个成员，和enum的区别在于插入时可以同时插入多个
set
```

#### 长文本
```sql
text
# 保存较长的二进制
blob
```

### 日期型
```sql
date
time
year

datetime # 8字节 1000～9999 不受时区影响
timestamp # 4字节 1970～2038 受时区影响
```

## 常见约束
限制表中的数据，为了保证表中数据的准确和可靠性

### 六大约束

#### NOT NULL
非空，保证该字段的值不能为空

#### DEFAULT
默认，保证该字段有默认值

#### PRIMARY KEY
主键，保证字段的唯一且不为空

#### UNIQUE
唯一，保证字段的唯一性

#### CHECK（MySQL不支持）
检查，如年龄范围的限制

#### FOREIGN KEY
外键，限制两个表的关系，保证该字段的值必须来自于主表的关联列的值

##### 特点
- 在从表设置外键关闭
- 从表的外键列和主表的关联列数据类型要保持一致或兼容
- 主表的关联列必须是一个key（主键或唯一）
- 插入数据时，先插入主表，再插入从表
- 删除数据时，先删除从表，再删除主表

##### 添加时机
  - 创建
  - 修改

##### 分类
  - 列级
    - 六大约束都可以写，但外键约束没有效果
  - 表级
    - 除了非空和默认，其他都支持

### 主键和唯一的区别


|     |唯一性|为空|允许多个|允许组合|
| --- | --- | --- | --- | --- |
|主键|✅|❌|至少有1个|✅，但不推荐|
|唯一|✅|✅|可以有多个|✅，但不推荐|

### 创建表时添加约束
```sql
# 列级约束
CREATE TABLE info {
  a int PRIMARY KEY,
  b varchar(20) NOT NULL,
  c char(1) CHECK(c='男' OR c='女'),
  d int UNIQUE,
  e int DEFAULT,
  f int FOREIGN KEY REFERENCES m(id)
}

# 表级约束
CREATE TABLE info {
  a int,
  b varchar(20),
  c char(1),
  d int,
  e int,
  f int，

  CONSTRAINT pk PRIMARY KEY(a),
  CONSTRAINT uq UNIQUE(b),
  CONSTRAINT ck CHECK(c='男' OR c='女'),
  CONSTRAINT fk FOREIGN KEY(f) REFERENCES m(id),
}

```
### 修改表时添加约束
```sql
# 列级约束
ALTER TABLE 表名 MODIFY COLUMN 列名 类型 约束

# 表级约束
ALTER TABLE 表名 ADD PRIMARY KEY(id)
```

### 修改表时删除约束
```sql
# 删除主键
ALTER TABLE 表名 DROP PRIMARY KEY

# 删除唯一
ALTER TABLE 表名 DROP INDEX 列名

# 删除外键
ALTER TABLE 表名 DROP FOREIGN KEY 列名
```

## 标识列

自增列，默认从1自增

- 一个表中只能有一个标识列
- 标识列的类型只能是数值型

```sql
CREATE TABLE info {
  a int PRIMARY KEY AUTO_INCREMENT
}
```

## 事务
一个或一组sql语句组成一个执行单元，这个执行单元要么全部执行，要么全部不执行。

### 事务的ACID属性

- Atomicity
  - 原子性是指事务是一个不可分割的工作单位，事务中的操作要么都发生，要么都不发生
- Consistency
  - 事务必须使数据库从一个一致性状态变换到另一个一致性状态
- Isolation
  - 一个事务的执行不能被其他事务干扰
- Durability
  - 事务一旦被提交，它对数据库中的改变就是永久性的

### 事务的创建

#### 隐式事务
```sql
insert
update
delete
```

#### 显式事务
前提：必须先禁用自动提交的功能

```sql
# 开启事务
set autocommit=0;
start transaction;

# 编写事务中的sql语句
select、insert、update、delete

# 结束事务
commit； # 提交事务
# OR
rollback; # 回滚事务
```
- DELETE 支持回滚操作
- TRUNCATE 不支持回滚操作


### 隔离级别
同时运行的多个事务，当这些事务访问数据库中的相同的数据时，如果没有采取必要的隔离机制，就会导致各种并发问题：
- 脏读：T1读取了T2*更新但还没提交*的数据后，若T2回滚，T1读取的内容就是无效的
- 不可重复读：T1读取了一个字段，T2更新该字段后，T1再次读取，值就不同了
- 幻读：T1读取了字段后，T2执行了插入动作后，T1再次读取就会多出几行

|   |脏读|不可重复读|幻读|
| --- | --- | --- | --- |
|read uncommitted|✅|✅|✅|
|read committed|❌|✅|✅|
|repeatable read|❌|❌|✅|
|serializable|❌|❌|❌|

- MySQL 中默认 repeatable read
- Oracle 中默认 read committed

#### 查看隔离级别
```sql
select @@tx_isolation
```

#### 设置当前MySQL连接的隔离级别
```sql
set transaction isolation level read committed;
```
#### 设置数据库系统全局的隔离级别
```sql
set global transaction isolation level read committed;
```

### 回滚点
搭配 rollback 使用，回滚至某个标记点


```sql
set autocommit=0;
start transaction;

select、insert、update、delete
savepoint a; # 设置节点
select、insert、update、delete

rollback to a; # 回滚事务
```

## 视图
虚拟表，行和列的数据来自于查询中使用的表，在使用中动态生成。只保存sql逻辑，不保存查询结果。

### 应用场景
- 多个地方用到同样的查询结果
- 查询结果使用的sql语句较复杂

### 创建视图
```sql
create view 视图名
as
查询语句
```
### 修改视图
```sql
# 创建或替换
create or replace view 视图名
as
查询语句

alter view 视图名
as
查询语句
```
### 删除视图
```sql
DROP VIEW 视图名1，视图名2...
```

## 变量

### 系统变量
```sql
# 全局变量 global
# 会话变量 session
# 默认 session

show global variables;
show global variables like '%char%';
select @@global.系统变量名;
set global 系统变量名 = 值
set @@global.系统变量名 = 值
```
- 会话变量仅只针对于当前的会话生效

### 自定义变量
```sql
# 用户变量，作用域同会话变量
# 声明和更新
set @用户变量名=值
set @用户变量名:=值
select @用户变量名:=值
select 字段 into 变量名 from 表

# 局部变量，作用域定义它的begin end中
declare 变量名 类型
declare 变量名 类型 default 值

set 局部变量名=值
set 局部变量名:=值
select 局部变量名:=值
select 字段 into 变量名 from 表
```

## 存储过程
一组预先编译好的sql语句集合，可以有0个或多个返回值
1. 提高代码的重复性
2. 简化操作
3. 减少编译次数并且减少和数据库服务器的连接次数



```sql
# 参数模式 参数名 类型
create procedure 存储过程名（参数列表）
begin
  sql 语句
end

# 调用语法
CALL 存储过程名（传参）

# 删除
drop procedur 存储过程名

# 查看
show create procedure 存储过程名
```

### 参数模式
- IN：可以作为输入，需要调用方传入值
- OUT：可以作为输出，返回值
- INOUT

### 结束标记
由于sql语句后面都会带有 `;`，所以整个结构体需要使用其他的结束标记

使用 `delimit $` 进行标记配置

## 函数
有且仅有一个返回值

```sql
# 参数名 参数类型
create function 函数名（参数列表）returns 返回类型
begin
  函数体
  return 值
end

# 调用语法
select 函数名（参数列表）

# 查看函数
show create function 函数名

# 删除
drop function 函数名
```

## 流程控制
### 分支结构
```sql
# 如果表达式1成立，返回表达式2的值，否则返回表达式3的值
# 可以应用在任何地方
IF(表达式1，表达式2，表达式3)

# 只能放在begin end中
if 条件1 then 语句
elseif 条件2 then 语句2
end if

# case then 后面是值的时候可以放在任何地方，then后面是语句的时候只能放在begin end中
# 语法1
case 变量｜表达式｜字段
when 值1 then 返回值
when 值1 then 返回值
...
else 返回值
end case

# 语法2
case
when 判断条件 then 返回值
when 判断条件 then 返回值
...
else 返回值
end case
```

### 循环结构
```sql
/*
  iterate: 类似 continue
  leave：类似 break
*/

标签：while 条件 do
  循环体
end while 标签

标签：loop
  循环体
end loop 标签

标签：repeat
  循环体
until 结束循环的条件
end repeat 标签
```

