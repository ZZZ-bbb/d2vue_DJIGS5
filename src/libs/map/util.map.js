import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './map.css'

// 定义默认图标路径
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

var map = '' // 地图实例
var fieldInfo = '' // 信息控件实例

/**
 * @description 创建地图实例
 * @param {String} domId 容器ID
 * @param {Object} option option
 * @returns {Object} map实例
 */
const newMap = (domId, option) => {
  if (map !== undefined && map !== null && map !== '') {
    map.remove()
  }
  map = L.map(domId, option)
  L.control.scale({
    imperial: false
  }).addTo(map)
  return map
}

/**
 * @description 添加瓦片图层
 * @param {Object} map map实例
 * @param {String} url 瓦片图层url
 * @param {Object} option option
 * @returns {Object} newLayer
 */
const createLayer = (map, url, option) => {
  const newLayer = L.tileLayer(url, option).addTo(map)
  return newLayer
}

/**
 * @description 右上角添加信息控件,内容为地块种植情况
 * @param {Object} map map实例
 * @param {Object} info info
 */
const addInfo = (map, info) => {
  // info处理
  let farming_flg = 0
  if (info.length) {
    if (info[0].farming_type === '播种') {
      farming_flg = 1
    }
  }
  // 自定义信息控件
  L.Control.FieldInfo = L.Control.extend({
    options: {
      position: 'topright'
    },
    onAdd: function () { // L.Control原生方法，使用addTo()时调用该方法
      this._container = L.DomUtil.create('div', 'info')
      if (farming_flg === 1) {
        this._container.innerHTML = `
          <h4>种植信息</h4><hr></br>
          <h5>品种: ${info[0].rice_type}</h5></br>
          <h5>播种时间：${info[0].farming_time}</h5></br>
          <button onClick="location.href = '#/home/farm-management'">农事管理</button>
        ` // 播种信息
      } else {
        this._container.innerHTML = `
          <h4>种植信息</h4><hr></br>
          <h4 style="color: #777">未播种</h4></br>
          <button onClick="location.href = '#/farm-management'">农事管理</button>
        ` // 未播种信息
      }
      return this._container
    },
    onRemove: function () { // L.Control原生方法，使用remove()时调用该方法
      L.DomUtil.remove(this._container)
    }
  })
  // 添加到L.control 控件中，注意这里是小写
  L.control.fieldInfo = function (options) {
    return new L.Control.FieldInfo(options)
  }

  if (fieldInfo !== '' && fieldInfo !== undefined && fieldInfo !== null) {
    fieldInfo.remove()
  }

  fieldInfo = L.control.fieldInfo({
  // 此处设置options，将替换掉上方原始options
  }).addTo(map)
}

// 鼠标坐标位置信息
// fixme

// 添加Popup
// fixme

var points = [] // 绘图过程中的辅助点
var geometry = [] // 最终多边形数据,newClass对象
var lines = L.polyline([]) // 绘图过程中的确定辅助线
var tempLines = L.polyline([], { dashArray: 5 }) // 绘图过程中的动态辅助线
var ind = -1 // 移动点索引
var myIcon = L.divIcon({ className: 'marker-icon' }) // 移动点图案
var CM = L.layerGroup() // 移动点图层组

/**
 * @description 多边形绘制对象
 * @description newPolygon.start(map) // 开始多边形绘制
 * @description newPolygon.end() // 结束多边形绘制
 * @description newPolygon.edit() // 多边形编辑
 * @description newPolygon.getCenter() // 获取多边形初始点地理坐标
 * @description newPolygon.reset() // 重置多边形绘制
 * @description newPolygon.showArea(mapData,points,ptext) // 绘制图形
 */
const newPolygon = {
  /**
   * @description 鼠标点击事件，记录点以及绘制辅助线
   * @param {Object} e 坐标信息
   */
  onClick (e) {
    points.push([e.latlng.lat, e.latlng.lng])
    lines.addLatLng(e.latlng)
    map.addLayer(tempLines)
    map.addLayer(lines)
  },
  /**
   * @description 鼠标移动事件，绘制辅助线
   * @param {Object} e 坐标信息
   */
  onMove (e) {
    if (points.length > 0) {
      // 最新点、当前点、原点
      const ls = [points[points.length - 1], [e.latlng.lat, e.latlng.lng], points[0]]
      tempLines.setLatLngs(ls)
    }
  },
  /**
   * @description 鼠标右键，结束多边形绘制，同时解除鼠标事件
   */
  onContextmenu () {
    geometry.push(L.polygon(points).addTo(map))
    lines.remove()
    tempLines.remove()
    lines = L.polyline([])
    tempLines = L.polyline([], { dashArray: 5 })
    map.off('click')
    map.off('contextmenu')
    map.off('mousemove')
  },
  /**
   * @description 开始多边形绘制
   * @param {Object} mapData map实例
   */
  start (mapData) {
    points = []
    map = mapData
    map.on('click', this.onClick)
    map.on('contextmenu', this.onContextmenu)
    map.on('mousemove', this.onMove)
  },
  /**
   * @description 结束多边形绘制
   * @returns { String } 多边形各点坐标数据
   */
  end () {
    // CM.off('move', this.movePoint)
    map.off('mouseup', this.updataPolygon)
    CM.remove()
    CM = L.layerGroup()
    return JSON.stringify(points)
  },
  /**
   * @description 移动点索引获取
   * @param { Object } e 坐标信息
   */
  movePoint (e) {
    const oldPoint = [e.oldLatLng.lat, e.oldLatLng.lng]
    if (ind === -1) {
      for (let i = 0; i < points.length; i++) {
        if (points[i].join() === oldPoint.join()) {
          ind = i
        }
      }
    }
    // 更新移动点
    const newPoint = [e.latlng.lat, e.latlng.lng]
    points[ind] = newPoint
    // 移动点的辅助线绘制
    let ls = []
    switch (ind) {
      case 0:
        ls = [points[points.length - 1], points[ind], points[ind + 1]]
        break
      case points.length - 1:
        ls = [points[ind - 1], points[ind], points[0]]
        break
      default:
        ls = [points[ind - 1], points[ind], points[ind + 1]]
    }
    tempLines.setLatLngs(ls).addTo(map)
  },
  /**
   * @description 更新移动后的图形
   */
  updataPolygon () {
    tempLines.remove()
    tempLines = L.polyline([], { dashArray: 5 })
    ind = -1
    geometry[0].setLatLngs(points)
  },
  /**
   * @description 多边形编辑
   */
  edit () {
    if (points.length > 1) {
      for (const point of points) {
        CM.addLayer(
          L.marker(point, {
            draggable: true,
            icon: myIcon
          }).on('move', this.movePoint)
        )
      }
      CM.addTo(map)
      map.on('mouseup', this.updataPolygon)
    }
  },
  /**
   * @description 获取多边形地理位置坐标
   * @returns {Array} 初始点坐标
   */
  getCenter () {
    return points[0]
  },
  /**
   * @description 重新绘制多边形
   */
  reset () {
    // CM.off('move', this.movePoint)
    map.off('mouseup', this.updataPolygon)
    CM.remove()
    CM = L.layerGroup()
    geometry[0].removeFrom(map)
    geometry = []
    points = []
  },
  /**
   * @description 显示多边形及相关信息
   * @param {Object} mapData map实例
   * @param {Array} points 多边形各点数据
   * @param {String | HTMLElement} [ptext] 点击多边形显示的popup内容，可选
   * @param {Object} [farmData] 农事信息，可选
   */
  showArea (mapData, points, ptext = null, farmData = null) {
    if (geometry.length) {
      geometry[0].removeFrom(mapData)
      geometry = []
    }
    // 自动缩放图形
    mapData.fitBounds(points)
    if (ptext) {
      geometry.push(L.polygon(points).addTo(mapData).bindPopup(ptext))
    }
    if (farmData) {
      addInfo(mapData, farmData)
    }
  }
}

/**
 * @description 多边形面积计算
 * @description 输入由newPolygon.start(map)绘制的多边形点数据points[[lat,lng],[lat,lng]......] [纬度，经度]    [y, x]
 * @description fileArea.getArea()
 */
const fileArea = {
  /**
   * @description 已知三角形三点经纬度坐标，计算三角形面积
   * @param {Array} A A点经纬度坐标
   * @param {Array} B B点经纬度坐标
   * @param {Array} C C点经纬度坐标
   * @returns {Number} area 单位 米
   */
  triangleArea (A, B, C) {
    const a = map.distance(B, C)
    const b = map.distance(A, C)
    const c = map.distance(A, B)
    const p = (a + b + c) / 2
    const area = Math.sqrt(p * (p - a) * (p - b) * (p - c))
    return area
  },
  /**
   * @description 计算多边形面积
   * @returns {Number} area
   */
  getArea () {
    const test_points = points
    const direction = [] // 方向标识
    let cosx = null // 坐标系转换用cos值
    let sinx = null // 坐标系转换用sin值
    let c_x = null // 点c坐标系转换后的x值
    let ab_l = null // 点ab长度
    let l_num = 0 // 左旋点个数
    let r_num = 0 // 右旋点个数
    let t_num = 0 // 共线个数，很难人为实现

    // 统计每个点的下一个点相对于上一个点是左旋还是右旋(顺时针转还是逆时针转)
    for (let i = 0; i < test_points.length; i++) {
      switch (i) {
        case 0:
          // 利用点1，2建立y轴直角坐标系，计算进行坐标系转换后的点3 x值
          ab_l = Math.sqrt(((test_points[test_points.length - 1][1] - test_points[i][1]) * (test_points[test_points.length - 1][1] - test_points[i][1])) + ((test_points[test_points.length - 1][0] - test_points[i][0]) * (test_points[test_points.length - 1][0] - test_points[i][0])))
          cosx = (test_points[i][0] - test_points[test_points.length - 1][0]) / ab_l
          sinx = (test_points[test_points.length - 1][1] - test_points[i][1]) / ab_l
          // 计算点3的x值
          c_x = (test_points[i + 1][1] - test_points[test_points.length - 1][1]) * cosx + (test_points[i + 1][0] - test_points[test_points.length - 1][0]) * sinx
          break
        case points.length - 1:
          // 利用点1，2建立y轴直角坐标系，计算进行坐标系转换后的点3 x值
          ab_l = Math.sqrt(((test_points[i - 1][1] - test_points[i][1]) * (test_points[i - 1][1] - test_points[i][1])) + ((test_points[i - 1][0] - test_points[i][0]) * (test_points[i - 1][0] - test_points[i][0])))
          cosx = (test_points[i][0] - test_points[i - 1][0]) / ab_l
          sinx = (test_points[i - 1][1] - test_points[i][1]) / ab_l
          // 计算点3的x值
          c_x = (test_points[0][1] - test_points[i - 1][1]) * cosx + (test_points[0][0] - test_points[i - 1][0]) * sinx
          break
        default:
          // 利用点1，2建立y轴直角坐标系，计算进行坐标系转换后的点3 x值
          ab_l = Math.sqrt(((test_points[i - 1][1] - test_points[i][1]) * (test_points[i - 1][1] - test_points[i][1])) + ((test_points[i - 1][0] - test_points[i][0]) * (test_points[i - 1][0] - test_points[i][0])))
          cosx = (test_points[i][0] - test_points[i - 1][0]) / ab_l
          sinx = (test_points[i - 1][1] - test_points[i][1]) / ab_l
          // 计算点3的x值
          c_x = (test_points[i + 1][1] - test_points[i - 1][1]) * cosx + (test_points[i + 1][0] - test_points[i - 1][0]) * sinx
      }
      // 比较
      if (c_x < 0) {
        direction.push('l') // 左旋/逆时针
        l_num += 1
      } else if (c_x > 0) {
        direction.push('r') // 右旋/顺时针
        r_num += 1
      } else {
        direction.push('t') // 直线  此情况原则上极难人为制造
        t_num = t_num + 1
      }
    }
    // 主方向选择
    let dire = ''
    if (r_num > l_num) {
      dire = 'r'
      return this.polylineArea(dire, direction)
    } else if (r_num < l_num) {
      dire = 'l'
      return this.polylineArea(dire, direction)
    } else {
      return Math.max(this.polylineArea('r', direction), this.polylineArea('l', direction))
    }
  },
  /**
   * @description 面积计算子函数
   * @param {String} dire 主方向选择
   * @param {Array} direction 多边形点方向集合
   * @returns {Number} area 单位 米
   */
  polylineArea (dire, direction) {
    // 面积点选择
    const points_b = []
    const points_s = []
    let points_g = []
    let tem_points = []
    let tem_direction = []
    let moveIndex = direction.indexOf(dire)
    // 偏移数组
    if (moveIndex !== 0) {
      for (let i = 0; i < points.length; i++) {
        tem_points.push(points[moveIndex])
        tem_direction.push(direction[moveIndex])
        moveIndex++
        if (moveIndex >= points.length) {
          moveIndex -= points.length
        }
      }
    } else {
      tem_points = points
      tem_direction = direction
    }
    let k = 0 // 标记变量 0：前一值为r值，1：前一值为l值
    for (let i = 0; i < tem_points.length; i++) {
      if (tem_direction[i] === dire) {
        if (k === 0) {
          points_b.push(tem_points[i])
        } else {
          points_b.push(tem_points[i])
          points_g.push(tem_points[i])
          points_s.push(points_g)
          points_g = []
          k = 0
        }
      } else {
        if (i < tem_points.length - 1) {
          if (k === 0) {
            points_g.push(tem_points[i - 1])
            points_g.push(tem_points[i])
            k = 1
          } else {
            points_g.push(tem_points[i])
          }
        } else {
          if (k === 0) {
            points_g.push(tem_points[i - 1])
            points_g.push(tem_points[i])
            points_g.push(tem_points[0])
            points_s.push(points_g)
            points_g = []
          } else {
            points_g.push(tem_points[i])
            points_g.push(tem_points[0])
            points_s.push(points_g)
            points_g = []
          }
        }
      }
    }
    // 多边形面积计算
    let area_b = 0
    let area_s = 0
    let area = 0
    for (let i = 0; i < points_b.length - 2; i++) {
      area_b = area_b + this.triangleArea(points_b[0], points_b[i + 1], points_b[i + 2])
    }
    for (let i = 0; i < points_s.length; i++) {
      for (let j = 0; j < points_s[i].length - 2; j++) {
        area_s = area_s + this.triangleArea(points_s[i][0], points_s[i][j + 1], points_s[i][j + 2])
      }
    }
    area = area_b - area_s
    return area
  }
}

export default { newMap, createLayer, newPolygon, fileArea }
