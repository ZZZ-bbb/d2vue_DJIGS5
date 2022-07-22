export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
  /**
   * @description 获取当前路径数据
   * @param {Object} data data
   */
  SYS_ROUTE_GET (data) {
    return request({
      url: 'route/get_route_User',
      method: 'get',
      params: data
    })
  },
  /**
   * @description 删除路径数据
   * @param {Object} data Route_id {String} 路径id
   */
  SYS_ROUTE_DEL (data) {
    return request({
      url: 'route/del_route_User',
      method: 'get',
      params: data
    })
  },
  /**
   * @description 上传路径文件
   * @param {Object} data file {file} 路径文件
   */
  SYS_ROUTE_UPLOAD (data) {
    return request({
      url: 'route/upload_route',
      method: 'post',
      data
    })
  }
})
