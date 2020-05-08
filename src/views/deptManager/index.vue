<template>
  <PageHeaderLayout>
    <div class="header-search-add height-auto" style="height:60px">
      <div class="left-search-box">
        <div class="input-item" style="margin-top:0px">
          <span class="input-title">名称</span>
          <el-input
            v-model="name"
            class="search-input"
            size="small"
            maxlength="20"
            clearable
          />
        </div>
        <div class="input-item" style="margin-top:0px">
          <span class="input-title">编号</span>
          <el-input
            v-model="code"
            class="search-input"
            size="small"
            maxlength="20"
            clearable
          />
        </div>
        <div class="input-item" style="margin-top:0px">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="fetchData"
          >查询</el-button>
        </div>
        <div class="input-item" style="margin-top:0px">
          <el-button
            size="small"
            type="danger"
            @click="clearAll"
          >
            <svg-icon icon-class="clear"/> 重 置
          </el-button>
        </div>
      </div>
      <el-button
        size="small"
        class="float-right-btn"
        type="primary"
        icon="el-icon-plus"
        @click="handleAdd">添 加</el-button>
    </div>
    <div class="app-container">
      <el-table
        v-loading="isLoadtree"
        :data="list"
        class="setTable"
        height="calc(100vh - 230px)"
        border
        element-loading-text="正在拼命加载请稍后..."
        row-key="id">
        <el-table-column label="名称" align="left" prop="name"/>
        <el-table-column label="编号" align="center" prop="code"/>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="append(scope.row)">添加</el-button>
            <el-button
              v-if="scope.row.name !== '外延部' && scope.row.name !== '芯片部' && scope.row.name !== '厂务部' && scope.row.name !== '采购部' && scope.row.name !== '技术部' && scope.row.name !== '生产管理部'"
              size="mini"
              icon="el-icon-edit"
              @click="edit(scope.row)">编辑</el-button>
            <el-button
              v-if="scope.row.name !== '外延部' && scope.row.name !== '芯片部' && scope.row.name !== '厂务部' && scope.row.name !== '采购部' && scope.row.name !== '技术部' && scope.row.name !== '生产管理部'"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="remove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      title="添加"
      width="500px"
      @close="handleClose('menuForm')">
      <el-form ref="menuForm" :model="menuForm" :rules="rules" status-icon label-width="80px" label-position="right">
        <el-form-item label="名称" prop="deptName">
          <el-input v-model="menuForm.deptName" type="text" placeholder="请输入名称" maxlength="20"/>
        </el-form-item>
        <el-form-item label="编号" prop="deptCode">
          <el-input v-model="menuForm.deptCode" type="text" placeholder="请输入编号" maxlength="20"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('menuForm')">确 定</el-button>
        <el-button @click="resetForm('menuForm')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="编辑"
      width="500px"
      @close="handleClose('menuForm')">
      <el-form ref="menuForm" :model="menuForm" :rules="rules" status-icon label-width="80px" label-position="right">
        <el-form-item label="名称" prop="deptName">
          <el-input v-model="menuForm.deptName" type="text" placeholder="请输入名称" maxlength="20"/>
        </el-form-item>
        <el-form-item label="编号" prop="deptCode">
          <el-input v-model="menuForm.deptCode" type="text" placeholder="请输入编号" maxlength="20"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEditForm('menuForm')">确 定</el-button>
        <el-button @click="resetForm('menuForm')">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout >
</template>
<script src="./deptManager.js"></script>
<style scoped>
  .custom-tree-node {
    flex: .4;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 20px;
  }
  .app-container {
    height: calc(100vh - 200px);
  }
  .el-table th>.cell{
    padding-left: 15px;
  }
  .search-box {
    display: flex;
    flex-direction: row;
  }
  .left-search-box {
    flex-grow: 1;
  }
  .right-btn-box {
    width: 260px;
  }
  .input-item {
    float: left;
    margin-top: 15px;
    margin-right: 10px;
  }
  .search-input {
    width: 160px;
  }
  .input-title{
    width: 35px;
  }
  .setTable>>>.el-table__body-wrapper{
    overflow: auto;
  }
  .app-container >>> .is-left {
    margin-left: 15px;
  }
</style>
