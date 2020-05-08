<template>
  <PageHeaderLayout >
    <div class="header-search-add">
      <span class="option-title">站点类型 </span>
      <el-select v-model="siteType" size="small" placeholder="请选择站点类型" filterable clearable style="width: 260px">
        <el-option
          v-for="item in siteSelectOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id"/>
      </el-select>
      <span class="has-margin">站点名称 </span>
      <el-input v-model="siteName" placeholder="请输入站点名称" size="small" style="width: 260px" maxlength="20" clearable/>
      <el-button size="small" style="margin-left: 10px" type="primary" icon="el-icon-search" @click="handleSearch" >查 询</el-button>
      <el-button
        size="small"
        class="float-right-btn"
        type="primary"
        @click="handleAdd"><svg-icon icon-class="add"/> 新 增</el-button>
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="站点类型" align="center" prop="mandataryName">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 0">前段站点</span>
            <span v-if="scope.row.type === 1">后段站点</span>
          </template>
        </el-table-column>
        <el-table-column label="站点名称" align="center" prop="name"/>
        <el-table-column label="站点状态" align="center" prop="status">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0" style="color: #009494;font-weight: bold">启用</span>
            <span v-if="scope.row.status === 1" style="color: #f33;font-weight: bold">停用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" max-width="550px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              v-if="scope.row.isbastic === 1"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="pageNum"
        :page-sizes="[15, 30, 40]"
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
      title="新增站点"
      width="400px"
      @close="handleClose('siteForm')">
      <el-form ref="siteForm" :model="siteForm" :rules="rules" status-icon label-width="100px" label-position="right">
        <el-form-item label="站点类型 " prop="siteType">
          <el-select v-model="siteForm.siteType" placeholder="请选择站点类型" style="width: 260px" filterable>
            <el-option
              v-for="item in siteOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="站点状态 " prop="siteStatus">
          <el-select v-model="siteForm.siteStatus" placeholder="请选择站点状态" style="width: 260px" filterable>
            <el-option
              v-for="item in siteStatusOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="站点名称 " prop="siteName">
          <el-input v-model="siteForm.siteName" placeholder="请输入站点名称" maxlength="20"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('siteForm')">确 定</el-button>
        <el-button @click="resetForm('siteForm')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="编辑站点"
      width="400px"
      @close="handleClose('siteForm')">
      <el-form ref="siteForm" :model="siteForm" :rules="rules" status-icon label-width="100px" label-position="right">
        <el-form-item v-if="notBastic" label="站点类型 " prop="siteType">
          <el-select v-model="siteForm.siteType" placeholder="请选择站点类型" style="width: 260px" filterable>
            <el-option
              v-for="item in siteOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="notBastic" label="站点状态 " prop="siteType">
          <el-select v-model="siteForm.siteStatus" placeholder="请选择站点状态" style="width: 260px" filterable>
            <el-option
              v-for="item in siteStatusOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="站点名称 " prop="siteName">
          <el-input v-model="siteForm.siteName" placeholder="请输入站点名称" maxlength="20"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEditForm('siteForm')">确 定</el-button>
        <el-button @click="resetForm('siteForm')">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 10px;
    top: 3px;
  }
  .app-container{
    height: calc(100vh - 207px);
  }
</style>
