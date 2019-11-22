<template>
  <div class="app-container">
    <!--<el-row class="header navbar bg-white shadow">
      <div class="btn-group tool-button mt5">
        <el-cascader
          :options="options"
          :show-all-levels="false"
          :fetch-suggestions="unitQuery"
          v-model="parentUnit"
          style="width: 100%"
          tabindex="1"
          placeholder="请选择单位"
          @active-item-change="unitChange"
          @change="unitChange2"
          @select="unitSelect"/>
      </div>
      <div class="btn-group tool-button mt5">
        <el-input placeholder="请输入内容" v-model="pageForm.searchKeyword" @keyup.enter.native="doSearch">
          <el-select v-model="pageForm.searchName" slot="prepend" placeholder="查询类型" style="width: 120px;">
            <el-option label="角色名称" value="name"></el-option>
            <el-option label="角色标识" value="code"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="doSearch"></el-button>
        </el-input>
      </div>
      <div class="pull-right offscreen-right mt5">
        <el-button size="medium" @click="openAdd"><i class="ti-plus"></i> 新建角色</el-button>
      </div>
    </el-row>-->
    <el-row class="el-table-container">
      <!--权限列表-->
      <el-table
        :data="tableData"
        size="small"
        header-align="center"
        style="width: 100%"
        @sort-change="pageOrder"
      >
        <el-table-column
          sortable
          prop="role_zh_name"
          label="角色名称"
          header-align="center"/>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="role_en_name"
          label="角色标识"
          header-align="center"/>
        <!--<el-table-column
          :show-overflow-tooltip="true"
          prop="unit"
          label="所属单位"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.unit==null" style="font-weight: bold">
              系统角色
            </span>
            <span v-if="scope.row.unit!=null">
              {{ scope.row.unit.name }}
            </span>
          </template>
        </el-table-column>-->
        <el-table-column
          :show-overflow-tooltip="true"
          sortable
          prop="role_status"
          label="启用状态"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <i v-if="scope.row.role_status!==1" class="fa fa-circle text-danger ml5"/>
            <i v-if="scope.row.role_status===1" class="fa fa-circle text-success ml5"/>
          </template>
        </el-table-column>
        <el-table-column
          prop="userOnline"
          label="操作"
          width="120">
          <template slot-scope="scope">
            <el-dropdown @command="dropdownCommand">
              <el-button size="mini">
                <i class="el-icon-setting"/>
                <span class="el-icon-arrow-down"/>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <!--<el-dropdown-item :command="{type:'role',id:scope.row.id,name:scope.row.role_en_name}">
                  查看权限
                </el-dropdown-item>-->
                <el-dropdown-item :command="{type:'menu',id:scope.row.id,name:scope.row.role_en_name}">
                  分配权限
                </el-dropdown-item>
                <el-dropdown-item :command="{type:'user',id:scope.row.id,name:scope.row.role_zh_name}">
                  用户列表
                </el-dropdown-item>
                <el-dropdown-item :command="{type:'enable',id:scope.row.id,name:scope.row.role_en_name,row:scope.row}" divided>
                  启用
                </el-dropdown-item>
                <el-dropdown-item :command="{type:'disable',id:scope.row.id,name:scope.row.role_en_name,row:scope.row}">
                  禁用
                </el-dropdown-item>
                <!-- <el-dropdown-item :command="{type:'edit',id:scope.row.id}" divided>
                  修改
                </el-dropdown-item>-->
                <!--<el-dropdown-item
                  v-if="scope.row.role_en_name!='superadmin'&&scope.row.role_en_name!='public'"
                  :command="{type:'delete',id:scope.row.id,name:scope.row.role_en_name}">
                  删除
                </el-dropdown-item>-->
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <!--权限列表-->
    </el-row>
    <el-row class="el-pagination-container">
      <!--权限列表分页-->
      <el-pagination
        :current-page="pageForm.pageNumber"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageForm.pageSize"
        :total="pageForm.totalCount"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="pageSizeChange"
        @current-change="pageNumberChange"/>
        <!--权限列表分页-->
    </el-row>
    <!--添加角色-->
    <!--<el-dialog
      :visible.sync="addDialogVisible"
      append-to-body
      title="新建角色"
      width="70%">
      <el-form ref="addForm" :model="formData" :rules="formRules" size="small" label-width="80px">
        <el-form-item class="is-required" prop="parentUnit" label="所属单位" label-width="80px">
          <el-cascader
            :options="options"
            :show-all-levels="false"
            v-model="parentUnit"
            :fetch-suggestions="unitQuery"
            style="width: 100%"
            tabindex="1"
            placeholder="请选择单位"
            @active-item-change="unitChange"
            @change="unitChange2"
            @select="unitSelect"
          />
        </el-form-item>
        <el-form-item prop="name" label="角色名称">
          <el-input
            v-model="formData.name"
            maxlength="50"
            placeholder="角色名称"
            auto-complete="off"
            tabindex="2"
            type="text"/>
        </el-form-item>
        <el-form-item prop="code" label="角色标识">
          <el-input
            v-model="formData.code"
            maxlength="150"
            placeholder="角色标识"
            auto-complete="off"
            tabindex="3"
            type="text"/>
        </el-form-item>
        <el-form-item prop="disabled" label="启用状态">
          <el-switch
            v-model="formData.disabled"
            active-color="#ff4949"
            inactive-color="#13ce66"/>
        </el-form-item>
        <el-form-item prop="" label="分配权限">
          <el-row style="margin-bottom: 3px;">
            <el-button size="small" @click="addRoleSelAll">全选</el-button>
            <el-button size="small" @click="addRoleSelClear">清空</el-button>
          </el-row>
          <el-tree
            ref="addMenuTree"
            :data="addMenuData"
            :props="defaultProps"
            show-checkbox
            check-strictly
            node-key="id"
          >
            <span slot-scope="scope" class="custom-tree-node">
              <span>{{ scope.node.label }}</span>
              <span>
                <span v-if="scope.data.type=='menu'" style="font-weight: bold">菜单权限 </span>
                &lt;!&ndash;<span style="font-weight: bold">菜单权限 </span>&ndash;&gt;
                <span v-if="scope.data.type=='data'">数据权限 </span>
              </span>
            </span>
          </el-tree>

        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doAdd">确 定</el-button>
      </span>
    </el-dialog>-->
    <!--修改角色-->
    <el-dialog
      :visible.sync="editDialogVisible"
      append-to-body
      title="修改角色"
      width="40%">
      <el-form ref="editForm" :model="formData" :rules="formRules" size="small" label-width="80px">
        <el-form-item prop="name" label="角色名称">
          <el-input
            v-model="formData.name"
            maxlength="50"
            placeholder="角色名称"
            auto-complete="off"
            tabindex="2"
            type="text"/>
        </el-form-item>
        <el-form-item prop="code" label="角色标识">
          <el-input
            v-model="formData.code"
            maxlength="150"
            placeholder="角色标识"
            auto-complete="off"
            tabindex="3"
            type="text"/>
        </el-form-item>
        <el-form-item prop="disabled" label="启用状态">
          <el-switch
            v-model="formData.disabled"
            active-color="#ff4949"
            inactive-color="#13ce66"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doEdit">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改角色-->
    <el-dialog
      :title="roleDialogTitle"
      :visible.sync="roleDialogVisible"
      width="70%">
      <el-table
        :data="roleTreeData"
        :row-style="treeTableShowTr"
        :highlight-current-row="true"
        style="width: 100%"
        size="small">
        <el-table-column
          :show-overflow-tooltip="true"
          label="菜单名称"
          header-align="center"
          prop="name"
          width="200"
          align="left">
          <template slot-scope="scope">
            <span v-for="(space, levelIndex) in treeTablePath(scope.row.path)" class="ms-tree-space"/>
            <span
              v-if="treeTableIconShow(scope.row)"
              style="cursor: pointer"
              @click="treeTableChild(scope.row.id)">
              <span
                v-if="!scope.row.expanded"
                class="el-tree-node__expand-icon el-icon-caret-right"
                title="展开"/>

              <span
                v-if="scope.row.expanded"
                class="el-tree-node__expand-icon el-icon-caret-right expanded"
                title="关闭"/>
              {{ scope.row.name }}
            </span>
            <span v-if="!treeTableIconShow(scope.row)">
              <span class="ms-tree-space"/>
              {{ scope.row.name }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          label="URL"
          header-align="center"
          prop="href"/>

        <el-table-column
          :show-overflow-tooltip="true"
          label="资源类型"
          header-align="center"
          prop="type"
          align="center">

          <template slot-scope="scope">
            <i v-if="scope.row.type=='menu'" style="font-weight: bold">菜单</i>
            <i v-if="scope.row.type=='data'">数据</i>
          </template>
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          label="权限标识"
          header-align="center"
          prop="permission"/>

      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <!--给角色分配菜单权限-->
    <el-dialog
      :title="menuDialogTitle"
      :visible.sync="menuDialogVisible"
      append-to-body
      width="70%"
      @open="doMenuLoad">
      <el-row style="margin-bottom: 3px;">
        <el-button size="small" @click="menuRoleSelAll">全选</el-button>
        <el-button size="small" @click="menuRoleSelClear">清空</el-button>
      </el-row>
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
        <el-button @click="menuDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doMenu">确 定</el-button>
      </span>
    </el-dialog>
    <!--给角色分配菜单权限-->
    <!--分配用户到角色-->
    <el-dialog
      :title="userDialogTitle"
      :visible.sync="userDialogVisible"
      append-to-body
      width="70%">
      <div class="block">
        <!--<el-select
          :remote-method="remoteMethod"
          :loading="loading"
          v-model="selUsers"
          size="small"
          style="width: 60%"
          class="span_n"
          multiple
          filterable
          remote
          default-first-option
          reserve-keyword
          placeholder="请输入用户名或姓名"
        >
          <el-option
            v-for="item in dbUsers"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
        <el-button size="small" @click="userAddRole">将用户加入角色</el-button>
        <div class="pull-right offscreen-right">
          <el-button size="small" type="danger" @click="userDelRole">从角色中移除</el-button>
        </div>-->
      </div>
      <el-table
        :data="userTableData"
        size="small"
        header-align="center"
        style="width: 100%"
        @sort-change="userPageOrder"
        @selection-change="userSelectionChange"
      >
        <el-table-column
          type="selection"
          width="35"/>
        <el-table-column
          sortable
          prop="user_name"
          label="用户名"
          center
          header-align="center"/>
        <!--<el-table-column
          :show-overflow-tooltip="true"
          prop="username"
          label="姓名"
          header-align="center"/>-->
        <!--<el-table-column
          :show-overflow-tooltip="true"
          prop="unitname"
          label="所属单位"
          header-align="center"
          align="center"/>-->
        <el-table-column
          :show-overflow-tooltip="true"
          sortable
          prop="ruser_status"
          label="帐号状态"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <i v-if="scope.row.ruser_status!==1" class="fa fa-circle text-danger ml5"/>
            <i v-if="scope.row.ruser_status===1" class="fa fa-circle text-success ml5"/>
          </template>
        </el-table-column>
        <!--<el-table-column
          :show-overflow-tooltip="true"
          sortable
          prop="userOnline"
          label="在线状态"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <i v-if="scope.row.userOnline" class="text-success ml5">在线</i>
            <i v-if="!scope.row.userOnline" class="text-danger ml5">离线</i>
          </template>
        </el-table-column>-->
      </el-table>
      <el-pagination
        :total="userForm.totalCount"
        :current-page="userForm.pageNumber"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="userForm.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="userPageSizeChange"
        @current-change="userPageNumberChange"/>
      <span slot="footer" class="dialog-footer">
        <el-button @click="userDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <!--分配用户到角色-->
  </div>
</template>

<script>
import $ from 'jquery'
import mockData from '@/mock/mockData'
import { SubMitRolePower, fetchRolePower, fetchRolePowerById, getUserListByRoleId } from '@/api/systemManage'
import Vue from 'vue'
export default {
  name: 'Roles',
  data() {
    var self = this
    var validateName = function(rule, value, callback) {
      var regex = new RegExp('^[a-zA-Z][a-zA-Z0-9_]{1,49}$')
      if (!regex.test(value)) {
        callback(new Error('角色标识以字母开头2-50字,允许使用字母/数字/下划线'))
      } else {
        callback()
      }
    }
    var validateUnit = function(rule, value, callback) {
      if (self.parentUnit.length < 1 || self.parentUnit[self.parentUnit.length - 1] === '') {
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
      menuDialogVisible: false,
      userDialogVisible: false,
      treeData: {
        label: 'name',
        children: 'zones',
        id: 'id',
        isLeaf: 'leaf'
      },
      tableData: [],
      options: [],
      parentUnit: [],
      defaultOpen: [],
      // pageForm: {
      //   searchUnit: '',
      //   searchName: '',
      //   searchKeyword: '',
      //   pageNumber: 1,
      //   pageSize: 10,
      //   totalCount: 0,
      //   pageOrderName: '',
      //   pageOrderBy: ''
      // },
      // 分页查询参数
      pageForm: {
        pageNum: 1,
        pageSize: 10,
        dataType: 1
        // importance: undefined,
        // title: undefined,
        // type: undefined,
        // sort: '+id'
      },
      formData: {
        id: '',
        unitid: '',
        disabled: false,
        menuIds: ''
      },
      formRules: {
        parentUnit: [
          // { validate: validateUnit, trigger: ['blur', 'change'] }
        ],
        name: [
          { required: true, message: '角色名称', trigger: ['blur', 'change'] }
        ],
        code: [
          { required: true, message: '角色标识', trigger: ['blur', 'change'] }
          // { validate: validateName, trigger: ['blur', 'change'] }
        ]
      },
      editRules: {
        parentUnit: [
          // { validate: validateUnit, trigger: ['blur', 'change'] }
        ],
        name: [
          { required: true, message: '角色名称', trigger: ['blur', 'change'] }
        ],
        code: [
          { required: true, message: '角色标识', trigger: ['blur', 'change'] }
          // { validate: validateName, trigger: ['blur', 'change'] }
        ]
      },
      roleDialogTitle: '查看角色权限',
      menuDialogTitle: '分配角色菜单',
      userDialogTitle: '分配用户',
      roleTableData: [], // treeTable后台取出的数据
      roleTreeData: [], // treeTable格式化用于显示的数据
      roleId: '', // 当前角色ID
      defaultProps: {
        // children: 'children',
        children: 'meun_children_power_list',
        // label: 'label'
        label: 'meun_zh_name'
      },
      addMenuData: [],
      doMenuData: [],
      doMenuCheckedData: [], // 已分配的权限选中状态
      poserIds: '',
      userForm: {
        roleId: '',
        pageNumber: 1,
        pageSize: 10,
        totalCount: 0,
        pageOrderName: '',
        pageOrderBy: ''
      },
      userTableData: [],
      loading: false,
      dbUsers: [], // 分配用户
      selUsers: [], // 分配选中的用户
      userSelection: []
    }
  },
  created: function() {
    this.initTree()
    this.pageData()
  },
  methods: {
    // 级联选择器从后台动态获取下级数据
    loadTree: function(val, cb) {
      // var url = this.base + '/platform/sys/role/tree'
      // $.post(url, { pid: val }, function(data) {
      //   if (data.code === 0) {
      //     cb(data.data)
      //   }
      // }, 'json')
      cb(mockData.treeData.data)
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
        if (pid === obj.value) {
          obj.children = data
        } else if (obj.children && obj.children.length > 0) {
          self.unitTree(obj.children, data, pid)
        }
      })
    },
    unitChange2: function(val) {
      var self = this
      if (val[0] === 'root') {
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
      this.pageForm.pageOrderName = column.prop
      this.pageForm.pageOrderBy = column.order
      this.pageData()
    },
    pageNumberChange: function(val) { // 页码更新操作
      this.pageForm.pageNumber = val
      this.pageData()
    },
    pageSizeChange: function(val) { // 分页大小更新操作
      this.pageForm.pageSize = val
      this.pageData()
    },
    // 获取角色列表
    pageData: function() { // 加载分页数据
      var self = this
      // sublime.showLoadingbar() // 显示loading
      $.post('http://gwtest.youxinbao.com.cn/Public/GetRoleList', self.pageForm, function(data) {
        // sublime.closeLoadingbar() // 关闭loading
        if (data.result === '0') {
          self.tableData = data.data
          self.pageForm.totalCount = data.total_count
        } else {
          self.$message({
            message: data.msg,
            type: 'error'
          })
        }
      }, 'json')
      // self.tableData = mockData.roleData.data.list
      // self.pageForm.totalCount = mockData.roleData.data.totalCount
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
    addMenuLoad: function() {
      var self = this
      $.post(self.base + '/platform/sys/role/menuAll', {}, function(data) {
        if (data.code === 0) {
          self.addMenuData = data.data
        }
      }, 'json')
    },
    // 分配权限菜单 全部菜单数据
    doMenuLoad: function() {
      var self = this
      $.get('http://gwtest.youxinbao.com.cn/Public/GetMeunLIst', function(data) {
        if (data.result === '0') {
          self.doMenuData = data.data.meun_power_list
          console.log("我是阿波")
          console.log(data.data)
          // self.doMenuCheckedData = data.data.cmenu
          // self.openNowFetch()
          console.log(1)
          console.log(self.$refs['addMenuTree'])
        }
      }, 'json')
      console.log(2)
      console.log(self.$refs['addMenuTree'])
      // self.doMenuData = mockData.roleMenu.data.menu
      // self.doMenuCheckedData = mockData.roleMenu.data.cmenu
      // 默认设置
    },
    // 查看角色权限
    fetchRolePowerById() {
      // fetchRolePowerById
      fetchRolePowerById({
        role_id: this.roleId
      }).then((res) => {
        console.log(res)
        if (res.data.result === '0') {
          var ids = res.data.data.join(',').split(',')
          self.$refs['addMenuTree'].setCheckedKeys(ids)
        } else {
          this.$notify({
            title: '提示',
            message: '分配角色失败',
            type: 'warning',
            duration: 2000
          })
        }
      })
    },
    // 获取角色已有的权限
    openNowFetch() {
      var self = this
      self.defaultOpen = []
      // 权限列表
      fetchRolePower({
        role_id: this.roleId
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
    userSelectionChange: function(val) {
      this.userSelection = val
    },
    userPageOrder: function(column) { // 按字段排序
      this.userForm.pageOrderName = column.prop
      this.userForm.pageOrderBy = column.order
      this.doUserLoad()
    },
    userPageNumberChange: function(val) { // 页码更新操作
      this.userForm.pageNumber = val
      this.doUserLoad()
    },
    userPageSizeChange: function(val) { // 分页大小更新操作
      this.userForm.pageSize = val
      this.doUserLoad()
    },
    remoteMethod: function(query) {
      var self = this
      if (query !== '') {
        self.loading = true
        $.post(self.base + '/platform/sys/role/userSearch', {
          query: query,
          roleId: self.roleId
        }, function(data) {
          if (data.code === 0) {
            self.dbUsers = data.data.list
          }
          self.loading = false
        }, 'json')
      } else {
        self.selUsers = []
      }
    },
    // 获取角色下的所有用户
    doUserLoad: function() {
      var self = this
      // 角色下的所有用户
      getUserListByRoleId({
        role_id: this.roleId
      }).then((res) => {
        if (res.data.result === '0') {
          self.userTableData = res.data.data
          self.userForm.totalCount = res.data.total_count
        } else {
          this.$notify({
            title: '提示',
            message: '用户获取失败',
            type: 'warning',
            duration: 2000
          })
        }
      })
      // $.post(self.base + '/platform/sys/role/user', self.userForm, function(data) {
      //   if (data.code === 0) {
      //     self.userTableData = data.data.list
      //     self.userForm.totalCount = data.data.totalCount
      //   } else {
      //     self.$message({
      //       message: data.msg,
      //       type: 'error'
      //     })
      //   }
      // }, 'json')
    },
    openAdd: function() {
      var self = this
      this.addDialogVisible = true
      this.formData = {} // 打开新增窗口,表单先清空
      if (this.$refs['addForm']) { this.$refs['addForm'].resetFields() }
      this.addMenuLoad()
    },
    doAdd: function() {
      var self = this
      self.$refs['addForm'].validate(function(valid) {
        if (valid) {
          self.formData.menuIds = (self.$refs['addMenuTree'].getCheckedKeys()).toString()
          self.formData.unitid = self.parentUnit[self.parentUnit.length - 1] || ''
          $.post(self.base + '/platform/sys/role/addDo', self.formData, function(data) {
            if (data.code === 0) {
              self.$message({
                message: data.msg,
                type: 'success'
              })
              self.pageData()
              self.addDialogVisible = false
            } else {
              self.$message({
                message: data.msg,
                type: 'error'
              })
            }
          }, 'json')
        }
      })
    },
    doEdit: function() {
      var self = this
      self.$refs['editForm'].validate(function(valid) {
        if (valid) {
          $.post(self.base + '/platform/sys/role/editDo', self.formData, function(data) {
            if (data.code === 0) {
              self.$message({
                message: data.msg,
                type: 'success'
              })
              self.doSearch() // 查询是带条件的,加载新建用户选择的单位用户数据
              // self.pageData()
              self.editDialogVisible = false
            } else {
              self.$message({
                message: data.msg,
                type: 'error'
              })
            }
          }, 'json')
        }
      })
    },
    // 分配权限提交数据
    doMenu: function() {
      var self = this
      var ids = self.$refs['doMenuTree'].getCheckedKeys()
      // var idss = self.$refs['doMenuTree'].getHalfCheckedKeys()
      var nodeObjArrs1 = self.$refs['doMenuTree'].getCheckedNodes()
      var nodeObjArrs2 = self.$refs['doMenuTree'].getHalfCheckedNodes()
      var nodeObjArrs = nodeObjArrs1.concat(nodeObjArrs2)
      var menuNodeArr = [], dataNodeArr = []
      nodeObjArrs.forEach(nodeObj => {
        // 区分menu和data权限
        if (nodeObj.type === 'meun') {
          if (nodeObj.parent_id !== 0) {
            menuNodeArr.push(nodeObj)
          }
        } else if (nodeObj.type === 'data') {
          dataNodeArr.push(nodeObj)
        }
      })

      menuNodeArr.forEach(menuObj => {
        if (menuObj.dataArr) {
          menuObj.dataArr = []
        }
      })
      dataNodeArr.forEach(dataNode => {
        menuNodeArr.forEach(menuNode => {
          if (!menuNode.dataArr) {
            menuNode.dataArr = []
          }

          if (dataNode.parent_id === menuNode.id) {
            menuNode.dataArr.push(dataNode.id)
          }
          console.log(menuNode)
        })
      })
      console.log(dataNodeArr)
      console.log(menuNodeArr)
      // 组合数据
      var meun_id_list_arr = []
      var power_detail_list_arr = []
      menuNodeArr.forEach(obj => {
        meun_id_list_arr.push(obj.id)
        power_detail_list_arr.push(obj.dataArr)
      })

      console.log(meun_id_list_arr)
      var meun_id_list = meun_id_list_arr.join(',')
      var power_detail_list = power_detail_list_arr.join('|')
      console.log(power_detail_list_arr)
      console.log(meun_id_list)
      console.log(power_detail_list)
      console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
      console.log(self.roleId)
      if (!ids || ids.length === 0) {
        self.$message({
          message: '请选择菜单或数据权限',
          type: 'warning'
        })
        return
      }

      SubMitRolePower({
        dataType: 1,
        method: 'edit', // add
        model_info: { id: 1, role_id: self.roleId, meun_id_list: meun_id_list, power_detail_list: power_detail_list }}).then((res) => {
        if (res.data.result === '0') {
          this.menuDialogVisible = false
          self.$notify({
            title: '成功',
            message: '分配权限成功',
            type: 'success',
            duration: 2000
          })
        } else {
          self.$notify({
            title: '提示',
            message: '分配角色失败',
            type: 'warning',
            duration: 2000
          })
        }
      })
      // $.get('http://192.168.10.23:9100/Public/SubMitRolePower', {
      //   dataType: 1,
      //   method: 'add',
      //   model_info: { id: '', role_id: self.roleId, meun_id_list: meun_id_list, power_detail_list: power_detail_list },
      //   // roleId: self.roleId,
      //   menuIds: ids.toString()
      // }, function(data) {
      //   if (data.code === 0) {
      //     self.$message({
      //       message: data.msg,
      //       type: 'success'
      //     })
      //     self.menuDialogVisible = false
      //   } else {
      //     self.$message({
      //       message: data.msg,
      //       type: 'error'
      //     })
      //   }
      // })
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
        if (pid === obj.id) { // 找到这条数据追加下级数据
          obj.children = data
          obj.expanded = !obj.expanded
        } else if (obj.children && obj.children.length > 0) {
          self.treeDataChildren(obj.children, data, pid)
        }
      })
    },
    // 展开下级查看角色权限
    treeTableChild: function(pid) {
      // var self = this
      // var url = self.base + '/platform/sys/role/menu/' + self.roleId
      // $.post(url, { pid: pid }, function(data) {
      //   if (data.code === 0) {
      //     if (pid !== undefined && pid !== '') {
      //       self.treeDataChildren(self.roleTableData, data.data, pid)
      //     } else {
      //       self.roleTableData = data.data
      //     }
      //     self.roleTreeData = sublime.treeToArray(self.roleTableData)
      //   }
      // }, 'json')
      this.roleTableData = mockData.menuData.data
      console.log(this.roleTableData)
      this.roleTreeData = this.treeToArray2(this.roleTableData)
      console.log(this.roleTreeData)
    },
    // 点击展开和关闭的时候，图标的切换
    treeTableIconShow: function(record) {
      return record.hasChildren
    },
    dropdownCommand: function(command) { // 监听下拉框事件
      // alert(command.type)
      var self = this
      if (command.type === 'role') {
        self.roleDialogVisible = true
        self.roleDialogTitle = '查看角色 【' + command.name + '】 的权限'
        self.roleId = command.id
        self.treeTableChild('')
      }
      if (command.type === 'menu') {
        self.menuDialogTitle = '分配角色 【' + command.name + '】 的权限'
        self.menuDialogVisible = true
        self.roleId = command.id
        // self.doMenuLoad()
        self.openNowFetch() // 获取已选中角色数据
      }
      if (command.type === 'user') {
        self.userDialogTitle = '【' + command.name + '】 角色的用户列表'
        self.userDialogVisible = true
        self.roleId = command.id
        self.userForm.roleId = command.id
        self.doUserLoad()
      }
      if (command.type === 'enable' || command.type === 'disable') {
        $.post(self.base + '/platform/sys/role/' + command.type + '/' + command.id, {}, function(data) {
          if (data.code === 0) {
            self.$message({
              message: data.msg,
              type: 'success'
            })
            if (command.type === 'disable') {
              command.row.disabled = true
            }
            if (command.type === 'enable') {
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
      if (command.type === 'edit') {
        $.post(self.base + '/platform/sys/role/edit/' + command.id, {}, function(data) {
          if (data.code === 0) {
            self.formData = data.data // 加载后台表单数据
            self.editDialogVisible = true // 打开编辑窗口
          } else {
            self.$message({
              message: data.msg,
              type: 'error'
            })
          }
        }, 'json')
      }
      if (command.type === 'delete') {
        self.$confirm('此操作将删除 ' + command.name, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          callback: function(a, b) {
            if (a === 'confirm') { // 确认后再执行
              $.post(self.base + '/platform/sys/role/delete/' + command.id, {}, function(data) {
                if (data.code === 0) {
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
    userAddRole: function() {
      var self = this
      if (self.selUsers.length === 0) {
        self.$message({
          message: '请先输入用户名或姓名查询用户',
          type: 'warning'
        })
        return
      }
      // $.post(self.base + '/platform/sys/role/usersAdd', {
      //   roleId: self.roleId,
      //   users: self.selUsers.toString()
      // }, function(data) {
      //   if (data.code === 0) {
      //     self.$message({
      //       message: data.msg,
      //       type: 'success'
      //     })
      //     self.selUsers = [] // 清除已选择的用户
      //     self.dbUsers = [] // 清除数据库查询的用户,已添加到角色的用户不应该还存在so..
      //     self.doUserLoad()
      //   } else {
      //     self.$message({
      //       message: data.msg,
      //       type: 'error'
      //     })
      //   }
      // }, 'json')
    },
    userDelRole: function() {
      var self = this
      if (self.userSelection.length === 0) {
        self.$message({
          message: '请先选择要移除的用户',
          type: 'warning'
        })
        return
      }
      var users = []
      self.userSelection.forEach(function(obj) {
        users.push(obj.id)
      })
      $.post(self.base + '/platform/sys/role/usersDel', {
        roleId: self.roleId,
        users: users.toString()
      }, function(data) {
        if (data.code === 0) {
          self.$message({
            message: data.msg,
            type: 'success'
          })
          self.selUsers = [] // 清除已选择的用户
          self.dbUsers = [] // 清除数据库查询的用户,已移除的用户应该能重新被查询到..
          self.doUserLoad()
        } else {
          self.$message({
            message: data.msg,
            type: 'error'
          })
        }
      }, 'json')
    },
    getTreeAllIds: function(ids, obj) {
      var self = this
      if (obj && obj.length > 0) {
        obj.forEach(function(o) {
          ids.push(o.id)
          if (o.meun_children_power_list) {
            self.getTreeAllIds(ids, o.meun_children_power_list)
          }
        })
      }
    },
    addRoleSelAll: function() {
      var self = this
      var ids = []
      self.getTreeAllIds(ids, self.addMenuData)
      self.$refs['addMenuTree'].setCheckedKeys(ids)
    },
    addRoleSelClear: function() {
      this.$refs['addMenuTree'].setCheckedKeys([])
    },
    menuRoleSelAll: function() {
      var self = this
      var ids = []
      self.getTreeAllIds(ids, self.doMenuData)
      self.$refs['doMenuTree'].setCheckedKeys(ids)
    },
    menuRoleSelClear: function() {
      this.$refs['doMenuTree'].setCheckedKeys([])
    },
    treeToArray2(data, parent, level, expandedAll) {
      var tmp = []
      // var self = this
      Array.from(data).forEach(function(record) {
        if (record._expanded === undefined) {
          Vue.set(record, '_expanded', expandedAll)
        }
        if (parent) {
          Vue.set(record, '_parent', parent)
        }
        var _level = 0
        if (level !== undefined && level !== null) {
          _level = level + 1
        }
        Vue.set(record, '_level', _level)
        tmp.push(record)
        if (record.children && record.children.length > 0) {
          var children = this.treeToArray2(record.children, record, _level, expandedAll)
          tmp = tmp.concat(children)
        }
      })
      return tmp
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
