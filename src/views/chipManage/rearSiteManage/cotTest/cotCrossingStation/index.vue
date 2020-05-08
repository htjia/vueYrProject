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
          @click="handleTransmit"
        ><svg-icon icon-class="xiangyou"/> 传 片</el-button>
        <el-button
          class="float-right"
          size="small"
          type="primary"
          @click="exportExcel"
        ><svg-icon icon-class="export"/> 导 出</el-button>
        <el-button
          class="float-right"
          size="small"
          type="primary"
          @click="exceptionRecord"
        ><svg-icon icon-class="replaceRecord"/> 异常记录</el-button>
      </div>
      <div style="height: 45px;">
        <div class="input-item">
          <span class="input-title input-title-short">批次号 </span>
          <el-input v-model="batchNum" class="search-input search-input-short" style="width: 200px" placeholder="请输入批次号" size="small" maxlength="50" clearable/>
        </div>
        <div class="input-item">
          <!--<el-radio-group v-model="timeRadio" class="margin-right">-->
          <!--<el-radio :label="0">测试时间</el-radio>-->
          <!--<el-radio :label="1">过站时间</el-radio>-->
          <!--</el-radio-group>-->
          <span class="input-title input-title">过站时间 </span>
          <el-date-picker
            v-model="beginDate"
            :picker-options="pickerOptionsStart"
            :editable="false"
            class="search-input search-input-short"
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
            class="search-input search-input-short"
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
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        height="calc(100vh - 342px)"
        class="site-table"
        element-loading-text="拼命加载中"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="批次号" prop="batchNo" width="300" sortable show-overflow-tooltip/>
        <el-table-column align="center" label="投产类型" prop="productType" sortable/>
        <el-table-column align="center" label="片数" prop="num" sortable/>
        <el-table-column align="center" label="接片人" prop="receiveName" sortable/>
        <el-table-column align="center" label="接片时间" prop="createTime" sortable/>
        <el-table-column align="center" label="备注" prop="remark" sortable/>
        <!--<el-table-column align="center" label="原始文件" width="120" show-overflow-tooltip>-->
        <!--<template slot-scope="scope">-->
        <!--<div style="color: #009494;text-decoration: underline;cursor: pointer;" @click="downLoadFile(scope.row.filePath)">点击下载</div>-->
        <!--</template>-->
        <!--</el-table-column>-->
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
      v-drag
      :close-on-click-modal="false"
      :visible.sync="receiveDialogVisible"
      class="padding-dialog"
      title="过站录入"
      width="1100px"
      @close="handleClose">
      <div class="dialog-sub-title"><svg-icon icon-class="jiepianTitle"/> 过站录入-接片</div>
      <div class="overflow-hidden input-container">
        <div class="input-item" style="margin-top: 0;">
          <span class="input-title"><svg-icon icon-class="tiaomasm" style="font-size: 20px;color:#009494"/> 批号扫描 </span>
          <el-input ref="importInputJp" :autofocus="true" v-model="jBatchNum" class="search-input-scan" placeholder="请输入批号" size="small" maxlength="50" clearable @keyup.enter.native="handleReceiveInput"/>
        </div>
        <div class="input-item" style="margin-top: 0;">
          <span class="input-title-short"><svg-icon icon-class="zhandiangl" style="font-size: 20px;color:#009494"/> 站点 </span>
          <el-input :disabled="true" value="COT过站" class="search-input-scan" size="small" maxlength="20" clearable/>
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
          <span class="input-title-short"><svg-icon icon-class="remarkInput" style="font-size: 20px;color:#009494; margin-left: 5px"/> 制造记录 </span>
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
          <span style="float: right;margin-top: 5px;font-weight: bold;color: #e47744">Total: {{ receiveList.length }} 批, {{ waferTotalNum }}片</span>
          <span class="module-title-text" style="float:none;display:inline-block;margin-top: 6px;margin-bottom: 5px">
            批次信息
          </span>
          <el-table
            v-loading="listLoading"
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
                <div v-if="scope.row.emergency === 1" style="background: #e35c5c;color: #fff">加急</div>
                <div v-if="scope.row.emergency === 0">正常</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="片数" prop="total"/>
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
          :disabled="receiveList.length === 0"
          type="primary"
          class="submit-btn"
          @click="handleReceiveDialog"
        ><svg-icon icon-class="xiangzuo"/> 接片</el-button>
        <el-button @click="resetForm('machineForm')">取 消</el-button>
      </span>
    </el-dialog>
    <!--传片-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="transmitDialogVisible"
      class="padding-dialog"
      title="过站录入"
      width="1100px"
      top="60px"
      @close="handleClose">
      <div class="dialog-sub-title"><svg-icon icon-class="jiepianTitle"/> 过站录入-COT车间</div>
      <div class="overflow-hidden input-container">
        <div class="input-item" style="margin-top: 0">
          <span class="input-title" style="width: 106px;"><svg-icon icon-class="tiaomasm" style="font-size: 20px;color:#009494;margin-right:2px"/> 批号扫描 </span>
          <el-input ref="importInputCp" :autofocus="true" v-model="cBatchNum" class="search-input-scan" placeholder="请输入批号" size="small" maxlength="50" clearable @keyup.enter.native="handleDeliverInput"/>
        </div>
        <div class="input-item" style="margin-top: 0;">
          <span class="input-title-short"><svg-icon icon-class="zhandiangl" style="font-size: 20px;color:#009494"/> 站点 </span>
          <el-input :disabled="true" value="COT过站" class="search-input-scan" size="small" maxlength="20" clearable/>
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
          <div class="module-title-text" style="float:none;margin-bottom: 15px">基础数据</div>
          <div class="left-content" style="height: 430px">
            <span class="input-title" style="margin-top: 15px; width: 50px">操作员 </span>
            <el-select v-model="jOperator" class="dialog-input" size="small" placeholder="请选择" filterable>
              <el-option
                v-for="item in userOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
            <span class="input-title" style="line-height: 60px; width: 50px;">备注 </span>
            <el-input v-model="cRemarkLeft" class="dialog-input" style="margin-top: 10px" placeholder="请输入备注" type="textarea" maxlength="50" clearable/>
          </div>
        </el-col>
        <el-col :span="16">
          <span style="float: right;margin-top: 5px;font-weight: bold;color: #e47744">Total: {{ normalNumList.length }} 批, {{ normalList.length }}片</span>
          <div class="module-title-text" style="float:none;margin-bottom: 15px">批次信息</div>
          <el-table
            v-loading="listLoading"
            :data="normalList"
            style="margin-top: 10px"
            class="site-table"
            height="430"
            element-loading-text="拼命加载中"
            border
            fit
            stripe>
            <el-table-column align="center" label="序号" width="50">
              <template slot-scope="scope">
                {{ scope.$index+1 }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="批次号" prop="batchNo"/>
            <el-table-column align="center" label="WaferID" prop="waferNo"/>
            <el-table-column align="center" label="操作" width="50">
              <template slot-scope="scope">
                <el-button type="danger" round icon="el-icon-close" size="mini" @click="deleteNormalItem(scope.$index)"/>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div class="cut-line"/>
      <span slot="footer" class="dialog-footer" style="text-align: center">
        <el-button
          :disabled="normalNumList.length === 0"
          type="primary"
          class="submit-btn"
          @click="handleTransmitDialog"
        ><svg-icon icon-class="xiangyou"/> 传 片</el-button>
        <el-button @click="resetForm('machineForm')">取 消</el-button>
      </span>
    </el-dialog>
    <!--COT异常记录-->
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="exceptionRecordDialog"
      class="padding-dialog"
      title="COT异常记录"
      width="1100px"
      @close="handleClose('siteForm')">
      <div class="input-item" style="margin-top: 0">
        <span class="input-title input-title-short">批次号 </span>
        <el-input v-model="dialogBatchNum" class="search-input search-input-short" style="width: 200px;" placeholder="请输入批次号" size="small" maxlength="50" clearable/>
      </div>
      <div class="input-item" style="margin-top: 0">
        <el-radio-group v-model="abnormalTimeRadio" class="margin-right">
          <el-radio :label="0">测试时间</el-radio>
          <el-radio :label="1">过站时间</el-radio>
        </el-radio-group>
        <el-date-picker
          v-model="beginDateDlg"
          :picker-options="pickerOptionsStartDlg"
          :editable="false"
          class="search-input search-input-short"
          size="small"
          type="date"
          placeholder="开始日期"
          value-format="timestamp"
        />
        <span style="display:inline-block;width: 38px;text-align: center"> 至 </span>
        <el-date-picker
          v-model="endDateDlg"
          :picker-options="pickerOptionsEndDlg"
          :editable="false"
          class="search-input search-input-short"
          size="small"
          type="date"
          placeholder="结束日期"
          value-format="timestamp"
        />
      </div>
      <div class="input-item" style="margin-top: 0">
        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="exceptionRecord" >查 询</el-button>
        <el-button
          size="small"
          type="danger"
          @click="clearDialogSearch"
        >
          <svg-icon icon-class="clear"/> 重 置
        </el-button>
      </div>
      <div class="clear-both"/>
      <el-table
        v-loading="listLoading"
        :data="abnormalList"
        style="margin-top: 10px"
        class="site-table"
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
        <el-table-column align="center" label="WaferID" prop="wafer_no" show-overflow-tooltip/>
        <el-table-column align="center" label="产品代码" prop="productCode" width="85" show-overflow-tooltip/>
        <el-table-column align="center" label="异常原因" prop="reason" width="85" show-overflow-tooltip/>
        <el-table-column align="center" label="测试机台" prop="machine" width="85" show-overflow-tooltip/>
        <el-table-column align="center" label="测试时间" prop="testTime" width="135" show-overflow-tooltip/>
        <el-table-column align="center" label="过站时间" prop="createTime" width="135" show-overflow-tooltip/>
        <el-table-column align="center" label="接片人" prop="createName" width="85" show-overflow-tooltip/>
        <el-table-column align="center" label="原始文件" width="85" show-overflow-tooltip>
          <template slot-scope="scope">
            <div style="color: #009494;text-decoration: underline;cursor: pointer;" @click="downLoadFile(scope.row.filePath)">点击下载</div>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="exceptionRecordDialog = false">关 闭</el-button>
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
  .search-input{
    width: 150px;
  }
  .short-input{
    width: 126px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 265px);
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
    text-align: center;
    line-height: 40px;
    font-weight: bold;
    font-size: 20px;
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
  .left-content{
    border: 1px solid #b2dfdf;
    height: 381px;
    margin-top: 10px;
    padding: 5px 10px 10px 10px;
  }
  .dialog-input{
    width: 265px;
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
    text-align: center;
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
    width: 248px;
  }
</style>
