export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
  /**
   * @description 获取用户农事信息
   * @param {object} data data
   */
  SYS_ORG_GET (data = {}) {
    return request({
      url: 'orgManagement/getFarmWork',
      method: 'post',
      data
    })
  }
})
