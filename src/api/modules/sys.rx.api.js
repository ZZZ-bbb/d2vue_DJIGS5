export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
  /**
   * @description 获取处方信息
   */
  SYS_RX_GET (data) {
    return request({
      url: 'rxManagement/getRx',
      method: 'get',
      params: data
    })
  },
  SYS_RX_DEL (data) {
    return request({
      url: 'rxManagement/delRx',
      method: 'post',
      data
    })
  },
  SYS_RX_DOWNLOAD (data) {
    return request({
      url: 'rxManagement/downloadRx',
      method: 'get',
      params: data
    })
  }
})
