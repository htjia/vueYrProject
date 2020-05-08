
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findStopperList, add, remove, findDetail } from '@/api/extensionManage/wyBasicInfoManage/AlNiBasicInfo/AlNiCase'
import { platterMocvdList } from '@/api/extensionManage/stockManage/alNi'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const validateCode = (rule, value, callback) => {
      if (value.trim() === '') {
        callback(new Error('请输入卡塞名称'))
      } else {
        callback()
      }
    }
    return {
      listLoading: false,
      platterCircleVisble: false,
      addDialogVisible: false,
      editDialogVisible: false,
      caseChecked: true,
      layer: '',
      list: [],
      caseList: [],
      platterList: [],
      platterCircleList: [],
      caseName: '',
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      searchName: '',
      caseForm: {
        caseName: '',
        layer: ''
      },
      rules: {
        caseName: [{ required: true, validator: validateCode, trigger: 'blur' }],
        layer: [{ required: true, message: '请输入卡塞层数', trigger: 'blur' }]
      },
      currentId: ''
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    // 查看table circle 详情
    viewCircleDetail(row) {
      this.platterCircleVisble = true
      this.platterCircleList = row.circleList
    },
    setDisabledFalse() {
      this.platterList.map((item) => { item['disabled'] = false })
    },
    // 大盘改变
    platterChange(row) {
      console.log(row)
      this.setDisabledFalse()
      var num = 0
      // 判断未填的大盘
      this.caseList.map((caseItem) => {
        if (caseItem.platterId !== null) {
          num++
        }
      })
      // 当前大盘清空了
      if (row.platterId === null) {
        row.slice = ''
        row.measureName = ''
        row.circleList = []
      }
      var measureId = ''
      this.platterList.map((item) => {
        // 填写联动信息
        if (item.id === row.platterId) {
          row.measureName = item.measureName
          row.slice = item.slice
          row.circleList = item.circleList
          measureId = item.measureId
        }
        // 设置选中项禁用
        this.caseList.map((caseItem) => {
          if (item.id === caseItem.platterId) {
            item['disabled'] = true
          }
        })
      })
      this.platterList.map(item => {
        // 设置不同寸数的卡塞禁用(measureId // 寸数)
        if (num !== 0) {
          if (item.measureId !== measureId) {
            item['disabled'] = true
          }
        } else {
          item['disabled'] = false
        }
      })
    },
    // 大盘查询
    findPlatterList() {
      platterMocvdList({ pageNum: 1, pageSize: 10000 }).then(res => {
        res.data.list.map((item) => {
          item['disabled'] = false
        })
        this.platterList = res.data.list
      })
    },
    // 层数改变
    caseNumChange(val) {
      // const num = this.caseList.length - val
      // if (num > 0) { // 层数变小了
      //   this.caseList.splice(this.caseList.length - num, num)
      // }
      // if (num < 0) { // 层数变大了
      //   for (var i = 0; i < -num; i++) {
      //     this.caseList.push({
      //       platterId: null,
      //       measureName: '',
      //       slice: '',
      //       status: true
      //     })
      //   }
      // }
      // if (this.caseList.length === 0 && val > 0) {
      //   for (var j = 0; j < val; j++) {
      //     this.caseList.push({
      //       platterId: null,
      //       measureName: '',
      //       slice: '',
      //       status: true
      //     })
      //   }
      // }
      this.caseList = []
      for (var j = 0; j < val; j++) {
        this.caseList.push({
          platterId: null,
          measureName: '',
          slice: '',
          status: true
        })
      }
      this.platterList.map((item) => {
        item['disabled'] = false
      })
    },
    // 新增卡塞
    handleAdd() {
      this.findPlatterList()
      this.caseForm.caseName = ''
      this.caseForm.layer = ''
      this.caseChecked = true
      this.caseList = []
      this.addDialogVisible = true
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
    // 查询
    fetchData() {
      this.listLoading = true
      const params = {
        name: this.searchName,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      findStopperList(params).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var detailList = []
          var flag = false
          for (var i = 0; i < this.caseList.length; i++) {
            if (this.caseList[i].platterId === null) {
              flag = true
            }
            detailList.push({
              layerNo: i + 1,
              platterId: this.caseList[i].platterId,
              status: this.caseList[i].status ? 0 : 1
            })
          }
          if (flag) {
            this.$message({
              type: 'error',
              message: '大盘信息不能为空!'
            })
            return false
          }
          if (this.caseForm.caseName.trim() === '') {
            this.$message({
              type: 'error',
              message: '卡塞名称不能为空!'
            })
            return false
          }
          const params = {
            detailList,
            layer: this.caseForm.layer,
            name: this.caseForm.caseName,
            status: this.caseChecked ? 0 : 1
          }
          console.log(params)
          add(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
              this.$refs[formName].resetFields()
              this.addDialogVisible = false
              this.fetchData()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 取消
    resetForm(formName) {
      this.addDialogVisible = false
      this.editDialogVisible = false
      this.$refs[formName].resetFields()
    },
    // 编辑
    handleEdit(row) {
      this.findPlatterList()
      this.currentId = row.id
      this.caseForm.layer = row.layer
      this.caseForm.caseName = row.name
      this.caseForm.caseChecked = row.status === 0
      findDetail({ id: row.id }).then(res => {
        if (res.code === 0) {
          res.data.map((item) => {
            item.status = item.status === 0
          })
          this.caseList = res.data
          var measureId = ''
          setTimeout(() => {
            this.platterList.map((item) => {
              // 填写联动信息
              if (item.id === this.caseList[0].platterId) {
                measureId = item.measureId
              }
            })
            this.platterList.map(item => {
              if (item.id === row.platterId) {
                measureId = item.measureId
              }
              this.caseList.map((caseItem) => {
                if (item.id === caseItem.platterId) {
                  item['disabled'] = true
                }
                if (item.measureId !== measureId) {
                  item['disabled'] = true
                }
              })
            })
          }, 500)
        }
      })
      this.editDialogVisible = true
    },
    // 编辑提交
    submitEditForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var detailList = []
          var flag = false
          for (var i = 0; i < this.caseList.length; i++) {
            if (this.caseList[i].platterId === null) {
              flag = true
            }
            detailList.push({
              layerNo: this.caseList[i].layerNo,
              platterId: this.caseList[i].platterId,
              status: this.caseList[i].status ? 0 : 1
            })
          }
          if (flag) {
            this.$message({
              type: 'error',
              message: '大盘信息不能为空!'
            })
            return false
          }
          const params = {
            id: this.currentId,
            detailList,
            layer: this.caseForm.layer,
            name: this.caseForm.caseName,
            status: this.caseChecked ? 0 : 1
          }
          add(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '编辑成功!'
              })
              this.editDialogVisible = false
              this.$refs[formName].resetFields()
              this.fetchData()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // dialog中删除
    handleDelete(row) {
      this.$confirm('此操作将永久删除该层, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(row)
        var num = 0
        // 判断未填的大盘
        this.caseList.map((caseItem) => {
          if (caseItem.platterId !== null) {
            num++
          }
        })
        this.platterList.map((item) => {
          // 设置选中项启用
          if (item.id === row.platterId) {
            item['disabled'] = false
          }
          // 设置不同寸数的卡塞禁用
          if (num === 1) {
            this.setDisabledFalse()
          }
        })
        var deleteIndex = ''
        this.caseList.forEach((item, index) => {
          console.log(item)
          if (item.platterId === row.platterId) {
            deleteIndex = index
          }
        })
        this.caseList.splice(deleteIndex, 1)
        this.caseForm.layer = this.caseList.length
      })
    },
    handleDeleteRow(row) {
      this.$confirm('此操作将永久删除该卡塞, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: row.id
        }
        remove(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            if (this.list.length === 1 && this.pageNum !== 1) {
              this.pageNum -= 1
            }
            this.fetchData()
          }
        })
      })
    }
  }
}

