<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto">
      <div class="header-btn-group">
        <el-button
          size="small"
          type="primary"
          @click="tipOut"
        ><svg-icon icon-class="add"/> 铝氮投片</el-button>
        <el-button
          size="small"
          class="float-right"
          type="primary"
          @click="handleViewSanPian"
        ><svg-icon icon-class="sanpianku"/> 散片库</el-button>
        <el-button
          size="small"
          type="danger"
          class="float-right"
          icon="el-icon-delete"
          @click="deleteTipOut"
        >删 除</el-button>
      </div>
      <div class="search-box">
        <div class="left-search-box">
          <div class="input-item">
            <span class="input-title">铝氮ID </span>
            <el-input v-model="searchKeys.alnId" class="search-input" placeholder="请输入铝氮ID" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">设备编号 </span>
            <el-select v-model="searchKeys.machineId" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in alnMachineList"
                :key="item.id"
                :label="item.code"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">生产状态 </span>
            <el-select v-model="searchKeys.status" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in productionOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">操作人 </span>
            <el-select v-model="searchKeys.creator" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">放片时间 </span>
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
        class="broad-scrollbar-table"
        height="83%"
        element-loading-text="拼命加载中"
        highlight-current-row
        border
        fit
        @row-click="rowClick"
        @row-dblclick="cellDblclick"
      >
        <el-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="铝氮ID" align="center" prop="alnId" width="120" show-overflow-tooltip fixed/>
        <el-table-column label="铝氮任务名称" align="center" prop="alnTaskId" width="220" show-overflow-tooltip/>
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">生长中</span>
            <span v-if="scope.row.status === 1">生长完成</span>
          </template>
        </el-table-column>
        <el-table-column label="放片信息" align="center">
          <el-table-column label="PM周期" align="center" prop="cycle"/>
          <el-table-column label="衬底尺寸" align="center" prop="measure" width="120"/>
          <el-table-column label="衬底厂家" align="center" prop="supplier" width="120" show-overflow-tooltip/>
          <el-table-column label="卡塞" align="center" prop="stopper" width="160" show-overflow-tooltip/>
          <el-table-column label="工艺" align="center" prop="craftName" width="150" show-overflow-tooltip/>
          <el-table-column label="设备编号" align="center" prop="machine" show-overflow-tooltip/>
          <el-table-column label="放片时间" align="center" prop="createTime" width="150" show-overflow-tooltip/>
          <el-table-column label="放片人" align="center" prop="creator" show-overflow-tooltip/>
        </el-table-column>
        <el-table-column label="参数信息" align="center" prop="mandataryName">
          <el-table-column label="结束溅射电压" align="center" prop="voltage" width="120"/>
          <el-table-column label="工艺压力" align="center" prop="param4" width="120"/>
          <el-table-column label="冷泵容量(L)" align="center" prop="pressure" width="120"/>
          <el-table-column label="靶材消耗(kwh)" align="center" prop="material" width="120"/>
          <el-table-column label="二级冷板温度" align="center" prop="param5" width="120"/>
          <el-table-column label="漏率" align="center" prop="param6" width="120"/>
          <el-table-column label="压升率" align="center" prop="param7" width="120"/>
        </el-table-column>
        <el-table-column label="取片信息" align="center" prop="mandataryName">
          <el-table-column label="取片人" align="center" prop="taker"/>
          <el-table-column label="取片时间" align="center" prop="takeTime" width="150" show-overflow-tooltip/>
          <el-table-column label="过程文件" align="center"/>
          <el-table-column label="备注" align="center" prop="remark" min-width="120" show-overflow-tooltip/>
        </el-table-column>
      </el-table>
      <!--wafer信息-->
      <el-table
        v-loading="listLoading"
        v-show="isActive === 1"
        :data="waferList"
        class="mocvd-table broad-scrollbar-table"
        height="94%"
        element-loading-text="拼命加载中"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="铝氮ID" align="center" prop="alnId" width="130" show-overflow-tooltip fixed/>
        <el-table-column label="铝氮任务名称" align="center" prop="taskId" width="240" show-overflow-tooltip/>
        <el-table-column label="铝氮盒号" align="center" prop="alnBoxNo" width="130" show-overflow-tooltip/>
        <el-table-column label="次序号" align="center" prop="alnSequence" width="80" show-overflow-tooltip/>
        <el-table-column label="原始盒号" align="center" prop="boxNo" width="130" show-overflow-tooltip/>
        <el-table-column label="原始次序号" align="center" prop="sequence" width="100" show-overflow-tooltip/>
        <el-table-column label="大盘号" align="center" prop="alnPlatter" width="180" show-overflow-tooltip/>
        <el-table-column label="盘位" align="center" prop="location" width="80" show-overflow-tooltip/>
        <el-table-column label="镭刻号" align="center" prop="laserMark" width="130" show-overflow-tooltip/>
        <el-table-column label="单/双抛" align="center" prop="throw" show-overflow-tooltip/>
        <el-table-column label="衬底工艺" align="center" prop="substrateType" width="180" show-overflow-tooltip/>
        <el-table-column label="衬底尺寸" align="center" prop="measure" show-overflow-tooltip/>
        <el-table-column label="衬底厂家" align="center" prop="supplier" show-overflow-tooltip/>
      </el-table>
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
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="sanPianDialogVisible"
      top="80px"
      class="san-pian-dialog"
      title="散片库"
      width="1200px"
      @close="handleCloseSp">
      <div class="header-btn-group">
        <el-button
          size="small"
          type="primary"
          @click="createSpBoxNum"
        ><svg-icon style="vertical-align: middle" icon-class="shengcheng"/>  生成新盒</el-button>
        <el-button
          size="small"
          type="primary"
          @click="printSpBoxNo"
        ><svg-icon icon-class="print"/> 打印标签</el-button>
      </div>
      <div class="search-box" style="margin-bottom: 12px">
        <div class="left-search-box">
          <div class="input-item">
            <span class="input-title">盒号 </span>
            <el-input v-model="dialogSearch.boxNo" class="search-input" placeholder="请输盒号" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">镭刻号 </span>
            <el-input v-model="dialogSearch.subNo" class="search-input" placeholder="请输入镭刻号" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">入库时间 </span>
            <el-date-picker
              v-model="dialogSearch.beginDate"
              :picker-options="pickerOptionsStartSp"
              :editable="false"
              clearable
              class="search-input"
              size="small"
              type="date"
              placeholder="选择开始时间"
              value-format="timestamp"
            />
            <span style="display:inline-block;width: 38px;text-align: center"> 至 </span>
            <el-date-picker
              v-model="dialogSearch.endDate"
              :picker-options="pickerOptionsEndSp"
              :editable="false"
              clearable
              class="search-input"
              size="small"
              type="date"
              placeholder="选择结束时间"
              value-format="timestamp"
            />
          </div>
        </div>
        <div class="right-btn-box">
          <el-button
            class="float-right margin-top margin-left"
            size="small"
            type="danger"
            @click="clearDialogSearch"
          >
            重 置
          </el-button>
          <el-button
            class="float-right margin-top margin-left"
            size="small"
            type="primary"
            @click="dialogSearchFun"
          >
            查 询
          </el-button>
        </div>
      </div>
      <el-table
        v-loading="listLoading"
        ref="multipleTable"
        :data="scatteredList"
        class="mocvd-table"
        height="500px"
        element-loading-text="拼命加载中"
        highlight-current-row
        border
        fit
        @row-click="spRowClick"
        @selection-change="tableChangeFun"
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="入库时间" align="center" prop="createTime" width="100" show-overflow-tooltip/>
        <el-table-column label="放片人" align="center" prop="creator"/>
        <el-table-column label="散片盒号" align="center" prop="boxNo" width="110" show-overflow-tooltip/>
        <el-table-column label="散片次序" align="center" prop="sequence" width="80"/>
        <el-table-column label="原始盒号" align="center" prop="yBoxNo" width="170" show-overflow-tooltip/>
        <el-table-column label="原始次序" align="center" prop="ySequence" width="80"/>
        <el-table-column label="镭刻号" align="center" prop="laserMark" width="100"/>
        <el-table-column label="衬底工艺" align="center" prop="substrateType" width="80"/>
        <el-table-column label="衬底尺寸" align="center" prop="measure" width="80"/>
        <el-table-column label="衬底厂家" align="center" prop="supplier" width="100" show-overflow-tooltip/>
        <el-table-column
          :selectable="selectable"
          type="selection"
          width="70"/>
      </el-table>
      <div style="height: 45px;">
        <el-pagination
          :current-page="pageNumSp"
          :page-sizes="[20, 25, 50, 100]"
          :page-size="pageSizeSp"
          :total="totalPageSp"
          class="pagination"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="sizeChangeSp"
          @current-change="currentChangeSp"
        />
      </div>
      <!--新增散片盒号-->
      <el-dialog
        :visible.sync="createSpBoxNumVisible"
        width="450px"
        top="180px"
        class="tip-out-inner-dialog"
        title="生成新盒"
        append-to-body>
        <div style="text-align: center">
          <span>散片盒号 </span>
          <el-input :disabled="true" v-model="newSpBoxNo" class="tip-out-input"/>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="submitAndPrint">保存并打印</el-button>
          <el-button size="small" @click="createSpBoxNumVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible"
      :before-close="handleDialogClose"
      top="80px"
      class="tip-out-dialog"
      title="铝氮投片"
      width="1200px"
      @close="handleClose('alniForm')">
      <div class="tab-control" style="margin-bottom: 0">
        <span
          :class="{activeTab: activeTabIndex === 0}"
          @click="tabClick(0)"
        >基本信息</span>
        <span
          :class="{activeTab: activeTabIndex === 1}"
          class="margin-left"
          @click="tabClick(1)"
        >衬底信息</span>
      </div>
      <div class="dialog-btn-group">
        <!--<el-button type="primary" icon="el-icon-edit" class="float-right margin-left" @click="editSubstrateInfo">编辑衬底信息</el-button>-->
        <!--<el-button type="danger" icon="el-icon-close" class="float-right margin-left" @click="addDialogVisible = false">退出</el-button>-->
        <el-button v-if="isTipOut" :disabled="submitBtnDisabled" type="primary" size="small" icon="el-icon-check" class="float-right" @click="submitForm('alniForm')">保存</el-button>
        <el-button type="primary" size="small" class="float-right margin-right" @click="createBoxNum"><svg-icon style="vertical-align: middle" icon-class="print"/>  打印盒标签</el-button>
      </div>
      <el-form v-show="activeTabIndex === 0" ref="alniForm" :model="alniForm" :rules="rules" status-icon label-width="140px" label-position="right">
        <div class="">
          <div class="module-title">
            <div class="module-title-text">投片信息</div>
          </div>
          <div class="module-content">
            <el-row>
              <el-col :span="8">
                <el-form-item label="铝氮ID " size="small" prop="alNiId">
                  <el-input v-model="alniForm.alNiId" :disabled="true" class="tip-out-input"/>
                </el-form-item>
                <el-form-item label="铝氮机台 " prop="ldjt" size="small" >
                  <el-select v-model="alniForm.ldjt" :disabled="!isTipOut" class="tip-out-input" placeholder="请选择铝氮机台" filterable @change="alnMachineChange">
                    <el-option
                      v-for="item in alnMachineList"
                      :key="item.id"
                      :label="item.code"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="放片数量 " size="small">
                  <el-input v-model="selectedTotal" :disabled="true" class="tip-out-input" maxlength="20"/>
                </el-form-item>
                <el-form-item label="PM周期 " size="small">
                  <el-input v-model="alniForm.pm" :disabled="true" style="width: 112px;"/>
                  <el-button :disabled="alniForm.ldjt === '' || !isTipOut" type="danger" icon="el-icon-refresh" class=" margin-left" size="small" @click="handleReset">重置</el-button>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="铝氮任务名称 " size="small" prop="ldrwmc">
                  <el-input v-model="alniForm.ldrwmc" :disabled="true" maxlength="25" class="tip-out-input"/>
                </el-form-item>
                <el-form-item label="衬底尺寸 " prop="cdcc" size="small" >
                  <el-select v-model="alniForm.cdcc" :disabled="!isTipOut" class="tip-out-input" placeholder="请选择衬底尺寸" filterable @change="measureChange">
                    <el-option
                      v-for="item in measureList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="卡塞 " prop="ks" size="small" >
                  <el-select v-model="alniForm.ks" :disabled="ksDisabled || !isTipOut" class="tip-out-input" placeholder="请选择卡塞" filterable @change="ksChange" >
                    <el-option
                      v-for="item in caseOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="投片日期" prop="alniDate" size="small">
                  <el-date-picker
                    :disabled="!isTipOut"
                    v-model="alniForm.alniDate"
                    value-format="yyyy-MM-dd"
                    class="tip-out-input"
                    type="date"
                    placeholder="选择日期"
                    @change="dateChange"
                  />
                  <!--<el-col :span="11" class="alni-time">
                    <el-form-item prop="alniTime" size="small">
                      <el-time-picker
                        :disabled="!isTipOut"
                        v-model="alniForm.alniTime"
                        style="width: 100px"
                        value-format="HH:mm"
                        placeholder="选择时间"
                        @change="timeChange"
                      />
                    </el-form-item>
                  </el-col>-->
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="衬底厂家 " size="small">
                  <el-input v-model="alniForm.cdcj" :disabled="true" class="tip-out-input"/>
                </el-form-item>
                <el-form-item label="放片人 " size="small" >
                  <el-input v-if="isTipOut" :value="getToken" :disabled="true" class="tip-out-input"/>
                  <el-select v-if="!isTipOut" v-model="alniForm.fpr" :disabled="true" class="tip-out-input" placeholder="请选择放片人" filterable @change="userChange">
                    <el-option
                      v-for="item in userList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="铝氮工艺 " size="small" prop="ldgy">
                  <el-select v-model="alniForm.ldgy" :disabled="!isTipOut" class="tip-out-input" placeholder="请选择铝氮工艺" filterable @change="alnCraftChange">
                    <el-option
                      v-for="item in alnCraftList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="投片时间" size="small" required>
                  <el-col :span="9">
                    <el-form-item>
                      <el-select
                        :disabled="!isTipOut"
                        v-model="alniForm.hours"
                        size="small"
                        filterable
                        style="width:91px"
                        placeholder="请选择"
                        @change="timeChange"
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
                  <el-col :span="9">
                    <el-form-item>
                      <el-select
                        :disabled="!isTipOut"
                        v-model="alniForm.minutes"
                        size="small"
                        filterable
                        class="tip-out-input"
                        style="width:93px"
                        placeholder="请选择"
                        @change="timeChange"
                      >
                        <el-option
                          v-for="item in minutes"
                          :key="item.name"
                          :label="item.name"
                          :value="item.name"/>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="">
          <div class="module-title">
            <div class="module-title-text">参数信息</div>
          </div>
          <div class="module-content">
            <el-row>
              <el-col :span="8">
                <el-form-item label="结束溅射电压 " size="small" required>
                  <el-input v-model="alniForm.jsdy" :disabled="isFinish" class="tip-out-input" type="number" @input="jsdyChange"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="工艺压力 " size="small" required>
                  <el-input v-model="alniForm.param4" :disabled="isFinish" class="tip-out-input" type="number" @input="param4Change"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="冷泵容量(L) " size="small">
                  <el-input v-model="alniForm.lbyl" :disabled="isFinish" class="tip-out-input" type="number" @input="lbylChange"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="靶材消耗(kwh) " size="small">
                  <el-input v-model="alniForm.bcxh" :disabled="isFinish" class="tip-out-input" type="number" @input="bcxhChange"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="二级冷板温度(<15)" size="small">
                  <el-input v-model="alniForm.param5" :disabled="isFinish" class="tip-out-input" type="number" @input="param5Change"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="漏率 " size="small">
                  <el-input v-model="alniForm.param6" :disabled="isFinish" class="tip-out-input" type="number" @input="param6Change"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="压升率 " size="small">
                  <el-input v-model="alniForm.param7" :disabled="isFinish" class="tip-out-input" type="number" @input="param7Change"/>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="">
          <div class="module-title">
            <div class="module-title-text">取片信息</div>
          </div>
          <div class="module-content">
            <el-form v-show="activeTabIndex === 0" ref="getForm" :model="getForm" status-icon label-width="140px" label-position="right">
              <el-row>
                <el-col :span="8" class="tiem-select">
                  <el-form-item label="结束日期 " prop="alniDate" size="small">
                    <el-date-picker
                      :disabled="isFinish || isTipOut"
                      v-model="getForm.alniDate"
                      class="tip-out-input"
                      value-format="yyyy-MM-dd"
                      type="date"
                      @change="dateChange"
                    />
                  </el-form-item>
                  <!--<el-col :span="11" class="alni-time">
                      <el-form-item prop="alniTime" size="small">
                        <el-time-picker
                          :disabled="isFinish || isTipOut"
                          v-model="getForm.alniTime"
                          style="width: 100px"
                          value-format="HH:mm"
                          @change="timeChange"
                        />
                      </el-form-item>
                    </el-col>-->
                  <el-form-item label="结束时间" size="small">
                    <el-col :span="9">
                      <el-form-item>
                        <el-select
                          :disabled="isFinish || isTipOut"
                          v-model="getForm.hours"
                          size="small"
                          filterable
                          style="width:91px"
                          placeholder="请选择">
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
                    <el-col :span="9">
                      <el-form-item>
                        <el-select
                          :disabled="isFinish || isTipOut"
                          v-model="getForm.minutes"
                          size="small"
                          filterable
                          class="tip-out-input"
                          style="width:93px"
                          placeholder="请选择">
                          <el-option
                            v-for="item in minutes"
                            :key="item.name"
                            :label="item.name"
                            :value="item.name"/>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="取片人 " size="small">
                    <el-input v-if="!isFinish" :value="getToken" :disabled="true" class="tip-out-input"/>
                    <el-input v-if="isFinish" :disabled="true" v-model="getForm.qpr" class="tip-out-input"/>
                  </el-form-item>
                  <el-form-item label="备注">
                    <el-input v-model="getForm.remark" :disabled="isFinish || isTipOut" class="tip-out-input" type="textarea" maxlength="50"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-button :disabled="isFinish || isTipOut" size="small" type="primary" class="float-right" style="position: absolute;top: 0px;right: 42px;z-index: 100" @click="takeSliceFun"><svg-icon style="vertical-align: middle" icon-class="shengcheng"/> 生长完成</el-button>
                  <el-form-item label="占位 " style="opacity: 0" size="small"/>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
      </el-form>
      <!--衬底信息-->
      <el-row v-show="activeTabIndex === 1" class="substrate-info ">
        <el-row>
          <el-col :span="12">
            <div class="table-title">
              卡塞  <span style="font-weight: normal">{{ caseName }}</span>
              <div class="float-right">
                total: <span style="font-weight: normal">{{ selectedTotal }}</span>
              </div>
            </div>
            <div class="table-top-btn-group substrate" style="width: 100%;">
              <div v-for="(item, index) in pliesList" :key="index" :class="{'active':isActiveCs === (pliesList.length - index), 'forbidden': item.status === 1}" @click="csNavClick(pliesList.length - index)">{{ 'CC-' + (pliesList.length - index) }}</div>
            </div>
            <el-table
              ref="waferTable"
              :data="leftList"
              :row-style="rowStyle"
              height="447"
              element-loading-text="拼命加载中"
              highlight-current-row
              border
              fit
              @current-change="waferCurrentChange"
            >
              <el-table-column align="center" label="盘位" width="50">
                <template slot-scope="scope">
                  {{ scope.$index+1 }}
                </template>
              </el-table-column>
              <el-table-column label="镭刻号" align="center" prop="laserMark" width="120" show-overflow-tooltip/>
              <el-table-column label="盒号" align="center" prop="boxNo" width="160" show-overflow-tooltip/>
              <el-table-column label="盒内位次" align="center" prop="sequence" show-overflow-tooltip/>
              <el-table-column label="操作" align="center" prop="">
                <template slot-scope="scope">
                  <i :class="{'not-tip-out': !isTipOut}" class="el-icon-delete" style="color: #f00;font-size: 16px;cursor: pointer;" @click="deleteItem(scope.row, scope.$index)"/>
                  <i :class="{'not-tip-out': !isTipOut}" @click="handleUp(scope.$index)"><svg-icon :class="{'not-tip-out': !isTipOut}" style="color: #009494;font-size: 20px;cursor: pointer;" icon-class="top" /></i>
                  <i :class="{'not-tip-out': !isTipOut}" @click="handleDown(scope.$index)"><svg-icon :class="{'not-tip-out': !isTipOut}" style="color: #009494;font-size: 20px;cursor: pointer;" icon-class="bottom" /></i>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="2" style="text-align: center;font-size: 36px;color: #009494">
            <div :class="{'not-tip-out': !isTipOut}" class="to-left" style="margin-top: 240px;cursor: pointer;" @click="toLeft">
              <svg-icon icon-class="left"/>
            </div>
            <div :class="{'not-tip-out': !isTipOut}" style="cursor: pointer;" @click="toRight">
              <svg-icon icon-class="right"/>
            </div>
            <div style="margin-top: 30px">
              <el-button :disabled="!isTipOut" type="primary" size="mini" style="padding: 8px 10px" @click="distribution">自动分配</el-button>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="table-title">
              <el-button :disabled="!isTipOut" type="primary" size="mini" @click="sweepCodeImport"><svg-icon icon-class="import"/> 扫码导入</el-button>
              <el-input ref="importImput" :autofocus="true" :disabled="!isTipOut" v-model="boxNum" size="mini" placeholder="扫码或输入盒号" class="margin-left" style="width: 200px;height: 30px;" @keyup.enter.native="sweepCodeImport"/>
              <el-button :disabled="!isTipOut" type="danger" size="mini" class="float-right" style="margin-top: 6px" icon="el-icon-delete" @click="deleteCurrentBox">删除</el-button>
            </div>
            <div class="table-top-btn-group substrate" style="width: 100%">
              <div v-if="rightData.length === 0" class="active">1</div>
              <!--v-dragging="{item: index, group: 'substrateBox' }"-->
              <div
                v-for="(item, index) in rightData"
                :key="index"
                :class="{'active':isActiveBoxNum === index}"
                @click="boxNumNavClick(index)">{{ index + 1 }}</div>
              <strong class="substrate-total">
                Total: {{ rightData.length }} 盒 , {{ rightWaferTotal }} 片
              </strong>
            </div>
            <el-table
              ref="substarateTable"
              :data="rightList"
              class="sub-table"
              element-loading-text="拼命加载中"
              height="447"
              highlight-current-row
              border
              fit
              @current-change="subStrateCurrentChange"
              @selection-change="selectionChange"
            >
              <el-table-column
                type="selection"
                width="70"/>
              <el-table-column label="盒号" align="center" prop="boxNo" width="190"/>
              <el-table-column label="盒内位次" align="center" prop="sequence"/>
              <el-table-column label="镭刻号" align="center" prop="laserMark"/>
            </el-table>
          </el-col>
        </el-row>
      </el-row>
      <!--生产盒号-->
      <el-dialog
        :visible.sync="createBoxNumVisible"
        width="450px"
        top="180px"
        class="tip-out-inner-dialog"
        title="铝氮盒号"
        append-to-body>
        <el-table
          :data="boxList"
          element-loading-text="拼命加载中"
          border
          fit
        >
          <el-table-column align="center" prop="createdBoxNum" label="盒号"/>
          <el-table-column label="操作" align="center" prop="">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="printBarcode(scope.row)"><svg-icon icon-class="print"/> 打印标签</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
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
  .forbidden{
    background: #d3eded;
  }
  .wafer.active{
    background: #009494;
    color: #fff;
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
    width: 140px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 265px);
  }
  .input-title{
    width: 65px;
  }
  .app-container>>> .cell{
    line-height: 35px;
  }
  .app-container>>> td{
    height: 35px;
  }
  .app-container>>> .el-table--border {
    border-top: 2px solid #009494;
  }
  .mocvd-table ::-webkit-scrollbar {/*滚动条整体样式*/
    height: 14px !important;
  }
  .table-top-btn-group{
    overflow: hidden;
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
  .substrate>div:not(:first-child){
    margin-left: 5px;
  }
  .substrate-info>>> .el-table--border {
    border-top: 2px solid #009494;
  }
  .table-top-btn-group>div.active{
    color: #fff;
    background: #009494;
    border-color: #009494;
  }
  .tip-out-dialog>>>.el-dialog__body,
  .tip-out-inner-dialog>>>.el-dialog__body{
    padding-bottom: 20px;
    padding-top:20px;
  }
  .tip-out-inner-dialog>>>.el-dialog__body{
    padding-top: 20px;
  }
  .tip-out-inner-dialog>>>.el-checkbox{
    margin: 0;
  }
  .tip-out-inner-dialog>>> .cell{
    line-height: 45px;
  }
  .tip-out-inner-dialog>>> td{
    height: 45px;
  }
  .substrate-info>>> tr .cell{
    line-height: 21px !important;
    height: 21px !important;
  }
  .substrate-info>>> tr td{
    height: 21px !important;
  }
  .san-pian-dialog>>> tr .cell{
    line-height: 28px !important;
  }
  .san-pian-dialog>>> tr td{
    height: 28px !important;
  }
  .san-pian-dialog>>>.el-dialog__body{
    padding: 20px;
  }
  .table-title{
    font-size: 15px;
    font-weight: bold;
    margin: 10px 0;
    height: 40px;
    line-height: 40px;
  }
  .module-content{
    padding-left: 0;
  }
  .module-content>>> .el-checkbox-group{
    float: right;
    margin-right: 45px;
  }
  .module-content>>>.el-date-editor.el-input .el-input__inner{
    padding-right: 10px;
  }
  .module-content>>>.el-date-editor.el-input .el-input__suffix{
    right: -2px;
  }
  .tab-control span.not-tip-out:hover{
    color: #666;
    cursor: not-allowed;
  }
  .not-tip-out{
    cursor: not-allowed !important;
    color: #439494;
  }
  .has-margin-top{
    margin-top: -20px;
  }
  .sub-table{
    height: 624px;
  }

  .substrate-info>>> thead>.cell{
    line-height: 30px !important;
  }
  .module-content .alni-time>>>  .el-date-editor.el-input .el-input__inner {
    padding-right: 35px;
  }
  .el-col-9{
    padding-right: 0!important;
    padding-left: 0!important;
  }
  .el-col-1{
    padding-left: 6px!important;
    padding-right: 10px!important;
  }
  .tiem-select>>> .el-date-editor.el-input .el-input__suffix {
    display: none;
  }
  .broad-scrollbar-table>>> .el-table__fixed-body-wrapper{
    height: calc(100% - 73px) !important;
  }
  .mocvd-table.broad-scrollbar-table>>> .el-table__fixed-body-wrapper{
    height: calc(100% - 38px) !important;
  }
  @media (max-width: 1632px) {
    /*.el-form-item--small.el-form-item {*/
      /*margin-bottom: 5px;*/
    /*}*/
    .module-content{
      padding: 9px
    }
    .sub-table{
      height: 440px;
    }
    .to-left{
      margin-top: 240px !important;
    }
  }
</style>
