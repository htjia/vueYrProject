<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 15px">
      <el-button
        class="float-right margin-left"
        size="small"
        type="primary"
        @click="viewRecord"
      ><svg-icon icon-class="rukujl"/> 出库记录</el-button>
      <el-button
        class="float-right"
        size="small"
        type="primary"
        @click="handleStorageOut"
      ><svg-icon icon-class="kucuntiaoz"/> 库存调出</el-button>
      <div class="tab-control" style="margin-bottom: 0">
        <span
          :class="{activeTab: activeTabIndex === 0}"
          @click="tabClick(0)"
        >销售订单</span>
        <!--<span
          :class="{activeTab: activeTabIndex === 1}"
          class="has-margin-left"
          @click="tabClick(1)"
        >库存调整</span>-->
      </div>
      <div style="overflow: auto;">
        <div class="input-item">
          <span class="input-title">订单编号</span>
          <el-input v-model="searchKeys.ddbh" class="search-input" placeholder="请输入订单编号" size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item">
          <span class="input-title">订单类型</span>
          <el-select v-model="searchKeys.ddlx" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in orderOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">订单状态</span>
          <el-select v-model="searchKeys.ddzt" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in statusOptions"
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
        <div style="float: left;width: 610px; height: 46px;">
          <div class="input-item" style="margin-right: 10px;margin-left: 10px;padding-top: 8px">
            <el-radio-group v-model="timeRadio">
              <el-radio :label="0">期望发货日期</el-radio>
              <el-radio :label="2">创建日期</el-radio>
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
      </div>
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        ref="billTable"
        :row-style="rowStyle"
        :data="list"
        height="90%"
        class="broad-scrollbar-table"
        element-loading-text="拼命加载中"
        border
        fit
      >
        <!--highlight-current-row-->
        <!--@row-click="rowClick"-->
        <el-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="订单编号" align="center" prop="orderNo" width="150" show-overflow-tooltip fixed/>
        <el-table-column label="订单类型" align="center" prop="orderType" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.orderType === 0">出库</div>
            <div v-if="scope.row.orderType === 1">备货</div>
            <div v-if="scope.row.orderType === 2">返回产线</div>
          </template>
        </el-table-column>
        <el-table-column label="客户名称" align="center" prop="customerName" width="120" show-overflow-tooltip/>
        <el-table-column label="产品型号" align="center" prop="modelName" width="120" show-overflow-tooltip/>
        <el-table-column label="片型" align="center" prop="pattern" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.pattern === 0">圆片</div>
            <div v-if="scope.row.pattern === 1">方片</div>
          </template>
        </el-table-column>
        <el-table-column label="订单数量(k)" align="center" prop="orderNum" width="120" show-overflow-tooltip/>
        <el-table-column label="出库数量(k)" align="center" prop="outNum" width="120" show-overflow-tooltip/>
        <el-table-column label="波长范围" align="center" prop="bc" width="120" show-overflow-tooltip/>
        <el-table-column label="亮度范围" align="center" prop="ld" width="120" show-overflow-tooltip/>
        <el-table-column label="电压范围" align="center" prop="dy" width="120" show-overflow-tooltip/>
        <el-table-column label="客制化规则" align="center" prop="ruleName" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <div style="text-decoration: underline;color: #009494;cursor: pointer;" @click="watchCustorm(scope.row.ruleId)">{{ scope.row.ruleName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="交期" align="center" prop="deliveryDate" width="120" show-overflow-tooltip/>
        <el-table-column label="修改人" align="center" prop="creatorName" width="120" show-overflow-tooltip/>
        <el-table-column label="修改时间" align="center" prop="createTime" width="120" show-overflow-tooltip/>
        <el-table-column label="期望发货日期" align="center" prop="sendDate" width="150" show-overflow-tooltip/>
        <el-table-column label="备注" align="center" prop="remark" width="150" show-overflow-tooltip/>
        <el-table-column label="订单状态" align="center" prop="status" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.status === 1" style="color: #1a84c6; font-weight: bold">待接收</div>
            <div v-if="scope.row.status === 2" style="color: #ee7e31; font-weight: bold">出货中</div>
            <div v-if="scope.row.status === 3" style="color: #19bb9f; font-weight: bold">已完成</div>
            <div v-if="scope.row.status === 4" style="color: #e35e5c; font-weight: bold">备货完成</div>
            <div v-if="scope.row.status === 6" style="color: #e35e5c; font-weight: bold">删除</div>
            <div v-if="scope.row.status === 7" style="color: #009494; font-weight: bold">挑片中</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status === 1 || scope.row.status === 7" type="primary" size="mini" @click="handleStartSelect(scope.row)"><svg-icon icon-class="kaishi"/> 开始挑片</el-button>
            <!--<el-button v-if="scope.row.status === 3" type="primary" size="mini" @click="viewDetail(scope.row)"><svg-icon icon-class="kaishi"/> 转为备货</el-button>-->
            <el-button size="mini" @click="viewDetail(scope.row)"><svg-icon icon-class="search"/> 订单详情</el-button>
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
    </div>
    <custormizatoin-dia
      :disabled="true"
      :row="custormForm"
      :is-row="2"
      :table-key="tableKey"
      :customer-list="customerList"
      :add-dialog-visible="kzhDialogVisible"
      dialog-title="客制化规则"
      @dialogFalse="kzhDialogVisible = false"/>
    <custormizatoin-dia
      :row="row"
      :is-row="isRow"
      :table-key="tableKey"
      :customer-list="customerList"
      :dialog-title="dialogTitle"
      :add-dialog-visible="addDialogVisible"
      @dialogFalse="dialogFalse"/>
    <order-dia
      :metal-dialog-visible="metalDialogVisible"
      :customer-list="customerList"
      :row="row"
      :is-row="isRow"
      :disabled="disabled"
      :order-title="orderTitle"
      @dialogFalse="dialogFalse"/>
    <!--选择方圆片-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="selectedDialogVisible"
      class="select-dialog"
      title="请选择片型"
      width="500px"
      @close="handleClose">
      <el-radio-group v-model="sliceType">
        <el-radio :label="0">圆片</el-radio>
        <el-radio :label="1">方片</el-radio>
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitadSelectedType">确 定</el-button>
        <el-button @click="selectedDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!--库存调出-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="adjustmentDialogVisible"
      class="padding-dialog"
      title="库存调出"
      width="1300px"
      @close="handleClose">
      <div class="overflow-hidden" style="margin-bottom: 10px">
        <div class="input-item" style="margin-top: 0px">
          <span class="input-title" style="width: 85px;">包/片号扫描</span>
          <el-input ref="scanInput" :autofocus="true" v-model="waferNo" class="search-input" style="width: 300px;" placeholder="包/片号扫描" size="small" maxlength="20" clearable @keyup.enter.native="findKctzWaferListFun"/>
        </div>
        <div class="float-right">
          <span style="font-weight: bold">Total:</span>
          <el-input :disabled="true" v-model="waferList.length" style="width: 60px;" size="small" maxlength="20" clearable/>
          <span style="font-weight: bold">片</span>
          <el-input :disabled="true" v-model="chipCount" style="width: 90px;" size="small" maxlength="20" clearable/>
          <span style="font-weight: bold">K</span>
        </div>
      </div>
      <!--wafer信息-->
      <el-table
        v-show="sliceType === 0"
        :data="waferList"
        height="500px"
        class="broad-scrollbar-table"
        element-loading-text="拼命加载中"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="片号" align="center" prop="code" width="200" fixed show-overflow-tooltip/>
        <el-table-column label="TapeNo" align="center" prop="tapeNo" width="180" fixed show-overflow-tooltip/>
        <el-table-column v-for="item in formTheadStore" v-if="item.thName !== '片号'&&item.thName !== 'TapeNo'" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[item.thKey] }}
          </template>
        </el-table-column>
        <el-table-column v-for="item in reservedFields" :key="item.id" :label="item.name" :prop="item.code" width="120" align="center" show-overflow-tooltip/>
        <el-table-column v-for="item in formTheadStoreParams" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[item.thKey] }}
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-show="sliceType === 1"
        :data="waferList"
        height="500px"
        class="broad-scrollbar-table"
        element-loading-text="拼命加载中"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="片号" align="center" prop="code" width="200" fixed show-overflow-tooltip/>
        <el-table-column label="TapeNo" align="center" prop="tapeNo" width="180" fixed show-overflow-tooltip/>
        <el-table-column v-for="item in formTheadfStore" v-if="item.thName !== '片号'&&item.thName !== 'TapeNo'" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[item.thKey] }}
          </template>
        </el-table-column>
        <el-table-column v-for="item in reservedFields" :key="item.id" :label="item.name" :prop="item.code" width="120" align="center" show-overflow-tooltip/>
        <el-table-column v-for="item in formTheadfStoreParams" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[item.thKey] }}
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="waferList.length === 0" type="primary" @click="submitInsertKctz('adjustmentForm')">确 定</el-button>
        <el-button @click="adjustmentDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!--出库记录-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="recordDialogVisible"
      top="80px"
      class="send-dialog broad-scrollbar-table"
      title="出库记录"
      width="1360px"
      @close="handleCloseDialog">
      <div class="search-box" style="padding-bottom: 15px;overflow: hidden">
        <div class="left-search-box">
          <div class="input-item">
            <span class="input-title" style="width: 40px;">单号</span>
            <el-input v-model="orderNo" class="search-input" placeholder="请输入单号" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">出库类型</span>
            <el-select v-model="orderType" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in orderTypeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">客户类型</span>
            <el-select v-model="customer" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in customerList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div style="float: left;margin-top: 14px;margin-right: 5px">
            <el-radio-group v-model="recordTimeRadio" style="margin-left:10px">
              <el-radio :label="1">出库时间</el-radio>
              <el-radio :label="2">审核时间</el-radio>
            </el-radio-group>
            <el-date-picker
              v-model="beginRecordDate"
              :picker-options="pickerRecordOptionsStart"
              :editable="false"
              class="search-input"
              size="small"
              type="date"
              placeholder="开始日期"
              value-format="timestamp"
            />
            <span style="display:inline-block;width: 38px;text-align: center"> 至 </span>
            <el-date-picker
              v-model="endRecordDate"
              :picker-options="pickerRecordOptionsEnd"
              :editable="false"
              class="search-input"
              size="small"
              type="date"
              placeholder="结束日期"
              value-format="timestamp"
            />
          </div>
          <div style="float: left;margin-top: 14px;margin-bottom: 10px">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-search"
              @click="handleDialogSearch"
            >查 询
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="clearDialogSearch" > <svg-icon icon-class="clear"/> 重 置</el-button>
          </div>
        </div>
        <div class="cut-line clear-both" style="margin-bottom: 0"/>
      </div>
      <div class="table-top-btn-group">
        <div
          :class="{'active':isActive === 0}"
          @click="navClick(0)"
        >
          单据信息
        </div>
        <div
          :class="{'active':isActive === 1}"
          @click="navClick(1)"
        >
          明细TOL: <span v-text="waferTol"/>
        </div>
        <el-button
          :disabled="recordList.length === 0"
          class="float-right"
          size="small"
          type="primary"
          @click="handleExport"
        ><svg-icon icon-class="export"/> 导 出
        </el-button>
      </div>
      <!--run信息-->
      <el-table
        v-loading="listLoading"
        v-show="isActive === 0"
        ref="runTable"
        :data="recordList"
        height="500px"
        element-loading-text="拼命加载中"
        highlight-current-row
        border
        fit
        @row-click="recordRowClick"
      >
        <el-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="出库单号" align="center" prop="outNo" width="130" show-overflow-tooltip fixed/>
        <el-table-column label="出库类型" align="center" prop="orderType" width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.orderType === '1'">销售出库</div>
            <div v-if="scope.row.orderType === '3'">PC调出</div>
            <div v-if="scope.row.orderType === '2'">库存调整</div>
          </template>
        </el-table-column>
        <el-table-column label="客户名称" align="center" prop="customer" width="120" show-overflow-tooltip/>
        <el-table-column label="订单编号" align="center" prop="orderNo" width="120" show-overflow-tooltip/>
        <el-table-column label="片型" align="center" prop="type" width="60" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.sliceType === 1" style="font-weight: bold;color: #f56c6c">方片</span>
            <span v-if="scope.row.sliceType === 0" style="font-weight: bold;color: #009494">圆片</span>
          </template>
        </el-table-column>
        <el-table-column label="出库数量(k)" align="center" prop="outCount" width="100" show-overflow-tooltip/>
        <el-table-column label="出库人" align="center" prop="creator" width="100" show-overflow-tooltip/>
        <el-table-column label="出库时间" align="center" prop="createTime" width="120" show-overflow-tooltip/>
        <el-table-column label="审核人" align="center" prop="auditor" width="120" show-overflow-tooltip/>
        <el-table-column label="审核日期" align="center" prop="auditTime" width="120" show-overflow-tooltip/>
        <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip/>
        <el-table-column label="任务状态" align="center" prop="status" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1" style="color:#ee7e31;font-weight:bold">待审核</span>
            <span v-if="scope.row.status === 2" style="color:#1ABC9C;font-weight:bold">通过</span>
            <span v-if="scope.row.status === 3" style="color:#E25D5D;font-weight:bold">不通过</span>
            <span v-if="scope.row.status === 4" style="color:#e27a51;font-weight:bold">审核中</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="80" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="scope.row.orderType !== '2' && scope.row.status !== 2 && scope.row.status !== 4" type="primary" size="mini" icon="el-icon-edit" @click="viewSplitDetail(scope.row)">编辑</el-button>
            <el-button v-if="scope.row.orderType !== '2' && scope.row.status !== 1 && scope.row.status !== 3" size="mini" @click="handleView(scope.row)"><svg-icon icon-class="chaxun"/> 查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--wafer信息-->
      <div v-if="isActive === 1" style="height: 500px;" class="table-container">
        <pl-table
          v-show="isActive === 1 && selectedRunRow.sliceType === 0"
          :datas="waferList"
          :row-height="37"
          header-drag-style
          use-virtual
          height="500px"
          class="broad-scrollbar-table"
          element-loading-text="拼命加载中"
          border
          fit
        >
          <pl-table-column align="center" label="序号" width="50" fixed>
            <template slot-scope="scope">
              {{ (pageNum - 1) * pageSize + scope.$index+1 }}
            </template>
          </pl-table-column>
          <pl-table-column label="包号" align="center" prop="boxNo" width="130" fixed show-overflow-tooltip/>
          <pl-table-column label="项次号" align="center" prop="sequence" width="100" fixed show-overflow-tooltip/>
          <pl-table-column v-for="item in formTheadStore" v-if="item.thName !== '包号'&&item.thName !== '项次号'" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[item.thKey] }}
            </template>
          </pl-table-column>
          <pl-table-column v-for="item in reservedFields" :key="item.id" :label="item.name" :prop="item.code" width="120" align="center" show-overflow-tooltip/>
          <pl-table-column v-for="item in formTheadStoreParams" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[item.thKey] }}
            </template>
          </pl-table-column>
        </pl-table>
        <pl-table
          v-show="isActive === 1 && selectedRunRow.sliceType === 1"
          :datas="waferList"
          :row-height="37"
          header-drag-style
          use-virtual
          height="500px"
          class="broad-scrollbar-table"
          element-loading-text="拼命加载中"
          border
          fit
        >
          <pl-table-column align="center" label="序号" width="50" fixed>
            <template slot-scope="scope">
              {{ (pageNum - 1) * pageSize + scope.$index+1 }}
            </template>
          </pl-table-column>
          <pl-table-column label="包号" align="center" prop="boxNo" width="130" fixed show-overflow-tooltip/>
          <pl-table-column label="项次号" align="center" prop="sequence" width="100" fixed show-overflow-tooltip/>
          <pl-table-column v-for="item in formTheadfStore" v-if="item.thName !== '包号'&&item.thName !== '项次号'" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[item.thKey] }}
            </template>
          </pl-table-column>
          <pl-table-column v-for="item in reservedFields" :key="item.id" :label="item.name" :prop="item.code" width="120" align="center" show-overflow-tooltip/>
          <pl-table-column v-for="item in formTheadfStoreParams" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[item.thKey] }}
            </template>
          </pl-table-column>
        </pl-table>
      </div>
      <el-pagination
        v-if="isActive === 0"
        :current-page="recordPageNum"
        :page-sizes="[12, 25, 50]"
        :page-size="recordPageSize"
        :total="recordTotalPage"
        class="pagination"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="recordSizeChange"
        @current-change="recordCurrentChange"
      />
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .app-container>>> .el-table--striped .el-table__body tr.el-table__row--striped.current-row td,
  .app-container>>> .el-table__body tr.current-row>td {
    background-color: #65ba7d !important;
  }
  .table-container>>> .el-table--scrollable-x{
    height: 550px !important;
  }
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
  .input-item>>> .el-radio{
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
    height: calc(100vh - 260px);
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
    width: 120px;
  }
  .module-title-text{
    margin-bottom: 10px;
  }
  .search-input{
    width: 138px;
  }
  .input-title{
    width: 62px;
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
    padding-top: 0px;
    padding-bottom: 60px;
  }
  .select-dialog>>>.el-dialog__body{
    padding-top: 25px;
  }
  .padding-dialog>>>.el-dialog__body{
    padding-top: 15px;
  }
</style>
