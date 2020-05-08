<template>
  <PageHeaderLayout >
    <div :class="{'no-padding' : hidden}" class="header-search-add height-auto">
      <div :class="{'hidden' : hidden}" class="header-btn-group">
        <el-button
          style="float: left; margin-right: 10px"
          size="small"
          type="primary"
          @click="handleSelect"
        ><svg-icon icon-class="xuanzexx"/> 选择送片单</el-button>
        <el-upload
          ref="upload"
          :auto-upload="true"
          :on-success="onSuccess"
          :on-error="onError"
          :action="fileUrl"
          :show-file-list="false"
          :before-upload="beforeUpload"
          :with-credentials="true"
          style="float: left; margin-right: 15px"
          accept=".xls,.xlsx"
          class="upload-demo"
        >
          <el-button v-loading="loading" slot="trigger" size="small" type="primary"><svg-icon icon-class="daoru"/>  外部片源导入</el-button>
        </el-upload>
        <el-button
          class="float-right"
          size="small"
          type="primary"
          @click="viewRecord"
        ><svg-icon icon-class="rukujl"/> 入库记录</el-button>
        <div class="clear-both"/>
        <div :class="{'hidden' : hidden}" class="clear-both"/>
      </div>
      <div style="height: auto;">
        <div :class="{'hidden' : hidden}" class="input-item">
          <div>
            <span class="input-title">入库单号 </span>
            <el-input :disabled="true" v-model="putInStorageNo" class="search-input search-input-short" placeholder="请输入入库单号" size="small" maxlength="20" clearable/>
          </div>
          <div style="margin-top: 10px">
            <span class="input-title"> 送片单号 </span>
            <el-input :disabled="true" v-model="listNum" class="search-input" placeholder="请选择送片单" size="small" maxlength="20" clearable/>
          </div>
        </div>
        <div :class="{'hidden' : hidden}" class="input-item">
          <div>
            <span class="input-title">单据类型 </span>
            <el-select :disabled="receiptsDisabled" v-model="itemType" class="search-input-short" size="small" filterable>
              <el-option
                v-for="item in receiptsOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div style="margin-top: 10px">
            <span class="input-title">入库时间 </span>
            <el-date-picker
              v-model="putInTime"
              class="search-input-short"
              type="date"
              size="small"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            />
          </div>
        </div>
        <div :class="{'hidden' : hidden}" class="input-item">
          <div>
            <span class="input-title">制单人 </span>
            <el-input :disabled="true" v-model="maker" class="search-input search-input-short" placeholder="请输入制单人" size="small" maxlength="20" clearable/>
          </div>
          <div style="margin-top: 10px">
            <span class="input-title">入库柜位 </span>
            <el-select v-model="cabinet" class="search-input search-input-short" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in cabinetList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
        </div>
        <div :class="{'hidden' : hidden}" class="input-item">
          <div>
            <span class="input-title">入库类型 </span>
            <el-select v-model="putInStorageType" class="search-input search-input-short" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in putInTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
            <el-checkbox v-model="isPrint">打印标签</el-checkbox>
          </div>
          <div style="margin-top: 10px">
            <span class="input-title">备注 </span>
            <el-input v-model="putInRemark" class="dialog-input" placeholder="请输入备注" type="text" size="small" maxlength="50" clearable/>
          </div>
        </div>
        <div :class="{'hidden' : hidden}" class="clear-both"/>
        <div :class="{'hidden' : hidden}" class="cut-line" style="margin-bottom: 0px"/>
        <div>
          <div class="input-item">
            <el-select v-model="selectType" class="search-input" style="width: 90px;" size="small" placeholder="请选择" filterable @change="boxOrRunChange">
              <el-option
                v-for="item in boxOrRun"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
            <el-select v-model="selectedCode" class="search-input" style="width: 180px;" size="small" filterable placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item"
                :label="item"
                :value="item"/>
            </el-select>
            <el-button
              class="margin-left"
              size="small"
              type="primary"
              icon="el-icon-search"
              @click="handleSearch" >查 询</el-button>
            <el-button
              size="small"
              type="danger"
              @click="clearList"
            >
              <svg-icon icon-class="clear"/> 清空列表
            </el-button>
            <span>
              <span v-for="(item, index) in group" :key="item">
                <span style="margin-left: 20px;font-weight: bold">{{ index.toString().substr(9) }}:</span>
                <span style="margin-right: 30px">{{ item }}</span>
              </span>
              <span class="input-title" style="margin-left: 20px">当前片数:</span>
              <span style="margin-right: 30px">{{ sliceTotalNum }}</span>
              <span class="input-title">总计:</span>
              <span>{{ list.length }}</span>
            </span>
          </div>
          <div class="input-item" style="float: right; margin-right: 0">
            <el-button
              v-if="hidden"
              size="small"
              type="info"
              @click="hidden = false"
            >
              <svg-icon icon-class="xiangxia"/> 展开
            </el-button>
            <el-button
              v-if="!hidden"
              size="small"
              type="info"
              @click="setHidden"
            >
              <svg-icon icon-class="xiangshang"/> 收起
            </el-button>
            <el-button
              :disabled="list.length === 0"
              class="float-right"
              size="small"
              type="primary"
              @click="handleAdd" ><svg-icon icon-class="add"/> 保存入库</el-button>
          </div>
          <div class="clear-both"/>
        </div>
      </div>
    </div>
    <div :class="{'height' : hidden}" class="app-container wafer-table">
      <pl-table
        v-loading="listLoading"
        :datas="list"
        :row-height="37"
        class="broad-scrollbar-table"
        element-loading-text="拼命加载中"
        header-drag-style
        use-virtual
        border
        fit
      >
        <pl-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </pl-table-column>
        <pl-table-column align="center" label="RunID" prop="runId" width="120" show-overflow-tooltip fixed/>
        <pl-table-column align="center" label="WaferID" prop="waferId" width="180" show-overflow-tooltip fixed/>
        <pl-table-column align="center" label="柜位" prop="arkName" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="盒号" prop="boxNo" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="片位" prop="sequence" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="衬底工艺" prop="subType" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="衬底厂家" prop="supplier" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="镭刻号" prop="laserMark" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="目检" prop="inspection" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="PL_WD" prop="plWd" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="PL_WD_STD" prop="plWtd" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="PL.I.I" prop="plIi" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="PL.I.I.Std" prop="plIiStd" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="PL_PD" prop="plPd" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="PL_Ref" prop="plRef" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="LOP(460)" prop="lop460" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="综合判定" prop="judge" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="ESD(200)" prop="esd200v" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="ESD去坏(50V)" prop="esd50v" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="综合良率" prop="yield" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="VF1 Yield" prop="vf1Yield" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="Ir  Yield" prop="lrYield" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="VZ  Yield" prop="vzYield" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="VF1" prop="vf1" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="VF2" prop="vf2" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="VF3" prop="vf3" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="WLD1" prop="wld" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="Ir" prop="lr" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="VZ" prop="vz" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="IV" prop="iv" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="WLD(PL-COW)" prop="kVal" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="预估COW波长" prop="cowWd" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="ESD(400)" prop="esd400" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="验证版型" prop="yzType" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="生产类型" prop="product" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="IR<0.2 yield" prop="yieldIr02" width="140" show-overflow-tooltip/>
        <pl-table-column align="center" label="Recipe_Name" prop="recipe" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="外延盒号" prop="wyBoxNo" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="HW" prop="hw1" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="B.S" prop="bs" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="目检原因" prop="visualReason" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="光色" prop="color" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="衬底类型" prop="sub" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="机台" prop="machine" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="ESD去坏（500V）" prop="esd500" width="140" show-overflow-tooltip/>
        <pl-table-column align="center" label="ESD去坏（300V）" prop="esd300" width="140" show-overflow-tooltip/>
        <pl-table-column align="center" label="BOW" prop="bow" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="PLINT_STD" prop="plintStd" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="Avg_Vf4" prop="avgVf4" width="120" show-overflow-tooltip/>
        <pl-table-column align="center" label="Thyristor良率" prop="thyristor" width="120" show-overflow-tooltip/>
      </pl-table>
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
            <el-input v-model="listNo" class="search-input-short" placeholder="请输入单号" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">WaferID</span>
            <el-input v-model="WaferID" class="search-input-short" placeholder="请输入WaferID" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">单据类型 </span>
            <el-select v-model="receipts" class="search-input-short" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in receiptsOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">送片时间</span>
            <el-date-picker
              v-model="beginDate"
              :picker-options="pickerOptionsStart"
              :editable="false"
              class="search-input-short"
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
              class="search-input-short"
              size="small"
              type="date"
              placeholder="选择结束日期"
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
            @click="clearDialogSearch" > <svg-icon icon-class="clear"/> 重 置</el-button>
          <el-button
            :disabled="billList.length === 0"
            class="margin-left"
            size="small"
            type="primary"
            @click="handleExportDialog"
          ><svg-icon icon-class="export"/> 导 出
          </el-button>
        </div>
      </div>
      <div class="table-top-btn-group">
        <div
          :class="{'active':isActive === 0}"
          @click="navClick(0, 1)"
        >
          Bill信息
        </div>
        <div
          :class="{'active':isActive === 1}"
          @click="navClick(1, 1)"
        >
          明细TOL: <span v-text="waferTol"/>
        </div>
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
        <el-table-column label="单号" align="center" prop="code" width="100" show-overflow-tooltip/>
        <el-table-column label="单据类型" align="center" prop="type" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 0" style="color: #009494;font-weight: bold">正常片</span>
            <span v-if="scope.row.type === 1" style="color: #f66;font-weight: bold">报废片</span>
          </template>
        </el-table-column>
        <el-table-column label="光色" align="center" prop="color" width="60" show-overflow-tooltip/>
        <el-table-column label="尺寸" align="center" prop="size" width="80" show-overflow-tooltip/>
        <el-table-column label="Wafer数量" align="center" prop="wafer" width="80" show-overflow-tooltip/>
        <el-table-column label="Run数量" align="center" prop="run" width="80" show-overflow-tooltip/>
        <el-table-column label="Box数量" align="center" prop="box" width="120" show-overflow-tooltip/>
        <el-table-column label="制单人" align="center" prop="creator" width="120" show-overflow-tooltip/>
        <el-table-column label="制单日期" align="center" prop="createTime" width="120" show-overflow-tooltip/>
        <el-table-column label="审核人" align="center" prop="auditor" width="120" show-overflow-tooltip/>
        <el-table-column label="审核日期" align="center" prop="auditTime" width="120" show-overflow-tooltip/>
        <el-table-column label="Remark" align="center" prop="remark" width="120" show-overflow-tooltip/>
        <el-table-column label="入库备注" align="center" prop="auditRemark" width="120" show-overflow-tooltip/>
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
      <div v-show="isActive === 1" style="height: 540px;" class="wafer-table-send">
        <pl-table
          v-loading="listLoading"
          :datas="waferList"
          :row-height="37"
          class="mocvd-table broad-scrollbar-table"
          height="500px"
          element-loading-text="拼命加载中"
          header-drag-style
          use-virtual
          border
          fit
          stripe>
          <pl-table-column align="center" label="序号" width="50" fixed>
            <template slot-scope="scope">
              {{ scope.$index+1 }}
            </template>
          </pl-table-column>
          <pl-table-column align="center" label="RunID" prop="runId" width="120" show-overflow-tooltip fixed/>
          <pl-table-column align="center" label="WaferID" prop="waferId" width="120" show-overflow-tooltip fixed/>
          <pl-table-column align="center" label="衬底工艺" prop="subType" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="衬底厂家" prop="supplier" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="镭刻号" prop="laserMark" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="目检" prop="inspection" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="PL_WD" prop="plWd" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="PL_WD_STD" prop="plWtd" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="PL.I.I" prop="plIi" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="PL.I.I.Std" prop="plIiStd" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="PL_PD" prop="plPd" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="PL_Ref" prop="plRef" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="LOP(460)" prop="lop460" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="综合判定" prop="judge" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="ESD(200)" prop="esd200v" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="ESD去坏(50V)" prop="esd50v" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="综合良率" prop="yield" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="VF1 Yield" prop="vf1Yield" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="Ir  Yield" prop="lrYield" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="VZ  Yield" prop="vzYield" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="VF1" prop="vf1" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="VF2" prop="vf2" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="WLD1" prop="wld" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="Ir" prop="lr" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="VZ" prop="vz" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="IV" prop="iv" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="WLD(PL-COW)" prop="kVal" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="预估COW波长" prop="cowWd" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="ESD(400)" prop="esd400" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="验证版型" prop="yzType" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="生产类型" prop="product" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="IR<0.2 yield" prop="yieldIr02" width="140" show-overflow-tooltip/>
          <pl-table-column align="center" label="Recipe_Name" prop="recipe" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="外延盒号" prop="wyBoxNo" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="HW" prop="hw1" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="B.S" prop="bs" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="目检原因" prop="visualReason" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="光色" prop="color" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="衬底类型" prop="sub" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="机台" prop="machine" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="ESD去坏（500V）" prop="esd500" width="140" show-overflow-tooltip/>
          <pl-table-column align="center" label="ESD去坏（300V）" prop="esd300" width="140" show-overflow-tooltip/>
          <pl-table-column align="center" label="BOW" prop="bow" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="PLINT_STD" prop="plintStd" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="Avg_Vf4" prop="avgVf4" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="Thyristor良率" prop="thyristor" width="120" show-overflow-tooltip/>
        </pl-table>
      </div>
      <el-pagination
        v-if="isActive === 0"
        :current-page="pageNum"
        :page-sizes="[15, 25, 50]"
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
      <div class="search-box record-search" style="padding-bottom: 15px;overflow: hidden">
        <div class="input-item">
          <span class="input-title" style="width: 35px;">单号</span>
          <el-input v-model="listNo" class="search-input-short" placeholder="请输入单号" size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item">
          <span class="input-title">WaferID</span>
          <el-input v-model="WaferID" class="search-input-short" placeholder="请输入WaferID" size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item">
          <span class="input-title">单据类型 </span>
          <el-select v-model="receipts" class="search-input-short" style="width: 100px;" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in receiptsOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">制单时间</span>
          <el-date-picker
            v-model="beginDate"
            :picker-options="pickerOptionsStart"
            :editable="false"
            class="search-input-short"
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
            class="search-input-short"
            size="small"
            type="date"
            placeholder="选择结束日期"
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
          @click="clearDialogSearch" > <svg-icon icon-class="clear"/> 重 置</el-button>
        <el-button
          :disabled="recordList.length === 0"
          class="margin-left"
          size="small"
          type="primary"
          @click="handleExport"
        ><svg-icon icon-class="export"/> 导 出
        </el-button>
      </div>
      <div class="table-top-btn-group">
        <div
          :class="{'active':isActive === 0}"
          @click="navClick(0, 2)"
        >
          Bill信息
        </div>
        <div
          :class="{'active':isActive === 1}"
          @click="navClick(1, 2)"
        >
          明细TOL: <span v-text="waferTol"/>
        </div>
        <el-button
          class="float-right"
          size="small"
          type="primary"
          @click="printFun"
        ><svg-icon icon-class="print"/> 打印标签
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
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="入库单号" align="center" prop="billNo" width="120" show-overflow-tooltip/>
        <el-table-column label="入库类型" align="center" prop="typeName" width="120" show-overflow-tooltip/>
        <el-table-column label="单据类型" align="center" prop="type" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.billType === '1'" style="font-weight: bold;color: #f56c6c">报废单</span>
            <span v-if="scope.row.billType === '0'" style="font-weight: bold;color: #009494">正常单</span>
          </template>
        </el-table-column>
        <el-table-column label="光色" align="center" prop="color" width="120" show-overflow-tooltip/>
        <el-table-column label="尺寸" align="center" prop="size" width="120" show-overflow-tooltip/>
        <el-table-column label="Wafer数量" align="center" prop="count" width="120" show-overflow-tooltip/>
        <el-table-column label="制单人" align="center" prop="userName" width="120" show-overflow-tooltip/>
        <el-table-column label="制单日期" align="center" prop="createTime" width="100" show-overflow-tooltip/>
        <el-table-column label="送片单号" align="center" prop="sendNo" width="120" show-overflow-tooltip/>
        <!--<el-table-column label="审核日期" align="center" prop="alnTaskId" width="120" show-overflow-tooltip/>-->
        <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip/>
      </el-table>
      <!--wafer信息-->
      <el-table
        v-loading="listLoading"
        v-show="isActive === 1"
        :data="waferList"
        class="mocvd-table"
        height="500px"
        element-loading-text="拼命加载中"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="RunID" prop="runId" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="WaferID" prop="waferId" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="柜位" prop="arkName" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="盒号" prop="boxNo" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="片位" prop="sequence" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="衬底工艺" prop="subType" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="衬底厂家" prop="supplier" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="镭刻号" prop="laserMark" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="目检" prop="inspection" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="PL_WD" prop="plWd" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="PL_WD_STD" prop="plWtd" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="PL.I.I" prop="plIi" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="PL.I.I.Std" prop="plIiStd" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="PL_PD" prop="plPd" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="PL_Ref" prop="plRef" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="LOP(460)" prop="lop460" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="综合判定" prop="judge" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="ESD(200)" prop="esd200v" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="ESD去坏(50V)" prop="esd50v" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="综合良率" prop="yield" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="VF1 Yield" prop="vf1Yield" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="Ir  Yield" prop="lrYield" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="VZ  Yield" prop="vzYield" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="VF1" prop="vf1" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="VF2" prop="vf2" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="WLD1" prop="wld" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="Ir" prop="lr" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="VZ" prop="vz" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="IV" prop="iv" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="WLD(PL-COW)" prop="kVal" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="预估COW波长" prop="cowWd" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="ESD(400)" prop="esd400" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="验证版型" prop="yzType" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="生产类型" prop="product" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="IR<0.2 yield" prop="yieldIr02" width="140" show-overflow-tooltip/>
        <el-table-column align="center" label="Recipe_Name" prop="recipe" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="外延盒号" prop="wyBoxNo" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="HW" prop="hw1" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="B.S" prop="bs" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="目检原因" prop="visualReason" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="光色" prop="color" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="衬底类型" prop="sub" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="机台" prop="machine" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="ESD去坏（500V）" prop="esd500" width="140" show-overflow-tooltip/>
        <el-table-column align="center" label="ESD去坏（300V）" prop="esd300" width="140" show-overflow-tooltip/>
        <el-table-column align="center" label="BOW" prop="bow" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="PLINT_STD" prop="plintStd" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="Avg_Vf4" prop="avgVf4" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="Thyristor良率" prop="thyristor" width="120" show-overflow-tooltip/>
      </el-table>
      <el-pagination
        v-if="isActive === 0"
        :current-page="pageNum"
        :page-sizes="[15, 25, 50]"
        :page-size="pageSize"
        :total="totalPage"
        class="pagination"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="recordSizeChange"
        @current-change="recordCurrentChange"
      />
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  @media (max-width: 1600px) {
    .app-container>>> td .cell{
      line-height: 16px !important;
      height: 16px !important;
    }
    .app-container>>> td{
      height: 16px !important;
    }
    .app-container>>> .el-table tr .el-button--mini {
      padding: 0px 7px !important;
    }
    .header-btn-group>>> .el-button--small {
      padding: 9px 20px;
    }
    .broad-scrollbar-table>>> .el-table__fixed-body-wrapper {
      height: calc(100% - 21px) !important;
    }
  }
  /*.wafer-table-send>>> td{*/
  /*  height: 37px !important;*/
  /*}*/
  .no-padding{
    padding-top: 0px;
  }
  .record-search .input-item{
    margin-top: 10px;
  }
  .height.wafer-table>>> .el-table--scrollable-x{
    height: calc(100vh - 235px) !important;
  }
  .wafer-table>>> .el-table--scrollable-x{
    height: calc(100vh - 393px) !important;
  }
  .wafer-table>>> .el-table__body-wrapper{
    height: calc(100% - 38px) !important;
  }
  .wafer-table-send>>> .el-table--scrollable-x{
    height: 540px !important;
  }
  .wafer-table-send>>> .el-table__body-wrapper{
    height: calc(100% - 38px) !important;
  }
  .no-border{
    border-bottom: none !important;
    padding-bottom: 0px;
  }
  .hidden{
    display: none;
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
    height: calc(100vh - 365px);
  }
  .height.app-container{
    position: relative;
    height: calc(100vh - 208px);
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
    padding-top: 10px;
    padding-bottom: 60px;
  }
  .send-dialog .input-item{
    margin-right: 15px;
  }
</style>
