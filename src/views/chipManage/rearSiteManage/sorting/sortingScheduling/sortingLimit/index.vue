<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0">
      <el-row>
        <el-col :span="24">
          <el-button
            style="float: left;margin-top: 15px;margin-right: 30px;"
            size="small"
            type="primary"
            @click="mulSearchClick" ><svg-icon icon-class="pilcx" style="margin-right: 5px" />批量查询</el-button>
          <div class="input-item">
            <span class="input-title">WaferID</span>
            <el-input v-model="searchKeys.waferId" class="search-input" style="width: 210px" placeholder="请输入WaferID" size="small" maxlength="50" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">限制原因</span>
            <el-input v-model="searchKeys.reason" class="search-input" placeholder="请输入原因" size="small" style="width:300px" maxlength="50" clearable/>
          </div>
          <div style="float: left;">
            <el-button
              style="margin-top: 15px"
              size="small"
              icon="el-icon-search"
              type="primary"
              @click="SearchClick" >查询</el-button>
            <el-button
              style="margin-top: 15px"
              size="small"
              type="danger"
              @click="clearSearch"
            >
              <svg-icon icon-class="clear"/> 重 置
            </el-button>
          </div>
          <div style="float: right;">
            <el-button
              style="margin-top: 15px"
              size="small"
              icon="el-icon-plus"
              type="primary"
              @click="handleAdd" >新增</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        row-key="id"
        element-loading-text="拼命加载中"
        height="calc(100vh - 284px)"
        border
        fit>
        <el-table-column align="center" label="序号" width="95">
          <template slot-scope="scope">
            {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
          </template>
        </el-table-column>
        <el-table-column label="WaferID" width="240" align="center" sortable prop="waferId"/>
        <el-table-column label="原因" align="center" sortable prop="reason"/>
        <el-table-column label="修改时间" width="180" sortable align="center" prop="createTime"/>
        <el-table-column label="操作人" align="center" prop="creatorName"/>
        <el-table-column label="操作" align="center" width="150" max-width="550px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
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
      :visible.sync="queryDialogVisible"
      title="批量查询"
      width="600px"
      @close="handleClose('mulForm')">
      <el-form ref="mulForm" :model="mulForm" :rules="mulRules" status-icon label-width="80px" label-position="right">
        <el-form-item label="WaferID" prop="mulWaferID">
          <el-input v-model="mulForm.mulWaferID" :rows="10" type="textarea" placeholder="请输入多个WaferID,以换行分割" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('mulForm')">确 定</el-button>
        <el-button @click="resetForm('mulForm')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible"
      title="批量添加"
      width="600px"
      @close="handleClose('addForm')">
      <el-form ref="addForm" :model="addForm" :rules="addRules" status-icon label-width="80px" label-position="right">
        <el-form-item label="WaferID" prop="mulWaferID">
          <el-input v-model="addForm.mulWaferID" :rows="6" type="textarea" placeholder="请输入一个或多个WaferID,以换行分割" />
        </el-form-item>
        <el-form-item label="原因" prop="reason">
          <el-input v-model="addForm.reason" :rows="6" type="textarea" maxlength = "200" placeholder="请输入限制原因" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addSubmitForm('addForm')">确 定</el-button>
        <el-button @click="resetForm('addForm')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="编辑"
      width="600px"
      @close="handleClose('editForm')">
      <el-form ref="editForm" :model="editForm" :rules="editRules" status-icon label-width="80px" label-position="right">
        <el-form-item label="WaferID" prop="waferId">
          <el-input v-model="editForm.waferId" maxlength = "200" placeholder="请输入WaferID" />
        </el-form-item>
        <el-form-item label="原因" prop="reason">
          <el-input v-model="editForm.reason" :rows="6" type="textarea" maxlength = "200" placeholder="请输入限制原因" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editSubmitForm('editForm')">确 定</el-button>
        <el-button @click="resetForm('editForm')">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./sortingLimit.js"></script>

<style scoped>
  .input-title{
    width: 75px;
  }
  .input-item{
    float: left;
    margin-top: 14px;
    margin-right: 10px;
    position: relative;
  }
  .search-input{
    width: 200px;
  }

</style>
