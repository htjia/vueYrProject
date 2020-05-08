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
          v-if="isUpslice === 1"
          size="small"
          type="primary"
          @click="handleDeliver"
        ><svg-icon icon-class="xiangshang"/> 上片</el-button>
        <el-button
          v-if="isStick === 1"
          size="small"
          type="primary"
          @click="handleGlue"
        ><svg-icon icon-class="zhanpian"/> 粘片</el-button>
        <el-button
          v-if="isGrind === 1"
          size="small"
          type="primary"
          @click="handleGrind"
        ><svg-icon icon-class="yanmo"/> 减薄</el-button>
        <el-button
          v-if="isPolish === 1"
          size="small"
          type="primary"
          @click="handlePolishing"
        ><svg-icon icon-class="zonghepanding"/> 抛光</el-button>
        <el-button
          v-if="isClean === 1"
          size="small"
          type="primary"
          @click="handleRinse"
        ><svg-icon icon-class="chongzhi"/> 清洗</el-button>
        <el-button
          size="small"
          type="primary"
          @click="handleTransmit"
        ><svg-icon icon-class="xiangyou"/> 传片</el-button>
        <el-button
          size="small"
          class="float-right margin-left"
          type="primary"
          @click="selectThead"
        ><svg-icon icon-class="shezhilk"/> 设置显示列</el-button>
        <el-button
          size="small"
          class="float-right"
          type="primary"
          @click="viewRecord"
        ><svg-icon icon-class="rukujl"/> 碎片记录</el-button>
      </div>
      <div style="height: auto;">
        <div class="input-item">
          <span class="input-title" style="width: 76px;">研磨流水号 </span>
          <el-input v-model="searchKeys.serialNum" class="search-input" style="width: 150px;" placeholder="请输入研磨流水号" size="small" maxlength="50" clearable/>
        </div>
        <div class="input-item">
          <span class="input-title" style="width: 50px;">盘类型 </span>
          <el-select v-model="searchKeys.plateType" class="search-input" style="width: 150px;" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in plateOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">研磨盘号</span>
          <el-input v-model="searchKeys.plateNum" class="search-input" style="width: 150px;" placeholder="请输入研磨盘号" size="small" maxlength="50" clearable/>
        </div>
        <div class="input-item">
          <el-select v-model="selectedTime" class="search-input" style="width: 120px;" size="small" placeholder="请选择" filterable>
            <el-option
              v-for="item in timeOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
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
      <div v-show="selectTheadVisble" class="select-thead">
        <div class="options-box">
          <el-tree
            ref="tree"
            :data="theader"
            :default-checked-keys="defaultCheckedKeys"
            :props="defaultProps"
            show-checkbox
            node-key="key"
          />
        </div>
        <el-button type="primary" size="mini" style="margin-left: 25px" @click="submitOption">确 定</el-button>
        <el-button size="mini" @click="resetOption">取 消</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        ref="table"
        :data="list"
        height="calc(100vh - 342px)"
        class="site-table broad-scrollbar-table"
        element-loading-text="拼命加载中"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="研磨流水号" prop="serialNum" width="100" fixed/>
        <el-table-column align="center" label="产品型号" prop="productModel" width="100" fixed/>
        <el-table-column align="center" label="研磨盘号" prop="plateNo" width="100" fixed/>
        <el-table-column align="center" label="盘类型" prop="platterType" width="100" fixed/>
        <el-table-column align="center" label="批次号" prop="batchNo" width="180" fixed/>
        <my-col v-for="(item) in theader" :key="item.key" :col-opts="item"/>
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
    <!--碎片记录-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="recordDialogVisible"
      top="80px"
      class="padding-dialog broad-scrollbar-table record-dialog"
      title="碎片记录"
      width="1360px"
      @close="handleCloseDialog">
      <div class="search-box" style="padding-bottom: 15px;overflow: hidden">
        <div class="left-search-box">
          <div class="input-item" style="margin-top: 0;margin-right: 5px">
            <span class="input-title" style="width: 60px;">WaferID</span>
            <el-input v-model="waferID" class="search-input" style="width: 210px" placeholder="请输入WaferID" size="small" maxlength="30" clearable/>
          </div>
          <div class="input-item" style="margin-top: 0;margin-right: 5px">
            <span class="input-title" style="width: 50px;">批次号</span>
            <el-input v-model="batchID" class="search-input" style="width: 190px" placeholder="请输入批次号" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item" style="margin-top: 0;margin-right: 5px">
            <span class="input-title">碎片位置</span>
            <el-select v-model="fragPosition" class="search-input" style="width: 80px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in fragPositionList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div style="float: left;margin-right: 5px">
            <span class="input-title">上报日期</span>
            <el-date-picker
              v-model="beginRecordDate"
              :picker-options="pickerRecordOptionsStart"
              :editable="false"
              class="search-input"
              size="small"
              type="date"
              placeholder="开始日期"
              value-format="timestamp"
            />
            <span style="display:inline-block;width: 38px;text-align: center"> 至 </span>
            <el-date-picker
              v-model="endRecordDate"
              :picker-options="pickerRecordOptionsEnd"
              :editable="false"
              class="search-input"
              size="small"
              type="date"
              placeholder="结束日期"
              value-format="timestamp"
            />
          </div>
          <div style="float: left;margin-bottom: 10px">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-search"
              @click="viewRecord"
            >查 询
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="clearDialogSearch" > <svg-icon icon-class="clear"/> 重 置</el-button>
          </div>
          <el-button
            class="float-right"
            size="small"
            type="primary"
            @click="handleDialogExport"
          ><svg-icon icon-class="export"/> 导出</el-button>
        </div>
        <div class="cut-line clear-both" style="margin-bottom: 0"/>
      </div>
      <!--run信息-->
      <el-table
        v-loading="listLoading"
        ref="runTable"
        :data="recordList"
        height="500px"
        element-loading-text="拼命加载中"
        highlight-current-row
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="流水号" align="center" prop="serialNum" width="130" show-overflow-tooltip/>
        <el-table-column label="次位号" align="center" prop="rankNum" width="60" show-overflow-tooltip/>
        <el-table-column label="盘号" align="center" prop="plateNo" width="100" show-overflow-tooltip/>
        <el-table-column label="批次号" align="center" prop="batchNo" width="180" show-overflow-tooltip/>
        <el-table-column label="waferID" align="center" prop="waferNo" width="200" show-overflow-tooltip/>
        <el-table-column label="碎片数量" align="center" prop="piecesNum" width="80" show-overflow-tooltip/>
        <el-table-column label="碎片位置" align="center" prop="location" width="100" show-overflow-tooltip/>
        <el-table-column label="上报时间" align="center" prop="createTime" width="140" show-overflow-tooltip/>
        <el-table-column label="上报人" align="center" prop="creatorName" width="80" show-overflow-tooltip/>
        <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip/>
        <el-table-column align="center" label="操作" width="80">
          <template slot-scope="scope">
            <el-button
              :disabled="scope.row.isReport === 1"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="recordPageNum"
        :page-sizes="[15, 25, 50]"
        :page-size="recordPageSize"
        :total="totalRecordPage"
        class="pagination"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="recordSizeChange"
        @current-change="recordCurrentChange"
      />
    </el-dialog>
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
          <el-input ref="importInputJp" :autofocus="true" v-model="batchNo" class="search-input-scan" placeholder="请输入批号" size="small" maxlength="50" clearable @keyup.enter.native="handleReceiveInput"/>
        </div>
        <div class="input-item" style="margin-top: 0;">
          <span class="input-title-short"><svg-icon icon-class="zhandiangl" style="font-size: 20px;color:#009494"/> 站点 </span>
          <el-input :disabled="true" value="研磨过站" class="search-input-scan" size="small" maxlength="20" clearable/>
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
        <el-col :span="11">
          <div class="module-title-text" style="float:none;">接片信息</div>
          <div class="left-content">
            <span class="input-title" style="margin-top: 15px; width: 65px">操作员 </span>
            <el-input :disabled="true" v-model="getToken" class="dialog-input" size="small"/>
            <span class="input-title" style="line-height: 60px; width: 65px;">备注 </span>
            <el-input v-model="jRemarkLeft" class="dialog-input" style="margin-top: 10px" placeholder="请输入备注" type="textarea" maxlength="50" clearable/>
          </div>
        </el-col>
        <el-col :span="13">
          <span style="float: right;margin-top: 5px;font-weight: bold;color: #e47744">Total: {{ receiveList.length }} 批, {{ totalNum }}片</span>
          <div class="module-title-text" style="float:none;">芯片信息</div>
          <el-table
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
            <el-table-column align="center" label="批次号" prop="batchNo" width="200"/>
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
          :disabled="totalNum === 0"
          type="primary"
          class="submit-btn"
          @click="handleReceiveDialog"
        ><svg-icon icon-class="xiangzuo"/> 接 片</el-button>
        <el-button @click="resetForm('machineForm')">取 消</el-button>
      </span>
    </el-dialog>
    <!--上片1-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="DialogVisible"
      class="padding-dialog"
      title="过站录入"
      width="1200px"
      @close="handleClose">
      <div class="dialog-sub-title"><svg-icon icon-class="jiepianTitle"/>  过站录入-上片</div>
      <div class="overflow-hidden input-container">
        <div class="input-item" style="margin-top: 0">
          <span class="input-title"><svg-icon icon-class="tiaomasm" style="font-size: 20px;color:#009494"/> 批号扫描 </span>
          <!--:disabled="noPlatter"-->
          <el-input ref="importInputSp" :autofocus="true" v-model="batchNo" class="search-input-scan-long scan" placeholder="请输入批号" size="small" maxlength="50" clearable @keyup.enter.native="handleUpSliceScanning"/>
        </div>
        <div class="input-item" style="margin-top: 0;">
          <span class="input-title-short"><svg-icon icon-class="zhandiangl" style="font-size: 20px;color:#009494"/> 站点 </span>
          <el-input :disabled="true" value="研磨过站" class="search-input-scan-long" size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item" style="margin-top: 0; margin-right: 0">
          <span class="input-title-short"><svg-icon icon-class="jianyansz" style="font-size: 20px;color:#009494"/> 工序</span>
          <el-select v-model="jProcess" class="search-input-scan-long" size="small" placeholder="请选择" filterable @change="processSChange">
            <el-option
              v-for="item in proceOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item" style="margin-top: 10px;">
          <span class="input-title-short"><svg-icon icon-class="remarkInput" style="font-size: 20px;color:#009494; margin-left: 5px"/> 制造记录 </span>
          <el-input :disabled="true" v-model="jRemark" class="search-input-scan-long" size="small" maxlength="50" clearable/>
        </div>
        <div class="input-item" style="margin-top: 10px;">
          <span class="input-title-short"><svg-icon icon-class="program" style="font-size: 20px;color:#009494"/> 程序 </span>
          <el-input :disabled="true" v-model="program" class="search-input-scan-long" size="small" maxlength="50" clearable/>
        </div>
      </div>
      <el-row :gutter="15">
        <el-col :span="10">
          <!--基础数据-->
          <div class="module-title-text" style="float:none;">基础数据</div>
          <div class="left-content" style="height: auto">
            <span class="input-title" style=" width: 65px;"><svg-icon icon-class="tiaomasm" style="font-size: 20px;color: #009494; vertical-align: text-top;margin-right: 3px"/>盘号 </span>
            <el-input v-model="platterNo" class="dialog-input" style="margin-top: 8px" size="small" placeholder="盘条形码扫描" maxlength="50" clearable @keyup.enter.native="handlePlateScanning" @input="platterNoChange"/>
            <span class="input-title" style="margin-top: 15px; width: 65px">操作员 </span>
            <el-select v-model="jOperator" class="dialog-input" size="small" placeholder="请选择" filterable>
              <el-option
                v-for="item in userOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
            <span class="input-title" style="line-height: 60px; width: 65px;">备注 </span>
            <el-input v-model="jRemarkLeft" class="dialog-input" style="margin-top: 10px" placeholder="请输入备注" type="textarea" maxlength="50" clearable/>
          </div>
          <!--陪片数据-->
          <span class="module-title-text" style="float:none; margin-top: 15px;display: inline-block">陪片数据</span>
          <div class="wafer-box">
            <div
              v-for="item in wafers"
              :key="item.name"
              :class="{active: item.isActive === true, 'disabled': isDisabled}"
              class="wafer"
              @click="waferClick(item)"
              v-text="item.name"
            >1~12</div>
          </div>
        </el-col>
        <el-col :span="14">
          <span style="float: right;margin-top: 5px;font-weight: bold;color: #e47744">Total: {{ batchNoTotal }} 批, {{ upTotalNum }}片</span>
          <span class="module-title-text" style="float:none;display:inline-block;margin-top: 6px">
            芯片信息
          </span>
          <el-table
            :data="receiveList"
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
            <el-table-column align="center" label="总片数" width="70" prop="total"/>
            <el-table-column align="center" label="上片片数" width="70" prop="upNum"/>
            <el-table-column align="center" label="上片位置">
              <template slot-scope="scope">
                <el-input v-model="scope.row.min" type="number" style="width: 70px;" size="mini" @change="onStrarInput(scope.row)"/> ~
                <el-input v-model="scope.row.max" type="number" style="width: 70px;" size="mini" @change="onEndInput(scope.row)"/>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="45">
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
          :disabled="totalNum === 0"
          type="primary"
          class="submit-btn"
          @click="handleDeliverDialog"
        ><svg-icon icon-class="xiangshang"/> 上 片</el-button>
        <el-button @click="resetForm('machineForm')">取 消</el-button>
      </span>
    </el-dialog>
    <!--上片2-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="deliverDialogVisible"
      class="padding-dialog"
      title="过站录入"
      width="1360px"
      @close="handleClose">
      <div class="dialog-sub-title"><svg-icon icon-class="jiepianTitle"/>  过站录入-上片</div>
      <div class="overflow-hidden input-container">
        <div class="input-item" style="margin-top: 0">
          <span class="input-title-short"><svg-icon icon-class="cotyichangbz" style="font-size: 20px;color:#009494" class=""/>盘类型</span>
          <el-select :disabled="receiveList.length !== 0" v-model="plateNumAddCode" class="search-input-scan-long" style="width: 318px;" size="small" placeholder="请选择" filterable @change="plateChange">
            <el-option
              v-for="item in plateOptions"
              :key="item.id"
              :label="item.name"
              :value="item.diskPosition + '#' + item.code + '#' + item.sliceSize"/>
          </el-select>
        </div>
        <div class="input-item" style="margin-top: 0">
          <span class="input-title"><svg-icon icon-class="tiaomasm" style="font-size: 20px;color:#009494"/> 批号扫描 </span>
          <el-input ref="importInputSp" :disabled="plateNumAddCode === ''" v-model="batchNo" style="width: 318px;" class="search-input-scan-long scan" placeholder="请输入批号" size="small" maxlength="50" clearable @keyup.enter.native="handleUpSliceScanning"/>
        </div>
        <div class="input-item" style="margin-top: 0;margin-right: 0px">
          <span class="input-title-short"><svg-icon icon-class="zonghepanding" style="font-size: 20px;color:#009494"/> 目标厚度 </span>
          <el-input :disabled="true" v-model="targetHd" class="search-input-scan-long target-hd" style="width: 318px;" size="small"/>
        </div>
      </div>
      <el-row :gutter="15">
        <el-col :span="5">
          <!--基础数据-->
          <div class="module-title-text" style="float:none;">基础数据</div>
          <div class="left-content" style="height: 380px">
            <span class="input-title" style="margin-top: 15px; width: 50px">操作员 </span>
            <el-input :disabled="true" v-model="getToken" size="small" class="dialog-input-a" style="margin-top: 10px"/>
            <span class="input-title" style="line-height: 60px; width: 50px;">备注 </span>
            <el-input v-model="jRemarkLeft" class="dialog-input-a" style="margin-top: 10px" placeholder="请输入备注" type="textarea" maxlength="50" clearable/>
          </div>
        </el-col>
        <el-col :span="19">
          <span class="module-title-text" style="float:none;display:inline-block;margin-top: 6px">
            芯片信息
          </span>
          <!--:disabled="replaceBatchDisable"-->
          <div class="float-right">
            <el-button
              :disabled="replaceBatchDisable"
              class="margin-left"
              size="mini"
              type="primary"
              @click="replaceBatch"
            >
              <svg-icon icon-class="change"/>
              批次替换
            </el-button>
            <el-button
              :disabled="selectedrow === '' || selectedrow === null || receiveList.length === 0"
              size="mini"
              type="primary"
              icon="el-icon-delete"
              @click="deleteBatch"
            > 批次删除
            </el-button> <!---->
            <el-button
              :disabled="receiveList.length === 0"
              size="mini"
              type="primary"
              class="margin-left"
              @click="clearBatch"
            > <svg-icon icon-class="clear"/> 清空列表</el-button>
            <el-button
              :disabled="receiveList.length === 0"
              size="mini"
              type="danger"
              @click="handleReporting(2)"
            > <svg-icon icon-class="baojingguiz"/> 异常上报</el-button><!---->
          </div>
          <span style="float: right;margin-top: 5px;font-weight: bold;color: #e47744">Total: {{ receiveList.length }}盘，{{ batchUpNoTotal }} 批</span>
          <el-table
            :data="receiveList"
            class="site-table"
            height="380"
            element-loading-text="拼命加载中"
            highlight-current-row
            border
            fit
            @current-change="currentRowChange"
          >
            <el-table-column align="center" label="流水号" prop="serialNum" width="95"/>
            <el-table-column align="center" label="批次号" prop="batchNo" width="180">
              <template slot-scope="scope">
                <div v-for="(item, index) in scope.row.batchNo.split(',')" :key="index" class="more-plate">
                  {{ item }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="次位号" prop="rankNum" width="240">
              <template slot-scope="scope">
                <div v-for="(item, index) in scope.row.rankNum" :key="index" class="more-plate">
                  {{ item.join(',') }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="产品型号" prop="productModel">
              <template slot-scope="scope">
                <div v-for="(item, index) in scope.row.productModel.split(',')" :key="index" class="more-plate">
                  {{ item }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="目标厚度(um)" prop="targetThickness" width="100"/>
            <el-table-column align="center" label="片数" prop="sliceNo" width="50"/>
            <el-table-column align="center" label="陪片" prop="follow">
              <template slot-scope="scope">
                <div v-if="scope.row.patch === '' || scope.row.patch === null" >--</div>
                <div v-if="scope.row.patch !== '' && scope.row.patch !== null" :class="{'colorRed': scope.row.patch !=='' && scope.row.patch !== null}">{{ scope.row.patch }}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="研磨盘号" prop="" width="120">
              <template slot-scope="scope">
                <el-input :ref="scope.$index + 200" v-model="scope.row.plateNo" style="width: 95%;" size="mini" maxlength="20" @blur="handlePlateScanning(scope.row, scope.$index)" @keyup.enter.native="handlePlateScanning(scope.row, scope.$index)"/>
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
          @click="handleDeliverDialog"
        ><svg-icon icon-class="xiangshang"/> 上 片</el-button>
        <el-button @click="resetForm('machineForm')">取 消</el-button>
      </span>
    </el-dialog>
    <!--粘片-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="glueDialogVisible"
      class="padding-dialog"
      title="过站录入"
      top="65px"
      width="1360px"
      @close="handleClose">
      <div class="dialog-sub-title"><svg-icon icon-class="jiepianTitle"/> 过站录入-粘片</div>
      <div class="overflow-hidden input-container">
        <span class="input-item" style="margin-top: 0;float: none;">
          <span class="input-title" style="width: 150px;"><svg-icon icon-class="tiaomasm" style="font-size: 20px;color:#009494"/> 盘条码扫描 </span>
          <el-input ref="importInputZp" :autofocus="true" v-model="batchNo" class="search-input" style="width: 260px;" placeholder="请输入盘条码" size="small" maxlength="50" clearable @keyup.enter.native="stickScanningFun(0)"/>
        </span>
        <span class="input-item" style="margin-top: 0; float: none;">
          <span class="input-title-short"><svg-icon icon-class="zonghepanding" style="font-size: 20px;color:#009494"/> 目标厚度 </span>
          <el-input :disabled="true" v-model="targetHd" class="search-input-scan-long target-hd" size="small"/>
        </span>
      </div>
      <el-row :gutter="15">
        <el-col :span="6">
          <!--基础数据-->
          <div class="module-title-text" style="float:none;">基础数据</div>
          <div class="left-content" style="height: 175px">
            <span class="input-title" style="margin-top: 15px; width: 50px">操作员 </span>
            <el-input :disabled="true" v-model="getToken" class="dialog-input-short" size="small" style="margin-top: 10px"/>
            <span class="input-title" style="margin-top: 20px; width: 50px">机台 </span>
            <el-select v-model="trench" class="dialog-input-short" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in machineList"
                :key="item.id"
                :label="item.code"
                :value="item.id"/>
            </el-select>
            <span class="input-title" style="line-height: 60px; width: 50px;">备注 </span>
            <el-input v-model="jRemarkLeft" class="dialog-input-short" style="margin-top: 15px" placeholder="请输入备注" type="textarea" maxlength="50" clearable/>
          </div>
        </el-col>
        <el-col :span="18">
          <el-button
            :disabled="receiveList.length === 0"
            class="float-right margin-left"
            type="danger"
            size="mini"
            @click="handleReporting"
          ><svg-icon icon-class="baojingguiz"/> 异常上报</el-button>
          <span style="float: right;margin-top: 5px;font-weight: bold;color: #e47744">Total: {{ batchUpNoTotal }} 批, {{ totalSliceNo }}片</span>
          <span class="module-title-text" style="float:none;display:inline-block;margin-top: 6px">
            芯片信息
          </span>
          <el-table
            :data="receiveList"
            class="site-table"
            height="175"
            element-loading-text="拼命加载中"
            border
            fit
            stripe>
            <el-table-column align="center" label="流水号" prop="serialNum" width="95"/>
            <el-table-column align="center" label="批次号" prop="batchNo" width="180">
              <template slot-scope="scope">
                <div v-for="(item, index) in scope.row.batchNo.split(',')" :key="index" class="more-plate">
                  {{ item }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="产品型号" prop="productModel">
              <template slot-scope="scope">
                <div v-for="(item, index) in scope.row.productModel.split(',')" :key="index" class="more-plate">
                  {{ item }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="目标厚度(um)" prop="targetThickness" width="100"/>
            <el-table-column align="center" label="次位号" prop="rankNum" width="240">
              <template slot-scope="scope">
                <div v-for="(item, index) in scope.row.rankNum" :key="index" class="more-plate">
                  {{ item.join(',') }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="片数" prop="sliceNo" width="50"/>
            <el-table-column align="center" label="陪片" prop="follow">
              <template slot-scope="scope">
                <div v-if="scope.row.patch === '' || scope.row.patch === null" >--</div>
                <div v-if="scope.row.patch !== '' && scope.row.patch !== null" :class="{'colorRed': scope.row.patch !=='' && scope.row.patch !== null}">{{ scope.row.patch }}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="研磨盘号" prop="plateNo" width="100"/>
            <el-table-column align="center" label="操作" width="45">
              <template slot-scope="scope">
                <el-button type="danger" round icon="el-icon-close" size="mini" @click="deleteItem(scope.$index, 1)"/>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div class="module-title">
        <div class="module-title-text">测试数据录入</div>
      </div>
      <el-row :gutter="15">
        <el-col :span="8">
          <table cellspacing="0" cellpadding="0" border="0" style="display: inline-grid; margin-top: 10px;width: 100%;border-top:1px solid #aad7d7;border-left:1px solid #aad7d7;">
            <tr>
              <td class="table-td" style="background: #D6EEEE;border-bottom-width: 2px">片位</td>
              <td class="table-td" style="background: #D6EEEE;border-bottom-width: 2px">第1点</td>
              <td class="table-td" style="background: #D6EEEE;border-bottom-width: 2px">第2点</td>
            </tr>
            <tr>
              <td class="table-td">第1片</td>
              <td class="table-td">
                <!--:disabled="decideResult !== '请判定'"-->
                <el-input ref="100" v-model="min1" size="mini" type="number" @keyup.enter.native="testScanningFun(1)"/>
              </td>
              <td class="table-td">
                <el-input ref="101" v-model="max1" size="mini" type="number" @keyup.enter.native="testScanningFun(2)"/>
              </td>
            </tr>
            <tr>
              <td class="table-td">第2片</td>
              <td class="table-td">
                <el-input ref="102" v-model="min2" size="mini" type="number" @keyup.enter.native="testScanningFun(3)"/>
              </td>
              <td class="table-td">
                <el-input ref="103" v-model="max2" size="mini" type="number" @keyup.enter.native="testScanningFun(4)"/>
              </td>
            </tr>
            <tr>
              <td class="table-td">第3片</td>
              <td class="table-td">
                <el-input ref="104" v-model="min3" size="mini" type="number" @keyup.enter.native="testScanningFun(5)"/>
              </td>
              <td class="table-td">
                <el-input ref="105" v-model="max3" size="mini" type="number" @keyup.enter.native="testScanningFun(6)"/>
              </td>
            </tr>
            <tr>
              <td class="table-td">第4片</td>
              <td class="table-td">
                <el-input ref="107" v-model="min4" size="mini" type="number" @keyup.enter.native="testScanningFun(7)"/>
              </td>
              <td class="table-td">
                <el-input ref="108" v-model="max4" size="mini" type="number" @blur="handleDecide" @keyup.enter.native="testScanningFun(0)"/>
              </td>
            </tr>
          </table>
        </el-col>
        <el-col :span="8">
          <div class="left-content" style="height: 177px">
            <div>
              <span class="input-title" style="margin-top: 15px; width: 80px">产品型号： </span>
              <span class="dialog-input margin-top" v-text="productModel"/>
            </div>
            <div>
              <span class="input-title" style="margin-top: 15px; width: 80px">目标厚度： </span>
              <span class="dialog-input margin-top" v-text="targetHd"/>
            </div>
            <div>
              <span class="input-title" style="margin-top: 15px; width: 80px">上限： </span>
              <span class="dialog-input margin-top" v-text="targetUp"/>
            </div>
            <div>
              <span class="input-title" style="margin-top: 15px; width: 80px">下限： </span>
              <span class="dialog-input margin-top" v-text="targetDown"/>
            </div>
            <div>
              <el-button
                :disabled="receiveList.length === 0 || decideResult === '请判定'"
                class="float-right"
                size="small"
                type="primary"
                @click="handleRetest"
              > <svg-icon icon-class="xiangzuo"/> 重测</el-button>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="left-content" style="height: 177px">
            <div>
              <span class="input-title" style="margin-top: 15px; width: 80px">判定结果： </span>
            </div>
            <div style="line-height: 120px; font-size: 45px;text-align: center;font-weight: bold">
              <span v-if="decideResult === 'OK'" style="color: #2ebe99">OK</span>
              <span v-if="decideResult === 'NG'" style="color: #d7535d">NG</span>
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="cut-line"/>
      <span slot="footer" class="dialog-footer" style="text-align: center">
        <el-button
          :disabled="totalNum === 0 || decideResult === '请判定' || decideResult === 'NG'"
          type="primary"
          class="submit-btn"
          @click="addStickFun(0)"
        ><svg-icon icon-class="zhanpian"/> 粘片</el-button>
        <el-button @click="resetForm('machineForm')">取 消</el-button>
      </span>
    </el-dialog>
    <!--减薄-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="grindDialogVisible"
      class="padding-dialog"
      title="过站录入"
      top="65px"
      width="1360px"
      @close="handleClose">
      <div class="dialog-sub-title"><svg-icon icon-class="jiepianTitle"/> 过站录入-减薄</div>
      <div class="overflow-hidden input-container">
        <span class="input-item" style="margin-top: 0;float: none;">
          <span class="input-title" style="width: 150px;"><svg-icon icon-class="tiaomasm" style="font-size: 20px;color:#009494"/> 盘条码扫描 </span>
          <el-input ref="importInputZp" :autofocus="true" v-model="batchNo" class="search-input" style="width: 260px;" placeholder="请输入盘条码" size="small" maxlength="50" clearable @keyup.enter.native="stickScanningFun(1)"/>
        </span>
        <span class="input-item" style="margin-top: 0; float: none;">
          <span class="input-title-short"><svg-icon icon-class="zonghepanding" style="font-size: 20px;color:#009494"/> 目标厚度 </span>
          <el-input :disabled="true" v-model="targetHd" class="search-input-scan-long target-hd" size="small"/>
        </span>
      </div>
      <el-row :gutter="15">
        <el-col :span="6">
          <!--基础数据-->
          <div class="module-title-text" style="float:none;">基础数据</div>
          <div class="left-content" style="height: 175px">
            <span class="input-title" style="margin-top: 15px; width: 50px">操作员 </span>
            <el-input :disabled="true" v-model="getToken" class="dialog-input-short" size="small" style="margin-top: 10px"/>
            <span class="input-title" style="margin-top: 20px; width: 50px">机台 </span>
            <el-select v-model="trench" class="dialog-input-short" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in machineList"
                :key="item.id"
                :label="item.code"
                :value="item.id"/>
            </el-select>
            <span class="input-title" style="line-height: 60px; width: 50px;">备注 </span>
            <el-input v-model="jRemarkLeft" class="dialog-input-short" style="margin-top: 15px" placeholder="请输入备注" type="textarea" maxlength="50" clearable/>
          </div>
        </el-col>
        <el-col :span="18">
          <el-button
            :disabled="receiveList.length === 0"
            class="float-right margin-left"
            type="danger"
            size="mini"
            @click="handleReporting"
          ><svg-icon icon-class="baojingguiz"/> 异常上报</el-button>
          <span style="float: right;margin-top: 5px;font-weight: bold;color: #e47744">Total: {{ batchUpNoTotal }} 批, {{ totalSliceNo }}片</span>
          <span class="module-title-text" style="float:none;display:inline-block;margin-top: 6px">
            芯片信息
          </span>
          <el-table
            :data="receiveList"
            class="site-table"
            height="175"
            element-loading-text="拼命加载中"
            border
            fit
            stripe>
            <el-table-column align="center" label="流水号" prop="serialNum" width="95"/>
            <el-table-column align="center" label="批次号" prop="batchNo" width="180">
              <template slot-scope="scope">
                <div v-for="(item, index) in scope.row.batchNo.split(',')" :key="index" class="more-plate">
                  {{ item }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="产品型号" prop="productModel">
              <template slot-scope="scope">
                <div v-for="(item, index) in scope.row.productModel.split(',')" :key="index" class="more-plate">
                  {{ item }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="目标厚度(um)" prop="targetThickness" width="100"/>
            <el-table-column align="center" label="次位号" prop="rankNum" width="240">
              <template slot-scope="scope">
                <div v-for="(item, index) in scope.row.rankNum" :key="index" class="more-plate">
                  {{ item.join(',') }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="片数" prop="sliceNo" width="50"/>
            <el-table-column align="center" label="陪片" prop="follow">
              <template slot-scope="scope">
                <div v-if="scope.row.patch === '' || scope.row.patch === null" >--</div>
                <div v-if="scope.row.patch !== '' && scope.row.patch !== null" :class="{'colorRed': scope.row.patch !=='' && scope.row.patch !== null}">{{ scope.row.patch }}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="研磨盘号" prop="plateNo" width="100"/>
            <el-table-column align="center" label="操作" width="45">
              <template slot-scope="scope">
                <el-button type="danger" round icon="el-icon-close" size="mini" @click="deleteItem(scope.$index, 1)"/>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div class="module-title">
        <div class="module-title-text">测试数据录入</div>
      </div>
      <el-row :gutter="15">
        <el-col :span="8">
          <table cellspacing="0" cellpadding="0" border="0" style="display: inline-grid; margin-top: 10px;width: 100%;border-top:1px solid #aad7d7;border-left:1px solid #aad7d7;">
            <tr>
              <td class="table-td" style="background: #D6EEEE;border-bottom-width: 2px">片位</td>
              <td class="table-td" style="background: #D6EEEE;border-bottom-width: 2px">第1点</td>
              <td class="table-td" style="background: #D6EEEE;border-bottom-width: 2px">第2点</td>
            </tr>
            <tr>
              <td class="table-td">第1片</td>
              <td class="table-td">
                <!--:disabled="decideResult !== '请判定'"-->
                <el-input ref="100" v-model="min1" size="mini" type="number" @keyup.enter.native="testScanningFun(1)"/>
              </td>
              <td class="table-td">
                <el-input ref="101" v-model="max1" size="mini" type="number" @keyup.enter.native="testScanningFun(2)"/>
              </td>
            </tr>
            <tr>
              <td class="table-td">第2片</td>
              <td class="table-td">
                <el-input ref="102" v-model="min2" size="mini" type="number" @keyup.enter.native="testScanningFun(3)"/>
              </td>
              <td class="table-td">
                <el-input ref="103" v-model="max2" size="mini" type="number" @keyup.enter.native="testScanningFun(4)"/>
              </td>
            </tr>
            <tr>
              <td class="table-td">第3片</td>
              <td class="table-td">
                <el-input ref="104" v-model="min3" size="mini" type="number" @keyup.enter.native="testScanningFun(5)"/>
              </td>
              <td class="table-td">
                <el-input ref="105" v-model="max3" size="mini" type="number" @keyup.enter.native="testScanningFun(6)"/>
              </td>
            </tr>
            <tr>
              <td class="table-td">第4片</td>
              <td class="table-td">
                <el-input ref="107" v-model="min4" size="mini" type="number" @keyup.enter.native="testScanningFun(7)"/>
              </td>
              <td class="table-td">
                <el-input ref="108" v-model="max4" size="mini" type="number" @blur="handleDecide" @keyup.enter.native="testScanningFun(0)"/>
              </td>
            </tr>
          </table>
        </el-col>
        <el-col :span="8">
          <div class="left-content" style="height: 177px">
            <div>
              <span class="input-title" style="margin-top: 15px; width: 80px">产品型号： </span>
              <span class="dialog-input margin-top" v-text="productModel"/>
            </div>
            <div>
              <span class="input-title" style="margin-top: 15px; width: 80px">目标厚度： </span>
              <span class="dialog-input margin-top" v-text="targetHd"/>
            </div>
            <div>
              <span class="input-title" style="margin-top: 15px; width: 80px">上限： </span>
              <span class="dialog-input margin-top" v-text="targetUp"/>
            </div>
            <div>
              <span class="input-title" style="margin-top: 15px; width: 80px">下限： </span>
              <span class="dialog-input margin-top" v-text="targetDown"/>
            </div>
            <div>
              <el-button
                :disabled="receiveList.length === 0 || decideResult === '请判定'"
                class="float-right"
                size="small"
                type="primary"
                @click="handleRetest"
              > <svg-icon icon-class="xiangzuo"/> 重测</el-button>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="left-content" style="height: 177px">
            <div>
              <span class="input-title" style="margin-top: 15px; width: 80px">判定结果： </span>
            </div>
            <div style="line-height: 120px; font-size: 45px;text-align: center;font-weight: bold">
              <span v-if="decideResult === 'OK'" style="color: #2ebe99">OK</span>
              <span v-if="decideResult === 'NG'" style="color: #d7535d">NG</span>
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="cut-line"/>
      <span slot="footer" class="dialog-footer" style="text-align: center">
        <el-button
          :disabled="totalNum === 0 || decideResult === '请判定' || decideResult === 'NG'"
          type="primary"
          class="submit-btn"
          @click="addStickFun(1)"
        ><svg-icon icon-class="yanmo"/> 减薄</el-button>
        <el-button @click="resetForm('machineForm')">取 消</el-button>
      </span>
    </el-dialog>
    <!--抛光-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="polishingDialogVisible"
      class="padding-dialog"
      title="过站录入"
      top="65px"
      width="1360px"
      @close="handleClose">
      <div class="dialog-sub-title"><svg-icon icon-class="jiepianTitle"/> 过站录入-抛光</div>
      <div class="overflow-hidden input-container">
        <span class="input-item" style="margin-top: 0;float: none;">
          <span class="input-title" style="width: 150px;"><svg-icon icon-class="tiaomasm" style="font-size: 20px;color:#009494"/> 盘条码扫描 </span>
          <el-input ref="importInputZp" :autofocus="true" v-model="batchNo" class="search-input" style="width: 260px;" placeholder="请输入盘条码" size="small" maxlength="50" clearable @keyup.enter.native="stickScanningFun(2)"/>
        </span>
        <span class="input-item" style="margin-top: 0; float: none;">
          <span class="input-title-short"><svg-icon icon-class="zonghepanding" style="font-size: 20px;color:#009494"/> 目标厚度 </span>
          <el-input :disabled="true" v-model="targetHd" class="search-input-scan-long target-hd" size="small"/>
        </span>
      </div>
      <el-row :gutter="15">
        <el-col :span="6">
          <!--基础数据-->
          <div class="module-title-text" style="float:none;">基础数据</div>
          <div class="left-content" style="height: 175px">
            <span class="input-title" style="margin-top: 15px; width: 50px">操作员 </span>
            <el-input :disabled="true" v-model="getToken" class="dialog-input-short" size="small" style="margin-top: 10px"/>
            <span class="input-title" style="margin-top: 20px; width: 50px">机台 </span>
            <el-select v-model="trench" class="dialog-input-short" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in machineList"
                :key="item.id"
                :label="item.code"
                :value="item.id"/>
            </el-select>
            <span class="input-title" style="line-height: 60px; width: 50px;">备注 </span>
            <el-input v-model="jRemarkLeft" class="dialog-input-short" style="margin-top: 15px" placeholder="请输入备注" type="textarea" maxlength="50" clearable/>
          </div>
        </el-col>
        <el-col :span="18">
          <el-button
            :disabled="receiveList.length === 0"
            class="float-right margin-left"
            type="danger"
            size="mini"
            @click="handleReporting"
          ><svg-icon icon-class="baojingguiz"/> 异常上报</el-button>
          <span style="float: right;margin-top: 5px;font-weight: bold;color: #e47744">Total: {{ batchUpNoTotal }} 批, {{ totalSliceNo }}片</span>
          <span class="module-title-text" style="float:none;display:inline-block;margin-top: 6px">
            芯片信息
          </span>
          <el-table
            :data="receiveList"
            class="site-table"
            height="175"
            element-loading-text="拼命加载中"
            border
            fit
            stripe>
            <el-table-column align="center" label="流水号" prop="serialNum" width="95"/>
            <el-table-column align="center" label="批次号" prop="batchNo" width="180">
              <template slot-scope="scope">
                <div v-for="(item, index) in scope.row.batchNo.split(',')" :key="index" class="more-plate">
                  {{ item }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="产品型号" prop="productModel">
              <template slot-scope="scope">
                <div v-for="(item, index) in scope.row.productModel.split(',')" :key="index" class="more-plate">
                  {{ item }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="目标厚度(um)" prop="targetThickness" width="100"/>
            <el-table-column align="center" label="次位号" prop="rankNum" width="240">
              <template slot-scope="scope">
                <div v-for="(item, index) in scope.row.rankNum" :key="index" class="more-plate">
                  {{ item.join(',') }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="片数" prop="sliceNo" width="50"/>
            <el-table-column align="center" label="陪片" prop="follow">
              <template slot-scope="scope">
                <div v-if="scope.row.patch === '' || scope.row.patch === null" >--</div>
                <div v-if="scope.row.patch !== '' && scope.row.patch !== null" :class="{'colorRed': scope.row.patch !=='' && scope.row.patch !== null}">{{ scope.row.patch }}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="研磨盘号" prop="plateNo" width="100"/>
            <el-table-column align="center" label="操作" width="45">
              <template slot-scope="scope">
                <el-button type="danger" round icon="el-icon-close" size="mini" @click="deleteItem(scope.$index, 1)"/>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div class="module-title">
        <div class="module-title-text">测试数据录入</div>
      </div>
      <el-row :gutter="15">
        <el-col :span="8">
          <table cellspacing="0" cellpadding="0" border="0" style="display: inline-grid; margin-top: 10px;width: 100%;border-top:1px solid #aad7d7;border-left:1px solid #aad7d7;">
            <tr>
              <td class="table-td" style="background: #D6EEEE;border-bottom-width: 2px">片位</td>
              <td class="table-td" style="background: #D6EEEE;border-bottom-width: 2px">第1点</td>
              <td class="table-td" style="background: #D6EEEE;border-bottom-width: 2px">第2点</td>
            </tr>
            <tr>
              <td class="table-td">第1片</td>
              <td class="table-td">
                <!--:disabled="decideResult !== '请判定'"-->
                <el-input ref="100" v-model="min1" size="mini" type="number" @keyup.enter.native="testScanningFun(1)"/>
              </td>
              <td class="table-td">
                <el-input ref="101" v-model="max1" size="mini" type="number" @keyup.enter.native="testScanningFun(2)"/>
              </td>
            </tr>
            <tr>
              <td class="table-td">第2片</td>
              <td class="table-td">
                <el-input ref="102" v-model="min2" size="mini" type="number" @keyup.enter.native="testScanningFun(3)"/>
              </td>
              <td class="table-td">
                <el-input ref="103" v-model="max2" size="mini" type="number" @keyup.enter.native="testScanningFun(4)"/>
              </td>
            </tr>
            <tr>
              <td class="table-td">第3片</td>
              <td class="table-td">
                <el-input ref="104" v-model="min3" size="mini" type="number" @keyup.enter.native="testScanningFun(5)"/>
              </td>
              <td class="table-td">
                <el-input ref="105" v-model="max3" size="mini" type="number" @keyup.enter.native="testScanningFun(6)"/>
              </td>
            </tr>
            <tr>
              <td class="table-td">第4片</td>
              <td class="table-td">
                <el-input ref="107" v-model="min4" size="mini" type="number" @keyup.enter.native="testScanningFun(7)"/>
              </td>
              <td class="table-td">
                <el-input ref="108" v-model="max4" size="mini" type="number" @blur="handleDecide" @keyup.enter.native="testScanningFun(0)"/>
              </td>
            </tr>
          </table>
        </el-col>
        <el-col :span="8">
          <div class="left-content" style="height: 177px">
            <div>
              <span class="input-title" style="margin-top: 15px; width: 80px">产品型号： </span>
              <span class="dialog-input margin-top" v-text="productModel"/>
            </div>
            <div>
              <span class="input-title" style="margin-top: 15px; width: 80px">目标厚度： </span>
              <span class="dialog-input margin-top" v-text="targetHd"/>
            </div>
            <div>
              <span class="input-title" style="margin-top: 15px; width: 80px">上限： </span>
              <span class="dialog-input margin-top" v-text="targetUp"/>
            </div>
            <div>
              <span class="input-title" style="margin-top: 15px; width: 80px">下限： </span>
              <span class="dialog-input margin-top" v-text="targetDown"/>
            </div>
            <div>
              <el-button
                :disabled="receiveList.length === 0 || decideResult === '请判定'"
                class="float-right"
                size="small"
                type="primary"
                @click="handleRetest"
              > <svg-icon icon-class="xiangzuo"/> 重测</el-button>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="left-content" style="height: 177px">
            <div>
              <span class="input-title" style="margin-top: 15px; width: 80px">判定结果： </span>
            </div>
            <div style="line-height: 120px; font-size: 45px;text-align: center;font-weight: bold">
              <span v-if="decideResult === 'OK'" style="color: #2ebe99">OK</span>
              <span v-if="decideResult === 'NG'" style="color: #d7535d">NG</span>
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="cut-line"/>
      <span slot="footer" class="dialog-footer" style="text-align: center">
        <el-button
          :disabled="totalNum === 0 || decideResult === '请判定' || decideResult === 'NG'"
          type="primary"
          class="submit-btn"
          @click="addStickFun(2)"
        ><svg-icon icon-class="zonghepanding"/> 抛光</el-button>
        <el-button @click="resetForm('machineForm')">取 消</el-button>
      </span>
    </el-dialog>
    <!--清洗-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="clearDialogVisible"
      class="padding-dialog"
      title="过站录入"
      top="65px"
      width="1360px"
      @close="handleClose">
      <div class="dialog-sub-title"><svg-icon icon-class="jiepianTitle"/> 过站录入-清洗</div>
      <el-row :gutter="15">
        <el-col :span="15">
          <div class="overflow-hidden input-container">
            <div class="input-item" style="margin-top: 0;">
              <span class="input-title" style="width: 60px;"> 操作员 </span>
              <el-input :disabled="true" v-model="getToken" class="dialog-input" style="width: 320px;" size="small"/>
            </div>
            <div class="input-item" style="margin-top: 0;margin-right: 0">
              <span class="input-title" style="width: 60px;"> 机台 </span>
              <el-select v-model="trench" class="dialog-input" style="width: 320px;" size="small" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in machineList"
                  :key="item.id"
                  :label="item.code"
                  :value="item.id"/>
              </el-select>
            </div>
            <div class="input-item" style="margin-top: 10px;margin-right: 0">
              <span class="input-title" style="width: 60px;"> 备注 </span>
              <el-input v-model="jRemarkLeft" class="search-input" style="width: 734px;" placeholder="请输入备注" size="small" maxlength="50" clearable />
            </div>
          </div>
        </el-col>
        <el-col :span="9">
          <div class="overflow-hidden input-container">
            <div class="input-item" style="margin-top: 0;text-align: left;margin-right: 0px">
              <span class="input-title" style="width: 50px;">时间</span>
              <el-date-picker
                v-model="startTime"
                :picker-options="pickerOptionsDialogStart"
                :editable="false"
                class="search-input"
                style="width: 181px;"
                size="small"
                type="datetime"
                placeholder="开始日期"
                value-format="timestamp"
                format="yyyy-MM-dd HH:mm"
              />
              <span style="display:inline-block;width: 38px;text-align: center"> 至 </span>
              <el-date-picker
                v-model="endTime"
                :picker-options="pickerOptionsDialogEnd"
                :editable="false"
                class="search-input"
                style="width: 181px;"
                size="small"
                type="datetime"
                placeholder="结束日期"
                value-format="timestamp"
                format="yyyy-MM-dd HH:mm"
              />
            </div>
            <el-button
              size="small"
              class="float-right"
              style="height: 32px;margin-top: 14px; margin-right: 15px"
              type="primary"
              icon="el-icon-search"
              @click="getHasUpNoPlatterFun" >查 询</el-button>
            <div style="text-align: left">
              <el-checkbox v-model="notFinished" style="margin-top: 20px;margin-left: 10px" @change="justLookNotFinished">只看未下片</el-checkbox>
              <span style="width: 60px;font-weight: bold;margin-left: 10px"> 批次扫描 </span>
              <el-input v-model="searchBatchNo" class="search-input" style="width: 195px;" placeholder="请输入批次号" size="small" maxlength="30" clearable />
            </div>
          </div>
        </el-col>
      </el-row>
      <el-button
        :disabled="totalNum === 0"
        class="float-right margin-left"
        type="danger"
        size="mini"
        @click="handleReporting(1)"
      ><svg-icon icon-class="baojingguiz"/> 异常上报</el-button>
      <!--<span style="float: right;margin-top: 5px;font-weight: bold;color: #e47744">Total: {{ receiveList.length }} 批, {{ totalNum }}片</span>-->
      <span class="module-title-text" style="display:inline-block;margin-top: 6px;margin-right: 20px">
        芯片信息
      </span>
      <div class="table-top-btn-group">
        <div
          v-for="item in plateOptions"
          :key="item.name"
          :class="{'active':isActive === item.code}"
          @click="navClick(item.code)"
        >
          {{ item.name }}
        </div>
      </div>
      <span style="float: right;margin-top: 5px;font-weight: bold;color: #e47744">Total: {{ receiveList.length }} 盘</span>
      <el-table
        :data="receiveList"
        :row-style="rowStyle"
        class="clear-table"
        style="border-top: 2px solid #009494!important;"
        height="470"
        element-loading-text="拼命加载中"
        border
        fit
      >
        <el-table-column align="center" label="流水号" prop="serialNum" width="95"/>
        <el-table-column align="center" label="批次号" prop="batchNo" width="180">
          <template slot-scope="scope">
            <div v-for="(item, index) in scope.row.batchNo.split(',')" :key="index" class="more-plate">
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="产品型号" prop="productModel" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-for="(item, index) in scope.row.productModel.split(',')" :key="index" class="more-plate">
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="目标厚度(um)" prop="targetThickness" width="100"/>
        <el-table-column align="center" label="次位号" prop="rankNum" width="240" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-for="(item, index) in scope.row.rankNum" :key="index" class="more-plate">
              {{ item.join(',') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="片数" prop="sliceNo" width="50"/>
        <el-table-column align="center" label="陪片" prop="follow" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.patch === '' || scope.row.patch === null" >--</div>
            <div v-if="scope.row.patch !== '' && scope.row.patch !== null" :class="{'colorRed': scope.row.patch !=='' && scope.row.patch !== null}">{{ scope.row.patch }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="研磨盘号" prop="plateNo" width="100"/>
        <el-table-column align="center" label="状态" prop="offStatus" width="70">
          <template slot-scope="scope">
            <span v-if="scope.row.offStatus === 0">未下片</span>
            <span v-if="scope.row.offStatus === 1">已下片</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="位置" prop="schedule" width="70"/>
        <el-table-column align="center" label="操作" width="160">
          <template slot-scope="scope">
            <el-button
              :disabled="scope.row.offStatus === 1"
              type="primary"
              size="mini"
              @click="handleClearDialog(scope.row)"
            ><svg-icon icon-class="bottom"/> 下片</el-button>
            <el-button
              type="primary"
              size="mini"
              @click="handleFragReport(scope.row)"
            ><svg-icon icon-class="top"/> 碎片上报</el-button>
          </template>
        </el-table-column>
      </el-table>
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
          <el-input ref="importInputCp" :autofocus="true" v-model="batchNo" class="search-input-scan" placeholder="请输入批号" size="small" maxlength="50" clearable @keyup.enter.native="handleTransmitInput"/>
        </div>
        <div class="input-item" style="margin-top: 0;">
          <span class="input-title-short"><svg-icon icon-class="zhandiangl" style="font-size: 20px;color:#009494"/> 站点 </span>
          <el-input :disabled="true" value="研磨过站" class="search-input-scan" size="small" maxlength="20" clearable/>
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
        <el-col :span="11">
          <div class="module-title-text" style="float:none;">接片信息</div>
          <div class="left-content">
            <span class="input-title" style="margin-top: 15px; width: 65px">操作员 </span>
            <el-input :disabled="true" v-model="getToken" class="dialog-input" size="small"/>
            <!--
            <span class="input-title" style=" width: 65px;">传片时间</span>
            <el-date-picker
              v-model="glueTime"
              :default-value="new Date()"
              :default-time="new Date()"
              size="small"
              class="dialog-input-short margin-top"
              style="width: 342px;"
              type="datetime"
              placeholder="选择日期时间"/>-->
            <span class="input-title" style="line-height: 60px; width: 65px;">备注 </span>
            <el-input v-model="jRemarkLeft" class="dialog-input" style="margin-top: 10px;width: 342px;" placeholder="请输入备注" type="textarea" maxlength="50" clearable/>
          </div>
        </el-col>
        <el-col :span="13">
          <el-button
            :disabled="totalNum === 0"
            class="float-right margin-left"
            type="danger"
            size="mini"
            @click="handleReporting2"
          ><svg-icon icon-class="baojingguiz"/> 异常上报</el-button>
          <span style="float: right;margin-top: 5px;font-weight: bold;color: #e47744">Total: {{ receiveList.length }} 批, {{ totalNum }}片</span>
          <div class="module-title-text" style="float:none;">批次信息</div>
          <el-table
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
            <el-table-column align="center" label="批次号" prop="batchNo"/>
            <el-table-column align="center" label="片数" prop="total" width="80"/>
            <el-table-column align="center" label="操作" width="80">
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
          :disabled="totalNum === 0"
          type="primary"
          class="submit-btn"
          @click="handleTransmitDialog"
        ><svg-icon icon-class="xiangyou"/> 传 片</el-button>
        <el-button @click="resetForm('machineForm')">取 消</el-button>
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
        <el-button v-if="deliverDialogVisible" type="primary" @click="abnormalSubmit(1)">异常提交</el-button>
        <el-button v-if="!deliverDialogVisible" type="primary" @click="abnormalSubmit">异常提交</el-button>
        <el-button @click="abnormalReportDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <!--批次替换-->
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="replaceBatchDialog"
      class="padding-dialog"
      title="替换"
      width="455px"
      @close="handleReplaceClose">
      <span class="input-title" style="margin-top: 15px; width: 77px">替换批次号 </span>
      <el-input v-model="replaceBatchNo" class="dialog-input" size="small" style="margin-top: 10px"/>
      <span slot="footer" class="dialog-footer" style="text-align: center">
        <el-button type="primary" size="small" @click="handleReplaceBatch">确 定</el-button>
      </span>
    </el-dialog>
    <!--碎片上报-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="fragReportVisible"
      class="padding-dialog"
      title="碎片上报"
      width="1300px"
      @close="handleReplaceClose">
      <el-table
        :data="platterWaferList"
        border
        fit
        height="550px"
        highlight-current-row
        class="frag-dialog broad-scrollbar-table"
        @selection-change="selectionChange"
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="流水号" align="center" prop="serialNum" width="100" show-overflow-tooltip/>
        <el-table-column label="位次号" align="center" prop="sequence" width="60" show-overflow-tooltip/>
        <el-table-column label="盘号" align="center" prop="platterNo" width="100" show-overflow-tooltip/>
        <el-table-column label="批次号" align="center" prop="batchNo" width="180" show-overflow-tooltip/>
        <el-table-column label="waferID" align="center" prop="waferNo" width="200" show-overflow-tooltip/>
        <el-table-column label="碎片数量" align="center" prop="fragNum" width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input :disabled="scope.row.isReport === 1" v-model="scope.row.fragNum" size="mini" onkeyup="this.value=this.value.replace(/\D/g,'')" placeholder="*碎片数量" maxlength="1"/>
          </template>
        </el-table-column>
        <el-table-column label="碎片位置" align="center" prop="fragPosition" width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-select :disabled="scope.row.isReport === 1" v-model="scope.row.fragPosition" class="search-input" style="width: 95%;" size="mini" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in fragPositionList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input :disabled="scope.row.isReport === 1" v-model="scope.row.remark" size="mini" placeholder="备注" maxlength="50"/>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFragForm('machineForm')">确 定</el-button>
        <el-button @click="fragReportCancel">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .app-container>>> .cell{
    line-height: 35px;
  }
  .app-container>>> td{
    height: 35px;
  }
  .broad-scrollbar-table>>>.el-table__fixed-body-wrapper{
    height: calc(100% - 73px) !important;
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
  .app-container>>> .el-checkbox{
    margin-left: 30px;
    display: block;
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
    width: 200px;
    height: 335px;
    border: 1px solid #e2e2e2;
    position: absolute;
    z-index: 200;
    background: #fff;
    right: 15px;
    top: 15px;
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
    margin-top: 10px;
  }
  .input-title{
    width: 65px;
  }
  .left-content{
    border: 1px solid #b2dfdf;
    height: 381px;
    margin-top: 10px;
    padding: 5px 10px 10px 10px;
  }
  .dialog-input{
    width: 342px;
  }
  .dialog-input-a{
    width: 185px;
  }
  .dialog-input-base{
    width: 217px;
  }
  .dialog-input-short{
    width: 240px;
  }
  .module-title-text{
    margin-bottom: 10px;
  }
  .wafer.active.disabled{
    cursor: not-allowed !important;
    background: #439494;
    color: #fff;
  }
  .wafer.disabled{
    cursor: not-allowed !important;
  }
  .wafer-box{
    position: relative;
    overflow: hidden;
    width: 435.3px;
    border:1px solid #b0dede;
    border-right: none;
    border-bottom: none;
  }
  .wafer{
    float: left;
    width: 36.2px;
    height: 36px;
    border: 1px solid #b0dede;
    border-top: none;
    border-left: none;
    line-height: 36px;
    text-align: center;
    cursor: pointer;
  }
  .wafer.active{
    background: #009494;
    color: #fff;
  }
  .search-input{
    width: 138px;
  }
  .input-container{
    padding: 10px;
    border: 1px solid #b2dfdf;
    padding-right: 0;
    background: #edf7f7;
    margin: 10px 0;
    text-align: center;
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
  }
  .input-container>>> .scan.el-input.is-disabled .el-input__inner, .left-content>>> .el-input.is-disabled .el-input__inner{
    background-color: #f5f7fa;
    border-color: #E4E7ED;
    cursor: not-allowed;
    font-size: 14px;
  }
  .padding-dialog>>> .el-dialog__footer{
    text-align: center;
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
  .successtext{
    color: #1abb9d
  }
  .successtext.textdanger{
    color: #f56c6c
  }
  .search-input-scan{
    width: 248px;
  }
  .search-input-scan-long{
    width: 264px;
  }
  .more-plate:not(:last-child){
    border-bottom: 1px solid #aad7d7;
  }
  .colorRed{
    color: #F56C6C
  }
  .padding-dialog>>> .el-checkbox {
    margin-left: 2px;
  }
  .frag-dialog>>> .el-checkbox {
    margin-left: 18px;
  }
  .padding-dialog td.table-td{
    text-align:center;
    width:144px;
    height:35px;
    border-bottom:1px solid #aad7d7;
    border-right:1px solid #aad7d7;
    padding: 0 2px;
  }
  .table-top-btn-group{
    float: left;
    overflow: hidden;
    border-bottom: none;
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
  .clear-table>>> .el-button--primary.is-disabled{
    background: #c2c2c2;
    border-color: #c2c2c2;
  }
  .clear-table>>> td .cell, .site-table>>> td .cell{
    height: auto !important;
  }
  .target-hd>>> .el-input__inner{
    color: #e25d5d !important;
    font-weight: bold;
  }
  .record-dialog>>> .el-dialog__body{
    padding-bottom: 60px;
  }
</style>
