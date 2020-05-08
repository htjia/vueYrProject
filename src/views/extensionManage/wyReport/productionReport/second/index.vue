<template>
  <div>
    <div class="module-container" style="margin-top: 10px;">
      <!-- 顶部的标题显示 -->
      <div class="module-title flex">
        <div class="module-title-text">{{ extension === 0 ? '按综合判定结果统计产量':'按综合判定结果统计入库量' }}</div>
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
          <!-- 图表筛选 -->
          <div style="flex:1">
            <div v-if="isChart">
              <div class="input-item">
                <span class="input-title">月筛选</span>
                <el-date-picker
                  v-model="month"
                  :editable="false"
                  style="width:130px"
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
                  style="width:130px"
                  class="search-input"
                  format="yyyy 第 WW 周"
                  value-format="yyyy-MM-dd"
                  size="small"
                  type="week"
                  placeholder="选择日期"
                  @change="changeWeek"
                />
              </div>
            </div>
            <!-- 表格的筛选结果 -->
            <div v-else>
              <div class="input-item">
                <span class="input-title">光色名称</span>
                <el-select v-model="colorId" style="width:130px" multiple collapse-tags class="search-input" size="small" placeholder="请选择" filterable clearable>
                  <el-option
                    v-for="item in screenObj.structureTypeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </div>
              <!-- 尺寸 -->
              <div class="input-item">
                <span class="input-title">尺寸</span>
                <el-select v-model="measureId" style="width:130px" class="search-input" size="small" placeholder="请选择" clearable filterable>
                  <el-option
                    v-for="(item,index) in screenObj.measureList"
                    :key="index"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </div>
              <!-- 是否折合 -->
              <div class="input-item" style="line-height: 30px">
                <el-checkbox v-model="convert">是否折合</el-checkbox>
              </div>
              <!-- 光色名称 -->
              <div class="input-item">
                <span class="input-title">衬底类型</span>
                <el-select v-model="substrateTypeId" style="width:130px" multiple collapse-tags class="search-input" clearable size="small" placeholder="请选择" filterable>
                  <el-option
                    v-for="(item,index) in screenObj.typeList"
                    :key="index"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </div>
              <!-- 时间 -->
              <div class="input-item">
                <span class="input-title">时间 </span>
                <el-date-picker
                  v-model="startTime"
                  :picker-options="pickerOptionsStart"
                  :editable="false"
                  style="width:130px"
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
                  style="width:130px"
                  class="search-input"
                  size="small"
                  type="date"
                  placeholder="选择结束日期"
                  value-format="yyyy-MM-dd"
                />
              </div>
            </div>
          </div>
          <!-- 查询和重置 -->
          <div class="btn-item margin-left">
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
              v-if="!isChart"
              size="small"
              type="primary"
              @click="exportExcel"
            ><svg-icon icon-class="export"/> 导出</el-button>
          </div>
        </div>
        <!-- 是否图表 -->
        <div v-if="isChart" class="charts">
          <div class="charts-left">
            <el-row :gutter="20">
              <el-col v-if="!extension" :span="12">
                <div class="charts-item">
                  <span>
                    <svg-icon icon-class="spckongzhi"/>计划产量
                  </span>
                  <span>{{ objData.planNum }}</span>
                </div>
              </el-col>
              <el-col :span="extension ? 24 : 12">
                <div class="charts-item">
                  <span>
                    <svg-icon icon-class="waiyanhuizong"/>实际{{ extension ? '入库量' : '产量' }}
                  </span>
                  <span>{{ objData.yield }} {{ !extension ? '（' + objData.yieldRatio + '）' : '' }}</span>
                </div>
              </el-col>
              <el-col :span="extension ? 24 : 12">
                <div class="charts-item">
                  <span>
                    <svg-icon icon-class="ceshidaiban"/>时间进度
                  </span>
                  <span>{{ objData.progress }}</span>
                </div>
              </el-col>
              <el-col v-if="!extension" :span="12">
                <div class="charts-item">
                  <span>
                    <svg-icon icon-class="shujufenxi"/>预计合格数量
                  </span>
                  <span>{{ objData.fuctorNum }}</span>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="charts-right">
            <chart id="acplxtj" :options="option" height="200px" width="100%"/>
          </div>
        </div>
        <!-- 是表格 -->
        <div v-else class="chart-table">
          <el-table
            v-loading="listLoading"
            :data="tableList"
            height="197"
            class="run-table"
            element-loading-text="拼命加载中"
            highlight-current-row
            border
            fit>
            <el-table-column label="机台" fixed="left" align="center" prop="machine" width="130"/>
            <el-table-column label="S" align="center" prop="S"/>
            <el-table-column label="F" align="center" prop="F"/>
            <el-table-column label="T" align="center" prop="T"/>
            <el-table-column label="R" align="center" prop="R"/>
            <el-table-column label="合格片数" align="center" prop="eligibleNum"/>
            <el-table-column label="合格片比例" align="center" prop="eligibleRatio"/>
            <el-table-column label="S片比例" align="center" prop="sRatio"/>
            <el-table-column label="R片比例" align="center" prop="rRatio"/>
          </el-table>
        </div>
      </div>
    </div>
  </div>

</template>
<script src="./second.js"></script>
<style scoped>
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
  .charts {
    display: flex;
    justify-content: space-between;
  }
  .charts-left {
    flex: 1;
    padding-right: 10px;
  }
  .charts-item {
    background: rgb(248,248,248);
    padding-right: 5px;
    margin-top: 10px;
    line-height: 96px;
    display: flex;
    align-items: center;
    padding-left: 30px;
  }
  .charts-item span {
    font-weight: 900;
    width: 120px;
  }
  .charts-item span svg {
    font-size: 22px;
    margin-right: 10px;
    vertical-align: middle;
  }
  .charts-item span:last-child {
    flex: 1;
    color: #009688;
    font-size: 18px;
    font-weight: 900;
  }
  .charts-right {
    width: 50%;
    margin-top: 10px;
    border: 1px solid #e0e0e0;
  }
  canvas {
    width: 100%!important;
  }
  .chart-table {
    margin-top: 15px;
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
  .search-input>>> .el-input__inner {
    padding-right: 0!important;
  }
  .btn-item {
    margin-right: 0;
  }
  .btn-item>>> .el-button {
    margin-top: 14px;
  }
  @media (max-width: 1632px) {
    /*.el-form-item--small.el-form-item {*/
      /*margin-bottom: 5px;*/
    /*}*/
    .charts-right{
      width: 37%;
    }
  }
  /* .app-container>>> .el-table--border {
    border-top: 2px solid #009494;
  } */
</style>
