<template>
  <d2-container>
    <template slot="header">
      <div class="page-rx-upload" flex="main:justify cross:center">
        <div>
          <d2-icon name="exclamation-circle"/>
          <span>{{`共有 ${total} 条记录，当前显示第 ${Math.min((currentPage-1)*pageSize+1, total)} 至第 ${Math.min(currentPage*pageSize, total)} 条记录`}}</span>
        </div>
        <el-button @click="dialogVisible = true">上传处方</el-button>
      </div>
    </template>
    <div class="page-rx-table">
      <d2-table
        :tableData="rxData"
        :tableColumn="tableColumn"
        :sortData="sortData">
      </d2-table>
    </div>
    <div class="page-rx-table-pagination">
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
      title="上传处方"
      :visible.sync="dialogVisible"
      :closeOnClickModal="false"
      :destroyOnClose="true"
      width="25%">
      <div class="page-rx-upload-upload">
        <el-form
          ref="formData"
          :model="formData"
          :rules="rules">
          <el-form-item label="请选择地块：" prop="area_id">
            <el-select v-model="formData.area_id" placeholder="请选择地块">
              <el-option-group
                v-for="group in options"
                :key="group.label"
                :label="group.label">
                <el-option
                  v-for="item in group.options"
                  :key="item.area_id"
                  :label="item.area_name"
                  :value="item.area_id">
                    <span style="float: left">{{ item.area_name + "&nbsp;&nbsp;&nbsp;&nbsp;" }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.area_large + "亩" }}</span>
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="page-rx-upload-upload-label"><span>&nbsp;&nbsp;请选择文件：</span></div>
        <el-upload
          ref="upload"
          action="fakeaction"
          :file-list="fileList"
          :auto-upload="false"
          :limit="1"
          :multiple="true"
          :http-request="uploadSectionFile"
          :on-exceed="handleExceed">
          <div slot="tip" class="page-rx-upload-tip">只能上传geojson格式文件</div>
          <el-button slot="trigger">选择文件</el-button>
        </el-upload>
      </div>
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
      formData: {
        area_id: ''
      },
      rules: {
        area_id: [
          { required: true, message: '请选择地块', trigger: 'blur' }
        ]
      },
      options: [], // 选项框数据
      dialogVisible: false,
      fileList: [],
      rxData: [], // 总数据
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
          prop: 'rx_id',
          title: 'ID',
          align: 'center'
        },
        {
          prop: 'user_name',
          title: '上传用户',
          align: 'center'
        },
        {
          prop: 'area_id',
          title: '所属地块',
          align: 'center'
        },
        {
          prop: 'rx_area',
          title: '施肥面积(亩)',
          align: 'center'
        },
        {
          prop: 'rx_fertilizers',
          title: '总施肥量',
          align: 'center'
        },
        {
          prop: 'rx_name',
          title: '文件名',
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
                  // onClick={ this.showData.bind(this, index) }
                >
                  查看
                </el-button>
                <el-button
                  plain
                  style= 'padding: 6px'
                  type='primary'
                  // onClick={ this.downloadData.bind(this, row) }
                >
                  下载
                </el-button>
                <el-button
                  plain
                  style= 'padding: 6px'
                  type='danger'
                  // onClick={ this.deleteData.bind(this, row) }
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
    ...mapActions('d2admin/prescription', [
      'getSelectFarmData', 'getRxData'
    ]),
    ...mapActions('d2admin/uploader', [
      'pushTmp'
    ]),
    getData () {
      this.getRxData({ page: this.currentPage, list_num: this.pageSize }).then(res => {
        // this.total = res.data.count
        this.rxData = res.data.data
        console.log(this.rxData)
      })
      this.getSelectFarmData().then(res => {
        this.options = res.data.data
      })
    },
    showData (index) {
      console.log(index)
    },
    // downloadData (row) {
    //   const Route_id = row.Route_id
    //   this.downloadRouteData(Route_id)
    // },
    // deleteData (row) {
    //   const Route_id = row.Route_id
    //   this.deleteRouteData({ Route_id })
    // },
    uploadData () {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          if (this.$refs.upload.uploadFiles.length === 0) {
            this.$message.warning('请选择文件')
          } else {
            this.$refs.upload.submit()
          }
        } else {
          return false
        }
      })
    },
    uploadSectionFile (params) {
      const file = params.file
      const fileName = file.name
      const isGeojson = /\.geojson$/.test(fileName)
      if (!isGeojson) {
        this.$refs.upload.clearFiles()
        return this.$message.error('请上传geojson格式文件')
      }
      this.pushTmp({ file, type: 'rx', data: this.formData })
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
.page-rx-table-pagination {
  height: 8%;
  margin-top: 1%;
}
.page-rx-upload-upload-label {
  margin-bottom: 10px;
}
.page-rx-upload-tip {
  font-size: 12px;
  color: #606266;
  margin-top: 7px;
}
</style>
