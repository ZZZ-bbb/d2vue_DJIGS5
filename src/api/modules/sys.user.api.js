export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
  /**
   * @description 登录
   * @param {object} data 登录携带的信息
   */
  SYS_USER_LOGIN (data = {}) {
    return request({
      url: 'account/login_check',
      method: 'post',
      data
    })
  },
  /**
   * @description 获取验证码
   */
  SYS_USER_CODE () {
    return request({
      url: 'account/get_code',
      method: 'get',
      responseType: 'blob'
    })
  }
})
