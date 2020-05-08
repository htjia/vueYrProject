
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findModelList, findColorList, findAOIList, disableAOIEnable, deletesAOI, saveAOI, updateAOI } from '@/api/chipBasicInfoManage/samplingStandard'
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
      configDialogVisible: false,
      configDialogVisibles: false,
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
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      cowBaseList: [
        {
          thName: 'AOITotalDies',
          thKey: 'aoitotaldies'
        },
        {
          thName: 'AOIOKDies',
          thKey: 'aoiokdies'
        },
        {
          thName: 'AOINGDies',
          thKey: 'aoingdies'
        },
        {
          thName: 'NOAOIOKDies',
          thKey: 'noaoiokdies'
        },
        {
          thName: 'NOAOINGDies',
          thKey: 'noaoingdies'
        },
        {
          thName: 'NOAOIYield',
          thKey: 'noaoiyield'
        },
        {
          thName: 'ProbeTestYield',
          thKey: 'probetestyield'
        },
        {
          thName: 'ProbeTotalDies',
          thKey: 'probetotaldies'
        },
        {
          thName: 'ProbeOKDies',
          thKey: 'probeokdies'
        },
        {
          thName: 'ProbeNGDies',
          thKey: 'probengdies'
        },
        {
          thName: 'AOIYieldOfProbe',
          thKey: 'aoiyieldofprobe'
        },
        {
          thName: 'AOIWaferYield',
          thKey: 'aoiwaferyield'
        },
        {
          thName: 'NoneProbepercentage',
          thKey: 'noneprobepercentage'
        },
        {
          thName: 'CombineWaferYield',
          thKey: 'combinewaferyield'
        },
        {
          thName: 'DoubleDies',
          thKey: 'doubledies'
        },
        {
          thName: 'DoubleDiesYield',
          thKey: 'doublediesyield'
        },
        {
          thName: 'CrackDies',
          thKey: 'crackdies'
        },
        {
          thName: 'CrackDiesYield',
          thKey: 'crackdiesyield'
        },
        {
          thName: 'MissDies',
          thKey: 'missdies'
        },
        {
          thName: 'Region1Defect',
          thKey: 'region1defect'
        },
        {
          thName: 'Region1DefectYield',
          thKey: 'region1defectyield'
        },
        {
          thName: 'Region2Defect',
          thKey: 'region2defect'
        },
        {
          thName: 'Region2DefectYield',
          thKey: 'region2defectyield'
        },
        {
          thName: 'Region3Defect',
          thKey: 'region3defect'
        },
        {
          thName: 'Region3DefectYield',
          thKey: 'region3defectyield'
        },
        {
          thName: 'Region4Defect',
          thKey: 'region4defect'
        },
        {
          thName: 'Region4DefectYield',
          thKey: 'region4defectyield'
        },
        {
          thName: 'Region5Defect',
          thKey: 'region5defect'
        },
        {
          thName: 'Region5DefectYield',
          thKey: 'region5defectyield'
        },
        {
          thName: 'Region6Defect',
          thKey: 'region6defect'
        },
        {
          thName: 'Region6DefectYield',
          thKey: 'region6defectyield'
        },
        {
          thName: 'Region7Defect',
          thKey: 'region7defect'
        },
        {
          thName: 'Region7DefectYield',
          thKey: 'region7defectyield'
        },
        {
          thName: 'Region8Defect',
          thKey: 'region8defect'
        },
        {
          thName: 'Region8DefectYield',
          thKey: 'region8defectyield'
        },
        {
          thName: 'Region9Defect',
          thKey: 'region9defect'
        },
        {
          thName: 'Region9DefectYield',
          thKey: 'region9defectyield'
        },
        {
          thName: 'Region10Defect',
          thKey: 'region10defect'
        },
        {
          thName: 'Region10DefectYield',
          thKey: 'region10defectyield'
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
      findAOIList(params).then(res => {
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
          disableAOIEnable(requestParams).then(res => {
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
          disableAOIEnable(requestParams).then(res => {
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
    submitAddForm() {
      var flag = false
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
        cytjLists.push(item)
      }
      if (flag) {
        this.$message({
          type: 'error',
          message: str + '填写数据不能为空!'
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
        conditions: cytjLists,
        creator: sessionStorage.getItem('User-Id'),
        name: this.newname
      }
      saveAOI(params).then(res => {
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
        cytjLists.push(item)
      }
      if (flag) {
        this.$message({
          type: 'error',
          message: str + '填写数据不能为空!'
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
        conditions: cytjLists,
        creator: sessionStorage.getItem('User-Id'),
        name: this.newname
      }
      updateAOI(params).then(res => {
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
      this.beginDate = ''
      this.endDate = ''
      this.pageNum = 1
      this.fetchData()
    },
    handleClose() {
      this.fetchData()
      this.editDialogVisible = false
      this.addDialogVisible = false
    },
    handleEdit(row) {
      this.currentId = row.id
      this.cytjList = []
      for (const item of row.conditions) {
        for (let i = 0; i < this.cowBaseList.length; i++) {
          if (item.field === this.cowBaseList[i].thName.toLowerCase()) {
            var data = {
              field: item.field,
              thKey: item.field,
              symbol: item.symbol,
              val: item.val
            }
            this.cytjList.push(data)
            break
          }
        }
      }
      this.newmodel = row.model
      this.newcolor = row.color
      this.newname = row.name
      this.editDialogVisible = true
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
      this.cytjList = data.conditions
    },
    produceName() {
      console.log(123)
    },
    findAready() {
      const params = {
        pageNum: 1,
        pageSize: 1000000
      }
      findAOIList(params).then(res => {
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
      this.cytjList = []
      this.allready = ''
      this.addDialogVisible = true
    },
    addCY() {
      this.cytjList.push({
        field: '',
        symbol: '',
        val: '',
        thKey: ''
      })
    },
    removeCY(index) {
      this.cytjList.splice(index, 1)
    },
    addConfig() {
      this.configDialogVisible = true
      this.leftTree = [
        {
          id: 1,
          label: 'AOI',
          children: []
        }
      ]
      this.rightTree = [
        {
          id: 1,
          label: 'AOI',
          children: []
        }
      ]
      for (let i = 0; i < this.cowBaseList.length; i++) {
        let flag = false
        for (const items of this.cytjList) {
          if (items.field === this.cowBaseList[i].thName.toLowerCase()) {
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
    addConfigs() {
      this.configDialogVisibles = true
      this.leftTrees = [
        {
          id: 1,
          label: 'AOI',
          children: []
        }
      ]
      this.rightTrees = [
        {
          id: 1,
          label: 'AOI',
          children: []
        }
      ]
      for (let i = 0; i < this.cowBaseList.length; i++) {
        let flag = false
        for (const items of this.cytjList) {
          if (items.field === this.cowBaseList[i].thName.toLowerCase()) {
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
    toLeft() {
      const selected = this.$refs.righttree.getCheckedNodes()
      for (const items of selected) {
        for (let i = 0; i < this.rightTree[0].children.length; i++) {
          if (this.rightTree[0].children[i].id === items.id) {
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
    toLefts() {
      const selected = this.$refs.righttrees.getCheckedNodes()
      for (const items of selected) {
        for (let i = 0; i < this.rightTrees[0].children.length; i++) {
          if (this.rightTrees[0].children[i].id === items.id) {
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
    getTitle() {
      const cytjLists = {}
      for (const item of this.cytjList) {
        cytjLists[item.field] = {
          field: item.field,
          thKey: item.thKey,
          symbol: item.symbol,
          val: item.val
        }
      }
      this.cytjList = []
      for (const items of this.leftTree[0].children) {
        if (cytjLists[items.thKey] !== undefined) {
          this.cytjList.push({
            field: cytjLists[items.thKey].field,
            thKey: cytjLists[items.thKey].thKey,
            symbol: cytjLists[items.thKey].symbol,
            val: cytjLists[items.thKey].val
          })
        } else {
          this.cytjList.push({
            field: items.thKey,
            thKey: items.label,
            symbol: '',
            val: ''
          })
        }
      }
      this.configDialogVisible = false
    },
    getTitles() {
      const cytjLists = {}
      for (const item of this.cytjList) {
        cytjLists[item.field] = {
          field: item.field,
          thKey: item.thKey,
          symbol: item.symbol,
          val: item.val
        }
      }
      this.cytjList = []
      for (const items of this.leftTrees[0].children) {
        if (cytjLists[items.thKey] !== undefined) {
          this.cytjList.push({
            field: cytjLists[items.thKey].field,
            thKey: cytjLists[items.thKey].thKey,
            symbol: cytjLists[items.thKey].symbol,
            val: cytjLists[items.thKey].val
          })
        } else {
          this.cytjList.push({
            field: items.thKey,
            thKey: items.label,
            symbol: '',
            val: ''
          })
        }
      }
      this.configDialogVisibles = false
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
        deletesAOI(params).then(res => {
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

