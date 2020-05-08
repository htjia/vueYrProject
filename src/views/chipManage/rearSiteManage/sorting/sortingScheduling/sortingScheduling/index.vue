<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0">
      <div style="text-align: left;line-height: 40px;display: flex;justify-content: left;">
        <div class="input-item">
          <span class="input-title">调度机台</span>
          <el-select v-model="machineId" class="search-input" style="width: 80px" size="small" placeholder="请选择" filterable @change="getFind">
            <el-option
              v-for="item in machineList"
              :key="item.id"
              :label="item.code"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">调度人 </span>
          <el-select v-model="creator" class="search-input" size="small" placeholder="请选择" filterable @change="getFind">
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title" style="width: 150px;"><svg-icon icon-class="tiaomasm" style="color:009494;margin-right: 10px;font-size: 18px;"/>WaferID扫描 </span>
          <el-input v-model="waferNo" class="search-input" style="width:250px" placeholder="" size="small" maxlength="50" clearable @keyup.enter.native="fetchData"/>
        </div>
        <div class="input-item">
          <el-radio v-model="operate" label="0">调度</el-radio>
          <el-radio v-model="operate" label="1">还原</el-radio>
        </div>
        &nbsp;
      </div>
    </div>
    <div class="app-container">
      <div class="table-top-btn-group">
        <div
          :class="{'active':activeTabIndex === 0}"
          @click="navClick(0)"
        >
          常规调度
        </div>
        <!-- <div
          :class="{'active':activeTabIndex === 1}"
          @click="navClick(1)"
        >
          提前调度
        </div> -->
      </div>
      <el-table
        v-loading="listLoading"
        v-if="activeTabIndex === 0"
        :data="list"
        element-loading-text="拼命加载中"
        height="calc(100vh - 275px)"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="WaferID" prop="waferNo"/>
        <el-table-column label="分选机台号" align="center" prop="machineName"/>
        <el-table-column label="操作状态" align="center">
          <template slot-scope="scope">
            <span v-if="operate === '0'">调度：</span>
            <span v-if="operate === '1'">还原：</span>
            <span v-if="scope.row.status === 0">成功</span>
            <span v-if="scope.row.status === 1">{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作人员" align="center" prop="userName"/>
        <el-table-column label="操作时间" align="center" prop="createTime"/>
      </el-table>
      <el-table
        v-loading="listLoading"
        v-if="activeTabIndex === 1"
        :data="list1"
        element-loading-text="拼命加载中"
        height="calc(100vh - 275px)"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="ID号">
          <template slot-scope="scope">
            {{ scope.waferNo }}
          </template>
        </el-table-column>
        <el-table-column label="分选机台号" align="center" prop="machineName"/>
        <el-table-column label="调度状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">成功</span>
            <span v-if="scope.row.status === 1">{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column label="调度人员" align="center" prop="userName"/>
        <el-table-column label="调度时间" align="center" prop="createTime"/>
      </el-table>
    </div>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .app-container{
    position: relative;
    height: calc(100vh - 210px);
  }
  .app-container>>> .el-table--border {
    border-top: 2px solid #009494;
  }
  .tab-control span{
    line-height: 50px;
  }
  .el-checkbox {
    margin-left: 0px;
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
</style>
