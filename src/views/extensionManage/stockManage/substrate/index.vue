<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto">
      <div class="header-btn-group">
        <el-upload
          ref="upload"
          :auto-upload="true"
          :on-success="onSuccess"
          :on-error="onError"
          :action="fileUrl"
          :show-file-list="false"
          :before-upload="beforeUpload"
          :data="uploadParams"
          :with-credentials="true"
          style="float: left; margin-right: 15px"
          accept=".xls,.xlsx"
          class="upload-demo"
        >
          <el-button v-loading="loading" slot="trigger" size="small" type="primary"><svg-icon icon-class="import"/>  导入衬底文档</el-button>
        </el-upload>
        <el-button
          size="small"
          type="primary"
          @click="handleAdd"
        ><svg-icon icon-class="add"/> 新增衬底信息</el-button>
        <el-button
          size="small"
          type="primary"
          @click="viewImportRecords"
        ><svg-icon icon-class="importRecords"/> 导入记录</el-button>
        <el-button
          size="small"
          type="primary"
          @click="handleExport"
        ><svg-icon icon-class="export"/> 导出</el-button>
        <el-button
          v-if="showHandle"
          size="small"
          class="float-right"
          type="primary"
          @click="dataManageSave"
        ><svg-icon icon-class="back_icon" style="color: #fff"/> 返 回</el-button>
        <el-button
          v-if="!showHandle"
          size="small"
          class="float-right"
          type="primary"
          @click="dataManage"
        ><svg-icon icon-class="shujuguanli"/> 数据管理</el-button>
      </div>
      <el-row>
        <el-col :span="24">
          <div class="input-item">
            <span class="input-title" style="width: 50px">镭刻号</span>
            <el-input v-model="searchKeys.lkh" class="search-input" placeholder="请输入镭刻号" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 35px">箱号</span>
            <el-input v-model="searchKeys.xh" class="search-input" placeholder="请输入箱号" onkeyup="this.value = this.value.replace(/[^0-9]/g, '')" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 50px">单双抛</span>
            <el-select v-model="searchKeys.sd" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in singleDoubleOptions"
                :key="item.name"
                :label="item.name"
                :value="item.name"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">衬底厂家</span>
            <el-input v-model="searchKeys.gys" class="search-input" placeholder="请输入衬底厂家" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">导入时间</span>
            <el-date-picker
              v-model="beginDate"
              :picker-options="pickerOptionsStart"
              :editable="false"
              class="search-input"
              size="small"
              type="date"
              placeholder="选择开始日期"
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
              placeholder="选择结束日期"
              value-format="timestamp"
            />
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 50px">批次号</span>
            <el-input v-model="searchKeys.pch" class="search-input" placeholder="请输入批次号" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 35px">盒号</span>
            <el-input v-model="searchKeys.boxNum" class="search-input" placeholder="请输入盒号" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">衬底工艺</span>
            <el-select v-model="searchKeys.cdlx" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">衬底尺寸</span>
            <el-select v-model="searchKeys.cdcc" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in measureList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">是否生长</span>
            <el-select v-model="searchKeys.sfsz" class="search-input short-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in whetherOptions"
                :key="item.name"
                :label="item.name"
                :value="item.name"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">是否铝氮</span>
            <el-select v-model="searchKeys.sfld" class="search-input short-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in whetherOptions"
                :key="item.name"
                :label="item.name"
                :value="item.name"/>
            </el-select>
          </div>
          <div style="float: left">
            <el-button
              class="margin-top"
              size="small"
              type="primary"
              icon="el-icon-search"
              @click="handleSearch" >查 询</el-button>
            <el-button
              class="margin-top"
              style="margin-right: 15px"
              size="small"
              type="danger"
              @click="clearSearch"
            >
              <svg-icon icon-class="clear"/> 重 置
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :key="tableKey"
        :data="list"
        height="92%"
        class="broad-scrollbar-table"
        element-loading-text="拼命加载中"
        border
        fit>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="导入时间" align="center" prop="createTime" width="150" show-overflow-tooltip/>
        <el-table-column label="镭刻号" align="center" prop="laserMark" show-overflow-tooltip min-width="90"/>
        <el-table-column label="衬底工艺" align="center" prop="typeName" width="80" show-overflow-tooltip/>
        <el-table-column label="衬底尺寸" align="center" prop="measureName" width="60"/>
        <el-table-column label="单/双抛" align="center" prop="singleDoubleThrow" width="60"/>
        <el-table-column label="衬底厂家" align="center" prop="supplier" show-overflow-tooltip min-width="80"/>
        <el-table-column label="批次号" align="center" prop="batchNo" min-width="140" show-overflow-tooltip/>
        <el-table-column label="箱号" align="center" prop="cartonNo" show-overflow-tooltip width="50"/>
        <el-table-column label="出厂盒号" align="center" prop="boxNo" min-width="160" show-overflow-tooltip/>
        <el-table-column label="次序号" align="center" prop="sequence" show-overflow-tooltip width="60"/>
        <el-table-column label="铝氮盒号" align="center" prop="alnBoxNo" min-width="160" show-overflow-tooltip/>
        <el-table-column label="次序号" align="center" prop="alnSequence" show-overflow-tooltip width="60"/>
        <el-table-column label="散片盒号" align="center" prop="sliceBoxNo" min-width="160" show-overflow-tooltip/>
        <el-table-column label="次序号" align="center" prop="sliceSequence" show-overflow-tooltip width="60"/>
        <el-table-column label="是否生长" align="center" prop="growIs" width="70"/>
        <el-table-column label="宕机清洗片" align="center" prop="clearIs" width="80"/>
        <el-table-column v-if="showHandle" label="操作" align="center" prop="status" width="150" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.growIs === '否' && scope.row.alnBoxNo === null && scope.row.sliceBoxNo === null"
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              v-if="scope.row.growIs === '否' && scope.row.alnBoxNo === null && scope.row.sliceBoxNo === null"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)">删除</el-button>
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
      title="新增"
      width="780px"
      @close="handleClose('substrateForm')">
      <el-form ref="substrateForm" :model="substrateForm" :rules="rules" status-icon label-width="100px" label-position="right">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="镭刻号" prop="lkh">
              <el-input v-model="substrateForm.lkh" placeholder="请输入镭刻号" maxlength="20" oninput="this.value=this.value.replace(/[^0-9 a-z A-Z]/g,'');" clearable/>
            </el-form-item>
            <el-form-item label="批次号" prop="pch">
              <el-input v-model="substrateForm.pch" placeholder="请输入批次号" maxlength="20" oninput="this.value=this.value.replace(/[^0-9 a-z A-Z -]/g,'');" clearable/>
            </el-form-item>
            <el-form-item label="盒号" prop="boxNum">
              <el-input v-model="substrateForm.boxNum" placeholder="请输入盒号" maxlength="20" oninput="this.value=this.value.replace(/[^0-9 a-z A-Z -]/g,'');" clearable/>
            </el-form-item>
            <el-form-item label="衬底尺寸" prop="chic">
              <el-select v-model="substrateForm.chic" placeholder="请选择衬底尺寸" style="width: 260px" filterable>
                <el-option
                  v-for="item in measureList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
            <el-form-item label="衬底工艺" prop="cdlx">
              <el-select v-model="substrateForm.cdlx" placeholder="请选择衬底工艺" style="width: 260px" filterable>
                <el-option
                  v-for="item in typeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="衬底厂家" prop="gys">
              <el-input v-model="substrateForm.gys" placeholder="请输入衬底厂家" maxlength="20" clearable/>
            </el-form-item>
            <el-form-item label="箱号" prop="xh">
              <el-input v-model="substrateForm.xh" placeholder="请输入箱号" onkeyup="this.value = this.value.replace(/[^0-9]/g, '')" maxlength="20" clearable/>
            </el-form-item>
            <el-form-item label="次序号" prop="cxh">
              <el-input v-model="substrateForm.cxh" placeholder="请输入次序号" type="text" onkeyup="this.value = this.value.replace(/[^0-9]/g, '')" maxlength="2" clearable/>
            </el-form-item>
            <el-form-item label="单/双抛" prop="sd">
              <el-select v-model="substrateForm.sd" placeholder="请选择单/双抛" style="width: 260px" filterable>
                <el-option
                  v-for="item in singleDoubleOptions"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitForm('substrateForm')">确 定</el-button>
        <el-button size="small" @click="resetForm('substrateForm')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="编辑"
      width="780px"
      @close="handleClose('substrateForm')">
      <el-form ref="substrateForm" :model="substrateForm" :rules="rules" status-icon label-width="100px" label-position="right">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="镭刻号" prop="lkh">
              <el-input v-model="substrateForm.lkh" placeholder="请输入镭刻号" maxlength="20" oninput="this.value=this.value.replace(/[^0-9 a-z A-Z]/g,'');" clearable/>
            </el-form-item>
            <el-form-item label="批次号" prop="pch">
              <el-input v-model="substrateForm.pch" placeholder="请输入批次号" maxlength="20" oninput="this.value=this.value.replace(/[^0-9 a-z A-Z -]/g,'');" clearable/>
            </el-form-item>
            <el-form-item label="盒号" prop="boxNum">
              <el-input v-model="substrateForm.boxNum" placeholder="请输入盒号" maxlength="20" oninput="this.value=this.value.replace(/[^0-9 a-z A-Z -]/g,'');" clearable/>
            </el-form-item>
            <el-form-item label="衬底尺寸" prop="chic">
              <el-select v-model="substrateForm.chic" placeholder="请选择衬底尺寸" style="width: 260px" filterable>
                <el-option
                  v-for="item in measureList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
            <el-form-item label="衬底工艺" prop="cdlx">
              <el-select v-model="substrateForm.cdlx" placeholder="请选择衬底工艺" style="width: 260px" filterable>
                <el-option
                  v-for="item in typeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="衬底厂家" prop="gys">
              <el-input v-model="substrateForm.gys" placeholder="请输入衬底厂家" maxlength="20" clearable/>
            </el-form-item>
            <el-form-item label="箱号" prop="xh">
              <el-input v-model="substrateForm.xh" placeholder="请输入箱号" maxlength="20" oninput="this.value=this.value.replace(/[^0-9]/g,'');" clearable/>
            </el-form-item>
            <el-form-item label="次序号" prop="cxh">
              <el-input v-model="substrateForm.cxh" placeholder="请输入次序号" type="text" maxlength="2" oninput="this.value=this.value.replace(/[^0-9]/g,'');" clearable/>
            </el-form-item>
            <el-form-item label="单/双抛" prop="sd">
              <el-select v-model="substrateForm.sd" placeholder="请选择单/双抛" style="width: 260px" filterable>
                <el-option
                  v-for="item in singleDoubleOptions"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitEditForm('substrateForm')">确 定</el-button>
        <el-button size="small" @click="resetForm('substrateForm')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="importDialogVisible"
      top="80px"
      class="import-dialog"
      title="衬底文件导入记录"
      width="1200px"
      @close="handleCloseImportDialog">
      <div class="search-box" style="padding-bottom: 15px;overflow: hidden">
        <div class="left-search-box">
          <div class="input-item">
            <span class="input-title">操作人</span>
            <el-input v-model="operatorName" class="search-input" placeholder="请输入操作人" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">文件名</span>
            <el-input v-model="fileName" class="search-input" placeholder="请输入文件名" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">导入时间</span>
            <el-date-picker
              v-model="startTime"
              :picker-options="pickerOptionsStartTime"
              :editable="false"
              class="search-input"
              size="small"
              type="date"
              placeholder="选择开始日期"
              value-format="timestamp"
            />
            <span style="display:inline-block;width: 38px;text-align: center"> 至 </span>
            <el-date-picker
              v-model="endTime"
              :picker-options="pickerOptionsEndTime"
              :editable="false"
              class="search-input"
              size="small"
              type="date"
              placeholder="选择结束日期"
              value-format="timestamp"
            />
          </div>
        </div>
        <div class="right-btn-box" style="margin-top: 3px">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="viewImportRecords"
          >查 询
          </el-button>
          <el-button
            class="margin-top margin-left"
            size="small"
            type="danger"
            @click="clearDialogSearch" > <svg-icon icon-class="clear"/> 重 置</el-button>
        </div>
      </div>
      <el-table
        v-loading="listLoading"
        :data="importRecords"
        class="mocvd-table"
        height="600px"
        element-loading-text="拼命加载中"
        border
        fit>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="文件名" align="center" prop="fileName" show-overflow-tooltip/>
        <el-table-column label="导入时间" align="center" prop="operateTime" width="180"/>
        <el-table-column label="操作人" align="center" prop="operatorName" width="150"/>
        <el-table-column label="操作" align="center" prop="name" width="120">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-back" @click="deleteDataRecordFun(scope.row)">撤销导入</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="height: 45px;">
        <el-pagination
          :current-page="pageNumSp"
          :page-sizes="[15, 25, 50]"
          :page-size="pageSizeSp"
          :total="totalPageSp"
          class="pagination"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="sizeChangeSp"
          @current-change="currentChangeSp"
        />
      </div>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./substrate.js"></script>

<style scoped>
  .input-item{
    float: left;
    margin-top: 14px;
    margin-right: 10px;
  }
  .input-title {
    width: 65px
  }
  .search-input{
    width: 155px;
  }
  .short-input{
    width: 126px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 310px);
  }
  .import-dialog>>>.el-dialog__body{
    padding: 20px;
    padding-top: 10px;
  }
  .app-container>>> .cell{
    line-height: 35px;
  }
  .app-container>>> td{
    height: 35px;
  }
</style>
