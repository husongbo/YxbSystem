<template>
  <div class="app-container">
    <div class="filter-container">
    </div>
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="Userinfo"
      border
      fit
      highlight-current-row
      style="width: 100%;max-height: 550px;overflow-y: scroll;"
      @sort-change="">
      <el-table-column label="商户名称" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.merchant_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人姓名" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.merchant_contacts }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人手机号" width="200px" align="center">
        <template slot-scope="scope">
          <!--<span>{{ scope.row.author }}</span>-->
          <span>{{ scope.row.merchant_phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系地址" width="250px" align="center">
        <template slot-scope="scope">
          <!--<span>{{ scope.row.author }}</span>-->
          <span>{{ scope.row.merchant_address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="企业注册信息" width="230px" align="center">
        <template slot-scope="scope">
          <!--<span style="color:red;">{{ scope.row.reviewer }}</span>-->
          <span>{{ scope.row.merchant_company }}</span>
        </template>
      </el-table-column>

      <el-table-column label="统一社会信用代码" width="180px">
        <template slot-scope="scope">
          <!--<span>{{ scope.row.oil_change_date | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>-->
          <span type="info">{{ scope.row.merchant_yydm }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合同编号" width="180px">
        <template slot-scope="scope">
          <!--<span>{{ scope.row.oil_change_date | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>-->
          <el-tag type="info">{{ scope.row.merchant_htbh }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否审核" width="120px">
        <template slot-scope="scope">
          <!--<span>{{ scope.row.oil_change_date | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>-->
          <el-tag type="info">未审核</el-tag>
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
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">审核</el-button>
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
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      :pageSizes="[50,100,150,200]"
      @pagination="getList"/>

    <el-dialog title="审核" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="edituserinfo"
        label-position="left"
        label-width="120px"
        style="width: 420px; margin-left:50px;">
        <el-form-item label="企业注册信息" prop="oil_base_price">
        </el-form-item>
        <el-form-item label="企业注册信息" prop="oil_base_price">
          <el-input v-model="edituserinfo.merchant_company" clearable disabled/>
        </el-form-item>
        <el-form-item label="社会信用代码" prop="oil_change_date">
          <el-input v-model="edituserinfo.merchant_yydm" clearable disabled/>
        </el-form-item>
        <el-form-item label="合同编号" prop="oil_change_date">
          <el-input v-model="edituserinfo.merchant_htbh" clearable disabled/>
        </el-form-item>
        <el-form-item label="营业执照" prop="oil_change_date">
          <el-popover
            placement="right"
            trigger="hover">
            <a :href="['http://gwtest.youxinbao.com.cn'+edituserinfo.merchant_img_yyzz]" download="">
            <img :src="['http://gwtest.youxinbao.com.cn'+edituserinfo.merchant_img_yyzz]" width="300px" height="250px">
            </a>
            <img slot="reference" :src="['http://gwtest.youxinbao.com.cn'+edituserinfo.merchant_img_yyzz]" width="150px" height="100px"/>
          </el-popover>
        </el-form-item>
        <el-form-item label="开户许可证" prop="oil_change_date">
          <el-popover
            placement="right"
            trigger="hover">
            <a :href="['http://gwtest.youxinbao.com.cn'+edituserinfo.merchant_img_khxk]" download="">
            <img :src="['http://gwtest.youxinbao.com.cn'+edituserinfo.merchant_img_khxk]" width="300px" height="250px">
            </a>
            <img slot="reference" :src="['http://gwtest.youxinbao.com.cn'+edituserinfo.merchant_img_khxk]" width="150px" height="100px"/>
          </el-popover>
        </el-form-item>


        <el-form-item label="合同扫描件" prop="oil_change_date">
          <el-button type="primary" size="mini"><a :href="['http://gwtest.youxinbao.com.cn'+edituserinfo.merchant_img_htbh]">预览</a></el-button>
          <!--<el-popover-->
            <!--placement="right"-->
            <!--trigger="hover">-->
            <!--<a :href="['http://gwtest.youxinbao.com.cn'+edituserinfo.merchant_img_htbh]" download="">-->
            <!--<img :src="['http://gwtest.youxinbao.com.cn'+edituserinfo.merchant_img_htbh]" width="300px" height="250px">-->
            <!--</a>-->
            <!--<img slot="reference" :src="['http://gwtest.youxinbao.com.cn'+edituserinfo.merchant_img_htbh]" width="150px" height="100px"/>-->
            <!--&lt;!&ndash;<img slot="reference" src="http://localhost:9527/a29f00cd-22f1-4795-b248-f9ae8902eabc" width="150px" height="100px"/>&ndash;&gt;-->
          <!--</el-popover>-->

        </el-form-item>
        <el-form-item label="是否审核" prop="oil_change_date">
          <template >
            <el-radio v-model="radio" label="1">确认审核</el-radio>
            <el-radio v-model="radio" label="2">审核驳回</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="驳回原因" prop="oil_change_date" :style="{visibility:visit}">
          <el-select  v-model="MerchantInfo.data_text" clearable placeholder="选择原因"
                     style="width: 200px;"
                     @change="handleFilterExchangeType">
            <el-option v-for="item in Reason" :key="item.key" :label="item.text"
                       :value="item.text"/>
          </el-select>
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
        <el-button type="primary" @click="createData(edituserinfo.id)">{{canelsh}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { fetchList, createUnifiedPrice, fetchPv } from '@/api/gasPriceManage'
  import { getBalanceInfoList, getBalanceHistoryInfoList, subMitBalanceApplyInfo,GetRegisterMerchantList,AuditMerchantInfo} from '@/api/balanceManage'
  import waves from '@/directive/waves' // Waves directive
  import { parseTime, parseDateTime } from '@/utils'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  // import pdf from '@/components/pdf'
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
        isshowpdf:false,
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        disabledNow: false,
        nowBalance: 0,
        nowUsername: '',
        balance_apply: '',
        canelsh:'确认审核',
        visit:'hidden',
        Reason:[
          {
            key:1,
            text:'该信息不符合规定'
          },
          {
            key:2,
            text:'个人信息没有完善'
          },{
            key:3,
            text:'其它'
          }
        ],
        reasontxt:'',
        radio:'1',
        balance_merchant_id: '',
        listQuery: {
          // username: localStorage.getItem('username'),
          pageNum: 1,
          pageSize: 100,
          data_state:0,
          // dataType: 1
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
        Userinfo:[],
        edituserinfo:{
          merchant_company:'',
          merchant_contacts:'',
          merchant_htbh:'',
          merchant_img_htbh:'',
          merchant_img_khxk:'',
          merchant_img_yyzz:'',
          merchant_name:'',
          merchant_phone:'',
          merchant_state:'',
          merchant_yydm:''
        },
        MerchantInfo:{
          merchant_id:'',
          data_state:0,
          data_text:''
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
    watch:{
      radio(news,olds){
        if(parseInt(news)==2){
          this.visit="visible"
          this.canelsh="审核驳回"
        }
        else{
          this.visit="hidden"
          this.canelsh="确认审核"
        }
      }
    },
    methods: {
      getList() {
        this.listLoading = true
        GetRegisterMerchantList(this.listQuery).then(response => {
          console.log(response.data)
          this.Userinfo=response.data.data
          this.total=response.data.total_count
          console.log(this.Userinfo)
        })
        this.listLoading = false
      },
      handleFilterExchangeType(item){
        this.MerchantInfo.data_text=item
        // alert(item)
      },
      closepdf(){
        this.isshowpdf=false
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
      createData(id) {
        this.MerchantInfo.merchant_id=id
        this.MerchantInfo.data_state=this.radio
        // alert(this.MerchantInfo.data_state)
        AuditMerchantInfo(this.MerchantInfo).then((res)=>{
          if(res.data.result==0&&parseInt(this.MerchantInfo.data_state)==1){
            this.getList();
            this.$notify({
              title: '成功',
              message: '审核成功',
              type: 'success',
              duration: 2000
            })
          }
          else if(res.data.result==0&&parseInt(this.MerchantInfo.data_state)==2){
            this.getList();
            this.$notify({
              title: '成功',
              message: '驳回成功',
              type: 'success',
              duration: 2000
            })
          }
        })
        this.dialogFormVisible=false
      },
      handleUpdate(row) {
        this.edituserinfo = Object.assign({}, row) // copy obj
        console.log(this.edituserinfo)
        this.disabledNow = true
        // this.dialogStatus = 'update'
        // this.tempAllData.method = 'edit'
        this.dialogFormVisible = true
        // this.$nextTick(() => {
        //   this.$refs['dataForm'].clearValidate()
        // })
        // console.log(this.tempAllData.method)
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
<style>
  .el-dialog{
    margin-top: 5vh!important;
  }
</style>
