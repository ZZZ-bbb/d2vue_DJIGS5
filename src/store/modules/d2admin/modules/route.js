import api from '@/api'
import { Message, MessageBox } from 'element-ui'
import router from '@/router'

export default {
  namespaced: true,
  actions: {
    /**
     * @description 获取当前路径数据
     * @param {Object} context
     * @param {Object} data data
     */
    async getRouteData (context, data) {
      const res = await api.SYS_ROUTE_GET(data)
      return res.data
    },
    /**
     * @description 删除当前路径
     * @param {Object} context
     * @param {Object} data Route_id {String} 路径id
     */
    async deleteRouteData ({ commit }, data) {
      async function deleteData (data) {
        const res = await api.SYS_ROUTE_DEL(data)
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
    /**
     * @description 上传路径文件
     * @param {Object} context
     * @param {Object} data file {file} 路径文件
     */
    async uploadRouteData (context, data) {
      const res = await api.SYS_ROUTE_UPLOAD(data)
      return res.data
    },
    /**
     * @description 下载路径文件
     * @param {Object} context
     * @param {String} Route_id  路径id
     */
    downloadRouteData (context, Route_id) {
      const url = process.env.VUE_APP_PROXY + process.env.VUE_APP_API + 'route/dowmload_uavroute?Route_id=' + Route_id
      window.open(url)
    }
  }
}
