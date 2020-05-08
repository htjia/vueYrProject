<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0">
      <div class="input-item">
        <span class="input-title svgsty"><svg-icon icon-class="tiaomasm" style="font-size: 20px;color:#009494;margin-right:5px"/> 批/片号扫描</span>
        <el-input
          v-focus="true"
          ref="importInput"
          :autofocus="true"
          v-model="batchNum"
          class="search-input"
          style="width: 400px;"
          placeholder="请输入批/片号"
          size="small"
          maxlength="100"
          clearable
          @keyup.enter.native="handleReceiveInput"/>
      </div>
      <el-button
        :disabled="list.length === 0"
        style="margin-top: 15px"
        class="float-right margin-left"
        size="small"
        type="danger"
        @click="handleClear"><svg-icon icon-class="clear"/> 清 除</el-button>
      <el-button
        :disabled="list.length === 0"
        style="margin-top: 15px"
        class="float-right margin-left"
        size="small"
        type="primary"
        @click="handlePrint"><svg-icon icon-class="print"/> 保存并打印</el-button>
      <el-button
        :disabled="list.length === 0"
        style="margin-top: 15px"
        class="float-right margin-left"
        size="small"
        type="primary"
        @click="handleNewLabels"><svg-icon icon-class="add"/> 生成新标签</el-button>
      <el-button
        style="margin-top: 15px"
        class="float-right margin-left"
        size="small"
        type="primary"
        @click="handlePrintBatchNo"><svg-icon icon-class="print"/> 批次打印</el-button>
      <div class="clear-both"/>
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        :key="tableKey"
        element-loading-text="拼命加载中"
        border
        fit
      >
        <el-table-column label="批号" align="center" prop="batchNo"/>
        <el-table-column label="WaferID" align="center" prop="waferNo"/>
        <el-table-column v-if="isCreated" label="生成新标签" align="center" prop="newWafers">
          <template slot-scope="scope">
            <div v-for="item in scope.row.newWafers" :key="item" v-text="item"/>
          </template>
        </el-table-column>
        <el-table-column label="切割数量" align="center" prop="remark">
          <template slot-scope="scope">
            <el-input v-model="scope.row.sliceNum" placeholder="请输入切割数量" type="number" setp="1" min="2" max="20" @input="sliceNumChange(scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="status">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-delete"
              type="danger"
              @click="handleDelete(scope.$index)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="printBatchNoVisable"
      class="padding-dialog"
      title="标签打印"
      width="1000px"
    >
      <div class="input-item" style="margin-top: 0;margin-bottom: 15px">
        <span class="input-title svgsty"><svg-icon icon-class="tiaomasm" style="font-size: 20px;color:#009494;margin-right:5px"/> 批次扫描</span>
        <el-input
          v-model="dialogBatchNo"
          class="search-input"
          style="width: 400px;"
          placeholder="请输入批次"
          size="small"
          maxlength="100"
          clearable
          @keyup.enter.native="handleSearchBatchNo"/>
      </div>
      <el-button
        class="float-right margin-left"
        size="small"
        type="primary"
        @click="handlePrintAllBatchNo"><svg-icon icon-class="print"/> 批量打印</el-button>
      <el-table
        ref="printTable"
        :data="platterWaferList"
        border
        fit
        height="550px"
        highlight-current-row
        class="frag-dialog broad-scrollbar-table"
      >
        <el-table-column type="selection" width="70"/>
        <el-table-column align="center" label="序号" prop="index" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="批号" align="center" prop="batchNo" show-overflow-tooltip/>
        <el-table-column label="waferID" align="center" prop="waferNo" show-overflow-tooltip/>
      </el-table>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .app-container >>> td .cell {
    height: auto;
  }
  .svgsty{
    width: 110px !important;
    height: 33px;
    align-items: center;
    justify-content: center;
    align-content: center;
    display: flex;
    float: left;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 207px);
  }
  .tab-control span{
    line-height: 50px;
  }
  .el-checkbox {
    margin-left: 0px;
  }
  .input-title{
    width: 90px;
  }
  .input-item{
    float: left;
    margin-top: 14px;
    margin-right: 10px;
    position: relative;
  }
  .input-item>>> .el-radio{
    margin-top: 10px;
  }
  .search-input{
    width: 200px;
  }
</style>
