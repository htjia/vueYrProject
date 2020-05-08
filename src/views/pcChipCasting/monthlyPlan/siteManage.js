import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import {
  queryList,
  getProductSchedule,
  getProductType,
  getPlanMonth,
  addMonthPlan,
  changeMonthPlan,
  cancelTc,
  recoverTc,
  changeLog,
  getProductModel,
  getChenDi
} from '@/api/pcChipCasting/monthlyPlan'
import { scCategoryList, findGYlList } from '@/api/pcChipCasting/pcChipCasting'
import { findSubstrateMeasureList } from '@/api/chipBasicInfoManage/grindProcessInfo'

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
      wyNoRate: 0,
      wyRealNo: 0,
      wyPlanNo: 0,
      xpNoRate: 0,
      xpRealNo: 0,
      xpPlanNo: 0,
      xpkRate: 0,
      xpRealK: 0,
      xpPlanK: 0,
      month: '',
      addMonth: '',
      changeMonth: '',
      type: 0,
      listLoading: false,
      xpShow: false,
      showLogDiv: false,
      list: [],
      anotherlist: [],
      dialogList: [],
      dialogAnotherList: [],
      addDialogVisible: false,
      updateDialogVisible: false,
      changeDialogVisible: false,
      isNotPlan: false,
      isActive: 0,
      isActive2: 0,
      isActive3: 0,
      isDisabled: true,
      showType: 0,
      colorId: '',
      craftId: '',
      createTime: '',
      creatorName: '',
      creator: '',
      id: '',
      measureId: '',
      planNo: '',
      produce: '',
      remark: '',
      status: 0,
      address: '',
      categoryId: [],
      measure: '',
      pattern: [],
      planMonth: '',
      planRkk: '',
      planRkno: '',
      planTpno: '',
      produceId: '',
      substrate: '',
      productOptions: [],
      addWyList: [{
        rowNum: '',
        products: '',
        planInStorage: '',
        remark: '',
        status: 0
      }, {
        rowNum: '',
        products: '',
        planInStorage: '',
        remark: '',
        status: 0
      }, {
        rowNum: '',
        products: '',
        planInStorage: '',
        remark: '',
        status: 0
      }, {
        rowNum: '',
        products: '',
        planInStorage: '',
        remark: '',
        status: 0
      }, {
        rowNum: '',
        products: '',
        planInStorage: '',
        remark: '',
        status: 0
      }, {
        rowNum: '',
        products: '',
        planInStorage: '',
        remark: '',
        status: 0
      }, {
        rowNum: '',
        products: '',
        planInStorage: '',
        remark: '',
        status: 0
      }, {
        rowNum: '',
        products: '',
        planInStorage: '',
        remark: '',
        status: 0
      }, {
        rowNum: '',
        products: '',
        planInStorage: '',
        remark: '',
        status: 0
      }, {
        rowNum: '',
        products: '',
        planInStorage: '',
        remark: '',
        status: 0
      }],
      addXpList: [{
        rowNum: '',
        pattern: '',
        categoryId: [],
        produceId: '',
        measure: '',
        substrate: '',
        craftId: '',
        planTpno: '',
        planRkno: '',
        planRkk: '',
        address: '',
        remark: '',
        status: 0
      }, {
        rowNum: '',
        pattern: '',
        categoryId: [],
        produceId: '',
        measure: '',
        substrate: '',
        craftId: '',
        planTpno: '',
        planRkno: '',
        planRkk: '',
        address: '',
        remark: '',
        status: 0
      }, {
        rowNum: '',
        pattern: '',
        categoryId: [],
        produceId: '',
        measure: '',
        substrate: '',
        craftId: '',
        planTpno: '',
        planRkno: '',
        planRkk: '',
        address: '',
        remark: '',
        status: 0
      }, {
        rowNum: '',
        pattern: '',
        categoryId: [],
        produceId: '',
        measure: '',
        substrate: '',
        craftId: '',
        planTpno: '',
        planRkno: '',
        planRkk: '',
        address: '',
        remark: '',
        status: 0
      }, {
        rowNum: '',
        pattern: '',
        categoryId: [],
        produceId: '',
        measure: '',
        substrate: '',
        craftId: '',
        planTpno: '',
        planRkno: '',
        planRkk: '',
        address: '',
        remark: '',
        status: 0
      }, {
        rowNum: '',
        pattern: '',
        categoryId: [],
        produceId: '',
        measure: '',
        substrate: '',
        craftId: '',
        planTpno: '',
        planRkno: '',
        planRkk: '',
        address: '',
        remark: '',
        status: 0
      }, {
        rowNum: '',
        pattern: '',
        categoryId: [],
        produceId: '',
        measure: '',
        substrate: '',
        craftId: '',
        planTpno: '',
        planRkno: '',
        planRkk: '',
        address: '',
        remark: '',
        status: 0
      }, {
        rowNum: '',
        pattern: [],
        categoryId: '',
        produceId: '',
        measure: '',
        substrate: '',
        craftId: '',
        planTpno: '',
        planRkno: '',
        planRkk: '',
        address: '',
        remark: '',
        status: 0
      }, {
        rowNum: '',
        pattern: '',
        categoryId: [],
        produceId: '',
        measure: '',
        substrate: '',
        craftId: '',
        planTpno: '',
        planRkno: '',
        planRkk: '',
        address: '',
        remark: '',
        status: 0
      }, {
        rowNum: '',
        pattern: [],
        categoryId: '',
        produceId: '',
        measure: '',
        substrate: '',
        craftId: '',
        planTpno: '',
        planRkno: '',
        planRkk: '',
        address: '',
        remark: '',
        status: 0
      }],
      typeList: [
        {
          id: 0,
          name: '圆片'
        },
        {
          id: 1,
          name: '方片'
        }
      ],
      categoryList: [],
      modelList: [],
      measureList: [],
      gyList: [],
      progressList: [],
      activeLog: [],
      changeWyLogList: [],
      changeXpLogList: [],
      monthPlanList: []
    }
  },
  mounted() {
    this.month = this.formatDate(new Date().getTime())
    this.getProgress()
    this.changeType(0)
    this.getProductType()
    this.scCategoryList()
    this.getProductModelFun()
    this.findSubstrateMeasureList()
    this.getChenDi()
    this.findGYlListFun()
    this.changeLogSev()
    this.fetchData(0)
    this.fetchData(1)
    this.getPlanMonthFun()
  },
  methods: {
    addDialogClose() {
      this.isActive2 = 0
      this.addWyList = [{
        rowNum: '',
        products: '',
        planInStorage: '',
        remark: '',
        status: 0
      }, {
        rowNum: '',
        products: '',
        planInStorage: '',
        remark: '',
        status: 0
      }, {
        rowNum: '',
        products: '',
        planInStorage: '',
        remark: '',
        status: 0
      }, {
        rowNum: '',
        products: '',
        planInStorage: '',
        remark: '',
        status: 0
      }, {
        rowNum: '',
        products: '',
        planInStorage: '',
        remark: '',
        status: 0
      }, {
        rowNum: '',
        products: '',
        planInStorage: '',
        remark: '',
        status: 0
      }, {
        rowNum: '',
        products: '',
        planInStorage: '',
        remark: '',
        status: 0
      }, {
        rowNum: '',
        products: '',
        planInStorage: '',
        remark: '',
        status: 0
      }, {
        rowNum: '',
        products: '',
        planInStorage: '',
        remark: '',
        status: 0
      }, {
        rowNum: '',
        products: '',
        planInStorage: '',
        remark: '',
        status: 0
      }]
      this.addXpList = [{
        rowNum: '',
        pattern: '',
        categoryId: [],
        produceId: '',
        measure: '',
        substrate: '',
        craftId: '',
        planTpno: '',
        planRkno: '',
        planRkk: '',
        address: '',
        remark: '',
        status: 0
      }, {
        rowNum: '',
        pattern: '',
        categoryId: [],
        produceId: '',
        measure: '',
        substrate: '',
        craftId: '',
        planTpno: '',
        planRkno: '',
        planRkk: '',
        address: '',
        remark: '',
        status: 0
      }, {
        rowNum: '',
        pattern: '',
        categoryId: [],
        produceId: '',
        measure: '',
        substrate: '',
        craftId: '',
        planTpno: '',
        planRkno: '',
        planRkk: '',
        address: '',
        remark: '',
        status: 0
      }, {
        rowNum: '',
        pattern: '',
        categoryId: [],
        produceId: '',
        measure: '',
        substrate: '',
        craftId: '',
        planTpno: '',
        planRkno: '',
        planRkk: '',
        address: '',
        remark: '',
        status: 0
      }, {
        rowNum: '',
        pattern: [],
        categoryId: '',
        produceId: '',
        measure: '',
        substrate: '',
        craftId: '',
        planTpno: '',
        planRkno: '',
        planRkk: '',
        address: '',
        remark: '',
        status: 0
      }, {
        rowNum: '',
        pattern: '',
        categoryId: [],
        produceId: '',
        measure: '',
        substrate: '',
        craftId: '',
        planTpno: '',
        planRkno: '',
        planRkk: '',
        address: '',
        remark: '',
        status: 0
      }, {
        rowNum: '',
        pattern: '',
        categoryId: [],
        produceId: '',
        measure: '',
        substrate: '',
        craftId: '',
        planTpno: '',
        planRkno: '',
        planRkk: '',
        address: '',
        remark: '',
        status: 0
      }, {
        rowNum: '',
        pattern: '',
        categoryId: [],
        produceId: '',
        measure: '',
        substrate: '',
        craftId: '',
        planTpno: '',
        planRkno: '',
        planRkk: '',
        address: '',
        remark: '',
        status: 0
      }, {
        rowNum: '',
        pattern: [],
        categoryId: '',
        produceId: '',
        measure: '',
        substrate: '',
        craftId: '',
        planTpno: '',
        planRkno: '',
        planRkk: '',
        address: '',
        remark: '',
        status: 0
      }, {
        rowNum: '',
        pattern: '',
        categoryId: [],
        produceId: '',
        measure: '',
        substrate: '',
        craftId: '',
        planTpno: '',
        planRkno: '',
        planRkk: '',
        address: '',
        remark: '',
        status: 0
      }]
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
          this.xpNoRate = res.data.xpNoRate
          this.xpRealNo = res.data.xpRealNo
          this.xpPlanNo = res.data.xpPlanNo
          this.xpkRate = res.data.xpkRate
          this.xpRealK = res.data.xpRealK
          this.xpPlanK = res.data.xpPlanK
        } else {
          this.wyNoRate = 0
          this.wyRealNo = 0
          this.wyPlanNo = 0
          this.xpNoRate = 0
          this.xpRealNo = 0
          this.xpPlanNo = 0
          this.xpkRate = 0
          this.xpRealK = 0
          this.xpPlanK = 0
        }
      })
    },
    monthChange(month) {
      this.month = month
      this.fetchData(0)
      this.fetchData(1)
      this.getProgress()
    },
    addMonthChange(month) {
      this.addMonth = month
      if (this.monthPlanList.indexOf(this.addMonth) !== -1) {
        this.$message({
          type: 'error',
          message: '该月份已有月度计划!'
        })
        return
      }
    },
    dialogMonthChange(month) {
      this.changeMonth = month
      this.getDialogList(0) // 获取当前月份外延月度计划
      this.getDialogList(1) // 获取当前月份芯片月度计划
    },
    // 获取当前月份月度计划（外延/芯片）
    getDialogList(type) {
      const params = {
        month: this.changeMonth,
        type: type
      }
      queryList(params).then(res => {
        this.isNotPlan = res.data.length === 0
        if (res.data.length === 0) {
          this.$message({
            type: 'error',
            message: '该月份暂未生成月度计划!'
          })
        }
        if (type === 0) {
          this.dialogList = res.data
          this.dialogList.map(item => {
            item['isDisabled'] = true
          })
        } else {
          this.dialogAnotherList = res.data
          this.dialogAnotherList.map(item => {
            item['isDisabled'] = true
            item.categoryId = item.categoryId.split(',').map(Number)
          })
        }
      })
    },
    changeType(value) {
      if (value === 0) {
        this.xpShow = true
      } else {
        this.xpShow = false
      }
    },
    navClick(index) {
      this.isActive = index
      if (index === 1) {
        this.type = 1
      } else {
        this.type = 0
      }
      this.fetchData(this.isActive)
    },
    navClick2(index) {
      this.isActive2 = index
      if (index === 1) {
        this.type = 1
      } else {
        this.type = 0
      }
    },
    async navClick3(index) {
      this.isActive3 = index
      const params = {
        month: this.changeMonth,
        type: index
      }
      this.listLoading = true
      await queryList(params).then(res => {
        const arr = res.data
        if (index === 0) { // 外延
          setTimeout(() => {
            this.listLoading = false
          }, 500)
          // this.dialogList = res.data
          arr.map(item => {
            item['isDisabled'] = true
          })
          this.dialogList = arr
        } else { // 芯片
          // this.dialogAnotherList = res.data
          arr.map(item => {
            item['isDisabled'] = true
            item.categoryId = item.categoryId.split(',').map(Number)
          })
          this.dialogAnotherList = arr
          this.listLoading = false
        }
      })
    },
    addMonthPlan() {
      this.addMonth = this.month
      if (this.monthPlanList.indexOf(this.addMonth) !== -1) {
        this.$message({
          type: 'error',
          message: '该月份已有月度计划!'
        })
        return
      }
      this.addDialogVisible = true
    },
    changeMonthPlan() {
      this.isActive3 = 0
      this.dialogList = [...this.list]
      this.dialogList.map(item => {
        item['isDisabled'] = true
      })
      this.changeDialogVisible = true
      this.changeMonth = this.month
      this.navClick3(0)
    },
    handleDialogClose(done) {
      this.$confirm('是否取消编辑内容？点击确定后本次编辑内容将被清除!', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        done()
      })
    },
    // 新增月度计划
    createMonthly() {
      if (this.monthPlanList.indexOf(this.addMonth) !== -1) {
        this.$message({
          type: 'error',
          message: '该月份已有月度计划!'
        })
        return
      }
      // 验证外延计划
      const scWyMonthPlans = []
      let flag = true
      const productobj = {}
      for (const item of this.addWyList) {
        let products = {}
        if (item.products === '') {
          flag = false
          break
        }
        if (item.planInStorage === '') {
          flag = false
          break
        }
        productobj[item.products] = 1
        for (const product of this.productOptions) {
          if (product.productName === item.products) {
            products = product
            break
          }
        }
        scWyMonthPlans.push({
          creator: sessionStorage.getItem('User-Id'),
          remark: item.remark,
          produce: products.productName,
          planNo: item.planInStorage,
          planMonth: this.formatDate(this.addMonth),
          measureId: products.measureId,
          colorId: products.colorId,
          craftId: products.craftId
        })
      }
      if (!flag) {
        this.$message({
          type: 'error',
          message: '必填项不可为空，请检查后重试!'
        })
        return
      }
      const keys = Object.keys(productobj)
      if (keys.length !== this.addWyList.length) {
        this.$message({
          type: 'error',
          message: '产品重复，请检查后重试!'
        })
        return
      }
      if (scWyMonthPlans.length === 0) {
        this.$message({
          type: 'error',
          message: '至少添加一条数据，外延新增有误!'
        })
        return
      }
      // 验证芯片计划
      const scXpMonthPlans = []
      let flag2 = true
      const strArray = []
      for (const item of this.addXpList) {
        if (item.pattern === '') {
          flag2 = false
          break
        }
        if (item.categoryId === []) {
          flag2 = false
          break
        }
        if (item.produceId === '') {
          flag2 = false
          break
        }
        if (item.substrate === '') {
          flag2 = false
          break
        }
        if (item.craftId === '') {
          flag2 = false
          break
        }
        if (item.planTpno === '') {
          flag2 = false
          break
        }
        if (item.planRkno === '') {
          flag2 = false
          break
        }
        if (item.planRkk === '') {
          flag2 = false
          break
        }
        console.log(item.categoryId, '======categoryId=======')
        if (item.categoryId !== null && item.categoryId !== undefined) {
          if (!(item.categoryId instanceof Array)) {
            item.categoryId = item.categoryId.split(',').map(Number)
          }
          item.categoryId.map(index => {
            strArray.push('' + index + item.pattern + item.produceId + item.substrate + item.craftId)
          })
        }
        scXpMonthPlans.push({
          pattern: item.pattern,
          categoryId: item.categoryId.join(','),
          produceId: item.produceId,
          measure: item.measure,
          substrate: item.substrate.split('-')[0],
          craftId: item.craftId,
          planTpno: item.planTpno,
          planRkno: item.planRkno,
          planRkk: item.planRkk,
          address: item.address,
          remark: item.remark,
          typeId: item.substrate.split('-')[1],
          measureId: item.substrate.split('-')[2],
          planMonth: this.formatDate(this.addMonth),
          creator: sessionStorage.getItem('User-Id')
        })
      }
      if (!flag2) {
        this.$message({
          type: 'error',
          message: '必填项不可为空，请检查后重试!'
        })
        return
      }
      if (new Set(strArray).size !== strArray.length) {
        this.$message({
          type: 'error',
          message: '芯片月度计划重复!'
        })
        return
      }
      if (scXpMonthPlans.length === 0) {
        this.$message({
          type: 'error',
          message: '至少添加一条数据，芯片新增有误！'
        })
        return
      }
      this.$confirm('是否保存内容并生成月度计划？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        const params = {
          scWyMonthPlans: scWyMonthPlans,
          scXpMonthPlans: scXpMonthPlans
        }
        addMonthPlan(params).then(res => {
          this.$message({
            type: 'success',
            message: '生成成功!'
          })
          this.navClick(0)
          this.getProgress()
          this.getPlanMonthFun()
          this.addDialogVisible = false
        })
      })
    },
    addItem() {
      let obj = {}
      if (this.isActive2 === 0) {
        obj = {
          rowNum: '',
          products: this.products,
          planInStorage: this.planInStorage,
          remark: this.remark,
          status: this.status
        }
        this.addWyList.push(obj)
      } else {
        obj = {
          rowNum: '',
          pattern: this.pattern,
          categoryId: this.categoryId,
          produceId: this.produceId,
          measure: this.measure,
          substrate: this.substrate,
          craftId: this.craftId,
          planTpno: this.planTpno,
          planRkno: this.planRkno,
          planRkk: this.planRkk,
          address: this.address,
          remark: this.remark,
          status: this.status
        }
        this.addXpList.push(obj)
      }
    },
    // 新增时删除按钮
    delItem(index) {
      if (this.isActive2 === 0) {
        this.addWyList.splice(index, 1)
      } else {
        this.addXpList.splice(index, 1)
      }
    },
    // 编辑时删除按钮
    delEditItem(index) {
      if (this.isActive3 === 0) {
        this.dialogList.splice(index, 1)
      } else {
        this.dialogAnotherList.splice(index, 1)
      }
    },
    addChangeItem() {
      if (this.isActive3 === 0) {
        this.dialogList.push({
          produce: '',
          planNo: '',
          remark: '',
          isDisabled: false
        })
      } else {
        this.dialogAnotherList.push({
          pattern: this.pattern,
          categoryId: this.categoryId,
          produceId: this.produceId,
          measure: this.measure,
          substrate: this.substrate,
          craftId: this.craftId,
          planTpno: this.planTpno,
          planRkno: this.planRkno,
          planRkk: this.planRkk,
          address: this.address,
          remark: this.remark,
          status: this.status
        })
      }
    },
    changeDialogClose() {
      this.fetchData(0)
      this.fetchData(1)
    },
    // 修改月度计划
    editMonthly() {
      // 验证外延
      const scWyMonthPlans = []
      let flag = true
      const productobj = {}
      for (const item of this.dialogList) {
        if (item.produce === '') {
          flag = false
          break
        }
        if (item.planNo === '') {
          flag = false
          break
        }
        productobj[item.produce] = 1
        let products = {}
        for (const product of this.productOptions) {
          if (product.productName === item.produce) {
            products = product
            break
          }
        }
        scWyMonthPlans.push({
          creator: sessionStorage.getItem('User-Id'),
          remark: item.remark,
          produce: products.productName,
          planNo: item.planNo,
          planMonth: this.formatDate(this.changeMonth),
          measureId: products.measureId,
          colorId: products.colorId,
          craftId: products.craftId,
          id: item.id
        })
      }
      if (!flag) {
        this.$message({
          type: 'error',
          message: '必填项不可为空，请检查后重试!'
        })
        return
      }
      const keys = Object.keys(productobj)
      if (keys.length !== this.dialogList.length) {
        this.$message({
          type: 'error',
          message: '产品重复，请检查后重试!'
        })
        return
      }
      if (scWyMonthPlans.length === 0) {
        console.log(123)
        this.$message({
          type: 'error',
          message: '至少添加一条数据!'
        })
        return
      }
      const scXpMonthPlans = []
      let flag2 = true
      const strArray = []
      for (const item of this.dialogAnotherList) {
        if (item.pattern === '') {
          flag2 = false
          break
        }
        if (item.categoryId === []) {
          flag2 = false
          break
        }
        if (item.produceId === '') {
          flag2 = false
          break
        }
        if (item.substrate === '') {
          flag2 = false
          break
        }
        if (item.craftId === '') {
          flag2 = false
          break
        }
        if (item.planTpno === '') {
          flag2 = false
          break
        }
        if (item.planRkno === '') {
          flag2 = false
          break
        }
        if (item.planRkk === '') {
          flag2 = false
          break
        }
        if (item.categoryId !== null && item.categoryId !== undefined) {
          if (!(item.categoryId instanceof Array)) {
            item.categoryId = item.categoryId.split(',').map(Number)
          }
          item.categoryId.map(index => {
            strArray.push('' + index + item.pattern + item.produceId + item.substrate + item.craftId)
          })
        }
        scXpMonthPlans.push({
          pattern: item.pattern,
          categoryId: item.categoryId.join(','),
          produceId: item.produceId,
          measure: item.measure,
          substrate: item.substrate.indexOf !== -1 ? item.substrate.split('-')[0] : item.substrate,
          craftId: item.craftId,
          planTpno: item.planTpno,
          planRkno: item.planRkno,
          planRkk: item.planRkk,
          address: item.address,
          remark: item.remark,
          typeId: item.substrate.indexOf !== -1 ? item.substrate.split('-')[1] : item.typeId,
          measureId: item.substrate.indexOf !== -1 ? item.substrate.split('-')[2] : item.measureId,
          planMonth: this.formatDate(this.changeMonth),
          creator: sessionStorage.getItem('User-Id'),
          id: item.id
        })
      }
      if (!flag2) {
        this.$message({
          type: 'error',
          message: '必填项不可为空，请检查后重试!'
        })
        return
      }
      if (new Set(strArray).size !== strArray.length) {
        this.$message({
          type: 'error',
          message: '芯片月度计划重复!'
        })
        return
      }
      if (scXpMonthPlans.length === 0) {
        this.$message({
          type: 'error',
          message: '至少添加一条数据!'
        })
        return
      }
      this.$confirm('是否修改内容并生成月度计划？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        const params = {
          scWyMonthPlans: scWyMonthPlans,
          scXpMonthPlans: scXpMonthPlans
        }
        changeMonthPlan(params).then(res => {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.navClick(0)
          this.getProgress()
          this.changeDialogVisible = false
        })
      })
    },
    // 取消投产
    cancelTc(row) {
      const params = {
        type: this.isActive3,
        id: row.id
      }
      cancelTc(params).then(res => {
        this.navClick3(this.isActive3).then(() => {
          this.$message.success('修改成功！')
        })
      })
    },
    // 恢复投产
    recoverTc(row) {
      const params = {
        type: this.isActive3,
        id: row.id
      }
      recoverTc(params).then(res => {
        this.navClick3(this.isActive3).then(() => {
          this.$message.success('修改成功！')
        })
      })
    },
    // 变更日志
    changeLog() {
      this.updateDialogVisible = true
      this.changeLogSev()
      if (this.type === 0) {
        this.showLogDiv = true
      } else {
        this.showLogDiv = false
      }
    },
    getProductType() {
      const params = {
        pageSize: 9999999,
        pageNum: 1
      }
      getProductType(params).then(res => {
        this.productOptions = res.data
      })
    },
    scCategoryList() {
      scCategoryList().then(res => {
        this.categoryList = res.data.list
      })
    },
    getProductModelFun() {
      getProductModel().then(res => {
        this.modelList = res.data
      })
    },
    changeProduce(row) {
      this.modelList.forEach(item => {
        if (item.id === row.produceId) {
          row.measure = item.measure
        }
      })
    },
    getPlanMonthFun() {
      getPlanMonth().then(res => {
        this.monthPlanList = res.data
      })
    },
    findSubstrateMeasureList() {
      findSubstrateMeasureList().then(res => {
        // this.measureList = res.data
      })
    },
    getChenDi() {
      getChenDi().then(res => {
        this.measureList = res.data
      })
    },
    findGYlListFun() {
      findGYlList().then(res => {
        this.gyList = res.data.list
      })
    },
    changeLogSev() {
      const params = {
        month: this.month,
        type: this.type
      }
      changeLog(params).then(res => {
        if (this.type === 0) {
          this.changeWyLogList = res.data
        } else {
          this.changeXpLogList = res.data
        }
      })
    },
    // 每页数量改变
    sizeChange(pageSize) {
      this.pageSize = pageSize
      this.fetchData(0)
      this.fetchData(1)
    },
    // 当前页数改变
    currentChange(pageNum) {
      this.pageNum = pageNum
      this.fetchData(0)
      this.fetchData(1)
    },
    handleSearch() {
      this.pageNum = 1
      this.fetchData(0)
      this.fetchData(1)
    },
    chanceList() {
      this.innerVisible = false
      this.selectList = []
    },
    getNowFormatDate() {
      var today = new Date()
      return this.formatDate(today.getTime())
    },
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      // var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length)// + '-' + d.substring(d.length - 2, d.length)
    },
    // 查询
    fetchData(typeId) {
      typeId = typeId || this.type
      const params = {
        month: this.month,
        type: typeId
      }
      this.listLoading = true
      queryList(params).then(res => {
        this.isNotPlan = res.data.length === 0
        if (typeId === 0) {
          this.list = res.data
        } else {
          this.anotherlist = res.data
        }
        this.totalPage = parseInt(res.data.length)
        this.listLoading = false
        this.dialogList = [...this.list]
        this.dialogList.map(item => {
          item['isDisabled'] = true
        })
        this.dialogAnotherList = [...this.anotherlist]
        this.dialogAnotherList.map(item => {
          item['isDisabled'] = true
        })
      }, res => {
        this.listLoading = false
      })
    }
  }
}

