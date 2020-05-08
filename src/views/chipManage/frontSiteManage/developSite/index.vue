<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto">
      <div class="header-btn-group">
        <el-button
          size="small"
          type="primary"
          @click="handleReceive"
        > <svg-icon icon-class="xiangzuo"/> 接片</el-button>
        <el-button
          size="small"
          type="primary"
          @click="handleDeliver"
        ><svg-icon icon-class="xiangshang"/> 上片</el-button>
        <el-button
          size="small"
          type="primary"
          @click="handleTransmit"
        ><svg-icon icon-class="xiangyou"/> 传片</el-button>
        <el-button
          size="small"
          class="float-right"
          type="primary"
          @click="exportExcel"
        ><svg-icon icon-class="export"/> 导出</el-button>
        <el-button
          size="small"
          class="float-right"
          type="primary"
          @click="selectThead"
        ><svg-icon icon-class="shezhilk"/> 设置显示列</el-button>
      </div>
      <div style="height: auto">
        <div class="input-item" style="margin-right: 15px">
          <span class="input-title" style="width: 50px;">批次号 </span>
          <el-input v-model="batchNum" class="search-input" style="width: 195px;" placeholder="请输入批次号" size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item" style="margin-right: 15px">
          <span class="input-title" style="width: 40px;">工序 </span>
          <el-select v-model="process" class="search-input" style="width: 120px;" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in proceOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item" style="margin-right: 15px">
          <el-radio-group v-model="timeRadio" class="margin-right">
            <el-radio :label="1">接片时间</el-radio>
            <el-radio :label="2">上片时间</el-radio>
            <el-radio :label="3">传片时间</el-radio>
          </el-radio-group>
          <el-date-picker
            v-model="beginDate"
            :picker-options="pickerOptionsStart"
            :editable="false"
            class="search-input"
            style="width: 130px;"
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
            style="width: 130px;"
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
        <div class="clear-both"/>
      </div>
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
        class="site-table broad-scrollbar-table"
        element-loading-text="拼命加载中"
        height="calc(100vh - 342px)"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="批号" width="180" prop="batchNo" fixed/>
        <el-table-column v-for="item in formThead" :key="item.thName" :label="item.thName" :render-header="labelHead" align="center" width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[item.thKey] }}
          </template>
        </el-table-column>
        <el-table-column v-for="item in handParams" :key="item.paramsName" :label="item.paramsName" :prop="item.paramsCode" align="center" width="180" show-overflow-tooltip/>
        <el-table-column align="center" label="原始文件" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <div style="color: #009494;text-decoration: underline;cursor: pointer;" @click="downLoadFile(scope.row.batchNo, scope.row.processId)">点击下载</div>
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
    <!--接片-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="receiveDialogVisible"
      class="padding-dialog"
      top="80px"
      title="过站录入"
      width="1100px"
      @close="handleClose">
      <div class="dialog-sub-title"><svg-icon icon-class="jiepianTitle"/> 过站录入-接片</div>
      <div class="overflow-hidden input-container">
        <div class="input-item" style="margin-top: 0;">
          <span class="input-title"><svg-icon icon-class="tiaomasm" style="font-size: 20px;color:#009494"/> 批号扫描 </span>
          <el-input ref="importInputJp" :autofocus="true" v-model="jBatchNum" class="search-input-scan" placeholder="请输入批号" size="small" maxlength="50" clearable @keyup.enter.native="handleReceiveInput(1)"/>
        </div>
        <div class="input-item" style="margin-top: 0;">
          <span class="input-title-short"><svg-icon icon-class="zhandiangl" style="font-size: 20px;color:#009494"/> 站点 </span>
          <el-input :disabled="true" value="显影站点" class="search-input-scan" size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item" style="margin-top: 0;margin-right: 0">
          <span class="input-title-short"><svg-icon icon-class="jianyansz" style="font-size: 20px;color:#009494"/> 工序</span>
          <el-select v-model="jProcess" class="search-input-scan" size="small" placeholder="请选择" filterable @change="processJChange">
            <el-option
              v-for="item in proceOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item" style="margin-top: 10px;">
          <span class="input-title-short" style="margin-left: 8px"><svg-icon icon-class="remarkInput" style="margin-right: 3px;margin-left: -4px;font-size: 20px;color:#009494"/> 制造记录 </span>
          <el-input :disabled="true" v-model="jRemark" class="search-input-scan" size="small" maxlength="50" clearable/>
        </div>
        <div class="input-item" style="margin-top: 10px;">
          <span class="input-title-short"><svg-icon icon-class="program" style="font-size: 20px;color:#009494"/> 程序 </span>
          <el-input :disabled="true" v-model="program" class="search-input-scan" size="small" maxlength="50" clearable/>
        </div>
      </div>
      <el-row :gutter="15">
        <el-col :span="8">
          <div class="module-title-text" style="float:none;margin-bottom: 15px">接片信息</div>
          <div class="left-content">
            <span class="input-title" style="margin-top: 15px; width: 50px">操作员 </span>
            <el-select v-model="jOperator" class="dialog-input" size="small" placeholder="请选择" filterable>
              <el-option
                v-for="item in userOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
            <span class="input-title" style="line-height: 60px; width: 50px;">备注 </span>
            <el-input v-model="jRemarkLeft" class="dialog-input" style="margin-top: 15px" placeholder="请输入备注" type="textarea" maxlength="50" clearable/>
          </div>
        </el-col>
        <el-col :span="16">
          <el-button
            class="float-right margin-left"
            size="mini"
            type="primary"
            @click="batchDate(1)"
          >拆批数据</el-button>
          <span style="float: right;margin-top: 5px;font-weight: bold;color: #e47744">Total: {{ receiveList.length }} 批, {{ waferTotalNum }}片</span>
          <span class="module-title-text" style="float:none;display:inline-block;margin-top: 6px;margin-bottom: 5px">
            批次信息
          </span>
          <el-table
            :data="receiveList"
            style="margin-top: 10px"
            class="site-table"
            height="380"
            element-loading-text="拼命加载中"
            border
            fit
            stripe>
            <el-table-column align="center" label="序号" width="50">
              <template slot-scope="scope">
                {{ scope.$index+1 }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="批次号" prop="batchNo" width="180"/>
            <el-table-column align="center" label="紧急度">
              <template slot-scope="scope">
                <div v-if="scope.row.priority === 1" style="background: #e35c5c;color: #fff">加急</div>
                <div v-if="scope.row.priority === 0">正常</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="片数" prop="sliceNum">
              <template slot-scope="scope">
                <el-input :disabled="true" v-model="scope.row.sliceNum" size="mini" type="number" style="width: 100%"/>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button type="danger" round icon="el-icon-close" size="mini" @click="deleteItem(scope.$index)"/>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div class="cut-line"/>
      <span slot="footer" class="dialog-footer" style="text-align: center">
        <el-button
          :disabled="waferTotalNum === 0"
          type="primary"
          class="submit-btn"
          @click="handleReceiveDialog"
        > <svg-icon icon-class="xiangzuo"/> 接片</el-button>
        <el-button @click="resetForm">取 消</el-button>
      </span>
    </el-dialog>
    <!--上片-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="deliverDialogVisible"
      class="padding-dialog"
      title="过站录入"
      width="1100px"
      top="80px"
      @close="handleClose">
      <div class="dialog-sub-title"><svg-icon icon-class="jiepianTitle"/> 过站录入-上片</div>
      <div class="overflow-hidden input-container">
        <div class="input-item" style="margin-top: 0;">
          <span class="input-title"><svg-icon icon-class="tiaomasm" style="font-size: 20px;color:#009494"/> 批号扫描 </span>
          <el-input ref="importInputSp" :autofocus="true" v-model="jBatchNum" class="search-input-scan" placeholder="请输入批号" size="small" maxlength="50" clearable @keyup.enter.native="handleReceiveInput(2)"/>
        </div>
        <div class="input-item" style="margin-top: 0;">
          <span class="input-title-short"><svg-icon icon-class="zhandiangl" style="font-size: 20px;color:#009494"/> 站点 </span>
          <el-input :disabled="true" value="显影站点" class="search-input-scan" size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item" style="margin-top: 0;margin-right: 0">
          <span class="input-title-short"><svg-icon icon-class="jianyansz" style="font-size: 20px;color:#009494"/> 工序</span>
          <el-select v-model="jProcess" class="search-input-scan" size="small" placeholder="请选择" filterable @change="processSChange">
            <el-option
              v-for="item in proceOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item" style="margin-top: 10px;">
          <span class="input-title-short" style="margin-left: 8px"><svg-icon icon-class="remarkInput" style="margin-right: 3px;margin-left: -4px;font-size: 20px;color:#009494"/> 制造记录 </span>
          <el-input :disabled="true" v-model="jRemark" class="search-input-scan" size="small" maxlength="50" clearable/>
        </div>
        <div class="input-item" style="margin-top: 10px;">
          <span class="input-title-short"><svg-icon icon-class="program" style="font-size: 20px;color:#009494"/> 程序 </span>
          <el-input :disabled="true" v-model="program" class="search-input-scan" size="small" maxlength="50" clearable/>
        </div>
      </div>
      <el-row :gutter="15">
        <el-col :span="8">
          <!--基础数据-->
          <div class="module-title-text" style="float:none;margin-bottom: 15px">基础数据</div>
          <div class="left-content" style="height: auto">
            <span class="input-title" style="margin-top: 15px; width: 100px">机台编号 </span>
            <el-select :disabled="jProcess === ''" v-model="machineNum" class="dialog-input-short" size="small" placeholder="请选择" filterable clearable @change="machineChange">
              <el-option
                v-for="item in machinList"
                :key="item.id"
                :label="item.code"
                :value="item.id"/>
            </el-select>
            <span v-if="machineType === 0" class="input-title" style="margin-top: 15px; width: 100px">槽位 </span>
            <el-select v-if="machineType === 0" :disabled="machineNum === ''" v-model="trench" class="dialog-input-short" size="small" placeholder="请选择" filterable clearable @change="findGrandTotalFun">
              <el-option
                v-for="item in slotList"
                :key="item"
                :label="item"
                :value="item"/>
            </el-select>
            <span v-if="machineType === 1" class="input-title" style="margin-top: 15px; width: 100px">胶管 </span>
            <el-select v-if="machineType === 1" :disabled="machineNum === ''" v-model="trench" class="dialog-input-short" size="small" placeholder="请选择" filterable clearable @change="findGrandTotalFun">
              <el-option
                v-for="item in hoseNoList"
                :key="item"
                :label="item"
                :value="item"/>
            </el-select>
            <span class="input-title" style=" width: 100px;">累计片数 </span>
            <el-input v-model="grandTotal" :disabled="true" class="dialog-input-short" style="margin-top: 10px" size="small" maxlength="20" clearable/>
            <span class="input-title" style=" width: 100px;">阈值 </span>
            <el-input v-model="threshold" :disabled="true" class="dialog-input-short" style="margin-top: 10px" size="small" maxlength="20" clearable/>
            <span class="input-title" style=" width: 100px;">操作员 </span>
            <el-select v-model="jOperator" class="dialog-input-short" style="margin-top: 10px" size="small" placeholder="请选择" filterable>
              <el-option
                v-for="item in userOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
            <span class="input-title" style=" width: 100px;line-height: 60px">备注 </span>
            <el-input v-model="jRemarkLeft" class="dialog-input-short" style="margin-top: 10px" size="small" type="textarea" placeholder="请输入备注" maxlength="50" clearable/>
          </div>
          <!--参数数据-->
          <span class="module-title-text" style="float:none; margin-top: 15px;margin-bottom: 0px;display: inline-block">参数数据</span>
          <el-radio-group v-model="motionRadio" class="float-right" style="margin-top: 15px"><el-radio :label="1">自动</el-radio><el-radio :label="0">手动</el-radio></el-radio-group>
          <div class="left-content" style="height: auto">
            <div v-for="item in handParams" :key="item.paramsName">
              <span class="input-title" style="margin-top: 15px; width: 145px">{{ item.paramsName }}</span>
              <el-input v-model="item.val" :disabled="motionRadio === 1" type="number" class="dialog-input-short" style="margin-top: 10px;width: 170px" size="small" onkeyup="if(this.value.length > 10){this.value = this.value.slice(0, 10)}" @input="inputChange(item)"/>
            </div>
          </div>
        </el-col>
        <el-col :span="16">
          <span class="module-title-text" style="float:none;display:inline-block;margin-top: 6px;margin-bottom: 5px">
            批次信息
          </span>
          <el-button
            class="float-right margin-left"
            size="mini"
            type="primary"
            @click="batchDate(2)"
          >拆批数据</el-button>
          <span style="float: right;margin-top: 5px;font-weight: bold;color: #e47744">Total: {{ receiveList.length }} 批, {{ waferTotalNum }}片</span>
          <el-table
            :data="receiveList"
            style="margin-top: 10px"
            class="site-table"
            height="422"
            element-loading-text="拼命加载中"
            border
            fit
            stripe>
            <el-table-column align="center" label="序号" width="50">
              <template slot-scope="scope">
                {{ scope.$index+1 }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="批次号" prop="batchNo" width="180"/>
            <el-table-column align="center" label="紧急度">
              <template slot-scope="scope">
                <div v-if="scope.row.priority === 1" style="background: #e35c5c;color: #fff">加急</div>
                <div v-if="scope.row.priority === 0">正常</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="片数" prop="sliceNum">
              <template slot-scope="scope">
                <el-input v-model="scope.row.sliceNum" :input="onInput(scope.row)" size="mini" type="number" style="width: 100%"/>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button type="danger" round icon="el-icon-close" size="mini" @click="deleteItem(scope.$index)"/>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div class="cut-line"/>
      <span slot="footer" class="dialog-footer" style="text-align: center">
        <el-button
          :disabled="waferTotalNum === 0"
          type="primary"
          class="submit-btn"
          @click="handleDeliverSubmit"
        ><svg-icon icon-class="xiangshang"/> 上片</el-button>
        <el-button @click="resetForm">取 消</el-button>
      </span>
    </el-dialog>
    <!--传片-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="transmitDialogVisible"
      class="padding-dialog"
      top="80px"
      title="过站录入"
      width="1100px"
      @close="handleClose">
      <div class="dialog-sub-title"><svg-icon icon-class="jiepianTitle"/> 过站录入-传片</div>
      <div class="overflow-hidden input-container">
        <div class="input-item" style="margin-top: 0;">
          <span class="input-title"><svg-icon icon-class="tiaomasm" style="font-size: 20px;color:#009494"/> 批号扫描 </span>
          <el-input ref="importInputCp" :autofocus="true" v-model="jBatchNum" class="search-input-scan" placeholder="请输入批号" size="small" maxlength="50" clearable @keyup.enter.native="handleReceiveInput(3)"/>
        </div>
        <div class="input-item" style="margin-top: 0;">
          <span class="input-title-short"><svg-icon icon-class="zhandiangl" style="font-size: 20px;color:#009494"/> 站点 </span>
          <el-input :disabled="true" value="显影站点" class="search-input-scan" size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item" style="margin-top: 0;margin-right: 0">
          <span class="input-title-short"><svg-icon icon-class="jianyansz" style="font-size: 20px;color:#009494"/> 工序</span>
          <el-select v-model="jProcess" class="search-input-scan" size="small" placeholder="请选择" filterable @change="processCChange">
            <el-option
              v-for="item in proceOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item" style="margin-top: 10px;">
          <span class="input-title-short" style="margin-left: 8px"><svg-icon icon-class="remarkInput" style="margin-right: 3px;margin-left: -4px;font-size: 20px;color:#009494"/> 制造记录 </span>
          <el-input :disabled="true" v-model="jRemark" class="search-input-scan" size="small" maxlength="50" clearable/>
        </div>
        <div class="input-item" style="margin-top: 10px;">
          <span class="input-title-short"><svg-icon icon-class="program" style="font-size: 20px;color:#009494"/> 程序 </span>
          <el-input :disabled="true" v-model="program" class="search-input-scan" size="small" maxlength="50" clearable/>
        </div>
      </div>
      <el-row :gutter="15">
        <el-col :span="8">
          <div class="module-title-text" style="float:none;margin-bottom: 15px">基础信息</div>
          <div class="left-content">
            <span class="input-title" style="margin-top: 15px; width: 50px">操作员 </span>
            <el-select v-model="jOperator" class="dialog-input" size="small" placeholder="请选择" filterable>
              <el-option
                v-for="item in userOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
            <span class="input-title" style="line-height: 60px; width: 50px;">备注 </span>
            <el-input v-model="jRemarkLeft" class="dialog-input" style="margin-top: 15px" placeholder="请输入备注" type="textarea" maxlength="50" clearable/>
          </div>
        </el-col>
        <el-col :span="16">
          <el-button
            class="float-right margin-left"
            size="mini"
            type="primary"
            @click="batchDate(3)"
          >拆批数据</el-button>
          <el-button
            :disabled="waferTotalNum === 0"
            class="float-right margin-left"
            type="danger"
            size="mini"
            @click="handleReporting"
          ><svg-icon icon-class="baojingguiz"/> 异常上报</el-button>
          <span class="module-title-text" style="float:none;display:inline-block;margin-top: 6px;margin-bottom: 5px">
            批次信息
          </span>
          <span style="float: right;margin-top: 5px;font-weight: bold;color: #e47744">Total: {{ receiveList.length }} 批, {{ waferTotalNum }}片</span>
          <el-table
            :data="receiveList"
            style="margin-top: 10px"
            class="site-table"
            height="380"
            element-loading-text="拼命加载中"
            border
            fit
            stripe>
            <el-table-column align="center" label="序号" width="50">
              <template slot-scope="scope">
                {{ scope.$index+1 }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="批次号" prop="batchNo" width="180"/>
            <el-table-column align="center" label="紧急度">
              <template slot-scope="scope">
                <div v-if="scope.row.priority === 1" style="background: #e35c5c;color: #fff">加急</div>
                <div v-if="scope.row.priority === 0">正常</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="片数" prop="sliceNum">
              <template slot-scope="scope">
                <el-input :disabled="isSplit === 0" v-model="scope.row.sliceNum" :input="onInput(scope.row)" size="mini" type="number" style="width: 100%"/>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button type="danger" round icon="el-icon-close" size="mini" @click="deleteItem(scope.$index)"/>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div class="cut-line"/>
      <span slot="footer" class="dialog-footer" style="text-align: center">
        <el-button
          :disabled="waferTotalNum === 0"
          type="primary"
          class="submit-btn"
          @click="handleTransmitDialog"
        ><svg-icon icon-class="xiangyou"/> 传 片</el-button>
        <el-button @click="resetForm">取 消</el-button>
      </span>
    </el-dialog>
    <!--异常上报-->
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="abnormalReportDialog"
      class="padding-dialog"
      title="异常上报"
      width="1200px"
    >
      <el-row :gutter="20">
        <el-col :span="11" style="position: relative;">
          <span style="float: right;margin-top: 5px;font-weight: bold;color: #e47744">已选择异常批次 {{ selectedAbnormalNum }}/{{ receiveList.length }}</span>
          <span class="module-title-text">批次信息</span>
          <el-table
            v-loading="listLoading"
            ref="runTable"
            :span-method="objectSpanMethod"
            :data="abnormalReport"
            element-loading-text="拼命加载中"
            height="390"
            highlight-current-row
            border
            fit
            @row-click="rowClick"
          >
            <el-table-column label="" align="center" prop="status" width="55">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.abnormalStatus" @change="abnormalChange(abnormalReport)"/>
              </template>
            </el-table-column>
            <el-table-column label="批号" align="center" prop="batchNo"/>
            <el-table-column label="总片数" align="center" prop="total" width="70"/>
            <el-table-column label="已选wafer数量" align="center" prop="selectedWafer" width="120"/>
            <el-table-column label="异常原因" align="center" width="107" maxlength="50"/>
          </el-table>
          <el-input ref="abnormalCause" :rows="textareaRow" v-model="abnormalRemark" size="small" class="abnormal-cause" type="textarea" maxlength="50" clearable/>
        </el-col>
        <el-col :span="1">
          <div style="text-align: center;padding-top: 30px">
            <svg-icon icon-class="right" style="color:#009494;font-size: 40px"/>
          </div>
        </el-col>
        <el-col :span="12">
          <span style="float: right;margin-top: 5px;font-weight: bold;color: #e47744">Total: {{ waferTotalNum }}片</span>
          <span class="module-title-text">盒内信息({{ abnormalBatchNum }})</span>
          <el-table
            v-loading="listLoading"
            ref="detailTable"
            :data="detailList"
            element-loading-text="拼命加载中"
            height="390"
            border
            fit
            stripe
          >
            <el-table-column label="" align="center" prop="status" width="55">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.abnormalStatus" @change="abnormalDetailChange(detailList)"/>
              </template>
            </el-table-column>
            <el-table-column align="center" label="位次号" width="50" prop="sequence"/>
            <el-table-column label="WaferID" align="center" prop="waferNo" width="200"/>
            <el-table-column label="镭刻号" align="center" prop="laserMark" width="100"/>
            <el-table-column label="异常原因" align="center" prop="remark">
              <template slot-scope="scope">
                <el-input v-model="scope.row.abnormalCause" size="mini" style="width: 100%;" maxlength="50" clearable/>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="abnormalSubmit">异常提交</el-button>
        <el-button @click="abnormalReportDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <!--拆批数据-->
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="batchDialogVisible"
      class="padding-dialog"
      title="拆批数据"
      width="1000px"
    >
      <el-table
        :data="cutSliceList"
        style="margin-top: 10px"
        height="450"
        element-loading-text="拼命加载中"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="批次号" prop="batchNo" width="180"/>
        <el-table-column align="center" label="总片数" prop="tatol"/>
        <el-table-column align="center" label="已处理数" prop="upNum"/>
        <el-table-column align="center" label="待处理数" prop="waitNum"/>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button v-show="runStatus === 1" type="primary" size="mini" @click="handleJiePian(scope.row)"><svg-icon icon-class="xiangzuo"/>接片</el-button>
            <el-button v-show="runStatus === 2" type="primary" size="mini" @click="handleJiePian(scope.row)"><svg-icon icon-class="xiangshang"/>上片</el-button>
            <el-button v-show="runStatus === 3" type="primary" size="mini" @click="handleJiePian(scope.row)"><svg-icon icon-class="xiangyou"/>传片</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="batchDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .site-table>>> .cell{
    line-height: 37px;
  }
  .site-table>>> td{
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
  .short-input{
    width: 126px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 265px);
  }
  .app-container>>> .el-checkbox{
    margin-left: 30px;
    display: block;
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
    height: 355px;
    border: 1px solid #e2e2e2;
    position: absolute;
    z-index: 200;
    background: #fff;
    right: 15px;
    top: 60px;
  }
  .options-box{
    height: 300px;
    overflow: auto;
    margin-bottom: 10px;
  }
  .dialog-sub-title{
    line-height: 40px;
    font-weight: bold;
    font-size: 26px;
    text-align: center;
    color: #009494;
  }
  .cut-line{
    border-bottom: 1px solid #e2e2e2;
    margin-top: 10px;
  }
  .left-content{
    border: 1px solid #b2dfdf;
    height: 381px;
    margin-top: 10px;
    padding: 5px 10px 10px 10px;
  }
  .dialog-input{
    width: 268px;
  }
  .dialog-input-base{
    width: 217px;
  }
  .dialog-input-short{
    width: 215px;
  }
  .module-title-text{
    margin-bottom: 10px;
  }
  .search-input{
    width: 138px;
  }
  .input-title{
    width: 80px;
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
  .submit-btn:disabled{
    background: #19876a; border-color: #19876a;
  }
  .abnormal-cause{
    position: absolute;
    width: 105px;
    top: 63px;
    background: #fff;
    right: 13px;
  }
  .input-item>>> .el-radio{
    margin-right: 15px;
  }
  .padding-dialog>>>.el-checkbox {
    margin-left: 0px;
  }
  .search-input-scan{
    width: 248px;
  }
</style>
