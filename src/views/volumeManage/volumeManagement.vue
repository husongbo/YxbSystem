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
        range-separator=""
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="handleFilterDate"/>
      <el-select v-if="roleId!=6" v-model="names" clearable placeholder="类型全部"
                 style="width: 200px;margin-left: 20px;"
                 @change="handleFilterExchangeType">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.name"
                   :value="item.key"/>
      </el-select>



      <el-select v-if="roleId!=6" v-model="zttype" clearable placeholder="状态"
                 style="width: 150px;margin-left: 20px;"
                 @change="zttypees">
        <el-option v-for="item in Typezt" :key="item.key" :label="item.name"
                   :value="item.key"/>
      </el-select>
      <el-select v-if="roleId!=6" v-model="oiltype" clearable placeholder="是否预警"
                 style="width: 250px;margin-left: 20px;"
                 @change="handleFilterPayType">
        <el-option v-for="item in invoiceTypeOptions" :key="item.key" :label="item.name"
                   :value="item.key"/>
      </el-select>
    </div>
    <div class="coopon-right">
      <el-button icon="el-icon-download" v-waves :loading="downloadLoading" type="primary"
                 @click="handleDownload">导出</el-button>
      <el-button @click="dialogaddVisible=true">新增</el-button>
      <el-select v-if="roleId!=6" v-model="ascdesctxt" clearable placeholder="默认升序"
                 style="width: 160px;margin-left: 20px;"
                 @change="clickdescType">
        <el-option v-for="items in ascdesc" :key="items.id" :label="items.names"
                   :value="items.names"/>
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
      <el-table-column label="序号" prop="oil_id" sortable="custom" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="130px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.coupon_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总金额" width="140px" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.sum_coupon_amount }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="余额" width="150px" align="center">
        <template slot-scope="scope">
          <!--<span>{{ scope.row.author }}</span>-->
          <el-tag>{{ scope.row.sum_balance_amount }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="请求码" width="130px" align="center">
        <template slot-scope="scope">
          <!--<span>{{ scope.row.author }}</span>-->
          <span>{{ scope.row.coupon_request_code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="有效日期始" width="170px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.coupon_effectiveTime|parseDateTime }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column label="消费地点" width="150px" align="center">-->
      <!--<template slot-scope="scope">-->
      <!--<span>{{ scope.row.address }}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="有效日期终" width="170px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.coupon_expirdDate|parseDateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预警值" width="130px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.coupon_warning_line }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="coupon_status"
        label="状态"
        header-align="center"
        align="center"
      >
        <template slot-scope="scope">
          <i v-if="scope.row.coupon_status !== 1" class="fa fa-circle text-danger ml5" style="color: red"/>
          <i v-if="scope.row.coupon_status === 1" class="fa fa-circle text-danger ml5" style="color: green"/>
        </template>
      </el-table-column>
      <el-table-column
        prop="coupon_warning_status"
        label="预警"
        header-align="center"
        align="center"
      >
        <template slot-scope="scope">
          <i v-if="scope.row.coupon_warning_status !== 1" class="fa fa-circle ml5" style="color: green"/>
          <i v-if="scope.row.coupon_warning_status === 1" class="fa fa-circle text-success ml5" style="color: orange"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px" align="center">
        <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="dialogedits(scope.row.id,scope.row.coupon_status)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination style=" margin-top: 10px;" v-show="total>0" :total="total" :page.sync="listQuery.pageNum"
                :limit.sync="listQuery.pageSize"  :pageSizes="[50,100,150,200]"
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
  <!--增加-->
    <el-dialog title="增加"  :visible.sync="dialogaddVisible">
      <el-form ref="dataForm" :rules="rules" :model="model_infos" label-position="left" label-width="120px" style="width: 800px; margin-left:50px;">
        <el-form-item label="电子券类型" prop="oil_id">
          <el-select v-model="list_query.types" class="filter-item" placeholder="选择类型" @change="DateTypeitem">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.name" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="电子券总额" prop="oil_coupon_price">
          <el-input style="width:200px;height: 36px;" size="small"  placeholder="请输入总额" v-model="model_infos.model_info.coupon_amount"></el-input>
        </el-form-item>
        <el-form-item label="电子券请求码" prop="oil_coupon_price">
          <el-input style="width:200px;height: 36px;" size="small"  placeholder="请输入请求码" v-model="model_infos.model_info.coupon_requestCode" ></el-input>
        </el-form-item>
        <el-form-item  label="电子券有效日期" prop="modifyDate">
          <el-date-picker
            v-model="listQuery.modifyDates"
            :picker-options="pickerOptions2"
            type="daterange"
            align="right"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            unlink-panels
            range-separator=""
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="handleFilterDates" />
        </el-form-item>
        <el-form-item label="电子券预警值" prop="oil_coupon_price">
          <el-input style="width:200px;height: 36px;" size="small"  placeholder="请输入预警值"  v-model="model_infos.model_info.coupon_early_warning_line"></el-input>
        </el-form-item>
        <el-form-item label="电子券状态" prop="oil_change_date">
          <el-switch
            v-model="status_add"
            @change="switchadds"
            active-value="close"
            inactive-value="open"
            active-color="#13ce66"
            inactive-color="#ccc"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogaddVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="createAdd">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

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
      title="提示(是否确认开票)"
      :visible.sync="dialogokVisible"
      width="30%"
      :before-close="handleCloses">
      <div>你一共选择了<el-tag>{{checkedlen}}</el-tag>条记录</div>
      <div style="margin-top: 15px;">总金额:<el-tag>{{checkedprice}}</el-tag></div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogokVisible = false">取 消</el-button>
    <el-button type="primary" @click="SubmitInvoice">确 定</el-button>
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
    SubMitCouponApplyInfo
  } from '@/api/balanceManage'
  import waves from '@/directive/waves' // Waves directive
  import {parseTime, parseDateTime} from '@/utils'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import {fetchStations} from '@/api/gasPriceManage'

  const calendarTypeOptions = [
    {key: '1', name: '实时不定额'},
    {key: '2', name: '实时定额'}
  ]

  const invoiceTypeOptions=[
    {key:'1',name:'预警'},
    {key:'0',name:'未预警'}
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
        list_query:{
          coupon_list:'',//选中的id
          types:''
        },
        checkedprice:0,//选中的价格
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
          {key:1,name:'在用'},
          {key:2,name:'未用'}
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
        listLoading: true,
        disabledNow: false,
        nowBalance: 0,
        nowUsername: '',
        balance_apply: '',
        balance_merchant_id: '',
        merchantList: [],
        listQuery: {
          // merchant_id: 0,
          modifyDates:'',
          coupon_type:0,
          coupon_status:-1,
          begin_date: '',
          end_date: '',
          coupon_warning_status:-1,
          pageNum: 1,
          pageSize: 100
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
      // this.listQuery.begin_date = new Date()
      // this.listQuery.end_date = new Date()
      // this.listQuery.modifyDate = [new Date()+'',new Date()+'']
      this.getList()
      // this.getMerchantList()
      this.roleId = localStorage.getItem('roleId')
      this.getProvinceList()
    },
    methods: {
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
        if(this.model_infos.model_info.coupon_requestCode.indexOf(" ") != -1){
          console.log('有空格')
          this.model_infos.model_info.coupon_requestCode=this.model_infos.model_info.coupon_requestCode.trim()
        }
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
      getDateTime(date) {
        date=new Date(parseInt(date.replace("/Date(", "").replace(")/", ""), 10));
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hh = date.getHours();
        var mm = date.getMinutes();
        var ss = date.getSeconds();
        return year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + ss;
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
        // this.list_query.coupon_list=''
        // this.checkedprice=0
        // this.checkedlen=0
        this.checkedinvoices=val[0]
        this.checkedid=this.checkedinvoices.id
        console.log(this.checkedid)

        // for(var i=0;i<this.checkedinvoices.length;i++){
        //   if(this.list_query.coupon_list==''||this.list_query.coupon_list==null){
        //     this.list_query.coupon_list+=this.checkedinvoices[i].id
        //   }
        //   else{
        //     this.list_query.coupon_list+=","+this.checkedinvoices[i].id
        //   }
        //   this.checkedprice+=parseInt(this.checkedinvoices[i].unit_price);
        // }
        // this.checkedlen=this.checkedinvoices.length;
        // console.log(this.checkedinvoices)
        // console.log(this.checkedlen)
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
        // this.listLoading = true
        this.ascdesctxt=item;
        if(this.ascdesctxt=="升序"){
          var sortArr = this.list.sort(this.compare);
          this.list =sortArr;
          console.log(this.list);
        }
        else{
          var sortArr = this.list.reverse(this.compare);
          this.list =sortArr;
          console.log(this.list);
        }
        // this.list=this.list.sort(compare('apply_tradeId'));
        // console.log(item);
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
        this.listQuery.coupon_status=val
          this.getList()
      },
      getList() {
        this.listLoading = true
        console.log(this.listQuery)
        if(this.listQuery.coupon_type==''){
          this.listQuery.coupon_type=0
        }
        if(this.listQuery.coupon_status==''){
          this.listQuery.coupon_status=-1
        }
        if(this.listQuery.coupon_warning_status==''){
          this.listQuery.coupon_warning_status=-1
        }
        // this.listQuery.station_name=encodeURI(this.listQuery.station_name);
        GetCouponBalanceInfo(this.listQuery).then(response => {
          console.log(response.data);
          if (response.data.data.length > 0) {
            var sortArr = response.data.data.sort(this.compare);
            this.list =sortArr;
            console.log(this.list);
            // this.nowUsername = response.data.data[0].merchant
            // this.nowBalance = response.data.balance_money
            // this.balance_apply = response.data.balance_apply
            // this.balance_merchant_id = response.data.balance_merchant_id
            this.bussinessTotalMoney= response.data.sum_coupon_amount
            this.total = response.data.total_count

          } else {
            this.list = []
            // this.balance_merchant_id = response.data.balance_merchant_id
            // this.bussinessTotalMoney = response.data.sum_amount
            // this.total = response.data.total_count
          }
          this.listLoading = false
          // this.model_infotwos.model_info.id=''
          this.model_infotwos.model_info.coupon_early_warning_line=''
          // this.model_infotwos.model_info.coupon_warning_status=0
            this.model_infos.model_info.id=0,
            this.model_infos.model_info.coupon_type=0,//类型
            this.model_infos.model_info.coupon_amount='',//总金额
            this.model_infos.model_info.coupon_requestCode='',//请求码
            this.model_infos.model_info.coupon_effectiveTime='',
            this.model_infos.model_info.coupon_expirdDate='',
            this.model_infos.model_info.coupon_early_warning_line='',//预警值
            this.model_infos.model_info.coupon_data_status=0,//状态
            this.model_infos.model_info.coupon_warning_status=0,//变更状态
            this.model_infos.model_info.coupon_bancle=''
            this.list_query.types=''
            this.listQuery.modifyDates=''
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
        this.listQuery.pageNum = 1
        // alert(name)
        this.listQuery.coupon_type =name
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
      handleDownload() {
        this.downloadLoading = true
        this.list.forEach(obj => {
          if(obj.coupon_effectiveTime){
                  obj.coupon_effectiveTime = parseDateTime(obj.coupon_effectiveTime)
          }
          if(obj.coupon_expirdDate){
            obj.coupon_expirdDate = parseDateTime(obj.coupon_expirdDate)
          }
        })
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['序号', '类型', '总金额', '余额', '请求码', '有效日期始', '有效日期终', '预警值', '状态',
            '预警']
          const filterVal = ['id', 'coupon_type', 'sum_coupon_amount', 'sum_balance_amount', 'coupon_request_code', 'coupon_effectiveTime', 'coupon_expirdDate',
            'coupon_warning_line','coupon_status','coupon_warning_status']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '开票记录'
          })
          this.downloadLoading = false
        })
        this.getList();
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
<style scoped>
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
  input{
    height: 36px;
  }
</style>
