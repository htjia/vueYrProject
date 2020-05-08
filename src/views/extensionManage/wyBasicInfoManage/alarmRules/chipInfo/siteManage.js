
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { queryList, enabledisable, enabledisableplatter, levelList, findStructureType, addDetail, departQuery, noticeGroupSet } from '@/api/alarmRules'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      ruleSettingDialogVisible: false,
      ruleSettingDialogVisible1: false,
      configDialogVisible: false,
      activeTabIndex: 0,
      list: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      treeList: [],
      dplist: [],
      levelList: [],
      cdList: [],
      ellist: [],
      rowInfo: null,
      elValueList: [],
      selectTree: [],
      expandenList: []
    }
  },
  mounted() {
    this.fetchData()
  },
  computed: {
  },
  methods: {
    // 查询
    fetchData() {
      this.listLoading = true
      const requestParams = {
        pageSize: 15,
        pageNum: 1
      }
      queryList(requestParams).then(res => {
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
    ruleSetting(row) {
      this.rowInfo = row
      if (row.name.indexOf('大盘报警') > -1) {
        this.ruleSettingDialogVisible = true
        this.levelLists()
        this.dplist = []
        var l1 = { isChecked: true, name: 'PL_wd和同圈均值偏差＞', val: '', ruleId: row.id, status: 0, id: 0 }
        var l2 = { isChecked: true, name: 'PL_STD＞', val: '', ruleId: row.id, status: 0, id: 0 }
        var l3 = { isChecked: true, name: 'PL_I.I和同圈均值偏差＜', val: '', ruleId: row.id, status: 0, id: 0 }
        var l4 = { isChecked: true, name: '目检等级为', val: '', ruleId: row.id, status: 0, id: 0 }
        for (const item of this.rowInfo.ruleDetails) {
          if (item.name === l1.name) {
            l1.val = item.val
            l1.id = item.id
            if (item.status === '0') {
              l1.status = '0'
              l1.isChecked = true
            } else {
              l1.status = '1'
              l1.isChecked = false
            }
          } else if (item.name === l2.name) {
            l2.val = item.val
            l2.id = item.id
            if (item.status === '0') {
              l2.status = '0'
              l2.isChecked = true
            } else {
              l2.status = '1'
              l2.isChecked = false
            }
          } else if (item.name === l3.name) {
            l3.val = item.val
            l3.id = item.id
            if (item.status === '0') {
              l3.status = '0'
              l3.isChecked = true
            } else {
              l3.status = '1'
              l3.isChecked = false
            }
          } else if (item.name === l4.name) {
            l4.val = item.val
            l4.id = item.id
            if (item.status === '0') {
              l4.status = '0'
              l4.isChecked = true
            } else {
              l4.status = '1'
              l4.isChecked = false
            }
          }
        }
        this.dplist.push(l1)
        this.dplist.push(l2)
        this.dplist.push(l3)
        this.dplist.push(l4)
      } else {
        this.elValueList = []
        this.cdList = []
        this.ruleSettingDialogVisible1 = true
        this.cdfindList()
      }
    },
    gettreelist(data, value) {
      for (const item of data) {
        if (item.type === 2) {
          item.id = value.parentId + item.parentId + '-' + item.id
        }
        if (item.children.length > 0) {
          this.gettreelist(item.children, item)
        }
      }
    },
    configGroup(row) {
      this.rowInfo = row
      this.configDialogVisible = true
      this.selectTree = []
      departQuery().then(res => {
        this.gettreelist(res.data, null)
        this.treeList = res.data
        console.log(this.treeList)
        this.expandenList = [res.data[0].id]
        this.selectTree = []
        if (this.rowInfo.involveScope !== null && this.rowInfo.involveScope.length > 0) {
          setTimeout(() => {
            const li = this.rowInfo.involveScope.split(',')
            for (const items of li) {
              this.selectTree.push(items)
            }
            if (this.rowInfo.operatorId !== null && this.rowInfo.operatorId.length > 0) {
              setTimeout(() => {
                const peopleli = this.rowInfo.operatorId.split(',')
                for (const items of peopleli) {
                  // const li = items.split('-')
                  // this.selectTree.push(li[1])
                  this.selectTree.push(items)
                }
                this.$refs.tree.setCheckedKeys(this.selectTree)
              }, 100)
            } else {
              this.$refs.tree.setCheckedKeys(this.selectTree)
            }
          }, 100)
        } else {
          if (this.rowInfo.operatorId !== null && this.rowInfo.operatorId.length > 0) {
            setTimeout(() => {
              const peopleli = this.rowInfo.operatorId.split(',')
              for (const items of peopleli) {
                // const li = items.split('-')
                // this.selectTree.push(li[1])
                this.selectTree.push(items)
              }
              this.$refs.tree.setCheckedKeys(this.selectTree)
            }, 100)
          } else {
            this.$refs.tree.setCheckedKeys([])
          }
        }
      })
    },
    // stTrees(parendId, list) {
    //   for (const ch of list) {
    //     ch.id = parseInt(ch.mainId + '' + ch.grade)
    //     if (ch.grade === 3) {
    //       ch.parendId = parendId
    //       ch.id = parseInt(parendId + '' + ch.mainId + '' + ch.grade)
    //     } else {
    //       ch.id = parseInt(ch.mainId + '' + ch.grade)
    //     }
    //     if (ch.children !== null && ch.children.length > 0) {
    //       this.stTrees(ch.mainId, ch.children)
    //     }
    //   }
    //   return list
    // },
    // stKeys(items, list) {
    //   for (const ch of list) {
    //     if (ch.mainId === parseInt(items) && ch.grade === 1) {
    //       this.selectTree.push(ch.id)
    //     }
    //     if (ch.children !== null && ch.children.length > 0) {
    //       this.stKeys(items, ch.children)
    //     }
    //   }
    // },
    // stKeypeo(items, list) {
    //   for (const ch of list) {
    //     if (ch.grade === 3) {
    //       const it = items.split('-')
    //       if (ch.mainId === parseInt(it[1]) && ch.parendId === it[0]) {
    //         this.selectTree.push(ch.id)
    //         break
    //       }
    //     }
    //     if (ch.children !== null && ch.children.length > 0) {
    //       this.stKeypeo(items, ch.children)
    //     }
    //   }
    // },
    resetForm() {
      this.ruleSettingDialogVisible = false
      this.ruleSettingDialogVisible1 = false
      this.configDialogVisible = false
    },
    submitForm() {
      const requestParams = {
        ruleId: this.rowInfo.id,
        type: 3,
        list: this.dplist
      }
      addDetail(requestParams).then(res => {
        this.$message({
          type: 'success',
          message: '添加成功!'
        })
        this.ruleSettingDialogVisible = false
        this.fetchData()
      })
    },
    submitFormEl() {
      const lists = []
      let flag = true
      for (const item of this.elValueList) {
        if (item.VF1max !== '' && item.VF1min !== '') {
          if (parseFloat(item.VF1max) < parseFloat(item.VF1min)) {
            flag = false
          }
        }
        if (item.VF2max !== '' && item.VF2min !== '') {
          if (parseFloat(item.VF2max) < parseFloat(item.VF2min)) {
            flag = false
          }
        }
        if (item.VF3max !== '' && item.VF3min !== '') {
          if (parseFloat(item.VF3max) < parseFloat(item.VF3min)) {
            flag = false
          }
        }
        if (item.VF4max !== '' && item.VF4min !== '') {
          if (parseFloat(item.VF4max) < parseFloat(item.VF4min)) {
            flag = false
          }
        }
        if (item.LOPmax !== '' && item.LOPmin !== '') {
          if (parseFloat(item.LOPmax) < parseFloat(item.LOPmin)) {
            flag = false
          }
        }
        if (item.WLDmax !== '' && item.WLDmin !== '') {
          if (parseFloat(item.WLDmax) < parseFloat(item.WLDmin)) {
            flag = false
          }
        }
        if (item.VF1max !== '' || item.VF1min !== '') {
          lists.push({
            filed: 'VF1',
            ruleId: this.rowInfo.id,
            valMax: item.VF1max,
            valMin: item.VF1min,
            structureId: item.id
          })
        }
        if (item.VF2max !== '' || item.VF2min !== '') {
          lists.push({
            filed: 'VF2',
            ruleId: this.rowInfo.id,
            valMax: item.VF2max,
            valMin: item.VF2min,
            structureId: item.id
          })
        }
        if (item.VF3max !== '' || item.VF3min !== '') {
          lists.push({
            filed: 'VF3',
            ruleId: this.rowInfo.id,
            valMax: item.VF3max,
            valMin: item.VF3min,
            structureId: item.id
          })
        }
        if (item.VF4max !== '' || item.VF4min !== '') {
          lists.push({
            filed: 'VF4',
            ruleId: this.rowInfo.id,
            valMax: item.VF4max,
            valMin: item.VF4min,
            structureId: item.id
          })
        }
        if (item.LOPmax !== '' || item.LOPmin !== '') {
          lists.push({
            filed: 'LOP',
            ruleId: this.rowInfo.id,
            valMax: item.LOPmax,
            valMin: item.LOPmin,
            structureId: item.id
          })
        }
        if (item.WLDmax !== '' || item.WLDmin !== '') {
          lists.push({
            filed: 'WLD',
            ruleId: this.rowInfo.id,
            valMax: item.WLDmax,
            valMin: item.WLDmin,
            structureId: item.id
          })
        }
      }
      const requestParams = {
        ruleId: this.rowInfo.id,
        type: 0,
        list: lists
      }
      if (flag) {
        addDetail(requestParams).then(res => {
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          this.ruleSettingDialogVisible1 = false
          this.fetchData()
        })
      } else {
        this.$message({
          type: 'error',
          message: '最大值必须大于最小值!'
        })
      }
    },
    setStatus(row) {
      if (row.isChecked) {
        this.$confirm('确定启用' + row.name + '?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          row.status = '0'
          const requestParams = {
            id: row.id,
            status: row.status
          }
          enabledisable(requestParams).then(res => {
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
        this.$confirm('确定弃用' + row.name + '?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          row.status = '1'
          const requestParams = {
            id: row.id,
            status: row.status
          }
          enabledisable(requestParams).then(res => {
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
    setStatuss(row) {
      if (row.id === 0) {
        return
      }
      if (row.isChecked) {
        this.$confirm('确定启用?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          row.status = '0'
          const requestParams = {
            id: row.id,
            status: row.status
          }
          enabledisableplatter(requestParams).then(res => {
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
          row.status = '1'
          const requestParams = {
            id: row.id,
            status: row.status
          }
          enabledisableplatter(requestParams).then(res => {
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
    levelLists() {
      const requestParams = {
        pageSize: 100000,
        pageNum: 1
      }
      levelList(requestParams).then(res => {
        this.levelList = []
        for (let i = 0; i < res.data.list.length; i++) {
          if (res.data.list[i].status === '0') {
            res.data.list[i].isChecked = true
          } else {
            res.data.list[i].isChecked = false
          }
          this.levelList.push(res.data.list[i])
        }
      })
    },
    cdfindList() {
      findStructureType().then(res => {
        this.cdList = res.data.list
        for (const item of this.cdList) {
          var data = {}
          data = {
            VF1min: '',
            VF1max: '',
            VF2min: '',
            VF2max: '',
            VF3min: '',
            VF3max: '',
            VF4min: '',
            VF4max: '',
            LOPmin: '',
            LOPmax: '',
            WLDmin: '',
            WLDmax: '',
            id: item.id
          }
          if (this.rowInfo.ruleDetails.length > 0) {
            for (const row of this.rowInfo.ruleDetails) {
              if (item.id === row.structureId) {
                if (row.filed === 'VF1') {
                  if (row.valMin !== null) {
                    data.VF1min = row.valMin
                  }
                  if (row.valMax !== null) {
                    data.VF1max = row.valMax
                  }
                } else if (row.filed === 'VF2') {
                  if (row.valMin !== null) {
                    data.VF2min = row.valMin
                  }
                  if (row.valMax !== null) {
                    data.VF2max = row.valMax
                  }
                } else if (row.filed === 'VF3') {
                  if (row.valMin !== null) {
                    data.VF3min = row.valMin
                  }
                  if (row.valMax !== null) {
                    data.VF3max = row.valMax
                  }
                } else if (row.filed === 'VF4') {
                  if (row.valMin !== null) {
                    data.VF4min = row.valMin
                  }
                  if (row.valMax !== null) {
                    data.VF4max = row.valMax
                  }
                } else if (row.filed === 'LOP') {
                  if (row.valMin !== null) {
                    data.LOPmin = row.valMin
                  }
                  if (row.valMax !== null) {
                    data.LOPmax = row.valMax
                  }
                } else if (row.filed === 'WLD') {
                  if (row.valMin !== null) {
                    data.WLDmin = row.valMin
                  }
                  if (row.valMax !== null) {
                    data.WLDmax = row.valMax
                  }
                }
              }
            }
          }
          this.elValueList.push(data)
        }
      })
    },
    submitFormTree() {
      let involveScopeName = ''
      let operatorId = ''
      const selected = this.$refs.tree.getCheckedNodes()
      if (selected.length > 0) {
        for (const item of selected) {
          if (item.type === 0) {
            if (involveScopeName === '') {
              involveScopeName = item.id
            } else {
              involveScopeName = involveScopeName + ',' + item.id
            }
          } else if (item.type === 2) {
            if (operatorId === '') {
              // operatorId = item.parentId + '-' + item.id
              operatorId = item.id
            } else {
              // operatorId = operatorId + ',' + item.parentId + '-' + item.id
              operatorId = operatorId + ',' + item.id
            }
          }
        }
        const requestParams = {
          involveScope: involveScopeName,
          operatorId: operatorId,
          id: this.rowInfo.id
        }
        noticeGroupSet(requestParams).then(res => {
          this.$message({
            type: 'success',
            message: '配置成功!'
          })
          this.configDialogVisible = false
          this.fetchData()
        })
      } else {
        this.$message({
          type: 'error',
          message: '请选择通知组配置!'
        })
      }
    }
  }
}

