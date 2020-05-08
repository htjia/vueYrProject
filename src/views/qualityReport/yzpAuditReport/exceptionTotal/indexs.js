
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import Chart from '@/components/Charts'
import { selects, selectlv, adds, deletes, updates, selectAll } from '@/api/baobiao/exceptionTotal'

export default {
  components: { PageHeaderLayout, HeaderSearchAdd, Chart },
  data() {
    return {
      isChart: true, // 是否图表
      listLoading: false,
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      editDialogVisible: false,
      addDialogVisible: false,
      beginDate: this.getSevenFormatDate(),
      endDate: this.getNowFormatDates(),
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
        grid: {
          bottom: 30
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          formatter: function(params) {
            return [
              params[0].name + ': ',
              params[0].marker + ' ' + params[0].seriesName + ' : ' + params[0].value,
              params[1].marker + ' ' + params[1].seriesName + ' : ' + params[1].value + '%'
            ].join('<br/>')
          }
        },
        legend: {
          data: ['数量', '累计不良率']
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: true,
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value',
            scale: true,
            name: '量'
          },
          {
            type: 'value',
            scale: true,
            name: '占比',
            axisLabel: {
              formatter: '{value} %'
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '数量',
            type: 'bar',
            barMaxWidth: 20,
            barMinHeight: 5,
            itemStyle: {
              color: '#009494'
            },
            data: []
          },
          {
            name: '累计不良率',
            type: 'line',
            itemStyle: {
              color: '#5268a5'
            },
            yAxisIndex: 1,
            smooth: true,
            data: []
          }
        ]
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
      programForm: {
        dates: '',
        level: '',
        model: '',
        num: '',
        remark: ''
      },
      rules: {
        dates: [{ required: true, message: '内容不可为空', trigger: 'blur' }],
        level: [{ required: true, message: '内容不可为空', trigger: 'blur' }],
        model: [{ required: true, message: '内容不可为空', trigger: 'blur' }],
        num: [{ required: true, message: '内容不可为空', trigger: 'blur' }]
      },
      levelList: [
        {
          id: 0,
          name: '重大异常'
        },
        {
          id: 1,
          name: '一般异常'
        }
      ],
      tableList: [],
      substrateFindOptions: [],
      model: '',
      isActive: 0,
      currentId: 0
    }
  },
  mounted() {
    this.getTableChar()
    this.fetchData()
    this.selectAlls()
  },
  methods: {
    navClick(index) {
      this.isActive = index
      this.getTableChar()
      this.pageNum = 1
      this.fetchData()
    },
    selectAlls() {
      selectAll().then(res => {
        this.substrateFindOptions = []
        for (const item of res.data) {
          if (item.enable === 0) {
            this.substrateFindOptions.push(item)
          }
        }
      })
    },
    clearAll() {
      this.beginDate = this.getSevenFormatDate()
      this.endDate = this.getNowFormatDates()
      this.model = ''
    },
    // 时间戳转yyyy-mm-dd
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    importExcel() {
      window.open(process.env.BASE_API + '/xpExceptionSummaryStatistics/selectForExport?startTime=' + this.formatDate(this.beginDate) + '&endTime=' + this.formatDate(this.endDate) + '&grade=' + this.isActive + '&exceptionClassId=' + this.model, '_blank')
    },
    changeIsChart() {
      this.isChart = !this.isChart
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
    getTableChar() {
      this.listLoading = true
      const params = {
        grade: this.isActive,
        exceptionClassId: this.model,
        startTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate)
      }
      selectlv(params).then(res => {
        const data = []
        const data1 = []
        const data2 = []
        let betnum = 0
        let totalnum = 0
        for (const item of res.data) {
          data.push(item.exceptionText)
          totalnum = totalnum + item.badnum
          data1.push({ name: item.exceptionText, value: item.badnum })
        }
        this.options1.legend.data = data
        this.options1.series[0].data = data1
        for (const item of res.data) {
          betnum = betnum + item.badnum
          data2.push(((betnum / totalnum) * 100).toFixed(2))
        }
        this.options.xAxis[0].data = data
        this.options.series[0].data = data1
        this.options.series[1].data = data2
        this.listLoading = false
      })
      const params1 = {
        grade: this.isActive,
        exceptionClassId: this.model,
        startTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate),
        pageSize: 1000000,
        pageNum: 1
      }
      selects(params1).then(res => {
        const data = []
        const data1 = []
        for (const item of res.data.list) {
          data.push(item.createTime)
          data1.push(item.badnum)
        }
        this.listLoading = false
      })
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const params = {
        grade: this.isActive,
        exceptionClassId: this.model,
        startTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate),
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }
      selects(params).then(res => {
        this.tableList = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
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
      this.getTableChar()
      this.fetchData()
    },
    // 添加
    handleAdd() {
      this.programForm = {
        dates: '',
        level: '',
        model: '',
        num: '',
        remark: ''
      }
      this.addDialogVisible = true
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    // 取消
    resetForm(formName) {
      this.addDialogVisible = false
      this.editDialogVisible = false
      this.$refs[formName].resetFields()
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            badnum: this.programForm.num,
            exceptionClassId: this.programForm.model,
            grade: this.programForm.level,
            createTime: this.formatDate(this.programForm.dates),
            remark: this.programForm.remark
          }
          adds(params).then(res => {
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
    // 编辑提交
    submitEditForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            badnum: this.programForm.num,
            exceptionClassId: this.programForm.model,
            grade: this.programForm.level,
            createTime: this.formatDate(this.programForm.dates),
            remark: this.programForm.remark,
            id: this.currentId
          }
          updates(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.$refs[formName].resetFields()
              this.editDialogVisible = false
              this.fetchData()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleEdit(row) {
      this.programForm = {
        num: row.badnum,
        model: row.exceptionClassId,
        level: row.grade,
        dates: new Date(row.createTime),
        remark: row.remark
      }
      this.currentId = row.id
      this.editDialogVisible = true
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该信息，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: row.id
        }
        deletes(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.editDialogVisible = false
            this.fetchData()
          }
        })
      }).catch(() => {
      })
    }
  }
}

