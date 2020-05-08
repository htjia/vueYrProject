<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 5px">
      <el-row>
        <el-col :span="14">
          <el-button type="primary" size="small" class="margin-top" @click="addCheckLog"><svg-icon icon-class="add"/> 新增检验结果</el-button>
          <el-button v-show="isShowMenu['ipqc-update']" type="primary" size="small" class="margin-top" icon="el-icon-edit" @click="updateCheckLog">修改检验结果</el-button>
        </el-col>
        <el-col :span="10" style="text-align:right">
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
        </el-col>
      </el-row>
    </div>
    <el-row class="titleline">
      <el-col :span="14" class="titlemonth">
        {{ yearNum }}年{{ monthNum }}月份外观镜检检验记录
      </el-col>
      <el-col :span="10" style="text-align: right;margin-bottom: 5px;">
        <el-button type="primary" class="bonst" size="mini" @click="exportAll()"><svg-icon icon-class="export" style="color:#009494"/>  导出</el-button>
      </el-col>
    </el-row>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        :span-method="objectSpanMethods"
        class="broad-scrollbar-table"
        height="calc(100vh - 275px)"
        element-loading-text="拼命加载中"
        border
        fit
        stripe>
        <el-table-column align="center" label="日期" fixed>
          <template slot-scope="scope">
            {{ scope.row.checkDate }}
          </template>
        </el-table-column>
        <el-table-column v-for="(item,index) in dateList" v-show="dateList.length>0" :key="index" :label="item" align="center">
          <el-table-column label="检验项目" align="center" width="220px" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row['name'+index] }}
            </template>
          </el-table-column>
          <el-table-column label="批次号" align="center" width="180px" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row['batchNo'+index] }}
            </template>
          </el-table-column>
          <el-table-column label="片数" align="center">
            <template slot-scope="scope">
              {{ scope.row['num'+index] }}
            </template>
          </el-table-column>
          <el-table-column label="结果" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row['result'+index] === 'NG'" style="color:#E35C5C">
                {{ scope.row['result'+index] }}
              </span>
              <span v-if="scope.row['result'+index] === 'OK'" style="color:#009494">
                {{ scope.row['result'+index] }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="QC" align="center">
            <template slot-scope="scope">
              {{ scope.row['checkerName'+index] }}
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center" width="200px" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row['remark'+index] }}
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible"
      top="60px"
      class="padding-dialog"
      title="新增检验结果"
      width="1200px">
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
      <el-table
        v-loading="listLoading"
        v-if="addDialogVisible"
        :data="setUpList"
        class="view-progress"
        style="margin-top:15px"
        height="400px"
        element-loading-text="拼命加载中"
        border
        fit
        stripe>
        <el-table-column label="镜检项目" align="center" prop="batchNo" width="650">
          <template slot-scope="scope">
            <el-select v-model="scope.row.normId" class="search-input style-input" style="width: 270px;" size="small" placeholder="请选择" filterable @change="setfi1">
              <el-option
                v-for="item in apperaLists"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                :disabled="item.disabled"/>
            </el-select>
            <svg-icon icon-class="tiaomasm" style="font-size: 20px;color:#009494"/>
            <el-input v-model="scope.row.batchNo" class="search-input" style="width:275px" placeholder="请扫描批次号" size="small" maxlength="20" clearable/>
            <el-input v-model="scope.row.num" class="search-input" style="width:70px" placeholder="片数" size="small" maxlength="2" clearable @blur="checkNums(scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column :render-header="renderHeader" label="检验" align="center">
          <template slot-scope="scope">
            <el-radio v-model="scope.row.result" label="0">OK</el-radio>
            <el-radio v-model="scope.row.result" label="1">NG</el-radio>
          </template>
        </el-table-column>
        <el-table-column label="信息" align="center" prop="batchNo" width="380">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark" class="search-input" style="width:370px" placeholder="请输入备注" size="small" maxlength="50" clearable/>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer" style="text-align:right">
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
      width="1200px">
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
      <el-table
        v-loading="listLoading"
        v-if="editDialogVisible"
        :data="setUpList"
        class="view-progress"
        style="margin-top:15px"
        height="400px"
        element-loading-text="拼命加载中"
        border
        fit
        stripe>
        <el-table-column label="镜检项目" align="center" prop="batchNo" width="650">
          <template slot-scope="scope">
            <el-select v-model="scope.row.normId" class="search-input style-input" style="width: 270px;" size="small" placeholder="请选择" filterable @change="setfi1">
              <el-option
                v-for="item in apperaLists"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                :disabled="item.disabled"/>
            </el-select>
            <svg-icon icon-class="tiaomasm" style="font-size: 20px;color:#009494"/>
            <el-input v-model="scope.row.batchNo" class="search-input" style="width:275px" placeholder="请扫描批次号" size="small" maxlength="20" clearable/>
            <el-input v-model="scope.row.num" class="search-input" style="width:70px" placeholder="片数" size="small" maxlength="2" clearable @blur="checkNums(scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column :render-header="renderHeader" label="检验" align="center">
          <template slot-scope="scope">
            <el-radio v-model="scope.row.result" label="0">OK</el-radio>
            <el-radio v-model="scope.row.result" label="1">NG</el-radio>
          </template>
        </el-table-column>
        <el-table-column label="信息" align="center" prop="batchNo" width="380">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark" class="search-input" style="width:370px" placeholder="请输入备注" size="small" maxlength="50" clearable/>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer" style="text-align:right">
        <el-button type="primary" @click="save">确 定</el-button>
        <el-button type="primary" @click="editDialogVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
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
    margin-top: 14px;
    margin-right: 10px;
  }
  .search-input{
    width: 130px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 245px);
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
  /*.broad-scrollbar-table>>> .el-table__fixed, .broad-scrollbar-table>>> .el-table__fixed-right{*/
    /*background: #fff;*/
    /*height: calc(100% - 16px) !important;*/
  /*}*/
  .broad-scrollbar-table>>> .is-scrolling-none +.el-table__fixed,
  .broad-scrollbar-table>>> .is-scrolling-none +.el-table__fixed +.el-table__fixed-right {
    height: 100% !important;
  }
  .broad-scrollbar-table>>>.el-table__fixed {
    height: calc(100vh - 288px) !important;
  }
  .broad-scrollbar-table>>>.el-table__fixed-body-wrapper {
    height: calc(100vh - 366px) !important;
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
  .titlemonth{
    font-size: 15px;
    font-weight: bold;
    border-left: 3px solid #009494;
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
  .titleline{
    background:#fff;
    padding: 15px 15px 0 15px;
    border-bottom: 1px solid #e5e5e5;
  }
</style>
