<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0">
      <div class="search-box">
        <div class="left-search-box">
          <div class="input-item">
            <span class="input-title">副品分类 </span>
            <el-select v-model="classifyCode" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in letList"
                :key="item.id"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">代码 </span>
            <el-input v-model="detailCode" class="search-input" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-search"
              @click="handleSearch" >查询</el-button>
            <el-button
              size="small"
              type="danger"
              @click="clearAll"
            >
              <svg-icon icon-class="clear"/> 重置
            </el-button>
          </div>
        </div>
        <div class="right-btn-box">
          <el-button
            style="margin-top: 15px"
            class="float-right margin-left"
            size="small"
            type="primary"
            @click="handleAdd"><svg-icon icon-class="add"/> 新增</el-button>
          <el-button
            style="margin-top: 15px"
            class="float-right margin-left"
            size="small"
            type="primary"
            @click="handleFP"><svg-icon icon-class="shezhi"/> 副品管理</el-button>
        </div>
      </div>
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        :span-method="objectSpanMethod"
        element-loading-text="拼命加载中"
        height="calc(100vh - 285px)"
        border
        fit>
        <el-table-column align="center" label="副品分类" prop="fpCode" show-overflow-tooltip/>
        <el-table-column label="代码" align="center" prop="code" show-overflow-tooltip/>
        <el-table-column label="异常描述" align="center" prop="exceptionRemark" show-overflow-tooltip/>
        <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip/>
        <el-table-column label="修改人" align="center" prop="creatorName" show-overflow-tooltip/>
        <el-table-column label="修改时间" align="center" prop="createTime" show-overflow-tooltip/>
        <el-table-column label="操作" align="center" prop="status" width="180px">
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
      width="500px">
      <el-form ref="machineForm" :model="machineForm" :rules="rules" status-icon label-width="108px" label-position="right">
        <el-form-item label="副品分类 " prop="classifyId">
          <el-select v-model="machineForm.classifyId" style="width: 360px;" placeholder="请选择" filterable>
            <el-option
              v-for="item in fpList"
              :key="item.id"
              :label="item.code"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="代码 " prop="code">
          <el-input v-model="machineForm.code" placeholder="请输入名称" maxlength="5"/>
        </el-form-item>
        <el-form-item label="异常描述 " prop="exceptionRemark">
          <el-input v-model="machineForm.exceptionRemark" placeholder="请输入异常描述" maxlength="100"/>
        </el-form-item>
        <el-form-item label="是否异常处理 " prop="isDispose">
          <el-select v-model="machineForm.isDispose" style="width: 360px;" placeholder="请选择" filterable>
            <el-option
              v-for="item in disPostList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <span style="margin-left:90px">注：若需异常处理，则当目检后片子直接进入异常队列。</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('machineForm')">确 定</el-button>
        <el-button @click="resetForm('machineForm')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="修改"
      width="500px"
      @close="handleClose('machineForm')">
      <el-form ref="machineForm" :model="machineForm" :rules="rules" status-icon label-width="108px" label-position="right">
        <el-form-item label="副品分类 " prop="classifyId">
          <el-select v-model="machineForm.classifyId" style="width: 360px;" placeholder="请选择" filterable>
            <el-option
              v-for="item in fpList"
              :key="item.id"
              :label="item.code"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="代码 " prop="code">
          <el-input v-model="machineForm.code" placeholder="请输入名称" maxlength="5"/>
        </el-form-item>
        <el-form-item label="异常描述 " prop="exceptionRemark">
          <el-input v-model="machineForm.exceptionRemark" placeholder="请输入异常描述" maxlength="100"/>
        </el-form-item>
        <el-form-item label="是否异常处理 " prop="isDispose">
          <el-select v-model="machineForm.isDispose" style="width: 360px;" placeholder="请选择" filterable>
            <el-option
              v-for="item in disPostList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <span style="margin-left:90px">注：若需异常处理，则当目检后片子直接进入异常队列。</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editsubmitForm('machineForm')">确 定</el-button>
        <el-button @click="resetForm('machineForm')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="fpaddDialogVisible"
      class="confing-dialog"
      title="副品管理"
      width="1000px">
      <el-button type="primary" style="margin-bottom:15px;margin-top:-15px;" size="small" @click="addConfig()"><svg-icon icon-class="add"/> 新增</el-button>
      <el-table
        :data="fpList"
        element-loading-text="拼命加载中"
        class="run-table"
        height="400px"
        border
        fit>
        <el-table-column label="序号" align="center" width="50px">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="副品名称" align="center" width="100px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.code" class="search-input" size="small" style="width:90%" maxlength="5"/>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark" class="search-input" size="small" style="width:90%" maxlength="50"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="status" width="180px">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.id !==0"
              size="mini"
              icon="el-icon-edit"
              type="primary"
              @click="updateFP(scope.row)">修改</el-button>
            <el-button
              v-if="scope.row.id ===0"
              size="mini"
              icon="el-icon-check"
              type="primary"
              @click="saveNewFP(scope.row)"
            >保存</el-button>
          </template>
        </el-table-column>
      </el-table>
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
  .confing-dialog>>> .el-dialog__body {
    padding-bottom: 12px;
  }
</style>
