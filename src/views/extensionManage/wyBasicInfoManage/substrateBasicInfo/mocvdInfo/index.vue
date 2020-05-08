<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0">
      <el-button
        style="margin-top: 15px"
        size="small"
        type="primary"
        @click="handleAdd"><svg-icon icon-class="add"/> 新增机台</el-button>
      <el-button
        style="margin-top: 15px"
        size="small"
        type="primary"
        icon="el-icon-edit"
        @click="handleEdit">编 辑</el-button>
      <el-button
        style="margin-top: 15px"
        size="small"
        type="danger"
        icon="el-icon-delete"
        @click="handleDelete">删 除</el-button>
    </div>
    <div class="app-container">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-table
            v-loading="listLoading"
            ref="machineTable"
            :data="list"
            element-loading-text="拼命加载中"
            highlight-current-row
            border
            fit
            height = "calc(100vh - 238px)"
            @current-change="currentMachineChange"
          >
            <el-table-column align="center" label="机台" prop="code"/>
            <el-table-column label="待机时间(m)" align="center" prop="waitTime"/>
            <el-table-column label="运行时间Max(h)" align="center" prop="maxTime"/>
            <el-table-column label="运行时间Min(h)" align="center" prop="minTime"/>
          </el-table>
        </el-col>
        <el-col :span="1"><span style="opacity: 0">占位</span></el-col>
        <el-col :span="activeTabIndex === 3 ? 13 : 10">
          <div class="tab-control">
            <span
              :class="{activeTab: activeTabIndex === 0}"
              @click="tabClick(0)"
            >人员信息</span>
            <span
              :class="{activeTab: activeTabIndex === 1}"
              class="has-margin-left"
              @click="tabClick(1)"
            >Recipe</span>
            <span
              :class="{activeTab: activeTabIndex === 2}"
              class="has-margin-left"
              @click="tabClick(2)"
            >大盘信息</span>
          </div>
          <el-table
            v-loading="listLoading"
            v-show="activeTabIndex === 0"
            ref="userTable"
            :data="userList"
            element-loading-text="拼命加载中"
            border
            fit
            height = "calc(100vh - 290px)"
            highlight-current-row
            @current-change="currentUserChange">
            <el-table-column align="center" label="序号" width="50">
              <template slot-scope="scope">
                {{ scope.$index+1 }}
              </template>
            </el-table-column>
            <el-table-column label="人员名称" align="center" prop="name">
              <template slot-scope="scope">
                <el-select v-model="scope.row.userId" :disabled="scope.row.disabled" placeholder="请选择" style="width: 100%" filterable>
                  <el-option
                    v-for="item in allUserList"
                    :disabled="item.disabled"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="启用状态" align="center" prop="code">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.status" @change="switchChange(scope.row)"/>
              </template>
            </el-table-column>
          </el-table>
          <el-table
            v-loading="listLoading"
            v-show="activeTabIndex === 1"
            ref="recipeTable"
            :data="recipeList"
            element-loading-text="拼命加载中"
            border
            fit
            height = "calc(100vh - 290px)"
            highlight-current-row
            @current-change="currentRecipeChange">
            <el-table-column align="center" label="序号" width="50">
              <template slot-scope="scope">
                {{ scope.$index+1 }}
              </template>
            </el-table-column>
            <el-table-column label="recipe_name" align="center" prop="name">
              <template slot-scope="scope">
                <el-input v-model="scope.row.name" :disabled="scope.row.disabled" placeholder="请输入recipe_name" maxlength="20"/>
              </template>
            </el-table-column>
            <el-table-column label="启用状态" align="center" prop="code">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.status" text-align="center" @change="switchRecipeChange(scope.row)"/>
              </template>
            </el-table-column>
          </el-table>
          <el-table
            v-loading="listLoading"
            v-show="activeTabIndex === 2"
            id="tableTop"
            :data="platterList"
            element-loading-text="拼命加载中"
            border
            fit
            height = "calc(100vh - 290px)"
          >
            <el-table-column align="center" label="序号" width="50">
              <template slot-scope="scope">
                {{ scope.$index+1 }}
              </template>
            </el-table-column>
            <el-table-column label="Platter_No" align="center" prop="platter_no"/>
            <el-table-column label="大盘尺寸" align="center" prop="measure_name"/>
            <el-table-column label="片数" align="center" prop="slice"/>
            <el-table-column label="circle" align="center" prop="code">
              <template slot-scope="scope">
                <div style="color: #009494;font-weight: bold;cursor: pointer;text-decoration:underline" @click="viewCircleDetail(scope.row)">详情</div>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-rol :span="activeTabIndex === 3 ? 0 : 3" >
          <div style="margin-top: 37px;">
            <el-button
              v-if="activeTabIndex === 0 && !addUser"
              style="margin-top: 15px"
              size="small"
              type="primary"
              @click="handleAddUser"><svg-icon icon-class="add"/> 新增人员</el-button>
            <el-button
              v-if="addUser && activeTabIndex !== 2"
              style="margin-top: 15px"
              size="small"
              type="primary"
              icon="el-icon-check"
              @click="addUserSubmit">保 存</el-button>
            <el-button
              v-if="activeTabIndex === 1 && !addRecipe"
              style="margin-top: 15px"
              size="small"
              type="primary"
              @click="handleAddRecipe"><svg-icon icon-class="add"/> 新增Recipe</el-button>
            <el-button
              v-if="addRecipe && activeTabIndex !== 2"
              style="margin-top: 15px"
              size="small"
              type="primary"
              icon="el-icon-check"
              @click="addRecipeSubmit">保 存</el-button>
          </div>
          <div>
            <el-button
              v-if="activeTabIndex === 0 && !addUser"
              style="margin-top: 15px"
              size="small"
              type="danger"
              icon="el-icon-delete"
              @click="handleDeleteUser">删除人员</el-button>
            <el-button
              v-if="addUser && activeTabIndex !== 2"
              style="margin-top: 15px"
              size="small"
              type="danger"
              icon="el-icon-delete"
              @click="cancelAdd">取 消</el-button>
            <el-button
              v-if="addRecipe && activeTabIndex !== 2"
              style="margin-top: 15px"
              size="small"
              type="danger"
              icon="el-icon-delete"
              @click="cancelAddRecipe">取 消</el-button>
            <el-button
              v-if="activeTabIndex === 1 && !addRecipe"
              style="margin-top: 15px"
              size="small"
              type="danger"
              icon="el-icon-delete"
              @click="handleDeleteRecipe">删除Recipe</el-button>
          </div>
        </el-rol>
      </el-row>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible"
      title="新增机台"
      width="550px"
      @close="handleClose('machineForm')">
      <el-form ref="machineForm" :model="machineForm" :rules="rules" status-icon label-width="150px" label-position="right">
        <el-form-item label="机台编号" prop="code">
          <el-input v-model="machineForm.code" placeholder="请输入机台编号" type="text" maxlength="2" oninput="this.value=this.value.replace(/[^0-9]/g,'');"/>
        </el-form-item>
        <el-form-item label="待机时间" prop="waitTime">
          <el-input v-model="machineForm.waitTime" placeholder="请输入待机时间" onkeyup="this.value=this.value.replace(/[^\d]/g,'')" maxlength="5" @input="waitTimeChange"/>
        </el-form-item>
        <el-form-item label="运行时间Max(h)" prop="maxTime">
          <el-input v-model="machineForm.maxTime" placeholder="请输入运行时间Max(h)" onkeyup="this.value=this.value.replace(/[^\d]/g,'')" maxlength="5" @input="maxTimeChange"/>
        </el-form-item>
        <el-form-item label="运行时间Min(h)" prop="minTime">
          <el-input v-model="machineForm.minTime" placeholder="请输入运行时间Min(h)" onkeyup="this.value=this.value.replace(/[^\d]/g,'')" maxlength="5" @input="minTimeChange"/>
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
      title="编辑机台"
      width="550px"
      @close="handleClose('machineForm')">
      <el-form ref="machineForm" :model="machineForm" :rules="rules" status-icon label-width="150px" label-position="right">
        <el-form-item label="机台编号" prop="code">
          <el-input :disabled="true" v-model="machineForm.code" placeholder="请输入待机时间" maxlength="2" oninput="this.value=this.value.replace(/[^0-9]/g,'');"/>
        </el-form-item>
        <el-form-item label="待机时间" prop="waitTime">
          <el-input v-model="machineForm.waitTime" placeholder="请输入待机时间" maxlength="10" @input="waitTimeChange"/>
        </el-form-item>
        <el-form-item label="运行时间Max(h)" prop="maxTime">
          <el-input v-model="machineForm.maxTime" placeholder="请输入运行时间Max(h)" maxlength="10" @input="maxTimeChange"/>
        </el-form-item>
        <el-form-item label="运行时间Min(h)" prop="minTime">
          <el-input v-model="machineForm.minTime" placeholder="请输入运行时间Min(h)" maxlength="10" @input="minTimeChange"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEditForm('machineForm')">确 定</el-button>
        <el-button @click="editDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="platterCircleVisble"
      class="padding-dialog"
      title="大盘circle"
      width="600px"
    >
      <el-table
        :data="platterCircleList"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="开始" align="center" prop="cricleStart"/>
        <el-table-column label="结束" align="center" prop="cricleEnd"/>
      </el-table>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .app-container{
    position: relative;
    height: calc(100vh - 207px);
  }
  .tab-control span{
    line-height: 50px;
  }
  .el-checkbox {
    margin-left: 0px;
  }
  .tab-control span {
    line-height: 40px;
  }
  .app-container>>> .el-input.is-disabled .el-input__inner {
    background-color: #fafcff;
    border-color: transparent;
    color: #949494;
    cursor: not-allowed;
  }
</style>
