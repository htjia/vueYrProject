
import PageHeaderLayout from '@/components/PageHeaderLayout'
import { templateList, deleteById, updateSequence } from '@/api/extensionManage/wyReport/processReport'
import Sortable from 'sortablejs'
export default {
  components: { PageHeaderLayout },
  data() {
    return {
      listLoading: false,
      notBastic: false,
      editCurrentTemplate: false,
      currentTemplate: [],
      templateList: [],
      siteType: '',
      siteName: '',
      siteStatus: '',
      pageSize: 12,
      pageNum: 1,
      totalPage: 0,
      templateName: '',
      isShowMenu: {
        'process-report-handle': false
      }
    }
  },
  mounted() {
    var _this = this
    setTimeout(function() {
      const roleInfo = sessionStorage.getItem('roleInfo')
      if (roleInfo !== undefined && roleInfo !== null) {
        const roleList = JSON.parse(roleInfo)
        for (const item of roleList) {
          if (item.path === 'wyproductionManage') {
            for (const items of item.children) {
              if (items.path === 'wyReport') {
                for (const citems of items.children) {
                  if (citems.path === 'processReport') {
                    citems.children.map(process => {
                      if (process.path === 'templateLibrary') {
                        const menus = process.funIds.split(',')
                        for (const menu of menus) {
                          _this.isShowMenu[menu] = true
                        }
                      }
                    })
                  }
                }
              }
            }
          }
        }
      }
    }, 500)
    this.fetchData()
  },
  methods: {
    handleDeleteItemChart(row, index) {
      this.$confirm(`是否确认删除?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.currentTemplate.details.splice(index, 1)
        const param = {}
        this.currentTemplate.details.map((item, index) => {
          item.serialNum = index
        })
        param.details = this.currentTemplate.details
        param.id = this.currentTemplate.id
        updateSequence(param).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
      })
    },
    handleEdit(item) {
      console.log(item)
      this.currentTemplate = item
      this.editCurrentTemplate = true
      setTimeout(() => {
        this.rowDrop()
      })
    },
    // 行拖拽
    rowDrop() {
      const tbody = document.querySelector('.padding-dialog .el-table__body-wrapper tbody')
      console.log(tbody)
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.currentTemplate.details.splice(oldIndex, 1)[0]
          _this.currentTemplate.details.splice(newIndex, 0, currRow)
          if (newIndex !== oldIndex) {
            _this.updateSequenceFun()
          }
        }
      })
    },
    updateSequenceFun() {
      const param = {}
      this.currentTemplate.details.map((item, index) => {
        item.serialNum = index
      })
      param.details = this.currentTemplate.details
      param.id = this.currentTemplate.id
      console.log(param)
      updateSequence(param).then(res => {
        this.$message({
          type: 'success',
          message: '顺序调整成功!'
        })
      })
    },
    handleDelete(id) {
      this.$confirm('是否确认该模板删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteById({ id }).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.fetchData()
        })
      })
    },
    handleUse(item) {
      this.$router.push({ path: '/wyReport/templateShow', query: { id: item.id, name: item.name }})
    },
    createTemplate() {
      this.$router.push({ path: '/wyReport/templateCreate' })
    },
    handleSearch() {
      this.fetchData()
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const requestParams = {
        name: this.templateName
      }
      templateList(requestParams).then(res => {
        this.templateList = res.data
      })
    }
  }
}

