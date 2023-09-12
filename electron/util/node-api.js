import fs from 'node:fs'
import node_path from 'node:path'
import { generateThumbnail } from './ffmpeg'
import Store from './store'

const excludeDir = ['node_modules', 'thumbnail']

// 获取目录树
export const getDirTree = (path, refresh, dirTree = [], depth = 0) => {
  if (!path) return
  if (Store.has('dirTree') && !refresh) {
    console.log('read dir cache')
    return Promise.resolve(Store.get('dirTree'))
  }
  return new Promise((resolve, reject) => {
    fs.readdir(path, async (err, files) => {
      if (err) {
        reject(err)
      }
      for (const fileName of files) {
        try {
          const stat = fs.statSync(path + fileName)
          const filterReg = /\.(asar)$/i
          // 文件夹
          const isValidDir = !filterReg.test(fileName) && stat.isDirectory() && !excludeDir.includes(fileName)
          if (isValidDir) {
            const item = {
              label: fileName,
              name: fileName,
              fullName: path + fileName,
              path,
              depth,
              children: []
            }
            // 递归遍历
            await getDirTree(item.fullName + '/', refresh, item.children, depth + 1)
            dirTree.push(item)
          }
        } catch (error) {
          reject(error)
        }
      }
      if (depth == 0 && dirTree.length > 0) {
        Store.set('dirTree', dirTree)
      }
      resolve(dirTree)
    })
  })
}

// 获取目录下的所有文件
export const getDirFiles = (path, refresh) => {
  if (Store.has(path) && !refresh) {
    console.log('read file cache')
    console.log(Store.path)
    return Promise.resolve(Store.get(path))
  }
  return new Promise((resolve, reject) => {
    try {
      const files = fs.readdirSync(path)
      const fileList = []
      if (files.length == 0) {
        resolve(fileList)
      }
      // 检查是否存在封面文件夹，存在则匹配好视频与图片的对应关系
      const hasThumbnailDir = files.includes('thumbnail')
      const thumbnailPath = path + 'thumbnail'
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
      let generateTn = false
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
          // 若不存在对应缩略图，则调用ffmpeg生成
          if (!tnMap.has(baseName)) {
            const outputPath = thumbnailPath + '/' + baseName + '.png'
            const command = `ffmpeg -i "${fullName}" -ss 00:00:03 -vframes 1 "${outputPath}"`;
            promises.push(generateThumbnail(command))
            item.img = outputPath
            generateTn = true
          } else {
            item.img = thumbnailPath + '/' + baseName + tnMap.get(baseName)
          }
          fileList.push(item)
        }
      }
      Promise.all(promises).then(res => {
        const result = { currentPath: path, fileList }
        if (fileList.length > 0) {
          Store.set(path, result)
        }
        // 若没有存在视频和生成缩略图则删除文件夹
        if (thumbnail.length == 0 && !generateTn) {
          fs.rmdirSync(thumbnailPath)
        }
        resolve(result)
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

