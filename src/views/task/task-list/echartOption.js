const echartOption = {}

echartOption.batInfo = {
  backgroundColor: '#F1F7FC',
  tooltip: {
  },
  dataZoom: {
    type: 'inside'
  },
  xAxis: {
    type: 'time'
  },
  yAxis: {
    type: 'value',
    scale: true
  },
  series: [
    {
      type: 'line',
      colorBy: 'series',
      symbol: 'emptyCircle',
      symbolSize: 4,
      tooltip: {
        formatter: function (params) {
          return [
            '详细信息' + '<hr size=1 style="margin: 3px 0">',
            '数据: ' + params.data[1] + '<br/>',
            '时间: ' + new Date(params.data[0]).toLocaleString() + '<br/>'
          ].join('')
        }
      },
      lineStyle: {
        color: '#85B3E3'
      }
    }
  ]
}

export default echartOption
