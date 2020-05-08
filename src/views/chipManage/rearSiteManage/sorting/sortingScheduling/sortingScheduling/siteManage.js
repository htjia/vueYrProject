
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findMachineList, dispatch } from '@/api/chipManage/rearSiteManage/sorting/sortingScheduling'
import { findUserByRoleName } from '@/api/chipManage/frontSiteManage/cleanSite'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      activeTabIndex: 0,
      list: [],
      list1: [],
      userList: [],
      creator: '',
      machineId: '',
      machineList: [],
      waferNo: '',
      operate: '0'
    }
  },
  mounted() {
    this.findMachineList()
    this.customerList()
  },
  methods: {
    navClick(index) {
      this.activeTabIndex = index
    },
    findMachineList() {
      findMachineList().then(res => {
        this.machineList = res.data.list
      })
    },
    customerList() {
      findUserByRoleName({ roleName: '分选调度员' }).then(res => {
        this.userList = res.data
      })
    },
    // 查询
    fetchData() {
      if (this.machineId === '') {
        this.$message({
          type: 'error',
          message: '请先选择调度机台!'
        })
        return
      }
      if (this.creator === '') {
        this.$message({
          type: 'error',
          message: '请先选择调度人!'
        })
        return
      }
      this.listLoading = true
      let machine = ''
      for (const item of this.machineList) {
        if (item.id === this.machineId) {
          machine = item.code
          break
        }
      }
      const params = {
        machineId: this.machineId,
        machine: machine,
        waferNo: this.waferNo,
        creator: this.creator,
        type: this.activeTabIndex,
        operate: this.operate
      }
      dispatch(params).then(res => {
        let machineName = ''
        let userName = ''
        for (const item of this.machineList) {
          if (item.id === this.machineId) {
            machineName = item.code
            break
          }
        }
        for (const item of this.userList) {
          if (item.id === this.creator) {
            userName = item.name
            break
          }
        }
        if (res.data.status === -1) {
          this.$message({
            type: 'error',
            message: res.data.remark
          })
        } else {
          if (res.data.status === 1) {
            this.$message({
              type: 'error',
              message: res.data.remark
            })
          } else {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
          }
          if (this.activeTabIndex === 0) {
            this.list.splice(0, 0, {
              createTime: res.data.createTime,
              remark: res.data.remark,
              status: res.data.status,
              machineName: machineName,
              userName: userName,
              waferNo: this.waferNo
            })
          } else if (this.activeTabIndex === 1) {
            this.list1.splice(0, 0, {
              createTime: res.data.createTime,
              remark: res.data.remark,
              status: res.data.status,
              machineName: machineName,
              userName: userName,
              waferNo: this.waferNo
            })
          }
        }
        this.listLoading = false
        this.waferNo = ''
      }, () => {
        this.listLoading = false
        this.waferNo = ''
      })
    },
    getFind() {
      if (this.machineId !== '' && this.creator !== '' && this.waferNo !== '') {
        this.fetchData()
      }
    }
  }
}

