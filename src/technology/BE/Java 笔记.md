# Java

![image-20210510191024159](https://gitee.com/lei451927/picture/raw/master/images/image-20210510191024159.png)

## 基础概念

### JDK（Java Development Kit）

`JDK` 是提供给 Java 开发人员使用的，其中包含了 Java 的开发工具，也包括了 JRE。所以安装了 JDK，就不用在单独安装 JRE 了

### JRE（Java Runtime Environment）

包括 Java 虚拟机(JVM Java Virtual Machine)和 Java 程序所需的核心类库等，如果想要运行一个开发好的 Java 程序，计算机中只需要安装 JRE 即可。

### JVM

JVM 是一个虚拟的计算机，具有指令集并使用不同的存储区域。负责执行指令，管理数据、内存、寄存器

## 基础语法

### 命名规范

- 包名：多单词组成时所有字母都小写：xxxyyyzzz
- 类名、接口名：多单词组成时，所有单词的首字母大写：XxxYyyZzz
- 变量名、方法名：多单词组成时，第一个单词首字母小写，第二个单词开始每个单词首字母大写：xxxYyyZzz
- 常量名：所有字母都大写。多单词时每个单词用下划线连接：XXX_YYY_ZZZ

### 数据类型

#### 整数

Java 的整型常量默认为 `int ` 型，声明 `long` 型常量须后加 `l` 或 `L`

Java 程序中变量通常声明为 `int` 型，除非不足以表示较大的数，才使用 `long`

|       | 类型           | 占用存储空间            | 表数范围 |
| ----- | -------------- | ----------------------- | -------- |
| byte  | 1 字节=8bit 位 | -128 ~ 127              |
| short | 2 字节         | -215 ~215-1             |
| int   | 4 字节         | -231 ~ 231-1 (约 21 亿) |
| long  | 8 字节         | -263 ~ 263-1            |

#### 浮点数

`float` ：单精度，尾数可以精确到 7 位有效数字。很多情况下，精度很难满足需求。 `double` ：双精度，精度是 `float` 的两倍。通常采用此类型

| 类型          | 占用存储空间 | 表数范围               |
| ------------- | ------------ | ---------------------- |
| 单精度 float  | 4 字节       | -3.403E38 ~ 3.403E38   |
| 双精度 double | 8 字节       | -1.798E308 ~ 1.798E308 |

#### 字符：char

`char ` 型数据用来表示通常意义上 「字符」(2 字节)

字符常量是用单引号(`''`)括起来的单个字符。例如：`char c1 = 'a';`

#### 布尔类型

#### 字符串

字符串不是基本数据类型，属于引用数据类型

#### 数组

数组是引用数据类型，数组的长度一旦确定就不能再修改。

使用 `new` 来分配内存空间。

```Java
// 声明方式
  int[] a
  int a[]

// 初始化
  // 动态初始化
  int[] arr = new int[3];
	int[][] arr = new int[3][2]

	// 静态初始化
	int[] arr = new int[]{1,2,3}
	int[] arr = {1,2,3}
	int[][] arr = new int[][]{ {1,2,3}, {4,5,6} }

// 注意特殊写法情况：int[] x, y[]; x是一维数组，y是二维数组

```

##### 类型默认值

| 数组元素类型 | 元素默认初始值               |
| ------------ | ---------------------------- |
| byte         | 0                            |
| short        | 0                            |
| int          | 0                            |
| long         | 0L                           |
| float        | 0.0F                         |
| double       | 0.0                          |
| char         | 0 或写为：’\u0000’(表现为空) |
| boolean      | false                        |
| 引用类型     | null                         |

### 类型转换

#### 自动类型转换

容量小的类型自动转换为容量大的数据类型，类型按容量大小排序：

![image-20210510182155035](https://gitee.com/lei451927/picture/raw/master/image-20210510182155035.png)

- 有多种类型的数据混合运算时，系统首先自动将所有数据转换成容量最大的那种数据类型，然后再进行计算。

- `byte`、`short`、`char`之间不会相互转换，他们三者在计算时首先转换为 `int` 类型。

- `boolean` 类型不能与其它数据类型运算。

- 当把任何基本数据类型的值和字符串( `String` )进行连接运算时(+)，基本数据类型的值将自动转化为字符串( `String` )类型。

#### 强制类型转换

- 自动类型转换的逆过程，将容量大的数据类型转换为容量小的数据类型。
- 使用时加上强制转换符号：`()`，可能会造成**精度降低或溢出**
- 通常，字符串不能直接转换为基本类型，但通过基本类型对应的包装类则可以实现把字符串转换成基本类型。
- `boolean` 类型不可以转换为其它的数据类型。

### 程序流程控制

#### switch

- `switch` (表达式)中表达式的值必须是下述几种类型之一： `byte` ， `short` ， `char` ， `int` ，枚举 (jdk 5.0)， `String ` (jdk 7.0);

- `case` 子句中的值必须是常量，不能是变量名或不确定的表达式值;
- 同一个 `switch` 语句，所有 `case` 子句中的常量值互不相同

## 面向对象

### 属性的默认初始化值

| 成员变量类型 | 初始值                       |
| ------------ | ---------------------------- |
| byte         | 0                            |
| short        | 0                            |
| int          | 0                            |
| long         | 0L                           |
| float        | 0.0F                         |
| double       | 0.0                          |
| char         | 0 或写为：’\u0000’(表现为空) |
| boolean      | false                        |
| 引用类型     | null                         |

### 权限修饰符

- `class` 只可以用 `public` 和 `default`

| 修饰符    | 类内部 | 同一个包 | 不同包的子类 | 同一个工程 |
| --------- | ------ | -------- | ------------ | ---------- |
| private   | Yes    |          |              |            |
| (缺省)    | Yes    | Yes      |              |            |
| protected | Yes    | Yes      | Yes          |            |
| public    | Yes    | Yes      | Yes          | Yes        |

### 构造器

- 它具有与类相同的名称

- 它不声明返回值类型。(与声明为 `void` 不同)
- 不能被 `static` 、 `final` 、 `synchronized` 、 `abstract` 、 `native` 修饰，不能有 `return` 语句返回值

### JavaBean

- `JavaBean` 是一种 `Java` 语言写成的可重用组件

- 所谓 `JavaBean` ，是指符合如下标准的 Java 类：
  - 类是公共的
  - 有一个无参的公共的构造器
  - 私有属性，且有对应的 `get` 、 `set` 方法

### this

- 它在方法内部使用，即这个方法所属对象的引用
- 它在构造器内部使用，表示该构造器正在初始化的对象

可以在类的构造器中使用" `this` (形参列表)"的方式，调用本类中重载的其他的构造器!

### package

- `package` 语句作为 Java 源文件的第一条语句，指明该文件中定义的类所在的包。(若缺省该语句，则指定为无名包)
- 包对应于文件系统的目录， `package` 语句中，用 「.」来指明包(目录)的层次;
- 包通常用小写单词标识。通常使用所在公司域名的倒置：com.atguigu.xxx

#### 包的作用

- 包帮助管理大型软件系统：将功能相近的类划分到同一个包中。比如：MVC 的设计模式
- 包可以包含类和子包，划分项目层次，便于管理
- 解决类命名冲突的问题
- 控制访问权限

#### JDK 中主要的包

1. `Java.lang` ----包含一些 Java 语言的核心类，如 `String` 、 `Math` 、 `Integer` 、 `System` 和 `Thread` ，提供常用功能
2. `Java.net` ----包含执行与网络相关的操作的类和接口。
3. `Java.io ` ----包含能提供多种输入/输出功能的类。
4. `Java.util` ----包含一些实用工具类，如定义系统特性、接口的集合框架类、使用与日期日历相关的函数。
5. `Java.text` ----包含了一些 Java 格式化相关的类
6. `Java.sql` ----包含了 Java 进行 JDBC 数据库编程的相关类/接口
7. `Java.awt` ----包含了构成抽象窗口工具集(abstract window toolkits)的多个类，这些类被用来构建和管理应用程序的图形用户界面(GUI)

### import

为使用定义在不同包中的 Java 类，需用 `import` 语句来引入指定包层次下所需要的类或全部类(.\*)

1. 在源文件中使用 `import` 显式的导入指定包下的类或接口

2. 声明在包的声明和类的声明之间。

3. 如果需要导入多个类或接口，那么就并列显式多个 `import` 语句即可

4. 举例：可以使用 `Java.util.*` 的方式，一次性导入 `util` 包下所有的类或接口。

5. 如果导入的类或接口是 `Java.lang` 包下的，或者是当前包下的，则可以省略此 `import` 语句。

6. 如果在代码中使用不同包下的同名的类。那么就需要使用类的全类名的方式指明调用的是哪个类。
7. 如果已经导入 `Java.a` 包下的类。那么如果需要使用 `a` 包的子包下的类的话，仍然需要导入。
8. `import static` 组合的使用：调用指定类或接口下的静态的属性或方法

### override/overwrite

1. 重写方法必须具有相同的函数签名
2. 重写方法的返回值类型不能大于父类方法的返回值类型
3. 重写方法的访问权限不能小于父类方法的访问权限（不能重写 `private` 权限的方法）
4. 重写方法抛出的异常不能大于父类方法抛出的异常

### super

1. `super` 可用于访问父类中定义的属性
2. `super` 可用于调用父类中定义的方法
3. `super` 可用于在构造器中调用父类的构造器
4. `super` 的追溯不仅限于直接父类

#### 父类构造器

- 子类中所有的构造器默认都会访问父类中空参数的构造器

- 当父类中没有空参数的构造器时，子类的构造器必须通过 `this` (参数列表)或者 `super` (参数列表)语句指定调用本类或者父类中相应的构造器。同时，只能”二选一”，且必须放在构造器的首行
- 如果子类构造器中既未显式调用父类或本类的构造器，且父类中又没有无参的构造器，则编译出错

### 多态性

Java 中引用变量有两个类型：

1. 编译时类型

- 由声明该变量时使用的类型决定

2. 运行时类型

- 由实际赋值给该变量的对象决定

当两个类型不一致时，就出现了 **多态性** ：子类的对象可以代替父类的对象使用

子类可以看作是特殊的父类，所以父类类型的引用可以指向子类的对象：向上转型

- 如果一个变量声明为父类的类型，但实际引用的子类对象。那么该变量就 **不能** 访问子类中添加的属性和方法（编译时报错，在父类上找不到该属性和方法）

#### 对象类型转换

对象间的强制类型转换称为造型：`(Child) parentObject`

- 从子类到父类的类型转换可以自动进行
- 从父类到子类的类型转换必须通过造型(强制类型转换)实现
- 无继承关系的引用类型间的转换是非法的
- 在造型前可以使用 `instanceof` 操作符测试一个对象的类型

```Java
public class Test {
  public void method(Person e) {
    // 设Person类中没有getschool() 方法
    // System.out.pritnln(e.getschool()); //非法,编译时错误
    if (e instanceof Student) {
      Student me = (Student) e; // 将e强制转换为Student类型
      System.out.pritnln(me.getschool());
    }
  }
  public static void main(String[] args){
    Test t = new Test();
  	Student m = new Student();
    t.method(m);
  }
}
```

### Object 类

| NO. | 方法名称                          | 类型 | 描述           |
| --- | --------------------------------- | ---- | -------------- |
| 1   | public Object()                   | 构造 | 构造器         |
| 2   | public boolean equals(Object obj) | 普通 | 对象比较       |
| 3   | public int hashCode()             | 普通 | 取得 Hash 码   |
| 4   | public String toString()          | 普通 | 对象打印时调用 |

引用类型之间的比较，必须引用地址一样 `==` 操作符才会返回 `true`，如果想要比较引用不同的两个对象，就可以重写其 `equals` 方法来实现。

- 类 `File` 、 `String` 、 `Date` 及包装类 ( `Wrapper Class` )来说，比较时就会根据内容来判断，而非引用地址。原因就在于他们重写了 `equals` 方法

### 包装类

针对八种基础数据类型定义相应的引用类型 - 包装类，使其具有类的特点，可以调用类中的方法

```Java
// 装箱
	// 通过包装类的构造器实现
	int i = 500; Integer t = new Integer(i)

// 拆箱
  // 调用包装类的 xxxValue 方法
  boolean b = obj.booleanValue()

// 字符串转换成基本数据类型
  // 通过给构造器传入字符串参数
  Float f = new Float("4.56")
  // 也可以通过 parseXXX 的静态方法
  Float f = Float.parseFloat("4.56")

// 基本数据类型转换成字符串
  // 调用字符串的 valueOf 方法
  String str = String.valueOf(5)
  // 直接使用隐式转换
  String str = 5 + ""
```

![image-20210512141648930](https://gitee.com/lei451927/picture/raw/master/images/image-20210512141648930.png)

### static

在 Java 类中，可用 `static` 修饰属性、方法、代码块、内部类

- 随着类的加载而加载
- 优先于对象存在
- 修饰的成员，被所有对象所共享
- 访问权限允许时，可不创建对象，直接被类调用

### main

由于 Java 虚拟机需要调用类的 `main()` 方法，所以该方法的访问权限必须是 `public` ，又因为 Java 虚拟机在执行 `main()` 方法时不必创建对象，所以该方法必须是 `static` 的，该方法接收一个 `String` 类型的数组参数，该数组中保存执行 Java 命令时传递给所运行的类的参数。

### 代码块

对 Java 类或对象进行初始化

- 代码块若有修饰符的话，只能是 `static` 修饰符，称之为静态代码块。没有修饰符的称之为非静态代码块。

#### 静态代码块

1. 可以有输出语句。
2. 可以对类的属性、类的声明进行初始化操作。
3. 不可以对非静态的属性初始化。即：不可以调用非静态的属性和方法。
4. 若有多个静态的代码块，那么按照从上到下的顺序依次执行。
5. 静态代码块的执行要先于非静态代码块。
6. 静态代码块随着类的加载而加载，且只执行一次。

#### 非静态代码块

1. 可以有输出语句。
2. 可以对类的属性、类的声明进行初始化操作。
3. 除了调用非静态的结构外，还可以调用静态的变量或方法。
4. 若有多个非静态的代码块，那么按照从上到下的顺序依次执行。
5. 每次创建对象的时候，都会执行一次，且先于构造器执行。

![image-20210512194836832](https://gitee.com/lei451927/picture/raw/master/images/image-20210512194836832.png)

### final

在 Java 中声明类、变量和方法时，可使用关键字 `final` 来修饰,表示 「最终的」

- `final` 标记的类不能被继承。提高安全性，提高程序的可读性。
- `String` 类、 `System` 类、 `StringBuffer` 类

- `final` 标记的方法不能被子类重写。
- 比如： `Object` 类中的 `getClass()` 。
- `final` 标记的变量(成员变量或局部变量)即称为常量。名称大写，且只能被赋值一次。
- `final` 标记的成员变量必须在声明时或在每个构造器中或代码块中显式赋值，然后才能使用。
- `final double MY_PI = 3.14;`

### 抽象类与抽象方法

随着继承层次中一个个新子类的定义，类变得越来越具体，而父类则更一般，更通用。类的设计应该保证父类和子类能够共享特征。有时将一个父类设计得非常抽象，以至于它没有具体的实例，这样的类叫做**抽象类**

- 用 `abstract` 关键字来修饰一个类，这个类叫做抽象类。
- 用 `abstract` 来修饰一个方法，该方法叫做抽象方法。

  - 抽象方法：只有方法的声明，没有方法的实现。比如 `public abstract void talk();`

- 含有抽象方法的类必须被声明为抽象类。

- 抽象类不能被实例化。抽象类是用来被继承的，抽象类的子类必须重写父类的抽象方法，并提供方法体。若没有重写全部的抽象方法，仍为抽象类。

- 不能用 `abstract` 修饰变量、代码块、构造器;
- 不能用 `abstract` 修饰私有方法、静态方法、 `final` 的方法、 `final` 的类。

### 接口

接口的本质是契约、标准、规范，制订好之后大家都要遵守。

- 接口（ `interface` ）是抽象方法和常量值定义的集合
- 用 `interface` 来定义
- 接口中的所有成员变量都默认是由 `public static final` 修饰的
- 接口中的所有抽象方法都默认是由 `public abstract` 修饰的
- 接口中没有构造器。
- 接口采用多继承机制。

定义 Java 类的语法格式：先写 `extends` ，后写 `implements`

- `class SubClass extends SuperClass implements InterfaceA{ }`
- 一个类可以实现多个接口，接口也可以继承其它接口
- 实现接口的类中必须提供接口中所有方法的具体实现内容，方可实例化。否则，仍为抽象类
- 接口的主要用途就是被实现类实现。(面向接口编程)
- 与继承关系类似，接口与实现类之间存在多态性

接口和类是并列关系，或者可以理解为一种特殊的类。从本质上讲，接口是一种特殊的抽象类，这种抽象类中只包含常量和方法的定义 (JDK7.0 及之前)，而没有变量和方法的实现。

#### Java 8 中关于接口的改进

Java 8 中，你可以为接口添加静态方法和默认方法。从技术角度来说，这是完全合法的，只是它看起来违反了接口作为一个抽象定义的理念。

静态方法：使用 `static ` 关键字修饰。可以通过接口直接调用静态方法，并执行其方法体。我们经常在相互一起使用的类中使用静态方法。你可以在标准库中找到像 `Collection` / `Collections` 或者 `Path` / `Paths` 这样成对的接口和类。

默认方法：默认方法使用 `default ` 关键字修饰。可以通过实现类对象来调用。我们在已有的接口中提供新方法的同时，还保持了与旧版本代码的兼容性。比如：Java 8 API 中对 `Collection` 、 `List` 、 `Comparator` 等接口提供了丰富的默认方法。

#### 接口中的默认方法

- 若一个接口中定义了一个默认方法，而另外一个接口中也定义了一个同名同参数的方法(不管此方法是否是默认方法)，在实现类同时实现了这两个接口时，会出现：**接口冲突**。
  - 解决办法：实现类必须覆盖接口中同名同参数的方法，来解决冲突。
- 若一个接口中定义了一个默认方法，而父类中也定义了一个同名同参数的非抽象方法，则不会出现冲突问题。因为此时遵守：**类优先原则**。接口中具有相同名称和参数的默认方法会被忽略。

### 内部类

#### 成员内部类

##### 成员内部类作为类的成员的角色

- `inner class` 可以声明为 `private` 或 `protected`
- 可以调用外部类的结构
- 可以声明为 `static`

##### 成员内部类作为类的角色

- 可以在内部定义属性、方法、构造器等结构
- 可以声明为 `abstract` 类，因此可以被其它的内部类继承
- 可以声明为 `final` 的
- 编译以后生成 `OuterClass$InnerClass.class` 字节码文件(也适用于局部内部类)

#### 局部内部类

- 只能在声明它的方法或代码块中使用，而且是先声明后使用。除此之外的任何地方都不能使用该类
- 但是它的对象可以通过外部方法的返回值返回使用，返回值类型只能是局部内部类的父类或父接口类型

- 内部类仍然是一个独立的类，在编译之后内部类会被编译成独立的 `.class` 文件，但是前面冠以外部类的类名和$符号，以及数字编号。
- 只能在声明它的方法或代码块中使用，而且是先声明后使用。除此之外的任何地方都不能使用该类。
- 局部内部类可以使用外部类的成员，包括私有的。
- 局部内部类可以使用外部方法的局部变量，但是必须是 `final` 的。由局部内部类和局部变量的声明周期不同所致。
- 局部内部类和局部变量地位类似，不能使用 `public` , `protected` ,缺省, `private ` - 局部内部类不能使用 `static` 修饰，因此也不能包含静态成员

#### 匿名内部类

- 匿名内部类不能定义任何静态成员、方法和类，只能创建匿名内部类的一个实例。一个匿名内部类一定是在 `new` 的后面，用其隐含实现一个接口或实现一个类。

- 格式：

  ```Java
  new 父类构造器(实参列表) | 实现接口(){
  //匿名内部类的类体部分
  }
  ```

- 匿名内部类的特点

  - 匿名内部类必须继承父类或实现接口
  - 匿名内部类只能有一个对象
  - 匿名内部类对象只能使用多态形式引用

```Java
interface A {
  public abstract void fun();
}

public class Outer {
  public void call(A a) {
    a.fun()
  }

  public static void main(String[] args) {
    // 接口不能new 但是此处相当于子类对象实现了接口，只不过没有给对象取名
    new Outer().call(new A() {
      public void fun() {
        //
      }
    })
  }
}
```

## 异常处理

### 两类异常事件

#### Error

Java 虚拟机无法解决的严重问题。如：JVM 系统内部错误、资源耗尽等情况。一般不编写针对性的代码进行处理。

#### Exception

因编程错误或偶然的外在因素导致的一般性问题，可以使用针对性代码进行处理

例如：

- 空指针访问
- 试图读取不存在的文件
- 网络连接中断
- 数组索引越界

### 编译时异常

指编译器要求必须处置的异常。即程序在运行时由于外界因素造成的一般性异常。编译器要求 Java 程序必须捕获或声明所有编译时异常。

### 运行时异常

是指编译器不要求强制处置的异常。一般是指编程时的逻辑错误，是程序员应该积极避免其出现的异常。`Java.lang.RuntimeException`类及它的子类都是运行时异常

### 异常处理机制

#### try-catch-finally

```Java
try{
	//可能产生异常的代码
} catch( ExceptionName1 e ) {
	//当产生ExceptionName1型异常时的处置措施
} catch( ExceptionName2 e ) {
	//当产生ExceptionName2型异常时的处置措施
} finally{
	//无论是否发生异常，都无条件执行的语句
}
```

如果抛出的异常是 `IOException` 等类型的非运行时异常，则必须捕获，否则编译错误。也就是说，我们必须处理编译时异常，将异常进行捕捉，转化为运行时异常

#### throws + 异常类型

```Java
public void readFile(String file) throws FileNotFoundException {
	// 读文件的操作可能产生FileNotFoundException类型的异常
  FileInputStream fis = new FileInputStream(file);
}
```

重写方法不能抛出比被重写方法范围更大的异常类型

#### 手动抛出异常

```Java
IOException e = new IOException(); throw e;
```

### 自定义异常类

- 一般地，用户自定义异常类都是 `RuntimeException` 的子类
- 自定义异常类通常需要编写几个重载的构造器
- 自定义异常需要提供 `serialVersionUID ` - 自定义的异常通过 `throw` 抛出
- 自定义异常最重要的是异常类的名字，当异常出现时，可以根据名字判断异常类型

## 多线程

### 线程的创建和使用

#### Thread 类

Java 语言的 JVM 允许程序运行多个线程，它通过`Java.lang.Thread` 类来体现。

##### Thread 类的特性：

- 每个线程都是通过某个特定 `Thread` 对象的 `run()` 方法来完成操作的，经常把 `run()` 方法的主体称为线程体
- 通过该 `Thread` 对象的 `start()` 方法来启动这个线程，而非直接调用 `run()`

##### 有关方法：

- `void start()`：启动线程，并执行对象的 `run()` 方法
- `run()`：线程在被调度时执行的操作
- `String getName()` ：返回线程的名称
- `void setName(String name)`：设置该线程名称
- `static Thread currentThread()`：返回当前线程。在 `Thread` 子类中就是 `this` ，通常用于主线程和 `Runnable` 实现类
- `static void yield()`：线程让步
  - 暂停当前正在执行的线程，把执行机会让给优先级相同或更高的线程
  - 若队列中没有同优先级的线程，忽略此方法
- `join()` ：当某个程序执行流中调用其他线程的 `join()` 方法时，调用线程将被阻塞，直到 `join()` 方法加入的 `join ` 线程执行完为止
  - 低优先级的线程也可以获得执行
- `static void sleep(long millis)`：(指定时间：毫秒)
  - 令当前活动线程在指定时间段内放弃对 CPU 控制,使其他线程有机会被执行,时间到后重排队。
  - 抛出 `InterruptedException` 异常
- `stop()`：强制线程生命期结束，不推荐使用
- `boolean isAlive()`：返回 `boolean` ，判断线程是否还活着

#### 继承 Thread 类

1. 定义子类继承 `Thread` 类。
2. 子类中重写 `Thread` 类中的 `run` 方法。
3. 创建 `Thread` 子类对象，即创建了线程对象。
4. 调用线程对象 `start` 方法：启动线程，调用 `run` 方法。

##### 注意点：

1. 如果自己手动调用 `run()` 方法，那么就只是普通方法，没有启动多线程模式。

2. `run()`方法由 JVM 调用，什么时候调用，执行的过程控制都有操作系统的 CPU 调度决定。

3. 想要启动多线程，必须调用 `start` 方法。

4. 一个线程对象只能调用一次 `start()` 方法启动，如果重复调用了，则将抛出以上的异常 `IllegalThreadStateException`。

#### 实现 Runnable 接口

1. 定义子类，实现 `Runnable` 接口。
2. 子类中重写 `Runnable` 接口中的 `run` 方法。
3. 通过 `Thread` 类含参构造器创建线程对象。
4. 将 `Runnable` 接口的子类对象作为实际参数传递给 `Thread` 类的构造器中。
5. 调用 `Thread` 类的 `start` 方法：开启线程，调用 `Runnable` 子类接口的 `run` 方法。

#### 继承方式和实现方式的区别

##### 区别：

- 继承 `Thread` ：线程代码存放 `Thread` 子类 `run` 方法中。
- 实现 `Runnable` ：线程代码存在接口的子类的 `run` 方法。

##### 实现方式的好处：

- 避免了单继承的局限性
- 多个线程可以共享同一个接口实现类的对象，非常适合多个相同线程来处理同一份资源。

#### 实现 Callable 接口

JDK 5 新增方式，与使用 `Runnable` 相比， `Callable` 功能更强大些

- 相比 `run()` 方法，可以有返回值
- 方法可以抛出异常
- 支持泛型的返回值
- 需要借助 `FutureTask` 类，比如获取返回结果

##### Future 接口

- 可以对具体 `Runnable` 、 `Callable` 任务的执行结果进行取消、查询是否完成、获取结果等。
- `FutrueTask` 是 `Futrue` 接口的唯一的实现类
- `FutureTask ` 同时实现了 `Runnable` , `Future` 接口。它既可以作为 `Runnable` 被线程执行，又可以作为 `Future` 得到 `Callable` 的返回值

#### 使用线程池

经常创建和销毁、使用量特别大的资源，比如并发情况下的线程，对性能影响很大，提前创建好多个线程，放入线程池中，使用时直接获取，使用完放回池中。可以避免频繁创建销毁、实现重复利用

##### 线程池相关 API

JDK 5.0 起提供了线程池相关 API： `ExecutorService ` 和 `Executors`

- `ExecutorService` ：真正的线程池接口。常见子类 `ThreadPoolExecutor`
- `void execute(Runnable command)` ：执行任务/命令，没有返回值，一般用来执行 `Runnable`

- `<T> Future<T> submit(Callable<T> task)`：执行任务，有返回值，一般又来执行 `Callable`

- `void shutdown()` ：关闭连接池

- `Executors` ：工具类、线程池的工厂类，用于创建并返回不同类型的线程池

- `Executors.newCachedThreadPool()` ：创建一个可根据需要创建新线程的线程池

- `Executors.newFixedThreadPool(n)`; 创建一个可重用固定线程数的线程池
- `Executors.newSingleThreadExecutor()` ：创建一个只有一个线程的线程池
- `Executors.newScheduledThreadPool(n)`：创建一个线程池，它可安排在给定延迟后运行命令或者定期地执行。

### 线程的调度

同优先级线程组成先进先出队列(先到先服务)，使用时间片策略

对高优先级，使用优先调度的抢占式策略

### 线程的优先级

- MAX_PRIORITY：10
- MIN \_PRIORITY：1
- NORM_PRIORITY：5

#### 涉及的方法

- `getPriority()` ：返回线程优先值
- `setPriority(int newPriority)` ：改变线程的优先级

> 线程创建时继承父线程的优先级
>
> 低优先级只是获得调度的概率低，并非一定是在高优先级线程之后才被调用

### 线程的分类

Java 中的线程分为两类：一种是守护线程，一种是用户线程

- 它们在几乎每个方面都是相同的，唯一的区别是判断 JVM 何时离开。
- 守护线程是用来服务用户线程的，通过在 `start()` 方法前调用 `thread.setDaemon(true)` 可以把一个用户线程变成一个守护线程。
- Java 垃圾回收就是一个典型的守护线程。
- 若 JVM 中都是守护线程，当前 JVM 将退出。

### 线程的生命周期

JDK 中用 `Thread.State` 类定义了线程的几种状态

- 新建：当一个 `Thread` 类或其子类的对象被声明并创建时，新生的线程对象处于新建状态
- 就绪：处于新建状态的线程被 `start()` 后，将进入线程队列等待 CPU 时间片，此时它已具备了运行的条件，只是没分配到 CPU 资源
- 运行：当就绪的线程被调度并获得 CPU 资源时,便进入运行状态， `run()` 方法定义了线程的操作和功能
- 阻塞：在某种特殊情况下，被人为挂起或执行输入输出操作时，让出 CPU 并临时中止自己的执行，进入阻塞状态
- 死亡：线程完成了它的全部工作或线程被提前强制性地中止或出现异常导致结束

![image-20210513135256985](https://gitee.com/lei451927/picture/raw/master/images/image-20210513135256985.png)

### 线程的同步

#### 安全问题

##### 问题的原因

当多条语句在操作同一个线程共享数据时，一个线程对多条语句只执行了一部分，还没有执行完，另一个线程参与进来执行。导致共享数据的错误。

##### 解决办法

对多条操作共享数据的语句，只能让一个线程都执行完，在执行过程中，其他线程不可以参与执行。

#### Synchronized

1. 同步代码块

   ```Java
   synchronized (对象){ }
   ```

2. `synchronized` 还可以放在方法声明中，表示整个方法为同步方法

```Java
public synchronized void show (String name){ }
```

#### 同步机制中的锁

对于并发工作，你需要某种方式来防止两个任务访问相同的资源(其实就是共享资源竞争)。防止这种冲突的方法就是当资源被一个任务使用时，在其上加锁。

第一个访问某项资源的任务必须锁定这项资源，使其他任务在其被解锁之前，就无法访问它了，而在其被解锁之时，另一个任务就可以锁定并使用它了。

##### synchronized 的锁

- 任意对象都可以作为同步锁。
- 所有对象都自动含有单一的锁(监视器)。
- 同步方法的锁：静态方法(类名.class)、非静态方法( `this)`
- 同步代码块：自己指定，很多时候也是指定为 `this` 或类名.class

必须确保使用同一个资源的多个线程共用一把锁，这个非常重要，否则就无法保证共享资源的安全

一个线程类中的所有静态方法共用同一把锁(类名.class)，所有非静态方法共用同一把锁(this)，同步代码块(指定需谨慎)

#### 同步的范围

##### 1、如何找问题，即代码是否存在线程安全?(非常重要)

1. 明确哪些代码是多线程运行的代码
2. 明确多个线程是否有共享数据
3. 明确多线程运行代码中是否有多条语句操作共享数据

##### 2、如何解决呢?(非常重要)

对多条操作共享数据的语句，只能让一个线程都执行完，在执行过程中，其他线程不可以参与执行。即所有操作共享数据的这些语句都要放在同步范围中

##### 3、切记：

- 范围太小：没锁住所有有安全问题的代码
- 范围太大：没发挥多线程的功能。

#### 释放锁的操作

- 当前线程的同步方法、同步代码块执行结束。

- 当前线程在同步代码块、同步方法中遇到 `break` 、 `return` 终止了该代码块、该方法的继续执行。

- 当前线程在同步代码块、同步方法中出现了未处理的 `Error` 或 `Exception` ，导致异常结束。

- 当前线程在同步代码块、同步方法中执行了线程对象的 `wait()` 方法，当前线程暂停，并释放锁。

#### 不会释放锁的操作

- 线程执行同步代码块或同步方法时，程序调用 `Thread.sleep()` 、 `Thread.yield()` 方法暂停当前线程的执行
- 线程执行同步代码块时，其他线程调用了该线程的 `suspend()` 方法将该线程挂起，该线程不会释放锁(同步监视器)。
  - 应尽量避免使用 `suspend()` 和 `resume()` 来控制线程

#### 线程的死锁问题

不同的线程分别占用对方需要的同步资源不放弃，都在等待对方放弃自己需要的同步资源，就形成了线程的死锁

出现死锁后，不会出现异常，不会出现提示，只是所有的线程都处于阻塞状态，无法继续

##### 解决方法

- 专门的算法、原则
- 尽量减少同步资源的定义
- 尽量避免嵌套同步

#### Lock（锁）

从 JDK 5.0 开始，Java 提供了更强大的线程同步机制——通过显式定义同步锁对象来实现同步。同步锁使用 `Lock` 对象充当。

- `Java.util.concurrent.locks.Lock`接口是控制多个线程对共享资源进行访问的工具。锁提供了对共享资源的独占访问，每次只能有一个线程对 `Lock` 对象加锁，线程开始访问共享资源之前应先获得 `Lock` 对象。

- `ReentrantLock ` 类实现了 `Lock ` ，它拥有与 `synchronized ` 相同的并发性和内存语义，在实现线程安全的控制中，比较常用的是 `ReentrantLock` ，可以显式加锁、释放锁。

```Java
class A{
	private final ReentrantLock lock = new ReenTrantLock();

  public void m(){
		lock.lock();
    try{
    	//保证线程安全的代码;
    } finally{
			// 注意：如果同步代码有异常，要将unlock()写入finally语句块
      lock.unlock();
    }
  }
}
```

#### synchronized 与 Lock 的对比

1.  `Lock` 是显式锁(手动开启和关闭锁，别忘记关闭锁)， `synchronized` 是隐式锁，出了作用域自动释放

2.  `Lock` 只有代码块锁， `synchronized` 有代码块锁和方法锁
3.  使用 `Lock` 锁，JVM 将花费较少的时间来调度线程，性能更好。并且具有更好的扩展性(提供更多的子类)

##### 优先使用顺序：

1.  `Lock`
    2 . 同步代码块(已经进入了方法体，分配了相应资源)
2.  同步方法 (在方法体之外)

### 线程的通信

#### wait() 与 notify() 和 notifyAll()

- `wait()` ：令当前线程挂起并放弃 `CPU` 、同步资源并等待，使别的线程可访问并修改共享资源，而当前线程排队等候其他线程调用 `notify()` 或 `notifyAll()` 方法唤醒，唤醒后等待重新获得对监视器的所有权后才能继续执行。

- `notify()` ：唤醒正在排队等待同步资源的线程中优先级最高者结束等待
- `notifyAll ()` ：唤醒正在排队等待资源的所有线程结束等待

这三个方法只有在 `synchronized` 方法或 `synchronized` 代码块中才能使用，否则会报 `Java.lang.IllegalMonitorStateException`异常

因为这三个方法必须有锁对象调用，而任意对象都可以作为 `synchronized` 的同步锁，因此这三个方法只能在 `Object` 类中声明

#### wait

- 在当前线程中调用方法：对象名. `wait()`
- 使当前线程进入等待(某对象)状态，直到另一线程对该对象发出 `notify(` 或 `notifyAll)` 为止
- 调用方法的必要条件：当前线程必须具有对该对象的监控权(加锁)
- 调用此方法后，当前线程将释放对象监控权，然后进入等待
- 在当前线程被 `notify` 后，要重新获得监控权，然后从断点处继续代码的执行

#### notify()/notifyAll()

- 在当前线程中调用方法：对象名.notify()
- 功能：唤醒等待该对象监控权的一个/所有线程。
- 调用方法的必要条件：当前线程必须具有对该对象的监控权(加锁)

#### 生产者/消费者实例

```Java
class Clerk {
  private int product = 0;
  // 生产
  public synchronized void addProduct() {
    if (product >= 20) {
      try {
        wait();
      } catch (InterruptedException e) {
        e.printStackTrace();
      }
    } else {
      product++;
      notifyAll();
    }
	}
  // 消费
  public synchronized void getProduct() {
    if (this.product <= 0) {
      try {
        wait();
      } catch (InterruptedException e) {
        e.printStackTrace();
      }
    } else {
      product--;
      notifyAll();
    }
  }
}
```

## 常用类

### String

`String` 是一个 `final` 类，代表不可变的字符序列。

`String` 对象的字符内容是存储在一个字符数组`value[]`中的

```Java
// 字符串常量存储在字符串常量池，目的是共享
String str = "123";
// 字符串非常量对象存储在堆中
String str = new String("123");
```

#### String 使用陷阱

- `String s1 = "a";`
  - 在字符串常量池中创建了一个字面量为"a"的字符串。
- `s1 = s1 + "b"; `
  - 实际上原来的 「a」字符串对象已经丢弃了，现在在堆空间中产生了一个字符串 s1+"b"(也就是"ab")。如果多次执行这些改变串内容的操作，会导致大量副本字符串对象存留在内存中，降低效率。如果这样的操作放到循环中，会极大影响程序的性能。
- `String s2 = "ab"; `
  - 直接在字符串常量池中创建一个字面量为"ab"的字符串。
- `String s3 = "a" + "b";`
  - s3 指向字符串常量池中已经创建的"ab"的字符串。
- `String s4 = s1.intern(); `
  - 堆空间的 s1 对象在调用 `intern()` 之后，会将常量池中已经存在的"ab"字符串赋值给 s4。

#### 相关方法

```Java
int length()：返回字符串的长度： return value.length

char charAt(int index)：返回某索引处的字符 return value[index]

boolean isEmpty()：判断是否是空字符串：return value.length == 0

String toLowerCase()：使用默认语言环境，将 String 中的所有字符转换为小写

String toUpperCase()：使用默认语言环境，将 String 中的所有字符转换为大写

String trim()：返回字符串的副本，忽略前导空白和尾部空白

boolean equals(Object obj)：比较字符串的内容是否相同

boolean equalsIgnoreCase(String anotherString)：与equals方法类似,忽略大小写

String concat(String str)：将指定字符串连接到此字符串的结尾。等价于用 「+」

int compareTo(String anotherString)：比较两个字符串的大小

String substring(int beginIndex)：返回一个新的字符串，它是此字符串的从
beginIndex开始截取到最后的一个子字符串。

String substring(int beginIndex, int endIndex) ：返回一个新字符串，它是此字符串从beginIndex开始截取到endIndex(不包含)的一个子字符串

boolean endsWith(String suffix)：测试此字符串是否以指定的后缀结束

boolean startsWith(String prefix)：测试此字符串是否以指定的前缀开始

boolean startsWith(String prefix, int toffset)：测试此字符串从指定索引开始的子字符串是否以指定前缀开始

String replace(char oldChar, char newChar)：返回一个新的字符串，它是通过用 newChar 替换此字符串中出现的所有 oldChar 得到的。

String replace(CharSequence target, CharSequence replacement)：使用指定的字面值替换序列替换此字符串所有匹配字面值目标序列的子字符串。

String replaceAll(String regex, String replacement) ：使用给定的replacement 替换此字符串所有匹配给定的正则表达式的子字符串。

String replaceFirst(String regex, String replacement) ：使用给定 的replacement 替换此字符串匹配给定的正则表达式的第一个子字符串。

boolean matches(String regex)：告知此字符串是否匹配给定的正则表达式。

String[] split(String regex)：根据给定正则表达式的匹配拆分此字符串。

String[] split(String regex, int limit)：根据匹配给定的正则表达式来拆分此字符串，最多不超过limit个，如果超过了，剩下的全部都放到最后一个元素中。
```

#### 类型转换

##### 字符串 -> 基础数据类型、包装类

使用 `Java.lang` 包中的 `Byte` 、 `Short` 、 `Long` 、 `Float` 、 `Double` 类调相应的类方法可以将由 「数字」字符组成的字符串，转化为相应的基本数据类型

例如 `Integer` 的 `parseInt` 可以将字符串转换为整型。

##### 基础数据类型、包装类 -> 字符串

`String` 类的 `valueOf` ，会根据参数的类型，将其转换为字符串

##### 字符数组 -> 字符串

`String` 构造器可以直接将 `char[]` 类型的字符数组转为字符串

##### 字符串 -> 字符数组

`toCharArray` 可以将字符串中的字符放入一个字符数组中返回

`getChars ` 可以将指定范围的字符串存放到数组中

##### 字节数组 -> 字符串

`String` 构造器可以直接转换

##### 字符串 -> 字节数组

`getBytes ` 可以将字符串编码为 `byte` ，并将结果储存到 `byte` 数组中返回

### StringBuffer

`StringBuffer` 代表可变的字符序列，对字符串内容进行增删时，不会产生新的对象

```Java
// 初始容量为16的字符串缓冲区
StringBuffer()
// 构造指定容量的字符串缓冲区
StringBuffer(int size)
// 将内容初始化为指定字符串内容
StringBuffer(String str)

// 提供了很多的append()方法，用于进行字符串拼接
StringBuffer append(xxx)
// 删除指定位置的内容
StringBuffer delete(int start,int end)
// 把[start,end)位置替换为str
StringBuffer replace(int start, int end, String str)
// 在指定位置插入xxx
StringBuffer insert(int offset, xxx)
// 把当前字符序列逆转
StringBuffer reverse()

public int indexOf(String str)
public String substring(int start,int end) public int length()
public char charAt(int n )
public void setCharAt(int n ,char ch)
```

### StringBuilder

`StringBuilder ` 和 `StringBuffer ` 非常类似，均代表可变的字符序列，而且提供相关功能的方法也一样

#### 区别

- String(JDK1.0)：不可变字符序列
- StringBuffer(JDK1.0)：可变字符序列、效率低、线程安全
- StringBuilder(JDK 5.0)：可变字符序列、效率高、线程不安全

注意：作为参数传递的话，方法内部 `String` 不会改变其值， `StringBuffer` 和 `StringBuilder ` 会改变其值。

### 日期

#### JDK 8 之前的日期 API

##### java.lang.System

`System.currentTimeMillis` 可以返回当前时间与 1970/1/1 之间的以毫秒为单位的时间差

##### java.util.Date

- `Date`：无参构造器可以用来获取本地当前时间
- `Date(long date)`：获取指定时间对象
  - `getTime`：返回毫秒数
  - `toString`：将时间转换为如下形式的字符串
    - `dow mon dd hh:mm:ss zzz yyyy`
    - `dow` 一周中的某一天，`zzz` 是时间标准

##### java.text.SimpleDateFormat

时间格式化：日期 -> 文本、文本 -> 日期

- `SimpleDateFormat()`：默认的模式和语言环境创建对象

- `SimpleDateFormat(String pattern)`：用参数 `pattern` 指定的格式创建一个对象

  - `format`：格式化时间对象
  - `parse`：解析文本，生成一个日期

  ![image-20210517200052786](https://gitee.com/lei451927/picture/raw/master/images/image-20210517200052786.png)

##### java.util.Calendar

`Calendar`是一个抽象基类，主用用于完成日期字段之间相互操作的功能

获取`Calendar`实例的方法

- 使用`Calendar.getInstance()`方法
- 调用它的子类`GregorianCalendar`的构造器

一个`Calendar`的实例是系统时间的抽象表示

- `get(int field)`获取时间信息

  - `YEAR`、`MONTH`、`DAY_OF_WEEK`、`HOUR_OF_DAY` 、 `MINUTE`、`SECOND`

- `public void set(int field,int value)`
- `public void add(int field,int amount)`
- `public final Date getTime()`
- `public final void setTime(Date date)`

注意：

- 获取月份时：一月是 0，二月是 1，以此类推，12 月是 11

- 获取星期时：周日是 1，周二是 2 ，。。。。周六是 7

#### JDK 8 新增的日期 API

`Date` 新增了 `toInstant` 方法，用于将时间转换成新的表示形式。

- `java.time` –包含值对象的基础包
- `java.time.chrono` –提供对不同的日历系统的访问
- `java.time.format` –格式化和解析时间和日期
- `java.time.temporal` –包括底层框架和扩展特性
- `java.time.zone` –包含时区支持的类

> 大多数开发者只会用到基础包和 format 包，也可能会用到 temporal 包。因此，尽管有 68 个新的公开类型，大多数开发者，大概将只会用到其中的三分之一。

##### LocalDate、LocalTime、LocalDateTime

| 方法                                                                               | 描述                                                            |
| ---------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `now()` / `now(ZoneId zone)`                                                       | 静态方法，根据当前时间创建对象/指定时区的对象                   |
| `of()`                                                                             | 静态方法，根据指定日期/时间创建对象                             |
| `getDayOfMonth()` / `getDayOfYear()`                                               | 获得月份天数(1-31)、获得年份天数(1-366)                         |
| `getDayOfWeek()`                                                                   | 获得星期几(返回一个 DayOfWeek 枚举值)                           |
| `getMonth()`                                                                       | 获得月份, 返回一个 Month 枚举值                                 |
| `getMonthValue()` / `getYear()`                                                    | 获得月份(1-12) /获得年份                                        |
| `getHour()` / `getMinute()` / `getSecond()`                                        | `获得当前对象对应的小时、分钟、秒 `                             |
| `withDayOfMonth()` / `withDayOfYear()` / `withMonth()` / `withYear()`              | `将月份天数、年份天数、月份、年份修改为指定的值并返回新的对象 ` |
| `plusDays()` / `plusWeeks()` / `plusMonths()` / `plusYears()` / `plusHours()`      | `向当前对象添加几天、几周、几个月、几年、几小时 `               |
| `minusMonths()` / `minusWeeks()` / `minusDays()` / `minusYears()` / `minusHours()` | `从当前对象减去几月、几周、几天、几年、几小时 `                 |

##### Instant

表示自 1970 年 1 月 1 日 0 时 0 分 0 秒(UTC)开始的秒数

| 方法                          | 描述                                                                             |
| ----------------------------- | -------------------------------------------------------------------------------- |
| now()                         | 静态方法，返回默认 UTC 时区的 Instant 类的对象                                   |
| ofEpochMilli(long epochMilli) | 静态方法，返回在 1970-01-01 00:00:00 基础上加上指定毫秒数之后的 Instant 类的对象 |
| atOffset(ZoneOffset offset)   | 结合即时的偏移来创建一个 OffsetDateTime                                          |
| toEpochMilli()                | 返回 1970-01-01 00:00:00 到当前时间的毫秒数，即为时间戳                          |

##### java.time.format.DateTimeFormatter

预定义的标准格式：`ISO_LOCAL_DATE_TIME` / `ISO_LOCAL_DATE` / `ISO_LOCAL_TIME`

| 方法                       | 描述                                                 |
| -------------------------- | ---------------------------------------------------- |
| ofPattern(String pattern)  | 静态方法，返回一个指定字符串格式的 DateTimeFormatter |
| format(TemporalAccessor t) | `格式化一个日期、时间，返回字符串 `                  |
| parse(CharSequence text)   | `将指定格式的字符序列解析为一个日期、时间 `          |

##### 其它 API

- `ZoneId`：该类中包含了所有的时区信息，一个时区的 ID，如 `Europe/Paris `
- `ZonedDateTime`：一个在 ISO-8601 日历系统时区的日期时间，如 `2007-12-03T10：15：30+01：00 Europe/Paris`。
  - 其中每个时区都对应着 ID，地区 ID 都为 「{区域}/{城市}」的格式，例如：Asia/Shanghai 等
- `Clock`：使用时区提供对当前即时、日期和时间的访问的时钟
- 持续时间：`Duration`，用于计算两个 「时间」间隔
- 日期间隔：`Period`，用于计算两个 「日期」间隔
- `TemporalAdjuster` ：时间校正器。有时我们可能需要获取例如：将日期调整到 「下一个工作日」等操作。
- `TemporalAdjusters` ：该类通过静态方法 (`firstDayOfXxx()`/`lastDayOfXxx()`/`nextXxx()`)提供了大量的常用 `TemporalAdjuster` 的实现。

##### 与传统日期处理的转换

| 类                                                         | To 遗留类                             | From 遗留类                 |
| ---------------------------------------------------------- | ------------------------------------- | --------------------------- |
| java.time.Instant 与 java.util.Date                        | Date.from(instant)                    | date.toInstant()            |
| java.time.Instant 与 java.sql.Timestamp                    | Timestamp.from(instant)               | timestamp.toInstant()       |
| java.time.ZonedDateTime 与 java.util.GregorianCalendar     | GregorianCalendar.from(zonedDateTime) | cal.toZonedDateTime()       |
| java.time.LocalDate 与 java.sql.Time                       | Date.valueOf(localDate)               | date.toLocalDate()          |
| java.time.LocalTime 与 java.sql.Time                       | Date.valueOf(localDate)               | date.toLocalTime()          |
| java.time.LocalDateTime 与 java.sql.Timestamp              | Timestamp.valueOf(localDateTime)      | timestamp.toLocalDateTime() |
| java.time.ZoneId 与 java.util.TimeZone                     | Timezone.getTimeZone(id)              | timeZone.toZoneId()         |
| java.time.format.DateTimeFormatter 与 java.text.DateFormat | formatter.toFormat()                  | 无                          |

### 比较器

#### 自然排序：`java.lang.Comparable`

- 实现 `Comparable` 的类必须实现 `compareTo(Object obj)` 方法，`compareTo` 的返回值：

  - 如果是正整数，表示当前对象大于比较对象。
  - 如果是负数，表示小于比较对象。
  - 零则表示相等。

- 实现 `Comparable` 接口的对象可以通过 `Collections.sort` 或 `Arrays.sort`进行自动排序。实现此接口的对象可以用作有序映射中的键或有序集合中的元素，无需指定比较器。

````java
class Goods implements Comparable {
    private String name;
    private double price;
    //按照价格，比较商品的大小 @Override
    public int compareTo(Object o) {
        if(o instanceof Goods) {
            Goods other = (Goods) o;
        if (this.price > other.price) {
            return 1;
        } else if (this.price < other.price) {
            return -1;
        }
            return 0;
        }
        throw new RuntimeException("输入的数据类型不一致");
    }
    //构造器、getter、setter、toString()方法略
}

##### Comparable 的典型实现

- String：按照字符串中字符的Unicode值进行比较
- Character：按照字符的Unicode值来进行比较
- 数值类型对应的包装类以及BigInteger、BigDecimal：按照它们对应的数值大小进行比较
- Boolean：true 对应的包装类实例大于 false 对应的包装类实例
- Date、Time等：后面的日期时间比前面的日期时间大

#### 定制排序：`java.util.Comparator`

- 当元素的类型没有实现`java.lang.Comparable`接口而又不方便修改代码，或者实现了`java.lang.Comparable`接口的排序规则不适合当前的操作，那么可以考虑使用 `Comparator` 的对象来排序

- 重写`compare(Object o1,Object o2)`方法，比较o1和o2的大小

- 可以将 `Comparator` 传递给 `sort` 方法(如 `Collections.sort` 或 `Arrays.sort`)，从而允许在排序顺序上实现精确控制。还可以使用 `Comparator` 来控制某些数据结构(如有序 `set`或有序映射)的顺序，或者为那些没有自然顺序的对象 `collection` 提供排序

​```java
Goods[] all = new Goods[4];
all[0] = new Goods("War and Peace", 100);
all[1] = new Goods("Childhood", 80);
all[2] = new Goods("Scarlet and Black", 140);
all[3] = new Goods("Notre Dame de Paris", 120);
Arrays.sort(all, new Comparator() {
    @Override
    public int compare(Object o1, Object o2) {
        Goods g1 = (Goods) o1;
        Goods g2 = (Goods) o2;
        return g1.getName().compareTo(g2.getName());
    }
});
````

### System

System 类代表系统，系统级的很多属性和控制方法都放置在该类的内部

该类的构造器是`private`的，其内部的成员变量和成员方法都是`static`的，所以也可以很方便的进行调用

#### 成员变量

`System`类内部包含`in`、`out`和`err`三个成员变量，分别代表标准输入流

(键盘输入)，标准输出流(显示器)和标准错误输出流(显示器)

#### 成员方法

- `native long currentTimeMillis()`：该方法的作用是返回当前的计算机时间，时间的表达格式为当前计算机时间和 GMT 时间(格林威治时间)1970 年 1 月 1 号 0 时 0 分 0 秒所差的毫秒数。

- `void exit(int status)`：该方法的作用是退出程序。其中 status 的值为 0 代表正常退出，非零代表异常退出。使用该方法可以在图形界面编程中实现程序的退出功能等。
  9.5 System 类

- `void gc()`：该方法的作用是请求系统进行垃圾回收。至于系统是否立刻回收，则取决于系统中垃圾回收算法的实现以及系统执行时的情况。

- `String getProperty(String key)`：该方法的作用是获得系统中属性名为 key 的属性对应的值。系统中常见的属性名以及属性的作用如下表所示：

  ![image-20210519210155125](https://gitee.com/lei451927/picture/raw/master/images/image-20210519210155125.png)

### Math

![image-20210519210602946](https://gitee.com/lei451927/picture/raw/master/images/image-20210519210602946.png)

### BigInteger

`Integer`类作为 int 的包装类，能存储的最大整型值为 231-1，Long 类也是有限的，最大为 263-1。如果要表示再大的整数，不管是基本数据类型还是他们的包装类都无能为力，java.math 包的 BigInteger 可以表示不可变的任意精度的整数

BigInteger 提供所有 Java 的基本整数操作符的对应物，并提供 java.lang.Math 的所有相关方法。另外，BigInteger 还提供以下运算：模算术、GCD 计算、质数测试、素数生成、位操作以及一些其他操作

```java
// 根据字符串构建BigInteger对象
BigInteger(String val)
```

#### 常用方法

- `public BigInteger abs()`：返回此 BigInteger 的绝对值的 BigInteger。

- `BigInteger add(BigInteger val)` ：返回其值为 (this + val) 的 BigInteger

- `BigInteger subtract(BigInteger val)` ：返回其值为 (this - val) 的 BigInteger

- `BigInteger multiply(BigInteger val)` ：返回其值为 (this \* val) 的 BigInteger

- `BigInteger divide(BigInteger val)` ：返回其值为 (this / val) 的 BigInteger。整数

  相除只保留整数部分。

- `BigInteger remainder(BigInteger val)` ：返回其值为 (this % val) 的 BigInteger。

- `BigInteger[] divideAndRemainder(BigInteger val)`：返回包含 (this / val) 后跟

  (this % val) 的两个 BigInteger 的数组。

- `BigInteger pow(int exponent)` ：返回其值为 (this exponent) 的 BigInteger

### BigDecimal

一般的 Float 类和 Double 类可以用来做科学计算或工程计算，但在商业计算中，要求数字精度比较高，故用到 java.math.BigDecimal 类

BigDecimal 类支持不可变的、任意精度的有符号十进制定点数

```java
public BigDecimal(double val)
public BigDecimal(String val)
public BigDecimal add(BigDecimal augend)
public BigDecimal subtract(BigDecimal subtrahend)
public BigDecimal multiply(BigDecimal multiplicand)
public BigDecimal divide(BigDecimal divisor, int scale, int roundingMode)
```

## 枚举类与注解

### 枚举类

- 类的对象只有有限个，确定的。例如：男、女；星期、季节

- 枚举类对象的属性不应允许被改动, 所以应该使用 `private final` 修饰并且在构造器中为其赋值

#### JDK1.5 之前需要自定义枚举类

1. 私有化类的构造器，保证不能在类的外部创建其对象

2. 在类的内部创建枚举类的实例。声明为： `public static final`

3. 对象如果有实例变量，应该声明为`private final`，并在构造器中初始化

   ```java
   class Season {
     private final String SEASON_NAME;
     private final String SEASON_DESC;
     private Season(String name, String desc) {
       this.SEASON_NAME = name
       this.SEASON_DESC = desc
     }
     public static final Season SPRING= new Season("春天", "春暖花开");
     public static final Season SUMMER = new Season("夏天", "夏日炎炎");
     public static final Season AUTUMN = new Season("秋天", "秋高气爽");
     public static final Season WINTER = new Season("冬天", "白雪皑皑");
   }
   ```

#### JDK 1.5 新增的 enum 关键字

- 使用 `enum` 定义的枚举类默认继承了 `java.lang.Enum`类，因此不能再继承其他类
- 枚举类的构造器只能使用 `private` 权限修饰符
- 枚举类的所有实例必须在枚举类中显式列出(`,` 分隔 `;` 结尾)。列出的实例系统会自动添加 `public static final` 修饰
- 必须在枚举类的第一行声明枚举类对象

> JDK 1.5 中可以在 `switch` 表达式中使用 Enum 定义的枚举类的对象作为表达式, `case` 子句可以直接使用枚举值的名字, 无需添加枚举类作为限定。

```java
public enum SeasonEnum {
  Season SPRING("春天", "春暖花开");
  Season SUMMER("夏天", "夏日炎炎");
  Season AUTUMN("秋天", "秋高气爽");
  Season WINTER("冬天", "白雪皑皑");

  private final String SEASON_NAME;
  private final String SEASON_DESC;
  private Season(String name, String desc) {
    this.SEASON_NAME = name
    this.SEASON_DESC = desc
  }
	public String getSeasonName() {
    return SEASON_NAME
  }
  	public String getSeasonDesc() {
    return SEASON_DESC
  }
}
```

##### 主要方法

![image-20210520193233881](https://gitee.com/lei451927/picture/raw/master/images/image-20210520193233881.png)

### 注解（Annotation）

Annotation 就是代码里的特殊标记，这些标记可以在编译、类加载、运行时被读取，并执行相应的处理。

这种对数据本身加以描述信息的数据，称之为元数据。

Annotation 可以像修饰符一样被使用，可用于修饰包、类、构造器、方法、成员变量、参数、局部变量

#### 定义 Annotation

- 使用 `@interface` 关键字，自动继承` java.lang.annotation.Annotation` 接口

- 成员变量以无参方法的形式进行声明，其方法名和返回值定义了成员的名字和类型，类型只能是八种基础数据类型：

  ```java
  String
  Class
  Enum
  Annotation
  // 以及上述这些类型的数组
  ```

- 指定初始值使用`default` 关键字

- 如果只有一个成员，建议使用 `value` 作为参数名，名称为 `value` ，使用时可以省略键名

```java
@Documented
@Inherited
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@interface MyAnnotation{
  String value() default '默认值'
}
```

#### 元注解

元注解用来修饰自定义注解

##### @Retention

指定 Annotation 的生命周期：

- `RetentionPolicy.CLASS`：默认值，在 class 文件中有效(即 class 保留) ，当运行 Java 程序时, JVM 不会保留注解

- `RetentionPolicy.SOURCE`：在源文件中有效(即源文件保留)，编译器直接丢弃这种策略的注释
- `RetentionPolicy.RUNTIME`：在运行时有效(即运行时保留)，当运行 Java 程序时, JVM 会保留注释。程序可以**通过反射获取该注释**。

##### @Target

指定 Annotation 可以用来修饰哪些程序元素

![image-20210520202719469](https://gitee.com/lei451927/picture/raw/master/images/image-20210520202719469.png)

##### @Documented

指定 Annotation 可以被 `javadoc` 工具提取成文档

> 定义为`Documented`的注解必须设置 Retention 值为`RUNTIME`

##### @Inherited

指定 Annotation 具有继承性，如果某个类使用了被 `@Inherited` 修饰的 Annotation，则其子类将自动具有该注解。

#### 利用反射获取注解信息

JDK 5.0 在 `java.lang.reflect` 包下新增了 `AnnotatedElement` 接口, 该接口代表程序中可以接受注解的程序元素

当一个 Annotation 类型被定义为运行时 Annotation 后, 该注解才是运行时可见, 当 class 文件被载入时保存在 class 文件中的 Annotation 才会被虚拟机读取

程序可以调用 `AnnotatedElement` 对象的如下方法来访问 Annotation 信息

![image-20210520204357216](https://gitee.com/lei451927/picture/raw/master/images/image-20210520204357216.png)

#### JDK8 中注解的新特性

##### 可重复的注解

![image-20210520204637614](https://gitee.com/lei451927/picture/raw/master/images/image-20210520204637614.png)

##### 类型注解

`@Target`的参数类型 ElementType 枚举值多了两个：`TYPE_PARAMETER`、`TYPE_USE`

在 Java 8 之前，注解只能是在声明的地方所使用，Java8 开始，注解可以应用在任何地方

- `ElementType.TYPE_PARAMETER` 表示该注解能写在类型变量的声明语句中(如：泛型声明)

- `ElementType.TYPE_USE` 表示该注解能写在使用类型的任何语句中

![image-20210520205011336](https://gitee.com/lei451927/picture/raw/master/images/image-20210520205011336.png)

## 集合

Java 集合类可以用于存储数量不等的多个对象，还可用于保存具有映射关系的关联数组

- `Collection`接口：单列数据，定义了存取一组对象的方法的集合
  - `List`：元素有序、可重复的集合
  - `Set`：元素无需、不可重复的集合
- `Map` 接口：双列数据，具有键值对映射关系的集合

### Collection

#### 接口继承树

![image-20210521131756872](https://gitee.com/lei451927/picture/raw/master/images/image-20210521131756872.png)

#### 接口方法

```java
// 添加
add(Object obj)
addAll(Collection coll)

// 获取有效元素的个数
int size()

// 清空集合
void clear()

// 是否是空集合
boolean isEmpty()

// 是否包含某个元素
	// 是通过元素的equals方法来判断是否是同一个对象
boolean contains(Object obj)
	// 也是调用元素的equals方法来比较的。拿两个集合的元素挨个比较
boolean containsAll(Collection c)

// 删除
  // 通过元素的equals方法判断是否是要删除的那个元素。只会删除找到的第一个元素
boolean remove(Object obj)
  // 取当前集合的差集
boolean removeAll(Collection coll)

// 取两个集合的交集
  // 把交集的结果存在当前集合中，不影响c
boolean retainAll(Collection c)

// 集合是否相等
boolean equals(Object obj)

// 转成对象数组
Object[] toArray()

// 获取集合对象的哈希值
hashCode()

// 遍历
  // 返回迭代器对象，用于集合遍历
iterator()
```

### Iterator 接口

![image-20210531194104593](https://gitee.com/lei451927/picture/raw/master/images/image-20210531194104593.png)

- 在调用`it.next()`方法之前必须要调用`it.hasNext()`进行检测。若不调用，且下一条记录无效，直接调用 it.next()会抛出`NoSuchElementException`异常

- `Iterator`可以删除集合的元素，但是是遍历过程中通过迭代器对象的`remove`方法，不是集合对象的`remove`方法
- 如果还未调用`next()`或在上一次调用 `next` 方法之后已经调用了 `remove` 方法，再调用`remove` 都会报`IllegalStateException`

#### 使用 foreach 循环遍历集合元素

- foreach 还可以用来遍历数组

![image-20210531194336929](https://gitee.com/lei451927/picture/raw/master/images/image-20210531194336929.png)

### List 接口

- 鉴于 Java 中数组用来存储数据的局限性，我们通常使用`List`替代数组
- `List`集合类中元素有序、且可重复，集合中的每个元素都有其对应的顺序索引。
- `List`容器中的元素都对应一个整数型的序号记载其在容器中的位置，可以根据序号存取容器中的元素。
- `List`接口的实现类常用的有：`ArrayList`、`LinkedList`和`Vector`。

```java
// 在index位置插入ele元素
void add(int index, Object ele)

// 从index位置开始将eles中的所有元素添加进来
boolean addAll(int index, Collection eles)

// 获取指定index位置的元素
Object get(int index)

// 返回obj在集合中首次出现的位置
int indexOf(Object obj)

// 返回obj在当前集合中末次出现的位置
int lastIndexOf(Object obj)

// 移除指定index位置的元素，并返回此元素
Object remove(int index)

// 设置指定index位置的元素为ele
Object set(int index, Object ele)

// 返回从fromIndex到toIndex位置的子集合
List subList(int fromIndex, int toIndex)
```

#### ArrayList

- 本质上，`ArrayList` 是对象引用的一个”变长”数组

- ArrayList 的 JDK1.8 之前与之后的实现区别?
  - JDK1.7：`ArrayList` 像饿汉式，直接创建一个初始容量为 10 的数组
  - JDK1.8：`ArrayList` 像懒汉式，一开始创建一个长度为 0 的数组，当添加第一个元素时再创建一个始容量为 10 的数组
- `Arrays.asList(...)` 方法返回的 `List` 集合，既不是 `ArrayList` 实例，也不是 `Vector` 实例。 Arrays.asList(...) 返回值是一个固定长度的 `List` 集合

#### LinkedList

- 对于频繁的插入或删除元素的操作，建议使用 LinkedList 类，效率较高

- 双向链表，内部没有声明数组，而是定义了 Node 类型的 first 和 last，用于记录首末元素。同时，定义内部类 Node，作为 LinkedList 中保存数据的基本结构

```java
	void addFirst(Object obj)
  void addLast(Object obj)
  Object getFirst()
  Object getLast()
  Object removeFirst()
  Object removeLast()
```

#### Vector

- Vector 是一个古老的集合，JDK1.0 就有了。大多数操作与 ArrayList 相同，区别之处在于 Vector 是线程安全的
- 在各种 list 中，最好把 ArrayList 作为缺省选择。当插入、删除频繁时，使用 LinkedList;Vector 总是比 ArrayList 慢，所以尽量避免使用

```java
	void addElement(Object obj)
  void insertElementAt(Object obj,int index)
  void setElementAt(Object obj,int index)
  void removeElement(Object obj)
  void removeAllElements()
```

### Set 接口

- Set 接口是 Collection 的子接口，set 接口没有提供额外的方法
- Set 集合不允许包含相同的元素，如果试把两个相同的元素加入同一个 Set 集合中，则添加操作失败
- Set 判断两个对象是否相同不是使用 == 运算符，而是根据 equals() 方法

#### HashSet

- HashSet 是 Set 接口的典型实现，大多数时候使用 Set 集合时都使用这个实现类。
- HashSet 按 Hash 算法来存储集合中的元素，因此具有很好的存取、查找、删除性能
- 对于存放在 Set 容器中的对象，对应的类一定要重写`equals()`和 hashCode(Object obj)方法，以实现对象相等规则。即： 「相等的对象必须具有相等的散列码」

##### 特点

- 不能保证元素的排列顺序
- HashSet 不是线程安全的
- 集合元素可以是 null

##### HashSet 集合判断两个元素相等的标准

两个对象通过 hashCode() 方法比较相等，并且两个对象的 equals() 方法返回值也相等

##### 向 HashSet 中添加元素的过程

1. 当向 `HashSet` 集合中存入一个元素时，`HashSet` 会调用该对象的 `hashCode()` 方法来得到该对象的 `hashCode` 值，然后根据 `hashCode` 值，通过某种散列函数决定该对象在 `HashSet` 底层数组中的存储位置。(这个散列函数会与底层数组的长度相计算得到在数组中的下标，并且这种散列函数计算还尽可能保证能均匀存储元素，越是散列分布，该散列函数设计的越好)
2. 如果两个元素的`hashCode()`值相等，会再继续调用`equals`方法，如果`equals`方法结果为`true`，添加失败；如果为`false`，那么会保存该元素，但是该数组的位置已经有元素了，那么会通过链表的方式继续链接。
3. 如果两个元素的 `equals()` 方法返回 `true`，但它们的 `hashCode()` 返回值不相等，`hashSet` 将会把它们存储在不同的位置，但依然可以添加成功。

> HashSet 底层也是数组，初始容量为 16，当如果使用率超过 0.75，(16\*0.75=12) 就会扩大容量为原来的 2 倍。(16 扩容为 32，依次为 64,128....等)

##### 重写 hashCode() 方法的基本原则

- 在程序运行时，同一个对象多次调用 hashCode() 方法应该返回相同的值。 当两个对象的 equals() 方法比较返回 true 时，这两个对象的 hashCode()
- 方法的返回值也应相等
- 对象中用作 equals() 方法比较的 Field，都应该用来计算 hashCode 值。

##### 重写 equals() 方法的基本原则

- 当一个类有自己特有的 「逻辑相等」概念,当改写 equals()的时候，总是要改写 hashCode()，根据一个类的 equals 方法(改写后)，两个截然不同的实例有可能在逻辑上是相等的，但是，根据 Object.hashCode()方法，它们仅仅是两个对象
- 复写 equals 方法的时候一般都需要同时复写 hashCode 方法。通常参与计算 hashCode 的对象的属性也应该参与到 equals()中进行计算

#### LinkedHashSet

- LinkedHashSet 根据元素的 hashCode 值来决定元素的存储位置，但它同时使用双向链表维护元素的次序，这使得元素看起来是以插入顺序保存的
- LinkedHashSet 插入性能略低于 HashSet，但在迭代访问 Set 里的全部元素时有很好的性能

#### TreeSet

- TreeSet 是 SortedSet 接口的实现类，TreeSet 可以确保集合元素处于排序状态
- TreeSet 底层使用红黑树结构存储数据
- TreeSet 两种排序方法：自然排序和定制排序。默认情况下，TreeSet 采用自然排序

```java
	Comparator comparator()
  Object first()
  Object last()
  Object lower(Object e)
  Object higher(Object e)
  SortedSet subSet(fromElement, toElement)
  SortedSet headSet(toElement)
  SortedSet tailSet(fromElement)
```

##### 自然排序

- 如果试图把一个对象添加到 `TreeSet` 时，则该对象的类必须实现 `Comparable` 接口
- `TreeSet` 判断两个对象是否相等的唯一标准是：两个对象通过 `compareTo(Object obj)` 方法比较返回值

##### 定制排序

- 通过`Comparator`接口来实现定制排序，重写`compare(T o1,T o2)`方法进行大小比较

  - 如果方法返回正整数，则表示 o1 大于 o2
  - 如果返回 0，表示相等
  - 返回负整数，表示 o1 小于 o2

- 要实现定制排序，需要将实现`Comparator`接口的实例作为形参传递给 TreeSet 的构造器

### Map

- Map 与 Collection 并列存在。用于保存具有映射关系的数据：key-value
- Map 中的 key 和 value 都可以是任何引用类型的数据
- Map 中的 key 用 Set 来存放，不允许重复，即同一个 Map 对象所对应的类，须重写 hashCode()和 equals()方法
- Map 接口的常用实现类：HashMap、TreeMap、LinkedHashMap 和 Properties。其中，HashMap 是 Map 接口使用频率最高的实现类

#### 接口继承树

![image-20210521131829094](https://gitee.com/lei451927/picture/raw/master/images/image-20210521131829094.png)

#### 常用方法

```java
// 添加、删除、修改操作
	// 将指定key-value添加到(或修改)当前map对象中
	Object put(Object key,Object value)
  // 将m中的所有key-value对存放到当前map中
  void putAll(Map m)
  // 移除指定key的key-value对，并返回value
	Object remove(Object key)
  // 清空当前map中的所有数据
	void clear()

// 元素查询的操作
	// 获取指定key对应的value
	Object get(Object key)
  // 是否包含指定的key
	boolean containsKey(Object key)
  // 是否包含指定的value
	boolean containsValue(Object value)
  // 返回map中key-value对的个数
	int size()
  // 判断当前map是否为空
	boolean isEmpty()
  // 判断当前map和参数对象obj是否相等
	boolean equals(Object obj)

// 元视图操作的方法
	// 返回所有key构成的Set集合
	Set keySet()
  // 返回所有value构成的Collection集合
	Collection values()
  // 返回所有key-value对构成的Set集合
  Set entrySet()

```

#### HashMap

- 允许使用 null 键和 null 值，与 HashSet 一样，不保证映射的顺序
- 所有的 key 构成的集合是 `Set`：无序的、不可重复的。所以 key 所在的类要重写 `equals()`和`hashCode()`
- 所有的 value 构成的集合是`Collection`：无序的、可以重复的。所以 value 所在的类要重写`equals()`
- 一个`key-value`构成一个`entry`，所有的 `entry` 构成的集合是`Set`：无序的、不可重复的
- HashMap 判断两个 key 相等的标准是：两个 key 通过 `equals()` 方法返回 true， `hashCode` 值也相等
- HashMap 判断两个 value 相等的标准是：两个 value 通过 `equals()` 方法返回 true

##### HashMap 的存储结构：JDK 1.8 之前

1.8 之前 HashMap 的存储结构其实是数组和链表的结合，实例化一个 HashMap 时，会创建一个长度为 Capacity 的 Entry 数组，这个长度在哈希表中被称为容量 (Capacity)，在这个数组中可以存放元素的位置我们称之为 「桶」(bucket)，每个 bucket 都有自己的索引，系统可以根据索引快速的查找 bucket 中的元素。

每个 bucket 中存储一个元素，即一个 Entry 对象，但每一个 Entry 对象可以带一个引用变量，用于指向下一个元素，因此，在一个桶中，就有可能生成一个 Entry 链。而且新添加的元素作为链表的 head。

##### 添加元素的过程

向 HashMap 中添加`entry1(key，value)`，需要首先计算 entry1 中 key 的哈希值(根据 key 所在类的`hashCode()`计算得到)，此哈希值经过处理以后，得到在底层`Entry[]`数组中要存储的位置`i`。如果位置`i`上没有元素，则`entry1`直接添加成功。如果位置`i`上已经存在`entry2`(或还有链表存在的`entry3`，`entry4`)，则需要通过循环的方法，依次比较`entry1`中 key 和其他的`entry`。如果彼此`hash`值不同，则直接添加成功。如果 `hash`值不同，继续比较二者是否`equals`。如果返回值为 true，则使用 entry1 的 value 去替换 equals 为 true 的 entry 的 value。如果遍历一遍以后，发现所有的 equals 返回都为 false,则 entry1 仍可添加成功。entry1 指向原有的 entry 元素。

##### HashMap 的扩容

当 HashMap 中的元素越来越多的时候，hash 冲突的几率也就越来越高，因为数组的长度是固定的。所以为了提高查询的效率，就要对 HashMap 的数组进行扩容，而在 HashMap 数组扩容之后，最消耗性能的点就出现了：原数组中的数据必须重新计算其在新数组中的位置，并放进去，这就是 resize。

那么 HashMap 什么时候进行扩容呢?

当 HashMap 中的元素个数超过数组大小(数组总大小 length,不是数组中个数 size)*loadFactor 时， 就会 进行 数组 扩容 ， loadFactor 的默 认值 (DEFAULT_LOAD_FACTOR)为 0.75，这是一个折中的取值。也就是说，默认情况下，数组大小(DEFAULT_INITIAL_CAPACITY)为 16，那么当 HashMap 中元素个数超过 16*0.75=12(这个值就是代码中的 threshold 值，也叫做临界值)的时候，就把数组的大小扩展为 2\*16=32，即扩大一倍，然后重新计算每个元素在数组中的位置，而这是一个非常消耗性能的操作，所以如果我们已经预知 HashMap 中元素的个数，那么预设元素的个数能够有效的提高 HashMap 的性能

##### HashMap 的存储结构：JDK 1.8

HashMap 的内部存储结构其实是**数组+链表+树**的结合。当实例化一个 HashMap 时，会初始化 initialCapacity 和 loadFactor，在 put 第一对映射关系时，系统会创建一个长度为 initialCapacity 的 Node 数组，这个长度在哈希表中被称为容量(Capacity)，在这个数组中可以存放元素的位置我们称之为 「桶」(bucket)，每个 bucket 都有自己的索引，系统可以根据索引快速的查找 bucket 中的元素。

每个 bucket 中存储一个元素，即一个 Node 对象，但每一个 Node 对象可以带一个引用变量 next，用于指向下一个元素，因此，在一个桶中，就有可能生成一个 Node 链。也可能是一个一个 TreeNode 对象，每一个 TreeNode 对象可以有两个叶子结点 left 和 right，因此，在一个桶中，就有可能生成一个 TreeNode 树。而新添加的元素作为链表的 last，或树的叶子结点

##### HashMap 扩容和树形化时机

当 HashMap 中的元素个数超过数组大小(数组总大小 length,不是数组中个数 size)*loadFactor 时， 就会 进行 数组 扩容 ， loadFactor 的默 认值 (DEFAULT_LOAD_FACTOR)为 0.75，这是一个折中的取值。也就是说，默认情况下，数组大小(DEFAULT_INITIAL_CAPACITY)为 16，那么当 HashMap 中元素个数超过 16*0.75=12(这个值就是代码中的 threshold 值，也叫做临界值) 的时候，就把数组的大小扩展为 2\*16=32，即扩大一倍，然后重新计算每个元素在数组中的位置，而这是一个非常消耗性能的操作，所以如果我们已经预知 HashMap 中元素的个数，那么预设元素的个数能够有效的提高 HashMap 的性能。

当 HashMap 中的其中一个链的对象个数如果达到了 8 个，此时如果 capacity 没有达到 64，那么 HashMap 会先扩容解决，如果已经达到了 64，那么这个链会变成树，结点类型由 Node 变成 TreeNode 类型。当然，如果当映射关系被移除后，下次 resize 方法时判断树的结点个数低于 6 个，也会把树再转为链表

##### 负载因子值的大小，对 HashMap 有什么影响

- 负载因子的大小决定了 HashMap 的数据密度。
- 负载因子越大密度越大，发生碰撞的几率越高，数组中的链表越容易长，造成查询或插入时的比较次数增多，性能会下降。
- 负载因子越小，就越容易触发扩容，数据密度也越小，意味着发生碰撞的几率越小，数组中的链表也就越短，查询和插入时比较的次数也越小，性能会更高。但是会浪费一定的内容空间。而且经常扩容也会影响性能，建议初始化预设大一点的空间。
- 按照其他语言的参考及研究经验，会考虑将负载因子设置为 0.7~0.75，此时平均检索长度接近于常数。

#### LinkedHashMap

- LinkedHashMap 是 HashMap 的子类
- 在 HashMap 存储结构的基础上，使用了一对双向链表来记录添加元素的顺序
- 与 LinkedHashSet 类似，LinkedHashMap 可以维护 Map 的迭代顺序：迭代顺序与 Key-Value 对的插入顺序一致

#### TreeMap

- TreeMap 存储 Key-Value 对时，需要根据 key-value 对进行排序。 TreeMap 可以保证所有的 Key-Value 对处于有序状态
- TreeSet 底层使用红黑树结构存储数据
- TreeMap 的 Key 的排序
  - 自然排序：TreeMap 的所有的 Key 必须实现 Comparable 接口，而且所有的 Key 应该是同一个类的对象，否则将会抛出 ClasssCastException
  - 定制排序：创建 TreeMap 时，传入一个 Comparator 对象，该对象负责对 TreeMap 中的所有 key 进行排序。此时不需要 Map 的 Key 实现 Comparable 接口
- TreeMap 判断两个 key 相等的标准：两个 key 通过 compareTo()方法或者 compare()方法返回 0

#### Hashtable

- Hashtable 是个古老的 Map 实现类，JDK1.0 就提供了。不同于 HashMap， Hashtable 是线程安全的。
- Hashtable 实现原理和 HashMap 相同，功能相同。底层都使用哈希表结构，查询速度快，很多情况下可以互用。
- 与 HashMap 不同，Hashtable 不允许使用 null 作为 key 和 value  与 HashMap 一样，Hashtable 也不能保证其中 Key-Value 对的顺序
- Hashtable 判断两个 key 相等、两个 value 相等的标准，与 HashMap 一致。

#### Properties

- Properties 类是 Hashtable 的子类，该对象用于处理属性文件
- 由于属性文件里的 key、value 都是字符串类型，所以 Properties 里的 key 和 value 都是字符串类型
- 存取数据时，建议使用 setProperty(String key,String value)方法和 getProperty(String key)方法

### Collections 工具类

- Collections 是一个操作 Set、List、Map 等集合的工具类
- Collections 中提供了一系列静态的方法对集合元素进行排序、查询和修改等操作，还提供了对集合对象设置不可变、对集合对象实现同步控制等方法

#### 常用方法

```java
// 排序操作（均为static方法）
  // 反转 List 中元素的顺序
  reverse(List)
  // 对 List 集合元素进行随机排序
  shuffle(List)
  // 根据元素的自然顺序对指定 List 集合元素按升序排序
  sort(List)
  // 根据指定的 Comparator 产生的顺序对 List 集合元素进行排序
  sort(List，Comparator)
  // 将指定 list 集合中的 i 处元素和 j 处元素进行交换查找、替换
  swap(List，int， int)

// 查找、替换
  // 根据元素的自然顺序，返回给定集合中的最大元素
  Object max(Collection)
  // 根据 Comparator 指定的顺序，返回给定集合中的最大元素
  Object max(Collection，Comparator)
  Object min(Collection)
  Object min(Collection，Comparator)
  // 返回指定集合中指定元素的出现次数
  int frequency(Collection，Object)
  // 将src中的内容复制到dest中
  void copy(List dest,List src)
  // 使用新值替换 List 对象的所有旧值
  boolean replaceAll(List list，Object oldVal，Object newVal)

```

#### 同步控制

Collections 类中提供了多个 `synchronizedXxx()` 方法，该方法可使将指定集合包装成线程同步的集合，从而可以解决多线程并发访问集合时的线程安全问题

![image-20210601200719776](https://gitee.com/lei451927/picture/raw/master/images/image-20210601200719776.png)

## 泛型

集合容器类在设计阶段/声明阶段不能确定这个容器到底实际存的是什么类型的对象，所以在 JDK1.5 之前只能把元素类型设计为`Object`，JDK1.5 之后使用泛型来解决

```java
ArrayList<Integer> list = new ArrayList<>();//类型推断
list.add(78);
list.add("88"); // 编译失败

// 泛型的声明
interface List<T>
class GenTest<K,V>
  // T只能是类，不能用基本数据类型填充，但可以使用包装类填充

// 泛型的实力化
List<String> strList = new ArrayList<String>();
Iterator<Customer> iterator = customers.iterator();
```

### 自定义泛型结构

1. 泛型类可能有多个参数，此时应将多个参数一起放在尖括号内。比如： `<E1,E2,E3>`

2. 泛型类的构造器如下：`publicGenericClass(){}`。这样是错误的：`public GenericClass<E>(){}`

3. 实例化后，操作原来泛型位置的结构必须与指定的泛型类型一致

4. 泛型不同的引用不能相互赋值

   - 尽管在编译时`ArrayList<String>`和`ArrayList<Integer>`是两种类型，但是，在运行时只有一个`ArrayList`被加载到`JVM`中

5. 泛型如果不指定，将被擦除，泛型对应的类型均按照 Object 处理，但不等价于 Object

   - 经验：泛型要使用一路都用。要不用，一路都不要用

6. 如果泛型结构是一个接口或抽象类，则不可创建泛型类的对象

7. jdk 1.7，泛型的简化操作：`ArrayList<Fruit> flist = new ArrayList<>()`

8. 泛型的指定中不能使用基本数据类型，可以使用包装类替换

9. 在类/接口上声明的泛型，在本类或本接口中即代表某种类型，可以作为非静态属性的类型、非静态方法的参数类型、非静态方法的返回值类型。但在**静态方法中不能使用类的泛型**

   ```java
   class Person<T> {
     // 用于变量
     private T info;
     // 用于方法
     public T getInfo() {return info;}
     // 用于构造器
     public Person(T info) {}

     // 不能用于static方法中
     public static void show (T t) {}
   }
   ```

10. 异常类不能是泛型的

11. 不能使用`new E[]`。但是可以：`E[] elements = (E[])new Object[capacity]`

12. 父类有泛型，子类可以选择保留泛型也可以选择指定泛型类型

    ```java
    		class Father<T1, T2> { }
    // 子类不保留父类的泛型
        // 1)没有类型擦除
        class Son1 extends Father {}
        // 等价于class Son extends Father<Object,Object>{ }
        // 2)具体类型
        class Son2 extends Father<Integer, String> { }

    // 子类保留父类的泛型
        // 1)全部保留
        class Son3<T1, T2> extends Father<T1, T2> { }
        // 2)部分保留
        class Son4<T2> extends Father<Integer, T2> { }
    ```

13. 无论是否为泛型类，方法都可以使用泛型

    ```java
    public class Test {
      public <E> E get(int id) {
     		E result = null;
        return result;
      }
    }
    ```

#### 泛型在继承上的体现

如果 B 是 A 的一个子类型(子类或者子接口)，而 G 是具有泛型声明的类或接口，`G<B>`并不是`G<A>`的子类型!

比如：String 是 Object 的子类，但是`List<String>`并不是`List<Object>`的子类

### 通配符

类型通配符：`?`

- `List<?>`是`List<String>`、`List<Object>`等各种泛型`List`的父类
- 读取`List<?>`的对象 list 中的元素时，永远是安全的，因为不管`list`的真实类型是什么，它包含的都是`Object`
- 写入`list`中的元素时不行。因为我们不知道`c`的元素类型，我们不能向其中添加对象。
  - 唯一的例外是 null，它是所有类型的成员

#### 注意点

```java
// 注意点1:编译错误：不能用在泛型方法声明上，返回值类型前面<>不能使用?
public static <?> void test(ArrayList<?> list){}

// 注意点2:编译错误：不能用在泛型类的声明上
class GenericTypeClass<?>{}

// 注意点3:编译错误：不能用在创建对象上，右边属于创建集合对象
ArrayList<?> list2 = new ArrayList<?>();
```

#### 有限制的通配符

- `<?>` 允许所有泛型的引用调用
- 通配符指定上限

  - `extends`：使用时指定的类型必须是继承某个类，或者实现某个接口，即 `<=`
  - `<? extends Number> (无穷小 , Number]`
  - 允许泛型为 Number 及 Number 子类的引用调用

- 通配符指定下限
  - `super`：使用时指定的类型不能小于操作的类，即 `>=`
  - `<? super Number> [Number , 无穷大)`
  - 只允许泛型为 Number 及 Number 父类的引用调用

## IO 流

### File 类

- 文件和文件目录路径的抽象表示形式，与平台无关
- File 能新建、删除、重命名文件和目录，但 File **不能访问文件内容本身**。如果需要访问文件内容本身，则需要使用输入/输出流

#### 常用构造器

```java
/*
  以pathname为路径创建File对象，可以是绝对路径或者相对路径
  如果 pathname是相对路径，则默认的当前路径在系统属性user.dir中存储
*/
public File(String pathname)

// 以parent为父路径，child为子路径创建File对象
public File(String parent,String child)

// 根据一个父File对象和子文件路径创建File对象
public File(File parent,String child)
```

#### 路径分隔符

windows 和 DOS 系统默认使用 「\」来表示，UNIX 和 URL 使用 「/」来表示，为了解决这个问题，File 类提供了一个常量：`public static final String separator`

```java
new File("d:" + File.separator + "atguigu" + File.separator + "info.txt");
```

#### 常用方法

```java
// File类的获取功能
    // 获取绝对路径
    public String getAbsolutePath()
    // 获取路径
    public String getPath()
    // 获取名称
    public String getName()
    // 获取上层文件目录路径。若无，返回null
    public String getParent()
    // 获取文件长度(即：字节数)。不能获取目录的长度。
    public long length()
    // 获取最后一次的修改时间，毫秒值
    public long lastModified()
    // 获取指定目录下的所有文件或者文件目录的名称数组
    public String[] list()
    // 获取指定目录下的所有文件或者文件目录的File数组
    public File[] listFiles()


// File类的重命名功能
    // 把文件重命名为指定的文件路径
    public boolean renameTo(File dest)


// File类的判断功能
    // 判断是否是文件目录
    public boolean isDirectory()
    // 判断是否是文件
    public boolean isFile()
    // 判断是否存在
    public boolean exists()
    // 判断是否可读
    public boolean canRead()
    // 判断是否可写
    public boolean canWrite()
    // 判断是否隐藏
    public boolean isHidden()


// File类的创建功能
    // 创建文件。若文件存在，则不创建，返回false
    public boolean createNewFile()
    // 创建文件目录。如果此文件目录存在，就不创建了。如果此文件目录的上层目录不存在，也不创建。
    public boolean mkdir()
    // 创建文件目录。如果上层文件目录不存在，一并创建
    public boolean mkdirs()


// File类的删除功能
    // 删除文件或者文件夹
    public boolean delete()
/*
删除注意事项：
	Java中的删除不走回收站。要删除一个文件目录，请注意该文件目录内不能包含文件或者文件目录
/*
```

### IO 流原理及流的分类

#### Java IO 原理

- I/O 是 Input/Output 的缩写，用于处理设备之间的数据传输。如读/写文件，网络通讯等

- Java 程序中，对于数据的输入/输出操作以 「流(stream)」的 方式进行。
- java.io 包下提供了各种 「流」类和接口，用以获取不同种类的数据，并通过标准的方法输入或输出数据

#### 流的分类

- 按操作数据单位不同分为：字节流(8 bit)，字符流(16 bit)
- 按数据流的流向不同分为：输入流，输出流
- 按流的角色的不同分为：节点流，处理流

| (抽象基类) | 字节流       | 字符流 |
| ---------- | ------------ | ------ |
| 输入流     | InputStream  | Reader |
| 输出流     | OutputStream | Writer |

1. Java 的 IO 流共涉及 40 多个类，实际上非常规则，都是从如下 4 个抽象基类派生的。
2. 由这四个类派生出来的子类名称都是以其父类名作为子类名后缀

![image-20210602205529551](https://gitee.com/lei451927/picture/raw/master/images/image-20210602205529551.png)

![image-20210602205608988](https://gitee.com/lei451927/picture/raw/master/images/image-20210602205608988.png)

### InputStream & Reader

- `InputStream` 和 `Reader` 是所有输入流的基类。

- 程序中打开的文件 IO 资源不属于内存里的资源，**垃圾回收机制无法回收该资源**，所以应该显式关闭文件 IO 资源。

- `FileInputStream` 从文件系统中的某个文件中获得输入字节。`FileInputStream` 用于读取非文本数据之类的原始字节流。要读取字符流，需要使用 `FileReader`

### InputStream

```java
/*
从输入流中读取数据的下一个字节
返回 0 到 255 范围内的 int 字节值
如果因为已经到达流末尾而没有可用的字节，则返回值 -1。
*/
int read()

/*
从此输入流中将最多 b.length 个字节的数据读入一个 byte 数组中
如果因为已经到达流末尾而没有可用的字节，则返回值 -1
否则以整数形式返回实际读取的字节数
*/
int read(byte[] b)

/*
将输入流中最多 len 个数据字节读入 byte 数组
尝试读取 len 个字节，但读取的字节也可能小于该值
以整数形式返回实际读取的字节数
如果因为流位于文件末尾而没有可用的字节，则返回值 -1
*/
int read(byte[] b, int off, int len

// 关闭此输入流并释放与该流关联的所有系统资源
public void close() throws IOException
```

### Reader

```java
/*
读取单个字符
作为整数读取的字符，范围在 0 到 65535 之间 (0x00-0xffff)(2个字节的Unicode码)
如果已到达流的末尾，则返回 -1
*/
int read()

/*
将字符读入数组。如果已到达流的末尾，则返回 -1
否则返回本次读取的字符数
*/
int read(char[] cbuf)

/*
将字符读入数组的某一部分
存到数组cbuf中，从off处开始存储，最多读len个字符
如果已到达流的末尾，则返回 -1
否则返回本次读取的字符数。
*/
int read(char[] cbuf,int off,int len)

// 关闭此输入流并释放与该流关联的所有系统资源
public void close() throws IOException
```

### OutputStream & Writer

- 因为字符流直接以字符作为操作单位，所以 `Writer` 可以用字符串来替换字符数组，即以 `String` 对象作为参数

- `FileOutputStream` 从文件系统中的某个文件中获得输出字节。`FileOutputStream`

  用于写出非文本数据之类的原始字节流。要写出字符流，需要使用 `FileWriter`

### OutputStream

```java
/*
将指定的字节写入此输出流
write 的常规协定是：向输出流写入一个字节
要写入的字节是参数 b 的八个低位
b 的 24 个高位将被忽略
即写入0~255范围的
*/
void write(int b)

/*
将 b.length 个字节从指定的 byte 数组写入此输出流
write(b) 的常规协定是：应该与调用 write(b, 0, b.length) 的效果完全相同。
*/
void write(byte[] b)

/*
将指定 byte 数组中从偏移量 off 开始的 len 个字节写入此输出流。
*/
void write(byte[] b,int off,int len)

/*
刷新此输出流并强制写出所有缓冲的输出字节
调用此方法指示应将这些字节立即写入它们预期的目标
*/
public void flush()throws IOException

// 关闭此输出流并释放与该流关联的所有系统资源。
public void close() throws IOException
```

### Writer

```java
/*
写入单个字符。要写入的字符包含在给定整数值的 16 个低位中，16 高位被忽略
即写入0 到 65535 之间的Unicode码
*/
void write(int c)

// 写入字符数组
void write(char[] cbuf)

// 写入字符数组的某一部分。从off开始，写入len个字符
void write(char[] cbuf,int off,int len)

// 写入字符串
void write(String str)

// 写入字符串的某一部分
void write(String str,int off,int len)

// 刷新该流的缓冲，则立即将它们写入预期目标
void flush()

// 关闭此输出流并释放与该流关联的所有系统资源
public void close() throws IOException

```

### 节点流

直接从数据源或目的地读写数据

#### 读取文件

```java
// 1.建立一个流对象，将已存在的一个文件加载进流。
FileReader fr = new FileReader(new File("Test.txt"));
// 2.创建一个临时存放数据的数组。
char[] ch = new char[1024];
// 3.调用流对象的读取方法将流中的数据读入到数组中。
fr.read(ch);
// 4. 关闭资源。
fr.close();

FileReader fr = null;
try {
	fr = new FileReader(new File("c:\\test.txt"));
  char[] buf = new char[1024];
	int len;
	while ((len = fr.read(buf)) != -1) {
  	System.out.print(new String(buf, 0, len));
  }
} catch (IOException e) {
	System.out.println("read-Exception :" + e.getMessage());
} finally {
  if (fr != null) {
  try {
      fr.close();
  } catch (IOException e) {
    	System.out.println("close-Exception :" + e.getMessage());
    }
  }
}
```

#### 写入文件

```java
// 1.创建流对象，建立数据存放文件
	FileWriter fw = new FileWriter(new File("Test.txt"));
// 2.调用流对象的写入方法，将数据写入流
  fw.write("atguigu-songhongkang");
// 3.关闭流资源，并将流中的数据清空到文件中。
  fw.close();


FileWriter fw = null;
try {
  fw = new FileWriter(new File("Test.txt"));
  fw.write("atguigu-songhongkang");
} catch (IOException e) {
	e.printStackTrace();
} finally {
    if (fw != null)
        try {
          fw.close();
        } catch (IOException e) {
					e.printStackTrace();
        }
}
```

### 处理流

不直接链接到数据源或目的地，而是链接到已存在的流「节点流或处理流」之上，通过对数据的处理为程序提供更强大的读写功能。

#### 缓冲流

- 为了提高数据读写的速度，Java API 提供了带缓冲功能的流类，在使用这些流类时，会创建一个内部缓冲区数组，缺省使用 8192 个字节(8Kb)的缓冲区
- 缓冲流要 「套接」在相应的节点流之上，根据数据操作单位可以把缓冲流分为：
  - `BufferedInputStream` 和 `BufferedOutputStream`
  - `BufferedReader` 和 `BufferedWriter`
- 当读取数据时，数据按块读入缓冲区，其后的读操作则直接访问缓冲区
- 当使用`BufferedInputStream`读取字节文件时，`BufferedInputStream`会一次性从文件中读取`8192个(8Kb)`，存在缓冲区中，直到缓冲区装满了，才重新从文件中读取下一个`8192`个字节数组
- 向流中写入字节时，不会直接写到文件，先写到缓冲区中直到缓冲区写满， `BufferedOutputStream`才会把缓冲区中的数据一次性写到文件里。使用方法 `flush()`可以强制将缓冲区的内容全部写入输出流
- 关闭流的顺序和打开流的顺序相反。只要关闭最外层流即可，关闭最外层流也会相应关闭内层节点流
- `flush()`方法的使用：手动将`buffer`中内容写入文件
- 如果是带缓冲区的流对象的`close()`方法，不但会关闭流，还会在关闭流之前刷新缓冲区，关闭后不能再写出

```java
BufferedReader br = null;
BufferedWriter bw = null;
try {
  // 创建缓冲流对象：它是处理流，是对节点流的包装
  br = new BufferedReader(new FileReader("d:\\IOTest\\source.txt"));
  bw = new BufferedWriter(new FileWriter("d:\\IOTest\\dest.txt"));
  String str;
  while ((str = br.readLine()) != null) { // 一次读取字符文本文件的一行字符
    bw.write(str); // 一次写入一行字符串
    bw.newLine(); // 写入行分隔符
  }
  bw.flush(); // 刷新缓冲区
} catch (IOException e) {
  e.printStackTrace();
} finally {
  // 关闭IO流对象
  try {
    if (bw != null) {
      bw.close(); // 关闭过滤流时,会自动关闭它所包装的底层节点流
    }
  } catch (IOException e) {
  	e.printStackTrace();
  }
  try {
  	if (br != null) {
      br.close();
    }
  } catch (IOException e) {
    e.printStackTrace();
  }
}
```

#### 转换流

- 转换流提供了在字节流和字符流之间的转换

- 字节流中的数据都是字符时，转成字符流操作更高效

- 很多时候我们使用转换流来处理文件乱码问题。实现编码和解码的功能

- Java API 提供了两个转换流：

  - `InputStreamReader`：将`InputStream`转换为`Reader`

    - 实现将字节的输入流按指定字符集转换为字符的输入流

      ```java
      public InputStreamReader(InputStream in)
      public InputSreamReader(InputStream in,String charsetName)

      Reader isr = new InputStreamReader(System.in,”gbk”);
      ```

  - `OutputStreamWriter`：将`Writer`转换为`OutputStream`

    - 实现将字符的输出流按指定字符集转换为字节的输出流

      ```java
      public OutputStreamWriter(OutputStream out)
      public OutputSreamWriter(OutputStream out,String charsetName)
      ```

```java
public void testMyInput() throws Exception {
  FileInputStream fis = new FileInputStream("dbcp.txt");
  FileOutputStream fos = new FileOutputStream("dbcp5.txt");
  InputStreamReader isr = new InputStreamReader(fis, "GBK");
  OutputStreamWriter osw = new OutputStreamWriter(fos, "GBK");
  BufferedReader br = new BufferedReader(isr);
  BufferedWriter bw = new BufferedWriter(osw);
	String str = null;
	while ((str = br.readLine()) != null) {
        bw.write(str);
        bw.newLine();
        bw.flush();
	}
  bw.close();
  br.close();
}
```

#### 标准输入、输出流

- `System.in`和`System.out`分别代表了系统标准的输入和输出设备
- `System.in`的类型是`InputStream``
- `System.out`的类型是`PrintStream`，其是`OutputStream`的子类，`FilterOutputStream` 的子类

- 重定向：通过`System`类的`setIn`，`setOut`方法对默认设备进行改变。
  - `public static void setIn(InputStream in)`
  - `public static void setOut(PrintStream out)`

```java
System.out.println("请输入信息(退出输入e或exit):");
// 把"标准"输入流(键盘输入)这个字节流包装成字符流,再包装成缓冲流
BufferedReader br = new BufferedReader(new InputStreamReader(System.in)); String s = null;
try {
	while ((s = br.readLine()) != null) { // 读取用户输入的一行数据 --> 阻塞程序
    if ("e".equalsIgnoreCase(s) || "exit".equalsIgnoreCase(s)) {
    	System.out.println("安全退出!!");
      break;
    }
		// 将读取到的整行字符串转成大写输出
    System.out.println("-->:" + s.toUpperCase());
    System.out.println("继续输入信息");
  }
} catch (IOException e) {
  e.printStackTrace();
} finally {
  try {
      if (br != null) {
  			br.close(); // 关闭过滤流时,会自动关闭它包装的底层节点流
      }
  } catch (IOException e) {
    e.printStackTrace();
  }
}
```

#### 打印流

- 实现将基本数据类型的数据格式转化为字符串输出
- `PrintStream`和`PrintWriter`
  - 提供了一系列重载的`print()`和`println()`方法，用于多种数据类型的输出
  - `PrintStream`和`PrintWriter`的输出不会抛出`IOException`异常
  - `PrintStream`和`PrintWriter`有自动`flush`功能
  - `PrintStream` 打印的所有字符都使用平台的默认字符编码转换为字节。在需要写入字符而不是写入字节的情况下，应该使用 `PrintWriter` 类。
  - `System.out`返回的是`PrintStream`的实例

```java
PrintStream ps = null;
try {
	FileOutputStream fos = new FileOutputStream(new File("D:\\IO\\text.txt"));
  // 创建打印输出流,设置为自动刷新模式(写入换行符或字节 '\n' 时都会刷新输出缓冲区)
  ps = new PrintStream(fos, true);
	if (ps != null) {// 把标准输出流(控制台输出)改成文件
		System.setOut(ps);
  }
	for (int i = 0; i <= 255; i++) { // 输出ASCII字符
    System.out.print((char) i);
    if (i % 50 == 0) { // 每50个数据一行
    	System.out.println(); // 换行
    }
  }
} catch (FileNotFoundException e) {
  e.printStackTrace();
} finally {
  if (ps != null) {
    ps.close();
  }
}
```

#### 数据流

- 为了方便地操作 Java 语言的基本数据类型和 String 的数据，可以使用数据流

- 数据流有两个类：(用于读取和写出基本数据类型、String 类的数据)

  - `DataInputStream` 和 `DataOutputStream`

  - 分别 「套接」在 `InputStream` 和 `OutputStream` 子类的流上

  - `DataInputStream`中的方法（`DataOutputStream`将`read`改为`write`即可）

```java
boolean readBoolean()
char readChar()
double readDouble()
long readLong()
String readUTF()
byte readByte()
float readFloat()
short readShort()
int readInt()
void readFully(byte[] b)

DataOutputStream dos = null;
try { // 创建连接到指定文件的数据输出流对象
  dos = new DataOutputStream(new FileOutputStream("destData.dat")); 		dos.writeUTF("我爱北京天安门"); // 写UTF字符串
  dos.writeBoolean(false); // 写入布尔值
  dos.writeLong(1234567890L); // 写入长整数
  System.out.println("写文件成功!");
} catch (IOException e) {
	e.printStackTrace();
} finally { // 关闭流对象
  try {
    if (dos != null) {
    	// 关闭过滤流时,会自动关闭它包装的底层节点流
    	dos.close();
    }
  } catch (IOException e) {
  	e.printStackTrace();
  }
}
```

#### 对象流

- `ObjectInputStream`和`OjbectOutputSteam`
- 用于存储和读取基本数据类型数据或对象的处理流。它的强大之处就是可以把 Java 中的对象写入到数据源中，也能把对象从数据源中还原回来
- 序列化：用`ObjectOutputStream`类保存基本类型数据或对象的机制
- 反序列化：用`ObjectInputStream`类读取基本类型数据或对象的机制
- `ObjectOutputStream`和`ObjectInputStream`**不能序列化`static`和`transient`**修饰的成员变量

##### 对象的序列化

- 对象序列化机制允许把内存中的 Java 对象转换成平台无关的二进制流，从而允许把这种二进制流持久地保存在磁盘上，或通过网络将这种二进制流传输到另一个网络节点。当其它程序获取了这种二进制流，就可以恢复成原来的 Java 对象
- 序列化的好处在于可将任何实现了`Serializable`接口的对象转化为字节数据，使其在保存和传输时可被还原
- 序列化是 `RMI(Remote Method Invoke –远程方法调用)`过程的参数和返回值都必须实现的机制，而 `RMI` 是 `JavaEE` 的基础。因此序列化机制是 `JavaEE` 平台的基础
- 如果需要让某个对象支持序列化机制，则必须让对象所属的类及其属性是可序列化的，为了让某个类是可序列化的，该类必须实现如下两个接口之一。否则，会抛出`NotSerializableException`异常

  - `Serializable`
  - `Externalizable`

- 凡是实现`Serializable`接口的类都有一个表示序列化版本标识符的静态变量
  - `private static final long serialVersionUID`
  - `serialVersionUID`用来表明类的不同版本间的兼容性。简言之，其目的是以序列化对象进行版本控制，有关各版本反序列化时是否兼容。
  - 如果类没有显示定义这个静态常量，它的值是 Java 运行时环境根据类的内部细节自动生成的。若类的实例变量做了修改，`serialVersionUID` 可能发生变化。故建议，显式声明。
- 简单来说，Java 的序列化机制是通过在运行时判断类的`serialVersionUID`来验证版本一致性的。在进行反序列化时，JVM 会把传来的字节流中的 `serialVersionUID`与本地相应实体类的`serialVersionUID`进行比较，如果相同就认为是一致的，可以进行反序列化，否则就会出现序列化版本不一致的异常`InvalidCastException`

##### 使用对象流序列化对象

```java
// 序列化
  // 创建一个 ObjectOutputStream
  ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("data.txt"));
  Person p = new Person("韩梅梅", 18, "中华大街", new Pet());
  // 调用 ObjectOutputStream 对象的 writeObject(对象) 方法输出可序列化对象
  oos.writeObject(p);
  // 注意写出一次，操作flush()一次
  oos.flush();
  oos.close();


// 反序列化
	// 创建一个 ObjectInputStream
  ObjectInputStream ois = new ObjectInputStream(new FileInputStream("data.txt"));
  // 调用 readObject() 方法读取流中的对象
  Person p1 = (Person)ois.readObject();
  System.out.println(p1.toString());
  ois.close();
```

### 随机存取文件流

- `RandomAccessFile` 类声明在 java.io 包下，但直接继承于`java.lang.Object`类。并且它实现了`DataInput`、`DataOutput`这两个接口，也就意味着这个类既可以读也可以写。
- `RandomAccessFile` 类支持 「随机访问」的方式，程序可以直接跳到文件的任意地方来读、写文件
  - 支持只访问文件的部分内容
  - 可以向已存在的文件后追加内容
- `RandomAccessFile` 对象包含一个记录指针，用以标示当前读写处的位置。 `RandomAccessFile` 类对象可以自由移动记录指针：
  - `long getFilePointer()`:获取文件记录指针的当前位置
  - `void seek(long pos)`:将文件记录指针定位到 pos 位置

```java
/*
创建 RandomAccessFile 类实例需要指定一个 mode 参数，该参数指定 RandomAccessFile 的访问模式：
	r: 以只读方式打开
	rw:打开以便读取和写入
	rwd:打开以便读取和写入;同步文件内容的更新
	rws:打开以便读取和写入;同步文件内容和元数据的更新

如果模式为只读r。则不会创建文件，而是会去读取一个已经存在的文件，如果读取的文件不存在则会出现异常
如果模式为rw读写。如果文件不存在则会去创建文件，如果存在则不会创建
*/
public RandomAccessFile(File file, String mode)
public RandomAccessFile(String name, String mode)

// 读取文件内容
RandomAccessFile raf = new RandomAccessFile("test.txt", "rw");
raf.seek(5);
byte [] b = new byte[1024];
int off = 0;
int len = 5;
raf.read(b, off, len);
String str = new String(b, 0, len);
System.out.println(str);
raf.close();

// 写入文件内容
RandomAccessFile raf = new RandomAccessFile("test.txt", "rw");
raf.seek(5);
//先读出来
String temp = raf.readLine();
raf.seek(5);
raf.write("xyz".getBytes());
raf.write(temp.getBytes());
raf.close();
```

### NIO.2 中 Path、 Paths、Files 类的使用

- `Java NIO (New IO，Non-Blocking IO)`是从 Java 1.4 版本开始引入的一套新的 IO API，可以替代标准的 Java IO API。NIO 与原来的 IO 有同样的作用和目的，但是使用的方式完全不同，NIO 支持面向缓冲区的(IO 是面向流的)、基于通道的 IO 操作。NIO 将以更加高效的方式进行文件的读写操作。
- Java API 中提供了两套 NIO，一套是针对标准输入输出 NIO，另一套就是网络编程 NIO。
  - `java.nio.channels.Channel`
    - `FileChannel`:处理本地文件
    - `SocketChannel`:TCP 网络编程的客户端的 Channel
    - `ServerSocketChannel`:TCP 网络编程的服务器端的 Channel
    - `DatagramChannel`:UDP 网络编程中发送端和接收端的 Channel

#### Path、Paths 和 Files 核心 API

- 早期的 Java 只提供了一个 File 类来访问文件系统，但 File 类的功能比较有限，所提供的方法性能也不高。而且，大多数方法在出错时仅返回失败，并不会提供异常信息。

- NIO. 2 为了弥补这种不足，引入了 Path 接口，代表一个平台无关的平台路径，描述了目录结构中文件的位置。Path 可以看成是 File 类的升级版本，实际引用的资源也可以不存在。

  - 在以前 IO 操作都是这样写的

    ```java
    import java.io.File;
    File file = new File("index.html");
    ```

  - 但在 Java7 中，我们可以这样写

    ```java
    import java.nio.file.Path;
    import java.nio.file.Paths;
    Path path = Paths.get("index.html");
    ```

- NIO.2 在 java.nio.file 包下还提供了 Files、Paths 工具类，Files 包含了大量静态的工具方法来操作文件;Paths 则包含了两个返回 Path 的静态工厂方法。

- Paths 类提供的静态 get() 方法用来获取 Path 对象

  - `static Path get(String first, String ... more)` : 用于将多个字符串串连成路径
  - `static Path get(URI uri)`: 返回指定 uri 对应的 Path 路径

```java
// Path 常用方法：
    // 返回调用 Path 对象的字符串表示形式
    String toString()
    // 判断是否以 path 路径开始
    boolean startsWith(String path)
    // 判断是否以 path 路径结束
    boolean endsWith(String path)
    // 判断是否是绝对路径
    boolean isAbsolute()
    // 返回Path对象包含整个路径，不包含 Path 对象指定的文件路径
    Path getParent()
    // 返回调用 Path 对象的根路径
    Path getRoot()
    // 返回与调用 Path 对象关联的文件名
    Path getFileName()
    // 返回Path 根目录后面元素的数量
    int getNameCount()
    // 返回指定索引位置 idx 的路径名称
    Path getName(int idx)
    // 作为绝对路径返回调用 Path 对象
    Path toAbsolutePath()
    // 合并两个路径，返回合并后的路径对应的Path对象
    Path resolve(Path p)
    // 将Path转化为File类的对象
    File toFile()


// java.nio.file.Files 用于操作文件或目录的工具类
// Files常用方法
    // 文件的复制
    Path copy(Path src, Path dest, CopyOption ... how)
    // 创建一个目录
    Path createDirectory(Path path, FileAttribute<?> ... attr)
    // 创建一个文件
    Path createFile(Path path, FileAttribute<?> ... arr)
    // 删除一个文件/目录，如果不存在，执行报错
    void delete(Path path)
    // Path对应的文件/目录如果存在，执行删除
    void deleteIfExists(Path path)
    // 将 src 移动到 dest 位置
    Path move(Path src, Path dest, CopyOption...how)
    // 返回 path 指定文件的大小
    long size(Path path)


// Files常用方法：用于判断
    // 判断文件是否存在
    boolean exists(Path path, LinkOption ... opts)
    // 判断是否是目录
    boolean isDirectory(Path path, LinkOption ... opts)
    // 判断是否是文件
    boolean isRegularFile(Path path, LinkOption ... opts)
    // 判断是否是隐藏文件
    boolean isHidden(Path path)
    // 判断文件是否可读
    boolean isReadable(Path path)
    // 判断文件是否可写
    boolean isWritable(Path path)
    // 判断文件是否不存在
    boolean notExists(Path path, LinkOption ... opts)


// Files常用方法：用于操作内容
    // 获取与指定文件的连接，how 指定打开方式。
    SeekableByteChannel newByteChannel(Path path, OpenOption...how)
    // 打开 path 指定的目录
    DirectoryStream<Path> newDirectoryStream(Path path)
    // 获取 InputStream 对象
    InputStream newInputStream(Path path, OpenOption...how)
    // 获取 OutputStream 对象
    OutputStream newOutputStream(Path path, OpenOption...how)
```

## 网络编程

### InetAddress

- `InetAddress` 类表示 IP 地址，两个子类：`Inet4Address`、`Inet6Address`
- `InetAddress`类没有提供公共的构造器，而是提供了如下几个静态方法来获取 `InetAddress`实例
  - `public static InetAddress getLocalHost()`
  - `public static InetAddress getByName(String host)`
- `InetAddress`提供了如下几个常用的方法
  - `public String getHostAddress()`:返回 IP 地址字符串(以文本表现形式)。
  - `public String getHostName()`:获取此 IP 地址的主机名
  - `public boolean isReachable(int timeout)`:测试是否可以达到该地址

### Socket

- 网络上具有唯一标识的 IP 地址和端口号组合在一起才能构成唯一能识别的标识符套接字
- 通信的两端都要有 Socket，是两台机器间通信的端点，网络通信其实就是 Socket 间的通信
- Socket 允许程序把网络连接当成一个流，数据在两个 Socket 间通过 IO 传输
- Socket 分类
  - 流套接字(stream socket):使用 TCP 提供可依赖的字节流服务
  - 数据报套接字(datagram socket):使用 UDP 提供 「尽力而为」的数据报服务

```java
// Socket类的常用构造器：
    // 创建一个流套接字并将其连接到指定 IP 地址的指定端口号。
    public Socket(InetAddress address,int port)
    // 创建一个流套接字并将其连接到指定主机上的指定端口号。
    public Socket(String host,int port)

// Socket类的常用方法：
    // 返回此套接字的输入流。可以用于接收网络消息
    public InputStream getInputStream()
    // 返回此套接字的输出流。可以用于发送网络消息
    public OutputStream getOutputStream()
    // 此套接字连接到的远程 IP 地址;如果套接字是未连接的，则返回 null。
    public InetAddress getInetAddress()
    // 获取套接字绑定的本地地址。即本端的IP地址
    public InetAddress getLocalAddress()
    // 此套接字连接到的远程端口号;如果尚未连接套接字，则返回 0。
    public int getPort()
    // 返回此套接字绑定到的本地端口。如果尚未绑定套接字，则返回 -1。即本端的端口号。
    public int getLocalPort()
    // 关闭此套接字。套接字被关闭后，便不可在以后的网络连接中使用(即无法重新连接或重新绑定)。需要创建新的套接字对象。关闭此套接字也将会关闭该套接字的 InputStream 和 OutputStream
    public void close()
    // 如果在套接字上调用 shutdownInput() 后从套接字输入流读取内容，则流将返回 EOF(文件结束符)。即不能在从此套接字的输入流中接收任何数据。
    public void shutdownInput()
    // 禁用此套接字的输出流。对于 TCP 套接字，任何以前写入的数据都将被发送，并且后跟 TCP 的正常连接终止序列。如果在套接字上调用 shutdownOutput() 后写入套接字输出流，则该流将抛出 IOException。即不能通过此套接字的输出流发送任何数据。
    public void shutdownOutput()
```

### TCP

![image-20210608195711187](https://gitee.com/lei451927/picture/raw/master/images/image-20210608195711187.png)

#### 客户端

1. 创建 Socket:根据指定服务端的 IP 地址或端口号构造 Socket 类对象。若服务器端响应，则建立客户端到服务器的通信线路。若连接失败，会出现异常。

2. 打开连接到 Socket 的输入/出流： 使用 getInputStream()方法获得输入流，使用 getOutputStream()方法获得输出流，进行数据传输

3. 按照一定的协议对 Socket 进行读/写操作：通过输入流读取服务器放入线路的信息 (但不能读取自己放入线路的信息)，通过输出流将信息写入线程。

4. 关闭 Socket:断开客户端到服务器的连接，释放线路

   ```java
   Socket s = new Socket("192.168.40.165",9999);
   OutputStream out = s.getOutputStream();
   out.write(" hello".getBytes());
   s.close();
   ```

#### 服务端

1. 调用 ServerSocket(int port) :创建一个服务器端套接字，并绑定到指定端口上。用于监听客户端的请求。

2. 调用 accept():监听连接请求，如果客户端请求连接，则接受连接，返回通信套接字对象。

3. 调用该 Socket 类对象的 getOutputStream() 和 getInputStream ():获取输出流和输入流，开始网络数据的发送和接收。

4. 关闭 ServerSocket 和 Socket 对象：客户端访问结束，关闭通信套接字

   ```java
   ServerSocket ss = new ServerSocket(9999);
   Socket s = ss.accept ();
   InputStream in = s.getInputStream();
   byte[] buf = new byte[1024];
   int num = in.read(buf);
   String str = new String(buf,0,num); System.out.println(s.getInetAddress().toString()+”：”+str);
   s.close();
   ss.close();
   ```

![image-20210608200423808](https://gitee.com/lei451927/picture/raw/master/images/image-20210608200423808.png)

### UDP

- UDP 数据报通过数据报套接字 DatagramSocket 发送和接收，系统不保证 UDP 数据报一定能够安全送到目的地，也不能确定什么时候可以抵达

- UDP 协议中每个数据报都给出了完整的地址信息，因此无须建立发送方和接收方的连接。如同发快递包裹一样

  ```java
  // 创建数据报套接字并将其绑定到本地主机上的指定端口。套接字将被绑定到通配符地址，IP 地址由内核来选择。
  public DatagramSocket(int port)
  // 创建数据报套接字，将其绑定到指定的本地地址。本地端口必须在 0 到 65535 之间(包括两者)。如果 IP 地址为 0.0.0.0，套接字将被绑定到通配符地址，IP 地址由内核选择q。
  public DatagramSocket(int port,InetAddress laddr)
  // 关闭此数据报套接字。
  public void close()
  // 从此套接字发送数据报包。DatagramPacket 包含的信息指示：将要发送的数据、其长度、远程主机的 IP 地址和远程主机的端口号。
  public void send(DatagramPacket p)

  // 从此套接字接收数据报包。当此方法返回时，DatagramPacket的缓冲区填充了接收的数据。数据报包也包含发送方的 IP 地址和发送方机器上的端口号。此方法在接收到数据报前一直阻塞。数据报包对象的 length 字段包含所接收信息的长度。如果信息比包的长度长，该信息将被截短。
  public void receive(DatagramPacket p)
  // 获取套接字绑定的本地地址。
  public InetAddress getLocalAddress()
  // 返回此套接字绑定的本地主机上的端口号。
  public int getLocalPort()
  // 返回此套接字连接的地址。如果套接字未连接，则返回 null。
  public InetAddress getInetAddress()
  // 返回此套接字的端口。如果套接字未连接，则返回 -1。
  public int getPort()
  // 构造 DatagramPacket，用来接收长度为 length 的数据包。 length 参数必须小于等于 buf.length。
  public DatagramPacket(byte[] buf,int length)
  // 构造数据报包，用来将长度为 length 的包发送到指定主机上的指定端口号。length 参数必须小于等于 buf.length。
  public DatagramPacket(byte[] buf,int length,InetAddress address,int port)
  // 返回某台机器的 IP 地址，此数据报将要发往该机器或者是从该机器接收到的。
  public InetAddress getAddress()
  // 返回某台远程主机的端口号，此数据报将要发往该主机或者是从该主机接收到的。
  public int getPort()
  // 返回数据缓冲区。接收到的或将要发送的数据从缓冲区中的偏移量 offset 处开始，持续 length 长度。
  public byte[] getData()
  // 返回将要发送或接收到的数据的长度
  public int getLength()
  ```

#### 流程

1. DatagramSocket 与 DatagramPacket
2. 建立发送端，接收端
3. 建立数据包
4. 调用 Socket 的发送、接收方法 5. 关闭 Socket

发送端与接收端是两个独立的运行程序

```java
// 发送端
DatagramSocket ds = null;
try {
  ds = new DatagramSocket();
  byte[] by = "hello,atguigu.com".getBytes();
  DatagramPacket dp = new DatagramPacket(by, 0, by.length, InetAddress.getByName("127.0.0.1"), 10000);
  ds.send(dp);
} catch (Exception e) {
  e.printStackTrace();
} finally {
  if (ds != null) ds.close()
}

// 接收端要指定监听的端口
DatagramSocket ds = null; try {
  ds = new DatagramSocket(10000);
  byte[] by = new byte[1024];
  DatagramPacket dp = new DatagramPacket(by, by.length); ds.receive(dp);
  String str = new String(dp.getData(), 0, dp.getLength());
  System.out.println(str + "--" + dp.getAddress());
} catch (Exception e) {
  e.printStackTrace();
} finally {
  if (ds != null) ds.close()
}
```

### URL

URL 类的构造器都声明抛出非运行时异常，必须要对这一异常进行处理，通常是用 try-catch 语句进行捕获

```java
// 通过一个表示URL地址的字符串可以构造一个URL对象。例如：URL url = new URL ("http://www. atguigu.com/");
public URL (String spec)
// 通过基 URL 和相对 URL 构造一个 URL 对象。例如：URL downloadUrl = new URL(url, “download.html")
public URL(URL context, String spec)
// 例如：new URL("http","www.atguigu.com", “download. html");
public URL(String protocol, String host, String file);
// 例如： URL gamelan = new URL("http", "www.atguigu.com", 80, “download.html");
public URL(String protocol, String host, int port, String file);

// 获取该URL的协议
public String getProtocol()
// 获取该URL的主机
public String getHost()
// 获取该URL的端口
public String getPort()
// 获取该URL的文件路
public String getPath()
// 获取该URL的文件
public String getFile()
// 获取该URL的查询
public String getQuery()

```

### URLConnection

- URL 的方法 openStream():能从网络上读取数据

- URLConnection 表示到 URL 所引用的远程对象的连接。当与一个 URL 建立连接时，首先要在一个 URL 对象上通过方法 openConnection() 生成对应的 URLConnection 对象。如果连接过程失败，将产生 IOException.

  - URL netchinaren = new URL ("http://www.atguigu.com/index.shtml");
  - URLConnectonn u = netchinaren.openConnection( );

- 通过 URLConnection 对象获取的输入流和输出流，即可以与现有的 CGI 程序进行交互。

  ```java
  public Object getContent( ) throws IOException
  public int getContentLength( )
  public String getContentType( )
  public long getDate( )
  public long getLastModified( )
  public InputStream getInputStream( )throws IOException
  public OutputSteram getOutputStream( )throws IOException
  ```

## 反射

- Reflection(反射)是被视为动态语言的关键，反射机制允许程序在执行期借助于 Reflection API 取得任何类的内部信息，并能直接操作任意对象的内部属性及方法
- 加载完类之后，在堆内存的方法区中就产生了一个 Class 类型的对象(一个类只有一个 Class 对象)，这个对象就包含了完整的类的结构信息。我们可以通过这个对象看到类的结构。这个对象就像一面镜子，透过这个镜子看到类的结构，所以，我们形象的称之为：反射

![image-20210608202017358](https://gitee.com/lei451927/picture/raw/master/images/image-20210608202017358.png)

- Java 反射机制提供的功能
  - 在运行时判断任意一个对象所属的类
  - 在运行时构造任意一个类的对象
  - 在运行时判断任意一个类所具有的成员变量和方法
  - 在运行时获取泛型信息
  - 在运行时调用任意一个对象的成员变量和方法
  - 在运行时处理注解
  - 生成动态代理

### Class 类

- 在 Object 类中定义了以下的方法，此方法将被所有子类继承：`public final Class getClass()`，以上的方法返回值的类型是一个 `Class` 类，此类是 Java 反射的源头，实际上所谓反射从程序的运行结果来看也很好理解，即： 可以通过对象反射求出类的名称。
- 从 `Class` 中可以得到：某个类的属性、方法和构造器、某个类到底实现了哪些接口。对于每个类而言，JRE 都为其保留一个不变的 Class 类型的对象
  - Class 本身也是一个类
  - Class 对象只能由系统建立对象
  - 一个加载的类在 JVM 中只会有一个 Class 实例
  - 一个 Class 对象对应的是一个加载到 JVM 中的一个.class 文件
  - 每个类的实例都会记得自己是由哪个 Class 实例所生成
  - 通过 Class 可以完整地得到一个类中的所有被加载的结构
  - Class 类是 Reflection 的根源，针对任何你想动态加载、运行的类，唯有先获得相应的 Class 对象

| 方法名                                             | 功能说明                                                             |
| -------------------------------------------------- | -------------------------------------------------------------------- |
| staticClass forName(Stringname)                    | 返回指定类名 name 的 Class 对象                                      |
| Object newInstance()                               | 调用缺省构造函数，返回该 Class 对象的一个实例                        |
| getName()                                          | 返回此 Class 对象所表示的实体(类、接口、数组类、基本类型或 void)名称 |
| Class getSuperClass()                              | 返回当前 Class 对象的父类的 Class 对象                               |
| Class [] getInterfaces()                           | 获取当前 Class 对象的接口                                            |
| ClassLoader getClassLoader()                       | 返回该类的类加载器                                                   |
| Class getSuperclass()                              | 返回表示此 Class 所表示的实体的超类的 Class                          |
| Constructor[] getConstructors()                    | 返回一个包含某些 Constructor 对象的数组                              |
| Field[] getDeclaredFields()                        | 返回 Field 对象的一个数组                                            |
| Method getMethod(String name,Class ... paramTypes) | 返回一个 Method 对象，此对象的形参类型为 paramType                   |

#### 获取 Class 类的实例

1. 前提：若已知具体的类，通过类的 class 属性获取，该方法最为安全可靠，程序性能最高
   - 实例：Class clazz = String.class;
2. 前提：已知某个类的实例，调用该实例的 getClass()方法获取 Class 对象
   - 实例：Class clazz = "www.atguigu.com".getClass();
3. 前提：已知一个类的全类名，且该类在类路径下，可通过 Class 类的静态方法 forName()获取，可能抛出 ClassNotFoundException
   - 实例：Class clazz = Class.forName("java.lang.String");
4. 其他方式(不做要求)
   - ClassLoader cl = this.getClass().getClassLoader();
   - Class clazz4 = cl.loadClass("类的全类名");

#### 哪些类型可以有 Class 对象?

```java
class: 外部类，成员(成员内部类，静态内部类)，局部内部类，匿名内部类
interface：接口
[]:数组
enum:枚举
annotation:注解@interface
primitive type:基本数据类型
void


Class c1 = Object.class;
Class c2 = Comparable.class;
Class c3 = String[].class;
Class c4 = int[][].class;
Class c5 = ElementType.class;
Class c6 = Override.class;
Class c7 = int.class;
Class c8 = void.class;
Class c9 = Class.class;
int[] a = new int[10];
int[] b = new int[100];
Class c10 = a.getClass();
Class c11 = b.getClass();
// 只要元素类型与维度一样，就是同一个Class System.out.println(c10 == c11);
```

### 类的加载与 ClassLoader 的理解

#### 类的加载过程

当程序主动使用某个类时，如果该类还未被加载到内存中，则系统会通过
如下三个步骤来对该类进行初始化

![image-20210608203529056](https://gitee.com/lei451927/picture/raw/master/images/image-20210608203529056.png)

- 加载：将 class 文件字节码内容加载到内存中，并将这些静态数据转换成方法区的运行时数据结构，然后生成一个代表这个类的 java.lang.Class 对象，作为方法区中类数据的访问入口(即引用地址)。所有需要访问和使用类数据只能通过这个 Class 对象。这个加载的过程需要类加载器参与
- 链接：将 Java 类的二进制代码合并到 JVM 的运行状态之中的过程
  - 验证：确保加载的类信息符合 JVM 规范，例如：以 cafe 开头，没有安全方面的问题
  - 准备：正式为类变量(static)分配内存并设置类变量默认初始值的阶段，这些内存都将在方法区中进行分配。
  - 解析：虚拟机常量池内的符号引用(常量名)替换为直接引用(地址)的过程
- 初始化：
  - 执行类构造器`<clinit>()`方法的过程。类构造器`<clinit>()`方法是由编译期自动收集类中所有类变量的赋值动作和静态代码块中的语句合并产生的。(类构造器是构造类信息的，不是构造该类对象的构造器)。
  - 当初始化一个类的时候，如果发现其父类还没有进行初始化，则需要先触发其父类的初始化。
  - 虚拟机会保证一个类的`<clinit>()`方法在多线程环境中被正确加锁和同步。

#### 什么时候会发生类初始化?

- 类的主动引用(一定会发生类的初始化)
  - 当虚拟机启动，先初始化 main 方法所在的类
  - new 一个类的对象
  - 调用类的静态成员(除了 final 常量)和静态方法
  - 使用 java.lang.reflect 包的方法对类进行反射调用
  - 当初始化一个类，如果其父类没有被初始化，则先会初始化它的父类
- 类的被动引用(不会发生类的初始化)
  - 当访问一个静态域时，只有真正声明这个域的类才会被初始化
  - 当通过子类引用父类的静态变量，不会导致子类初始化
  - 通过数组定义类引用，不会触发此类的初始化
  - 引用常量不会触发此类的初始化(常量在链接阶段就存入调用类的常量池中了)

#### ClassLoader

- 类加载的作用：将 class 文件字节码内容加载到内存中，并将这些静态数据转换成方法区的运行时数据结构，然后在堆中生成一个代表这个类的 java.lang.Class 对象，作为方法区中类数据的访问入口。
- 类缓存：标准的 JavaSE 类加载器可以按要求查找类，但一旦某个类被加载到类加载器中，它将维持加载(缓存)一段时间。不过 JVM 垃圾回收机制可以回收这些 Class 对象。

![image-20210608203954746](https://gitee.com/lei451927/picture/raw/master/images/image-20210608203954746.png)

```java
//1.获取一个系统类加载器
ClassLoader classloader = ClassLoader.getSystemClassLoader();
System.out.println(classloader);
//2.获取系统类加载器的父类加载器，即扩展类加载器
classloader = classloader.getParent();
System.out.println(classloader);
//3.获取扩展类加载器的父类加载器，即引导类加载器
classloader = classloader.getParent();
System.out.println(classloader);
//4.测试当前类由哪个类加载器进行加载
classloader = Class.forName("exer2.ClassloaderDemo").getClassLoader(); System.out.println(classloader);
//5.测试JDK提供的Object类由哪个类加载器加载
classloader =
Class.forName("java.lang.Object").getClassLoader();
System.out.println(classloader);
//*6.关于类加载器的一个主要方法：getResourceAsStream(String str):获取类路径下的指定文件的输入流
InputStream in = null;
in = this.getClass().getClassLoader().getResourceAsStream("exer2\\test.properties");
System.out.println(in);
```

### 创建运行时类的对象

创建类的对象：调用 Class 对象的 newInstance()方法

    1. 类必须有一个无参数的构造器
    2. 类的构造器的访问权限需要足够

对于没有无参的构造器，需要明确的调用类中的构造器，并将参数传递进去

1. 通过 Class 类的 getDeclaredConstructor(Class ... parameterTypes)取得本类的指定形参类型的构造器
2. 向构造器的形参中传递一个对象数组进去，里面包含了构造器中所需的各个参数
3. 通过 Constructor 实例化对象

```java
//1.根据全类名获取对应的Class对象
String name = “atguigu.java.Person";
Class clazz = null;
clazz = Class.forName(name);
//2.调用指定参数结构的构造器，生成Constructor的实例
Constructor con = clazz.getConstructor(String.class,Integer.class);
//3.通过Constructor的实例创建对应类的对象，并初始化类属性
Person p2 = (Person) con.newInstance("Peter",20);
System.out.println(p2);
```

### 获取运行时类的完整结构

```java
// 实现的全部接口
    //  确定此对象所表示的类或接口实现的接口
    public Class<?>[] getInterfaces()

// 所继承的父类
    // 返回表示此 Class 所表示的实体(类、接口、基本类型)的父类的 Class。
    public Class<? Super T> getSuperclass()


// 全部的构造器
    // 返回此 Class 对象所表示的类的所有public构造方法。
    public Constructor<T>[] getConstructors()
    // 返回此 Class 对象表示的类声明的所有构造方法。
    public Constructor<T>[] getDeclaredConstructors()

// Constructor类中
    // 取得修饰符
    public int getModifiers();
    // 取得方法名称
    public String getName();
    // 取得参数的类型
    public Class<?>[] getParameterTypes();

// 全部的方法
    //  返回此Class对象所表示的类或接口的全部方法
    public Method[] getDeclaredMethods()
    //  返回此Class对象所表示的类或接口的public的方法
    public Method[] getMethods()

// Method类中
    // 取得全部的返回值
    public Class<?> getReturnType()
    // 取得全部的参数
    public Class<?>[] getParameterTypes()
    // 取得修饰符
    public int getModifiers()
    // 取得异常信息
    public Class<?>[] getExceptionTypes()

// 全部的Field
    // 返回此Class对象所表示的类或接口的public的Field。
    public Field[] getFields()
    // 返回此Class对象所表示的类或接口的全部Field。
    public Field[] getDeclaredFields()

// Field方法中
    // 以整数形式返回此Field的修饰符
    publicintgetModifiers()
    // 得到Field的属性类型
    publicClass<?>getType()
    // 返回Field的名称。
    publicStringgetName()

// Annotation相关
    get Annotation(Class<T> annotationClass)
    getDeclaredAnnotations()

// 泛型相关
    // 泛型类型
    ParameterizedType
    // 获取实际的泛型类型参数数组
    getActualTypeArguments()
    // 获取父类泛型类型
    Type getGenericSuperclass()

// 类所在的包
Package getPackage()
```

### 调用运行时类的指定结构

#### 调用指定方法

1. 通过 Class 类的 getMethod(String name,Class...parameterTypes)方法取得一个 Method 对象，并设置此方法操作时所需要的参数类型
2. 之后使用 Object invoke(Object obj, Object[] args)进行调用，并向方法中传递要设置的 obj 对象的参数信息

![image-20210608210008126](https://gitee.com/lei451927/picture/raw/master/images/image-20210608210008126.png)

```java
Object invoke(Object obj, Object ... args)
// Object 对应原方法的返回值，若原方法无返回值，此时返回null
// 若原方法若为静态方法，此时形参Object obj可为null
// 若原方法形参列表为空，则Object[] args为null
// 若原方法声明为private,则需要在调用此invoke()方法前，显式调用方法对象的setAccessible(true)方法，将可访问private的方法
```

#### 调用指定属性

在反射机制中，可以直接通过 Field 类操作类中的属性，通过 Field 类提供的 set()和 get()方法就可以完成设置和取得属性内容的操作

```java
// 返回此Class对象表示的类或接口的指定的public的Field。
public Field getField(String name)
// 返回此Class对象表示的类或接口的指定的Field。
public Field getDeclaredField(String name)

// 在Field中
  // 取得指定对象obj上此Field的属性内容
	public Object get(Object obj)
  // 设置指定对象obj上此Field的属性内容
	public void set(Object obj,Object value)
```

#### 关于 setAccessible 方法的使用

- Method 和 Field、Constructor 对象都有 setAccessible()方法。
- setAccessible 启动和禁用访问安全检查的开关。
- 参数值为 true 则指示反射的对象在使用时应该取消 Java 语言访问检查。
  - 提高反射的效率。如果代码中必须用反射，而该句代码需要频繁的被调用，那么请设置为 true。
  - 使得原本无法访问的私有成员也可以访问
- 参数值为 false 则指示反射的对象应该实施 Java 语言访问检查。

### 动态代理

#### 代理设计模式

使用一个代理将对象包装起来, 然后用该代理对象取代原始对象。任何对原始对象的调用都要通过代理。代理对象决定是否以及何时将方法调用转到原始对象上

#### 动态代理

动态代理是指客户通过代理类来调用其它对象的方法，并且是在程序运行时根据需要动态创建目标类的代理对象

#### Proxy

专门完成代理的操作类，是所有动态代理类的父类。通过此类为一个或多个接口动态地生成实现类。

```java
// 创建一个动态代理类所对应的Class对象
static Class<?> getProxyClass(ClassLoader loader, Class<?>... interfaces)

// 直接创建一个动态代理对象
  // loader 类加载器
  // interfaces 被代理类实现的所有接口
  // h InvocationHandler接口的实现类实例
static Object newProxyInstance(ClassLoader loader, Class<?>[] interfaces, InvocationHandler h)
```

##### 动态代理步骤

1. 创建一个实现接口 InvocationHandler 的类，它必须实现 invoke 方法，以完成代理的具体操作

   ```java
   // theProxy 代理的对象
   // method 要调用的方法
   // params 调用时所需要的参数
   public Object invoke(Object theProxy, Method method, Object[] params) throws Throwable{
     try {

       Object retval = method.invoke(targetObj, params);
       // Print out the result
       System.out.println(retval);
       return retval;
     } catch (Exception exc){}

   }
   ```

2. 创建被代理的类以及接口

3. 通过 Proxy 的静态方法 `newProxyInstance(ClassLoader loader, Class[] interfaces, InvocationHandler h)` 创建一个 Subject 接口代理

   ```java
   RealSubject target = new RealSubject();
   // Create a proxy to wrap the original implementation
   DebugProxy proxy = new DebugProxy(target);
   // Get a reference to the proxy through the Subject interface
   Subject sub = (Subject) Proxy.newProxyInstance( Subject.class.getClassLoader(),new Class[] { Subject.class }, proxy);
   ```

4. 通过 Subject 代理调用 RealSubject 实现类的方法

   ```java
   String info = sub.say("Peter", 24);
   System.out.println(info);
   ```

## Java8

### 并行流与串行流

并行流就是把一个内容分成多个数据块，并用不同的线程分别处理每个数据块的流。相比较串行的流，并行的流可以很大程度上提高程序的执行效率。

Java 8 中将并行进行了优化，我们可以很容易的对数据进行并行操作。 Stream API 可以声明性地通过 parallel() 与 sequential() 在并行流与顺序流之间进行切换。

### Lambda 表达式

Lambda 是一个匿名函数，我们可以把 Lambda 表达式理解为是一段可以传递的代码(将代码像数据一样进行传递)。使用它可以写出更简洁、更灵活的代码。作为一种更紧凑的代码风格，使 Java 的语言表达能力得到了提升。

<img src="https://gitee.com/lei451927/picture/raw/master/images/image-20210609102513450.png" alt="image-20210609102513450" style="zoom: 50%;" />

Lambda 表达式：在 Java 8 语言中引入的一种新的语法元素和操作符。这个操作符为 「->」， 该操作符被称为 Lambda 操作符或箭头操作符。它将 Lambda 分为两个部分：

- 左侧：指定了 Lambda 表达式需要的参数列表
- 右侧：指定了 Lambda 体，是抽象方法的实现逻辑，也即 Lambda 表达式要执行的功能

![image-20210609102618652](https://gitee.com/lei451927/picture/raw/master/images/image-20210609102618652.png)

![image-20210609102627187](https://gitee.com/lei451927/picture/raw/master/images/image-20210609102627187.png)

Lambda 表达式中无需指定类型，程序依然可以编译，这是因为 javac 根据程序的上下文，在后台推断出了参数的类型。Lambda 表达式的类型依赖于上下文环境，是由编译器推断出来的。这就是所谓的 「类型推断」

### 函数式(Functional)接口

- 只包含一个抽象方法的接口，称为函数式接口
- 可以通过 Lambda 表达式来创建该接口的对象
- 可以在一个接口上使用 @FunctionalInterface 注解，这样做可以检查它是否是一个函数式接口。同时 javadoc 也会包含一条声明，说明这个接口是一个函数式接口
- 在 java.util.function 包下定义了 Java 8 的丰富的函数式接口
- 在函数式编程语言当中，函数被当做一等公民对待。在将函数作为一等公民的编程语言中，Lambda 表达式的类型是函数。但是在 Java8 中，有所不同。在 Java8 中，Lambda 表达式是对象，而不是函数，它们必须依附于一类特别的对象类型——函数式接口
- 在 Java8 中，Lambda 表达式就是一个函数式接口的实例。这就是 Lambda 表达式和函数式接口的关系。也就是说，只要一个对象是函数式接口的实例，那么该对象就可以用 Lambda 表达式来表示。
- 所以以前用匿名实现类表示的现在都可以用 Lambda 表达式来写

![image-20210609102954583](https://gitee.com/lei451927/picture/raw/master/images/image-20210609102954583.png)

![image-20210609103003644](https://gitee.com/lei451927/picture/raw/master/images/image-20210609103003644.png)

### 方法引用与构造器引用

#### 方法引用

- 当要传递给 Lambda 体的操作，已经有实现的方法了，可以使用方法引用!
- 方法引用可以看做是 Lambda 表达式深层次的表达。换句话说，方法引用就是 Lambda 表达式，也就是函数式接口的一个实例，通过方法的名字来指向一个方法，可以认为是 Lambda 表达式的一个语法糖。
- 要求：实现接口的抽象方法的参数列表和返回值类型，必须与方法引用的方法的参数列表和返回值类型保持一致!
- 格式：使用操作符 「：:」将类(或对象) 与方法名分隔开来。
- 如下三种主要使用情况：
  - 对象：:实例方法名
  - 类：:静态方法名
  - 类：:实例方法名

![image-20210609103159862](https://gitee.com/lei451927/picture/raw/master/images/image-20210609103159862.png)

![image-20210609103208944](https://gitee.com/lei451927/picture/raw/master/images/image-20210609103208944.png)

#### 构造器引用

`ClassName::new`

与函数式接口相结合，自动与函数式接口中方法兼容。可以把构造器引用赋值给定义的方法，要求构造器参数列表要与接口中抽象方法的参数列表一致!且方法的返回值即为构造器对应类的对象

![image-20210609103256175](https://gitee.com/lei451927/picture/raw/master/images/image-20210609103256175.png)

![image-20210609103303668](https://gitee.com/lei451927/picture/raw/master/images/image-20210609103303668.png)

### Stream API

- Stream API ( java.util.stream) 把真正的函数式编程风格引入到 Java 中
- Stream 和 Collection 集合的区别：Collection 是一种静态的内存数据结构，而 Stream 是有关计算的。前者是主要面向内存，存储在内存中，后者主要是面向 CPU，通过 CPU 实现计算

- Stream 是数据渠道，用于操作数据源(集合、数组等)所生成的元素序列。

「集合讲的是数据，Stream 讲的是计算!」

1. Stream 自己不会存储元素。
2. Stream 不会改变源对象。相反，他们会返回一个持有结果的新 Stream。
3. Stream 操作是延迟执行的。这意味着他们会等到需要结果的时候才执行

#### Stream 的操作三个步骤

1. 创建 Stream：一个数据源(如：集合、数组)，获取一个流
2. 中间操作：一个中间操作链，对数据源的数据进行处理
3. 终止操作(终端操作)

![image-20210609103621748](https://gitee.com/lei451927/picture/raw/master/images/image-20210609103621748.png)

#### 创建 Stream

```java
/*
创建 Stream方式一：通过集合
Java8 中的 Collection 接口被扩展，提供了两个获取流的方法：
*/
default Stream<E> stream()// 返回一个顺序流
default Stream<E> parallelStream()// 返回一个并行流


/*
创建 Stream方式二：通过数组
Java8 中的 Arrays 的静态方法 stream() 可以获取数组流：
*/
static <T> Stream<T> stream(T[] array): 返回一个流
// 重载形式，能够处理对应基本类型的数组
public static IntStream stream(int[] array)
public static LongStream stream(long[] array)
public static DoubleStream stream(double[] array)

/*
创建 Stream方式三：通过Stream的of()
可以调用Stream类静态方法 of(), 通过显示值创建一个流。它可以接收任意数量的参数。
*/
public static<T> Stream<T> of(T... values)// 返回一个流

/*
创建 Stream方式四：创建无限流
可以使用静态方法 Stream.iterate() 和 Stream.generate(), 创建无限流。
*/
// 迭代
public static<T> Stream<T> iterate(final T seed, final UnaryOperator<T> f)
// 生成
public static<T> Stream<T> generate(Supplier<T> s)
```

#### 中间操作

| 方法                            | 描述                                                                                           |
| ------------------------------- | ---------------------------------------------------------------------------------------------- |
| filter(Predicate p)             | 接收 Lambda ，从流中排除某些元素                                                               |
| distinct()                      | 筛选，通过流所生成元素的 hashCode() 和 equals() 去除重复元素                                   |
| limit(long maxSize)             | 截断流，使其元素不超过给定数量                                                                 |
| skip(long n)                    | 跳过元素，返回一个扔掉了前 n 个元素的流。若流中元素不足 n 个，则返回一个空流。与 limit(n) 互补 |
| map(Function f)                 | 接收一个函数作为参数，该函数会被应用到每个元素上，并将其映射成一个新的元素。                   |
| mapToDouble(ToDoubleFunction f) | 接收一个函数作为参数，该函数会被应用到每个元素上，产生一个新的 DoubleStream。                  |
| mapToInt(ToIntFunction f)       | 接收一个函数作为参数，该函数会被应用到每个元素上，产生一个新的 IntStream。                     |
| mapToLong(ToLongFunction f)     | 接收一个函数作为参数，该函数会被应用到每个元素上，产生一个新的 LongStream。                    |
| flatMap(Function f)             | 接收一个函数作为参数，将流中的每个值都换成另一个流，然后把所有流连接成一个流                   |
| sorted()                        | 产生一个新流，其中按自然顺序排序                                                               |
| sorted(Comparator com)          | 产生一个新流，其中按比较器顺序排序                                                             |

#### 终止操作

| 方法                             | 描述                                                                                                        |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| allMatch(Predicate p)            | 检查是否匹配所有元素                                                                                        |
| anyMatch(Predicate p)            | 检查是否至少匹配一个元素                                                                                    |
| noneMatch(Predicate p)           | 检查是否没有匹配所有元素                                                                                    |
| findFirst()                      | 返回第一个元素                                                                                              |
| findAny()                        | 返回当前流中的任意元素                                                                                      |
| count()                          | 返回流中元素总数                                                                                            |
| max(Comparator c)                | 返回流中最大值                                                                                              |
| min(Comparator c)                | 返回流中最小值                                                                                              |
| forEach(Consumer c)              | 内部迭代(使用 Collection 接口需要用户去做迭代称为外部迭代。相反，Stream API 使用内部迭代——它帮你把迭代做了) |
| reduce(T iden, BinaryOperator b) | 可以将流中元素反复结合起来，得到一个值。返回 T                                                              |
| reduce(BinaryOperator b)         | 可以将流中元素反复结合起来，得到一个值。返回 `Optional<T>`                                                    |
| collect(Collector c)             | 将流转换为其他形式。接收一个 Collector 接口的实现，用于给 Stream 中元素做汇总的方法                         |

#### Collectors

![image-20210609104438656](https://gitee.com/lei451927/picture/raw/master/images/image-20210609104438656.png)

![image-20210609104449026](https://gitee.com/lei451927/picture/raw/master/images/image-20210609104449026.png)

### Optional 类

- 到目前为止，臭名昭著的空指针异常是导致 Java 应用程序失败的最常见原因
- `Optional<T>` 类(java.util.Optional) 是一个容器类，它可以保存类型 T 的值，代表这个值存在。或者仅仅保存 null，表示这个值不存在。原来用 null 表示一个值不存在，现在 Optional 可以更好的表达这个概念。并且可以避免空指针异常
- Optional 类的 Javadoc 描述如下：这是一个可以为 null 的容器对象。如果值存在则 isPresent()方法会返回 true，调用 get()方法会返回该对象

```java
// 创建Optional类对象的方法
    // 创建一个 Optional 实例，t必须非空;
    Optional.of(T t)
    // 创建一个空的 Optional 实例
    Optional.empty()
    // t可以为null
    Optional.ofNullable(T t)

// 判断Optional容器中是否包含对象
    // 判断是否包含对象
    boolean isPresent()
    // 如果有值，就执行Consumer接口的实现代码，并且该值会作为参数传给它。
    void ifPresent(Consumer<? super T> consumer)


// 获取Optional容器的对象
    // 如果调用对象包含值，返回该值，否则抛异常
    T get()
    //  如果有值则将其返回，否则返回指定的other对象。
    T orElse(T other)
    // 如果有值则将其返回，否则返回由Supplier接口实现提供的对象。
    T orElseGet(Supplier<? extends T> other)
    // 如果有值则将其返回，否则抛出由Supplier接口实现提供的异常。
    T orElseThrow(Supplier<? extends X> exceptionSupplier)

```

## Java 9

- 从 Java 9 这个版本开始，Java 的计划发布周期是 6 个月

- 这意味着 Java 的更新从传统的以特性驱动的发布周期，转变为以时间驱动的

  (6 个月为周期)发布模式，并逐步的将 Oracle JDK 原商业特性进行开源

### 模块化系统

用模块来管理各个 package，通过声明某个 package 暴露，模块(module)的概念，其实就是 package 外再裹一层，不声明默认就是隐藏。因此，模块化使得代码组织上更安全，因为它可以指定哪些部分可以暴露，哪些部分隐藏

实现目标：

- 模块化的主要目的在于减少内存的开销

- 只须必要模块，而非全部 jdk 模块，可简化各种类库和大型应用的开

  发和维护

- 改进 Java SE 平台，使其可以适应不同大小的计算设备

- 改进其安全性，可维护性，提高性能

模块将由通常的类和新的模块声明文件(module-info.java)组成。该文件是位于 java 代码结构的顶层，该模块描述符明确地定义了我们的模块需要什么依赖关系，以及哪些模块被外部使用。在 exports 子句中未提及的所有包默认情况下将封装在模块中，不能在外部使用

```java
/*
要想在java9demo模块中调用java9test模块下包中的结构，需要在java9test的module-info.java中声明
exports:控制着哪些包可以被其它模块访问到。所有不被导出的包默认都被封装在模块里面
*/
module java9test {
  exports com.atguigui.bean;
}

/*
对应在java 9demo 模块的src 下创建module-info.java文件
requires:指明对其它模块的依赖
*/
module java9demo {
  requires java9test;
}
```

### 接口的私有方法

在 Java 9 中，接口更加的灵活和强大，连方法的访问权限修饰符都可以声明为 private 的了，此时方法将不会成为你对外暴露的 API 的一部分

```java
interface MyInterface {
    private void init() {
      System.out.println("默认方法中的通用操作");
    }
}
```

### 钻石操作符

们将能够与匿名实现类共同使用钻石操作符(diamond operator)在 Java 8 中如下的操作是会报错的，而在 java9 中可以正常执行通过

```java
Comparator<Object> com = new Comparator<>(){
  @Override
  public int compare(Object o1, Object o2) {
    return 0;
  }
};
```

### Try 语句

Java 9 中，用资源语句编写 try 将更容易，我们可以在 try 子句中使用已经初始化过的资源，此时的资源是 final 的

```java
InputStreamReader reader = new InputStreamReader(System.in); OutputStreamWriter writer = new OutputStreamWriter(System.out);
try (reader; writer) {
	//reader是final的，不可再被赋值
  //reader = null;
  //具体读写操作省略
} catch (IOException e) {
  e.printStackTrace();
}
```

### 快速创建只读集合

```java
List<String> list = List.of("a", "b", "c");
Set<String> set = Set.of("a", "b", "c");
Map<String, Integer> map1 = Map.of("Tom", 12, "Jerry", 21, "Lilei", 33, "HanMeimei", 18);
Map<String, Integer> map2 = Map.ofEntries(Map.entry("Tom", 89), Map.entry("Jim", 78), Map.entry("Tim", 98));
```

### InputStream 加强

InputStream 终于有了一个非常有用的方法：transferTo，可以用来将数据直接传输到 OutputStream，这是在处理原始数据流时非常常见的一种用法，如下示例

```java
ClassLoader cl = this.getClass().getClassLoader();
try (InputStream is = cl.getResourceAsStream("hello.txt"); OutputStream os = new FileOutputStream("src\\hello1.txt")) {
  // 把输入流中的所有数据直接自动地复制到输出流中
  is.transferTo(os);
} catch (IOException e) {
  e.printStackTrace();
}
```

### Stream 加强

- 在 Java 9 中，Stream API 变得更好，Stream 接口中添加了 4 个新的方法： takeWhile, dropWhile, ofNullable，还有个 iterate 方法的新重载方法，可以让你提供一个 Predicate (判断条件)来指定什么时候结束迭代
- 除了对 Stream 本身的扩展，Optional 和 Stream 之间的结合也得到了改进。现在可以通过 Optional 的新方法 stream() 将一个 Optional 对象转换为一个 (可能是空的) Stream 对象

```java
/*
用于从 Stream 中获取一部分数据，接收一个 Predicate 来进行选择。在有序的 Stream 中，takeWhile 返回从开头开始的尽量多的元素
*/
List<Integer> list = Arrays.asList(45, 43, 76, 87, 42, 77, 90, 73, 67, 88);
list.stream().takeWhile(x -> x < 50).forEach(System.out::println);
list = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8);
list.stream().takeWhile(x -> x < 5).forEach(System.out::println);


/*
dropWhile 的行为与 takeWhile 相反，返回剩余的元素
*/
List<Integer> list = Arrays.asList(45, 43, 76, 87, 42, 77, 90, 73, 67, 88); list.stream().dropWhile(x -> x < 50).forEach(System.out::println);
list = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8);
list.stream().dropWhile(x -> x < 5).forEach(System.out::println);

/*
Java 8 中 Stream 不能完全为null，否则会报空指针异常。而 Java 9 中的 ofNullable 方法允许我们创建一个单元素 Stream，可以包含一个非空元素，也可以创建一个空 Stream
*/
// 报NullPointerException
// Stream<Object> stream1 = Stream.of(null);
// System.out.println(stream1.count());
// 不报异常，允许通过
Stream<String> stringStream = Stream.of("AA", "BB", null); System.out.println(stringStream.count());// 3
// 不报异常，允许通过
List<String> list = new ArrayList<>();
list.add("AA");
list.add(null);
System.out.println(list.stream().count());// 2
// ofNullable():允许值为null
Stream<Object> stream1 = Stream.ofNullable(null); System.out.println(stream1.count());// 0
Stream<String> stream = Stream.ofNullable("hello world");
System.out.println(stream.count());// 1

/*
iterate 方法的新重载方法，可以让你提供一个 Predicate (判断条件)来指定什么时候结束迭代
*/
// 原来的控制终止方式：
Stream.iterate(1, i -> i + 1).limit(10).forEach(System.out::println);
// 现在的终止方式：
Stream.iterate(1, i -> i < 100, i -> i + 1).forEach(System.out::println);

/*
Optional类中stream()的使用
*/
List<String> list = new ArrayList<>(); list.add("Tom");
list.add("Jerry");
list.add("Tim");
Optional<List<String>> optional = Optional.ofNullable(list); Stream<List<String>> stream = optional.stream();
stream.flatMap(x -> x.stream()).forEach(System.out::println);
```