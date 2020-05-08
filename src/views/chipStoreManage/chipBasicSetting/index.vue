<template>
  <PageHeaderLayout >
    <div class="app-container">
      <el-button
        class="float-right"
        type="primary"
        size="small"
        @click="handleAdd"
      ><svg-icon icon-class="add"/> 新 增</el-button>
      <el-button
        class="float-right margin-right"
        type="primary"
        size="small"
        @click="handleAddReservedFields"
      ><svg-icon icon-class="add"/> 预留字段管理</el-button>
      <div class="tab-control">
        <span
          :class="{activeTab: activeTabIndex === '入库类型'}"
          @click="tabClick('入库类型')"
        >入库类型</span>
        <span
          :class="{activeTab: activeTabIndex === '芯片产地'}"
          class="has-margin-left"
          @click="tabClick('芯片产地')"
        >芯片产地</span>
        <span
          v-for="item in reservedFields"
          :key="item.name"
          :class="{activeTab: activeTabIndex === item.id}"
          class="has-margin-left"
          @click="tabClick(item.id)"
        >{{ item.name }}</span>
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        height="93%"
        element-loading-text="拼命加载中"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="70">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="名称" prop="name" width="300"/>
        <el-table-column align="center" label="备注" prop="remark" show-overflow-tooltip/>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.isDeleted !== 0"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible"
      class="padding-dialog"
      title="新增"
      width="500px"
      @close="addDialogClose"
    >
      <el-form ref="addForm" :model="addForm" :rules="rules" status-icon label-width="60px" label-position="right">
        <el-form-item label="名称" prop="name">
          <el-input v-model="addForm.name" onkeyup="this.value=this.value.replace(/\s+/g,'')" type="text" maxlength="20"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addForm.remark" type="textarea" maxlength="50"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('addForm')">确 定</el-button>
        <el-button @click="resetForm('addForm')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      class="padding-dialog"
      title="预留字段管理"
      width="800px"
    >
      <el-button
        size="small"
        type="primary"
        @click="handleAddItem"
      ><svg-icon icon-class="add"/> 新增</el-button>
      <el-table
        v-loading="listLoading"
        :data="dialogList"
        element-loading-text="拼命加载中"
        height="222"
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
        <el-table-column label="预留字段名称" align="center" prop="code">
          <template slot-scope="scope">
            <el-input v-model="scope.row.name" :ref="scope.$index" onkeyup="this.value=this.value.replace(/\s+/g,'')" style="width: 95%;" size="small" maxlength="5"/>
          </template>
        </el-table-column>
        <el-table-column label="名称" align="center" prop="code">
          <template slot-scope="scope">
            <el-select v-model="filedValue" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in rieldsOption"
                :key="item.name"
                :label="item.name"
                :value="item.name"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark" style="width: 95%;" size="small" maxlength="50"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="70">
          <template slot-scope="scope">
            <el-button type="danger" round icon="el-icon-close" size="mini" @click="deleteInItem(scope.$index)"/>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitReservedField">确 定</el-button>
        <el-button @click="editDialogVisible = false">取 消</el-button>
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
  .tab-control span{
    width: 90px;
  }
</style>
