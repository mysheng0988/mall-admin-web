<template> 
  <el-card class="form-container" shadow="never" style="width: 700px;margin: auto">
    <el-form :model="brand" :rules="rules" ref="brandFrom" label-width="150px">
      <el-form-item label="品牌名称：" prop="brandName">
        <el-input v-model="brand.brandName"></el-input>
      </el-form-item>
      <el-form-item label="品牌拼音：" v-if="isEdit">
        <el-input v-model="brand.brandPinyin" readonly></el-input>
      </el-form-item>
      <el-form-item label="品牌LOGO：">
        <el-upload
          action="/office/file/uploadimg/"
          name="image"
          list-type="picture-card"
          :data="token"
          :file-list="imageList"
          accept="image/jpeg,image/gif,image/png"
          :before-upload="beforeUpload"
          :on-remove="handleRemove"
          :class="{disabled:hideUpload}"
          :on-change="uploadImg"
          :on-success="handleUploadSuccess"
          :on-preview="handlePreview"
          :limit="1"
          :on-exceed="handleExceed"
        >
          <i class="el-icon-plus"></i>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb,图片宽高比1:1</div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100" height="100" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="排序：" >
        <el-input v-model.number="brand.brandSort"></el-input>
      </el-form-item>
      <el-form-item label="创建时间：" v-if="isEdit">
        <el-input v-model.number="brand.createDate" readonly></el-input>
      </el-form-item>
      <el-form-item label="更新时间：" v-if="isEdit">
        <el-input v-model.number="brand.updateDate" readonly></el-input>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input
          placeholder="请输入内容"
          type="textarea"
          v-model="brand.comments"
          :autosize="true"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('brandFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('brandFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import img from '@/components/common'
  import {deleteFile} from '@/api/oss'
  import {saveBrand, getBrand} from '@/api/brand'
  const defaultBrand={
    id: null,
    sellerId:null,
    brandName: null,
    brandPinyin: null,
    logoPath: null,
    brandSort: 0,
    createDate:null,
    updateDate:null,
    comments:null,
  };
  export default {
    name: 'BrandDetail',
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        dialogVisible: false,
        dialogImageUrl:null,
        imgUri:img.imagePath,
        token:{},
        imageList: [],
        hideUpload:false,
        brand:Object.assign({}, defaultBrand),
        rules: {
          name: [
            {required: true, message: '请输入品牌名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          logo: [
            {required: true, message: '请输入品牌logo', trigger: 'blur'}
          ],
          sort: [
            {type: 'number', message: '排序必须为数字'}
          ],
        }
      }
    },
    created() {
      this.token.token=sessionStorage.getItem("loginToken")
      if (this.isEdit) {
        getBrand(this.$route.query.id).then(res => {
          if(res.code==0){
            this.brand = res.data;
            let  param={};
            param.name= this.brand.brandName;
            param.url=this.imgUri+this.brand.logoPath;
            this.imageList.push(param)
            this.hideUpload=true;
          }else {
            this.$message.warning(res.msg)
          }

        });
      }else{
        this.brand = Object.assign({},defaultBrand);
      }
    },
    methods: {
      handleRemove(file, fileList) {
        let data=file.response.data;
        deleteFile({imgPath:data}).then((res)=>{
          if(res.code==0){
            this.$message.success(res.msg)
            this.brand.logoPath=null;
            this.hideUpload=this.brand.logoPath==null?false:true
          }else{
            this.$message.warning(res.msg)
          }
        })

      },
      uploadImg(){
        this.hideUpload=this.brand.logoPath==null?false:true
      },
      handlePreview(file) {
        this.dialogVisible = true;
        this.dialogImageUrl=file.url;
      },
      beforeUpload(file) {
        let imgSize=file.size/1024<500;
        if(!imgSize){
          this.$message.error("上传图片应小于500kb！")
        }
        return imgSize;
      },
      handleUploadSuccess(res, file) {
        if(res.data!=null){
          this.brand.logoPath=res.data;
          return true;
        }else {
          this.$message.error("文件上传失败")
          return false
        }

      },
      handleExceed(files, fileList) {
        this.$message({
          message: '最多只能上传'+this.maxCount+'张图片',
          type: 'warning',
          duration:1000
        });
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {

              saveBrand(this.brand).then(res => {
                if(res.code==0){
                  this.$refs[formName].resetFields();
                  this.brand = Object.assign({},defaultBrand);
                  this.$message({
                    message: res.msg,
                    type: 'success',
                    duration:1000
                  });
                  this.$router.back();
                }else {
                  this.$message({
                    message: res.msg,
                    type: 'warning',
                    duration:1000
                  });
                }

                });
              })

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
        this.brand = Object.assign({},defaultBrand);
      }
    }
  }
</script>
<style>
</style>


