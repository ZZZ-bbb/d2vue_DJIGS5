export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
  /**
   * @description 获取当前路径数据
   * @param {Object} data data
   */
  SYS_MAP_LAYER_GET (data) {
    return request({
      url: 'map/get_layer',
      method: 'get',
      params: data
    })
  }
})
