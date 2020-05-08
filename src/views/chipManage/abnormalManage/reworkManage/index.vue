<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto">
      <div class="header-btn-group">
        <el-button
          :disabled="isActive !== 0"
          size="small"
          type="primary"
          @click="tipOut"
        ><svg-icon icon-class="xuanzexx"/> 提交返工</el-button>
      </div>
      <div class="search-box">
        <div class="left-search-box">
          <div class="input-item">
            <span class="input-title" style="width: 35px">批号 </span>
            <el-input v-model="batchNo" class="search-input" style="width: 190px" placeholder="请输入单号" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">产品型号 </span>
            <el-select v-model="productModel" class="search-input" style="width: 120px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in productLists"
                :key="item.id"
                :label="item.code"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 35px">尺寸 </span>
            <el-select v-model="size" class="search-input" style="width: 80px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in measureList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
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
              v-model="beginDate"
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
              style="width: 130px"
              class="search-input"
              size="small"
              type="date"
              placeholder="选择结束日期"
              value-format="timestamp"
            />
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 50px">处理人 </span>
            <el-select v-model="creator" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in userLists"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 80px;">返工流程卡 </span>
            <el-select v-model="reworkFlowCardId" class="search-input" style="width: 220px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in flowList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div style="float: left">
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
    <div class="app-container tip-out-inner-dialog">
      <div class="table-top-btn-group">
        <div
          :class="{'active':isActive === 0}"
          @click="navClick(0)"
        >
          待返工列表
        </div>
        <div
          :class="{'active':isActive === 1}"
          @click="navClick(1)"
        >
          已返工列表
        </div>
      </div>
      <el-table
        v-loading="listLoading"
        v-show="isActive === 0"
        :data="list"
        element-loading-text="拼命加载中"
        class="run-table"
        height="calc(100vh - 422px)"
        border
        fit
        stripe
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"/>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
          </template>
        </el-table-column>
        <el-table-column label="型号" align="center" prop="productModel" width="100px"/>
        <el-table-column label="尺寸" align="center" prop="size" width="60px"/>
        <el-table-column label="批号" align="center" prop="batchNo" width="180px" show-overflow-tooltip/>
        <el-table-column label="WaferID" align="center" prop="waferNo" width="200px" show-overflow-tooltip/>
        <el-table-column label="镭刻号" align="center" prop="laserMark" width="120px"/>
        <el-table-column label="检出工序" align="center" prop="checkPutProcess" width="150px"/>
        <el-table-column label="返工原因" align="center" prop="reworkReason" show-overflow-tooltip/>
        <el-table-column label="工艺" align="center" prop="craft"/>
        <el-table-column label="返工流程卡" align="center" width="170px" show-overflow-tooltip>
          <template slot-scope="scope">
            <a v-if="scope.row.reworkFlowCard !== '--'" class="primarya" @click="handleReview(scope.row)"> {{ scope.row.reworkFlowCard }}</a>
            <span v-if="scope.row.reworkFlowCard === '--'">{{ scope.row.reworkFlowCard }}</span>
          </template>
        </el-table-column>
        <el-table-column label="提交时间" align="center" prop="createTime" width="180px" show-overflow-tooltip/>
        <el-table-column label="提交人" align="center" prop="submitName"/>
        <el-table-column label="责任人" align="center" prop="responsibleName" show-overflow-tooltip/>
      </el-table>
      <el-table
        v-loading="listLoading"
        v-show="isActive === 1"
        :data="list"
        element-loading-text="拼命加载中"
        class="run-table"
        height="calc(100vh - 422px)"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="返工批号" align="center" prop="batchNo" width="180px"/>
        <el-table-column label="产品型号" align="center" prop="productModel" width="120px"/>
        <el-table-column label="返工数量" align="center" prop="reworkNum"/>
        <el-table-column label="检出工序" align="center" prop="checkOutProcess" width="150px" show-overflow-tooltip/>
        <el-table-column label="返工原因" align="center" prop="reason" show-overflow-tooltip/>
        <el-table-column label="返工步骤" align="center" prop="reworkStep"/>
        <el-table-column label="尺寸" align="center" prop="size"/>
        <el-table-column label="返工流程卡" align="center" width="160px" show-overflow-tooltip>
          <template slot-scope="scope">
            <a v-if="scope.row.reworkFlowCard !== '--'" class="primarya" @click="handleReview(scope.row)"> {{ scope.row.reworkFlowCard }}</a>
            <span v-if="scope.row.reworkFlowCard === '--'">{{ scope.row.reworkFlowCard }}</span>
          </template>
        </el-table-column>
        <el-table-column label="返工工序" align="center" prop="reworkProcess" width="150px"/>
        <el-table-column label="责任人" align="center" prop="responsibleName" show-overflow-tooltip/>
        <el-table-column label="提交人" align="center" prop="submitName" show-overflow-tooltip/>
        <el-table-column label="修改时间" align="center" prop="createTime" width="150px" show-overflow-tooltip/>
        <el-table-column label="处理人" align="center" prop="creatorName"/>
        <el-table-column label="操作" align="center" prop="status">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleAdd(scope.row)"
            ><svg-icon icon-class="wenben"/> 返工详情</el-button>
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
      ref="print"
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible1"
      title="提交返工"
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
          <el-table-column label="返工批号" align="center" prop="batchNo"/>
          <el-table-column label="产品型号" align="center" prop="productModel"/>
          <el-table-column label="工艺分类" align="center" prop="craft"/>
          <el-table-column label="当前选中片数" align="center" prop="num"/>
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
      <span slot="footer" class="dialog-footer">
        <el-button v-if="isActive === 0" type="primary" @click="prints()">打印</el-button>
        <el-button v-if="isActive === 0" type="primary" @click="submitWrok()">确认</el-button>
        <el-button v-if="isActive === 0" type="primary" @click="addDialogVisible1 = false">取消</el-button>
        <el-button v-show="isShowMenu['xpproductionManage-back-printlabel']" v-if="isActive === 1" type="primary" @click="printlabel()">打印标签</el-button>
      </span>
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
                        <div style="font-size:0.5cm;" class="cell">工艺分类</div>
                      </th>
                      <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666;">
                        <div style="font-size:0.5cm;" class="cell">当前选中片数</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in infoList" :key="index">
                      <td colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666">
                        <div class="cell">{{ item.batchNo }}</div>
                      </td>
                      <td colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666">
                        <div class="cell">{{ item.productModel }}</div>
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
                  <div class="cell">{{ index + 1 }}</div>
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
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible"
      title="返工详情"
      width="1200px">
      <fieldset class="fieldest">
        <legend class="legendsty"> 基本情况 </legend>
        <el-table
          v-if="rowInfos !== null && rowInfos.reworkProcess === undefined"
          :data="infoList"
          element-loading-text="拼命加载中"
          class="run-table ste tip-out-inner-dialog"
          border
          fit
          highlight-current-row>
          <el-table-column label="返工批号" align="center" prop="batchNo"/>
          <el-table-column label="产品型号" align="center" prop="productModel"/>
          <el-table-column label="工艺分类" align="center" prop="craft"/>
          <el-table-column label="当前选中片数" align="center" prop="num"/>
        </el-table>
        <el-table
          v-if="rowInfos !== null && rowInfos.reworkProcess !== undefined"
          :data="infoList"
          element-loading-text="拼命加载中"
          class="run-table ste tip-out-inner-dialog"
          border
          fit
          highlight-current-row>
          <el-table-column label="返工批号" align="center" prop="batchNo"/>
          <el-table-column label="产品型号" align="center" prop="productModel"/>
          <el-table-column label="工艺分类" align="center" prop="craft"/>
          <el-table-column label="当前选中片数" align="center" prop="num"/>
          <el-table-column label="返工工序" align="center" prop="reworkProcess"/>
        </el-table>
      </fieldset>
      <fieldset v-if="rowInfos !== null && rowInfos.reworkProcess === undefined" class="fieldest" style="margin-top:15px">
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
      <fieldset class="fieldest" style="margin-top:15px">
        <legend class="legendsty"> 返工芯片 </legend>
        <el-table
          :data="chipList"
          element-loading-text="拼命加载中"
          class="run-table ste tip-out-inner-dialog"
          height="200px"
          border
          fit
          highlight-current-row>
          <el-table-column align="center" label="原批号" prop="initBatchNo"/>
          <el-table-column align="center" label="位次号" width="60" prop="serialNum"/>
          <el-table-column label="WaferID" align="center" prop="waferNo"/>
          <el-table-column label="镭刻号" align="center" width="120" prop="laserMark"/>
          <el-table-column label="责任人" align="center" width="100" prop="responsibleName" show-overflow-tooltip/>
          <el-table-column label="提交时间" align="center" width="120" prop="submitTime"/>
          <el-table-column label="提交人" align="center" width="100" prop="submitter"/>
          <el-table-column label="确认时间" align="center" width="120" prop="confirmTime"/>
          <el-table-column label="确认人" align="center" width="100" prop="confirmor"/>
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
                        <div style="font-size:0.5cm;" class="cell">工艺分类</div>
                      </th>
                      <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666;">
                        <div style="font-size:0.5cm;" class="cell">当前选中片数</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in infoList" :key="index">
                      <td colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666">
                        <div class="cell">{{ item.batchNo }}</div>
                      </td>
                      <td colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666">
                        <div class="cell">{{ item.productModel }}</div>
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
                  <div class="cell">{{ index + 1 }}</div>
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
        <el-button v-if="isActive === 0" type="primary" @click="prints()">打印</el-button>
        <el-button v-if="isActive === 0" type="primary" @click="submitWrok()">确认</el-button>
        <el-button v-if="isActive === 0" type="primary" @click="addDialogVisible = false">取消</el-button>
        <el-button v-show="isShowMenu['xpproductionManage-back-printlabel']" v-if="isActive === 1" type="primary" @click="printLabel()">打印标签</el-button>
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
        <!-- <div v-if="currentCardType === 2" style="font-size: 26px;margin: 15px">后段工序随原流程卡进行！</div> -->
        <div class="module-content">
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
  .app-container{
    position: relative;
    height: calc(100vh - 310px);
  }
  .app-container>>> .el-table--border {
    border-top: 2px solid #009494;
  }
  .tip-out-inner-dialog>>>.el-checkbox{
    margin-left: 20px;
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
  .run-table ::-webkit-scrollbar {/*滚动条整体样式*/
    height: 10px !important;
  }
</style>
