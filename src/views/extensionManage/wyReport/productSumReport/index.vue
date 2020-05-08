<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0">
      <div class="search-box">
        <div class="left-search-box">
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
        :row-style="rowStyle"
        :cell-style="tableRowClassColor"
        element-loading-text="拼命加载中"
        height="calc(100vh - 240px)"
        border
        fit
      >
        <el-table-column label="机台" align="center" prop="title" width="130" show-overflow-tooltip/>
        <el-table-column label="1" align="center" prop="machine1" show-overflow-tooltip/>
        <el-table-column label="2" align="center" prop="machine2" show-overflow-tooltip/>
        <el-table-column label="3" align="center" prop="machine3" show-overflow-tooltip/>
        <el-table-column label="4" align="center" prop="machine4" show-overflow-tooltip/>
        <el-table-column label="5" align="center" prop="machine5" show-overflow-tooltip/>
        <el-table-column label="6" align="center" prop="machine6" show-overflow-tooltip/>
        <el-table-column label="7" align="center" prop="machine7" show-overflow-tooltip/>
        <el-table-column label="8" align="center" prop="machine8" show-overflow-tooltip/>
        <el-table-column label="9" align="center" prop="machine9" show-overflow-tooltip/>
        <el-table-column label="10" align="center" prop="machine10" show-overflow-tooltip/>
        <el-table-column label="11" align="center" prop="machine11" show-overflow-tooltip/>
        <el-table-column label="12" align="center" prop="machine12" show-overflow-tooltip/>
        <el-table-column label="13" align="center" prop="machine13" show-overflow-tooltip/>
        <el-table-column label="14" align="center" prop="machine14" show-overflow-tooltip/>
        <el-table-column label="15" align="center" prop="machine15" show-overflow-tooltip/>
        <el-table-column label="16" align="center" prop="machine16" show-overflow-tooltip/>
        <el-table-column label="17" align="center" prop="machine17" show-overflow-tooltip/>
      </el-table>
    </div>
  </PageHeaderLayout>
</template>

<script src="./productSumReport.js"></script>

<style >
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
</style>
