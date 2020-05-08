<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto">
      <div class="header-btn-group">
        <el-button
          size="small"
          type="primary"
          @click="tipOut"
        ><svg-icon icon-class="add"/> 衬底投片</el-button>
        <el-button
          :disabled="list.length === 0"
          size="small"
          class="float-right"
          type="danger"
          icon="el-icon-delete"
          @click="handleDelete"
        > 删 除</el-button>
        <el-button
          v-show="isShowMenu['wyproductionManage-movcdProduce-updateInfo']"
          :disabled="list.length === 0"
          size="small"
          class="float-right"
          type="primary"
          icon="el-icon-edit"
          @click="editTipOut"
        >修改信息</el-button>
      </div>
      <div class="search-box">
        <div class="left-search-box">
          <div class="input-item">
            <span class="input-title">RunID </span>
            <el-input v-model="searchKeys.runId" class="search-input" placeholder="请输入RunID" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">机台 </span>
            <el-select v-model="searchKeys.machine" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in machineList"
                :key="item.id"
                :label="item.code"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">炉次 </span>
            <el-select v-model="searchKeys.stove" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in stoveList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">状态 </span>
            <el-select v-model="searchKeys.status" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in statusOptions"
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
            @click="clearSearch"
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
          Run信息
        </div>
        <div
          :class="{'active':isActive === 1}"
          @click="navClick(1)"
        >
          Wafer信息TOL: <span v-text="waferTol"/>
        </div>
      </div>
      <!--run信息-->
      <el-table
        v-loading="listLoading"
        v-show="isActive === 0"
        ref="runTable"
        :data="list"
        height="87%"
        class="broad-scrollbar-table"
        element-loading-text="拼命加载中"
        highlight-current-row
        border
        fit
        @row-click="rowClick"
        @row-dblclick="rowDblclick"
      >
        <el-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="RunID" align="center" prop="runId" width="120" fixed>
          <template slot-scope="scope">
            <el-tooltip v-if="scope.row.oldRunId !== null" :content="'原有RunID: '+scope.row.oldRunId" placement="top">
              <div>{{ scope.row.runId }}</div>
            </el-tooltip>
            <div v-if="scope.row.oldRunId === null">{{ scope.row.runId }}</div>
          </template>
        </el-table-column>
        <el-table-column label="Recipe_Name" align="center" prop="recipeName" width="120" show-overflow-tooltip/>
        <el-table-column label="状态" align="center" prop="mandataryName" width="100">
          <template slot-scope="scope">
            <div>{{ getStatus(scope.row) }}</div>
          </template>
        </el-table-column>
        <el-table-column label="异常信息" align="center" prop="exception" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.exception !== ''" style="background: #f56c6c; color: #fff">{{ scope.row.exception }}</div>
          </template>
        </el-table-column>
        <el-table-column label="结构类型" align="center" prop="structure"/>
        <el-table-column label="衬底类型" align="center" prop="substrate"/>
        <el-table-column label="生产类型" align="center" prop="produce"/>
        <el-table-column label="机台" align="center" prop="machine"/>
        <el-table-column label="炉次" align="center" prop="stove"/>
        <el-table-column label="Platter_No" align="center" prop="platterNo" width="120" show-overflow-tooltip/>
        <el-table-column label="使用次数" align="center" prop="platterTotal"/>
        <el-table-column label="铝氮ID号" align="center" prop="alnId" width="100" show-overflow-tooltip/>
        <el-table-column label="投片时间" align="center" prop="createTime" width="100" show-overflow-tooltip/>
        <el-table-column label="保存时间" align="center" prop="saveTime" width="100" show-overflow-tooltip/>
        <el-table-column label="目标波长" align="center" prop="wavelength"/>
        <el-table-column label="放片人" align="center" prop="creator"/>
        <el-table-column label="开始时间" align="center" prop="startTime" width="150" show-overflow-tooltip/>
        <el-table-column label="待机时间" align="center" prop="standbyTime" width="100" show-overflow-tooltip/>
        <el-table-column label="运行时间" align="center" prop="runTime"/>
        <el-table-column label="取片人" align="center" prop="taker"/>
        <el-table-column label="结束时间" align="center" prop="endTime" width="170" show-overflow-tooltip/>
        <el-table-column label="波长调整人" align="center" prop="adjusts"/>
        <el-table-column label="待机原因" align="center" prop="standbyReason" show-overflow-tooltip/>
        <el-table-column label="备注" align="center" prop="remark" width="160" show-overflow-tooltip/>
      </el-table>
      <!--wafer信息-->
      <el-table
        v-loading="listLoading"
        v-show="isActive === 1"
        :data="waferList"
        :row-style="waferStyle"
        class="mocvd-table broad-scrollbar-table"
        height="94%"
        element-loading-text="拼命加载中"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="RunID" align="center" prop="runId" min-width="100" show-overflow-tooltip/>
        <el-table-column label="WaferID" align="center" prop="waferId" min-width="120" show-overflow-tooltip/>
        <el-table-column label="衬底工艺" align="center" prop="substrateType" width="180" show-overflow-tooltip/>
        <el-table-column label="铝氮ID" align="center" prop="alnId" show-overflow-tooltip/>
        <el-table-column label="单/双抛" align="center" prop="throw"/>
        <el-table-column label="尺寸" align="center" prop="measure"/>
        <el-table-column label="衬底厂家" align="center" prop="supplier" min-width="100" show-overflow-tooltip/>
        <el-table-column label="镭刻号" align="center" prop="laserMark" min-width="120" show-overflow-tooltip/>
        <el-table-column label="宕机清洗片" align="center" prop="clear" min-width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.clear === 0">否</span>
            <span v-if="scope.row.clear === 1">是</span>
          </template>
        </el-table-column>
        <el-table-column label="SWR" align="center" prop="swr" show-overflow-tooltip/>
        <el-table-column label="目检" align="center" prop="visual" show-overflow-tooltip/>
        <el-table-column label="II_STD" align="center" prop="iiStd" show-overflow-tooltip/>
        <el-table-column label="原因" align="center" prop="reason" min-width="120" show-overflow-tooltip/>
      </el-table>
      <el-pagination
        v-if="isActive === 0"
        :current-page="pageNum"
        :page-sizes="[15, 30, 40]"
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
      :before-close="handleDialogClose"
      top="80px"
      class="tip-out-dialog"
      title="衬底投片"
      width="1200px"
      @close="handleClose('tipOutForm')">
      <div class="tab-control">
        <span
          :class="{activeTab: activeTabIndex === 0}"
          @click="tabClick(0)"
        >基本信息</span>
        <span
          :class="{activeTab: activeTabIndex === 1, 'no-wafer': !isCreated && isTipOut}"
          class="margin-left"
          @click="tabClick(1)"
        >Wafer信息</span>
      </div>
      <div class="dialog-btn-group">
        <!--:disabled="!isCreated"-->
        <el-button :disabled="!isCreated" size="mini" type="primary" icon="el-icon-edit" class="float-right margin-left" @click="editSubstrateInfo">编辑衬底信息</el-button>
        <!--<el-button type="danger" icon="el-icon-close" class="float-right" @click="addDialogVisible = false">退出</el-button>-->
        <el-button v-if="isTipOut" :disabled="isLoading" size="mini" type="primary" icon="el-icon-check" class="float-right" @click="submitForm">保存</el-button>
        <el-button v-if="!isTipOut" :disabled="isLoading" size="mini" type="primary" icon="el-icon-check" class="float-right" @click="submitEditForm">保存</el-button>
      </div>
      <el-form v-show="activeTabIndex === 0" ref="tipOutForm" :model="tipOutForm" :rules="rules" status-icon label-width="140px" label-position="right">
        <div class="">
          <div class="module-title">
            <div class="module-title-text">投片信息</div>
          </div>
          <div class="module-content">
            <el-row :gutter="32">
              <el-col :span="15">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="RunID " size="small">
                      <el-input v-model="tipOutForm.runId" :disabled="true" class="tip-out-input"/>
                    </el-form-item>
                    <el-form-item label="结构类型 " prop="jglx" size="small" >
                      <el-select v-model="tipOutForm.jglx" :disabled="!isTipOut" filterable placeholder="请选择结构类型" class="tip-out-input" @change="structureTypeChange">
                        <el-option
                          v-for="item in structureTypeList"
                          :key="item.id"
                          :label="item.code"
                          :value="item.id"
                          class="tip-out-input"/>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="机台编号 " size="small" prop="jtbh">
                      <el-select v-model="tipOutForm.jtbh" :disabled="!isTipOut" filterable placeholder="请选择机台编号" class="tip-out-input" @change="machineChange">
                        <el-option
                          v-for="item in machineList"
                          :key="item.id"
                          :label="item.code"
                          :value="item.id"
                          class="tip-out-input"/>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="炉次 " size="small" prop="lcbh">
                      <el-select v-model="tipOutForm.lcbh" :disabled="!isTipOut" filterable placeholder="请选择炉次" class="tip-out-input" @change="stoveChange">
                        <el-option
                          v-for="item in stoveList"
                          :key="item.id"
                          :label="item.code"
                          :value="item.id"
                          class="tip-out-input"/>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="放片人 " size="small" prop="fpr">
                      <el-select v-model="tipOutForm.fpr" :disabled="machineSelected || !isTipOut" filterable placeholder="请选择放片人" class="tip-out-input">
                        <el-option
                          v-for="item in machineUserList"
                          :key="item.userId"
                          :label="item.userName"
                          :value="item.userId"
                          class="tip-out-input"/>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="大盘编号" size="small" prop="dpbh">
                      <el-select
                        v-if="isTipOut"
                        v-model="tipOutForm.dpbh"
                        :disabled="machineSelected"
                        :remote-method="remoteMethod"
                        :loading="loading"
                        placeholder="请选择大盘编号"
                        filterable
                        remote
                        reserve-keyword
                        class="tip-out-input"
                        @change="platterChange"
                        @visible-change="visibleChange">
                        <el-option
                          v-for="item in platterList"
                          :key="item.id"
                          :label="item.platterNo"
                          :value="item.id"
                          class="tip-out-input"/>
                      </el-select>
                      <el-select
                        v-if="!isTipOut"
                        v-model="tipOutForm.dpbh"
                        :disabled="machineSelected"
                        :remote-method="remoteEditMethod"
                        :loading="loading"
                        placeholder="请选择大盘编号"
                        filterable
                        remote
                        reserve-keyword
                        class="tip-out-input"
                        @change="platterChange"
                        @visible-change="visibleChange">
                        <el-option
                          v-for="item in platterList"
                          :key="item.id"
                          :label="item.platterNo"
                          :value="item.id"
                          class="tip-out-input"/>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="判定指向 " size="small" >
                      <el-input :disabled="true" value="1片代1圈" class="tip-out-input"/>
                    </el-form-item>
                    <el-form-item label="目标波长 " style="margin-bottom: 0" size="small" required>
                      <el-input v-model="tipOutForm.mbbc" placeholder="请输入目标波长" class="tip-out-input" type="number" step="0.1" @input="oninput"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item v-if="toBeSupplemented" label="原有RunID " size="small" >
                      <el-input :disabled="true" v-model="tipOutForm.oldRunId" class="tip-out-input"/>
                    </el-form-item>
                    <el-form-item label="衬底类型 " prop="cdlx" size="small" >
                      <el-select v-model="tipOutForm.cdlx" :disabled="!isTipOut" filterable placeholder="请选择衬底类型" class="tip-out-input" @change="substrateTypeChange">
                        <el-option
                          v-for="item in typeList"
                          :key="item.id"
                          :label="item.code"
                          :value="item.id"
                          class="tip-out-input"/>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="生产类型 " prop="sclx" size="small" >
                      <el-select v-model="tipOutForm.sclx" :disabled="!isTipOut" filterable placeholder="请选择生产类型" class="tip-out-input" @change="produceTypeChange">
                        <el-option
                          v-for="item in produceTypeList"
                          :key="item.id"
                          :label="item.code"
                          :value="item.id"
                          class="tip-out-input"/>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="日期 " prop="tipOutDate" size="small" >
                      <el-date-picker
                        :disabled="!isTipOut"
                        v-model="tipOutForm.tipOutDate"
                        :picker-options="pickerOptionsTipStart"
                        class="tip-out-input"
                        value-format="yyyy-MM-dd"
                        type="date"
                        placeholder="选择日期"
                        @change="tipOutDateChange"
                      />
                    </el-form-item>
                    <el-form-item label="开始时间 " style="margin-bottom: 12px;margin-top: -5px" required>
                      <el-col :span="11">
                        <el-form-item prop="hours">
                          <el-select
                            v-model="tipOutForm.hours"
                            size="small"
                            filterable
                            style="width:91px"
                            placeholder="请选择"
                            @change="tipOutFormHoursChange"
                          >
                            <el-option
                              v-for="item in hours"
                              :key="item.name"
                              :label="item.name"
                              :value="item.name"
                              class="tip-out-input"/>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="1" style="text-align: center">: </el-col>
                      <el-col :span="11">
                        <el-form-item prop="minutes">
                          <el-select
                            v-model="tipOutForm.minutes"
                            size="small"
                            filterable
                            class="tip-out-input"
                            style="width:91px"
                            placeholder="请选择"
                            @change="tipOutFormMinutesChange">
                            <el-option
                              v-for="item in minutes"
                              :key="item.name"
                              :label="item.name"
                              :value="item.name"/>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-form-item>
                    <el-form-item label="大盘使用次数 " prop="dpsycs" size="small" >
                      <el-input :disabled="true" v-model="tipOutForm.dpsycs" type="number" class="tip-out-input"/>
                    </el-form-item>
                    <el-form-item label="Recipe_Name " size="small" required>
                      <el-select
                        v-model="tipOutForm.recipeName"
                        :disabled="machineSelected"
                        filterable
                        allow-create
                        default-first-option
                        clearable
                        class="tip-out-input"
                        placeholder="请选择或输入">
                        <el-option
                          v-for="item in recipeList"
                          :key="item.name"
                          :label="item.name"
                          :value="item.name"
                          class="tip-out-input"/>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="待机原因 " size="small" >
                      <el-select v-model="tipOutForm.djyy" placeholder="请选择待机原因" class="tip-out-input" filterable clearable>
                        <el-option
                          v-for="item in standbyReasonList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                          class="tip-out-input"/>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="待机时间(m) " style="margin-bottom: 0" size="small" >
                      <el-input v-model="tipOutForm.djsj" :disabled="true" class="tip-out-input" maxlength="20"/>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="9">
                <div class="wafer-box">
                  <div v-if="!isTipOut" class="wafer-box-modal"/>
                  <div
                    v-for="item in wafers"
                    :key="item.name"
                    :class="{active: item.isActive === true, 'not-tip-out': !isTipOut, isError: item.error}"
                    class="wafer"
                    @click="waferClick(item)"
                    v-text="item.name"
                  >1~54</div>
                </div>
                <el-button
                  :disabled="!isTipOut"
                  size="small"
                  type="primary"
                  style="margin-top: 15px"
                  @click="createWaferID"><svg-icon style="font-size: 16px; vertical-align: middle" icon-class="shengcheng"/> {{ isCreated && isTipOut ? '重新生成WaferID' : '生成WaferID' }}
                </el-button>
                <el-button v-if="wafers.length > 0 && isTipOut" size="small" type="primary" class="float-right" style="margin-top: 15px;margin-right: -8px;background:#1abc9c;border-color:#1abc9c" @click="selectAll"><svg-icon icon-class="change"/> 全选切换</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-form>
      <el-form v-show="activeTabIndex === 0" ref="getForm" :model="getForm" :rules="rules" status-icon label-width="140px" label-position="right">
        <div class="">
          <div class="module-title">
            <div class="module-title-text">取片信息</div>
          </div>
          <div class="module-content">
            <el-row :gutter="32">
              <el-col :span="15">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="结束日期 " size="small">
                      <el-date-picker
                        :disabled="isTipOutStatus || fetchOutDisabled"
                        :picker-options="pickerOptionsGetEnd"
                        v-model="getForm.alniDate"
                        value-format="yyyy-MM-dd"
                        class="tip-out-input"
                        type="date"
                      />
                    </el-form-item>
                    <el-form-item label="结束时间 " size="small">
                      <el-select
                        :disabled="isTipOutStatus || fetchOutDisabled"
                        v-model="getForm.hours"
                        size="small"
                        filterable
                        style="width:93px"
                        placeholder="请选择"
                        @change="getFromHoursChange"
                      >
                        <el-option
                          v-for="item in hours"
                          :key="item.name"
                          :label="item.name"
                          :value="item.name"
                          class="tip-out-input"
                        />
                      </el-select>
                      :
                      <el-select
                        :disabled="isTipOutStatus || fetchOutDisabled"
                        v-model="getForm.minutes"
                        size="small"
                        filterable
                        class="tip-out-input"
                        style="width:93px"
                        placeholder="请选择"
                        @change="getFromMinutesChange">
                        <el-option
                          v-for="item in minutes"
                          :key="item.name"
                          :label="item.name"
                          :value="item.name"/>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="波长调整人 " style="margin-bottom: 0" size="small" >
                      <el-select v-model="getForm.bctzr" :disabled="isTipOutStatus || fetchOutDisabled" class="tip-out-input" placeholder="请选择波长调整人" filterable clearable="">
                        <el-option
                          v-for="item in machineUserList"
                          :key="item.userId"
                          :label="item.userName"
                          :value="item.userId"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="取片人 " size="small" prop="qpr">
                      <!--|| toBeSupplemented || isTipOut-->
                      <el-select v-model="getForm.qpr" :disabled="isTipOutStatus || fetchOutDisabled" class="tip-out-input" placeholder="请选择取片人" filterable>
                        <el-option
                          v-for="item in machineUserList"
                          :key="item.userId"
                          :label="item.userName"
                          :value="item.userId"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="异常处理 " size="small" >
                      <el-select v-model="getForm.yccl" :disabled="abnormalDisabled || isTipOutStatus || fetchOutDisabled" filterable clearable class="tip-out-input" placeholder="请选择">
                        <el-option
                          v-for="item in exceptionList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="备注 " style="margin-bottom: 0" size="small" >
                      <el-input v-model="getForm.remark" :disabled="isTipOutStatus || fetchOutDisabled" type="textarea" placeholder="请输入备注" class="tip-out-input" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="9">
                <el-button v-if="!isTipOut" size="small" type="primary" style="width: 120px;height: 50px;" @click="growthComplete"><svg-icon style="font-size: 16px; vertical-align: middle" icon-class="shengcheng"/>  生长完成</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-form>
      <!--wafer信息-->
      <el-table
        v-loading="listLoading"
        v-show="activeTabIndex === 1"
        :data="viewWaferList"
        :row-style="rowStyle"
        class="view-edit-cub"
        height="513"
        element-loading-text="拼命加载中"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="WaferID" align="center" prop="waferId" width="120"/>
        <el-table-column label="衬底工艺" align="center" prop="substrateType"/>
        <el-table-column label="铝氮工艺" align="center" prop="alnCraft"/>
        <el-table-column label="单双抛" align="center" prop="throw"/>
        <el-table-column label="尺寸" align="center" prop="measure" width="120"/>
        <el-table-column label="衬底厂家" align="center" prop="supplier"/>
        <el-table-column label="镭刻号" align="center" prop="laserMark" width="120"/>
        <el-table-column label="SWR" align="center" prop="name"/>
        <el-table-column label="目检" align="center" prop="name"/>
        <el-table-column label="原因" align="center" prop="name"/>
      </el-table>
      <!--编辑衬底信息-->
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="innerVisible"
        width="1350px"
        top="80px"
        class="tip-out-inner-dialog"
        title="编辑衬底信息"
        append-to-body
        @close="closeInnerDialog">
        <el-row class="edit-cub">
          <el-col :span="19">
            <el-row>
              <el-col :span="11">
                <el-button
                  size="small"
                  class="float-right"
                  type="danger"
                  @click="clearAllSelected"
                ><svg-icon icon-class="clear"/> 清除全部</el-button>
                <div class="table-title">Wafer信息</div>
                <el-table
                  ref="waferTable"
                  :data="leftList"
                  :row-style="rowStyle"
                  :row-class-name="leftTableRowClassColor"
                  class="sub-table"
                  element-loading-text="拼命加载中"
                  highlight-current-row
                  border
                  fit
                  height="543"
                  @cell-mouse-enter="hoverLeftCall"
                  @current-change="waferCurrentChange"
                  @row-click="waferRowClick"
                >
                  <el-table-column align="center" label="序号" width="50">
                    <template slot-scope="scope">
                      {{ scope.$index+1 }}
                    </template>
                  </el-table-column>
                  <el-table-column label="WaferID" align="center" prop="waferId" width="120"/>
                  <el-table-column label="镭刻号" align="center" prop="laserMark"/>
                  <el-table-column label="宕机清洗片" align="center" width="80">
                    <template slot-scope="scope">
                      <el-checkbox v-model="scope.row.down"/>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center" width="80">
                    <template slot-scope="scope">
                      <i class="el-icon-delete" style="color: #f00;font-size: 16px;cursor: pointer;" @click="deleteItem(scope.row, 1)"/>
                      <i @click="handleUp(scope.row, scope.$index)"><svg-icon style="color: #009494;font-size: 20px;cursor: pointer;" icon-class="top" /></i>
                      <i @click="handleDown(scope.row, scope.$index)"><svg-icon style="color: #009494;font-size: 20px;cursor: pointer;" icon-class="bottom" /></i>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
              <el-col :span="2" style="text-align: center;font-size: 36px;color: #009494">
                <div style="margin-top: 300px;cursor: pointer;" @click="toLeft">
                  <svg-icon icon-class="left"/>
                </div>
                <div style="cursor: pointer;" @click="toRight">
                  <svg-icon icon-class="right"/>
                </div>
              </el-col>
              <el-col :span="11">
                <el-button
                  size="small"
                  class="float-right"
                  type="danger"
                  @click="clearAll"
                ><svg-icon icon-class="clear"/> 清除全部</el-button>
                <div class="table-title">
                  衬底信息
                </div>
                <el-table
                  ref="rightTable"
                  :data="rightList"
                  :row-class-name="tableRowClassColor"
                  class="sub-table"
                  element-loading-text="拼命加载中"
                  border
                  fit
                  height="543"
                  @selection-change="selectionChange"
                  @cell-mouse-enter="hoverCall"
                >
                  <el-table-column
                    type="selection"
                    width="50"
                    align="center"/>
                  <el-table-column align="center" label="位次号" prop="sequence" width="60"/>
                  <el-table-column label="镭刻号" align="center" prop="laserMark"/>
                  <el-table-column label="衬底工艺" align="center" prop="substrateType"/>
                  <el-table-column label="铝氮ID" align="center" prop="aln_id"/>
                </el-table>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="5">
            <div class="inner-right" style="padding-top: 100px">
              <div style="margin-bottom: 20px">镭刻号</div>
              <div>
                <el-input v-model="LaserMark" placeholder="扫码或输入镭刻号" @keyup.enter.native="findSubstrateFun"/>
              </div>
              <div style="margin: 30px 0 20px 0">盒号</div>
              <div>
                <el-input ref="importImput" :autofocus="true" v-model="boxNum" placeholder="扫码或输入盒号" @keyup.enter.native="findSubstrateFun"/>
              </div>
              <el-button
                v-loading="searchLoading"
                size="small"
                style="margin-top: 30px;width: 100%"
                type="primary"
                icon="el-icon-search"
                @click="findSubstrateFun"
              >查 找</el-button>
              <el-button
                size="small"
                style="margin-top: 30px;width: 221.48px;position: absolute;bottom: 0;right: 0px;"
                type="primary"
                icon="el-icon-check"
                @click="importsClosure"
              >导入完成</el-button>
            </div>
          </el-col>
        </el-row>
      </el-dialog>
    </el-dialog>
    <el-dialog
      v-drag
      :visible.sync="alertDialogVisible"
      width="500px"
      class="tip-out-inner-dialog"
      title="提示"
    >
      <div style="font-size: 22px;text-align: center">所选大盘尚未烘烤，是否继续使用?</div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="handleDetermine">确 定</el-button>
        <el-button size="small" @click="handleCancel">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .broad-scrollbar-table>>> .el-table__fixed {
    background: #fff;
    height: calc(100% - 12px) !important;
  }
  .inner-right{
    height: 577px;
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
    position: relative;
    overflow: hidden;
    width: 434px;
  }
  .wafer-box-modal{
    cursor: not-allowed !important;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
  .tip-out-input{
    width: 199px;
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
    width: 155px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 265px);
  }
  .app-container>>> .cell{
    line-height: 33px;
  }
  .app-container>>> td{
    height: 33px;
  }
  .input-title{
    width: 55px;
  }
  .app-container>>> .el-table--border {
    border-top: 2px solid #009494;
  }
  .mocvd-table ::-webkit-scrollbar {/*滚动条整体样式*/
    height: 15px !important;
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
  }
  .tip-out-inner-dialog>>>.el-dialog__body{
    padding-top: 20px;
    user-select: none;
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
    padding-bottom: 0;
  }
  .no-wafer:hover{
    color: #666;
    cursor: default;
  }
  .module-content>>> .el-checkbox-group{
    float: right;
    margin-right: 6px;
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
  .wafer.active, .wafer.isError.active{
    background: #009494;
    color: #fff;
  }
  .wafer.active.not-tip-out{
    cursor: not-allowed !important;
    background: #439494;
  }
  .wafer.isError{
    background: #f56c6c;
    color: #fff;
  }
  .sub-table{
    height: 618px;
  }
  .edit-cub>>> .cell{
    line-height: 35px;
  }
  .edit-cub>>> td{
    height: 35px;
  }
  .edit-cub>>>.el-table .set_green td{
    background-color: #cceaea;
  }
  .start-time>>> .el-input__inner{
    padding-right: 133px;
  }
  .sub-table>>> .el-table__body tr.current-row > td {
    background-color: #8adede;
  }
  .el-col-11{
    padding-right: 0!important;
    padding-left: 0!important;
  }
  .el-col-1{
    padding-left: 4px!important;
    padding-right: 12px!important;
  }
  @media (max-width: 1632px) {
    .module-content{
      padding: 9px
    }
    .edit-cub>>> .cell{
      line-height: 35px;
    }
    .edit-cub>>> td{
      height: 35px;
    }
    .view-edit-cub>>> .cell{
      line-height: 33px;
    }
    .view-edit-cub>>> td{
      height: 33px;
    }
    .sub-table{
      height: 500px;
    }
    .tip-out-inner-dialog>>>.el-dialog__body{
      user-select: none;
    }
    .inner-right{
      height: 577px;
    }
    .wafer{
      width: 46.3px;
      height: 46.3px;
    }
  }
</style>
