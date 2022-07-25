export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
  /**
   * @description 保存种植区信息
   * @param {object} data data
   */
  SYS_FIELD_SET (data = {}) {
    return request({
      url: 'plantArea/setArea',
      method: 'post',
      data
    })
  },
  /**
   * @description 获取种植区信息
   * @param {object} data data
   */
  SYS_FIELD_GET (data = {}) {
    return request({
      url: 'plantArea/getAreaList',
      method: 'get',
      params: data
    })
  },
  /**
   * @description 删除种植区信息
   * @param {object} data data
   */
  SYS_FIELD_DEL (data = {}) {
    return request({
      url: 'plantArea/delArea',
      method: 'post',
      data
    })
  }
})
