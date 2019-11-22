<template>
  <div class="app-container">
    <el-row class="header navbar bg-white shadow">
      <!--<div class="btn-group tool-button mt5">
        <el-cascader
          style="width: 100%"
          tabindex="1"
          :options="options"
          :show-all-levels="false"
          v-model="parentUnit"
          :fetch-suggestions="unitQuery"
          @active-item-change="unitChange"
          @change="unitChange2"
          @select="unitSelect"
          placeholder="请选择单位"
        ></el-cascader>
      </div>
      <div class="btn-group tool-button mt5">
        <el-input placeholder="请输入内容" v-model="pageForm.searchKeyword" @keyup.enter.native="doSearch">
          <el-select v-model="pageForm.searchName" slot="prepend" placeholder="查询类型" style="width: 120px;">
            <el-option label="用户名" value="loginname"></el-option>
            <el-option label="姓名" value="username"></el-option>
            <el-option label="手机" value="mobile"></el-option>
            <el-option label="邮箱" value="email"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="doSearch"></el-button>
        </el-input>
      </div>-->
      <div class="pull-right offscreen-right mt5">
        <el-button size="medium" @click="openAdd"><i class="ti-plus"/> 新建用户</el-button>
        <!--<el-dropdown @command="batchCommand">
          <el-button size="medium">
            批量操作
            <span class="ti-angle-down"></span>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="{type:'delete'}">
              批量删除
            </el-dropdown-item>
            <el-dropdown-item :command="{type:'export'}">
              导出XLS
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>-->
      </div>
    </el-row>
    <el-row class="el-table-container">
      <el-table
        :data="tableData"
        size="small"
        header-align="center"
        style="width: 100%"
        @sort-change="pageOrder"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="35"/>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left" inline class="el-table-expand" size="mini">
              <el-form-item label="Email">
                <span>{{ scope.row.user_eamil }}</span>
              </el-form-item>
              <!--<el-form-item label="最后登录时间">
                            <span>
                                {{ formatAt(scope.row.loginAt) }}</span>
              </el-form-item>-->
              <el-form-item label="手机号">
                <span>{{ scope.row.user_phone }}</span>
              </el-form-item>
              <!--<el-form-item label="最后登录IP">
                <span>{{ scope.row.loginIp }}</span>
              </el-form-item>-->
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          sortable
          prop="user_name"
          label="用户名"
          header-align="center"/>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="user_real_name"
          label="姓名"
          header-align="center"/>
        <el-table-column
          :show-overflow-tooltip="false"
          prop="user_eamil"
          label="用户邮箱"
          header-align="center"/>
        <el-table-column
          :show-overflow-tooltip="false"
          prop="user_phone"
          label="手机号"
          header-align="center"/>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="role_zh_name"
          label="角色"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <span>
              {{ scope.row.role_zh_name }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          sortable
          prop="user_status"
          label="账号状态"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <i v-if="scope.row.user_status !== 1" class="fa fa-circle text-danger ml5"/>
            <i v-if="scope.row.user_status === 1" class="fa fa-circle text-success ml5"/>
          </template>
        </el-table-column>
        <!--<el-table-column
          sortable
          prop="userOnline"
          label="在线状态"
          header-align="center"
          align="center"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <i v-if="scope.row.userOnline" class="text-success ml5">在线</i>
            <i v-if="!scope.row.userOnline" class="text-danger ml5">离线</i>
          </template>
        </el-table-column>-->
        <el-table-column
          prop="userOnline"
          label="操作"
          width="120">
          <template slot-scope="scope">
            <el-dropdown @command="dropdownCommand">
              <el-button size="mini">
                <i class="ti-settings"/>
                <span class="ti-angle-down"/>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{type:'role',id:scope.row.id, roleId: scope.row.user_role_id,loginname:scope.row.user_real_name}">
                  查看权限
                </el-dropdown-item>
               <!-- <el-dropdown-item :command="{type:'reset',id:scope.row.id,loginname:scope.row.user_real_name}">
                  重置密码
                </el-dropdown-item>-->
                <!--<el-dropdown-item :command="{type:'enable',id:scope.row.id,row:scope.row}" divided>
                  启用
                </el-dropdown-item>
                <el-dropdown-item :command="{type:'disable',id:scope.row.id,row:scope.row}">
                  禁用
                </el-dropdown-item>-->
                <el-dropdown-item :command="{type:'edit',data: scope.row}" divided>
                  修改
                </el-dropdown-item>
               <!-- <el-dropdown-item
                  v-if="scope.row.loginname!='superadmin'"
                  :command="{type:'delete',id:scope.row.id,loginname:scope.row.user_real_name}">
                  删除
                </el-dropdown-item>-->
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row class="el-pagination-container">
      <el-pagination
        :current-page="pageForm.pageNum"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageForm.pageSize"
        :total="totalCount"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="pageSizeChange"
        @current-change="pageNumberChange"/>
    </el-row>
    <!--新建用户-->
    <el-dialog
      :visible.sync="addDialogVisible"
      title="新建用户"
      width="40%">
      <el-form ref="addForm" :model="formData" :rules="formRules" size="small" label-width="80px">
        <!--<el-form-item class="is-required" prop="parentUnit" label="所属单位" label-width="80px">
          <el-cascader
            style="width: 100%"
            tabindex="1"
            :options="options"
            :show-all-levels="false"
            v-model="parentUnit"
            :fetch-suggestions="unitQuery"
            @active-item-change="unitChange"
            @change="unitChange2"
            @select="unitSelect"
            placeholder="请选择单位"
          ></el-cascader>
        </el-form-item>-->

        <el-form-item prop="ms_login_name" label="用户名">
          <el-input
            v-model="formData.ms_login_name"
            maxlength="100"
            placeholder="用户名"
            auto-complete="off"
            tabindex="2"
            clearable
            type="text"/>
        </el-form-item>
        <el-form-item prop="ms_real_name" label="姓名">
          <el-input
            v-model="formData.ms_real_name"
            maxlength="20"
            placeholder="姓名"
            auto-complete="off"
            tabindex="3"
            clearable
            type="text"/>
        </el-form-item>
        <el-form-item prop="ms_login_password" label="登录密码">
          <el-input
            v-model="formData.ms_login_password"
            maxlength="20"
            clearable
            placeholder="登录密码"
            auto-complete="off"
            tabindex="4"
            type="password"/>
        </el-form-item>
        <el-form-item prop="passwordAgain" label="确认密码">
          <el-input maxlength="20" placeholder="再输一次密码"
                    v-model="formData.passwordAgain"
                    auto-complete="off" tabindex="5" type="password"></el-input>
        </el-form-item>
        <el-form-item prop="ms_phone" label="手机号码">
          <el-input
            v-model="formData.ms_phone"
            maxlength="20"
            placeholder="手机号码"
            auto-complete="off"
            tabindex="6"
            clearable
            type="text"/>
        </el-form-item>
        <el-form-item prop="ms_role_id" label="角色">
          <el-select v-model="formData.ms_role_id" clearable placeholder="请选择" @change="changeRole">
            <el-option
              v-for="item in rolesOptions"
              :key="item.id"
              :label="item.role_zh_name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="showRoleSelect" prop="addstore_name" label="商户平台">
          <el-select v-model="formData.ms_merchant_id" clearable placeholder="选择商户平台">
            <el-option v-for="item in merchantList" :key="item.balance_id" :label="item.balance_merchant"
                       :value="item.balance_id"/>
          </el-select>
        </el-form-item>
        <el-form-item prop="ms_email" label="单位邮箱">
          <el-input
            v-model="formData.ms_email"
            maxlength="100"
            placeholder="单位邮箱"
            auto-complete="off"
            tabindex="7"
            type="text"/>
        </el-form-item>
        <el-form-item prop="ms_status" label="启用状态">
          <el-switch
            v-model="formData.ms_status"
            active-value="1"
            inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ccc"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doAdd">确 定</el-button>
      </span>
    </el-dialog>
    <!--新建用户-->

    <!--编辑用户-->
    <el-dialog
      :visible.sync="editDialogVisible"
      title="编辑用户"
      width="40%">
      <el-form ref="editForm" :model="formData" :rules="editRules" size="small" label-width="80px">

        <el-form-item prop="ms_login_name" label="用户名">
          {{ formData.ms_login_name }}
        </el-form-item>

        <el-form-item prop="ms_real_name" label="姓名">
          <el-input
            v-model="formData.ms_real_name"
            maxlength="20"
            placeholder="姓名"
            auto-complete="off"
            tabindex="3"
            clearable
            type="text"/>
        </el-form-item>
        <el-form-item prop="ms_phone" label="手机号码">
          <el-input
            v-model="formData.ms_phone"
            maxlength="20"
            placeholder="手机号码"
            auto-complete="off"
            tabindex="6"
            clearable
            type="text"/>
        </el-form-item>
        <el-form-item prop="ms_role_id" label="角色">
          <el-select v-model="formData.ms_role_id" placeholder="请选择" filterable clearable @change="changeRole">
            <el-option
              v-for="item in rolesOptions"
              :key="item.id"
              :label="item.role_zh_name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="showRoleSelect" prop="addstore_name" label="商户平台">
        <el-select v-model="formData.ms_merchant_id" clearable placeholder="选择商户平台">
          <el-option v-for="item in merchantList" :key="item.balance_id" :label="item.balance_merchant"
                     :value="item.balance_id"/>
        </el-select>
        </el-form-item>
        <el-form-item prop="ms_email" label="单位邮箱">
          <el-input
            v-model="formData.ms_email"
            maxlength="100"
            placeholder="单位邮箱"
            auto-complete="off"
            tabindex="7"
            clearable
            type="text"/>
        </el-form-item>
        <el-form-item prop="ms_status" label="启用状态">
          <el-switch
            v-model="formData.ms_status"
            active-value="1"
            inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ccc"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doEdit">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑用户-->

    <!--查看用户权限--start-->
    <el-dialog
      :title="roleDialogTitle"
      :visible.sync="roleDialogVisible"
      append-to-body
      width="70%">
      <!--<el-row style="margin-bottom: 3px;">
        <el-button size="small" @click="menuRoleSelAll">全选</el-button>
        <el-button size="small" @click="menuRoleSelClear">清空</el-button>
      </el-row>-->
      <!--分配权限树形结构 check-strictly = true  显示复选框的情况下，是否严格的遵循父子不互相关联的做法-->
      <el-tree
        ref="doMenuTree"
        :data="doMenuData"
        :props="defaultProps"
        :default-expanded-keys="defaultOpen"
        show-checkbox
        node-key="id"
      >
        <span slot-scope="scope" class="custom-tree-node">
          <span>{{ scope.node.label }}</span>
          <span>
            <span v-if="scope.data.type=='meun'" style="font-weight: bold">菜单权限 </span>
            <!--<span style="font-weight: bold">菜单权限 </span>-->
            <span v-if="scope.data.type=='data'">数据权限 </span>
          </span>
        </span>
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible = false">取 消</el-button>
        <!--<el-button type="primary" @click="doMenu">确 定</el-button>-->
      </span>
    </el-dialog>


    <!--查看用户权限--end-->
    <!--<el-dialog
      :title="roleDialogTitle"
      :visible.sync="roleDialogVisible"
      width="70%">
      <el-table :data="roleTreeData" style="width: 100%" :row-style="treeTableShowTr" size="small"
                :highlight-current-row="true">
        <el-table-column label="菜单名称" header-align="center" prop="name"
                         width="200" :show-overflow-tooltip="true" align="left">
          <template slot-scope="scope">
            <span v-for="(space, levelIndex) in treeTablePath(scope.row.path)" class="ms-tree-space"></span>
            <span v-if="treeTableIconShow(scope.row)" @click="treeTableChild(scope.row.id)"
                  style="cursor: pointer">
                        <span v-if="!scope.row.expanded"
                              class="el-tree-node__expand-icon el-icon-caret-right" title="展开"></span>

                        <span v-if="scope.row.expanded"
                              class="el-tree-node__expand-icon el-icon-caret-right expanded" title="关闭"></span>
                    {{ scope.row.name }}
                    </span>
            <span v-if="!treeTableIconShow(scope.row)">
                         <span class="ms-tree-space"></span>
                        {{ scope.row.name }}
                    </span>
          </template>
        </el-table-column>

        <el-table-column label="URL" header-align="center" prop="href"
                         :show-overflow-tooltip="true">
        </el-table-column>

        <el-table-column label="资源类型" header-align="center" prop="type"
                         :show-overflow-tooltip="true" align="center">

          <template slot-scope="scope">
            <i v-if="scope.row.type=='menu'" style="font-weight: bold">菜单</i>
            <i v-if="scope.row.type=='data'">数据</i>
          </template>
        </el-table-column>

        <el-table-column label="权限标识" header-align="center" prop="permission"
                         :show-overflow-tooltip="true">
        </el-table-column>

      </el-table>
      <span slot="footer" class="dialog-footer">
                    <el-button @click="roleDialogVisible = false">关 闭</el-button>
                  </span>
    </el-dialog>-->
  </div>
</template>
<script>
import Vue from 'vue'
import { fetchUserList, SubMitUserInfo, getRoleList, fetchRolePower } from '@/api/systemManage'
import { getMerchantList } from '@/api/balanceManage'
export default {
  name: 'Users',
  data() {
    var self = this
    var validateLoginname = function(rule, value, callback) {
      var regex = new RegExp('^[a-zA-Z][a-zA-Z0-9_]{1,19}$')
      if (!regex.test(value)) {
        callback(new Error('用户名以字母开头2-20字,允许使用字母/数字/下划线'))
      } else {
        callback()
      }
    }
    var validatePass = function(rule, value, callback) {
      if (value !== self.formData.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var validateUnit = function(rule, value, callback) {
      if (self.parentUnit.length < 1 || self.parentUnit[self.parentUnit.length - 1] == '') {
        callback(new Error('请选择所属单位!'))
      } else {
        callback()
      }
    }
    return {
      base: 'https://nutzwk.wizzer.cn',
      addDialogVisible: false,
      editDialogVisible: false,
      roleDialogVisible: false,
      treeData: {
        label: 'name',
        children: 'zones',
        id: 'id',
        isLeaf: 'leaf'
      },
      rolesOptions: [],
      tableData: [],
      options: [],
      parentUnit: [],
      defaultOpen: [],
      merchantList: [],
      totalCount: '',
      showRoleSelect: false,
      pageFormRoleList: {
        pageNum: 1,
        pageSize: 1000,
        dataType: 1
        // importance: undefined,
        // title: undefined,
        // type: undefined,
        // sort: '+id'
      },
      pageForm: {
        pageNum: 1,
        pageSize: 10,
        dataType: 1
        // importance: undefined,
        // title: undefined,
        // type: undefined,
        // sort: '+id'
      },
      doMenuData: [],
      defaultProps: {
        // children: 'children',
        children: 'meun_children_power_list',
        // label: 'label'
        label: 'meun_zh_name',
        disabled: true
      },
      userRowData: {},
      /* pageForm: {
          searchUnit: "",
          searchName: "",
          searchKeyword: "",
          pageNumber: 1,
          pageSize: 10,
          totalCount: 0,
          pageOrderName: "",
          pageOrderBy: ""
        },*/
      formData: {
        // id: '',
        // unitid: '',
        // disabled: false
        ms_id: '',
        ms_status: '',
        ms_login_password: '',
        passwordAgain:'',
        ms_login_name: '',
        ms_real_name: '',
        ms_phone: '',
        ms_email: '',
        ms_role_id: '',
        ms_merchant_id: '' // 商户平台
        // ms_type: '',
        // ms_create_time: ''
      },
      formRules: {
        parentUnit: [
          // {validator: validateUnit, trigger: ['blur', 'change'] }
        ],
        ms_login_name: [
          { required: true, message: '请输入登录用户名', trigger: ['blur', 'change'] },
          { min: 3, max: 10, message: '用户名长度必须是3-10位', trigger: 'change' }
        ],
        ms_real_name: [
          { required: true, message: '请输入姓名', trigger: ['blur', 'change'] }
        ],
        ms_role_id: [
          { required: true, message: '请选择角色', trigger: ['change'] }
        ],
        ms_email: [
          { required: false, message: '请输入邮箱地址', trigger: ['blur', 'change'] },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        ms_phone: [
          { required: true, message: '请输入手机号码', trigger: ['blur', 'change'] },
          { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码' }
        ],
        ms_login_password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 8, message: '密码长度必须是6-8位', trigger: 'change' }
        ],
        passwordAgain: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' }
           // {validator: validatePass, trigger: 'change' }
        ]
      },
      editRules: {
        ms_real_name: [
          { required: true, message: '请输入姓名', trigger: ['blur', 'change'] }
        ],
        ms_email: [
          { required: false, message: '请输入邮箱地址', trigger: ['blur', 'change'] },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        ms_phone: [
          { required: true, message: '请输入手机号码', trigger: ['blur', 'change'] },
          { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码' }
        ]
      },
      roleDialogTitle: '查看用户权限',
      roleTableData: [], // treeTable后台取出的数据
      roleTreeData: [], // treeTable格式化用于显示的数据
      userId: '', // 当前用户ID
      multipleSelection: []

    }
  },
  computed: {
    filterRole(status) {
      let roleName = '无'
      this.rolesOptions.forEach(obj => {
        if (obj.id == status) {
          roleName = obj.role_zh_name
        }
      })
      return roleName
    }
  },
  created: function() {
    this.rolesList()
    this.doMenuLoad()
    this.initTree()
    this.pageData()
    this.getMerchantList()
  },
  methods: {
    changeRole(item){
      if(item==6){
        this.showRoleSelect=true
      }else {
        this.showRoleSelect=false
      }

    },
    getMerchantList() {
      this.listLoading = true
      getMerchantList({}).then(response => {
        this.merchantList = response.data.data
        // Just to simulate the time of the request
      })
    },
    // 分配权限菜单 全部菜单数据
    doMenuLoad: function() {
      var self = this
      $.get('http://gwtest.youxinbao.com.cn/Public/GetMeunLIst', function(data) {
        if (data.result === '0') {
          self.doMenuData = data.data.meun_power_list
        }
      }, 'json')
      // self.doMenuData = mockData.roleMenu.data.menu
      // self.doMenuCheckedData = mockData.roleMenu.data.cmenu
      // 默认设置
    },
    // 获取角色已有的权限
    openNowFetch(roleId) {
      var self = this
      self.defaultOpen = []
      // 权限列表
      fetchRolePower({
        role_id: roleId
      }).then((res) => {
        console.log(res)
        if (res.data.result === '0') {
          var ids = res.data.data.join(',').split(',')
          console.log(ids)
          self.poserIds = ids
          self.$nextTick(() => {
            console.log('nowids: ' + self.poserIds)
            console.log(self.$refs['doMenuTree'])
            self.$refs['doMenuTree'].setCheckedKeys(self.poserIds)
            self.defaultOpen = self.poserIds
          })
        } else {
          self.$notify({
            title: '提示',
            message: '获取数据失败，请重试',
            type: 'warning',
            duration: 2000
          })
        }
      })
    },
    // 级联选择器从后台动态获取下级数据
    loadTree: function(val, cb) {
      var url = this.base + '/platform/sys/unit/tree'
      $.post(url, { pid: val }, function(data) {
        if (data.code == 0) {
          cb(data.data)
        }
      }, 'json')
    },
    initTree: function() {
      var self = this
      this.loadTree('', function(val) {
        self.options = val
      })
    },
    unitQuery: function(queryString, cb) {
      cb(this.options)
    },
    unitSelect: function(val) {
    },
    unitTree: function(table, data, pid) { // 树形数据的级联查找很是头疼
      var self = this
      table.findIndex(function(obj) {
        if (pid == obj.value) {
          obj.children = data
        } else if (obj.children && obj.children.length > 0) {
          self.unitTree(obj.children, data, pid)
        }
      })
    },
    unitChange2: function(val) {
      var self = this
      if (val[0] == 'root') {
        self.parentUnit = []
      }
    },
    unitChange: function(val) {
      var self = this
      self.parentUnit = val
      var pid = val[val.length - 1]
      this.loadTree(pid, function(tree) {
        self.unitTree(self.options, tree, pid)
      })
    }, pageOrder: function(column) { // 按字段排序
      // this.pageForm.pageOrderName = column.prop
      // this.pageForm.pageOrderBy = column.order
      this.pageData()
    },
    pageNumberChange: function(val) { // 页码更新操作
      this.pageForm.pageNum = val
      this.pageData()
    },
    pageSizeChange: function(val) { // 分页大小更新操作
      this.pageForm.pageSize = val
      this.pageData()
    },
    rolesList: function() {
      const self = this
      getRoleList(self.pageFormRoleList).then((res) => {
        if (res.data.result === '0') {
          self.rolesOptions = res.data.data
          // self.pageForm.totalCount = res.data.total_count
        } else {
          self.$notify({
            title: '提示',
            message: '查询列表失败',
            type: 'warning',
            duration: 2000
          })
        }
      })
    },
    pageData: function() { // 加载分页数据
      var self = this
      // sublime.showLoadingbar() // 显示loading
      // fetchUserList

      fetchUserList(self.pageForm).then((res) => {

        if (res.data.result === '0') {
          self.tableData = res.data.data
          self.tableData.forEach(obj => {
            self.rolesOptions.forEach(roleIdObj => {
              if (roleIdObj.id == obj.user_role_id) {
                obj.role_zh_name = roleIdObj.role_zh_name
              }
            })
          })
          self.totalCount = res.data.total_count
        } else {
          this.$notify({
            title: '提示',
            message: '查询列表失败',
            type: 'warning',
            duration: 2000
          })
        }
      })
      /* $.post(this.base + "/platform/sys/user/data", self.pageForm, function (data) {
          sublime.closeLoadingbar() // 关闭loading
          if (data.code == 0) {
            self.tableData = data.data.list
            self.pageForm.totalCount = data.data.totalCount
          } else {
            self.$message({
              message: data.msg,
              type: 'error'
            });
          }
        }, "json");*/
    },
    formatAt: function(val) {
      if (val > 0) { return moment(val * 1000).format('YYYY-MM-DD HH:mm') }
      return ''
    },
    doSearch: function() {
      this.pageForm.searchUnit = this.parentUnit[this.parentUnit.length - 1]
      this.pageForm.pageNumber = 1
      this.pageData()
    },
    openAdd: function() {
      var self = this
      this.addDialogVisible = true
      this.formData = {}// 打开新增窗口,表单先清空
      if (this.$refs['addForm']) { this.$refs['addForm'].resetFields() }
    },
    // 创建用户
    doAdd: function() {
      var self = this
      console.log(self.formData)
      if(self.formData.ms_login_password==self.formData.passwordAgain) {
        self.$refs['addForm'].validate(function (valid) {
          if (valid) {
            // self.formData.unitid = self.parentUnit[self.parentUnit.length - 1]||"";
            // self.formData.ms_status = self.formData.ms_status ? 1 : 0
            console.log(self.formData.ms_status)
            SubMitUserInfo({
              method: 'add', // add
              model_info: self.formData
            }).then((res) => {
              if (res.data.result === '0') {
                self.$message({
                  showClose: true,
                  message: '添加成功',
                  type: 'success'
                })
                self.addDialogVisible = false
                self.pageData()
              } else {
                self.$message({
                  showClose: true,
                  message: '添加失败，请重试',
                  type: 'warning'
                })
              }
            })

            /* $.post(self.base + "/platform/sys/user/addDo", self.formData, function (data) {
              if (data.code == 0) {
                self.$message({
                  message: data.msg,
                  type: 'success'
                });
                self.doSearch();//查询是带条件的,加载新建用户选择的单位用户数据
                //self.pageData();
                self.addDialogVisible = false;
              } else {
                self.$message({
                  message: data.msg,
                  type: 'error'
                });
              }
            }, "json");*/
          }
        })
      }
      else{
        self.$message({
          showClose: true,
          message: '密码不一致，请重新填写',
          type: 'warning'
        })
      }
    },
    doEdit: function() {
      var self = this

      self.$refs['editForm'].validate(function(valid) {
        if (valid) {
          // self.formData.ms_status = self.formData.ms_status ? 1 : 0
          SubMitUserInfo({
            method: 'edit', // add
            model_info: self.formData }).then((res) => {
            if (res.data.result === '0') {
              self.editDialogVisible = false
              self.$message({
                showClose: true,
                message: '修改用户信息成功',
                type: 'success'
              })
              self.pageData()
            } else {
              self.$message({
                showClose: true,
                message: '修改信息失败，请重试',
                type: 'warning'
              })
            }
          })

          /* $.post(self.base + "/platform/sys/user/editDo", self.formData, function (data) {
              if (data.code == 0) {
                self.$message({
                  message: data.msg,
                  type: 'success'
                });
                self.doSearch();//查询是带条件的,加载新建用户选择的单位用户数据
                //self.pageData();
                self.editDialogVisible = false;
              } else {
                self.$message({
                  message: data.msg,
                  type: 'error'
                });
              }
            }, "json");*/
        }
      })
    },
    // 显示层级
    treeTablePath: function(path) {
      return path.length / 4 - 1
    },
    // 显示行
    treeTableShowTr: function(row, index) {
      var parentIndex = this.roleTreeData.findIndex(function(value) {
        return value.id === row.row.parentId
      })
      var show = (row.row.parentId ? (this.roleTreeData[parentIndex].expanded && this.roleTreeData[parentIndex]._show) : true)
      row.row._show = show
      return show ? '' : 'display:none;'
    },
    treeDataChildren: function(table, data, pid) { // 树形数据的级联查找很是头疼
      var self = this
      table.findIndex(function(obj) {
        if (pid == obj.id) { // 找到这条数据追加下级数据
          obj.children = data
          obj.expanded = !obj.expanded
        } else if (obj.children && obj.children.length > 0) {
          self.treeDataChildren(obj.children, data, pid)
        }
      })
    },
    // 展开下级
    treeTableChild: function(pid) {
      var self = this
      var url = self.base + '/platform/sys/user/menu/' + self.userId
      $.post(url, { pid: pid }, function(data) {
        if (data.code == 0) {
          if (pid != undefined && pid != '') {
            self.treeDataChildren(self.roleTableData, data.data, pid)
          } else {
            self.roleTableData = data.data
          }
          self.roleTreeData = sublime.treeToArray(self.roleTableData)
        }
      }, 'json')
    },
    // 点击展开和关闭的时候，图标的切换
    treeTableIconShow: function(record) {
      return record.hasChildren
    },
    dropdownCommand: function(command) { // 监听下拉框事件
      var self = this
      if (command.type == 'role') {
        self.roleDialogVisible = true
        self.roleDialogTitle = '查看用户 ' + command.loginname + ' 的权限'
        self.userId = command.id
        self.treeTableChild('')
        self.openNowFetch(command.roleId) // 获取已选中角色数
      }
      if (command.type == 'reset') {
        self.$confirm('确定重置用户 ' + command.loginname + ' 的密码', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          callback: function(a, b) {
            if (a == 'confirm') { // 确认后再执行
              $.post(self.base + '/platform/sys/user/resetPwd/' + command.id, {}, function(data) {
                if (data.code == 0) {
                  self.$alert('新密码为 ' + data.data, '新密码', {
                    confirmButtonText: '确定'
                  })
                } else {
                  self.$message({
                    message: data.msg,
                    type: 'error'
                  })
                }
              }, 'json')
            }
          }
        })
      }
      if (command.type == 'enable' || command.type == 'disable') {
        $.post(self.base + '/platform/sys/user/' + command.type + '/' + command.id, {}, function(data) {
          if (data.code == 0) {
            self.$message({
              message: data.msg,
              type: 'success'
            })
            if (command.type == 'disable') {
              command.row.disabled = true
            }
            if (command.type == 'enable') {
              command.row.disabled = false
            }
          } else {
            self.$message({
              message: data.msg,
              type: 'error'
            })
          }
        }, 'json')
      }
      if (command.type == 'edit') {
        self.editDialogVisible = true // 打开编辑窗口
        self.formData.ms_status = command.data.user_status.toString()
        self.formData.ms_login_name = command.data.user_name
        self.formData.ms_real_name = command.data.user_real_name
        self.formData.ms_phone = command.data.user_phone
        self.formData.ms_role_id = command.data.user_role_id
        self.formData.ms_email = command.data.user_eamil
        self.formData.ms_id = command.data.id
        if( command.data.user_role_id == 6){
          self.showRoleSelect = true
          self.formData.ms_merchant_id = command.data.user_mechant_id
        }

        /* $.post(self.base + "/platform/sys/user/edit/" + command.id, {}, function (data) {
            if (data.code == 0) {
              self.formData = data.data;//加载后台表单数据
              self.editDialogVisible = true;//打开编辑窗口
            } else {
              self.$message({
                message: data.msg,
                type: 'error'
              });
            }
          }, "json");*/
      }
      if (command.type == 'delete') {
        self.$confirm('此操作将删除 ' + command.loginname, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          callback: function(a, b) {
            if (a == 'confirm') { // 确认后再执行
              $.post(self.base + '/platform/sys/user/delete/' + command.id, {}, function(data) {
                if (data.code == 0) {
                  self.$message({
                    message: data.msg,
                    type: 'success'
                  })
                  self.doSearch()
                } else {
                  self.$message({
                    message: data.msg,
                    type: 'error'
                  })
                }
              }, 'json')
            }
          }
        })
      }
    },
    batchCommand: function(command) {
      var self = this
      if (command.type == 'delete') {
        if (self.multipleSelection.length == 0) {
          self.$message({
            message: '请选择要删除的用户',
            type: 'warning'
          })
        } else {
          var loginnames = []
          var ids = []
          self.multipleSelection.forEach(function(val) {
            loginnames.push(val.loginname)
            ids.push(val.id)
          })
          self.$confirm('此操作将删除用户 ' + loginnames.toString(), '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            callback: function(a, b) {
              if (a == 'confirm') { // 确认后再执行
                $.post(self.base + '/platform/sys/user/delete', { ids: ids.toString() }, function(data) {
                  if (data.code == 0) {
                    self.$message({
                      message: data.msg,
                      type: 'success'
                    })
                    self.doSearch()
                  } else {
                    self.$message({
                      message: data.msg,
                      type: 'error'
                    })
                  }
                }, 'json')
              }
            }
          })
        }
      }
      if (command.type == 'export') {
        window.open(self.base + '/platform/sys/user/export?searchUnit=' + self.pageForm.searchUnit +
            '&searchName=' + self.pageForm.searchName +
            '&searchKeyword=' + self.pageForm.searchKeyword +
            '&pageOrderName=' + self.pageForm.pageOrderName +
            '&pageOrderBy=' + self.pageForm.pageOrderBy
        )
      }
    },
    handleSelectionChange: function(val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    }
  }
}
</script>
<style scoped>
  .text-success,
  .text-success a {
    color: #15db81;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
