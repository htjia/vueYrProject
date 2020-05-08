<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 5px">
      <el-row>
        <el-col :span="22">
          <div class="input-item">
            <span class="input-title">任务单号</span>
            <el-input v-model="searchKeys.rwdh" class="search-input" style="width: 140px" placeholder="请输入任务单号" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 50px">流程卡</span>
            <el-select v-model="searchKeys.lck" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in processCardOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">投片类型</span>
            <el-select v-model="searchKeys.tplx" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in castPieceTypeOptions"
                :key="item.name"
                :label="item.name"
                :value="item.name"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 35px">光色</span>
            <el-select v-model="searchKeys.gs" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in colorList"
                :key="item.color"
                :label="item.color"
                :value="item.color"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 35px">电极</span>
            <el-select v-model="searchKeys.dj" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in electrodeList"
                :key="item.name"
                :label="item.name"
                :value="item.name"/>
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
            <span class="input-title" style="width: 50px">投片人</span>
            <el-select v-model="searchKeys.tpr" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in userOptions"
                :key="item.name"
                :label="item.name"
                :value="item.name"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 35px">版型</span>
            <el-select v-model="searchKeys.bx" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in modelOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 50px">紧急度</span>
            <el-select v-model="searchKeys.jjd" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in emergencyOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 35px">工艺</span>
            <el-select v-model="searchKeys.gy" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in craftOptions"
                :key="item.code"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">投片时间</span>
            <el-date-picker
              v-model="beginDate"
              :picker-options="pickerOptionsStart"
              :editable="false"
              class="search-input"
              style="width: 130px"
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
              style="width: 130px"
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
        </el-col>
        <el-col :span="2">
          <el-button
            style="position: absolute;bottom: 0px;right: 0px;"
            size="small"
            type="primary"
            @click="selectThead"
          ><svg-icon icon-class="shezhilk"/> 设置显示列</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="app-container">
      <div v-if="selectTheadVisble" class="select-thead">
        <div class="options-box">
          <el-checkbox-group v-model="checkboxVal">
            <el-checkbox v-for="option in formTheadOptions" :label="option" :key="option">
              {{ option }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <el-button type="primary" size="mini" style="margin-left: 25px" @click="submitOption">确 定</el-button>
        <el-button size="mini" @click="resetOption">取 消</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        class="broad-scrollbar-table"
        element-loading-text="拼命加载中"
        border
        fit
        height="90%"
      >
        <el-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="任务单号" align="center" prop="orderNo" width="150" fixed/>
        <el-table-column label="产品型号" align="center" prop="productType" width="100"/>
        <el-table-column label="投片数量" align="center" prop="throwNum" width="80"/>
        <el-table-column label="生产批数" align="center" prop="produceBatchNum" width="80"/>
        <el-table-column label="投片类型" align="center" prop="throwType" width="80"/>
        <el-table-column label="版型" align="center" prop="editionType" width="65">
          <template slot-scope="scope">
            <div v-if="scope.row.editionType === '1'">方片</div>
            <div v-if="scope.row.editionType === '0'">圆片</div>
          </template>
        </el-table-column>
        <el-table-column label="光色" align="center" prop="lightColor" width="65"/>
        <el-table-column align="center" label="紧急度" width="80">
          <template slot-scope="scope">
            <div v-if="scope.row.emergency === '1'" style="background: #e35c5c;color: #fff">加急</div>
            <div v-if="scope.row.emergency === '0'">正常</div>
          </template>
        </el-table-column>
        <el-table-column label="电极" align="center" prop="pole" width="65"/>
        <el-table-column label="工艺" align="center" prop="technology" width="65"/>
        <el-table-column label="流程卡" align="center" prop="flowCard" width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            <div style="cursor: pointer;text-decoration: underline; color: #009494" @click="viewDetailCard(scope.row.flowCardId)">{{ scope.row.flowCard }}</div>
          </template>
        </el-table-column>
        <el-table-column label="芯片外观" align="center" prop="editionType" width="150">
          <template slot-scope="scope">
            <img :src="'/images/'+scope.row.iconUrl">
          </template>
        </el-table-column>
        <el-table-column label="标签" align="center" prop="labelName" width="150">
          <template slot-scope="scope">
            <div style="cursor: pointer;text-decoration: underline; color: #009494" @click="viewTag(scope.row.labelUrl)">{{ scope.row.labelName }}</div>
          </template>
        </el-table-column>
        <el-table-column v-for="item in formThead" :key="item.thName" :label="item.thName" :render-header="labelHead" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[item.thKey] }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="任务状态" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.taskStatus === '0'" style="font-weight: bold;color: #f56c6c">待接收</span>
            <span v-if="scope.row.taskStatus === '1'" style="font-weight: bold;color: #009494">已接收</span>
            <span v-if="scope.row.taskStatus === '2'" style="font-weight: bold;color: #F56C6C">已退回</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="status" width="270" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="viewDeatil(scope.row)"
            ><svg-icon icon-class="search"/> 查看详情</el-button>
            <el-button
              v-if="scope.row.taskStatus === '0'"
              size="mini"
              type="primary"
              @click="handleAccept(scope.row)"
            ><svg-icon icon-class="jieshou"/> 接收</el-button>
            <el-button
              v-if="scope.row.taskStatus === '0'"
              size="mini"
              type="danger"
              @click="handleBack(scope.row)"
            ><svg-icon icon-class="shenheth"/> 退回</el-button>
          </template>
        </el-table-column>
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
      :visible.sync="viewTagDialogVisible"
      class="padding-dialog"
      title="标签预览"
      width="500px"
    >
      <img :src="labelUrl" style="width: 100%; height: 300px;">
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="viewDeatilDialogVisible"
      top="80px"
      title="任务详情"
      class="padding-dialog"
      width="1200px"
      @close="handleClose('machineForm')">
      <div class="module-title-text">基本信息</div>
      <el-table
        v-loading="listLoading"
        :data="detailList"
        style="margin-bottom: 10px"
        class="broad-scrollbar-table"
        element-loading-text="拼命加载中"
        border
        fit
      >
        <el-table-column label="任务单号" align="center" prop="orderNo" width="120"/>
        <el-table-column label="产品型号" align="center" prop="productType" width="120"/>
        <el-table-column label="投片数量" align="center" prop="throwNum"/>
        <el-table-column label="生产批数" align="center" prop="produceBatchNum"/>
        <el-table-column label="投片类型" align="center" prop="throwType"/>
        <el-table-column label="版型" align="center" prop="editionType">
          <template slot-scope="scope">
            <div v-if="scope.row.editionType === '1'">方片</div>
            <div v-if="scope.row.editionType === '0'">圆片</div>
          </template>
        </el-table-column>
        <el-table-column label="光色" align="center" prop="lightColor"/>
        <el-table-column label="紧急度" align="center" prop="emergency">
          <template slot-scope="scope">
            <div v-if="scope.row.emergency === '1'" style="background: #e35c5c;color: #fff">加急</div>
            <div v-if="scope.row.emergency === '0'">正常</div>
          </template>
        </el-table-column>
        <el-table-column label="电极" align="center" prop="pole"/>
        <el-table-column label="工艺" align="center" prop="technology"/>
        <el-table-column label="流程卡" align="center" prop="flowCard" width="150" show-overflow-tooltip/>
        <el-table-column label="标签" align="center" prop="labelName" width="150" show-overflow-tooltip/>
        <el-table-column label="芯片型号" align="center" prop="model"/>
        <el-table-column label="芯片尺寸" align="center" prop="measure"/>
        <el-table-column label="电极" align="center" prop="electrode"/>
        <el-table-column label="切割道" align="center" prop="cuttingWay"/>
        <el-table-column label="芯片外观" align="center" prop="editionType" width="150">
          <template slot-scope="scope">
            <img :src="'/images/'+scope.row.iconUrl">
          </template>
        </el-table-column>
        <el-table-column label="标准产出" align="center" prop="standardOutput"/>
      </el-table>
      <el-table
        v-loading="listLoading"
        :data="detailList"
        style="margin-bottom: 10px"
        class="broad-scrollbar-table"
        element-loading-text="拼命加载中"
        border
        fit
      >
        <el-table-column label="外延规格" align="center" prop="specification"/>
        <el-table-column label="背镀" align="center" prop="backPlating"/>
        <el-table-column label="芯片工艺" align="center" prop="chipCraft"/>
        <el-table-column label="电极工艺" align="center" prop="electrodeCraft"/>
        <el-table-column label="研磨厚度" align="center" prop="grindPly"/>
        <el-table-column label="切割工艺" align="center" prop="cutCraft"/>
        <el-table-column label="COW测试条件" align="center" prop="cowTest" width="100" show-overflow-tooltip/>
        <el-table-column label="COT电流测试条件" align="center" prop="currentTest" width="150" show-overflow-tooltip/>
        <el-table-column label="COT测试档" align="center" prop="cotTest"/>
        <el-table-column label="COT ESD是否全测" align="center" prop="cotEsd" width="150" />
        <el-table-column label="COT IR测试条件" align="center" prop="cotIr" width="150" />
        <el-table-column label="目检吸边" align="center" prop="visual"/>
        <el-table-column label="TAPNO" align="center" prop="tapno"/>
        <el-table-column label="Mapping图" align="center" prop="mapping"/>
        <el-table-column label="投片时间" align="center" prop="throwTime" width="160" show-overflow-tooltip/>
        <el-table-column label="投片人" align="center" prop="throwPeople"/>
        <el-table-column align="center" label="任务状态" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.taskStatus === '0'" style="font-weight: bold;color: #f56c6c">待接收</span>
            <span v-if="scope.row.taskStatus === '1'" style="font-weight: bold;color: #009494">已接收</span>
            <span v-if="scope.row.taskStatus === '2'" style="font-weight: bold;color: #F56C6C">已退回</span>
          </template>
        </el-table-column>
      </el-table>
      <el-row :gutter="20">
        <el-col :span="10">
          <span style="float: right;margin-top: 5px;font-weight: bold;color: #e47744">Total: {{ leftList.length }} 盒, {{ totalNum }}片</span>
          <span class="module-title-text">批次信息</span>
          <el-table
            v-loading="listLoading"
            ref="leftTable"
            :data="leftList"
            element-loading-text="拼命加载中"
            highlight-current-row
            height="400"
            border
            fit
            @row-click="leftRowClick"
          >
            <el-table-column align="center" label="序号" width="50">
              <template slot-scope="scope">
                {{ (pageNum - 1) * pageSize + scope.$index+1 }}
              </template>
            </el-table-column>
            <el-table-column label="批次" align="center" prop="batchNo"/>
            <el-table-column label="投片数量" align="center" prop="throwNum" width="90"/>
            <el-table-column label="状态" align="center" prop="status" width="90"/>
          </el-table>
        </el-col>
        <el-col :span="14">
          <span style="float: right;margin-top: 5px;font-weight: bold;color: #e47744">Total: {{ waferTotalNum }}片</span>
          <span class="module-title-text">盒内信息( {{ currentBatchNo }} )</span>
          <el-table
            v-loading="listLoading"
            :data="rightList"
            element-loading-text="拼命加载中"
            height="400"
            border
            fit
          >
            <el-table-column label="片位" align="center" prop="location" width="60"/>
            <el-table-column label="WaferID" align="center" prop="waferNo">
              <template slot-scope="scope">
                <div v-text="scope.row.waferNo"/>
                <div
                  v-if="scope.row.fgBatchNo !== ''"
                  @click="viewFgProgress(scope.row.fgBatchNo)"
                >
                  (返工批号：{{ scope.row.fgBatchNo }})
                </div>
              </template>
            </el-table-column>
            <el-table-column label="镭刻号" align="center" prop="laser_mark" width="160"/>
            <el-table-column label="状态" align="center" prop="status" width="70"/>
            <el-table-column label="站点" align="center" prop="site" width="100"/>
          </el-table>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="viewDeatilDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <!--流程卡预览-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="siveDialogVisible"
      class="inner-dialog"
      width="1000px"
      top="8vh"
      title="查看流程卡"
      append-to-body>
      <div style="margin-bottom: 10px;margin-top: -20px;">
        <span class="option-items-dialog">
          <span class="option-title" style="padding-top: 15px;">流程卡编号： </span>
          <span v-text="crrentCode">12</span>
        </span>
        <span class="option-items-dialog" style="float: right;">
          <span class="option-title">流程卡类型： </span>
          <span v-if="currentCardType === 0" class="proceCardType">普通流程卡</span>
          <span v-if="currentCardType === 1" class="proceCardType">重工流程卡</span>
          <span v-if="currentCardType === 2" class="proceCardType">返工流程卡</span>
          <span v-if="currentCardType === 3" class="proceCardType">自定义流程卡</span>
        </span>
      </div>
      <div class="module-container" style="box-shadow: none;border:1px solid #e2e2e2;clear: both;margin-top: 10px;padding: 15px">
        <el-row style="border-bottom:1px solid #e2e2e2;padding-bottom:10px">
          <el-col :span="2"><span class="option-title">流程卡名称： </span></el-col>
          <el-col :span="9"><div style="padding-left:10px" v-text="currentCardName">生产流程卡</div></el-col>
          <el-col :span="5">
            <span class="option-title">流程卡状态： </span>
            <span v-if="currentStatus === 0">启用</span>
            <span v-if="currentStatus === 1">禁用</span>
            <span v-if="currentStatus === 2">临时</span>
          </el-col>
          <el-col :span="3">
            <span class="option-title">工艺分类： </span>{{ currentCraft }}
          </el-col>
        </el-row>
        <el-row style="border-bottom:1px solid #e2e2e2;padding-bottom:10px;margin-top:15px">
          <span class="option-title" style="text-align:left">对应型号： </span>
          <div class="select-type-box" style="padding-left: 25px">
            <div v-for="type in currentModelList" :key="type"><div class="color-title" v-text="'【'+type.color+'】:'"/> <div class="model-box"><span v-for="name in type.modelName" :key="name" class="model-item" style="margin-left: 10px" v-text="name.split('#')[0]"/></div></div>
          </div>
        </el-row>
        <el-row style="margin-top:15px">
          <el-col :span="6">
            <span class="option-items-dialog" style="width:100%">
              <span class="option-title" style="width:75px">创建时间： </span>
              <span v-text="currentCreateTime">2019年11月22日14:12:11</span>
            </span>
          </el-col>
          <el-col :span="6">
            <span class="option-items-dialog" style="width:100%">
              <span class="option-title" style="width:75px">创建人： </span>
              <span v-text="currentCreator">2019年11月22日14:12:11</span>
            </span>
          </el-col>
          <el-col :span="6">
            <span class="option-items-dialog" style="width:100%">
              <span class="option-title" style="width:75px">修改时间： </span>
              <span v-text="currentCreateTime">2019年11月22日14:12:11</span>
            </span>
          </el-col>
          <el-col :span="6">
            <span class="option-items-dialog" style="width:100%">
              <span class="option-title" style="width:75px">修改人： </span>
              <span v-text="currentUpdateTime">2019年11月22日14:12:11</span>
            </span>
          </el-col>
        </el-row>
      </div>
      <div class="module-container" style="box-shadow: none;border:1px solid #e2e2e2;clear: both;margin-top: 10px">
        <div class="module-title">
          <div class="module-title-text">前段工序</div>
        </div>
        <div class="module-content classes-table">
          <el-table
            v-loading="listLoading"
            :data="dialogList"
            :class="(currentCardType === 1 || currentCardType === 2) ? 'abnormal-process-table' : ''"
            class="dialog-table"
            element-loading-text="拼命加载中"
            border
            fit>
            <el-table-column align="center" label="序号" width="50">
              <template slot-scope="scope">
                <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                  {{ scope.$index+1 }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="站点" align="center" prop="mandataryName">
              <template slot-scope="scope">
                <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                  <el-select v-model="scope.row.siteId" :disabled="true" placeholder="" size="small" style="width: 95%" filterable>
                    <el-option
                      v-for="item in forepartSiteOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"/>
                  </el-select>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="工序" align="center" prop="processName">
              <template slot-scope="scope">
                <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                  <div class="has-height" v-text="scope.row.processId"/>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="制造记录" align="center" prop="endTime" show-overflow-tooltip>
              <template slot-scope="scope">
                <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                  <div class="has-height" v-text="scope.row.remark"/>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="程序" align="center">
              <template slot-scope="scope">
                <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                  <el-select v-model="scope.row.programName" :disabled="true" placeholder="" size="small" style="width: 95%" filterable>
                    <el-option
                      v-for="item in scope.row.programOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"/>
                  </el-select>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="module-title">
          <div class="module-title-text">后段工序</div>
        </div>
        <div v-if="currentCardType === 2" style="font-size: 26px;margin: 15px">后段工序随原流程卡进行！</div>
        <div v-if="currentCardType !== 2" class="module-content">
          <el-table
            v-loading="listLoading"
            :data="dialogEndList"
            :class="(currentCardType === 1 || currentCardType === 2) ? 'abnormal-process-table' : ''"
            class="dialog-table"
            element-loading-text="拼命加载中"
            border
            fit>
            <el-table-column align="center" label="序号" width="50">
              <template slot-scope="scope">
                <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                  {{ scope.$index+1+ dialogList.length }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="站点" align="center" prop="mandataryName">
              <template slot-scope="scope">
                <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                  <el-select v-model="scope.row.siteId" :disabled="true" placeholder="" size="small" style="width: 95%" filterable>
                    <el-option
                      v-for="item in endSiteOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"/>
                  </el-select>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="工序" align="center" prop="processName">
              <template slot-scope="scope">
                <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                  <div v-text="scope.row.processId"/>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="制造记录" align="center" prop="endTime" show-overflow-tooltip>
              <template slot-scope="scope">
                <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                  <div v-text="scope.row.remark"/>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="程序" align="center">
              <template slot-scope="scope">
                <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                  <el-select v-model="scope.row.programName" :disabled="true" placeholder="" size="small" style="width: 95%" filterable>
                    <el-option
                      v-for="item in scope.row.programOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"/>
                  </el-select>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .app-container>>> .cell{
    line-height: 37px !important;
  }
  .app-container>>> td{
    height: 37px !important;
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
  .input-item>>> .el-radio{
    margin-top: 10px;
  }
  .module-title-text{
    margin-bottom: 10px;
  }
  .padding-dialog>>> .cell{
    line-height: 30px;
  }
  .padding-dialog>>> td{
    height: 30px;
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
  .padding-dialog>>> .el-dialog__footer{
    text-align: center;
  }
  img{
    width: 70px;
    height: 30px;
    margin-bottom: 4px;
    vertical-align: middle;
  }
</style>
