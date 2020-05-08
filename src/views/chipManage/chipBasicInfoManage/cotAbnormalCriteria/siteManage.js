
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findModelList, findColorList, findList, save, deletes, disableEnable } from '@/api/chipBasicInfoManage/cotAbnormalCriteria'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      list: [],
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
      setInfo: {
        model: '',
        color: '',
        x1: '',
        y1: '',
        x2: '',
        y2: '',
        x3: '',
        y3: '',
        x4: '',
        y4: '',
        x5: '',
        y5: '',
        axisx: '',
        axisy: '',
        vf1h: '',
        vf1l: '',
        irh: '',
        irl: ''
      },
      currentId: 0
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
    clearAll() {
      this.pageNum = 1
      this.beginDate = ''
      this.endDate = ''
      this.model = ''
      this.color = ''
      this.isDisable = ''
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
    handleSearch() {
      this.pageNum = 1
      this.fetchData()
    },
    // 时间戳转yyyy-mm-dd
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
          let pointstr = ''
          for (const item of res.data.list[i].pointList) {
            if (pointstr === '') {
              pointstr = '(' + item.axisx + ',' + item.axisy + ')'
            } else {
              pointstr = pointstr + '、(' + item.axisx + ',' + item.axisy + ')'
            }
          }
          res.data.list[i].pointstr = pointstr
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
    // 添加
    handleAdd() {
      this.setInfo = {
        model: '',
        color: '',
        x1: '',
        y1: '',
        x2: '',
        y2: '',
        x3: '',
        y3: '',
        x4: '',
        y4: '',
        x5: '',
        y5: '',
        axisx: '',
        axisy: '',
        vf1h: '',
        vf1l: '',
        irh: '',
        irl: ''
      }
      this.addDialogVisible = true
    },
    // 添加
    handleEdit(row) {
      this.currentId = row.id
      this.setInfo = {
        model: row.model,
        color: row.color,
        x1: row.pointList[0].axisx,
        y1: row.pointList[0].axisy,
        x2: row.pointList[1].axisx,
        y2: row.pointList[1].axisy,
        x3: row.pointList[2].axisx,
        y3: row.pointList[2].axisy,
        x4: row.pointList[3].axisx,
        y4: row.pointList[3].axisy,
        x5: row.pointList[4].axisx,
        y5: row.pointList[4].axisy,
        axisx: row.axisx,
        axisy: row.axisy,
        vf1h: row.vf1h,
        vf1l: row.vf1l,
        irh: row.irh,
        irl: row.irl
      }
      this.editDialogVisible = true
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    // 添加提交
    submitForm() {
      if (this.setInfo.model === '') {
        this.$message({
          type: 'error',
          message: '请选择型号!'
        })
        return
      }
      if (this.setInfo.color === '') {
        this.$message({
          type: 'error',
          message: '请选择光色!'
        })
        return
      }
      if (this.setInfo.x1 === '') {
        this.$message({
          type: 'error',
          message: '请输入判断点1的X!'
        })
        return
      }
      const test = new RegExp('^-?\\d+$')
      if (!test.test(this.setInfo.x1)) {
        this.$message({
          type: 'error',
          message: '判断点1必须为整数!'
        })
        return
      }
      if (this.setInfo.y1 === '') {
        this.$message({
          type: 'error',
          message: '请输入判断点1的Y!'
        })
        return
      }
      if (!test.test(this.setInfo.y1)) {
        this.$message({
          type: 'error',
          message: '判断点1必须为整数!'
        })
        return
      }
      if (this.setInfo.x2 === '') {
        this.$message({
          type: 'error',
          message: '请输入判断点2的X!'
        })
        return
      }
      if (!test.test(this.setInfo.x2)) {
        this.$message({
          type: 'error',
          message: '判断点2必须为整数!'
        })
        return
      }
      if (this.setInfo.y2 === '') {
        this.$message({
          type: 'error',
          message: '请输入判断点2的Y!'
        })
        return
      }
      if (!test.test(this.setInfo.y2)) {
        this.$message({
          type: 'error',
          message: '判断点2必须为整数!'
        })
        return
      }
      if (this.setInfo.x3 === '') {
        this.$message({
          type: 'error',
          message: '请输入判断点3的X!'
        })
        return
      }
      if (!test.test(this.setInfo.x3)) {
        this.$message({
          type: 'error',
          message: '判断点3必须为整数!'
        })
        return
      }
      if (this.setInfo.y3 === '') {
        this.$message({
          type: 'error',
          message: '请输入判断点3的Y!'
        })
        return
      }
      if (!test.test(this.setInfo.y3)) {
        this.$message({
          type: 'error',
          message: '判断点3必须为整数!'
        })
        return
      }
      if (this.setInfo.x4 === '') {
        this.$message({
          type: 'error',
          message: '请输入判断点4的X!'
        })
        return
      }
      if (!test.test(this.setInfo.x4)) {
        this.$message({
          type: 'error',
          message: '判断点4必须为整数!'
        })
        return
      }
      if (this.setInfo.y4 === '') {
        this.$message({
          type: 'error',
          message: '请输入判断点4的Y!'
        })
        return
      }
      if (!test.test(this.setInfo.y4)) {
        this.$message({
          type: 'error',
          message: '判断点4必须为整数!'
        })
        return
      }
      if (this.setInfo.x5 === '') {
        this.$message({
          type: 'error',
          message: '请输入判断点5的X!'
        })
        return
      }
      if (!test.test(this.setInfo.x5)) {
        this.$message({
          type: 'error',
          message: '判断点5必须为整数!'
        })
        return
      }
      if (this.setInfo.y5 === '') {
        this.$message({
          type: 'error',
          message: '请输入判断点5的Y!'
        })
        return
      }
      if (!test.test(this.setInfo.y5)) {
        this.$message({
          type: 'error',
          message: '判断点5必须为整数!'
        })
        return
      }
      if (this.setInfo.axisx === '') {
        this.$message({
          type: 'error',
          message: '请输入外圈范围X!'
        })
        return
      }
      if (!test.test(this.setInfo.axisx)) {
        this.$message({
          type: 'error',
          message: '外圈范围必须为整数!'
        })
        return
      }
      if (this.setInfo.axisy === '') {
        this.$message({
          type: 'error',
          message: '请输入外圈范围Y!'
        })
        return
      }
      if (!test.test(this.setInfo.axisy)) {
        this.$message({
          type: 'error',
          message: '外圈范围必须为整数!'
        })
        return
      }
      if (this.setInfo.vf1l === '') {
        this.$message({
          type: 'error',
          message: '请输入VF1阈值最小值!'
        })
        return
      }
      const flags = parseFloat(this.setInfo.vf1l) + '' === this.setInfo.vf1l + ''
      if (!flags) {
        this.$message({
          type: 'error',
          message: 'VF1阈值必须为数字!'
        })
        return
      }
      if (this.setInfo.vf1h === '') {
        this.$message({
          type: 'error',
          message: '请输入VF1阈值最大值!'
        })
        return
      }
      const flags1 = parseFloat(this.setInfo.vf1h) + '' === this.setInfo.vf1h + ''
      if (!flags1) {
        this.$message({
          type: 'error',
          message: 'VF1阈值必须为数字!'
        })
        return
      }
      if (parseFloat(this.setInfo.vf1l) >= parseFloat(this.setInfo.vf1h)) {
        this.$message({
          type: 'error',
          message: 'VF1阈值最大值必须大于最小值!'
        })
        return
      }
      if (this.setInfo.irl === '') {
        this.$message({
          type: 'error',
          message: '请输入IR阈值最小值!'
        })
        return
      }
      const flag = parseFloat(this.setInfo.irl) + '' === this.setInfo.irl + ''
      if (!flag) {
        this.$message({
          type: 'error',
          message: 'VF1阈值必须为数字!'
        })
        return
      }
      if (this.setInfo.irh === '') {
        this.$message({
          type: 'error',
          message: '请输入IR阈值最大值!'
        })
        return
      }
      const flag1 = parseFloat(this.setInfo.irh) + '' === this.setInfo.irh + ''
      if (!flag1) {
        this.$message({
          type: 'error',
          message: 'VF1阈值必须为数字!'
        })
        return
      }
      if (parseFloat(this.setInfo.irl) >= parseFloat(this.setInfo.irh)) {
        this.$message({
          type: 'error',
          message: 'IR阈值最大值必须大于最小值!'
        })
        return
      }
      const params = {
        axisx: this.setInfo.axisx,
        axisy: this.setInfo.axisy,
        color: this.setInfo.color,
        creator: sessionStorage.getItem('User-Id'),
        irh: this.setInfo.irh,
        irl: this.setInfo.irl,
        model: this.setInfo.model,
        pointList: [
          {
            axisx: this.setInfo.x1,
            axisy: this.setInfo.y1,
            location: 1
          },
          {
            axisx: this.setInfo.x2,
            axisy: this.setInfo.y2,
            location: 2
          },
          {
            axisx: this.setInfo.x3,
            axisy: this.setInfo.y3,
            location: 3
          },
          {
            axisx: this.setInfo.x4,
            axisy: this.setInfo.y4,
            location: 4
          },
          {
            axisx: this.setInfo.x5,
            axisy: this.setInfo.y5,
            location: 5
          }
        ],
        vf1h: this.setInfo.vf1h,
        vf1l: this.setInfo.vf1l
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
      if (this.setInfo.model === '') {
        this.$message({
          type: 'error',
          message: '请选择型号!'
        })
        return
      }
      if (this.setInfo.color === '') {
        this.$message({
          type: 'error',
          message: '请选择光色!'
        })
        return
      }
      if (this.setInfo.x1 === '') {
        this.$message({
          type: 'error',
          message: '请输入判断点1的X!'
        })
        return
      }
      const test = new RegExp('^-?\\d+$')
      if (!test.test(this.setInfo.x1)) {
        this.$message({
          type: 'error',
          message: '判断点1必须为整数!'
        })
        return
      }
      if (this.setInfo.y1 === '') {
        this.$message({
          type: 'error',
          message: '请输入判断点1的Y!'
        })
        return
      }
      if (!test.test(this.setInfo.y1)) {
        this.$message({
          type: 'error',
          message: '判断点1必须为整数!'
        })
        return
      }
      if (this.setInfo.x2 === '') {
        this.$message({
          type: 'error',
          message: '请输入判断点2的X!'
        })
        return
      }
      if (!test.test(this.setInfo.x2)) {
        this.$message({
          type: 'error',
          message: '判断点2必须为整数!'
        })
        return
      }
      if (this.setInfo.y2 === '') {
        this.$message({
          type: 'error',
          message: '请输入判断点2的Y!'
        })
        return
      }
      if (!test.test(this.setInfo.y2)) {
        this.$message({
          type: 'error',
          message: '判断点2必须为整数!'
        })
        return
      }
      if (this.setInfo.x3 === '') {
        this.$message({
          type: 'error',
          message: '请输入判断点3的X!'
        })
        return
      }
      if (!test.test(this.setInfo.x3)) {
        this.$message({
          type: 'error',
          message: '判断点3必须为整数!'
        })
        return
      }
      if (this.setInfo.y3 === '') {
        this.$message({
          type: 'error',
          message: '请输入判断点3的Y!'
        })
        return
      }
      if (!test.test(this.setInfo.y3)) {
        this.$message({
          type: 'error',
          message: '判断点3必须为整数!'
        })
        return
      }
      if (this.setInfo.x4 === '') {
        this.$message({
          type: 'error',
          message: '请输入判断点4的X!'
        })
        return
      }
      if (!test.test(this.setInfo.x4)) {
        this.$message({
          type: 'error',
          message: '判断点4必须为整数!'
        })
        return
      }
      if (this.setInfo.y4 === '') {
        this.$message({
          type: 'error',
          message: '请输入判断点4的Y!'
        })
        return
      }
      if (!test.test(this.setInfo.y4)) {
        this.$message({
          type: 'error',
          message: '判断点4必须为整数!'
        })
        return
      }
      if (this.setInfo.x5 === '') {
        this.$message({
          type: 'error',
          message: '请输入判断点5的X!'
        })
        return
      }
      if (!test.test(this.setInfo.x5)) {
        this.$message({
          type: 'error',
          message: '判断点5必须为整数!'
        })
        return
      }
      if (this.setInfo.y5 === '') {
        this.$message({
          type: 'error',
          message: '请输入判断点5的Y!'
        })
        return
      }
      if (!test.test(this.setInfo.y5)) {
        this.$message({
          type: 'error',
          message: '判断点5必须为整数!'
        })
        return
      }
      if (this.setInfo.axisx === '') {
        this.$message({
          type: 'error',
          message: '请输入外圈范围X!'
        })
        return
      }
      if (!test.test(this.setInfo.axisx)) {
        this.$message({
          type: 'error',
          message: '外圈范围必须为整数!'
        })
        return
      }
      if (this.setInfo.axisy === '') {
        this.$message({
          type: 'error',
          message: '请输入外圈范围Y!'
        })
        return
      }
      if (!test.test(this.setInfo.axisy)) {
        this.$message({
          type: 'error',
          message: '外圈范围必须为整数!'
        })
        return
      }
      if (this.setInfo.vf1l === '') {
        this.$message({
          type: 'error',
          message: '请输入VF1阈值最小值!'
        })
        return
      }
      const flags = parseFloat(this.setInfo.vf1l) + '' === this.setInfo.vf1l + ''
      if (!flags) {
        this.$message({
          type: 'error',
          message: 'VF1阈值必须为数字!'
        })
        return
      }
      if (this.setInfo.vf1h === '') {
        this.$message({
          type: 'error',
          message: '请输入VF1阈值最大值!'
        })
        return
      }
      const flags1 = parseFloat(this.setInfo.vf1h) + '' === this.setInfo.vf1h + ''
      if (!flags1) {
        this.$message({
          type: 'error',
          message: 'VF1阈值必须为数字!'
        })
        return
      }
      if (parseFloat(this.setInfo.vf1l) >= parseFloat(this.setInfo.vf1h)) {
        this.$message({
          type: 'error',
          message: 'VF1阈值最大值必须大于最小值!'
        })
        return
      }
      if (this.setInfo.irl === '') {
        this.$message({
          type: 'error',
          message: '请输入IR阈值最小值!'
        })
        return
      }
      const flag = parseFloat(this.setInfo.irl) + '' === this.setInfo.irl + ''
      if (!flag) {
        this.$message({
          type: 'error',
          message: 'VF1阈值必须为数字!'
        })
        return
      }
      if (this.setInfo.irh === '') {
        this.$message({
          type: 'error',
          message: '请输入IR阈值最大值!'
        })
        return
      }
      const flag1 = parseFloat(this.setInfo.irh) + '' === this.setInfo.irh + ''
      if (!flag1) {
        this.$message({
          type: 'error',
          message: 'VF1阈值必须为数字!'
        })
        return
      }
      if (parseFloat(this.setInfo.irl) >= parseFloat(this.setInfo.irh)) {
        this.$message({
          type: 'error',
          message: 'IR阈值最大值必须大于最小值!'
        })
        return
      }
      const params = {
        id: this.currentId,
        axisx: this.setInfo.axisx,
        axisy: this.setInfo.axisy,
        color: this.setInfo.color,
        creator: sessionStorage.getItem('User-Id'),
        irh: this.setInfo.irh,
        irl: this.setInfo.irl,
        model: this.setInfo.model,
        pointList: [
          {
            axisx: this.setInfo.x1,
            axisy: this.setInfo.y1,
            location: 1
          },
          {
            axisx: this.setInfo.x2,
            axisy: this.setInfo.y2,
            location: 2
          },
          {
            axisx: this.setInfo.x3,
            axisy: this.setInfo.y3,
            location: 3
          },
          {
            axisx: this.setInfo.x4,
            axisy: this.setInfo.y4,
            location: 4
          },
          {
            axisx: this.setInfo.x5,
            axisy: this.setInfo.y5,
            location: 5
          }
        ],
        vf1h: this.setInfo.vf1h,
        vf1l: this.setInfo.vf1l
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

