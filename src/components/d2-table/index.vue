<template>
  <div>
    <div class="tableContent">
      <el-table
        :ref="tableRef"
        :data="tableData"
        :default-sort="sortData"
        :height="tableHeight"
        :header-cell-style="{ 'text-align': 'center', 'background-color': '#eee', color: '#333333' }"
        v-loading="isLoading"
        @selection-change="selectionChange"
      >
        <el-table-column v-if="tableType == 'selection'" type="selection" width="55" align="center"> </el-table-column>
        <el-table-column
          v-for="(item, index) in tableColumn"
          :key="index"
          :prop="item.prop"
          :label="item.title"
          :align="item.align"
          v-bind="item"
        >
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    sortData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    tableColumn: {
      type: Array,
      default: () => {
        return []
      }
    },
    tableHeight: {
      type: Number,
      default: null
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    tableType: {
      type: String,
      default: ''
    },
    tableRef: {
      type: String,
      default: null
    }
  },
  methods: {
    selectionChange (selection) {
      this.$emit('selectionChange', selection)
    },
    tableRefSuccess () {
      return this.$refs[this.tableRef]
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
