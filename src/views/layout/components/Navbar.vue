<template>
  <div class="navbar">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>

    <breadcrumb class="breadcrumb-container"/>

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <error-log class="errLog-container right-menu-item"/>

          <el-tooltip class="jue-se" content="当前用户" effect="dark" placement="bottom">
            <span class="jue-font">用户：{{username}}</span>
          </el-tooltip>

          <el-tooltip class="jue-se" content="当前角色" effect="dark" placement="bottom">
            <span class="jue-font">角色：{{roleName}}</span>
          </el-tooltip>

          <el-tooltip :content="$t('navbar.screenfull')" effect="dark" placement="bottom">
            <screenfull class="screenfull right-menu-item"/>
          </el-tooltip>


        <!-- <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">
          <size-select class="international right-menu-item"/>
        </el-tooltip>-->

        <!--<lang-select class="international right-menu-item"/>-->

        <el-tooltip :content="$t('navbar.theme')" effect="dark" placement="bottom">
          <theme-picker class="theme-switch right-menu-item"/>
        </el-tooltip>
      </template>

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <!--<img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">-->
          <img :src="loginPic" class="user-avatar">
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              {{ $t('navbar.dashboard') }}
            </el-dropdown-item>
          </router-link>
          <!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>
              {{ $t('navbar.github') }}
            </el-dropdown-item>
          </a>-->
          <el-dropdown-item divided>
            <span style="display:block;" @click="editpsd">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>

        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="修改密码"  :visible.sync="dialogaddVisible">
      <el-form  :model="info"    label-position="left" label-width="120px" style="width: 800px; margin-left:50px;">
        <el-form-item label="旧密码" prop="oil_coupon_price">
          <el-input type="password" style="width:200px;height: 36px;" size="small"  placeholder="请输入旧密码" v-model="info.oldpsd"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="oil_coupon_price">
          <el-input type="password" style="width:200px;height: 36px;" size="small"  placeholder="请输入新密码"  v-model="info.newpsd"></el-input>
        </el-form-item>
        <el-form-item label="再次输入新密码" prop="oil_coupon_price">
          <el-input type="password" style="width:200px;height: 36px;" size="small"  placeholder="请再次输入新密码"  v-model="info.newspsd"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogaddVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="changepsds">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import {mapGetters} from 'vuex'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'
  import ErrorLog from '@/components/ErrorLog'
  import Screenfull from '@/components/Screenfull'
  import SizeSelect from '@/components/SizeSelect'
  import LangSelect from '@/components/LangSelect'
  import ThemePicker from '@/components/ThemePicker'
  import loginPic from '@/assets/images/zsylogo-login.png'
  import { ChangePwd } from '@/api/login'
  export default {
    components: {
      Breadcrumb,
      Hamburger,
      ErrorLog,
      Screenfull,
      SizeSelect,
      LangSelect,
      ThemePicker
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'name',
        'avatar',
        'device'
      ])
    },
    data() {
      return {
        username: "",
        roleName: '',
        info:{
          oldpsd:'',
          newpsd:'',
          newspsd:''
        },
        infos:{
          user_name:'',
          old_user_pwd:'',
          new_user_pwd:''
      },
        dialogaddVisible:false,
        loginPic: loginPic + '?' + +new Date()
      }
    },
    mounted() {
      this.username = localStorage.getItem("username")
      this.roleName = localStorage.getItem("roleName")
    },
    methods: {
      toggleSideBar() {
        this.$store.dispatch('toggleSideBar')
      },
      logout() {
        this.$store.dispatch('LogOut').then(() => {
          location.reload()// In order to re-instantiate the vue-router object to avoid bugs
        })
      },
      editpsd(){
       this.dialogaddVisible=true;
      },
      changepsds(){
        console.log(this.info);
        if(this.info.newpsd===this.info.newspsd){
          var name=localStorage.getItem('username');
          this.infos.user_name=name
          this.infos.old_user_pwd=this.info.oldpsd
          this.infos.new_user_pwd=this.info.newpsd
          ChangePwd(this.infos).then((res) => {
            console.log(res)
            if (res.data.result === '0') {
              this.dialogaddVisible = false
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '提示',
                message: '添加失败',
                type: 'warning',
                duration: 2000
              })
            }
            this.info.newpsd=''
            this.info.newspsd=''
            this.info.oldpsd=''
          })
        }
        else{
          this.$message('请保证新密码一致!')
        }

      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;
    .hamburger-container {
      line-height: 58px;
      height: 50px;
      float: left;
      padding: 0 10px;
    }
    .breadcrumb-container {
      float: left;
    }
    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }
    .right-menu {
      float: right;
      height: 100%;
      &:focus {
        outline: none;
      }
      .jue-se{
        padding: 0 10px;
        .jue-font{
          height: 30px;
          line-height: 30px;
        }
      }
      .right-menu-item {
        display: inline-block;
        margin: 0 8px;
      }
      .screenfull {
        height: 20px;
      }
      .international {
        vertical-align: top;
      }
      .theme-switch {
        vertical-align: 15px;
      }
      .avatar-container {
        height: 50px;
        margin-right: 30px;
        .avatar-wrapper {
          margin-top: 5px;
          position: relative;
          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }
          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
