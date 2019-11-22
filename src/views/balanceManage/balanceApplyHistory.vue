<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-if="roleId!=6" v-model="merchant_text" clearable placeholder="选中商户" style="width: 140px"
                 class="filter-item" @change="handleFilter">
        <el-option v-for="item in merchantList" :key="item.balance_id" :label="item.balance_merchant"
                   :value="item.balance_id"/>
      </el-select>
      <!--<el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>-->
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download"
                 @click="handleDownload">{{ $t('table.export') }}
      </el-button>
      <!--<el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">{{ $t('table.reviewer') }}</el-checkbox>-->
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;max-height: 550px;overflow-y: scroll;"
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

      <el-table-column label="审核状态" width="200px">
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
      <!--<el-table-column label="操作" align="center" width="240px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini"  v-if="(scope.row.balance_finance_xamine_state==0&&scope.row.balance_operate_xamine_state==0)"  @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
          &lt;!&ndash;<el-button v-if="scope.row.status!='published'" size="mini" type="success" @click="handleModifyStatus(scope.row,'published')">{{ $t('table.publish') }}
          </el-button>
          <el-button v-if="scope.row.status!='draft'" size="mini" @click="handleModifyStatus(scope.row,'draft')">{{ $t('table.draft') }}
          </el-button>&ndash;&gt;
          <el-button size="mini" v-if="(scope.row.balance_finance_xamine_state==0&&scope.row.balance_operate_xamine_state==0)" type="danger" @click="handleDelete(scope.row,'delete')">撤销
          </el-button>
        </template>
      </el-table-column>-->
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"  :pageSizes="[50,100,150,200]"
                @pagination="getList"/>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="tempDate" label-position="left" label-width="120px"
               style="width: 420px; margin-left:50px;">
        <!--<el-form-item label="商户名称" prop="nowUsername" disabled>
          <el-input v-model="tempDate.merchant" clearable/>
        </el-form-item>-->
        <el-form-item label="汇款银行账户" prop="oil_base_price">
          <el-input v-model="tempDate.balance_paying_bank" clearable/>
        </el-form-item>
        <el-form-item label="汇入银行账户" prop="oil_base_price">
          <el-input v-model="tempDate.balance_remittance_bank" clearable/>
        </el-form-item>
        <el-form-item label="汇款流水号" prop="oil_base_price">
          <el-input v-model="tempDate.balance_remittance_flow" clearable/>
        </el-form-item>
        <el-form-item label="备付金金额" prop="oil_base_price">
          <el-input-number v-model="tempDate.balance_charge_money" :min="1" :max="99999999" clearable
                           controls-position="right"/>
        </el-form-item>
        <el-form-item label="备注" prop="oil_change_date">
          <el-input
            v-model="tempDate.balance_memo"
            placeholder="备注"
            clearable/>
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
        <el-button type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
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
  import {fetchList, createUnifiedPrice, fetchPv} from '@/api/gasPriceManage'
  import {
    getBalanceInfoList,
    getBalanceHistoryInfoList,
    subMitBalanceApplyInfo,
    getBalanceHistory,
    getMerchantList
  } from '@/api/balanceManage'
  import waves from '@/directive/waves' // Waves directive
  import {parseTime, parseDateTime} from '@/utils'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  const calendarTypeOptions = [
    {key: '22', name: '92号汽油（V）'},
    {key: '13', name: '95号汽油（V）'},
    {key: '4', name: '98号汽油（V）'}
  ]

  // arr to obj ,such as { CN : "China", US : "USA" }
  const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.name
    return acc
  }, {})

  export default {
    name: 'ComplexTable',
    components: {Pagination},
    directives: {waves},
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
        roleId: '',
        inputMinMas: {min: 1, max: 100},
        tableKey: 0,
        list: null,
        total: 0,
        merchant_text:'',
        listLoading: true,
        disabledNow: false,
        nowBalance: 0,
        nowUsername: '',
        balance_apply: '',
        balance_merchant_id: '',
        merchantList: [],
        merchant_id:'',
        listQuery: {
          merchant_id:'',
          pageNum: 1,
          pageSize: 100,
          dataType: 1
          // importance: undefined,
          // title: undefined,
          // type: undefined,
          // sort: '+id'
        },
        importanceOptions: [1, 2, 3],
        calendarTypeOptions,
        sortOptions: [{label: 'ID Ascending', key: '+id'}, {label: 'ID Descending', key: '-id'}],
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
          balance_charge_money: '',
          balance_memo: ''
        },
        dialogFormVisible: false,
        dialogDeleteVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '添加'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          type: [{required: true, message: 'type is required', trigger: 'change'}],
          timestamp: [{type: 'date', required: true, message: 'timestamp is required', trigger: 'change'}],
          title: [{required: true, message: 'title is required', trigger: 'blur'}]
        },
        downloadLoading: false
      }
    },
    created() {
      this.getList()
      this.getMerchantList()
      this.roleId = localStorage.getItem('roleId')
      this.listQuery.merchant_id=localStorage.getItem("userMerchantId")
      if(this.listQuery.merchant_id=='null'){
        this.listQuery.merchant_id=''
      }
    },
    methods: {
      getList() {
        this.listLoading = true
        getBalanceHistory(this.listQuery).then(response => {
          this.list=response.data.data.reverse(function(a,b){
            return Date.parse(b.balance_apply_time) - Date.parse(a.balance_apply_time);
          });
          // this.list = response.data.data
          this.nowUsername = response.data.data[0].merchant
          this.nowBalance = response.data.balance_money
          this.balance_apply = response.data.balance_apply
          this.balance_merchant_id = response.data.balance_merchant_id
          this.total = response.data.total_count
          this.listLoading = false
        })
      },
      getMerchantList() {
        this.listLoading = true
        getMerchantList({}).then(response => {
          this.merchantList = response.data.data
          // Just to simulate the time of the request
        })
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
        const {prop, order} = data
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
              this.tempAllData.username = this.balance_apply
            }

            this.tempAllData.model_info = {
              data_create_user: this.balance_apply,
              m0007_id: this.balance_merchant_id,
              m0011_reserve_gold_id: new Number(this.tempDate.id),
              m0011_paying_bank: this.tempDate.balance_paying_bank,
              m0011_remittance_bank: this.tempDate.balance_remittance_bank,
              m0011_remittance_flow: this.tempDate.balance_remittance_flow,
              m0011_reserve_gold_balance: this.tempDate.balance_charge_money,
              m0011_memo: this.tempDate.balance_memo
            }
            console.log(this.tempAllData.model_info)
            // 提交数据
            subMitBalanceApplyInfo(this.tempAllData).then((res) => {
              if (res.data.result === '0') {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: '提交成功',
                  type: 'success',
                  duration: 2000
                })
                this.getList()
              } else {
                this.$notify({
                  title: '提示',
                  message: '提交失败',
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
        this.deleteRowData = {dataType: 1, method: 'delete', model_info: {m0011_reserve_gold_id: row.id}}
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
        this.list.forEach(obj => {
          obj.balance_apply_time = parseDateTime(obj.balance_apply_time)
          if (obj.balance_finance_xamine_state == 0) {
            obj.balance_finance_xamine_state = '未审核'
          } else if (obj.balance_finance_xamine_state == 1 && obj.balance_operate_xamine_state == 0) {
            obj.balance_finance_xamine_state = '财务已审核'
          } else if (obj.balance_finance_xamine_state == 1 && obj.balance_operate_xamine_state == 1) {
            obj.balance_finance_xamine_state = '审核通过'
          }
        })
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['商户名称', '汇款银行账户', '汇入银行账户', '汇款流水号', '金额', '备注', '申请时间', '审核状态']
          const filterVal = ['merchant', 'balance_paying_bank', 'balance_remittance_bank', 'balance_remittance_flow', 'balance_charge_money', 'balance_memo', 'balance_apply_time', 'balance_finance_xamine_state']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '商户备付金申请记录'
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
