<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="dialog"
    :title="dialogTitle"
    append-to-body
    width="780px"
    class="padding-dialog flex_dialog"
    @close="resetForm('mocvdForm')">
    <div class="module-title" style="margin-bottom: 10px">
      <div class="module-title-text">基本信息</div>
    </div>
    <el-form ref="mocvdForm" :disabled="disabled" :model="mocvdForm" :rules="rules" size="small" status-icon label-width="80px" label-position="right">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="规则名称" prop="name">
            <el-input v-model="mocvdForm.name" :disabled="readonly" placeholder="请输入规则名称" type="text" maxlength="20"/>
          </el-form-item>
          <el-form-item style="margin-bottom: 0" label="客户名称" prop="customerId">
            <el-select v-model="mocvdForm.customerId" :disabled="readonly" class="dialog-input" placeholder="请选择" filterable>
              <el-option
                v-for="item in customerList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="片型" prop="pattern">
            <el-select v-model="mocvdForm.pattern" :disabled="readonly" class="dialog-input" placeholder="请选择" filterable @change="changePattern(mocvdForm.pattern)">
              <el-option
                v-for="item in patternOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 动态表格分包规则 -->
      <div class="module-title" style="margin-bottom: 10px;display: flex;justify-content: space-between;">
        <div class="module-title-text">分包规则</div>
        <el-button
          v-if="!disabled"
          size="mini"
          type="primary"
          @click="handleAddItem"
        ><svg-icon icon-class="add"/> 新增</el-button>
      </div>
      <el-table
        ref="runTable"
        :data="mocvdForm.detailList"
        :header-row-style="{color: '#f00',textAlign: 'center'}"
        element-loading-text="拼命加载中"
        class="site-table"
        border
        fit
      >
        <el-table-column label="参数" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.param" class="search-input" size="small" placeholder="请选择" filterable clearable @change="changeParam(scope.row,scope.$index)">
              <el-option
                v-for="item in parameter"
                :key="item.id"
                :label="item.name"
                :disabled="dis.includes(item.id)"
                :value="item.id"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="分档方式" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.way" class="search-input" size="small" placeholder="*请选择" filterable clearable @change="changeWay(scope.row,scope.row.way)">
              <el-option
                v-for="item in scope.row.gradingType"
                :key="item.id"
                :label="item.name"
                :disabled="item.disabled"
                :value="item.id"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="分档规则">
          <template slot-scope="scope">
            <div v-if="scope.row.way === 0" style="text-align: center;">按Bin分</div>
            <div v-else-if="scope.row.way === 4" style="text-align: center;">不分</div>
            <!--间隔-->
            <div v-else-if="scope.row.way === 1" class="jiange">
              <el-select v-if="scope.row.param.includes('wl')" v-model="scope.row.jg" placeholder="*" size="small" class="search-input">
                <el-option :value="1" label="1"/>
                <el-option :value="2.5" label="2.5"/>
                <el-option :value="5" label="5"/>
              </el-select>
              <el-input v-else v-model="scope.row.jg" class="search-input" placeholder="*" step="0.01" onkeyup="this.value=this.value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')" size="mini" maxlength="6"/>
            </div>
            <!--区间-->
            <div v-else-if="scope.row.way === 2" class="section">
              <div v-for="(item,index) in scope.row.list" :key="index" class="mini-input">
                <el-input v-model="item.pre" placeholder="*" step="0.01" onkeyup="this.value=this.value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')" size="mini" type="number"/> ~
                <el-input v-model="item.now" placeholder="*" step="0.01" onkeyup="this.value=this.value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')" size="mini" type="number"/>
                <template v-if="!disabled">
                  <el-button v-if="scope.row.list[0] === item" class="svgg yadd" size="mini" type="text" @click="addWayList(scope.row)">
                    <svg-icon icon-class="yadd"/>
                  </el-button>
                  <el-button v-else class="svgg ychanchu" size="mini" type="text" @click="delWayList(scope.row.list,index)">
                    <svg-icon icon-class="ychanchu"/>
                  </el-button>
                </template>
              </div>
            </div>
            <!--范围-->
            <div v-else style="display:flex;" class="mini-input">
              <el-select v-model="scope.row['fw'][0]" placeholder="*" size="mini" style="margin-right: 16px" class="search-input">
                <el-option v-for="item in fh" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
              <el-input v-model="scope.row['fw'][1]" style="width: 94px" placeholder="*" step="0.01" size="mini" type="number" onkeyup="this.value=this.value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="!disabled" label="操作" align="center" width="70">
          <template slot-scope="scope">
            <el-button class="svgg shanchu1" size="mini" type="text" @click="deleteInItem(scope.row,scope.$index)">
              <svg-icon icon-class="shanchu1"/>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 其他规则 -->
      <div class="module-title" style="margin-bottom: 10px">
        <div class="module-title-text">其他规则</div>
      </div>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="外观">
            <el-select v-model="mocvdForm.facede" multiple collapse-tags class="dialog-input" size="small" placeholder="请选择" filterable clearable>
              <el-option-group
                v-for="group in exceptionCode"
                :key="group.label"
                :label="group.label"
              >
                <el-option
                  v-for="item in group.options"
                  :key="item.id"
                  :label="item.code + ' (' + item.name + ')'"
                  :value="item.code"/>
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item label="标签">
            <el-select v-model="mocvdForm.labelId" multiple collapse-tags class="dialog-input" placeholder="请选择" filterable>
              <el-option
                v-for="item in labelList"
                :key="item.name"
                :label="item.name"
                :value="item.name"/>
            </el-select>
          </el-form-item>
          <el-form-item label="检验报告">
            <el-select v-model="mocvdForm.checkReport" clearable class="dialog-input" placeholder="请选择" filterable>
              <el-option :value="0" label="是"/>
              <el-option :value="1" label="否"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="数量要求" class="long-title" prop="numRule">
            <el-select v-model="mocvdForm.numRule" style="width: 254px;" class="dialog-input" placeholder="请选择" filterable>
              <el-option
                v-for="item in numOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="静电袋及纸箱" class="long-title" prop="categoryId">
            <el-select v-model="mocvdForm.categoryId" style="width: 254px;" placeholder="请选择" filterable>
              <el-option
                v-for="item in categoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item v-if="!mocvdForm.pattern" class="long-title" label="Mapping图">
            <el-select v-model="mocvdForm.mapping" clearable style="width: 254px;" placeholder="请选择" filterable>
              <el-option :value="0" label="是"/>
              <el-option :value="1" label="否"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注">
        <el-input v-model="mocvdForm.remark" type="textarea" placeholder="请输入其他规则" size="small" maxlength="100" clearable/>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="disabled" size="small" @click="resetForm('mocvdForm')">关闭</el-button>
      <el-button v-if="!disabled" size="small" type="primary" @click="submitForm('mocvdForm')">确 定</el-button>
      <el-button v-if="!disabled" size="small" @click="resetForm('mocvdForm')">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { xpWarehousLabel } from '@/api/pcChipCasting/pcChipCasting'
import { getExceptionCode } from '@/api/chipManage/rearSiteManage/visualInspectionInfo'
import { findController, saveObj, updateObj } from '@/api/orderManage/custormization'
export default {
  props: {
    /* eslint-disable */
      addDialogVisible: {
        default: false,
        type: Boolean
      },
      dialogTitle: {
        default: '',
        type: String
      },
      customerList: Array,
      tableKey:Number,
      row: Object,
      isRow: Number,
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        // 数量要求
        dialog: false,
        readonly: false,
        numOptions: [
          {
            id: 0,
            name: '按订单'
          },
          {
            id: 1,
            name: '不超请领单'
          }
        ],
        categoryList: [],
        labelList: [],
        exceptionCode: [],
        // 符号
        fh: [
          {
            id: '>',
            name: '>'
          },
          {
            id: '<',
            name: '<'
          },
          {
            id: '>=',
            name: '≥'
          },
          {
            id: '<=',
            name: '≤'
          },
          {
            id: '=',
            name: '='
          },
          {
            id: '!=',
            name: '≠'
          }
        ],
        // 片型
        patternOptions: [
          {
            id: 0,
            name: '圆片'
          },
          {
            id: 1,
            name: '方片'
          }
        ],
        // 方片参数
        FParams: [
          {
            name: 'WLD',
            paramCategory: 0,
            id: 'wld'
          },
          {
            name: 'WLD_STD',
            paramCategory: 0,
            id: 'wld_std'
          },
          {
            name: 'WLP',
            paramCategory: 0,
            id: 'wlp'
          },
          {
            name: 'WLP_STD',
            paramCategory: 0,
            id: 'wlp_std'
          },
          {
            name: 'WLC',
            paramCategory: 0,
            id: 'wlc'
          },
          {
            name: 'WLC_STD',
            paramCategory: 0,
            id: 'wlc_std'
          },
          {
            name: 'VF1',
            paramCategory: 0,
            id: 'vf1'
          },
          {
            name: 'VF1_STD',
            paramCategory: 0,
            id: 'vf1_std'
          },
          {
            name: 'IR',
            paramCategory: 0,
            id: 'ir'
          },
          {
            name: 'IR_STD',
            paramCategory: 0,
            id: 'ir_std'
          },
          {
            name: 'VZ',
            paramCategory: 0,
            id: 'vz'
          },
          {
            name: 'VZ_STD',
            paramCategory: 0,
            id: 'vz_std'
          },
          {
            name: 'LOP',
            paramCategory: 0,
            id: 'lop'
          },
          {
            name: 'LOP_STD',
            paramCategory: 0,
            id: 'lop_std'
          },
          {
            name: '研磨厚度',
            paramCategory: 1,
            id: 'grind'
          },
          {
            name: '测试电流',
            paramCategory: 1,
            id: 'electricity'
          },
          {
            name: 'ESD测试电压（正向）',
            paramCategory: 1,
            id: 'esd_elec'
          },
          {
            name: 'ESD测试电压（反向）',
            paramCategory: 1,
            id: 'esd_elec_reverse'
          }

        ],
        // 原片参数
        YParams: [
          {
            name: 'WLD',
            paramCategory: 0,
            id: 'wld_avg'
          },
          {
            name: 'WLD_STD',
            paramCategory: 0,
            id: 'wld_std'
          },
          {
            name: 'WLP',
            paramCategory: 0,
            id: 'wlp_avg'
          },
          {
            name: 'WLP_STD',
            paramCategory: 0,
            id: 'wlp_std'
          },
          {
            name: 'WLC',
            paramCategory: 0,
            id: 'wlc_avg'
          },
          {
            name: 'WLC_STD',
            paramCategory: 0,
            id: 'wlc_std'
          },
          {
            name: 'LOP',
            paramCategory: 0,
            id: 'lop_avg'
          },
          {
            name: 'LOP_STD',
            paramCategory: 0,
            id: 'lop_std'
          },
          {
            name: 'VF1',
            paramCategory: 0,
            id: 'vf1_avg'
          },
          {
            name: 'VF1_STD',
            paramCategory: 0,
            id: 'vf1_std'
          },
          {
            name: 'VF2',
            paramCategory: 0,
            id: 'vf2_avg'
          },
          {
            name: 'VF2_STD',
            paramCategory: 0,
            id: 'vf2_std'
          },
          {
            name: 'VF3',
            paramCategory: 0,
            id: 'vf3_avg'
          },
          {
            name: 'VF3_STD',
            paramCategory: 0,
            id: 'vf3_std'
          },
          {
            name: 'VF4',
            paramCategory: 0,
            id: 'vf4_avg'
          },
          {
            name: 'VF4_STD',
            paramCategory: 0,
            id: 'vf4_std'
          },
          {
            name: 'IR',
            paramCategory: 0,
            id: 'ir_avg'
          },
          {
            name: 'IR_STD',
            paramCategory: 0,
            id: 'ir_std'
          },
          {
            name: 'VZ',
            paramCategory: 0,
            id: 'vz_avg'
          },
          {
            name: 'VZ_STD',
            paramCategory: 0,
            id: 'vz_std'
          },
          {
            name: '归一亮度',
            paramCategory: 0,
            id: 'norma_code'
          },
          {
            name: 'HW均值',
            paramCategory: 1,
            id: 'hw_avg'
          },
          {
            name: '综合良率',
            paramCategory: 1,
            id: 'compre_yield'
          },
          {
            name: 'VF1良率',
            paramCategory: 1,
            id: 'vf1_yield'
          },
          {
            name: 'VF2良率',
            paramCategory: 1,
            id: 'vf2_yield'
          },
          {
            name: 'VF3良率',
            paramCategory: 1,
            id: 'vf3_yield'
          },
          {
            name: 'VF4良率',
            paramCategory: 1,
            id: 'vf4_yield'
          },
          {
            name: 'IR良率',
            paramCategory: 1,
            id: 'ir_yield'
          },
          {
            name: 'DVF良率',
            paramCategory: 1,
            id: 'dvf_yield'
          },
          {
            name: 'WLD良率',
            paramCategory: 1,
            id: 'wld_yield'
          },
          {
            name: 'WLP良率',
            paramCategory: 1,
            id: 'wlp_yield'
          },
          {
            name: 'WLC良率',
            paramCategory: 1,
            id: 'wlc_yield'
          },
          {
            name: 'LOP良率',
            paramCategory: 1,
            id: 'iv_yield'
          },
          {
            name: 'VZ良率',
            paramCategory: 1,
            id: 'vz_yield'
          },
          {
            name: 'ESD IR_A良率',
            paramCategory: 1,
            id: 'ir_esd_a_yield'
          },
          {
            name: 'WLD_5nm良率',
            paramCategory: 1,
            id: 'wld_nm5_yield'
          },
          {
            name: 'WLP_5nm良率',
            paramCategory: 1,
            id: 'wlp_nm5_yield'
          },
          {
            name: '研磨厚度',
            paramCategory: 1,
            id: 'grind'
          },
          {
            name: '测试电流',
            paramCategory: 1,
            id: 'electricity'
          },
          {
            name: 'ESD测试电压（正向）',
            paramCategory: 1,
            id: 'esd_elec'
          },
          {
            name: 'ESD测试电压（反向）',
            paramCategory: 1,
            id: 'esd_elec_reverse'
          }
        ],
        parameter: [],
        // 新增编辑的参数
        mocvdForm: {
          name: '',
          customerId: '',
          pattern: 0,
          facede: ['A'],
          labelId: [],
          numRule: '',
          categoryId: '',
          checkReport: '',
          mapping: '',
          creator: '',
          remark: '',
          detailList: [
            {
              param: '',
              way: 4, // 方式
              jg: '', // 间隔
              list: [{ pre: '', now: '' }], // 区间
              fw: ['', ''], // 范围
              wayRule: '' // 这个是最后传过去后台真正的值

            }
          ]
        },
        // 验证规则
        rules: {
          name: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
          customerId: [{ required: true, message: '请选择客户名称', trigger: 'blur' }],
          pattern: [{ required: true, message: '请选择片型', trigger: 'blur' }],
          numRule: [{ required: true, message: '请选择数量要求', trigger: 'blur' }],
          categoryId: [{ required: true, message: '请选择静电袋及纸箱', trigger: 'blur' }]
        },
      }
    },
    mounted() {
      this.findController()
      this.xpWarehousLabel()
      this.getExceptionCodeFun()
    },
    watch: {
      addDialogVisible(val) {
        this.dialog = this.addDialogVisible
        //  if(this.$refs.mocvdForm){
        //     this.$refs.mocvdForm.clearValidate()
        //   }
        if(this.isRow === 1) {
          this.init()
        }
      },
      row(val) {
        this.init(val)
      },
      // isRow() {
      //   this.init()
      // }
    },
    computed: {
      dis(){
        let arr = []
        this.mocvdForm.detailList.map(_ => {
          arr.push(_.param)
        })
        return arr
      }
    },
    methods: {
      getGradingType(isdis,qj,fw) {
        let gradingType = [{
          id: 4,
          name: '不分',
          disabled: qj
        },
          {
            id: 0,
            name: '按Bin分',
            disabled: isdis
          },
          {
            id: 1,
            name: '按间隔分',
            disabled: qj
          },
          {
            id: 2,
            name: '按区间分',
            disabled: qj
          },
          {
            id: 3,
            name: '按范围分',
            disabled: fw
          },
        ]
        return gradingType
      },
      init(row) {
        if (this.mocvdForm.pattern === 0) {
          this.parameter = this.YParams
        } else {
          this.parameter = this.FParams
        }
        if(this.isRow === 1) {
          this.readonly = false
          this.mocvdForm.name = ''
          this.mocvdForm.customerId = ''
          this.mocvdForm.pattern = 0
          this.mocvdForm.facede = ['A']
          this.mocvdForm.labelId = []
          this.mocvdForm.numRule = ''
          this.mocvdForm.categoryId = ''
          this.mocvdForm.checkReport = ''
          this.mocvdForm.mapping = ''
          this.mocvdForm.creator = Number(sessionStorage.getItem('User-Id'))
          this.mocvdForm.remark = ''
          if(this.$refs.mocvdForm) {
            this.$refs.mocvdForm.clearValidate()
          }
          this.changePattern(this.mocvdForm.pattern)
        } else if(this.isRow === 2) {
          this.readonly = (this.dialogTitle === '编辑客制化规则') ? true : false
          if(row) {
            if (row.pattern === 0) {
              this.parameter = this.YParams
            } else {
              this.parameter = this.FParams
            }
            this.mocvdForm.id = (this.dialogTitle === '编辑客制化规则') ? row.id : null
            this.mocvdForm.name = row.name
            if (row.id === 1 || row.id === 2 || row.id === 3 || row.id === 4) {
              this.mocvdForm.customerId = ''
              this.rules.customerId[0].required = false
            } else {
              this.rules.customerId[0].required = true
              this.mocvdForm.customerId = row.customerId
            }
            this.mocvdForm.pattern = row.pattern
            this.changePattern(row.pattern)
            this.mocvdForm.facede = (row.facede === '' || row.facede === null) ? [] : row.facede.split(',')
            this.mocvdForm.labelId = (row.labelId === '' || row.labelId === null) ? [] : row.labelId.split(',')
            this.mocvdForm.numRule = row.numRule
            this.mocvdForm.categoryId = row.categoryId
            this.mocvdForm.checkReport = row.checkReport
            this.mocvdForm.mapping = row.mapping
            this.mocvdForm.creator = Number(sessionStorage.getItem('User-Id'))
            this.mocvdForm.remark = row.remark
            this.mocvdForm.detailList = [...row.detailList]
            let isDisable = false
            this.mocvdForm.detailList.map(_ => {
              if(this.mocvdForm.pattern) {
                isDisable = (_.param === 'wld' || _.param === 'wlp' ||  _.param === 'vf1' ||  _.param === 'lop') ? false : true
              } else {
                isDisable = (_.param === 'wld_avg' || _.param === 'wlp_avg' ||  _.param === 'vf1_avg' ||  _.param === 'lop_avg' || _.param === 'wld_std' || _.param === 'wlp_std') ? false : true
              }
              if(this.parameter.find(i=>i.id === _.param).paramCategory === 1) {
                _.gradingType = this.getGradingType(isDisable,true,false)
              } else {
                _.gradingType = this.getGradingType(isDisable,false,true)
              }
              switch (_.way) {
                case 1:
                  this.$set(_, 'jg', _.wayRule)
                  break
                case 2:
                  this.$set(_, 'list', this.choseVal(_.wayRule))
                  break
                case 3:
                  this.$set(_, 'fw', [_.wayRule.replace(/[\d.]/g, ''), _.wayRule.replace(/[^\d.]/g, '')])
                  break
                default:
                  break
              }
            })
          }
        }else {
          return
        }
      },
      choseVal(val) {
        const newArr = [
          {
            pre: '',
            now: ''
          }
        ]
        const arr = val.split(',')
        arr.map(_ => {
          newArr.push({ pre: _.split('-')[0], now: _.split('-')[1] })
        })
        const list = newArr.filter(i => i.pre !== '')
        return list
      },
      // 修改片型改变下面分包规则的参数
      changePattern(type) {
        if (this.mocvdForm.pattern === 0) {
          this.parameter = this.YParams
          this.mocvdForm.detailList = [
            {
              param: this.mocvdForm.pattern ? 'wld' : 'wld_avg',
              way: 4, // 方式
              jg: '', // 间隔
              list: [{ pre: '', now: '' }], // 区间
              fw: ['', ''], // 范围
              gradingType: this.getGradingType(false,false,true),
              wayRule: '' // 这个是最后传过去后台真正的值
            },{
              param: this.mocvdForm.pattern ? 'lop' : 'lop_avg',
              way: 4, // 方式
              jg: '', // 间隔
              list: [{ pre: '', now: '' }], // 区间
              fw: ['', ''], // 范围
              gradingType: this.getGradingType(false,false,true),
              wayRule: '' // 这个是最后传过去后台真正的值
            },{
              param: this.mocvdForm.pattern ? 'vf1' : 'vf1_avg',
              way: 4, // 方式
              jg: '', // 间隔
              list: [{ pre: '', now: '' }], // 区间
              fw: ['', ''], // 范围
              gradingType: this.getGradingType(false,false,true),
              wayRule: '' // 这个是最后传过去后台真正的值
            },{
              param: 'wld_std',
              way: 4, // 方式
              jg: '', // 间隔
              list: [{ pre: '', now: '' }], // 区间
              fw: ['', ''], // 范围
              gradingType: this.mocvdForm.pattern ? this.getGradingType(true,false,true) : this.getGradingType(false,false,true),
              wayRule: '' // 这个是最后传过去后台真正的值
            },
          ]
        } else {
          this.parameter = this.FParams
          this.mocvdForm.detailList = [
            {
              param: this.mocvdForm.pattern ? 'wld' : 'wld_avg',
              way: 4, // 方式
              jg: '', // 间隔
              list: [{ pre: '', now: '' }], // 区间
              fw: ['', ''], // 范围
              gradingType: this.getGradingType(false,false,true),
              wayRule: '' // 这个是最后传过去后台真正的值
            },{
              param: this.mocvdForm.pattern ? 'lop' : 'lop_avg',
              way: 4, // 方式
              jg: '', // 间隔
              list: [{ pre: '', now: '' }], // 区间
              fw: ['', ''], // 范围
              gradingType: this.getGradingType(false,false,true),
              wayRule: '' // 这个是最后传过去后台真正的值
            },{
              param: this.mocvdForm.pattern ? 'vf1' : 'vf1_avg',
              way: 4, // 方式
              jg: '', // 间隔
              list: [{ pre: '', now: '' }], // 区间
              fw: ['', ''], // 范围
              gradingType: this.getGradingType(false,false,true),
              wayRule: '' // 这个是最后传过去后台真正的值
            }
          ]
        }

        this.xpWarehousLabel(type)
        this.mocvdForm.labelId = []
      },
      // 外观数据
      getExceptionCodeFun() {
        getExceptionCode({}).then(res => {
          this.exceptionCode = res.data
          this.exceptionCode.splice(0, 0, { label: 'A', options: [{ id: 0, code: 'A', name: '正品' }] })
        })
      },
      xpWarehousLabel(type) {
        xpWarehousLabel({type: type}).then(res => {
          this.labelList = res.data
        })
      },
      // 静电袋及纸箱
      findController() {
        findController().then(res => {
          this.categoryList = res.data
        })
      },
      // 新增分包规则
      handleAddItem() {
        if (this.mocvdForm.pattern === '') {
          this.$message({
            type: 'error',
            message: '请先选择片型!'
          })
          return false
        } else {
          if (this.mocvdForm.pattern === 0) {
            this.parameter = this.YParams
          } else {
            this.parameter = this.FParams
          }
          this.mocvdForm.detailList.push({
            param: '',
            way: 4, // 方式
            jg: '', // 间隔
            list: [{ pre: '', now: '' }], // 区间
            fw: ['', ''], // 范围
            gradingType: this.getGradingType(true),
            wayRule: '' // 这个是最后传过去后台真正的值
          })
        }
      },
      // 删除分档规则
      delWayList(list, index) {
        list.splice(index, 1)
      },
      // 分档方式为区间的时候wayList
      changeWay(row, way) {
        if(way === 1) {
          this.$set(row,'jg','')
        }
        if (way === 2) {
          const list = [{
            pre: '',
            now: ''
          }]
          this.$set(row,'list',list)
        }
        if(way === 3) {
          this.$set(row,'fw',['',''])
        }
      },
      // 增加分档规则
      addWayList(row) {
        if (row.list.length === 5) {
          this.$message({
            type: 'error',
            message: '最大允许增加5个区间!'
          })
          return false
        } else {
          row.list.push({
            pre: '',
            now: ''
          })
        }
      },
      // 删除分档规则
      deleteInItem(row,index) {
        this.mocvdForm.detailList.splice(index, 1)
      },
      // 改变参数
      changeParam(val,index) {
        let isDisable = false
        if(val.param) {
          if(this.mocvdForm.pattern) {
            isDisable = (val.param === 'wld' || val.param === 'wlp' ||  val.param === 'vf1' ||  val.param === 'lop') ? false : true
          } else {
            isDisable = (val.param === 'wld_avg' || val.param === 'wlp_avg' ||  val.param === 'vf1_avg' ||  val.param === 'lop_avg' || val.param === 'wld_std' || val.param === 'wlp_std') ? false : true
          }
        }
        let obj = this.parameter.find(_=>_.id === val.param)
        val.way = obj.paramCategory ?  3: 4
        this.mocvdForm.detailList[index].gradingType.map(_=> {
          console.log(_);
          
          if(_.id === 0) {
            this.$set(_,'disabled',isDisable)
          }else if(obj.paramCategory && _.id === 1 || obj.paramCategory && _.id === 2 || obj.paramCategory && _.id === 4) {
            this.$set(_,'disabled',true)
          }else if(!obj.paramCategory && _.id === 3) {
            this.$set(_,'disabled',true) 
          } else {
            this.$set(_,'disabled',false)

          }
        })
      },
      // 判断参数的方法
      choseParam(rowList) {
        if (rowList.filter(_ => _.param === '').length) {
          return { flag: false, msg: '请完善参数信息！' }
        } else {
          return { flag: true, msg: 'ok' }
        }
      },

      // 判断间隔的方法
      interval(rowList) {
        // 过滤只有间隔的数据
        rowList = rowList.filter(_ => _.way === 1)
        if (rowList.some(_ => _.jg === '')) {
          return { flag: false, msg: '请完善参数信息！' }
        }
        return { flag: true, msg: 'ok' }
      },
      // 判断范围
      scope(rowList) {
        // 过滤只有范围的数据
        rowList = rowList.filter(_ => _.way === 3)
        if (rowList.some(_ => _.fw[0] === '' || _.fw[1] === '')) {
          return { flag: false, msg: '请完善参数信息！' }
        }
        return { flag: true, msg: 'ok' }
      },
      // 判断区间的方法
      section(realList) {
        // 过滤只有区间的数据
        let rowList_ = JSON.parse(JSON.stringify(realList))
        rowList_ = rowList_.filter(_ => _.way === 2).map(_ => _.list)
        if (rowList_.length === 0) return { flag: true, msg: 'ok' }
        rowList_.map((_,index)=>{_.map(item => {item['index'] = index})})
        let rowList = []
        rowList = rowList.concat.apply([], rowList_)
        // 开始判断
        const must_ = rowList.some(({ pre, now }) => pre === '' || now === '')
        if (must_) return { flag: false, msg: '请完善参数信息！' }
        // 都搞成数字
        const list = rowList.map(({ pre, now,index }) => ({ pre: +pre, now: +now,index:index }))
        // 判断是否输入，判断是否左右为 0
        const inFlag = list.every(_ => typeof _.pre !== 'number' || typeof _.now !== 'number') || list.every(_ => _.pre === _.now === 0)
        if (inFlag) return { flag: false, msg: '区间请输入正确！' }
        // 判断前值不可大于后值
        const valueFlag = list.every(({ pre, now }) => now >= pre)
        console.log(list.every(({ pre, now }) => now >= pre));


        if (!valueFlag) return { flag: false, msg: '参数区间最小值不能大于最大值，请检查后重试！' }
        // 判断是否有区间重叠
        for (let i = 0; i < list.length - 1; i++) {
          let { pre, now,index } = list[i];
          // 解决浮点运算
          [pre, now] = [pre.toFixed(2) * 100, now.toFixed(2) * 100]
          for (let j = i + 1; j < list.length; j++) {
            let { pre: pre_, now: now_,index:index_ } = list[j];
            [pre_, now_] = [pre_.toFixed(2) * 100, now_.toFixed(2) * 100]
            // 4种情况，左交集，包含，被包含，右交集
            if(index === index_) {
              if ((pre < pre_ && now > pre_) || (pre <= pre_ && now >= now_) || (pre >= pre_ && now <= now_) || (pre < now_ && now > now_)) {
                return { flag: false, msg: '区间参数设置重复，请检查后重试！' }
              }
            }
          }
        }
        return { flag: true, msg: 'ok' }
      },
      // 处理分档规则数据格式的方法
      formatValue(list) {
        list.forEach((val, index) => {
          // 1间隔 2区间 3范围
          const { way: code } = val
          switch (code) {
            case 0 :
              val.wayRule = ''
              break
            case 1 :
              val.wayRule = val.jg
              break
            case 2 :
              val.wayRule = val.list.map(({ pre, now }) => `${pre}-${now}`) + ''
              break
            case 3 :
              val.wayRule = val.fw.join('')
              break
            case 4 :
              val.wayRule = ''
              break
          }
        })
      },
      // 集成方法
      formatAll(tableData) {
        let status = { flag: true, mes: 'ok' }
        const arr = ['interval', 'section', 'scope', 'choseParam']
        for (const i of arr) {
          status = this[i](tableData)
          if (!status.flag) {
            return status
          }
        }
        return status
      },

      // 添加提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 继续判断其他
            const mes = this.formatAll(this.mocvdForm.detailList)
            // 通过所有校验
            if (mes.flag) {
              let show = false
              // 把每条数据里面的 value 转换成后台需要的值
              this.formatValue(this.mocvdForm.detailList)
              let obj = {...this.mocvdForm}
              obj.facede = this.mocvdForm.facede.toString()
              obj.labelId = this.mocvdForm.labelId.toString()
              if (this.dialogTitle === '新增客制化规则') {
                saveObj(obj).then(res => {
                  this.dialog = false
                  show = true
                  this.$message.success('新增成功')
                  this.$nextTick(() => {
                    this.$refs.mocvdForm.resetFields()
                    this.$refs.mocvdForm.clearValidate()
                    this.$emit('dialogFalse', {dialog:this.dialog,show: show})
                  })
                })
              } else {
                updateObj(obj).then(res => {
                  this.dialog = false
                  show = true
                  this.$message.success('编辑成功')
                  this.$nextTick(() => {
                    this.$refs.mocvdForm.resetFields()
                    this.$refs.mocvdForm.clearValidate()
                    this.$emit('dialogFalse', {dialog:this.dialog,show: show})
                  })
                })
              }
            } else {
              this.$message.error(mes.msg)
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      // 关闭
      handleClose(formName) {
        this.$emit('dialogFalse', {dialog:false,show: true})
        this.$refs.mocvdForm.resetFields()
        this.$refs.mocvdForm.clearValidate()
      },

      // 取消
      resetForm(formName) {
        this.dialog = false
        this.$nextTick(() => {
          this.$refs.mocvdForm.resetFields()
          this.$refs.mocvdForm.clearValidate()
          this.$emit('dialogFalse', {dialog:this.dialog,show: true})
        })
      },
    }
  }
</script>

<style scoped>
  .long-title>>> .el-form-item__label{
    width: 110px !important;
  }
  .long-title>>> .el-form-item__content {
    margin-left: 110px !important;
  }
  .dialog-input{
    width: 285px;
  }
  .el-checkbox {
    margin-left: 0;
  }
  .input-item{
    float: left;
    margin-right: 10px;
    margin-top: 0;
  }
  .search-input{
    width: 180px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 265px);
  }
  .dialog-title-content{
    padding-left: 30px;
  }
  .app-container>>> .cell{
    line-height: 38px;
    height: auto!important;
  }
  .padding-dialog>>> .el-dialog__body {
    padding-top: 0px;
  }
  .jiange,.mini-input {
    padding-left: 20px;
  }
  .mini-input>>> .el-input--mini {
    width: 70px;
  }
  .mini-input>>> .el-button--text {
    border: 0;
    background-color: transparent;
  }
  .mini-input>>> .el-button--text:hover {
    border: 0;
    background-color: transparent;
  }
  .mini-input>>> .search-input {
    width: 70px;
  }
  .el-table>>> .cell {
    height: auto!important;
  }

  .flex_dialog>>> .el-dialog {
    max-height: 80%;
    display: flex;
    flex-direction: column;
    overflow: hidden;

  }
  .flex_dialog>>> .el-dialog__body {
    flex: 1;
    overflow: auto;
  }
  .ychanchu{
    font-size: 22px;
    color: #d56c28;
    cursor: pointer;
    vertical-align: middle;
  }
  .site-table>>> th .cell {
    text-align: center;
  }
  .site-table>>> .el-button--mini {
    padding: 7px 15px;
  }
  .site-table>>> .el-button:hover{
    border-color: transparent;
    background-color: transparent;
  }
  .svgg {
    font-size: 20px;
  }
  .yadd {
    color: #009494;
  }
  .ychanchu {
    color: #d56c28 ;
  }
  .shanchu1 {
    color: #E25D5D;
  }
  .module-title{
    padding: 7px 0!important;
  }
</style>
