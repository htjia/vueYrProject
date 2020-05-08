<template>
  <PageHeaderLayout>
    <div class="header-search-add height-auto">
      <el-row>
        <el-col :offset="18" style="margin-top: -15px;">
          <div class="input-item">
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
              @click="handleSearch" >查 询</el-button>
          </div>
          &nbsp;
        </el-col>
      </el-row>
    </div>
    <div class="header-search-add" style="height: 100px;padding: 0px;">
      <el-row>
        <el-col :span="6" class="sehrow" style="border-right: 5px solid #e5e5e5;">
          <el-row>
            <el-col :span="10" class="iconf">
              <svg-icon icon-class="waiyanhuizong"/>
            </el-col>
            <el-col :span="14" class="foncls">
              <div class="getfons">待目检总数量</div>
              <div class="fonsfont">{{ waitNum }}</div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6" class="sehrow" style="border-right: 5px solid #e5e5e5;border-left: 5px solid #e5e5e5;">
          <el-row>
            <el-col :span="10" class="iconf">
              <svg-icon icon-class="choujzsl"/>
            </el-col>
            <el-col :span="14" class="foncls">
              <div class="getfons">抽检总数量</div>
              <div class="fonsfont">{{ testNum }}</div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6" class="sehrow" style="border-right: 5px solid #e5e5e5;border-left: 5px solid #e5e5e5;">
          <el-row>
            <el-col :span="10" class="iconf">
              <svg-icon icon-class="wyzlgl"/>
            </el-col>
            <el-col :span="14" class="foncls">
              <div class="getfons">误判数</div>
              <div class="fonsfont">{{ errorNum }}</div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6" class="sehrow" style="border-left: 5px solid #e5e5e5;">
          <el-row>
            <el-col :span="10" class="iconf">
              <svg-icon icon-class="fenxi"/>
            </el-col>
            <el-col :span="14" class="foncls">
              <div class="getfons">误判比例</div>
              <div class="fonsfont">{{ rate }}%</div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div id="bottomhi" class="module-container" style="height: calc(100vh - 315px);margin-top: 10px;">
      <!-- 顶部的标题显示 -->
      <div class="module-title flex">
        <div class="module-title-text">{{ isChart? '目检误判率趋势图' :'外观误判明细' }}</div>
        <div class="right-btn-box">
          <el-button
            v-if="!isChart"
            class="float-right qhColor margin-left"
            size="mini"
            type="default"
            icon="el-icon-sold-out"
            @click="importExcel()"> 导出</el-button>
          <el-button
            class="float-right qhColor margin-left"
            size="mini"
            type="primary"
            @click="changeIsChart"
          ><svg-icon icon-class="daochu"/>切换视图</el-button>
        </div>
      </div>
      <div class="module-content flex coloum" style="height: auto">
        <!-- 是否图表 -->
        <div v-if="isChart" class="charts">
          <div class="charts-right">
            <div v-if="options.xAxis[0].data.length === 0" class="no-data">
              <svg-icon class="no-data-icon" icon-class="noData"/>
              <div>暂无数据</div>
            </div>
            <chart v-if="chartHeight !== 'px'" id="acplxtj" :options="options" :height="chartHeight" width="100%"/>
          </div>
        </div>
        <!-- 是表格 -->
        <div v-else class="chart-table">
          <el-table
            v-loading="listLoading"
            :data="tableList"
            height="calc(100vh - 435px)"
            class="run-table"
            element-loading-text="拼命加载中"
            highlight-current-row
            border
            fit>
            <el-table-column label="日期" fixed="left" align="center" prop="date" width="130"/>
            <el-table-column label="RUN ID" align="center" prop="runId"/>
            <el-table-column label="P0" align="center" prop="p0"/>
            <el-table-column label="P10" align="center" prop="p10"/>
            <el-table-column label="P30" align="center" prop="p30"/>
            <el-table-column label="P50" align="center" prop="p50"/>
            <el-table-column label="P100" align="center" prop="p100"/>
            <el-table-column label="P120" align="center" prop="p120"/>
            <el-table-column label="P200" align="center" prop="p200"/>
            <el-table-column label="P300" align="center" prop="p300"/>
            <el-table-column label="P360" align="center" prop="p360"/>
            <el-table-column label="R" align="center" prop="r"/>
            <el-table-column label="总数量" align="center" prop="waitNum"/>
            <el-table-column label="抽检数" align="center" prop="total"/>
            <el-table-column label="误判数" align="center" prop="errorNum"/>
            <el-table-column label="误判率" align="center" prop="rate"/>
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
      </div>
    </div>
  </PageHeaderLayout>
</template>

<script src="./visualInspectionWrongSta.js"></script>

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
    line-height: 50px;
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
    line-height: 30px;
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
    height: calc(100vh - 227px) !important;
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
  .iconf {
    font-size: 32px;
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    padding-top: 16px;
    padding-left: 40px;
  }
  .getfons {
    font-size: 16px;
    font-weight: bold;
    color: #666;
  }
  .foncls {
    font-size: 14px;
    padding-left: 15px;
    line-height: 35px;
  }
  .fonsfont {
    color:#e6a23c;
    font-weight: bold;
    font-size: 22px;
  }
  .sehrow {
    height: 100px;
    padding: 15px;
  }
</style>
