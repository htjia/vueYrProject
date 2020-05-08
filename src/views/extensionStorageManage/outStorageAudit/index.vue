<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0">
      <div style="height: auto;">
        <div class="input-item">
          <span class="input-title">审核状态 </span>
          <el-select v-model="searchKeys.status" class="search-input search-input-short" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in auditOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">任务单号 </span>
          <el-input v-model="searchKeys.listNum" class="search-input search-input-short" placeholder="请输入单号" size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item">
          <span class="input-title">WaferID </span>
          <el-input v-model="searchKeys.waferId" style="width: 190px" class="search-input search-input-short" placeholder="请输入WaferID" size="small" maxlength="20" clearable/>
        </div>
        <div style="float: left; height: 46px;">
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
            <el-button
              class="margin-left"
              size="small"
              type="primary"
              icon="el-icon-search"
              @click="handleSearch" >查 询</el-button>
            <el-button
              size="small"
              type="danger"
              @click="clearSearch"
            >
              <svg-icon icon-class="clear"/> 重 置
            </el-button>
            <el-button
              :disabled="list.length === 0"
              size="small"
              type="primary"
              @click="automaticCheck" ><svg-icon icon-class="mujianyan"/> 自动检查</el-button>
          </div>
        </div>
        <div class="clear-both"/>
      </div>
    </div>
    <div class="app-container">
      <div class="table-top-btn-group">
        <el-button
          :disabled="list.length === 0"
          class="float-right"
          size="mini"
          type="primary"
          @click="exportExcel"
        ><svg-icon icon-class="export"/> 导出</el-button>
        <div
          :class="{'active':isActive === 0}"
          @click="navClick(0)"
        >
          Bill信息
        </div>
        <div
          :class="{'active':isActive === 1}"
          @click="navClick(1)"
        >
          <!--Wafer信息: <span v-text="waferTol"/>-->
          Wafer信息TOL: {{ waferTotal }}
        </div>
      </div>
      <!--run信息-->
      <el-table
        v-loading="listLoading"
        v-show="isActive === 0"
        ref="runTable"
        :data="list"
        class="broad-scrollbar-table"
        element-loading-text="拼命加载中"
        highlight-current-row
        border
        fit
        height="88%"
        @row-click="rowClick"
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="任务单号" align="center" prop="order_no" width="100" show-overflow-tooltip/>
        <el-table-column label="单据类型" align="center" prop="orderTypeName" width="120" show-overflow-tooltip/>
        <el-table-column label="客户名称" align="center" prop="customerName" width="120" show-overflow-tooltip/>
        <el-table-column label="申请人" align="center" prop="creator" width="120" show-overflow-tooltip/>
        <el-table-column label="申请日期" align="center" prop="createTime" width="100" show-overflow-tooltip/>
        <el-table-column label="制单人" align="center" prop="trial" width="120" show-overflow-tooltip/>
        <el-table-column label="制单日期" align="center" prop="trialTime" width="100" show-overflow-tooltip/>
        <el-table-column label="审核状态" align="center" prop="alnTaskId" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.status === 1" style="color: #ee7e31; font-weight: bold">待审核</div>
            <div v-if="scope.row.status === 2" style="color: #19bb9f; font-weight: bold">审核通过</div>
            <div v-if="scope.row.status === 3" style="color: #e35e5c; font-weight: bold">审核不通过</div>
            <div v-if="scope.row.status === 4" style="color: #e35e5c; font-weight: bold">取消</div>
          </template>
        </el-table-column>
        <el-table-column label="审核人" align="center" prop="auditor" width="120" show-overflow-tooltip/>
        <el-table-column label="审核日期" align="center" prop="auditTime" width="100" show-overflow-tooltip/>
        <el-table-column label="挑片规则" align="center" prop="rules" width="120" show-overflow-tooltipp>
          <template slot-scope="scope">
            <div style="color: #009494;text-decoration: underline;cursor: pointer;" @click="viewRules(scope.row)">{{ scope.row.rules }}</div>
          </template>
        </el-table-column>
        <el-table-column label="版本" align="center" prop="version" width="120" show-overflow-tooltip/>
        <el-table-column label="备注" align="center" prop="alnTaskId" width="120" show-overflow-tooltip/>
        <el-table-column label="操作" align="center" fixed="right" width="220">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status === 1"
              size="mini"
              type="primary"
              @click="handleAudit(scope.row, 2)"><svg-icon icon-class="jianyanwc"/> 通过
            </el-button>
            <el-button
              v-if="scope.row.status === 2 && scope.row.isAudit === 0"
              size="mini"
              type="primary"
              @click="handleAudit(scope.row, 3)"><svg-icon icon-class="fanshen"/> 反审
            </el-button>
            <el-button
              v-if="scope.row.status === 1"
              size="mini"
              type="danger"
              @click="handleAudit(scope.row, 3)"><svg-icon icon-class="shenheth"/> 退回
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--wafer信息-->
      <el-table
        v-loading="listLoading"
        v-show="isActive === 1"
        :data="waferList"
        class="broad-scrollbar-table"
        height="94%"
        element-loading-text="拼命加载中"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="RunID" prop="runId" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="WaferID" prop="waferId" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="出库盒号" prop="ckBoxNo" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="出库片位" prop="ckSequence" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="柜位" prop="arkName" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="入库盒号" prop="boxNo" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="入库片位" prop="sequence" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="衬底工艺" prop="subType" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="衬底厂家" prop="supplier" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="镭刻号" prop="laserMark" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="目检" prop="inspection" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="PL_WD" prop="plWd" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="PL_WD_STD" prop="plWtd" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="PL.I.I" prop="plIi" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="PL.I.I.Std" prop="plIiStd" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="PL_PD" prop="plPd" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="PL_Ref" prop="plRef" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="LOP(460)" prop="lop460" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="综合判定" prop="judge" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="ESD(200)" prop="esd200v" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="ESD去坏(50V)" prop="esd50v" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="综合良率" prop="yield" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="VF1 Yield" prop="vf1Yield" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="Ir Yield" prop="lrYield" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="VZ Yield" prop="vzYield" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="VF1" prop="vf1" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="VF2" prop="vf2" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="WLD1" prop="wld" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="Ir" prop="lr" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="VZ" prop="vz" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="IV" prop="iv" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="WLD(PL-COW)" prop="kVal" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="预估COW波长" prop="cowWd" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="ESD(400)" prop="esd400" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="验证版型" prop="yzType" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="生产类型" prop="product" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="IR<0.2 yield" prop="yieldIr02" width="140" show-overflow-tooltip/>
        <el-table-column align="center" label="Recipe_Name" prop="recipe" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="外延盒号" prop="wyBoxNo" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="HW" prop="hw1" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="B.S" prop="bs" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="目检原因" prop="visualReason" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="光色" prop="color" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="衬底类型" prop="sub" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="机台" prop="machine" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="ESD去坏（500V）" prop="esd500" width="140" show-overflow-tooltip/>
        <el-table-column align="center" label="ESD去坏（300V）" prop="esd300" width="140" show-overflow-tooltip/>
        <el-table-column align="center" label="BOW" prop="bow" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="PLINT_STD" prop="plintStd" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="Avg_Vf4" prop="avgVf4" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="Thyristor良率" prop="thyristor" width="120" show-overflow-tooltip/>
      </el-table>
      <el-pagination
        v-if="isActive === 0"
        :current-page="pageNum"
        :page-sizes="[12, 25, 50]"
        :page-size="pageSize"
        :total="totalPage"
        class="pagination"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div>
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
        fit
        stripe>
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
        fit
        stripe>
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
    <!--自动检测-->
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="automaticCheckVisible"
      class="padding-dialog"
      title="自动检查"
      width="500px"
      @close="handleClose">
      <div class="input-item" style="float: none;margin-right: 0">
        <span class="input-title">判断规则 </span>
        <el-select v-model="dialogRule" size="small" placeholder="请选择" style="width: 310px;" filterable>
          <el-option
            v-for="item in pickRuleList"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
        <el-button
          :disabled="dialogRule === ''"
          class="margin-left"
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="handleStartCheck" >开 始</el-button>
      </div>
      <div class="input-item" style="float: none;margin-right: 0">
        <span class="input-title">检测项目 </span>
        <el-checkbox v-model="checkNull">检查空值</el-checkbox>
        <el-checkbox v-model="checkStandardDelivery">检查出货标准</el-checkbox>
      </div>
      <div class="input-item" style="float: none;margin-right: 0">
        <div style="width: 100%;height: 300px;overflow: auto;padding: 20px;border:1px solid #e2e2e2;border-radius: 8px" v-html="result"/>
      </div>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .table-top-btn-group{
    overflow: hidden;
    border-bottom: 2px solid #009494;
  }
  .table-top-btn-group.substrate{
    float: left;
  }
  .substrate-total{
    float: right;
    line-height: 30px;
    font-weight: bold;
    font-size: 15px;
  }
  .table-top-btn-group>div{
    float: left;
    margin-left: 15px;
    height: 35px;
    line-height: 35px;
    padding: 0 15px;
    border: 1px solid #e2e2e2;
    cursor: pointer;
  }
  .table-top-btn-group>div.active{
    color: #fff;
    background: #009494;
    border-color: #009494;
  }
  .broad-scrollbar-table>>> .cell{
    line-height: 37px;
  }
  .broad-scrollbar-table>>> td{
    height: 37px;
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
    height: calc(100vh - 202px);
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
    width: 130px;
  }
  .module-title-text{
    margin-bottom: 10px;
  }
  .search-input{
    width: 138px;
  }
  .input-title{
    width: 65px;
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
  .send-dialog>>>.el-dialog__body{
    padding: 15px;
    padding-top: 10px;
    padding-bottom: 60px;
  }
  .send-dialog .input-item{
    margin-right: 15px;
  }
</style>
