<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0">
      <div class="search-box">
        <div class="left-search-box" style="margin-left: -10px;">
          &nbsp;
        </div>
        <div class="right-btn-box">
          <!-- <el-button
            style="margin-top: 15px"
            class="float-right margin-left"
            size="small"
            type="danger"
            @click="clearAll"
          >
            <svg-icon icon-class="clear"/> 重 置
          </el-button> -->
          <el-button
            style="margin-top: 15px"
            class="float-right"
            size="small"
            type="primary"
            @click="handleAdd" ><svg-icon icon-class="add"/> 新增</el-button>
        </div>
      </div>
    </div>
    <div class="app-container left">
      <el-table
        v-loading="listLoading"
        :data="list"
        row-key="index"
        element-loading-text="拼命加载中"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="异常分类" align="center" prop="name"/>
        <el-table-column label="修改人" align="center" prop="modifierName"/>
        <el-table-column label="是否启用" align="center" prop="status">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isChecked" @change="setStatus(scope.row)">启用</el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark"/>
        <el-table-column label="操作" align="center" prop="status">
          <template slot-scope="scope">
            <i @click="handleUp(scope.$index)"><svg-icon style="color: #009494;font-size: 20px;cursor: pointer;" icon-class="top" /></i>
            <i @click="handleDown(scope.$index)"><svg-icon style="color: #009494;font-size: 20px;cursor: pointer;" icon-class="bottom" /></i>
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              icon="el-icon-delete"
              type="danger"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible"
      title="新增"
      width="500px"
      @close="handleClose('programForm')">
      <el-form ref="programForm" :model="programForm" :rules="rules" status-icon label-width="80px" label-position="right">
        <el-form-item label="异分类型" prop="name">
          <el-input v-model="programForm.name" placeholder="请输入稽核项目" type="text" maxlength="20"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="programForm.remark" :rows="5" placeholder="请输入备注" type="textarea" maxlength="50"/>
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
      <el-form ref="programForm" :model="programForm" :rules="rules" status-icon label-width="80px" label-position="right">
        <el-form-item label="异分类型" prop="name">
          <el-input v-model="programForm.name" placeholder="请输入稽核项目" type="text" maxlength="20"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="programForm.remark" :rows="5" placeholder="请输入备注" type="textarea" maxlength="50"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEditForm('programForm')">确 定</el-button>
        <el-button @click="resetForm('programForm')">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
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
    margin-top: 15px;
    margin-right: 10px;
  }
  .search-input{
    width: 135px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 200px);
  }
</style>
