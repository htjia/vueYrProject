<template>
  <PageHeaderLayout >
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="字段" prop="name"/>
        <el-table-column align="center" label="使用页面" prop="page"/>
        <el-table-column align="center" label="示例" prop="eg"/>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index)">编辑
            </el-button>
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
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      class="padding-dialog"
      title="编辑基础信息"
      width="1000px"
      @close="handleClose('siteForm')">
      <el-button
        size="small"
        type="primary"
        @click="handleAddItem"
      ><svg-icon icon-class="add"/> 新增</el-button>
      <el-table
        v-loading="listLoading"
        ref="runTable"
        :data="dialogList"
        element-loading-text="拼命加载中"
        height="400"
        class="site-table margin-top"
        highlight-current-row
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="编号" align="center" prop="code">
          <template slot-scope="scope">
            <el-input v-model="scope.row.code" onkeyup="this.value=this.value.replace(/\s+/g,'')" style="width: 95%;" size="small" maxlength="20"/>
          </template>
        </el-table-column>
        <el-table-column label="名称" align="center" prop="code">
          <template slot-scope="scope">
            <el-input v-model="scope.row.name" onkeyup="this.value=this.value.replace(/\s+/g,'')" style="width: 95%;" size="small" maxlength="20"/>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark" style="width: 95%;" size="small" maxlength="20"/>
          </template>
        </el-table-column>
        <el-table-column label="是否启用" align="center" prop="status" width="90">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.status" @change="switchChange(scope.row)"/>
          </template>
        </el-table-column>
        <!--<el-table-column label="新增人" align="center" prop="status" width="100"/>-->
        <!--<el-table-column label="新增时间" align="center" prop="status" width="100" show-overflow-tooltip/>-->
        <el-table-column label="操作" align="center" width="70">
          <template slot-scope="scope">
            <el-button type="danger" round icon="el-icon-close" size="mini" @click="deleteItem(scope.$index)"/>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('machineForm')">确 定</el-button>
        <el-button @click="resetForm('machineForm')">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .site-table>>> .el-checkbox{
    margin-left: 0;
  }
  .site-table>>> .cell{
    line-height: 37px;
  }
  .site-table>>> td{
    height: 37px;
  }
  .padding-dialog>>> .cell{
    line-height: 28px;
  }
  .padding-dialog>>> td{
    height: 28px;
  }
  .padding-dialog>>> .el-dialog__footer{
    padding-top: 0;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 135px);
  }
  .padding-dialog>>> .el-dialog__footer{
    text-align: center;
  }
</style>
