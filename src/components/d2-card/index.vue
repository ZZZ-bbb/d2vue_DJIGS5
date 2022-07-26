<template>
  <div class="item-container">
      <el-card :style="isActive?'background-image: linear-gradient(160deg, rgba(160,189,231,0.3), rgba(160,189,231,0.8))':'background-image: linear-gradient(160deg, #FFFFFF, #EBF1F6)'">
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
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
  .item-container {
  margin: 0px 5px 5px 10px;
  }
  :deep(.el-card) {
    border: 1px solid hsl(240, 7%, 79%);
  }
</style>
