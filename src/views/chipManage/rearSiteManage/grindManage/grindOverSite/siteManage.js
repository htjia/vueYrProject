
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findMachineUser, abnormalSave, receiveScanning } from '@/api/chipManage/rearSiteManage/tensileTest'
import { getList, nowProcessList } from '@/api/chipManage/transitSiteConfig'
//                                                                        上片                                     数据列表查询  粘片、研磨、抛光扫描
import { findAbnormalList, addCleaning, addDeliver, addReceive, addStick, addUpSlice, cleanScanning, deliverScanning, queryList, stickScanning, upSliceScanning,
  checkPlate, findMachinList, determine, plateList, obtainSerialNum, getHasUpNoPlatter, abnormalGrindingReport, clearListUpSlice,
  fragmentReport, willFragmentReportList, fragmentRecord, deleteFragment
} from '@/api/chipManage/rearSiteManage/grindOverSite'
import { getToken } from '@/utils/auth'
const MyCol = {
  name: 'MyCol',
  props: {
    colOpts: Object
  },
  render(h) {
    function travelTable(col) {
      if (!col.visible) {
        return null
      }
      if (Array.isArray(col.children) && col.children.length !== 0) {
        return h('el-table-column', { props: col }, col.children.map(item => travelTable(item)))
      }
      return h('el-table-column', { props: col })
    }
    return travelTable(this.colOpts)
  }
}
export default {
  components: { PageHeaderLayout, HeaderSearchAdd, MyCol },
  data() {
    return {
      listLoading: false,
      isDisabled: false,
      notFinished: true,
      DialogVisible: false,
      addDialogVisible: false,
      glueDialogVisible: false,
      clearDialogVisible: false,
      grindDialogVisible: false,
      polishingDialogVisible: false,
      receiveDialogVisible: false,
      deliverDialogVisible: false,
      transmitDialogVisible: false,
      batchDialogVisible: false,
      selectTheadVisble: false,
      abnormalReportDialog: false,
      replaceBatchDialog: false,
      recordDialogVisible: false,
      fragReportVisible: false,
      notBastic: false,
      hasCached: false,
      noPlatter: true,
      searchKeys: {
        serialNum: '',
        plateType: '',
        plateNum: ''
      },
      selectedReportRow: '',
      searchBatchNo: '',
      grindingUpId: '',
      batchID: '',
      waferID: '',
      initialNum: '',
      isActive: '',
      replaceBatchNo: '',
      targetHd: '',
      targetUp: '',
      targetDown: '',
      deviation: '',
      grindingPly: '',
      polishingPly: '',
      stickPly: '',
      selectedAbnormalNum: 0,
      totalSliceNo: 0,
      batchNoTotal: 0,
      totalRecordPage: 0,
      batchUpNoTotal: 0,
      upTotalNum: 0,
      plateSize: 0,
      batchSize: 0,
      plateNum: 0,
      target: '',
      grindTarget: '',
      isReceive: 0,
      isUpslice: 0,
      isStick: 0,
      isGrind: 0,
      isPolish: 0,
      isClean: 0,
      min1: '',
      min2: '',
      min3: '',
      min4: '',
      max1: '',
      max2: '',
      max3: '',
      max4: '',
      batch: 5,
      decideResult: '请判定',
      textareaRow: 1,
      abnormalRemark: '',
      abnormalBatchNum: '',
      plateNumAddCode: '',
      plateCode: '',
      plate: '',
      previousBatch: '',
      previousProductModel: '',
      serialNum: '',
      productModel: '',
      fragPosition: '',
      platterWaferList: [],
      fragPositionList: [
        { id: 0, name: '上片' },
        { id: 1, name: '粘片' },
        { id: 2, name: '抛光' },
        { id: 3, name: '减薄' },
        { id: 4, name: '清洗' }
      ],
      plateOptions: [],
      cachedBatchNo: [],
      abnormalReport: [],
      abnormalBatchList: [],
      userOptions: [],
      proceOptions: [],
      receiveList: [],
      mergeBatchArr: [],
      machineList: [],
      transportList: [],
      transmitList: [],
      waferTotalNum: 24,
      abnormalList: [],
      detailList: [],
      copyReceiveList: [],
      selectedRunRow: {},
      selectedrow: '',
      glueTime: new Date(),
      batchNo: '',
      batchNum: '',
      platterNo: '',
      process: '',
      sProcess: '',
      jProcess: '',
      cProcess: '',
      jRemark: '',
      program: '',
      cRemark: '',
      sRemark: '',
      jOperator: '',
      sOperator: '',
      cOperator: '',
      jRemarkLeft: '',
      sRemarkLeft: '',
      cRemarkLeft: '',
      zRemarkLeft: '',
      result: '',
      trench: '', // 槽位
      grandTotal: '', // 累计片数
      threshold: '', // 阈值
      temperature: '', // 溶液温度
      etchingTime: '', // 腐蚀时间
      machineNum: '', // 机台编号
      motionRadio: '1',
      list: [],
      wafers: [],
      siteType: '',
      siteName: '',
      siteStatus: '',
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      recordPageSize: 15,
      recordPageNum: 1,
      beginDate: '',
      beginRecordDate: '',
      endRecordDate: '',
      startTime: new Date().getTime() - 3600 * 1000 * 24 * 2,
      endTime: new Date().getTime(),
      endDate: '',
      pickerOptionsDialogStart: {
        disabledDate: (time) => {
          const endDateVal = this.endDate
          if (endDateVal) {
            return time.getTime() > endDateVal
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      pickerOptionsDialogEnd: {
        disabledDate: (time) => {
          const beginDateVal = this.beginDate
          if (beginDateVal) {
            return time.getTime() < beginDateVal || time.getTime() > Date.now()
          } else {
            return time.getTime() > Date.now()
          }
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
      pickerRecordOptionsStart: {
        disabledDate: (time) => {
          const endDateVal = this.endRecordDate
          if (endDateVal) {
            return time.getTime() > endDateVal
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      pickerRecordOptionsEnd: {
        disabledDate: (time) => {
          const beginDateVal = this.beginRecordDate
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
      timeOptions: [
        { id: 0, name: '接片时间' },
        { id: 1, name: '上片时间' },
        { id: 2, name: '粘片时间' },
        { id: 3, name: '研磨时间' },
        { id: 4, name: '抛光时间' },
        { id: 5, name: '清洗时间' },
        { id: 6, name: '传片时间' }
      ],
      theader: [
        // {
        //   key: 117,
        //   label: '型号',
        //   prop: 'model',
        //   align: 'center',
        //   width: 80,
        //   visible: true
        // },
        {
          key: 118,
          label: '片数',
          prop: 'slicesTotal',
          align: 'center',
          width: 80,
          visible: true
        },
        {
          key: 119,
          label: '尺寸',
          prop: 'measure',
          align: 'center',
          width: 80,
          visible: true
        },
        {
          key: 9,
          label: '研磨厚度（um）',
          prop: 'grindPly',
          align: 'center',
          width: '120',
          visible: true
        },
        {
          key: 10,
          label: '接片时间',
          prop: 'receiveTime',
          align: 'center',
          visible: true,
          width: 160,
          showOverflowTooltip: true
        },
        {
          key: 111,
          label: '接片人',
          prop: 'receiveName',
          align: 'center',
          visible: true
        },
        {
          key: 112,
          label: '备注',
          prop: 'receiveRemark',
          align: 'center',
          visible: true,
          width: 160,
          showOverflowTooltip: true
        },
        {
          key: 113,
          label: '上片时间',
          prop: 'upSliceTime',
          align: 'center',
          visible: true,
          width: 160,
          showOverflowTooltip: true
        },
        {
          key: 114,
          label: '上片人',
          prop: 'upSliceName',
          align: 'center',
          visible: true
        },
        {
          key: 115,
          label: '备注',
          prop: 'upSliceRemark',
          align: 'center',
          visible: true,
          width: 160,
          showOverflowTooltip: true
        },
        {
          key: 1,
          label: '粘片数据',
          visible: true,
          align: 'center',
          children: [
            { visible: true, prop: 'zmachineCode', key: 11, align: 'center', label: '粘片机台' },
            { visible: true, prop: 'zremark', key: 12, align: 'center', label: '备注', width: 160, showOverflowTooltip: true },
            { visible: true, prop: 'ztarget', key: 13, align: 'center', width: '130', label: '目标厚度', showOverflowTooltip: true },
            { visible: true, prop: 'ztest1', key: 14, align: 'center', width: '120', label: '测试厚度（1）' },
            { visible: true, prop: 'ztest2', key: 15, align: 'center', width: '120', label: '测试厚度（2）' },
            { visible: true, prop: 'ztest3', key: 16, align: 'center', width: '120', label: '测试厚度（3）' },
            { visible: true, prop: 'ztest4', key: 17, align: 'center', width: '120', label: '测试厚度（4）' },
            { visible: true, prop: 'zresult', key: 18, align: 'center', label: '判定结果', width: 160, showOverflowTooltip: true }
          ]
        },
        {
          key: 2,
          label: '减薄数据',
          visible: true,
          align: 'center',
          children: [
            { visible: true, prop: 'gmachineCode', key: 21, align: 'center', label: '减薄机台' },
            { visible: true, prop: 'gremark', key: 22, align: 'center', label: '备注', width: 160, showOverflowTooltip: true },
            { visible: true, prop: 'gtarget', key: 23, align: 'center', label: '目标厚度', width: '120', showOverflowTooltip: true },
            { visible: true, prop: 'gtest1', key: 24, align: 'center', width: '120', label: '测试厚度（1）' },
            { visible: true, prop: 'gtest2', key: 25, align: 'center', width: '120', label: '测试厚度（2）' },
            { visible: true, prop: 'gtest3', key: 26, align: 'center', width: '120', label: '测试厚度（3）' },
            { visible: true, prop: 'gtest4', key: 27, align: 'center', width: '120', label: '测试厚度（4）' },
            { visible: true, prop: 'gresult', key: 28, align: 'center', label: '判定结果', width: 160, showOverflowTooltip: true }
          ]
        },
        {
          key: 3,
          label: '抛光数据',
          visible: true,
          align: 'center',
          children: [
            { visible: true, prop: 'pmachineCode', key: 31, align: 'center', label: '抛光机台' },
            { visible: true, prop: 'premark', key: 32, align: 'center', label: '备注', width: 160, showOverflowTooltip: true },
            { visible: true, prop: 'ptarget', key: 33, align: 'center', width: '120', label: '目标厚度' },
            { visible: true, prop: 'ptest1', key: 34, align: 'center', width: '120', label: '测试厚度（1）' },
            { visible: true, prop: 'ptest2', key: 35, align: 'center', width: '120', label: '测试厚度（2）' },
            { visible: true, prop: 'ptest3', key: 36, align: 'center', width: '120', label: '测试厚度（3）' },
            { visible: true, prop: 'ptest4', key: 37, align: 'center', width: '120', label: '测试厚度（4）' },
            { visible: true, prop: 'presult', key: 38, align: 'center', label: '判定结果', width: 160, showOverflowTooltip: true }
          ]
        },
        {
          key: 4,
          label: '清洗数据',
          visible: true,
          align: 'center',
          children: [
            { visible: true, prop: 'cleaningMachine', key: 41, align: 'center', label: '清洗机台' },
            { visible: true, prop: 'cleaningName', key: 42, align: 'center', label: '操作员' },
            { visible: true, prop: 'cleaningTime', key: 43, align: 'center', label: '清洗时间', width: 160, showOverflowTooltip: true },
            { visible: true, prop: 'cleaning_remark', key: 44, align: 'center', label: '备注', width: 160, showOverflowTooltip: true }
          ]
        },
        {
          key: 5,
          prop: 'deliverTime',
          align: 'center',
          visible: true,
          label: '传片时间',
          width: 160,
          showOverflowTooltip: true
        },
        {
          key: 6,
          label: '传片人',
          align: 'center',
          visible: true,
          prop: 'deliverName',
          showOverflowTooltip: true
        },
        {
          key: 7,
          align: 'center',
          label: '备注',
          prop: 'deliverRemark',
          width: 160,
          visible: true,
          showOverflowTooltip: true
        }
      ],
      defaultChecked: [1],
      recordList: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      selectedTime: 0,
      currentId: ''
    }
  },
  computed: {
    getToken,
    totalNum() {
      let num = 0
      this.receiveList.map(item => {
        num += item.total
      })
      return num
    },
    // 默认选中的节点 , 默认全选中
    defaultCheckedKeys() {
      var keys = []
      function travelCol(colList) {
        colList.forEach(col => {
          keys.push(col.key)
          if (Array.isArray(col.children) && col.children.length !== 0) {
            travelCol(col.children)
          }
        })
      }
      travelCol(this.theader)
      if (localStorage.getItem('keys') !== null) {
        keys = localStorage.getItem('keys').split(',')
      }
      return keys
    },
    replaceBatchDisable() {
      if (this.selectedrow === '' || this.selectedrow === null) {
        return true
      } else if (this.selectedrow.batchNo.split(',').length > 1) {
        return true
      }
      return false
    }
  },
  mounted() {
    this.fetchData()
    this.getListFun()
    this.submitOption()
    this.nowProcessListFun()
    this.findMachineUserFun()
    this.findPlateList()
  },
  methods: {
    handleDelete(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteFragment({ id: row.id }).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.viewRecord()
        })
      })
    },
    handleDialogExport() {
      const startTime = this.beginRecordDate === '' ? '' : this.formatDate(this.beginRecordDate)
      const endTime = this.endRecordDate === '' ? '' : this.formatDate(this.endRecordDate)
      window.open(process.env.BASE_API + `/xp-grind/fragmentRecordExport?waferNo=${this.waferID}&batchNo=${this.batchID}&location=${this.fragPosition}&startTime=${startTime}&endTime=${endTime}`)
    },
    clearDialogSearch() {
      this.waferID = ''
      this.batchID = ''
      this.fragPosition = ''
      this.beginRecordDate = ''
      this.endRecordDate = ''
      this.viewRecord()
    },
    selectionChange(row) {
      this.selectedReportRow = row
    },
    // 碎片上报btn
    handleFragReport(row) {
      console.log(row)
      this.grindingUpId = row.id
      willFragmentReportList({ id: row.id }).then(res => {
        res.data.map(item => {
          item.fragNum = ''
          item.fragPosition = ''
          item.remark = ''
        })
        this.platterWaferList = res.data
        this.fragReportVisible = true
      })
    },
    setCheckBoxT(row, index) {
      if (row.isReport === 1) {
        return 0
      } else {
        return 1
      }
    },
    // 碎片上报提交
    submitFragForm() {
      const params = []
      this.platterWaferList.map(item => {
        if (item.fragNum.trim() !== '' && item.fragPosition !== '') {
          params.push({
            batchNo: item.batchNo,
            creator: sessionStorage.getItem('User-Id'),
            cutNum: item.fragNum,
            grindingUpId: this.grindingUpId,
            location: item.fragPosition,
            oldWaferNo: item.waferNo,
            rankNum: item.sequence,
            remark: item.remark
          })
        }
      })
      if (params.length === 0) {
        this.$message({
          type: 'error',
          message: '请输入碎片数量与碎片位置!'
        })
        return false
      }
      // 是否确认保存当前内容？确定保存
      this.$confirm('是否确认保存当前内容?', '确定保存', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        fragmentReport(params).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.fragReportVisible = false
        })
      })
    },
    fragReportCancel() {
      this.fragReportVisible = false
      // this.$confirm('输入的内容将不会保存，是否继续?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   this.fragReportVisible = false
      // })
    },
    handleCloseDialog() {

    },
    // 每页数量改变
    recordSizeChange(recordPageSize) {
      this.recordPageSize = recordPageSize
      this.viewRecord()
    },
    // 当前页数改变
    recordCurrentChange(recordPageNum) {
      this.recordPageNum = recordPageNum
      this.viewRecord()
    },
    // 碎片记录查询
    viewRecord() {
      const params = {
        waferNo: this.waferID,
        batchNo: this.batchID,
        location: this.fragPosition,
        startTime: this.beginRecordDate === '' ? '' : this.formatDate(this.beginRecordDate),
        endTime: this.endRecordDate === '' ? '' : this.formatDate(this.endRecordDate),
        pageNum: this.recordPageNum,
        pageSize: this.recordPageSize
      }
      fragmentRecord(params).then(res => {
        this.recordList = res.data.list
        this.totalRecordPage = res.data.total
      })
      this.recordDialogVisible = true
    },
    plateChange(data) {
      this.plate = parseInt(data.split('#')[0])
      this.plateCode = data.split('#')[1]
      this.plateSize = parseInt(data.split('#')[2])
      this.findObtainSerialNum()
      this.getHasUpNoPlatterFun()
    },
    navClick(code) {
      this.isActive = code
      this.getHasUpNoPlatterFun()
    },
    // 只看未下片
    justLookNotFinished() {
      this.getHasUpNoPlatterFun()
    },
    // 盘类型
    findPlateList() {
      const params = {
        pageSize: 100,
        pageNum: 1
      }
      plateList(params).then(res => {
        this.plateOptions = res.data.list
      })
    },
    // 流水号
    findObtainSerialNum() {
      const params = {
        previousSerialNum: '',
        platterTypeCode: this.plateCode
      }
      obtainSerialNum(params).then(res => {
        this.serialNum = res.data
      })
    },
    // 根据盘类型查询
    getHasUpNoPlatterFun() {
      const params = {
        platterTypeCode: this.plateCode,
        platterTypeCodeHasPno: this.isActive,
        batchNo: this.searchBatchNo,
        startTime: this.startTime === '' ? '' : this.formatDate2(this.startTime),
        endTime: this.endTime === '' ? '' : this.formatDate2(this.endTime),
        offStatus: this.notFinished ? 0 : ''
      }
      getHasUpNoPlatter(params).then(res => {
        this.setCopyReceiveList(res.data)
        this.receiveList = res.data
        this.getBatchTotal()
        if (res.data.length > 0) {
          this.hasCached = true
          this.initialNum = res.data[0].serialNum
          this.targetHd = res.data[0].targetThickness
          this.grindingPly = res.data[0].grindingPly
          this.polishingPly = res.data[0].polishingPly
          this.stickPly = res.data[0].stickPly
          this.previousBatch = res.data[0].batchNo
          this.previousProductModel = res.data[0].productModel
          const arr = []
          res.data.map(item => {
            item.batchNo.split(',').map(batch => {
              arr.push(batch)
            })
          })
          this.cachedBatchNo = Array.from(new Set(arr))
        }
      })
    },
    // 设置copy数据
    setCopyReceiveList(data) {
      this.copyReceiveList = []
      const arr = []
      data.map(item => {
        item.details.map(detail => {
          arr.push(detail)
        })
      })
      this.copyReceiveList = this.mergeBatchObject(arr)
    },
    mergeBatchObject(arr) {
      var res = []
      var narr = []
      for (var i = 0; i < arr.length; i++) {
        var n = res.indexOf(arr[i].batchNo)
        if (n === -1) {
          res.push(arr[i].batchNo)
          narr.push({ 'batchNo': arr[i].batchNo, productModel: arr[i].productModel, targetHd: arr[i].targetThickness, wafers: [...arr[i].wafers] })
        } else {
          narr[n].wafers.push(...arr[i].wafers)
        }
      }
      return narr
    },
    pihaosaomiao(data, flag) {
      let number = 0
      let plateItem = {}
      let roderNum = []
      let full = false
      let thisSerialNum = (flag === 1 && this.hasCached) ? this.initialNum : this.serialNum
      if (this.receiveList.length > 0) { // 如果列表有数据（不是初次扫描）
        roderNum = this.receiveList[this.receiveList.length - 1].rankNum // 获取最后一盘的位次号的数组
        this.receiveList[this.receiveList.length - 1].rankNum.map(rank => { // 获取最后一盘的位次号长度
          number += rank.length
        })
        let popItem = {}
        let serialNum = ''
        if (number !== this.plate) { // 如果最后一盘不满盘，则删除组后一盘
          popItem = this.receiveList.pop()
          serialNum = popItem.serialNum // 获取前一盘的流水号
          this.previousBatch = popItem.batchNo
          this.previousProductModel = popItem.productModel
          full = false
        } else { // 如果最后一盘为满盘则不删除组后一盘重置后再分配
          number = 0
          roderNum = []
          full = true
        }
        const arr = []
        data.wafers.forEach((item, index) => {
          number++
          if (!full) { // 最后一盘不满盘
            arr.push(item.sequence)
          } else { // 最后一盘满盘
            roderNum.push(item.sequence)
          }
          if (number === this.plate) { // 放满一盘了
            if (!full) { // 最后一盘不满盘
              // 且是最后一条拼满的
              if (index === data.wafers.length - 1) {
                const patchArr = []
                let sliceNo = 0
                let sliceNoTotal = 0
                roderNum.map(roder => {
                  sliceNo += roder.length
                })
                sliceNoTotal = sliceNo + arr.length
                for (let i = sliceNoTotal + 1; i <= this.plate; i++) {
                  patchArr.push(i)
                }
                const rankNum = roderNum
                rankNum.push(arr)
                plateItem = {
                  serialNum: serialNum,
                  batchNo: this.previousBatch + ',' + data.batchNo,
                  rankNum: rankNum,
                  sliceNo: sliceNoTotal,
                  productModel: this.previousProductModel + ',' + data.productModel,
                  targetThickness: data.targetHd,
                  size: data.size,
                  plateNo: '',
                  patch: patchArr.join(',')
                }
              } else {
                const rankNum = roderNum
                rankNum.push(arr)
                plateItem = {
                  serialNum: serialNum,
                  batchNo: this.previousBatch + ',' + data.batchNo,
                  rankNum: rankNum,
                  sliceNo: this.plate,
                  productModel: this.previousProductModel + ',' + data.productModel,
                  targetThickness: data.targetHd,
                  size: data.size,
                  plateNo: '',
                  patch: ''
                }
              }
            } else { // 最后一盘满盘
              serialNum = this.receiveList[this.receiveList.length - 1].serialNum.split('-')[0] + '-' + (parseInt(this.receiveList[this.receiveList.length - 1].serialNum.split('-')[1]) + 1)
              plateItem = {
                serialNum: serialNum,
                batchNo: data.batchNo,
                rankNum: [roderNum],
                sliceNo: this.plate,
                productModel: data.productModel,
                targetThickness: data.targetHd,
                size: data.size,
                plateNo: '',
                patch: ''
              }
            }
            this.receiveList.push(plateItem)
            number = 0
            roderNum = []
            full = true
          }
        })
        if (roderNum.length !== 0) { // 没有入整盘的数据 ，追加在最后一盘！
          const patchArr = []
          let serialNum = ''
          if (this.receiveList > 0) {
            serialNum = this.receiveList[this.receiveList.length - 1].serialNum.split('-')[0] + '-' + (parseInt(this.receiveList[this.receiveList.length - 1].serialNum.split('-')[1]) + 1)
          } else {
            if (full) {
              serialNum = this.receiveList[this.receiveList.length - 1].serialNum.split('-')[0] + '-' + (parseInt(this.receiveList[this.receiveList.length - 1].serialNum.split('-')[1]) + 1)
            } else {
              serialNum = popItem.serialNum
            }
          }
          if (!full) {
            let sliceNo = 0
            let sliceNoTotal = 0
            roderNum.map(roder => {
              sliceNo += roder.length
            })
            sliceNoTotal = sliceNo + arr.length
            for (let i = sliceNoTotal + 1; i <= this.plate; i++) {
              patchArr.push(i)
            }
            const rankNum = roderNum
            rankNum.push(arr)
            plateItem = {
              serialNum: serialNum,
              batchNo: this.previousBatch + ',' + data.batchNo,
              rankNum: rankNum,
              sliceNo: sliceNoTotal,
              productModel: this.previousProductModel + ',' + data.productModel,
              targetThickness: data.targetHd,
              size: data.size,
              plateNo: '',
              patch: patchArr.join(',')
            }
          } else {
            for (let i = roderNum.length + 1; i <= this.plate; i++) {
              patchArr.push(i)
            }
            plateItem = {
              serialNum: serialNum,
              batchNo: data.batchNo,
              rankNum: [roderNum],
              sliceNo: roderNum.length,
              productModel: data.productModel,
              targetThickness: data.targetHd,
              size: data.size,
              plateNo: '',
              patch: patchArr.join(',')
            }
          }
          this.receiveList.push(plateItem)
        }
      } else { // 初次扫描
        this.previousBatch = data.batchNo
        this.previousProductModel = data.productModel
        data.wafers.forEach((item, index) => {
          number++
          roderNum.push(item.sequence)
          if (number === this.plate) {
            if (this.receiveList.length > 0) {
              thisSerialNum = thisSerialNum.split('-')[0] + '-' + (parseInt(thisSerialNum.split('-')[1]) + 1)
            }
            plateItem = {
              serialNum: thisSerialNum,
              batchNo: data.batchNo,
              rankNum: [roderNum],
              sliceNo: this.plate,
              productModel: data.productModel,
              targetThickness: data.targetHd,
              size: data.size,
              plateNo: '',
              patch: ''
            }
            this.receiveList.push(plateItem)
            number = 0
            roderNum = []
          }
        })
        if (roderNum.length !== 0) { // 初次扫描剩下的wafer重新分配一盘
          const patchArr = []
          for (let i = roderNum.length + 1; i <= this.plate; i++) {
            patchArr.push(i)
          }
          let serialNum = ''
          if (this.receiveList.length > 0) {
            serialNum = this.receiveList[this.receiveList.length - 1].serialNum.split('-')[0] + '-' + (parseInt(this.receiveList[this.receiveList.length - 1].serialNum.split('-')[1]) + 1)
          } else {
            serialNum = thisSerialNum
          }
          plateItem = {
            serialNum: serialNum,
            batchNo: data.batchNo,
            rankNum: [roderNum],
            sliceNo: roderNum.length,
            productModel: data.productModel,
            targetThickness: data.targetHd,
            size: data.size,
            plateNo: '',
            patch: patchArr.join(',')
          }
          this.receiveList.push(plateItem)
        }
      }
      this.getBatchTotal()
    },
    getBatchTotal() {
      const batchArr = []
      this.totalSliceNo = 0
      this.receiveList.map(item => {
        item.batchNo.split(',').forEach((batchItem, batchIndex) => {
          batchArr.push(batchItem)
        })
        this.totalSliceNo += item.sliceNo
      })
      this.batchUpNoTotal = Array.from(new Set(batchArr)).length
    },
    // 批次替换
    replaceBatch() {
      this.replaceBatchDialog = true
    },
    handleReplaceBatch() {
      upSliceScanning({ batchNo: this.replaceBatchNo, processId: this.jProcess }).then(res => {
        if (this.targetHd !== parseInt(res.data.targetHd) || this.grindingPly !== res.data.grindingPly || this.polishingPly !== res.data.polishingPly || this.stickPly !== res.data.stickPly) {
          this.$message({
            type: 'error',
            message: '批次目标厚度或尺寸不符，请检查后重试!'
          })
          return false
        }
        if (parseInt(res.data.size) !== this.plateSize) {
          this.$message({
            type: 'error',
            message: '批次目标厚度或尺寸不符，请检查后重试!'
          })
          return false
        }
        let selectedBatch = ''
        let selectedBatchIndex = ''
        this.copyReceiveList.forEach((item, index) => {
          if (item.batchNo === this.selectedrow.batchNo) {
            selectedBatch = item
            selectedBatchIndex = index
          }
        })
        if (res.data.wafers.length === selectedBatch.wafers.length) {
          this.copyReceiveList.splice(selectedBatchIndex, 1, res.data)
          this.receiveList = []
          this.copyReceiveList.map(item => {
            this.pihaosaomiao(item, 1)
          })
          this.replaceBatchDialog = false
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        } else {
          this.$message({
            type: 'error',
            message: '该批次片数与已选批次片数不符，请检查后重试!'
          })
          return false
        }
      })
    },
    // 批次删除
    deleteBatch() {
      this.$confirm('是否确认删除当前批次?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.receiveList = []
        this.selectedrow.batchNo.split(',').map(batch => {
          this.copyReceiveList.forEach((item, index) => {
            if (item.batchNo === batch) {
              this.copyReceiveList.splice(index, 1)
            }
          })
        })
        this.copyReceiveList.map(item => {
          this.pihaosaomiao(item, 1)
        })
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
      })
    },
    // 清空类别
    clearBatch() {
      this.$confirm('清空后，将解除当前列表所有流水号与批次的绑定关系，并重新排序流水号，是否确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = []
        this.receiveList.map(item => {
          if (item.id) {
            ids.push(item.id)
          }
        })
        if (ids.length !== 0) {
          clearListUpSlice(ids).then(res => {
            // 重新获取流水号
            this.findObtainSerialNum()
          })
        }
        this.receiveList = []
        this.copyReceiveList = []
        this.targetHd = ''
      })
    },
    currentRowChange(row) {
      this.selectedrow = row
    },
    // 研磨盘号
    onPlateInput() {
      console.log(1)
    },
    // 获取对应站点的工序
    nowProcessListFun() {
      nowProcessList({ siteId: 23 }).then(res => {
        this.proceOptions = res.data
        this.jProcess = this.proceOptions[0].id
      })
    },
    processJChange() {
      this.receiveList = []
      if (this.batchNo !== '') {
        this.handleReceiveInput()
      }
    },
    processSChange() {
      // this.receiveList = []
      // if (this.batchNo !== '') {
      //   this.handleUpSliceScanning()
      // }
    },
    processCChange() {
      this.receiveList = []
      if (this.batchNo !== '') {
        this.handleTransmitInput()
      }
    },
    getListFun() {
      const params = {
        siteId: 23
      }
      getList(params).then(res => {
        this.isReceive = res.data[0].isReceive
        this.isUpslice = res.data[0].isUpslice
        this.isStick = res.data[0].isStick
        this.isGrind = res.data[0].isGrind
        this.isPolish = res.data[0].isPolish
        this.isClean = res.data[0].isClean
      })
    },
    // 时间戳转yyyy-mm-dd
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    // 时间戳转yyyy-mm-dd
    formatDate2(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      var h = '0' + date.getHours()
      var s = '0' + date.getMinutes()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length) + ' ' + h.substring(h.length - 2, h.length) + ':' + s.substring(s.length - 2, s.length)
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const requestParams = {
        serialNum: this.searchKeys.serialNum,
        platterTypeId: this.searchKeys.plateType,
        platterNo: this.searchKeys.plateNum,
        timeType: this.selectedTime,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate),
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }
      queryList(requestParams).then(res => {
        res.data.list.map(item => {
          if (item.adhesive !== null) {
            item.zmachineCode = item.adhesive.machineCode
            item.zremark = item.adhesive.remark
            item.ztarget = item.adhesive.target
            item.zresult = item.adhesive.result
            if (item.adhesive.testData.length > 0) {
              item.ztest1 = item.adhesive.testData[0].minVal === null ? '未测试' : item.adhesive.testData[0].minVal + '，' + item.adhesive.testData[0].maxVal
              item.ztest2 = item.adhesive.testData[1].minVal === null ? '未测试' : item.adhesive.testData[1].minVal + '，' + item.adhesive.testData[1].maxVal
              item.ztest3 = item.adhesive.testData[2].minVal === null ? '未测试' : item.adhesive.testData[2].minVal + '，' + item.adhesive.testData[2].maxVal
              item.ztest4 = item.adhesive.testData[3].minVal === null ? '未测试' : item.adhesive.testData[3].minVal + '，' + item.adhesive.testData[3].maxVal
            }
          }
          if (item.grind !== null) {
            item.gmachineCode = item.grind.machineCode
            item.gremark = item.grind.remark
            item.gtarget = item.grind.target
            item.gresult = item.grind.result
            item.gtest1 = item.grind.testData[0].minVal === null ? '未测试' : item.grind.testData[0].minVal + '，' + item.grind.testData[0].maxVal
            item.gtest2 = item.grind.testData[1].minVal === null ? '未测试' : item.grind.testData[1].minVal + '，' + item.grind.testData[1].maxVal
            item.gtest3 = item.grind.testData[2].minVal === null ? '未测试' : item.grind.testData[2].minVal + '，' + item.grind.testData[2].maxVal
            item.gtest4 = item.grind.testData[3].minVal === null ? '未测试' : item.grind.testData[3].minVal + '，' + item.grind.testData[3].maxVal
          }
          if (item.polish !== null) {
            item.pmachineCode = item.polish.machineCode
            item.premark = item.polish.remark
            item.ptarget = item.polish.target
            item.presult = item.polish.result
            item.ptest1 = item.polish.testData[0].minVal === null ? '未测试' : item.polish.testData[0].minVal + '，' + item.polish.testData[0].maxVal
            item.ptest2 = item.polish.testData[1].minVal === null ? '未测试' : item.polish.testData[1].minVal + '，' + item.polish.testData[1].maxVal
            item.ptest3 = item.polish.testData[2].minVal === null ? '未测试' : item.polish.testData[2].minVal + '，' + item.polish.testData[2].maxVal
            item.ptest4 = item.polish.testData[3].minVal === null ? '未测试' : item.polish.testData[3].minVal + '，' + item.polish.testData[3].maxVal
          }
        })
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    // 人员
    findMachineUserFun() {
      findMachineUser({ pageSize: 1000, pageNum: 1 }).then(res => {
        this.userOptions = res.data.list
      })
    },
    // 机台
    findMachinListFun(siteId) {
      const params = {
        pageNum: 1,
        pageSize: 1000,
        siteId
      }
      findMachinList(params).then(res => {
        this.machineList = res.data.list
      })
    },
    // 选择陪片
    waferClick(item) {
      if (this.isDisabled) {
        return false
      }
      item.isActive = !item.isActive
    },
    // 研磨盘校验v1
    handlePlateScanningv1() {
      checkPlate({ plateCode: this.platterNo }).then(res => {
        if (this.batchSize === 0) { // 没有扫描批次信息
          this.plateSize = parseInt(res.data.size)
          this.plateNum = parseInt(res.data.plateNum)
        } else { // 已经有扫描批次信息
          if (this.batchSize === parseInt(res.data.size)) { // 批次尺寸与盘尺寸相同
            this.plateSize = parseInt(res.data.size)
            this.plateNum = parseInt(res.data.plateNum)
          } else {
            this.$message({
              type: 'error',
              message: '该研磨盘尺寸与当前批次尺寸不符!'
            })
            this.plateNum = 0
            this.plateSize = 0
            this.platterNo = ''
          }
        }
      }).catch(() => {
        this.platterNo = ''
      })
    },
    // 研磨盘校验v2
    handlePlateScanning(row, index) {
      // 校验上限值
      if (row.plateNo !== '') {
        if (index !== 0) {
          if (this.receiveList[index - 1].plateNo === '') {
            this.$message({
              type: 'error',
              message: '必须按流水号顺序扫描!'
            })
            row.plateNo = ''
            return false
          }
        }
        if (this.receiveList.filter(item => { return item.plateNo === row.plateNo }).length > 1) {
          this.$message({
            type: 'error',
            message: '当前盘号已存在!'
          })
          row.plateNo = ''
          return false
        }
        checkPlate({ plateCode: row.plateNo }).then(res => {
          if (parseInt(res.data.size) !== this.plateSize) {
            this.$message({
              type: 'error',
              message: '该研磨盘尺寸与当前批次尺寸不符!'
            })
            row.plateNo = ''
          } else if (parseInt(res.data.plateNum) !== this.plate) {
            this.$message({
              type: 'error',
              message: '该研磨盘片数与当前盘类型片数不符!'
            })
            row.plateNo = ''
          } else {
            if (index !== this.receiveList.length - 1) {
              this.$refs[Object.keys(this.$refs)[index + 1]].focus()
            }
          }
        }).catch(() => {
          row.plateNo = ''
        })
      }
    },
    testScanningFun(index) {
      this.$refs[Object.keys(this.$refs)[index]].focus()
      if (index === 0) {
        this.handleDecide()
      }
    },
    // M-AA00X99821052X01
    onStrarInput(row, index) {
      row.min = parseInt(row.min)
      row.max = parseInt(row.max)
      row.baseNum = parseInt(row.baseNum)
      row.upNum = parseInt(row.upNum)
      if (row.min > 24) {
        row.min = 24
      }
      if (row.min > row.max) {
        row.min = row.max
      }
      if (row.min < row.baseNum) { row.min = row.baseNum }
      row.upNum = (row.max - row.min) + 1
      if (row.upNum > row.total) {
        row.min--
      }
      let batch = ''
      this.batchNoTotal = 0
      this.upTotalNum = 0
      this.receiveList.map(item => {
        if (item.batchNo !== batch) {
          batch = item.batchNo
          this.batchNoTotal++
        }
        this.upTotalNum += item.upNum
      })
    },
    onEndInput(row, index) {
      console.log(row)
      row.min = parseInt(row.min)
      row.max = parseInt(row.max)
      row.baseNum = parseInt(row.baseNum)
      row.upNum = parseInt(row.upNum)
      if (row.max > 24) {
        row.max = 24
      }
      if (row.max < row.baseNum) { row.max = row.baseNum }
      if (row.max < row.min) {
        row.max = row.min
      }
      if (row.max) {
        row.upNum = (row.max - row.min) + 1
      } else {
        row.upNum = ''
      }
      if (row.upNum > row.total) {
        row.max = row.total
        row.upNum = (row.max - row.min) + 1
      }
      let batch = ''
      this.batchNoTotal = 0
      this.upTotalNum = 0
      this.receiveList.map(item => {
        if (item.batchNo !== batch) {
          batch = item.batchNo
          this.batchNoTotal++
        }
        this.upTotalNum += item.upNum
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
      const vm = this
      function travelCol(colList) {
        colList.forEach(col => {
          const node = vm.$refs['tree'].getNode(col.key)
          node.data.visible = node.checked || node.indeterminate
          if (Array.isArray(col.children) && col.children.length !== 0) {
            travelCol(col.children)
          }
        })
      }
      travelCol(this.theader)
      this.selectTheadVisble = false
      localStorage.setItem('keys', this.$refs.tree.getCheckedKeys())
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
    // 接片扫码
    handleReceiveInput() {
      if (this.batchNo.trim() === '') {
        this.$message({
          type: 'error',
          message: '该扫描数据不存在，请确认后，再扫描!'
        })
        this.batchNo = ''
        return false
      }
      if (this.receiveList.filter(item => { return item.batchNo === this.batchNo }).length > 0) {
        this.$message({
          type: 'error',
          message: '当前批号已存在!'
        })
        return false
      }
      const requestParams = {
        key: this.batchNo,
        processId: this.jProcess,
        siteCode: 'H04'
      }
      receiveScanning(requestParams).then(res => {
        if (res.data !== null) {
          this.program = res.data.program
          this.jRemark = res.data.remark
          this.batchNo = ''
          this.receiveList.push(res.data)
        }
      }).catch(() => {
        this.batchNo = ''
      })
    },
    proofScheme(data) {
      if (this.batchSize === 0) {
        this.batchSize = parseInt(data.size)
        data['baseNum'] = 1
        data['min'] = 1
        data['max'] = 1
        data['upNum'] = 1
        this.program = data.program
        this.jRemark = data.jRemark
        this.receiveList.push(data)
        let batch = ''
        this.batchNoTotal = 0
        this.receiveList.map(item => {
          if (item.batchNo !== batch) {
            batch = item.batchNo
            this.batchNoTotal++
          }
          this.upTotalNum += item.upNum
        })
      } else {
        // 与第一批尺寸相同
        if (parseInt(data.size) === this.batchSize) {
          data['baseNum'] = parseInt(this.receiveList[this.receiveList.length - 1].max) + 1
          data['min'] = parseInt(this.receiveList[this.receiveList.length - 1].max) + 1
          data['max'] = parseInt(this.receiveList[this.receiveList.length - 1].max) + 1
          data['upNum'] = 1
          this.program = data.program
          this.jRemark = data.jRemark
          this.receiveList.push(data)
          let batch = ''
          this.batchNoTotal = 0
          this.upTotalNum = 0
          this.receiveList.map(item => {
            if (item.batchNo !== batch) {
              batch = item.batchNo
              this.batchNoTotal++
            }
            this.upTotalNum += item.upNum
          })
        } else {
          this.$message({
            type: 'error',
            message: '当前批次尺寸与已有批次尺寸不符!'
          })
          return false
        }
      }
    },
    // 上片扫描v1
    handleUpSliceScanningv1() {
      upSliceScanning({ batchNo: this.batchNo, processId: this.jProcess }).then(res => {
        if (this.plateSize !== 0) { // 已扫描盘号
          if (parseInt(res.data.size) === this.plateSize) { // 盘号与批次尺寸一致
            // 判定同批次尺寸是否相同
            this.proofScheme(res.data)
          } else {
            this.$message({
              type: 'error',
              message: '当前批次尺寸与研磨盘尺寸不符!'
            })
          }
        } else {
          // 判定同批次尺寸是否相同
          this.proofScheme(res.data)
        }
      })
      setTimeout(() => {
        this.batchNo = ''
      }, 200)
    },
    // 上片扫描v2
    handleUpSliceScanning() {
      let flag = false
      // 重复验证
      this.receiveList.forEach((item, index) => {
        item.batchNo.split(',').forEach((batch, batchIndex) => {
          if (batch === this.batchNo) {
            flag = true
          }
        })
      })
      if (flag) {
        this.$message({
          type: 'error',
          message: '当前批次已存在!'
        })
        this.batchNo = ''
        return false
      }
      upSliceScanning({ batchNo: this.batchNo, processId: this.jProcess }).then(res => {
        this.batchSize = parseInt(res.data.size)
        if (this.receiveList.length === 0) { // 初次扫描
          this.targetHd = parseInt(res.data.targetHd)
          this.grindingPly = res.data.grindingPly
          this.polishingPly = res.data.polishingPly
          this.stickPly = res.data.stickPly
        } else { // 非初次扫描
          if (this.targetHd !== parseInt(res.data.targetHd) || this.grindingPly !== res.data.grindingPly || this.polishingPly !== res.data.polishingPly || this.stickPly !== res.data.stickPly) {
            this.$message({
              type: 'error',
              message: '批次目标厚度或尺寸不符，请检查后重试!'
            })
            return false
          }
        }
        if (this.batchSize !== this.plateSize) {
          this.$message({
            type: 'error',
            message: '批次目标厚度或尺寸不符，请检查后重试!'
          })
          return false
        }
        this.copyReceiveList.push(res.data)
        console.log(this.copyReceiveList)
        this.pihaosaomiao(res.data)
      })
      setTimeout(() => {
        this.batchNo = ''
      }, 200)
    },
    platterNoChange() {
      if (this.platterNo === '') {
        this.plateSize = 0
      }
    },
    deleteItem(index, flag) {
      this.$confirm('确认删除该信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.receiveList.splice(index, 1)
        if (this.receiveList.length === 0) {
          this.batchSize = 0
        }
        if (flag === 1) {
          this.targetDown = ''
          this.targetUp = ''
          this.targetHd = ''
          this.productModel = ''
          this.getBatchTotal()
        }
        let batch = ''
        this.batchNoTotal = 0
        this.upTotalNum = 0
        this.receiveList.map(item => {
          if (item.batchNo !== batch) {
            batch = item.batchNo
            this.batchNoTotal++
          }
          this.upTotalNum += item.upNum
        })
      })
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
    mergeObject(item) {
      // 创建映射
      /* eslint-disable */
      var map = item.reduce((p, c, d) => [p[c.batchNo] = p[c.batchNo] || 0, p[c.batchNo] += ',' + c.rankNum, p][2], {})
      // 获取映射结果
      var arrayFilted = Object.keys(map).map(key => [{ batchNo: key, rankNum: map[key].substr(2) }][0])
      console.log(arrayFilted)
      return arrayFilted
    },
    // 异常上报v2
    handleReporting(index) {
      const batchData = []
      if (index === 1) { // 是清洗上报
        this.receiveList.map(item => {
          if (item.offStatus === 0) { // 获取未下片的盘上的批次
            item.details.map(detail => {
              batchData.push({
                batchNo: detail.batchNo,
                rankNum: detail.rankNum,
                serialNum: item.serialNum
              })
            })
          }
        })
      } else if (index === 2) { // 上片上报
        console.log(this.receiveList)
        this.receiveList.map(item => {
          item.batchNo.split(',').forEach((batch, batchIndex) => {
            batchData.push({
              batchNo: batch,
              rankNum: item.rankNum[batchIndex].join(',')
            })
          })
        })
      } else {
        this.receiveList.map(item => {
          item.details.map(detail => {
            batchData.push({
              batchNo: detail.batchNo,
              rankNum: detail.rankNum,
              serialNum: item.serialNum
            })
          })
        })
      }
      console.log(batchData)
      abnormalGrindingReport(batchData).then(res => {
        res.data.map(item => {
          this.mergeBatchArr.map(mergeItem => {
            if (item.batchNo === mergeItem.batchNo) {
              const filterWafers = item.wafers.filter(wafer => {return mergeItem.rankNum.split(',').map(Number).indexOf(wafer.sequence) !== -1})
              item.wafers = filterWafers
            }
          })
        })
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
    // 异常上报
    handleReporting2() {
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
    // 异常上报v1
    handleReporting1(index) {
      let params = []
      const batchData = []
      if (index === 1) { // 是清洗上报
        this.receiveList.map(item => {
          if (item.offStatus === 0) { // 获取未下片的盘上的批次
            item.details.map(detail => {
              batchData.push({
                batchNo: detail.batchNo,
                rankNum: detail.rankNum,
                grindingDisc: item.serialNum
              })
            })
            item.batchNo.split(',').forEach((batch, index) => {
              params.push(batch)
            })
          }
          params = Array.from(new Set(params))
        })
      } else {
        this.receiveList.map(item => {
          item.details.map(detail => {
            batchData.push({
              batchNo: detail.batchNo,
              rankNum: detail.rankNum
            })
          })
          item.batchNo.split(',').forEach((batch, index) => {
            params.push(batch)
          })
          params = Array.from(new Set(params))
        })
      }
      this.mergeBatchArr = this.mergeObject(batchData)
      console.log(batchData, '==========batchData========')
      findAbnormalList(params).then(res => {
        res.data.map(item => {
          this.mergeBatchArr.map(mergeItem => {
            if (item.batchNo === mergeItem.batchNo) {
              const filterWafers = item.wafers.filter(wafer => {return mergeItem.rankNum.split(',').map(Number).indexOf(wafer.sequence) !== -1})
              item.wafers = filterWafers
            }
          })
        })
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
    abnormalSubmit(index) {
      const details = []
      const abnormalBatchList = []
      let flag = false
      let itemFlag = false
      let hasAblm = false
      this.abnormalReport.map(item => {
        if (item.abnormalStatus) {
          abnormalBatchList.push(item.batchNo)
          hasAblm = true
          if (item.selectedWafer === 0) {
            flag = true
          }
          item.wafers.map(subItem => {
            if (subItem.abnormalStatus) {
              if (index === 1) {
                details.push({
                  initAbnormal: true,
                  batchNo: item.batchNo,
                  reason: subItem.abnormalCause ? subItem.abnormalCause : this.abnormalRemark,
                  waferNo: subItem.waferNo,
                  grindingDisc: subItem.serialNum ? subItem.serialNum : '',
                  sequence: subItem.sequence ? subItem.sequence : '',
                  grindingUp: true
                })
              } else {
                details.push({
                  initAbnormal: true,
                  batchNo: item.batchNo,
                  reason: subItem.abnormalCause ? subItem.abnormalCause : this.abnormalRemark,
                  waferNo: subItem.waferNo,
                  grindingDisc: subItem.serialNum ? subItem.serialNum : '',
                  sequence: subItem.sequence ? subItem.sequence : ''
                })
              }
            } else {
              if (index === 1) {
                details.push({
                  initAbnormal: false,
                  batchNo: item.batchNo,
                  reason: '',
                  waferNo: subItem.waferNo,
                  grindingDisc: subItem.serialNum ? subItem.serialNum : '',
                  sequence: subItem.sequence ? subItem.sequence : '',
                  grindingUp: true
                })
              } else {
                details.push({
                  initAbnormal: false,
                  batchNo: item.batchNo,
                  reason: '',
                  waferNo: subItem.waferNo,
                  grindingDisc: subItem.serialNum ? subItem.serialNum : '',
                  sequence: subItem.sequence ? subItem.sequence : ''
                })
              }
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
        description: this.abnormalRemark,
        processId: this.jProcess,
        exceptionSiteCode: 'H04',
        details
      }
      console.log(params)
      abnormalSave(params).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.abnormalBatchList = abnormalBatchList
        this.abnormalReportDialog = false
        if (index === 1) { // 上片异常上报
          this.setReceiveList(details)
        }
      })
    },
    setReceiveList(batchList) {
      this.receiveList = []
      batchList.map(batch => {
        this.copyReceiveList.forEach((item, index) => {
          if (item.batchNo === batch.batchNo) {
            this.copyReceiveList.splice(index, 1)
          }
        })
      })
      this.copyReceiveList.map(item => {
        this.pihaosaomiao(item, 1)
      })
      this.$message({
        type: 'success',
        message: '操作成功!'
      })
      this.submitSortList()
    },
    submitSortList() {
      const list = []
      const hasSerialNumList = []
      this.cachedBatchNo.map(cachedBatch => {
        this.receiveList.map(item => {
          if (item.batchNo.includes(cachedBatch)) {
            hasSerialNumList.push(item)
          }
        })
      })
      console.log(hasSerialNumList, 'hasSerialNumList------------')
      hasSerialNumList.forEach((item, index) => {
        const withs = []
        const details = []
        if (item.patch !== '' && item.patch !== null) {
          item.patch.split(',').map(location => {
            withs.push({
              location: location
            })
          })
        }
        item.batchNo.split(',').forEach((batch, batchIndex) => {
          details.push({
            batchNo: batch,
            sliceNo: item.rankNum[batchIndex].join(',').split(',').length,
            rankNum: item.rankNum[batchIndex].join(',')
          })
        })
        list.push({
          creator: sessionStorage.getItem('User-Id'),
          details,
          plateNo: '',
          serialNum: item.serialNum,
          remark: this.jRemarkLeft,
          withs
        })
      })
      addUpSlice({ list, platterTypeCode: this.plateCode }).then(res => {
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
    handleSearch() {
      this.pageNum = 1
      this.fetchData()
    },
    clearSearch() {
      this.searchKeys.serialNum = ''
      this.searchKeys.plateType = ''
      this.searchKeys.plateNum = ''
      this.selectedTime = ''
      this.beginDate = ''
      this.endDate = ''
      this.handleSearch()
    },
    exportExcel() {
      console.log(123)
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
      const details = []
      this.receiveList.map(item => {
        details.push({
          batchNo: item.batchNo,
          piecesNum: item.total
        })
      })
      const params = {
        creator: sessionStorage.getItem('User-Id'),
        remark: this.jRemarkLeft,
        details
      }
      addReceive(params).then(res => {
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
      this.deliverDialogVisible = true
      this.isActive = ''
      this.startTime = ''
      this.endTime = ''
      this.isDisabled = false
    },
    // 粘片
    handleGlue() {
      this.isDisabled = true
      this.findMachinListFun(23)
      this.glueDialogVisible = true
      setTimeout(() => {
        this.$refs.importInputZp.focus()
      }, 200)
    },
    // 研磨
    handleGrind() {
      this.isDisabled = true
      this.findMachinListFun(23)
      this.grindDialogVisible = true
      setTimeout(() => {
        this.$refs.importInputYp.focus()
      }, 100)
    },
    // 抛光
    handlePolishing() {
      this.isDisabled = true
      this.findMachinListFun(23)
      this.polishingDialogVisible = true
      setTimeout(() => {
        this.$refs.importInputPp.focus()
      }, 100)
    },
    // 粘片 研磨 抛光扫描
    stickScanningFun(type) {
      if (this.receiveList.length > 0) {
        return false
      }
      stickScanning({ plateNo: this.batchNo, type }).then(res => {
        // this.plateSize = res.data.plateSize
        this.targetUp = res.data.targetThickness + res.data.deviation
        this.targetDown = res.data.targetThickness - res.data.deviation
        this.deviation = res.data.deviation
        this.targetHd = res.data.targetThickness
        this.productModel = res.data.productModel
        this.receiveList.push(res.data)
        this.getBatchTotal()
        this.$refs[Object.keys(this.$refs)[0]].focus()
      })
      setTimeout(() => {
        this.batchNo = ''
      }, 200)
    },
    // 重测
    handleRetest() {
      this.min1 = ''
      this.min2 = ''
      this.min3 = ''
      this.min4 = ''
      this.max1 = ''
      this.max2 = ''
      this.max3 = ''
      this.max4 = ''
      this.$refs[Object.keys(this.$refs)[0]].focus()
      this.decideResult = '请判定'
    },
    // 结果判定
    handleDecide() {
      if (this.receiveList.length === 0) {
        return false
      }
      var list = []
        // || this.min2 === '' || this.max2 === '' || this.min3 === '' || this.max3 === '' || this.min4 === '' || this.max4 === ''
      if (this.min1 === '' || this.max1 === '' || this.min2 === '' || this.max2 === '' || this.min3 === '' || this.max3 === '' || this.min4 === '' || this.max4 === '') {
        this.$message({
          type: 'error',
          message: '请输入实际厚度!'
        })
        return false
      }
      if (this.min1 !== '' && this.max1 !== '') {
        list.push({
          min: this.min1 * 1000,
          max: this.max1 * 1000
        })
      }
      if (this.min2 !== '' && this.max2 !== '') {
        list.push({
          min: this.min2 * 1000,
          max: this.max2 * 1000
        })
      }
      if (this.min3 !== '' && this.max3 !== '') {
        list.push({
          min: this.min3 * 1000,
          max: this.max3 * 1000
        })
      }
      if (this.min4 !== '' && this.max4 !== '') {
        list.push({
          min: this.min4 * 1000,
          max: this.max4 * 1000
        })
      }
      const params = {
        target: this.targetHd + '±' + this.deviation,
        list
      }
      console.log(params)
      determine(params).then(res => {
        this.decideResult = res.data
      })
    },
    // 粘片 研磨 抛光上片
    addStickFun(type) {
      if (this.trench === '') {
        this.$message({
          type: 'error',
          message: '请选择机台!'
        })
        return false
      }
      if (this.min1 === '' || this.max1 === '') {
        this.$message({
          type: 'error',
          message: '请输入实际厚度!'
        })
        return false
      }
      const plateNoArr = []
      let abnormalBatch = false
      var abnormalBatchs = []
      this.receiveList.map(item => {
        plateNoArr.push(item.plateNo)
        item.batchNo.split(',').forEach((batch, batchIndex) => {
          if (this.abnormalBatchList.indexOf(batch) !== -1) {
            abnormalBatch = true
            abnormalBatchs.push(batch)
          }
          // if (plateNoArr.indexOf(batch) === -1) {
          //   plateNoArr.push(batch)
          // }
        })
      })
      if (abnormalBatch) {
        const batchs = abnormalBatchs.join(',')
        this.$message({
          type: 'error',
          message: `${batchs}批次异常,请先进行异常处理！`
        })
        return false
      }
      const params = {
        machineId: this.trench,
        remark: this.jRemarkLeft,
        result: this.decideResult,
        testData: [
          { minVal: this.min1 * 1000, maxVal: this.max1 * 1000 },
          { minVal: this.min2 * 1000, maxVal: this.max2 * 1000 },
          { minVal: this.min3 * 1000, maxVal: this.max3 * 1000 },
          { minVal: this.min4 * 1000, maxVal: this.max4 * 1000 }
        ],
        plateNo: plateNoArr.join(','),
        type
      }
      addStick(params).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.fetchData()
        this.glueDialogVisible = false
        this.grindDialogVisible = false
        this.polishingDialogVisible = false
      })
    },
    // 清洗
    handleRinse() {
      this.isDisabled = true
      this.findMachinListFun(23)
      this.clearDialogVisible = true
      this.isActive = this.plateOptions[0].code
      this.startTime = new Date().getTime() - 3600 * 1000 * 24 * 2
      this.endTime = new Date().getTime()
      this.getHasUpNoPlatterFun()
    },
    // 清洗扫描
    clearScanningFun(row) {
      cleanScanning({ plateNo: row.plateNo }).then(res => {
        if (this.trench === '') {
          this.$message({
            type: 'error',
            message: '请选择清洗机台!'
          })
          return false
        }
        let abnormalBatch = false
        var abnormalBatchs = []
        row.batchNo.split(',').forEach((batch, batchIndex) => {
          if (this.abnormalBatchList.indexOf(batch) !== -1) {
            abnormalBatch = true
            abnormalBatchs.push(batch)
          }
        })
        if (abnormalBatch) {
          const batchs = abnormalBatchs.join(',')
          this.$message({
            type: 'error',
            message: `${batchs}批次异常,请先进行异常处理！`
          })
          return false
        }
        this.$confirm('是否确认下片?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = {
            creator: sessionStorage.getItem('User-Id'),
            machineId: this.trench,
            remark: this.jRemarkLeft,
            plateNo: row.plateNo
          }
          console.log(params)
          addCleaning(params).then(res => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getHasUpNoPlatterFun()
          })
        })
      })
    },
    // 清洗传片
    handleClearDialog(row) {
      this.clearScanningFun(row)
    },
    rowStyle({ row }) {
      if (row.offStatus === 0) {
        return 'background: #edfff5'
      } else {
        return 'background: #f2f2f2'
      }
    },
    // 传片
    handleTransmit() {
      this.transmitDialogVisible = true
      setTimeout(() => {
        this.$refs.importInputCp.focus()
      }, 100)
    },
    // 传片扫描
    handleTransmitInput() {
      if (this.receiveList.filter(item => { return item.batchNo === this.batchNo }).length > 0) {
        this.$message({
          type: 'error',
          message: '当批号已存在!'
        })
        return false
      }
      deliverScanning({ batchNo: this.batchNo, processId: this.jProcess }).then(res => {
        this.program = res.data.program
        this.jRemark = res.data.remark
        this.receiveList.push(res.data)
        this.wafers.map(item => {
          item.isActive = false
        })
        this.wafers.map(item => {
          res.data.withs.map(num => {
            if (item.name === parseInt(num)) {
              item.isActive = true
            }
          })
        })
      })
      setTimeout(() => {
        this.batchNo = ''
      }, 200)
    },
    // 传片确认
    handleTransmitDialog() {
      const details = []
      let abnormalBatch = false
      var abnormalBatchs = []
      this.receiveList.map(item => {
        if (this.abnormalBatchList.indexOf(item.batchNo) !== -1) {
          abnormalBatch = true
          abnormalBatchs.push(item.batchNo)
        }
        details.push({
          batchNo: item.batchNo
        })
      })
      if (abnormalBatch) {
        const batchs = abnormalBatchs.join(',')
        this.$message({
          type: 'error',
          message: `${batchs}批次异常,请先进行异常处理！`
        })
        return false
      }
      const params = {
        creator: sessionStorage.getItem('User-Id'),
        remark: this.jRemarkLeft,
        details
      }
      addDeliver(params).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.fetchData()
        this.transmitDialogVisible = false
      })
    },
    // 拆批数据
    batchDate() {
      this.batchDialogVisible = true
    },
    // 上片确认v1
    v1() {
      if (this.platterNo === '') {
        this.$message({
          type: 'error',
          message: '请输入盘号!'
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
      const keepArr = []
      const withs = []
      const details = []
      this.wafers.map(item => {
        if (item.isActive) {
          keepArr.push(item.name)
          withs.push({
            location: item.name
          })
        }
      })
      var flag = false
      var nums = 0
      this.receiveList.forEach((item, index) => {
        nums += item.upNum
        details.push({
          batchNo: item.batchNo,
          sliceNo: item.upNum,
          startLocation: item.min,
          endLocation: item.max
        })
        keepArr.forEach(num => {
          if (item.min !== item.max) {
            if (num >= item.min && num <= item.max) {
              this.$message({
                type: 'error',
                message: '上片位置与陪片位置重复!'
              })
              flag = true
              return false
            }
          } else {
            if (item.min === num) {
              this.$message({
                type: 'error',
                message: '上片位置与陪片位置重复!'
              })
              flag = true
              return false
            }
          }
        })
        if (index + 1 !== this.receiveList.length) {
          if (this.receiveList[index].max >= this.receiveList[index + 1].min) {
            this.$message({
              type: 'error',
              message: '上片位置不能重复!'
            })
            flag = true
            return false
          }
        }
      })
      if (nums > this.plateNum) {
        this.$message({
          type: 'error',
          message: '上片数超过研磨盘总片数!'
        })
        return false
      }
      if (!flag) {
        const params = {
          creator: this.jOperator,
          details,
          plateNo: this.platterNo,
          remark: this.jRemarkLeft,
          withs
        }
        addUpSlice(params).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.fetchData()
          this.deliverDialogVisible = false
        })
      }
    },
    // 上片确认v2
    handleDeliverDialog() {
      const list = []
      console.log(this.receiveList)
      this.receiveList.forEach((item, index) => {
        const withs = []
        const details = []
        console.log(item.patch)
        if (item.patch !== '' && item.patch !== null) {
          item.patch.split(',').map(location => {
            withs.push({
              location: location
            })
          })
        }
        console.log(item.batchNo)
        item.batchNo.split(',').forEach((batch, batchIndex) => {
          let startLocation = 0
          let endLocation = 0
          for (let i = 0; i <= batchIndex; i++) {
            endLocation += item.rankNum[i].length
          }
          for (let j = 0; j < batchIndex; j++) {
            startLocation += item.rankNum[j].length + 1
          }
          details.push({
            batchNo: batch,
            sliceNo: item.rankNum[batchIndex].join(',').split(',').length,
            rankNum: item.rankNum[batchIndex].join(','),
            startLocation: batchIndex === 0 ? 1 : startLocation,
            endLocation: batchIndex === 0 ? item.rankNum[batchIndex].length : endLocation
          })
        })
        list.push({
          creator: sessionStorage.getItem('User-Id'),
          details,
          plateNo: item.plateNo,
          serialNum: item.serialNum,
          remark: this.jRemarkLeft,
          withs
        })
      })
      console.log(list)
      addUpSlice({ list, platterTypeCode: this.plateCode }).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.fetchData()
        this.deliverDialogVisible = false
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
      this.notFinished = true
      this.min1 = ''
      this.min2 = ''
      this.min3 = ''
      this.min4 = ''
      this.max1 = ''
      this.max2 = ''
      this.max3 = ''
      this.max4 = ''
      this.result = ''
      this.trench = ''
      this.batchNo = ''
      this.target = ''
      this.jRemarkLeft = ''
      this.platterNo = ''
      this.jOperator = ''
      this.batchSize = ''
      this.plateNum = ''
      this.targetHd = ''
      this.plate = ''
      this.plateCode = ''
      this.plateSize = ''
      this.isActive = ''
      this.plateNumAddCode = ''
      this.batchUpNoTotal = 0
      this.receiveList = []
      this.copyReceiveList = []
      this.abnormalBatchList = []
      this.jProcess = this.proceOptions[0].id
      this.jRemark = ''
      this.program = ''
      this.targetDown = ''
      this.targetUp = ''
      this.productModel = ''
      this.decideResult = '请判定'
      this.noPlatter = true
      this.wafers.map(item => {
        item.isActive = false
      })
    },
    handleReplaceClose() {
      this.replaceBatchNo = ''
    },
    // 取消
    resetForm() {
      this.receiveDialogVisible = false
      this.deliverDialogVisible = false
      this.glueDialogVisible = false
      this.grindDialogVisible = false
      this.polishingDialogVisible = false
      this.clearDialogVisible = false
      this.transmitDialogVisible = false
    }
  }
}

