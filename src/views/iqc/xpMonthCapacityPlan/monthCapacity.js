import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import {
  queryList,
  getProductSchedule,
  changeLog,
  getProductModel,
  getChenDi
} from '@/api/pcChipCasting/monthlyPlan'
import { numFormat } from '@/utils'
import { scCategoryList, findGYlList } from '@/api/pcChipCasting/pcChipCasting'

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
      xpNoRate: 0,
      xpRealNo: 0,
      xpPlanNo: 0,
      xpkRate: 0,
      xpRealK: 0,
      xpPlanK: 0,
      month: '',
      obj: {
        xpPlanTp: 0,
        xpRealTp: 0,
        dcRate: 0,
        xpRealNo: 0,
        xpPlanNo: 0,
        wcRate: 0,
        // xpZcNo: 0,
        xpRealK: 0,
        xpPlanK: 0
      },
      changeMonth: '',
      isSpan: true,
      listLoading: false,
      xpShow: false,
      anotherlist: [],
      activeLog: [],
      updateDialogVisible: false,
      isNotPlan: false,
      isActive: 2,
      isDisabled: true,
      showType: 0,
      craftId: '',
      categoryId: '',
      produceId: '',
      substrate: '',
      pattern: null, // 全部/方片/圆片
      categoryList: [],
      modelList: [],
      measureList: [],
      gyList: [],
      changeXpLogList: []
    }
  },
  mounted() {
    this.month = this.formatDate(new Date().getTime())
    this.changeType(0)
    this.scCategoryList()
    this.getProductModelFun()
    this.getChenDi()
    this.findGYlListFun()
    this.changeLogSev()
    this.init()
  },
  methods: {
    cancelRowStyle({ row }) {
      if (row.status === 1) {
        return 'background: #f8dada'
      }
    },
    // 进度条
    getProgress() {
      const params = {
        month: this.month,
        pattern: this.isActive === 2 ? '' : this.isActive
      }
      getProductSchedule(params).then(res => {
        if (res.data !== null) {
          this.obj = res.data
          this.obj.xpPlanTp = numFormat(res.data.xpPlanTp)
          this.obj.xpRealTp = numFormat(res.data.xpRealTp)
          this.obj.xpRealNo = numFormat(res.data.xpRealNo)
          this.obj.xpRealK = numFormat(res.data.xpRealK)
          this.obj.xpPlanNo = numFormat(res.data.xpPlanNo)
          this.obj.xpPlanK = numFormat(res.data.xpPlanK)
          // this.obj.xpZcNo = numFormat(res.data.xpZcNo)
          this.xpNoRate = res.data.xpNoRate
          this.xpRealNo = res.data.xpRealNo
          this.xpPlanNo = res.data.xpPlanNo
          this.xpkRate = res.data.xpkRate
          this.xpRealK = res.data.xpRealK
          this.xpPlanK = res.data.xpPlanK
        } else {
          this.xpNoRate = 0
          this.xpRealNo = 0
          this.xpPlanNo = 0
          this.xpkRate = 0
          this.xpRealK = 0
          this.xpPlanK = 0
        }
      })
    },
    init() {
      this.month = this.formatDate(new Date().getTime())
      this.isActive = 2
      this.categoryId = null
      this.produceId = null
      this.substrate = null
      this.craftId = null
      this.fetchData()
      this.getProgress()
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
    // 按片查看
    changeType(value) {
      if (value === 0) {
        this.xpShow = true
      } else {
        this.xpShow = false
      }
    },
    // 切换全部/圆片/方片
    navClick(index) {
      this.isActive = index
      this.fetchData()
      this.getProgress()
    },
    setSpan() {
      this.isSpan = !this.isSpan
    },
    // 变更日志
    changeLog() {
      this.updateDialogVisible = true
      this.changeLogSev()
    },
    // 类别
    scCategoryList() {
      scCategoryList().then(res => {
        this.categoryList = res.data.list
      })
    },
    // 型号
    getProductModelFun() {
      getProductModel().then(res => {
        this.modelList = res.data
      })
    },
    // 衬底
    getChenDi() {
      getChenDi().then(res => {
        this.measureList = res.data
      })
    },
    // 工艺
    findGYlListFun() {
      findGYlList().then(res => {
        this.gyList = res.data.list
      })
    },
    // 变更日志接口
    changeLogSev() {
      const params = {
        month: this.month,
        categoryId: this.categoryId,
        produceId: this.produceId,
        substrate: this.substrate,
        craftId: this.craftId,
        type: 1
      }
      changeLog(params).then(res => {
        this.changeXpLogList = res.data
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
      const
        obj = this.substrate ? this.measureList.find(_ => _.name === this.substrate) : {
          measureId: null,
          craftId: null
        }
      const params = {
        month: this.month,
        categoryId: this.categoryId,
        produceId: this.produceId,
        measureId: obj.measureId,
        typeId: obj.craftId,
        craftId: this.craftId,
        pattern: this.isActive === 2 ? null : this.isActive,
        type: 1
      }
      this.listLoading = true
      queryList(params).then(res => {
        this.isNotPlan = res.data.length === 0
        this.anotherlist = res.data
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      }, res => {
        this.listLoading = false
      })
    }
  }
}

