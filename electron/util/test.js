const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const { exec } = require('child_process');

const videoPath = 'F:/practicespace/electron-vite-vue/videos/a.mp4'; // 替换为你的视频文件路径
const outputPath = 'F:/practicespace/electron-vite-vue/videos/thumbnail/a.png'; // 生成的封面图片保存路径
const timestamp = '00:00:03'; // 截取的时间戳，根据需要调整

// ffmpeg(videoPath)
// .screenshots({
//   timestamps: ['00:00:02'],
//   filename: '演示视频 - 副本.png',
//   folder: outputPath,
//   size: '320x240'
// });

const command = `ffmpeg -i ${videoPath} -ss ${timestamp} -vframes 1 ${outputPath}`;
exec(command, (err) => {
  console.log(err)
})