<template>
  <PageHeaderLayout >
    <div class="app-container">
      <el-button
        size="mini"
        class="float-right margin-left"
        type="primary"
        @click="handleAdd"
      ><svg-icon icon-class="add"/> 新 增</el-button>
      <el-button
        v-if="activeTabIndex === 1"
        size="mini"
        class="float-right"
        type="primary"
        @click="handleManage"
      >光色系列管理</el-button>
      <div class="tab-control">
        <span
          :class="{activeTab: activeTabIndex === 0}"
          @click="tabClick(0)"
        >生产类型</span>
        <span
          :class="{activeTab: activeTabIndex === 1}"
          class="has-margin-left"
          @click="tabClick(1)"
        >结构类型</span>
        <span
          :class="{activeTab: activeTabIndex === 2}"
          class="has-margin-left"
          @click="tabClick(2)"
        >炉次</span>
        <span
          :class="{activeTab: activeTabIndex === 3}"
          class="has-margin-left"
          @click="tabClick(3)"
        >待机原因</span>
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        height="calc(100vh - 272px)"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="编号" align="center" prop="code"/>
        <el-table-column v-if="activeTabIndex === 1" label="光色系列" align="center" prop="seriesName">
          <template slot-scope="scope">
            <span v-if="!scope.row.edit">{{ scope.row.seriesName }}</span>
            <el-select v-else v-model="scope.row.series" size="mini" style="width: 100%" placeholder="请选择">
              <el-option v-for="item in colorList" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="名称" align="center" prop="name"/>
        <el-table-column label="备注" align="center" prop="remark" width="460"/>
        <el-table-column label="是否启用" align="center" prop="status">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.status" size="small" @change="switchChange(scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="status" width="260">
          <template slot-scope="scope">
            <el-button
              v-if="activeTabIndex === 1 && scope.row.edit === false"
              size="mini"
              icon="el-icon-edit"
              type="primary"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              v-if="activeTabIndex === 1 && scope.row.edit === true"
              size="mini"
              icon="el-icon-check"
              type="primary"
              @click="handleSubmitItem(scope.row)"
            >保存</el-button>
            <el-button
              v-if="activeTabIndex === 1 && scope.row.edit === true"
              size="mini"
              icon="el-icon-close"
              type="danger"
              @click="handleCancel(scope.row)"
            >取消</el-button>
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
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible"
      :title="'新增'+ dialogTitle"
      width="500px"
      @close="handleClose('substrateForm')">
      <el-form ref="substrateForm" :model="substrateForm" :rules="rules" status-icon label-width="80px" label-position="right">
        <el-form-item label="编号 " prop="code">
          <el-input v-model="substrateForm.code" onkeyup="this.value=this.value.replace(/\s+/g,'')" placeholder="请输入编号" maxlength="20"/>
        </el-form-item>
        <el-form-item v-if="activeTabIndex === 1" label="光色系列 " prop="series">
          <el-select v-model="substrateForm.series" style="width: 100%" placeholder="请选择光色系列">
            <el-option v-for="item in colorList" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="名称 " prop="implication">
          <el-input v-model="substrateForm.implication" onkeyup="this.value=this.value.replace(/\s+/g,'')" placeholder="请输入名称" maxlength="20"/>
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
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="manageDialogVisible"
      title="光色系列管理"
      class="confing-dialog"
      width="1000px">
      <el-button type="primary" style="margin-bottom:15px;margin-top:-15px;" size="small" @click="addConfig()"><svg-icon icon-class="add"/> 新增</el-button>
      <el-table
        :data="colorList"
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
        <el-table-column label="光色系列" align="center" width="100px">
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
  .el-checkbox {
    margin-left: 0px;
  }
</style>
