
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { getOutStorageList, findPickWafer, findOutgoingRule, findPickRule } from '@/api/chipManage/extensionStorageManage/outStorage'
import { findWafer, audit, autoCheck } from '@/api/chipManage/extensionStorageManage/outStorageAudit'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      sendDialogVisible: false,
      recordDialogVisible: false,
      detailDialogVisible: false,
      rulesDialogVisible: false,
      automaticCheckVisible: false,
      notBastic: false,
      isPrint: true,
      checkNull: false,
      checkStandardDelivery: false,
      dialogRule: '',
      maker: '',
      listNum: '',
      listNo: '',
      WaferID: '',
      ruleName: '',
      version: '',
      contentList: '',
      waferTotalNum: 24,
      dialogRuleId: 0,
      waferTotal: 0,
      specialList: [],
      pickRuleList: [],
      selectedRunRow: {},
      model: '',
      putInStorageNo: '',
      putInStorageType: '',
      itemType: '',
      putInTime: '',
      putInRemark: '',
      pole: '',
      isActive: 0,
      searchKeys: {
        status: 1,
        listNum: '',
        waferId: ''
      },
      list: [],
      waferList: [],
      siteType: '',
      siteName: '',
      siteStatus: '',
      timeRadio: 0,
      pageSize: 10,
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
      auditOptions: [
        { id: 1, name: '待审核' },
        { id: 2, name: '审核通过' },
        { id: 3, name: '审核不通过' },
        { id: 4, name: '取消' }
      ],
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
      selectType: 0,
      boxOrRun: [
        { id: 0, name: 'RUN ID' },
        { id: 1, name: 'BOX ID' }
      ],
      options: [
        { id: 0, name: 'RUN' },
        { id: 1, name: 'BOX' }
      ],
      result: '',
      currentId: ''
    }
  },
  mounted() {
    this.fetchData()
    this.findPickRuleFun()
  },
  methods: {
    exportExcel() {
      const columnCn = 'RunID;WaferID;出库盒号;出库片位;柜位;入库盒号;入库片位;衬底类型;衬底厂家;镭刻号;目检;PL_WD;PL_WD_STD;PL.I.I;PL.I.I.Std;PL_PD;PL_Ref;LOP(460);综合判定;ESD(200);ESD去坏(50V);综合良率;VF1 Yield;Ir Yield;VZ Yield;VF1;VF2;WLD1;Ir;VZ;IV;WLD(PL-COW);预估COW波长;ESD(400);验证版型;生产类型;IR<0.2 yield;Recipe_Name;外延盒号;HW;B.S;目检原因;Color;Sub;机台;ESD去坏（500V）;ESD去坏（300V）;BOW;PLINT_STD;Avg_Vf4;Thyristor良率'
      const columnEn = 'runId,waferId,ckBoxNo,ckSequence,arkName,boxNo,sequence,subType,supplier,laserMark,inspection,plWd,plWtd,plIi,PLIIStd,plPd,plRef,lop460,judge,esd200v,esd50v,yield,vf1Yield,lrYield,vzYield,vf1,vf2,wld,lr,vz,iv,kVal,cowWd,esd400,yzType,product,yieldIr02,recipe,wyBoxNo,hw1,bs,visualReason,color,sub,machine,esd500,esd300,bow,plintStd,avgVf4,thyristor'
      window.open(process.env.BASE_API + `/scOutgoing/export?id=${this.selectedRunRow.id}&type=${this.selectedRunRow.type}&orderNo=${this.selectedRunRow.order_no}&columnEn=${columnEn}&columnCn=${columnCn}`)
    },
    // 自动审核
    handleStartCheck() {
      if (!this.checkNull && !this.checkStandardDelivery) {
        this.$message({
          type: 'error',
          message: '请选择检测项目!'
        })
        return false
      }
      const params = {
        id: this.selectedRunRow.id,
        levelCheck: this.checkStandardDelivery,
        nullCheck: this.checkNull,
        ruleId: this.dialogRule
      }
      autoCheck(params).then(res => {
        this.result = res.data
      })
    },
    handleAudit(row, index) {
      const params = {
        id: row.id,
        auditor: sessionStorage.getItem('User-Id'),
        status: index
      }
      var alertText = ''
      if (index === 1) {
        alertText = '是否确认反审'
      } else if (index === 2) {
        alertText = '是否确认通过'
      } else {
        alertText = '是否确认退回'
      }
      this.$confirm(alertText, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        audit(params).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.searchKeys.status = 1
          this.fetchData()
        })
      })
    },
    // 挑片规则
    findPickRuleFun() {
      findPickRule({}).then(res => {
        this.pickRuleList = res.data
      })
    },
    handleSelected() {
      this.sendDialogVisible = true
    },
    handleCloseSendDialog() {

    },
    handleDialogSearch() {

    },
    clearDialogSearch() {

    },
    // 导出
    handleExport() {

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
    clearSearch() {
      this.searchKeys.status = ''
      this.searchKeys.listNum = ''
      this.searchKeys.waferId = ''
      this.timeRadio = 0
      this.beginDate = ''
      this.endDate = ''
    },
    // 自动检查
    automaticCheck() {
      this.pickRuleList.map(item => {
        if (item.name === this.selectedRunRow.rules) {
          this.dialogRule = item.id
        }
      })
      this.automaticCheckVisible = true
    },
    // 单击Run信息
    rowClick(row) {
      this.waferTotal = row.count
      this.selectedRunRow = row
      this.$refs.runTable.toggleRowSelection(row)
    },
    // Run信息/Wafer信息切换
    navClick(index) {
      if (index === 1 && this.list.length !== 0) {
        this.findWaferFun(this.selectedRunRow.id)
      }
      this.isActive = index
    },
    findWaferFun(id) {
      findWafer({ id, type: this.selectedRunRow.type }).then(res => {
        this.waferList = res.data
      })
    },
    // 导入
    handleImport() {

    },
    // 导入
    viewRecord() {
      this.recordDialogVisible = true
    },
    // 挑片规则
    viewRules(row) {
      if (row.rules === '特殊挑片') {
        this.detailDialogVisible = true
        findPickWafer({ id: row.id }).then(res => {
          this.specialList = res.data
        })
      } else {
        this.rulesDialogVisible = true
        findOutgoingRule({ id: row.id }).then(res => {
          this.ruleName = res.data[0].name
          this.version = res.data[0].version
          this.contentList = res.data[0].contentList
        })
      }
    },
    // 时间戳转yyyy-mm-dd
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const requestParams = {
        type: 0, // 出库形式
        // orderType: this.searchKeys.djlx, // 单据类型
        timeType: this.timeRadio, // 0 申请 1审核
        // customer: this.searchKeys.khmc, //
        orderNo: this.searchKeys.listNum,
        status: this.searchKeys.status,
        waferId: this.searchKeys.waferId,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate),
        operate: 'audit',
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }
      getOutStorageList(requestParams).then(res => {
        this.list = res.data.list
        if (res.data.list.length > 0) {
          this.waferTotal = this.list[0].count
          this.$refs.runTable.setCurrentRow(this.list[0])
          this.selectedRunRow = this.list[0]
        } else {
          this.waferTotal = 0
        }
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
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
      this.dialogRule = ''
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
    }
  }
}

