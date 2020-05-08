<template>
  <PageHeaderLayout>
    <div class="header-search-add height-auto" style="padding-top: 5px">
      <el-row>
        <el-col :span="14" style="text-align:right">
          <div class="input-item">
            <span class="input-title" style="margin-left: -43px;">时间 </span>
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
            <el-button
              size="small"
              type="primary"
              icon="el-icon-search"
              @click="fetchData" >查询</el-button>
          </div>
          <div class="input-item">
            <el-button
              size="small"
              type="danger"
              @click="clearAll" ><svg-icon icon-class="clear"/> 重 置</el-button>
          </div>
        </el-col>
        <el-col :span="10" style="text-align:right">
          <el-button type="primary" size="small" class="margin-top" @click="changeIsChart()"><svg-icon icon-class="daochu"/> 切换视图</el-button>
          <el-button type="default" size="small" class="margin-top" icon="el-icon-sold-out" @click="importExcel()">导出</el-button>
        </el-col>
      </el-row>
    </div>
    <div v-if="!isChart" class="app-container" style="height: calc(100vh - 205px);width:100%">
      <el-table
        v-loading="listLoading"
        v-if="dateList.length>0"
        :data="list"
        :span-method="objectSpanMethod"
        :cell-class-name="tableRowClassColor"
        :header-cell-class-name="headerclass"
        class="broad-scrollbar-table"
        element-loading-text="拼命加载中"
        height="calc(100vh - 238px)"
        border
        fit>
        <el-table-column align="center" label="检验项目" width="80" fixed>
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="" align="center" prop="typs" width="80" class="getsty" fixed show-overflow-tooltip/>
        <el-table-column label="类别" align="center" prop="types" width="150" fixed show-overflow-tooltip/>
        <el-table-column v-for="(item,index) in dateList" :key="index" :label="item" align="center">
          <template slot-scope="scope">
            <span v-if="scope.$index === 10||scope.$index === 0">{{ scope.row.datalist[item].checknum }}</span>
            <span v-if="scope.$index === 11||scope.$index === 1">{{ scope.row.datalist[item].badnum }}</span>
            <span v-if="scope.$index === 12||scope.$index === 2">{{ scope.row.datalist[item].checkbatch }}</span>
            <span v-if="scope.$index === 3">{{ scope.row.datalist[item].ggbf }}</span>
            <span v-if="scope.$index === 4">{{ scope.row.datalist[item].ldp }}</span>
            <span v-if="scope.$index === 13||scope.$index === 5">{{ scope.row.datalist[item].wgbl }}</span>
            <span v-if="scope.$index === 14||scope.$index === 6">{{ scope.row.datalist[item].slbf }}</span>
            <span v-if="scope.$index === 16||scope.$index === 7">{{ scope.row.datalist[item].qtBatch }}</span>
            <span v-if="scope.$index === 17||scope.$index === 8">{{ scope.row.datalist[item].badBatch }}</span>
            <span v-if="scope.$index === 18||scope.$index === 9">{{ scope.row.datalist[item].checkRatio }}</span>
            <span v-if="scope.$index === 15">{{ scope.row.datalist[item].mappingbad }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="isChart" class="module-container" style="margin-top: 10px;">
      <!-- 顶部的标题显示 -->
      <div class="module-title flex" style="margin-bottom: 10px">
        <div class="module-title-text">芯片每日入库检验分析</div>
      </div>
      <div class="charts-right">
        <chart id="acplxtj" :options="options" height="250px" width="100%"/>
      </div>
    </div>
    <div v-if="isChart" class="module-container" style="margin-top: 10px;">
      <!-- 顶部的标题显示 -->
      <div class="module-title flex" style="margin-bottom: 10px">
        <div class="module-title-text">方片不良批次类型分布</div>
      </div>
      <div class="charts-right">
        <chart id="acplxtj1" :options="options1" height="250px" width="100%"/>
      </div>
    </div>
    <div v-if="isChart" class="module-container" style="margin-top: 10px;">
      <!-- 顶部的标题显示 -->
      <div class="module-title flex" style="margin-bottom: 10px">
        <div class="module-title-text">圆片不良批次类型分布</div>
      </div>
      <div class="charts-right">
        <chart id="acplxtj2" :options="options2" height="250px" width="100%"/>
      </div>
    </div>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .app-container{
    position: relative;
    height: calc(100vh - 566px);
  }
  .broad-scrollbar-table >>>.getwidht div{
    width: 100% !important;
  }
  .broad-scrollbar-table >>>.headerset{
    border-right: 1px solid #d6eeee !important;
  }
  .broad-scrollbar-table >>>.headersetto{
    text-align: left;
    padding-left: 15px !important;
  }
  .input-item{
    float: left;
    margin-top: 14px;
    margin-right: 10px;
  }
  .broad-scrollbar-table>>> .is-scrolling-none +.el-table__fixed,
  .broad-scrollbar-table>>> .is-scrolling-none +.el-table__fixed +.el-table__fixed-right {
    height: 100% !important;
  }
  .broad-scrollbar-table>>>.el-table__fixed-body-wrapper {
    height: calc(100vh - 277px) !important;
  }
  .header-search-add >>>.el-input--prefix .el-input__inner {
    padding-left: 28px;
    padding-right: 18px;
  }
  .tab-control span{
    line-height: 50px;
  }
  .el-checkbox {
    margin-left: 0px;
  }
  .padding-dialog>>> .el-dialog__body{
    padding-top: 0;
  }
  .rule-box{
    margin-top: 15px;
    border: 1px solid #e2e2e2;
    height: 400px;
    overflow: auto;
    padding: 15px;
    padding-left: 0;
  }
  .rule-box>>> .el-input.is-disabled .el-input__inner {
    background-color: #f8fafd;
    border-color: #e6e8eb;
    color: #494949;
    cursor: not-allowed;
  }
  .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom: 10px;
  }
  .padding-dialog>>> .el-dialog__footer{
    text-align: center;
  }
  .padding-dialog>>> .el-radio{
    margin-left: 18px;
  }
</style>
