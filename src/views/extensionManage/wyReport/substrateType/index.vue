<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0">
      <div class="search-box">
        <div class="left-search-box">
          <div class="input-item">
            <span class="input-title">机台 </span>
            <el-select v-model="machine" class="search-input" style="width: 200px" size="small" placeholder="请选择" filterable clearable multiple collapse-tags>
              <el-option
                v-for="item in machineList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">月份 </span>
            <el-date-picker
              v-model="month"
              :editable="false"
              class="search-input"
              size="small"
              type="month"
              placeholder="选择月份"
              value-format="yyyy-MM"
              @change="monthChange"
            />
          </div>
          <div class="input-item">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-search"
              @click="handleSearch" >查询</el-button>
          </div>
        </div>
        <div class="right-btn-box">
          <el-button
            style="margin-top: 15px"
            class="float-right margin-left"
            size="small"
            type="primary"
            @click="exportAll"><svg-icon icon-class="export"/> 导出</el-button>
        </div>
      </div>
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        height="100%"
        highlight-current-row
        border
        fit
      >
        <el-table-column label="投片日期" align="center" prop="createTime" width="120"/>
        <el-table-column v-for="item in theadData" :key="item.thName" :label="item.thName" :prop="item.thKey" :render-header="labelHead" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[item.thKey] }}
          </template>
        </el-table-column>
        <el-table-column label="汇总" align="center" prop="count" width="120"/>
      </el-table>
    </div>
  </PageHeaderLayout>
</template>

<script src="./substrate.js"></script>

<style scoped>
  .input-title{
    width: 35px;
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
    width: 260px;
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
