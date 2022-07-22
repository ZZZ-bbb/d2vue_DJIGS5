import { assign, map } from 'lodash'
import faker from 'faker/locale/zh_CN'
import { service, request, serviceForMock, requestForMock, mock } from './service'
import * as tools from './tools'

const files = require.context('./modules', true, /\.api\.js$/)
const generators = files.keys().map(key => files(key).default)

// 将modules文件夹下的所有方法export，同时使用generator函数import modules中所需要的方法
export default assign({}, ...map(generators, generator => generator({
  service,
  request,
  serviceForMock,
  requestForMock,
  mock,
  faker,
  tools
})))
