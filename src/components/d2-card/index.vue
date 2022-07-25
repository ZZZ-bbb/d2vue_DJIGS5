<template>
  <div class="item-container" :style="{'border': border}">
      <el-card>
          <div slot="header">
              <slot name="title"></slot>
              <!-- <span>卡片名称</span>
              <el-button>操作按钮</el-button> -->
          </div>
          <div>
              <slot name="body"></slot>
          </div>
      </el-card>
  </div>
</template>

<script>
export default {
  props: ['border'] // :border="activeCard==index?'4px solid hsl(0, 100%, 86%)':'1px solid hsl(98, 100%, 86%)'"
}
</script>

<style lang="scss" scoped>
  .item-container {
  height: auto;
  border-radius: 5%;
  margin: 5px 10px;
  background-color: rgb(255, 254, 254);
  box-shadow: 3px 3px 3px 3px #bbbbbb
  }
</style>
