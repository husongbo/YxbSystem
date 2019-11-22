<template>
  <div class="app-container">
    <div class="filter-container">
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
      <!--<el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>-->
      <!--<el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>-->
      <!--<el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">{{ $t('table.reviewer') }}</el-checkbox>-->
      <!--<el-button type="primary" @click="dialogaddVisible=true">新增</el-button>-->
    </div>
    <!--增加-->
    <el-dialog title="增加"  :visible.sync="dialogaddVisible">
      <el-form  :rules="rules"  label-position="left" label-width="120px" style="width: 800px; margin-left:50px;">
        <el-form-item label="商户名称" prop="oil_coupon_price">
          <el-input style="width:200px;height: 36px;" size="small"  placeholder="请输入商户名称" v-model="addinfo.model_info.M0007_NAME"></el-input>
        </el-form-item>
        <el-form-item label="备付金金额" prop="oil_coupon_price">
          <el-input style="width:200px;height: 36px;" size="small"  placeholder="请输入备付金金额" v-model="addinfo.model_info.M0007_BALANCE"></el-input>
        </el-form-item>
        <el-form-item label="备付金预警阀值" prop="oil_coupon_price">
          <el-input style="width:200px;height: 36px;" size="small"  placeholder="请输入警阀值" v-model="addinfo.model_info.M0007_EARLY_WARNING_LINE"></el-input>
        </el-form-item>
        <el-form-item label="备付金锁死阀值" prop="oil_coupon_price">
          <el-input style="width:200px;height: 36px;" size="small"  placeholder="请输入备付金锁死阀值" v-model="addinfo.model_info.M0007_STOP_LINE"></el-input>
        </el-form-item>
        <el-form-item label="商户联系人" prop="oil_coupon_price">
          <el-input style="width:200px;height: 36px;" size="small"  placeholder="请输入联系人" v-model="addinfo.model_info.M0007_CONTACTS"></el-input>
        </el-form-item>
        <el-form-item label="联系人电话" prop="oil_coupon_price">
          <el-input style="width:200px;height: 36px;" size="small"  placeholder="请输入联系人电话" v-model="addinfo.model_info.M0007_PHONE"></el-input>
        </el-form-item>
        <el-form-item label="商户域名" prop="oil_coupon_price">
          <el-input style="width:200px;height: 36px;" size="small"  placeholder="请输入回调域名" v-model="addinfo.model_info.M0007_PRIVATE_KEY"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="status_model"
            active-value="aa"
            @change="changestatues($event)"
            inactive-value=bb
            active-color="#13ce66"
            inactive-color="#ccc"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogaddVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="Addinformation">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
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
      <el-table-column label="商户名称" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.balance_merchant }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column label="基准油价" width="200px">
        <template slot-scope="scope">
          &lt;!&ndash;<span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.title }}</span>&ndash;&gt;
          <el-tag>{{ scope.row.baseGasPrice }}</el-tag>
        </template>
      </el-table-column>-->
      <el-table-column label="备付金金额" width="200px" align="center">
        <template slot-scope="scope">
          <!--<span>{{ scope.row.author }}</span>-->
          <el-tag>{{ scope.row.balance_money }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备付金预警阀值" width="200px" align="center">
        <template slot-scope="scope">
          <!--<span style="color:red;">{{ scope.row.reviewer }}</span>-->
          <el-tag>{{ scope.row.balance_warning_line }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备付金锁死阀值" width="200px" align="center">
        <template slot-scope="scope">
          <!--<span style="color:red;">{{ scope.row.reviewer }}</span>-->
          <el-tag>{{ scope.row.balance_stop_line }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="商户联系人" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.balance_contact }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商户联系人电话" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.balance_phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否审核" width="120px">
        <template slot-scope="scope" >
          <!--<span>{{ scope.row.oil_change_date | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>-->
          <el-tag type="info" v-if="scope.row.balance_data_state==1">已审核</el-tag>
          <el-tag type="info" v-if="scope.row.balance_data_state==2">未审核通过</el-tag>
          <el-tag type="info" v-if="scope.row.balance_data_state==0">未审核</el-tag>

        </template>
      </el-table-column>
      <!--<el-table-column label="执行时间" width="200px">
        <template slot-scope="scope">
          &lt;!&ndash;<span>{{ scope.row.oil_change_date | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>&ndash;&gt;
          <span>{{ scope.row.oil_change_date }}</span>
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
          <!--<el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>-->
          <el-button type="primary" size="mini" @click="handleUpdates(scope.row)">查看</el-button>
          <!--<el-button v-if="scope.row.status!='published'" size="mini" type="success" @click="handleModifyStatus(scope.row,'published')">{{ $t('table.publish') }}
          </el-button>
          <el-button v-if="scope.row.status!='draft'" size="mini" @click="handleModifyStatus(scope.row,'draft')">{{ $t('table.draft') }}
          </el-button>-->
          <!--<el-button size="mini" type="danger" @click="handleDelete(scope.row,'delete')">{{ $t('table.delete') }}-->
          <!--</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" :pageSizes="[50,100,150,200]" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="tempDate" label-position="left" label-width="120px" style="width: 420px; margin-left:50px;">
        <el-form-item label="备付金预警阀值" prop="gasType">
          <el-input-number v-model="tempDate.balance_warning_line" :min="-999999999" :step="1" :max="999999999" controls-position="right"/>
        </el-form-item>
        <el-form-item label="备付金锁死阀值" prop="oil_base_price">
          <el-input-number @change="greatLine" v-model="tempDate.balance_stop_line" :min="-999999999" :step="1" :max="999999999" controls-position="right"/>
          <!--<span>（例如：3000）</span>-->
        </el-form-item>
        <el-form-item label="联系人手机号" prop="oil_change_date">
          <el-input
            v-model="tempDate.balance_phone"
            placeholder="请输入手机号"
            clearable/>
        </el-form-item>
        <el-form-item label="状态" label-width="40px">
          <el-switch
            v-model="status_models"
            active-value="open"
            @change="changestatuess($event)"
            inactive-value="close"
            active-color="#13ce66"
            inactive-color="#ccc"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog class="chakan" title="查看" :visible.sync="dialogFormVisibles">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="width: 420px; margin-left:50px;">
        <el-form-item label="企业注册信息" prop="oil_base_price">
          <el-input v-model="temp.merchant_company" clearable disabled/>
        </el-form-item>
        <el-form-item label="社会信用代码" prop="oil_change_date">
          <el-input v-model="temp.merchant_yydm" clearable disabled/>
        </el-form-item>
        <el-form-item label="合同编号" prop="oil_change_date">
          <el-input v-model="temp.merchant_htbh" clearable disabled/>
        </el-form-item>
        <el-form-item label="联系地址" prop="oil_change_date">
          <el-input v-model="temp.merchant_address" clearable disabled/>
        </el-form-item>
        <el-form-item label="营业执照" prop="oil_change_date">
          <el-popover
            placement="right"
            trigger="hover">
            <a :href="['http://gwtest.youxinbao.com.cn'+temp.merchant_img_yyzz]" download="">
              <img :src="['http://gwtest.youxinbao.com.cn'+temp.merchant_img_yyzz]" width="300px" height="250px">
            </a>
            <img slot="reference" :src="['http://gwtest.youxinbao.com.cn'+temp.merchant_img_yyzz]" width="150px" height="100px"/>
          </el-popover>
        </el-form-item>
        <el-form-item label="开户许可证" prop="oil_change_date">
          <el-popover
            placement="right"
            trigger="hover">
            <a :href="['http://gwtest.youxinbao.com.cn'+temp.merchant_img_khxk]" download="">
              <img :src="['http://gwtest.youxinbao.com.cn'+temp.merchant_img_khxk]" width="300px" height="250px">
            </a>
            <img slot="reference" :src="['http://gwtest.youxinbao.com.cn'+temp.merchant_img_khxk]" width="150px" height="100px"/>
          </el-popover>
        </el-form-item>
        <el-form-item label="合同扫描件" prop="oil_change_date">
          <el-button type="primary" size="mini"><a :href="['http://gwtest.youxinbao.com.cn'+temp.merchant_img_htbh]">预览</a></el-button>
          <!--<el-popover-->
            <!--placement="right"-->
            <!--trigger="hover">-->
            <!--<a :href="['http://gwtest.youxinbao.com.cn'+temp.merchant_img_htbh]" download="">-->
              <!--<img :src="['http://gwtest.youxinbao.com.cn'+temp.merchant_img_htbh]" width="300px" height="250px">-->
            <!--</a>-->
            <!--<img slot="reference" :src="['http://gwtest.youxinbao.com.cn'+temp.merchant_img_htbh]" width="150px" height="100px"/>-->
          <!--</el-popover>-->
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
        <el-button @click="dialogFormVisibles = false">返回</el-button>
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
  import { getBalanceInfoList, subMitBalanceApp } from '@/api/balanceManage'
  import waves from '@/directive/waves' // Waves directive
  import { parseTime } from '@/utils'
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
      typeFilter(type) {
        return calendarTypeKeyValue[type]
      }
    },
    data() {
      return {
        inputMinMas: { min: 1, max: 100 },
        tableKey: 0,
        list: [],
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
        status_model:0,
        status_models:"close",
        dialogFormVisibles:false,
        total: 0,
        listLoading: true,
        disabledNow: false,
        listQuery: {
          merchant_id:0,
          pageNum: 1,
          pageSize: 100,
          dataType: 1
          // importance: undefined,
          // title: undefined,
          // type: undefined,
          // sort: '+id'
        },
        addinfo:{
          model_info: {
            M0007_NAME: '',//类型
            M0007_BALANCE: '',//备用金金额
            M0007_EARLY_WARNING_LINE: '',//预警阀值
            M0007_STOP_LINE: '',//锁死阀值
            M0007_PHONE: '',
            M0007_CONTACTS: '',//联系人
            M0007_PRIVATE_KEY: '',
            DATA_STATE:0
            // M0007_ADD: '',
            // M0007_IMAGE: '',
            // MEMO:'',
            // DATA_CREATE_USER: '',
            //
          },
          method: 'add'
        },
        dialogaddVisible:false,
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
        tempDate: { // 提交变更油价信息
          balance_id: '',
          oil_id: '',
          balance_contact: '',
          balance_merchant: '',
          balance_money: '',
          balance_phone: '',
          balance_stop_line: '',
          balance_warning_line: '',
          balance_data_state:0
          // gasType: '',
          // modifyPrice: 7.4,
          // modifyDate: new Date()
        },
        temp:{

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
          type: [{ required: true, message: 'type is required', trigger: 'change' }],
          timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
          title: [{ required: true, message: 'title is required', trigger: 'blur' }]
        },
        downloadLoading: false
      }
    },
    created() {
      this.listQuery.merchant_id=localStorage.getItem("userMerchantId")
      this.getList()
    },
    methods: {
      greatLine(){
        if(this.tempDate.balance_stop_line > this.tempDate.balance_warning_line){
          this.$message({
            message: '锁死阀值超过了预警阀值',
            type: 'warning'
          });
          this.tempDate.balance_stop_line = 0
        }
      },
      Addinformation(){
        console.log(this.addinfo)
        if(this.addinfo.model_info.M0007_NAME==''||this.addinfo.model_info.M0007_PHONE==''||this.addinfo.model_info.M0007_CONTACTS==''||this.addinfo.model_info.M0007_PRIVATE_KEY==''){
          this.$message('必须填写完所有内容!')
        }
        else {
          subMitBalanceApp(this.addinfo).then((res) => {
            console.log(res)
            if (res.data.result === '0') {
              this.dialogaddVisible = false
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
              this.addinfo.model_info.M0007_NAME=''
              this.addinfo.model_info.M0007_PHONE=''
              this.addinfo.model_info.M0007_CONTACTS=''
              this.addinfo.model_info.M0007_PRIVATE_KEY=''
              this.addinfo.model_info.M0007_BALANCE=0
              this.addinfo.model_info.M0007_EARLY_WARNING_LINE=0
              this.addinfo.model_info.M0007_STOP_LINE=0
              this.getList()
            } else {
              this.$notify({
                title: '提示',
                message: '添加失败',
                type: 'warning',
                duration: 2000
              })
            }
          })
        }
      },
      getList() {
        var count=0
        this.listLoading = true
        getBalanceInfoList(this.listQuery).then(response => {
          // this.list=response.data.data
          for(var i=0;i<response.data.data.length;i++){
            if(response.data.data[i].balance_data_state==0||response.data.data[i].balance_data_state==2||response.data.data[i].balance_data_state==1){
              this.list.push(response.data.data[i])
              count++
            }
          }
          if(this.list.length==0){
            this.list=[]
            this.total=0
          }
          else{
            this.total =count

          }
          this.listLoading = false
          console.log(this.list)
        })
      },
      changestatues(val){
        if(val=="aa"){
          this.addinfo.model_info.DATA_STATE=1
        }
        else{
          this.addinfo.model_info.DATA_STATE=0
        }

      },
      changestatuess(val){
        if(val=="open"){
          this.tempDate.balance_data_state=1
          // alert(this.tempDate.balance_stats)
        }
        else{
          this.tempDate.balance_data_state=0
          // alert( this.tempDate.balance_data_state)
          // alert(this.tempDate.balance_stats)
        }

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
          balance_id: '',
          balance_contact: '',
          balance_merchant: '',
          balance_money: '',
          balance_phone: '',
          balance_stop_line: '',
          balance_warning_line: ''
        }
      },
      handleClose() {},
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
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
            // balance_id: '',
            //   balance_contact: '',
            //   balance_merchant: '',
            //   balance_money: '',
            //   balance_phone: '',
            //   balance_stop_line: '',
            //   balance_warning_line: ''


            this.tempAllData.model_info = { M0007_id: this.tempDate.balance_id, M0007_contacts: this.tempDate.balance_contact, m0007_balance: this.tempDate.balance_money, m0007_phone: this.tempDate.balance_phone, m0007_stop_line: this.tempDate.balance_stop_line,DATA_STATE:this.tempDate.balance_data_state, m0007_early_warning_line: this.tempDate.balance_warning_line }
            console.log(this.tempAllData)
            // 提交数据
            subMitBalanceApp(this.tempAllData).then((res) => {
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
                  message: '添加失败',
                  type: 'warning',
                  duration: 2000
                })
              }
            })
          }
        })
      },
      handleUpdate(row) {
        this.tempDate = Object.assign({}, row) // copy obj
        if(this.tempDate.balance_data_state==1){
          // alert("1")
          this.status_models="open";
        }
        else{
          this.status_models="close";
        }
        console.log("aaaaaaaaaaaaaa")
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
      handleUpdates(row) {
        this.temp = Object.assign({}, row) // copy obj
        console.log(this.temp)
        // if(this.tempDate.balance_data_state==1){
        //   // alert("1")
        //   this.status_models="open";
        // }
        // else{
        //   this.status_models="close";
        // }
        // console.log("aaaaaaaaaaaaaa")
        // console.log(this.tempDate)
        // this.disabledNow = true
        // this.dialogStatus = 'update'
        // this.tempAllData.method = 'edit'
        this.dialogFormVisibles = true
        // this.$nextTick(() => {
        //   this.$refs['dataForm'].clearValidate()
        // })
        // console.log(this.tempAllData.method)
      },
      handleDelete(row, method) {
        this.deleteRowData = { dataType: 1, method: 'delete', model_info: { id: row.id }}
        this.dialogDeleteVisible = true
      },
      removeRow() {
        // let tempData = { dataType: 1, method: 'delete', model_info: { id: row.id }}
        createUnifiedPrice(this.deleteRowData).then((res) => {
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
    margin-top:5vh!important;
  }
</style>
