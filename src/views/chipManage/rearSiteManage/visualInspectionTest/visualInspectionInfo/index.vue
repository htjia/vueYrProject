<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 15px">
      <div class="header-btn-group">
        <el-button
          size="small"
          type="primary"
          @click="handleReceive"
        > <svg-icon icon-class="xiangzuo"/> 接片</el-button>
        <el-button
          size="small"
          type="primary"
          @click="handleTransmit"
        ><svg-icon icon-class="xiangyou"/> 传片</el-button>
        <el-button
          class="float-right"
          size="small"
          type="primary"
          @click="exportExcel"><svg-icon icon-class="export"/> 导 出</el-button>
      </div>
      <div class="input-item">
        <span class="input-title" style="width: 65px;">目检状态</span>
        <el-select v-model="searchKeys.mjzt" class="search-input" size="small" placeholder="请选择" filterable clearable>
          <el-option
            v-for="item in visualOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </div>
      <div class="input-item">
        <span class="input-title-short">批号</span>
        <el-input v-model="searchKeys.ph" class="search-input" style="width: 200px;" placeholder="请输入批号" size="small" maxlength="50" clearable/>
      </div>
      <div class="input-item">
        <span class="input-title">WaferID</span>
        <el-input v-model="searchKeys.WaferNo" class="search-input" style="width: 240px;" placeholder="请输入WaferID" size="small" maxlength="50" clearable/>
      </div>
      <div class="input-item">
        <el-radio-group v-model="timeRadio">
          <el-radio :label="0">接片时间</el-radio>
          <el-radio :label="1">目检时间</el-radio>
        </el-radio-group>
        <el-date-picker
          v-model="beginDate"
          :picker-options="pickerOptionsStart"
          :editable="false"
          class="search-input margin-left"
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
      <div class="clear-both"/>
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        height="calc(100vh - 347px)"
        element-loading-text="拼命加载中"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
          </template>
        </el-table-column>
        <el-table-column label="目检状态" align="center" prop="status">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0" style="color:#f56c6c;font-weight:bold">待目检</span>
            <span v-if="scope.row.status === 1" style="color:#1ABC9C;font-weight:bold">目检完成</span>
          </template>
        </el-table-column>
        <el-table-column label="外观及品质" align="center" prop="exteriorQuality"/>
        <el-table-column label="批号" align="center" prop="batchNo" width="220" show-overflow-tooltip/>
        <el-table-column label="WaferID" align="center" prop="waferNo" width="260" show-overflow-tooltip/>
        <el-table-column label="接片时间" align="center" prop="receiveTime" show-overflow-tooltip/>
        <el-table-column label="接片人" align="center" prop="receiverName" />
        <el-table-column label="目检时间" align="center" prop="deliverTime" show-overflow-tooltip/>
        <el-table-column label="目检人" align="center" prop="deliverName" />
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
      :visible.sync="receiveDialogVisible"
      class="padding-dialog"
      title="过站录入"
      width="1100px"
      @close="handleClose">
      <div class="dialog-sub-title">过站录入-接片</div>
      <div class="overflow-hidden input-container">
        <div class="input-item" style="margin-top: 0;">
          <span class="input-title" style="width: 140px;"><svg-icon icon-class="tiaomasm" style="font-size: 20px;color:#009494;margin-right:5px"/> 批/片号扫描 </span>
          <el-input ref="importInputJp" :autofocus="true" v-model="cBatchNum" class="search-input-scan" placeholder="请输入批/片号" size="small" maxlength="100" clearable @keyup.enter.native="handleReceiveInput"/>
        </div>
        <div class="input-item" style="margin-top: 0;">
          <span class="input-title-short"><svg-icon icon-class="zhandiangl" style="font-size: 20px;color:#009494"/> 站点 </span>
          <el-input :disabled="true" value="目检过站" class="search-input-scan" size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item" style="margin-top: 0; margin-right: 0">
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
          <span class="input-title-short" style="margin-left: 30px"><svg-icon icon-class="remarkInput" style="font-size: 20px;color:#009494; margin-left: 5px"/> 制造记录 </span>
          <el-input :disabled="true" v-model="jRemark" class="search-input-scan" size="small" maxlength="50" clearable/>
        </div>
        <div class="input-item" style="margin-top: 10px;">
          <span class="input-title-short"><svg-icon icon-class="program" style="font-size: 20px;color:#009494"/> 程序 </span>
          <el-input :disabled="true" v-model="program" class="search-input-scan" size="small" maxlength="50" clearable/>
        </div>
      </div>
      <el-row :gutter="15">
        <el-col :span="8">
          <div class="module-title-text" style="float:none;">基础数据录入</div>
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
            <el-input v-model="jRemarkLeft" class="dialog-input" style="margin-top: 10px" placeholder="请输入备注" type="textarea" maxlength="50" clearable/>
          </div>
        </el-col>
        <el-col :span="16">
          <span style="float: right;margin-top: 5px;font-weight: bold;color: #e47744">Total:<span v-if="jProcess === 72"> {{ batchNoTotal }} 批,</span> {{ receiveList.length }}片</span>
          <div class="module-title-text" style="float:none;">芯片信息</div>
          <el-table
            v-loading="listLoading"
            :data="receiveList"
            style="margin-top: 10px"
            class="site-table"
            height="380"
            element-loading-text="拼命加载中"
            border
            fit
          >
            <el-table-column align="center" label="序号" width="50">
              <template slot-scope="scope">
                {{ scope.$index+1 }}
              </template>
            </el-table-column>
            <el-table-column v-if="jProcess === 72" align="center" label="批次号" prop="batchNo" width="240"/>
            <el-table-column align="center" label="WaferID" prop="waferNo"/>
            <el-table-column v-if="jProcess === 72" align="center" label="紧急度" width="80">
              <template slot-scope="scope">
                <div v-if="scope.row.emergency === 1" style="background: #e35c5c;color: #fff">加急</div>
                <div v-if="scope.row.emergency === 0">正常</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="80">
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
          :disabled="receiveList.length === 0"
          type="primary"
          class="submit-btn"
          @click="handleReceiveDialog"
        ><svg-icon icon-class="shangpian"/> 接 片</el-button>
        <el-button @click="receiveDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="transmitDialogVisible"
      class="padding-dialog"
      title="过站录入"
      width="1100px"
      @close="handleClose">
      <div class="dialog-sub-title"><svg-icon icon-class="jiepianTitle"/>  过站录入-传片</div>
      <div class="overflow-hidden input-container">
        <div class="input-item" style="margin-top: 0">
          <span class="input-title" style="width: 140px;"><svg-icon icon-class="tiaomasm" style="font-size: 20px;color:#009494;margin-right:5px"/> 批/片号扫描 </span>
          <el-input ref="importInputCp" :autofocus="true" v-model="cBatchNum" class="search-input-scan" placeholder="请输入批/片号" size="small" maxlength="100" clearable @keyup.enter.native="handleDeliverInput"/>
        </div>
        <div class="input-item" style="margin-top: 0;">
          <span class="input-title-short"><svg-icon icon-class="zhandiangl" style="font-size: 20px;color:#009494"/> 站点 </span>
          <el-input :disabled="true" value="目检过站" class="search-input-scan" size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item" style="margin-top: 0; margin-right: 0">
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
          <span class="input-title-short" style="margin-left: 30px"><svg-icon icon-class="remarkInput" style="font-size: 20px;color:#009494; margin-left: 5px"/> 制造记录 </span>
          <el-input :disabled="true" v-model="jRemark" class="search-input-scan" size="small" maxlength="50" clearable/>
        </div>
        <div class="input-item" style="margin-top: 10px;">
          <span class="input-title-short"><svg-icon icon-class="program" style="font-size: 20px;color:#009494"/> 程序 </span>
          <el-input :disabled="true" v-model="program" class="search-input-scan" size="small" maxlength="50" clearable/>
        </div>
      </div>
      <el-row :gutter="15">
        <el-col :span="8">
          <div class="module-title-text" style="float:none;margin-bottom: 15px">基础数据录入</div>
          <div class="left-content" style="height: auto">
            <span class="input-title" style="margin-top: 15px; width: 50px">操作员 </span>
            <el-select v-model="cOperator" class="dialog-input" size="small" placeholder="请选择" filterable>
              <el-option
                v-for="item in userOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
            <span class="input-title" style="line-height: 60px; width: 50px;">备注 </span>
            <el-input v-model="cRemarkLeft" class="dialog-input" style="margin-top: 10px" placeholder="请输入备注" type="textarea" maxlength="50" clearable/>
          </div>
          <div v-if="jProcess === 72" class="module-title-text" style="float:none;margin-top: 15px">是否需要AOI</div>
          <div v-if="jProcess === 72" class="left-content" style="height: auto">
            <span class="input-title" style="margin-top: 15px; width: 100px">是否需要AOI </span>
            <el-radio-group v-model="aoiRadio" style="width: 200px;">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
            <span class="input-title" style="line-height: 60px; width: 50px;">备注 </span>
            <el-input v-model="aoiRemarkLeft" class="dialog-input" style="margin-top: 20px" placeholder="请输入备注" type="textarea" maxlength="50" clearable/>
          </div>
        </el-col>
        <el-col :span="16">
          <el-button
            :disabled="receiveList.length === 0"
            class="float-right margin-left"
            type="danger"
            size="mini"
            @click="handleReporting"
          ><svg-icon icon-class="baojingguiz"/> 异常上报</el-button>
          <span style="float: right;margin-top: 5px;font-weight: bold;color: #e47744">Total: <span v-if="jProcess === 72">{{ batchNoTotal }} 批,</span> {{ receiveList.length }}片</span>
          <div class="module-title-text" style="float:none;margin-bottom: 15px">芯片信息</div>
          <el-table
            v-loading="listLoading"
            :data="receiveList"
            style="margin-top: 10px"
            class="site-table"
            height="380"
            element-loading-text="拼命加载中"
            border
            fit
          >
            <el-table-column align="center" label="序号" width="50">
              <template slot-scope="scope">
                {{ scope.$index+1 }}
              </template>
            </el-table-column>
            <el-table-column v-if="jProcess === 72" align="center" label="批次号" prop="batchNo" width="240" show-overflow-tooltip/>
            <el-table-column align="center" label="WaferID" prop="waferNo" show-overflow-tooltip/>
            <el-table-column align="center" label="操作" width="100">
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
          :disabled="receiveList.length === 0"
          type="primary"
          class="submit-btn"
          @click="handleTransmitDialog"
        ><svg-icon icon-class="xiangyou"/> 传 片</el-button>
        <el-button @click="transmitDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!--分选后异常上报-->
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="afterReportingDialog"
      class="padding-dialog"
      title="异常上报"
      width="600px"
    >
      <el-table
        v-loading="listLoading"
        ref="detailTable"
        :data="receiveList"
        element-loading-text="拼命加载中"
        height="390"
        border
        fit
      >
        <el-table-column label="" align="center" prop="status" width="55">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.abnormalStatus" disabled @change="abnormalDetailChange(detailList)"/>
          </template>
        </el-table-column>
        <el-table-column label="WaferID" align="center" prop="waferNo"/>
        <el-table-column label="异常原因" align="center" prop="remark" width="280">
          <template slot-scope="scope">
            <el-select v-model="scope.row.resonDeatil" class="dialog-input" style="width: 95%;" size="small" placeholder="请选择" filterable multiple collapse-tags @change="abnormalDetailCauseAftChange(scope.row)">
              <el-option-group
                v-for="group in exceptionCode"
                :key="group.label"
                :label="group.label"
              >
                <el-option
                  v-for="item in group.options"
                  :key="item.id"
                  :label="item.code + ' (' + item.name + ')'"
                  :value="item.classifyId + '#' + item.id + '#' + item.code + '#' + item.name + '#' + item.dispose"/>
              </el-option-group>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="abnormalAfterSubmit">异常提交</el-button>
        <el-button @click="cancelAbAfterSubmit">取 消</el-button>
      </span>
    </el-dialog>
    <!--异常上报-->
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="abnormalReportDialog"
      class="padding-dialog abnormal-dialog"
      title="异常上报"
      width="1250px"
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
            <el-table-column label="异常片数" align="center" prop="selectedWafer" width="120"/>
            <el-table-column label="异常原因" align="center" width="107" maxlength="50"/>
          </el-table>
          <el-input ref="abnormalCause" :rows="textareaRow" v-model="abnormalRemark" size="small" class="abnormal-cause" type="textarea" maxlength="50" clearable/>
        </el-col>
        <el-col :span="13">
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
          >
            <el-table-column label="" align="center" prop="status" width="55">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.abnormalStatus" disabled @change="abnormalDetailChange(detailList)"/>
              </template>
            </el-table-column>
            <!--<el-table-column align="center" label="位次号" width="50" prop="sequence"/>-->
            <el-table-column label="WaferID" align="center" prop="waferNo"/>
            <el-table-column label="镭刻号" align="center" prop="laserMark" width="100"/>
            <el-table-column label="异常原因" align="center" prop="remark" width="280">
              <template slot-scope="scope">
                <!--<el-select v-model="scope.row.abnormalCause" class="dialog-input" size="mini" style="width: 30%;" placeholder="请选择" clearable @change="abnormalCauseChange(scope.row)">
                  <el-option
                    v-for="item in classifyList"
                    :key="item.id"
                    :label="item.code"
                    :value="item.id + '#' + item.code"/>
                </el-select>
                <el-select v-model="scope.row.resonDeatil" class="dialog-input" size="mini" style="width: 60%;" placeholder="请选择" multiple collapse-tags @change="abnormalDetailCauseChange(scope.row)">
                  <el-option
                    v-for="item in scope.row.resonDeatilList"
                    :key="item.id"
                    :label="item.exceptionRemark"
                    :value="item.id + '#' + item.exceptionRemark"/>
                </el-select>-->
                <el-select v-model="scope.row.resonDeatil" class="dialog-input" style="width: 95%;" size="small" placeholder="请选择" filterable multiple collapse-tags @change="abnormalDetailCauseChange(scope.row)">
                  <el-option-group
                    v-for="group in exceptionCode"
                    :key="group.label"
                    :label="group.label"
                  >
                    <el-option
                      v-for="item in group.options"
                      :key="item.id"
                      :label="item.code + ' (' + item.name + ')'"
                      :value="item.classifyId + '#' + item.id + '#' + item.code + '#' + item.dispose"/>
                  </el-option-group>
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="abnormalSubmit">异常提交</el-button>
        <el-button @click="cancelAbSubmit">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .input-title{
    width: 75px;
  }
  .input-title-short{
    width: 50px;
    font-weight: bold;
    padding-right: 5px;
  }
  .input-item{
    float: left;
    margin-top: 14px;
    margin-right: 10px;
    position: relative;
  }
  .search-input{
    width: 135px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 270px);
  }
  .tab-control span{
    line-height: 50px;
  }
  .el-checkbox {
    margin-left: 0px;
  }
  .input-item>>> .el-radio{
    margin-top: 10px;
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
  .input-title{
    width: 65px;
  }
  .left-content{
    border: 1px solid #b2dfdf;
    height: 381px;
    margin-top: 10px;
    padding: 5px 10px 10px 10px;
  }
  .dialog-input{
    width: 267px;
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
    width: 120px;
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
    text-align: center;
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
  .abnormal-cause>>> .el-textarea__inner{
    height: 356px!important;
  }
  .search-input-scan{
    width: 233px;
  }
  .padding-dialog>>> .el-select-group__title {
    padding-left: 20px;
    font-size: 14px;
    color: #666;
    font-weight: bold;
    line-height: 30px;
  }
  .padding-dialog>>> .cell{
    line-height: 28px;
  }
  .padding-dialog>>> td{
    height: 28px;
  }
  .abnormal-dialog>>> .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background-color: #009494!important;
    border-color: #009494!important;
  }
</style>
