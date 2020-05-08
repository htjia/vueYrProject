<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0">
      <div v-if="batchOrPlate === 0" class="input-item">
        <span class="input-title svgsty"><svg-icon icon-class="tiaomasm" style="font-size: 20px;color:#009494;margin-right:5px"/> 批号扫描</span>
        <el-input ref="importBatchImput" :autofocus="true" v-model="batchNum" class="search-input" style="width: 260px;" placeholder="请输入批号" size="small" maxlength="50" clearable @keyup.enter.native="handleBatchNoScanning"/>
      </div>
      <div v-if="batchOrPlate === 1" class="input-item">
        <span class="input-title svgsty" style="width: 100px;"><svg-icon icon-class="tiaomasm" style="font-size: 20px;color:#009494;margin-right:5px"/> 盘条码扫描</span>
        <el-input ref="importPlateImput" :autofocus="true" v-model="plateNum" class="search-input" style="width: 260px;" placeholder="请输入盘条码" size="small" maxlength="50" clearable @keyup.enter.native="handlePlatterScanning"/>
      </div>
      <el-radio-group v-model="batchOrPlate" class="float-right" style="margin-top: 25px" @change="radioChange">
        <el-radio :label="0">按批次合并显示</el-radio>
        <el-radio :label="1">按盘合并显示</el-radio>
      </el-radio-group>
      <div class="clear-both"/>
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        v-show="batchOrPlate === 0"
        :data="batchList"
        :span-method="batchSpanMethod"
        element-loading-text="拼命加载中"
        border
        fit>
        <el-table-column label="批号" align="center" prop="batchNo"/>
        <el-table-column label="总片数" align="center" prop="total"/>
        <el-table-column label="上片片数" align="center" prop="sliceNo"/>
        <el-table-column label="上片位置" align="center" prop="platterLocation"/>
        <el-table-column label="所在盘号" align="center" prop="plateNo"/>
        <el-table-column label="盘加工状态" align="center" prop="schedule">
          <template slot-scope="scope">
            <div v-if="scope.row.schedule === 0"> 上片</div>
            <div v-if="scope.row.schedule === 1"> 粘片</div>
            <div v-if="scope.row.schedule === 2"> 研磨</div>
            <div v-if="scope.row.schedule === 3"> 抛光</div>
            <div v-if="scope.row.schedule === 4"> 清洗</div>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-loading="listLoading"
        v-show="batchOrPlate === 1"
        :data="plateList"
        :span-method="plateSpanMethod"
        element-loading-text="拼命加载中"
        border
        fit>
        <el-table-column label="盘号" align="center" prop="plateNo"/>
        <el-table-column label="总片数" align="center" prop="total"/>
        <el-table-column label="批号" align="center" prop="batchNo"/>
        <el-table-column label="上片片数" align="center" prop="sliceNo"/>
        <el-table-column label="上片位置" align="center" prop="platterLocation"/>
        <el-table-column label="盘加工状态" align="center" prop="schedule">
          <template slot-scope="scope">
            <div v-if="scope.row.schedule === 0"> 上片</div>
            <div v-if="scope.row.schedule === 1"> 粘片</div>
            <div v-if="scope.row.schedule === 2"> 研磨</div>
            <div v-if="scope.row.schedule === 3"> 抛光</div>
            <div v-if="scope.row.schedule === 4"> 清洗</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
  .svgsty{
    height: 33px;
    align-items: center;
    justify-content: center;
    align-content: center;
    display: flex;
    float: left;
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
  .input-title{
    width: 87px;
  }
  .input-item{
    float: left;
    margin-top: 14px;
    margin-right: 10px;
  }
  .search-input{
    width: 180px;
  }
  .module-title-text{
    margin-bottom: 10px;
  }
</style>
