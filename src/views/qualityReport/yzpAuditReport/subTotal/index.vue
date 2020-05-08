<template>
  <PageHeaderLayout>
    <div class="header-search-add height-auto">
      <el-row>
        <el-col style="margin-top: -15px;">
          <div class="input-item">
            <span class="input-title" style="width:40px">时间 </span>
            <el-date-picker
              v-model="beginDate"
              :picker-options="pickerOptionsStart"
              :editable="false"
              class="search-input"
              style="width:130px"
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
              style="width:130px"
              size="small"
              type="date"
              placeholder="结束日期"
              value-format="timestamp"
            />
          </div>
          <div class="input-item">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-search"
              @click="getTableChar()" >查 询</el-button>
          </div>
          <div class="input-item">
            <el-button
              size="small"
              type="danger"
              @click="clearAll()" ><svg-icon icon-class="clear"/> 重 置</el-button>
          </div>
          &nbsp;
          <el-button
            style="margin-top: 15px;margin-left:15px"
            class="float-right"
            size="small"
            type="primary"
            icon="el-icon-sold-out"
            @click="importExcel()">导出</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="module-container" style="margin-top: 10px;padding-top:10px;padding-bottom:10px">
      <div class="tab-control" style="margin: 0px 15px;">
        <span
          :class="{activeTab: isActive === 1}"
          @click="navClick(1)"
        >方片</span>
        <span
          :class="{activeTab: isActive === 0}"
          class="has-margin-left"
          @click="navClick(0)"
        >圆片</span>
      </div>
      <div class="charts-right" style="padding-top: 10px">
        <chart id="acplxtj1" :options="options1" height="250px" width="100%"/>
      </div>
    </div>
    <div class="module-container" style="margin-top: 10px;">
      <!-- 顶部的标题显示 -->
      <div class="module-title flex">
        <div class="module-title-text">{{ isActive === 1? '方片数据源' :'圆片数据源' }}</div>
      </div>
      <div class="module-content flex coloum" style="height: auto">
        <!-- 是表格 -->
        <div class="chart-table">
          <el-table
            v-loading="listLoading"
            v-show="isActive === 1"
            :data="tableList"
            height="calc(100vh - 590px)"
            class="broad-scrollbar-table"
            element-loading-text="拼命加载中"
            highlight-current-row
            border
            fit>
            <el-table-column label="日期" fixed="left" align="center" prop="createTime" width="130"/>
            <el-table-column label="入库数量" align="center" prop="rknum"/>
            <el-table-column label="B1" align="center" prop="b1num"/>
            <el-table-column label="B2" align="center" prop="b2num"/>
            <el-table-column label="B3" align="center" prop="b3num"/>
            <el-table-column label="B4" align="center" prop="b4num"/>
            <el-table-column label="B5" align="center" prop="b5num"/>
            <el-table-column label="B6" align="center" prop="b6num"/>
            <el-table-column label="B7" align="center" prop="b7num"/>
            <el-table-column label="B8" align="center" prop="b8num"/>
            <el-table-column label="其他" align="center" prop="qtfpnum"/>
            <el-table-column label="外观副品总数" align="center" prop="wgfpnum"/>
            <el-table-column label="副品占比" align="center" prop="fpzb">
              <template slot-scope="scope">
                {{ scope.row.fpzb }}
              </template>
            </el-table-column>
          </el-table>
          <el-table
            v-loading="listLoading"
            v-show="isActive === 0"
            :data="tableList"
            height="calc(100vh - 590px)"
            class="broad-scrollbar-table1"
            element-loading-text="拼命加载中"
            highlight-current-row
            border
            fit>
            <el-table-column label="日期" fixed="left" align="center" prop="createTime" width="130"/>
            <el-table-column label="入库总计（折合2寸）" align="center" prop="rknum"/>
            <el-table-column label="B1" align="center">
              <el-table-column label="4寸" align="center" prop="b14"/>
              <el-table-column label="2寸" align="center" prop="b12"/>
              <el-table-column label="合计" align="center" prop="b1"/>
              <el-table-column label="占比" align="center" prop="b1zb">
                <template slot-scope="scope">
                  {{ scope.row.b1zb }}
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="B2" align="center">
              <el-table-column label="4寸" align="center" prop="b24"/>
              <el-table-column label="2寸" align="center" prop="b22"/>
              <el-table-column label="合计" align="center" prop="b2"/>
              <el-table-column label="占比" align="center" prop="b2zb">
                <template slot-scope="scope">
                  {{ scope.row.b2zb }}
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="B3" align="center">
              <el-table-column label="4寸" align="center" prop="b34"/>
              <el-table-column label="2寸" align="center" prop="b32"/>
              <el-table-column label="合计" align="center" prop="b3"/>
              <el-table-column label="占比" align="center" prop="b3zb">
                <template slot-scope="scope">
                  {{ scope.row.b3zb }}
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="B4" align="center">
              <el-table-column label="4寸" align="center" prop="b44"/>
              <el-table-column label="2寸" align="center" prop="b42"/>
              <el-table-column label="合计" align="center" prop="b4"/>
              <el-table-column label="占比" align="center" prop="b4zb">
                <template slot-scope="scope">
                  {{ scope.row.b4zb }}
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="B5" align="center">
              <el-table-column label="4寸" align="center" prop="b54"/>
              <el-table-column label="2寸" align="center" prop="b52"/>
              <el-table-column label="合计" align="center" prop="b5"/>
              <el-table-column label="占比" align="center" prop="b5zb">
                <template slot-scope="scope">
                  {{ scope.row.b5zb }}
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="B6" align="center">
              <el-table-column label="4寸" align="center" prop="b64"/>
              <el-table-column label="2寸" align="center" prop="b62"/>
              <el-table-column label="合计" align="center" prop="b6"/>
              <el-table-column label="占比" align="center" prop="b6zb">
                <template slot-scope="scope">
                  {{ scope.row.b6zb }}
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="B7" align="center">
              <el-table-column label="4寸" align="center" prop="b74"/>
              <el-table-column label="2寸" align="center" prop="b72"/>
              <el-table-column label="合计" align="center" prop="b7"/>
              <el-table-column label="占比" align="center" prop="b7zb">
                <template slot-scope="scope">
                  {{ scope.row.b7zb }}
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="B8" align="center">
              <el-table-column label="4寸" align="center" prop="b84"/>
              <el-table-column label="2寸" align="center" prop="b82"/>
              <el-table-column label="合计" align="center" prop="b8"/>
              <el-table-column label="占比" align="center" prop="b8zb">
                <template slot-scope="scope">
                  {{ scope.row.b8zb }}
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="其他" align="center">
              <el-table-column label="4寸" align="center" prop="qt4"/>
              <el-table-column label="2寸" align="center" prop="qt2"/>
              <el-table-column label="合计" align="center" prop="qt"/>
              <el-table-column label="占比" align="center" prop="blt">
                <template slot-scope="scope">
                  {{ scope.row.qtzb }}
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="外观副品总数" align="center" prop="fpnum"/>
            <el-table-column label="副品占比" align="center" prop="fpzb">
              <template slot-scope="scope">
                {{ scope.row.fpzb }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .app-container>>> .cell{
    line-height: 37px;
  }
  .app-container>>> td{
    height: 37px;
  }
  .padding-dialog>>> .cell{
    line-height: 30px;
  }
  .padding-dialog>>> td{
    height: 30px;
  }
  .padding-dialog>>> .el-dialog__footer{
    text-align: center;
  }
  .view-progress>>> .cell{
    line-height: 35px !important;
  }
  .view-progress>>> .td{
    height: 35px;
  }
  .input-title{
    width: 65px;
  }
  .input-item{
    float: left;
    margin-right: 10px;
    margin-top: 15px;
  }
  .search-input{
    width: 150px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 203px);
  }
  .import-dialog>>>.el-dialog__body{
    padding: 20px;
    padding-top: 10px;
  }
  .tab-control span{
    line-height: 20px;
  }
  .el-checkbox {
    margin-left: 0px;
  }
  .header-search-add >>>.el-input--prefix .el-input__inner {
    padding-left: 28px;
    padding-right: 18px;
  }
  .app-container>>> .el-checkbox{
    margin-left: 20px;
    display: block;
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
  /*.broad-scrollbar-table>>> .el-table__fixed, .broad-scrollbar-table>>> .el-table__fixed-right{*/
    /*background: #fff;*/
    /*height: calc(100% - 16px) !important;*/
  /*}*/
  .broad-scrollbar-table>>> .is-scrolling-none +.el-table__fixed,
  .broad-scrollbar-table>>> .is-scrolling-none +.el-table__fixed +.el-table__fixed-right {
    height: 100% !important;
  }
  .proce-box{
    display: flex;
    flex-direction: row;
  }
  .proce-left{
    flex-grow: 1;
  }
  .proce-right{
    width: 200px;
    flex-shrink: 0;
  }
  .proce-input{
    width: 200px;
  }
  .has-margin-top{
    margin-top: 15px;
  }
  .btn-group{
    position: absolute;
    bottom: 15px;
    right: 15px;
  }
  .option-items{
    float: left;
    width: 350px;
    height: 40px;
  }
  .option-items-dialog{
    display: inline-block;
    width: 280px;
  }
  .option-title{
    display: inline-block;
    width: 85px;
    text-align: right;
    font-weight: bold;
  }
  .proceCardType{
    font-size: 26px;
    vertical-align: sub;
    margin-bottom: 18px;
    color: #009494;
    font-weight: bold;
  }
  .color-title{
    display: inline-block;
    width: 60px;
    margin: 2px 0;
    line-height: 20px;
  }
  .model-box{
    margin-left: 60px;
    line-height: 25px;
    word-wrap: break-word;
    overflow: hidden;
  }
  .model-item{
    float: left;
    margin-left: 10px;
  }
  .abnormal-process-table>>> td{
    background: #f9ebeb;
  }
  .dialog-table>>>.el-input.is-disabled .el-input__inner {
    background-color: transparent;
    border-color: transparent;
    color: #666;
    cursor: default;
    text-align: center;
  }
  .dialog-table>>>.el-input.is-disabled .el-input__icon{
    display: none;
  }
  .has-bancground{
    background: rgba(181, 184, 218, 0.84);
    height: 41px;
  }
  .has-height{
    height: 41px;
  }
  .padding-dialog>>> .el-dialog__body {
    height: 640px;
    overflow: auto;
  }
  .has-margin-right{
    margin-right: 51%;
  }
  .input-container{
    padding: 10px;
    border: 1px solid #b2dfdf;
    padding-right: 0;
    background: #edf7f7;
    margin-top: 0;
    margin-bottom: 15px;
  }
  .input-container .input-title{
    width: 85px;
    font-weight: bold;
    text-align: right;
    font-size: 18px;
  }
  .tab-control span{
    width: 90px;
    line-height: 20px;
    padding-bottom: 5px;
  }
  .tab-control{
    margin-bottom: 5px;
  }
  .tab-control span+span{
    width: 90px;
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
  .primarya{
    color:#009494;
    cursor: pointer;
  }
  .treesty{
    height: 200px;
    overflow: auto;
    border: 1px solid rgb(229, 229, 229);
    padding-top: 5px;
    padding-left: 5px;
    margin-left: 70px;
    position: absolute;
    z-index: 99;
    width: 200px;
    background: #fff;
    border-radius: 3px;
    margin-top: 10px;
  }
  .treesty1{
    position: absolute;
    margin-left: 87px;
    z-index: 999;
    height: 10px;
    width: 10px;
    background: #fff;
    transform: rotate(45deg);
    border-left: 1px solid #e5e5e5;
    border-top: 1px solid #e5e5e5;
    margin-top: 5px;
  }
  .broad-scrollbar-table>>>.el-table__fixed-right {
    height: calc(100vh - 227px) !important;
  }
  .broad-scrollbar-table>>>.el-table__fixed-body-wrapper {
    height: calc(100vh - 629px) !important;
  }
  .broad-scrollbar-table1>>>.el-table__fixed {
    height: calc(100vh - 604px) !important;
  }
  .broad-scrollbar-table1>>>.el-table__fixed-body-wrapper {
    height: calc(100vh - 677px) !important;
  }
  .buttonTypechuli {
    background: #FFB800;
    border-color:#FFB800;
    color: #fff;
    font-size: 12px;
  }
  .bords{
    border-left: 3px solid #009494;
    padding-left: 10px;
    font-size: 14px;
    font-weight: bold;
  }
  .tits{
    border-bottom: 1px solid #e5e5e5;
    padding-bottom: 7px;
    margin-bottom: 15px;
    margin-top:15px;
  }
  .stepsuccess >>> .is-finish {
    color: #009494;
    border-color: #009494;
  }
  .stepsuccess >>> .el-step__title{
    font-weight: bold;
    font-size: 14px;
  }
  .stepsuccess >>> .el-step__description{
    font-size: 14px;
  }
  .stepready >>> .is-finish {
    color: #ED7D31;
    border-color: #ED7D31;
  }
  .stepready >>> .el-step__title{
    font-weight: bold;
    font-size: 14px;
  }
  .stepready >>> .el-step__description{
    font-size: 14px;
  }
  .stepnone >>> .is-process {
    color: #666;
    border-color: #666;
  }
  .stepnone >>> .el-step__title{
    font-weight: bold;
    font-size: 14px;
  }
  .stepnone >>> .el-step__description{
    font-size: 14px;
  }
  .stepnone >>> .is-wait {
    color: #666;
    border-color: #666;
  }
  .stepsuccess >>> .el-step__line-inner {
    border-width: 3px !important;
  }
  .stepsuccess >>> .el-step__line-inner:after{
    display: block;
    content: '';
    border-width: 8px 23px 8px 8px;
    border-style: solid;
    border-color: transparent #009494 transparent transparent;
    position: absolute;
    transform: rotate(178deg);
    left: 273px;
    top: -5px;
  }
  .stepsuccess >>> .el-step__line{
    padding-right: 27px;
    background-color:transparent;
  }
  .stepready >>> .el-step__line{
    background-color: #C0C4CC;
    height: 6px;
    margin-right: 27px !important;
  }
  .stepready >>> .el-step__line-inner:after{
    display: block;
    content: '';
    border-width: 8px 23px 8px 8px;
    border-style: solid;
    border-color: transparent #C0C4CC transparent transparent;
    position: absolute;
    transform: rotate(178deg);
    left: 273px;
    top: -5px;
  }
  .stepnone >>> .el-step__line {
    background-color: #C0C4CC;
    height: 6px;
    margin-right: 27px !important;
  }
  .stepnone >>> .el-step__line-inner:after{
    display: block;
    content: '';
    border-width: 8px 23px 8px 8px;
    border-style: solid;
    border-color: transparent #C0C4CC transparent transparent;
    position: absolute;
    transform: rotate(178deg);
    left: 273px;
    top: -5px;
  }
  .sssf>>> .el-dialog__body {
    padding-bottom: 20px;
  }
  .marginAuto{
   display: flex;
   justify-content: center;
  }
</style>
