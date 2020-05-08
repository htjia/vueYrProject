<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 15px">
      <div class="header-btn-group">
        <el-button
          size="small"
          type="primary"
          @click="handleAdd"
        ><svg-icon icon-class="add"/> 新增点检</el-button>
        <el-button
          :disabled="list.length === 0"
          size="small"
          type="primary"
          @click="handleReplenish"
        ><svg-icon icon-class="biaoqian"/> 补打标签</el-button>
        <el-button
          class="float-right margin-left"
          size="small"
          type="primary"
          @click="exportExcel"
        >
          <svg-icon icon-class="export"/> 导 出
        </el-button>
        <el-button
          class="float-right"
          size="small"
          type="primary"
          @click="selectThead" ><svg-icon icon-class="shezhilk"/> 设置显示列</el-button>
      </div>
      <div class="input-item">
        <span class="input-title">WaferID</span>
        <el-input v-model="searchKeys.WaferNo" class="search-input" style="width: 260px;" placeholder="请输入WaferID" size="small" maxlength="100" clearable/>
      </div>
      <div class="input-item">
        <span class="input-title-short">机台</span>
        <el-select v-model="searchKeys.jt" class="search-input" size="small" placeholder="请选择" filterable clearable>
          <el-option
            v-for="item in machineList"
            :key="item.id"
            :label="item.code"
            :value="item.id"/>
        </el-select>
      </div>
      <div class="input-item">
        <span class="input-title-short">测试类型</span>
        <el-select v-model="searchKeys.cslx" class="search-input" size="small" placeholder="请选择" filterable clearable>
          <el-option
            v-for="item in testOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </div>
      <div class="input-item">
        <span class="input-title-short">型号</span>
        <el-select v-model="searchKeys.xh" class="search-input" size="small" placeholder="请选择" filterable clearable>
          <el-option
            v-for="item in modelList"
            :key="item.code"
            :label="item.code"
            :value="item.code"/>
        </el-select>
      </div>
      <div class="input-item">
        <span class="input-title-short">时间</span>
        <!--<el-select v-model="searchKeys.searchTime" class="search-input" size="small" placeholder="请选择" clearable>
          <el-option
            v-for="item in timeOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>-->
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
        <el-button
          class="margin-left"
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
      <div class="clear-both"/>
    </div>
    <div class="app-container">
      <div v-if="selectTheadVisble" class="select-thead">
        <div class="options-box">
          <el-checkbox-group v-model="checkboxVal">
            <el-checkbox v-for="option in formTheadOptions" :label="option" :key="option">
              {{ option }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <el-button type="primary" size="mini" style="margin-left: 25px" @click="submitOption">确 定</el-button>
        <el-button size="mini" @click="resetOption">取 消</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        ref="runTable"
        :data="list"
        height="calc(100vh - 346px)"
        element-loading-text="拼命加载中"
        class="broad-scrollbar-table"
        highlight-current-row
        border
        @row-click="rowClick">
        <el-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="WaferID" width="260" prop="waferNo" fixed/>
        <el-table-column align="center" label="划片机台" width="100" prop="machineCode" fixed/>
        <el-table-column v-for="item in formThead" :key="item.thName" :label="item.thName" :render-header="labelHead" align="center">
          <template slot-scope="scope">
            {{ scope.row[item.thKey] }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="划前文档" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <div style="color: #009494;text-decoration: underline;cursor: pointer;" @click="downLoadQ(scope.row)">查看详情</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="划后文档" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <div style="color: #009494;text-decoration: underline;cursor: pointer;" @click="downLoadH(scope.row)">查看详情</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="COT文档" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <div style="color: #009494;text-decoration: underline;cursor: pointer;" @click="downLoadFile(scope.row.cotFilePath)">点击下载</div>
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
      class="inspect-dialog"
      title="新增点检"
      width="600px"
      @close="handleClose('machineForm')">
      <el-form ref="machineForm" :model="machineForm" :rules="rules" status-icon label-width="102px" label-position="right">
        <el-form-item label="测试片扫描 " prop="code">
          <el-input ref="importInput" :autofocus="true" v-model="machineForm.code" placeholder="测试片扫描" size="small" maxlength="100" @change="importInputChange" @keyup.enter.native="handleReceiveInput"/>
        </el-form-item>
        <el-form-item label="划片机台 " prop="jt">
          <el-select v-model="machineForm.jt" size="small" placeholder="请选择" filterable @change="machineChange">
            <el-option
              v-for="item in machineList"
              :key="item.id"
              :label="item.code"
              :value="item.id +'%'+ item.code"/>
          </el-select>
        </el-form-item>
        <div>
          <el-checkbox :disabled="disabledBefor" v-model="checkedBefor" @change="beforCheckboxChange">划前测试</el-checkbox>
          <el-input :disabled="true" v-model="machineForm.beforeWafer" size="small" style="width: 365px;" maxlength="100"/>
          <el-button
            :disabled="!checkedBefor"
            class="margin-left"
            size="small"
            type="primary"
            @click="labelPrint('划前')"><svg-icon icon-class="print"/> 打印</el-button>
        </div>
        <div>
          <el-checkbox :disabled="disabledBefor" v-model="checkedAfter" @change="afterCheckboxChange">划后测试</el-checkbox>
          <el-input :disabled="true" v-model="machineForm.afterWafer" size="small" style="width: 365px;margin: 20px 0" maxlength="100"/>
          <el-button
            :disabled="!checkedAfter"
            class="margin-left"
            size="small"
            type="primary"
            @click="labelPrint('划后')"><svg-icon icon-class="print"/> 打印</el-button>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="!checkedBefor && !checkedAfter" type="primary" @click="submitForm('machineForm')">确 定</el-button>
        <el-button @click="resetForm('machineForm')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      class="inspect-dialog"
      title="补打标签"
      width="600px"
      @close="handleClose('machineForm')">
      <el-form ref="machineForm" :model="machineForm" :rules="rules" status-icon label-width="102px" label-position="right">
        <el-form-item label="测试片扫描 " prop="code">
          <el-input :disabled="true" v-model="machineForm.code" placeholder="测试片扫描" size="small" maxlength="100" @change="importInputChange"/>
        </el-form-item>
        <el-form-item label="划片机台 " prop="jt">
          <el-select :disabled="true" v-model="machineForm.jt" size="small" placeholder="请选择" filterable @change="machineChange">
            <el-option
              v-for="item in machineList"
              :key="item.id"
              :label="item.code"
              :value="item.id +'%'+ item.code"/>
          </el-select>
        </el-form-item>
        <div>
          <el-checkbox :disabled="disabledBefor" v-model="checkedBefor" @change="beforCheckboxChange">划前测试</el-checkbox>
          <el-input :disabled="true" v-model="machineForm.beforeWafer" size="small" style="width: 365px;" maxlength="100"/>
          <el-button
            :disabled="!checkedBefor"
            class="margin-left"
            size="small"
            type="primary"
            @click="labelPrint('划前')"><svg-icon icon-class="print"/> 打印</el-button>
        </div>
        <div>
          <el-checkbox :disabled="disabledAfter" v-model="checkedAfter" @change="afterCheckboxChange">划后测试</el-checkbox>
          <el-input :disabled="true" v-model="machineForm.afterWafer" size="small" style="width: 365px;margin: 20px 0" maxlength="100"/>
          <el-button
            :disabled="!checkedAfter"
            class="margin-left"
            size="small"
            type="primary"
            @click="labelPrint('划后')"><svg-icon icon-class="print"/> 打印</el-button>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEditForm">确 定</el-button>
        <el-button @click="resetForm('machineForm')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="downFileVisble"
      class="padding-dialog"
      title="文件下载"
      width="700px"
    >
      <el-table
        :data="fileList"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="文件名" align="center" prop="fileName"/>
        <el-table-column label="操作" align="center" prop="status" width="100">
          <template slot-scope="scope">
            <div style="color: #009494;text-decoration: underline;cursor: pointer;" @click="downLoadFile(scope.row.filePath)">点击下载</div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .inspect-dialog>>> .el-checkbox{
    margin-left: 10px;
    margin-right: 10px;
  }
  .inspect-dialog>>> .el-checkbox__label{
    font-weight: bold;
  }
  .app-container>>> .cell{
    line-height: 37px;
  }
  .app-container>>> td{
    height: 37px;
  }
  .input-title{
    width: 75px;
  }
  .input-title-short{
    width: 50px;
    font-weight: bold;
    padding-right: 5px;
  }
  .input-item{
    float: left;
    margin-top: 14px;
    margin-right: 10px;
    position: relative;
  }
  /*.input-item>>> .el-radio:last-child {*/
    /*left: 0;*/
    /*margin-right: 0;*/
    /*position: absolute;*/
    /*top: 43px;*/
  /*}*/
  .input-item>>> .el-radio{
    margin-top: 10px;
  }
  .search-input{
    width: 120px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 265px);
  }
  .app-container>>> .el-checkbox{
    margin-left: 30px;
    display: block;
  }
  .import-dialog>>>.el-dialog__body{
    padding: 20px;
    padding-top: 10px;
  }
  .tab-control span{
    line-height: 50px;
  }
  .el-checkbox {
    margin-left: 0px;
  }
  .header-search-add >>>.el-input--prefix .el-input__inner {
    padding-left: 28px;
    padding-right: 18px;
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
    width: 220px;
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
</style>
