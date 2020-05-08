<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 5px">
      <div class="input-item">
        <span class="input-title">订单编号</span>
        <el-input v-model="searchKeys.ddbh" class="search-input" placeholder="请输入订单编号" size="small" maxlength="20" clearable/>
      </div>
      <div class="input-item">
        <span class="input-title">出库单号</span>
        <el-input v-model="searchKeys.ckdh" class="search-input" placeholder="请输入出库单号" size="small" maxlength="20" clearable/>
      </div>
      <div class="input-item">
        <span class="input-title" style="width: 80px;">客制化标准</span>
        <el-select v-model="searchKeys.kzh" class="search-input" size="small" placeholder="请选择" filterable clearable>
          <el-option
            v-for="item in custormizationList"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </div>
      <div class="input-item">
        <span class="input-title">客户名称</span>
        <el-select v-model="searchKeys.khmc" class="search-input" size="small" placeholder="请选择" filterable clearable>
          <el-option
            v-for="item in customerList"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </div>
      <div class="input-item">
        <span class="input-title">片型</span>
        <el-select v-model="searchKeys.px" class="search-input" size="small" placeholder="请选择" filterable clearable>
          <el-option
            v-for="item in sliceTypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </div>
      <div class="input-item">
        <span class="input-title">产品型号</span>
        <el-select v-model="searchKeys.cpxh" class="search-input" size="small" placeholder="请选择" filterable clearable>
          <el-option
            v-for="item in productCodeList"
            :key="item.code"
            :label="item.code"
            :value="item.code"/>
        </el-select>
      </div>
      <div class="input-item">
        <span class="input-title">任务状态</span>
        <el-select v-model="searchKeys.status" class="search-input" size="small" placeholder="请选择" filterable clearable>
          <el-option
            v-for="item in statusOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </div>
      <div class="input-item">
        <el-radio-group v-model="timeRadio">
          <el-radio :label="1">出库日期</el-radio>
          <el-radio :label="2">审核日期</el-radio>
        </el-radio-group>
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
          Wafer信息TOL: <span v-text="waferTol"/>
        </div>
        <el-button
          class="float-right"
          size="mini"
          type="primary"
          @click="handleExport"
        ><svg-icon icon-class="export"/> 导出</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        v-show="isActive === 0"
        ref="billTable"
        :data="list"
        :row-style="orderRowStyle"
        height="87%"
        class="broad-scrollbar-table"
        element-loading-text="拼命加载中"
        border
        fit
        highlight-current-row
        @row-click="rowClick"
      >
        <el-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="订单编号" align="center" prop="orderNo" width="120" show-overflow-tooltip fixed/>
        <el-table-column label="出库单号" align="center" prop="outNo" width="120" show-overflow-tooltip fixed/>
        <el-table-column label="客户名称" align="center" prop="customer" width="80" show-overflow-tooltip/>
        <el-table-column label="客制化规则" align="center" prop="ruleName" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <div style="text-decoration: underline;color: #009494;cursor: pointer;" @click="watchCustorm(scope.row.ruleName)">{{ scope.row.ruleName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="产品型号" align="center" prop="modelName" width="100" show-overflow-tooltip/>
        <el-table-column label="片型" align="center" prop="pattern" width="60" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.pattern === 1" style="font-weight: bold;color: #f56c6c">方片</span>
            <span v-if="scope.row.pattern === 0" style="font-weight: bold;color: #009494">圆片</span>
          </template>
        </el-table-column>
        <el-table-column label="包数" align="center" prop="box" width="50" show-overflow-tooltip/>
        <el-table-column label="波长" align="center" prop="bc" width="100" show-overflow-tooltip/>
        <el-table-column label="亮度" align="center" prop="ld" width="100" show-overflow-tooltip/>
        <el-table-column label="电压" align="center" prop="dy" width="100" show-overflow-tooltip/>
        <el-table-column label="数量(片)" align="center" prop="count" width="80" show-overflow-tooltip/>
        <el-table-column label="数量(K)" align="center" prop="outCount" width="100" show-overflow-tooltip/>
        <el-table-column label="出库人" align="center" prop="creator" width="100" show-overflow-tooltip/>
        <el-table-column label="出库时间" align="center" prop="createTime" width="120" show-overflow-tooltip/>
        <el-table-column label="审核人" align="center" prop="auditor" width="100" show-overflow-tooltip/>
        <el-table-column label="审核时间" align="center" prop="auditTime" width="120" show-overflow-tooltip/>
        <el-table-column label="检验记录" align="center" prop="taskModel" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <div style="text-decoration: underline;color: #009494;cursor: pointer;" @click="viewDetail(scope.row)">查看详情</div>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" width="120" show-overflow-tooltip/>
        <el-table-column label="任务状态" align="center" prop="status" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.status === '待审核'" style="color:#ee7e31;font-weight:bold">待审核</span>
            <span v-if="scope.row.status === '通过'" style="color:#1ABC9C;font-weight:bold">通过</span>
            <span v-if="scope.row.status === '不通过'" style="color:#E25D5D;font-weight:bold">不通过</span>
            <span v-if="scope.row.status === '审核中'" style="color:#e27a51;font-weight:bold">审核中</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status === '待审核' || scope.row.status === '审核中'" type="danger" style="background: #ed7d31; border-color: #ed7d31" size="mini" @click="handleExamine(scope.row, 1)"><svg-icon icon-class="kaishi"/> 审核</el-button>
            <el-button v-if="scope.row.status === '通过'" type="primary" size="mini" style="background: #ed7d31!important;border-color: #ed7d31!important " @click="handleExamine(scope.row)"><svg-icon icon-class="chongzhisx"/> 反审</el-button>
            <el-button v-if="scope.row.status === '不通过' || scope.row.status === '通过'" type="primary" size="mini" @click="handleExamine(scope.row)"><svg-icon icon-class="chaxun"/> 查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--wafer信息-->
      <el-table
        v-show="sliceType === 0 && isActive === 1"
        :data="waferList"
        height="94%"
        class="broad-scrollbar-table"
        element-loading-text="拼命加载中"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="WaferID" align="center" prop="code" width="180" fixed show-overflow-tooltip/>
        <el-table-column label="TapeNo" align="center" prop="tapeNo" width="140" show-overflow-tooltip/>
        <el-table-column v-for="item in formTheadStore" v-if="item.thName !== 'WaferID'&&item.thName !== 'TapeNo'" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[item.thKey] }}
          </template>
        </el-table-column>
        <el-table-column v-for="item in reservedFields" :key="item.id" :label="item.name" :prop="item.code" width="120" align="center" show-overflow-tooltip/>
        <el-table-column v-for="item in formTheadStoreParams" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[item.thKey] }}
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-show="sliceType === 1 && isActive === 1"
        :data="waferList"
        height="94%"
        class="broad-scrollbar-table"
        element-loading-text="拼命加载中"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="ChipNo" align="center" prop="code" width="180" fixed show-overflow-tooltip/>
        <el-table-column label="TapeNo" align="center" prop="tapeNo" width="140" show-overflow-tooltip/>
        <el-table-column v-for="item in formTheadfStore" v-if="item.thName !== 'ChipNo'&&item.thName !== 'TapeNo'" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[item.thKey] }}
          </template>
        </el-table-column>
        <el-table-column v-for="item in reservedFields" :key="item.id" :label="item.name" :prop="item.code" width="120" align="center" show-overflow-tooltip/>
        <el-table-column v-for="item in formTheadfStoreParams" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[item.thKey] }}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-show="isActive === 0"
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
    <!--审核弹窗-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="examineDialogVisible"
      :class="{'set-height':auditStaus === '通过'}"
      title="审核"
      class="padding-dialog"
      width="1360px"
      top="80px"
      @close="handleClose">
      <el-row :gutter="15">
        <el-col :span="4">
          <div class="module-title-text">审核结果</div>
          <div class="module">
            <div style="padding: 0 10px">
              <div v-if="auditStaus === '待审核'" class="examine-status">待审核</div>
              <div v-if="auditStaus === '通过'" class="examine-status" style="color: #009494">通过</div>
              <div v-if="auditStaus === '不通过'" class="examine-status" style="color: #E25D5D">不通过</div>
              <div v-if="auditStaus === '审核中'" class="examine-status" style="color: #e27a51">审核中...</div>
            </div>
            <div style="height: 455px;padding: 10px; overflow-y: auto" v-html="outResultData"/>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="module-title-text">出库单信息</div>
          <div class="module" style="padding-top: 10px">
            <el-form ref="viewForm" :model="viewForm" size="small" status-icon label-width="100px" label-position="right">
              <el-form-item label="客户名称">
                <el-input v-model="viewForm.khmc" :disabled="true" class="dialog-input" size="mini"/>
              </el-form-item>
              <el-form-item label="订单号">
                <el-input v-model="viewForm.ddh" :disabled="true" class="dialog-input" size="mini"/>
              </el-form-item>
              <el-form-item label="出库单号">
                <el-input v-model="viewForm.ckdh" :disabled="true" class="dialog-input" size="mini"/>
              </el-form-item>
              <el-form-item label="产品型号">
                <el-input v-model="viewForm.cpxh" :disabled="true" class="dialog-input" size="mini"/>
              </el-form-item>
              <el-form-item label="片型">
                <el-input v-model="viewForm.px" :disabled="true" class="dialog-input" size="mini"/>
              </el-form-item>
              <el-form-item label="包数">
                <el-input v-model="viewForm.bs" :disabled="true" class="dialog-input" size="mini"/>
              </el-form-item>
              <el-form-item label="出库数量(片)">
                <el-input v-model="viewForm.ckslp" :disabled="true" class="dialog-input" size="mini"/>
              </el-form-item>
              <el-form-item label="出库数量(K)">
                <el-input v-model="viewForm.ckslk" :disabled="true" class="dialog-input" size="small"/>
              </el-form-item>
              <el-form-item label="出库人">
                <el-input v-model="viewForm.ckr" :disabled="true" class="dialog-input" size="mini"/>
              </el-form-item>
              <el-form-item label="出库时间">
                <el-input v-model="viewForm.cksj" :disabled="true" class="dialog-input" size="mini"/>
              </el-form-item>
              <el-form-item label="审核人">
                <el-input v-model="viewForm.shr" :disabled="true" class="dialog-input" size="mini"/>
              </el-form-item>
              <el-form-item label="审核时间">
                <el-input v-model="viewForm.shsj" :disabled="true" class="dialog-input" size="mini"/>
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="viewForm.remark" :disabled="auditStaus === '不通过'" :rows="6" type="textarea" maxlength="50" class="dialog-input" size="mini"/>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="15">
          <div class="module-title-text" style="float: left;">包信息</div>
          <span class="float-right" style="margin-top: 15px">
            检验比例：{{ selectedRunRow.percent }}%  <span style="margin-left: 30px">检验片数：</span>{{ selectedRunRow.applyCount }}
            <span style="margin-left: 30px">已检片数：</span> {{ checkCount }}
          </span>
          <div class="module clear-both" style="padding: 10px;">
            <div class="input-item" style="margin-top: 0;margin-bottom: 8px;margin-right: 10px">
              <span class="input-title" style="width: 35px">包号</span>
              <el-select v-model="boxNo" class="search-input" style="width: 80px" size="mini" placeholder="请选择" filterable @change="boxChange" @focus="boxFocus">
                <el-option
                  v-for="item in boxNoOptions"
                  :key="item.box"
                  :label="item.box"
                  :value="item.box"/>
              </el-select>
            </div>
            <div v-for="item in outParamList" :key="item.param" class="input-item" style="margin-right: 5px;margin-top: 6px">
              <span style="font-weight: bold">{{ item.param }}：</span>
              <span style="margin-right: 15px">{{ item.rule }}</span>
            </div>
            <el-button
              v-if="paramList.length > 3"
              class="float-right"
              size="mini"
              type="primary"
              @click="showMoreParams"
            >
              更多
            </el-button>
            <div class="cut-line"/>
            <div class="input-item" style="margin-top: 10px;margin-bottom: 8px;margin-right: 40px">
              <span class="input-title" style="width: 62px">外观判定</span>
              <el-radio-group :disabled="auditStaus === '不通过' || auditStaus === '通过'" v-model="wgRadio">
                <el-radio :label="0">OK</el-radio>
                <el-radio :label="1">NG</el-radio>
              </el-radio-group>
            </div>
            <div class="input-item" style="margin-top: 10px;margin-bottom: 8px">
              <span class="input-title" style="width: 62px">包装判定</span>
              <el-radio-group :disabled="auditStaus === '不通过' || auditStaus === '通过'" v-model="bzRadio">
                <el-radio :label="0">OK</el-radio>
                <el-radio :label="1">NG</el-radio>
              </el-radio-group>
            </div>
            <div class="input-item" style="margin-top: 10px;margin-bottom: 8px;margin-right: 0px">
              <span class="input-title" style="width: 62px">光参判定</span>
              <el-radio-group :disabled="auditStaus === '不通过' || auditStaus === '通过'" v-model="gcRadio">
                <el-radio :label="0">OK</el-radio>
                <el-radio :label="1" class="ng">NG</el-radio>
              </el-radio-group>
            </div>
            <div class="cut-line"/>
            <div class="input-item" style="margin-right: 30px;margin-top: 10px;">
              <span class="input-title" style="width: 50px"> Total </span>
              <el-input :disabled="true" v-model="boxWaferList.length" class="search-input" style="width: 60px;" size="mini"/>
              <span class="fontBold" >片</span>
              <el-input :disabled="true" v-model="chipCount" class="search-input" style="width: 100px;" size="mini"/>
              <span class="fontBold" >颗</span>
            </div>
            <div class="input-item" style="margin-right: 10px;margin-top: 10px;">
              <span class="input-title" style="width: 80px;"><svg-icon icon-class="tiaomasm" style="color: #009494"/> 片号扫描 </span>
              <el-input :disabled="auditStaus === '不通过' || auditStaus === '通过'" v-model="waferNo" class="search-input" style="width: 214px;" size="mini" maxlength="30" clearable @keyup.enter.native="handleSelectItem"/>
            </div>
            <div class="input-item" style="margin-right: 0px;margin-top: 10px;margin-bottom: 10px">
              <el-button
                :disabled="auditStaus === '不通过' || auditStaus === '通过'"
                size="mini"
                type="primary"
                @click="fullScan"
              >
                <svg-icon icon-class="tiaomasm"/> 一键全扫
              </el-button>
            </div>
            <el-table
              v-show="sliceType === 0"
              id="tableList"
              ref="tableList"
              :data="boxWaferList"
              :row-style="rowStyle"
              :key="tableKey"
              height="450"
              class="broad-scrollbar-table"
              element-loading-text="拼命加载中"
              border
              fit
            >
              <el-table-column align="center" label="序号" width="50" fixed>
                <template slot-scope="scope">
                  {{ (pageNum - 1) * pageSize + scope.$index+1 }}
                </template>
              </el-table-column>
              <el-table-column label="ChipNo" align="center" prop="code" width="180" fixed show-overflow-tooltip/>
              <el-table-column label="TapeNo" align="center" prop="tapeNo" width="140" show-overflow-tooltip/>
              <el-table-column v-for="item in formTheadStore" v-if="item.thName !== 'ChipNo'&&item.thName !== 'TapeNo'" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row[item.thKey] }}
                </template>
              </el-table-column>
              <el-table-column v-for="item in reservedFields" :key="item.id" :label="item.name" :prop="item.code" width="120" align="center" show-overflow-tooltip/>
              <el-table-column v-for="item in formTheadStoreParams" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row[item.thKey] }}
                </template>
              </el-table-column>
            </el-table>
            <el-table
              v-show="sliceType === 1"
              ref="tableList"
              :data="boxWaferList"
              :row-style="rowStyle"
              :key="tableKey2"
              height="450px"
              class="broad-scrollbar-table"
              element-loading-text="拼命加载中"
              border
              fit
            >
              <el-table-column align="center" label="序号" width="50" fixed>
                <template slot-scope="scope">
                  {{ (pageNum - 1) * pageSize + scope.$index+1 }}
                </template>
              </el-table-column>
              <el-table-column label="ChipNo" align="center" prop="code" width="180" fixed show-overflow-tooltip/>
              <el-table-column label="TapeNo" align="center" prop="tapeNo" width="140" show-overflow-tooltip/>
              <el-table-column v-for="item in formTheadfStore" v-if="item.thName !== 'ChipNo'&&item.thName !== 'TapeNo'" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row[item.thKey] }}
                </template>
              </el-table-column>
              <el-table-column v-for="item in reservedFields" :key="item.id" :label="item.name" :prop="item.code" width="120" align="center" show-overflow-tooltip/>
              <el-table-column v-for="item in formTheadfStoreParams" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row[item.thKey] }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
      <div v-if="auditStaus === '通过'" class="float-right" style="height: 57px;margin-top: 15px">
        <span style="line-height: 50px;font-weight: bold;margin-right: 10px">反审原因</span>
        <el-input v-model="reverseReason" style="width: 715px;" type="textarea" maxlength="200"/>
      </div>
      <div class="clear-both"/>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="auditStaus === '待审核' || auditStaus === '审核中'" :disabled="setDisable()" type="primary" @click="submitForm('')">审核完成</el-button>
        <el-button v-if="auditStaus === '待审核' || auditStaus === '审核中'" :disabled="boxWaferList.length === 0" type="primary" @click="submitForm(4)">确 定</el-button>
        <el-button v-if="auditStaus === '通过'" type="primary" @click="submitForm(3)">反 审</el-button>
        <el-button @click="cancelSubmit">取 消</el-button>
      </span>
    </el-dialog>
    <!--检验记录-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="viewDetailDialogVisible"
      title="检验记录"
      class="padding-dialog"
      width="800px"
      top="100px"
    >
      <div class="input-item" style="margin-bottom: 10px">
        <span class="input-title">出库单号:</span>
        <span>{{ selectedRunRow.outNo }}</span>
      </div>
      <div class="input-item">
        <span class="input-title">总片数:</span>
        <span>{{ selectedRunRow.count }}</span>
      </div>
      <div class="input-item">
        <span class="input-title">抽检比例:</span>
        <span>{{ selectedRunRow.percent }}</span>%
      </div>
      <div class="input-item">
        <span class="input-title">抽检片数:</span>
        <span>{{ checkCount }}</span>
      </div>
      <div class="input-item">
        <span class="input-title">抽检结果:</span>
        <span v-if="selectedRunRow.status === '待审核'" style="color:#ee7e31;font-weight:bold">待审核</span>
        <span v-if="selectedRunRow.status === '通过'" style="color:#1ABC9C;font-weight:bold">通过</span>
        <span v-if="selectedRunRow.status === '不通过'" style="color:#E25D5D;font-weight:bold">不通过</span>
        <span v-if="selectedRunRow.status === '审核中'" style="color:#e27a51;font-weight:bold">审核中</span>
      </div>
      <el-table
        :data="recordList"
        height="550"
        class="broad-scrollbar-table margin-top"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ (pageDialogNum - 1) * pageDialogSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="包号" align="center" prop="box" show-overflow-tooltip width="150"/>
        <el-table-column label="检验结果" align="center" prop="status" show-overflow-tooltip width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 3" style="font-weight: bold;color: #f56c6c">不通过</span>
            <span v-if="scope.row.status === 2" style="font-weight: bold;color: #009494">通过</span>
          </template>
        </el-table-column>
        <el-table-column label="不通过类型" align="center" prop="reason" show-overflow-tooltip/>
      </el-table>
      <el-pagination
        :current-page="pageDialogNum"
        :page-sizes="[15, 25, 50]"
        :page-size="pageDialogSize"
        :total="totalDialogPage"
        class="pagination"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="recordSizeChange"
        @current-change="recordCurrentChange"
      />
    </el-dialog>
    <!--检验记录-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="showMoreParamsVisable"
      title="全部参数"
      class="padding-dialog params-dialog"
      width="800px"
      top="100px"
    >
      <el-table
        :data="paramList"
        height="500"
        class="broad-scrollbar-table margin-top"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="参数名称" align="center" prop="param" show-overflow-tooltip/>
        <el-table-column label="参数范围" align="center" prop="rule" show-overflow-tooltip/>
      </el-table>
    </el-dialog>
    <custormizatoin-dia
      :disabled="true"
      :row="custormForm"
      :is-row="2"
      :table-key="1"
      :customer-list="customerList"
      :add-dialog-visible="kzhDialogVisible"
      dialog-title="客制化规则"
      @dialogFalse="kzhDialogVisible = false"/>
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
    margin-top: 14px;
    margin-right: 10px;
  }
  .search-input{
    width: 120px;
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
  .padding-dialog>>> .el-dialog__body {
    height: 660px;
    overflow: auto;
    padding-top: 0px;
  }
  .set-height.padding-dialog>>> .el-dialog__body {
    height: 730px;
    overflow: auto;
    padding-top: 0px;
  }
  .params-dialog.padding-dialog>>> .el-dialog__body {
    height: auto;
    overflow: auto;
    padding-top: 10px;
  }
  .ng>>> .el-radio__input.is-checked + .el-radio__label {
    color: #ff3a47 !important;
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
  .app-container>>> .cell{
    line-height: 33px;
  }
  .app-container>>> td{
    height: 33px;
  }
  .padding-dialog>>> .cell{
    line-height: 28px;
  }
  .padding-dialog>>> td{
    height: 28px;
  }
  .padding-dialog>>> .el-dialog__footer{
    padding-top: 0;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 250px);
  }
  .module-title-text{
    float: none;
  }
  .module-title {
    margin-bottom: 10px;
  }
  .search-input{
    width: 186px;
  }
  .dialog-input{
    width: 150px;
  }
  .el-form-item--small.el-form-item {
    margin-bottom: 11px;
  }
  .padding-dialog>>> .el-dialog__footer{
    /*text-align: center;*/
  }
  .padding-dialog>>> .el-checkbox {
    margin-left: 138px;
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
  .module{
    position: relative;
    border: 1px solid #e2e2e2;
    height: 598px;
    width: 100%;
    margin-top: 10px;
    padding-top: 15px;
  }
  .module>>> .el-radio{
    margin-right: 19px;
  }
  .moduleTitle{
    position: absolute;
    top: -13px;
    left: 16px;
    background: #fff;
    padding: 5px 15px;
    font-weight: bold;
    font-size: 14px;
    text-align: center;
  }
  .examine-status{
    text-align: center;
    font-size: 46px;
    line-height: 120px;
    font-weight: bold;
    color: rgb(255,153,0);
    border-bottom: 1px solid #e2e2e2;
  }
  .select-thead-btn{
    height: 42px;
    position: absolute;
    z-index: 200;
    right: 20px;
    top: 15px;
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
  .select-thead{
    width: 200px;
    height: 335px;
    border: 1px solid #e2e2e2;
    position: absolute;
    z-index: 200;
    background: #fff;
    right: 15px;
    top: 45px;
  }
  .el-form-item--small.el-form-item{
    margin-bottom: 5px;
  }
  .cut-line{
    clear: both;
    border-bottom: 1px solid #e2e2e2;
  }
</style>
