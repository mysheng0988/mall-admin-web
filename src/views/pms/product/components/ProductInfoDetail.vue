<template>
  <div style="margin-top: 50px">
    <el-form :model="goodsMsgParam" :rules="rules" ref="productInfoForm" label-width="120px" style="width: 600px" size="small">
      <el-form-item label="店铺名称："  prop="shopId" >
        <el-select filterable placeholder="请选择" v-model="goodsMsgParam.shopId" style="width: 100%" @change="shopSelect">
          <el-option
            v-for="item in shopList"
            :key="item.id"
            :label="item.shopName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品分类：">
        <el-cascader
          size="medium"
          style="width: 100%"
          v-model="goodsClassify"
          :filterable="true"
          :clearable="true"
          :options="productCateOptions"
          @change="handleChange">
        </el-cascader>
      </el-form-item>
      <el-form-item label="商品名称：" prop="goodsName">
        <el-input v-model="goodsMsgParam.goodsName"></el-input>
      </el-form-item>
      <el-form-item label="自定义分类：">
        <el-select filterable placeholder="请选择" v-model="goodsMsgParam.classifyCode" style="width: 100%" >
          <el-option
            v-for="item in customClassOptions"
            :key="item.id"
            :label="item.className"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="副标题：" prop="goodsTitle">
        <el-input v-model="goodsMsgParam.goodsTitle"></el-input>
      </el-form-item>
      <el-form-item label="商品品牌：">
        <el-input v-model="goodsMsgParam.goodsBrand"></el-input>
      </el-form-item>
      <el-form-item label="商品编码：">
        <el-input v-model="goodsMsgParam.goodsCode"></el-input>
      </el-form-item>
      <!--<el-form-item label="赠送积分：">-->
        <!--<el-input v-model="param.giftPoint"></el-input>-->
      <!--</el-form-item>-->
      <el-form-item label="商品推荐：">
        <span style="margin-right: 10px">新品</span>
        <el-switch
          v-model="goodsMsgParam.goodsNews"
          :active-value="1"
          :inactive-value="0">
        </el-switch>
        <span style="margin-left: 10px;margin-right: 10px">推荐</span>
        <el-switch
          v-model="goodsMsgParam.goodsRecommend"
          :active-value="1"
          :inactive-value="0">
        </el-switch>
        <span style="margin-left: 10px;margin-right: 10px">预告</span>
        <el-switch
          v-model="goodsMsgParam.goodsNotice"
          :active-value="1"
          :inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="商品销量：">
        <el-input v-model="goodsMsgParam.salesVolume"></el-input>
      </el-form-item>
      <el-form-item label="商品备注：">
        <el-input
          class="textarea"
          placeholder="请输入内容"
          type="textarea"
          v-model="goodsMsgParam.comments"
          :autosize="true"
          maxlength="100"
          show-word-limit
          clearable></el-input>
      </el-form-item>
      <el-form-item label="服务保证：">
        <el-checkbox-group v-model="selectService" @change="checkChange" >
          <!--<el-checkbox v-for="item in serviceList" :label="item" :key="item">{{item}}</el-checkbox>-->
          <el-checkbox label="店铺发货售后" disabled>店铺发货售后</el-checkbox>
          <el-checkbox label="正品保障" disabled>正品保障</el-checkbox>
          <el-checkbox label="假一罚十" disabled>假一罚十</el-checkbox>
          <el-checkbox label="货到付款">货到付款</el-checkbox>
          <el-checkbox label="七天退换货">七天退换货</el-checkbox>
          <el-checkbox label="市区内两个小时到货">市区内两个小时到货</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button type="primary" size="medium" @click="handleNext('productInfoForm')">下一步，填写商品属性</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {customClassShopId} from '@/api/classify'
  import {getProduct,classifyList} from '@/api/product';
  import {saveGoods,getGoodsMsg} from '@/api/goods';
  import {findShop} from '@/api/shop';
  const defaultProductParam = {
    id: null,
    shopId: '',
    goodsBrand: '',
    goodsCode: '',
    classifyCode:null,
    goodsName: '',
    goodsTitle: '',
    oneCode:0,
    twoCode:0,
    threeCode:0,
    goodsState: 0,
    examineState: 0,
    goodsNews: 0,
    goodsRecommend: 0,
    goodsNotice: 0,
    goodsEnsure:"",
    salesVolume: 0,
    comments:"",
  };
  export default {
    name: "ProductInfoDetail",
    props: {
      isEdit: {
        type: Boolean,
        default: false
      },
      goodsId: {
        type: String,
        default: ""
      },
    },
    data() {
      return {
        shopList:[],
        goodsClassify:[],
        productCateOptions:[],
        customClassOptions:[],
        goodsMsgParam: Object.assign({},defaultProductParam),
        selectService:['店铺发货售后','正品保障','假一罚十'],
        rules: {
          goodsName: [
            {required: true, message: '请输入商品名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          goodsTitle: [{required: true, message: '请输入商品副标题', trigger: 'blur'}],
          shopId:[{required: true, message: '请选择店铺', trigger: 'blur'}],
          oneCode: [{required: true, message: '请选择商品分类', trigger: 'blur'}],
        }
      };
    },
    created() {
      this.getClassifyList();
      this.handleInitShop();

      if(this.isEdit){
        getGoodsMsg(this.goodsId).then(res=>{
          let data=res.data;
          console.log(data)
          this.goodsMsgParam=res.data;
          this.goodsClassify[0]=data.oneCode;
          this.goodsClassify[1]=data.twoCode;
          this.goodsClassify[2]=data.threeCode;
          this.selectService=data.goodsEnsure.split(",")
        })
      }


    },
    methods: {

      handleChange(value){
        this.goodsMsgParam.oneCode=value[0];
        this.goodsMsgParam.twoCode=value[1];
        this.goodsMsgParam.threeCode=value[2];
      },
      handleInitShop(){
        this.loading=true;
        findShop().then((res) => {
          this.shopList=res.data;
          this.loading = false;
        }).catch(() => {
          this.loading = false
        })
      },
      shopSelect(e){
        this.goodsMsgParam.shopId=e;
        this.goodsMsgParam.classifyCode=null;
        customClassShopId(this.goodsMsgParam.shopId).then(res=>{
          console.log(res)
          this.customClassOptions=res.data;
        })
      },
      checkChange(){
       this.goodsMsgParam.goodsEnsure=this.selectService.join(",")
      },
      getClassifyList(){
        classifyList().then(response => {
          let data=response.data;
          this.productCateOptions =data;

        });
      },
      handleNext(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.goodsMsgParam.goodsEnsure=this.selectService.join(",")
            this.$emit('nextStep',this.goodsMsgParam);

          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration:1000
            });
            return false;
          }
        });
      },
    }
  }
</script>

<style >
  .el-checkbox__input.is-disabled+span.el-checkbox__label {
     color: #409EFF!important;
    cursor: not-allowed;
  }
</style>
