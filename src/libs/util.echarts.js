import * as echarts from 'echarts'

const path = ['m 482.62668,189.92949 c -15.01093,0.61562 -31.43002,3.52 -49.53,8.77 -53.19995,15.39998 -103.60005,40.90002 -155,62.6 -135.99987,57.39994 -201.699976,177.00014 -174.8,321.6 3.69999,19.79998 17.70001,37.70002 30.3,63.2 108.89989,-192.79981 288.60016,-288.90012 453.5,-401.3 -27.07498,-37.94997 -59.43724,-56.71688 -104.47,-54.87 z m 156.22,76.65 c -22.22342,-4.62656 -43.22502,7.24501 -63.55,22.32 -35.99997,26.69997 -73.00005,52.00003 -115.7,82.3 h 219.7 c 6.49999,-36.59997 14.19997,-70.20003 -17.8,-94 -7.7,-5.7 -15.2422,-9.07782 -22.65,-10.62 z m -23.83,125.73 c -63.91244,-0.7625 -128.22007,12.79002 -192.12,38.99 -41.09996,16.79998 -73.20001,46.90005 -83.6,99.1 202.0998,9.39999 400.10019,28.10009 588.7,121.2 -6.2,-96.49991 -40.70009,-171.30005 -123.2,-212.4 -62.34994,-31.04997 -125.86757,-46.1275 -189.78,-46.89 z m -315.82,103.59 c -45.89996,53.69994 -91.70006,107.40006 -146.7,171.8 55.19994,12.49998 94.00004,21.3 132.7,30 4.09999,-1.8 8.2,-3.70001 12.2,-5.5 -71.39993,-71.79993 -1.59998,-127.00006 19.4,-187.8 -5.9,-2.8 -11.70001,-5.70001 -17.6,-8.5 z m 74,56.7 c -59.79994,-1.5 -93.79997,51.30005 -65.7,104.4 11.69999,21.99997 29.70002,43.00001 49.8,57.8 105.49989,77.39992 223.70013,121.29999 355.6,114.8 93.3999,-4.6 162.00004,-52.00009 201.6,-136.6 -81.59992,-28.29998 -159.30008,-52.90003 -235.2,-82.2 -98.7999,-38.29997 -201.00011,-55.50001 -306.1,-58.2 z',
  'M824.32 51.2h-614.4C153.6 51.2 102.4 97.28 102.4 153.6v102.4h819.2V153.6c0-56.32-40.96-102.4-97.28-102.4zM102.4 870.4c0 56.32 51.2 102.4 107.52 102.4h614.4c56.32 0 97.28-46.08 97.28-102.4V307.2H102.4v563.2z m414.72-102.4c-30.72 0-51.2-20.48-51.2-51.2s20.48-51.2 51.2-51.2 51.2 20.48 51.2 51.2-20.48 51.2-51.2 51.2z m204.8-102.4c30.72 0 51.2 20.48 51.2 51.2s-20.48 51.2-51.2 51.2-51.2-20.48-51.2-51.2 20.48-51.2 51.2-51.2z m-102.4-102.4c30.72 0 51.2 20.48 51.2 51.2s-20.48 51.2-51.2 51.2-51.2-20.48-51.2-51.2 20.48-51.2 51.2-51.2z m-102.4-102.4c30.72 0 51.2 20.48 51.2 51.2s-20.48 51.2-51.2 51.2-51.2-20.48-51.2-51.2 20.48-51.2 51.2-51.2z m-102.4 102.4c30.72 0 51.2 20.48 51.2 51.2s-20.48 51.2-51.2 51.2-51.2-20.48-51.2-51.2 20.48-51.2 51.2-51.2z m-102.4 102.4c30.72 0 51.2 20.48 51.2 51.2s-20.48 51.2-51.2 51.2-51.2-20.48-51.2-51.2 20.48-51.2 51.2-51.2z',
  'M828.64922 251.88489h-86.290681c47.649381 0 86.289674-37.596097 86.289674-83.963644v-83.965658c0-46.380637-38.639287-83.966665-86.289674-83.966664H310.866871c-47.649381 0-86.292695 37.585021-86.292695 83.966664v83.965658c0 46.369561 38.642307 83.963644 86.290681 83.963644h-86.290681c-47.661464 0-86.30075 37.596097-86.300751 83.965658v587.758598c0 46.369561 38.639287 83.963644 86.300751 83.963644h604.075044c47.661464 0 86.302764-37.594083 86.302765-83.963644V335.850548c0-46.369561-38.642307-83.963644-86.304779-83.963644l0.002014-0.002014zM656.064837 755.677831h-87.4688v83.966664c0 23.183773-18.153104 41.983332-41.983332 41.983333-23.819152 0-43.152389-18.799559-43.152389-41.983333v-83.966664h-86.292695c-23.831235 0-43.150375-18.798552-43.150375-41.983333 0-23.185787 19.320147-41.982325 43.150375-41.982325h86.292695v-83.966665c0-23.186794 19.330216-41.982325 43.152389-41.982326 23.831235 0 41.983332 18.795531 41.983332 41.982326v83.966665h87.469807c23.820159 0 43.141313 18.796538 43.141313 41.982325s-19.321154 41.982325-43.141313 41.982326l-0.001007 0.001007z m185.418833-293.878293H211.74174V335.850548h629.74193v125.94899z',
  'M64 427.3s200.4 25.9 166.1 319.6h598.5S772 397 960 323.6c0 0-202.4 14.4-310 211.7-40 73.2 15.3-146.2 89.1-221.6 0 0-235.6 74.8-244.4 189.1-2.7 33.9 36.7-112.5-85.9-225.8 0 0 31.7 140.6-30.9 211.5-0.1-0.2-189.8-95.8-313.9-61.2z'
]

var chart

function getVirtulDate (startTime, endTime, tableData) {
  const date = +echarts.number.parseDate(startTime)
  const end = +echarts.number.parseDate(endTime)
  const dayTime = 3600 * 24 * 1000
  const data = []
  let count = 0
  let flag = 0
  for (let time = date; time < end; time += dayTime) {
    flag = 0
    if (count < tableData.length) {
      for (const item of tableData) {
        const i = +echarts.number.parseDate(item.farming_time_ymd)
        if (i === time) {
          let farming_type = 0
          switch (item.farming_type) {
            case '播种':
              farming_type = 1
              break
            case '施肥':
              farming_type = 2
              break
            case '施药':
              farming_type = 4
              break
            case '除草':
              farming_type = 8
              break
          }
          data.push([echarts.format.formatTime('yyyy-MM-dd', time), farming_type])
          count++
          flag = 1
          break
        }
      }
      if (flag === 0) {
        data.push([echarts.format.formatTime('yyyy-MM-dd', time), 0])
      }
    } else {
      data.push([echarts.format.formatTime('yyyy-MM-dd', time), 0])
    }
  }
  return data
}

function option (data) {
  const thisMonth = data[0][0]
  const nextMonth = data[data.length - 1][0]
  const option = {
    backgroundColor: '#F1F7FC',
    calendar: {
      range: [thisMonth, nextMonth],
      cellSize: ['auto', 'auto'],
      orient: 'vertical',
      splitLine: {
        lineStyle: {
          // color: 'green'
        }
      },
      itemStyle: {
        // color: '#554333',
        // borderColor: 'blue',
        // opacity: '0.4'
      },
      dayLabel: {
        firstDay: 1,
        margin: 10,
        fontSize: 16
      },
      monthLabel: {
        margin: 10,
        fontSize: 20
      },
      yearLabel: {
        color: '#555'
      }
    },
    tooltip: {
    },
    series: [
      {
        type: 'custom',
        coordinateSystem: 'calendar',
        zlevel: 2,
        silent: true,
        renderItem: function (params, api) {
          const cellPoint = api.coord(api.value(0))
          const cellWidth = params.coordSys.cellWidth
          const cellHeight = params.coordSys.cellHeight
          if (isNaN(cellPoint[0]) || isNaN(cellPoint[1])) {
            return
          }
          const icon = (ind) => {
            return {
              type: 'path',
              shape: {
                pathData: path[ind],
                width: cellHeight / 2,
                height: cellHeight / 2
              },
              x: cellPoint[0] - cellHeight / 4 - cellWidth / 4,
              y: cellPoint[1] - cellHeight / 4,
              style: {
                fill: 'green'
              }
            }
          }
          const group = {
            type: 'group',
            children: [{
              type: 'text',
              style: {
                x: cellPoint[0] - cellHeight / 6,
                y: cellPoint[1] - cellHeight / 6,
                text: echarts.format.formatTime('dd', api.value(0)),
                fill: '#000',
                textFont: api.font({ fontSize: cellHeight / 3, fontWeight: '200' })
              }
            }]
          }
          if (api.value(1) > 0) {
            switch (api.value(1)) {
              case 1:
                group.children.push(icon(0))
                break
              case 2:
                group.children.push(icon(1))
                break
              case 4:
                group.children.push(icon(2))
                break
              case 8:
                group.children.push(icon(3))
                break
            }
          }
          return group
        },
        data: data
      },
      {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        zlevel: 1,
        data: data,
        tooltip: {
          formatter: function (param) {
            let farming_type = ''
            switch (param.data[1]) {
              case 1:
                farming_type = '播种'
                break
              case 2:
                farming_type = '施肥'
                break
              case 4:
                farming_type = '施药'
                break
              case 8:
                farming_type = '除草'
                break
            }
            if (param.data[1] > 0) {
              return [
                '待办事项' + '<hr size=1 style="margin: 3px 0">',
                '时间: ' + param.data[0] + '<br/>',
                '内容: ' + farming_type + '<br/>'
              ].join('')
            }
          },
          textStyle: {
            fontWeight: 'bold',
            fontSize: 14
          }
        }
      }
    ],
    visualMap: {
      show: false,
      min: 0,
      max: 1,
      inRange: {
        color: ['#F5DEB3', '#BDB76B']
      }
    }
  }
  return option
}

const myChart = (id, data) => {
  if (chart !== null && chart !== '' && chart !== undefined) {
    chart.dispose() // 销毁chart实例
  }
  chart = echarts.init(document.getElementById(id))
  chart.setOption(option(data))

  // 图标自适应监听
  window.addEventListener('resize', function () {
    chart.resize()
  })
  return chart
}


/**
 * @description 初始化
 * @param {String} id 实例容器id
 * @param {object} data 配置项，万能接口
 */
function init (id, data = {}) {
  chart = echarts.init(document.getElementById(id))
  chart.setOption(data)

  // 图标自适应监听
  window.addEventListener('resize', function () {
    chart.resize()
  })
  return chart
}

const refChart = (data) => {
  chart.clear()
  chart.setOption(option(data))
}

export default { myChart, getVirtulDate, refChart, init }
