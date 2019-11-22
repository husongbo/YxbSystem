<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker
        v-model="listQuery.modifyDate"
        :picker-options="pickerOptions2"
        type="daterange"
        align="right"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="handleFilterDate"/>
      <el-select v-model="listQuery.province_id" filterable clearable placeholder="请选择省份" @change="getCityList">
        <el-option v-for="item in provinceOptions" :key="item.id" :label="item.province_name" :value="item.id"/>
      </el-select>
      <el-select
        v-model="listQuery.city_id"
        filterable
        clearable
        style="margin-left: 20px;"
        placeholder="请选择城市"
        @change="handleFilterCity">
        <el-option v-for="item in cityOptions" :key="item.id" :label="item.city_name" :value="item.id"/>
      </el-select>
      <!-- <el-select
         v-model="tempDate.oil_station_id"
         filterable
         style="margin-left: 20px;"
         placeholder="请选择加油站">
         <el-option v-for="item in gasStationOptions" :key="item.id" :label="item.station_name" :value="item.id"/>
       </el-select>-->
       <el-select v-if="roleId!=6" v-model="merchant_id" clearable placeholder="选择商户平台"
                  style="width: 160px;margin-left: 20px;"
                  @change="handleFilterExchangeType">

         <el-option v-for="item in merchantList" :key="item.balance_id" :label="item.balance_merchant"
                    :value="item.balance_id"/>
       </el-select>
      <!--<el-select v-if="roleId!=6" v-model="exchange_type" clearable placeholder="选择交易方式"
                 style="width: 160px;margin-left: 20px;"
                 @change="handleFilterPayType">
        <el-option v-for="item in addstoreList" :key="item.store_id" :label="item.store_name"
                   :value="item.store_name"/>
      </el-select>-->
      <!--<el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>-->
      <el-button v-waves :loading="downloadLoading" type="primary" icon="el-icon-download"
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
      <el-table-column label="流水号" prop="oil_id" sortable="custom" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.recores_num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="APP商户名称" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.appstore_name === null?'无':scope.row.appstore_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.consumable }}</span>
        </template>
      </el-table-column>
      <el-table-column label="税收分类编号" width="120px">
        <template slot-scope="scope">
          {{ scope.row.tax_callssfication_code }}
        </template>
      </el-table-column>
      <el-table-column label="商品单价" width="80px">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.unit_price }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="交易方式" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.exchange_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交易日期" width="180px">
        <template slot-scope="scope">
          {{ scope.row.exchange_time|parseDateTime}}
        </template>
      </el-table-column>
      <el-table-column label="交易金额" width="120px" align="center">
        <template slot-scope="scope">
          <!--<span>{{ scope.row.author }}</span>-->
          <el-tag>{{ scope.row.exchange_amount }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="升数" width="120px" align="center">
        <template slot-scope="scope">
          <!--<span>{{ scope.row.author }}</span>-->
          <el-tag>{{ scope.row.oil_l }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="开票状态" width="100px" align="center">
        <template slot-scope="scope">
          <!--<span style="color:red;">{{ scope.row.reviewer }}</span>-->
          {{ scope.row.ticket_state }}
        </template>
      </el-table-column>
      <el-table-column label="油站名称" width="120px" align="center">
        <template slot-scope="scope">
          <!--<span style="color:red;">{{ scope.row.reviewer }}</span>-->
          {{ scope.row.station_name }}
        </template>
      </el-table-column>
      <el-table-column label="收银员" width="120px" align="center">
        <template slot-scope="scope">
          <!--<span style="color:red;">{{ scope.row.reviewer }}</span>-->
          {{ scope.row.sale_name }}
        </template>
      </el-table-column>
      <el-table-column label="终端号" width="120px" align="center">
        <template slot-scope="scope">
          <!--<span style="color:red;">{{ scope.row.reviewer }}</span>-->
          {{ scope.row.terminal_id }}
        </template>
      </el-table-column>
      <el-table-column label="外部流水号" width="200px">
        <template slot-scope="scope">
          <!--<span>{{ scope.row.oil_change_date | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>-->
          <span>{{ scope.row.memo }}</span>
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

    <pagination style=" margin-top: 10px;" v-show="total>0" :total="total" :page.sync="listQuery.pageNum"
                :pageSizes="[50,100,150,200]"
                :limit.sync="listQuery.pageSize"
                @pagination="getList"/>

    <el-card class="box-card">
      <div class="text item">
        总交易笔数: {{total}}
      </div>
      <div class="text item">
        总交易金额: {{bussinessTotalMoney}}
      </div>
    </el-card>

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
    getMerchantList,
    getRecordInfo
  } from '@/api/balanceManage'
  import waves from '@/directive/waves' // Waves directive
  import {parseTime, parseDateTime} from '@/utils'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import {fetchStations} from '@/api/gasPriceManage'

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
        exchange_type:'',
        merchant_id:'',
        addstoreList: [
          {store_id: 12, store_name: '支付宝'},
          {store_id: 13, store_name: '微信'},
          {store_id: 14, store_name: '油信宝'},
          {store_id: 15, store_name: '翼支付'},
          {store_id: 5, store_name: '沃支付'}
        ],
        pickerOptions2: {
          shortcuts: [
            {
              text: '最近一天',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                picker.$emit('pick', [start, end])
              }
            },{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          },
            {
              text: '全部',
              onClick(picker) {
                const end = ""
                const start = ""
                picker.$emit('pick', [start, end])
              }
            }]
        },
        bussinessTotalDeal: 100,
        bussinessTotalMoney: 9000,
        roleId: '',
        inputMinMas: {min: 1, max: 100},
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        disabledNow: false,
        nowBalance: 0,
        nowUsername: '',
        balance_apply: '',
        balance_merchant_id: '',
        merchantList: [],
        userMerchantId: '',
        listQuery: {
          // merchant_id: 0,
          begin_date: '',
          end_date: '',
          privice_id: '',
          city_id: '',
          merchant_id: '',
          exchange_type: '',
          pageNum: 1,
          pageSize: 100,
          dataType: 1
          // importance: undefined,
          // title: undefined,
          // type: undefined,
          // sort: '+id'
        },
        stationQuery: {
          dataType: 1, // 1 province, 2 city, 3 station
          province_id: '',
          city_id: ''
        },
        provinceOptions: [
          {key: '1', display_name: '四川'},
          {key: '2', display_name: '广东'}
        ],
        cityOptions: [
          {key: '1', display_name: '成都'},
          {key: '2', display_name: '绵阳'}
        ],
        gasStationOptions: [
          {key: '1', display_name: '高薪加油站'},
          {key: '2', display_name: '飞云加油站'}
        ],
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
      this.listQuery.merchant_id = localStorage.getItem("userMerchantId")
      console.log(this.listQuery.merchant_id)
      this.listQuery.begin_date = new Date()
      this.listQuery.end_date = new Date()
      // this.listQuery.modifyDate = [new Date(),new Date()]
      this.getList()
      this.getMerchantList()
      this.roleId = localStorage.getItem('roleId')
      this.getProvinceList()
    },
    methods: {
      chooseProvince() {
        this.getStationList()
      },
      getProvinceList() {
        this.listLoading = true
        // this.cityOptions.length = 0
        // this.gasStationOptions.length = 0
        fetchStations(this.stationQuery).then(response => {
          this.provinceOptions = response.data.data
          // Just to simulate the time of the request
          this.listLoading = false
        })
      },
      getCityList(provinceId) {
        this.tempDate.city_id = ''
        this.tempDate.oil_station_id = ''
        if (provinceId) {
          this.stationQuery.dataType = 2
          this.stationQuery.province_id = provinceId
        }
        this.listLoading = true
        fetchStations(this.stationQuery).then(response => {
          this.cityOptions = response.data.data
          // Just to simulate the time of the request
          this.listLoading = false
        })
      },
      getStationList(cityId) {
        this.tempDate.oil_station_id = ''
        if (cityId) {
          this.stationQuery.dataType = 3
          this.stationQuery.province_id = this.tempDate.province_id
          this.stationQuery.city_id = cityId
        }
        this.listLoading = true
        fetchStations(this.stationQuery).then(response => {
          this.gasStationOptions = response.data.data
          // Just to simulate the time of the request
          this.listLoading = false
        })
      },
      getList() {
        this.listLoading = true
        getRecordInfo(this.listQuery).then(response => {
          if (response.data.data.length > 0) {
            this.list = response.data.data
            this.nowUsername = response.data.data[0].merchant
            this.nowBalance = response.data.balance_money
            this.balance_apply = response.data.balance_apply
            this.balance_merchant_id = response.data.balance_merchant_id
            this.bussinessTotalMoney = response.data.sum_amount
            this.total = response.data.total_count

          } else {
            this.list = []
            this.balance_merchant_id = response.data.balance_merchant_id
            this.bussinessTotalMoney = response.data.sum_amount
            this.total = response.data.total_count
          }
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

      handleFilterDate(item) {
        this.listQuery.pageNum = 1
        if(item==null){
          this.listQuery.begin_date = ''
          this.listQuery.end_date = ''
        }
        else{
          this.listQuery.begin_date = item[0]
          this.listQuery.end_date = item[1]
        }
        this.getList()
      },
      handleFilterProvince(item) {

        this.listQuery.pageNum = 1
        this.listQuery.privice_id = item

        this.getList()
      },
      handleFilterCity(item) {

        this.listQuery.pageNum = 1
        this.listQuery.city_id = item

        this.getList()
      },
      handleFilterExchangeType(item) {

        this.listQuery.pageNum = 1
        this.listQuery.merchant_id = item
        this.getList()
      },
      handleFilterPayType(item) {

        this.listQuery.pageNum = 1
        this.listQuery.exchange_type = item
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
          if(obj.exchange_time){
            obj.exchange_time = parseDateTime(obj.exchange_time)
          }
        })
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['流水号', 'APP商户名称', '商品名称', '税收分类编号', '商品单价', '交易方式', '交易日期', '交易金额', '升数', '开票状态', '油站名称','收银员','终端号','外部流水号']
          const filterVal = ['recores_num', 'appstore_name', 'consumable', 'tax_callssfication_code', 'unit_price', 'exchange_type', 'exchange_time', 'exchange_amount', 'oil_l','ticket_state','station_name','sale_name','terminal_id','memo']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '流水记录'
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
<style>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
  }
</style>
