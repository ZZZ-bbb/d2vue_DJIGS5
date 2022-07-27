import api from '@/api'
import { Message, MessageBox } from 'element-ui'
import router from '@/router'

export default {
  namespaced: true,
  state: {
    // chart1Data: [],
  },
  mutations: {
    setData (state, data) {
      state.chart1Data = data
    }
  },
  actions: {
    /**
     * @description 获取作业数据
     * @param {Object} context
     * @param {Object} data data
     */
    async getTaskData (context, data) {
      const res = await api.SYS_TASK_GET(data)
      return res.data
    },
    /**
     * @description 获取wms图层名
     * @param {Object} context
     * @param {Object} data data
     */
     async getLayerData (context, data) {
      const res = await api.SYS_MAP_LAYER_GET(data)
      return res.data
    },
    /**
     * @description 删除作业文件
     * @param {Object} context
     * @param {Object} data task_id {String} 作业id
     */
    async deleteTaskData ({ commit }, data) {
      async function deleteData (data) {
        const res = await api.SYS_TASK_DEL(data)
        Message({ message: res.data.msg, type: 'success' })
        router.push({
          name: 'refresh'
        })
      }
      commit('d2admin/gray/set', true, { root: true })
      await MessageBox.confirm('确定要删除该记录吗', '删除记录', { type: 'warning' })
        .then(() => {
          commit('d2admin/gray/set', false, { root: true })
          deleteData(data)
        })
        .catch(() => {
          commit('d2admin/gray/set', false, { root: true })
          Message({ message: '取消删除操作' })
        })
    },
    // /**
    //  * @description 上传版本文件
    //  * @param {Object} context
    //  * @param {Object} data file {file} 版本文件
    //  * @param {Object} data Edition_desc {string} 版本描述
    //  * @param {Object} data Edition_filename {string} 版本号
    //  */
    // async uploadEditionData (context, data) {
    //   const res = await api.SYS_EDITION_UPLOAD(data)
    //   return res.data
    // },
    /**
     * @description 下载版本信息
     * @param {Object} context
     * @param {String} task_id  作业id
     */
    downloadTaskData (context, task_id) {
      const url = process.env.VUE_APP_PROXY + process.env.VUE_APP_API + 'task/dowmload_task?task_id=' + task_id
      window.open(url)
    },
    /**
     * @description 获取作业文件详情
     * @param {Object} context
     * @param {Object} data task_id {String} 作业id
     */
    async getTaskDetail (context, data) {
      const res = await api.SYS_TASK_GET_DETAIL(data)
      return res.data
    },
    /**
     * @description 获取实际飞行路径坐标数据
     * @param {Object} context
     * @param {Object} data task_id {String} 作业id
     */
    async getTaskUavInfo (context, data) {
      const res = await api.SYS_TASK_GET_UAV_INFO(data)
      return res.data
    },
    /**
     * @description 获取作业电池信息
     * @param {Object} context
     * @param {Object} data task_id {String} 作业id
     */
    async getTaskBatInfo (context, data) {
      const res = await api.SYS_TASK_GET_BAT_INFO(data)
      return res.data
    },
    setChartData ({ commit }, data) {
      commit('setData', data)
    }
  }
}
