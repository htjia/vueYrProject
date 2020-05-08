
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findAbnormalList } from '@/api/chipManage/rearSiteManage/cowOverSite'
import { abnormalSave } from '@/api/chipManage/rearSiteManage/tensileTest'
import { proceList } from '@/api/processManagement/proceManage'
import { siteSelect, acceptSliceScan, acceptSlice, cutSlice, upSlice, sendSlice, getRemark, getProgram, findMachinList, getRunCodeList, downLoadFile, findSiteException, findUserByRoleName, findMateListByElec, rawMaterial, saveZdMaterial, findZdMaterialList, updateZdMaterial } from '@/api/chipManage/frontSiteManage/cleanSite'
import { getList, nowProcessList } from '@/api/chipManage/transitSiteConfig'
import { findChangeRecord, changeBatchNo, findByBatchNo, findUnitByMaterialId } from '@/api/chipManage/rawMaterialManage/rawMaterial'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      selectTheadVisble: false,
      editDialogVisible: false,
      receiveDialogVisible: false,
      deliverDialogVisible: false,
      transmitDialogVisible: false,
      batchDialogVisible: false,
      abnormalReportDialog: false,
      notBastic: false,
      moReplaceDialogVisible: false,
      materialId: '',
      RunCode: '',
      waferTotalNum: 0,
      exception: {},
      selectedAbnormalNum: 0,
      waferTotal: 0,
      abnormalList: [],
      circleList: [],
      materialList: [],
      detailList: [],
      receiveList: [],
      userOptions: [],
      cutSliceList: [],
      abnormalReport: [],
      machinList: [],
      slotList: [],
      hoseNoList: [],
      machineType: '',
      runCodeList: [],
      electrodeMaterials: [],
      machineCode: '',
      beforeWeight: '',
      afterWeight: '',
      netWeight: '',
      paramsRemark: '',
      spanArr: '',
      pos: '',
      piandianzu: '',
      fengzhibochang: '',
      fengzhitouguangdu: '',
      touguangdu: '',
      evaporationThickness: '',
      runCode: '',
      abnormalBatchNum: '',
      program: '',
      selectedRunRow: {},
      selectedAbnormalRow: {},
      batchNo: '',
      model: '',
      pole: '',
      timeRadio: 1,
      textareaRow: 0,
      batch: 0,
      batchNum: '',
      runNum1: '',
      runNum2: '',
      threshold1: '',
      threshold2: '',
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
      motionRadio: 0,
      list: [],
      proceOptions: [],
      transmitList: [],
      rightList: [],
      moOptions: [
        { name: '试样', id: '0' },
        { name: '量产', id: '1' }
      ],
      yuList: [
        { name: '片' },
        { name: 'run' }
      ],
      munitList: [],
      abnormalRemark: '',
      siteType: '',
      siteName: '',
      siteStatus: '',
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      beginDate: '',
      endDate: '',
      theadOptions: [
        { thName: '片数', thKey: 'sliceNum' },
        { thName: '工序', thKey: 'processName' },
        { thName: '接片时间', thKey: 'receivedTime' },
        { thName: '接片人', thKey: 'receivedPeople' },
        { thName: '接片备注', thKey: 'receivedRemark' },
        { thName: '上片时间', thKey: 'upTime' },
        { thName: '上片人', thKey: 'upPeople' },
        { thName: '上片备注', thKey: 'upRemark' },
        { thName: '传片时间', thKey: 'deliverTime' },
        { thName: '传片人', thKey: 'deliverPeople' },
        { thName: '传片备注', thKey: 'deliverRemark' }
      ],
      formTheadOptions: [
        '片数',
        '工序',
        '接片时间',
        '接片人',
        '接片备注',
        '上片时间',
        '上片人',
        '上片备注',
        '传片时间',
        '传片人',
        '传片备注'
      ],
      checkboxVal: [
        '片数',
        '工序',
        '接片时间',
        '接片人',
        '备注',
        '上片时间',
        '上片人',
        '备注',
        '传片时间',
        '传片人',
        '备注'
      ],
      pickerStart: {
        disabledDate: (time) => {
          return time.getTime() > Date.now()
        }
      },
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
      mocvdForm: {
        id: '',
        materialModel: '',
        failureTime: '',
        creator: '',
        materialName: '',
        materialBatch: '',
        produceType: '',
        changeNum: '',
        createTime: '',
        materialUnit: '',
        warningVal: '',
        yuval: '',
        yuvalUnit: '',
        remark: '',
        rawId: ''
      },
      rules: {
        materialBatch: [
          { required: true, message: '请扫描或输入原材料编号', trigger: 'blur' },
          { pattern: /^[5A-Za-z0-9-\-]+$/, message: '原材料批号只能输入英文字母和数字和-', trigger: 'blur' }
        ],
        produceType: [{ required: true, message: '请选择', trigger: 'change' }],
        changeNum: [{ required: true, message: '请输入更换数量', trigger: 'blur' }],
        createTime: [{ required: true, message: '请选择', trigger: 'change' }],
        materialUnit: [{ required: true, message: '请选择', trigger: 'change' }],
        yuval: [{ required: true, message: '请输入阈值', trigger: 'blur' }],
        warningVal: [{ required: true, message: '请输入预警值', trigger: 'blur' }],
        yuvalUnit: [{ required: true, message: '请选择', trigger: 'change' }]
      },
      disForm: {
        materialBatch: '',
        produceType: '',
        changeNum: '',
        createTime: '',
        munit: '',
        yuval: '',
        yunit: '',
        remark: ''
      },
      currentId: '',
      formThead: [],
      handParams: [],
      handTestParams: [],
      autoParams: [],
      autoTestParams: [],
      paramsList: [],
      isSplit: 0,
      split: 0,
      isReceive: 0
    }
  },
  computed: {
    totalNum() {
      let num = 0
      this.receiveList.map(item => {
        num += item.total
      })
      return num
    }
  },
  mounted() {
    this.fetchData()
    this.findMachineUserFun()
    this.nowProcessListFun()
    this.getProceList()
    this.getListFun()
    this.formThead = this.theadOptions
    this.checkboxVal = localStorage.getItem('evaporationHeaders') === null ? this.formTheadOptions : localStorage.getItem('evaporationHeaders').split(',')
    this.setThead(this.checkboxVal)
  },
  methods: {
    // 批号验证
    changeBatch(val) {
      if (val) {
        findByBatchNo({ jsonStr: { batchNo: val, materialId: this.materialId }}).then(res => {
          this.mocvdForm.materialModel = res.data.materialModel
          this.mocvdForm.failureTime = res.data.failureTime
          this.munitList = []
          switch (res.data.result) {
            case 0:
              this.mocvdForm.produceType = '1'
              findUnitByMaterialId({ materialType: res.data.materialType }).then(response => {
                this.munitList = response.data
              })
              break
            case -1:
              this.$confirm('该原材料试样结果暂无检验结论，是否试样?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.mocvdForm.produceType = '0'
              }).catch(() => {
                this.mocvdForm.produceType = ''
                this.mocvdForm.materialBatch = ''
              })
              findUnitByMaterialId({ materialType: res.data.materialType }).then(response => {
                this.munitList = response.data
              })
              break
            case 1:
              this.$alert('该原材料试样结果为不合格，无法添加！', '提示', {
                confirmButtonText: '关闭',
                type: 'warning'
              }).then(() => {
                this.mocvdForm.produceType = ''
                this.mocvdForm.materialBatch = ''
              })
              break
            case 2:
              this.$alert('批号材料信息与当前材料信息不符！', '提示', {
                confirmButtonText: '关闭',
                type: 'warning'
              }).then(() => {
                this.mocvdForm.produceType = ''
                this.mocvdForm.materialBatch = ''
              })
              break
            case 3:
              this.$alert('批号信息未找到！', '提示', {
                confirmButtonText: '关闭',
                type: 'warning'
              }).then(() => {
                this.mocvdForm.produceType = ''
                this.mocvdForm.materialBatch = ''
              })
              break
            default:
              break
          }
        })
      }
    },
    // 取消更换
    restForm(formName) {
      this.moReplaceDialogVisible = false
      this.$refs.mocvdForm.resetFields()
      this.$refs.mocvdForm.clearValidate()
      this.getRawMaterial()
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const jsonStr = {
            id: this.mocvdForm.id,
            materialName: this.mocvdForm.materialName,
            materialModel: this.mocvdForm.materialModel,
            materialBatch: this.mocvdForm.materialBatch,
            produceType: this.mocvdForm.produceType,
            changeNum: this.mocvdForm.changeNum,
            createTime: this.mocvdForm.createTime,
            materialUnit: this.mocvdForm.materialUnit,
            yuval: this.mocvdForm.yuval,
            yuvalUnit: this.mocvdForm.yuvalUnit,
            warningVal: this.mocvdForm.warningVal,
            failureTime: this.mocvdForm.failureTime,
            remark: this.mocvdForm.remark,
            rawId: this.mocvdForm.rawId,
            machineId: this.mocvdForm.machineId,
            creator: sessionStorage.getItem('User-Id')
          }
          changeBatchNo({ jsonStr: jsonStr }).then(res => {
            this.munitList = []
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.$refs[formName].resetFields()
            this.moReplaceDialogVisible = false
            this.getRawMaterial()
          })
        }
      })
    },
    mSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    getSpanArr(data) {
      this.spanArr = []
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1) // 用于存放每一行记录的合并数
          this.pos = 0 // pos是spanArr的索引
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].materialName === data[i - 1].materialName) { // 则向spanArr中添入元素０，并将前一位元素＋１，表示合并行数＋１
            this.spanArr[this.pos] += 1
            this.spanArr.push(0) // 0 即表示该行不显示
          } else {
            this.spanArr.push(1)
            this.pos = i
          }
        }
      }
      console.log(this.spanArr, '===================')
      return this.spanArr
    },
    // 更换
    moReplace(row) {
      this.materialId = row.materialId
      this.moReplaceDialogVisible = true
      this.mocvdForm.id = row.batchId
      this.mocvdForm.materialName = row.materialName
      this.mocvdForm.materialBatch = ''
      this.mocvdForm.produceType = ''
      this.mocvdForm.changeNum = ''
      this.mocvdForm.warningVal = ''
      this.mocvdForm.yuval = ''
      this.mocvdForm.yuvalUnit = ''
      this.mocvdForm.remark = ''
      this.mocvdForm.rawId = row.rawId
      this.mocvdForm.machineId = this.machineNum
      setTimeout(() => {
        this.$refs.materialBatch.focus()
      }, 100)
      findChangeRecord({ jsonStr: { changeId: row.batchId }}).then(res => {
        this.mocvdForm.createTime = this.formatTime(new Date().getTime())
        if (res.data.list.length) {
          this.disForm = res.data.list[0]
          this.mocvdForm.yuval = this.disForm.ynum
          this.mocvdForm.yuvalUnit = this.disForm.yunit
        } else {
          this.disForm = {
            materialBatch: '',
            produceType: '',
            changeNum: '',
            createTime: '',
            munit: '',
            yuval: '',
            yunit: '',
            remark: ''
          }
        }
      })
    },
    // 时间戳转yyyy-mm-dd
    formatTime(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var M = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      var H = '0' + date.getHours()
      var m = '0' + date.getMinutes()
      return y + '-' + M.substring(M.length - 2, M.length) + '-' + d.substring(d.length - 2, d.length) + ' ' + H.substring(H.length - 2, H.length) + ':' + m.substring(m.length - 2, m.length)
    },
    downLoadFile(batchNo, processId) {
      const params = {
        siteId: 11,
        batchNo,
        processId
      }
      downLoadFile(params).then(res => {
        window.open(process.env.BASE_API + `/xp-produceTrack/down?siteId=11&batchNo=${batchNo}&processId=${processId}`)
      })
    },
    evaporationThicknessChange() {
      if (this.evaporationThickness < 0) {
        this.evaporationThickness = 0
      }
    },
    afterWeightChange() {
      if (this.afterWeight < 0) {
        this.afterWeight = 0
      }
      if (this.beforeWeight !== '' && this.afterWeight !== '') {
        this.netWeight = this.beforeWeight - this.afterWeight
      }
    },
    getListFun() {
      const params = {
        siteId: 11
      }
      getList(params).then(res => {
        this.isReceive = res.data[0].isReceive
        this.isSplit = res.data[0].isSplit
        if (this.isReceive === 0) {
          this.timeRadio = 2
        }
        // this.getParamsData(res.data[0])
        this.paramsList = res.data[0].params
      })
    },
    inputChange(data) {
      if (data.paramsCode === 'qianzhongliang' && parseInt(data.val) < 0) {
        data.val = 0
      }
    },
    getParamsData(row) {
      // pattern 0 自动  1 手动
      // type 0 上片  1 传片
      // paramsType 0 基础  1 参数
      // status 0 启用  1 禁用
      this.handParams = []
      this.handTestParams = []
      this.autoParams = []
      this.autoTestParams = []
      row.params.map(item => {
        // 手动参数                  0 上片                参数（非基础）            启用
        if (item.pattern === 1 && item.type === 0 && item.paramsType === 1 && item.status === 0) {
          item['val'] = ''
          this.handParams.push(item)
        }
        // 自动参数
        if (item.pattern === 0 && item.type === 0 && item.paramsType === 1 && item.status === 0) {
          item['val'] = ''
          this.autoParams.push(item)
        }
        // 手动测试参数              1 传片
        if (item.pattern === 1 && item.type === 1 && item.paramsType === 1 && item.status === 0) {
          item['val'] = ''
          this.handTestParams.push(item)
        }
        // 自动测试参数
        if (item.pattern === 0 && item.type === 1 && item.paramsType === 1 && item.status === 0) {
          item['val'] = ''
          this.autoTestParams.push(item)
        }
      })
    },
    setShow(code) {
      let flag = false
      this.handTestParams.map(item => {
        if (item.paramsCode === code) {
          flag = true
        }
      })
      return flag
    },
    setAutoTestParamsShow(code) {
      let flag = false
      this.autoTestParams.map(item => {
        if (item.paramsCode === code) {
          flag = true
        }
      })
      return flag
    },
    // 获取机台
    findMachinListFun() {
      const params = {
        siteId: 11,
        processId: this.jProcess,
        pageNum: 1,
        pageSize: 1000
      }
      findMachinList(params).then(res => {
        this.machinList = res.data.list
      })
    },
    getRawMaterial() {
      rawMaterial({ jsonStr: { machineId: this.machineNum }}).then(res => {
        this.circleList = res.data[0].circleList
        this.getSpanArr(this.circleList)
      })
    },
    // 机台改变
    machineChange(val) {
      this.getRawMaterial()
      this.machinList.map(item => {
        if (item.id === val) {
          this.slotList = item.slotNo === '' ? [] : item.slotNo.split(',')
          this.hoseNoList = item.hoseNo.split(',')
          this.machineType = item.slotNo === '' ? (item.hoseNo === '' ? '' : 1) : 0
          this.machineCode = item.machineCode
        }
      })
      this.trench = ''
    },
    deleteItem(index) {
      this.$confirm('确认删除该信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.receiveList.splice(index, 1)
        this.waferTotalNum = 0
        this.receiveList.map(item => {
          this.waferTotalNum += item.sliceNum
        })
        if (this.receiveList.length === 0) {
          this.waferTotalNum = 0
        }
      })
    },
    setThead(checkboxVal) {
      var arr = []
      this.theadOptions.map((item) => {
        this.checkboxVal.map((val) => {
          if (item.thName === val) {
            arr.push(item)
          }
        })
      })
      this.formThead = arr
    },
    selectThead() {
      this.selectTheadVisble = !this.selectTheadVisble
    },
    submitOption() {
      const arr = []
      console.log(this.checkboxVal)
      this.theadOptions.map((item) => {
        this.checkboxVal.map((val) => {
          if (item.thName === val) {
            arr.push(item)
          }
        })
      })
      localStorage.setItem('evaporationHeaders', this.checkboxVal)
      this.formThead = arr
      this.selectTheadVisble = false
    },
    resetOption() {
      this.selectTheadVisble = false
    },
    labelHead(h, { column, index }) {
      const l = column.label.length
      const f = 16 // 每个字大小，其实是每个字的比例值，大概会比字体大小差不多大一点，
      column.minWidth = l < 6 ? 120 : f * l // 字大小乘个数即长度 ,注意不要加px像素，这里minWidth只是一个比例值，不是真正的长度
      // 然后将列标题放在一个div块中，注意块的宽度一定要100%，否则表格显示不完全
      return h('div', { class: 'table-head', style: { width: '100%' }}, [column.label])
    },
    // 获取对应站点的工序
    getProceList() {
      const requestParams = {
        status: 0,
        siteId: 11,
        pageNum: 1,
        pageSize: 10000
      }
      proceList(requestParams).then(res => {
        this.proceOptions = res.data.list
      })
    },
    // 扫描回车
    handleReceiveInput(index) {
      if (this.jProcess === '') {
        this.$message({
          type: 'error',
          message: '请先选择工序!'
        })
        this.jBatchNum = ''
        return false
      }
      if (this.receiveList.filter(item => { return item.batchNo === this.jBatchNum }).length > 0) {
        this.$message({
          type: 'error',
          message: '当前批号已存在!'
        })
        this.jBatchNum = ''
        return false
      }
      this.receiveFun(index)
    },
    processJChange() {
      this.waferTotalNum = 0
      this.receiveList = []
      if (this.jBatchNum !== '') {
        this.receiveFun(1)
      }
    },
    getRunCodeListFun() {
      getRunCodeList({ siteId: 11, processId: this.jProcess }).then(res => {
        this.runCodeList = res.data
      })
    },
    // 选择run编号
    runCodeChange(code) {
      // if (this.jProcess !== 47) {
      //   getWeight({ runCode: code, siteId: 11, processId: this.jProcess }).then(res => {
      //     console.log(res.data)
      //     res.data.map(item => {
      //       if (item.paramName === 'qianzhongliang') {
      //         this.beforeWeight = item.paramValue
      //       }
      //     })
      //   })
      // }
      // getWeight({ runCode: code, siteId: 11, processId: this.jProcess }).then(res => {
      //   console.log(res.data)
      //   res.data.map(item => {
      //     if (item.paramName === 'qianzhongliang') {
      //       this.beforeWeight = item.paramValue
      //     }
      //   })
      // })
      findZdMaterialList({ runNo: code, processId: this.jProcess }).then(res => {
        this.materialList = res.data
        this.getSpanArr(this.materialList)
      })
    },
    afterWeightBlur(row) {
      if (row.afterWeight.toString().trim() === '') {
        return false
      } else {
        row.weight = row.befoeWeight - row.afterWeight
      }
    },
    processSChange(processId) {
      this.RunCode = ''
      this.waferTotalNum = 0
      this.receiveList = []
      this.machineType = ''
      this.handParams = []
      this.autoParams = []
      this.circleList = []
      this.paramsList.map(item => {
        // 电极参数                  0 上片                参数（非基础）            启用
        if (item.pattern === 1 && item.type === 0 && item.paramsType === 1 && item.status === 0 && item.processId.includes(processId)) {
          item['val'] = ''
          this.handParams.push(item)
        }
        // ITO参数
        if (item.pattern === 0 && item.type === 0 && item.paramsType === 1 && item.status === 0 && item.processId.includes(processId)) {
          item['val'] = ''
          this.autoParams.push(item)
        }
      })
      // if (processId === 47 || processId === 147 || processId === 148) {
      //   this.motionRadio = 1
      // } else {
      //   this.motionRadio = 0
      // }
      console.log(this.handParams)
      if (this.jBatchNum !== '') {
        this.receiveFun(2)
      }
      this.machineNum = ''
      this.trench = ''
      this.findMachinListFun()
    },
    processCChange(processId) {
      this.runCode = ''
      this.piandianzu = ''
      this.fengzhibochang = ''
      this.fengzhitouguangdu = ''
      this.touguangdu = ''
      this.waferTotalNum = 0
      this.receiveList = []
      this.handTestParams = []
      this.autoTestParams = []
      this.paramsList.map(item => {
        // 电极测试参数              1 传片
        if (item.pattern === 1 && item.type === 1 && item.paramsType === 1 && item.status === 0 && item.processId.includes(processId)) {
          item.vals = ''
          this.handTestParams.push(item)
        }
        // ITO测试参数
        if (item.pattern === 0 && item.type === 1 && item.paramsType === 1 && item.status === 0 && item.processId.includes(processId)) {
          item.vals = ''
          this.autoTestParams.push(item)
        }
      })
      console.log(this.handTestParams, '=====handTestParams')
      console.log(this.autoTestParams, '=====autoTestParams')
      // if (processId === 47 || processId === 147 || processId === 148) {
      //   this.motionRadio = 1
      // } else {
      //   this.motionRadio = 0
      // }
      this.getRunCodeListFun()
      if (this.jBatchNum !== '') {
        this.receiveFun(3)
      }
    },
    // 扫描请求数据
    receiveFun(index) {
      console.log(this.jBatchNum.substr(this.jBatchNum.length - 3))
      const requestParams = {
        siteId: 11,
        processId: this.jProcess,
        type: index,
        batchNo: this.jBatchNum
      }
      acceptSliceScan(requestParams).then(res => {
        this.getRemarkFun()
        this.getProgramFun(index)
        if (index === 3) {
          this.isSplit = res.data.isSplit
        }
        if (index === 2 && this.handParams.length > 0) {
          this.getElectrodeMaterials()
        }
        res.data.oldNum = res.data.sliceNum
        this.receiveList.push(res.data)
        this.jBatchNum = ''
        this.waferTotalNum = 0
        this.receiveList.map(item => {
          this.waferTotalNum += item.sliceNum
        })
      }).catch(res => {
        this.jBatchNum = ''
      })
    },
    // 获取电极材料
    getElectrodeMaterials() {
      findMateListByElec({ electrode: this.jBatchNum.substr(this.jBatchNum.length - 3) }).then(res => {
        this.electrodeMaterials = res.data
        console.log(this.electrodeMaterials)
      })
    },
    // 获取备注
    getRemarkFun() {
      const requestParams = {
        siteId: 11,
        processId: this.jProcess,
        batchNo: this.jBatchNum
      }
      getRemark(requestParams).then(res => {
        this.jRemark = res.data
      })
    },
    // 获取程序
    getProgramFun(index) {
      const requestParams = {
        siteId: 11,
        processId: this.jProcess,
        batchNo: this.jBatchNum
      }
      getProgram(requestParams).then(res => {
        this.program = res.data
        if (index === 3) {
          const params = {
            siteId: 11,
            processId: this.jProcess,
            programName: res.data
          }
          findSiteException(params).then(res => {
            this.exception = res.data
          })
        }
      })
    },
    onInput(data) {
      if (data.sliceNum > data.oldNum) {
        data.sliceNum = data.oldNum
      }
      if (data.sliceNum < 1 || data.sliceNum === null) {
        data.sliceNum = 1
      }
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
      findAbnormalList(params).then(res => {
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
        }
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
        processId: this.jProcess,
        description: this.abnormalRemark,
        exceptionSiteCode: 'Q11',
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
    // 拆批接片
    handleJiePian(row, index) {
      if (this.receiveList.filter(item => { return item.batchNo === row.batchNo }).length > 0) {
        this.$message({
          type: 'error',
          message: '当前批号已存在!'
        })
        return false
      } else {
        this.receiveList.push({
          batchNo: row.batchNo,
          priority: row.priority,
          isSplit: row.isSplit,
          sliceNum: row.waitNum,
          oldNum: row.waitNum
        })
        this.jBatchNum = row.batchNo
        this.waferTotalNum = 0
        this.receiveList.map(item => {
          this.waferTotalNum += item.sliceNum
        })
        this.getRemarkFun()
        this.getProgramFun(index)
        this.batchDialogVisible = false
      }
    },
    // 拆批上片
    handleShangPian() {
      console.log(1)
    },
    // 拆批传片
    handleChuanPian() {
      console.log(1)
    },
    handleSearch() {
      this.pageNum = 1
      this.fetchData()
    },
    clearSearch() {
      this.batchNum = ''
      this.process = ''
      this.beginDate = ''
      this.endDate = ''
      this.handleSearch()
    },
    exportExcel() {
      const startTime = this.beginDate === '' ? '' : this.formatDate(this.beginDate)
      const endTime = this.endDate === '' ? '' : this.formatDate(this.endDate)
      window.open(process.env.BASE_API + `/xp-beforeProcessManage/export?siteId=11&siteName=蒸镀站点&batchNo=${this.batchNum}&processId=${this.process}&startTime=${startTime}&endTime=${endTime}&timeType=${this.timeRadio}`)
    },
    // 接片
    handleReceive() {
      this.receiveDialogVisible = true
      setTimeout(() => {
        this.$refs.importInputJp.focus()
      }, 100)
    },
    // 接片确认
    handleReceiveDialog() {
      if (this.jOperator === '') {
        this.$message({
          type: 'error',
          message: '请选择操作员!'
        })
        return false
      }
      const batchNoList = {}
      let flag = false
      this.receiveList.map(item => {
        if (item.sliceNum === '' || item.sliceNum === '0') {
          flag = true
        }
        const keys = item.batchNo
        batchNoList[keys] = item.sliceNum
      })
      if (flag) {
        this.$message({
          type: 'error',
          message: 'Wafer片数不能为空!'
        })
        return false
      }
      const params = {
        siteId: 11,
        processId: this.jProcess,
        creatorId: this.jOperator,
        remark: this.jRemarkLeft,
        batchNoList: JSON.stringify(batchNoList)
      }
      acceptSlice(params).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.fetchData()
        this.receiveDialogVisible = false
      })
    },
    // 上片
    handleDeliver() {
      this.electrodeMaterials = []
      this.deliverDialogVisible = true
      setTimeout(() => {
        this.$refs.importInputSp.focus()
      }, 100)
    },
    // 上片确认
    handleDeliverSubmit() {
      if (this.machineNum === '') {
        this.$message({
          type: 'error',
          message: '请选择机台编号!'
        })
        return false
      }
      if (this.jOperator === '') {
        this.$message({
          type: 'error',
          message: '请选择操作员!'
        })
        return false
      }
      if (this.autoParams.length === 0 && this.handParams.length === 0) {
        console.log('剥离')
      } else {
        if (this.RunCode === '') {
          this.$message({
            type: 'error',
            message: '请输入参数信息!'
          })
          return false
        }
      }
      const batchNoList = {}
      let flag = false
      this.receiveList.map(item => {
        if (item.sliceNum === '' || item.sliceNum === '0') {
          flag = true
        }
        const keys = item.batchNo
        batchNoList[keys] = item.sliceNum
      })
      if (flag) {
        this.$message({
          type: 'error',
          message: 'Wafer片数不能为空!'
        })
        return false
      }
      if (this.circleList.length === 0 && this.electrodeMaterials.length > 0) {
        this.$message({
          type: 'error',
          message: '该机台支持原材料与电极材料不符，无法上片!'
        })
        return false
      }
      if (this.circleList.length < this.electrodeMaterials.length) {
        this.$message({
          type: 'error',
          message: '该机台支持原材料与电极材料不符，无法上片!'
        })
        return false
      } else {
        let flag = false
        const mMaterialList = []
        this.circleList.map(mMaterial => {
          mMaterialList.push(mMaterial.materialName)
        })
        this.electrodeMaterials.map(eMaterial => {
          if (!mMaterialList.includes(eMaterial.name)) {
            flag = true
          }
        })
        if (flag) {
          this.$message({
            type: 'error',
            message: '该机台支持原材料与电极材料不符，无法上片!'
          })
          return false
        }
      }
      const paramsList = {}
      paramsList.machineCode = this.machineNum
      paramsList.runbianhao = this.RunCode
      paramsList.caohao = this.trench
      const params = {
        siteId: 11,
        processId: this.jProcess,
        machineCode: this.machineNum,
        creatorId: this.jOperator,
        remark: this.jRemarkLeft,
        batchNoList: JSON.stringify(batchNoList),
        paramsList: JSON.stringify(paramsList)
      }
      console.log(params)
      upSlice(params).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        if (this.handParams.length > 0) {
          this.saveZdMaterialFun()
        }
        this.fetchData()
        this.deliverDialogVisible = false
      })
    },
    saveZdMaterialFun() {
      const params = []
      this.circleList.map(item => {
        params.push({
          batchNo: item.materialBatch,
          befoeWeight: item.befoeWeight === undefined ? '' : item.befoeWeight,
          materialId: item.materialId,
          processId: this.jProcess,
          runNo: this.RunCode
        })
      })
      console.log(params)
      saveZdMaterial(params).then(res => {
        this.handParams = []
        this.RunCode = ''
      })
    },
    // 传片
    handleTransmit() {
      this.transmitDialogVisible = true
      setTimeout(() => {
        this.$refs.importInputCp.focus()
      }, 100)
    },
    // 传片确认
    handleTransmitDialog() {
      if (this.jOperator === '') {
        this.$message({
          type: 'error',
          message: '请选择操作员!'
        })
        return false
      }
      // if (this.runCode === '') {
      //   this.$message({
      //     type: 'error',
      //     message: '请选择Run编号!'
      //   })
      //   return false
      // }
      if (this.handTestParams.length === 0 && this.autoTestParams.length === 4) {
        console.log('ITO')
      } else if (this.handTestParams.length === 2 && this.autoTestParams.length === 0) { // 电极参数
        if (this.evaporationThickness === '') {
          this.$message({
            type: 'error',
            message: '请输入蒸镀厚度!'
          })
          return false
        }
      }
      if (this.handTestParams.length === 0 && this.autoTestParams.length === 4) {
        console.log('ITO')
      } else if (this.handTestParams.length === 2 && this.autoTestParams.length === 0) { // 电极参数
        if (JSON.stringify(this.exception) !== '{}') {
          if (parseInt(this.evaporationThickness) < parseInt(this.exception.zhengduhoudu.split(',')[0]) || parseInt(this.evaporationThickness) > parseInt(this.exception.zhengduhoudu.split(',')[1])) {
            this.$message({
              type: 'error',
              message: '蒸镀厚度数信息异常，请先进行异常上报!'
            })
            return false
          }
        }
      }
      if (this.handTestParams.length === 0 && this.autoTestParams.length === 4) { // ITO
        if (this.piandianzu === '' || this.fengzhibochang === '' || this.fengzhitouguangdu === '' || this.touguangdu === '') {
          this.$message({
            type: 'error',
            message: '请完善传片信息!'
          })
          return false
        }
        if (JSON.stringify(this.exception) !== '{}') {
          if (parseInt(this.piandianzu) < parseInt(this.exception.piandianzu.split(',')[0]) || parseInt(this.piandianzu) > parseInt(this.exception.piandianzu.split(',')[1])) {
            this.$message({
              type: 'error',
              message: '片电阻参数信息异常，请先进行异常上报!'
            })
            return false
          }
          if (parseInt(this.fengzhibochang) < parseInt(this.exception.fengzhibochang.split(',')[0]) || parseInt(this.fengzhibochang) > parseInt(this.exception.fengzhibochang.split(',')[1])) {
            this.$message({
              type: 'error',
              message: '峰值波长参数信息异常，请先进行异常上报!'
            })
            return false
          }
          if (parseInt(this.fengzhitouguangdu) < parseInt(this.exception.fengzhitouguangdu.split(',')[0]) || parseInt(this.fengzhitouguangdu) > parseInt(this.exception.fengzhitouguangdu.split(',')[1])) {
            this.$message({
              type: 'error',
              message: '峰值透光度参数信息异常，请先进行异常上报!'
            })
            return false
          }
          if (parseInt(this.touguangdu) < parseInt(this.exception['touguangdu'].split(',')[0]) || parseInt(this.touguangdu) > parseInt(this.exception['touguangdu'].split(',')[1])) {
            this.$message({
              type: 'error',
              message: '460nm透光度参数信息异常，请先进行异常上报!'
            })
            return false
          }
        }
      }
      const batchNoList = {}
      let flag = false
      this.receiveList.map(item => {
        if (item.sliceNum === '' || item.sliceNum === '0') {
          flag = true
        }
        const keys = item.batchNo
        batchNoList[keys] = item.sliceNum
      })
      if (flag) {
        this.$message({
          type: 'error',
          message: 'Wafer片数不能为空!'
        })
        return false
      }
      var paramsList = {}
      if (this.handTestParams.length === 0 && this.autoTestParams.length === 4) { // ITO
        paramsList = {
          piandianzu: this.piandianzu,
          fengzhibochang: this.fengzhibochang,
          fengzhitouguangdu: this.fengzhitouguangdu,
          runbianhao: this.runCode,
          touguangdu: this.touguangdu
        }
      } else if (this.handTestParams.length === 2 && this.autoTestParams.length === 0) { // 电极
        paramsList = {
          runbianhao: this.runCode,
          zhengduhoudu: this.evaporationThickness
          // qianzhongliang: this.beforeWeight,
          // houzhongliang: this.afterWeight,
          // jingzhongliang: this.netWeight
          // remark: this.paramsRemark
        }
      }
      const params = {
        siteId: 11,
        processId: this.jProcess,
        creatorId: this.jOperator,
        remark: this.jRemarkLeft,
        batchNoList: JSON.stringify(batchNoList),
        paramsList: JSON.stringify(paramsList)
      }
      console.log(params)
      console.log(this.materialList)
      sendSlice(params).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.fetchData()
        this.transmitDialogVisible = false
        if (this.handTestParams.length === 2 && this.autoTestParams.length === 0 && this.runCode !== '') {
          this.updateZdMaterialFun()
        }
      })
    },
    updateZdMaterialFun() {
      updateZdMaterial(this.materialList).then(res => {
        this.handTestParams = []
      })
    },
    // 拆批数据
    batchDate(index) {
      this.runStatus = index
      const params = {
        siteId: 11,
        processId: this.jProcess,
        type: index
      }
      cutSlice(params).then(res => {
        this.cutSliceList = res.data
      })
      this.batchDialogVisible = true
    },
    // 上片确认
    handleDeliverDialog() {
      console.log(1)
    },
    // 时间戳转yyyy-mm-dd
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    // 获取对应站点的工序
    nowProcessListFun() {
      nowProcessList({ siteId: 11 }).then(res => {
        this.proceOptions = res.data
      })
    },
    // 人员
    findMachineUserFun() {
      findUserByRoleName({ roleName: '薄膜车间' }).then(res => {
        this.userOptions = res.data
      })
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const requestParams = {
        siteId: 11,
        processId: this.process,
        batchNo: this.batchNum,
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate),
        timeType: this.timeRadio
      }
      siteSelect(requestParams).then(res => {
        res.data.list.map(item => {
          var timeArr = []
          var upTimeArr = []
          var deliverTimeArr = []
          var peopleArr = []
          var upPeopleArr = []
          var deliverPeopleArr = []
          var remarkArr = []
          var upRemarkArr = []
          var deliverRemarkArr = []
          item.received.map(sub => {
            timeArr.push(sub.doTime)
            peopleArr.push(sub.doPeople)
            if (sub.remark !== '') {
              remarkArr.push(sub.remark)
            }
            item['receivedTime'] = timeArr.join(',')
            item['receivedPeople'] = peopleArr.join(',')
            item['receivedRemark'] = remarkArr.join(',')
          })
          item.upSlice.map(sub => {
            upTimeArr.push(sub.doTime)
            upPeopleArr.push(sub.doPeople)
            if (sub.remark !== '') {
              upRemarkArr.push(sub.remark)
            }
            item['upTime'] = upTimeArr.join(',')
            item['upPeople'] = upPeopleArr.join(',')
            item['upRemark'] = upRemarkArr.join(',')
          })
          item.deliver.map(sub => {
            deliverTimeArr.push(sub.doTime)
            deliverPeopleArr.push(sub.doPeople)
            if (sub.remark !== '') {
              deliverRemarkArr.push(sub.remark)
            }
            item['deliverTime'] = deliverTimeArr.join(',')
            item['deliverPeople'] = deliverPeopleArr.join(',')
            item['deliverRemark'] = deliverRemarkArr.join(',')
          })
          // 设置参数列显示
          item.arrayFilted = this.mergeObject(item.paramLists)
          item.arrayFilted.map(sub => {
            var key = sub.paramName
            item[key] = sub.paramValue
          })
        })
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    mergeObject(item) {
      // 创建映射
      /* eslint-disable */
      var map = item.reduce((p, c) => [p[c.paramName] = p[c.paramName] || 0, p[c.paramName] += ',' + c.paramValue, p][2], {})
      // 获取映射结果
      var arrayFilted = Object.keys(map).map(key => [{ paramName: key, paramValue: map[key].substr(2) }][0])
      console.log(arrayFilted)
      return arrayFilted
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
      this.machineNum = ''
      this.fengzhibochang = ''
      this.fengzhitouguangdu = ''
      this.touguangdu = ''
      this.threshold2 = ''
      this.jBatchNum = ''
      this.jProcess = ''
      this.jRemark = ''
      this.jOperator = ''
      this.jRemarkLeft = ''
      this.program = ''
      this.motionRadio = 0
      this.waferTotalNum = 0
      this.receiveList = []
      this.runCode = ''
      this.evaporationThickness = ''
      this.beforeWeight = ''
      this.afterWeight = ''
      this.trench = ''
      this.RunCode = ''
      this.piandianzu = ''
      this.paramsRemark = ''
      this.runCodeList = []
      this.handParams.map(item => {
        item.val = ''
      })
      this.autoParams.map(item => {
        item.val = ''
      })
      this.autoTestParams.map(item => {
        item.val = ''
      })
      this.handParams = []
      this.autoParams = []
      this.handTestParams = []
      this.autoTestParams = []
    },
    // 取消
    resetForm() {
      this.deliverDialogVisible = false
      this.receiveDialogVisible = false
      this.transmitDialogVisible = false
    }
  }
}

