<template> 
  <el-card class="form-box" shadow="never">
    <el-form :model="shop" :rules="shopRules" ref="shopFrom" label-width="100px">
      <el-row :gutter="10">
        <el-col :span="20" style="display: none">
          <el-form-item label="" prop="id">
            <el-input type="hidden"
                      v-model="shop.id"
                      maxlength="20"
                      show-word-limit
                      clearable>

            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <div></div>
        </el-col>
        <el-col :span="20">
          <el-form-item label="店铺名称：" prop="shopName">
            <el-input type="text"
                      v-model="shop.shopName"
                      maxlength="20"
                      show-word-limit
                      clearable>

            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <div></div>
        </el-col>
        <el-col :span="10">
          <el-form-item label="品牌名称：">
            <el-input v-model="shop.brandName"
                      maxlength="10"
                      show-word-limit
                      clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="店铺电话：" >
            <el-input v-model="shop.telephone"
                      maxlength="12"
                      show-word-limit
                      clearable>
              <template slot="prepend"><span class="el-icon-phone" ></span></template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">

        </el-col>
        <el-col :span="20">
          <el-form-item label="店铺logo：">
            <!--<single-upload ></single-upload>-->
            <!--<el-upload-->
              <!--action="https://jsonplaceholder.typicode.com/posts/"-->
              <!--list-type="picture-card"-->
              <!--:auto-upload="false"-->
              <!--:class="{disabled:uploadDisabled}"-->
              <!--:on-change="uploadImage"-->
              <!--:on-preview="handlePictureCardPreview"-->
              <!--:on-remove="handleRemove">-->
              <!--<i class="el-icon-plus"></i>-->
            <!--</el-upload>-->
            <!--<el-dialog :visible.sync="dialogVisible">-->
              <!--<img width="200px" :src="dialogImageUrl" alt="">-->
            <!--</el-dialog>-->
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
              <img width="375" height="210" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="店铺地址：">
            <el-input v-model="shop.address"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-popover
            placement="top-start"
            title="提示"
            width="200"
            trigger="hover"
            content="浏览器定位会有一定变差，请您点击地图选择。">
              <el-button  type="warning" plain slot="reference" @click="showAMap">选择位置</el-button>
          </el-popover>
        </el-col>
        <el-col :span="10">
          <el-form-item label="店铺经度：" >
            <el-input v-model="shop.longitude" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="店铺纬度：" >
            <el-input v-model="shop.latitude" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="20" v-show="isShow">
          <a-map ref="aMap" :is-edit="isEdit" :a-lng="shop.longitude" :a-lat="shop.latitude" v-on:p-address="getAddress"></a-map>
        </el-col>
        <el-col :span="10">
          <el-form-item label="基础运费：" prop="freight">
            <el-input v-model.number="shop.freight"
                      type="number"
                      maxlength="4"
                      autocomplete="off"
                      clearable>
              <template slot="prepend">￥</template>
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="配送范围：" prop="shopScope">
            <el-input v-model.number="shop.shopScope"
                      type="number"
                      maxlength="4"
                      clearable>
              <template slot="append">km</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">

        </el-col>
        <el-col :span="10" v-show="isEdit">
          <el-form-item label="创建时间：" prop="createDate">
            <el-input v-model.number="shop.createDate"
                      type="text"
                      readonly>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" v-show="isEdit">
          <el-form-item label="更新时间：" prop="updateDate">
            <el-input v-model.number="shop.updateDate"
                      type="text"
                      readonly>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4" v-show="isEdit">

        </el-col>
        <el-col :span="20">
          <el-form-item label="店铺介绍：">
            <el-input
              class="textarea"
              placeholder="请输入内容"
              type="textarea"
              v-model="shop.shopIntro"
              :autosize="true"
              maxlength="100"
              show-word-limit
              clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="店铺公告：">
            <el-input
              class="textarea"
              placeholder="请输入内容"
              type="textarea"
              v-model="shop.notice"
              :autosize="true"
              maxlength="100"
              show-word-limit
              clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="备注：">
            <el-input
              class="textarea"
              placeholder="请输入内容"
              type="textarea"
              v-model="shop.comments"
              :autosize="true"
              maxlength="100"
              show-word-limit
              clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item>
            <el-button type="primary" v-loading='' @click="onSubmit()">提交</el-button>
            <el-button v-if="!isEdit" @click="resetForm('shopFrom')">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>
<script>
  import { Message, MessageBox } from 'element-ui'
  import {saveShop,shopId} from '@/api/shop';
  import img from '@/components/common'
  import {deleteFile} from '@/api/oss'
  import AMap from './AMap'
  const defaultShop={
    id:null,
    shopName: "",
    shopCode:'',
    shopIntro: '',
    telephone: "",
    shopLogo:null,
    freight: 0,
    shopScope:0,
    score:5,
    address: "",
    status:-2,
    longitude: 0,
    latitude: 0,
    brandName: "",
    notice: "",
    createDate:"",
    updateDate:"",
    comments:""
  };
  export default {
    name: 'shopDetail',
    components: {AMap},
    props: {
      isEdit: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        isShow:false,
        loading:false,
        imageList:[],
        imgUri:img.imagePath,
        token:{},
        hideUpload:false,
        dialogImageUrl: '',
        dialogVisible: false,
        shop:Object.assign({}, defaultShop),
        shopRules: {
          shopName: [
            {required: true, message: '请输入店铺名称', trigger: 'blur'},
            {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
          ],
          freight: [
            {required: true, message: '请输入运费', trigger: 'blur'},
            { type: 'number', message: '运费必须为数字'}
          ],
          shopScope: [
            {required: true, message: '输入配送范围', trigger: 'blur'},
            { type: 'number', message: '输入-1到正整数，-1城区内配送，0为用户自提,数字为配送公里数'}
          ],
        }
      }
    },
    created() {
      this.token.token=sessionStorage.getItem("loginToken")
      if(this.isEdit){
        this.getShopById(this.$route.query.id)
      }
    },
    methods: {
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
            this.shop.shopLogo=null;
            this.hideUpload=this.shop.shopLogo==null?false:true
          }else{

            this.$message.warning(res.msg)
          }
        })

      },
      uploadImg(){
        this.hideUpload=this.shop.shopLogo==null?false:true
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
          this.shop.shopLogo=res.data;
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
      getShopById(id){
        shopId(id).then((res) => {
          this.shop=res.data;
          if(this.shop.shopLogo!=null&&this.shop.shopLogo!=""){
            let  param={};
            param.name= this.shop.shopName;
            param.url=this.imgUri+this.shop.shopLogo;
            this.imageList.push(param)
            this.hideUpload=true;
          }

        })
      },
      showAMap(){
        this.isShow=!this.isShow;
        if( this.isShow){
          this.$refs.aMap.showMap();
        }
      },
      getAddress(obj){
          this.shop.address=obj.address;
          this.shop.longitude=obj.longitude;
          this.shop.latitude=obj.latitude;

      },
      onSubmit() {
        this.$refs.shopFrom.validate(valid => {
          if (valid) {
            this.loading = true;
            saveShop(this.shop).then((res) => {
             console.log(res)
             this.loading = false;
              Message.success(res.msg)
             this.$router.push({path: '/'})
           }).catch(() => {
             this.loading = false
           })
          } else {
            console.log('参数验证不合法！');
            return false
          }
        })
      },
      resetForm(shopFrom) {
        this.$refs[shopFrom].resetFields();
        this.shop = Object.assign({},defaultShop);
      },

    }
  }
</script>
<style scoped>
  .textarea textarea{
    line-height: 40px;
    min-height: 80px;
  }

</style>


