<template>
  <el-card class="form-container" shadow="never">

    <el-form :model="customClass"
             :rules="rules"
             ref="customClassFrom"
             label-width="150px">
      <el-form-item label="店铺名称："  prop="shopId" >
        <el-select filterable placeholder="请选择" v-model="customClass.shopId" style="width: 100%" >
          <el-option
            v-for="item in shopList"
            :key="item.id"
            :label="item.shopName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分类名称：" prop="className">
        <el-input v-model="customClass.className"></el-input>
      </el-form-item>
      <el-form-item label="商品数量：">
        <el-input v-model="customClass.goodsAmount" readonly></el-input>
      </el-form-item>
      <el-form-item label="数量单位：">
        <el-input v-model="customClass.goodsUnit"></el-input>
      </el-form-item>
      <el-form-item label="排序：">
        <el-input v-model="customClass.classSort"></el-input>
      </el-form-item>
      <el-form-item label="导航栏显示：">
        <el-switch
          v-model="customClass.navState"
          :active-value="1"
          :inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="创建时间：">
        <el-input v-model="customClass.createDate" readonly></el-input>
      </el-form-item>
      <el-form-item label="更新时间：">
        <el-input v-model="customClass.updateDate" readonly></el-input>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input
          class="textarea"
          placeholder="请输入内容"
          type="textarea"
          v-model="customClass.comments"
          :autosize="true"
          maxlength="100"
          show-word-limit
          clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('customClassFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('customClassFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
  import {saveCustomClass,getCustomClassById} from '@/api/classify';
  import {findShop} from '@/api/shop';
  import { Message, MessageBox } from 'element-ui'
  const defaultCustomClass = {
    id:null,
    shopId:null,
    className: '',
    goodsAmount:0,
    navState: 0,
    goodsUnit: '',
    classSort: 0,
    createDate:null,
    updateDate:null,
    comments: null,
  };
  export default {
    name: "ProductCateDetail",
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        customClass: Object.assign({}, defaultCustomClass),
        selectProductCateList: [],
        shopList:[],
        classId:null,
        rules: {
          className: [
            {required: true, message: '请输入分类名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          shopId: [
            {required: true, message: '请选择店铺', trigger: 'blur'}
          ]
        },
        filterAttrs: [],
        filterProductAttrList: [{
          value: []
        }]
      }
    },
    created() {
      if(this.isEdit){
        this.classId=this.$route.query.id;
        getCustomClassById(this.classId).then(res=>{
          if(res.code==0){
            this.customClass=res.data;
          }
        })
      }
      findShop().then((res) => {
        this.shopList=res.data;
        this.loading = false;
      }).catch(() => {
        this.loading = false
      })
    },
    methods: {

      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              saveCustomClass(this.customClass).then(res=>{
                if(res.code==0){
                  this.$router.back();
                }else {
                  Message.error(res.message)
                }
              })
            })
          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration: 1000
            });
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.customClass = Object.assign({}, defaultCustomClass);
      }
    }
  }
</script>

<style scoped>
  .form-container{
    width: 720px;
    margin: 0 auto;
  }
</style>
