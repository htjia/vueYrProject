
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { getList, addList, updateSequence, deleteList } from '@/api/ipqc/basic/classManage'
import Sortable from 'sortablejs'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      isDisable: '',
      content: '',
      rowInfo: null,
      programForm: {
        name: '',
        sthours: '',
        stminutes: '',
        endhours: '',
        endminutes: '',
        duration: '',
        remark: ''
      },
      rules: {
        name: [{ required: true, message: '内容不可为空', trigger: 'blur' }],
        sthours: [{ required: true, message: '内容不可为空', trigger: 'blur' }],
        stminutes: [{ required: true, message: '内容不可为空', trigger: 'blur' }],
        endhours: [{ required: true, message: '内容不可为空', trigger: 'blur' }],
        endminutes: [{ required: true, message: '内容不可为空', trigger: 'blur' }],
        duration: [{ required: true, message: '内容不可为空', trigger: 'blur' }]
      },
      hours: [],
      minutes: [],
      list: [],
      timeList: []
    }
  },
  mounted() {
    this.fetchData()
    this.hours = []
    this.minutes = []
    for (let i = 0; i < 60; i++) {
      if (i < 10) {
        this.hours.push({
          name: '0' + i
        })
        this.minutes.push({
          name: '0' + i
        })
      } else if (i > 9 && i < 24) {
        this.hours.push({
          name: '' + i
        })
        this.minutes.push({
          name: '' + i
        })
      } else {
        this.minutes.push({
          name: '' + i
        })
      }
    }
    const _this = this
    setTimeout(function() {
      _this.rowDrop()
    }, 1000)
  },
  methods: {
    // 查询
    fetchData() {
      this.listLoading = true
      getList().then(res => {
        this.list = []
        this.timeList = []
        const data = new Date()
        const year = data.getFullYear()
        const month = data.getMonth() + 1
        const day = data.getDate()
        const day1 = data.getDate() + 1
        for (let i = 0; i < res.data.length; i++) {
          const st1 = res.data[i].startTime.split(':')
          const st2 = res.data[i].endTime.split(':')
          const startTime = new Date(year + '/' + month + '/' + day + ' ' + res.data[i].startTime + ':00').getTime()
          let endTime = ''
          if (parseInt(st1[0]) > parseInt(st2[0])) {
            endTime = new Date(year + '/' + month + '/' + day1 + ' ' + res.data[i].endTime + ':00').getTime()
          } else if (parseInt(st1[0]) === parseInt(st2[0]) && parseInt(st1[1]) >= parseInt(st2[1])) {
            endTime = new Date(year + '/' + month + '/' + day1 + ' ' + res.data[i].endTime + ':00').getTime()
          } else {
            endTime = new Date(year + '/' + month + '/' + day + ' ' + res.data[i].endTime + ':00').getTime()
          }
          res.data[i].index = i + 1
          this.list.push(res.data[i])
          this.timeList.push({
            id: res.data[i].id,
            name: res.data[i].name,
            startTime: startTime,
            endTime: endTime,
            startTimes: res.data[i].startTime,
            endTimes: res.data[i].endTime,
            duration: res.data[i].duration
          })
        }
        this.listLoading = false
      })
    },
    // 上移
    handleUp(index) {
      if (index > 0) {
        const upDate = this.list[index - 1]
        this.list.splice(index - 1, 1)
        this.list.splice(index, 0, upDate)
        this.updateSequence()
      } else {
        this.$message({
          type: 'error',
          message: '已经是第一条，不可上移!'
        })
      }
    },
    // 下移
    handleDown(index) {
      if ((index + 1) === this.list.length) {
        this.$message({
          type: 'error',
          message: '已经是最后一条，不可下移!'
        })
      } else {
        const downDate = this.list[index + 1]
        this.list.splice(index + 1, 1)
        this.list.splice(index, 0, downDate)
        this.updateSequence()
      }
    },
    // 行拖拽
    rowDrop() {
      const tbody = document.querySelector('.left .el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.list.splice(oldIndex, 1)[0]
          _this.list.splice(newIndex, 0, currRow)
          _this.updateSequence()
        }
      })
    },
    updateSequence() {
      const params = []
      for (let i = 0; i < this.list.length; i++) {
        const num = i + 1
        params.push(this.list[i].id + '-' + num)
      }
      updateSequence(params).then(res => {
        this.$message({
          type: 'success',
          message: '调整成功'
        })
      })
    },
    handleEdit(row) {
      this.rowInfo = row
      this.programForm = {
        name: row.name,
        sthours: row.startTime.split(':')[0],
        stminutes: row.startTime.split(':')[1],
        endhours: row.endTime.split(':')[0],
        endminutes: row.endTime.split(':')[1],
        duration: row.duration,
        remark: row.remark
      }
      this.editDialogVisible = true
    },
    // 添加
    handleAdd() {
      this.programForm = {
        name: '',
        sthours: '',
        stminutes: '',
        endhours: '',
        endminutes: '',
        duration: '',
        remark: ''
      }
      this.addDialogVisible = true
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    // 取消
    resetForm(formName) {
      this.addDialogVisible = false
      this.editDialogVisible = false
      this.$refs[formName].resetFields()
    },
    changeTime() {
      if (this.programForm.sthours !== '' && this.programForm.stminutes !== '' && this.programForm.endminutes !== '' && this.programForm.endminutes !== '') {
        // 起始时间和结束时间是否包含
        const data = new Date()
        const year = data.getFullYear()
        const month = data.getMonth() + 1
        const day = data.getDate()
        const day1 = data.getDate() + 1
        const firstday = new Date(year, month, 1)
        let nexDays = 0
        if (month === 12) {
          nexDays = new Date(year + 1, 1, 1)
        } else {
          nexDays = new Date(year, month + 1, 1)
        }
        const nextday = (new Date(firstday.getTime() - 1000 * 60 * 60 * 24)).getDate()
        const startTime = new Date(year + '/' + month + '/' + day + ' ' + this.programForm.sthours + ':' + this.programForm.stminutes + ':00').getTime()
        let endTime = ''
        if (parseInt(this.programForm.sthours) > parseInt(this.programForm.endhours)) {
          if (day !== nextday) {
            endTime = new Date(year + '/' + month + '/' + day1 + ' ' + this.programForm.endhours + ':' + this.programForm.endminutes + ':00').getTime()
          } else {
            endTime = new Date(nexDays.getFullYear() + '/' + nexDays.getMonth() + '/' + 1 + ' ' + this.programForm.endhours + ':' + this.programForm.endminutes + ':00').getTime()
          }
        } else if (parseInt(this.programForm.sthours) === parseInt(this.programForm.endhours) && parseInt(this.programForm.stminutes) >= parseInt(this.programForm.endminutes)) {
          if (day !== nextday) {
            endTime = new Date(year + '/' + month + '/' + day1 + ' ' + this.programForm.endhours + ':' + this.programForm.endminutes + ':00').getTime()
          } else {
            endTime = new Date(nexDays.getFullYear() + '/' + nexDays.getMonth() + '/' + 1 + ' ' + this.programForm.endhours + ':' + this.programForm.endminutes + ':00').getTime()
          }
        } else {
          endTime = new Date(year + '/' + month + '/' + day + ' ' + this.programForm.endhours + ':' + this.programForm.endminutes + ':00').getTime()
        }
        const ms = endTime - startTime
        this.programForm.duration = Math.round(ms / 10 / 60 / 60) / 100
      }
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 起始时间和结束时间是否包含
          const data = new Date()
          const year = data.getFullYear()
          const month = data.getMonth() + 1
          const day = data.getDate()
          const day1 = data.getDate() + 1
          const startTime = new Date(year + '/' + month + '/' + day + ' ' + this.programForm.sthours + ':' + this.programForm.stminutes + ':00').getTime()
          const firstday = new Date(year, month, 1)
          let nexDays = 0
          if (month === 12) {
            nexDays = new Date(year + 1, 1, 1)
          } else {
            nexDays = new Date(year, month + 1, 1)
          }
          const nextday = (new Date(firstday.getTime() - 1000 * 60 * 60 * 24)).getDate()
          let endTime = ''
          let startEndTime = ''
          if (parseInt(this.programForm.sthours) > parseInt(this.programForm.endhours)) {
            if (day !== nextday) {
              startEndTime = year + '/' + month + '/' + day1
              endTime = new Date(year + '/' + month + '/' + day1 + ' ' + this.programForm.endhours + ':' + this.programForm.endminutes + ':00').getTime()
            } else {
              startEndTime = nexDays.getFullYear() + '/' + nexDays.getMonth() + '/' + 1
              endTime = new Date(nexDays.getFullYear() + '/' + nexDays.getMonth() + '/' + 1 + ' ' + this.programForm.endhours + ':' + this.programForm.endminutes + ':00').getTime()
            }
          } else if (parseInt(this.programForm.sthours) === parseInt(this.programForm.endhours) && parseInt(this.programForm.stminutes) >= parseInt(this.programForm.endminutes)) {
            if (day !== nextday) {
              startEndTime = year + '/' + month + '/' + day1
              endTime = new Date(year + '/' + month + '/' + day1 + ' ' + this.programForm.endhours + ':' + this.programForm.endminutes + ':00').getTime()
            } else {
              startEndTime = nexDays.getFullYear() + '/' + nexDays.getMonth() + '/' + 1
              endTime = new Date(nexDays.getFullYear() + '/' + nexDays.getMonth() + '/' + 1 + ' ' + this.programForm.endhours + ':' + this.programForm.endminutes + ':00').getTime()
            }
          } else {
            endTime = new Date(year + '/' + month + '/' + day + ' ' + this.programForm.endhours + ':' + this.programForm.endminutes + ':00').getTime()
          }
          let duration = this.programForm.duration
          let flag = false
          let name = ''
          for (const item of this.timeList) {
            if (item.name !== this.programForm.name) {
              duration = duration + item.duration
              if (duration > 24) {
                flag = true
                name = item.name
                break
              }
              if (item.startTime <= startTime && item.endTime > startTime) {
                flag = true
                name = item.name
                break
              } else if (item.startTime < endTime && item.endTime >= endTime) {
                flag = true
                name = item.name
                break
              } else if (startTime < item.startTime && endTime > item.startTime) {
                flag = true
                name = item.name
                break
              } else if (startTime < item.endTime && endTime > item.endTime) {
                flag = true
                name = item.name
                break
              }
              if (startEndTime !== '') {
                const stTime = new Date(startEndTime + ' ' + item.startTimes + ':00').getTime()
                if (endTime > stTime) {
                  flag = true
                  name = item.name
                  break
                }
              }
            }
          }
          if (flag) {
            this.$message({
              type: 'error',
              message: '当前班别时间与' + name + '班别时间重复，请重新选择!'
            })
            return
          }
          let sequence = 1
          if (this.list.length !== 0) {
            sequence = this.list[this.list.length - 1].sequence + 1
          }
          const params = {
            duration: this.programForm.duration,
            endTime: this.programForm.endhours + ':' + this.programForm.endminutes,
            name: this.programForm.name,
            remark: this.programForm.remark,
            sequence: sequence,
            startTime: this.programForm.sthours + ':' + this.programForm.stminutes
          }
          addList(params).then(res => {
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
    // 编辑提交
    submitEditForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 起始时间和结束时间是否包含
          const data = new Date()
          const year = data.getFullYear()
          const month = data.getMonth() + 1
          const day = data.getDate()
          const day1 = data.getDate() + 1
          const startTime = new Date(year + '/' + month + '/' + day + ' ' + this.programForm.sthours + ':' + this.programForm.stminutes + ':00').getTime()
          const firstday = new Date(year, month, 1)
          let nexDays = 0
          if (month === 12) {
            nexDays = new Date(year + 1, 1, 1)
          } else {
            nexDays = new Date(year, month + 1, 1)
          }
          const nextday = (new Date(firstday.getTime() - 1000 * 60 * 60 * 24)).getDate()
          let endTime = ''
          let startEndTime = ''
          if (parseInt(this.programForm.sthours) > parseInt(this.programForm.endhours)) {
            if (day !== nextday) {
              startEndTime = year + '/' + month + '/' + day1
              endTime = new Date(year + '/' + month + '/' + day1 + ' ' + this.programForm.endhours + ':' + this.programForm.endminutes + ':00').getTime()
            } else {
              startEndTime = nexDays.getFullYear() + '/' + nexDays.getMonth() + '/' + 1
              endTime = new Date(nexDays.getFullYear() + '/' + nexDays.getMonth() + '/' + 1 + ' ' + this.programForm.endhours + ':' + this.programForm.endminutes + ':00').getTime()
            }
          } else if (parseInt(this.programForm.sthours) === parseInt(this.programForm.endhours) && parseInt(this.programForm.stminutes) >= parseInt(this.programForm.endminutes)) {
            if (day !== nextday) {
              startEndTime = year + '/' + month + '/' + day1
              endTime = new Date(year + '/' + month + '/' + day1 + ' ' + this.programForm.endhours + ':' + this.programForm.endminutes + ':00').getTime()
            } else {
              startEndTime = nexDays.getFullYear() + '/' + nexDays.getMonth() + '/' + 1
              endTime = new Date(nexDays.getFullYear() + '/' + nexDays.getMonth() + '/' + 1 + ' ' + this.programForm.endhours + ':' + this.programForm.endminutes + ':00').getTime()
            }
          } else {
            endTime = new Date(year + '/' + month + '/' + day + ' ' + this.programForm.endhours + ':' + this.programForm.endminutes + ':00').getTime()
          }
          let duration = this.programForm.duration
          let flag = false
          let name = ''
          for (const item of this.timeList) {
            if (item.name !== this.programForm.name) {
              duration = duration + item.duration
              if (duration > 24) {
                flag = true
                name = item.name
                break
              }
              if (item.startTime <= startTime && item.endTime > startTime) {
                flag = true
                name = item.name
                break
              } else if (item.startTime < endTime && item.endTime >= endTime) {
                flag = true
                name = item.name
                break
              } else if (startTime < item.startTime && endTime > item.startTime) {
                flag = true
                name = item.name
                break
              } else if (startTime < item.endTime && endTime > item.endTime) {
                flag = true
                name = item.name
                break
              }
              if (startEndTime !== '') {
                const stTime = new Date(startEndTime + ' ' + item.startTimes + ':00').getTime()
                if (endTime > stTime) {
                  flag = true
                  name = item.name
                  break
                }
              }
            }
          }
          if (flag) {
            this.$message({
              type: 'error',
              message: '当前班别时间与' + name + '班别时间重复，请重新选择!'
            })
            return
          }
          const params = {
            id: this.rowInfo.id,
            duration: this.programForm.duration,
            endTime: this.programForm.endhours + ':' + this.programForm.endminutes,
            name: this.programForm.name,
            remark: this.programForm.remark,
            sequence: this.rowInfo.sequence,
            startTime: this.programForm.sthours + ':' + this.programForm.stminutes
          }
          addList(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.$refs[formName].resetFields()
              this.editDialogVisible = false
              this.fetchData()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleDelete(row) {
      this.$confirm('删除后该项数据将清空，是否确认？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: row.id
        }
        deleteList(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.editDialogVisible = false
            this.fetchData()
          }
        })
      }).catch(() => {
      })
    }
  }
}

