
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findMachineList, findList } from '@/api/chipManage/rearSiteManage/sorting/sortingScheduling'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      list: [],
      pageSize: 12,
      pageNum: 1,
      totalPage: 0,
      beginDate: '',
      endDate: '',
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
      type: '',
      waferNo: '',
      machineId: '',
      status: '',
      machineList: [],
      typeList: [
        {
          id: 0,
          name: '常规调度'
        },
        {
          id: 1,
          name: '提前调度'
        }
      ],
      statusList: [
        {
          name: '成功'
        },
        {
          name: '分选类型不匹配'
        },
        {
          name: '原文件不存在，请确认'
        },
        {
          name: '分选中，无法还原'
        },
        {
          name: '档案不存在'
        }
      ]
    }
  },
  mounted() {
    this.fetchData()
    this.findMachineList()
  },
  methods: {
    findMachineList() {
      findMachineList().then(res => {
        this.machineList = res.data.list
      })
    },
    handleSearch() {
      this.pageNum = 1
      this.fetchData()
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
    // 时间戳转yyyy-mm-dd
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    clearSearch() {
      this.beginDate = ''
      this.endDate = ''
      this.waferNo = ''
      this.status = ''
      this.type = ''
      this.machineId = ''
      this.pageNum = 1
      this.fetchData()
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate),
        waferNo: this.waferNo,
        machineId: this.machineId,
        status: this.status,
        type: this.type
      }
      findList(params).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    }
  }
}

