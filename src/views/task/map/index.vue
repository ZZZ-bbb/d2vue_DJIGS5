<template>
  <div class="map-container" id="map"></div>
</template>

<script>
export default {
  data () {
    return {
      info: {
        task_id: '',
        UserID: '',
        filename: '',
        created_at: ''
      },
      chart1Data: '',
      linedata: '',
      map: '',
      url:
        'https://api.mapbox.com/styles/v1/764371741/cl104r88t006415od03t8itpo/tiles/512/{z}/{x}/{y}?access_token=pk.eyJ1IjoiNzY0MzcxNzQxIiwiYSI6ImNsMHZ3Y2V5bjBuZWQzY210ZDBuOWh1ejIifQ.ZrfiUT3M-7HVGdWdWb1pCQ',
      layerOption: {
        zoomOffset: -1,
        tileSize: 512,
        maxZoom: 100,
        minNativeZoom: 0,
        maxNativeZoom: 100
      },
      mapOption: {
        center: [23.15763794413284, 113.34546817452538], // 需要添加获取定位
        maxNativeZoom: 18,
        maxZoom: 100,
        minZoom: 3,
        zoom: 22,
        zoomControl: false,
        attributionControl: false,
        crs: L.CRS.EPSG3857
      }
    }
  },
  mounted () {
    this.getMap()
  },
  computed: {
    // ...mapState('d2admin/task', ['chart1Data']),
  },
  methods: {
    getMap () {
      this.info.task_id = this.$route.query.task_id
      this.info.UserID = this.$route.query.UserID
      this.info.filename = this.$route.query.filename
      this.info.created_at = this.$route.query.created_at
      this.chart1Data = this.$route.query.chart1Data
      this.map = this.$map.newMap('map', this.mapOption)
      this.$map.addRouteInfo(this.map, this.info)
      // this.$map.addMapChoosen(this.map)
      this.$map.createLayer(this.map, this.url, this.layerOption)
      this.$map.showLine(this.chart1Data, { color: 'red' }, this.map)
    }
  }
}
</script>

<style>
#map {
  width: 100%;
  height: 100%;
}
</style>
