<template>
  <PageHeaderLayout :has_back="true">
    <el-row>
      <el-col :span="8" class="leftrigh">
        <el-row>
          <el-col :span="5" class="leftcon">
            机台
          </el-col>
          <el-col :span="19" class="rightcont">
            <el-select v-model="machineValue" style="width: 305px;" size="small" placeholder="请选择" multiple= "filterable" clearable>
              <el-option
                v-for="item in machineOptions"
                :key="item.id"
                :label="item.code"
                :value="item.id"/>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5" class="leftcon">
            表面报废类型
          </el-col>
          <el-col :span="19" class="rightcont">
            <el-select v-model="reason" style="width: 305px;" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in reasonLists"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5" class="leftcon">
            报废类型
          </el-col>
          <el-col :span="19" class="rightcont">
            <el-select v-model="bfInfo" style="width: 305px;" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in bfList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5" class="leftcon">
            发生日期
          </el-col>
          <el-col :span="19" class="rightcont">
            <el-date-picker
              v-model="beginDate"
              :picker-options="pickerOptionsStart"
              :editable="false"
              style="width: 130px;"
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
              style="width: 130px;"
              class="search-input"
              size="small"
              type="date"
              placeholder="选择结束日期"
              value-format="timestamp"
            />
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="5" class="rightcont">
            <el-button
              style="margin-top: 0px"
              class="margin-top"
              size="small"
              type="primary"
              icon="el-icon-search"
              @click="findReports" >查 询</el-button>
            <el-button
              style="margin-top: 0px;margin-right: 15px;"
              class="margin-top margin-left"
              size="small"
              type="danger"
              @click="clearAll()"
            >
              <svg-icon icon-class="clear"/> 重 置
            </el-button>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8" style="background: #fff;border-left: 5px solid #e5e5e5;padding-bottom: 10px;height: 281px">
        <div class="totsl">
          总不良片数 <span style="margin-left: 30px;color:#e6a23c">{{ totals }}</span>
        </div>
        <div style="height: 208px;overflow:auto">
          <el-row class="margintops">
            <span v-for="(item, index) in reportList" :key="item.id">
              <el-col :span="5" class="iconf">
                <svg-icon :icon-class="listicon[index]"/>
              </el-col>
              <el-col :span="7" class="foncls">
                <div class="getfons">{{ item.name }}</div>
                <div class="fonsfont">{{ item.num }}</div>
              </el-col>
            </span>
          </el-row>
        </div>
      </el-col>
      <el-col :span="8" style="background: #fff;border-left: 10px solid #e5e5e5;padding-bottom: 10px;">
        <div class="module-content" style="height: 270px;">
          <div v-if="!isChart" class="no-data">
            <svg-icon class="no-data-icon" icon-class="noData"/>
            <div>暂无数据</div>
          </div>
          <chart v-if="isChart" id="acplxtj2" :options="options1" height="270px" width="100%"/>
        </div>
      </el-col>
    </el-row>
    <div class="module-container" style="margin-top: 10px;padding-top:10px">
      <div class="module-content flex coloum" style="height: auto;margin-top: -15px;">
        <div class="table-top-btn-group">
          <div
            v-for="(item, index) in substrateFindOptions"
            :key="item.id"
            :class="{'active':isActive === index}"
            @click="navClick(index)"
          >
            {{ item.name }}
          </div>
        </div>
        <div style="text-align: right;margin-top: -34px;margin-right: 15px;">
          <el-button type="text" class="select-thead-btn" style="right:30px" @click="addItem()"><svg-icon icon-class="add"/> 新增</el-button>
          <el-button type="text" class="select-thead-btn" style="right:30px" icon="el-icon-sold-out" @click="importDBF()">导出</el-button>
        </div>
        <!-- 是表格 -->
        <div class="chart-table" style="margin-top: -10px">
          <el-table
            v-loading="listLoading"
            :data="tableList"
            height="calc(100vh - 465px)"
            class="broad-scrollbar-table"
            element-loading-text="拼命加载中"
            highlight-current-row
            border
            fit>
            <el-table-column label="发生日期" fixed="left" align="center" prop="happenTime" width="130"/>
            <el-table-column label="机台" align="center" prop="machineName"/>
            <el-table-column label="不良描述" align="center" prop="badDescribe"/>
            <el-table-column label="表面报废类型" align="center" prop="visualReason"/>
            <el-table-column label="原因分析" align="center" prop="causeAnalysis"/>
            <el-table-column label="改善对策" align="center" prop="improve"/>
            <el-table-column label="报废类型" align="center" prop="scrapType"/>
            <el-table-column label="报废数量" align="center" prop="num"/>
            <el-table-column label="分析人" align="center" prop="creatorName"/>
            <el-table-column label="备注" align="center" prop="remark"/>
            <el-table-column label="操作" align="center" prop="status" width="180px">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  icon="el-icon-edit"
                  type="primary"
                  @click="updateItem(scope.row)">编辑</el-button>
                <el-button
                  size="mini"
                  icon="el-icon-edit"
                  type="danger"
                  @click="deleteItem(scope.row)">删除</el-button>
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
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible"
      top="60px"
      class="padding-dialog"
      title="新增"
      width="750px"
      @close="handleClose('machineForm')">
      <el-form ref="machineForm" :model="machineForm" :rules="rules" status-icon label-width="120px" label-position="right">
        <el-row>
          <el-col :span="12">
            <el-form-item label="发生日期 " prop="happendDate">
              <el-date-picker
                v-model="machineForm.happendDate"
                :editable="false"
                style="width: 237px"
                size="small"
                type="date"
                placeholder="选择日期"
                value-format="timestamp"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机台 " prop="machine">
              <el-select v-model="machineForm.machine" style="width: 237px" size="small" placeholder="请选择" filterable>
                <el-option
                  v-for="item in machineOptions"
                  :key="item.id"
                  :label="item.code"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="表面报废类型 " prop="reason">
              <el-select v-model="machineForm.reason" style="width: 237px" size="small" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in reasonLists"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报废类型 " prop="reasontype">
              <el-select v-model="machineForm.reasontype" style="width: 237px" size="small" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in bfList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="不良描述 " prop="dispti">
              <el-input v-model="machineForm.dispti" :rows="5" size="medium" placeholder="请输入不良描述" type="textarea" maxlength="50" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="原因分析 " prop="ressonany">
              <el-input v-model="machineForm.ressonany" :rows="5" placeholder="请输入原因分析" type="textarea" maxlength="50" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="改善对策 " prop="anycont">
              <el-input v-model="machineForm.anycont" :rows="5" placeholder="请输入改善对策" type="textarea" maxlength="50" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注 " prop="remark">
              <el-input v-model="machineForm.remark" :rows="5" placeholder="请输入备注" type="textarea" maxlength="50" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报废数量 " prop="num">
              <el-input v-model="machineForm.num" placeholder="请输入报废数量" type="number" maxlength="5" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分析人 " prop="creator">
              <el-select v-model="machineForm.creator" style="width: 237px" size="small" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in userLists"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:right;width:100%">
        <el-button type="primary" @click="save('machineForm')">确 定</el-button>
        <el-button type="primary" @click="addDialogVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      top="60px"
      class="padding-dialog"
      title="修改"
      width="750px"
      @close="handleClose('machineForm')">
      <el-form ref="machineForm" :model="machineForm" :rules="rules" status-icon label-width="120px" label-position="right">
        <el-row>
          <el-col :span="12">
            <el-form-item label="发生日期 " prop="happendDate">
              <el-date-picker
                v-model="machineForm.happendDate"
                :editable="false"
                size="small"
                style="width: 237px"
                type="date"
                placeholder="选择日期"
                value-format="timestamp"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机台 " prop="machine">
              <el-select v-model="machineForm.machine" style="width: 237px" size="small" placeholder="请选择" filterable>
                <el-option
                  v-for="item in machineOptions"
                  :key="item.id"
                  :label="item.code"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="表面报废类型 " prop="reason">
              <el-select v-model="machineForm.reason" style="width: 237px" size="small" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in reasonLists"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报废类型 " prop="reasontype">
              <el-select v-model="machineForm.reasontype" style="width: 237px" size="small" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in bfList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="不良描述 " prop="dispti">
              <el-input v-model="machineForm.dispti" :rows="5" placeholder="请输入不良描述" type="textarea" maxlength="50" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="原因分析 " prop="ressonany">
              <el-input v-model="machineForm.ressonany" :rows="5" placeholder="请输入原因分析" type="textarea" maxlength="50" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="改善对策 " prop="anycont">
              <el-input v-model="machineForm.anycont" :rows="5" placeholder="请输入改善对策" type="textarea" maxlength="50" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注 " prop="remark">
              <el-input v-model="machineForm.remark" :rows="5" placeholder="请输入备注" type="textarea" maxlength="50" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报废数量 " prop="num">
              <el-input v-model="machineForm.num" placeholder="请输入报废数量" type="number" maxlength="5" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分析人 " prop="creator">
              <el-select v-model="machineForm.creator" style="width: 237px" size="small" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in userLists"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:right;width:100%">
        <el-button type="primary" @click="update('machineForm')">确 定</el-button>
        <el-button type="primary" @click="editDialogVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./indexs.js"></script>

<style scoped>
  .iconf {
    font-size: 32px;
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    padding-top: 16px;
    padding-left: 40px;
  }
  .margintops {
    margin: 24px;
  }
  .getfons {
    font-size: 16px;
    font-weight: bold;
    color: #666;
  }
  .foncls {
    font-size: 14px;
    padding-left: 15px;
    line-height: 35px;
  }
  .fonsfont {
    color:#e6a23c;
    font-weight: bold;
    font-size: 22px;
  }
  .totsl {
    font-size: 20px;
    font-weight: bold;
    padding-left: 15px;
    padding-top: 20px;
    border-bottom: 1px solid #e5e5e5;
    padding-bottom: 14px;
    text-align: center;
    color: #666;
    margin-bottom: 15px;
  }
  .leftrigh {
    background: rgb(255, 255, 255);
    border-right: 5px solid rgb(229, 229, 229);
    padding-bottom: 10px;
    padding-top: 10px;
  }
  .leftcon {
    right:20px;
    text-align: right;
    padding-top: 18px;
  }
  .rightcont {
    padding: 10px;
  }
  .module-titles {
    padding-left: 15px;
  }
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
    line-height: 50px;
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
    height: 495px;
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
    line-height: 30px;
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
    height: 30px;
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
    height: calc(100vh - 504px) !important;
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
  .select-thead-btn{
    /* width: 45px; */
    height: 42px;
    z-index: 200;
    /* background: rgba(0,0,0,.2); */
    right: 110px;
    top: 0px;
    border: 0px;
  }
  .select-thead-btn:hover{
    color: #009688;
    background: transparent;
    border: 0px;
  }
  .select-thead-btn:focus{
    color: #009688;
    background: transparent;
    border: 0px;
  }
</style>
