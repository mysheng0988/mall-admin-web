<template>
  <div class="overview-layout">
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="out-border">
          <div class="layout-title">商品总览</div>
          <div style="padding: 40px">
            <el-row>
              <el-col :sm="12" :md="6" >
                <div class="color-danger overview-item-value">100</div>
                <div class="overview-item-title">已下架</div>
              </el-col>
              <el-col :sm="12" :md="6">
                <div class="color-danger overview-item-value">400</div>
                <div class="overview-item-title">已上架</div>
              </el-col>
              <el-col :sm="12" :md="6" >
                <div class="color-danger overview-item-value">50</div>
                <div class="overview-item-title">库存紧张</div>
              </el-col>
              <el-col :sm="12" :md="6" >
                <div class="color-danger overview-item-value">500</div>
                <div class="overview-item-title">全部商品</div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="out-border">
          <div class="layout-title">用户总览</div>
          <div style="padding: 40px">
            <el-row>
              <el-col :sm="12" :md="6" >
                <div class="color-danger overview-item-value">200</div>
                <div class="overview-item-title">今日新增</div>
              </el-col>
              <el-col :sm="12" :md="6" >
                <div class="color-danger overview-item-value">500</div>
                <div class="overview-item-title">昨日新增</div>
              </el-col>
              <el-col :sm="12" :md="6" >
                <div class="color-danger overview-item-value">1000</div>
                <div class="overview-item-title">本月新增</div>
              </el-col>
              <el-col :sm="12" :md="6" >
                <div class="color-danger overview-item-value">5000</div>
                <div class="overview-item-title">会员总数</div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
    export default {
        name: "UserGoodsMsg"
    }
</script>

<style scoped>
  .layout-title {
    color: #606266;
    padding: 15px 20px;
    background: #F2F6FC;
    font-weight: bold;
  }

  .overview-layout {
    margin-top: 20px;
  }

  .overview-item-value {
    font-size: 24px;
    text-align: center;
  }

  .overview-item-title {
    margin: 10px 0;
    text-align: center;
  }

  .out-border {
    border: 1px solid #DCDFE6;
  }
</style>
