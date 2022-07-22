export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
  /**
   * @description 获取当前路径数据
   * @param {Object} data data
   */
  SYS_EDITION_GET (data) {
    return request({
      url: 'edition/get_edition',
      method: 'get',
      params: data
    })
  },
  /**
   * @description 删除版本信息
   * @param {Object} data Edition_ID {String} 版本id
   */
  SYS_EDITION_DEL (data) {
    return request({
      url: 'edition/del_edition',
      method: 'get',
      params: data
    })
  },
  /**
   * @description 上传版本文件
   * @param {Object} data file {file} 版本文件
   * @param {Object} data Edition_desc {string} 版本描述
   * @param {Object} data Edition_filename {string} 版本号
   */
  SYS_EDITION_UPLOAD (data) {
    return request({
      url: 'edition/upload_apk',
      method: 'post',
      data
    })
  }
})
