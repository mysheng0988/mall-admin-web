<template>
  <div >
    <el-card class="login-form-layout" >
      <el-form autoComplete="on"
               :model="loginForm"
               :rules="loginRules"
               ref="loginForm"
               label-position="left">
        <div style="text-align: center">
          <svg-icon icon-class="login-mall" style="width: 56px;height: 56px;color: #409EFF"></svg-icon>
        </div>
        <h2 class="login-title color-main">mall-admin-web</h2>
        <el-form-item prop="phone">
          <el-input name="phone"
                    type="text"
                    v-model="loginForm.phone"
                    autoComplete="on"
                    placeholder="请输入用户名">
          <span slot="prefix">
            <svg-icon icon-class="phone" class="color-main"></svg-icon>
          </span>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input name="password"
                    :type="pwdType"
                    @keyup.enter.native="handleLogin"
                    v-model="loginForm.password"
                    autoComplete="on"
                    placeholder="请输入密码">
          <span slot="prefix">
            <svg-icon icon-class="password" class="color-main"></svg-icon>
          </span>
            <span slot="suffix" @click="showPwd">
            <svg-icon :icon-class="eye" class="color-main"></svg-icon>
          </span>
          </el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 10px">
          <el-button style="width: 100%" type="primary" :loading="loading" @click.native.prevent="handleLogin">
            用户登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <img :src="login_center_bg" class="login-center-layout">
    <div class="position">Copyright © 2019-2022 <a href="http://www.beian.miit.gov.cn">京ICP备19045611号-1</a></div>
  </div>
</template>

<script>
  import {validatePhone} from '@/utils/validate';
  import login_center_bg from '@/assets/images/login_center_bg.png'

  export default {
    name: 'login',
    data() {
      const validateUserPhone = (rule, value, callback) => {
        if (!validatePhone(value)) {
          callback(new Error('请输入正确手机号'))
        } else {
          callback()
        }
      };
      const validateUserName=(rule, value, callback) => {
        if (value.length<2) {
          callback(new Error('用户名称不能小于四位'))
        } else {
          callback()
        }
      };
      const validatePass = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('密码不能小于六位'))
        } else {
          callback()
        }
      };
      return {
        loginForm: {
          phone: '',
          password: '',
        },
        regForm: {
          loginName: '',
          phoneNum:'',
          password: '',
          repeatPassWord:''
        },
        loginRules: {
          phone: [{required: true, trigger: 'blur', validator: validateUserPhone}],
          password: [{required: true, trigger: 'blur', validator: validatePass}]
        },
        loading: false,
        pwdType: 'password',
        eye:'eye',
        login_center_bg
      }
    },
    methods: {
      showPwd() {
        if (this.pwdType === 'password') {
          this.eye='eyes'
          this.pwdType = ''
        } else {
          this.eye='eye'
          this.pwdType = 'password'
        }
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {

          if (valid) {

            this.loading = true;
            this.$store.dispatch('Login', this.loginForm).then((res) => {

              if(res.code==0){
                this.loading = false;
                this.$router.push({path: '/'})
              }else{
                this.$message.error(res.msg);
              }
            }).catch(() => {
              this.loading = false
            })
          } else {
            console.log('参数验证不合法！');
            return false
          }
        })
      }
    }
  }
</script>

<style scoped>

  .login-form-layout {
    position: absolute;
    left: 0;
    right: 0;
    width: 360px;
    margin: 140px auto;
    padding: 0;
    border-top: 10px solid #409EFF;
  }
  .login-title {
    text-align: center;
  }
  .login-center-layout {
    background: #409EFF;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    margin-top: 200px;
  }
  .position{
    width: 100%;
    position: fixed;
    bottom: 20px;
    left: 0;
    text-align: center;
  }
  .position a:hover{
    color: #409EFF;
    text-decoration:underline;
  }
</style>
