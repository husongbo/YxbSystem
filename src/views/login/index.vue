<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <div class="title-container" style="margin-bottom: 20px">
        <img :src="loginPic" width="140" height="140" alt="Girl has dropped her ice cream.">
      </div>
      <div class="title-container">
        <h3 class="title">中油北斗互动营销平台管理系统</h3>
        <!--<lang-select class="set-language"/>-->
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          v-model="loginForm.username"
          :placeholder="$t('login.username')"
          name="username"
          type="text"
          auto-complete="on"
          class="inputs"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :type="passwordType"
          v-model="loginForm.password"
          :placeholder="$t('login.password')"
          name="password"
          auto-complete="on"
          class="inputs"
          @keyup.enter.native="handleLogin" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>

      <el-form-item prop="numCode">
        <el-input
          :type="numType"
          v-model="loginForm.validateCode"
          class="inputs"
          placeholder="输入验证码"
          name="numCode"
          auto-complete="on"
          @keyup.enter.native="handleLogin" />
        <span class="show-pwd" @click="reloadCode">
          <img :src="codeImg" alt="">
        </span>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:10px;" @click.native.prevent="handleLogin">{{ $t('login.logIn') }}</el-button>
      <div class="registeruser">
      <router-link to="/register" >
      <span  style="color: white;cursor: pointer;padding-bottom: 20px;font-size: 0.8rem;" class="registeruser">新用户注册</span>
      </router-link>
      </div>
      <div style="position:relative">
        <!--<div class="tips">
          <span>{{ $t('login.username') }} : admin</span>
          <span>{{ $t('login.password') }} : {{ $t('login.any') }}</span>
        </div>
        <div class="tips">
          <span style="margin-right:18px;">{{ $t('login.username') }} : editor</span>
          <span>{{ $t('login.password') }} : {{ $t('login.any') }}</span>
        </div>-->
        <!--<el-button class="thirdparty-button" type="primary" @click="showDialog=true">{{ $t('login.thirdparty') }}</el-button>-->
      </div>
    </el-form>
    <!--<el-dialog :title="$t('login.thirdparty')" :visible.sync="showDialog">
      {{ $t('login.thirdpartyTips') }}
      <br>
      <br>
      <br>
      <social-sign />
    </el-dialog>-->




  </div>

</template>
<script>
  import { isvalidUsername } from '@/utils/validate'
  import LangSelect from '@/components/LangSelect'
  import SocialSign from './socialsignin'
  import loginPic from '@/assets/images/zsylogo-login.png'





  export default {
    name: 'Login',
    components: { LangSelect, SocialSign },
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!isvalidUsername(value)) {
          callback(new Error('请输入正确的用户名！'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('密码长度6-8位'))
        } else {
          callback()
        }
      }
      return {
        loginPic: loginPic + '?' + +new Date(),
        dialogaddVisible:false,
        dialogaddVisibles:false,
        value1: 0,
        formLabelWidth:'120px',
        codeImg: 'http://gwtest.youxinbao.com.cn/Public/GetValidateCode',
        loginForm: {
          username: '',
          password: '',
          validateCode: ''
        },
        loginRules: {
          username: [{ required: true, trigger: 'blur', validator: validateUsername }],
          password: [{ required: true, trigger: 'blur', validator: validatePassword }]
        },
        passwordType: 'password',
        numType: 'text',
        loading: false,
        showDialog: false,
        redirect: undefined
      }
    },
    watch: {
      $route: {
        handler: function(route) {
          this.redirect = route.query && route.query.redirect
        },
        immediate: true
      }
    },
    created() {
      // window.addEventListener('hashchange', this.afterQRScan)
    },
    destroyed() {
      // window.removeEventListener('hashchange', this.afterQRScan)
    },
    methods: {
      reloadCode() {
        this.codeImg = 'http://gwtest.youxinbao.com.cn/Public/GetValidateCode?' + new Date().getTime()
      },
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
      },
      openregsiter(){
        // this.dialogaddVisible=true;
        //  this.$router.push({ path: '/abo/register' })
        // window.location.href="/#/register"
        // this.$router.history.current.path="/#/register"
        // console.log(this.$router.history.current.path)
      },
      nextregister(){
        this.dialogaddVisible=false;
        this.dialogaddVisibles=true;
      },
      handleLogin() {
        debugger
        // this.$router.push({ path: this.redirect || 'dashboard' })
        // this.$router.push({ path: '/' })
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('LoginByUsernameCode', this.loginForm).then((res) => {
              console.log(res)
              // this.loading = false
              // this.$router.push({ path: this.redirect || '/' })
              if(res.result === '0'){
                console.log("登录成功")
                localStorage.setItem('userpassword',this.loginForm.password)
                localStorage.setItem('userinfo',JSON.stringify(res.user_info))
                console.log("aa"+localStorage.getItem('userinfo'))
                sessionStorage.setItem('Login',"ok")
                this.$router.push({ path: this.redirect || '/' })
                // this.$router.push({ path: '/' })
              }else{
                this.$message.error(res.message);
              }
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
            this.$store.dispatch('LoginByUsernameCode', this.loginForm).then((res) => {
              debugger
              if (res.result === '0') {
                this.loading = false
                this.$router.push({ path: this.redirect || '/' })
              }
            }).catch(() => {
              this.loading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>
<style>
  .registeruser:hover{
    color: rgb(64,158,255)!important;
  }
</style>
<style rel="stylesheet/scss" lang="scss">

  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
  $bg:#283443;
  $light_gray:#eee;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input{
      &::first-line {
      }
    }
  }
  .block{
    width: 60%;
  }
  /* reset element-ui css */
  .login-container {
    .el-dialog__header{
      background: rgb(100,144,156);
      .el-dialog__title{
        color:white;
      }
      .el-dialog__close{
        color: white;
      }
    }
    .el-slider__runway{
      height: 40px;
    }
    .el-slider__runway{
      background: rgb(232,232,232);
      border:1px solid #ccc;
    }
    .el-slider__bar{
      height: 40px;
    }
    .el-slider__bar{
      height: 40px;
      width: 40px;
    }
    .el-slider__button{
      height: 40px;
      width: 30px;
      border: 1px solid #ccc;
      border-radius: 0;
    }
    .el-slider__button-wrapper{
      top: 0px;
      right:18px;
      /*left:18px!important;*/
    }

    .inputs {
      display: inline-block;
      height: 47px;
      width: 85%;
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;
        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss">
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  .login-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;
    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 160px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }
    .title-container {
      position: relative;
      text-align: center;
      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
      .set-language {
        color: #fff;
        position: absolute;
        top: 5px;
        right: 0px;
      }
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 11px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
    .thirdparty-button {
      position: absolute;
      right: 0;
      bottom: 6px;
    }
  }
  .login-container .el-form-item{
    /*background: white;*/
  }
  .foems{
    background: white;
  }
  .login-container .el-input input{
    /*height: 0px!important;*/
    color:white!important;
  }
  .demo1 {
    width: 48%;
    height: 100%;
    float: left;
    padding: 20px;
    border: 1px dashed #fff;
    border-radius: 4px;
    box-sizing: border-box;
    position: relative;
  }
  .btns,
  .slider,
  .result {
    margin-bottom: 40px;
  }
  #demo {
    width: 600px;
    margin: 150px auto;
    padding: 10px;
    border: 0px dashed #d5d4ff;
    border-radius: 10px;
    text-align: left;
  }

</style>
