
import { fetchList, remove, craftList, fetchCardInfo } from '@/api/processManagement/proceCardManage'
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
// import Print from '@/utils/print'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      printDialogVisible: false,
      proceCardForm: {
        proceCardName: '',
        proceCardType: '',
        craftType: '',
        runType: '',
        remark: '',
        beginDate: '',
        endDate: '',
        creator: '',
        beginModificDate: '',
        endModificDate: '',
        modifier: ''
      },
      list: [],
      searchkey: '',
      searchOption: '',
      lightColorType1: [],
      lightColorType2: [],
      lightColorType3: [],
      lightColorType4: [],
      lightColorType5: [],
      activeIndex: 1,
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      beginDate: '',
      endDate: '',
      pickerOptionsStart: {
        disabledDate: (time) => {
          const endDateVal = this.proceCardForm.endDate
          if (endDateVal) {
            return time.getTime() > endDateVal
          } else {
            return time.getTime() > Date.now()
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
          const beginDateVal = this.proceCardForm.beginDate
          if (beginDateVal) {
            return time.getTime() < beginDateVal || time.getTime() > Date.now()
          } else {
            return time.getTime() > Date.now()
          }
        }
        // shortcuts: [{
        //   text: '今天',
        //   onClick(picker) {
        //     picker.$emit('pick', new Date())
        //   }
        // }]
      },
      pickerOptionsMStart: {
        disabledDate: (time) => {
          const endDateVal = this.proceCardForm.endModificDate
          if (endDateVal) {
            return time.getTime() > endDateVal
          } else {
            return time.getTime() > Date.now()
          }
        }
        // shortcuts: [{
        //   text: '今天',
        //   onClick(picker) {
        //     picker.$emit('pick', new Date())
        //   }
        // }]
      },
      pickerOptionsMEnd: {
        disabledDate: (time) => {
          const beginDateVal = this.proceCardForm.beginModificDate
          if (beginDateVal) {
            return time.getTime() < beginDateVal || time.getTime() > Date.now()
          } else {
            return time.getTime() > Date.now()
          }
        }
        // shortcuts: [{
        //   text: '今天',
        //   onClick(picker) {
        //     picker.$emit('pick', new Date())
        //   }
        // }]
      },
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
      currentId: '',
      info: {
        name: '',
        type: 0,
        code: '',
        craftName: '',
        remark: '',
        status: ''
      },
      currentModelList: [],
      dialogList: [],
      dialogEndList: [],
      isRework: '0'
    }
  },
  watch: {
  },
  created() {
    this.getCraftList()
  },
  mounted() {
    if (this.$route.params.id === undefined) {
      this.isRework = '1'
      this.proceCardTypeOptions = [
        {
          id: 2,
          name: '返工流程卡'
        }
      ]
      this.proceCardForm.proceCardType = 2
      this.fetchData()
    } else {
      this.fetchData()
    }
  },
  methods: {
    checkTime() {
      if (this.proceCardForm.endDate !== null && this.proceCardForm.endDate !== '' && this.proceCardForm.beginDate !== null && this.proceCardForm.beginDate !== '') {
        const begin = Date.parse(new Date(new Date(this.proceCardForm.beginDate).getFullYear(), new Date(this.proceCardForm.beginDate).getMonth(), new Date(this.proceCardForm.beginDate).getDate(), 0, 0, 0))
        const end = Date.parse(new Date(new Date(this.proceCardForm.endDate).getFullYear(), new Date(this.proceCardForm.endDate).getMonth(), new Date(this.proceCardForm.endDate).getDate(), 0, 0, 0))
        if (end - begin < 0) {
          this.proceCardForm.beginDate = this.getYesterdayFormatDate()
          this.$message.error('开始日期不能大于结束日期')
        }
      }
    },
    // 获取昨天日期
    getYesterdayFormatDate() {
      var today = new Date()
      var yesterday = today.setTime(today.getTime() - 24 * 60 * 60 * 1000)
      return yesterday
    },
    // 时间戳转yyyy-mm-dd
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
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
    handleSearch(data) {
      this.pageNum = 1
      this.fetchData()
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
    handleClear() {
      this.proceCardForm.proceCardName = ''
      if (this.$route.params.id === undefined) {
        this.proceCardForm.proceCardType = 2
      } else {
        this.proceCardForm.proceCardType = ''
      }
      this.proceCardForm.craftType = ''
      this.proceCardForm.runType = ''
      this.proceCardForm.beginDate = ''
      this.proceCardForm.endDate = ''
      this.proceCardForm.beginModificDate = ''
      this.proceCardForm.endModificDate = ''
      this.proceCardForm.creator = ''
      this.proceCardForm.modifier = ''
      this.proceCardForm.remark = ''
      this.handleSearch()
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const requestParams = {
        name: this.proceCardForm.proceCardName,
        type: this.proceCardForm.proceCardType,
        craftId: this.proceCardForm.craftType,
        status: this.proceCardForm.runType,
        createStartTime: this.proceCardForm.beginDate === '' ? '' : this.formatDate(this.proceCardForm.beginDate),
        createEndTime: this.proceCardForm.endDate === '' ? '' : this.formatDate(this.proceCardForm.endDate),
        updateStartTime: this.proceCardForm.beginModificDate === '' ? '' : this.formatDate(this.proceCardForm.beginModificDate),
        updateEndTime: this.proceCardForm.endModificDate === '' ? '' : this.formatDate(this.proceCardForm.endModificDate),
        creator: this.proceCardForm.creator,
        modifier: this.proceCardForm.modifier,
        remark: this.proceCardForm.remark,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      console.log(requestParams)
      fetchList(requestParams).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    // 添加
    handleAdd() {
      this.$router.push({ path: '/addProceCardManage/index', query: { id: 1, index: (this.totalPage + 1), isRework: this.isRework }})
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
      this.printDialogVisible = false
    },
    printDiv() {
      this.printDialogVisible = false
      this.$print(this.$refs.print)
      // const newstr = document.getElementById('printDiv').innerHTML
      // const oldstr = document.body.innerHTML
      // document.body.innerHTML = newstr
      // window.print()
      // document.body.innerHTML = oldstr
      // window.location.reload() // 解决打印取消  返回页面鼠标失效,不能继续打印
    },
    getProceCodeModel(id) {
      const requestParams = {
        id
      }
      fetchCardInfo(requestParams).then(res => {
        var arr = []
        if (res.data.modelList[0] === null) {
          this.currentModelList = []
        } else {
          res.data.modelList.map((item) => {
            arr.push({
              color: item.color,
              modelName: item.modelList
            })
          })
          this.currentModelList = arr
        }
        this.setCopyProce(res.data.processList)
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
    // // 时间戳转yyyy-mm-dd
    // formatDate(timeStamp) {
    //   var date = new Date(timeStamp)
    //   var y = 1900 + date.getYear()
    //   var m = '0' + (date.getMonth() + 1)
    //   var d = '0' + date.getDate()
    //   return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    // },
    // 打印预览
    printPreview(row, index) {
      this.printDialogVisible = true
      this.info = row
      this.getProceCodeModel(this.info.id)
      console.log('打印预览')
      console.log(row)
    },
    // 编辑
    handleEdit(row, index) {
      this.$router.push({
        path: '/addProceCardManage/index',
        query: {
          id: 2,
          index: (index + 1) + ((this.pageNum - 1) * this.pageSize),
          cardId: row.id,
          code: row.code,
          cn: row.name,
          ct: row.type,
          cftId: row.craftId,
          cftNm: row.craftName,
          cs: row.status,
          rmk: row.remark,
          crt: row.createTime,
          upt: row.lastUpdateTime,
          creator: row.creator,
          modifier: row.modifier,
          isRework: this.isRework
        }
      })
    },
    // 删除
    handleDelete(row) {
      this.$confirm('此操作将永久删除该流程卡, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          id: row.id
        }
        remove(param).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            if (this.list.length === 1 && this.pageNum !== 1) {
              this.pageNum -= 1
            }
            this.fetchData()
          }
        })
      }).catch(() => {
      })
    },
    handleSearchOption() {
      console.log('查询')
    },
    handleCheckedTypesChange(value) {
      console.log(value)
    }
  }
}

