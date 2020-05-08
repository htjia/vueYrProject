<template>
  <div>
    <div class="module-container" style="margin-top: 10px;">
      <!-- 顶部的标题显示 -->
      <div class="module-title flex">
        <div class="module-title-text">{{ extension === 0 ? '本月产量统计':'本月入库统计' }}</div>
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
          <div style="flex: 1">
            <!-- 产品类型 -->
            <div class="input-item">
              <span class="input-title">产品类型</span>
              <el-select v-model="productId" multiple collapse-tags style="width:200px" class="search-input" size="small" placeholder="请选择" clearable filterable @change="changeProduct">
                <el-option
                  v-for="item in screenObj.productOptions"
                  :key="item.id"
                  :label="item.productName"
                  :value="item.id"/>
              </el-select>
            </div>
            <!-- 尺寸 -->
            <div class="input-item">
              <span class="input-title">尺寸</span>
              <el-select v-model="measureId" style="width:130px" class="search-input" size="small" placeholder="请选择" clearable filterable @change="changeMeasure">
                <el-option
                  v-for="item in screenObj.measureList"
                  :key="item.id"
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
              <span class="input-title">光色名称</span>
              <el-select
                v-model="colorId"
                multiple
                collapse-tags
                popper-append-to-body
                style="width:130px"
                class="search-input"
                size="small"
                placeholder="请选择"
                clearable
                filterable
                @change="changeMeasure">
                <el-option
                  v-for="item in screenObj.structureTypeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </div>
            <!-- 衬底工艺 -->
            <div class="input-item">
              <span class="input-title">衬底工艺</span>
              <el-select v-model="craftId" multiple collapse-tags style="width:160px" class="search-input" size="small" placeholder="请选择" clearable filterable @change="changeMeasure">
                <el-option
                  v-for="item in screenObj.cdfindListOption"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </div>
            <!-- 日期 -->
            <div class="input-item">
              <span class="input-title">日期</span>
              <el-date-picker
                v-model="month"
                :editable="false"
                class="search-input"
                size="small"
                type="month"
                style="width:130px"
                placeholder="选择日期"
                value-format="yyyy-MM"
              />
            </div>
          </div>

          <!-- 查询和重置 -->
          <div class="btn-item" style="float: right">
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
        <div>
          <div v-if="isChart">
            <chart id="byrkcltj" :options="option1" height="300px" width="100%"/>
          </div>
          <div v-else class="chart-table">
            <el-table
              v-loading="listLoading"
              :data="tableList"
              height="285"
              class="run-table"
              element-loading-text="拼命加载中"
              highlight-current-row
              show-summary
              border
              fit>
              <el-table-column label="日期" align="center" prop="date" width="130"/>
              <el-table-column v-for="item in screenObj.machineList" :key="item.id" :label="item.code" :prop="item.code" align="center"/>
              <el-table-column label="合计" align="center" prop="total" width="130"/>
            </el-table>
          </div>
        </div>
      </div>
    </div>

</div></template>
<script src="./first.js"></script>
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
