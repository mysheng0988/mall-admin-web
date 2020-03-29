<template> 
  <el-card class="form-container" shadow="never">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="填写商品信息"></el-step>
      <el-step title="填写商品属性"></el-step>
      <el-step title="上传商品图片"></el-step>
    </el-steps>
    <product-info-detail
      v-show="showStatus[0]"
      :is-edit="isEdit"
      :goods-id="goodsId"
      @nextStep="nextStep">
    </product-info-detail>
    <product-sale-detail
      v-show="showStatus[1]"
      :is-edit="isEdit"
      :goods-id="goodsId"
      @nextStep="nextStep"
      @prevStep="prevStep">
    </product-sale-detail>
    <product-relation-detail
      v-show="showStatus[2]"
      :goods-id="goodsId"
      :is-edit="isEdit"
      @prevStep="prevStep"
      @finishCommit="finishCommit">
    </product-relation-detail>
  </el-card>
</template>
<script>
  import ProductInfoDetail from './ProductInfoDetail';
  import ProductSaleDetail from './ProductSaleDetail';
  import ProductRelationDetail from './ProductRelationDetail';
  import {getGoodsAllMsg,saveGoods} from '@/api/goods';

  const defaultProductParam = {
    goodsMsg:null,
    goodsNorms:[],
    goodsImg:[],
  };
  export default {
    name: 'ProductDetail',
    components: {ProductInfoDetail, ProductSaleDetail, ProductRelationDetail},
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        active: 0,
        flag:false,
        options:[],
        productParam: Object.assign({}, defaultProductParam),
        showStatus: [true, false, false],
        goodsId:'',
      }
    },
    created(){
      if(this.isEdit){
        this.goodsId=this.$route.query.id;
      }
    },
    methods: {
      hideAll() {
        for (let i = 0; i < this.showStatus.length; i++) {
          this.showStatus[i] = false;
        }
      },
      prevStep() {
        if (this.active > 0 && this.active < this.showStatus.length) {
          this.active--;
          this.hideAll();
          this.showStatus[this.active] = true;
        }
      },
      nextStep(param) {

        if (this.active < this.showStatus.length - 1) {
          this.active++;
          this.hideAll();
          this.showStatus[this.active] = true;
        }
        if(this.active==1){
          this.productParam.goodsMsg=param;
          console.log(this.productParam)
        }else{
          this.productParam.goodsNorms=param;
        }
      },
      finishCommit(param) {
        this.productParam.goodsImg=param;
        this.$confirm('是否要提交该产品', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          saveGoods(this.productParam).then((res)=>{
            this.$message({
              type: 'success',
              message: '提交成功',
              duration:1000
            });
            this.$router.back();
          })

        })
      }
    }
  }
</script>
<style scoped>
  .form-container {
    width: 900px;
    margin: 20px auto;
  }
</style>


