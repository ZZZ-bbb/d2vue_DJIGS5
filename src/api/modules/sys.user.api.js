export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
  /**
   * @description 本地LDAP登录
   * @param {object} data 登录携带的信息
   */
  SYS_USER_LOGIN (data = {}) {
    return request({
      url: 'account/ldap_login',
      method: 'post',
      data
    })
  },
  /**
   * @description 登出清空服务器记录
   */
  SYS_USER_LOGOUT () {
    return request({
      url: 'account/logout',
      method: 'get'
    })
  }
})
