<template>
  <div style="margin-top: 50px">
    <el-form
             ref="productRelationForm"
             label-width="120px"
             style="width: 680px"
             size="small">
      <el-form-item label="商品相册：">
        <el-upload
          action="/office/file/uploadimg/"
          name="image"
          list-type="picture-card"
          :data="token"
          :file-list="fileList"
          accept="image/jpeg,image/gif,image/png"
          :before-upload="beforeUpload"
          :on-remove="handleRemove"
          :on-success="handleUploadSuccess"
          :on-preview="handlePreview"
          :limit="maxNum"
          :on-exceed="handleExceed"
        >
          <i class="el-icon-plus"></i>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="200" height="200" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>

      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，填写商品属性</el-button>
        <el-button type="primary" size="medium" @click="handleFinishCommit">完成，提交商品</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import img from '@/components/common'
  import {deleteFile} from '@/api/oss'
  import {getGoodsImgByGoodsId} from '@/api/goods'

  const defaultImageParam = {
    id:null,
    goodsId:null,
    imageType:0,
    goodsImage:"",
    imageOrder:0,
  };
  export default {
    name: "ProductRelationDetail",
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
        dialogVisible: false,
        dialogImageUrl:null,
        imgUri:img.imagePath,
        token:{},
        maxNum:6,
        fileList: [],
        uploadList:[],
      };
    },
    created() {
      this.token.token=sessionStorage.getItem("loginToken")
      if(this.isEdit&&this.goodsId){
        getGoodsImgByGoodsId(this.goodsId).then(res=>{
          let fileList=res.data;
          this.fileList=[]
          for(let i=0;i<fileList.length;i++){
            let  param={};
            param.name=fileList[i].id;
            param.url=this.imgUri+fileList[i].goodsImage;
            this.fileList.push(param)
          }
        })
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

        console.log(data)
        deleteFile({imgPath:data}).then((res)=>{
            console.log(res)
        })

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
          let goodsImgObj= Object.assign({}, defaultImageParam)
          goodsImgObj.goodsImage=res.data;
          goodsImgObj.goodsId=this.goodsId;
          console.log( goodsImgObj.goodsImage)
          this.uploadList.push(goodsImgObj);
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
      handlePrev(){
        this.$emit('prevStep')
      },
      handleFinishCommit(){
        this.$emit('finishCommit',this.uploadList);
      }
    }
  }
</script>

<style scoped>

</style>
