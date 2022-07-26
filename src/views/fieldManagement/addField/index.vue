<template>
  <d2-container class="map-container">
    <div class="main-content">
      <div class="map_button">
        <div class="map_button_item">
          <el-button @click="addLayer(); openMs()" :disabled="isShow" type="">开始绘制</el-button>
        </div>
        <div class="map_button_item">
          <el-button @click="editLayer" :disabled="!isShow">编辑地块</el-button>
        </div>
        <div class="map_button_item">
          <el-button @click="resetMap" :disabled="!isShow">重新绘制</el-button>
        </div>
        <div class="map_button_item">
          <el-button type="danger" @click="stopLayer(); getArea(); getLocation()" :disabled="!isShow">提交数据</el-button>
        </div>
      </div>
      <div id="add-field-map"></div>
    </div>
    <div class="main-aside">
      <div class="form-body">
        <div class="form-content">
          <div class="form-title">
            <span>地块信息</span>
          </div>
          <el-form ref="fieldForm" :rules="rules" :model="field_data" label-width="80px">
            <el-form-item label="田块名称" prop="name">
              <el-input v-model="field_data.name"></el-input>
            </el-form-item>
            <el-form-item label="省份">
              <el-input :disabled="true" v-model="field_data.province"></el-input>
            </el-form-item>
            <el-form-item label="地级市">
              <el-input :disabled="true" v-model="field_data.city"></el-input>
            </el-form-item>
            <el-form-item label="区县">
              <el-input :disabled="true" v-model="field_data.county"></el-input>
            </el-form-item>
            <el-form-item label="详细地址" prop="address">
              <el-input v-model="field_data.address"></el-input>
            </el-form-item>
            <el-form-item label="田块面积">
              <el-input :disabled="true" v-model="fileArea"></el-input>
            </el-form-item>
          </el-form>
          <div>
            <el-button @click="submitForm" type="primary">保存信息</el-button>
          </div>
        </div>
      </div>
    </div>
  </d2-container>
</template>

<script>
import util from '@/libs/util'
import { service } from '@/api/service'
import { mapActions } from 'vuex'
export default {
  name: 'field-add',
  data () {
    return {
      isShow: false,
      isShowEdit: false,
      rules: {
        name: [
          { required: true, message: '请输入地块名称', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      field_data: {
        name: '',
        province: '',
        city: '',
        county: '',
        address: '',
        area: 0,
        points: []
      },
      map: '',
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
    fileArea () {
      return this.field_data.area + ' 亩'
    }
  },
  mounted () {
    this.getMap()
  },
  methods: {
    ...mapActions('d2admin/field', [
      'setFieldData'
    ]),
    getMap () {
      this.map = util.map.newMap('add-field-map', this.mapOption)
      util.map.createLayer(this.map, this.url, this.layerOption)
    },
    addLayer () {
      util.map.newPolygon.start(this.map)
      this.isShow = !this.isShow
    },
    stopLayer () {
      const pointsData = util.map.newPolygon.end()
      this.field_data.points = pointsData
    },
    editLayer () {
      util.map.newPolygon.edit()
      this.isShowEdit = !this.isShowEdit
    },
    resetMap () {
      util.map.newPolygon.reset()
      this.isShow = !this.isShow
    },
    submitForm () {
      this.$refs.fieldForm.validate((valid) => {
        if (valid) {
          if (this.field_data.area === 0) {
            this.$message({
              message: '请提交田块数据',
              duration: 3000,
              type: 'warning'
            })
          } else {
            this.upload(this.field_data)
          }
        } else {
          return false
        }
      })
    },
    upload (params) {
      const data = new FormData()
      for (const key in params) {
        data.append(key, params[key])
      }
      this.setFieldData(data).then((res) => {
        if (res.data.code === 200) {
          this.$message({
            message: '保存成功',
            duration: 3000,
            type: 'success'
          })
          this.$router.replace('field-list')
        } else {
          this.$message({
            message: '上传失败',
            duration: 3000,
            type: 'error'
          })
        }
      }).catch(() => {
        console.log('上传失败')
      })
    },
    getArea () {
      const fileArea = util.map.fileArea.getArea()
      this.field_data.area = (fileArea * 0.0015).toPrecision(4)
    },
    getLocation () {
      const localPoint = util.map.newPolygon.getCenter()
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${localPoint[1]},${localPoint[0]}.json?language=zh-Hans&types=locality&access_token=pk.eyJ1IjoiNzY0MzcxNzQxIiwiYSI6ImNsMHZ3Y2V5bjBuZWQzY210ZDBuOWh1ejIifQ.ZrfiUT3M-7HVGdWdWb1pCQ`
      service.get(url).then(res => {
        this.field_data.province = res.data.features[0].context[1].text
        this.field_data.city = res.data.features[0].context[0].text
        this.field_data.county = res.data.features[0].text
      })
    },
    openMs () {
      this.$message({
        message: '请点击鼠标左键绘制地块，右键结束绘制',
        duration: 6000,
        showClose: true
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
      #add-field-map {
      width: 100%;
      height: 100%;
      z-index: 1;
      }
    }
    .main-aside {
      float:right;
      width: 25%;
      height: 100%;
      .form-body {
        height: auto;
        border: 2px solid hsl(240, 7%, 79%);
        border-radius: 1%;
        margin: 0px 5px 5px 10px;
        background-color: #EBF1F6;
        .form-content {
          width: 80%;
          text-align: center;
          margin: 10% auto;
          .form-title {
            font-size: 20px;
            margin-bottom: 20px;
          }
        }
      }
    }
  }
</style>
