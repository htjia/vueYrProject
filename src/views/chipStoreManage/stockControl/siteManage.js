
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
// import { update, findWaferByArk, updateArk } from '@/api/chipManage/extensionStorageManage/cabinetLocationManage'
import { findArkList, insert, update, findWaferByArk, updateArk, findWaferByBox, updateBoxNo, deleteArk } from '@/api/chipStoreManage/stockControl'
import { mapGetters } from 'vuex'
import $ from 'jquery'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  data() {
    const validateCode = (rule, value, callback) => {
      const pattern = new RegExp('[^A-Za-z0-9]')
      if (value.trim() === '') {
        callback(new Error('请输入柜位编号'))
      } else if (pattern.test(value)) {
        callback(new Error('柜位编号必须为数字或字母'))
      } else {
        callback()
      }
    }
    const validateStoredValue = (rule, value, callback) => {
      if (value < 1) {
        callback(new Error('储存值必须大于0'))
      } else {
        callback()
      }
    }
    const validateAlarmValue = (rule, value, callback) => {
      if (value === '') {
        value = 0
      }
      value = parseInt(value)
      console.log(value)
      if (value < 1) {
        callback(new Error('报警值必须大于0'))
      } else {
        if (value > parseInt(this.cabinetForm.storedValue)) {
          callback(new Error('报警值不能大于储存值'))
        } else {
          callback()
        }
      }
    }
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      selectDialogVisible: false,
      mergeDialogVisible: false,
      hourRow: null,
      firstIndexSelect: -1,
      packageNum: '',
      selectedCabinet: '',
      cabinetName: '',
      activeIndex: 0,
      radio: 0,
      selectedList: [],
      selectedBox: [],
      waferList: [],
      mergeList: [],
      searchKeys: {
        gw: '',
        hh: ''
      },
      moveing: false,
      cabinetList: [],
      cabinetForm: {
        code: '',
        storedValue: '',
        alarmValue: ''
      },
      rules: {
        code: [{ required: true, validator: validateCode, trigger: 'blur' }],
        storedValue: [{ required: true, validator: validateStoredValue, trigger: 'blur' }],
        alarmValue: [{ required: true, validator: validateAlarmValue, trigger: 'blur' }]
      },
      waferTotalNum: 24,
      abnormalList: [{}],
      detailList: [{}],
      receiveList: [{}],
      selectedRunRow: {},
      model: '',
      pole: '',
      textareaRow: 0,
      batch: 5,
      totalNum: 120,
      batchNum: '',
      jBatchNum: '',
      sBatchNum: '',
      cBatchNum: '',
      process: '',
      sProcess: '',
      jProcess: '',
      cProcess: '',
      jRemark: '',
      cRemark: '',
      sRemark: '',
      jOperator: '',
      sOperator: '',
      cOperator: '',
      jRemarkLeft: '',
      sRemarkLeft: '',
      cRemarkLeft: '',
      trench: '', // 槽位
      grandTotal: '', // 累计片数
      threshold: '', // 阈值
      temperature: '', // 溶液温度
      etchingTime: '', // 腐蚀时间
      machineNum: '', // 机台编号
      motionRadio: '1',
      list: [],
      siteType: '',
      siteName: '',
      siteStatus: '',
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      beginDate: '',
      endDate: '',
      pickerOptionsStart: {
        disabledDate: (time) => {
          const endDateVal = this.endDate
          if (endDateVal) {
            return time.getTime() > endDateVal
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          const beginDateVal = this.beginDate
          if (beginDateVal) {
            return time.getTime() < beginDateVal || time.getTime() > Date.now()
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      processOptions: [
        {
          id: 0,
          name: '工序1'
        },
        {
          id: 1,
          name: '工序2'
        }
      ],
      poleOptions: [
        {
          id: 0,
          name: '是'
        },
        {
          id: 1,
          name: '否'
        }
      ],
      currentId: '',
      clientY: 0,
      clientX: 0
    }
  },
  mounted() {
    this.fetchData()
    this.$dragging.$on('dragged', (value) => {
    })
  },
  methods: {
    storedValueChange() {
      if (this.cabinetForm.storedValue.length > 10) {
        this.cabinetForm.storedValue = this.cabinetForm.storedValue.substr(0, 10)
      }
    },
    alarmValueChange() {
      if (this.cabinetForm.alarmValue.length > 10) {
        this.cabinetForm.alarmValue = this.cabinetForm.alarmValue.substr(0, 10)
      }
    },
    rowClick(row) {
      this.activeIndex = row.boxNo
      findWaferByBox({ boxNo: row.boxNo, arkId: this.searchKeys.gw }).then(res => {
        this.waferList = res.data
      })
    },
    mergeRowClick(row) {
      this.radio = row.boxNo
      this.selectedRunRow = row
    },
    // 移动
    handleMove() {
      console.log(this.selectedBox)
      if (this.selectedBox.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择需要移动的Wafer!'
        })
      } else {
        this.moveing = true
      }
    },
    selectCabinet(item, event) {
      this.selectedCabinet = item
      this.cabinetName = item.name
      if (!this.moveing) {
        this.searchKeys.gw = item.id
        this.handleSearch()
      } else {
        this.clientY = event.clientY
        this.clientX = event.clientX
        this.selectDialogVisible = true
      }
    },
    submitSelect() {
      const boxNosArr = []
      this.selectedBox.map(item => {
        boxNosArr.push(item.boxNo)
      })
      const requestParams = {
        arkId: this.selectedCabinet.id,
        boxNos: boxNosArr.join(',')
      }
      console.log(requestParams)
      updateArk(requestParams).then(res => {
        this.selectDialogVisible = false
        this.handleSearch()
        setTimeout(() => {
          this.fetchData()
        }, 200)
      })
      // this.increase()
      setTimeout(() => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
      })
      this.moveing = false
    },
    cancelMove() {
      this.selectDialogVisible = false
      this.moveing = false
    },
    // 合并
    handleMerge() {
      if (this.selectedBox === '' || this.selectedBox.length < 2) {
        this.$message({
          type: 'error',
          message: '请选择需要合并的包!'
        })
        return false
      }
      // this.mergeList = this.list.filter(item => { return !item.status })
      this.mergeList = this.selectedBox
      this.radio = this.mergeList[0].boxNo
      this.mergeDialogVisible = true
    },
    // 合并
    submitMerge() {
      const boxNosArr = []
      this.selectedBox.map(item => {
        boxNosArr.push(item.boxNo)
      })
      const requestParams = {
        pack: this.radio,
        boxNos: boxNosArr.join(',')
      }
      updateBoxNo(requestParams).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.mergeDialogVisible = false
        this.handleSearch()
        this.fetchData()
      })
    },
    // 合并取消
    cancelMerge() {
      this.mergeDialogVisible = false
    },
    increase() {
      // 小球动画
      const top = 25// 小球降落起点
      const left = 500
      const endTop = this.clientY - 120 // 小球降落终点
      const endLeft = this.sidebar.opened ? this.clientX - 220 : this.clientX - 60

      // // 小球到达起点
      var outer = $('#points .pointPre').first().removeClass('pointPre').css({
        right: left + 'px',
        top: top + 'px'
      })
      var inner = outer.find('.point-inner')

      setTimeout(function() {
        // 将jquery对象转换为DOM对象
        outer[0].style.webkitTransform = 'translate3d(0,' + (endTop - top) + 'px,0)'
        inner[0].style.webkitTransform = 'translate3d(' + (endLeft - left) + 'px,0,0)'

        // 小球运动完毕恢复到原点
        setTimeout(function() {
          outer.removeAttr('style').addClass('pointPre')
          inner.removeAttr('style')
        }, 1000) // 这里的延迟值和小球的运动时间相关
      }, 100)
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
    handleSearchBox() {
      this.list.map((item) => {
        if (this.packageNum === item.boxNo) {
          item.status = true
        }
      })
    },
    handleSearch() {
      const params = {
        arkId: this.searchKeys.gw,
        boxNo: this.packageNum
      }
      findWaferByArk(params).then(res => {
        res.data.map((item) => {
          item['status'] = false
        })
        this.list = res.data
        if (res.data.length > 0) {
          this.rowClick(res.data[0])
          this.activeIndex = res.data[0].boxNo
        } else {
          this.waferList = []
        }
      })
    },
    clearSearch() {
      this.batchNum = ''
      this.process = ''
      this.beginDate = ''
      this.endDate = ''
      this.model = ''
      this.pole = ''
    },
    // 查询
    fetchData() {
      findArkList().then(res => {
        this.cabinetList = res.data
      })
    },
    // 添加
    handleAdd() {
      this.addDialogVisible = true
    },
    // 关闭
    handleClose() {
      this.cabinetForm.code = ''
      this.cabinetForm.storedValue = ''
      this.cabinetForm.alarmValue = ''
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            alarm: this.cabinetForm.alarmValue, // 警告值
            capacity: this.cabinetForm.storedValue, // 容量
            name: this.cabinetForm.code
          }
          insert(params).then(res => {
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
            this.$refs[formName].resetFields()
            this.addDialogVisible = false
            this.fetchData()
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
    handleEdit(item) {
      this.currentId = item.id
      this.cabinetForm.alarmValue = item.alarm
      this.cabinetForm.storedValue = item.capacity
      this.cabinetForm.code = item.name
      this.editDialogVisible = true
    },
    // 删除
    handleDelete(item) {
      if (item.count > 0) {
        this.$confirm(`柜中已有Wafer存在，无法删除！`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showCancelButton: false,
          type: 'warning'
        }).then(() => {})
      } else {
        const param = {
          id: item.id
        }
        this.$confirm(`是否确认删除?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteArk(param).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.fetchData()
          })
        })
      }
    },
    // 编辑提交
    submitEditForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            id: this.currentId,
            alarm: parseInt(this.cabinetForm.alarmValue), // 警告值
            capacity: this.cabinetForm.storedValue, // 容量
            name: this.cabinetForm.code
          }
          update(params).then(res => {
            this.$message({
              type: 'success',
              message: '编辑成功!'
            })
            this.$refs[formName].resetFields()
            this.editDialogVisible = false
            this.fetchData()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    selectionChange(data) {
      this.selectedBox = data
    },
    hoverCall(row, column, cell, event) {
      console.log(row)
      if (event.buttons !== 1) {
        this.hourRow = row
      } else {
        if (event.which === 1) {
          if (this.hourRow !== null && this.hourRow !== row) {
            for (let i = 0; i < this.list.length; i++) {
              if (this.list[i] === this.hourRow) {
                this.firstIndexSelect = i
                break
              }
            }
            this.$refs.waferTable.toggleRowSelection([{ row: this.hourRow, selected: true }])
            this.hourRow = null
          }
          let x = this.firstIndexSelect
          for (let i = 0; i < this.list.length; i++) {
            if (this.selectedBox[0].id === this.list[i].id && x <= i) {
              x = i
            }
            if (x < i && x !== -1) {
              this.$refs.waferTable.toggleRowSelection([{ row: this.list[i], selected: true }])
            }
            if (row.id === this.list[i].id) {
              break
            }
          }
          this.$refs.waferTable.toggleRowSelection([{ row: row, selected: true }])
          // if (!row.selected) {
          //   this.$refs.waferTable.toggleRowSelection([{ row: row, selected: true }])
          //   row.selected = true
          //   return false
          // } else {
          //   this.$refs.waferTable.toggleRowSelection([{ row: row, selected: false }])
          //   row.selected = false
          // }
        }
      }
    }
  }
}

