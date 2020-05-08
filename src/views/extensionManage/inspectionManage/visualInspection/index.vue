<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto">
      <div class="header-btn-group" style="height: 50px;">
        <el-button
          v-show="isShowMenu['wyproductionManage-visualInspection-start']"
          size="small"
          type="primary"
          @click="tipOut"
        ><svg-icon icon-class="kaishi"/> 开始目检</el-button>
        <el-button
          v-show="isShowMenu['wyproductionManage-visualInspection-update']"
          size="small"
          type="primary"
          @click="tipOuts"
        ><svg-icon icon-class="kaishi"/> 修改目检</el-button>
      </div>
      <div class="search-box">
        <div class="left-search-box">
          <div class="input-item">
            <span class="input-title">RunID </span>
            <el-input v-model="runId" class="search-input" placeholder="请输入RunID" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">机台 </span>
            <el-select v-model="machineValue" class="search-input" size="small" placeholder="请选择" filterable>
              <el-option
                v-for="item in machineOptions"
                :key="item.id"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">炉次 </span>
            <el-select v-model="furnaceValue" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in furnaceOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item" style="margin-top:22px">
            <el-radio v-model="radio" label="1">待目检</el-radio>
            <el-radio v-model="radio" label="2">已完成</el-radio>
          </div>
          <div class="input-item">
            <span class="input-title">日期 </span>
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
        </div>
        <div class="right-btn-box">
          <el-button
            class="float-right margin-top margin-left"
            size="small"
            type="danger"
            @click="clearAll"
          >
            <svg-icon icon-class="clear"/> 重 置
          </el-button>
          <el-button
            class="float-right margin-top"
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="handleSearch" >查 询</el-button>
        </div>
      </div>
    </div>
    <div class="app-container">
      <div class="table-top-btn-group">
        <div
          :class="{'active':isActive === 0}"
          @click="navClick(0)"
        >
          Run信息
        </div>
        <div
          :class="{'active':isActive === 1}"
          @click="navClick(1)"
        >
          Wafer信息TOL: <span v-text="waferTol"/>
        </div>
      </div>
      <!--run信息-->
      <el-table
        v-loading="listLoading"
        v-show="isActive === 0"
        ref="listTabel"
        :data="list"
        :cell-style="tableRowClassColors"
        class="broad-scrollbar-table"
        height="calc(100vh - 380px)"
        element-loading-text="拼命加载中"
        highlight-current-row
        border
        fit
        @current-change="handleCurrentChange"
        @cell-dblclick="cellDblclick">
        <el-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
          </template>
        </el-table-column>
        <el-table-column label="RunID" align="center" prop="runId" width="150" fixed/>
        <el-table-column label="Recipe_Name" align="center" prop="recipeName" width="120"/>
        <el-table-column label="状态" align="center" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.finalStatus === '0'">衬底投片</span>
            <span v-if="scope.row.finalStatus === '1'">生长完成</span>
            <span v-if="scope.row.finalStatus === '2'">待补长</span>
            <span v-if="scope.row.finalStatus === '4'">目检完成</span>
            <span v-if="scope.row.finalStatus === '3'">测试完成</span>
            <span v-if="scope.row.finalStatus === '5'">目检测试完成</span>
            <span v-if="scope.row.finalStatus === '6'">COW数据返回</span>
            <span v-if="scope.row.finalStatus === '7'">已入库</span>
            <span v-if="scope.row.finalStatus === '10'">退回产线</span>
          </template>
        </el-table-column>
        <el-table-column label="结构类型" align="center" prop="structureCode"/>
        <el-table-column label="衬底类型" align="center" prop="substrateCode"/>
        <el-table-column label="生产类型" align="center" prop="produceCode"/>
        <el-table-column label="机台" align="center" prop="machineCode"/>
        <el-table-column label="炉次" align="center" prop="stoveCode"/>
        <el-table-column label="Platter_No" align="center" prop="platterNo" width="120"/>
        <el-table-column label="使用次数" align="center" prop="platterTotal"/>
        <el-table-column label="铝氮ID号" align="center" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.alnIds === null">&nbsp;</span>
            <span v-if="scope.row.alnIds !== null">{{ scope.row.alnIds[0] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="投片时间" align="center" prop="createTime" width="120" show-overflow-tooltip/>
        <el-table-column label="保存时间" align="center" prop="saveTime" width="120" show-overflow-tooltip/>
        <el-table-column label="目标波长" align="center" prop="wavelength"/>
        <el-table-column label="放片人" align="center" prop="creatorName"/>
        <el-table-column label="开始时间" align="center" prop="startTime" width="120" show-overflow-tooltip/>
        <el-table-column label="待机时间" align="center" prop="standbyTime"/>
        <el-table-column label="运行时间" align="center" prop="runTime"/>
        <el-table-column label="取片人" align="center" prop="takerName"/>
        <el-table-column label="结束时间" align="center" prop="endTime" width="120" show-overflow-tooltip/>
        <el-table-column label="波长调整人" align="center" prop="adjustsName"/>
        <el-table-column label="待机原因" align="center" prop="standbyReasonName"/>
        <el-table-column label="备注" align="center" prop="remark" width="200" show-overflow-tooltip/>
      </el-table>
      <!--wafer信息-->
      <el-table
        v-loading="listLoading"
        v-show="isActive === 1"
        :data="anotherlist"
        class="broad-scrollbar-table serr"
        height="calc(100vh - 380px)"
        element-loading-text="拼命加载中"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="RunID" align="center" prop="runId" width="150px"/>
        <el-table-column label="WaferID" align="center" prop="waferId" width="150px"/>
        <el-table-column label="衬底工艺" align="center" prop="substrateType"/>
        <el-table-column label="铝氮ID号" align="center" prop="boxNo">
          <template slot-scope="scope">
            {{ scope.row.alnId }}
          </template>
        </el-table-column>
        <el-table-column label="单/双抛" align="center" prop="singleDoubleThrow"/>
        <el-table-column label="衬底尺寸" align="center" prop="measureCode">
          <template slot-scope="scope">
            {{ scope.row.measureCode }}
          </template>
        </el-table-column>
        <el-table-column label="衬底厂家" align="center" prop="supplier"/>
        <el-table-column label="镭刻号" align="center" prop="laserMark" width="150px"/>
        <el-table-column label="SWR" align="center" prop="swr"/>
        <el-table-column label="目检" align="center" prop="visualLevelCode"/>
        <el-table-column label="原因" align="center" prop="exceptionName"/>
        <el-table-column label="备注" align="center" prop="remark"/>
      </el-table>
      <el-pagination
        :current-page="pageNum"
        :page-sizes="[12, 30, 40]"
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
      :visible.sync="addDialogVisible"
      :before-close="handleClose1"
      top="80px"
      class="tip-out-dialog"
      title="开始目检"
      width="1200px">
      <div class="tab-control">
        <span
          :class="{activeTab: activeTabIndex === 0}"
          @click="tabClick(0)"
        >基本信息</span>
        <span
          :class="{activeTab: activeTabIndex === 1}"
          class="margin-left"
          @click="tabClick(1)"
        >Wafer信息</span>
      </div>
      <div class="dialog-btn-group">
        <el-button type="danger" icon="el-icon-close" class="float-right" style="margin-left:15px" @click="handleClose1()">关闭</el-button>
        <el-button :disabled="isDisabled" type="primary" icon="el-icon-check" class="float-right" @click="submitForm()">保存</el-button>
      </div>
      <el-form v-if="activeTabIndex === 0" status-icon label-width="140px" label-position="right">
        <div class="">
          <div class="module-title">
            <div class="module-title-text">投片信息</div>
          </div>
          <div v-if="rowInfo !== null" class="module-content">
            <el-row :gutter="24">
              <el-col :span="15">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="RunID " size="small">
                      <el-input v-model="rowInfo.runId" :disabled="true" class="tip-out-input"/>
                    </el-form-item>
                    <el-form-item label="结构类型 " size="small" >
                      <el-input v-model="rowInfo.structureCode" :disabled="true" class="tip-out-input"/>
                    </el-form-item>
                    <el-form-item label="机台编号 " size="small">
                      <el-input v-model="rowInfo.machineCode" :disabled="true" class="tip-out-input"/>
                    </el-form-item>
                    <el-form-item label="炉次 " size="small">
                      <el-input v-model="rowInfo.stoveCode" :disabled="true" class="tip-out-input"/>
                    </el-form-item>
                    <el-form-item label="放片人 " size="small">
                      <el-input v-model="rowInfo.creatorName" :disabled="true" class="tip-out-input"/>
                    </el-form-item>
                    <el-form-item label="Platter_No " size="small">
                      <el-input v-model="rowInfo.platterNo" :disabled="true" class="tip-out-input"/>
                    </el-form-item>
                    <el-form-item label="判定指向 " size="small">
                      <el-select v-model="rowInfo.decideId" :disabled="true" placeholder="" filterable>
                        <el-option
                          v-for="item in decisionRuleList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                          class="tip-out-input"/>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="目标波长 " size="small">
                      <el-input v-model="rowInfo.wavelength" :disabled="true" class="tip-out-input"/>
                    </el-form-item>
                    <el-form-item label="待机时间(m) " size="small">
                      <el-input v-model="rowInfo.standbyTime" :disabled="true" class="tip-out-input"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="衬底类型 " size="small" >
                      <el-input v-model="rowInfo.substrateCode" :disabled="true" class="tip-out-input"/>
                    </el-form-item>
                    <el-form-item label="生产类型 " size="small" >
                      <el-input v-model="rowInfo.produceCode" :disabled="true" class="tip-out-input"/>
                    </el-form-item>
                    <el-form-item label="日期 " size="small" >
                      <el-input v-model="rowInfo.createTimes" :disabled="true" class="tip-out-input"/>
                    </el-form-item>
                    <el-form-item label="开始时间 " size="small" >
                      <el-input v-model="rowInfo.startTimes" :disabled="true" class="tip-out-input"/>
                    </el-form-item>
                    <el-form-item label="大盘使用次数 " size="small" >
                      <el-input :disabled="true" v-model="rowInfo.platterTotal" class="tip-out-input"/>
                    </el-form-item>
                    <el-form-item label="Recipe_Name " size="small" >
                      <el-input :disabled="true" v-model="rowInfo.recipeName" class="tip-out-input"/>
                    </el-form-item>
                    <el-form-item label="波长调整人 " size="small" >
                      <el-input :disabled="true" v-model="rowInfo.adjustsName" class="tip-out-input"/>
                    </el-form-item>
                    <el-form-item label="待机原因 " size="small" >
                      <el-input v-model="rowInfo.standbyReasonName" :disabled="true" class="tip-out-input"/>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="9">
                <div class="wafer-box">
                  <div class="wafer-box-modal"/>
                  <div
                    v-for="item in wafers"
                    v-show="item.isActive === true"
                    :key="item.name"
                    :class="{active: item.isActive === true}"
                    class="wafer"
                    @click="waferClick(item)"
                    v-text="item.name"
                  >1~54</div>
                </div>
                <el-button :disabled="true" type="primary" style="margin-top: 15px" @click="createWaferID">生成WaferID</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="">
          <div class="module-title">
            <div class="module-title-text">取片信息</div>
          </div>
          <div class="module-content">
            <el-row :gutter="20">
              <el-col :span="15">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="结束时间 " size="small" >
                      <el-input v-model="rowInfo.endTimes" :disabled="true" class="tip-out-input"/>
                      <!-- <span v-if="!isSelectedEnd" style="width: 150px; display: inline-block">{{ runTime }}</span>
                      <span v-if="isSelectedEnd" style="width: 150px; display: inline-block">{{ currentTime }}</span>
                      <el-checkbox v-model="isSelectedEnd" @change="timeStop"/> -->
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="取片人 " size="small" >
                      <el-input v-model="rowInfo.takerName" :disabled="true" class="tip-out-input"/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item label="备注 " size="small" >
                  <el-input v-model="rowInfo.remark" :disabled="true" type="textarea" style="width: 563px;"/>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-form>
      <!--wafer信息-->
      <div v-show="activeTabIndex === 1" class="toop">
        <el-tooltip :enterable="true" placement="top">
          <div slot="content">
            <span>快捷键提示：</span>
            <br>
            <span v-for="item in levelList" :key="item.id" style="margin-left:15px">
              <span v-if="item.quickSearch === null">{{ item.name }}: 无</span>
              <span v-if="item.quickSearch !== null">{{ item.name }}: {{ item.quickSearch }}</span>
              <br>
            </span>
          </div>
          <el-button class="questions" icon="el-icon-question"/>
        </el-tooltip>
      </div>
      <div v-show="activeTabIndex === 1" class="toops">
        <el-input v-model="allvisualLevelValue" style="width:80px" size="small" @keyup.enter.native="checkalllevel()"/>
        <el-select v-model="allexceptionId" class="search-input" style="width: 80px;margin-left: 25px;" size="small" placeholder="请选择" filterable @change="seupallexp">
          <el-option
            v-for="item in reasonList"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </div>
      <el-table
        v-loading="listLoading"
        v-show="activeTabIndex === 1"
        ref="setAnothers"
        :data="anotherlist1"
        class="broad-scrollbar-table"
        height="639px"
        element-loading-text="拼命加载中"
        highlight-current-row
        border
        fit>
        <el-table-column label="序号" align="center" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="WaferID" align="center" prop="waferId" width="120"/>
        <el-table-column label="衬底工艺" align="center" prop="substrateType"/>
        <el-table-column label="铝氮ID" align="center" prop="boxNo" width="120"/>
        <el-table-column label="单/双抛" align="center" prop="singleDoubleThrow"/>
        <el-table-column label="衬底尺寸" align="center" prop="measureCode"/>
        <el-table-column label="衬底厂家" align="center" prop="supplier"/>
        <el-table-column label="镭刻号" align="center" prop="laserMark" width="120"/>
        <el-table-column label="SWR" align="center" prop="swr"/>
        <el-table-column label="目检" align="center" width="120">
          <template slot-scope="scope">
            <!-- <el-select v-model="scope.row.visualLevelId" class="search-input" style="width:80px" size="small" placeholder="请选择" clearable>
              <el-option
                v-for="item in levelList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select> -->
            <el-input :ref="scope.row.waferId" v-model="scope.row.visualLevelValue" style="width:80px" size="small" @keyup.native="checklevel(scope.row, scope.$index,$event)" @blur="checklevels(scope.row, scope.$index,$event)"/>
          </template>
        </el-table-column>
        <el-table-column label="原因" align="center" width="100">
          <template slot-scope="scope">
            <el-select v-model="scope.row.exceptionId" class="search-input" style="width:80px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in reasonList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark" class="search-input" style="width: 135px;" maxlength="50" size="small" clearable/>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .inner-right{
    height: 655px;
    margin-left: 20px;
    border-left: 1px solid #e2e2e2;
    padding-left: 20px;
  }
  .wafer-box-modal{
    position: absolute;
    width: 70%;
    height: 65%;
    top: 0;
    left: 365px;
  }
  .dialog-btn-group{
    position: absolute;
    top: 52px;
    right: 20px;
  }
  .wafer-box{
    overflow: hidden;
    width: 434px;
    border:1px solid #b0dede;
    border-right: none;
    border-bottom: none;
  }
  .wafer{
    float: left;
    width: 47px;
    height: 47px;
    border: 1px solid #b0dede;
    border-top: none;
    border-left: none;
    line-height: 45px;
    text-align: center;
    cursor: pointer;
  }
  .wafer.active{
    background: #009494;
    color: #fff;
  }
  .tip-out-input{
    width: 199px;
  }
  .search-box{
    display: flex;
    flex-direction: row;
  }
  .left-search-box{
    flex-grow: 1;
  }
  .right-btn-box{
    width: 210px;
  }
  .input-item{
    float: left;
    margin-top: 14px;
    margin-right: 10px;
  }
  .search-input{
    width: 155px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 265px);
  }
  .input-title{
    width: 55px;
  }
  .app-container>>> .el-table--border {
    border-top: 2px solid #009494;
  }
  .table-top-btn-group{
    overflow: hidden;
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
  .tip-out-dialog>>>.el-dialog__body,
  .tip-out-inner-dialog>>>.el-dialog__body{
    padding-bottom: 20px;
  }
  .tip-out-inner-dialog>>>.el-dialog__body{
    padding-top: 20px;
  }
  .tip-out-inner-dialog>>>.el-checkbox{
    margin: 0;
  }
  /*.tip-out-inner-dialog>>> .cell{*/
    /*line-height: 45px;*/
  /*}*/
  /*.tip-out-inner-dialog>>> td{*/
    /*height: 45px;*/
  /*}*/
  .table-title{
    font-size: 15px;
    font-weight: bold;
    margin: 10px 0;
  }
  .module-content{
    padding-left: 0;
  }
  .questions{
    border: 0px;
    width: 5px;
    background-color: transparent;
    padding: 0px;
  }
  .questions:hover{
    border: 0px;
    width: 5px;
    background-color:transparent;
    color:#009494;
    padding: 0px;
  }
  .toop{
    position: absolute;
    left: 910px;
    z-index: 99;
    top: 174px;
  }
  .toops{
    text-align: right;
    padding-right: 142px;
    padding-bottom: 15px;
  }
  .broad-scrollbar-table>>>.el-table__fixed-body-wrapper {
    height: calc(100vh - 417px) !important;
  }
  .broad-scrollbar-table>>>.el-table__fixed {
    height: calc(100vh - 376px) !important;
  }
</style>
