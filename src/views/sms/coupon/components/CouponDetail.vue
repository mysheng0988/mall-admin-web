<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="coupon"
             :rules="rules"
             ref="couponFrom"
             label-width="150px"
             size="small">
      <el-form-item label="" prop="shopId" style="display: none">
        <el-input type="hidden"
                  v-model="coupon.id">
        </el-input>
        <el-input type="hidden"
                  v-model="coupon.shopId">
        </el-input>
      </el-form-item>
      <el-form-item label="店铺名称:" prop="shopName">
        <el-input class="input-width"
                  v-model="coupon.shopName" :disabled="true">
        </el-input>
      </el-form-item>
      <el-form-item label="优惠券名称：" prop="couponName">
        <el-input v-model="coupon.couponName" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="总发行量：" prop="couponCount">
        <el-input v-model.number="coupon.couponCount" placeholder="只能输入正整数" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="面额：" prop="couponAmount">
        <el-input v-model.number="coupon.couponAmount" placeholder="面值只能是数值，限2位小数" class="input-width">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="每人限领：">
        <el-input v-model="coupon.perLimit" placeholder="只能输入正整数" class="input-width">
          <template slot="append">张</template>
        </el-input>
      </el-form-item>
      <el-form-item label="使用门槛：" prop="limitAmount">
        <el-input v-model.number="coupon.limitAmount" placeholder="只能输入正整数" class="input-width">
          <template slot="prepend">满</template>
          <template slot="append">元可用</template>
        </el-input>
      </el-form-item>
      <el-form-item label="有效期：">
        <el-date-picker
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          v-model="selectDate"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="handleDateChange()"
          :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="优惠券类型：">
        <el-radio-group v-model="coupon.couponType">
          <el-radio-button :label="0">店铺通用</el-radio-button>
          <el-radio-button :label="1">指定分类</el-radio-button>
          <el-radio-button :label="2">指定商品</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="coupon.couponType===1">
        <el-cascader
          clearable
          placeholder="请选择分类名称"
          v-model="selectProductCate"
          :options="productCateOptions">
        </el-cascader>
        <el-button @click="handleAddProductCategoryRelation()">添加</el-button>
        <el-table ref="productCateRelationTable"
                  :data="coupon.productCategoryRelationList"
                  style="width: 100%;margin-top: 20px"
                  border>
          <el-table-column label="分类名称" align="center">
            <template slot-scope="scope">{{scope.row.parentCategoryName}}>{{scope.row.productCategoryName}}</template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="100">
            <template slot-scope="scope">
              <el-button size="mini"
                         type="text"
                         @click="handleDeleteProductCateRelation(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item v-show="coupon.couponType===2">
        <el-select
          v-model="selectProduct"
          filterable
          remote
          reserve-keyword
          placeholder="商品名称/商品货号"
          :remote-method="searchProductMethod"
          :loading="selectProductLoading">
          <el-option
            v-for="item in selectProductOptions"
            :key="item.productId"
            :label="item.productName"
            :value="item.productId">
            <span style="float: left">{{ item.productName }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">NO.{{ item.productSn }}</span>
          </el-option>
        </el-select>
        <el-button @click="handleAddProductRelation()">添加</el-button>
        <el-table ref="productRelationTable"
                  :data="coupon.productRelationList"
                  style="width: 100%;margin-top: 20px"
                  border>
          <el-table-column label="商品名称" align="center">
            <template slot-scope="scope">{{scope.row.productName}}</template>
          </el-table-column>
          <el-table-column label="货号" align="center"  width="120" >
            <template slot-scope="scope">NO.{{scope.row.productSn}}</template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="100">
            <template slot-scope="scope">
              <el-button size="mini"
                         type="text"
                         @click="handleDeleteProductRelation(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input
          class="input-width"
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          v-model="coupon.note">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('couponFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('couponFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import {createCoupon,getCoupon,updateCoupon} from '@/api/coupon';
  // import {fetchSimpleList as fetchProductList} from '@/api/product';
  // import {fetchListWithChildren} from '@/api/cutomClass'
  const defaultCoupon = {
    id:null,
    shopId:"",
    shopName:"",
    couponName: null,
    couponAmount: null,
    couponCount:null,
    couponType: null,
    useCount:0,
    reserveCount:0,
    perLimit: 1,
    status:0,
    limitName: null,
    limitAmount: null,
    beginTime: null,
    expireTime: null,
    comments:null,
  };
  const defaultTypeOptions = [
    {
      label: '全店铺',
      value: 0
    },
    {
      label: '指定分类',
      value: 1
    },
    {
      label: '指定商品',
      value: 2
    }
  ];
  export default {
    name: 'CouponDetail',
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        coupon: Object.assign({}, defaultCoupon),
        typeOptions: Object.assign({}, defaultTypeOptions),
        selectDate:[],
        rules: {
          couponName: [
            {required: true, message: '请输入优惠券名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          couponCount: [
            {type: 'number',required: true, message: '只能输入正整数', trigger: 'blur'}
          ],
          couponAmount: [
            {type: 'number',required: true,message: '面值只能是数值，0.01-10000，限2位小数',trigger: 'blur'}
          ],
          limitAmount: [
            {type: 'number',required: true,message: '只能输入正整数',trigger: 'blur'}
          ]
        },
        selectProduct:null,
        selectProductLoading: false,
        selectProductOptions:[],
        selectProductCate: null,
        productCateOptions: []
      }
    },
    created(){

      if(this.isEdit){
        getCoupon(this.$route.query.id).then(response=>{
          this.coupon=response.data;
          this.selectDate=[response.data.beginTime, response.data.expireTime];
          this.coupon.shopId=sessionStorage.getItem("shopId");
          this.coupon.shopName=sessionStorage.getItem("shopName");
        });
      }else{
        this.coupon.shopId=sessionStorage.getItem("shopId");
        this.coupon.shopName=sessionStorage.getItem("shopName");
      }

      console.log(this.coupon.shopName)
      //this.getProductCateList();
    },
    methods:{
      handleDateChange(){
        this.coupon.beginTime=this.selectDate[0];
        this.coupon.expireTime=this.selectDate[1];
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if(this.isEdit){
                updateCoupon(this.$route.query.id,this.coupon).then(response=>{
                  this.$refs[formName].resetFields();
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration:1000
                  });
                  this.$router.back();
                });
              }else{
                createCoupon(this.coupon).then(response=>{
                  this.$refs[formName].resetFields();
                  this.$message({
                    message: '提交成功',
                    type: 'success',
                    duration:1000
                  });
                  this.$router.back();
                });
              }
            });
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
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.coupon = Object.assign({},defaultCoupon);
      },
      searchProductMethod(query){
        if (query !== '') {
          this.loading = true;
          fetchProductList({keyword:query}).then(response=>{
            this.loading=false;
            let productList = response.data;
            this.selectProductOptions = [];
            for(let i=0;i<productList.length;i++){
              let item = productList[i];
              this.selectProductOptions.push({productId:item.id,productName:item.name,productSn:item.productSn});
            }
          });
        } else {
          this.selectProductOptions = [];
        }
      },
      handleAddProductRelation(){
        if(this.selectProduct===null){
          this.$message({
            message: '请先选择商品',
            type: 'warning'
          });
          return
        }
        this.coupon.productRelationList.push(this.getProductById(this.selectProduct));
        this.selectProduct=null;
      },
      handleDeleteProductRelation(index,row){
        this.coupon.productRelationList.splice(index,1);
      },
      handleAddProductCategoryRelation(){
        if(this.selectProductCate===null||this.selectProductCate.length===0){
          this.$message({
            message: '请先选择商品分类',
            type: 'warning'
          });
          return
        }
        this.coupon.productCategoryRelationList.push(this.getProductCateByIds(this.selectProductCate));
        this.selectProductCate=[];
      },
      handleDeleteProductCateRelation(index,row){
        this.coupon.productCategoryRelationList.splice(index,1);
      },
      getProductById(id){
        for(let i=0;i<this.selectProductOptions.length;i++){
          if(id===this.selectProductOptions[i].productId){
            return this.selectProductOptions[i];
          }
        }
        return null;
      },
      getProductCateList() {
        fetchListWithChildren().then(response => {
          let list = response.data;
          this.productCateOptions = [];
          for (let i = 0; i < list.length; i++) {
            let children = [];
            if (list[i].children != null && list[i].children.length > 0) {
              for (let j = 0; j < list[i].children.length; j++) {
                children.push({label: list[i].children[j].name, value: list[i].children[j].id});
              }
            }
            this.productCateOptions.push({label: list[i].name, value: list[i].id, children: children});
          }
        });
      },
      getProductCateByIds(ids){
        let name;
        let parentName;
        for (let i = 0; i < this.productCateOptions.length; i++) {
          if (this.productCateOptions[i].value === ids[0]) {
            parentName = this.productCateOptions[i].label;
            for (let j = 0; j < this.productCateOptions[i].children.length; j++) {
              if (this.productCateOptions[i].children[j].value === ids[1]) {
                name = this.productCateOptions[i].children[j].label;
              }
            }
          }
        }
        return {productCategoryId: ids[1], productCategoryName: name, parentCategoryName: parentName};
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 60%;
  }
</style>


