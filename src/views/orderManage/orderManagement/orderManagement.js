
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findOutboundRecord } from '@/api/orderManage/orderManagement'
import custormizatoinDia from '../custormizatoinDia'
import orderDia from '../orderDia'
import { findById } from '@/api/orderManage/custormization'
import { findCustomer } from '@/api/orderManage/custormization'
import { findList, deleteFake } from '@/api/orderManage/orderManagement'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd, custormizatoinDia, orderDia },

  data() {
    return {
      listLoading: false,
      metalDialogVisible: false,
      dialogVisible: false,
      needSample: false,
      isView: false,
      isAdd: true,
      dialogImageUrl: '',
      materialType: 0,
      currentInitiator: '',
      tableList: [],
      row: {},
      fileList: [],
      fileUrl: process.env.BASE_API + '/attachment/upload',
      totalPage: 0,
      orderTitle: '',
      pickerOptionsStart: {
        disabledDate: (time) => {
          const endDateVal = this.searchKeys.endTime
          if (endDateVal) {
            return time.getTime() >= new Date(endDateVal).getTime()
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          const beginDateVal = this.searchKeys.startTime
          if (beginDateVal) {
            return time.getTime() <= new Date(beginDateVal).getTime() - 60 * 60 * 24 * 1000
          }
        }
      },
      resultOptions: [
        { id: 0, name: '出库' },
        { id: 1, name: '备货' }
      ],
      statusOptions: [ // 订单状态
        { id: 0, name: '草稿' },
        { id: 1, name: '待接收' },
        { id: 2, name: '出货中' },
        { id: 3, name: '已完成' },
        { id: 4, name: '备货完成' }
      ],

      orderForm: {},
      customerList: [],
      searchKeys: {
        orderNo: '',
        orderType: '',
        status: '',
        customerId: '',
        startTime: '',
        endTime: '',
        timeType: 2,
        pageNum: 1,
        pageSize: 15
      },
      isRow: 0,
      // 查看客制化规则
      custormForm: {},
      kzhDialog1: false,
      outList: [], // 出库的表头
      ckDialog: false,
      ckList: [],
      disabled: false,
      currentId: ''
    }
  },
  mounted() {
    this.findCustomer()
    // this.fetchCustormData()
    this.clearSearch() // 初始化搜索条件
  },
  watch: {

  },
  methods: {

    // 获取客户信息
    findCustomer() {
      findCustomer().then((res) => {
        this.customerList = res.data
      })
    },

    // 初始化筛选条件
    clearSearch() {
      this.searchKeys.orderNo = ''
      this.searchKeys.orderType = ''
      this.searchKeys.status = ''
      this.searchKeys.customerId = ''
      this.searchKeys.timeType = 2
      this.searchKeys.startTime = this.formatDate(new Date().getTime() - 60 * 60 * 1000 * 24 * 6)
      this.searchKeys.endTime = this.formatDate(new Date().getTime())
      this.searchKeys.pageNum = 1
      this.searchKeys.pageSize = 15
      this.handleSearch()
    },
    // 查询订单列表
    fetchData() {
      this.listLoading = true
      const params = {
        pageNum: this.searchKeys.pageNum,
        pageSize: this.searchKeys.pageSize,
        timeType: this.searchKeys.timeType, // 时间
        startTime: this.searchKeys.startTime === '' ? '' : this.formatDate(new Date(this.searchKeys.startTime).getTime()),
        endTime: this.searchKeys.endTime === '' ? '' : this.formatDate(new Date(this.searchKeys.endTime).getTime()),
        status: this.searchKeys.status, // 订单状态
        orderNo: this.searchKeys.orderNo,
        customerId: this.searchKeys.customerId,
        orderType: this.searchKeys.orderType
      }
      findList(params).then(res => {
        this.tableList = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    // 查询出库
    findOutboundRecord(row) {
      // this.initEdit(row)
      this.ckDialog = true
      this.listLoading = true
      findOutboundRecord({ orderId: row.id }).then(res => {
        this.ckList = res.data
        this.listLoading = false
      })
    },
    // 新增订单
    smallBatchSample() {
      this.disabled = false
      this.metalDialogVisible = true
      this.orderTitle = '新增订单'
      this.isRow = 1
      // this.$refs.orderForm.clearValidate()
    },
    // 编辑
    handleEdit(row, index) {
      this.isRow = 2
      this.disabled = false
      this.orderTitle = '编辑订单'
      this.row = row
      this.metalDialogVisible = true
    },
    // 查看
    handleView(row) {
      this.row = row
      this.isRow = 2
      this.orderTitle = '查看订单'
      this.metalDialogVisible = true
      this.disabled = true
    },
    // 删除
    handleDelete(id, status) {
      let str = ''
      switch (status) {
        case 2:
          str = '转为出库'
          break
        case 3:
          str = '确认关闭'
          break
        case 6:
          str = '确认删除'
          break
      }
      this.$confirm(`是否${str}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          orderId: id,
          status: status
        }
        deleteFake(param).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.fetchData()
        })
      })
    },
    handleRowStyle({ row }) {
      if (row.priority) {
        return 'background: rgb(248, 218, 218)'
      }
    },
    // 每页数量改变
    sizeChange(pageSize) {
      this.searchKeys.pageSize = pageSize
      this.fetchData()
    },
    // 当前页数改变
    currentChange(pageNum) {
      this.searchKeys.pageNum = pageNum
      this.fetchData()
    },
    handleSearch() {
      this.fetchData()
    },
    // 查看客制化规则
    watchCustorm(type, ruleId) {
      if (type === 'form') {
        if (this.orderForm.ruleId) {
          this.kzhDialog = true
          this.changePattern(this.orderForm.ruleId)
        } else {
          this.$message.error('请先选择要查看的客制化规则')
        }
      } else {
        const requestParams = {
          ruleId: ruleId,
          pageSize: 999,
          pageNum: 1
        }
        findById(requestParams).then(res => {
          this.custormForm = res.data
          this.kzhDialog1 = true
        })
      }
    },
    dialogFalse(val) {
      console.log(val)
      this.metalDialogVisible = val.orderVisible
      if (val.show) {
        this.fetchData()
      }
    },
    // 时间戳转yyyy-mm-dd
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    }

  }
}

