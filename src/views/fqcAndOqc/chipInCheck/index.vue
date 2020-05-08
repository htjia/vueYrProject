<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0px;">
      <div style="position: relative;padding-right: 60px">
        <div class="input-item">
          <span class="input-title" style="width: 35px">单号</span>
          <el-input v-model="searchKeys.dh" class="search-input" placeholder="请输入单号" size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item">
          <span class="input-title" style="width: 35px">片号</span>
          <el-input v-model="searchKeys.ph" class="search-input" placeholder="请输入片号" size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item">
          <span class="input-title">单据类型</span>
          <el-select v-model="searchKeys.djlx" class="search-input" size="small" placeholder="请选择" filterable>
            <el-option
              v-for="item in billTypeOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">产品型号</span>
          <el-select v-model="searchKeys.cpxh" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in productModelOptions"
              :key="item.id"
              :label="item.code"
              :value="item.code"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">任务状态</span>
          <el-select v-model="searchKeys.rwzt" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in taskStatusOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">入库片型</span>
          <el-select v-model="searchKeys.rklx" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in putInStoreOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">投片类型</span>
          <el-select v-model="searchKeys.tplx" class="search-input" size="small" placeholder="请选择" filterable clearable multiple collapse-tags>
            <el-option
              v-for="item in tipOutOptions"
              :key="item.name"
              :label="item.name"
              :value="item.name"/>
          </el-select>
        </div>
        <div style="float: left;width: 820px; height: 46px;">
          <div class="input-item" style="margin-right: 20px;margin-left: 10px;padding-top: 8px">
            <el-radio-group v-model="timeRadio">
              <el-radio :label="0">制单日期</el-radio>
              <el-radio :label="1">审核日期</el-radio>
            </el-radio-group>
          </div>
          <div class="input-item">
            <el-date-picker
              v-model="beginDate"
              :picker-options="pickerOptionsStart"
              :editable="false"
              class="search-input"
              style="width: 140px;"
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
              style="width: 140px;"
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
              size="small"
              type="danger"
              @click="clearSearch"
            >
              <svg-icon icon-class="clear"/> 重 置
            </el-button>
          </div>
        </div>
        <el-button
          style="position: absolute;right: 0;bottom: 0;"
          size="small"
          type="primary"
          @click="handleExport" ><svg-icon icon-class="export"/> 导 出</el-button>
        <div class="clear-both"/>
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
          Wafer信息TOL: <span v-text="waferTol"/>
        </div>
        <div v-if="selectTheadVisble" class="select-thead">
          <div class="options-box" style="height: 300px;overflow-y: auto;">
            <el-checkbox-group v-model="checkboxVal">
              <el-checkbox v-for="(option, index) in formTheadOptions" :key="index" :label="option" :disabled="index<3" style="width: 180px;margin-left: 15px;margin: 5px;">
                {{ option.thName }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <el-button type="primary" size="mini" style="margin-left: 25px" @click="submitOption">确 定</el-button>
          <el-button size="mini" @click="selectTheadVisble = false">取 消</el-button>
        </div>
        <strong v-if="false" style="margin-bottom: -16px;">
          &nbsp;
          <el-button v-if="isActive === 1 &&selectedRow!==null && selectedRow.sliceType === 0" type="text" class="select-thead-btn" @click="selectThead"><svg-icon icon-class="shezhi"/> 设置显示列</el-button>
          <el-button v-if="isActive === 1 &&selectedRow!==null && selectedRow.sliceType === 1" type="text" class="select-thead-btn" @click="selectTheadf"><svg-icon icon-class="shezhi"/> 设置显示列</el-button>
        </strong>
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
      </div>
      <el-table
        v-loading="listLoading"
        v-show="isActive === 0"
        ref="billTable"
        :data="list"
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
        <el-table-column label="送片单号" align="center" prop="code" width="120" show-overflow-tooltip fixed/>
        <el-table-column label="单据类型" align="center" prop="billType" width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.billType === 0">正常</span>
            <span v-if="scope.row.billType === 1">返工</span>
          </template>
        </el-table-column>
        <el-table-column label="产品型号" align="center" prop="taskModel" width="100" show-overflow-tooltip/>
        <el-table-column label="任务状态" align="center" prop="status" width="90" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0" style="color:#ee7e31;font-weight:bold">待审核</span>
            <span v-if="scope.row.status === 1" style="color:#1ABC9C;font-weight:bold">通过</span>
            <span v-if="scope.row.status === 2" style="color:#E25D5D;font-weight:bold">不通过</span>
            <span v-if="scope.row.status === 3" style="color:#3CB371;font-weight:bold">入库完成</span>
            <span v-if="scope.row.status === 4" style="color:#E25D5D;font-weight:bold">仓库退回</span>
          </template>
        </el-table-column>
        <el-table-column label="入库片型" align="center" prop="sliceType" width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.sliceType === 0">圆片</span>
            <span v-if="scope.row.sliceType === 1">方片</span>
          </template>
        </el-table-column>
        <el-table-column label="投片类型" align="center" prop="category" width="80" show-overflow-tooltip/>
        <el-table-column label="数量" align="center" prop="sliceCount" width="60" show-overflow-tooltip/>
        <el-table-column label="光色" align="center" prop="color" width="60" show-overflow-tooltip/>
        <el-table-column label="型号" align="center" prop="model" width="70" show-overflow-tooltip/>
        <el-table-column label="工艺" align="center" prop="craft" width="60" show-overflow-tooltip/>
        <el-table-column label="尺寸" align="center" prop="size" width="60" show-overflow-tooltip/>
        <el-table-column label="品质等级" align="center" prop="quality" width="80" show-overflow-tooltip/>
        <el-table-column label="外观等级" align="center" prop="classify" width="80" show-overflow-tooltip/>
        <el-table-column label="是否清洗" align="center" prop="isClean" width="80" show-overflow-tooltip/>
        <el-table-column label="是否满BIN" align="center" prop="fullBin" width="80" show-overflow-tooltip/>
        <el-table-column label="波段" align="center" prop="band" width="120" show-overflow-tooltip/>
        <el-table-column label="制单人" align="center" prop="creatorName" width="100" show-overflow-tooltip/>
        <el-table-column label="制单日期" align="center" prop="createTime" width="100" show-overflow-tooltip/>
        <el-table-column label="审核人" align="center" prop="auditorName" width="100" show-overflow-tooltip/>
        <el-table-column label="审核日期" align="center" prop="auditTime" width="100" show-overflow-tooltip/>
        <el-table-column label="备注" align="center" prop="remark" width="100" show-overflow-tooltip/>
        <el-table-column align="center" label="操作" width="85" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status === 0" type="danger" style="background: #ed7d31; border-color: #ed7d31" size="mini" @click="handleExamine(scope.row)"><svg-icon icon-class="kaishi"/> 审核</el-button>
            <el-button v-if="scope.row.status === 1 || scope.row.status === 4" type="primary" size="mini" @click="handleExamine(scope.row)"><svg-icon icon-class="chongzhisx"/> 反审</el-button>
            <el-button v-if="scope.row.status === 2 || scope.row.status === 3" size="mini" @click="handleExamine(scope.row)"><svg-icon icon-class="chaxun"/> 查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-show="isActive === 1 && selectedRow.sliceType === 0"
        :data="detailList"
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
        <el-table-column label="WaferID" align="center" prop="waferNo" width="180" fixed show-overflow-tooltip/>
        <el-table-column label="TapeNo" align="center" prop="tapeNo" width="140" show-overflow-tooltip/>
        <el-table-column v-for="item in formThead" v-if="item.thName !== '序号'&&item.thName !== 'WaferID'&&item.thName !== 'TapeNo'" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[item.thKey] }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="产品型号" align="center" prop="taskModel" width="120" show-overflow-tooltip/>
        <el-table-column label="数量" align="center" prop="binCount" width="120" show-overflow-tooltip/>
        <el-table-column label="光色" align="center" prop="color" width="120" show-overflow-tooltip/>
        <el-table-column label="型号" align="center" prop="model" width="120" show-overflow-tooltip/>
        <el-table-column label="工艺" align="center" prop="craft" width="120" show-overflow-tooltip/>
        <el-table-column label="尺寸" align="center" prop="size" width="120" show-overflow-tooltip/>
        <el-table-column label="品质等级" align="center" prop="quality" width="120" show-overflow-tooltip/>
        <el-table-column label="外观等级" align="center" prop="classify" width="120" show-overflow-tooltip/>
        <el-table-column label="是否清洗" align="center" prop="isClean" width="120" show-overflow-tooltip/>
        <el-table-column label="IV均值" align="center" prop="iv_svr" width="100" show-overflow-tooltip/>
        <el-table-column label="VF1均值" align="center" prop="vf1_svr" width="100" show-overflow-tooltip/>
        <el-table-column label="VZ均值" align="center" prop="vz_svr" width="100" show-overflow-tooltip/>
        <el-table-column label="Thyristor良率" align="center" prop="thyristor_yield" width="100" show-overflow-tooltip/>
        <el-table-column label="Thyristor坏点" align="center" prop="thyristor_bad" width="150" show-overflow-tooltip/>
        <el-table-column label="综合良率" align="center" prop="compre_yield" width="100" show-overflow-tooltip/>
        <el-table-column label="生产良率" align="center" prop="product_yield" width="100" show-overflow-tooltip/>
        <el-table-column label="VF1良率" align="center" prop="vf1_yield" width="100" show-overflow-tooltip/>
        <el-table-column label="VF3良率" align="center" prop="vf3_yield" width="100" show-overflow-tooltip/>
        <el-table-column label="VF4良率" align="center" prop="vf4_yield" width="100" show-overflow-tooltip/>
        <el-table-column label="WLD1良率" align="center" prop="wld1_yield" width="100" show-overflow-tooltip/>
        <el-table-column label="IR良率" align="center" prop="ir_yield" width="100" show-overflow-tooltip/>
        <el-table-column label="IR_ESD_A良率" align="center" prop="ir_esd_a_yield" width="100" show-overflow-tooltip/>
        <el-table-column label="VZ良率" align="center" prop="vz_yield" width="100" show-overflow-tooltip/>
        <el-table-column label="IV良率" align="center" prop="iv_yield" width="100" show-overflow-tooltip/>
        <el-table-column label="VF2均值" align="center" prop="vf2_svr" width="100" show-overflow-tooltip/>
        <el-table-column label="VF3均值" align="center" prop="vf3_svr" width="100" show-overflow-tooltip/>
        <el-table-column label="VF4均值" align="center" prop="vf4_svr" width="100" show-overflow-tooltip/>
        <el-table-column label="WLD1均值" align="center" prop="wld1_svr" width="100" show-overflow-tooltip/>
        <el-table-column label="WLD1_STD" align="center" prop="wld1_std" width="100" show-overflow-tooltip/>
        <el-table-column label="WLP1均值" align="center" prop="wlp1_svr" width="100" show-overflow-tooltip/>
        <el-table-column label="HW1" align="center" prop="hw1" width="100" show-overflow-tooltip/>
        <el-table-column label="WLD2均值" align="center" prop="wld2_svr" width="100" show-overflow-tooltip/>
        <el-table-column label="BS(蓝移)" align="center" prop="bs" width="100" show-overflow-tooltip/>
        <el-table-column label="IR均值" align="center" prop="ir_svr" width="100" show-overflow-tooltip/>
        <el-table-column label="扫描数量" align="center" prop="scan_num" width="100" show-overflow-tooltip/>
        <el-table-column label="总测试数" align="center" prop="test_num" width="100" show-overflow-tooltip/>
        <el-table-column label="坏点数" align="center" prop="bad_num" width="100" show-overflow-tooltip/>
        <el-table-column label="机台" align="center" prop="machine" width="100" show-overflow-tooltip/>
        <el-table-column label="VF1异常占比" align="center" prop="vf_proportion" width="100" show-overflow-tooltip/>
        <el-table-column label="IR异常占比" align="center" prop="ir_proportion" width="100" show-overflow-tooltip/> -->
      </el-table>
      <el-table
        v-show="isActive === 1 && selectedRow.sliceType === 1"
        :data="detailList"
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
        <el-table-column label="ChipNo" align="center" prop="waferNo" width="180" fixed show-overflow-tooltip/>
        <el-table-column label="TapeNo" align="center" prop="tapeNo" width="140" show-overflow-tooltip/>
        <el-table-column v-for="item in formTheadf" v-if="item.thName !== '序号'&&item.thName !== 'ChipNo'&&item.thName !== 'TapeNo'" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[item.thKey] }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="产品型号" align="center" prop="taskModel" width="120" show-overflow-tooltip/>
        <el-table-column label="数量" align="center" prop="binCount" width="120" show-overflow-tooltip/>
        <el-table-column label="光色" align="center" prop="color" width="120" show-overflow-tooltip/>
        <el-table-column label="型号" align="center" prop="model" width="120" show-overflow-tooltip/>
        <el-table-column label="工艺" align="center" prop="craft" width="120" show-overflow-tooltip/>
        <el-table-column label="尺寸" align="center" prop="size" width="120" show-overflow-tooltip/>
        <el-table-column label="品质等级" align="center" prop="quality" width="120" show-overflow-tooltip/>
        <el-table-column label="外观等级" align="center" prop="classify" width="120" show-overflow-tooltip/>
        <el-table-column label="是否清洗" align="center" prop="isClean" width="120" show-overflow-tooltip/>
        <el-table-column label="VF1均值" align="center" prop="vf1_avg" width="100" show-overflow-tooltip/>
        <el-table-column label="VF1_STD" align="center" prop="vf1_std" width="100" show-overflow-tooltip/>
        <el-table-column label="VZ1均值" align="center" prop="vz_avg" width="100" show-overflow-tooltip/>
        <el-table-column label="VZ1_STD" align="center" prop="vz_std" width="150" show-overflow-tooltip/>
        <el-table-column label="IR均值" align="center" prop="ir_avg" width="150" show-overflow-tooltip/>
        <el-table-column label="IR_STD" align="center" prop="ir_std" width="150" show-overflow-tooltip/>
        <el-table-column label="LOP1" align="center" prop="lop_avg" width="100" show-overflow-tooltip/>
        <el-table-column label="LOP1_STD" align="center" prop="lop_std" width="100" show-overflow-tooltip/>
        <el-table-column label="WLD1" align="center" prop="wld_avg" width="100" show-overflow-tooltip/>
        <el-table-column label="WLD1_STD" align="center" prop="wld_std" width="100" show-overflow-tooltip/>
        <el-table-column label="WLC1" align="center" prop="wlc_avg" width="100" show-overflow-tooltip/>
        <el-table-column label="WLC1_STD" align="center" prop="wlc_std" width="100" show-overflow-tooltip/> -->
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
      title="审核"
      class="padding-dialog"
      width="1300px"
      top="80px"
      @close="handleClose">
      <el-row :gutter="15">
        <el-col :span="4">
          <div class="module-title-text">审核结果</div>
          <div class="module">
            <div style="padding: 0 25px">
              <div v-if="auditStaus === 0" class="examine-status">待审核</div>
              <div v-if="auditStaus === 1" class="examine-status" style="color: #009494">通过</div>
              <div v-if="auditStaus === 2" class="examine-status" style="color: #E25D5D">不通过</div>
            </div>
            <div style="height: 455px;padding: 10px; overflow-y: auto" v-html="outResultData"/>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="module-title-text">入库信息</div>
          <div class="module">
            <el-form ref="viewForm" :model="viewForm" status-icon label-width="80px" label-position="right">
              <el-form-item label="入库单号" size="small">
                <el-input v-model="viewForm.rkdh" :disabled="true" class="dialog-input" size="small"/>
              </el-form-item>
              <el-form-item label="单据类型" size="small">
                <el-input v-model="viewForm.djlx" :disabled="true" class="dialog-input" size="small"/>
              </el-form-item>
              <el-form-item label="入库片型" size="small">
                <el-input v-model="viewForm.rkpx" :disabled="true" class="dialog-input" size="small"/>
              </el-form-item>
              <el-form-item label="产品型号" size="small">
                <el-input v-model="viewForm.cpxh" :disabled="true" class="dialog-input" size="small"/>
              </el-form-item>
              <el-form-item label="正/副品" size="small">
                <el-input v-model="viewForm.zfp" :disabled="true" class="dialog-input" size="small"/>
              </el-form-item>
              <el-form-item label="制单人" size="small">
                <el-input v-model="viewForm.zdr" :disabled="true" class="dialog-input" size="small"/>
              </el-form-item>
              <el-form-item label="制单时间" size="small">
                <el-input v-model="viewForm.zdsj" :disabled="true" class="dialog-input" size="small"/>
              </el-form-item>
              <el-form-item label="审核人" size="small">
                <el-input v-model="viewForm.shr" :disabled="true" class="dialog-input" size="small"/>
              </el-form-item>
              <el-form-item label="审核时间" size="small">
                <el-input v-model="viewForm.shsj" :disabled="true" class="dialog-input" size="small"/>
              </el-form-item>
              <el-form-item label="备注" size="small">
                <el-input v-model="viewForm.remark" :rows="9" type="textarea" maxlength="50" class="dialog-input" size="small"/>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="15">
          <el-button v-if="selectedRow.status === 0" type="primary" size="mini" class="float-right" @click="handleTest"><svg-icon icon-class="jianyanwc"/> 检验</el-button>
          <el-button v-if="selectedRow.status !== 0" type="primary" size="mini" class="float-right" @click="handleExport"><svg-icon icon-class="export"/> 导出</el-button>
          <div class="module-title-text">入库明细</div>
          <div style="margin-top: 10px;border-bottom: 1px solid #e2e2e2"/>
          <div style="float: left;margin-top: 10px">
            共 <span style="font-weight: bold;color: #009494">{{ waferTol }}</span> 条
          </div>
          <el-table
            v-show="selectedRow.sliceType === 0"
            :data="detailList"
            :row-style="rowStyle"
            height="563"
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
            <el-table-column label="WaferID" align="center" prop="waferNo" width="200" fixed show-overflow-tooltip/>
            <el-table-column label="TapeNo" align="center" prop="tapeNo" width="140" show-overflow-tooltip/>
            <el-table-column v-for="item in formThead" v-if="item.thName !== '序号'&&item.thName !== 'WaferID'&&item.thName !== 'TapeNo'" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row[item.thKey] }}
              </template>
            </el-table-column>
          </el-table>
          <el-table
            v-show="selectedRow.sliceType === 1"
            :data="detailList"
            :row-style="rowStyle"
            height="563"
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
            <el-table-column label="ChipNo" align="center" prop="waferNo" width="200" fixed show-overflow-tooltip/>
            <el-table-column label="TapeNo" align="center" prop="tapeNo" width="140" show-overflow-tooltip/>
            <el-table-column v-for="item in formTheadf" v-if="item.thName !== '序号'&&item.thName !== 'ChipNo'&&item.thName !== 'TapeNo'" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row[item.thKey] }}
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div v-if="selectedRow.status === 1" class="float-right" style="height: 57px;margin-top: 15px">
        <span style="line-height: 50px;font-weight: bold;margin-right: 10px">反审原因</span>
        <el-input v-model="reverseReason" style="width: 736px;" type="textarea" maxlength="200"/>
      </div>
      <div class="clear-both"/>
      <span v-if="selectedRow.status !== 2" slot="footer" class="dialog-footer">
        <el-button v-if="selectedRow.status === 0" :disabled="outResultData === null" type="primary" @click="submitForm('addForm')">确 定</el-button>
        <el-button v-if="selectedRow.status === 1 || selectedRow.status === 4" type="primary" @click="handleRaudit('addForm')">反 审</el-button>
        <el-button @click="examineDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!--检验弹窗-->
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="testDialogVisible"
      title="检验"
      class="padding-dialog"
      width="544px"
      top="80px"
      append-to-body
      @close="handleCloseAudit">
      <div class="module-title">
        <div class="module-title-text">检验结果</div>
      </div>
      <div class="margin-top">
        <span style="margin-right: 30px">外观判定</span>
        <el-radio-group v-model="outDecide" @change="decideChange">
          <el-radio :label="0">OK</el-radio>
          <el-radio :label="1">NG</el-radio>
        </el-radio-group>
        <el-select v-model="filmNum" style="width: 270px; margin-left: 15px" size="small" placeholder="请选择片号" multiple collapse-tags filterable allow-create default-first-option>
          <el-option
            v-for="item in filmNumOptions"
            :key="item.waferNo"
            :label="item.waferNo"
            :value="item.waferNo"/>
        </el-select>
      </div>
      <div class="margin-top">
        <span style="margin-right: 30px">包装判定</span>
        <el-radio-group v-model="packDecide" @change="decideChange">
          <el-radio :label="0">OK</el-radio>
          <el-radio :label="1">NG</el-radio>
        </el-radio-group>
        <el-select v-model="packSelect" style="width: 270px; margin-left: 15px" size="small" placeholder="请选择" multiple collapse-tags filterable allow-create default-first-option>
          <el-option
            v-for="item in packDecideOptions"
            :key="item.name"
            :label="item.name"
            :value="item.name"/>
        </el-select>
      </div>
      <div class="margin-top">
        <span style="margin-right: 30px">光电判定</span>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="autoTest" >
          <span v-if="selectedRow.sliceType === 0">自动判定</span>
          <span v-if="selectedRow.sliceType === 1">回测判定</span>
        </el-button>
        <el-input v-if="selectedRow.sliceType === 0" v-model="autoRule" :disabled="true" style="margin-left: 42px; width: 270px;" size="small"/>
        <el-input v-if="selectedRow.sliceType === 1" v-model="selectedRow.model" :disabled="true" style="margin-left: 38px; width: 270px;" size="small"/>
      </div>
      <div class="module-title">
        <div class="module-title-text">检查结果</div>
      </div>
      <div style="border:1px solid #e2e2e2;height: 260px;overflow: auto;padding: 15px" class="margin-top" v-html="resultData"/>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="showSubmitBtn && finishAudit" type="primary" @click="handlePass('addForm')">通 过</el-button>
        <el-button v-if="!showSubmitBtn && finishAudit" type="primary" @click="handleNoPass('addForm')">不通过</el-button>
        <el-button @click="testDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./chipInCheck.js"></script>

<style scoped>
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
  .input-item{
    float: left;
    margin-top: 14px;
    margin-right: 10px;
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
  .input-title{
    width: 65px;
  }
  .dialog-input{
    width: 157px;
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
    border-bottom: 2px solid #009494;
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
    height: 600px;
    width: 100%;
    margin-top: 10px;
    padding-top: 15px;
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
</style>
