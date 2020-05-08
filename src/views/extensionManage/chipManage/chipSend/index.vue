<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto">
      <div class="header-btn-group">
        <el-button
          size="small"
          type="primary"
          @click="tipAdd"
        ><svg-icon icon-class="add"/> 新 增</el-button>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-edit"
          @click="tipEdit"
        >修 改</el-button>
        <el-button
          size="small"
          type="primary"
          @click="report"
        ><svg-icon icon-class="baobiaofenx"/> 报 表</el-button>
        <el-button
          size="small"
          type="danger"
          icon="el-icon-delete"
          @click="deleteLIT"
        > 删 除</el-button>
        <el-button
          size="small"
          type="primary"
          @click="exportAll"
        ><svg-icon icon-class="export"/> 导 出</el-button>
        <!-- <el-button
          size="small"
          class="float-right"
          type="danger"
          icon="el-icon-delete"
        > 删 除</el-button>
        <el-button
          size="small"
          class="float-right"
          type="primary"
          icon="el-icon-edit"
        >修改信息</el-button> -->
      </div>
      <div class="search-box">
        <div class="left-search-box">
          <div class="input-item">
            <span class="input-title" style="margin-left: -25px;">单号 </span>
            <el-input v-model="billNo" class="search-input" placeholder="请输入单号" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">版型 </span>
            <el-select v-model="editionType" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in editionTypeSelectOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">结构类型 </span>
            <el-select v-model="structureType" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in structureTypeSelectOptions"
                :key="item.id"
                :label="item.name"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">衬底工艺 </span>
            <el-select v-model="substrateType" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in checkStatusOptions"
                :key="item.id"
                :label="item.name"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">审核状态 </span>
            <el-select v-model="auditResult" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in examineSelectOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">送片人 </span>
            <el-select v-model="creatorName" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">日期 </span>
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
        </div>
        <div class="right-btn-box">
          <el-button
            class="float-right margin-top margin-left"
            size="small"
            type="danger"
            @click="clearButton"
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
      <div class="table-top-btn-group">
        <div
          :class="{'active':isActive === 0}"
          @click="navClick(0)"
        >
          单据信息
        </div>
        <div
          :class="{'active':isActive === 1}"
          @click="navClick(1)"
        >
          明细TOL： <span v-text="anothertotalPage"/>
        </div>
      </div>
      <!--run信息-->
      <el-table
        v-loading="listLoading"
        v-show="isActive === 0"
        ref="listTabel"
        :data="list"
        class="mocvd-table firstTab run-table broad-scrollbar-table"
        height="calc(100vh - 422px)"
        element-loading-text="拼命加载中"
        highlight-current-row
        border
        fit
        @current-change="handleCurrentChange"
        @cell-dblclick="cellDblclick"
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
          </template>
        </el-table-column>
        <el-table-column label="单号" align="center" prop="billNo" width="120"/>
        <el-table-column label="验证版型" align="center" prop="editionType" width="120"/>
        <el-table-column label="结构类型" align="center" prop="structureType" width="120"/>
        <el-table-column label="衬底工艺" align="center" prop="substrateType" width="120"/>
        <el-table-column label="单据状态" align="center" prop="operation">
          <template slot-scope="scope">
            <span v-if="scope.row.operation === '0'">送片</span>
            <span v-if="scope.row.operation === '1'">送样</span>
            <span v-if="scope.row.operation === '2'">破坏测试</span>
          </template>
        </el-table-column>
        <el-table-column label="送片人" align="center" prop="creatorName"/>
        <el-table-column label="送片日期" align="center" prop="createTime" width="120" show-overflow-tooltip/>
        <el-table-column label="收片人" align="center" prop="takerName"/>
        <el-table-column label="收片日期" align="center" prop="takerTime" width="120" show-overflow-tooltip/>
        <el-table-column label="审核状态" align="center" prop="auditResult">
          <template slot-scope="scope">
            <span v-if="scope.row.auditResult === '1'" style="color: #009494;font-weight: bold">通过</span>
            <span v-if="scope.row.auditResult === '0'" style="color: #f33;font-weight: bold">不通过</span>
            <span v-if="scope.row.auditResult === '2'" style="color:#1C84C6;font-weight: bold">待审核</span>
          </template>
        </el-table-column>
        <el-table-column label="审核人" align="center" prop="auditorName"/>
        <el-table-column label="备注" align="center" prop="remark" width="200" show-overflow-tooltip/>
      </el-table>
      <!--wafer信息-->
      <el-table
        v-loading="listLoading"
        v-show="isActive === 1"
        :data="anotherlist"
        class="mocvd-table run-table broad-scrollbar-table"
        height="calc(100vh - 422px)"
        element-loading-text="拼命加载中"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="RunID" align="center" prop="runId"/>
        <el-table-column label="WaferID" align="center" prop="waferId"/>
        <el-table-column label="镭刻号" align="center" prop="laserMark"/>
        <el-table-column label="正面衬底" align="center" prop="frontSubstrate" width="160px"/>
        <el-table-column label="目检" align="center" prop="visualLevelCode"/>
        <el-table-column label="波长" align="center" prop="wavelength"/>
        <el-table-column label="STD" align="center" prop="std"/>
        <el-table-column label="控制片" align="center" prop="isControl">
          <template slot-scope="scope">
            <span v-if="scope.row.isControl === '1'">否</span>
            <span v-if="scope.row.isControl === '0'">是</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark"/>
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
      top="80px"
      class="tip-out-dialog"
      title="新增验证片单"
      width="1300px"
      @close="handleClose('tipOutForm')">
      <div style="margin-top: -25px;">
        <div class="title-postion">单据信息</div>
        <div class="module-content set-border">
          <el-form ref="tipOutForm" :model="tipOutForm" :rules="rules" status-icon label-width="100px" label-position="right">
            <el-row>
              <el-col :span="5">
                <el-form-item label="单号 " size="small">
                  <el-input v-model="tipOutForm.orderNum" :disabled="true" class="tip-out-input1"/>
                </el-form-item>
                <el-form-item label="送片人 " size="small">
                  <el-select v-model="tipOutForm.flatPerson" placeholder="请选择" filterable>
                    <el-option
                      v-for="item in userList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                      class="tip-out-input1"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="版型 " size="small">
                  <el-input v-model="tipOutForm.editionType" :disabled="true" class="tip-out-input1"/>
                </el-form-item>
                <el-form-item label="送片日期 " size="small">
                  <el-date-picker
                    v-model="tipOutForm.flatDate"
                    class="tip-out-input"
                    placeholder="选择时间"
                    @change="billNoclick"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="衬底工艺 " size="small">
                  <el-input v-model="tipOutForm.substrateType" :disabled="true" class="tip-out-input1"/>
                </el-form-item>
                <el-form-item label="操作 " size="small">
                  <el-select v-model="tipOutForm.operation" placeholder="请选择" filterable>
                    <el-option
                      v-for="item in operationList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                      class="tip-out-input1"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="结构类型 " size="small">
                  <el-input v-model="tipOutForm.structureType" :disabled="true" class="tip-out-input1"/>
                </el-form-item>
                <el-form-item label="备注 " size="small">
                  <el-input v-model="tipOutForm.remark" maxlength="50" class="tip-out-input1" style="width: 315px;"/>
                </el-form-item>
              </el-col>
              <el-col :span="2" style="text-align: right;">
                <el-button :disabled="isDisabled" type="primary" icon="el-icon-check" @click="submitForm('tipOutForm')">保 存</el-button>
                <!-- <el-button type="primary" @click="tipOut" style="margin-top: 7px;"><svg-icon icon-class="export"/> 导 出</el-button> -->
              </el-col>
            </el-row>
          </el-form>
        </div>
        <el-row>
          <el-col :span="15">
            <div class="title-postion">审核信息</div>
            <div class="module-content set-border" style="margin-right: 76px;">
              <div class="input-item set-margin" style="margin-left: 15px;">
                <span class="input-title">审核人 </span>
                <el-select v-model="auditor" :disabled="true" placeholder="请选择" size="small" style="width:120px;" filterable>
                  <el-option
                    v-for="item in userList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    class="tip-out-input1"/>
                </el-select>
              </div>
              <div class="input-item set-margin">
                <span class="input-title" style="width: 90px">审核日期 </span>
                <el-date-picker
                  v-model="auditorDate"
                  :disabled="true"
                  class="tip-out-input"
                  style="width:120px;"
                  placeholder="选择时间"
                  size="small"/>
              </div>
              <div class="input-item set-margin">
                <span class="input-title">审核结果 </span>
                <el-select v-model="auditorResult" :disabled="true" placeholder="请选择" size="small" style="width:120px;" filterable>
                  <el-option
                    v-for="item in examineSelectOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    class="tip-out-input1"/>
                </el-select>
              </div>
            </div>
          </el-col>
          <el-col :span="9">
            <div class="title-postion" style="width:65px">收片人</div>
            <div class="module-content set-border">
              <div class="input-item set-margin shoupian1">
                <span class="input-title">收片人 </span>
                <el-select v-model="receiver" :disabled="true" placeholder="请选择" size="small" class="tip-out-input1" filterable>
                  <el-option
                    v-for="item in userList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </div>
              <div class="input-item set-margin shoupiandate">
                <span class="input-title">收片日期 </span>
                <el-date-picker
                  v-model="receiverDate"
                  :disabled="true"
                  class="tip-out-input1"
                  placeholder="选择时间"
                  size="small"/>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row class="parameter-table" style="margin-top:15px">
          <el-col :span="14" style="width:56.5%">
            <el-table
              ref="leftList"
              :data="leftList"
              :row-class-name="lefttableRowClassColor"
              height="585px"
              class="leftList run-table broad-scrollbar-table"
              element-loading-text="拼命加载中"
              highlight-current-row
              border
              fit
              @cell-mouse-enter="lefthoverCall"
              @current-change="waferLeftChange"
            >
              <el-table-column align="center" label="序号" width="50">
                <template slot-scope="scope">
                  {{ scope.$index+1 }}
                </template>
              </el-table-column>
              <el-table-column label="RunID" align="center" prop="runId" width="120"/>
              <el-table-column label="WaferID" align="center" prop="waferId" width="120"/>
              <el-table-column label="镭刻号" align="center" prop="laserMark" width="120"/>
              <el-table-column label="目检" align="center" prop="visualLevelName"/>
              <el-table-column label="波长" align="center" prop="wavelength"/>
              <el-table-column label="STD" align="center" prop="std"/>
              <el-table-column label="控制片" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.isControl === '1'">否</span>
                  <span v-if="scope.row.isControl === '0'">是</span>
                </template>
              </el-table-column>
              <el-table-column label="正面衬底" align="center" prop="frontSubstrate" width="160px"/>
              <el-table-column label="备注" align="center" prop="remark"/>
              <el-table-column label="版型" align="center" prop="typeCode"/>
              <el-table-column label="结构类型" align="center" prop="structureCode"/>
              <el-table-column label="衬底工艺" align="center" prop="substrateCode"/>
            </el-table>
          </el-col>
          <el-col :span="1" class="centerste">
            <div style="margin-top: 250px;cursor: pointer;" @click="toLeft">
              <svg-icon icon-class="left"/>
            </div>
            <div style="cursor: pointer;" @click="toRight">
              <svg-icon icon-class="right"/>
            </div>
          </el-col>
          <el-col :span="9" class="right-margin">
            <div class="module-content set-border" style="padding: 10px;margin-top: 20px;">
              <div class="dsyzp" style="margin-top: 1px;">控制片库</div>
              <el-table
                ref="rightList"
                :data="rightList"
                class="run-table broad-scrollbar-table"
                style="margin-top:10px"
                element-loading-text="拼命加载中"
                highlight-current-row
                border
                fit
                @current-change="waferCurrentChange"
              >
                <el-table-column label="RunID" align="center" prop="runId" width="130px"/>
                <el-table-column label="WaferID" align="center" prop="waferId" width="130px"/>
                <el-table-column label="镭刻号" align="center" prop="laserMark" width="130px"/>
                <el-table-column label="目检" align="center" prop="visualLevelName"/>
                <el-table-column label="SWR" align="center" prop="swr"/>
              </el-table>
              <div class="btntext">
                <el-button type="primary" class="margin-left" style="margin-top:10px" size="small" @click="openControlFlat"><svg-icon icon-class="chenditoup"/> 控制片库</el-button>
              </div>
              <div class="dsyzp">待送验证片</div>
              <div class="set-margin1" style="margin-left: -15px">
                <span class="input-title" style="width:50px">机台 </span>
                <el-select v-model="machineValue" class="search-input" size="small" placeholder="请选择" filterable clearable @change="pendingSlice">
                  <el-option
                    v-for="item in machineOptions"
                    :key="item.id"
                    :label="item.code"
                    :value="item.code"/>
                </el-select>
                <el-button type="primary" class="float-right margin-left" size="small" @click="editSubstrateInfo"><svg-icon icon-class="chenditoupiansz"/> 正面衬底</el-button>
              </div>
              <el-table
                ref="rightshowList1"
                :data="rightshowList1"
                :row-class-name="tableRowClassColor"
                height="293px"
                style="width: 870px"
                class="waferTable run-table broad-scrollbar-table"
                element-loading-text="拼命加载中"
                highlight-current-row
                border
                fit
                @cell-mouse-enter="hoverCall"
                @current-change="waferCurrentChange1"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="55" fixed/>
                <el-table-column label="RunID" align="center" prop="runId" width="120"/>
                <el-table-column label="WaferID" align="center" prop="waferId" width="120"/>
                <el-table-column label="镭刻号" align="center" prop="laserMark" width="120"/>
                <el-table-column label="投片型号" align="center" prop="typeCode"/>
                <el-table-column label="SWR" align="center" prop="swr"/>
                <el-table-column label="目检" align="center" prop="visualLevelName"/>
                <el-table-column label="结构类型" align="center" prop="structureCode"/>
                <el-table-column label="衬底工艺" align="center" prop="substrateCode"/>
              </el-table>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-dialog
        :visible.sync="innerVisible"
        width="1000px"
        top="80px"
        class="tip-out-inner-dialog"
        title="控制片"
        append-to-body>
        <el-table
          :data="innerList"
          class="run-table broad-scrollbar-table"
          height="618px"
          element-loading-text="拼命加载中"
          highlight-current-row
          border
          fit
        >
          <el-table-column align="center" label="RunID">
            <template slot-scope="scope">
              {{ scope.row.runId }}
            </template>
          </el-table-column>
          <el-table-column label="WaferID" align="center" prop="waferId" width="120"/>
          <el-table-column label="镭刻号" align="center" prop="laserMark" width="120"/>
          <el-table-column label="目检" align="center" prop="visualLevelName"/>
          <el-table-column label="SWR" align="center" prop="swr"/>
          <el-table-column label="WP-AVR-C" align="center" prop="wpAvrC"/>
          <el-table-column label="操作" align="center" prop="">
            <template slot-scope="scope">
              <el-button type="primary" style="margin-top: 7px;" size="mini" @click="add(scope.row)"><svg-icon icon-class="add"/> 添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      top="80px"
      class="tip-out-dialog"
      title="修改验证片单"
      width="1300px"
      @close="handleClose('tipOutForm')">
      <div style="margin-top: -25px;">
        <div class="title-postion">单据信息</div>
        <div class="module-content set-border">
          <el-form ref="tipOutForm" :model="tipOutForm" :rules="rules" status-icon label-width="100px" label-position="right">
            <el-row>
              <el-col :span="5">
                <el-form-item label="单号 " size="small">
                  <el-input v-model="tipOutForm.orderNum" :disabled="true" class="tip-out-input1"/>
                </el-form-item>
                <el-form-item label="送片人 " size="small">
                  <el-select v-model="tipOutForm.flatPerson" :disabled="true" placeholder="请选择" filterable>
                    <el-option
                      v-for="item in userList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                      class="tip-out-input1"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="版型 " size="small">
                  <el-input v-model="tipOutForm.editionType" :disabled="true" class="tip-out-input1"/>
                </el-form-item>
                <el-form-item label="送片日期 " size="small">
                  <el-date-picker
                    :disabled="true"
                    v-model="tipOutForm.flatDate"
                    class="tip-out-input"
                    placeholder="选择时间"
                    @change="billNoclick"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="衬底工艺 " size="small">
                  <el-input v-model="tipOutForm.substrateType" :disabled="true" class="tip-out-input1"/>
                </el-form-item>
                <el-form-item label="操作 " size="small">
                  <el-select v-model="tipOutForm.operation" placeholder="请选择" filterable>
                    <el-option
                      v-for="item in operationList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                      class="tip-out-input1"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="结构类型 " size="small">
                  <el-input v-model="tipOutForm.structureType" :disabled="true" class="tip-out-input1"/>
                </el-form-item>
                <el-form-item label="备注 " size="small">
                  <el-input v-model="tipOutForm.remark" maxlength="50" class="tip-out-input1" style="width: 210px;"/>
                </el-form-item>
              </el-col>
              <el-col :span="2" style="text-align: right;">
                <el-button :disabled="isDisabled" type="primary" icon="el-icon-check" @click="editsubmitForm('tipOutForm')">保 存</el-button>
                <!-- <el-button type="primary" style="margin-top: 7px;" @click="exportAll"><svg-icon icon-class="export"/> 导 出</el-button> -->
              </el-col>
            </el-row>
          </el-form>
        </div>
        <el-row>
          <el-col :span="15">
            <div class="title-postion">审核信息</div>
            <div class="module-content set-border" style="margin-right: 76px;">
              <div class="input-item set-margin" style="margin-left: 15px;">
                <span class="input-title">审核人 </span>
                <el-select v-model="auditor" :disabled="true" placeholder="请选择" size="small" style="width:120px;" filterable>
                  <el-option
                    v-for="item in userList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    class="tip-out-input1"/>
                </el-select>
              </div>
              <div class="input-item set-margin">
                <span class="input-title" style="width：90px">审核日期 </span>
                <el-date-picker
                  v-model="auditorDate"
                  :disabled="true"
                  class="tip-out-input"
                  style="width:120px;"
                  placeholder="选择时间"
                  size="small"/>
              </div>
              <div class="input-item set-margin">
                <span class="input-title">审核结果 </span>
                <el-select v-model="auditorResult" :disabled="true" placeholder="请选择" size="small" style="width:120px;" filterable>
                  <el-option
                    v-for="item in examineSelectOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    class="tip-out-input1"/>
                </el-select>
              </div>
            </div>
          </el-col>
          <el-col :span="9">
            <div class="title-postion" style="width:65px">收片人</div>
            <div class="module-content set-border">
              <div class="input-item set-margin shoupian1">
                <span class="input-title">收片人 </span>
                <el-select v-model="receiver" :disabled="true" placeholder="请选择" size="small" class="tip-out-input1" filterable>
                  <el-option
                    v-for="item in userList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </div>
              <div class="input-item set-margin shoupiandate">
                <span class="input-title">收片日期 </span>
                <el-date-picker
                  v-model="receiverDate"
                  :disabled="true"
                  class="tip-out-input1"
                  placeholder="选择时间"
                  size="small"/>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row class="parameter-table" style="margin-top:15px">
          <el-col :span="14" style="width:56.5%">
            <el-table
              ref="leftList"
              :data="leftList"
              :row-class-name="lefttableRowClassColor"
              height="585px"
              class="leftList run-table broad-scrollbar-table"
              element-loading-text="拼命加载中"
              highlight-current-row
              border
              fit
              @cell-mouse-enter="lefthoverCall"
              @current-change="waferLeftChange"
            >
              <el-table-column align="center" label="序号" width="50">
                <template slot-scope="scope">
                  {{ scope.$index+1 }}
                </template>
              </el-table-column>
              <el-table-column label="RunID" align="center" prop="runId" width="120"/>
              <el-table-column label="WaferID" align="center" prop="waferId" width="120"/>
              <el-table-column label="镭刻号" align="center" prop="laserMark" width="120"/>
              <el-table-column label="目检" align="center" prop="visualLevelName"/>
              <el-table-column label="波长" align="center" prop="wavelength"/>
              <el-table-column label="STD" align="center" prop="std"/>
              <el-table-column label="控制片" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.isControl === '1'">否</span>
                  <span v-if="scope.row.isControl === '0'">是</span>
                </template>
              </el-table-column>
              <el-table-column label="正面衬底" align="center" prop="frontSubstrate" width="160px"/>
              <el-table-column label="备注" align="center" prop="remark"/>
              <el-table-column label="版型" align="center" prop="typeCode"/>
              <el-table-column label="结构类型" align="center" prop="structureCode"/>
              <el-table-column label="衬底工艺" align="center" prop="substrateCode"/>
            </el-table>
          </el-col>
          <el-col :span="1" class="centerste">
            <div style="margin-top: 250px;cursor: pointer;" @click="toLeft">
              <svg-icon icon-class="left"/>
            </div>
            <div style="cursor: pointer;" @click="toRight">
              <svg-icon icon-class="right"/>
            </div>
          </el-col>
          <el-col :span="9" class="right-margin">
            <div class="module-content set-border" style="padding: 10px;margin-top: 20px;">
              <div class="dsyzp" style="margin-top: 1px;">控制片库</div>
              <el-table
                ref="rightList"
                :data="rightList"
                class="run-table broad-scrollbar-table"
                style="margin-top:10px"
                element-loading-text="拼命加载中"
                highlight-current-row
                border
                fit
                @current-change="waferCurrentChange"
              >
                <el-table-column label="RunID" align="center" prop="runId"/>
                <el-table-column label="WaferID" align="center" prop="waferId"/>
                <el-table-column label="镭刻号" align="center" prop="laserMark"/>
                <el-table-column label="目检" align="center" prop="visualLevelName"/>
                <el-table-column label="SWR" align="center" prop="swr"/>
              </el-table>
              <div class="btntext">
                <el-button type="primary" class="margin-left" style="margin-top:10px" size="small" @click="openControlFlat"><svg-icon icon-class="chenditoup"/> 控制片库</el-button>
              </div>
              <div class="dsyzp">待送验证片</div>
              <div class="set-margin1" style="margin-left: -15px">
                <span class="input-title" style="width:50px">机台 </span>
                <el-select v-model="machineValue" class="search-input" size="small" placeholder="请选择" filterable @change="pendingSlice">
                  <el-option
                    v-for="item in machineOptions"
                    :key="item.id"
                    :label="item.code"
                    :value="item.code"/>
                </el-select>
                <el-button type="primary" class="float-right margin-left" size="small" @click="editSubstrateInfo"><svg-icon icon-class="chenditoupiansz"/> 正面衬底</el-button>
              </div>
              <el-table
                ref="rightshowList1"
                :data="rightshowList1"
                :row-class-name="tableRowClassColor"
                height="293px"
                style="width: 870px"
                class="waferTable broad-scrollbar-table"
                element-loading-text="拼命加载中"
                highlight-current-row
                border
                fit
                @cell-mouse-enter="hoverCall"
                @current-change="waferCurrentChange1"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="55" fixed/>
                <el-table-column label="RunID" align="center" prop="runId" width="120"/>
                <el-table-column label="WaferID" align="center" prop="waferId" width="120"/>
                <el-table-column label="镭刻号" align="center" prop="laserMark" width="120"/>
                <el-table-column label="投片型号" align="center" prop="typeCode"/>
                <el-table-column label="SWR" align="center" prop="swr"/>
                <el-table-column label="目检" align="center" prop="visualLevelName"/>
                <el-table-column label="结构类型" align="center" prop="structureCode"/>
                <el-table-column label="衬底工艺" align="center" prop="substrateCode"/>
              </el-table>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-dialog
        :visible.sync="innerVisible"
        width="1000px"
        top="80px"
        class="tip-out-inner-dialog"
        title="控制片"
        append-to-body>
        <el-table
          :data="innerList"
          height="618px"
          class="run-table broad-scrollbar-table"
          element-loading-text="拼命加载中"
          highlight-current-row
          border
          fit
        >
          <el-table-column align="center" label="RunID">
            <template slot-scope="scope">
              {{ scope.row.runId }}
            </template>
          </el-table-column>
          <el-table-column label="WaferID" align="center" prop="waferId"/>
          <el-table-column label="镭刻号" align="center" prop="laserMark"/>
          <el-table-column label="目检" align="center" prop="visualLevelName"/>
          <el-table-column label="SWR" align="center" prop="swr"/>
          <el-table-column label="WP-AVR-C" align="center" prop="wpAvpC"/>
          <el-table-column label="操作" align="center" prop="">
            <template slot-scope="scope">
              <el-button type="primary" style="margin-top: 7px;" size="mini" @click="add(scope.row)"><svg-icon icon-class="add"/> 添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="printDialogVisible"
      class="print-dialog"
      title="打印预览"
      width="1110px"
    >
      <el-form ref="deleagteForm" label-width="0px" label-position="right">&nbsp;</el-form>
      <div id="printDiv" ref="print">
        <div style="border:1px solid #000;width: 284mm;">
          <el-row style="margin: 0 10px;">
            <el-col :span="24">
              <div style="text-align:center;font-weight:bold;font-size:0.8cm;padding:10px 0">验证片送片单</div>
            </el-col>
          </el-row>
          <el-row style="margin:5px 10px;">
            <div style="width:30%;float:left;">
              <div style="margin-left: 15px;text-align:left;padding:5px 0;font-size:0.5cm;"><span style="font-weight:bold;">单号：</span>{{ rowInfo.billNo }}</div>
            </div>
            <div style="width:30%;float:left;">
              <div style="text-align:left;padding:5px 0;font-size:0.5cm;"><span style="font-weight:bold;">送片人：</span>{{ rowInfo.creatorName }}</div>
            </div>
            <div style="width:40%;float:left;">
              <div style="text-align:left;padding:5px 0;font-size:0.5cm;"><span style="font-weight:bold;">送片日期：</span>{{ rowInfo.createTime }}</div>
            </div>
          </el-row>
          <el-row style="margin:5px 10px;">
            <div style="width:30%;float:left;">
              <div style="margin-left: 15px;text-align:left;padding:5px 0;font-size:0.5cm;"><span style="font-weight:bold;">衬底工艺：</span>{{ rowInfo.substrateType }}</div>
            </div>
            <div style="width:30%;float:left;">
              <div style="text-align:left;padding:5px 0;font-size:0.5cm;"><span style="font-weight:bold;">审核人：</span>{{ rowInfo.auditorName }}</div>
            </div>
            <div style="width:40%;float:left;">
              <div style="text-align:left;padding:5px 0;font-size:0.5cm;"><span style="font-weight:bold;">审核日期：</span>{{ rowInfo.auditTime }}</div>
            </div>
          </el-row>
          <el-row style="margin:5px 10px;">
            <div style="width:15%;float:left;">
              <div style="margin-left: 15px;text-align:left;padding:5px 0;font-size:0.5cm;"><span style="font-weight:bold;">版型：</span>{{ rowInfo.editionType }}</div>
            </div>
            <div style="width:15%;float:left;">
              <div style="text-align:left;padding:5px 0;font-size:0.5cm;"><span style="font-weight:bold;">收片人：</span>{{ rowInfo.takerName }}</div>
            </div>
            <div style="width:35%;float:left;">
              <div style="text-align:left;padding:5px 0;font-size:0.5cm;"><span style="font-weight:bold;">收片日期：</span>{{ rowInfo.takerTime }}</div>
            </div>
            <div style="width:35%;float:left;">
              <div style="text-align:left;padding:5px 0;font-size:0.5cm;"><span style="font-weight:bold;">打印日期：</span>{{ rowInfo.printDate }}</div>
            </div>
          </el-row>
          <el-row style="margin: 10px;">
            <el-col :span="24">
              <div>
                <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" style="width: 278mm;" >
                  <thead>
                    <tr>
                      <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666;">
                        <div style="font-size:0.5cm;" class="cell">序号</div>
                      </th>
                      <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666;">
                        <div style="font-size:0.5cm;" class="cell">RunID</div>
                      </th>
                      <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666;">
                        <div style="font-size:0.5cm;" class="cell">WaferID</div>
                      </th>
                      <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666;">
                        <div style="font-size:0.5cm;" class="cell">镭刻号</div>
                      </th>
                      <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666;">
                        <div style="font-size:0.5cm;" class="cell">目检</div>
                      </th>
                      <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666;">
                        <div style="font-size:0.5cm;" class="cell">波长</div>
                      </th>
                      <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666;">
                        <div style="font-size:0.5cm;" class="cell">STD</div>
                      </th>
                      <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666;">
                        <div style="font-size:0.5cm;" class="cell">控制片</div>
                      </th>
                      <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666;">
                        <div style="font-size:0.5cm;" class="cell">备注</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in anotherlist" :key="item.id">
                      <td colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666">
                        <div class="cell">{{ index + 1 }}</div>
                      </td>
                      <td colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666">
                        <div class="cell">{{ item.runId }}</div>
                      </td>
                      <td colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666">
                        <div class="cell">{{ item.waferId }}</div>
                      </td>
                      <td colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666">
                        <div class="cell">{{ item.laserMark }}</div>
                      </td>
                      <td colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666">
                        <div class="cell">{{ item.visualLevelCode }}</div>
                      </td>
                      <td colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666">
                        <div class="cell">{{ item.wavelength }}</div>
                      </td>
                      <td colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666">
                        <div class="cell">{{ item.std }}</div>
                      </td>
                      <td colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666">
                        <div class="cell">
                          <span v-if="item.isControl === '1'">否</span>
                          <span v-if="item.isControl === '0'">是</span>
                        </div>
                      </td>
                      <td colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666">
                        <div class="cell">{{ item.remark }}</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="printDiv()">打 印</el-button>
        <el-button @click="printDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .inner-right{
    height: 655px;
    margin-left: 20px;
    border-left: 1px solid #e2e2e2;
    padding-left: 20px;
  }
  .dialog-btn-group{
    position: absolute;
    top: 52px;
    right: 20px;
  }
  .wafer-box{
    overflow: hidden;
    width: 434px;
    border:1px solid #b0dede;
    border-right: none;
    border-bottom: none;
  }
  .wafer-box-modal{
    position: absolute;
    width: 70%;
    height: 65%;
    top: 0;
    left: 365px;
  }
  .wafer{
    float: left;
    width: 47px;
    height: 47px;
    border: 1px solid #b0dede;
    border-top: none;
    border-left: none;
    line-height: 45px;
    text-align: center;
    cursor: pointer;
  }
  .wafer.active{
    background: #009494;
    color: #fff;
  }
  .tip-out-input{
    width: 199px;
  }
  .tip-out-input1{
    width: 129px;
  }
  .search-box{
    display: flex;
    flex-direction: row;
  }
  .left-search-box{
    flex-grow: 1;
  }
  .right-btn-box{
    width: 210px;
  }
  .input-item{
    float: left;
    margin-top: 14px;
    margin-right: 10px;
  }
  .search-input{
    width: 140px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 308px);
  }
  .input-title{
    width: 70px;
  }
  .app-container>>> .el-table--border {
    border-top: 2px solid #009494;
  }
  .mocvd-table ::-webkit-scrollbar {/*滚动条整体样式*/
    height: 10px !important;
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
  .tip-out-dialog>>>.el-dialog__body,
  .tip-out-inner-dialog>>>.el-dialog__body{
    padding-bottom: 20px;
    user-select: none;
  }
  .tip-out-inner-dialog>>>.el-dialog__body{
    padding-top: 20px;
  }
  .tip-out-inner-dialog>>>.el-checkbox{
    margin: 0;
  }
  /*.tip-out-inner-dialog>>> .cell{*/
    /*line-height: 45px;*/
  /*}*/
  /*.tip-out-inner-dialog>>> td{*/
    /*height: 45px;*/
  /*}*/
  .table-title{
    font-size: 15px;
    font-weight: bold;
    margin: 10px 0;
  }
  .module-content{
    padding-left: 0;
  }
  .title-postion{
    top: 13px;
    background: #fff;
    z-index: 15;
    position: relative;
    width: 85px;
    padding: 5px;
    left: 16px;
    font-weight: bold;
    font-size: 14px;
    text-align: center;
  }
  .set-border{
    border: 1px solid rgb(220, 223, 230);
    padding-top: 20px;
    padding-bottom: 0px;
  }
  .set-margin{
    margin-top: 0px;
    margin-bottom: 15px;
  }
  .set-margin1{
    margin-top: 2px;
    margin-bottom: 10px;
  }
  .right-margin{
    margin-top: -20px;
  }
  .shoupian1{
    margin-left: 5px;
    margin-right: 15px;
  }
  .shoupiandate{
    margin-left: 0px;
    margin-right: 0px;
  }
  /* .waferTable>>>.el-table__body-wrapper tr{
    cursor: pointer;
  }
  .leftList>>>.el-table__body-wrapper tr{
    cursor: pointer;
  }
  .firstTab>>>.el-table__body-wrapper tr{
    cursor: pointer;
  } */
  .parameter-table>>>.el-table .set_green td{
    background-color: #cceaea;
  }
  .run-table ::-webkit-scrollbar {/*滚动条整体样式*/
    height: 10px !important;
  }
  .dsyzp{
    border-left: 3px solid rgb(0, 148, 148);
    height: 15px;
    padding-left: 5px;
    font-size: 14px;
    font-weight: bold;
    margin: 15px 15px 15px 3px;
  }
  .right-margin>>>.el-table__empty-text{
    line-height: 40px
  }
  .right-margin>>>.el-table__empty-block{
    min-height: 40px;
  }
  .btntext{
    width:100%;
    text-align:right;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 15px;
  }
  .centerste{
    width:6%;
    text-align: center;
    font-size: 36px;
    color: #009494
  }
  .waferTable >>> .el-checkbox {
    margin-left: 19px;
  }
</style>
