<template>
  <PageHeaderLayout >
    <div class="app-container left">
      <el-table
        v-loading="listLoading"
        :data="list"
        row-key="index"
        element-loading-text="拼命加载中"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="项目" align="center" prop="name"/>
        <el-table-column label="检验数" align="center" prop="num"/>
        <el-table-column label="操作" align="center" prop="status">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="编辑"
      width="500px"
      @close="handleClose('programForm')">
      <el-form ref="programForm" :model="programForm" :rules="rules" status-icon label-width="80px" label-position="right">
        <el-form-item label="检验片数" prop="name">
          <el-input v-model="programForm.name" placeholder="请输入检验片数" type="text" maxlength="2"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEditForm('programForm')">确 定</el-button>
        <el-button @click="resetForm('programForm')">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .search-box{
    display: flex;
    flex-direction: row;
  }
  .left-search-box{
    flex-grow: 1;
  }
  .right-btn-box{
    width: 210px;
  }
  .input-item{
    float: left;
    margin-top: 15px;
    margin-right: 10px;
  }
  .search-input{
    width: 135px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 131px);
  }
</style>
