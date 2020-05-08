<template>
  <PageHeaderLayout>
    <div class="header-search-add height-auto" style="padding-top:0;display:flex">
      <div style="height: auto;flex:1">
        <div class="input-item" style="margin-right: 0">
          <span class="input-title" style="width:35px">类别 </span>
          <el-select v-model="categoryId" style="width:150px" size="small" filterable clearable placeholder="请选择类别">
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item" style="margin-right: 0">
          <span class="input-title" style="width:40px">型号 </span>
          <el-select v-model="produceId" style="width:150px" size="small" filterable clearable placeholder="请选择型号">
            <el-option
              v-for="item in modelList"
              :key="item.id"
              :label="item.code"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item" style="margin-right: 0">
          <span class="input-title" style="width:40px">衬底 </span>
          <el-select v-model="substrate" style="width:150px" size="small" filterable clearable placeholder="请选择衬底">
            <el-option
              v-for="item in measureList"
              :key="item.id"
              :label="item.name"
              :value="item.name"/>
          </el-select>
        </div>
        <div class="input-item" style="margin-right: 0">
          <span class="input-title" style="width:40px">工艺 </span>
          <el-select v-model="craftId" style="width:150px" size="small" filterable clearable placeholder="请选择工艺">
            <el-option
              v-for="item in gyList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item" style="margin-right: 0">
          <span class="input-title" style="width:40px">月份 </span>
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
        <div class="clear-both"/>
      </div>
      <div class="input-item">
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
    <div class="setkuai">
      <div class="module-title-text">入库进度</div>
      <div class="setvalue edit-dialog">
        <el-row>
          <el-col :span="12">
            <div class="production">
              <p/><span style="margin-right: 30px;">已入库</span>
              <p/><span>剩余入库</span>
            </div>
          </el-col>
          <el-col :span="10">
            <el-radio-group v-model="showType" style="margin-top: 2px" @change="changeType">
              <el-radio :label="0">按片查看</el-radio>
              <el-radio :label="1">按颗查看</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row style="padding: 0">
          <el-col :span="24">
            <div class="set-content">
              <div v-if="xpShow" style="left: 45%; color: #494949;" class="set-content-item">
                {{ xpNoRate + '% ' + '(' + xpRealNo + '/' + xpPlanNo + '片)' }}
              </div>
              <div v-if="!xpShow" style="left: 45%; color: #494949;" class="set-content-item">
                {{ xpkRate + '% ' + '(' + xpRealK + '/' + xpPlanK + 'K)' }}
              </div>
            </div>
            <el-progress v-if="xpShow" :show-text="false" :stroke-width="20" :percentage="xpNoRate" color="#1ABC9C"/>
            <el-progress v-if="!xpShow" :show-text="false" :stroke-width="20" :percentage="xpkRate" color="#1ABC9C"/>
          </el-col>

        </el-row>
      </div>
      <div v-if="!isSpan" style="line-height: 24px;text-align:center">
        <a class="primarya" @click="setSpan"><i class="el-icon-arrow-down"/> 展开产品信息</a>
      </div>
      <el-row v-if="isSpan" :gutter="10" style="padding: 0 2px;line-height: 24px;margin: 0 10px">
        <el-col :span="6">
          <div class="grid-content grid_align">计划投片总数（片）<span>{{ obj.xpPlanTp }}</span></div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content grid_align">实际投片总数（片）<span>{{ obj.xpRealTp }}</span></div>
        </el-col>

        <el-col :span="6">
          <div class="grid-content grid_align">达成率总计<span>{{ obj.dcRate }}%</span></div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content grid_align">计划入库数总计（k）<span>{{ obj.xpPlanK }}</span></div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content grid_align">计划入库数总计（片）<span>{{ obj.xpPlanNo }}</span></div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content grid_align">实际入库数总计（片）<span>{{ obj.xpRealNo }}</span></div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content grid_align">完成率总计<span>{{ obj.wcRate }}%</span></div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content grid_align">实际入库数总计（k）<span>{{ obj.xpRealK }}</span></div>
        </el-col>
        <!-- <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
          <div class="grid-content grid_align">在产片数总计（片）<span>{{ obj.xpZcNo }}</span></div>
        </el-col> -->
        <div style="margin-top: 5px;text-align:center">
          <a class="primarya" @click="setSpan"><i class="el-icon-arrow-up"/> 收起产品信息</a>
        </div>
      </el-row>
    </div>
    <div class="app-container mt10">
      <div class="module-title-text">月度产能规划表</div>
      <div style="margin: 0 15px">
        <div class="table-top-btn-group mt10">
          <div
            :class="{'active':isActive === 2}"
            @click="navClick(2)"
          >
            全部
          </div>
          <div
            :class="{'active':isActive === 0}"
            @click="navClick(0)"
          >
            圆片
          </div>
          <div
            :class="{'active':isActive === 1}"
            @click="navClick(1)"
          >
            方片
          </div>
          <el-button
            size="mini"
            type="primary"
            style="float: right"
            @click="changeLog">
            <svg-icon icon-class="lishibb"/>
            变更日志
          </el-button>
        </div>
        <!--芯片列表-->
        <el-table
          v-loading="listLoading"
          :data="anotherlist"
          :row-style="cancelRowStyle"
          class="plan-table run-table"
          height="calc(100vh - 448px)"
          element-loading-text="拼命加载中"
          border
          fit>
          <el-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              {{ scope.$index+1 }}
            </template>
          </el-table-column>
          <el-table-column label="类型" width="50" align="center" prop="pattern">
            <template slot-scope="scope">
              <div v-if="scope.row.pattern === 0">圆片</div>
              <div v-if="scope.row.pattern === 1">方片</div>
            </template>
          </el-table-column>
          <el-table-column label="类别" width="50" align="center" prop="category"/>
          <el-table-column label="型号" width="90" align="center" prop="produce"/>
          <el-table-column label="尺寸" width="70" align="center" prop="measure"/>
          <el-table-column label="衬底" width="80" align="center" prop="substrate"/>
          <el-table-column label="工艺" width="40" align="center" prop="craftName"/>
          <el-table-column label="实际投片(片)" align="center" prop="throwNum"/>
          <el-table-column label="计划投片(片)" align="center" prop="planTpno">
            <template slot-scope="scope">
              <div v-if="scope.row.ctpno.length > 0">{{ scope.row.planTpno }}</div>
              <el-tooltip v-if="scope.row.ctpno.length > 0" placement="top-start">
                <div slot="content">
                  <p>变动记录</p>
                  <p v-for="item in scope.row.ctpno" :key="item.create_time">
                    <span v-if="item.ctpno > 0">{{ item.create_time + ' (+' + item.ctpno + ') ' + item.new_tpno + '片' + ' ' +item.creatorName }}</span>
                    <span v-if="item.ctpno < 0">{{ item.create_time + ' (' + item.ctpno + ') ' + item.new_tpno + '片' + ' ' +item.creatorName }}</span>
                  </p>
                </div>
                <i class="change-tip-icon">!</i>
              </el-tooltip>
              <div v-if="scope.row.ctpno.length === 0">{{ scope.row.planTpno }}</div>
            </template>
          </el-table-column>
          <el-table-column label="实际入库(片)" align="center" prop="warehousNo"/>
          <el-table-column label="计划入库(片)" align="center" prop="planRkno">
            <template slot-scope="scope">
              <div v-if="scope.row.crkno.length > 0">{{ scope.row.planRkno }}</div>
              <el-tooltip v-if="scope.row.crkno.length > 0" placement="top-start">
                <div slot="content">
                  <p>变动记录</p>
                  <p v-for="item in scope.row.crkno" :key="item.create_time">
                    <span v-if="item.crkno > 0">{{ item.create_time + ' (+' + item.crkno + ') ' + item.new_rkno + '片' + ' ' +item.creatorName }}</span>
                    <span v-if="item.crkno < 0">{{ item.create_time + ' (' + item.crkno + ') ' + item.new_rkno + '片' + ' ' +item.creatorName }}</span>
                  </p>
                </div>
                <i class="change-tip-icon">!</i>
              </el-tooltip>
              <div v-if="scope.row.crkno.length === 0">{{ scope.row.planRkno }}</div>
            </template>
          </el-table-column>
          <el-table-column label="实际入库(K)" width="180" align="center" prop="warehousNoK"/>
          <el-table-column label="计划入库(K)" width="180" align="center" prop="planRkk">
            <template slot-scope="scope">
              <div v-if="scope.row.crkk.length > 0">{{ scope.row.planRkk }}</div>
              <el-tooltip v-if="scope.row.crkk.length > 0" placement="top-start">
                <div slot="content">
                  <p>变动记录</p>
                  <p v-for="item in scope.row.crkk" :key="item.create_time">
                    <span v-if="item.crkk > 0">{{ item.create_time + ' (+' + item.crkk + ') ' + item.new_rkk + 'K' + ' ' +item.creatorName }}</span>
                    <span v-if="item.crkk < 0">{{ item.create_time + ' (' + item.crkk + ') ' + item.new_rkk + 'K' + ' ' +item.creatorName }}</span>
                  </p>
                </div>
                <i class="change-tip-icon">i</i>
              </el-tooltip>
              <div v-if="scope.row.crkk.length === 0">{{ scope.row.planRkk }}</div>
            </template>
          </el-table-column>
          <el-table-column label="分选地" align="center" prop="address"/>
          <el-table-column label="备注" align="center" prop="remark" width="150"/>
          <el-table-column label="计划状态" align="center" prop="status" width="90">
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
      width="800px">
      <div v-if="changeXpLogList.length === 0" style="height: 100px;line-height:65px;text-align: center; font-size: 16px; color: #666;font-weight: bold">
        暂无变更
      </div>
      <div class="logXpDiv">
        <div v-for="(item, index) in changeXpLogList" :key="index" class="logItem">
          <h3 class="logTittle">
            <span class="titlePoint"/>
            {{ item.createTime + ' 变更' + ' (' + item.creatorName + ')' }}
          </h3>
          <el-collapse v-model="activeLog">
            <el-collapse-item :title="item.patternName+''+item.category+''+item.produce+''+item.measure+''+item.substrate+''+item.craftName+' -------------- '+'计划投片'+item.tpnoChangeNum+'片'+'计划入库'+item.rknoChangeNum+'片'+item.rkkchangeNum+'K'" :name="index + 1" :style="{'padding-left':'10px'}">
              <div v-if="item.oldTono !== item.newTpno" style="margin-left: 10%">{{ '计划投片 ' + item.oldTono + '片' + ' > >' + item.newTpno + '片' }}
              </div>
              <div v-if="item.oldRkno !== item.newRkno" style="margin-left: 10%">{{ '计划入库 ' + item.oldRkno + '片' + ' > >' + item.newRkno + '片' }}
              </div>
              <div v-if="item.oldRkk !== item.newRkk" style="margin-left: 10%">{{ '计划入库 ' + item.oldRkk + 'K' + ' > > ' + item.newRkk + 'K' }}
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

  .input-item{
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
  .tongji {
    width: 100%;
    background: #fff;
    margin-top: 10px;
    min-height: 100px;
  }
  .tongji_left {
    float: left;
  }
  .app-container {
    position: relative;
    height: calc(100vh - 335px);
    margin-bottom: 10px;
    padding: 0;
  }

  .table-top-btn-group {
    overflow: hidden;
  }

  .table-top-btn-group > div {
    float: left;
    margin-left: 15px;
    height: 35px;
    line-height: 35px;
    padding: 0 15px;
    border: 1px solid #e2e2e2;
    cursor: pointer;
  }
  .table-top-btn-group > div.active {
    color: #fff;
    background: #009494;
    border-color: #009494;
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
    padding: 8px 15px 0 15px;
  }
  .setvalue>>> .el-progress-bar__outer {
    background: #e5e5e5;
  }

  .module-title-text {
    color: #666;
    font-size: 14px;
    font-weight: bold;
    float: none;
    padding: 10px 15px;
    border-bottom: 1px solid #e5e5e5;
  }

  .mt10 {
    margin-top: 10px;
  }

  .mt15 {
    margin-top: 15px;
  }

  .production {
    display: flex;
    justify-content: flex-end;
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
  .el-row {
    padding: 0 15px;
  }
  .el-col {
    margin-bottom: 10px;
  }
  .grid-content {
    background: #f5f5f5;
    padding: 5px 20px;
    min-height: 65px;
    display: flex;
    flex-direction: column;
    font-size: 13px;
    line-height: 24px;
    font-weight: 700;
  }
  .grid-content span {
    font-size: 20px;
    color: #009688;
    line-height: 32px;
  }
  .grid_align {
    flex-direction: inherit;
    justify-content: space-between;
    line-height: 65px;

  }
  .grid_align span {
    line-height: 65px;
  }
  .primarya{
    color:#009494;
    cursor: pointer;
  }
</style>
