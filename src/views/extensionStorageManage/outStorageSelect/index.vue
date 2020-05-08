<template>
  <PageHeaderLayout :has_back = "true">
    <div class="header-search-add height-auto">
      <div :class="{'no-border': hidden}" class="header-btn-group">
        <!--isDisabled 为查看状态  noBoxNo 为未生成盒号状态-->
        <!--isSetout 为出库   !isSetout为备货-->
        <el-button
          v-if="searchKeys.djlx !== '库存调整' && !isSetout"
          :disabled="isDisabled || noBoxNo"
          size="small"
          type="primary"
          @click="finishSelect"
        ><svg-icon icon-class="jianyanwc"/>
          完成挑片
        </el-button>
        <el-button
          v-if="searchKeys.djlx !== '库存调整' && isSetout"
          :disabled="isDisabled"
          size="small"
          type="primary"
          @click="finishSelect"
        ><svg-icon icon-class="jianyanwc"/>
          完成备货
        </el-button>
        <el-button
          v-if="currentStatus === 1 || currentStatus === 3"
          :disabled="isDisabled"
          size="small"
          type="primary"
          @click="handleExchange"
        ><svg-icon icon-class="qiehuan"/> 微调换片</el-button>
        <el-button
          v-if="currentStatus === 1 && searchKeys.tpgz !== '特殊挑片'"
          size="small"
          type="danger"
          @click="handleRelSelect"
        ><svg-icon icon-class="xiangzuo"/> 重新挑片</el-button>
        <el-button
          v-if="searchKeys.djlx === '库存调整'"
          :disabled="isDisabled"
          size="small"
          type="small"
          @click="handleTransmit"
        ><svg-icon icon-class="kucuntiaoz"/> 库存调整</el-button>
        <el-button
          v-if="hidden"
          class="float-right"
          size="small"
          type="info"
          @click="hidden = false"
        >
          <svg-icon icon-class="xiangxia"/> 展开
        </el-button>
        <el-button
          v-if="!hidden"
          class="float-right"
          size="small"
          type="info"
          @click="setHidden"
        >
          <svg-icon icon-class="xiangshang"/> 收起
        </el-button>
        <el-button
          v-if="currentStatus !== 0"
          class="float-right"
          size="small"
          type="primary"
          @click="handleExport"
        ><svg-icon icon-class="export"/> 导 出</el-button>
      </div>
      <div v-if="!hidden">
        <div class="input-item">
          <span class="input-title">申请单号 </span>
          <el-input :disabled="true" v-model="searchKeys.sqdh" class="search-input" size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item">
          <span class="input-title">单据类型 </span>
          <el-input :disabled="true" v-model="searchKeys.djlx" class="search-input" size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item">
          <span class="input-title">客户名称 </span>
          <el-input :disabled="true" v-model="searchKeys.khmc" class="search-input" size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item">
          <span class="input-title">出库形式 </span>
          <el-input :disabled="true" v-model="searchKeys.ckxs" class="search-input" size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item">
          <span class="input-title">申请人 </span>
          <el-input :disabled="true" v-model="searchKeys.sqr" class="search-input" size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item">
          <span class="input-title">申请日期 </span>
          <el-input :disabled="true" v-model="searchKeys.sqrq" class="search-input" size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item">
          <span class="input-title">出库单号 </span>
          <el-input :disabled="true" v-model="searchKeys.ckdh" class="search-input" size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item">
          <span class="input-title">挑片规则 </span>
          <el-input :disabled="true" v-model="searchKeys.tpgz" class="search-input" size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item">
          <span class="input-title">版本 </span>
          <el-input :disabled="true" v-model="searchKeys.bb" class="search-input" size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item">
          <span class="input-title">申请数量 </span>
          <el-input :disabled="true" v-model="searchKeys.sqsl" class="search-input" size="small" maxlength="20" clearable/>
        </div>
        <!--<div class="input-item">
          <span class="input-title">库存数量 </span>
          <el-input :disabled="true" v-model="searchKeys.ccsl" class="search-input" size="small" maxlength="20" clearable/>
        </div>-->
        <div class="input-item">
          <span class="input-title">每盒数量 </span>
          <el-input :disabled="isDisabled || currentStatus === 1 || currentStatus === 3" v-model="searchKeys.mhsl" class="search-input" type="number" size="small" @input="boxNumChange"/>
        </div>
        <div class="input-item">
          <span class="input-title">备注 </span>
          <el-input :disabled="true" v-model="searchKeys.remark" class="search-input" style="width: 605px;" size="small" clearable/>
        </div>
        <div class="clear-both"/>
      </div>
    </div>
    <div :class="{'height-app-container': hidden}" class="app-container">
      <el-button
        v-if="!isSetout && currentStatus === 0"
        :disabled="isDisabled"
        class="float-right"
        size="small"
        type="primary"
        @click="handleAssignBox"
      ><svg-icon icon-class="chuanpian"/> 分配出库盒号</el-button>
      <span style="font-weight: bold;line-height: 30px">Tol: {{ selectedNum }} <span v-if="currentStatus === 0">/ {{ searchKeys.sqsl }}</span></span>
      <span>
        <span v-if="currentStatus === 0" style="font-weight: bold;line-height: 30px; margin-left: 30px">排序方式：</span>
        <el-radio-group v-if="currentStatus === 0" v-model="sortRadio" @change="fetchData">
          <el-radio :label="1">先入先出</el-radio>
          <el-radio :label="2">盒内片数</el-radio>
        </el-radio-group>
        <div v-if="currentStatus === 0" class="input-item" style="margin-top: 0; float: right;margin-right: 10px">
          <span class="input-title" style="width: 125px;">盒内片数要求： > </span>
          <el-input v-model="boxNumYq" class="search-input" onkeyup="this.value=this.value.replace(/[^\d]/g,'')" size="small" maxlength="2" clearable/>
          <el-button
            size="small"
            type="primary"
            @click="fetchData"
          > 确 定</el-button>
        </div>
      </span>
      <pl-table
        v-loading="listLoading"
        ref="runTable"
        :datas="list"
        :row-height="22"
        :key="tableKey"
        element-loading-text="拼命加载中"
        border
        fit
        highlight-current-row
        class="broad-scrollbar-table margin-top"
        header-drag-style
        use-virtual
        @cell-mouse-enter="hoverCall"
        @selection-change="selectionChange"
        @cell-click="cellClick"
        @row-click="rowClick"
      >
        <!--use-virtual-->
        <pl-table-column type="selection" width="55"/>
        <pl-table-column v-if="currentStatus === 1 || currentStatus === 3" align="center" label="操作" width="50" fixed>
          <template slot-scope="scope">
            <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="handleDelete(scope.$index)"/>
          </template>
        </pl-table-column>
        <pl-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </pl-table-column>
        <pl-table-column align="center" label="RunID" prop="runId" width="120" show-overflow-tooltip fixed/>
        <pl-table-column align="center" label="WaferID" prop="waferId" width="150" show-overflow-tooltip fixed/>
        <pl-table-column align="center" label="出库盒号" prop="ckBoxNo" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="出库片位" prop="ckSequence" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="柜位" prop="arkName" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="入库盒号" prop="boxNo" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="入库片位" prop="sequence" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="衬底工艺" prop="subType" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="衬底厂家" prop="supplier" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="镭刻号" prop="laserMark" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="目检" prop="inspection" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="PL_WD" prop="plWd" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="PL_WD_STD" prop="plWtd" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="PL.I.I" prop="plIi" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="PL.I.I.Std" prop="plIiStd" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="PL_PD" prop="plPd" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="PL_Ref" prop="plRef" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="LOP(460)" prop="lop460" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="综合判定" prop="judge" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="ESD(200)" prop="esd200v" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="ESD去坏(50V)" prop="esd50v" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="综合良率" prop="yield" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="VF1 Yield" prop="vf1Yield" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="Ir Yield" prop="lrYield" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="VZ Yield" prop="vzYield" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="VF1" prop="vf1" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="VF2" prop="vf2" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="WLD1" prop="wld" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="Ir" prop="lr" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="VZ" prop="vz" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="IV" prop="iv" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="WLD(PL-COW)" prop="kVal" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="预估COW波长" prop="cowWd" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="ESD(400)" prop="esd400" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="验证版型" prop="yzType" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="生产类型" prop="product" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="IR<0.2 yield" prop="yieldIr02" width="140" show-overflow-tooltip/>
        <pl-table-column align="center" label="Recipe_Name" prop="recipe" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="外延盒号" prop="wyBoxNo" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="HW" prop="hw1" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="B.S" prop="bs" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="目检原因" prop="visualReason" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="光色" prop="color" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="衬底类型" prop="sub" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="机台" prop="machine" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="ESD去坏（500V）" prop="esd500" width="140" show-overflow-tooltip/>
        <pl-table-column align="center" label="ESD去坏（300V）" prop="esd300" width="140" show-overflow-tooltip/>
        <pl-table-column align="center" label="BOW" prop="bow" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="PLINT_STD" prop="plintStd" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="Avg_Vf4" prop="avgVf4" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="Thyristor良率" prop="thyristor" width="120" show-overflow-tooltip/>
      </pl-table>
    </div>
    <!--特殊挑片微调换片-->
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="exchangeDialogVisible"
      class="padding-dialog"
      title="微调换片"
      width="600px"
      @close="handleClose('siteForm')">
      <div class="input-item" style="margin-bottom: 10px">
        <span class="input-title">WaferID </span>
        <el-input v-model="dialogSearchWaferId" class="search-input" style="width: 240px;" size="small" maxlength="20" clearable/>
        <el-button
          class="margin-left"
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="handleSearch" >查 询</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :data="dialogList"
        style="margin-top: 10px"
        element-loading-text="拼命加载中"
        border
        fit
      >
        <el-table-column align="center" label="WaferID" prop="waferId"/>
        <el-table-column align="center" label="盒号" prop="boxNo"/>
        <el-table-column align="center" label="片号" prop="sequence"/>
        <el-table-column align="center" label="柜位" prop="arkName"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="dialogList.length === 0" type="primary" @click="exchangeSubmit">确 定</el-button>
        <el-button @click="exchangeDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!--普通挑片微调换片-->
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="selectExchangeDialogVisible"
      class="padding-dialog select-exchange-dialog"
      title="微调换片"
      width="800px"
      @close="handleClose">
      <el-table
        v-loading="listLoading"
        :data="dialogList"
        style="margin-top: 10px"
        element-loading-text="拼命加载中"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="WaferID" prop="waferId"/>
        <el-table-column align="center" label="盒号" prop="boxNo"/>
        <el-table-column align="center" label="片号" prop="sequence"/>
        <el-table-column align="center" label="柜位" prop="arkName"/>
        <el-table-column align="center" label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="selectWafer(scope.row)"
            ><svg-icon icon-class="jianyanwc"/>
              换 片
            </el-button>
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
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .no-border {
    border-bottom: none;
    padding-bottom: 0
  }
  .broad-scrollbar-table>>> .cell{
    line-height: 35px;
  }
  .broad-scrollbar-table>>> td{
    height: 35px !important;
  }
  /*.broad-scrollbar-table>>> .el-checkbox{*/
    /*margin: 0 10px;*/
  /*}*/
  .broad-scrollbar-table>>> .el-checkbox{
    margin-left: 20px;
  }
  .broad-scrollbar-table ::-webkit-scrollbar {/*滚动条整体样式*/
    width: 5px !important;
  }
  .padding-dialog>>> .cell{
    line-height: 30px;
  }
  .padding-dialog>>> td{
    height: 30px;
  }
  .select-exchange-dialog>>> .el-dialog__body{
    padding-bottom: 60px;
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
    height: calc(100vh - 305px);
    user-select: none;
  }
  .height-app-container.app-container{
    position: relative;
    height: calc(100vh - 202px);
  }
  .app-container >>> td .cell {
    line-height: 22px !important;
    height: 22px !important;
  }
  .app-container >>> td {
    height: 22px !important;
  }
  .app-container>>>.ant-table-scroll {
    max-height: 100% !important;
    height: 100% !important;
  }
  .app-container>>>.el-table {
    height: 100% !important;
  }
  .app-container>>>.plTableBox {
    height: 93% !important;
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
    width: 135px;
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
  .abnormal-cause>>> .el-textarea__inner{
    height: 356px!important;
  }
  .app-container tr .el-button--mini {
    padding: 3px !important;
  }
  .pagination {
    float: right;
    margin-top: 15px;
  }
  /*.app-container>>> td .cell{*/
  /*  line-height: 22px !important;*/
  /*  height: 22px !important;*/
  /*}*/
  /*.app-container>>> td{*/
  /*  height: 22px !important;*/
  /*}*/
  /*.app-container>>> .el-table tr .el-button--mini {*/
  /*  padding: 1px 7px !important;*/
  /*}*/
  /*@media (max-width: 1600px) {*/
  /*  .app-container>>> td .cell{*/
  /*    line-height: 16px !important;*/
  /*    height: 16px !important;*/
  /*  }*/
  /*  .app-container>>> th .cell{*/
  /*    line-height: 20px !important;*/
  /*    height: 20px !important;*/
  /*  }*/
  /*  .app-container>>> td{*/
  /*    height: 16px !important;*/
  /*  }*/
  /*  .app-container>>> .el-table tr .el-button--mini {*/
  /*    padding: 0px 7px !important;*/
  /*  }*/
  /*  .header-btn-group>>> .el-button--small {*/
  /*    padding: 9px 20px;*/
  /*  }*/
  /*  .broad-scrollbar-table>>> .el-table__fixed-body-wrapper {*/
  /*    height: calc(100% - 21px) !important;*/
  /*  }*/
  /*}*/
</style>
