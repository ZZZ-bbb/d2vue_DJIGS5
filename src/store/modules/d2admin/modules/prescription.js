import api from '@/api'
import { Message, MessageBox } from 'element-ui'

export default {
  namespaced: true,
  actions: {
    /**
     * @description 获取地块信息
     * @param {Object} context context
     * @returns res
     */
    async getSelectFarmData (context) {
      const res = await api.SYS_FIELD_GET_BY_RX()
      return res
    },
    /**
     * @description 获取处方信息
     * @param {Object} context context
     * @param {Object} data data
     * @returns res
     */
    async getRxData (context, data) {
      const res = await api.SYS_RX_GET(data)
      return res
    },
    /**
     * @description 删除处方信息
     * @param {Object} commit commit
     * @param {Object} data rx_id {String} 处方id
     * @returns res
     */
    async delRxData ({ commit }, data) {
      async function deleteData (data) {
        const res = await api.SYS_RX_DEL(data)
        Message({ message: res.data.msg, type: 'success' })
      }
      commit('d2admin/gray/set', true, { root: true })
      await MessageBox.confirm('确定要删除该文件吗', '删除文件', { type: 'warning' })
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
     * @description 下载处方图文件
     * @param {Object} context context
     * @param {String} rx_id rx_id
     */
    async downloadRxData (context, rx_id) {
      const url = process.env.VUE_APP_PROXY + process.env.VUE_APP_API + 'rxManagement/downloadRx?rx_id=' + rx_id
      window.open(url)
    }
  }
}
