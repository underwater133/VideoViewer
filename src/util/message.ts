import { ElMessage } from 'element-plus'

export const Message = (msg: string, type: any) => {
  ElMessage({
    type,
    message: msg,
  })
}

export default Message