
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { siteList } from '@/api/processManagement/siteManage'
import { scProductModel, disableEnable, deleteProduct, save, scElectrodeList, findColorList, findModelList, findGYlList, gyFlowCardFind, gyagainFlowCardFind, wygg, scChipCraftList,
  scCuttingCraftList, fetchCardInfo } from '@/api/pcChipCasting/productModel'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const validateDJ = (rule, value, callback) => {
      const num = new RegExp('^-?\\d+$')
      if (value === null) {
        value = ''
      }
      value = value + ''
      if (value.trim().length === 0) {
        // callback(new Error('请输入电极'))
        callback()
      } else {
        if (!num.test(value)) {
          callback(new Error('电极必须为小于100的正整数'))
        } else if (parseInt(value) > 100 || parseInt(value) < 0) {
          callback(new Error('电极必须为小于100的正整数'))
        } else {
          callback()
        }
      }
    }
    const validateName = (rule, value, callback) => {
      if (value === null) {
        value = ''
      }
      value = value + ''
      if (value.trim().length === 0) {
        callback(new Error('输入不能为空'))
      } else {
        callback()
      }
    }
    const validateQGD = (rule, value, callback) => {
      const num = new RegExp('^-?\\d+$')
      if (value === null) {
        value = ''
      }
      value = value + ''
      if (value.trim().length === 0) {
        // callback(new Error('请输入切割道'))
        callback()
      } else {
        if (!num.test(value)) {
          callback(new Error('切割道必须为小于100的正整数'))
        } else if (parseInt(value) > 100 || parseInt(value) < 0) {
          callback(new Error('切割道必须为小于100的正整数'))
        } else {
          callback()
        }
      }
    }
    const validateCowTest = (rule, value, callback) => {
      const num = new RegExp('^-?\\d+$')
      if (value === null) {
        value = ''
      }
      value = value + ''
      if (value.trim().length === 0) {
        // callback(new Error('请输入COW测试条件'))
        callback()
      } else {
        if (!num.test(value)) {
          callback(new Error('COW测试条件必须为小于100的正整数'))
        } else if (parseInt(value) > 100 || parseInt(value) < 0) {
          callback(new Error('COW测试条件必须为小于100的正整数'))
        } else {
          callback()
        }
      }
    }
    const validateCurrentTest = (rule, value, callback) => {
      const num = new RegExp('^-?\\d+$')
      if (value === null) {
        value = ''
      }
      value = value + ''
      if (value.trim().length === 0) {
        // callback(new Error('请输入COT电流测试条件'))
        callback()
      } else {
        if (!num.test(value)) {
          callback(new Error('COT电流测试条件必须为小于100的正整数'))
        } else if (parseInt(value) > 100 || parseInt(value) < 0) {
          callback(new Error('COT电流测试条件必须为小于100的正整数'))
        } else {
          callback()
        }
      }
    }
    const validateBZCH = (rule, value, callback) => {
      const num = new RegExp('^-?\\d+$')
      if (value === null) {
        value = ''
      }
      value = value + ''
      if (value.trim().length === 0) {
        // callback(new Error('请输入标准产出'))
        callback()
      } else {
        if (!num.test(value)) {
          callback(new Error('标准产出必须为小于100000的正整数'))
        } else if (parseInt(value) > 100000 || parseInt(value) < 0) {
          callback(new Error('标准产出必须为小于100000的正整数'))
        } else {
          callback()
        }
      }
    }
    const validateYMHD = (rule, value, callback) => {
      const num = new RegExp('/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/')
      if (value === null) {
        value = ''
      }
      value = value + ''
      if (value.trim().length === 0) {
        callback(new Error('请输入研磨厚度'))
      } else {
        if (num.test(value)) {
          callback(new Error('研磨厚度必须为非负浮点数'))
        } else if (parseFloat(value) > 1000) {
          callback(new Error('研磨厚度必须小于1000'))
        } else {
          callback()
        }
      }
    }
    return {
      listLoading: false,
      loading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      activeTabIndex: 0,
      list: [],
      userOptions: [],
      fileUrl: process.env.BASE_API + '/scProductModel/upload',
      uploadParams: {},
      machineForm: {
        id: '',
        creator: '',
        colors: '',
        tpmodel: '',
        electrodes: '',
        againId: '',
        backPlating: '',
        chipCraftId: '',
        code: '',
        cotEsd: false,
        cotIr: '',
        cotTest: '',
        cowTest: '',
        currentTest: '',
        cuttingCraftId: '',
        cuttingWay: '',
        electrode: '',
        electrodeCraft: '',
        grindPly: '',
        mapping: true,
        measure: '',
        model: '',
        remark: '',
        shape: '',
        specification: '',
        standardOutput: '',
        flowcardId: '',
        flowCardName: '',
        tapno: '',
        visual: true,
        url: '',
        imgId: '',
        ldunit: ''
      },
      rules: {
        colors: [{ required: true, validator: validateName, trigger: 'blur' }],
        tpmodel: [{ required: true, validator: validateName, trigger: 'blur' }],
        craft: [{ required: true, validator: validateName, trigger: 'blur' }],
        electrodes: [{ required: true, validator: validateName, trigger: 'blur' }],
        shape: [{ required: true, validator: validateName, trigger: 'blur' }],
        model: [{ required: true, validator: validateName, trigger: 'blur' }],
        measure: [{ required: true, validator: validateName, trigger: 'blur' }],
        electrode: [{ required: false, validator: validateDJ, trigger: 'blur' }],
        // flowcardId: [{ required: true, validator: validateName, trigger: 'blur' }],
        // againId: [{ required: true, validator: validateName, trigger: 'blur' }],
        ldunit: [{ required: true, validator: validateName, trigger: 'blur' }],
        cuttingWay: [{ required: false, validator: validateQGD, trigger: 'blur' }],
        standardOutput: [{ required: false, validator: validateBZCH, trigger: 'blur' }],
        specification: [{ required: true, validator: validateName, trigger: 'blur' }],
        backPlating: [{ required: true, validator: validateName, trigger: 'blur' }],
        chipCraftId: [{ required: true, validator: validateName, trigger: 'blur' }],
        electrodeCraft: [{ required: true, validator: validateName, trigger: 'blur' }],
        grindPly: [{ required: true, validator: validateYMHD, trigger: 'blur' }],
        cuttingCraftId: [{ required: true, validator: validateName, trigger: 'blur' }],
        cowTest: [{ required: false, validator: validateCowTest, trigger: 'blur' }],
        currentTest: [{ required: false, validator: validateCurrentTest, trigger: 'blur' }],
        cotTest: [{ required: true, validator: validateName, trigger: 'blur' }],
        cotIr: [{ required: true, validator: validateName, trigger: 'blur' }]
      },
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
      pageSize: 12,
      pageNum: 1,
      totalPage: 0,
      code: '',
      categoryList: [],
      electrodeList: [],
      colorList: [],
      modelList: [],
      gyList: [],
      cardList: [],
      againcardList: [],
      wyggList: [],
      typeList: [
        {
          id: 0,
          name: '圆片'
        },
        {
          id: 1,
          name: '方片'
        }
      ],
      ldunitList: [
        {
          id: 0,
          name: 'L'
        },
        {
          id: 1,
          name: 'P'
        }
      ],
      backPlatingList: [
        {
          id: 0,
          name: '无'
        },
        {
          id: 1,
          name: '有'
        }
      ],
      scChipCraftLists: [],
      scCuttingCraftLists: [],
      rowInfo: null,
      crrentCode: '',
      currentCardType: '',
      currentCardName: '',
      currentCraft: '',
      currentCraftId: '',
      currentRemark: '',
      currentStatus: '',
      currentCreateTime: '',
      currentUpdateTime: '',
      currentCreator: '',
      currentModifier: '',
      innerVisible: false,
      currentModelList: [],
      forepartSiteOptions: [],
      endSiteOptions: [],
      dialogList: [],
      dialogEndList: []
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    beforeUpload(file) {
      this.loading = true
      const isLt2M = file.size / 1024 < 30
      if (!isLt2M) {
        this.$message({
          message: '文件大小不能超过 30KB!',
          type: 'error'
        })
        this.loading = false
      }
      return isLt2M
    },
    onSuccess(res, file, fileList) {
      this.loading = false
      if (res.code !== 0) {
        this.$message({
          type: 'error',
          message: res.message
        })
      } else {
        this.machineForm.url = '/images/' + res.data.webPath
        this.machineForm.imgId = res.data.dataId
        this.$message({
          type: 'success',
          message: '上传成功'
        })
      }
    },
    onError() {
      this.$message({
        type: 'error',
        message: '上传失败，请重试！'
      })
      this.loading = false
    },
    scElectrodeList() {
      scElectrodeList().then(res => {
        this.electrodeList = res.data.list
      })
    },
    findColorModelList() {
      findColorList().then(res => {
        this.colorList = res.data
      })
      findModelList().then(res => {
        this.modelList = res.data
      })
    },
    findGYlList() {
      findGYlList().then(res => {
        this.gyList = res.data.list
      })
    },
    gyFlowCardFind() {
      gyFlowCardFind().then(res => {
        this.cardList = res.data.list
      })
    },
    gyagainFlowCardFind() {
      gyagainFlowCardFind().then(res => {
        this.againcardList = res.data.list
      })
    },
    wygg() {
      wygg().then(res => {
        this.wyggList = res.data.list
      })
    },
    scChipCraftList() {
      scChipCraftList().then(res => {
        this.scChipCraftLists = res.data.list
      })
    },
    scCuttingCraftList() {
      scCuttingCraftList().then(res => {
        this.scCuttingCraftLists = res.data.list
      })
    },
    getNoAndCode() {
      if (this.machineForm.colors !== '' && this.machineForm.tpmodel !== '' && this.machineForm.craft !== '' && this.machineForm.electrodes !== '') {
        if (this.machineForm.tpmodel.length > 3) {
          this.machineForm.code = this.machineForm.colors + this.machineForm.tpmodel.substring(0, 3) + this.machineForm.craft + '-' + this.machineForm.electrodes
        } else {
          this.machineForm.code = this.machineForm.colors + this.machineForm.tpmodel + this.machineForm.craft + '-' + this.machineForm.electrodes
        }
      }
    },
    handleSearch() {
      this.pageNum = 1
      this.fetchData()
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const params = {
        code: this.code,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      wygg().then(res => {
        this.wyggList = res.data.list
        scProductModel(params).then(res => {
          this.list = []
          for (let i = 0; i < res.data.list.length; i++) {
            for (const item of this.wyggList) {
              if (res.data.list[i].specification === item.id) {
                res.data.list[i].specificationName = item.name
                break
              }
            }
            if (res.data.list[i].status === 0) {
              res.data.list[i].isChecked = true
            } else {
              res.data.list[i].isChecked = false
            }
            this.list.push(res.data.list[i])
          }
          this.list = res.data.list
          this.totalPage = parseInt(res.data.total)
          this.listLoading = false
        })
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
    handleCurrentChange(row) {
      if (row === null) {
        return
      }
      this.rowInfo = row
    },
    tableRowClassColor({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 26 || columnIndex === 27) {
        return 'background: #fff'
      }
    },
    // 添加
    handleAdd(type) {
      this.machineForm = {
        id: '',
        creator: '',
        colors: '',
        tpmodel: '',
        craft: '',
        electrodes: '',
        againId: '',
        backPlating: '',
        chipCraftId: '',
        code: '',
        cotEsd: false,
        cotIr: '',
        cotTest: '',
        cowTest: '',
        currentTest: '',
        cuttingCraftId: '',
        cuttingWay: '',
        electrode: '',
        electrodeCraft: '',
        flowcardId: '',
        flowCardName: '',
        grindPly: '',
        mapping: true,
        measure: '',
        model: '',
        remark: '',
        shape: '',
        specification: '',
        standardOutput: '',
        tapno: '',
        visual: true,
        url: '',
        imgId: '',
        ldunit: ''
      }
      if (type === 1) {
        if (this.rowInfo === null) {
          this.$message({
            type: 'error',
            message: '请选择参照行!'
          })
          return
        }
        this.machineForm = {
          id: '',
          creator: '',
          colors: this.rowInfo.gs,
          tpmodel: this.rowInfo.xh,
          craft: this.rowInfo.gy,
          electrodes: this.rowInfo.dj,
          backPlating: this.rowInfo.backPlating,
          chipCraftId: this.rowInfo.chipCraftId,
          code: this.rowInfo.code,
          cotEsd: this.rowInfo.cotEsd === 1,
          cotIr: this.rowInfo.cotIr,
          cotTest: this.rowInfo.cotTest,
          cowTest: this.rowInfo.cowTest,
          currentTest: this.rowInfo.currentTest,
          cuttingCraftId: this.rowInfo.cuttingCraftId,
          cuttingWay: this.rowInfo.cuttingWay,
          electrode: this.rowInfo.electrode,
          electrodeCraft: this.rowInfo.electrodeCraft,
          grindPly: this.rowInfo.grindPly,
          mapping: this.rowInfo.mapping === 1,
          measure: this.rowInfo.measure,
          model: this.rowInfo.model,
          remark: this.rowInfo.remark,
          shape: this.rowInfo.shape,
          specification: this.rowInfo.specification,
          standardOutput: this.rowInfo.standardOutput,
          tapno: this.rowInfo.tapno,
          visual: this.rowInfo.visual === 1,
          url: '',
          imgId: '',
          ldunit: this.rowInfo.ldunit
        }
        if (this.machineForm.ldunit === null) {
          this.machineForm.ldunit = ''
        }
      }
      this.scElectrodeList()
      this.findColorModelList()
      this.findGYlList()
      this.gyFlowCardFind()
      this.wygg()
      this.scChipCraftList()
      this.scCuttingCraftList()
      this.gyagainFlowCardFind()
      this.addDialogVisible = true
    },
    // 添加
    handleEdit(row) {
      this.rowInfo = row
      if (this.rowInfo === null) {
        this.$message({
          type: 'error',
          message: '请选择参照行!'
        })
        return
      }
      this.uploadParams = { dataId: this.rowInfo.id }
      this.machineForm = {
        id: '',
        creator: '',
        colors: this.rowInfo.gs,
        tpmodel: this.rowInfo.xh,
        craft: this.rowInfo.gy,
        electrodes: this.rowInfo.dj,
        backPlating: this.rowInfo.backPlating,
        chipCraftId: this.rowInfo.chipCraftId,
        code: this.rowInfo.code,
        cotEsd: this.rowInfo.cotEsd === 1,
        cotIr: this.rowInfo.cotIr,
        cotTest: this.rowInfo.cotTest,
        cowTest: this.rowInfo.cowTest,
        currentTest: this.rowInfo.currentTest,
        cuttingCraftId: this.rowInfo.cuttingCraftId,
        cuttingWay: this.rowInfo.cuttingWay,
        electrode: this.rowInfo.electrode,
        electrodeCraft: this.rowInfo.electrodeCraft,
        grindPly: this.rowInfo.grindPly,
        mapping: this.rowInfo.mapping === 1,
        measure: this.rowInfo.measure,
        model: this.rowInfo.model,
        remark: this.rowInfo.remark,
        shape: this.rowInfo.shape,
        specification: this.rowInfo.specification,
        standardOutput: this.rowInfo.standardOutput,
        tapno: this.rowInfo.tapno,
        flowcardId: this.rowInfo.flowCardId,
        flowCardName: this.rowInfo.flowCardName,
        visual: this.rowInfo.visual === 1,
        url: '/images/' + this.rowInfo.iconUrl,
        imgId: this.rowInfo.id,
        ldunit: this.rowInfo.ldunit
      }
      if (this.machineForm.ldunit === null) {
        this.machineForm.ldunit = ''
      }
      if (this.machineForm.url === undefined) {
        this.machineForm.url = ''
        this.machineForm.imgId = ''
      }
      this.scElectrodeList()
      this.findColorModelList()
      this.findGYlList()
      this.gyFlowCardFind()
      this.wygg()
      this.scChipCraftList()
      this.scCuttingCraftList()
      this.gyagainFlowCardFind()
      this.editDialogVisible = true
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    // 添加提交
    submitForm(formName) {
      // if (this.machineForm.url === '') {
      //   this.$message({
      //     type: 'error',
      //     message: '请上传芯片外观!'
      //   })
      //   return
      // }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            backPlating: this.machineForm.backPlating,
            chipCraftId: this.machineForm.chipCraftId,
            code: this.machineForm.code,
            cotEsd: this.machineForm.cotEsd ? '1' : '0',
            cotIr: this.machineForm.cotIr,
            cotTest: this.machineForm.cotTest,
            cowTest: this.machineForm.cowTest,
            creator: this.machineForm.creator,
            currentTest: this.machineForm.currentTest,
            cuttingCraftId: this.machineForm.cuttingCraftId,
            cuttingWay: this.machineForm.cuttingWay,
            electrode: this.machineForm.electrode,
            electrodeCraft: this.machineForm.electrodeCraft,
            grindPly: this.machineForm.grindPly,
            id: this.machineForm.imgId,
            mapping: this.machineForm.mapping ? '1' : '0',
            measure: this.machineForm.measure,
            model: this.machineForm.model,
            remark: this.machineForm.remark,
            shape: this.machineForm.shape,
            specification: this.machineForm.specification,
            standardOutput: this.machineForm.standardOutput,
            tapno: this.machineForm.tapno,
            visual: this.machineForm.visual ? '1' : '0',
            xh: this.machineForm.tpmodel,
            gs: this.machineForm.colors,
            gy: this.machineForm.craft,
            dj: this.machineForm.electrodes,
            ldunit: this.machineForm.ldunit
          }
          save(params).then(res => {
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
    submitEditForm(formName) {
      // if (this.machineForm.url === '') {
      //   this.$message({
      //     type: 'error',
      //     message: '请上传芯片外观!'
      //   })
      //   return
      // }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            backPlating: this.machineForm.backPlating,
            chipCraftId: this.machineForm.chipCraftId,
            code: this.machineForm.code,
            cotEsd: this.machineForm.cotEsd ? '1' : '0',
            cotIr: this.machineForm.cotIr,
            cotTest: this.machineForm.cotTest,
            cowTest: this.machineForm.cowTest,
            creator: this.machineForm.creator,
            currentTest: this.machineForm.currentTest,
            cuttingCraftId: this.machineForm.cuttingCraftId,
            cuttingWay: this.machineForm.cuttingWay,
            electrode: this.machineForm.electrode,
            electrodeCraft: this.machineForm.electrodeCraft,
            grindPly: this.machineForm.grindPly,
            id: this.rowInfo.id,
            mapping: this.machineForm.mapping ? '1' : '0',
            measure: this.machineForm.measure,
            model: this.machineForm.model,
            remark: this.machineForm.remark,
            shape: this.machineForm.shape,
            specification: this.machineForm.specification,
            standardOutput: this.machineForm.standardOutput,
            tapno: this.machineForm.tapno,
            visual: this.machineForm.visual ? '1' : '0',
            xh: this.machineForm.tpmodel,
            gs: this.machineForm.colors,
            gy: this.machineForm.craft,
            dj: this.machineForm.electrodes,
            ldunit: this.machineForm.ldunit
          }
          save(params).then(res => {
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
    },
    setStatus(row) {
      if (row.isChecked) {
        this.$confirm('确定启用' + row.code + '?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          row.status = 0
          const requestParams = {
            id: row.id,
            status: row.status
          }
          disableEnable(requestParams).then(res => {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.fetchData()
          })
        }, () => {
          row.isChecked = false
        })
      } else {
        this.$confirm('确定弃用' + row.code + '?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          row.status = 1
          const requestParams = {
            id: row.id,
            status: row.status
          }
          disableEnable(requestParams).then(res => {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.fetchData()
          })
        }, () => {
          row.isChecked = true
        })
      }
    },
    // 删除按钮
    handleDelete(row) {
      this.$confirm('此操作将永久删除当前产品信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: row.id
        }
        deleteProduct(params).then(res => {
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
      })
    },
    setCopyProce(data) {
      const firstProce = []
      const endProce = []
      data.map((item) => {
        if (item.type === 0) {
          firstProce.push(item)
        } else {
          endProce.push(item)
        }
      })
      this.dialogList = firstProce
      this.dialogEndList = endProce
    },
    // 弹框内查看按钮
    handleReview(row) {
      this.getForepartSiteList()
      this.getEndSiteList()
      this.rowInfo = row
      const requestParams = {
        pageNum: 1,
        pageSize: 100000
      }
      gyFlowCardFind(requestParams).then(res => {
        for (const item of res.data.list) {
          if (item.id === this.rowInfo.flowCardId) {
            this.crrentCode = item.code
            this.currentCardType = item.type
            this.currentCardName = item.name
            this.currentCraft = item.craftName
            this.currentCraftId = item.craftId
            this.currentRemark = item.remark
            this.currentStatus = item.status
            this.currentCreateTime = item.createTime
            this.currentUpdateTime = item.lastUpdateTime
            this.currentCreator = item.creator
            this.currentModifier = item.modifier
            break
          }
        }
      })
      this.getProceCodeModel(row.flowCardId)
      this.innerVisible = true
    },
    // 复制流程卡请求型号
    getProceCodeModel(id) {
      const requestParams = {
        id
      }
      fetchCardInfo(requestParams).then(res => {
        var arr = []
        res.data.modelList.map((item) => {
          if (item !== null) {
            arr.push({
              color: item.color,
              modelName: item.modelList
            })
          }
        })
        this.currentModelList = arr
        this.setCopyProce(res.data.processList)
      })
    },
    // 所有前段站点
    getForepartSiteList() {
      const requestParams = {
        type: 0,
        status: 0,
        pageSize: 1000,
        pageNum: 1
      }
      siteList(requestParams).then(res => {
        this.forepartSiteOptions = res.data.list
      })
    },
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
    }
  }
}

