
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { tagScanning, createTags, saveNewLabel, fragmentPrintList } from '@/api/chipManage/rearSiteManage/inciseTag'
import { printLabel } from '@/api/extensionManage/stockManage/mocvd'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      deleteDialogVisible: false,
      printBatchNoVisable: false,
      activeTabIndex: 0,
      tableKey: 0,
      isCreated: false,
      platterWaferList: [],
      list: [],
      batchNum: '',
      dialogBatchNo: '',
      userOptions: [],
      machineForm: {
        code: '',
        name: '',
        remark: ''
      },
      rules: {
        code: [{ required: true, message: '请输入编号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      }
    }
  },
  directives: {
    focus: {
      inserted(el, { value }) {
        if (value) {
          el.focus()
        }
      }
    }
  },
  mounted() {
    this.inputFocus()
  },
  methods: {
    handlePrintBatchNo() {
      this.printBatchNoVisable = true
    },
    inputFocus() {
      setTimeout(() => {
        this.$refs.importInput.focus()
      }, 200)
    },
    handleSearchBatchNo() {
      const params = {
        batchNo: this.dialogBatchNo
      }
      fragmentPrintList(params).then(res => {
        this.platterWaferList = res.data
      })
    },
    handlePrintAllBatchNo() {
      const selectedWafer = this.$refs.printTable.selection
      if (selectedWafer.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择需要打印的waferID！'
        })
        return false
      }
      const contents = []
      selectedWafer.map(item => {
        contents.push(
          [
            {
              value: item.waferNo,
              key: 'wafer'
            },
            {
              value: item.index,
              key: 'index'
            },
            {
              value: item.batchNo,
              key: 'batchNo'
            }
          ]
        )
      })
      const params = {
        module: 'pcProductTaskwafer',
        contents
      }
      printLabel(params).then(res => {
        this.$message({
          type: 'success',
          message: '标签正在打印中，请稍候！'
        })
      })
    },
    handleReceiveInput() {
      if (this.batchNum.trim() === '') {
        this.$message({
          type: 'error',
          message: '请输入批/片号!'
        })
        return false
      }
      if (this.list.filter(item => { return item.waferNo === this.batchNum }).length > 0) {
        this.$message({
          type: 'error',
          message: '当前Wafer已存在!'
        })
        this.batchNum = ''
        return false
      }
      if (this.list.filter(item => { return item.batchNo === this.batchNum }).length > 0) {
        this.$message({
          type: 'error',
          message: '当前批次已存在!'
        })
        this.batchNum = ''
        return false
      }
      const requestParams = {
        key: this.batchNum
      }
      tagScanning(requestParams).then(res => {
        if (res.data !== null) {
          res.data.map(item => {
            item['sliceNum'] = 4
          })
          this.list = [...this.list, ...res.data]
          console.log(this.list)
          this.batchNum = ''
        }
      }).catch(() => {
        this.batchNum = ''
      })
    },
    sliceNumChange(row) {
      if (parseInt(row.sliceNum) > 20) {
        row.sliceNum = 20
      }
      if (parseInt(row.sliceNum) < 2) {
        row.sliceNum = 2
      }
    },
    handlePrint() {
      const params = []
      const contents = []
      if (this.list[0].newWafers === undefined) {
        this.list.map(item => {
          params.push(
            {
              batchNo: item.batchNo,
              newWaferNo: item.waferNo,
              oldWaferNo: item.waferNo
            }
          )
          contents.push(
            [
              {
                value: item.batchNo,
                key: 'batchId'
              },
              {
                value: item.waferNo,
                key: 'waferId'
              }
            ]
          )
        })
      } else {
        this.list.map(item => {
          item.newWafers.map(newWafer => {
            params.push(
              {
                batchNo: item.batchNo,
                newWaferNo: newWafer,
                oldWaferNo: item.waferNo
              }
            )
            contents.push(
              [
                {
                  value: item.batchNo,
                  key: 'batchId'
                },
                {
                  value: newWafer,
                  key: 'waferId'
                }
              ]
            )
          })
        })
      }
      saveNewLabel(params).then(res => {
        const params = {
          module: 'inciseTag',
          contents
        }
        printLabel(params).then(res => {
          this.$message({
            type: 'success',
            message: '标签正在打印中，请稍候！'
          })
        })
      })
    },
    // 生产新标签
    handleNewLabels() {
      const params = []
      this.list.map(item => {
        params.push({
          waferNo: item.waferNo,
          cutNum: item.sliceNum,
          batchNo: item.batchNo
        })
      })
      createTags({ list: params }).then(res => {
        this.isCreated = true
        const arr = []
        res.data.map(item => {
          arr.push({
            sliceNum: item.newWafers.length,
            waferNo: item.waferNo,
            newWafers: item.newWafers,
            batchNo: item.batchNo
          })
        })
        this.list = arr
        console.log(this.list)
        this.tableKey++
      })
    },
    handleClear() {
      this.list = []
    },
    // 删除按钮
    handleDelete(index) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.list.splice(index, 1)
      })
    }
  }
}

