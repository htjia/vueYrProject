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
        border
        fit
        height = "calc(100vh - 258px)"
        stripe>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="编号" align="center" prop="code"/>
        <el-table-column label="名称" align="center" prop="name"/>
        <el-table-column label="备注" align="center" prop="remark"/>
        <el-table-column label="操作" align="center" prop="status">
          <template slot-scope="scope">
            <!--<el-button
              size="mini"
              icon="el-icon-edit"
              type="primary"
              @click="handleEdit(scope.row)"
            >编辑</el-button>-->
            <el-button
              size="mini"
              icon="el-icon-delete"
              type="danger"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="pageNum"
        :page-sizes="[15, 25, 50]"
        :page-size="pageSize"
        :total="totalPage"
        class="pagination"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div>
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible"
      title="新增"
      width="500px"
      @close="handleClose('craftForm')">
      <el-form ref="craftForm" :model="craftForm" :rules="rules" status-icon label-width="65px" label-position="right">
        <el-form-item label="编号" prop="code">
          <el-input v-model="craftForm.code" placeholder="请输入编号" type="text" maxlength="20"/>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="craftForm.name" placeholder="请输入名称" type="text" maxlength="20"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="craftForm.remark" placeholder="请输入名称" type="textarea" maxlength="50"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('craftForm')">确 定</el-button>
        <el-button @click="resetForm('craftForm')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="编辑"
      width="500px"
      @close="handleClose('craftForm')">
      <el-form ref="craftForm" :model="craftForm" :rules="rules" status-icon label-width="65px" label-position="right">
        <el-form-item label="编号" prop="code">
          <el-input v-model="craftForm.code" placeholder="请输入编号" type="text" maxlength="20"/>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="craftForm.name" placeholder="请输入名称" type="text" maxlength="20"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="craftForm.remark" placeholder="请输入名称" type="textarea" maxlength="50"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEditForm('craftForm')">确 定</el-button>
        <el-button @click="resetForm('craftForm')">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./craftManage.js"></script>

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
