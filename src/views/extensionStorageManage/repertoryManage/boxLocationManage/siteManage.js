
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { getList, updateBoxNo } from '@/api/chipManage/extensionStorageManage/boxLocationManage'
import Sortable from 'sortablejs'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      leftWaferId: '',
      leftBoxNo: '',
      rightBoxNo: '',
      rightWaferId: '',
      leftArkId: '',
      rightArkId: '',
      selectLeft: [],
      nonemptySelectLeft: [],
      selectRight: [],
      nonemptySelectRight: [],
      leftList: [],
      rightList: []
    }
  },
  mounted() {
    this.rowDrop()
    this.rightRowDrop()
  },
  methods: {
    handleSearch(index) {
      if (this.leftBoxNo === this.rightBoxNo && this.leftBoxNo !== '' && this.rightBoxNo !== '') {
        this.$message({
          type: 'error',
          message: '原始盒号与目标盒号不能相等!'
        })
        return false
      }
      let requestParams = {}
      if (index === 1) {
        requestParams = {
          boxId: this.leftBoxNo,
          waferId: this.leftWaferId
        }
      } else {
        requestParams = {
          boxId: this.rightBoxNo,
          waferId: this.rightWaferId
        }
      }
      getList(requestParams).then(res => {
        if (index === 1) {
          this.leftList = res.data
          this.leftArkId = res.data[0].arkId
        } else {
          this.rightList = res.data
          this.rightArkId = res.data[0].arkId
        }
      })
      console.log(this.leftList)
    },
    // 上移
    handleUp(table, index) {
      if (index > 0) {
        const upDate = table[index - 1]
        table.splice(index - 1, 1)
        table.splice(index, 0, upDate)
      } else {
        this.$message({
          type: 'error',
          message: '已经是第一条，不可上移!'
        })
      }
    },
    // 下移
    handleDown(table, index) {
      if ((index + 1) === table.length) {
        this.$message({
          type: 'error',
          message: '已经是最后一条，不可下移!'
        })
      } else {
        const downDate = table[index + 1]
        table.splice(index + 1, 1)
        table.splice(index, 0, downDate)
      }
    },
    // 行拖拽
    rowDrop() {
      const tbody = document.querySelector('.left .el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.leftList.splice(oldIndex, 1)[0]
          _this.leftList.splice(newIndex, 0, currRow)
        }
      })
    },
    // 行拖拽
    rightRowDrop() {
      const tbody = document.querySelector('.right .el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.rightList.splice(oldIndex, 1)[0]
          _this.rightList.splice(newIndex, 0, currRow)
        }
      })
    },
    // 单击左侧table row信息
    leftRowClick(row) {
      this.$refs.waferLtTable.toggleRowSelection(row)
    },
    // 单击左侧table row信息
    rightRowClick(row) {
      this.$refs.waferRtTable.toggleRowSelection(row)
    },
    handleSubmit() {
      const requestParams = []
      this.leftList.forEach((item, index) => {
        if (item.laserMark !== '') {
          requestParams.push({
            boxNo: this.leftBoxNo,
            id: item.id,
            laserMark: item.laserMark,
            waferId: item.waferId,
            arkId: this.leftArkId,
            sequence: index + 1
          })
        }
      })
      this.rightList.forEach((item, index) => {
        if (item.laserMark !== '') {
          requestParams.push({
            boxNo: this.rightBoxNo,
            id: item.id,
            laserMark: item.laserMark,
            waferId: item.waferId,
            arkId: this.rightArkId,
            sequence: index + 1
          })
        }
      })
      updateBoxNo(requestParams).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
      })
    },
    handleCancel() {
    },
    waferCurrentChange(data) {
      console.log(data)
      this.selectLeft = data
    },
    waferRightCurrentChange(data) {
      console.log(data)
      this.selectRight = data
    },
    toLeft() {
      if (this.selectRight.length === 0) {
        this.$message({
          type: 'error',
          message: '请先选择需要移动的Wafer!'
        })
      } else {
        // 如果左侧没有选中项，则按空分配
        if (this.selectLeft.length === 0) {
          var index = 0
          this.nonemptySelectRight = this.selectRight.filter(item => item.waferId !== '')
          this.leftList.map(item => {
            if (item.waferId === '') {
              item.id = this.nonemptySelectRight[index].id
              this.nonemptySelectRight[index].id = Math.random()
              item.waferId = this.nonemptySelectRight[index].waferId
              this.nonemptySelectRight[index].waferId = ''
              item.laserMark = this.nonemptySelectRight[index].laserMark
              this.nonemptySelectRight[index].laserMark = ''
              index++
            }
          })
        } else {
          // 左侧有选中项
          var i = 0
          // 获取非空的选择项
          this.nonemptySelectRight = this.selectRight.filter(item => item.waferId !== '')
          this.selectLeft.map(item => {
            if (item.waferId === '') {
              item.id = this.nonemptySelectRight[i].id
              this.nonemptySelectRight[i].id = Math.random()
              item.waferId = this.nonemptySelectRight[i].waferId
              this.nonemptySelectRight[i].waferId = ''
              item.laserMark = this.nonemptySelectRight[i].laserMark
              this.nonemptySelectRight[i].laserMark = ''
              i++
            }
          })
        }
      }
    },
    toRight() {
      if (this.selectLeft.length === 0) {
        this.$message({
          type: 'error',
          message: '请先选择需要移动的Wafer!'
        })
      } else {
        // 如果右侧没有选中项，则按空分配
        if (this.selectRight.length === 0) {
          var index = 0
          // 获取非空已选项
          this.nonemptySelectLeft = this.selectLeft.filter(item => item.waferId !== '')
          if (this.nonemptySelectLeft.length !== 0) {
            this.rightList.map(item => {
              if (item.waferId === '') {
                item.id = this.nonemptySelectLeft[index].id
                this.nonemptySelectLeft[index].id = Math.random()
                item.waferId = this.nonemptySelectLeft[index].waferId
                this.nonemptySelectLeft[index].waferId = ''
                item.laserMark = this.nonemptySelectLeft[index].laserMark
                this.nonemptySelectLeft[index].laserMark = ''
                index++
              }
            })
          }
        } else {
          // 右侧有选中项
          var i = 0
          // 获取非空的选择项
          this.nonemptySelectLeft = this.selectLeft.filter(item => item.waferId !== '')
          if (this.nonemptySelectLeft.length !== 0) {
            this.selectRight.map(item => {
              if (item.waferId === '') {
                item.id = this.nonemptySelectLeft[i].id
                this.nonemptySelectLeft[i].id = Math.random()
                item.waferId = this.nonemptySelectLeft[i].waferId
                this.nonemptySelectLeft[i].waferId = ''
                item.laserMark = this.nonemptySelectLeft[i].laserMark
                this.nonemptySelectLeft[i].laserMark = ''
                i++
              }
            })
          }
        }
      }
    },
    subStrateCurrentChange() {
    }
  }
}

