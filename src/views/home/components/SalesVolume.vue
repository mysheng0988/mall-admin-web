<template>
  <div class="total-layout">
    <el-row :gutter="20" >
      <el-col :xs="24" :sm="12" :md="6">
        <div class="total-frame">
          <svg-icon icon-class="order" class-name="total-icon">
          </svg-icon>
          <div class="total-title">今日订单总数</div>
          <div class="total-value">200</div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6" >
        <div class="total-frame">
          <svg-icon icon-class="total-today" class-name="total-icon">
          </svg-icon>
          <div class="total-title">今日销售总额</div>
          <div class="total-value">￥5000.00</div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6" >
        <div class="total-frame">
          <svg-icon icon-class="total-yesterday" class-name="total-icon">
          </svg-icon>
          <div class="total-title">昨日销售总额</div>
          <div class="total-value">￥5000.00</div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6" >
        <div class="total-frame">
          <svg-icon icon-class="total-week"  class-name="total-icon">
          </svg-icon>
          <div class="total-title">近7天销售总额</div>
          <div class="total-value">￥50000.00</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
    export default {
        name: "salesVolume",
        props: {
            shopId: {
              type: String,
              default: ''
            }
        },
      computed: {
          getShopId(){
            return this.shopId
          }
      },
      watch: {
        getShopId:function (newValue) {
          if(newValue===undefined||newValue==null||newValue==='')return;
            //console.log(newValue)
        }
      },
    }
</script>

<style scoped>
  .total-layout {
    margin-top: 20px;
  }

  .total-frame {
    border: 1px solid #DCDFE6;
    padding: 20px;
    height: 100px;
    margin: 10px 0;
  }

  .total-icon {
    color: #409EFF;
    width: 60px;
    height: 60px;
  }

  .total-title {
    position: relative;
    font-size: 16px;
    color: #909399;
    left: 70px;
    top: -50px;
  }

  .total-value {
    position: relative;
    font-size: 18px;
    color: #606266;
    left: 70px;
    top: -40px;
  }
</style>
