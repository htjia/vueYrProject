<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0px;">
      <div style="text-align: left;display: flex;justify-content: left;">
        <div class="input-item">
          <span class="input-title" style="width: 35px;">机台 </span>
          <el-select v-model="machine" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in machineList"
              :key="item.id"
              :label="item.name"
              :value="item.code"/>
          </el-select>
        </div>
        <el-button
          style="height: 35px;margin-top: 13px;"
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="fetchData" >查 询</el-button>
        <el-button
          size="small"
          type="primary"
          style="height: 35px;margin-top: 13px;margin-left:15px"
          @click="printList" ><svg-icon icon-class="print"/> 标签打印</el-button>
        &nbsp;
      </div>
    </div>
    <div class="app-container parameter-table">
      <div style="margin-bottom: 15px;font-weight: bold;">芯片信息 共<span style="color:#009494"> {{ list.length }} </span>片</div>
      <el-table
        v-loading="listLoading"
        :data="list"
        :row-class-name="tableRowClassName"
        element-loading-text="拼命加载中"
        height="calc(100vh - 266px)"
        border
        fit>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="ChipNo" align="center" prop="binNo"/>
        <el-table-column label="备注" align="center" prop="error"/>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-delete"
              type="danger"
              @click="deltetItem(scope.$index)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .parameter-table>>>.el-table .set_red td{
    background-color: #FFFFCF !important;
  }
  .deleteBtn{
    font-size: 30px;
    color: #d56c28;
    cursor: pointer;
    float: right;
    margin-right: 15px;
    margin-top: 5px;
  }
  .addBtn{
    transform: translateX(-50%);
    font-size: 30px;
    color: #009494;
    cursor: pointer;
    float: right;
    margin-right: 0px;
    margin-top: 5px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 205px);
  }
  .tab-control span{
    line-height: 50px;
  }
  .el-checkbox {
    margin-left: 0px;
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
  .search-input{
    width: 150px;
  }
  .titles{
    width: 100%;
    text-align: center;
    font-size: 22px;
    padding: 15px;
    color: #009494;
    font-weight: bold;
  }
  .input-item{
    float: left;
    margin-top: 15px;
    margin-right: 10px;
  }
  .margin-top{
    margin-top:15px;
  }
  .search-input{
    width: 150px;
  }
</style>
