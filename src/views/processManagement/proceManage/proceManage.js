
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { siteList } from '@/api/processManagement/siteManage'
import { queryProgram, proceList, add, update, remove } from '@/api/processManagement/proceManage'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      notBastic: false,
      list: [],
      siteList: [],
      programOptions: [],
      proceType: '',
      siteId: '',
      proceName: '',
      proceStatus: '',
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      proceOptions: [
        {
          id: '',
          name: '请选择'
        },
        {
          id: '0',
          name: '前段工序'
        },
        {
          id: '1',
          name: '后段工序'
        }
      ],
      proceStatusOptions: [
        {
          id: '0',
          name: '启用'
        },
        {
          id: '1',
          name: '停用'
        }
      ],
      userOptions: [],
      allSiteList: [],
      proceForm: {
        proceType: '',
        proceSite: '',
        proceName: '',
        proceStatus: '',
        remark: '',
        program: []
      },
      rules: {
        proceType: [{ required: true, message: '请选择工序类型', trigger: 'blur' }],
        proceSite: [{ required: true, message: '请选择所属站点', trigger: 'blur' }],
        program: [{ required: true, message: '请选择程序名称', trigger: 'blur' }],
        proceName: [{ required: true, message: '请输入工序名称', trigger: 'blur' }],
        proceStatus: [{ required: true, message: '请选择工序状态', trigger: 'blur' }]
      },
      currentId: '',
      siteDisable: true
    }
  },
  mounted() {
    this.fetchData()
    this.queryProgramFun()
    this.fetchAllSiteData()
  },
  methods: {
    // 程序查询
    queryProgramFun() {
      const requestParams = {
        pageNum: 1,
        pageSize: 10000
      }
      queryProgram(requestParams).then(res => {
        this.programOptions = res.data.list
      })
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
    // 查询
    fetchData() {
      this.listLoading = true
      const requestParams = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        siteId: this.siteId,
        name: this.proceName,
        type: this.proceType
      }
      console.log(requestParams)
      proceList(requestParams).then(res => {
        res.data.list.map((item) => {
          item.status = item.status === '0'
        })
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    proceTypeChange() {
      this.fetchSiteData()
      this.proceForm.proceSite = ''
    },
    fetchAllSiteData() {
      const requestParams = {
        pageSize: 1000,
        pageNum: 1
      }
      siteList(requestParams).then(res => {
        this.allSiteList = res.data.list
        this.allSiteList.unshift({
          id: '',
          name: '请选择'
        })
      })
    },
    fetchSiteData() {
      const requestParams = {
        status: 0,
        type: this.proceForm.proceType,
        pageSize: 1000,
        pageNum: 1
      }
      siteList(requestParams).then(res => {
        this.siteList = res.data.list
        this.siteDisable = false
      })
    },
    // 添加
    handleAdd() {
      this.proceForm.proceType = ''
      this.proceForm.proceName = ''
      this.proceForm.proceStatus = ''
      this.proceForm.program = []
      this.proceForm.remark = ''
      this.proceForm.proceSite = ''
      this.addDialogVisible = true
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
      this.siteDisable = true
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            type: this.proceForm.proceType,
            name: this.proceForm.proceName,
            siteId: this.proceForm.proceSite,
            status: this.proceForm.proceStatus,
            // programId: this.proceForm.program.join(','),
            remark: this.proceForm.remark,
            isBasic: '1'
          }
          console.log(params)
          add(params).then(res => {
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
    // 取消
    resetForm(formName) {
      this.addDialogVisible = false
      this.editDialogVisible = false
      this.$refs[formName].resetFields()
    },
    // 编辑
    handleEdit(row) {
      console.log(row)
      this.notBastic = row.isBasic === '1'
      this.currentId = row.id
      this.proceForm.proceType = row.type
      this.proceForm.proceName = row.name
      this.proceForm.proceStatus = row.status
      // if (row.programId) {
      //   this.proceForm.program = row.programId.split(',').map(Number)
      // }
      this.proceForm.proceSite = row.siteId
      this.proceForm.remark = row.remark
      this.fetchSiteData()
      this.editDialogVisible = true
    },
    // 启用禁用
    switchChange(row) {
      let alertMsg = ''
      if (!row.status) {
        alertMsg = `是否确认弃用${row.name}工序`
      } else {
        alertMsg = `是否确认启用${row.name}工序`
      }
      this.$confirm(alertMsg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          id: row.id,
          status: row.status ? 0 : 1
        }
        update(param).then(res => {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.fetchData()
        })
      }).catch(() => {
        row.status = !row.status
      })
    },
    // 编辑提交
    submitEditForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params
          if (!this.notBastic) {
            params = {
              id: this.currentId,
              name: this.proceForm.proceName,
              programId: this.proceForm.program.join(','),
              remark: this.proceForm.remark,
              isBasic: '0'
            }
          } else {
            params = {
              id: this.currentId,
              type: this.proceForm.proceType,
              name: this.proceForm.proceName,
              siteId: this.proceForm.proceSite,
              status: this.proceForm.proceStatus,
              remark: this.proceForm.remark,
              programId: this.proceForm.program.join(','),
              isBasic: '1'
            }
          }
          console.log(params)
          update(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '编辑成功!'
              })
              this.editDialogVisible = false
              this.$refs[formName].resetFields()
              this.fetchData()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 删除
    handleDelete(row) {
      this.$confirm('此操作将永久删除该工序, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          id: row.id
        }
        remove(param).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            if (this.list.length === 1 && this.pageNum !== 1) {
              this.pageNum -= 1
            }
            this.fetchData()
          }
        })
      })
    }
  }
}

