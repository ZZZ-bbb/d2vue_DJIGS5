/**
 * The file enables `@/store/index.js` to import all vuex modules
 * in a one-shot manner. There should not be any reason to edit this file.
 * 批量引入多个组件 hsm
 */

const files = require.context('./modules', false, /\.js$/) // files.key() == ['./A.js', './B.js', './C.js', './D.js', ...]
const modules = {}

files.keys().forEach(key => {
  modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default // files(key) == {namespaced, actions, ...}
})

export default {
  namespaced: true,
  modules
}
