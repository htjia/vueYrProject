<template>
  <PageHeaderLayout >
    <div class="header-search-add">
      <span>工序类型 </span>
      <el-select v-model="proceType" size="small" placeholder="请选择" filterable clearable style="width: 200px">
        <el-option
          v-for="item in proceOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id"/>
      </el-select>
      <span class="has-margin">所属站点 </span>
      <el-select v-model="siteId" size="small" placeholder="请选择" filterable clearable style="width: 200px">
        <el-option
          v-for="item in allSiteList"
          :key="item.id"
          :label="item.name"
          :value="item.id"/>
      </el-select>
      <span class="has-margin">工序名称 </span>
      <el-input v-model="proceName" placeholder="请输入工序名称" size="small" style="width: 200px" clearable maxlength="20"/>
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
        class="proce_table"
        height="calc(100vh - 284px)"
        element-loading-text="拼命加载中"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="工序类型" align="center" prop="mandataryName" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.type === '0'">前段工序</span>
            <span v-if="scope.row.type === '1'">后段工序</span>
          </template>
        </el-table-column>
        <el-table-column label="所属站点" align="center" prop="siteName"/>
        <el-table-column label="工序名称" align="center" prop="name"/>
        <el-table-column label="是否启用" align="center" prop="status">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.status" @change="switchChange(scope.row)"/>
          </template>
        </el-table-column>
        <!--<el-table-column label="程序名称" align="center" prop="programName" show-overflow-tooltip/>-->
        <el-table-column label="制造记录" align="center" prop="remark" show-overflow-tooltip/>
        <el-table-column label="操作" align="center" width="160px">
          <template slot-scope="scope">
            <!--<el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>-->
            <el-button
              v-if="scope.row.isBasic === '1'"
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
      v-drag
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible"
      title="新增工序"
      width="424px"
      @close="handleClose('proceForm')">
      <el-form ref="proceForm" :model="proceForm" :rules="rules" status-icon label-width="90px" label-position="right">
        <el-form-item label="工序类型 " prop="proceType">
          <el-select v-model="proceForm.proceType" placeholder="请选择工序类型" style="width: 295px" filterable @change="proceTypeChange">
            <el-option
              v-for="item in proceOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="所属站点 " prop="proceSite">
          <el-select v-model="proceForm.proceSite" :disabled="siteDisable" placeholder="请选择所属站点" filterable style="width: 295px">
            <el-option
              v-for="item in siteList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="工序名称 " prop="proceName">
          <el-input v-model="proceForm.proceName" placeholder="请输入工序名称" maxlength="20"/>
        </el-form-item>
        <el-form-item label="制造记录 ">
          <el-input v-model="proceForm.remark" type="textarea" placeholder="请输入制造记录" maxlength="50"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('proceForm')">确 定</el-button>
        <el-button @click="resetForm('proceForm')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="编辑工序"
      width="424px"
      @close="handleClose('proceForm')">
      <el-form ref="proceForm" :model="proceForm" :rules="rules" status-icon label-width="90px" label-position="right">
        <el-form-item v-if="notBastic" label="工序类型 " prop="proceType">
          <el-select v-model="proceForm.proceType" placeholder="请选择工序类型" style="width: 295px" filterable @change="proceTypeChange">
            <el-option
              v-for="item in proceOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="notBastic" label="所属站点 " prop="proceSite">
          <el-select v-model="proceForm.proceSite" placeholder="请选择所属站点" style="width: 295px" filterable>
            <el-option
              v-for="item in siteList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="notBastic" label="工序状态 " prop="proceStatus">
          <el-select v-model="proceForm.proceStatus" placeholder="请选择工序状态" style="width: 295px" filterable>
            <el-option
              v-for="item in proceStatusOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="工序名称 " prop="proceName">
          <el-input v-model="proceForm.proceName" placeholder="请输入工序名称" maxlength="20"/>
        </el-form-item>
        <el-form-item label="制造记录 ">
          <el-input v-model="proceForm.remark" type="textarea" placeholder="请输入制造记录" maxlength="50"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEditForm('proceForm')">确 定</el-button>
        <el-button @click="resetForm('proceForm')">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./proceManage.js"></script>

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
  .app-container>>> .cell{
    line-height: 36px;
  }
  .app-container>>> td{
    height: 36px;
  }
  .proce_table >>> .el-checkbox{
    margin-left: 0;
  }
</style>
