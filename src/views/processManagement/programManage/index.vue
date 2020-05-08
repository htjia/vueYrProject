<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top:0px">
      <div class="left-search-box">
        <div class="input-item">
          <span class="input-title" style="width:35px">工序 </span>
          <el-input v-model="processName" class="search-input" size="small" placeholder="请输入" maxlength="20" clearable/>
        </div>
        <div class="input-item">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="handleSearch" >查询</el-button>
        </div>
      </div>
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
        <el-table-column label="工序" align="center" prop="processName"/>
        <el-table-column label="编号" align="center" prop="code"/>
        <el-table-column label="名称" align="center" prop="name"/>
        <el-table-column label="备注" align="center" prop="remark" width="460px" show-overflow-tooltip=""/>
        <el-table-column label="是否启用" align="center" prop="status">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isChecked" @change="setStatus(scope.row)"/>
          </template>
        </el-table-column>
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
      @close="handleClose('programForm')">
      <el-form ref="programForm" :model="programForm" :rules="rules" status-icon label-width="65px" label-position="right">
        <el-form-item label="工序" prop="processId">
          <el-select v-model="programForm.processId" placeholder="请选择" style="width:394px" filterable>
            <el-option
              v-for="item in processLists"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="编号" prop="code">
          <el-input v-model="programForm.code" placeholder="请输入编号" type="text" maxlength="20"/>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="programForm.name" placeholder="请输入名称" type="text" maxlength="20"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="programForm.remark" placeholder="请输入备注" type="textarea" maxlength="50"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('programForm')">确 定</el-button>
        <el-button @click="resetForm('programForm')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="编辑"
      width="500px"
      @close="handleClose('programForm')">
      <el-form ref="programForm" :model="programForm" :rules="rules" status-icon label-width="65px" label-position="right">
        <el-form-item label="工序" prop="processId">
          <el-select v-model="programForm.processId" placeholder="请选择" style="width:394px" filterable>
            <el-option
              v-for="item in processLists"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="编号" prop="code">
          <el-input v-model="programForm.code" placeholder="请输入编号" type="text" maxlength="20"/>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="programForm.name" placeholder="请输入名称" type="text" maxlength="20"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="programForm.remark" placeholder="请输入备注" type="textarea" maxlength="50"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEditForm('programForm')">确 定</el-button>
        <el-button @click="resetForm('programForm')">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./programManage.js"></script>

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
  .input-item{
    float: left;
    margin-top: 15px;
    margin-right: 10px;
  }
  .search-input{
    width: 160px;
  }
  .left-search-box{
    flex-grow: 1;
  }
</style>
