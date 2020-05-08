<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0">
      <div class="search-box">
        <div class="left-search-box">
          <div class="input-item">
            <span class="input-title">亮度范围 </span>
            <el-select v-model="scope" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in fwList"
                :key="item.id"
                :label="item.scope"
                :value="item.scope"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">代码 </span>
            <el-input v-model="code" class="search-input" size="small" maxlength="20" clearable/>
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
        </div>
      </div>
    </div>
    <div class="app-container">
      <div class="table-top-btn-group">
        <div
          :class="{'active':isActive === 0}"
          @click="navClick(0)"
        >
          圆片
        </div>
        <div
          :class="{'active':isActive === 1}"
          @click="navClick(1)"
        >
          方片
        </div>
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        height="calc(100vh - 320px)"
        border
        fit>
        <el-table-column align="center" label="亮度范围" prop="scope"/>
        <el-table-column label="代码" align="center" prop="code" show-overflow-tooltip/>
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
      width="500px"
      @close="handleClose('machineForm')">
      <el-form ref="machineForm" :model="machineForm" :rules="rules" status-icon label-width="100px" label-position="right">
        <el-form-item label="亮度范围 " required>
          <!-- <el-input v-model="machineForm.scope" placeholder="请输入亮度" maxlength="10"/> -->
          <el-row>
            <el-col :span="11">
              <el-form-item prop="scope">
                <el-input v-model="machineForm.scope" size="small" placeholder="请输入" maxlength="5"/>
              </el-form-item>
            </el-col>
            <el-col :span="2" style="text-align:center">
              -
            </el-col>
            <el-col :span="11">
              <el-form-item prop="scope1">
                <el-input v-model="machineForm.scope1" size="small" placeholder="请输入" maxlength="5"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="代码 " prop="code">
          <el-input v-model="machineForm.code" placeholder="请输入代码" maxlength="5"/>
        </el-form-item>
      </el-form>
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
      <el-form ref="machineForm" :model="machineForm" :rules="rules" status-icon label-width="100px" label-position="right">
        <el-form-item label="亮度范围 " required>
          <el-row>
            <el-col :span="11">
              <el-form-item prop="scope">
                <el-input v-model="machineForm.scope" size="small" placeholder="请输入" maxlength="5"/>
              </el-form-item>
            </el-col>
            <el-col :span="2" style="text-align:center">
              -
            </el-col>
            <el-col :span="11">
              <el-form-item prop="scope1">
                <el-input v-model="machineForm.scope1" size="small" placeholder="请输入" maxlength="5"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="代码 " prop="code">
          <el-input v-model="machineForm.code" placeholder="请输入代码" maxlength="5"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editsubmitForm('machineForm')">确 定</el-button>
        <el-button @click="resetForm('machineForm')">取 消</el-button>
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
  .table-top-btn-group{
    overflow: hidden;
  }
  .table-top-btn-group>div{
    float: left;
    margin-left: 15px;
    height: 35px;
    line-height: 35px;
    padding: 0 15px;
    border: 1px solid #e2e2e2;
    cursor: pointer;
  }
  .table-top-btn-group>div.active{
    color: #fff;
    background: #009494;
    border-color: #009494;
  }
  .app-container>>> .el-table--border {
    border-top: 2px solid #009494;
  }
</style>
