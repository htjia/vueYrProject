<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto">
      <div class="search-box">
        <div class="left-search-box" style="margin-left: -20px;margin-top: -15px;">
          <div class="input-item">
            <span class="input-title">时间 </span>
            <el-date-picker
              v-model="beginDate"
              :picker-options="pickerOptionsStart"
              :editable="false"
              class="search-input"
              size="small"
              type="date"
              placeholder="选择开始日期"
              value-format="timestamp"
            />
            <span style="display:inline-block;width: 38px;text-align: center"> 至 </span>
            <el-date-picker
              v-model="endDate"
              :picker-options="pickerOptionsEnd"
              :editable="false"
              class="search-input"
              size="small"
              type="date"
              placeholder="选择结束日期"
              value-format="timestamp"
            />
          </div>
          <div class="input-item">
            <span class="input-title">机台 </span>
            <el-select v-model="machine" class="search-input" style="width:130px" size="small" placeholder="请选择" filterable>
              <el-option
                v-for="item in machineOptions"
                :key="item.id"
                :label="item.code"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">程序 </span>
            <el-select v-model="process" class="search-input" size="small" placeholder="请选择" filterable>
              <el-option
                v-for="item in processList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
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
              @click="fetchData" >查 询</el-button>
          </div>
        </div>
        <div class="right-btn-box">
          <el-button
            class="float-right margin-left"
            size="small"
            type="primary"
            @click="addDate"
          ><svg-icon icon-class="fenxipz"/> 源数据</el-button>
        </div>
      </div>
    </div>
    <div class="app-container">
      <!--单据信息-->
      <el-table
        v-loading="listLoading"
        ref="listTabel"
        :data="list"
        :span-method="objectSpanMethod"
        class="mocvd-table run-table"
        element-loading-text="拼命加载中"
        border
        fit
      >
        <el-table-column :label="processName+'厚度测量SPC管理图'" align="center">
          <el-table-column label="制程名称" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.sign === 0">SiO2沉积</span>
            </template>
          </el-table-column>
          <el-table-column label="控制项目" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.sign === 0">SiO2沉积</span>
            </template>
          </el-table-column>
          <el-table-column label="测量单位" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.sign === 0">埃（Å）</span>
            </template>
          </el-table-column>
          <el-table-column label="规格" align="center">
            <el-table-column label="上限USL" align="center" prop="usl"/>
            <el-table-column label="中心限CL" align="center" prop="cl"/>
            <el-table-column label="下限LSL" align="center" prop="lsl"/>
          </el-table-column>
          <el-table-column label="控制" align="center">
            <el-table-column label="上限UCL" align="center" prop="ucl"/>
            <el-table-column label="下限LCL" align="center" prop="lcl"/>
          </el-table-column>
          <el-table-column label="群组数大小" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.sign !== -1">1</span>
            </template>
          </el-table-column>
          <el-table-column label="MR-UCL" align="center" prop="mrucl"/>
          <el-table-column label="MR-CL" align="center" prop="mrcl"/>
          <el-table-column label="样品容量／频率" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.sign !== -1">抽样方法</span>
            </template>
          </el-table-column>
          <el-table-column label="1次/RUN" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.sign !== -1">固定取样</span>
            </template>
          </el-table-column>
          <el-table-column label="制造部门" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.sign !== -1">审  核</span>
            </template>
          </el-table-column>
          <el-table-column label="芯片部" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.sign !== -1">&nbsp;</span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <div class="module-container" style="margin-top: 10px;">
      <div class="module-title">
        <div class="module-title-text">SiO2厚度 埃（Å）</div>
      </div>
      <div class="module-content" style="height: 300px;">
        <div v-if="anotherLists.length === 0" class="no-data">
          <svg-icon class="no-data-icon" icon-class="noData"/>
          <div>暂无数据</div>
        </div>
        <chart v-if="anotherLists.length !== 0" id="pdzcm" :options="option1" height="300px" width="100%"/>
      </div>
    </div>
    <div class="module-container" style="margin-top: 10px;">
      <div class="module-title">
        <div class="module-title-text">SiO2厚度-MR</div>
      </div>
      <div class="module-content" style="height: 300px;">
        <div v-if="anotherLists.length === 0" class="no-data">
          <svg-icon class="no-data-icon" icon-class="noData"/>
          <div>暂无数据</div>
        </div>
        <chart v-if="anotherLists.length !== 0" id="pdzmr" :options="option2" height="300px" width="100%"/>
      </div>
    </div>
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible"
      title="源数据"
      width="800px"
      class="tip-out-inner-dialog">
      <el-table
        ref="multipleTable"
        :data="anotherLists"
        class="mocvd-table run-table"
        height="435px"
        element-loading-text="拼命加载中"
        border
        fit
        stripe>
        <el-table-column label="Run编号" align="center" prop="date"/>
        <el-table-column label="SiO2厚度" align="center" prop="mh" width="150px"/>
        <el-table-column label="SiO2厚度-MR" align="center" prop="mhMr"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="importExcel()">导 出</el-button>
        <el-button @click="addDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .input-title{
    width:53px
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
  .search-box{
    display: flex;
    flex-direction: row;
  }
  .left-search-box{
    flex-grow: 1;
  }
  .right-btn-box{
    width: 210px;
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
</style>
