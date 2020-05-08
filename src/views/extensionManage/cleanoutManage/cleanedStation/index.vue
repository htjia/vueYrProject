<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto">
      <div class="header-btn-group">
        <!-- <el-button
          size="small"
          type="primary"
          @click="handleReceive"
        > <svg-icon icon-class="xiangzuo"/> 接片</el-button> -->
        <el-button
          size="small"
          type="primary"
          @click="handleTransmit"
        ><svg-icon icon-class="chuanpian"/> 过站</el-button>
        <el-button
          class="float-right"
          size="small"
          type="primary"
          @click="exportExcel" >
          <svg-icon icon-class="export"/>
          导 出</el-button>
      </div>
      <div style="height: 45px;">
        <div class="input-item">
          <span class="input-title" style="width: 50px;">批次号 </span>
          <el-input v-model="batchNum" class="search-input" style="width: 220px;" placeholder="请输入批次号" size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item">
          <span class="input-title" style="width: 50px;">时间 </span>
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
        class="site-table"
        element-loading-text="拼命加载中"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="wafer_Id" prop="waferNo" width="200"/>
        <el-table-column align="center" label="产品代码" prop="productModel"/>
        <el-table-column align="center" label="过站时间" prop="createTime" width="" show-overflow-tooltip/>
        <el-table-column align="center" label="过站人" prop="creatorName"/>
        <el-table-column align="center" label="备注" prop="remark"/>
        <!-- <el-table-column align="center" label="传片时间" prop="deliverTime" width="100" show-overflow-tooltip/>
        <el-table-column align="center" label="传片人" prop="deliverName"/>
        <el-table-column align="center" label="备注" prop="deliverRemark"/>
        <el-table-column align="center" label="原始文件" width="120" show-overflow-tooltip> -->
        <!-- <template slot-scope="scope">
            <div style="color: #009494;text-decoration: underline;cursor: pointer;" @click="downLoadFile(scope.row.filePath)">点击下载</div>
          </template> -->
        <!-- </el-table-column> -->
      </el-table>
      <el-pagination
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
    <!--接片-->
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="receiveDialogVisible"
      class="padding-dialog"
      title="过站录入"
      width="1000px"
      @close="handleClose">
      <div class="dialog-sub-title"><svg-icon icon-class="jiepianTitle"/> 清洗过站</div>
      <div class="overflow-hidden input-container">
        <div class="input-item" style="margin-top: 0;float: none;">
          <span class="input-title"><svg-icon icon-class="tiaomasm" style="font-size: 20px;color:#009494"/> 批号扫描 </span>
          <el-input
            ref="importInputJp"
            :autofocus="true"
            v-model="jBatchNum"
            class="search-input"
            style="width: 260px;"
            placeholder="请输入批号"
            size="small"
            maxlength="20"
            clearable
            @blur="handleReceiveInput()"/>
        </div>
        <!-- @keyup.enter.native="handleReceiveInput"  -->
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
          <span style="float: right;margin-top: 5px;font-weight: bold;color: #e47744">Total: {{ receiveList.length }} 批, {{ totalNum }}片</span>
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
            <el-table-column align="center" label="片数" prop="slicesNum"/>
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
          :disabled="totalNum === 0"
          type="primary"
          class="submit-btn"
          @click="handleReceiveDialog"
        ><svg-icon icon-class="xiangzuo"/> 接片</el-button>
        <el-button @click="receiveDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!--传片-->
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="transmitDialogVisible"
      class="padding-dialog"
      title="过站录入"
      width="1000px">
      <div class="dialog-sub-title"><svg-icon icon-class="jiepianTitle"/> 过站录入-传片</div>
      <div class="overflow-hidden input-container">
        <div class="input-item" style="margin-top: 0;float: none;">
          <span class="input-title"><svg-icon icon-class="tiaomasm" style="font-size: 20px;color:#009494"/> 批号扫描 </span>
          <el-input
            ref="importInputCp"
            :autofocus="true"
            v-model="cBatchNum"
            class="search-input"
            style="width: 260px;"
            placeholder="请输入批号"
            size="small"
            maxlength="20"
            clearable
            @change="handleDeliverInput"/>
            <!-- @keyup.enter.native="handleDeliverInput" -->
        </div>
      </div>
      <el-row :gutter="15">
        <el-col :span="8">
          <div class="module-title-text" style="float:none;margin-bottom: 15px">接片信息</div>
          <div class="left-content">
            <span class="input-title" style="margin-top: 15px; width: 50px">操作员 </span>
            <el-select v-model="cOperator" class="dialog-input" size="small" placeholder="请选择" filterable>
              <el-option
                v-for="item in userOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
            <span class="input-title" style="line-height: 60px; width: 50px;">备注 </span>
            <el-input v-model="cRemarkLeft" class="dialog-input" style="margin-top: 15px" placeholder="请输入备注" type="textarea" maxlength="50" clearable/>
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
          <span style="float: right;margin-top: 5px;font-weight: bold;color: #e47744">Total: {{ receiveList.length }} 批, {{ totalNum }}片</span>
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
          :disabled="totalNum === 0"
          type="primary"
          class="submit-btn"
          @click="handleTransmitDialog"
        ><svg-icon icon-class="xiangyou"/> 传 片</el-button>
        <el-button @click="transmitDialogVisible = false">取 消</el-button>
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
    line-height: 40px;
    font-weight: bold;
    font-size: 20px;
    text-align: center;
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
    width: 232px;
  }
  .dialog-input-base{
    width: 217px;
  }
  .dialog-input-short{
    width: 182px;
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
    text-align: center;
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
</style>
