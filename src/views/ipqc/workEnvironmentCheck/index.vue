<template>
  <PageHeaderLayout >
    <el-row style="background: #fff;padding: 15px 0 0 0;">
      <el-col :span="24">
        <div class="tab-control" style="margin: 0 15px">
          <span
            :class="{activeTab: isActive === 0}"
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
        <div style="float: right;margin-top: -53px;margin-right: 15px;">
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
    <el-row style="padding-bottom: 5px;background: #fff;padding-left: 15px;">
      <el-col :span="14" class="titlemonth">
        <svg-icon icon-class="baobiaofenx" style="color:#009494"/> {{ yearNum }}年{{ monthNum }}月份加工环境检测推移图
      </el-col>
      <el-col :span="10" style="text-align: right;margin-bottom: 5px;">
        <el-button type="primary" class="bonst" size="small" @click="addCheckLog"><svg-icon icon-class="add" style="color:#009494"/> 新增检验结果</el-button>
        <el-button v-show="isShowMenu['ipqc-update']" type="primary" class="bonst" icon="el-icon-edit" size="small" @click="updateCheckLog"> 修改检验结果</el-button>
        <el-button type="primary" class="bonst" icon="el-icon-search" size="small" @click="findLog"> 查看数据源</el-button>
        <!-- <el-button type="primary" class="bonst" size="small" @click="exportAll(scope.row)"><svg-icon icon-class="import" style="color:#009494"/>  导出</el-button> -->
      </el-col>
    </el-row>
    <div class="app-container" style="padding-top: 0px;margin-top: -10px;">
      <div v-for="(it, index) in drawList" :key="index" class="module-container" style="margin-bottom: 10px;box-shadow:none">
        <div class="module-title" style="padding-left: 0px;">
          <div class="module-title-text">{{ it.title }}</div>
        </div>
        <div class="module-content" style="height: 300px;padding-left: 0px;padding-right: 0px;">
          <chart :id="'option'+index" :options="it.option" height="300px" width="100%"/>
        </div>
      </div>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible"
      top="60px"
      class="padding-dialog"
      title="新增检验结果"
      width="1100px">
      <el-row>
        <el-col :span="24">
          <span class="input-title margin-top">检验日期 </span>
          <el-date-picker
            v-model="nowDate"
            :picker-options="pickerOptionsStart"
            :editable="false"
            :disabled="true"
            class="search-input margin-top"
            style="width: 160px"
            size="small"
            type="date"
            placeholder="选择月份"
            value-format="timestamp"
          />
          <span class="input-title margin-top">班别 </span>
          <el-select v-model="classId" :disabled="true" class="search-input style-input" size="small" placeholder="请选择">
            <el-option
              v-for="item in classList"
              :key="item.id"
              :label="item.name"
              :value="item.name"/>
          </el-select>
          <!-- <el-button
            class="margin-top"
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="getNoAndCode">查 询</el-button> -->
        </el-col>
      </el-row>
      <div class="tab-control" style="margin-top: 10px;">
        <span v-for="(item, key, index) in tabList" v-show="key !== 'undefined'" :key="index" :class="{activeTab:isActivetab === key}" @click="findTab(key)">
          {{ key }}
        </span>
      </div>
      <el-table
        v-loading="listLoading"
        :data="tabList[isActivetab]"
        class="view-progress"
        height="350px"
        element-loading-text="拼命加载中"
        border
        fit
        stripe>
        <el-table-column label="质控点" align="center" prop="pointName"/>
        <el-table-column label="信息" align="center">
          <template slot-scope="scope">
            <el-input v-if="isActive === 0" v-model="scope.row.result" class="search-input" style="width:90%" placeholder="" size="small" maxlength="4" clearable @blur="checkIsNum(scope.row)"/>
            <el-input v-if="isActive === 1" v-model="scope.row.result" class="search-input" style="width:90%" placeholder="" size="small" maxlength="5" clearable @blur="checkIsNum(scope.row)"/>
            <el-input v-if="isActive === 2" v-model="scope.row.result" class="search-input" style="width:20%;margin-left:15px;float:left;margin-right:5px" placeholder="" size="small" maxlength="8" clearable @blur="checkIsNum(scope.row)"/>
            <span v-if="isActive === 2" style="float:left"> * 28.3</span><span v-if="isActive === 2&&scope.row.result !== ''" style="float:left">= {{ (parseFloat(scope.row.result+'')*28.3).toFixed(1) }}</span>
            <span v-if="isActive === 0">℃</span>
            <span v-if="isActive === 1">%</span>
            <el-input v-if="isActive === 2" v-model="scope.row.resultTwo" class="search-input" style="width:20%;margin-left:15px;float:left;margin-right:5px" placeholder="" size="small" maxlength="8" clearable @blur="checkIsNum(scope.row)"/>
            <span v-if="isActive === 2" style="float:left"> * 28.3</span><span v-if="isActive === 2&&scope.row.resultTwo !== ''" style="float:left">= {{ (parseFloat(scope.row.resultTwo+'')*28.3).toFixed(1) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer" style="text-align:right;width:100%">
        <el-button type="primary" @click="save">确 定</el-button>
        <el-button type="primary" @click="addDialogVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      top="60px"
      class="padding-dialog"
      title="修改检验结果"
      width="1100px">
      <el-row>
        <el-col :span="24">
          <span class="input-title margin-top">检验日期 </span>
          <el-date-picker
            v-model="nowDate"
            :picker-options="pickerOptionsStart"
            :editable="false"
            class="search-input margin-top"
            style="width: 160px"
            size="small"
            type="date"
            placeholder="选择月份"
            value-format="timestamp"
            @change="getNoAndCode"
          />
          <span class="input-title margin-top">班别 </span>
          <el-select v-model="classId" class="search-input style-input" size="small" placeholder="请选择" filterable @change="getNoAndCode">
            <el-option
              v-for="item in classList"
              :key="item.id"
              :label="item.name"
              :value="item.name"/>
          </el-select>
          <!-- <el-button
            class="margin-top"
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="getNoAndCode">查 询</el-button> -->
        </el-col>
      </el-row>
      <div class="tab-control" style="margin-top: 10px;">
        <span v-for="(item, key, index) in tabList" v-show="key !== 'undefined'" :key="index" :class="{activeTab:isActivetab === key}" @click="findTab(key)">
          {{ key }}
        </span>
      </div>
      <el-table
        v-loading="listLoading"
        :data="tabList[isActivetab]"
        class="view-progress"
        height="350px"
        element-loading-text="拼命加载中"
        border
        fit
        stripe>
        <el-table-column label="质控点" align="center" prop="pointName"/>
        <el-table-column label="信息" align="center">
          <template slot-scope="scope">
            <el-input v-if="isActive === 0" v-model="scope.row.result" class="search-input" style="width:90%;" placeholder="" size="small" maxlength="4" clearable @blur="checkIsNum(scope.row)"/>
            <el-input v-if="isActive === 1" v-model="scope.row.result" class="search-input" style="width:90%;" placeholder="" size="small" maxlength="5" clearable @blur="checkIsNum(scope.row)"/>
            <el-input v-if="isActive === 2" v-model="scope.row.result" class="search-input" style="width:20%;margin-left:15px;float:left;margin-right:5px" placeholder="" size="small" maxlength="8" clearable @blur="checkIsNum(scope.row)"/>
            <span v-if="isActive === 2" style="float:left"> * 28.3</span><span v-if="isActive === 2&&scope.row.result !== ''" style="float:left">= {{ (parseFloat(scope.row.result+'')*28.3).toFixed(1) }}</span>
            <span v-if="isActive === 0">℃</span>
            <span v-if="isActive === 1">%</span>
            <el-input v-if="isActive === 2" v-model="scope.row.resultTwo" class="search-input" style="width:20%;margin-left:15px;float:left;margin-right:5px" placeholder="" size="small" maxlength="8" clearable @blur="checkIsNum(scope.row)"/>
            <span v-if="isActive === 2" style="float:left"> * 28.3</span><span v-if="isActive === 2&&scope.row.resultTwo !== ''" style="float:left">= {{ (parseFloat(scope.row.resultTwo+'')*28.3).toFixed(1) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer" style="text-align:right;width:100%">
        <el-button type="primary" @click="save">确 定</el-button>
        <el-button type="primary" @click="editDialogVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
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
  .broad-scrollbar-table>>> .is-scrolling-none +.el-table__fixed,
  .broad-scrollbar-table>>> .is-scrolling-none +.el-table__fixed +.el-table__fixed-right {
    height: 100% !important;
  }
  .broad-scrollbar-table>>>.el-table__fixed {
    height: calc(100vh - 287px) !important;
  }
  .broad-scrollbar-table>>>.el-table__fixed-body-wrapper {
    height: calc(100vh - 372px) !important;
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
    margin-top: 10px;
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
</style>
