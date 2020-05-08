
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findAlnMachine, remove, addAlnMachine, updateMachineStatus } from '@/api/extensionManage/wyBasicInfoManage/AlNiBasicInfo/AlNiCraft'
import { abnormalSave } from '@/api/chipManage/rearSiteManage/tensileTest'
import { querySchedule } from '@/api/chipManage/rearSiteManage/siteProgress'
import { findAbnormalList } from '@/api/chipManage/rearSiteManage/cowOverSite'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      deleteDialogVisible: false,
      abnormalReportDialog: false,
      activeTabIndex: 0,
      selectedAbnormalNum: 0,
      abnormalBatchNum: 0,
      textareaRow: 0,
      batchOrPlate: 0,
      waferTotalNum: 24,
      rightList: [],
      receiveList: [],
      abnormalReport: [],
      abnormalRemark: '',
      list: [],
      spanArr: [],
      pos: '',
      plateSpanArr: [],
      platePos: '',
      plateList: [],
      batchList: [],
      userOptions: [],
      abnormalList: [{}],
      detailList: [{}],
      batchNum: '',
      plateNum: '',
      machineForm: {
        code: '',
        name: '',
        remark: ''
      },
      rules: {
        code: [{ required: true, message: '请输入编号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.fetchData()
    this.$refs.importBatchImput.focus()
  },
  methods: {
    handleBatchNoScanning() {
      if (this.batchList.filter(item => { return item.batchNo === this.batchNum }).length > 0) {
        this.$message({
          type: 'error',
          message: '当前批号已存在!'
        })
        return false
      }
      const params = {
        key: this.batchNum,
        type: 0
      }
      querySchedule(params).then(res => {
        if (res.data.length === 0) {
          this.$message({
            type: 'error',
            message: '当前批次进度不在研磨过站!'
          })
        } else {
          this.batchList = [...this.batchList, ...res.data]
          this.getSpanArr(this.batchList)
        }
      })
      setTimeout(() => {
        this.batchNum = ''
      }, 200)
    },
    // 批次合并
    batchSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    // 批次合并spanArr
    getSpanArr(data) {
      this.spanArr = []
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1) // 用于存放每一行记录的合并数
          this.pos = 0 // pos是spanArr的索引
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].batchNo === data[i - 1].batchNo) { // 则向spanArr中添入元素０，并将前一位元素＋１，表示合并行数＋１
            this.spanArr[this.pos] += 1
            this.spanArr.push(0) // 0 即表示该行不显示
          } else {
            this.spanArr.push(1)
            this.pos = i
          }
        }
      }
      return this.spanArr
    },
    handlePlatterScanning() {
      if (this.plateList.filter(item => { return item.plateNo === this.plateNum }).length > 0) {
        this.$message({
          type: 'error',
          message: '当前盘号已存在!'
        })
        return false
      }
      const params = {
        key: this.plateNum,
        type: 1
      }
      querySchedule(params).then(res => {
        if (res.data.length === 0) {
          this.$message({
            type: 'error',
            message: '研磨盘信息不存在，请确认!'
          })
        } else {
          this.plateList = [...this.plateList, ...res.data]
          this.getPlateSpanArr(this.plateList)
        }
      })
      setTimeout(() => {
        this.plateNum = ''
      }, 200)
    },
    // 大盘合并
    plateSpanMethod({ row, column, rowIndex, columnIndex }) {
      console.log(this.plateSpanArr)
      if (columnIndex === 0 || columnIndex === 1 || columnIndex === 5) {
        const _row = this.plateSpanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    // 大盘合并spanArr
    getPlateSpanArr(data) {
      this.plateSpanArr = []
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.plateSpanArr.push(1) // 用于存放每一行记录的合并数
          this.platePos = 0 // pos是spanArr的索引
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].batchNo === data[i - 1].batchNo) { // 则向spanArr中添入元素０，并将前一位元素＋１，表示合并行数＋１
            this.plateSpanArr[this.platePos] += 1
            this.plateSpanArr.push(0) // 0 即表示该行不显示
          } else {
            this.plateSpanArr.push(1)
            this.platePos = i
          }
        }
      }
      return this.plateSpanArr
    },
    // 异常原因合并行
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 4) {
        return {
          rowspan: 12,
          colspan: 1
        }
      }
    },
    // 异常上报
    handleReporting() {
      this.abnormalRemark = ''
      const params = []
      this.receiveList.map(item => {
        params.push(item.batchNo)
      })
      findAbnormalList(Array.from(new Set(params))).then(res => {
        res.data.map(item => {
          item.selectedWafer = 0
          item.abnormalStatus = false
          if (item.wafers.length !== 0) {
            item.wafers.map(wafer => {
              wafer.abnormalStatus = false
              wafer.abnormalCause = ''
            })
          }
        })
        this.abnormalReport = res.data
        this.abnormalReportDialog = true
        setTimeout(() => {
          this.$refs.runTable.setCurrentRow(this.abnormalReport[0])
        }, 500)
        this.detailList = this.abnormalReport.length === 0 ? [] : this.abnormalReport[0].wafers
        this.waferTotalNum = this.abnormalReport[0].wafers.length
        this.abnormalBatchNum = this.abnormalReport[0].batchNo
        this.selectedAbnormalRow = this.abnormalReport[0]
        this.textareaRow = 18
      })
    },
    // 异常选中
    abnormalChange(data) {
      this.selectedAbnormalNum = data.filter(item => { return item.abnormalStatus === true }).length
    },
    // 异常详情选中
    abnormalDetailChange(data) {
      const selectedNum = data.filter(item => { return item.abnormalStatus === true }).length
      console.log(selectedNum)
      if (selectedNum > 0) {
        this.selectedAbnormalRow.abnormalStatus = true
        this.selectedAbnormalRow.selectedWafer = selectedNum
      } else {
        this.selectedAbnormalRow.abnormalStatus = false
        this.selectedAbnormalRow.selectedWafer = 0
      }
      this.selectedAbnormalNum = this.abnormalReport.filter(item => { return item.abnormalStatus === true }).length
    },
    // 单击异常信息
    rowClick(row) {
      this.detailList = row.wafers
      this.waferTotalNum = row.wafers.length
      this.abnormalBatchNum = row.batchNo
      this.selectedAbnormalRow = row
    },
    // 异常提交
    abnormalSubmit() {
      const details = []
      let flag = false
      const itemFlag = false
      let hasAblm = false
      this.abnormalReport.map(item => {
        if (item.abnormalStatus) {
          hasAblm = true
          if (item.selectedWafer === 0) {
            flag = true
          }
        }
        item.wafers.map(subItem => {
          if (subItem.abnormalStatus) {
            details.push({
              initAbnormal: true,
              batchNo: item.batchNo,
              reason: subItem.abnormalCause ? subItem.abnormalCause : this.abnormalRemark,
              waferNo: subItem.waferNo
            })
          } else {
            details.push({
              initAbnormal: false,
              batchNo: item.batchNo,
              reason: '',
              waferNo: subItem.waferNo
            })
          }
        })
      })
      if (!hasAblm) {
        this.$message({
          type: 'error',
          message: '异常数据不能为空!'
        })
        return false
      }
      if (flag) {
        this.$message({
          type: 'error',
          message: '请选择异常wafer!'
        })
        return false
      }
      if (itemFlag) {
        this.$message({
          type: 'error',
          message: '请输入异常原因!'
        })
        return false
      }
      if (this.abnormalRemark.trim() === '') {
        this.$message({
          type: 'error',
          message: '请输入异常原因!'
        })
        return false
      }
      if (details.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择异常信息!'
        })
        return false
      }
      const params = {
        creator: sessionStorage.getItem('User-Id'),
        description: this.abnormalRemark,
        exceptionSiteCode: 'H05',
        details
      }
      console.log(params)
      abnormalSave(params).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.abnormalReportDialog = false
      })
    },
    tabClick(index) {
      this.activeTabIndex = index
    },
    radioChange(data) {
      if (data === 0) {
        this.$refs.importBatchImput.focus()
      } else {
        this.$refs.importPlateImput.focus()
      }
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const params = {
        pageNum: 1,
        pageSize: 10000
      }
      findAlnMachine(params).then(res => {
        res.data.list.map((item) => {
          item.status = item.status === 0
        })
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    switchChange(row) {
      console.log(row)
      const param = {
        id: row.id,
        status: row.status ? 0 : 1
      }
      updateMachineStatus(param).then(res => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        this.fetchData()
      })
    },
    // 添加
    handleAdd() {
      this.machineForm.code = ''
      this.machineForm.name = ''
      this.machineForm.remark = ''
      this.addDialogVisible = true
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            code: this.machineForm.code,
            name: this.machineForm.name,
            remark: this.machineForm.remark,
            status: 0
          }
          addAlnMachine(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
              this.$refs[formName].resetFields()
              this.addDialogVisible = false
              this.fetchData()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 取消
    resetForm(formName) {
      this.addDialogVisible = false
      this.$refs[formName].resetFields()
    },
    // 删除按钮
    handleDelete(row) {
      this.$confirm('此操作将永久删除当前机台信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: row.id
        }
        remove(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.fetchData()
          }
        })
      })
    }
  }
}

