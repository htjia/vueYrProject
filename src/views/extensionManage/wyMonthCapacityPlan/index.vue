<template>
  <PageHeaderLayout>
    <div class="header-search-add height-auto">
      <div class="header-btn-group" style="height: 35px;border:0px;display: flex">
        <div>
          <span style="width:35px" class="input-title">产品</span>
          <el-select v-model="produce" style="width:178px" multiple collapse-tags class="search-input" size="small" placeholder="请选择" filterable>
            <el-option
              v-for="(item,index) in productOptions"
              :key="index"
              :label="item.productName"
              :value="item.productName"/>
          </el-select>
        </div>
        <div class="margin-left">
          <span class="input-title" style="width:35px">月份 </span>
          <el-date-picker
            v-model="month"
            :editable="false"
            class="search-input"
            size="small"
            type="month"
            placeholder="选择月份"
            value-format="yyyy-MM"
          />
        </div>
        <div class="input-item" style="margin-top: 0">
          <el-button
            class="float-right margin-left"
            size="small"
            type="danger"
            @click="clearCondition"
          >
            <svg-icon icon-class="clear"/> 重 置
          </el-button>
          <el-button
            class="float-right"
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="searchData" >查 询</el-button>
        </div>
      </div>
    </div>
    <div class="setkuai">
      <div class="module-title-text">入库进度</div>
      <div class="setvalue edit-dialog">
        <el-row>
          <el-col :span="24">
            <div class="production">
              <p/><span style="margin-right: 30px;">已入库</span>
              <p/><span>剩余入库</span>
            </div>
          </el-col>
        </el-row>
        <el-row class="mt15">
          <el-col :span="24">
            <div class="set-content">
              <div style="left: 45%; color: #494949;" class="set-content-item" >
                {{ wyNoRate + '% ' + '(' + wyRealNo + '/' + wyPlanNo + '片)' }}
              </div>
            </div>
            <el-progress :show-text="false" :stroke-width="20" :percentage="wyNoRate" color="#1ABC9C"/>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="app-container mt10">
      <div class="flex_module">
        <div class="module-title-text">月度产能规划表</div>
        <div class="mt10">
          <el-button
            size="mini"
            type="primary"
            style="float: right;margin-bottom:10px;margin-right: 15px"
            @click="changeLog">
            <svg-icon icon-class="lishibb"/>
            变更日志
          </el-button>
        </div>
      </div>
      <div style="padding:0 15px;border-top: 2px solid #009494">
        <!--外延列表-->
        <el-table
          v-loading="listLoading"
          ref="listTabel"
          :data="list"
          :row-style="cancelRowStyle"
          class="plan-table run-table"
          element-loading-text="拼命加载中"
          height="calc(100vh - 395px)"
          highlight-current-row
          border
          fit>
          <el-table-column align="center" label="序号" width="100">
            <template slot-scope="scope">
              {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
            </template>
          </el-table-column>
          <el-table-column label="产品" align="center" prop="produce" width="250"/>
          <el-table-column label="实际入库(片)" align="center" prop="realNum" width="250"/>
          <el-table-column label="计划入库(片)" align="center" prop="planNo" width="250">
            <template slot-scope="scope">
              <div v-if="scope.row.wyPlanChange.length > 0">{{ scope.row.planNo }}</div>
              <el-tooltip v-if="scope.row.wyPlanChange.length > 0" placement="top-start">
                <div slot="content">
                  <p>变动记录</p>
                  <p v-for="item in scope.row.wyPlanChange" :key="item.createTime">
                    <span v-if="item.changeNum > 0">{{ item.createTime + ' (+' + item.changeNum + ') ' + item.newNo + '片' + ' ' +item.creatorName }}</span>
                    <span v-if="item.changeNum < 0">{{ item.createTime + ' (' + item.changeNum + ') ' + item.newNo + '片' + ' ' +item.creatorName }}</span>
                  </p>
                </div>
                <i class="change-tip-icon">!</i>
              </el-tooltip>
              <div v-if="scope.row.wyPlanChange.length === 0">{{ scope.row.planNo }}</div>
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip="" width="500"/>
          <el-table-column label="计划状态" align="center" prop="status">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 0" style="color: #009494;font-weight: bold">正常投产</span>
              <span v-if="scope.row.status === 1" style="color: #f33;font-weight: bold">取消投产</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- <el-pagination
          :current-page="pageNum"
          :page-sizes="[12, 30, 40]"
          :page-size="pageSize"
          :total="totalPage"
          class="pagination"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="sizeChange"
        /> -->
      </div>
    </div>
    <!--变更日志-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="updateDialogVisible"
      title="变更日志"
      width="550px">
      <div v-if="changeWyLogList.length === 0" style="height: 100px;line-height:65px;text-align: center; font-size: 16px; color: #666;font-weight: bold">
        暂无变更
      </div>
      <div class="logWyDiv">
        <div v-for="(item, index) in changeWyLogList" :key="index" class="logItem">
          <h3 class="logTittle">
            <span class="titlePoint"/>
            {{ item.createTime + ' 变更' + ' (' + item.creatorName + ')' }}
          </h3>
          <el-collapse v-model="activeLog">
            <el-collapse-item :title="item.produce+ ' -------------------- ' + '计划投片 ' + item.changeNum + '片'" :name="index + 1" :style="{'padding-left':'10px'}">
              <div v-if="item.oldNo !== item.newNo" style="margin-left: 10%">{{ '计划投片 ' + item.oldNo + '片' + ' > > ' + item.newNo + '片' }}
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./monthCapacity.js"></script>

<style scoped>
  .caddbt {
    position: absolute;
    z-index: 15;
    margin-top: 10px;
    margin-left: 48%;
  }

  .dialogBtn {
    margin-top: -25px;
    margin-bottom: 10px;
    border-bottom: 1px solid #e5e5e5;
    padding-bottom: 10px;
  }

  .addBtn {
    font-size: 30px;
    color: #009494;
    cursor: pointer;
    vertical-align: middle;
  }

  .setbet {
    font-weight: bold;
    text-align: center;
    margin-top: 2px;
  }

  .setbet1 {
    font-weight: bold;
    text-align: center;
    margin-top: 2px;
  }

  .set-content {
    position: relative;
    width: 100%;
    text-align: right;
    font-weight: bold;
    color: #1ABC9C;
  }

  .set-content-item {
    position: absolute;
    bottom: -18px;
    z-index: 10;
  }

  .fieldest {
    border: 1px solid #DCDFE6;
    padding-bottom: 15px;
  }

  .legendsty {
    padding-left: 8px;
    padding-right: 8px;
    font-weight: bold;
  }

  .tip-out-inner-dialog >>> .el-checkbox {
    margin-left: 20px;
  }
  .normalReasom {
    border: 0px;
    color: #009494;
    cursor: pointer;
  }

  .normalReasom:hover {
    color: #009688;
  }

  .firstRow {
    padding-bottom: 15px;
    margin-bottom: 15px;
    border-bottom: 1px solid #DCDFE6;
  }

  .setTree {
    padding: 15px;
    border: 1px solid #DCDFE6;
    margin-top: 15px;
    height: 425px;
    overflow: auto;
  }

  .getCalss {
    padding: 15px;
  }

  .setInner {
    padding: 10px;
    color: #333;
  }

  .buttonType {
    background: #1abb9d;
    color: #fff;
    font-size: 16px;
  }

  .buttonType1 {
    font-size: 15px;
    float: right;
    height: 35px;
    border: 0px;
    padding: 0;
    margin-right: 15px;
    color: #009494;
  }

  .buttonType1:hover {
    color: #009688;
    background-color: #fff;
  }

  .leftType {
    float: left;
    height: 35px;
    margin-left: 15px;
    padding-top: 8px;
    margin-right: 15px;
  }

  .spanColor {
    font-size: 16px;
    font-weight: bold;
    margin-right: 15px;
  }

  .tableTitle {
    width: 100%;
    font-weight: bold;
    font-size: 15px;
    padding-left: 30px;
    margin-bottom: -15px;
    z-index: 99;
    position: relative;
  }

  .input-title {
    width: 65px;
    line-height: 30px;
  }

  .setTitle {
    background: #fff;
    width: 85px;
    text-align: center;
  }

  .set-border {
    border: 1px solid #DCDFE6;
    margin: 5px;
    height: 650px;
    padding: 20px 10px 10px 10px;
  }

  .set-borders {
    border: 1px solid #DCDFE6;
    margin: 5px;
    padding: 20px 10px 10px 10px;
  }

  .input-item {
    float: left;
    margin-top: 14px;
    margin-right: 10px;
  }

  .search-box {
    display: flex;
    flex-direction: row;
  }

  .left-search-box {
    flex-grow: 1;
  }

  .right-btn-box {
    width: 210px;
  }

  .search-input {
    width: 155px;
  }

  .app-container {
    position: relative;
    height: calc(100vh - 330px);
    padding: 0;
  }

  .checkstr {
    word-wrap: break-word;
    word-break: break-all;
    overflow: auto;
    line-height: 25px;
    height: 350px;
  }

  .parameter-table >>> .el-table .set_green td {
    background-color: #E35C5C;
    color: #fff;
  }

  .statuType {
    text-align: center;
    font-size: 30px;
    padding: 15px;
    color: #009494;
    font-weight: bold;
    border-bottom: 1px solid #E5E5E5;
  }

  .statuType1 {
    text-align: center;
    font-size: 30px;
    padding: 15px;
    color: #E35C5C;
    font-weight: bold;
    border-bottom: 1px solid #E5E5E5;
  }

  .run-table ::-webkit-scrollbar { /*滚动条整体样式*/
    height: 12px !important;
  }

  .app-container >>> .el-table--border {
    border-top: 2px solid #009494;
  }

  .tip-out-inner-dialog >>> .el-dialog__body {
    padding: 15px;
    padding-top: 25px;
    padding-bottom: 50px;
  }
  .setkuai {
    background: #ffffff;
  }

  .setvalue {
    padding: 8px 15px 15px 15px;
  }

  .module-title-text {
    color: #666;
    font-size: 14px;
    font-weight: bold;
    float: none;
    padding: 10px 15px;
    border-bottom: 1px solid #e5e5e5;
  }
  .flex_module {
    display: flex;
    justify-content: space-between;
  }

  .mt10 {
    margin-top: 10px;
  }

  .mt15 {
    margin-top: 15px;
  }
 .setvalue>>> .el-progress-bar__outer {
    background: #e5e5e5;
  }
  .production {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .production p {
    width: 32px;
    height: 12px;
    background: #E5E5E5;
    border-radius: 2px;
    margin: 0 8px 0 0;
  }

  .production p:first-child {
    background: #1ABC9C;
  }

  .el-radio-group {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .logTittle {
    margin-top: 0;
    margin-bottom: 10px;
  }

  .titlePoint {
    display: inline-block;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #23C6C8;
  }

  .logItem {
    border-left: 4px solid #23C6C8;
    padding-left: 15px;
    padding-bottom: 10px;
  }

  .logItem:last-child {
    border: 0 !important;
  }

  .titlePoint {
    position: absolute;
    left: 15px;
  }

  .change-tip-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    background: red;
    border-radius: 50%;
    color: #fff;
    text-align: center;
    line-height: 16px;
    font-style: normal;
    font-size: 14px;
    font-weight: bold;
    position: absolute;
    right: 10%;
    bottom: 33%;
  }
</style>
