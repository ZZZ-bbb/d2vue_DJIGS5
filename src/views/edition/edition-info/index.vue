<template>
  <d2-container>
    <template slot="header">
      <div class="page-edition-upload" flex="main:justify cross:center">
        <div>
          <d2-icon name="exclamation-circle"/>
          <span>{{`共有 ${total} 条记录，当前显示第 ${Math.min((currentPage-1)*pageSize+1, total)} 至第 ${Math.min(currentPage*pageSize, total)} 条记录`}}</span>
        </div>
        <el-button @click="dialogVisible = true">上传文件</el-button>
      </div>
    </template>
    <div class="page-edition-table">
      <d2-table
        :tableData="editionData"
        :tableColumn="tableColumn"
        :sortData="sortData">
      </d2-table>
    </div>
    <div class="page-edition-table-pagination">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[1,5,10,20]"
        @current-change="pageChange"
        @size-change="handleSizeChange">
      </el-pagination>
    </div>
    <el-dialog
      title="上传路径"
      :visible.sync="dialogVisible"
      :closeOnClickModal="false"
      :destroyOnClose="false"
      width="25%">
      <el-form
        ref="formData"
        :model="formData"
        :rules="rules">
        <el-form-item label="版本号" prop="Edition_filename">
          <el-input v-model="formData.Edition_filename"></el-input>
        </el-form-item>
        <el-form-item label="版本描述" prop="Edition_desc">
          <el-input type="textarea" :rows="2" v-model="formData.Edition_desc"></el-input>
        </el-form-item>
      </el-form>
      <el-upload
        ref="upload"
        action="fakeaction"
        :file-list="fileList"
        :auto-upload="false"
        :limit="1"
        :http-request="uploadSectionFile"
        :on-exceed="handleExceed">
        <div slot="tip" class="page-edition-upload-tip">只能上传apk格式文件</div>
        <el-button slot="trigger">选择文件</el-button>
      </el-upload>
      <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="uploadData">上 传</el-button>
    </span>
    </el-dialog>
  </d2-container>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'edition-list',
  data () {
    return {
      dialogVisible: false,
      fileList: [],
      editionData: [], // 总数据
      currentPage: 1, // 当前页码
      total: 0, // 总条数
      pageSize: 10, // 每页的数据条数
      sortData: { prop: 'created_at', order: 'ascending' },
      formData: {
        Edition_filename: '',
        Edition_desc: ''
      },
      rules: {
        Edition_filename: [
          { required: true, message: '请输入版本号', trigger: 'blur' }
        ],
        Edition_desc: [
          { required: true, message: '请输入版本描述', trigger: 'blur' }
        ]
      },
      tableColumn: [
        {
          prop: '',
          title: '序号',
          align: 'center',
          formatter: (row, column, cellValue, index) => {
            return index + 1 + (this.currentPage - 1) * this.pageSize
          }
        },
        {
          prop: 'Edition_ID',
          title: 'ID',
          align: 'center'
        },
        {
          prop: 'UserID',
          title: '发布用户',
          align: 'center'
        },
        {
          prop: 'Edition_filename',
          title: '版本号',
          align: 'center'
        },
        {
          prop: 'Edition_desc',
          title: '版本描述',
          align: 'center'
        },
        {
          prop: 'created_at',
          title: '上传时间',
          align: 'center',
          sortable: true
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
                  style='padding: 6px'
                  type='primary'
                  onClick={ this.showData.bind(this, index) }
                >
                  查看
                </el-button>
                <el-button
                  plain
                  style= 'padding: 6px'
                  type='primary'
                  onClick={ this.downloadData.bind(this, row) }
                >
                  下载
                </el-button>
                <el-button
                  plain
                  style= 'padding: 6px'
                  type='danger'
                  onClick={ this.deleteData.bind(this, row) }
                >
                  删除
                </el-button>
              </div>
            )
          }
        }
      ]
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    ...mapActions('d2admin/edition', [
      'getEditionData', 'deleteEditionData', 'downloadEditionData'
    ]),
    ...mapActions('d2admin/uploader', [
      'pushTmp'
    ]),
    getData () {
      this.getEditionData({ page: this.currentPage, list_num: this.pageSize }).then(res => {
        this.total = res.data.count
        this.editionData = res.data.data
      })
    },
    showData () {
      console.log(this.editionData)
    },
    downloadData (row) {
      const Edition_ID = row.Edition_ID
      this.downloadEditionData(Edition_ID)
    },
    deleteData (row) {
      const Edition_ID = row.Edition_ID
      this.deleteEditionData({ Edition_ID })
    },
    uploadData () {
      if (this.$refs.upload.uploadFiles.length === 0) {
        this.$message.warning('请选择文件')
      } else {
        this.$refs.upload.submit()
      }
    },
    uploadSectionFile (params) {
      const file = params.file
      const fileType = file.type
      const isApk = fileType.indexOf('android.package-archive') !== -1
      if (!isApk) {
        this.$refs.upload.clearFiles()
        return this.$message.error('请上传apk格式文件')
      }
      this.pushTmp({ file, type: 'edition', data: this.formData })
      this.dialogVisible = false
    },
    handleExceed (files, fileList) {
      this.$message.warning('当前限制选择 1 个文件')
    },
    pageChange (val) {
      this.currentPage = val
      this.getData()
    },
    handleSizeChange (val) {
      this.currentPage = 1
      this.pageSize = val
      this.getData()
    }
  }
}
</script>
<style lang="scss" scoped>
.page-edition-table-pagination {
  height: 8%;
  margin-top: 1%;
}
.page-edition-upload-tip {
  font-size: 12px;
  color: #606266;
  margin-top: 7px;
}
</style>
