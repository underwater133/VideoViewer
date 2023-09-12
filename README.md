# viedo-viewer
## 快速搭建
```sh
# clone the project
git clone https://github.com/electron-vite/electron-vite-vue.git

# enter the project directory
cd electron-vite-vue

# install dependency
npm install

# develop
npm run dev
```
## 简介

## 使用教程
使用之前需要先安装ffmpeg插件，该插件主要是为了生成视频的缩略图，可以方便懒得整理封面的人群。
下载链接：
[https://www.gyan.dev/ffmpeg/builds/](https://www.gyan.dev/ffmpeg/builds/)
下载之后直接解压，然后在系统路径的path中把bin文件夹添加进去。
操作方法：
此电脑-属性-高级系统设置-高级-环境变量-系统变量。
找到path，双击进去点击浏览，选择刚刚ffmpeg解压之后里面的bin文件夹即可。
如果打开软件之后还提示没有安装ffmpeg，可能是设置的环境变量还没生效，建议重启电脑。

