
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import Chart from '@/components/Charts'
import { substrateFindList } from '@/api/extensionManage/synthesizeJudgment/synthesizeJudgment'
import { matfindList } from '@/api/extensionManage/synthesizeJudgment/synthesizeJudgment'
import { findSelect, bffindSelect, findReport, add, anyFind, update, deleteAny } from '@/api/baobiao/bfInspectionExceptions'
import { findUserByRoleName } from '@/api/chipManage/frontSiteManage/cleanSite'

export default {
  components: { PageHeaderLayout, HeaderSearchAdd, Chart },
  data() {
    return {
      isChart: true, // 是否图表
      listLoading: false,
      editDialogVisible: false,
      addDialogVisible: false,
      beginDate: this.getLastMonthFirstDay(),
      endDate: this.getLastMonthEndDay(),
      pickerOptionsStart: {
        disabledDate: (time) => {
          const endDateVal = this.endDate
          if (endDateVal) {
            return time.getTime() > endDateVal
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          const beginDateVal = this.beginDate
          if (beginDateVal) {
            return time.getTime() < beginDateVal
          }
        }
      },
      options: {
        tooltip: {
          trigger: 'axis'
        },
        calculable: false,
        yAxis: [
          {
            type: 'value',
            boundaryGap: [0, 0.01],
            axisLine: {
              lineStyle: {
                color: 'rgb(174, 174, 174)',
                width: 1
              },
              show: true
            },
            axisTick: {
              show: true,
              inside: true,
              length: 5,
              lineStyle: {
                color: 'rgb(174, 174, 174)'
              }
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: '#7a7a7a'
              }
            }
          }
        ],
        xAxis: [
          {
            type: 'category',
            data: ['13#', '14#', '17#', '4#', '2#', '1#'],
            axisLine: {
              show: true,
              lineStyle: {
                color: 'rgb(174, 174, 174)',
                width: 1
              }
            },
            axisLabel: {
              margin: 15,
              textStyle: {
                color: '#7a7a7a'
              }
              // formatter: '{value} 包'
            },
            axisTick: {
              show: false
            },
            splitLine: {
              lineStyle: {
                color: 'rgb(215, 215, 215)'
              },
              show: true
            }
          }
        ],
        series: [
          {
            name: '报废率',
            type: 'bar',
            barMaxWidth: '15',
            barMinHeight: 5,
            itemStyle: {
              normal: {
                color: function(params) {
                  var colorList = [
                    '#7586b7', '#009494', '#7586b7', '#009494', '#7586b7', '#009494', '#7586b7', '#009494', '#7586b7',
                    '#009494', '#7586b7', '#009494', '#7586b7', '#009494', '#7586b7', '#009494', '#7586b7', '#009494',
                    '#7586b7', '#009494', '#7586b7', '#009494', '#7586b7', '#009494', '#7586b7', '#009494', '#7586b7',
                    '#009494', '#7586b7', '#009494', '#7586b7', '#009494', '#7586b7'
                  ]
                  return colorList[params.dataIndex]
                }
              }
            },

            // 设置柱的宽度，要是数据太少，柱子太宽不美观~

            barWidth: 20,
            data: [0.05, 0.06, 0.07, 0.08, 0.09, 0.1]
          }
        ],
        // color: ['rgb(51, 169, 169)'],
        animation: true,
        animationEasing: 'ElasticInOut',
        grid: {
          x: 50,
          y: 20,
          x2: 30,
          y2: 40
        }
      },
      options1: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} </br> {b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          data: []
        },
        series: [
          {
            name: '异常',
            type: 'pie',
            radius: '70%',
            center: ['40%', '50%'],
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },
      reportList: [],
      totals: 0,
      machineForm: {
        id: '',
        happendDate: '',
        machine: '',
        reason: '',
        reasontype: '',
        dispti: '',
        ressonany: '',
        anycont: '',
        remark: '',
        num: '',
        creator: ''
      },
      rules: {
        happendDate: [{ required: true, message: '请选择发生日期', trigger: 'blur' }],
        machine: [{ required: true, message: '请选择机台', trigger: 'blur' }],
        reason: [{ required: true, message: '请选择表面报废类型', trigger: 'blur' }],
        reasontype: [{ required: true, message: '请选择报废类型', trigger: 'blur' }],
        dispti: [{ required: true, message: '请输入不良描述', trigger: 'blur' }],
        ressonany: [{ required: true, message: '请输入原因分析', trigger: 'blur' }],
        anycont: [{ required: true, message: '请输入改善对策', trigger: 'blur' }],
        num: [{ required: true, message: '请输入报废数量', trigger: 'blur' }],
        creator: [{ required: true, message: '请输入分析人', trigger: 'blur' }]
      },
      isActive: 0,
      tableList: [],
      machineValue: [],
      machineOptions: [],
      reason: '',
      reasonName: '',
      reasonLists: [],
      bfList: [],
      substrateFindOptions: [],
      userLists: [],
      bfInfo: '',
      year: 0,
      week: 0,
      pageNum: 1,
      pageSize: 15,
      totalPage: 0,
      listicon: ['MOVCDdapan', 'renwyic', 'huanjyc', 'wenduyc', 'MOVCDdapan', 'renwyic', 'huanjyc', 'wenduyc', 'MOVCDdapan', 'renwyic', 'huanjyc', 'wenduyc']
    }
  },
  mounted() {
    const weekday = sessionStorage.getItem('weekday')
    if (weekday !== undefined || weekday !== null) {
      const sp = weekday.split('-')
      this.year = parseInt(sp[0])
      this.week = parseInt(sp[1])
    }
    this.matfindList()
    this.reasonQuery()
    this.bffindSelects()
    this.substrateFindList()
    this.customerList()
  },
  methods: {
    // 查询
    customerList() {
      findUserByRoleName({ roleName: '外延工艺分析人员' }).then(res => {
        this.userLists = res.data
      })
    },
    substrateFindList() {
      substrateFindList().then(res => {
        this.substrateFindOptions = res.data
        this.findReports()
      })
    },
    reasonQuery() {
      findSelect().then(res => {
        this.reasonLists = res.data
      })
    },
    bffindSelects() {
      bffindSelect().then(res => {
        this.bfList = res.data
      })
    },
    matfindList() {
      matfindList().then(res => {
        this.machineOptions = res.data
      })
    },
    findReports() {
      this.listLoading = true
      this.reportList = []
      this.totals = 0
      const params = {
        measureId: this.substrateFindOptions[this.isActive].id,
        machineId: this.machineValue.join(),
        visualReasonId: this.reason,
        scrapTypeId: this.bfInfo,
        endTime: this.endDate !== '' ? this.formatDate(this.endDate) : '',
        startTime: this.beginDate !== '' ? this.formatDate(this.beginDate) : ''
      }
      findReport(params).then(res => {
        this.reportList = res.data
        const namelist = []
        const numlist = []
        for (const item of this.reportList) {
          this.totals = this.totals + item.num
          namelist.push(item.name)
          numlist.push({
            name: item.name,
            value: item.num
          })
        }
        this.options1.legend.data = namelist
        this.options1.series[0].data = numlist
        this.findLists()
        this.listLoading = false
      })
    },
    findLists() {
      this.listLoading = true
      const params = {
        measureId: this.substrateFindOptions[this.isActive].id,
        machineId: this.machineValue.join(),
        visualReasonId: this.reason,
        scrapTypeId: this.bfInfo,
        endTime: this.endDate !== '' ? this.formatDate(this.endDate) : '',
        startTime: this.beginDate !== '' ? this.formatDate(this.beginDate) : '',
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      anyFind(params).then(res => {
        this.tableList = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    importDBF() {
      window.open(process.env.BASE_API + '/zlVisualScrapController/export?startTime=' + this.formatDate(this.beginDate) + '&endTime=' +
      this.formatDate(this.endDate) + '&measureId=' + this.substrateFindOptions[this.isActive].id + '&machineId=' + this.machineValue.join() + '&visualReasonId=' +
       this.reason + '&scrapTypeId=' + this.bfInfo, '_blank')
    },
    // 当前页数改变
    currentChange(pageNum) {
      this.pageNum = pageNum
      this.findLists()
    },
    // 每页数量改变
    sizeChange(pageSize) {
      this.pageSize = pageSize
      this.findLists()
    },
    // 时间戳转yyyy-mm-dd
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    getNowFormatDate() {
      var today = new Date()
      return this.formatDate(today.getTime())
    },
    getNowFormatDates() {
      var today = new Date()
      return today
    },
    getSevenFormatDate() {
      var today = new Date()
      var SevenDayAgo = today - 86400 * 6 * 1000
      return SevenDayAgo
    },
    // 获取上个月第一天
    getLastMonthFirstDay() {
      const today = new Date()
      const Y = today.getFullYear()
      const M = today.getMonth()
      const resultDay = new Date(Y, M, 1)
      return resultDay
    },
    // 获取上个月最后一天
    getLastMonthEndDay() {
      const today = new Date()
      const Y = today.getFullYear()
      const M = today.getMonth()
      const endDay = new Date(Y, M + 1, 0)
      return endDay
    },
    handleSearch() {
      this.pageNum = 1
      this.findReports()
    },
    navClick(index) {
      this.isActive = index
      this.findReports()
    },
    updateItem(item) {
      this.machineForm = {
        id: item.id,
        happendDate: new Date(item.happenTime),
        machine: item.machineId,
        reason: item.visualReasonId,
        reasontype: item.scrapTypeId,
        dispti: item.badDescribe,
        ressonany: item.causeAnalysis,
        anycont: item.improve,
        remark: item.remark,
        num: item.num,
        creator: item.creator
      }
      this.editDialogVisible = true
    },
    addItem() {
      this.machineForm = {
        id: '',
        happendDate: '',
        machine: '',
        reason: '',
        reasontype: '',
        dispti: '',
        ressonany: '',
        anycont: '',
        remark: ''
      }
      this.addDialogVisible = true
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    deleteItem(row) {
      this.$confirm('删除后将不再有此条记录, 确定要删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: row.id
        }
        console.log(params)
        deleteAny(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            if (this.tableList.length === 1 && this.pageNum !== 1) {
              this.pageNum = this.pageNum - 1
            }
            this.findReports()
          }
        })
      })
    },
    clearAll() {
      this.machineValue = []
      this.reason = ''
      this.bfInfo = ''
      this.beginDate = this.getLastMonthFirstDay()
      this.endDate = this.getLastMonthEndDay()
      this.findReports()
    },
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            badDescribe: this.machineForm.dispti,
            causeAnalysis: this.machineForm.ressonany,
            creator: this.machineForm.creator,
            happenTime: this.formatDate(this.machineForm.happendDate),
            improve: this.machineForm.anycont,
            machineId: this.machineForm.machine,
            measureId: this.substrateFindOptions[this.isActive].id,
            num: this.machineForm.num,
            remark: this.machineForm.remark,
            scrapTypeId: this.machineForm.reasontype,
            visualReasonId: this.machineForm.reason
          }
          add(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
              this.addDialogVisible = false
              this.$refs[formName].resetFields()
              this.findReports()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    update(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            id: this.machineForm.id,
            badDescribe: this.machineForm.dispti,
            causeAnalysis: this.machineForm.ressonany,
            creator: this.machineForm.creator,
            happenTime: this.formatDate(this.machineForm.happendDate),
            improve: this.machineForm.anycont,
            machineId: this.machineForm.machine,
            measureId: this.substrateFindOptions[this.isActive].id,
            num: this.machineForm.num,
            remark: this.machineForm.remark,
            scrapTypeId: this.machineForm.reasontype,
            visualReasonId: this.machineForm.reason
          }
          update(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.editDialogVisible = false
              this.$refs[formName].resetFields()
              this.findReports()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}

