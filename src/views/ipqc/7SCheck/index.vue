<template>
  <PageHeaderLayout >
    <el-row style="background: #fff;padding: 15px 0 0 0;">
      <el-col :span="24">
        <div class="tab-control" style="margin-top: -10px;">
          <span
            v-for="item in projectcjList"
            :key="item.id"
            :class="{activeTab: isActive === item.id}"
            style="margin-left: 15px;"
            @click="navClick(item.id)"
          >{{ item.name }}</span>
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
    <div class="app-container">
      <el-row style="padding-bottom: 5px;margin-top: -15px;">
        <el-col :span="14" class="titlemonth">
          {{ yearNum }}年{{ monthNum }}月份7S检验记录
        </el-col>
        <el-col :span="10" style="text-align: right;margin-bottom: 5px;">
          <el-button type="primary" class="bonst" size="small" @click="addCheckLog"><svg-icon icon-class="add" style="color:#009494"/> 新增检验结果</el-button>
          <el-button v-show="isShowMenu['ipqc-update']" type="primary" class="bonst" icon="el-icon-edit" size="small" @click="updateCheckLog"> 修改检验结果</el-button>
          <el-button type="primary" class="bonst" size="small" @click="exportAll()"><svg-icon icon-class="export" style="color:#009494"/>  导出</el-button>
        </el-col>
      </el-row>
      <div style="width:100%;height:calc(100vh - 227px)">
        <pl-table
          v-loading="listLoading"
          v-if="dateList.length>0"
          :datas="list"
          :row-height="35"
          :span-method="objectSpanMethod"
          :cell-style="tableRowClassColor"
          class="broad-scrollbar-table"
          element-loading-text="拼命加载中"
          style="height:100%"
          border
          fit
          stripe
          header-drag-style
          use-virtual>
          <pl-table-column align="center" label="项目" fixed width="120px" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.category }}
            </template>
          </pl-table-column>
          <pl-table-column align="center" label="类别" fixed width="300px" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.item }}
            </template>
          </pl-table-column>
          <pl-table-column align="center" label="分数" fixed>
            <template slot-scope="scope">
              {{ scope.row.norm }}
            </template>
          </pl-table-column>
          <pl-table-column v-for="(item,index) in dateList" :key="index" :label="item.label" align="center">
            <pl-table-column label="是/否" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.detailList!==undefined&&scope.row.detailList.length>index">
                  <span v-if="scope.row.detailList[index].result === 0" style="color:#009494">
                    √
                  </span>
                  <span v-if="scope.row.detailList[index].result === 1" style="color:#E35C5C">
                    ×
                  </span>
                  <span v-if="scope.row.detailList[index].result === 2">
                    {{ scope.row.detailList[index].checkerName }}
                  </span>
                </span>
              </template>
            </pl-table-column>
            <pl-table-column label="得分" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.detailList!==undefined&&scope.row.detailList.length>index">
                  <span v-if="scope.row.detailList[index].result !== 1">
                    {{ scope.row.detailList[index].score }}
                  </span>
                  <el-tooltip v-if="scope.row.detailList[index].result === 1 && scope.row.detailList[index].remark!==null&&scope.row.detailList[index].remark!==''" placement="top">
                    <div slot="content">
                      <span class="table-tooltip-text">{{ scope.row.detailList[index].remark }}</span>
                    </div>
                    <div>{{ scope.row.detailList[index].score }}</div>
                  </el-tooltip>
                  <span v-if="scope.row.detailList[index].result === 1 && (scope.row.detailList[index].remark===null||scope.row.detailList[index].remark==='')">
                    {{ scope.row.detailList[index].score }}
                  </span>
                </span>
              </template>
            </pl-table-column>
          </pl-table-column>
        </pl-table>
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
      <div v-for="(item, key, index) in tabList" v-show="key !== 'undefined'" :key="index" >
        <el-table
          v-loading="listLoading"
          v-if="addDialogVisible && key === isActivetab"
          :data="tabList[key]"
          class="view-progress"
          height="350px"
          element-loading-text="拼命加载中"
          border
          fit
          stripe>
          <el-table-column label="考核项" align="center" prop="item" width="400"/>
          <el-table-column :render-header="renderHeader" label="检验" align="center">
            <template slot-scope="scope">
              <el-radio-group v-model="scope.row.result" @change="getScore(scope.row)">
                <el-radio :label="0">√</el-radio>
                <el-radio :label="1">×</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column label="信息" align="center" width="480">
            <template slot-scope="scope">
              <el-input v-model="scope.row.score" class="search-input" style="width:80px" placeholder="分数" size="small" maxlength="3" clearable @blur="setScore(scope.row)"/>
              <el-input v-model="scope.row.remark" class="search-input" style="width:360px" placeholder="请输入备注" size="small" maxlength="50" clearable/>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
        v-if="editDialogVisible"
        :data="tabList[isActivetab]"
        class="view-progress"
        height="350px"
        element-loading-text="拼命加载中"
        border
        fit
        stripe>
        <el-table-column label="考核项" align="center" prop="item" width="400"/>
        <el-table-column :render-header="renderHeader" label="检验" align="center">
          <template slot-scope="scope">
            <el-radio-group v-model="scope.row.result" @change="getScore(scope.row)">
              <el-radio :label="0">√</el-radio>
              <el-radio :label="1">×</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column label="信息" align="center" width="480">
          <template slot-scope="scope">
            <el-input v-model="scope.row.score" class="search-input" style="width:80px" placeholder="分数" size="small" maxlength="3" clearable @blur="setScore(scope.row)"/>
            <el-input v-model="scope.row.remark" class="search-input" style="width:360px" placeholder="请输入备注" size="small" maxlength="50" clearable/>
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
    height: calc(100vh - 240px) !important;
  }
  .broad-scrollbar-table>>>.el-table__fixed-body-wrapper {
    height: calc(100vh - 314px) !important;
  }
  .app-container>>> .el-table--scrollable-x{
    height: calc(100vh - 227px) !important;
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
  .titlemonth{
    font-size: 15px;
    font-weight: bold;
    border-left: 3px solid #009494;
    padding-left: 5px;
    margin-top: 9px;
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
  .bonst >>> i{
    color:#009494;
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
