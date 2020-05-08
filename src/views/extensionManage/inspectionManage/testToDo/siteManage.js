
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { willingTestingTicket, matfindList, furnacefindAll } from '@/api/extensionManage/testToDo/testToDo'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      list: [],
      siteType: '',
      siteName: '',
      siteStatus: '',
      pageSize: 12,
      pageNum: 1,
      totalPage: 0,
      beginDate: '',
      endDate: '',
      pickerOptionsStart: {
        disabledDate: (time) => {
          const endDateVal = this.endDate
          if (endDateVal) {
            return time.getTime() > endDateVal
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          const beginDateVal = this.beginDate
          if (beginDateVal) {
            return time.getTime() < beginDateVal
          }
        }
      },
      isActive: 0,
      siteForm: {
        siteType: '',
        siteName: '',
        siteStatus: ''
      },
      currentId: '',
      runId: '',
      machineValue: '',
      machineOptions: [],
      furnaceOptions: [],
      furnaceValue: '',
      statusValue: '',
      statusList: [
        { id: 1, name: '生长完成' },
        { id: 4, name: '目检完成' },
        { id: 3, name: '测试完成' }
      ],
      waferTol: 0,
      anotherlist: [],
      rowInfo: null
    }
  },
  mounted() {
    this.fetchData()
    this.matfindList()
    this.furnacefindAll()
  },
  methods: {
    // Run信息/Wafer信息切换
    navClick(index) {
      this.isActive = index
    },
    // 每页数量改变
    sizeChange(pageSize) {
      this.pageSize = pageSize
      this.fetchData()
    },
    // 当前页数改变
    currentChange(pageNum) {
      this.pageNum = pageNum
      this.fetchData()
    },
    handleSearch() {
      this.pageNum = 1
      this.fetchData()
    },
    clearAll() {
      this.beginDate = ''
      this.endDate = ''
      this.runId = ''
      this.machineValue = ''
      this.statusValue = ''
      this.furnaceValue = ''
      this.pageNum = 1
      this.fetchData()
    },
    matfindList() {
      matfindList().then(res => {
        this.machineOptions = res.data
      })
    },
    furnacefindAll() {
      const params = {
        pageNum: 1,
        pageSize: 10000000
      }
      furnacefindAll(params).then(res => {
        this.furnaceOptions = res.data.list
      })
    },
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    createWaferID() {
      console.log(123)
    },
    waferClick(data) {
      // data.isActive = !data.isActive
      console.log(data)
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const requestParams = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        startTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate),
        runId: this.runId,
        mCode: this.machineValue,
        status: this.statusValue,
        stoveCode: this.furnaceValue
      }
      if (this.beginDate === '') {
        requestParams.startTime = ''
      }
      if (this.endDate === '') {
        requestParams.endTime = ''
      }
      willingTestingTicket(requestParams).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
        this.rowInfo = null
        this.waferTol = 0
        this.anotherlist = []
        if (this.list.length > 0) {
          this.$refs.listTabel.setCurrentRow(this.list[0])
          // this.handleCurrentChange(this.list[0])
        }
      })
    },
    // 单击Run信息
    // 单击Run信息
    handleCurrentChange(row) {
      this.anotherpageSize = 1
      this.anotherpageNum = 12
      // this.selectbillNo = row.machineCode
      this.rowInfo = row
      this.anotherlist = []
      for (let i = 0; i < row.wafers.length; i++) {
        row.wafers[i].isSelected = false
        row.wafers[i].isAcceptSlice = false
        row.wafers[i].type = ''
        this.anotherlist.push(row.wafers[i])
      }
      this.waferTol = row.wafers.length
      // this.queryOneDetail()
    },
    // 双击Run信息
    cellDblclick(row, column, cell, event) {
      // this.isActive = 1
      this.rowInfo = row
      this.anotherlist = []
      for (let i = 0; i < row.wafers.length; i++) {
        row.wafers[i].isSelected = false
        row.wafers[i].isAcceptSlice = false
        row.wafers[i].type = ''
        this.anotherlist.push(row.wafers[i])
      }
      this.waferTol = row.wafers.length
    },
    // 添加
    handleAdd() {
      this.siteForm.siteType = ''
      this.siteForm.siteName = ''
      this.siteForm.siteStatus = ''
      this.addDialogVisible = true
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    // 取消
    resetForm(formName) {
      this.addDialogVisible = false
      this.editDialogVisible = false
      this.$refs[formName].resetFields()
    }
  }
}

