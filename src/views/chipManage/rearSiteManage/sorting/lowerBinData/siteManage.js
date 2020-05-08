
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findList, findMachineList, productList, findMather, mulFind } from '@/api/chipManage/rearSiteManage/sorting/lowerBinData'
import Cookies from 'js-cookie'
const furnaceList = [
  {
    thName: 'ChipNo',
    thKey: 'binNo',
    width: 200
  },
  {
    thName: '状态',
    thKey: 'status',
    width: 90
  },
  {
    thName: 'Bin类型',
    thKey: 'binType',
    width: 90
  },
  {
    thName: '母片详情',
    thKey: 'mother',
    width: 100
  },
  {
    thName: '产品代码',
    thKey: 'productCode',
    width: 100
  },
  {
    thName: '下Bin时间',
    thKey: 'binTime',
    width: 150
  },
  {
    thName: '铁环号',
    thKey: 'barcode',
    width: 100
  },
  {
    thName: '数量',
    thKey: 'allTotal',
    width: 100
  },
  {
    thName: '晶粒计数',
    thKey: 'binCount',
    width: 100
  },
  {
    thName: 'WLD1_MIN',
    thKey: 'wld1Min',
    width: 120
  },
  {
    thName: 'WLD1_AVG',
    thKey: 'wld1Avg',
    width: 120
  },
  {
    thName: 'WLD1_MAX',
    thKey: 'wld1Max',
    width: 120
  },
  {
    thName: 'WLD1_STD',
    thKey: 'wld1Std',
    width: 120
  },
  {
    thName: 'IV_MIN',
    thKey: 'ivMin',
    width: 100
  },
  {
    thName: 'IV_AVG',
    thKey: 'ivAvg',
    width: 100
  },
  {
    thName: 'IV_MAX',
    thKey: 'ivMax',
    width: 100
  },
  {
    thName: 'IV_STD',
    thKey: 'ivStd',
    width: 100
  },
  {
    thName: 'VF1_MIN',
    thKey: 'vf1Min',
    width: 100
  },
  {
    thName: 'VF1_AVG',
    thKey: 'vf1Avg',
    width: 100
  },
  {
    thName: 'VF1_MAX',
    thKey: 'vf1Max',
    width: 100
  },
  {
    thName: 'VF1_STD',
    thKey: 'vf1Std',
    width: 100
  },
  {
    thName: 'IR_MIN',
    thKey: 'irMin',
    width: 100
  },
  {
    thName: 'IR_AVG',
    thKey: 'irAvg',
    width: 100
  },
  {
    thName: 'IR_MAX',
    thKey: 'irMax',
    width: 100
  },
  {
    thName: 'IR_STD',
    thKey: 'irStd',
    width: 100
  },
  {
    thName: 'VZ1_MIN',
    thKey: 'vz1Min',
    width: 100
  },
  {
    thName: 'VZ1_AVG',
    thKey: 'vz1Avg',
    width: 100
  },
  {
    thName: 'VZ1_MAX',
    thKey: 'vz1Max',
    width: 100
  },
  {
    thName: 'VZ1_STD',
    thKey: 'vz1Std',
    width: 100
  },
  {
    thName: 'WLP1_MIN',
    thKey: 'wlp1Min',
    width: 100
  },
  {
    thName: 'WLP1_AVG',
    thKey: 'wlp1Avg',
    width: 100
  },
  {
    thName: 'WLP1_MAX',
    thKey: 'wlp1Max',
    width: 100
  },
  {
    thName: 'WLP1_STD',
    thKey: 'wlp1Std',
    width: 100
  },
  {
    thName: 'WLC1_MIN',
    thKey: 'wlc1Min',
    width: 100
  },
  {
    thName: 'WLC1_AVG',
    thKey: 'wlc1Avg',
    width: 100
  },
  {
    thName: 'WLC1_MAX',
    thKey: 'wlc1Max',
    width: 100
  },
  {
    thName: 'WLC1_STD',
    thKey: 'wlc1Std',
    width: 100
  },
  {
    thName: '导入时间',
    thKey: 'importTime',
    width: 150
  },
  {
    thName: '机台',
    thKey: 'machine',
    width: 90
  },
  {
    thName: '文档详细',
    thKey: 'info',
    width: 100
  }
]
const furnaceList1 = [
  {
    thName: 'Bin类型',
    thKey: 'binType',
    width: 90
  },
  {
    thName: '母片详情',
    thKey: 'mother',
    width: 100
  },
  {
    thName: '产品代码',
    thKey: 'productCode',
    width: 100
  },
  {
    thName: '下Bin时间',
    thKey: 'binTime',
    width: 150
  },
  {
    thName: '铁环号',
    thKey: 'barcode',
    width: 100
  },
  {
    thName: '数量',
    thKey: 'allTotal',
    width: 100
  },
  {
    thName: '晶粒计数',
    thKey: 'binCount',
    width: 100
  },
  {
    thName: 'WLD1_MIN',
    thKey: 'wld1Min',
    width: 120
  },
  {
    thName: 'WLD1_AVG',
    thKey: 'wld1Avg',
    width: 120
  },
  {
    thName: 'WLD1_MAX',
    thKey: 'wld1Max',
    width: 120
  },
  {
    thName: 'WLD1_STD',
    thKey: 'wld1Std',
    width: 120
  },
  {
    thName: 'IV_MIN',
    thKey: 'ivMin',
    width: 100
  },
  {
    thName: 'IV_AVG',
    thKey: 'ivAvg',
    width: 100
  },
  {
    thName: 'IV_MAX',
    thKey: 'ivMax',
    width: 100
  },
  {
    thName: 'IV_STD',
    thKey: 'irStd',
    width: 100
  },
  {
    thName: 'VF1_MIN',
    thKey: 'vf1Min',
    width: 100
  },
  {
    thName: 'VF1_AVG',
    thKey: 'vf1Avg',
    width: 100
  },
  {
    thName: 'VF1_MAX',
    thKey: 'vf1Max',
    width: 100
  },
  {
    thName: 'VF1_STD',
    thKey: 'vf1Std',
    width: 100
  },
  {
    thName: 'IR_MIN',
    thKey: 'irMin',
    width: 100
  },
  {
    thName: 'IR_AVG',
    thKey: 'irAvg',
    width: 100
  },
  {
    thName: 'IR_MAX',
    thKey: 'irMax',
    width: 100
  },
  {
    thName: 'IR_STD',
    thKey: 'irStd',
    width: 100
  },
  {
    thName: 'VZ1_MIN',
    thKey: 'vz1Min',
    width: 100
  },
  {
    thName: 'VZ1_AVG',
    thKey: 'vz1Avg',
    width: 100
  },
  {
    thName: 'VZ1_MAX',
    thKey: 'vz1Max',
    width: 100
  },
  {
    thName: 'VZ1_STD',
    thKey: 'vz1Std',
    width: 100
  },
  {
    thName: 'WLP1_MIN',
    thKey: 'wlp1Min',
    width: 100
  },
  {
    thName: 'WLP1_AVG',
    thKey: 'wlp1Avg',
    width: 100
  },
  {
    thName: 'WLP1_MAX',
    thKey: 'wlp1Max',
    width: 100
  },
  {
    thName: 'WLP1_STD',
    thKey: 'wlp1Std',
    width: 100
  },
  {
    thName: 'WLC1_MIN',
    thKey: 'wlc1Min',
    width: 100
  },
  {
    thName: 'WLC1_AVG',
    thKey: 'wlc1Avg',
    width: 100
  },
  {
    thName: 'WLC1_MAX',
    thKey: 'wlc1Max',
    width: 100
  },
  {
    thName: 'WLC1_STD',
    thKey: 'wlc1Std',
    width: 100
  },
  {
    thName: '导入时间',
    thKey: 'importTime',
    width: 150
  },
  {
    thName: '机台',
    thKey: 'machine',
    width: 90
  },
  {
    thName: '文档详细',
    thKey: 'info',
    width: 100
  }
]
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      mulQueryDialogVisible: false,
      isMulFind: false,
      mulForm: {
        mulWaferID: ''
      },
      mulrules: {
        mulWaferID: [{ required: true, message: '请输入waferID', trigger: 'blur' }]
      },
      mulWaferID: '',
      searchName: '',
      list: [],
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
      selectTheadVisble: false,
      formThead: furnaceList1,
      theadOptions: furnaceList,
      formTheadOptions: furnaceList,
      machine: '',
      machineList: [],
      type: '0',
      binNo: '',
      productCode: '',
      productLists: [],
      status: '',
      pageSize: 12,
      pageNum: 1,
      totalPage: 0,
      motherList: [],
      checkboxVal: furnaceList,
      statusList: [
        {
          id: 1,
          name: '待回测'
        },
        {
          id: 2,
          name: '待清洗'
        },
        {
          id: 3,
          name: '待目检'
        },
        {
          id: 4,
          name: '待入库'
        },
        {
          id: 5,
          name: '入库完成'
        }
      ]
    }
  },
  mounted() {
    const fpNo = Cookies.get('fpNo')
    if (fpNo !== null && fpNo !== '' && fpNo !== undefined) {
      this.binNo = fpNo
      Cookies.remove('fpNo')
    }
    var checkboxVallowerbindata = localStorage.getItem('checkboxVallowerbindata')
    if (checkboxVallowerbindata !== null && checkboxVallowerbindata !== undefined) {
      this.formThead = JSON.parse(checkboxVallowerbindata)
      const arr = []
      this.theadOptions.map((item) => {
        this.formThead.map((val) => {
          if (item.thName === val.thName) {
            arr.push(item)
          }
        })
      })
      this.checkboxVal = arr
    }
    this.fetchData()
    this.findMachineList()
    this.productList()
  },
  methods: {
    findMachineList() {
      findMachineList().then(res => {
        this.machineList = res.data.list
      })
    },
    productList() {
      productList().then(res => {
        this.productLists = res.data
      })
    },
    selectThead() {
      this.selectTheadVisble = !this.selectTheadVisble
    },
    handleSearch() {
      this.pageNum = 1
      this.fetchData()
    },
    // 批量查询
    mulSearchClick() {
      this.mulQueryDialogVisible = true
    },
    submitOption() {
      const arr = []
      this.theadOptions.map((item) => {
        this.checkboxVal.map((val) => {
          if (item.thName === val.thName && val.thName !== 'ChipNo' && val.thName !== '状态') {
            arr.push(item)
          }
        })
      })
      this.formThead = arr
      localStorage.setItem('checkboxVallowerbindata', JSON.stringify(arr))
      this.selectTheadVisble = false
    },
    // 每页数量改变
    sizeChange(pageSize) {
      this.pageSize = pageSize
      if (this.isMulFind) {
        this.mulWaferFind()
      } else {
        this.fetchData()
      }
    },
    // 当前页数改变
    currentChange(pageNum) {
      this.pageNum = pageNum
      if (this.isMulFind) {
        this.mulWaferFind()
      } else {
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
    },
    clearSearch() {
      this.beginDate = ''
      this.endDate = ''
      this.type = '0'
      this.productCode = ''
      this.binNo = ''
      this.status = ''
      this.machine = ''
      this.pageNum = 1
      this.fetchData()
    },
    // 查询
    fetchData() {
      this.isMulFind = false
      this.listLoading = true
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate),
        type: this.type,
        binNo: this.binNo,
        productCode: this.productCode === '' ? '' : this.productCode.split('-')[0],
        status: this.status,
        machine: this.machine
      }
      findList(params).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    findMather(row) {
      this.addDialogVisible = true
      const params = {
        binNo: row.binNo
      }
      findMather(params).then(res => {
        this.motherList = res.data
      })
    },
    download(row) {
      window.open(process.env.BASE_API + `/attachment/downByPath?path=${row.filePath}`, '_blank')
    },
    importExcel() {
      let columnEn = 'binNo'
      let columnCn = 'binNo'
      for (const item of this.formThead) {
        if (item.thName !== '母片详情' && item.thName !== '文档详细') {
          if (columnCn === '') {
            columnCn = item.thName
          } else {
            columnCn = columnCn + ';' + item.thName
          }
          if (columnEn === '') {
            columnEn = item.thKey
          } else {
            columnEn = columnEn + ',' + item.thKey
          }
        }
      }
      if (columnCn === '') {
        this.$message({
          type: 'error',
          message: '显示列为空!'
        })
        return
      }
      const startTime = this.beginDate === '' ? '' : this.formatDate(this.beginDate)
      const endTime = this.endDate === '' ? '' : this.formatDate(this.endDate)
      if (this.isMulFind) {
        this.mulWaferID = this.mulWaferID.replace(/\n/g, ',').replace(/\r\n/g, ',').replace(/\r/g, ',')
        window.open(process.env.BASE_API + `/xpDownBin/mulFindExport?mulWaferId=${this.mulWaferID}&columnEn=${columnEn}&columnCn=${columnCn}`, '_blank')
        this.mulWaferID = this.mulWaferID.replace(/,/g, '\n')
      } else {
        window.open(process.env.BASE_API + `/xpDownBin/export?startTime=${startTime}&endTime=${endTime}&binNo=${this.binNo}&productCode=${this.productCode}&machine=${this.machine}&status=${this.status}&type=${this.type}&columnCn=${columnCn}&columnEn=${columnEn}`, '_blank')
      }
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (index === 2) {
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            sums[index] += ''
          } else {
            sums[index] = ''
          }
        } else {
          sums[index] = ''
        }
      })
      return sums
    },
    openUrl(row) {
      Cookies.set('motherNo', row.waferNo)
      this.$router.push({ path: '/sorting/motherSliceData' })
    },
    resetForm(formName) {
      this.mulQueryDialogVisible = false
      this.$refs[formName].resetFields()
    },
    // waferId批量查询
    mulWaferFind() {
      this.isMulFind = true
      this.listLoading = true
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        mulWaferId: this.mulWaferID
      }
      mulFind(params).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
        this.mulQueryDialogVisible = false
      })
    },
    // wafer批量查询提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.mulWaferID = this.mulForm.mulWaferID
          this.mulWaferFind()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 批量下载
    mulDownFile() {
      if (this.list.length === 0) {
        this.$message({
          type: 'error',
          message: '列表中尚未数据，请查询后再下载!'
        })
      }
      let binNos = this.list[0].binNo
      for (let i = 1, ilen = this.list.length; i < ilen; i++) {
        binNos += ',' + this.list[i].binNo
      }
      console.log(binNos)
      window.open(process.env.BASE_API + `/xpDownBin/mulDown?binNos=${binNos}`)
    }
  }
}

