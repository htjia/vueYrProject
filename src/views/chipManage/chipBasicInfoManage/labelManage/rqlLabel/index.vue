<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0">
      <div class="search-box">
        <div class="left-search-box">
          <div class="input-item">
            <span class="input-title" style="width:35px">型号 </span>
            <el-select v-model="model" class="search-input" style="width:180px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in modelList"
                :key="item.id"
                :label="item.code"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-search"
              @click="handleSearch" >查询</el-button>
          </div>
        </div>
        <div class="right-btn-box">
          <el-button
            style="margin-top: 15px"
            class="float-right margin-left"
            size="small"
            type="primary"
            @click="handleAdd"><svg-icon icon-class="add"/> 新增</el-button>
        </div>
      </div>
    </div>
    <div class="app-container run-table">
      <el-table
        v-loading="listLoading"
        :data="list"
        :cell-style="tableRowClassColor"
        element-loading-text="拼命加载中"
        height="calc(100vh - 285px)"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
          </template>
        </el-table-column>
        <el-table-column v-for="value in titleList" :key="value.cnname" :label="value.cnname" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[value.enname] }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" prop="status" width="180px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-edit"
              type="primary"
              @click="handleEdit(scope.row)">编辑</el-button>
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
      width="500px"
      @close="handleClose('machineForm')">
      <el-form ref="machineForm" :model="machineForm" :rules="rules" status-icon label-width="100px" label-position="right">
        <el-form-item label="光色 " prop="colorId">
          <el-select v-model="machineForm.colorId" class="search-input" style="width: 365px;" size="small" placeholder="请选择光色" filterable clearable>
            <el-option
              v-for="item in colorList"
              :key="item.id"
              :label="item.code"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="型号 " prop="modelId">
          <el-select v-model="machineForm.modelId" class="search-input" style="width: 365px;" size="small" placeholder="请选择型号" filterable clearable>
            <el-option
              v-for="item in modelList"
              :key="item.id"
              :label="item.code"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item v-for="value in addLabelList" :key="value.cnname" :label="value.cnname" :prop="value.enname">
          <el-input v-model="machineForm[value.enname]" size="small" placeholder="请输入" maxlength="15"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('machineForm')">确 定</el-button>
        <el-button @click="addDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="编辑"
      width="500px"
      @close="handleClose('machineForm')">
      <el-form ref="machineForm" :model="machineForm" :rules="rules" status-icon label-width="100px" label-position="right">
        <el-form-item label="光色 " prop="colorId">
          <el-select v-model="machineForm.colorId" class="search-input" style="width: 365px;" size="small" placeholder="请选择光色" filterable clearable>
            <el-option
              v-for="item in colorList"
              :key="item.id"
              :label="item.code"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="型号 " prop="modelId">
          <el-select v-model="machineForm.modelId" class="search-input" style="width: 365px;" size="small" placeholder="请选择型号" filterable clearable>
            <el-option
              v-for="item in modelList"
              :key="item.id"
              :label="item.code"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item v-for="value in addLabelList" :key="value.cnname" :label="value.cnname" :prop="value.enname">
          <el-input v-model="machineForm[value.enname]" size="small" placeholder="请输入" maxlength="15"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editsubmitForm('machineForm')">确 定</el-button>
        <el-button @click="editDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .app-container{
    position: relative;
    height: calc(100vh - 205px);
  }
  .tab-control span{
    line-height: 50px;
  }
  .el-checkbox {
    margin-left: 0px;
  }
  .search-box{
    display: flex;
    flex-direction: row;
  }
  .left-search-box{
    flex-grow: 1;
  }
  .right-btn-box{
    width: 260px;
  }
  .input-item{
    float: left;
    margin-top: 15px;
    margin-right: 10px;
  }
  .search-input{
    width: 160px;
  }
  .run-table ::-webkit-scrollbar {/*滚动条整体样式*/
    height: 10px !important;
  }
</style>
