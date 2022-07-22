import * as echarts from 'echarts'

const echart = {}

var chart

/**
 * @description 初始化
 * @param {String} id 实例容器id
 * @param {object} data 配置项，万能接口
 */
echart.init = function (id, data = {}) {
  chart = echarts.init(document.getElementById(id))
  chart.setOption(data)
  // 图标自适应监听
  window.addEventListener('resize', function () {
    chart.resize()
  })
  return chart
}

export default echart
