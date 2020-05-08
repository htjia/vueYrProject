
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { scFactoryList, scElectrodeList, scCategoryList, scCuttingCraftList, scChipCraftList, queryColorModel, scRuleBelongList,
  scFactoryAdd, scElectrodeAdd, scCategoryAdd, scCuttingCraftAdd, scChipCraftAdd, addColorModel, scRuleBelongAdd,
  scFactoryDelete, scElectrodeDelete, scCategoryDelete, scCuttingCraftDelete, scChipCraftDelete, deleteColorModel, scRuleBelongDelete,
  scFactoryDisableEnable, scElectrodeDisableEnable, scCategoryDisableEnable, scCuttingCraftDisableEnable, scChipCraftDisableEnable, updateColorModel, scRuleBelongDisableEnable } from '@/api/pcChipCasting/pcBasicManage'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const validateName = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('名称不能为空'))
      } else {
        callback()
      }
    }
    const validateCode = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('编号不能为空'))
      } else {
        callback()
      }
    }
    const validateModel = (rule, value, callback) => {
      const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
      const chinese = new RegExp('[\u4e00-\u9fa5]')
      const az = new RegExp('[a-z]')
      // const num = new RegExp('[0-9]')
      value = value + ''
      if (value.trim().length === 0) {
        callback(new Error('编号不能为空'))
      } else {
        if (chinese.test(value)) {
          callback(new Error('编号必须为大写字母'))
        } else if (az.test(value)) {
          callback(new Error('编号必须为大写字母'))
        } else if (pattern.test(value)) {
          callback(new Error('编号不能包含特殊字符'))
        } else {
          callback()
        }
      }
    }
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      activeTabIndex: 0,
      list: [],
      userOptions: [],
      siteForm: {
        code: '',
        name: '',
        remark: '',
        codeMode: ''
      },
      pageSize: 12,
      pageNum: 1,
      totalPage: 0,
      rowId: 0,
      rules: {
        code: [{ required: true, validator: validateCode, trigger: 'blur' }],
        name: [{ required: true, validator: validateName, rigger: 'blur' }],
        codeMode: [{ required: true, validator: validateModel, trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  computed: {
    dialogTitle: function() {
      let title = ''
      switch (this.activeTabIndex) {
        case 0 : title = '目检判断原因'
          break
        case 1 : title = '目检级别'
          break
      }
      return title
    }
  },
  methods: {
    tabClick(index) {
      if (this.activeTabIndex !== index) {
        this.activeTabIndex = index
        this.pageNum = 1
        this.fetchData()
      }
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const requestParams = {
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }
      if (this.activeTabIndex === 0) {
        scFactoryList(requestParams).then(res => {
          this.list = []
          for (let i = 0; i < res.data.list.length; i++) {
            if (res.data.list[i].status === 0) {
              res.data.list[i].isChecked = true
            } else {
              res.data.list[i].isChecked = false
            }
            this.list.push(res.data.list[i])
          }
          this.totalPage = parseInt(res.data.total)
          this.listLoading = false
        })
      } else if (this.activeTabIndex === 1) {
        scElectrodeList(requestParams).then(res => {
          this.list = []
          for (let i = 0; i < res.data.list.length; i++) {
            if (res.data.list[i].status === 0) {
              res.data.list[i].isChecked = true
            } else {
              res.data.list[i].isChecked = false
            }
            this.list.push(res.data.list[i])
          }
          this.totalPage = parseInt(res.data.total)
          this.listLoading = false
        })
      } else if (this.activeTabIndex === 2) {
        scCategoryList(requestParams).then(res => {
          this.list = []
          for (let i = 0; i < res.data.list.length; i++) {
            if (res.data.list[i].status === 0) {
              res.data.list[i].isChecked = true
            } else {
              res.data.list[i].isChecked = false
            }
            this.list.push(res.data.list[i])
          }
          this.totalPage = parseInt(res.data.total)
          this.listLoading = false
        })
      } else if (this.activeTabIndex === 3) {
        scCuttingCraftList(requestParams).then(res => {
          this.list = []
          for (let i = 0; i < res.data.list.length; i++) {
            if (res.data.list[i].status === 0) {
              res.data.list[i].isChecked = true
            } else {
              res.data.list[i].isChecked = false
            }
            this.list.push(res.data.list[i])
          }
          this.totalPage = parseInt(res.data.total)
          this.listLoading = false
        })
      } else if (this.activeTabIndex === 4) {
        scChipCraftList(requestParams).then(res => {
          this.list = []
          for (let i = 0; i < res.data.list.length; i++) {
            if (res.data.list[i].status === 0) {
              res.data.list[i].isChecked = true
            } else {
              res.data.list[i].isChecked = false
            }
            this.list.push(res.data.list[i])
          }
          this.totalPage = parseInt(res.data.total)
          this.listLoading = false
        })
      } else if (this.activeTabIndex === 5) {
        queryColorModel(requestParams).then(res => {
          this.list = []
          for (let i = 0; i < res.data.list.length; i++) {
            if (res.data.list[i].status === 0) {
              res.data.list[i].isChecked = true
            } else {
              res.data.list[i].isChecked = false
            }
            this.list.push(res.data.list[i])
          }
          this.totalPage = parseInt(res.data.total)
          this.listLoading = false
        })
      } else if (this.activeTabIndex === 6) {
        scRuleBelongList(requestParams).then(res => {
          this.list = []
          for (let i = 0; i < res.data.list.length; i++) {
            if (res.data.list[i].status === 0) {
              res.data.list[i].isChecked = true
            } else {
              res.data.list[i].isChecked = false
            }
            this.list.push(res.data.list[i])
          }
          this.totalPage = parseInt(res.data.total)
          this.listLoading = false
        })
      }
    },
    setStatus(row) {
      if (row.isChecked) {
        this.$confirm('确定启用' + row.name + '?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          row.status = 0
          const requestParams = {
            id: row.id,
            status: row.status
          }
          if (this.activeTabIndex === 0) {
            scFactoryDisableEnable(requestParams).then(res => {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.fetchData()
            })
          } else if (this.activeTabIndex === 1) {
            scElectrodeDisableEnable(requestParams).then(res => {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.fetchData()
            })
          } else if (this.activeTabIndex === 2) {
            scCategoryDisableEnable(requestParams).then(res => {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.fetchData()
            })
          } else if (this.activeTabIndex === 3) {
            scCuttingCraftDisableEnable(requestParams).then(res => {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.fetchData()
            })
          } else if (this.activeTabIndex === 4) {
            scChipCraftDisableEnable(requestParams).then(res => {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.fetchData()
            })
          } else if (this.activeTabIndex === 5) {
            updateColorModel(requestParams).then(res => {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.fetchData()
            })
          } else if (this.activeTabIndex === 6) {
            scRuleBelongDisableEnable(requestParams).then(res => {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.fetchData()
            })
          }
        }, () => {
          row.isChecked = false
        })
      } else {
        this.$confirm('确定弃用' + row.name + '?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          row.status = 1
          const requestParams = {
            id: row.id,
            status: row.status
          }
          if (this.activeTabIndex === 0) {
            scFactoryDisableEnable(requestParams).then(res => {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.fetchData()
            })
          } else if (this.activeTabIndex === 1) {
            scElectrodeDisableEnable(requestParams).then(res => {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.fetchData()
            })
          } else if (this.activeTabIndex === 2) {
            scCategoryDisableEnable(requestParams).then(res => {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.fetchData()
            })
          } else if (this.activeTabIndex === 3) {
            scCuttingCraftDisableEnable(requestParams).then(res => {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.fetchData()
            })
          } else if (this.activeTabIndex === 4) {
            scChipCraftDisableEnable(requestParams).then(res => {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.fetchData()
            })
          } else if (this.activeTabIndex === 5) {
            updateColorModel(requestParams).then(res => {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.fetchData()
            })
          } else if (this.activeTabIndex === 6) {
            scRuleBelongDisableEnable(requestParams).then(res => {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.fetchData()
            })
          }
        }, () => {
          row.isChecked = true
        })
      }
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
    // 添加
    handleAdd() {
      this.siteForm.code = ''
      this.siteForm.name = ''
      this.siteForm.remark = ''
      this.addDialogVisible = true
    },
    // 编辑
    handleEdit(row) {
      this.rowId = row.id
      this.siteForm.code = row.code
      this.siteForm.name = row.name
      this.siteForm.remark = row.remark
      this.editDialogVisible = true
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            code: this.siteForm.code,
            name: this.siteForm.name,
            remark: this.siteForm.remark
          }
          if (this.activeTabIndex === 0) {
            scFactoryAdd(params).then(res => {
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
          } else if (this.activeTabIndex === 1) {
            scElectrodeAdd(params).then(res => {
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
          } else if (this.activeTabIndex === 2) {
            scCategoryAdd(params).then(res => {
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
          } else if (this.activeTabIndex === 3) {
            scCuttingCraftAdd(params).then(res => {
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
          } else if (this.activeTabIndex === 4) {
            scChipCraftAdd(params).then(res => {
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
          } else if (this.activeTabIndex === 5) {
            params.code = this.siteForm.codeMode
            addColorModel(params).then(res => {
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
          } else if (this.activeTabIndex === 6) {
            scRuleBelongAdd(params).then(res => {
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
          }
        } else {
          console.log('error submit!!')
          return false
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
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.activeTabIndex === 0) {
          scFactoryDelete({ id: row.id }).then(res => {
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
        } else if (this.activeTabIndex === 1) {
          scElectrodeDelete({ id: row.id }).then(res => {
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
        } else if (this.activeTabIndex === 2) {
          scCategoryDelete({ id: row.id }).then(res => {
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
        } else if (this.activeTabIndex === 3) {
          scCuttingCraftDelete({ id: row.id }).then(res => {
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
        } else if (this.activeTabIndex === 4) {
          scChipCraftDelete({ id: row.id }).then(res => {
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
        } else if (this.activeTabIndex === 5) {
          deleteColorModel({ id: row.id }).then(res => {
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
        } else if (this.activeTabIndex === 6) {
          scRuleBelongDelete({ id: row.id }).then(res => {
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
        }
      }).catch(() => {
      })
    }
  }
}

