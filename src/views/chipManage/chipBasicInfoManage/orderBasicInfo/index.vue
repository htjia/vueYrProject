<template>
  <PageHeaderLayout >
    <div class="app-container">
      <el-button
        class="float-right"
        style="margin-bottom:15px"
        type="primary"
        @click="handleAdd"
      ><svg-icon icon-class="add"/> 新 增</el-button>
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        height="calc(100vh - 265px)"
        highlight-current-row
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="名称" align="center" prop="name"/>
        <el-table-column label="编码" align="center" prop="code"/>
        <el-table-column label="备注" align="center" prop="remark"/>
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
      :title="'新增'+ ''"
      width="500px"
      @close="handleClose('substrateForm')">
      <el-form ref="substrateForm" :model="substrateForm" :rules="rules" status-icon label-width="65px" label-position="right">
        <el-form-item label="名称 " prop="name">
          <el-input ref="name" v-model="substrateForm.name" type="text" placeholder="请输入名称" maxlength="20"/>
        </el-form-item>
        <el-form-item label="编码 " prop="code">
          <el-input ref="name" v-model="substrateForm.code" type="text" placeholder="请输入名称" maxlength="20"/>
        </el-form-item>
        <el-form-item label="备注 ">
          <el-input v-model="substrateForm.remark" type="textarea" placeholder="请输入备注" maxlength="50"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('substrateForm')">确 定</el-button>
        <el-button @click="resetForm('substrateForm')">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./orderBasicInfo.js"></script>

<style scoped>
  .app-container{
    position: relative;
    height: calc(100vh - 132px);
  }
  .tab-control span{
    line-height: 50px;
  }
  .el-checkbox {
    margin-left: 0px;
  }
  .header-search {
    margin: 10px 0;
  }
.input-item{
    float: left;
    margin-right: 10px;
    margin-top: 0;
  }
  .search-input{
    width: 180px;
  }
    .close {
      position: absolute;
      z-index: 10;
      right: -800px;
      top: 0;
      width: 800px;
      height: 100%;
      background: #fff;
      transition: all linear 0.3s;
    }
    .open {
      position: absolute;
      z-index: 10;
      right: 0;
      top: 0;
      width: 800px;
      height: 100%;
      background: #b2dfdf;
      transition: all linear 0.3s;
    }
    .header {
      margin: 0 20px;
      height: 56px;
      border-bottom: 1px solid #dddddd;
    }
    p {
      margin-top: 18px;
    }

</style>
