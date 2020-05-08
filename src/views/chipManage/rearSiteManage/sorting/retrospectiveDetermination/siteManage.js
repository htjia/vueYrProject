
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { scProductModel, findColorList, setList, findField, setSave, findAnalysis, updateAnalysis, backFind, findRecord, findBinField, insertBinField } from '@/api/chipManage/rearSiteManage/sorting/retrospectiveDetermination'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      listLoading1: false,
      addDialogVisible: false,
      selectVisible: false,
      logDialogVisible: false,
      qzDialogVisible: false,
      innerVisible: false,
      setindex: 0,
      beginDate: '',
      endDate: '',
      products: '',
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
      isActive: 0,
      list: [],
      pageSize: 12,
      pageNum: 1,
      totalPage: 0,
      setpageSize: 12,
      setpageNum: 1,
      settotalPage: 0,
      logpageSize: 12,
      logpageNum: 1,
      logtotalPage: 0,
      productList: [],
      color: '',
      colorList: [],
      setProduct: '',
      getset: '',
      product: '',
      binNo: '',
      data2: [
        {
          id: 1,
          label: '下bin档案和bin表对比项',
          children: [
            {
              id: 11,
              label: 'VF1',
              key: 'vf1'
            },
            {
              id: 12,
              label: 'VZ',
              key: 'vz'
            },
            {
              id: 13,
              label: 'IR',
              key: 'ir'
            },
            {
              id: 14,
              label: 'LOP',
              key: 'lop'
            },
            {
              id: 15,
              label: 'WLD',
              key: 'wld'
            },
            {
              id: 16,
              label: 'WLP',
              key: 'wlp'
            },
            {
              id: 17,
              label: 'WLC',
              key: 'wlc'
            }
          ]
        },
        {
          id: 2,
          label: 'bin表独有数据',
          children: [
            {
              id: 21,
              label: 'VF2',
              key: 'vf2'
            },
            {
              id: 22,
              label: 'VF3',
              key: 'vf3'
            },
            {
              id: 23,
              label: 'VF4',
              key: 'vf4'
            },
            {
              id: 24,
              label: 'VFD',
              key: 'vfd'
            },
            {
              id: 25,
              label: 'DVF',
              key: 'dvf'
            },
            {
              id: 26,
              label: 'IRESDA',
              key: 'iresda'
            },
            {
              id: 27,
              label: 'BS',
              key: 'bs'
            },
            {
              id: 28,
              label: 'HW',
              key: 'hw'
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      showList: [],
      logBinNo: '',
      setlists: [],
      setlists1: [],
      logList: [],
      valueList: [
        {
          id: 0,
          name: '数值'
        },
        {
          id: 1,
          name: '%'
        }
      ],
      qzLists: [],
      baseList: [],
      backDataOne: [],
      testlist: [],
      binTitleList: [],
      binList: [],
      blTitle: [],
      blList: [],
      qzParamsLists: [],
      analysis: null,
      fcsjList: [],
      binsjList: [],
      fcbzList: [],
      status: -1,
      remark: [],
      logbltjTitle: [],
      column3: [],
      defaultChecked: [],
      setPushList: []
    }
  },
  mounted() {
    this.fetchData()
    this.scProductModel()
  },
  methods: {
    scProductModel() {
      scProductModel().then(res => {
        this.productList = res.data
      })
    },
    findColorList() {
      findColorList().then(res => {
        this.colorList = res.data
      })
    },
    setParams() {
      findBinField().then(res => {
        this.innerVisible = true
        this.defaultChecked = []
        for (const data of this.data2[0].children) {
          for (const sets of this.showList) {
            if (sets.field === data.key) {
              this.defaultChecked.push(data.id)
            }
          }
        }
        for (const data of this.data2[1].children) {
          for (const sets of res.data) {
            if (sets === data.key) {
              this.defaultChecked.push(data.id)
            }
          }
        }
      })
    },
    setTree() {
      const getNodes = this.$refs.tree.getCheckedNodes()
      this.showList = []
      const fields = []
      const fieldsTwo = []
      const setInfoList = []
      for (const item of this.setlists) {
        setInfoList.push(item)
      }
      this.setlists = []
      for (const item of getNodes) {
        if (item.id > 10 && item.id < 20) {
          this.showList.push({
            field: item.key,
            key: item.label,
            type: 0
          })
          fieldsTwo.push(item.key)
        } else if (item.id > 20) {
          fields.push(item.key)
        }
      }
      for (let i = 0; i < setInfoList.length; i++) {
        for (const sets of this.showList) {
          var field = {
            field: sets.field,
            maxVal: '',
            minVal: '',
            poor: ''
          }
          if (setInfoList[i][sets.field] === null || setInfoList[i][sets.field] === undefined) {
            setInfoList[i][sets.field] = field
          }
        }
      }
      // if (fields.length > 0) {
      insertBinField({ fields: fields.join(), fieldsTwo: fieldsTwo.join() }).then(res => { console.log(res) })
      // }
      for (const item of setInfoList) {
        var data = {
          code: item.code,
          color: item.color,
          id: item.id,
          isCheck: item.isCheck,
          model: item.model
        }
        for (const sets of this.showList) {
          data[sets.field] = item[sets.field]
        }
        this.setlists.push(data)
      }
      this.$refs.tree.setCheckedKeys([])
      this.innerVisible = false
    },
    cancelTree() {
      this.defaultChecked = []
      this.$refs.tree.setCheckedKeys([])
      this.innerVisible = false
    },
    navClick(index) {
      this.isActive = index
      this.logfetchData()
    },
    handleSetSearch() {
      this.setpageNum = 1
      this.setfetchData()
    },
    handlelogSearch() {
      this.logpageNum = 1
      this.logfetchData()
    },
    handleSearch() {
      if (this.product === '') {
        if (this.binNo !== '') {
          const pro = this.binNo.split('-')
          const pro1 = pro[0]
          for (const item of this.productList) {
            const code = item.code.split('-')[0]
            if (pro1 === code) {
              this.product = item.code
              break
            }
          }
        } else {
          console.log(123)
          this.$message({
            type: 'error',
            message: '请先选择产品代码'
          })
        }
      } else if (this.binNo === '') {
        this.$message({
          type: 'error',
          message: '请先扫描ChipNo'
        })
      }
      this.pageNum = 1
      this.fetchData()
    },
    clearCondition() {
      this.pageNum = 1
      this.product = ''
      this.binNo = ''
      this.fetchData()
    },
    // 每页数量改变
    setsizeChange(pageSize) {
      this.setpageSize = pageSize
      this.setfetchData()
    },
    // 当前页数改变
    setcurrentChange(pageNum) {
      this.setpageNum = pageNum
      this.setfetchData()
    },
    // 每页数量改变
    logsizeChange(pageSize) {
      this.logpageSize = pageSize
      this.logfetchData()
    },
    // 当前页数改变
    logcurrentChange(pageNum) {
      this.logpageNum = pageNum
      this.logfetchData()
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
    handleSetEdit(row) {
      row.isCheck = true
    },
    handleSetEdits(index) {
      this.setindex = index
      this.getset = ''
      this.selectVisible = true
    },
    setsedt() {
      if (this.getset === '') {
        this.$message({
          type: 'error',
          message: '请先选择产品代码'
        })
        return
      }
      this.setlists[this.setindex].isCheck = true
      var data = null
      for (const item of this.setlists) {
        if (this.getset === item.code) {
          data = item
          break
        }
      }
      const keys = Object.keys(data)
      for (const key of keys) {
        if (key !== 'id' && key !== 'code' && key !== 'color' && key !== 'model' && key !== 'isCheck') {
          this.setlists[this.setindex][key].minVal = data[key].minVal
          this.setlists[this.setindex][key].maxVal = data[key].maxVal
          this.setlists[this.setindex][key].poor = data[key].poor
        }
      }
      this.selectVisible = false
    },
    handleCancelEdit(row) {
      row.isCheck = false
    },
    handleQZAdd() {
      if (this.product === '') {
        console.log(123)
        this.$message({
          type: 'error',
          message: '请先选择产品代码'
        })
      } else {
        this.qzDialogVisible = true
        const paramCode = {
          code: this.product
        }
        findAnalysis(paramCode).then(res => {
          this.qzLists = []
          for (const item of res.data.list) {
            item.isCheck = false
            this.qzLists.push(item)
          }
        })
      }
    },
    handleQZSave(row) {
      updateAnalysis(row).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          row.isCheck = false
        }
      })
    },
    handleQZEdit(row) {
      row.isCheck = true
    },
    handleCancelQZ(row) {
      row.isCheck = false
    },
    handleSaveEdit(row) {
      let flag1 = false
      let flag3 = false
      const detailList = []
      for (const item of this.showList) {
        if (row[item.field].minVal !== '' && row[item.field].maxVal !== '' && row[item.field].poor !== '') {
          const minval = parseFloat(row[item.field].minVal) + ''
          const maxval = parseFloat(row[item.field].maxVal) + ''
          if (minval !== row[item.field].minVal + '' || maxval !== row[item.field].maxVal + '') {
            flag3 = true
            break
          }
          if ((parseFloat(row[item.field].minVal) > 100 || parseFloat(row[item.field].maxVal) > 100) && item.field !== 'lop' && item.field !== 'vf1' && item.field !== 'wlp' && item.field !== 'wld') {
            flag1 = true
            break
          }
          detailList.push({
            field: item.field,
            maxVal: row[item.field].maxVal,
            minVal: row[item.field].minVal,
            poor: row[item.field].poor
          })
        }
      }
      if (flag3) {
        this.$message({
          type: 'error',
          message: '输入数值不正确!'
        })
        return
      }
      if (flag1) {
        this.$message({
          type: 'error',
          message: '输入上下限值不能超过100!'
        })
        return
      }
      if (detailList.length === 0) {
        this.$message({
          type: 'error',
          message: '尚未填写任何参数或输入数值不正确!'
        })
        return
      }
      const params = {
        code: row.code,
        color: row.color,
        model: row.model,
        detailList: detailList,
        type: row.type
      }
      setSave(params).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          row.isCheck = false
        }
      })
    },
    tableRowClassColor({ row, column, rowIndex, columnIndex }) {
      if (columnIndex < 3) {
        return 'background: #fff'
      }
    },
    // 查询
    setfetchData() {
      this.listLoading1 = true
      findField({ code: '' }).then(res => {
        this.showList = []
        for (const item of res.data) {
          if (item.field === 'lop') {
            this.showList.push({
              field: item.field,
              key: item.field.toUpperCase() + '%',
              type: 0
            })
          } else {
            this.showList.push({
              field: item.field,
              key: item.field.toUpperCase(),
              type: 0
            })
          }
        }
        const params = {
          pageNum: this.setpageNum,
          pageSize: this.setpageSize,
          color: this.color,
          code: this.setProduct
        }
        setList(params).then(res => {
          this.setlists = []
          for (const item of res.data.list) {
            const data = {
              id: item.id,
              code: item.code,
              color: item.color,
              model: item.model,
              isCheck: false
            }
            if (this.showList.length > 0) {
              for (const sets of this.showList) {
                let field = {
                  field: sets.field,
                  maxVal: '',
                  minVal: '',
                  poor: ''
                }
                for (const detail of item.detailList) {
                  if (detail.field === sets.field) {
                    field = detail
                    break
                  }
                }
                data[sets.field] = field
              }
            }
            this.setlists.push(data)
          }
          console.log(this.setlists)
          this.settotalPage = parseInt(res.data.total)
          this.listLoading1 = false
        })
      }, res => { this.listLoading1 = false })
    },
    // 查询
    logfetchData() {
      this.listLoading1 = true
      const params = {
        pageNum: this.logpageNum,
        pageSize: this.logpageSize,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate),
        binNo: this.logBinNo,
        status: this.isActive,
        model: this.products
      }
      findRecord(params).then(res => {
        this.logList = res.data.result.list
        this.fcsjList = []
        this.binsjList = []
        this.fcbzList = []
        this.column3 = []
        this.logbltjTitle = []
        for (const item of res.data.column1) {
          const index = item.substring(item.length - 1)
          const label = item.substring(0, item.length - 1)
          if (index === '0') {
            this.fcsjList.push({
              key: item,
              label: label.toUpperCase()
            })
          } else if (index === '1') {
            this.binsjList.push({
              key: item,
              label: label.toUpperCase()
            })
          } else if (index === '2') {
            this.fcbzList.push({
              key: item,
              label: label.toUpperCase()
            })
          }
        }
        for (const item of res.data.column2) {
          if (item !== 'binCount' && item !== 'testNum' && item !== 'allBlNum' && item.indexOf('Rate') < 0) {
            this.logbltjTitle.push({
              key: item + '3',
              label: item.toUpperCase()
            })
          }
        }
        for (const item of res.data.column3) {
          const list = []
          const type = item.type === 1 ? '%' : ''
          list.push({
            label: item.field.toUpperCase() + '极下限',
            list: [{
              label: item.min !== null ? '<' + item.min : '',
              key: item.field + 'MinVal'
            }]
          }, {
            label: item.field.toUpperCase() + '下限',
            list: [{
              label: item.min1 !== null ? item.min1 + type : '',
              key: item.field + 'Min1Val'
            }, {
              label: item.min2 !== null ? item.min2 + type : '',
              key: item.field + 'Min2Val'
            }, {
              label: item.min3 !== null ? item.min3 + type : '',
              key: item.field + 'Min3Val'
            }, {
              label: item.min4 !== null ? item.min4 + type : '',
              key: item.field + 'Min4Val'
            }, {
              label: item.min5 !== null ? item.min5 + type : '',
              key: item.field + 'Min5Val'
            }]
          }, {
            label: '达标',
            list: [{
              label: '',
              key: item.field + 'DabVal'
            }]
          }, {
            label: item.field.toUpperCase() + '上限',
            list: [{
              label: item.max1 !== null ? item.max1 + type : '',
              key: item.field + 'Max1Val'
            }, {
              label: item.max2 !== null ? item.max2 + type : '',
              key: item.field + 'Max2Val'
            }, {
              label: item.max3 !== null ? item.max3 + type : '',
              key: item.field + 'Max3Val'
            }, {
              label: item.max4 !== null ? item.max4 + type : '',
              key: item.field + 'Max4Val'
            }, {
              label: item.max5 !== null ? item.max5 + type : '',
              key: item.field + 'Max5Val'
            }]
          }, {
            label: item.field.toUpperCase() + '极上限',
            list: [{
              label: item.max !== null ? '>' + item.max : '',
              key: item.field + 'MaxVal'
            }]
          })
          this.column3.push({
            key: item.field,
            label: item.field.toUpperCase(),
            list: list
          })
        }
        this.logtotalPage = parseInt(res.data.result.total)
        this.listLoading1 = false
      }, res => { this.listLoading1 = false })
    },
    clearlogSearch() {
      this.logBinNo = ''
      this.beginDate = ''
      this.endDate = ''
      this.logfetchData()
    },
    // 时间戳转yyyy-mm-dd
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex > this.blTitle.length) {
        if (rowIndex % 2 === 0) {
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
    },
    objectSpanMethod1({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
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
    },
    // 查询
    fetchData() {
      if (this.binNo !== '' && this.product === '') {
        const pro = this.binNo.split('-')
        const pro1 = pro[0]
        for (const item of this.productList) {
          const code = item.code.split('-')[0]
          if (pro1 === code) {
            this.product = item.code
            break
          }
        }
      }
      if (this.product === '' || this.binNo === '') {
        console.log(123)
      } else {
        this.listLoading = true
        const params = {
          code: this.product,
          binNo: this.binNo
        }
        this.backDataOne = []
        this.testlist = []
        this.binTitleList = []
        this.binList = []
        this.blTitle = []
        this.analysis = null
        this.blList = []
        this.qzParamsLists = []
        this.remark = []
        this.status = -1
        backFind(params).then(res => {
          this.status = res.data.status
          this.remark = res.data.remark
          this.baseList = res.data.baseList
          const items = Object.keys(res.data.backDataOne).sort(function(a, b) { return a.localeCompare(b) })
          this.backDataOne = []
          for (const item of items) {
            this.backDataOne.push({
              key: item,
              label: item.toUpperCase()
            })
          }
          this.testlist.push(res.data.backDataOne)
          this.testlist.push(res.data.daData)
          this.testlist.push(res.data.ccData)
          const binTitleList = Object.keys(res.data.backDataTwo).sort(function(a, b) { return a.localeCompare(b) })
          for (const item of binTitleList) {
            this.binTitleList.push({
              key: item,
              label: item.toUpperCase()
            })
          }
          this.binList.push(res.data.backDataTwo)
          this.binList.push(res.data.binData)
          const blTitle = Object.keys(res.data.blData).sort(function(a, b) { return a.localeCompare(b) })
          const data = {}
          for (const item of blTitle) {
            if (item !== 'allNum' && item !== 'testNum' && item !== 'allBlNum' && item.indexOf('Rate') < 0) {
              this.blTitle.push({
                key: item,
                label: item.toUpperCase()
              })
            } else if (item.indexOf('Rate') > -1) {
              data[item.substring(0, item.length - 4)] = res.data.blData[item] + '%'
            } else {
              data[item] = res.data.blData[item]
            }
          }
          this.analysis = res.data.analysis
          this.blList.push(res.data.blData)
          this.blList.push(data)
          const paramCode = {
            code: this.product,
            sign: '1'
          }
          findAnalysis(paramCode).then(res => {
            this.qzParamsLists = []
            for (const item of res.data.list) {
              this.qzParamsLists.push(item)
              const dat = this.analysis[item.field]
              if (dat !== undefined) {
                dat.field = item.field
                this.qzParamsLists.push(dat)
              } else {
                this.qzParamsLists.push({})
              }
            }
          })
          this.listLoading = false
        }, res => { this.listLoading = false })
      }
    },
    // 添加
    handleAdd() {
      this.findColorList()
      this.setfetchData()
      const params = {
        pageNum: 1,
        pageSize: 10000
      }
      setList(params).then(res => {
        this.setlists1 = res.data.list
      })
      this.color = ''
      this.setProduct = ''
      this.addDialogVisible = true
    },
    handleLog() {
      this.logDialogVisible = true
      this.logpageNum = 1
      this.logpageSize = 12
      this.beginDate = ''
      this.endDate = ''
      this.logBinNo = ''
      this.products = ''
      this.isActive = 0
      this.logList = []
      // this.logfetchData()
    },
    exportExcel() {
      var startTime = this.formatDate(this.beginDate)
      var endTime = this.formatDate(this.endDate)
      if (this.beginDate === '') {
        startTime = ''
      }
      if (this.endDate === '') {
        endTime = ''
      }
      if (this.products === '') {
        this.$message({
          type: 'error',
          message: '请先选择产品代码!'
        })
        return
      }
      window.open(process.env.BASE_API + '/xpBackTest/export?startTime=' + startTime + '&endTime=' + endTime + '&status=' + this.isActive + '&binNo=' + this.logBinNo + '&model=' + this.products, '_blank')
    }
  }
}

