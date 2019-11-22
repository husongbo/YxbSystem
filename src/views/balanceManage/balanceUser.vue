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
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
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
      <el-table-column label="编号" prop="id" sortable="custom" align="center" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="变价加油站名称" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.oil_station_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="油品名称" width="200px">
        <template slot-scope="scope">
          <!--<span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.title }}</span>-->
          <el-tag>{{ scope.row.oil_name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="基准价格" width="200px" align="center">
        <template slot-scope="scope">
          <!--<span>{{ scope.row.author }}</span>-->
          <el-tag>{{ scope.row.oil_base_price }}</el-tag>
        </template>
      </el-table-column>
      <!--<el-table-column v-if="showReviewer" label="当前价格" width="200px" align="center">
        <template slot-scope="scope">
          &lt;!&ndash;<span style="color:red;">{{ scope.row.reviewer }}</span>&ndash;&gt;
          <el-tag>{{ scope.row.baseGasPrice }}</el-tag>
        </template>
      </el-table-column>-->
      <el-table-column label="变价金额" width="200px" align="center">
        <template slot-scope="scope">
          <!--<span style="color:red;">{{ scope.row.reviewer }}</span>-->
          <el-tag>{{ scope.row.oil_coupon_price }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="执行时间" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row | parseDateRange }}</span>
        </template>
      </el-table-column>
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
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
          <!--<el-button v-if="scope.row.status!='published'" size="mini" type="success" @click="handleModifyStatus(scope.row,'published')">{{ $t('table.publish') }}
          </el-button>
          <el-button v-if="scope.row.status!='draft'" size="mini" @click="handleModifyStatus(scope.row,'draft')">{{ $t('table.draft') }}
          </el-button>-->
          <el-button size="mini" type="danger" @click="handleDelete(scope.row,'delete')">{{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="tempDate" label-position="left" label-width="100px" style="width: 800px; margin-left:50px;">
        <el-form-item label="加油站名称" prop="oil_station_id">
          <el-input
            v-show="!showSelect"
            v-model="tempDate.oil_station_name"
            :disabled="true"
            placeholder="" />
          <el-input
            v-model="tempDate.oil_station_id"
            :disabled="true"
            style="display: none"
            placeholder="请输入内容" />
          <el-select v-show="showSelect" v-model="tempDate.province_id" filterable placeholder="请选择省份" @change="getCityList">
            <el-option v-for="item in provinceOptions" :key="item.id" :label="item.province_name" :value="item.id"/>
          </el-select>
          <el-select
            v-show="showSelect"
            v-model="tempDate.city_id"
            filterable
            style="margin-left: 20px;"
            placeholder="请选择城市"
            @change="getStationList">
            <el-option v-for="item in cityOptions" :key="item.id" :label="item.city_name" :value="item.id"/>
          </el-select>
          <el-select
            v-show="showSelect"
            v-model="tempDate.oil_station_id"
            filterable
            style="margin-left: 20px;"
            placeholder="请选择加油站">
            <el-option v-for="item in gasStationOptions" :key="item.id" :label="item.station_name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="油品型号" prop="oil_id">
          <el-select v-model="tempDate.oil_id" class="filter-item" placeholder="选择油品">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.name" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="变价价格" prop="oil_coupon_price">
          <el-input-number v-model="tempDate.oil_coupon_price" :min="-1" :step="0.1" :max="1" controls-position="right" />
          <span>变动价格(-1.00~1.00)</span>
        </el-form-item>
        <el-form-item label="变价规则" prop="oil_coupon_type">
          <el-select v-model="tempDate.oil_coupon_type" class="filter-item" placeholder="选择变价规则" @change="handleChangeRule" >
            <el-option v-for="item in modifyRules" :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
        </el-form-item>
        <!--<el-form-item v-if="showModifyInput" label="定时变价规则" prop="sureTimeRule">
          <el-select v-model="tempDate.sureTimeRule" class="filter-item" placeholder="选择变价规则" @change="handleChangeRule" >
            <el-option v-for="item in modifySureTimeRules" :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
        </el-form-item>-->
        <el-form-item v-if="showSureTimeInput" label="变价日期区间" prop="modifyDate">
          <el-date-picker
            v-model="tempDate.modifyDate"
            :picker-options="pickerOptions2"
            type="daterange"
            align="right"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期" />
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
import { fetchList, fetchPv, createUnifiedPrice, fetchStations } from '@/api/gasPriceManage'
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
  acc[cur.key] = cur.display_name
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
    },
    parseDateRange(type) {
      if (type.oil_coupon_type === 1) {
        return '周五至周一'
      } else if (type.oil_coupon_type === 2) {
        return '周二至周四'
      } else {
        return type.coupon_begin_date + ' 至 ' + type.coupon_end_date
      }
    }
  },
  data() {
    return {
      pickerOptions2: {
        shortcuts: [{
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
        }]
      },
      tableKey: 0,
      list: null,
      total: 0,
      showModifyInput: false,
      showSureTimeInput: false,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        dataType: 2
        // importance: undefined,
        // title: undefined,
        // type: undefined,
        // sort: '+id'
      },
      showSelect: true,
      stationQuery: {
        dataType: 1, // 1 province, 2 city, 3 station
        province_id: '',
        city_id: ''
      },
      provinceOptions: [
        { key: '1', display_name: '四川' },
        { key: '2', display_name: '广东' }
      ],
      cityOptions: [
        { key: '1', display_name: '成都' },
        { key: '2', display_name: '绵阳' }
      ],
      gasStationOptions: [
        { key: '1', display_name: '高薪加油站' },
        { key: '2', display_name: '飞云加油站' }
      ],
      modifyRules: [
        { key: '1', display_name: '周五至周一' },
        { key: '2', display_name: '周二至周四' }, // 需要选择时间区间
        { key: '3', display_name: '自定义' } // 需要选择时间区间
      ],
      modifySureTimeRules: [
        { key: '1', display_name: '周五至周一' },
        { key: '2', display_name: '周二至周四' }
      ],
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: { // 提交变更油价信息
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      tempDate: { // 提交定点变更油价信息
        id: 0,
        oil_station_id: '',
        oil_station_name: '', // 加油站名称
        oil_id: '', // 油品型号id
        oil_name: '',
        oil_base_price: '',
        oil_coupon_price: '', // 变价价格
        oil_coupon_type: '', // 变价规则 1：周一至周五；2周二至周四；3：选择日期区间
        coupon_begin_date: '', // 变价日期区间开始日期
        coupon_begin_time: '',
        coupon_end_date: '', // 变价日期区间结束日期
        coupon_end_time: '',
        oil_station_status: 1, // 是否启用 1启用，0关闭
        province_id: '',
        city_id: '',
        modifyDate: ''// 变价日期区间
      },
      tempAllData: {
        dataType: 2, // 定点变价2
        method: 'add'
      },
      deleteRowData: {},
      dialogDeleteVisible: false,
      dialogFormVisible: false,
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
    this.getList()
    this.getProvinceList()
  },
  methods: {
    chooseProvince() {
      this.getStationList()
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total_count
        this.listLoading = false
      })
    },
    handleClose() {},
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
        id: 0,
        oil_station_id: '',
        oil_station_name: '', // 加油站名称
        oil_id: '', // 油品型号id
        oil_name: '',
        oil_base_price: '',
        oil_coupon_price: '', // 变价价格
        oil_coupon_type: '', // 变价规则 1：周一至周五；2周二至周四；3：选择日期区间
        coupon_begin_date: '', // 变价日期区间开始日期
        coupon_begin_time: '',
        coupon_end_date: '', // 变价日期区间结束日期
        coupon_end_time: '',
        oil_station_status: 1, // 是否启用 1启用，0关闭
        province_id: '',
        city_id: '',
        modifyDate: ''// 变价日期区间
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.showSelect = true
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
          this.tempDate.coupon_begin_date = this.tempDate.modifyDate[0]
          this.tempDate.coupon_end_date = this.tempDate.modifyDate[1]
          this.tempAllData.model_info = this.tempDate
          // 提交数据
          createUnifiedPrice(this.tempAllData).then((res) => {
            if (res.data.result === '0') {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            } else {
              this.$notify({
                title: '提示',
                message: res.data.message,
                type: 'warning',
                duration: 2500
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
      this.showSelect = false
      this.tempDate.oil_id = this.tempDate.oil_id.toString() // 渲染默认值
      this.tempDate.oil_station_id = this.tempDate.oil_station_id.toString() // 渲染默认值
      this.tempDate.oil_coupon_type = this.tempDate.oil_coupon_type.toString() // 渲染默认值
      if (this.tempDate.oil_coupon_type === '3') {
        this.tempDate.modifyDate = [this.tempDate.coupon_begin_date, this.tempDate.coupon_end_date]
      }
      this.dialogStatus = 'update'
      this.tempAllData.method = 'edit'
      this.dialogFormVisible = true
      if (this.tempDate.oil_coupon_type === '3') {
        this.showSureTimeInput = true
      } else {
        this.showSureTimeInput = false
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      console.log(this.tempAllData.method)
    },
    handleDelete(row, method) {
      this.deleteRowData = { dataType: 2, method: 'delete', model_info: { id: row.id }}
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
    },
    // 变价规则改变
    handleChangeRule(e) {
      const _this = this
      if (_this.tempDate.oil_coupon_type === '3') {
        _this.showSureTimeInput = true
      } else {
        _this.showSureTimeInput = false
      }
    }
  }
}
</script>
