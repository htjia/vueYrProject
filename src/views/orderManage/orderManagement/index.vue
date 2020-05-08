<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 15px;">
      <div class="header-btn-group">
        <el-button
          size="small"
          type="primary"
          @click="smallBatchSample(1)"
        ><svg-icon icon-class="add"/> 新增订单</el-button>
        <div class="clear-both"/>
      </div>
      <div style="position: relative; display: flex">
        <div style="flex:1">
          <div class="input-item">
            <span class="input-title">订单编号</span>
            <el-input v-model="searchKeys.orderNo" class="search-input" placeholder="请输入订单编号" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">订单类型</span>
            <el-select v-model="searchKeys.orderType" clearable class="search-input" size="small" placeholder="请选择" style="width: 80px" filterable>
              <el-option
                v-for="item in resultOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">订单状态</span>
            <el-select v-model="searchKeys.status" style="width: 100px" clearable class="search-input" size="small" placeholder="请选择" filterable>
              <el-option
                v-for="item in statusOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">客户名称</span>
            <el-select v-model="searchKeys.customerId" clearable class="search-input" size="small" placeholder="请选择" filterable>
              <el-option
                v-for="item in customerList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div style="float: left">
            <div class="input-item" style="margin-right: 20px;margin-left: 10px;margin-top: 14px; line-height: 32px;">
              <el-radio-group v-model="searchKeys.timeType">
                <el-radio :label="0">要求发货日期</el-radio>
                <el-radio :label="1">订单交期</el-radio>
                <el-radio :label="2">创建日期</el-radio>
              </el-radio-group>
            </div>
            <div class="input-item">
              <el-date-picker
                v-model="searchKeys.startTime"
                :picker-options="pickerOptionsStart"
                :editable="false"
                class="search-input"
                size="small"
                type="date"
                placeholder="开始日期"
                value-format="yyyy-MM-dd"
              />
              <span style="display:inline-block;width: 38px;text-align: center"> 至 </span>
              <el-date-picker
                v-model="searchKeys.endTime"
                :picker-options="pickerOptionsEnd"
                :editable="false"
                class="search-input"
                size="small"
                type="date"
                placeholder="结束日期"
                value-format="yyyy-MM-dd"
              />
            </div>
          </div>
        </div>
        <div class="input-item">
          <el-button
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
        </div>
      </div>
      <div class="clear-both"/>
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        ref="billTable"
        :data="tableList"
        :row-style="handleRowStyle"
        height="92%"
        class="broad-scrollbar-table"
        element-loading-text="拼命加载中"
        highlight-current-row
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ (searchKeys.pageNum - 1) * searchKeys.pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="订单编号" align="center" prop="orderNo" width="120" show-overflow-tooltip/>
        <el-table-column label="订单类型" align="center" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.orderType === 0">出库</span>
            <span v-if="scope.row.orderType === 1">备货</span>
            <span v-if="scope.row.orderType === 2">返产线</span>
          </template>
        </el-table-column>
        <el-table-column label="客户名称" align="center" prop="customerName" width="120" show-overflow-tooltip/>
        <el-table-column label="产品型号" align="center" prop="modelName" width="120" show-overflow-tooltip/>
        <el-table-column label="片型" align="center" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.pattern === 0">圆片</span>
            <span v-if="scope.row.pattern === 1">方片</span>
          </template>
        </el-table-column>
        <el-table-column label="订单数量(k)" align="center" prop="orderNum" width="120" show-overflow-tooltip/>
        <el-table-column label="出库数量(k)" align="center" prop="ckNum" width="120" show-overflow-tooltip/>
        <el-table-column label="订单出库记录" align="center" prop="materialType" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <u class="uStyle" @click="findOutboundRecord(scope.row)">查看</u>
          </template>
        </el-table-column>
        <el-table-column label="波长" align="center" prop="bc" width="120" show-overflow-tooltip/>
        <el-table-column label="亮度" align="center" prop="ld" width="120" show-overflow-tooltip/>
        <el-table-column label="电压" align="center" prop="dy" width="100" show-overflow-tooltip/>
        <el-table-column label="集中度" align="center" prop="jzd" width="100" show-overflow-tooltip/>
        <el-table-column label="客制化标准" align="center" prop="num" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <u class="uStyle" @click="watchCustorm('table', scope.row.ruleId)">{{ scope.row.ruleName }}</u>
          </template>
        </el-table-column>
        <el-table-column label="订单交期" align="center" prop="deliveryDate" width="120" show-overflow-tooltip/>
        <el-table-column label="要求发货日期" align="center" prop="sendDate" width="120" show-overflow-tooltip/>
        <el-table-column label="修改人" align="center" prop="creatorName" width="120" show-overflow-tooltip/>
        <el-table-column label="修改日期" align="center" prop="createTime" width="120" show-overflow-tooltip/>
        <el-table-column label="备注" align="center" prop="remark" width="120" show-overflow-tooltip/>
        <el-table-column label="订单状态" align="center" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0" style="font-weight:900;color: #ed7d31">草稿</span>
            <span v-if="scope.row.status === 1" style="font-weight:900;color: #1c84c6">待接收</span>
            <span v-if="scope.row.status === 2" style="font-weight:900;color: #1abc9c">出货中</span>
            <span v-if="scope.row.status === 3" style="font-weight:900;color: #5268a5">已完成</span>
            <span v-if="scope.row.status === 4" style="font-weight:900;color: #304154">备货完成</span>
            <span v-if="scope.row.status === 7" style="font-weight:900;color: #23C6C8">挑片中</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="185" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status === 0 || scope.row.status === 1 || scope.row.status === 2" type="primary" icon="el-icon-edit" size="mini" @click.native="handleEdit(scope.row, scope.$index)">编辑</el-button>
            <el-button v-if="scope.row.status === 4" type="primary" size="mini" @click.native="handleDelete(scope.row.id,2)"><svg-icon icon-class="chaxun"/> 转为出库</el-button>
            <el-button v-if="scope.row.status === 3 || scope.row.status === 7" type="primary" size="mini" @click.native="handleView(scope.row, scope.$index)"><svg-icon icon-class="chaxun"/> 查看</el-button>
            <el-button v-if="scope.row.status === 2" type="danger" icon="el-icon-close" size="mini" @click.native="handleDelete(scope.row.id,3)">关闭</el-button>
            <el-button v-if="scope.row.status === 0 || scope.row.status === 1 || scope.row.status === 4" type="danger" icon="el-icon-delete" size="mini" @click.native="handleDelete(scope.row.id,6)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="searchKeys.pageNum"
        :page-sizes="[15, 25, 50]"
        :page-size="searchKeys.pageSize"
        :total="totalPage"
        class="pagination"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div>
    <order-dia
      :metal-dialog-visible="metalDialogVisible"
      :customer-list="customerList"
      :row="row"
      :is-row="isRow"
      :disabled="disabled"
      :order-title="orderTitle"
      @dialogFalse="dialogFalse"/>
    <custormizatoin-dia
      :disabled="true"
      :row="custormForm"
      :is-row="2"
      :table-key="1"
      :customer-list="customerList"
      :add-dialog-visible="kzhDialog1"
      dialog-title="客制化规则"
      @dialogFalse="kzhDialog1 = false"/>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="ckDialog"
      title="订单出库记录"
      append-to-body
      width="80%"
      class="padding-dialog flex_dialog top_dis"
      @close="ckDialog = false">
      <el-table
        v-loading="listLoading"
        ref="kcTable"
        :data="ckList"
        height="675"
        class="broad-scrollbar-table"
        element-loading-text="拼命加载中"
        highlight-current-row
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="出库单号" align="center" prop="orderNo" width="200"/>
        <el-table-column label="出库参数要求" align="center" prop="params" show-overflow-tooltip/>
        <el-table-column label="出库数量（K）" align="center" prop="pickNum" width="100"/>
        <el-table-column label="出库时间" align="center" prop="createTime" width="150"/>
        <el-table-column label="出库人" align="center" prop="creator" width="100"/>
      </el-table>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./orderManagement.js"></script>

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
    height: calc(100vh - 265px);
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
    top: 6px;
  }
  .module-title-pre {
    line-height: 30px;
  }
  .search-input{
    width: 130px;
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
    padding: 15px ;
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
