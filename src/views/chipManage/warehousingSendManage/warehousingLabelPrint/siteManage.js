
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findDetail } from '@/api/chipManage/warehousingSendManage/mappingManage'
import { barCode } from '@/api/chipBasicInfoManage/grindInfo'
import { scanWafer } from '@/api/chipManage/warehousingSendManage/warehousingLabelManage'
import { findTaskModelList, findYgParamsList } from '@/api/chipBasicInfoManage/labelManage'
import { logFind, findColorList, findModelList, findSettList, xpWarehousLabel, scanLabelWafer, updateIsPrint, imgfindById, printLabelMapping, printMapping } from '@/api/chipManage/warehousingSendManage/warehousingLabelManage'
import Chart from '@/components/Charts'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd, Chart },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      deleteDialogVisible: false,
      searchDialogVisible: false,
      checkVisible: false,
      loading: false,
      isActive: 0,
      list: [],
      selects: '',
      selectOptions: [],
      beginDate: '',
      endDate: '',
      newModel: '',
      newcolor: '',
      detailList: [],
      currentId: 0,
      newName: '',
      list1: [],
      isRepeat: false,
      newFieldList: [],
      cowBaseList: [
        {
          thName: 'VF1',
          thKey: 'vf1'
        },
        {
          thName: 'VF2',
          thKey: 'vf2'
        },
        {
          thName: 'VF3',
          thKey: 'vf3'
        },
        {
          thName: 'VF4',
          thKey: 'vf4'
        },
        {
          thName: 'VFM1',
          thKey: 'vfm1'
        },
        {
          thName: 'VFM2',
          thKey: 'vfm2'
        },
        {
          thName: 'DVF',
          thKey: 'dvf'
        },
        {
          thName: 'VF',
          thKey: 'vf'
        },
        {
          thName: 'VFD',
          thKey: 'vfd'
        },
        {
          thName: 'IR',
          thKey: 'ir'
        },
        {
          thName: 'LOP1',
          thKey: 'lop1'
        },
        {
          thName: 'LOP2',
          thKey: 'lop2'
        },
        {
          thName: 'LOP3',
          thKey: 'lop3'
        },
        {
          thName: 'WLP1',
          thKey: 'wlp1'
        },
        {
          thName: 'WLD1',
          thKey: 'wld1'
        },
        {
          thName: 'WLC1',
          thKey: 'wlc1'
        },
        {
          thName: 'HW1',
          thKey: 'hw1'
        },
        {
          thName: 'PURITY1',
          thKey: 'purity1'
        },
        {
          thName: 'X1',
          thKey: 'x1'
        },
        {
          thName: 'Y1',
          thKey: 'y1'
        },
        {
          thName: 'Z1',
          thKey: 'z1'
        },
        {
          thName: 'CCT1',
          thKey: 'cct1'
        },
        {
          thName: 'ST1',
          thKey: 'st1'
        },
        {
          thName: 'INT1',
          thKey: 'int1'
        },
        {
          thName: 'WLP2',
          thKey: 'wlp2'
        },
        {
          thName: 'WLD2',
          thKey: 'wld2'
        },
        {
          thName: 'WLC2',
          thKey: 'wlc2'
        },
        {
          thName: 'HW2',
          thKey: 'hw2'
        },
        {
          thName: 'PURITY2',
          thKey: 'purity2'
        },
        {
          thName: 'X2',
          thKey: 'x2'
        },
        {
          thName: 'Y2',
          thKey: 'y2'
        },
        {
          thName: 'Z2',
          thKey: 'z2'
        },
        {
          thName: 'CCT2',
          thKey: 'cct2'
        },
        {
          thName: 'ST2',
          thKey: 'st2'
        },
        {
          thName: 'INT2',
          thKey: 'int2'
        },
        {
          thName: 'WLP3',
          thKey: 'wlp3'
        },
        {
          thName: 'WLD3',
          thKey: 'wld3'
        },
        {
          thName: 'WLC3',
          thKey: 'wlc3'
        },
        {
          thName: 'HW3',
          thKey: 'hw3'
        },
        {
          thName: 'PURITY3',
          thKey: 'purity3'
        },
        {
          thName: 'X3',
          thKey: 'x3'
        },
        {
          thName: 'Y3',
          thKey: 'y3'
        },
        {
          thName: 'Z3',
          thKey: 'z3'
        },
        {
          thName: 'CCT3',
          thKey: 'cct3'
        },
        {
          thName: 'ST3',
          thKey: 'st3'
        },
        {
          thName: 'INT3',
          thKey: 'int3'
        }
      ],
      colorList: ['#009494', '#1D89F3', '#F5A11B', '#2ECC71', '#7D1EA9', '#34495E', '#23C6C8', '#7A1057', '#E25D5D', '#6E7074', '#65A2A7', '#B0A5E0', '#A68C4C',
        '#3D46C1', '#F1D1AF', '#06366E', '#333333', '#788EE6', '#52F1E7', '#2688A6', '#FEF046', '#F5A1C1', '#718497', '#87CFDD', '#CFFE48', '#583A33', '#3DFF9D',
        '#2FCBEF', '#FF0000', '#24973E'],
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
      model: '',
      color: '',
      products: '',
      productsList: [],
      customerId: '',
      modelList: [],
      colorOptions: [],
      settingList: [],
      logList: [],
      setpageSize: 12,
      productList: [],
      setpageNum: 1,
      settotalPage: 0,
      logpageSize: 12,
      logpageNum: 1,
      logtotalPage: 0,
      printType: '1',
      type: '',
      waferNo: '',
      fileUrl: process.env.BASE_API + '/xpWarehousLabel/importExcel',
      typeList: [
        {
          id: 0,
          name: '单片打印'
        },
        {
          id: 1,
          name: '批量打印'
        }
      ],
      singleInfo: null,
      imgName: '',
      bachList: [],
      repeatwafers: [],
      yglist: [],
      ygid: '',
      printDate: '',
      productInfo: '',
      isshouyg: false
    }
  },
  mounted() {
    this.xpWarehousLabel()
  },
  methods: {
    beforeUpload(file) {
      this.loading = true
      const isLt2M = file.size / 1024 / 1024 < 1
      if (!isLt2M) {
        this.$message({
          message: '文件大小不能超过 1MB!',
          type: 'error'
        })
        this.loading = false
      }
      if (this.selects === '') {
        this.$message({
          type: 'error',
          message: '请选择打印标签!'
        })
        this.loading = false
        return false
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
        this.repeatwafers = []
        for (const lis of res.data) {
          if (lis.status === 1) {
            this.repeatwafers.push(lis.waferNo)
          }
        }
        if (this.repeatwafers.length > 0 && !this.isRepeat) {
          this.$confirm(this.repeatwafers.join() + '已重复打印，是否需要打印重复标签?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.isshouyg) {
              let code = ''
              for (const item of this.productsList) {
                if (item.modelId === this.products) {
                  code = item.modelName
                  break
                }
              }
              this.list = []
              for (const lis of res.data) {
                if (lis.waferNo.length > 6) {
                  const key = lis.waferNo.substring(5, 6)
                  if (key.indexOf('-') > -1) {
                    const key1 = lis.waferNo.substring(0, code.length)
                    if (key1 !== code) {
                      this.$message({
                        type: 'error',
                        message: lis.waferNo + '：此片不属于此光色型号，无法打印!'
                      })
                    } else {
                      this.list.push(lis)
                    }
                  } else {
                    const key1 = lis.waferNo.substring(1, code.length + 1)
                    if (key1 !== code) {
                      this.$message({
                        type: 'error',
                        message: lis.waferNo + '：此片不属于此光色型号，无法打印!'
                      })
                    } else {
                      this.list.push(lis)
                    }
                  }
                }
              }
            } else {
              this.list = res.data
            }
            let waferNos = ''
            for (const item of this.list) {
              if (item.isPrint === 1) {
                if (waferNos === '') {
                  waferNos = item.waferNo
                } else {
                  waferNos = waferNos + ',' + item.waferNo
                }
              }
            }
            if (waferNos.length > 0) {
              const params = {
                waferNo: waferNos
              }
              scanWafer(params).then(res => {
                this.batchPrint(res.data, 1)
                this.$message({
                  type: 'success',
                  message: '上传成功'
                })
                this.listLoading = false
              })
            }
          }).catch(() => {
            if (this.isshouyg) {
              let code = ''
              for (const item of this.productsList) {
                if (item.modelId === this.products) {
                  code = item.modelName
                  break
                }
              }
              this.list = []
              for (const lis of res.data) {
                if (lis.waferNo.length > 6 && lis.status !== 1) {
                  const key = lis.waferNo.substring(5, 6)
                  if (key.indexOf('-') > -1) {
                    const key1 = lis.waferNo.substring(0, code.length)
                    if (key1 !== code) {
                      this.$message({
                        type: 'error',
                        message: lis.waferNo + '：此片不属于此光色型号，无法打印!'
                      })
                    } else {
                      this.list.push(lis)
                    }
                  } else {
                    const key1 = lis.waferNo.substring(1, code.length + 1)
                    if (key1 !== code) {
                      this.$message({
                        type: 'error',
                        message: lis.waferNo + '：此片不属于此光色型号，无法打印!'
                      })
                    } else {
                      this.list.push(lis)
                    }
                  }
                }
              }
            } else {
              this.list = []
              for (const lis of res.data) {
                if (lis.status !== 1) {
                  this.list.push(lis)
                }
              }
            }
            let waferNos = ''
            for (const item of this.list) {
              if (item.isPrint === 1) {
                if (waferNos === '') {
                  waferNos = item.waferNo
                } else {
                  waferNos = waferNos + ',' + item.waferNo
                }
              }
            }
            if (waferNos.length > 0) {
              const params = {
                waferNo: waferNos
              }
              scanWafer(params).then(res => {
                this.batchPrint(res.data, 1)
                this.$message({
                  type: 'success',
                  message: '上传成功'
                })
                this.listLoading = false
              })
            }
          })
        } else {
          if (this.isshouyg) {
            let code = ''
            for (const item of this.productsList) {
              if (item.modelId === this.products) {
                code = item.modelName
                break
              }
            }
            this.list = []
            for (const lis of res.data) {
              if (lis.waferNo.length > 6) {
                const key = lis.waferNo.substring(5, 6)
                if (key.indexOf('-') > -1) {
                  const key1 = lis.waferNo.substring(0, code.length)
                  if (key1 !== code) {
                    this.$message({
                      type: 'error',
                      message: lis.waferNo + '：此片不属于此光色型号，无法打印!'
                    })
                  } else {
                    this.list.push(lis)
                  }
                } else {
                  const key1 = lis.waferNo.substring(1, code.length + 1)
                  if (key1 !== code) {
                    this.$message({
                      type: 'error',
                      message: lis.waferNo + '：此片不属于此光色型号，无法打印!'
                    })
                  } else {
                    this.list.push(lis)
                  }
                }
              }
            }
          } else {
            this.list = res.data
          }
          let waferNos = ''
          for (const item of this.list) {
            if (item.isPrint === 1) {
              if (waferNos === '') {
                waferNos = item.waferNo
              } else {
                waferNos = waferNos + ',' + item.waferNo
              }
            }
          }
          if (waferNos.length > 0) {
            const params = {
              waferNo: waferNos
            }
            scanWafer(params).then(res => {
              this.batchPrint(res.data, 1)
              this.$message({
                type: 'success',
                message: '上传成功'
              })
              this.listLoading = false
            })
          }
        }
      }
    },
    onError() {
      this.$message({
        type: 'error',
        message: '上传失败，请重试！'
      })
      this.loading = false
    },
    findModelList() {
      findModelList().then(res => {
        this.modelList = res.data.list
      })
    },
    findColorList() {
      findColorList().then(res => {
        this.colorList = res.data
      })
    },
    // 查询
    ygfind() {
      const params = {
        customerId: this.customerId
      }
      findTaskModelList(params).then(res => {
        this.productsList = res.data.data
      })
    },
    // 查询
    ygfinds() {
      this.ygid = ''
      const params = {
        customerId: this.customerId,
        modelId: this.products
      }
      findYgParamsList(params).then(res => {
        this.yglist = res.data.data
      })
    },
    deltetItem(index) {
      this.list.splice(index, 1)
    },
    xpWarehousLabel() {
      this.listLoading = true
      const params = {
        name: '',
        customer: ''
      }
      xpWarehousLabel(params).then(res => {
        this.selectOptions = res.data
        this.listLoading = false
      })
    },
    setttingPrint() {
      this.addDialogVisible = true
      this.productInfo = ''
      this.findSettList()
      this.findProduct()
      this.findModelList()
      this.findColorList()
    },
    findSettList() {
      const param = {
        pageSize: this.setpageSize,
        pageNum: this.setpageNum,
        model: this.model,
        color: this.color
      }
      findSettList(param).then(res => {
        this.settingList = res.data.list
        this.settingList = []
        for (let i = 0; i < res.data.list.length; i++) {
          if (res.data.list[i].isPrint === 1) {
            res.data.list[i].isChecked = true
          } else {
            res.data.list[i].isChecked = false
          }
          this.settingList.push(res.data.list[i])
        }
        this.settotalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    findProduct() {
      const param = {
        pageSize: 10000,
        pageNum: 1,
        model: '',
        color: ''
      }
      findSettList(param).then(res => {
        this.productList = []
        for (let i = 0; i < res.data.list.length; i++) {
          this.productList.push({
            name: res.data.list[i].name,
            id: i
          })
        }
      })
    },
    printSetSearch() {
      if (this.productInfo !== null && this.productInfo !== '') {
        const value = this.productInfo.split('-')
        this.model = value[1]
        this.color = value[0]
      } else {
        this.model = ''
        this.color = ''
      }
      this.setpageNum = 1
      this.findSettList()
    },
    printLogSearch() {
      this.logpageNum = 1
      this.logFind()
    },
    clearAllSet() {
      this.setpageNum = 1
      this.productInfo = ''
      this.model = ''
      this.color = ''
      this.findSettList()
    },
    // 时间戳转yyyy-mm-dd
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    clearAll() {
      this.logpageNum = 1
      this.beginDate = ''
      this.endDate = ''
      this.type = ''
      this.logFind()
    },
    logFind() {
      const param = {
        pageSize: this.logpageSize,
        pageNum: this.logpageNum,
        type: 0,
        labelName: this.type,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate)
      }
      logFind(param).then(res => {
        this.logList = res.data.list
        this.logtotalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    printLog() {
      this.deleteDialogVisible = true
      this.logFind()
    },
    // 每页数量改变
    setsizeChange(pageSize) {
      this.setpageSize = pageSize
      this.findSettList()
    },
    // 当前页数改变
    setcurrentChange(pageNum) {
      this.setpageNum = pageNum
      this.findSettList()
    },
    // 每页数量改变
    logsizeChange(pageSize) {
      this.logpageSize = pageSize
      this.logFind()
    },
    // 当前页数改变
    logcurrentChange(pageNum) {
      this.logpageNum = pageNum
      this.logFind()
    },
    // 查询
    fetchData() {
      if (this.selects === '') {
        this.$message({
          type: 'error',
          message: '请选择打印标签!'
        })
        return
      }
      if (this.isshouyg) {
        let code = ''
        for (const item of this.productsList) {
          if (item.modelId === this.products) {
            code = item.modelName
            break
          }
        }
        if (this.waferNo.length > 6) {
          const key = this.waferNo.substring(5, 6)
          if (key.indexOf('-') > -1) {
            const key1 = this.waferNo.substring(0, code.length)
            if (key1 !== code) {
              this.$message({
                type: 'error',
                message: '此片不属于此光色型号，无法打印!'
              })
              return
            }
          } else {
            const key1 = this.waferNo.substring(1, code.length + 1)
            if (key1 !== code) {
              this.$message({
                type: 'error',
                message: '此片不属于此光色型号，无法打印!'
              })
              return
            }
          }
        }
      }
      if (this.list.filter(item => { return item.waferNo === this.waferNo }).length > 0) {
        this.$message({
          type: 'error',
          message: '当前片号已存在!'
        })
        return false
      }
      this.listLoading = true
      const params = {
        waferNo: this.waferNo
      }
      scanLabelWafer(params).then(res => {
        if (res.data.length > 0) {
          if (res.data[0].status === 1 && !this.isRepeat) {
            this.$confirm('是否需要打印重复标签?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (res.data[0].isPrint === 1) {
                const params = {
                  waferNo: this.waferNo
                }
                scanWafer(params).then(res => {
                  if (res.data.length > 0) {
                    if (this.printType === '0') {
                      this.bachList = []
                    }
                    this.batchPrint(res.data, 0)
                  }
                })
              }
              this.waferNo = ''
              this.list.push(res.data[0])
              const _this = this
              setTimeout(function() {
                _this.$refs.newfac.bodyWrapper.scrollTop = _this.$refs.newfac.bodyWrapper.scrollHeight + 40
                _this.$refs.newfac.setCurrentRow(_this.list[_this.list.length - 1])
              }, 100)
            }).catch(() => {
              this.waferNo = ''
            })
          } else {
            if (res.data[0].isPrint === 1) {
              const params = {
                waferNo: this.waferNo
              }
              scanWafer(params).then(res => {
                if (res.data.length > 0) {
                  if (this.printType === '0') {
                    this.bachList = []
                  }
                  this.batchPrint(res.data, 0)
                }
              })
            }
            this.waferNo = ''
            this.list.push(res.data[0])
            const _this = this
            setTimeout(function() {
              _this.$refs.newfac.bodyWrapper.scrollTop = _this.$refs.newfac.bodyWrapper.scrollHeight + 40
              _this.$refs.newfac.setCurrentRow(_this.list[_this.list.length - 1])
            }, 100)
          }
        } else {
          this.$message({
            type: 'error',
            message: '此ID不存在，请检查后重试!'
          })
          this.waferNo = ''
        }
        this.listLoading = false
      })
    },
    navClick(type) {
      if (type === this.isActive) {
        return false
      }
      this.$confirm('此操作将清除已添加的列表, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.list = []
        this.isActive = type
      }).catch(() => {
      })
    },
    setStatus(row) {
      if (row.isChecked) {
        row.isPrint = 1
      } else {
        row.isPrint = 0
      }
      const requestParams = {
        id: row.id,
        isPrint: row.isPrint
      }
      updateIsPrint(requestParams).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.findSettList()
        }
      })
    },
    // 添加
    startPrints() {
      if (this.selects !== '') {
        for (const item of this.selectOptions) {
          if (this.selects === item.id) {
            this.products = ''
            this.ygid = ''
            this.customerId = item.customer
            if (item.customerName === '亿光') {
              this.isshouyg = true
              this.ygfind()
            } else {
              this.isshouyg = false
            }
            break
          }
        }
      }
    },
    // 添加
    startPrint() {
      if (this.selects !== '') {
        let imageId = 0
        for (const item of this.selectOptions) {
          if (this.selects === item.id) {
            imageId = item.imageId
            this.products = ''
            this.ygid = ''
            this.customerId = item.customer
            if (item.customerName === '亿光') {
              this.isshouyg = true
              this.ygfind()
            } else {
              this.isshouyg = false
            }
            break
          }
        }
        this.imgfindById(imageId)
      }
    },
    imgfindById(id) {
      imgfindById({ id: id }).then(res => {
        this.imgName = '/images/' + res.data.webPath
      })
    },
    // 添加
    handleEdit(row) {
      this.currentId = row.id
      this.newModel = row.model
      this.newcolor = row.color
      this.newName = row.name
      this.list1 = []
      this.findDetail(row.id)
      this.checkVisible = true
    },
    findDetail(id) {
      const params = {
        id: id
      }
      findDetail(params).then(res => {
        this.detailList = res.data
        this.list1 = []
        for (const value of this.detailList) {
          var dataList = []
          for (const li of value.colorList) {
            dataList.push({
              min: li.minval,
              max: li.maxval,
              color: li.color,
              showmin: li.viewMinval,
              showmax: li.viewMaxval
            })
          }
          this.list1.push({
            field: value.param,
            unit: value.unit,
            newDataList: dataList
          })
        }
        this.fieldChange()
      })
    },
    fieldChange() {
      this.newFieldList = []
      for (const field of this.cowBaseList) {
        field.disabled = false
        for (const item of this.list1) {
          if (item.field === field.thKey) {
            field.disabled = true
            break
          }
        }
        this.newFieldList.push(field)
      }
    },
    printStart() {
      if (this.selects === '') {
        this.$message({
          type: 'error',
          message: '请选择打印标签!'
        })
        return
      }
      if (this.ygid === '' && this.isshouyg) {
        this.$message({
          type: 'error',
          message: '请选择打印标签!'
        })
        return
      }
      if (this.printType === '0' && (this.singleInfo === null || this.singleInfo === undefined)) {
        this.$message({
          type: 'error',
          message: '请输入有效片号!'
        })
        return
      }
      if (this.printType === '1' && this.list.length === 0) {
        this.$message({
          type: 'error',
          message: '请添加打印列表!'
        })
        return
      }
      const params = {
        creator: sessionStorage.getItem('User-Id'),
        labelId: this.selects,
        type: 0,
        pnId: this.isshouyg ? this.ygid : null,
        wafers: [],
        way: this.printType
      }
      if (this.printType === '0') {
        params.wafers = [this.singleInfo]
      } else {
        params.wafers = this.list
      }
      printLabelMapping(params).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '提交成功!'
          })
          this.waferNo = ''
          this.singleInfo = null
          this.list = []
          if (res.data.length > 0) {
            this.printStarts(res.data)
          }
        }
      })
    },
    getCurrentTime() {
      var date = new Date()
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var day = date.getDate()
      var myddy = date.getDay()// 获取存储当前日期
      var weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      return year + '-' + month + '-' + day + ' ' + weekday[myddy]
    },
    printStarts(data) {
      this.$message({
        type: 'success',
        message: '准备打印!'
      })
      this.printDate = this.getCurrentTime()
      const params = {
        creator: sessionStorage.getItem('User-Id'),
        type: 1,
        wafers: data,
        way: this.printType
      }
      printMapping(params).then(res => {
        if (this.bachList.length > 0) {
          this.prints()
        }
      })
    },
    // 从小到大排序
    sortMintoMax(value) {
      const sort = value.sort(function(a, b) { return parseFloat(a) > parseFloat(b) ? 1 : -1 })
      const floatsort = {}
      for (let i = 0; i < sort.length; i++) {
        floatsort[sort[i]] = i
      }
      return floatsort
    },
    batchPrint(data, type) {
      if (type === 1) {
        this.bachList = []
      }
      const wafers = []
      for (const item of data) {
        wafers.push(item.waferNo)
      }
      barCode(wafers).then(res => {
        for (let i = 0; i < data.length; i++) {
          const tableList = data[i].tableList
          const options = []
          const keys = Object.keys(data[i])
          let x = 0
          for (const keyitem of keys) {
            if (keyitem !== 'tableList' && keyitem !== 'waferNo' && keyitem !== 'model') {
              var option = {
                title: {
                  text: 'VF1(V)',
                  left: 'center'
                },
                tooltip: { show: false },
                xAxis: {
                  type: 'category',
                  show: false,
                  data: [],
                  splitArea: {
                    show: false
                  }
                },
                grid: {
                  left: 0,
                  right: 100,
                  bottom: '10%',
                  top: 20,
                  containLabel: true
                },
                visualMap: {
                  type: 'piecewise',
                  orient: 'vertical',
                  left: 'right',
                  top: 'middle',
                  itemWidth: 6,
                  itemHeight: 10,
                  textGap: 5,
                  itemGap: 5,
                  pieces: [],
                  textStyle: {
                    color: '#000'
                  }
                },
                yAxis: {
                  type: 'category',
                  show: false,
                  data: [],
                  splitArea: {
                    show: false
                  }
                },
                series: [{
                  type: 'heatmap',
                  data: [],
                  label: {
                    normal: {
                      show: false
                    }
                  },
                  itemStyle: {
                    borderWidth: 1,
                    borderColor: '#ccc'
                  }
                }]
              }
              option.title.text = keyitem.toUpperCase()
              const itemx = {}
              const itemy = {}
              // 遍历x，y有多少点
              for (const item of data[i][keyitem].dataList) {
                itemx[item.x] = 1
                itemy[item.y] = 1
              }
              const data1 = []
              const siece1 = []
              // 获取x，y位置
              const xsort = this.sortMintoMax(Object.keys(itemx))
              const ysort = this.sortMintoMax(Object.keys(itemy))
              for (const item of data[i][keyitem].dataList) {
                const data = [xsort[item.x], ysort[item.y], item.v]
                data1.push(data)
              }
              for (const item of data[i][keyitem].sieceList) {
                const siece = { min: parseFloat(item.min), max: parseFloat(item.max), label: parseFloat(item.max) + ' ' + parseFloat(item.count) + '%', color: item.color }
                // const siece = { min: parseFloat(item.min), max: parseFloat(item.max), label: parseFloat(item.min) + '-' + parseFloat(item.max) + ' ' + parseFloat(item.count) + '%', color: item.color }
                siece1.push(siece)
              }
              option.xAxis.data = Object.keys(itemx)
              option.yAxis.data = Object.keys(itemy)
              option.visualMap.pieces = siece1
              option.series[0].data = data1
              options.push({ option: option, image: '', index: x })
              x = x + 1
            }
          }
          this.bachList.push({
            tableList: tableList,
            options: options,
            waferNo: data[i].waferNo,
            imglist: res.data[i],
            model: data[i].model,
            index: i
          })
        }
      })
      // var _this = this
      // setTimeout(function() {
      //   _this.prints()
      // }, 1000)
    },
    prints() {
      var _this = this
      for (const item of this.bachList) {
        for (const it of item.options) {
          const canvas1 = document.getElementById('focharts' + it.index + item.index).getElementsByTagName('canvas')[0]
          it.image = canvas1.toDataURL('image/png')
        }
      }
      setTimeout(function() {
        _this.$print(_this.$refs.prints)
        setTimeout(function() {
          for (const item of _this.bachList) {
            for (const it of item.options) {
              it.image = ''
            }
          }
        }, 3000)
      }, 1000)
    },
    searchImg() {
      if (this.selects !== '') {
        let imageId = 0
        for (const item of this.selectOptions) {
          if (this.selects === item.id) {
            imageId = item.imageId
            break
          }
        }
        this.imgfindById(imageId)
        this.searchDialogVisible = true
      } else {
        this.$message({
          message: '请选择打印标签!',
          type: 'error'
        })
      }
    }
  }
}

