<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto">
      <div class="header-btn-group" style="height: 45px;">
        <div style="float: left; margin-right: 15px">
          <el-button
            size="small"
            type="primary"
            @click="addDialog"
          ><svg-icon icon-class="add"/> 新增</el-button>
          <el-button
            size="small"
            type="primary"
            @click="addDialogs"
          ><svg-icon icon-class="canzhaoxz"/> 参照新增</el-button>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-edit"
            @click="editInfo"
          > 编辑</el-button>
          <el-button
            size="small"
            type="danger"
            icon="el-icon-delete"
            @click="deleteInfo"
          > 删除</el-button>
        </div>
        <el-upload
          ref="upload"
          :auto-upload="true"
          :on-success="onSuccess"
          :on-error="onError"
          :action="fileUrl"
          :show-file-list="false"
          :before-upload="beforeUpload"
          :with-credentials="true"
          style="float: left; margin-right: 15px"
          accept=".xls,.xlsx"
          class="upload-demo"
        >
          <el-button v-loading="loading" slot="trigger" size="small" type="primary"><svg-icon icon-class="import"/>  片源导入</el-button>
        </el-upload>
        <el-button
          size="small"
          type="primary"
          @click="openLog"
        ><svg-icon icon-class="wenben"/>  导入记录</el-button>
      </div>
      <div class="search-box">
        <div class="left-search-box" style="margin-left: -20px;">
          <div class="input-item">
            <span class="input-title" style="width: 80px;">WaferID </span>
            <el-input v-model="chipNo" class="search-input" style="width: 210px" placeholder="请输入WaferID" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">TapeNo </span>
            <el-input v-model="tapeNo" class="search-input" style="width: 180px" placeholder="请输入TapeNo" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">产品型号 </span>
            <el-select v-model="productModel" class="search-input" style="width: 120px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in productLists"
                :key="item.id"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 50px;">机台号</span>
            <el-select v-model="machineInfo" class="search-input" style="width: 80px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in machineList"
                :key="item.id"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item">
            <el-radio-group v-model="timeRadio" style="margin-left: 15px;">
              <el-radio :label="0" style="margin-right: 10px;">下bin时间</el-radio>
              <el-radio :label="1">导入时间</el-radio>
            </el-radio-group>
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
        </div>
        <div class="right-btn-box">
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
    <div class="app-container">
      <div v-if="selectTheadVisble" class="select-thead">
        <div class="options-box" style="height: 300px;overflow-y: auto;">
          <el-checkbox-group v-model="checkboxVal">
            <el-checkbox v-for="(option, index) in formTheadOptions" :key="index" :label="option" :disabled="index<3" style="width: 180px;margin-left: 15px;margin: 5px;">
              {{ option.thName }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <el-button type="primary" size="mini" style="margin-left: 25px" @click="submitOption">确 定</el-button>
        <el-button size="mini" @click="selectTheadVisble = false">取 消</el-button>
      </div>
      <div style="line-height: 40px;">
        &nbsp;
        <el-button type="text" class="select-thead-btn" @click="selectThead"><svg-icon icon-class="shezhi"/> 设置显示列</el-button>
        <el-button type="text" class="select-thead-btn" style="right:30px" icon="el-icon-sold-out" @click="importExcel">导出</el-button>
      </div>
      <!--单据信息-->
      <el-table
        v-loading="listLoading"
        ref="listTabel"
        :data="list"
        class="broad-scrollbar-table"
        style="margin-top:-15px"
        element-loading-text="拼命加载中"
        height="calc(100vh - 362px)"
        highlight-current-row
        border
        fit
        @current-change="handleCurrentChange"
      >
        <el-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
          </template>
        </el-table-column>
        <el-table-column label="WaferID" align="center" prop="waferNo" width="200px" fixed/>
        <el-table-column label="TapeNo" align="center" prop="tapeNo" width="200px" fixed/>
        <el-table-column v-for="item in formThead" v-if="item.thName !== '序号'&&item.thName !== 'WaferID'&&item.thName !== 'TapeNo'" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="item.thKey==='filePath'">
              <div v-if="scope.row.filePath !== null" style="color: #009494;font-weight: bold;cursor: pointer;text-decoration:underline" @click="download(scope.row)">文档</div>
              <span v-if="scope.row.filePath === null">无</span>
            </span>
            <span v-if="item.thKey!=='filePath'">
              <span v-if="item.thName.indexOf('良率')<0">{{ scope.row[item.thKey] }}</span>
              <span v-if="item.thName.indexOf('良率')>-1">{{ (parseFloat(scope.row[item.thKey])*100).toFixed(2) }}%</span>
            </span>
          </template>
        </el-table-column>
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
      title="新增"
      width="1200px"
      @close="handleClose('dialogForm')">
      <el-form ref="dialogForm" :model="dialogForm" :rules="rules" size="small" status-icon label-width="125px" label-position="right">
        <div class="tits" style="margin-top: -15px;">
          <div class="bords">基本参数</div>
        </div>
        <el-row>
          <el-col :span="6">
            <el-form-item label="WaferID " prop="waferNo">
              <el-input v-model="dialogForm.waferNo" size="small" placeholder="请输入" maxlength="100"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="产品型号 " prop="taskModel">
              <el-select v-model="dialogForm.taskModel" size="small" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in productLists"
                  :key="item.id"
                  :label="item.code"
                  :value="item.code"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="外延尺寸 " prop="measrue">
              <el-select v-model="dialogForm.measrue" size="small" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in measureList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="颗粒数 " prop="sliceCount">
              <el-input v-model="dialogForm.sliceCount" size="small" placeholder="请输入" maxlength="10"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="测试电流(mA) " prop="electricity">
              <el-input v-model="dialogForm.electricity" size="small" placeholder="请输入" maxlength="10"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="测试机台 " prop="machine">
              <el-input v-model="dialogForm.machine" size="small" placeholder="请输入" maxlength="3"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="品质等级 " prop="classify">
              <el-select v-model="dialogForm.classify" class="dialog-input" size="small" placeholder="请选择" filterable clearable>
                <el-option-group
                  v-for="group in exceptionCode"
                  :key="group.label"
                  :label="group.label"
                >
                  <el-option
                    v-for="item in group.options"
                    :key="item.id"
                    :label="item.code + ' (' + item.name + ')'"
                    :value="item.code"/>
                </el-option-group>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="测试时间 " prop="testTime" style="margin-bottom: 0px;">
              <el-date-picker
                v-model="dialogForm.testTime"
                :editable="false"
                size="small"
                type="datetime"
                style="width: 100%"
                placeholder="选择日期"
                format="yyyy-MM-dd HH:mm"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="导入时间 " prop="importTime" style="margin-bottom: 0px;">
              <el-date-picker
                v-model="dialogForm.importTime"
                :editable="false"
                size="small"
                type="datetime"
                style="width: 100%"
                placeholder="选择日期"
                format="yyyy-MM-dd HH:mm"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="ESD测试电流 " prop="esdElec">
              <el-input v-model="dialogForm.esdElec" size="small" placeholder="请输入" maxlength="10"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="研磨厚度 " prop="grind">
              <el-input v-model="dialogForm.grind" size="small" placeholder="请输入" maxlength="10"/>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="tits">
          <div class="bords">光电参数</div>
        </div>
        <el-row>
          <el-col :span="6">
            <el-form-item label="HW1均值 " prop="hwAvg">
              <el-input v-model="dialogForm.hwAvg" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="综合良率 " prop="compreYield">
              <el-input v-model="dialogForm.compreYield" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VF1良率 " prop="vf1Yield">
              <el-input v-model="dialogForm.vf1Yield" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VF2良率 " prop="vf2Yield">
              <el-input v-model="dialogForm.vf2Yield" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VF3良率 " prop="vf3Yield">
              <el-input v-model="dialogForm.vf3Yield" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VF4良率 " prop="vf4Yield">
              <el-input v-model="dialogForm.vf4Yield" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="IR良率 " prop="irYield">
              <el-input v-model="dialogForm.irYield" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="DVF良率 " prop="dvfYield">
              <el-input v-model="dialogForm.dvfYield" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="WLD良率 " prop="wldYield">
              <el-input v-model="dialogForm.wldYield" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="WLP良率 " prop="wlpYield">
              <el-input v-model="dialogForm.wlpYield" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="WLC良率 " prop="wlcYield">
              <el-input v-model="dialogForm.wlcYield" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VZ良率 " prop="vzYield">
              <el-input v-model="dialogForm.vzYield" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="LOP1良率 " prop="ivYield">
              <el-input v-model="dialogForm.ivYield" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="ESD_IR_A良率 " prop="irEsdAYield">
              <el-input v-model="dialogForm.irEsdAYield" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="WLD_5nm良率 " prop="wldNm5Yield">
              <el-input v-model="dialogForm.wldNm5Yield" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="WLP_5nm良率 " prop="wlpNm5Yield">
              <el-input v-model="dialogForm.wlpNm5Yield" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="WLD_MIN " prop="wldMin">
              <el-input v-model="dialogForm.wldMin" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="WLD_AVG " prop="wldAvg">
              <el-input v-model="dialogForm.wldAvg" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="WLD_MAX " prop="wldMax">
              <el-input v-model="dialogForm.wldMax" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="WLD_STD " prop="wldStd">
              <el-input v-model="dialogForm.wldStd" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="LOP1_MIN " prop="ivMin">
              <el-input v-model="dialogForm.ivMin" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="LOP1_AVG " prop="ivAvg">
              <el-input v-model="dialogForm.ivAvg" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="LOP1_MAX " prop="ivMax">
              <el-input v-model="dialogForm.ivMax" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="LOP1_STD " prop="ivStd">
              <el-input v-model="dialogForm.ivStd" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VF1_MIN " prop="vf1Min">
              <el-input v-model="dialogForm.vf1Min" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VF1_AVG " prop="vf1Avg">
              <el-input v-model="dialogForm.vf1Avg" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VF1_MAX " prop="vf1Max">
              <el-input v-model="dialogForm.vf1Max" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VF1_STD " prop="vf1Std">
              <el-input v-model="dialogForm.vf1Std" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VF2_MIN " prop="vf2Min">
              <el-input v-model="dialogForm.vf2Min" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VF2_AVG " prop="vf2Avg">
              <el-input v-model="dialogForm.vf2Avg" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VF2_MAX " prop="vf2Max">
              <el-input v-model="dialogForm.vf2Max" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VF2_STD " prop="vf2Std">
              <el-input v-model="dialogForm.vf2Std" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VF3_MIN " prop="vf3Min">
              <el-input v-model="dialogForm.vf3Min" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VF3_AVG " prop="vf3Avg">
              <el-input v-model="dialogForm.vf3Avg" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VF3_MAX " prop="vf3Max">
              <el-input v-model="dialogForm.vf3Max" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VF3_STD " prop="vf3Std">
              <el-input v-model="dialogForm.vf3Std" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VF4_MIN " prop="vf4Min">
              <el-input v-model="dialogForm.vf4Min" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VF4_AVG " prop="vf4Avg">
              <el-input v-model="dialogForm.vf4Avg" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VF4_MAX " prop="vf4Max">
              <el-input v-model="dialogForm.vf4Max" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VF4_STD " prop="vf4Std">
              <el-input v-model="dialogForm.vf4Std" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="IR_MIN " prop="irMin">
              <el-input v-model="dialogForm.irMin" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="IR_AVG " prop="irAvg">
              <el-input v-model="dialogForm.irAvg" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="IR_MAX " prop="irMax">
              <el-input v-model="dialogForm.irMax" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="IR_STD " prop="irStd">
              <el-input v-model="dialogForm.irStd" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VZ_MIN " prop="vzMin">
              <el-input v-model="dialogForm.vzMin" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VZ_AVG " prop="vzAvg">
              <el-input v-model="dialogForm.vzAvg" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VZ_MAX " prop="vzMax">
              <el-input v-model="dialogForm.vzMax" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VZ_STD " prop="vzStd">
              <el-input v-model="dialogForm.vzStd" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="WLP_MIN " prop="wlpMin">
              <el-input v-model="dialogForm.wlpMin" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="WLP_AVG " prop="wlpAvg">
              <el-input v-model="dialogForm.wlpAvg" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="WLP_MAX " prop="wlpMax">
              <el-input v-model="dialogForm.wlpMax" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="WLP_STD " prop="wlpStd">
              <el-input v-model="dialogForm.wlpStd" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="WLC_MIN " prop="wlcMin">
              <el-input v-model="dialogForm.wlcMin" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="WLC_AVG " prop="wlcAvg">
              <el-input v-model="dialogForm.wlcAvg" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="WLC_MAX " prop="wlcMax">
              <el-input v-model="dialogForm.wlcMax" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="WLC_STD " prop="wlcStd">
              <el-input v-model="dialogForm.wlcStd" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:right;width:100%">
        <el-button type="primary" @click="save('dialogForm')">确 定</el-button>
        <el-button type="primary" @click="resetForm('dialogForm')">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="编辑"
      width="1200px"
      @close="handleClose('dialogForm')">
      <el-form ref="dialogForm" :model="dialogForm" :rules="rules" size="small" status-icon label-width="125px" label-position="right">
        <div class="tits" style="margin-top: -15px;">
          <div class="bords">基本参数</div>
        </div>
        <el-row>
          <el-col :span="6">
            <el-form-item label="WaferID " prop="code">
              <el-input v-model="dialogForm.waferNo" size="small" placeholder="请输入" maxlength="100"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="TapeNo " prop="tapeNo">
              <el-input v-model="dialogForm.tapeNo" size="small" placeholder="请输入" maxlength="50"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="产品型号 " prop="code">
              <el-select v-model="dialogForm.taskModel" size="small" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in productLists"
                  :key="item.id"
                  :label="item.code"
                  :value="item.code"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="外延尺寸 " prop="measrue">
              <el-select v-model="dialogForm.measrue" size="small" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in measureList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="颗粒数 " prop="sliceCount">
              <el-input v-model="dialogForm.sliceCount" size="small" placeholder="请输入" maxlength="10"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="测试电流(mA) " prop="electricity">
              <el-input v-model="dialogForm.electricity" size="small" placeholder="请输入" maxlength="10"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="测试机台 " prop="machine">
              <el-input v-model="dialogForm.machine" size="small" placeholder="请输入" maxlength="3"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="品质等级 " prop="classify">
              <el-select v-model="dialogForm.classify" class="dialog-input" size="small" placeholder="请选择" filterable clearable>
                <el-option-group
                  v-for="group in exceptionCode"
                  :key="group.label"
                  :label="group.label"
                >
                  <el-option
                    v-for="item in group.options"
                    :key="item.id"
                    :label="item.code + ' (' + item.name + ')'"
                    :value="item.code"/>
                </el-option-group>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="测试时间 " prop="testTime" style="margin-bottom: 0px;">
              <el-date-picker
                v-model="dialogForm.testTime"
                :editable="false"
                size="small"
                type="datetime"
                style="width: 100%"
                placeholder="选择日期"
                format="yyyy-MM-dd HH:mm"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="导入时间 " prop="importTime" style="margin-bottom: 0px;">
              <el-date-picker
                v-model="dialogForm.importTime"
                :editable="false"
                size="small"
                type="datetime"
                style="width: 100%"
                placeholder="选择日期"
                format="yyyy-MM-dd HH:mm"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="ESD测试电流 " prop="esdElec">
              <el-input v-model="dialogForm.esdElec" size="small" placeholder="请输入" maxlength="10"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="研磨厚度 " prop="grind">
              <el-input v-model="dialogForm.grind" size="small" placeholder="请输入" maxlength="10"/>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="tits">
          <div class="bords">光电参数</div>
        </div>
        <el-row>
          <el-col :span="6">
            <el-form-item label="HW1均值 " prop="hwAvg">
              <el-input v-model="dialogForm.hwAvg" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="综合良率 " prop="compreYield">
              <el-input v-model="dialogForm.compreYield" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VF1良率 " prop="vf1Yield">
              <el-input v-model="dialogForm.vf1Yield" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VF2良率 " prop="vf2Yield">
              <el-input v-model="dialogForm.vf2Yield" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VF3良率 " prop="vf3Yield">
              <el-input v-model="dialogForm.vf3Yield" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VF4良率 " prop="vf4Yield">
              <el-input v-model="dialogForm.vf4Yield" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="IR良率 " prop="irYield">
              <el-input v-model="dialogForm.irYield" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="DVF良率 " prop="dvfYield">
              <el-input v-model="dialogForm.dvfYield" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="WLD良率 " prop="wldYield">
              <el-input v-model="dialogForm.wldYield" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="WLP良率 " prop="wlpYield">
              <el-input v-model="dialogForm.wlpYield" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="WLC良率 " prop="wlcYield">
              <el-input v-model="dialogForm.wlcYield" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VZ良率 " prop="vzYield">
              <el-input v-model="dialogForm.vzYield" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="LOP1良率 " prop="ivYield">
              <el-input v-model="dialogForm.ivYield" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="ESD_IR_A良率 " prop="irEsdAYield">
              <el-input v-model="dialogForm.irEsdAYield" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="WLD_5nm良率 " prop="wldNm5Yield">
              <el-input v-model="dialogForm.wldNm5Yield" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="WLP_5nm良率 " prop="wlpNm5Yield">
              <el-input v-model="dialogForm.wlpNm5Yield" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="WLD_MIN " prop="wldMin">
              <el-input v-model="dialogForm.wldMin" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="WLD_AVG " prop="wldAvg">
              <el-input v-model="dialogForm.wldAvg" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="WLD_MAX " prop="wldMax">
              <el-input v-model="dialogForm.wldMax" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="WLD_STD " prop="wldStd">
              <el-input v-model="dialogForm.wldStd" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="LOP1_MIN " prop="ivMin">
              <el-input v-model="dialogForm.ivMin" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="LOP1_AVG " prop="ivAvg">
              <el-input v-model="dialogForm.ivAvg" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="LOP1_MAX " prop="ivMax">
              <el-input v-model="dialogForm.ivMax" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="LOP1_STD " prop="ivStd">
              <el-input v-model="dialogForm.ivStd" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VF1_MIN " prop="vf1Min">
              <el-input v-model="dialogForm.vf1Min" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VF1_AVG " prop="vf1Avg">
              <el-input v-model="dialogForm.vf1Avg" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VF1_MAX " prop="vf1Max">
              <el-input v-model="dialogForm.vf1Max" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VF1_STD " prop="vf1Std">
              <el-input v-model="dialogForm.vf1Std" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VF2_MIN " prop="vf2Min">
              <el-input v-model="dialogForm.vf2Min" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VF2_AVG " prop="vf2Avg">
              <el-input v-model="dialogForm.vf2Avg" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VF2_MAX " prop="vf2Max">
              <el-input v-model="dialogForm.vf2Max" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VF2_STD " prop="vf2Std">
              <el-input v-model="dialogForm.vf2Std" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VF3_MIN " prop="vf3Min">
              <el-input v-model="dialogForm.vf3Min" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VF3_AVG " prop="vf3Avg">
              <el-input v-model="dialogForm.vf3Avg" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VF3_MAX " prop="vf3Max">
              <el-input v-model="dialogForm.vf3Max" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VF3_STD " prop="vf3Std">
              <el-input v-model="dialogForm.vf3Std" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VF4_MIN " prop="vf4Min">
              <el-input v-model="dialogForm.vf4Min" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VF4_AVG " prop="vf4Avg">
              <el-input v-model="dialogForm.vf4Avg" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VF4_MAX " prop="vf4Max">
              <el-input v-model="dialogForm.vf4Max" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VF4_STD " prop="vf4Std">
              <el-input v-model="dialogForm.vf4Std" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="IR_MIN " prop="irMin">
              <el-input v-model="dialogForm.irMin" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="IR_AVG " prop="irAvg">
              <el-input v-model="dialogForm.irAvg" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="IR_MAX " prop="irMax">
              <el-input v-model="dialogForm.irMax" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="IR_STD " prop="irStd">
              <el-input v-model="dialogForm.irStd" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VZ_MIN " prop="vzMin">
              <el-input v-model="dialogForm.vzMin" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VZ_AVG " prop="vzAvg">
              <el-input v-model="dialogForm.vzAvg" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VZ_MAX " prop="vzMax">
              <el-input v-model="dialogForm.vzMax" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="VZ_STD " prop="vzStd">
              <el-input v-model="dialogForm.vzStd" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="WLP_MIN " prop="wlpMin">
              <el-input v-model="dialogForm.wlpMin" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="WLP_AVG " prop="wlpAvg">
              <el-input v-model="dialogForm.wlpAvg" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="WLP_MAX " prop="wlpMax">
              <el-input v-model="dialogForm.wlpMax" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="WLP_STD " prop="wlpStd">
              <el-input v-model="dialogForm.wlpStd" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="WLC_MIN " prop="wlcMin">
              <el-input v-model="dialogForm.wlcMin" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="WLC_AVG " prop="wlcAvg">
              <el-input v-model="dialogForm.wlcAvg" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="WLC_MAX " prop="wlcMax">
              <el-input v-model="dialogForm.wlcMax" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="WLC_STD " prop="wlcStd">
              <el-input v-model="dialogForm.wlcStd" size="small" placeholder="请输入" maxlength="9"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:right;width:100%">
        <el-button type="primary" @click="update('dialogForm')">确 定</el-button>
        <el-button type="primary" @click="resetForm('dialogForm')">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="logDialogVisible"
      title="导入记录"
      width="1200px">
      <el-row style="margin-top: -30px">
        <el-col :span="24">
          <div class="input-item">
            <span class="input-title" style="width:50px">文件名 </span>
            <el-input v-model="fileName" class="search-input style-input" style="width: 122px !important" placeholder="请输入文件名" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title" style="width:65px">操作人 </span>
            <el-input v-model="optName" class="search-input style-input" style="width:130px" placeholder="请输入操作人" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">导入日期 </span>
            <el-date-picker
              v-model="logbeginDate"
              :picker-options="logpickerOptionsStart"
              :editable="false"
              class="search-input"
              style="width:127px"
              size="small"
              type="date"
              placeholder="开始日期"
              value-format="timestamp"
              clearable
            />
            <span style="display:inline-block;width: 38px;text-align: center"> 至 </span>
            <el-date-picker
              v-model="logendDate"
              :picker-options="logpickerOptionsEnd"
              :editable="false"
              class="search-input"
              style="width:127px"
              size="small"
              type="date"
              placeholder="结束日期"
              value-format="timestamp"
              clearable
            />
          </div>
          <div class="input-item">
            <el-button
              size="small"
              type="primary"
              @click="handleSearchLog"
            ><svg-icon icon-class="importRecords"/> 查询</el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleClearLog"
            ><svg-icon icon-class="clear"/> 重置</el-button>
          </div>
        </el-col>
      </el-row>
      <el-table
        :data="logList"
        element-loading-text="拼命加载中"
        class="broad-scrollbar-table ste tip-out-inner-dialog sses"
        style="margin-top:15px"
        height="400px"
        border
        fit>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
          </template>
        </el-table-column>
        <el-table-column label="文件名" align="center" prop="fileName" show-overflow-tooltip/>
        <el-table-column label="导入时间" align="center" prop="operateTime" width="150px" show-overflow-tooltip/>
        <el-table-column label="操作人" align="center" prop="operatorName" width="120px" show-overflow-tooltip/>
        <el-table-column label="操作" align="center" width="180px">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.isDeleted === 0"
              size="mini"
              type="primary"
              @click="setReprot(scope.row)"
            >撤销导入</el-button>
            <span v-if="scope.row.isDeleted === 1">已撤销</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="logtotalPage>12"
        :current-page="logpageNum"
        :page-sizes="[12, 30, 40]"
        :page-size="logpageSize"
        :total="logtotalPage"
        class="pagination"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="logsizeChange"
        @current-change="logcurrentChange"
      />
      <div slot="footer" class="dialog-footer" style="text-align:right;width:100%">
        <el-button type="primary" @click="logDialogVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .bords{
    border-left: 3px solid #009494;
    padding-left: 10px;
    font-size: 14px;
    font-weight: bold;
  }
  .tits{
    border-bottom: 1px solid #e5e5e5;
    padding-bottom: 7px;
    margin-bottom: 15px;
    margin-top:15px;
  }
  .tip-out-inner-dialog>>>.el-checkbox{
    margin-left: 20px;
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
    height: calc(100vh - 260px);
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
  .app-container>>> .el-table--border {
    border-top: 2px solid #009494;
  }
  .select-thead-btn{
    height: 42px;
    position: absolute;
    z-index: 200;
    right: 110px;
    top: 0px;
    border: 0px;
  }
  .select-thead-btn:hover{
    color: #009688;
    background: transparent;
    border: 0px;
  }
  .select-thead-btn:focus{
    color: #009688;
    background: transparent;
    border: 0px;
  }
  .select-thead{
    width: 200px;
    height: 335px;
    border: 1px solid #e2e2e2;
    position: absolute;
    z-index: 200;
    background: #fff;
    right: 15px;
    top: 45px;
  }
  .broad-scrollbar-table >>> .el-table__fixed {
    background: #fff;
    height: calc(100% - 13px) !important;
  }
  .broad-scrollbar-table >>> .el-table__fixed-body-wrapper {
    background: #fff;
    height: calc(100% - 42px) !important;
  }
  .app-container >>> .el-form-item{
    margin-bottom: 0px;
  }
</style>
