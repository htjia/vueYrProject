<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto">
      <div class="header-btn-group">
        <el-button
          :disabled="list.length === 0"
          style="float: left;"
          size="small"
          type="primary"
          @click="handleRetreat"
        ><svg-icon icon-class="xuanzexx"/> 完成退库</el-button>
        <el-button v-loading="loading" slot="trigger" size="small" type="primary" @click="handleImport"><svg-icon icon-class="daoru"/>  外部片源导入</el-button>
        <el-button
          class="float-right"
          size="small"
          type="primary"
          @click="viewRecord"
        ><svg-icon icon-class="rukujl"/> 退库记录</el-button>
        <div class="clear-both"/>
      </div>
      <div style="height: auto;">
        <div class="input-item">
          <div>
            <span class="input-title">退库单号 </span>
            <el-input :disabled="true" v-model="backStorageNo" class="search-input" placeholder="请输入退库单号" size="small" maxlength="20" clearable/>
          </div>
          <div style="margin-top: 10px">
            <span class="input-title">退库日期 </span>
            <el-date-picker
              v-model="putInTime"
              class="search-input-long"
              type="date"
              size="small"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            />
          </div>
        </div>
        <div class="input-item">
          <div>
            <span class="input-title">退库片型 </span>
            <el-select v-model="sliceType" class="search-input-long" size="small" filterable>
              <el-option
                v-for="item in receiptsOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div style="margin-top: 10px">
            <span class="input-title">制单人 </span>
            <el-input :disabled="true" v-model="maker" class="search-input" placeholder="请输入制单人" size="small" maxlength="20" clearable/>
          </div>
        </div>
        <div class="input-item">
          <div>
            <span class="input-title">退库方式 </span>
            <el-select v-model="backType" class="search-input-long" size="small" filterable @change="backTypeChange">
              <el-option
                v-for="item in backhouseType"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div style="margin-top: 10px">
            <div style="position:relative;">
              <span class="input-title">柜位 </span>
              <el-select v-model="cabinet" class="search-input-short" style="width: 100px" size="small" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in cabinetList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
              <div style="position: absolute;right: 0;top: 3px;">
                <span @click="cabinetClick"><svg-icon style="color: #80cac9; font-size: 25px;cursor: pointer;" icon-class="guiweigl"/></span>
                <div v-if="cabinetDetailShow" style="position: absolute;top: -3px;left: 30px; width: 400px;height: 300px;z-index: 10">
                  <el-table
                    ref="boxTable"
                    :data="cabinetList"
                    class="popTable"
                    element-loading-text="拼命加载中"
                    max-height="300"
                    border
                  >
                    <el-table-column label="柜位" align="center" prop="name" width="100"/>
                    <el-table-column label="存储量" align="center" prop="count">
                      <template slot-scope="scope">
                        <span>{{ (scope.row.count === null ? 0 : scope.row.count) + '/' + scope.row.capacity + '片' }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="剩余可存量" align="center" prop="count">
                      <template slot-scope="scope">
                        <span v-if="(scope.row.capacity - scope.row.count) > 0">{{ (scope.row.capacity - scope.row.count) + '片' }}</span>
                        <span v-else>0片</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="input-item" style="margin-right: 0">
          <div>
            <span class="input-title">出库单号 </span>
            <el-input :disabled="backType === 2" v-model="outStorageNo" class="search-input" style="width: 210px;" placeholder="请输入出库单号" size="small" maxlength="30" clearable @keyup.enter.native="handleSearch()"/>
            <el-button
              :disabled="backType === 2"
              class="margin-left"
              size="small"
              type="primary"
              icon="el-icon-search"
              @click="handleSearch" >查询</el-button>
          </div>
          <div style="margin-top: 10px">
            <span class="input-title">备注 </span>
            <el-input v-model="remark" class="search-input" style="width: 300px;" size="small" maxlength="20" clearable/>
          </div>
        </div>
        <div class="input-item" style="margin-right: 0">
          <div style="line-height: 45px">
            <el-checkbox v-model="isPrint">打印包标签</el-checkbox>
          </div>
          <div>
            <el-checkbox v-model="isPrintSequence">打印项次标签</el-checkbox>
          </div>
        </div>
        <div class="clear-both"/>
        <div class="cut-line" style="margin-bottom: 0px"/>
        <div>
          <div class="input-item">
            <span class="input-title"> 送片扫描 </span>
            <el-input v-model="waferNo" class="search-input" style="width: 280px;" size="small" maxlength="50" clearable @keyup.enter.native="handleSelectItem"/>
          </div>
          <div class="input-item">
            <el-button
              :disabled="backType === 2"
              size="small"
              type="primary"
              @click="fullScan"
            >
              <svg-icon icon-class="tiaomasm"/> 一键全扫
            </el-button>
          </div>
          <div>
            <div class="input-item" style="margin-right: 10px;margin-top: 15px;float: right;">
              <span class="input-title"> Total </span>
              <el-input :disabled="true" v-model="list.length" class="search-input" style="width: 60px;" size="small"/>
              <span class="fontBold" >片</span>
              <el-input :disabled="true" v-model="chipCount" class="search-input" style="width: 100px;" size="small"/>
              <span class="fontBold" >K</span>
            </div>
            <div class="input-item" style="margin-right: 10px;margin-top: 15px;float: right;">
              <span class="input-title"> 每包片数 </span>
              <el-input v-model="sliceNum" class="search-input" style="width: 80px;" onkeyup="this.value=this.value.replace(/[^\d]/g,'')" size="small" maxlength="3" clearable/>
              <span class="fontBold" >片</span>
            </div>
          </div>
          <div class="clear-both"/>
        </div>
      </div>
    </div>
    <div class="app-container">
      <!--wafer信息-->
      <pl-table
        v-show="sliceType === 0"
        :key="tableKey"
        :row-style="rowStyle"
        :datas="list"
        :row-height="37"
        header-drag-style
        use-virtual
        height="100%"
        class="broad-scrollbar-table"
        element-loading-text="拼命加载中"
        border
        fit
      >
        <pl-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </pl-table-column>
        <pl-table-column label="WaferID" align="center" prop="code" width="260" fixed show-overflow-tooltip/>
        <pl-table-column label="TapeNo" align="center" prop="tapeNo" width="180" fixed show-overflow-tooltip/>
        <pl-table-column v-for="item in formTheadStore" v-if="item.thName !== 'TapeNo' && item.thName !== 'WaferID'" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[item.thKey] }}
          </template>
        </pl-table-column>
        <pl-table-column v-for="item in reservedFields" :key="item.id" :label="item.name" :prop="item.code" width="120" align="center" show-overflow-tooltip/>
        <pl-table-column v-for="item in formTheadStoreParams" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[item.thKey] }}
          </template>
        </pl-table-column>
      </pl-table>
      <pl-table
        v-show="sliceType === 1"
        :key="tableKey2"
        :row-style="rowStyle"
        :datas="list"
        :row-height="37"
        header-drag-style
        use-virtual
        height="100%"
        class="broad-scrollbar-table"
        element-loading-text="拼命加载中"
        border
        fit
      >
        <pl-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </pl-table-column>
        <pl-table-column label="ChipNo" align="center" prop="code" width="260" fixed show-overflow-tooltip/>
        <pl-table-column label="TapeNo" align="center" prop="tapeNo" width="180" fixed show-overflow-tooltip/>
        <pl-table-column v-for="item in formTheadfStore" v-if="item.thName !== 'TapeNo' && item.thName !== 'ChipNo'" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[item.thKey] }}
          </template>
        </pl-table-column>
        <pl-table-column v-for="item in reservedFields" :key="item.id" :label="item.name" :prop="item.code" width="120" align="center" show-overflow-tooltip/>
        <pl-table-column v-for="item in formTheadfStoreParams" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[item.thKey] }}
          </template>
        </pl-table-column>
      </pl-table>
    </div>
    <!--选择方圆片-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="importDialogVisible"
      class="select-dialog"
      title="请选择片型"
      width="500px"
      @close="handleClose">
      <el-radio-group v-model="importSliceType">
        <el-radio :label="0">圆片</el-radio>
        <el-radio :label="1">方片</el-radio>
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <el-button class="float-right margin-left" size="small" @click="importDialogVisible = false">取 消</el-button>
        <el-upload
          ref="upload"
          :auto-upload="true"
          :on-success="onSuccess"
          :on-error="onError"
          :action="importSliceType === 0 ? fileYpUrl : fileFpUrl"
          :show-file-list="false"
          :before-upload="beforeUpload"
          :with-credentials="true"
          style="float: right;"
          accept=".xls,.xlsx"
          class="upload-demo"
        >
          <el-button v-loading="loading" slot="trigger" size="small" type="primary"> 确 定</el-button>
        </el-upload>
        <div class="clear-both"/>
      </span>
    </el-dialog>
    <!--退库记录-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="recordDialogVisible"
      top="80px"
      class="send-dialog broad-scrollbar-table"
      title="退库记录"
      width="1310px"
      @close="handleCloseDialog">
      <div class="search-box" style="padding-bottom: 15px;overflow: hidden">
        <div class="left-search-box">
          <div class="input-item">
            <span class="input-title" style="width: 40px;">单号</span>
            <el-input v-model="listNo" class="search-input" style="width: 180px;" placeholder="请输入单号" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">退库日期</span>
            <el-date-picker
              v-model="beginDate"
              :picker-options="pickerOptionsStart"
              :editable="false"
              class="search-input"
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
          </div>
        </div>
        <div class="right-btn-box" style="margin-top: 3px">
          <el-button
            class="margin-left"
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="handleDialogSearch(2)"
          >查 询
          </el-button>
          <el-button
            class="margin-top margin-left"
            size="small"
            type="danger"
            @click="clearDialogSearch" > <svg-icon icon-class="clear"/> 重 置</el-button>
        </div>
      </div>
      <div class="cut-line" style="margin-top: 0"/>
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
        <el-button
          :disabled="recordList.length === 0"
          class="float-right"
          size="small"
          type="primary"
          @click="handleExport"
        ><svg-icon icon-class="export"/> 导 出
        </el-button>
        <el-button
          :disabled="recordList.length === 0"
          class="float-right margin-right"
          size="small"
          type="primary"
          @click="printSeqFun"
        ><svg-icon icon-class="print"/> 打印项次号标签
        </el-button>
        <el-button
          :disabled="recordList.length === 0"
          class="float-right"
          size="small"
          type="primary"
          @click="printBoxFun"
        ><svg-icon icon-class="print"/> 打印包号标签
        </el-button>
      </div>
      <!--run信息-->
      <el-table
        v-loading="listLoading"
        v-show="isActive === 0"
        ref="runTable"
        :data="recordList"
        height="500px"
        class="mocvd-table"
        element-loading-text="拼命加载中"
        highlight-current-row
        border
        fit
        @row-click="recordRowClick"
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="退库单号" align="center" prop="billNo" width="120" show-overflow-tooltip/>
        <el-table-column label="退库类型" align="center" prop="backType" width="120" show-overflow-tooltip/>
        <el-table-column label="退库片型" align="center" prop="type" width="70" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.sliceType === 1" style="font-weight: bold;color: #f56c6c">方片</span>
            <span v-if="scope.row.sliceType === 0" style="font-weight: bold;color: #009494">圆片</span>
          </template>
        </el-table-column>
        <el-table-column label="项次号" align="center" prop="seqNo" width="110" show-overflow-tooltip/>
        <el-table-column label="柜位" align="center" prop="arkName" width="50" show-overflow-tooltip/>
        <el-table-column label="产品型号" align="center" prop="taskModel" width="100" show-overflow-tooltip/>
        <el-table-column label="类型" align="center" prop="model" width="70" show-overflow-tooltip/>
        <el-table-column label="光色" align="center" prop="color" width="50" show-overflow-tooltip/>
        <el-table-column label="型号" align="center" prop="model" width="60" show-overflow-tooltip/>
        <el-table-column label="尺寸" align="center" prop="size" width="60" show-overflow-tooltip/>
        <el-table-column label="外观等级" align="center" prop="classify" width="70" show-overflow-tooltip/>
        <el-table-column label="制单人" align="center" prop="creator" width="120" show-overflow-tooltip/>
        <el-table-column label="制单日期" align="center" prop="createTime" width="100" show-overflow-tooltip/>
        <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip/>
      </el-table>
      <!--wafer信息-->
      <div v-if="isActive === 1" style="height: 500px;" class="table-container">
        <pl-table
          v-show="isActive === 1 && sliceType === 0"
          :datas="recordWaferList"
          :row-height="37"
          header-drag-style
          use-virtual
          height="500px"
          class="broad-scrollbar-table"
          element-loading-text="拼命加载中"
          border
          fit
        >
          <pl-table-column align="center" label="序号" width="50" fixed>
            <template slot-scope="scope">
              {{ (pageNum - 1) * pageSize + scope.$index+1 }}
            </template>
          </pl-table-column>
          <pl-table-column label="包号" align="center" prop="boxNo" width="130" fixed show-overflow-tooltip/>
          <pl-table-column label="项次号" align="center" prop="sequence" width="100" fixed show-overflow-tooltip/>
          <pl-table-column v-for="item in formTheadRecprdStore" v-if="item.thName !== '包号'&&item.thName !== '项次号'" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[item.thKey] }}
            </template>
          </pl-table-column>
          <pl-table-column v-for="item in reservedFields" :key="item.id" :label="item.name" :prop="item.code" width="120" align="center" show-overflow-tooltip/>
          <pl-table-column v-for="item in formTheadStoreParams" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[item.thKey] }}
            </template>
          </pl-table-column>
        </pl-table>
        <pl-table
          v-show="isActive === 1 && sliceType === 1"
          :row-style="rowStyle"
          :datas="recordWaferList"
          :row-height="37"
          header-drag-style
          use-virtual
          height="500px"
          class="broad-scrollbar-table"
          element-loading-text="拼命加载中"
          border
          fit
        >
          <pl-table-column align="center" label="序号" width="50" fixed>
            <template slot-scope="scope">
              {{ (pageNum - 1) * pageSize + scope.$index+1 }}
            </template>
          </pl-table-column>
          <pl-table-column label="包号" align="center" prop="boxNo" width="130" fixed show-overflow-tooltip/>
          <pl-table-column label="项次号" align="center" prop="sequence" width="100" fixed show-overflow-tooltip/>
          <pl-table-column v-for="item in formTheadfRecprdStore" v-if="item.thName !== '包号'&&item.thName !== '项次号'" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[item.thKey] }}
            </template>
          </pl-table-column>
          <pl-table-column v-for="item in reservedFields" :key="item.id" :label="item.name" :prop="item.code" width="120" align="center" show-overflow-tooltip/>
          <pl-table-column v-for="item in formTheadfStoreParams" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[item.thKey] }}
            </template>
          </pl-table-column>
        </pl-table>
      </div>
      <el-pagination
        v-if="isActive === 0"
        :current-page="pageNum"
        :page-sizes="[15, 25, 50]"
        :page-size="pageSize"
        :total="totalPage"
        class="pagination"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="recordSizeChange"
        @current-change="recordCurrentChange"
      />
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .table-top-btn-group{
    overflow: hidden;
    border-bottom: 2px solid #009494;
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
  .table-top-btn-group>div.active{
    color: #fff;
    background: #009494;
    border-color: #009494;
  }
  .broad-scrollbar-table>>> .cell{
    line-height: 37px;
  }
  .broad-scrollbar-table>>> td{
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
    height: calc(100vh - 365px);
  }
  .app-container>>> .el-table--scrollable-x{
    height: calc(100vh - 390px) !important;
  }
  .table-container>>> .el-table--scrollable-x{
    height:550px !important;
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
    text-align: center;
    font-weight: bold;
    font-size: 26px;
    color: #009494;
  }
  .cut-line{
    border-bottom: 1px solid #e2e2e2;
    margin-bottom: 10px;
    margin-top: 10px;
  }
  .left-content{
    border: 1px solid #b2dfdf;
    margin-top: 10px;
    padding: 5px 10px 10px 10px;
  }
  .dialog-input{
    width: 300px;
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
    width: 130px;
  }
  .module-title-text{
    margin-bottom: 10px;
  }
  .search-input{
    width: 140px;
  }
  .search-input-long{
    width: 140px;
  }
  .input-title{
    width: 65px;
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
  .abnormal-cause{
    position: absolute;
    width: 105px;
    top: 63px;
    background: #fff;
    right: 13px;
  }
  .send-dialog>>>.el-dialog__body{
    padding: 15px;
    padding-top: 10px;
    padding-bottom: 60px;
  }
  .send-dialog .input-item{
    margin-right: 15px;
  }
</style>
