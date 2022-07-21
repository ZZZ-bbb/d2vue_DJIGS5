export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
  /**
   * @description 检测文件是否上传过
   * @param { Object } data 上传参数
   */
  SYS_UPLOAD_CHECK (data) {
    return request({
      url: 'ddxc/check_file',
      method: 'post',
      data
    })
  },
  /**
   * @description 文件整合
   * @param { Object } data { file_ID }
   */
  SYS_UPLOAD_COMBINE (data) {
    return request({
      url: 'ddxc/file_combine',
      method: 'get',
      params: data,
      timeout: 15000
    })
  }
})
