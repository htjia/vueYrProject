<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0">
      <div class="search-box">
        <div class="left-search-box">
          <div class="input-item">
            <span class="input-title" style="width:50px">盘类型 </span>
            <el-select v-model="type" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in panList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">盘号 </span>
            <el-input v-model="code" class="search-input" size="small" maxlength="20" placeholder="请输入盘号" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">修改人 </span>
            <el-select v-model="creator" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in userLists"
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
              @click="handleSearch" >查询</el-button>
            <el-button
              class="margin-left"
              size="small"
              type="danger"
              @click="clearAll"
            >
              <svg-icon icon-class="clear"/> 重 置
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
            @click="printCode"><svg-icon icon-class="dayin"/> 打印</el-button>
        </div>
      </div>
    </div>
    <div id="printDivs" ref="prints" class="print" style="display:none">
      <div v-for="(item, id) in printList" :key="id" style="width: 284mm; ">
        <div style="float: left">
          <i style="font-size: 60px">{{ item.code }}</i>
          <img v-if="item.imgSrc!==''" :src="item.imgSrc" alt="" style="height: 50px; width:300px;margin-left:30px; margin-top: 30px;margin-right: 50px">
        </div>
      </div>
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        height="calc(100vh - 284px)"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
          </template>
        </el-table-column>
        <el-table-column label="盘类型" align="center" prop="typeName" show-overflow-tooltip/>
        <el-table-column label="盘号" align="center" prop="code" show-overflow-tooltip/>
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
      <el-form ref="machineForm" :model="machineForm" :rules="rules" status-icon label-width="65px" label-position="right">
        <el-form-item label="盘类型 " prop="type">
          <el-select v-model="machineForm.type" style="width: 394px;" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in panList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="盘号" prop="code">
          <el-input v-model="machineForm.code" placeholder="请输入盘号" maxlength="11"/>
        </el-form-item>
      </el-form>
      <div style="text-align: center;width: 100%;margin-top: 15px;">
        <el-button type="primary" style="margin-left: -43px;" @click="setimg()">生成盘条码</el-button>
        <el-button type="primary" @click="printLabel()">打印条码</el-button>
      </div>
      <div style="text-align: center;width: 100%;margin-top: 15px;">
        <img v-if="imgSrc!==''" :src="imgSrc" alt="" style="height:60px">
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('machineForm')">确 定</el-button>
        <el-button @click="addDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="修改"
      width="500px"
      @close="handleClose('machineForm')">
      <el-form ref="machineForm" :model="machineForm" :rules="rules" status-icon label-width="65px" label-position="right">
        <el-form-item label="盘类型 " prop="type">
          <el-select v-model="machineForm.type" style="width: 394px;" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in panList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="盘号" prop="code">
          <el-input v-model="machineForm.code" placeholder="请输入盘号" maxlength="11"/>
        </el-form-item>
      </el-form>
      <div style="text-align: center;width: 100%;margin-top: 15px;">
        <el-button type="primary" style="margin-left: -43px;" @click="setimg()">生成盘条码</el-button>
        <el-button type="primary" @click="printLabel()">打印条码</el-button>
      </div>
      <div style="text-align: center;width: 100%;margin-top: 15px;">
        <img v-if="imgSrc!==''" :src="imgSrc" alt="" style="height:60px">
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editsubmitForm('machineForm')">确 定</el-button>
        <el-button @click="editDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .spancol{
    color: #606266;
    font-weight: 700;
    margin-left: 27px;
  }
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
</style>
