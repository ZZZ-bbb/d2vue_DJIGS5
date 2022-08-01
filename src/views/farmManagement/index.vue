<template>
  <d2-container class="page-farm">
    <div class="page-farm--content">
      <div class="page-farm--content-btn">
        <el-button @click="nextMonth">下个月</el-button>
        <el-button style="border-left:0; border-right:0;" @click="getToday">今天</el-button>
        <el-button @click="lastMonth">上个月</el-button>
      </div>
      <div class="papge-farm--content-hr"></div>
      <div id="farm-chart"></div>
      <div class="page-farm--content-table">
        <d2-table :tableData="tableData" :tableColumn="tableColumn"></d2-table>
      </div>
    </div>
    <div class="page-farm--aside">
      <div v-if="!field_data.length">
        <el-button>添加地块</el-button>
      </div>
      <div class="page-farm--aside-card" v-for="(item,index) in field_data" :key="index">
        <d2-card :isActive="areaIndex==index?true:false">
          <div slot="title">
            <span>{{item.area_name}}</span>
            <el-button style="float: right; padding: 6px" type="primary" @click="showArea(index)">详细</el-button>
          </div>
          <div slot="body" class="page-farm--aside-card-body" @click="showFarming(index)">
            <span>地区：{{item.area_province+item.area_city+item.area_country}}</span><br>
            <span>详细地址：{{item.area_address}}</span><br>
            <span>面积：{{item.area_large}}亩</span><br>
            <span>创建时间：{{item.created_at}}</span>
          </div>
        </d2-card>
      </div>
    </div>
    <el-dialog
      title="添加农事信息"
      :visible.sync="dialogVisible"
      width="600px"
      top='15vh'
      @close="closeDialog">
      <el-form ref="farmForm" :rules="rules" :model="farm_data" label-width="80px">
        <el-form-item label="作业种类" prop="farming_type">
          <el-select v-model="farm_data.farming_type">
            <el-option label="播种" value="播种"></el-option>
            <el-option label="施肥" value="施肥"></el-option>
            <el-option label="施药" value="施药"></el-option>
            <el-option label="除草" value="除草"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="作业田块">
          <el-input v-model="farm_data.area_name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="作业时间" required>
          <el-col :span="11">
            <el-form-item>
              <el-date-picker type="date" :disabled="true" v-model="farm_data.date1" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col style="text-align: center" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="date2">
              <el-time-picker placeholder="选择时间" v-model="farm_data.date2" style="width: 100%;"></el-time-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="水稻品种" prop="rice_type">
          <el-select v-model="farm_data.rice_type">
            <el-option label="黄华占" value="黄华占"></el-option>
            <el-option label="美香占" value="美香占"></el-option>
            <el-option label="象牙香占" value="象牙香占"></el-option>
            <el-option label="美香占2号" value="美香占2号"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="success">确 定</el-button>
      </span>
    </el-dialog>
  </d2-container>
</template>

<script>
import { Message } from 'element-ui'
import { mapState, mapActions } from 'vuex'
import util from '@/libs/util'
export default {
  name: 'farm-management',
  inject: ['reload'],
  data () {
    return {
      ind: '', // 激活的日历数据索引
      chart_data: [], // 日历数据
      field_data: [],
      tableData: [],
      dialogVisible: false,
      farm_data: {
        area_id: '',
        user_name: '',
        area_name: '',
        farming_type: '',
        date1: '',
        date2: new Date(),
        date3: '',
        rice_type: ''
      },
      chartDate: { // 相邻两月字符串
        thisMonth: '',
        nextmonth: ''
      },
      year: 0, // 当前年
      month: 0, // 当前月
      rules: {
        farming_type: [
          { required: true, message: '请选择作业种类', trigger: 'blur' }
        ],
        date2: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ],
        rice_type: [
          { required: true, message: '请选择水稻品种', trigger: 'blur' }
        ]
      },
      tableColumn: [
        {
          prop: 'farm_work_id',
          title: '农事ID',
          align: 'center'
        },
        {
          prop: 'area_name',
          title: '所属地块',
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
          align: 'center'
        },
        {
          prop: 'farming_time',
          title: '作业时间',
          align: 'center'
        },
        {
          prop: '',
          title: '操作',
          align: 'center',
          formatter: () => {
            return (
              <div>
                <el-button
                  style="padding: 6px"
                  type="primary"
                >
                  查看
                </el-button>
                <el-button
                  style="padding: 6px"
                  type="danger"
                  // Click={this.handleDownload.bind(this, row.farm_work_id)}
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
  computed: {
    ...mapState('d2admin/field', [
      'areaIndex'
    ]),
    getDate () {
      return this.farm_data.date2.toLocaleTimeString()
    }
  },
  created () {
    this.getArea()
  },
  mounted () {
    // this.getArea()
  },
  methods: {
    ...mapActions('d2admin/field', [
      'getFieldData', 'setIndex'
    ]),
    ...mapActions('d2admin/farm', [
      'getFarmData', 'setFarmData'
    ]),
    getArea () {
      this.getFieldData().then(res => {
        if (res.data.data.length) {
          this.field_data = res.data.data
          this.farm_data.area_id = this.field_data[this.areaIndex].area_id
          this.farm_data.user_name = this.field_data[this.areaIndex].user_name
          this.farm_data.area_name = this.field_data[this.areaIndex].area_name
          this.getFarmWork(this.field_data[this.areaIndex].area_id)
        } else {
          this.getToday()
        }
      })
    },
    getFarmWork (area_id) {
      const data = new FormData()
      data.append('area_id', area_id)
      this.getFarmData(data).then(res => {
        this.tableData = res.data.data
        this.getToday()
      })
    },
    showFarming (index) {
      this.setIndex(index)
      this.farm_data.area_id = this.field_data[index].area_id
      this.farm_data.user_name = this.field_data[index].user_name
      this.farm_data.area_name = this.field_data[index].area_name
      this.getFarmWork(this.field_data[index].area_id)
    },
    showChart () {
      this.chart_data = util.echarts.getVirtulDate(this.chartDate.thisMonth, this.chartDate.nextMonth, this.tableData)
      const myChart = util.echarts.myChart('farm-chart', this.chart_data)
      if (this.field_data.length) {
        myChart.on('click', {}, (params) => {
          this.ind = params.dataIndex
          this.farm_data.date1 = params.data[0]
          this.addItem()
        })
      }
    },
    getToday () {
      const date = new Date()
      this.year = date.getFullYear()
      this.month = date.getMonth() + 1
      this.chartDate.thisMonth = this.year + '-' + this.month + '-1'
      if (this.month > 10) {
        this.chartDate.nextMonth = (this.year + 1) + '-' + ((this.month + 2) - 12) + '-1'
      } else {
        this.chartDate.nextMonth = this.year + '-' + (this.month + 2) + '-1'
      }
      this.showChart()
    },
    lastMonth () {
      if (this.month === 1) {
        this.month = 12
        this.year--
      } else {
        this.month--
      }
      this.chartDate.thisMonth = this.year + '-' + this.month + '-1'
      if (this.month > 10) {
        this.chartDate.nextMonth = (this.year + 1) + '-' + ((this.month + 2) - 12) + '-1'
      } else {
        this.chartDate.nextMonth = this.year + '-' + (this.month + 2) + '-1'
      }
      this.showChart()
    },
    nextMonth () {
      if (this.month === 12) {
        this.month = 1
        this.year++
      } else {
        this.month++
      }
      this.chartDate.thisMonth = this.year + '-' + this.month + '-1'
      if (this.month > 10) {
        this.chartDate.nextMonth = (this.year + 1) + '-' + ((this.month + 2) - 12) + '-1'
      } else {
        this.chartDate.nextMonth = this.year + '-' + (this.month + 2) + '-1'
      }
      this.showChart()
    },
    addItem () {
      this.dialogVisible = true
    },
    showArea (index) {
      this.setIndex(index)
      this.$router.push('field-list')
    },
    closeDialog () {
      this.dialogVisible = false
    },
    success () {
      this.$refs.farmForm.validate((valid) => {
        if (valid) {
          this.upload(this.farm_data)
        } else {
          return false
        }
      })
    },
    upload (params) {
      this.farm_data.date3 = this.getDate
      const data = new FormData()
      for (const key in params) {
        data.append(key, params[key])
      }
      this.setFarmData(data).then(() => {
        Message.success('添加成功')
        this.reload()
      }).catch(() => {
        console.log('上传失败')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .page-farm {
    width: 100%;
    height: 100%;
    .page-farm--content {
      float: left;
      height: 100%;
      width: 75%;
      .page-farm--content-btn {
        height: 30px;
        .el-button {
          margin: 0;
          border-radius: 0;
          float: right;
        }
      }
      .papge-farm--content-hr {
        margin-top: 18px;
      }
      #farm-chart {
        width: 100%;
        height: 50%;
        min-height: 300px;
      }
      .page-farm--content-table {
        margin-top: 10px;
        width: 100%;
        height: 44%;
        overflow: auto;
      }
    }
    .page-farm--aside {
      border-left: 0.1vw solid rgb(202, 199, 199);
      float:right;
      width: 24.4%;
      height: 100%;
      overflow: auto;
      .page-farm--aside-card {
        width: 100%;
        .page-farm--aside-card-body {
          cursor: pointer;
        }
      }
    }
  }
</style>
