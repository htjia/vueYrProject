<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto">
      <div class="header-btn-group">
        <el-button
          size="small"
          type="primary"
          @click="addNew"
        ><svg-icon icon-class="add"/> 新增送片单</el-button>
        <el-button
          size="small"
          type="primary"
          @click="setRK"
        ><svg-icon icon-class="shezhi"/> 入库设置</el-button>
        <el-button
          size="small"
          class="float-right"
          type="primary"
          @click="importExcel"
        ><svg-icon icon-class="export"/> 导出</el-button>
        <el-button
          size="small"
          class="float-right"
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
          <div class="input-item" style="margin-right:5px">
            <span class="input-title" style="width: 40px">片号 </span>
            <el-input v-model="waferNo" class="search-input" style="width: 180px" placeholder="请输入片号" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <!-- <span class="input-title">时间 </span> -->
            <el-radio-group v-model="timeRadio" style="margin-left:15px">
              <el-radio :label="0">制单日期</el-radio>
              <el-radio :label="1">审核日期</el-radio>
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
              class="search-input"
              style="width: 130px"
              size="small"
              type="date"
              placeholder="选择结束日期"
              value-format="timestamp"
            />
          </div>
          <div class="input-item">
            <span class="input-title">单据类型 </span>
            <el-select v-model="billType" style="width: 80px" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">产品型号 </span>
            <el-select v-model="procucts" class="search-input" style="width: 120px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in productModelOptions"
                :key="item.id"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">入库片型 </span>
            <el-select v-model="sliceType" class="search-input" style="width: 80px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in typesList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">投片类型</span>
            <el-select v-model="tpType" class="search-input" style="width: 100px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in tipOutOptions"
                :key="item.name"
                :label="item.name"
                :value="item.name"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 40px">状态 </span>
            <el-select v-model="status" class="search-input" style="width: 110px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in statusList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
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
          Wafer信息TOL: <span v-text="anotherList.length"/>
        </div>
      </div>
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
      <div style="margin-bottom: -16px;">
        &nbsp;
        <el-button v-if="isActive === 1 &&rowInfo!==null && rowInfo.sliceType === 0" type="text" class="select-thead-btn" @click="selectThead"><svg-icon icon-class="shezhi"/> 设置显示列</el-button>
        <el-button v-if="isActive === 1 &&rowInfo!==null && rowInfo.sliceType === 1" type="text" class="select-thead-btn" @click="selectTheadf"><svg-icon icon-class="shezhi"/> 设置显示列</el-button>
      </div>
      <div v-if="selectfTheadVisble" class="select-thead">
        <div class="options-box" style="height: 300px;overflow-y: auto;">
          <el-checkbox-group v-model="checkboxfVal">
            <el-checkbox v-for="(option, index) in formTheadfOptions" :key="index" :label="option" :disabled="index<3" style="width: 180px;margin-left: 15px;margin: 5px;">
              {{ option.thName }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <el-button type="primary" size="mini" style="margin-left: 25px" @click="submitOptionf">确 定</el-button>
        <el-button size="mini" @click="selectfTheadVisble = false">取 消</el-button>
      </div>
      <!-- <div v-if="isActive === 1 &&rowInfo!==null && rowInfo.sliceType === 1" style="margin-bottom: -16px;">
        &nbsp;
        <el-button type="text" class="select-thead-btn" @click="selectTheadf"><svg-icon icon-class="shezhi"/> 设置显示列</el-button>
      </div> -->
      <!--单据信息-->
      <el-table
        v-loading="listLoading"
        v-show="isActive === 0"
        ref="listTabel"
        :data="list"
        class="broad-scrollbar-table"
        element-loading-text="拼命加载中"
        height="calc(100vh - 422px)"
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
        <el-table-column label="送片单号" align="center" prop="code" width="120" fixed show-overflow-tooltip/>
        <el-table-column label="单据类型" align="center" prop="billType" width="120" fixed show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.billType === 0">正常</span>
            <span v-if="scope.row.billType === 1">返工</span>
          </template>
        </el-table-column>
        <el-table-column label="产品型号" align="center" prop="taskModel" width="120" show-overflow-tooltip/>
        <el-table-column label="任务状态" align="center" prop="status" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0" style="color:#ee7e31;font-weight:bold">待审核</span>
            <span v-if="scope.row.status === 1" style="color:#1ABC9C;font-weight:bold">通过</span>
            <span v-if="scope.row.status === 2" style="color:#E25D5D;font-weight:bold">不通过</span>
            <span v-if="scope.row.status === 3" style="color:#3CB371;font-weight:bold">入库完成</span>
            <span v-if="scope.row.status === 4" style="color:#E25D5D;font-weight:bold">仓库退回</span>
          </template>
        </el-table-column>
        <el-table-column label="片型" align="center" prop="sliceType" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.sliceType === 0">圆片</span>
            <span v-if="scope.row.sliceType === 1">方片</span>
          </template>
        </el-table-column>
        <el-table-column label="投片类型" align="center" prop="category" width="120" show-overflow-tooltip/>
        <el-table-column label="片数" align="center" prop="sliceCount" width="120" show-overflow-tooltip/>
        <el-table-column label="数量" align="center" prop="chipCount" width="120" show-overflow-tooltip/>
        <el-table-column label="光色" align="center" prop="color" width="120" show-overflow-tooltip/>
        <el-table-column label="型号" align="center" prop="model" width="120" show-overflow-tooltip/>
        <el-table-column label="工艺" align="center" prop="craft" width="120" show-overflow-tooltip/>
        <el-table-column label="尺寸" align="center" prop="size" width="120" show-overflow-tooltip/>
        <el-table-column label="品质等级" align="center" prop="quality" width="120" show-overflow-tooltip/>
        <el-table-column label="外观等级" align="center" prop="classify" width="120" show-overflow-tooltip/>
        <el-table-column label="是否清洗" align="center" prop="isClean" width="120" show-overflow-tooltip/>
        <el-table-column label="是否满BIN" align="center" prop="fullBin" width="100" show-overflow-tooltip/>
        <el-table-column label="波段" align="center" prop="band" width="100" show-overflow-tooltip/>
        <el-table-column label="制单人" align="center" prop="creatorName" width="100" show-overflow-tooltip/>
        <el-table-column label="制单日期" align="center" prop="createTime" width="100" show-overflow-tooltip/>
        <el-table-column label="审核人" align="center" prop="auditorName" width="100" show-overflow-tooltip/>
        <el-table-column label="审核日期" align="center" prop="auditTime" width="100" show-overflow-tooltip/>
        <el-table-column label="备注" align="center" prop="remark" width="100" show-overflow-tooltip/>
        <el-table-column label="操作" align="center" width="200px" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status === 0"
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
            >修改</el-button>
            <el-button
              v-if="scope.row.status === 0 || scope.row.status === 2"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
            >删除</el-button>
            <el-button
              v-if="scope.row.status === 2"
              size="mini"
              class="buttonTypechuli"
              @click="handleEdit(scope.row)"
            ><svg-icon icon-class="chulixx"/> 处理</el-button>
            <el-button
              v-if="scope.row.status === 1"
              size="mini"
              type="primary"
              icon="el-icon-search"
              @click="handleFind(scope.row)"
            >查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--wafer信息-->
      <el-table
        v-loading="listLoading"
        v-show="isActive === 1 &&rowInfo!==null && rowInfo.sliceType === 0"
        :data="anotherList"
        class="mocvd-table broad-scrollbar-table"
        height="calc(100vh - 375px)"
        element-loading-text="拼命加载中"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="WaferID" align="center" prop="waferNo" width="200px" fixed/>
        <el-table-column label="TapeNo" align="center" prop="tapeNo" width="200" fixed show-overflow-tooltip/>
        <el-table-column v-for="item in formThead" v-if="item.thName !== '序号'&&item.thName !== 'WaferID'&&item.thName !== 'TapeNo'" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row[item.thKey] }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-loading="listLoading"
        v-show="isActive === 1 && rowInfo!==null && rowInfo.sliceType === 1"
        :data="anotherList"
        class="mocvd-table broad-scrollbar-table"
        height="calc(100vh - 375px)"
        element-loading-text="拼命加载中"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="ChipNo" align="center" prop="waferNo" width="200" fixed show-overflow-tooltip/>
        <el-table-column label="TapeNo" align="center" prop="tapeNo" width="200" fixed show-overflow-tooltip/>
        <el-table-column v-for="item in formTheadf" v-if="item.thName !== '序号'&&item.thName !== 'ChipNo'&&item.thName !== 'TapeNo'" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[item.thKey] }}
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
      title="新增送片单"
      width="1200px"
      class="tip-out-inner-dialog">
      <el-row>
        <el-col :span="6">
          <div class="tableTitle">
            <div class="setTitle">入库信息</div>
          </div>
          <div class="set-border" style="height: 630px">
            <el-form label-width="80px">
              <el-form-item label="入库单号:">
                <el-input v-model="codeNo" :disabled="true" size="small" style="width:95%"/>
              </el-form-item>
              <el-form-item label="单据类型:">
                <el-select v-model="modelType" class="search-input" size="small" placeholder="请选择" filterable @change="changemodelType">
                  <el-option
                    v-for="item in typeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item label="是否清洗:">
                <el-select v-model="isClean" class="search-input" size="small" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in isCleanList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item label="入库片型:">
                <el-select v-model="ruType" class="search-input" size="small" placeholder="请选择" filterable @change="changemodelTypes">
                  <el-option
                    v-for="item in typesList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item label="产品型号:">
                <el-select v-model="products" :disabled="true" class="search-input" size="small" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in productModelOptions"
                    :key="item.id"
                    :label="item.code"
                    :value="item.code"/>
                </el-select>
              </el-form-item>
              <el-form-item label="正/副品:">
                <el-input v-model="zfp" :disabled="true" size="small" style="width:95%"/>
              </el-form-item>
              <el-form-item label="制单人:">
                <el-input v-model="modelCreater" :disabled="true" size="small" style="width:95%"/>
              </el-form-item>
              <el-form-item label="制单时间:">
                <el-input v-model="modelTime" :disabled="true" size="small" style="width:95%"/>
              </el-form-item>
              <el-form-item label="备注:">
                <el-input v-model="modelRemark" :rows="5" type="textarea" size="small" style="width:95%" maxlength="50"/>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="18">
          <div class="tableTitle">
            <div class="setTitle">入库明细</div>
          </div>
          <div class="set-border" style="height: 630px">
            <div style="text-align: center;">
              <el-row>
                <el-col :span="3" :offset="9"><div class="spanColor"><svg-icon icon-class="tiaomasm" style="font-size: 20px;color:#009494;margin-right:5px"/> 片号扫描</div></el-col>
                <el-col :span="6"><el-input v-model="platterNo" size="small" style="width: 98%;" placeholder="扫码自动读取" @keyup.enter.native="inputBlur()"/></el-col>
              </el-row>
            </div>
            <div>
              <div class="leftType">共<span style="color:#009494;font-weight:bold">{{ anotherLists.length }}</span>行</div>
              <!-- <el-button class="buttonType1"> <svg-icon icon-class="clear"/> 导 出 </el-button> -->
            </div>
            <div class="getCalss parameter-table">
              <el-table
                v-if="ruType === 0"
                ref="multipleTable"
                :data="anotherLists"
                :row-class-name="tableRowClassName"
                class="mocvd-table broad-scrollbar-table"
                height="535px"
                element-loading-text="拼命加载中"
                border
                fit
                highlight-current-row
                @selection-change="handleSelectionChanges">
                <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="danger"
                      icon="el-icon-delete"
                      @click="handleStrage(scope.$index)"
                    >删除</el-button>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="序号" width="50">
                  <template slot-scope="scope">
                    {{ scope.$index+1 }}
                  </template>
                </el-table-column>
                <el-table-column label="ChipNo/Bin No" align="center" prop="waferNo" width="200px"/>
                <el-table-column label="Tape No" align="center" prop="tapeNo" width="200" show-overflow-tooltip/>
                <el-table-column label="产品型号" align="center" prop="taskModel" width="120" show-overflow-tooltip/>
                <el-table-column label="数量" align="center" prop="binCount" width="120" show-overflow-tooltip/>
                <el-table-column label="光色" align="center" prop="color" width="120" show-overflow-tooltip/>
                <el-table-column label="型号" align="center" prop="model" width="120" show-overflow-tooltip/>
                <el-table-column label="工艺" align="center" prop="craft" width="120" show-overflow-tooltip/>
                <el-table-column label="尺寸" align="center" prop="size" width="120" show-overflow-tooltip/>
                <el-table-column label="品质等级" align="center" prop="quality" width="120" show-overflow-tooltip/>
                <el-table-column label="外观等级" align="center" prop="classify" width="120" show-overflow-tooltip/>
                <!-- <el-table-column label="是否清洗" align="center" prop="isClean" width="120" show-overflow-tooltip/> -->
                <el-table-column label="WLD_MIN" align="center" prop="wldMin" width="100" show-overflow-tooltip/>
                <el-table-column label="WLD_AVG" align="center" prop="wldAvg" width="100" show-overflow-tooltip/>
                <el-table-column label="WLD_MAX" align="center" prop="wldMax" width="100" show-overflow-tooltip/>
                <el-table-column label="WLD_STD" align="center" prop="wldStd" width="100" show-overflow-tooltip/>
                <el-table-column label="LOP1_MIN" align="center" prop="lopMin" width="100" show-overflow-tooltip/>
                <el-table-column label="LOP1_AVG" align="center" prop="lopAvg" width="100" show-overflow-tooltip/>
                <el-table-column label="LOP1_MAX" align="center" prop="lopMax" width="100" show-overflow-tooltip/>
                <el-table-column label="LOP1_STD" align="center" prop="lopStd" width="100" show-overflow-tooltip/>
                <el-table-column label="VF1_MIN" align="center" prop="vf1Min" width="100" show-overflow-tooltip/>
                <el-table-column label="VF1_AVG" align="center" prop="vf1Avg" width="100" show-overflow-tooltip/>
                <el-table-column label="VF1_MAX" align="center" prop="vf1Max" width="100" show-overflow-tooltip/>
                <el-table-column label="VF1_STD" align="center" prop="vf1Std" width="100" show-overflow-tooltip/>
                <el-table-column label="VF2_MIN" align="center" prop="vf2Min" width="100" show-overflow-tooltip/>
                <el-table-column label="VF2_AVG" align="center" prop="vf2Avg" width="100" show-overflow-tooltip/>
                <el-table-column label="VF2_MAX" align="center" prop="vf2Max" width="100" show-overflow-tooltip/>
                <el-table-column label="VF2_STD" align="center" prop="vf2Std" width="100" show-overflow-tooltip/>
                <el-table-column label="VF3_MIN" align="center" prop="vf3Min" width="100" show-overflow-tooltip/>
                <el-table-column label="VF3_AVG" align="center" prop="vf3Avg" width="100" show-overflow-tooltip/>
                <el-table-column label="VF3_MAX" align="center" prop="vf3Max" width="100" show-overflow-tooltip/>
                <el-table-column label="VF3_STD" align="center" prop="vf3Std" width="100" show-overflow-tooltip/>
                <el-table-column label="VF4_MIN" align="center" prop="vf4Min" width="100" show-overflow-tooltip/>
                <el-table-column label="VF4_AVG" align="center" prop="vf4Avg" width="100" show-overflow-tooltip/>
                <el-table-column label="VF4_MAX" align="center" prop="vf4Max" width="100" show-overflow-tooltip/>
                <el-table-column label="VF4_STD" align="center" prop="vf4Std" width="100" show-overflow-tooltip/>
                <el-table-column label="IR_MIN" align="center" prop="irMin" width="100" show-overflow-tooltip/>
                <el-table-column label="IR_AVG" align="center" prop="irAvg" width="100" show-overflow-tooltip/>
                <el-table-column label="IR_MAX" align="center" prop="irMax" width="100" show-overflow-tooltip/>
                <el-table-column label="IR_STD" align="center" prop="irStd" width="100" show-overflow-tooltip/>
                <el-table-column label="VZ_MIN" align="center" prop="vzMin" width="100" show-overflow-tooltip/>
                <el-table-column label="VZ_AVG" align="center" prop="vzAvg" width="100" show-overflow-tooltip/>
                <el-table-column label="VZ_MAX" align="center" prop="vzMax" width="100" show-overflow-tooltip/>
                <el-table-column label="VZ_STD" align="center" prop="vzStd" width="100" show-overflow-tooltip/>
                <el-table-column label="WLP_MIN" align="center" prop="wlpMin" width="100" show-overflow-tooltip/>
                <el-table-column label="WLP_AVG" align="center" prop="wlpAvg" width="100" show-overflow-tooltip/>
                <el-table-column label="WLP_MAX" align="center" prop="wlpMax" width="100" show-overflow-tooltip/>
                <el-table-column label="WLP_STD" align="center" prop="wlpStd" width="100" show-overflow-tooltip/>
                <el-table-column label="WLC_MIN" align="center" prop="wlcMin" width="100" show-overflow-tooltip/>
                <el-table-column label="WLC_AVG" align="center" prop="wlcAvg" width="100" show-overflow-tooltip/>
                <el-table-column label="WLC_MAX" align="center" prop="wlcMax" width="100" show-overflow-tooltip/>
                <el-table-column label="WLC_STD" align="center" prop="wlcStd" width="100" show-overflow-tooltip/>
                <el-table-column label="HW1均值" align="center" prop="hwAvg" width="100" show-overflow-tooltip/>
                <el-table-column label="综合良率" align="center" prop="compreYield" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.compreYield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column label="VF1良率" align="center" prop="vf1Yield" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.vf1Yield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column label="VF2良率" align="center" prop="vf2Yield" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.vf2Yield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column label="VF3良率" align="center" prop="vf3Yield" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.vf3Yield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column label="VF4良率" align="center" prop="vf4Yield" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.vf4Yield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column label="IR良率" align="center" prop="irYield" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.irYield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column label="DVF良率" align="center" prop="dvfYield" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.dvfYield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column label="WLD良率" align="center" prop="wldYield" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.wldYield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column label="WLP良率" align="center" prop="wlpYield" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.wlpYield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column label="WLC良率" align="center" prop="wlcYield" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.wlcYield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column label="VZ良率" align="center" prop="vzYield" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.vzYield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column label="LOP1良率" align="center" prop="ivYield" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.ivYield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column label="EDS_IR_A良率" align="center" prop="irEsdAYield" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.irEsdAYield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column label="WLD_5nm良率" align="center" prop="wldNm5Yield" width="110" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.wldNm5Yield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column label="WLP_5nm良率" align="center" prop="wlpNm5Yield" width="110" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.wlpNm5Yield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <!-- <el-table-column label="IV均值" align="center" prop="iv_svr" width="100" show-overflow-tooltip/>
                <el-table-column label="VF1均值" align="center" prop="vf1_svr" width="100" show-overflow-tooltip/>
                <el-table-column label="VZ均值" align="center" prop="vz_svr" width="100" show-overflow-tooltip/>
                <el-table-column label="Thyristor良率" align="center" prop="thyristor_yield" width="100" show-overflow-tooltip/>
                <el-table-column label="Thyristor坏点数" align="center" prop="thyristor_bad" width="150" show-overflow-tooltip/>
                <el-table-column label="综合良率" align="center" prop="compre_yield" width="100" show-overflow-tooltip/>
                <el-table-column label="生产良率" align="center" prop="product_yield" width="100" show-overflow-tooltip/>
                <el-table-column label="VF1良率" align="center" prop="vf1_yield" width="100" show-overflow-tooltip/>
                <el-table-column label="VF3良率" align="center" prop="vf3_yield" width="100" show-overflow-tooltip/>
                <el-table-column label="VF4良率" align="center" prop="vf4_yield" width="100" show-overflow-tooltip/>
                <el-table-column label="WLD1良率" align="center" prop="wld1_yield" width="100" show-overflow-tooltip/>
                <el-table-column label="IR良率" align="center" prop="ir_yield" width="100" show-overflow-tooltip/>
                <el-table-column label="IR_ESD_A良率" align="center" prop="ir_esd_a_yield" width="100" show-overflow-tooltip/>
                <el-table-column label="VZ良率" align="center" prop="vz_yield" width="100" show-overflow-tooltip/>
                <el-table-column label="IV良率" align="center" prop="iv_yield" width="100" show-overflow-tooltip/>
                <el-table-column label="VF2均值" align="center" prop="vf2_svr" width="100" show-overflow-tooltip/>
                <el-table-column label="VF3均值" align="center" prop="vf3_svr" width="100" show-overflow-tooltip/>
                <el-table-column label="VF4均值" align="center" prop="vf4_svr" width="100" show-overflow-tooltip/>
                <el-table-column label="WLD1均值" align="center" prop="wld1_svr" width="100" show-overflow-tooltip/>
                <el-table-column label="WLD1_STD" align="center" prop="wld1_std" width="100" show-overflow-tooltip/>
                <el-table-column label="WLP1均值" align="center" prop="wlp1_svr" width="100" show-overflow-tooltip/>
                <el-table-column label="HW1" align="center" prop="hw1" width="100" show-overflow-tooltip/>
                <el-table-column label="WLD2均值" align="center" prop="wld2_svr" width="100" show-overflow-tooltip/>
                <el-table-column label="BS(蓝移)" align="center" prop="bs" width="100" show-overflow-tooltip/>
                <el-table-column label="IR均值" align="center" prop="ir_svr" width="100" show-overflow-tooltip/>
                <el-table-column label="扫描数量" align="center" prop="scan_num" width="100" show-overflow-tooltip/>
                <el-table-column label="总测试数" align="center" prop="test_num" width="100" show-overflow-tooltip/>
                <el-table-column label="坏点数" align="center" prop="bad_num" width="100" show-overflow-tooltip/>
                <el-table-column label="机台" align="center" prop="machine" width="100" show-overflow-tooltip/>
                <el-table-column label="VF1异常占比" align="center" prop="vf_proportion" width="100" show-overflow-tooltip/>
                <el-table-column label="IR异常占比" align="center" prop="ir_proportion" width="100" show-overflow-tooltip/> -->
              </el-table>
              <el-table
                v-if="ruType === 1"
                ref="multipleTable"
                :data="anotherLists"
                :row-class-name="tableRowClassName"
                class="mocvd-table broad-scrollbar-table"
                height="535px"
                element-loading-text="拼命加载中"
                border
                fit
                highlight-current-row
                @selection-change="handleSelectionChanges">
                <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="danger"
                      icon="el-icon-delete"
                      @click="handleStrage(scope.$index)"
                    >删除</el-button>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="序号" width="50">
                  <template slot-scope="scope">
                    {{ scope.$index+1 }}
                  </template>
                </el-table-column>
                <el-table-column label="ChipNo/Bin No" align="center" prop="waferNo" width="200px"/>
                <el-table-column label="Tape No" align="center" prop="tapeNo" width="200" show-overflow-tooltip/>
                <el-table-column label="产品型号" align="center" prop="taskModel" width="120" show-overflow-tooltip/>
                <el-table-column label="数量" align="center" prop="binCount" width="120" show-overflow-tooltip/>
                <el-table-column label="光色" align="center" prop="color" width="120" show-overflow-tooltip/>
                <el-table-column label="型号" align="center" prop="model" width="120" show-overflow-tooltip/>
                <el-table-column label="工艺" align="center" prop="craft" width="120" show-overflow-tooltip/>
                <el-table-column label="尺寸" align="center" prop="size" width="120" show-overflow-tooltip/>
                <el-table-column label="品质等级" align="center" prop="quality" width="120" show-overflow-tooltip/>
                <el-table-column label="外观等级" align="center" prop="classify" width="120" show-overflow-tooltip/>
                <!-- <el-table-column label="是否清洗" align="center" prop="isClean" width="120" show-overflow-tooltip/> -->
                <el-table-column label="WLD_MIN" align="center" prop="wldMin" width="100" show-overflow-tooltip/>
                <el-table-column label="WLD_AVG" align="center" prop="wldAvg" width="100" show-overflow-tooltip/>
                <el-table-column label="WLD_MAX" align="center" prop="wldMax" width="100" show-overflow-tooltip/>
                <el-table-column label="WLD_STD" align="center" prop="wldStd" width="100" show-overflow-tooltip/>
                <el-table-column label="LOP1_MIN" align="center" prop="lopMin" width="100" show-overflow-tooltip/>
                <el-table-column label="LOP1_AVG" align="center" prop="lopAvg" width="100" show-overflow-tooltip/>
                <el-table-column label="LOP1_MAX" align="center" prop="lopMax" width="100" show-overflow-tooltip/>
                <el-table-column label="LOP1_STD" align="center" prop="lopStd" width="100" show-overflow-tooltip/>
                <el-table-column label="VF1_MIN" align="center" prop="vf1Min" width="100" show-overflow-tooltip/>
                <el-table-column label="VF1_AVG" align="center" prop="vf1Avg" width="100" show-overflow-tooltip/>
                <el-table-column label="VF1_MAX" align="center" prop="vf1Max" width="100" show-overflow-tooltip/>
                <el-table-column label="VF1_STD" align="center" prop="vf1Std" width="100" show-overflow-tooltip/>
                <el-table-column label="IR_MIN" align="center" prop="irMin" width="100" show-overflow-tooltip/>
                <el-table-column label="IR_AVG" align="center" prop="irAvg" width="100" show-overflow-tooltip/>
                <el-table-column label="IR_MAX" align="center" prop="irMax" width="100" show-overflow-tooltip/>
                <el-table-column label="IR_STD" align="center" prop="irStd" width="100" show-overflow-tooltip/>
                <el-table-column label="VZ_MIN" align="center" prop="vzMin" width="100" show-overflow-tooltip/>
                <el-table-column label="VZ_AVG" align="center" prop="vzAvg" width="100" show-overflow-tooltip/>
                <el-table-column label="VZ_MAX" align="center" prop="vzMax" width="100" show-overflow-tooltip/>
                <el-table-column label="VZ_STD" align="center" prop="vzStd" width="100" show-overflow-tooltip/>
                <el-table-column label="WLP_MIN" align="center" prop="wlpMin" width="100" show-overflow-tooltip/>
                <el-table-column label="WLP_AVG" align="center" prop="wlpAvg" width="100" show-overflow-tooltip/>
                <el-table-column label="WLP_MAX" align="center" prop="wlpMax" width="100" show-overflow-tooltip/>
                <el-table-column label="WLP_STD" align="center" prop="wlpStd" width="100" show-overflow-tooltip/>
                <el-table-column label="WLC_MIN" align="center" prop="wlcMin" width="100" show-overflow-tooltip/>
                <el-table-column label="WLC_AVG" align="center" prop="wlcAvg" width="100" show-overflow-tooltip/>
                <el-table-column label="WLC_MAX" align="center" prop="wlcMax" width="100" show-overflow-tooltip/>
                <el-table-column label="WLC_STD" align="center" prop="wlcStd" width="100" show-overflow-tooltip/>
              </el-table>
            </div>
            <!-- <div>
              <el-checkbox v-model="removeALL" @change="toggleSelectionRemove">全选</el-checkbox>
              <el-button
                icon="el-icon-delete"
                size="mini"
                type="danger"
                @click="deleteSelect"
              > 删除</el-button>
              <span style="padding-left:15px">已选中 <span style="color:#009494;font-weight:bold">{{ removeList.length }}</span> 行</span>
            </div> -->
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="isDisabled" type="primary" @click="submitForm()">确 定</el-button>
        <el-button @click="resetForm()">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      :title="title"
      width="1200px"
      class="tip-out-inner-dialog">
      <el-row>
        <el-col :span="6">
          <div class="tableTitle">
            <div class="setTitle">入库信息</div>
          </div>
          <div class="set-border" style="height: 630px">
            <el-form label-width="80px">
              <el-form-item label="入库单号:">
                <el-input v-model="codeNo" :disabled="true" size="small" style="width:95%"/>
              </el-form-item>
              <el-form-item label="单据类型:">
                <el-select v-model="modelType" :disabled="true" class="search-input" size="small" placeholder="请选择" filterable @change="changemodelType">
                  <el-option
                    v-for="item in typeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item label="是否清洗:">
                <el-select :disabled="true" v-model="isClean" class="search-input" size="small" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in isCleanList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item label="入库片型:">
                <el-select v-model="ruType" :disabled="true" class="search-input" size="small" placeholder="请选择" filterable @change="changemodelTypes">
                  <el-option
                    v-for="item in typesList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item label="产品型号:">
                <el-select v-model="products" :disabled="true" class="search-input" size="small" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in productModelOptions"
                    :key="item.id"
                    :label="item.code"
                    :value="item.code"/>
                </el-select>
              </el-form-item>
              <el-form-item label="正/副品:">
                <el-input v-model="zfp" :disabled="true" size="small" style="width:95%"/>
              </el-form-item>
              <el-form-item label="制单人:">
                <el-input v-model="modelCreater" :disabled="true" size="small" style="width:95%"/>
              </el-form-item>
              <el-form-item label="制单时间:">
                <el-input v-model="modelTime" :disabled="true" size="small" style="width:95%"/>
              </el-form-item>
              <el-form-item label="备注:">
                <el-input v-model="modelRemark" :disabled="title !== '修改'" :rows="5" type="textarea" size="small" style="width:95%" maxlength="50"/>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="18">
          <div class="tableTitle">
            <div class="setTitle">入库明细</div>
          </div>
          <div class="set-border" style="height: 630px">
            <div style="text-align: center;">
              <el-row>
                <el-col :span="3" :offset="9"><div class="spanColor"><svg-icon icon-class="tiaomasm" style="font-size: 20px;color:#009494;margin-right:5px"/> 片号扫描</div></el-col>
                <el-col :span="6"><el-input v-model="platterNo" size="small" style="width: 98%;" placeholder="扫码自动读取" @keyup.enter.native="upinputBlur()"/></el-col>
              </el-row>
            </div>
            <div>
              <div class="leftType">共<span style="color:#009494;font-weight:bold">{{ anotherList1.length }}</span>行</div>
              <!-- <el-button class="buttonType1"> <svg-icon icon-class="clear"/> 导 出 </el-button> -->
            </div>
            <div class="getCalss parameter-table">
              <el-table
                v-if="ruType === 0"
                ref="multipleTable"
                :data="anotherList1"
                :row-class-name="tableRowClassName"
                class="mocvd-table broad-scrollbar-table"
                height="535px"
                element-loading-text="拼命加载中"
                border
                fit
                highlight-current-row>
                <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="danger"
                      icon="el-icon-delete"
                      @click="handleStrageup(scope.$index)"
                    >删除</el-button>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="序号" width="50">
                  <template slot-scope="scope">
                    {{ scope.$index+1 }}
                  </template>
                </el-table-column>
                <el-table-column label="ChipNo/Bin No" align="center" prop="waferNo" width="200px"/>
                <el-table-column label="Tape No" align="center" prop="tapeNo" width="200" show-overflow-tooltip/>
                <el-table-column label="产品型号" align="center" prop="taskModel" width="120" show-overflow-tooltip/>
                <el-table-column label="数量" align="center" prop="binCount" width="120" show-overflow-tooltip/>
                <el-table-column label="光色" align="center" prop="color" width="120" show-overflow-tooltip/>
                <el-table-column label="型号" align="center" prop="model" width="120" show-overflow-tooltip/>
                <el-table-column label="工艺" align="center" prop="craft" width="120" show-overflow-tooltip/>
                <el-table-column label="尺寸" align="center" prop="size" width="120" show-overflow-tooltip/>
                <el-table-column label="品质等级" align="center" prop="quality" width="120" show-overflow-tooltip/>
                <el-table-column label="外观等级" align="center" prop="classify" width="120" show-overflow-tooltip/>
                <!-- <el-table-column label="是否清洗" align="center" prop="isClean" width="120" show-overflow-tooltip/> -->
                <el-table-column label="WLD_MIN" align="center" prop="wldMin" width="100" show-overflow-tooltip/>
                <el-table-column label="WLD_AVG" align="center" prop="wldAvg" width="100" show-overflow-tooltip/>
                <el-table-column label="WLD_MAX" align="center" prop="wldMax" width="100" show-overflow-tooltip/>
                <el-table-column label="WLD_STD" align="center" prop="wldStd" width="100" show-overflow-tooltip/>
                <el-table-column label="LOP1_MIN" align="center" prop="lopMin" width="100" show-overflow-tooltip/>
                <el-table-column label="LOP1_AVG" align="center" prop="lopAvg" width="100" show-overflow-tooltip/>
                <el-table-column label="LOP1_MAX" align="center" prop="lopMax" width="100" show-overflow-tooltip/>
                <el-table-column label="LOP1_STD" align="center" prop="lopStd" width="100" show-overflow-tooltip/>
                <el-table-column label="VF1_MIN" align="center" prop="vf1Min" width="100" show-overflow-tooltip/>
                <el-table-column label="VF1_AVG" align="center" prop="vf1Avg" width="100" show-overflow-tooltip/>
                <el-table-column label="VF1_MAX" align="center" prop="vf1Max" width="100" show-overflow-tooltip/>
                <el-table-column label="VF1_STD" align="center" prop="vf1Std" width="100" show-overflow-tooltip/>
                <el-table-column label="VF2_MIN" align="center" prop="vf2Min" width="100" show-overflow-tooltip/>
                <el-table-column label="VF2_AVG" align="center" prop="vf2Avg" width="100" show-overflow-tooltip/>
                <el-table-column label="VF2_MAX" align="center" prop="vf2Max" width="100" show-overflow-tooltip/>
                <el-table-column label="VF2_STD" align="center" prop="vf2Std" width="100" show-overflow-tooltip/>
                <el-table-column label="VF3_MIN" align="center" prop="vf3Min" width="100" show-overflow-tooltip/>
                <el-table-column label="VF3_AVG" align="center" prop="vf3Avg" width="100" show-overflow-tooltip/>
                <el-table-column label="VF3_MAX" align="center" prop="vf3Max" width="100" show-overflow-tooltip/>
                <el-table-column label="VF3_STD" align="center" prop="vf3Std" width="100" show-overflow-tooltip/>
                <el-table-column label="VF4_MIN" align="center" prop="vf4Min" width="100" show-overflow-tooltip/>
                <el-table-column label="VF4_AVG" align="center" prop="vf4Avg" width="100" show-overflow-tooltip/>
                <el-table-column label="VF4_MAX" align="center" prop="vf4Max" width="100" show-overflow-tooltip/>
                <el-table-column label="VF4_STD" align="center" prop="vf4Std" width="100" show-overflow-tooltip/>
                <el-table-column label="IR_MIN" align="center" prop="irMin" width="100" show-overflow-tooltip/>
                <el-table-column label="IR_AVG" align="center" prop="irAvg" width="100" show-overflow-tooltip/>
                <el-table-column label="IR_MAX" align="center" prop="irMax" width="100" show-overflow-tooltip/>
                <el-table-column label="IR_STD" align="center" prop="irStd" width="100" show-overflow-tooltip/>
                <el-table-column label="VZ_MIN" align="center" prop="vzMin" width="100" show-overflow-tooltip/>
                <el-table-column label="VZ_AVG" align="center" prop="vzAvg" width="100" show-overflow-tooltip/>
                <el-table-column label="VZ_MAX" align="center" prop="vzMax" width="100" show-overflow-tooltip/>
                <el-table-column label="VZ_STD" align="center" prop="vzStd" width="100" show-overflow-tooltip/>
                <el-table-column label="WLP_MIN" align="center" prop="wlpMin" width="100" show-overflow-tooltip/>
                <el-table-column label="WLP_AVG" align="center" prop="wlpAvg" width="100" show-overflow-tooltip/>
                <el-table-column label="WLP_MAX" align="center" prop="wlpMax" width="100" show-overflow-tooltip/>
                <el-table-column label="WLP_STD" align="center" prop="wlpStd" width="100" show-overflow-tooltip/>
                <el-table-column label="WLC_MIN" align="center" prop="wlcMin" width="100" show-overflow-tooltip/>
                <el-table-column label="WLC_AVG" align="center" prop="wlcAvg" width="100" show-overflow-tooltip/>
                <el-table-column label="WLC_MAX" align="center" prop="wlcMax" width="100" show-overflow-tooltip/>
                <el-table-column label="WLC_STD" align="center" prop="wlcStd" width="100" show-overflow-tooltip/>
                <el-table-column label="HW1均值" align="center" prop="hwAvg" width="100" show-overflow-tooltip/>
                <el-table-column label="综合良率" align="center" prop="compreYield" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.compreYield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column label="VF1良率" align="center" prop="vf1Yield" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.vf1Yield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column label="VF2良率" align="center" prop="vf2Yield" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.vf2Yield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column label="VF3良率" align="center" prop="vf3Yield" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.vf3Yield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column label="VF4良率" align="center" prop="vf4Yield" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.vf4Yield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column label="IR良率" align="center" prop="irYield" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.irYield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column label="DVF良率" align="center" prop="dvfYield" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.dvfYield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column label="WLD良率" align="center" prop="wldYield" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.wldYield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column label="WLP良率" align="center" prop="wlpYield" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.wlpYield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column label="WLC良率" align="center" prop="wlcYield" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.wlcYield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column label="VZ良率" align="center" prop="vzYield" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.vzYield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column label="LOP1良率" align="center" prop="ivYield" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.ivYield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column label="EDS_IR_A良率" align="center" prop="irEsdAYield" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.irEsdAYield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column label="WLD_5nm良率" align="center" prop="wldNm5Yield" width="110" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.wldNm5Yield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column label="WLP_5nm良率" align="center" prop="wlpNm5Yield" width="110" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.wlpNm5Yield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <!-- <el-table-column label="IV均值" align="center" prop="iv_svr" width="100" show-overflow-tooltip/>
                <el-table-column label="VF1均值" align="center" prop="vf1_svr" width="100" show-overflow-tooltip/>
                <el-table-column label="VZ均值" align="center" prop="vz_svr" width="100" show-overflow-tooltip/>
                <el-table-column label="Thyristor良率" align="center" prop="thyristor_yield" width="100" show-overflow-tooltip/>
                <el-table-column label="Thyristor坏点数" align="center" prop="thyristor_bad" width="150" show-overflow-tooltip/>
                <el-table-column label="综合良率" align="center" prop="compre_yield" width="100" show-overflow-tooltip/>
                <el-table-column label="生产良率" align="center" prop="product_yield" width="100" show-overflow-tooltip/>
                <el-table-column label="VF1良率" align="center" prop="vf1_yield" width="100" show-overflow-tooltip/>
                <el-table-column label="VF3良率" align="center" prop="vf3_yield" width="100" show-overflow-tooltip/>
                <el-table-column label="VF4良率" align="center" prop="vf4_yield" width="100" show-overflow-tooltip/>
                <el-table-column label="WLD1良率" align="center" prop="wld1_yield" width="100" show-overflow-tooltip/>
                <el-table-column label="IR良率" align="center" prop="ir_yield" width="100" show-overflow-tooltip/>
                <el-table-column label="IR_ESD_A良率" align="center" prop="ir_esd_a_yield" width="100" show-overflow-tooltip/>
                <el-table-column label="VZ良率" align="center" prop="vz_yield" width="100" show-overflow-tooltip/>
                <el-table-column label="IV良率" align="center" prop="iv_yield" width="100" show-overflow-tooltip/>
                <el-table-column label="VF2均值" align="center" prop="vf2_svr" width="100" show-overflow-tooltip/>
                <el-table-column label="VF3均值" align="center" prop="vf3_svr" width="100" show-overflow-tooltip/>
                <el-table-column label="VF4均值" align="center" prop="vf4_svr" width="100" show-overflow-tooltip/>
                <el-table-column label="WLD1均值" align="center" prop="wld1_svr" width="100" show-overflow-tooltip/>
                <el-table-column label="WLD1_STD" align="center" prop="wld1_std" width="100" show-overflow-tooltip/>
                <el-table-column label="WLP1均值" align="center" prop="wlp1_svr" width="100" show-overflow-tooltip/>
                <el-table-column label="HW1" align="center" prop="hw1" width="100" show-overflow-tooltip/>
                <el-table-column label="WLD2均值" align="center" prop="wld2_svr" width="100" show-overflow-tooltip/>
                <el-table-column label="BS(蓝移)" align="center" prop="bs" width="100" show-overflow-tooltip/>
                <el-table-column label="IR均值" align="center" prop="ir_svr" width="100" show-overflow-tooltip/>
                <el-table-column label="扫描数量" align="center" prop="scan_num" width="100" show-overflow-tooltip/>
                <el-table-column label="总测试数" align="center" prop="test_num" width="100" show-overflow-tooltip/>
                <el-table-column label="坏点数" align="center" prop="bad_num" width="100" show-overflow-tooltip/>
                <el-table-column label="机台" align="center" prop="machine" width="100" show-overflow-tooltip/>
                <el-table-column label="VF1异常占比" align="center" prop="vf_proportion" width="100" show-overflow-tooltip/>
                <el-table-column label="IR异常占比" align="center" prop="ir_proportion" width="100" show-overflow-tooltip/> -->
              </el-table>
              <el-table
                v-if="ruType === 1"
                ref="multipleTable"
                :data="anotherList1"
                :row-class-name="tableRowClassName"
                class="mocvd-table broad-scrollbar-table"
                height="535px"
                element-loading-text="拼命加载中"
                border
                fit
                highlight-current-row>
                <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="danger"
                      icon="el-icon-delete"
                      @click="handleStrageup(scope.$index)"
                    >删除</el-button>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="序号" width="50">
                  <template slot-scope="scope">
                    {{ scope.$index+1 }}
                  </template>
                </el-table-column>
                <el-table-column label="ChipNo/Bin No" align="center" prop="waferNo" width="200px"/>
                <el-table-column label="Tape No" align="center" prop="tapeNo" width="200" show-overflow-tooltip/>
                <el-table-column label="产品型号" align="center" prop="taskModel" width="120" show-overflow-tooltip/>
                <el-table-column label="数量" align="center" prop="binCount" width="120" show-overflow-tooltip/>
                <el-table-column label="光色" align="center" prop="color" width="120" show-overflow-tooltip/>
                <el-table-column label="型号" align="center" prop="model" width="120" show-overflow-tooltip/>
                <el-table-column label="工艺" align="center" prop="craft" width="120" show-overflow-tooltip/>
                <el-table-column label="尺寸" align="center" prop="size" width="120" show-overflow-tooltip/>
                <el-table-column label="品质等级" align="center" prop="quality" width="120" show-overflow-tooltip/>
                <el-table-column label="外观等级" align="center" prop="classify" width="120" show-overflow-tooltip/>
                <!-- <el-table-column label="是否清洗" align="center" prop="isClean" width="120" show-overflow-tooltip/> -->
                <el-table-column label="WLD_MIN" align="center" prop="wldMin" width="100" show-overflow-tooltip/>
                <el-table-column label="WLD_AVG" align="center" prop="wldAvg" width="100" show-overflow-tooltip/>
                <el-table-column label="WLD_MAX" align="center" prop="wldMax" width="100" show-overflow-tooltip/>
                <el-table-column label="WLD_STD" align="center" prop="wldStd" width="100" show-overflow-tooltip/>
                <el-table-column label="LOP1_MIN" align="center" prop="lopMin" width="100" show-overflow-tooltip/>
                <el-table-column label="LOP1_AVG" align="center" prop="lopAvg" width="100" show-overflow-tooltip/>
                <el-table-column label="LOP1_MAX" align="center" prop="lopMax" width="100" show-overflow-tooltip/>
                <el-table-column label="LOP1_STD" align="center" prop="lopStd" width="100" show-overflow-tooltip/>
                <el-table-column label="VF1_MIN" align="center" prop="vf1Min" width="100" show-overflow-tooltip/>
                <el-table-column label="VF1_AVG" align="center" prop="vf1Avg" width="100" show-overflow-tooltip/>
                <el-table-column label="VF1_MAX" align="center" prop="vf1Max" width="100" show-overflow-tooltip/>
                <el-table-column label="VF1_STD" align="center" prop="vf1Std" width="100" show-overflow-tooltip/>
                <el-table-column label="IR_MIN" align="center" prop="irMin" width="100" show-overflow-tooltip/>
                <el-table-column label="IR_AVG" align="center" prop="irAvg" width="100" show-overflow-tooltip/>
                <el-table-column label="IR_MAX" align="center" prop="irMax" width="100" show-overflow-tooltip/>
                <el-table-column label="IR_STD" align="center" prop="irStd" width="100" show-overflow-tooltip/>
                <el-table-column label="VZ_MIN" align="center" prop="vzMin" width="100" show-overflow-tooltip/>
                <el-table-column label="VZ_AVG" align="center" prop="vzAvg" width="100" show-overflow-tooltip/>
                <el-table-column label="VZ_MAX" align="center" prop="vzMax" width="100" show-overflow-tooltip/>
                <el-table-column label="VZ_STD" align="center" prop="vzStd" width="100" show-overflow-tooltip/>
                <el-table-column label="WLP_MIN" align="center" prop="wlpMin" width="100" show-overflow-tooltip/>
                <el-table-column label="WLP_AVG" align="center" prop="wlpAvg" width="100" show-overflow-tooltip/>
                <el-table-column label="WLP_MAX" align="center" prop="wlpMax" width="100" show-overflow-tooltip/>
                <el-table-column label="WLP_STD" align="center" prop="wlpStd" width="100" show-overflow-tooltip/>
                <el-table-column label="WLC_MIN" align="center" prop="wlcMin" width="100" show-overflow-tooltip/>
                <el-table-column label="WLC_AVG" align="center" prop="wlcAvg" width="100" show-overflow-tooltip/>
                <el-table-column label="WLC_MAX" align="center" prop="wlcMax" width="100" show-overflow-tooltip/>
                <el-table-column label="WLC_STD" align="center" prop="wlcStd" width="100" show-overflow-tooltip/>
              </el-table>
            </div>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="isDisabled" type="primary" @click="saveUpdateNormal()">确 定</el-button>
        <el-button @click="resetForm()">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="findDialogVisible"
      title="查看"
      width="1200px"
      class="tip-out-inner-dialog">
      <el-row>
        <el-col :span="6">
          <div class="tableTitle">
            <div class="setTitle">入库信息</div>
          </div>
          <div class="set-border" style="height: 630px">
            <el-form label-width="80px">
              <el-form-item label="入库单号:">
                <el-input v-model="codeNo" :disabled="true" size="small" style="width:95%"/>
              </el-form-item>
              <el-form-item label="单据类型:">
                <el-select v-model="modelType" :disabled="true" class="search-input" size="small" placeholder="请选择" filterable @change="changemodelType">
                  <el-option
                    v-for="item in typeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item label="是否清洗:">
                <el-select :disabled="true" v-model="isClean" class="search-input" size="small" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in isCleanList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item label="入库片型:">
                <el-select v-model="ruType" :disabled="true" class="search-input" size="small" placeholder="请选择" filterable @change="changemodelTypes">
                  <el-option
                    v-for="item in typesList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item label="产品型号:">
                <el-select v-model="products" :disabled="true" class="search-input" size="small" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in productModelOptions"
                    :key="item.id"
                    :label="item.code"
                    :value="item.code"/>
                </el-select>
              </el-form-item>
              <el-form-item label="正/副品:">
                <el-input v-model="zfp" :disabled="true" size="small" style="width:95%"/>
              </el-form-item>
              <el-form-item label="制单人:">
                <el-input v-model="modelCreater" :disabled="true" size="small" style="width:95%"/>
              </el-form-item>
              <el-form-item label="制单时间:">
                <el-input v-model="modelTime" :disabled="true" size="small" style="width:95%"/>
              </el-form-item>
              <el-form-item label="备注:">
                <el-input v-model="modelRemark" :disabled="true" :rows="5" type="textarea" size="small" style="width:95%" maxlength="50"/>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="18">
          <div class="tableTitle">
            <div class="setTitle">入库明细</div>
          </div>
          <div class="set-border" style="height: 630px">
            <div style="text-align: center;">
              <el-row>
                <el-col :span="3" :offset="9"><div class="spanColor"><svg-icon icon-class="tiaomasm" style="font-size: 20px;color:#009494;margin-right:5px"/> 片号扫描</div></el-col>
                <el-col :span="6"><el-input v-model="platterNo" size="small" style="width: 98%;" placeholder="扫码自动读取" @keyup.enter.native="upinputBlur()"/></el-col>
              </el-row>
            </div>
            <div>
              <div class="leftType">共<span style="color:#009494;font-weight:bold">{{ anotherList1.length }}</span>行</div>
              <!-- <el-button class="buttonType1"> <svg-icon icon-class="clear"/> 导 出 </el-button> -->
            </div>
            <div class="getCalss parameter-table">
              <el-table
                v-if="ruType === 0"
                ref="multipleTable"
                :data="anotherList1"
                :row-class-name="tableRowClassName"
                class="mocvd-table broad-scrollbar-table"
                height="535px"
                element-loading-text="拼命加载中"
                border
                fit
                highlight-current-row>
                <el-table-column align="center" label="序号" width="50">
                  <template slot-scope="scope">
                    {{ scope.$index+1 }}
                  </template>
                </el-table-column>
                <el-table-column label="ChipNo/Bin No" align="center" prop="waferNo" width="200px"/>
                <el-table-column label="Tape No" align="center" prop="tapeNo" width="200" show-overflow-tooltip/>
                <el-table-column label="产品型号" align="center" prop="taskModel" width="120" show-overflow-tooltip/>
                <el-table-column label="数量" align="center" prop="binCount" width="120" show-overflow-tooltip/>
                <el-table-column label="光色" align="center" prop="color" width="120" show-overflow-tooltip/>
                <el-table-column label="型号" align="center" prop="model" width="120" show-overflow-tooltip/>
                <el-table-column label="工艺" align="center" prop="craft" width="120" show-overflow-tooltip/>
                <el-table-column label="尺寸" align="center" prop="size" width="120" show-overflow-tooltip/>
                <el-table-column label="品质等级" align="center" prop="quality" width="120" show-overflow-tooltip/>
                <el-table-column label="外观等级" align="center" prop="classify" width="120" show-overflow-tooltip/>
                <!-- <el-table-column label="是否清洗" align="center" prop="isClean" width="120" show-overflow-tooltip/> -->
                <el-table-column label="WLD_MIN" align="center" prop="wldMin" width="100" show-overflow-tooltip/>
                <el-table-column label="WLD_AVG" align="center" prop="wldAvg" width="100" show-overflow-tooltip/>
                <el-table-column label="WLD_MAX" align="center" prop="wldMax" width="100" show-overflow-tooltip/>
                <el-table-column label="WLD_STD" align="center" prop="wldStd" width="100" show-overflow-tooltip/>
                <el-table-column label="LOP1_MIN" align="center" prop="lopMin" width="100" show-overflow-tooltip/>
                <el-table-column label="LOP1_AVG" align="center" prop="lopAvg" width="100" show-overflow-tooltip/>
                <el-table-column label="LOP1_MAX" align="center" prop="lopMax" width="100" show-overflow-tooltip/>
                <el-table-column label="LOP1_STD" align="center" prop="lopStd" width="100" show-overflow-tooltip/>
                <el-table-column label="VF1_MIN" align="center" prop="vf1Min" width="100" show-overflow-tooltip/>
                <el-table-column label="VF1_AVG" align="center" prop="vf1Avg" width="100" show-overflow-tooltip/>
                <el-table-column label="VF1_MAX" align="center" prop="vf1Max" width="100" show-overflow-tooltip/>
                <el-table-column label="VF1_STD" align="center" prop="vf1Std" width="100" show-overflow-tooltip/>
                <el-table-column label="VF2_MIN" align="center" prop="vf2Min" width="100" show-overflow-tooltip/>
                <el-table-column label="VF2_AVG" align="center" prop="vf2Avg" width="100" show-overflow-tooltip/>
                <el-table-column label="VF2_MAX" align="center" prop="vf2Max" width="100" show-overflow-tooltip/>
                <el-table-column label="VF2_STD" align="center" prop="vf2Std" width="100" show-overflow-tooltip/>
                <el-table-column label="VF3_MIN" align="center" prop="vf3Min" width="100" show-overflow-tooltip/>
                <el-table-column label="VF3_AVG" align="center" prop="vf3Avg" width="100" show-overflow-tooltip/>
                <el-table-column label="VF3_MAX" align="center" prop="vf3Max" width="100" show-overflow-tooltip/>
                <el-table-column label="VF3_STD" align="center" prop="vf3Std" width="100" show-overflow-tooltip/>
                <el-table-column label="VF4_MIN" align="center" prop="vf4Min" width="100" show-overflow-tooltip/>
                <el-table-column label="VF4_AVG" align="center" prop="vf4Avg" width="100" show-overflow-tooltip/>
                <el-table-column label="VF4_MAX" align="center" prop="vf4Max" width="100" show-overflow-tooltip/>
                <el-table-column label="VF4_STD" align="center" prop="vf4Std" width="100" show-overflow-tooltip/>
                <el-table-column label="IR_MIN" align="center" prop="irMin" width="100" show-overflow-tooltip/>
                <el-table-column label="IR_AVG" align="center" prop="irAvg" width="100" show-overflow-tooltip/>
                <el-table-column label="IR_MAX" align="center" prop="irMax" width="100" show-overflow-tooltip/>
                <el-table-column label="IR_STD" align="center" prop="irStd" width="100" show-overflow-tooltip/>
                <el-table-column label="VZ_MIN" align="center" prop="vzMin" width="100" show-overflow-tooltip/>
                <el-table-column label="VZ_AVG" align="center" prop="vzAvg" width="100" show-overflow-tooltip/>
                <el-table-column label="VZ_MAX" align="center" prop="vzMax" width="100" show-overflow-tooltip/>
                <el-table-column label="VZ_STD" align="center" prop="vzStd" width="100" show-overflow-tooltip/>
                <el-table-column label="WLP_MIN" align="center" prop="wlpMin" width="100" show-overflow-tooltip/>
                <el-table-column label="WLP_AVG" align="center" prop="wlpAvg" width="100" show-overflow-tooltip/>
                <el-table-column label="WLP_MAX" align="center" prop="wlpMax" width="100" show-overflow-tooltip/>
                <el-table-column label="WLP_STD" align="center" prop="wlpStd" width="100" show-overflow-tooltip/>
                <el-table-column label="WLC_MIN" align="center" prop="wlcMin" width="100" show-overflow-tooltip/>
                <el-table-column label="WLC_AVG" align="center" prop="wlcAvg" width="100" show-overflow-tooltip/>
                <el-table-column label="WLC_MAX" align="center" prop="wlcMax" width="100" show-overflow-tooltip/>
                <el-table-column label="WLC_STD" align="center" prop="wlcStd" width="100" show-overflow-tooltip/>
                <el-table-column label="HW1均值" align="center" prop="hwAvg" width="100" show-overflow-tooltip/>
                <el-table-column label="综合良率" align="center" prop="compreYield" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.compreYield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column label="VF1良率" align="center" prop="vf1Yield" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.vf1Yield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column label="VF2良率" align="center" prop="vf2Yield" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.vf2Yield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column label="VF3良率" align="center" prop="vf3Yield" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.vf3Yield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column label="VF4良率" align="center" prop="vf4Yield" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.vf4Yield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column label="IR良率" align="center" prop="irYield" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.irYield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column label="DVF良率" align="center" prop="dvfYield" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.dvfYield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column label="WLD良率" align="center" prop="wldYield" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.wldYield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column label="WLP良率" align="center" prop="wlpYield" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.wlpYield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column label="WLC良率" align="center" prop="wlcYield" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.wlcYield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column label="VZ良率" align="center" prop="vzYield" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.vzYield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column label="LOP1良率" align="center" prop="ivYield" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.ivYield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column label="EDS_IR_A良率" align="center" prop="irEsdAYield" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.irEsdAYield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column label="WLD_5nm良率" align="center" prop="wldNm5Yield" width="110" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.wldNm5Yield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column label="WLP_5nm良率" align="center" prop="wlpNm5Yield" width="110" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ (parseFloat(scope.row.wlpNm5Yield)*100).toFixed(2) }}%</span>
                  </template>
                </el-table-column>
              </el-table>
              <el-table
                v-if="ruType === 1"
                ref="multipleTable"
                :data="anotherList1"
                :row-class-name="tableRowClassName"
                class="mocvd-table broad-scrollbar-table"
                height="535px"
                element-loading-text="拼命加载中"
                border
                fit
                highlight-current-row>
                <el-table-column align="center" label="序号" width="50">
                  <template slot-scope="scope">
                    {{ scope.$index+1 }}
                  </template>
                </el-table-column>
                <el-table-column label="ChipNo/Bin No" align="center" prop="waferNo" width="200px"/>
                <el-table-column label="Tape No" align="center" prop="tapeNo" width="200" show-overflow-tooltip/>
                <el-table-column label="产品型号" align="center" prop="taskModel" width="120" show-overflow-tooltip/>
                <el-table-column label="数量" align="center" prop="binCount" width="120" show-overflow-tooltip/>
                <el-table-column label="光色" align="center" prop="color" width="120" show-overflow-tooltip/>
                <el-table-column label="型号" align="center" prop="model" width="120" show-overflow-tooltip/>
                <el-table-column label="工艺" align="center" prop="craft" width="120" show-overflow-tooltip/>
                <el-table-column label="尺寸" align="center" prop="size" width="120" show-overflow-tooltip/>
                <el-table-column label="品质等级" align="center" prop="quality" width="120" show-overflow-tooltip/>
                <el-table-column label="外观等级" align="center" prop="classify" width="120" show-overflow-tooltip/>
                <!-- <el-table-column label="是否清洗" align="center" prop="isClean" width="120" show-overflow-tooltip/> -->
                <el-table-column label="WLD_MIN" align="center" prop="wldMin" width="100" show-overflow-tooltip/>
                <el-table-column label="WLD_AVG" align="center" prop="wldAvg" width="100" show-overflow-tooltip/>
                <el-table-column label="WLD_MAX" align="center" prop="wldMax" width="100" show-overflow-tooltip/>
                <el-table-column label="WLD_STD" align="center" prop="wldStd" width="100" show-overflow-tooltip/>
                <el-table-column label="LOP1_MIN" align="center" prop="lopMin" width="100" show-overflow-tooltip/>
                <el-table-column label="LOP1_AVG" align="center" prop="lopAvg" width="100" show-overflow-tooltip/>
                <el-table-column label="LOP1_MAX" align="center" prop="lopMax" width="100" show-overflow-tooltip/>
                <el-table-column label="LOP1_STD" align="center" prop="lopStd" width="100" show-overflow-tooltip/>
                <el-table-column label="VF1_MIN" align="center" prop="vf1Min" width="100" show-overflow-tooltip/>
                <el-table-column label="VF1_AVG" align="center" prop="vf1Avg" width="100" show-overflow-tooltip/>
                <el-table-column label="VF1_MAX" align="center" prop="vf1Max" width="100" show-overflow-tooltip/>
                <el-table-column label="VF1_STD" align="center" prop="vf1Std" width="100" show-overflow-tooltip/>
                <el-table-column label="IR_MIN" align="center" prop="irMin" width="100" show-overflow-tooltip/>
                <el-table-column label="IR_AVG" align="center" prop="irAvg" width="100" show-overflow-tooltip/>
                <el-table-column label="IR_MAX" align="center" prop="irMax" width="100" show-overflow-tooltip/>
                <el-table-column label="IR_STD" align="center" prop="irStd" width="100" show-overflow-tooltip/>
                <el-table-column label="VZ_MIN" align="center" prop="vzMin" width="100" show-overflow-tooltip/>
                <el-table-column label="VZ_AVG" align="center" prop="vzAvg" width="100" show-overflow-tooltip/>
                <el-table-column label="VZ_MAX" align="center" prop="vzMax" width="100" show-overflow-tooltip/>
                <el-table-column label="VZ_STD" align="center" prop="vzStd" width="100" show-overflow-tooltip/>
                <el-table-column label="WLP_MIN" align="center" prop="wlpMin" width="100" show-overflow-tooltip/>
                <el-table-column label="WLP_AVG" align="center" prop="wlpAvg" width="100" show-overflow-tooltip/>
                <el-table-column label="WLP_MAX" align="center" prop="wlpMax" width="100" show-overflow-tooltip/>
                <el-table-column label="WLP_STD" align="center" prop="wlpStd" width="100" show-overflow-tooltip/>
                <el-table-column label="WLC_MIN" align="center" prop="wlcMin" width="100" show-overflow-tooltip/>
                <el-table-column label="WLC_AVG" align="center" prop="wlcAvg" width="100" show-overflow-tooltip/>
                <el-table-column label="WLC_MAX" align="center" prop="wlcMax" width="100" show-overflow-tooltip/>
                <el-table-column label="WLC_STD" align="center" prop="wlcStd" width="100" show-overflow-tooltip/>
              </el-table>
            </div>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="findDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="HandleDialogVisible"
      title="处理"
      width="800px">
      <el-table
        ref="deleteref"
        :data="anotherList1"
        :span-method="objectSpanMethods"
        class="mocvd-table broad-scrollbar-table"
        height="450px"
        element-loading-text="拼命加载中"
        border
        fit>
        <el-table-column label="选择" align="center" width="100">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status === 2"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleStrageups(scope.$index)"
            >删除</el-button>
          </template>
        </el-table-column>
        <el-table-column label="片号" align="center" prop="waferNo" width="200px"/>
        <el-table-column label="审核结果" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status !== 2" style="color: #009494;font-weight: bold"> 通过 </span>
            <span v-if="scope.row.status === 2" style="color: #f33;font-weight: bold"> 不通过 </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status === 2" class="normalReasom" @click="showReason()">查看原因</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="isDisabled" type="primary" @click="saveError()">提交</el-button>
        <el-button @click="resetForm()">取 消</el-button>
      </span>
      <el-dialog
        v-drag
        :visible.sync="checkReason"
        width="800px"
        height="490px"
        top="80px"
        class="tip-out-inner-dialog"
        title="查看原因"
        append-to-body>
        <div>
          <div class="tableTitle">
            <div class="setTitle">原因</div>
          </div>
          <div class="set-borders">
            <div v-if="rowInfo !== null" class="checkstr" v-html="rowInfo.auditResult">&nbsp;</div>
          </div>
        </div>
      </el-dialog>
    </el-dialog>
    <el-dialog
      :visible.sync="setDialogVisible"
      :close-on-click-modal="false"
      title="入库设置"
      width="800px"
      class="tip-out-inner-dialog">
      <div class="table-top-btn-group" style="border-bottom: 1px solid #e5e5e5;">
        <div
          :class="{'active':isSetActive === 0}"
          style="margin-left:0px"
          @click="navTabClick(0)"
        >
          满Bin设置
        </div>
        <div
          :class="{'active':isSetActive === 1}"
          @click="navTabClick(1)"
        >
          分包波段
        </div>
      </div>
      <div v-if="isSetActive === 0" style="margin-bottom:15px">
        <div class="input-item">
          <span class="input-title" style="width:35px">型号 </span>
          <el-select v-model="binModel" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in modelList"
              :key="item.id"
              :label="item.code"
              :value="item.code"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">理论颗粒 </span>
          <el-input v-model="binNum" class="search-input" placeholder="请输入理论颗粒" size="small" maxlength="8" oninput="this.value=this.value.replace(/[^0-9]/g,'');" clearable/>
        </div>
        <el-button
          class="margin-top"
          size="small"
          type="primary"
          icon="el-icon-check"
          @click="handleBinSave" >添 加</el-button>
      </div>
      <el-table
        v-if="isSetActive === 0"
        :data="binList"
        class="mocvd-table broad-scrollbar-table"
        height="450px"
        element-loading-text="拼命加载中"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="型号" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.model" class="search-input" style="width:90%" size="small" placeholder="请选择" filterable>
              <el-option
                v-for="item in modelList"
                :key="item.id"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="理论颗粒" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.particlesNo" class="search-input" style="width:90%" placeholder="" size="small" maxlength="8" oninput="this.value=this.value.replace(/[^0-9]/g,'');"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-check"
              @click="handleBinEdit(scope.row)"
            >保存</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleBinDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <i v-if="isSetActive === 1&&fblist.length <20" class="addBtn el-icon-circle-plus" @click="addItem()"/>
      <div v-if="isSetActive === 1" style="max-height: 450px;overflow: auto;">
        <el-row v-for="(item, index) in fblist" :key="index" style="margin-top:15px">
          <el-col :span="24">
            <span class="spandis">{{ item.band }}</span>
            <el-input v-model="item.minval" type="text" class="inputSTY" oninput="this.value=this.value.replace(/[^0-9]/g,'');" maxlength="5"/>
            <span class="spandis"> ~ </span>
            <el-input v-model="item.maxval" type="text" class="inputSTY" oninput="this.value=this.value.replace(/[^0-9]/g,'');" maxlength="5"/>
            <i v-if="list.length !== 0" class="deleteBtn el-icon-remove" @click="deleteItem(index)"/>
          </el-col>
        </el-row>
      </div>
      <span v-if="isSetActive === 1" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveFB()">保 存</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .deleteBtn{
    font-size: 30px;
    color: #d56c28;
    cursor: pointer;
    float: right;
    margin-right: 15px;
    margin-top: 5px;
  }
  .addBtn{
    transform: translateX(-50%);
    font-size: 30px;
    color: #009494;
    cursor: pointer;
    margin-right: 0px;
    margin-top: 10px;
    margin-left: 25px;
  }
  .spandis{
    float: left;
    height: 40px;
    display: flex;
    align-content: center;
    align-items: center;
    padding: 0 15px;
  }
  .inputSTY{
    width: 285px;
    float: left;
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
    margin-top: 15px;
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
  .buttonTypechuli {
    background: #FFB800;
    border-color:#FFB800;
    color: #fff;
    font-size: 12px;
  }
  .buttonType1 {
    font-size: 15px;
    float: right;
    height: 15px;
    border: 0px;
    padding: 0;
    margin-right: 15px;
  }
  .leftType{
    float: left;
    height: 15px;
    margin-left: 15px;
  }
  .spanColor{
    font-size: 16px;
    font-weight: bold;
    margin-top:8px;
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
    height: 495px;
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
    float: left;
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
    height: calc(100vh - 310px);
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
  .app-container>>> .el-table--border {
    border-top: 2px solid #009494;
  }
  .tip-out-inner-dialog>>> .el-dialog__body {
    padding-bottom: 15px;
  }
  .sses>>>.el-table__fixed-right {
    height: 438px !important;
  }
  .sses>>>.el-table__fixed-body-wrapper {
    height: 396px !important;
  }
  .select-thead-btn{
    height: 42px;
    position: absolute;
    z-index: 200;
    right: 20px;
    top: 15px;
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
</style>
