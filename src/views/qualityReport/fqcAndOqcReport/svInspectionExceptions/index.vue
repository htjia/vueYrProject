<template>
  <PageHeaderLayout>
    <div class="header-search-add height-auto">
      <el-row>
        <el-col style="margin-top: -15px;">
          <div class="input-item">
            <span class="input-title" style="width:120px">选择目检判断原因 </span>
            <el-select v-model="reason" class="search-input" size="small" placeholder="请选择" filterable>
              <el-option
                v-for="item in reasonLists"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width:38px">尺寸 </span>
            <el-select v-model="substrate" class="search-input" style="width:90px;" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in substrateFindOptions"
                :key="item.id"
                :label="item.name"
                :value="item.name"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">按周查询 </span>
            <el-date-picker
              v-model="weekDate"
              :editable="false"
              class="search-input"
              style="width:140px"
              size="small"
              type="week"
              placeholder="按周查询"
              format="yyyy 第 WW 周"
            />
          </div>
          <div class="input-item" style="margin-top:22px">
            <el-checkbox v-model="isRun" style="margin-left: 10px;"/> 折合2寸
          </div>
          <div class="input-item">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-search"
              @click="handleSearch" >查 询</el-button>
          </div>
          <div class="input-item">
            <el-button
              class="float-right qhColor margin-left"
              size="small"
              type="primary"
              @click="changeIsChart"
            ><svg-icon icon-class="daochu"/> 切换视图</el-button>
          </div>
          &nbsp;
        </el-col>
      </el-row>
    </div>
    <el-row v-if="isChart">
      <el-col :span="12" style="background: #fff;border-right: 5px solid #e5e5e5;padding-bottom: 10px;">
        <div class="module-title flex module-titles">
          <div class="module-title-text"><span style="padding-left：15px">{{ reasonName }}</span> 每日占比趋势</div>
        </div>
        <div class="module-content" style="height: 200px;">
          <div v-if="!isChart" class="no-data">
            <svg-icon class="no-data-icon" icon-class="noData"/>
            <div>暂无数据</div>
          </div>
          <chart v-if="isChart" id="acplxtj1" :options="options1" height="200px" width="100%"/>
        </div>
      </el-col>
      <el-col :span="12" style="background: #fff;border-left: 5px solid #e5e5e5;padding-bottom: 10px;">
        <div class="module-title flex module-titles">
          <div class="module-title-text" style="padding-left：15px"><span style="padding-left：15px">{{ reasonName }}</span> 周趋势对比</div>
        </div>
        <div class="module-content" style="height: 200px;">
          <div v-if="!isChart" class="no-data">
            <svg-icon class="no-data-icon" icon-class="noData"/>
            <div>暂无数据</div>
          </div>
          <chart v-if="isChart" id="acplxtj2" :options="options2" height="200px" width="100%"/>
        </div>
      </el-col>
    </el-row>
    <div v-if="isChart" id="bottomhi" class="module-container" style="margin-top: 10px;height: calc(100vh - 465px);">
      <!-- 顶部的标题显示 -->
      <div class="module-title flex">
        <div class="module-title-text">{{ reasonName }}{{ isChart? '分布图' :'报表' }}</div>
        <div class="right-btn-box">
          <el-button type="text" class="select-thead-btn" style="right: 30px;float: right;" icon="el-icon-sold-out" @click="importExcel">导出</el-button>
        </div>
      </div>
      <div class="module-content flex coloum" style="height: auto">
        <!-- 是否图表 -->
        <div class="charts">
          <div class="charts-right">
            <chart v-if="chartHeight !== 'px'" id="acplxtj" :options="options" :height="chartHeight" width="100%"/>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!isChart" class="module-container" style="margin-top: 10px;height: calc(100vh - 203px);">
      <!-- 顶部的标题显示 -->
      <div class="module-title flex">
        <div class="module-title-text">{{ reasonName }}{{ isChart? '分布图' :'报表' }}</div>
        <div class="right-btn-box">
          <el-button type="text" class="select-thead-btn" style="right: 30px;float: right;" icon="el-icon-sold-out" @click="importExcel">导出</el-button>
        </div>
      </div>
      <div class="module-content flex coloum" style="height: auto">
        <!-- 是表格 -->
        <div class="chart-table">
          <el-table
            v-loading="listLoading"
            :data="tableList"
            height="calc(100vh - 275px)"
            class="broad-scrollbar-table"
            element-loading-text="拼命加载中"
            highlight-current-row
            border
            fit>
            <el-table-column label="机台" fixed="left" align="center" prop="machine" width="130"/>
            <el-table-column label="目检判断原因(片(比例))" align="center">
              <el-table-column v-for="(item, index) in reasonLists" :key="item.id" :label="item.name" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row['val' + index] }}
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="正常" fixed="right" align="center" prop="normal"/>
            <el-table-column label="生产数量" fixed="right" align="center" prop="total"/>
          </el-table>
        </div>
      </div>
    </div>
  </PageHeaderLayout>
</template>

<script src="./indexs.js"></script>

<style scoped>
  .app-container>>> .cell{
    line-height: 37px;
  }
  .module-titles {
    padding-left: 15px;
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
  .broad-scrollbar-table>>>.el-table__fixed +.el-table__fixed-right {
    height: calc(100vh - 289px) !important;
  }
  .broad-scrollbar-table>>>.el-table__fixed-body-wrapper {
    height: calc(100vh - 350px) !important;
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
    height: 30px;
    line-height: 30px;
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
    height: calc(100vh - 350px) !important;
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
