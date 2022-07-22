const echartOption = {}

echartOption.batInfo = {
  backgroundColor: '#000',
  tooltip: {
  },
  dataZoom: {
    type: 'inside'
  },
  xAxis: {
    type: 'time',
    axisLabel: {
      show: true,
       textStyle: {
         color: '#FFFFFF',  //更改坐标轴文字颜色
         fontSize : 15      //更改坐标轴文字大小
       }
    },
  },
  yAxis: {
    type: 'value',
    scale: true,
    axisLabel: {
      show: true,
       textStyle: {
         color: '#FFFFFF',  //更改坐标轴文字颜色
         fontSize : 15      //更改坐标轴文字大小
       }
    },
  },
  series: [
    {
      type: 'line',
      showSymbol: true,//是否默认展示圆点
      symbol: 'circle',     //设定为实心点
      symbolSize: 5,   //设定实心点的大小
      itemStyle: {
        normal: {
          color: "#000", //改变折线点的颜色
          borderColor: '#70DB93',
          borderWidth: 1,
          lineStyle: {
            color: "#70DB93", //改变折线颜色
          },
        },
      },
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
        color: '#FFF'
      }
    }
  ]
}

echartOption.uavInfo = {
 
  backgroundColor: '#F1F7FC',
  tooltip: {
  },
  dataZoom: {
    type: 'inside'
  },
  xAxis: {
    type: 'value',
    scale: true
  },
  yAxis: {
    type: 'value',
    scale: true
  },
  series: [
    {
      type: 'line',
      showSymbol: true,//是否默认展示圆点
      symbol: 'circle',     //设定为实心点
      symbolSize: 2,   //设定实心点的大小
      itemStyle: {
        normal: {
          color: "#fffff", //改变折线点的颜色
          lineStyle: {
            color: "#FF0000", //改变折线颜色
          },
        },
      },
      tooltip: {
        formatter: function (params) {
          return [
            '详细信息' + '<hr size=1 style="margin: 3px 0">',
            '纬度: ' + params.data[1] + '<br/>',
            '经度: ' + params.data[0] + '<br/>',
          ].join('')
        }
      },
      lineStyle: {
        color: '#FFFFFF'
      }
    }
  ]
}

export default echartOption
