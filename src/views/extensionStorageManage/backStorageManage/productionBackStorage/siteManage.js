
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findCode, findType, findWaitBackWafer, insert, pageList, findBackDetail } from '@/api/chipManage/extensionStorageManage/productionBackStorage'
import { findCustomer } from '@/api/chipManage/extensionStorageManage/outStorage'
import { getToken } from '@/utils/auth'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      recordDialogVisible: false,
      notBastic: false,
      listNum: '',
      listType: '',
      customerName: '',
      creater: '',
      inputValue: '',
      customerList: [],
      dialogList: [],
      backType: '',
      createTime: '',
      backRemark: '',
      listNumDialog: '',
      WaferID: '',
      waferList: '',
      waferTol: 0,
      totalBack: 0,
      waferTotalNum: 24,
      isActive: 0,
      abnormalList: [{}],
      detailList: [{}],
      receiveList: [{}],
      selectedRunRow: {},
      model: '',
      pole: '',
      textareaRow: 0,
      batch: 5,
      totalNum: 120,
      trench: '', // 槽位
      grandTotal: '', // 累计片数
      threshold: '', // 阈值
      temperature: '', // 溶液温度
      etchingTime: '', // 腐蚀时间
      machineNum: '', // 机台编号
      motionRadio: '1',
      list: [],
      siteType: '',
      siteName: '',
      siteStatus: '',
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
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
          name: '改为出库'
        },
        {
          id: 1,
          name: '保持原有'
        },
        {
          id: 2,
          name: '重新分配'
        }
      ],
      backOptions: [],
      selectType: 0,
      selectOption: [
        { id: 0, name: 'RUN ID' },
        { id: 1, name: 'BOX ID' }
      ],
      currentId: ''
    }
  },
  mounted() {
    this.creater = getToken()
    this.createTime = this.getFormatDate()
    this.findCodeFun()
    this.findCustomerFun()
    this.findTypeFun()
  },
  methods: {
    // 退库类型
    findTypeFun() {
      findType({}).then(res => {
        this.backOptions = res.data
      })
    },
    // 客户
    findCustomerFun() {
      findCustomer({}).then(res => {
        this.customerList = res.data
      })
    },
    findCodeFun() {
      findCode({}).then(res => {
        this.listNum = res.data
      })
    },
    getFormatDate() {
      var date = new Date()
      var month = date.getMonth() + 1
      var strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      var currentDate = date.getFullYear() + '-' + month + '-' + strDate
      return currentDate
    },
    handleCloseSendDialog() {
    },
    handleDialogSearch() {
      this.pageNum = 1
      this.pageListFun()
    },
    clearDialogSearch() {
      this.listNumDialog = ''
      this.WaferID = ''
      this.beginDate = ''
      this.endDate = ''
      this.handleDialogSearch()
    },
    handleDialogPrint() {
    },
    handleExport() {
      const headerCn = 'RunID;WaferID;出库盒号;出库片位;柜位;入库盒号;入库片位;衬底类型;衬底厂家;镭刻号;目检;PL_WD;PL_WD_STD;PL.I.I;PL.I.I.Std;PL_PD;PL_Ref;LOP(460);综合判定;ESD(200);ESD去坏(50V);综合良率;VF1 Yield;Ir Yield;VZ Yield;VF1;VF2;WLD1;Ir;VZ;IV;WLD(PL-COW);预估COW波长;ESD(400);验证版型;生产类型;IR<0.2 yield;Recipe_Name;外延盒号;HW;B.S;目检原因;Color;Sub;机台;ESD去坏（500V）;ESD去坏（300V）;BOW;PLINT_STD;Avg_Vf4;Thyristor良率'
      const headerEn = 'runId,waferId,ckBoxNo,ckSequence,arkName,boxNo,sequence,subType,supplier,laserMark,inspection,plWd,plWtd,plIi,PLIIStd,plPd,plRef,lop460,judge,esd200v,esd50v,yield,vf1Yield,lrYield,vzYield,vf1,vf2,wld,lr,vz,iv,kVal,cowWd,esd400,yzType,product,yieldIr02,recipe,wyBoxNo,hw1,bs,visualReason,color,sub,machine,esd500,esd300,bow,plintStd,avgVf4,thyristor'
      window.open(process.env.BASE_API + `/ckProduceBack/exportExcel?id=${this.selectedRunRow.id}&waferId=${this.WaferID}&headerCn=${headerCn}&headerEn=${headerEn}`)
    },
    cellDblclick() {
    },
    // Run信息/Wafer信息切换
    navClick(index) {
      if (index === 1 && this.dialogList.length !== 0) {
        this.findWaferFun(this.selectedRunRow.id)
      }
      this.isActive = index
    },
    findWaferFun(id) {
      const requestParams = {
        id,
        waferId: this.WaferID,
        pageNum: 1,
        pageSize: 10000
      }
      findBackDetail(requestParams).then(res => {
        this.waferList = res.data.list
      })
    },
    // 每页数量改变
    sizeChange(pageSize) {
      this.pageSize = pageSize
      this.pageListFun()
    },
    // 当前页数改变
    currentChange(pageNum) {
      this.pageNum = pageNum
      this.pageListFun()
    },
    // 时间戳转yyyy-mm-dd
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    pageListFun() {
      const requestParams = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        billNo: this.listNumDialog,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate),
        waferId: this.WaferID
      }
      pageList(requestParams).then(res => {
        this.dialogList = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.waferTol = this.dialogList[0].count
        this.selectedRunRow = this.dialogList[0]
        setTimeout(() => {
          this.$refs.runTable.setCurrentRow(this.dialogList[0])
        }, 200)
      })
    },
    handleSearch() {
      this.pageNum = 1
      this.fetchData()
    },
    clearSearch() {
      this.$confirm('是否清空Wafer列表?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.list = []
      })
    },
    // 单击异常信息
    rowClick(row) {
      this.selectedRunRow = row
      this.waferTol = row.count
    },
    // 查询
    fetchData() {
      if (this.inputValue.trim() === '') {
        return false
      }
      this.listLoading = true
      let requestParams = {}
      if (this.selectType === 0) {
        requestParams = {
          runId: this.inputValue
        }
      }
      if (this.selectType === 1) {
        requestParams = {
          boxId: this.inputValue
        }
      }
      requestParams.status = 0
      requestParams.pageNum = 1
      requestParams.pageSize = 10000
      findWaitBackWafer(requestParams).then(res => {
        this.list = res.data.list
        this.totalBack = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    // 添加
    handleAdd() {
      if (this.list.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择查询需要退库的wafer!'
        })
        return false
      }
      if (this.backType === '') {
        this.$message({
          type: 'error',
          message: '请选择退库类型!'
        })
        return false
      }
      const arr = []
      this.list.map(item => {
        arr.push({
          detailId: item.id
        })
      })
      const params = {
        backType: this.backType,
        billNo: this.listNum,
        createTime: this.createTime,
        creator: sessionStorage.getItem('User-Id'),
        wafers: arr
      }
      insert(params).then(res => {
        this.findCodeFun()
        this.list = []
        this.inputValue = ''
        this.backType = ''
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
      })
    },
    // 重新分配盒号
    // handleCreateBoxNo() {
    //   const requestParams = {
    //     details: this.list,
    //     num: this.listType
    //   }
    //   createBoxNo(requestParams).then(res => {
    //     this.list = res.data
    //   })
    // },
    // 打印
    handlePrint() {
    },
    // 退库单数据
    viewBackInfo() {
      this.isActive = 0
      this.recordDialogVisible = true
      this.pageListFun()
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
    // 取消
    resetForm(formName) {
      this.addDialogVisible = false
      this.editDialogVisible = false
      this.$refs[formName].resetFields()
    },
    // 编辑
    handleEdit(row) {
      this.notBastic = row.isbastic === 1
      this.currentId = row.id
      this.siteForm.siteType = row.type
      this.siteForm.siteName = row.name
      this.siteForm.siteStatus = row.status
      this.editDialogVisible = true
    }
  }
}

