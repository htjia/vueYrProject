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
        ><svg-icon icon-class="xiangyou"/> 传片</el-button>
      </div>
      <div style="height: auto">
        <div class="input-item">
          <span class="input-title input-title-short">批次号 </span>
          <el-input v-model="batchNum" class="search-input search-input-short" style="width: 200px;" placeholder="请输入批次号" size="small" maxlength="50" clearable/>
        </div>
        <div class="input-item">
          <span class="input-title input-title-short">型号 </span>
          <el-select v-model="model" class="search-input search-input-short" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in modelList"
              :key="item.code"
              :label="item.code"
              :value="item.code"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title input-title-short">掉电极 </span>
          <el-select v-model="pole" class="search-input search-input-short" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in poleOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <el-radio-group v-model="timeRadio" class="margin-right">
            <el-radio :label="0">接片时间</el-radio>
            <el-radio :label="1">传片时间</el-radio>
          </el-radio-group>
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
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        height="calc(100vh - 342px)"
        class="broad-scrollbar-table"
        element-loading-text="拼命加载中"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="批次号" prop="batchNo" width="180" fixed/>
        <el-table-column align="center" label="型号" prop="model"/>
        <el-table-column align="center" label="片数" prop="piecesNum"/>
        <el-table-column align="center" label="掉电极" prop="isDrop">
          <template slot-scope="scope">
            <span v-if="scope.row.isDrop === 1">是</span>
            <span v-if="scope.row.isDrop === 0">否</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="尺寸" prop="size"/>
        <el-table-column align="center" label="投片类别" prop="pattern"/>
        <el-table-column align="center" label="检验数" prop="testNum"/>
        <el-table-column align="center" label="片位" prop="slicePosition" width="160" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-html="scope.row.slicePosition"/>
          </template>
        </el-table-column>
        <el-table-column align="center" label="接片时间" prop="receiveTime" width="160" show-overflow-tooltip/>
        <el-table-column align="center" label="接片人" prop="receiverName"/>
        <el-table-column align="center" label="备注" prop="receiveRemark" width="160" show-overflow-tooltip/>
        <el-table-column align="center" label="传片时间" prop="deliverTime" width="160" show-overflow-tooltip/>
        <el-table-column align="center" label="传片人" prop="deliverName"/>
        <el-table-column align="center" label="备注" prop="deliverRemark" width="160" show-overflow-tooltip/>
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
          <el-input :disabled="true" value="拉力测试" class="search-input-scan" size="small" maxlength="20" clearable/>
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
          <div class="left-content" style="height:380px">
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
      @close="handleClose">
      <div class="dialog-sub-title"><svg-icon icon-class="jiepianTitle"/> 过站录入-传片</div>
      <div class="overflow-hidden input-container">
        <div class="input-item" style="margin-top: 0;">
          <span class="input-title"><svg-icon icon-class="tiaomasm" style="font-size: 20px;color:#009494"/> 批号扫描 </span>
          <el-input ref="importInputCp" :autofocus="true" v-model="cBatchNum" class="search-input-scan" placeholder="请输入批号" size="small" maxlength="50" clearable @keyup.enter.native="handleDeliverInput"/>
        </div>
        <div class="input-item" style="margin-top: 0;">
          <span class="input-title-short"><svg-icon icon-class="zhandiangl" style="font-size: 20px;color:#009494"/> 站点 </span>
          <el-input :disabled="true" value="拉力测试" class="search-input-scan" size="small" maxlength="20" clearable/>
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
          <span style="float: right;margin-top: 5px;font-weight: bold;color: #e47744">Total: {{ receiveList.length }} 批, {{ totalNum }}片</span>
          <span class="module-title-text" style="float:none;display:inline-block;margin-top: 6px;margin-bottom: 5px">
            批次信息
          </span>
          <el-table
            ref="leftTable"
            :data="receiveList"
            style="margin-top: 10px"
            class="site-table"
            highlight-current-row
            element-loading-text="拼命加载中"
            border
            fit
            @row-click="leftRowClick">
            <el-table-column align="center" label="序号" width="40">
              <template slot-scope="scope">
                {{ scope.$index+1 }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="批次号" prop="batchNo"/>
            <el-table-column align="center" label="片数" prop="total" width="40"/>
            <el-table-column align="center" label="操作" width="40">
              <template slot-scope="scope">
                <el-button type="danger" round icon="el-icon-close" size="mini" @click="deleteItem(scope.$index)"/>
              </template>
            </el-table-column>
          </el-table>
          <div class="module-title-text" style="float:none;margin-top: 15px; margin-bottom: 10px">基本信息</div>
          <div class="left-content" style="height:247px">
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
            :disabled="totalNum === 0"
            class="float-right margin-left"
            type="danger"
            size="mini"
            @click="handleReporting"
          ><svg-icon icon-class="baojingguiz"/> 异常上报</el-button>
          <span style="float: right;margin-top: 5px;font-weight: bold;color: #e47744">Total: {{ rightList.length }}片</span>
          <span class="module-title-text" style="float:none;display:inline-block;margin-top: 6px;margin-bottom: 5px">
            盒内信息({{ batchNo }})
          </span>
          <el-table
            :data="rightList"
            style="margin-top: 10px"
            class="site-table"
            height="380"
            element-loading-text="拼命加载中"
            border
            fit
            stripe>
            <el-table-column label="" align="center" prop="status" width="70">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.status" @change="switchChange(scope.row)"/>
              </template>
            </el-table-column>
            <el-table-column align="center" label="位次号" prop="sequence" width="70"/>
            <el-table-column align="center" label="WaferID" prop="waferNo" width="200"/>
            <el-table-column align="center" label="是否掉电极" width="100">
              <template slot-scope="scope">
                <el-select v-if="scope.row.status" v-model="scope.row.pole" style="width: 100%;" size="mini" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in poleOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="备注" align="center">
              <template slot-scope="scope">
                <el-input v-if="scope.row.status" v-model="scope.row.remark" size="mini" style="width: 100%;"/>
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
          @click="handleTransmitSubmit"
        ><svg-icon icon-class="xiangyou"/> 传 片</el-button>
        <el-button @click="resetForm('machineForm')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="batchDialogVisible"
      class="padding-dialog"
      title="拆批数据"
      width="1000px"
      @close="handleClose('siteForm')">
      <el-table
        v-loading="listLoading"
        :data="list"
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
        <el-table-column align="center" label="批次号"/>
        <el-table-column align="center" label="总片数"/>
        <el-table-column align="center" label="已处理数"/>
        <el-table-column align="center" label="待处理数"/>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-upload2" size="mini">上片</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="batchDialogVisible = false">关 闭</el-button>
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
            :data="receiveList"
            element-loading-text="拼命加载中"
            height="390"
            highlight-current-row
            border
            fit
            @row-click="rowClick"
          >
            <el-table-column label="" align="center" prop="status" width="55">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.abnormalStatus" @change="abnormalChange(receiveList)"/>
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
  .app-container>>> .cell{
    line-height: 37px;
  }
  .app-container>>> td{
    height: 37px;
  }
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
  .input-title{
    width: 65px;
  }
  .left-content{
    border: 1px solid #b2dfdf;
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
  .padding-dialog>>>.el-checkbox {
    margin-left: 0px;
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
