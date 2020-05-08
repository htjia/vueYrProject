<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0;">
      <div style="position: relative;">
        <div class="input-item">
          <span class="input-title" style="width: 50px">供应商</span>
          <el-input v-model="searchKeys.csmc" class="search-input" placeholder="请输入供应商" size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item">
          <span class="input-title">供货类型</span>
          <el-select v-model="searchKeys.cllx" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in materialOptions"
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
            @click="handleSearch" >查 询</el-button>
        </div>
        <el-button
          class="float-right margin-left"
          style="margin-top: 15px"
          size="small"
          type="primary"
          @click="handleExport"
        ><svg-icon icon-class="export"/> 导 出</el-button>
        <el-button
          class="float-right"
          style="margin-top: 15px"
          size="small"
          type="primary"
          @click="handleAdd"
        ><svg-icon icon-class="add"/> 新 增</el-button>
        <div class="clear-both"/>
      </div>
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        height="92%"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="供应商名称" align="center" prop="name" show-overflow-tooltip/>
        <el-table-column label="供货类型" align="center" prop="goodsType" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-text="getGoodsType(scope.row.goodsType)"/>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip/>
        <el-table-column align="center" label="操作" width="290">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="viewSupplyRecord(scope.row)"><svg-icon icon-class="remarkInput"/> 供货记录</el-button>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删除</el-button>
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
    <!--新增弹窗-->
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="addMetalDialogVisible"
      title="新增"
      class="padding-dialog"
      width="620px"
      @close="handleClose">
      <el-form ref="addForm" :model="addForm" :rules="rules" status-icon label-width="80px" label-position="right">
        <el-form-item label="供应商" size="small" prop="csmc">
          <el-input v-model="addForm.csmc" class="dialog-input" placeholder="请输入供应商" size="small" maxlength="20" clearable/>
        </el-form-item>
        <el-form-item label="供货类型" size="small" prop="ghlx">
          <el-checkbox-group v-model="addForm.ghlx">
            <el-checkbox label="0">金属</el-checkbox>
            <el-checkbox label="1">化学</el-checkbox>
            <el-checkbox label="2">气体</el-checkbox>
            <el-checkbox label="3">包材</el-checkbox>
            <el-checkbox label="4">衬底</el-checkbox>
            <el-checkbox label="5">MO源</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="备注" size="small" prop="remark">
          <el-input v-model="addForm.remark" class="dialog-input" placeholder="请输入备注" type="textarea" size="small" maxlength="50" clearable/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('addForm')">确 定</el-button>
        <el-button @click="resetForm('addForm')">取 消</el-button>
      </span>
    </el-dialog>
    <!--编辑弹窗-->
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="editMetalDialogVisible"
      title="编辑"
      class="padding-dialog"
      width="620px"
      @close="handleClose">
      <el-form ref="addForm" :model="addForm" :rules="rules" status-icon label-width="80px" label-position="right">
        <el-form-item label="供应商" size="small" prop="csmc">
          <el-input v-model="addForm.csmc" class="dialog-input" placeholder="请输入供应商" size="small" maxlength="20" clearable/>
        </el-form-item>
        <el-form-item label="供货类型" size="small" prop="ghlx">
          <el-checkbox-group v-model="addForm.ghlx">
            <el-checkbox label="0">金属</el-checkbox>
            <el-checkbox label="1">化学</el-checkbox>
            <el-checkbox label="2">气体</el-checkbox>
            <el-checkbox label="3">包材</el-checkbox>
            <el-checkbox label="4">衬底</el-checkbox>
            <el-checkbox label="5">MO源</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="备注" size="small" prop="remark">
          <el-input v-model="addForm.remark" class="dialog-input" placeholder="请输入备注" type="textarea" size="small" maxlength="50" clearable/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEditForm('addForm')">确 定</el-button>
        <el-button @click="resetForm('addForm')">取 消</el-button>
      </span>
    </el-dialog>
    <!--供应商历史供货记录-->
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="supplyRecordDialogVisible"
      title="供应商历史供货记录"
      class="record-dialog"
      width="1300px"
      @close="handleCloseRecord">
      <div class="input-item">
        <span class="input-title">材料类型</span>
        <el-select v-model="dialogSearchKeys.cllx" class="search-input" size="small" placeholder="请选择" filterable clearable @change="materialTypeChange">
          <el-option
            v-for="item in materialOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </div>
      <div class="input-item">
        <span class="input-title">材料名称</span>
        <el-select v-model="dialogSearchKeys.clmc" size="small" class="search-input" placeholder="请选择" filterable allow-create default-first-option clearable>
          <el-option
            v-for="item in materialNameOptions"
            :key="item.name"
            :label="item.name"
            :value="item.name"/>
        </el-select>
      </div>
      <div class="input-item">
        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="handleSearchDialog" >查 询</el-button>
        <el-button
          size="small"
          type="danger"
          @click="clearSearchDialog"
        >
          <svg-icon icon-class="clear"/> 重 置
        </el-button>
      </div>
      <div class="clear-both"/>
      <el-table
        v-loading="listLoading"
        :data="dialogList"
        class="broad-scrollbar-table margin-top"
        element-loading-text="拼命加载中"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="供应商" align="center" prop="supplierName" width="120" show-overflow-tooltip/>
        <el-table-column label="检验编号" align="center" prop="checkNo" width="120" show-overflow-tooltip/>
        <el-table-column label="材料类型" align="center" prop="orderTypeName" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-text="getMaterialType(scope.row.materialType)"/>
          </template>
        </el-table-column>
        <el-table-column label="原料批次" align="center" prop="materialBatch" width="120" show-overflow-tooltip/>
        <el-table-column label="材料名称" align="center" prop="materialName" width="120" show-overflow-tooltip/>
        <el-table-column label="型号规格" align="center" prop="specificationsName" width="120" show-overflow-tooltip/>
        <el-table-column label="生产日期" align="center" prop="makeDate" width="120" show-overflow-tooltip/>
        <el-table-column label="是否有效期" align="center" prop="isOver" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.isOver === '1'" style="color:#1ABC9C;font-weight:bold">是</span>
            <span v-if="scope.row.isOver === '0'" style="color:#E25D5D;font-weight:bold">否</span>
          </template>
        </el-table-column>
        <el-table-column label="过期日期" align="center" prop="overDate" width="120" show-overflow-tooltip/>
        <el-table-column label="数量" align="center" prop="num" width="100" show-overflow-tooltip/>
        <el-table-column label="单位" align="center" prop="unitName" width="100" show-overflow-tooltip/>
        <el-table-column label="抽样数量" align="center" prop="sampleNum" width="120" show-overflow-tooltip/>
        <el-table-column label="不良数" align="center" prop="badNum" width="120" show-overflow-tooltip/>
        <el-table-column label="合格率" align="center" prop="orderTypeName" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.rate + '%' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="判定" align="center" prop="remark" width="60" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.result === 0" style="color:#1ABC9C;font-weight:bold">合格</span>
            <span v-if="scope.row.result === 1" style="color:#E25D5D;font-weight:bold">不合格</span>
          </template>
        </el-table-column>
        <el-table-column label="检验日期" align="center" prop="checkDate" width="120" show-overflow-tooltip/>
        <el-table-column label="检验员" align="center" prop="checkerName" width="120" show-overflow-tooltip/>
        <el-table-column label="是否小批量试样" align="center" prop="remark" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.sample === 1" style="color:#1ABC9C;font-weight:bold">是</span>
            <span v-if="scope.row.sample === 0" style="color:#E25D5D;font-weight:bold">否</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="pageNumDialog"
        :page-sizes="[15, 25, 50]"
        :page-size="pageSizeDialog"
        :total="totalPageDialog"
        class="pagination"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="sizeChangeDialog"
        @current-change="currentChangeDialog"
      />
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./supplierManage.js"></script>

<style scoped>
  .app-container>>> .cell{
    line-height: 33px;
  }
  .app-container>>> td{
    height: 33px;
  }
  .record-dialog>>> .cell{
    line-height: 33px;
  }
  .record-dialog>>> td{
    height: 33px;
  }
  .padding-dialog>>> .el-dialog__footer{
    padding-top: 0;
  }
  .input-item{
    float: left;
    margin-top: 14px;
    margin-right: 10px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 205px);
  }
  .module-title-text{
    margin-bottom: 10px;
  }
  .module-title {
    margin-bottom: 10px;
  }
  .search-input{
    width: 200px;
  }
  .input-title{
    width: 65px;
  }
  .dialog-input{
    width: 100%;
  }
  .padding-dialog>>> .el-dialog__footer{
    /*text-align: center;*/
  }
  .padding-dialog>>> .el-checkbox {
    margin-left: 0px;
  }
  .padding-dialog>>> .el-checkbox:first-child {
    margin-left: 0;
  }
  .img-dialog>>> .el-dialog__header{
    background: #fff;
  }
  .img-dialog>>> .el-dialog__headerbtn .el-dialog__close {
    color: #bbb;
  }
  .record-dialog>>>.el-dialog__body{
    padding-top: 0px;
    padding-bottom: 60px;
  }
</style>
