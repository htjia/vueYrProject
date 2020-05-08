
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { siteList } from '@/api/processManagement/siteManage'
import { proceList } from '@/api/processManagement/proceManage'
import { fetchProgram, fetchCardInfo, saveAfter } from '@/api/processManagement/proceCardManage'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      deleteDialogVisible: false,
      editing: false,
      activeTabIndex: 0,
      endList: [],
      userOptions: [],
      endSiteOptions: [],
      pageSize: 12,
      pageNum: 1,
      totalPage: 0
    }
  },
  mounted() {
    this.fetchData(-1)
    this.getEndSiteList()
  },
  methods: {
    // 所有后段站点
    getEndSiteList() {
      const requestParams = {
        type: 1,
        status: 0,
        pageSize: 1000,
        pageNum: 1
      }
      siteList(requestParams).then(res => {
        this.endSiteOptions = res.data.list
      })
    },
    // 站点改变
    siteChange(row) {
      this.currentSiteId = row.siteId
      this.getProceList(row)
      row.processId = ''
      row.programId = ''
      row.remark = ''
      row.programOptions = []
      row.siteChanged = true
    },
    // 工序改变
    proceChange(row) {
      console.log(123123)
      const hasProcesId = []
      this.endList.map(item => {
        if (item.processId === row.processId) {
          hasProcesId.push(item.processId)
        }
        if (item.oldProcessId === row.processId) {
          hasProcesId.push(item.processId)
        }
      })
      if (hasProcesId.length > 1) {
        row.processId = ''
        row.remark = ''
        row.programId = ''
        this.$message({
          type: 'error',
          message: '工序不能重复!'
        })
      } else {
        row.processChanged = true
        fetchProgram({ processId: row.processId }).then(res => {
          row.programOptions = res.data
        })
        row.proceOptions.map(item => {
          if (item.id === row.processId) {
            row.remark = item.remark
          }
        })
      }
    },
    // 获取对应站点的工序
    getProceList(row) {
      const requestParams = {
        status: 0,
        siteId: this.currentSiteId,
        pageNum: 1,
        pageSize: 10000
      }
      proceList(requestParams).then(res => {
        row.proceOptions = res.data.list
      })
    },
    tabClick(index) {
      if (this.activeTabIndex !== index) {
        this.activeTabIndex = index
        this.pageNum = 1
      }
      if (index === 0) {
        this.fetchData(-1)
      } else {
        this.fetchData(-2)
      }
    },
    handleEdit() {
      this.editing = true
    },
    handleCancelEdit() {
      this.editing = false
      if (this.activeTabIndex === 0) {
        this.fetchData(-1)
      } else {
        this.fetchData(-2)
      }
    },
    handleSubmitEdit() {
      const processList = []
      this.endList.forEach((item, index) => {
        console.log(item.processId)
        if (item.processId !== '') {
          processList.push({
            siteId: item.siteChanged ? item.siteId : item.oldSiteId,
            processId: item.processChanged ? item.processId : item.oldProcessId,
            programId: item.programId,
            remark: item.remark,
            sign: item.sign,
            steps: index,
            type: 1
          })
        }
      })
      const requestParams = {
        id: this.activeTabIndex === 0 ? -1 : -2,
        processList
      }
      saveAfter(requestParams).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        if (this.activeTabIndex === 0) {
          this.fetchData(-1)
        } else {
          this.fetchData(-2)
        }
      })
      this.editing = false
    },
    // 插入
    handleInsert(row, index) {
      const insertData = {
        siteId: '',
        processId: '',
        remark: '',
        sign: 0,
        proceDisabled: true,
        proceOptions: [],
        programOptions: []
      }
      this.endList.splice(index, 0, insertData)
    },
    // 上移
    handleUp(row, index) {
      if (index > 0) {
        const upDate = this.endList[index - 1]
        this.endList.splice(index - 1, 1)
        this.endList.splice(index, 0, upDate)
      } else {
        this.$message({
          type: 'error',
          message: '已经是第一条，不可上移!'
        })
      }
    },
    // 下移
    handleDown(list, index) {
      if ((index + 1) === list.length) {
        this.$message({
          type: 'error',
          message: '已经是最后一条，不可下移!'
        })
      } else {
        const downDate = this.endList[index + 1]
        this.endList.splice(index + 1, 1)
        this.endList.splice(index, 0, downDate)
      }
    },
    handlePush(index) {
      this.endList.push({ siteId: '', processId: '', remark: '', programId: '', sign: 0, proceDisabled: true, proceOptions: [], programOptions: [] })
    },
    // 标识
    handleStar(row, index) {
      row.sign = row.sign === 0 ? 1 : 0
    },
    // 删除
    handleDelete(index) {
      this.$confirm('此操作将永久删除此项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(index)
        this.endList.splice(index, 1)
        console.log(this.endList)
      }).catch(() => {
      })
    },
    // 查询
    fetchData(id) {
      this.listLoading = true
      const requestParams = {
        id
      }
      fetchCardInfo(requestParams).then(res => {
        if (res.data.processList.length !== 0) {
          this.setProce(res.data.processList)
          this.endList = res.data.processList
        } else {
          this.endList = []
        }
        this.listLoading = false
      })
    },
    setProce(data) {
      data.map((item) => {
        this.getEditProceList(item) // 编辑时获取对应站点的工序(保存到当前行)
      })
    },
    // 编辑时获取对应站点的工序(保存到当前行)
    getEditProceList(row) {
      console.log(row)
      const requestParams = {
        siteId: row.oldSiteId,
        pageNum: 1,
        pageSize: 10000,
        status: 0
      }
      proceList(requestParams).then(res => {
        row['proceOptions'] = res.data.list
      })
      fetchProgram({ processId: row.oldProcessId }).then(res => {
        row.programOptions = res.data
      })
    }
  }
}

