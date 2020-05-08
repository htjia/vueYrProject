<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 15px">
      <div class="header-btn-group">
        <el-button
          size="small"
          type="primary"
          @click="addMaterial(1)"
        ><svg-icon icon-class="add"/> 新增金属</el-button>
        <el-button
          size="small"
          type="primary"
          @click="addMaterial(2)"
        ><svg-icon icon-class="add"/> 新增化学</el-button>
        <el-button
          size="small"
          type="primary"
          @click="addMaterial(3)"
        ><svg-icon icon-class="add"/> 新增气体</el-button>
        <el-button
          size="small"
          type="primary"
          @click="addMaterial(4)"
        ><svg-icon icon-class="add"/> 新增包材</el-button>
        <el-button
          size="small"
          type="primary"
          @click="addMaterial(5)"
        ><svg-icon icon-class="add"/> 新增衬底</el-button>
        <el-button
          size="small"
          type="primary"
          @click="addMaterial(6)"
        ><svg-icon icon-class="add"/> 新增MO源</el-button>
        <el-button
          class="float-right"
          size="small"
          type="primary"
          @click="handleExport"
        ><svg-icon icon-class="export"/> 导出</el-button>
        <el-button
          class="float-right"
          size="small"
          type="primary"
          @click="smallBatchSample"
        ><svg-icon icon-class="add"/> 小批量试样</el-button>
        <div class="clear-both"/>
      </div>
      <div style="overflow: auto;">
        <div class="input-item">
          <span class="input-title" style="width: 65px">检验编号</span>
          <el-input v-model="searchKeys.jybh" class="search-input" placeholder="请输入检验编号" size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item">
          <span class="input-title" style="width: 65px">批次号</span>
          <el-input v-model="searchKeys.pch" class="search-input" placeholder="请输入批次号" size="small" maxlength="20" clearable/>
        </div>
        <div class="input-item">
          <span class="input-title">材料类型</span>
          <el-select v-model="searchKeys.cllb" class="search-input" size="small" placeholder="请选择" filterable clearable @change="materialTypeChange">
            <el-option
              v-for="item in materialOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">材料名称</span>
          <el-select v-model="searchKeys.clmc" class="search-input" size="small" placeholder="请选择" filterable allow-create default-first-option clearable>
            <el-option
              v-for="item in materialNameOptions"
              :key="item.name"
              :label="item.name"
              :value="item.name"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title" style="width: 65px">供应商</span>
          <el-select v-model="searchKeys.gys" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in supplierOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title" style="width: 40px">判定</span>
          <el-select v-model="searchKeys.pd" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in resultOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title" style="width: 65px">检验员</span>
          <el-select v-model="searchKeys.jyy" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in checkerList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title" style="width: 65px">采购员</span>
          <el-select v-model="searchKeys.cgy" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in buyerList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title" style="width: 90px">是否在有效期</span>
          <el-select v-model="searchKeys.sfyxq" class="search-input" style="width: 117px;" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in smallBatchOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title" style="width: 110px;">是否小批量试样</span>
          <el-select v-model="searchKeys.sfxplsy" class="search-input" style="width: 100px;" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in vaildityOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div style="float: left;width: 700px; height: 46px;margin-left: 10px">
          <div class="input-item" style="margin-right: 20px;margin-left: 10px;padding-top: 8px">
            <el-radio-group v-model="timeRadio">
              <el-radio :label="0">检验日期</el-radio>
              <el-radio :label="1">生产日期</el-radio>
              <el-radio :label="2">过期日期</el-radio>
            </el-radio-group>
          </div>
          <div class="input-item">
            <el-date-picker
              v-model="beginDate"
              :picker-options="pickerOptionsStart"
              :editable="false"
              class="search-input"
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
              class="search-input"
              size="small"
              type="date"
              placeholder="结束日期"
              value-format="timestamp"
            />
          </div>
        </div>
        <div style="float: left;">
          <el-button
            style="margin-top: 15px"
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="handleSearch" >查 询</el-button>
          <el-button
            style="margin-top: 15px"
            size="small"
            type="danger"
            @click="clearSearch"
          >
            <svg-icon icon-class="clear"/> 重 置
          </el-button>
        </div>
      </div>
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        ref="billTable"
        :data="list"
        class="broad-scrollbar-table"
        element-loading-text="拼命加载中"
        border
        fit
        height="89%"
        highlight-current-row
        @row-click="rowClick"
      >
        <el-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="检验编号" align="center" prop="checkNo" width="120" show-overflow-tooltip fixed/>
        <el-table-column label="检验日期" align="center" prop="checkDate" width="120" show-overflow-tooltip/>
        <el-table-column label="材料类型" align="center" prop="type">
          <template slot-scope="scope">
            <span v-text="getMaterialType(scope.row.materialType)"/>
          </template>
        </el-table-column>
        <el-table-column label="供应商" align="center" prop="supplierName" width="120" show-overflow-tooltip/>
        <el-table-column label="原料批次" align="center" prop="materialBatch" width="120" show-overflow-tooltip/>
        <el-table-column label="采购员" align="center" prop="buyerName" width="120" show-overflow-tooltip/>
        <el-table-column label="材料名称" align="center" prop="materialName" width="120" show-overflow-tooltip/>
        <el-table-column label="型号规格" align="center" prop="specificationsName" width="120" show-overflow-tooltip/>
        <el-table-column label="生产日期" align="center" prop="makeDate" width="120" show-overflow-tooltip/>
        <el-table-column label="是否有效期" align="center" prop="isOver" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.isOver === '1'" style="color:#1ABC9C;font-weight:bold">是</span>
            <span v-if="scope.row.isOver === '0'" style="color:#E25D5D;font-weight:bold">否</span>
          </template>
        </el-table-column>
        <el-table-column label="过期日期" align="center" prop="overDate" width="120" show-overflow-tooltip/>
        <el-table-column label="数量" align="center" prop="num" width="100" show-overflow-tooltip/>
        <el-table-column label="单位" align="center" prop="unitName" width="100" show-overflow-tooltip/>
        <el-table-column label="抽样数量" align="center" prop="sampleNum" width="120" show-overflow-tooltip/>
        <el-table-column label="不良数" align="center" prop="badNum" width="120" show-overflow-tooltip/>
        <el-table-column label="合格率" align="center" prop="rate" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.rate + '%' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="判定" align="center" prop="remark" width="60" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.result === 0" style="color:#1ABC9C;font-weight:bold">合格</span>
            <span v-if="scope.row.result === 1" style="color:#E25D5D;font-weight:bold">不合格</span>
          </template>
        </el-table-column>
        <el-table-column label="检验员" align="center" prop="checkerName" width="120" show-overflow-tooltip/>
        <el-table-column label="是否小批量试样" align="center" prop="remark" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.sample === 1" style="color:#1ABC9C;font-weight:bold">是</span>
            <span v-if="scope.row.sample === 0" style="color:#E25D5D;font-weight:bold">否</span>
          </template>
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
      v-drag
      :before-close="handleDialogClose"
      :close-on-click-modal="false"
      :visible.sync="addMetalDialogVisible"
      :title="'新增' + dialogTitle"
      class="padding-dialog"
      width="892px"
      @close="handleClose">
      <div class="tab-control" style="margin-bottom: 0">
        <span
          :class="{activeTab: activeTabIndex === 0}"
          @click="tabClick(0)"
        >基本信息</span>
        <span
          :class="{activeTab: activeTabIndex === 1}"
          class="margin-left"
          @click="tabClick(1)"
        >检验信息</span>
      </div>
      <el-form ref="addForm" :model="addForm" :rules="rules" status-icon label-width="80px" label-position="right">
        <div v-show="activeTabIndex === 0">
          <div class="module-title">
            <div class="module-title-text">采购信息</div>
          </div>
          <el-row :gutter="20">
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
              <!--v-if="needSample"-->
              <el-form-item class="clear-both" label="采购员" size="small" prop="name">
                <el-select v-model="addForm.cgy" class="dialog-input" size="small" placeholder="请选择" filterable clearable>
                  <el-option
                    v-for="item in buyerList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="clear-both" label="批次号" size="small" prop="pch">
                <el-input v-model="addForm.pch" class="dialog-input" placeholder="请输入批次号" size="small" maxlength="20" clearable/>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="module-title">
            <div class="module-title-text">材料信息</div>
          </div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item class="clear-both" label="材料名称" size="small" prop="clmc">
                <el-select v-model="addForm.clmc" class="dialog-input" size="small" placeholder="请选择" clearable @change="materialChange">
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
            </el-col>
            <el-col :span="12">
              <el-form-item class="clear-both" label="数量" size="small" prop="num">
                <el-input v-model="addForm.num" class="dialog-input" placeholder="请输入数量" size="small" type="number" clearable onkeyup="this.value=this.value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')" @input="numChange"/>
              </el-form-item>
              <el-form-item class="clear-both" label="单位" size="small" prop="dw">
                <el-select v-model="addForm.dw" class="dialog-input" size="small" placeholder="请选择" filterable clearable>
                  <el-option
                    v-for="item in unitsOptions"
                    :key="item.id"
                    :label="item.unit"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="module-title">
            <div class="module-title-text">材料日期信息</div>
          </div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item class="clear-both" label="生产日期" size="small" prop="productionDate">
                <el-date-picker
                  v-model="addForm.productionDate"
                  :disabled="addForm.clmc === ''"
                  :picker-options="pickerOptionsProduction"
                  :editable="false"
                  class="dialog-input"
                  size="small"
                  type="date"
                  placeholder="请选择生产日期"
                  value-format="timestamp"
                  @change="productionDateChange"
                />
              </el-form-item>
              <el-form-item class="clear-both" label="到货日期" size="small" prop="arrivalDate">
                <el-date-picker
                  v-model="addForm.arrivalDate"
                  :picker-options="pickerOptionsArrival"
                  :editable="false"
                  class="dialog-input"
                  size="small"
                  type="date"
                  placeholder="请选择到货日期"
                  value-format="timestamp"
                  @change="arrivalDateChange"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="clear-both" label="过期日期" size="small" prop="expriationDate">
                <el-date-picker
                  :disabled="true"
                  v-model="addForm.expriationDate"
                  :editable="false"
                  class="dialog-input"
                  size="small"
                  type="date"
                  value-format="timestamp"
                />
              </el-form-item>
              <el-form-item class="clear-both" label="有效天数" size="small" required>
                <el-input :disabled="true" v-model="addForm.validDate" class="dialog-input" size="small" type="number"/>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-show="activeTabIndex === 1">
          <div class="module-title">
            <div class="module-title-text">材料验证信息</div>
          </div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item class="clear-both" label="检验编号" size="small" prop="name">
                <el-input v-model="addForm.jybh" class="dialog-input" placeholder="请输入检验编号" size="small" maxlength="20" clearable/>
              </el-form-item>
              <el-form-item class="clear-both" label="抽样数量" size="small" prop="cysl">
                <el-input v-model="addForm.cysl" class="dialog-input" placeholder="请输入抽样数量" size="small" type="text" clearable onkeyup="this.value=this.value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')" @input="cyslChange"/>
              </el-form-item>
              <el-form-item class="clear-both" label="不良数" size="small" prop="bls">
                <el-input v-model="addForm.bls" class="dialog-input" placeholder="请输入不良数" size="small" type="text" onkeyup="this.value=this.value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')" clearable @input="blsChange"/>
              </el-form-item>
              <el-form-item class="clear-both" label="判定" size="small" prop="name">
                <el-radio-group v-model="addForm.result">
                  <el-radio :label="0">合格</el-radio>
                  <el-radio :label="1">不合格</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="clear-both" label="检验日期" size="small" prop="testDate">
                <el-date-picker
                  v-model="addForm.testDate"
                  :editable="false"
                  :picker-options="pickerOptionsTestDate"
                  class="dialog-input"
                  size="small"
                  type="date"
                  placeholder="请选择检验日期"
                  value-format="timestamp"
                />
              </el-form-item>
              <el-form-item class="clear-both" label="检验员" size="small" prop="name">
                <el-input :disabled="true" v-model="getToken" class="dialog-input" size="small"/>
              </el-form-item>
              <el-form-item class="clear-both" label="合格率" size="small" prop="name">
                <el-input :disabled="true" v-model="addForm.hgv" class="dialog-input" size="small"/>
              </el-form-item>
              <el-form-item v-if="needSample" class="clear-both" label="" size="small" prop="name">
                <el-checkbox v-model="addForm.sfxplsy">是否小批量试样</el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="module-title">
            <div class="module-title-text">其他信息</div>
          </div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item class="clear-both" label="不良内容" size="small" prop="name">
                <el-input v-model="addForm.blnr" class="dialog-input" type="textarea" size="small" maxlength="50"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="clear-both" label="备注" size="small" prop="name">
                <el-input v-model="addForm.remark" class="dialog-input" type="textarea" size="small" maxlength="50"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item class="clear-both" label="图片上传" size="small" prop="file">
            <el-upload
              ref="upload"
              :class="{hide:hideUpload}"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleIsAddRemove"
              :on-success="onSuccess"
              :on-change="uploadChange"
              :before-upload="beforeUpload"
              :data="uploadParams"
              :action="fileUrl"
              :limit="5"
              :on-exceed="onExceed"
              :file-list="addFileList"
              accept=".png,.jpg"
              list-type="picture-card"
            >
              <i class="el-icon-plus"/>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible" class="img-dialog" width="1300px" style="text-align: center" append-to-body>
              <img :src="dialogImageUrl" style="max-width: 100%">
            </el-dialog>
          </el-form-item>
        </div>
      </el-form>
      <span v-show="activeTabIndex === 1" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('addForm')">确 定</el-button>
        <el-button @click="resetForm('addForm')">取 消</el-button>
      </span>
    </el-dialog>
    <!--编辑弹窗-->
    <el-dialog
      v-drag
      :before-close="handleDialogClose"
      :close-on-click-modal="false"
      :visible.sync="editMetalDialogVisible"
      :title="'编辑' + dialogTitle"
      class="padding-dialog"
      width="892px"
      @close="handleClose">
      <div class="tab-control" style="margin-bottom: 0">
        <span
          :class="{activeTab: activeTabIndex === 0}"
          @click="tabClick(0)"
        >基本信息</span>
        <span
          :class="{activeTab: activeTabIndex === 1}"
          class="margin-left"
          @click="tabClick(1)"
        >检验信息</span>
      </div>
      <el-form ref="addForm" :model="addForm" :rules="rules" status-icon label-width="80px" label-position="right">
        <div v-show="activeTabIndex === 0">
          <div class="module-title">
            <div class="module-title-text">采购信息</div>
          </div>
          <el-row :gutter="20">
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
              <!--v-if="needSample"-->
              <el-form-item class="clear-both" label="采购员" size="small" prop="name">
                <el-select v-model="addForm.cgy" class="dialog-input" size="small" placeholder="请选择" filterable clearable>
                  <el-option
                    v-for="item in buyerList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="clear-both" label="批次号" size="small" prop="pch">
                <el-input v-model="addForm.pch" class="dialog-input" placeholder="请输入批次号" size="small" maxlength="20" clearable/>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="module-title">
            <div class="module-title-text">材料信息</div>
          </div>
          <el-row :gutter="20">
            <el-col :span="12">
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
            </el-col>
            <el-col :span="12">
              <el-form-item class="clear-both" label="数量" size="small" prop="num">
                <el-input v-model="addForm.num" class="dialog-input" placeholder="请输入数量" size="small" type="text" clearable onkeyup="this.value=this.value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')" @input="numChange"/>
              </el-form-item>
              <el-form-item class="clear-both" label="单位" size="small" prop="dw">
                <el-select v-model="addForm.dw" class="dialog-input" size="small" placeholder="请选择" filterable clearable>
                  <el-option
                    v-for="item in unitsOptions"
                    :key="item.id"
                    :label="item.unit"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="module-title">
            <div class="module-title-text">材料日期信息</div>
          </div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item class="clear-both" label="生产日期" size="small" prop="productionDate">
                <el-date-picker
                  v-model="addForm.productionDate"
                  :picker-options="pickerOptionsProduction"
                  :editable="false"
                  class="dialog-input"
                  size="small"
                  type="date"
                  placeholder="请选择生产日期"
                  value-format="timestamp"
                  @change="productionDateChange"
                />
              </el-form-item>
              <el-form-item class="clear-both" label="到货日期" size="small" prop="arrivalDate">
                <el-date-picker
                  v-model="addForm.arrivalDate"
                  :picker-options="pickerOptionsArrival"
                  :editable="false"
                  class="dialog-input"
                  size="small"
                  type="date"
                  placeholder="请选择到货日期"
                  value-format="timestamp"
                  @change="arrivalDateChange"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="clear-both" label="过期日期" size="small" prop="expriationDate">
                <el-date-picker
                  :disabled="true"
                  v-model="addForm.expriationDate"
                  :editable="false"
                  placeholder="请选择过期日期"
                  class="dialog-input"
                  size="small"
                  type="date"
                  value-format="timestamp"
                />
              </el-form-item>
              <el-form-item class="clear-both" label="有效天数" size="small" required>
                <el-input :disabled="true" v-model="addForm.validDate" class="dialog-input" size="small" type="number"/>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-show="activeTabIndex === 1">
          <div class="module-title">
            <div class="module-title-text">材料验证信息</div>
          </div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item class="clear-both" label="检验编号" size="small" prop="name">
                <el-input v-model="addForm.jybh" class="dialog-input" placeholder="请输入检验编号" size="small" maxlength="20" clearable/>
              </el-form-item>
              <el-form-item class="clear-both" label="抽样数量" size="small" prop="cysl">
                <el-input v-model="addForm.cysl" class="dialog-input" placeholder="请输入抽样数量" size="small" type="text" clearable onkeyup="this.value=this.value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')" @input="cyslChange"/>
              </el-form-item>
              <el-form-item class="clear-both" label="不良数" size="small" prop="bls">
                <el-input v-model="addForm.bls" class="dialog-input" placeholder="请输入不良数" size="small" type="text" clearable onkeyup="this.value=this.value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')" @input="blsChange"/>
              </el-form-item>
              <el-form-item class="clear-both" label="判定" size="small" prop="name">
                <el-radio-group v-model="addForm.result">
                  <el-radio :label="0">合格</el-radio>
                  <el-radio :label="1">不合格</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="clear-both" label="检验日期" size="small" prop="testDate">
                <el-date-picker
                  :picker-options="pickerOptionsTestDate"
                  v-model="addForm.testDate"
                  :editable="false"
                  class="dialog-input"
                  size="small"
                  type="date"
                  placeholder="请选择检验日期"
                  value-format="timestamp"
                />
              </el-form-item>
              <el-form-item class="clear-both" label="检验员" size="small" prop="name">
                <el-input :disabled="true" v-model="addForm.jyr" class="dialog-input" size="small"/>
              </el-form-item>
              <el-form-item class="clear-both" label="合格率" size="small" prop="name">
                <el-input :disabled="true" v-model="addForm.hgv" class="dialog-input" size="small"/>
              </el-form-item>
              <el-form-item v-if="needSample" class="clear-both" label="" size="small" prop="name">
                <el-checkbox :disabled="needSample" v-model="addForm.sfxplsy">是否小批量试样</el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="module-title">
            <div class="module-title-text">其他信息</div>
          </div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item class="clear-both" label="不良内容" size="small" prop="name">
                <el-input v-model="addForm.blnr" class="dialog-input" type="textarea" size="small" maxlength="50"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="clear-both" label="备注" size="small" prop="name">
                <el-input v-model="addForm.remark" class="dialog-input" type="textarea" size="small" maxlength="50"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item class="clear-both" label="图片上传" size="small" prop="file">
            <el-upload
              ref="upload"
              :class="{hide:hideUpload}"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemoveEditUpload"
              :on-success="onEditUploadSuccess"
              :on-change="uploadChange"
              :data="uploadParams"
              :file-list="fileList"
              :limit="5"
              :on-exceed="onExceed"
              :action="fileUrl"
              accept=".png,.jpg"
              list-type="picture-card"
            >
              <i class="el-icon-plus"/>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible" class="img-dialog" width="1300px" style="text-align: center" append-to-body>
              <img :src="dialogImageUrl" style="max-width: 100%">
            </el-dialog>
          </el-form-item>
        </div>
      </el-form>
      <span v-show="activeTabIndex === 1" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEditForm('addForm')">确 定</el-button>
        <el-button @click="resetForm('addForm', 1)">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./examinationMaterial.js"></script>

<style scoped>
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
  .padding-dialog>>> .el-dialog__body{
    padding-bottom: 0;
  }
  .input-item{
    float: left;
    margin-top: 14px;
    margin-right: 10px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 312px);
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
    width: 330px;
  }
  .padding-dialog>>> .el-dialog__footer{
    /*text-align: center;*/
  }
  .padding-dialog>>> .el-checkbox {
    margin-left: 128px;
  }
  .img-dialog>>> .el-dialog__header{
    background: #fff;
  }
  .img-dialog>>> .el-dialog__headerbtn .el-dialog__close {
    color: #bbb;
  }
  .hide>>> .el-upload--picture-card {
    display: none;
  }
</style>
