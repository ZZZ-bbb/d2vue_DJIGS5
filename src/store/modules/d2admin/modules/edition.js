import api from '@/api'
import { Message, MessageBox } from 'element-ui'
import router from '@/router'

export default {
  namespaced: true,
  actions: {
    /**
     * @description 获取版本信息
     * @param {Object} context
     * @param {Object} data data
     */
    async getEditionData (context, data) {
      const res = await api.SYS_EDITION_GET(data)
      return res.data
    },
    /**
     * @description 删除版本信息
     * @param {Object} context
     * @param {Object} data Edition_ID {String} 版本id
     */
    async deleteEditionData ({ commit }, data) {
      async function deleteData (data) {
        const res = await api.SYS_EDITION_DEL(data)
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
     * @description 上传版本文件
     * @param {Object} context
     * @param {Object} data file {file} 版本文件
     * @param {Object} data Edition_desc {string} 版本描述
     * @param {Object} data Edition_filename {string} 版本号
     */
    async uploadEditionData (context, data) {
      const res = await api.SYS_EDITION_UPLOAD(data)
      return res.data
    },
    /**
     * @description 下载版本信息
     * @param {Object} context
     * @param {String} Edition_ID  版本id
     */
    downloadEditionData (context, Edition_ID) {
      const url = process.env.VUE_APP_PROXY + process.env.VUE_APP_API + 'edition/dowmload_apk?Edition_ID=' + Edition_ID
      window.open(url)
    }
  }
}
