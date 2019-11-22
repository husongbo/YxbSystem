<template>
  <div class="app-container">
    <div class="filter-container">
      <!--<el-form v-if="nowBalance" label-position="left" label-width="100px" style="width: 400px; margin-left:10px;">
        <el-form-item label="商户：" prop="nowUsername">
          <span>{{ nowUsername }}</span>
          &lt;!&ndash;<el-input-number v-model="nowBalance" disabled controls-position="right"/>&ndash;&gt;
        </el-form-item>
        <el-form-item label="当前备付金：" prop="nowBlance">
          <span>{{ nowBalance }}</span>
          &lt;!&ndash;<el-input-number v-model="nowBalance" disabled controls-position="right"/>&ndash;&gt;
        </el-form-item>
      </el-form>-->
      <!--<el-input :placeholder="$t('table.title')" v-model="listQuery.title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.importance" :placeholder="$t('table.importance')" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-select v-model="listQuery.type" :placeholder="$t('table.type')" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key"/>
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select>-->
      <!--<el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>-->
      <!--<el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate">{{ $t('table.add') }}
      </el-button>-->
      <!--<el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>-->
      <!--<el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">{{ $t('table.reviewer') }}</el-checkbox>-->
    </div>
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange">
      <!--<el-table-column label="编号" prop="id" sortable="custom" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>-->
      <!--<el-table-column label="油品编号" prop="oil_id" sortable="custom" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.oil_id }}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="商户名称" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.merchant }}</span>
        </template>
      </el-table-column>
      <el-table-column label="汇款银行账户" width="200px">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.balance_paying_bank }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="汇入银行账户" width="200px">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.balance_remittance_bank }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="汇款流水号" width="200px">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.balance_remittance_flow }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="金额" width="200px" align="center">
        <template slot-scope="scope">
          <!--<span>{{ scope.row.author }}</span>-->
          <el-tag>{{ scope.row.balance_charge_money }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="200px" align="center">
        <template slot-scope="scope">
          <!--<span style="color:red;">{{ scope.row.reviewer }}</span>-->
          <span>{{ scope.row.balance_memo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" width="200px">
        <template slot-scope="scope">
          <!--<span>{{ scope.row.oil_change_date | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>-->
          <span>{{ scope.row.balance_apply_time | parseDateTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="审核状态" width="120px">
        <template slot-scope="scope">
          <!--<span>{{ scope.row.oil_change_date | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>-->
          <el-tag type="info">{{ scope.row | parseStatus }}</el-tag>
        </template>
      </el-table-column>

      <!-- <el-table-column label="财务审核状态" width="200px">
        <template slot-scope="scope">
          &lt;!&ndash;<span>{{ scope.row.oil_change_date | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>&ndash;&gt;
          <span>{{ scope.row.balance_apply_time | parseDateTime }}</span>
        </template>
      </el-table-column>-->

      <!--<el-table-column :label="$t('table.readings')" align="center" width="95">
        <template slot-scope="scope">
          <span v-if="scope.row.pageviews" class="link-type" @click="handleFetchPv(scope.row.pageviews)">{{ scope.row.pageviews }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.status')" class-name="status-col" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>-->
      <el-table-column label="操作" align="center" width="240px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-if="(scope.row.balance_finance_xamine_state==0||scope.row.balance_operate_xamine_state==0)"
            type="primary"
            size="small"
            @click="handleUpdate(scope.row)">{{ $t('table.goSign') }}
          </el-button>
          <!--<el-button v-if="scope.row.status!='published'" size="mini" type="success" @click="handleModifyStatus(scope.row,'published')">{{ $t('table.publish') }}
          </el-button>
          <el-button v-if="scope.row.status!='draft'" size="mini" @click="handleModifyStatus(scope.row,'draft')">{{ $t('table.draft') }}
          </el-button>-->
          <!--<el-button
            v-if="(scope.row.balance_finance_xamine_state==0&&scope.row.balance_operate_xamine_state==0)"
            size="mini"
            type="danger"
            @click="handleDelete(scope.row,'delete')">撤销
          </el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"/>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="tempDate"
        label-position="left"
        label-width="120px"
        style="width: 420px; margin-left:50px;">
        <el-form-item label="商户名称" prop="nowUsername">
          <el-input v-model="tempDate.merchant" clearable disabled/>
        </el-form-item>
        <el-form-item label="汇款银行账户" prop="oil_base_price">
          <el-input v-model="tempDate.balance_paying_bank" clearable disabled/>
        </el-form-item>
        <el-form-item label="汇入银行账户" prop="oil_base_price">
          <el-input v-model="tempDate.balance_remittance_bank" clearable disabled/>
        </el-form-item>
        <el-form-item label="汇款流水号" prop="oil_base_price">
          <el-input v-model="tempDate.balance_remittance_flow" clearable disabled/>
        </el-form-item>
        <el-form-item label="汇款金额" prop="oil_base_price">
          <el-input-number
            v-model="tempDate.balance_charge_money"
            :min="1"
            :max="99999999"
            clearable
            disabled
            controls-position="right"/>
        </el-form-item>
        <el-form-item label="备注" prop="oil_change_date">
          <el-input
            v-model="tempDate.balance_memo"
            placeholder="备注"
            clearable
            disabled/>
        </el-form-item>
        <!--<el-form-item :label="$t('table.status')">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.importance')">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;"/>
        </el-form-item>-->
        <!--<el-form-item :label="$t('table.remark')">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.remark" type="textarea" placeholder="Please input"/>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="createData">{{ $t('table.sign') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"/>
        <el-table-column prop="pv" label="Pv"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :before-close="handleClose"
      :visible.sync="dialogDeleteVisible"
      title="提示"
      width="30%">
      <span>确定要删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDeleteVisible = false">取 消</el-button>
        <el-button type="primary" @click="removeRow">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, createUnifiedPrice, fetchPv } from '@/api/gasPriceManage'
import { getBalanceInfoList, getBalanceHistoryInfoList, subMitBalanceApplyInfo } from '@/api/balanceManage'
import waves from '@/directive/waves' // Waves directive
import { parseTime, parseDateTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

const calendarTypeOptions = [
  { key: '22', name: '92号汽油（V）' },
  { key: '13', name: '95号汽油（V）' },
  { key: '4', name: '98号汽油（V）' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    parseDateTime(str) {
      return parseDateTime(str)
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    },
    parseStatus(status) {
      if (status.balance_finance_xamine_state == 0) {
        return '未审核'
      } else if (status.balance_finance_xamine_state == 1 && status.balance_operate_xamine_state == 0) {
        return '财务已审核'
      } else if (status.balance_finance_xamine_state == 1 && status.balance_operate_xamine_state == 1) {
        return '审核通过'
      }
    }
  },
  data() {
    return {
      inputMinMas: { min: 1, max: 100 },
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      disabledNow: false,
      nowBalance: 0,
      nowUsername: '',
      balance_apply: '',
      balance_merchant_id: '',
      listQuery: {
        username: localStorage.getItem('username'),
        pageNum: 1,
        pageSize: 10,
        dataType: 1
        // importance: undefined,
        // title: undefined,
        // type: undefined,
        // sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: { // 提交变更油价信息
        id: '',
        oil_id: '',
        oil_name: '',
        oil_base_price: '',
        oil_change_date: '',
        oil_change_no: ''
      },
      tempAllData: {
        dataType: 1,
        method: 'add'
      },
      deleteRowData: {},
      tempDate: { // 提交
        id: '',
        merchant: '',
        merchant_id: '',
        balance_apply_user: '',
        balance_paying_bank: '',
        balance_remittance_bank: '',
        balance_remittance_flow: '',

        data_finance_examine_user: '', // 财务审核人
        data_operate_examine_user: '', // 运营审核人
        m0011_finance_xamine_state: '', // 财务审核状态 1 通過 0 未通过
        m0011_operate_xamine_state: '', // 运营审核状态
        balance_charge_money: '',
        balance_memo: ''
      },
      dialogFormVisible: false,
      dialogDeleteVisible: false,
      dialogStatus: '',
      textMap: {
        update: '审核',
        create: '添加'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.roleId = localStorage.getItem('roleId')
  },
  methods: {
    getList() {
      var count=0
      this.listLoading = true
      getBalanceHistoryInfoList(this.listQuery).then(response => {
        console.log(response.data.data)
        if (response.data.data) {
          for(var i=0;i<response.data.data.length;i++){
            if(response.data.data[i].balance_operate_xamine_state==0){
              this.list.push(response.data.data[i])
              count++
            }
          }
          console.log(this.list)
          if(this.list.length==0){
            this.list=[]
            this.total=0
          }
          else{
            this.list=this.list.reverse(function(a,b){
              return Date.parse(b.balance_apply_time) - Date.parse(a.balance_apply_time);
            });
            // var sortArr = response.data.data.sort(this.compare);
            this.nowUsername = this.list[0].merchant
            this.nowBalance = response.data.balance_money
            this.balance_apply = response.data.balance_apply
            this.balance_merchant_id = response.data.balance_merchant_id
            this.total = count
          }

        } else {
          this.list = []
        }
        this.listLoading = false
        // balance_apply_time
      })
    },
    compare(obj1,obj2){
      var val1 = parseInt(obj1.balance_apply_time);
      var val2 = parseInt(obj2.balance_apply_time);
      if(val1 < val2){
        return 1;
      }else if(val1 > val2){
        return -1;
      }else{
        return 0;
      }
    },
    parseDateTime(str) {
      return parseDateTime(str)
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.tempDate = {
        id: '',
        merchant: '',
        merchant_id: '',
        balance_apply_user: '',
        balance_paying_bank: '',
        balance_remittance_bank: '',
        balance_remittance_flow: '',
        balance_charge_money: '',
        balance_memo: ''
      }
    },
    handleClose() {
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.tempAllData.method = 'add'
      this.dialogFormVisible = true
      this.disabledNow = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        console.log(this.tempAllData.method)
        if (valid) {
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          // this.tempData.author = 'vue-element-admin'
          // this.tempDate
          if (this.tempAllData.method == 'edit') {
            this.tempAllData.userName = localStorage.getItem('username')
          }

          if (localStorage.getItem('roleId') == 4) { // 财务审核人
            this.tempDate.data_finance_examine_user = localStorage.getItem('username')
            this.tempDate.m0011_finance_examine_state = 1
          }

          if (localStorage.getItem('roleId') == 3) { // 运营审核人
            this.tempDate.data_operate_examine_user = localStorage.getItem('username')
            this.tempDate.m0011_operate_examine_state = 1
          }
          this.tempAllData.model_info = {
            data_create_user: this.tempDate.balance_apply_user,
            m0007_id: this.balance_merchant_id,
            m0011_reserve_gold_id: new Number(this.tempDate.id),
            m0011_paying_bank: this.tempDate.balance_paying_bank,
            m0011_remittance_bank: this.tempDate.balance_remittance_bank,
            m0011_remittance_flow: this.tempDate.balance_remittance_flow,

            DATA_FINANCE_EXAMINE_USER: this.tempDate.data_finance_examine_user, // 财务审核人
            DATA_OPERATE_EXAMINE_USER: this.tempDate.data_operate_examine_user, // 运营审核人

            m0011_finance_examine_state: this.tempDate.m0011_finance_examine_state, // 财务审核状态 1 通過 0 未通过
            m0011_operate_examine_state: this.tempDate.m0011_operate_examine_state, // 运营审核状态

            m0011_reserve_gold_balance: this.tempDate.balance_charge_money,
            m0011_memo: this.tempDate.balance_memo
          }
          console.log(this.tempAllData.model_info)
          // 提交数据
          subMitBalanceApplyInfo(this.tempAllData).then((res) => {
            if (res.data.result === '0') {
              this.dialogFormVisible = false
              this.$notify({
                title: '提示',
                message: '审批通过！',
                type: 'success',
                duration: 2000
              })
              this.getList()
            } else {
              this.$notify({
                title: '提示',
                message: res.data.message,
                type: 'warning',
                duration: 2000
              })
            }
            // this.list.unshift(this.tempAllData)
            // this.dialogFormVisible = false
            // this.$notify({
            //   title: '成功',
            //   message: '创建成功',
            //   type: 'success',
            //   duration: 2000
            // })
          })
        }
      })
    },
    handleUpdate(row) {
      this.tempDate = Object.assign({}, row) // copy obj
      console.log(this.tempDate)
      this.disabledNow = true
      this.dialogStatus = 'update'
      this.tempAllData.method = 'edit'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      console.log(this.tempAllData.method)
    },
    handleDelete(row, method) {
      this.deleteRowData = { dataType: 1, method: 'delete', model_info: { m0011_reserve_gold_id: row.id }}
      this.dialogDeleteVisible = true
    },
    removeRow() {
      // let tempData = { dataType: 1, method: 'delete', model_info: { id: row.id }}
      subMitBalanceApplyInfo(this.deleteRowData).then((res) => {
        if (res.data.result === '0') {
          this.deleteRowData = {}
          this.dialogDeleteVisible = false
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        } else {
          this.$notify({
            title: '提示',
            message: '删除失败',
            type: 'warning',
            duration: 2000
          })
        }
        // this.list.unshift(this.tempAllData)
        // this.dialogFormVisible = false
        // this.$notify({
        //   title: '成功',
        //   message: '创建成功',
        //   type: 'success',
        //   duration: 2000
        // })
      })
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
          const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'table-list'
          })
          this.downloadLoading = false
        })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
