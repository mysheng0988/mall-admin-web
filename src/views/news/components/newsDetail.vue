<template>
  <el-card class="form-container" shadow="never" >
    <el-form :model="newsData" :rules="rules" ref="newsDataFrom" label-width="150px">
      <el-form-item label="新闻标题：" prop="newsDataName">
        <el-input v-model="newsData.title"></el-input>
      </el-form-item>
      <el-form-item label="新闻摘要：">
        <el-input
          placeholder="请输入内容"
          type="textarea"
          v-model="newsData.abstractText"
          :autosize="{minRows:3,maxRows:8}" maxlength="300" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="新闻列表图片：">
        <el-upload
          action="/office/file/uploadimg/"
          name="image"
          list-type="picture-card"
          :headers="headers"
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
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100" height="100" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="是否启用">
         <el-switch v-model="newsData.state"
                    :active-value="0"
                    :inactive-value="1">

         </el-switch>
      </el-form-item>
      <el-form-item label="创建时间：" v-if="isEdit">
        <el-input v-model.number="newsData.createDate" readonly></el-input>
      </el-form-item>
      <el-form-item label="更新时间：" v-if="isEdit">
        <el-input v-model.number="newsData.updateDate" readonly></el-input>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input
          placeholder="请输入内容"
          type="textarea"
          v-model="newsData.comments"
          :autosize="{minRows:2,maxRows:6}"  maxlength="100" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="新闻内容">
          <quill-editor
            v-model="newsData.content"
            ref="myQuillEditor"
            :options="editorOption"
            style="height: 500px;"
          >
          </quill-editor>

      </el-form-item>
      <el-form-item style="margin-top: 80px">
        <el-button type="primary" @click="onSubmit('newsDataFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('newsDataFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
  import img from '@/components/common'
  import {deleteFile} from '@/api/oss'
  import {saveNews,getNewsById} from '@/api/newsData'
  import { addQuillTitle } from '@/utils/quill/quill-title'
  import { ImageExtend, QuillWatch } from '@/utils/quill/index'
  import {quillEditor, Quill} from 'vue-quill-editor'
  import { container } from '@/utils/quill/container'
  let Size = Quill.import('attributors/style/size')
  Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px','22px', '24px', '26px', '28px', '30px','32px']
  Quill.register(Size, true)

  // 自定义字体类型
  var fonts = ['SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong', 'Arial', 'Times-New-Roman', 'sans-serif']
  var Font = Quill.import('formats/font')
  Font.whitelist = fonts // 将字体加入到白名单
  Quill.register(Font, true)
  Quill.register('modules/ImageExtend', ImageExtend)
  const defaultNewsData={
    id: null,
    title:"",
    abstractText: "",
    state:true,
    imgPath:"",
    content:"",
    createDate:null,
    updateDate:null,
    comments:null,
  };
    export default {
      name: "newsDetail",
      components:{
        quillEditor
      },
      props: {
        isEdit: {
          type: Boolean,
          default: false
        }
      },
      data() {
        return {
          headers:{
            token:sessionStorage.getItem("token")
          },
          dialogVisible: false,
          dialogImageUrl:null,
          editorOption: {
            modules: {
              ImageExtend: {
                loading: true,  // 可选参数 是否显示上传进度和提示语
                name: 'image',  // 图片参数名
                size: 1,  // 可选参数 图片大小，单位为M，1M = 1024kb
                action: "office/file/uploadimg",  // 服务器地址, 如果action为空，则采用base64插入图片
                // response 为一个函数用来获取服务器返回的具体图片地址
                // 例如服务器返回{code: 200; data:{ url: 'baidu.com'}}
                // 则 return res.data.url
                response: (res) => {
                  console.log(res)
                  return "http://localhost:9090/office/image/" +res.data
                },
                headers: (xhr) => {
                  xhr.setRequestHeader('token','1457503CEEEE7F8D4A7802AB1C996D67')
                },  // 可选参数 设置请求头部
                start: () => {},  // 可选参数 自定义开始上传触发事件
                end: () => {},  // 可选参数 自定义上传结束触发的事件，无论成功或者失败
                error: () => {},  // 可选参数 自定义网络错误触发的事件
                change: (xhr, formData) => {} // 可选参数 选择图片触发，也可用来设置头部，但比headers多了一个参数，可设置formData
              },
              toolbar: {
                container: container,  // container为工具栏，此次引入了全部工具栏，也可自行配置
                handlers: {
                  'image': function () {  // 劫持原来的图片点击按钮事件
                    QuillWatch.emit(this.quill.id)
                  }
                }
              }
            }
          },
          newsData:Object.assign({},defaultNewsData),
          imageList: [],
          hideUpload:false,
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
      mounted(){
        addQuillTitle();
        if(this.isEdit){
          getNewsById(this.$route.query.id).then(res=>{
            if(res.code==0){
              this.newsData=res.data;
            }
          })
        }
      },
      methods:{
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

                saveNews(this.newsData).then(res => {
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

<style scoped>
  /deep/ .el-form-item__content {
    line-height: 24px;
  }
</style>
