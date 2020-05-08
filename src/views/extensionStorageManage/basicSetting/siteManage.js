
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { ckStorehouseTypeFind, ckCustomerFind, ckBackhouseTypeFind, ckOutbillTypeFind,
  ckStorehouseTypeAdd, ckBackhouseTypeAdd, ckCustomerAdd, ckOutbillTypeAdd } from '@/api/chipManage/extensionStorageManage/basicSetting'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      receiveDialogVisible: false,
      deliverDialogVisible: false,
      transmitDialogVisible: false,
      batchDialogVisible: false,
      abnormalReportDialog: false,
      notBastic: false,
      waferTotalNum: 24,
      abnormalList: [{}],
      detailList: [{}],
      receiveList: [{}],
      selectedRunRow: {},
      model: '',
      pole: '',
      textareaRow: 0,
      batch: 5,
      totalNum: 120,
      batchNum: '',
      jBatchNum: '',
      sBatchNum: '',
      cBatchNum: '',
      process: '',
      sProcess: '',
      jProcess: '',
      cProcess: '',
      jRemark: '',
      cRemark: '',
      sRemark: '',
      jOperator: '',
      sOperator: '',
      cOperator: '',
      jRemarkLeft: '',
      sRemarkLeft: '',
      cRemarkLeft: '',
      trench: '', // 槽位
      grandTotal: '', // 累计片数
      threshold: '', // 阈值
      temperature: '', // 溶液温度
      etchingTime: '', // 腐蚀时间
      machineNum: '', // 机台编号
      motionRadio: '1',
      list: [
        {
          name: '入库类型',
          page: '入库管理',
          eg: '本部外延、徐州外延'
        },
        {
          name: '出库单据类型',
          page: '出库管理',
          eg: 'PC投片、代工、库存调整'
        },
        {
          name: '客户名称',
          page: '出库管理、新增挑片规则',
          eg: 'PC、国星、木林森'
        },
        {
          name: '退库类型',
          page: '退库/生产退库',
          eg: '库存调整、PC退库'
        }
      ],
      siteType: '',
      siteName: '',
      siteStatus: '',
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      dialogList: [],
      beginDate: '',
      endDate: '',
      pickerOptionsStart: {
        disabledDate: (time) => {
          const endDateVal = this.endDate
          if (endDateVal) {
            return time.getTime() > endDateVal
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          const beginDateVal = this.beginDate
          if (beginDateVal) {
            return time.getTime() < beginDateVal || time.getTime() > Date.now()
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      processOptions: [
        {
          id: 0,
          name: '工序1'
        },
        {
          id: 1,
          name: '工序2'
        }
      ],
      poleOptions: [
        {
          id: 0,
          name: '是'
        },
        {
          id: 1,
          name: '否'
        }
      ],
      currentId: ''
    }
  },
  mounted() {
  },
  methods: {
    clearSearch() {
      this.batchNum = ''
      this.process = ''
      this.beginDate = ''
      this.endDate = ''
      this.model = ''
      this.pole = ''
    },
    switchChange(row) {
      let alertMsg = ''
      if (!row.status) {
        alertMsg = '是否确认禁用'
      } else {
        alertMsg = '是否确认启用'
      }
      this.$confirm(alertMsg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

      }).catch(() => {
        row.status = !row.status
      })
    },
    deleteItem(index) {
      this.$confirm('确认删除该信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dialogList.splice(index, 1)
      })
    },
    // 添加
    handleAdd() {
      this.siteForm.siteType = ''
      this.siteForm.siteName = ''
      this.siteForm.siteStatus = ''
      this.addDialogVisible = true
    },
    // 关闭
    handleClose() {
      this.jBatchNum = ''
      this.cBatchNum = ''
      this.sBatchNum = ''
      this.jProcess = ''
      this.cProcess = ''
      this.sProcess = ''
      this.jRemark = ''
      this.sRemark = ''
      this.cRemark = ''
    },
    // 添加提交
    submitForm(formName) {
      const params = []
      for (const item of this.dialogList) {
        if (item.name === '') {
          this.$message({
            type: 'error',
            message: '名称不能为空!'
          })
          return false
        }
        if (item.code === '') {
          this.$message({
            type: 'error',
            message: '编号不能为空!'
          })
          return false
        }
        if (item.id === undefined) {
          params.push({
            code: item.code,
            name: item.name,
            remark: item.remark,
            status: item.status ? 0 : 1
          })
        } else {
          params.push({
            id: item.id,
            code: item.code,
            name: item.name,
            remark: item.remark,
            status: item.status ? 0 : 1
          })
        }
      }
      if (this.currentId === 0) {
        ckStorehouseTypeAdd(params).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.editDialogVisible = false
        })
      } else if (this.currentId === 1) {
        ckOutbillTypeAdd(params).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.editDialogVisible = false
        })
      } else if (this.currentId === 2) {
        ckCustomerAdd(params).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.editDialogVisible = false
        })
      } if (this.currentId === 3) {
        ckBackhouseTypeAdd(params).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.editDialogVisible = false
        })
      }
    },
    // 取消
    resetForm(formName) {
      this.addDialogVisible = false
      this.editDialogVisible = false
    },
    // 编辑
    handleEdit(index) {
      this.currentId = index
      switch (index) {
        case 0 : this.ckStorehouseTypeFindFun()
          break
        case 1 : this.ckOutbillTypeFindFun()
          break
        case 2 : this.ckCustomerFindFun()
          break
        case 3 : this.ckBackhouseTypeFindFun()
          break
      }
      this.editDialogVisible = true
    },
    handleAddItem() {
      this.dialogList.push({
        code: '',
        name: '',
        remark: '',
        status: true
      })
    },
    ckOutbillTypeFindFun() {
      ckOutbillTypeFind({ pageNum: 1, pageSize: 1000 }).then(res => {
        res.data.list.map((item) => {
          item.status = item.status === 0
        })
        this.dialogList = res.data.list
      })
    },
    ckStorehouseTypeFindFun() {
      ckStorehouseTypeFind({ pageNum: 1, pageSize: 1000 }).then(res => {
        res.data.list.map((item) => {
          item.status = item.status === 0
        })
        this.dialogList = res.data.list
      })
    },
    ckCustomerFindFun() {
      ckCustomerFind({ pageNum: 1, pageSize: 1000 }).then(res => {
        res.data.list.map((item) => {
          item.status = item.status === 0
        })
        this.dialogList = res.data.list
      })
    },
    ckBackhouseTypeFindFun() {
      ckBackhouseTypeFind({ pageNum: 1, pageSize: 1000 }).then(res => {
        res.data.list.map((item) => {
          item.status = item.status === 0
        })
        this.dialogList = res.data.list
      })
    }
  }
}

