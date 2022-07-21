<template>
  <d2-container>
    <template slot="header">
      <div class="page-route-upload" flex="main:justify cross:center">
        <div>
          <d2-icon name="exclamation-circle"/>
          <span>{{`共有 ${total} 条记录，当前显示第 ${Math.min((currentPage-1)*pageSize+1, total)} 至第 ${Math.min(currentPage*pageSize, total-1)} 条记录`}}</span>
        </div>
        <el-button @click="dialogVisible = true">上传路径</el-button>
      </div>
    </template>
    <div class="page-route-table">
      <d2-table
        :tableData="routeData"
        :tableColumn="tableColumn"
        :sortData="sortData">
      </d2-table>
    </div>
    <div class="page-route-table-pagination">
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
      :destroyOnClose="true"
      width="25%">
      <el-upload
        ref="upload"
        action="fakeaction"
        :file-list="fileList"
        :auto-upload="false"
        :limit="1"
        :multiple="true"
        :http-request="uploadSectionFile"
        :on-exceed="handleExceed">
        <div slot="tip" class="page-route-upload-tip">只能上传txt格式文件</div>
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
  name: 'route-list',
  data () {
    return {
      dialogVisible: false,
      fileList: [],
      routeData: [], // 总数据
      currentPage: 1, // 当前页码
      total: 0, // 总条数
      pageSize: 10, // 每页的数据条数
      sortData: { prop: 'created_at', order: 'ascending' },
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
          prop: 'Route_id',
          title: 'ID',
          align: 'center'
        },
        {
          prop: 'UserID',
          title: '发布用户',
          align: 'center'
        },
        {
          prop: 'Route_areaID',
          title: '所属地块',
          align: 'center'
        },
        {
          prop: 'created_at',
          title: '作业时间',
          align: 'center',
          sortable: true
        },
        {
          prop: 'Route_mode',
          title: '作业种类',
          align: 'center',
          filters: [{ text: '播种', value: '播种' }, { text: '施肥', value: '施肥' }],
          filterMethod (value, row) { return row.Route_mode === value },
          formatter: (row, column, cellValue, index) => {
            if (row.Route_mode === '播种') {
              this.data = '播种'
              return <el-tag>{this.data}</el-tag>
            } else if (row.Route_mode === '施肥') {
              this.data = '施肥'
              return <el-tag type="success">{this.data}</el-tag>
            }
          }
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
                  onClick={ this.downloadData.bind(this, index) }
                >
                  下载
                </el-button>
                <el-button
                  plain
                  style= 'padding: 6px'
                  type='danger'
                  onClick={ this.deleteData.bind(this, index) }
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
    ...mapActions('d2admin/route', [
      'getRouteData', 'deleteRouteData', 'downloadRouteData'
    ]),
    ...mapActions('d2admin/uploader', [
      'pushTmp'
    ]),
    getData () {
      this.getRouteData({ page: this.currentPage, list_num: this.pageSize }).then(res => {
        this.total = res.data.count
        this.routeData = res.data.data
        console.log(res)
      })
    },
    showData () {
      console.log(this.routeData)
    },
    downloadData (index) {
      const currentIndex = index + (this.currentPage - 1) * this.pageSize
      const Route_id = this.routeData[currentIndex].Route_id
      this.downloadRouteData(Route_id)
    },
    deleteData (index) {
      const currentIndex = index + (this.currentPage - 1) * this.pageSize
      const Route_id = this.routeData[currentIndex].Route_id
      this.deleteRouteData({ Route_id })
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
      const isText = fileType.indexOf('text') !== -1
      if (!isText) {
        this.$refs.upload.clearFiles()
        return this.$message.error('请上传txt格式文件')
      }
      this.pushTmp({ file, type: 'route' })
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
.page-route-table-pagination {
  height: 8%;
  margin-top: 1%;
}
.page-route-upload-tip {
  font-size: 12px;
  color: #606266;
  margin-top: 7px;
}
</style>
