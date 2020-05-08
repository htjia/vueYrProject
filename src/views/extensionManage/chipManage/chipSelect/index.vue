<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto">
      <div class="header-btn-group">
        <el-button
          size="small"
          type="primary"
          @click="tipOut"
        ><svg-icon icon-class="xuanzexx"/> 选择投片</el-button>
      </div>
      <div class="search-box">
        <div class="left-search-box">
          <div class="input-item">
            <span class="input-title">RunID </span>
            <el-input v-model="runId" class="search-input" placeholder="请输入RunID" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">机台 </span>
            <el-select v-model="machineValue" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in machineOptions"
                :key="item.id"
                :label="item.code"
                :value="item.id"/>
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
          <div class="input-item">
            <span class="input-title">状态 </span>
            <el-select v-model="statusValue" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in statusList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
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
        height="calc(100vh - 380px)"
        class="mocvd-table broad-scrollbar-table"
        element-loading-text="拼命加载中"
        highlight-current-row
        border
        fit
        @current-change="handleCurrentChange"
        @cell-dblclick="cellDblclick"
      >
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
            <span v-if="scope.row.finalStatus === '7'">已送验证片</span>
            <span v-if="scope.row.finalStatus === '8'">已入库</span>
          </template>
        </el-table-column>
        <el-table-column label="结构类型" align="center" prop="structureCode"/>
        <el-table-column label="衬底工艺" align="center" prop="substrateCode"/>
        <el-table-column label="生产类型" align="center" prop="produceCode"/>
        <el-table-column label="机台" align="center" prop="machineCode"/>
        <el-table-column label="炉次" align="center" prop="stoveCode"/>
        <el-table-column label="Platter_No" align="center" prop="platterNo" width="120"/>
        <el-table-column label="使用次数" align="center" prop="platterTotal"/>
        <el-table-column label="铝氮ID号" align="center" width="120">
          <template slot-scope="scope">
            {{ scope.row.alnIds[0] }}
          </template>
        </el-table-column>
        <el-table-column label="投片时间" align="center" prop="createTime" width="120" show-overflow-tooltip/>
        <el-table-column label="保存时间" align="center" prop="saveTime" width="120" show-overflow-tooltip/>
        <el-table-column label="目标波长" align="center" prop="wavelength"/>
        <el-table-column label="放片人" align="center" prop="creatorName"/>
        <el-table-column label="开始时间" align="center" prop="startTime" width="120" show-overflow-tooltip/>
        <el-table-column label="待机时间" align="center" prop="standbyTime" width="120" show-overflow-tooltip/>
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
        class="mocvd-table broad-scrollbar-table"
        height="calc(100vh - 380px)"
        element-loading-text="拼命加载中"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="RunID" align="center" prop="runId" width="160px" show-overflow-tooltip/>
        <el-table-column label="WaferID" align="center" prop="waferId" width="180px" show-overflow-tooltip/>
        <el-table-column label="衬底工艺" align="center" prop="substrateType"/>
        <el-table-column label="铝氮ID" align="center" prop="boxNo">
          <template slot-scope="scope">
            {{ scope.row.alnId }}
          </template>
        </el-table-column>
        <el-table-column label="单/双抛" align="center" prop="singleDoubleThrow"/>
        <el-table-column label="衬底尺寸" align="center" prop="measureCode"/>
        <el-table-column label="衬底厂家" align="center" prop="supplier"/>
        <el-table-column label="镭刻号" align="center" prop="laserMark" width="130px" show-overflow-tooltip/>
        <el-table-column label="SWR" align="center" prop="swr"/>
        <el-table-column label="目检" align="center" prop="visualLevelCode"/>
        <el-table-column label="原因" align="center" prop="exceptionName"/>
        <el-table-column label="备注" align="center" prop="remark" width="200" show-overflow-tooltip/>
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
      class="tip-out-dialog parameter-table"
      title="选择投片"
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
        <el-button type="danger" icon="el-icon-close" class="float-right" style="margin-left:15px" @click="handleClose1()">退出</el-button>
        <el-button :disabled="isDisabled" type="primary" icon="el-icon-check" class="float-right" @click="submitForm()">保存</el-button>
      </div>
      <el-form v-if="activeTabIndex === 0" status-icon label-width="140px" label-position="right">
        <div class="">
          <div class="module-title">
            <div class="module-title-text">投片信息</div>
          </div>
          <div class="module-content">
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
                    <el-form-item label="炉次编号 " size="small">
                      <el-input v-model="rowInfo.stoveCode" :disabled="true" class="tip-out-input"/>
                    </el-form-item>
                    <el-form-item label="放片人 " size="small">
                      <el-input v-model="rowInfo.creatorName" :disabled="true" class="tip-out-input"/>
                    </el-form-item>
                    <el-form-item label="Platter_No " size="small">
                      <el-input v-model="rowInfo.platterNo" :disabled="true" class="tip-out-input"/>
                    </el-form-item>
                    <el-form-item label="判定指向 " size="small">
                      <el-select v-model="rowInfo.decisionRuleId" :disabled="isDisable" placeholder="请选择" filterable @change="updateWaferZX">
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
                    <el-form-item label="待机时间 " size="small">
                      <el-input v-model="rowInfo.standbyTime" :disabled="true" class="tip-out-input"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="衬底工艺 " size="small" >
                      <el-input v-model="rowInfo.substrateCode" :disabled="true" class="tip-out-input"/>
                    </el-form-item>
                    <el-form-item label="生产类型 " size="small" >
                      <el-input v-model="rowInfo.produceCode" :disabled="true" class="tip-out-input"/>
                    </el-form-item>
                    <el-form-item label="日期 " size="small" >
                      <el-input v-model="rowInfo.createTime" :disabled="true" class="tip-out-input"/>
                    </el-form-item>
                    <el-form-item label="开始时间 " size="small" >
                      <el-input v-model="rowInfo.startTimes" :disabled="true" class="tip-out-input"/>
                    </el-form-item>
                    <el-form-item label="使用次数 " size="small" >
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
                      <el-input v-model="rowInfo.endTime" :disabled="true" class="tip-out-input"/>
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
                <el-form-item label="备注 " size="small">
                  <el-input v-model="rowInfo.remark" :disabled="true" type="textarea" style="width: 563px;" maxlength="50"/>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-form>
      <!--wafer信息-->
      <el-table
        v-loading="listLoading"
        v-show="activeTabIndex === 1"
        :data="checkList"
        :row-class-name="tableRowClassColor"
        class="mocvd-table broad-scrollbar-table"
        height="639px"
        element-loading-text="拼命加载中"
        border
        fit
      >
        <el-table-column label="序号" align="center" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="WaferID" align="center" prop="waferId" width="120"/>
        <el-table-column label="镭刻号" align="center" prop="laserMark" width="120"/>
        <el-table-column label="铝氮盒号" align="center" prop="boxNo" width="120"/>
        <el-table-column label="SWR" align="center" prop="swr"/>
        <el-table-column label="目检" align="center" prop="visualLevelCode"/>
        <el-table-column label="WD_AVR" align="center" prop="wdAvr"/>
        <el-table-column label="WD_STD" align="center" prop="wdStd"/>
        <el-table-column label="II_AVR" align="center" prop="iiAvr"/>
        <el-table-column label="II_STD" align="center" prop="iiStd"/>
        <el-table-column label="投片" align="center" width="50">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isSelected" :disabled="scope.row.operation===1" style="margin-left: 0px;" @change="setTouPian(scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column label="验证片" align="center" width="50">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isAcceptSlice" :disabled="scope.row.operation===1" style="margin-left: 0px;" @change="setYanZhengpian(scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column label="投片类型" align="center" width="100">
          <template slot-scope="scope">
            <el-select v-model="scope.row.type" :disabled="scope.row.operation===1" class="search-input" style="width:80px" size="small" placeholder="请选择" filterable clearable @change="setIsYz(scope.row)">
              <el-option
                v-for="item in substrateFindOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="指向" align="center" prop="point"/>
        <el-table-column label="备注" align="center" width="200px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark" :disabled="scope.row.operation===1" class="search-input" placeholder="" size="small" maxlength="50" clearable/>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="checkDialogVisible"
        class="print-dialog"
        title="投片提示"
        width="600px"
        append-to-body
      >
        <div style="color: rgb(245, 108, 108);font-weight: bold;padding-bottom: 15px;margin-top: -15px;">是否确认选择以下wafer为验证片?</div>
        <el-table
          :data="selectList"
          class="mocvd-table broad-scrollbar-table"
          element-loading-text="拼命加载中"
          style="margin-bottom: 15px;"
          border
          fit
        >
          <el-table-column label="片号" align="center" prop="index" width="50"/>
          <el-table-column label="WaferID" align="center" prop="waferId"/>
          <el-table-column label="镭刻号" align="center" prop="laserMark"/>
        </el-table>
        <el-row>
          <el-col :span="14">
            <span>判定指向: </span>
            <el-select v-model="rowInfo.decisionRuleId" :disabled="true" size="small" filterable>
              <el-option
                v-for="item in decisionRuleList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                class="tip-out-input"/>
            </el-select>
          </el-col>
          <el-col v-if="dataList.length>0" :span="10">
            <span>投片类型: </span>
            <el-select v-model="dataList[0].type" :disabled="true" class="search-input" size="small" filterable>
              <el-option
                v-for="item in substrateFindOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button :disabled="isDisabled" type="primary" @click="submit()">确定</el-button>
          <el-button @click="checkDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
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
  .wafer-box-modal{
    position: absolute;
    width: 70%;
    height: 65%;
    top: 0;
    left: 365px;
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
  .mocvd-table ::-webkit-scrollbar {/*滚动条整体样式*/
    height: 10px !important;
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
  .parameter-table>>>.el-table .set_yellow td{
    background-color: #FFFFCF;
  }
  .parameter-table>>>.el-table .set_blue td{
    background-color: #FBDDDD;
  }
  .broad-scrollbar-table>>>.el-table__fixed-body-wrapper {
    height: calc(100vh - 385px) !important;
  }
  .broad-scrollbar-table>>>.el-table__fixed {
    height: calc(100vh - 343px) !important;
  }
</style>
