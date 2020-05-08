<template>
  <div class="page_break">
    <div class="module-container" style="margin-top: 10px;">
      <!-- 顶部的标题显示 -->
      <div class="module-title flex">
        <div class="module-title-text">按外延参数统计入库量&良率周对比</div>
        <div class="right-btn-box">
          <el-button
            class="float-right qhColor margin-left"
            size="mini"
            type="primary"
            @click="changeIsChart"
          ><svg-icon icon-class="daochu"/> 切换视图</el-button>
        </div>
      </div>
      <div class="module-content flex coloum" style="height: auto">
        <!-- 筛选条件 -->
        <div class="left-search-box" style="margin-left: -10px;margin-top: -15px;">
          <div style="flex:1">
            <!-- 图表 -->
            <!-- 光色系列 -->
            <div class="input-item">
              <span class="input-title">光色系列</span>
              <el-select v-model="colorSeries" style="width: 145px" clearable multiple collapse-tags class="search-input" size="small" placeholder="请选择" filterable @change="findColorType">
                <el-option
                  v-for="item in screenObj.colorType"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </div>
            <!-- 光色名称 -->
            <div class="input-item">
              <span class="input-title">光色名称</span>
              <el-select v-model="colorId" multiple collapse-tags class="search-input" size="small" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in colorSeries.length ? structureTypeList : screenObj.structureTypeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </div>
            <!-- 统计参数 -->
            <div class="form-item" style="float:left">
              <div class="input-item">
                <span class="input-title">统计参数</span>
                <el-select v-model="paramType" clearable class="search-input" size="small" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in screenObj.paramsList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </div>
              <!-- 对比值 -->
              <el-form ref="ruleForm" :model="ruleForm" :rules="rules" style="float: left">
                <el-form-item label="" prop="standardValue">
                  <el-input v-model="ruleForm.standardValue" type="number" min="0" class="search-input" style="width:110px" size="small" placeholder="请输入对比值" filterable/>
                </el-form-item>
              </el-form>
            </div>
            <!-- <div class="input-item" style="padding-left:8px">
          </div> -->
            <template v-if="isChart">
              <div class="input-item">
                <span class="input-title">月筛选</span>
                <el-date-picker
                  v-model="month"
                  :editable="false"
                  class="search-input"
                  size="small"
                  type="month"
                  value-format="yyyy-MM"
                  placeholder="选择日期"
                  @change="changeMonth"
                />
              </div>
              <div class="input-item">
                <span class="input-title">周筛选</span>
                <el-date-picker
                  ref="weekval"
                  v-model="weekDate"
                  :picker-options="{'firstDayOfWeek': 1}"
                  :editable="false"
                  class="search-input"
                  format="yyyy 第 WW 周"
                  value-format="yyyy-MM-dd"
                  size="small"
                  type="week"
                  placeholder="选择日期"
                  @change="changeWeek"
                />
              </div>
            </template>
            <!-- 表格 -->
            <template v-else>
              <!-- 时间 -->
              <div class="input-item">
                <span class="input-title">时间 </span>
                <el-date-picker
                  v-model="startTime"
                  :picker-options="pickerOptionsStart"
                  :editable="false"
                  class="search-input"
                  size="small"
                  type="date"
                  placeholder="选择开始日期"
                  value-format="yyyy-MM-dd"
                />
                <span style="display:inline-block;width: 38px;text-align: center"> 至 </span>
                <el-date-picker
                  v-model="endTime"
                  :picker-options="pickerOptionsEnd"
                  :editable="false"
                  class="search-input"
                  size="small"
                  type="date"
                  placeholder="选择结束日期"
                  value-format="yyyy-MM-dd"
                />
              </div>
            </template>
          </div>
          <!-- 查询和重置 -->
          <div class="btn-item">
            <el-button
              class="margin-left"
              size="small"
              type="primary"
              icon="el-icon-search"
              @click="fetchData" >查 询</el-button>
            <el-button
              class="margin-left"
              size="small"
              type="danger"
              @click="clearCondition"
            >
              <svg-icon icon-class="clear"/> 重 置
            </el-button>
            <el-button
              v-if="!isChart && extension === 1"
              size="small"
              type="primary"
              @click="exportExcel"
            ><svg-icon icon-class="export"/> 导出</el-button>
          </div>
        </div>
        <div>
          <div v-if="isChart">
            <chart id="wycstjhlldb" :options="option" height="300px" width="100%"/>
            <chart id="llzdb" :options="option1" height="300px" width="100%"/>
          </div>
          <div v-else class="chart-table">
            <div v-if="extension === 0" class="no-data">
              <svg-icon class="no-data-icon" icon-class="noData"/>
              <div>暂无数据</div>
            </div>
            <el-table
              v-loading="listLoading"
              v-else
              :data="tableList"
              class="run-table"
              element-loading-text="拼命加载中"
              highlight-current-row
              border
              fit>
              <el-table-column label="机台" fixed="left" align="center" prop="machine" width="130"/>
              <el-table-column v-for="item in option.xAxis.data" :label="item" :key="item" :prop="item" align="center"/>
              <el-table-column label="合计" align="center" prop="total"/>
            </el-table>
          </div>
        </div>
      </div>
    </div>

</div></template>
<script src="./seventh.js"></script>
<style scoped>
 .page_break {
    page-break-before: auto;
    page-break-after: always;
  }
  .input-titleZ{
    max-width:110px
  }
  .tip-out-inner-dialog>>>.el-checkbox{
    margin-left: 20px;
  }
  .normalReasom{
    border: 0px;
    color: #009494;
    cursor: pointer;
  }
  .el-form-item {
    margin-top: 10px;
    margin-left: 10px;
    margin-bottom: 0;
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
    margin-top: 15px;
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
  .buttonTypechuli {
    background: #FFB800;
    color: #fff;
    font-size: 16px;
  }
  .buttonType1 {
    font-size: 15px;
    float: right;
    height: 15px;
    border: 0px;
    padding: 0;
    margin-right: 15px;
  }
  .leftType{
    float: left;
    height: 15px;
    margin-left: 15px;
  }
  .spanColor{
    font-size: 16px;
    font-weight: bold;
    margin-top: 5px;
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
    height: 495px;
    padding: 20px 10px 10px 10px;
  }
  .set-borders{
    border: 1px solid #DCDFE6;
    padding-top: 20px;
    padding-bottom: 0px;
    margin: 5px;
    padding: 20px 10px 10px 10px;
  }
  .search-box, .flex{
    display: flex;
    justify-content: space-between;
  }
  .left-search-box{
    flex-grow: 1;
    display: flex;
    justify-content: space-between;
  }
  .coloum {
    flex-direction: column;
  }
  .right-btn-box{
    width: 210px;
  }
  .qhColor {
    background: #1abc9c;
    border: 0;
  }
  .input-item{
    float: left;
    margin-top: 14px;
    margin-right: 10px;
  }
  .search-input{
    width: 155px;
  }
  .app-container{
    position: relative;
    height: auto;
  }
  .table-top-btn-group{
    overflow: hidden;
  }
  .chart-table {
    padding-top: 15px;
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
  .run-table ::-webkit-scrollbar {/*滚动条整体样式*/
    height: 10px !important;
  }
  .form-item>>> .el-form-item {
    margin-top: 14px;
  }
  .form-item>>> .el-form-item__content {
    line-height: 0!important;
  }
  .btn-item {
    margin-right: 0;
  }
  .btn-item>>> .el-button {
    margin-top: 14px;
  }
  /* .app-container>>> .el-table--border {
    border-top: 2px solid #009494;
  } */
</style>
