<template>
  <d2-container class="map-container">
    <div class="main-content">
      <div class="order-button">
        <div class="button-item">
          <el-button type="danger" size="medium" icon="el-icon-edit" round @click="test">全部订单</el-button>
        </div>
        <div class="button-item">
          <el-badge :value="isAccepted" v-if="isAccepted">
            <el-button type="primary" size="medium" icon="el-icon-edit" round>待处理</el-button>
          </el-badge>
          <el-button v-if="!isAccepted" type="primary" size="medium" icon="el-icon-edit" round>待处理</el-button>
        </div>
        <div class="button-item">
          <el-badge :value="inProcess" v-if="inProcess">
            <el-button type="primary" size="medium" icon="el-icon-edit" round>进行中</el-button>
          </el-badge>
          <el-button v-if="!inProcess" type="primary" size="medium" icon="el-icon-edit" round>进行中</el-button>
        </div>
        <div class="button-item">
          <el-button type="primary" size="medium" icon="el-icon-edit" round>已完成</el-button>
        </div>
        <div class="button-item">
          <el-button type="primary" size="medium" icon="el-icon-edit" round>已取消</el-button>
        </div>
      </div>
      <router-view></router-view>
    </div>
    <div class="main-aside">
      <d2-card>
        <div slot="title">
            <span>作业队信息</span>
            <el-button style="float: right; padding: 6px" type="primary">详细</el-button>
          </div>
          <div slot="body" class="card-body">
          </div>
      </d2-card>
    </div>
  </d2-container>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'org-management',
  data () {
    return {
      farm_data: []
    }
  },
  computed: {
    isAccepted () {
      let is_accepted = 0
      for (const item in this.farm_data) {
        if (!this.farm_data[item].is_accepted) {
          is_accepted++
        }
      }
      return is_accepted
    },
    inProcess () {
      let in_process = 0
      for (const item in this.farm_data) {
        if (this.farm_data[item].is_accepted && !this.farm_data[item].is_finished) {
          in_process++
        }
      }
      return in_process
    }
  },
  created () {
    this.getFarmWork()
  },
  mounted () {
  },
  methods: {
    ...mapActions('d2admin/organization', [
      'getWorkData'
    ]),
    getFarmWork () {
      this.getWorkData().then(res => {
        this.farm_data = res.data.data
      })
    },
    test () {
      this.$router.push('/org-management/all-orders')
    }
  }
}
</script>

<style lang="scss" scoped>
  .map-container {
    width: 100%;
    height: 100%;
    .main-content {
      float: left;
      height: 100%;
      width: 74.8%;
      .order-button {
        .button-item  {
          float: left;
          margin: 20px 10px;
        }
      }
    }
    .main-aside {
      border-left: 0.1vw solid rgb(202, 199, 199);
      float:right;
      width: 25%;
      height: 100%;
      // overflow: auto;
    }
  }
</style>
