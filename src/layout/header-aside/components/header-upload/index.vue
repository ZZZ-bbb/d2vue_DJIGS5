<template>
<div>
  <el-button class="d2-mr btn-text can-hover" type="text" @click="handleClick">
    <el-badge v-if="fileLength > 0 " :max="99" :value="fileLength">
      <d2-icon name="upload" style="font-size: 18px;"/>
    </el-badge>
    <d2-icon v-else name="upload" style="font-size: 18px;"/>
  </el-button>
  <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false">
    <div v-if="dialogVisible">
      <d2-table :tableData="uploadData" :tableColumn="tableColumn"></d2-table>
      <el-button @click="removeFile">取消文件</el-button>
      <el-button @click="getStatus">状态</el-button>
      <el-button @click="refresh">刷新</el-button>
      <el-button @click="getData">获取数据</el-button>
      <el-button>全部开始</el-button>
      <el-button>全部暂停</el-button>
      <el-button>全部取消</el-button>
    </div>
    <span slot="footer">
    <el-button @click="dialogVisible = false">关 闭</el-button>
  </span>
  </el-dialog>
</div>
</template>

<script>
import util from '@/libs/util'
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      dialogVisible: false,
      uploader: [], // uploader实例
      offsetChunk: 0, // 断点续传偏移量
      tableColumn: [
        {
          prop: '',
          title: '序号',
          align: 'center',
          formatter: (row, column, cellValue, index) => {
            return index + 1
          }
        },
        {
          prop: 'name',
          title: '文件名',
          align: 'center'
        },
        {
          prop: 'ext',
          title: '文件类型',
          align: 'center'
        },
        {
          prop: 'size',
          title: '文件大小',
          align: 'center'
        },
        {
          prop: 'statusText',
          title: '状态',
          align: 'center'
        },
        {
          prop: '',
          title: '进度',
          align: 'center',
          formatter: (row, column, cellValue, index) => {
            return (
              <div>
                <el-progress
                  percentage={row.percentage}>
                </el-progress>
              </div>
            )
          }
        },
        {
          prop: '',
          title: '操作',
          align: 'center',
          formatter: (row, column, cellValue, index) => {
            if (row.statusText === '') {
              return 'MD5计算中'
            } else if (row.statusText === 'complete') {
              return '已完成'
            } else {
              return (
                <div flex="dir:top">
                  <div>
                    <el-button
                      plain
                      style='padding: 6px; margin-bottom: 2px'
                      type='primary'
                      onClick={ this.uploadFile.bind(this, row) }
                    >
                      开始
                    </el-button>
                  </div>
                  <div>
                    <el-button
                      plain
                      style= 'padding: 6px; margin-bottom: 2px'
                      type='primary'
                      onClick={ this.stopUpload.bind(this, row) }
                    >
                      暂停
                    </el-button>
                  </div>
                  <div>
                    <el-button
                      plain
                      style= 'padding: 6px'
                      type='danger'
                      onClick={ this.removeFile.bind(this, row) }
                    >
                      取消
                    </el-button>
                  </div>
                </div>
              )
            }
          }
        }
      ]
    }
  },
  watch: {
    tmpData: function (newVal, oldVal) {
      const file = newVal[newVal.length - 1].file
      const wuFile = util.uploader.initFile(file)
      wuFile.fileType = newVal[newVal.length - 1].type
      wuFile.data = newVal[newVal.length - 1].data
      wuFile.percentage = 0
      this.uploader.addFiles(wuFile)
      this.dialogVisible = true
    }
  },
  mounted () {
    this.initUploader()
  },
  computed: {
    ...mapState('d2admin/uploader', [
      'tmpData', 'uploadData'
    ]),
    ...mapGetters('d2admin/uploader', {
      fileLength: 'length'
    })
  },
  methods: {
    ...mapActions('d2admin/uploader', [
      'getFil', 'checkFile', 'combineFile'
    ]),
    handleClick () {
      this.dialogVisible = true
      this.$emit('click')
    },
    /**
     * @description 实例化webUploader
     */
    initUploader (url, file) {
      this.uploader = util.uploader.init({
        server: process.env.VUE_APP_PROXY + process.env.VUE_APP_API + 'ddxc/upload_break_edition'
      })
      this.uploader.on('beforeFileQueued', this.beforeFileQueued) // 当文件被加入队列前触发
      this.uploader.on('fileQueued', this.fileQueued) // 当文件被加入队列以后触发
      this.uploader.on('fileDequeued', this.fileDequeued) // 当文件被移除队列后触发
      this.uploader.on('uploadProgress', this.uploadProgress) // 上传过程中触发，携带上传进度
      this.uploader.on('uploadSuccess', this.uploadSuccess) // 当文件上传成功时触发
      this.uploader.on('uploadError', this.uploadError) // 当文件上传出错时触发
      this.uploader.on('uploadBeforeSend', this.uploadBeforeSend) // 当某个文件的分块在发送前触发
      this.uploader.on('uploadAccept', this.uploadAccept) // 询问服务端响应
      this.uploader.on('startUpload', this.startUpload) // 当开始上传流程时触发
      this.uploader.on('uploadStart', this.uploadStart) // 当开始上传流程时触发
    },
    /**
     * @description 上传文件加入队列前进行md5检验，判断文件是否已存在或已有分片数据
     */
    beforeFileQueued (file) {
      const data = new FormData()
      data.append('chunks', Math.ceil(file.size / process.env.VUE_APP_CHUNKSIZE))
      data.append('file_type', file.fileType)
      data.append('file_name', file.name)
      data.append('file_size', file.size)
      data.append('file_args', JSON.stringify(file.data))
      console.log(JSON.stringify(file.data))
      console.log(typeof (JSON.stringify(file.data)))
      this.uploader.md5File(file).then(val => {
        data.append('file_etag', val)
        this.checkFile(data).then(res => {
          file.statusText = file.getStatus()
          console.log(res)
          if (res.data.msg === '已完成') {
            this.uploader.skipFile(file)
            file.statusText = file.getStatus()
            file.percentage = 100
          } else {
            file.offsetChunk = res.data.data.chunk
            file.file_ID = res.data.data.file_ID
            file.totalChunk = Math.ceil(file.size / process.env.VUE_APP_CHUNKSIZE)
            file.percentage = Math.round((file.offsetChunk / file.totalChunk) * 100)
            file.source = file.source.slice(process.env.VUE_APP_CHUNKSIZE * res.data.data.chunk)
          }
        })
      })
    },
    /**
     * @description 当文件被加入队列以后触发
     * @description store储存上传数据
     */
    fileQueued (file) {
      this.getFil(this.uploader.getFiles())
    },
    /**
     * @description 移除队列
     */
    fileDequeued (file) {
      file.statusText = file.getStatus()
    },
    /**
     * @description 上传中
     */
    uploadProgress (file, percentage) {
      file.statusText = file.getStatus()
      const done = Math.round((file.offsetChunk / file.totalChunk) * 100)
      file.percentage = done + Math.round(percentage * 100)
      // console.log('<<<<<<<<<<<')
      // console.log(doing)
      // console.log(percentage)
      // console.log(file.percentage)
    },
    /**
     * @description 上传成功
     */
    uploadSuccess (file, res) {
      file.statusText = file.getStatus()
      this.combineFile(file.file_ID).then(res => {
        console.log(res)
      })
    },
    /**
     * @description 上传失败
     */
    uploadError (file, err) {
      file.statusText = file.getStatus()
    },
    /**
     * @description 上传前，用于添加自定义参数及请求头
     */
    uploadBeforeSend (obj, data, headers) {
      Object.assign(data, {
        file_ID: obj.file.file_ID,
        chunk: Number(obj.chunk) + Number(obj.file.offsetChunk)
      })
      Object.assign(headers, {
        Authorization: util.cookies.get('token')
      })
    },
    /**
     * 响应判断
     */
    uploadAccept (obj, res) {
      if (res.code === 200) {
        return true
      } else {
        return false
      }
    },
    /**
     * @description 当开始上传流程时触发
     */
    startUpload () {
      //
    },
    /**
     * @description 某个文件开始上传前触发，一个文件只会触发一次
     */
    uploadStart (file) {
      file.statusText = file.getStatus()
      this.getFil(this.uploader.getFiles())
    },
    /**
     * @description 开始按钮事件
     */
    uploadFile (row) {
      this.uploader.upload(row.id)
    },
    /**
     * @description 暂停按钮事件
     */
    stopUpload (row) {
      this.uploader.stop(row)
      row.statusText = row.getStatus()
    },
    /**
     * @description 取消按钮事件
     */
    removeFile (row) {
      this.uploader.removeFile(row.id)
    },
    // 以下为测试用
    getStatus () {
      console.log(this.uploader.getFiles())
      console.log(this.uploader.getStats())
    },
    refresh () {
      this.$router.push({
        name: 'refresh'
      })
    },
    getData () {
      console.log(this.uploadData)
      console.log(this.tmpData)
    },
    check (file, data) {
      return new Promise((resolve, reject) => {
        this.uploader.md5File(file).then(val => {
          data.append('file_etag', val)
          this.checkFile(data).then(res => {
            file.offsetChunk = res.data.data.chunk
            file.file_ID = res.data.data.file_ID
            resolve()
          })
        })
      })
    }
  }
}
</script>
