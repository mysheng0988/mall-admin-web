<template>
  <div class="un-handle-layout">
    <div class="layout-title">待处理事务</div>
    <div class="un-handle-content">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8">
          <div class="un-handle-item">
            <span class="font-medium">待付款订单</span>
            <span style="float: right" class="color-danger">(10)</span>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <div class="un-handle-item">
            <span class="font-medium">已完成订单</span>
            <span style="float: right" class="color-danger">(10)</span>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <div class="un-handle-item">
            <span class="font-medium">待确认收货订单</span>
            <span style="float: right" class="color-danger">(10)</span>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <div class="un-handle-item">
            <span class="font-medium">待发货订单</span>
            <span style="float: right" class="color-danger">(10)</span>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <div class="un-handle-item">
            <span class="font-medium">新缺货登记</span>
            <span style="float: right" class="color-danger">(10)</span>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <div class="un-handle-item">
            <span class="font-medium">待处理退款申请</span>
            <span style="float: right" class="color-danger">(10)</span>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <div class="un-handle-item">
            <span class="font-medium">已发货订单</span>
            <span style="float: right" class="color-danger">(10)</span>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <div class="un-handle-item">
            <span class="font-medium">待处理退货订单</span>
            <span style="float: right" class="color-danger">(10)</span>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <div class="un-handle-item">
            <span class="font-medium">广告位即将到期</span>
            <span style="float: right" class="color-danger">(10)</span>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
    export default {
        name: "AwaitHandle"
    }
</script>

<style scoped>
  .un-handle-layout {
    margin-top: 20px;
    border: 1px solid #DCDFE6;
  }

  .layout-title {
    color: #606266;
    padding: 15px 20px;
    background: #F2F6FC;
    font-weight: bold;
  }

  .un-handle-content {
    padding: 20px 40px;
  }

  .un-handle-item {
    border-bottom: 1px solid #EBEEF5;
    padding: 10px;
  }
</style>
