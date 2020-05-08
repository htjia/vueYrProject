<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0">
      <div class="search-box">
        <div class="left-search-box" style="margin-left: -10px;">
          <div class="input-item">
            <span class="input-title" style="width:45px">项目 </span>
            <el-select v-model="project" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in projectList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">考核项 </span>
            <el-input v-model="content" class="search-input" size="small" placeholder="请输入稽核项目" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">启用状态 </span>
            <el-select v-model="isDisable" class="search-input" style="width:75px" size="small" placeholder="选择" filterable clearable>
              <el-option
                v-for="item in disableList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-search"
              @click="fetchData" >查 询</el-button>
          </div>
          <div class="input-item" style="margin-right:0px">
            <el-button
              size="small"
              type="danger"
              @click="clearAll" ><svg-icon icon-class="clear"/> 重 置</el-button>
          </div>
        </div>
        <div class="right-btn-box">
          <el-button
            style="margin-top: 15px"
            class="float-right margin-left"
            size="small"
            type="primary"
            @click="handleAdds"
          >
            <svg-icon icon-class="add"/> 新增考核项
          </el-button>
          <el-button
            style="margin-top: 15px"
            class="float-right"
            size="small"
            type="primary"
            @click="handleAdd" ><svg-icon icon-class="add"/> 新增项目</el-button>
          <el-button
            style="margin-top: 15px"
            class="float-right"
            size="small"
            type="primary"
            @click="handleAddcj" ><svg-icon icon-class="add"/> 新增车间</el-button>
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
        <el-table-column label="项目" align="center" prop="categoryName"/>
        <el-table-column label="考核项" align="center" prop="name"/>
        <el-table-column label="分值" align="center" prop="score" width="80"/>
        <el-table-column label="是否启用" align="center" prop="status" width="120">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isChecked" @change="setStatus(scope.row)">启用</el-checkbox>
          </template>
        </el-table-column>
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
      :close-on-click-modal="false"
      :visible.sync="addDialogVisiblecj"
      class="leftcj1"
      title="新增车间"
      width="600px">
      <div style="margin-bottom: 5px;margin-top: -15px;">
        <el-button size="small" type="primary" icon="el-icon-add" @click="addNewListcj" ><svg-icon icon-class="add"/> 新增</el-button>
      </div>
      <div style="padding-bottom:20px">
        <el-table
          ref="newfac"
          :data="projectcjList"
          element-loading-text="拼命加载中"
          height="400px"
          border
          fit
          stripe>
          <el-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              {{ scope.$index+1 }}
            </template>
          </el-table-column>
          <el-table-column label="车间" align="center">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isEdit" v-model="scope.row.name" class="search-input" size="small" style="width:90%" maxlength="10" clearable/>
              <span v-if="!scope.row.isEdit">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" prop="status">
            <template slot-scope="scope">
              <!-- <i v-if="scope.row.id!==0 && scope.$index > 2" @click="handleUp1(scope.$index)"><svg-icon style="color: #009494;font-size: 20px;cursor: pointer;" icon-class="top" /></i>
              <i v-if="scope.row.id!==0 && scope.$index > 2" @click="handleDown1(scope.$index)"><svg-icon style="color: #009494;font-size: 20px;cursor: pointer;" icon-class="bottom" /></i> -->
              <el-button
                v-if="!scope.row.isEdit && scope.$index > 2"
                size="mini"
                icon="el-icon-edit"
                type="primary"
                @click="handleEdits(scope.row)"
              >编辑</el-button>
              <el-button
                v-if="scope.row.isEdit && scope.$index > 2"
                size="mini"
                icon="el-icon-check"
                type="primary"
                @click="handleSavecj(scope.row)"
              >保存</el-button>
              <el-button
                v-if="scope.$index > 2"
                size="mini"
                icon="el-icon-delete"
                type="danger"
                @click="handleDeletecj(scope.row, scope.$index)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible"
      class="left1"
      title="新增项目"
      width="600px">
      <div style="margin-bottom: 5px;margin-top: -15px;">
        <el-button size="small" type="primary" icon="el-icon-add" @click="addNewList" ><svg-icon icon-class="add"/> 新增</el-button>
      </div>
      <div style="padding-bottom:20px">
        <el-table
          ref="newPro"
          :data="projectList"
          row-key="index"
          element-loading-text="拼命加载中"
          height="400px"
          border
          fit
          stripe>
          <el-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              {{ scope.$index+1 }}
            </template>
          </el-table-column>
          <el-table-column label="项目" align="center">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isEdit" v-model="scope.row.name" class="search-input" size="small" style="width:90%" maxlength="10" clearable/>
              <span v-if="!scope.row.isEdit">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" prop="status">
            <template slot-scope="scope">
              <i v-if="scope.row.id!==0" @click="handleUp1(scope.$index)"><svg-icon style="color: #009494;font-size: 20px;cursor: pointer;" icon-class="top" /></i>
              <i v-if="scope.row.id!==0" @click="handleDown1(scope.$index)"><svg-icon style="color: #009494;font-size: 20px;cursor: pointer;" icon-class="bottom" /></i>
              <el-button
                v-if="!scope.row.isEdit"
                size="mini"
                icon="el-icon-edit"
                type="primary"
                @click="handleEdits(scope.row)"
              >编辑</el-button>
              <el-button
                v-if="scope.row.isEdit"
                size="mini"
                icon="el-icon-check"
                type="primary"
                @click="handleSave(scope.row)"
              >保存</el-button>
              <!-- <el-button
                size="mini"
                icon="el-icon-delete"
                type="danger"
                @click="handleDeletexm(scope.row, scope.$index)"
              >删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="新增考核项"
      width="500px"
      @close="handleClose('programForm')">
      <el-form ref="programForm" :model="programForm" :rules="rules" status-icon label-width="65px" label-position="right">
        <el-form-item label="项目" prop="name">
          <el-select v-model="programForm.name" class="search-input" style="width: 395px;" size="small" placeholder="请选择" filterable>
            <el-option
              v-for="item in projectList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="考核项" prop="content">
          <el-input v-model="programForm.content" placeholder="请输入考核项" type="textarea" maxlength="30"/>
        </el-form-item>
        <el-form-item label="分值" prop="score">
          <el-input v-model="programForm.score" placeholder="请输入分值" type="text" maxlength="3"/>
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
      :visible.sync="editDialogVisible1"
      title="编辑考核项"
      width="500px"
      @close="handleClose('programForm')">
      <el-form ref="programForm" :model="programForm" :rules="rules" status-icon label-width="65px" label-position="right">
        <el-form-item label="项目" prop="name">
          <el-select v-model="programForm.name" :disabled="true" class="search-input" style="width: 395px;" size="small" placeholder="请选择" filterable>
            <el-option
              v-for="item in projectList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="考核项" prop="content">
          <el-input v-model="programForm.content" placeholder="请输入考核项" type="textarea" maxlength="30"/>
        </el-form-item>
        <el-form-item label="分值" prop="score">
          <el-input v-model="programForm.score" placeholder="请输入分值" type="text" maxlength="3"/>
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
    width: 340px;
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
