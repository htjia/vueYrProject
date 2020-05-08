
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findDecide, updateDecide } from '@/api/extensionManage/wyBasicInfoManage/substrateBasicInfo/decideTo'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      list: [{}, {}, {}]
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    // 查询
    fetchData() {
      this.listLoading = true
      const requestParams = {
      }
      findDecide(requestParams).then(res => {
        res.data.list.map((item) => {
          item.status = item.status === 0
        })
        this.list = res.data.list
      })
    },
    // 启用禁用
    switchChange(row) {
      console.log(row)
      const param = {
        id: row.id,
        status: row.status ? 0 : 1
      }
      updateDecide(param).then(res => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        this.fetchData()
      })
    }
  }
}

