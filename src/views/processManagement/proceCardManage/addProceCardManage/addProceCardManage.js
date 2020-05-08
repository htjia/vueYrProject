
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { siteList } from '@/api/processManagement/siteManage'
import { proceList } from '@/api/processManagement/proceManage'
import { fetchList, fetchHistoryList, informationCheck, craftList, fetchCardInfo, fetchColorList, findForFlowCard, findForFlowCardEdit, add, fetchProgram } from '@/api/processManagement/proceCardManage'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      innerVisible: false,
      edit: false,
      isEdited: false,
      copyDialogVisible: false,
      typeDialogVisible: false,
      siveDialogVisible: false,
      historyDialogVisible: false,
      craftTypeChanged: false,
      cartId: '',
      proceCardForm: {
        code: '',
        proceCardName: '',
        proceCardType: 0,
        craftType: '',
        runType: 0,
        remark: '',
        beginDate: '',
        endDate: '',
        creator: '',
        beginModificDate: '',
        endModificDate: '',
        modifiedByUser: ''
      },
      proceCardTypeOptions: [
        {
          id: 0,
          name: '普通流程卡'
        },
        {
          id: 1,
          name: '重工流程卡'
        },
        {
          id: 2,
          name: '返工流程卡'
        },
        {
          id: 3,
          name: '自定义流程卡'
        }
      ],
      statusOptions: [
        {
          id: 0,
          name: '启用'
        },
        {
          id: 1,
          name: '停用'
        },
        {
          id: 2,
          name: '临时'
        }
      ],
      craftOptions: [],
      list: [
        { siteId: '', processId: '', programId: '', remark: '', sign: 0, proceDisabled: true, proceOptions: [], programOptions: [] },
        { siteId: '', processId: '', programId: '', remark: '', sign: 0, proceDisabled: true, proceOptions: [], programOptions: [] },
        { siteId: '', processId: '', programId: '', remark: '', sign: 0, proceDisabled: true, proceOptions: [], programOptions: [] },
        { siteId: '', processId: '', programId: '', remark: '', sign: 0, proceDisabled: true, proceOptions: [], programOptions: [] },
        { siteId: '', processId: '', programId: '', remark: '', sign: 0, proceDisabled: true, proceOptions: [], programOptions: [] },
        { siteId: '', processId: '', programId: '', remark: '', sign: 0, proceDisabled: true, proceOptions: [], programOptions: [] },
        { siteId: '', processId: '', programId: '', remark: '', sign: 0, proceDisabled: true, proceOptions: [], programOptions: [] },
        { siteId: '', processId: '', programId: '', remark: '', sign: 0, proceDisabled: true, proceOptions: [], programOptions: [] },
        { siteId: '', processId: '', programId: '', remark: '', sign: 0, proceDisabled: true, proceOptions: [], programOptions: [] },
        { siteId: '', processId: '', programId: '', remark: '', sign: 0, proceDisabled: true, proceOptions: [], programOptions: [] }
      ],
      endList: [
        { siteId: '', processId: '', programId: '', remark: '', sign: 0, proceDisabled: true, proceOptions: [], programOptions: [] },
        { siteId: '', processId: '', programId: '', remark: '', sign: 0, proceDisabled: true, proceOptions: [], programOptions: [] },
        { siteId: '', processId: '', programId: '', remark: '', sign: 0, proceDisabled: true, proceOptions: [], programOptions: [] },
        { siteId: '', processId: '', programId: '', remark: '', sign: 0, proceDisabled: true, proceOptions: [], programOptions: [] },
        { siteId: '', processId: '', programId: '', remark: '', sign: 0, proceDisabled: true, proceOptions: [], programOptions: [] }
      ],
      searchkey: '',
      searchOption: '',
      currentColor: '',
      editId: '',
      copyList: [],
      model1: [],
      model2: [],
      model3: [],
      model4: [],
      model5: [],
      model6: [],
      model7: [],
      model8: [],
      model9: [],
      model10: [],
      model11: [],
      model12: [],
      model13: [],
      model14: [],
      model15: [],
      model16: [],
      model17: [],
      model18: [],
      model19: [],
      model20: [],
      outModel1: [],
      outModel2: [],
      outModel3: [],
      outModel4: [],
      outModel5: [],
      outModel6: [],
      outModel7: [],
      outModel8: [],
      outModel9: [],
      outModel10: [],
      outModel11: [],
      outModel12: [],
      outModel13: [],
      outModel14: [],
      outModel15: [],
      outModel16: [],
      outModel17: [],
      outModel18: [],
      outModel19: [],
      outModel20: [],
      colorList: [],
      colorModelList: [],
      activeIndex: 0,
      activeTabIndex: '',
      pageSize: 15,
      copyPageSize: 15,
      pageNum: 1,
      copyPageNum: 1,
      hisPageNum: 1,
      totalPage: 0,
      copyTotalPage: 0,
      hisTotalPage: 0,
      pickerOptionsStart: {
        disabledDate: (time) => {
          const endDateVal = this.deleagteForm.endDate
          if (endDateVal) {
            return time.getTime() > endDateVal || time.getTime() < Date.now() - 86400000
          } else {
            return time.getTime() < Date.now() - 86400000
          }
        }
        // shortcuts: [{
        //   text: '今天',
        //   onClick(picker) {
        //     picker.$emit('pick', new Date())
        //   }
        // }]
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          const beginDateVal = this.deleagteForm.beginDate
          if (beginDateVal) {
            return time.getTime() < beginDateVal
          } else {
            return time.getTime() < Date.now() - 86400000
          }
        }
        // shortcuts: [{
        //   text: '今天',
        //   onClick(picker) {
        //     picker.$emit('pick', new Date())
        //   }
        // }]
      },
      proceOptions: [],
      forepartSiteOptions: [],
      endSiteOptions: [],
      deleagteForm: {
        endDate: '',
        beginDate: '',
        person: '',
        flow: ''
      },
      rules: {
        beginDate: [{ type: 'date', required: true, message: '请选择开始日期', trigger: 'blur' }],
        endDate: [{ type: 'date', required: true, message: '请选择结束日期', trigger: 'blur' }],
        person: [{ required: true, message: '请选择委托人', trigger: 'blur' }],
        flow: [{ required: true, message: '请选择委托流程', trigger: 'blur' }]
      },
      addIndex: '',
      crrentCode: '',
      currentCraftId: '',
      crrentCopyId: '',
      currentCardType: '',
      currentCardName: '',
      currentCraft: '',
      currentRemark: '',
      currentStatus: '',
      currentCreateTime: '',
      currentUpdateTime: '',
      currentCreator: '',
      currentModifier: '',
      copyCardType: '',
      createTime: '',
      lastUpdateTime: '',
      creator: '',
      modifier: '',
      dialogList: [],
      dialogEndList: [],
      currentModelList: [],
      modelList: [],
      historyList: [],
      currentId: ''
    }
  },
  created() {
    if (this.$route.query.isRework === '1') {
      this.proceCardTypeOptions = [
        {
          id: 2,
          name: '返工流程卡'
        }
      ]
      this.proceCardForm.proceCardType = 2
    }
    this.addIndex = this.$route.query.index
    if (this.$route.query.cardId !== undefined) {
      this.edit = true
      this.proceCardForm.code = this.$route.query.code
      this.proceCardForm.proceCardName = this.$route.query.cn
      this.proceCardForm.proceCardType = parseInt(this.$route.query.ct)
      this.proceCardForm.craftType = this.$route.query.cftNm
      this.cartId = this.$route.query.cftId
      this.proceCardForm.runType = parseInt(this.$route.query.cs)
      this.proceCardForm.remark = this.$route.query.rmk
      this.createTime = this.$route.query.crt
      this.lastUpdateTime = this.$route.query.upt
      this.creator = this.$route.query.creator
      this.modifier = this.$route.query.modifier
      this.editId = this.$route.query.cardId
      this.getProceCodeInfo(this.$route.query.cardId) // 设置编辑回显数据(根据流程卡ID查询)
    }
    this.getForepartSiteList()
    this.getEndSiteList()
    this.getColorList()
    this.getCraftList()
  },
  mounted() {
  },
  methods: {
    // 每页数量改变
    sizeChange(pageSize) {
      this.pageSize = pageSize
      this.fetchData()
    },
    modalPageChanges(eqptPageNum) {
      this.copyPageNum = eqptPageNum
      this.handleCopyCard()
    },
    hisPageChanges(hisPageNum) {
      this.hisPageNum = hisPageNum
      this.viewHistoricalVersion()
    },
    // 当前页数改变
    currentChange(pageNum) {
      this.pageNum = pageNum
      this.fetchData()
    },
    handleSearch(data) {
      this.searchkey = data
      this.pageNum = 1
      this.fetchData()
    },
    // 工艺改变
    craftTypeChange() {
      this.craftTypeChanged = true
    },
    // 站点改变
    siteChange(row) {
      this.currentSiteId = row.siteId
      this.getProceList(row)
      row.processId = ''
      row.programId = ''
      row.remark = ''
      row.programOptions = []
      row.siteChanged = true
    },
    // 工序改变
    proceChange(row, index) {
      if (index === 1) {
        const hasProcesId = []
        this.list.map(item => {
          if (this.edit) { // 编辑流程卡
            if (item.processId === row.processId) {
              hasProcesId.push(item.processId)
            }
            if (item.oldProcessId === row.processId) {
              hasProcesId.push(item.processId)
            }
          } else {
            if (item.processId === row.processId) {
              hasProcesId.push(item.processId)
            }
          }
        })
        if (hasProcesId.length > 1) {
          row.processId = ''
          row.remark = ''
          row.programId = ''
          this.$message({
            type: 'error',
            message: '工序不能重复!'
          })
        } else {
          row.programId = ''
          row.processChanged = true
          fetchProgram({ processId: row.processId }).then(res => {
            row.programOptions = res.data
          })
          row.proceOptions.map(item => {
            if (item.id === row.processId) {
              row.remark = item.remark
            }
          })
        }
      } else {
        const hasProces = []
        this.endList.map(item => {
          if (this.edit) { // 编辑流程卡
            if (item.processId === row.processId) {
              hasProces.push(item.processId)
            }
            if (item.oldProcessId === row.processId) {
              hasProces.push(item.processId)
            }
          } else {
            if (item.processId === row.processId) {
              hasProces.push(item.processId)
            }
          }
        })
        if (hasProces.length > 1) {
          row.processId = ''
          row.remark = ''
          row.programId = ''
          this.$message({
            type: 'error',
            message: '工序不能重复!'
          })
        } else {
          row.programId = ''
          row.processChanged = true
          fetchProgram({ processId: row.processId }).then(res => {
            row.programOptions = res.data
          })
          row.proceOptions.map(item => {
            if (item.id === row.processId) {
              row.remark = item.remark
            }
          })
        }
      }
    },
    // 获取对应站点的工序
    getProceList(row) {
      const requestParams = {
        status: 0,
        siteId: this.currentSiteId,
        pageNum: 1,
        pageSize: 10000
      }
      proceList(requestParams).then(res => {
        row.proceOptions = res.data.list
      })
    },
    // 所有前段站点
    getForepartSiteList() {
      const requestParams = {
        type: 0,
        status: 0,
        pageSize: 1000,
        pageNum: 1
      }
      siteList(requestParams).then(res => {
        this.forepartSiteOptions = res.data.list
      })
    },
    // 所有后段站点
    getEndSiteList() {
      const requestParams = {
        type: 1,
        status: 0,
        pageSize: 1000,
        pageNum: 1
      }
      siteList(requestParams).then(res => {
        this.endSiteOptions = res.data.list
      })
    },
    // 查看历史版本
    viewHistoricalVersion() {
      const requestParams = {
        id: this.$route.query.cardId,
        pageNum: this.hisPageNum,
        pageSize: 100
      }
      fetchHistoryList(requestParams).then(res => {
        this.historyList = res.data.list
        this.hisTotalPage = parseInt(res.data.total)
      })
      this.historyDialogVisible = true
    },
    handleView() {

    },
    // 所有工艺
    getCraftList() {
      const requestParams = {
        pageSize: 1000,
        pageNum: 1
      }
      craftList(requestParams).then(res => {
        this.craftOptions = res.data.list
      })
    },
    getCraftName(id) {
      if (this.edit && !this.craftTypeChanged) {
        return this.proceCardForm.craftType
      }
      if (typeof id === 'string') {
        return id
      }
      let name = ''
      this.craftOptions.map((item) => {
        if (id === item.id) {
          name = item.name
        }
      })
      return name
    },
    // 时间戳转yyyy-mm-dd
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    tabClick(index) {
      this.activeTabIndex = index
      this.handleCopyCard()
    },
    // 取消
    resetForm(formName) {
      this.editDialogVisible = false
      this.updatePwdDialogVisible = false
      this.addDialogVisible = false
      this.configDialogVisible = false
      this.$refs[formName].resetFields()
    },
    // 取消新增/编辑
    cancelProseCard() {
      if (this.$route.query.isRework === '1') {
        this.$router.push({ path: '/carftPorcess/proceCard' })
      } else {
        this.$router.push({ path: '/proceCardManage/index:id' })
      }
    },
    // 复制流程卡请求型号
    getProceCodeModel(id) {
      const requestParams = {
        id
      }
      fetchCardInfo(requestParams).then(res => {
        var arr = []
        if (res.data.modelList[0] !== null) {
          res.data.modelList.map((item) => {
            arr.push({
              color: item.color,
              modelName: item.modelList
            })
          })
        }
        this.currentModelList = arr
        this.setCopyProce(res.data.processList)
      })
    },
    // 编辑请求数据
    getProceCodeInfo(id, isCopy) {
      const requestParams = {
        id
      }
      fetchCardInfo(requestParams).then(res => {
        var arr = []
        if (res.data.modelList[0] !== null) {
          res.data.modelList.map((item) => {
            arr.push({
              color: item.color,
              modelName: item.modelList
            })
          })
        }
        this.modelList = arr
        console.log(isCopy)
        if (isCopy === undefined) {
          setTimeout(() => {
            this.setModel(res.data.modelList) // 设置对应型号光色回显
          }, 500)
        } else {
          this.modelList = []
          this.outModel1 = []
          this.outModel2 = []
          this.outModel3 = []
          this.outModel4 = []
          this.outModel5 = []
          this.outModel6 = []
          this.outModel7 = []
          this.outModel8 = []
          this.outModel9 = []
          this.outModel10 = []
          this.outModel11 = []
          this.outModel12 = []
          this.outModel13 = []
          this.outModel14 = []
          this.outModel15 = []
          this.outModel16 = []
          this.outModel17 = []
          this.outModel18 = []
          this.outModel19 = []
          this.outModel20 = []
          this.model1 = []
          this.model2 = []
          this.model3 = []
          this.model4 = []
          this.model5 = []
          this.model6 = []
          this.model7 = []
          this.model8 = []
          this.model9 = []
          this.model10 = []
          this.model11 = []
          this.model12 = []
          this.model13 = []
          this.model14 = []
          this.model15 = []
          this.model16 = []
          this.model17 = []
          this.model18 = []
          this.model19 = []
          this.model20 = []
        }
        this.setProce(res.data.processList) // 设置前后段工序回显
      })
    },
    // 设置对应型号光色回显
    setModel(data) {
      this.colorList.forEach((value, index) => {
        data.forEach((dv, di) => {
          if (value.color === dv.color) {
            if (index === 0) {
              this.outModel1 = dv.modelList
              this.model1 = dv.modelList
            } else if (index === 1) {
              this.outModel2 = dv.modelList
              this.model2 = dv.modelList
            } else if (index === 2) {
              this.outModel3 = dv.modelList
              this.model3 = dv.modelList
            } else if (index === 3) {
              this.outModel4 = dv.modelList
              this.model4 = dv.modelList
            } else if (index === 4) {
              this.outModel5 = dv.modelList
              this.model5 = dv.modelList
            } else if (index === 5) {
              this.outModel6 = dv.modelList
              this.model6 = dv.modelList
            } else if (index === 6) {
              this.outModel7 = dv.modelList
              this.model7 = dv.modelList
            } else if (index === 7) {
              this.outModel8 = dv.modelList
              this.model8 = dv.modelList
            } else if (index === 8) {
              this.outModel9 = dv.modelList
              this.model9 = dv.modelList
            } else if (index === 9) {
              this.outModel10 = dv.modelList
              this.model10 = dv.modelList
            } else if (index === 10) {
              this.outModel11 = dv.modelList
              this.model11 = dv.modelList
            } else if (index === 11) {
              this.outModel12 = dv.modelList
              this.model12 = dv.modelList
            } else if (index === 12) {
              this.outModel13 = dv.modelList
              this.model13 = dv.modelList
            } else if (index === 13) {
              this.outModel14 = dv.modelList
              this.model14 = dv.modelList
            } else if (index === 14) {
              this.outModel15 = dv.modelList
              this.model15 = dv.modelList
            } else if (index === 15) {
              this.outModel16 = dv.modelList
              this.model16 = dv.modelList
            } else if (index === 16) {
              this.outModel17 = dv.modelList
              this.model17 = dv.modelList
            } else if (index === 17) {
              this.outModel18 = dv.modelList
              this.model18 = dv.modelList
            } else if (index === 18) {
              this.outModel19 = dv.modelList
              this.model19 = dv.modelList
            } else if (index === 19) {
              this.outModel20 = dv.modelList
              this.model20 = dv.modelList
            }
          }
        })
      })
    },
    // 设置前后段工序回显
    setProce(data) {
      const firstProce = []
      const endProce = []
      data.map((item) => {
        if (item.type === 0) {
          firstProce.push(item)
        } else {
          endProce.push(item)
        }
      })
      firstProce.map((item) => {
        this.getEditProceList(item) // 编辑时获取对应站点的工序(保存到当前行)
      })
      endProce.map((item) => {
        this.getEditProceList(item) // 编辑时获取对应站点的工序(保存到当前行)
      })
      this.listLoading = true
      setTimeout(() => {
        this.list = firstProce
        this.endList = endProce
        this.listLoading = false
      }, 1000)
    },
    // 编辑时获取对应站点的工序(保存到当前行)
    getEditProceList(row) {
      console.log(row)
      const requestParams = {
        siteId: row.oldSiteId,
        pageNum: 1,
        pageSize: 10000,
        status: 0
      }
      proceList(requestParams).then(res => {
        row['proceOptions'] = res.data.list
      })
      fetchProgram({ processId: row.oldProcessId }).then(res => {
        row.programOptions = res.data
      })
    },
    setCopyProce(data) {
      const firstProce = []
      const endProce = []
      data.map((item) => {
        if (item.type === 0) {
          firstProce.push(item)
        } else {
          endProce.push(item)
        }
      })
      this.dialogList = firstProce
      this.dialogEndList = endProce
    },
    // 插入
    handleInsert(row, index, num) {
      const insertData = {
        siteId: '',
        processId: '',
        remark: '',
        sign: 0,
        proceDisabled: true,
        proceOptions: [],
        programOptions: []
      }
      if (num === 1) {
        this.list.splice(index, 0, insertData)
      } else {
        this.endList.splice(index, 0, insertData)
      }
    },
    // 上移
    handleUp(row, index, num) {
      if (index > 0) {
        if (num === 1) {
          const upDate = this.list[index - 1]
          this.list.splice(index - 1, 1)
          this.list.splice(index, 0, upDate)
        } else {
          const upDate = this.endList[index - 1]
          this.endList.splice(index - 1, 1)
          this.endList.splice(index, 0, upDate)
        }
      } else {
        this.$message({
          type: 'error',
          message: '已经是第一条，不可上移!'
        })
      }
    },
    // 下移
    handleDown(list, index, num) {
      if ((index + 1) === list.length) {
        this.$message({
          type: 'error',
          message: '已经是最后一条，不可下移!'
        })
      } else {
        if (num === 1) {
          const downDate = this.list[index + 1]
          this.list.splice(index + 1, 1)
          this.list.splice(index, 0, downDate)
        } else {
          const downDate = this.endList[index + 1]
          this.endList.splice(index + 1, 1)
          this.endList.splice(index, 0, downDate)
        }
      }
    },
    handlePush(index) {
      if (index === 1) {
        this.list.push({ siteId: '', processId: '', remark: '', programId: '', sign: 0, proceDisabled: true, proceOptions: [], programOptions: [], id: -1 })
      } else {
        this.endList.push({ siteId: '', processId: '', remark: '', programId: '', sign: 0, proceDisabled: true, proceOptions: [], programOptions: [], id: -1 })
      }
    },
    // 标识
    handleStar(row, index) {
      row.sign = row.sign === 0 ? 1 : 0
    },
    // 删除
    handleDelete(index, num) {
      this.$confirm('此操作将永久删除此项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (num === 1) {
          this.list.splice(index, 1)
        } else {
          this.endList.splice(index, 1)
        }
      }).catch(() => {
      })
    },
    // 对应型号选择-按钮
    handleSelectType() {
      this.typeDialogVisible = true
      setTimeout(() => {
        document.getElementById('modelTop').scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' })
      }, 100)
    },
    navClick(index, color) {
      document.getElementById('modelTop').scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' })
      this.activeIndex = index
      console.log(this.activeIndex)
      this.currentColor = color
      this.searchOption = ''
      if (this.edit) {
        this.getColorModelListEdit()
      } else {
        this.getColorModelList()
      }
    },
    handleCheckedTypesChange(value) {
      console.log(value)
    },
    // 复制流程卡
    handleCopyCard() {
      var requestParams = {
        pageNum: 1,
        pageSize: 10000
      }
      if (this.$route.query.isRework === '1') {
        requestParams.type = 2
      }
      fetchList(requestParams).then(res => {
        this.copyList = res.data.list
        this.copyTotalPage = parseInt(res.data.total)
      })
      this.copyDialogVisible = true
    },
    // 弹框内复制按钮
    handleCopy(row) {
      this.getProceCodeInfo(row.id, 1)
      this.proceCardForm.code = row.code
      this.proceCardForm.proceCardName = row.name
      this.proceCardForm.proceCardType = row.type
      this.proceCardForm.craftType = row.craftName
      // this.proceCardForm.craftType = row.craftId
      this.cartId = row.craftId
      this.proceCardForm.runType = row.status
      this.proceCardForm.remark = row.remark
      this.copyDialogVisible = false
    },
    // 查看历史版本
    handleReviewHistory(row) {
      this.getProceCodeModel(row.id)
      this.getHistory(row.id)
      this.innerVisible = true
    },
    getHistory(id) {
      const requestParams = {
        id,
        pageNum: 1,
        pageSize: 15
      }
      fetchList(requestParams).then(res => {
        this.setDataInfo(res.data.list[0])
      })
    },
    setDataInfo(row) {
      this.crrentCopyId = row.id
      this.crrentCode = row.code
      this.currentCardType = row.type
      this.currentCardName = row.name
      this.currentCraft = row.craftName
      this.currentCraftId = row.craftId
      this.currentRemark = row.remark
      this.currentStatus = row.status
      this.currentCreateTime = row.createTime
      this.currentUpdateTime = row.lastUpdateTime
      this.currentCreator = row.creator
      this.currentModifier = row.modifier
    },
    // 弹框内查看按钮
    handleReview(row) {
      this.setDataInfo(row)
      this.getProceCodeModel(row.id)
      this.innerVisible = true
    },
    // 里层复制按钮
    handleInCopy() {
      this.innerVisible = false
      this.copyDialogVisible = false
      this.proceCardForm.code = this.crrentCode
      this.proceCardForm.proceCardName = this.currentCardName
      this.proceCardForm.proceCardType = this.currentCardType
      this.proceCardForm.craftType = this.currentCraft
      // this.proceCardForm.craftType = this.currentCraftId
      this.cartId = this.currentCraftId
      this.proceCardForm.runType = this.currentStatus
      this.proceCardForm.remark = this.currentRemark
      this.getProceCodeInfo(this.crrentCopyId, 1)
    },
    // 获取光色
    getColorList() {
      fetchColorList({}).then(res => {
        if (res.code === 0) {
          this.colorList = res.data
          this.currentColor = this.colorList[0].color
          if (this.edit) {
            this.getColorModelListEdit()
          } else {
            this.getColorModelList()
          }
        }
      })
    },
    // 获取型号
    getColorModelList() {
      const params = {
        code: this.currentColor
      }
      findForFlowCard(params).then(res => {
        if (res.code === 0) {
          this.colorModelList = res.data
        }
      })
    },
    // 编辑时获取对应型号
    getColorModelListEdit() {
      console.log('编辑获取')
      const params = {
        id: this.editId,
        code: this.currentColor
      }
      findForFlowCardEdit(params).then(res => {
        if (res.code === 0) {
          this.colorModelList = res.data
        }
      })
    },
    submitModel() {
      this.outModel1 = this.model1
      this.outModel2 = this.model2
      this.outModel3 = this.model3
      this.outModel4 = this.model4
      this.outModel5 = this.model5
      this.outModel6 = this.model6
      this.outModel7 = this.model7
      this.outModel8 = this.model8
      this.outModel9 = this.model9
      this.outModel10 = this.model10
      this.outModel11 = this.model11
      this.outModel12 = this.model12
      this.outModel13 = this.model13
      this.outModel14 = this.model14
      this.outModel15 = this.model15
      this.outModel15 = this.model15
      this.outModel16 = this.model16
      this.outModel17 = this.model17
      this.outModel18 = this.model18
      this.outModel19 = this.model19
      this.outModel20 = this.model20
      this.typeDialogVisible = false
      this.isEdited = true
    },
    closeModelSelectDialog() {
      this.model1 = this.outModel1
      this.model2 = this.outModel2
      this.model3 = this.outModel3
      this.model4 = this.outModel4
      this.model5 = this.outModel5
      this.model6 = this.outModel6
      this.model7 = this.outModel7
      this.model8 = this.outModel8
      this.model9 = this.outModel9
      this.model10 = this.outModel10
      this.model11 = this.outModel11
      this.model12 = this.outModel12
      this.model13 = this.outModel13
      this.model14 = this.outModel14
      this.model15 = this.outModel15
      this.model15 = this.outModel15
      this.model16 = this.outModel16
      this.model17 = this.outModel17
      this.model18 = this.outModel18
      this.model19 = this.outModel19
      this.model20 = this.outModel20
    },
    // 保存按钮
    submitProseCard() {
      if (this.proceCardForm.code === '') {
        this.$message({
          type: 'error',
          message: '流程卡编号不能为空!'
        })
        return false
      }
      if (this.proceCardForm.proceCardName.trim() === '') {
        this.$message({
          type: 'error',
          message: '流程卡名称不能为空!'
        })
        return false
      }
      if (this.proceCardForm.craftType === '') {
        this.$message({
          type: 'error',
          message: '工艺分类不能为空!'
        })
        return false
      }
      console.log(this.model1)
      // const model = [...this.model1, ...this.model2, ...this.model3, ...this.model4, ...this.model5, ...this.model6, ...this.model7, ...this.model8, ...this.model9, ...this.model10, ...this.model10, ...this.model11, ...this.model12, ...this.model13, ...this.model14, ...this.model15, ...this.model16, ...this.model17, ...this.model18, ...this.model19, ...this.model20]
      // if (this.proceCardForm.proceCardType === 0 && model.length === 0) {
      //   this.$message({
      //     type: 'error',
      //     message: '请选择对应型号!'
      //   })
      //   return false
      // }
      console.log(this.endList.length)
      console.log(this.list.length)
      let firstHasProce = false
      this.list.map(item => {
        if (item.processId !== '') {
          firstHasProce = true
        }
      })
      let afterHasProce = false
      this.endList.map(item => {
        if (item.processId !== '') {
          afterHasProce = true
        }
      })
      if (!afterHasProce && !firstHasProce) {
        this.$message({
          type: 'error',
          message: '流程卡工序不能为空!'
        })
        return false
      }
      const requestParams = {
        id: this.editId,
        name: this.proceCardForm.proceCardName,
        code: this.proceCardForm.code
      }
      // 判断名称是否重复
      informationCheck(requestParams).then(res => {
        this.siveDialogVisible = true
      }).catch(() => {
        return false
      })
    },
    // 确认保存
    submitProcessForm() {
      const firstProcess = []
      const endProcess = []
      console.log(this.list)
      this.list.forEach((item, index) => {
        console.log(item.processId)
        if (item.processId !== '') {
          firstProcess.push({
            siteId: item.siteChanged ? item.siteId : item.oldSiteId,
            processId: item.processChanged ? item.processId : item.oldProcessId,
            programId: item.programId,
            remark: item.remark,
            sign: item.sign,
            steps: index,
            type: 0
          })
        }
      })
      if (this.proceCardForm.proceCardType !== 2) {
        this.endList.forEach((item, index) => {
          console.log(item.processId)
          if (item.processId !== '') {
            endProcess.push({
              siteId: item.siteChanged ? item.siteId : item.oldSiteId,
              processId: item.processChanged ? item.processId : item.oldProcessId,
              programId: item.programId,
              remark: item.remark,
              sign: item.sign,
              steps: index,
              type: 1
            })
          }
        })
      }
      const model = [...this.model1, ...this.model2, ...this.model3, ...this.model4, ...this.model5, ...this.model6, ...this.model7, ...this.model8, ...this.model9, ...this.model10, ...this.model11, ...this.model12, ...this.model13, ...this.model14, ...this.model15, ...this.model16, ...this.model17, ...this.model18, ...this.model19, ...this.model20]
      let idModel = []
      model.map((item) => {
        idModel.push(item.split('#')[1])
      })
      console.log(idModel)
      // 除了普通流程卡，其它都不提交对应型号
      if (this.proceCardForm.proceCardType !== 0) {
        idModel = []
      }
      let params
      if (this.$route.query.cardId !== undefined) {
        // 编辑
        params = {
          id: this.$route.query.cardId,
          code: this.proceCardForm.code,
          craftId: this.craftTypeChanged ? this.proceCardForm.craftType : this.cartId,
          modifier: sessionStorage.getItem('User-Id'),
          name: this.proceCardForm.proceCardName,
          processList: [...firstProcess, ...endProcess],
          remark: this.proceCardForm.remark,
          status: this.proceCardForm.runType,
          type: this.proceCardForm.proceCardType,
          model: idModel.join(',')
        }
      } else {
        // 新增
        params = {
          code: this.proceCardForm.code,
          // craftId: this.proceCardForm.craftType,
          craftId: this.craftTypeChanged ? this.proceCardForm.craftType : this.cartId,
          creator: sessionStorage.getItem('User-Id'),
          name: this.proceCardForm.proceCardName,
          processList: [...firstProcess, ...endProcess],
          remark: this.proceCardForm.remark,
          status: this.proceCardForm.runType,
          type: this.proceCardForm.proceCardType,
          model: idModel.join(',')
        }
      }
      console.log(params)
      add(params).then(res => {
        if (res.code === 0) {
          if (this.$route.query.cardId !== undefined) {
            this.$message({
              type: 'success',
              message: '编辑成功!'
            })
          } else {
            this.$message({
              type: 'success',
              message: '新增成功!'
            })
          }

          this.siveDialogVisible = false
          if (this.$route.query.isRework === '1') {
            this.$router.push({ path: '/carftPorcess/proceCard' })
          } else {
            this.$router.push({ path: '/proceCardManage/index:id' })
          }
        }
      })
    }
  }
}

