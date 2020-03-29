<template>
  <div class="qccode">
    <vue-qr :text="text"
            colorDark="#000"
            colorLight="#fff"
            :dotScale="1"
            :logoSrc="icon"
            :logoScale="0.2"
            :size="size">
    </vue-qr>
    <div class="btn-box">
      <el-button
        class="button"
        icon="el-icon-download"
        @click="downloadImg()"
        type="primary" plain
        size="medium">
        下载二维码
      </el-button>
    </div>

  </div>


</template>

<script>

  import vueQr from 'vue-qr'
  export default {
    name: "qrcode",
    props: {
      qText:{
        type:String,
        default: '',
      },
      qTcon:{
        type:String,
        default: '',
      },
      qSize:{
        type:Number,
        default: 200,
      },
      dName:{
        type:String,
        default: '',
      },
    },
    components: {
      vueQr
    },
    computed: {
      text:function () {
        return this.qText;
      },
      icon:function () {
        return require('../../assets/images/timg.jpeg');
      },
      size:function () {
        return this.qSize;
      },
      downloadName:function () {
        return this.dName;
      }
    },
    methods:{
      downloadImg(){
        let oQrcode = document.querySelector('.qccode img')
        let url = oQrcode.src
        let a = document.createElement('a')
        let event = new MouseEvent('click')
        // 下载图名字
        a.download = this.downloadName;
        //url
        a.href = url
        //合成函数，执行下载
        a.dispatchEvent(event)
      }
    }
  }
</script>

<style scoped>
  .qccode{
    width: 100%;
    text-align: center;
  }
  .btn-box{
    width: 100%;
    text-align: center;
  }
  .button{
    width: 300px;
  }
</style>
