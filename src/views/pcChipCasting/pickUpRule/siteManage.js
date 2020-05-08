
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findColorList, findModelList, scRuleBelongList, pickRuleFind, findDetail, disableEnable, deleteRule, save, findHistory } from '@/api/pcChipCasting/pickUpRule'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      historyDialogVisible: false,
      activeTabIndex: 0,
      list: [],
      userOptions: [],
      filedRule: {
        name: '',
        color: '',
        model: '',
        rule: '',
        version: '001',
        remark: ''
      },
      fieldList: [
        {
          id: 0,
          name: 'IR平均值',
          key: 'lr'
        },
        {
          id: 1,
          name: 'IV平均值',
          key: 'iv'
        },
        {
          id: 2,
          name: 'VF1平均值',
          key: 'vf1'
        },
        {
          id: 3,
          name: 'VF2平均值',
          key: 'vf2'
        },
        {
          id: 4,
          name: 'VF3平均值',
          key: 'vf3'
        },
        {
          id: 5,
          name: 'VF4平均值',
          key: 'avg_vf4'
        },
        {
          id: 6,
          name: 'VZ平均值',
          key: 'vz'
        },
        {
          id: 7,
          name: 'WLD1平均值',
          key: 'wld'
        },
        {
          id: 8,
          name: 'BOW',
          key: 'bow'
        },
        {
          id: 9,
          name: '蓝移',
          key: 'bs'
        },
        {
          id: 10,
          name: '光色',
          key: 'color'
        },
        {
          id: 11,
          name: 'esd200(去坏)',
          key: 'esd200v'
        },
        {
          id: 12,
          name: 'esd400(去坏)',
          key: 'esd400'
        },
        {
          id: 13,
          name: 'esd450(去坏)',
          key: 'esd450'
        },
        {
          id: 14,
          name: 'esd50(去坏)',
          key: 'esd50v'
        },
        {
          id: 41,
          name: 'esd500(去坏)',
          key: 'esd500'
        },
        {
          id: 15,
          name: '目检外观',
          key: 'inspection'
        },
        {
          id: 16,
          name: '综合判定',
          key: 'judge'
        },
        {
          id: 17,
          name: '半波宽',
          key: 'hw1'
        },
        {
          id: 18,
          name: 'ii平均值',
          key: 'pl_ii'
        },
        {
          id: 19,
          name: '外观异常原因',
          key: 'visual_reason'
        },
        {
          id: 20,
          name: 'lop460',
          key: 'lop460'
        },
        {
          id: 21,
          name: '机台',
          key: 'machine'
        },
        {
          id: 22,
          name: 'PL_PD',
          key: 'pl_pd'
        },
        {
          id: 42,
          name: 'WLD(PL-COW)',
          key: 'k_val'
        },
        {
          id: 23,
          name: 'PLINT_STD',
          key: 'plint_std'
        },
        {
          id: 24,
          name: '生产类型',
          key: 'product'
        },
        {
          id: 25,
          name: 'recipe',
          key: 'recipe'
        },
        {
          id: 26,
          name: 'PL_REF',
          key: 'pl_ref'
        },
        {
          id: 27,
          name: 'REMARK',
          key: 'remark'
        },
        {
          id: 28,
          name: '衬底类型',
          key: 'sub_type'
        },
        {
          id: 29,
          name: '衬底厂家',
          key: 'supplier'
        },
        {
          id: 30,
          name: '衬底工艺',
          key: 'sub'
        },
        {
          id: 31,
          name: '验证版型',
          key: 'yz_type'
        },
        {
          id: 32,
          name: '预估波长',
          key: 'cow_wd'
        },
        {
          id: 33,
          name: 'PL_WD',
          key: 'pl_wd'
        },
        {
          id: 34,
          name: 'PL_WD STD',
          key: 'pl_std'
        },
        {
          id: 35,
          name: '综合良率',
          key: 'yield'
        },
        {
          id: 36,
          name: 'Ir良率',
          key: 'lr_yield'
        },
        {
          id: 37,
          name: 'Ir<0.2良率',
          key: 'yield_ir02'
        },
        {
          id: 38,
          name: 'thyristor良率',
          key: 'thyristor'
        },
        {
          id: 39,
          name: 'vf1良率',
          key: 'vf1_yield'
        },
        {
          id: 40,
          name: 'vz良率',
          key: 'vz_yield'
        }
      ],
      newList: [],
      newFieldList: [],
      rowInfo: null,
      color: '',
      colorList: [],
      model: '',
      modelList: [],
      rule: '',
      ruleList: [],
      isDisable: false,
      pageSize: 12,
      pageNum: 1,
      totalPage: 0,
      anotherList: [],
      historyList: [],
      historyContentList: []
    }
  },
  mounted() {
    this.fetchData()
    this.findColorModelList()
  },
  methods: {
    findColorModelList() {
      findColorList().then(res => {
        this.colorList = res.data
      })
      findModelList().then(res => {
        this.modelList = res.data
      })
      scRuleBelongList().then(res => {
        this.ruleList = res.data.list
      })
    },
    handleSearch() {
      this.pageNum = 1
      this.fetchData()
    },
    handleAbnormal() {
      this.fetchData()
    },
    clearAll() {
      this.pageNum = 1
      this.color = ''
      this.model = ''
      this.rule = ''
      this.fetchData()
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        color: this.color,
        model: this.model,
        belongId: this.rule,
        status: this.isDisable ? '1' : '0'
      }
      pickRuleFind(params).then(res => {
        this.list = []
        this.anotherList = []
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
    setStatus(row) {
      if (row.isChecked) {
        this.$confirm('确定启用' + row.name + '?', '提示', {
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
        this.$confirm('确定弃用' + row.name + '?', '提示', {
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
    // 删除按钮
    handleDelete(row) {
      this.$confirm('此操作将永久删除当前挑片规则, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: row.id
        }
        deleteRule(params).then(res => {
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
    },
    // 添加
    handleAdd(type) {
      this.newFieldList = []
      this.filedRule = {
        name: '',
        color: '',
        model: '',
        rule: '',
        version: '001',
        remark: ''
      }
      this.newList = []
      if (type === 1) {
        if (this.rowInfo === null) {
          this.$message({
            type: 'error',
            message: '请选择参照行!'
          })
          return
        }
        this.filedRule.name = this.rowInfo.name
        this.filedRule.color = this.rowInfo.color
        this.filedRule.model = this.rowInfo.model
        this.filedRule.rule = this.rowInfo.belongId
        this.filedRule.version = '001'
        for (const item of this.anotherList) {
          var data = {
            field: item.field,
            condition: item.content
          }
          this.newList.push(data)
        }
        this.fieldChange()
      }
      this.addDialogVisible = true
    },
    // 修改
    handleEdit() {
      this.newFieldList = []
      this.filedRule = {
        name: '',
        color: '',
        model: '',
        rule: '',
        version: '',
        remark: ''
      }
      this.newList = []
      if (this.rowInfo === null) {
        this.$message({
          type: 'error',
          message: '请选择修改行!'
        })
        return
      }
      this.filedRule.name = this.rowInfo.name
      this.filedRule.color = this.rowInfo.color
      this.filedRule.model = this.rowInfo.model
      this.filedRule.rule = this.rowInfo.belongId
      this.filedRule.version = this.rowInfo.version
      this.filedRule.remark = this.rowInfo.remark
      for (const item of this.anotherList) {
        var data = {
          field: item.field,
          condition: item.content
        }
        this.newList.push(data)
      }
      this.fieldChange()
      this.editDialogVisible = true
    },
    handleCurrentChange(row) {
      if (row === null) {
        return
      }
      this.rowInfo = row
      const param = {
        id: row.id
      }
      this.anotherList = []
      findDetail(param).then(res => {
        for (const item of res.data) {
          for (const field of this.fieldList) {
            if (field.key === item.field) {
              item.fieldName = field.name
              break
            }
          }
          this.anotherList.push(item)
        }
      })
    },
    // 添加提交
    submitForm() {
      if (this.filedRule.name === '') {
        this.$message({
          type: 'error',
          message: '请填写名称!'
        })
        return
      }
      if (this.filedRule.color === '') {
        this.$message({
          type: 'error',
          message: '请填写光色!'
        })
        return
      }
      if (this.filedRule.model === '') {
        this.$message({
          type: 'error',
          message: '请填写型号!'
        })
        return
      }
      if (this.filedRule.rule === '') {
        this.$message({
          type: 'error',
          message: '请填写客户编码!'
        })
        return
      }
      let flag = true
      const list = []
      for (const item of this.newList) {
        list.push({
          field: item.field,
          content: item.condition
        })
        if (item.field === '' || item.condition === '') {
          flag = false
          break
        }
      }
      if (flag && list.length > 0) {
        const param = {
          belongId: this.filedRule.rule,
          color: this.filedRule.color,
          contentList: list,
          creator: sessionStorage.getItem('User-Id'),
          model: this.filedRule.model,
          name: this.filedRule.name,
          remark: this.filedRule.remark,
          version: this.filedRule.version
        }
        save(param).then(res => {
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          this.addDialogVisible = false
          this.fetchData()
        })
      } else {
        this.$message({
          type: 'error',
          message: '添加字段或条件不能为空!'
        })
      }
    },
    // 修改提交
    submitEditForm() {
      if (this.filedRule.name === '') {
        this.$message({
          type: 'error',
          message: '请填写名称!'
        })
        return
      }
      if (this.filedRule.color === '') {
        this.$message({
          type: 'error',
          message: '请填写光色!'
        })
        return
      }
      if (this.filedRule.model === '') {
        this.$message({
          type: 'error',
          message: '请填写型号!'
        })
        return
      }
      if (this.filedRule.rule === '') {
        this.$message({
          type: 'error',
          message: '请填写客户编码!'
        })
        return
      }
      let flag = true
      const list = []
      for (const item of this.newList) {
        list.push({
          field: item.field,
          content: item.condition
        })
        if (item.field === '' || item.condition === '') {
          flag = false
          break
        }
      }
      if (flag && list.length > 0) {
        const param = {
          belongId: this.filedRule.rule,
          color: this.filedRule.color,
          contentList: list,
          creator: sessionStorage.getItem('User-Id'),
          id: this.rowInfo.id,
          model: this.filedRule.model,
          name: this.filedRule.name,
          remark: this.filedRule.remark,
          version: this.filedRule.version
        }
        save(param).then(res => {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.editDialogVisible = false
          this.fetchData()
        })
      } else {
        this.$message({
          type: 'error',
          message: '添加字段或条件不能为空!'
        })
      }
    },
    // 查看历史
    handleHistory(row) {
      this.historyList = []
      this.historyContentList = []
      this.rowInfo = row
      this.historyDialogVisible = true
      this.filedRule.name = this.rowInfo.name
      this.filedRule.color = this.rowInfo.color
      this.filedRule.model = this.rowInfo.model
      this.filedRule.rule = this.rowInfo.belongId
      this.filedRule.version = this.rowInfo.version
      this.showHistory()
    },
    showHistory() {
      const param = {
        name: this.rowInfo.name
      }
      findHistory(param).then(res => {
        this.historyList = []
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].status === 0) {
            res.data[i].isChecked = true
          } else {
            res.data[i].isChecked = false
          }
          this.historyList.push(res.data[i])
        }
        if (this.historyList.length > 0) {
          this.$refs.histroyTable.setCurrentRow(this.historyList[0])
        }
      })
    },
    addItem() {
      this.newList.push({
        field: '',
        condition: ''
      })
      this.fieldChange()
      const _this = this
      setTimeout(function() {
        _this.$refs.newlists.bodyWrapper.scrollTop = _this.$refs.newlists.bodyWrapper.scrollHeight + 40
      }, 100)
    },
    fieldChange() {
      this.newFieldList = []
      for (const field of this.fieldList) {
        field.disabled = false
        for (const item of this.newList) {
          if (item.field === field.id) {
            field.disabled = true
            break
          }
        }
        this.newFieldList.push(field)
      }
    },
    deleteField(index) {
      this.newList.splice(index, 1)
      this.fieldChange()
    },
    handleCurrentChanges(row) {
      if (row !== null) {
        const param = {
          id: row.id
        }
        this.historyContentList = []
        findDetail(param).then(res => {
          for (const item of res.data) {
            for (const field of this.fieldList) {
              if (field.key === item.field) {
                item.fieldName = field.name
                break
              }
            }
            this.historyContentList.push(item)
          }
        })
      }
    },
    setStatusHistory(row) {
      if (row.isChecked) {
        this.$confirm('确定启用' + row.name + '?', '提示', {
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
            this.showHistory()
            this.fetchData()
          })
        }, () => {
          row.isChecked = false
        })
      } else {
        this.$confirm('确定弃用' + row.name + '?', '提示', {
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
            this.showHistory()
            this.fetchData()
          })
        }, () => {
          row.isChecked = true
        })
      }
    }
  }
}

