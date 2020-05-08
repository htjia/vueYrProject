<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0">
      <div style="text-align: left;margin-bottom: -15px;">
        <!-- <div class="input-item">
          <span class="input-title">调度类型</span>
          <el-select v-model="type" class="search-input" size="small" placeholder="请选择" clearable>
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div> -->
        <div class="input-item">
          <span class="input-title">WaferID </span>
          <el-input v-model="waferNo" class="search-input" style="width:300px" placeholder="请输入WaferID" size="small" maxlength="100" clearable/>
        </div>
        <div class="input-item">
          <span class="input-title">分选机台</span>
          <el-select v-model="machineId" class="search-input" style="width:100px" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in machineList"
              :key="item.id"
              :label="item.code"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">调度状态 </span>
          <el-select v-model="status" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in statusList"
              :key="item.name"
              :label="item.name"
              :value="item.name"/>
          </el-select>
        </div>
        <div class="paddingsc">
          <span class="input-title">时间</span>
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
          <el-button
            class="margin-top"
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="handleSearch" >查 询</el-button>
          <el-button
            class="margin-top"
            style="margin-left:15px"
            size="small"
            type="danger"
            @click="clearSearch"
          >
            <svg-icon icon-class="clear"/> 重 置
          </el-button>
        </div>
        &nbsp;
      </div>
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        height="calc(100vh - 277px)"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
          </template>
        </el-table-column>
        <el-table-column label="调度类型" align="center" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 0">常规调度</span>
            <span v-if="scope.row.type === 1">提前调度</span>
          </template>
        </el-table-column>
        <el-table-column label="WaferID" align="center" prop="waferNo" width="220" show-overflow-tooltip/>
        <el-table-column label="分选机台号" align="center" prop="code" width="100"/>
        <el-table-column label="分选状态" align="center" prop="code">
          <template slot-scope="scope">
            <span v-if="scope.row.statusFx === 1">分选中</span>
            <span v-if="scope.row.statusFx === 2">分选完成</span>
          </template>
        </el-table-column>
        <el-table-column label="调度状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">成功</span>
            <span v-if="scope.row.status === 1">{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column label="调度人员" align="center" prop="creatorName" width="100"/>
        <el-table-column label="调度时间" align="center" prop="createTime" width="150"/>
        <el-table-column label="还原状态" align="center" prop="recovery">
          <template slot-scope="scope">
            <span v-if="scope.row.recovery === 0">成功</span>
            <span v-if="scope.row.recovery === 1">{{ scope.row.recoveryRemark }}</span>
          </template>
        </el-table-column>
        <el-table-column label="还原时间" align="center" prop="recoveryTime" width="150"/>
        <el-table-column label="还原人" align="center" prop="recoverName"/>
      </el-table>
      <el-pagination
        :current-page="pageNum"
        :page-sizes="[12, 30, 40]"
        :page-size="pageSize"
        :total="totalPage"
        class="pagination"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  @media (max-width: 1440px) {
    .paddingsc {
      padding-top: 15px
    }
  }
  .app-container{
    position: relative;
    height: calc(100vh - 199px);
  }
  .tab-control span{
    line-height: 50px;
  }
  .el-checkbox {
    margin-left: 0px;
  }
  .input-item{
    float: left;
    margin-top: 15px;
    margin-right: 10px;
  }
  .margin-top {
    margin-top: 15px;
  }
  .search-input{
    width: 150px;
  }
</style>
