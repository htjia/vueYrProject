
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { xpSpcConfigFind, findProgramByProcessId, save } from '@/api/chipManage/reportManage/spc'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      deleteDialogVisible: false,
      activeTabIndex: 0,
      list: [],
      rowList: [],
      processId: '147,148',
      loopList: [],
      currentId: 0
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    tabClick(index) {
      this.activeTabIndex = index
      if (index === 0) {
        this.processId = '147,148'
      } else if (index === 1) {
        this.processId = '152,153,154,155'
      } else if (index === 2) {
        this.processId = 56
      } else if (index === 3) {
        this.processId = '159,161,162,163,164,165'
      }
      this.fetchData()
    },
    handleEdit(row) {
      this.rowList = []
      this.currentId = row.programId
      if (this.activeTabIndex === 0) {
        this.rowList.push({
          index: row.index,
          startIndex: row.startIndex,
          endIndex: row.endIndex,
          programId: row.programId,
          programName: row.programName,
          programCode: row.programCode,
          group: row.group,
          id: row.id,
          usl: row.usl,
          cl: row.cl,
          lsl: row.lsl,
          ucl: row.ucl,
          lcl: row.lcl,
          mrucl: row.mrucl,
          mrcl: row.mrcl,
          type: row.type,
          sign: row.sign,
          creator: row.creator,
          createTime: row.createTime,
          auditor: row.auditor,
          auditTime: row.auditTime,
          status: row.status,
          createName: row.createName,
          auditorName: row.auditorName,
          controlPragram: row.controlPragram,
          testUnit: row.testUnit
        })
        this.rowList.push({
          index: this.list[row.index].index,
          startIndex: this.list[row.index].startIndex,
          endIndex: this.list[row.index].endIndex,
          programId: this.list[row.index].programId,
          programName: this.list[row.index].programName,
          programCode: this.list[row.index].programCode,
          group: this.list[row.index].group,
          id: this.list[row.index].id,
          usl: this.list[row.index].usl,
          cl: this.list[row.index].cl,
          lsl: this.list[row.index].lsl,
          ucl: this.list[row.index].ucl,
          lcl: this.list[row.index].lcl,
          mrucl: this.list[row.index].mrucl,
          mrcl: this.list[row.index].mrcl,
          type: this.list[row.index].type,
          sign: this.list[row.index].sign,
          creator: this.list[row.index].creator,
          createTime: this.list[row.index].createTime,
          auditor: this.list[row.index].auditor,
          auditTime: this.list[row.index].auditTime,
          status: this.list[row.index].status,
          createName: this.list[row.index].createName,
          auditorName: this.list[row.index].auditorName,
          controlPragram: this.list[row.index].controlPragram,
          testUnit: this.list[row.index].testUnit
        })
      } else {
        this.rowList.push({
          index: row.index,
          programId: row.programId,
          programName: row.programName,
          programCode: row.programCode,
          group: row.group,
          id: row.id,
          usl: row.usl,
          cl: row.cl,
          lsl: row.lsl,
          ucl: row.ucl,
          lcl: row.lcl,
          mrucl: row.mrucl,
          mrcl: row.mrcl,
          type: row.type,
          sign: row.sign,
          creator: row.creator,
          createTime: row.createTime,
          auditor: row.auditor,
          auditTime: row.auditTime,
          status: row.status,
          createName: row.createName,
          auditorName: row.auditorName,
          controlPragram: row.controlPragram,
          testUnit: row.testUnit
        })
      }
      this.addDialogVisible = true
      this.addDialogVisible = true
    },
    // 异常原因合并行
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1 || columnIndex > 10) {
        if (this.activeTabIndex === 0) {
          if (row.sign === 0) {
            return {
              rowspan: 2,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      }
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const param = {
        processId: this.processId
      }
      findProgramByProcessId(param).then(res => {
        this.loopList = []
        let index = 0
        for (const loop of res.data) {
          index = index + 1
          if (this.activeTabIndex === 0) {
            this.loopList.push({
              index: index,
              startIndex: index - 1,
              endIndex: index + 1,
              programId: loop.id,
              programName: loop.name,
              programCode: loop.code,
              group: 1,
              id: 0,
              usl: '',
              cl: '',
              lsl: '',
              ucl: '',
              lcl: '',
              mrucl: '',
              mrcl: '',
              type: '',
              sign: 0,
              creator: '',
              createTime: '',
              auditor: '',
              auditTime: '',
              status: '',
              createName: '',
              auditorName: '',
              controlPragram: '片电阻',
              testUnit: 'Ω/cm2'
            })
            index = index + 1
            this.loopList.push({
              index: index,
              startIndex: index - 1,
              endIndex: index + 1,
              programId: loop.id,
              programName: loop.name,
              programCode: loop.code,
              group: 1,
              id: 0,
              usl: '',
              cl: '',
              lsl: '',
              ucl: '',
              lcl: '',
              mrucl: '',
              mrcl: '',
              type: '',
              sign: 1,
              creator: '',
              createTime: '',
              auditor: '',
              auditTime: '',
              status: '',
              createName: '',
              auditorName: '',
              controlPragram: '透光度',
              testUnit: '%(460nm)'
            })
          } else if (this.activeTabIndex === 1) {
            this.loopList.push({
              index: index,
              programId: loop.id,
              programName: loop.name,
              programCode: loop.code,
              group: 1,
              id: 0,
              usl: '',
              cl: '',
              lsl: '',
              ucl: '',
              lcl: '',
              mrucl: '',
              mrcl: '',
              type: '',
              sign: 0,
              creator: '',
              createTime: '',
              auditor: '',
              auditTime: '',
              status: '',
              createName: '',
              auditorName: '',
              controlPragram: '电极厚度',
              testUnit: '埃（Å）'
            })
          } else if (this.activeTabIndex === 2) {
            this.loopList.push({
              index: index,
              programId: loop.id,
              programName: loop.name,
              programCode: loop.code,
              group: 1,
              id: 0,
              usl: '',
              cl: '',
              lsl: '',
              ucl: '',
              lcl: '',
              mrucl: '',
              mrcl: '',
              type: '',
              sign: 0,
              creator: '',
              createTime: '',
              auditor: '',
              auditTime: '',
              status: '',
              createName: '',
              auditorName: '',
              controlPragram: '刻蚀深度(13#/20#)',
              testUnit: '埃（Å）'
            })
          } else if (this.activeTabIndex === 3) {
            this.loopList.push({
              index: index,
              programId: loop.id,
              programName: loop.name,
              programCode: loop.code,
              group: 1,
              id: 0,
              usl: '',
              cl: '',
              lsl: '',
              ucl: '',
              lcl: '',
              mrucl: '',
              mrcl: '',
              type: '',
              sign: 0,
              creator: '',
              createTime: '',
              auditor: '',
              auditTime: '',
              status: '',
              createName: '',
              auditorName: '',
              controlPragram: 'SiO2厚度',
              testUnit: '埃（Å）'
            })
          }
        }
        const params = {
          type: this.activeTabIndex
        }
        xpSpcConfigFind(params).then(res => {
          this.list = []
          for (const loop of this.loopList) {
            for (const item of res.data) {
              if (item.programId === loop.programId && loop.sign === item.sign) {
                loop.id = item.id
                loop.usl = item.usl
                loop.cl = item.cl
                loop.lsl = item.lsl
                loop.ucl = item.ucl
                loop.lcl = item.lcl
                loop.mrucl = item.mrucl
                loop.mrcl = item.mrcl
                loop.sign = item.sign
                loop.creator = item.creator
                loop.createTime = item.createTime
                loop.auditor = item.auditor
                loop.auditTime = item.auditTime
                loop.status = item.status
                loop.createName = item.createName
                loop.auditorName = item.auditorName
                break
              }
            }
            this.list.push(loop)
          }
          this.listLoading = false
        })
      })
    },
    // 添加提交
    submitForm() {
      const num = /^[0-9]+.?[0-9]*$/
      if (!num.test(this.rowList[0].cl) || !num.test(this.rowList[0].lcl) || !num.test(this.rowList[0].lsl) || !num.test(this.rowList[0].mrcl) || !num.test(this.rowList[0].mrucl) || !num.test(this.rowList[0].ucl) || !num.test(this.rowList[0].usl)) {
        this.$message({
          type: 'error',
          message: '输入内容必须为数字!'
        })
        return
      }
      if (parseFloat(this.rowList[0].lsl) >= parseFloat(this.rowList[0].usl)) {
        this.$message({
          type: 'error',
          message: '规格上限必须大于规格下限!'
        })
        return
      }
      if (parseFloat(this.rowList[0].lsl) >= parseFloat(this.rowList[0].cl) || parseFloat(this.rowList[0].usl) <= parseFloat(this.rowList[0].cl)) {
        this.$message({
          type: 'error',
          message: '规格中心线必须在规格上下限之间!'
        })
        return
      }
      if (parseFloat(this.rowList[0].mrcl) >= parseFloat(this.rowList[0].mrucl)) {
        this.$message({
          type: 'error',
          message: 'MR上限必须大于规格下限!'
        })
        return
      }
      if (parseFloat(this.rowList[0].lcl) >= parseFloat(this.rowList[0].ucl)) {
        this.$message({
          type: 'error',
          message: '控制上限必须大于规格下限!'
        })
        return
      }
      const parmas = [{
        cl: this.rowList[0].cl,
        creator: sessionStorage.getItem('User-Id'),
        lcl: this.rowList[0].lcl,
        lsl: this.rowList[0].lsl,
        mrcl: this.rowList[0].mrcl,
        mrucl: this.rowList[0].mrucl,
        programId: this.rowList[0].programId,
        sign: this.rowList[0].sign,
        type: this.activeTabIndex,
        ucl: this.rowList[0].ucl,
        usl: this.rowList[0].usl
      }]
      if (this.activeTabIndex === 0) {
        if (!num.test(this.rowList[1].cl) || !num.test(this.rowList[1].lcl) || !num.test(this.rowList[1].lsl) || !num.test(this.rowList[1].mrcl) || !num.test(this.rowList[1].mrucl) || !num.test(this.rowList[1].ucl) || !num.test(this.rowList[1].usl)) {
          this.$message({
            type: 'error',
            message: '输入内容必须为数字!'
          })
          return
        }
        if (parseFloat(this.rowList[1].lsl) > 100 || parseFloat(this.rowList[1].lcl) > 100 || parseFloat(this.rowList[1].mrcl) > 100 || parseFloat(this.rowList[1].mrucl) > 100 || parseFloat(this.rowList[1].ucl) > 100 || parseFloat(this.rowList[1].usl) > 100) {
          this.$message({
            type: 'error',
            message: '透光度不得超过100%!'
          })
          return
        }
        if (parseFloat(this.rowList[1].lsl) >= parseFloat(this.rowList[1].usl)) {
          this.$message({
            type: 'error',
            message: '规格上限必须大于规格下限!'
          })
          return
        }
        if (parseFloat(this.rowList[1].lsl) >= parseFloat(this.rowList[1].cl) || parseFloat(this.rowList[1].usl) <= parseFloat(this.rowList[1].cl)) {
          this.$message({
            type: 'error',
            message: '规格中心线必须在规格上下限之间!'
          })
          return
        }
        if (parseFloat(this.rowList[1].mrcl) >= parseFloat(this.rowList[1].mrucl)) {
          this.$message({
            type: 'error',
            message: 'MR上限必须大于规格下限!'
          })
          return
        }
        if (parseFloat(this.rowList[1].lcl) >= parseFloat(this.rowList[1].ucl)) {
          this.$message({
            type: 'error',
            message: '控制上限必须大于规格下限!'
          })
          return
        }
        parmas.push({
          cl: this.rowList[1].cl,
          creator: sessionStorage.getItem('User-Id'),
          lcl: this.rowList[1].lcl,
          lsl: this.rowList[1].lsl,
          mrcl: this.rowList[1].mrcl,
          mrucl: this.rowList[1].mrucl,
          programId: this.rowList[1].programId,
          sign: this.rowList[1].sign,
          type: this.activeTabIndex,
          ucl: this.rowList[1].ucl,
          usl: this.rowList[1].usl
        })
      }
      save(parmas).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.addDialogVisible = false
          this.fetchData()
        }
      })
    }
  }
}

