<template>
  <d2-container>
    <template slot="header">
      <div class="page-task-upload" flex="main:justify cross:center">
        <div>
          <d2-icon name="exclamation-circle"/>
          <span>{{`共有 ${total} 条记录，当前显示第 ${Math.min((currentPage-1)*pageSize+1, total)} 至第 ${Math.min(currentPage*pageSize, total)} 条记录`}}</span>
        </div>
        <el-button @click="dialogVisible = true">上传数据</el-button>
      </div>
    </template>
    <div class="page-task-table">
      <d2-table
        :tableData="taskData"
        :tableColumn="tableColumn"
        :sortData="sortData">
      </d2-table>
    </div>
    <div class="page-task-table-pagination">
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
        <div slot="tip" class="page-task-upload-tip">只能上传txt格式文件</div>
        <el-button slot="trigger">选择文件</el-button>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="uploadData">上 传</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="数据"
      :visible.sync="chartDialogVisible"
      :closeOnClickModal="false"
      :destroyOnClose="true"
      >
      <div id="chart"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="chartDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </d2-container>
</template>

<script>
import { mapActions } from 'vuex'
import util from '@/libs/util'
import echartOption from './echartOption'
export default {
  name: 'task-list',
  data () {
    return {
      vData: [],
      dialogVisible: false,
      chartDialogVisible: false,
      fileList: [],
      taskData: [], // 总数据
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
          prop: 'task_id',
          title: 'ID',
          align: 'center'
        },
        {
          prop: 'UserID',
          title: '发布用户',
          align: 'center'
        },
        {
          prop: 'created_at',
          title: '作业时间',
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
                  onClick={ this.showData.bind(this, row) }
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
    ...mapActions('d2admin/task', [
      'getTaskData', 'deleteTaskData', 'downloadTaskData',
      'getTaskDetail', 'getTaskUavInfo', 'getTaskBatInfo'
    ]),
    ...mapActions('d2admin/uploader', [
      'pushTmp'
    ]),
    getData () {
      this.getTaskData({ page: this.currentPage, list_num: this.pageSize }).then(res => {
        this.total = res.data.count
        this.taskData = res.data.data
      })
    },
    showData (row) {
      const task_id = row.task_id
      this.chartDialogVisible = true
      this.getTaskBatInfo({ task_id }).then((res) => {
        const data = res.data.v
        const data1 = data.filter((val, index) => {
          return index % 10 === 0
        }).map((val, index) => {
          return [1653026495000 + index * 1000, val]
        })
        util.echarts.init('chart', Object.assign(echartOption.batInfo, { dataset: { source: data1 } }))
      })
    },
    downloadData (row) {
      const task_id = row.task_id
      this.downloadTaskData(task_id)
    },
    deleteData (row) {
      const task_id = row.task_id
      this.deleteTaskData({ task_id })
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
      this.pushTmp({ file, type: 'task' })
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
.page-task-table-pagination {
  height: 8%;
  margin-top: 1%;
}
.page-task-upload-tip {
  font-size: 12px;
  color: #606266;
  margin-top: 7px;
}
#chart {
  height: 300px;
}
</style>
