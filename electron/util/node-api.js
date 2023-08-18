import fs from 'node:fs'
import node_path from 'node:path'

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
          if (stat.isDirectory() && fileName !== 'node_modules') {
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
    fs.readdir(path, (err, files) => {
      if (err) {
        reject(err)
      }
      const fileList = []
      for (const fileName of files) {
        try {
          const fullName = path + fileName
          const stat = fs.statSync(fullName)
          if (!stat.isDirectory()) {
            const type = node_path.extname(fullName)
            const baseName = node_path.basename(fullName, type)
            const item = {
              name: baseName,
              fullName,
              path,
              type: node_path.extname(fullName)
            }
            // const imageExtensionsRegex = /\.(jpg|jpeg|png|gif)$/i;
            // if(imageExtensionsRegex.test(item.type)) {
            //   item.img = fs.readFileSync(fullName).toString('base64')
            // }
            fileList.push(item)
          }
        } catch (error) {
          reject(error)
        }
      }
      resolve(fileList)
    })
  })
}


export default {
  getDirTree,
  getDirFiles
}