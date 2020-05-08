<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0">
      <div class="search-box">
        <div class="left-search-box">
          <div class="input-item">
            <span class="input-title">标签名称 </span>
            <el-input v-model="labelName" class="search-input" placeholder="请输入标签名称" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <el-button
              class="margin-left"
              size="small"
              type="primary"
              icon="el-icon-search"
              @click="queryClick" >查 询</el-button>
            <el-button
              class="margin-left"
              size="small"
              type="danger"
              @click="clearCondition"
            >
              <svg-icon icon-class="clear"/> 重 置
            </el-button>
          </div>
        </div>
        <div class="right-btn-box">
          <el-button
            style="margin-top: 15px"
            class="float-right margin-left"
            size="small"
            type="primary"
            @click="handleAdd"
          ><svg-icon icon-class="add"/> 新增</el-button>
        </div>
      </div>
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        height="calc(100vh - 280px)"
        border
        fit
        stripe
        highlight-current-row>
        <el-table-column align="center" label="序号" width="95">
          <template slot-scope="scope">
            {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
          </template>
        </el-table-column>
        <el-table-column label="名称" align="center" prop="name"/>
        <el-table-column label="编码" align="center" prop="code" />
        <!-- <el-table-column label="打印机" align="center" prop="print" /> -->
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)">删除</el-button>
            <el-button
              size="mini"
              icon="el-icon-down"
              @click="download(scope.row)"><svg-icon icon-class="pilxz" style="margin-right: 5px"/>下载模版</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="pageNum"
        :page-sizes="[14, 24, 50]"
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
      @close="handleClose('deviceForm')">
      <el-form ref="deviceForm" :model="deviceForm" :rules="rules" label-position="right" status-icon label-width="120px">
        <el-form-item label="名称 " prop="name">
          <el-input v-model="deviceForm.name" maxlength="20" placeholder="请输入名称" type="text"/>
        </el-form-item>
        <el-form-item label="编码 " prop="code">
          <el-input v-model="deviceForm.code" maxlength="20" placeholder="请输入编码" type="text"/>
        </el-form-item>
        <!-- <el-form-item label="打印机 " prop="printId">
          <el-select v-model="deviceForm.printId" placeholder="请选择" style="width: 340px">
            <el-option
              v-for="item in machineOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item> -->
        <el-form-item label="上传文件 " prop="file" class="file-item">
          <el-upload
            ref="upload"
            :auto-upload="true"
            :on-success="onSuccess"
            :on-error="onError"
            :action="fileUrl"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :with-credentials="true"
            accept=".btw"
            class="upload-demo"
          >
            <el-button v-loading="loading" slot="trigger" size="small" type="primary"><svg-icon icon-class="shangchuan"/>  选取文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('deviceForm')">确 定</el-button>
        <el-button @click="addDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="修改"
      width="500px"
      @close="handleClose('deviceForm')">
      <el-form ref="deviceForm" :model="deviceForm" :rules="rules" label-position="right" status-icon label-width="120px">
        <el-form-item label="名称 " prop="name">
          <el-input v-model="deviceForm.name" maxlength="20" placeholder="请输入名称" type="text"/>
        </el-form-item>
        <el-form-item label="编码 " prop="code">
          <el-input v-model="deviceForm.code" maxlength="20" placeholder="请输入编码" type="text"/>
        </el-form-item>
        <!-- <el-form-item label="打印机 " prop="printId">
          <el-select v-model="deviceForm.printId" placeholder="请选择" style="width: 340px">
            <el-option
              v-for="item in machineOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item> -->
        <el-form-item label="上传文件 " prop="file" class="file-item">
          <el-upload
            ref="upload"
            :auto-upload="true"
            :on-success="onSuccess"
            :on-error="onError"
            :action="fileUrl"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :data="uploadParams"
            :with-credentials="true"
            accept=".btw"
            class="upload-demo"
          >
            <el-button v-loading="loading" slot="trigger" size="small" type="primary"><svg-icon icon-class="shangchuan"/>  选取文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editsubmitForm('deviceForm')">确 定</el-button>
        <el-button @click="editDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>
<script src="./deviceSet.js"></script>
<style scoped>
  .app-container{
    position: relative;
    height: calc(100vh - 200px);
  }
  .app-container>>> .cell{
    line-height: 43px;
  }
  .app-container>>> td{
    height: 43px;
  }
  .file-item>>>.el-form-item__error{
    display: none;
  }
  .search-box{
    display: flex;
    flex-direction: row;
  }
  .search-box{
    display: flex;
    flex-direction: row;
  }
  .left-search-box{
    flex-grow: 1;
  }
  .right-btn-box{
    width: 210px;
  }
  .input-item{
    float: left;
    margin-top: 14px;
    margin-right: 10px;
  }
  .search-input{
    width: 255px;
  }
</style>
