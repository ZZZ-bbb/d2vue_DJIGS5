export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
  /**
   * @description 获取用户农事信息
   * @param {object} data { type: 'all'\'cancel'\'done'\'process'\'pending'} 农事类型
   */
  SYS_ORG_GET (data = {}) {
    return request({
      url: 'orgManagement/getFarmWork',
      method: 'post',
      data
    })
  },
  /**
   * @description 获取农事待处理和进行中的任务数量
   */
  SYS_ORG_GET_NUM () {
    return request({
      url: 'orgManagement/getWorkNum',
      method: 'get'
    })
  },
  /**
   * @description 接受任务
   * @param {Object} data work_id
   */
  SYS_ORG_ACCESS_WORK (data = {}) {
    return request({
      url: 'orgManagement/accessWork',
      method: 'post',
      data
    })
  }
})
