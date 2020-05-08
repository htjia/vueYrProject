<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto">
      <div class="search-box">
        <div class="left-search-box" style="margin-bottom: -10px;">
          <div class="input-item" style="margin-bottom: 10px;">
            <span class="input-title" style="width:55px">RunID </span>
            <el-input v-model="runId" class="search-input" placeholder="请输入RunID" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item" style="margin-bottom: 10px;">
            <span class="input-title" style="width:60px">WaferID </span>
            <el-input v-model="waferId" class="search-input" style="width: 190px" placeholder="请输入WaferID" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item" style="margin-bottom: 10px;">
            <span class="input-title" style="width:35px">机台 </span>
            <el-select v-model="machineValue" class="search-input" style="width:80px" size="small" placeholder="请选择" clearable>
              <el-option
                v-for="item in machineOptions"
                :key="item.id"
                :label="item.code"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item" style="margin-bottom: 10px;">
            <span class="input-title" style="width:65px">衬底厂家 </span>
            <el-input v-model="supplier" class="search-input" style="width:120px" placeholder="衬底厂家" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item" style="margin-bottom: 10px;">
            <span class="input-title" style="width:65px">生长日期 </span>
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
        <div class="right-btn-box" style="margin-bottom: -10px;text-align:right">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="handleSearch" >查 询</el-button>
          <el-button
            class="margin-left"
            style="margin-bottom: 10px"
            size="small"
            type="danger"
            @click="clearCondition"
          >
            <svg-icon icon-class="clear"/> 重 置
          </el-button>
          <el-button
            class="margin-left"
            size="small"
            type="primary"
            @click="exportAll"
          >
            <svg-icon icon-class="export"/> 导 出
          </el-button>
        </div>
      </div>
    </div>
    <div class="app-container">
      <div class="table-top-btn-group">
        <div class="active">
          TOL ：{{ totalPage }}
        </div>
      </div>
      <!--单据信息-->
      <el-table
        v-loading="listLoading"
        ref="listTabel"
        :data="list"
        class="mocvd-table run-table"
        element-loading-text="拼命加载中"
        height="calc(100vh - 330px)"
        highlight-current-row
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
          </template>
        </el-table-column>
        <el-table-column label="RunID" align="center" prop="runId"/>
        <el-table-column label="WaferID" align="center" prop="waferId"/>
        <el-table-column label="镭刻号" align="center" prop="laserMark" width="120"/>
        <el-table-column label="衬底厂家" align="center" prop="supplier"/>
        <el-table-column label="目检" align="center" prop="oldVisualName"/>
        <el-table-column label="原因" align="center" prop="oldReasonName"/>
        <el-table-column label="备注" align="center" prop="remark" width="120px" show-overflow-tooltip=""/>
        <el-table-column label="目检修正" align="center" prop="newVisualName" width="120px" show-overflow-tooltip=""/>
        <el-table-column label="修正原因" align="center" prop="newReasonName"/>
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
  .tip-out-inner-dialog>>>.el-checkbox{
    margin-left: 20px;
  }
  .normalReasom{
    border: 0px;
    color: #009494;
    cursor: pointer;
  }
  .normalReasom:hover{
    color: #009688;
  }
  .firstRow{
    padding-bottom: 15px;
    margin-bottom: 15px;
    border-bottom: 1px solid #DCDFE6;
  }
  .setTree{
    padding: 15px;
    border: 1px solid #DCDFE6;
    margin-top: 15px;
    height: 425px;
    overflow: auto;
  }
  .getCalss{
    padding: 15px;
  }
  .setInner {
    padding:10px;
    color: #333;
  }
  .buttonType {
    background: #1abb9d;
    color: #fff;
    font-size: 16px;
  }
  .buttonType1 {
    font-size: 15px;
    float: right;
    height: 35px;
    border: 0px;
    padding: 0;
    margin-right: 15px;
    color:#009494;
  }
  .buttonType1:hover{
    color:#009688;
    background-color: #fff;
  }
  .leftType{
    float: left;
    height: 35px;
    margin-left: 15px;
    padding-top: 8px;
    margin-right: 15px;
  }
  .spanColor{
    font-size: 16px;
    font-weight: bold;
    margin-right: 15px;
  }
  .tableTitle{
    width: 100%;
    font-weight: bold;
    font-size: 15px;
    padding-left: 30px;
    margin-bottom: -15px;
    z-index: 99;
    position: relative;
  }
  .setTitle{
    background: #fff;
    width: 85px;
    text-align: center;
  }
  .set-border{
    border: 1px solid #DCDFE6;
    padding-top: 20px;
    padding-bottom: 0px;
    margin: 5px;
    height: 650px;
    padding: 20px 10px 10px 10px;
  }
  .set-borders{
    border: 1px solid #DCDFE6;
    padding-top: 20px;
    padding-bottom: 0px;
    margin: 5px;
    padding: 20px 10px 10px 10px;
  }
  .search-box{
    display: flex;
    flex-direction: row;
  }
  .left-search-box{
    flex-grow: 1;
  }
  .right-btn-box{
    width: 310px;
  }
  .input-item{
    float: left;
    margin-right: 10px;
    margin-top: 0;
  }
  .search-input{
    width: 155px;
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
  .table-top-btn-group>div.active{
    color: #fff;
    background: #009494;
    border-color: #009494;
  }
  .checkstr{
    word-wrap: break-word;
    word-break: break-all;
    overflow: auto;
    line-height: 25px;
    height: 350px;
  }
  .parameter-table>>>.el-table .set_green td{
    background-color: #E35C5C;
    color: #fff;
  }
  .statuType{
    text-align: center;
    font-size: 30px;
    padding: 15px;
    color: #009494;
    font-weight: bold;
    border-bottom: 1px solid #E5E5E5;
  }
  .statuType1{
    text-align: center;
    font-size: 30px;
    padding: 15px;
    color: #E35C5C;
    font-weight: bold;
    border-bottom: 1px solid #E5E5E5;
  }
  .run-table ::-webkit-scrollbar {/*滚动条整体样式*/
    height: 10px !important;
  }
  .app-container>>> .el-table--border {
    border-top: 2px solid #009494;
  }
</style>
