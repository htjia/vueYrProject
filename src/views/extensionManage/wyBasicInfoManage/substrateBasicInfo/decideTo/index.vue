<template>
  <PageHeaderLayout >
    <div class="app-container">
      <el-table
        :data="list"
        element-loading-text="拼命加载中"
        border
        fit>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="编号" align="center" prop="code"/>
        <el-table-column label="含义" align="center" prop="name"/>
        <el-table-column label="备注" align="center" prop="remark" width="460"/>
        <el-table-column label="是否启用" align="center" prop="mandataryName">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.status" @change="switchChange(scope.row)"/>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .app-container{
    position: relative;
    height: calc(100vh - 132px);
  }
  .el-checkbox {
    margin-left: 0px;
  }
</style>
