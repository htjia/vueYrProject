<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 15px">
      <div :class="{'no-border': hidden}" class="header-btn-group">
        <el-button
          size="small"
          type="primary"
          @click="adjustment" ><svg-icon icon-class="kucuntiaoz"/> 库存调整</el-button>
        <el-button
          size="small"
          type="primary"
          @click="handlePrint"
        ><svg-icon icon-class="print"/> 打印出库单</el-button>
        <el-button
          size="small"
          type="primary"
          @click="handleBoxPrint"
        ><svg-icon icon-class="print"/> 打印出库盒标签</el-button>
        <el-button
          size="small"
          type="primary"
          @click="handleTablePrint"
        ><svg-icon icon-class="print"/> 打印透视表</el-button>
        <el-button
          v-if="hidden"
          class="float-right"
          size="small"
          type="info"
          @click="hidden = false"
        >
          <svg-icon icon-class="xiangxia"/> 展开
        </el-button>
        <div class="clear-both"/>
      </div>
      <div v-if="!hidden" style="overflow: auto;">
        <div class="input-item">
          <span class="input-title">任务单号</span>
          <el-input v-model="searchKeys.rwdh" class="search-input" placeholder="请输入任务单号" size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item">
          <span class="input-title">出库形式</span>
          <el-select v-model="searchKeys.ckxs" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in shapeOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">单据类型</span>
          <el-select v-model="searchKeys.djlx" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in processOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">审核状态</span>
          <el-select v-model="searchKeys.shzt" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in auditOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">客户名称</span>
          <el-select v-model="searchKeys.khmc" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in customerList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div style="float: left;width: 600px; height: 46px;">
          <div class="input-item" style="margin-right: 20px;margin-left: 10px;padding-top: 8px">
            <el-radio-group v-model="timeRadio">
              <el-radio :label="0">申请日期</el-radio>
              <el-radio :label="1">审核日期</el-radio>
            </el-radio-group>
          </div>
          <div class="input-item">
            <el-date-picker
              v-model="beginDate"
              :picker-options="pickerOptionsStart"
              :editable="false"
              class="search-input"
              size="small"
              type="date"
              placeholder="开始日期"
              value-format="timestamp"
            />
            <span style="display:inline-block;width: 38px;text-align: center"> 至 </span>
            <el-date-picker
              v-model="endDate"
              :picker-options="pickerOptionsEnd"
              :editable="false"
              class="search-input"
              size="small"
              type="date"
              placeholder="结束日期"
              value-format="timestamp"
            />
          </div>
        </div>
        <div style="float: left;">
          <el-button
            style="margin-top: 15px"
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="handleSearch" >查 询</el-button>
          <el-button
            style="margin-top: 15px"
            size="small"
            type="danger"
            @click="clearSearch"
          >
            <svg-icon icon-class="clear"/> 重 置
          </el-button>
        </div>
        <el-button
          v-if="!hidden"
          class="float-right"
          style="margin-top: 15px"
          size="small"
          type="info"
          @click="setHidden"
        >
          <svg-icon icon-class="xiangshang"/> 收起
        </el-button>
      </div>
    </div>
    <div :class="{'height-app-container': hidden}" class="app-container" >
      <el-table
        v-loading="listLoading"
        ref="billTable"
        :data="list"
        height="90%"
        class="broad-scrollbar-table"
        element-loading-text="拼命加载中"
        border
        fit
        highlight-current-row
        @row-click="rowClick"
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="任务单号" align="center" prop="apply_no" width="120" show-overflow-tooltip/>
        <el-table-column label="出库形式" align="center" prop="alnTaskId" width="60" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.type === 0">出库</div>
            <div v-if="scope.row.type === 1">备货</div>
          </template>
        </el-table-column>
        <el-table-column label="单据类型" align="center" prop="orderTypeName" width="60" show-overflow-tooltip/>
        <el-table-column label="出库状态" align="center" prop="status" width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.status === 0" style="color: #1a84c6; font-weight: bold">待挑片</div>
            <div v-if="scope.row.status === 1" style="color: #ee7e31; font-weight: bold">待审核</div>
            <div v-if="scope.row.status === 2" style="color: #19bb9f; font-weight: bold">审核通过</div>
            <div v-if="scope.row.status === 3" style="color: #e35e5c; font-weight: bold">审核不通过</div>
            <div v-if="scope.row.status === 4" style="color: #e35e5c; font-weight: bold">取消</div>
          </template>
        </el-table-column>
        <el-table-column label="客户名称" align="center" prop="customerName" width="60" show-overflow-tooltip/>
        <el-table-column label="产品代码" align="center" prop="productType" width="60" show-overflow-tooltip/>
        <el-table-column label="申请数量" align="center" prop="pick_no" width="60" show-overflow-tooltip/>
        <!--<el-table-column label="库存数量" align="center" prop="outNo" width="120" show-overflow-tooltip/>-->
        <el-table-column label="申请人" align="center" prop="creator" width="100" show-overflow-tooltip/>
        <el-table-column label="申请日期" align="center" prop="createTime" width="90" show-overflow-tooltip/>
        <el-table-column label="审核人" align="center" prop="auditor" width="100" show-overflow-tooltip/>
        <el-table-column label="审核时间" align="center" prop="auditTime" width="90" show-overflow-tooltip/>
        <el-table-column label="挑片规则" align="center" prop="rules" width="120" show-overflow-tooltipp>
          <template slot-scope="scope">
            <div style="color: #009494;text-decoration: underline;cursor: pointer;" @click="viewRules(scope.row)">{{ scope.row.rules }}</div>
          </template>
        </el-table-column>
        <el-table-column label="版本" align="center" prop="version" show-overflow-tooltip/>
        <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip/>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status === 0 || scope.row.status === 1 || scope.row.status === 3" type="primary" size="mini" @click="viewDetail(scope.row)"><svg-icon icon-class="kaishi"/> 执行挑片</el-button>
            <el-button v-if="scope.row.status === 2 || scope.row.status === 4" size="mini" @click="viewDetail(scope.row)"><svg-icon icon-class="search"/> 查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="pageNum"
        :page-sizes="[15, 25, 50]"
        :page-size="pageSize"
        :total="totalPage"
        class="pagination"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
      <!--打印透视表预览  -->
      <div v-if="printTableDialogVisible" style="margin-top: 100px">
        <div ref="tablePrint">
          <div style="width: 284mm;">
            <div style="width: 276mm;">
              <div style="height: 30px; line-height: 25px; width: 80px;font-weight: bold;text-align: center;float:left;border: 1px solid black; color: black; font-size: 0.5cm">柜位</div>
              <div style="height: 30px; line-height: 25px; margin-left: 80px;font-weight: bold;text-align: center;border:1px solid black; border-left: none; color: black; font-size: 0.5cm">入库盒号</div>
            </div>
            <div v-for="item in arkBoxList" :key="item.boxNo" class="clear-both" style="width: 276mm;height: auto;font-size: 0.5cm">
              <div :style="tableLeftStyle(item)" class="table-left">{{ item.boxNo }}</div>
              <div class="table-right">
                <div v-for="wafer in item.wafers" :key="wafer.boxNo" class="right-item">{{ wafer.boxNo }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--打印预览-->
      <div v-if="printDialogVisible" style="margin-top: 100px">
        <div ref="print">
          <div style="width: 284mm;">
            <!--          <div style="text-align: center;font-weight: bold;font-size: 0.7cm;">外延仓库挑片单</div>-->
            <div v-for="(group, index) in printData" :key="index" class="A4">
              <div style="font-weight: bold;font-size: 0.5cm; margin-bottom: 10px; margin-top: 15px">
                <span>单号：{{ selectedRunRow.apply_no }}</span>
                <span style="margin-left: 60px">出库日期：{{ selectedRunRow.auditTime }}</span>
              </div>
              <table cellspacing="0" cellpadding="0" border="0" style="width: 277mm;table-layout : fixed;color: black !important;">
                <thead>
                  <tr>
                    <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #555; width: 80px !important;">
                      <div style="font-size:0.5cm;" class="cell">柜位</div>
                    </th>
                    <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #555">
                      <div style="font-size:0.5cm;" class="cell">在库盒号</div>
                    </th>
                    <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #555; width: 190px !important;">
                      <div style="font-size:0.5cm;" class="cell">Wafer_ID</div>
                    </th>
                    <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #555; width: 170px !important;">
                      <div style="font-size:0.5cm;" class="cell">Laser_Mark</div>
                    </th>
                    <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #555; width: 90px !important;">
                      <div style="font-size:0.5cm;" class="cell">在库盒位</div>
                    </th>
                    <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #555; width: 90px !important;">
                      <div style="font-size:0.5cm;" class="cell">验证版型</div>
                    </th>
                    <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #555">
                      <div style="font-size:0.5cm;" class="cell">出库盒号</div>
                    </th>
                    <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #555; width: 90px !important;">
                      <div style="font-size:0.5cm;" class="cell">出库盒位</div>
                    </th>
                  </tr>
                </thead>
              </table>
              <div v-for="item in group" :key="item.boxNo">
                <div style="padding: 0px 5px;margin: 15px 0 5px 0; font-weight: bold;font-size: 0.5cm"> 盒号：{{ item.boxNo }}</div>
                <table
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  style="width: 277mm;table-layout : fixed;font-size: 0.5cm"
                >
                  <tbody>
                    <tr v-for="wafer in item.wafers" :key="wafer.id">
                      <td colspan="1" rowspan="1" class="td-class" style="width: 80px !important;">
                        <div class="cell">&nbsp;{{ wafer.arkName }}</div>
                      </td>
                      <td colspan="1" rowspan="1" class="td-class" style="width: 170px !important;">
                        <div class="cell">&nbsp;{{ wafer.boxNo }}</div>
                      </td>
                      <td colspan="1" rowspan="1" class="td-class" style="width: 190px !important;">
                        <div class="cell">&nbsp;{{ wafer.waferId }}</div>
                      </td>
                      <td colspan="1" rowspan="1" class="td-class" style="width: 170px !important;">
                        <div class="cell">&nbsp;{{ wafer.laserMark }}</div>
                      </td>
                      <td colspan="1" rowspan="1" class="td-class" style="width: 90px !important;">
                        <div class="cell">&nbsp;{{ wafer.sequence }}</div>
                      </td>
                      <td colspan="1" rowspan="1" class="td-class" style="width: 90px !important;">
                        <div class="cell">&nbsp;{{ wafer.yzType }}</div>
                      </td>
                      <td colspan="1" rowspan="1" class="td-class">
                        <div class="cell">&nbsp;{{ wafer.ckBoxNo }}</div>
                      </td>
                      <td colspan="1" rowspan="1" class="td-class" style="width: 90px !important;">
                        <div class="cell">&nbsp;{{ wafer.ckSequence }}</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--库存调整-->
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="adjustmentDialogVisible"
      class="padding-dialog"
      title="库存调整"
      width="500px"
      @close="handleClose">
      <el-form ref="adjustmentForm" :model="adjustmentForm" :rules="rules" status-icon label-width="80px" label-position="right">
        <el-form-item label="手动挑片 " size="small" prop="code">
          <el-checkbox v-model="adjustmentForm.checked" @change="checkboxChange"/>
        </el-form-item>
        <el-form-item v-if="!adjustmentForm.checked" style="position: absolute" prop="adjustmentForm.checked ? '' : rule" label="挑片规则 " size="small">
          <span style="position: absolute;top: 0;left: -78px;font-weight:bold;color: #F56C6C">*</span>
          <el-select v-model="adjustmentForm.rule" style="width: 260px;" placeholder="请选择" filterable clearable @change="ruleChange">
            <el-option
              v-for="item in pickRuleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
          <span class="margin-left">库存数:</span>
          <span v-text="count"/>
        </el-form-item>
        <div v-if="!adjustmentForm.checked" style="height: 50px;"/>
        <el-form-item v-if="!adjustmentForm.checked" class="clear-both" label="版本 " size="small" prop="name">
          <el-input :disabled="true" v-model="adjustmentForm.versions" placeholder="请输入版本" maxlength="20"/>
        </el-form-item>
        <el-form-item v-if="adjustmentForm.checked" label="" >
          <el-input :rows="3" v-model="adjustmentForm.wafers" type="textarea" clearable @keyup.native="getNum"/>
        </el-form-item>
        <el-form-item label="单据类型 " size="small" prop="name">
          <el-input :disabled="true" value="库存调整" placeholder="请输入单据类型" maxlength="20"/>
        </el-form-item>
        <el-form-item label="客户名称 " size="small" prop="khmc">
          <el-select v-model="adjustmentForm.khmc" class="search-input" style="width: 390px;" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in customerList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="挑片数量 " size="small" prop="num">
          <el-input :disabled="countDisabled" v-model="adjustmentForm.num" placeholder="请输入挑片数量" type="number" maxlength="20"/>
        </el-form-item>
        <el-form-item label="出库类型 " size="small" prop="outType">
          <el-select v-model="adjustmentForm.outType" style="width: 390px;" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in shapeOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="备注 " size="small">
          <el-input v-model="adjustmentForm.remark" placeholder="请输入备注" type="textarea" maxlength="50"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitadjustmentForm('adjustmentForm')">确 定</el-button>
        <el-button @click="adjustmentDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!--挑片规则明细-->
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="rulesDialogVisible"
      class="padding-dialog"
      title="明细"
      width="600px"
      @close="handleClose('siteForm')">
      <div class="input-item" style="margin-top: 0">
        <span class="input-title">规则名称:</span>
        <span style="width: 200px;" >{{ ruleName }}</span>
      </div>
      <div class="input-item" style="margin-top: 0">
        <span class="input-title">版本:</span>
        <span class="search-input" >{{ version }}</span>
      </div>
      <div class="clear-both"/>
      <el-table
        v-loading="listLoading"
        :data="contentList"
        style="margin-top: 10px"
        class="site-table"
        max-height="450"
        element-loading-text="拼命加载中"
        border
        fit>
        <el-table-column align="center" label="字段" width="200" prop="field" show-overflow-tooltip/>
        <el-table-column align="center" label="条件" prop="content" show-overflow-tooltip/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="rulesDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <!--特殊出片明细-->
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="detailDialogVisible"
      class="padding-dialog"
      title="明细"
      width="600px"
      @close="handleClose('siteForm')">
      <el-table
        v-loading="listLoading"
        :data="specialList"
        style="margin-top: 10px"
        class="site-table"
        max-height="450"
        element-loading-text="拼命加载中"
        border
        fit>
        <el-table-column align="center" label="序号" width="100">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="WaferID" prop="waferId"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detailDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .table-left{
    float: left;
    width: 80px;
    border: 1px solid black;
    border-top: none;
    height: 100px;
    text-align: center;
    color: #000;
    font-weight: bold;
  }
  .table-right{
    margin-left: 80px;
    color: #000;
    font-weight: bold;
    border: 1px solid black;
    border-top: none;
    border-left: none;
    overflow: hidden;
    padding: 8px 0;
  }
  .right-item{
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-top: none;
    width: 12.5%;
    float: left;
  }
  .no-border {
    border-bottom: none;
    padding-bottom: 0
  }
  .A4 {
    page-break-before: auto;
    page-break-after: always;
    color: black;
    font-weight: bold;
  }
  .td-class{
    text-align:center;
    height: 27px;
    border:1px solid #e2e2e2;
    font-weight: bold;
    color: black !important;
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
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 10px;
    top: 3px;
  }
  .input-item{
    float: left;
    margin-top: 14px;
    margin-right: 10px;
  }
  .search-input{
    width: 150px;
  }
  .short-input{
    width: 126px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 312px);
  }
  .height-app-container.app-container{
    position: relative;
    height: calc(100vh - 210px);
  }
  .select-thead-btn{
    width: 45px;
    height: 42px;
    position: absolute;
    z-index: 200;
    background: rgba(0,0,0,.2);
    right: 15px;
    top: 15px;
  }
  .select-thead{
    width: 180px;
    height: 335px;
    border: 1px solid #e2e2e2;
    position: absolute;
    z-index: 200;
    background: #fff;
    right: 15px;
    top: 60px;
  }
  .options-box{
    height: 280px;
    overflow: auto;
    margin-bottom: 10px;
  }
  .dialog-sub-title{
    line-height: 40px;
    text-align: center;
    font-weight: bold;
    font-size: 26px;
    color: #009494;
  }
  .cut-line{
    border-bottom: 1px solid #e2e2e2;
    margin-bottom: 10px;
    margin-top: 10px;
  }
  .input-title{
    width: 65px;
  }
  .left-content{
    border: 1px solid #b2dfdf;
    margin-top: 10px;
    padding: 5px 10px 10px 10px;
  }
  .dialog-input{
    width: 232px;
  }
  .dialog-input-base{
    width: 217px;
  }
  .dialog-input-short{
    width: 182px;
  }
  .input-title-short{
    width: 50px !important;
  }
  .search-input-short{
    width: 120px;
  }
  .module-title-text{
    margin-bottom: 10px;
  }
  .search-input{
    width: 138px;
  }
  .input-title{
    width: 80px;
  }
  .input-container{
    padding: 10px;
    border: 1px solid #b2dfdf;
    padding-right: 0;
    background: #edf7f7;
    margin: 10px 0;
  }
  .input-container .input-title{
    width: 105px;
    font-size: 18px;
  }
  .input-container .input-title-short{
    width: 70px;
    font-size: 18px;
    font-weight: bold;
  }
  .input-container>>> .el-input.is-disabled .el-input__inner {
    background-color: #fff;
    border-color: #E4E7ED;
    cursor: not-allowed;
    font-size: 14px;
    color: #494949;
  }
  .padding-dialog>>> .el-dialog__footer{
    text-align: center;
  }
  .submit-btn{
    background: #1abb9d; border-color: #1abb9d;padding: 20px 40px;margin-left: 80px
  }
  .abnormal-cause{
    position: absolute;
    width: 105px;
    top: 63px;
    background: #fff;
    right: 13px;
  }
</style>
