import api from '@/api'
// import { Message, MessageBox } from 'element-ui'

export default {
  namespaced: true,
  actions: {
    /**
     * @description 获取所有用户农事信息
     * @param {Object} context context
     * @returns res
     */
    async getWorkData (context) {
      const res = await api.SYS_ORG_GET()
      return res
    }
  }
}
