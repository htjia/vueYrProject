
import PageHeaderLayout from '@/components/PageHeaderLayout'
import { findOutgoingPercentList, updateCheckPercent } from '@/api/fqcAndOqc/chipOutStorage'
export default {
  components: { PageHeaderLayout },
  data() {
    return {
      list: []
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    handleEdit(row) {
      row.edit = true
    },
    handleCancel(row) {
      row.edit = false
      this.fetchData()
    },
    handleSubmitItem(row) {
      if (row.name.toString().trim() === '') {
        this.$message({
          type: 'error',
          message: '抽检比例不能为空!'
        })
        return false
      }
      const param = {
        id: row.id,
        name: row.name
      }
      updateCheckPercent(param).then(res => {
        row.edit = false
        this.fetchData()
      })
    },
    // 查询
    fetchData() {
      console.log(12313)
      findOutgoingPercentList().then(res => {
        res.data.map((item) => {
          item.edit = false
        })
        this.list = res.data
      })
    },
    blInput(row) {
      if (parseInt(row.name) > 100) {
        row.name = 100
      }
    }
  }
}

