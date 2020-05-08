<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0">
      <div class="header-btn-group" style="padding-top: 10px;">
        <el-button
          size="small"
          type="primary"
          @click="openCheck"
        ><svg-icon icon-class="xuanzexx"/> 批量处理</el-button>
        <el-button
          size="small"
          type="primary"
          @click="mulSearchClick" ><svg-icon icon-class="pilcx" style="margin-right: 5px" />批量查询</el-button>
      </div>
      <div class="search-box">
        <div class="left-search-box">
          <div class="input-item">
            <span class="input-title" style="width: 40px">片号 </span>
            <el-input v-model="waferNo" class="search-input" style="width: 220px" placeholder="请输入片号" size="small" maxlength="100" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 40px">尺寸 </span>
            <el-select v-model="measure" class="search-input" style="width: 80px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in measureList"
                :key="item.id"
                :label="item.name"
                :value="item.name"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">检出工序 </span>
            <el-select v-model="processId" class="search-input" style="width: 180px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in processListspage"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 55px">提交人 </span>
            <el-select v-model="creator" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in userLists"
                :key="item.creator"
                :label="item.creatorName"
                :value="item.creator"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">提交时间 </span>
            <el-date-picker
              v-model="beginDate1"
              :picker-options="pickerOptionsStart1"
              :editable="false"
              style="width: 130px"
              class="search-input"
              size="small"
              type="date"
              placeholder="选择开始日期"
              value-format="timestamp"
            />
            <span style="display:inline-block;width: 38px;text-align: center"> 至 </span>
            <el-date-picker
              v-model="endDate1"
              :picker-options="pickerOptionsEnd1"
              :editable="false"
              class="search-input"
              style="width: 130px"
              size="small"
              type="date"
              placeholder="选择结束日期"
              value-format="timestamp"
            />
          </div>
          <div class="input-item">
            <span class="input-title">产品型号 </span>
            <el-select v-model="model" class="search-input" style="width: 100px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in productLists"
                :key="item"
                :label="item"
                :value="item"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">工艺分类 </span>
            <el-select v-model="craftId" class="search-input" style="width: 110px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in gyList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">异常描述 </span>
            <el-input v-model="reason" class="search-input" placeholder="请输入异常描述" size="small" maxlength="20" clearable/>
          </div>
          <!-- <div class="input-item">
            <span class="input-title">异常单号 </span>
            <el-input v-model="billNo" class="search-input" placeholder="请输入异常单号" size="small" maxlength="20" clearable/>
          </div> -->
          <div class="input-item">
            <span class="input-title" style="width: 55px">处理人 </span>
            <el-select v-model="auditor" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in auuserLists"
                :key="item.auditor"
                :label="item.auditorName"
                :value="item.auditor"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">处理时间 </span>
            <el-date-picker
              v-model="beginDate"
              :picker-options="pickerOptionsStart"
              :editable="false"
              style="width: 130px"
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
              style="width: 130px"
              class="search-input"
              size="small"
              type="date"
              placeholder="选择结束日期"
              value-format="timestamp"
            />
          </div>
          <div style="float: left;padding-top: 5px;">
            <el-button
              class="margin-top margin-left"
              size="small"
              type="primary"
              icon="el-icon-search"
              @click="handleSearch" >查 询</el-button>
            <el-button
              class="margin-top"
              size="small"
              type="danger"
              @click="clearAll"
            >
              <svg-icon icon-class="clear"/> 重 置
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        ref="tables"
        :data="list"
        element-loading-text="拼命加载中"
        height="calc(100vh - 382px)"
        class="broad-scrollbar-table"
        border
        fit
        stripe
        @selection-change="handleSelectionChange">
        <el-table-column :selectable="checkList" type="selection" width="55" fixed/>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="异常单号" align="center" prop="billNo" width="150px"/> -->
        <el-table-column label="片号" align="center" prop="waferNo" width="200px"/>
        <el-table-column label="产品型号" align="center" prop="model" width="100px"/>
        <el-table-column label="测试类型" align="center" prop="pattern" width="100px">
          <template slot-scope="scope">
            <span v-if="scope.row.pattern === 0">圆抽</span>
            <span v-if="scope.row.pattern === 1">全测</span>
            <span v-if="scope.row.pattern === 2">回测</span>
          </template>
        </el-table-column>
        <el-table-column label="尺寸" align="center" prop="measure" width="60px"/>
        <el-table-column label="工艺分类" align="center" prop="craft"/>
        <el-table-column label="检出工序" align="center" prop="checkName" width="110px"/>
        <el-table-column label="异常描述" align="center" prop="reason" width="330px" show-overflow-tooltip/>
        <el-table-column label="提交时间" align="center" prop="createTime" width="150px"/>
        <el-table-column label="提交人" align="center" prop="creatorName" width="80px"/>
        <el-table-column label="处理时间" align="center" prop="auditTime" width="150px"/>
        <el-table-column label="处理人" align="center" prop="auditorName" width="80px" show-overflow-tooltip/>
        <el-table-column label="处理结果" align="center" prop="result" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.result === 0">正常</span>
            <span v-if="scope.row.result === 1">返工</span>
            <span v-if="scope.row.result === 2">报废</span>
            <span v-if="scope.row.result === 3">异常单</span>
          </template>
        </el-table-column>
        <el-table-column label="责任人" align="center" prop="zr" width="150px"/>
        <el-table-column label="任务状态" align="center" width="80px">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">待处理</span>
            <span v-if="scope.row.status === 1">已完成</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="status" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status !== 1"
              size="mini"
              type="primary"
              class="buttonTypechuli"
              @click="handelRow(scope.row)"
            ><svg-icon icon-class="chulixx"/> 处理</el-button>
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
      :visible.sync="checkDialogVisible"
      class="print-dialog"
      title="处理"
      width="600px"
      append-to-body
    >
      <el-row style="margin-top: -10px;padding-bottom:20px">
        <el-col :span="24">
          <div class="tab-control" style="margin-top: -10px;">
            <span
              :class="{activeTab: radio === 0}"
              @click="navClick(0)"
            >正常</span>
            <span
              :class="{activeTab: radio === 1}"
              class="has-margin-left"
              @click="navClick(1)"
            >返工</span>
            <span
              :class="{activeTab: radio === 2}"
              class="has-margin-left"
              @click="navClick(2)"
            >报废</span>
            <span
              :class="{activeTab: radio === 3}"
              class="has-margin-left"
              @click="navClick(3)"
            >异常单</span>
          </div>
        </el-col>
        <el-col :span="24" style="padding-top: 15px;">
          <div v-show="radio === 0">
            <div style="text-align: center;margin-top: 15px;">
              <el-button type="primary" size="small" @click="determine(0)">确定</el-button>
            </div>
          </div>
          <div v-show="radio === 1">
            <el-form ref="backForm" :model="backForm" :rules="rules" status-icon label-width="95px" label-position="right">
              <el-form-item label="返工工序 " prop="flowCardId">
                <el-select v-model="backForm.flowCardId" style="width: 323px;" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in flowBackLists"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item label="责任人 ">
                <el-select v-model="backForm.creator" multiple style="width: 323px;" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in cuserLists"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item label="异常原因 ">
                <el-input v-model="backForm.reason" type="textarea" placeholder="请输入异常原因" maxlength="50"/>
              </el-form-item>
              <el-form-item label="预防措施 ">
                <el-input v-model="backForm.prevent" type="textarea" placeholder="请输入预防措施" maxlength="50"/>
              </el-form-item>
            </el-form>
            <div style="text-align: center;">
              <el-button type="primary" size="small" @click="determine(1)">确定</el-button>
            </div>
          </div>
          <div v-show="radio === 2">
            <el-form ref="backForms" :model="backForms" :rules="rules" status-icon label-width="95px" label-position="right">
              <el-form-item label="责任人 ">
                <el-select v-model="backForms.creator" multiple style="width: 323px;" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in cuserLists"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item label="责任部门 " prop="dept">
                <el-select v-model="backForms.dept" multiple style="width: 323px;" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in deptList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item label="报废原因 " prop="reason">
                <el-input v-model="backForms.reason" type="textarea" placeholder="请输入报废原因" maxlength="50"/>
              </el-form-item>
              <el-form-item label="预防措施 " prop="prevent">
                <el-input v-model="backForms.prevent" type="textarea" placeholder="请输入预防措施" maxlength="50"/>
              </el-form-item>
              <!-- <el-form-item label="折算数 " prop="conversionNum">
                <el-input v-model="backForms.conversionNum" type="text" placeholder="请输入折算数" maxlength="5"/>
              </el-form-item> -->
            </el-form>
            <div style="text-align: center;">
              <el-button type="primary" size="small" @click="determine(2)">立即报废</el-button>
              <el-button type="primary" size="small" @click="determine(4)">待报废</el-button>
            </div>
          </div>
          <div v-show="radio === 3">
            <div style="text-align: center;">
              <el-button type="primary" size="small" @click="opennew()">开异常单</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      title="批量查询"
      width="500px"
      @close="resetForm('mulForm')">
      <el-form ref="mulForm" :model="mulForm" :rules="mulrules" status-icon label-width="80px" label-position="right">
        <el-form-item label="片号" prop="mulWaferID">
          <el-input v-model="mulForm.mulWaferID" :rows="10" type="textarea" placeholder="请输入多个片号,以换行分割" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('mulForm')">确 定</el-button>
        <el-button @click="resetForm('mulForm')">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  @media print {
    .print{
        display:block !important;
    }
  }
  .parameter-table>>>.el-table .set_red td{
    background-color: #FFFFCF !important;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 305px);
  }
  .buttonTypechuli {
    background: #FFB800;
    color: #fff;
    font-size: 12px;
    border-color: #FFB800;
  }
  .tip-out-inner-dialog>>>.el-checkbox{
    margin-left: 20px;
  }
  .fieldest{
    border: 1px solid #DCDFE6;
    padding-bottom: 15px;
  }
  .legendsty{
    padding-left:8px;
    padding-right:8px;
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
  .input-item{
    float: left;
    margin-top: 15px;
    margin-right: 10px;
  }
  .search-input{
    width: 160px;
  }
  .run-table ::-webkit-scrollbar {/*滚动条整体样式*/
    height: 10px !important;
  }
  .primarya{
    color:#009494;
    text-decoration:underline;
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
  .select-type-box{
    margin-left: 85px;
    width: 888px;
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
  .has-margin-top{
    margin-top: 15px;
  }
  .has-bancground{
    background: rgba(181, 184, 218, 0.84);
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
  .inner-dialog>>> .el-dialog__body {
    padding-bottom: 15px;
  }
  .tab-control span{
    width: 50px;
    line-height: 30px;
    padding-bottom: 5px;
    font-size: 14px;
  }
  .tab-control{
    margin-bottom: 5px;
  }
  .tab-control span+span{
    width: 50px;
  }
  .broad-scrollbar-table >>> .el-checkbox {
    margin-left: 19px;
  }
  .broad-scrollbar-table >>> .el-table__fixed-body-wrapper {
    height: calc(100% - 42px)!important;
  }
</style>
