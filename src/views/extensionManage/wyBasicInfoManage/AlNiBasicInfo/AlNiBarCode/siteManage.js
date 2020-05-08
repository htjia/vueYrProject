
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { siteList, add, update, remove } from '@/api/processManagement/siteManage'
const defaultFormThead = [
  {
    thName: '导入时间',
    thKey: 'name'
  },
  {
    thName: '镭刻号',
    thKey: 'status'
  }
]
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const validateSiteName = (rule, value, callback) => {
      const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
      if (value.trim().length === 0) {
        callback(new Error('请输入站点名称'))
      } else {
        if (pattern.test(value)) {
          callback(new Error('站点名称不能包含特殊字符'))
        } else {
          callback()
        }
      }
    }
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      selectTheadVisble: false,
      notBastic: false,
      list: [],
      defaultFormThead: [],
      formThead: defaultFormThead,
      // checkboxVal: defaultFormThead,
      checkboxVal: [
        '导入时间',
        '镭刻号'
      ],
      formInfo: {
        labelName: '',
        remark: '',
        canvasWidth: 100,
        canvasHeight: 50,
        isCode: [],
        param: []
      },
      theadOptions: [
        { thName: '导入时间', thKey: 'name' },
        { thName: '镭刻号', thKey: 'status' },
        { thName: '衬底类型', thKey: 'status' },
        { thName: '衬底尺寸', thKey: 'status' },
        { thName: '单/双抛', thKey: 'status' },
        { thName: '供应商', thKey: 'status' },
        { thName: '批次号', thKey: 'status' },
        { thName: '箱号', thKey: 'status' },
        { thName: '出场盒号', thKey: 'status' },
        { thName: '次序号1', thKey: 'status' },
        { thName: '铝氮盒号', thKey: 'status' },
        { thName: '次序号2', thKey: 'status' },
        { thName: '散片盒号', thKey: 'status' },
        { thName: '次序号3', thKey: 'status' },
        { thName: '是否生长', thKey: 'status' }
      ],
      formTheadOptions: [
        '导入时间',
        '镭刻号',
        '衬底类型',
        '衬底尺寸',
        '单/双抛',
        '供应商',
        '批次号',
        '箱号',
        '出场盒号',
        '次序号2',
        '散片盒号',
        '次序号3',
        '是否生长'
      ],
      siteType: '',
      siteName: '',
      siteStatus: '',
      pageSize: 12,
      pageNum: 1,
      totalPage: 0,
      beginDate: '',
      endDate: '',
      pickerOptionsStart: {
        disabledDate: (time) => {
          const endDateVal = this.endDate
          if (endDateVal) {
            return time.getTime() > endDateVal
          } else {
            return time.getTime() > Date.now()
          }
        }
        // shortcuts: [{
        //   text: '今天',
        //   onClick(picker) {
        //     picker.$emit('pick', new Date())
        //   }
        // }]
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          const beginDateVal = this.beginDate
          if (beginDateVal) {
            return time.getTime() < beginDateVal || time.getTime() > Date.now()
          } else {
            return time.getTime() > Date.now()
          }
        }
        // shortcuts: [{
        //   text: '今天',
        //   onClick(picker) {
        //     picker.$emit('pick', new Date())
        //   }
        // }]
      },
      siteOptions: [
        {
          id: 0,
          name: '前段'
        },
        {
          id: 1,
          name: '后段'
        }
      ],
      siteSelectOptions: [
        {
          id: '',
          name: '全部'
        },
        {
          id: 0,
          name: '前段站点'
        },
        {
          id: 1,
          name: '后段站点'
        }
      ],
      siteStatusOptions: [
        {
          id: 0,
          name: '启用'
        },
        {
          id: 1,
          name: '停用'
        }
      ],
      userOptions: [],
      siteForm: {
        siteType: '',
        siteName: '',
        siteStatus: ''
      },
      rules: {
        siteType: [{ required: true, message: '请选择站点类型', trigger: 'blur' }],
        siteName: [{ required: true, validator: validateSiteName, trigger: 'blur' }],
        siteStatus: [{ required: true, message: '请选择站点状态', trigger: 'blur' }]
      },
      currentId: '',
      container: '', // 25.4mm == 96px   1mm == 3.78px
      // eslint-disable-next-line no-undef
      group: new zrender.Group(),
      zr: '',
      temp: -99999,
      imgZDE: '',
      textZDE: ''
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    selectThead() {
      this.selectTheadVisble = !this.selectTheadVisble
    },
    add() {
      this.addDialogVisible = true
      setTimeout(() => {
        this.container = document.getElementById('canvas')
        // eslint-disable-next-line no-undef
        this.zr = zrender.init(this.container)
        this.zr.add(this.group)
      }, 100)
    },
    setActive() {
      if (this.formInfo.param.length === 0 && this.group._children !== 0) {
        for (let x = 0; x < this.group._children.length; x++) {
          if (this.group._children[x].id === 'addBoxId') {
            this.group.remove(this.group._children[x])
          } else if (this.group._children[x].id === 'addPlacement') {
            this.group.remove(this.group._children[x])
          } else if (this.group._children[x].id === 'addPlacementNum') {
            this.group.remove(this.group._children[x])
          } else if (this.group._children[x].id === 'addSubstrate') {
            this.group.remove(this.group._children[x])
          }
        }
      }
      if (this.formInfo.param.join().indexOf('盒号ID') < 0) {
        for (let x = 0; x < this.group._children.length; x++) {
          if (this.group._children[x].id === 'addBoxId') {
            this.group.remove(this.group._children[x])
            break
          }
        }
      } else {
        let flag = false
        for (let x = 0; x < this.group._children.length; x++) {
          if (this.group._children[x].id === 'addBoxId') {
            flag = true
            break
          }
        }
        if (!flag) {
          this.addBoxId()
        }
      }
      if (this.formInfo.param.join().indexOf('放片人') < 0) {
        for (let x = 0; x < this.group._children.length; x++) {
          if (this.group._children[x].id === 'addPlacement') {
            this.group.remove(this.group._children[x])
            break
          }
        }
      } else {
        let flag = false
        for (let x = 0; x < this.group._children.length; x++) {
          if (this.group._children[x].id === 'addPlacement') {
            flag = true
            break
          }
        }
        if (!flag) {
          this.addPlacement()
        }
      }
      if (this.formInfo.param.join().indexOf('片数') < 0) {
        for (let x = 0; x < this.group._children.length; x++) {
          if (this.group._children[x].id === 'addPlacementNum') {
            this.group.remove(this.group._children[x])
            break
          }
        }
      } else {
        let flag = false
        for (let x = 0; x < this.group._children.length; x++) {
          if (this.group._children[x].id === 'addPlacementNum') {
            flag = true
            break
          }
        }
        if (!flag) {
          this.addPlacementNum()
        }
      }
      if (this.formInfo.param.join().indexOf('衬底厂家') < 0) {
        for (let x = 0; x < this.group._children.length; x++) {
          if (this.group._children[x].id === 'addSubstrate') {
            this.group.remove(this.group._children[x])
            break
          }
        }
      } else {
        let flag = false
        for (let x = 0; x < this.group._children.length; x++) {
          if (this.group._children[x].id === 'addSubstrate') {
            flag = true
            break
          }
        }
        if (!flag) {
          this.addSubstrate()
        }
      }
    },
    submitOption() {
      const arr = []
      console.log(this.checkboxVal)
      this.theadOptions.map((item) => {
        this.checkboxVal.map((val) => {
          if (item.thName === val) {
            arr.push(item)
          }
        })
      })
      this.formThead = arr
      this.selectTheadVisble = false
    },
    resetOption() {
      this.selectTheadVisble = false
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
    // 查询
    fetchData() {
      this.listLoading = true
      const requestParams = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        name: this.siteName,
        type: this.siteType
      }
      siteList(requestParams).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    // 添加
    handleAdd() {
      this.siteForm.siteType = ''
      this.siteForm.siteName = ''
      this.siteForm.siteStatus = ''
      this.addDialogVisible = true
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            type: this.siteForm.siteType,
            name: this.siteForm.siteName,
            status: this.siteForm.siteStatus
          }
          add(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
              this.$refs[formName].resetFields()
              this.addDialogVisible = false
              this.fetchData()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 取消
    resetForm(formName) {
      this.addDialogVisible = false
      this.editDialogVisible = false
      this.$refs[formName].resetFields()
    },
    // 编辑
    handleEdit(row) {
      this.notBastic = row.isbastic === 1
      this.currentId = row.id
      this.siteForm.siteType = row.type
      this.siteForm.siteName = row.name
      this.siteForm.siteStatus = row.status
      this.editDialogVisible = true
    },
    // 编辑提交
    submitEditForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            id: this.currentId,
            type: this.siteForm.siteType,
            name: this.siteForm.siteName,
            status: this.siteForm.siteStatus
          }
          console.log(params)
          update(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '编辑成功!'
              })
              this.editDialogVisible = false
              this.$refs[formName].resetFields()
              this.fetchData()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 删除
    handleDelete(row) {
      this.$confirm('此操作将永久删除该站点, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          id: row.id
        }
        remove(param).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.fetchData()
          }
        })
      })
    },
    setIsCode() {
      console.log(this.formInfo.isCode)
      if (this.formInfo.isCode.length > 0) {
        this.addImg()
      }
    },
    // 添加条形码
    addImg() {
      // 绘画图片
      console.log(this.group.children())
      // eslint-disable-next-line no-undef
      const img = new zrender.Image({
        style: {
          image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAIhsAAAAmCAIAAABkokFnAAAJYklEQVR42u3d gankMBQDQPff9G4NIhEoeKaE8CRh9vh3fgAAAAAAAAAAAAAAAAAAAAAAAAAA AAAAAABsOD4BAABA/JSCLxBV2XelIPuAkcJIIfsOFcQfMFLqFFCnGhVHBeoU jQpgpIwUyL7sg/jLPsg+YKTASIGRAuw+6tShOlSQfQAAgE8++X0CAACA+CkF fj2VfVwpsg8YKTBSso9DRfwBI4U6BXWKRnWogDrVqAAYKSMFsi/7IP6yD7IP GCmMFGCkALuvTnGoDhVkHwAAoPTk9wkAAADipxT49VT2caXIPmCkwEjJPg4V 8QeMFOoU1Cka1aEC6lSjAmCkjBTIvuyD+Ms+yD5gpDBSgJEC7L46xaE6VJB9 AACA0pPfJwAAAIifUuDXU9nHlSL7gJECIyX7OFTEHzBSqFNQp2hUhwqoU40K gJEyUiD7sg/iL/sg+4CRwkgBRgqw++oUh+pQQfYBAABKT36fAAAAIH5KgV9P ZR9XiuwDRgqMlOzjUBF/wEihTkGdolEdKqBONSoARspIgezLPoi/7IPsA0YK IwUYKcDuq1McqkMF2QcAACg9+X0CAACA+CkFfj2VfVwpsg8YKTBSso9DRfwB I4U6BXWKRnWogDrVqAAYKSMFsi/7IP6yD7IPGCmMFGCkALuvTnGoDhVkHwAA oPTk9wkAAADipxT49VT2caXIPmCkwEjJPg4V8QeMFOoU1Cka1aEC6lSjAmCk jBTIvuyD+Ms+yD5gpDBSgJEC7L46xaE6VJB9AACA0pPfJwAAAIifUuDXU9nH lSL7gJECIyX7OFTEHzBSqFNQp2hUhwqoU40KgJEyUiD7sg/iL/sg+4CRwkgB Rgqw++oUh+pQQfYBAABKT36fAAAAIH5KgV9PZR9XiuwDRgqMlOzjUBF/wEih TkGdolEdKqBONSoARspIgezLPoi/7IPsA0YKIwUYKcDuq1McqkMF2QcAACg9 +X0CAACA+CkFfj2VfVwpsg8YKTBSso9DRfwBI4U6BXWKRnWogDrVqAAYKSMF si/7IP6yD7IPGCmMFGCkALuvTnGoDhVkHwAAoPTk9wkAAADipxT49VT2caXI PmCkwEjJPg4V8QeMFOoU1Cka1aEC6lSjAmCkjBTIvuyD+Ms+yD5gpDBSgJEC 7L46xaE6VJB9AACA0pPfJwAAAIifUuDXU9nHlSL7gJECIyX7OFTEHzBSqFNQ p2hUhwqoU40KgJEyUiD7sg/iL/sg+4CRwkgBRgqw++oUh+pQQfYBAABKT36f AAAAIH5KgV9PZR9XiuwDRgqMlOzjUBF/wEihTkGdolEdKqBONSoARspIgezL Poi/7IPsA0YKIwUYKcDuq1McqkMF2QcAACg9+X0CAACA+CkFfj2VfVwpsg8Y KTBSso9DRfwBI4U6BXWKRnWogDrVqAAYKSMFsi/7IP6yD7IPGCmMFGCkALuv TnGoDhVkHwAAoPTk9wkAAADipxT49VT2caXIPmCkwEjJPg4V8QeMFOoU1Cka 1aEC6lSjAmCkjBTIvuyD+Ms+yD5gpDBSgJEC7L46xaE6VJB9AACA0pPfJwAA AIifUuDXU9nHlSL7gJECIyX7OFTEHzBSqFNQp2hUhwqoU40KgJEyUiD7sg/i L/sg+4CRwkgBRgqw++oUh+pQQfYBAABKT36fAAAAIH5KgV9PZR9XiuwDRgqM lOzjUBF/wEihTkGdolEdKqBONSoARspIgezLPoi/7IPsA0YKIwUYKcDuq1Mc qkMF2QcAACg9+X0CAACA+CkFfj2VfVwpsg8YKTBSso9DRfwBI4U6BXWKRnWo gDrVqAAYKSMFsi/7IP6yD7IPGCmMFGCkALuvTnGoDhVkHwAAoPTk9wkAAADi pxT49VT2caXIPmCkwEjJPg4V8QeMFOoU1Cka1aEC6lSjAmCkjBTIvuyD+Ms+ yD5gpDBSgJEC7L46xaE6VJB9AACA0pPfJwAAAIifUuDXU9nHlSL7gJECIyX7 OFTEHzBSqFNQp2hUhwqoU40KgJEyUiD7sg/iL/sg+4CRwkgBRgqw++oUh+pQ QfYBAABKT36fAAAAIH5KgV9PZR9XiuwDRgqMlOzjUBF/wEihTkGdolEdKqBO NSoARspIgezLPoi/7IPsA0YKIwUYKcDuq1McqkMF2QcAACg9+X0CAACA+CkF fj2VfVwpsg8YKTBSso9DRfwBI4U6BXWKRnWogDrVqAAYKSMFsi/7IP6yD7IP GCmMFGCkALuvTnGoDhVkHwAAoPTk9wkAAADipxT49VT2caXIPmCkwEjJPg4V 8QeMFOoU1Cka1aEC6lSjAmCkjBTIvuyD+Ms+yD5gpDBSgJEC7L46xaE6VJB9 AACA0pPfJwAAAIifUuDXU9nHlSL7gJECIyX7OFTEHzBSqFNQp2hUhwqoU40K gJEyUiD7sg/iL/sg+4CRwkgBRgqw++oUh+pQQfYBAABKT36fAAAAIH5KgV9P ZR9XiuwDRgqMlOzjUBF/wEihTkGdolEdKqBONSoARspIgezLPoi/7IPsA0YK IwUYKcDuq1McqkMF2QcAACg9+X0CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA gBH+RxkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAFf5HGQAAAAAAAAAAAAAA AAAAAAAAAAAAAAAAAIAV/kcZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgBX+ RxkAAAAAAAAAANh1gFspQDD9gN0H7D5g9wG7D5h+AAAAAAAAAAAAruUfogEA AAAAAAAA8Bp/FsrfmQI0qkZ1pThUQKOqU4eKQwXUqUZ1qLhSQKNqVAAAAAAA AAAAgIf8qykAAAAAAAAAAACY46/C+TNzrhTASIHpl31AnaJRHaorBTQqGhUA AAAAAAAAALiWfzUFAAAAAAAAAADcxR/bwt9EA3Uq+4BGVac4VIcKqFONikN1 pYBG1agAAAAAAAAAAADL/KspAAAAAAAAAAAAmOOvwvkzc67UoQIaFXWK7ANg +rH7ANh9AAAAAAAAAADgWv7VFAAAAAAAAAAAr/E3jPxRJECjalRXikMFNKo6 dag4VECdalSHiisFNKpGBQAAAAAAAAAAeMi/mgIAAAAAAAAAgF3+LBT4m2iA 6QfsPmD3AbsP2H3A9AMAAAAAAAAAAHAb/xANAAAAAAAAAAAAAAAAAAAAAAAA AAAAAAAAYMUf1ta12NkfPrUAAAAASUVORK5CYII=',
          x: 0,
          y: 0,
          width: '100',
          height: '50'
        },
        id: 'imgbox',
        draggable: true
      }).on('mousedown', function() {
        this.attr('zlevel', ++this.temp)
      }).on('click', function(ev) {
        console.log(this)
        // sessionStorage.setItem('imgZDE', this.id)
        // document.getElementById('textsize').style.display = 'none'
        // document.getElementById('imgsize').style.display = 'block'
        // document.getElementById('inputwidth').value = ''
        // document.getElementById('inputheight').value = ''
      }).on('mousewheel', function(ev) {
        const e = (ev || event).wheelDelta / 20
        // 设置缩放大小
        this.attr('scale', [this.scale[0] += e, this.scale[1] += e])
        // 设置缩放中心
        this.attr('origin', [this.style.x + this.style.width / 2, this.style.y + this.style.height / 2])
      }).on('dblclick', function(ev) {
        // 设置旋转角度
        this.attr('rotation', [this.rotation - Math.PI / 12])
        // 设置旋转中心
        this.attr('origin', [this.style.x + this.style.width / 2, this.style.y + this.style.height / 2])
      })
      this.group.add(img)
      console.log(this.group)
    },
    addBoxId() {
      // eslint-disable-next-line no-undef
      const text = new zrender.Text({
        style: {
          x: 100,
          y: 0,
          text: '盒号ID'
        },
        id: 'addBoxId',
        draggable: true
      }).on('mousedown', function() {
        this.attr('zlevel', ++this.temp)
      }).on('click', function(ev) {
        console.log(this)
      })
      this.group.add(text)
    },
    addPlacement() {
      // eslint-disable-next-line no-undef
      const text = new zrender.Text({
        style: {
          x: 130,
          y: 0,
          text: '放片人'
        },
        id: 'addPlacement',
        draggable: true
      }).on('mousedown', function() {
        this.attr('zlevel', ++this.temp)
      }).on('click', function(ev) {
        console.log(this)
      })
      this.group.add(text)
    },
    addPlacementNum() {
      // eslint-disable-next-line no-undef
      const text = new zrender.Text({
        style: {
          x: 140,
          y: 0,
          text: '片数'
        },
        id: 'addPlacementNum',
        draggable: true
      }).on('mousedown', function() {
        this.attr('zlevel', ++this.temp)
      }).on('click', function(ev) {
        console.log(this)
      })
      this.group.add(text)
    },
    addSubstrate() {
      // eslint-disable-next-line no-undef
      const text = new zrender.Text({
        style: {
          x: 150,
          y: 0,
          text: '衬底厂家'
        },
        id: 'addSubstrate',
        draggable: true
      }).on('mousedown', function() {
        this.attr('zlevel', ++this.temp)
      }).on('click', function(ev) {
        console.log(this)
      })
      this.group.add(text)
    }
  }
}

