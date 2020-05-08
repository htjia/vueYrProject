<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0">
      <el-button
        style="margin-top: 15px"
        class="float-right margin-left"
        size="small"
        type="primary"
        @click="handleAdd"><svg-icon icon-class="add"/> 新 增</el-button>
      <div class="clear-both"/>
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        border
        fit
        height = "calc(100vh - 310px)"
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="编号" align="center" prop="code"/>
        <el-table-column label="光色" align="center" prop="color"/>
        <el-table-column label="型号" align="center" prop="name"/>
        <el-table-column label="备注" align="center" prop="remark"/>
        <el-table-column label="操作" align="center" prop="status">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-edit"
              type="primary"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
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
      title="新增光色"
      width="500px"
      @close="handleClose('colorModelForm')">
      <el-form ref="colorModelForm" :model="colorModelForm" :rules="rules" status-icon label-width="65px" label-position="right">
        <el-form-item label="光色 " prop="colors">
          <el-select v-model="colorModelForm.colors" style="width:395px" placeholder="请输入光色" type="text" filterable clearable>
            <el-option
              v-for="item in colorList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="名称 " prop="name">
          <el-input v-model="colorModelForm.name" placeholder="请输入名称" type="text" maxlength="20"/>
        </el-form-item>
        <el-form-item label="编号 " prop="code">
          <el-input v-model="colorModelForm.code" placeholder="请输入编号" type="text" maxlength="10"/>
        </el-form-item>
        <el-form-item label="备注 ">
          <el-input v-model="colorModelForm.remark" placeholder="请输入备注" type="text" maxlength="50"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('colorModelForm')">确 定</el-button>
        <el-button @click="resetForm('colorModelForm')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="编辑光色"
      width="500px"
      @close="handleClose('colorModelForm')">
      <el-form ref="colorModelForm" :model="colorModelForm" :rules="rules" status-icon label-width="65px" label-position="right">
        <el-form-item label="光色 " prop="colors">
          <el-select v-model="colorModelForm.colors" style="width:395px" placeholder="请输入光色" type="text" filterable clearable>
            <el-option
              v-for="item in colorList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="名称 " prop="name">
          <el-input v-model="colorModelForm.name" placeholder="请输入名称" type="text" maxlength="20"/>
        </el-form-item>
        <el-form-item label="编号 " prop="code">
          <el-input v-model="colorModelForm.code" placeholder="请输入编号" type="text" maxlength="10"/>
        </el-form-item>
        <el-form-item label="备注 ">
          <el-input v-model="colorModelForm.remark" placeholder="请输入备注" type="text" maxlength="50"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEditForm('colorModelForm')">确 定</el-button>
        <el-button @click="resetForm('colorModelForm')">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./colorModelsManage.js"></script>

<style scoped>
  .app-container{
    position: relative;
    height: calc(100vh - 207px);
  }
  .tab-control span{
    line-height: 50px;
  }
  .el-checkbox {
    margin-left: 0px;
  }
</style>
