<template>
  <PageHeaderLayout >
    <!-- 全局选择：外延生产管理 -->
    <div class="header-search-add height-auto">
      <div class="search-box">
        <div class="left-search-box" style="margin-left: -20px;margin-top: -15px;">
          <div class="input-item">
            <span class="input-title" style="width: 110px">数据源切换 </span>
            <el-select v-model="extension" class="search-input" style="width:130px" size="small" placeholder="请选择" filterable>
              <el-option
                v-for="item in extensionOptions"
                :key="item.id"
                :label="item.code"
                :value="item.id"/>
            </el-select>
          </div>
        </div>
        <div class="right-btn-box">
          <el-button
            class="float-right margin-left"
            size="small"
            type="primary"
            @click="exportDate"
          ><svg-icon icon-class="export"/> 导出</el-button>
        </div>
      </div>
    </div>
    <div ref="chart" class="results">
      <First :extension="extension" :screen-obj="screenObj"/>
      <Second :extension="extension" :screen-obj="screenObj"/>
      <Third :extension="extension" :screen-obj="screenObj"/>
      <Forth :extension="extension" :screen-obj="screenObj"/>
      <Fifth v-if="screenObj" :extension="extension" :screen-obj="screenObj"/>
      <Sixth :extension="extension" :screen-obj="screenObj"/>
      <Seventh :extension="extension" :screen-obj="screenObj"/>
      <Eighth :extension="extension" :screen-obj="screenObj"/>
    </div>
  </PageHeaderLayout>
</template>

<script src="./production.js"></script>

<style scoped>
.results {
  width: 100%;
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
  /* .app-container>>> .el-table--border {
    border-top: 2px solid #009494;
  } */
  @page{
    size:  auto;   /* auto is the initial value */
    margin: 3mm;  /* this affects the margin in the printer settings */
  }

  html{
    background-color: #FFFFFF;
    margin: 0px;  /* this affects the margin on the html before sending to printer */
  }

  body{
    border: solid 1px blue ;
    margin: 10mm 15mm 10mm 15mm; /* margin you want for the content */
  }
</style>
