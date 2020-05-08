<template>
  <PageHeaderLayout >
    <HeaderSearchAdd placeholder-text = "请输入角色名称" @handleSearch="handleSearch" @handleAdd="handleAdd"/>
    <div class="app-container">
      <el-row>
        <el-col :span="6" style="border: 1px solid #aad7d7 !important;height: calc(100vh - 284px);">
          <div class="tree-title">
            组织结构树：
            <el-button
              size="mini"
              type="primary"
              style="float: right;margin-top: -6px;"
              @click="clearall()">清除选择</el-button>
          </div>
          <el-tree
            ref="depttree"
            :data="deptList"
            :props="defauleProps"
            :expand-on-click-node="false"
            node-key="id"
            highlight-current
            @node-click="handleNodeClick"/>
        </el-col>
        <el-col :span="1">
          &nbsp;
        </el-col>
        <el-col :span="17">
          <el-table
            v-loading="listLoading"
            :data="list"
            element-loading-text="拼命加载中"
            height="calc(100vh - 284px)"
            border
            fit>
            <el-table-column align="center" label="序号" width="95">
              <template slot-scope="scope">
                {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
              </template>
            </el-table-column>
            <el-table-column label="角色名称" align="center" prop="cnname"/>
            <el-table-column label="部门" align="center" prop="departmentName"/>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <!-- <el-button
                  size="mini"
                  @click="handleRoles(scope.row)"><svg-icon icon-class="shezhi"/> 权限配置</el-button> -->
                <el-button
                  size="mini"
                  icon="el-icon-edit"
                  type="primary"
                  @click="handleEdit(scope.row)">编辑</el-button>
                <el-button
                  v-if="scope.row.isBasic === 1"
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
        </el-col>
      </el-row>
    </div>
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible"
      title="添加"
      width="1200px"
      @close="handleClose('roleForm')"
    >
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-position="right" status-icon label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="roleForm.roleName" type="text" maxlength="20"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门" prop="dept">
              <el-select v-model="roleForm.dept" placeholder="请选择" style="width: 380px;">
                <el-option :value="mineStatusValue" style="height: auto">
                  <el-tree ref="tree" :data="deptList" :props="defauleProps" node-key="id" highlight-current @node-click="handleCheckChange"/>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div>
          <div class="sttitle">
            <div class="qxtitle">权限配置</div>
            <el-checkbox :disabled="treeList.length===0" v-model="checkAlls" @change="getCheck">全选</el-checkbox>
          </div>
          <div class="proce_table" style="height:400px;overflow:auto">
            <el-tree
              v-loading="listLoading"
              ref="tree"
              :data="treeList"
              :expand-on-click-node="false"
              show-checkbox
              node-key="id">
              <span slot-scope="{ node }" class="custom-tree-node">
                <span>{{ node.label }}</span>
              </span>
              <span slot-scope="{ node, data }" class="custom-tree-node">
                <span>{{ node.label }}</span>
                <span v-if="data.functions.length !== 0" style="width: 900px;">
                  <div style="margin-right:15px;float:left">按钮：</div>
                  <el-checkbox-group v-model="data.checkedFunctions" @change="handleCheckedBtnChange(data)">
                    <el-checkbox v-for="button in data.functions" :label="button.id" :key="button.key">{{ button.name }}</el-checkbox>
                  </el-checkbox-group>
                </span>
              </span>
            </el-tree>
          </div>
        </div>
        <!-- <el-form-item label="权限配置" prop="checkedRouters">
          <div style="margin-left: -30px">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <div style="margin: 15px 0;"/>
            <el-checkbox-group v-model="roleForm.checkedRouters" @change="handleCheckedRoutersChange">
              <el-checkbox v-for="router in routers" :label="router.value" :key="router.value">{{ router.name }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="listLoading" type="primary" @click="submitForm('roleForm')">确 定</el-button>
        <el-button @click="resetForm('roleForm')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="编辑"
      width="1200px"
      @close="handleClose('roleForm')">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" status-icon label-width="80px" label-position="right">
        <el-row>
          <el-col :span="12">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="roleForm.roleName" type="text" maxlength="20"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门" prop="dept">
              <el-select v-model="roleForm.dept" placeholder="请选择" style="width: 380px;">
                <el-option :value="mineStatusValue" style="height: auto">
                  <el-tree ref="tree" :data="deptList" :props="defauleProps" node-key="id" highlight-current @node-click="handleCheckChange"/>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div>
          <div class="sttitle">
            <div class="qxtitle">权限配置</div>
            <el-checkbox :disabled="treeList.length===0" v-model="checkAlls" @change="getCheck">全选</el-checkbox>
          </div>
          <div class="proce_table" style="height:400px;overflow:auto">
            <el-tree
              v-loading="listLoading"
              ref="tree"
              :data="treeList"
              :expand-on-click-node="false"
              show-checkbox
              node-key="id">
              <span slot-scope="{ node }" class="custom-tree-node">
                <span>{{ node.label }}</span>
              </span>
              <span slot-scope="{ node, data }" class="custom-tree-node">
                <span>{{ node.label }}</span>
                <span v-if="data.functions.length !== 0" style="width: 900px;">
                  <div style="margin-right:15px;float:left">按钮：</div>
                  <el-checkbox-group v-model="data.checkedFunctions" @change="handleCheckedBtnChange(data)">
                    <el-checkbox v-for="button in data.functions" :label="button.id" :key="button.key">{{ button.name }}</el-checkbox>
                  </el-checkbox-group>
                </span>
              </span>
            </el-tree>
          </div>
        </div>
        <!-- <el-form-item label="权限配置" prop="checkedRouters">
          <div style="margin-left: -30px">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <div style="margin: 15px 0;"/>
            <el-checkbox-group v-model="roleForm.checkedRouters" @change="handleCheckedRoutersChange">
              <el-checkbox v-for="router in routers" :label="router.value" :key="router.value">{{ router.name }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="listLoading" type="primary" @click="submitEditForm('roleForm')">确 定</el-button>
        <el-button @click="resetForm('roleForm')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="roleDialogVisible"
      title="权限设置"
      width="1200px"
    >
      <div v-if="treeList.length>0" style="margin-top: -15px;margin-bottom: 25px;text-align: right;">
        <el-checkbox v-model="checkAlls" @change="getCheck">全选</el-checkbox>
      </div>
      <div class="proce_table" style="height:400px;overflow:auto">
        <el-tree
          ref="tree"
          :data="treeList"
          :expand-on-click-node="false"
          show-checkbox
          node-key="id">
          <span slot-scope="{ node }" class="custom-tree-node">
            <span>{{ node.label }}</span>
          </span>
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span>{{ node.label }}</span>
            <span v-if="data.functions.length !== 0" style="width: 900px;">
              <div style="margin-right:15px;float:left">按钮：</div>
              <el-checkbox-group v-model="data.checkedFunctions" @change="handleCheckedBtnChange(data)">
                <el-checkbox v-for="button in data.functions" :label="button.id" :key="button.key">{{ button.name }}</el-checkbox>
              </el-checkbox-group>
            </span>
          </span>
        </el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitRoleForm()">确 定</el-button>
        <el-button @click="roleDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>
<script src="./roles.js"></script>
<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .proce_table{
    margin-top: -15px;
  }
  .proce_table >>> .el-checkbox{
    margin-left: 0;
    margin-right: 5px;
  }
  .tree-title {
    text-align: left;
    font-size: 16px;
    background: #d6eeee;
    padding: 12px 15px;
    font-weight: bold;
    border-bottom: 1px solid #aad7d7;
  }
  .qxtitle {
    float: left;
    margin-top: 1px;
    font-weight: bold;
    font-size: 15px;
    border-left: 3px solid #009494;
    padding-left: 6px;
  }
  .sttitle {
    margin-bottom: 25px;
    text-align: right;
    border-bottom: 1px solid #009494;
    padding-bottom: 5px;
  }
</style>
