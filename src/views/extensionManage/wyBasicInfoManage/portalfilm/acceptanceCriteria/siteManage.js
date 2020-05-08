
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findColorList, findModelList, query, queryHv, enableDisabled, produceName, normUpdate, normAdd, remove } from '@/api/acceptanceCriteria'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      configDialogVisible: false,
      configDialogVisible1: false,
      historyDialogVisible: false,
      list: [],
      defaultFormThead: [],
      siteType: '',
      siteName: '',
      siteStatus: '',
      pageSize: 12,
      pageNum: 1,
      totalPage: 0,
      beginDate: '',
      endDate: '',
      isTrue: false,
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
      userOptions: [],
      isActive: 0,
      siteForm: {
        siteType: '',
        siteName: '',
        siteStatus: ''
      },
      currentId: '',
      color: '',
      modelType: '',
      status: '',
      statusOptions: [
        { id: 1, name: '弃用' },
        { id: 0, name: '启用' }
      ],
      rowInfo: null,
      showCheckList: [
        { grade: 'R', key: {}},
        { grade: 'S', key: {}},
        { grade: 'F', key: {}},
        { grade: 'T8', key: {}},
        { grade: 'T7', key: {}},
        { grade: 'T6', key: {}},
        { grade: 'T5', key: {}},
        { grade: 'T4', key: {}},
        { grade: 'T3', key: {}},
        { grade: 'T2', key: {}},
        { grade: 'T1', key: {}}
      ],
      oldList: [],
      modelOptions: [],
      colorOptions: [],
      selectList: [],
      plBaseList: [
        {
          thName: 'Wp',
          thKey: 'wp'
        },
        {
          thName: 'Wp_Std',
          thKey: 'wpStd'
        },
        {
          thName: 'Wd',
          thKey: 'wd'
        },
        {
          thName: 'Wd_Std',
          thKey: 'wd_std'
        },
        {
          thName: 'FWHM',
          thKey: 'fwhm'
        },
        {
          thName: 'FWHW Std',
          thKey: 'fwhm_std'
        },
        {
          thName: 'PL Int.',
          thKey: 'pl_int'
        },
        {
          thName: 'PL Int. Std',
          thKey: 'pl_int_std'
        },
        {
          thName: 'I.I.',
          thKey: 'ii'
        },
        {
          thName: 'I.I. Std',
          thKey: 'ii_std'
        },
        {
          thName: 'PDavr',
          thKey: 'pdavr'
        },
        {
          thName: 'PD Std',
          thKey: 'pdstd'
        },
        {
          thName: 'TH',
          thKey: 'th'
        },
        {
          thName: 'TH Std',
          thKey: 'th_std'
        },
        {
          thName: 'Ref.',
          thKey: 'ref'
        },
        {
          thName: 'Ref. Std',
          thKey: 'ref_std'
        },
        {
          thName: 'Bow',
          thKey: 'bow'
        },
        {
          thName: '测试机台PL',
          thKey: 'machinePl'
        }
      ],
      elBaseList: [
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
          thName: 'VZ1',
          thKey: 'vz1'
        },
        {
          thName: 'VZ2',
          thKey: 'vz2'
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
          thName: 'WLP1',
          thKey: 'wlp1'
        },
        {
          thName: 'WLD1',
          thKey: 'wld1'
        },
        // {
        //   thName: 'WLC1',
        //   thKey: 'wlc1'
        // },
        {
          thName: 'LOP(460)',
          thKey: 'lop460'
        },
        {
          thName: 'HW',
          thKey: 'hw'
        },
        {
          thName: '测试机台El',
          thKey: 'machineEl'
        }
      ],
      XRDBaseList: [
        {
          thName: '002',
          thKey: 'c_002'
        },
        {
          thName: '102',
          thKey: 'c_102'
        },
        {
          thName: 'QB Th.',
          thKey: 'qb_th'
        },
        {
          thName: 'QW Th.',
          thKey: 'qw_th'
        },
        {
          thName: 'Period',
          thKey: 'period'
        },
        {
          thName: 'In %',
          thKey: 'cin'
        },
        {
          thName: 'AlGaN Th.',
          thKey: 'algan_th'
        },
        {
          thName: 'Al %',
          thKey: 'al'
        },
        {
          thName: '测试机台XRD',
          thKey: 'machineXrd'
        }
      ],
      cowBaseList: [
        {
          thName: '批次号',
          thKey: 'lot_no'
        },
        {
          thName: 'WaferID',
          thKey: 'wafer_no'
        },
        {
          thName: '测试时间',
          thKey: 'test_time'
        },
        {
          thName: 'IV均值',
          thKey: 'avg_iv'
        },
        {
          thName: 'VF1均值',
          thKey: 'avg_vf1'
        },
        {
          thName: 'VF1_ESD_A均值',
          thKey: 'vf1EsdAvg'
        },
        {
          thName: 'VF1_ESD_A差值',
          thKey: 'vf1EsdDiffer'
        },
        {
          thName: 'VZ均值',
          thKey: 'avg_vz'
        },
        {
          thName: '蓝移',
          thKey: 'blue_shift'
        },
        {
          thName: 'K值',
          thKey: 'valk'
        },
        {
          thName: 'ESD去坏(200V)',
          thKey: 'esd_200'
        },
        {
          thName: 'ESD去坏(400V)',
          thKey: 'esd_400'
        },
        {
          thName: 'ESD去坏(50V)',
          thKey: 'esd_50'
        },
        {
          thName: 'ESD去坏(500V)',
          thKey: 'esd_500'
        },
        {
          thName: 'ESD去坏(300V)',
          thKey: 'esd_300'
        },
        {
          thName: 'ESD去坏(人体1000)',
          thKey: 'esd_1000'
        },
        {
          thName: 'ESD去坏(人体2000)',
          thKey: 'esd_2000'
        },
        {
          thName: 'ESD去坏(人体4000)',
          thKey: 'esd_4000'
        },
        {
          thName: 'Thyristor良率',
          thKey: 'yield_thyristor'
        },
        {
          thName: 'Thyristor坏点数',
          thKey: 'num_thyristor'
        },
        {
          thName: 'DVF均值',
          thKey: 'avg_dvf'
        },
        {
          thName: '综合良率',
          thKey: 'yield_zh'
        },
        {
          thName: 'VF1良率',
          thKey: 'yield_vf1'
        },
        {
          thName: 'VF3良率',
          thKey: 'yield_vf3'
        },
        {
          thName: 'WLD1良率',
          thKey: 'yield_wld1'
        },
        {
          thName: 'IR良率',
          thKey: 'yield_ir'
        },
        {
          thName: 'IR_ESD_A良率',
          thKey: 'irEsdYield'
        },
        {
          thName: 'VZ良率',
          thKey: 'yield_vz'
        },
        {
          thName: 'IV良率',
          thKey: 'yield_iv'
        },
        {
          thName: 'VF4良率',
          thKey: 'yield_vf4'
        },
        {
          thName: 'VF2均值',
          thKey: 'avg_vf2'
        },
        {
          thName: 'VF3均值',
          thKey: 'avg_vf3'
        },
        {
          thName: 'VF4均值',
          thKey: 'avg_vf4'
        },
        {
          thName: 'WLD1均值',
          thKey: 'avg_wld1'
        },
        {
          thName: 'WLD1_STD',
          thKey: 'wld1_std'
        },
        {
          thName: 'WLP1均值',
          thKey: 'avg_wlp1'
        },
        {
          thName: 'HW1',
          thKey: 'hw1'
        },
        {
          thName: 'WLD2均值',
          thKey: 'avg_wld2'
        },
        {
          thName: 'WLD2_STD',
          thKey: 'wld2_std'
        },
        {
          thName: 'HW2',
          thKey: 'hw2'
        },
        {
          thName: 'wlp2均值',
          thKey: 'avg_wlp2'
        },
        {
          thName: 'IR均值',
          thKey: 'avg_ir'
        },
        {
          thName: 'PL_WP',
          thKey: 'pl_wp'
        },
        {
          thName: 'PL_WD',
          thKey: 'pl_wd'
        },
        {
          thName: 'PL_WD_STD',
          thKey: 'pl_wd_std'
        },
        {
          thName: 'PL.I.I',
          thKey: 'pl_ii'
        },
        {
          thName: '总数',
          thKey: 'total'
        },
        {
          thName: '坏点数',
          thKey: 'bad'
        },
        {
          thName: '导入时间',
          thKey: 'import_time'
        },
        {
          thName: '机台',
          thKey: 'machine'
        },
        {
          thName: '预估波长',
          thKey: 'ygbc'
        }
      ],
      mjBaseList: [
        {
          thName: '目检',
          thKey: 'eyes_exam'
        }
      ],
      leftTree: [
        {
          id: 1,
          label: 'PL',
          children: []
        },
        {
          id: 2,
          label: 'EL',
          children: []
        },
        {
          id: 3,
          label: 'XRD',
          children: []
        },
        {
          id: 4,
          label: 'COW',
          children: []
        }
      ],
      rightTree: [
        {
          id: 1,
          label: 'PL',
          children: []
        },
        {
          id: 2,
          label: 'EL',
          children: []
        },
        {
          id: 3,
          label: 'XRD',
          children: []
        },
        {
          id: 4,
          label: 'COW',
          children: []
        }
      ],
      leftTree1: [
        {
          id: 1,
          label: 'PL',
          children: []
        },
        {
          id: 2,
          label: 'EL',
          children: []
        },
        {
          id: 3,
          label: 'XRD',
          children: []
        },
        {
          id: 4,
          label: 'COW',
          children: []
        }
      ],
      rightTree1: [
        {
          id: 1,
          label: 'PL',
          children: []
        },
        {
          id: 2,
          label: 'EL',
          children: []
        },
        {
          id: 3,
          label: 'XRD',
          children: []
        },
        {
          id: 4,
          label: 'COW',
          children: []
        }
      ],
      checkOptions: [],
      allready: '',
      newmodel: '',
      newcolor: '',
      newname: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      rowKey: [],
      historyList: [],
      hisVisible: false,
      selectLists: []
    }
  },
  mounted() {
    this.fetchData()
    this.findColorList()
    this.findModelList()
  },
  methods: {
    findColorList() {
      findColorList().then(res => {
        this.colorOptions = res.data.list
      })
    },
    findModelList() {
      findModelList().then(res => {
        this.modelOptions = res.data.list
      })
    },
    // 修改衬底
    editSubstrate() {
      this.editDialogVisible = true
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
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    clearCondition() {
      this.pageSize = 12
      this.modelType = ''
      this.status = ''
      this.color = ''
      this.beginDate = ''
      this.endDate = ''
      this.handleSearch()
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const requestParams = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        model: this.modelType,
        status: this.status,
        color: this.color,
        startTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate)
      }
      if (this.beginDate === '') {
        requestParams.startTime = ''
      }
      if (this.endDate === '') {
        requestParams.endTime = ''
      }
      query(requestParams).then(res => {
        this.list = []
        for (let i = 0; i < res.data.list.length; i++) {
          if (res.data.list[i].status === '0') {
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
    setStatus(row) {
      if (row.isChecked) {
        this.$confirm('确定启用标准' + row.name + '的最新版本?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          row.status = '0'
          const requestParams = {
            id: row.id,
            status: row.status,
            type: 1
          }
          enableDisabled(requestParams).then(res => {
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
        this.$confirm('确定弃用标准' + row.name + '?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          row.status = '1'
          const requestParams = {
            id: row.id,
            status: row.status,
            type: 1
          }
          enableDisabled(requestParams).then(res => {
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
    // 关闭
    handleClose() {
      if (!this.isTrue) {
        this.setFirst()
      }
    },
    // 关闭
    handleClose1() {
      if (!this.isTrue) {
        this.setTree()
      }
    },
    // 历史版本
    handleHistory(row) {
      this.rowInfo = row
      this.historyDialogVisible = true
      const requestParams = {
        pageSize: 1000000,
        pageNum: 1,
        newId: row.newId
      }
      queryHv(requestParams).then(res => {
        this.historyList = []
        var datas = {}
        for (let i = 0; i < res.data.list.length; i++) {
          if (res.data.list[i].status === '0') {
            datas = res.data.list[i]
            res.data.list[i].isChecked = true
          } else {
            res.data.list[i].isChecked = false
          }
          this.historyList.push(res.data.list[i])
        }
        this.$refs.historys.setCurrentRow(datas)
      })
    },
    getTitle1(row) {
      this.showCheckList = []
      this.oldList = [
        { grade: 'R', key: {}},
        { grade: 'S', key: {}},
        { grade: 'F', key: {}},
        { grade: 'T8', key: {}},
        { grade: 'T7', key: {}},
        { grade: 'T6', key: {}},
        { grade: 'T5', key: {}},
        { grade: 'T4', key: {}},
        { grade: 'T3', key: {}},
        { grade: 'T2', key: {}},
        { grade: 'T1', key: {}}
      ]
      var r = { grade: 'R', key: {}}
      var s = { grade: 'S', key: {}}
      var f = { grade: 'F', key: {}}
      var t1 = { grade: 'T1', key: {}}
      var t2 = { grade: 'T2', key: {}}
      var t3 = { grade: 'T3', key: {}}
      var t4 = { grade: 'T4', key: {}}
      var t5 = { grade: 'T5', key: {}}
      var t6 = { grade: 'T6', key: {}}
      var t7 = { grade: 'T7', key: {}}
      var t8 = { grade: 'T8', key: {}}
      if (row !== null && row.wyNormRules !== null) {
        for (const item of row.wyNormRules) {
          const field = this.findKeyToValue(item.field)
          r.key[field] = ''
          s.key[field] = ''
          f.key[field] = ''
          t1.key[field] = ''
          t2.key[field] = ''
          t3.key[field] = ''
          t4.key[field] = ''
          t5.key[field] = ''
          t6.key[field] = ''
          t7.key[field] = ''
          t8.key[field] = ''
          if (item.grade.toLowerCase() === 's') {
            s[field] = item.val
            this.oldList[1][field] = item.val
          } else if (item.grade.toLowerCase() === 'r') {
            r[field] = item.val
            this.oldList[0][field] = item.val
          } else if (item.grade.toLowerCase() === 'f') {
            f[field] = item.val
            this.oldList[2][field] = item.val
          } else if (item.grade.toLowerCase() === 't1') {
            t1[field] = item.val
            this.oldList[3][field] = item.val
          } else if (item.grade.toLowerCase() === 't2') {
            t2[field] = item.val
            this.oldList[4][field] = item.val
          } else if (item.grade.toLowerCase() === 't3') {
            t3[field] = item.val
            this.oldList[5][field] = item.val
          } else if (item.grade.toLowerCase() === 't4') {
            t4[field] = item.val
            this.oldList[6][field] = item.val
          } else if (item.grade.toLowerCase() === 't5') {
            t5[field] = item.val
            this.oldList[7][field] = item.val
          } else if (item.grade.toLowerCase() === 't6') {
            t6[field] = item.val
            this.oldList[8][field] = item.val
          } else if (item.grade.toLowerCase() === 't7') {
            t7[field] = item.val
            this.oldList[9][field] = item.val
          } else if (item.grade.toLowerCase() === 't8') {
            t8[field] = item.val
            this.oldList[10][field] = item.val
          }
          if (r[field] === undefined) {
            r[field] = ''
          }
          if (s[field] === undefined) {
            s[field] = ''
          }
          if (f[field] === undefined) {
            f[field] = ''
          }
          if (t1[field] === undefined) {
            t1[field] = ''
          }
          if (t2[field] === undefined) {
            t2[field] = ''
          }
          if (t3[field] === undefined) {
            t3[field] = ''
          }
          if (t4[field] === undefined) {
            t4[field] = ''
          }
          if (t5[field] === undefined) {
            t5[field] = ''
          }
          if (t6[field] === undefined) {
            t6[field] = ''
          }
          if (t7[field] === undefined) {
            t7[field] = ''
          }
          if (t8[field] === undefined) {
            t8[field] = ''
          }
        }
      }
      this.showCheckList.push(r)
      this.showCheckList.push(s)
      this.showCheckList.push(f)
      this.showCheckList.push(t8)
      this.showCheckList.push(t7)
      this.showCheckList.push(t6)
      this.showCheckList.push(t5)
      this.showCheckList.push(t4)
      this.showCheckList.push(t3)
      this.showCheckList.push(t2)
      this.showCheckList.push(t1)
    },
    getList(row) {
      this.showCheckList = []
      this.oldList = [
        { grade: 'R' },
        { grade: 'S' },
        { grade: 'F' },
        { grade: 'T8' },
        { grade: 'T7' },
        { grade: 'T6' },
        { grade: 'T5' },
        { grade: 'T4' },
        { grade: 'T3' },
        { grade: 'T2' },
        { grade: 'T1' }
      ]
      var keyse = {}
      var r = { grade: 'R', list: [] }
      var s = { grade: 'S' }
      var f = { grade: 'F' }
      var t1 = { grade: 'T1' }
      var t2 = { grade: 'T2' }
      var t3 = { grade: 'T3' }
      var t4 = { grade: 'T4' }
      var t5 = { grade: 'T5' }
      var t6 = { grade: 'T6' }
      var t7 = { grade: 'T7' }
      var t8 = { grade: 'T8' }
      if (row !== null && row.wyNormRules !== null) {
        for (const item of row.wyNormRules) {
          const field = this.findKeyToValue(item.field)
          if (keyse[field] === undefined) {
            r.list.push(field)
          }
          keyse[field] = ''
          if (item.grade.toLowerCase() === 's') {
            s[field] = item.val
            this.oldList[1][field] = item.val
          } else if (item.grade.toLowerCase() === 'r') {
            r[field] = item.val
            this.oldList[0][field] = item.val
          } else if (item.grade.toLowerCase() === 'f') {
            f[field] = item.val
            this.oldList[2][field] = item.val
          } else if (item.grade.toLowerCase() === 't1') {
            t1[field] = item.val
            this.oldList[3][field] = item.val
          } else if (item.grade.toLowerCase() === 't2') {
            t2[field] = item.val
            this.oldList[4][field] = item.val
          } else if (item.grade.toLowerCase() === 't3') {
            t3[field] = item.val
            this.oldList[5][field] = item.val
          } else if (item.grade.toLowerCase() === 't4') {
            t4[field] = item.val
            this.oldList[6][field] = item.val
          } else if (item.grade.toLowerCase() === 't5') {
            t5[field] = item.val
            this.oldList[7][field] = item.val
          } else if (item.grade.toLowerCase() === 't6') {
            t6[field] = item.val
            this.oldList[8][field] = item.val
          } else if (item.grade.toLowerCase() === 't7') {
            t7[field] = item.val
            this.oldList[9][field] = item.val
          } else if (item.grade.toLowerCase() === 't8') {
            t8[field] = item.val
            this.oldList[10][field] = item.val
          }
          if (keyse[field] === undefined) {
            keyse[field] = ''
          }
        }
      }
      this.showCheckList.push(r)
      this.showCheckList.push(s)
      this.showCheckList.push(f)
      this.showCheckList.push(t8)
      this.showCheckList.push(t7)
      this.showCheckList.push(t6)
      this.showCheckList.push(t5)
      this.showCheckList.push(t4)
      this.showCheckList.push(t3)
      this.showCheckList.push(t2)
      this.showCheckList.push(t1)
    },
    findKeyToValue(items) {
      let field = items
      if (items === 'eyes_exam') {
        field = '目检'
      } else {
        let flag = false
        for (let i = 0; i < this.plBaseList.length; i++) {
          if (this.plBaseList[i].thKey === items) {
            field = this.plBaseList[i].thName
            flag = true
            break
          }
        }
        if (!flag) {
          for (let i = 0; i < this.elBaseList.length; i++) {
            if (this.elBaseList[i].thKey === items) {
              field = this.elBaseList[i].thName
              flag = true
              break
            }
          }
        }
        if (!flag) {
          for (let i = 0; i < this.XRDBaseList.length; i++) {
            if (this.XRDBaseList[i].thKey === items) {
              field = this.XRDBaseList[i].thName
              flag = true
              break
            }
          }
        }
        if (!flag) {
          for (let i = 0; i < this.cowBaseList.length; i++) {
            if (this.cowBaseList[i].thKey === items) {
              field = this.cowBaseList[i].thName
              flag = true
              break
            }
          }
        }
      }
      return field
    },
    tableDbEdit(row, column, cell, event) {
      if (column.label !== '等级') {
        if (row[column.label] !== undefined) {
          row[column.label][1] = true
        }
      }
    },
    toLeft() {
      const selected = this.$refs.righttree.getCheckedNodes()
      this.plBaseList.map((item) => {
        for (const items of selected) {
          for (let i = 0; i < this.rightTree[0].children.length; i++) {
            if (this.rightTree[0].children[i].id === items.id) {
              this.rightTree[0].children.splice(i, 1)
              break
            }
          }
          if (item.thName === items.label) {
            this.leftTree[0].children.push({
              id: items.id,
              label: items.label
            })
            break
          }
        }
      })
      this.elBaseList.map((item) => {
        for (const items of selected) {
          for (let i = 0; i < this.rightTree[1].children.length; i++) {
            if (this.rightTree[1].children[i].id === items.id) {
              this.rightTree[1].children.splice(i, 1)
              break
            }
          }
          if (item.thName === items.label) {
            this.leftTree[1].children.push({
              id: items.id,
              label: items.label
            })
            break
          }
        }
      })
      this.XRDBaseList.map((item) => {
        for (const items of selected) {
          for (let i = 0; i < this.rightTree[2].children.length; i++) {
            if (this.rightTree[2].children[i].id === items.id) {
              this.rightTree[2].children.splice(i, 1)
              break
            }
          }
          if (item.thName === items.label) {
            this.leftTree[2].children.push({
              id: items.id,
              label: items.label
            })
            break
          }
        }
      })
      this.cowBaseList.map((item) => {
        for (const items of selected) {
          for (let i = 0; i < this.rightTree[3].children.length; i++) {
            if (this.rightTree[3].children[i].id === items.id) {
              this.rightTree[3].children.splice(i, 1)
              break
            }
          }
          if (item.thName === items.label) {
            this.leftTree[3].children.push({
              id: items.id,
              label: items.label
            })
            break
          }
        }
      })
      this.selectList = []
      for (const items of this.leftTree[0].children) {
        this.selectList.push(items.label)
      }
      for (const items of this.leftTree[1].children) {
        this.selectList.push(items.label)
      }
      for (const items of this.leftTree[2].children) {
        this.selectList.push(items.label)
      }
      for (const items of this.leftTree[3].children) {
        this.selectList.push(items.label)
      }
      for (const items of selected) {
        if (items.id === 5) {
          this.rightTree.splice(4, 1)
          this.leftTree.push({
            id: 5,
            label: '目检'
          })
          this.selectList.push('目检')
          break
        }
      }
      if (this.leftTree.length > 4 && this.selectList.join().indexOf('目检') < 0) {
        this.selectList.push('目检')
      }
      this.$refs.righttree.setCheckedKeys([])
    },
    toRight() {
      const selected = this.$refs.lefttree.getCheckedNodes()
      this.plBaseList.map((item) => {
        for (const items of selected) {
          for (let i = 0; i < this.leftTree[0].children.length; i++) {
            if (this.leftTree[0].children[i].id === items.id) {
              this.leftTree[0].children.splice(i, 1)
              break
            }
          }
          if (item.thName === items.label) {
            this.rightTree[0].children.push({
              id: items.id,
              label: items.label
            })
            break
          }
        }
      })
      this.elBaseList.map((item) => {
        for (const items of selected) {
          for (let i = 0; i < this.leftTree[1].children.length; i++) {
            if (this.leftTree[1].children[i].id === items.id) {
              this.leftTree[1].children.splice(i, 1)
              break
            }
          }
          if (item.thName === items.label) {
            this.rightTree[1].children.push({
              id: items.id,
              label: items.label
            })
            break
          }
        }
      })
      this.XRDBaseList.map((item) => {
        for (const items of selected) {
          for (let i = 0; i < this.leftTree[2].children.length; i++) {
            if (this.leftTree[2].children[i].id === items.id) {
              this.leftTree[2].children.splice(i, 1)
              break
            }
          }
          if (item.thName === items.label) {
            this.rightTree[2].children.push({
              id: items.id,
              label: items.label
            })
            break
          }
        }
      })
      this.cowBaseList.map((item) => {
        for (const items of selected) {
          for (let i = 0; i < this.leftTree[3].children.length; i++) {
            if (this.leftTree[3].children[i].id === items.id) {
              this.leftTree[3].children.splice(i, 1)
              break
            }
          }
          if (item.thName === items.label) {
            this.rightTree[3].children.push({
              id: items.id,
              label: items.label
            })
            break
          }
        }
      })
      for (const items of selected) {
        if (items.id === 5) {
          this.leftTree.splice(4, 1)
          this.rightTree.push({
            id: 5,
            label: '目检'
          })
          break
        }
      }
      this.selectList = []
      for (const items of this.leftTree[0].children) {
        this.selectList.push(items.label)
      }
      for (const items of this.leftTree[1].children) {
        this.selectList.push(items.label)
      }
      for (const items of this.leftTree[2].children) {
        this.selectList.push(items.label)
      }
      for (const items of this.leftTree[3].children) {
        this.selectList.push(items.label)
      }
      if (this.leftTree.length > 4) {
        this.selectList.push('目检')
      }
      this.$refs.lefttree.setCheckedKeys([])
    },
    toLeft1() {
      const selected = this.$refs.righttree1.getCheckedNodes()
      this.plBaseList.map((item) => {
        for (const items of selected) {
          for (let i = 0; i < this.rightTree1[0].children.length; i++) {
            if (this.rightTree1[0].children[i].id === items.id) {
              this.rightTree1[0].children.splice(i, 1)
              break
            }
          }
          if (item.thName === items.label) {
            this.leftTree1[0].children.push({
              id: items.id,
              label: items.label
            })
            break
          }
        }
      })
      this.elBaseList.map((item) => {
        for (const items of selected) {
          for (let i = 0; i < this.rightTree1[1].children.length; i++) {
            if (this.rightTree1[1].children[i].id === items.id) {
              this.rightTree1[1].children.splice(i, 1)
              break
            }
          }
          if (item.thName === items.label) {
            this.leftTree1[1].children.push({
              id: items.id,
              label: items.label
            })
            break
          }
        }
      })
      this.XRDBaseList.map((item) => {
        for (const items of selected) {
          for (let i = 0; i < this.rightTree1[2].children.length; i++) {
            if (this.rightTree1[2].children[i].id === items.id) {
              this.rightTree1[2].children.splice(i, 1)
              break
            }
          }
          if (item.thName === items.label) {
            this.leftTree1[2].children.push({
              id: items.id,
              label: items.label
            })
            break
          }
        }
      })
      this.cowBaseList.map((item) => {
        for (const items of selected) {
          for (let i = 0; i < this.rightTree1[3].children.length; i++) {
            if (this.rightTree1[3].children[i].id === items.id) {
              this.rightTree1[3].children.splice(i, 1)
              break
            }
          }
          if (item.thName === items.label) {
            this.leftTree1[3].children.push({
              id: items.id,
              label: items.label
            })
            break
          }
        }
      })
      this.selectList = []
      for (const items of this.leftTree1[0].children) {
        this.selectList.push(items.label)
      }
      for (const items of this.leftTree1[1].children) {
        this.selectList.push(items.label)
      }
      for (const items of this.leftTree1[2].children) {
        this.selectList.push(items.label)
      }
      for (const items of this.leftTree1[3].children) {
        this.selectList.push(items.label)
      }
      for (const items of selected) {
        if (items.id === 5) {
          this.rightTree1.splice(4, 1)
          this.leftTree1.push({
            id: 5,
            label: '目检'
          })
          this.selectList.push('目检')
          break
        }
      }
      if (this.leftTree1.length > 4 && this.selectList.join().indexOf('目检') < 0) {
        this.selectList.push('目检')
      }
      this.$refs.righttree1.setCheckedKeys([])
    },
    toRight1() {
      const selected = this.$refs.lefttree1.getCheckedNodes()
      this.plBaseList.map((item) => {
        for (const items of selected) {
          for (let i = 0; i < this.leftTree1[0].children.length; i++) {
            if (this.leftTree1[0].children[i].id === items.id) {
              this.leftTree1[0].children.splice(i, 1)
              break
            }
          }
          if (item.thName === items.label) {
            this.rightTree1[0].children.push({
              id: items.id,
              label: items.label
            })
            break
          }
        }
      })
      this.elBaseList.map((item) => {
        for (const items of selected) {
          for (let i = 0; i < this.leftTree1[1].children.length; i++) {
            if (this.leftTree1[1].children[i].id === items.id) {
              this.leftTree1[1].children.splice(i, 1)
              break
            }
          }
          if (item.thName === items.label) {
            this.rightTree1[1].children.push({
              id: items.id,
              label: items.label
            })
            break
          }
        }
      })
      this.XRDBaseList.map((item) => {
        for (const items of selected) {
          for (let i = 0; i < this.leftTree1[2].children.length; i++) {
            if (this.leftTree1[2].children[i].id === items.id) {
              this.leftTree1[2].children.splice(i, 1)
              break
            }
          }
          if (item.thName === items.label) {
            this.rightTree1[2].children.push({
              id: items.id,
              label: items.label
            })
            break
          }
        }
      })
      this.cowBaseList.map((item) => {
        for (const items of selected) {
          for (let i = 0; i < this.leftTree1[3].children.length; i++) {
            if (this.leftTree1[3].children[i].id === items.id) {
              this.leftTree1[3].children.splice(i, 1)
              break
            }
          }
          if (item.thName === items.label) {
            this.rightTree1[3].children.push({
              id: items.id,
              label: items.label
            })
            break
          }
        }
      })
      for (const items of selected) {
        if (items.id === 5) {
          this.leftTree1.splice(4, 1)
          this.rightTree1.push({
            id: 5,
            label: '目检'
          })
          break
        }
      }
      this.selectList = []
      for (const items of this.leftTree1[0].children) {
        this.selectList.push(items.label)
      }
      for (const items of this.leftTree1[1].children) {
        this.selectList.push(items.label)
      }
      for (const items of this.leftTree1[2].children) {
        this.selectList.push(items.label)
      }
      for (const items of this.leftTree1[3].children) {
        this.selectList.push(items.label)
      }
      if (this.leftTree1.length > 4) {
        this.selectList.push('目检')
      }
      this.$refs.lefttree1.setCheckedKeys([])
    },
    getTitle() {
      var data = [
        { grade: 'R', key: {}},
        { grade: 'S', key: {}},
        { grade: 'F', key: {}},
        { grade: 'T8', key: {}},
        { grade: 'T7', key: {}},
        { grade: 'T6', key: {}},
        { grade: 'T5', key: {}},
        { grade: 'T4', key: {}},
        { grade: 'T3', key: {}},
        { grade: 'T2', key: {}},
        { grade: 'T1', key: {}}
      ]
      for (const item of this.selectList) {
        for (let i = 0; i < 11; i++) {
          data[i].key[item] = ''
          if (this.showCheckList.length > 0 && this.showCheckList[i][item] !== undefined) {
            data[i][item] = this.showCheckList[i][item]
          } else {
            data[i].key[item] = ''
          }
        }
      }
      this.showCheckList = data
      this.isTrue = true
      this.configDialogVisible = false
    },
    getTitles() {
      var data = [
        { grade: 'R', key: {}},
        { grade: 'S', key: {}},
        { grade: 'F', key: {}},
        { grade: 'T8', key: {}},
        { grade: 'T7', key: {}},
        { grade: 'T6', key: {}},
        { grade: 'T5', key: {}},
        { grade: 'T4', key: {}},
        { grade: 'T3', key: {}},
        { grade: 'T2', key: {}},
        { grade: 'T1', key: {}}
      ]
      for (const item of this.selectList) {
        for (let i = 0; i < 11; i++) {
          data[i].key[item] = ''
          if (this.showCheckList[i][item] !== undefined) {
            data[i][item] = this.showCheckList[i][item]
          } else {
            data[i].key[item] = ''
          }
        }
      }
      this.showCheckList = data
      this.showCheckList[0].list = this.selectList
      this.isTrue = true
      this.configDialogVisible1 = false
    },
    setHasBZ() {
      for (const item of this.checkOptions) {
        if (item.id === this.allready) {
          for (const colors of this.colorOptions) {
            if (colors.code === item.color) {
              this.newcolor = colors.code
              break
            }
          }
          for (const models of this.modelOptions) {
            if (models.code === item.model) {
              this.newmodel = models.code
              break
            }
          }
          this.produceName()
          if (item.wyNormRules.length === 0) {
            this.setFirst()
            this.getTitle()
            break
          } else {
            this.leftTree = [
              {
                id: 1,
                label: 'PL',
                children: []
              },
              {
                id: 2,
                label: 'EL',
                children: []
              },
              {
                id: 3,
                label: 'XRD',
                children: []
              },
              {
                id: 4,
                label: 'COW',
                children: []
              }
            ]
            this.getTitle1(item)
            for (const ist in this.showCheckList[0].key) {
              if (ist === '目检') {
                this.leftTree.push({
                  id: 5,
                  label: '目检'
                })
              } else {
                for (let i = 0; i < this.plBaseList.length; i++) {
                  if (ist === this.plBaseList[i].thName) {
                    this.leftTree[0].children.push({
                      id: 1 + '' + i,
                      label: this.plBaseList[i].thName
                    })
                    break
                  }
                }
                for (let i = 0; i < this.elBaseList.length; i++) {
                  if (ist === this.elBaseList[i].thName) {
                    this.leftTree[1].children.push({
                      id: 2 + '' + i,
                      label: this.elBaseList[i].thName
                    })
                    break
                  }
                }
                for (let i = 0; i < this.XRDBaseList.length; i++) {
                  if (ist === this.XRDBaseList[i].thName) {
                    this.leftTree[2].children.push({
                      id: 3 + '' + i,
                      label: this.XRDBaseList[i].thName
                    })
                    break
                  }
                }
                for (let i = 0; i < this.cowBaseList.length; i++) {
                  if (ist === this.cowBaseList[i].thName) {
                    this.leftTree[3].children.push({
                      id: 4 + '' + i,
                      label: this.cowBaseList[i].thName
                    })
                    break
                  }
                }
              }
            }
            break
          }
        }
      }
    },
    // 添加
    handleAdd() {
      this.isTrue = false
      this.addDialogVisible = true
      this.allready = ''
      this.newmodel = ''
      this.newcolor = ''
      this.newname = ''
      this.showCheckList = []
      this.setFirst()
      this.getTitle()
      const requestParams = {
        pageSize: 10000,
        pageNum: 1
      }
      query(requestParams).then(res => {
        this.checkOptions = res.data.list
      })
    },
    setFirst() {
      this.leftTree = [
        {
          id: 1,
          label: 'PL',
          children: []
        },
        {
          id: 2,
          label: 'EL',
          children: []
        },
        {
          id: 3,
          label: 'XRD',
          children: []
        },
        {
          id: 4,
          label: 'COW',
          children: []
        },
        {
          id: 5,
          label: '目检'
        }
      ]
      for (let i = 0; i < this.plBaseList.length; i++) {
        if (this.plBaseList[i].thName === 'Wp_Std' || this.plBaseList[i].thName === 'Wd_Std') {
          this.leftTree[0].children.push({
            id: 1 + '' + i,
            label: this.plBaseList[i].thName
          })
        }
      }
      for (let i = 0; i < this.cowBaseList.length; i++) {
        if (this.cowBaseList[i].thName === '预估波长' ||
         this.cowBaseList[i].thName === 'VF1均值' ||
          this.cowBaseList[i].thName === 'VF4均值' ||
           this.cowBaseList[i].thName === 'VZ均值' ||
             this.cowBaseList[i].thName === 'ESD去坏(200V)' ||
              this.cowBaseList[i].thName === 'ESD去坏(400V)' ||
                this.cowBaseList[i].thName === 'ESD去坏(300V)' ||
                this.cowBaseList[i].thName === 'ESD去坏(50V)' ||
                  this.cowBaseList[i].thName === 'IV均值' ||
                  this.cowBaseList[i].thName === 'IR良率' ||
                    this.cowBaseList[i].thName === 'Thyristor良率' ||
                    this.cowBaseList[i].thName === 'VZ良率' ||
                      this.cowBaseList[i].thName === 'VF1良率') {
          this.leftTree[3].children.push({
            id: 4 + '' + i,
            label: this.cowBaseList[i].thName
          })
        }
      }
      this.selectList = []
      for (const items of this.leftTree[0].children) {
        this.selectList.push(items.label)
      }
      for (const items of this.leftTree[1].children) {
        this.selectList.push(items.label)
      }
      for (const items of this.leftTree[2].children) {
        this.selectList.push(items.label)
      }
      for (const items of this.leftTree[3].children) {
        this.selectList.push(items.label)
      }
      if (this.leftTree.length > 4) {
        this.selectList.push('目检')
      }
    },
    addConfig() {
      this.isTrue = false
      this.configDialogVisible = true
      this.rightTree = [
        {
          id: 1,
          label: 'PL',
          children: []
        },
        {
          id: 2,
          label: 'EL',
          children: []
        },
        {
          id: 3,
          label: 'XRD',
          children: []
        },
        {
          id: 4,
          label: 'COW',
          children: []
        }
      ]
      for (let i = 0; i < this.plBaseList.length; i++) {
        let flag = true
        for (const item of this.leftTree[0].children) {
          if (this.plBaseList[i].thName === item.label) {
            flag = false
            break
          }
        }
        if (flag) {
          this.rightTree[0].children.push({
            id: 1 + '' + i,
            label: this.plBaseList[i].thName
          })
        }
      }
      for (let i = 0; i < this.elBaseList.length; i++) {
        let flag = true
        for (const item of this.leftTree[1].children) {
          if (this.elBaseList[i].thName === item.label) {
            flag = false
            break
          }
        }
        if (flag) {
          this.rightTree[1].children.push({
            id: 2 + '' + i,
            label: this.elBaseList[i].thName
          })
        }
      }
      for (let i = 0; i < this.XRDBaseList.length; i++) {
        let flag = true
        for (const item of this.leftTree[2].children) {
          if (this.XRDBaseList[i].thName === item.label) {
            flag = false
            break
          }
        }
        if (flag) {
          this.rightTree[2].children.push({
            id: 3 + '' + i,
            label: this.XRDBaseList[i].thName
          })
        }
      }
      for (let i = 0; i < this.cowBaseList.length; i++) {
        let flag = true
        for (const item of this.leftTree[3].children) {
          if (this.cowBaseList[i].thName === item.label) {
            flag = false
            break
          }
        }
        if (flag) {
          this.rightTree[3].children.push({
            id: 4 + '' + i,
            label: this.cowBaseList[i].thName
          })
        }
      }
      if (this.leftTree.length <= 4) {
        this.rightTree.push({
          id: 5,
          label: '目检'
        })
      }
    },
    addConfig1() {
      this.isTrue = false
      this.configDialogVisible1 = true
      this.rightTree1 = [
        {
          id: 1,
          label: 'PL',
          children: []
        },
        {
          id: 2,
          label: 'EL',
          children: []
        },
        {
          id: 3,
          label: 'XRD',
          children: []
        },
        {
          id: 4,
          label: 'COW',
          children: []
        }
      ]
      for (let i = 0; i < this.plBaseList.length; i++) {
        let flag = true
        for (const item of this.leftTree1[0].children) {
          if (this.plBaseList[i].thName === item.label) {
            flag = false
            break
          }
        }
        if (flag) {
          this.rightTree1[0].children.push({
            id: 1 + '' + i,
            label: this.plBaseList[i].thName
          })
        }
      }
      for (let i = 0; i < this.elBaseList.length; i++) {
        let flag = true
        for (const item of this.leftTree1[1].children) {
          if (this.elBaseList[i].thName === item.label) {
            flag = false
            break
          }
        }
        if (flag) {
          this.rightTree1[1].children.push({
            id: 2 + '' + i,
            label: this.elBaseList[i].thName
          })
        }
      }
      for (let i = 0; i < this.XRDBaseList.length; i++) {
        let flag = true
        for (const item of this.leftTree1[2].children) {
          if (this.XRDBaseList[i].thName === item.label) {
            flag = false
            break
          }
        }
        if (flag) {
          this.rightTree1[2].children.push({
            id: 3 + '' + i,
            label: this.XRDBaseList[i].thName
          })
        }
      }
      for (let i = 0; i < this.cowBaseList.length; i++) {
        let flag = true
        for (const item of this.leftTree1[3].children) {
          if (this.cowBaseList[i].thName === item.label) {
            flag = false
            break
          }
        }
        if (flag) {
          this.rightTree1[3].children.push({
            id: 4 + '' + i,
            label: this.cowBaseList[i].thName
          })
        }
      }
      if (this.leftTree1.length <= 4) {
        this.rightTree1.push({
          id: 5,
          label: '目检'
        })
      }
    },
    // 取消
    resetForm() {
      this.addDialogVisible = false
      this.editDialogVisible = false
      this.configDialogVisible = false
      this.historyDialogVisible = false
      this.fetchData()
    },
    // 编辑
    handleEdit(row) {
      this.listLoading = true
      this.rowInfo = row
      this.getList(row)
      this.setTree()
      var _this = this
      setTimeout(() => {
        _this.editDialogVisible = true
        _this.listLoading = false
      }, 800)
    },
    setTree() {
      this.leftTree1 = [
        {
          id: 1,
          label: 'PL',
          children: []
        },
        {
          id: 2,
          label: 'EL',
          children: []
        },
        {
          id: 3,
          label: 'XRD',
          children: []
        },
        {
          id: 4,
          label: 'COW',
          children: []
        }
      ]
      for (const key of this.showCheckList[0].list) {
        if (key === '目检') {
          this.leftTree1.push({
            id: 5,
            label: '目检'
          })
        } else {
          for (let i = 0; i < this.plBaseList.length; i++) {
            if (this.plBaseList[i].thName === key) {
              this.leftTree1[0].children.push({
                id: 1 + '' + i,
                label: this.plBaseList[i].thName
              })
            }
          }
          for (let i = 0; i < this.elBaseList.length; i++) {
            if (this.elBaseList[i].thName === key) {
              this.leftTree1[1].children.push({
                id: 1 + '' + i,
                label: this.elBaseList[i].thName
              })
            }
          }
          for (let i = 0; i < this.XRDBaseList.length; i++) {
            if (this.XRDBaseList[i].thName === key) {
              this.leftTree1[2].children.push({
                id: 1 + '' + i,
                label: this.XRDBaseList[i].thName
              })
            }
          }
          for (let i = 0; i < this.cowBaseList.length; i++) {
            if (this.cowBaseList[i].thName === key) {
              this.leftTree1[3].children.push({
                id: 1 + '' + i,
                label: this.cowBaseList[i].thName
              })
            }
          }
        }
      }
      this.selectList = []
      for (const items of this.leftTree1[0].children) {
        this.selectList.push(items.label)
      }
      for (const items of this.leftTree1[1].children) {
        this.selectList.push(items.label)
      }
      for (const items of this.leftTree1[2].children) {
        this.selectList.push(items.label)
      }
      for (const items of this.leftTree1[3].children) {
        this.selectList.push(items.label)
      }
      if (this.leftTree1.length > 4) {
        this.selectList.push('目检')
      }
    },
    handleDelete(row, location) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          id: row.id,
          type: location === 'out' ? 1 : 0
        }
        remove(param).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          if (location !== 'out') {
            this.handleHistory(this.rowInfo)
          } else {
            this.fetchData()
          }
        })
      })
    },
    // 编辑提交
    submitEditForm() {
      const updateList = []
      let flag1 = false
      for (let i = 0; i < this.showCheckList.length; i++) {
        for (const items in this.showCheckList[i]) {
          if (items !== 'grade' && items !== 'list' && items !== 'key') {
            if (this.showCheckList[i][items] !== this.oldList[i][items]) {
              if (this.showCheckList[i][items] === '' && this.oldList[i][items] === undefined) {
                console.log(1)
              } else {
                flag1 = true
              }
            }
            let field = ''
            if (items === '目检') {
              field = 'eyes_exam'
            } else {
              let flag = false
              for (let i = 0; i < this.plBaseList.length; i++) {
                if (this.plBaseList[i].thName === items) {
                  field = this.plBaseList[i].thKey
                  flag = true
                  break
                }
              }
              if (!flag) {
                for (let i = 0; i < this.elBaseList.length; i++) {
                  if (this.elBaseList[i].thName === items) {
                    field = this.elBaseList[i].thKey
                    flag = true
                    break
                  }
                }
              }
              if (!flag) {
                for (let i = 0; i < this.XRDBaseList.length; i++) {
                  if (this.XRDBaseList[i].thName === items) {
                    field = this.XRDBaseList[i].thKey
                    flag = true
                    break
                  }
                }
              }
              if (!flag) {
                for (let i = 0; i < this.cowBaseList.length; i++) {
                  if (this.cowBaseList[i].thName === items) {
                    field = this.cowBaseList[i].thKey
                    flag = true
                    break
                  }
                }
              }
            }
            if (this.showCheckList[i][items] !== '' && field !== '') {
              updateList.push({
                grade: this.showCheckList[i].grade,
                field: field,
                val: this.showCheckList[i][items]
              })
            }
          }
        }
      }
      const object = Object.keys(this.oldList[0])
      if (this.showCheckList[0].list.length !== object.length - 1) {
        flag1 = true
      }
      if (flag1) {
        const up = {
          standard: {
            id: this.rowInfo.id,
            name: this.rowInfo.name,
            model: this.rowInfo.model,
            color: this.rowInfo.color,
            status: this.rowInfo.status,
            creator: sessionStorage.getItem('User-Id')
          },
          rules: updateList
        }
        if (updateList.length === 0) {
          this.$message({
            type: 'error',
            message: '判定标准不能为空!'
          })
          return
        }
        normUpdate(up).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.editDialogVisible = false
            this.fetchData()
          }
        })
      } else {
        this.editDialogVisible = false
      }
    },
    produceName() {
      if (this.newmodel === '' || this.newcolor === '') {
        return
      }
      const requestParams = {
        model: this.newmodel,
        color: this.newcolor
      }
      produceName(requestParams).then(res => {
        this.newname = res.data
      })
    },
    submitAddForm() {
      const updateList = []
      for (const item of this.showCheckList) {
        for (const items in item) {
          if (items !== 'grade' && items !== 'key') {
            let field = ''
            if (items === '目检') {
              field = 'eyes_exam'
            } else {
              let flag = false
              for (let i = 0; i < this.plBaseList.length; i++) {
                if (this.plBaseList[i].thName === items) {
                  field = this.plBaseList[i].thKey
                  flag = true
                  break
                }
              }
              if (!flag) {
                for (let i = 0; i < this.elBaseList.length; i++) {
                  if (this.elBaseList[i].thName === items) {
                    field = this.elBaseList[i].thKey
                    flag = true
                    break
                  }
                }
              }
              if (!flag) {
                for (let i = 0; i < this.XRDBaseList.length; i++) {
                  if (this.XRDBaseList[i].thName === items) {
                    field = this.XRDBaseList[i].thKey
                    flag = true
                    break
                  }
                }
              }
              if (!flag) {
                for (let i = 0; i < this.cowBaseList.length; i++) {
                  if (this.cowBaseList[i].thName === items) {
                    field = this.cowBaseList[i].thKey
                    flag = true
                    break
                  }
                }
              }
            }
            let val = item[items].replace(/and/gi, ' and ')
            val = val.replace(/or/gi, ' or ')
            if (field !== '') {
              updateList.push({
                grade: item.grade,
                field: field,
                val: val
              })
            }
          }
        }
      }
      if (this.newname === '') {
        this.$message({
          type: 'error',
          message: '请选择标准名称!'
        })
        return
      }
      if (updateList.length === 0) {
        this.$message({
          type: 'error',
          message: '新增判定标准不能为空!'
        })
        return
      }
      const up = {
        standard: {
          name: this.newname,
          model: this.newmodel,
          color: this.newcolor,
          status: 0,
          creator: sessionStorage.getItem('User-Id')
        },
        rules: updateList
      }
      normAdd(up).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          this.fetchData()
          this.addDialogVisible = false
        }
      })
    },
    exportAll(row) {
      var columnCn = '等级'
      var columnEn = 'grade'
      var setnumb = {}
      console.log(row.wyNormRules)
      console.log(row.id)
      for (const item of row.wyNormRules) {
        const field = this.findKeyToValue(item.field)
        setnumb[item.field] = field
      }
      for (const item in setnumb) {
        columnCn = columnCn + ',' + setnumb[item]
        columnEn = columnEn + ',' + item
      }
      window.open(process.env.BASE_API + `/wy-accept-norm/export-data?normId=${row.id}&headerCn=${columnCn}&headerEn=${columnEn}`, '_blank')
    },
    handleCurrentChange(row) {
      if (row !== null) {
        this.getList(row)
      }
    },
    handleSelectionChange(data) {
      this.selectLists = data
    },
    tableRowClassColor({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return {
          background: '#fff'
        }
      }
    },
    isQiYong(row) {
      if (!row.isChecked) {
        row.isChecked = true
        return
      }
      if (row.isChecked) {
        row.status = '0'
        for (let i = 0; i < this.historyList.length; i++) {
          if (row.id !== this.historyList[i].id) {
            this.historyList[i].status = '1'
            this.historyList[i].isChecked = false
            const requestParams = {
              id: this.historyList[i].id,
              status: this.historyList[i].status,
              type: 0
            }
            enableDisabled(requestParams).then(res => {
              console.log(res)
            })
          }
        }
      } else {
        row.status = '1'
      }
      const requestParams = {
        id: row.id,
        status: row.status,
        type: 0
      }
      enableDisabled(requestParams).then(res => {
        console.log(res)
      })
    }
  }
}

