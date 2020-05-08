<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto">
      <div style="text-align: left;line-height: 40px;display: flex;justify-content: left;">
        <div class="input-item">
          <span class="input-title svgsty"><svg-icon icon-class="tiaomasm" style="font-size: 20px;color:#009494;margin-right:5px"/> 片号扫描 </span>
          <el-input v-model="waferNo" class="search-input" style="width:300px" placeholder="" size="small" maxlength="100" clearable @keyup.enter.native="fetchData"/>
        </div>
        <el-button
          style="height: 32px;margin-top: 3px;"
          size="small"
          type="primary"
          @click="save" ><svg-icon icon-class="bianji"/> 过 站</el-button>
        <el-button
          style="height: 32px;margin-top: 3px;margin-left:15px"
          size="small"
          type="danger"
          @click="clearSearch"
        >
          <svg-icon icon-class="clear"/> 清 除
        </el-button>
        &nbsp;
      </div>
    </div>
    <div class="app-container">
      <div style="margin-bottom: 15px;font-weight: bold;">芯片信息 共<span style="color:#009494"> {{ list.length }} </span>片</div>
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        height="calc(100vh - 271px)"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="WaferID" align="center" prop="wafer"/>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-delete"
              type="danger"
              @click="deleteItem(scope.$index)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .svgsty{
    width: 90px !important;
    height: 37px;
    align-items: center;
    justify-content: center;
    align-content: center;
    display: flex;
    float: left;
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
    height: calc(100vh - 210px);
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
  .input-item{
    float: left;
    margin-top: 0px !important;
    margin-right: 10px;
  }
  .search-input{
    width: 200px;
  }
  .titles{
    width: 100%;
    text-align: center;
    font-size: 22px;
    padding: 15px;
    color: #009494;
    font-weight: bold;
  }
  .margin-top{
    margin-top:15px;
  }
  .search-input{
    width: 150px;
  }
</style>
