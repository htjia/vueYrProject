import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { getList, getListContent, getListCondition, getListAstrict, findTree, getListPreview, remove, selectAdd, selectUpdate,
  contentUpdate, contentAdd, astrictUpdate, astrictAdd, conditionUpdate, conditionAdd, dataPreview } from '@/api/queryDesigner'
import Chart from '@/components/Charts'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd, Chart },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      name: '',
      pageSize: 15,
      pageNum: 1,
      pageSize1: 15,
      pageNum1: 1,
      pageSize2: 15,
      pageNum2: 1,
      pageSize3: 15,
      pageNum3: 1,
      pageSize4: 15,
      pageNum4: 1,
      list: [],
      filterText: '',
      activeIndex: 'first',
      activeName: 'first1',
      totalPage: 0,
      totalPage1: 0,
      totalPage2: 0,
      totalPage3: 0,
      totalPage4: 0,
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      previewDialogVisible: false,
      list1: [],
      list2: [],
      list3: [],
      list4: [],
      tree: [],
      sqlContent: '',
      findForm: {
        code: '',
        completeSql: '',
        creatTime: '',
        creatorId: 0,
        id: 0,
        name: '',
        remarks: '',
        alias: ''
      },
      selectId: 0,
      rules: {
        name: [
          { required: true, message: '请输入查询名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入编号', trigger: 'blur' }
        ]
      },
      functionList: [{ key: 'sum' }, { key: 'max' }, { key: 'min' }, { key: 'avg' }, { key: 'count' }],
      conditionList: [{ key: '=' }, { key: '<>' }, { key: '<' }, { key: '<=' }, { key: '>' }, { key: '>=' }, { key: 'like' }, { key: 'not like' }, { key: 'is null' }, { key: 'is not null' }, { key: 'is between' }],
      astrictList: [{ key: 'group by' }, { key: 'order by' }],
      astrictValList: [{ key: 'asc' }, { key: 'desc' }],
      dataList: []
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  created() {
    this.fetchData()
  },
  computed: {
  },
  mounted() {
  },
  methods: {
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
    // 每页数量改变
    sizeChange1(pageSize) {
      this.pageSize1 = pageSize
      this.selectList('查询内容')
    },
    // 当前页数改变
    currentChange1(pageNum) {
      this.pageNum1 = pageNum
      this.selectList('查询内容')
    },
    // 每页数量改变
    sizeChange2(pageSize) {
      this.pageSize2 = pageSize
      this.selectList('查询条件')
    },
    // 当前页数改变
    currentChange2(pageNum) {
      this.pageNum2 = pageNum
      this.selectList('查询条件')
    },
    // 每页数量改变
    sizeChange3(pageSize) {
      this.pageSize3 = pageSize
      this.selectList('查询限制')
    },
    // 当前页数改变
    currentChange3(pageNum) {
      this.pageNum3 = pageNum
      this.selectList('查询限制')
    },
    // 每页数量改变
    sizeChange4(pageSize) {
      this.pageSize4 = pageSize
      this.selectList('数据预览')
    },
    // 当前页数改变
    currentChange4(pageNum) {
      this.pageNum4 = pageNum
      this.selectList('数据预览')
    },
    handleSearch(data) {
      this.name = data
      this.pageNum = 1
      this.fetchData()
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const requestParams = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        name: this.name
      }
      getList(requestParams).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    handleAdd() {
      this.addDialogVisible = true
      this.findForm = {
        code: '',
        completeSql: '',
        creatTime: '',
        creatorId: sessionStorage.getItem('User-Id'),
        id: 0,
        name: '',
        remarks: '',
        alias: ''
      }
      this.list1 = []
      this.list2 = []
      this.list3 = []
      this.activeName = 'first1'
      this.activeIndex = 'first'
      // this.selectList('查询内容')
      findTree().then(res => {
        this.tree = res.data
      })
    },
    handleEdit(row) {
      this.editDialogVisible = true
      this.findForm = {
        code: row.code,
        completeSql: row.completeSql,
        creatTime: row.creatTime,
        creatorId: sessionStorage.getItem('User-Id'),
        id: row.id,
        name: row.name,
        remarks: row.remarks,
        alias: row.alias
      }
      this.list1 = []
      this.list2 = []
      this.list3 = []
      this.activeName = 'first1'
      this.activeIndex = 'first'
      this.selectList('查询内容')
      findTree().then(res => {
        this.tree = res.data
      })
    },
    // 关闭
    handleClose(formName) {
      if (typeof (formName) !== 'undefined') {
        this.$refs[formName].resetFields()
      }
    },
    // 取消
    resetEdit(formName) {
      console.log(formName)
      this.editDialogVisible = false
      this.addDialogVisible = false
      this.previewDialogVisible = false
      if (typeof (formName) !== 'undefined') {
        this.$refs[formName].resetFields()
      }
    },
    // 添加提交
    saveAdd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // const astricts = []
          // const conditions = []
          // const contents = []
          // for (let i = 0; i < this.list1.length; i++) {
          //   const value = this.list1[i]
          //   // if (value.id === 0) {
          //   //   this.contentAdd(value)
          //   // } else {
          //   //   this.contentUpdate(value)
          //   // }
          // }
          // for (let i = 0; i < this.list2.length; i++) {
          //   const value = this.list2[i]
          //   if (value.id === 0) {
          //     this.conditionAdd(value)
          //   } else {
          //     this.conditionUpdate(value)
          //   }
          // }
          // for (let i = 0; i < this.list3.length; i++) {
          //   const value = this.list3[i]
          //   if (value.id === 0) {
          //     this.astrictAdd(value)
          //   } else {
          //     this.astrictUpdate(value)
          //   }
          // }
          this.findForm.astricts = this.list3
          this.findForm.conditions = this.list2
          this.findForm.contents = this.list1
          selectAdd(this.findForm).then(res => {
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
    // 修改提交
    saveEdit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // for (let i = 0; i < this.list1.length; i++) {
          //   const value = this.list1[i]
          //   if (value.id === 0) {
          //     this.contentAdd(value)
          //   } else {
          //     this.contentUpdate(value)
          //   }
          // }
          // for (let i = 0; i < this.list2.length; i++) {
          //   const value = this.list2[i]
          //   if (value.id === 0) {
          //     this.conditionAdd(value)
          //   } else {
          //     this.conditionUpdate(value)
          //   }
          // }
          // for (let i = 0; i < this.list3.length; i++) {
          //   const value = this.list3[i]
          //   if (value.id === 0) {
          //     this.astrictAdd(value)
          //   } else {
          //     this.astrictUpdate(value)
          //   }
          // }
          this.findForm.astricts = this.list3
          this.findForm.conditions = this.list2
          this.findForm.contents = this.list1
          selectUpdate(this.findForm).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.$refs[formName].resetFields()
              this.editDialogVisible = false
              this.fetchData()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleNodeClick(data) {
      if (data.children.length === 0) {
        if (this.activeName === 'first1') {
          let parent = null
          for (let i = 0; i < this.tree.length; i++) {
            const value = this.tree[i]
            for (let j = 0; j < value.children.length; j++) {
              if (value.children[j].parentid === value.id) {
                parent = value
                break
              }
            }
          }
          this.list1.push({
            alias: null,
            columnCn: data.label,
            columnEn: data.enname,
            func: '',
            id: 0,
            selectId: this.selectId,
            tableCn: parent.label,
            tableEn: parent.enname
          })
        } else if (this.activeName === 'second2') {
          let parent = null
          for (let i = 0; i < this.tree.length; i++) {
            const value = this.tree[i]
            for (let j = 0; j < value.children.length; j++) {
              if (value.children[j].parentid === value.id) {
                parent = value
                break
              }
            }
          }
          this.list2.push({
            alias: null,
            columnCn: data.label,
            columnEn: data.enname,
            func: '',
            id: 0,
            selectId: this.selectId,
            tableCn: parent.label,
            tableEn: parent.enname
          })
        } else if (this.activeName === 'third3') {
          let parent = null
          for (let i = 0; i < this.tree.length; i++) {
            const value = this.tree[i]
            for (let j = 0; j < value.children.length; j++) {
              if (value.children[j].parentid === value.id) {
                parent = value
                break
              }
            }
          }
          this.list3.push({
            alias: null,
            columnCn: data.label,
            columnEn: data.enname,
            func: '',
            id: 0,
            selectId: this.selectId,
            tableCn: parent.label,
            tableEn: parent.enname
          })
        }
      } else {
        if (this.activeName === 'first1') {
          for (let i = 0; i < data.children.length; i++) {
            const pvalue = data.children[i]
            let flag = false
            for (let i = 0; i < this.list1.length; i++) {
              const value = this.list1[i]
              if (value.columnEn === pvalue.enname) {
                flag = true
                break
              }
            }
            if (!flag) {
              this.list1.push({
                alias: null,
                columnCn: pvalue.label,
                columnEn: pvalue.enname,
                func: '',
                id: 0,
                selectId: this.selectId,
                tableCn: data.label,
                tableEn: data.enname
              })
            }
          }
        } else if (this.activeName === 'second2') {
          for (let i = 0; i < data.children.length; i++) {
            const pvalue = data.children[i]
            let flag = false
            for (let i = 0; i < this.list1.length; i++) {
              const value = this.list1[i]
              if (value.columnEn === pvalue.enname) {
                flag = true
                break
              }
            }
            if (!flag) {
              this.list2.push({
                alias: null,
                columnCn: pvalue.label,
                columnEn: pvalue.enname,
                func: '',
                id: 0,
                selectId: this.selectId,
                tableCn: data.label,
                tableEn: data.enname
              })
            }
          }
        } else if (this.activeName === 'third3') {
          for (let i = 0; i < data.children.length; i++) {
            const pvalue = data.children[i]
            let flag = false
            for (let i = 0; i < this.list1.length; i++) {
              const value = this.list1[i]
              if (value.columnEn === pvalue.enname) {
                flag = true
                break
              }
            }
            if (!flag) {
              this.list3.push({
                alias: null,
                columnCn: pvalue.label,
                columnEn: pvalue.enname,
                func: '',
                id: 0,
                selectId: this.selectId,
                tableCn: data.label,
                tableEn: data.enname
              })
            }
          }
        }
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        remove(row.id).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.fetchData()
          }
        })
      }).catch(() => {
      })
    },
    contentUpdate(row) {
      contentUpdate(row).then(res => {
        if (res.code === 0) {
          console.log(123)
        }
      })
    },
    contentAdd(row) {
      contentAdd(row).then(res => {
        if (res.code === 0) {
          console.log(123)
        }
      })
    },
    conditionUpdate(row) {
      conditionUpdate(row).then(res => {
        if (res.code === 0) {
          console.log(123)
        }
      })
    },
    conditionAdd(row) {
      conditionAdd(row).then(res => {
        if (res.code === 0) {
          console.log(123)
        }
      })
    },
    astrictUpdate(row) {
      astrictUpdate(row).then(res => {
        if (res.code === 0) {
          console.log(123)
        }
      })
    },
    astrictAdd(row) {
      astrictAdd(row).then(res => {
        if (res.code === 0) {
          console.log(123)
        }
      })
    },
    contentDelete(row) {
      for (let i = 0; i < this.list1.length; i++) {
        if (row.columnEn === this.list1[i].columnEn) {
          this.list1.splice(i, 1)
          break
        }
      }
      // if (row.id === 0) {
      //   for (let i = 0; i < this.list1.length; i++) {
      //     if (row.columnEn === this.list1[i].columnEn) {
      //       this.list1.splice(i, 1)
      //       this.$message({
      //         type: 'success',
      //         message: '删除成功!'
      //       })
      //       break
      //     }
      //   }
      // } else {
      //   this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     contentDelete(row.id).then(res => {
      //       if (res.code === 0) {
      //         this.$message({
      //           type: 'success',
      //           message: '删除成功!'
      //         })
      //         for (let i = 0; i < this.list1.length; i++) {
      //           if (row.columnEn === this.list1[i].columnEn) {
      //             this.list1.splice(i, 1)
      //             break
      //           }
      //         }
      //       }
      //     })
      //   }).catch(() => {
      //   })
      // }
    },
    conditionDelete(row) {
      for (let i = 0; i < this.list2.length; i++) {
        if (row.columnEn === this.list2[i].columnEn) {
          this.list2.splice(i, 1)
          break
        }
      }
      // if (row.id === 0) {
      //   for (let i = 0; i < this.list2.length; i++) {
      //     if (row.columnEn === this.list2[i].columnEn) {
      //       this.list2.splice(i, 1)
      //       this.$message({
      //         type: 'success',
      //         message: '删除成功!'
      //       })
      //       break
      //     }
      //   }
      // } else {
      //   this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     conditionDelete(row.id).then(res => {
      //       if (res.code === 0) {
      //         this.$message({
      //           type: 'success',
      //           message: '删除成功!'
      //         })
      //         for (let i = 0; i < this.list2.length; i++) {
      //           if (row.columnEn === this.list2[i].columnEn) {
      //             this.list2.splice(i, 1)
      //             this.$message({
      //               type: 'success',
      //               message: '删除成功!'
      //             })
      //             break
      //           }
      //         }
      //       }
      //     })
      //   }).catch(() => {
      //   })
      // }
    },
    dataPreview() {
      const requestParams = {
        contents: this.list1,
        conditions: this.list2,
        astricts: this.list3,
        pageNum: 1,
        pageSize: 100000
      }
      dataPreview(requestParams).then(res => {
        if (res.code === 0) {
          this.list4 = res.data.list
        }
      })
    },
    astrictDelete(row) {
      for (let i = 0; i < this.list3.length; i++) {
        if (row.columnEn === this.list3[i].columnEn) {
          this.list3.splice(i, 1)
          break
        }
      }
      // if (row.id === 0) {
      //   for (let i = 0; i < this.list3.length; i++) {
      //     if (row.columnEn === this.list3[i].columnEn) {
      //       this.list3.splice(i, 1)
      //       this.$message({
      //         type: 'success',
      //         message: '删除成功!'
      //       })
      //       break
      //     }
      //   }
      // } else {
      //   this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     astrictDelete(row.id).then(res => {
      //       if (res.code === 0) {
      //         this.$message({
      //           type: 'success',
      //           message: '删除成功!'
      //         })
      //         for (let i = 0; i < this.list3.length; i++) {
      //           if (row.columnEn === this.list3[i].columnEn) {
      //             this.list3.splice(i, 1)
      //             break
      //           }
      //         }
      //       }
      //     })
      //   }).catch(() => {
      //   })
      // }
    },
    getListPreview(str) {
      this.previewDialogVisible = true
      const requestParams = {
        id: str,
        pageNum: 1,
        pageSize: 100000
      }
      getListPreview(requestParams).then(res => {
        this.dataList = res.data.list
      })
    },
    handleSelect(tab, event) {
      console.log(tab, event)
    },
    handleClick(tab, event) {
      this.selectList(tab.label)
    },
    selectList(content) {
      if (content === '查询内容') {
        if (this.list1.length === 0) {
          this.listLoading = true
          const requestParams = {
            pageSize: this.pageSize1,
            pageNum: this.pageNum1,
            selectId: this.findForm.id
          }
          getListContent(requestParams).then(res => {
            this.list1 = res.data.list
            if (this.list1.length > 0) {
              this.selectId = this.list1[0].selectId
            }
            this.totalPage1 = parseInt(res.data.total)
            this.listLoading = false
          })
        }
      } else if (content === '查询条件') {
        if (this.list2.length === 0) {
          this.listLoading = true
          const requestParams = {
            pageSize: this.pageSize2,
            pageNum: this.pageNum2,
            selectId: this.findForm.id
          }
          getListCondition(requestParams).then(res => {
            this.list2 = res.data.list
            this.totalPage = parseInt(res.data.total)
            this.listLoading = false
          })
        }
      } else if (content === '查询限制') {
        if (this.list3.length === 0) {
          this.listLoading = true
          const requestParams = {
            pageSize: this.pageSize3,
            pageNum: this.pageNum3,
            selectId: this.findForm.id
          }
          getListAstrict(requestParams).then(res => {
            this.list3 = res.data.list
            this.totalPage = parseInt(res.data.total)
            this.listLoading = false
          })
        }
      } else if (content === '数据预览') {
        this.dataPreview()
      }
    },
    handleChange(row) {
      if (row.astrict === 'group by') {
        row.astrictVal = ''
      }
    }
  }
}
