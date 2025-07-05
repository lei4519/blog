---
created: 2024-04-23T13:13
tags:
  - Linux
  - Hyprland
  - HowTo
issue: "75"
share: "true"
updated: 2024-05-16T16:25
---
  
书接上回 [Arch Linux 系统安装篇](../74/Arch%20Linux%20%E7%B3%BB%E7%BB%9F%E5%AE%89%E8%A3%85%E7%AF%87.md)  
  
进入系统之后需要对新系统进行设置  
  
> [!TIP]    
> 里面有些软件是 wayland 下的，如果是其他的窗口系统需要寻找对应的安装配置  
  
## 必要系统设置  
  
要先保证电脑的 `wifi/键盘/鼠标` 等可以正常使用，不然一切都是空谈  
  
### 联网  
  
> [!TIP]    
> 如果有网线跳过这一步  
  
[NetworkManager - ArchWiki](https://wiki.archlinux.org/title/NetworkManager)  
  
因为之前选的是 `NetworkManager` 管理网络，所以可以以下步骤任选其一  
  
- 命令行操作：`nmcli device wifi connect <网络名> password <密码>`  
- TUI 操作：`nmtui`  
- 图形界面操作：`nm-connection-editor`  
  
还可以安装 [networkmanager-dmenu: Control NetworkManager via dmenu](https://github.com/firecat53/networkmanager-dmenu) ，可以通过 `dmenu` 或 `rofi` 管理 `NetworkManager`  
  
> [!TIP]    
> 如果你是用 iwd 管理网络，可以安装    
> [iwgtk: Lightweight wireless networking GUI (front-end for iwd)](https://github.com/J-Lentz/iwgtk)  
  
### 蓝牙  
  
[Bluetooth - ArchWiki](https://wiki.archlinux.org/title/Bluetooth#Discoverable_on_startup)  
  
有几种方式  
  
- `bluetoothctl`  
  - 最基础稳定的命令行管理，但是 UI 交互什么的肯定就很不友好了（相对其他工具  
- [bluetuith: A TUI bluetooth manager for Linux.](https://github.com/darkhz/bluetuith)  
  - 一个 TUI 工具用来管理 `bluetoothctl`，交互就舒服多了  
- [bluetui: 🛜 TUI for managing bluetooth devices](https://github.com/pythops/bluetui)  
- [Overskride](https://github.com/kaii-lb/overskride)  
  - GTK4 中简单但功能强大的蓝牙客户端（GUI，很漂亮）  
  
#### `bluetoothctl`  
  
这里以最基础的 `bluetoothctl` 为例  
  
##### 安装  
  
```sh  
pacman -Syu bluez bluez-utils  
systemctl enable bluetooth.service  
systemctl start bluetooth.service  
```  
  
##### 使用  
  
```sh  
bluetoothctl  
default-agent  
power on  
# 扫描  
scan on  
# 设备开启蓝牙，会看到 [NEW] Device MAC_address Name  
# 找到自己的设备  
# 配对  
pair MAC_address  
```  
  
### 系统升级和备份  
  
> 这位同学你也不想辛辛苦苦装好的系统又被玩崩了吧～  
  
> [!IMPORTANT]    
> 升级前备份! 备份! 备份!  
  
建议安装 [informant: An Arch Linux News reader and pacman hook](https://github.com/bradford-smith94/informant)    
  
这是一个 pacman hook，可以保证你在升级系统前必须先阅读 Arch Linux 的新闻，否则就会中断升级动作  
  
升级之后 [检查孤立包和丢弃的包](https://wiki.archlinux.org/title/System_maintenance#Check_for_orphans_and_dropped_packages)，命令在下面 [[ > [Pacman](https <//wiki.archlinux.org/title/Pacman>) 速览](.md#Pacman)](Arch%2520Linux%2520%E7%B3%BB%E7%BB%9F%E9%85%8D%E7%BD%AE%E7%AF%87.md##%5BPacman%5D(https%2520%3C//wiki.archlinux.org/title/Pacman%3E)%2520%E9%80%9F%E8%A7%88)  
  
### [Timeshift](https://github.com/linuxmint/timeshift)  
  
```sh  
sudo pacman -S timeshift  
# 参考 https://github.com/linuxmint/timeshift/issues/147  
# 它在 Wayland 中运行正常，只是它当前的启动方式（以 root 身份）正在丢失 Wayland 环境  
# 并且会回退到 x11。通过运行 sudo -E ，它可以在启动时保留 OP 的环境（因此它作为 wayland 客户端运行）  
sudo -E timeshift-launcher  
```  
  
启动之后选择 `Wizard` 根据自己的需要配置，我选择每天进行一次快照，保留 15 天的记录  
  
> 与计划在一天中的固定时间进行备份的类似工具不同，Timeshift 设计为每小时运行一次，并且仅在快照到期时才拍摄快照。  
>  
> 这更适合每天打开笔记本电脑和台式机几个小时的台式机用户。  
>  
> 为此类用户安排固定时间的快照将导致备份丢失，因为在安排快照运行时系统可能尚未运行。  
>  
> 通过每小时运行一次并在到期时创建快照，Timeshift 可确保不会错过备份。  
  
## 其他系统设置  
  
### Pacman 速览  
  
> [pacman](https://wiki.archlinux.org/title/Pacman)  
  
```sh  
# 安装  
pacman -S package_name  
# 删除，保留依赖项  
pacman -R package_name  
# 删除，不保留依赖项（推荐）  
pacman -Rs package_name  
  
# 升级包/系统  
pacman -Syu  
  
# 查询  
# queries the local package database with the `-Q` flags  
pacman -Qs package_name  
# the sync database with the `-S` flag  
pacman -Ss package_name  
# files database with the `-F` flag  
pacman -F string  
  
# 列出所有显示安装的包  
pacman -Qqe  
  
# query package information  
pacman -Si package_name  
pacman -Qi package_name  
  
# 列出不再需要作为依赖项（孤立项）的所有包  
pacman -Qdt  
  
# 列出所有显式安装且不需要作为依赖项的包：  
pacman -Qet  
  
```  
  
#### 系统升级后的清理动作  
  
```sh  
# 列出不再需要作为依赖项（孤立项）的所有包  
pacman -Qdt  
# 对于递归删除孤立包及其配置文件  
pacman -Qdtq | pacman -Rns -  
# 如果某些包不希望被当作孤立包，可以改为显示安装  
pacman -D --asexplicit package  
# 找到所有损坏的软链接  
find / -xtype l -print  
```  
  
#### 清理包缓存  
  
> [pacman - ArchWiki](https://wiki.archlinux.org/title/Pacman#Cleaning_the_package_cache)  
  
```sh  
sudo systemctl enable paccache.timer  
sudo systemctl start paccache.timer  
```  
  
### [yay](https://github.com/Jguer/yay)  
  
```sh  
# 安装 yay，ARU 助手 或者可以选择 paru  
# 但是 hyprland 中推荐使用 yay  
git clone https://aur.archlinux.org/yay.git  
cd yay  
makepkg -si  
# 首次安装后配置  
yay -Y --gendb  
yay -Syu --devel  
yay -Y --devel --save  
  
yay -S google-chrome  
yay -S rofi  
```  
  
### Hyprland 配置  
  
[Arch Linux 系统安装篇](../74/Arch%20Linux%20%E7%B3%BB%E7%BB%9F%E5%AE%89%E8%A3%85%E7%AF%87.md) 里已经选了 `hyprland`，所以这里基本的配置应该已经完成了  
  
我们直接进行配置的安装即可，可以在 [hyprland · GitHub Topics · GitHub](https://github.com/topics/hyprland) 中挑选自己喜欢的配置，我选择的方案和配置参考 [dotfiles#hyprland](https://github.com/lei4519/dotfiles#hyprland)  
  
> [!TIP]    
> 热门的配置方案中，会把相关的系统配置、软件都安装好    
> 建议再进行其他配置之前，先把 hyprland 配置安装好，这样就可以省去一些工作  
  
基本上安装完这个之后，系统就已经完全可用了  
  
### 按键映射  
  
#### 底层映射  
  
我习惯把 `ctrl` 放在 `alt` （`command`）的位置，所以要改一下按键  
  
对于这种无脑重映射，最好是从底层修改，以不需要用运行程序的方法以提高性能 [Map scancodes to keycodes - ArchWiki](https://wiki.archlinux.org/title/Map_scancodes_to_keycodes)  
  
步骤如下  
  
##### 查找键盘设备  
  
> [!TIP]    
> 后面涉及到键盘配置的都需要先找到自己的设备号  
  
先安装 `pacman -S evtest` 用来查看按键的 `scancode`，安装好后，执行 `sudo evtest`  
  
先选择自己的键盘设备 `/dev/input/event$`，如果不确定就一个一个试，试对了按键后屏幕会有输出  
  
输出内容格式如下：  
  
```sh  
Event: time 1628668903.193667, type 4 (EV_MSC), code 4 (MSC_SCAN), value 70039  
Event: time 1628668903.193667, type 1 (EV_KEY), code 58 (KEY_CAPSLOCK), value 0  
```  
  
其中 `KEY_CAPSLOCK` 表示我按下的是 `capslock` 键，`MSC_SCAN` 后面的 `value 70039` 是 `scancode` ，`code 58` 是 `keycode`  
  
有了按键信息之后还需要设备信息做匹配，上面我们已经找到了自己的设备号了，通过以下命令查看设备  
  
> 把 event$ 中的 $ 换成具体的设备号  
  
```sh  
cat /sys/class/input/event$/device/modalias  
```  
  
在 `/etc/udev/hwdb.d/` 中创建一个 `90-remap-keyboard.hwdb` 的文件  
  
> [!TIP]    
> 如果你想所有的键盘都交换，而不只是这一个键盘，可以写 `evdev:input:b000*`，而不具体指定到具体的设备上  
  
```txt  
evdev:input:b0003v05ACp0259*  
  # leftalt 和 leftctrl 交换  
  KEYBOARD_KEY_700e2=leftctrl  
  KEYBOARD_KEY_700e0=leftalt  
  # capslock 映射到 leftmeta  
  KEYBOARD_KEY_70039=leftmeta  
```  
  
保存退出，更新 hwdb 数据库：  
  
```sh  
systemd-hwdb update  
```  
  
激活配置  
  
```sh  
udevadm trigger  
```  
  
#### 程序映射  
  
我喜欢把 `ctrl` 单击映射为 `esc` 按键，而与其他键组合时仍然是 `ctrl` 键，参考 [Vim ESC 键的解决方案](../54/Vim%20ESC%20%E9%94%AE%E7%9A%84%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88.md)，这种功能就必须使用程序来实现了  
  
最终选用了 `kanata`，因为我对 `rust` 比较熟。也可以看看 [kmonad](https://github.com/kmonad/kmonad?tab=readme-ov-file)  
  
##### `kanata`  
  
- [GitHub -kanata](https://github.com/jtroo/kanata)  
- [Kanata simulator](https://jtroo.github.io/)  
  
具体配置和使用参考 [dotfiles](../62/dotfiles.md)  
  
---  
  
> [!TIP]    
> 以下内容仅为参考使用  
  
##### `evremap`  
  
参考 [Input remap utilities - ArchWiki](https://wiki.archlinux.org/title/Input_remap_utilities)  
  
> 这种方案的问题是，一旦换了键盘或者连接方式，就要重新修改配置文件  
  
###### 安装 `evremap`  
  
```sh  
yay -S evremap  
```  
  
###### 配置 `evremap`  
  
`copy` <https://github.com/wez/evremap/blob/master/pixelbookgo.toml> 内容至自己本地，命名为 `evremap.toml`，记住存放的路径，后面要用  
  
修改 `evremap.toml` ，参考 [GitHub - evremap](https://github.com/wez/evremap) 进行个人配置，主要是 `device_name` 要配置对，不然会报错无法启动  
  
配置好之后先测试一下  
  
```sh  
sudo evremap remap evremap.toml  
```  
  
如果没有报错就可以正常使用了，可以去其他地方试一下按键有没有生效  
  
###### 开机自启动  
  
`udev`  
  
参考  
  
- [udev - ArchWiki](https://wiki.archlinux.org/title/udev)  
- [Issue #35 · wez/evremap · GitHub](https://github.com/wez/evremap/issues/35)  
- [Create UDEV-Rule for Bluetooth-Headset / Newbie Corner / Arch Linux Forums](https://bbs.archlinux.org/viewtopic.php?id=270429)  
  
这种方式可以在设备（蓝牙）触发相应事件时（自动连接后）执行命令  
  
> [!tip]    
> 可以运行 `udevadm monitor` 后，把设备断开并重新链接，来查看具体的事件名称  
  
查看设备信息，`$device_name` 就是上面 [查找键盘设备](Arch%20Linux%20%E7%B3%BB%E7%BB%9F%E9%85%8D%E7%BD%AE%E7%AF%87.md#查找键盘设备) 中的路径 `eg: /dev/input/event18`  
  
```sh  
udevadm info --attribute-walk --name=$device_name  
```  
  
然后找到可以唯一标识自己设备的一些信息，比如 `id/product`、`id/vendor`、`phys` 之类的，用于规则匹配使用  
  
编写规则  
  
```sh  
sudo nvim /etc/udev/rules.d/90-evremap.rules  
```  
  
写入规则  
  
```sh  
ACTION=="add", SUBSYSTEM=="input", ATTRS{id/product}=="0220", ATTRS{is/vendor}=="05ac", ATTRS{phys}=="64:49:7d:a2:7d:34", RUN+="/usr/bin/evremap remap /evremap.toml"  
```  
  
根据自己的设备情况把匹配条件写好  
  
> [!IMPORTANT]    
> 注意，这里的 `evremap.toml` 路径不能放到自己的家目录，不然会无法正常启动  
>  
> 😭 我卡在这里好久  
>  
> 放在根目录最省事，也可以软连接到根目录 `ln -s /home/lay/dotfiles/linux/evremap.toml /evremap.toml`  
  
然后重启测试  
  
---  
  
[systemd](https://wiki.archlinux.org/title/Systemd)  
  
也是 `evremap Readme` 中推荐的方式，但是！  
  
> [!IMPORTANT]    
> 如果设备在开机的时候没有挂载的话（比如蓝牙还没有连上），通过这种方式 evremap 会启动失败，还需要手动重启  
  
所以这种方法对于蓝牙键盘来说完全不能用，因为系统没启动前蓝牙肯定没有连上啊，但如果你是有线键盘，这种还是比较省事  
  
使用如下命令创建 `systemd service`  
  
```sh  
sudo nvim /etc/systemd/system/evremap.service  
```  
  
把 <https://github.com/wez/evremap/blob/master/evremap.service> 中的内容写入，并把 `evremap.toml` 的绝对路径替换成你自己的本地路径  
  
然后使用 `systemctl` 控制开机自启动  
  
```sh  
sudo systemctl daemon-reload  
sudo systemctl enable evremap.service  
sudo systemctl start evremap.service  
```  
  
### Dotfiles  
  
TUI、shell、输入法、nvim、terminal 等安装和配置，可以参考 [GitHub - lei4519/dotfiles: vim、linux、mac 配置](https://github.com/lei4519/dotfiles)，这里不再赘述  
  
### 有用的软件  
  
我平时喜欢用终端，所以比较钟意 TUI  
  
> [awesome-tuis](https://github.com/rothgar/awesome-tuis)    
> [awesome-shell](https://github.com/alebcay/awesome-shell)    
> [awesome-zsh-plugins](https://github.com/unixorn/awesome-zsh-plugins)    
> [awesome-cli-apps](https://github.com/agarrharr/awesome-cli-apps)  
  
- [sysz: An fzf terminal UI for systemctl](https://github.com/joehillen/sysz?tab=readme-ov-file)  
- [xdg-ninja: A shell script which checks your $HOME for unwanted files and directories.](https://github.com/b3nj5m1n/xdg-ninja)  
- [sahib/rmlint: Extremely fast tool to remove duplicates and other lint from your filesystem](https://github.com/sahib/rmlint)  
- [yadm: Yet Another Dotfiles Manager](https://github.com/TheLocehiliosan/yadm)  
  
#### 固态硬盘清理  
  
> [Solid state drive - ArchWiki](https://wiki.archlinux.org/title/Solid_state_drive)  
  
```sh  
sudo systemctl enable fstrim.timer  
sudo systemctl start fstrim.timer  
```  
  
### 睡眠和休眠  
  
> 完善的 dots 配置应该会自动配置好睡眠和休眠  
  
[Power management/Suspend and hibernate - ArchWiki](https://wiki.archlinux.org/title/Power_management/Suspend_and_hibernate#Tips_and_Tricks)  
  
### 中文字体设置  
  
> [!TIP]    
> 建议先安装 [Hyprland 配置](Arch%20Linux%20%E7%B3%BB%E7%BB%9F%E9%85%8D%E7%BD%AE%E7%AF%87.md#Hyprland%20配置) ，如果你选择的配置没有自动帮你配置字体，再进行如下操作  
  
参考：  
  
- [Localization/Chinese - ArchWiki](https://wiki.archlinux.org/title/Localization/Chinese#Fonts)  
- [Font configuration/Chinese - ArchWiki](https://wiki.archlinux.org/title/Font_configuration/Chinese)  
  
```sh  
# 安装中文字体  
sudo pacman -S ttf-roboto noto-fonts noto-fonts-cjk adobe-source-han-sans-cn-fonts adobe-source-han-serif-cn-fonts ttf-dejavu  
# 配置字体  
nvim ~/.config/fontconfig/fonts.conf  
```  
  
复制以下内容，然后重启电脑即可  
  
```html  
<?xml version="1.0"?>  
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">  
<fontconfig>  
  <its:rules xmlns:its="http://www.w3.org/2005/11/its" version="1.0">  
    <its:translateRule  
      translate="no"  
      selector="/fontconfig/*[not(self::description)]"  
    />  
  </its:rules>  
  
  <description>Android Font Config</description>  
  
  <!-- Font directory list -->  
  
  <dir>/usr/share/fonts</dir>  
  <dir>/usr/local/share/fonts</dir>  
  <dir prefix="xdg">fonts</dir>  
  <!-- the following element will be removed in the future -->  
  <dir>~/.fonts</dir>  
  
  <!-- Disable embedded bitmap fonts -->  
  <match target="font">  
    <edit name="embeddedbitmap" mode="assign">  
      <bool>false</bool>  
    </edit>  
  </match>  
  
  <!-- English uses Roboto and Noto Serif by default, terminals use DejaVu Sans Mono. -->  
  <match>  
    <test qual="any" name="family">  
      <string>serif</string>  
    </test>  
    <edit name="family" mode="prepend" binding="strong">  
      <string>Noto Serif</string>  
    </edit>  
  </match>  
  <match target="pattern">  
    <test qual="any" name="family">  
      <string>sans-serif</string>  
    </test>  
    <edit name="family" mode="prepend" binding="strong">  
      <string>Roboto</string>  
    </edit>  
  </match>  
  <match target="pattern">  
    <test qual="any" name="family">  
      <string>monospace</string>  
    </test>  
    <edit name="family" mode="prepend" binding="strong">  
      <string>DejaVu Sans Mono</string>  
    </edit>  
  </match>  
  
  <!-- Chinese uses Source Han Sans and Source Han Serif by default, not Noto Sans CJK SC, since it will show Japanese Kanji in some cases. -->  
  <match>  
    <test name="lang" compare="contains">  
      <string>zh</string>  
    </test>  
    <test name="family">  
      <string>serif</string>  
    </test>  
    <edit name="family" mode="prepend">  
      <string>Source Han Serif CN</string>  
    </edit>  
  </match>  
  <match>  
    <test name="lang" compare="contains">  
      <string>zh</string>  
    </test>  
    <test name="family">  
      <string>sans-serif</string>  
    </test>  
    <edit name="family" mode="prepend">  
      <string>Source Han Sans CN</string>  
    </edit>  
  </match>  
  <match>  
    <test name="lang" compare="contains">  
      <string>zh</string>  
    </test>  
    <test name="family">  
      <string>monospace</string>  
    </test>  
    <edit name="family" mode="prepend">  
      <string>Noto Sans Mono CJK SC</string>  
    </edit>  
  </match>  
  
  <!-- Windows & Linux Chinese fonts. -->  
  <!-- Map all the common fonts onto Source Han Sans/Serif, so that they will be used when Source Han Sans/Serif are not installed. This solves a situation where some programs asked for a font, and under the non-existance of the font, it will not use the fallback font, which caused abnormal display of Chinese characters. -->  
  <match target="pattern">  
    <test qual="any" name="family">  
      <string>WenQuanYi Zen Hei</string>  
    </test>  
    <edit name="family" mode="assign" binding="same">  
      <string>Source Han Sans CN</string>  
    </edit>  
  </match>  
  <match target="pattern">  
    <test qual="any" name="family">  
      <string>WenQuanYi Micro Hei</string>  
    </test>  
    <edit name="family" mode="assign" binding="same">  
      <string>Source Han Sans CN</string>  
    </edit>  
  </match>  
  <match target="pattern">  
    <test qual="any" name="family">  
      <string>WenQuanYi Micro Hei Light</string>  
    </test>  
    <edit name="family" mode="assign" binding="same">  
      <string>Source Han Sans CN</string>  
    </edit>  
  </match>  
  <match target="pattern">  
    <test qual="any" name="family">  
      <string>Microsoft YaHei</string>  
    </test>  
    <edit name="family" mode="assign" binding="same">  
      <string>Source Han Sans CN</string>  
    </edit>  
  </match>  
  <match target="pattern">  
    <test qual="any" name="family">  
      <string>SimHei</string>  
    </test>  
    <edit name="family" mode="assign" binding="same">  
      <string>Source Han Sans CN</string>  
    </edit>  
  </match>  
  <match target="pattern">  
    <test qual="any" name="family">  
      <string>SimSun</string>  
    </test>  
    <edit name="family" mode="assign" binding="same">  
      <string>Source Han Serif CN</string>  
    </edit>  
  </match>  
  <match target="pattern">  
    <test qual="any" name="family">  
      <string>SimSun-18030</string>  
    </test>  
    <edit name="family" mode="assign" binding="same">  
      <string>Source Han Serif CN</string>  
    </edit>  
  </match>  
  
  <!-- Load local system customization file -->  
  <include ignore_missing="yes">conf.d</include>  
  
  <!-- Font cache directory list -->  
  
  <cachedir>/var/cache/fontconfig</cachedir>  
  <cachedir prefix="xdg">fontconfig</cachedir>  
  <!-- the following element will be removed in the future -->  
  <cachedir>~/.fontconfig</cachedir>  
  
  <config>  
    <!-- Rescan configurations every 30 seconds when FcFontSetList is called -->  
    <rescan>  
      <int>30</int>  
    </rescan>  
  </config>  
</fontconfig>  
```  
  
---  
  
## Ref  
  
- [Btrfs：认识、从 Ext4 迁移与快照方案](https://blog.kaaass.net/archives/1748)  
- [config/INSTALL.txt at main · HeaoYe/config · GitHub](https://github.com/HeaoYe/config/blob/main/INSTALL.txt)  
- [pacman 常用命令-昨夜星辰](https://hustlei.github.io/2018/11/msys2-pacman.html)    
