<template>
  <PageHeaderLayout >
    <div class="app-container parameter-table">
      <el-button
        class="float-right margin-left"
        size="mini"
        type="primary"
        @click="handleAdd"
      ><svg-icon icon-class="add"/> 新 增</el-button>
      <el-button
        v-if="activeTabIndex === 2"
        size="mini"
        class="float-right"
        type="primary"
        @click="handleManage"
      >目检结果管理</el-button>
      <div class="tab-control">
        <span
          :class="{activeTab: activeTabIndex === 0}"
          @click="tabClick(0)"
        >目检判断原因</span>
        <span
          :class="{activeTab: activeTabIndex === 1}"
          class="has-margin-left"
          @click="tabClick(1)"
        >目检级别</span>
        <span
          :class="{activeTab: activeTabIndex === 2}"
          class="has-margin-left"
          @click="tabClick(2)"
        >目检关系</span>
      </div>
      <div v-if="activeTabIndex === 2" class="table-top-btn-group mt10">
        <div
          v-for="item in sizeList"
          :class="{'active':isActive === item.id}"
          :key="item.id"
          @click="navClick(item.id)"
        >
          {{ item.name }}
        </div>
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        :key="tableKey"
        :height="(activeTabIndex === 2) ? 'calc(100vh - 247px)':'calc(100vh - 260px)'"
        element-loading-text="拼命加载中"
        border
        fit>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
          </template>
        </el-table-column>
        <el-table-column v-if="activeTabIndex < 2" label="编号" align="center" prop="code"/>
        <el-table-column v-if="activeTabIndex === 2" label="目检结果" align="center" prop="name"/>
        <el-table-column v-if="activeTabIndex === 2" label="目检等级" align="center" prop="visualName">
          <template slot-scope="scope">
            <span v-if="!scope.row.edit">{{ scope.row.visualName }}</span>
            <el-select v-else v-model="scope.row.ids" multiple collapse-tags size="mini" style="width: 100%" placeholder="请选择目检结果">
              <el-option v-for="item in lookLeavel" :disabled="item.disabled" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column v-if="activeTabIndex < 2" label="目检等级" align="center" prop="name"/>
        <el-table-column v-if="activeTabIndex === 1" label="快捷键" align="center" prop="quickSearch"/>
        <el-table-column v-if="activeTabIndex < 2" label="备注" align="center" prop="remark" width="460"/>
        <el-table-column v-if="activeTabIndex < 2" label="是否启用" align="center" prop="status">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isChecked" @change="setStatus(scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="status" width="180">
          <template slot-scope="scope">
            <el-button
              v-if="activeTabIndex === 2 && scope.row.edit === false"
              size="mini"
              icon="el-icon-edit"
              type="primary"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              v-if="activeTabIndex === 1"
              size="mini"
              icon="el-icon-edit"
              type="primary"
              @click="handleEdits(scope.row)"
            >编辑</el-button>
            <el-button
              v-if="activeTabIndex === 2 && scope.row.edit === true"
              size="mini"
              icon="el-icon-check"
              type="primary"
              @click="handleSubmitItem(scope.row)"
            >保存</el-button>
            <el-button
              v-if="activeTabIndex === 2 && scope.row.edit === true"
              size="mini"
              icon="el-icon-close"
              type="danger"
              @click="handleCancel(scope.row)"
            >取消</el-button>
            <el-button
              v-if="activeTabIndex < 2"
              size="mini"
              icon="el-icon-delete"
              type="danger"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="activeTabIndex < 2"
        :current-page="pageNum"
        :page-sizes="[12, 30, 40]"
        :page-size="pageSize"
        :total="totalPage"
        class="pagination"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="sizeChange"
        @current-change="currentChange"/>
    </div>
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible"
      title="新增"
      width="500px">
      <el-form ref="siteForm" :model="siteForm" :rules="rules" status-icon label-width="80px" label-position="right">
        <el-form-item label="编号 " prop="code">
          <el-input v-model="siteForm.code" placeholder="请输入编号" maxlength="20"/>
        </el-form-item>
        <!-- <el-form-item v-if="activeTabIndex === 1" label="目检结果 " prop="isDeleted">
          <el-select v-model="siteForm.isDeleted" style="width: 100%" placeholder="请选择目检结果">
            <el-option v-for="item in visualList" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item> -->
        <el-form-item label="目检等级 " prop="name">
          <el-input v-model="siteForm.name" placeholder="请输入目检结果" maxlength="20"/>
        </el-form-item>
        <el-form-item v-if="activeTabIndex === 1" label="快捷键 " prop="quickSearch">
          <el-input v-model="siteForm.quickSearch" placeholder="请输入快捷键" maxlength="1"/>
        </el-form-item>
        <el-form-item label="备注 ">
          <el-input v-model="siteForm.remark" type="textarea" placeholder="请输入备注" maxlength="50"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('siteForm')">确 定</el-button>
        <el-button @click="resetForm('siteForm')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="编辑"
      width="500px">
      <el-form ref="siteForm" :model="siteForm" :rules="rules" status-icon label-width="80px" label-position="right">
        <el-form-item label="快捷键 " prop="quickSearch">
          <el-input v-model="siteForm.quickSearch" placeholder="请输入快捷键" maxlength="1"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editsubmitForm('siteForm')">确 定</el-button>
        <el-button @click="resetForm('siteForm')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="manageDialogVisible"
      title="目检结果管理"
      class="confing-dialog"
      width="1000px">
      <el-button type="primary" style="margin-bottom:15px;margin-top:-15px;" size="small" @click="addConfig()"><svg-icon icon-class="add"/> 新增</el-button>
      <el-table
        :data="visualList"
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
        <el-table-column label="目检结果" align="center" width="100px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.name" class="search-input" size="small" style="width:90%" maxlength="5"/>
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
              @click="updateColor(scope.row)">修改</el-button>
            <el-button
              v-if="scope.row.id ===0"
              size="mini"
              icon="el-icon-check"
              type="primary"
              @click="saveColor(scope.row)"
            >保存</el-button>
            <el-button
              v-if="scope.row.id ===0"
              size="mini"
              icon="el-icon-close"
              type="danger"
              @click="cancelSave"
            >取消</el-button>
            <el-button
              v-if="scope.row.id !==0"
              size="mini"
              icon="el-icon-edit"
              type="danger"
              @click="deleteColor(scope.row)">删除</el-button>
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
    height: calc(100vh - 132px);
  }
  .tab-control span{
    line-height: 35px;
  }
  .tab-control span{
    width: 110px;
  }
  .tab-control span+span{
    width: 80px;
  }
  .parameter-table>>>.el-table .errorIcon{
    width:15px;
    height: 15px;
    line-height: 15px;
    background: #009494
  }
  .divshow{
    color: #009688
  }
   .table-top-btn-group {
    overflow: hidden;
  }

  .table-top-btn-group > div {
    float: left;
    margin-left: 15px;
    height: 35px;
    line-height: 35px;
    padding: 0 15px;
    border: 1px solid #e2e2e2;
    cursor: pointer;
  }
  .table-top-btn-group>div :first-of-type {
    margin-left: 0;
  }

  .table-top-btn-group > div.active {
    color: #fff;
    background: #009494;
    border-color: #009494;
  }
</style>
