<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto">
      <div class="input-item">
        <span class="input-title">规则名称</span>
        <el-input v-model="searchKeys.name" class="search-input" placeholder="请输入规则名称" size="small" maxlength="20" clearable/>
      </div>
      <div class="input-item">
        <span class="input-title" style="width: 85px">客户名称</span>
        <el-select v-model="searchKeys.customerId" placeholder="请选择客户名称" size="small" filterable clearable>
          <el-option
            v-for="item in customerList"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </div>
      <el-button
        size="small"
        type="primary"
        icon="el-icon-search"
        @click="handleSearch" >查 询</el-button>
      <el-button
        class="float-right"
        size="small"
        type="primary"
        @click="handleAdd"
      ><svg-icon icon-class="add"/> 新增规则</el-button>
      <el-button
        class="float-right"
        size="small"
        type="primary"
        @click="referenceAdd"
      ><svg-icon icon-class="add"/> 参照新增</el-button>
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :key="Math.random()"
        :data="list"
        height="92%"
        class="broad-scrollbar-table"
        element-loading-text="拼命加载中"
        highlight-current-row
        border
        fit
        @current-change="handelCurrentChange"
      >
        <el-table-column align="center" label="序号" width="50" fixed="left">
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="规则名称" align="center" prop="name" show-overflow-tooltip min-width="200"/>
        <el-table-column label="客户名称" align="center" prop="customerName" width="100" show-overflow-tooltip/>
        <el-table-column label="片型" align="center" min-width="80">
          <template slot-scope="scope">
            {{ scope.row.pattern ? '方片':'圆片' }}
          </template>
        </el-table-column>
        <!-- 动态参数 -->
        <el-table-column v-for="(it,ind) in titleList" :key="ind" :label="it.name" align="center" show-overflow-tooltip min-width="150">
          <template slot-scope="scope">
            <!-- way： 4-不分  0-按Bin分  1-按间隔分  2-按区间分 3-按范围分 -->
            <span
              v-if="scope.row.detailList.findIndex(i=>i.param === (scope.row.pattern ? it.FP : it.YP))>-1 &&
              scope.row.detailList[scope.row.detailList.findIndex(i=>i.param === (scope.row.pattern ? it.FP : it.YP))].way === 4">不分</span>
            <span
              v-if="scope.row.detailList.findIndex(i=>i.param === (scope.row.pattern ? it.FP : it.YP))>-1 &&
              scope.row.detailList[scope.row.detailList.findIndex(i=>i.param === (scope.row.pattern ? it.FP : it.YP))].way === 0">按Bin分</span>
            <span
              v-if="scope.row.detailList.findIndex(i=>i.param === (scope.row.pattern ? it.FP : it.YP))>-1 &&
              scope.row.detailList[scope.row.detailList.findIndex(i=>i.param === (scope.row.pattern ? it.FP : it.YP))].way === 1">
              {{ scope.row.detailList[scope.row.detailList.findIndex(i=>i.param === (scope.row.pattern ? it.FP : it.YP))].wayRule }}
            </span>
            <span
              v-if="scope.row.detailList.findIndex(i=>i.param === (scope.row.pattern ? it.FP : it.YP))>-1 &&
              scope.row.detailList[scope.row.detailList.findIndex(i=>i.param === (scope.row.pattern ? it.FP : it.YP))].way === 2">
              {{ scope.row.detailList[scope.row.detailList.findIndex(i=>i.param === (scope.row.pattern ? it.FP : it.YP))].wayRule }}
            </span>
            <span
              v-if="scope.row.detailList.findIndex(i=>i.param === (scope.row.pattern ? it.FP : it.YP))>-1 &&
              scope.row.detailList[scope.row.detailList.findIndex(i=>i.param === (scope.row.pattern ? it.FP : it.YP))].way === 3">
              {{ scope.row.detailList[scope.row.detailList.findIndex(i=>i.param === (scope.row.pattern ? it.FP : it.YP))].wayRule }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="外观" align="center" prop="facede" width="100" show-overflow-tooltip/>
        <el-table-column label="标签" align="center" prop="labelName" min-width="120" show-overflow-tooltip/>
        <el-table-column label="数量" align="center" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.numRule ? '不超请领单' : '按订单' }}
          </template>
        </el-table-column>
        <el-table-column label="Mapping图" align="center" width="100">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.mapping" :true-label="0" :false-label="1" disabled/>
          </template>
        </el-table-column>
        <el-table-column label="检验报告" align="center" width="60">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.checkReport" :true-label="0" :false-label="1" disabled/>
          </template>
        </el-table-column>
        <el-table-column label="静电袋及纸箱" align="center" prop="categoryName" min-width="160" show-overflow-tooltip/>
        <el-table-column label="备注" align="center" prop="remark" min-width="160" show-overflow-tooltip/>
        <el-table-column label="修改人" align="center" prop="creatorName" min-width="160" show-overflow-tooltip/>
        <el-table-column label="修改时间" align="center" prop="createTime" min-width="160" show-overflow-tooltip/>
        <el-table-column label="启用" align="center" min-width="60">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.status" :true-label="0" :false-label="1" @change="disableEnable(scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="status" width="160" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click.stop="handleEdit(scope.row)">编辑</el-button>
            <el-button
              v-if="scope.row.id !== 1 && scope.row.id !== 2 && scope.row.id !== 3 && scope.row.id !== 4 && scope.row.id !== 5 && scope.row.id !== 6"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click.stop="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="pageNum"
        :page-sizes="[15, 30, 40]"
        :page-size="pageSize"
        :total="totalPage"
        class="pagination"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div>
    <custormizatoin-dia
      :row="row"
      :is-row="isRow"
      :table-key="tableKey"
      :customer-list="customerList"
      :dialog-title="dialogTitle"
      :add-dialog-visible="addDialogVisible"
      @dialogFalse="dialogFalse"/>
  </PageHeaderLayout>
</template>

<script src="./custormization.js"></script>

<style scoped>

  .long-title>>> .el-form-item__label{
    width: 110px !important;
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
    height: calc(100vh - 205px);
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
  .mini-input>>> .el-input--mini {
    width: 60px;
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
  .broad-scrollbar-table>>> .el-checkbox {
    z-index:0!important
  }
   /*.broad-scrollbar-table>>> .el-table__fixed, .broad-scrollbar-table>>> .el-table__fixed-right{*/
    /*background: #fff;*/
    /*height: calc(100% - 16px) !important;*/
  /*}*/
  .broad-scrollbar-table>>> .is-scrolling-none +.el-table__fixed,
  .broad-scrollbar-table>>> .is-scrolling-none +.el-table__fixed +.el-table__fixed-right {
    height: 100% !important;
  }
.el-table--enable-row-transition .el-table__body td {
  background: #fff!important;
}
</style>
