<template>
  <PageHeaderLayout>
    <div class="header-search-add height-auto">
      <el-row>
        <el-col style="margin-top: -15px;">
          <div class="input-item">
            <span class="input-title" style="width:70px">异常类型 </span>
            <el-select v-model="model" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in substrateFindOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">时间 </span>
            <el-date-picker
              v-model="beginDate"
              :picker-options="pickerOptionsStart"
              :editable="false"
              class="search-input"
              style="width:130px"
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
              style="width:130px"
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
          </div>
          <div class="input-item">
            <el-button
              size="small"
              type="danger"
              @click="clearAll" ><svg-icon icon-class="clear"/> 重 置</el-button>
          </div>
          &nbsp;
          <el-button
            style="margin-top: 15px;margin-left:15px"
            class="float-right"
            size="small"
            type="primary"
            icon="el-icon-sold-out"
            @click="importExcel">导出</el-button>
          <el-button
            style="margin-top: 15px"
            class="float-right"
            size="small"
            type="primary"
            @click="handleAdd" ><svg-icon icon-class="add"/> 新增</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="module-container" style="margin-top: 10px;padding-top:10px;padding-bottom:10px">
      <div class="tab-control" style="margin: 0px 15px;">
        <span
          :class="{activeTab: isActive === 0}"
          @click="navClick(0)"
        >重大异常</span>
        <span
          :class="{activeTab: isActive === 1}"
          class="has-margin-left"
          @click="navClick(1)"
        >一般异常</span>
      </div>
      <el-row style="border:1px solid #e5e5e5;margin: 15px">
        <el-col :span="8" style="border-right: 5px solid #e5e5e5;">
          <div class="charts-right" style="padding-top:15px;height:267px">
            <div v-if="tableList.length === 0" class="no-data">
              <svg-icon class="no-data-icon" icon-class="noData"/>
              <div>暂无数据</div>
            </div>
            <chart v-if="tableList.length > 0" id="acplxtj" :options="options1" height="250px" width="100%"/>
          </div>
        </el-col>
        <el-col :span="16" style="border-left: 5px solid #e5e5e5;">
          <div class="charts-right" style="padding-top:15px;height:267px">
            <div v-if="tableList.length === 0" class="no-data">
              <svg-icon class="no-data-icon" icon-class="noData"/>
              <div>暂无数据</div>
            </div>
            <chart v-if="tableList.length > 0" id="acplxtj1" :options="options" height="250px" width="100%"/>
          </div>
        </el-col>
      </el-row>
      <!-- 是表格 -->
      <div class="chart-table" style="margin: 15px;border-top: 10px solid #e5e5e5;padding-top: 10px;">
        <el-table
          v-loading="listLoading"
          :data="tableList"
          height="calc(100vh - 617px)"
          class="run-table"
          element-loading-text="拼命加载中"
          highlight-current-row
          border
          fit>
          <el-table-column align="center" label="序号" width="50" fixed>
            <template slot-scope="scope">
              {{ (pageNum - 1) * pageSize + scope.$index+1 }}
            </template>
          </el-table-column>
          <el-table-column label="日期" fixed="left" align="center" prop="createTime" width="130"/>
          <el-table-column label="异常等级" align="center" prop="gradetext"/>
          <el-table-column label="异常类型" align="center" prop="exceptionText"/>
          <el-table-column label="异常数量" align="center" prop="badnum"/>
          <el-table-column label="备注" align="center" prop="remark"/>
          <el-table-column label="操作" align="center" prop="status">
            <template slot-scope="scope">
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
    </div>
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible"
      title="新增"
      width="500px"
      @close="handleClose('programForm')">
      <el-form ref="programForm" :model="programForm" :rules="rules" status-icon label-width="80px" label-position="right">
        <el-form-item label="日期" prop="dates">
          <el-date-picker
            v-model="programForm.dates"
            :editable="false"
            size="small"
            style="width: 380px"
            type="date"
            placeholder="日期"
            value-format="timestamp"
          />
        </el-form-item>
        <el-form-item label="异常等级" prop="level">
          <el-select v-model="programForm.level" size="small" style="width: 380px" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in levelList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="异常类型" prop="model">
          <el-select v-model="programForm.model" size="small" style="width: 380px" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in substrateFindOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="不良数量" prop="num">
          <el-input v-model="programForm.num" placeholder="请输入不良数量" type="number" maxlength="6"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="programForm.remark" :rows="5" placeholder="请输入备注" type="textarea" maxlength="50"/>
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
      :visible.sync="editDialogVisible"
      title="编辑"
      width="500px"
      @close="handleClose('programForm')">
      <el-form ref="programForm" :model="programForm" :rules="rules" status-icon label-width="80px" label-position="right">
        <el-form-item label="日期" prop="dates">
          <el-date-picker
            v-model="programForm.dates"
            :editable="false"
            size="small"
            style="width: 380px"
            type="date"
            placeholder="日期"
            value-format="timestamp"
          />
        </el-form-item>
        <el-form-item label="异常等级" prop="level">
          <el-select v-model="programForm.level" size="small" style="width: 380px" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in levelList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="异常类型" prop="model">
          <el-select v-model="programForm.model" size="small" style="width: 380px" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in substrateFindOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="不良数量" prop="num">
          <el-input v-model="programForm.num" placeholder="请输入不良数量" type="number" maxlength="6"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="programForm.remark" :rows="5" placeholder="请输入备注" type="textarea" maxlength="50"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEditForm('programForm')">确 定</el-button>
        <el-button @click="resetForm('programForm')">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./indexs.js"></script>

<style scoped>
  .app-container>>> .cell{
    line-height: 37px;
  }
  .app-container>>> td{
    height: 37px;
  }
  .padding-dialog>>> .cell{
    line-height: 30px;
  }
  .padding-dialog>>> td{
    height: 30px;
  }
  .padding-dialog>>> .el-dialog__footer{
    text-align: center;
  }
  .view-progress>>> .cell{
    line-height: 35px !important;
  }
  .view-progress>>> .td{
    height: 35px;
  }
  .input-title{
    width: 65px;
  }
  .input-item{
    float: left;
    margin-right: 10px;
    margin-top: 15px;
  }
  .search-input{
    width: 150px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 203px);
  }
  .import-dialog>>>.el-dialog__body{
    padding: 20px;
    padding-top: 10px;
  }
  .tab-control span{
    line-height: 20px;
  }
  .el-checkbox {
    margin-left: 0px;
  }
  .header-search-add >>>.el-input--prefix .el-input__inner {
    padding-left: 28px;
    padding-right: 18px;
  }
  .app-container>>> .el-checkbox{
    margin-left: 20px;
    display: block;
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
  /*.broad-scrollbar-table>>> .el-table__fixed, .broad-scrollbar-table>>> .el-table__fixed-right{*/
    /*background: #fff;*/
    /*height: calc(100% - 16px) !important;*/
  /*}*/
  .broad-scrollbar-table>>> .is-scrolling-none +.el-table__fixed,
  .broad-scrollbar-table>>> .is-scrolling-none +.el-table__fixed +.el-table__fixed-right {
    height: 100% !important;
  }
  .proce-box{
    display: flex;
    flex-direction: row;
  }
  .proce-left{
    flex-grow: 1;
  }
  .proce-right{
    width: 200px;
    flex-shrink: 0;
  }
  .proce-input{
    width: 200px;
  }
  .has-margin-top{
    margin-top: 15px;
  }
  .btn-group{
    position: absolute;
    bottom: 15px;
    right: 15px;
  }
  .option-items{
    float: left;
    width: 350px;
    height: 40px;
  }
  .option-items-dialog{
    display: inline-block;
    width: 280px;
  }
  .option-title{
    display: inline-block;
    width: 85px;
    text-align: right;
    font-weight: bold;
  }
  .proceCardType{
    font-size: 26px;
    vertical-align: sub;
    margin-bottom: 18px;
    color: #009494;
    font-weight: bold;
  }
  .color-title{
    display: inline-block;
    width: 60px;
    margin: 2px 0;
    line-height: 20px;
  }
  .model-box{
    margin-left: 60px;
    line-height: 25px;
    word-wrap: break-word;
    overflow: hidden;
  }
  .model-item{
    float: left;
    margin-left: 10px;
  }
  .abnormal-process-table>>> td{
    background: #f9ebeb;
  }
  .dialog-table>>>.el-input.is-disabled .el-input__inner {
    background-color: transparent;
    border-color: transparent;
    color: #666;
    cursor: default;
    text-align: center;
  }
  .dialog-table>>>.el-input.is-disabled .el-input__icon{
    display: none;
  }
  .has-bancground{
    background: rgba(181, 184, 218, 0.84);
    height: 41px;
  }
  .has-height{
    height: 41px;
  }
  .padding-dialog>>> .el-dialog__body {
    height: 640px;
    overflow: auto;
  }
  .has-margin-right{
    margin-right: 51%;
  }
  .input-container{
    padding: 10px;
    border: 1px solid #b2dfdf;
    padding-right: 0;
    background: #edf7f7;
    margin-top: 0;
    margin-bottom: 15px;
  }
  .input-container .input-title{
    width: 85px;
    font-weight: bold;
    text-align: right;
    font-size: 18px;
  }
  .tab-control span{
    width: 90px;
    line-height: 20px;
    padding-bottom: 5px;
  }
  .tab-control{
    margin-bottom: 5px;
  }
  .tab-control span+span{
    width: 90px;
  }
  .table-top-btn-group{
    overflow: hidden;
  }
  .table-top-btn-group>div{
    float: left;
    margin-left: 15px;
    height: 20px;
    line-height: 30px;
    padding: 0 15px;
    border: 1px solid #e2e2e2;
    cursor: pointer;
  }
  .table-top-btn-group>div.active{
    color: #fff;
    background: #009494;
    border-color: #009494;
  }
  .primarya{
    color:#009494;
    cursor: pointer;
  }
  .treesty{
    height: 200px;
    overflow: auto;
    border: 1px solid rgb(229, 229, 229);
    padding-top: 5px;
    padding-left: 5px;
    margin-left: 70px;
    position: absolute;
    z-index: 99;
    width: 200px;
    background: #fff;
    border-radius: 3px;
    margin-top: 10px;
  }
  .treesty1{
    position: absolute;
    margin-left: 87px;
    z-index: 999;
    height: 10px;
    width: 10px;
    background: #fff;
    transform: rotate(45deg);
    border-left: 1px solid #e5e5e5;
    border-top: 1px solid #e5e5e5;
    margin-top: 5px;
  }
  .broad-scrollbar-table>>>.el-table__fixed-right {
    height: calc(100vh - 227px) !important;
  }
  .broad-scrollbar-table>>>.el-table__fixed-body-wrapper {
    height: calc(100vh - 227px) !important;
  }
  .buttonTypechuli {
    background: #FFB800;
    border-color:#FFB800;
    color: #fff;
    font-size: 12px;
  }
  .bords{
    border-left: 3px solid #009494;
    padding-left: 10px;
    font-size: 14px;
    font-weight: bold;
  }
  .tits{
    border-bottom: 1px solid #e5e5e5;
    padding-bottom: 7px;
    margin-bottom: 15px;
    margin-top:15px;
  }
  .stepsuccess >>> .is-finish {
    color: #009494;
    border-color: #009494;
  }
  .stepsuccess >>> .el-step__title{
    font-weight: bold;
    font-size: 14px;
  }
  .stepsuccess >>> .el-step__description{
    font-size: 14px;
  }
  .stepready >>> .is-finish {
    color: #ED7D31;
    border-color: #ED7D31;
  }
  .stepready >>> .el-step__title{
    font-weight: bold;
    font-size: 14px;
  }
  .stepready >>> .el-step__description{
    font-size: 14px;
  }
  .stepnone >>> .is-process {
    color: #666;
    border-color: #666;
  }
  .stepnone >>> .el-step__title{
    font-weight: bold;
    font-size: 14px;
  }
  .stepnone >>> .el-step__description{
    font-size: 14px;
  }
  .stepnone >>> .is-wait {
    color: #666;
    border-color: #666;
  }
  .stepsuccess >>> .el-step__line-inner {
    border-width: 3px !important;
  }
  .stepsuccess >>> .el-step__line-inner:after{
    display: block;
    content: '';
    border-width: 8px 23px 8px 8px;
    border-style: solid;
    border-color: transparent #009494 transparent transparent;
    position: absolute;
    transform: rotate(178deg);
    left: 273px;
    top: -5px;
  }
  .stepsuccess >>> .el-step__line{
    padding-right: 27px;
    background-color:transparent;
  }
  .stepready >>> .el-step__line{
    background-color: #C0C4CC;
    height: 6px;
    margin-right: 27px !important;
  }
  .stepready >>> .el-step__line-inner:after{
    display: block;
    content: '';
    border-width: 8px 23px 8px 8px;
    border-style: solid;
    border-color: transparent #C0C4CC transparent transparent;
    position: absolute;
    transform: rotate(178deg);
    left: 273px;
    top: -5px;
  }
  .stepnone >>> .el-step__line {
    background-color: #C0C4CC;
    height: 6px;
    margin-right: 27px !important;
  }
  .stepnone >>> .el-step__line-inner:after{
    display: block;
    content: '';
    border-width: 8px 23px 8px 8px;
    border-style: solid;
    border-color: transparent #C0C4CC transparent transparent;
    position: absolute;
    transform: rotate(178deg);
    left: 273px;
    top: -5px;
  }
  .sssf>>> .el-dialog__body {
    padding-bottom: 20px;
  }
  .marginAuto{
   display: flex;
   justify-content: center;
  }
</style>
