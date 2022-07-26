import api from '@/api'
import { Message, MessageBox } from 'element-ui'

export default {
  namespaced: true,
  actions: {
    /**
     * @description 获取所有用户农事信息
     * @param {Object} context context
     * @param {Object} data { type: 'all'\'cancel'\'done'\'process'\'pending'} 农事类型
     * @returns res
     */
    async getWorkData (context, data = {}) {
      const res = await api.SYS_ORG_GET(data)
      return res
    },
    /**
     * @description 获取农事待处理和进行中的任务数量
     * @param {Object} context context
     * @returns res
     */
    async getWorkDataNum (context) {
      const res = api.SYS_ORG_GET_NUM()
      return res
    },
    /**
     * @description 接受任务
     * @param {Object} commit commit
     * @param {Object} data work_id
     */
    async accessWork ({ commit }, data) {
      async function access (data) {
        const res = await api.SYS_ORG_ACCESS_WORK(data)
        Message({ message: res.data.msg, type: 'success' })
      }
      commit('d2admin/gray/set', true, { root: true })
      await MessageBox.confirm('确定要接受该任务吗', '接受任务', { type: 'warning' })
        .then(() => {
          commit('d2admin/gray/set', false, { root: true })
          access(data)
        })
        .catch(() => {
          commit('d2admin/gray/set', false, { root: true })
          Message({ message: '取消接受操作' })
        })
    }
  }
}
