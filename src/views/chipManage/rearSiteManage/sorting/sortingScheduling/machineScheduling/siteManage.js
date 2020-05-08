
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findList, findMachineList, productList, findColorList, findModelList, findGYList, findBinList, cotfindMachineList, save } from '@/api/chipManage/rearSiteManage/sorting/machineScheduling'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      list: [],
      machine: '',
      machineList: [],
      productCode: '',
      productLists: [],
      modelList: [],
      colorList: [],
      gyList: [],
      cotMachineList: [],
      findBinLists: []
    }
  },
  mounted() {
    this.fetchData()
    this.findMachineList()
    this.productList()
    this.findModelList()
    this.findColorList()
    this.findGYList()
    this.cotfindMachineList()
  },
  methods: {
    findBinList(index, name) {
      const param = {
        color: this.list[index].color,
        model: this.list[index].model,
        craft: this.list[index].craft
      }
      findBinList(param).then(res => {
        this.list[index].findBinList = res.data
        this.findBinLists = res.data
        console.log(this.list[index].findBinList)
      })
    },
    getBinList(index, type) {
      let color = ''
      if (this.list[index].color !== null) {
        color = this.list[index].color
      }
      let model = ''
      if (this.list[index].model !== null) {
        model = this.list[index].model
      }
      let craft = ''
      if (this.list[index].craft !== null) {
        craft = this.list[index].craft
      }
      const name = color + model + craft
      this.findBinList(index, name)
      if (type !== 0) {
        const selectBins = []
        for (let i = 0; i < this.list[index].binVersion.length; i++) {
          for (let j = 0; j < this.findBinLists.length; j++) {
            if (this.list[index].binVersion[i] === this.findBinLists[j]) {
              selectBins.push(this.list[index].binVersion[i])
            }
          }
        }
        this.list[index].binVersion = selectBins
      }
    },
    cotfindMachineList() {
      cotfindMachineList().then(res => {
        this.cotMachineList = res.data.list
      })
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
    findMachineList() {
      findMachineList().then(res => {
        this.machineList = res.data.list
      })
    },
    productList() {
      productList().then(res => {
        this.productLists = res.data
      })
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const params = {
        machineId: this.machine,
        fxType: this.productCode === '' ? '' : this.productCode.split('-')[0]
      }
      findList(params).then(res => {
        this.list = []
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].isEdit = false
          res.data[i].findBinList = []
          this.list.push(res.data[i])
        }
        this.listLoading = false
      })
    },
    clearSearch() {
      this.machine = ''
      this.productCode = ''
      this.fetchData()
    },
    handleEdit(row, index) {
      row.isEdit = true
      this.getBinList(index, 0)
      row.binVersion = this.list[index].binVersion.split(',')
      row.machineCot = this.list[index].machineCot.split(',')
    },
    handleSave(row) {
      let color = '*'
      if (row.color !== null) {
        color = row.color
      }
      let model = '*'
      if (row.model !== null) {
        model = row.model
      }
      let craft = '*'
      if (row.craft !== null) {
        craft = row.craft
      }
      let mulMachine = '*'
      row.machineCot.map((val, i) => {
        if (val === '*') {
          row.machineCot.splice(i, 1)
        }
      })
      if (row.machineCot !== null & row.machineCot.length > 0) {
        mulMachine = row.machineCot[0]
        for (let i = 1; i < row.machineCot.length; i++) {
          mulMachine = mulMachine + ',' + row.machineCot[i]
        }
      }
      let mulBinVer = '*'
      row.binVersion.map((val, i) => {
        if (val === '*') {
          row.binVersion.splice(i, 1)
        }
      })
      if (row.binVersion !== null & row.binVersion.length > 0) {
        mulBinVer = row.binVersion[0]
        for (let i = 1; i < row.binVersion.length; i++) {
          mulBinVer = mulBinVer + ',' + row.binVersion[i]
        }
      }
      const params = {
        binVersion: mulBinVer,
        code: color + model + craft,
        color: row.color,
        cotMachine: mulMachine,
        craft: row.craft,
        machineId: row.machineId,
        model: row.model
      }
      save(params).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
          row.isEdit = false
          this.fetchData()
        }
      })
    },
    handCansel(row) {
      row.isEdit = false
      this.fetchData()
    }
  }
}

