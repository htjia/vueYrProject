
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findModelList, findColorList, findCOWList, disableCowEnable, deletesCow, saveCOW, updateCOW } from '@/api/chipBasicInfoManage/samplingStandard'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      activeTabIndex: 0,
      list: [],
      cytjList: [],
      pchdList: [],
      cjbzList: [],
      bstjList: [],
      configDialogVisible: false,
      configDialogVisible1: false,
      configDialogVisibles: false,
      configDialogVisibles1: false,
      leftTree: [
        {
          id: 1,
          label: 'COW',
          children: []
        }
      ],
      rightTree: [
        {
          id: 1,
          label: 'COW',
          children: []
        }
      ],
      leftTree1: [
        {
          id: 1,
          label: 'COW',
          children: []
        }
      ],
      rightTree1: [
        {
          id: 1,
          label: 'COW',
          children: []
        }
      ],
      leftTrees: [
        {
          id: 1,
          label: 'COW',
          children: []
        }
      ],
      rightTrees: [
        {
          id: 1,
          label: 'COW',
          children: []
        }
      ],
      leftTrees1: [
        {
          id: 1,
          label: 'COW',
          children: []
        }
      ],
      rightTrees1: [
        {
          id: 1,
          label: 'COW',
          children: []
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      cowBaseList: [
        {
          thName: 'ESD',
          thKey: 'esd'
        },
        {
          thName: 'VF1',
          thKey: 'vf1'
        },
        {
          thName: 'VF2',
          thKey: 'vf2'
        },
        {
          thName: 'VF3',
          thKey: 'vf3'
        },
        {
          thName: 'VF4',
          thKey: 'vf4'
        },
        {
          thName: 'VFM1',
          thKey: 'vfm1'
        },
        {
          thName: 'DVF',
          thKey: 'dvf'
        },
        {
          thName: 'VZ1',
          thKey: 'vz1'
        },
        {
          thName: 'VZ2',
          thKey: 'vz2'
        },
        {
          thName: 'IR',
          thKey: 'ir'
        },
        {
          thName: 'LOP1',
          thKey: 'lop1'
        },
        {
          thName: 'WLP1',
          thKey: 'wlp1'
        },
        {
          thName: 'HW1',
          thKey: 'hw1'
        },
        {
          thName: 'HW2',
          thKey: 'hw2'
        },
        {
          thName: 'WLP2',
          thKey: 'wlp2'
        },
        {
          thName: 'WLD1',
          thKey: 'wld1'
        },
        {
          thName: 'WLD2',
          thKey: 'wld2'
        },
        {
          thName: 'POSX',
          thKey: 'posx'
        },
        {
          thName: 'POSY',
          thKey: 'posy'
        }
      ],
      cowBaseList1: [
        {
          thName: 'IV均值',
          thKey: 'avgIv'
        },
        {
          thName: 'VF1均值',
          thKey: 'avgVf1'
        },
        {
          thName: 'VF1_ESD_A均值',
          thKey: 'vf1EsdAvg'
        },
        {
          thName: 'VF1_ESD_A差值',
          thKey: 'vf1EsdDiffer'
        },
        {
          thName: 'VZ均值',
          thKey: 'avgVz'
        },
        {
          thName: '蓝移',
          thKey: 'blueShift'
        },
        {
          thName: 'K值',
          thKey: 'valk'
        },
        {
          thName: 'ESD去坏200V',
          thKey: 'esd200'
        },
        {
          thName: 'ESD去坏400V',
          thKey: 'esd400'
        },
        {
          thName: 'ESD去坏50V',
          thKey: 'esd50'
        },
        {
          thName: 'ESD去坏450V',
          thKey: 'esd450'
        },
        {
          thName: 'ESD去坏500V',
          thKey: 'esd500'
        },
        {
          thName: 'ESD去坏300V',
          thKey: 'esd300'
        },
        {
          thName: 'ESD去坏1000V',
          thKey: 'esd1000'
        },
        {
          thName: 'ESD去坏2000V',
          thKey: 'esd2000'
        },
        {
          thName: 'ESD去坏4000V',
          thKey: 'esd4000'
        },
        {
          thName: 'Thyristor良率',
          thKey: 'yieldThyristor'
        },
        {
          thName: 'Thyristor坏点数',
          thKey: 'numThyristor'
        },
        {
          thName: 'DVF均值',
          thKey: 'avgDvf'
        },
        {
          thName: '综合良率',
          thKey: 'yieldZh'
        },
        {
          thName: 'VF1良率',
          thKey: 'yieldVf1'
        },
        {
          thName: 'VF3良率',
          thKey: 'yieldVf3'
        },
        {
          thName: 'WLD1良率',
          thKey: 'yieldWld1'
        },
        {
          thName: 'IR良率',
          thKey: 'yieldIr'
        },
        {
          thName: 'IR_ESD_A良率',
          thKey: 'irEsdYield'
        },
        {
          thName: 'VZ良率',
          thKey: 'yieldVz'
        },
        {
          thName: 'IV良率',
          thKey: 'yieldIv'
        },
        {
          thName: 'VF4良率',
          thKey: 'yieldVf4'
        },
        {
          thName: 'VF2均值',
          thKey: 'avgVf2'
        },
        {
          thName: 'VF3均值',
          thKey: 'avgVf3'
        },
        {
          thName: 'VF4均值',
          thKey: 'avgVf4'
        },
        {
          thName: 'WLD1均值',
          thKey: 'avgWld1'
        },
        {
          thName: 'WLD1_STD',
          thKey: 'wld1Std'
        },
        {
          thName: 'WLP1均值',
          thKey: 'avgWlp1'
        },
        {
          thName: 'HW1',
          thKey: 'hw1'
        },
        {
          thName: 'WLD2均值',
          thKey: 'avgWld2'
        },
        {
          thName: 'WLD2_STD',
          thKey: 'wld2Std'
        },
        {
          thName: 'HW2',
          thKey: 'hw2'
        },
        {
          thName: 'WLP2均值',
          thKey: 'avgWlp2'
        },
        {
          thName: 'IR均值',
          thKey: 'avgIr'
        },
        {
          thName: 'PL_WP',
          thKey: 'plWp'
        },
        {
          thName: 'PL_WD',
          thKey: 'plWd'
        },
        {
          thName: 'PL_WD_STD',
          thKey: 'plWdStd'
        },
        {
          thName: 'PL_II',
          thKey: 'plIi'
        },
        {
          thName: 'IR02均值',
          thKey: 'yieldIr02'
        }
      ],
      allready: '',
      newmodel: '',
      newcolor: '',
      checkOptions: [],
      newname: '',
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
      model: '',
      color: '',
      modelList: [],
      colorList: [],
      pageSize: 12,
      pageNum: 1,
      totalPage: 0,
      isDisable: '',
      disableList: [
        {
          id: 1,
          name: '禁用'
        },
        {
          id: 0,
          name: '启用'
        }
      ],
      allreadyList: [],
      newFieldList: [],
      newFieldList1: [],
      sampList: [
        {
          id: 0,
          name: '>'
        },
        {
          id: 1,
          name: '>='
        },
        {
          id: 2,
          name: '<'
        },
        {
          id: 3,
          name: '<='
        },
        {
          id: 4,
          name: '='
        },
        {
          id: 5,
          name: '!='
        }
      ]
    }
  },
  mounted() {
    this.fetchData()
    this.findModelList()
    this.findColorList()
  },
  methods: {
    tabClick(index) {
      this.activeTabIndex = index
    },
    findModelList() {
      findModelList().then(res => {
        this.modelList = res.data.list
      })
    },
    findColorList() {
      findColorList().then(res => {
        this.colorList = res.data
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
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate),
        modelId: this.model,
        colorId: this.color,
        status: this.isDisable
      }
      findCOWList(params).then(res => {
        this.list = []
        for (let i = 0; i < res.data.list.length; i++) {
          if (res.data.list[i].status === 0) {
            res.data.list[i].isChecked = true
          } else {
            res.data.list[i].isChecked = false
          }
          this.list.push(res.data.list[i])
        }
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    setStatus(row) {
      if (row.isChecked) {
        this.$confirm('确定启用?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          row.status = 0
          const requestParams = {
            id: row.id,
            status: row.status
          }
          disableCowEnable(requestParams).then(res => {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.fetchData()
          })
        }, () => {
          row.isChecked = false
        })
      } else {
        this.$confirm('确定弃用?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          row.status = 1
          const requestParams = {
            id: row.id,
            status: row.status
          }
          disableCowEnable(requestParams).then(res => {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.fetchData()
          })
        }, () => {
          row.isChecked = true
        })
      }
    },
    handleClose() {
      this.fetchData()
      this.editDialogVisible = false
      this.addDialogVisible = false
    },
    submitAddForm() {
      var flag = false
      var flag1 = false
      var flag2 = false
      var flag3 = false
      if (this.newmodel === '') {
        this.$message({
          type: 'error',
          message: '请选择型号!'
        })
        return
      }
      if (this.newcolor === '') {
        this.$message({
          type: 'error',
          message: '请选择光色!'
        })
        return
      }
      let str = ''
      const cytjLists = []
      for (const item of this.cytjList) {
        for (const is of this.cowBaseList) {
          if (is.thKey === item.field) {
            str = '采样条件' + is.thName
            break
          }
        }
        if (item.minVal === null) {
          item.minVal = ''
        }
        if (item.maxVal === null) {
          item.maxVal = ''
        }
        if (item.minVal === '' && item.maxVal === '') {
          continue
        } else if (item.minVal === '' || item.maxVal === '') {
          flag = true
          break
        }
        let length1 = 0
        if ((parseFloat(item.minVal) + '').indexOf('.') > -1) {
          length1 = (item.minVal + '').substring((item.minVal + '').indexOf('.') + 1).length
        }
        let length2 = 0
        if ((parseFloat(item.maxVal) + '').indexOf('.') > -1) {
          length2 = (item.maxVal + '').substring((item.maxVal + '').indexOf('.') + 1).length
        }
        if (parseFloat(item.minVal) > 99999 || parseFloat(item.maxVal) > 99999 || length2 > 4 || length1 > 4) {
          flag3 = true
          break
        }
        const flags = parseFloat(item.minVal) + '' === item.minVal + ''
        const flags1 = parseFloat(item.maxVal) + '' === item.maxVal + ''
        if (!flags || !flags1) {
          flag2 = true
          break
        }
        if (parseFloat(item.minVal) >= parseFloat(item.maxVal)) {
          flag1 = true
          break
        }
        cytjLists.push({
          field: item.thKey,
          thKey: item.thKey,
          minVal: item.minVal,
          maxVal: item.maxVal
        })
      }
      if (flag) {
        this.$message({
          type: 'error',
          message: str + '填写数据不能为空!'
        })
        return
      }
      if (flag1) {
        this.$message({
          type: 'error',
          message: str + '最大值必须大于小于最小值!'
        })
        return
      }
      if (flag2) {
        this.$message({
          type: 'error',
          message: str + '数字输入不正确!'
        })
        return
      }
      if (flag3) {
        this.$message({
          type: 'error',
          message: str + '数字不得大于99999或者小数点保留四位小数!'
        })
        return
      }
      const pchdLists = []
      for (const item of this.pchdList) {
        for (const is of this.cowBaseList) {
          if (is.thKey === item.field) {
            str = '抛除坏点后条件' + is.thName
            break
          }
        }
        if (item.minVal === null) {
          item.minVal = ''
        }
        if (item.maxVal === null) {
          item.maxVal = ''
        }
        if (item.minVal === '' && item.maxVal === '') {
          continue
        } else if (item.minVal === '' || item.maxVal === '') {
          flag = true
          break
        }
        let length1 = 0
        if ((parseFloat(item.minVal) + '').indexOf('.') > -1) {
          length1 = (item.minVal + '').substring((item.minVal + '').indexOf('.') + 1).length
        }
        let length2 = 0
        if ((parseFloat(item.maxVal) + '').indexOf('.') > -1) {
          length2 = (item.maxVal + '').substring((item.maxVal + '').indexOf('.') + 1).length
        }
        if (parseFloat(item.minVal) > 99999 || parseFloat(item.maxVal) > 99999 || length2 > 4 || length1 > 4) {
          flag3 = true
          break
        }
        const flags = parseFloat(item.minVal) + '' === item.minVal + ''
        const flags1 = parseFloat(item.maxVal) + '' === item.maxVal + ''
        if (!flags || !flags1) {
          flag2 = true
          break
        }
        if (parseFloat(item.minVal) >= parseFloat(item.maxVal)) {
          flag1 = true
          break
        }
        pchdLists.push({
          field: item.thKey,
          thKey: item.thKey,
          minVal: item.minVal,
          maxVal: item.maxVal
        })
      }
      if (flag) {
        this.$message({
          type: 'error',
          message: str + '填写数据不能为空!'
        })
        return
      }
      if (flag1) {
        this.$message({
          type: 'error',
          message: str + '最大值必须大于小于最小值!'
        })
        return
      }
      if (flag2) {
        this.$message({
          type: 'error',
          message: str + '数字输入不正确!'
        })
        return
      }
      if (flag3) {
        this.$message({
          type: 'error',
          message: str + '数字不得大于99999或者小数点保留四位小数!'
        })
        return
      }
      const cjbzLists = []
      for (const item of this.cjbzList) {
        for (const is of this.cowBaseList1) {
          if (is.thKey === item.field) {
            str = '传接片标准' + is.thName
            break
          }
        }
        if (item.symbol === null) {
          item.symbol = ''
        }
        if (item.val === null) {
          item.val = ''
        }
        if (item.symbol === '' && item.val === '') {
          continue
        } else if (item.symbol === '' || item.val === '') {
          flag = true
          break
        }
        let length1 = 0
        if ((parseFloat(item.val) + '').indexOf('.') > -1) {
          length1 = (item.val + '').substring((item.val + '').indexOf('.') + 1).length
        }
        if (parseFloat(item.val) > 99999 || length1 > 4) {
          flag3 = true
          break
        }
        const flags = parseFloat(item.val) + '' === item.val + ''
        if (!flags) {
          flag2 = true
          break
        }
        cjbzLists.push({
          field: item.thKey,
          thKey: item.thKey,
          symbol: item.symbol,
          val: item.val
        })
      }
      if (flag) {
        this.$message({
          type: 'error',
          message: str + '填写数据不能为空!'
        })
        return
      }
      if (flag1) {
        this.$message({
          type: 'error',
          message: str + '最大值必须大于小于最小值!'
        })
        return
      }
      if (flag2) {
        this.$message({
          type: 'error',
          message: str + '数字输入不正确!'
        })
        return
      }
      if (flag3) {
        this.$message({
          type: 'error',
          message: str + '数字不得大于99999或者小数点保留四位小数!'
        })
        return
      }
      const bstjLists = []
      for (const item of this.bstjList) {
        for (const is of this.cowBaseList1) {
          if (is.thKey === item.field) {
            str = '变色条件' + is.thName
            break
          }
        }
        if (item.symbol === null) {
          item.symbol = ''
        }
        if (item.val === null) {
          item.val = ''
        }
        if (item.symbol === '' && item.val === '') {
          continue
        } else if (item.symbol === '' || item.val === '') {
          flag = true
          break
        }
        let length1 = 0
        if ((parseFloat(item.val) + '').indexOf('.') > -1) {
          length1 = (item.val + '').substring((item.val + '').indexOf('.') + 1).length
        }
        if (parseFloat(item.val) > 99999 || length1 > 4) {
          flag3 = true
          break
        }
        const flags = parseFloat(item.val) + '' === item.val + ''
        if (!flags) {
          flag2 = true
          break
        }
        bstjLists.push({
          field: item.thKey,
          thKey: item.thKey,
          symbol: item.symbol,
          val: item.val
        })
      }
      if (flag) {
        this.$message({
          type: 'error',
          message: str + '填写数据不能为空!'
        })
        return
      }
      if (flag1) {
        this.$message({
          type: 'error',
          message: str + '最大值必须大于小于最小值!'
        })
        return
      }
      if (flag2) {
        this.$message({
          type: 'error',
          message: str + '数字输入不正确!'
        })
        return
      }
      if (flag3) {
        this.$message({
          type: 'error',
          message: str + '数字不得大于99999或者小数点保留四位小数!'
        })
        return
      }
      // if (cytjLists.length === 0) {
      //   this.$message({
      //     type: 'error',
      //     message: '采样条件不能为空!'
      //   })
      //   return
      // }
      // if (pchdLists.length === 0) {
      //   this.$message({
      //     type: 'error',
      //     message: '抛除坏点后条件不能为空!'
      //   })
      //   return
      // }
      // if (cjbzLists.length === 0) {
      //   this.$message({
      //     type: 'error',
      //     message: '传接片标准不能为空!'
      //   })
      //   return
      // }
      // if (bstjLists.length === 0) {
      //   this.$message({
      //     type: 'error',
      //     message: '变色条件不能为空!'
      //   })
      //   return
      // }
      let colorId = 0
      let modelId = 0
      for (const item of this.modelList) {
        if (item.code === this.newmodel) {
          modelId = item.id
          break
        }
      }
      for (const item of this.colorList) {
        if (item.code === this.newcolor) {
          colorId = item.id
          break
        }
      }
      const params = {
        modelId: modelId,
        colorId: colorId,
        samplingBads: pchdLists,
        color: this.newcolor,
        colorConditions: bstjLists,
        samplingConditions: cytjLists,
        creator: sessionStorage.getItem('User-Id'),
        model: this.newmodel,
        name: this.newname,
        splicings: cjbzLists
      }
      saveCOW(params).then(res => {
        this.$message({
          type: 'success',
          message: '添加成功!'
        })
        this.addDialogVisible = false
        this.fetchData()
      })
    },
    submitEditForm() {
      var flag = false
      var flag1 = false
      var flag2 = false
      var flag3 = false
      if (this.newmodel === '') {
        this.$message({
          type: 'error',
          message: '请选择型号!'
        })
        return
      }
      if (this.newcolor === '') {
        this.$message({
          type: 'error',
          message: '请选择光色!'
        })
        return
      }
      let str = ''
      const cytjLists = []
      for (const item of this.cytjList) {
        for (const is of this.cowBaseList) {
          if (is.thKey === item.field) {
            str = '采样条件' + is.thName
            break
          }
        }
        if (item.minVal === null) {
          item.minVal = ''
        }
        if (item.maxVal === null) {
          item.maxVal = ''
        }
        if (item.minVal === '' && item.maxVal === '') {
          continue
        } else if (item.minVal === '' || item.maxVal === '') {
          flag = true
          break
        }
        let length1 = 0
        if ((parseFloat(item.minVal) + '').indexOf('.') > -1) {
          length1 = (item.minVal + '').substring((item.minVal + '').indexOf('.') + 1).length
        }
        let length2 = 0
        if ((parseFloat(item.maxVal) + '').indexOf('.') > -1) {
          length2 = (item.maxVal + '').substring((item.maxVal + '').indexOf('.') + 1).length
        }
        if (parseFloat(item.minVal) > 99999 || parseFloat(item.maxVal) > 99999 || length2 > 4 || length1 > 4) {
          flag3 = true
          break
        }
        const flags = parseFloat(item.minVal) + '' === item.minVal + ''
        const flags1 = parseFloat(item.maxVal) + '' === item.maxVal + ''
        if (!flags || !flags1) {
          flag2 = true
          break
        }
        if (parseFloat(item.minVal) >= parseFloat(item.maxVal)) {
          flag1 = true
          break
        }
        cytjLists.push({
          field: item.thKey,
          thKey: item.thKey,
          minVal: item.minVal,
          maxVal: item.maxVal
        })
      }
      if (flag) {
        this.$message({
          type: 'error',
          message: str + '填写数据不能为空!'
        })
        return
      }
      if (flag1) {
        this.$message({
          type: 'error',
          message: str + '最大值必须大于小于最小值!'
        })
        return
      }
      if (flag2) {
        this.$message({
          type: 'error',
          message: str + '数字输入不正确!'
        })
        return
      }
      if (flag3) {
        this.$message({
          type: 'error',
          message: str + '数字不得大于99999或者小数点保留四位小数!'
        })
        return
      }
      const pchdLists = []
      for (const item of this.pchdList) {
        for (const is of this.cowBaseList) {
          if (is.thKey === item.field) {
            str = '抛除坏点后条件' + is.thName
            break
          }
        }
        if (item.minVal === null) {
          item.minVal = ''
        }
        if (item.maxVal === null) {
          item.maxVal = ''
        }
        if (item.minVal === '' && item.maxVal === '') {
          continue
        } else if (item.minVal === '' || item.maxVal === '') {
          flag = true
          break
        }
        let length1 = 0
        if ((parseFloat(item.minVal) + '').indexOf('.') > -1) {
          length1 = (item.minVal + '').substring((item.minVal + '').indexOf('.') + 1).length
        }
        let length2 = 0
        if ((parseFloat(item.maxVal) + '').indexOf('.') > -1) {
          length2 = (item.maxVal + '').substring((item.maxVal + '').indexOf('.') + 1).length
        }
        if (parseFloat(item.minVal) > 99999 || parseFloat(item.maxVal) > 99999 || length2 > 4 || length1 > 4) {
          flag3 = true
          break
        }
        const flags = parseFloat(item.minVal) + '' === item.minVal + ''
        const flags1 = parseFloat(item.maxVal) + '' === item.maxVal + ''
        if (!flags || !flags1) {
          flag2 = true
          break
        }
        if (parseFloat(item.minVal) >= parseFloat(item.maxVal)) {
          flag1 = true
          break
        }
        pchdLists.push({
          field: item.thKey,
          thKey: item.thKey,
          minVal: item.minVal,
          maxVal: item.maxVal
        })
      }
      if (flag) {
        this.$message({
          type: 'error',
          message: str + '填写数据不能为空!'
        })
        return
      }
      if (flag1) {
        this.$message({
          type: 'error',
          message: str + '最大值必须大于小于最小值!'
        })
        return
      }
      if (flag2) {
        this.$message({
          type: 'error',
          message: str + '数字输入不正确!'
        })
        return
      }
      if (flag3) {
        this.$message({
          type: 'error',
          message: str + '数字不得大于99999或者小数点保留四位小数!'
        })
        return
      }
      const cjbzLists = []
      for (const item of this.cjbzList) {
        for (const is of this.cowBaseList1) {
          if (is.thKey === item.field) {
            str = '传接片标准' + is.thName
            break
          }
        }
        if (item.symbol === null) {
          item.symbol = ''
        }
        if (item.val === null) {
          item.val = ''
        }
        if (item.symbol === '' && item.val === '') {
          continue
        } else if (item.symbol === '' || item.val === '') {
          flag = true
          break
        }
        let length1 = 0
        if ((parseFloat(item.val) + '').indexOf('.') > -1) {
          length1 = (item.val + '').substring((item.val + '').indexOf('.') + 1).length
        }
        if (parseFloat(item.val) > 99999 || length1 > 4) {
          flag3 = true
          break
        }
        const flags = parseFloat(item.val) + '' === item.val + ''
        if (!flags) {
          flag2 = true
          break
        }
        cjbzLists.push({
          field: item.thKey,
          thKey: item.thKey,
          symbol: item.symbol,
          val: item.val
        })
      }
      if (flag) {
        this.$message({
          type: 'error',
          message: str + '填写数据不能为空!'
        })
        return
      }
      if (flag1) {
        this.$message({
          type: 'error',
          message: str + '最大值必须大于小于最小值!'
        })
        return
      }
      if (flag2) {
        this.$message({
          type: 'error',
          message: str + '数字输入不正确!'
        })
        return
      }
      if (flag3) {
        this.$message({
          type: 'error',
          message: str + '数字不得大于99999或者小数点保留四位小数!'
        })
        return
      }
      const bstjLists = []
      for (const item of this.bstjList) {
        for (const is of this.cowBaseList1) {
          if (is.thKey === item.field) {
            str = '变色条件' + is.thName
            break
          }
        }
        if (item.symbol === null) {
          item.symbol = ''
        }
        if (item.val === null) {
          item.val = ''
        }
        if (item.symbol === '' && item.val === '') {
          continue
        } else if (item.symbol === '' || item.val === '') {
          flag = true
          break
        }
        let length1 = 0
        if ((parseFloat(item.val) + '').indexOf('.') > -1) {
          length1 = (item.val + '').substring((item.val + '').indexOf('.') + 1).length
        }
        if (parseFloat(item.val) > 99999 || length1 > 4) {
          flag3 = true
          break
        }
        const flags = parseFloat(item.val) + '' === item.val + ''
        if (!flags) {
          flag2 = true
          break
        }
        bstjLists.push({
          field: item.thKey,
          thKey: item.thKey,
          symbol: item.symbol,
          val: item.val
        })
      }
      if (flag) {
        this.$message({
          type: 'error',
          message: str + '填写数据不能为空!'
        })
        return
      }
      if (flag1) {
        this.$message({
          type: 'error',
          message: str + '最大值必须大于小于最小值!'
        })
        return
      }
      if (flag2) {
        this.$message({
          type: 'error',
          message: str + '数字输入不正确!'
        })
        return
      }
      if (flag3) {
        this.$message({
          type: 'error',
          message: str + '数字不得大于99999或者小数点保留四位小数!'
        })
        return
      }
      // if (cytjLists.length === 0) {
      //   this.$message({
      //     type: 'error',
      //     message: '采样条件不能为空!'
      //   })
      //   return
      // }
      // if (pchdLists.length === 0) {
      //   this.$message({
      //     type: 'error',
      //     message: '抛除坏点后条件不能为空!'
      //   })
      //   return
      // }
      // if (cjbzLists.length === 0) {
      //   this.$message({
      //     type: 'error',
      //     message: '传接片标准不能为空!'
      //   })
      //   return
      // }
      // if (bstjLists.length === 0) {
      //   this.$message({
      //     type: 'error',
      //     message: '变色条件不能为空!'
      //   })
      //   return
      // }
      let colorId = 0
      let modelId = 0
      for (const item of this.modelList) {
        if (item.code === this.newmodel) {
          modelId = item.id
          break
        }
      }
      for (const item of this.colorList) {
        if (item.code === this.newcolor) {
          colorId = item.id
          break
        }
      }
      const params = {
        modelId: modelId,
        colorId: colorId,
        id: this.currentId,
        samplingBads: pchdLists,
        color: this.newcolor,
        colorConditions: bstjLists,
        samplingConditions: cytjLists,
        creator: sessionStorage.getItem('User-Id'),
        model: this.newmodel,
        name: this.newname,
        splicings: cjbzLists
      }
      updateCOW(params).then(res => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        this.editDialogVisible = false
        this.fetchData()
      })
    },
    clearAll() {
      this.model = ''
      this.color = ''
      this.isDisable = ''
      this.pageNum = 1
      this.beginDate = ''
      this.endDate = ''
      this.fetchData()
    },
    handleEdit(row) {
      this.currentId = row.id
      this.cytjList = []
      this.pchdList = []
      this.cjbzList = []
      this.bstjList = []
      for (const items of this.cowBaseList) {
        for (const d of row.samplingConditions) {
          if (items.thKey === d.field) {
            this.cytjList.push({
              field: items.thKey,
              thKey: items.thKey,
              minVal: d.minVal,
              maxVal: d.maxVal
            })
            break
          }
        }
        for (const d of row.samplingBads) {
          if (items.thKey === d.field) {
            this.pchdList.push({
              field: items.thKey,
              thKey: items.thKey,
              minVal: d.minVal,
              maxVal: d.maxVal
            })
            break
          }
        }
      }
      for (const d of row.splicings) {
        this.cjbzList.push({
          field: d.field,
          thKey: d.field,
          symbol: d.symbol,
          val: d.val
        })
      }
      for (const d of row.colorConditions) {
        this.bstjList.push({
          field: d.field,
          thKey: d.field,
          symbol: d.symbol,
          val: d.val
        })
      }
      this.newmodel = row.model
      this.newcolor = row.color
      this.newname = row.name
      this.editDialogVisible = true
      this.setfi1()
      this.setfi2()
    },
    fieldChange(row) {
      row.thKey = row.field
    },
    fieldChange1(row) {
      row.thKey = row.field
      this.setfi1()
    },
    fieldChange2(row) {
      row.thKey = row.field
      this.setfi2()
    },
    setfi1() {
      this.newFieldList = []
      for (const field of this.cowBaseList) {
        var fi = {
          thName: field.thName,
          thKey: field.thKey,
          disabled: false
        }
        for (const item of this.cytjList) {
          if (item.thKey === field.thKey) {
            fi.disabled = true
            break
          }
        }
        this.newFieldList.push(fi)
      }
    },
    setfi2() {
      this.newFieldList1 = []
      for (const field of this.cowBaseList) {
        var fi = {
          thName: field.thName,
          thKey: field.thKey,
          disabled: false
        }
        for (const item of this.pchdList) {
          if (item.thKey === field.thKey) {
            fi.disabled = true
            break
          }
        }
        this.newFieldList1.push(fi)
      }
    },
    addCY() {
      this.cytjList.push({
        field: '',
        minVal: '',
        maxVal: '',
        thKey: ''
      })
    },
    addPCHD() {
      this.pchdList.push({
        field: '',
        minVal: '',
        maxVal: '',
        thKey: ''
      })
    },
    addCHP() {
      this.cjbzList.push({
        field: '',
        val: '',
        symbol: '',
        thKey: ''
      })
    },
    addBS() {
      this.bstjList.push({
        field: '',
        val: '',
        symbol: '',
        thKey: ''
      })
    },
    removeCY(index) {
      this.cytjList.splice(index, 1)
      this.setfi1()
    },
    removeHD(index) {
      this.pchdList.splice(index, 1)
      this.setfi2()
    },
    removeCHP(index) {
      this.cjbzList.splice(index, 1)
    },
    removBS(index) {
      this.bstjList.splice(index, 1)
    },
    setNewName() {
      if (this.newmodel !== '' && this.newcolor !== '') {
        this.newname = this.newmodel + '-' + this.newcolor
      }
    },
    setHasBZ() {
      let data = {}
      for (const item of this.allreadyList) {
        if (item.id === this.allready) {
          data = item
          break
        }
      }
      this.newcolor = data.color
      this.newmodel = data.model
      this.newname = data.name
      this.cytjList = []
      this.pchdList = []
      this.cjbzList = []
      this.bstjList = []
      for (const item of data.samplingConditions) {
        this.cytjList.push({
          field: item.field,
          maxVal: item.maxVal,
          minVal: item.minVal,
          thKey: item.field
        })
      }
      for (const item of data.samplingBads) {
        this.pchdList.push({
          field: item.field,
          maxVal: item.maxVal,
          minVal: item.minVal,
          thKey: item.field
        })
      }
      for (const item of data.splicings) {
        this.cjbzList.push({
          field: item.field,
          val: item.val,
          symbol: item.symbol,
          thKey: item.field
        })
      }
      for (const item of data.colorConditions) {
        this.bstjList.push({
          field: item.field,
          val: item.val,
          symbol: item.symbol,
          thKey: item.field
        })
      }
    },
    produceName() {
      console.log(123)
    },
    findAready() {
      const params = {
        pageNum: 1,
        pageSize: 1000000
      }
      findCOWList(params).then(res => {
        this.allreadyList = res.data.list
      })
    },
    // 添加
    handleAdd() {
      this.findAready()
      this.findModelList()
      this.findColorList()
      this.newmodel = ''
      this.newcolor = ''
      this.newname = ''
      this.allready = ''
      this.cytjList = []
      this.pchdList = []
      this.cjbzList = []
      this.bstjList = []
      this.addDialogVisible = true
      this.setfi1()
      this.setfi2()
    },
    addConfig() {
      this.configDialogVisible = true
      this.leftTree = [
        {
          id: 1,
          label: 'COW',
          children: []
        }
      ]
      this.rightTree = [
        {
          id: 1,
          label: 'COW',
          children: []
        }
      ]
      for (let i = 0; i < this.cowBaseList.length; i++) {
        let flag = false
        for (const items of this.cytjList) {
          if (items.field === this.cowBaseList[i].thKey.toLowerCase()) {
            flag = true
            break
          }
        }
        if (!flag) {
          this.rightTree[0].children.push({
            id: 1 + '' + i,
            label: this.cowBaseList[i].thName,
            thKey: this.cowBaseList[i].thKey
          })
        } else {
          this.leftTree[0].children.push({
            id: 1 + '' + i,
            label: this.cowBaseList[i].thName,
            thKey: this.cowBaseList[i].thKey
          })
        }
      }
    },
    addConfig1() {
      this.configDialogVisible1 = true
      this.leftTree1 = [
        {
          id: 1,
          label: 'COW',
          children: []
        }
      ]
      this.rightTree1 = [
        {
          id: 1,
          label: 'COW',
          children: []
        }
      ]
      for (let i = 0; i < this.cowBaseList1.length; i++) {
        let flag = false
        for (const items of this.cjbzList) {
          if (items.thKey === this.cowBaseList1[i].thKey.toLowerCase()) {
            flag = true
            break
          }
        }
        if (!flag) {
          this.rightTree1[0].children.push({
            id: 1 + '' + i,
            label: this.cowBaseList1[i].thName,
            thKey: this.cowBaseList1[i].thKey
          })
        } else {
          this.leftTree1[0].children.push({
            id: 1 + '' + i,
            label: this.cowBaseList1[i].thName,
            thKey: this.cowBaseList1[i].thKey
          })
        }
      }
    },
    addConfigs() {
      this.configDialogVisibles = true
      this.leftTrees = [
        {
          id: 1,
          label: 'COW',
          children: []
        }
      ]
      this.rightTrees = [
        {
          id: 1,
          label: 'COW',
          children: []
        }
      ]
      for (let i = 0; i < this.cowBaseList.length; i++) {
        let flag = false
        for (const items of this.cytjList) {
          if (items.field === this.cowBaseList1[i].thKey.toLowerCase()) {
            flag = true
            break
          }
        }
        if (!flag) {
          this.rightTrees[0].children.push({
            id: 1 + '' + i,
            label: this.cowBaseList[i].thName,
            thKey: this.cowBaseList[i].thKey
          })
        } else {
          this.leftTrees[0].children.push({
            id: 1 + '' + i,
            label: this.cowBaseList[i].thName,
            thKey: this.cowBaseList[i].thKey
          })
        }
      }
    },
    addConfigs1() {
      this.configDialogVisibles1 = true
      this.leftTrees1 = [
        {
          id: 1,
          label: 'COW',
          children: []
        }
      ]
      this.rightTrees1 = [
        {
          id: 1,
          label: 'COW',
          children: []
        }
      ]
      for (let i = 0; i < this.cowBaseList1.length; i++) {
        let flag = false
        for (const items of this.cjbzList) {
          if (items.thKey === this.cowBaseList1[i].thKey) {
            flag = true
            break
          }
        }
        if (!flag) {
          this.rightTrees1[0].children.push({
            id: 1 + '' + i,
            label: this.cowBaseList1[i].thName,
            thKey: this.cowBaseList1[i].thKey
          })
        } else {
          this.leftTrees1[0].children.push({
            id: 1 + '' + i,
            label: this.cowBaseList1[i].thName,
            thKey: this.cowBaseList1[i].thKey
          })
        }
      }
    },
    toLeft() {
      const selected = this.$refs.righttree.getCheckedNodes()
      for (const items of selected) {
        for (let i = 0; i < this.rightTree[0].children.length; i++) {
          if (this.rightTree[0].children[i].id === items.id) {
            console.log(this.rightTree)
            this.leftTree[0].children.push({
              id: this.rightTree[0].children[i].id,
              label: this.rightTree[0].children[i].label,
              thKey: this.rightTree[0].children[i].thKey
            })
            this.rightTree[0].children.splice(i, 1)
            break
          }
        }
      }
      this.$refs.righttree.setCheckedKeys([])
      this.$refs.lefttree.setCheckedKeys([])
    },
    toLeft1() {
      const selected = this.$refs.righttree1.getCheckedNodes()
      for (const items of selected) {
        for (let i = 0; i < this.rightTree1[0].children.length; i++) {
          if (this.rightTree1[0].children[i].id === items.id) {
            this.leftTree1[0].children.push({
              id: this.rightTree1[0].children[i].id,
              label: this.rightTree1[0].children[i].label,
              thKey: this.rightTree1[0].children[i].thKey
            })
            this.rightTree1[0].children.splice(i, 1)
            break
          }
        }
      }
      this.$refs.righttree1.setCheckedKeys([])
      this.$refs.lefttree1.setCheckedKeys([])
    },
    toRight() {
      const selected = this.$refs.lefttree.getCheckedNodes()
      for (const items of selected) {
        for (let i = 0; i < this.leftTree[0].children.length; i++) {
          if (this.leftTree[0].children[i].id === items.id) {
            this.rightTree[0].children.push({
              id: this.leftTree[0].children[i].id,
              label: this.leftTree[0].children[i].label,
              thKey: this.leftTree[0].children[i].thKey
            })
            this.leftTree[0].children.splice(i, 1)
            break
          }
        }
      }
      this.$refs.righttree.setCheckedKeys([])
      this.$refs.lefttree.setCheckedKeys([])
    },
    toRight1() {
      const selected = this.$refs.lefttree1.getCheckedNodes()
      for (const items of selected) {
        for (let i = 0; i < this.leftTree1[0].children.length; i++) {
          if (this.leftTree1[0].children[i].id === items.id) {
            this.rightTree1[0].children.push({
              id: this.leftTree1[0].children[i].id,
              label: this.leftTree1[0].children[i].label,
              thKey: this.leftTree1[0].children[i].thKey
            })
            this.leftTree1[0].children.splice(i, 1)
            break
          }
        }
      }
      this.$refs.righttree1.setCheckedKeys([])
      this.$refs.lefttree1.setCheckedKeys([])
    },
    toLefts() {
      const selected = this.$refs.righttrees.getCheckedNodes()
      for (const items of selected) {
        for (let i = 0; i < this.rightTrees[0].children.length; i++) {
          if (this.rightTrees[0].children[i].id === items.id) {
            console.log(this.rightTree)
            this.leftTrees[0].children.push({
              id: this.rightTrees[0].children[i].id,
              label: this.rightTrees[0].children[i].label,
              thKey: this.rightTrees[0].children[i].thKey
            })
            this.rightTrees[0].children.splice(i, 1)
            break
          }
        }
      }
      this.$refs.righttrees.setCheckedKeys([])
      this.$refs.lefttrees.setCheckedKeys([])
    },
    toLefts1() {
      const selected = this.$refs.righttrees1.getCheckedNodes()
      for (const items of selected) {
        for (let i = 0; i < this.rightTrees1[0].children.length; i++) {
          if (this.rightTrees1[0].children[i].id === items.id) {
            this.leftTrees1[0].children.push({
              id: this.rightTrees1[0].children[i].id,
              label: this.rightTrees1[0].children[i].label,
              thKey: this.rightTrees1[0].children[i].thKey
            })
            this.rightTrees1[0].children.splice(i, 1)
            break
          }
        }
      }
      this.$refs.righttrees1.setCheckedKeys([])
      this.$refs.lefttrees1.setCheckedKeys([])
    },
    toRights() {
      const selected = this.$refs.lefttrees.getCheckedNodes()
      for (const items of selected) {
        for (let i = 0; i < this.leftTrees[0].children.length; i++) {
          if (this.leftTrees[0].children[i].id === items.id) {
            this.rightTrees[0].children.push({
              id: this.leftTrees[0].children[i].id,
              label: this.leftTrees[0].children[i].label,
              thKey: this.leftTrees[0].children[i].thKey
            })
            this.leftTrees[0].children.splice(i, 1)
            break
          }
        }
      }
      this.$refs.righttreess.setCheckedKeys([])
      this.$refs.lefttreess.setCheckedKeys([])
    },
    toRights1() {
      const selected = this.$refs.lefttrees1.getCheckedNodes()
      for (const items of selected) {
        for (let i = 0; i < this.leftTrees1[0].children.length; i++) {
          if (this.leftTrees1[0].children[i].id === items.id) {
            this.rightTrees1[0].children.push({
              id: this.leftTrees1[0].children[i].id,
              label: this.leftTrees1[0].children[i].label,
              thKey: this.leftTrees1[0].children[i].thKey
            })
            this.leftTrees1[0].children.splice(i, 1)
            break
          }
        }
      }
      this.$refs.righttrees1.setCheckedKeys([])
      this.$refs.lefttrees1.setCheckedKeys([])
    },
    getTitle() {
      const cytjLists = {}
      for (const item of this.cytjList) {
        cytjLists[item.field] = {
          field: item.field,
          thKey: item.thKey,
          minVal: item.minVal,
          maxVal: item.maxVal
        }
      }
      const pchdLists = {}
      for (const item of this.pchdList) {
        pchdLists[item.field] = {
          field: item.field,
          thKey: item.thKey,
          minVal: item.minVal,
          maxVal: item.maxVal
        }
      }
      this.cytjList = []
      this.pchdList = []
      for (const items of this.leftTree[0].children) {
        if (cytjLists[items.thKey] !== undefined) {
          this.cytjList.push({
            field: cytjLists[items.thKey].field,
            thKey: cytjLists[items.thKey].thKey,
            minVal: cytjLists[items.thKey].minVal,
            maxVal: cytjLists[items.thKey].maxVal
          })
        } else {
          this.cytjList.push({
            field: items.label,
            thKey: items.thKey,
            minVal: '',
            maxVal: ''
          })
        }
        if (pchdLists[items.thKey] !== undefined) {
          this.pchdList.push({
            field: pchdLists[items.thKey].field,
            thKey: pchdLists[items.thKey].thKey,
            minVal: pchdLists[items.thKey].minVal,
            maxVal: pchdLists[items.thKey].maxVal
          })
        } else {
          this.pchdList.push({
            field: items.label,
            thKey: items.thKey,
            minVal: '',
            maxVal: ''
          })
        }
      }
      this.configDialogVisible = false
    },
    getTitle1() {
      const cjbzLists = {}
      for (const item of this.cjbzList) {
        cjbzLists[item.thKey] = {
          field: item.field,
          thKey: item.thKey,
          symbol: item.symbol,
          val: item.val
        }
      }
      const bstjLists = {}
      for (const item of this.bstjList) {
        bstjLists[item.thKey] = {
          field: item.field,
          thKey: item.thKey,
          symbol: item.symbol,
          val: item.val
        }
      }
      this.cjbzList = []
      this.bstjList = []
      for (const items of this.leftTree1[0].children) {
        if (cjbzLists[items.thKey] !== undefined) {
          this.cjbzList.push({
            field: cjbzLists[items.thKey].field,
            thKey: cjbzLists[items.thKey].thKey,
            symbol: cjbzLists[items.thKey].symbol,
            val: cjbzLists[items.thKey].val
          })
        } else {
          this.cjbzList.push({
            field: items.label,
            thKey: items.thKey,
            symbol: '',
            val: ''
          })
        }
        if (bstjLists[items.thKey] !== undefined) {
          this.bstjList.push({
            field: bstjLists[items.thKey].field,
            thKey: bstjLists[items.thKey].thKey,
            symbol: bstjLists[items.thKey].symbol,
            val: bstjLists[items.thKey].val
          })
        } else {
          this.bstjList.push({
            field: items.label,
            thKey: items.thKey,
            symbol: '',
            val: ''
          })
        }
      }
      this.configDialogVisible1 = false
    },
    getTitles() {
      const cytjLists = {}
      for (const item of this.cytjList) {
        cytjLists[item.field] = {
          field: item.field,
          thKey: item.thKey,
          minVal: item.minVal,
          maxVal: item.maxVal
        }
      }
      const pchdLists = {}
      for (const item of this.pchdList) {
        pchdLists[item.field] = {
          field: item.field,
          thKey: item.thKey,
          minVal: item.minVal,
          maxVal: item.maxVal
        }
      }
      this.cytjList = []
      this.pchdList = []
      for (const items of this.leftTrees[0].children) {
        if (cytjLists[items.thKey] !== undefined) {
          this.cytjList.push({
            field: cytjLists[items.thKey].field,
            thKey: cytjLists[items.thKey].thKey,
            minVal: cytjLists[items.thKey].minVal,
            maxVal: cytjLists[items.thKey].maxVal
          })
        } else {
          this.cytjList.push({
            field: items.label,
            thKey: items.thKey,
            minVal: '',
            maxVal: ''
          })
        }
        if (pchdLists[items.thKey] !== undefined) {
          this.pchdList.push({
            field: pchdLists[items.thKey].field,
            thKey: pchdLists[items.thKey].thKey,
            minVal: pchdLists[items.thKey].minVal,
            maxVal: pchdLists[items.thKey].maxVal
          })
        } else {
          this.pchdList.push({
            field: items.label,
            thKey: items.thKey,
            minVal: '',
            maxVal: ''
          })
        }
      }
      this.configDialogVisibles = false
    },
    getTitles1() {
      const cjbzLists = {}
      for (const item of this.cjbzList) {
        cjbzLists[item.thKey] = {
          field: item.field,
          thKey: item.thKey,
          symbol: item.symbol,
          val: item.val
        }
      }
      const bstjLists = {}
      for (const item of this.bstjList) {
        bstjLists[item.thKey] = {
          field: item.field,
          thKey: item.thKey,
          symbol: item.symbol,
          val: item.val
        }
      }
      this.cjbzList = []
      this.bstjList = []
      for (const items of this.leftTrees1[0].children) {
        if (cjbzLists[items.thKey] !== undefined) {
          this.cjbzList.push({
            field: cjbzLists[items.thKey].field,
            thKey: cjbzLists[items.thKey].thKey,
            symbol: cjbzLists[items.thKey].symbol,
            val: cjbzLists[items.thKey].val
          })
        } else {
          this.cjbzList.push({
            field: items.label,
            thKey: items.thKey,
            symbol: '',
            val: ''
          })
        }
        if (bstjLists[items.thKey] !== undefined) {
          this.bstjList.push({
            field: bstjLists[items.thKey].field,
            thKey: bstjLists[items.thKey].thKey,
            symbol: bstjLists[items.thKey].symbol,
            val: bstjLists[items.thKey].val
          })
        } else {
          this.bstjList.push({
            field: items.label,
            thKey: items.thKey,
            symbol: '',
            val: ''
          })
        }
      }
      this.configDialogVisibles1 = false
    },
    // 取消
    resetForm(formName) {
      this.addDialogVisible = false
      this.$refs[formName].resetFields()
    },
    // 删除按钮
    handleDelete(row) {
      this.$confirm('此操作将永久删除当前信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: row.id
        }
        deletesCow(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            if (this.list.length === 1 && this.pageNum !== 1) {
              this.pageNum = this.pageNum - 1
            }
            this.fetchData()
          }
        })
      })
    }
  }
}

