<template>
  <PageHeaderLayout>
    <div class="header-search-add height-auto">
      <el-row>
        <el-col :span="24" style="margin-top: -15px;">
          <div class="input-item">
            <span class="input-title">报废单号</span>
            <el-input v-model="billNo" class="search-input" style="width:132px" placeholder="请输入报废单号" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">责任部门</span>
            <el-select v-model="deptId" class="search-input" style="width:100px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in treelist"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">任务状态</span>
            <el-select v-model="typeId" class="search-input" style="width:90px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 50px;">审核人</span>
            <el-select v-model="userId" class="search-input" size="small" style="width:100px" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <el-radio-group v-model="timeType">
              <el-radio :label="0">申请时间</el-radio>
              <el-radio :label="1" style="margin-right: 10px;margin-left:-15px">审核时间</el-radio>
            </el-radio-group>
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
            <el-button
              size="small "
              type="danger"
              @click="clearAll"
            >
              <svg-icon icon-class="clear"/> 重 置
            </el-button>
          </div>
          &nbsp;
        </el-col>
      </el-row>
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        class="broad-scrollbar-table"
        height="calc(100vh - 280px)"
        element-loading-text="拼命加载中"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
          </template>
        </el-table-column>
        <el-table-column label="报废单号" align="center" prop="billNo" width="180px"/>
        <el-table-column label="报废数量" align="center" prop="scrapNum"/>
        <el-table-column label="申请部门" align="center" prop="applyDept"/>
        <el-table-column label="责任部门" align="center" prop="responsibleDept"/>
        <el-table-column label="申请人" align="center" prop="creatorName"/>
        <el-table-column label="申请时间" align="center" prop="createTime" width="150" show-overflow-tooltip/>
        <el-table-column label="审核人" align="center" prop="reviewerName"/>
        <el-table-column label="审核时间" align="center" prop="reviewTime" width="150" show-overflow-tooltip/>
        <el-table-column label="任务状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0" style="color:#1C84C6;font-weight: bold">待审核(部门)</span>
            <span v-if="scope.row.status === 1" style="color: #f33;font-weight: bold">不通过(部门)</span>
            <span v-if="scope.row.status === 2" style="color:#1C84C6;font-weight: bold">待审核(QC)</span>
            <span v-if="scope.row.status === 3" style="color: #f33;font-weight: bold">不通过(QC)</span>
            <span v-if="scope.row.status === 4">待入库</span>
            <span v-if="scope.row.status === 5">已入库</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="status" width="200px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-search"
              @click="findInfo(scope.row)"
            > 查看</el-button>
            <el-button
              v-if="scope.row.status === 2"
              size="mini"
              type="danger"
              class="buttonTypechuli"
              @click="cheIstrue(scope.row)"
            > <svg-icon icon-class="rukedansh"/> 审批</el-button>
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
      title="产品报废申请单"
      width="1300px"
      class="tip-out-inner-dialog">
      <div class="tits" style="margin-top:-15px">
        <div class="bords">进度信息</div>
      </div>
      <el-row>
        <el-col :span="24">
          <el-steps :active="dialogType" align-center>
            <el-step :description="creatTime" :icon="dialogType > 1 ? 'el-icon-circle-check':'el-icon-circle-check-outline'" :class="dialogType > 1 ? 'stepsuccess':'stepready'" title="发起申请"/>
            <el-step :description="creatTime1" :icon="dialogType > 2 ? 'el-icon-circle-check':'el-icon-circle-check-outline'" :class="dialogType > 2 ? 'stepsuccess': dialogType === 2 ?'stepready':'stepnone'" title="领导审批"/>
            <el-step :description="creatTime2" :icon="dialogType > 3 ? 'el-icon-circle-check':'el-icon-circle-check-outline'" :class="dialogType > 3 ? 'stepsuccess': dialogType === 3 ?'stepready':'stepnone'" title="品保审批"/>
            <el-step :description="creatTime3" :icon="dialogType > 4 ? 'el-icon-circle-check':'el-icon-circle-check-outline'" :class="dialogType > 4 ? 'stepsuccess': dialogType === 4 ?'stepready':'stepnone'" title="生管入库"/>
          </el-steps>
        </el-col>
      </el-row>
      <div class="tits">
        <div class="bords">基本信息</div>
      </div>
      <el-row style="margin-top: -20px;">
        <el-col :span="24">
          <div class="input-item">
            <span class="input-title">报废单号</span>
            <el-input v-model="dialogForm.billNo" :disabled="true" class="search-input" style="width:125px" placeholder="" size="small" maxlength="20"/>
          </div>
          <div class="input-item">
            <span class="input-title">申请部门</span>
            <el-input v-model="dialogForm.deptName" :disabled="true" class="search-input" style="width:110px" placeholder="请选择" size="small" maxlength="20"/>
          </div>
          <div class="input-item">
            <span class="input-title">责任部门</span>
            <el-input v-model="dialogForm.rdeptName" :disabled="true" class="search-input" style="width:190px" placeholder="请选择" size="small" maxlength="20"/>
          </div>
          <div class="input-item">
            <span class="input-title">申请人</span>
            <el-select v-model="dialogForm.creator" :disabled="true" class="search-input" size="small" style="width:115px" placeholder="请选择">
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">申请时间 </span>
            <el-date-picker
              v-model="dialogForm.creatTime"
              :picker-options="pickerOptionsStart"
              :editable="false"
              :disabled="true"
              class="search-input"
              style="width:150px"
              size="small"
              type="date"
              placeholder="申请时间"
              value-format="timestamp"
              clearable
            />
          </div>
          <div class="input-item" style="margin-right:0px">
            <span class="input-title">报废数量</span>
            <el-input v-model="dialogForm.baofeiNum" :disabled="true" class="search-input" style="width:77px" placeholder="请输入数量" size="small" maxlength="20" clearable/>
          </div>
        </el-col>
      </el-row>
      <div class="tits">
        <div class="bords">审核信息</div>
      </div>
      <el-row style="margin-top: -20px;padding-bottom: 10px;border-bottom: 1px solid #e5e5e5;">
        <el-col :span="24">
          <div class="input-item">
            <span class="input-title" style="width: 90px;">部门审核意见</span>
            <el-select v-model="dialogForm.deptSuggess" :disabled="dialogType!==2" class="search-input" size="small" style="width:115px" placeholder="请选择" filterable>
              <el-option
                v-for="item in checkList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">审核人</span>
            <el-select v-model="dialogForm.duserId" :disabled="true" class="search-input" size="small" style="width:115px" placeholder="请选择" filterable>
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">审核时间 </span>
            <el-date-picker
              v-model="dialogForm.dcreatTime"
              :picker-options="pickerOptionsStart"
              :editable="false"
              :disabled="true"
              class="search-input"
              style="width:130px"
              size="small"
              type="date"
              placeholder="审核时间"
              value-format="timestamp"
              clearable
            />
          </div>
          <div class="input-item" style="margin-right:0px">
            <span class="input-title">备注</span>
            <el-input v-model="dialogForm.dremark" :disabled="dialogType!==2" class="search-input" style="width:552px" placeholder="请输入" size="small" maxlength="20" clearable/>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 15px">
        <el-col :span="24">
          <div class="input-item">
            <span class="input-title" style="width: 90px;">品保审核意见</span>
            <el-select v-model="dialogForm.qceptSuggess" :disabled="dialogType!==3" class="search-input" size="small" style="width:115px" placeholder="请选择" filterable>
              <el-option
                v-for="item in checkList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">审核人</span>
            <el-select v-model="dialogForm.qcuserId" :disabled="true" class="search-input" size="small" style="width:115px" placeholder="请选择">
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">审核时间 </span>
            <el-date-picker
              v-model="dialogForm.qccreatTime"
              :picker-options="pickerOptionsStart"
              :editable="false"
              :disabled="true"
              class="search-input"
              style="width:130px"
              size="small"
              type="date"
              placeholder="审核时间"
              value-format="timestamp"
              clearable
            />
          </div>
          <div class="input-item" style="margin-right:0px">
            <span class="input-title">备注</span>
            <el-input v-model="dialogForm.qcremark" :disabled="dialogType!==3" class="search-input" style="width:552px" placeholder="请输入" size="small" maxlength="20" clearable/>
          </div>
        </el-col>
      </el-row>
      <el-table
        v-loading="listLoading"
        :data="selectList"
        class="broad-scrollbar-table sess"
        height="400px"
        element-loading-text="拼命加载中"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
          </template>
        </el-table-column>
        <el-table-column label="批号" align="center" prop="batchNo" width="180px"/>
        <el-table-column label="WaferID" align="center" prop="waferNo" width="220px" show-overflow-tooltip/>
        <el-table-column label="镭刻号" align="center" prop="laserMark" width="130px"/>
        <el-table-column label="产品型号" align="center" prop="productModel" width="100px"/>
        <el-table-column label="片型" align="center" prop="pattern"/>
        <el-table-column label="尺寸" align="center" prop="size" width="80px"/>
        <el-table-column label="投片类型" align="center" prop="productType"/>
        <el-table-column label="工艺" align="center" prop="craft"/>
        <el-table-column label="检出工序" align="center" prop="checkOutProcess" show-overflow-tooltip/>
        <el-table-column label="报废原因" align="center" prop="reason" width="150px" show-overflow-tooltip/>
        <el-table-column label="预防措施" align="center" prop="prevent" width="150px" show-overflow-tooltip/>
        <el-table-column v-if="dialogType === 1" label="操作" align="center" prop="status" fixed="right">
          <template slot-scope="scope">
            <i class="el-icon-delete" style="color: #f00;font-size: 20px;cursor: pointer;" @click="deleteList(scope.$index)"/>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="submitBill()">确 定</el-button>
        <el-button size="small" @click="addDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="checkDialogVisible"
      title="产品报废申请单"
      width="1300px"
      class="tip-out-inner-dialog sssf">
      <div class="tits" style="margin-top:-15px">
        <div class="bords">进度信息</div>
      </div>
      <el-row>
        <el-col :span="24">
          <el-steps :active="dialogType" align-center>
            <el-step :description="creatTime" :icon="dialogType > 1 ? 'el-icon-circle-check':'el-icon-circle-check-outline'" :class="dialogType > 1 ? 'stepsuccess':'stepready'" title="发起申请"/>
            <el-step :description="creatTime1" :icon="dialogType > 2 ? 'el-icon-circle-check':'el-icon-circle-check-outline'" :class="dialogType > 2 ? 'stepsuccess': dialogType === 2 ?'stepready':'stepnone'" title="领导审批"/>
            <el-step :description="creatTime2" :icon="dialogType > 3 ? 'el-icon-circle-check':'el-icon-circle-check-outline'" :class="dialogType > 3 ? 'stepsuccess': dialogType === 3 ?'stepready':'stepnone'" title="品保审批"/>
            <el-step :description="creatTime3" :icon="dialogType > 4 ? 'el-icon-circle-check':'el-icon-circle-check-outline'" :class="dialogType > 4 ? 'stepsuccess': dialogType === 4 ?'stepready':'stepnone'" title="生管入库"/>
          </el-steps>
        </el-col>
      </el-row>
      <div class="tits">
        <div class="bords">基本信息</div>
      </div>
      <el-row style="margin-top: -20px;">
        <el-col :span="24">
          <div class="input-item">
            <span class="input-title">报废单号</span>
            <el-input v-model="dialogForm.billNo" :disabled="true" class="search-input" style="width:125px" placeholder="" size="small" maxlength="20"/>
          </div>
          <div class="input-item">
            <span class="input-title">申请部门</span>
            <el-input v-model="dialogForm.deptName" :disabled="true" class="search-input" style="width:110px" placeholder="请选择" size="small" maxlength="20"/>
          </div>
          <div class="input-item">
            <span class="input-title">责任部门</span>
            <el-input v-model="dialogForm.rdeptName" :disabled="true" class="search-input" style="width:190px" placeholder="请选择" size="small" maxlength="20"/>
          </div>
          <div class="input-item">
            <span class="input-title">申请人</span>
            <el-select v-model="dialogForm.creator" :disabled="true" class="search-input" size="small" style="width:115px" placeholder="请选择">
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">申请时间 </span>
            <el-date-picker
              v-model="dialogForm.creatTime"
              :picker-options="pickerOptionsStart"
              :editable="false"
              :disabled="true"
              class="search-input"
              style="width:150px"
              size="small"
              type="date"
              placeholder="申请时间"
              value-format="timestamp"
              clearable
            />
          </div>
          <div class="input-item" style="margin-right:0px">
            <span class="input-title">报废数量</span>
            <el-input v-model="dialogForm.baofeiNum" :disabled="true" class="search-input" style="width:77px" placeholder="请输入数量" size="small" maxlength="20" clearable/>
          </div>
        </el-col>
      </el-row>
      <div class="tits">
        <div class="bords">审核信息</div>
      </div>
      <el-row style="margin-top: -20px;padding-bottom: 10px;border-bottom: 1px solid #e5e5e5;">
        <el-col :span="24">
          <div class="input-item">
            <span class="input-title" style="width: 90px;">部门审核意见</span>
            <el-select v-model="dialogForm.deptSuggess" :disabled="true" class="search-input" size="small" style="width:115px" placeholder="请选择">
              <el-option
                v-for="item in checkList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">审核人</span>
            <el-select v-model="dialogForm.duserId" :disabled="true" class="search-input" size="small" style="width:115px" placeholder="请选择">
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">审核时间 </span>
            <el-date-picker
              v-model="dialogForm.dcreatTime"
              :picker-options="pickerOptionsStart"
              :editable="false"
              :disabled="true"
              class="search-input"
              style="width:130px"
              size="small"
              type="date"
              placeholder="审核时间"
              value-format="timestamp"
              clearable
            />
          </div>
          <div class="input-item" style="margin-right:0px">
            <span class="input-title">备注</span>
            <el-input v-model="dialogForm.dremark" :disabled="true" class="search-input" style="width:552px" placeholder="请输入" size="small" maxlength="20" clearable/>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 15px">
        <el-col :span="24">
          <div class="input-item">
            <span class="input-title" style="width: 90px;">品保审核意见</span>
            <el-select v-model="dialogForm.qceptSuggess" :disabled="true" class="search-input" size="small" style="width:115px" placeholder="请选择">
              <el-option
                v-for="item in checkList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">审核人</span>
            <el-select v-model="dialogForm.qcuserId" :disabled="true" class="search-input" size="small" style="width:115px" placeholder="请选择">
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">审核时间 </span>
            <el-date-picker
              v-model="dialogForm.qccreatTime"
              :picker-options="pickerOptionsStart"
              :editable="false"
              :disabled="true"
              class="search-input"
              style="width:130px"
              size="small"
              type="date"
              placeholder="审核时间"
              value-format="timestamp"
              clearable
            />
          </div>
          <div class="input-item" style="margin-right:0px">
            <span class="input-title">备注</span>
            <el-input v-model="dialogForm.qcremark" :disabled="true" class="search-input" style="width:552px" placeholder="请输入" size="small" maxlength="20" clearable/>
          </div>
        </el-col>
      </el-row>
      <el-table
        v-loading="listLoading"
        :data="selectList"
        class="broad-scrollbar-table sess"
        height="400px"
        element-loading-text="拼命加载中"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
          </template>
        </el-table-column>
        <el-table-column label="批号" align="center" prop="batchNo" width="180px"/>
        <el-table-column label="WaferID" align="center" prop="waferNo" width="220px" show-overflow-tooltip/>
        <el-table-column label="镭刻号" align="center" prop="laserMark" width="130px"/>
        <el-table-column label="产品型号" align="center" prop="productModel" width="100px"/>
        <el-table-column label="片型" align="center" prop="pattern"/>
        <el-table-column label="尺寸" align="center" prop="size" width="80px"/>
        <el-table-column label="投片类型" align="center" prop="productType"/>
        <el-table-column label="工艺" align="center" prop="craft"/>
        <el-table-column label="检出工序" align="center" prop="checkOutProcess" show-overflow-tooltip/>
        <el-table-column label="报废原因" align="center" prop="reason" width="150px" show-overflow-tooltip/>
        <el-table-column label="预防措施" align="center" prop="prevent" width="150px" show-overflow-tooltip/>
      </el-table>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

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
</style>
