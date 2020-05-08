<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0px;">
      <div style="position: relative;">
        <div class="input-item">
          <span class="input-title">试样编号</span>
          <el-input v-model="searchKeys.sybh" class="search-input" placeholder="请输入试样编号" size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item">
          <span class="input-title">原料批号</span>
          <el-input v-model="searchKeys.ylph" class="search-input" placeholder="请输入原料批号" size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item">
          <span class="input-title">供应商</span>
          <el-select v-model="searchKeys.gys" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in supplierOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">材料类型</span>
          <el-select v-model="searchKeys.cllb" class="search-input" size="small" placeholder="请选择" filterable clearable @change="materialTypeChange">
            <el-option
              v-for="item in materialOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">材料名称</span>
          <el-select v-model="searchKeys.clmc" class="search-input" size="small" placeholder="请选择" filterable clearable allow-create default-first-option>
            <el-option
              v-for="item in materialNameOptions"
              :key="item.name"
              :label="item.name"
              :value="item.name"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">试样结果</span>
          <el-select v-model="searchKeys.syjg" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in resultOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">接收人</span>
          <el-select v-model="searchKeys.jsr" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in reciveOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">试样状态</span>
          <el-select v-model="searchKeys.syzt" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in statusOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div style="float: left;width: 780px; height: 46px;">
          <div class="input-item" style="margin-right: 20px;margin-left: 10px;padding-top: 8px">
            <el-radio-group v-model="timeRadio">
              <el-radio :label="2">接收日期</el-radio>
              <el-radio :label="1">完成日期</el-radio>
            </el-radio-group>
          </div>
          <div class="input-item">
            <el-date-picker
              v-model="beginDate"
              :picker-options="pickerOptionsStart"
              :editable="false"
              class="search-input"
              size="small"
              type="date"
              placeholder="开始日期"
              value-format="timestamp"
            />
            <span style="display:inline-block;width: 38px;text-align: center"> 至 </span>
            <el-date-picker
              v-model="endDate"
              :picker-options="pickerOptionsEnd"
              :editable="false"
              class="search-input"
              size="small"
              type="date"
              placeholder="结束日期"
              value-format="timestamp"
            />
          </div>
          <div class="input-item">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-search"
              @click="handleSearch" >查 询</el-button>
            <el-button
              size="small"
              type="danger"
              @click="clearSearch"
            >
              <svg-icon icon-class="clear"/> 重 置
            </el-button>
          </div>
        </div>
        <el-button
          style="position: absolute;right: 0;bottom: 0;"
          size="small"
          type="primary"
          @click="handleExport"
        ><svg-icon icon-class="export"/> 导 出</el-button>
        <div class="clear-both"/>
      </div>
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        ref="billTable"
        :data="list"
        :key="tableKey"
        height="90%"
        class="broad-scrollbar-table"
        element-loading-text="拼命加载中"
        border
        fit
        highlight-current-row
        @row-click="rowClick"
      >
        <el-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="试样编号" align="center" prop="sampleNo" width="120" show-overflow-tooltip fixed/>
        <el-table-column label="发起人" align="center" prop="initiatorName" width="120" show-overflow-tooltip/>
        <el-table-column label="供应商名称" align="center" prop="supplierName" width="120" show-overflow-tooltip/>
        <el-table-column label="原料批号" align="center" prop="materialBatch" width="120" show-overflow-tooltip/>
        <el-table-column label="材料类型" align="center" prop="materialType" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.materialType === '0'" >金属</span>
            <span v-if="scope.row.materialType === '1'" >化学</span>
          </template>
        </el-table-column>
        <el-table-column label="材料名称" align="center" prop="material" width="120" show-overflow-tooltip/>
        <el-table-column label="型号规格" align="center" prop="specificationsName" width="120" show-overflow-tooltip/>
        <el-table-column label="试样状态" align="center" prop="createTime" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0" style="color:#ed7d31;font-weight:bold">待接收</span>
            <span v-if="scope.row.status === 1" style="color:#009494;font-weight:bold">试样中</span>
            <span v-if="scope.row.status === 2" style="color:#1ABC9C;font-weight:bold">试样完成</span>
          </template>
        </el-table-column>
        <el-table-column label="试样结果" align="center" prop="auditTime" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.result === 0" style="color:#1ABC9C;font-weight:bold">合格</span>
            <span v-if="scope.row.result === 1" style="color:#E25D5D;font-weight:bold">不合格</span>
            <span v-if="scope.row.result === -1">--</span>
          </template>
        </el-table-column>
        <el-table-column label="来料数量" align="center" prop="num" width="120" show-overflow-tooltip/>
        <el-table-column label="试样数量" align="center" prop="sampleNum" width="120" show-overflow-tooltip/>
        <el-table-column label="单位" align="center" prop="unitName" width="120" show-overflow-tooltip/>
        <el-table-column label="到货日期" align="center" prop="reachDate" width="120" show-overflow-tooltip/>
        <el-table-column label="接收人" align="center" prop="receiverName" width="120" show-overflow-tooltip/>
        <el-table-column label="接收日期" align="center" prop="receiveDate" width="120" show-overflow-tooltip/>
        <el-table-column label="完成日期" align="center" prop="finishDate" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status === 0" type="primary" style="background: #ed7d31;border-color: #ed7d31" size="mini" @click="handleReceiver(scope.row)"><svg-icon icon-class="jieshou"/> 接收</el-button>
            <el-button v-if="scope.row.status === 1" type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button v-if="scope.row.status === 2" size="mini" @click="handleEdit(scope.row)"><svg-icon icon-class="chaxun"/> 查看</el-button>
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
    <!--编辑弹窗-->
    <el-dialog
      :before-close="handleDialogClose"
      :close-on-click-modal="false"
      :visible.sync="addMetalDialogVisible"
      title="试样任务"
      class="padding-dialog"
      width="800px"
      top="80px"
      @close="handleClose">
      <el-form ref="addForm" :model="addForm" :rules="rules" status-icon label-width="98px" label-position="right">
        <div>
          <div class="module-title">
            <div class="module-title-text">试样任务</div>
          </div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item class="clear-both" label="试样编号" size="small" prop="sybh">
                <el-input v-model="addForm.sybh" :disabled="true" class="dialog-input" size="small"/>
              </el-form-item>
              <el-form-item class="clear-both" label="供应商" size="small" prop="gys">
                <el-select v-model="addForm.gys" :disabled="true" class="dialog-input" size="small" placeholder="请选择" clearable>
                  <el-option
                    v-for="item in supplierOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item class="clear-both" label="到货日期" size="small" prop="dhrq">
                <el-date-picker
                  v-model="addForm.dhrq"
                  :disabled="true"
                  :editable="false"
                  class="dialog-input"
                  size="small"
                  type="date"
                  placeholder="请选择到货日期"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
              <el-form-item class="clear-both" label="原料批号" size="small" prop="ylph">
                <el-input v-model="addForm.ylph" :disabled="true" class="dialog-input" placeholder="请输入原料批号" size="small" maxlength="20" clearable/>
              </el-form-item>
              <el-form-item class="clear-both" label="试样部门" size="small" prop="sybm">
                <el-select v-model="addForm.sybm" :disabled="true" class="dialog-input" size="small" placeholder="请选择" clearable>
                  <el-option
                    v-for="item in departmentOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="clear-both" label="材料名称" size="small" prop="clmc">
                <el-select v-model="addForm.clmc" :disabled="true" class="dialog-input" size="small" placeholder="请选择" clearable @change="materialChange">
                  <el-option
                    v-for="item in materialNameDialogOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item class="clear-both" label="型号规格" size="small" prop="xhgg">
                <el-select v-model="addForm.xhgg" :disabled="true" class="dialog-input" size="small" placeholder="请选择" clearable>
                  <el-option
                    v-for="item in modelOptions"
                    :key="item.id"
                    :label="item.model"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item class="clear-both" label="来料数量" size="small" prop="llsl">
                <el-input v-model="addForm.llsl" :disabled="true" class="dialog-input" placeholder="请输入来料数量" size="small" type="number"/>
              </el-form-item>
              <el-form-item class="clear-both" label="原料单位" size="small" prop="yldw">
                <el-select v-model="addForm.yldw" :disabled="true" class="dialog-input" size="small" placeholder="请选择" clearable>
                  <el-option
                    v-for="item in unitOptions"
                    :key="item.id"
                    :label="item.unit"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item class="clear-both" label="试样数量" size="small" prop="sysl">
                <el-input v-model="addForm.sysl" :disabled="true" class="dialog-input" placeholder="请输入试样数量" size="small" type="number"/>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="module-title">
            <div class="module-title-text">试样结论</div>
          </div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item class="clear-both" label="完成日期" size="small" prop="wcrq">
                <el-date-picker
                  :disabled="currentStatus === 2"
                  :picker-options="pickerOptionsFinishDate"
                  v-model="addForm.wcrq"
                  value-format="timestamp"
                  class="dialog-input"
                  type="date"
                  placeholder="完成日期"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="clear-both" label="试样结果" size="small" prop="syjg">
                <el-radio-group v-model="addForm.syjg" :disabled="currentStatus === 2">
                  <el-radio :label="0">合格</el-radio>
                  <el-radio :label="1">不合格</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item class="clear-both" label="试样说明" size="small">
            <el-input v-model="addForm.sysm" :disabled="currentStatus === 2" :rows="10" style="width: 655px;" placeholder="请输入试样说明" size="small" type="textarea" maxlength="500" clearable/>
          </el-form-item>
          <el-form-item :class="{'isview' : currentStatus === 2}" class="clear-both" label="添加附件" size="small" prop="file">
            <el-upload
              ref="upload"
              :disabled="currentStatus === 2"
              :on-remove="handleRemove"
              :on-preview="handlePreview"
              :file-list="fileList"
              :auto-upload="false"
              :limit="3"
              :on-exceed="onExceed"
              :on-change="uploadChange"
              :on-success="onSuccess"
              :with-credentials="true"
              :data="uploadParams"
              :action="fileUrl"
              :before-upload="beforeUpload"
              class="upload-demo"
            >
              <!--accept=".dll"-->
              <el-button slot="trigger" :disabled="currentStatus === 2" size="small" type="primary">选取文件</el-button>
              <!--<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>-->
              <!--<span slot="tip" class="el-upload__tip" style="margin-left: 15px;">只能上传 dll 文件，且只能上传一份</span>-->
            </el-upload>
          </el-form-item>
        </div>
      </el-form>
      <span v-if="currentStatus === 1" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEditForm('addForm')">确 定</el-button>
        <el-button @click="resetForm('addForm')">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./receive.js"></script>

<style scoped>
  .app-container>>> .cell{
    line-height: 37px;
  }
  .el-upload-list__item .el-icon-close{
    display: none!important;
  }
  .app-container>>> td{
    height: 37px;
  }
  .padding-dialog>>> .cell{
    line-height: 28px;
  }
  .padding-dialog>>> td{
    height: 28px;
  }
  .padding-dialog>>> .el-dialog__footer{
    padding-top: 0;
  }
  .padding-dialog>>> .el-dialog__body {
    padding-top: 0px;
  }
  .input-item{
    float: left;
    margin-top: 14px;
    margin-right: 10px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 249px);
  }
  .module-title-text{
    margin-bottom: 10px;
  }
  .module-title {
    margin-bottom: 10px;
  }
  .search-input{
    width: 138px;
  }
  .input-title{
    width: 65px;
  }
  .dialog-input{
    width: 260px;
  }
  .padding-dialog>>> .el-dialog__footer{
    /*text-align: center;*/
  }
  .padding-dialog>>> .el-checkbox {
    margin-left: 138px;
  }
  .img-dialog>>> .el-dialog__header{
    background: #fff;
  }
  .img-dialog>>> .el-dialog__headerbtn .el-dialog__close {
    color: #bbb;
  }
  .padding-dialog .isview>>> .el-upload{
    display: none;
  }
</style>
