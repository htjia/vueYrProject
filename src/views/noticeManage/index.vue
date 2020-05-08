<template>
  <PageHeaderLayout >
    <div class="">
      <HeaderSearchAdd placeholder-text = "请输入公告名称" @handleSearch="handleSearch" @handleAdd="handleAdd"/>
      <div class="app-container">
        <el-table
          v-loading="listLoading"
          :data="list"
          height="92%"
          element-loading-text="拼命加载中"
          border
          fit
          stripe
          highlight-current-row>
          <el-table-column align="center" label="序号" width="60">
            <template slot-scope="scope">
              {{ (pageNum - 1) * pageSize + scope.$index+1 }}
            </template>
          </el-table-column>
          <el-table-column label="公告名称" align="center" prop="title" width="260" />
          <el-table-column label="公告内容" align="center" prop="content"/>
          <el-table-column label="附件" align="center" prop="driveProgramName" width="260" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-for="item in scope.row.attachmentList" :key="item.id" class="import-fill" @click="exportFill(item)" v-text="item.name"/>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80" align="center" prop="status">
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
        v-drag
        :close-on-click-modal="false"
        :visible.sync="addDialogVisible"
        title="添加"
        width="500px"
        @close="handleClose('noticeForm')">
        <el-form ref="noticeForm" :model="noticeForm" :rules="rules" label-position="right" status-icon label-width="80px">
          <el-form-item label="公告名称 " prop="name">
            <el-input v-model="noticeForm.name" maxlength="20" type="text"/>
          </el-form-item>
          <el-form-item label="公告内容 " prop="content">
            <el-input v-model="noticeForm.content" maxlength="50" type="textarea"/>
          </el-form-item>
          <el-form-item label="发布范围 " prop="issueRange">
            <div class="tree-box">
              <el-tree
                ref="tree"
                :data="treeList"
                :props="defaultProps"
                :default-expand-all="false"
                class="tree"
                show-checkbox
                node-key="id"/>
            </div>
          </el-form-item>
          <el-form-item label="附件 " class="file-item">
            <el-upload
              ref="upload"
              :on-remove="handleRemove"
              :file-list="fileList"
              :auto-upload="false"
              :on-change="uploadChange"
              :on-success="onSuccess"
              :with-credentials="true"
              :action="fileUrl"
              :limit="1"
              class="upload-demo"
            >
              <!--:on-exceed="onExceed"-->
              <el-button slot="trigger" :disabled="fileList.length === 1" size="small" type="primary">选取文件</el-button>
              <!-- style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>-->
              <!--<span slot="tip" class="el-upload__tip" style="margin-left: 15px;">只能上传 dll 文件，且只能上传一份</span>-->
            </el-upload>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button :loading="loading" type="primary" @click="submitForm('noticeForm')">确 定</el-button>
          <el-button @click="resetForm('noticeForm')">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </PageHeaderLayout>
</template>
<script src="./noticeManage.js"></script>
<style scoped>
  .tree>>> .el-tree-node__label{
    margin-left: 10px;
  }
  .file-item>>>.el-form-item__error{
    display: none;
  }
  .tree-box{
    max-height: 280px;
    overflow: auto;
    border: 1px solid #e2e2e2;
    border-radius: 5px;
  }
  .import-fill{
    cursor: pointer;
    color: #009494;
    text-decoration: underline;
    margin-right: 6px;
  }
</style>
