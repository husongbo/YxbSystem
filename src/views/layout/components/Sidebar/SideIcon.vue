<template>
  <!-- eslint-disable vue/require-component-is-->
  <div>
    <div style="text-align: center ; background-color:#304156;padding: 6px 0 ">
      <img :src="loginPic" :width="iconWidthAndHeight" :height="iconWidthAndHeight" alt="">
      <!--<h6>中油北斗互动营销平台</h6>-->
      <div v-if="showTitle">
        <el-tag style="
    height: 32px;
    border: none;
    background: none;
    line-height: 30px;
    font-size: 14px;
    color: #fdfdfd;">{{titleLine}}
        </el-tag>
      </div>

    </div>
    <!--<el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
      <el-radio-button :label="false">展开</el-radio-button>
      <el-radio-button :label="true">收起</el-radio-button>
    </el-radio-group>-->
  </div>
</template>

<script>
  // import { isExternal } from '@/utils'
  import loginPic from '@/assets/images/zsylogo-login.png'

  export default {
    props: {
      collapse: Boolean,
    },
    data() {
      return {
        showTitle: true,
        titleLine: "中油北斗互动营销平台",
        iconWidthAndHeight: 56,
        openedMenus: true,
        loginPic: loginPic + '?' + +new Date(),
      }
    },
    watch: {
      collapse(value) {
        if (value) {
          this.iconWidthAndHeight = 20
          this.showTitle = false
        } else {
          this.iconWidthAndHeight = 56
          this.showTitle = true
        }
      }
    },
    created() {
      console.log(this.collapse)
    },
    methods: {}
  }
</script>
