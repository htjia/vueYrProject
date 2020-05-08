<template>
  <PageHeaderLayout>
    <div class="time-search-box">
      <div style="overflow: hidden">
        <el-button
          class="float-right margin-left"
          size="small"
          type="primary"
          @click="viewMoReplace"
        ><svg-icon icon-class="replaceRecord"/> MO源更换记录</el-button>
        <el-button
          class="float-right"
          size="small"
          type="primary"
          @click="viewGpReplaceFun"
        ><svg-icon icon-class="replaceRecord"/> 钢瓶使用记录</el-button>
      </div>
    </div>
    <div v-loading="moLoading" element-loading-text="拼命加载中" class="mo-container">
      <div v-for="(item, index) in machineList" :key="index" style="padding-right: 10px">
        <div class="module-container">
          <div class="module-title">
            <div class="module-title-text">{{ index + 1 }}#MOVCD</div>
            <!--设置按钮-->
            <div
              v-if="!item.mocvdEdit"
              class="view-all margin-left"
              @click="item.mocvdEdit = true"
            ><svg-icon style="color: #009494;font-size: 25px;cursor: pointer;" icon-class="config"/></div>
            <el-button v-if="item.mocvdEdit" class="view-all margin-left" type="primary" size="mini" @click="handleCancel(item)">取 消</el-button>
            <el-button v-if="item.mocvdEdit" class="view-all margin-left" type="primary" size="mini" @click="submitMocvdEdit(item)">确 定</el-button>
            <el-button
              v-if="item.mocvdEdit"
              class="view-all margin-left"
              type="primary"
              size="mini"
              style="background: #5268a4;border-color: #5268a4"
              @click="addMoRow(item.moList)"
            ><svg-icon icon-class="add"/> 新增MO源</el-button>
          </div>
          <div class="module-content">
            <el-table
              v-show="!item.mocvdEdit"
              :data="item.moList"
              :span-method="objectSpanMethod"
              :show-header="false"
              :key="tableKey"
              border
              class="mo-table"
              height="305"
              style="width: 100%; margin-top: 20px">
              <el-table-column
                label="MO源"
                prop="moName"
                align="center"
                show-overflow-tooltip/>
              <el-table-column
                label="内容"
                prop="meta"
                align="left"
                show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-if="scope.row.bottleNo !== null" style="margin-left: 5px">{{ scope.row.meta }} : {{ scope.row.bottleNo }}</span>
                  <span v-if="scope.row.bottleNo === null" style="margin-left: 5px">{{ scope.row.meta }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                width="80"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button class="view-all" style="float: none" type="primary" size="mini" @click="moReplace(item, scope.row)"><svg-icon icon-class="change"/> 更换</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-table
              v-show="item.mocvdEdit"
              :data="item.moList"
              :span-method="objectSpanMethod"
              :show-header="false"
              height="305"
              border
              class="mo-table"
              max-height="305"
              style="width: 100%; margin-top: 20px">
              <el-table-column
                label="MO源"
                show-overflow-tooltip
                align="center">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.moName" size="mini" placeholder="请选择" style="width: 110px;height: 25px;" filterable @change="moNameChange(scope.row, item.moList)">
                    <el-option
                      v-for="item in moOptions"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name"/>
                  </el-select>
                  <i class="addBtn el-icon-circle-plus" @click="addMoItem(scope.row, scope.$index + 1, item.moList)"/>
                </template>
              </el-table-column>
              <el-table-column
                label="内容"
                align="center"
                show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-input v-model="scope.row.meta" class="search-input" size="mini" maxlength="20" style="width: 95%;height: 25px"/>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                width="50"
                align="center"
              >
                <template slot-scope="scope">
                  <i class="deleteBtn el-icon-remove" @click="deleteMoItem(scope.row, scope.$index, item.moList)"/>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="moReplaceDialogVisible"
      class="mo-replace-dialog"
      title="更换MO源"
      width="780px"
    >
      <el-form ref="mocvdForm" :model="mocvdForm" status-icon label-width="120px" label-position="right">
        <div class="replace-title">换上源瓶信息</div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="钢瓶号 " size="small">
              <el-input v-model="mocvdForm.qgph" placeholder="请输入钢瓶号" maxlength="20"/>
            </el-form-item>
            <el-form-item label="毛重 " size="small">
              <el-input v-model="mocvdForm.qmz" placeholder="请输入毛重" maxlength="10" @input="newTotalWeightChange"/>
            </el-form-item>
            <el-form-item label="更换前RunID " size="small">
              <el-select v-model="mocvdForm.qrunid" placeholder="请选择" style="width: 240px" filterable>
                <el-option
                  v-for="item in runList"
                  :key="item.runId"
                  :label="item.runId"
                  :value="item.runId"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="厂家 " size="small">
              <el-input v-model="mocvdForm.qcj" placeholder="请输入厂家" maxlength="20"/>
            </el-form-item>
            <el-form-item label="源重 " size="small">
              <el-input v-model="mocvdForm.qyz" placeholder="请输入源重" maxlength="10" @input="newSoruceChange" @change="newSoruceWeightChange"/>
            </el-form-item>
            <el-form-item label="更换人 " size="small">
              <el-select v-model="mocvdForm.qghr" placeholder="请选择" style="width: 240px" filterable>
                <el-option
                  v-for="item in machineUserList"
                  :key="item.userId"
                  :label="item.userName"
                  :value="item.userId"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注 " prop="qremark" size="small">
          <el-input v-model="mocvdForm.qremark" type="textarea" placeholder="请输入备注" maxlength="50"/>
        </el-form-item>
        <div class="replace-title">换下基本信息</div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="钢瓶号 " size="small">
              <el-input v-model="mocvdForm.hgph" :disabled="true" maxlength="20"/>
            </el-form-item>
            <el-form-item label="毛重 " size="small">
              <el-input v-model="mocvdForm.hmz" :disabled="true" maxlength="20"/>
            </el-form-item>
            <el-form-item label="换下毛重 " size="small">
              <el-input v-model="mocvdForm.hxmz" placeholder="请输入换下毛重" maxlength="10" @input="oldSoruceInputChange" @change="sourceWeightChange"/>
            </el-form-item>
            <el-form-item label="更换前RunID " size="small">
              <el-input v-model="mocvdForm.hrunid" :disabled="true" maxlength="20"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="厂家 " size="small">
              <el-input v-model="mocvdForm.hcj" :disabled="true" maxlength="20"/>
            </el-form-item>
            <el-form-item label="源重 " size="small">
              <el-input v-model="mocvdForm.hyz" :disabled="true" maxlength="20"/>
            </el-form-item>
            <el-form-item label="换下源重 " size="small">
              <el-input v-model="mocvdForm.hxyz" :disabled="true" maxlength="20"/>
            </el-form-item>
            <el-form-item label="剩余百分比" size="small">
              <el-input v-model="mocvdForm.sybfb" :disabled="true" maxlength="20"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注 " size="small">
          <el-input v-model="mocvdForm.hremark" type="textarea" placeholder="请输入备注" maxlength="50"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitForm('mocvdForm')">确 定</el-button>
        <el-button size="small" @click="moReplaceDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="viewMoReplaceDialogVisible"
      class="mo-replace-dialog-view"
      title="MO源更换记录"
      width="1300px"
      @close="viewMoReplaceClose">
      <div style="overflow: hidden;margin-bottom: 10px">
        <div class="input-item">
          <span class="input-title" style="width: 45px;">机台 </span>
          <el-select v-model="searchKeys.sbbh" class="search-input" size="small" placeholder="请选择" filterable>
            <el-option
              v-for="item in machineOptions"
              :key="item.id"
              :label="item.code"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title" style="width: 90px;">MO源类型 </span>
          <el-select v-model="searchKeys.moType" class="search-input" size="small" placeholder="请选择" filterable>
            <el-option
              v-for="item in moOptions"
              :key="item.name"
              :label="item.name"
              :value="item.name"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">更换时间 </span>
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
        <div class="input-item" style="margin-right: 0">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="viewMoReplace" >查 询</el-button>
          <el-button
            size="small"
            type="danger"
            @click="viewMoReplaceClose"
          >
            <svg-icon icon-class="clear"/> 重 置
          </el-button>
        </div>
        <div class="float-right" style="margin-top: 14px">
          <el-button
            class="float-right"
            size="small"
            type="primary"
            @click="handleMoExport"
          ><svg-icon icon-class="export"/> 导出</el-button>
        </div>
      </div>
      <el-table
        v-loading="listLoading"
        :key="tableKey"
        :data="moRecordList"
        class="view-mo-replace"
        element-loading-text="拼命加载中"
        max-height="600"
        border
        fit>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="机台号" align="center" prop="machine" width="60"/>
        <el-table-column label="MO源类型" align="center" prop="moName"/>
        <el-table-column label="操作时间" align="center" prop="operatTime" width="150" show-overflow-tooltip/>
        <el-table-column label="换上钢瓶信息" align="center" prop="mandataryName">
          <el-table-column
            prop="newBottleNo"
            label="钢瓶号"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="newManufacturer"
            label="厂家"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="newTotalWeight"
            label="毛重"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="newSourceWeight"
            label="源重"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="newRunId"
            label="更换前RunID"
            width="100px"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="newRemark"
            label="备注"
            align="center"
            show-overflow-tooltip
          />
        </el-table-column>
        <el-table-column label="换下钢瓶信息" align="center" prop="mandataryName">
          <el-table-column
            prop="oldBottleNo"
            label="钢瓶号"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="oldManufacturer"
            label="厂家"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="oldTotalWeight"
            label="毛重"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="oldSourceWeight"
            label="源重"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="oldRunId"
            label="更换前RunID"
            width="100px"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="oldRemark"
            label="备注"
            align="center"
            show-overflow-tooltip
          />
        </el-table-column>
        <el-table-column label="操作人 " align="center" prop="operator"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-pagination
          :current-page="pageNum"
          :page-sizes="[15, 30, 40]"
          :page-size="pageSize"
          :total="totalPage"
          class="pagination"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="sizeChange"
          @current-change="currentChange"
        />
        <div style="padding-bottom: 50px"/>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="viewGpReplaceDialogVisible"
      class="mo-replace-dialog-view"
      title="钢瓶使用记录"
      width="1300px"
      @close="viewGpReplaceClose">
      <div style="overflow: hidden;margin-bottom: 10px">
        <div class="input-item">
          <span class="input-title">钢瓶号 </span>
          <el-input v-model="searchKeys.gph" class="search-input" placeholder="请输入钢瓶号" size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item">
          <span class="input-title" style="width: 65px;">厂家 </span>
          <el-input v-model="searchKeys.cj" class="search-input" placeholder="请输入厂家" size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item">
          <span class="input-title">源瓶种类 </span>
          <el-select v-model="searchKeys.ypzl" class="search-input" size="small" placeholder="请选择" filterable>
            <el-option
              v-for="item in moOptions"
              :key="item.name"
              :label="item.name"
              :value="item.name"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">机台 </span>
          <el-select v-model="searchKeys.jt" class="search-input" size="small" placeholder="请选择" filterable>
            <el-option
              v-for="item in machineOptions"
              :key="item.id"
              :label="item.code"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item" style="margin-right: 0">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="viewGpReplaceFun" >查 询</el-button>
          <el-button
            size="small"
            type="danger"
            @click="viewGpReplaceClose"
          >
            <svg-icon icon-class="clear"/> 重 置
          </el-button>
        </div>
        <div class="float-right" style="margin-top: 14px">
          <el-button
            class="float-right"
            size="small"
            type="primary"
            @click="handleExport"
          ><svg-icon icon-class="export"/> 导出</el-button>
        </div>
      </div>
      <el-table
        v-loading="listLoading"
        :key="tableKey"
        :data="bottleList"
        class="view-mo-replace"
        element-loading-text="拼命加载中"
        max-height="566"
        border
        fit>
        <el-table-column align="center" label="钢瓶号" prop="newBottleNo" show-overflow-tooltip/>
        <el-table-column label="厂家" align="center" prop="newManufacturer" show-overflow-tooltip/>
        <el-table-column label="机台" align="center" prop="machine" width="50"/>
        <el-table-column label="源瓶种类" align="center" prop="moName" width="80"/>
        <el-table-column label="换上RunID" align="center" prop="newRunId" width="100"/>
        <el-table-column label="换上毛重" align="center" prop="newTotalWeight" width="70"/>
        <el-table-column label="换上源重 " align="center" prop="newSourceWeight" width="70"/>
        <el-table-column label="换上备注 " align="center" prop="newRemark" show-overflow-tooltip/>
        <el-table-column label="换下RunID " align="center" prop="oldRunId" width="100"/>
        <el-table-column label="换下毛重 " align="center" prop="oldTotalWeight" width="70"/>
        <el-table-column label="换下源重 " align="center" prop="oldSourceWeight" width="70"/>
        <el-table-column label="剩余百分比" align="center" prop="percent" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.percent !== null && scope.row.percent !== ''">{{ scope.row.percent + '%' }}</span>
            <span v-if="scope.row.percent === null"/>
            <span v-if="scope.row.percent === ''"/>
          </template>
        </el-table-column>
        <el-table-column label="换下备注 " align="center" prop="oldRemark" show-overflow-tooltip/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="viewGpReplaceDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .view-mo-replace ::-webkit-scrollbar {/*滚动条整体样式*/
    height: 10px !important;
  }
  .app-container{
    height: calc(100vh - 131px);
  }
  .mo-container{
    width: calc(100% + 10px);
    min-height: 800px;
    overflow: hidden;
    margin-bottom: 10px;
  }
  .mo-container>div{
    margin-bottom: 10px;
    float: left;
    width: 33.33%;
  }
  .module-content{
    /*padding-top: 10px;*/
    padding-bottom: 10px;
    height: 330px;
    overflow-y: auto;
  }
  .mo-table{
    margin: 0 !important;
  }
  /*.mo-table>>>.el-table__header-wrapper{*/
    /*display: none;*/
    /*!*opacity: 0;*!*/
  /*}*/
  /*.mo-table>>>.el-table__body-wrapper{*/
    /*height: 228px !important;*/
  /*}*/
  .mo-table>>> .el-table__body tr:hover > td {
    background-color: #fff !important;
  }
  .mo-table>>> .cell{
    line-height: 29px;
  }
  .mo-table>>> td{
    height: 29px;
  }
  .addBtn{
    font-size: 22px;
    color: #009494;
    cursor: pointer;
    vertical-align: middle;
  }
  .deleteBtn{
    font-size: 22px;
    color: #d56c28;
    cursor: pointer;
    vertical-align: middle;
  }
  .mo-table>>>.el-input--mini .el-input__inner {
    height: 24px;
    line-height: 24px;
  }
  .mo-table>>>.el-button--primary {
    padding: 5px 10px;
    height: 24px;
  }
  .replace-title{
    line-height: 30px;
    border-bottom: 1px solid #e2e2e2;
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .mo-replace-dialog>>>.el-dialog__body {
    padding-top: 15px;
  }
  .mo-replace-dialog-view>>>.el-dialog__body {
    padding-top: 0px;
  }
  .mo-replace-dialog>>>.el-form-item{
    margin-bottom: 10px;
  }
  .input-item{
    float: left;
    margin-top: 14px;
    margin-right: 10px;
  }
  .search-input{
    width: 140px;
  }
  @media (max-width: 1632px) {
    /*.el-form-item--small.el-form-item {*/
      /*margin-bottom: 5px;*/
    /*}*/
  }
</style>
