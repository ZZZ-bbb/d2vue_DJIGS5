const echartOption = {}

echartOption.batInfo = {
  backgroundColor: '#F1F7FC',
  tooltip: {
  },
  title: {
    show: true,
    text: '电池电压'
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
      tooltip: {
        formatter: function (params) {
          return [
            '详细信息' + '<hr size=1 style="margin: 3px 0">',
            '电压: ' + params.data[1] + 'V<br/>',
            '时间: ' + new Date(params.data[0]).toLocaleString() + '<br/>'
          ].join('')
        }
      }
    }
  ]
}

export default echartOption
