
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findList, update, updateParams, findHistory, historyEnable } from '@/api/fqc/waferInStandard'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      historyDialogVisible: false,
      editDialogVisible: false,
      activeTabIndex: 0,
      radio: 0,
      currentName: '',
      currentType: '',
      list: [],
      historyList: [],
      userOptions: [],
      selectedRunRow: {},
      updateForm: {
        name: '',
        zf: '',
        compreYield: '',
        vf1Yield: '',
        vf2Yield: '',
        vf3Yield: '',
        vf4Yield: '',
        irYield: '',
        dvfYield: '',
        wldYield: '',
        wlpYield: '',
        wlcYield: '',
        vzYield: '',
        ivYield: '',
        irEsdAYield: '',
        wldNm5Yield: '',
        wlpNm5Yield: ''
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    tabClick(index) {
      this.activeTabIndex = index
    },
    handleEdit(row) {
      this.getParamsData(row)
      this.editDialogVisible = true
    },
    getParamsData(row) {
      this.currentId = row.id
      this.currentName = row.name
      this.updateForm.name = row.name + '-' + row.version
      this.updateForm.zf = row.type === 0 ? '正品' : '副品'
      this.currentType = row.type
      const paramsData = {}
      row.params.map(item => {
        const key = item.field
        paramsData[key] = item.val
      })
      this.updateForm.compreYield = paramsData.compreYield
      this.updateForm.vf1Yield = paramsData.vf1Yield
      this.updateForm.vf2Yield = paramsData.vf2Yield
      this.updateForm.vf3Yield = paramsData.vf3Yield
      this.updateForm.vf4Yield = paramsData.vf4Yield
      this.updateForm.irYield = paramsData.irYield
      this.updateForm.dvfYield = paramsData.dvfYield
      this.updateForm.wldYield = paramsData.wldYield
      this.updateForm.wlpYield = paramsData.wlpYield
      this.updateForm.wlcYield = paramsData.wlcYield
      this.updateForm.vzYield = paramsData.vzYield
      this.updateForm.ivYield = paramsData.ivYield
      this.updateForm.irEsdAYield = paramsData.irEsdAYield
      this.updateForm.wldNm5Yield = paramsData.wldNm5Yield
      this.updateForm.wlpNm5Yield = paramsData.wlpNm5Yield
    },
    // 单击历史版本信息
    rowClick(row) {
      this.radio = row.id
      this.selectedRunRow = row
      this.getParamsData(row)
    },
    // 历史版本
    handleHistory(row) {
      const params = {
        name: row.name
      }
      findHistory(params).then(res => {
        res.data.map(item => {
          if (item.status === 0) {
            this.radio = item.id
            this.$refs.historyTable.setCurrentRow(item)
            this.getParamsData(item)
          }
        })
        this.historyList = res.data
      })
      this.historyDialogVisible = true
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const params = {
        pageNum: 1,
        pageSize: 1000
      }
      findList(params).then(res => {
        res.data.list.map((item) => {
          item.status = item.status === 0
        })
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    submitParamsForm() {
      const paramsValue = [
        { field: 'compreYield', label: '综合良率', val: this.updateForm.compreYield },
        { field: 'vf1Yield', label: 'VF1良率', val: this.updateForm.vf1Yield },
        { field: 'vf2Yield', label: 'VF2良率', val: this.updateForm.vf2Yield },
        { field: 'vf3Yield', label: 'VF3良率', val: this.updateForm.vf3Yield },
        { field: 'vf4Yield', label: 'VF4良率', val: this.updateForm.vf4Yield },
        { field: 'irYield', label: 'IR良率', val: this.updateForm.irYield },
        { field: 'dvfYield', label: 'DVF良率', val: this.updateForm.dvfYield },
        { field: 'wldYield', label: 'WLD良率', val: this.updateForm.wldYield },
        { field: 'wlpYield', label: 'WLP良率', val: this.updateForm.wlpYield },
        { field: 'wlcYield', label: 'WLC良率', val: this.updateForm.wlcYield },
        { field: 'vzYield', label: 'VZ良率', val: this.updateForm.vzYield },
        { field: 'ivYield', label: 'LOP1良率', val: this.updateForm.ivYield },
        { field: 'irEsdAYield', label: 'EDS_IR_A良率', val: this.updateForm.irEsdAYield },
        { field: 'wldNm5Yield', label: 'WLD_5nm良率', val: this.updateForm.wldNm5Yield },
        { field: 'wlpNm5Yield', label: 'WLP_5nm良率', val: this.updateForm.wlpNm5Yield }
      ]
      const params = {
        id: this.currentId,
        name: this.currentName,
        type: this.currentType,
        creator: sessionStorage.getItem('User-Id'),
        params: paramsValue
      }
      updateParams(params).then(res => {
        this.$message({
          type: 'success',
          message: '编辑成功!'
        })
        this.editDialogVisible = false
        this.fetchData()
      })
    },
    switchChange(row) {
      let alertMsg = ''
      if (!row.status) {
        alertMsg = '是否确认弃用'
      } else {
        alertMsg = '是否确认启用'
      }
      this.$confirm(alertMsg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          id: row.id,
          status: row.status ? 0 : 1
        }
        update(param).then(res => {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.fetchData()
        })
      }).catch(() => {
        row.status = !row.status
      })
    },
    // 提交选择的历史版本
    setHistoryEnable() {
      const param = {
        id: this.radio
      }
      historyEnable(param).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.historyDialogVisible = false
        this.fetchData()
      })
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    // 取消
    resetForm(formName) {
      this.editDialogVisible = false
      this.$refs[formName].resetFields()
    }
  }
}

