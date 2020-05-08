
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { barCode } from '@/api/chipBasicInfoManage/grindInfo'
import { scanWafer, logFind, printMapping } from '@/api/chipManage/warehousingSendManage/warehousingLabelManage'
import Chart from '@/components/Charts'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd, Chart },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      deleteDialogVisible: false,
      loading: false,
      activeTabIndex: 0,
      list: [],
      selectOptions: [],
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
      settingList: [],
      logList: [],
      logpageSize: 12,
      logpageNum: 1,
      logtotalPage: 0,
      printType: '1',
      type: '',
      printDate: '',
      keys: [],
      option1: {
        title: {
          text: 'VF1(V)',
          left: 'center'
        },
        tooltip: {
          show: false
        },
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
      },
      option2: {
        title: {
          text: 'VF1(V)',
          left: 'center'
        },
        tooltip: {
          show: false
        },
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
      },
      option3: {
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
      },
      option4: {
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
      },
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
      waferNo: '',
      image1: '',
      image2: '',
      image3: '',
      image4: '',
      singleInfo: null,
      fileUrl: process.env.BASE_API + '/xpWarehousLabel/importExcel',
      tableList: [],
      bachList: [],
      imglist: '',
      isActive: 0,
      isRepeat: false,
      model: ''
    }
  },
  mounted() {
    this.printDate = this.getCurrentTime()
  },
  methods: {
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
        this.list = res.data
        let waferNos = ''
        for (const item of this.list) {
          if (waferNos === '') {
            waferNos = item.waferNo
          } else {
            waferNos = waferNos + ',' + item.waferNo
          }
        }
        const params = {
          waferNo: waferNos
        }
        scanWafer(params).then(res => {
          this.batchPrint(res.data)
          this.$message({
            type: 'success',
            message: '上传成功'
          })
          this.listLoading = false
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
    getCurrentTime() {
      var date = new Date()
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var day = date.getDate()
      var myddy = date.getDay()// 获取存储当前日期
      var weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      return year + '-' + month + '-' + day + ' ' + weekday[myddy]
    },
    printLog() {
      this.deleteDialogVisible = true
      this.logFind()
    },
    clearAll() {
      this.logpageNum = 1
      this.beginDate = ''
      this.endDate = ''
      this.type = ''
      this.logFind()
    },
    printLogSearch() {
      this.logpageNum = 1
      this.logFind()
    },
    // 时间戳转yyyy-mm-dd
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    logFind() {
      const param = {
        pageSize: this.logpageSize,
        pageNum: this.logpageNum,
        type: 1,
        way: this.type,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate)
      }
      logFind(param).then(res => {
        this.logList = res.data.list
        this.logtotalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    prints() {
      var _this = this
      if (this.printType === '0') {
        const canvas1 = document.getElementById('firstChart').getElementsByTagName('canvas')[0]
        this.image1 = canvas1.toDataURL('image/png')
        const canvas2 = document.getElementById('secondChart').getElementsByTagName('canvas')[0]
        this.image2 = canvas2.toDataURL('image/png')
        const canvas3 = document.getElementById('thirdChart').getElementsByTagName('canvas')[0]
        this.image3 = canvas3.toDataURL('image/png')
        const canvas4 = document.getElementById('forthChart').getElementsByTagName('canvas')[0]
        this.image4 = canvas4.toDataURL('image/png')
        setTimeout(function() {
          _this.$print(_this.$refs.print)
          setTimeout(function() {
            _this.image1 = ''
            _this.image2 = ''
            _this.image3 = ''
            _this.image4 = ''
          }, 3000)
        }, 1000)
      } else {
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
      }
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
      scanWafer(params).then(res => {
        this.list.push(res.data[0])
        this.batchPrint(this.list)
        this.listLoading = false
        this.waferNo = ''
      }, () => {
        this.waferNo = ''
        this.listLoading = false
      })
    },
    // 添加
    handleAdd() {
      this.machineForm.code = ''
      this.machineForm.name = ''
      this.machineForm.remark = ''
      this.addDialogVisible = true
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    // 取消
    resetForm(formName) {
      this.addDialogVisible = false
      this.$refs[formName].resetFields()
    },
    deltetItem(index) {
      this.list.splice(index, 1)
      this.bachList.splice(index, 1)
    },
    printStart() {
      if (this.printType === '0' && this.tableList.length === 0) {
        if (this.waferNo !== '') {
          this.fetchData()
          var _this = this
          setTimeout(function() {
            if (_this.waferNo !== '') {
              _this.printStart()
            }
          }, 1000)
          return
        } else {
          this.$message({
            type: 'error',
            message: '请输入片号!'
          })
          return
        }
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
        type: 1,
        wafers: [],
        way: this.printType
      }
      if (this.printType === '0') {
        params.wafers = [this.singleInfo]
      } else {
        params.wafers = this.list
      }
      printMapping(params).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '准备打印!'
          })
          this.prints()
          // if (this.printType === '0') {
          //   this.prints()
          // } else {
          //   this.batchPrint(res.data)
          // }
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
    batchPrint(data) {
      this.bachList = []
      const wafers = []
      for (const item of data) {
        wafers.push(item.waferNo)
      }
      barCode(wafers).then(res => {
        console.log(data)
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
                  right: 150,
                  bottom: '10%',
                  top: 20,
                  containLabel: true
                },
                visualMap: {
                  type: 'piecewise',
                  orient: 'vertical',
                  left: 'right',
                  top: 'middle',
                  pieces: [],
                  itemWidth: 6,
                  itemHeight: 10,
                  textGap: 5,
                  itemGap: 5,
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
              let unit = ''
              for (const item of tableList) {
                if (item.item === keyitem) {
                  unit = item.unit
                  break
                }
              }
              option.title.text = keyitem.toUpperCase() + '(' + unit + ')'
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
                // const siece = { min: parseFloat(item.min), max: parseFloat(item.max), label: parseFloat(item.min) + '-' + parseFloat(item.max) + ' ' + parseFloat(item.count) + '%', color: item.color }
                const siece = { min: parseFloat(item.min), max: parseFloat(item.max), label: parseFloat(item.max) + ' ' + parseFloat(item.count) + '%', color: item.color }
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
        console.log(this.bachList)
      })
      // var _this = this
      // setTimeout(function() {
      //   _this.prints()
      // }, 1000)
    }
  }
}
