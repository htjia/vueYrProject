<template>
  <PageHeaderLayout v-loading="!setShow">
    <div class="header-search-add height-auto" style="padding-top: 0">
      <el-button
        style="margin-top: 15px"
        class="float-right margin-left"
        size="small"
        type="primary"
        @click="abnormalConfig"><svg-icon icon-class="baojinguize"/> 异常配置</el-button>
      <el-button
        v-if="!editing"
        style="margin-top: 15px"
        class="float-right margin-left"
        size="small"
        type="primary"
        icon="el-icon-edit"
        @click="handleEdit"> 编 辑</el-button>
      <el-button
        v-if="editing"
        :disabled="isDisabled"
        style="margin-top: 15px"
        class="float-right margin-left"
        size="small"
        type="danger"
        icon="el-icon-close"
        @click="handleCancelSubmitEdit"> 取 消</el-button>
      <el-button
        v-if="editing"
        :disabled="isDisabled"
        style="margin-top: 15px"
        class="float-right margin-left"
        size="small"
        type="primary"
        icon="el-icon-check"
        @click="handleSubmitEdit"> 保 存</el-button>
      <div class="clear-both"/>
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        v-if="setShow"
        :data="list"
        :span-method="objectSpanMethod"
        height="calc(100vh - 237px)"
        class="broad-scrollbar-table"
        element-loading-text="拼命加载中"
        border
        fit>
        <el-table-column label="车间" align="center" prop="shopName" width="150"/>
        <el-table-column label="站点" align="center" prop="siteName" width="150"/>
        <el-table-column label="是否过站" align="center" prop="status" width="100">
          <template slot-scope="scope">
            <el-checkbox :disabled="!editing" v-model="scope.row.isPass"/>
          </template>
        </el-table-column>
        <el-table-column label="过站级别" align="center" prop="status" width="260">
          <template slot-scope="scope">
            <div v-if="scope.row.type === 0 && scope.row.id !== 20 && scope.row.id !== 21">
              <el-checkbox :disabled="!editing" v-model="scope.row.isReceive">接片</el-checkbox>
              <el-checkbox v-model="scope.row.isUpslice" disabled>上片</el-checkbox>
              <el-checkbox v-model="scope.row.isDeliver" disabled>传片</el-checkbox>
            </div>
            <div v-if="scope.row.id === 20 || scope.row.id === 21 || scope.row.id === 26 || scope.row.id === 27 || scope.row.id === 28">
              <el-checkbox :disabled="true" v-model="scope.row.isReceive">接片</el-checkbox>
              <el-checkbox v-model="scope.row.isDeliver" style="margin-left: 87px" disabled>传片</el-checkbox>
            </div>
            <div v-if="scope.row.id !== 23 && scope.row.id !== 26 && scope.row.id !== 27 && scope.row.id !== 28 && scope.row.type === 1">
              <el-checkbox v-model="scope.row.isDeliver" style="margin-left: 174px" disabled>传片</el-checkbox>
            </div>
            <div v-if="scope.row.id === 23">
              <div>
                <el-checkbox :disabled="true" v-model="scope.row.isReceive">接片</el-checkbox>
                <el-checkbox :disabled="true" v-model="scope.row.isUpslice">上片</el-checkbox>
                <el-checkbox :disabled="!editing" v-model="scope.row.isStick">粘片</el-checkbox>
              </div>
              <div>
                <el-checkbox :disabled="!editing" v-model="scope.row.isGrind">减薄</el-checkbox>
                <el-checkbox :disabled="!editing" v-model="scope.row.isPolish">抛光</el-checkbox>
                <el-checkbox :disabled="true" v-model="scope.row.isClean">清洗</el-checkbox>
              </div>
              <el-checkbox v-model="scope.row.isDeliver" disabled>传片</el-checkbox>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="是否拆批" align="center" prop="status" width="80">
          <template slot-scope="scope">
            <div v-if="scope.row.type === 0">
              <el-checkbox :disabled="!editing" v-model="scope.row.isSplit">是</el-checkbox>
            </div>
            <span v-if="scope.row.type === 1">--</span>
          </template>
        </el-table-column>
        <el-table-column label="拆批配置" align="center" prop="status" width="90">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.type === 0"
              :disabled="!editing"
              size="mini"
              type="primary"
              @click="handleSpliceConfig(scope.row)"><svg-icon icon-class="shezhi"/>  配 置</el-button>
          </template>
        </el-table-column>
        <!--<el-table-column label="是否拆批传片" align="center" prop="status" width="480">
          <template slot-scope="scope">
            <div v-if="scope.row.type === 0">
              <el-checkbox :disabled="!editing" v-model="scope.row.isSplit">是</el-checkbox>
              <el-select :disabled="!editing" v-model="scope.row.nowProcessId" size="mini" style="width: 180px;" placeholder="请选择">
                <el-option
                  v-for="item in scope.row.nowProcessList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
              <span>→</span>
              <el-select :disabled="!editing" v-model="scope.row.nextProcessId" size="mini" filterable style="width: 180px;" placeholder="请选择" @change="nextChange(scope.row)">
                <el-option
                  v-for="item in allProcessList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </div>
            <span v-if="scope.row.type === 1">--</span>
          </template>
        </el-table-column>-->
        <el-table-column label="过站页面" align="center" prop="status" width="90">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.type === 0"
              :disabled="!editing"
              size="mini"
              type="primary"
              @click="handleConfig(scope.row)"><svg-icon icon-class="shezhi"/>  配 置</el-button>
          </template>
        </el-table-column>
        <el-table-column label="测试要求" align="center" prop="test" show-overflow-tooltip/>
      </el-table>
    </div>
    <!--拆批配置-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="spliceConfigDialogVisible"
      title="拆批配置"
      class="confing-splice-dialog"
      width="600px"
      @close="handleCloseSplice">
      <div class="overflow-hidden input-container">
        <div>
          <span class="input-title">车间: </span>
          <span style="display: inline-block; width: 210px;">{{ currentRow.shopName }}</span>
          <span class="input-title">站点: </span>
          <span style="margin-right: 60px">{{ currentRow.siteName }}</span>
        </div>
      </div>
      <div class="module-title" style="height: 35px;margin-bottom: 10px">
        <div class="module-title-text" style="margin-top: 0">工序配置</div>
      </div>
      <div>
        <!--<span style="font-weight: bold;color: #666;width: 60px;text-align: center;display: inline-block">工序</span>-->
        <el-select v-model="beforeProcessId" :disabled="afterProcessIdArr.length > 0" size="small" style="width: 201px;" placeholder="请选择前置工序" filterable @change="setProcessDisabled">
          <el-option
            v-for="item in nowProcessList"
            :key="item.id"
            :label="item.name"
            :value="item.id + '#' + item.name"/>
        </el-select>
        <span>→</span>
        <el-select :disabled="beforeProcessId === ''" v-model="afterProcessIdArr" size="small" filterable style="width: 250px;" placeholder="请选择后置工序" multiple collapse-tags>
          <el-option
            v-for="item in allProcessList"
            :disabled="item.disabled"
            :key="item.id"
            :label="item.name"
            :value="item.id + '#' + item.name"/>
        </el-select>
        <el-button
          :disabled="beforeProcessId === '' || afterProcessIdArr.length === 0"
          size="small"
          type="primary"
          class="float-right"
          @click="handlePushConfig"><svg-icon icon-class="add"/> 添加</el-button>
        <el-table
          :data="spliceProcessList"
          :show-header="true"
          border
          style="margin-top: 10px"
        >
          <el-table-column label="前置工序" align="center" prop="nowProcess"/>
          <el-table-column label="后置工序" align="center" prop="nextProcess"/>
          <el-table-column label="操作" width="70" align="center">
            <template slot-scope="scope">
              <el-button type="danger" round icon="el-icon-close" size="mini" @click="deleteConfigItem(scope.$index)"/>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitProcessConfigForm">确 定</el-button>
        <el-button size="small" @click="cancelProcessSpliceSubmit">取 消</el-button>
      </span>
    </el-dialog>
    <!--异常配置-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="abnormalConfigVisible"
      class="padding-dialog"
      title="异常配置"
      width="650px"
      @close="handleConfigClose">
      <div class="module-title-text" style="margin-bottom: 10px">基础信息</div>
      <el-table
        v-loading="listLoading"
        :data="baseList"
        class="view-progress"
        element-loading-text="拼命加载中"
        border
        fit
        stripe>
        <el-table-column label="车间" align="center" prop="code">
          <template slot-scope="scope">
            <el-select v-model="scope.row.plant" size="small" style="width: 95%;" placeholder="请选择" filterable clearable @change="shopChange">
              <el-option
                v-for="item in shopList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="站点" align="center" prop="remark">
          <template slot-scope="scope">
            <el-select :disabled="shopDisabled" v-model="scope.row.site" size="small" style="width: 95%;" placeholder="请选择" filterable clearable @change="siteChange">
              <el-option
                v-for="item in siteList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="工序" align="center" prop="remark">
          <template slot-scope="scope">
            <el-select :disabled="siteDisabled" v-model="scope.row.process" size="small" style="width: 95%;" placeholder="请选择" filterable clearable @change="processChange">
              <el-option
                v-for="item in processOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <div class="module-title-text" style="float: none;margin-bottom: 10px;margin-top: 15px">参数信息</div>
      <table v-for="(item, index) in paramsData" :key="index" cellspacing="0" cellpadding="0" border="0" style="position: relative;display: inline-grid;margin-top: 15px;border-top:1px solid #b2dfdf;border-left:1px solid #b2dfdf">
        <tr>
          <td class="table-title">程序名</td>
          <td class="table-td">
            <el-select v-model="item.programId" style="width: 95%;" size="mini" placeholder="请选择" filterable @change="programChange(index)">
              <el-option
                v-for="item in programList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </td>
        </tr>
        <tr v-for="(param, paramIndex) in item.params" :key="paramIndex">
          <td class="table-title">{{ param.paramCnName }}</td>
          <td class="table-td">
            <el-input v-model="param.min" style="width: 175px;" size="mini" placeholder="最小值" type="number"/>
            ~
            <el-input v-model="param.max" style="width: 175px;" size="mini" placeholder="最大值" type="number"/>
          </td>
        </tr>
        <el-button :disabled="paramsData.length === 1" type="danger" style="position: absolute;right: -50px;top: 50%;transform: translateY(-50%)" circle icon="el-icon-close" size="mini" @click="deleteItem(index)"/>
      </table>
      <el-button
        v-if="paramsData.length > 0"
        class="handle-bush"
        type="primary"
        size="small"
        circle
        @click="handlePush"
      ><svg-icon icon-class="add"/></el-button>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="paramsData.length === 0" size="small" type="primary" @click="submitForm">确 定</el-button>
        <el-button size="small" @click="cancelAbnormalConfig">取 消</el-button>
      </span>
    </el-dialog>
    <!--清洗-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="configDialogVisible"
      title="过站页面配置"
      class="confing-dialog"
      width="750px"
      @close="handleClose('machineForm')">
      <div class="tab-control" style="margin-bottom: 0">
        <span
          :class="{activeTab: activeTabIndex === 0}"
          @click="tabClick(0)"
        >手动</span>
        <span
          :class="{activeTab: activeTabIndex === 1}"
          class="margin-left"
          @click="tabClick(1)"
        >自动</span>
      </div>
      <div class="transit-site-config-box">
        <div class="transit-site-config-left">
          <div class="config-title">上片信息</div>
          <div class="config-content">
            <div class="config-content-title">基础数据录入</div>
            <el-table
              :data="baseInfo"
              :show-header="false"
              border
              class="mo-table"
              style="width: 100%;">
              <el-table-column
                width="70">
                <template slot-scope="scope">
                  <svg-icon icon-class="checkBox" style="margin-left: 30px;cursor: not-allowed"/>
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                prop="name"
                align="center"
                show-overflow-tooltip/>
            </el-table>
            <div v-if="activeTabIndex === 0" class="config-content-title" style="margin-top: 15px">参数数据录入</div>
            <el-table
              v-show="activeTabIndex === 0"
              :data="handParams"
              :show-header="false"
              border
              class="mo-table"
              style="width: 100%;"
              @selection-change="changeFun">
              <el-table-column width="70" align="center">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.status"/>
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                prop="paramsName"
                align="center"
                show-overflow-tooltip/>
            </el-table>
          </div>
        </div>
        <div class="transit-site-config-right">
          <div class="config-title">传片信息</div>
          <div class="config-content">
            <div class="config-content-title">基础数据录入</div>
            <el-table
              :data="sendInfo"
              :show-header="false"
              border
              class="mo-table"
              style="width: 100%;">
              <el-table-column
                width="70">
                <template slot-scope="scope">
                  <svg-icon icon-class="checkBox" style="margin-left: 30px;cursor: not-allowed"/>
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                prop="name"
                align="center"
                show-overflow-tooltip/>
            </el-table>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitConfigForm">确 定</el-button>
        <el-button size="small" @click="cancelSubmit">取 消</el-button>
      </span>
    </el-dialog>
    <!--打胶-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="configGlueDialogVisible"
      title="过站页面配置"
      class="confing-dialog"
      width="750px"
      @close="handleClose('machineForm')">
      <div class="transit-site-config-box">
        <div class="transit-site-config-left">
          <div class="config-title">上片信息</div>
          <div class="config-content">
            <div class="config-content-title">基础数据录入</div>
            <el-table
              :data="baseGlueInfo"
              :show-header="false"
              border
              class="mo-table"
              style="width: 100%;">
              <el-table-column
                width="70">
                <template slot-scope="scope">
                  <svg-icon icon-class="checkBox" style="margin-left: 30px;cursor: not-allowed"/>
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                prop="name"
                align="center"
                show-overflow-tooltip/>
            </el-table>
            <div v-if="activeTabIndex === 0" class="config-content-title" style="margin-top: 15px">参数数据录入</div>
            <el-table
              v-show="activeTabIndex === 0"
              :data="handParams"
              :show-header="false"
              border
              class="mo-table"
              style="width: 100%;"
              @selection-change="changeFun">
              <el-table-column width="70" align="center">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.status"/>
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                prop="paramsName"
                align="center"
                show-overflow-tooltip/>
            </el-table>
          </div>
        </div>
        <div class="transit-site-config-right">
          <div class="config-title">传片信息</div>
          <div class="config-content">
            <div class="config-content-title">基础数据录入</div>
            <el-table
              :data="sendInfo"
              :show-header="false"
              border
              class="mo-table"
              style="width: 100%;">
              <el-table-column
                width="70">
                <template slot-scope="scope">
                  <svg-icon icon-class="checkBox" style="margin-left: 30px;cursor: not-allowed"/>
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                prop="name"
                align="center"
                show-overflow-tooltip/>
            </el-table>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitConfigForm">确 定</el-button>
        <el-button size="small" @click="cancelSubmit">取 消</el-button>
      </span>
    </el-dialog>
    <!--光刻-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="configPhotoetchingDialogVisible"
      title="过站页面配置"
      class="confing-dialog"
      width="750px"
      @close="handleClose('machineForm')">
      <div class="transit-site-config-box">
        <div class="transit-site-config-left">
          <div class="config-title">上片信息</div>
          <div class="config-content">
            <div class="config-content-title">基础数据录入</div>
            <el-table
              :data="photoetchingInfo"
              :show-header="false"
              border
              class="mo-table"
              style="width: 100%;">
              <el-table-column
                width="70">
                <template slot-scope="scope">
                  <svg-icon icon-class="checkBox" style="margin-left: 30px;cursor: not-allowed"/>
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                prop="name"
                align="center"
                show-overflow-tooltip/>
            </el-table>
          </div>
        </div>
        <div class="transit-site-config-right">
          <div class="config-title">传片信息</div>
          <div class="config-content">
            <div class="config-content-title">基础数据录入</div>
            <el-table
              :data="sendInfo"
              :show-header="false"
              border
              class="mo-table"
              style="width: 100%;">
              <el-table-column
                width="70">
                <template slot-scope="scope">
                  <svg-icon icon-class="checkBox" style="margin-left: 30px;cursor: not-allowed"/>
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                prop="name"
                align="center"
                show-overflow-tooltip/>
            </el-table>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitConfigForm">确 定</el-button>
        <el-button size="small" @click="cancelSubmit">取 消</el-button>
      </span>
    </el-dialog>
    <!--硬烤-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="configRoastDialogVisible"
      title="过站页面配置"
      class="confing-dialog"
      width="750px"
      @close="handleClose('machineForm')">
      <div class="transit-site-config-box">
        <div class="transit-site-config-left">
          <div class="config-title">上片信息</div>
          <div class="config-content">
            <div class="config-content-title">基础数据录入</div>
            <el-table
              :data="baseGlueInfo"
              :show-header="false"
              border
              class="mo-table"
              style="width: 100%;">
              <el-table-column
                width="70">
                <template slot-scope="scope">
                  <svg-icon icon-class="checkBox" style="margin-left: 30px;cursor: not-allowed"/>
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                prop="name"
                align="center"
                show-overflow-tooltip/>
            </el-table>
            <div v-if="activeTabIndex === 0" class="config-content-title" style="margin-top: 15px">参数数据录入</div>
            <el-table
              v-show="activeTabIndex === 0"
              :data="handParams"
              :show-header="false"
              border
              class="mo-table"
              style="width: 100%;"
              @selection-change="changeFun">
              <el-table-column width="70" align="center">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.status"/>
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                prop="paramsName"
                align="center"
                show-overflow-tooltip/>
            </el-table>
          </div>
        </div>
        <div class="transit-site-config-right">
          <div class="config-title">传片信息</div>
          <div class="config-content">
            <div class="config-content-title">基础数据录入</div>
            <el-table
              :data="sendInfo"
              :show-header="false"
              border
              class="mo-table"
              style="width: 100%;">
              <el-table-column
                width="70">
                <template slot-scope="scope">
                  <svg-icon icon-class="checkBox" style="margin-left: 30px;cursor: not-allowed"/>
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                prop="name"
                align="center"
                show-overflow-tooltip/>
            </el-table>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitConfigForm">确 定</el-button>
        <el-button size="small" @click="cancelSubmit">取 消</el-button>
      </span>
    </el-dialog>
    <!--底胶涂布-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="configGlueCoatingDialogVisible"
      title="过站页面配置"
      class="confing-dialog"
      width="750px"
      @close="handleClose('machineForm')">
      <div class="transit-site-config-box">
        <div class="transit-site-config-left">
          <div class="config-title">上片信息</div>
          <div class="config-content">
            <div class="config-content-title">基础数据录入</div>
            <el-table
              :data="djtbInfo"
              :show-header="false"
              border
              class="mo-table"
              style="width: 100%;">
              <el-table-column
                width="70">
                <template slot-scope="scope">
                  <svg-icon icon-class="checkBox" style="margin-left: 30px;cursor: not-allowed"/>
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                prop="name"
                align="center"
                show-overflow-tooltip/>
            </el-table>
          </div>
        </div>
        <div class="transit-site-config-right">
          <div class="config-title">传片信息</div>
          <div class="config-content">
            <div class="config-content-title">基础数据录入</div>
            <el-table
              :data="sendInfo"
              :show-header="false"
              border
              class="mo-table"
              style="width: 100%;">
              <el-table-column
                width="70">
                <template slot-scope="scope">
                  <svg-icon icon-class="checkBox" style="margin-left: 30px;cursor: not-allowed"/>
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                prop="name"
                align="center"
                show-overflow-tooltip/>
            </el-table>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitConfigForm">确 定</el-button>
        <el-button size="small" @click="cancelSubmit">取 消</el-button>
      </span>
    </el-dialog>
    <!--PEB-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="configPebDialogVisible"
      title="过站页面配置"
      class="confing-dialog"
      width="750px"
      @close="handleClose('machineForm')">
      <div class="transit-site-config-box">
        <div class="transit-site-config-left">
          <div class="config-title">上片信息</div>
          <div class="config-content">
            <div class="config-content-title">基础数据录入</div>
            <el-table
              :data="baseGlueInfo"
              :show-header="false"
              border
              class="mo-table"
              style="width: 100%;">
              <el-table-column
                width="70">
                <template slot-scope="scope">
                  <svg-icon icon-class="checkBox" style="margin-left: 30px;cursor: not-allowed"/>
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                prop="name"
                align="center"
                show-overflow-tooltip/>
            </el-table>
            <div v-if="activeTabIndex === 0" class="config-content-title" style="margin-top: 15px">参数数据录入</div>
            <el-table
              v-show="activeTabIndex === 0"
              :data="handParams"
              :show-header="false"
              border
              class="mo-table"
              style="width: 100%;"
              @selection-change="changeFun">
              <el-table-column width="70" align="center">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.status"/>
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                prop="paramsName"
                align="center"
                show-overflow-tooltip/>
            </el-table>
          </div>
        </div>
        <div class="transit-site-config-right">
          <div class="config-title">传片信息</div>
          <div class="config-content">
            <div class="config-content-title">基础数据录入</div>
            <el-table
              :data="sendInfo"
              :show-header="false"
              border
              class="mo-table"
              style="width: 100%;">
              <el-table-column
                width="70">
                <template slot-scope="scope">
                  <svg-icon icon-class="checkBox" style="margin-left: 30px;cursor: not-allowed"/>
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                prop="name"
                align="center"
                show-overflow-tooltip/>
            </el-table>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitConfigForm">确 定</el-button>
        <el-button size="small" @click="cancelSubmit">取 消</el-button>
      </span>
    </el-dialog>
    <!--蒸镀-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="configEvaporationDialogVisible"
      title="过站页面配置"
      class="confing-dialog"
      width="750px"
      @close="handleClose('machineForm')">
      <div class="tab-control" style="margin-bottom: 0">
        <span
          :class="{activeTab: activeTabIndex === 0}"
          @click="tabClick(0)"
        >电极蒸镀</span>
        <span
          :class="{activeTab: activeTabIndex === 1}"
          class="margin-left"
          @click="tabClick(1)"
        >ITO蒸镀</span>
        <span
          :class="{activeTab: activeTabIndex === 2}"
          class="margin-left"
          @click="tabClick(2)"
        >默认字段</span>
      </div>
      <div class="transit-site-config-box">
        <div class="transit-site-config-left" style="height: 455px;">
          <div class="config-title">上片信息</div>
          <div class="config-content">
            <div class="config-content-title">基础数据录入</div>
            <el-table
              :data="evaporationInfo"
              :show-header="false"
              border
              class="mo-table"
              style="width: 100%;">
              <el-table-column
                width="70">
                <template slot-scope="scope">
                  <svg-icon icon-class="checkBox" style="margin-left: 30px;cursor: not-allowed"/>
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                prop="name"
                align="center"
                show-overflow-tooltip/>
            </el-table>
            <div v-if="activeTabIndex !== 2" class="config-content-title" style="margin-top: 15px">参数数据录入</div>
            <el-table
              v-show="activeTabIndex === 0"
              :data="handParams"
              :show-header="false"
              border
              class="mo-table"
              style="width: 100%;"
              @selection-change="changeFun">
              <el-table-column
                width="70">
                <template slot-scope="scope">
                  <svg-icon icon-class="checkBox" style="margin-left: 30px;cursor: not-allowed"/>
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                prop="paramsName"
                align="center"
                show-overflow-tooltip/>
            </el-table>
            <el-table
              v-show="activeTabIndex === 1"
              :data="autoParams"
              :show-header="false"
              border
              class="mo-table"
              style="width: 100%;"
              @selection-change="changeFun">
              <el-table-column
                width="70">
                <template slot-scope="scope">
                  <svg-icon icon-class="checkBox" style="margin-left: 30px;cursor: not-allowed"/>
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                prop="paramsName"
                align="center"
                show-overflow-tooltip/>
            </el-table>
          </div>
        </div>
        <div class="transit-site-config-right">
          <div class="config-title">传片信息</div>
          <div class="config-content">
            <div class="config-content-title">基础数据录入</div>
            <el-table
              :data="sendInfo"
              :show-header="false"
              border
              class="mo-table"
              style="width: 100%;">
              <el-table-column
                width="70">
                <template slot-scope="scope">
                  <svg-icon icon-class="checkBox" style="margin-left: 30px;cursor: not-allowed"/>
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                prop="name"
                align="center"
                show-overflow-tooltip/>
            </el-table>
            <div v-if="activeTabIndex !== 2" class="config-content-title" style="margin-top: 15px">测试数据录入</div>
            <el-table
              v-show="activeTabIndex === 0"
              :data="handTestParams"
              :show-header="false"
              border
              class="mo-table"
              style="width: 100%;">
              <el-table-column
                width="70">
                <template slot-scope="scope">
                  <svg-icon icon-class="checkBox" style="margin-left: 30px;cursor: not-allowed"/>
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                prop="paramsName"
                align="center"
                show-overflow-tooltip/>
            </el-table>
            <el-table
              v-show="activeTabIndex === 1"
              :data="autoTestParams"
              :show-header="false"
              border
              class="mo-table"
              style="width: 100%;">
              <el-table-column
                width="70">
                <template slot-scope="scope">
                  <svg-icon icon-class="checkBox" style="margin-left: 30px;cursor: not-allowed"/>
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                prop="paramsName"
                align="center"
                show-overflow-tooltip/>
            </el-table>
            <div v-if="activeTabIndex !== 2" class="config-content-title" style="margin-top: 15px">使用工序范围</div>
            <el-select v-if="activeTabIndex === 0" v-model="djZhengDuProcess" style="width: 100%" size="small" placeholder="请选择" filterable multiple collapse-tags>
              <el-option
                v-for="item in proceOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
            <el-select v-if="activeTabIndex === 1" v-model="itoZhengDuProcess" style="width: 100%" size="small" placeholder="请选择" filterable multiple collapse-tags>
              <el-option
                v-for="item in proceOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitConfigForm">确 定</el-button>
        <el-button size="small" @click="cancelZdSubmit">取 消</el-button>
      </span>
    </el-dialog>
    <!--蚀刻-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="configEtchDialogVisible"
      title="过站页面配置"
      class="confing-dialog"
      width="750px"
      @close="handleClose('machineForm')">
      <div class="tab-control" style="margin-bottom: 0">
        <span
          :class="{activeTab: activeTabIndex === 0}"
          @click="tabClick(0)"
        >手动</span>
        <span
          :class="{activeTab: activeTabIndex === 1}"
          class="margin-left"
          @click="tabClick(1)"
        >自动</span>
      </div>
      <div class="transit-site-config-box">
        <div class="transit-site-config-left" style="border-right: none">
          <div class="config-title">上片信息</div>
          <div class="config-content" style="height: 263.5px;">
            <div class="config-content-title">基础数据录入</div>
            <el-table
              :data="baseGlueInfo"
              :show-header="false"
              border
              class="mo-table"
              style="width: 100%;">
              <el-table-column
                width="70">
                <template slot-scope="scope">
                  <svg-icon icon-class="checkBox" style="margin-left: 30px;cursor: not-allowed"/>
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                prop="name"
                align="center"
                show-overflow-tooltip/>
            </el-table>
            <div v-show="activeTabIndex === 0" class="config-content-title" style="margin-top: 15px">参数数据录入</div>
            <el-table
              v-show="activeTabIndex === 0"
              :data="handParams"
              :show-header="false"
              border
              class="mo-table"
              style="width: 100%;"
              @selection-change="changeFun">
              <el-table-column width="70" align="center">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.status"/>
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                prop="paramsName"
                align="center"
                show-overflow-tooltip/>
            </el-table>
          </div>
        </div>
        <div class="transit-site-config-right" style="border-left: 1px solid #b2dfdf;">
          <div class="config-title">传片信息</div>
          <div class="config-content">
            <div class="config-content-title">基础数据录入</div>
            <el-table
              :data="sendInfo"
              :show-header="false"
              border
              class="mo-table"
              style="width: 100%;">
              <el-table-column
                width="70">
                <template slot-scope="scope">
                  <svg-icon icon-class="checkBox" style="margin-left: 30px;cursor: not-allowed"/>
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                prop="name"
                align="center"
                show-overflow-tooltip/>
            </el-table>
            <div class="config-content-title" style="margin-top: 15px">测试数据录入</div>
            <el-table
              v-show="activeTabIndex === 0"
              :data="handTestParams"
              :show-header="false"
              border
              class="mo-table"
              style="width: 100%;">
              <el-table-column width="70" align="center">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.status"/>
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                prop="paramsName"
                align="center"
                show-overflow-tooltip/>
            </el-table>
            <el-table
              v-show="activeTabIndex === 1"
              :data="autoTestParams"
              :show-header="false"
              border
              class="mo-table"
              style="width: 100%;">
              <el-table-column width="70" align="center">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.status"/>
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                prop="paramsName"
                align="center"
                show-overflow-tooltip/>
            </el-table>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitConfigForm">确 定</el-button>
        <el-button size="small" @click="cancelSubmit">取 消</el-button>
      </span>
    </el-dialog>
    <!--熔合-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="configFuseDialogVisible"
      title="过站页面配置"
      class="confing-dialog"
      width="750px"
      @close="handleClose('machineForm')">
      <div class="transit-site-config-box">
        <div class="transit-site-config-left">
          <div class="config-title">上片信息</div>
          <div class="config-content">
            <div class="config-content-title">基础数据录入</div>
            <el-table
              :data="baseGlueInfo"
              :show-header="false"
              border
              class="mo-table"
              style="width: 100%;">
              <el-table-column
                width="70">
                <template slot-scope="scope">
                  <svg-icon icon-class="checkBox" style="margin-left: 30px;cursor: not-allowed"/>
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                prop="name"
                align="center"
                show-overflow-tooltip/>
            </el-table>
            <div v-if="activeTabIndex === 0" class="config-content-title" style="margin-top: 15px">参数数据录入</div>
            <el-table
              v-show="activeTabIndex === 0"
              :data="handParams"
              :show-header="false"
              border
              class="mo-table"
              style="width: 100%;"
              @selection-change="changeFun">
              <el-table-column width="70" align="center">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.status"/>
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                prop="paramsName"
                align="center"
                show-overflow-tooltip/>
            </el-table>
          </div>
        </div>
        <div class="transit-site-config-right">
          <div class="config-title">传片信息</div>
          <div class="config-content">
            <div class="config-content-title">基础数据录入</div>
            <el-table
              :data="sendInfo"
              :show-header="false"
              border
              class="mo-table"
              style="width: 100%;">
              <el-table-column
                width="70">
                <template slot-scope="scope">
                  <svg-icon icon-class="checkBox" style="margin-left: 30px;cursor: not-allowed"/>
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                prop="name"
                align="center"
                show-overflow-tooltip/>
            </el-table>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitConfigForm">确 定</el-button>
        <el-button size="small" @click="cancelSubmit">取 消</el-button>
      </span>
    </el-dialog>
    <!--沉积-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="configDepositionDialogVisible"
      title="过站页面配置"
      class="confing-dialog"
      width="750px"
      @close="handleClose('machineForm')">
      <div class="transit-site-config-box">
        <div class="transit-site-config-left" style="border-right: none">
          <div class="config-title">上片信息</div>
          <div class="config-content">
            <div class="config-content-title">基础数据录入</div>
            <el-table
              :data="baseGlueInfo"
              :show-header="false"
              border
              class="mo-table"
              style="width: 100%;">
              <el-table-column
                width="70">
                <template slot-scope="scope">
                  <svg-icon icon-class="checkBox" style="margin-left: 30px;cursor: not-allowed"/>
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                prop="name"
                align="center"
                show-overflow-tooltip/>
            </el-table>
            <div v-show="activeTabIndex === 0" class="config-content-title" style="margin-top: 15px">参数数据录入</div>
            <el-table
              v-show="activeTabIndex === 0"
              :data="handParams"
              :show-header="false"
              border
              class="mo-table"
              style="width: 100%;"
              @selection-change="changeFun">
              <el-table-column width="70" align="center">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.status"/>
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                prop="paramsName"
                align="center"
                show-overflow-tooltip/>
            </el-table>
          </div>
        </div>
        <div class="transit-site-config-right" style="border-left: 1px solid #b2dfdf;">
          <div class="config-title">传片信息</div>
          <div class="config-content">
            <div class="config-content-title">基础数据录入</div>
            <el-table
              :data="sendInfo"
              :show-header="false"
              border
              class="mo-table"
              style="width: 100%;">
              <el-table-column
                width="70">
                <template slot-scope="scope">
                  <svg-icon icon-class="checkBox" style="margin-left: 30px;cursor: not-allowed"/>
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                prop="name"
                align="center"
                show-overflow-tooltip/>
            </el-table>
            <div class="config-content-title" style="margin-top: 15px">测试数据录入</div>
            <el-table
              :data="handTestParams"
              :show-header="false"
              border
              class="mo-table"
              style="width: 100%;">
              <el-table-column width="70" align="center">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.status"/>
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                prop="paramsName"
                align="center"
                show-overflow-tooltip/>
            </el-table>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitConfigForm">确 定</el-button>
        <el-button size="small" @click="cancelSubmit">取 消</el-button>
      </span>
    </el-dialog>
    <!--退火-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="configAnnealDialogVisible"
      title="过站页面配置"
      class="confing-dialog"
      width="750px"
      @close="handleClose('machineForm')">
      <div class="tab-control" style="margin-bottom: 0">
        <span
          :class="{activeTab: activeTabIndex === 0}"
          @click="tabClick(0)"
        >手动</span>
        <span
          :class="{activeTab: activeTabIndex === 1}"
          class="margin-left"
          @click="tabClick(1)"
        >自动</span>
      </div>
      <div class="transit-site-config-box">
        <div class="transit-site-config-left">
          <div class="config-title">上片信息</div>
          <div class="config-content">
            <div class="config-content-title">基础数据录入</div>
            <el-table
              :data="baseGlueInfo"
              :show-header="false"
              border
              class="mo-table"
              style="width: 100%;">
              <el-table-column
                width="70">
                <template slot-scope="scope">
                  <svg-icon icon-class="checkBox" style="margin-left: 30px;cursor: not-allowed"/>
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                prop="name"
                align="center"
                show-overflow-tooltip/>
            </el-table>
            <div class="config-content-title" style="margin-top: 15px">参数数据录入</div>
            <el-table
              v-show="activeTabIndex === 0"
              :data="handParams"
              :show-header="false"
              border
              class="mo-table"
              style="width: 100%;"
              @selection-change="changeFun">
              <el-table-column width="70" align="center">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.status"/>
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                prop="paramsName"
                align="center"
                show-overflow-tooltip/>
            </el-table>
            <el-table
              v-show="activeTabIndex === 1"
              :data="autoParams"
              :show-header="false"
              border
              class="mo-table"
              style="width: 100%;"
              @selection-change="changeFun">
              <el-table-column width="70" align="center">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.status"/>
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                prop="paramsName"
                align="center"
                show-overflow-tooltip/>
            </el-table>
          </div>
        </div>
        <div class="transit-site-config-right">
          <div class="config-title">传片信息</div>
          <div class="config-content">
            <div class="config-content-title">基础数据录入</div>
            <el-table
              :data="sendInfo"
              :show-header="false"
              border
              class="mo-table"
              style="width: 100%;">
              <el-table-column
                width="70">
                <template slot-scope="scope">
                  <svg-icon icon-class="checkBox" style="margin-left: 30px;cursor: not-allowed"/>
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                prop="name"
                align="center"
                show-overflow-tooltip/>
            </el-table>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitConfigForm">确 定</el-button>
        <el-button size="small" @click="cancelSubmit">取 消</el-button>
      </span>
    </el-dialog>
    <!--镜检-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="configMicroscopyDialogVisible"
      title="过站页面配置"
      class="confing-dialog"
      width="750px"
      @close="handleClose('machineForm')">
      <div class="transit-site-config-box">
        <div class="transit-site-config-left">
          <div class="config-title">上片信息</div>
          <div class="config-content">
            <div class="config-content-title">基础数据录入</div>
            <el-table
              :data="baseGlueInfo"
              :show-header="false"
              border
              class="mo-table"
              style="width: 100%;">
              <el-table-column
                width="70">
                <template slot-scope="scope">
                  <svg-icon icon-class="checkBox" style="margin-left: 30px;cursor: not-allowed"/>
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                prop="name"
                align="center"
                show-overflow-tooltip/>
            </el-table>
          </div>
        </div>
        <div class="transit-site-config-right">
          <div class="config-title">传片信息</div>
          <div class="config-content">
            <div class="config-content-title">基础数据录入</div>
            <el-table
              :data="sendInfo"
              :show-header="false"
              border
              class="mo-table"
              style="width: 100%;">
              <el-table-column
                width="70">
                <template slot-scope="scope">
                  <svg-icon icon-class="checkBox" style="margin-left: 30px;cursor: not-allowed"/>
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                prop="name"
                align="center"
                show-overflow-tooltip/>
            </el-table>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitConfigForm">确 定</el-button>
        <el-button size="small" @click="cancelSubmit">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .confing-splice-dialog>>> tr .el-button--mini {
    padding: 4px 4px !important;
  }
  .confing-splice-dialog>>> .cell{
    line-height: 30px;
  }
  .confing-splice-dialog>>> td{
    height: 30px;
  }
  /*.app-container>>> tr .cell{*/
  /*  line-height: 30px;*/
  /*}*/
  .app-container>>> td .cell{
    height: auto !important;
  }
  .transit-site-config-box{
    overflow: hidden;
    border: 1px solid #b2dfdf;
    margin-top: 10px;
    box-sizing: border-box;
  }
  .transit-site-config-box>div{
    float: left;
    width: 50%;
    height: 100%;
  }
  .transit-site-config-left{
    border-right: 1px solid #b2dfdf;
  }
  .config-title{
    line-height: 40px;
    text-align: center;
    background: #d6eeee;
    border-bottom: 1px solid #b2dfdf;
    font-weight: bold;
  }
  .input-title{
    width: 65px;
  }
  .input-item{
    float: left;
    margin-top: 15px;
    margin-right: 10px;
  }
  .search-input{
    width: 160px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 207px);
  }
  .tab-control span{
    line-height: 50px;
  }
  .el-checkbox {
    margin-left: 0px;
  }
  .tab-control span{
    line-height: 35px;
  }
  .confing-dialog>>> .el-dialog__body{
    padding-top: 12px;
  }
  .confing-splice-dialog>>> .el-dialog__body{
    padding-top: 15px;
  }
  .config-content{
    padding: 15px;
  }
  .config-content-title{
    font-weight: bold;
    margin-bottom: 10px;
  }
  .handle-bush{
    position: absolute;
    bottom: 40px;
    left: 50%;
    z-index: 2;
    transform: translateX(-50%);
  }
  .table-td{
    padding: 0 7px;
    text-align:center;
    height:35px;
    border-bottom:1px solid #b2dfdf;
    border-right:1px solid #b2dfdf;
    width: 400px;
  }
  .table-title{
    text-align:center;
    width:160px;
    height:35px;
    border-bottom:1px solid #b2dfdf;
    border-right:1px solid #b2dfdf;
    background: #d6eeee;
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
    width: 50px;
    font-weight: bold;
    text-align: right;
    font-size: 16px;
    color: #666;
  }
</style>
