<template>
  <div class="app-container" v-loading="listLoadings">
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
      <el-select v-if="roleId!=6&&merId!=null" v-model="names" clearable placeholder="商户号"
                 style="width: 200px;margin-left: 20px;"
                 @change="handleFilterExchangeType">
        <el-option v-for="item in merchantList" :key="item.balance_id" :label="item.balance_merchant"
                   :value="item.balance_id"/>
      </el-select>



      <el-select v-if="roleId!=6" v-model="zttype" clearable placeholder="变动类型"
                 style="width: 150px;margin-left: 20px;"
                 @change="zttypees">
        <el-option v-for="item in Typezt" :key="item.key" :label="item.name"
                   :value="item.key"/>
      </el-select>
      <el-select v-if="roleId!=6" v-model="zttypes" clearable placeholder="请求码"
                 style="width: 150px;margin-left: 20px;"
                 @change="retypees">
        <el-option v-for="item in lists" :key="item.key" :label="item"
                   :value="item"/>
      </el-select>
    </div>
    <div class="coopon-right">
      <!--<el-button   type="info"-->
                 <!--@click="getExceptions">作废电子券结算</el-button>-->
      <el-button icon="el-icon-download" v-waves :loading="downloadLoading" type="primary"
                 @click="handleDownload">导出</el-button>
      <el-select v-if="roleId!=6" v-model="ascdesctxt" clearable placeholder="默认升序"
                 style="width: 160px;margin-left: 20px;"
                 @change="clickdescType">
        <el-option v-for="items in ascdesc" :key="items.id" :label="items.names"
                   :value="items.id"/>
      </el-select>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;max-height: 550px;overflow-y: scroll;"
      @sort-change="sortChange"
      @selection-change="SelectionChange">
      <el-table-column label="序号" prop="oil_id" sortable="custom" align="center" width="250">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商户" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.merchant_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="金额" width="200px" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.amount }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="200px" align="center">
        <template slot-scope="scope">
          <!--<span>{{ scope.row.author }}</span>-->
          <el-tag>{{ scope.row.log_type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="电子券请求码" width="250px" align="center" v-if="flagroleid">
        <template slot-scope="scope">
          <!--<span>{{ scope.row.author }}</span>-->
          <span>{{ scope.row.coupon_request_no }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电子券作废券码" width="250px" align="center">
        <template slot-scope="scope">
          <!--<span>{{ scope.row.author }}</span>-->
          <span>{{ scope.row.coupon_no }}</span>
        </template>
      </el-table-column>
      <el-table-column label="记录创建时间" width="250px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.log_time|parseDateTime }}</span>
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
    <el-dialog  title="编辑"  :visible.sync="dialogeditVisible">
      <el-form ref="dataForm" :rules="rules" :model="model_infotwos" label-position="left" label-width="120px" style="width: 420px; margin-left:50px;">
        <el-form-item label="变更预警值" prop="oil_change_date">
          <el-input
            v-model="model_infotwos.model_info.coupon_early_warning_line"
            placeholder="请输入变更值"
            clearable/>
        </el-form-item>
        <el-form-item label="状态变更状态">
          <el-switch
            v-model="status_model"
            active-value="aa"
            @change="switchedits($event)"
            inactive-value=bb
            active-color="#13ce66"
            inactive-color="#ccc"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogeditVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="editvisable">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>


    <el-dialog class="msg"  title="作废电子券结算"  :visible.sync="WasteElectrons" style="margin-top: 0!important;">
      <div style="width: 40%;margin: 0 auto;font-size:13px;letter-spacing: 2px;text-indent:25px;line-height: 20px;">
        确认结算后系统将执行备付金恢复流程，商户自然月内未核销电子券金额将自动补足为商户备付金。
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="WasteElectrons = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="Determine">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>


    <el-dialog
      title="电子券列表"
      :visible.sync="userDialogVisible"
      append-to-body
      width="70%" style="">
      <div class="block" style="margin-left: 0;">
        <span class="demonstration"></span>
        <el-date-picker
          v-model="Months"
          type="month"
          @change="selectmonths"
          placeholder="选择月">
        </el-date-picker>
      </div>
      <div class="block">
      </div>
      <el-table
        v-loading="listLoading"
        :key="tableKey"
        :data="ExData"
        height="250"
        size="small"
        header-align="center"
        style="width: 100%;max-height:400px;overflow-y: scroll;"
      >
        <el-table-column
          prop="ID"
          label="序号"
          center
          align="center"
          header-align="center"/>
        <el-table-column
          prop="Coupon_Amount"
          label="金额"
          center
          align="center"
          header-align="center"/>
        <el-table-column
          prop="Counpon_RequestCode"
          label="电子券请求码"
          center
          align="center"
          header-align="center"/>
        <el-table-column
          prop="Coupon_No"
          label="电子券作废码"
          center
          align="center"
          header-align="center"/>
        <el-table-column label="电子券生成时间" width="250px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.DATA_CREATE_TIME }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-card class="box-card" style="margin-top: 40px;">
        <div class="text item">
          总交易笔数: {{totals}}
        </div>
        <div class="text item">
          总交易金额: {{bussinessTotalMoneys}}
        </div>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDownloads">导出</el-button>
    <!--<el-button type="primary" @click="Settlement">结算</el-button>-->
      </span>
    </el-dialog>




    <el-dialog
      title="提示(是否导出)"
      :visible.sync="dialogoutVisible"
      width="30%"
      :before-close="handleCloses">
      <div>你一共选择了<el-tag>{{checkedlen}}</el-tag>条记录</div>
      <div style="margin-top: 15px;">总金额:<el-tag>{{checkedprice}}</el-tag></div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogoutVisible = false">取 消</el-button>
    <el-button type="primary" @click="handleDownload">确 定</el-button>
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
    GetCouponRecordInfo,
    GetCouponTicketRecods,
    SubMitCouponTicketApplyInfo,
    GetCouponBalanceInfo,
    SubMitCouponApplyInfo,
    GetMerchantBalanceLog,
    GetExprieCoupon,
  } from '@/api/balanceManage'
  import waves from '@/directive/waves' // Waves directive
  import {parseTime, parseDateTime} from '@/utils'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import {fetchStations} from '@/api/gasPriceManage'

  const calendarTypeOptions = [
    {key: '2', name: '油信宝'},
    {key: '15', name: '智慧城'},
    {key: '16', name: '车友网'},
    {key: '18', name: '车友邦'},
    {key: '19', name: '车友惠'}
  ]

  const invoiceTypeOptions=[
    {key:'1',name:'购买电子券'},
    {key:'2',name:'电子券作废'},
    {key:'3',name:'新增备付金'}
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
      parseDateTime(str) {
        return parseDateTime(str)
      },
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
        //判断是否选中
        checkedinvoices:[],
        merId:'',
        ascdesctxt:'',
        list_query:{
          coupon_list:'',//选中的id
          types:''
        },
        WasteElectrons:false,
        userDialogVisible:false,
        checkget:'',
        checkedprice:0,//选中的价格
        Months:'',//月
        model_infos:{
          model_info:{
            id:0,
            coupon_type:0,//类型
            coupon_amount:'',//总金额
            coupon_requestCode:'',//请求码
            coupon_effectiveTime:'',
            coupon_expirdDate:'',
            coupon_early_warning_line:'',//预警值
            coupon_data_status:1,//状态
            coupon_warning_status:0,//变更状态
            coupon_bancle:''
          },
          method:''
        },
        status_model:'bb',
        status_add:'open',
        model_infotwos:{
          model_info:{
            id:0,
            coupon_early_warning_line:'',//预警值
            coupon_data_status:0,//变更状态
          },
          method:''
        },
        Typezt:[
          {key:'1',name:'购买电子券'},
          {key:'2',name:'电子券作废'},
          {key:'3',name:'新增备付金'},
          // {key:'4',name:'电子券过期'}
        ],
        closeopen:0,
        checkedlen:0,//条数
        dialogokVisible:false,
        dialogoutVisible:false,
        dialogeditVisible:false,//编辑
        dialogaddVisible:false,//增加
        switchadd:'true',
        switchedit:'true',
        exchange_type:'',
        merchant_id:0,
        ascdesctxt:'',
        names:'',
        oiltype:'',
        zttype:'',
        zttypes:'',
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
        bussinessTotalMoneys:0,
        roleId: '',
        inputMinMas: {min: 1, max: 100},
        tableKey: 0,
        list: null,
        total: 0,
        totals:0,
        listLoadings:false,
        listLoading: true,
        disabledNow: false,
        nowBalance: 0,
        inx:0,
        nowUsername: '',
        balance_apply: '',
        balance_merchant_id: '',
        merchantList: [],
        listQuery: {
          begin_date: '',
          end_date: '',
          pageNum: 1,
          pageSize: 100,
          merchant_id:0,
          balance_type:0,
          coupon_request_no:'',
        },
        listQuerys: {
          begin_date: '',
          end_date: '',
          pageNum: 1,
          pageSize: 100,
          merchant_id:0,
          balance_type:0,
          coupon_request_no:'',
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
        invoiceTypeOptions,
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
        listLoadings:false,
        dialogFormVisible: false,
        dialogDeleteVisible: false,
        dialogStatus: '',
        lists:'',
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
        flagroleid:false,
        ExData:[],
        exportData:[],
        NoForm:{
          mchid:'',
          month:''
        }
      }
    },
    created() {
      // this.getexportlist()
      // this.listQuery.begin_date = new Date()
      // this.listQuery.end_date = new Date()
      // this.listQuery.modifyDate = [new Date()+'',new Date()+'']
      var roleid=localStorage.getItem('roleId')
      if(roleid==3||roleid==4||roleid==5||roleid==7){
        this.flagroleid=true
      }
      this.merId=localStorage.getItem("userMerchantId")
      console.log(this.merId)
      if(this.merId==0){
        this.listQuery.merchant_id=0
      }
      else{
        this.listQuery.merchant_id=this.merId
      }
      this.getMerchantList()
      this.getList()

      this.roleId = localStorage.getItem('roleId')
      console.log(this.roleId)
      this.getProvinceList()
    },
    methods: {
      selectmonths(){
        if(this.Months==null){
          this.NoForm.month=''
        }
        else {
          const d = new Date(this.Months)
          const resDate = d.getFullYear() + '-' + this.p((d.getMonth() + 1))
          this.NoForm.month = resDate
        }
        this.getlists(this.NoForm)
        this.listLoading=true
        setTimeout(()=>{
          this.listLoading=false
        },1000)
        console.log(resDate)
      },
      p(s) {
        return s < 10 ? '0' + s : s
      },
      getExceptions(){
        var merid=JSON.parse(localStorage.getItem('userinfo')).MS_MERCHANT_ID
        if(merid==0||merid=='0'){
          this.NoForm.mchid=''
        }
        else{
          this.NoForm.mchid=merid
        }
        this.userDialogVisible=true
       this.getlists(this.NoForm)
        this.listLoading=true
        setTimeout(()=>{
          this.listLoading=false
        },1000)
      },
      Determine(){
        var _this=this
        _this.WasteElectrons=false
        $.ajax({
          //请求方式
          type : "GET",
          contentType: 'application/x-www-form-urlencoded;charset=utf-8',
          //请求的媒体类型
          //请求地址
          url : "http://www.youxinbao.com.cn:8080/CouponBalance",
          //数据，json字符串
          //请求成功
          success : function(result) {
            _this.listLoadings=true
            var data=JSON.parse(result)
            console.log(data)
            if(data.success=='true'){
                _this.listLoadings=false
                _this.$notify({
                  title: '',
                  message: '数据处理成功',
                  type: 'success',
                  duration: 2000
                })
            }
          },
          //请求失败，包含具体的错误信息
          error : function(e){
            _this.listLoadings=false
            _this.$notify({
              title: '',
              message: '数据处理失败',
              type: 'success',
              duration: 2000
            })
            console.log(e.status);
            console.log(e.responseText);
          }
        });
      },
      Settlement(){
        if(this.ExData.length==0){
          this.$message({
            message: '当前没有作废的电子券',
            type: 'error'
          })
          return;
        }
        this.userDialogVisible=false
        this.WasteElectrons=true
      },
      getlists(json){
        this.totals=0
        this.bussinessTotalMoneys=0
        var _this=this
        $.ajax({
          //请求方式
          type : "GET",
          // contentType: 'application/x-www-form-urlencoded;charset=utf-8',
          //请求的媒体类型
          //请求地址
          url : `http://www.youxinbao.com.cn:8080/GetExprieCoupon?param={mchid:"${json.mchid}",month:"${json.month}"}`,
          //数据，json字符串
          //请求成功
          success : function(result) {
            console.log(result)
            var datas=JSON.parse(result)
            console.log(datas)
            if(datas.result_message=='当前暂无需处理的数据'){
              _this.ExData=[]
              return
            }
            _this.ExData=JSON.parse(datas.data)
            // _this.totals=datas.result_message.replace(/[^0-9]/ig,"")
            console.log(_this.ExData)
            _this.ExData.forEach((item)=>{
              item.Coupon_Amount=item.Coupon_Amount/100
              _this.totals++
              _this.bussinessTotalMoneys+=parseFloat(item.Coupon_Amount)
            })
            _this.merchantList.forEach((items)=>{
              _this.ExData.forEach((i)=>{
                if(i.M0007_ID==items.balance_id){
                  i.M0007_ID=items.balance_merchant
                }
              })
            })
            console.log(_this.bussinessTotalMoneys);


          },
          //请求失败，包含具体的错误信息
          error : function(e){
            console.log(e.status);
            console.log(e.responseText);
          }
        });
      },
      getMerchantList(){
        getMerchantList({}).then(response => {
          this.checkget = response.data.data
          console.log("哈哈哈哈哈哈");
          console.log(this.checkget);
          // Just to simulate the time of the request
        })
      },
      insertdata(item){
        this.model_infos.model_info.coupon_effectiveTime=item[0];
        this.model_infos.model_info.coupon_expirdDate=item[1];
      },
      //选择分类
      DateTypeitem(val){
        this.model_infos.model_info.coupon_type=val
        console.log(val)
      },
      //编辑
      dialogedits(id,str){
        this.model_infotwos.model_info.id=id;
        // alert(id)
        if(str==1){
          this.status_model="aa"
          this.model_infotwos.model_info.coupon_data_status=1
        }
        else{
          this.status_model="bb"
          this.model_infotwos.model_info.coupon_data_status=0
        }

        this.dialogeditVisible=true
      },
      //编辑下的确定
      editvisable(){
        this.listLoading = true
        this.dialogeditVisible=false;
        this.model_infotwos.method='edit'
        // var id=this.model_infos.model_info.id
        // var txt=this.model_infos.model_info.coupon_early_warning_line
        // console.log("aaaaaaaaaaaaaaaaaaaaaa")
        console.log(this.model_infotwos)
        // if(this.closeopen===1){
        //   console.log("aaa")
        SubMitCouponApplyInfo(this.model_infotwos).then(response => {
          console.log(response);
          if(response.status==200){
            this.getList();

            this.listLoading = true
            this.switchedit='true'
          }
        })
        // }
        // console.log(id)
        // console.log(txt)
        // console.log(this.closeopen)
      },
      //增加下的确定
      createAdd(){
        this.listLoading = true
        this.model_infos.method='add'
        this.model_infos.model_info.coupon_bancle=this.model_infos.model_info.coupon_amount

        console.log(this.model_infos)
        if(this.model_infos.model_info.coupon_effectiveTime==""||this.model_infos.model_info.coupon_expirdDate==""){
          this.$message('请选择日期');
        }
        else {
          SubMitCouponApplyInfo(this.model_infos).then(response => {
            console.log(response);
            if (response.status == 200) {
              this.getList();

            }
            this.dialogaddVisible=false;
            this.listLoading = true
          })
        }
      },
      switchadds(val){
        if(val=="open"){
          this.model_infos.model_info.coupon_data_status=0
          // alert(this.model_infos.model_info.coupon_data_status)
        }
        else{
          this.model_infos.model_info.coupon_data_status=1
          // alert(this.model_infos.model_info.coupon_data_status)
        }
      },
      switchedits(val){
        if(val=="bb"){
          this.model_infotwos.model_info.coupon_data_status=2
          // alert(this.model_infotwos.model_info.coupon_data_status)
        }
        else{
          this.model_infotwos.model_info.coupon_data_status=1
          // alert(this.model_infotwos.model_info.coupon_data_status)
        }


        // this.closeopen=val
        // console.log(val);
      },
      SubmitInvoice(){
        // this.downloadLoading = true
        this.listLoading = true
        console.log(this.list_query.coupon_list)
        SubMitCouponTicketApplyInfo(this.list_query).then(response => {
          console.log(response);
          if (response.statusText==="OK"&&response.status==200) {
            console.log("ok");
            this.getList();
          } else {
            console.log("no");
          }
          this.listLoading = false
        })
        this.dialogokVisible=false
      },
      SelectionChange:function(val){
        this.checkedid=0;
        this.checkedinvoices=val[0]
        this.checkedid=this.checkedinvoices.id
        console.log(this.checkedid)
      },
      dialogoutVisibles(){
        console.log(this.checkedlen)
        if(this.checkedlen<=0){
          this.$message('您还没有选中任何一条记录')
        }
        else{
          this.dialogokVisible=true
        }
      },
      dialogokVisibles(){
        if(this.checkedlen<=0){
          this.$message('您还没有选中任何一条记录')
        }
        else{
          this.dialogoutVisible=true
        }
      },
      handleCloses(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
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
          this.ascdesctxt=item;
          if(this.ascdesctxt==1&&this.inx==1){
            this.list=this.list.reverse(function(a,b){
              return Date.parse(b.exchange_date) - Date.parse(a.exchange_date);

            });
            this.inx=0
          }

          else if(this.inx==1&&this.ascdesctxt==''){
            this.list=this.list.reverse(function(a,b){
              return Date.parse(b.exchange_date) - Date.parse(a.exchange_date);
            });
            this.inx=0
          }
          else if(this.ascdesctxt==2){
            this.inx=1
            this.list=this.list.reverse(function(a,b){
              return Date.parse(b.exchange_date) - Date.parse(a.exchange_date);
            });
          }
          else{
            return
          }
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
        var val1 = parseInt(obj1.sum_balance_amount);
        var val2 = parseInt(obj2.sum_balance_amount);
        if(val1 < val2){
          return 1;
        }else if(val1 > val2){
          return -1;
        }else{
          return 0;
        }
      },
      //状态
      zttypees(val){
        this.listQuery.balance_type=val
        this.getList()
      },
      retypees(val){
        this.listQuery.coupon_request_no=val
        this.getList()
      },
      getDateTime(date) {
        date=new Date(parseInt(date.replace("/Date(", "").replace(")/", ""), 10));
        var year = date.getFullYear();
        var month = date.getMonth() + 1>10 ? date.getMonth() + 1:'0'+(date.getMonth()+1);
        var day = date.getDate()>10 ? date.getDate():'0'+date.getDate();
        var hh = date.getHours()
        if(parseInt(hh)<10){
          hh='0'+hh
        }
        var mm = date.getMinutes();
        var ss = date.getSeconds();

        if(parseInt(mm)<10){
          mm='0'+mm

        }
        if(parseInt(ss)<10){
          ss='0'+ss
        }
        return year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + ss;
      },
      getexportlist(callback){
        var _this=this
       var listQuery={
            begin_date: this.listQuery.begin_date,
            end_date: this.listQuery.end_date,
            pageNum: 1,
            pageSize: 10000000,
            merchant_id:this.listQuery.merchant_id,
            balance_type:this.listQuery.balance_type,
            coupon_request_no:this.listQuery.coupon_request_no,
        }
        GetMerchantBalanceLog(listQuery).then(response => {
          console.log(response)
          if (response.data.data.length > 0) {
            this.exportData=response.data.data
            this.exportData.forEach((item)=>{
              item.log_time=this.getDateTime(item.log_time)
            })
            callback()
            // this.exportData=response.data.data.reverse(function(a,b){
            //   return Date.parse(b.log_time) - Date.parse(a.log_time);
            // });
            // this.exportData.forEach((item)=>{
            //   if(item.coupon_request_no!=null){
            //     _this.lists.push(item.coupon_request_no)
            //   }
            // })
            // this.lists=this.lists.sort().join(",,").replace(/(,|^)([^,]+)(,,\2)+(,|$)/g,"$1$2$4").replace(/,,+/g,",").replace(/,$/,"").split(",")
            // console.log(this.exportData)
          }
          else{
            this.exportData=[]
          }

        })
      },
      getList() {
        this.listLoadings = true
        // console.log(this.listQuery)
        if(this.listQuery.merchant_id==null||this.listQuery.merchant_id==''){
          this.listQuery.merchant_id=0
        }
        if(this.listQuery.balance_type==null||this.listQuery.balance_type==''){
          this.listQuery.balance_type=0
        }
        GetMerchantBalanceLog(this.listQuery).then(response => {
          var _this=this
          _this.lists=[]
          this.bussinessTotalMoney=0
          console.log(response);
          if (response.data.data.length > 0) {
            console.log(response.data.data)
            // var sortArr = response.data.data.sort(this.compare);
            this.list=response.data.data.reverse(function(a,b){
              return Date.parse(b.log_time) - Date.parse(a.log_time);
            });
            this.total = response.data.total_count
              this.bussinessTotalMoney=response.data.sum_amount
          } else {
            this.list = []
            // this.balance_merchant_id = response.data.balance_merchant_id
            this.bussinessTotalMoney = 0
            this.total = response.data.total_count
          }
          this.listLoadings = false
          this.switchadd='true'
        })
      },
      getMerchantList() {
        this.listLoading = true
        getMerchantList({}).then(response => {
          this.merchantList = response.data.data
          console.log(response.data.data);
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
      handleFilterDates(item) {
        this.model_infos.model_info.coupon_effectiveTime=item[0]
        this.model_infos.model_info.coupon_expirdDate=item[1]
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
        // this.listQuery.pageNum = 1

        this.listQuery.merchant_id =name
        this.getList()
      },
      handleFilterPayType(a) {
        this.listQuery.pageNum = 1
        this.listQuery.coupon_warning_status =a
        console.log(a)
        // console.log(this.listQuery.ticket_type);
        // this.oiltype=a
        this.getList()
      },
      gotodata(){
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
      handleDownloads(){
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          var roleid=localStorage.getItem('roleId')
          var tHeader=[]
          var filterVal=[]

            tHeader = ['序号', '金额',  '电子券作废券码','电子券请求码', '电子券生成时间']
            filterVal = ['ID','Coupon_Amount','Coupon_No','Counpon_RequestCode','DATA_CREATE_TIME']
          const data = this.formatJson(filterVal, this.ExData)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '变动明细记录'
          })
          this.downloadLoading = false
        })
        this.getlists();
      },
      handleDownload() {
        var _this=this
        this.downloadLoading = true
        // this.exportData.forEach(obj => {
        //   if(obj.log_time){
        //     obj.log_time = parseDateTime(obj.log_time)
        //   }
        // })
        this.getexportlist(()=>{
          import('@/vendor/Export2Excel').then(excel => {
            var roleid=localStorage.getItem('roleId')
            var tHeader=[]
            var filterVal=[]
            if(roleid==3||roleid==4||roleid==5||roleid==7){
              tHeader = ['序号', '商戶', '金额', '类型', '电子券请求码', '电子券作废券码', '时间']
              filterVal = ['id','merchant_name','amount','log_type','coupon_request_no','coupon_no','log_time']
            }
            else{
              tHeader = ['序号', '商戶', '金额', '类型', '电子券作废券码', '时间']
              filterVal = ['id','merchant_name','amount','log_type','coupon_no','log_time']
            }
            const data = _this.formatJson(filterVal, _this.exportData)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: '变动明细记录'
            })
            _this.downloadLoading = false
          })
          // _this.getList();
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
<style lang="scss">
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
  ::-webkit-scrollbar { width: 0 !important ;display: none;}
  .box-card {
    width: 480px;
  }
  .filter-container{
    float: left;
  }
  .coopon-right{
    float: right;
  }
  input{
    height: 36px;
  }
  .msg{
    .el-dialog {
      width: 40%;
    }
  }
</style>
