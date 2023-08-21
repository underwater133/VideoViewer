## css实现span元素点击之后修改颜色
如果使用active伪类的话，只有在被点击的时候才会修改，松开鼠标后则又变回原来的样式。
所以需要使用focus伪类，但对span元素不生效。
解决的方法是在span标签内设置属性tabindex，则可以激活focus伪类。

## Unable to load preload script
解决方法：
electron20+沙箱内置了一些node方法 fs不在里面 需要配置禁用沙箱：在webPreferences里添加sandbox: false

## operation not permitted, stat
解决方法：
检查读取文件的路径中，是否使用了相对路径。如果是则修改成绝对路径，因为打包后运行的路径不是在当前路径下，导致访问了错误的路径和文件，可能出现权限不足的情况。
如果在绝对路径下还是报错，则可以考虑使用管理员模式运行项目。

项目搭建推荐使用 https://github.com/electron-vite/electron-vite-vue
不会出现上面各种奇奇怪怪的bug

##　通信
进程之间的双向通信
为了方便操作（但是不安全），在创建窗口时加上配置：
nodeIntegration: true,
contextIsolation: false,
赋予渲染进程访问electron的权限和取消上下文隔离。

在主进程中设定监听事件，如：
ipcMain.handle('getDirTree', async () => await getDirTree(rootPath))

在渲染进程中请求该事件，如：
ipcRenderer.invoke('getDirTree').then(res => {
  state.dirTree = res
})

如果需要传参的话，主进程中接收事件第一个参数是event，后面的参数才是前端传递过来的，如果需要再次向渲染通信，可以调用event.sender.send，如：
ipcMain.handle('getDirFiles', async (event, path) => {
  const res = await getDirFiles(path)
  event.sender.send('dirFiles', res)
})

在渲染进程中，应该同主进程一样设定一个监听事件来接收，如：
ipcRenderer.on('dirFiles', (event, data) => {
  console.log(data)
})


## 在渲染进程加载本地图片
需要在webPreferences中将webSecurity设置为false。


## 使用ffmpeg生成视频缩略图
在ffmpeg下载对应系统的版本。
下载之后解压缩，然后再系统变量的Path中添加 解压之后bin文件夹所在的路径(包含bin)
添加路径之后可以在cmd中检查是否设置成功 ffmpeg -version，若不能识别需要查看设置是否正确，然后重开机再试一遍。
设置成功之后就可以在nodejs中使用命令行去生成了。
```js
const command = `ffmpeg -i ${videoPath} -ss ${timestamp} -vframes 1 ${outputPath}`;
exec(command, (err) => {
  console.log(err)
})
```

@todo
点击相同文件夹不刷新。