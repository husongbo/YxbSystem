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
      <el-table-column label="油品名称" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.oil_name }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column label="基准油价" width="200px">
        <template slot-scope="scope">
          &lt;!&ndash;<span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.title }}</span>&ndash;&gt;
          <el-tag>{{ scope.row.baseGasPrice }}</el-tag>
        </template>
      </el-table-column>-->
      <el-table-column label="当前价格" width="200px" align="center">
        <template slot-scope="scope">
          <!--<span>{{ scope.row.author }}</span>-->
          <el-tag>{{ scope.row.oil_base_price }}</el-tag>
        </template>
      </el-table-column>
      <!--<el-table-column v-if="showReviewer" label="变价金额" width="200px" align="center">
        <template slot-scope="scope">
          &lt;!&ndash;<span style="color:red;">{{ scope.row.reviewer }}</span>&ndash;&gt;
          <el-tag>{{ scope.row.baseGasPrice }}</el-tag>
        </template>
      </el-table-column>-->
      <el-table-column label="执行时间" width="200px">
        <template slot-scope="scope">
          <!--<span>{{ scope.row.oil_change_date | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>-->
          <span>{{ scope.row.oil_change_date }}</span>
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
      <el-form ref="dataForm" :rules="rules" :model="tempDate" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="变更油品" prop="gasType">
          <el-select v-model="tempDate.oil_id" :disabled="disabledNow" value-key="name" class="filter-item" placeholder="选择油品">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.name" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="更新价格" prop="oil_base_price">
          <el-input-number v-model="tempDate.oil_base_price" :min="1" :step="0.1" :max="100" controls-position="right"/>
          <span>（例如：6.4）</span>
        </el-form-item>
        <el-form-item label="变价日期" prop="oil_change_date">
          <el-date-picker
            v-model="tempDate.oil_change_date"
            type="date"
            placeholder="选择变价日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"/>
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
import { fetchList, createUnifiedPrice, fetchPv } from '@/api/gasPriceManage'
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
      list: null,
      total: 0,
      listLoading: true,
      disabledNow: false,
      listQuery: {
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
      tempDate: { // 提交变更油价信息
        id: 0,
        oil_id: '',
        oil_name: 'sdfds',
        oil_base_price: '',
        oil_change_date: '',
        oil_change_no: 1
        // gasType: '',
        // modifyPrice: 7.4,
        // modifyDate: new Date()
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
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total_count
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
        oil_id: '',
        oil_name: '',
        oil_base_price: '',
        oil_change_date: '',
        oil_change_no: 1
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
                message: '添加失败',
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
      this.tempDate.oil_id = this.tempDate.oil_id.toString() // 渲染默认值
      this.dialogStatus = 'update'
      this.tempAllData.method = 'edit'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      console.log(this.tempAllData.method)
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
