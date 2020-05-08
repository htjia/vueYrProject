
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findModelList, findColorList, findGYList, findCot, disableEnableCot, deletesCot, saveCot } from '@/api/chipBasicInfoManage/bin'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
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
      pageSize: 12,
      pageNum: 1,
      totalPage: 0,
      model: '',
      color: '',
      gy: '',
      newmodel: '',
      newcolor: '',
      newgy: '',
      remark: '',
      gyList: [],
      modelList: [],
      colorList: [],
      isDisable: '',
      newDisable: false,
      newtype: '',
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
      showCheckList: [],
      currentId: 0
    }
  },
  mounted() {
    this.fetchData()
    this.findModelList()
    this.findColorList()
    this.findGYList()
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
    findGYList() {
      findGYList().then(res => {
        this.gyList = res.data.list
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
        craft: this.gy,
        status: this.isDisable
      }
      findCot(params).then(res => {
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
          disableEnableCot(requestParams).then(res => {
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
          disableEnableCot(requestParams).then(res => {
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
    clearAll() {
      this.pageNum = 1
      this.beginDate = ''
      this.endDate = ''
      this.model = ''
      this.color = ''
      this.gy = ''
      this.isDisable = ''
      this.fetchData()
    },
    // 添加
    handleAdd() {
      this.newmodel = ''
      this.newcolor = ''
      this.newgy = ''
      this.newtype = ''
      this.remark = ''
      this.newDisable = false
      this.findModelList()
      this.findColorList()
      this.findGYList()
      this.addDialogVisible = true
      this.showCheckList = []
      var data2 = {
        param: 'wld1',
        gain: '1',
        offset: '0'
      }
      var data4 = {
        param: 'iv',
        gain: '1',
        offset: '0'
      }
      var data1 = {
        param: 'vf1',
        gain: '1',
        offset: '0'
      }
      var data3 = {
        param: 'wlp1',
        gain: '1',
        offset: '0'
      }
      this.showCheckList.push(data1)
      this.showCheckList.push(data2)
      this.showCheckList.push(data3)
      this.showCheckList.push(data4)
    },
    // 修改
    handleEdit(row) {
      this.currentId = row.id
      this.newmodel = row.model
      this.newcolor = row.color
      this.newgy = row.craft
      this.newtype = row.type
      this.remark = row.remark
      this.newDisable = false
      this.findModelList()
      this.findColorList()
      this.findGYList()
      this.editDialogVisible = true
      this.showCheckList = []
      var data1 = [{ param: 'vf1' }, { param: 'wld1' }, { param: 'wlp1' }, { param: 'iv' }]
      for (const item of data1) {
        for (const items of row.detailList) {
          if (items.param === item.param) {
            var data = {
              param: items.param,
              gain: items.gain,
              offset: items.offset
            }
            this.showCheckList.push(data)
            break
          }
        }
      }
    },
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    // 历史版本
    handleHistory(row) {
      this.historyDialogVisible = true
    },
    // 添加提交
    submitForm() {
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
      if (this.newgy === '') {
        this.$message({
          type: 'error',
          message: '请选择工艺!'
        })
        return
      }
      if (this.newtype === '') {
        this.$message({
          type: 'error',
          message: '请选择方圆!'
        })
        return
      }
      let flag = true
      for (const info of this.showCheckList) {
        const str = info.gain + ''
        if (parseFloat(info.gain) + '' !== str) {
          flag = false
          break
        }
        const str1 = info.offset + ''
        if (parseFloat(info.offset) + '' !== str1) {
          flag = false
          break
        }
      }
      if (!flag) {
        this.setDisable = false
        this.$message({
          type: 'error',
          message: '修正信息输入有误!'
        })
        return
      }
      const params = {
        color: this.newcolor,
        craft: this.newgy,
        creator: sessionStorage.getItem('User-Id'),
        detailList: this.showCheckList,
        model: this.newmodel,
        remark: this.remark,
        type: this.newtype
      }
      saveCot(params).then(res => {
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
      if (this.newgy === '') {
        this.$message({
          type: 'error',
          message: '请选择工艺!'
        })
        return
      }
      if (this.newtype === '') {
        this.$message({
          type: 'error',
          message: '请选择方圆!'
        })
        return
      }
      let flag = true
      for (const info of this.showCheckList) {
        const str = info.gain + ''
        if (parseFloat(info.gain) + '' !== str) {
          flag = false
          break
        }
        const str1 = info.offset + ''
        if (parseFloat(info.offset) + '' !== str1) {
          flag = false
          break
        }
      }
      if (!flag) {
        this.setDisable = false
        this.$message({
          type: 'error',
          message: '修正信息输入有误!'
        })
        return
      }
      const params = {
        id: this.currentId,
        color: this.newcolor,
        craft: this.newgy,
        creator: sessionStorage.getItem('User-Id'),
        detailList: this.showCheckList,
        model: this.newmodel,
        remark: this.remark,
        type: this.newtype
      }
      saveCot(params).then(res => {
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
        deletesCot(params).then(res => {
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

