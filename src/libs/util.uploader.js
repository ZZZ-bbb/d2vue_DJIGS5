import WebUploader from 'webuploader'
import 'webuploader/dist/webuploader.css'

const uploader = {}

/**
 * @description 初始化webuploader
 * @param {Object} option 配置参数
 */
uploader.init = function (option = {}) {
  const currentOption = {
    pick: '',
    server: '',
    chunked: true, // 分片上传
    chunkSize: process.env.VUE_APP_CHUNKSIZE,
    chunkRetry: 2, // 重传次数,共chunkRetry + 1次
    threads: 1, // 上传并发数
    formData: {}, // 请求参数
    method: 'POST',
    fileNumLimit: 100, // 文件总数量限制
    fileVal: 'file' // 文件上传的key
  }
  Object.assign(currentOption, option)
  return WebUploader.create(currentOption)
}
/**
 * @description 创建内部wuFile对象，否则调用addFiles方法时可能会报 "Can\'t add external files" 错误
 * @param {Object} file 上传文件
 */
uploader.initFile = function (file) {
  return new WebUploader.File(new WebUploader.Lib.File(WebUploader.guid('rt_'), file))
}

export default uploader
