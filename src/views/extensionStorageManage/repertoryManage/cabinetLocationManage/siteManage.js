
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findList, insert, update, findWaferByArk, updateArk, deleteArk } from '@/api/chipManage/extensionStorageManage/cabinetLocationManage'
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
      searchKeys: {
        gw: '',
        hh: ''
      },
      moveing: false,
      cabinetList: [
        { name: 'A1' },
        { name: 'A2' },
        { name: 'A3' },
        { name: 'A4' },
        { name: 'A5' },
        { name: 'A6' },
        { name: 'A7' },
        { name: 'A8' }
      ],
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
      selectedRow: [],
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
    console.log(this.sidebar.opened)
    this.$dragging.$on('dragged', (value) => {
      console.log(value)
      console.log(this.cabinetList)
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
      this.$refs.boxTable.toggleRowSelection(row)
    },
    selectionChange(data) {
      console.log(data)
      this.selectedRow = data
    },
    handleMove() {
      console.log(this.selectedRow)
      if (this.selectedRow.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择需要移动的Wafer!'
        })
      } else {
        this.moveing = true
      }
    },
    selectCabinet(item, event) {
      if (!this.moveing) {
        console.log(item)
        this.searchKeys.gw = item.id
        this.handleSearch()
      } else {
        this.clientY = event.clientY
        this.clientX = event.clientX
        let alertMsg = ''
        if (this.selectedRow.length === 1) {
          alertMsg = `是否确认移动${this.selectedRow[0].boxNo}至`
        }
        if (this.selectedRow.length === 2) {
          alertMsg = `是否确认移动${this.selectedRow[0].boxNo}、${this.selectedRow[1].boxNo}至`
        }
        if (this.selectedRow.length > 2) {
          alertMsg = `是否确认移动${this.selectedRow[0].boxNo}、${this.selectedRow[1].boxNo}等${this.selectedRow.length}盒至`
        }
        this.$confirm(alertMsg + item.name + '柜?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = ''
          this.selectedRow.map(item => {
            ids += ',' + item.ids
          })
          const requestParams = {
            arkId: item.id,
            ids
          }
          console.log(requestParams)
          updateArk(requestParams).then(res => {
            this.handleSearch()
            this.fetchData()
          })
          this.increase()
          setTimeout(() => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
          }, 1000)
          this.moveing = false
        }).catch(() => {
          this.moveing = false
        })
      }
    },
    increase() {
      // 小球动画
      const top = 25// 小球降落起点
      const left = 65
      const endTop = this.clientY - 120 // 小球降落终点
      const endLeft = this.sidebar.opened ? this.clientX - 220 : this.clientX - 60

      // // 小球到达起点
      var outer = $('#points .pointPre').first().removeClass('pointPre').css({
        left: left + 'px',
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
    handleSearch() {
      const params = {
        arkId: this.searchKeys.gw,
        boxId: this.searchKeys.hh
      }
      findWaferByArk(params).then(res => {
        this.list = res.data
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
      findList({}).then(res => {
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
    }
  }
}

