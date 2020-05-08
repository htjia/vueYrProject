<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto">
      <el-button
        :disabled="list.length === 0"
        class="float-right margin-left"
        size="small"
        type="primary"
        @click="handleExport" ><svg-icon icon-class="export"/> 导出</el-button>
      <el-button
        :disabled="list.length === 0"
        class="float-right"
        size="small"
        type="primary"
        @click="handleSetRemark" ><svg-icon icon-class="shezhi"/> 设置备注</el-button>
      <div class="tab-control" style="margin-bottom: 0">
        <span
          :class="{activeTab: activeTabIndex === 0}"
          @click="tabClick(0)"
        >基础</span>
        <span
          :class="{activeTab: activeTabIndex === 1}"
          class="has-margin-left"
          @click="tabClick(1)"
        >外延数据</span>
        <span
          :class="{activeTab: activeTabIndex === 2}"
          class="has-margin-left"
          @click="tabClick(2)"
        >COW</span>
        <span
          :class="{activeTab: activeTabIndex === 3}"
          class="has-margin-left"
          @click="tabClick(3)"
        >其它</span>
      </div>
      <div v-if="activeTabIndex === 0" style="height: auto;">
        <el-row>
          <el-col :span="24">
            <div class="input-item">
              <span class="input-title" style="width: 50px">RunID </span>
              <el-input v-model="searchKey.runId" class="search-input" placeholder="请输入RunID" size="small" maxlength="20" clearable/>
            </div>
            <div class="input-item">
              <span class="input-title" style="width: 35px">柜位 </span>
              <el-input v-model="searchKey.gw" class="search-input" placeholder="请输入柜位" size="small" maxlength="20" clearable/>
            </div>
            <div class="input-item">
              <span class="input-title" style="width: 50px">镭刻号 </span>
              <el-input v-model="searchKey.lkh" class="search-input" placeholder="请输入镭刻号" size="small" maxlength="20" clearable/>
            </div>
            <!--<div class="input-item">
              <span class="input-title" style="width: 100px;">PC投片型号</span>
              <el-select v-model="searchKey.tplx" class="search-input" size="small" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in modelList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"/>
              </el-select>
            </div>-->
            <div class="input-item">
              <span class="input-title">库存状态 </span>
              <el-select v-model="searchKey.kczt" class="search-input" size="small" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in storeOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </div>
            <div class="input-item">
              <span class="input-title">单据类型 </span>
              <el-select v-model="searchKey.ck" class="search-input" size="small" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in poleOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </div>
            <div class="input-item">
              <span class="input-title">WaferID </span>
              <el-input v-model="searchKey.waferId" class="search-input" placeholder="请输入waferID" size="small" maxlength="20" clearable/>
            </div>
            <div class="input-item">
              <span class="input-title" style="width: 35px">盒号 </span>
              <el-input v-model="searchKey.hh" class="search-input" placeholder="请输入盒号" size="small" maxlength="20" clearable/>
            </div>
            <div class="input-item">
              <span class="input-title">验证版型 </span>
              <el-select v-model="searchKey.yzbx" class="search-input" size="small" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in verifyList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"/>
              </el-select>
            </div>
            <div class="input-item">
              <span class="input-title" style="width: 35px">尺寸 </span>
              <el-select v-model="searchKey.cc" class="search-input" size="small" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in substrateMeasureList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"/>
              </el-select>
            </div>
            <div class="input-item">
              <span class="input-title" style="width: 50px">数据源 </span>
              <el-select v-model="searchKey.qy" class="search-input" size="small" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in dataOptions"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"/>
              </el-select>
            </div>
            <div class="input-item">
              <span class="input-title" style="width: 35px">时间 </span>
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
              <el-button
                size="small"
                type="primary"
                icon="el-icon-search"
                @click="handleSearchBth(1)" >查 询</el-button>
              <el-button
                size="small"
                type="danger"
                @click="clearSearch(1)"
              >
                <svg-icon icon-class="clear"/> 重 置
              </el-button>
            </div>
          </el-col>
        </el-row>
        <div class="clear-both"/>
      </div>
      <div v-if="activeTabIndex === 1" style="height: auto;">
        <el-row>
          <el-col :span="22">
            <div class="input-item">
              <span class="input-title">衬底工艺</span>
              <el-select v-model="searchKey.subType" class="search-input" size="small" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in substrateTypeList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"/>
              </el-select>
            </div>
            <div class="input-item">
              <span class="input-title" style="width: 40px;">目检 </span>
              <el-select v-model="searchKey.mj" class="search-input" style="width: 150px" size="small" placeholder="请选择" filterable multiple collapse-tags>
                <el-option
                  v-for="item in levelList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"/>
              </el-select>
            </div>
            <div class="input-item">
              <span class="input-title">PL_WD </span>
              <el-input v-model="searchKey.plWdMin" class="search-input-short" size="small" maxlength="20" clearable/> -
              <el-input v-model="searchKey.plWdMax" class="search-input-short" size="small" maxlength="20" clearable/>
            </div>
            <div class="input-item">
              <span class="input-title">PL.I.I </span>
              <el-input v-model="searchKey.plilMin" class="search-input-short" size="small" maxlength="20" clearable/> -
              <el-input v-model="searchKey.plilMax" class="search-input-short" size="small" maxlength="20" clearable/>
            </div>
            <div class="input-item">
              <span class="input-title">PL_REF </span>
              <el-input v-model="searchKey.plRepMin" class="search-input-short" size="small" maxlength="20" clearable/> -
              <el-input v-model="searchKey.plRepMax" class="search-input-short" size="small" maxlength="20" clearable/>
            </div>
            <div class="input-item">
              <span class="input-title">衬底厂家 </span>
              <el-input v-model="searchKey.subcom" class="search-input" size="small" maxlength="20" clearable/>
            </div>
            <div class="input-item">
              <span class="input-title">综合判定 </span>
              <el-input v-model="searchKey.zhpd" class="search-input" size="small" maxlength="20" clearable/>
            </div>
            <div class="input-item">
              <span class="input-title" style="width: 100px;">PL_WD STD</span>
              <el-input v-model="searchKey.stdMin" class="search-input-short" size="small" maxlength="20" clearable/> -
              <el-input v-model="searchKey.stdMax" class="search-input-short" size="small" maxlength="20" clearable/>
            </div>
            <div class="input-item">
              <span class="input-title">PL_PD </span>
              <el-input v-model="searchKey.plPdMin" class="search-input-short" size="small" maxlength="20" clearable/> -
              <el-input v-model="searchKey.plPdMax" class="search-input-short" size="small" maxlength="20" clearable/>
            </div>
            <div class="input-item">
              <span class="input-title">LOP(460) </span>
              <el-input v-model="searchKey.lopMin" class="search-input-short" size="small" maxlength="20" clearable/> -
              <el-input v-model="searchKey.lopMax" class="search-input-short" size="small" maxlength="20" clearable/>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="clear-both">
              <el-button
                class="float-right margin-top"
                size="small"
                type="danger"
                @click="clearSearch(2)"
              >
                <svg-icon icon-class="clear"/> 重 置
              </el-button>
            </div>
            <div class="clear-both">
              <el-button
                class="float-right margin-top"
                size="small"
                type="primary"
                icon="el-icon-search"
                @click="handleSearchBth(2)" >查 询</el-button>
            </div>
          </el-col>
        </el-row>
        <div class="clear-both"/>
      </div>
      <div v-if="activeTabIndex === 2" class="cow" style="height: auto;">
        <el-row>
          <el-col :span="22">
            <div class="input-item">
              <span class="input-title">ESD(200V) </span>
              <el-input v-model="searchKey.esd200Min" class="search-input-short" size="small" maxlength="20" clearable/> -
              <el-input v-model="searchKey.esd200Max" class="search-input-short" size="small" maxlength="20" clearable/>
            </div>
            <div class="input-item">
              <span class="input-title">ESD(50V) </span>
              <el-input v-model="searchKey.esd50Min" class="search-input-short" size="small" maxlength="20" clearable/> -
              <el-input v-model="searchKey.esd50Max" class="search-input-short" size="small" maxlength="20" clearable/>
            </div>
            <div class="input-item">
              <span class="input-title">综合良率</span>
              <el-input v-model="searchKey.zhllMin" class="search-input-short" size="small" maxlength="20" clearable/> -
              <el-input v-model="searchKey.zhllMax" class="search-input-short" size="small" maxlength="20" clearable/>
            </div>
            <div class="input-item">
              <span class="input-title">IR YIELD</span>
              <el-input v-model="searchKey.irYieldMin" class="search-input-short" size="small" maxlength="20" clearable/> -
              <el-input v-model="searchKey.irYieldMax" class="search-input-short" size="small" maxlength="20" clearable/>
            </div>
            <div class="input-item">
              <span class="input-title">VF1 </span>
              <el-input v-model="searchKey.vf1Min" class="search-input-short" size="small" maxlength="20" clearable/> -
              <el-input v-model="searchKey.vf1Max" class="search-input-short" size="small" maxlength="20" clearable/>
            </div>
            <div class="input-item">
              <span class="input-title">VF2 </span>
              <el-input v-model="searchKey.vf2Min" class="search-input-short" size="small" maxlength="20" clearable/> -
              <el-input v-model="searchKey.vf2Max" class="search-input-short" size="small" maxlength="20" clearable/>
            </div>
            <div class="input-item">
              <span class="input-title">WLD1</span>
              <el-input v-model="searchKey.wld1Min" class="search-input-short" size="small" maxlength="20" clearable/> -
              <el-input v-model="searchKey.wld2Max" class="search-input-short" size="small" maxlength="20" clearable/>
            </div>
            <div class="input-item">
              <span class="input-title">VZ </span>
              <el-input v-model="searchKey.vzMin" class="search-input-short" size="small" maxlength="20" clearable/> -
              <el-input v-model="searchKey.vzMax" class="search-input-short" size="small" maxlength="20" clearable/>
            </div>
            <div class="input-item">
              <span class="input-title">VF1_YIELD</span>
              <el-input v-model="searchKey.vfYieldMin" class="search-input-short" size="small" maxlength="20" clearable/> -
              <el-input v-model="searchKey.vfYieldMax" class="search-input-short" size="small" maxlength="20" clearable/>
            </div>
            <div class="input-item">
              <span class="input-title">VZ_YIELD</span>
              <el-input v-model="searchKey.vzYieldMin" class="search-input-short" size="small" maxlength="20" clearable/> -
              <el-input v-model="searchKey.vzYieldMax" class="search-input-short" size="small" maxlength="20" clearable/>
            </div>
            <div class="input-item">
              <span class="input-title">IR</span>
              <el-input v-model="searchKey.irMin" class="search-input-short" size="small" maxlength="20" clearable/> -
              <el-input v-model="searchKey.irMax" class="search-input-short" size="small" maxlength="20" clearable/>
            </div>
            <div class="input-item">
              <span class="input-title">IV</span>
              <el-input v-model="searchKey.ivMin" class="search-input-short" size="small" maxlength="20" clearable/> -
              <el-input v-model="searchKey.ivMax" class="search-input-short" size="small" maxlength="20" clearable/>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="clear-both">
              <el-button
                class="float-right margin-top"
                size="small"
                type="danger"
                @click="clearSearch(3)"
              >
                <svg-icon icon-class="clear"/> 重 置
              </el-button>
            </div>
            <div class="clear-both">
              <el-button
                class="float-right margin-top"
                size="small"
                type="primary"
                icon="el-icon-search"
                @click="handleSearchBth(3)" >查 询</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-if="activeTabIndex === 3" style="height: auto;">
        <div class="input-item">
          <span class="input-title">产地 </span>
          <el-select v-model="searchKey.cd" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in storehouseTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">生产类型 </span>
          <el-select v-model="searchKey.sclx" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in produceTypeList"
              :key="item.name"
              :label="item.name"
              :value="item.name"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title" style="width: 110px;">WLD(PL-COW)</span>
          <el-input v-model="searchKey.plCowMin" class="search-input-short" size="small" maxlength="20" clearable/> -
          <el-input v-model="searchKey.plCowMax" class="search-input-short" size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item">
          <span class="input-title" style="width: 110px;">预估COW波长</span>
          <el-input v-model="searchKey.yCowMin" class="search-input-short" size="small" maxlength="20" clearable/> -
          <el-input v-model="searchKey.yCowMax" class="search-input-short" size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="handleSearchBth(4)" >查 询</el-button>
          <el-button
            size="small"
            type="danger"
            @click="clearSearch(4)"
          >
            <svg-icon icon-class="clear"/> 重 置
          </el-button>
        </div>
        <div class="clear-both"/>
      </div>
    </div>
    <div :class="{'app-container1': activeTabIndex === 0 || activeTabIndex === 1, 'app-container2': activeTabIndex === 2, 'app-container3': activeTabIndex === 3,}" class="app-container">
      <el-table
        v-loading="listLoading"
        ref="runTable"
        :data="list"
        :class="{'height3': activeTabIndex === 3,}"
        height="550px"
        highlight-current-row
        class="broad-scrollbar-table"
        element-loading-text="拼命加载中"
        border
        fit
        @row-click="rowClick"
      >
        <el-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="RunID" prop="runId" width="120" show-overflow-tooltip fixed/>
        <el-table-column align="center" label="WaferID" prop="waferId" width="180" show-overflow-tooltip fixed/>
        <el-table-column align="center" label="柜位" prop="arkName" width="70" show-overflow-tooltip/>
        <el-table-column align="center" label="盒号" prop="boxNo" width="100" show-overflow-tooltip/>
        <el-table-column align="center" label="片位" prop="sequence" width="70" show-overflow-tooltip/>
        <el-table-column align="center" label="衬底工艺" prop="subType" width="80" show-overflow-tooltip/>
        <el-table-column align="center" label="衬底厂家" prop="supplier" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="镭刻号" prop="laserMark" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="目检" prop="inspection" width="120" show-overflow-tooltip/>
        <!--<el-table-column align="center" label="PC投片型号" prop="model" width="120" show-overflow-tooltip/>-->
        <el-table-column align="center" label="尺寸" prop="size" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="单据类型" prop="billType" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="数据源" prop="sourceType" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="入库日期" prop="createTime" width="160" show-overflow-tooltip/>
        <el-table-column align="center" label="产地" prop="storeType" width="120" show-overflow-tooltip/>
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
        <el-table-column align="center" label="VF3" prop="vf3" width="120" show-overflow-tooltip/>
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
        <el-table-column align="center" label="库存状态" prop="status" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="备注" prop="remark" width="120" show-overflow-tooltip/>
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
      v-drag
      :close-on-click-modal="false"
      :visible.sync="setRemarkDialogVisible"
      title="设置备注"
      width="500px"
      @close="handleClose('remarkForm')">
      <el-form :model="remarkForm" status-icon label-width="85px" label-position="right">
        <el-form-item label="WaferID ">
          <el-input :disabled="true" v-model="remarkForm.waferId" maxlength="20"/>
        </el-form-item>
        <el-form-item label="备注 ">
          <el-input v-model="remarkForm.remark" type="textarea" placeholder="请输入备注" maxlength="50"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('remarkForm')">确 定</el-button>
        <el-button @click="resetForm('remarkForm')">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .height1{
    height: 550px;
  }
  .height2{
    height: 550px;
  }
  .height3{
    height: 590px!important;
  }
  .broad-scrollbar-table>>> .cell{
    line-height: 30px;
  }
  .broad-scrollbar-table>>> td{
    height: 30px;
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
  .app-container1.app-container{
    position: relative;
    height: calc(100vh - 303px);
  }
  .app-container2.app-container{
    position: relative;
    height: calc(100vh - 303px);
  }
  .app-container3.app-container{
    position: relative;
    height: calc(100vh - 262px);
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
  .input-title{
    width: 65px;
  }
  .cow .input-title{
    width: 75px;
  }
  .left-content{
    border: 1px solid #b2dfdf;
    margin-top: 10px;
    padding: 5px 10px 10px 10px;
  }
  .dialog-input{
    width: 232px;
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
    width: 74px;
  }
  .module-title-text{
    margin-bottom: 10px;
  }
  .search-input{
    width: 120px;
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
  .header-search-add>>> .el-input--suffix .el-input__inner {
    padding-right: 5px !important;
  }
</style>
