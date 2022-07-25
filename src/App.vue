<template>
  <div id="app">
    <router-view v-if="isShow"></router-view>
  </div>
</template>

<script>
import util from '@/libs/util'
export default {
  name: 'app',
  watch: {
    '$i18n.locale': 'i18nHandle'
  },
  provide () {
    return {
      reload: this.reload
    }
  },
  created () {
    this.i18nHandle(this.$i18n.locale)
  },
  data () {
    return {
      isShow: true
    }
  },
  methods: {
    i18nHandle (val, oldVal) {
      util.cookies.set('lang', val)
      document.querySelector('html').setAttribute('lang', val)
    },
    reload () {
      this.isShow = false
      this.$nextTick(function () {
        this.isShow = true
      })
    }
  }
}
</script>

<style lang="scss">
@import '~@/assets/style/public-class.scss';
</style>
