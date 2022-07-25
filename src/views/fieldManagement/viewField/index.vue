<template>
  <d2-container class="map-container">
    <div class="main-content">
      <div id="view-field-map"></div>
    </div>
    <div class="main-aside">
      <div v-if="!field_data.length">
        <el-button>添加地块</el-button>
      </div>
      <div class="item-card" v-for="(item,index) in field_data" :key="index">
        <d2-card :border="areaIndex==index?'4px solid hsl(0, 100%, 86%)':'1px solid hsl(98, 100%, 86%)'">
          <div slot="title">
            <span @click="showFarming(index)">{{item.area_name}}</span>
            <el-button style="float: right; padding: 6px; margin-left:10px" type="danger" @click="delArea(index)">删除</el-button>
            <el-button style="float: right; padding: 6px" type="primary">更新</el-button>
          </div>
          <div slot="body" @click="showArea(index)">
            <span>地区：{{item.area_province+item.area_city+item.area_country}}</span><br>
            <span>详细地址：{{item.area_address}}</span><br>
            <span>面积：{{item.area_large}}亩</span><br>
            <span>创建时间：{{item.created_at}}</span>
          </div>
        </d2-card>
      </div>
    </div>
  </d2-container>
</template>

<script>
import util from '@/libs/util'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'field-list',
  inject: ['reload'],
  data () {
    return {
      field_data: [], // 地块信息
      farm_data: [], // 农事信息
      map: '', // map实例
      url: 'https://api.mapbox.com/styles/v1/764371741/cl104r88t006415od03t8itpo/tiles/512/{z}/{x}/{y}?' +
        'access_token=pk.eyJ1IjoiNzY0MzcxNzQxIiwiYSI6ImNsMHZ3Y2V5bjBuZWQzY210ZDBuOWh1ejIifQ.ZrfiUT3M-7HVGdWdWb1pCQ',
      layerOption: {
        zoomOffset: -1,
        tileSize: 512,
        maxZoom: 20
      },
      mapOption: {
        center: [23.15763794413284, 113.34546817452538], // 需要添加获取定位
        zoom: 18,
        zoomControl: true,
        doubleClickZoom: false,
        attributionControl: false
      }
    }
  },
  computed: {
    ...mapState('d2admin/field', [
      'areaIndex'
    ])
  },
  created () {
    this.getArea()
  },
  mounted () {
    this.getMap()
  },
  methods: {
    ...mapActions('d2admin/field', [
      'getFieldData', 'getFarmData', 'delFieldData', 'setIndex'
    ]),
    getMap () {
      this.map = util.map.newMap('view-field-map', this.mapOption)
      util.map.createLayer(this.map, this.url, this.layerOption)
    },
    getArea () {
      this.getFieldData().then(res => {
        if (res.data.code === 200) {
          this.field_data = res.data.data
        }
        if (this.field_data.length) {
          this.getFarmWork(this.field_data[this.areaIndex].area_id)
        }
      })
    },
    getFarmWork (area_id) {
      const data = new FormData()
      data.append('area_id', area_id)
      this.getFarmData(data).then(res => {
        this.farm_data = res.data.data
        util.map.newPolygon.showArea(this.map, JSON.parse(this.field_data[this.areaIndex].area_data),
          JSON.stringify(this.field_data[this.areaIndex].area_large) + '亩', this.farm_data)
      })
    },
    showArea (index) {
      this.setIndex(index)
      this.getFarmWork(this.field_data[this.areaIndex].area_id)
    },
    delArea (index) {
      const data = new FormData()
      data.append('area_id', this.field_data[index].area_id)
      this.delFieldData(data).then(() => {
        this.reload()
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
      position: relative;
      float: left;
      height: 100%;
      width: 75%;
      .map_button {
        position: absolute;
        right: 20px;
        top: 20px;
        z-index: 2;
        .map_button_item {
          margin-bottom: 12px;
        }
      }
      #view-field-map {
      width: 100%;
      height: 100%;
      z-index: 1;
      }
    }
    .main-aside {
      float:right;
      width: 25%;
      height: 100%;
      overflow: auto;
      .item-card {
        width: 100%;
      }
    }
  }
</style>
