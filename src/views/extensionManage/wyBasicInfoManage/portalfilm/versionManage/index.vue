<template>
  <PageHeaderLayout >
    <div class="app-container">
      <el-button
        size="small"
        class="float-right"
        style="margin-bottom: 10px"
        type="primary"
        @click="handleAdd"
      ><svg-icon icon-class="add"/> 新 增</el-button>
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        height="calc(100vh - 253px)"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
          </template>
        </el-table-column>
        <el-table-column label="编号" align="center" prop="code"/>
        <el-table-column label="名称" align="center" prop="name"/>
        <el-table-column label="备注" align="center" prop="remark" width="460"/>
        <el-table-column label="启用" align="center" prop="status">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isChecked" @change="setStatus(scope.row)">&nbsp;</el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="status">
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
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible"
      title="新增"
      width="500px">
      <el-form ref="siteForm" :model="siteForm" :rules="rules" status-icon label-width="65px" label-position="right">
        <el-form-item label="编号 " prop="code">
          <el-input v-model="siteForm.code" placeholder="请输入编号" maxlength="20"/>
        </el-form-item>
        <el-form-item label="名称 " prop="name">
          <el-input v-model="siteForm.name" placeholder="请输入名称" maxlength="20"/>
        </el-form-item>
        <el-form-item label="备注 " prop="remark">
          <el-input v-model="siteForm.remark" type="textarea" placeholder="请输入备注" maxlength="50"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('siteForm')">确 定</el-button>
        <el-button @click="resetForm('siteForm')">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .app-container{
    position: relative;
    height: calc(100vh - 132px);
  }
  .tab-control span{
    line-height: 50px;
  }
  .tab-control span{
    width: 110px;
  }
  .tab-control span+span{
    width: 80px;
  }
</style>
