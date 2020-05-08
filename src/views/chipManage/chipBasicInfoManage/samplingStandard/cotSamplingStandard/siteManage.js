
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findModelList, findColorList, findList, disableEnable, save, deletes, findDetail } from '@/api/chipBasicInfoManage/samplingStandard'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      list: [],
      machineForm: {
        code: '',
        name: '',
        remark: ''
      },
      rules: {
        code: [{ required: true, message: '请输入编号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      },
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
          label: 'COT',
          children: []
        }
      ],
      rightTree: [
        {
          id: 1,
          label: 'COT',
          children: []
        }
      ],
      leftTree1: [
        {
          id: 1,
          label: 'COT',
          children: []
        }
      ],
      rightTree1: [
        {
          id: 1,
          label: 'COT',
          children: []
        }
      ],
      leftTrees: [
        {
          id: 1,
          label: 'COT',
          children: []
        }
      ],
      rightTrees: [
        {
          id: 1,
          label: 'COT',
          children: []
        }
      ],
      leftTrees1: [
        {
          id: 1,
          label: 'COT',
          children: []
        }
      ],
      rightTrees1: [
        {
          id: 1,
          label: 'COT',
          children: []
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      cowBaseList: [
        { thName: '入Bin', thKey: 'inBin' },
        { thName: '混合', thKey: 'blend' },
        { thName: '专案', thKey: 'special' },
        { thName: '不良', thKey: 'nogood' },
        { thName: '坏点', thKey: 'baddot' },
        { thName: 'IV均值', thKey: 'ivSvr' },
        { thName: 'VF1均值', thKey: 'vf1Svr' },
        { thName: 'VZ均值', thKey: 'vzSvr' },
        { thName: 'Thyristor良率', thKey: 'thyristorYield' },
        { thName: 'Thyristor坏点', thKey: 'thyristorBad' },
        { thName: '综合良率', thKey: 'compreYield' },
        { thName: '生产良率', thKey: 'productYield' },
        { thName: 'VF1良率', thKey: 'vf1Yield' },
        { thName: 'VF3良率', thKey: 'vf3Yield' },
        { thName: 'VF4良率', thKey: 'vf4Yield' },
        { thName: 'WLD1良率', thKey: 'wld1Yield' },
        { thName: 'WLP1良率', thKey: 'wlp1Yield' },
        { thName: 'IR良率', thKey: 'irYield' },
        { thName: 'IR_ESD_A良率', thKey: 'irEsdYield' },
        { thName: 'VZ良率', thKey: 'vzYield' },
        { thName: 'IV良率', thKey: 'ivYield' },
        { thName: 'BS良率', thKey: 'bsYield' },
        { thName: 'VF2均值', thKey: 'vf2Svr' },
        { thName: 'VF3均值', thKey: 'vf3Svr' },
        { thName: 'VF4均值', thKey: 'vf4Svr' },
        { thName: 'WLD1均值', thKey: 'wld1Svr' },
        { thName: 'WLD1_STD', thKey: 'wld1Std' },
        { thName: 'WLP1均值', thKey: 'wlp1Svr' },
        { thName: 'HW1', thKey: 'hw1' },
        { thName: 'WLD2均值', thKey: 'wld2Svr' },
        { thName: 'BS(蓝移)', thKey: 'bs' },
        { thName: 'IR均值', thKey: 'irSvr' },
        { thName: '扫描数量', thKey: 'scanNum' },
        { thName: '总测试数', thKey: 'testNum' },
        { thName: '坏点数', thKey: 'badNum' },
        { thName: '微漏电数', thKey: 'leakNum' },
        { thName: 'ESD测试电压(正向)', thKey: 'voltageF' },
        { thName: 'ESD测试电压(负向)', thKey: 'voltageR' }
      ],
      cowBaseList1: [
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
          thName: 'VFD',
          thKey: 'vfd'
        },
        {
          thName: 'VZ',
          thKey: 'vz'
        },
        {
          thName: 'IR',
          thKey: 'ir'
        },
        {
          thName: 'IRESDA',
          thKey: 'iresda'
        },
        {
          thName: 'LOP',
          thKey: 'lop'
        },
        {
          thName: 'WLD',
          thKey: 'wld'
        },
        {
          thName: 'BS',
          thKey: 'bs'
        },
        {
          thName: 'DVF',
          thKey: 'dvf'
        },
        {
          thName: 'HW',
          thKey: 'hw'
        }
      ],
      allready: '',
      newmodel: '',
      newcolor: '',
      checkOptions: [],
      newFieldList: [],
      newFieldList1: [],
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
      currentId: 0,
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
    handleClose() {
      this.fetchData()
      this.editDialogVisible = false
      this.addDialogVisible = false
    },
    clearAll() {
      this.pageNum = 1
      this.beginDate = ''
      this.endDate = ''
      this.model = ''
      this.color = ''
      this.isDisable = ''
      this.fetchData()
    },
    findDetail(id) {
      const params = {
        id: id
      }
      findDetail(params).then(res => {
        for (const items of this.cowBaseList1) {
          for (const d of res.data.conditionList) {
            if (items.thKey === d.field) {
              this.cytjList.push({
                field: items.thKey,
                thKey: items.thKey,
                minval: d.minval,
                maxval: d.maxval
              })
              break
            }
          }
          for (const d of res.data.badList) {
            if (items.thKey === d.field) {
              this.pchdList.push({
                field: items.thKey,
                thKey: items.thKey,
                minval: d.minval,
                maxval: d.maxval
              })
              break
            }
          }
        }
        for (const items of this.cowBaseList) {
          for (const d of res.data.splicingList) {
            if (items.thKey === d.field) {
              this.cjbzList.push({
                field: items.thKey,
                thKey: items.thKey,
                symbol: d.symbol,
                val: d.val
              })
              break
            }
          }
          for (const d of res.data.colorList) {
            if (items.thKey === d.field) {
              this.bstjList.push({
                field: items.thKey,
                thKey: items.thKey,
                symbol: d.symbol,
                val: d.val
              })
              break
            }
          }
        }
        // this.cytjList = res.data.conditionList
        // this.pchdList = res.data.badList
        // this.cjbzList = res.data.splicingList
        // this.bstjList = res.data.colorList
      })
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate),
        model: this.model,
        color: this.color,
        status: this.isDisable
      }
      findList(params).then(res => {
        this.list = []
        for (let i = 0; i < res.data.list.length; i++) {
          if (res.data.list[i].status === 0) {
            res.data.list[i].isChecked = true
          } else {
            res.data.list[i].isChecked = false
          }
          this.list.push(res.data.list[i])
        }
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    findAready() {
      const params = {
        pageNum: 1,
        pageSize: 1000000
      }
      findList(params).then(res => {
        this.allreadyList = res.data.list
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
          disableEnable(requestParams).then(res => {
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
          disableEnable(requestParams).then(res => {
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
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
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
        for (const is of this.cowBaseList1) {
          if (is.thKey === item.field) {
            str = '采样条件' + is.thName
            break
          }
        }
        if (item.minval === null) {
          item.minval = ''
        }
        if (item.maxval === null) {
          item.maxval = ''
        }
        if (item.minval === '' && item.maxval === '') {
          continue
        } else if (item.minval === '' || item.maxval === '') {
          flag = true
          break
        }
        let length1 = 0
        if ((parseFloat(item.minval) + '').indexOf('.') > -1) {
          length1 = (item.minval + '').substring((item.minval + '').indexOf('.') + 1).length
        }
        let length2 = 0
        if ((parseFloat(item.maxval) + '').indexOf('.') > -1) {
          length2 = (item.maxval + '').substring((item.maxval + '').indexOf('.') + 1).length
        }
        if (parseFloat(item.minval) > 99999 || parseFloat(item.maxval) > 99999 || length2 > 4 || length1 > 4) {
          flag3 = true
          break
        }
        const flags = parseFloat(item.minval) + '' === item.minval + ''
        const flags1 = parseFloat(item.maxval) + '' === item.maxval + ''
        if (!flags || !flags1) {
          flag2 = true
          break
        }
        if (parseFloat(item.minval) >= parseFloat(item.maxval)) {
          flag1 = true
          break
        }
        cytjLists.push(item)
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
        for (const is of this.cowBaseList1) {
          if (is.thKey === item.field) {
            str = '抛除坏点后条件' + is.thName
            break
          }
        }
        if (item.minval === null) {
          item.minval = ''
        }
        if (item.maxval === null) {
          item.maxval = ''
        }
        if (item.minval === '' && item.maxval === '') {
          continue
        } else if (item.minval === '' || item.maxval === '') {
          flag = true
          break
        }
        let length1 = 0
        if ((parseFloat(item.minval) + '').indexOf('.') > -1) {
          length1 = (item.minval + '').substring((item.minval + '').indexOf('.') + 1).length
        }
        let length2 = 0
        if ((parseFloat(item.maxval) + '').indexOf('.') > -1) {
          length2 = (item.maxval + '').substring((item.maxval + '').indexOf('.') + 1).length
        }
        if (parseFloat(item.minval) > 99999 || parseFloat(item.maxval) > 99999 || length2 > 4 || length1 > 4) {
          flag3 = true
          break
        }
        const flags = parseFloat(item.minval) + '' === item.minval + ''
        const flags1 = parseFloat(item.maxval) + '' === item.maxval + ''
        if (!flags || !flags1) {
          flag2 = true
          break
        }
        if (parseFloat(item.minval) >= parseFloat(item.maxval)) {
          flag1 = true
          break
        }
        pchdLists.push(item)
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
        for (const is of this.cowBaseList) {
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
        for (const is of this.cowBaseList) {
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
      const params = {
        badList: pchdLists,
        color: this.newcolor,
        colorList: bstjLists,
        conditionList: cytjLists,
        creator: sessionStorage.getItem('User-Id'),
        model: this.newmodel,
        name: this.newname,
        splicingList: cjbzLists
      }
      save(params).then(res => {
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
        for (const is of this.cowBaseList1) {
          if (is.thKey === item.field) {
            str = '采样条件' + is.thName
            break
          }
        }
        if (item.minval === null) {
          item.minval = ''
        }
        if (item.maxval === null) {
          item.maxval = ''
        }
        if (item.minval === '' && item.maxval === '') {
          continue
        } else if (item.minval === '' || item.maxval === '') {
          flag = true
          break
        }
        let length1 = 0
        if ((parseFloat(item.minval) + '').indexOf('.') > -1) {
          length1 = (item.minval + '').substring((item.minval + '').indexOf('.') + 1).length
        }
        let length2 = 0
        if ((parseFloat(item.maxval) + '').indexOf('.') > -1) {
          length2 = (item.maxval + '').substring((item.maxval + '').indexOf('.') + 1).length
        }
        if (parseFloat(item.minval) > 99999 || parseFloat(item.maxval) > 99999 || length2 > 4 || length1 > 4) {
          flag3 = true
          break
        }
        const flags = parseFloat(item.minval) + '' === item.minval + ''
        const flags1 = parseFloat(item.maxval) + '' === item.maxval + ''
        if (!flags || !flags1) {
          flag2 = true
          break
        }
        if (parseFloat(item.minval) >= parseFloat(item.maxval)) {
          flag1 = true
          break
        }
        cytjLists.push(item)
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
        for (const is of this.cowBaseList1) {
          if (is.thKey === item.field) {
            str = '抛除坏点后条件' + is.thName
            break
          }
        }
        if (item.minval === null) {
          item.minval = ''
        }
        if (item.maxval === null) {
          item.maxval = ''
        }
        if (item.minval === '' && item.maxval === '') {
          continue
        } else if (item.minval === '' || item.maxval === '') {
          flag = true
          break
        }
        let length1 = 0
        if ((parseFloat(item.minval) + '').indexOf('.') > -1) {
          length1 = (item.minval + '').substring((item.minval + '').indexOf('.') + 1).length
        }
        let length2 = 0
        if ((parseFloat(item.maxval) + '').indexOf('.') > -1) {
          length2 = (item.maxval + '').substring((item.maxval + '').indexOf('.') + 1).length
        }
        if (parseFloat(item.minval) > 99999 || parseFloat(item.maxval) > 99999 || length2 > 4 || length1 > 4) {
          flag3 = true
          break
        }
        const flags = parseFloat(item.minval) + '' === item.minval + ''
        const flags1 = parseFloat(item.maxval) + '' === item.maxval + ''
        if (!flags || !flags1) {
          flag2 = true
          break
        }
        if (parseFloat(item.minval) >= parseFloat(item.maxval)) {
          flag1 = true
          break
        }
        pchdLists.push(item)
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
        for (const is of this.cowBaseList) {
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
        for (const is of this.cowBaseList) {
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
      const params = {
        id: this.currentId,
        badList: pchdLists,
        color: this.newcolor,
        colorList: bstjLists,
        conditionList: cytjLists,
        creator: sessionStorage.getItem('User-Id'),
        model: this.newmodel,
        name: this.newname,
        splicingList: cjbzLists
      }
      save(params).then(res => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        this.editDialogVisible = false
        this.fetchData()
      })
    },
    handleEdit(row) {
      this.currentId = row.id
      this.cytjList = []
      this.pchdList = []
      this.cjbzList = []
      this.bstjList = []
      this.findDetail(this.currentId)
      this.newmodel = row.model
      this.newcolor = row.color
      this.newname = row.name
      this.editDialogVisible = true
      this.setfi1()
      this.setfi2()
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
      this.findDetail(this.allready)
    },
    // 添加
    handleAdd() {
      this.findAready()
      this.findModelList()
      this.findColorList()
      this.newmodel = ''
      this.newcolor = ''
      this.newname = ''
      this.cytjList = []
      this.pchdList = []
      this.cjbzList = []
      this.bstjList = []
      this.allready = ''
      this.addDialogVisible = true
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
      for (const field of this.cowBaseList1) {
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
      for (const field of this.cowBaseList1) {
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
        minval: '',
        maxval: '',
        thKey: ''
      })
    },
    addPCHD() {
      this.pchdList.push({
        field: '',
        minval: '',
        maxval: '',
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
    addConfig() {
      this.configDialogVisible = true
      this.leftTree = [
        {
          id: 1,
          label: 'COT',
          children: []
        }
      ]
      this.rightTree = [
        {
          id: 1,
          label: 'COT',
          children: []
        }
      ]
      for (let i = 0; i < this.cowBaseList1.length; i++) {
        let flag = false
        for (const items of this.cytjList) {
          if (items.field === this.cowBaseList1[i].thName.toLowerCase()) {
            flag = true
            break
          }
        }
        if (!flag) {
          this.rightTree[0].children.push({
            id: 1 + '' + i,
            label: this.cowBaseList1[i].thName,
            thKey: this.cowBaseList1[i].thKey
          })
        } else {
          this.leftTree[0].children.push({
            id: 1 + '' + i,
            label: this.cowBaseList1[i].thName,
            thKey: this.cowBaseList1[i].thKey
          })
        }
      }
    },
    addConfig1() {
      this.configDialogVisible1 = true
      this.leftTree1 = [
        {
          id: 1,
          label: 'COT',
          children: []
        }
      ]
      this.rightTree1 = [
        {
          id: 1,
          label: 'COT',
          children: []
        }
      ]
      for (let i = 0; i < this.cowBaseList.length; i++) {
        let flag = false
        for (const items of this.cjbzList) {
          if (items.thKey === this.cowBaseList[i].thKey) {
            flag = true
            break
          }
        }
        if (!flag) {
          this.rightTree1[0].children.push({
            id: 1 + '' + i,
            label: this.cowBaseList[i].thName,
            thKey: this.cowBaseList[i].thKey
          })
        } else {
          this.leftTree1[0].children.push({
            id: 1 + '' + i,
            label: this.cowBaseList[i].thName,
            thKey: this.cowBaseList[i].thKey
          })
        }
      }
    },
    addConfigs() {
      this.configDialogVisibles = true
      this.leftTrees = [
        {
          id: 1,
          label: 'COT',
          children: []
        }
      ]
      this.rightTrees = [
        {
          id: 1,
          label: 'COT',
          children: []
        }
      ]
      for (let i = 0; i < this.cowBaseList1.length; i++) {
        let flag = false
        for (const items of this.cytjList) {
          if (items.field === this.cowBaseList1[i].thName.toLowerCase()) {
            flag = true
            break
          }
        }
        if (!flag) {
          this.rightTrees[0].children.push({
            id: 1 + '' + i,
            label: this.cowBaseList1[i].thName,
            thKey: this.cowBaseList1[i].thKey
          })
        } else {
          this.leftTrees[0].children.push({
            id: 1 + '' + i,
            label: this.cowBaseList1[i].thName,
            thKey: this.cowBaseList1[i].thKey
          })
        }
      }
    },
    addConfigs1() {
      this.configDialogVisibles1 = true
      this.leftTrees1 = [
        {
          id: 1,
          label: 'COT',
          children: []
        }
      ]
      this.rightTrees1 = [
        {
          id: 1,
          label: 'COT',
          children: []
        }
      ]
      for (let i = 0; i < this.cowBaseList.length; i++) {
        let flag = false
        for (const items of this.cjbzList) {
          if (items.thKey === this.cowBaseList[i].thKey) {
            flag = true
            break
          }
        }
        if (!flag) {
          this.rightTrees1[0].children.push({
            id: 1 + '' + i,
            label: this.cowBaseList[i].thName,
            thKey: this.cowBaseList[i].thKey
          })
        } else {
          this.leftTrees1[0].children.push({
            id: 1 + '' + i,
            label: this.cowBaseList[i].thName,
            thKey: this.cowBaseList[i].thKey
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
      this.$refs.righttrees.setCheckedKeys([])
      this.$refs.lefttrees.setCheckedKeys([])
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
        cytjLists[item.field.toLowerCase()] = {
          field: item.field,
          thKey: item.thKey,
          minval: item.minval,
          maxval: item.maxval
        }
      }
      const pchdLists = {}
      for (const item of this.pchdList) {
        pchdLists[item.field.toLowerCase()] = {
          field: item.field,
          thKey: item.thKey,
          minval: item.minval,
          maxval: item.maxval
        }
      }
      this.cytjList = []
      this.pchdList = []
      for (const items of this.leftTree[0].children) {
        if (cytjLists[items.thKey] !== undefined) {
          this.cytjList.push({
            field: cytjLists[items.thKey].field,
            thKey: cytjLists[items.thKey].thKey,
            minval: cytjLists[items.thKey].minval,
            maxval: cytjLists[items.thKey].maxval
          })
        } else {
          this.cytjList.push({
            field: items.label,
            thKey: items.thKey,
            minval: '',
            maxval: ''
          })
        }
        if (pchdLists[items.thKey] !== undefined) {
          this.pchdList.push({
            field: pchdLists[items.thKey].field,
            thKey: pchdLists[items.thKey].thKey,
            minval: pchdLists[items.thKey].minval,
            maxval: pchdLists[items.thKey].maxval
          })
        } else {
          this.pchdList.push({
            field: items.label,
            thKey: items.thKey,
            minval: '',
            maxval: ''
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
        cytjLists[item.field.toLowerCase()] = {
          field: item.field,
          thKey: item.thKey,
          minval: item.minval,
          maxval: item.maxval
        }
      }
      const pchdLists = {}
      for (const item of this.pchdList) {
        pchdLists[item.field.toLowerCase()] = {
          field: item.field,
          thKey: item.thKey,
          minval: item.minval,
          maxval: item.maxval
        }
      }
      this.cytjList = []
      this.pchdList = []
      for (const items of this.leftTrees[0].children) {
        if (cytjLists[items.thKey] !== undefined) {
          this.cytjList.push({
            field: cytjLists[items.thKey].field,
            thKey: cytjLists[items.thKey].thKey,
            minval: cytjLists[items.thKey].minval,
            maxval: cytjLists[items.thKey].maxval
          })
        } else {
          this.cytjList.push({
            field: items.label,
            thKey: items.thKey,
            minval: '',
            maxval: ''
          })
        }
        if (pchdLists[items.thKey] !== undefined) {
          this.pchdList.push({
            field: pchdLists[items.thKey].field,
            thKey: pchdLists[items.thKey].thKey,
            minval: pchdLists[items.thKey].minval,
            maxval: pchdLists[items.thKey].maxval
          })
        } else {
          this.pchdList.push({
            field: items.label,
            thKey: items.thKey,
            minval: '',
            maxval: ''
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
        deletes(params).then(res => {
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

