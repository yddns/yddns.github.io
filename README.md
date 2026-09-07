# 基于 Jekyll 的个人博客项目

## 项目说明

这是一个基于 Jekyll 构建的个人博客，包含蓝色渐变雨主题、动态背景、雨效和音乐播放器。

## 音乐来源

播放器使用的 `Castle城 - 雨之城.mp3` 原始来源为游戏《Milthm》。该音乐不属于本项目作者创作内容，也不包含在本项目 MIT License 的授权范围内。二次分发或使用该音乐时，请遵守版权方、游戏开发者及相关平台的授权要求。

## 构建方式

### 环境要求

- Ruby
- Bundler
- Jekyll 4.3 或兼容版本

### 本地构建

安装依赖：

```bash
bundle install
```

构建站点：

```bash
bundle exec jekyll build
```

构建结果默认输出到 `_site/` 目录。

本地预览并监听文件变化：

```bash
bundle exec jekyll serve --livereload
```

然后访问 `http://localhost:4000/`。

### GitHub Pages 构建

推送到 `main` 分支后，GitHub Actions 会执行 `.github/workflows/jekyll-gh-pages.yml` 中的构建和部署流程。也可以在仓库的 Actions 页面手动运行该工作流。

## 协议

项目代码、页面模板、样式、脚本及作者创作的其他内容按照 MIT License 发布，详见 [LICENSE.md](LICENSE.md)。二次分发说明见 [SECONDARY-DISTRIBUTION.md](SECONDARY-DISTRIBUTION.md)。
