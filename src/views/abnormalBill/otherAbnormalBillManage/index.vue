<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 5px">
      <el-row>
        <el-col :span="24">
          <div class="input-item">
            <span class="input-title">异常等级</span>
            <el-select v-model="grade" class="search-input" style="width: 80px" size="small" placeholder="请选择" filterable clearable>
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
            <span class="input-title" style="width: 40px">型号</span>
            <el-select v-model="model" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in productLists"
                :key="item.id"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 40px">批号</span>
            <el-input v-model="batchNo" class="search-input" style="width:190px" placeholder="请输入批号" size="small" maxlength="20" clearable/>
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
            <el-select v-model="applicationSector" :disabled="isActive === 0" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in treelist"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">责任部门</span>
            <el-select v-model="responsibleDept" :disabled="isActive === 1" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in treelist"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">审核状态</span>
            <el-select v-model="reviewStatus" class="search-input" style="width: 100px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in reviewList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 90px;">产品处理进度</span>
            <el-select v-model="schedule" class="search-input" style="width: 190px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in scheduleList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">异常工序</span>
            <el-select v-model="process" class="search-input" style="width: 170px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in processList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 85px;">异常单状态</span>
            <el-select v-model="status" class="search-input" size="small" style="width: 140px" placeholder="请选择" filterable clearable>
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
          <el-button
            style="position: absolute;bottom: 0px;right: 0px; float: right"
            size="small"
            type="primary"
            @click="addNew"
          ><svg-icon icon-class="add"/> 新增异常单</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="app-container">
      <div class="table-top-btn-group">
        <div
          :class="{'active':isActive === 0}"
          @click="tabClick(0)"
        >
          由我创建
        </div>
        <div
          :class="{'active':isActive === 1}"
          @click="tabClick(1)"
        >
          指派给我
        </div>
        <el-button class="float-right" type="primary" size="mini" @click="importDBF()"><svg-icon icon-class="export"/>  导出</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        v-if="isActive === 0"
        :data="list"
        class="broad-scrollbar-table"
        element-loading-text="拼命加载中"
        height="calc(100vh - 371px)"
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
        <el-table-column label="异常工序" align="center" prop="process" min-width="150" show-overflow-tooltip/>
        <el-table-column label="异常类型" align="center" prop="typeVal" min-width="150" show-overflow-tooltip/>
        <el-table-column label="抽检数" align="center" prop="checksNum"/>
        <el-table-column label="不良数量" align="center" prop="badNum"/>
        <el-table-column label="不良率" align="center" prop="badRateVal"/>
        <el-table-column label="损耗统计" align="center" prop="lossCount" min-width="150" show-overflow-tooltip/>
        <el-table-column label="产品处理进度" align="center" prop="scheduleVal" min-width="120"/>
        <el-table-column label="异常单状态" align="center" prop="statusVal" min-width="150"/>
        <el-table-column label="责任部门" align="center" prop="responsibleDept" min-width="150" show-overflow-tooltip/>
        <el-table-column label="发起部门处理状态" align="center" min-width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.dealStatus!==null&&scope.row.dealStatus.indexOf('不通过')>-1" style="color: #f33;font-weight: bold">{{ scope.row.dealStatus }}</span>
            <span v-if="scope.row.dealStatus!==null&&scope.row.dealStatus.indexOf('不通过')< 0" style="color: #009494;font-weight: bold">{{ scope.row.dealStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="status" width="170" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-if="(scope.row.status >1&&isActive===0)||(scope.row.status === 3&&isActive===1&&scope.row.showType3 === 2)||(scope.row.status > 3&&isActive===1&&scope.row.showType2 === 2)||(isActive===1&& scope.row.resultDetails.exceptionFinish!==null)"
              size="mini"
              type="primary"
              style="background-color:#1ABC9C;border-color:#1ABC9C"
              @click="findInfo(scope.row)"
            ><svg-icon icon-class="search"/> 查看</el-button>
            <el-button
              v-if="(scope.row.status === 0&&isActive===0)||(scope.row.status === 3&&isActive===1&&scope.row.showType3 === 0 && scope.row.resultDetails.exceptionFinish===null)||(scope.row.status > 3&&scope.row.showType2 !== 2&&isActive===1 && scope.row.resultDetails.exceptionFinish===null)"
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="setNew(scope.row)"
            > 编辑</el-button>
            <el-button
              v-if="isShowMenu['abnormalBill-auditor']&&((scope.row.status === 1&&isActive===0)||(scope.row.status === 3&&isActive===1&&scope.row.showType3 === 1 && scope.row.resultDetails.exceptionFinish===null)||(scope.row.status > 3&&isActive===1&&scope.row.showType2 === 1 && scope.row.resultDetails.exceptionFinish===null))"
              size="mini"
              type="primary"
              class="buttonTypechuli"
              @click="checkNew(scope.row)"
            ><svg-icon icon-class="rukedansh"/> 审核</el-button>
            <el-button
              v-if="scope.row.status === 1&&isActive===0"
              size="mini"
              icon="el-icon-delete"
              type="danger"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-loading="listLoading"
        v-if="isActive === 1"
        :data="list"
        class="broad-scrollbar-table"
        element-loading-text="拼命加载中"
        height="calc(100vh - 371px)"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="异常单号" align="center" prop="billNo" min-width="150"/>
        <el-table-column label="异常等级" align="center" prop="gradeVal"/>
        <el-table-column label="申请日期" align="center" prop="createTime" min-width="150"/>
        <el-table-column label="型号" align="center" prop="model" min-width="100"/>
        <el-table-column label="批号" align="center" prop="batchNo" min-width="180"/>
        <el-table-column label="异常工序" align="center" prop="process" min-width="150" show-overflow-tooltip/>
        <el-table-column label="异常类型" align="center" prop="typeVal" min-width="150" show-overflow-tooltip/>
        <el-table-column label="抽检数" align="center" prop="checksNum"/>
        <el-table-column label="不良数量" align="center" prop="badNum"/>
        <el-table-column label="不良率" align="center" prop="badRateVal"/>
        <el-table-column label="损耗统计" align="center" prop="lossCount" min-width="150" show-overflow-tooltip/>
        <el-table-column label="产品处理进度" align="center" prop="scheduleVal" min-width="120"/>
        <el-table-column label="异常单状态" align="center" prop="statusVal" min-width="150"/>
        <el-table-column label="发起部门" align="center" prop="applicationSector" min-width="100" show-overflow-tooltip/>
        <el-table-column label="责任部门处理状态" align="center" prop="" min-width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.dealStatus!==null&&scope.row.dealStatus.indexOf('不通过')>-1" style="color: #f33;font-weight: bold">{{ scope.row.dealStatus }}</span>
            <span v-if="scope.row.dealStatus!==null&&scope.row.dealStatus.indexOf('不通过')< 0" style="color: #009494;font-weight: bold">{{ scope.row.dealStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="status" width="170" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-if="(scope.row.status ===2&&scope.row.qcReview===0)||(scope.row.status >1&&isActive===0)||(scope.row.status === 3&&isActive===1&&scope.row.showType3 === 2)||(scope.row.status > 3&&isActive===1&&scope.row.showType2 === 2)||scope.row.status === 6||scope.row.resultDetails.exceptionFinish!==null"
              size="mini"
              type="primary"
              style="background-color:#1ABC9C;border-color:#1ABC9C"
              @click="findInfo(scope.row)"
            ><svg-icon icon-class="search"/> 查看</el-button>
            <el-button
              v-if="(scope.row.status === 0&&isActive===0)"
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="setNew(scope.row)"
            > 编辑</el-button>
            <el-button
              v-if="(scope.row.status ===2&&isActive===1&&scope.row.showType3 === 0)||(scope.row.status === 3&&isActive===1&&scope.row.showType3 === 0 && scope.row.resultDetails.exceptionFinish===null)||(scope.row.status > 3&&scope.row.showType2 === 0&&isActive===1&&scope.row.resultDetails.exceptionFinish===null&&scope.row.status !== 6 && scope.row.resultDetails.exceptionFinish===null)"
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="setNew(scope.row)"
            > 处理</el-button>
            <el-button
              v-if="(scope.row.status === 1&&isActive===0)||(scope.row.status > 3&&isActive===1&&scope.row.showType2 === 1&&scope.row.status !== 6 && scope.row.resultDetails.exceptionFinish===null)"
              v-show="isShowMenu['abnormalBill-auditor']"
              size="mini"
              type="primary"
              class="buttonTypechuli"
              @click="checkNew(scope.row)"
            ><svg-icon icon-class="rukedansh"/> 审核</el-button>
            <el-button
              v-if="(scope.row.status === 2&&isActive===1&&scope.row.showType3 === 1 && scope.row.resultDetails.exceptionFinish===null)||(scope.row.status === 3&&isActive===1&&scope.row.showType3 === 1 && scope.row.resultDetails.exceptionFinish===null)"
              v-show="isShowMenu['abnormalBill-auditor']"
              size="mini"
              type="primary"
              class="buttonTypechuli"
              @click="checkNew(scope.row)"
            ><svg-icon icon-class="rukedansh"/> 审核</el-button>
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
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .stylsss{
    text-align: center;
    height: 700px;
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
  }
  .stepsuccess >>> .el-step__description{
    font-size: 14px;
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
    height: calc(100vh - 257px);
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
  .table-top-btn-group{
    overflow: hidden;
  }
  .table-top-btn-group>div{
    float: left;
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
    /*height: 20px;*/
    /*color: #494949;*/
    font-size: 14px;
    font-weight: bold;
  }
  .bonst >>> i{
    color:#009494;
  }
  .broad-scrollbar-table>>>.el-table__fixed-right {
    height: calc(100vh - 385px) !important;
  }
  .broad-scrollbar-table>>>.el-table__fixed-body-wrapper {
    height: calc(100vh - 469px) !important;
  }
  .buttonTypechuli {
    background: #FFB800;
    border-color:#FFB800;
    color: #fff;
    font-size: 12px;
  }
</style>

