
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findModelList, findColorList, findGYList, findList, disableEnable, deletes, save, findDetail, findHistory, findCheckNorm } from '@/api/chipBasicInfoManage/bin'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  directives: {
    'el-loadmore': {
      bind(el, binding) {
        // 获取element-ui定义好的scroll盒子editsubmitForm
        const SELECTWRAP_DOM = el.querySelector('.el-table__body-wrapper')
        SELECTWRAP_DOM.addEventListener('scroll', function() {
          /**
          * scrollHeight 获取元素内容高度(只读)
          * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
          * clientHeight 读取元素的可见高度(只读)
          * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
          * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
          */
          const condition = this.scrollHeight - this.scrollTop - 5 <= this.clientHeight
          if (condition) {
            binding.value(1)
          } else if (this.scrollTop === 0) {
            console.log(2)
            // binding.value(2)
          }
        })
      }
    }
  },
  data() {
    return {
      listLoading: false,
      loading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      historyDialogVisible: false,
      list: [],
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
      fileUrl: process.env.BASE_API + '/xpBinNorm/importExcel',
      model: '',
      color: '',
      gy: '',
      newmodel: '',
      newcolor: '',
      newname: '',
      newcolor1: '',
      newmodel1: '',
      newgy: '',
      remark: '',
      gyList: '',
      newvsersion: '',
      modelList: [],
      colorList: [],
      historyList: [],
      isDisable: 0,
      disableList: [
        {
          id: 1,
          name: '禁用'
        },
        {
          id: 0,
          name: '启用'
        }
      ],
      typeList: [
        {
          id: 0,
          name: '正常'
        },
        {
          id: 1,
          name: '专案'
        },
        {
          id: 2,
          name: '混合'
        },
        {
          id: 3,
          name: '坏点'
        },
        {
          id: 5,
          name: 'AOI'
        },
        {
          id: 4,
          name: '不良'
        }
      ],
      showCheckList: [],
      binKey: [],
      clickId: -1,
      setDisable: false,
      selectVisible: false,
      hisName: '',
      allIndex: 0,
      allList: [],
      rowInfo: null,
      getset: '',
      setlists1: [],
      checkKeyObj: {}
    }
  },
  mounted() {
    this.fetchData()
    this.findModelList()
    this.findColorList()
    this.findGYList()
  },
  methods: {
    loadmores(type) {
      console.log(type)
      // const index = this.allIndex + 10
      // if (this.allList.length >= index) {
      //   this.allIndex = this.allIndex + 10
      //   this.setShowList()
      // } else if (this.allIndex !== this.allList.length) {
      //   this.allIndex = this.allList.length
      //   this.setShowList()
      // }
    },
    beforeUpload(file) {
      this.loading = true
      if (this.newmodel === '') {
        this.$message({
          type: 'error',
          message: '请选择型号!'
        })
        this.loading = false
        return false
      }
      if (this.newcolor === '') {
        this.$message({
          type: 'error',
          message: '请选择光色!'
        })
        this.loading = false
        return false
      }
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
        this.showCheckList = []
        this.allList = []
        this.allIndex = 0
        if (res.data.length > 10) {
          this.allIndex = 10
        } else {
          this.allIndex = res.data.length
        }
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].level = i + 1
          if (res.data[i].type === '正常') {
            res.data[i].typeName = '正常'
            res.data[i].type = 0
          } else if (res.data[i].type === '专案') {
            res.data[i].typeName = '专案'
            res.data[i].type = 1
          } else if (res.data[i].type === '混合') {
            res.data[i].typeName = '混合'
            res.data[i].type = 2
          } else if (res.data[i].type === '坏点') {
            res.data[i].typeName = '坏点'
            res.data[i].type = 3
          } else if (res.data[i].type === 'AOI') {
            res.data[i].typeName = 'AOI'
            res.data[i].type = 5
          } else if (res.data[i].type === '不良') {
            res.data[i].typeName = '不良'
            res.data[i].type = 4
          }
          this.allList.push(res.data[i])
          // if (this.allIndex > i) {
          this.showCheckList.push(res.data[i])
          // }
        }
        // if (this.showCheckList.length > 10) {
        //   this.allIndex = 10
        // } else {
        //   this.allIndex = this.showCheckList.length
        // }
        const binKey = Object.keys(res.data[0])
        for (let i = 0; i < binKey.length; i++) {
          if (binKey[i] !== 'level') {
            this.binKey.push(binKey[i])
          }
        }
        this.$message({
          type: 'success',
          message: '上传成功'
        })
      }
    },
    getNewType(level) {
      if (this.showCheckList[level - 1].type === 0) {
        this.showCheckList[level - 1].typeName = '正常'
      } else if (this.showCheckList[level - 1].type === 1) {
        this.showCheckList[level - 1].typeName = '专案'
      } else if (this.showCheckList[level - 1].type === 2) {
        this.showCheckList[level - 1].typeName = '混合'
      } else if (this.showCheckList[level - 1].type === 3) {
        this.showCheckList[level - 1].typeName = '坏点'
      } else if (this.showCheckList[level - 1].type === 5) {
        this.showCheckList[level - 1].typeName = 'AOI'
      } else if (this.showCheckList[level - 1].type === 4) {
        this.showCheckList[level - 1].typeName = '不良'
      }
    },
    onError() {
      this.$message({
        type: 'error',
        message: '上传失败，请重试！'
      })
      this.loading = false
    },
    tableRowClassColor({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return 'background: #fff'
      } else if (columnIndex === 1) {
        if (this.checkKeyObj['vf1Min'] !== undefined && this.checkKeyObj['vf1Min'] !== null) {
          if (this.checkKeyObj['vf1Min'].val1 !== null && (row.type === 0 || row.type === 2)) {
            if (row.vf1Min < this.checkKeyObj['vf1Min'].val1 || row.vf1Min > this.checkKeyObj['vf1Min'].val2) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['vf1Min'].val3 !== null && this.checkKeyObj['vf1Min'].val1 !== null && row.type === 1) {
            if ((row.vf1Min >= this.checkKeyObj['vf1Min'].val3 && row.vf1Min <= this.checkKeyObj['vf1Min'].val1) || (row.vf1Min >= this.checkKeyObj['vf1Min'].val2 && row.vf1Min <= this.checkKeyObj['vf1Min'].val4)) {
              return ''
            } else {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['vf1Min'].val3 !== null && row.type === 3) {
            if (row.vf1Min < this.checkKeyObj['vf1Min'].val3 || row.vf1Min > this.checkKeyObj['vf1Min'].val4) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          }
        }
      } else if (columnIndex === 2) {
        if (this.checkKeyObj['vf1Max'] !== undefined && this.checkKeyObj['vf1Max'] !== null) {
          if (this.checkKeyObj['vf1Max'].val1 !== null && (row.type === 0 || row.type === 2)) {
            if (row.vf1Max < this.checkKeyObj['vf1Max'].val1 || row.vf1Max > this.checkKeyObj['vf1Max'].val2) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['vf1Max'].val3 !== null && this.checkKeyObj['vf1Max'].val1 !== null && row.type === 1) {
            if ((row.vf1Max >= this.checkKeyObj['vf1Max'].val3 && row.vf1Max <= this.checkKeyObj['vf1Max'].val1) || (row.vf1Max >= this.checkKeyObj['vf1Max'].val2 && row.vf1Max <= this.checkKeyObj['vf1Max'].val4)) {
              return ''
            } else {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['vf1Max'].val3 !== null && row.type === 3) {
            if (row.vf1Max < this.checkKeyObj['vf1Max'].val3 || row.vf1Max > this.checkKeyObj['vf1Max'].val4) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          }
        }
      } else if (columnIndex === 3) {
        if (this.checkKeyObj['vf2Min'] !== undefined && this.checkKeyObj['vf2Min'] !== null) {
          if (this.checkKeyObj['vf2Min'].val1 !== null && (row.type === 0 || row.type === 2)) {
            if (row.vf2Min < this.checkKeyObj['vf2Min'].val1 || row.vf2Min > this.checkKeyObj['vf2Min'].val2) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['vf2Min'].val3 !== null && this.checkKeyObj['vf2Min'].val1 !== null && row.type === 1) {
            if ((row.vf2Min >= this.checkKeyObj['vf2Min'].val3 && row.vf2Min <= this.checkKeyObj['vf2Min'].val1) || (row.vf2Min >= this.checkKeyObj['vf2Min'].val2 && row.vf2Min <= this.checkKeyObj['vf2Min'].val4)) {
              return ''
            } else {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['vf2Min'].val3 !== null && row.type === 3) {
            if (row.vf2Min < this.checkKeyObj['vf2Min'].val3 || row.vf2Min > this.checkKeyObj['vf2Min'].val4) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          }
        }
      } else if (columnIndex === 4) {
        if (this.checkKeyObj['vf2Max'] !== undefined && this.checkKeyObj['vf2Max'] !== null) {
          if (this.checkKeyObj['vf2Max'].val1 !== null && (row.type === 0 || row.type === 2)) {
            if (row.vf2Max < this.checkKeyObj['vf2Max'].val1 || row.vf2Max > this.checkKeyObj['vf2Max'].val2) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['vf2Max'].val3 !== null && this.checkKeyObj['vf2Max'].val1 !== null && row.type === 1) {
            if ((row.vf2Max >= this.checkKeyObj['vf2Max'].val3 && row.vf2Max <= this.checkKeyObj['vf2Max'].val1) || (row.vf2Max >= this.checkKeyObj['vf2Max'].val2 && row.vf2Max <= this.checkKeyObj['vf2Max'].val4)) {
              return ''
            } else {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['vf2Max'].val3 !== null && row.type === 3) {
            if (row.vf2Max < this.checkKeyObj['vf2Max'].val3 || row.vf2Max > this.checkKeyObj['vf2Max'].val4) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          }
        }
      } else if (columnIndex === 5) {
        if (this.checkKeyObj['vf3Min'] !== undefined && this.checkKeyObj['vf3Min'] !== null) {
          if (this.checkKeyObj['vf3Min'].val1 !== null && (row.type === 0 || row.type === 2)) {
            if (row.vf3Min < this.checkKeyObj['vf3Min'].val1 || row.vf3Min > this.checkKeyObj['vf3Min'].val2) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['vf3Min'].val3 !== null && this.checkKeyObj['vf3Min'].val1 !== null && row.type === 1) {
            if ((row.vf3Min >= this.checkKeyObj['vf3Min'].val3 && row.vf3Min <= this.checkKeyObj['vf3Min'].val1) || (row.vf3Min >= this.checkKeyObj['vf3Min'].val2 && row.vf3Min <= this.checkKeyObj['vf3Min'].val4)) {
              return ''
            } else {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['vf3Min'].val3 !== null && row.type === 3) {
            if (row.vf3Min < this.checkKeyObj['vf3Min'].val3 || row.vf3Min > this.checkKeyObj['vf3Min'].val4) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          }
        }
      } else if (columnIndex === 6) {
        if (this.checkKeyObj['vf3Max'] !== undefined && this.checkKeyObj['vf3Max'] !== null) {
          if (this.checkKeyObj['vf3Max'].val1 !== null && (row.type === 0 || row.type === 2)) {
            if (row.vf3Max < this.checkKeyObj['vf3Max'].val1 || row.vf3Max > this.checkKeyObj['vf3Max'].val2) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['vf3Max'].val3 !== null && this.checkKeyObj['vf3Max'].val1 !== null && row.type === 1) {
            if ((row.vf3Max >= this.checkKeyObj['vf3Max'].val3 && row.vf3Max <= this.checkKeyObj['vf3Max'].val1) || (row.vf3Max >= this.checkKeyObj['vf3Max'].val2 && row.vf3Max <= this.checkKeyObj['vf3Max'].val4)) {
              return ''
            } else {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['vf3Max'].val3 !== null && row.type === 3) {
            if (row.vf3Max < this.checkKeyObj['vf3Max'].val3 || row.vf3Max > this.checkKeyObj['vf3Max'].val4) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          }
        }
      } else if (columnIndex === 7) {
        if (this.checkKeyObj['vf4Min'] !== undefined && this.checkKeyObj['vf4Min'] !== null) {
          if (this.checkKeyObj['vf4Min'].val1 !== null && (row.type === 0 || row.type === 2)) {
            if (row.vf4Min < this.checkKeyObj['vf4Min'].val1 || row.vf4Min > this.checkKeyObj['vf4Min'].val2) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['vf4Min'].val3 !== null && this.checkKeyObj['vf4Min'].val1 !== null && row.type === 1) {
            if ((row.vf4Min >= this.checkKeyObj['vf4Min'].val3 && row.vf4Min <= this.checkKeyObj['vf4Min'].val1) || (row.vf4Min >= this.checkKeyObj['vf4Min'].val2 && row.vf4Min <= this.checkKeyObj['vf4Min'].val4)) {
              return ''
            } else {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['vf4Min'].val3 !== null && row.type === 3) {
            if (row.vf4Min < this.checkKeyObj['vf4Min'].val3 || row.vf4Min > this.checkKeyObj['vf4Min'].val4) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          }
        }
      } else if (columnIndex === 8) {
        if (this.checkKeyObj['vf4Max'] !== undefined && this.checkKeyObj['vf4Max'] !== null) {
          if (this.checkKeyObj['vf4Max'].val1 !== null && (row.type === 0 || row.type === 2)) {
            if (row.vf4Max < this.checkKeyObj['vf4Max'].val1 || row.vf4Max > this.checkKeyObj['vf4Max'].val2) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['vf4Max'].val3 !== null && this.checkKeyObj['vf4Max'].val1 !== null && row.type === 1) {
            if ((row.vf4Max >= this.checkKeyObj['vf4Max'].val3 && row.vf4Max <= this.checkKeyObj['vf4Max'].val1) || (row.vf4Max >= this.checkKeyObj['vf4Max'].val2 && row.vf4Max <= this.checkKeyObj['vf4Max'].val4)) {
              return ''
            } else {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['vf4Max'].val3 !== null && row.type === 3) {
            if (row.vf4Max < this.checkKeyObj['vf4Max'].val3 || row.vf4Max > this.checkKeyObj['vf4Max'].val4) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          }
        }
      } else if (columnIndex === 9) {
        if (this.checkKeyObj['vfdMin'] !== undefined && this.checkKeyObj['vfdMin'] !== null) {
          if (this.checkKeyObj['vfdMin'].val1 !== null && (row.type === 0 || row.type === 2)) {
            if (row.vfdMin < this.checkKeyObj['vfdMin'].val1 || row.vfdMin > this.checkKeyObj['vfdMin'].val2) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['vfdMin'].val3 !== null && this.checkKeyObj['vfdMin'].val1 !== null && row.type === 1) {
            if ((row.vfdMin >= this.checkKeyObj['vfdMin'].val3 && row.vfdMin <= this.checkKeyObj['vfdMin'].val1) || (row.vfdMin >= this.checkKeyObj['vfdMin'].val2 && row.vfdMin <= this.checkKeyObj['vfdMin'].val4)) {
              return ''
            } else {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['vfdMin'].val3 !== null && row.type === 3) {
            if (row.vfdMin < this.checkKeyObj['vfdMin'].val3 || row.vfdMin > this.checkKeyObj['vfdMin'].val4) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          }
        }
      } else if (columnIndex === 10) {
        if (this.checkKeyObj['vfdMax'] !== undefined && this.checkKeyObj['vfdMax'] !== null) {
          if (this.checkKeyObj['vfdMax'].val1 !== null && (row.type === 0 || row.type === 2)) {
            if (row.vfdMax < this.checkKeyObj['vfdMax'].val1 || row.vfdMax > this.checkKeyObj['vfdMax'].val2) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['vfdMax'].val3 !== null && this.checkKeyObj['vfdMax'].val1 !== null && row.type === 1) {
            if ((row.vfdMax >= this.checkKeyObj['vfdMax'].val3 && row.vfdMax <= this.checkKeyObj['vfdMax'].val1) || (row.vfdMax >= this.checkKeyObj['vfdMax'].val2 && row.vfdMax <= this.checkKeyObj['vfdMax'].val4)) {
              return ''
            } else {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['vfdMax'].val3 !== null && row.type === 3) {
            if (row.vfdMax < this.checkKeyObj['vfdMax'].val3 || row.vfdMax > this.checkKeyObj['vfdMax'].val4) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          }
        }
      } else if (columnIndex === 11) {
        if (this.checkKeyObj['vzMin'] !== undefined && this.checkKeyObj['vzMin'] !== null) {
          if (this.checkKeyObj['vzMin'].val1 !== null && (row.type === 0 || row.type === 2)) {
            if (row.vzMin < this.checkKeyObj['vzMin'].val1 || row.vzMin > this.checkKeyObj['vzMin'].val2) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['vzMin'].val3 !== null && this.checkKeyObj['vzMin'].val1 !== null && row.type === 1) {
            if ((row.vzMin >= this.checkKeyObj['vzMin'].val3 && row.vzMin <= this.checkKeyObj['vzMin'].val1) || (row.vzMin >= this.checkKeyObj['vzMin'].val2 && row.vzMin <= this.checkKeyObj['vzMin'].val4)) {
              return ''
            } else {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['vzMin'].val3 !== null && row.type === 3) {
            if (row.vzMin < this.checkKeyObj['vzMin'].val3 || row.vzMin > this.checkKeyObj['vzMin'].val4) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          }
        }
      } else if (columnIndex === 12) {
        if (this.checkKeyObj['vzMax'] !== undefined && this.checkKeyObj['vzMax'] !== null) {
          if (this.checkKeyObj['vzMax'].val1 !== null && (row.type === 0 || row.type === 2)) {
            if (row.vzMax < this.checkKeyObj['vzMax'].val1 || row.vzMax > this.checkKeyObj['vzMax'].val2) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['vzMax'].val3 !== null && this.checkKeyObj['vzMax'].val1 !== null && row.type === 1) {
            if ((row.vzMax >= this.checkKeyObj['vzMax'].val3 && row.vzMax <= this.checkKeyObj['vzMax'].val1) || (row.vzMax >= this.checkKeyObj['vzMax'].val2 && row.vzMax <= this.checkKeyObj['vzMax'].val4)) {
              return ''
            } else {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['vzMax'].val3 !== null && row.type === 3) {
            if (row.vzMax < this.checkKeyObj['vzMax'].val3 || row.vzMax > this.checkKeyObj['vzMax'].val4) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          }
        }
      } else if (columnIndex === 13) {
        if (this.checkKeyObj['irMin'] !== undefined && this.checkKeyObj['irMin'] !== null) {
          if (this.checkKeyObj['irMin'].val1 !== null && (row.type === 0 || row.type === 2)) {
            if (row.irMin < this.checkKeyObj['irMin'].val1 || row.irMin > this.checkKeyObj['irMin'].val2) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['irMin'].val3 !== null && this.checkKeyObj['irMin'].val1 !== null && row.type === 1) {
            if ((row.irMin >= this.checkKeyObj['irMin'].val3 && row.irMin <= this.checkKeyObj['irMin'].val1) || (row.irMin >= this.checkKeyObj['irMin'].val2 && row.irMin <= this.checkKeyObj['irMin'].val4)) {
              return ''
            } else {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['irMin'].val3 !== null && row.type === 3) {
            if (row.irMin < this.checkKeyObj['irMin'].val3 || row.irMin > this.checkKeyObj['irMin'].val4) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          }
        }
      } else if (columnIndex === 14) {
        if (this.checkKeyObj['irMax'] !== undefined && this.checkKeyObj['irMax'] !== null) {
          if (this.checkKeyObj['irMax'].val1 !== null && (row.type === 0 || row.type === 2)) {
            if (row.irMax < this.checkKeyObj['irMax'].val1 || row.irMax > this.checkKeyObj['irMax'].val2) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['irMax'].val3 !== null && this.checkKeyObj['irMax'].val1 !== null && row.type === 1) {
            if ((row.irMax >= this.checkKeyObj['irMax'].val3 && row.irMax <= this.checkKeyObj['irMax'].val1) || (row.irMax >= this.checkKeyObj['irMax'].val2 && row.vfdMin <= this.checkKeyObj['irMax'].val4)) {
              return ''
            } else {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['irMax'].val3 !== null && row.type === 3) {
            if (row.irMax < this.checkKeyObj['irMax'].val3 || row.irMax > this.checkKeyObj['irMax'].val4) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          }
        }
      } else if (columnIndex === 15) {
        if (this.checkKeyObj['iresdMin'] !== undefined && this.checkKeyObj['iresdMin'] !== null) {
          if (this.checkKeyObj['iresdMin'].val1 !== null && (row.type === 0 || row.type === 2)) {
            if (row.iresdMin < this.checkKeyObj['iresdMin'].val1 || row.iresdMin > this.checkKeyObj['iresdMin'].val2) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['iresdMin'].val3 !== null && this.checkKeyObj['iresdMin'].val1 !== null && row.type === 1) {
            if ((row.iresdMin >= this.checkKeyObj['iresdMin'].val3 && row.iresdMin <= this.checkKeyObj['iresdMin'].val1) || (row.iresdMin >= this.checkKeyObj['iresdMin'].val2 && row.iresdMin <= this.checkKeyObj['iresdMin'].val4)) {
              return ''
            } else {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['iresdMin'].val3 !== null && row.type === 3) {
            if (row.iresdMin < this.checkKeyObj['iresdMin'].val3 || row.iresdMin > this.checkKeyObj['iresdMin'].val4) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          }
        }
      } else if (columnIndex === 16) {
        if (this.checkKeyObj['iresdMax'] !== undefined && this.checkKeyObj['iresdMax'] !== null) {
          if (this.checkKeyObj['iresdMax'].val1 !== null && (row.type === 0 || row.type === 2)) {
            if (row.iresdMax < this.checkKeyObj['iresdMax'].val1 || row.iresdMax > this.checkKeyObj['iresdMax'].val2) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['iresdMax'].val3 !== null && this.checkKeyObj['iresdMax'].val1 !== null && row.type === 1) {
            if ((row.iresdMax >= this.checkKeyObj['iresdMax'].val3 && row.iresdMax <= this.checkKeyObj['iresdMax'].val1) || (row.iresdMax >= this.checkKeyObj['iresdMax'].val2 && row.iresdMax <= this.checkKeyObj['iresdMax'].val4)) {
              return ''
            } else {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['iresdMax'].val3 !== null && row.type === 3) {
            if (row.iresdMax < this.checkKeyObj['iresdMax'].val3 || row.iresdMax > this.checkKeyObj['iresdMax'].val4) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          }
        }
      } else if (columnIndex === 17) {
        if (this.checkKeyObj['lopMin'] !== undefined && this.checkKeyObj['lopMin'] !== null) {
          if (this.checkKeyObj['lopMin'].val1 !== null && (row.type === 0 || row.type === 2)) {
            if (row.lopMin < this.checkKeyObj['lopMin'].val1 || row.lopMin > this.checkKeyObj['lopMin'].val2) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['lopMin'].val3 !== null && this.checkKeyObj['lopMin'].val1 !== null && row.type === 1) {
            if ((row.lopMin >= this.checkKeyObj['lopMin'].val3 && row.lopMin <= this.checkKeyObj['lopMin'].val1) || (row.lopMin >= this.checkKeyObj['lopMin'].val2 && row.lopMin <= this.checkKeyObj['lopMin'].val4)) {
              return ''
            } else {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['lopMin'].val3 !== null && row.type === 3) {
            if (row.lopMin < this.checkKeyObj['lopMin'].val3 || row.lopMin > this.checkKeyObj['lopMin'].val4) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          }
        }
      } else if (columnIndex === 18) {
        if (this.checkKeyObj['lopMax'] !== undefined && this.checkKeyObj['lopMax'] !== null) {
          if (this.checkKeyObj['lopMax'].val1 !== null && (row.type === 0 || row.type === 2)) {
            if (row.lopMax < this.checkKeyObj['lopMax'].val1 || row.lopMax > this.checkKeyObj['lopMax'].val2) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['lopMax'].val3 !== null && this.checkKeyObj['lopMax'].val1 !== null && row.type === 1) {
            if ((row.lopMax >= this.checkKeyObj['lopMax'].val3 && row.lopMax <= this.checkKeyObj['lopMax'].val1) || (row.lopMax >= this.checkKeyObj['lopMax'].val2 && row.lopMax <= this.checkKeyObj['lopMax'].val4)) {
              return ''
            } else {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['lopMax'].val3 !== null && row.type === 3) {
            if (row.lopMax < this.checkKeyObj['lopMax'].val3 || row.lopMax > this.checkKeyObj['lopMax'].val4) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          }
        }
      } else if (columnIndex === 19) {
        if (this.checkKeyObj['wldMin'] !== undefined && this.checkKeyObj['wldMin'] !== null) {
          if (this.checkKeyObj['wldMin'].val1 !== null && (row.type === 0 || row.type === 2)) {
            if (row.wldMin < this.checkKeyObj['wldMin'].val1 || row.wldMin > this.checkKeyObj['wldMin'].val2) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['wldMin'].val3 !== null && this.checkKeyObj['wldMin'].val1 !== null && row.type === 1) {
            if ((row.wldMin >= this.checkKeyObj['wldMin'].val3 && row.wldMin <= this.checkKeyObj['wldMin'].val1) || (row.wldMin >= this.checkKeyObj['wldMin'].val2 && row.wldMin <= this.checkKeyObj['wldMin'].val4)) {
              return ''
            } else {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['wldMin'].val3 !== null && row.type === 3) {
            if (row.wldMin < this.checkKeyObj['wldMin'].val3 || row.wldMin > this.checkKeyObj['wldMin'].val4) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          }
        }
      } else if (columnIndex === 20) {
        if (this.checkKeyObj['wldMax'] !== undefined && this.checkKeyObj['wldMax'] !== null) {
          if (this.checkKeyObj['wldMax'].val1 !== null && (row.type === 0 || row.type === 2)) {
            if (row.wldMax < this.checkKeyObj['wldMax'].val1 || row.wldMax > this.checkKeyObj['wldMax'].val2) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['wldMax'].val3 !== null && this.checkKeyObj['wldMax'].val1 !== null && row.type === 1) {
            if ((row.wldMax >= this.checkKeyObj['wldMax'].val3 && row.wldMax <= this.checkKeyObj['wldMax'].val1) || (row.wldMax >= this.checkKeyObj['wldMax'].val2 && row.wldMax <= this.checkKeyObj['wldMax'].val4)) {
              return ''
            } else {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['wldMax'].val3 !== null && row.type === 3) {
            if (row.wldMax < this.checkKeyObj['wldMax'].val3 || row.wldMax > this.checkKeyObj['wldMax'].val4) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          }
        }
      } else if (columnIndex === 21) {
        if (this.checkKeyObj['bsMin'] !== undefined && this.checkKeyObj['bsMin'] !== null) {
          if (this.checkKeyObj['bsMin'].val1 !== null && (row.type === 0 || row.type === 2)) {
            if (row.bsMin < this.checkKeyObj['bsMin'].val1 || row.bsMin > this.checkKeyObj['bsMin'].val2) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['bsMin'].val3 !== null && this.checkKeyObj['bsMin'].val1 !== null && row.type === 1) {
            if ((row.bsMin >= this.checkKeyObj['bsMin'].val3 && row.bsMin <= this.checkKeyObj['bsMin'].val1) || (row.bsMin >= this.checkKeyObj['bsMin'].val2 && row.bsMin <= this.checkKeyObj['bsMin'].val4)) {
              return ''
            } else {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['bsMin'].val3 !== null && row.type === 3) {
            if (row.bsMin < this.checkKeyObj['bsMin'].val3 || row.bsMin > this.checkKeyObj['bsMin'].val4) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          }
        }
      } else if (columnIndex === 22) {
        if (this.checkKeyObj['bsMax'] !== undefined && this.checkKeyObj['bsMax'] !== null) {
          if (this.checkKeyObj['bsMax'].val1 !== null && (row.type === 0 || row.type === 2)) {
            if (row.bsMax < this.checkKeyObj['bsMax'].val1 || row.bsMax > this.checkKeyObj['bsMax'].val2) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['bsMax'].val3 !== null && this.checkKeyObj['bsMax'].val1 !== null && row.type === 1) {
            if ((row.bsMax >= this.checkKeyObj['bsMax'].val3 && row.bsMax <= this.checkKeyObj['bsMax'].val1) || (row.bsMax >= this.checkKeyObj['bsMax'].val2 && row.bsMax <= this.checkKeyObj['bsMax'].val4)) {
              return ''
            } else {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['bsMax'].val3 !== null && row.type === 3) {
            if (row.bsMax < this.checkKeyObj['bsMax'].val3 || row.bsMax > this.checkKeyObj['bsMax'].val4) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          }
        }
      } else if (columnIndex === 23) {
        if (this.checkKeyObj['dvfMin'] !== undefined && this.checkKeyObj['dvfMin'] !== null) {
          if (this.checkKeyObj['dvfMin'].val1 !== null && (row.type === 0 || row.type === 2)) {
            if (row.dvfMin < this.checkKeyObj['dvfMin'].val1 || row.dvfMin > this.checkKeyObj['dvfMin'].val2) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['dvfMin'].val3 !== null && this.checkKeyObj['dvfMin'].val1 !== null && row.type === 1) {
            if ((row.dvfMin >= this.checkKeyObj['dvfMin'].val3 && row.dvfMin <= this.checkKeyObj['dvfMin'].val1) || (row.dvfMin >= this.checkKeyObj['dvfMin'].val2 && row.dvfMin <= this.checkKeyObj['dvfMin'].val4)) {
              return ''
            } else {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['dvfMin'].val3 !== null && row.type === 3) {
            if (row.dvfMin < this.checkKeyObj['dvfMin'].val3 || row.dvfMin > this.checkKeyObj['dvfMin'].val4) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          }
        }
      } else if (columnIndex === 24) {
        if (this.checkKeyObj['dvfMax'] !== undefined && this.checkKeyObj['dvfMax'] !== null) {
          if (this.checkKeyObj['dvfMax'].val1 !== null && (row.type === 0 || row.type === 2)) {
            if (row.dvfMax < this.checkKeyObj['dvfMax'].val1 || row.dvfMax > this.checkKeyObj['dvfMax'].val2) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['dvfMax'].val3 !== null && this.checkKeyObj['dvfMax'].val1 !== null && row.type === 1) {
            if ((row.dvfMax >= this.checkKeyObj['dvfMax'].val3 && row.dvfMax <= this.checkKeyObj['dvfMax'].val1) || (row.dvfMax >= this.checkKeyObj['dvfMax'].val2 && row.dvfMax <= this.checkKeyObj['dvfMax'].val4)) {
              return ''
            } else {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['dvfMax'].val3 !== null && row.type === 3) {
            if (row.dvfMax < this.checkKeyObj['dvfMax'].val3 || row.dvfMax > this.checkKeyObj['dvfMax'].val4) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          }
        }
      } else if (columnIndex === 25) {
        if (this.checkKeyObj['hwMin'] !== undefined && this.checkKeyObj['hwMin'] !== null) {
          if (this.checkKeyObj['hwMin'].val1 !== null && (row.type === 0 || row.type === 2)) {
            if (row.hwMin < this.checkKeyObj['hwMin'].val1 || row.hwMin > this.checkKeyObj['hwMin'].val2) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['hwMin'].val3 !== null && this.checkKeyObj['hwMin'].val1 !== null && row.type === 1) {
            if ((row.hwMin >= this.checkKeyObj['hwMin'].val3 && row.hwMin <= this.checkKeyObj['hwMin'].val1) || (row.hwMin >= this.checkKeyObj['hwMin'].val2 && row.hwMin <= this.checkKeyObj['hwMin'].val4)) {
              return ''
            } else {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['hwMin'].val3 !== null && row.type === 3) {
            if (row.hwMin < this.checkKeyObj['hwMin'].val3 || row.hwMin > this.checkKeyObj['hwMin'].val4) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          }
        }
      } else if (columnIndex === 26) {
        if (this.checkKeyObj['hwMax'] !== undefined && this.checkKeyObj['hwMax'] !== null) {
          if (this.checkKeyObj['hwMax'].val1 !== null && (row.type === 0 || row.type === 2)) {
            if (row.hwMax < this.checkKeyObj['hwMax'].val1 || row.hwMax > this.checkKeyObj['hwMax'].val2) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['hwMax'].val3 !== null && this.checkKeyObj['hwMax'].val1 !== null && row.type === 1) {
            if ((row.hwMax >= this.checkKeyObj['hwMax'].val3 && row.hwMax <= this.checkKeyObj['hwMax'].val1) || (row.hwMax >= this.checkKeyObj['hwMax'].val2 && row.hwMax <= this.checkKeyObj['hwMax'].val4)) {
              return ''
            } else {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['hwMax'].val3 !== null && row.type === 3) {
            if (row.hwMax < this.checkKeyObj['hwMax'].val3 || row.hwMax > this.checkKeyObj['hwMax'].val4) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          }
        }
      } else if (columnIndex === 27) {
        if (this.checkKeyObj['wlpMin'] !== undefined && this.checkKeyObj['wlpMin'] !== null) {
          if (this.checkKeyObj['wlpMin'].val1 !== null && (row.type === 0 || row.type === 2)) {
            if (row.wlpMin < this.checkKeyObj['wlpMin'].val1 || row.wlpMin > this.checkKeyObj['wlpMin'].val2) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['wlpMin'].val3 !== null && this.checkKeyObj['wlpMin'].val1 !== null && row.type === 1) {
            if ((row.wlpMin >= this.checkKeyObj['wlpMin'].val3 && row.wlpMin <= this.checkKeyObj['wlpMin'].val1) || (row.wlpMin >= this.checkKeyObj['wlpMin'].val2 && row.wlpMin <= this.checkKeyObj['wlpMin'].val4)) {
              return ''
            } else {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['wlpMin'].val3 !== null && row.type === 3) {
            if (row.wlpMin < this.checkKeyObj['wlpMin'].val3 || row.wlpMin > this.checkKeyObj['wlpMin'].val4) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          }
        }
      } else if (columnIndex === 28) {
        if (this.checkKeyObj['wlpMax'] !== undefined && this.checkKeyObj['wlpMax'] !== null) {
          if (this.checkKeyObj['wlpMax'].val1 !== null && (row.type === 0 || row.type === 2)) {
            if (row.wlpMax < this.checkKeyObj['wlpMax'].val1 || row.wlpMax > this.checkKeyObj['wlpMax'].val2) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['wlpMax'].val3 !== null && this.checkKeyObj['wlpMax'].val1 !== null && row.type === 1) {
            if ((row.wlpMax >= this.checkKeyObj['wlpMax'].val3 && row.wlpMax <= this.checkKeyObj['wlpMax'].val1) || (row.wlpMax >= this.checkKeyObj['wlpMax'].val2 && row.wlpMax <= this.checkKeyObj['wlpMax'].val4)) {
              return ''
            } else {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['wlpMax'].val3 !== null && row.type === 3) {
            if (row.wlpMax < this.checkKeyObj['wlpMax'].val3 || row.wlpMax > this.checkKeyObj['wlpMax'].val4) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          }
        }
      } else if (columnIndex === 29) {
        if (this.checkKeyObj['wldWlpMin'] !== undefined && this.checkKeyObj['wldWlpMin'] !== null) {
          if (this.checkKeyObj['wldWlpMin'].val1 !== null && (row.type === 0 || row.type === 2)) {
            if (row.wldWlpMin < this.checkKeyObj['wldWlpMin'].val1 || row.wldWlpMin > this.checkKeyObj['wldWlpMin'].val2) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['wldWlpMin'].val3 !== null && this.checkKeyObj['wldWlpMin'].val1 !== null && row.type === 1) {
            if ((row.wldWlpMin >= this.checkKeyObj['wldWlpMin'].val3 && row.wldWlpMin <= this.checkKeyObj['wldWlpMin'].val1) || (row.wldWlpMin >= this.checkKeyObj['wldWlpMin'].val2 && row.wldWlpMin <= this.checkKeyObj['wldWlpMin'].val4)) {
              return ''
            } else {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['wldWlpMin'].val3 !== null && row.type === 3) {
            if (row.wldWlpMin < this.checkKeyObj['wldWlpMin'].val3 || row.wldWlpMin > this.checkKeyObj['wldWlpMin'].val4) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          }
        }
      } else if (columnIndex === 30) {
        if (this.checkKeyObj['wldWlpMax'] !== undefined && this.checkKeyObj['wldWlpMax'] !== null) {
          if (this.checkKeyObj['wldWlpMax'].val1 !== null && (row.type === 0 || row.type === 2)) {
            if (row.wldWlpMax < this.checkKeyObj['wldWlpMax'].val1 || row.wldWlpMax > this.checkKeyObj['wldWlpMax'].val2) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['wldWlpMax'].val3 !== null && this.checkKeyObj['wldWlpMax'].val1 !== null && row.type === 1) {
            if ((row.wldWlpMax >= this.checkKeyObj['wldWlpMax'].val3 && row.wldWlpMax <= this.checkKeyObj['wldWlpMax'].val1) || (row.wldWlpMax >= this.checkKeyObj['wldWlpMax'].val2 && row.wldWlpMax <= this.checkKeyObj['wldWlpMax'].val4)) {
              return ''
            } else {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          } else if (this.checkKeyObj['wldWlpMax'].val3 !== null && row.type === 3) {
            if (row.wldWlpMax < this.checkKeyObj['wldWlpMax'].val3 || row.wldWlpMax > this.checkKeyObj['wldWlpMax'].val4) {
              return {
                background: '#E35C5C',
                color: '#fff'
              }
            }
          }
        }
      }
    },
    findCheckNorm() {
      const param = {
        model: this.newmodel,
        color: this.newcolor
      }
      findCheckNorm(param).then(res => {
        this.checkKeyObj = {}
        for (const item of res.data) {
          this.checkKeyObj[item.field + 'Min'] = item
          this.checkKeyObj[item.field + 'Max'] = item
        }
      })
    },
    clearAll() {
      this.pageNum = 1
      this.beginDate = ''
      this.endDate = ''
      this.model = ''
      this.color = ''
      this.gy = ''
      this.isDisable = 0
      this.fetchData()
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
    findGYList() {
      findGYList().then(res => {
        this.gyList = res.data.list
      })
    },
    handleCurrentChange(row) {
      if (row !== null) {
        this.currentId = row.id
        this.findDetail()
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
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate),
        model: this.model,
        color: this.color,
        craft: this.gy,
        status: this.isDisable,
        type: 0
      }
      findList(params).then(res => {
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
    },
    handleSearch() {
      this.pageNum = 1
      this.fetchData()
    },
    setStatus(row) {
      if (row.isChecked) {
        this.$confirm('确定启用?', '提示', {
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
        this.$confirm('确定弃用?', '提示', {
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
    setStatushis(row) {
      if (row.isChecked) {
        this.$confirm('确定启用?', '提示', {
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
            this.loadHistory()
            this.fetchData()
          })
        }, () => {
          row.isChecked = false
        })
      } else {
        this.$confirm('确定弃用?', '提示', {
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
            this.loadHistory()
            this.fetchData()
          })
        }, () => {
          row.isChecked = true
        })
      }
    },
    // 添加
    handleAdd() {
      this.setDisable = false
      this.showCheckList = []
      this.binKey = []
      this.clickId = -1
      this.newmodel = ''
      this.newcolor = ''
      this.newcolor1 = ''
      this.newmodel1 = ''
      this.newname = ''
      this.newgy = ''
      this.remark = ''
      this.newvsersion = '001'
      this.allList = []
      this.findModelList()
      this.findColorList()
      this.findGYList()
      this.addDialogVisible = true
    },
    openchenck() {
      this.getset = ''
      this.setlists1 = []
      const params = {
        pageNum: 1,
        pageSize: 100000,
        type: 0,
        status: 0
      }
      findList(params).then(res => {
        this.setlists1 = res.data.list
        this.selectVisible = true
      })
    },
    handleAdds() {
      if (this.getset === '') {
        this.$message({
          type: 'error',
          message: '请选择参照!'
        })
        return
      }
      this.selectVisible = false
      this.allList = []
      this.binKey = []
      this.listLoading = true
      const param = {
        id: this.getset
      }
      this.allIndex = 0
      findDetail(param).then(res => {
        this.showCheckList = []
        if (res.data.length > 0) {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].level = i + 1
            if (res.data[i].type === 0) {
              res.data[i].typeName = '正常'
            } else if (res.data[i].type === 1) {
              res.data[i].typeName = '专案'
            } else if (res.data[i].type === 2) {
              res.data[i].typeName = '混合'
            } else if (res.data[i].type === 3) {
              res.data[i].typeName = '坏点'
            } else if (res.data[i].type === 5) {
              res.data[i].typeName = 'AOI'
            } else if (res.data[i].type === 4) {
              res.data[i].typeName = '不良'
            }
            this.allList.push(res.data[i])
            this.showCheckList.push(res.data[i])
            // if (this.allIndex > i) {
            //   this.showCheckList.push(res.data[i])
            // }
          }
          const binKey = Object.keys(res.data[0])
          for (let i = 0; i < binKey.length; i++) {
            if (binKey[i] !== 'level' && binKey[i] !== 'id') {
              this.binKey.push(binKey[i])
            }
          }
        }
        this.listLoading = false
      })
    },
    handleCurrentChanges(row) {
      if (row === null) {
        return
      }
      this.rowInfo = row
    },
    // 修改
    handleEdit(row) {
      this.editDialogVisible = true
      this.setDisable = false
      this.currentId = row.id
      // this.showCheckList = []
      this.binKey = []
      this.clickId = -1
      this.newmodel = row.model
      this.newcolor = row.color
      this.newname = row.name
      this.newgy = row.craft
      this.remark = row.remark
      this.newvsersion = row.version
      this.findCheckNorm()
      this.findModelList()
      this.findColorList()
      this.findGYList()
      this.findDetail()
    },
    findDetail() {
      // this.showCheckList = []
      this.allList = []
      this.binKey = []
      this.listLoading = true
      const param = {
        id: this.currentId
      }
      this.allIndex = 0
      findDetail(param).then(res => {
        this.showCheckList = []
        if (res.data.length > 0) {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].level = i + 1
            if (res.data[i].type === 0) {
              res.data[i].typeName = '正常'
            } else if (res.data[i].type === 1) {
              res.data[i].typeName = '专案'
            } else if (res.data[i].type === 2) {
              res.data[i].typeName = '混合'
            } else if (res.data[i].type === 3) {
              res.data[i].typeName = '坏点'
            } else if (res.data[i].type === 5) {
              res.data[i].typeName = 'AOI'
            } else if (res.data[i].type === 4) {
              res.data[i].typeName = '不良'
            }
            this.allList.push(res.data[i])
            this.showCheckList.push(res.data[i])
            // if (this.allIndex > i) {
            //   this.showCheckList.push(res.data[i])
            // }
          }
          const binKey = Object.keys(res.data[0])
          for (let i = 0; i < binKey.length; i++) {
            if (binKey[i] !== 'level' && binKey[i] !== 'id') {
              this.binKey.push(binKey[i])
            }
          }
        }
        this.listLoading = false
      })
    },
    setShowList() {
      if (this.allIndex > this.showCheckList.length) {
        for (let i = this.showCheckList.length; i < this.allIndex; i++) {
          this.showCheckList.push(this.allList[i])
        }
      }
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    // 历史版本
    handleHistory(row) {
      this.currentId = row.id
      this.hisName = row.name
      this.loadHistory()
      this.historyDialogVisible = true
    },
    loadHistory() {
      const param = {
        name: this.hisName,
        type: 0
      }
      findHistory(param).then(res => {
        this.historyList = []
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].status === 0) {
            res.data[i].isChecked = true
          } else {
            res.data[i].isChecked = false
          }
          this.historyList.push(res.data[i])
        }
        if (this.historyList.length > 0) {
          this.$refs.history.setCurrentRow(this.historyList[0])
        }
      })
    },
    getNewName() {
      if (this.showCheckList.length > 0 && (this.newmodel !== this.newmodel1 || this.newcolor !== this.newcolor1)) {
        this.$confirm('切换光色或型号将清空导入列表, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.showCheckList = []
          if (this.newmodel !== '' && this.newcolor !== '') {
            if (this.newgy !== '') {
              this.newname = this.newcolor + this.newmodel + this.newgy
            }
            this.findCheckNorm()
          }
          this.newmodel1 = this.newmodel
          this.newcolor1 = this.newcolor
        }, () => {
          this.newmodel = this.newmodel1
          this.newcolor = this.newcolor1
          if (this.newmodel !== '' && this.newcolor !== '') {
            if (this.newgy !== '') {
              this.newname = this.newcolor + this.newmodel + this.newgy
            }
            this.findCheckNorm()
          }
        })
      } else {
        if (this.newmodel !== '' && this.newcolor !== '') {
          if (this.newgy !== '') {
            this.newname = this.newcolor + this.newmodel + this.newgy
          }
          this.findCheckNorm()
        }
        this.newmodel1 = this.newmodel
        this.newcolor1 = this.newcolor
      }
    },
    cellDblclick(row, column, cell, event) {
      console.log(this.showCheckList[0])
      console.log(this.allList[0])
      this.clickId = row.level
    },
    // 添加提交
    submitForm(formName) {
      if (this.newmodel === '') {
        this.$message({
          type: 'error',
          message: '请选择型号!'
        })
        return
      }
      if (this.newcolor === '') {
        this.$message({
          type: 'error',
          message: '请选择光色!'
        })
        return
      }
      if (this.newgy === '') {
        this.$message({
          type: 'error',
          message: '请选择工艺!'
        })
        return
      }
      if (this.showCheckList.length === 0) {
        this.$message({
          type: 'error',
          message: '请导入Bin!'
        })
        return
      }
      this.setDisable = true
      let flag = true
      for (const info of this.showCheckList) {
        for (const item of this.binKey) {
          const str = info[item] + ''
          if (parseFloat(info[item]) + '' !== str && item !== 'typeName' && item !== 'name' && item !== 'version' && item !== 'binNormId') {
            flag = false
            break
          }
        }
        if (flag) {
          if (this.checkKeyObj['vf1Min'] !== undefined) {
            if (this.checkKeyObj['vf1Min'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.vf1Min < this.checkKeyObj['vf1Min'].val1 || info.vf1Min > this.checkKeyObj['vf1Min'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vf1Min'].val1 !== null && this.checkKeyObj['vf1Min'].val3 !== null && info.type === 1) {
              if ((info.vf1Min >= this.checkKeyObj['vf1Min'].val3 && info.vf1Min <= this.checkKeyObj['vf1Min'].val1) || (info.vf1Min >= this.checkKeyObj['vf1Min'].val2 && info.vf1Min <= this.checkKeyObj['vf1Min'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vf1Min'].val3 !== null && info.type === 3) {
              if (info.vf1Min < this.checkKeyObj['vf1Min'].val3 || info.vf1Min > this.checkKeyObj['vf1Min'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['vf1Max'] !== undefined) {
            if (this.checkKeyObj['vf1Max'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.vf1Max < this.checkKeyObj['vf1Max'].val1 || info.vf1Max > this.checkKeyObj['vf1Max'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vf1Max'].val1 !== null && this.checkKeyObj['vf1Max'].val3 !== null && info.type === 1) {
              if ((info.vf1Max >= this.checkKeyObj['vf1Max'].val3 && info.vf1Max <= this.checkKeyObj['vf1Max'].val1) || (info.vf1Max >= this.checkKeyObj['vf1Max'].val2 && info.vf1Max <= this.checkKeyObj['vf1Max'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vf1Max'].val3 !== null && info.type === 3) {
              if (info.vf1Max < this.checkKeyObj['vf1Max'].val3 || info.vf1Max > this.checkKeyObj['vf1Max'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['vf2Min'] !== undefined) {
            if (this.checkKeyObj['vf2Min'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.vf2Min < this.checkKeyObj['vf2Min'].val1 || info.vf2Min > this.checkKeyObj['vf2Min'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vf2Min'].val1 !== null && this.checkKeyObj['vf2Min'].val3 !== null && info.type === 1) {
              if ((info.vf2Min >= this.checkKeyObj['vf2Min'].val3 && info.vf2Min <= this.checkKeyObj['vf2Min'].val1) || (info.vf2Min >= this.checkKeyObj['vf2Min'].val2 && info.vf2Min <= this.checkKeyObj['vf2Min'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vf2Min'].val3 !== null && info.type === 3) {
              if (info.vf2Min < this.checkKeyObj['vf2Min'].val3 || info.vf2Min > this.checkKeyObj['vf2Min'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['vf2Max'] !== undefined) {
            if (this.checkKeyObj['vf2Max'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.vf2Max < this.checkKeyObj['vf2Max'].val1 || info.vf2Max > this.checkKeyObj['vf2Max'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vf2Max'].val1 !== null && this.checkKeyObj['vf2Max'].val3 !== null && info.type === 1) {
              if ((info.vf2Max >= this.checkKeyObj['vf2Max'].val3 && info.vf2Max <= this.checkKeyObj['vf2Max'].val1) || (info.vf2Max >= this.checkKeyObj['vf2Max'].val2 && info.vf2Max <= this.checkKeyObj['vf2Max'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vf2Max'].val3 !== null && info.type === 3) {
              if (info.vf2Max < this.checkKeyObj['vf2Max'].val3 || info.vf2Max > this.checkKeyObj['vf2Max'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['vf3Min'] !== undefined) {
            if (this.checkKeyObj['vf3Min'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.vf3Min < this.checkKeyObj['vf3Min'].val1 || info.vf3Min > this.checkKeyObj['vf3Min'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vf3Min'].val1 !== null && this.checkKeyObj['vf3Min'].val3 !== null && info.type === 1) {
              if ((info.vf3Min >= this.checkKeyObj['vf3Min'].val3 && info.vf3Min <= this.checkKeyObj['vf3Min'].val1) || (info.vf3Min >= this.checkKeyObj['vf3Min'].val2 && info.vf3Min <= this.checkKeyObj['vf3Min'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vf3Min'].val3 !== null && info.type === 3) {
              if (info.vf3Min < this.checkKeyObj['vf3Min'].val3 || info.vf3Min > this.checkKeyObj['vf3Min'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['vf3Max'] !== undefined) {
            if (this.checkKeyObj['vf3Max'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.vf3Max < this.checkKeyObj['vf3Max'].val1 || info.vf3Max > this.checkKeyObj['vf3Max'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vf3Max'].val1 !== null && this.checkKeyObj['vf3Max'].val3 !== null && info.type === 1) {
              if ((info.vf3Max >= this.checkKeyObj['vf3Max'].val3 && info.vf3Max <= this.checkKeyObj['vf3Max'].val1) || (info.vf3Max >= this.checkKeyObj['vf3Max'].val2 && info.vf3Max <= this.checkKeyObj['vf3Max'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vf3Max'].val3 !== null && info.type === 3) {
              if (info.vf3Max < this.checkKeyObj['vf3Max'].val3 || info.vf3Max > this.checkKeyObj['vf3Max'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['vf4Min'] !== undefined) {
            if (this.checkKeyObj['vf4Min'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.vf4Min < this.checkKeyObj['vf4Min'].val1 || info.vf4Min > this.checkKeyObj['vf4Min'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vf4Min'].val1 !== null && this.checkKeyObj['vf4Min'].val3 !== null && info.type === 1) {
              if ((info.vf4Min >= this.checkKeyObj['vf4Min'].val3 && info.vf4Min <= this.checkKeyObj['vf4Min'].val1) || (info.vf4Min >= this.checkKeyObj['vf4Min'].val2 && info.vf4Min <= this.checkKeyObj['vf4Min'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vf4Min'].val3 !== null && info.type === 3) {
              if (info.vf4Min < this.checkKeyObj['vf4Min'].val3 || info.vf4Min > this.checkKeyObj['vf4Min'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['vf4Max'] !== undefined) {
            if (this.checkKeyObj['vf4Max'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.vf4Max < this.checkKeyObj['vf4Max'].val1 || info.vf4Max > this.checkKeyObj['vf4Max'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vf4Max'].val1 !== null && this.checkKeyObj['vf4Max'].val3 !== null && info.type === 1) {
              if ((info.vf4Max >= this.checkKeyObj['vf4Max'].val3 && info.vf4Max <= this.checkKeyObj['vf4Max'].val1) || (info.vf4Max >= this.checkKeyObj['vf4Max'].val2 && info.vf4Max <= this.checkKeyObj['vf4Max'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vf4Max'].val3 !== null && info.type === 3) {
              if (info.vf4Max < this.checkKeyObj['vf4Max'].val3 || info.vf4Max > this.checkKeyObj['vf4Max'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['vfdMin'] !== undefined) {
            if (this.checkKeyObj['vfdMin'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.vfdMin < this.checkKeyObj['vfdMin'].val1 || info.vfdMin > this.checkKeyObj['vfdMin'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vfdMin'].val1 !== null && this.checkKeyObj['vfdMin'].val3 !== null && info.type === 1) {
              if ((info.vfdMin >= this.checkKeyObj['vfdMin'].val3 && info.vfdMin <= this.checkKeyObj['vfdMin'].val1) || (info.vfdMin >= this.checkKeyObj['vfdMin'].val2 && info.vfdMin <= this.checkKeyObj['vfdMin'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vfdMin'].val3 !== null && info.type === 3) {
              if (info.vfdMin < this.checkKeyObj['vfdMin'].val3 || info.vfdMin > this.checkKeyObj['vfdMin'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['vfdMax'] !== undefined) {
            if (this.checkKeyObj['vfdMax'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.vfdMax < this.checkKeyObj['vfdMax'].val1 || info.vfdMax > this.checkKeyObj['vfdMax'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vfdMax'].val1 !== null && this.checkKeyObj['vfdMax'].val3 !== null && info.type === 1) {
              if ((info.vfdMax >= this.checkKeyObj['vfdMax'].val3 && info.vfdMax <= this.checkKeyObj['vfdMax'].val1) || (info.vfdMax >= this.checkKeyObj['vfdMax'].val2 && info.vfdMax <= this.checkKeyObj['vfdMax'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vfdMax'].val3 !== null && info.type === 3) {
              if (info.vfdMax < this.checkKeyObj['vfdMax'].val3 || info.vfdMax > this.checkKeyObj['vfdMax'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['vzMin'] !== undefined) {
            if (this.checkKeyObj['vzMin'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.vzMin < this.checkKeyObj['vzMin'].val1 || info.vzMin > this.checkKeyObj['vzMin'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vzMin'].val1 !== null && this.checkKeyObj['vzMin'].val3 !== null && info.type === 1) {
              if ((info.vzMin >= this.checkKeyObj['vzMin'].val3 && info.vzMin <= this.checkKeyObj['vzMin'].val1) || (info.vzMin >= this.checkKeyObj['vzMin'].val2 && info.vzMin <= this.checkKeyObj['vzMin'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vzMin'].val3 !== null && info.type === 3) {
              if (info.vzMin < this.checkKeyObj['vzMin'].val3 || info.vzMin > this.checkKeyObj['vzMin'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['vzMax'] !== undefined) {
            if (this.checkKeyObj['vzMax'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.vzMax < this.checkKeyObj['vzMax'].val1 || info.vzMax > this.checkKeyObj['vzMax'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vzMax'].val1 !== null && this.checkKeyObj['vzMax'].val3 !== null && info.type === 1) {
              if ((info.vzMax >= this.checkKeyObj['vzMax'].val3 && info.vzMax <= this.checkKeyObj['vzMax'].val1) || (info.vzMax >= this.checkKeyObj['vzMax'].val2 && info.vzMax <= this.checkKeyObj['vzMax'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vzMax'].val3 !== null && info.type === 3) {
              if (info.vzMax < this.checkKeyObj['vzMax'].val3 || info.vzMax > this.checkKeyObj['vzMax'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['irMin'] !== undefined) {
            if (this.checkKeyObj['irMin'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.irMin < this.checkKeyObj['irMin'].val1 || info.irMin > this.checkKeyObj['irMin'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['irMin'].val1 !== null && this.checkKeyObj['irMin'].val3 !== null && info.type === 1) {
              if ((info.irMin >= this.checkKeyObj['irMin'].val3 && info.irMin <= this.checkKeyObj['irMin'].val1) || (info.irMin >= this.checkKeyObj['irMin'].val2 && info.irMin <= this.checkKeyObj['irMin'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['irMin'].val3 !== null && info.type === 3) {
              if (info.irMin < this.checkKeyObj['irMin'].val3 || info.irMin > this.checkKeyObj['irMin'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['irMax'] !== undefined) {
            if (this.checkKeyObj['irMax'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.irMax < this.checkKeyObj['irMax'].val1 || info.irMax > this.checkKeyObj['irMax'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['irMax'].val1 !== null && this.checkKeyObj['irMax'].val3 !== null && info.type === 1) {
              if ((info.irMax >= this.checkKeyObj['irMax'].val3 && info.irMax <= this.checkKeyObj['irMax'].val1) || (info.irMax >= this.checkKeyObj['irMax'].val2 && info.irMax <= this.checkKeyObj['irMax'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['irMax'].val3 !== null && info.type === 3) {
              if (info.irMax < this.checkKeyObj['irMax'].val3 || info.irMax > this.checkKeyObj['irMax'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['iresdaMin'] !== undefined) {
            if (this.checkKeyObj['iresdaMin'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.iresdaMin < this.checkKeyObj['iresdaMin'].val1 || info.iresdaMin > this.checkKeyObj['iresdaMin'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['iresdaMin'].val1 !== null && this.checkKeyObj['iresdaMin'].val3 !== null && info.type === 1) {
              if ((info.iresdaMin >= this.checkKeyObj['iresdaMin'].val3 && info.iresdaMin <= this.checkKeyObj['iresdaMin'].val1) || (info.iresdaMin >= this.checkKeyObj['iresdaMin'].val2 && info.iresdaMin <= this.checkKeyObj['iresdaMin'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['iresdaMin'].val3 !== null && info.type === 3) {
              if (info.iresdaMin < this.checkKeyObj['iresdaMin'].val3 || info.iresdaMin > this.checkKeyObj['iresdaMin'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['iresdaMax'] !== undefined) {
            if (this.checkKeyObj['iresdaMax'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.iresdaMax < this.checkKeyObj['iresdaMax'].val1 || info.iresdaMax > this.checkKeyObj['iresdaMax'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['iresdaMax'].val1 !== null && this.checkKeyObj['iresdaMax'].val3 !== null && info.type === 1) {
              if ((info.iresdaMax >= this.checkKeyObj['iresdaMax'].val3 && info.iresdaMax <= this.checkKeyObj['iresdaMax'].val1) || (info.iresdaMax >= this.checkKeyObj['iresdaMax'].val2 && info.iresdaMax <= this.checkKeyObj['iresdaMax'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['iresdaMax'].val3 !== null && info.type === 3) {
              if (info.iresdaMax < this.checkKeyObj['iresdaMax'].val3 || info.iresdaMax > this.checkKeyObj['iresdaMax'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['lopMin'] !== undefined) {
            if (this.checkKeyObj['lopMin'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.lopMin < this.checkKeyObj['lopMin'].val1 || info.lopMin > this.checkKeyObj['lopMin'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['lopMin'].val1 !== null && this.checkKeyObj['lopMin'].val3 !== null && info.type === 1) {
              if ((info.lopMin >= this.checkKeyObj['lopMin'].val3 && info.lopMin <= this.checkKeyObj['lopMin'].val1) || (info.lopMin >= this.checkKeyObj['lopMin'].val2 && info.lopMin <= this.checkKeyObj['lopMin'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['lopMin'].val3 !== null && info.type === 3) {
              if (info.lopMin < this.checkKeyObj['lopMin'].val3 || info.lopMin > this.checkKeyObj['lopMin'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['lopMax'] !== undefined) {
            if (this.checkKeyObj['lopMax'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.lopMax < this.checkKeyObj['lopMax'].val1 || info.lopMax > this.checkKeyObj['lopMax'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['lopMax'].val1 !== null && this.checkKeyObj['lopMax'].val3 !== null && info.type === 1) {
              if ((info.lopMax >= this.checkKeyObj['lopMax'].val3 && info.lopMax <= this.checkKeyObj['lopMax'].val1) || (info.lopMax >= this.checkKeyObj['lopMax'].val2 && info.lopMax <= this.checkKeyObj['lopMax'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['lopMax'].val3 !== null && info.type === 3) {
              if (info.lopMax < this.checkKeyObj['lopMax'].val3 || info.lopMax > this.checkKeyObj['lopMax'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['wldMin'] !== undefined) {
            if (this.checkKeyObj['wldMin'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.wldMin < this.checkKeyObj['wldMin'].val1 || info.wldMin > this.checkKeyObj['wldMin'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['wldMin'].val1 !== null && this.checkKeyObj['wldMin'].val3 !== null && info.type === 1) {
              if ((info.wldMin >= this.checkKeyObj['wldMin'].val3 && info.wldMin <= this.checkKeyObj['wldMin'].val1) || (info.wldMin >= this.checkKeyObj['wldMin'].val2 && info.wldMin <= this.checkKeyObj['wldMin'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['wldMin'].val3 !== null && info.type === 3) {
              if (info.wldMin < this.checkKeyObj['wldMin'].val3 || info.wldMin > this.checkKeyObj['wldMin'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['wldMax'] !== undefined) {
            if (this.checkKeyObj['wldMax'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.wldMax < this.checkKeyObj['wldMax'].val1 || info.wldMax > this.checkKeyObj['wldMax'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['wldMax'].val1 !== null && this.checkKeyObj['wldMax'].val3 !== null && info.type === 1) {
              if ((info.wldMax >= this.checkKeyObj['wldMax'].val3 && info.wldMax <= this.checkKeyObj['wldMax'].val1) || (info.wldMax >= this.checkKeyObj['wldMax'].val2 && info.wldMax <= this.checkKeyObj['wldMax'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['wldMax'].val3 !== null && info.type === 3) {
              if (info.wldMax < this.checkKeyObj['wldMax'].val3 || info.wldMax > this.checkKeyObj['wldMax'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['bsMin'] !== undefined) {
            if (this.checkKeyObj['bsMin'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.bsMin < this.checkKeyObj['bsMin'].val1 || info.bsMin > this.checkKeyObj['bsMin'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['bsMin'].val1 !== null && this.checkKeyObj['bsMin'].val3 !== null && info.type === 1) {
              if ((info.bsMin >= this.checkKeyObj['bsMin'].val3 && info.bsMin <= this.checkKeyObj['bsMin'].val1) || (info.bsMin >= this.checkKeyObj['bsMin'].val2 && info.bsMin <= this.checkKeyObj['bsMin'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['bsMin'].val3 !== null && info.type === 3) {
              if (info.bsMin < this.checkKeyObj['bsMin'].val3 || info.bsMin > this.checkKeyObj['bsMin'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['bsMax'] !== undefined) {
            if (this.checkKeyObj['bsMax'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.bsMax < this.checkKeyObj['bsMax'].val1 || info.bsMax > this.checkKeyObj['bsMax'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['bsMax'].val1 !== null && this.checkKeyObj['bsMax'].val3 !== null && info.type === 1) {
              if ((info.bsMax >= this.checkKeyObj['bsMax'].val3 && info.bsMax <= this.checkKeyObj['bsMax'].val1) || (info.bsMax >= this.checkKeyObj['bsMax'].val2 && info.bsMax <= this.checkKeyObj['bsMax'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['bsMax'].val3 !== null && info.type === 3) {
              if (info.bsMax < this.checkKeyObj['bsMax'].val3 || info.bsMax > this.checkKeyObj['bsMax'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['dvfMin'] !== undefined) {
            if (this.checkKeyObj['dvfMin'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.dvfMin < this.checkKeyObj['dvfMin'].val1 || info.dvfMin > this.checkKeyObj['dvfMin'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['dvfMin'].val1 !== null && this.checkKeyObj['dvfMin'].val3 !== null && info.type === 1) {
              if ((info.dvfMin >= this.checkKeyObj['dvfMin'].val3 && info.dvfMin <= this.checkKeyObj['dvfMin'].val1) || (info.dvfMin >= this.checkKeyObj['dvfMin'].val2 && info.dvfMin <= this.checkKeyObj['dvfMin'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['dvfMin'].val3 !== null && info.type === 3) {
              if (info.dvfMin < this.checkKeyObj['dvfMin'].val3 || info.dvfMin > this.checkKeyObj['dvfMin'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['dvfMax'] !== undefined) {
            if (this.checkKeyObj['dvfMax'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.dvfMax < this.checkKeyObj['dvfMax'].val1 || info.dvfMax > this.checkKeyObj['dvfMax'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['dvfMax'].val1 !== null && this.checkKeyObj['dvfMax'].val3 !== null && info.type === 1) {
              if ((info.dvfMax >= this.checkKeyObj['dvfMax'].val3 && info.dvfMax <= this.checkKeyObj['dvfMax'].val1) || (info.dvfMax >= this.checkKeyObj['dvfMax'].val2 && info.dvfMax <= this.checkKeyObj['dvfMax'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['dvfMax'].val3 !== null && info.type === 3) {
              if (info.dvfMax < this.checkKeyObj['dvfMax'].val3 || info.dvfMax > this.checkKeyObj['dvfMax'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['hwMin'] !== undefined) {
            if (this.checkKeyObj['hwMin'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.hwMin < this.checkKeyObj['hwMin'].val1 || info.hwMin > this.checkKeyObj['hwMin'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['hwMin'].val1 !== null && this.checkKeyObj['hwMin'].val3 !== null && info.type === 1) {
              if ((info.hwMin >= this.checkKeyObj['hwMin'].val3 && info.hwMin <= this.checkKeyObj['hwMin'].val1) || (info.hwMin >= this.checkKeyObj['hwMin'].val2 && info.hwMin <= this.checkKeyObj['hwMin'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['hwMin'].val3 !== null && info.type === 3) {
              if (info.hwMin < this.checkKeyObj['hwMin'].val3 || info.hwMin > this.checkKeyObj['hwMin'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['hwMax'] !== undefined) {
            if (this.checkKeyObj['hwMax'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.hwMax < this.checkKeyObj['hwMax'].val1 || info.hwMax > this.checkKeyObj['hwMax'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['hwMax'].val1 !== null && this.checkKeyObj['hwMax'].val3 !== null && info.type === 1) {
              if ((info.hwMax >= this.checkKeyObj['hwMax'].val3 && info.hwMax <= this.checkKeyObj['hwMax'].val1) || (info.hwMax >= this.checkKeyObj['hwMax'].val2 && info.hwMax <= this.checkKeyObj['hwMax'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['hwMax'].val3 !== null && info.type === 3) {
              if (info.hwMax < this.checkKeyObj['hwMax'].val3 || info.hwMax > this.checkKeyObj['hwMax'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['wlpMin'] !== undefined) {
            if (this.checkKeyObj['wlpMin'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.wlpMin < this.checkKeyObj['wlpMin'].val1 || info.wlpMin > this.checkKeyObj['wlpMin'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['wlpMin'].val1 !== null && this.checkKeyObj['wlpMin'].val3 !== null && info.type === 1) {
              if ((info.wlpMin >= this.checkKeyObj['wlpMin'].val3 && info.wlpMin <= this.checkKeyObj['wlpMin'].val1) || (info.wlpMin >= this.checkKeyObj['wlpMin'].val2 && info.wlpMin <= this.checkKeyObj['wlpMin'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['wlpMin'].val3 !== null && info.type === 3) {
              if (info.wlpMin < this.checkKeyObj['wlpMin'].val3 || info.wlpMin > this.checkKeyObj['wlpMin'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['wlpMax'] !== undefined) {
            if (this.checkKeyObj['wlpMax'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.wlpMax < this.checkKeyObj['wlpMax'].val1 || info.wlpMax > this.checkKeyObj['wlpMax'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['wlpMax'].val1 !== null && this.checkKeyObj['wlpMax'].val3 !== null && info.type === 1) {
              if ((info.wlpMax >= this.checkKeyObj['wlpMax'].val3 && info.wlpMax <= this.checkKeyObj['wlpMax'].val1) || (info.wlpMax >= this.checkKeyObj['wlpMax'].val2 && info.wlpMax <= this.checkKeyObj['wlpMax'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['wlpMax'].val3 !== null && info.type === 3) {
              if (info.wlpMax < this.checkKeyObj['wlpMax'].val3 || info.wlpMax > this.checkKeyObj['wlpMax'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['wldWlpMin'] !== undefined) {
            if (this.checkKeyObj['wldWlpMin'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.wldWlpMin < this.checkKeyObj['wldWlpMin'].val1 || info.wldWlpMin > this.checkKeyObj['wldWlpMin'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['wldWlpMin'].val1 !== null && this.checkKeyObj['wldWlpMin'].val3 !== null && info.type === 1) {
              if ((info.wldWlpMin >= this.checkKeyObj['wldWlpMin'].val3 && info.wldWlpMin <= this.checkKeyObj['wldWlpMin'].val1) || (info.wldWlpMin >= this.checkKeyObj['wldWlpMin'].val2 && info.wldWlpMin <= this.checkKeyObj['wldWlpMin'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['wldWlpMin'].val3 !== null && info.type === 3) {
              if (info.wldWlpMin < this.checkKeyObj['wldWlpMin'].val3 || info.wldWlpMin > this.checkKeyObj['wldWlpMin'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['wldWlpMax'] !== undefined) {
            if (this.checkKeyObj['wldWlpMax'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.wldWlpMax < this.checkKeyObj['wldWlpMax'].val1 || info.wldWlpMax > this.checkKeyObj['wldWlpMax'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['wldWlpMax'].val1 !== null && this.checkKeyObj['wldWlpMax'].val3 !== null && info.type === 1) {
              if ((info.wldWlpMax >= this.checkKeyObj['wldWlpMax'].val3 && info.wldWlpMax <= this.checkKeyObj['wldWlpMax'].val1) || (info.wldWlpMax >= this.checkKeyObj['wldWlpMax'].val2 && info.wldWlpMax <= this.checkKeyObj['wldWlpMax'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['wldWlpMax'].val3 !== null && info.type === 3) {
              if (info.wldWlpMax < this.checkKeyObj['wldWlpMax'].val3 || info.wldWlpMax > this.checkKeyObj['wldWlpMax'].val4) {
                flag = false
                break
              }
            }
          }
          if (!flag) {
            console.log(info)
          }
        } else {
          break
        }
      }
      if (!flag) {
        this.setDisable = false
        this.$message({
          type: 'error',
          message: 'bin表输入有误!'
        })
        return
      }
      const params = {
        model: this.newmodel,
        color: this.newcolor,
        remark: this.remark,
        craft: this.newgy,
        creator: sessionStorage.getItem('User-Id'),
        detailList: this.showCheckList,
        name: this.newname,
        type: 0
      }
      save(params).then(res => {
        this.setDisable = false
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          this.addDialogVisible = false
          this.showCheckList = []
          this.fetchData()
        }
      }, res => {
        this.setDisable = false
      })
    },
    // 添加提交
    editsubmitForm(formName) {
      if (this.newmodel === '') {
        this.$message({
          type: 'error',
          message: '请选择型号!'
        })
        return
      }
      if (this.newcolor === '') {
        this.$message({
          type: 'error',
          message: '请选择光色!'
        })
        return
      }
      if (this.newgy === '') {
        this.$message({
          type: 'error',
          message: '请选择工艺!'
        })
        return
      }
      if (this.showCheckList.length === 0) {
        this.$message({
          type: 'error',
          message: '请导入Bin!'
        })
        return
      }
      this.setDisable = true
      let flag = true
      console.log(this.checkKeyObj)
      for (const info of this.showCheckList) {
        for (const item of this.binKey) {
          const str = info[item] + ''
          if (parseFloat(info[item]) + '' !== str && item !== 'typeName' && item !== 'name' && item !== 'version' && item !== 'binNormId') {
            flag = false
            break
          }
        }
        if (flag) {
          if (this.checkKeyObj['vf1Min'] !== undefined) {
            if (this.checkKeyObj['vf1Min'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.vf1Min < this.checkKeyObj['vf1Min'].val1 || info.vf1Min > this.checkKeyObj['vf1Min'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vf1Min'].val1 !== null && this.checkKeyObj['vf1Min'].val3 !== null && info.type === 1) {
              if ((info.vf1Min >= this.checkKeyObj['vf1Min'].val3 && info.vf1Min <= this.checkKeyObj['vf1Min'].val1) || (info.vf1Min >= this.checkKeyObj['vf1Min'].val2 && info.vf1Min <= this.checkKeyObj['vf1Min'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vf1Min'].val3 !== null && info.type === 3) {
              if (info.vf1Min < this.checkKeyObj['vf1Min'].val3 || info.vf1Min > this.checkKeyObj['vf1Min'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['vf1Max'] !== undefined) {
            if (this.checkKeyObj['vf1Max'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.vf1Max < this.checkKeyObj['vf1Max'].val1 || info.vf1Max > this.checkKeyObj['vf1Max'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vf1Max'].val1 !== null && this.checkKeyObj['vf1Max'].val3 !== null && info.type === 1) {
              if ((info.vf1Max >= this.checkKeyObj['vf1Max'].val3 && info.vf1Max <= this.checkKeyObj['vf1Max'].val1) || (info.vf1Max >= this.checkKeyObj['vf1Max'].val2 && info.vf1Max <= this.checkKeyObj['vf1Max'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vf1Max'].val3 !== null && info.type === 3) {
              if (info.vf1Max < this.checkKeyObj['vf1Max'].val3 || info.vf1Max > this.checkKeyObj['vf1Max'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['vf2Min'] !== undefined) {
            if (this.checkKeyObj['vf2Min'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.vf2Min < this.checkKeyObj['vf2Min'].val1 || info.vf2Min > this.checkKeyObj['vf2Min'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vf2Min'].val1 !== null && this.checkKeyObj['vf2Min'].val3 !== null && info.type === 1) {
              if ((info.vf2Min >= this.checkKeyObj['vf2Min'].val3 && info.vf2Min <= this.checkKeyObj['vf2Min'].val1) || (info.vf2Min >= this.checkKeyObj['vf2Min'].val2 && info.vf2Min <= this.checkKeyObj['vf2Min'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vf2Min'].val3 !== null && info.type === 3) {
              if (info.vf2Min < this.checkKeyObj['vf2Min'].val3 || info.vf2Min > this.checkKeyObj['vf2Min'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['vf2Max'] !== undefined) {
            if (this.checkKeyObj['vf2Max'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.vf2Max < this.checkKeyObj['vf2Max'].val1 || info.vf2Max > this.checkKeyObj['vf2Max'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vf2Max'].val1 !== null && this.checkKeyObj['vf2Max'].val3 !== null && info.type === 1) {
              if ((info.vf2Max >= this.checkKeyObj['vf2Max'].val3 && info.vf2Max <= this.checkKeyObj['vf2Max'].val1) || (info.vf2Max >= this.checkKeyObj['vf2Max'].val2 && info.vf2Max <= this.checkKeyObj['vf2Max'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vf2Max'].val3 !== null && info.type === 3) {
              if (info.vf2Max < this.checkKeyObj['vf2Max'].val3 || info.vf2Max > this.checkKeyObj['vf2Max'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['vf3Min'] !== undefined) {
            if (this.checkKeyObj['vf3Min'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.vf3Min < this.checkKeyObj['vf3Min'].val1 || info.vf3Min > this.checkKeyObj['vf3Min'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vf3Min'].val1 !== null && this.checkKeyObj['vf3Min'].val3 !== null && info.type === 1) {
              if ((info.vf3Min >= this.checkKeyObj['vf3Min'].val3 && info.vf3Min <= this.checkKeyObj['vf3Min'].val1) || (info.vf3Min >= this.checkKeyObj['vf3Min'].val2 && info.vf3Min <= this.checkKeyObj['vf3Min'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vf3Min'].val3 !== null && info.type === 3) {
              if (info.vf3Min < this.checkKeyObj['vf3Min'].val3 || info.vf3Min > this.checkKeyObj['vf3Min'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['vf3Max'] !== undefined) {
            if (this.checkKeyObj['vf3Max'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.vf3Max < this.checkKeyObj['vf3Max'].val1 || info.vf3Max > this.checkKeyObj['vf3Max'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vf3Max'].val1 !== null && this.checkKeyObj['vf3Max'].val3 !== null && info.type === 1) {
              if ((info.vf3Max >= this.checkKeyObj['vf3Max'].val3 && info.vf3Max <= this.checkKeyObj['vf3Max'].val1) || (info.vf3Max >= this.checkKeyObj['vf3Max'].val2 && info.vf3Max <= this.checkKeyObj['vf3Max'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vf3Max'].val3 !== null && info.type === 3) {
              if (info.vf3Max < this.checkKeyObj['vf3Max'].val3 || info.vf3Max > this.checkKeyObj['vf3Max'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['vf4Min'] !== undefined) {
            if (this.checkKeyObj['vf4Min'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.vf4Min < this.checkKeyObj['vf4Min'].val1 || info.vf4Min > this.checkKeyObj['vf4Min'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vf4Min'].val1 !== null && this.checkKeyObj['vf4Min'].val3 !== null && info.type === 1) {
              if ((info.vf4Min >= this.checkKeyObj['vf4Min'].val3 && info.vf4Min <= this.checkKeyObj['vf4Min'].val1) || (info.vf4Min >= this.checkKeyObj['vf4Min'].val2 && info.vf4Min <= this.checkKeyObj['vf4Min'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vf4Min'].val3 !== null && info.type === 3) {
              if (info.vf4Min < this.checkKeyObj['vf4Min'].val3 || info.vf4Min > this.checkKeyObj['vf4Min'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['vf4Max'] !== undefined) {
            if (this.checkKeyObj['vf4Max'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.vf4Max < this.checkKeyObj['vf4Max'].val1 || info.vf4Max > this.checkKeyObj['vf4Max'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vf4Max'].val1 !== null && this.checkKeyObj['vf4Max'].val3 !== null && info.type === 1) {
              if ((info.vf4Max >= this.checkKeyObj['vf4Max'].val3 && info.vf4Max <= this.checkKeyObj['vf4Max'].val1) || (info.vf4Max >= this.checkKeyObj['vf4Max'].val2 && info.vf4Max <= this.checkKeyObj['vf4Max'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vf4Max'].val3 !== null && info.type === 3) {
              if (info.vf4Max < this.checkKeyObj['vf4Max'].val3 || info.vf4Max > this.checkKeyObj['vf4Max'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['vfdMin'] !== undefined) {
            if (this.checkKeyObj['vfdMin'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.vfdMin < this.checkKeyObj['vfdMin'].val1 || info.vfdMin > this.checkKeyObj['vfdMin'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vfdMin'].val1 !== null && this.checkKeyObj['vfdMin'].val3 !== null && info.type === 1) {
              if ((info.vfdMin >= this.checkKeyObj['vfdMin'].val3 && info.vfdMin <= this.checkKeyObj['vfdMin'].val1) || (info.vfdMin >= this.checkKeyObj['vfdMin'].val2 && info.vfdMin <= this.checkKeyObj['vfdMin'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vfdMin'].val3 !== null && info.type === 3) {
              if (info.vfdMin < this.checkKeyObj['vfdMin'].val3 || info.vfdMin > this.checkKeyObj['vfdMin'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['vfdMax'] !== undefined) {
            if (this.checkKeyObj['vfdMax'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.vfdMax < this.checkKeyObj['vfdMax'].val1 || info.vfdMax > this.checkKeyObj['vfdMax'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vfdMax'].val1 !== null && this.checkKeyObj['vfdMax'].val3 !== null && info.type === 1) {
              if ((info.vfdMax >= this.checkKeyObj['vfdMax'].val3 && info.vfdMax <= this.checkKeyObj['vfdMax'].val1) || (info.vfdMax >= this.checkKeyObj['vfdMax'].val2 && info.vfdMax <= this.checkKeyObj['vfdMax'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vfdMax'].val3 !== null && info.type === 3) {
              if (info.vfdMax < this.checkKeyObj['vfdMax'].val3 || info.vfdMax > this.checkKeyObj['vfdMax'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['vzMin'] !== undefined) {
            if (this.checkKeyObj['vzMin'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.vzMin < this.checkKeyObj['vzMin'].val1 || info.vzMin > this.checkKeyObj['vzMin'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vzMin'].val1 !== null && this.checkKeyObj['vzMin'].val3 !== null && info.type === 1) {
              if ((info.vzMin >= this.checkKeyObj['vzMin'].val3 && info.vzMin <= this.checkKeyObj['vzMin'].val1) || (info.vzMin >= this.checkKeyObj['vzMin'].val2 && info.vzMin <= this.checkKeyObj['vzMin'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vzMin'].val3 !== null && info.type === 3) {
              if (info.vzMin < this.checkKeyObj['vzMin'].val3 || info.vzMin > this.checkKeyObj['vzMin'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['vzMax'] !== undefined) {
            if (this.checkKeyObj['vzMax'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.vzMax < this.checkKeyObj['vzMax'].val1 || info.vzMax > this.checkKeyObj['vzMax'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vzMax'].val1 !== null && this.checkKeyObj['vzMax'].val3 !== null && info.type === 1) {
              if ((info.vzMax >= this.checkKeyObj['vzMax'].val3 && info.vzMax <= this.checkKeyObj['vzMax'].val1) || (info.vzMax >= this.checkKeyObj['vzMax'].val2 && info.vzMax <= this.checkKeyObj['vzMax'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['vzMax'].val3 !== null && info.type === 3) {
              if (info.vzMax < this.checkKeyObj['vzMax'].val3 || info.vzMax > this.checkKeyObj['vzMax'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['irMin'] !== undefined) {
            if (this.checkKeyObj['irMin'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.irMin < this.checkKeyObj['irMin'].val1 || info.irMin > this.checkKeyObj['irMin'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['irMin'].val1 !== null && this.checkKeyObj['irMin'].val3 !== null && info.type === 1) {
              if ((info.irMin >= this.checkKeyObj['irMin'].val3 && info.irMin <= this.checkKeyObj['irMin'].val1) || (info.irMin >= this.checkKeyObj['irMin'].val2 && info.irMin <= this.checkKeyObj['irMin'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['irMin'].val3 !== null && info.type === 3) {
              if (info.irMin < this.checkKeyObj['irMin'].val3 || info.irMin > this.checkKeyObj['irMin'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['irMax'] !== undefined) {
            if (this.checkKeyObj['irMax'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.irMax < this.checkKeyObj['irMax'].val1 || info.irMax > this.checkKeyObj['irMax'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['irMax'].val1 !== null && this.checkKeyObj['irMax'].val3 !== null && info.type === 1) {
              if ((info.irMax >= this.checkKeyObj['irMax'].val3 && info.irMax <= this.checkKeyObj['irMax'].val1) || (info.irMax >= this.checkKeyObj['irMax'].val2 && info.irMax <= this.checkKeyObj['irMax'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['irMax'].val3 !== null && info.type === 3) {
              if (info.irMax < this.checkKeyObj['irMax'].val3 || info.irMax > this.checkKeyObj['irMax'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['iresdaMin'] !== undefined) {
            if (this.checkKeyObj['iresdaMin'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.iresdaMin < this.checkKeyObj['iresdaMin'].val1 || info.iresdaMin > this.checkKeyObj['iresdaMin'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['iresdaMin'].val1 !== null && this.checkKeyObj['iresdaMin'].val3 !== null && info.type === 1) {
              if ((info.iresdaMin >= this.checkKeyObj['iresdaMin'].val3 && info.iresdaMin <= this.checkKeyObj['iresdaMin'].val1) || (info.iresdaMin >= this.checkKeyObj['iresdaMin'].val2 && info.iresdaMin <= this.checkKeyObj['iresdaMin'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['iresdaMin'].val3 !== null && info.type === 3) {
              if (info.iresdaMin < this.checkKeyObj['iresdaMin'].val3 || info.iresdaMin > this.checkKeyObj['iresdaMin'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['iresdaMax'] !== undefined) {
            if (this.checkKeyObj['iresdaMax'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.iresdaMax < this.checkKeyObj['iresdaMax'].val1 || info.iresdaMax > this.checkKeyObj['iresdaMax'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['iresdaMax'].val1 !== null && this.checkKeyObj['iresdaMax'].val3 !== null && info.type === 1) {
              if ((info.iresdaMax >= this.checkKeyObj['iresdaMax'].val3 && info.iresdaMax <= this.checkKeyObj['iresdaMax'].val1) || (info.iresdaMax >= this.checkKeyObj['iresdaMax'].val2 && info.iresdaMax <= this.checkKeyObj['iresdaMax'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['iresdaMax'].val3 !== null && info.type === 3) {
              if (info.iresdaMax < this.checkKeyObj['iresdaMax'].val3 || info.iresdaMax > this.checkKeyObj['iresdaMax'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['lopMin'] !== undefined) {
            if (this.checkKeyObj['lopMin'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.lopMin < this.checkKeyObj['lopMin'].val1 || info.lopMin > this.checkKeyObj['lopMin'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['lopMin'].val1 !== null && this.checkKeyObj['lopMin'].val3 !== null && info.type === 1) {
              if ((info.lopMin >= this.checkKeyObj['lopMin'].val3 && info.lopMin <= this.checkKeyObj['lopMin'].val1) || (info.lopMin >= this.checkKeyObj['lopMin'].val2 && info.lopMin <= this.checkKeyObj['lopMin'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['lopMin'].val3 !== null && info.type === 3) {
              if (info.lopMin < this.checkKeyObj['lopMin'].val3 || info.lopMin > this.checkKeyObj['lopMin'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['lopMax'] !== undefined) {
            if (this.checkKeyObj['lopMax'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.lopMax < this.checkKeyObj['lopMax'].val1 || info.lopMax > this.checkKeyObj['lopMax'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['lopMax'].val1 !== null && this.checkKeyObj['lopMax'].val3 !== null && info.type === 1) {
              if ((info.lopMax >= this.checkKeyObj['lopMax'].val3 && info.lopMax <= this.checkKeyObj['lopMax'].val1) || (info.lopMax >= this.checkKeyObj['lopMax'].val2 && info.lopMax <= this.checkKeyObj['lopMax'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['lopMax'].val3 !== null && info.type === 3) {
              if (info.lopMax < this.checkKeyObj['lopMax'].val3 || info.lopMax > this.checkKeyObj['lopMax'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['wldMin'] !== undefined) {
            if (this.checkKeyObj['wldMin'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.wldMin < this.checkKeyObj['wldMin'].val1 || info.wldMin > this.checkKeyObj['wldMin'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['wldMin'].val1 !== null && this.checkKeyObj['wldMin'].val3 !== null && info.type === 1) {
              if ((info.wldMin >= this.checkKeyObj['wldMin'].val3 && info.wldMin <= this.checkKeyObj['wldMin'].val1) || (info.wldMin >= this.checkKeyObj['wldMin'].val2 && info.wldMin <= this.checkKeyObj['wldMin'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['wldMin'].val3 !== null && info.type === 3) {
              if (info.wldMin < this.checkKeyObj['wldMin'].val3 || info.wldMin > this.checkKeyObj['wldMin'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['wldMax'] !== undefined) {
            if (this.checkKeyObj['wldMax'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.wldMax < this.checkKeyObj['wldMax'].val1 || info.wldMax > this.checkKeyObj['wldMax'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['wldMax'].val1 !== null && this.checkKeyObj['wldMax'].val3 !== null && info.type === 1) {
              if ((info.wldMax >= this.checkKeyObj['wldMax'].val3 && info.wldMax <= this.checkKeyObj['wldMax'].val1) || (info.wldMax >= this.checkKeyObj['wldMax'].val2 && info.wldMax <= this.checkKeyObj['wldMax'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['wldMax'].val3 !== null && info.type === 3) {
              if (info.wldMax < this.checkKeyObj['wldMax'].val3 || info.wldMax > this.checkKeyObj['wldMax'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['bsMin'] !== undefined) {
            if (this.checkKeyObj['bsMin'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.bsMin < this.checkKeyObj['bsMin'].val1 || info.bsMin > this.checkKeyObj['bsMin'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['bsMin'].val1 !== null && this.checkKeyObj['bsMin'].val3 !== null && info.type === 1) {
              if ((info.bsMin >= this.checkKeyObj['bsMin'].val3 && info.bsMin <= this.checkKeyObj['bsMin'].val1) || (info.bsMin >= this.checkKeyObj['bsMin'].val2 && info.bsMin <= this.checkKeyObj['bsMin'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['bsMin'].val3 !== null && info.type === 3) {
              if (info.bsMin < this.checkKeyObj['bsMin'].val3 || info.bsMin > this.checkKeyObj['bsMin'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['bsMax'] !== undefined) {
            if (this.checkKeyObj['bsMax'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.bsMax < this.checkKeyObj['bsMax'].val1 || info.bsMax > this.checkKeyObj['bsMax'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['bsMax'].val1 !== null && this.checkKeyObj['bsMax'].val3 !== null && info.type === 1) {
              if ((info.bsMax >= this.checkKeyObj['bsMax'].val3 && info.bsMax <= this.checkKeyObj['bsMax'].val1) || (info.bsMax >= this.checkKeyObj['bsMax'].val2 && info.bsMax <= this.checkKeyObj['bsMax'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['bsMax'].val3 !== null && info.type === 3) {
              if (info.bsMax < this.checkKeyObj['bsMax'].val3 || info.bsMax > this.checkKeyObj['bsMax'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['dvfMin'] !== undefined) {
            if (this.checkKeyObj['dvfMin'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.dvfMin < this.checkKeyObj['dvfMin'].val1 || info.dvfMin > this.checkKeyObj['dvfMin'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['dvfMin'].val1 !== null && this.checkKeyObj['dvfMin'].val3 !== null && info.type === 1) {
              if ((info.dvfMin >= this.checkKeyObj['dvfMin'].val3 && info.dvfMin <= this.checkKeyObj['dvfMin'].val1) || (info.dvfMin >= this.checkKeyObj['dvfMin'].val2 && info.dvfMin <= this.checkKeyObj['dvfMin'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['dvfMin'].val3 !== null && info.type === 3) {
              if (info.dvfMin < this.checkKeyObj['dvfMin'].val3 || info.dvfMin > this.checkKeyObj['dvfMin'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['dvfMax'] !== undefined) {
            if (this.checkKeyObj['dvfMax'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.dvfMax < this.checkKeyObj['dvfMax'].val1 || info.dvfMax > this.checkKeyObj['dvfMax'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['dvfMax'].val1 !== null && this.checkKeyObj['dvfMax'].val3 !== null && info.type === 1) {
              if ((info.dvfMax >= this.checkKeyObj['dvfMax'].val3 && info.dvfMax <= this.checkKeyObj['dvfMax'].val1) || (info.dvfMax >= this.checkKeyObj['dvfMax'].val2 && info.dvfMax <= this.checkKeyObj['dvfMax'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['dvfMax'].val3 !== null && info.type === 3) {
              if (info.dvfMax < this.checkKeyObj['dvfMax'].val3 || info.dvfMax > this.checkKeyObj['dvfMax'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['hwMin'] !== undefined) {
            if (this.checkKeyObj['hwMin'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.hwMin < this.checkKeyObj['hwMin'].val1 || info.hwMin > this.checkKeyObj['hwMin'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['hwMin'].val1 !== null && this.checkKeyObj['hwMin'].val3 !== null && info.type === 1) {
              if ((info.hwMin >= this.checkKeyObj['hwMin'].val3 && info.hwMin <= this.checkKeyObj['hwMin'].val1) || (info.hwMin >= this.checkKeyObj['hwMin'].val2 && info.hwMin <= this.checkKeyObj['hwMin'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['hwMin'].val3 !== null && info.type === 3) {
              if (info.hwMin < this.checkKeyObj['hwMin'].val3 || info.hwMin > this.checkKeyObj['hwMin'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['hwMax'] !== undefined) {
            if (this.checkKeyObj['hwMax'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.hwMax < this.checkKeyObj['hwMax'].val1 || info.hwMax > this.checkKeyObj['hwMax'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['hwMax'].val1 !== null && this.checkKeyObj['hwMax'].val3 !== null && info.type === 1) {
              if ((info.hwMax >= this.checkKeyObj['hwMax'].val3 && info.hwMax <= this.checkKeyObj['hwMax'].val1) || (info.hwMax >= this.checkKeyObj['hwMax'].val2 && info.hwMax <= this.checkKeyObj['hwMax'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['hwMax'].val3 !== null && info.type === 3) {
              if (info.hwMax < this.checkKeyObj['hwMax'].val3 || info.hwMax > this.checkKeyObj['hwMax'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['wlpMin'] !== undefined) {
            if (this.checkKeyObj['wlpMin'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.wlpMin < this.checkKeyObj['wlpMin'].val1 || info.wlpMin > this.checkKeyObj['wlpMin'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['wlpMin'].val1 !== null && this.checkKeyObj['wlpMin'].val3 !== null && info.type === 1) {
              if ((info.wlpMin >= this.checkKeyObj['wlpMin'].val3 && info.wlpMin <= this.checkKeyObj['wlpMin'].val1) || (info.wlpMin >= this.checkKeyObj['wlpMin'].val2 && info.wlpMin <= this.checkKeyObj['wlpMin'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['wlpMin'].val3 !== null && info.type === 3) {
              if (info.wlpMin < this.checkKeyObj['wlpMin'].val3 || info.wlpMin > this.checkKeyObj['wlpMin'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['wlpMax'] !== undefined) {
            if (this.checkKeyObj['wlpMax'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.wlpMax < this.checkKeyObj['wlpMax'].val1 || info.wlpMax > this.checkKeyObj['wlpMax'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['wlpMax'].val1 !== null && this.checkKeyObj['wlpMax'].val3 !== null && info.type === 1) {
              if ((info.wlpMax >= this.checkKeyObj['wlpMax'].val3 && info.wlpMax <= this.checkKeyObj['wlpMax'].val1) || (info.wlpMax >= this.checkKeyObj['wlpMax'].val2 && info.wlpMax <= this.checkKeyObj['wlpMax'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['wlpMax'].val3 !== null && info.type === 3) {
              if (info.wlpMax < this.checkKeyObj['wlpMax'].val3 || info.wlpMax > this.checkKeyObj['wlpMax'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['wldWlpMin'] !== undefined) {
            if (this.checkKeyObj['wldWlpMin'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.wldWlpMin < this.checkKeyObj['wldWlpMin'].val1 || info.wldWlpMin > this.checkKeyObj['wldWlpMin'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['wldWlpMin'].val1 !== null && this.checkKeyObj['wldWlpMin'].val3 !== null && info.type === 1) {
              if ((info.wldWlpMin >= this.checkKeyObj['wldWlpMin'].val3 && info.wldWlpMin <= this.checkKeyObj['wldWlpMin'].val1) || (info.wldWlpMin >= this.checkKeyObj['wldWlpMin'].val2 && info.wldWlpMin <= this.checkKeyObj['wldWlpMin'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['wldWlpMin'].val3 !== null && info.type === 3) {
              if (info.wldWlpMin < this.checkKeyObj['wldWlpMin'].val3 || info.wldWlpMin > this.checkKeyObj['wldWlpMin'].val4) {
                flag = false
                break
              }
            }
          }
          if (this.checkKeyObj['wldWlpMax'] !== undefined) {
            if (this.checkKeyObj['wldWlpMax'].val1 !== null && (info.type === 0 || info.type === 2)) {
              if (info.wldWlpMax < this.checkKeyObj['wldWlpMax'].val1 || info.wldWlpMax > this.checkKeyObj['wldWlpMax'].val2) {
                flag = false
                break
              }
            } else if (this.checkKeyObj['wldWlpMax'].val1 !== null && this.checkKeyObj['wldWlpMax'].val3 !== null && info.type === 1) {
              if ((info.wldWlpMax >= this.checkKeyObj['wldWlpMax'].val3 && info.wldWlpMax <= this.checkKeyObj['wldWlpMax'].val1) || (info.wldWlpMax >= this.checkKeyObj['wldWlpMax'].val2 && info.wldWlpMax <= this.checkKeyObj['wldWlpMax'].val4)) {
                continue
              } else {
                flag = false
                break
              }
            } else if (this.checkKeyObj['wldWlpMax'].val3 !== null && info.type === 3) {
              if (info.wldWlpMax < this.checkKeyObj['wldWlpMax'].val3 || info.wldWlpMax > this.checkKeyObj['wldWlpMax'].val4) {
                flag = false
                break
              }
            }
          }
          if (!flag) {
            console.log(info)
          }
        } else {
          break
        }
      }
      if (!flag) {
        this.setDisable = false
        this.$message({
          type: 'error',
          message: 'BIN表输入有误!'
        })
        return
      }
      this.$confirm('保存BIN表将生成一个新版本，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: this.currentId,
          model: this.newmodel,
          color: this.newcolor,
          remark: this.remark,
          craft: this.newgy,
          creator: sessionStorage.getItem('User-Id'),
          detailList: this.showCheckList,
          name: this.newname,
          version: this.newvsersion,
          type: 0
        }
        save(params).then(res => {
          this.setDisable = false
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.editDialogVisible = false
            this.allList = []
            this.showCheckList = []
            this.fetchData()
          }
        }, res => {
          this.setDisable = false
        })
      }).catch(() => {
        this.setDisable = false
      })
    },
    // 取消
    resetForm(formName) {
      this.addDialogVisible = false
      this.$refs[formName].resetFields()
    },
    // 删除按钮
    handleDelete(row) {
      this.$confirm('此操作将永久删除当前信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: row.id
        }
        deletes(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            if (this.list.length === 1 && this.pageNum !== 1) {
              this.pageNum = this.pageNum - 1
            }
            if (this.historyDialogVisible) {
              this.loadHistory()
            } else {
              this.fetchData()
            }
          }
        })
      })
    },
    exportAll(row) {
      window.open(process.env.BASE_API + `/xpBinNorm/export?id=${row.id}&name=${row.name}&version=${row.version}`)
    }
  }
}

