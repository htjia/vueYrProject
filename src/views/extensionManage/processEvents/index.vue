<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0">
      <div class="search-box">
        <div class="left-search-box" style="margin-left: -10px;">
          <div class="input-item">
            <span class="input-title">RunID </span>
            <el-input v-model="runId" class="search-input" size="small" placeholder="请输入RunID" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">机台 </span>
            <el-select v-model="machineValue" class="search-input" size="small" placeholder="请选择" filterable multiple collapse-tags>
              <el-option
                v-for="item in machineOptions"
                :key="item.id"
                :label="item.code"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">炉次 </span>
            <el-select v-model="furnaceValue" class="search-input" size="small" placeholder="请选择" filterable multiple clearable collapse-tags>
              <el-option
                v-for="item in furnaceOptions"
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
            style="margin-top: 15px"
            class="float-right margin-left"
            size="small"
            type="danger"
            @click="clearAll"
          >
            <svg-icon icon-class="clear"/> 重 置
          </el-button>
          <el-button
            style="margin-top: 15px"
            class="float-right"
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
          Run信息
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
        >
          <svg-icon icon-class="export"/> 导出
        </el-button>
      </div>
      <!--run信息-->
      <el-table
        v-loading="listLoading"
        v-show="isActive === 0"
        ref="listTabel"
        :data="list"
        :cell-style="tableRowClassColor"
        class="broad-scrollbar-table"
        height="calc(100vh - 312px)"
        element-loading-text="拼命加载中"
        highlight-current-row
        border
        fit
        @current-change="handleCurrentChange"
        @cell-dblclick="cellDblclick"
        @sort-change="getSort"
      >
        <el-table-column fixed label="RunID" align="center" prop="run_id" sortable="custom" width="120px"/>
        <el-table-column label="工艺事件管理" align="center">
          <el-table-column label="PM炉次" align="center" prop="pm" sortable="custom"/>
          <el-table-column label="设备事件" align="center" width="120px" prop="sbsj" sortable="custom">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isChecked" v-model="scope.row.sbsj" class="search-input" size="small" style="width:90%" maxlength="20" clearable/>
              <span v-if="!scope.row.isChecked">{{ scope.row.sbsj }}</span>
            </template>
          </el-table-column>
          <el-table-column label="工艺事件" align="center" width="120px" prop="gysj" sortable="custom">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isChecked" v-model="scope.row.gysj" class="search-input" size="small" style="width:90%" maxlength="20" clearable/>
              <span v-if="!scope.row.isChecked">{{ scope.row.gysj }}</span>
            </template>
          </el-table-column>
          <el-table-column label="结论" align="center" width="120px" prop="jl" sortable="custom">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isChecked" v-model="scope.row.jl" class="search-input" size="small" style="width:90%" maxlength="20" clearable/>
              <span v-if="!scope.row.isChecked">{{ scope.row.jl }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150px">
            <template slot-scope="scope">
              <el-button
                v-if="!scope.row.isChecked"
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="handleEdit(scope.row)" >编 辑</el-button>
              <el-button
                v-if="scope.row.isChecked"
                size="mini"
                @click="cancelt(scope.row)" ><svg-icon icon-class="clear"/> 取 消</el-button>
              <el-button
                v-if="scope.row.isChecked"
                size="mini"
                type="primary"
                icon="el-icon-check"
                @click="handleSave(scope.row)" >保 存</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="openReset(scope.row)" ><svg-icon icon-class="clear"/> 重 置</el-button>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="基础信息" align="center">
          <el-table-column label="验证版型" align="center" prop="editionType" width="120px" sortable="custom"/>
          <el-table-column label="衬底厂家" align="center" prop="cdcj" width="120px" sortable="custom"/>
          <el-table-column label="Platter_No" align="center" prop="dpbh" width="120px" sortable="custom"/>
          <el-table-column label="Recipe" align="center" prop="recipe_name" width="120px" sortable="custom"/>
          <el-table-column label="投片数量" align="center" prop="toupian" width="100px" sortable="custom"/>
          <el-table-column label="运行时间" align="center" prop="run_time" width="100px" sortable="custom" show-overflow-tooltip/>
          <el-table-column label="尺寸" align="center" prop="cdcc" sortable="custom"/>
          <el-table-column label="机台号" align="center" prop="jth" sortable="custom"/>
          <el-table-column label="炉号" align="center" prop="lh" sortable="custom"/>
        </el-table-column>
        <el-table-column label="PL_WP" align="center">
          <el-table-column label="1(Outer)" align="center" prop="pl_wp_1" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.pl_wp_1 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="2(Mid)" align="center" prop="pl_wp_2" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.pl_wp_2 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="3(Mid)" align="center" prop="pl_wp_3" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.pl_wp_3 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="4(Inner)" align="center" prop="pl_wp_4" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.pl_wp_4 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="All" align="center" prop="pl_wp" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.pl_wp | valueFilter }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="PL_WD" align="center">
          <el-table-column label="1(Outer)" align="center" prop="pl_wd_1" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.pl_wd_1 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="2(Mid)" align="center" prop="pl_wd_2" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.pl_wd_2 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="3(Mid)" align="center" prop="pl_wd_3" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.pl_wd_3 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="4(Inner)" align="center" prop="pl_wd_4" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.pl_wd_4 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="All" align="center" width="120px" prop="pl_wd" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.pl_wd | valueFilter }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="PL_WD_STD" align="center">
          <el-table-column label="1(Outer)" align="center" prop="pl_wd_std_1" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.pl_wd_std_1 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="2(Mid)" align="center" prop="pl_wd_std_2" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.pl_wd_std_2 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="3(Mid)" align="center" prop="pl_wd_std_3" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.pl_wd_std_3 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="4(Inner)" align="center" prop="pl_wd_std_4" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.pl_wd_std_4 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="All" align="center" width="120px" prop="pl_wd_std" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.pl_wd_std | valueFilter }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="PL_WD_STD>2" align="center">
          <el-table-column label="1(Outer)" align="center" prop="wd_std_2_1" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.wd_std_2_1 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="2(Mid)" align="center" prop="wd_std_2_2" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.wd_std_2_2 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="3(Mid)" align="center" prop="wd_std_2_3" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.wd_std_2_3 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="4(Inner)" align="center" prop="wd_std_2_4" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.wd_std_2_4 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="All" align="center" width="120px" prop="wd_std_2_all" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.wd_std_2_all | valueFilter }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="PL_FWHM" align="center">
          <el-table-column label="1(Outer)" align="center" prop="pl_fwhm_1" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.pl_fwhm_1 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="2(Mid)" align="center" prop="pl_fwhm_2" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.pl_fwhm_2 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="3(Mid)" align="center" prop="pl_fwhm_3" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.pl_fwhm_3 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="4(Inner)" align="center" prop="pl_fwhm_4" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.pl_fwhm_4 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="All" align="center" width="120px" prop="pl_fwhm" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.pl_fwhm | valueFilter }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="PL_II" align="center">
          <el-table-column label="1(Outer)" align="center" prop="pl_ii_1" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.pl_ii_1 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="2(Mid)" align="center" prop="pl_ii_2" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.pl_ii_2 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="3(Mid)" align="center" prop="pl_ii_3" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.pl_ii_3 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="4(Inner)" align="center" prop="pl_ii_4" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.pl_ii_4 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="All" align="center" width="120px" prop="pl_ii" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.pl_ii | valueFilter }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="PL_Bowing" align="center">
          <el-table-column label="1(Outer)" align="center" prop="pl_bowing_1" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.pl_bowing_1 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="2(Mid)" align="center" prop="pl_bowing_2" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.pl_bowing_2 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="3(Mid)" align="center" prop="pl_bowing_3" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.pl_bowing_3 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="4(Inner)" align="center" prop="pl_bowing_4" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.pl_bowing_4 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="All" align="center" width="120px" prop="pl_bowing" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.pl_bowing | valueFilter }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="PL_TH" align="center">
          <el-table-column label="1(Outer)" align="center" prop="pl_th_1" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.pl_th_1 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="2(Mid)" align="center" prop="pl_th_2" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.pl_th_2 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="3(Mid)" align="center" prop="pl_th_3" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.pl_th_3 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="4(Inner)" align="center" prop="pl_th_4" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.pl_th_4 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="All" align="center" width="120px" prop="pl_th" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.pl_th | valueFilter }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="PL_Ref" align="center">
          <el-table-column label="1(Outer)" align="center" prop="pl_ref_1" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.pl_ref_1 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="2(Mid)" align="center" prop="pl_ref_2" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.pl_ref_2 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="3(Mid)" align="center" prop="pl_ref_3" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.pl_ref_3 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="4(Inner)" align="center" prop="pl_ref_4" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.pl_ref_4 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="All" align="center" width="120px" prop="pl_ref" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.pl_ref | valueFilter }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="XRD_002" align="center">
          <el-table-column label="1(Outer)" align="center" prop="xrd_002_1" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.xrd_002_1 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="2(Mid)" align="center" prop="xrd_002_2" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.xrd_002_2 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="3(Mid)" align="center" prop="xrd_002_3" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.xrd_002_3 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="4(Inner)" align="center" prop="xrd_002_4" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.xrd_002_4 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="All" align="center" width="120px" prop="xrd_002" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.xrd_002 | valueFilter }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="XRD_102" align="center">
          <el-table-column label="1(Outer)" align="center" prop="xrd_102_1" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.xrd_102_1 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="2(Mid)" align="center" prop="xrd_102_2" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.xrd_102_2 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="3(Mid)" align="center" prop="xrd_102_3" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.xrd_102_3 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="4(Inner)" align="center" prop="xrd_102_4" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.xrd_102_4 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="All" align="center" width="120px" prop="xrd_102" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.xrd_102 | valueFilter }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="Period" align="center">
          <el-table-column label="1(Outer)" align="center" prop="period_1" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.period_1 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="2(Mid)" align="center" prop="period_2" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.period_2 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="3(Mid)" align="center" prop="period_3" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.period_3 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="4(Inner)" align="center" prop="period_4" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.period_4 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="All" align="center" width="120px" prop="period" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.period | valueFilter }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="Al%" align="center">
          <el-table-column label="1(Outer)" align="center" prop="ai_1" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.ai_1 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="2(Mid)" align="center" prop="ai_2" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.ai_2 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="3(Mid)" align="center" prop="ai_3" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.ai_3 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="4(Inner)" align="center" prop="ai_4" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.ai_4 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="All" align="center" width="120px" prop="ai" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.ai | valueFilter }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="EL_VF4" align="center">
          <el-table-column label="1(Outer)" align="center" prop="el_vf4_1" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.el_vf4_1 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="2(Mid)" align="center" prop="el_vf4_2" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.el_vf4_2 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="3(Mid)" align="center" prop="el_vf4_3" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.el_vf4_3 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="4(Inner)" align="center" prop="el_vf4_4" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.el_vf4_4 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="All" align="center" width="120px" prop="el_vf4" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.el_vf4 | valueFilter }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="EL_WLD" align="center">
          <el-table-column label="1(Outer)" align="center" prop="el_wld_1" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.el_wld_1 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="2(Mid)" align="center" prop="el_wld_2" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.el_wld_2 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="3(Mid)" align="center" prop="el_wld_3" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.el_wld_3 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="4(Inner)" align="center" prop="el_wld_4" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.el_wld_4 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="All" align="center" width="120px" prop="el_wld" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.el_wld | valueFilter }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="EL_LOP460" align="center">
          <el-table-column label="1(Outer)" align="center" prop="el_lop460_1" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.el_lop460_1 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="2(Mid)" align="center" prop="el_lop460_2" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.el_lop460_2 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="3(Mid)" align="center" prop="el_lop460_3" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.el_lop460_3 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="4(Inner)" align="center" prop="el_lop460_4" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.el_lop460_4 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="All" align="center" width="120px" prop="el_lop460" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.el_lop460 | valueFilter }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="EL_HW" align="center">
          <el-table-column label="1(Outer)" align="center" prop="el_hw_1" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.el_hw_1 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="2(Mid)" align="center" prop="el_hw_2" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.el_hw_2 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="3(Mid)" align="center" prop="el_hw_3" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.el_hw_3 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="4(Inner)" align="center" prop="el_hw_4" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.el_hw_4 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="All" align="center" width="120px" prop="el_hw" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.el_hw | valueFilter }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="COW_ESD(400V)" align="center">
          <el-table-column label="1(Outer)" align="center" prop="esd_400_1" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.esd_400_1 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="2(Mid)" align="center" prop="esd_400_2" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.esd_400_2 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="3(Mid)" align="center" prop="esd_400_3" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.esd_400_3 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="4(Inner)" align="center" prop="esd_400_4" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.esd_400_4 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="All" align="center" width="120px" prop="esd_400" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.esd_400 | valueFilter }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="COW_ESD(300)" align="center">
          <el-table-column label="1(Outer)" align="center" prop="esd_300_1" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.esd_300_1 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="2(Mid)" align="center" prop="esd_300_2" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.esd_300_2 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="3(Mid)" align="center" prop="esd_300_3" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.esd_300_3 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="4(Inner)" align="center" prop="esd_300_4" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.esd_300_4 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="All" align="center" width="120px" prop="esd_300" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.esd_300 | valueFilter }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="COW_ESD(200)" align="center">
          <el-table-column label="1(Outer)" align="center" prop="esd_200_1" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.esd_200_1 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="2(Mid)" align="center" prop="esd_200_2" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.esd_200_2 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="3(Mid)" align="center" prop="esd_200_3" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.esd_200_3 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="4(Inner)" align="center" prop="esd_200_4" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.esd_200_4 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="All" align="center" width="120px" prop="esd_200" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.esd_200 | valueFilter }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="Thyristor良率" align="center">
          <el-table-column label="1(Outer)" align="center" prop="thyristor_1" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.thyristor_1 !== '' && scope.row.thyristor_1 !== '0' && scope.row.thyristor_1 !== null">{{ scope.row.thyristor_1 | valueFilter }}%</span>
            </template>
          </el-table-column>
          <el-table-column label="2(Mid)" align="center" prop="thyristor_2" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.thyristor_2 !== '' && scope.row.thyristor_2 !== '0' && scope.row.thyristor_2 !== null">{{ scope.row.thyristor_2 | valueFilter }}%</span>
            </template>
          </el-table-column>
          <el-table-column label="3(Mid)" align="center" prop="thyristor_3" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.thyristor_3 !== '' && scope.row.thyristor_3 !== '0' && scope.row.thyristor_3 !== null">{{ scope.row.thyristor_3 | valueFilter }}%</span>
            </template>
          </el-table-column>
          <el-table-column label="4(Inner)" align="center" prop="thyristor_4" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.thyristor_4 !== '' && scope.row.thyristor_4 !== '0' && scope.row.thyristor_4 !== null">{{ scope.row.thyristor_4 | valueFilter }}%</span>
            </template>
          </el-table-column>
          <el-table-column label="All" align="center" width="120px" prop="thyristor" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.thyristor !== '' && scope.row.thyristor !== '0' && scope.row.thyristor !== null">{{ scope.row.thyristor | valueFilter }}%</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="COW_IR_YIELD" align="center">
          <el-table-column label="1(Outer)" align="center" prop="COW_IR_YIELD_1" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.cow_ir_yield_1 !== '' && scope.row.cow_ir_yield_1 !== 0 && scope.row.cow_ir_yield_1 !== null">{{ scope.row.cow_ir_yield_1 | valueFilter }}%</span>
            </template>
          </el-table-column>
          <el-table-column label="2(Mid)" align="center" prop="COW_IR_YIELD_2" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.cow_ir_yield2 !== '' && scope.row.cow_ir_yield_2 !== 0 && scope.row.cow_ir_yield_2 !== null">{{ scope.row.cow_ir_yield_2 | valueFilter }}%</span>
            </template>
          </el-table-column>
          <el-table-column label="3(Mid)" align="center" prop="COW_IR_YIELD_3" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.cow_ir_yield_3 !== '' && scope.row.cow_ir_yield_3 !== 0 && scope.row.cow_ir_yield_3 !== null">{{ scope.row.cow_ir_yield_3 | valueFilter }}%</span>
            </template>
          </el-table-column>
          <el-table-column label="4(Inner)" align="center" prop="COW_IR_YIELD_4" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.cow_ir_yield_4 !== '' && scope.row.cow_ir_yield_4 !== 0 && scope.row.cow_ir_yield_4 !== null">{{ scope.row.cow_ir_yield_4 | valueFilter }}%</span>
            </template>
          </el-table-column>
          <el-table-column label="All" align="center" width="120px" prop="COW_IR_YIELD" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.cow_ir_yield !== '' && scope.row.cow_ir_yield !== 0 && scope.row.cow_ir_yield !== null">{{ scope.row.cow_ir_yield | valueFilter }}%</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="COW_VF1" align="center">
          <el-table-column label="1(Outer)" align="center" prop="cow_vf1_1" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_vf1_1 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="2(Mid)" align="center" prop="cow_vf1_2" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_vf1_2 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="3(Mid)" align="center" prop="cow_vf1_3" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_vf1_3 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="4(Inner)" align="center" prop="cow_vf1_4" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_vf1_4 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="All" align="center" width="120px" prop="cow_vf1" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_vf1 | valueFilter }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="COW_VF4" align="center">
          <el-table-column label="1(Outer)" align="center" prop="cow_vf4_1" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_vf4_1 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="2(Mid)" align="center" prop="cow_vf4_2" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_vf4_2 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="3(Mid)" align="center" prop="cow_vf4_3" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_vf4_3 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="4(Inner)" align="center" prop="cow_vf4_4" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_vf4_4 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="All" align="center" width="120px" prop="cow_vf4" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_vf4 | valueFilter }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="COW_WLD" align="center">
          <el-table-column label="1(Outer)" align="center" prop="cow_wld_1" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_wld_1 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="2(Mid)" align="center" prop="cow_wld_2" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_wld_2 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="3(Mid)" align="center" prop="cow_wld_3" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_wld_3 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="4(Inner)" align="center" prop="cow_wld_4" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_wld_4 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="All" align="center" width="120px" prop="cow_wld" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_wld | valueFilter }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="COW_IV" align="center">
          <el-table-column label="1(Outer)" align="center" prop="cow_iv_1" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_iv_1 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="2(Mid)" align="center" prop="cow_iv_2" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_iv_2 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="3(Mid)" align="center" prop="cow_iv_3" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_iv_3 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="4(Inner)" align="center" prop="cow_iv_4" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_iv_4 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="All" align="center" width="120px" prop="cow_iv" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_iv | valueFilter }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="控制片" align="center">
          <el-table-column label="AVG_VF1" align="center" prop="avg_vf1" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.avg_vf1 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="AVG_IV" align="center" prop="avg_iv" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.avg_iv | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="AVG_WLD" align="center" prop="avg_wld" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.avg_wld | valueFilter }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="COW_IR" align="center">
          <el-table-column label="1(Outer)" align="center" prop="cow_ir_1" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_ir_1 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="2(Mid)" align="center" prop="cow_ir_2" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_ir_2 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="3(Mid)" align="center" prop="cow_ir_3" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_ir_3 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="4(Inner)" align="center" prop="cow_ir_4" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_ir_4 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="All" align="center" prop="cow_ir" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_ir | valueFilter }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="COW_VZ" align="center">
          <el-table-column label="1(Outer)" align="center" prop="cow_vz_1" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_vz_1 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="2(Mid)" align="center" prop="cow_vz_2" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_vz_2 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="3(Mid)" align="center" prop="cow_vz_3" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_vz_3 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="4(Inner)" align="center" prop="cow_vz_4" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_vz_4 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="All" align="center" prop="cow_vz" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_vz | valueFilter }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="COW_B.S" align="center">
          <el-table-column label="1(Outer)" align="center" prop="cow_bs_1" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_bs_1 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="2(Mid)" align="center" prop="cow_bs_2" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_bs_2 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="3(Mid)" align="center" prop="cow_bs_3" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_bs_3 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="4(Inner)" align="center" prop="cow_bs_4" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_bs_4 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="All" align="center" prop="cow_bs" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_bs | valueFilter }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="COW_WLD(PL-COW)" align="center">
          <el-table-column label="1(Outer)" align="center" prop="COW_WLD_PL_COW_1" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_wld_pl_cow_1 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="2(Mid)" align="center" prop="COW_WLD_PL_COW_2" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_wld_pl_cow_2 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="3(Mid)" align="center" prop="COW_WLD_PL_COW_3" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_wld_pl_cow_3 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="4(Inner)" align="center" prop="COW_WLD_PL_COW_4" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_wld_pl_cow_4 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="All" align="center" prop="COW_WLD_PL_COW" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_wld_pl_cow | valueFilter }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="COW_HW1" align="center">
          <el-table-column label="1(Outer)" align="center" prop="cow_hw1_1" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_hw1_1 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="2(Mid)" align="center" prop="cow_hw1_2" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_hw1_2 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="3(Mid)" align="center" prop="cow_hw1_3" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_hw1_3 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="4(Inner)" align="center" prop="cow_hw1_4" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_hw1_4 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="All" align="center" prop="cow_hw1" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.cow_hw1 | valueFilter }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="目检降档" align="center">
          <el-table-column label="1(Outer)" align="center" prop="mjjd_1" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.mjjd_1 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="2(Mid)" align="center" prop="mjjd_2" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.mjjd_2 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="3(Mid)" align="center" prop="mjjd_3" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.mjjd_3 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="4(Inner)" align="center" prop="mjjd_4" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.mjjd_4 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="All" align="center" prop="mjjd_all" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.mjjd_all | valueFilter }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="报废" align="center">
          <el-table-column label="R" align="center" prop="R" sortable="custom">
            <template slot-scope="scope">
              {{ scope.row.mjjdR | valueFilter }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="波长良率" align="center">
          <el-table-column label="YIELD5nm" align="center" prop="YIELD5nm" sortable="custom">
            <template slot-scope="scope">
              <span v-if="scope.row.yield5 !== '' && scope.row.yield5 !== 0 && scope.row.yield5 !== null">{{ scope.row.yield5 | valueFilter }}%</span>
            </template>
          </el-table-column>
          <el-table-column label="YIELD8nm" align="center" prop="YIELD8nm" sortable="custom">
            <template slot-scope="scope">
              <span v-if="scope.row.yield8 !== '' && scope.row.yield8 !== 0 && scope.row.yield8 !== null">{{ scope.row.yield8 | valueFilter }}%</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="Run判断结果" align="center">
          <el-table-column label="S" align="center" prop="RUN_S" sortable="custom">
            <template slot-scope="scope">
              {{ scope.row.run_s | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="F" align="center" prop="RUN_F" sortable="custom">
            <template slot-scope="scope">
              {{ scope.row.run_f | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="T" align="center" prop="RUN_T" sortable="custom">
            <template slot-scope="scope">
              {{ scope.row.run_t | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="R" align="center" prop="RUN_R" sortable="custom">
            <template slot-scope="scope">
              {{ scope.row.run_r | valueFilter }}
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <!--wafer信息-->
      <el-table
        v-loading="listLoading"
        v-show="isActive === 1"
        :data="anotherlist"
        class="run-table"
        height="calc(100vh - 265px)"
        element-loading-text="拼命加载中"
        border
        fit>
        <el-table-column label="基础信息" align="center">
          <el-table-column label="RunID" align="center" prop="run_id" width="150px" sortable/>
          <el-table-column label="WaferID" align="center" prop="wafer_id_01" width="150px" sortable/>
          <el-table-column label="衬底工艺" align="center" prop="cdgy" width="150px" sortable/>
          <el-table-column label="衬底厂家" align="center" prop="cdcj" width="150px" sortable/>
          <el-table-column label="镭刻号" align="center" prop="laser_mark" width="150px" sortable/>
          <el-table-column label="目检" align="center" prop="mjdj" width="150px" sortable/>
          <el-table-column label="铝氮ID" align="center" prop="ldID" width="150px" sortable/>
        </el-table-column>
        <el-table-column label="XRD" align="center">
          <el-table-column label="002" align="center" prop="xrd_c_002" sortable>
            <template slot-scope="scope">
              {{ scope.row.xrd_c_002 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="102" align="center" prop="xrd_c_102" sortable>
            <template slot-scope="scope">
              {{ scope.row.xrd_c_102 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="QB Th." align="center" prop="xrd_qb_th" sortable>
            <template slot-scope="scope">
              {{ scope.row.xrd_qb_th | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="QW Th." align="center" prop="xrd_qw_th" sortable>
            <template slot-scope="scope">
              {{ scope.row.xrd_qw_th | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="Period" align="center" prop="xrd_period" sortable>
            <template slot-scope="scope">
              {{ scope.row.xrd_period | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="In%" align="center" prop="xrd_in_" sortable>
            <template slot-scope="scope">
              {{ scope.row.xrd_in_ | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="AlGaN Th." align="center" prop="xrd_algan_th" sortable>
            <template slot-scope="scope">
              {{ scope.row.xrd_algan_th | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="Al%" align="center" prop="xrd_al_" sortable>
            <template slot-scope="scope">
              {{ scope.row.xrd_al_ | valueFilter }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="PL" align="center">
          <el-table-column label="Wp" align="center" prop="pl_wp" sortable>
            <template slot-scope="scope">
              {{ scope.row.pl_wp | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="Wp_Std" align="center" prop="pl_wp_std" sortable>
            <template slot-scope="scope">
              {{ scope.row.pl_wp_std | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="Wd" align="center" prop="pl_wd" sortable>
            <template slot-scope="scope">
              {{ scope.row.pl_wd | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="Wd Std" align="center" prop="pl_wd_std" sortable>
            <template slot-scope="scope">
              {{ scope.row.pl_wd_std | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="FWHM" align="center" prop="pl_fwhm" sortable>
            <template slot-scope="scope">
              {{ scope.row.pl_fwhm | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="FWHM Std" align="center" prop="pl_fwhm_std" sortable>
            <template slot-scope="scope">
              {{ scope.row.pl_fwhm_std | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="PL Int." align="center" prop="pl_pl_int" sortable>
            <template slot-scope="scope">
              {{ scope.row.pl_pl_int | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="PL Int. Std" align="center" prop="pl_pl_int_std" sortable>
            <template slot-scope="scope">
              {{ scope.row.pl_pl_int_std | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="l.l" align="center" prop="pl_ii" sortable>
            <template slot-scope="scope">
              {{ scope.row.pl_ii | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="l.l Std" align="center" prop="pl_ii_std" sortable>
            <template slot-scope="scope">
              {{ scope.row.pl_ii_std | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="PDavr" align="center" prop="pl_pdavr" sortable>
            <template slot-scope="scope">
              {{ scope.row.pl_pdavr | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="PD Std" align="center" prop="pl_pdstd" sortable>
            <template slot-scope="scope">
              {{ scope.row.pl_pdstd | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="TH" align="center" prop="pl_th" sortable>
            <template slot-scope="scope">
              {{ scope.row.pl_th | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="TH Std" align="center" prop="pl_th_std" sortable>
            <template slot-scope="scope">
              {{ scope.row.pl_th_std | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="Ref." align="center" prop="pl_ref" sortable>
            <template slot-scope="scope">
              {{ scope.row.pl_ref | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="Ref. Std" align="center" prop="pl_ref_std" sortable>
            <template slot-scope="scope">
              {{ scope.row.pl_ref_std | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="Bow" align="center" prop="pl_bow" sortable>
            <template slot-scope="scope">
              {{ scope.row.pl_bow | valueFilter }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="EL" align="center">
          <el-table-column label="VF1" align="center" prop="el_vf1" sortable>
            <template slot-scope="scope">
              {{ scope.row.el_vf1 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="VF2" align="center" prop="el_vf2" sortable>
            <template slot-scope="scope">
              {{ scope.row.el_vf2 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="VF3" align="center" prop="el_vf3" sortable>
            <template slot-scope="scope">
              {{ scope.row.el_vf3 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="VF4" align="center" prop="el_vf4" sortable>
            <template slot-scope="scope">
              {{ scope.row.el_vf4 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="VZ1" align="center" prop="el_vz1" sortable>
            <template slot-scope="scope">
              {{ scope.row.el_vz1 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="VZ2" align="center" prop="el_vz2" sortable>
            <template slot-scope="scope">
              {{ scope.row.el_vz2 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="IR" align="center" prop="el_ir" sortable>
            <template slot-scope="scope">
              {{ scope.row.el_ir | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="LOP1" align="center" prop="el_lop1" sortable>
            <template slot-scope="scope">
              {{ scope.row.el_lop1 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="WLP1" align="center" prop="el_wlp1" sortable>
            <template slot-scope="scope">
              {{ scope.row.el_wlp1 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="WLD1" align="center" prop="el_wld1" sortable>
            <template slot-scope="scope">
              {{ scope.row.el_wld1 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="WLC1" align="center" prop="el_wlc1" sortable>
            <template slot-scope="scope">
              {{ scope.row.el_wlc1 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="HW" align="center" prop="el_hw" sortable>
            <template slot-scope="scope">
              {{ scope.row.el_hw | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="LOP(460)" align="center" prop="el_lop460" width="100px" sortable>
            <template slot-scope="scope">
              {{ scope.row.el_lop460 | valueFilter }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="COW" align="center">
          <el-table-column label="批次号" align="center" prop="cow_lot_no" width="180px" sortable/>
          <el-table-column label="WaferID" align="center" prop="cow_wafer_no" width="220px" sortable/>
          <el-table-column label="测试时间" align="center" prop="cow_test_time" width="150px" sortable/>
          <el-table-column label="IV均值" align="center" prop="cow_avg_iv" sortable>
            <template slot-scope="scope">
              {{ scope.row.cow_avg_iv | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="VF1均值" align="center" prop="cow_avg_vf1" sortable>
            <template slot-scope="scope">
              {{ scope.row.cow_avg_vf1 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="VZ均值" align="center" prop="cow_avg_vz" sortable>
            <template slot-scope="scope">
              {{ scope.row.cow_avg_vz | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="蓝移" align="center" prop="cow_blue_shift" sortable>
            <template slot-scope="scope">
              {{ scope.row.cow_blue_shift | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="K值" align="center" prop="cow_valk" sortable>
            <template slot-scope="scope">
              {{ scope.row.cow_valk | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="ESD去坏（200V）" align="center" prop="cow_esd_200" width="150px" sortable>
            <template slot-scope="scope">
              <span v-if="scope.row.cow_esd_200 !== '' && scope.row.cow_esd_200 !== 0 && scope.row.cow_esd_200 !== null">{{ scope.row.cow_esd_200 | valueFilter }}%</span>
            </template>
          </el-table-column>
          <el-table-column label="ESD去坏（400V）" align="center" prop="cow_esd_400" width="150px" sortable>
            <template slot-scope="scope">
              <span v-if="scope.row.cow_esd_400 !== '' && scope.row.cow_esd_400 !== 0 && scope.row.cow_esd_400 !== null">{{ scope.row.cow_esd_400 | valueFilter }}%</span>
            </template>
          </el-table-column>
          <el-table-column label="ESD去坏（50V）" align="center" prop="cow_esd_50" width="150px" sortable>
            <template slot-scope="scope">
              <span v-if="scope.row.cow_esd_50 !== '' && scope.row.cow_esd_50 !== 0 && scope.row.cow_esd_50 !== null">{{ scope.row.cow_esd_50 | valueFilter }}%</span>
            </template>
          </el-table-column>
          <el-table-column label="ESD去坏（500V）" align="center" prop="cow_esd_500" width="150px" sortable>
            <template slot-scope="scope">
              <span v-if="scope.row.cow_esd_500 !== '' && scope.row.cow_esd_500 !== 0 && scope.row.cow_esd_500 !== null">{{ scope.row.cow_esd_500 | valueFilter }}%</span>
            </template>
          </el-table-column>
          <el-table-column label="ESD去坏（300V）" align="center" prop="cow_esd_300" width="150px" sortable>
            <template slot-scope="scope">
              <span v-if="scope.row.cow_esd_300 !== '' && scope.row.cow_esd_300 !== 0 && scope.row.cow_esd_300 !== null">{{ scope.row.cow_esd_300 | valueFilter }}%</span>
            </template>
          </el-table-column>
          <el-table-column label="ESD去坏（人体1000）" align="center" prop="cow_esd_1000" width="170px" sortable>
            <template slot-scope="scope">
              <span v-if="scope.row.cow_esd_1000 !== '' && scope.row.cow_esd_1000 !== 0 && scope.row.cow_esd_1000 !== null">{{ scope.row.cow_esd_1000 | valueFilter }}%</span>
            </template>
          </el-table-column>
          <el-table-column label="ESD去坏（人体2000）" align="center" prop="cow_esd_2000" width="170px" sortable>
            <template slot-scope="scope">
              <span v-if="scope.row.cow_esd_2000 !== '' && scope.row.cow_esd_2000 !== 0 && scope.row.cow_esd_2000 !== null">{{ scope.row.cow_esd_2000 | valueFilter }}%</span>
            </template>
          </el-table-column>
          <el-table-column label="ESD去坏（人体4000）" align="center" prop="cow_esd_4000" width="170px" sortable>
            <template slot-scope="scope">
              <span v-if="scope.row.cow_esd_4000 !== '' && scope.row.cow_esd_4000 !== 0 && scope.row.cow_esd_4000 !== null">{{ scope.row.cow_esd_4000 | valueFilter }}%</span>
            </template>
          </el-table-column>
          <el-table-column label="Thyristor良率" align="center" prop="cow_yield_thyristor" width="150px" sortable>
            <template slot-scope="scope">
              <span v-if="scope.row.cow_yield_thyristor !== '' && scope.row.cow_yield_thyristor !== '0' && scope.row.cow_yield_thyristor !== null">{{ scope.row.cow_yield_thyristor | valueFilter }}%</span>
            </template>
          </el-table-column>
          <el-table-column label="Thyristor坏点数" align="center" prop="cow_num_thyristor" width="150px" sortable>
            <template slot-scope="scope">
              {{ scope.row.cow_num_thyristor | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="DVF均值" align="center" prop="cow_avg_dvf" sortable>
            <template slot-scope="scope">
              {{ scope.row.cow_avg_dvf | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="综合良率" align="center" prop="cow_yield_zh" sortable>
            <template slot-scope="scope">
              <span v-if="scope.row.cow_yield_zh !== '' && scope.row.cow_yield_zh !== 0 && scope.row.cow_yield_zh !== null">{{ scope.row.cow_yield_zh | valueFilter }}%</span>
            </template>
          </el-table-column>
          <el-table-column label="VF1良率" align="center" prop="cow_yield_vf1" sortable>
            <template slot-scope="scope">
              <span v-if="scope.row.cow_yield_vf1 !== '' && scope.row.cow_yield_vf1 !== 0 && scope.row.cow_yield_vf1 !== null">{{ scope.row.cow_yield_vf1 | valueFilter }}%</span>
            </template>
          </el-table-column>
          <el-table-column label="VF3良率" align="center" prop="cow_yield_vf3" sortable>
            <template slot-scope="scope">
              <span v-if="scope.row.cow_yield_vf3 !== '' && scope.row.cow_yield_vf3 !== 0 && scope.row.cow_yield_vf3 !== null">{{ scope.row.cow_yield_vf3 | valueFilter }}%</span>
            </template>
          </el-table-column>
          <el-table-column label="WLD1良率" align="center" prop="cow_yield_wld1" sortable>
            <template slot-scope="scope">
              <span v-if="scope.row.cow_esd_200 !== '' && scope.row.cow_yield_wld1 !== 0 && scope.row.cow_yield_wld1 !== null">{{ scope.row.cow_yield_wld1 | valueFilter }}%</span>
            </template>
          </el-table-column>
          <el-table-column label="IR良率" align="center" prop="cow_yield_ir" sortable>
            <template slot-scope="scope">
              <span v-if="scope.row.cow_yield_ir !== '' && scope.row.cow_yield_ir !== 0 && scope.row.cow_yield_ir !== null">{{ scope.row.cow_yield_ir | valueFilter }}%</span>
            </template>
          </el-table-column>
          <el-table-column label="VZ良率" align="center" prop="cow_yield_vz" sortable>
            <template slot-scope="scope">
              <span v-if="scope.row.cow_yield_vz !== '' && scope.row.cow_yield_vz !== 0 && scope.row.cow_yield_vz !== null">{{ scope.row.cow_yield_vz | valueFilter }}%</span>
            </template>
          </el-table-column>
          <el-table-column label="IV良率" align="center" prop="cow_yield_iv" sortable>
            <template slot-scope="scope">
              <span v-if="scope.row.cow_yield_iv !== '' && scope.row.cow_yield_iv !== 0 && scope.row.cow_yield_iv !== null">{{ scope.row.cow_yield_iv | valueFilter }}%</span>
            </template>
          </el-table-column>
          <el-table-column label="VF4良率" align="center" prop="cow_yield_vf4" sortable>
            <template slot-scope="scope">
              <span v-if="scope.row.cow_yield_vf4 !== '' && scope.row.cow_yield_vf4 !== 0 && scope.row.cow_yield_vf4 !== null">{{ scope.row.cow_yield_vf4 | valueFilter }}%</span>
            </template>
          </el-table-column>
          <el-table-column label="VF2均值" align="center" prop="cow_avg_vf2" sortable>
            <template slot-scope="scope">
              {{ scope.row.cow_avg_vf2 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="VF3均值" align="center" prop="cow_avg_vf3" sortable>
            <template slot-scope="scope">
              {{ scope.row.cow_avg_vf3 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="VF4均值" align="center" prop="cow_avg_vf4" sortable>
            <template slot-scope="scope">
              {{ scope.row.cow_avg_vf4 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="WLP1均值" align="center" prop="cow_avg_wlp1" sortable>
            <template slot-scope="scope">
              {{ scope.row.cow_avg_wlp1 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="HW1" align="center" prop="cow_hw1" sortable>
            <template slot-scope="scope">
              {{ scope.row.cow_hw1 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="WLD2均值" align="center" prop="cow_avg_wld2" sortable>
            <template slot-scope="scope">
              {{ scope.row.cow_avg_wld2 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="WLD2_STD" align="center" prop="cow_wld2_std" sortable>
            <template slot-scope="scope">
              {{ scope.row.cow_wld2_std | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="HW2" align="center" prop="cow_hw2" sortable>
            <template slot-scope="scope">
              {{ scope.row.cow_hw2 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="WLP2均值" align="center" prop="cow_avg_wlp2" sortable>
            <template slot-scope="scope">
              {{ scope.row.cow_avg_wlp2 | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="IR均值" align="center" prop="cow_avg_ir" sortable>
            <template slot-scope="scope">
              {{ scope.row.cow_avg_ir | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="PL_WP" align="center" prop="cow_pl_wp" sortable>
            <template slot-scope="scope">
              {{ scope.row.cow_pl_wp | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="PL_WD" align="center" prop="cow_pl_wd" sortable>
            <template slot-scope="scope">
              {{ scope.row.cow_pl_wd | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="PL_WD_STD" align="center" prop="cow_pl_wd_std" width="150px" sortable>
            <template slot-scope="scope">
              {{ scope.row.cow_pl_wd_std | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="PL.I.I" align="center" prop="cow_pl_ii" sortable>
            <template slot-scope="scope">
              {{ scope.row.cow_pl_ii | valueFilter }}
            </template>
          </el-table-column>
          <el-table-column label="坏点数" align="center" prop="cow_bad" sortable/>
          <el-table-column label="总数" align="center" prop="cow_total" sortable/>
          <el-table-column label="坏点数" align="center" prop="cow_bad" sortable/>
          <el-table-column label="导入时间" align="center" prop="cow_import_time" width="150px" sortable/>
          <el-table-column label="机台" align="center" prop="cow_machine" sortable/>
          <el-table-column label="IR坏点坐标" align="center" prop="cow_ir_bad_point" width="150px" sortable show-overflow-tooltip/>
        </el-table-column>
        <el-table-column label="等级判定" align="center">
          <!-- <el-table-column label="VF" align="center" prop="name" width="VF_01"/>
          <el-table-column label="IR" align="center" prop="name" width="ir_01"/>
          <el-table-column label="综合判定" align="center" prop="name" width="All_01"/> -->
          <el-table-column v-for="item in labelList" :prop="item.k" :key="item.k" :label="item.label" align="center" sortable>
            <template slot-scope="scope">
              {{ scope.row[item.k] }}
            </template>
          </el-table-column>
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
      :visible.sync="resetDialogVisable"
      title="重置"
      class="padding-dialog"
      width="500px">
      <div class="reset-title">
        <span>系统检测到下列后置Run次进行过PM重置，是否覆盖？ </span>
      </div>
      <el-table
        v-loading="listLoading"
        :data="resetList"
        element-loading-text="拼命加载中"
        class="run-table"
        height="400px"
        border
        fit
        stripe
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"/>
        <el-table-column label="RunID" align="center" prop="runId"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleReset()">确 定</el-button>
        <el-button @click="resetDialogVisable = false">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
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
    margin-top: 15px;
    margin-right: 10px;
  }
  .search-input{
    width: 135px;
  }
  .input-title{
    width: 65px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 200px);
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
  .substrate>div:not(:first-child){
    margin-left: 5px;
  }
  .app-container>>> .el-table--border {
    border-top: 2px solid #009494;
  }
  .table-top-btn-group>div.active{
    color: #fff;
    background: #009494;
    border-color: #009494;
  }
  .broad-scrollbar-table>>>.el-table__fixed {
    height: calc(100vh - 327px) !important;
  }
  .broad-scrollbar-table>>>.el-table__fixed-body-wrapper {
    height: calc(100vh - 410px) !important;
  }
  .reset-title {
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 15px;
  }
  .padding-dialog >>> .el-checkbox {
    margin-left: 20px;
  }
</style>
