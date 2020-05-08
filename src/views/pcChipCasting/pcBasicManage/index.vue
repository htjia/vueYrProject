<template>
  <PageHeaderLayout >
    <div class="app-container parameter-table">
      <el-button
        class="float-right"
        type="primary"
        size="mini"
        @click="handleAdd"
      ><svg-icon icon-class="add"/> 新 增</el-button>
      <div class="tab-control">
        <span
          :class="{activeTab: activeTabIndex === 0}"
          @click="tabClick(0)"
        >尺寸</span>
        <span
          :class="{activeTab: activeTabIndex === 1}"
          class="has-margin-left"
          @click="tabClick(1)"
        >电极</span>
        <span
          :class="{activeTab: activeTabIndex === 2}"
          class="has-margin-left"
          @click="tabClick(2)"
        >投片类型</span>
        <span
          :class="{activeTab: activeTabIndex === 3}"
          class="has-margin-left"
          @click="tabClick(3)"
        >切割工艺</span>
        <span
          :class="{activeTab: activeTabIndex === 4}"
          class="has-margin-left"
          @click="tabClick(4)"
        >芯片工艺</span>
        <span
          :class="{activeTab: activeTabIndex === 5}"
          class="has-margin-left"
          @click="tabClick(5)"
        >型号</span>
        <span
          :class="{activeTab: activeTabIndex === 6}"
          class="has-margin-left"
          @click="tabClick(6)"
        >客户编码</span>
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        height="calc(100vh - 260px)"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
          </template>
        </el-table-column>
        <el-table-column label="编号" align="center" prop="code"/>
        <el-table-column label="名称" align="center" prop="name"/>
        <el-table-column label="备注" align="center" prop="remark" width="460"/>
        <el-table-column label="是否启用" align="center" prop="status">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isChecked" @change="setStatus(scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="status">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.code !== 'Q'"
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
      v-drag
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible"
      title="新增"
      width="500px">
      <el-form ref="siteForm" :model="siteForm" :rules="rules" status-icon label-width="65px" label-position="right">
        <el-form-item v-if="activeTabIndex!==5" label="编号 " prop="code">
          <el-input v-model="siteForm.code" placeholder="请输入编号" maxlength="20"/>
        </el-form-item>
        <el-form-item v-if="activeTabIndex===5" label="编号 " prop="codeMode">
          <el-input v-model="siteForm.codeMode" placeholder="请输入编号" maxlength="20"/>
        </el-form-item>
        <el-form-item label="名称 " prop="name">
          <el-input v-model="siteForm.name" placeholder="请输入名称" maxlength="20"/>
        </el-form-item>
        <el-form-item label="备注 ">
          <el-input v-model="siteForm.remark" type="textarea" placeholder="请输入备注" maxlength="50"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitForm('siteForm')">确 定</el-button>
        <el-button size="small" @click="resetForm('siteForm')">取 消</el-button>
      </span>
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
    width: 90px;
    line-height: 30px;
    padding-bottom: 5px;
  }
  .tab-control span+span{
    width: 90px;
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
</style>
