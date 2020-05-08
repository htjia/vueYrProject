<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0">
      <div class="search-box">
        <div class="left-search-box">
          <div class="input-item">
            <span class="input-title">卡塞名称 </span>
            <el-input v-model="searchName" onkeyup="this.value=this.value.replace(/\s+/g,'')" class="search-input" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-search"
              @click="handleSearch" >查询</el-button>
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
      <el-table
        v-loading="listLoading"
        :data="list"
        height="calc(100vh - 290px)"
        element-loading-text="拼命加载中"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="卡塞名称" align="center" prop="name"/>
        <el-table-column label="层数" align="center" prop="layer"/>
        <el-table-column label="尺寸" align="center" prop="measure"/>
        <el-table-column label="总片数" align="center" prop="slice"/>
        <el-table-column label="启用状态" align="center" prop="status">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0" style="color: #009494;font-weight: bold">启用</span>
            <span v-if="scope.row.status === 1" style="color: #f33;font-weight: bold">停用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="status">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDeleteRow(scope.row)">删除
            </el-button>
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
      title="新增卡塞"
      width="800px"
      class="edit-dialog"
      @close="handleClose('caseForm')">
      <el-form ref="caseForm" :model="caseForm" :rules="rules" status-icon label-width="100px" label-position="right">
        <el-row>
          <el-col :span="8">
            <el-form-item label="卡塞名称 " prop="caseName" size="small">
              <el-input v-model="caseForm.caseName" placeholder="请输入卡塞名称" type="text" maxlength="20"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="卡塞层数 " prop="layer" size="small">
              <el-input v-model="caseForm.layer" onkeyup="this.value=this.value.replace(/\s+/g,'')" type="text" maxlength="1" placeholder="请输入卡塞层数" oninput="this.value=this.value.replace(/[^1234567]/g,'');" @change="caseNumChange"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <div>
              <el-checkbox v-model="caseChecked" style="margin-left: 20px"><span style="font-weight: bold">启用</span></el-checkbox>
              <el-button
                style="margin-left: 38px"
                icon="el-icon-check"
                size="small"
                type="primary"
                @click="submitForm('caseForm')">保 存
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        :data="caseList"
        element-loading-text="拼命加载中"
        class="edit-dialog-table"
        border
        fit
      >
        <el-table-column align="center" label="层号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="大盘编号" align="center" prop="name" width="260">
          <template slot-scope="scope">
            <el-select v-model="scope.row.platterId" size="mini" clearable placeholder="请选择" style="width: 95%;height: 25px;" filterable @change="platterChange(scope.row)">
              <el-option
                v-for="item in platterList"
                :disabled="item.disabled"
                :key="item.id"
                :label="item.platterNo"
                :value="item.id"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="大盘尺寸" align="center" prop="measureName"/>
        <el-table-column label="大盘片数" align="center" prop="slice"/>
        <el-table-column label="circle" align="center" prop="name" width="60">
          <template slot-scope="scope">
            <div style="color: #009494;font-weight: bold;cursor: pointer;text-decoration:underline" @click="viewCircleDetail(scope.row)">详情</div>
          </template>
        </el-table-column>
        <el-table-column label="启用" align="center" prop="status">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="status">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="platterCircleVisble"
        class="padding-dialog"
        append-to-body
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
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="编辑卡塞"
      width="800px"
      class="edit-dialog"
      @close="handleClose('caseForm')">
      <el-form ref="caseForm" :model="caseForm" :rules="rules" status-icon label-width="100px" label-position="right">
        <el-row>
          <el-col :span="8">
            <el-form-item label="卡塞名称 " prop="caseName" size="small">
              <el-input v-model="caseForm.caseName" placeholder="请输入卡塞名称" type="text" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="卡塞层数 " prop="layer" size="small">
              <el-input :disabled="true" v-model="caseForm.layer" type="text" maxlength="1" placeholder="请输入卡塞层数" oninput="this.value=this.value.replace(/[^1234567]/g,'');" @change="caseNumChange"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <div style="margin-left: 20px">
              <el-checkbox v-model="caseChecked"><span style="font-weight: bold">启用</span></el-checkbox>
              <el-button
                style="margin-left: 38px"
                icon="el-icon-check"
                size="small"
                type="primary"
                @click="submitEditForm('caseForm')">保 存
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        v-loading="listLoading"
        :data="caseList"
        element-loading-text="拼命加载中"
        class="edit-dialog-table"
        border
        fit
      >
        <el-table-column align="center" label="层号" prop="layerNo" width="50"/>
        <el-table-column label="大盘编号" align="center" prop="name" width="260">
          <template slot-scope="scope">
            <el-select v-model="scope.row.platterId" size="mini" placeholder="请选择" style="width: 95%;height: 25px;" filterable @change="platterChange(scope.row)">
              <el-option
                v-for="item in platterList"
                :disabled="item.disabled"
                :key="item.id"
                :label="item.platterNo"
                :value="item.id"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="大盘尺寸" align="center" prop="measureName"/>
        <el-table-column label="大盘片数" align="center" prop="slice"/>
        <el-table-column label="circle" align="center" prop="name" width="60">
          <template slot-scope="scope">
            <div style="color: #009494;font-weight: bold;cursor: pointer;text-decoration:underline" @click="viewCircleDetail(scope.row)">详情</div>
          </template>
        </el-table-column>
        <el-table-column label="启用" align="center" prop="status">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="status">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="platterCircleVisble"
        class="padding-dialog"
        append-to-body
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
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .edit-dialog>>>.el-dialog__body{
    padding: 20px;
  }
  .edit-dialog-table>>>.el-checkbox {
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
  .app-container{
    position: relative;
    height: calc(100vh - 207px);
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
  .substrate>div:not(:first-child){
    margin-left: 5px;
  }
  .table-top-btn-group>div.active{
    color: #fff;
    background: #009494;
    border-color: #009494;
  }
  .el-checkbox {
    margin-left: 0px;
  }
</style>
