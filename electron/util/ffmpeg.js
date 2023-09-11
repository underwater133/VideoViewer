const { exec } = require('child_process');

export const generateThumbnail = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (err) => {
      if (err) {
        reject(err)
      }
      resolve()
    })
  })
}

export default {
  generateThumbnail
}