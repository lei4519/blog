# iterm2 配置

## 安装
```sh
# iterm2
brew install --cask iterm2

# oh my zsh
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

# P10k
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/themes/powerlevel10k


# 打开 ~/.zshrc 设置 ZSH_THEME
POWERLEVEL9K_MODE="nerdfont-complete"
ZSH_THEME="powerlevel10k/powerlevel10k"


# 首次配置会自动启用配置。后面想要主动调用就执行： p10k configure
##