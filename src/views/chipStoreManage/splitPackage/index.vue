<template>
  <PageHeaderLayout :has_back="true" class="container">
    <div class="header-search-add height-auto" style="padding-bottom: 1px;padding-top: 10px">
      <div class="module">
        <div class="moduleTitle">订单基本信息</div>
        <div class="input-item">
          <span class="input-title">订单编号 </span><el-input v-model="orderNo" class="search-input" disabled size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item">
          <span class="input-title">订单类型 </span>
          <el-select v-model="orderType" disabled class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in orderOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">出库单号 </span><el-input v-model="outCode" disabled class="search-input" size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item">
          <span class="input-title">客户名称 </span>
          <el-select v-model="customer" disabled class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in customerTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">产品型号 </span>
          <el-input v-model="modelName" class="search-input" disabled size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item">
          <span class="input-title">客制规则 </span>
          <el-input v-model="ruleName" disabled class="search-input" size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item">
          <span class="input-title">片型 </span>
          <el-input v-model="sliceTypeName" class="search-input" disabled size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item">
          <span class="input-title">订单交期 </span><el-input v-model="deliveryDate" class="search-input" disabled size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item">
          <span class="input-title">订单数量 </span><el-input v-model="orderNum" class="search-input" style="width: 130px;" disabled size="small" maxlength="20" clearable/>(K)
        </div>
        <div class="input-item">
          <span class="input-title">已出数量 </span><el-input v-model="ckNum" class="search-input" style="width: 130px;" disabled size="small" maxlength="20" clearable/>(K)
        </div>
        <div class="input-item">
          <span class="input-title">数量要求 </span><el-input v-model="numRule" class="search-input" disabled size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item">
          <span class="input-title">出货数量 </span><el-input v-model="outNum" class="search-input" style="width: 130px;" disabled size="small" maxlength="20" clearable/>(K)
        </div>
        <div class="input-item">
          <span class="input-title">每包数量 </span><el-input :disabled="outStorageId !== null && packageList.length > 0" v-model="boxNum" style="width: 125px;" onkeyup="this.value=this.value.replace(/[^\d]/g,'')" class="search-input" size="small" maxlength="3" clearable/>(片)
        </div>
        <div class="input-item" style="margin-right: 10px">
          <span v-if="startTime === null || startTime === ''" class="input-title">先入先出</span>
          <span v-if="pattern === 0 && startTime !== '' && startTime !== null" class="input-title">入库时间 </span>
          <span v-if="pattern === 0 && startTime !== '' && startTime !== null">
            <el-input v-model="startTime" style="width: 143px" disabled size="small"/>
            <span style="display:inline-block;width: 15px;text-align: center"> 至 </span>
            <el-input v-model="endTime" style="width: 143px" disabled size="small"/>
          </span>
          <span v-if="pattern === 1 && startTime !== '' && startTime !== null" class="input-title" style="width: 72px;">下bin时间 </span>
          <span v-if="pattern === 1 && startTime !== '' && startTime !== null">
            <el-input v-model="startTime" style="width: 143px" disabled size="small"/>
            <span style="display:inline-block;width: 15px;text-align: center"> 至 </span>
            <el-input v-model="endTime" style="width: 143px" disabled size="small"/>
          </span>
        </div>
        <div class="input-item">
          <span class="input-title">备注 </span><el-input v-model="remark" class="search-input" disabled style="width: 613px;" size="small" maxlength="50" clearable/>
        </div>
        <div class="clear-both"/>
      </div>
      <div class="module" style="margin-top: 7px;height: auto;">
        <div class="moduleTitle">出货参数要求</div>
        <div v-for="item in paramsList" :key="item.paramName" class="input-item">
          <span style="margin-right: 5px;font-weight: bold">{{ item.paramName }}</span>
          <span v-if="item.paramCategory === 0">
            <el-input v-model="item.minVal" disabled size="mini" style="width: 70px" />~<el-input v-model="item.maxVal" disabled size="mini" style="width: 70px" />
          </span>
          <span v-if="item.paramCategory === 1">
            <span>{{ item.minVal }}</span> <el-input v-model="item.maxVal" disabled size="mini" style="width: 70px" />
          </span>
        </div>
        <div class="clear-both"/>
      </div>
    </div>
    <div class="app-container">
      <div class="table-top-btn-group">
        <div
          :class="{'active':isActive === 0}"
          @click="navClick(0, 1)"
        >
          分档明细
        </div>
        <div
          :class="{'active':isActive === 1, 'disabled': outStorageId === null}"
          @click="navClick(1, 1)"
        >
          分包明细
        </div>
        <el-button
          v-show="isActive === 0"
          :disabled="isDisabled"
          class="float-right margin-left"
          size="small"
          type="danger"
          @click="handleStartSplit"
        ><svg-icon icon-class="kaishi"/> 开始分包</el-button>
        <el-button
          v-show="isActive === 0"
          class="float-right"
          size="small"
          type="primary"
          @click="handleViewWaferDetail"
        ><svg-icon icon-class="rukujl"/> 查看Wafer</el-button>
        <el-button
          v-show="isActive === 1"
          :disabled="boxSelectedArr.length === 0 || isDisabled"
          class="float-right"
          size="mini"
          icon="el-icon-delete"
          type="danger"
          @click="deltetSelected"
        >删除</el-button>
        <el-button
          v-show="isActive === 1"
          :disabled="packageList.length === 0|| isDisabled"
          class="float-right"
          size="mini"
          icon="el-icon-check"
          type="danger"
          @click="finishSelect"
        >完成挑片</el-button>
        <el-button
          v-show="isActive === 1"
          :disabled="packageList.length === 0 || isDisabled"
          class="float-right"
          size="mini"
          icon="el-icon-back"
          type="danger"
          @click="handleReSplit"
        >重新分包</el-button>
        <el-button
          v-show="isActive === 1"
          :disabled="boxSelectedArr.length === 0"
          class="float-right"
          size="mini"
          type="primary"
          @click="handlePrintlaber"
        ><svg-icon icon-class="print"/> 打印标签</el-button>
        <el-button
          v-show="isActive === 1"
          :disabled="boxSelectedArr.length === 0"
          class="float-right"
          size="mini"
          type="primary"
          @click="handlePrintOutOrder"
        ><svg-icon icon-class="print"/> 打印出货单</el-button>
        <strong v-show="isActive === 1" class="float-right">
          <span style="font-weight: bold">共计</span>
          <el-input :disabled="true" v-model="sliceTotal" style="width: 60px;" size="mini" maxlength="20" clearable/>
          <span style="font-weight: bold">片</span>
          <el-input :disabled="true" v-model="kTotal" style="width: 120px;" size="mini" maxlength="20" clearable/>
          <span style="font-weight: bold">K </span>
        </strong>
      </div>
      <el-table
        v-loading="listLoading"
        v-show="isActive === 0"
        :data="list"
        height="93%"
        class="broad-scrollbar-table"
        element-loading-text="拼命加载中"
        border
        fit
        @selection-change="boxSelectionChange"
      >
        <el-table-column label="档位" align="center" prop="pack"/>
        <el-table-column v-for="item in tableHead" :key="item.label" :label="item.label" :prop="item.param" align="center" width="120"/>
        <el-table-column label="可出片数" align="center" prop="count"/>
        <el-table-column label="可出颗粒数(k)" align="center" prop="binCount" width="120"/>
        <el-table-column align="center" label="出库片数" width="120">
          <template slot-scope="scope">
            <el-input v-model="scope.row.sliceNum" disabled class="search-input" style="width: 100%;" size="mini" maxlength="20" clearable/>
          </template>
        </el-table-column>
        <el-table-column align="center" label="出库颗粒数(k)" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.sliceCount" disabled class="search-input" style="width: 100%;" size="mini" maxlength="20" clearable/>
          </template>
        </el-table-column>
        <el-table-column align="center" label="wafer">
          <template slot-scope="scope">
            <div style="text-decoration: underline;color: #009494;cursor: pointer;" @click="viewWaferByRuleFun(scope.row)">查看详情</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              :disabled="isDisabled"
              size="mini"
              icon="el-icon-delete"
              type="danger"
              @click="deltetItem(scope.$index)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-loading="listLoading"
        v-show="isActive === 1"
        :data="packageList"
        height="93%"
        class="broad-scrollbar-table"
        element-loading-text="拼命加载中"
        border
        fit
        @selection-change="boxSelectionChange"
      >
        <el-table-column
          type="selection"
          width="70"/>
        <el-table-column align="center" label="包号" width="140" prop="box"/>
        <el-table-column label="档位" align="center" prop="sub"/>
        <el-table-column v-for="item in tableHead" :key="item.label" :label="item.label" :prop="item.param" align="center" width="120"/>
        <el-table-column label="柜位分布" align="center" prop="ark"/>
        <el-table-column label="片数" align="center" prop="count"/>
        <el-table-column label="颗粒数(k)" align="center" prop="outCount" width="120"/>
        <el-table-column align="center" label="wafer">
          <template slot-scope="scope">
            <div style="text-decoration: underline;color: #009494;cursor: pointer;" @click="viewBoxWafer(scope.row)">查看详情</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--all wafer详情-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="waferDialogVisible"
      top="80px"
      class="send-dialog broad-scrollbar-table select-dialog"
      title="Wafer详情"
      width="1360px"
      @close="handleCloseDialog">
      <div class="search-box" style="overflow: hidden; margin-top: 5px">
        <div class="left-search-box">
          <div class="input-item">
            <span class="input-title" style="width: 34px;">包号</span>
            <el-input v-model="boxNo" class="search-input-short" placeholder="请输入包号" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 50px;">项次号</span>
            <el-input v-model="sequence" class="search-input-short" placeholder="请输入项次号" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 34px;">柜位 </span>
            <el-select v-model="arkId" class="search-input-short" style="width: 80px;" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in arkList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 50px;">数量></span>
            <el-input v-model="searchNum" class="search-input-short" style="width: 80px;" type="number" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">送片时间</span>
            <el-date-picker
              v-model="beginDate"
              :picker-options="pickerOptionsStart"
              :editable="false"
              style="width: 110px;"
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
              style="width: 110px;"
              size="small"
              type="date"
              placeholder="结束日期"
              value-format="timestamp"
            />
          </div>
        </div>
        <el-button
          :disabled="isDisabled"
          class="float-right margin-left"
          size="small"
          type="primary"
          @click="handleLockingWafer"
        ><svg-icon icon-class="pass"/>锁定Wafer
        </el-button>
        <el-button
          class="float-right"
          size="small"
          type="danger"
          @click="clearDialogSearch(2)" > <svg-icon icon-class="clear"/> 重 置</el-button>
        <el-button
          v-if="isAll"
          class="float-right"
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="handleViewWaferDetail"
        >查 询
        </el-button>
        <el-button
          v-if="!isAll"
          class="float-right"
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="viewWaferByRuleFun(selectedPackRow)"
        >查 询
        </el-button>
      </div>
      <div class="cut-line" style="margin-top: 0"/>
      <span>已选: </span><el-input v-model="selectedRow.length" style="width: 100px;" disabled size="small" maxlength="20" clearable/>
      <span>片</span>
      <el-input v-model="binCount" style="width: 100px;" disabled size="small" maxlength="20" clearable/>
      <span>K</span>
      <!--wafer-->
      <div style="width: 100%; height: 500px;user-select: none;">
        <pl-table
          v-if="pattern === 0"
          ref="waferTable"
          :datas="allWaferList"
          :row-height="35"
          style="height: 100%"
          border
          fit
          highlight-current-row
          class="broad-scrollbar-table margin-top"
          header-drag-style
          use-virtual
          @cell-mouse-enter="hoverCall"
          @selection-change="selectionChange"
        >
          <pl-table-column type="selection" width="70"/>
          <pl-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              {{ scope.$index+1 }}
            </template>
          </pl-table-column>
          <pl-table-column label="包号" align="center" prop="boxNo" width="140" show-overflow-tooltip/>
          <pl-table-column label="项次号" align="center" prop="sequence" width="100" show-overflow-tooltip/>
          <pl-table-column v-for="item in formTheadStore" v-if="item.thName !== '包号'&&item.thName !== '项次号'" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[item.thKey] }}
            </template>
          </pl-table-column>
          <pl-table-column v-for="item in reservedFields" :key="item.id" :label="item.name" :prop="item.code" width="120" align="center" show-overflow-tooltip/>
          <pl-table-column v-for="item in formTheadStoreParams" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[item.thKey] }}
            </template>
          </pl-table-column>
        </pl-table>
        <pl-table
          v-if="pattern === 1"
          ref="waferTable"
          :datas="allWaferList"
          :row-height="35"
          border
          fit
          highlight-current-row
          class="broad-scrollbar-table margin-top"
          header-drag-style
          use-virtual
          @cell-mouse-enter="hoverCall"
          @selection-change="selectionChange"
        >
          <pl-table-column type="selection" width="70" fixed/>
          <pl-table-column align="center" label="序号" width="50" fixed>
            <template slot-scope="scope">
              {{ scope.$index+1 }}
            </template>
          </pl-table-column>
          <pl-table-column label="包号" align="center" prop="boxNo" width="130" show-overflow-tooltip fixed/>
          <pl-table-column label="项次号" align="center" prop="sequence" width="100" show-overflow-tooltip fixed/>
          <pl-table-column v-for="item in formTheadfStore" v-if="item.thName !== '包号'&&item.thName !== '项次号'" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[item.thKey] }}
            </template>
          </pl-table-column>
          <pl-table-column v-for="item in reservedFields" :key="item.id" :label="item.name" :prop="item.code" width="120" align="center" show-overflow-tooltip/>
          <pl-table-column v-for="item in formTheadfStoreParams" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[item.thKey] }}
            </template>
          </pl-table-column>
        </pl-table>
      </div>
    </el-dialog>
    <!--包里的wafer详情-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="boxWaferDialogVisible"
      top="80px"
      class="send-dialog broad-scrollbar-table"
      title="Wafer详情"
      width="1360px"
      @close="handleCloseDialog">
      <el-button
        :disabled="isDisabled"
        class="float-right"
        size="small"
        type="primary"
        @click="handleExportWafer"
      ><svg-icon icon-class="export"/> 导 出
      </el-button>
      <el-upload
        ref="upload"
        :auto-upload="true"
        :on-success="onSuccess"
        :on-error="onError"
        :action="pattern === 0 ? fileYpUrl : fileFpUrl"
        :show-file-list="false"
        :before-upload="beforeUpload"
        :with-credentials="true"
        style="float:right; margin-right: 15px"
        accept=".xls,.xlsx"
        class="upload-demo"
      >
        <el-button v-loading="loading" slot="trigger" :disabled="isDisabled" size="small" type="primary"><svg-icon icon-class="daoru"/>  导 入</el-button>
      </el-upload>
      <el-button
        :disabled="isDisabled"
        size="small"
        type="primary"
        icon="el-icon-edit"
        @click="handleExchange"
      >微调换片
      </el-button>
      <el-button
        :disabled="isDisabled"
        size="small"
        type="primary"
        icon="el-icon-edit"
        @click="handleUpdateNewBox"
      >分为新包
      </el-button>
      <div class="cut-line"/>
      <div class="search-box" style="overflow: hidden; margin-top: 5px">
        <div class="left-search-box">
          <div class="input-item">
            <span class="input-title" style="width: 34px;">包号</span>
            <el-input v-model="boxNo" class="search-input" placeholder="请输入包号" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 50px;">项次号</span>
            <el-input v-model="sequence" class="search-input" placeholder="请输入项次号" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 34px;">柜位 </span>
            <el-select v-model="arkId" class="search-input-short" style="width: 80px;" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in arkList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 50px;">数量></span>
            <el-input v-model="searchNum" class="search-input-short" style="width: 100px;" type="number" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">送片时间</span>
            <el-date-picker
              v-model="beginDate"
              :picker-options="pickerOptionsStart"
              :editable="false"
              style="width: 120px;"
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
              style="width: 120px;"
              size="small"
              type="date"
              placeholder="结束日期"
              value-format="timestamp"
            />
          </div>
        </div>
        <div class="right-btn-box" style="margin-top: -10px">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="viewBoxWafer(selectedBox)"
          >查 询
          </el-button>
          <el-button
            class="margin-top margin-left"
            size="small"
            type="danger"
            @click="clearDialogSearch(1)" > <svg-icon icon-class="clear"/> 重 置</el-button>
        </div>
      </div>
      <!--wafer-->
      <el-table
        v-if="pattern === 0"
        ref="boxWaferTable"
        :data="boxWaferList"
        border
        fit
        height="550px"
        highlight-current-row
        class="broad-scrollbar-table margin-top"
        @selection-change="selectionChange"
      >
        <el-table-column type="selection" width="70"/>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="50">
          <template slot-scope="scope">
            <el-button :disabled="isDisabled" type="danger" size="mini" icon="el-icon-delete" circle @click="handleDelete(scope.row.id)"/>
          </template>
        </el-table-column>
        <el-table-column label="包号" align="center" prop="boxNo" width="140" show-overflow-tooltip/>
        <el-table-column label="项次号" align="center" prop="sequence" width="120" show-overflow-tooltip/>
        <el-table-column v-for="item in boxWaferTheadStore" v-if="item.thName !== '包号'&&item.thName !== '项次号'" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
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
        v-if="pattern === 1"
        ref="boxWaferTable"
        :data="boxWaferList"
        border
        fit
        height="550px"
        highlight-current-row
        class="broad-scrollbar-table margin-top"
        @selection-change="boxWaferSelectionChange"
      >
        <el-table-column type="selection" width="70"/>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="50">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="handleDelete(scope.row.id)"/>
          </template>
        </el-table-column>
        <el-table-column label="包号" align="center" prop="boxNo" width="140" show-overflow-tooltip/>
        <el-table-column label="项次号" align="center" prop="sequence" width="120" show-overflow-tooltip/>
        <el-table-column v-for="item in boxWaferfTheadStore" v-if="item.thName !== '包号'&&item.thName !== '项次号'" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
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
    </el-dialog>
    <!--微调换片-->
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="selectExchangeDialogVisible"
      top="80px"
      class="send-dialog broad-scrollbar-table"
      title="微调换片"
      width="1360px"
      @close="handleCloseDialog">
      <div class="search-box" style="overflow: hidden; margin-top: 5px">
        <div class="left-search-box">
          <div class="input-item">
            <span class="input-title" style="width: 34px;">包号</span>
            <el-input v-model="boxNoh" class="search-input-short" placeholder="请输入包号" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 50px;">项次号</span>
            <el-input v-model="sequenceh" class="search-input-short" placeholder="请输入项次号" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 34px;">柜位 </span>
            <el-select v-model="arkIdh" class="search-input-short" style="width: 80px;" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in arkList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 50px;">数量></span>
            <el-input v-model="searchNumh" class="search-input-short" style="width: 100px;" type="number" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">送片时间</span>
            <el-date-picker
              v-model="beginDateh"
              :picker-options="pickerOptionsStarth"
              :editable="false"
              style="width: 110px;"
              size="small"
              type="date"
              placeholder="开始日期"
              value-format="timestamp"
            />
            <span style="display:inline-block;width: 38px;text-align: center"> 至 </span>
            <el-date-picker
              v-model="endDateh"
              :picker-options="pickerOptionsEndh"
              :editable="false"
              style="width: 110px;"
              size="small"
              type="date"
              placeholder="结束日期"
              value-format="timestamp"
            />
          </div>
        </div>
        <div class="right-btn-box" style="margin-top: -10px">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="handleExchange"
          >查 询
          </el-button>
          <el-button
            class="margin-top margin-left"
            size="small"
            type="danger"
            @click="clearExchangeSearch" > <svg-icon icon-class="clear"/> 重 置</el-button>
        </div>
      </div>
      <div class="cut-line" style="margin-top: 0"/>
      <!--wafer-->
      <div style="width: 100%; height: 500px;">
        <pl-table
          v-if="pattern === 0"
          ref="waferTable"
          :datas="allWaferList"
          :row-height="35"
          border
          fit
          highlight-current-row
          class="broad-scrollbar-table margin-top"
          header-drag-style
          use-virtual
          @selection-change="selectionChange"
        >
          <pl-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              {{ scope.$index+1 }}
            </template>
          </pl-table-column>
          <pl-table-column label="包号" align="center" prop="boxNo" width="140" show-overflow-tooltip/>
          <pl-table-column label="项次号" align="center" prop="sequence" width="100" show-overflow-tooltip/>
          <pl-table-column v-for="item in formTheadStore" v-if="item.thName !== '包号'&&item.thName !== '项次号'" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[item.thKey] }}
            </template>
          </pl-table-column>
          <pl-table-column v-for="item in reservedFields" :key="item.id" :label="item.name" :prop="item.code" width="120" align="center" show-overflow-tooltip/>
          <pl-table-column v-for="item in formTheadStoreParams" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[item.thKey] }}
            </template>
          </pl-table-column>
          <pl-table-column align="center" label="操作" width="100" fixed="right">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="selectWafer(scope.row)"
              ><svg-icon icon-class="jianyanwc"/>
                换 片
              </el-button>
            </template>
          </pl-table-column>
        </pl-table>
        <pl-table
          v-if="pattern === 1"
          ref="waferTable"
          :datas="allWaferList"
          :row-height="35"
          border
          fit
          highlight-current-row
          class="broad-scrollbar-table margin-top"
          header-drag-style
          use-virtual
          @selection-change="selectionChange"
        >
          <pl-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              {{ scope.$index+1 }}
            </template>
          </pl-table-column>
          <pl-table-column label="包号" align="center" prop="boxNo" width="140" show-overflow-tooltip/>
          <pl-table-column label="项次号" align="center" prop="sequence" width="100" show-overflow-tooltip/>
          <pl-table-column v-for="item in formTheadfStore" v-if="item.thName !== '包号'&&item.thName !== '项次号'" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[item.thKey] }}
            </template>
          </pl-table-column>
          <pl-table-column v-for="item in reservedFields" :key="item.id" :label="item.name" :prop="item.code" width="120" align="center" show-overflow-tooltip/>
          <pl-table-column v-for="item in formTheadfStoreParams" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[item.thKey] }}
            </template>
          </pl-table-column>
          <pl-table-column align="center" label="操作" width="100" fixed="right">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="selectWafer(scope.row)"
              ><svg-icon icon-class="jianyanwc"/>
                换 片
              </el-button>
            </template>
          </pl-table-column>
        </pl-table>
      </div>
    </el-dialog>
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="printDialogVisible"
      title="选择标签"
      width="500px"
      @close="handleCloses('siteForm')">
      <el-form ref="siteForm" :model="siteForm" :rules="rules" status-icon label-width="80px" label-position="right">
        <el-form-item label="打印标签 " prop="selects">
          <el-select v-model="siteForm.selects" class="centerinput" style="width: 295px;" size="small" placeholder="请选择" filterable @change="startPrints">
            <el-option
              v-for="item in selectOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="isshouyg" label="产品型号 " prop="products">
          <el-select v-if="isshouyg" v-model="siteForm.products" class="centerinput" size="small" placeholder="请选择" filterable @change="ygfinds">
            <el-option
              v-for="item in productsList"
              :key="item.modelId"
              :label="item.modelName"
              :value="item.modelId"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="isshouyg" label="品名 " prop="ygid">
          <el-select v-model="siteForm.ygid" class="centerinput" size="small" placeholder="请选择" filterable>
            <el-option
              v-for="item in yglist"
              :key="item.id"
              :label="item.val"
              :value="item.id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('siteForm')">确 定</el-button>
        <el-button @click="resetForm('siteForm')">取 消</el-button>
      </span>
    </el-dialog>
    <div v-show="printDivShow" ref="print" style="margin-top: 10px">
      <table
        v-for="printBox in dialogPrintList"
        :key="printBox.title"
        cellspacing="0"
        cellpadding="0"
        border="0"
        style="width: 277mm;border:1px solid #666; page-break-before: auto;page-break-after: always" >
        <thead>
          <tr style="text-align: center"><th colspan="9" rowspan="1" style="text-align:center;font-size:0.5cm;padding:5px;border:1px solid #666"><span style="margin-right: 10px">{{ customer }}</span>{{ printBox.total }}</th></tr>
          <tr style="text-align: center"><th colspan="9" rowspan="1" style="text-align:center;font-size:0.5cm;padding:5px;border:1px solid #666" v-text="printBox.boxNo">wy-09J(档次1324.7-213123.5)</th></tr>
          <tr class>
            <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width:60px!important;">
              <div class="cell" style="font-size:0.4cm;">柜位</div>
            </th>
            <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width:100px">
              <div class="cell" style="font-size:0.4cm;">批号</div>
            </th>
            <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 100px!important;;">
              <div class="cell" style="font-size:0.4cm;">项次</div>
            </th>
            <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 180px;">
              <div class="cell" style="font-size:0.4cm;">Tape No</div>
            </th>
            <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 180px;">
              <div class="cell" style="font-size:0.4cm;">Wafer No</div>
            </th>
            <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 80px!important;">
              <div class="cell" style="font-size:0.4cm;">Quantity</div>
            </th>
            <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 90px!important;">
              <div class="cell" style="font-size:0.4cm;">WLD-AVG</div>
            </th>
            <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 70px!important;">
              <div class="cell" style="font-size:0.4cm;">IV-AVG</div>
            </th>
            <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 75px!important;">
              <div class="cell" style="font-size:0.4cm;">VF-AVG</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item) in printBox.wafers" :key="item.box">
            <td colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 60px!important;">
              <div class="cell" style="font-size:0.4cm;">{{ item.arkName }}</div>
            </td>
            <td colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
              <div class="cell" style="font-size:0.4cm;">{{ item.box }}</div>
            </td>
            <td colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 100px!important;">
              <div class="cell" style="font-size:0.4cm;">{{ item.sequence }}</div>
            </td>
            <td colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
              <div class="cell" style="font-size:0.4cm;">{{ item.tapeNo }}</div>
            </td>
            <td colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
              <div class="cell" style="font-size:0.4cm;">{{ item.code }}</div>
            </td>
            <td colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 80px!important;">
              <div class="cell" style="font-size:0.4cm;">{{ item.binCount }}</div>
            </td>
            <td colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 90px!important;">
              <div class="cell" style="font-size:0.4cm;">{{ item.wld_avg }}</div>
            </td>
            <td colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 70px!important;">
              <div class="cell" style="font-size:0.4cm;">{{ item.lop_avg }}</div>
            </td>
            <td colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 75px!important;">
              <div class="cell" style="font-size:0.4cm;">{{ item.vf1_avg }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .app-container>>> .el-table--striped .el-table__body tr.el-table__row--striped.current-row td,
  .app-container>>> .el-table__body tr.current-row>td {
    background-color: #65ba7d !important;
  }
  .select-dialog .input-item{
    margin-top: 0;
  }
  .select-dialog>>> .el-table--scrollable-x{
    height:500px !important;
  }
  .broad-scrollbar-table>>> .el-table__fixed, .broad-scrollbar-table>>> .el-table__fixed-right{
    background: #fff;
    height: calc(100% - 12px) !important;
  }
  .broad-scrollbar-table>>> .el-table__fixed-body-wrapper {
    height: calc(100% - 37px) !important;
  }
  .table-top-btn-group{
    overflow: hidden;
    border-bottom: 2px solid #009494;
  }
  .table-top-btn-group.substrate{
    float: left;
  }
  .substrate-total{
    float: right;
    line-height: 30px;
    font-weight: bold;
    font-size: 15px;
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
  .table-top-btn-group>div.disabled{
    background: #dbdbdb;
    cursor: not-allowed;
  }
  .broad-scrollbar-table>>> .cell{
    line-height: 37px;
  }
  .broad-scrollbar-table>>> td{
    height: 37px;
  }
  .broad-scrollbar-table>>> .el-input--small .el-input__inner{
    padding-left: 5px;
    padding-right: 20px;
  }
  .broad-scrollbar-table>>> .el-input--prefix .el-input__inner{
    padding-left: 25px;
    padding-right: 0px;
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
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 10px;
    top: 3px;
  }
  .input-item{
    float: left;
    margin-bottom: 5px;
    margin-right: 10px;
  }
  .search-input{
    width: 150px;
  }
  .short-input{
    width: 126px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 339px);
  }
  .select-thead-btn{
    width: 45px;
    height: 42px;
    position: absolute;
    z-index: 200;
    background: rgba(0,0,0,.2);
    right: 15px;
    top: 15px;
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
  .dialog-sub-title{
    line-height: 40px;
    text-align: center;
    font-weight: bold;
    font-size: 26px;
    color: #009494;
  }
  .cut-line{
    border-bottom: 1px solid #e2e2e2;
    margin-bottom: 10px;
    margin-top: 10px;
  }
  .left-content{
    border: 1px solid #b2dfdf;
    margin-top: 10px;
    padding: 5px 10px 10px 10px;
  }
  .dialog-input{
    width: 300px;
  }
  .dialog-input-base{
    width: 217px;
  }
  .dialog-input-short{
    width: 182px;
  }
  .input-title-short{
    width: 50px !important;
  }
  .search-input-short{
    width: 130px;
  }
  .module-title-text{
    margin-bottom: 10px;
  }
  .search-input{
    width: 148px;
    float: right;
  }
  .input-title{
    display: inline-block;
    width: 65px;
    margin-top: 8px;
  }
  .input-container{
    padding: 10px;
    border: 1px solid #b2dfdf;
    padding-right: 0;
    background: #edf7f7;
    margin: 10px 0;
  }
  .input-container .input-title{
    width: 105px;
    font-size: 18px;
  }
  .input-container .input-title-short{
    width: 70px;
    font-size: 18px;
    font-weight: bold;
  }
  .input-container>>> .el-input.is-disabled .el-input__inner {
    background-color: #fff;
    border-color: #E4E7ED;
    cursor: not-allowed;
    font-size: 14px;
    color: #494949;
  }
  .padding-dialog>>> .el-dialog__footer{
    text-align: center;
  }
  .submit-btn{
    background: #1abb9d; border-color: #1abb9d;padding: 20px 40px;margin-left: 80px
  }
  .abnormal-cause{
    position: absolute;
    width: 105px;
    top: 63px;
    background: #fff;
    right: 13px;
  }
  .send-dialog>>>.el-dialog__body{
    padding: 15px;
    padding-top: 10px;
  }
  .send-dialog .input-item{
    margin-right: 15px;
  }
  .module{
    position: relative;
    padding-left: 5px;
    padding-top: 10px;
    border-top: 1px solid #bbd6d0;
    height: auto;
    width: 100%;
    margin: 5px 0;

  }
  .moduleTitle{
    color: #009494;
    position: absolute;
    top: -13px;
    left: 16px;
    background: #fff;
    height: 20px;
    padding: 5px 15px;
    font-weight: bold;
    font-size: 14px;
    text-align: center;
  }
  .container>>> .el-input.is-disabled .el-input__inner{
    color: #494949;
  }
  .broad-scrollbar-table>>> .ant-table-scroll{
    max-height: 100% !important;
  }
</style>
