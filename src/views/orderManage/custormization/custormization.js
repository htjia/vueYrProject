
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import custormizatoinDia from '../custormizatoinDia'
import { findOptions, findCustomer, disableEnable, deleteFake } from '@/api/orderManage/custormization'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd, custormizatoinDia },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      tableKey: 1,
      list: [],
      defaultFormThead: [],
      siteType: '',
      siteName: '',
      siteStatus: '',
      dialogTitle: '',
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      customerList: [], // 用户信息
      // 筛选参数
      searchKeys: {
        name: '',
        customerId: ''
      },
      // 方片参数
      FParams: [
        {
          name: 'WLD',
          paramCategory: 0,
          type: 'FP',
          id: 'wld'
        },
        {
          name: 'WLD_STD',
          paramCategory: 0,
          type: 'FP',
          id: 'wld_std'
        },
        {
          name: 'WLP',
          paramCategory: 0,
          type: 'FP',
          id: 'wlp'
        },
        {
          name: 'WLP_STD',
          paramCategory: 0,
          type: 'FP',
          id: 'wlp_std'
        },
        {
          name: 'WLC',
          paramCategory: 0,
          type: 'FP',
          id: 'wlc'
        },
        {
          name: 'WLC_STD',
          paramCategory: 0,
          type: 'FP',
          id: 'wlc_std'
        },
        {
          name: 'VF1',
          paramCategory: 0,
          type: 'FP',
          id: 'vf1'
        },
        {
          name: 'VF1_STD',
          paramCategory: 0,
          type: 'FP',
          id: 'vf1_std'
        },
        {
          name: 'IR',
          paramCategory: 0,
          type: 'FP',
          id: 'ir'
        },
        {
          name: 'IR_STD',
          paramCategory: 0,
          type: 'FP',
          id: 'ir_std'
        },
        {
          name: 'VZ',
          paramCategory: 0,
          type: 'FP',
          id: 'vz'
        },
        {
          name: 'VZ_STD',
          paramCategory: 0,
          type: 'FP',
          id: 'vz_std'
        },
        {
          name: 'LOP',
          paramCategory: 0,
          type: 'FP',
          id: 'lop'
        },
        {
          name: 'LOP_STD',
          paramCategory: 0,
          type: 'FP',
          id: 'lop_std'
        },
        {
          name: '研磨厚度',
          paramCategory: 1,
          type: 'FP',
          id: 'grind'
        },
        {
          name: '测试电流',
          paramCategory: 1,
          type: 'FP',
          id: 'electricity'
        },
        {
          name: 'ESD测试电压（正向）',
          paramCategory: 1,
          type: 'FP',
          id: 'esd_elec'
        },
        {
          name: 'ESD测试电压（反向）',
          paramCategory: 1,
          type: 'FP',
          id: 'esd_elec_reverse'
        }

      ],
      // 原片参数
      YParams: [
        {
          name: 'WLD',
          paramCategory: 0,
          type: 'YP',
          id: 'wld_avg'
        },
        {
          name: 'WLD_STD',
          paramCategory: 0,
          type: 'YP',
          id: 'wld_std'
        },
        {
          name: 'WLP',
          paramCategory: 0,
          type: 'YP',
          id: 'wlp_avg'
        },
        {
          name: 'WLP_STD',
          paramCategory: 0,
          type: 'YP',
          id: 'wlp_std'
        },
        {
          name: 'WLC',
          paramCategory: 0,
          type: 'YP',
          id: 'wlc_avg'
        },
        {
          name: 'WLC_STD',
          paramCategory: 0,
          type: 'YP',
          id: 'wlc_std'
        },
        {
          name: 'LOP',
          paramCategory: 0,
          type: 'YP',
          id: 'lop_avg'
        },
        {
          name: 'LOP_STD',
          paramCategory: 0,
          type: 'YP',
          id: 'lop_std'
        },
        {
          name: 'VF1',
          paramCategory: 0,
          type: 'YP',
          id: 'vf1_avg'
        },
        {
          name: 'VF1_STD',
          paramCategory: 0,
          type: 'YP',
          id: 'vf1_std'
        },
        {
          name: 'VF2',
          paramCategory: 0,
          type: 'YP',
          id: 'vf2_avg'
        },
        {
          name: 'VF2_STD',
          paramCategory: 0,
          type: 'YP',
          id: 'vf2_std'
        },
        {
          name: 'VF3',
          paramCategory: 0,
          type: 'YP',
          id: 'vf3_avg'
        },
        {
          name: 'VF3_STD',
          paramCategory: 0,
          type: 'YP',
          id: 'vf3_std'
        },
        {
          name: 'VF4',
          paramCategory: 0,
          type: 'YP',
          id: 'vf4_avg'
        },
        {
          name: 'VF4_STD',
          paramCategory: 0,
          type: 'YP',
          id: 'vf4_std'
        },
        {
          name: 'IR',
          paramCategory: 0,
          type: 'YP',
          id: 'ir_avg'
        },
        {
          name: 'IR_STD',
          paramCategory: 0,
          type: 'YP',
          id: 'ir_std'
        },
        {
          name: 'VZ',
          paramCategory: 0,
          type: 'YP',
          id: 'vz_avg'
        },
        {
          name: 'VZ_STD',
          paramCategory: 0,
          type: 'YP',
          id: 'vz_std'
        },
        {
          name: '归一亮度',
          paramCategory: 0,
          type: 'YP',
          id: 'norma_code'
        },
        {
          name: 'HW均值',
          paramCategory: 1,
          type: 'YP',
          id: 'hw_avg'
        },
        {
          name: '综合良率',
          paramCategory: 1,
          type: 'YP',
          id: 'comwayOne_yield'
        },
        {
          name: 'VF1良率',
          paramCategory: 1,
          type: 'YP',
          id: 'vf1_yield'
        },
        {
          name: 'VF2良率',
          paramCategory: 1,
          type: 'YP',
          id: 'vf2_yield'
        },
        {
          name: 'VF3良率',
          paramCategory: 1,
          type: 'YP',
          id: 'vf3_yield'
        },
        {
          name: 'VF4良率',
          paramCategory: 1,
          type: 'YP',
          id: 'vf4_yield'
        },
        {
          name: 'IR良率',
          paramCategory: 1,
          type: 'YP',
          id: 'ir_yield'
        },
        {
          name: 'DVF良率',
          paramCategory: 1,
          type: 'YP',
          id: 'dvf_yield'
        },
        {
          name: 'WLD良率',
          paramCategory: 1,
          type: 'YP',
          id: 'wld_yield'
        },
        {
          name: 'WLP良率',
          paramCategory: 1,
          type: 'YP',
          id: 'wlp_yield'
        },
        {
          name: 'WLC良率',
          paramCategory: 1,
          type: 'YP',
          id: 'wlc_yield'
        },
        {
          name: 'LOP良率',
          paramCategory: 1,
          type: 'YP',
          id: 'lop_yield'
        },
        {
          name: 'VZ良率',
          paramCategory: 1,
          type: 'YP',
          id: 'vz_yield'
        },
        {
          name: 'IV良率',
          paramCategory: 1,
          type: 'YP',
          id: 'iv_yield'
        },
        {
          name: 'EDS_IR_A良率',
          paramCategory: 1,
          type: 'YP',
          id: 'ir_esd_a_yield'
        },
        {
          name: 'WLD_5nm良率',
          paramCategory: 1,
          type: 'YP',
          id: 'wld_nm5_yield'
        },
        {
          name: 'WLP_5nm良率',
          paramCategory: 1,
          type: 'YP',
          id: 'wlp_nm5_yield'
        },
        {
          name: '研磨厚度',
          paramCategory: 1,
          type: 'YP',
          id: 'grind'
        },
        {
          name: '测试电流',
          paramCategory: 1,
          type: 'YP',
          id: 'electricity'
        },
        {
          name: 'ESD测试电压（正向）',
          paramCategory: 1,
          type: 'YP',
          id: 'esd_elec'
        },
        {
          name: 'ESD测试电压（反向）',
          paramCategory: 1,
          type: 'YP',
          id: 'esd_elec_reverse'
        }
      ],
      titleList: [],
      row: {},
      gRow: {},
      isRow: 0,
      hasChose: false
    }
  },
  mounted() {
    this.findCustomer()
    this.fetchData()
  },
  methods: {

    // 获取客户信息
    findCustomer() {
      findCustomer().then((res) => {
        this.customerList = res.data
      })
    },
    // 选择启用状态
    disableEnable(row) {
      this.$confirm(`是否确认${row.status ? '弃用' : '启用'}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        disableEnable({ id: row.id, status: row.status }).then(res => {
          this.currentChange(this.pageNum)
        })
      }).catch(err => {
        console.log(err)
        this.currentChange(this.pageNum)
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
    // 重置
    clearSearch() {
      this.searchKeys.name = ''
      this.searchKeys.customerId = ''
      this.handleSearch()
    },
    // 数组去重
    funcSet(arr) {
      // 拿到所有的片型信息
      const [...parameter] = [...this.FParams, ...this.YParams]
      // 拿到所有的表头信息
      const arr1 = Array.from(new Set([...arr]))
      const newArr = []
      // 便利所有的片型信息拿到表头
      parameter && parameter.map(_ => {
        // debugger
        arr1.map(i => {
          if (_.id === i) {
            newArr.push(_)
          }
        })
      })
      // 创建一个 result 数组的雏形
      const obj = {}
      for (const { name } of newArr) {
        obj[name] = ''
      }
      const result_ = Object.keys(obj).map(name => ({ name }))

      // 结束
      for (const [index, { name }] of result_.entries()) {
        for (const { name: name1, type, id } of newArr) {
          if (type && name === name1) result_[index][type] = id
        }
      }
      return result_
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const requestParams = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        name: this.searchKeys.name,
        customerId: this.searchKeys.customerId
      }
      findOptions(requestParams).then(res => {
        this.list = res.data.list
        const arr = []
        this.list.length && this.list.map(item => {
          item.detailList.map(_ => {
            arr.push(_.param)
          })
        })
        this.titleList = this.funcSet(arr)
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    dialogFalse(val) {
      this.addDialogVisible = val.dialog
      if (val.show) {
        this.fetchData()
      }
    },
    // 添加
    handleAdd() {
      this.isRow = 1
      this.dialogTitle = '新增客制化规则'
      this.addDialogVisible = true
    },
    // 参照新增
    referenceAdd() {
      if (this.hasChose) {
        if (this.gRow.name === '圆融默认方片规则' || this.gRow.name === '圆融默认圆片规则') {
          this.$message.error('此规则无法参照新增！')
        } else {
          this.isRow = 2
          this.dialogTitle = '新增客制化规则'
          this.addDialogVisible = true
          this.row = this.gRow
        }
      } else {
        this.$message.error('请先选择要参照的规则！')
      }
    },
    // 单选
    handelCurrentChange(row) {
      this.gRow = row
      this.hasChose = true
    },
    // 编辑
    handleEdit(row) {
      this.isRow = 2
      this.row = row
      this.dialogTitle = '编辑客制化规则'
      this.addDialogVisible = true
    },
    // 删除
    handleDelete(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteFake({ id: row.id }).then(res => {
          this.$message.success('删除成功')
          this.fetchData()
        })
      })
    }
  }
}

