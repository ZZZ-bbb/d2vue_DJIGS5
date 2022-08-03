export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
  /**
   * @description 获取作业数据
   * @param {Object} data data
   */
  SYS_TASK_GET (data) {
    return request({
      url: 'task/get_taskdata',
      method: 'get',
      params: data
    })
  },
  /**
   * @description 删除作业数据
   * @param {Object} data task_id {String} 作业id
   */
  SYS_TASK_DEL (data) {
    return request({
      url: 'task/del_taskdata',
      method: 'get',
      params: data
    })
  },
  /**
   * @description 获取作业文件详情
   * @param {Object} data task_id {String} 作业id
   */
  SYS_TASK_GET_DETAIL (data) {
    return request({
      url: 'task/get_taskdetail',
      method: 'get',
      params: data
    })
  },
  /**
   * @description 获取实际飞行路径坐标数据
   * @param {Object} data task_id {String} 作业id
   */
  SYS_TASK_GET_UAV_INFO (data) {
    return request({
      url: 'task/get_task_uavinfo',
      method: 'get',
      params: data
    })
  },
  /**
   * @description 获取作业电池信息
   * @param {Object} data task_id {String} 作业id
   */
  SYS_TASK_GET_BAT_INFO (data) {
    return request({
      url: 'task/get_task_batteryinfo',
      method: 'get',
      params: data
    })
  }
})
