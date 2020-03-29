<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="homeAdvertise"
             :rules="rules"
             ref="homeAdvertiseFrom"
             label-width="150px"
             size="small">
      <el-form-item label="广告名称：" prop="title">
        <el-input v-model="homeAdvertise.title" class="input-width" maxlength="50" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="广告位置：">
        <el-select v-model="homeAdvertise.type">
          <el-option
            v-for="type in typeOptions"
            :key="type.value"
            :label="type.label"
            :value="type.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="店铺名称："  prop="shopId" >
        <el-select filterable placeholder="请选择" v-model="homeAdvertise.shopId" class="input-width" @change="shopSelect">
          <el-option
            v-for="item in shopList"
            :key="item.id"
            :label="item.shopName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间：" prop="startDate">
        <el-date-picker
          type="datetime"
          default-time="00:00:00"
          placeholder="选择日期"
          :pickerOptions="pickerOptions0"
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="homeAdvertise.startDate"></el-date-picker>
      </el-form-item>
      <el-form-item label="到期时间：" prop="expireDate">
        <el-date-picker
          type="datetime"
          placeholder="选择日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="23:59:59"
          :pickerOptions="pickerOptions1"
          v-model="homeAdvertise.expireDate"></el-date-picker>
      </el-form-item>
      <el-form-item label="广告图片：">
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
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb,图片宽高比4:3</div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="375" height="210" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="关联对象：">
        <el-radio-group v-model="promotionType" size="small">
          <el-radio-button :label="0">店铺首页</el-radio-button>
          <el-radio-button :label="1">商品详情</el-radio-button>
          <el-radio-button :label="2">活动专场</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <!--<el-form-item label="排序：">-->
        <!--<el-input v-model="homeAdvertise.sort" class="input-width"></el-input>-->
      <!--</el-form-item>-->
      <el-form-item label="广告备注：">
        <el-input
          class="input-width"
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          maxlength="200" show-word-limit
          v-model="homeAdvertise.comments">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('homeAdvertiseFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('homeAdvertiseFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import img from '@/components/common'
  import {deleteFile} from '@/api/oss'
  import {saveHomeAdvertise, getHomeAdvertise} from '@/api/homeAdvertise'
  import {findShop} from '@/api/shop';
  const defaultTypeOptions = [
    {
      label: '首页轮播',
      value: "0"
    },
    {
      label: '附近轮播',
      value: "1"
    },
    {
      label: '店铺轮播',
      value: "2"
    }
  ];
  const defaultHomeAdvertise = {
    id:null,
    sellerId:null,
    shopId:null,
    activityId:null,
    imgPath:null,
    title: null,
    type: "0",
    state: "0",
    startDate: null,
    expireDate: null,
    sort: "0",
    comments:null,
  };
  export default {
    name: 'HomeAdvertiseDetail',
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        homeAdvertise: Object.assign({}, defaultHomeAdvertise),
        promotionType:0,
        shopList:[],
        dialogVisible: false,
        dialogImageUrl:null,
        imgUri:img.imagePath,
        token:{},
        imageList: [],
        hideUpload:false,
        pickerOptions0: {
          disabledDate: (time) => {
            if (this.homeAdvertise.expireDate!=null) {
              let expireDate=new Date(this.homeAdvertise.expireDate);
              return time.getTime() <Date.now() || time.getTime() > expireDate.getTime();
            } else {
              return time.getTime() < Date.now();
            }

          }
        },
        pickerOptions1: {
          disabledDate: (time) => {
            if(this.homeAdvertise.startDate!=null){
              let startDate=new Date(this.homeAdvertise.startDate);
              return time.getTime() < startDate.getTime();
            }else{
              return time.getTime() < Date.now();
            }
          }
        },
        rules: {
          title: [
            {required: true, message: '请输入广告名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 50 个字符', trigger: 'blur'}
          ],
          startDate: [
            {required: true, message: '请选择开始时间', trigger: 'blur'}
          ],
          expireDate: [
            {required: true, message: '请选择到期时间', trigger: 'blur'}
          ],
          imgPath: [
            {required: true, message: '请选择广告图片', trigger: 'blur'}
          ]
        },
        typeOptions: Object.assign({}, defaultTypeOptions)
      }
    },
    created(){
      this.token.token=sessionStorage.getItem("loginToken")
      this.handleInitShop();
      if (this.isEdit) {
        getHomeAdvertise(this.$route.query.id).then(response => {
          this.homeAdvertise = response.data;
          let  param={};
          param.name= this.homeAdvertise.title;
          param.url=this.imgUri+this.homeAdvertise.imgPath;
          this.imageList.push(param)
          this.hideUpload=true;
        });
      }else{
        this.homeAdvertise = Object.assign({},defaultHomeAdvertise);
      }
    },
    methods: {
      handleInitShop(){
        this.loading=true;
        findShop().then((res) => {
          this.shopList=res.data;
          this.loading = false;
        }).catch(() => {
          this.loading = false
        })
      },
      handleRemove(file, fileList) {
        let data="";
        if(file.response){
          data=file.response.data;
        }else{
          data=file.url.split("image/")[1];
        }
        deleteFile({imgPath:data}).then((res)=>{
          if(res.code==0){
            this.$message.success(res.msg)
            this.homeAdvertise.imgPath=null;
            this.hideUpload=this.homeAdvertise.imgPath==null?false:true
          }else{

            this.$message.warning(res.msg)
          }
        })

      },
      uploadImg(){
        this.hideUpload=this.homeAdvertise.imgPath==null?false:true
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
          this.homeAdvertise.imgPath=res.data;
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

                saveHomeAdvertise(this.homeAdvertise).then(res => {
                  if(res.code==0){
                    this.$message({
                      message: res.msg,
                      type: 'success',
                      duration:1000
                    });
                    this.$refs[formName].resetFields();
                    this.homeAdvertise = Object.assign({},defaultHomeAdvertise);
                    this.$router.back();
                  }else {
                    this.$message({
                      message: res.msg,
                      type: 'warning',
                      duration:1000
                    });
                  }

                });

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
        this.homeAdvertise = Object.assign({},defaultHomeAdvertise);
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 70%;
  }
</style>


