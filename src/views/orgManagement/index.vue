<template>
  <d2-container class="page-org">
    <div class="page-org--content">
      <div class="page-org--content-button" flex>
        <div class="page-org--content-button-item">
          <el-button type="danger" size="medium" icon="el-icon-edit" round @click="allOrders">全部订单</el-button>
        </div>
        <div class="page-org--content-button-item">
          <el-badge :value="farm_type_num[0]" v-if="farm_type_num[0]">
            <el-button type="primary" size="medium" icon="el-icon-edit" round @click="pendingOrders">待处理</el-button>
          </el-badge>
          <el-button v-if="!farm_type_num[0]" type="primary" size="medium" icon="el-icon-edit" round @click="pendingOrders">待处理</el-button>
        </div>
        <div class="page-org--content-button-item">
          <el-badge :value="farm_type_num[1]" v-if="farm_type_num[1]">
            <el-button type="primary" size="medium" icon="el-icon-edit" round @click="processOrders">进行中</el-button>
          </el-badge>
          <el-button v-if="!farm_type_num[1]" type="primary" size="medium" icon="el-icon-edit" round @click="processOrders">进行中</el-button>
        </div>
        <div class="page-org--content-button-item">
          <el-button type="primary" size="medium" icon="el-icon-edit" round @click="doneOrders">已完成</el-button>
        </div>
        <div class="page-org--content-button-item">
          <el-button type="primary" size="medium" icon="el-icon-edit" round @click="cancelOrders">已取消</el-button>
        </div>
      </div>
      <div class="page-org--content-msg">
        <d2-icon name="exclamation-circle"/>
        <span>{{`共有 ${total} 条记录，当前显示第 ${Math.min((currentPage-1)*pageSize+1, total)} 至第 ${Math.min(currentPage*pageSize, total)} 条记录`}}</span>
      </div>
      <div class="page-org--content-table">
        <d2-table :tableData="farm_data" :tableColumn="tableColumn" :sortData="sortData"></d2-table>
        <div class="page-org--content-table-pagination">
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
      </div>
    </div>
    <div class="page-org--aside">
      <d2-card>
        <div slot="title">
            <span>作业队信息</span>
            <el-button style="float: right; padding: 6px" type="primary">详细</el-button>
          </div>
          <div slot="body" class="card-body">
          </div>
      </d2-card>
    </div>
    <el-drawer
      :withHeader="false"
      :visible.sync="drawer"
      direction="ttb"
      size= "70%"
      @opened="getMap"
      :destroyOnClose="true"
    >
      <div id="map"></div>
      <div class="map-aside">
        <div class="map-aside-item">
          <el-descriptions title="地块信息" :column="1" border>
          <el-descriptions-item label="地块名称">{{ name }}</el-descriptions-item>
          <el-descriptions-item label="地区">{{ location }}</el-descriptions-item>
          <el-descriptions-item label="详细地址">{{ address }}</el-descriptions-item>
          <el-descriptions-item label="面积">{{ area }}</el-descriptions-item>
        </el-descriptions>
        </div>
        <div class="map-aside-item">
          <el-descriptions title="作业记录" border></el-descriptions>
          <span>添加时间线？</span>
        </div>
      </div>
    </el-drawer>
    <el-dialog
      :close-on-click-modal="false"
      title="操作"
      :visible.sync="dialogVisible"
      width="800px"
      top='15vh'
      @close="dialogVisible=false">
      <div class="page-org--dialog-header">
        <el-steps
          :active="accepted_step"
          finish-status="success"
          :align-center="true">
          <el-step title="接受任务"></el-step>
          <el-step title="作业数据上传"></el-step>
          <el-step title="处方图查看"></el-step>
          <el-step title="开始作业"></el-step>
          <el-step title="作业结束"></el-step>
        </el-steps>
      </div>
      <div class="page-org--dialog-body--step2" v-if="accepted_step==1">
        <el-form label-position="top" label-width="auto">
          <el-form-item label="施肥类型:">
            <el-radio v-model="ferRadio" label="1">变量施肥</el-radio>
            <el-radio v-model="ferRadio" label="2">定量施肥</el-radio>
          </el-form-item>
          <el-divider></el-divider>
          <el-form-item label="上传可见光图(可选):">
            <el-upload
              ref="uploadVS"
              action="fakeaction"
              :auto-upload="false"
              :limit="1"
              :multiple="false"
              :http-request="uploadVSFile"
              :on-exceed="handleExceed">
              <el-button slot="trigger">选择文件</el-button>
              <div class="page-org--dialog-body--step2-button">
                <el-button @click="uploadVS" type="info">上传文件</el-button>
              </div>
            </el-upload>
          </el-form-item>
          <el-divider></el-divider>
          <el-form-item label="上传多光谱图(可选):">
            <el-upload
              ref="uploadMS"
              action="fakeaction"
              :auto-upload="false"
              :limit="1"
              :multiple="false"
              :http-request="uploadMSFile"
              :on-exceed="handleExceed">
              <el-button slot="trigger">选择文件</el-button>
              <div class="page-org--dialog-body--step2-button">
                <el-button @click="uploadMS" type="info">上传文件</el-button>
              </div>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <div class="page-org--dialog-body--step3" v-if="accepted_step==2">
        <d2-table :tableData="rx_data" :tableColumn="rxTableColumn"></d2-table>
      </div>
      <div class="page-org--dialog-body--step4" v-if="accepted_step==3">
        <span>作业数据,需要同步数据</span>
      </div>
      <span slot="footer" flex="main:justify">
        <el-button type="danger" @click="lastStep">驳回</el-button>
        <el-button type="success" @click="nextStep">下一步</el-button>
      </span>
    </el-dialog>
  </d2-container>
</template>

<script>
import { MessageBox } from 'element-ui'
import { mapActions, mapState } from 'vuex'
import util from '@/libs/util'
export default {
  name: 'org-management',
  inject: ['reload'],
  data () {
    return {
      ferRadio: '1',
      accepted_step: 0,
      dialogVisible: false,
      currentPage: 1, // 当前页码
      total: 0, // 总条数
      pageSize: 10, // 每页的数据条数
      farm_type_num: [],
      drawer: false, // 抽屉控制符
      ind: 0, // 选择的table数据索引
      farm_data: [], // 农事信息
      rx_data: [], // 处方数据
      sortData: { prop: 'farming_time', order: 'ascending' }, // 默认排序的字段
      name: '', // el-descriptions使用数组获取数据时报错，使用变量获取正常，原因未知，故申明以下变量
      location: '',
      address: '',
      area: '',
      tableColumn: [ // 列表字段数据
        {
          prop: '',
          title: '序号',
          align: 'center',
          formatter: (row, column, cellValue, index) => {
            return index + 1 + (this.currentPage - 1) * this.pageSize
          }
        },
        {
          prop: 'user_name',
          title: '发布用户',
          align: 'center'
        },
        {
          prop: 'area_name',
          title: '所属地块',
          align: 'center'
        },
        {
          prop: 'plant_area_info[0].area_large',
          title: '地块面积(亩)',
          align: 'center'
        },
        {
          prop: 'rice_type',
          title: '水稻品种',
          align: 'center'
        },
        {
          prop: 'farming_type',
          title: '作业种类',
          align: 'center',
          filters: [{ text: '播种', value: '播种' }, { text: '施肥', value: '施肥' }],
          filterMethod (value, row) { return row.farming_type === value }
        },
        {
          prop: 'farming_time',
          title: '作业时间',
          align: 'center',
          sortable: true
        },
        {
          prop: '',
          title: '操作',
          align: 'center',
          formatter: (row, column, cellValue, index) => {
            if (row.farm_work_type === 'pending') {
              return (
                <div flex="main:center">
                  <el-button
                    style="padding: 6px"
                    type="primary"
                    onClick={this.handleDrawer.bind(this, index)}
                  >
                    详细
                  </el-button>
                  <el-button
                    style= "padding: 6px"
                    type="primary"
                    onClick={this.handleAccess.bind(this, row.farm_work_id)}
                  >
                    接受
                  </el-button>
                </div>
              )
            } else if (row.farm_work_type === 'process') {
              return (
                <div flex="main:center">
                  <el-button
                    style="padding: 6px"
                    type="primary"
                    onClick={this.handleDrawer.bind(this, index)}
                  >
                    详细
                  </el-button>
                  <el-button
                    style= "padding: 6px"
                    type="primary"
                    onClick={this.handleDialog.bind(this, row)}
                  >
                    操作
                  </el-button>
                </div>
              )
            }
          }
        }
      ],
      rxTableColumn: [
        {
          prop: 'rx_name',
          title: '文件名',
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'rx_area',
          title: '施肥面积(亩)',
          align: 'center'
        },
        {
          prop: 'rx_fertilizers',
          title: '施肥量(KG)',
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
                  style="padding: 6px"
                  type="primary"
                  // onClick={this.handleDrawer.bind(this, index)}
                >
                  查看
                </el-button>
                <el-button
                  style= "padding: 6px"
                  type="primary"
                  // onClick={this.handleAccess.bind(this, row.farm_work_id)}
                >
                  下载
                </el-button>
              </div>
            )
          }
        }
      ],
      map: '',
      url: 'https://api.mapbox.com/styles/v1/764371741/cl104r88t006415od03t8itpo/tiles/512/{z}/{x}/{y}?' +
        'access_token=pk.eyJ1IjoiNzY0MzcxNzQxIiwiYSI6ImNsMHZ3Y2V5bjBuZWQzY210ZDBuOWh1ejIifQ.ZrfiUT3M-7HVGdWdWb1pCQ',
      layerOption: {
        zoomOffset: -1,
        tileSize: 512,
        maxZoom: 20
      },
      mapOption: {
        center: [23.15763794413284, 113.34546817452538],
        zoom: 18,
        zoomControl: false,
        doubleClickZoom: false,
        attributionControl: false
      }
    }
  },
  mounted () {
    this.getFarmWorkNum()
    this.getFarmWork()
    this.getRx()
  },
  computed: {
    ...mapState('d2admin/organization', [
      'type'
    ])
  },
  methods: {
    ...mapActions('d2admin/prescription', [
      'getRxData'
    ]),
    ...mapActions('d2admin/organization', [
      'getWorkDataNum', 'getWorkData', 'accessWork', 'setTypeData'
    ]),
    ...mapActions('d2admin/uploader', [
      'pushTmp'
    ]),
    getFarmWork () {
      this.getWorkData({ type: this.type, page: this.currentPage, list_num: this.pageSize }).then(res => {
        this.total = res.data.data.count
        this.farm_data = res.data.data.data
      })
    },
    getFarmWorkNum () {
      this.getWorkDataNum().then(res => {
        this.farm_type_num = res.data.data
      })
    },
    getRx () {
      this.getRxData({ page: this.currentPage, list_num: this.pageSize }).then(res => {
        this.rx_data = res.data.data.data
      })
    },
    getMap () {
      this.map = util.map.newMap_hsm('map', this.mapOption)
      util.map.createLayer(this.map, this.url, this.layerOption)
      util.map.newPolygon.showArea(this.map, JSON.parse(this.farm_data[this.ind].plant_area_info[0].area_data), JSON.parse(this.farm_data[this.ind].plant_area_info[0].area_large) + '亩')
    },
    handleDrawer (index) {
      this.ind = index
      this.getValue()
      this.drawer = true
    },
    handleAccess (farm_work_id) {
      this.accessWork({ farm_work_id }).then(() => {
        this.reload()
      })
    },
    getValue () {
      this.name = this.farm_data[this.ind].plant_area_info[0].area_name
      this.location = this.farm_data[this.ind].plant_area_info[0].area_province + this.farm_data[this.ind].plant_area_info[0].area_city + this.farm_data[this.ind].plant_area_info[0].area_country
      this.address = this.farm_data[this.ind].plant_area_info[0].area_address
      this.area = this.farm_data[this.ind].plant_area_info[0].area_large + '亩'
    },
    allOrders () {
      this.setTypeData('all')
      this.getFarmWork()
    },
    processOrders () {
      this.setTypeData('process')
      this.getFarmWork()
    },
    doneOrders () {
      this.setTypeData('done')
      this.getFarmWork()
    },
    pendingOrders () {
      this.setTypeData('pending')
      this.getFarmWork()
    },
    cancelOrders () {
      this.setTypeData('cancel')
      this.getFarmWork()
    },
    pageChange (val) {
      this.currentPage = val
      this.getFarmWork()
    },
    handleSizeChange (val) {
      this.currentPage = 1
      this.pageSize = val
      this.getFarmWork()
    },
    handleDialog (row) {
      this.accepted_step = row.accepted_step
      this.dialogVisible = true
    },
    uploadVSFile (params) {
      const file = params.file
      const fileType = file.type
      if (fileType !== 'image/tiff') {
        this.$refs.upload.clearFiles()
        return this.$message.error('请上传tif格式文件')
      }
      this.pushTmp({ file, type: 'vs' })
    },
    uploadMSFile (params) {
      const file = params.file
      const fileType = file.type
      if (fileType !== 'image/tiff') {
        this.$refs.upload.clearFiles()
        return this.$message.error('请上传tif格式文件')
      }
      this.pushTmp({ file, type: 'ms' })
    },
    uploadVS () {
      this.$refs.uploadVS.submit()
    },
    uploadMS () {
      this.$refs.uploadMS.submit()
    },
    handleExceed (files, fileList) {
      this.$message.warning('当前限制选择 1 个文件')
    },
    lastStep () {
      if (this.accepted_step > 0) {
        this.accepted_step--
      }
    },
    nextStep () {
      if (this.accepted_step === 1) {
        MessageBox.confirm('确定要提交该数据吗', '提交步骤', { type: 'warning' })
          .then(() => {
            // this.uploadVS()
            // this.uploadMS()
            this.accepted_step++
          })
          .catch(() => {
            this.$message.info('取消操作')
          })
      } else if (this.accepted_step === 3) {
        this.accepted_step = 5
      } else if (this.accepted_step > 4) {
        this.accepted_step = 0
      } else {
        this.accepted_step++
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .page-org {
    width: 100%;
    height: 100%;
    .page-org--content {
      float: left;
      height: 100%;
      width: 75%;
      .page-org--content-button {
        margin-bottom: 1%;
        .page-org--content-button-item  {
          margin: 10px 10px;
        }
      }
      .page-org--content-table {
        height: 90%;
        overflow: auto;
        .page-org--content-table-pagination {
          margin-bottom: 10px;
        }
      }
    }
    .page-org--aside {
      border-left: 0.1vw solid rgb(202, 199, 199);
      float:right;
      width: 24.4%;
      height: 100%;
      overflow: auto;
    }
    .page-org--dialog-body--step2 {
      border-radius: 4px;
      border: 2px solid #DCDFE6;
      padding: 0 20px;
      margin-top: 40px;
      .page-org--dialog-body--step2-button {
        float: right;
      }
    }
    .page-org--dialog-body--step3 {
      margin-top: 40px;
    }
    .page-org--dialog-body--step4 {
      margin-top: 40px;
    }
    #map {
      width: 75%;
      height:100%;
      float:left;
    }
    .map-aside {
      width: 25%;
      float:right;
      .map-aside-item {
        margin: 10% 4% 10% 4%;
      }
    }
    :deep(.el-drawer) {
      width: 63%;
      min-width: 750px;
      margin-left: 16%;
    }
  }
</style>
