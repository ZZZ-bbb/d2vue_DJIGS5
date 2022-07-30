import api from '@/api'
export default {
  namespaced: true,
  state: {
    uploadData: [],
    tmpData: []
  },
  getters: {
    length (state) {
      return state.uploadData.filter((data) => {
        return (data.getStatus() !== 'complete' || data.getStatus() !== 'cancelled')
      }).length
    }
  },
  mutations: {
    /**
     * @description 添加临时上传数据
     * @param { Object } state state
     * @param { Object } data data
     */
    pushTmp (state, data) {
      state.tmpData.push(data)
    },
    /**
     * @description 添加上传任务
     * @param { Object } state state
     * @param { Object } data data
     */
    getFil (state, data) {
      state.uploadData = data
    }
  },
  actions: {
    /**
     * @description 添加临时上传数据
     * @param { Object } context context
     * @param { Object } param file 待上传的文件
     * @param { Object } param type 文件类型，决定上传的url地址
     * @param { Object } param data 上传参数
     */
    pushTmp ({ commit }, { file, type, data = {} }) {
      commit('pushTmp', { file, type, data })
    },
    /**
     * @description 添加上传任务
     * @param { Object } file 待上传的文件
     */
    getFil ({ commit }, file) {
      commit('getFil', file)
    },
    /**
     * @descripiton 检测文件是否上传过
     * @param { Object} data 上传参数
     */
    async checkFile (context, data) {
      const res = await api.SYS_UPLOAD_CHECK(data)
      return res
    },
    /**
     * @description 文件整合
     * @param { Object } data { file_ID }
     */
    async combineFile (context, file_ID) {
      const res = await api.SYS_UPLOAD_COMBINE({ file_ID })
      return res.data
    },
    getLength ({ state }) {
      return state.uploadData.filter((data) => {
        return (data.getStatus() !== 'complete' || data.getStatus() !== 'cancelled')
      }).length
    }
  }
}
