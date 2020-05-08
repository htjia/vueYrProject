<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto">
      <div class="header-btn-group">
        <el-button
          size="small"
          type="primary"
          @click="handleAdd"
        ><svg-icon icon-class="xuanzexx"/> 完成退库</el-button>
        <el-button
          class="float-right"
          size="small"
          type="primary"
          @click="viewBackInfo"
        ><svg-icon icon-class="shenheth"/> 退库记录</el-button>
      </div>
      <div style="height: auto;">
        <div class="input-item">
          <div>
            <span class="input-title">退库单号 </span>
            <el-input :disabled="true" v-model="listNum" class="search-input search-input-short" size="small" maxlength="20" clearable/>
          </div>
          <div style="margin-top: 10px">
            <span class="input-title">制单人 </span>
            <el-input :disabled="true" v-model="creater" class="search-input search-input-short" size="small" maxlength="20" clearable/>
          </div>
        </div>
        <div class="input-item">
          <div>
            <span class="input-title">退库类型 </span>
            <el-select v-model="listType" class="search-input search-input-short" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in backOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div style="margin-top: 10px">
            <span class="input-title">客户名称 </span>
            <el-select v-model="customerName" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in customerList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
        </div>
        <div class="input-item" style="width: 600px;">
          <div>
            <span class="input-title">制单日期 </span>
            <el-date-picker
              v-model="createTime"
              class="search-input search-input-short"
              type="date"
              size="small"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            />
            <span class="input-title" style="margin-left: 20px">退库方式 </span>
            <el-select v-model="backType" class="search-input search-input-short" size="small" placeholder="请选择" filterable @change="backTypeChange">
              <el-option
                v-for="item in processOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
            <el-button
              style="margin-left: 30px"
              size="mini"
              type="primary"
              @click="handleCreateBoxNo"
            >确 定</el-button>
          </div>
          <div class="margin-top">
            <span class="input-title">备注 </span>
            <el-input v-model="backRemark" class="search-input" style="width: 373px;" type="text" size="small" maxlength="50" clearable/>
            <el-checkbox v-model="isPrint">打印标签</el-checkbox>
          </div>
        </div>
        <div class="clear-both"/>
      </div>
    </div>
    <div class="app-container">
      <div class="input-item" style="margin-top: 0;margin-bottom: 10px;float: none">
        <el-select v-model="selectType" class="search-input" style="width: 140px;" size="small" placeholder="请选择" filterable @change="selectedChange">
          <el-option
            v-for="item in selectOption"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
        <el-input :disabled="moreWafer" v-model="inputValue" class="search-input search-input-short" size="small" maxlength="20" clearable style="width: 220px;"/>
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
          <svg-icon icon-class="clear"/> 清空列表
        </el-button>
      </div>
      <div style="height: 92%" class="table-container">
        <pl-table
          v-loading="listLoading"
          :datas="list"
          :row-height="37"
          class="broad-scrollbar-table"
          element-loading-text="拼命加载中"
          header-drag-style
          use-virtual
          border
          fit
        >
          <pl-table-column align="center" label="序号" width="50" fixed>
            <template slot-scope="scope">
              {{ scope.$index+1 }}
            </template>
          </pl-table-column>
          <pl-table-column align="center" label="RunID" prop="runId" width="120" show-overflow-tooltip fixed/>
          <pl-table-column align="center" label="WaferID" prop="waferId" width="120" show-overflow-tooltip fixed/>
          <pl-table-column align="center" label="出库盒号" prop="ckBoxNo" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="出库片位" prop="ckSequence" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="柜位" prop="arkName" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="入库盒号" prop="boxNo" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="入库片位" prop="sequence" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="衬底工艺" prop="subType" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="衬底厂家" prop="supplier" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="镭刻号" prop="laserMark" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="目检" prop="inspection" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="PL_WD" prop="plWd" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="PL_WD_STD" prop="plWtd" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="PL.I.I" prop="plIi" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="PL.I.I.Std" prop="plIiStd" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="PL_PD" prop="plPd" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="PL_Ref" prop="plRef" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="LOP(460)" prop="lop460" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="综合判定" prop="judge" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="ESD(200)" prop="esd200v" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="ESD去坏(50V)" prop="esd50v" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="综合良率" prop="yield" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="VF1 Yield" prop="vf1Yield" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="Ir Yield" prop="lrYield" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="VZ Yield" prop="vzYield" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="VF1" prop="vf1" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="VF2" prop="vf2" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="WLD1" prop="wld" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="Ir" prop="lr" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="VZ" prop="vz" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="IV" prop="iv" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="WLD(PL-COW)" prop="kVal" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="预估COW波长" prop="cowWd" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="ESD(400)" prop="esd400" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="验证版型" prop="yzType" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="生产类型" prop="product" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="IR<0.2 yield" prop="yieldIr02" width="140" show-overflow-tooltip/>
          <pl-table-column align="center" label="Recipe_Name" prop="recipe" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="外延盒号" prop="wyBoxNo" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="HW" prop="hw1" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="B.S" prop="bs" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="目检原因" prop="visualReason" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="光色" prop="color" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="衬底类型" prop="sub" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="机台" prop="machine" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="ESD去坏（500V）" prop="esd500" width="140" show-overflow-tooltip/>
          <pl-table-column align="center" label="ESD去坏（300V）" prop="esd300" width="140" show-overflow-tooltip/>
          <pl-table-column align="center" label="BOW" prop="bow" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="PLINT_STD" prop="plintStd" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="Avg_Vf4" prop="avgVf4" width="120" show-overflow-tooltip/>
          <pl-table-column align="center" label="Thyristor良率" prop="thyristor" width="120" show-overflow-tooltip/>
        </pl-table>
      </div>
    </div>
    <!--退库记录-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="recordDialogVisible"
      top="80px"
      class="send-dialog broad-scrollbar-table"
      title="退库记录"
      width="1310px"
      @close="handleCloseSendDialog">
      <div class="search-box" style="padding-top: 0px;overflow: hidden">
        <div class="input-item" style="margin-top: 10px">
          <span class="input-title" style="width: 40px;">单号</span>
          <el-input v-model="listNumDialog" class="search-input-short" placeholder="请输入单号" size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item" style="margin-top: 10px">
          <span class="input-title">WaferID</span>
          <el-input v-model="WaferID" class="search-input-short" placeholder="请输入WaferID" size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item" style="margin-top: 10px">
          <span class="input-title">制单时间</span>
          <el-date-picker
            v-model="beginDate"
            :picker-options="pickerOptionsStart"
            :editable="false"
            class="search-input-short"
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
            class="search-input-short"
            size="small"
            type="date"
            placeholder="选择结束日期"
            value-format="timestamp"
          />
        </div>
        <el-button
          class="margin-top margin-left"
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="handleDialogSearch"
        >查 询
        </el-button>
        <el-button
          class="margin-top margin-left"
          size="small"
          type="danger"
          @click="clearDialogSearch" > <svg-icon icon-class="clear"/> 重 置</el-button>
        <el-button
          class="margin-top margin-left"
          size="small"
          type="primary"
          @click="handleDialogPrint"
        ><svg-icon icon-class="print"/> 打 印
        </el-button>
        <el-button
          class="margin-top margin-left"
          size="small"
          type="primary"
          @click="handleExport"
        ><svg-icon icon-class="export"/> 导 出
        </el-button>
      </div>
      <div class="cut-line"/>
      <div class="table-top-btn-group">
        <div
          :class="{'active':isActive === 0}"
          @click="navClick(0)"
        >
          单据
        </div>
        <div
          :class="{'active':isActive === 1}"
          @click="navClick(1)"
        >
          Wafer TOL: <span v-text="waferTol"/>
        </div>
      </div>
      <!--run信息-->
      <el-table
        v-loading="listLoading"
        v-show="isActive === 0"
        ref="runTable"
        :data="dialogList"
        height="500px"
        class="mocvd-table"
        element-loading-text="拼命加载中"
        highlight-current-row
        border
        fit
        @row-click="rowClick"
        @row-dblclick="cellDblclick"
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="单号" align="center" prop="billNo" show-overflow-tooltip/>
        <el-table-column label="退库类型" align="center" prop="billTypeName" show-overflow-tooltip/>
        <el-table-column label="客户名称" align="center" prop="customerName" show-overflow-tooltip/>
        <el-table-column label="制单人" align="center" prop="userName" show-overflow-tooltip/>
        <el-table-column label="制单日期" align="center" prop="createTime" show-overflow-tooltip/>
        <el-table-column label="备注" align="center" prop="alnTaskId" show-overflow-tooltip/>
      </el-table>
      <!--wafer信息-->
      <el-table
        v-loading="listLoading"
        v-show="isActive === 1"
        :data="waferList"
        class="mocvd-table"
        height="500px"
        element-loading-text="拼命加载中"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="RunID" prop="runId" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="WaferID" prop="waferId" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="出库盒号" prop="ckBoxNo" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="出库片位" prop="ckSequence" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="柜位" prop="arkName" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="入库盒号" prop="boxNo" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="入库片位" prop="sequence" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="衬底工艺" prop="subType" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="衬底厂家" prop="supplier" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="镭刻号" prop="laserMark" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="目检" prop="inspection" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="PL_WD" prop="plWd" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="PL_WD_STD" prop="plWtd" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="PL.I.I" prop="plIi" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="PL.I.I.Std" prop="plIiStd" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="PL_PD" prop="plPd" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="PL_Ref" prop="plRef" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="LOP(460)" prop="lop460" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="综合判定" prop="judge" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="ESD(200)" prop="esd200v" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="ESD去坏(50V)" prop="esd50v" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="综合良率" prop="yield" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="VF1 Yield" prop="vf1Yield" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="Ir Yield" prop="lrYield" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="VZ Yield" prop="vzYield" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="VF1" prop="vf1" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="VF2" prop="vf2" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="WLD1" prop="wld" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="Ir" prop="lr" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="VZ" prop="vz" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="IV" prop="iv" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="WLD(PL-COW)" prop="kVal" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="预估COW波长" prop="cowWd" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="ESD(400)" prop="esd400" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="验证版型" prop="yzType" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="生产类型" prop="product" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="IR<0.2 yield" prop="yieldIr02" width="140" show-overflow-tooltip/>
        <el-table-column align="center" label="Recipe_Name" prop="recipe" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="外延盒号" prop="wyBoxNo" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="HW" prop="hw1" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="B.S" prop="bs" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="目检原因" prop="visualReason" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="光色" prop="color" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="衬底类型" prop="sub" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="机台" prop="machine" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="ESD去坏（500V）" prop="esd500" width="140" show-overflow-tooltip/>
        <el-table-column align="center" label="ESD去坏（300V）" prop="esd300" width="140" show-overflow-tooltip/>
        <el-table-column align="center" label="BOW" prop="bow" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="PLINT_STD" prop="plintStd" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="Avg_Vf4" prop="avgVf4" width="120" show-overflow-tooltip/>
        <el-table-column align="center" label="Thyristor良率" prop="thyristor" width="120" show-overflow-tooltip/>
      </el-table>
      <el-pagination
        v-if="isActive === 0"
        :current-page="pageNum"
        :page-sizes="[12, 25, 50]"
        :page-size="pageSize"
        :total="totalPage"
        class="pagination"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </el-dialog>
    <!--逐片退库-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="moreWaferDialogVisable"
      class="padding-dialog"
      title="逐片退库"
      width="600px"
    >
      <el-radio-group v-model="selectRadio">
        <el-radio :label="1">Laser_Mark</el-radio>
        <el-radio :label="2">WaferID</el-radio>
      </el-radio-group>
      <el-input v-model="wafers" :rows="6" type="textarea" style="margin-top: 10px"/>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSearch">确 定</el-button>
        <el-button @click="moreWaferDialogVisable = false">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .table-container>>> .el-table--scrollable-x{
    height: calc(100vh - 375px) !important;
  }
  .site-table>>> .cell, .app-container>>> .cell{
    line-height: 37px;
  }
  .site-table>>> td{
    height: 37px;
  }
  .padding-dialog>>> .cell, .app-container>>> .cell{
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
  .dialog .input-item{
    margin-top: 5px;
  }
  .search-input{
    width: 150px;
  }
  .short-input{
    width: 126px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 305px);
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
    width: 232px;
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
    width: 68px;
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
</style>
