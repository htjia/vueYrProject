<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 5px">
      <el-row>
        <el-col :span="22">
          <div class="input-item">
            <span class="input-title" style="width: 35px">批号</span>
            <el-input v-model="searchKeys.ph" class="search-input" style="width: 190px" placeholder="请输入批号" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 50px">镭刻号</span>
            <el-input v-model="searchKeys.lkh" class="search-input" placeholder="请输入镭刻号" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">投片类型</span>
            <el-select v-model="searchKeys.tplx" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in castPieceTypeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.name"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">当前站点</span>
            <el-select v-model="searchKeys.dqzd" class="search-input" size="small" placeholder="请选择" filterable clearable @change="siteChange">
              <el-option
                v-for="item in forepartSiteOptions"
                :key="item.id"
                :label="item.name"
                :value="item.name + '#' + item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">当前工序</span>
            <el-select :disabled="searchKeys.dqzd === ''" v-model="searchKeys.dqgx" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in processOptions"
                :key="item.id"
                :label="item.name"
                :value="item.name"/>
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
            <span class="input-title">WaferID</span>
            <el-input v-model="searchKeys.waferNo" class="search-input" style="width: 210px" placeholder="请输入WaferID" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">工艺类型</span>
            <el-select v-model="searchKeys.gylx" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in craftOptions"
                :key="item.code"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">是否返工</span>
            <el-select v-model="searchKeys.sffg" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in reworkOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">投片时间</span>
            <el-date-picker
              v-model="beginDate"
              :picker-options="pickerOptionsStart"
              :editable="false"
              class="search-input"
              size="small"
              type="date"
              style="width: 130px"
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
        height="90%">
        <el-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="批号" align="center" prop="batchNo" fixed width="180"/>
        <el-table-column label="产品型号" align="center" prop="productType" min-width="100" show-overflow-tooltip/>
        <el-table-column label="当前站点" align="center" prop="nowSite" min-width="100" show-overflow-tooltip/>
        <el-table-column label="当前工序" align="center" prop="nowProcess" min-width="120" show-overflow-tooltip/>
        <el-table-column label="当前机台" align="center" prop="nowMachine" min-width="100" show-overflow-tooltip/>
        <el-table-column label="投片类型" align="center" prop="throwType" min-width="80" show-overflow-tooltip/>
        <el-table-column label="版型" align="center" prop="editionType" min-width="60" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.editionType === '1'">方片</div>
            <div v-if="scope.row.editionType === '0'">圆片</div>
          </template>
        </el-table-column>
        <el-table-column label="工艺" align="center" prop="technology" min-width="60"/>
        <el-table-column align="center" label="紧急度" min-width="80">
          <template slot-scope="scope">
            <div v-if="scope.row.emergency === '1'" style="background: #e35c5c;color: #fff">加急</div>
            <div v-if="scope.row.emergency === '0'">正常</div>
          </template>
        </el-table-column>
        <el-table-column label="流程卡" align="center" prop="flowCard" min-width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            <div style="cursor: pointer;text-decoration: underline; color: #009494" @click="viewDetailCard(scope.row.flowCardId)">{{ scope.row.flowCard }}</div>
          </template>
        </el-table-column>
        <el-table-column v-for="item in formThead" :key="item.thName" :label="item.thName" :render-header="labelHead" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[item.thKey] }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="status" width="170" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="viewProgress(scope.row)"
            ><svg-icon icon-class="search"/> 查看进度</el-button>
            <el-button
              v-if="scope.row.status === '生产中'"
              size="mini"
              type="danger"
              @click="handleStop(scope.row.batchNo, 0)"
            ><svg-icon icon-class="zanting"/> 暂停</el-button>
            <el-button
              v-if="scope.row.status === '暂停中'"
              size="mini"
              type="primary"
              @click="handleStop(scope.row.batchNo, 1)"
            ><svg-icon icon-class="chongzhisx"/> 恢复</el-button>
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
      :close-on-click-modal="false"
      :visible.sync="viewProgressVisible"
      top="60px"
      class="padding-dialog"
      title="查看进度"
      width="1200px"
      @close="handleClose('machineForm')">
      <div class="module-title-text" style="margin-top: 0">基本情况</div>
      <el-table
        v-loading="listLoading"
        :data="selectedList"
        class="view-progress"
        element-loading-text="拼命加载中"
        border
        fit
        stripe>
        <el-table-column label="批号" align="center" prop="batchNo" width="180"/>
        <el-table-column label="产品型号" align="center" prop="productType"/>
        <el-table-column label="投片类型" align="center" prop="throwType"/>
        <el-table-column label="版型" align="center" prop="editionType">
          <template slot-scope="scope">
            <div v-if="scope.row.editionType === '1'">方片</div>
            <div v-if="scope.row.editionType === '0'">圆片</div>
          </template>
        </el-table-column>
        <el-table-column label="工艺" align="center" prop="technology"/>
        <el-table-column label="流程卡" align="center" prop="flowCard" width="200"/>
        <el-table-column label="当前片数" align="center" prop="nowNum"/>
      </el-table>
      <div class="module-title-text">生产进度</div>
      <div v-if="keyobj.length>1" class="table-top-btn-group">
        <div
          v-for="item in keyobj"
          :key="item"
          :class="{'active':isActive === item}"
          @click="navClick(item)"
        >
          {{ tableCNlist[item] }}
        </div>
      </div>
      <el-table
        :data="scheduleList"
        :row-style="rowStyle"
        class="view-progress"
        element-loading-text="拼命加载中"
        max-height="350"
        border
        fit
      >
        <el-table-column label="步骤" align="center" prop="code" width="55">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="站点" align="center" prop="siteName"/>
        <el-table-column label="工序" align="center" prop="processName" show-overflow-tooltip/>
        <el-table-column label="制作记录" align="center" prop="remark" show-overflow-tooltip/>
        <el-table-column label="接片人" align="center" prop="receivedPeople" show-overflow-tooltip/>
        <el-table-column label="接片时间" align="center" prop="receivedTime" show-overflow-tooltip/>
        <el-table-column label="上片人" align="center" prop="upPeople" show-overflow-tooltip/>
        <el-table-column label="上片时间" align="center" prop="upTime" show-overflow-tooltip/>
        <el-table-column label="上片量" align="center" prop="upNewNum" show-overflow-tooltip/>
        <el-table-column label="传片人" align="center" prop="deliverPeople" show-overflow-tooltip/>
        <el-table-column label="传片时间" align="center" prop="deliverTime" show-overflow-tooltip/>
        <el-table-column label="传片量" align="center" prop="deliverNewNum" show-overflow-tooltip/>
        <el-table-column label="操作" align="center" prop="remark" width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="viewProductionData(scope.row)"
            ><svg-icon icon-class="search"/> 查看数据</el-button>
            <el-button
              v-if="scope.row.expectStop === 0 && scope.row.flag !== '0'"
              size="mini"
              type="danger"
              @click="handleExpectStop(scope.row, 0)"
            ><svg-icon icon-class="zanting"/> 预约暂停</el-button>
            <el-button
              v-if="scope.row.expectStop === 1 && scope.row.flag !== '0'"
              size="mini"
              type="primary"
              @click="handleExpectStop(scope.row, 1)"
            ><svg-icon icon-class="chongzhisx"/> 恢复</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="module-title-text" style="float: none">芯片信息
        <span style="float: right;margin-top: 5px;color: #009494;">Total: {{ sliceList.length }}/24</span>
      </div>
      <el-table
        :data="sliceList"
        class="view-progress"
        element-loading-text="拼命加载中"
        max-height="350"
        border
        fit
      >
        <el-table-column label="片位" align="center" prop="location" width="60"/>
        <el-table-column label="WaferID" align="center" prop="waferNo">
          <template slot-scope="scope">
            <span v-text="scope.row.waferNo"/>
            <span
              v-if="scope.row.fgBatchNo !== ''"
              style="text-decoration: underline; color: #009494; cursor: pointer;"
              @click="viewFgProgress(scope.row.fgBatchNo)"
            >
              (返工批号：{{ scope.row.fgBatchNo }})
            </span>
          </template>
        </el-table-column>
        <el-table-column label="镭刻号" align="center" prop="laser_mark" width="260"/>
        <el-table-column label="状态" align="center" prop="status" width="150"/>
        <el-table-column label="站点" align="center" prop="site" width="150"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="viewProgressVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="productionDataVisible"
      top="60px"
      class="padding-dialog"
      title="生产数据"
      width="1200px"
      @close="productionDataClose">
      <div class="overflow-hidden input-container">
        <div>
          <span class="input-title">站点: </span>
          <span style="display: inline-block; width: 460px;">{{ detailRow.siteName }}</span>
          <span class="input-title">工序: </span>
          <span style="margin-right: 60px">{{ detailRow.processName }}</span>
        </div>
        <div>
          <span class="input-title" style="margin-top: 10px"> 制造记录: </span>
          <span style="display: inline-block; width: 460px;">{{ detailRow.remark }}</span>
          <span class="input-title"> 程序: </span>
          <span style="margin-right: 60px">{{ detailRow.programName }}</span>
        </div>
      </div>
      <div class="module-title-text" style="margin-top: 0">接片信息</div>
      <el-table
        v-loading="listLoading"
        :data="accept"
        class="view-progress"
        element-loading-text="拼命加载中"
        border
        fit
        stripe>
        <el-table-column label="接片人" align="center" prop="doPeople"/>
        <el-table-column label="接片时间" align="center" prop="doTime"/>
        <el-table-column label="接片量" align="center" prop="num"/>
        <el-table-column label="备注" align="center" prop="remark"/>
      </el-table>
      <div class="module-title-text">上片信息</div>
      <el-table
        v-loading="listLoading"
        :data="upSlice"
        :key="paramsKey"
        class="view-progress"
        element-loading-text="拼命加载中"
        border
        fit
        stripe>
        <el-table-column label="上片人" align="center" prop="doPeople"/>
        <el-table-column label="上片时间" align="center" prop="doTime"/>
        <el-table-column label="上片量" align="center" prop="num"/>
        <el-table-column label="备注" align="center" prop="remark"/>
        <el-table-column v-for="item in formTheadUpParams" :key="item.thName" :label="item.thName" :render-header="labelHead" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[item.thKey] }}
          </template>
        </el-table-column>
      </el-table>
      <div class="module-title-text">传片信息</div>
      <el-table
        v-loading="listLoading"
        :data="deliver"
        :key="paramsKey"
        class="view-progress"
        element-loading-text="拼命加载中"
        border
        fit
        stripe>
        <el-table-column label="传片人" align="center" prop="doPeople"/>
        <el-table-column label="传片时间" align="center" prop="doTime"/>
        <el-table-column label="传片量" align="center" prop="num"/>
        <el-table-column label="备注" align="center" prop="remark"/>
      </el-table>
      <div class="module-title-text">参数数据</div>
      <el-table
        v-loading="listLoading"
        :data="params"
        :key="paramsKey"
        class="view-progress"
        element-loading-text="拼命加载中"
        border
        fit
        stripe>
        <el-table-column v-for="item in formTheadParams" :key="item.thName" :label="item.thName" :render-header="labelHead" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[item.thKey] }}
          </template>
        </el-table-column>
      </el-table>
      <div class="module-title-text">测试数据</div>
      <el-table
        v-loading="listLoading"
        :data="testParams"
        :key="paramsKey"
        class="view-progress"
        element-loading-text="拼命加载中"
        border
        fit
        stripe>
        <el-table-column v-for="item in formTheadCParams" :key="item.thName" :label="item.thName" :render-header="labelHead" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[item.thKey] }}
          </template>
        </el-table-column>
      </el-table>
      <div class="module-title-text" style="float: none">参数文件({{ files.length }}个)
        <div v-if="files.length !== 0" style="float: right;">
          <span style="color: #009494; cursor: pointer;" @click="downloadAll">全部下载 <svg-icon icon-class="export"/></span>
        </div>
      </div>
      <el-table
        :data="files"
        :key="paramsKey"
        class="view-progress"
        element-loading-text="拼命加载中"
        border
        fit
        stripe>
        <el-table-column label="文件名称" align="center" prop="fileName"/>
        <el-table-column label="下载" align="center" prop="filePath">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="download(scope.row)"
            ><svg-icon icon-class="export"/> 下载</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="productionDataVisible = false">关 闭</el-button>
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
    margin-top: 6px;
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
    height: 640px;
    overflow: auto;
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
  .table-top-btn-group{
    overflow: hidden;
    width: 100%;
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
</style>
