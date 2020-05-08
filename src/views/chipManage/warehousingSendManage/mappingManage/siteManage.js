
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findGYlList } from '@/api/pcChipCasting/pcChipCasting'
import { findColorList, findModelList, findList, findDetail, inserts, update, deletes } from '@/api/chipManage/warehousingSendManage/mappingManage'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      activeTabIndex: 0,
      list: [],
      list1: [],
      userOptions: [],
      machineForm: {
        code: '',
        name: '',
        remark: ''
      },
      setDialog: false,
      min: '',
      beginDate: '',
      newModel: '',
      newcolor: '',
      newcraft: '',
      cowBaseList: [
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
          thName: 'VFM2',
          thKey: 'vfm2'
        },
        {
          thName: 'DVF',
          thKey: 'dvf'
        },
        {
          thName: 'VF',
          thKey: 'vf'
        },
        {
          thName: 'VFD',
          thKey: 'vfd'
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
          thName: 'LOP2',
          thKey: 'lop2'
        },
        {
          thName: 'LOP3',
          thKey: 'lop3'
        },
        {
          thName: 'WLP1',
          thKey: 'wlp1'
        },
        {
          thName: 'WLD1',
          thKey: 'wld1'
        },
        {
          thName: 'WLC1',
          thKey: 'wlc1'
        },
        {
          thName: 'HW1',
          thKey: 'hw1'
        },
        {
          thName: 'PURITY1',
          thKey: 'purity1'
        },
        {
          thName: 'X1',
          thKey: 'x1'
        },
        {
          thName: 'Y1',
          thKey: 'y1'
        },
        {
          thName: 'Z1',
          thKey: 'z1'
        },
        {
          thName: 'CCT1',
          thKey: 'cct1'
        },
        {
          thName: 'ST1',
          thKey: 'st1'
        },
        {
          thName: 'INT1',
          thKey: 'int1'
        },
        {
          thName: 'WLP2',
          thKey: 'wlp2'
        },
        {
          thName: 'WLD2',
          thKey: 'wld2'
        },
        {
          thName: 'WLC2',
          thKey: 'wlc2'
        },
        {
          thName: 'HW2',
          thKey: 'hw2'
        },
        {
          thName: 'PURITY2',
          thKey: 'purity2'
        },
        {
          thName: 'X2',
          thKey: 'x2'
        },
        {
          thName: 'Y2',
          thKey: 'y2'
        },
        {
          thName: 'Z2',
          thKey: 'z2'
        },
        {
          thName: 'CCT2',
          thKey: 'cct2'
        },
        {
          thName: 'ST2',
          thKey: 'st2'
        },
        {
          thName: 'INT2',
          thKey: 'int2'
        },
        {
          thName: 'WLP3',
          thKey: 'wlp3'
        },
        {
          thName: 'WLD3',
          thKey: 'wld3'
        },
        {
          thName: 'WLC3',
          thKey: 'wlc3'
        },
        {
          thName: 'HW3',
          thKey: 'hw3'
        },
        {
          thName: 'PURITY3',
          thKey: 'purity3'
        },
        {
          thName: 'X3',
          thKey: 'x3'
        },
        {
          thName: 'Y3',
          thKey: 'y3'
        },
        {
          thName: 'Z3',
          thKey: 'z3'
        },
        {
          thName: 'CCT3',
          thKey: 'cct3'
        },
        {
          thName: 'ST3',
          thKey: 'st3'
        },
        {
          thName: 'INT3',
          thKey: 'int3'
        }
      ],
      colorList: ['#009494', '#1D89F3', '#F5A11B', '#2ECC71', '#7D1EA9', '#34495E', '#23C6C8', '#7A1057', '#E25D5D', '#6E7074', '#65A2A7', '#B0A5E0', '#A68C4C',
        '#3D46C1', '#F1D1AF', '#06366E', '#333333', '#788EE6', '#52F1E7', '#2688A6', '#FEF046', '#F5A1C1', '#718497', '#87CFDD', '#CFFE48', '#583A33', '#3DFF9D',
        '#2FCBEF', '#FF0000', '#24973E'],
      model: '',
      color: '',
      modelList: [],
      craftList: [],
      colorOptions: [],
      pageSize: 12,
      pageNum: 1,
      totalPage: 0,
      aleady: '',
      newName: '',
      alList: [],
      newFieldList: [],
      setIndex: 0,
      valueMin: '',
      valueMax: '',
      showMin: '',
      showMax: '',
      tips: '',
      showTips: '',
      detailList: [],
      rowInfo: null,
      currentId: 0
    }
  },
  mounted() {
    this.fetchData()
    this.findModelList()
    this.findColorList()
    this.findGYlList()
  },
  methods: {
    findModelList() {
      findModelList().then(res => {
        this.modelList = res.data.list
      })
    },
    findColorList() {
      findColorList().then(res => {
        this.colorOptions = res.data
      })
    },
    findGYlList() {
      findGYlList().then(res => {
        this.craftList = res.data.list
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
    clearAll() {
      this.pageNum = 1
      this.model = ''
      this.color = ''
      this.fetchData()
    },
    isNumbersMin(row) {
      row.min = this.setisNumbers(row.min)
    },
    isNumbersMax(row) {
      row.max = this.setisNumbers(row.max)
    },
    isSevValut1() {
      this.valueMin = this.setisNumbers(this.valueMin)
    },
    isSevValut2() {
      this.valueMax = this.setisNumbers(this.valueMax)
    },
    isSevValut3() {
      this.showMin = this.setisNumbers(this.showMin)
    },
    isSevValut4() {
      this.showMax = this.setisNumbers(this.showMax)
    },
    isSevValut5() {
      this.tips = this.setisNumbers(this.tips)
    },
    isSevValut6() {
      this.showTips = this.setisNumbers(this.showTips)
    },
    setisNumbers(value) {
      value = value + ''
      // 得到第一个字符是否为负号
      var t = value.charAt(0)
      // 先把非数字的都替换掉，除了数字和.
      value = value.replace(/[^\d\.]/g, '')
      // 必须保证第一个为数字而不是.
      value = value.replace(/^\./g, '')
      // 保证只有出现一个.而没有多个.
      value = value.replace(/\.{2,}/g, '.')
      // 保证.只出现一次，而不能出现两次以上
      value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      // 如果第一位是负号，则允许添加
      if (t === '-') {
        value = '-' + value
      }
      return value
    },
    openSet(type) {
      if (this.list1[type].field === null || this.list1[type].field === '') {
        this.$message({
          type: 'error',
          message: '请先选择参数!'
        })
        return
      }
      this.setDialog = true
      this.setIndex = type
      this.valueMin = ''
      this.valueMax = ''
      this.showMin = ''
      this.showMax = ''
      this.tips = ''
      this.showTips = ''
    },
    setValue() {
      const num = /^[0-9]+.?[0-9]*$/
      if (this.valueMin === '') {
        this.$message({
          type: 'error',
          message: '请输入最小值!'
        })
        return
      }
      if (!num.test(this.valueMin)) {
        this.$message({
          type: 'error',
          message: '最小值必须为数字!'
        })
        return
      }
      if (this.valueMax === '') {
        this.$message({
          type: 'error',
          message: '请输入最大值!'
        })
        return
      }
      if (!num.test(this.valueMax)) {
        this.$message({
          type: 'error',
          message: '最大值必须为数字!'
        })
        return
      }
      if (parseFloat(this.valueMax) <= parseFloat(this.valueMin)) {
        this.$message({
          type: 'error',
          message: '最大值必须大于最小值!'
        })
        return
      }
      if (this.showMin === '') {
        this.$message({
          type: 'error',
          message: '请输入显示最小值!'
        })
        return
      }
      if (!num.test(this.showMin)) {
        this.$message({
          type: 'error',
          message: '显示最小值必须为数字!'
        })
        return
      }
      if (this.showMax === '') {
        this.$message({
          type: 'error',
          message: '请输入显示最大值!'
        })
        return
      }
      if (!num.test(this.showMax)) {
        this.$message({
          type: 'error',
          message: '显示最大值必须为数字!'
        })
        return
      }
      if (parseFloat(this.showMax) <= parseFloat(this.showMin)) {
        this.$message({
          type: 'error',
          message: '显示最大值必须大于显示最小值!'
        })
        return
      }
      if (this.tips === '') {
        this.$message({
          type: 'error',
          message: '请输入间隔!'
        })
        return
      }
      if (!num.test(this.tips)) {
        this.$message({
          type: 'error',
          message: '间隔必须为数字!'
        })
        return
      }
      const cz = parseFloat(this.valueMax) - parseFloat(this.valueMin)
      if (parseFloat(this.tips) > cz) {
        this.$message({
          type: 'error',
          message: '间隔不能大于最大值和最小值的差值!'
        })
        return
      }
      if (this.showTips === '') {
        this.$message({
          type: 'error',
          message: '请输入显示间隔!'
        })
        return
      }
      if (!num.test(this.showTips)) {
        this.$message({
          type: 'error',
          message: '显示间隔必须为数字!'
        })
        return
      }
      const showcz = parseFloat(this.showMax) - parseFloat(this.showMin)
      if (parseFloat(this.showTips) > showcz) {
        this.$message({
          type: 'error',
          message: '显示间隔不能大于显示最大值和显示最小值的差值!'
        })
        return
      }
      this.list1[this.setIndex].newDataList = []
      const czint = Math.ceil(cz / parseFloat(this.tips))
      const showczint = Math.ceil(showcz / parseFloat(this.showTips))
      let tofixlength = 0
      if (this.tips.indexOf('.') > -1) {
        tofixlength = (this.tips.split('.')[1]).length
      }
      let value = parseFloat(this.valueMin)
      for (let i = 0; i < czint; i++) {
        if (i >= this.list1[this.setIndex].newDataList.length - 1) {
          if (this.list1[this.setIndex].newDataList.length >= 29 || i === 29) {
            if (this.list1[this.setIndex].newDataList.length < 30) {
              this.addItem(this.setIndex)
            }
            this.list1[this.setIndex].newDataList[i].min = value
            this.list1[this.setIndex].newDataList[i].max = this.valueMax
            break
          }
          this.addItem(this.setIndex)
        }
        this.list1[this.setIndex].newDataList[i].min = value
        const vl = value + parseFloat(this.tips)
        value = parseFloat(vl.toFixed(tofixlength))
        if (value > parseFloat(this.valueMax)) {
          value = parseFloat(this.valueMax)
        }
        this.list1[this.setIndex].newDataList[i].max = value
      }
      let tofixlength1 = 0
      if (this.showTips.indexOf('.') > -1) {
        tofixlength1 = (this.showTips.split('.')[1]).length
      }
      let value1 = parseFloat(this.showMin)
      for (let i = 0; i < showczint; i++) {
        if (i >= this.list1[this.setIndex].newDataList.length - 1) {
          if (this.list1[this.setIndex].newDataList.length >= 29 || i === 29) {
            if (this.list1[this.setIndex].newDataList.length < 30) {
              this.addItem(this.setIndex)
            }
            this.list1[this.setIndex].newDataList[i].showmin = value1
            this.list1[this.setIndex].newDataList[i].showmax = this.showMax
            break
          }
          this.addItem(this.setIndex)
        }
        this.list1[this.setIndex].newDataList[i].showmin = value1
        const vl = value1 + parseFloat(this.showTips)
        value1 = parseFloat(vl.toFixed(tofixlength1))
        if (value1 > parseFloat(this.showMax)) {
          value1 = parseFloat(this.showMax)
        }
        this.list1[this.setIndex].newDataList[i].showmax = value1
      }
      this.setDialog = false
    },
    addItem(index) {
      for (const color of this.colorList) {
        let flag = true
        for (const item of this.list1[index].newDataList) {
          if (item.color === color) {
            flag = false
            break
          }
        }
        if (flag) {
          this.list1[index].newDataList.push({
            min: '',
            max: '',
            showmin: '',
            showmax: '',
            color: color
          })
          break
        }
      }
    },
    deleteItem(rowIndex, index) {
      this.list1[index].newDataList.splice(rowIndex, 1)
    },
    fieldChange() {
      this.newFieldList = []
      for (const field of this.cowBaseList) {
        field.disabled = false
        for (const item of this.list1) {
          if (item.field === field.thKey) {
            field.disabled = true
            break
          }
        }
        this.newFieldList.push(field)
      }
    },
    addList() {
      var li = []
      for (let i = 0; i < 16; i++) {
        li.push({
          min: '',
          max: '',
          color: this.colorList[i]
        })
      }
      this.list1.push({
        field: '',
        unit: '',
        newDataList: li
      })
    },
    deleteList(index) {
      this.list1.splice(index, 1)
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const params = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        model: this.model,
        color: this.color
      }
      findList(params).then(res => {
        this.list = []
        for (let i = 0; i < res.data.list.length; i++) {
          if (res.data.list[i].isPrint === 1) {
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
    // 查询
    listData() {
      const params = {
        pageSize: 100000,
        pageNum: 1
      }
      findList(params).then(res => {
        this.alList = res.data.list
      })
    },
    // 添加
    handleAdd() {
      this.newModel = ''
      this.newcolor = ''
      this.aleady = ''
      this.newName = ''
      this.list1 = []
      this.fieldChange()
      this.listData()
      this.addDialogVisible = true
    },
    // 添加
    handleAdd1() {
      if (this.rowInfo === null) {
        this.$message({
          type: 'error',
          message: '请选择参照行!'
        })
        return
      }
      this.newModel = this.rowInfo.model
      this.newcolor = this.rowInfo.color
      this.newcraft = this.rowInfo.craft
      this.newName = this.rowInfo.name
      this.list1 = []
      this.fieldChange()
      this.listData()
      this.findDetail(this.rowInfo.id)
      this.addDialogVisible = true
    },
    handleCurrentChange(row) {
      if (row === null) {
        return
      }
      this.rowInfo = row
    },
    // 添加
    handleEdit(row) {
      this.currentId = row.id
      this.newModel = row.model
      this.newcolor = row.color
      this.newName = row.name
      this.newcraft = row.craft
      this.list1 = []
      this.findDetail(row.id)
      this.editDialogVisible = true
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    alreadyName() {
      let setvalue = null
      for (const read of this.alList) {
        if (read.id === this.aleady) {
          setvalue = read
          break
        }
      }
      this.newName = setvalue.name
      this.newcolor = setvalue.color
      this.newModel = setvalue.model
      this.findDetail(this.aleady)
    },
    findDetail(id) {
      const params = {
        id: id
      }
      findDetail(params).then(res => {
        this.detailList = res.data
        this.list1 = []
        for (const value of this.detailList) {
          var dataList = []
          for (const li of value.colorList) {
            dataList.push({
              min: li.minval,
              max: li.maxval,
              color: li.color,
              showmin: li.viewMinval,
              showmax: li.viewMaxval
            })
          }
          this.list1.push({
            field: value.param,
            unit: value.unit,
            newDataList: dataList
          })
        }
        this.fieldChange()
      })
    },
    produceName() {
      if (this.newModel !== '' && this.newcolor !== '' && this.newcraft !== '') {
        this.newName = this.newcolor + this.newModel + this.newcraft
      }
    },
    // 添加提交
    submitForm() {
      if (this.newModel === '') {
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
      if (this.newcraft === '') {
        this.$message({
          type: 'error',
          message: '请选择工艺!'
        })
        return
      }
      const paramsList = []
      let flag = false
      let flag1 = false
      for (const item of this.list1) {
        if (item.field === '' || item.unit === '') {
          flag = true
          break
        }
        let maxfalg = -1000000
        let maxfalg1 = -1000000
        const colorList = []
        for (const value of item.newDataList) {
          if (value.max === '' || value.min === '') {
            flag1 = true
            break
          }
          if (value.showmax === '' || value.showmin === '') {
            flag1 = true
            break
          }
          if (parseFloat(value.max) <= parseFloat(value.min)) {
            flag1 = true
            break
          }
          if (parseFloat(value.showmax) <= parseFloat(value.showmin)) {
            flag1 = true
            break
          }
          if (maxfalg > parseFloat(value.min) || maxfalg > parseFloat(value.max)) {
            flag1 = true
            break
          }
          if (maxfalg1 > parseFloat(value.showmin) || maxfalg1 > parseFloat(value.showmax)) {
            flag1 = true
            break
          }
          maxfalg = parseFloat(value.max)
          maxfalg1 = parseFloat(value.showmax)
          colorList.push({
            color: value.color,
            maxval: value.max,
            minval: value.min,
            viewMaxval: value.showmax,
            viewMinval: value.showmin
          })
        }
        paramsList.push({
          param: item.field,
          unit: item.unit,
          colorList: colorList
        })
      }
      if (flag) {
        this.$message({
          type: 'error',
          message: '参数或单位不能为空!'
        })
        return
      }
      if (flag1) {
        this.$message({
          type: 'error',
          message: '标色设置不能为空或输入不正确!'
        })
        return
      }
      const params = {
        model: this.newModel,
        name: this.newName,
        color: this.newcolor,
        craft: this.newcraft,
        creator: sessionStorage.getItem('User-Id'),
        paramsList: paramsList
      }
      inserts(params).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          this.addDialogVisible = false
          this.fetchData()
        }
      })
    },
    // 添加提交
    editsubmitForm() {
      if (this.newModel === '') {
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
      if (this.newcraft === '') {
        this.$message({
          type: 'error',
          message: '请选择工艺!'
        })
        return
      }
      const paramsList = []
      let flag = false
      let flag1 = false
      for (const item of this.list1) {
        if (item.field === '' || item.unit === '') {
          flag = true
          break
        }
        let maxfalg = -1000000
        let maxfalg1 = -1000000
        const colorList = []
        for (const value of item.newDataList) {
          if (value.max === '' || value.min === '') {
            flag1 = true
            break
          }
          if (value.showmax === '' || value.showmin === '') {
            flag1 = true
            break
          }
          if (parseFloat(value.max) <= parseFloat(value.min)) {
            flag1 = true
            break
          }
          if (parseFloat(value.showmax) <= parseFloat(value.showmin)) {
            flag1 = true
            break
          }
          if (maxfalg > parseFloat(value.min) || maxfalg > parseFloat(value.max)) {
            flag1 = true
            break
          }
          if (maxfalg1 > parseFloat(value.showmin) || maxfalg1 > parseFloat(value.showmax)) {
            flag1 = true
            break
          }
          maxfalg = parseFloat(value.max)
          maxfalg1 = parseFloat(value.showmax)
          colorList.push({
            color: value.color,
            maxval: value.max,
            minval: value.min,
            viewMaxval: value.showmax,
            viewMinval: value.showmin
          })
        }
        paramsList.push({
          param: item.field,
          unit: item.unit,
          colorList: colorList
        })
      }
      if (flag) {
        this.$message({
          type: 'error',
          message: '参数或单位不能为空!'
        })
        return
      }
      if (flag1) {
        this.$message({
          type: 'error',
          message: '标色设置不能为空或输入不正确!'
        })
        return
      }
      const params = {
        id: this.currentId,
        model: this.newModel,
        name: this.newName,
        color: this.newcolor,
        craft: this.newcraft,
        creator: sessionStorage.getItem('User-Id'),
        paramsList: paramsList
      }
      update(params).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.editDialogVisible = false
          this.fetchData()
        }
      })
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

