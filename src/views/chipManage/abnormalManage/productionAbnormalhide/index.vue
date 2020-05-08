<template>
  <PageHeaderLayout :has_back="true">
    <div class="header-search-add height-auto" style="padding-top: 0">
      <div class="search-box">
        <div class="left-search-box">
          <div class="input-item">
            <span class="input-title">批号 </span>
            <el-input v-model="batchNo" class="search-input" placeholder="请输入批号" size="small" maxlength="20" clearable/>
          </div>
          <!-- <div class="input-item">
            <span class="input-title">异常单号 </span>
            <el-input v-model="billNo" class="search-input" placeholder="请输入异常单号" size="small" maxlength="20" clearable/>
          </div> -->
          <div class="input-item">
            <span class="input-title">处理时间 </span>
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
            <span class="input-title">任务状态 </span>
            <el-select v-model="status" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">片号 </span>
            <el-input v-model="waferNo" class="search-input" placeholder="请输入片号" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">产品型号 </span>
            <el-select v-model="productModel" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in productLists"
                :key="item.id"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">提交时间 </span>
            <el-date-picker
              v-model="beginDate1"
              :picker-options="pickerOptionsStart1"
              :editable="false"
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
              size="small"
              type="date"
              placeholder="选择结束日期"
              value-format="timestamp"
            />
          </div>
          <div class="input-item">
            <span class="input-title">提交人 </span>
            <el-select v-model="creator" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in userLists"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
        </div>
        <div class="right-btn-box">
          <el-button
            class="float-right margin-top margin-left"
            size="small"
            type="danger"
            @click="clearAll"
          >
            <svg-icon icon-class="clear"/> 重 置
          </el-button>
          <el-button
            class="float-right margin-top"
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="handleSearch" >查 询</el-button>
        </div>
      </div>
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        height="calc(100vh - 329px)"
        class="run-table"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="异常单号" align="center" prop="billNo" width="150px"/> -->
        <el-table-column label="批号" align="center" prop="batchNo" width="180px"/>
        <el-table-column label="产品型号" align="center" prop="productCode" width="100px"/>
        <el-table-column label="尺寸" align="center" prop="measure" width="60px"/>
        <el-table-column label="流程卡" align="center" width="170px" show-overflow-tooltip>
          <template slot-scope="scope">
            <a class="primarya" @click="handleReview(scope.row)"> {{ scope.row.flowCardName }}</a>
          </template>
        </el-table-column>
        <el-table-column label="工艺分类" align="center" prop="craft"/>
        <el-table-column label="异常数量" align="center" width="80px">
          <template slot-scope="scope">
            {{ scope.row.exceptionNum }}/{{ scope.row.total }}
          </template>
        </el-table-column>
        <el-table-column label="检出工序" align="center" prop="detectionProcess" width="110px"/>
        <el-table-column label="异常描述" align="center" prop="description" show-overflow-tooltip/>
        <el-table-column label="提交时间" align="center" prop="createTime" width="150px"/>
        <el-table-column label="提交人" align="center" prop="creatorName" width="80px"/>
        <el-table-column label="处理时间" align="center" prop="auditTime" width="150px"/>
        <el-table-column label="处理人" align="center" prop="auditorName" width="80px" show-overflow-tooltip/>
        <el-table-column label="处理结果" align="center" prop="result" show-overflow-tooltip/>
        <el-table-column label="任务状态" align="center" width="80px">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">待处理</span>
            <span v-if="scope.row.status === 1">已完成</span>
            <span v-if="scope.row.status === 2">处理中</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="status">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status !== 1"
              size="mini"
              type="primary"
              class="buttonTypechuli"
              @click="handelRow(scope.row)"
            ><svg-icon icon-class="chulixx"/> 处理</el-button>
            <el-button
              v-if="scope.row.status === 1"
              size="mini"
              type="primary"
              @click="showResult(scope.row)"
            ><svg-icon icon-class="search"/> 查看结果</el-button>
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
      :visible.sync="addDialogVisible"
      title="异常处理"
      width="1200px">
      <fieldset class="fieldest">
        <legend class="legendsty"> 基本情况 </legend>
        <el-table
          :data="infoList"
          element-loading-text="拼命加载中"
          class="run-table ste tip-out-inner-dialog"
          border
          fit
          highlight-current-row>
          <el-table-column label="产品型号" align="center" prop="productCode"/>
          <el-table-column label="流程卡" align="center" prop="flowCardName"/>
          <el-table-column label="工艺分类" align="center" prop="craft"/>
          <el-table-column label="异常片数" align="center" prop="exceptionNum"/>
          <el-table-column label="传片总数" align="center" prop="total"/>
          <el-table-column label="提交人" align="center" prop="creatorName"/>
          <el-table-column label="提交时间" align="center" prop="createTime"/>
        </el-table>
      </fieldset>
      <fieldset class="fieldest parameter-table" style="margin-top:15px">
        <legend class="legendsty"> 异常判定 </legend>
        <el-table
          ref="history"
          :data="historyList"
          :row-class-name="tableRowClassName"
          element-loading-text="拼命加载中"
          class="run-table ste tip-out-inner-dialog"
          height="200px"
          border
          fit
          highlight-current-row
          @selection-change="handleSelectionChange">
          <el-table-column :selectable="checkList" type="selection" width="55"/>
          <el-table-column label="WaferID" align="center" prop="waferNo"/>
          <el-table-column label="镭刻号" align="center" prop="laserMark"/>
          <el-table-column label="异常提交原因" align="center" prop="reason"/>
          <el-table-column label="异常处理结果" align="center" prop="processResult"/>
        </el-table>
      </fieldset>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button v-if="showFlag" type="primary" @click="checkFinish()">完成判定</el-button> -->
        <el-button type="primary" @click="opennew()">开异常单</el-button>
        <el-button @click="addDialogVisible = false">取 消</el-button>
      </span>
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="checkDialogVisible"
        class="print-dialog"
        title="判定"
        width="600px"
        append-to-body
      >
        <el-row style="margin-top: -10px;padding-bottom:20px">
          <el-col :span="24">
            <div class="tab-control" style="margin-top: -10px;">
              <!-- <span
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
              >报废</span> -->
              <span
                :class="{activeTab: radio === 3}"
                class="has-margin-left"
                @click="navClick(3)"
              >异常单</span>
            </div>
          </el-col>
          <!-- <el-col :span="4">
            <el-radio-group v-model="radio">
              <el-row style="padding: 15px;border-right: 1px solid #e5e5e5;border-bottom: 1px solid #e5e5e5;">
                <el-col :span="24">
                  <el-radio :label="0">正常</el-radio>
                </el-col>
              </el-row>
              <el-row style="padding: 15px;border-right: 1px solid #e5e5e5;border-bottom: 1px solid #e5e5e5;">
                <el-col :span="24">
                  <el-radio :label="1">返工</el-radio>
                </el-col>
              </el-row>
              <el-row style="padding: 15px;border-right: 1px solid #e5e5e5;border-bottom: 1px solid #e5e5e5;">
                <el-col :span="24">
                  <el-radio :label="2">报废</el-radio>
                </el-col>
              </el-row>
              <el-row style="padding: 15px;border-right: 1px solid #e5e5e5;border-bottom: 1px solid #e5e5e5;">
                <el-col :span="24">
                  <el-radio :label="3">异常单</el-radio>
                </el-col>
              </el-row>
            </el-radio-group>
          </el-col> -->

          <el-col :span="24" style="padding-top: 15px;">
            <div v-if="radio === 0">
              <el-table
                :data="infoList"
                element-loading-text="拼命加载中"
                class="run-table ste tip-out-inner-dialog"
                border
                fit
                highlight-current-row>
                <el-table-column label="下一站点" align="center" prop="nextSite"/>
                <el-table-column label="下一工序" align="center" prop="nextProcess"/>
              </el-table>
              <div style="text-align: center;margin-top: 15px;">
                <el-button type="primary" size="small" @click="determine(0)">确定</el-button>
              </div>
            </div>
            <div v-if="radio === 1">
              <el-form ref="backForm" :model="backForm" :rules="rules" status-icon label-width="95px" label-position="right">
                <el-form-item label="异常分类 " prop="typeId">
                  <el-select v-model="backForm.typeId" style="width: 323px;" placeholder="请选择" filterable>
                    <el-option
                      v-for="item in errorLists"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"/>
                  </el-select>
                </el-form-item>
                <el-form-item label="返工流程卡 " prop="flowCardId">
                  <el-select v-model="backForm.flowCardId" style="width: 323px;" placeholder="请选择" filterable>
                    <el-option
                      v-for="item in flowBackList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"/>
                  </el-select>
                </el-form-item>
                <el-form-item label="责任人 ">
                  <el-select v-model="backForm.creator" multiple style="width: 323px;" placeholder="请选择" filterable>
                    <el-option
                      v-for="item in userLists"
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
                <el-button type="primary" size="small" @click="determine(1)">立即返工</el-button>
                <el-button type="primary" size="small" @click="determine(2)">待返工</el-button>
              </div>
            </div>
            <div v-if="radio === 2">
              <el-form ref="backForm" :model="backForm" :rules="rules" status-icon label-width="95px" label-position="right">
                <el-form-item label="责任部门 " prop="dept">
                  <el-select v-model="backForm.dept" multiple style="width: 323px;" placeholder="请选择" filterable>
                    <el-option
                      v-for="item in deptList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"/>
                  </el-select>
                </el-form-item>
                <el-form-item label="报废原因 " prop="reason">
                  <el-input v-model="backForm.reason" type="textarea" placeholder="请输入报废原因" maxlength="50"/>
                </el-form-item>
                <el-form-item label="预防措施 " prop="prevent">
                  <el-input v-model="backForm.prevent" type="textarea" placeholder="请输入预防措施" maxlength="50"/>
                </el-form-item>
                <el-form-item label="折算数 " prop="conversionNum">
                  <el-input v-model="backForm.conversionNum" type="text" placeholder="请输入折算数" maxlength="5"/>
                </el-form-item>
              </el-form>
              <div style="text-align: center;">
                <el-button type="primary" size="small" @click="determine(3)">立即报废</el-button>
                <el-button type="primary" size="small" @click="determine(4)">待报废</el-button>
              </div>
            </div>
            <div v-if="radio === 3">
              <div style="text-align: center;">
                <el-button type="primary" size="small" @click="opennew()">开异常单</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-dialog>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="printDialogVisible"
      title="返工详情"
      width="1200px">
      <fieldset class="fieldest">
        <legend class="legendsty"> 基本情况 </legend>
        <el-table
          :data="infosList"
          element-loading-text="拼命加载中"
          class="run-table ste tip-out-inner-dialog"
          border
          fit
          highlight-current-row>
          <el-table-column label="返工批号" align="center" prop="batchNo"/>
          <el-table-column label="产品型号" align="center" prop="productModel"/>
          <el-table-column label="流程卡名称" align="center" prop="reworkFlowCard"/>
          <el-table-column label="工艺分类" align="center" prop="craft"/>
          <el-table-column label="片数" align="center" prop="num"/>
        </el-table>
      </fieldset>
      <fieldset class="fieldest" style="margin-top:15px">
        <legend class="legendsty"> 返工流程卡 </legend>
        <el-table
          :data="backList"
          element-loading-text="拼命加载中"
          class="run-table ste tip-out-inner-dialog"
          height="200px"
          border
          fit
          highlight-current-row>
          <el-table-column align="center" label="步骤" width="50">
            <template slot-scope="scope">
              {{ scope.$index+1 }}
            </template>
          </el-table-column>
          <el-table-column label="站点" align="center" prop="siteId" width="100"/>
          <el-table-column label="工序" align="center" prop="processId" width="150"/>
          <el-table-column label="制造记录" align="center" prop="remark"/>
          <el-table-column label="程序" align="center" prop="programName"/>
        </el-table>
      </fieldset>
      <fieldset class="fieldest left" style="margin-top:15px">
        <legend class="legendsty"> 返工芯片 </legend>
        <el-table
          :data="chipList"
          row-key="index"
          element-loading-text="拼命加载中"
          class="run-table ste tip-out-inner-dialog"
          height="200px"
          border
          fit
          highlight-current-row>
          <el-table-column align="center" label="位次号" width="80">
            <template slot-scope="scope">
              {{ scope.$index+1 }}
            </template>
          </el-table-column>
          <el-table-column label="WaferID" align="center" prop="waferNo"/>
          <el-table-column label="镭刻号" align="center" prop="laserMark"/>
          <el-table-column label="操作" align="center" prop="">
            <template slot-scope="scope">
              <i @click="handleUp(scope.$index)"><svg-icon style="color: #009494;font-size: 20px;cursor: pointer;" icon-class="top" /></i>
              <i @click="handleDown(scope.$index)"><svg-icon style="color: #009494;font-size: 20px;cursor: pointer;" icon-class="bottom" /></i>
              <i class="el-icon-delete" style="color: #f00;font-size: 20px;cursor: pointer;" @click="deleteXP(scope.$index)"/>
            </template>
          </el-table-column>
        </el-table>
      </fieldset>
      <div id="printDivs" ref="prints" class="print" style="display:none">
        <fieldset class="fieldest">
          <legend class="legendsty"> 基本情况 </legend>
          <el-row>
            <el-col :span="24">
              <div>
                <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" style="width: 278mm;" >
                  <thead>
                    <tr>
                      <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666;">
                        <div style="font-size:0.5cm;" class="cell">返工批号</div>
                      </th>
                      <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666;">
                        <div style="font-size:0.5cm;" class="cell">产品型号</div>
                      </th>
                      <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666;">
                        <div style="font-size:0.5cm;" class="cell">流程卡名称</div>
                      </th>
                      <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666;">
                        <div style="font-size:0.5cm;" class="cell">工艺分类</div>
                      </th>
                      <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666;">
                        <div style="font-size:0.5cm;" class="cell">片数</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in infosList" :key="index">
                      <td colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666">
                        <div class="cell">{{ item.batchNo }}</div>
                      </td>
                      <td colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666">
                        <div class="cell">{{ item.productModel }}</div>
                      </td>
                      <td colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666">
                        <div class="cell">{{ item.reworkFlowCard }}</div>
                      </td>
                      <td colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666">
                        <div class="cell">{{ item.craft }}</div>
                      </td>
                      <td colspan="1" rowspan="1" style="text-align:center;height:35px;word-break: break-all;border:1px solid #666">
                        <div class="cell">{{ item.num }}</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </el-col>
          </el-row>
        </fieldset>
        <fieldset class="fieldest" style="margin-top:15px">
          <legend class="legendsty"> 返工流程卡 </legend>
          <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" style="width: 278mm;" >
            <thead>
              <tr>
                <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666;width:50px">
                  <div style="font-size:0.5cm;" class="cell">步骤</div>
                </th>
                <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666;width:100px">
                  <div style="font-size:0.5cm;" class="cell">站点</div>
                </th>
                <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666;width:120px">
                  <div style="font-size:0.5cm;" class="cell">工序</div>
                </th>
                <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666;">
                  <div style="font-size:0.5cm;" class="cell">制造记录</div>
                </th>
                <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666;">
                  <div style="font-size:0.5cm;" class="cell">程序</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in backList" :key="index">
                <td colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666">
                  <div class="cell">{{ index+1 }}</div>
                </td>
                <td colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666">
                  <div class="cell">{{ item.siteId }}</div>
                </td>
                <td colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666">
                  <div class="cell">{{ item.processId }}</div>
                </td>
                <td colspan="1" rowspan="1" style="text-align:center;height:35px;word-break: break-all;border:1px solid #666">
                  <div class="cell">{{ item.remark }}</div>
                </td>
                <td colspan="1" rowspan="1" style="text-align:center;height:35px;word-break: break-all;border:1px solid #666">
                  <div class="cell">{{ item.programName }}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </fieldset>
        <fieldset class="fieldest left" style="margin-top:15px">
          <legend class="legendsty"> 返工芯片 </legend>
          <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" style="width: 278mm;" >
            <thead>
              <tr>
                <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666;">
                  <div style="font-size:0.5cm;" class="cell">位次号</div>
                </th>
                <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666;">
                  <div style="font-size:0.5cm;" class="cell">WaferID</div>
                </th>
                <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666;">
                  <div style="font-size:0.5cm;" class="cell">镭刻号</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in chipList" v-show="item.id !==''" :key="index">
                <td colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666">
                  <div class="cell">{{ index+1 }}</div>
                </td>
                <td colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666">
                  <div class="cell">{{ item.waferNo }}</div>
                </td>
                <td colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666">
                  <div class="cell">{{ item.laserMark }}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </fieldset>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="prints()">确认并打印标签</el-button>
        <el-button type="primary" @click="printDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible1"
      title="查看结果"
      width="1200px">
      <fieldset class="fieldest">
        <legend class="legendsty"> 基本情况 </legend>
        <el-table
          :data="infoList"
          element-loading-text="拼命加载中"
          class="run-table ste tip-out-inner-dialog"
          border
          fit
          highlight-current-row>
          <el-table-column label="产品型号" align="center" prop="productCode"/>
          <el-table-column label="流程卡" align="center" prop="flowCardName"/>
          <el-table-column label="工艺分类" align="center" prop="craft"/>
          <el-table-column label="异常片数" align="center" prop="exceptionNum"/>
          <el-table-column label="传片总数" align="center" prop="total"/>
          <el-table-column label="提交人" align="center" prop="creatorName"/>
          <el-table-column label="提交时间" align="center" prop="createTime"/>
        </el-table>
      </fieldset>
      <fieldset class="fieldest" style="margin-top:15px">
        <legend class="legendsty"> 处理结果 </legend>
        <el-table
          :data="historyList"
          element-loading-text="拼命加载中"
          class="run-table ste tip-out-inner-dialog"
          height="400px"
          border
          fit
          highlight-current-row>
          <el-table-column label="WaferID" align="center" prop="waferNo" width="190"/>
          <el-table-column label="镭刻号" align="center" prop="laserMark" width="120"/>
          <el-table-column label="异常提交原因" align="center" prop="reason" show-overflow-tooltip/>
          <el-table-column label="处理结果" align="center" prop="processResult" show-overflow-tooltip/>
          <el-table-column label="异常处理原因" align="center" prop="processReason" show-overflow-tooltip/>
        </el-table>
      </fieldset>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible1 = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="innerVisible"
      class="inner-dialog"
      width="1000px"
      top="8vh"
      title="查看流程卡">
      <div style="margin-bottom: 10px;margin-top: -20px;">
        <span class="option-items-dialog">
          <span class="option-title" style="padding-top: 15px;">流程卡编号： </span>
          <span v-text="crrentCode">12</span>
        </span>
        <span class="option-items-dialog" style="float: right;">
          <span class="option-title">流程卡类型： </span>
          <span v-if="currentCardType === 0" class="proceCardType">普通流程卡</span>
          <span v-if="currentCardType === 1" class="proceCardType">重工流程卡</span>
          <span v-if="currentCardType === 2" class="proceCardType">返工流程卡</span>
          <span v-if="currentCardType === 3" class="proceCardType">自定义流程卡</span>
        </span>
      </div>
      <div class="module-container" style="box-shadow: none;border:1px solid #e2e2e2;clear: both;margin-top: 10px;padding: 15px">
        <el-row style="border-bottom:1px solid #e2e2e2;padding-bottom:10px">
          <el-col :span="2"><span class="option-title">流程卡名称： </span></el-col>
          <el-col :span="9"><div style="padding-left:10px" v-text="currentCardName">生产流程卡</div></el-col>
          <el-col :span="5">
            <span class="option-title">流程卡状态： </span>
            <span v-if="currentStatus === 0">启用</span>
            <span v-if="currentStatus === 1">禁用</span>
            <span v-if="currentStatus === 2">临时</span>
          </el-col>
          <el-col :span="3">
            <span class="option-title">工艺分类： </span>{{ currentCraft }}
          </el-col>
        </el-row>
        <el-row style="border-bottom:1px solid #e2e2e2;padding-bottom:10px;margin-top:15px">
          <span class="option-title" style="text-align:left">对应型号： </span>
          <div class="select-type-box" style="padding-left: 25px">
            <div v-for="type in currentModelList" :key="type"><div class="color-title" v-text="'【'+type.color+'】:'"/> <div class="model-box"><span v-for="name in type.modelName" :key="name" class="model-item" style="margin-left: 10px" v-text="name.split('#')[0]"/></div></div>
          </div>
        </el-row>
        <el-row style="margin-top:15px">
          <el-col :span="6">
            <span class="option-items-dialog" style="width:100%">
              <span class="option-title" style="width:75px">创建时间： </span>
              <span v-text="currentCreateTime">2019年11月22日14:12:11</span>
            </span>
          </el-col>
          <el-col :span="6">
            <span class="option-items-dialog" style="width:100%">
              <span class="option-title" style="width:75px">创建人： </span>
              <span v-text="currentCreator">2019年11月22日14:12:11</span>
            </span>
          </el-col>
          <el-col :span="6">
            <span class="option-items-dialog" style="width:100%">
              <span class="option-title" style="width:75px">修改时间： </span>
              <span v-text="currentCreateTime">2019年11月22日14:12:11</span>
            </span>
          </el-col>
          <el-col :span="6">
            <span class="option-items-dialog" style="width:100%">
              <span class="option-title" style="width:75px">修改人： </span>
              <span v-text="currentUpdateTime">2019年11月22日14:12:11</span>
            </span>
          </el-col>
        </el-row>
      </div>
      <div class="module-container" style="box-shadow: none;border:1px solid #e2e2e2;clear: both;margin-top: 10px">
        <div class="module-title">
          <div class="module-title-text">前段工序</div>
        </div>
        <div class="module-content classes-table">
          <el-table
            v-loading="listLoading"
            :data="dialogList"
            :class="(currentCardType === 1 || currentCardType === 2) ? 'abnormal-process-table' : ''"
            class="dialog-table"
            element-loading-text="拼命加载中"
            border
            fit>
            <el-table-column align="center" label="序号" width="50">
              <template slot-scope="scope">
                <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                  {{ scope.$index+1 }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="站点" align="center" prop="mandataryName">
              <template slot-scope="scope">
                <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                  <el-select v-model="scope.row.siteId" :disabled="true" placeholder="" size="small" style="width: 95%" filterable>
                    <el-option
                      v-for="item in forepartSiteOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"/>
                  </el-select>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="工序" align="center" prop="processName">
              <template slot-scope="scope">
                <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                  <div class="has-height" v-text="scope.row.processId"/>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="制造记录" align="center" prop="endTime" show-overflow-tooltip>
              <template slot-scope="scope">
                <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                  <div class="has-height" v-text="scope.row.remark"/>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="程序" align="center">
              <template slot-scope="scope">
                <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                  <el-select v-model="scope.row.programName" :disabled="true" placeholder="" size="small" style="width: 95%" filterable>
                    <el-option
                      v-for="item in scope.row.programOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"/>
                  </el-select>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="module-title">
          <div class="module-title-text">后段工序</div>
        </div>
        <div v-if="currentCardType === 2" style="font-size: 26px;margin: 15px">后段工序随原流程卡进行！</div>
        <div v-if="currentCardType !== 2" class="module-content">
          <el-table
            v-loading="listLoading"
            :data="dialogEndList"
            :class="(currentCardType === 1 || currentCardType === 2) ? 'abnormal-process-table' : ''"
            class="dialog-table"
            element-loading-text="拼命加载中"
            border
            fit>
            <el-table-column align="center" label="序号" width="50">
              <template slot-scope="scope">
                <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                  {{ scope.$index+1+ dialogList.length }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="站点" align="center" prop="mandataryName">
              <template slot-scope="scope">
                <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                  <el-select v-model="scope.row.siteId" :disabled="true" placeholder="" size="small" style="width: 95%" filterable>
                    <el-option
                      v-for="item in endSiteOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"/>
                  </el-select>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="工序" align="center" prop="processName">
              <template slot-scope="scope">
                <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                  <div v-text="scope.row.processId"/>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="制造记录" align="center" prop="endTime" show-overflow-tooltip>
              <template slot-scope="scope">
                <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                  <div v-text="scope.row.remark"/>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="程序" align="center">
              <template slot-scope="scope">
                <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                  <el-select v-model="scope.row.programName" :disabled="true" placeholder="" size="small" style="width: 95%" filterable>
                    <el-option
                      v-for="item in scope.row.programOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"/>
                  </el-select>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
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
    height: calc(100vh - 252px);
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
  .right-btn-box{
    width: 260px;
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
</style>
