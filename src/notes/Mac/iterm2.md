# Iterm2

1. iterm2
	```sh
	brew install --cask iterm2
	```
2. on my zsh
	```sh
	sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
	```
3. P10k
	```sh
	git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/themes/powerlevel10k
	```
4. 打开 `~/.zshrc` 设置 `ZSH_THEME`
	```sh
	POWERLEVEL9K_MODE="nerdfont-complete"
	ZSH_THEME="powerlevel10k/powerlevel10k
	```
5. 完成
重启 iterm 后会进入 `p10k` 的初始化流程，后面想要主动调用就执行：`p10k configure`
