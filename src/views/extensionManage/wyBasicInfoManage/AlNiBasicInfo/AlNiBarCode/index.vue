<template>
  <PageHeaderLayout >
    <!-- <div class="header-search-add height-auto"> -->
    <!-- <div class="header-btn-group">
        <el-button
          size="small"
          type="primary"
        ><svg-icon icon-class="add"/> 导入衬底文档</el-button>
        <el-button
          size="small"
          type="primary"
        ><svg-icon icon-class="add"/> 新增衬底信息</el-button>
        <el-button
          size="small"
          type="primary"
        ><svg-icon icon-class="add"/> 导出excel</el-button>
        <el-button
          size="small"
          class="float-right"
          type="primary"
        ><svg-icon icon-class="add"/> 数据管理</el-button>
        <el-button
          size="small"
          class="float-right"
          type="primary"
        ><svg-icon icon-class="add"/> 导入记录</el-button>
      </div> -->
    <div class="app-container">
      <el-button
        class="float-right"
        style="margin-bottom:15px"
        size="small"
        type="primary"
        @click="add"
      >
        <svg-icon icon-class="clear"/> 新 增
      </el-button>
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        height="calc(100vh - 258px)"
        border
        fit>
        <el-table-column align="center" label="序号">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="标签名称">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="备注">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="status" width="180">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)">删除</el-button>
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
      title="新增条码"
      width="800px"
      class="detailDialog"
      @close="handleClose('siteForm')">
      <el-form ref="form" :model="formInfo" label-width="140px">
        <el-form-item label="标签名称 ">
          <el-input v-model="formInfo.labelName"/>
        </el-form-item>
        <el-form-item label="备注 ">
          <el-input v-model="formInfo.remark"/>
        </el-form-item>
        <el-form-item label="画布尺寸 ">
          <el-input v-model="formInfo.canvasWidth" style="width: 40%"/> mm * <el-input v-model="formInfo.canvasHeight" style="width: 40%"/> mm
        </el-form-item>
        <el-form-item label="显示条码 ">
          <el-checkbox-group v-model="formInfo.isCode" @change="setIsCode">
            <el-checkbox label="盒号条码" name="type"/>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="活动性质 ">
          <el-checkbox-group v-model="formInfo.param" @change="setActive">
            <el-checkbox label="盒号ID" name="type"/>
            <el-checkbox label="放片人" name="type"/>
            <el-checkbox label="片数" name="type"/>
            <el-checkbox label="衬底厂家" name="type"/>
          </el-checkbox-group>
        </el-form-item>
        <div id="canvasDiv" style="width:100%;text-align:center">
          <canvas id="canvas" :style="{width:formInfo.canvasWidth + 'mm',height:formInfo.canvasHeight+'mm'}" class="setcanvas">1</canvas>
          <img id="img" src style="width:367px;height:500px;display:none">
        </div>
      </el-form>
    </el-dialog>
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="编辑卡塞"
      width="800px"
      class="detailDialog"
      @close="handleClose('siteForm')">
      <el-form ref="siteForm" :model="siteForm" :rules="rules" status-icon label-width="100px" label-position="right">
        <el-row>
          <el-col :span="9">
            <el-form-item label="卡塞名称 " prop="siteType">
              <el-input v-model="siteName" class="search-input" placeholder="请输入卡塞名称" size="small" maxlength="20" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="卡塞名称 " prop="siteType">
              <el-input v-model="siteName" class="search-input" placeholder="请输入卡塞名称" size="small" maxlength="20" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" @click="submitForm('siteForm')">保 存</el-button>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" @click="submitForm('siteForm')">启 用</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        height="400px"
        border
        fit>
        <el-table-column align="center" label="层号">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="大盘编号">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="大盘尺寸">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="大盘片数">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="circle" align="center">
          <template slot-scope="scope">
            <span @click="show(scope.row)">查看</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="status" width="180">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 10px;
    top: 3px;
  }
  .input-item{
    float: left;
    margin-top: 14px;
    margin-right: 10px;
  }
  .search-input{
    width: 155px;
  }
  .short-input{
    width: 126px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 130px);
  }
  .select-thead-btn{
    width: 45px;
    height: 42px;
    position: absolute;
    z-index: 200;
    background: rgba(0,0,0,.2);
    right: 15px;
    top: 15px;
  }
  .select-thead{
    width: 180px;
    height: 335px;
    border: 1px solid #e2e2e2;
    position: absolute;
    z-index: 200;
    background: #fff;
    right: 15px;
    top: 60px;
  }
  .options-box{
    height: 280px;
    overflow: auto;
    margin-bottom: 10px;
  }
  .detailDialog >>> .el-dialog__body{
    padding: 15px
  }
  .setcanvas{
    border: 1px solid #666 !important;
  }
</style>
