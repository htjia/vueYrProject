
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findScan, save } from '@/api/chipManage/rearSiteManage/sorting/membraneRetainingCrossingStation'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      list: [],
      waferNo: ''
    }
  },
  methods: {
    clearSearch() {
      this.list = []
      this.waferNo = ''
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const params = {
        waferNo: this.waferNo
      }
      findScan(params).then(res => {
        this.waferNo = ''
        if (res.data.length === 0) {
          this.$message({
            type: 'error',
            message: '该片信息未找到或已过站'
          })
        }
        // this.list = []
        for (const item of res.data) {
          this.list.push({
            wafer: item
          })
        }
        this.listLoading = false
      })
    },
    deleteItem(index) {
      this.list.splice(index, 1)
      if (this.list.length === 0) {
        this.waferNo = ''
      }
    },
    save() {
      // if (this.waferNo === '') {
      //   this.$message({
      //     type: 'error',
      //     message: '请扫描片号！'
      //   })
      //   return
      // }
      if (this.list.length === 0) {
        this.$message({
          type: 'error',
          message: '芯片列表为空！'
        })
        return
      }
      this.$confirm('确定提交当前列表?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let wafers = ''
        for (const item of this.list) {
          if (wafers === '') {
            wafers = item.wafer
          } else {
            wafers = wafers + ',' + item.wafer
          }
        }
        const params = {
          waferNo: wafers,
          creator: sessionStorage.getItem('User-Id')
        }
        save(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '过站成功！'
            })
            this.list = []
            this.waferNo = ''
          }
        })
      }).catch(() => {
      })
    }
  }
}

