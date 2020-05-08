<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto">
      <div class="header-btn-group" style="height: 50px;">
        &nbsp;
        <el-button
          size="small"
          class="float-right"
          type="primary"
          @click="importExcel"
        ><svg-icon icon-class="export"/> 导出</el-button>
        <el-button
          size="small"
          class="float-right"
          style="margin-right: 15px;"
          type="primary"
          @click="findPrintList"
        ><svg-icon icon-class="print"/> 打印</el-button>
      </div>
      <div class="search-box">
        <div class="left-search-box" style="margin-left: -5px;">
          <div class="input-item">
            <span class="input-title" style="width: 40px">单号 </span>
            <el-input v-model="code" class="search-input" placeholder="请输入单号" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">WaferID </span>
            <el-input v-model="waferId" class="search-input" style="width: 190px" placeholder="请输入WaferID" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 40px">时间 </span>
            <el-date-picker
              v-model="beginDate"
              :picker-options="pickerOptionsStart"
              :editable="false"
              class="search-input"
              style="width: 130px"
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
              style="width: 130px"
              class="search-input"
              size="small"
              type="date"
              placeholder="选择结束日期"
              value-format="timestamp"
            />
          </div>
          <div class="input-item">
            <span class="input-title">单据类型 </span>
            <el-select v-model="type" class="search-input" style="width: 80px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 65px">制单人 </span>
            <el-select v-model="creater" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in userListOption"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 65px">审核人 </span>
            <el-select v-model="checker" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in userListOption"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">审核状态 </span>
            <el-select v-model="checkerType" class="search-input" style="width: 100px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in checkerList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div style="float: left">
            <el-button
              class="float-right margin-top margin-left"
              size="small"
              type="danger"
              @click="clearCondition"
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
    </div>
    <div class="app-container">
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
      </div>
      <!--单据信息-->
      <el-table
        v-loading="listLoading"
        v-if="isActive === 0"
        ref="listTabel"
        :data="list"
        class="mocvd-table run-table"
        element-loading-text="拼命加载中"
        height="calc(100vh - 432px)"
        highlight-current-row
        border
        fit
        @current-change="handleCurrentChange"
        @cell-dblclick="cellDblclick"
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
          </template>
        </el-table-column>
        <el-table-column label="单号" align="center" prop="code" width="120" show-overflow-tooltip/>
        <el-table-column label="单据类型" align="center" prop="type">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 0" style="color:#1ABC9C;font-weight:bold">正常</span>
            <span v-if="scope.row.type === 1" style="color:#E25D5D;font-weight:bold">报废</span>
          </template>
        </el-table-column>
        <el-table-column label="制单人" align="center" prop="creator" width="120"/>
        <el-table-column label="制单日期" align="center" prop="createTime"/>
        <el-table-column label="审核人" align="center" prop="auditor"/>
        <el-table-column label="审核日期" align="center" prop="auditTime"/>
        <el-table-column label="备注" align="center" prop="remark" width="120px" show-overflow-tooltip=""/>
        <el-table-column label="审核备注" align="center" prop="auditRemark" width="120px" show-overflow-tooltip=""/>
        <el-table-column label="审核状态" align="center" prop="status">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0" style="color:#1C84C6;font-weight:bold">待审核</span>
            <span v-if="scope.row.status === 1" style="color:#1ABC9C;font-weight:bold">通过</span>
            <span v-if="scope.row.status === 2" style="color:#E25D5D;font-weight:bold">不通过</span>
            <span v-if="scope.row.status === 3" style="color:#01485B;font-weight:bold">草稿</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="260px">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status === 0 && scope.row.type === 0"
              size="mini"
              type="primary"
              @click="addNew(scope.row)"
            ><svg-icon icon-class="rukedansh"/> 审核</el-button>
            <el-button
              v-if="scope.row.status === 0 && scope.row.type === 1"
              size="mini"
              type="primary"
              @click="addNew1(scope.row)"
            ><svg-icon icon-class="rukedansh"/> 审核</el-button>
            <el-button
              v-if="scope.row.status === 1"
              size="mini"
              type="primary"
              @click="fanNew(scope.row)"
            ><svg-icon icon-class="fanshen"/> 反审</el-button>
            <el-button
              v-if="scope.row.status === 2"
              size="mini"
              @click="chaNew(scope.row)"
            ><svg-icon icon-class="chaxun"/> 查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--wafer信息-->
      <div v-if="isActive === 1" class="wafer-table" style="height: 90%">
        <pl-table
          v-loading="listLoading"
          :datas="anotherList"
          :row-height="37"
          class="broad-scrollbar-table"
          element-loading-text="拼命加载中"
          header-drag-style
          use-virtual
          border
          fit
          stripe>
          <pl-table-column align="center" label="序号" width="50" fixed>
            <template slot-scope="scope">
              {{ scope.$index+1 }}
            </template>
          </pl-table-column>
          <pl-table-column label="RunID" align="center" prop="runId" width="120" fixed/>
          <pl-table-column label="WaferID" align="center" prop="waferId" width="120" fixed/>
          <pl-table-column label="衬底工艺" align="center" prop="substateType"/>
          <pl-table-column label="衬底厂家" align="center" prop="supplier"/>
          <pl-table-column label="镭刻号" align="center" prop="laserMark" width="120"/>
          <pl-table-column label="目检" align="center" prop="mjdj"/>
          <pl-table-column label="PL_WD" align="center" prop="plWd"/>
          <pl-table-column label="PL_WD_STD" align="center" prop="plWdStd" width="120"/>
          <pl-table-column label="PL.I.I" align="center" prop="plII"/>
          <pl-table-column label="PL.I.I.Std" align="center" prop="PLIIStd" width="120"/>
          <pl-table-column label="PL_PD" align="center" prop="plPd"/>
          <pl-table-column label="PL_Ref" align="center" prop="plRef"/>
          <pl-table-column label="LOP(460)" align="center" prop="lop460"/>
          <pl-table-column label="综合判定" align="center" prop="comprehensive"/>
          <pl-table-column label="ESD(200)" align="center" prop="esd200"/>
          <pl-table-column label="ESD去坏(50V)" align="center" prop="esd50" width="120"/>
          <pl-table-column label="综合良率" align="center" prop="yieldZh"/>
          <pl-table-column label="VF1 Yield" align="center" prop="vf1Yield"/>
          <pl-table-column label="Ir  Yield" align="center" prop="irYield"/>
          <pl-table-column label="VZ  Yield" align="center" prop="vzYield"/>
          <pl-table-column label="VF1" align="center" prop="vf1"/>
          <pl-table-column label="VF2" align="center" prop="vf2"/>
          <pl-table-column label="WLD1" align="center" prop="wld1"/>
          <pl-table-column label="Ir" align="center" prop="lr"/>
          <pl-table-column label="VZ" align="center" prop="vz"/>
          <pl-table-column label="IV" align="center" prop="lv"/>
          <pl-table-column label="WLD(PL-COW)" align="center" prop="wld" width="120"/>
          <pl-table-column label="预估COW波长" align="center" prop="cow" width="120"/>
          <pl-table-column label="ESD(400)" align="center" prop="esd400"/>
          <pl-table-column label="验证版型" align="center" prop="yzType"/>
          <pl-table-column label="生产类型" align="center" prop="produceType"/>
          <pl-table-column label="Recipe_Name" align="center" prop="Recipe_Name" width="120"/>
          <pl-table-column label="HW" align="center" prop="hw"/>
          <pl-table-column label="B.S" align="center" prop="BS"/>
          <pl-table-column label="目检原因" align="center" prop="visualReason"/>
          <pl-table-column label="Color" align="center" prop="color"/>
          <pl-table-column label="Sub" align="center" prop="SUB"/>
          <pl-table-column label="机台" align="center" prop="machine"/>
          <pl-table-column label="ESD去坏（500V）" align="center" prop="esd500" width="150"/>
          <pl-table-column label="ESD去坏（300V）" align="center" prop="esd300" width="150"/>
          <pl-table-column label="BOW" align="center" prop="bow"/>
          <pl-table-column label="PLINT_STD" align="center" prop="PLINT_STD" width="120"/>
          <pl-table-column label="Avg_Vf4" align="center" prop="Avg_Vf4"/>
          <pl-table-column label="Thyristor良率" align="center" prop="thyristor" width="120"/>
        </pl-table>
      </div>
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
      title="审核"
      width="1200px"
      class="tip-out-inner-dialog">
      <el-row>
        <el-col :span="6">
          <div class="tableTitle">
            <div class="setTitle">入库信息</div>
          </div>
          <div class="set-border">
            <el-form label-width="80px">
              <el-form-item label="入库单号:">
                <el-input v-model="codeNo" :disabled="true" size="small" style="width:95%"/>
              </el-form-item>
              <el-form-item label="单据类型:">
                <el-select v-model="modelType" :disabled="true" class="search-input" size="small" style="width:95%" placeholder="请选择" filterable @change="changemodelType">
                  <el-option
                    v-for="item in typeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item label="制单人:">
                <el-input v-model="modelCreater" :disabled="true" size="small" style="width:95%"/>
              </el-form-item>
              <el-form-item label="制单时间:">
                <el-input v-model="modelTime" :disabled="true" size="small" style="width:95%"/>
              </el-form-item>
              <el-form-item label="审核人:">
                <el-input v-model="checkerName" :disabled="true" size="small" style="width:95%"/>
              </el-form-item>
              <el-form-item label="审核时间:">
                <el-input v-model="checkerTime" :disabled="true" size="small" style="width:95%"/>
              </el-form-item>
              <el-form-item label="审核状态:">
                <el-input v-model="checkerTypes" :disabled="true" size="small" style="width:95%"/>
              </el-form-item>
              <el-form-item label="备注:">
                <el-input v-model="modelRemark" :rows="9" type="textarea" maxlength="50" size="small" style="width:95%"/>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="18">
          <div class="tableTitle">
            <div class="setTitle">入库明细</div>
          </div>
          <div class="set-border">
            <div>
              <div class="leftType">共 <span style="color:#009494;font-weight:bold">{{ anotherLists.length }}</span>行</div>
              <el-button size="small" type="primary" @click="openIsCheck()">检查&审核</el-button>
              <el-button class="buttonType1" @click="importExcel"> <svg-icon icon-class="export"/> 导 出 </el-button>
            </div>
            <div class="getCalss parameter-table">
              <el-table
                ref="multipleTable"
                :data="anotherLists"
                class="mocvd-table run-table"
                height="570px"
                element-loading-text="拼命加载中"
                border
                fit
                stripe>
                <el-table-column label="RunID" align="center" prop="runId" width="120"/>
                <el-table-column label="WaferID" align="center" prop="waferId" width="120"/>
                <el-table-column label="判定规则" align="center" width="100">
                  <template slot-scope="scope">
                    <span>
                      <div style="color: #009494;font-weight: bold;cursor: pointer;text-decoration:underline" @click="findMather(scope.row)">{{ scope.row.accName }}</div>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="衬底工艺" align="center" prop="substateType"/>
                <el-table-column label="衬底厂家" align="center" prop="supplier"/>
                <el-table-column label="镭刻号" align="center" prop="laserMark" width="120"/>
                <el-table-column label="目检" align="center" prop="mjdj"/>
                <el-table-column label="PL_WD" align="center" prop="plWd"/>
                <el-table-column label="PL_WD_STD" align="center" prop="plWdStd" width="120"/>
                <el-table-column label="PL.I.I" align="center" prop="plII"/>
                <el-table-column label="PL.I.I.Std" align="center" prop="PLIIStd" width="120"/>
                <el-table-column label="PL_PD" align="center" prop="plPd"/>
                <el-table-column label="PL_Ref" align="center" prop="plRef"/>
                <el-table-column label="LOP(460)" align="center" prop="lop460"/>
                <el-table-column label="综合判定" align="center" prop="comprehensive"/>
                <el-table-column label="ESD(200)" align="center" prop="esd200"/>
                <el-table-column label="ESD去坏(50V)" align="center" prop="esd50" width="120"/>
                <el-table-column label="综合良率" align="center" prop="yieldZh"/>
                <el-table-column label="VF1 Yield" align="center" prop="vf1Yield"/>
                <el-table-column label="Ir  Yield" align="center" prop="irYield"/>
                <el-table-column label="VZ  Yield" align="center" prop="vzYield"/>
                <el-table-column label="VF1" align="center" prop="vf1"/>
                <el-table-column label="VF2" align="center" prop="vf2"/>
                <el-table-column label="WLD1" align="center" prop="wld1"/>
                <el-table-column label="Ir" align="center" prop="lr"/>
                <el-table-column label="VZ" align="center" prop="vz"/>
                <el-table-column label="IV" align="center" prop="lv"/>
                <el-table-column label="WLD(PL-COW)" align="center" prop="wld" width="120"/>
                <el-table-column label="预估COW波长" align="center" prop="cow" width="120"/>
                <el-table-column label="ESD(400)" align="center" prop="esd400"/>
                <el-table-column label="验证版型" align="center" prop="yzType"/>
                <el-table-column label="生产类型" align="center" prop="produceType"/>
                <el-table-column label="Recipe_Name" align="center" prop="Recipe_Name" width="120"/>
                <el-table-column label="HW" align="center" prop="hw"/>
                <el-table-column label="B.S" align="center" prop="BS"/>
                <el-table-column label="目检原因" align="center" prop="visualReason"/>
                <el-table-column label="Color" align="center" prop="color"/>
                <el-table-column label="Sub" align="center" prop="SUB"/>
                <el-table-column label="机台" align="center" prop="machine"/>
                <el-table-column label="ESD去坏（500V）" align="center" prop="esd500" width="150"/>
                <el-table-column label="ESD去坏（300V）" align="center" prop="esd300" width="150"/>
                <el-table-column label="BOW" align="center" prop="bow"/>
                <el-table-column label="PLINT_STD" align="center" prop="PLINT_STD" width="120"/>
                <el-table-column label="Avg_Vf4" align="center" prop="Avg_Vf4"/>
                <el-table-column label="Thyristor良率" align="center" prop="thyristor" width="120"/>
              </el-table>
            </div>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm()">确 定</el-button>
        <el-button @click="resetForm()">取 消</el-button>
      </span>
      <el-dialog
        :visible.sync="checkVisible"
        width="800px"
        top="80px"
        class="tip-out-inner-dialog"
        title="自动检查"
        append-to-body>
        <div>
          <div class="tableTitle">
            <div class="setTitle">检查项目</div>
          </div>
          <div class="set-border" style="height: 80px;">
            <el-checkbox v-model="isCheckNuLL" style="margin-top:10px">检查空值</el-checkbox>
            <el-checkbox v-model="isCheckLevel">检查等级判定</el-checkbox>
            <el-button type="primary" style="float:right;margin-right:15px" @click="startCheck()"><svg-icon icon-class="kaishi"/> 开始检查</el-button>
          </div>
        </div>
        <div>
          <div class="tableTitle">
            <div class="setTitle">检查结果</div>
          </div>
          <div class="set-borders">
            <div class="checkstr" v-html="checkStr">&nbsp;</div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button v-if="isCheck" type="primary" @click="closeCheck()">确 定</el-button>
          <el-button @click="closeCheck()">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="checkDialogVisible"
        class="print-dialog"
        title="判定规则"
        width="1200px"
        append-to-body
      >
        <div>
          <span class="input-title" style="width:175px">已选定标准：{{ ruleInfoName }} </span>
          <el-row>
            <el-col :span="24" style="padding:5px">
              <el-table
                :data="showCheckList"
                element-loading-text="拼命加载中"
                class="run-table broad-scrollbar-table"
                highlight-current-row
                border
                fit
                stripe>
                <el-table-column label="等级" align="center" prop="grade" fixed/>
                <el-table-column v-for="(value, key) in showCheckList[0].key" :key="key" :label="key" align="center" width="200px" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{ scope.row[key] }}
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
      </el-dialog>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible1"
      title="审核"
      width="1200px"
      class="tip-out-inner-dialog">
      <el-row>
        <el-col :span="6">
          <div class="tableTitle">
            <div class="setTitle">入库信息</div>
          </div>
          <div class="set-border">
            <el-form label-width="80px">
              <el-form-item label="入库单号:">
                <el-input v-model="codeNo" :disabled="true" size="small" style="width:95%"/>
              </el-form-item>
              <el-form-item label="单据类型:">
                <el-select v-model="modelType" :disabled="true" class="search-input" size="small" style="width:95%" placeholder="请选择" @change="changemodelType">
                  <el-option
                    v-for="item in typeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item label="制单人:">
                <el-input v-model="modelCreater" :disabled="true" size="small" style="width:95%"/>
              </el-form-item>
              <el-form-item label="制单时间:">
                <el-input v-model="modelTime" :disabled="true" size="small" style="width:95%"/>
              </el-form-item>
              <el-form-item label="审核人:">
                <el-input v-model="checkerName" :disabled="true" size="small" style="width:95%"/>
              </el-form-item>
              <el-form-item label="审核时间:">
                <el-input v-model="checkerTime" :disabled="true" size="small" style="width:95%"/>
              </el-form-item>
              <el-form-item label="审核状态:">
                <el-input v-model="checkerTypes" :disabled="true" size="small" style="width:95%"/>
              </el-form-item>
              <el-form-item label="备注:">
                <el-input v-model="modelRemark" :rows="9" type="textarea" maxlength="50" size="small" style="width:95%"/>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="18">
          <div class="tableTitle">
            <div class="setTitle">入库明细</div>
          </div>
          <div class="set-border">
            <div>
              <div class="leftType">共 <span style="color:#009494;font-weight:bold">{{ anotherLists.length }}</span>行</div>
              <el-button class="buttonType1" @click="importExcel"> <svg-icon icon-class="export"/> 导 出 </el-button>
            </div>
            <div class="getCalss parameter-table">
              <el-table
                ref="multipleTable"
                :data="anotherLists"
                class="mocvd-table run-table"
                height="570px"
                element-loading-text="拼命加载中"
                border
                fit
                stripe>
                <el-table-column label="RunID" align="center" prop="runId" width="120"/>
                <el-table-column label="WaferID" align="center" prop="waferId" width="120"/>
                <el-table-column label="判定规则" align="center" width="100">
                  <template slot-scope="scope">
                    <span>
                      <div style="color: #009494;font-weight: bold;cursor: pointer;text-decoration:underline" @click="findMather(scope.row)">{{ scope.row.accName }}</div>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="衬底工艺" align="center" prop="substateType"/>
                <el-table-column label="衬底厂家" align="center" prop="supplier"/>
                <el-table-column label="镭刻号" align="center" prop="laserMark" width="120"/>
                <el-table-column label="目检" align="center" prop="mjdj"/>
                <el-table-column label="PL_WD" align="center" prop="plWd"/>
                <el-table-column label="PL_WD_STD" align="center" prop="plWdStd" width="120"/>
                <el-table-column label="PL.I.I" align="center" prop="plII"/>
                <el-table-column label="PL.I.I.Std" align="center" prop="PLIIStd" width="120"/>
                <el-table-column label="PL_PD" align="center" prop="plPd"/>
                <el-table-column label="PL_Ref" align="center" prop="plRef"/>
                <el-table-column label="LOP(460)" align="center" prop="lop460"/>
                <el-table-column label="综合判定" align="center" prop="comprehensive"/>
                <el-table-column label="ESD(200)" align="center" prop="esd200"/>
                <el-table-column label="ESD去坏(50V)" align="center" prop="esd50" width="120"/>
                <el-table-column label="综合良率" align="center" prop="yieldZh"/>
                <el-table-column label="VF1 Yield" align="center" prop="vf1Yield"/>
                <el-table-column label="Ir  Yield" align="center" prop="irYield"/>
                <el-table-column label="VZ  Yield" align="center" prop="vzYield"/>
                <el-table-column label="VF1" align="center" prop="vf1"/>
                <el-table-column label="VF2" align="center" prop="vf2"/>
                <el-table-column label="WLD1" align="center" prop="wld1"/>
                <el-table-column label="Ir" align="center" prop="lr"/>
                <el-table-column label="VZ" align="center" prop="vz"/>
                <el-table-column label="IV" align="center" prop="lv"/>
                <el-table-column label="WLD(PL-COW)" align="center" prop="wld" width="120"/>
                <el-table-column label="预估COW波长" align="center" prop="cow" width="120"/>
                <el-table-column label="ESD(400)" align="center" prop="esd400"/>
                <el-table-column label="验证版型" align="center" prop="yzType"/>
                <el-table-column label="生产类型" align="center" prop="produceType"/>
                <el-table-column label="Recipe_Name" align="center" prop="Recipe_Name" width="120"/>
                <el-table-column label="HW" align="center" prop="hw"/>
                <el-table-column label="B.S" align="center" prop="BS"/>
                <el-table-column label="目检原因" align="center" prop="visualReason"/>
                <el-table-column label="Color" align="center" prop="color"/>
                <el-table-column label="Sub" align="center" prop="SUB"/>
                <el-table-column label="机台" align="center" prop="machine"/>
                <el-table-column label="ESD去坏（500V）" align="center" prop="esd500" width="150"/>
                <el-table-column label="ESD去坏（300V）" align="center" prop="esd300" width="150"/>
                <el-table-column label="BOW" align="center" prop="bow"/>
                <el-table-column label="PLINT_STD" align="center" prop="PLINT_STD" width="120"/>
                <el-table-column label="Avg_Vf4" align="center" prop="Avg_Vf4"/>
                <el-table-column label="Thyristor良率" align="center" prop="thyristor" width="120"/>
              </el-table>
            </div>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm1(1)">通 过</el-button>
        <el-button type="primary" @click="submitForm1(2)">不通过</el-button>
        <el-button @click="addDialogVisible1 = false">取 消</el-button>
      </span>
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="checkDialogVisible"
        class="print-dialog"
        title="判定规则"
        width="800px"
        append-to-body
      >
        <div>
          <span class="input-title" style="width:175px">已选定标准：{{ ruleInfoName }} </span>
          <el-row>
            <el-col :span="24" style="padding:5px">
              <el-table
                :data="showCheckList"
                element-loading-text="拼命加载中"
                class="run-table"
                highlight-current-row
                border
                fit
                stripe>
                <el-table-column label="等级" align="center" prop="grade"/>
                <el-table-column v-for="(value, key) in showCheckList[0].key" :key="key" :label="key" align="center" width="200px">
                  <template slot-scope="scope">
                    {{ scope.row[key] }}
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
      </el-dialog>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="fanDialogVisible"
      title="反审"
      width="1200px"
      class="tip-out-inner-dialog">
      <el-row>
        <el-col :span="6">
          <div class="tableTitle">
            <div class="setTitle">审核结果</div>
          </div>
          <div v-if="rowInfo !== null" class="set-border">
            <div v-if="rowInfo.status === 1" class="statuType">通过</div>
            <div v-if="rowInfo.status === 2" class="statuType">不通过</div>
            <div style="padding: 15px 0;font-weight: bold;">检查结果</div>
            <div class="checkstr" v-html="rowInfo.auditResult">&nbsp;</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="tableTitle">
            <div class="setTitle">入库信息</div>
          </div>
          <div class="set-border">
            <el-form label-width="80px">
              <el-form-item label="入库单号:">
                <el-input v-model="codeNo" :disabled="true" size="small" style="width:95%"/>
              </el-form-item>
              <el-form-item label="单据类型:">
                <el-select v-model="modelType" :disabled="true" class="search-input" size="small" style="width:95%" placeholder="请选择" @change="changemodelType">
                  <el-option
                    v-for="item in typeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item label="制单人:">
                <el-input v-model="modelCreater" :disabled="true" size="small" style="width:95%"/>
              </el-form-item>
              <el-form-item label="制单时间:">
                <el-input v-model="modelTime" :disabled="true" size="small" style="width:95%"/>
              </el-form-item>
              <el-form-item label="审核人:">
                <el-input v-model="checkerName" :disabled="true" size="small" style="width:95%"/>
              </el-form-item>
              <el-form-item label="审核时间:">
                <el-input v-model="checkerTime" :disabled="true" size="small" style="width:95%"/>
              </el-form-item>
              <el-form-item label="审核状态:">
                <el-input v-model="checkerTypes" :disabled="true" size="small" style="width:95%"/>
              </el-form-item>
              <el-form-item label="备注:">
                <el-input v-model="modelRemark" :rows="9" :disabled="true" type="textarea" size="small" style="width:95%" maxlength="50"/>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="tableTitle">
            <div class="setTitle">入库明细</div>
          </div>
          <div class="set-border">
            <div>
              <div class="leftType">共<span style="color:#009494;font-weight:bold">{{ anotherLists.length }}</span>行</div>
              <el-button class="buttonType1" @click="importExcel"> <svg-icon icon-class="export"/> 导 出 </el-button>
            </div>
            <div class="getCalss parameter-table">
              <el-table
                ref="multipleTable"
                :data="anotherLists"
                class="mocvd-table run-table"
                height="570px"
                element-loading-text="拼命加载中"
                border
                fit
                stripe>
                <el-table-column label="RunID" align="center" prop="runId" width="120"/>
                <el-table-column label="WaferID" align="center" prop="waferId" width="120"/>
                <el-table-column label="衬底工艺" align="center" prop="substateType"/>
                <el-table-column label="衬底厂家" align="center" prop="supplier"/>
                <el-table-column label="镭刻号" align="center" prop="laserMark" width="120"/>
                <el-table-column label="目检" align="center" prop="mjdj"/>
                <el-table-column label="PL_WD" align="center" prop="plWd"/>
                <el-table-column label="PL_WD_STD" align="center" prop="plWdStd" width="120"/>
                <el-table-column label="PL.I.I" align="center" prop="plII"/>
                <el-table-column label="PL.I.I.Std" align="center" prop="PLIIStd" width="120"/>
                <el-table-column label="PL_PD" align="center" prop="plPd"/>
                <el-table-column label="PL_Ref" align="center" prop="plRef"/>
                <el-table-column label="LOP(460)" align="center" prop="lop460"/>
                <el-table-column label="综合判定" align="center" prop="comprehensive"/>
                <el-table-column label="ESD(200)" align="center" prop="esd200"/>
                <el-table-column label="ESD去坏(50V)" align="center" prop="esd50" width="120"/>
                <el-table-column label="综合良率" align="center" prop="yieldZh"/>
                <el-table-column label="VF1 Yield" align="center" prop="vf1Yield"/>
                <el-table-column label="Ir  Yield" align="center" prop="irYield"/>
                <el-table-column label="VZ  Yield" align="center" prop="vzYield"/>
                <el-table-column label="VF1" align="center" prop="vf1"/>
                <el-table-column label="VF2" align="center" prop="vf2"/>
                <el-table-column label="WLD1" align="center" prop="wld1"/>
                <el-table-column label="Ir" align="center" prop="lr"/>
                <el-table-column label="VZ" align="center" prop="vz"/>
                <el-table-column label="IV" align="center" prop="lv"/>
                <el-table-column label="WLD(PL-COW)" align="center" prop="wld" width="120"/>
                <el-table-column label="预估COW波长" align="center" prop="cow" width="120"/>
                <el-table-column label="ESD(400)" align="center" prop="esd400"/>
                <el-table-column label="验证版型" align="center" prop="yzType"/>
                <el-table-column label="生产类型" align="center" prop="produceType"/>
                <el-table-column label="Recipe_Name" align="center" prop="Recipe_Name" width="120"/>
                <el-table-column label="HW" align="center" prop="hw"/>
                <el-table-column label="B.S" align="center" prop="BS"/>
                <el-table-column label="目检原因" align="center" prop="visualReason"/>
                <el-table-column label="Color" align="center" prop="color"/>
                <el-table-column label="Sub" align="center" prop="SUB"/>
                <el-table-column label="机台" align="center" prop="machine"/>
                <el-table-column label="ESD去坏（500V）" align="center" prop="esd500" width="150"/>
                <el-table-column label="ESD去坏（300V）" align="center" prop="esd300" width="150"/>
                <el-table-column label="BOW" align="center" prop="bow"/>
                <el-table-column label="PLINT_STD" align="center" prop="PLINT_STD" width="120"/>
                <el-table-column label="Avg_Vf4" align="center" prop="Avg_Vf4"/>
                <el-table-column label="Thyristor良率" align="center" prop="thyristor" width="120"/>
              </el-table>
            </div>
          </div>
        </el-col>
      </el-row>
      <div style="margin-top: 6px">
        <span style="line-height: 75px;font-size: 18px;font-weight: bold;">反审原因：</span>
        <el-input v-model="modelRemarks" :rows="3" type="textarea" size="small" style="width:91%;float:right;margin-right:3px" maxlength="50"/>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="reverseAduit()">反 审</el-button>
        <el-button size="small" @click="resetForm()">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="chaDialogVisible"
      title="查看"
      width="1200px"
      class="tip-out-inner-dialog">
      <el-row>
        <el-col :span="6">
          <div class="tableTitle">
            <div class="setTitle">审核结果</div>
          </div>
          <div v-if="rowInfo !== null" class="set-border">
            <div v-if="rowInfo.status === 1" class="statuType">通过</div>
            <div v-if="rowInfo.status === 2" class="statuType1">不通过</div>
            <div style="padding: 15px 0;font-weight: bold;">检查结果</div>
            <div class="checkstr" v-html="rowInfo.auditResult">&nbsp;</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="tableTitle">
            <div class="setTitle">入库信息</div>
          </div>
          <div class="set-border">
            <el-form label-width="80px">
              <el-form-item label="入库单号:">
                <el-input v-model="codeNo" :disabled="true" size="small" style="width:95%"/>
              </el-form-item>
              <el-form-item label="单据类型:">
                <el-select v-model="modelType" :disabled="true" class="search-input" size="small" style="width:95%" placeholder="请选择" @change="changemodelType">
                  <el-option
                    v-for="item in typeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item label="制单人:">
                <el-input v-model="modelCreater" :disabled="true" size="small" style="width:95%"/>
              </el-form-item>
              <el-form-item label="制单时间:">
                <el-input v-model="modelTime" :disabled="true" size="small" style="width:95%"/>
              </el-form-item>
              <el-form-item label="审核人:">
                <el-input v-model="checkerName" :disabled="true" size="small" style="width:95%"/>
              </el-form-item>
              <el-form-item label="审核时间:">
                <el-input v-model="checkerTime" :disabled="true" size="small" style="width:95%"/>
              </el-form-item>
              <el-form-item label="审核状态:">
                <el-input v-model="checkerTypes" :disabled="true" size="small" style="width:95%"/>
              </el-form-item>
              <el-form-item label="备注:">
                <el-input v-model="modelRemark" :rows="9" :disabled="true" type="textarea" size="small" style="width:95%" maxlength="50"/>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="tableTitle">
            <div class="setTitle">入库明细</div>
          </div>
          <div class="set-border">
            <div>
              <div class="leftType">共<span style="color:#009494;font-weight:bold">{{ anotherLists.length }}</span>行</div>
              <el-button class="buttonType1" @click="importExcel"> <svg-icon icon-class="export"/> 导 出 </el-button>
            </div>
            <div class="getCalss parameter-table">
              <el-table
                ref="multipleTable"
                :data="anotherLists"
                class="mocvd-table run-table"
                height="570px"
                element-loading-text="拼命加载中"
                border
                fit
                stripe>
                <el-table-column label="RunID" align="center" prop="runId" width="120"/>
                <el-table-column label="WaferID" align="center" prop="waferId" width="120"/>
                <el-table-column label="衬底工艺" align="center" prop="substateType"/>
                <el-table-column label="衬底厂家" align="center" prop="supplier"/>
                <el-table-column label="镭刻号" align="center" prop="laserMark" width="120"/>
                <el-table-column label="目检" align="center" prop="mjdj"/>
                <el-table-column label="PL_WD" align="center" prop="plWd"/>
                <el-table-column label="PL_WD_STD" align="center" prop="plWdStd" width="120"/>
                <el-table-column label="PL.I.I" align="center" prop="plII"/>
                <el-table-column label="PL.I.I.Std" align="center" prop="PLIIStd" width="120"/>
                <el-table-column label="PL_PD" align="center" prop="plPd"/>
                <el-table-column label="PL_Ref" align="center" prop="plRef"/>
                <el-table-column label="LOP(460)" align="center" prop="lop460"/>
                <el-table-column label="综合判定" align="center" prop="comprehensive"/>
                <el-table-column label="ESD(200)" align="center" prop="esd200"/>
                <el-table-column label="ESD去坏(50V)" align="center" prop="esd50" width="120"/>
                <el-table-column label="综合良率" align="center" prop="yieldZh"/>
                <el-table-column label="VF1 Yield" align="center" prop="vf1Yield"/>
                <el-table-column label="Ir  Yield" align="center" prop="irYield"/>
                <el-table-column label="VZ  Yield" align="center" prop="vzYield"/>
                <el-table-column label="VF1" align="center" prop="vf1"/>
                <el-table-column label="VF2" align="center" prop="vf2"/>
                <el-table-column label="WLD1" align="center" prop="wld1"/>
                <el-table-column label="Ir" align="center" prop="lr"/>
                <el-table-column label="VZ" align="center" prop="vz"/>
                <el-table-column label="IV" align="center" prop="lv"/>
                <el-table-column label="WLD(PL-COW)" align="center" prop="wld" width="120"/>
                <el-table-column label="预估COW波长" align="center" prop="cow" width="120"/>
                <el-table-column label="ESD(400)" align="center" prop="esd400"/>
                <el-table-column label="验证版型" align="center" prop="yzType"/>
                <el-table-column label="生产类型" align="center" prop="produceType"/>
                <el-table-column label="Recipe_Name" align="center" prop="Recipe_Name" width="120"/>
                <el-table-column label="HW" align="center" prop="hw"/>
                <el-table-column label="B.S" align="center" prop="BS"/>
                <el-table-column label="目检原因" align="center" prop="visualReason"/>
                <el-table-column label="Color" align="center" prop="color"/>
                <el-table-column label="Sub" align="center" prop="SUB"/>
                <el-table-column label="机台" align="center" prop="machine"/>
                <el-table-column label="ESD去坏（500V）" align="center" prop="esd500" width="150"/>
                <el-table-column label="ESD去坏（300V）" align="center" prop="esd300" width="150"/>
                <el-table-column label="BOW" align="center" prop="bow"/>
                <el-table-column label="PLINT_STD" align="center" prop="PLINT_STD" width="120"/>
                <el-table-column label="Avg_Vf4" align="center" prop="Avg_Vf4"/>
                <el-table-column label="Thyristor良率" align="center" prop="thyristor" width="120"/>
              </el-table>
            </div>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="resetForm()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="printDialogVisible"
      class="print-dialog"
      title="打印预览"
      width="1110px"
    >
      <div id="printDiv" ref="print">
        <div style="border:1px solid #000;width: 284mm;">
          <el-row style="margin: 0 10px;">
            <el-col :span="24">
              <div style="text-align:center;font-weight:bold;font-size:0.8cm;padding:10px 0">外延片入库送检单</div>
            </el-col>
          </el-row>
          <el-row style="margin:-5px 10px;">
            <el-col :span="24">
              <div style="text-align:left;padding:5px 0;font-size:0.5cm;"><span style="font-weight:bold;">打印日期：{{ printDate }}</span></div>
            </el-col>
          </el-row>
          <el-row style="margin: 10px;">
            <el-col :span="24">
              <div>
                <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" style="width: 278mm;" >
                  <thead>
                    <tr>
                      <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666;width:80px">
                        <div style="font-size:0.5cm;" class="cell">序号</div>
                      </th>
                      <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666;width:130px">
                        <div style="font-size:0.5cm;" class="cell">RunID</div>
                      </th>
                      <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666;width:80px">
                        <div style="font-size:0.5cm;" class="cell">数量</div>
                      </th>
                      <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666;">
                        <div style="font-size:0.5cm;" class="cell">盒位为空</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in printList" :key="item.id">
                      <td colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666">
                        <div class="cell">{{ index + 1 }}</div>
                      </td>
                      <td colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666">
                        <div class="cell">{{ item.runId }}</div>
                      </td>
                      <td colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666">
                        <div class="cell">{{ item.warehous }}</div>
                      </td>
                      <td colspan="1" rowspan="1" style="text-align:center;height:35px;word-break: break-all;border:1px solid #666">
                        <div class="cell">{{ item.sorts }}</div>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666">
                        <div class="cell">合计</div>
                      </td>
                      <td colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666">
                        <div class="cell">{{ printList.length }}</div>
                      </td>
                      <td colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666">
                        <div class="cell">{{ printNuM }}</div>
                      </td>
                      <td colspan="1" rowspan="1" style="text-align:center;height:35px;word-break: break-all;border:1px solid #666">
                        <div class="cell">&nbsp;</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="printDiv()">打 印</el-button>
        <el-button @click="printDialogVisible=false">关 闭</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .tip-out-inner-dialog>>>.el-checkbox{
    margin-left: 20px;
  }
  .wafer-table>>> .el-table--scrollable-x{
    height: calc(100vh - 375px) !important;
  }
  .wafer-table>>> .el-table__body-wrapper{
    height: calc(100% - 38px) !important;
  }
  .normalReasom{
    border: 0px;
    color: #009494;
    cursor: pointer;
  }
  .normalReasom:hover{
    color: #009688;
  }
  .firstRow{
    padding-bottom: 15px;
    margin-bottom: 15px;
    border-bottom: 1px solid #DCDFE6;
  }
  .setTree{
    padding: 15px;
    border: 1px solid #DCDFE6;
    margin-top: 15px;
    height: 425px;
    overflow: auto;
  }
  .getCalss{
    padding: 15px;
  }
  .setInner {
    padding:10px;
    color: #333;
  }
  .buttonType {
    background: #1abb9d;
    color: #fff;
    font-size: 16px;
  }
  .buttonType1 {
    font-size: 15px;
    float: right;
    height: 35px;
    border: 0px;
    padding: 0;
    margin-right: 15px;
    color:#009494;
  }
  .buttonType1:hover{
    color:#009688;
    background-color: #fff;
  }
  .leftType{
    float: left;
    height: 35px;
    margin-left: 15px;
    padding-top: 8px;
    margin-right: 15px;
  }
  .spanColor{
    font-size: 16px;
    font-weight: bold;
    margin-right: 15px;
  }
  .tableTitle{
    width: 100%;
    font-weight: bold;
    font-size: 15px;
    padding-left: 30px;
    margin-bottom: -15px;
    z-index: 99;
    position: relative;
  }
  .setTitle{
    background: #fff;
    width: 85px;
    text-align: center;
  }
  .set-border{
    border: 1px solid #DCDFE6;
    padding-top: 20px;
    padding-bottom: 0px;
    margin: 5px;
    height: 650px;
    padding: 20px 10px 10px 10px;
  }
  .set-borders{
    border: 1px solid #DCDFE6;
    padding-top: 20px;
    padding-bottom: 0px;
    margin: 5px;
    padding: 20px 10px 10px 10px;
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
    height: calc(100vh - 315px);
  }
  .table-top-btn-group{
    overflow: hidden;
    border-bottom: 2px solid #009494;
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
  .checkstr{
    word-wrap: break-word;
    word-break: break-all;
    overflow: auto;
    line-height: 25px;
    height: 350px;
  }
  .parameter-table>>>.el-table .set_green td{
    background-color: #E35C5C;
    color: #fff;
  }
  .statuType{
    text-align: center;
    font-size: 30px;
    padding: 15px;
    color: #009494;
    font-weight: bold;
    border-bottom: 1px solid #E5E5E5;
  }
  .statuType1{
    text-align: center;
    font-size: 30px;
    padding: 15px;
    color: #E35C5C;
    font-weight: bold;
    border-bottom: 1px solid #E5E5E5;
  }
  .run-table ::-webkit-scrollbar {/*滚动条整体样式*/
    height: 10px !important;
  }
  .app-container>>> .el-table--border {
    border-top: 2px solid #009494;
  }
</style>
