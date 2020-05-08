<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0">
      <div class="search-box">
        <div class="left-search-box">
          <div class="input-item">
            <span class="input-title" style="margin-left: -20px;">RunID </span>
            <el-input v-model="RunID" class="search-input" placeholder="请选择RunID" style="width:125px" size="small" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">WaferID </span>
            <el-input v-model="WaferID" class="search-input" placeholder="请选择WaferID" style="width:140px" size="small" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">验证版型 </span>
            <el-select v-model="checkType" class="search-input" style="width:120px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in checkSelectOptions"
                :key="item.id"
                :label="item.name"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">审核状态 </span>
            <el-select v-model="examineType" class="search-input" style="width:100px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in examineSelectOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">送片日期 </span>
            <el-date-picker
              v-model="beginDate"
              :picker-options="pickerOptionsStart"
              :editable="false"
              class="search-input"
              size="small"
              type="date"
              placeholder="选择开始日期"
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
              placeholder="选择结束日期"
              value-format="timestamp"
            />
          </div>
        </div>
        <div class="right-btn-box">
          <el-button
            style="margin-top: 15px"
            class="float-right margin-left"
            size="small"
            type="primary"
            @click="exportAll"
          >
            <svg-icon icon-class="export"/> 导 出
          </el-button>
          <el-button
            style="margin-top: 15px"
            class="float-right margin-top margin-left"
            size="small"
            type="danger"
            @click="clearAll"
          >
            <svg-icon icon-class="clear"/> 重 置
          </el-button>
          <el-button
            style="margin-top: 15px"
            class="float-right"
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="handleSearch" >查 询</el-button>
        </div>
      </div>
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        class="run-table"
        height="calc(100vh - 285px)"
        element-loading-text="拼命加载中"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
          </template>
        </el-table-column>
        <el-table-column label="单号" align="center" prop="billNo" width="120px"/>
        <el-table-column label="芯片批号" align="center" prop="chipBatchNumber" width="180px"/>
        <el-table-column label="版型" align="center" prop="editionType"/>
        <el-table-column label="结构类型" align="center" prop="structureCode"/>
        <el-table-column label="衬底工艺" align="center" prop="substrateCode"/>
        <el-table-column label="送片人" align="center" prop="creatorName"/>
        <el-table-column label="审核状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.auditResult === '1'" style="color: #009494;font-weight: bold">通过</span>
            <span v-if="scope.row.auditResult === '0'" style="color: #f33;font-weight: bold">不通过</span>
            <span v-if="scope.row.auditResult === '2'" style="color:#1C84C6;font-weight: bold">未审核</span>
          </template>
        </el-table-column>
        <el-table-column label="RunID" align="center" prop="runId" width="120px"/>
        <el-table-column label="WaferID" align="center" prop="waferId" width="120px"/>
        <el-table-column label="镭刻号" align="center" prop="laserMark" width="120px"/>
        <el-table-column label="目检" align="center" prop="visualLevelCode"/>
        <el-table-column label="衬底厂家" align="center" prop="supplier"/>
        <el-table-column label="波长" align="center" prop="wavelength"/>
        <el-table-column label="Std" align="center" prop="std"/>
        <el-table-column label="控制片" align="center" prop="isControl">
          <template slot-scope="scope">
            <span v-if="scope.row.isControl === '0'" style="font-weight: bold">是</span>
            <span v-if="scope.row.isControl === '1'" style="font-weight: bold">否</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="pageNum"
        :page-sizes="[12, 30, 40]"
        :page-size="pageSize"
        :total="totalPage"
        class="pagination"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  body{
    -moz-user-select: none; /*火狐*/
    -webkit-user-select: none; /*webkit浏览器*/
    -ms-user-select: none; /*IE10*/
    -khtml-user-select: none; /*早期浏览器*/
    user-select: none;
  }
  .search-box{
    display: flex;
    flex-direction: row;
  }
  .left-search-box{
    flex-grow: 1;
  }
  .right-btn-box{
    width: 315px;
  }
  .input-item{
    float: left;
    margin-top: 15px;
    margin-right: 10px;
  }
  .search-input{
    width: 140px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 207px);
  }
  .table-top-btn-group{
    overflow: hidden;
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
  .substrate>div:not(:first-child){
    margin-left: 5px;
  }
  .app-container>>> .el-table--border {
    border-top: 2px solid #009494;
  }
  .table-top-btn-group>div.active{
    color: #fff;
    background: #009494;
    border-color: #009494;
  }
  .run-table ::-webkit-scrollbar {/*滚动条整体样式*/
    height: 10px !important;
  }
</style>
