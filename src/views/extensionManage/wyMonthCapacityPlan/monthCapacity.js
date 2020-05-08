import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import {
  queryList,
  getProductSchedule,
  getProductType,
  changeLog
} from '@/api/pcChipCasting/monthlyPlan'

export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  directives: {
    'el-loadmore': {
      bind(el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
        SELECTWRAP_DOM.addEventListener('scroll', function() {
          /**
           * scrollHeight 获取元素内容高度(只读)
           * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
           * clientHeight 读取元素的可见高度(只读)
           * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
           * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
           */
          console.log(this.scrollTop)
          const condition = this.scrollHeight - this.scrollTop <= this.clientHeight
          if (condition) {
            binding.value()
          }
        })
      }
    }
  },
  data() {
    return {
      pageSize: 12,
      pageNum: 1,
      totalPage: 0,
      tableKey: 0,
      wyNoRate: 0,
      wyRealNo: 0,
      wyPlanNo: 0,
      produce: [],
      month: '',
      changeMonth: '',
      listLoading: false,
      list: [],
      productOptions: [],
      updateDialogVisible: false,
      isNotPlan: false,
      gyList: [],
      progressList: [],
      activeLog: [],
      changeWyLogList: [],
      showType: 0
    }
  },
  mounted() {
    this.init()
    this.getProductType()
    this.changeLogSev()
  },
  methods: {
    init() {
      this.produce = []
      this.month = this.formatDate(new Date().getTime())
      this.fetchData()
      this.getProgress()
    },
    cancelRowStyle({ row }) {
      if (row.status === 1) {
        return 'background: #f8dada'
      }
    },
    getProgress() {
      const params = {
        month: this.month,
        pattern: ''
      }
      getProductSchedule(params).then(res => {
        if (res.data !== null) {
          this.wyNoRate = res.data.wyNoRate
          this.wyRealNo = res.data.wyRealNo
          this.wyPlanNo = res.data.wyPlanNo
        } else {
          this.wyNoRate = 0
          this.wyRealNo = 0
          this.wyPlanNo = 0
        }
      })
    },
    dialogMonthChange(month) {
      this.changeMonth = month
      this.getDialogList() // 获取当前月份外延月度计划
    },
    // 重置
    clearCondition() {
      this.init()
    },
    // 查询
    searchData() {
      this.fetchData()
      this.getProgress()
    },
    // 变更日志
    changeLog() {
      this.updateDialogVisible = true
      this.changeLogSev()
    },
    // 产品数据
    getProductType() {
      const params = {
        pageSize: 9999999,
        pageNum: 1
      }
      getProductType(params).then(res => {
        this.productOptions = res.data
      })
    },
    // 变更日志数据
    changeLogSev() {
      const params = {
        month: this.month,
        type: 0
      }
      changeLog(params).then(res => {
        this.changeWyLogList = res.data
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
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      // var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length)// + '-' + d.substring(d.length - 2, d.length)
    },
    // 查询
    fetchData() {
      const params = {
        month: this.month,
        produce: this.produce.join(','),
        type: 0
      }
      this.listLoading = true
      queryList(params).then(res => {
        this.isNotPlan = res.data.length === 0
        this.list = res.data
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      }, res => {
        this.listLoading = false
      })
    }
  }
}

