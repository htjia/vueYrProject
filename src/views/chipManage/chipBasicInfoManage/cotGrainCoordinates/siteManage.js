
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findModelList, findList, findColorList, save, deletes, disableEnable } from '@/api/chipBasicInfoManage/cotGrainCoordinates'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      list: [],
      newDataList: [{
        centerx: '',
        centery: '',
        leftx: '',
        lefty: '',
        rightx: '',
        righty: '',
        topx: '',
        topy: '',
        downx: '',
        downy: ''
      }, {
        centerx: '',
        centery: '',
        leftx: '',
        lefty: '',
        rightx: '',
        righty: '',
        topx: '',
        topy: '',
        downx: '',
        downy: ''
      }],
      model: '',
      color: '',
      modelList: [],
      colorList: [],
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
      newType: '',
      newModel: '',
      newColor: '',
      typeList: [
        {
          id: 0,
          name: '四抽一'
        },
        {
          id: 1,
          name: '九抽一'
        }
      ],
      currentId: 0
    }
  },
  mounted() {
    this.fetchData()
    this.findModelList()
    this.findColorList()
  },
  methods: {
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 1) {
        if (columnIndex % 2 === 0) {
          return [1, 2]
        } else if (columnIndex % 2 !== 0) {
          return [0, 0]
        }
      }
    },
    tabClick(index) {
      this.activeTabIndex = index
    },
    findColorList() {
      findColorList().then(res => {
        this.colorList = res.data
      })
    },
    findModelList() {
      findModelList().then(res => {
        this.modelList = res.data.list
      })
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
        model: this.model,
        color: this.color
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
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    // 添加
    handleAdd() {
      this.newType = ''
      this.newModel = ''
      this.newColor = ''
      this.newDataList = [{
        centerx: '',
        centery: '',
        leftx: '',
        lefty: '',
        rightx: '',
        righty: '',
        topx: '',
        topy: '',
        downx: '',
        downy: ''
      }, {
        centerx: '',
        centery: '',
        leftx: '',
        lefty: '',
        rightx: '',
        righty: '',
        topx: '',
        topy: '',
        downx: '',
        downy: ''
      }]
      this.addDialogVisible = true
    },
    // 添加
    handleEdit(row) {
      this.currentId = row.id
      this.newType = row.type
      this.newModel = row.model
      this.newColor = row.color
      this.newDataList = [{
        centerx: row.centerX === null ? '' : row.centerX + '',
        centery: row.centerY === null ? '' : row.centerY + '',
        leftx: row.leftX === null ? '' : row.leftX + '',
        lefty: row.leftY === null ? '' : row.leftY + '',
        rightx: row.rightX === null ? '' : row.rightX + '',
        righty: row.rightY === null ? '' : row.rightY + '',
        topx: row.upX === null ? '' : row.upX + '',
        topy: row.upY === null ? '' : row.upY + '',
        downx: row.downX === null ? '' : row.downX + '',
        downy: row.downY === null ? '' : row.downY + ''
      }, {
        centerx: '',
        centery: '',
        leftx: '',
        lefty: '',
        rightx: '',
        righty: '',
        topx: '',
        topy: '',
        downx: '',
        downy: ''
      }]
      this.editDialogVisible = true
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
      if (this.newColor === '') {
        this.$message({
          type: 'error',
          message: '请选择光色!'
        })
        return
      }
      if (this.newType === '') {
        this.$message({
          type: 'error',
          message: '请选择抽测方式!'
        })
        return
      }
      if (this.newDataList[0].centerx === '' && this.newDataList[0].centery === '' && this.newDataList[0].leftx === '' &&
      this.newDataList[0].lefty === '' && this.newDataList[0].rightx === '' && this.newDataList[0].righty === '' &&
       this.newDataList[0].topx === '' && this.newDataList[0].topy === '' && this.newDataList[0].downx === '' && this.newDataList[0].downy === '') {
        this.$message({
          type: 'error',
          message: '请输入标记点不能全部为空!'
        })
        return
      }
      const test = new RegExp('^-?\\d+$')
      if (this.newDataList[0].centerx !== '' && !test.test(this.newDataList[0].centerx)) {
        this.$message({
          type: 'error',
          message: '中心标记点x必须为整数!'
        })
        return
      }
      if (this.newDataList[0].centery !== '' && !test.test(this.newDataList[0].centery)) {
        this.$message({
          type: 'error',
          message: '中心标记点y必须为整数!'
        })
        return
      }
      if (this.newDataList[0].leftx !== '' && !test.test(this.newDataList[0].leftx)) {
        this.$message({
          type: 'error',
          message: '左点标记点x必须为整数!'
        })
        return
      }
      if (this.newDataList[0].lefty !== '' && !test.test(this.newDataList[0].lefty)) {
        this.$message({
          type: 'error',
          message: '左点标记点y必须为整数!'
        })
        return
      }
      if (this.newDataList[0].rightx !== '' && !test.test(this.newDataList[0].rightx)) {
        this.$message({
          type: 'error',
          message: '右点标记点x必须为整数!'
        })
        return
      }
      if (this.newDataList[0].righty !== '' && !test.test(this.newDataList[0].righty)) {
        this.$message({
          type: 'error',
          message: '右点标记点y必须为整数!'
        })
        return
      }
      if (this.newDataList[0].topx !== '' && !test.test(this.newDataList[0].topx)) {
        this.$message({
          type: 'error',
          message: '上点标记点x必须为整数!'
        })
        return
      }
      if (this.newDataList[0].topy !== '' && !test.test(this.newDataList[0].topy)) {
        this.$message({
          type: 'error',
          message: '上点标记点y必须为整数!'
        })
        return
      }
      if (this.newDataList[0].downx !== '' && !test.test(this.newDataList[0].downx)) {
        this.$message({
          type: 'error',
          message: '下点标记点x必须为整数!'
        })
        return
      }
      if (this.newDataList[0].downy !== '' && !test.test(this.newDataList[0].downy)) {
        this.$message({
          type: 'error',
          message: '下点标记点y必须为整数!'
        })
        return
      }
      const params = {
        centerX: this.newDataList[0].centerx,
        centerY: this.newDataList[0].centery,
        color: this.newColor,
        creator: sessionStorage.getItem('User-Id'),
        downX: this.newDataList[0].downx,
        downY: this.newDataList[0].downy,
        leftX: this.newDataList[0].leftx,
        leftY: this.newDataList[0].lefty,
        model: this.newModel,
        rightX: this.newDataList[0].rightx,
        rightY: this.newDataList[0].righty,
        type: this.newType,
        upX: this.newDataList[0].topx,
        upY: this.newDataList[0].topy
      }
      save(params).then(res => {
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
      if (this.newColor === '') {
        this.$message({
          type: 'error',
          message: '请选择光色!'
        })
        return
      }
      if (this.newType === '') {
        this.$message({
          type: 'error',
          message: '请选择抽测方式!'
        })
        return
      }
      if (this.newDataList[0].centerx === '' && this.newDataList[0].centery === '' && this.newDataList[0].leftx === '' &&
      this.newDataList[0].lefty === '' && this.newDataList[0].rightx === '' && this.newDataList[0].righty === '' &&
       this.newDataList[0].topx === '' && this.newDataList[0].topy === '' && this.newDataList[0].downx === '' && this.newDataList[0].downy === '') {
        this.$message({
          type: 'error',
          message: '请输入标记点不能全部为空!'
        })
        return
      }
      const test = new RegExp('^-?\\d+$')
      if (this.newDataList[0].centerx !== '' && !test.test(this.newDataList[0].centerx)) {
        this.$message({
          type: 'error',
          message: '中心标记点x必须为整数!'
        })
        return
      }
      if (this.newDataList[0].centery !== '' && !test.test(this.newDataList[0].centery)) {
        this.$message({
          type: 'error',
          message: '中心标记点y必须为整数!'
        })
        return
      }
      if (this.newDataList[0].leftx !== '' && !test.test(this.newDataList[0].leftx)) {
        this.$message({
          type: 'error',
          message: '左点标记点x必须为整数!'
        })
        return
      }
      if (this.newDataList[0].lefty !== '' && !test.test(this.newDataList[0].lefty)) {
        this.$message({
          type: 'error',
          message: '左点标记点y必须为整数!'
        })
        return
      }
      if (this.newDataList[0].rightx !== '' && !test.test(this.newDataList[0].rightx)) {
        this.$message({
          type: 'error',
          message: '右点标记点x必须为整数!'
        })
        return
      }
      if (this.newDataList[0].righty !== '' && !test.test(this.newDataList[0].righty)) {
        this.$message({
          type: 'error',
          message: '右点标记点y必须为整数!'
        })
        return
      }
      if (this.newDataList[0].topx !== '' && !test.test(this.newDataList[0].topx)) {
        this.$message({
          type: 'error',
          message: '上点标记点x必须为整数!'
        })
        return
      }
      if (this.newDataList[0].topy !== '' && !test.test(this.newDataList[0].topy)) {
        this.$message({
          type: 'error',
          message: '上点标记点y必须为整数!'
        })
        return
      }
      if (this.newDataList[0].downx !== '' && !test.test(this.newDataList[0].downx)) {
        this.$message({
          type: 'error',
          message: '下点标记点x必须为整数!'
        })
        return
      }
      if (this.newDataList[0].downy !== '' && !test.test(this.newDataList[0].downy)) {
        this.$message({
          type: 'error',
          message: '下点标记点y必须为整数!'
        })
        return
      }
      const params = {
        id: this.currentId,
        centerX: this.newDataList[0].centerx,
        centerY: this.newDataList[0].centery,
        color: this.newColor,
        creator: sessionStorage.getItem('User-Id'),
        downX: this.newDataList[0].downx,
        downY: this.newDataList[0].downy,
        leftX: this.newDataList[0].leftx,
        leftY: this.newDataList[0].lefty,
        model: this.newModel,
        rightX: this.newDataList[0].rightx,
        rightY: this.newDataList[0].righty,
        type: this.newType,
        upX: this.newDataList[0].topx,
        upY: this.newDataList[0].topy
      }
      save(params).then(res => {
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
    handleSearch() {
      this.pageNum = 1
      this.fetchData()
    },
    clearAll() {
      this.pageNum = 1
      this.beginDate = ''
      this.endDate = ''
      this.model = ''
      this.color = ''
      this.fetchData()
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

