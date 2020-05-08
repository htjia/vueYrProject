<template>
  <PageHeaderLayout >
    <div class="app-container">
      <el-button
        style="margin-bottom: 15px"
        class="float-right"
        size="small"
        type="primary"
        @click="handleAdd"><svg-icon icon-class="add"/> 新 增</el-button>
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        height="calc(100vh - 211px)"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="200">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="包装检验缺陷类型" align="center" prop="name"/>
        <el-table-column label="是否启用" align="center" prop="status" width="200">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.status" @change="switchChange(scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="status" width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-delete"
              type="danger"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible"
      title="新增缺陷类型"
      width="500px"
      @close="handleClose('machineForm')">
      <el-form ref="machineForm" :model="machineForm" :rules="rules" status-icon label-width="80px" label-position="right">
        <el-form-item label="缺陷类型" prop="name">
          <el-input ref="nameInput" v-model="machineForm.name" :autofocus="true" placeholder="请输入缺陷类型" maxlength="20"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('machineForm')">确 定</el-button>
        <el-button @click="resetForm('machineForm')">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .app-container{
    position: relative;
    height: calc(100vh - 130px);
  }
  .tab-control span{
    line-height: 50px;
  }
  .el-checkbox {
    margin-left: 0px;
  }
</style>
