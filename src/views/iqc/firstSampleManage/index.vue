<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 15px;">
      <div class="header-btn-group">
        <el-button
          size="small"
          type="primary"
          @click="batchSample('新增金属试样', 0)"
        ><svg-icon icon-class="add"/> 新增金属试样</el-button>
        <el-button
          size="small"
          type="primary"
          @click="batchSample('新增化学试样', 1)"
        ><svg-icon icon-class="add"/> 新增化学试样</el-button>
        <el-button
          size="small"
          type="primary"
          @click="batchSample('新增气体试样', 2)"
        ><svg-icon icon-class="add"/> 新增气体试样</el-button>
        <el-button
          size="small"
          type="primary"
          @click="batchSample('新增包材试样', 3)"
        ><svg-icon icon-class="add"/> 新增包材试样</el-button>
        <el-button
          size="small"
          type="primary"
          @click="batchSample('新增衬底试样', 4)"
        ><svg-icon icon-class="add"/> 新增衬底试样</el-button>
        <el-button
          size="small"
          type="primary"
          @click="batchSample('新增MO源试样', 5)"
        ><svg-icon icon-class="add"/> 新增MO源试样</el-button>
        <el-button
          class="float-right"
          size="small"
          type="primary"
          @click="handleExport"
        ><svg-icon icon-class="export"/> 导出</el-button>
        <div class="clear-both"/>
      </div>
      <div style="position: relative;">
        <div class="input-item">
          <span class="input-title" style="width: 35px">单号</span>
          <el-input v-model="searchKeys.dh" class="search-input" placeholder="请输入单号" size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item">
          <span class="input-title" style="width: 50px">供应商</span>
          <el-select v-model="searchKeys.gys" style="width: 120px" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in supplierOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">材料类型</span>
          <el-select v-model="searchKeys.cllx" style="width: 80px" class="search-input" size="small" placeholder="请选择" filterable clearable @change="materialTypeChange">
            <el-option
              v-for="item in materialOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <!--
        <div class="input-item">
          <span class="input-title">材料名称</span>
          <el-select v-model="searchKeys.clmc" class="search-input" size="small" placeholder="请选择" clearable filterable allow-create default-first-option>
            <el-option
              v-for="item in materialNameOptions"
              :key="item.name"
              :label="item.name"
              :value="item.name"/>
          </el-select>
        </div>-->
        <div class="input-item">
          <span class="input-title">试样部门</span>
          <el-select v-model="searchKeys.sybm" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in departmentOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">试样结果</span>
          <el-select v-model="searchKeys.syjg" style="width: 80px" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in resultOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div style="float: left; height: 46px;">
          <div class="input-item" style="margin-right: 20px;margin-left: 10px;padding-top: 8px">
            <el-radio-group v-model="timeRadio">
              <el-radio :label="0">接收日期</el-radio>
              <el-radio :label="1">完成日期</el-radio>
            </el-radio-group>
          </div>
          <div class="input-item">
            <el-date-picker
              v-model="beginDate"
              :picker-options="pickerOptionsStart"
              :editable="false"
              class="search-input"
              style="width: 130px"
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
              style="width: 130px"
              class="search-input"
              size="small"
              type="date"
              placeholder="结束日期"
              value-format="timestamp"
            />
          </div>
          <div class="input-item">
            <el-button
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
        </div>
        <div class="clear-both"/>
      </div>
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        ref="billTable"
        :data="list"
        height="90%"
        class="broad-scrollbar-table"
        element-loading-text="拼命加载中"
        border
        fit
        highlight-current-row
        @row-click="rowClick"
      >
        <el-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="单号" align="center" prop="sampleNo" width="120" show-overflow-tooltip fixed/>
        <el-table-column label="试样类型" align="center" prop="sampleTypeName" width="120" show-overflow-tooltip/>
        <el-table-column label="供应商" align="center" prop="supplierName" width="120" show-overflow-tooltip/>
        <el-table-column label="材料类型" align="center" prop="materialType" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-text="getMaterialType(scope.row.materialType)"/>
          </template>
        </el-table-column>
        <el-table-column label="材料名称" align="center" prop="materialName" width="120" show-overflow-tooltip/>
        <el-table-column label="型号规格" align="center" prop="materialModelName" width="120" show-overflow-tooltip/>
        <el-table-column label="初次试样" align="center" prop="outNo" width="120" show-overflow-tooltip>
          <el-table-column label="试样部门" align="center" prop="sampleWorkshopName" width="120" show-overflow-tooltip/>
          <el-table-column label="试样数量" align="center" prop="sampleNum" width="120" show-overflow-tooltip/>
          <el-table-column label="接收样品日期" align="center" prop="receiveDate" width="120" show-overflow-tooltip/>
          <el-table-column label="预期完成日期" align="center" prop="expectDate" width="120" show-overflow-tooltip/>
          <el-table-column label="实际完成日期" align="center" prop="finishDate" width="120" show-overflow-tooltip/>
          <el-table-column label="试样结果" align="center" prop="result" width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.result === 0" style="color:#1ABC9C;font-weight:bold">合格</span>
              <span v-if="scope.row.result === 1" style="color:#E25D5D;font-weight:bold">不合格</span>
              <span v-if="scope.row.result === -1" >--</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="批量检验" align="center" prop="outNo" width="120" show-overflow-tooltip>
          <el-table-column label="第一批验证数量" align="center" prop="bcheckNum1" width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.bcheckNum1 === '0.00'">--</span>
              <span v-else>{{ scope.row.bcheckNum1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="第一批验证结果" align="center" prop="outNo" width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.bresult1 === '0'" style="color:#1ABC9C;font-weight:bold">合格</span>
              <span v-if="scope.row.bresult1 === '1'" style="color:#E25D5D;font-weight:bold">不合格</span>
              <span v-if="scope.row.bresult1 === '-1'" >--</span>
            </template>
          </el-table-column>
          <el-table-column label="第二批验证数量" align="center" prop="bcheckNum2" width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.bcheckNum2 === '0.00'">--</span>
              <span v-else>{{ scope.row.bcheckNum2 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="第二批验证结果" align="center" prop="outNo" width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.bresult2 === '0'" style="color:#1ABC9C;font-weight:bold">合格</span>
              <span v-if="scope.row.bresult2 === '1'" style="color:#E25D5D;font-weight:bold">不合格</span>
              <span v-if="scope.row.bresult2 === '-1'" >--</span>
            </template>
          </el-table-column>
          <el-table-column label="第三批验证数量" align="center" prop="bcheckNum3" width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.bcheckNum3 === '0.00'">--</span>
              <span v-else>{{ scope.row.bcheckNum3 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="第三批验证结果" align="center" prop="outNo" width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.bresult3 === '0'" style="color:#1ABC9C;font-weight:bold">合格</span>
              <span v-if="scope.row.bresult3 === '1'" style="color:#E25D5D;font-weight:bold">不合格</span>
              <span v-if="scope.row.bresult3 === '-1'" >--</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="正式生产" align="center" prop="outNo" width="120" show-overflow-tooltip>
          <el-table-column label="是否转生产" align="center" prop="isNotice" width="120" show-overflow-tooltip/>
          <el-table-column label="转生产变更通知单" align="center" prop="noticeNo" width="120" show-overflow-tooltip/>
          <el-table-column label="备注" align="center" prop="remark" width="120" show-overflow-tooltip/>
        </el-table-column>
        <el-table-column align="center" label="操作" width="185" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
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
    <!--新增弹窗-->
    <el-dialog
      :before-close="handleDialogClose"
      :close-on-click-modal="false"
      :visible.sync="addMetalDialogVisible"
      :title="dialogTitle"
      class="padding-dialog"
      width="800px"
      top="80px"
      @close="handleClose">
      <div class="tab-control" style="margin-bottom: 0">
        <span
          :class="{activeTab: activeTabIndex === 0}"
          @click="tabClick(0)"
        >初次试样</span>
        <span
          :class="{activeTab: activeTabIndex === 1}"
          class="margin-left"
          @click="tabClick(1)"
        >批量检验</span>
      </div>
      <el-form ref="addForm" :model="addForm" :rules="rules" status-icon label-width="98px" label-position="right">
        <div v-show="activeTabIndex === 0">
          <div class="module-title">
            <div class="module-title-text">任务信息</div>
          </div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item class="clear-both" label="单号" size="small" prop="sybh">
                <el-input v-model="addForm.dh" :disabled="true" class="dialog-input" placeholder="请输入试样编号" size="small" maxlength="20" clearable/>
              </el-form-item>
              <el-form-item class="clear-both" label="试样类型" size="small" prop="gys">
                <el-select v-model="addForm.sylx" class="dialog-input" size="small" placeholder="请选择" filterable clearable>
                  <el-option
                    v-for="item in sampleTypeOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item class="clear-both" label="试样部门" size="small" prop="sybm">
                <el-select v-model="addForm.sybm" class="dialog-input" size="small" placeholder="请选择" filterable clearable>
                  <el-option
                    v-for="item in departmentOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item class="clear-both" label="接收样品日期" size="small" prop="dhrq">
                <el-date-picker
                  v-model="addForm.jsrq"
                  value-format="yyyy-MM-dd"
                  class="dialog-input"
                  type="date"
                  placeholder="选择日期"
                  @change="dateChange"
                />
              </el-form-item>
              <el-form-item class="clear-both" label="预计完成日期" size="small" prop="yldw">
                <el-date-picker
                  v-model="addForm.yjwcrq"
                  value-format="yyyy-MM-dd"
                  class="dialog-input"
                  type="date"
                  placeholder="选择日期"
                  @change="dateChange"
                />
              </el-form-item>
              <el-form-item class="clear-both" label="试样结果" size="small" prop="name">
                <el-radio-group v-model="addForm.syjg">
                  <el-radio :label="0">合格</el-radio>
                  <el-radio :label="1">不合格</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="clear-both" label="供应商" size="small" prop="gys">
                <el-select v-model="addForm.gys" class="dialog-input" size="small" placeholder="请选择" filterable clearable>
                  <el-option
                    v-for="item in supplierDialogOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item class="clear-both" label="材料名称" size="small" prop="clmc">
                <el-select v-model="addForm.clmc" class="dialog-input" size="small" placeholder="请选择" filterable clearable @change="materialChange">
                  <el-option
                    v-for="item in materialNameDialogOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item class="clear-both" label="型号规格" size="small" prop="xhgg">
                <el-select v-model="addForm.xhgg" class="dialog-input" size="small" placeholder="请选择" filterable clearable>
                  <el-option
                    v-for="item in modelOptions"
                    :key="item.id"
                    :label="item.model"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item class="clear-both" label="试样数量" size="small" prop="sysl">
                <el-input v-model="addForm.sysl" class="dialog-input" placeholder="请输入试样数量" size="small" type="text" clearable onkeyup="this.value=this.value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')" @input="numChange"/>
              </el-form-item>
              <el-form-item class="clear-both" label="实际完成日期" size="small" prop="dhrq">
                <el-date-picker
                  v-model="addForm.sjwcrq"
                  value-format="yyyy-MM-dd"
                  class="dialog-input"
                  type="date"
                  placeholder="选择日期"
                  @change="dateChange"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item class="clear-both" label="添加附件" size="small" prop="file">
            <el-upload
              ref="upload"
              :on-remove="handleRemove"
              :file-list="fileList"
              :auto-upload="true"
              :limit="3"
              :on-change="uploadChange"
              :on-success="onSuccess"
              :data="firstSampleParams"
              :on-exceed="onExceed"
              :with-credentials="true"
              :action="fileUrl"
              :before-upload="beforeUpload"
              class="upload-demo"
            >
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <!--<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>-->
              <!--<span slot="tip" class="el-upload__tip" style="margin-left: 15px;">只能上传 dll 文件，且只能上传一份</span>-->
            </el-upload>
          </el-form-item>
        </div>
        <div v-show="activeTabIndex === 1">
          <div class="module-title">
            <div class="module-title-text">第一批验证</div>
          </div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item class="clear-both" label="验证数量" size="small" prop="sybh">
                <el-input v-model="addForm.yzsl1" class="dialog-input" placeholder="请输入验证数量" size="small" clearable type="text" onkeyup="this.value=this.value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')" @input="yzslChange"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="clear-both" label="检验结果" size="small" prop="name">
                <el-radio-group v-model="addForm.jyjg1">
                  <el-radio :label="0">合格</el-radio>
                  <el-radio :label="1">不合格</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item class="clear-both" label="添加附件" size="small" prop="file">
            <el-upload
              ref="upload"
              :on-remove="handleRemove"
              :file-list="fileList1"
              :auto-upload="true"
              :limit="3"
              :on-change="uploadChange"
              :on-success="onSuccess1"
              :with-credentials="true"
              :on-exceed="onExceed"
              :action="fileUrl"
              :before-upload="beforeUpload"
              class="upload-demo"
            >
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            </el-upload>
          </el-form-item>
          <div class="module-title">
            <div class="module-title-text">第二批验证</div>
          </div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item class="clear-both" label="验证数量" size="small" prop="sybh">
                <el-input v-model="addForm.yzsl2" class="dialog-input" placeholder="请输入验证数量" size="small" clearable type="text" onkeyup="this.value=this.value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')" @input="yzslChange"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="clear-both" label="检验结果" size="small" prop="name">
                <el-radio-group v-model="addForm.jyjg2">
                  <el-radio :label="0">合格</el-radio>
                  <el-radio :label="1">不合格</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item class="clear-both" label="添加附件" size="small" prop="file">
            <el-upload
              ref="upload"
              :on-remove="handleRemove"
              :file-list="fileList2"
              :auto-upload="true"
              :limit="3"
              :on-change="uploadChange"
              :on-success="onSuccess2"
              :with-credentials="true"
              :on-exceed="onExceed"
              :action="fileUrl"
              :before-upload="beforeUpload"
              class="upload-demo"
            >
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            </el-upload>
          </el-form-item>
          <div class="module-title">
            <div class="module-title-text">第三批验证</div>
          </div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item class="clear-both" label="验证数量" size="small" prop="sybh">
                <el-input v-model="addForm.yzsl3" class="dialog-input" placeholder="请输入验证数量" size="small" clearable type="text" onkeyup="this.value=this.value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')" @input="yzslChange"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="clear-both" label="检验结果" size="small" prop="name">
                <el-radio-group v-model="addForm.jyjg3">
                  <el-radio :label="0">合格</el-radio>
                  <el-radio :label="1">不合格</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item class="clear-both" label="添加附件" size="small" prop="file">
            <el-upload
              ref="upload"
              :on-remove="handleRemove"
              :file-list="fileList3"
              :auto-upload="true"
              :limit="3"
              :on-change="uploadChange"
              :on-success="onSuccess3"
              :on-exceed="onExceed"
              :with-credentials="true"
              :action="fileUrl"
              :before-upload="beforeUpload"
              class="upload-demo"
            >
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            </el-upload>
          </el-form-item>
          <div class="module-title">
            <div class="module-title-text">正式生产</div>
          </div>
          <el-row :gutter="20">
            <el-col :span="12" class="long-title">
              <el-form-item class="clear-both" label="转生产变更通知单号" size="small" prop="sybh">
                <el-input v-model="addForm.bgdh" style="width: 218px;" placeholder="请输入转生产变更通知单号" size="small" maxlength="30" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="clear-both" label="备注" size="small" prop="name">
                <el-input v-model="addForm.bz" class="dialog-input" placeholder="请输入备注" size="small" type="textarea" maxlength="50" clearable/>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('addForm')">确 定</el-button>
        <el-button @click="resetForm('addForm')">取 消</el-button>
      </span>
    </el-dialog>
    <!--编辑弹窗-->
    <el-dialog
      :before-close="handleDialogClose"
      :close-on-click-modal="false"
      :visible.sync="editMetalDialogVisible"
      title="编辑"
      class="padding-dialog"
      width="800px"
      top="80px"
      @close="handleClose">
      <div class="tab-control" style="margin-bottom: 0">
        <span
          :class="{activeTab: activeTabIndex === 0}"
          @click="tabClick(0)"
        >初次试样</span>
        <span
          :class="{activeTab: activeTabIndex === 1}"
          class="margin-left"
          @click="tabClick(1)"
        >批量检验</span>
      </div>
      <el-form ref="addForm" :model="addForm" :rules="rules" status-icon label-width="98px" label-position="right">
        <div v-if="activeTabIndex === 0">
          <div class="module-title">
            <div class="module-title-text">任务信息</div>
          </div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item class="clear-both" label="单号" size="small" prop="sybh">
                <el-input v-model="addForm.dh" :disabled="true" class="dialog-input" placeholder="请输入试样编号" size="small" maxlength="20" clearable/>
              </el-form-item>
              <el-form-item class="clear-both" label="试样类型" size="small" prop="gys">
                <el-select v-model="addForm.sylx" class="dialog-input" size="small" placeholder="请选择" filterable clearable>
                  <el-option
                    v-for="item in sampleTypeOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item class="clear-both" label="试样部门" size="small" prop="sybm">
                <el-select v-model="addForm.sybm" class="dialog-input" size="small" placeholder="请选择" filterable clearable>
                  <el-option
                    v-for="item in departmentOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item class="clear-both" label="接收样品日期" size="small" prop="dhrq">
                <el-date-picker
                  v-model="addForm.jsrq"
                  value-format="yyyy-MM-dd"
                  class="dialog-input"
                  type="date"
                  placeholder="选择日期"
                  @change="dateChange"
                />
              </el-form-item>
              <el-form-item class="clear-both" label="预计完成日期" size="small" prop="yldw">
                <el-date-picker
                  v-model="addForm.yjwcrq"
                  value-format="yyyy-MM-dd"
                  class="dialog-input"
                  type="date"
                  placeholder="选择日期"
                  @change="dateChange"
                />
              </el-form-item>
              <el-form-item class="clear-both" label="试样结果" size="small" prop="name">
                <el-radio-group v-model="addForm.syjg">
                  <el-radio :label="0">合格</el-radio>
                  <el-radio :label="1">不合格</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="clear-both" label="供应商" size="small" prop="gys">
                <el-select v-model="addForm.gys" class="dialog-input" size="small" placeholder="请选择" filterable clearable>
                  <el-option
                    v-for="item in supplierDialogOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item class="clear-both" label="材料名称" size="small" prop="clmc">
                <el-select v-model="addForm.clmc" class="dialog-input" size="small" placeholder="请选择" filterable clearable @change="materialChange">
                  <el-option
                    v-for="item in materialNameDialogOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item class="clear-both" label="型号规格" size="small" prop="xhgg">
                <el-select v-model="addForm.xhgg" class="dialog-input" size="small" placeholder="请选择" filterable clearable>
                  <el-option
                    v-for="item in modelOptions"
                    :key="item.id"
                    :label="item.model"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item class="clear-both" label="试样数量" size="small" prop="sysl">
                <el-input v-model="addForm.sysl" class="dialog-input" placeholder="请输入试样数量" size="small" type="text" clearable onkeyup="this.value=this.value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')" @input="numChange"/>
              </el-form-item>
              <el-form-item class="clear-both" label="实际完成日期" size="small" prop="dhrq">
                <el-date-picker
                  v-model="addForm.sjwcrq"
                  value-format="yyyy-MM-dd"
                  class="dialog-input"
                  type="date"
                  placeholder="选择日期"
                  @change="dateChange"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item class="clear-both" label="添加附件" size="small" prop="file">
            <el-upload
              ref="upload"
              :on-remove="handleEditRemove"
              :file-list="fileList"
              :on-preview="handlePreview"
              :auto-upload="true"
              :limit="3"
              :on-change="uploadChange"
              :on-success="onEditUploadSuccess"
              :on-exceed="onExceed"
              :data="firstSampleParams"
              :with-credentials="true"
              :action="fileUrl"
              :before-upload="beforeUpload"
              class="upload-demo"
            >
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <!--<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>-->
              <!--<span slot="tip" class="el-upload__tip" style="margin-left: 15px;">只能上传 dll 文件，且只能上传一份</span>-->
            </el-upload>
          </el-form-item>
        </div>
        <div v-if="activeTabIndex === 1">
          <div class="module-title">
            <div class="module-title-text">第一批验证</div>
          </div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item class="clear-both" label="验证数量" size="small" prop="sybh">
                <el-input v-model="addForm.yzsl1" class="dialog-input" placeholder="请输入验证数量" size="small" clearable type="text" onkeyup="this.value=this.value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')" @input="yzslChange"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="clear-both" label="检验结果" size="small" prop="name">
                <el-radio-group v-model="addForm.jyjg1">
                  <el-radio :label="0">合格</el-radio>
                  <el-radio :label="1">不合格</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item class="clear-both" label="添加附件" size="small" prop="file">
            <el-upload
              ref="upload"
              :on-remove="handleEditRemove"
              :on-preview="handlePreview"
              :file-list="fileList1"
              :auto-upload="true"
              :limit="3"
              :data="batchSampleParams1"
              :on-change="uploadChange"
              :on-success="onEditUploadSuccess"
              :on-exceed="onExceed"
              :with-credentials="true"
              :action="fileUrl"
              :before-upload="beforeUpload"
              class="upload-demo"
            >
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            </el-upload>
          </el-form-item>
          <div class="module-title">
            <div class="module-title-text">第二批验证</div>
          </div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item class="clear-both" label="验证数量" size="small" prop="sybh">
                <el-input v-model="addForm.yzsl2" class="dialog-input" placeholder="请输入验证数量" size="small" clearable type="text" onkeyup="this.value=this.value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')" @input="yzslChange"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="clear-both" label="检验结果" size="small" prop="name">
                <el-radio-group v-model="addForm.jyjg2">
                  <el-radio :label="0">合格</el-radio>
                  <el-radio :label="1">不合格</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item class="clear-both" label="添加附件" size="small" prop="file">
            <el-upload
              ref="upload"
              :on-remove="handleEditRemove"
              :file-list="fileList2"
              :auto-upload="true"
              :on-preview="handlePreview"
              :limit="3"
              :data="batchSampleParams2"
              :on-change="uploadChange"
              :on-success="onEditUploadSuccess"
              :on-exceed="onExceed"
              :with-credentials="true"
              :action="fileUrl"
              :before-upload="beforeUpload"
              class="upload-demo"
            >
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            </el-upload>
          </el-form-item>
          <div class="module-title">
            <div class="module-title-text">第三批验证</div>
          </div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item class="clear-both" label="验证数量" size="small" prop="sybh">
                <el-input v-model="addForm.yzsl3" class="dialog-input" placeholder="请输入验证数量" size="small" clearable type="text" onkeyup="this.value=this.value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')" @input="yzslChange"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="clear-both" label="检验结果" size="small" prop="name">
                <el-radio-group v-model="addForm.jyjg3">
                  <el-radio :label="0">合格</el-radio>
                  <el-radio :label="1">不合格</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item class="clear-both" label="添加附件" size="small" prop="file">
            <el-upload
              ref="upload"
              :on-remove="handleEditRemove"
              :file-list="fileList3"
              :auto-upload="true"
              :on-preview="handlePreview"
              :limit="3"
              :data="batchSampleParams3"
              :on-change="uploadChange"
              :on-success="onEditUploadSuccess"
              :on-exceed="onExceed"
              :with-credentials="true"
              :action="fileUrl"
              :before-upload="beforeUpload"
              class="upload-demo"
            >
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            </el-upload>
          </el-form-item>
          <div class="module-title">
            <div class="module-title-text">正式生产</div>
          </div>
          <el-row :gutter="20">
            <el-col :span="12" class="long-title">
              <el-form-item class="clear-both" label="转生产变更通知单号" size="small" prop="sybh">
                <el-input v-model="addForm.bgdh" style="width: 218px;" placeholder="请输入转生产变更通知单号" size="small" maxlength="30" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="clear-both" label="备注" size="small" prop="name">
                <el-input v-model="addForm.bz" class="dialog-input" placeholder="请输入备注" size="small" type="textarea" maxlength="50" clearable/>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEditForm('addForm')">确 定</el-button>
        <el-button @click="resetForm('addForm', 1)">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./firstSampleManage.js"></script>

<style scoped>
  .broad-scrollbar-table>>> .el-table__fixed-body-wrapper{
    height: calc(100% - 69px) !important;
  }
  .app-container>>> .cell{
    line-height: 33px;
  }
  .app-container>>> td{
    height: 33px;
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
  .input-item{
    float: left;
    margin-top: 14px;
    margin-right: 10px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 263px);
  }
  .module-title-text{
    margin-bottom: 10px;
  }
  .module-title {
    margin-bottom: 10px;
  }
  .search-input{
    width: 138px;
  }
  .input-title{
    width: 65px;
  }
  .dialog-input{
    width: 260px;
  }
  .padding-dialog>>> .el-dialog__footer{
    /*text-align: center;*/
  }
  .padding-dialog>>> .el-checkbox {
    margin-left: 138px;
  }
  .img-dialog>>> .el-dialog__header{
    background: #fff;
  }
  .img-dialog>>> .el-dialog__headerbtn .el-dialog__close {
    color: #bbb;
  }
  .long-title>>> .el-form-item__label{
    width: 140px!important;
  }
</style>
