<template>
  <div class="app-container" v-loading="listLoading">
    <div class="filter-container">
      <el-date-picker
        v-model="listQuery.modifyDate"
        :picker-options="pickerOptions2"
        type="daterange"
        align="right"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        unlink-panels
        range-separator=""
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="handleFilterDate"/>
      <el-select v-if="roleId!=6" v-model="names" clearable placeholder="选择平台"
                  style="width: 130px;margin-left: 20px;"
                  @change="handleFilterExchangeType">
         <el-option v-for="item in merchantList" :key="item.balance_id" :label="item.balance_merchant"
                    :value="item.balance_id"/>
       </el-select>
      <el-select v-if="roleId!=6" v-model="oiltype" clearable placeholder="选择油品"
                 style="width: 130px;margin-left: 20px;"
                 @change="handleFilterPayType">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.name"
                   :value="item.name"/>
      </el-select>
      <!--<el-select v-if="roleId!=6" v-model="pushtype" clearable placeholder="是否推送"-->
                 <!--style="width: 130px;margin-left: 20px;"-->
                 <!--@change="handleFilterPayType">-->
        <!--<el-option v-for="item in PushList" :key="item.id" :label="item.text"-->
                   <!--:value="item.id"/>-->
      <!--</el-select>-->
      <el-input class="inputs" style="width:200px;margin:0 20px;height: 36px!important;line-height: 36px!important;" size="small"  placeholder="请输入加油站" v-model="listQuery.station_name" ></el-input>
      <el-button @click="gotodata">搜索</el-button>
    </div>
    <div class="coopon-right">
      <el-button v-if="roleId==5" type="primary" style="margin:0;width: 100px"
                 @click="handlePushload">推送</el-button>
      <el-button icon="el-icon-download" v-waves :loading="downloadLoading" type="primary"
                 @click="handleDownload">导出</el-button>
      <el-button>视图(保留)</el-button>
      <el-select v-if="roleId!=6" v-model="ascdesctxt" clearable placeholder="默认升序"
                 style="width: 160px;margin-left: 20px;"
                 @change="clickdescType">
        <el-option v-for="items in ascdesc" :key="items.id" :label="items.names"
                   :value="items.id"/>
      </el-select>

    </div>

    <el-dialog
      :before-close="handleClose"
      :visible.sync="dialogPushVisible"
      title="提示"
      width="30%">
      <div style="display: flex;justify-content: center;">
        <span style="text-align: center;font-size: 20px;width: 100%;">是否推送？</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogPushVisible = false">取 消</el-button>
        <el-button type="primary" @click="PushClick">确 定</el-button>
      </span>
    </el-dialog>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;max-height: 550px;overflow-y: scroll;"
      @sort-change="sortChange"
      @selection-change="SelectionPushChange"
      >
      <el-table-column
        type="selection"
        width="40"/>
      <el-table-column label="流水号" prop="oil_id" sortable="custom" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.recores_num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="APP商户名称" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.appstore_name === null?'无':scope.row.appstore_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.consumable }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品单价" width="100px" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.unit_price }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="交易金额" width="100px" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.exchange_amount/100 }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="消费升数" width="100px" align="center">
        <template slot-scope="scope">
          <el-tag>{{ (scope.row.oil_l*100).toFixed(2) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="消费时间" width="180px" align="center">
        <template slot-scope="scope">
          {{ scope.row.exchange_time}}
        </template>
      </el-table-column>
      <el-table-column label="消费地点" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.station_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请流水号" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.apply_tradeId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="使用电子券码" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.coupon_no }}</span>
        </template>
      </el-table-column>
      <el-table-column label="推送结果" width="100px" align="center">
        <template slot-scope="scope">
          <el-tag>{{scope.row.ticket_state}}</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <pagination style=" margin-top: 10px;" v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :pageSizes="[50,100,150,200]"
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
    getRecordInfo,
    GetCouponRecordInfo
  } from '@/api/balanceManage'
  import waves from '@/directive/waves' // Waves directive
  import {parseTime, parseDateTime} from '@/utils'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import {fetchStations} from '@/api/gasPriceManage'

  const calendarTypeOptions = [
    {key: '22', name: '92号 车用汽油(ⅥA)'},
    {key: '13', name: '95号 车用汽油(ⅥA)'},
    {key: '4', name: '98号 车用汽油(ⅥA)'}
  ]
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
      // parseDateTime(str) {
      //   return parseDateTime(str)
      // },
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
        PushList:[
          {text:'已推送',id:1},
          {text:'未推送',id:2}
        ],
        dialogPushVisible:false,
        pushtype:'',
        exchange_type:'',
        merchant_id:0,
        ascdesctxt:'',
        names:'',
        oiltype:'',
        inx:0,
        addstoreList: [
          {store_id: 12, store_name:92},
          {store_id: 13, store_name: 95},
          // {store_id: 14, store_name: '油信宝'},
          // {store_id: 15, store_name: '翼支付'},
          {store_id: 5, store_name: 98}
        ],
        ascdesc:[
          {id:1,names:'升序'},
          {id:2,names:'降序'}
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
            },
            {
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
        bussinessTotalMoney: 0,
        roleId: '',
        inputMinMas: {min: 1, max: 100},
        tableKey: 0,
        list: null,
        total: 0,
        listss:'',
        listLoading: true,
        disabledNow: false,
        nowBalance: 0,
        nowUsername: '',
        balance_apply: '',
        balance_merchant_id: '',
        merchantList: [],
        listQuery: {
          begin_date: '',
          end_date: '',
          merchant_id:'',
          oil_type:'',
          station_name:'',
          pageNum: 1,
          pageSize: 100,
          modifyDate:[]
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
        downloadLoading: false,
        NumFlow:[],
        PushFlow:[],
        PushForm:{
          mchid:'',
          couponList:''
        }
      }
    },
    created() {
      this.listQuery.merchant_id=localStorage.getItem("userMerchantId")
      if(this.listQuery.merchant_id==0){
        this.listQuery.merchant_id=''
      }
      this.listQuery.modifyDate[0]=this.fun_date(-7)
      this.listQuery.modifyDate[1]=this.getDate()
      this.listQuery.begin_date=this.fun_date(-7)
      this.listQuery.end_date=this.getDate()
      this.getList()
      this.getMerchantList()
      this.roleId = localStorage.getItem('roleId')
      this.getProvinceList()
    },
    methods: {
      //获取当前日期
      getDate(type) {
        const date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        if (type === 'start') {
          year = year - 60;
        } else if (type === 'end') {
          year = year + 2;
        }
        month = month > 9 ? month : '0' + month;;
        day = day > 9 ? day : '0' + day;
        return `${year}-${month}-${day}`;
      },
      //设置日期前一个星期
      fun_date(aa){
        var date1 = new Date(),
          time1=date1.getFullYear()+"-"+(date1.getMonth()+1)+"-"+date1.getDate();//time1表示当前时间
        var date2 = new Date(date1);
        date2.setDate(date1.getDate()+aa);
        let month = date2.getMonth() + 1;
        let day = date2.getDate();
        month = month > 9 ? month : '0' + month;;
        day = day > 9 ? day : '0' + day;
        var time2 = date2.getFullYear()+"-"+month+"-"+day;
        return time2;
      },
      PushClick(){
        var _this=this
        this.PushForm.mchid=''
        this.PushForm.couponList=''
        var merid=JSON.parse(localStorage.getItem('userinfo')).MS_MERCHANT_ID
        // if(merid==0||merid=='0'){
        //   this.PushForm.mchid=''
        // }
        // else{
          this.PushForm.mchid=merid
        // }
        if(this.PushFlow.length==1){
          this.PushForm.couponList=this.PushFlow[0].coupon_no
        }
        else{
          this.PushFlow.forEach((item,index)=>{
            if(this.PushFlow.length==index+1){
              this.PushForm.couponList+=item.coupon_no
            }
            else{
              this.PushForm.couponList+=item.coupon_no+','
            }
          })
        }
        console.log(this.PushForm.couponList)
        this.dialogPushVisible=false
        this.listLoading=true
        $.ajax({
          type : "GET",
          contentType: 'application/x-www-form-urlencoded;charset=utf-8',
          url : `http://www.youxinbao.com.cn:8080/SendCouponData?param={mchid:"${_this.PushForm.mchid}",couponList:"${_this.PushForm.couponList}"}`,
          success : function(result) {
            this.listLoading=false
            // var data=JSON.parse(result)
            console.log(result)
            _this.getList()
            // if(data.success=='true'){
            //   _this.listLoadings=false
              _this.$notify({
                title: '',
                message: '数据处理成功',
                type: 'success',
                duration: 2000
              })
            // }
          },
          error : function(e){
            _this.listLoading=false
            _this.$notify({
              title: '',
              message: '数据推送失败',
              type: 'success',
              duration: 2000
            })
            console.log(e);
          }
        });
        // setTimeout(()=>{
        //   this.listLoading=false
        //   this.$message({
        //     message: '推送成功',
        //     type: 'success'
        //   })
        // },1000)
      },
      handlePushload(){
        if(this.PushFlow.length==0){
          this.$message({
            message: '请选择要推送的流水',
            type: 'error'
          })
        }
        else{
          this.dialogPushVisible=true
        }
      },
      //选择推送
      SelectionPushChange(val){
        this.PushFlow=val
        console.log(this.PushFlow)
      },
      chooseProvince() {
        this.getStationList()
      },
      //升序
      sortId(a,b){
        // return a.-b.id;
      },
      //判断是否是升序降序
      clickdescType(item){
        // this.listLoading = true
        this.ascdesctxt=item;
        console.log(item)
        if(this.ascdesctxt==1){
          var sortArr = this.list.sort(this.sortDownDate);
          console.log(sortArr)
          this.list =sortArr;
        }
        else{
          var sortArr = this.list.sort(this.sortUpDate);
          this.list =sortArr;
        }
      },
      sortDownDate(a, b) {
        return Date.parse(a.exchange_time) - Date.parse(b.exchange_time);
      },
      sortUpDate(a, b) {
        return Date.parse(b.exchange_time) - Date.parse(a.exchange_time);
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
      compare(obj1,obj2){
        var val1 = parseInt(obj1.exchange_time);
        var val2 = parseInt(obj2.exchange_time);
        if(val1 < val2){
          return 1;
        }else if(val1 > val2){
          return -1;
        }else{
          return 0;
        }
      },
      getList() {
        this.listLoading = true
        this.listQuery.oil_type=(this.listQuery.oil_type)
        GetCouponRecordInfo(this.listQuery).then(response => {
          console.log(response.data);
          if (response.data.data.length > 0) {
            this.listss=response.data.data
             for(var i=0;i<response.data.data.length;i++){
               var year=response.data.data[i].exchange_date.substring(0,4);//年
               var months=response.data.data[i].exchange_date.substring(4,6);//月
               var day=response.data.data[i].exchange_date.substring(6,8);//日
               var hours=response.data.data[i].exchange_time.substring(0,2);//时
               var minints=response.data.data[i].exchange_time.substring(2,4);//分
               var keys=response.data.data[i].exchange_time.substring(4,6);//秒
               response.data.data[i].exchange_time=year+'-'+months+'-'+day +' '+hours+':'+minints+':'+keys;
             }
            this.list=response.data.data
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
      handleFilterExchangeType(name) {
        this.listQuery.pageNum = 1
        this.listQuery.merchant_id =name
        console.log(this.listQuery.merchant_id)
        // this.names=name
        // this.getList()
      },
      handleFilterPayType(a) {
        this.listQuery.pageNum = 1
        this.listQuery.oil_type =a
        // this.oiltype=a
        // this.getList()
      },
      gotodata(){
        if(this.listQuery.begin_date==''){
          this.$message.error('请选择日期')
          return
        }
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
        var listQuerys={
          begin_date:this.listQuery.begin_date,
          end_date:this.listQuery.end_date,
          merchant_id:this.listQuery.merchant_id,
          oil_type:this.listQuery.oil_type,
          station_name:this.listQuery.station_name,
          pageNum: 1,
          pageSize:100000000
        }
        GetCouponRecordInfo(listQuerys).then(response => {
          console.log(response.data);
          if (response.data.data.length > 0) {
            for(var i=0;i<response.data.data.length;i++){
              console.log(response.data.data[i].exchange_time);
              var year=response.data.data[i].exchange_date.substring(0,4);//年
              var months=response.data.data[i].exchange_date.substring(4,6);//月
              var day=response.data.data[i].exchange_date.substring(6,8);//日
              var hours=response.data.data[i].exchange_time.substring(0,2);//时
              var minints=response.data.data[i].exchange_time.substring(2,4);//分
              var keys=response.data.data[i].exchange_time.substring(4,6);//秒
              response.data.data[i].exchange_amount=response.data.data[i].exchange_amount/100
              response.data.data[i].oil_l=(response.data.data[i].oil_l*100).toFixed(2)
              response.data.data[i].exchange_time=year+'-'+months+'-'+day +' '+hours+':'+minints+':'+keys;
            }
            this.NumFlow=response.data.data.sort(this.sortDownDate);
            console.log(this.NumFlow)
            import('@/vendor/Export2Excel').then(excel => {
              const tHeader = ['流水号', 'APP商户名称', '商品名称', '商品单价', '交易金额', '消费升数', '消费时间', '消费地点', '申请流水号','使用电子券码', '开票状态']
              const filterVal = ['recores_num', 'appstore_name', 'consumable',  'unit_price', 'exchange_amount', 'oil_l', 'exchange_time', 'station_name','apply_tradeId','coupon_no','ticket_state']
              const data = this.formatJson(filterVal, this.NumFlow)
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: '总流水记录'
              })
              this.downloadLoading = false
            })
          } else {
            this.NumFlow = []
          }
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
      },
      getNumFlow(){

      }
    }
  }
</script>
<style lang="scss" scoped>
  .inputs{
    .el-input__inner{
      height: 36px!important;
      line-height: 36px!important;
    }
  }
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
  .filter-container{
    float: left;
  }
  .coopon-right{
    float: right;
  }
</style>
