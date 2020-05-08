
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { productList } from '@/api/chipManage/abnormalManage/reworkManage'
import { processList } from '@/api/chipBasicInfoManage/machineInfo'
import { updateAfter } from '@/api/chipManage/abnormalManage/productionAbnormal'
import { getLog, generateBillNo, determine, deleteFile, review, editData, fillInAnalyses, reviewAnalyses, fillInTemporaryStrategy, reviewTemporaryStrategy, qcDistributionDep,
  fillInTemporaryTrace, fillInPerpetualTrace, reviewPerpetualStrategy, reviewTemporaryTrace, fillInPerpetualStrategy, reviewPerpetualTrace, reviewExceptionFinish, fillInExceptionFinish } from '@/api/abnormalBill/abnormalBill'
import { findTree } from '@/api/background/deptManager'
import { userList } from '@/api/chipBasicInfoManage/machineInfo'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      loading: false,
      showDialog: false,
      lsDialog1: false,
      checkDialog: false,
      lsDialog: false,
      text: '',
      beginDate: new Date().getTime(),
      pickerOptionsStart: {
        disabledDate: (time) => {
          const endDateVal = this.endDate
          if (endDateVal) {
            return time.getTime() > Date.now()
          }
        }
      },
      level: '',
      fileUrl: process.env.BASE_API + '/attachment/upload',
      errorLevel: [
        {
          id: 0,
          name: '一般'
        },
        {
          id: 1,
          name: '重大'
        }
      ],
      printDate: '',
      reportNo: '',
      isActivetab: 0,
      isActivetabs: 0,
      rowInfo: null,
      findType: '',
      logList: [],
      productLists: [],
      processList: [],
      model: '',
      process: '',
      processName: '',
      checksNum: '',
      badNum: '',
      badRateVal: '',
      createName: '',
      createId: '',
      createCheck: '',
      createCheckId: '',
      createCheckName: '',
      batchNo: '',
      types: [],
      badContent: '',
      fileList: [],
      fileList1: [],
      fileList2: [],
      fileList3: [],
      fileList4: [],
      fileList5: [],
      fileList6: [],
      analysesDept: [],
      analysesDepts: [],
      uploadFileType: 0,
      treelist: [],
      billInfo: null,
      adeptList: [],
      qcCheck: '',
      qcCheckId: '',
      qcCheckCheckName: '',
      cdeptId: '',
      analysesContent: '',
      anyName: '',
      anyId: '',
      anycheck: '',
      overqc: '',
      num0: 0,
      num1: 0,
      num2: 0,
      num3: 0,
      lstype: '',
      lsObj: {},
      multipleSelection: [],
      list: [],
      lsContent: '',
      lsName: '',
      lsCheckName: '',
      lsCheckType: '',
      lszzContent: '',
      lszzCheckType: '',
      lszzName: '',
      lszzCheckName: '',
      yjName: '',
      yjCheckType: '',
      yjCheckName: '',
      yjCheckTime: '',
      yjdczzContent: '',
      yjdczzName: '',
      yjdczzCheckName: '',
      yjdczzdate: '',
      yjdczzCheck: '',
      overContent: '',
      overCheck: '',
      overName: '',
      overCheckName: '',
      height0: 0,
      height1: 0,
      yjdcDisable: false,
      qtContent: '',
      hrefs: ''
    }
  },
  mounted() {
    this.printDate = this.getCurrentTime()
    this.productList()
    const info = sessionStorage.getItem('errorRowInfo')
    this.cdeptId = sessionStorage.getItem('deptIds')
    if (info === undefined || info === null) {
      const addAbnormalBill = sessionStorage.getItem('addAbnormalBill')
      this.findType = 0
      this.generateBillNo()
      this.createId = parseInt(sessionStorage.getItem('User-Id'))
      userList().then(res => {
        for (const item of res.data.list) {
          if (item.id === this.createId) {
            this.createName = item.name
          }
        }
      })
      this.href = window.location.href.substring(window.location.href.lastIndexOf('/') + 1)
      if (addAbnormalBill !== null) {
        this.billInfo = JSON.parse(addAbnormalBill)
        if (this.href === 'addAbnormalBillxp') {
          const wafers = []
          for (const items of this.billInfo.details) {
            wafers.push(items.waferNo)
          }
          this.badContent = wafers.join()
          this.badNum = wafers.length
          if (this.billInfo.row !== undefined) {
            this.batchNo = this.billInfo.row.batchNo
            this.model = this.billInfo.row.productCode
            this.process = this.billInfo.row.detectionProcess
          } else {
            this.process = this.billInfo.process
            this.model = this.billInfo.model
          }
        }
      }
    } else {
      const bill = JSON.parse(info)
      this.findType = bill.findType
      this.billInfo = bill
      this.reportNo = this.billInfo.rowInfo.billNo
      if (this.billInfo.rowInfo.qtContent !== null) {
        this.qtContent = this.billInfo.rowInfo.qtContent
      }
      const reg = new RegExp('-', 'g')
      const str1 = this.billInfo.rowInfo.createTime.replace(reg, '/')
      this.beginDate = new Date(str1)
      this.level = this.billInfo.rowInfo.grade
      this.batchNo = this.billInfo.rowInfo.batchNo
      this.process = this.billInfo.rowInfo.process
      this.checksNum = this.billInfo.rowInfo.checksNum
      this.badNum = this.billInfo.rowInfo.badNum
      this.badRateVal = this.billInfo.rowInfo.badRateVal
      this.model = this.billInfo.rowInfo.model
      const types = this.billInfo.rowInfo.type.split(',')
      this.types = []
      for (const item of types) {
        this.types.push(parseInt(item))
      }
      this.badContent = this.billInfo.rowInfo.badContent
      this.createName = this.billInfo.rowInfo.creatorName
      this.createId = this.billInfo.rowInfo.creator
      if (this.billInfo.rowInfo.files !== null) {
        this.fileList = this.billInfo.rowInfo.files
      }
      if (this.findType === 1) {
        this.createCheckId = parseInt(sessionStorage.getItem('User-Id'))
        userList().then(res => {
          for (const item of res.data.list) {
            if (item.id === this.createCheckId) {
              this.createCheckName = item.name
            }
          }
        })
      } else {
        this.createCheckId = this.billInfo.rowInfo.auditor
        this.createCheckName = this.billInfo.rowInfo.auditorName
      }
      if (this.findType === 2) {
        this.qcCheckId = parseInt(sessionStorage.getItem('User-Id'))
        userList().then(res => {
          for (const item of res.data.list) {
            if (item.id === this.qcCheckId) {
              this.qcCheckCheckName = item.name
            }
          }
        })
      }
      if (this.findType > 2) {
        this.anyId = parseInt(sessionStorage.getItem('User-Id'))
        userList().then(res => {
          for (const item of res.data.list) {
            if (item.id === this.anyId) {
              this.anyName = item.name
            }
          }
          if (this.billInfo.rowInfo.resultDetails.exceptionFinish === null) {
            this.overName = this.anyName
          }
          for (let i = 0; i < this.billInfo.rowInfo.resultDetails.analyses.length; i++) {
            if (this.findType === 3) {
              this.billInfo.rowInfo.resultDetails.analyses[this.isActivetab].creatorName = this.anyName
            } else if (this.findType === 4) {
              this.billInfo.rowInfo.resultDetails.analyses[this.isActivetab].auditorName = this.anyName
            }
          }
        })
      }
      if (this.billInfo.rowInfo.resultDetails.analyses !== null && this.billInfo.rowInfo.resultDetails.analyses.length > 0 && this.billInfo.rowInfo.resultDetails.analyses[0].files !== null) {
        this.fileList1 = this.billInfo.rowInfo.resultDetails.analyses[0].files
      }
      if (this.findType === 15) {
        userList().then(res => {
          const id = parseInt(sessionStorage.getItem('User-Id'))
          for (const item of res.data.list) {
            if (item.id === id) {
              this.overCheckName = item.name
            }
          }
        })
      }
      if (this.billInfo.rowInfo.resultDetails.exceptionFinish !== null) {
        this.overName = this.billInfo.rowInfo.resultDetails.exceptionFinish.creatorName
        if (this.billInfo.rowInfo.resultDetails.exceptionFinish.auditor === null) {
          this.overCheckName = this.anyName
        } else {
          this.overCheckName = this.billInfo.rowInfo.resultDetails.exceptionFinish.auditorName
        }
        this.overContent = this.billInfo.rowInfo.resultDetails.exceptionFinish.content
        this.overqc = this.billInfo.rowInfo.resultDetails.exceptionFinish.result
      }
      if (this.billInfo.rowInfo.resultDetails.perpetualStrategy.length > 0) {
        this.yjName = this.billInfo.rowInfo.resultDetails.perpetualStrategy[this.isActivetabs].creatorName
        this.yjCheckName = this.billInfo.rowInfo.resultDetails.perpetualStrategy[this.isActivetabs].auditorName
        if (this.billInfo.rowInfo.resultDetails.perpetualStrategy[this.isActivetabs].auditTime !== null) {
          const reg = new RegExp('-', 'g')
          const str1 = this.billInfo.rowInfo.resultDetails.perpetualStrategy[this.isActivetabs].auditTime.replace(reg, '/')
          this.yjCheckTime = new Date(str1)
        }
        if (this.billInfo.rowInfo.resultDetails.perpetualStrategy[this.isActivetabs].files !== null) {
          this.fileList4 = this.billInfo.rowInfo.resultDetails.perpetualStrategy[this.isActivetabs].files
        }
        for (const item of this.billInfo.rowInfo.resultDetails.waferDetails) {
          if (this.lsObj[0] === undefined) {
            this.lsObj[0] = []
          }
          if (this.lsObj[1] === undefined) {
            this.lsObj[1] = []
          }
          if (this.lsObj[2] === undefined) {
            this.lsObj[2] = []
          }
          if (this.lsObj[3] === undefined) {
            this.lsObj[3] = []
          }
          if (item.temporaryPlan === 0) {
            this.num0 = this.num0 + 1
            this.lsObj[0].push({
              id: item.id,
              batchNo: this.billInfo.rowInfo.billNo,
              waferNo: item.waferNo,
              types: '返工'
            })
          } else if (item.temporaryPlan === 1) {
            this.num1 = this.num1 + 1
            this.lsObj[1].push({
              id: item.id,
              batchNo: this.billInfo.rowInfo.billNo,
              waferNo: item.waferNo,
              types: '报废'
            })
          } else if (item.temporaryPlan === 2) {
            this.num2 = this.num2 + 1
            this.lsObj[2].push({
              id: item.id,
              batchNo: this.billInfo.rowInfo.billNo,
              waferNo: item.waferNo,
              types: '降级'
            })
          } else if (item.temporaryPlan === 3) {
            this.num3 = this.num3 + 1
            this.lsObj[3].push({
              id: item.id,
              batchNo: this.billInfo.rowInfo.billNo,
              waferNo: item.waferNo,
              types: '其他'
            })
          }
        }
      }
      if (this.billInfo.rowInfo.resultDetails.temporaryStrategy !== null) {
        this.lsContent = this.billInfo.rowInfo.resultDetails.temporaryStrategy.content
        this.lsName = this.billInfo.rowInfo.resultDetails.temporaryStrategy.creatorName
        this.lsCheckName = this.billInfo.rowInfo.resultDetails.temporaryStrategy.auditorName
        if (this.billInfo.rowInfo.resultDetails.temporaryStrategy.files !== null) {
          this.fileList2 = this.billInfo.rowInfo.resultDetails.temporaryStrategy.files
        }
      }
      if (this.billInfo.rowInfo.resultDetails.temporaryTrace !== null) {
        this.lszzContent = this.billInfo.rowInfo.resultDetails.temporaryTrace.content
        if (this.billInfo.rowInfo.resultDetails.temporaryTrace.files !== null) {
          this.fileList3 = this.billInfo.rowInfo.resultDetails.temporaryTrace.files
        }
        this.lszzName = this.billInfo.rowInfo.resultDetails.temporaryTrace.creatorName
        this.lszzCheckName = this.billInfo.rowInfo.resultDetails.temporaryTrace.auditorName
      }
      if (this.billInfo.rowInfo.resultDetails.perpetualTrace !== null) {
        this.yjdczzContent = this.billInfo.rowInfo.resultDetails.perpetualTrace.content
        if (this.billInfo.rowInfo.resultDetails.perpetualTrace.files !== null) {
          this.fileList5 = this.billInfo.rowInfo.resultDetails.perpetualTrace.files
        }
        this.yjdczzName = this.billInfo.rowInfo.resultDetails.perpetualTrace.creatorName
        this.yjdczzCheckName = this.billInfo.rowInfo.resultDetails.perpetualTrace.auditorName
        if (this.billInfo.rowInfo.resultDetails.perpetualTrace.auditTime !== null) {
          const reg = new RegExp('-', 'g')
          const str1 = this.billInfo.rowInfo.resultDetails.perpetualTrace.auditTime.replace(reg, '/')
          this.yjdczzdate = new Date(str1)
        }
      }
      if (this.billInfo.rowInfo.resultDetails.exceptionFinish !== null) {
        if (this.billInfo.rowInfo.resultDetails.exceptionFinish.files !== null) {
          this.fileList6 = this.billInfo.rowInfo.resultDetails.exceptionFinish.files
        }
      }
      if (this.fileList4.length > this.fileList5.length) {
        this.height1 = 26 * this.fileList4.length
      } else if (this.fileList5.length !== 0) {
        this.height1 = 26 * this.fileList5.length
      } else {
        this.height1 = 26
      }
      if (this.fileList2.length > this.fileList3.length) {
        this.height0 = 26 * this.fileList2.length
      } else if (this.fileList3.length !== 0) {
        this.height0 = 26 * this.fileList3.length
      } else {
        this.height0 = 26
      }
      if (this.billInfo.rowInfo.resultDetails.perpetualStrategy !== null) {
        for (const item of this.billInfo.rowInfo.resultDetails.perpetualStrategy) {
          if (item.review === 0 || item.review === null) {
            this.yjdcDisable = true
            break
          }
        }
      }
      if (this.findType === 6) {
        userList().then(res => {
          const id = parseInt(sessionStorage.getItem('User-Id'))
          for (const item of res.data.list) {
            if (item.id === id) {
              this.lsName = item.name
            }
          }
          for (const item of this.billInfo.rowInfo.resultDetails.perpetualStrategy) {
            if (item.review === 0 || item.review === null) {
              this.yjdcDisable = true
              break
            }
          }
          if (!this.yjdcDisable) {
            if (this.yjdczzName !== '' && this.yjdczzName !== null && this.yjdczzName !== this.lsName) {
              this.yjdcDisable = true
            } else if (this.billInfo.rowInfo.resultDetails.perpetualTrace !== null && this.billInfo.rowInfo.resultDetails.perpetualTrace.review === 1) {
              this.yjdcDisable = true
            }
            if (this.yjdczzName === '' && this.yjdczzName === null && !this.yjdcDisable) {
              this.yjdczzName = this.lsName
            }
          }
        })
      }
      if (this.findType === 7) {
        userList().then(res => {
          const id = parseInt(sessionStorage.getItem('User-Id'))
          for (const item of res.data.list) {
            if (item.id === id) {
              this.lsCheckName = item.name
            }
          }
        })
      }
      if (this.findType === 8) {
        userList().then(res => {
          const id = parseInt(sessionStorage.getItem('User-Id'))
          for (const item of res.data.list) {
            if (item.id === id) {
              this.lszzName = item.name
            }
          }
          for (const item of this.billInfo.rowInfo.resultDetails.perpetualStrategy) {
            if (item.review === 0) {
              this.yjdcDisable = false
              break
            }
          }
          if (!this.yjdcDisable) {
            if (this.yjdczzName !== '' && this.yjdczzName !== null && this.yjdczzName !== this.lsName) {
              this.yjdcDisable = true
            } else if (this.billInfo.rowInfo.resultDetails.perpetualTrace !== null && this.billInfo.rowInfo.resultDetails.perpetualTrace.review === 1) {
              this.yjdcDisable = true
            }
            if (this.yjdczzName === '' && this.yjdczzName === null && !this.yjdcDisable) {
              this.yjdczzName = this.lsName
            }
          }
        })
      }
      if (this.findType === 9) {
        userList().then(res => {
          const id = parseInt(sessionStorage.getItem('User-Id'))
          for (const item of res.data.list) {
            if (item.id === id) {
              this.lszzCheckName = item.name
            }
          }
        })
      }
      if (this.findType === 10) {
        userList().then(res => {
          const id = parseInt(sessionStorage.getItem('User-Id'))
          for (const item of res.data.list) {
            if (item.id === id) {
              this.yjName = item.name
            }
          }
        })
      }
      if (this.findType === 11) {
        this.yjCheckTime = new Date()
        userList().then(res => {
          const id = parseInt(sessionStorage.getItem('User-Id'))
          for (const item of res.data.list) {
            if (item.id === id) {
              this.yjCheckName = item.name
            }
          }
        })
      }
      if (this.findType === 12) {
        userList().then(res => {
          const id = parseInt(sessionStorage.getItem('User-Id'))
          for (const item of res.data.list) {
            if (item.id === id) {
              this.yjdczzName = item.name
            }
          }
        })
      }
      if (this.findType === 13) {
        this.yjdczzdate = new Date()
        userList().then(res => {
          const id = parseInt(sessionStorage.getItem('User-Id'))
          for (const item of res.data.list) {
            if (item.id === id) {
              this.yjdczzCheckName = item.name
            }
          }
        })
      }
    }
    this.processListpage()
    this.findTree()
  },
  methods: {
    beforeUpload(file) {
      this.uploadFileType = 0
      this.loading = true
      const isLt2M = file.size / 1024 / 1024 < 20
      if (this.fileList.length > 2) {
        this.$message({
          message: '文件不能超过3个!',
          type: 'error'
        })
        this.loading = false
        return false
      }
      if (!isLt2M) {
        this.$message({
          message: '文件大小不能超过 20MB!',
          type: 'error'
        })
        this.loading = false
        return false
      }
      return isLt2M
    },
    beforeUpload1(file) {
      this.uploadFileType = 1
      this.loading = true
      const isLt2M = file.size / 1024 / 1024 < 20
      if (this.fileList1.length > 2) {
        this.$message({
          message: '文件不能超过3个!',
          type: 'error'
        })
        this.loading = false
        return false
      }
      if (!isLt2M) {
        this.$message({
          message: '文件大小不能超过 20MB!',
          type: 'error'
        })
        this.loading = false
        return false
      }
      return isLt2M
    },
    beforeUpload2(file) {
      this.uploadFileType = 2
      this.loading = true
      const isLt2M = file.size / 1024 / 1024 < 20
      if (this.fileList2.length > 2) {
        this.$message({
          message: '文件不能超过3个!',
          type: 'error'
        })
        this.loading = false
        return false
      }
      if (!isLt2M) {
        this.$message({
          message: '文件大小不能超过 20MB!',
          type: 'error'
        })
        this.loading = false
        return false
      }
      return isLt2M
    },
    beforeUpload3(file) {
      this.uploadFileType = 3
      this.loading = true
      const isLt2M = file.size / 1024 / 1024 < 20
      if (this.fileList3.length > 2) {
        this.$message({
          message: '文件不能超过3个!',
          type: 'error'
        })
        this.loading = false
        return false
      }
      if (!isLt2M) {
        this.$message({
          message: '文件大小不能超过 20MB!',
          type: 'error'
        })
        this.loading = false
        return false
      }
      return isLt2M
    },
    beforeUpload4(file) {
      this.uploadFileType = 4
      this.loading = true
      const isLt2M = file.size / 1024 / 1024 < 20
      if (this.fileList4.length > 2) {
        this.$message({
          message: '文件不能超过3个!',
          type: 'error'
        })
        this.loading = false
        return false
      }
      if (!isLt2M) {
        this.$message({
          message: '文件大小不能超过 20MB!',
          type: 'error'
        })
        this.loading = false
        return false
      }
      return isLt2M
    },
    beforeUpload5(file) {
      this.uploadFileType = 5
      this.loading = true
      const isLt2M = file.size / 1024 / 1024 < 20
      if (this.fileList5.length > 2) {
        this.$message({
          message: '文件不能超过3个!',
          type: 'error'
        })
        this.loading = false
        return false
      }
      if (!isLt2M) {
        this.$message({
          message: '文件大小不能超过 20MB!',
          type: 'error'
        })
        this.loading = false
        return false
      }
      return isLt2M
    },
    beforeUpload6(file) {
      this.uploadFileType = 6
      this.loading = true
      const isLt2M = file.size / 1024 / 1024 < 20
      if (this.fileList6.length > 2) {
        this.$message({
          message: '文件不能超过3个!',
          type: 'error'
        })
        this.loading = false
        return false
      }
      if (!isLt2M) {
        this.$message({
          message: '文件大小不能超过 20MB!',
          type: 'error'
        })
        this.loading = false
        return false
      }
      return isLt2M
    },
    onSuccess(res, file, fileList) {
      this.loading = false
      if (res.code !== 0) {
        this.$message({
          type: 'error',
          message: res.message
        })
      } else {
        if (this.uploadFileType === 0) {
          this.fileList.push(res.data)
        } else if (this.uploadFileType === 1) {
          this.fileList1.push(res.data)
        } else if (this.uploadFileType === 2) {
          this.fileList2.push(res.data)
          if (this.fileList2.length > this.fileList3.length) {
            this.height0 = 26 * this.fileList2.length
          } else {
            this.height0 = 26 * this.fileList3.length
          }
        } else if (this.uploadFileType === 3) {
          this.fileList3.push(res.data)
          if (this.fileList2.length > this.fileList3.length) {
            this.height0 = 26 * this.fileList2.length
          } else {
            this.height0 = 26 * this.fileList3.length
          }
        } else if (this.uploadFileType === 4) {
          this.fileList4.push(res.data)
          if (this.fileList4.length > this.fileList5.length) {
            this.height1 = 26 * this.fileList4.length
          } else {
            this.height1 = 26 * this.fileList5.length
          }
        } else if (this.uploadFileType === 5) {
          this.fileList5.push(res.data)
          if (this.fileList4.length > this.fileList5.length) {
            this.height1 = 26 * this.fileList4.length
          } else {
            this.height1 = 26 * this.fileList5.length
          }
        } else if (this.uploadFileType === 6) {
          this.fileList6.push(res.data)
        }
        this.$message({
          type: 'success',
          message: '上传成功'
        })
      }
    },
    onError() {
      this.$message({
        type: 'error',
        message: '上传失败，请重试！'
      })
      this.loading = false
    },
    getCurrentTime() {
      var date = new Date()
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '/' + m.substring(m.length - 2, m.length) + '/' + d.substring(d.length - 2, d.length)
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
    formatDates(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      var h = '0' + date.getHours()
      var s = '0' + date.getMinutes()
      var ss = '0' + date.getSeconds()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length) + ' ' + h.substring(h.length - 2, h.length) + ':' + s.substring(s.length - 2, s.length) + ':' + ss.substring(ss.length - 2, ss.length)
    },
    prints() {
      this.$print(this.$refs.prints)
    },
    viewDetailCard() {
      this.showDialog = true
      const params = {
        abnormalId: this.billInfo.rowInfo.id
      }
      getLog(params).then(res => {
        if (res.code === 0) {
          this.logList = res.data
        }
      })
    },
    generateBillNo() {
      generateBillNo().then(res => {
        if (res.code === 0) {
          this.reportNo = res.data
        }
      })
    },
    processListpage() {
      const params = {
        pageNum: 1,
        pageSize: 100000
      }
      processList(params).then(res => {
        this.processList = res.data.list
        for (const item of this.processList) {
          if (item.id === this.process) {
            this.processName = item.name
            break
          }
        }
      })
    },
    productList() {
      productList().then(res => {
        this.productLists = res.data
      })
    },
    badRate() {
      const num = new RegExp('^-?\\d+$')
      if (this.checksNum !== '') {
        if (!num.test(this.checksNum)) {
          this.$message({
            type: 'error',
            message: '抽检数必须为正整数!'
          })
          this.checksNum = ''
          return
        }
      }
      if (this.badNum !== '') {
        if (!num.test(this.badNum)) {
          this.$message({
            type: 'error',
            message: '不良数必须为正整数!'
          })
          this.badNum = ''
          return
        }
      }
      if (this.badNum !== '' && this.checksNum !== '') {
        if (parseInt(this.badNum) > parseInt(this.checksNum)) {
          this.$message({
            type: 'error',
            message: '不良数不能大于抽检数!'
          })
          this.badNum = ''
          this.badRateVal = ''
          return
        }
        this.badRateVal = (parseFloat(this.badNum) / parseFloat(this.checksNum) * 100).toFixed(2) + '%'
      }
    },
    findTree() {
      const params = {
        code: '',
        name: ''
      }
      findTree(params).then(res => {
        if (res.code === 0) {
          this.treelist = res.data
          if (this.billInfo.rowInfo !== undefined) {
            let depts = []
            if (this.billInfo.rowInfo.responsibleDept !== undefined && this.billInfo.rowInfo.responsibleDept !== null) {
              depts = this.billInfo.rowInfo.responsibleDept.split(',')
            }
            this.analysesDept = []
            this.analysesDepts = []
            this.adeptList = []
            for (const item of this.treelist) {
              // if (item.name === this.billInfo.rowInfo.applicationSector) {
              //   this.cdeptId = item.id
              // }
              for (let i = 0; i < this.billInfo.rowInfo.resultDetails.analyses.length; i++) {
                if (item.id === this.billInfo.rowInfo.resultDetails.analyses[i].departmentId) {
                  this.billInfo.rowInfo.resultDetails.analyses[i].name = item.name
                  break
                }
              }
              for (let i = 0; i < this.billInfo.rowInfo.resultDetails.perpetualStrategy.length; i++) {
                if (item.id === this.billInfo.rowInfo.resultDetails.perpetualStrategy[i].departmentId) {
                  this.billInfo.rowInfo.resultDetails.perpetualStrategy[i].name = item.name
                  break
                }
              }
            }
            for (const dept of depts) {
              if (dept === '外延部') {
                this.analysesDept.push(0)
                this.analysesDepts.push(0)
              } else if (dept === '芯片部') {
                this.analysesDept.push(1)
                this.analysesDepts.push(1)
              } else if (dept === '厂务部') {
                this.analysesDept.push(2)
                this.analysesDepts.push(2)
              } else if (dept === '采购部') {
                this.analysesDept.push(3)
                this.analysesDepts.push(3)
              } else if (dept === '技术部') {
                this.analysesDept.push(4)
                this.analysesDepts.push(4)
              } else if (dept === '生产管理部') {
                this.analysesDept.push(5)
                this.analysesDepts.push(5)
              }
            }
          }
        }
      })
    },
    save() {
      if (this.findType > 1 && this.overqc !== '' && this.overqc !== null) {
        if (this.findType === 15) {
          if (this.overCheck === '') {
            this.$message({
              type: 'error',
              message: '请选择是否审核通过!'
            })
            return
          }
          const params = {
            abnormalId: this.billInfo.rowInfo.id,
            auditor: sessionStorage.getItem('User-Id'),
            review: this.overCheck,
            reviewDeptId: this.cdeptId,
            id: this.billInfo.rowInfo.resultDetails.exceptionFinish.id
          }
          reviewExceptionFinish(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '保存成功!'
              })
              this.$router.back(-1)
            }
          })
        } else {
          this.$confirm('是否确定结案?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const files = []
            for (const item of this.fileList6) {
              files.push(item.dataId)
            }
            const params = {
              abnormalId: this.billInfo.rowInfo.id,
              creator: sessionStorage.getItem('User-Id'),
              content: this.overContent,
              filePathId: files.join(),
              fillInDeptId: this.cdeptId,
              result: this.overqc
            }
            fillInExceptionFinish(params).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '保存成功!'
                })
                this.$router.back(-1)
              }
            })
          })
        }
      } else {
        if (this.findType === 0) {
          if (this.beginDate === '') {
            this.$message({
              type: 'error',
              message: '请输入日期!'
            })
            return
          }
          if (this.level === '') {
            this.$message({
              type: 'error',
              message: '请选择异常等级!'
            })
            return
          }
          // if (this.model === '') {
          //   this.$message({
          //     type: 'error',
          //     message: '请选择型号!'
          //   })
          //   return
          // }
          // if (this.batchNo === '') {
          //   this.$message({
          //     type: 'error',
          //     message: '请输入批号!'
          //   })
          //   return
          // }
          // if (this.process === '') {
          //   this.$message({
          //     type: 'error',
          //     message: '请选择异常工序!'
          //   })
          //   return
          // }
          // if (this.checksNum === '') {
          //   this.$message({
          //     type: 'error',
          //     message: '请输入抽检数!'
          //   })
          //   return
          // }
          // if (this.badNum === '') {
          //   this.$message({
          //     type: 'error',
          //     message: '请输入不良数!'
          //   })
          //   return
          // }
          if (this.types.length === 0) {
            this.$message({
              type: 'error',
              message: '请选择异常类型!'
            })
            return
          }
          if (this.badContent === '') {
            this.$message({
              type: 'error',
              message: '请输入异常描述!'
            })
            return
          }
          if (this.analysesDept === undefined || this.analysesDept === null || this.analysesDept.length === 0) {
            this.$message({
              type: 'error',
              message: '请选择责任部门!'
            })
            return
          }
          const files = []
          for (const item of this.fileList) {
            files.push(item.dataId)
          }
          const depts = []
          for (const item of this.analysesDept) {
            for (const dept of this.treelist) {
              if (item === 0 && dept.name === '外延部') {
                depts.push({ departmentId: dept.id })
                break
              } else if (item === 1 && dept.name === '芯片部') {
                depts.push({ departmentId: dept.id })
                break
              } else if (item === 2 && dept.name === '厂务部') {
                depts.push({ departmentId: dept.id })
                break
              } else if (item === 3 && dept.name === '采购部') {
                depts.push({ departmentId: dept.id })
                break
              } else if (item === 4 && dept.name === '技术部') {
                depts.push({ departmentId: dept.id })
                break
              } else if (item === 5 && dept.name === '生产管理部') {
                depts.push({ departmentId: dept.id })
                break
              }
            }
          }
          if (depts.length === 0) {
            this.$message({
              type: 'error',
              message: '请选择责任部门!'
            })
            return
          }
          if (this.billInfo.rowInfo !== undefined) {
            const params = {
              id: this.billInfo.rowInfo.id,
              grade: this.level,
              createTime: this.formatDates(this.beginDate),
              badNum: this.badNum,
              badRate: this.badRateVal === '--' ? null : this.badRateVal.substring(0, this.badRateVal.length - 1),
              badContent: this.badContent,
              checksNum: this.checksNum,
              type: this.types.join(),
              filePathId: files.join(),
              applicationSector: this.cdeptId,
              creator: this.createId,
              analyses: depts,
              strategies: depts,
              qtContent: this.qtContent
            }
            editData(params).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '保存成功!'
                })
                this.$router.back(-1)
              }
            })
          } else {
            const params = {
              resultKey: 3,
              record: {
                billNo: this.reportNo,
                createTime: this.formatDates(this.beginDate),
                creator: this.createId,
                applicationSector: this.cdeptId,
                grade: this.level,
                type: this.types.join(),
                model: this.model === '' ? '--' : this.model,
                batchNo: this.batchNo === '' ? '--' : this.batchNo,
                process: this.process === '' ? '--' : this.process,
                checksNum: this.checksNum,
                badNum: this.badNum,
                badRate: this.badRateVal === '--' ? null : this.badRateVal.substring(0, this.badRateVal.length - 1),
                badContent: this.badContent,
                details: this.billInfo.details,
                analyses: depts,
                strategies: depts,
                filePathId: files.join(),
                ifQcBill: this.href === 'addAbnormalBill' ? 1 : '',
                qtContent: this.qtContent,
                oldBatchNo: this.billInfo.row === undefined ? '' : this.billInfo.row.batchNo
              }
            }
            determine(params).then(res => {
              if (res.code === 0) {
                if (this.href === 'addAbnormalBillxp' && this.billInfo.row === undefined) {
                  const ids = []
                  for (const item of this.billInfo.details) {
                    ids.push(item.id)
                  }
                  updateAfter({
                    id: ids.join(),
                    result: 3,
                    auditor: sessionStorage.getItem('User-Id')
                  }).then(res => {
                    if (res.code === 0) {
                      this.$message({
                        type: 'success',
                        message: '提交成功!'
                      })
                      this.$router.back(-2)
                    }
                  })
                } else {
                  this.$message({
                    type: 'success',
                    message: '保存成功!'
                  })
                  this.$router.back(-2)
                }
              }
            })
          }
        } else if (this.findType === 1) {
          if (this.createCheck === '') {
            this.$message({
              type: 'error',
              message: '请选择是否审核通过!'
            })
            return
          }
          const params = {
            id: this.billInfo.rowInfo.id,
            type: 0,
            status: this.createCheck,
            auditor: sessionStorage.getItem('User-Id'),
            deptId: this.cdeptId,
            abnormalId: this.billInfo.rowInfo.id
          }
          review(params).then(res => {
            if (res.code === 0) {
              if (this.billInfo.rowInfo.applicationSector === '品保部' && this.createCheck === 0) {
                const params = {
                  id: this.billInfo.rowInfo.id,
                  type: 1,
                  status: 0,
                  auditor: sessionStorage.getItem('User-Id'),
                  deptId: this.cdeptId,
                  abnormalId: this.billInfo.rowInfo.id
                }
                review(params).then(res => {
                  if (res.code === 0) {
                    this.$message({
                      type: 'success',
                      message: '审核成功!'
                    })
                    this.$router.back(-1)
                  }
                })
              } else {
                this.$message({
                  type: 'success',
                  message: '审核成功!'
                })
                this.$router.back(-1)
              }
            }
          })
        } else if (this.findType === 3) {
          if (this.billInfo.rowInfo.resultDetails.analyses[this.isActivetab].content.trim().length === 0) {
            this.$message({
              type: 'error',
              message: '请填写原因分析!'
            })
            return
          }
          if (this.billInfo.rowInfo.resultDetails.perpetualStrategy[this.isActivetabs].content !== null && this.billInfo.rowInfo.resultDetails.perpetualStrategy[this.isActivetabs].content.trim().length !== 0) {
            const files = []
            for (const item of this.fileList4) {
              files.push(item.dataId)
            }
            const params = {
              abnormalId: this.billInfo.rowInfo.id,
              content: this.billInfo.rowInfo.resultDetails.perpetualStrategy[this.isActivetabs].content,
              creator: sessionStorage.getItem('User-Id'),
              filePathId: files.join(),
              fillInDeptId: this.cdeptId,
              id: this.billInfo.rowInfo.resultDetails.perpetualStrategy[this.isActivetab].id
            }
            fillInPerpetualStrategy(params).then(res => {
              if (res.code === 0) {
                console.log(213)
              }
            })
          }
          const files = []
          for (const item of this.fileList1) {
            files.push(item.dataId)
          }
          const params = {
            abnormalId: this.billInfo.rowInfo.id,
            content: this.billInfo.rowInfo.resultDetails.analyses[this.isActivetab].content,
            departmentId: this.cdeptId,
            filePathId: files.join(),
            creator: sessionStorage.getItem('User-Id'),
            id: this.billInfo.rowInfo.resultDetails.analyses[this.isActivetab].id
          }
          fillInAnalyses(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '保存成功!'
              })
              this.$router.back(-1)
            }
          })
        } else if (this.findType === 4) {
          if (this.anycheck === '') {
            this.$message({
              type: 'error',
              message: '请选择是否审核通过!'
            })
            return
          }
          const params = {
            type: 0,
            status: this.anycheck,
            reviewer: sessionStorage.getItem('User-Id'),
            reviewDeptId: this.cdeptId,
            analysesId: this.billInfo.rowInfo.resultDetails.analyses[this.isActivetab].id,
            abnormalId: this.billInfo.rowInfo.id,
            deptIds: this.billInfo.rowInfo.resultDetails.analyses[this.isActivetab].departmentId
          }
          reviewAnalyses(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '保存成功!'
              })
              this.$router.back(-1)
            }
          })
        } else if (this.findType === 5) {
          if (this.analysesDept.length === 0) {
            this.$message({
              type: 'error',
              message: '请选择责任部门!'
            })
            return
          }
          const depts = []
          for (const item of this.analysesDept) {
            let flag = true
            for (const items of this.analysesDepts) {
              if (items === item) {
                flag = false
                break
              }
            }
            if (flag) {
              for (const dept of this.treelist) {
                if (item === 0 && dept.name === '外延部') {
                  depts.push(dept.id)
                  break
                } else if (item === 1 && dept.name === '芯片部') {
                  depts.push(dept.id)
                  break
                } else if (item === 2 && dept.name === '厂务部') {
                  depts.push(dept.id)
                  break
                } else if (item === 3 && dept.name === '采购部') {
                  depts.push(dept.id)
                  break
                } else if (item === 4 && dept.name === '技术部') {
                  depts.push(dept.id)
                  break
                } else if (item === 5 && dept.name === '生产管理部') {
                  depts.push(dept.id)
                  break
                }
              }
            }
          }
          if (depts.length === 0) {
            this.$message({
              type: 'success',
              message: '保存成功!'
            })
            this.$router.back(-1)
          } else {
            const params = {
              abnormalId: this.billInfo.rowInfo.id,
              deptIds: depts.join()
            }
            qcDistributionDep(params).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '保存成功!'
                })
                this.$router.back(-1)
              }
            })
          }
        } else if (this.findType === 6) {
          if (this.lsContent.trim().length === 0) {
            this.$message({
              type: 'error',
              message: '请填写临时对策!'
            })
            return
          }
          const dealDetails = []
          if (this.lsObj[0] !== undefined) {
            for (const obj of this.lsObj[0]) {
              dealDetails.push({
                id: obj.id,
                temporaryPlan: 0
              })
            }
          }
          if (this.lsObj[1] !== undefined) {
            for (const obj of this.lsObj[1]) {
              dealDetails.push({
                id: obj.id,
                temporaryPlan: 1
              })
            }
          }
          if (this.lsObj[2] !== undefined) {
            for (const obj of this.lsObj[2]) {
              dealDetails.push({
                id: obj.id,
                temporaryPlan: 2
              })
            }
          }
          if (this.lsObj[3] !== undefined) {
            for (const obj of this.lsObj[3]) {
              dealDetails.push({
                id: obj.id,
                temporaryPlan: 3
              })
            }
          }
          if (dealDetails.length === 0 && this.billInfo.rowInfo.resultDetails.waferDetails.length > 0) {
            this.$message({
              type: 'error',
              message: '临时对策判定结果不完整!'
            })
            return
          }
          if (dealDetails.length < this.billInfo.rowInfo.resultDetails.waferDetails.length) {
            this.$message({
              type: 'error',
              message: '临时对策判定结果不完整!'
            })
            return
          }
          if (this.yjdczzContent.trim().length !== 0) {
            const files = []
            for (const item of this.fileList5) {
              files.push(item.dataId)
            }
            const params = {
              abnormalId: this.billInfo.rowInfo.id,
              creator: sessionStorage.getItem('User-Id'),
              content: this.yjdczzContent,
              filePathId: files.join(),
              fillInDeptId: this.cdeptId
            }
            fillInPerpetualTrace(params).then(res => {
              console.log(123)
            })
          }
          const files = []
          for (const item of this.fileList2) {
            files.push(item.dataId)
          }
          const params = {
            abnormalId: this.billInfo.rowInfo.id,
            content: this.lsContent,
            creator: sessionStorage.getItem('User-Id'),
            fillInDeptId: this.cdeptId,
            filePathId: files.join(),
            dealDetails: dealDetails
          }
          fillInTemporaryStrategy(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '保存成功!'
              })
              this.$router.back(-2)
            }
          })
        } else if (this.findType === 7) {
          if (this.lsCheckType === '') {
            this.$message({
              type: 'error',
              message: '请选择是否审核通过!'
            })
            return
          }
          const params = {
            abnormalId: this.billInfo.rowInfo.id,
            auditor: sessionStorage.getItem('User-Id'),
            status: this.lsCheckType,
            reviewDeptId: this.cdeptId,
            strategyId: this.billInfo.rowInfo.resultDetails.temporaryStrategy.id
          }
          reviewTemporaryStrategy(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '保存成功!'
              })
              this.$router.back(-2)
            }
          })
        } else if (this.findType === 8) {
          if (this.lszzContent.trim().length === 0) {
            this.$message({
              type: 'error',
              message: '请填写临时对策追踪!'
            })
            return
          }
          if (this.yjdczzContent.trim().length !== 0) {
            const files = []
            for (const item of this.fileList5) {
              files.push(item.dataId)
            }
            const params = {
              abnormalId: this.billInfo.rowInfo.id,
              creator: sessionStorage.getItem('User-Id'),
              content: this.yjdczzContent,
              filePathId: files.join(),
              fillInDeptId: this.cdeptId
            }
            fillInPerpetualTrace(params).then(res => {
              console.log(123)
            })
          }
          const files = []
          for (const item of this.fileList3) {
            files.push(item.dataId)
          }
          const params = {
            abnormalId: this.billInfo.rowInfo.id,
            creator: sessionStorage.getItem('User-Id'),
            content: this.lszzContent,
            filePathId: files.join(),
            fillInDeptId: this.cdeptId
          }
          fillInTemporaryTrace(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '保存成功!'
              })
              this.$router.back(-2)
            }
          })
        } else if (this.findType === 9) {
          if (this.lszzCheckType === '') {
            this.$message({
              type: 'error',
              message: '请选择是否审核通过!'
            })
            return
          }
          const params = {
            abnormalId: this.billInfo.rowInfo.id,
            auditor: sessionStorage.getItem('User-Id'),
            result: this.lszzCheckType,
            reviewDeptId: this.cdeptId,
            id: this.billInfo.rowInfo.resultDetails.temporaryTrace.id
          }
          reviewTemporaryTrace(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '保存成功!'
              })
              this.$router.back(-2)
            }
          })
        } else if (this.findType === 10) {
          if (this.billInfo.rowInfo.resultDetails.perpetualStrategy[this.isActivetabs].content !== null && this.billInfo.rowInfo.resultDetails.perpetualStrategy[this.isActivetabs].content !== null && this.billInfo.rowInfo.resultDetails.perpetualStrategy[this.isActivetabs].content.trim().length === 0) {
            this.$message({
              type: 'error',
              message: '请填写永久对策!'
            })
            return
          }
          const files = []
          for (const item of this.fileList4) {
            files.push(item.dataId)
          }
          const params = {
            abnormalId: this.billInfo.rowInfo.id,
            content: this.billInfo.rowInfo.resultDetails.perpetualStrategy[this.isActivetabs].content,
            creator: sessionStorage.getItem('User-Id'),
            filePathId: files.join(),
            fillInDeptId: this.cdeptId,
            id: this.billInfo.rowInfo.resultDetails.perpetualStrategy[this.isActivetab].id
          }
          fillInPerpetualStrategy(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '保存成功!'
              })
              this.$router.back(-1)
            }
          })
        } else if (this.findType === 11) {
          if (this.yjCheckType === '') {
            this.$message({
              type: 'error',
              message: '请选择是否审核通过!'
            })
            return
          }
          const params = {
            abnormalId: this.billInfo.rowInfo.id,
            auditor: sessionStorage.getItem('User-Id'),
            result: this.yjCheckType,
            reviewDeptId: this.cdeptId,
            id: this.billInfo.rowInfo.resultDetails.perpetualStrategy[this.isActivetabs].id
          }
          reviewPerpetualStrategy(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '保存成功!'
              })
              this.$router.back(-1)
            }
          })
        } else if (this.findType === 12) {
          if (this.yjdczzContent.trim().length === 0) {
            this.$message({
              type: 'error',
              message: '请填写临时对策追踪!'
            })
            return
          }
          const files = []
          for (const item of this.fileList5) {
            files.push(item.dataId)
          }
          const params = {
            abnormalId: this.billInfo.rowInfo.id,
            creator: sessionStorage.getItem('User-Id'),
            content: this.yjdczzContent,
            filePathId: files.join(),
            fillInDeptId: this.cdeptId
          }
          fillInPerpetualTrace(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '保存成功!'
              })
              this.$router.back(-2)
            }
          })
        } else if (this.findType === 13) {
          if (this.yjdczzCheck === '') {
            this.$message({
              type: 'error',
              message: '请选择是否审核通过!'
            })
            return
          }
          const params = {
            abnormalId: this.billInfo.rowInfo.id,
            auditor: sessionStorage.getItem('User-Id'),
            review: this.yjdczzCheck,
            reviewDeptId: this.cdeptId,
            id: this.billInfo.rowInfo.resultDetails.perpetualTrace.id
          }
          reviewPerpetualTrace(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '保存成功!'
              })
              this.$router.back(-2)
            }
          })
        }
      }
    },
    deleteFile(type, id) {
      const params = {
        fileId: '',
        id: '',
        type: ''
      }
      deleteFile(params).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }
      })
    },
    deleteFiles(type, index) {
      if (type === 0) {
        this.fileList.splice(index, 1)
      } else if (type === 1) {
        this.fileList1.splice(index, 1)
      } else if (type === 2) {
        this.fileList2.splice(index, 1)
      } else if (type === 3) {
        this.fileList3.splice(index, 1)
      } else if (type === 4) {
        this.fileList4.splice(index, 1)
      } else if (type === 5) {
        this.fileList5.splice(index, 1)
      } else if (type === 6) {
        this.fileList6.splice(index, 1)
      }
    },
    download(id) {
      window.open(process.env.BASE_API + '/attachment/down?id=' + id)
    },
    openCheck() {
      this.checkDialog = true
    },
    setIfOther() {
      if (this.types.indexOf(4) < 0) {
        this.qtContent = ''
      }
    },
    checkType(type) {
      if (this.findType === 2) {
        const params = {
          id: this.billInfo.rowInfo.id,
          type: 1,
          status: type,
          auditor: sessionStorage.getItem('User-Id'),
          deptId: this.cdeptId,
          abnormalId: this.billInfo.rowInfo.id
        }
        review(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '审核成功!'
            })
            this.$router.back(-1)
          }
        })
      } else if (this.findType === 5) {
        const detps = []
        for (const item of this.billInfo.rowInfo.resultDetails.analyses) {
          detps.push(item.departmentId)
        }
        const analysesId = []
        for (const item of this.billInfo.rowInfo.resultDetails.analyses) {
          analysesId.push(item.id)
        }
        const params = {
          type: 1,
          status: type,
          reviewer: sessionStorage.getItem('User-Id'),
          reviewDeptId: this.cdeptId,
          abnormalId: this.billInfo.rowInfo.id,
          deptIds: type === 0 ? '' : detps.join()
        }
        reviewAnalyses(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '保存成功!'
            })
            this.$router.back(-1)
          }
        })
      }
    },
    tabAry(type) {
      this.isActivetab = type
      if (this.billInfo.rowInfo.resultDetails.analyses !== null) {
        if (this.billInfo.rowInfo.resultDetails.analyses[this.isActivetab].files !== null) {
          this.fileList1 = this.billInfo.rowInfo.resultDetails.analyses[this.isActivetab].files
        } else {
          this.fileList1 = []
        }
      }
    },
    tabArys(type) {
      this.isActivetabs = type
      if (this.billInfo.rowInfo.resultDetails.perpetualStrategy !== null) {
        this.yjName = this.billInfo.rowInfo.resultDetails.perpetualStrategy[this.isActivetabs].creatorName
        this.yjCheckName = this.billInfo.rowInfo.resultDetails.perpetualStrategy[this.isActivetabs].auditorName
        if (this.billInfo.rowInfo.resultDetails.perpetualStrategy[this.isActivetabs].auditTime !== null) {
          const reg = new RegExp('-', 'g')
          const str1 = this.billInfo.rowInfo.resultDetails.perpetualStrategy[this.isActivetabs].auditTime.replace(reg, '/')
          this.yjCheckTime = new Date(str1)
        }
        if (this.billInfo.rowInfo.resultDetails.perpetualStrategy[this.isActivetabs].files !== null) {
          this.fileList4 = this.billInfo.rowInfo.resultDetails.perpetualStrategy[this.isActivetabs].files
        } else {
          this.fileList4 = []
        }
        if (this.fileList4.length > this.fileList5.length) {
          this.height1 = 26 * this.fileList4.length
        } else {
          this.height1 = 26 * this.fileList5.length
        }
      }
    },
    checkList(row) {
      let typs = ''
      if (this.lstype === 0) {
        typs = '返工'
      } else if (this.lstype === 1) {
        typs = '报废'
      } else if (this.lstype === 2) {
        typs = '降级'
      } else if (this.lstype === 3) {
        typs = '其他'
      }
      return (row.types === typs || row.types === '')
    },
    getLStype() {
      this.lsDialog = true
      this.getList()
      const _this = this
      setTimeout(function() {
        let typs = ''
        if (_this.lstype === 0) {
          typs = '返工'
        } else if (_this.lstype === 1) {
          typs = '报废'
        } else if (_this.lstype === 2) {
          typs = '降级'
        } else if (_this.lstype === 3) {
          typs = '其他'
        }
        for (const item of _this.list) {
          if (item.types === typs) {
            _this.$refs.history.toggleRowSelection(item)
          }
        }
      }, 100)
    },
    getLStypes() {
      this.lstype = 5
      this.lsDialog1 = true
      this.getList()
    },
    getList() {
      this.list = []
      for (const item of this.billInfo.rowInfo.resultDetails.waferDetails) {
        let typs = ''
        if (this.lsObj[0] !== undefined) {
          for (const obj of this.lsObj[0]) {
            if (obj.waferNo === item.waferNo) {
              typs = '返工'
              break
            }
          }
        }
        if (this.lsObj[1] !== undefined) {
          for (const obj of this.lsObj[1]) {
            if (obj.waferNo === item.waferNo) {
              typs = '报废'
              break
            }
          }
        }
        if (this.lsObj[2] !== undefined) {
          for (const obj of this.lsObj[2]) {
            if (obj.waferNo === item.waferNo) {
              typs = '降级'
              break
            }
          }
        }
        if (this.lsObj[3] !== undefined) {
          for (const obj of this.lsObj[3]) {
            if (obj.waferNo === item.waferNo) {
              typs = '其他'
              break
            }
          }
        }
        if (item.temporaryPlan === 0) {
          typs = '返工'
        } else if (item.temporaryPlan === 1) {
          typs = '报废'
        } else if (item.temporaryPlan === 2) {
          typs = '降级'
        } else if (item.temporaryPlan === 3) {
          typs = '其他'
        }
        this.list.push({
          id: item.id,
          batchNo: this.billInfo.rowInfo.billNo,
          waferNo: item.waferNo,
          types: typs
        })
        // if (this.lstype === 5) {
        //   if (item.temporaryPlan === 0) {
        //     typs = '返工'
        //   } else if (item.temporaryPlan === 1) {
        //     typs = '报废'
        //   } else if (item.temporaryPlan === 2) {
        //     typs = '降级'
        //   } else if (item.temporaryPlan === 3) {
        //     typs = '其他'
        //   }
        //   this.list.push({
        //     id: item.id,
        //     batchNo: this.billInfo.rowInfo.billNo,
        //     waferNo: item.waferNo,
        //     types: typs
        //   })
        // } else if (this.lstype === 0 && (typs === '' || typs === '返工')) {
        //   this.list.push({
        //     id: item.id,
        //     batchNo: this.billInfo.rowInfo.billNo,
        //     waferNo: item.waferNo,
        //     types: typs
        //   })
        // } else if (this.lstype === 1 && (typs === '' || typs === '报废')) {
        //   this.list.push({
        //     id: item.id,
        //     batchNo: this.billInfo.rowInfo.billNo,
        //     waferNo: item.waferNo,
        //     types: typs
        //   })
        // } else if (this.lstype === 2 && (typs === '' || typs === '降级')) {
        //   this.list.push({
        //     id: item.id,
        //     batchNo: this.billInfo.rowInfo.billNo,
        //     waferNo: item.waferNo,
        //     types: typs
        //   })
        // } else if (this.lstype === 3 && (typs === '' || typs === '其他')) {
        //   this.list.push({
        //     id: item.id,
        //     batchNo: this.billInfo.rowInfo.billNo,
        //     waferNo: item.waferNo,
        //     types: typs
        //   })
        // }
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    saveType() {
      this.lsObj[this.lstype] = this.multipleSelection
      if (this.lstype === 0) {
        this.num0 = this.multipleSelection.length
      } else if (this.lstype === 1) {
        this.num1 = this.multipleSelection.length
      } else if (this.lstype === 2) {
        this.num2 = this.multipleSelection.length
      } else if (this.lstype === 3) {
        this.num3 = this.multipleSelection.length
      }
      this.lsDialog = false
    }
  }
}

