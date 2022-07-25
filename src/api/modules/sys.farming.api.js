export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
  /**
   * @description 保存农事信息
   * @param {object} data data
   */
  SYS_FARMING_SET (data = {}) {
    return request({
      url: 'farmManagement/setFarmWork',
      method: 'post',
      data
    })
  },
  /**
   * @description 获取农事信息
   * @param {object} data data
   */
  SYS_FARMING_GET (data = {}) {
    return request({
      url: 'farmManagement/getFarmWork',
      method: 'post',
      params: data
    })
  }
})
