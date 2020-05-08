<template>
  <PageHeaderLayout :has_back="true">
    <el-row style="background: #fff;padding: 15px 0 0 0;">
      <el-col :span="24">
        <div class="tab-control" style="margin-top: -10px;">
          <span
            :class="{activeTab: isActive === 0}"
            style="margin-left: 15px;"
            @click="navClick(0)"
          >温度</span>
          <span
            :class="{activeTab: isActive === 1}"
            class="has-margin-left"
            @click="navClick(1)"
          >湿度</span>
          <span
            :class="{activeTab: isActive === 2}"
            class="has-margin-left"
            @click="navClick(2)"
          >洁净度</span>
        </div>
        <div style="float: right;margin-top: -57px;margin-right: 15px;">
          <span class="input-title margin-top">选择月份 </span>
          <el-date-picker
            v-model="checkDate"
            :picker-options="pickerOptionsStart"
            :editable="false"
            class="search-input margin-top"
            size="small"
            type="month"
            placeholder="选择月份"
            value-format="timestamp"
          />
          <el-button
            class="margin-top"
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="searchInfo" >查 询</el-button>
        </div>
      </el-col>
    </el-row>
    <div class="app-container">
      <el-row style="padding-bottom: 5px;background: #fff;padding-left: 15px;">
        <el-col :span="14" class="titlemonth">
          <svg-icon icon-class="baobiaofenx" style="color:#009494"/> {{ yearNum }}年{{ monthNum }}月份加工环境检测数据表
        </el-col>
        <el-col :span="10" style="text-align: right;margin-bottom: 5px;">
          <el-button type="primary" class="bonst" size="small" @click="exportAll()"><svg-icon icon-class="export" style="color:#009494"/>  导出</el-button>
        </el-col>
      </el-row>
      <el-table
        v-loading="listLoading"
        v-if="isActive === 2"
        :data="list"
        :span-method="objectSpanMethods"
        class="broad-scrollbar-table abs"
        height="calc(100vh - 227px)"
        element-loading-text="拼命加载中"
        border
        fit
        stripe>
        <el-table-column align="center" label="站别" fixed>
          <el-table-column align="center" label="车间" fixed prop="workshop" width="150px"/>
          <el-table-column align="center" label="质控点" fixed prop="point" width="150px"/>
        </el-table-column>
        <el-table-column align="center" label="洁净度控制线" fixed>
          <el-table-column align="center" label="UCL" fixed prop="ucl" width="120px"/>
        </el-table-column>
        <el-table-column v-for="(item,key,index) in dateList" :key="index" :label="key" align="center">
          <el-table-column v-for="(items,keys) in item" :key="keys" :label="items.label" align="center">
            <template slot-scope="scope">
              <span v-if="keys===0">{{ scope.row.detailList[index].result0 }}</span>
              <span v-if="keys===1">{{ scope.row.detailList[index].resultTwo0 }}</span>
              <span v-if="keys===2">{{ scope.row.detailList[index].result1 }}</span>
              <span v-if="keys===3">{{ scope.row.detailList[index].resultTwo1 }}</span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <el-table
        v-loading="listLoading"
        v-if="isActive === 1"
        :data="list"
        :span-method="objectSpanMethods"
        class="broad-scrollbar-table abss"
        height="calc(100vh - 227px)"
        element-loading-text="拼命加载中"
        border
        fit
        stripe>
        <el-table-column align="center" label="站别" fixed>
          <el-table-column align="center" label="车间" fixed prop="workshop" width="150px"/>
          <el-table-column align="center" label="质控点" fixed prop="point" width="150px"/>
        </el-table-column>
        <el-table-column align="center" label="湿度控制线" fixed>
          <el-table-column align="center" label="LCL" fixed prop="lcl"/>
          <el-table-column align="center" label="UCL" fixed prop="ucl"/>
        </el-table-column>
        <el-table-column v-for="(item,key,index) in dateList" :key="index" :label="key" align="center">
          <el-table-column v-for="(items,keys) in item" :key="keys" :label="items.label" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.detailList[index]['result'+keys] }}</span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <el-table
        v-loading="listLoading"
        v-if="isActive === 0"
        :data="list"
        :span-method="objectSpanMethods"
        class="broad-scrollbar-table abss"
        height="calc(100vh - 227px)"
        element-loading-text="拼命加载中"
        border
        fit
        stripe>
        <el-table-column align="center" label="站别" fixed>
          <el-table-column align="center" label="车间" fixed prop="workshop" width="150px"/>
          <el-table-column align="center" label="质控点" fixed prop="point" width="150px"/>
        </el-table-column>
        <el-table-column align="center" label="温度控制线" fixed>
          <el-table-column align="center" label="LCL" fixed prop="lcl"/>
          <el-table-column align="center" label="UCL" fixed prop="ucl"/>
        </el-table-column>
        <el-table-column v-for="(item,key,index) in dateList" :key="index" :label="key" align="center">
          <el-table-column v-for="(items,keys) in item" :key="keys" :label="items.label" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.detailList[index]['result'+keys] }}</span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
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
    margin-top: 14px;
    margin-right: 10px;
  }
  .search-input{
    width: 130px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 178px);
    -webkit-box-shadow: none;
    box-shadow: none;
  }
  .import-dialog>>>.el-dialog__body{
    padding: 20px;
    padding-top: 10px;
  }
  .view-progress>>>.el-table__body .el-radio{
    margin-right: 10px;
  }
  .view-progress>>>.el-table__body .el-radio__label{
    padding-left: 5px;
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
    margin-left: 25px;
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
  .abs>>> .is-scrolling-none +.el-table__fixed,
  .abs>>> .is-scrolling-none +.el-table__fixed +.el-table__fixed-right {
    height: 100% !important;
  }
  .abs>>>.el-table__fixed {
    height: calc(100vh - 241px) !important;
    width: 420px !important;
  }
  .abs>>>.el-table__fixed-body-wrapper {
    height: calc(100vh - 323px) !important;
  }

  .abss>>> .is-scrolling-none +.el-table__fixed,
  .abss>>> .is-scrolling-none +.el-table__fixed +.el-table__fixed-right {
    height: 100% !important;
  }
  .abss>>>.el-table__fixed {
    height: calc(100vh - 241px) !important;
    width: 460px !important;
  }
  .abss>>>.el-table__fixed-body-wrapper {
    height: calc(100vh - 323px) !important;
  }
  .module-title-text{
    margin-bottom: 10px;
    margin-top: 15px;
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
    float: left;
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
  .tab-control span{
    width: 90px;
    line-height: 30px;
    padding-bottom: 5px;
  }
  .tab-control span+span{
    width: 90px;
  }
  .titlemonth{
    font-size: 15px;
    font-weight: bold;
    padding-left: 5px;
  }
  .bonst{
    background: #fff;
    border: 0px;
    height: 20px;
    color: #494949;
    font-size: 14px;
    font-weight: bold;
  }
  .bonst >>> i{
    color:#009494;
  }
  .titleline{
    background:#fff;
    padding: 15px 15px 0 15px;
    border-bottom: 1px solid #e5e5e5;
  }
</style>
