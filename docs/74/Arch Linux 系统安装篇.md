---  
tags:  
  - Linux  
  - Hyprland  
  - HowTo  
created: 2024-04-16T22:44  
share: "true"  
issue: "74"  
---  
  
## TL;DR  
  
年前自己的 Mac 进水了，考虑良久（穷...）还是组了台台式机，作为一个终端重度使用者，Windows 用的真要发疯，果断切换到 Linux...  
  
查了半天资料，对 Arch 比较感兴趣，主要想在使用的过程中实践一下操作系统相关的知识  
  
本文记录一下折腾的过程（万一后面滚挂了...）  
  
[ArchWiki](https://wiki.archlinux.org/) 在手，万事不愁  
  
## Pre Install  
  
### 制作 U 盘引导工具  
  
> 在 U 盘里制作一个微型系统，用于安装真正的系统  
  
我用的 Mac，所以按照 [U 盘安装介质 - Arch Linux Wiki](https://wiki.archlinux.org/title/USB_flash_installation_medium)  
  
```sh  
# 查看自己的 U 盘名称，一般是 /dev/disk2  
diskutil list  
# 先卸载 U 盘  
diskutil unmountDisk /dev/diskXA  
# 将镜像写入到 U 盘中  
dd if=$path/$archlinux.iso of=/dev/rdiskX bs=1m  
```  
  
> [!CAUTION]    
> 这种方式会将 U 盘格式化，注意提前备份    
  
### 进入 U 盘系统  
  
> [!NOTE]    
> 会 vim 的话体验会好很多（hahahah）    
  
先通过 BIOS 进入 U 盘系统中  
  
### 联网  
  
首先需要联网 `WIFI`  
  
```sh  
# 进入交互式提示符  
iwctl  
# 如果不知道你的网络设备名称，列出所有 WiFi 设备  
device list  
# 扫描网络，注意替换设备名（注意：这个命令不会输出任何内容）  
station $device scan  
# 列出所有可用的网络  
station $device get-networks  
# 连接到一个网络  
station $device connect $SSID  
# 退出 or Ctrl+d  
quit  
```  
  
`ping baidu.com` 试下网络是否连接成功  
  
### 验证引导模式  
  
先看一下系统目前的引导模式，后面要用到  
  
检查 UEFI 位数：  
  
```sh  
cat /sys/firmware/efi/fw_platform_size  
```  
  
> 如果命令结果为  `64`，则系统是以 UEFI 模式引导且使用 64 位 x64 UEFI    
> 如果命令结果为  `32`，则系统是以 UEFI 模式引导且使用 32 位 IA32 UEFI，虽然其受支持，但引导加载程序只能使用  systemd-boot    
> 如果文件不存在，则系统可能是以 BIOS 模式（或  CSM  模式）引导。  
  
### 分区  
  
> [!TIP]    
> 注意！这里如果你的硬盘可以直接无脑格式化的话，就不需要在此操作    
>  
> 等下进到 `archinstall` 中直接使用推荐的分区方式即可    
  
因为我已经有一个 Windows 系统了，并且还要接着使用，所以不能直接格式化  
  
#### 扩展 Windows EFI 分区  
  
之前的 EFI 分区只有 300M 大小，需要扩大一点，这里我扩到了 1G，参考 [Create EFI](https://wiki.archlinux.org/title/EFI_system_partition#Create_the_partition)  
  
对已有 EFI 分区的进行扩展，可以自行搜索教程  
  
简单点说就是先把已存在的 ESP 分区中的内容 Copy 出来，分好新区之后把内容再放回去就行了  
  
#### Windows 软件分区  
  
因为已经有 Windows 了，所以我直接在 Win 中用 `DiskGenius` 分好 Linux 所需要的区了：分别是一个主系统分区和一个同内存大小的 `SWAP` 分区（我还专门给系统备份分了一个区）  
  
进入到 U 盘系统之后，通过命令找到自己的主系统分区和 `SWAP` 分区的设备名  
  
```sh  
# 列出所有的设备  
fdisk -l  
```  
  
先通过如下命令更改一下主系统分区的文件系统的格式  
  
> [!TIP]    
> 我想要用 `btrfs`，但是 DG 中没有 `btrfs` 的选项，只能先选了 `ext4`    
> 如果你想用的系统可以在 DG 中制作，就可以跳过这步    
  
> 滚动升级发行版建议用 btrfs ，滚之前做个快照，滚挂了能立即恢复。  
  
挂载系统盘到 U 盘系统  
  
```sh  
# 格式化  
mkfs.btrfs $dev -f  
mount $dev /mnt  
# btrfs 系统的子卷，备份用（参考 timeshift, Ubuntu 的类型布局）  
btrfs subvolume create /mnt/@  
btrfs subvolume create /mnt/@home  
umount $dev  
mount $dev /mnt -o subvol=@  
mount $dev /mnt/home -o subvol=@home --mkdir  
```  
  
挂载启动分区（Windows 已经有了，所以不用创建直接挂载即可，正常应该创建一个分区用来放引导）  
  
> [EFI system partition - ArchWiki](https://wiki.archlinux.org/title/EFI_system_partition#Create_the_partition)  
  
```sh  
# timeshift 需要是这个路径  
mount $efi_dev /mnt/boot/efi --mkdir  
```  
  
制作 `SWAP` 分区  
  
```sh  
mkswap $dev  
# 启用  
swapon $dev  
```  
  
> [!TIP]    
> linux 可以使用 `fdisk｜cfdisk` 分区    
  
### 镜像  
  
使用 `vim /etc/pacman.d/mirrorlist`，在开头加上镜像源  
  
```sh  
Server = https://mirrors.ustc.edu.cn/archlinux/$repo/os/$arch  
Server = https://mirrors.tuna.tsinghua.edu.cn/archlinux/$repo/os/$arch  
```  
  
更新一下 `pacman -Syu`  
  
## Install  
  
> 人生苦短，我用 `archinstall`  
  
好处是根据配置项一个一个选择，一些相关的依赖会提示你选择 or 自动帮你选择  
  
坏处自然就是帮你做了选择... 囧（对于想完全自定义的人来说是坏处吧  
  
但对于新手来说，推荐的反而更省心  
  
下面根据需要配置的选项顺序一个一个说  
  
> [!TIP]    
> 搜索统一是键入 `/` 后直接输入字符    
  
### Mirrors  
  
上面已经配置了，所以这一步可以直接跳过  
  
主要是这一步虽然可以通过选择 `Mirror region` 后选 `Chind`，但安装速度依然很慢（可能默认的地理位置离我都比较远  
  
### Disk Configuration  
  
> [!TIP]    
> 如果你的硬盘可以格式化，就选择推荐的方式    
  
如果像我一样已经分好区了并挂载到 U 盘系统中了，这里就选择 `Pre-mounted configuration`，然后输入 `/mnt` 回车  
  
正常的话会看到 `/mnt` 中已挂载的分区名称  
  
### Bootloader  
  
根据上面 [验证引导模式](Arch%20Linux%20%E7%B3%BB%E7%BB%9F%E5%AE%89%E8%A3%85%E7%AF%87.md#验证引导模式) 的结果选择合适的引导，我的是 64，所以选了 `Grub`  
  
### Hostname  
  
设置一下主机名字，我直接用的 `root`  
  
### Root Password  
  
设置一下 root 密码  
  
### User account  
  
再创建一个普通用户，日常用的就是这个  
  
### Profile  
  
选择桌面环境、驱动之类的，可以按照自己的需要选择  
  
> 🔍 linux 桌面环境（`kde/gnome/xface`）、窗口管理器 (`dwm/i3/bspwm`)  
  
#### Type  
  
我选的是 `Desktop -> Hyprland`  
  
> [!NOTE]    
> 为什么选 Hyprland 呢？    
>  
> 因为本来我也是想用 i3wm 之类的窗口管理器的（现在 Mac 中就是用的 yabai）    
>  
> 结果看到 Hyprland 之后就被它吸引了，关键词大概是：漂亮、动画、流畅、轻量、新特性等等    
>  
> 以及我的电脑也没有 Nvidia GPU，并且也想试一些新的东西    
>  
> -- [为什么使用 Wayland 而不是 X11？](https://www.cbtnuggets.com/blog/technology/networking/why-use-wayland-versus-x11)    
  
> [!TIP]    
> Hyprland 需要访问您的硬件设备，例如键盘、鼠标和显卡，请选择访问方式？    
> - polkit    
> - seatd    
  
硬件访问选了 `polkit` ，其实我也不知道应该选哪个，但是我在 [Must have – Hyprland Wiki](https://wiki.hyprland.org/Useful-Utilities/Must-have/) 上搜到了 `polkit` ，没有搜到 `seatd`  
  
`Graphics driver` 显卡驱动默认所有 `all open-source`  
  
`Greeter` 默认 `sddm` （如果有多个桌面环境/窗口管理器，可以在登录时进行选择切换  
  
### Audio  
  
我选择了 `pipewire` ，简单说 `pipewire` 是更新的产物，兼容 `PulseAudio`  
  
这里有一篇文章可以详细查看：[PipeWire vs PulseAudio: What's the Difference?](https://itsfoss.com/pipewire-vs-pulseaudio/)  
  
### Kernels  
  
默认了 `linux`  
  
[Kernel - Arch Wiki](https://wiki.archlinux.org/title/Kernel)  
  
### Additional Packages  
  
`archinstall` 已经默认安装了如 `base base-devel linux linux-firmware efibootmgr` 等包  
  
如果有其他需要安装的包，可以在这里输入（使用空格分隔多个包）  
  
我需要如下包：`man git zsh neovim openssl btrfs-progs os-prober grub linux-headers`  
  
> [!TIP]    
> `os-prober` 是双系统引导要使用的    
  
### Network Configuration  
  
选择 `Use NetworkManager`  
  
### Timezone  
  
时区选 上海 （直接 `/` 搜 `shanghai`）  
  
### More  
  
其他的根据自己的需要选择就好  
  
都弄完后然后执行 `Install` 等待安装成功  
  
## Post Install  
  
全部安装成功之后，会提醒你是否使用 `chroot` 进入系统中配置后续的内容，点击否  
  
回到 U 盘系统中执行  
  
```sh  
# 挂载配置  
genfstab -U /mnt >> /mnt/etc/fstab  
```  
  
之后通过 `arch-chroot /mnt` 进入系统  
  
> [!NOTE]    
> 有些命令 archinstall 已经帮我们做了，具体的可以自己再 check 一下    
> - `nvim /etc/locale.conf` 添加 `LANG=en_US.UTF-8`    
> - `systemctl enable NetworkManager`    
> - `grub-install --target=x86_64-efi --efi-directory=/boot`    
> - ...    
>  
> 后面说些还需要我们自己手动做的    
  
### 设置中文语言  
  
```sh  
nvim /etc/locale.gen  
# 取消 zh_CN.UTF-8 前的注释（en_US.UTF-8 已经取消了  
locale-gen  
```  
  
### Initramfs 配置  
  
[mkinitcpio - ArchWiki](https://wiki.archlinux.org/title/mkinitcpio)  
  
```sh  
# 在HOOKS中加入 btrfs  
nvim /etc/mkinitcpio.conf  
mkinitcpio -P  
```  
  
### Pacman 配置  
  
```sh  
nvim /etc/pacman.conf  
# 取消 Color 和 ParallelDownloads 前的注释  
# 加上一行 ILoveCandy  吃豆人彩蛋  
pacman -Syu  
```  
  
### 设置用户 Shell  
  
```sh  
su <用户名>  
# 查看 shell 位置  
whereis zsh  
chsh -s /usr/bin/zsh  
# Ctrl+D 退出用户登陆  
```  
  
### 引导  
  
[Boot Loader - Arch Wiki](https://wiki.archlinux.org/title/Arch_boot_process#Boot_loader)  
  
双系统需要设置一下引导  
  
```sh  
# 检查  
sudo grub-install --recheck /dev/你的硬盘  
# grub-install --target=x86_64-efi --efi-directory=/boot  
sudo nvim /etc/default/grub  
# 将最后一行的注释去掉，启用 os-prober 检测双系统  
  
# 设置引导界面的分辨率  
# 在文件内搜索 GRUB_GFXMODE 变量，如果没有的话就新加一个  
# 将 `GRUB_GFXMODE` 的值设置为你希望的分辨率，例如 `GRUB_GFXMODE=1920x1080`  
  
# 如果之前为 Arch 创建了单独的 EFI，那么现在将 windows 的EFI分区挂载到任意目录 例如(/mnt)  
# 运行 sudo os-prober 看看能不能检测到windows  
sudo os-prober  
# 重新生成配置文件  
sudo grub-mkconfig -o /boot/grub/grub.cfg  
```  
  
> [!TIP]    
> 如果这一步的 os-prober 没有成功也没关系，等下进入到系统中再做也一样    
  
### 重启  
  
```sh  
# Ctrl+D 退出登陆  
umount -R /mnt #取消挂载  
reboot #重启  
```  
  
配置完后重启电脑并拔掉 U 盘  
  
之后就可以进入 arch 系统了，后面的继续参考 [Arch Linux 系统配置篇](../75/Arch%20Linux%20%E7%B3%BB%E7%BB%9F%E9%85%8D%E7%BD%AE%E7%AF%87.md)  
