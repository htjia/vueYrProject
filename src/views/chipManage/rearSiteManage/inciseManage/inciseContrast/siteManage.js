
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { querySpotCheckList, testConfig, replaceLabels, findForFlowCard, downByPath, spotCheck } from '@/api/chipManage/rearSiteManage/inciseOverSite'
import { findMachinList } from '@/api/chipManage/rearSiteManage/cowInfo'
import { printLabel } from '@/api/extensionManage/stockManage/mocvd'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      deleteDialogVisible: false,
      selectTheadVisble: false,
      downFileVisble: false,
      activeTabIndex: 0,
      list: [],
      fileList: [],
      modelList: [],
      userOptions: [],
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      timeRadio: '0',
      beginDate: '',
      endDate: '',
      control: false,
      checkedBefor: false,
      checkedAfter: false,
      disabledBefor: true,
      disabledAfter: true,
      defaultFormThead: [],
      formThead: [],
      machineList: [],
      theadOptions: [
        { thName: '测试类型', thKey: 'testStatusText' },
        { thName: '型号', thKey: 'model' },
        { thName: '划前IR<2', thKey: 'qir2' },
        { thName: '划前IR<1', thKey: 'qir1' },
        { thName: '划前IR<0.2', thKey: 'qir02' },
        { thName: '划后IR<2', thKey: 'hir2' },
        { thName: '划后IR<1', thKey: 'hir1' },
        { thName: '划后IR<0.2', thKey: 'hir02' },
        { thName: 'IR<2差值', thKey: 'ir2DValue' },
        { thName: 'IR<1差值', thKey: 'ir1DValue' },
        { thName: 'IR<0.2差值', thKey: 'ir02DValue' },
        { thName: '划前IRESD<2', thKey: 'qiresd2' },
        { thName: '划前IRESD<1', thKey: 'qiresd1' },
        { thName: '划前IRESD<0.2', thKey: 'qiresd02' },
        { thName: '划后IRESD<2', thKey: 'hiresd2' },
        { thName: '划后IRESD<1', thKey: 'hiresd1' },
        { thName: '划后IRESD<0.2', thKey: 'hiresd02' },
        { thName: 'IRESD<2差值', thKey: 'irEsd2DValue' },
        { thName: 'IRESD<1差值', thKey: 'irEsd1DValue' },
        { thName: 'IRESD<0.2差值', thKey: 'irEsd02DValue' },
        { thName: 'COT IR<2', thKey: 'cotIr2' },
        { thName: 'COT IR<1', thKey: 'cotIr1' },
        { thName: 'COT IR<0.2', thKey: 'cotIr02' },
        { thName: '划前VF3>=2.2(绿光1.8)', thKey: 'qvf322' },
        { thName: '划前VF3>=2.3(绿光1.9)', thKey: 'qvf323' },
        { thName: '划前VF3>=2.4(绿光2.0)', thKey: 'qvf324' },
        { thName: '划后VF3>=2.2(绿光1.8)', thKey: 'hvf322' },
        { thName: '划后VF3>=2.3(绿光1.9)', thKey: 'hvf323' },
        { thName: '划后VF3>=2.4(绿光2.0)', thKey: 'hvf324' },
        { thName: 'VF3>=2.2(绿光1.8)差值', thKey: 'vf322DValue' },
        { thName: 'VF3>=2.3(绿光1.9)差值', thKey: 'vf323DValue' },
        { thName: 'VF3>=2.4(绿光2.0)差值', thKey: 'vf324DValue' },
        { thName: 'COT VF3>=2.2(绿光1.8)', thKey: 'cotVf322' },
        { thName: 'COT VF3>=2.3(绿光1.9)', thKey: 'cotVf323' },
        { thName: 'COT VF3>=2.4(绿光2.0)', thKey: 'cotVf324' },
        { thName: '划前测试数', thKey: 'qtestNum' },
        { thName: '划后测试数', thKey: 'htestNum' },
        { thName: 'COT测试数', thKey: 'cotTestNum' },
        { thName: 'COT坏点数', thKey: 'cotBad' },
        { thName: '划前测试时间', thKey: 'qtestTime' },
        { thName: '划后测试时间', thKey: 'htestTime' },
        { thName: 'COT测试时间', thKey: 'cotTestTime' },
        { thName: '划前导入时间', thKey: 'qimportTime' },
        { thName: '划后导入时间', thKey: 'himportTime' },
        { thName: 'COT导入时间', thKey: 'cotImportTime' }
      ],
      formTheadOptions: [
        '测试类型',
        '型号',
        '划前IR<2',
        '划前IR<1',
        '划前IR<0.2',
        '划后IR<2',
        '划后IR<1',
        '划后IR<0.2',
        'IR<2差值',
        'IR<1差值',
        'IR<0.2差值',
        '划前IRESD<2',
        '划前IRESD<1',
        '划前IRESD<0.2',
        '划后IRESD<2',
        '划后IRESD<1',
        '划后IRESD<0.2',
        'IRESD<2差值',
        'IRESD<1差值',
        'IRESD<0.2差值',
        'COT IR<2',
        'COT IR<1',
        'COT IR<0.2',
        '划前VF3>=2.2(绿光1.8)',
        '划前VF3>=2.3(绿光1.9)',
        '划前VF3>=2.4(绿光2.0)',
        '划后VF3>=2.2(绿光1.8)',
        '划后VF3>=2.3(绿光1.9)',
        '划后VF3>=2.4(绿光2.0)',
        'VF3>=2.2(绿光1.8)差值',
        'VF3>=2.3(绿光1.9)差值',
        'VF3>=2.4(绿光2.0)差值',
        'COT VF3>=2.2(绿光1.8)',
        'COT VF3>=2.3(绿光1.9)',
        'COT VF3>=2.4(绿光2.0)',
        '划前测试数',
        '划后测试数',
        'COT测试数',
        'COT坏点数',
        '划前测试时间',
        '划后测试时间',
        'COT测试时间',
        '划前导入时间',
        '划后导入时间',
        'COT导入时间'
      ],
      checkboxVal: [
        '测试类型',
        '型号',
        '划前IR<2',
        '划前IR<1',
        '划前IR<0.2',
        '划后IR<2',
        '划后IR<1',
        '划后IR<0.2',
        'IR<2差值',
        'IR<1差值',
        'IR<0.2差值',
        '划前IRESD<2',
        '划前IRESD<1',
        '划前IRESD<0.2',
        '划后IRESD<2',
        '划后IRESD<1',
        '划后IRESD<0.2',
        'IRESD<2差值',
        'IRESD<1差值',
        'IRESD<0.2差值',
        'COT IR<2',
        'COT IR<1',
        'COT IR<0.2',
        '划前VF3>=2.2(绿光1.8)',
        '划前VF3>=2.3(绿光1.9)',
        '划前VF3>=2.4(绿光2.0)',
        '划后VF3>=2.2(绿光1.8)',
        '划后VF3>=2.3(绿光1.9)',
        '划后VF3>=2.4(绿光2.0)',
        'VF3>=2.2(绿光1.8)差值',
        'VF3>=2.3(绿光1.9)差值',
        'VF3>=2.4(绿光2.0)差值',
        'COT VF3>=2.2(绿光1.8)',
        'COT VF3>=2.3(绿光1.9)',
        'COT VF3>=2.4(绿光2.0)',
        '划前测试数',
        '划后测试数',
        'COT测试数',
        'COT坏点数',
        '划前测试时间',
        '划后测试时间',
        'COT测试时间',
        '划前导入时间',
        '划后导入时间',
        'COT导入时间'
      ],
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
      searchKeys: {
        WaferNo: '',
        jt: '',
        cslx: '',
        xh: '',
        wyjt: '',
        cc: '',
        searchTime: 0,
        cowjt: '',
        pdjg: ''
      },
      testOptions: [
        { name: '划前', id: 0 },
        { name: '划后', id: 1 },
        { name: '划前 + 划后', id: 2 }
      ],
      timeOptions: [
        { name: '划前测试时间', id: 0 },
        { name: '划后测试时间', id: 1 },
        { name: 'COT测试时间', id: 2 },
        { name: '划前导入时间', id: 3 },
        { name: '划前导入时间', id: 4 },
        { name: 'COT导入时间', id: 5 }
      ],
      selectedRunRow: {},
      machineForm: {
        code: '',
        jt: '',
        beforeWafer: '',
        afterWafer: ''
      },
      rules: {
        code: [{ required: true, message: '请输入测试Wafer', trigger: 'blur' }],
        jt: [{ required: true, message: '请选择机台', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.fetchData()
    this.findMachinListFun()
    this.getColorModelList()
    this.formThead = this.theadOptions
    this.checkboxVal = localStorage.getItem('inciseHeaders') === null ? this.formTheadOptions : localStorage.getItem('inciseHeaders').split(',')
    this.setThead(this.checkboxVal)
  },
  methods: {
    handleReceiveInput() {
      const params = {
        waferNo: this.machineForm.code
      }
      spotCheck(params).then(res => {
      }).catch(() => {
        this.machineForm.code = ''
      })
    },
    downLoadFile(url) {
      if (url === null) {
        this.$message({
          type: 'error',
          message: '附件不存在!'
        })
        return false
      }
      downByPath({ path: url }).then(res => {
        window.open(process.env.BASE_API + '/attachment/downByPath?path=' + url)
      })
    },
    downLoadQ(row) {
      if (row.cutCotQ !== null) {
        this.fileList = row.cutCotQ.files
        this.downFileVisble = true
      } else {
        this.$message({
          type: 'error',
          message: '附件不存在!'
        })
      }
    },
    downLoadH(row) {
      if (row.cutCotH !== null) {
        this.fileList = row.cutCotH.files
        this.downFileVisble = true
      } else {
        this.$message({
          type: 'error',
          message: '附件不存在!'
        })
      }
    },
    exportExcel() {
      const startTime = this.beginDate === '' ? '' : this.formatDate(this.beginDate)
      const endTime = this.endDate === '' ? '' : this.formatDate(this.endDate)
      let colEn = 'waferNo,machineCode'
      let colCn = 'WaferID,划片机台'
      this.formThead.map(item => {
        colEn += ',' + item.thKey
        colCn += ',' + item.thName
      })
      window.open(process.env.BASE_API + `/xp-cut-manage/export-data?waferNo=${this.searchKeys.WaferNo}&startTime=${startTime}&endTime=${endTime}&machineId=${this.searchKeys.jt}&testStatus=${this.searchKeys.cslx}&model=${this.searchKeys.xh}&colEn=${colEn}&colCn=${colCn}`)
    },
    // 获取型号
    getColorModelList() {
      const params = {
        pageNum: 1,
        pageSize: 10000
      }
      findForFlowCard(params).then(res => {
        if (res.code === 0) {
          this.modelList = res.data.list
        }
      })
    },
    // 获取cow机台
    findMachinListFun() {
      const params = {
        siteId: 26,
        pageNum: 1,
        pageSize: 1000
      }
      findMachinList(params).then(res => {
        this.machineList = res.data.list
      })
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
      localStorage.setItem('inciseHeaders', this.checkboxVal)
      this.formThead = arr
      this.selectTheadVisble = false
    },
    resetOption() {
      this.selectTheadVisble = false
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
    labelHead(h, { column, index }) {
      // const l = column.label.length
      // const f = 20 // 每个字大小，其实是每个字的比例值，大概会比字体大小差不多大一点，
      // column.minWidth = f * l // 字大小乘个数即长度 ,注意不要加px像素，这里minWidth只是一个比例值，不是真正的长度
      column.minWidth = 180 // 字大小乘个数即长度 ,注意不要加px像素，这里minWidth只是一个比例值，不是真正的长度
      // 然后将列标题放在一个div块中，注意块的宽度一定要100%，否则表格显示不完全
      return h('div', { class: 'table-head', style: { width: '100%' }}, [column.label])
    },
    // 重置
    clearSearch() {
      this.searchKeys.WaferNo = ''
      this.searchKeys.jt = ''
      this.searchKeys.cslx = ''
      this.searchKeys.xh = ''
      this.searchKeys.wyjt = ''
      this.searchKeys.cc = ''
      this.searchKeys.cowjt = ''
      this.searchKeys.pdjg = ''
      this.beginDate = ''
      this.endDate = ''
      this.handleSearch()
    },
    tabClick(index) {
      this.activeTabIndex = index
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
    // 时间戳转yyyy-mm-dd
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    // 补打标签
    handleReplenish() {
      this.machineForm.code = this.selectedRunRow.waferNo
      this.machineForm.jt = this.selectedRunRow.machineId + '%' + this.selectedRunRow.machineCode
      console.log(this.selectedRunRow.testStatus)
      if (this.selectedRunRow.testStatus === 0) { // 划前
        this.checkedBefor = true
        this.checkedAfter = false
        this.disabledBefor = true
        this.disabledAfter = false
        this.machineForm.beforeWafer = this.selectedRunRow.oldWaferNo
      } else if (this.selectedRunRow.testStatus === 1) { // 划后
        this.checkedAfter = true
        this.checkedBefor = false
        this.disabledBefor = false
        this.disabledAfter = true
        this.machineForm.afterWafer = this.selectedRunRow.newWaferNo
      } else if (this.selectedRunRow.testStatus === 2) { // 划前 + 划后
        this.checkedBefor = true
        this.checkedAfter = true
        this.disabledBefor = true
        this.disabledAfter = true
        this.machineForm.beforeWafer = this.selectedRunRow.oldWaferNo
        this.machineForm.afterWafer = this.selectedRunRow.waferNo + '-H' + this.selectedRunRow.machineCode
      }
      this.editDialogVisible = true
      setTimeout(() => {
        this.$refs.importInput.focus()
      }, 100)
    },
    handleSearch() {
      this.pageNum = 1
      this.fetchData()
    },
    importInputChange(data) {
      if (data !== '' && this.machineForm.jt !== '') {
        this.setWaferCode()
      }
    },
    // 机台改变
    machineChange(machineId) {
      if (machineId !== '' && this.machineForm.code !== '') {
        this.setWaferCode()
      }
    },
    setWaferCode() {
      this.disabledBefor = false
    },
    beforCheckboxChange(data) {
      // this.disabledAfter = !data
      if (data) {
        this.machineForm.beforeWafer = this.machineForm.code + '-Q' + this.machineForm.jt.split('%')[1]
      } else {
        this.machineForm.beforeWafer = ''
      }
    },
    afterCheckboxChange(data) {
      if (data) {
        this.machineForm.afterWafer = this.machineForm.code + '-H' + this.machineForm.jt.split('%')[1]
      } else {
        this.machineForm.afterWafer = ''
      }
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        waferNo: this.searchKeys.WaferNo,
        machineId: this.searchKeys.jt,
        testStatus: this.searchKeys.cslx,
        model: this.searchKeys.xh,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate)
      }
      querySpotCheckList(params).then(res => {
        res.data.list.map(item => {
          if (item.cutCotQ !== null) {
            item.qir2 = item.cutCotQ.ir2
            item.qir1 = item.cutCotQ.ir1
            item.qir02 = item.cutCotQ.ir02
            item.qiresd2 = item.cutCotQ.iresd2
            item.qiresd1 = item.cutCotQ.iresd1
            item.qiresd02 = item.cutCotQ.iresd02
            item.qvf322 = item.cutCotQ.vf322
            item.qvf323 = item.cutCotQ.vf323
            item.qvf324 = item.cutCotQ.vf324
            item.qtestNum = item.cutCotQ.testNum
            item.qtestTime = item.cutCotQ.testTime
            item.qimportTime = item.cutCotQ.importTime
            item.filePath = item.cutCotQ.files
          }
          if (item.cutCotH !== null) {
            item.hir2 = item.cutCotH.ir2
            item.hir1 = item.cutCotH.ir1
            item.hir02 = item.cutCotH.ir02
            item.hiresd2 = item.cutCotH.iresd2
            item.hiresd1 = item.cutCotH.iresd1
            item.hiresd02 = item.cutCotH.iresd02
            item.hvf322 = item.cutCotH.vf322
            item.hvf323 = item.cutCotH.vf323
            item.hvf324 = item.cutCotH.vf324
            item.htestNum = item.cutCotH.testNum
            item.htestTime = item.cutCotH.testTime
            item.himportTime = item.cutCotH.importTime
            item.filePath = item.cutCotH.files
          }
          if (item.testStatus === 0) {
            item.testStatusText = '划前'
          } else if (item.testStatus === 1) {
            item.testStatusText = '划后'
          } else if (item.testStatus === 2) {
            item.testStatusText = '划前 + 划后'
          }
        })
        this.list = res.data.list
        setTimeout(() => {
          this.$refs.runTable.setCurrentRow(this.list[0])
          this.selectedRunRow = this.list[0]
        }, 500)
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    // 单击Run信息
    rowClick(row) {
      this.selectedRunRow = row
    },
    labelPrint(testType) {
      const contents = [
        [
          {
            value: this.machineForm.jt.split('%')[1],
            key: 'machine'
          },
          {
            value: testType === '划前' ? this.machineForm.beforeWafer : this.machineForm.afterWafer,
            key: 'waferId'
          },
          {
            value: testType,
            key: 'testType'
          }
        ]
      ]
      const params = {
        module: 'inciseContrast',
        contents
      }
      printLabel(params).then(res => {
        this.$message({
          type: 'success',
          message: '标签正在打印中，请稍候！'
        })
      })
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            machineId: this.machineForm.jt.split('%')[0],
            waferNo: this.machineForm.code
          }
          if (this.checkedBefor) {
            params.oldWaferNo = this.machineForm.beforeWafer
          }
          if (this.checkedAfter) {
            params.newWaferNo = this.machineForm.afterWafer
          }
          testConfig(params).then(res => {
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
    // 补打标签
    submitEditForm() {
      if (!this.checkedAfter) {
        this.editDialogVisible = false
        return false
      }
      const params = {
        id: this.selectedRunRow.id,
        newWaferNo: this.machineForm.afterWafer
      }
      replaceLabels(params).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.editDialogVisible = false
          this.fetchData()
        }
      })
    },
    // 添加
    handleAdd() {
      this.machineForm.code = ''
      this.machineForm.beforeWafer = ''
      this.machineForm.afterWafer = ''
      this.addDialogVisible = true
      this.checkedBefor = false
      this.checkedAfter = false
      this.disabledBefor = true
      this.disabledAfter = true
      setTimeout(() => {
        this.$refs.importInput.focus()
      }, 100)
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
      this.machineForm.code = ''
      this.machineForm.jt = ''
    },
    // 取消
    resetForm(formName) {
      this.addDialogVisible = false
      this.editDialogVisible = false
      this.$refs[formName].resetFields()
    }
  }
}

