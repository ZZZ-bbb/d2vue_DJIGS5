<template>
  <div>
    <div>
      <d2-table :tableData="fileData" :tableColumn="tableColumn"></d2-table>
    </div>
    <div id="picker">选择文件</div>
    <el-button @click="startUpload">上传文件</el-button>
    <el-button @click="removeFile">取消文件</el-button>
    <el-button @click="getStatus">状态</el-button>
    <el-button @click="refresh">刷新</el-button>
    <el-button @click="getData">获取数据</el-button>
  </div>
</template>

<script>
import util from '@/libs/util'
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      uploader: '', // webuploader实例
      fileData: [],
      showFileMsg: true,
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
          prop: 'id',
          title: 'ID',
          align: 'center'
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
          title: '操作',
          align: 'center',
          formatter: (row, column, cellValue, index) => {
            return (
              <div flex="main:center">
                <el-button
                  plain
                  style= 'padding: 6px'
                  type='danger'
                  onClick={ this.removeFile.bind(this, row) }
                >
                  取消
                </el-button>
              </div>
            )
          }
        }
      ]
    }
  },
  watch: {
    tmpData (newVal, oldVal) {
      console.log(newVal)
    }
  },
  mounted () {
    this.initUploader()
  },
  computed: {
    ...mapState('d2admin/uploader', [
      'tmpData'
    ])
  },
  methods: {
    ...mapActions('d2admin/uploader', [
      'upload'
    ]),
    initUploader () {
      this.uploader = util.uploader.init({
        pick: '#picker',
        server: process.env.VUE_APP_PROXY + process.env.VUE_APP_API + 'route/upload_route'
      })
      this.uploader.on('fileQueued', this.fileQueued)
      this.uploader.on('uploadProgress', this.uploadProgress)
      this.uploader.on('uploadSuccess', this.uploadSuccess)
      this.uploader.on('uploadError', this.uploadError)
      this.uploader.on('uploadBeforeSend', this.uploadBeforeSend)
      this.uploader.on('uploadAccept', this.uploadAccept)
    },
    fileQueued (file) {
      file.statusText = '待上传'
      this.fileData = this.uploader.getFiles()
    },
    uploadProgress (file, percentage) {
      console.log(percentage)
    },
    uploadSuccess (file, res) {
      console.log(res)
    },
    uploadError (file, err) {
      console.log(err)
    },
    uploadBeforeSend (obj, data, headers) {
      Object.assign(headers, {
        Authorization: util.cookies.get('token')
      })
    },
    uploadAccept (obj, ret) {
      console.log(obj)
      console.log(ret)
      return false
    },
    startUpload () {
      this.uploader.upload()
    },
    removeFile (row) {
      console.log(this.fileData)
      this.uploader.removeFile(row.id, true)
      this.fileData = this.uploader.getFiles()
      console.log(this.fileData)
    },
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
      console.log(this.tmpData)
    }
  }
}
</script>

<style>

</style>
