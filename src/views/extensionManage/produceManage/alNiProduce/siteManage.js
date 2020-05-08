
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { measureList } from '@/api/extensionManage/wyBasicInfoManage/substrateInfo'
import { printLabel } from '@/api/extensionManage/stockManage/mocvd'
import { getToken, getUserId } from '@/utils/auth'
import {
  findAlnMachine,
  findUser,
  findAlnCraft,
  findStopper,
  findCycle,
  alNiList,
  findWafer,
  findWaferIn,
  findSubstrate,
  add,
  takeSlice,
  findScattered,
  chooseSclie,
  findNewBoxNo,
  allotBox,
  removeSclie,
  alNiDelete,
  findMachineUser
} from '@/api/extensionManage/produceManage/alNiProduce'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      isFinish: false,
      notFinish: false,
      isTipOut: false,
      innerVisible: false,
      isAssigned: false,
      isSubmit: false,
      createBoxNumVisible: false,
      createSpBoxNumVisible: false,
      sanPianDialogVisible: false,
      editDialogVisible: false,
      selectTheadVisble: false,
      addDialogVisible: false,
      notBastic: false,
      ksDisabled: true,
      submitBtnDisabled: false,
      rightWaferTotal: 0,
      totals: 0,
      list: [],
      selectedRow: [],
      multipleSelection: [],
      scatteredList: [], // 散片库
      scatteredIdArr: [],
      alnMachineList: [], // 铝氮机台
      measureList: [], // 尺寸
      userList: [], // 放片人
      substrateList: [],
      alnCraftList: [], // 铝氮工艺
      boxList: [],
      defaultFormThead: [],
      searchKeys: {
        alnId: '',
        status: '',
        creator: '',
        machineId: ''
      },
      dialogSearch: {
        beginDate: new Date().getTime() - 6 * 24 * 60 * 60 * 1000,
        endDate: new Date().getTime(),
        boxNo: '',
        subNo: ''
      },
      selectedRunRow: '',
      selectedSpRow: '',
      waferTol: 0,
      isActive: 0,
      isActiveCs: 7,
      isActiveBoxNum: 0,
      totalLocation: 0,
      selectedTotal: 0,
      newSpBoxNo: '',
      measureName: '',
      userName: '',
      boxNum: '',
      siteType: '',
      siteName: '',
      siteStatus: '',
      pageSize: 12,
      pageSizeSp: 25,
      pageNum: 1,
      pageNumSp: 1,
      totalPage: 0,
      totalPageSp: 0,
      beginDate: '',
      endDate: '',
      alnMachineId: '',
      dateId: '',
      timeId: '',
      minutesId: '',
      alnCraftId: '',
      alnCraftName: '',
      alnTaskDateId: '',
      alnTaskTimeId: '',
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
      pickerOptionsStartSp: {
        disabledDate: (time) => {
          const endDateVal = this.dialogSearch.endDate
          if (endDateVal) {
            return time.getTime() > endDateVal
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      pickerOptionsEndSp: {
        disabledDate: (time) => {
          const beginDateVal = this.dialogSearch.beginDate
          if (beginDateVal) {
            return time.getTime() < beginDateVal || time.getTime() > Date.now()
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      productionOptions: [
        {
          id: 0,
          name: '生长中'
        },
        {
          id: 1,
          name: '生长完成'
        }
      ],
      caseOptions: [],
      siteSelectOptions: [
        {
          id: '',
          name: '全部'
        },
        {
          id: 0,
          name: '前段站点'
        },
        {
          id: 1,
          name: '后段站点'
        }
      ],
      siteStatusOptions: [
        {
          id: 0,
          name: '启用'
        },
        {
          id: 1,
          name: '停用'
        }
      ],
      userOptions: [],
      alniForm: {
        alNiId: '',
        pm: '',
        ldjt: '',
        fpsl: 0,
        ldrwmc: '',
        cdcc: '',
        cdcj: '',
        ks: '',
        fpr: '',
        ldgy: '',
        jsdy: '',
        bcxh: '',
        lbyl: '',
        tipOutEndDate: '',
        qpr: '',
        alniDate: '',
        alniTime: '',
        hours: '',
        minutes: '',
        param4: '',
        param5: '',
        param6: '',
        param7: '',
        remark: ''
      },
      getForm: {
        qpr: '',
        remark: '',
        alniDate: '',
        alniTime: '',
        hours: '',
        minutes: '',
        endTime: []
      },
      rules: {
        ldjt: [{ required: true, message: '请选择铝氮机台', trigger: 'blur' }],
        ks: [{ required: true, message: '请选择卡塞', trigger: 'blur' }],
        cdcc: [{ required: true, message: '请选择衬底尺寸', trigger: 'blur' }],
        lcbh: [{ required: true, message: '请选择炉次', trigger: 'blur' }],
        fpr: [{ required: true, message: '请选择放片人', trigger: 'blur' }],
        ldgy: [{ required: true, message: '请选择铝氮工艺', trigger: 'blur' }],
        jsdy: [{ required: true, message: '请输入溅射电压', trigger: 'blur' }],
        bcxh: [{ required: true, message: '请输入靶材消耗', trigger: 'blur' }],
        ldrwmc: [{ required: true, message: '请输入铝氮任务名称', trigger: 'blur' }],
        lbyl: [{ required: true, message: '请输入冷泵压力', trigger: 'blur' }],
        alniDate: [{ required: true, message: '请选择日期', trigger: 'blur' }],
        alniTime: [{ required: true, message: '请选择时间', trigger: 'blur' }],
        endTime: [{ type: 'array', required: true, message: '请选择结束时间', trigger: 'blur' }],
        qpr: [{ required: true, message: '请选择取片人', trigger: 'blur' }]
      },
      wafers: [
        { name: 1, isActive: false }, { name: 2, isActive: false }, { name: 3, isActive: false }, { name: 4, isActive: false }, { name: 5, isActive: false },
        { name: 6, isActive: false }, { name: 7, isActive: false }, { name: 8, isActive: false }, { name: 9, isActive: false }, { name: 10, isActive: false },
        { name: 11, isActive: false }, { name: 12, isActive: false }, { name: 13, isActive: false }, { name: 14, isActive: false }, { name: 15, isActive: false },
        { name: 16, isActive: false }, { name: 17, isActive: false }, { name: 18, isActive: false }, { name: 19, isActive: false }, { name: 20, isActive: false },
        { name: 21, isActive: false }, { name: 22, isActive: false }, { name: 23, isActive: false }, { name: 24, isActive: false }, { name: 25, isActive: false },
        { name: 26, isActive: false }, { name: 27, isActive: false }, { name: 28, isActive: false }, { name: 29, isActive: false }, { name: 30, isActive: false },
        { name: 31, isActive: false }, { name: 32, isActive: false }, { name: 33, isActive: false }, { name: 34, isActive: false }, { name: 35, isActive: false },
        { name: 36, isActive: false }, { name: 37, isActive: false }, { name: 38, isActive: false }, { name: 39, isActive: false }, { name: 40, isActive: false },
        { name: 41, isActive: false }, { name: 42, isActive: false }, { name: 43, isActive: false }, { name: 44, isActive: false }, { name: 45, isActive: false },
        { name: 46, isActive: false }, { name: 47, isActive: false }, { name: 48, isActive: false }, { name: 49, isActive: false }, { name: 50, isActive: false },
        { name: 51, isActive: false }, { name: 52, isActive: false }, { name: 53, isActive: false }, { name: 54, isActive: false }
      ],
      leftList: [],
      rightList: [],
      rightData: [],
      selectedRightData: [],
      activeTabIndex: 0,
      distributionNum: 0,
      selectedRightItem: '',
      selectedLeftItem: '',
      selectedList: [],
      pliesList: [],
      submitPliesList: [],
      waferList: [],
      importedBoxNo: [],
      runTime: '',
      currentTime: '',
      caseName: '',
      isSelectedEnd: false,
      showExceptionHandle: false,
      tipOutChanged: false,
      getChanged: false,
      plies1: [],
      plies2: [],
      plies3: [],
      plies4: [],
      plies5: [],
      plies6: [],
      plies7: [],
      plies8: [],
      plies9: [],
      plies10: [],
      hours: [],
      minutes: [],
      currentId: ''
    }
  },
  watch: {
    getForm: {
      handler(val, oldVal) {
        this.getChanged = true
      },
      deep: true
    },
    alniForm: {
      handler(val, oldVal) {
        this.tipOutChanged = true
      },
      deep: true
    }
  },
  mounted() {
    this.hours = []
    this.minutes = []
    for (let i = 0; i < 60; i++) {
      if (i < 10) {
        this.hours.push({
          name: '0' + i
        })
        this.minutes.push({
          name: '0' + i
        })
      } else if (i > 9 && i < 24) {
        this.hours.push({
          name: '' + i
        })
        this.minutes.push({
          name: '' + i
        })
      } else {
        this.minutes.push({
          name: '' + i
        })
      }
    }
    this.fetchData()
    this.showtime()
    this.findAlnMachineFun() // 铝氮机台
    this.fetchMeasureList() // 衬底尺寸
    // this.findUserList() // 放片人
    this.findMachineUserFun() // 全部人员
    this.findAlnCraftList() // 铝氮工艺
    this.$dragging.$on('dragged', (value) => {
      if (this.isAssigned) {
        return false
      }
      const draggedArr = this.rightData[value.draged]
      const dragToArr = this.rightData[value.to]
      this.rightData[value.to] = draggedArr
      this.rightData[value.draged] = dragToArr
      this.boxNumNavClick(value.to)
    })
  },
  computed: {
    getToken
  },
  methods: {
    handleDialogClose(done) {
      if (this.tipOutChanged || this.getChanged) {
        this.$confirm('数据已经发生改变，退出将不会保存，是否退出？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          done()
        })
      } else {
        done()
      }
    },
    // 生长完成
    takeSliceFun() {
      if (this.alniForm.jsdy === '' || this.alniForm.jsdy === null) {
        this.$message({
          type: 'error',
          message: '结束溅射电压不能为空!'
        })
        return false
      }
      if (this.alniForm.param4 === '' || this.alniForm.param4 === null) {
        this.$message({
          type: 'error',
          message: '工艺压力不能为空!'
        })
        return false
      }
      const params = {
        id: this.currentId, // run_id
        takeTime: this.getForm.alniDate + ' ' + this.getForm.hours + ':' + this.getForm.minutes, // 结束时间
        taker: getUserId(), // 取片人
        remark: this.getForm.remark, // 备注
        voltage: this.alniForm.jsdy, // 溅射电压
        material: this.alniForm.bcxh, // 靶材消耗
        pressure: this.alniForm.lbyl, // 冷泵压力
        param4: this.alniForm.param4,
        param5: this.alniForm.param5,
        param6: this.alniForm.param6,
        param7: this.alniForm.param7
      }
      takeSlice(params).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.addDialogVisible = false
          this.fetchData()
        }
      })
    },
    // wafer 查询
    findWaferFun(id) {
      const params = {
        id
      }
      findWafer(params).then(res => {
        this.waferList = res.data
      })
    },
    // pm周期查询
    findCycleFun(id) {
      const params = {
        id
      }
      findCycle(params).then(res => {
        console.log(res.data)
        this.alniForm.pm = res.data
      })
    },
    // 设置铝氮ID
    setAlNiId() {
      if (
        this.alnMachineId !== '' &&
        this.alnCraftId !== '' &&
        this.dateId !== ''
      ) {
        this.alniForm.alNiId = this.alnMachineId + this.dateId + this.alniForm.hours + this.alniForm.minutes + this.alnCraftId
      }
    },
    // 机台改变
    alnMachineChange(val) {
      this.findCycleFun(val)
      this.alnMachineList.map((item) => {
        if (item.id === val) {
          this.alnMachineId = item.code
        }
      })
      this.setAlNiId()
    },
    // 工艺改变
    alnCraftChange(val) {
      this.alnCraftList.map((item) => {
        if (item.id === val) {
          this.alnCraftId = item.code
          this.alnCraftName = item.name
        }
      })
      this.setAlNiId()
      this.setAlnTaskName()
    },
    setAlnTaskName() {
      if (
        this.alnCraftId !== '' &&
        this.alnTaskDateId !== ''
      ) {
        this.alniForm.ldrwmc = this.alnCraftName + '-' + this.alnTaskDateId + this.alniForm.hours + this.alniForm.minutes
      }
    },
    // 日期改变
    dateChange(val) {
      let month = ''
      if (parseInt(val.substr(5, 2)) > 9) {
        switch (parseInt(val.substr(5, 2))) {
          case 10 : month = 'A'
            break
          case 11 : month = 'B'
            break
          case 12 : month = 'C'
            break
        }
      } else {
        month = parseInt(val.substr(5, 2))
      }
      if (parseInt(val.substr(0, 4)) < 2020) {
        this.dateId = val.substr(3, 1) + month + val.substr(8, 2)
      } else {
        switch (parseInt(val.substr(2, 2))) {
          case 20 : this.dateId = 'A' + month + val.substr(8, 2)
            break
          case 21 : this.dateId = 'B' + month + val.substr(8, 2)
            break
          case 22 : this.dateId = 'C' + month + val.substr(8, 2)
            break
          case 23 : this.dateId = 'D' + month + val.substr(8, 2)
            break
          case 24 : this.dateId = 'E' + month + val.substr(8, 2)
            break
          case 25 : this.dateId = 'F' + month + val.substr(8, 2)
            break
          case 26 : this.dateId = 'G' + month + val.substr(8, 2)
            break
          case 27 : this.dateId = 'H' + month + val.substr(8, 2)
            break
          case 28 : this.dateId = 'I' + month + val.substr(8, 2)
            break
          case 29 : this.dateId = 'J' + month + val.substr(8, 2)
            break
          case 30 : this.dateId = 'K' + month + val.substr(8, 2)
            break
          case 31 : this.dateId = 'L' + month + val.substr(8, 2)
            break
          case 32 : this.dateId = 'M' + month + val.substr(8, 2)
            break
          case 33 : this.dateId = 'N' + month + val.substr(8, 2)
            break
          case 34 : this.dateId = 'O' + month + val.substr(8, 2)
            break
          case 35 : this.dateId = 'P' + month + val.substr(8, 2)
            break
          case 36 : this.dateId = 'Q' + month + val.substr(8, 2)
            break
          case 37 : this.dateId = 'R' + month + val.substr(8, 2)
            break
          case 38 : this.dateId = 'S' + month + val.substr(8, 2)
            break
          case 39 : this.dateId = 'T' + month + val.substr(8, 2)
            break
          case 40 : this.dateId = 'U' + month + val.substr(8, 2)
            break
          case 41 : this.dateId = 'V' + month + val.substr(8, 2)
            break
          case 42 : this.dateId = 'W' + month + val.substr(8, 2)
            break
          case 43 : this.dateId = 'X' + month + val.substr(8, 2)
            break
          case 44 : this.dateId = 'Y' + month + val.substr(8, 2)
            break
          case 45 : this.dateId = 'Z' + month + val.substr(8, 2)
            break
        }
      }
      if (parseInt(val.substr(0, 4)) > 2045) {
        this.dateId = val.substr(3, 1) + month + val.substr(8, 2)
      }
      this.alnTaskDateId = val.substr(2, 2) + val.substr(5, 2) + val.substr(8, 2)
      this.setAlNiId()
      this.setAlnTaskName()
    },
    // 时间改变
    timeChange() {
      this.setAlNiId()
      this.setAlnTaskName()
    },
    // 卡塞
    findStopperList(measureId) {
      findStopper({ measureId }).then(res => {
        this.caseOptions = res.data
        this.ksDisabled = false
      })
    },
    // 查询铝氮工艺
    findAlnCraftList() {
      findAlnCraft({}).then(res => {
        this.alnCraftList = res.data
      })
    },
    // 放片人
    findUserList() {
      findUser({}).then(res => {
        this.userList = res.data
      })
    },
    // 人员
    findMachineUserFun() {
      findMachineUser({ pageSize: 1000, pageNum: 1 }).then(res => {
        this.userList = res.data.list
      })
    },
    // 查询衬底尺寸
    fetchMeasureList() {
      measureList({}).then(res => {
        this.measureList = res.data
      })
    },
    // 铝氮机台
    findAlnMachineFun() {
      findAlnMachine({}).then(res => {
        this.alnMachineList = res.data
      })
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    tableChangeFun(val) {
      this.multipleSelection = val // 返回的是选中的列的数组集合
      console.log(this.multipleSelection)
    },
    dialogSearchFun() {
      this.pageNumSp = 1
      this.viewSanPian()
    },
    clearDialogSearch() {
      this.dialogSearch.boxNo = ''
      this.dialogSearch.subNo = ''
      this.dialogSearch.beginDate = new Date().getTime() - 7 * 24 * 60 * 60 * 1000
      this.dialogSearch.endDate = new Date().getTime()
    },
    handleViewSanPian() {
      this.pageNumSp = 1
      this.pageSizeSp = 25
      this.viewSanPian()
    },
    // 查看散片
    viewSanPian() {
      this.sanPianDialogVisible = true
      const params = {
        boxNo: this.dialogSearch.boxNo,
        laserMark: this.dialogSearch.subNo,
        startTime: this.dialogSearch.beginDate === '' ? '' : this.formatDate(this.dialogSearch.beginDate),
        endTime: this.dialogSearch.endDate === '' ? '' : this.formatDate(this.dialogSearch.endDate),
        pageNum: this.pageNumSp,
        pageSize: this.pageSizeSp
      }
      findScattered(params).then(res => {
        this.scatteredList = res.data.list
        this.$refs.multipleTable.setCurrentRow(this.scatteredList[0])
        this.selectedSpRow = this.scatteredList[0]
        this.totalPageSp = res.data.total
        var chooseArr = []
        res.data.list.map((item) => {
          if (item.choose === 1) {
            chooseArr.push(item)
          }
        })
        if (chooseArr.length !== 0) {
          setTimeout(() => {
            this.toggleSelection(chooseArr)
          }, 300)
        }
      })
    },
    // 生成散片盒号
    createSpBoxNum() {
      findNewBoxNo({}).then(res => {
        this.newSpBoxNo = res.data
        this.createSpBoxNumVisible = true
      })
    },
    // 打印散片盒号
    submitAndPrint() {
      var arr = []
      this.scatteredList.map((item) => {
        if (this.multipleSelection.includes(item)) {
          arr.push(item.id + '-' + 1) // 选中
        } else {
          arr.push(item.id + '-' + 0)
        }
      })
      chooseSclie({ ids: arr.join(',') }).then(res => {
        // this.multipleSelection.map((item) => {
        //   arr.push(item.id)
        // })
        allotBox({ boxNo: this.newSpBoxNo }).then(res => {
          this.createSpBoxNumVisible = false
          const contents = [
            [
              {
                value: this.newSpBoxNo,
                key: 'spBoxNo'
              },
              {
                value: res.data,
                key: 'total'
              }
            ]
          ]
          const params = {
            module: 'wyAlnSp',
            contents
          }
          printLabel(params).then(res => {
            this.$message({
              type: 'success',
              message: '标签正在打印中，请稍候！'
            })
          })
          this.viewSanPian()
        })
      })
    },
    selectable(row, index) {
      if (row.boxNo === null) {
        return true
      } else {
        return false
      }
    },
    userChange(id) {
      this.userList.map(item => {
        if (item.id === id) {
          this.userName = item.name
        }
      })
    },
    spRowClick(row) {
      this.selectedSpRow = row
    },
    // 补打散片盒号
    printSpBoxNo() {
      if (this.selectedSpRow.boxNo === null) {
        this.$message({
          type: 'error',
          message: '当前数据无散片盒号信息！'
        })
        return false
      }
      const contents = [
        [
          {
            value: this.selectedSpRow.boxNo,
            key: 'spBoxNo'
          },
          {
            value: this.selectedSpRow.count,
            key: 'total'
          }
        ]
      ]
      const params = {
        module: 'wyAlnSp',
        contents
      }
      printLabel(params).then(res => {
        this.$message({
          type: 'success',
          message: '标签正在打印中，请稍候！'
        })
      })
    },
    // 打印条码
    printBarcode(row) {
      const contents = [
        [
          {
            value: row.createdBoxNum,
            key: 'alNiBoxNo'
          },
          {
            value: this.alnCraftName,
            key: 'programName'
          },
          {
            value: this.userName,
            key: 'creator'
          },
          {
            value: 25,
            key: 'num'
          },
          {
            value: this.alniForm.cdcj,
            key: 'supplier'
          },
          {
            value: this.measureName,
            key: 'measure'
          }
        ]
      ]
      const params = {
        module: 'wyAln',
        contents
      }
      console.log(params)
      printLabel(params).then(res => {
        this.$message({
          type: 'success',
          message: '标签正在打印中，请稍候！'
        })
      })
    },
    // 退出
    dropOut() {
      console.log(123)
    },
    // 扫码导入
    sweepCodeImport() {
      if (this.rightData.length === 7) {
        this.$message({
          type: 'error',
          message: '超出盒数限制!'
        })
        this.boxNum = ''
        return false
      }
      if (this.importedBoxNo.includes(this.boxNum)) {
        this.$message({
          type: 'error',
          message: '当前盒号已存在!'
        })
        this.boxNum = ''
        return false
      }
      const params = {
        boxNo: this.boxNum,
        measureId: this.measure
      }
      findSubstrate(params).then(res => {
        if (this.alniForm.cdcj === '') {
          this.alniForm.cdcj = res.data[0].supplier
        }
        this.importedBoxNo.push(this.boxNum)
        this.rightData.push(res.data)
        var selectedIds = []
        res.data.map(item => {
          selectedIds.push(item.id)
        })
        this.selectedRightData.push(selectedIds)
        this.rightWaferTotal = 0
        this.rightData.map(item => {
          this.rightWaferTotal += item.length
        })
        this.isActiveBoxNum = this.rightData.length
        this.boxNumNavClick(this.rightData.length - 1)
        this.boxNum = ''
      }).catch(() => {
        this.boxNum = ''
      })
    },
    // 选择卡塞
    ksChange() {
      let pliesList = []
      this.rightData = []
      this.rightList = []
      this.importedBoxNo = []
      this.boxNum = ''
      this.caseOptions.map((item) => {
        if (item.id === this.alniForm.ks) {
          this.caseName = item.name
          pliesList = [...item.detailList]
          this.submitPliesList = [...item.detailList]
          this.pliesList = [...item.detailList].reverse()
        }
      })
      this.plies1 = []
      this.plies2 = []
      this.plies3 = []
      this.plies4 = []
      this.plies5 = []
      this.plies6 = []
      this.plies7 = []
      this.plies8 = []
      this.plies9 = []
      this.plies10 = []
      this.totalLocation = 0
      pliesList.forEach((item, index) => {
        // 计算非禁用的wafer位置数
        if (item.status === 0) {
          this.totalLocation += item.sliceNo
        }
        switch (index) {
          case 0 : for (var a = 0; a < item.sliceNo; a++) { this.plies1.push({ laserMark: '', boxNo: '', sequence: '', status: item.status, id: '' }) }
            break
          case 1 : for (var b = 0; b < item.sliceNo; b++) { this.plies2.push({ laserMark: '', boxNo: '', sequence: '', status: item.status, id: '' }) }
            break
          case 2 : for (var c = 0; c < item.sliceNo; c++) { this.plies3.push({ laserMark: '', boxNo: '', sequence: '', status: item.status, id: '' }) }
            break
          case 3 : for (var d = 0; d < item.sliceNo; d++) { this.plies4.push({ laserMark: '', boxNo: '', sequence: '', status: item.status, id: '' }) }
            break
          case 4 : for (var e = 0; e < item.sliceNo; e++) { this.plies5.push({ laserMark: '', boxNo: '', sequence: '', status: item.status, id: '' }) }
            break
          case 5 : for (var f = 0; f < item.sliceNo; f++) { this.plies6.push({ laserMark: '', boxNo: '', sequence: '', status: item.status, id: '' }) }
            break
          case 6 : for (var g = 0; g < item.sliceNo; g++) { this.plies7.push({ laserMark: '', boxNo: '', sequence: '', status: item.status, id: '' }) }
            break
          case 7 : for (var h = 0; h < item.sliceNo; h++) { this.plies8.push({ laserMark: '', boxNo: '', sequence: '', status: item.status, id: '' }) }
            break
          case 8 : for (var i = 0; i < item.sliceNo; i++) { this.plies9.push({ laserMark: '', boxNo: '', sequence: '', status: item.status, id: '' }) }
            break
          case 9 : for (var j = 0; j < item.sliceNo; j++) { this.plies10.push({ laserMark: '', boxNo: '', sequence: '', status: item.status, id: '' }) }
            break
        }
      })
      // 设置左侧第一个位 active 状态
      this.totals = 0
      this.isActiveCs = this.pliesList.length
      this.pliesList.map(item => {
        if (item.status === 0) {
          this.totals += item.sliceNo
        }
      })
      console.log(this.totals)
      // 设置初始化左侧表格数据
      switch (this.isActiveCs) {
        case 1 : this.leftList = this.plies1
          break
        case 2 : this.leftList = this.plies2
          break
        case 3 : this.leftList = this.plies3
          break
        case 4 : this.leftList = this.plies4
          break
        case 5 : this.leftList = this.plies5
          break
        case 6 : this.leftList = this.plies6
          break
        case 7 : this.leftList = this.plies7
          break
        case 8 : this.leftList = this.plies8
          break
        case 9 : this.leftList = this.plies9
          break
        case 10 : this.leftList = this.plies10
          break
      }
      this.selectedRightData = []
      this.rightWaferTotal = 0
      this.selectedTotal = 0
      this.boxNumNavClick(-1)
    },
    // 导入完成
    importsClosure() {
      this.innerVisible = false
      this.activeTabIndex = 1
    },
    timeStop(val) {
      if (val) {
        this.currentTime = this.getCurrentTime()
      }
    },
    // 选择laserMark
    toLeft() {
      if (!this.isTipOut) {
        return
      }
      // if (!this.selectedRightItem) {
      //   this.$message({
      //     type: 'error',
      //     message: '请选择衬底信息!'
      //   })
      // } else {
      //   if (this.selectedRightItem.laserMark === '') {
      //     this.$message({
      //       type: 'error',
      //       message: '请选择衬底信息!'
      //     })
      //   } else {
      //     // 将一选项填入不为空的某行
      //     if (this.leftList[0].status === 1) {
      //       this.$message({
      //         type: 'error',
      //         message: '该层卡塞未启用!'
      //       })
      //     } else {
      //       if (this.selectedTotal < this.totalLocation) {
      //         // 复制一份已选项
      //         const copySelectedRightItem = JSON.parse(JSON.stringify(this.selectedRightItem))
      //         this.selectedList.push(copySelectedRightItem) // 保存已选入的数据
      //         console.log(this.selectedList)
      //         this.selectedTotal += 1
      //         this.fillInInOrder(copySelectedRightItem)
      //       } else {
      //         this.$message({
      //           type: 'error',
      //           message: '大盘中无空位，请重试!'
      //         })
      //         return false
      //       }
      //     }
      //   }
      // }
      // ---------------按复选框选中计算分配------------
      const hasLaseMarkSelectedRow = []
      this.selectedRow.map(item => {
        if (item.laserMark !== '') {
          hasLaseMarkSelectedRow.push(item)
        }
      })
      hasLaseMarkSelectedRow.forEach((item, index) => {
        // 必须限制数量不然左侧全部选空了
        if (this.totals === this.selectedTotal) {
          this.$message({
            type: 'success',
            message: '已分配完成!'
          })
          return false
        }
        if (this.selectedTotal < this.totalLocation) {
          const copySelectedRightItem = JSON.parse(JSON.stringify(item))
          if (this.leftList[0].status === 1) { // 如果为禁用则跳至下一层
            this.csNavClick(this.isActiveCs - 1)
          }
          this.selectedList.push(copySelectedRightItem) // 保存已选入的数据
          item.boxNo = ''
          item.sequence = ''
          item.laserMark = ''
          this.selectedTotal += 1
          // 将已经选项填入不为空的某行
          this.fillInInOrder(copySelectedRightItem)
          setTimeout(() => {
            this.$refs.substarateTable.clearSelection()
          }, 200)
        } else {
          return false
        }
      })
    },
    // 将已选项填入不为空的某行
    fillInInOrder(selectedItem) {
      if (this.leftList[0].status === 1) {
        this.$message({
          type: 'error',
          message: '该层卡塞未启用!'
        })
        this.csNavClick(this.isActiveCs - 1)
        if (this.leftList[0].status === 1) {
          this.$message({
            type: 'error',
            message: '该层卡塞未启用!'
          })
        } else {
          this.csNavClick(this.isActiveCs - 1)
          this.fillInInOrder(selectedItem)
        }
      } else {
        let emptyRow = 0
        for (const item of this.leftList) {
          if (item.laserMark === '') {
            item.laserMark = selectedItem.laserMark
            item.boxNo = selectedItem.boxNo
            item.sequence = selectedItem.sequence
            item.id = selectedItem.id
            this.isAssigned = true
            this.$refs.substarateTable.setCurrentRow() // 清除选中行
            // 清空已选项的数据
            this.rightList.forEach((item, index) => {
              if (item.laserMark === selectedItem.laserMark) {
                item.boxNo = ''
                item.sequence = ''
                item.laserMark = ''
              }
            })
            return
          } else {
            emptyRow++
          }
        }
        // 如果第一层分配完成跳至下一次分配
        if (emptyRow === this.leftList.length) {
          // 如果不是最后
          if (this.isActiveCs === 1) {
            return false
          } else {
            this.csNavClick(this.isActiveCs - 1)
            this.fillInInOrder(selectedItem)
          }
        }
      }
    },
    selectionChange(data) {
      const ids = []
      data.map(item => {
        ids.push(item.id)
      })
      console.log(this.isActiveBoxNum)
      this.selectedRightData[this.isActiveBoxNum] = ids
      // this.selectedNum = data.length
      this.selectedRow = data
      this.selectedRow = this.selectedRow.sort(this.sortData)
    },
    sortData(a, b) {
      return b.sequence - a.sequence
    },
    // 自动分配
    distribution() {
      if (this.totals === this.selectedTotal) {
        this.$message({
          type: 'success',
          message: '已分配完成!'
        })
        return false
      }
      /* 跳至右侧第一页开始分配 */
      if (this.isActiveBoxNum !== 0) {
        this.boxNumNavClick(0)
      }
      // 先跳到左侧首页从首页开始分配
      this.csNavClick(this.pliesList.length)
      this.selectedList = []
      this.distributionNum = -1
      // 循环右侧表格开始逐一分配
      setTimeout(() => {
        this.distributionFun()
      }, 100)
      setTimeout(() => {
        this.$refs.substarateTable.clearSelection()
      }, 800)
    },
    // 循环右侧表格开始逐一分配
    distributionFun() {
      const hasLaseMarkSelectedRow = []
      this.selectedRow.map(item => {
        if (item.laserMark !== '') {
          hasLaseMarkSelectedRow.push(item)
        }
      })
      // 如果所选项为空且不是末盒则跳至下一盒分配
      if (hasLaseMarkSelectedRow.length === 0 && this.isActiveBoxNum + 1 !== this.rightData.length) {
        this.boxNumNavClick(this.isActiveBoxNum + 1)
        setTimeout(() => {
          this.distributionFun()
        }, 100)
      }
      hasLaseMarkSelectedRow.forEach((item, index) => {
        // 必须限制数量不然左侧全部选空了
        if (this.totals === this.selectedTotal) {
          this.$message({
            type: 'success',
            message: '已分配完成!'
          })
          return false
        }
        this.distributionNum++
        if (this.distributionNum < this.totalLocation) {
          const copySelectedRightItem = JSON.parse(JSON.stringify(item))
          if (this.leftList[0].status === 1) { // 如果为禁用则跳至下一层
            this.csNavClick(this.isActiveCs - 1)
          }
          this.selectedList.push(copySelectedRightItem) // 保存已选入的数据
          item.boxNo = ''
          item.sequence = ''
          item.laserMark = ''
          this.selectedTotal += 1
          // 将已经选项填入不为空的某行
          this.fillInInOrder(copySelectedRightItem)
        } else {
          return false
        }
        // 如果最后一片已经分配跳到下一盒开始分配
        if (index === hasLaseMarkSelectedRow.length - 1) {
          // 清除已经分配完的勾选状态
          this.selectedRightData[this.isActiveBoxNum] = []
          this.boxNumNavClick(this.isActiveBoxNum)
          // 如果不是最后一盒就继续分配
          if (this.isActiveBoxNum + 1 !== this.rightData.length) {
            this.boxNumNavClick(this.isActiveBoxNum + 1)
            setTimeout(() => {
              this.distributionFun()
            }, 100)
          }
        }
      })
    },
    toRight() {
      if (!this.isTipOut) {
        return
      }
      if (this.selectedLeftItem === '') {
        this.$message({
          type: 'error',
          message: '请选择要解绑的盘位信息!'
        })
      } else {
        if (this.selectedLeftItem.laserMark === '') {
          this.$message({
            type: 'error',
            message: '请先选择衬底片!'
          })
        } else {
          this.deleteItem(this.selectedLeftItem)
          this.$refs.waferTable.setCurrentRow()
          this.selectedLeftItem = ''
        }
      }
    },
    // 上移
    handleUp(index) {
      if (!this.isTipOut) {
        return
      }
      if (index > 0) {
        const upDate = this.leftList[index - 1]
        this.leftList.splice(index - 1, 1)
        this.leftList.splice(index, 0, upDate)
      } else {
        this.$message({
          type: 'error',
          message: '已经是第一条，不可上移!'
        })
      }
    },
    // 下移
    handleDown(index) {
      if (!this.isTipOut) {
        return
      }
      if ((index + 1) === this.leftList.length) {
        this.$message({
          type: 'error',
          message: '已经是最后一条，不可下移!'
        })
      } else {
        const downDate = this.leftList[index + 1]
        this.leftList.splice(index + 1, 1)
        this.leftList.splice(index, 0, downDate)
      }
    },
    deleteItem(row) {
      if (!this.isTipOut) {
        return
      }
      if (row.laserMark === '') {
        this.$message({
          type: 'error',
          message: '请先选择衬底片!'
        })
      } else {
        this.selectedTotal -= 1
        this.rightData.map((rightList) => {
          rightList.map((item) => {
            if (item.id === row.id) {
              item.boxNo = row.boxNo
              item.sequence = row.sequence
              item.laserMark = row.laserMark
              row.boxNo = ''
              row.sequence = ''
              row.laserMark = ''
            }
          })
        })
      }
    },
    showtime() {
      this.runTime = this.getCurrentTime()
      setTimeout(this.showtime, 1000)
    },
    getCurrentTime() {
      var date = new Date()
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var day = date.getDate()
      var hours = date.getHours()
      var minutes = date.getMinutes()
      var seconds = date.getSeconds()
      if (seconds < 10) {
        seconds = '0' + seconds
      }
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      if (hours < 10) {
        hours = '0' + hours
      }
      return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
    },
    subStrateCurrentChange(row) {
      this.selectedRightItem = row
    },
    waferCurrentChange(row) {
      this.selectedLeftItem = row
    },
    waferClick(data) {
      data.isActive = !data.isActive
    },
    editSubstrateInfo() {
      this.innerVisible = true
    },
    // 异常处理
    exceptionHandling() {
      this.showExceptionHandle = true
    },
    // 生成盒号
    createBoxNum() {
      if (this.alniForm.alNiId === '') {
        this.$message({
          type: 'error',
          message: '请先生成铝氮ID!'
        })
        return false
      }
      if (this.selectedTotal === 0) {
        this.$message({
          type: 'error',
          message: '请选择衬底信息!'
        })
      } else {
        this.boxList = []
        const num = Math.ceil(this.selectedTotal / 25)
        for (var i = 0; i < num; i++) {
          this.boxList.push({
            createdBoxNum: this.alniForm.alNiId + '-' + (i + 1)
          })
        }
        this.createBoxNumVisible = true
      }
    },
    // 重置
    clearSearch() {
      this.searchKeys.status = ''
      this.searchKeys.alnId = ''
      this.searchKeys.creator = ''
      this.searchKeys.machineId = ''
      this.beginDate = ''
      this.endDate = ''
      this.handleSearch()
    },
    // 单击Run信息
    rowClick(row) {
      this.waferTol = row.substrateNum
      this.selectedRunRow = row
    },
    // 双击Run信息
    cellDblclick(row, column, cell, event) {
      console.log(row)
      this.currentId = row.id
      this.alniForm.alNiId = row.alnId
      this.alniForm.ldjt = row.machineId
      this.alniForm.pm = row.cycle
      this.alniForm.ldrwmc = row.alnTaskId
      this.alniForm.cdcc = row.measureId
      this.measureName = row.measure
      this.findStopperList(row.measureId) // 卡塞
      this.alniForm.ks = row.stopperId
      this.alniForm.cdcj = row.supplier
      this.alniForm.fpr = row.creator
      this.userName = row.creator
      this.alniForm.ldgy = row.alnCraftId
      this.alnCraftName = row.craftName
      this.alniForm.jsdy = row.voltage
      this.alniForm.bcxh = row.material
      this.alniForm.lbyl = row.pressure
      this.alniForm.param4 = row.param4
      this.alniForm.param5 = row.param5
      this.alniForm.param6 = row.param6
      this.alniForm.param7 = row.param7
      this.alniForm.alniDate = row.createTime.substr(0, 10)
      this.alniForm.alniTime = row.createTime.substr(11, 5)
      this.alniForm.hours = row.createTime.substr(11, 2)
      this.alniForm.minutes = row.createTime.substr(14, 2)
      this.getForm.qpr = ''
      this.getForm.remark = ''
      this.getForm.alniDate = this.getFormatDate()
      this.getForm.alniTime = this.getFormatTime()
      this.getForm.hours = this.getFormatHours()
      this.getForm.minutes = this.getFormaMinutes()
      this.addDialogVisible = true
      this.isTipOut = false
      this.activeTabIndex = 0
      setTimeout(() => {
        this.ksChange()
      }, 200)
      setTimeout(() => {
        this.selectedTotal = row.substrateNum
      }, 300)
      setTimeout(() => {
        this.setSubstrate(row.id)
      }, 500)
      if (row.status === 1) {
        this.isFinish = true
        this.currentTime = row.takeTime
        this.getForm.alniDate = row.takeTime.substr(0, 10)
        this.getForm.alniTime = row.takeTime.substr(11, 5)
        this.getForm.hours = row.takeTime.substr(11, 2)
        this.getForm.minutes = row.takeTime.substr(14, 2)
        this.getForm.qpr = row.taker
        this.getForm.remark = row.remark
      } else {
        this.isFinish = false
      }
      setTimeout(() => {
        this.tipOutChanged = false
        this.getChanged = false
      }, 500)
    },
    jsdyChange() {
      if (this.alniForm.jsdy.length > 5) {
        this.alniForm.jsdy = this.alniForm.jsdy.substr(0, 5)
      }
    },
    param4Change() {
      if (this.alniForm.param4.length > 10) {
        this.alniForm.param4 = this.alniForm.param4.substr(0, 10)
      }
    },
    lbylChange() {
      if (this.alniForm.lbyl.length > 10) {
        this.alniForm.lbyl = this.alniForm.lbyl.substr(0, 10)
      }
    },
    bcxhChange() {
      if (this.alniForm.bcxh.length > 5) {
        this.alniForm.bcxh = this.alniForm.bcxh.substr(0, 5)
      }
    },
    param5Change() {
      if (this.alniForm.param5.length > 10) {
        this.alniForm.param5 = this.alniForm.param5.substr(0, 10)
      }
    },
    param6Change() {
      if (this.alniForm.param6.length > 10) {
        this.alniForm.param6 = this.alniForm.param6.substr(0, 10)
      }
    },
    param7Change() {
      if (this.alniForm.param7.length > 7) {
        this.alniForm.param7 = this.alniForm.param7.substr(0, 7)
      }
    },
    setSubstrate(id) {
      const params = {
        id
      }
      findWaferIn(params).then(res => {
        this.plies1 = []
        this.plies2 = []
        this.plies3 = []
        this.plies4 = []
        this.plies5 = []
        this.plies6 = []
        this.plies7 = []
        this.plies8 = []
        this.plies9 = []
        this.plies10 = []
        res.data.map((item) => {
          switch (item.layer) {
            case 1 : this.plies1.push(item)
              break
            case 2 : this.plies2.push(item)
              break
            case 3 : this.plies3.push(item)
              break
            case 4 : this.plies4.push(item)
              break
            case 5 : this.plies5.push(item)
              break
            case 6 : this.plies6.push(item)
              break
            case 7 : this.plies7.push(item)
              break
            case 8 : this.plies8.push(item)
              break
            case 9 : this.plies9.push(item)
              break
            case 10 : this.plies10.push(item)
              break
          }
        })
        // 设置左侧第一个位 active 状态
        this.isActiveCs = this.pliesList.length
        // 设置初始化左侧表格数据
        switch (this.isActiveCs) {
          case 1 : this.leftList = this.plies1
            break
          case 2 : this.leftList = this.plies2
            break
          case 3 : this.leftList = this.plies3
            break
          case 4 : this.leftList = this.plies4
            break
          case 5 : this.leftList = this.plies5
            break
          case 6 : this.leftList = this.plies6
            break
          case 7 : this.leftList = this.plies7
            break
          case 8 : this.leftList = this.plies8
            break
          case 9 : this.leftList = this.plies9
            break
          case 10 : this.leftList = this.plies10
            break
        }
      })
    },
    // Run信息/Wafer信息切换
    navClick(index) {
      if (index === 1 && this.list.length !== 0) {
        this.findWaferFun(this.selectedRunRow.id)
      }
      this.isActive = index
    },
    // 衬底尺寸改变
    measureChange(measureId) {
      this.measureList.map(item => {
        if (item.id === measureId) {
          this.measureName = item.name
        }
      })
      console.log('衬底尺寸改变')
      this.measure = measureId
      this.alniForm.ks = ''
      this.findStopperList(measureId) // 卡塞
    },
    // 衬底层数切换
    csNavClick(index) {
      this.isActiveCs = index
      switch (index) {
        case 1 : this.leftList = this.plies1
          break
        case 2 : this.leftList = this.plies2
          break
        case 3 : this.leftList = this.plies3
          break
        case 4 : this.leftList = this.plies4
          break
        case 5 : this.leftList = this.plies5
          break
        case 6 : this.leftList = this.plies6
          break
        case 7 : this.leftList = this.plies7
          break
        case 8 : this.leftList = this.plies8
          break
        case 9 : this.leftList = this.plies9
          break
        case 10 : this.leftList = this.plies10
          break
      }
    },
    // 盒号切换
    boxNumNavClick(index, flag) {
      if (index === this.isActiveBoxNum && flag === undefined) {
        return false
      }
      console.log(this.selectedRightData)
      this.isActiveBoxNum = index
      this.rightList = this.rightData[index]
      console.log(this.rightData)
      console.log(this.rightList)
      const rightSelectionId = this.selectedRightData[index]
      const selections = []
      this.rightList.map(item => {
        if (rightSelectionId.indexOf(item.id) !== -1) {
          selections.push(item)
        }
      })
      setTimeout(() => {
        selections.map(item => {
          this.$refs.substarateTable.toggleRowSelection(item)
        })
      }, 50)
    },
    // 循环盒号
    boxNumNavFor(index) {
      this.rightList = this.rightData[index]
      this.rightList.map((item) => {
        if (item.boxNo !== '') {
          this.scatteredIdArr.push(item.id)
        }
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
      this.dateChange(currentDate)
      return currentDate
    },
    getFormatHours() {
      var date = new Date()
      var hours = date.getHours()
      if (hours >= 0 && hours <= 9) {
        hours = '0' + hours
      } else {
        hours = '' + hours
      }
      return hours
    },
    getFormaMinutes() {
      var date = new Date()
      var minutes = date.getMinutes()
      if (minutes >= 0 && minutes <= 9) {
        minutes = '0' + minutes
      } else {
        minutes = '' + minutes
      }
      return minutes
    },
    getFormatTime() {
      var date = new Date()
      var hours = date.getHours()
      var minutes = date.getMinutes()
      var secondes = date.getSeconds()
      if (hours >= 0 && hours <= 9) {
        hours = '0' + hours
      }
      if (minutes >= 0 && minutes <= 9) {
        minutes = '0' + minutes
      }
      if (secondes >= 0 && secondes <= 9) {
        secondes = '0' + secondes
      }
      var currentDate = hours + ':' + minutes
      this.timeChange(currentDate)
      return currentDate
    },
    // 衬底投片
    tipOut() {
      this.isFinish = false
      this.userName = getToken()
      this.alniForm.alNiId = ''
      this.alniForm.ldjt = ''
      this.alniForm.pm = ''
      this.alniForm.ldrwmc = ''
      this.alniForm.cdcc = ''
      this.alniForm.ks = ''
      this.alniForm.cdcj = ''
      this.alniForm.fpr = ''
      this.alniForm.ldgy = ''
      this.alniForm.alniDate = this.getFormatDate()
      this.alniForm.alniTime = this.getFormatTime()
      this.alniForm.hours = this.getFormatHours()
      this.alniForm.minutes = this.getFormaMinutes()
      this.selectedTotal = 0
      this.alniForm.jsdy = ''
      this.alniForm.bcxh = ''
      this.alniForm.lbyl = ''
      this.alniForm.param4 = ''
      this.alniForm.param4 = ''
      this.alniForm.param4 = ''
      this.alniForm.param4 = ''
      this.getForm.qpr = ''
      this.getForm.alniDate = ''
      this.getForm.alniTime = ''
      this.getForm.hours = ''
      this.getForm.minutes = ''
      this.getForm.remark = ''
      this.getForm.endTime = []
      this.addDialogVisible = true
      this.activeTabIndex = 0
      this.isTipOut = true
      setTimeout(() => {
        this.tipOutChanged = false
        this.getChanged = false
      }, 500)
    },
    // 衬底投片 基本信息/Wafer信息
    tabClick(index) {
      if (index === 1) {
        if (this.alniForm.ks === '') {
          this.$message({
            type: 'error',
            message: '请选择卡塞信息!'
          })
        } else {
          this.$refs.importImput.focus()
          this.activeTabIndex = index
        }
      } else {
        this.activeTabIndex = index
      }
    },
    // 删除
    deleteTipOut() {
      if (this.selectedRunRow === '') {
        this.$message({
          type: 'error',
          message: '请先选择要删除的Run信息!'
        })
        return false
      } else {
        if (this.selectedRunRow.status === 1) {
          this.$message({
            type: 'error',
            message: '该Run信息为生长完成，不允许删除!'
          })
        } else {
          this.$confirm('此操作将永久删除该Run信息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            alNiDelete({ id: this.selectedRunRow.id }).then(res => {
              if (this.list.length === 1 && this.pageNum !== 1) {
                this.pageNum -= 1
              }
              this.fetchData()
            })
          })
        }
      }
    },
    // 删除当前盒
    deleteCurrentBox() {
      for (const item of this.rightList) {
        if (item.boxNo === '') {
          this.$message({
            type: 'error',
            message: '该盒已分配，不可删除!'
          })
          return false
        }
      }
      this.$confirm('是否确认删除当前盒信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.importedBoxNo.splice(this.isActiveBoxNum, 1)
        this.rightData.splice(this.isActiveBoxNum, 1)
        this.selectedRightData.splice(this.isActiveBoxNum, 1)
        console.log(this.selectedRightData, 'selectedRightData')
        console.log(this.rightData, 'rightData')
        if (this.isActiveBoxNum !== 0) {
          this.boxNumNavClick(this.isActiveBoxNum - 1)
        }
        if (this.isActiveBoxNum === this.rightData.length && this.isActiveBoxNum === 0) {
          this.rightList = []
          this.selectedRightData = []
          this.rightWaferTotal = 0
          this.boxNumNavClick(this.isActiveBoxNum - 1)
        }
        if (this.isActiveBoxNum === 0 && this.rightData.length > 1) {
          this.rightList = this.rightData[0]
          this.boxNumNavClick(this.isActiveBoxNum + 1)
          setTimeout(() => {
            this.boxNumNavClick(0)
          }, 100)
        }
        if (this.isActiveBoxNum === 0 && this.rightData.length === 1) {
          this.rightList = this.rightData[0]
          this.boxNumNavClick(0, 'flag')
        }
        this.rightWaferTotal = 0
        this.rightData.map(item => {
          this.rightWaferTotal += item.length
        })
      })
    },
    rowStyle({ row }) {
      if (row.status === 1) {
        return 'background: #eee'
      } else {
        return ''
      }
    },
    // 每页数量改变
    sizeChange(pageSize) {
      this.pageSize = pageSize
      this.fetchData()
    },
    // 散片每页数量改变
    sizeChangeSp(pageSizeSp) {
      this.pageSizeSp = pageSizeSp
      // 保存已选项
      this.saveSelectedStatus()
    },
    handleCloseSp() {
      removeSclie({ ids: -1 }).then(res => {
      })
    },
    // 保存已选项
    saveSelectedStatus() {
      var arr = []
      if (this.multipleSelection.length === 0) {
        this.viewSanPian()
        return false
      }
      this.scatteredList.map((item) => {
        if (this.multipleSelection.includes(item)) {
          arr.push(item.id + '-' + 1) // 选中
        } else {
          arr.push(item.id + '-' + 0)
        }
      })
      chooseSclie({ ids: arr.join(',') }).then(res => {
        this.viewSanPian()
      })
    },
    // 当前页数改变
    currentChange(pageNum) {
      this.pageNum = pageNum
      this.fetchData()
    },
    // 散片当前页数改变
    currentChangeSp(pageNumSp) {
      this.pageNumSp = pageNumSp
      // 保存已选项
      this.saveSelectedStatus()
    },
    handleSearch() {
      this.pageNum = 1
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
    // 查询
    fetchData() {
      this.listLoading = true
      const requestParams = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        alnId: this.searchKeys.alnId,
        status: this.searchKeys.status,
        machineId: this.searchKeys.machineId,
        creator: this.searchKeys.creator,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate)
      }
      alNiList(requestParams).then(res => {
        this.list = res.data.list
        this.waferTol = this.list.length === 0 ? '0' : this.list[0].substrateNum
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
        if (res.data.list.length !== 0) {
          this.$refs.runTable.setCurrentRow(this.list[0])
          this.selectedRunRow = this.list[0]
        }
        if (res.data.list.length === 0 || this.waferTol === 0) {
          this.waferList = []
        }
      })
    },
    // 添加
    handleAdd() {
      this.alnMachineId = ''
      this.alnCraftId = ''
      this.dateId = ''
      this.timeId = ''
      this.siteForm.siteType = ''
      this.siteForm.siteName = ''
      this.siteForm.siteStatus = ''
      this.addDialogVisible = true
    },
    // 关闭
    handleClose(formName) {
      this.importedBoxNo = []
      this.rightData = []
      this.rightList = []
      this.leftList = []
      this.boxNum = ''
      this.isActiveBoxNum = 0
      this.rightWaferTotal = 0
      this.selectedTotal = 0
      this.isAssigned = false
      this.isTipOut = false
      this.notFinish = false
      this.ksDisabled = true
      this.alnMachineId = ''
      this.alnCraftId = ''
      this.dateId = ''
      this.timeId = ''
      this.alniForm.jsdy = ''
      this.alniForm.lbyl = ''
      this.alniForm.bcxh = ''
      this.alniForm.param4 = ''
      this.alniForm.param5 = ''
      this.alniForm.param6 = ''
      this.alniForm.param7 = ''
      this.$refs[formName].resetFields()
    },
    setSubstrateList(plies, status, index) {
      // console.log(plies, 'pliesplies')
      // console.log(status, 'statusstatus')
      // console.log(index, 'indexindex')
      // 拼装状态为启动的分配衬底
      if (status === 0) {
        plies.forEach((item, i) => {
          if (item.boxNo !== '') {
            this.substrateList.push({
              layer: index,
              location: i + 1,
              substrateId: item.id
            })
          } else {
            this.notFinish = true
          }
        })
      }
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.substrateList = []
          this.notFinish = false
          this.submitPliesList = this.submitPliesList.reverse()
          this.submitPliesList.forEach((item, index) => {
            var plies = []
            switch (item.layer) {
              case 1 : plies = this.plies1
                break
              case 2 : plies = this.plies2
                break
              case 3 : plies = this.plies3
                break
              case 4 : plies = this.plies4
                break
              case 5 : plies = this.plies5
                break
              case 6 : plies = this.plies6
                break
              case 7 : plies = this.plies7
            }
            // ///////////////////
            this.setSubstrateList(plies, item.status, item.layer)
          })
          if (this.substrateList.length === 0) {
            this.$message({
              type: 'error',
              message: '大盘尚未分配wafer信息!'
            })
            return false
          }
          this.isSubmit = true
          this.scatteredIdArr = []
          this.rightData.forEach((boxItem, index) => {
            this.boxNumNavFor(index)
          })
          const params = {
            isok: false,
            alnId: this.alniForm.alNiId,
            machineId: this.alniForm.ldjt, // 机台
            sliceNo: this.selectedTotal, // 放片数量
            cycle: this.alniForm.pm, // pm
            alnTaskId: this.alniForm.ldrwmc, // 任务名称
            measureId: this.alniForm.cdcc, // 尺寸
            stopperId: this.alniForm.ks, // 卡塞
            // creator: this.alniForm.fpr, // 放片人
            creator: getUserId(), // 放片人
            createTime: this.alniForm.alniDate + ' ' + this.alniForm.hours + ':' + this.alniForm.minutes, // 投片时间
            supplier: this.alniForm.cdcj, // 厂家
            alnCraftId: this.alniForm.ldgy, // 工艺
            voltage: this.alniForm.jsdy, // 电压
            material: this.alniForm.bcxh, // 靶材消耗
            pressure: this.alniForm.lbyl, // 冷泵压力
            param4: this.alniForm.param4,
            param5: this.alniForm.param5,
            param6: this.alniForm.param6,
            param7: this.alniForm.param7,
            scatteredIds: this.scatteredIdArr.join(','), // 散片ids ,分割
            status: 0,
            substrateList: this.substrateList
            // taker: 0, // 取片人
            // remark: "string",,
          }
          if (this.notFinish) {
            this.$confirm('存在尚未分配wafer的大盘，是否确认保存?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.confirmCompleted(params)
            })
          } else {
            this.confirmCompleted(params)
          }
        } else {
          if (this.activeTabIndex === 1) {
            this.$message({
              type: 'error',
              message: '请先完善基本信息!'
            })
          }
          console.log('error submit!!')
          return false
        }
      })
    },
    confirmCompleted(params) {
      this.submitBtnDisabled = true
      add(params).then(res => {
        if (res.code === 0) {
          this.submitBtnDisabled = false
          if (res.data !== null) {
            this.$confirm(res.data, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              params.isok = true
              this.confirmCompleted(params)
            })
          } else {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.addDialogVisible = false
            this.fetchData()
          }
        }
      })
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
    },
    // 重置
    handleReset() {
      this.$confirm('机台的PM值将被重置为1, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(123)
        this.alniForm.pm = 1
      })
    }
  }
}

