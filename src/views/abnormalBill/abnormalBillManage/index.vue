<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 5px">
      <el-row>
        <el-col :span="22">
          <div class="input-item">
            <span class="input-title">异常等级</span>
            <el-select v-model="grade" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in gradeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">异常单号</span>
            <el-input v-model="billNo" class="search-input" placeholder="异常单号" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">申请时间</span>
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
            <span class="input-title" style="width: 35px">型号</span>
            <el-select v-model="model" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in productLists"
                :key="item.id"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 35px">批号</span>
            <el-input v-model="batchNo" class="search-input" style="width:180px" placeholder="请输入批号" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">异常类型</span>
            <el-select v-model="types" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">发起部门</span>
            <el-select v-model="applicationSector" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in treelist"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">责任部门</span>
            <el-select v-model="responsibleDept" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in treelist"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">审核状态</span>
            <el-select v-model="reviewStatus" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in reviewList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 90px;">产品处理进度</span>
            <el-select v-model="schedule" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in scheduleList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">异常工序</span>
            <el-select v-model="process" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in processList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 85px;">异常单状态</span>
            <el-select v-model="status" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in statusList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
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
        </el-col>
        <el-col :span="2">
          <el-button
            style="position: absolute;bottom: 0px;right: 0px;"
            size="small"
            type="primary"
            @click="addNew"
          ><svg-icon icon-class="add"/> 新增异常单</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="app-container">
      <el-row style="background: #fff;">
        <el-col :span="20">
          <div class="table-top-btn-group">
            <div
              :class="{'active':isActive === 0}"
              @click="tabClick(0)"
            >
              所有
            </div>
            <div
              :class="{'active':isActive === 1}"
              @click="tabClick(1)"
            >
              未结案
            </div>
            <div
              :class="{'active':isActive === 2}"
              @click="tabClick(2)"
            >
              已结案
            </div>
          </div>
        </el-col>
        <el-col :span="4" style="text-align:right">
          <el-button type="primary" class="bonst" size="small" @click="importDBF()"><svg-icon icon-class="export" style="color:#009494"/>  导出</el-button>
        </el-col>
      </el-row>
      <el-table
        v-loading="listLoading"
        :data="list"
        class="broad-scrollbar-table"
        element-loading-text="拼命加载中"
        height="calc(100vh - 367px)"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="异常单号" align="center" prop="billNo" min-width="150" fixed/>
        <el-table-column label="异常等级" align="center" prop="gradeVal"/>
        <el-table-column label="申请日期" align="center" prop="createTime" min-width="150"/>
        <el-table-column label="型号" align="center" prop="model" min-width="100"/>
        <el-table-column label="批号" align="center" prop="batchNo" min-width="180" show-overflow-tooltip/>
        <el-table-column label="异常工序" align="center" prop="process" min-width="150"/>
        <el-table-column label="异常类型" align="center" prop="typeVal" min-width="150" show-overflow-tooltip/>
        <el-table-column label="抽检数" align="center" prop="checksNum"/>
        <el-table-column label="不良数量" align="center" prop="badNum"/>
        <el-table-column label="不良率" align="center" prop="badRateVal"/>
        <el-table-column label="损耗统计" align="center" prop="lossCount" min-width="150" show-overflow-tooltip/>
        <el-table-column label="异常描述" align="center" prop="badContent" min-width="150" show-overflow-tooltip/>
        <el-table-column label="原因分析" align="center" prop="lossCount" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.resultDetails!==null&&scope.row.resultDetails.analyses!==null">
              <div v-for="(item, index) in scope.row.resultDetails.analyses" :key="index">
                {{ item.deptName }} : {{ (item.content===''||item.content===null)?'无':item.content }};
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="临时对策" align="center" prop="" min-width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.resultDetails!==null&&scope.row.resultDetails.temporaryStrategy!==null">{{ scope.row.resultDetails.temporaryStrategy.content }}</div>
          </template>
        </el-table-column>
        <el-table-column label="永久对策" align="center" prop="lossCount" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.resultDetails!==null&&scope.row.resultDetails.perpetualStrategy!==null">
              <div v-for="(item, index) in scope.row.resultDetails.perpetualStrategy" :key="index">
                {{ item.deptName }} : {{ (item.content===''||item.content===null)?'无':item.content }};
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="产品处理进度" align="center" prop="scheduleVal" min-width="150" show-overflow-tooltip/>
        <el-table-column label="异常单状态" align="center" prop="statusVal" min-width="150"/>
        <el-table-column align="center" label="异常单跟踪" min-width="150">
          <template slot-scope="scope">
            <div style="cursor: pointer;text-decoration: underline; color: #009494" @click="viewDetailCard(scope.row)">查看</div>
          </template>
        </el-table-column>
        <el-table-column label="发起部门" align="center" prop="applicationSector" show-overflow-tooltip/>
        <el-table-column label="责任部门" align="center" prop="responsibleDept" min-width="150" show-overflow-tooltip/>
        <el-table-column label="审核状态" align="center" prop="dealStatus" min-width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.dealStatus!==null&&scope.row.dealStatus.indexOf('不通过')>-1" style="color: #f33;font-weight: bold">{{ scope.row.dealStatus }}</span>
            <span v-if="scope.row.dealStatus!==null&&scope.row.dealStatus.indexOf('不通过')< 0" style="color: #009494;font-weight: bold">{{ scope.row.dealStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="status" width="170" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-if="(scope.row.qcReview === 2 && scope.row.status < 5) ||(scope.row.status === 2 && scope.row.qcReview !== 2 && scope.row.applicationSector === scope.row.responsibleDept)|| scope.row.status === 6 ||(scope.row.status === 3 && scope.row.ifOperating === 0)|| (scope.row.status === 3 && scope.row.showType3 === 2)"
              size="mini"
              type="primary"
              style="background-color:#1ABC9C;border-color:#1ABC9C"
              @click="findInfo(scope.row)"
            ><svg-icon icon-class="search"/> 查看</el-button>
            <el-button
              v-if="(scope.row.status === 5&& scope.row.resultDetails.exceptionFinish!==null&&scope.row.resultDetails.exceptionFinish.review === 2) ||scope.row.status === 0||(scope.row.status === 4 && scope.row.showType !== 2) || (scope.row.status === 5 && scope.row.showType1 !== 2)|| (scope.row.status >3 && scope.row.showType2 !== -1&& scope.row.showType2 !== 2&& scope.row.status !== 6)||(scope.row.status === 5 && scope.row.showType1 !==2)||(scope.row.status === 5 && scope.row.showType1 ===2&& scope.row.showType ===2&& scope.row.showType2 ===2 && (scope.row.resultDetails.exceptionFinish === null || scope.row.resultDetails.exceptionFinish.creator === null))"
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="setEdit(scope.row)"
            > 编辑</el-button>
            <el-button
              v-if="isShowMenu['abnormalBill-auditor']&&(scope.row.status === 1||(scope.row.status === 2 && scope.row.qcReview !== 2) || (scope.row.status === 3 && scope.row.showType3 === 1 && scope.row.qcReview !== 2) || (scope.row.status === 4 && scope.row.showType >0)|| (scope.row.status === 5 && scope.row.showType1 === 1 && scope.row.qcReview !== 2)|| (scope.row.status >3 && scope.row.showType2 === 1 && scope.row.status !== 6 && scope.row.qcReview !== 2)|| (scope.row.resultDetails.exceptionFinish!==null&&scope.row.resultDetails.exceptionFinish.auditor===null&&scope.row.status >3 && scope.row.status !== 6 && scope.row.resultDetails.exceptionFinish.review !== 2))"
              size="mini"
              type="primary"
              class="buttonTypechuli"
              @click="checkError(scope.row)"
            ><svg-icon icon-class="rukedansh"/> 审核</el-button>
            <el-button
              v-if="scope.row.status === 1"
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
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="showDialog"
      top="60px"
      class="padding-dialog"
      title="异常单跟踪"
      width="600px">
      <div class="stylsss">
        <el-steps :active="logList.length" direction="vertical">
          <el-step v-for="(item, index) in logList" :key="index" :description="item.dayVal + ' ' + item.timeVal" :title="item.content" icon="el-icon-circle-check-outline" class="stepsuccess"/>
        </el-steps>
      </div>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .stylsss{
    text-align: center;
    max-height: 500px;
    padding-left: 147px;
    overflow: auto;
    display: flex;
    justify-content: center;
  }
  .stepsuccess >>> .is-finish {
    color: #009494;
    border-color: #009494;
  }
  .stepsuccess >>> .el-step__title{
    font-weight: bold;
    font-size: 14px;
    color: #666;
  }
  .stepsuccess >>> .el-step__description{
    font-size: 14px;
    position: absolute;
    top: 7px;
    left: -184px;
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
    margin-top: 14px;
    margin-right: 10px;
  }
  .search-input{
    width: 126px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 255px);
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
    margin-left: 25px;
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
  .module-title-text{
    margin-bottom: 10px;
    margin-top: 15px;
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
    float: left;
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
  .table-top-btn-group>div.active{
    color: #fff;
    background: #009494;
    border-color: #009494;
  }
  .app-container>>> .el-table--border {
    border-top: 2px solid #009494;
  }
  .bonst{
    background: #fff;
    border: 0px;
    height: 20px;
    color: #494949;
    font-size: 14px;
    font-weight: bold;
  }
  .bonst >>> i{
    color:#009494;
  }
  .broad-scrollbar-table>>>.el-table__fixed-right {
    height: calc(100vh - 382px) !important;
  }
  .broad-scrollbar-table>>>.el-table__fixed-body-wrapper {
    height: calc(100vh - 421px) !important;
  }
  .buttonTypechuli {
    background: #FFB800;
    border-color:#FFB800;
    color: #fff;
    font-size: 12px;
  }
  .stylsss >>> .el-step__head{
    height: 70px;
  }
</style>
