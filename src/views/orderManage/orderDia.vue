<template>
  <div>
    <el-dialog
      v-drag
      :before-close="handleDialogClose"
      :close-on-click-modal="false"
      :visible.sync="orderVisible"
      :title="orderTitle"
      class="padding-dialog flex_dialog"
      width="1100px"
      @close="handleClose">
      <div class="module-title" style="margin-bottom: 10px">
        <div class="module-title-text">订单基础信息</div>
        <u v-if="isRow === 1" class="module-title-pre uStyle" @click="findLastRecord"><svg-icon icon-class="daoru"/>导入上一次</u>
      </div>
      <el-form v-loading="formLoading" ref="orderForm" :validate-on-rule-change="false" :disabled="disabled" :model="orderForm" :rules="rules" size="small" status-icon label-width="110px" label-position="right">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="订单编号" prop="orderNo">
              <el-input v-model="orderForm.orderNo" :disabled="readonly" placeholder="请输入订单编号" type="text" maxlength="20"/>
            </el-form-item>
            <el-form-item label="片型" prop="pattern">
              <el-select v-model="orderForm.pattern" :disabled="readonly" clearable class="dialog-input" placeholder="请选择" filterable @change="changeParttern">
                <el-option
                  v-for="item in patternOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
            <el-form-item label="订单数量(k)" prop="orderNum">
              <el-input v-only-number="{ min: 0, max: 9999999.999, precision: 3 }" v-model="orderForm.orderNum" placeholder="请输入订单数量"/>
            </el-form-item>
            <!-- <el-form-item v-if="!orderForm.pattern" label="Mapping图" prop="mapping">
              <el-select v-model="orderForm.mapping" clearable class="dialog-input" placeholder="请选择" filterable>
                <el-option :value="0" label="是"/>
                <el-option :value="1" label="否"/>
              </el-select>
            </el-form-item> -->
            <div class="check_dialog">
              <!-- <el-checkbox v-model="orderForm.surpass" :disabled="readonly" :true-label="1" :false-label="0">不超请领单</el-checkbox> -->
              <el-checkbox v-model="orderForm.priority" :true-label="1" :false-label="0">加急单</el-checkbox>
              <el-checkbox v-model="orderForm.default" :disabled="readonly" :true-label="1" :false-label="0">使用默认出货规则</el-checkbox>
            </div>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户名称" prop="customerId">
              <el-select v-model="orderForm.customerId" :disabled="readonly" clearable class="dialog-input" placeholder="请选择" filterable @change="changeCustomer">
                <el-option
                  v-for="item in customerList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
            <el-form-item label="产品型号" prop="produceModel">
              <el-select v-model="orderForm.produceModel" :disabled="readonly" clearable class="dialog-input" placeholder="请输入或选择" filterable @change="checkSeries">
                <el-option
                  v-for="item in productCodeList"
                  :key="item.id"
                  :label="item.code"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
            <el-form-item label="订单交期" prop="deliveryDate">
              <el-date-picker
                v-model="orderForm.deliveryDate"
                class="dialog-input"
                size="small"
                type="date"
                placeholder="请输入或选择"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <!-- <div v-if="!orderForm.pattern" class="check_dialog">
              <el-checkbox v-model="orderForm.surpass" :true-label="1" :false-label="0">不超请领单</el-checkbox>
              <el-checkbox v-model="orderForm.priority" :true-label="1" :false-label="0">加急单</el-checkbox>
            </div> -->
          </el-col>
          <el-col :span="8">
            <el-form-item label="订单类型" prop="orderType">
              <el-select v-model="orderForm.orderType" :disabled="readonly" clearable class="dialog-input" placeholder="请选择" filterable>
                <el-option
                  v-for="item in resultOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
            <el-form-item class="dialog_item" label="客制规则" prop="ruleId">
              <el-select v-model="orderForm.ruleId" :disabled="readonly || isDefault" clearable style="width:80%" class="dialog-input" placeholder="请选择" filterable @change="changeRuleId">
                <el-option
                  v-for="item in custormOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
              <div class="svg" @click="watchCustorm('form')">
                <svg-icon style="color: #009494;cursor: pointer;" icon-class="shezhi"/>
              </div>
            </el-form-item>
            <el-form-item label="发货时间">
              <el-date-picker
                v-model="orderForm.sendDate"
                class="dialog-input"
                size="small"
                type="date"
                placeholder="请输入或选择"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="module-title" style="margin-bottom: 10px">
          <div class="module-title-text">订单基本要求</div>
        </div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="是否清洗">
              <el-select v-model="orderForm.clear" clearable class="dialog-input" placeholder="请选择" filterable>
                <el-option :value="1" label="是"/>
                <el-option :value="0" label="否"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="orderForm.pattern ? '下bin时间' : '入库时间'">
              <el-date-picker
                v-model="times"
                :editable="false"
                class="dialog-input"
                size="small"
                type="daterange"
                range-separator="至"
                start-placeholde="开始日期"
                end-placeholde="结束日期"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="外观品质" prop="facede">
              <el-select v-model="orderForm.facede" multiple collapse-tags clearable class="dialog-input" size="small" placeholder="请选择">
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
          </el-col> -->
        </el-row>

        <!-- 订单光参要求 -->
        <div class="module-title" style="margin-bottom: 10px; padding-right: 0;">
          <div class="module-title-text">订单光参要求</div>
          <div>
            <el-select v-if="isParams" v-model="newParam" clearable size="small" @change="sureParams">
              <el-option
                v-for="(it,ind) in parameter"
                :key="ind"
                :label="it.name"
                :value="it.id"
                :disabled="it.disabled"
              />
            </el-select>
            <el-button
              v-if="orderTitle !== '查看订单'"
              size="mini"
              type="primary"
              @click="addHandleParams"
            ><svg-icon icon-class="add"/> 添加参数</el-button>
          </div>
        </div>
        <!-- 动态表单 -->
        <div class="dynamic_parameter">
          <el-form-item
            v-for="(item,index) in orderForm.orderList"
            :key="index"
            :label="item.name"
            prop="orderList">
            <el-form-item
              v-if="item.paramCategory"
              :prop="`orderList.${index}.order_selectVal`"
              :rules="rules.order_selectVal"
              class="innerItem"
              label="">
              <el-select v-model="item.minVal" clearable class="dynamic_select" placeholder="*" filterable @change="choseFH(index)">
                <el-option label=">" value=">"/>
                <el-option label="<" value="<"/>
                <el-option label="≥" value=">="/>
                <el-option label="≤" value="<="/>
                <el-option label="=" value="="/>
                <el-option label="≠" value="!="/>
              </el-select>
            </el-form-item>
            <el-form-item
              v-else
              :prop="`orderList.${index}.order_minVal`"
              :rules="rules.order_minVal"
              class="innerItem"
              label="">
              <el-input v-model="item.minVal" class="dynamic_input" placeholder="*" step="0.01" type="number" onkeyup="this.value=this.value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')" filterable/> ~
            </el-form-item>
            <el-form-item
              :prop="`orderList.${index}.order_maxVal`"
              :rules="rules.order_maxVal"
              class="innerItem"
              label="">
              <el-input v-model="item.maxVal" class="dynamic_input" placeholder="*" filterable step="0.01" type="number" onkeyup="this.value=this.value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')" @keyup.native="changeVal(item,index)"/>
            </el-form-item>
            <div v-if="(orderForm.pattern ? index > 2 : index > 3) && orderTitle !== '查看订单'" class="svg" @click="deleteParams(index,item)">
              <svg-icon style="color: #F56C6C;cursor: pointer;" icon-class="shanchu"/>
            </div>
          </el-form-item>
        </div>
        <!-- 出货参数要求 -->
        <div class="module-title" style="margin-bottom: 10px; padding-right: 0;">
          <div class="module-title-text">出货参数要求</div>
          <el-form-item label-width="130px" label="本次出货数量(k)" prop="outNum">
            <el-input v-only-number="{ min: 0, max: 9999999.999, precision: 3 }" v-model="orderForm.outNum" placeholder="请输入" size="small" clearable/>
          </el-form-item>
          <div>
            <el-button
              v-if="orderTitle !== '查看订单'"
              size="mini"
              type="primary"
              @click="sameOrder"
            ><svg-icon icon-class="add"/> 同订单</el-button>
          </div>
        </div>
        <div class="dynamic_parameter">
          <el-form-item
            v-for="(item,index) in orderForm.outList"
            :key="index"
            :label="item.name"
            prop="outList">
            <el-form-item
              v-if="item.paramCategory"
              :prop="`outList.${index}.out_selectVal`"
              :rules="rules.out_selectVal"
              class="innerItem"
              label="">
              <el-select v-model="item.minVal" clearable disabled class="dynamic_select" placeholder="*" filterable>
                <el-option label=">" value=">"/>
                <el-option label="<" value="<"/>
                <el-option label="≥" value=">="/>
                <el-option label="≤" value="<="/>
                <el-option label="=" value="="/>
                <el-option label="≠" value="!="/>
              </el-select>
            </el-form-item>
            <el-form-item
              v-else
              :prop="`outList.${index}.out_minVal`"
              :rules="rules.out_minVal"
              class="innerItem"
              label="">
              <el-input v-model="item.minVal" class="dynamic_input" placeholder="*" step="0.01" type="number" onkeyup="this.value=this.value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')" filterable/> ~
            </el-form-item>
            <el-form-item
              :prop="`outList.${index}.out_maxVal`"
              :rules="rules.out_maxVal"
              class="innerItem"
              label="">
              <el-input v-model="item.maxVal" class="dynamic_input" placeholder="*" step="0.01" type="number" onkeyup="this.value=this.value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')" filterable/>
            </el-form-item>
          </el-form-item>

        </div>
        <el-form-item label="备注">
          <el-input v-model="orderForm.remark" type="textarea" placeholder="请输入其他规则" size="small" maxlength="20" clearable/>
        </el-form-item>
        <custormizatoin-dia
          :disabled="true"
          :row="custormForm"
          :is-row="2"
          :table-key="1"
          :customer-list="customerList"
          :add-dialog-visible="kzhDialog"
          dialog-title="客制化规则"
          @dialogFalse="kzhDialog = false"/>
        <el-dialog
          :close-on-click-modal="false"
          :visible.sync="kcDialog"
          title="查看"
          append-to-body
          width="780px"
          class="padding-dialog flex_dialog top_dis"
          @close="kcDialog = false">
          <div style="margin-bottom: 10px;text-align: right;font-weight: bold;">
            <span style="margin-right:15px">
              总计片数: {{ totalPS }}
            </span>
            <span>
              颗粒数: {{ totalKLS }}
            </span>
          </div>
          <el-table
            v-loading="isResponse"
            ref="kcTable"
            :data="kcList"
            height="690"
            class="broad-scrollbar-table"
            element-loading-text="拼命加载中"
            highlight-current-row
            border
            fit
          >
            <el-table-column label="档位" align="center" prop="sort"/>
            <el-table-column v-for="(item,index) in orderForm.outList" :key="index" :label="item.name" :prop="item.param" align="center"/>
            <el-table-column label="可出片数" align="center" prop="num"/>
            <el-table-column label="可出颗粒数（k）" align="center" prop="numK"/>
          </el-table>
        </el-dialog>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <div v-if="orderTitle === '查看订单'">
          <el-button size="small" @click="resetForm('orderForm')">关 闭</el-button>
        </div>
        <div v-else>
          <el-button :disabled="isResponse" size="small" type="primary" @click="lookInventory('orderForm')">查看库存</el-button>
          <el-button :disabled="isResponse" size="small" type="primary" @click="submitForm('orderForm',0)">存为草稿</el-button>
          <el-button :disabled="isResponse" size="small" type="primary" @click="submitForm('orderForm',1)">提 交</el-button>
          <el-button size="small" @click="resetForm('orderForm')">取 消</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getExceptionCode } from '@/api/chipManage/rearSiteManage/visualInspectionInfo'
import { findById, findSelect } from '@/api/orderManage/custormization'
import { checkSeries, saveObj, updateObj, lookInventory, findLastRecord } from '@/api/orderManage/orderManagement'
import { findProductCode } from '@/api/chipManage/rearSiteManage/cowInfo'
import custormizatoinDia from './custormizatoinDia'
import { deepCopy } from '@/utils'
export default {
  components: { custormizatoinDia },
  props: {
    /* eslint-disable */
      metalDialogVisible: {
        type: Boolean,
        default: false
      },
      orderTitle: String,
      disabled: {
        type: Boolean,
        default: false
      },
      row: Object,
      isRow: Number,
      customerList: Array,
    },
    data() {
      // 判断订单的最小值
      const validateOrderMin = (rule, value, cb) => {
        const val = this.orderForm.orderList[rule.field.split('.')[1]].minVal
        if (val === '') {
          cb(new Error('请输入'))
        } else if (this.orderForm.orderList[rule.field.split('.')[1]].maxVal !== '') {
          if (+this.orderForm.orderList[rule.field.split('.')[1]].maxVal < +val) {
            cb(new Error('不能大于最大参数'))
          } else {
            cb()
          }
        } else {
          cb()
        }
      }
      // 判断订单的最大值
      const validateOrderMax = (rule, value, cb) => {
        const val = this.orderForm.orderList[rule.field.split('.')[1]].maxVal
        if (val === '') {
          cb(new Error('请输入'))
          // 判断是范围值
        } else if (this.orderForm.orderList[rule.field.split('.')[1]].paramCategory) {
          // 最大值只能是100
          if (+val > 9999) {
            cb(new Error('最大值是9999'))
          } else {
            cb()
          }
          // 是区间值
        } else if (!this.orderForm.orderList[rule.field.split('.')[1]].paramCategory) {
          // 判断最小值存在与否
          if (this.orderForm.orderList[rule.field.split('.')[1]].minVal !== '') {
            // 如果存在最小值,判断最小值不能大于最大值
            if (+this.orderForm.orderList[rule.field.split('.')[1]].minVal > +val) {
              cb(new Error('不能小于最小参数'))
            } else {
              cb()
            }
          } else {
            cb()
          }
        } else {
          cb()
        }
      }
      // 当是范围值的时候范围下拉框的判断
      const validateOrderSelect = (rule, value, cb) => {
        if (this.orderForm.orderList[rule.field.split('.')[1]].minVal === '') {
          cb(new Error('请选择符号'))
        } else {
          cb()
        }
      }
      // 判断出货的最小值
      const validateOutMin = (rule, value, cb) => {
        const index = rule.field.split('.')[1]
        const val = this.orderForm.outList[index].minVal
        if (this.orderForm.orderList[index].minVal === '' || this.orderForm.orderList[index].maxVal === '') {
          cb(new Error('请先填写订单光参'))
        } else {
          // 判断最小参数有没有填写
          if (val === '') {
            cb(new Error('请输入'))
            // 判断最大参数有没有填写
          } else if (this.orderForm.outList[index].maxVal !== '') {
            // 比较最小参数不能大于最大参数
            if (+this.orderForm.outList[index].maxVal < +val) {
              cb(new Error('不能大于最大参数'))
            } else {
              // 出库这个字段的验证通过以后比较一下他与订单的关系
              if (+this.orderForm.orderList[index].minVal > +val || +this.orderForm.orderList[index].maxVal < +val) {
                cb(new Error('不可超出订单参数范围'))
              } else {
                cb()
              }
            }
          } else {
            cb()
          }
        }
      }
      // 判断出货的最大值
      const validateOutMax = (rule, value, cb) => {
        const index = rule.field.split('.')[1]
        const val = this.orderForm.outList[index].maxVal
        if (this.orderForm.orderList[index].minVal === '' || this.orderForm.orderList[index].maxVal === '') {
          cb(new Error('请先填写订单光参'))
        } else {
          // 判断这个值有没有存在
          if (val === '') {
            cb(new Error('请输入'))
            // 判断是范围值
          } else if (this.orderForm.outList[index].paramCategory) {
            // 最大值只能是100
            if (+val > 9999) {
              cb(new Error('最大值是9999'))
              // 判断这个值只能在订单范围内
            } else {
              // 如果是大于号
              if (this.orderForm.orderList[index].minVal === '>' || this.orderForm.orderList[index].minVal === '≥') {
                // 如果比订单的值小（有交集）
                if (+this.orderForm.orderList[index].maxVal > +val) {
                  cb(new Error('不可超出订单参数范围'))
                } else {
                  cb()
                }
                // 如果是小于号
              } else if (this.orderForm.orderList[index].minVal === '<' || this.orderForm.orderList[index].minVal === '≤') {
                if (+this.orderForm.orderList[index].maxVal < +val) {
                  cb(new Error('不可超出订单参数范围'))
                } else {
                  cb()
                }
              } else {
                if (+this.orderForm.orderList[index].maxVal !== +val) {
                  cb(new Error('不可超出订单参数范围'))
                } else {
                  cb()
                }
              }
            }
            // 是区间值
          } else if (!this.orderForm.outList[index].paramCategory) {
            // 判断最小值存在与否
            if (this.orderForm.outList[index].minVal !== '') {
              
              // 如果存在最小值,判断最小值不能大于最大值
              if (+this.orderForm.outList[index].minVal > +val) {
                cb(new Error('不能小于最小参数'))
              } else {
                // 判断不能和订单参数有交集
                if (+this.orderForm.orderList[index].maxVal < +val) {
                  cb(new Error('不可超出订单参数范围'))
                } else {
                  cb()
                }
              }
            } else {
              cb()
            }
          } else {
            cb()
          }
        }
      }
      // 当是范围值的时候范围下拉框的判断
      const validateOutSelect = (rule, value, cb) => {
        if (this.orderForm.outList[rule.field.split('.')[1]].minVal === '') {
          cb(new Error('请选择符号'))
        } else {
          cb()
        }
      }
      return {
        materialDialogChange: false,
        orderVisible: false,
        patternOptions: [
          { id: 0, name: '圆片' },
          { id: 1, name: '方片' }
        ],
        resultOptions: [
          { id: 0, name: '出库' },
          { id: 1, name: '备货' }
        ],
        productCodeList: [],
        custormOptions: [], // 客制化规则
        exceptionCode: [],
        custormForm: {},
        kcList: [], // 库存列表
        isParams: false,
        totalPS: 0,
        totalKLS: 0,
        formLoading: false,
        readonly: false,
        kcDialog: false,
        isResponse: false,
        listLoading: false,
        kzhDialog: false,
        isDefault: false,
        newParam: '', // 新增参数
        isVioletLight: 0, // 是否紫光
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
        // 增加或者修改订单信息
        orderForm: {
          orderNo: '', // 订单编号
          pattern: '', // 片型
          orderNum: '', // 订单数量
          surpass: 0, // 不超请领单
          priority: 0, // 加急单
          default: 0,  //是否默认出货规则
          // mapping: '', // Mapping图
          customerId: '', // 客户名称
          produceModel: '', // 产品型号
          deliveryDate: '', // 订单交期
          orderType: '', // 订单类型
          ruleId: '', // 客制化规则
          sendDate: '', // 发货时间
          clear: '', // 是否清洗
          creator: 0, // 创建人id
          startTime: '', // 开始时间
          endTime: '', // 结束时间
          outNum: '', // 出货数量
          // facede: ['A'], // 外观品质
          // 订单以及出货光参要求
          paramsList: [
            {
              minVal: '',
              maxVal: '',
              param: '',
              paramCategory: 0, // 区间参--0   范围参--1
              paramType: 0 // 订单--0   出货--1
            }
          ],
          // 订单列表
          orderList: [
            {
              minVal: '',
              maxVal: '',
              param: '',
              name: '',
              paramCategory: 0, // 区间参--0   范围参--1
              paramType: 0 // 订单--0   出货--1
            }
          ],
          //
          outList: [
            {
              minVal: '',
              maxVal: '',
              param: '',
              name: '',
              paramCategory: 0, // 区间参--0   范围参--1
              paramType: 1 // 订单--0   出货--1
            }
          ],
          remark: '', // 备注
          status: 0 // 状态
        },
        times: '',
        rules: {
          orderNo: [{ required: true, message: '请输入订单编号', trigger: 'blur' }],
          pattern: [{ required: true, message: '请选择', trigger: 'blur' }],
          orderNum: [{ required: true, message: '请输入订单数量', trigger: 'blur' }],
          customerId: [{ required: true, message: '请选择', trigger: 'blur' }],
          produceModel: [{ required: true, message: '请选择', trigger: 'blur' }],
          orderType: [{ required: true, message: '请选择', trigger: 'blur' }],
          ruleId: [{ required: true, message: '请选择', trigger: 'blur' }],
          outNum: [{ required: true, message: '请输入本次出货数量', trigger: 'blur' }],
          orderList: [{ required: true }],
          order_minVal: [{ required: true, validator: validateOrderMin, trigger: 'blur' }],
          order_maxVal: [{ required: true, validator: validateOrderMax, trigger: 'blur' }],
          order_selectVal: [{ required: true, validator: validateOrderSelect, trigger: 'blur' }],
          outList: [{ required: true }],
          out_minVal: [{ required: true, validator: validateOutMin, trigger: 'blur' }],
          out_maxVal: [{ required: true, validator: validateOutMax, trigger: 'blur' }],
          out_selectVal: [{ required: true, validator: validateOutSelect, trigger: 'blur' }]
        },
      }
    },
    watch: {
      orderForm: {
        handler(val, oldVal) {
          if(this.$refs.orderForm){
            this.$refs.orderForm.clearValidate()
          }
          if(val.default) {
            // debugger
            this.isDefault = true
            this.orderForm.ruleId = ''
            this.rules.ruleId[0].required = false
          } else {
            this.isDefault = false
            this.rules.ruleId[0].required = true
          }
          this.materialDialogChange = true
        },
        deep: true
      },
      // 'orderForm.default': {
      //   handler(val) {
      //     if(val) {
      //       // debugger
      //       this.isDefault = true
      //       this.orderForm.ruleId = ''
      //       this.rules.ruleId[0].required = false
      //     } else {
      //       this.isDefault = false
      //       this.rules.ruleId[0].required = true
      //     }
      //   }
      // },
      row(val) {
        this.init(val)
      },
      metalDialogVisible(val) {
        this.orderVisible = this.metalDialogVisible
        if(this.isRow === 1) {
          this.init()
        }
      },
      isRow() {
        this.init()
      },
      times(val) {
        this.orderForm.startTime = val[0]
        this.orderForm.endTime = val[1]
      }
    },
    mounted() {
      this.getExceptionCodeFun()
      this.findProductCodeFun()
    },
    methods: {
      init(row) {
        
        setTimeout(() => {
          this.materialDialogChange = false
        }, 500);
        if (this.orderForm.pattern) {
          this.parameter = this.FParams
        } else {
          this.parameter = this.YParams
        }
        if(this.isRow === 1) {
            this.readonly = false
          this.orderForm.orderNo = ''
          this.orderForm.pattern = 1
          this.orderForm.orderNum = ''
          // this.orderForm.surpass = 0
          this.orderForm.priority = 0
          this.orderForm.default = 0
          // this.orderForm.mapping = ''
          this.orderForm.customerId = ''
          this.orderForm.produceModel = ''
          this.orderForm.deliveryDate = this.formatDate(new Date().getTime())
          this.orderForm.orderType = 0
          this.orderForm.ruleId = ''
          this.orderForm.sendDate = this.formatDate(new Date().getTime())
          this.orderForm.clear = ''
          this.orderForm.startTime = ''
          this.orderForm.endTime = ''
          this.times = ''
          this.orderForm.outNum = ''
          // this.orderForm.facede = ['A']
          this.orderForm.paramsList = []
          this.orderForm.remark = ''
          this.orderForm.status = 0
          this.materialDialogChange = false
          this.orderForm.creator = Number(sessionStorage.getItem('User-Id'))
          this.changeParttern(this.orderForm.pattern,this.orderForm)
          if( row) {
            // this.readonly = true
            if (row.pattern) {
              this.parameter = this.FParams
            } else {
              this.parameter = this.YParams
            }
            if(row.ruleId === 1 || row.ruleId === 2 || row.ruleId === 3|| row.ruleId === 4) {
              row['default'] = 1
            } else {
              row['default'] = 0
            }
            if(row.default){
              this.orderForm.customerId = ''
              this.rules.customerId[0].required = false
            } else {
              this.orderForm.customerId = row.customerId
              this.rules.customerId[0].required = true
            }
            Object.assign(this.orderForm, JSON.parse(JSON.stringify(row)))
            // this.orderForm.facede = row.facede ? row.facede.split(',') : []
            this.times = this.orderForm.startTime ? [this.orderForm.startTime, this.orderForm.endTime] : []
            this.orderForm.paramsList.length && this.orderForm.paramsList.map(_ => {
              this.parameter.map(i => {
                if (_.param === i.id) {
                  _['name'] = i.name
                }
              })
            })
            this.orderForm.orderList = []
            this.orderForm.outList = []
            // this.orderForm.ruleId = (this.custormOptions.findIndex(_=> _.id === row.ruleId)>-1) ? row.ruleId : ''
            this.materialDialogChange = false
            this.$set(this.orderForm, 'orderList', this.orderForm.paramsList.filter(_ => _.paramType === 0))
            this.$set(this.orderForm, 'outList', this.orderForm.paramsList.filter(_ => _.paramType === 1))
            // this.changeParttern(row.pattern,this.orderForm)
          }
        } else if(this.isRow === 2) {
          if( row) {
            this.readonly = true
            if (row.pattern) {
              this.parameter = this.FParams
            } else {
              this.parameter = this.YParams
            }
            this.changeParttern(row.pattern,row)
            this.changeRuleId(row.ruleId)
            if(row.ruleId === 1 || row.ruleId === 2 || row.ruleId === 3|| row.ruleId === 4) {
              row['default'] = 1
            } else {
              row['default'] = 0
            }
            if(row.default){
              this.orderForm.customerId = ''
              this.rules.customerId[0].required = false
            } else {
              this.orderForm.customerId = row.customerId
              this.rules.customerId[0].required = true
            }
            Object.assign(this.orderForm, JSON.parse(JSON.stringify(row)))
            // this.orderForm.facede = row.facede ? row.facede.split(',') : []
            this.times = this.orderForm.startTime ? [this.orderForm.startTime, this.orderForm.endTime] : []
            this.orderForm.paramsList.length && this.orderForm.paramsList.map(_ => {
              this.parameter.map(i => {
                if (_.param === i.id) {
                  _['name'] = i.name
                }
              })
            })
            // this.orderForm.ruleId = (this.custormOptions.findIndex(_=> _.id === row.ruleId)>-1) ? row.ruleId : ''
            this.materialDialogChange = false
            this.$set(this.orderForm, 'orderList', this.orderForm.paramsList.filter(_ => _.paramType === 0))
            this.$set(this.orderForm, 'outList', this.orderForm.paramsList.filter(_ => _.paramType === 1))
          }
        } else {
            this.readonly = false
          
          return
        }
      },
      // 获取产品型号
      findProductCodeFun() {
        findProductCode({}).then(res => {
          this.productCodeList = res.data
        })
      },

      // 时间戳转yyyy-mm-dd
      formatDate(timeStamp) {
        var date = new Date(timeStamp)
        var y = 1900 + date.getYear()
        var m = '0' + (date.getMonth() + 1)
        var d = '0' + date.getDate()
        return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
      },
      // 修改片型
      changeParttern(val,row) {
        if (val) {
          this.parameter = this.FParams
        } else {
          this.parameter = this.YParams
        }
        this.initList(row)
        const requestParams = {
          pattern: row ? row.pattern : this.orderForm.pattern,
          customerId: row ? row.customerId : this.orderForm.customerId
        }
        findSelect(requestParams).then(res => {
          this.custormOptions = res.data
        })
      },
      // 获取客制化订单列表
      fetchCustormData() {
        const requestParams = {
          pattern: 1
        }
        findSelect(requestParams).then(res => {
          this.custormOptions = res.data
          // this.totalPage = parseInt(res.data.total)
        })
      },

      // 查看当前客制化规则
      changeRuleId(val) {
        const requestParams = {
          ruleId: val,
          pageSize: 999,
          pageNum: 1
        }
        if(requestParams.ruleId) {
          findById(requestParams).then(res => {
            this.custormForm = res.data
            this.orderForm.surpass = this.custormForm.numRule
          })
        }
      },
      // 查看客制化规则
      watchCustorm(type, ruleId) {
        if (type === 'form') {
          if(this.orderForm.default) {
              this.kzhDialog = true
              let ruleid = 1
              switch (params.pattern) {
                case 1:
                  ruleid = this.isVioletLight ? 3 : 1
                  break;
                case 0:
                  ruleid = this.isVioletLight ? 4 : 2
                  break;
                default:
                  break;
              }
            this.changeRuleId(ruleid)
          } else {
            if (this.orderForm.ruleId) {
              this.kzhDialog = true
              this.changeRuleId(this.orderForm.ruleId)
            } else {
              this.$message.error('请先选择要查看的客制化规则')
            }
          }
        } else {
          const requestParams = {
            ruleId: this.orderForm.ruleId,
            pageSize: 999,
            pageNum: 1
          }
          findById(requestParams).then(res => {
            this.custormForm = res.data
            this.kzhDialog1 = true
          })
        }
      },
      // 初始化动态表单
      initList(row) {
        console.log({row});
        if(row && row.orderNo !== '') {
          this.$set(this.orderForm, 'orderList', row.paramsList.filter(_ => _.paramType === 0))
            this.$set(this.orderForm, 'outList', row.paramsList.filter(_ => _.paramType === 1))
        } else {
          this.orderForm.orderList = [
            {
              minVal: '',
              maxVal: '',
              name: this.isVioletLight ? 'WLP' : 'WLD',
              param: this.orderForm.pattern ? (this.isVioletLight ? 'wlp' : 'wld') : (this.isVioletLight ? 'wlp_avg' : 'wld_avg'),
              paramCategory: 0, // 区间参--0   范围参--1
              paramType: 0 // 订单--0   出货--1
            },
            {
              minVal: '',
              maxVal: '',
              name: 'LOP',
              param: this.orderForm.pattern ? 'lop' : 'lop_avg',
              paramCategory: 0, // 区间参--0   范围参--1
              paramType: 0 // 订单--0   出货--1
            },
            {
              minVal: '',
              maxVal: '',
              name: 'VF1',
              param: this.orderForm.pattern ? 'vf1' : 'vf1_avg',
              paramCategory: 0, // 区间参--0   范围参--1
              paramType: 0 // 订单--0   出货--1
            }
  
          ]
          this.orderForm.outList = [
            {
              minVal: '',
              maxVal: '',
              name: this.isVioletLight ? 'WLP' : 'WLD',
              param: this.orderForm.pattern ? (this.isVioletLight ? 'wlp' : 'wld') : (this.isVioletLight ? 'wlp_avg' : 'wld_avg'),
              paramCategory: 0, // 区间参--0   范围参--1
              paramType: 1 // 订单--0   出货--1
            },
            {
              minVal: '',
              maxVal: '',
              name: 'LOP',
              param: this.orderForm.pattern ? 'lop' : 'lop_avg',
              paramCategory: 0, // 区间参--0   范围参--1
              paramType: 1 // 订单--0   出货--1
            },
            {
              minVal: '',
              maxVal: '',
              name: 'VF1',
              param: this.orderForm.pattern ? 'vf1' : 'vf1_avg',
              paramCategory: 0, // 区间参--0   范围参--1
              paramType: 1 // 订单--0   出货--1
            }
          ]
        }
        if (!this.orderForm.pattern) {
          this.orderForm.orderList.push(
            {
              minVal: '',
              maxVal: '',
              name: this.isVioletLight ? 'WLP_STD' : 'WLD_STD',
              param: this.isVioletLight ? 'wlp_std' : 'wld_std',
              paramCategory: 0, // 区间参--0   范围参--1
              paramType: 0 // 订单--0   出货--1
            }
          )
          this.orderForm.outList.push(
            {
              minVal: '',
              maxVal: '',
              name: this.isVioletLight ? 'WLP_STD' : 'WLD_STD',
              param: this.isVioletLight ? 'wlp_std' : 'wld_std',
              paramCategory: 0, // 区间参--0   范围参--1
              paramType: 1 // 订单--0   出货--1
            }
          )
        }
        this.parameter.map(_ => {
          _['disabled'] = false
        })
        console.log({orderList:this.orderForm});
        this.orderForm.orderList.map(i => {
          this.parameter.map(_ => {
            if (i.param === _.id) {
              _['disabled'] = true
            }
          })
        })
      },

      // 选择符号
      choseFH(index) {
        this.orderForm.outList[index].minVal = this.orderForm.orderList[index].minVal
      },
      // 范围区间赋值
      changeVal(item, index) {
        if (item.paramCategory) {
          this.$set(this.orderForm.outList[index], 'maxVal', this.orderForm.orderList[index].maxVal)
        }
      },
      // 同订单
      sameOrder() {
        this.orderForm.outList = deepCopy(this.orderForm.orderList)
        this.orderForm.outList.map(_ => {
          _.paramType = 1
        })
      },
      // 添加动态参数
      addHandleParams() {
        if (this.parameter.length) {
          this.isParams = true
        } else {
          this.$message.error('请先选择片型！')
        }
      },
      // 确认新加的动态参数
      sureParams(val) {
        this.isParams = false
        const obj = this.parameter.find(i => i.id === val)
        obj.disabled = true
        this.orderForm.orderList.push({
          minVal: '',
          maxVal: '',
          param: obj.id,
          name: obj.name,
          paramCategory: obj.paramCategory, // 区间参--0   范围参--1
          paramType: 0 // 订单--0   出货--1
        })
        this.orderForm.outList = deepCopy(this.orderForm.orderList)
        this.orderForm.outList.map(_ => {
          _.paramType = 1
        })
        this.newParam = ''
      },
      // 删除动态参数
      deleteParams(index, item) {
        this.orderForm.orderList.splice(index, 1)
        this.orderForm.outList.splice(index, 1)
        this.parameter.find(i => i.id === item.param).disabled = false
      },
      // 确定新增
      submitForm(formName, status) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let show = false
            this.formLoading = true
            this.isResponse = true
            this.orderForm.status = status
            this.orderForm.creator = Number(sessionStorage.getItem('User-Id'))
            this.orderForm.paramsList = [...this.orderForm.orderList, ...this.orderForm.outList]
            this.changeRuleId(this.orderForm.ruleId)
            const params = this.orderForm
            let modelName = ''
            modelName = this.productCodeList.find(_=> _.id === this.orderForm.produceModel).code
            params['modelName'] = modelName
            if(params.default) {
              switch (params.pattern) {
                case 1:
                  params.ruleId = this.isVioletLight ? 3 : 1
                  break;
                case 0:
                  params.ruleId = this.isVioletLight ? 4 : 2
                  break;
                default:
                  break;
              }
            }
            // if(this.orderForm.surpass && (+this.orderForm.outNum > +this.orderForm.orderNum)) {
            //   this.$message.error('出货数量不得超出订单数量！')
            // } else {
              // params.facede = this.orderForm.facede.toString()
              // params.mapping = !params.pattern ? params.mapping : null
              if (this.orderTitle === '新增订单') {
                saveObj(params).then(res => {
                  this.isResponse = false
                  show = true
                  this.$message({
                    type: 'success',
                    message: '新增成功!'
                  })
                  this.formLoading = false
                  this.orderVisible = false
                  this.$emit('dialogFalse', {orderVisible:this.orderVisible,show: show})
                }).catch(err => {
                  this.formLoading = false
                  this.isResponse = false
                  console.log(err)
                })
              } else {
                updateObj(params).then(res => {
                  show = true
                  this.$message({
                    type: 'success',
                    message: '编辑成功!'
                  })
                  this.formLoading = false
                  this.isResponse = false
                  this.orderVisible = false
                  this.$emit('dialogFalse', {orderVisible:this.orderVisible,show: show})
                }).catch(err => {
                  this.formLoading = false
                  this.isResponse = false
                  console.log(err)
                })
              }
            // }
          } else {
            return false
          }
        })
      },
      // 查询库存
      lookInventory(formName) {
        if (!this.orderForm.default && !this.orderForm.ruleId) {
          this.$message.error('请先选择客制化规则！')
        } else {
          let flag = 0
          this.orderForm.outList.map(_ => {
            if (_.maxVal === '' || _.minVal === '') {
              flag = 1
            }
          })
          let modelName = ''
          modelName = this.orderForm.produceModel ? this.productCodeList.find(_=> _.id === this.orderForm.produceModel).code : ''
          if(modelName === '') {
            this.$message.error('产品型号不能为空！')
          } else {
            if (flag) {
              this.$message.error('出货参数不能为空！')
            } else {
            const param = {
              paramsList: this.orderForm.outList,
                pattern: this.orderForm.pattern,
                ruleId: this.orderForm.ruleId,
                clear: this.orderForm.clear,
                startTime: this.orderForm.startTime ? this.orderForm.startTime : '',
                endTime: this.orderForm.endTime ? this.orderForm.endTime : '',
                // facede: this.orderForm.facede.toString()

              }
            if(this.orderForm.default) {
              switch (param.pattern) {
                case 1:
                  param.ruleId = this.isVioletLight ? 3 : 1
                  break;
                case 0:
                  param.ruleId = this.isVioletLight ? 4 : 2
                  break;
                default:
                  break;
              }
            }
            param['modelName'] = modelName
              this.formLoading = true
              this.isResponse = true
              lookInventory(param).then(res => {
                this.formLoading = false
                this.isResponse = false
                this.totalKLS = 0
                this.totalPS = 0
                for (const item of res.data) {
                  const keys = Object.keys(item)
                  for (const key of keys) {
                    if ((item[key] + '').indexOf('-') > -1 || (item[key] + '').indexOf('～') > -1) {
                      item[key] = item[key].replace(/=/g, '')
                    }
                  }
                  this.totalKLS = parseFloat((this.totalKLS + parseFloat(item.numK)).toFixed(2))
                  this.totalPS = this.totalPS + parseInt(item.num)
                }
                this.kcList = res.data
                this.kcDialog = true
              }).catch(err => {
                this.formLoading = false
                this.isResponse = false
                console.log(err)
              })
            }
          }
        }
      },
      // 查询是否为紫光
      checkSeries(val) {
        if(val !== '') {
          const code = this.productCodeList.find(_ => _.id === val).code.substr(0, 1)
          checkSeries({ code: code }).then(res => {
            this.isVioletLight = res.data
            this.initList()
          })
        } else {
          this.isVioletLight = 0
          this.initList()
        }
      },
      // 外观数据
      getExceptionCodeFun() {
        getExceptionCode({}).then(res => {
          this.exceptionCode = res.data
          this.exceptionCode.splice(0, 0, { label: 'A', options: [{ id: 0, code: 'A', name: '正品' }] })
        })
      },
      // 修改客户
      changeCustomer() {
        if (this.orderForm.customerId !== null && this.orderForm.customerId !== '') {
          const requestParams = {
            pattern: this.orderForm.pattern,
            customerId: this.orderForm.customerId
          }
          findSelect(requestParams).then(res => {
            this.custormOptions = res.data
          })
        } else {
          this.custormOptions = []
        }
      },
      // 导入上一次
      findLastRecord() {
        if (!this.orderForm.customerId) {
          this.$message.error('请先选择客户名称！')
        } else if (!this.orderForm.produceModel) {
          this.$message.error('请先选择产品型号！')
        } else {
          this.$confirm('导入后，将会覆盖当前已经编辑好的数据，仍要导入？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            findLastRecord({ customerId: this.orderForm.customerId, produceModel: this.orderForm.produceModel }).then(res => {
              this.init(res.data)
            })
          })
        }
      },
      // 关闭模态框
      handleDialogClose(done) {
        if (this.materialDialogChange && this.orderTitle !== '查看订单') {
          this.$confirm('数据已经发生改变，退出将不会保存，是否退出？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$emit('dialogFalse', {orderVisible:this.orderVisible,show: true})
            done()
          })
        } else {
          done()
        }
      },
      handleClose() {
        this.$emit('dialogFalse', {orderVisible:this.orderVisible,show: true})
        this.$refs.orderForm.resetFields()
        this.$refs.orderForm.clearValidate()
      },
      // 取消
      resetForm(formName) {
        if (this.materialDialogChange && this.orderTitle !== '查看订单') {
          this.$confirm('数据已经发生改变，退出将不会保存，是否退出？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.orderVisible = false
            this.$emit('dialogFalse', {orderVisible:this.orderVisible,show: true})
            this.$refs[formName].resetFields()
          })
        } else {
          this.orderVisible = false
          this.$refs[formName].resetFields()
        }
      }
    }

  }
</script>
<style scoped>
  .app-container>>> .cell{
    line-height: 33px;
  }
  .app-container>>> td{
    height: 33px;
  }
  .padding-dialog>>> .cell{
    line-height: 28px;
  }
  .padding-dialog>>> td{
    height: 28px;
  }
  .padding-dialog>>> .el-dialog__footer{
    padding-top: 0;
  }

  .input-item{
    float: left;
    margin-top: 14px;
    margin-right: 10px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 312px);
  }
  .module-title-text{
    margin-bottom: 10px;
  }
  .module-title {
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    position: relative;
  }
  .module-title>>> .el-form-item {
    position: absolute;
    right: 130px;
    top: 8px;
  }
  .module-title-pre {
    line-height: 30px;
  }
  .search-input{
    width: 138px;
  }
  .input-title{
    width: 62px;
  }
  .dialog-input{
    width: 100%;
  }
  .dialog-input>>> .el-range-separator{
    width: 20px;
    line-height: 24px;
  }
  .dialog-input>>> .el-range__close-icon {
    width: 0;
  }
  .img-dialog>>> .el-dialog__header{
    background: #fff;
  }
  .img-dialog>>> .el-dialog__headerbtn .el-dialog__close {
    color: #bbb;
  }
  .padding-dialog>>> .el-dialog__body {
    padding: 15px;
  }
  .top_dis>>> .el-dialog__body {
    padding-top: 15px;
  }
  .padding-dialog>>> .el-upload{
    display: none;
  }
  .flex_dialog>>> .el-dialog {
    max-height: 90%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    margin-top: 8vh!important;
  }
  .flex_dialog>>> .el-input__inner {
    line-height: 28px;
    height: 28px;
  }
  .flex_dialog>>> .el-form-item {
    margin-bottom: 16px;
  }
  .flex_dialog>>> .el-dialog__body {
    flex: 1;
    overflow: auto;
  }
  .flex_dialog>>> .v-modal {
    z-index: 2000!important
  }
  .check_dialog {
    margin-left: 110px;
    display: flex;
    justify-content: flex-start;
  }
  .check_dialog>>> .el-checkbox {
    margin-left: 0;
    margin-right: 10px;
  }
  .dialog_item>>> .el-form-item__content {
    display: flex;
  }
  .svg {
    font-size: 18px;
    padding: 0 10px;
  }
  .dynamic_parameter {
    width: 100%;
    overflow: hidden;
  }
  .dynamic_parameter>>> .el-form-item {
    width: 33%;
    float: left;
    margin-bottom: 0;
  }
  .dynamic_parameter>>> .el-form-item__content {
    display: flex;
  }
  .dynamic_input {
    width: 80%;
  }
  .dynamic_select {
    width: 100%;
    margin-right: 20px;
  }
  .dynamic_parameter>>> .el-form-item__content {
    position: relative;
  }
  .dynamic_parameter>>> .svg {
    padding: 0 10px;
    position: absolute;
    right: -10px;
  }
  .dynamic_parameter>>> .el-form-item {
    margin-bottom: 10px;
  }
  .innerItem {
    width: 100%!important;
  }
  .uStyle {
    cursor: pointer;
    font-weight: 900;
    color: #009494;
  }
  .uStyle svg {
    margin-right: 5px;
  }
  .input-item>>> .el-radio {
    margin-right: 6px;
  }
</style>
