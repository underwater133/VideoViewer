import fs from 'node:fs'
import node_path from 'node:path'
import { generateThumbnail } from './ffmpeg'
const excludeDir = ['node_modules', 'thumbnail']

// 获取目录树
export const getDirTree = (path, dirTree = [], depth = 0) => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, async (err, files) => {
      if (err) {
        reject(err)
      }
      for (const fileName of files) {
        try {
          const stat = fs.statSync(path + fileName)
          if (stat.isDirectory() && !excludeDir.includes(fileName)) {
            const item = {
              label: fileName,
              name: fileName,
              fullName: path + fileName,
              path,
              depth,
              children: []
            }
            // 递归查找
            await getDirTree(item.fullName + '/', item.children, depth + 1)
            dirTree.push(item)
          }
        } catch (error) {
          reject(error)
        }
      }
      resolve(dirTree)
    })
  })
}

// 获取目录下的所有文件
export const getDirFiles = (path) => {
  return new Promise((resolve, reject) => {
    try {
      const files = fs.readdirSync(path)
      const fileList = []

      // 检查是否存在封面文件夹，存在则匹配好视频与图片的对应关系
      const hasThumbnailDir = files.includes('thumbnail')
      const thumbnailPath = path + 'thumbnail'
      console.log(hasThumbnailDir, thumbnailPath)
      if (!hasThumbnailDir) {
        // 创建缩略图存放目录
        fs.mkdirSync(thumbnailPath)
      }
      const thumbnail = fs.readdirSync(thumbnailPath)
      const tnMap = new Map()
      thumbnail.forEach(fileName => {
        const fullName = thumbnailPath + '/' + fileName
        const type = node_path.extname(fullName)
        const baseName = node_path.basename(fullName, type)
        const imageExtensionsRegex = /\.(jpg|jpeg|png|gif)$/i;
        if (imageExtensionsRegex.test(type)) {
          tnMap.set(baseName, type)
        }
      })
      const promises = []
      for (const fileName of files) {
        const fullName = path + fileName
        const stat = fs.statSync(fullName)
        const type = node_path.extname(fullName)
        const videoExtensionsTegex = /\.(mp4|avi|mov)$/i;
        if (!stat.isDirectory() && videoExtensionsTegex.test(type)) {
          const baseName = node_path.basename(fullName, type)
          const item = {
            name: baseName,
            fullName,
            path,
            type: node_path.extname(fullName)
          }
          if (!tnMap.has(baseName)) {
            const outputPath = thumbnailPath + '/' + baseName + '.png'
            const command = `ffmpeg -i ${fullName} -ss 00:00:03 -vframes 1 ${outputPath}`;
            promises.push(generateThumbnail(command))
            item.img = outputPath
          } else {
            item.img = thumbnailPath + '/' + baseName + tnMap.get(baseName)
          }
          fileList.push(item)
        }
      }
      Promise.all(promises).then(res => {
        resolve(fileList)
      }).catch(err => {
        reject(err)
      })
    } catch (err) {
      reject(err)
    }
  })
}


export default {
  getDirTree,
  getDirFiles
}

