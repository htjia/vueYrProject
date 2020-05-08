
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findPrint, findMachineList, printLists } from '@/api/chipManage/rearSiteManage/sorting/lowerBinPrint'
import { printLabel } from '@/api/pcChipCasting/pcChipCasting'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      list: [],
      machineList: [],
      machine: '',
      hideList: []
    }
  },
  mounted() {
    this.findMachineList()
  },
  methods: {
    findMachineList() {
      findMachineList().then(res => {
        this.machineList = res.data.list
      })
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.status === 1) {
        return 'set_red'
      }
    },
    // 查询
    fetchData() {
      if (this.machine === '' || this.machine === null) {
        this.$message({
          type: 'error',
          message: '请选择机台!'
        })
        return
      }
      this.listLoading = true
      const params = {
        machine: this.machine
      }
      findPrint(params).then(res => {
        this.list = res.data
        this.hideList = res.data
        this.listLoading = false
      })
    },
    deltetItem(index) {
      this.list.splice(index, 1)
      this.hideList.splice(index, 1)
    },
    printLabel(list) {
      const params = {
        module: 'lowerBinPrintrepeat',
        contents: list
      }
      printLabel(params).then(res => {
        console.log(123)
      })
    },
    printLabel1(list) {
      const params = {
        module: 'lowerBinPrint',
        contents: list
      }
      printLabel(params).then(res => {
        console.log(123)
      })
    },
    printList() {
      if (this.list.length === 0) {
        this.$message({
          type: 'error',
          message: '打印列表为空!'
        })
        return
      }
      let flag = false
      for (const item of this.list) {
        if (item.status === 1) {
          flag = true
          break
        }
      }
      if (flag) {
        printLists({
          machine: this.machine,
          creator: sessionStorage.getItem('User-Id')
        }).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '提交成功!'
            })
            // this.$message({
            //   type: 'success',
            //   message: '正在准备打印!'
            // })
            // const lists = []
            // const lists1 = []
            // for (const item of this.list) {
            //   const list = []
            //   if (item.status === 1) {
            //     list.push({ key: 'chipNo', value: item.binNo })
            //     list.push({ key: 'barcode', value: item.barcode })
            //     lists.push(list)
            //   } else {
            //     list.push({ key: 'startTime', value: item.startTime })
            //     list.push({ key: 'endTime', value: item.endTime })
            //     list.push({ key: 'qt', value: item.qt })
            //     list.push({ key: 'num', value: item.num })
            //     list.push({ key: 'barcode', value: item.barcode })
            //     list.push({ key: 'chipNo', value: item.binNo })
            //     lists1.push(list)
            //   }
            // }
            // if (lists.length > 0) {
            //   this.printLabel(lists)
            // }
            // if (lists1.length > 0) {
            //   this.printLabel1(lists1)
            // }
            // this.list = []
            this.hideList = []
          }
        }, () => {
          this.fetchData()
        })
        // this.$confirm('文档重复的Chip_No将不会打印，是否确认？', '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //   printLists({
        //     machine: this.machine,
        //     creator: sessionStorage.getItem('User-Id')
        //   }).then(res => {
        //     if (res.code === 0) {
        //       this.$message({
        //         type: 'success',
        //         message: '提交成功!'
        //       })
        //       this.list = []
        //       this.hideList = []
        //     }
        //   })
        // })
      } else {
        printLists({
          machine: this.machine,
          creator: sessionStorage.getItem('User-Id')
        }).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '提交成功!'
            })
            this.list = []
            this.hideList = []
          }
        })
      }
    }
  }
}

