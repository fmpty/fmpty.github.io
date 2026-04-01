# 技术漫谈

基于 [Hugo](https://gohugo.io/) 与 [PaperMod](https://github.com/adityatelange/hugo-PaperMod) 的个人博客站点源码。

线上地址：<https://fmpty.github.io/>

## 环境要求

- [Hugo Extended](https://gohugo.io/installation/)（需 Extended 以编译主题中的 SCSS）

## 克隆仓库

主题以子模块形式引入，请使用：

```bash
git clone --recurse-submodules https://github.com/fmpty/fmpty.github.io.git
cd fmpty.github.io
```

若已克隆但未拉取子模块：

```bash
git submodule update --init --recursive
```

## 本地预览

```bash
hugo server -D
```

浏览器访问终端提示的地址（一般为 `http://localhost:1313`）。

## 构建静态站点

```bash
hugo --gc --minify
```

输出目录为 `public/`。

## 部署

推送到 GitHub 的默认分支后，由 [GitHub Actions](.github/workflows/hugo.yml) 构建并发布到 **GitHub Pages**。

## 许可说明

- 本仓库中的站点配置、脚本等非文章部分：见仓库根目录 [`LICENSE`](LICENSE)。
- `content/` 下的文章与原创图文：**著作权归作者所有**，转载需征得同意并注明出处（除非单篇文章另有声明）。

## 主题

- [PaperMod](https://github.com/adityatelange/hugo-PaperMod)（MIT）
