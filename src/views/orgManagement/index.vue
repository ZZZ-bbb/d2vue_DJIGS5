<template>
  <d2-container class="map-container">
    <div class="main-content">
      <div class="order-button">
        <div class="button-item">
          <el-button type="danger" size="medium" icon="el-icon-edit" round @click="allOrders">全部订单</el-button>
        </div>
        <div class="button-item">
          <el-badge :value="farm_type_num[0]" v-if="farm_type_num[0]">
            <el-button type="primary" size="medium" icon="el-icon-edit" round @click="pendingOrders">待处理</el-button>
          </el-badge>
          <el-button v-if="!farm_type_num[0]" type="primary" size="medium" icon="el-icon-edit" round @click="pendingOrders">待处理</el-button>
        </div>
        <div class="button-item">
          <el-badge :value="farm_type_num[1]" v-if="farm_type_num[1]">
            <el-button type="primary" size="medium" icon="el-icon-edit" round @click="processOrders">进行中</el-button>
          </el-badge>
          <el-button v-if="!farm_type_num[1]" type="primary" size="medium" icon="el-icon-edit" round @click="processOrders">进行中</el-button>
        </div>
        <div class="button-item">
          <el-button type="primary" size="medium" icon="el-icon-edit" round @click="doneOrders">已完成</el-button>
        </div>
        <div class="button-item">
          <el-button type="primary" size="medium" icon="el-icon-edit" round @click="cancelOrders">已取消</el-button>
        </div>
      </div>
      <div>
        <d2-table :tableData="farm_data" :tableColumn="tableColumn" :sortData="sortData" :maxHeight="0.8"></d2-table>
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
            <div class="description-item">
              <el-descriptions title="地块信息" :column="1" border>
              <el-descriptions-item label="地块名称">{{ name }}</el-descriptions-item> -->
              <el-descriptions-item label="地区">{{ location }}</el-descriptions-item>
              <el-descriptions-item label="详细地址">{{ address }}</el-descriptions-item>
              <el-descriptions-item label="面积">{{ area }}</el-descriptions-item>
            </el-descriptions>
            </div>
            <div class="description-item">
              <el-descriptions title="作业记录" border></el-descriptions>
            </div>
          </div>
        </el-drawer>
      </div>
    </div>
    <div class="main-aside">
      <d2-card>
        <div slot="title">
            <span>作业队信息</span>
            <el-button style="float: right; padding: 6px" type="primary">详细</el-button>
          </div>
          <div slot="body" class="card-body">
          </div>
      </d2-card>
    </div>
  </d2-container>
</template>

<script>
import { mapActions } from 'vuex'
import util from '@/libs/util'
export default {
  name: 'org-management',
  inject: ['reload'],
  data () {
    return {
      farm_type_num: [],
      drawer: false, // 抽屉控制符
      ind: 0, // 选择的table数据索引
      farm_data: [], // 农事信息
      sortData: { prop: 'farming_time', order: 'ascending' }, // 默认排序的字段
      name: '', // el-descriptions使用数组获取数据时报错，使用变量获取正常，原因未知，故申明以下变量
      location: '',
      address: '',
      area: '',
      tableColumn: [ // 列表字段数据
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
  created () {
    this.getFarmWorkNum()
    this.getFarmWork()
  },
  methods: {
    ...mapActions('d2admin/organization', [
      'getWorkDataNum', 'getWorkData', 'accessWork'
    ]),
    getFarmWork () {
      this.getWorkData({ type: 'all' }).then(res => {
        this.farm_data = res.data.data
        console.log(this.farm_data)
      })
    },
    getFarmWorkNum () {
      this.getWorkDataNum().then(res => {
        this.farm_type_num = res.data.data
      })
    },
    getMap () {
      this.map = util.map.newMap('map', this.mapOption)
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
      this.getWorkData({ type: 'all' }).then(res => {
        this.farm_data = res.data.data
      })
    },
    processOrders () {
      this.getWorkData({ type: 'process' }).then(res => {
        this.farm_data = res.data.data
      })
    },
    doneOrders () {
      this.getWorkData({ type: 'done' }).then(res => {
        this.farm_data = res.data.data
      })
    },
    pendingOrders () {
      this.getWorkData({ type: 'pending' }).then(res => {
        this.farm_data = res.data.data
      })
    },
    cancelOrders () {
      this.getWorkData({ type: 'cancel' }).then(res => {
        this.farm_data = res.data.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .map-container {
    width: 100%;
    height: 100%;
    .main-content {
      float: left;
      height: 100%;
      width: 74.8%;
      .order-button {
        .button-item  {
          float: left;
          margin: 20px 10px;
        }
      }
    }
    .main-aside {
      border-left: 0.1vw solid rgb(202, 199, 199);
      float:right;
      width: 25%;
      height: 100%;
      // overflow: auto;
    }
    #map {
      width: 75%;
      height:100%;
      float:left;
    }
    .map-aside {
      width: 25%;
      float:right;
      .description-item {
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
