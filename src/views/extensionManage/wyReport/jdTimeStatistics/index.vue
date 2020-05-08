<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0">
      <div class="search-box">
        <div class="left-search-box">
          <div class="input-item">
            <span class="input-title">待机原因 </span>
            <el-select v-model="reasons" class="search-input" style="width: 200px;" size="small" placeholder="请选择" filterable clearable multiple collapse-tags>
              <el-option
                v-for="item in standbyReasonOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">日期 </span>
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
              @click="handleSearch" >查询</el-button>
          </div>
          <div class="input-item">
            <el-button
              size="small"
              type="danger"
              @click="clearAll" ><svg-icon icon-class="clear"/> 重 置</el-button>
          </div>
        </div>
        <div class="right-btn-box">
          <el-button
            style="margin-top: 15px"
            class="float-right qhColor margin-left"
            size="small"
            type="primary"
            @click="handleSwitch"
          ><svg-icon icon-class="daochu"/> 切换视图</el-button>
          <el-button
            v-if="!showChart"
            style="margin-top: 15px"
            class="float-right qhColor margin-left"
            size="small"
            type="primary"
            @click="handleExport"
          ><svg-icon icon-class="export"/> 导出</el-button>
        </div>
      </div>
    </div>
    <div class="app-container">
      <chart v-show="showChart" id="agscctjhgp" :options="option" height="calc(100vh - 250px)" width="100%"/>
      <el-table
        v-show="!showChart"
        :data="list"
        element-loading-text="拼命加载中"
        height="100%"
        border
        fit
      >
        <el-table-column label="待机原因/机台" align="center" prop="reason" width="130"/>
        <el-table-column v-for="item in tableColumn" :key="item.thName" :label="item.thName" :prop="item.thKey" align="center"/>
        <el-table-column label="合计" align="center" prop="total" width="100"/>
      </el-table>
    </div>
  </PageHeaderLayout>
</template>

<script src="./jdTime.js"></script>

<style scoped>
  .input-title{
    width: 63px;
  }
  .qhColor {
    background: #1abc9c;
    border: 0;
  }
  .title-postion{
    top: 13px;
    background: #fff;
    z-index: 15;
    position: relative;
    width: 85px;
    padding: 5px;
    left: 16px;
    font-weight: bold;
    font-size: 14px;
    text-align: center;
  }
  .set-border{
    border: 1px solid rgb(220, 223, 230);
    padding-top: 20px;
    padding-bottom: 0px;
  }
  .edit-dialog>>>.el-dialog__body{
    padding-top: 10px;
  }
  .search-box{
    display: flex;
    flex-direction: row;
  }
  .left-search-box{
    flex-grow: 1;
  }
  .right-btn-box{
    width: 190px;
  }
  .input-item{
    float: left;
    margin-top: 15px;
    margin-right: 10px;
  }
  .search-input{
    width: 140px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 204px);
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
  .substrate>div:not(:first-child){
    margin-left: 5px;
  }
  .table-top-btn-group>div.active{
    color: #fff;
    background: #009494;
    border-color: #009494;
  }
  .run-table ::-webkit-scrollbar {/*滚动条整体样式*/
    height: 10px !important;
  }
  .stsl::before{
    content: '*';
    color: #F56C6C;
    margin-right: 4px;
  }
</style>
