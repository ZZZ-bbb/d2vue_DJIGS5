export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
  /**
   * @description 获取处方信息
   */
  SYS_RX_GET () {
    return request({
      url: 'rxManagement/getRx',
      method: 'get'
    })
  }
})
