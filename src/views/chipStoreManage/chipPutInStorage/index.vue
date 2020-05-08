<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto">
      <div class="header-btn-group">
        <el-button
          style="float: left;"
          size="small"
          type="primary"
          @click="handleSelect"
        ><svg-icon icon-class="xuanzexx"/> 选择送片单</el-button>
        <el-button slot="trigger" size="small" type="primary" @click="handleImport"><svg-icon icon-class="daoru"/>  外部片源导入</el-button>
        <el-button
          :disabled="selectedList.length === 0"
          size="small"
          type="primary"
          @click="handleAdd" ><svg-icon icon-class="add"/> 保存入库</el-button>
        <el-button
          :disabled="selectedList.length === 0 || isImport"
          size="small"
          type="danger"
          @click="handleSendBack"
        ><svg-icon icon-class="xiangzuo"/> 退 回</el-button>
        <el-button
          class="float-right"
          size="small"
          type="primary"
          @click="viewRecord"
        ><svg-icon icon-class="rukujl"/> 入库记录</el-button>
        <div class="clear-both"/>
      </div>
      <div style="height: auto;">
        <div class="input-item">
          <div>
            <span class="input-title">入库单号 </span>
            <el-input ref="importInput" :autofocus="true" v-model="putInStorageNo" class="search-input search-input-short" size="small" maxlength="20" clearable @keyup.enter.native="handleSearchStorageNo"/>
          </div>
          <div style="margin-top: 10px">
            <span class="input-title">产品型号 </span>
            <el-input :disabled="true" v-model="productMode" class="search-input search-input-short" size="small" maxlength="20" clearable/>
          </div>
        </div>
        <div class="input-item">
          <div>
            <span class="input-title">单据类型 </span>
            <el-input :disabled="true" v-model="billType" class="search-input-short" size="small" maxlength="20" clearable/>
          </div>
          <div style="margin-top: 10px">
            <span class="input-title">投片类型 </span>
            <el-input :disabled="true" v-model="tipOutModel" class="search-input-short" size="small" maxlength="20" clearable/>
          </div>
        </div>
        <div class="input-item">
          <div>
            <span class="input-title">入库类型 </span>
            <el-select v-model="putInStorageType" class="search-input search-input-short" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in putInTypeList"
                :key="item.name"
                :label="item.name"
                :value="item.name"/>
            </el-select>
          </div>
          <div style="margin-top: 10px">
            <span class="input-title">芯片产地 </span>
            <el-select v-model="placeOrigin" class="search-input search-input-short" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in placeOriginList"
                :key="item.name"
                :label="item.name"
                :value="item.name"/>
            </el-select>
          </div>
        </div>
        <div class="input-item">
          <div style="position:relative;">
            <span class="input-title">柜位 </span>
            <el-select :disabled="isAppend" v-model="cabinet" class="search-input-short" style="width: 100px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in cabinetList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
            <div style="position: absolute;right: 0;top: 3px;">
              <span @click="cabinetClick"><svg-icon style="color: #80cac9; font-size: 25px;cursor: pointer;" icon-class="guiweigl"/></span>
              <div v-if="cabinetDetailShow" style="position: absolute;top: -3px;left: 30px; width: 400px;height: 300px;z-index: 10">
                <el-table
                  ref="boxTable"
                  :data="cabinetList"
                  class="popTable"
                  element-loading-text="拼命加载中"
                  max-height="300"
                  border
                  @selection-change="selectionChange"
                  @row-click="rowClick">
                  <el-table-column label="柜位" align="center" prop="name" width="100"/>
                  <el-table-column label="存储量" align="center" prop="count">
                    <template slot-scope="scope">
                      <span>{{ (scope.row.count === null ? 0 : scope.row.count) + '/' + scope.row.capacity + '片' }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="剩余可存量" align="center" prop="count">
                    <template slot-scope="scope">
                      <span v-if="(scope.row.capacity - scope.row.count) > 0">{{ (scope.row.capacity - scope.row.count) + '片' }}</span>
                      <span v-else>0片</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
          <div style="margin-top: 10px">
            <span class="input-title">入库时间 </span>
            <el-date-picker
              v-model="putInTime"
              :editable="false"
              class="search-input-short"
              type="date"
              size="small"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            />
          </div>
        </div>
        <div class="input-item" style="margin-right: 0">
          <div>
            <span class="input-title">返工单号 </span>
            <el-input :disabled="true" v-model="reworkNum" class="search-input-short" size="small" style="width: 180px;" maxlength="20" clearable/>
          </div>
          <div style="margin-top: 10px">
            <span class="input-title">前置包号 </span>
            <el-input :disabled="true" v-model="lastBoxCount" class="search-input search-input-short" style="width: 180px;" size="small" maxlength="20" clearable/>
          </div>
        </div>
        <div class="input-item" style="margin-right: 0">
          <div style="line-height: 30px">
            <el-checkbox v-model="isPrint" @change="boxPrintChange">打印包标签</el-checkbox>
          </div>
          <div>
            <el-checkbox v-model="isPrintSequence">打印项次标签</el-checkbox>
          </div>
          <div style="line-height: 30px">
            <el-checkbox :disabled="lastBoxNo === '' || lastBoxNo === null || unequal || isImport" v-model="isAppend" @change="checkBoxChange">追加包号</el-checkbox>
          </div>
        </div>
        <div class="input-item">
          <span class="input-title" style="line-height: 75px">备注 </span>
          <el-input :rows="3" v-model="putInRemark" class="dialog-input" style="width: 150px;" placeholder="请输入备注" type="textarea" maxlength="50" clearable/>
        </div>
        <div class="clear-both"/>
        <div v-if="reservedFields.length > 0" class="cut-line" style="margin-bottom: -4px"/>
        <div style="overflow: hidden">
          <div v-for="item in reservedFields" :key="item.id" class="input-item">
            <span style="font-weight: bold;padding-right: 5px"> {{ item.name }} </span>
            <el-select v-model="item.fields" class="search-input" style="width: 180px" size="small" placeholder="请选择" filterable clearable multiple collapse-tags>
              <el-option
                v-for="item in item.options"
                :key="item.name"
                :label="item.name"
                :value="item.name"/>
            </el-select>
          </div>
        </div>
      </div>
    </div>
    <div :class="{'height-app-container' : reservedFields.length === 0}" class="app-container">
      <div v-if="selectedList.length > 0" style="margin-bottom: 10px;overflow: hidden">
        <div class="input-item" style="margin-right: 10px;margin-top: 0">
          <span class="input-title" style="width: 88px;"><svg-icon icon-class="tiaomasm" style="color:#009494;margin-right: 2px;font-size: 18px;"/> 片号扫描 </span>
          <el-input ref="importInputJp" v-model="waferNo" class="search-input" style="width: 300px;" placeholder="请输入片号" size="small" clearable @keyup.enter.native="handleSelectItem"/>
        </div>
        <div class="input-item" style="margin-right: 10px;margin-top: 0">
          <el-button
            size="small"
            type="primary"
            @click="fullScan"
          >
            <svg-icon icon-class="tiaomasm"/> 一键全扫
          </el-button>
        </div>
        <div class="input-item" style="margin-right: 10px;margin-top: 0;float: right;">
          <span class="input-title"> Total </span>
          <el-input :disabled="true" v-model="sliceCount" class="search-input" style="width: 90px;" size="small"/>
          <span class="fontBold" >片</span>
          <span class="input-title"> 已验证 </span>
          <el-input :disabled="true" v-model="scanList.length" class="search-input" style="width: 90px;" size="small"/>
          <span class="fontBold" >片</span>
          <el-input :disabled="true" v-model="scanCount" class="search-input" style="width: 130px;" size="small"/>
          <span class="fontBold" >K</span>
        </div>
        <div class="input-item" style="margin-right: 10px;margin-top: 0;float: right;">
          <span class="input-title"> 每包片数 </span>
          <el-input v-model="sliceNum" class="search-input" style="width: 80px;" onkeyup="this.value=this.value.replace(/[^\d]/g,'')" size="small" maxlength="3" clearable @blur="sliceNumBlur"/>
          <span class="fontBold" >片</span>
        </div>
      </div>
      <div style="height: 90%" class="table-container">
        <!--:row-style="rowStyle"-->
        <pl-table
          v-show="selectedRow.sliceType === 0"
          ref="tableList1"
          :key="tableKey"
          :datas="scanList"
          :row-height="37"
          header-drag-style
          use-virtual
          highlight-current-row
          class="broad-scrollbar-table"
          element-loading-text="拼命加载中"
          border
          fit
        >
          <pl-table-column align="center" label="序号" width="50" fixed>
            <template slot-scope="scope">
              {{ (pageNum - 1) * pageSize + scope.$index+1 }}
            </template>
          </pl-table-column>
          <pl-table-column label="片号" align="center" prop="waferNo" width="220" fixed show-overflow-tooltip/>
          <pl-table-column label="TapeNo" align="center" prop="tapeNo" width="160" fixed show-overflow-tooltip/>
          <pl-table-column v-for="item in furnaceHasPackageList" v-if="item.thName !== '序号'&&item.thName !== 'WaferID'&&item.thName !== 'TapeNo'" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[item.thKey] }}
            </template>
          </pl-table-column>
        </pl-table>
        <pl-table
          v-show="selectedRow.sliceType === 1"
          ref="tableList2"
          :key="tableKey2"
          :datas="scanList"
          :row-height="37"
          header-drag-style
          highlight-current-row
          use-virtual
          class="broad-scrollbar-table"
          element-loading-text="拼命加载中"
          border
          fit
        >
          <pl-table-column align="center" label="序号" width="50" fixed>
            <template slot-scope="scope">
              {{ (pageNum - 1) * pageSize + scope.$index+1 }}
            </template>
          </pl-table-column>
          <pl-table-column label="片号" align="center" prop="waferNo" width="200" fixed show-overflow-tooltip/>
          <pl-table-column label="TapeNo" align="center" prop="tapeNo" width="180" fixed show-overflow-tooltip/>
          <pl-table-column v-for="item in furnacefHasPackageList" v-if="item.thName !== '序号'&&item.thName !== 'ChipNo'&&item.thName !== 'TapeNo'" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[item.thKey] }}
            </template>
          </pl-table-column>
        </pl-table>
      </div>
    </div>
    <!--选择片子-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="sendDialogVisible"
      top="80px"
      class="send-dialog broad-scrollbar-table"
      title="送片单"
      width="1310px"
      @close="handleCloseDialog">
      <div class="search-box" style="padding-bottom: 15px;overflow: hidden">
        <div class="left-search-box">
          <div class="input-item">
            <span class="input-title" style="width: 34px;">单号</span>
            <el-input v-model="listNo" class="search-input" style="width: 180px" placeholder="请输入单号" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <el-radio-group v-model="timeRadio" style="margin-left:15px">
              <el-radio :label="1">制单日期</el-radio>
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
          </div>
        </div>
        <div class="right-btn-box" style="margin-top: 3px">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="handleDialogSearch(1)"
          >查 询
          </el-button>
          <el-button
            class="margin-top margin-left"
            size="small"
            type="danger"
            @click="clearDialogSearch(1)" > <svg-icon icon-class="clear"/> 重 置</el-button>
        </div>
        <div class="cut-line" style="margin-bottom: 0"/>
      </div>
      <div class="table-top-btn-group">
        <div
          :class="{'active':isActive === 0}"
          @click="navClick(0, 1)"
        >
          单据信息
        </div>
        <div
          :class="{'active':isActive === 1}"
          @click="navClick(1, 1)"
        >
          Wafer信息TOL: <span v-text="waferTol"/>
        </div>
        <el-button
          :disabled="billList.length === 0"
          class="float-right"
          size="small"
          type="primary"
          @click="handleExportDialog"
        ><svg-icon icon-class="export"/> 导 出
        </el-button>
      </div>
      <div v-if="selectTheadVisble" class="select-thead">
        <div class="options-box" style="height: 255px;overflow-y: auto;">
          <el-checkbox-group v-model="checkboxVal">
            <el-checkbox v-for="(option, index) in formTheadOptions" :key="index" :label="option" :disabled="index<3" style="width: 180px;margin-left: 15px;margin: 5px;">
              {{ option.thName }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <el-button type="primary" size="mini" style="margin-left: 25px" @click="submitOption">确 定</el-button>
        <el-button size="mini" @click="selectTheadVisble = false">取 消</el-button>
      </div>
      <div style="margin-bottom: -16px;">
        &nbsp;
        <span v-if="isActive === 2 && selectedRunRow !=='' && selectedRunRow.sliceType === 0" type="text" class="select-thead-btn" @click="selectThead"><svg-icon icon-class="shezhi"/> 设置显示列</span>
        <span v-if="isActive === 2 && selectedRunRow !=='' && selectedRunRow.sliceType === 1" type="text" class="select-thead-btn" @click="selectTheadf"><svg-icon icon-class="shezhi"/> 设置显示列</span>
      </div>
      <div v-if="selectfTheadVisble" class="select-thead">
        <div class="options-box" style="height: 300px;overflow-y: auto;">
          <el-checkbox-group v-model="checkboxfVal">
            <el-checkbox v-for="(option, index) in formTheadfOptions" :key="index" :label="option" :disabled="index<3" style="width: 180px;margin-left: 15px;margin: 5px;">
              {{ option.thName }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <el-button type="primary" size="mini" style="margin-left: 25px" @click="submitOptionf">确 定</el-button>
        <el-button size="mini" @click="selectfTheadVisble = false">取 消</el-button>
      </div>
      <!--run信息-->
      <el-table
        v-loading="listLoading"
        v-show="isActive === 0"
        ref="runTable"
        :data="billList"
        height="500px"
        class="mocvd-table"
        element-loading-text="拼命加载中"
        highlight-current-row
        border
        fit
        @row-click="rowClick"
        @row-dblclick="rowDblclick"
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="入库单号" align="center" prop="code" width="130" show-overflow-tooltip/>
        <el-table-column label="单据类型" align="center" prop="billType" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.billType === 0" style="color: #009494;font-weight: bold">正常片</span>
            <span v-if="scope.row.billType === 1" style="color: #f66;font-weight: bold">返工片</span>
          </template>
        </el-table-column>
        <el-table-column label="返工单号" align="center" prop="backNo" width="100" show-overflow-tooltip/>
        <el-table-column label="产品型号" align="center" prop="taskModel" width="100" show-overflow-tooltip/>
        <el-table-column label="入库数量(k)" align="center" prop="chipCount" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.chipCount | NumFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column label="投片类型" align="center" prop="sliceType" width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.sliceType === 0" style="color: #009494;font-weight: bold">圆片</span>
            <span v-if="scope.row.sliceType === 1" style="color: #f66;font-weight: bold">方片</span>
          </template>
        </el-table-column>
        <!--<el-table-column label="光色" align="center" prop="color" width="60" show-overflow-tooltip/>-->
        <!--<el-table-column label="型号" align="center" prop="model" width="60" show-overflow-tooltip/>-->
        <el-table-column label="尺寸" align="center" prop="size" width="80" show-overflow-tooltip/>
        <el-table-column label="等级品质" align="center" prop="quality" width="80" show-overflow-tooltip/>
        <!--<el-table-column label="外观等级" align="center" prop="classify" width="80" show-overflow-tooltip/>-->
        <!--<el-table-column label="是否清洗" align="center" prop="isClean" width="80" show-overflow-tooltip/>-->
        <el-table-column label="制单人" align="center" prop="creatorName" width="80" show-overflow-tooltip/>
        <el-table-column label="制单日期" align="center" prop="createTime" width="100" show-overflow-tooltip/>
        <el-table-column label="审核人" align="center" prop="auditorName" width="80" show-overflow-tooltip/>
        <el-table-column label="审核日期" align="center" prop="auditTime" width="100" show-overflow-tooltip/>
        <el-table-column label="审核状态" align="center" prop="type" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1" style="color: #009494;font-weight: bold">通过</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" width="120" show-overflow-tooltip/>
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleSelectRow(scope.row)"><svg-icon icon-class="xuanzexx"/> 选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--wafer信息-->
      <div v-show="isActive === 1" style="height: 500px;" class="table-dialog-container">
        <pl-table
          v-show="isActive === 1 && selectedRunRow.sliceType === 0"
          :datas="waferList"
          :row-height="37"
          height="500px"
          header-drag-style
          use-virtual
          class="broad-scrollbar-table"
          element-loading-text="拼命加载中"
          border
          fit
        >
          <pl-table-column align="center" label="序号" width="50" fixed>
            <template slot-scope="scope">
              {{ (pageNum - 1) * pageSize + scope.$index+1 }}
            </template>
          </pl-table-column>
          <pl-table-column label="WaferID" align="center" prop="waferNo" width="220" fixed show-overflow-tooltip/>
          <pl-table-column label="TapeNo" align="center" prop="tapeNo" width="180" fixed show-overflow-tooltip/>
          <pl-table-column v-for="item in formThead" v-if="item.thName !== '序号'&&item.thName !== 'WaferID'&&item.thName !== 'TapeNo'" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[item.thKey] }}
            </template>
          </pl-table-column>
        </pl-table>
        <pl-table
          v-show="isActive === 1 && selectedRunRow.sliceType === 1"
          :datas="waferList"
          :row-height="37"
          height="500px"
          header-drag-style
          use-virtual
          class="broad-scrollbar-table"
          element-loading-text="拼命加载中"
          border
          fit
        >
          <pl-table-column align="center" label="序号" width="50" fixed>
            <template slot-scope="scope">
              {{ (pageNum - 1) * pageSize + scope.$index+1 }}
            </template>
          </pl-table-column>
          <pl-table-column label="ChipNo" align="center" prop="waferNo" width="220" fixed show-overflow-tooltip/>
          <pl-table-column label="TapeNo" align="center" prop="tapeNo" width="180" fixed show-overflow-tooltip/>
          <pl-table-column v-for="item in formTheadf" v-if="item.thName !== '序号'&&item.thName !== 'ChipNo'&&item.thName !== 'TapeNo'" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[item.thKey] }}
            </template>
          </pl-table-column>
        </pl-table>
      </div>
      <el-pagination
        v-if="isActive === 0"
        :current-page="pageNum"
        :page-sizes="[12, 25, 50]"
        :page-size="pageSize"
        :total="totalPage"
        class="pagination"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </el-dialog>
    <!--入库记录-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="recordDialogVisible"
      top="80px"
      class="send-dialog broad-scrollbar-table"
      title="入库记录"
      width="1310px"
      @close="handleCloseDialog">
      <div class="search-box" style="padding-bottom: 10px;padding-top:0px;overflow: hidden">
        <div class="input-item">
          <span class="input-title" style="width: 35px;">单号</span>
          <el-input v-model="listNo" class="search-input" style="width: 180px" placeholder="请输入单号" size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item">
          <el-radio-group v-model="timeRadio" style="margin-left:15px">
            <el-radio :label="1">制单日期</el-radio>
            <el-radio :label="2">审核日期</el-radio>
            <el-radio :label="3">入库日期</el-radio>
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
        </div>
        <el-button
          class="margin-left"
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="handleDialogSearch(2)"
        >查 询
        </el-button>
        <el-button
          class="margin-top margin-left"
          size="small"
          type="danger"
          @click="clearDialogSearch(2)" > <svg-icon icon-class="clear"/> 重 置</el-button>
        <div class="cut-line clear-both" style="margin-bottom: 0"/>
      </div>
      <div class="table-top-btn-group">
        <div
          :class="{'active':isActive === 0}"
          @click="navClick(0, 2)"
        >
          单据信息
        </div>
        <div
          :class="{'active':isActive === 1}"
          @click="navClick(1, 2)"
        >
          Wafer信息TOL: <span v-text="waferTol"/>
        </div>
        <el-button
          :disabled="recordList.length === 0"
          class="float-right"
          size="small"
          type="primary"
          @click="handleExport"
        ><svg-icon icon-class="export"/> 导 出
        </el-button>
        <el-button
          :disabled="recordList.length === 0"
          class="float-right margin-right"
          size="small"
          type="primary"
          @click="printFun"
        ><svg-icon icon-class="print"/> 打印包标签
        </el-button>
        <el-button
          :disabled="recordList.length === 0"
          class="float-right"
          size="small"
          type="primary"
          @click="printSequenceFun"
        ><svg-icon icon-class="print"/> 打印项次标签
        </el-button>
      </div>
      <!--run信息-->
      <el-table
        v-loading="listLoading"
        v-show="isActive === 0"
        ref="runTable"
        :data="recordList"
        height="500px"
        class="mocvd-table"
        element-loading-text="拼命加载中"
        highlight-current-row
        border
        fit
        @row-click="recordRowClick"
      >
        <el-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="入库单号" align="center" prop="billNo" width="130" show-overflow-tooltip fixed/>
        <el-table-column label="入库类型" align="center" prop="storeType" width="120" show-overflow-tooltip/>
        <el-table-column label="芯片产地" align="center" prop="product" width="120" show-overflow-tooltip/>
        <el-table-column label="入库包号" align="center" prop="boxNo" width="120" show-overflow-tooltip/>
        <el-table-column label="项次号" align="center" prop="seqNo" width="120" show-overflow-tooltip/>
        <el-table-column label="柜位" align="center" prop="arkName" width="80" show-overflow-tooltip/>
        <el-table-column label="产品型号" align="center" prop="taskModel" width="100" show-overflow-tooltip/>
        <el-table-column label="数量(K)" align="center" prop="chipCount" width="100" show-overflow-tooltip/>
        <el-table-column label="类型" align="center" prop="sliceType" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.sliceType === 0" style="color: #009494;font-weight: bold">圆片</span>
            <span v-if="scope.row.sliceType === 1" style="color: #f66;font-weight: bold">方片</span>
          </template>
        </el-table-column>
        <el-table-column label="尺寸" align="center" prop="measure" width="80" show-overflow-tooltip/>
        <el-table-column label="外观等级" align="center" prop="classify" width="100" show-overflow-tooltip/>
        <el-table-column label="制单人" align="center" prop="makeName" width="120" show-overflow-tooltip/>
        <el-table-column label="制单日期" align="center" prop="makeTime" width="100" show-overflow-tooltip/>
        <el-table-column label="审核人" align="center" prop="auditor" width="120" show-overflow-tooltip/>
        <el-table-column label="审核日期" align="center" prop="auditTime" width="100" show-overflow-tooltip/>
        <el-table-column label="入库人" align="center" prop="creator" width="120" show-overflow-tooltip/>
        <el-table-column label="入库时间" align="center" prop="createTime" width="100" show-overflow-tooltip/>
        <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip/>
      </el-table>
      <!--wafer信息-->
      <div v-if="isActive === 1" style="height: 500px;" class="table-dialog-container">
        <pl-table
          v-show="isActive === 1 && selectedRunRow.sliceType === 0"
          :datas="waferList"
          :row-height="37"
          header-drag-style
          use-virtual
          height="500px"
          class="broad-scrollbar-table"
          element-loading-text="拼命加载中"
          border
          fit
        >
          <pl-table-column align="center" label="序号" width="50" fixed>
            <template slot-scope="scope">
              {{ (pageNum - 1) * pageSize + scope.$index+1 }}
            </template>
          </pl-table-column>
          <pl-table-column label="WaferID" align="center" prop="code" width="200" fixed show-overflow-tooltip/>
          <pl-table-column label="TapeNo" align="center" prop="tapeNo" width="180" fixed show-overflow-tooltip/>
          <pl-table-column v-for="item in formTheadStore" v-if="item.thName !== 'WaferID'&&item.thName !== 'TapeNo'" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
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
          v-show="isActive === 1 && selectedRunRow.sliceType === 1"
          :datas="waferList"
          :row-height="37"
          header-drag-style
          use-virtual
          height="500px"
          class="broad-scrollbar-table"
          element-loading-text="拼命加载中"
          border
          fit
        >
          <pl-table-column align="center" label="序号" width="50" fixed>
            <template slot-scope="scope">
              {{ (pageNum - 1) * pageSize + scope.$index+1 }}
            </template>
          </pl-table-column>
          <pl-table-column label="ChipNo" align="center" prop="code" width="200" fixed show-overflow-tooltip/>
          <pl-table-column label="TapeNo" align="center" prop="tapeNo" width="180" fixed show-overflow-tooltip/>
          <pl-table-column v-for="item in formTheadfStore" v-if="item.thName !== 'ChipNo'&&item.thName !== 'TapeNo'" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
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
      <el-pagination
        v-if="isActive === 0"
        :current-page="pageNum"
        :page-sizes="[12, 25, 50]"
        :page-size="pageSize"
        :total="totalPage"
        class="pagination"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="recordSizeChange"
        @current-change="recordCurrentChange"
      />
    </el-dialog>
    <!--选择方圆片-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="importDialogVisible"
      class="select-dialog"
      title="请选择片型"
      width="500px"
      @close="handleClose">
      <el-radio-group v-model="importSliceType">
        <el-radio :label="0">圆片</el-radio>
        <el-radio :label="1">方片</el-radio>
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <el-button class="float-right margin-left" size="small" @click="importDialogVisible = false">取 消</el-button>
        <el-upload
          ref="upload"
          :auto-upload="true"
          :on-success="onSuccess"
          :on-error="onError"
          :action="importSliceType === 0 ? fileYpUrl : fileFpUrl"
          :show-file-list="false"
          :before-upload="beforeUpload"
          :with-credentials="true"
          style="float: right;"
          accept=".xls,.xlsx"
          class="upload-demo"
        >
          <el-button v-loading="loading" slot="trigger" size="small" type="primary"> 确 定</el-button>
        </el-upload>
        <div class="clear-both"/>
      </span>
    </el-dialog>
    <!--未检验片子-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="noVerifiedVisible"
      class="padding-dialog"
      title="提示"
      width="500px"
      @close="handleClose">
      <span style="color: #f56c6c">以下Wafer信息不存在，请检查后入库！</span>
      <el-table
        :data="noVerified"
        class="margin-top"
        element-loading-text="拼命加载中"
        max-height="300"
        border
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="片号" align="center" prop="waferNo" width="200" show-overflow-tooltip/>
        <el-table-column label="TapeNo" align="center" prop="tapeNo" show-overflow-tooltip/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button class="float-right margin-left" size="small" type="primary" @click="noVerifiedVisible = false">关 闭</el-button>
        <div class="clear-both"/>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .app-container>>> .el-table--striped .el-table__body tr.el-table__row--striped.current-row td,
  .app-container>>> .el-table__body tr.current-row>td {
    background-color: #65ba7d !important;
  }
  .table-container>>> .el-table--scrollable-x{
    height: calc(100vh - 420px) !important;
  }
  .table-container>>> .el-table--scrollable-x .el-table__body-wrapper{
    height: calc(100vh - 459px) !important;
  }
  .table-dialog-container>>> .el-table--scrollable-x{
    height: 500px !important;
  }
  .table-dialog-container>>> .el-table--scrollable-x .el-table__body-wrapper{
    height: 460px !important;
  }
  .el-table .warning-row {
    background: oldlace;
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
  .popTable>>> .cell{
    line-height: 30px;
  }
  .popTable>>> td{
    height: 30px;
  }
  .broad-scrollbar-table>>> .cell{
    line-height: 37px;
  }
  .broad-scrollbar-table>>> td{
    height: 37px;
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
    margin-top: 14px;
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
    height: calc(100vh - 360px);
  }
  .height-app-container.app-container{
    position: relative;
    height: calc(100vh - 310px);
  }
  .select-thead-btn{
    cursor: pointer;
    width: 120px;
    height: 30px;
    position: absolute;
    z-index: 200;
    right: -5px;
    top: 120px;
    color: #009494;
  }
  .select-thead{
    width: 200px;
    height: 350px;
    border: 1px solid #e2e2e2;
    position: absolute;
    z-index: 200;
    background: #fff;
    right: 15px;
    top: 190px;
  }
  .options-box{
    height: 280px;
    overflow-y: auto;
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
    width: 138px;
  }
  .input-title{
    width: 65px;
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
    padding-top: 0px;
    padding-bottom: 60px;
  }
  .send-dialog .input-item{
    margin-right: 15px;
  }
  .fontBold{
    font-weight: bold;
  }
  .header-search-add>>> .el-input--suffix .el-input__inner{
    padding-right: 20px;
  }
</style>
