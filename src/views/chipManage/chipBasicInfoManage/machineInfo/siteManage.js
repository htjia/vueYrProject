
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findList, userList, findLists, gyShopList, processList, siteList, insert, update, remove } from '@/api/chipBasicInfoManage/machineInfo'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const valuecheck = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('机台号不能为空'))
      } else {
        callback()
      }
    }
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      activeTabIndex: 0,
      searchName: '',
      newList: [],
      setList: [],
      jgnewList: [],
      jgsetList: [],
      machineForm: {
        work: '',
        factory: '',
        remark: '',
        site: '',
        type: '',
        process: [],
        code: '',
        model: ''
      },
      rules: {
        work: [{ required: true, message: '请选择工段', trigger: 'blur' }],
        factory: [{ required: true, message: '请选择车间', trigger: 'blur' }],
        code: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        process: [{ required: true, message: '请选择工序', trigger: 'blur' }]
      },
      list: [],
      userOptions: [],
      beginDate: '',
      endDate: '',
      pickerOptionsStart: {
        disabledDate: (time) => {
          const endDateVal = this.endDate
          if (endDateVal) {
            return time.getTime() > endDateVal
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          const beginDateVal = this.beginDate
          if (beginDateVal) {
            return time.getTime() < beginDateVal
          }
        }
      },
      workshopList: [
        {
          id: 0,
          name: '前段'
        },
        {
          id: 1,
          name: '后段'
        }
      ],
      typeList: [
        {
          id: 0,
          name: '槽位'
        },
        {
          id: 1,
          name: '胶管'
        }
      ],
      creator: '',
      section: '',
      factory: '',
      factoryList: [],
      processId: '',
      processLists: [],
      processListspage: [],
      machineInfo: '',
      machineList: [],
      pageSize: 12,
      pageNum: 1,
      totalPage: 0,
      siteLists: [],
      isCH: false,
      isJGH: false,
      currId: 0
    }
  },
  mounted() {
    this.fetchData()
    this.userList()
    this.findLists()
    this.gyShopList()
    this.processListpage()
    this.siteList()
  },
  methods: {
    tabClick(index) {
      this.activeTabIndex = index
    },
    clearSearch() {
      this.creator = ''
      this.section = ''
      this.factory = ''
      this.processId = ''
      this.machineInfo = ''
      this.pageNum = 1
      this.beginDate = ''
      this.endDate = ''
      this.fetchData()
    },
    // 删除
    handleDelete(row) {
      this.$confirm('此操作将永久删除该机台, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        remove({ id: row.id }).then(res => {
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
    siteList() {
      siteList().then(res => {
        this.siteLists = res.data.list
      })
    },
    findLists() {
      findLists().then(res => {
        this.machineList = res.data.list
      })
    },
    userList() {
      userList().then(res => {
        this.userOptions = res.data.list
      })
    },
    gyShopList() {
      gyShopList().then(res => {
        this.factoryList = res.data.list
      })
    },
    processListpage() {
      this.processListspage = []
      const params = {
        pageNum: 1,
        pageSize: 100000
      }
      processList(params).then(res => {
        this.processListspage = res.data.list
      })
    },
    processList() {
      this.processLists = []
      if (this.machineForm.site !== '') {
        const params = {
          pageNum: 1,
          pageSize: 100000,
          siteId: this.machineForm.site
        }
        processList(params).then(res => {
          this.processLists = res.data.list
        })
      }
    },
    findSiteName() {
      this.machineForm.process = []
      this.isCH = false
      this.isJGH = false
      if (this.machineForm.site !== null && this.machineForm.site !== '') {
        this.processList()
        // for (const item of this.siteLists) {
        //   if (this.machineForm.site === item.id) {
        //     if (item.name === '清洗' || item.name === '腐蚀' || item.name === '去胶') {
        //       this.isCH = true
        //     }
        //     if (item.name === '光刻胶涂布') {
        //       this.isJGH = true
        //     }
        //   }
        // }
      }
    },
    findBySiteName() {
      this.machineForm.site = ''
      this.machineForm.processLists = ''
      siteList().then(res => {
        if (this.machineForm.factory === '' || this.machineForm.factory === undefined) {
          this.siteLists = res.data.list
        } else {
          this.siteLists = []
          for (const item of res.data.list) {
            if (item.workshopId === this.machineForm.factory) {
              this.siteLists.push(item)
            }
          }
        }
      })
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        section: this.section,
        creator: this.creator,
        workshopId: this.factory,
        processId: this.processId,
        code: this.machineInfo,
        startTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate)
      }
      if (this.beginDate === '') {
        params.startTime = ''
      }
      if (this.endDate === '') {
        params.endTime = ''
      }
      findList(params).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
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
    // 添加
    handleAdd() {
      this.machineForm = {
        work: '',
        factory: '',
        remark: '',
        site: '',
        type: '',
        process: [],
        code: '',
        model: ''
      }
      this.addDialogVisible = true
      this.newList = []
      this.setList = []
      this.jgnewList = []
      this.jgsetList = []
      this.newList.push({
        index: 0,
        one: '',
        two: '',
        three: ''
      })
      this.setList.push({
        one: '',
        two: '',
        three: ''
      })
      this.jgnewList.push({
        index: 0,
        one: '',
        two: '',
        three: ''
      })
      this.jgsetList.push({
        one: '',
        two: '',
        three: ''
      })
    },
    workChange() {
      this.machineForm.factory = ''
      this.machineForm.site = ''
      this.machineForm.process = []
    },
    // 编辑机台
    handleEdit(row) {
      console.log(row.processId.split(',').map(Number))
      this.currId = row.id
      this.siteLists = []
      this.findBySiteName()
      this.machineForm.site = row.siteId
      this.findSiteName()
      this.editDialogVisible = true
      this.newList = []
      this.setList = []
      this.jgnewList = []
      this.jgsetList = []
      this.isCH = false
      this.isJGH = false
      setTimeout(() => {
        this.machineForm = {
          work: row.section,
          factory: row.workshopId,
          remark: row.remark,
          site: row.siteId,
          type: row.slotNo === '' ? (row.hoseNo === '' ? '' : 1) : 0,
          process: row.processId.split(',').map(Number),
          code: row.code,
          model: row.model
        }
      }, 200)
      if (row.slotNo !== '') {
        const splitList = row.slotNo.split(',')
        let i = 0
        for (const item of splitList) {
          var data = {
            index: i,
            one: item,
            two: '',
            three: ''
          }
          var data1 = {
            one: item,
            two: '',
            three: ''
          }
          i = i + 1
          this.newList.push(data)
          this.setList.push(data1)
        }
      } else {
        this.newList.push({
          index: 0,
          one: '',
          two: '',
          three: ''
        })
        this.setList.push({
          one: '',
          two: '',
          three: ''
        })
      }
      if (row.hoseNo !== '') {
        const splitList = row.hoseNo.split(',')
        let i = 0
        for (const item of splitList) {
          var data2 = {
            index: i,
            one: item,
            two: '',
            three: ''
          }
          var data3 = {
            one: item,
            two: '',
            three: ''
          }
          i = i + 1
          this.jgnewList.push(data2)
          this.jgsetList.push(data3)
        }
      } else {
        this.jgnewList.push({
          index: 0,
          one: '',
          two: '',
          three: ''
        })
        this.jgsetList.push({
          one: '',
          two: '',
          three: ''
        })
      }
    },
    addItem() {
      this.setList.push({
        one: '',
        two: '',
        three: ''
      })
      this.setNewList(1)
    },
    deleteItem(item) {
      this.setList.splice(item.index, 1)
      this.setNewList(2)
    },
    setADDList(item, type) {
      if (type === 'one') {
        this.setList[item.index].one = item.one
      } else if (type === 'two') {
        this.setList[item.index].two = item.two
      } else if (type === 'three') {
        this.setList[item.index].three = item.three
      }
    },
    setNewList(type) {
      this.newList = []
      for (let i = 0; i < this.setList.length; i++) {
        var data = {
          index: i,
          one: this.setList[i].one,
          two: this.setList[i].two,
          three: this.setList[i].three
        }
        this.newList.push(data)
      }
      if (type === 1) {
        var _this = this
        setTimeout(function() {
          let div = null
          if (_this.addDialogVisible) {
            div = document.getElementById('addnewList')
          } else {
            div = document.getElementById('upnewList')
          }
          div.scrollTop = div.scrollHeight
        }, 100)
      }
    },
    jgaddItem() {
      this.jgsetList.push({
        one: '',
        two: '',
        three: ''
      })
      this.jgsetNewList(1)
    },
    jgdeleteItem(item) {
      this.jgsetList.splice(item.index, 1)
      this.jgsetNewList(2)
    },
    jgsetADDList(item, type) {
      if (type === 'one') {
        this.jgsetList[item.index].one = item.one
      } else if (type === 'two') {
        this.jgsetList[item.index].two = item.two
      } else if (type === 'three') {
        this.jgsetList[item.index].three = item.three
      }
    },
    jgsetNewList(type) {
      this.jgnewList = []
      for (let i = 0; i < this.jgsetList.length; i++) {
        var data = {
          index: i,
          one: this.jgsetList[i].one,
          two: this.jgsetList[i].two,
          three: this.jgsetList[i].three
        }
        this.jgnewList.push(data)
      }
      if (type === 1) {
        var _this = this
        setTimeout(function() {
          let div = null
          if (_this.addDialogVisible) {
            div = document.getElementById('addjgnewList')
          } else {
            div = document.getElementById('upjgnewList')
          }
          div.scrollTop = div.scrollHeight
        }, 100)
      }
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var chstr = ''
          var jghstr = ''
          if (this.machineForm.type === 0) {
            let flag = false
            const cwobj = {}
            for (const item of this.newList) {
              if (item.one.trim().length === 0) {
                flag = true
                break
              }
              cwobj[item.one] = ''
              if (chstr === '') {
                chstr = item.one
              } else {
                chstr = chstr + ',' + item.one
              }
            }
            const keys = Object.keys(cwobj)
            if (this.newList.length > 0 && this.newList.length !== keys.length) {
              this.$message({
                type: 'error',
                message: '槽位不能重复!'
              })
              return
            }
            if (flag) {
              this.$message({
                type: 'error',
                message: '槽位不能为空!'
              })
              return
            }
          }
          if (this.machineForm.type === 1) {
            let flag = false
            const cwobj = {}
            for (const item of this.jgnewList) {
              if (item.one.trim().length === 0) {
                flag = true
                break
              }
              if (jghstr === '') {
                jghstr = item.one
              } else {
                jghstr = jghstr + ',' + item.one
              }
            }
            const keys = Object.keys(cwobj)
            if (this.jgnewList.length > 0 && this.jgnewList.length !== keys.length) {
              this.$message({
                type: 'error',
                message: '胶管号不能重复!'
              })
              return
            }
            if (flag) {
              this.$message({
                type: 'error',
                message: '胶管号不能为空!'
              })
              return
            }
          }
          const params = {
            code: this.machineForm.code,
            creator: sessionStorage.getItem('User-Id'),
            hoseNo: jghstr,
            model: this.machineForm.model,
            processId: this.machineForm.process.join(),
            remark: this.machineForm.remark,
            section: this.machineForm.work,
            siteId: this.machineForm.site,
            slotNo: chstr,
            workshopId: this.machineForm.factory
          }
          insert(params).then(res => {
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
    // 添加提交
    editsubmitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var chstr = ''
          var jghstr = ''
          if (this.machineForm.type === 0) {
            let flag = false
            for (const item of this.newList) {
              if (item.one.trim().length === 0) {
                flag = true
                break
              }
              if (chstr === '') {
                chstr = item.one
              } else {
                chstr = chstr + ',' + item.one
              }
            }
            if (flag) {
              this.$message({
                type: 'error',
                message: '槽位不能为空!'
              })
              return
            }
          }
          if (this.machineForm.type === 1) {
            let flag = false
            for (const item of this.jgnewList) {
              if (item.one.trim().length === 0) {
                flag = true
                break
              }
              if (jghstr === '') {
                jghstr = item.one
              } else {
                jghstr = jghstr + ',' + item.one
              }
            }
            if (flag) {
              this.$message({
                type: 'error',
                message: '胶管号不能为空!'
              })
              return
            }
          }
          const params = {
            id: this.currId,
            code: this.machineForm.code,
            creator: sessionStorage.getItem('User-Id'),
            hoseNo: jghstr,
            model: this.machineForm.model,
            processId: this.machineForm.process.join(),
            remark: this.machineForm.remark,
            section: this.machineForm.work,
            siteId: this.machineForm.site,
            slotNo: chstr,
            workshopId: this.machineForm.factory
          }
          update(params).then(res => {
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
    // 取消
    resetForm(formName) {
      this.addDialogVisible = false
      this.$refs[formName].resetFields()
    }
  }
}

