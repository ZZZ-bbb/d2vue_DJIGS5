import api from '@/api'
import { Message, MessageBox } from 'element-ui'

export default {
  namespaced: true,
  state: {
    areaIndex: 0 // 当前激活的地块
  },
  mutations: {
    /**
     * @description 更新当前激活的地块索引
     * @param {Object} state state
     * @param {Number} index 索引
     */
    changeAreaIndex (state, index) {
      state.areaIndex = index
    }
  },
  actions: {
    /**
     * @description 获取地块信息
     * @returns res
     */
    async getFieldData () {
      const res = await api.SYS_FIELD_GET()
      return res
    },
    /**
     * @description 获取农事信息
     * @param {Object} context context
     * @param {Object} data area_id {String} 地块id
     * @returns res
     */
    async getFarmData (context, data) {
      const res = await api.SYS_FARMING_GET(data)
      return res
    },
    /**
     * @description 保存地块信息
     * @param {Object} context context
     * @param {Object} data 地块数据
     * @returns res
     */
    async setFieldData (context, data) {
      const res = await api.SYS_FIELD_SET(data)
      return res
    },
    /**
     * @description 删除地块信息
     * @param {Object} commit commit
     * @param {Object} data area_id {String} 地块id
     * @returns res
     */
    async delFieldData ({ commit }, data) {
      async function deleteData (data) {
        const res = await api.SYS_FIELD_DEL(data)
        commit('changeAreaIndex', 0)
        Message({ message: res.data.msg, type: 'success' })
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
     * @description 更新地块索引
     * @param {Object} commit commit
     * @param {Number} index index
     */
    setIndex ({ commit }, index) {
      commit('changeAreaIndex', index)
    }
  }
}
