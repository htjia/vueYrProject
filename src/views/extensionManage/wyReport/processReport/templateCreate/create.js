
import PageHeaderLayout from '@/components/PageHeaderLayout'
import { insert, updateDetail } from '@/api/extensionManage/wyReport/processReport'
import { levelQuery } from '@/api/extensionManage/visualInspection/visualInspection'
export default {
  components: { PageHeaderLayout },
  data() {
    return {
      listLoading: false,
      notBastic: false,
      isNew: false,
      templateList: [{}, {}],
      treeKey: 0,
      chartModel: 0,
      tilterText: '',
      libraryId: '',
      levelTree: [
        {
          id: 'pl',
          label: 'PL',
          children: [
            { id: 'wp', disabled: false, label: 'Wp' },
            { id: 'wp_std', disabled: false, label: 'Wp_Std' },
            { id: 'wd', disabled: false, label: 'Wd' },
            { id: 'wd_std', disabled: false, label: 'Wd Std' },
            { id: 'fwhm', disabled: false, label: 'FWHM' },
            { id: 'fwhm_std', disabled: false, label: 'FWHM Std' },
            { id: 'pl_int', disabled: false, label: 'PL Int.' },
            { id: 'pl_int_std', disabled: false, label: 'PL Int. Std' },
            { id: 'ii', disabled: false, label: 'l.l' },
            { id: 'ii_std', disabled: false, label: 'l.l Std' },
            { id: 'pdavr', disabled: false, label: 'PDavr' },
            { id: 'pdstd', disabled: false, label: 'PD Std' },
            { id: 'th', disabled: false, label: 'TH' },
            { id: 'th_std', disabled: false, label: 'TH Std' },
            { id: 'ref', disabled: false, label: 'Ref.' },
            { id: 'ref_std', disabled: false, label: 'Ref. Std' },
            { id: 'bow', disabled: false, label: 'Bow' }
          ]
        },
        {
          id: 'el',
          label: 'EL',
          children: [
            { id: 'vf1', disabled: false, label: 'VF1' },
            { id: 'vf2', disabled: false, label: 'VF2' },
            { id: 'vf3', disabled: false, label: 'VF3' },
            { id: 'vf4', disabled: false, label: 'VF4' },
            { id: 'vz1', disabled: false, label: 'VZ1' },
            { id: 'vz2', disabled: false, label: 'VZ2' },
            { id: 'ir', disabled: false, label: 'IR' },
            { id: 'lop1', disabled: false, label: 'LOP1' },
            { id: 'wlp1', disabled: false, label: 'WLP1' },
            { id: 'wld1', disabled: false, label: 'WLD1' },
            { id: 'wlc1', disabled: false, label: 'WLC1' },
            { id: 'hw', disabled: false, label: 'HW' },
            { id: 'lop460', disabled: false, label: 'LOP(460)' }
          ]
        },
        {
          id: 'xrd',
          label: 'XRD',
          children: [
            { id: 'c_002', disabled: false, label: '002' },
            { id: 'c_102', disabled: false, label: '102' },
            { id: 'qb_th', disabled: false, label: 'QB Th.' },
            { id: 'qw_th', disabled: false, label: 'QW Th.' },
            { id: 'period', disabled: false, label: 'Period' },
            { id: 'in_value', disabled: false, label: 'In%' },
            { id: 'algan_th', disabled: false, label: 'AlGaN Th.' },
            { id: 'al_', disabled: false, label: 'Al%' }
          ]
        }
      ],
      chartModelOptions: [
        { id: 0, name: '单片散点图' },
        { id: 1, name: '圈别散点图' },
        { id: 2, name: '股价图' },
        { id: 3, name: '柱状图' }
      ],
      siteName: '',
      moduleTitle: '工艺视图配置',
      siteStatus: '',
      pageSize: 12,
      pageNum: 1,
      totalPage: 0,
      templateName: '',
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      treeList: [],
      treeData: [
        {
          id: 'pl',
          label: 'PL',
          children: [
            { id: 'wp', disabled: false, label: 'Wp' },
            { id: 'wp_std', disabled: false, label: 'Wp_Std' },
            { id: 'wd', disabled: false, label: 'Wd' },
            { id: 'wd_std', disabled: false, label: 'Wd Std' },
            { id: 'fwhm', disabled: false, label: 'FWHM' },
            { id: 'fwhm_std', disabled: false, label: 'FWHM Std' },
            { id: 'pl_int', disabled: false, label: 'PL Int.' },
            { id: 'pl_int_std', disabled: false, label: 'PL Int. Std' },
            { id: 'ii', disabled: false, label: 'l.l' },
            { id: 'ii_std', disabled: false, label: 'l.l Std' },
            { id: 'pdavr', disabled: false, label: 'PDavr' },
            { id: 'pdstd', disabled: false, label: 'PD Std' },
            { id: 'th', disabled: false, label: 'TH' },
            { id: 'th_std', disabled: false, label: 'TH Std' },
            { id: 'ref', disabled: false, label: 'Ref.' },
            { id: 'ref_std', disabled: false, label: 'Ref. Std' },
            { id: 'bow', disabled: false, label: 'Bow' }
          ]
        },
        {
          id: 'el',
          label: 'EL',
          children: [
            { id: 'vf1', disabled: false, label: 'VF1' },
            { id: 'vf2', disabled: false, label: 'VF2' },
            { id: 'vf3', disabled: false, label: 'VF3' },
            { id: 'vf4', disabled: false, label: 'VF4' },
            { id: 'vz1', disabled: false, label: 'VZ1' },
            { id: 'vz2', disabled: false, label: 'VZ2' },
            { id: 'ir', disabled: false, label: 'IR' },
            { id: 'lop1', disabled: false, label: 'LOP1' },
            { id: 'wlp1', disabled: false, label: 'WLP1' },
            { id: 'wld1', disabled: false, label: 'WLD1' },
            { id: 'wlc1', disabled: false, label: 'WLC1' },
            { id: 'hw', disabled: false, label: 'HW' },
            { id: 'lop460', disabled: false, label: 'LOP(460)' }
          ]
        },
        {
          id: 'xrd',
          label: 'XRD',
          children: [
            { id: 'c_002', disabled: false, label: '002' },
            { id: 'c_102', disabled: false, label: '102' },
            { id: 'qb_th', disabled: false, label: 'QB Th.' },
            { id: 'qw_th', disabled: false, label: 'QW Th.' },
            { id: 'period', disabled: false, label: 'Period' },
            { id: 'in_value', disabled: false, label: 'In%' },
            { id: 'algan_th', disabled: false, label: 'AlGaN Th.' },
            { id: 'al_', disabled: false, label: 'Al%' }
          ]
        }
      ],
      cowCotTreeList: [
        {
          id: 'cow',
          label: 'COW',
          children: [
            { id: 'avg_iv', disabled: false, label: 'IV均值' },
            { id: 'avg_vf1', disabled: false, label: 'VF1均值' },
            { id: 'vf1_esd_avg', disabled: false, label: 'VF1_ESD_A均值' },
            { id: 'vf1_esd_differ', disabled: false, label: 'VF1_ESD差值' },
            { id: 'avg_vz', disabled: false, label: 'VZ均值' },
            { id: 'blue_shift', disabled: false, label: '蓝移' },
            { id: 'valk', disabled: false, label: 'K值' },
            { id: 'esd_200', disabled: false, label: 'ESD去坏(200V)' },
            { id: 'esd_400', disabled: false, label: 'ESD去坏(400V)' },
            { id: 'esd_50', disabled: false, label: 'ESD去坏(50V)' },
            { id: 'esd_500', disabled: false, label: 'ESD去坏(500V)' },
            { id: 'esd_300', disabled: false, label: 'ESD去坏(300V)' },
            { id: 'esd_1000', disabled: false, label: 'ESD去坏(1000V)' },
            { id: 'esd_2000', disabled: false, label: 'ESD去坏(2000V)' },
            { id: 'esd_4000', disabled: false, label: 'ESD去坏(4000V)' },
            { id: 'yield_thyristor', disabled: false, label: 'Thyristor良率' },
            { id: 'num_thyristor', disabled: false, label: 'Thyristor坏点数' },
            { id: 'avg_dvf', disabled: false, label: 'DVF均值' },
            { id: 'yield_zh', disabled: false, label: '综合良率' },
            { id: 'yield_vf1', disabled: false, label: 'VF1良率' },
            { id: 'yield_vf3', disabled: false, label: 'VF3良率' },
            { id: 'yield_wld1', disabled: false, label: 'WLD1良率' },
            { id: 'yield_ir', disabled: false, label: 'IR良率' },
            { id: 'yield_vz', disabled: false, label: 'VZ良率' },
            { id: 'yield_iv', disabled: false, label: 'IV良率' },
            { id: 'yield_vf4', disabled: false, label: 'VF4良率' },
            { id: 'avg_vf2', disabled: false, label: 'VF2均值' },
            { id: 'avg_vf3', disabled: false, label: 'VF3均值' },
            { id: 'avg_vf4', disabled: false, label: 'VF4均值' },
            { id: 'avg_wld1', disabled: false, label: 'WLD1均值' },
            { id: 'wld1_std', disabled: false, label: 'WLD1_STD' },
            { id: 'avg_wlp1', disabled: false, label: 'WLP1均值' },
            { id: 'hw1', disabled: false, label: 'HW1' },
            { id: 'avg_wld2', disabled: false, label: 'WLD2均值' },
            { id: 'wld2_std', disabled: false, label: 'WLD2_STD' },
            { id: 'hw2', disabled: false, label: 'HW2' },
            { id: 'avg_wlp2', disabled: false, label: 'wlp2均值' },
            { id: 'avg_ir', disabled: false, label: 'IR均值' },
            { id: 'pl_wp', disabled: false, label: 'PL_WP' },
            { id: 'pl_wd', disabled: false, label: 'PL_WD' },
            { id: 'pl_wd_std', disabled: false, label: 'PL_WD_STD' },
            { id: 'pl_ii', disabled: false, label: 'PL.I.I' },
            { id: 'ir_esd_yield', disabled: false, label: 'IR_ESD_A良率' },
            { id: 'vf1_esd_yield', disabled: false, label: 'VF1_ESD良率' }
          ]
        },
        {
          id: 'cot',
          label: 'COT',
          children: [
            { id: 'iv_svr', disabled: false, label: 'IV均值' },
            { id: 'vf1_svr', disabled: false, label: 'VF1均值' },
            { id: 'vz_svr', disabled: false, label: 'VZ均值' },
            { id: 'thyristor_yield', disabled: false, label: 'Thyristor良率' },
            { id: 'thyristor_bad', disabled: false, label: 'Thyristor坏点' },
            { id: 'compre_yield', disabled: false, label: '综合良率' },
            { id: 'product_yield', disabled: false, label: '生产良率' },
            { id: 'vf1_yield', disabled: false, label: 'VF1良率' },
            { id: 'vf3_yield', disabled: false, label: 'VF3良率' },
            { id: 'vf4_yield', disabled: false, label: 'VF4良率' },
            { id: 'wld1_yield', disabled: false, label: 'WLD1良率' },
            { id: 'wlp1_yield', disabled: false, label: 'WLP1良率' },
            { id: 'ir_yield', disabled: false, label: 'IR良率' },
            { id: 'ir_esd_yield', disabled: false, label: 'IR_ESD_A良率' },
            { id: 'vz_yield', disabled: false, label: 'VZ良率' },
            { id: 'iv_yield', disabled: false, label: 'IV良率' },
            { id: 'vf2_svr', disabled: false, label: 'VF2均值' },
            { id: 'vf3_svr', disabled: false, label: 'VF3均值' },
            { id: 'vf4_svr', disabled: false, label: 'VF4均值' },
            { id: 'wld1_svr', disabled: false, label: 'WLD1均值' },
            { id: 'wld1_std', disabled: false, label: 'WLD1_STD' },
            { id: 'wlp1_svr', disabled: false, label: 'WLP1均值' },
            { id: 'hw1', disabled: false, label: 'HW1' },
            { id: 'wld2_svr', disabled: false, label: 'WLD2均值' },
            { id: 'bs', disabled: false, label: 'BS' },
            { id: 'ir_svr', disabled: false, label: 'IR均值' }
          ]
        }
      ]
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.libraryId = this.$route.query.id
      this.templateName = this.$route.query.name
      if (this.$route.query.type === 0) {
        this.addTemplate('工艺视图配置')
      } else {
        setTimeout(() => {
          this.addTemplate('COW/COT视图配置')
        }, 100)
      }
    }
    this.levelQuery()
    this.treeList = this.levelTree
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    chartModelChange(title) {
      console.log(this.chartModel)
      if (this.chartModel === 3) {
        console.log(this.levelTree)
        this.treeList = this.levelTree
      } else {
        this.treeList = this.treeData
      }
      if (title === '工艺视图配置') {
        this.chartModel = 0
        this.treeList = this.treeData
      }
      if (title === 'COW/COT视图配置') {
        console.log(123444)
        this.treeList = this.cowCotTreeList
      }
      this.treeKey++
      this.treeList.map(item => {
        item.children.map(child => {
          child['disabled'] = false
        })
      })
      this.$refs.tree.setCheckedKeys([])
    },
    submitCancel() {
      this.$router.go(-1)
    },
    levelQuery() {
      const params = {
        pageNum: 1,
        pageSize: 10000,
        status: 0
      }
      levelQuery(params).then(res => {
        const level = {
          id: 'mj',
          label: '目检'
        }
        const children = []
        res.data.list.map(item => {
          children.push({
            id: item.id,
            label: item.name,
            disabled: false
          })
        })
        level.children = children
        this.levelTree.push(level)
      })
    },
    checkChange(data) {
      this.chekedKeys = this.$refs.tree.getCheckedKeys()
      if (this.chekedKeys.length === 0) {
        this.treeList.map(item => {
          item.children.map(child => {
            child['disabled'] = false
          })
        })
      }
      if (this.moduleTitle === '工艺视图配置') {
        if (this.chartModel === 0) {
          console.log(this.chekedKeys.length)
          if (this.chekedKeys.length === 1) {
            this.treeList.map(item => {
              if (item.id !== this.$refs.tree.getNode(this.chekedKeys[0]).parent.key) {
                item.children.map(child => {
                  child['disabled'] = true
                })
              } else {
                item.children.map(child => {
                  child['disabled'] = false
                })
              }
            })
          } else if (this.chekedKeys.length === 2) {
            this.treeList.map(item => {
              if (item.id !== this.$refs.tree.getNode(this.chekedKeys[0]).parent.key) {
                item.children.map(child => {
                  child['disabled'] = true
                })
              } else {
                item.children.map(child => {
                  if (!this.chekedKeys.includes(child.id)) {
                    child['disabled'] = true
                  }
                })
              }
            })
          }
        } else {
          if (this.$refs.tree.getNode(this.chekedKeys[0]).parent.key === 'mj') {
            this.treeList.map(item => {
              if (item.id !== this.$refs.tree.getNode(this.chekedKeys[0]).parent.key) {
                item.children.map(child => {
                  child['disabled'] = true
                })
              } else {
                if (this.chekedKeys.length === 1) {
                  this.treeList.map(item => {
                    if (item.id !== this.$refs.tree.getNode(this.chekedKeys[0]).parent.key) {
                      item.children.map(child => {
                        child['disabled'] = true
                      })
                    } else {
                      item.children.map(child => {
                        child['disabled'] = false
                      })
                    }
                  })
                } else if (this.chekedKeys.length === 2) {
                  this.treeList.map(item => {
                    if (item.id !== this.$refs.tree.getNode(this.chekedKeys[0]).parent.key) {
                      item.children.map(child => {
                        child['disabled'] = true
                      })
                    } else {
                      item.children.map(child => {
                        if (!this.chekedKeys.includes(child.id)) {
                          child['disabled'] = true
                        }
                      })
                    }
                  })
                }
              }
            })
          } else {
            this.treeList.map(item => {
              if (item.id !== this.$refs.tree.getNode(this.chekedKeys[0]).parent.key) {
                item.children.map(child => {
                  child['disabled'] = true
                })
              } else {
                if (this.chekedKeys.length === 1) {
                  this.treeList.map(item => {
                    if (item.id === this.$refs.tree.getNode(this.chekedKeys[0]).parent.key) {
                      item.children.map(child => {
                        if (!this.chekedKeys.includes(child.id)) {
                          child['disabled'] = true
                        }
                      })
                    }
                  })
                }
              }
            })
          }
        }
      } else {
        if (this.chekedKeys.length === 0) {
          this.treeList.map(item => {
            item.children.map(child => {
              child['disabled'] = false
            })
          })
        } else {
          this.treeList.map(item => {
            item.children.map(child => {
              if (!this.chekedKeys.includes(child.id)) {
                child['disabled'] = true
              }
            })
          })
        }
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    addTemplate(title) {
      this.moduleTitle = title
      this.chartModelChange(title)
    },
    finishedCreateTemplate() {
      this.$router.push({ path: '/wyReport/templateShow', query: { id: this.libraryId, name: this.templateName }})
    },
    // 添加提交
    submitForm() {
      console.log(this.chekedKeys)
      console.log(this.$refs.tree.getNode(this.chekedKeys[0]).parent.key)
      if (this.libraryId === '') {
        if (this.templateName.trim() === '') {
          this.$message({
            type: 'error',
            message: '模板名称不能为空!'
          })
          return false
        }
        if (this.chekedKeys.length === 0) {
          this.$message({
            type: 'error',
            message: '参数配置不能为空!'
          })
          return false
        }
        const params = {
          name: this.templateName
        }
        insert(params).then(res => {
          this.libraryId = res.data
          const chartParms = {
            chartType: this.moduleTitle === '工艺视图配置' ? this.chartModel : 4,
            dataType: this.$refs.tree.getNode(this.chekedKeys[0]).parent.key,
            leftField: this.chekedKeys[0],
            libraryId: res.data,
            rightField: this.chekedKeys.length > 1 ? this.chekedKeys[1] : ''
          }
          updateDetail(chartParms).then(res => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
          })
        })
      } else {
        const params = {
          chartType: this.chartModel,
          dataType: this.$refs.tree.getNode(this.chekedKeys[0]).parent.key,
          leftField: this.chekedKeys[0],
          libraryId: this.libraryId,
          rightField: this.chekedKeys.length > 1 ? this.chekedKeys[1] : ''
        }
        updateDetail(params).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
      }
    },
    // 取消
    resetForm() {
      this.editDialogVisible = false
    },
    exportAll() {
      const startTime = this.beginDate === '' ? '' : this.formatDate(this.beginDate)
      const endTime = this.endDate === '' ? '' : this.formatDate(this.endDate)
      window.open(process.env.BASE_API + `/wy-data-maintain/export-data?waferId=${this.waferId}&operatorName=${this.operName}&startTime=${startTime}&endTime=${endTime}`)
    }
  }
}

