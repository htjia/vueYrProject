<template>
  <PageHeaderLayout>
    <div class="time-search-box">
      <div class="flex">
        <!-- 左侧搜索 -->
        <div class="flex-search">
          <div class="search-input-item">
            <span class="input-title">工段</span>
            <el-select v-model="machineForm.section" class="search-input" size="small" placeholder="请选择" filterable clearable @change="changeWork">
              <el-option
                v-for="item in workshopList"
                :key="item.name"
                :label="item.name"
                :value="item.name"/>
            </el-select>
          </div>
          <div class="search-input-item">
            <span class="input-title">车间</span>
            <el-select v-model="machineForm.workshopId" class="search-input" size="small" placeholder="请选择" filterable clearable @change="changeFactory">
              <el-option
                v-for="item in factoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="search-input-item">
            <span class="input-title">站点</span>
            <el-select v-model="machineForm.siteId" class="search-input" size="small" placeholder="请选择" filterable clearable @change="changeSite">
              <el-option
                v-for="item in siteLists"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="search-input-item">
            <span class="input-title">机台</span>
            <el-select v-model="machineForm.machineId" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in machinList"
                :key="item.id"
                :label="item.code"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="search-input-item">
            <el-button
              class="float-right margin-left"
              size="small"
              type="danger"
              @click="clearSearch"
            >
              <svg-icon icon-class="clear"/> 重 置
            </el-button>
            <el-button
              class="float-right"
              size="small"
              type="primary"
              icon="el-icon-search"
              @click="handleSearch" >查 询</el-button>
          </div>
        </div>
        <div style="overflow: hidden">
          <el-button
            class="float-right"
            size="small"
            type="primary"
            @click="handleMachine"
          ><svg-icon icon-class="replaceRecord"/> 管理点配置</el-button>
        </div>
      </div>
    </div>
    <div class="app-container mt10">
      <div class="table-top-btn-group mt10" style="border-bottom: 3px solid #009494;">
        <div
          :class="{'active':isActive === 0}"
          @click="navClick(0)"
        >
          基本设备
        </div>
        <div
          :class="{'active':isActive === 1}"
          @click="navClick(1)"
        >
          清洗&匀胶类设备
        </div>
      </div>
      <!-- 设备列表 -->
      <div v-loading="moLoading" element-loading-text="拼命加载中" class="mo-container">
        <div v-for="(item, index) in tableList" :key="index" style="padding-right: 15px">
          <div class="module-containe">
            <div class="module-title">
              <div class="module-title-text">{{ item.workName }}-{{ item.siteName }}-{{ item.machineName }}</div>
              <!--设置按钮-->
              <div
                v-if="!item.mocvdEdit"
                class="view-all margin-left"
                @click="changeNameList(item)"
              ><svg-icon style="color: #009494;font-size: 20px;cursor: pointer;height: 26px; line-height: 26px" icon-class="config"/></div>
              <el-button
                v-if="!item.mocvdEdit"
                type="text"
                size="mini"
                class="view-all margin-left select-thead-btn"
                @click="openHistory(item)"
              ><svg-icon style="margin-right: 5px;font-size: 14px" icon-class="lishibb"/>变更记录</el-button>
              <el-button v-if="item.mocvdEdit" class="view-all margin-left" type="danger" size="mini" @click="handleCancel(item)">取 消</el-button>
              <el-button v-if="item.mocvdEdit" class="view-all margin-left" type="primary" size="mini" @click="submitMocvdEdit(item)">确 定</el-button>
              <el-button
                v-if="item.mocvdEdit && !isActive"
                class="view-all margin-left"
                type="primary"
                size="mini"
                style="background: #5268a4!important;border-color: #5268a4"
                @click="addMoRow(item.cacheList)"
              ><svg-icon icon-class="add"/> 新增</el-button>
            </div>
            <div class="module-content">
              <!-- 批次号的列表 -->
              <el-table
                v-show="!item.mocvdEdit"
                :data="item.circleList"
                :span-method="objectSpanMethod"
                :key="tableKey"
                border
                class="mo-table"
                height="305"
                style="width: 100%; margin-top: 20px">
                <el-table-column v-if="isActive" width="50" label="位置" prop="localtion" align="center" />
                <el-table-column
                  label="材料名称"
                  width="150"
                  header-align="center"
                  align="right">
                  <template slot-scope="scope">
                    <div class="mo-add" style="padding-right:44px!important">
                      {{ scope.row.materialName }}
                      <el-button v-if="scope.row.materialName" :disabled="scope.row.disabled" type="text" size="mini" @click="addCLItem(scope.row, scope.$index + 1, item.circleList)">
                        <i class="addBtn el-icon-circle-plus"/>
                      </el-button>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="批次号" prop="materialBatch" align="center" />
                <el-table-column label="规格型号" prop="materialModel" align="center" />
                <el-table-column label="操作" width="140" align="center" >
                  <template slot-scope="scope">
                    <el-button v-if="scope.row.materialName" class="view-all" style="float: none" type="primary" size="mini" @click="moReplace(item, scope.row)"><svg-icon icon-class="change"/> 更换</el-button>
                    <el-button v-if="scope.row.isDelete" class="view-all" style="float: none" type="danger" size="mini" @click="deleteReplace(scope.row)"><svg-icon icon-class="shanchu"/> 删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!-- 材料名称的列表 -->
              <el-table
                v-show="item.mocvdEdit"
                :data="item.cacheList"
                :span-method="arraySpanMethod"
                height="305"
                border
                class="mo-table"
                style="width: 100%; margin-top: 20px">
                <el-table-column
                  v-if="isActive"
                  label="位置"
                  align="center">
                  <template slot-scope="scope">
                    {{ scope.row.localtion }}
                    <i class="addBtn el-icon-circle-plus" @click="addMoItem(scope.row, scope.$index + 1, item.cacheList)"/>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="!isActive"
                  label="序号"
                  align="center">
                  <template slot-scope="scope">
                    {{ scope.$index+1 }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="材料名称"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.materialId" class="search-input" size="small" placeholder="请选择" filterable style="width: 95%;height: 25px" clearable @focus="disableName(item.cacheList,scope.row.localtion)">
                      <el-option
                        v-for="item in materialNameOptions"
                        :key="item.id"
                        :disabled="dis.includes(item.id)"
                        :label="item.name"
                        :value="item.id"/>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  width="50"
                  align="center"
                >
                  <template slot-scope="scope">
                    <i class="deleteBtn el-icon-remove" @click="deleteMoItem(scope.row, scope.$index, item.cacheList)"/>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 更换某条 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="moReplaceDialogVisible"
      class="mo-replace-dialog"
      title="更换原材料"
      width="780px"
      @close="restForm('mocvdForm')">
      <el-form ref="mocvdForm" :validate-on-rule-change="false" :rules="rules" :model="mocvdForm" status-icon label-width="120px" label-position="right">
        <div class="replace-title">更换后原材料信息</div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="materialBatch" label="原材料批号" size="small">
              <el-input ref="materialBatch" v-model="mocvdForm.materialBatch" autofocus placeholder="请扫描或输入原材料批号" maxlength="20" @blur="changeBatch(mocvdForm.materialBatch)"/>
            </el-form-item>
            <el-form-item prop="changeNum" label="更换数量" size="small">
              <el-input v-only-number="{ min: 0, max: 999, precision: 2 }" v-model="mocvdForm.changeNum" placeholder="请输入更换数量"/>
            </el-form-item>
            <el-form-item prop="yuval" label="阈值 " size="small">
              <el-input v-only-number="{ min: 0, max: 9999, precision: 0 }" v-model="mocvdForm.yuval" placeholder="请输入阈值"/>
            </el-form-item>
            <el-form-item prop="warningVal" label="预警值（%） " size="small">
              <el-input v-only-number="{ min: 0, max: 100, precision: 2 }" v-model="mocvdForm.warningVal" placeholder="请输入预警值"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="produceType" label="生产类型" size="small">
              <el-select v-model="mocvdForm.produceType" :disabled="true" placeholder="请选择" style="width: 240px" filterable>
                <el-option
                  v-for="item in moOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
            <el-form-item prop="materialUnit" label="材料单位 " size="small">
              <el-select v-model="mocvdForm.materialUnit" placeholder="请选择" style="width: 240px" filterable>
                <el-option
                  v-for="item in munitList"
                  :key="item.unit"
                  :label="item.unit"
                  :value="item.unit"/>
              </el-select>
            </el-form-item>
            <el-form-item prop="yuvalUnit" label="阈值单位" size="small">
              <el-select v-model="mocvdForm.yuvalUnit" placeholder="请选择" style="width: 240px" filterable>
                <el-option
                  v-for="item in yuList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"/>
              </el-select>
            </el-form-item>
            <el-form-item prop="createTime" label="更换时间" size="small">
              <el-date-picker
                v-model="mocvdForm.createTime"
                :picker-options="pickerOptionsStart"
                :editable="false"
                style="width: 240px"
                size="small"
                type="datetime"
                placeholder="选择更换时间"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注 " prop="remark" size="small">
          <el-input v-model="mocvdForm.remark" type="textarea" placeholder="请输入备注" maxlength="50"/>
        </el-form-item>
      </el-form>
      <el-form ref="disForm" :model="disForm" status-icon label-width="120px" label-position="right">
        <div class="replace-title">更换前原材料信息</div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="原材料批号" size="small">
              <el-input v-model="disForm.materialBatch" :disabled="true" placeholder="请扫描或输入原材料批号" maxlength="20"/>
            </el-form-item>
            <el-form-item label="更换数量" size="small">
              <el-input v-model="disForm.changeNum" :disabled="true" placeholder="请输入更换数量" maxlength="20"/>
            </el-form-item>
            <el-form-item label="阈值 " size="small">
              <el-input v-model="disForm.ynum" :disabled="true" placeholder="请输入阈值" maxlength="10"/>
            </el-form-item>
            <el-form-item label="预警值（%） " size="small">
              <el-input v-model="disForm.wariningVal" :disabled="true" placeholder="请输入预警值" step="0.01" max="100"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产类型" size="small">
              <el-select v-model="disForm.produceType" :disabled="true" placeholder="请选择" style="width: 240px" filterable>
                <el-option
                  v-for="item in moOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
            <el-form-item label="材料单位 " size="small">
              <el-select v-model="disForm.munit" :disabled="true" placeholder="请选择" style="width: 240px" filterable>
                <el-option
                  v-for="item in munitList"
                  :key="item.unit"
                  :label="item.unit"
                  :value="item.unit"/>
              </el-select>
            </el-form-item>
            <el-form-item label="阈值单位" size="small">
              <el-select v-model="disForm.yunit" :disabled="true" placeholder="请选择" style="width: 240px" filterable>
                <el-option
                  v-for="item in yuList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"/>
              </el-select>
            </el-form-item>
            <el-form-item label="更换时间" size="small">
              <el-date-picker
                v-model="disForm.createTime"
                :disabled="true"
                :picker-options="pickerOptionsStart"
                :editable="false"
                style="width: 240px"
                size="small"
                type="datetime"
                placeholder="选择更换时间"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注 " size="small">
          <el-input v-model="disForm.remark" :disabled="true" type="textarea" placeholder="请输入备注" maxlength="50"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('mocvdForm')">确 定</el-button>
        <el-button @click="restForm('mocvdForm')">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 更换记录 -->
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="viewMoReplaceDialogVisible"
      :title="hisTit"
      class="mo-replace-dialog-view"
      width="1300px"
      @close="initReplaceClose">
      <div style="overflow: hidden;margin-bottom: 10px">
        <div class="input-item">
          <span class="input-title" style="width: 70px;">材料名称 </span>
          <el-select v-model="searchKeys.materialId" class="search-input" size="small" placeholder="请选择" filterable>
            <el-option
              v-for="item in materialNameOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title" style="width: 70px;">生产类型 </span>
          <el-select v-model="searchKeys.produceType" class="search-input" size="small" placeholder="请选择" filterable>
            <el-option
              v-for="item in moOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title" style="width: 90px;">原材料批号 </span>
          <el-input v-model="searchKeys.materialBatch" class="search-input" size="small" placeholder="请输入" filterable/>
        </div>
        <div class="input-item">
          <span class="input-title" style="width: 70px;">更换人 </span>
          <el-input v-model="searchKeys.creatorName" class="search-input" size="small" placeholder="请输入" filterable/>
        </div>
        <div class="input-item">
          <span class="input-title">更换时间 </span>
          <el-date-picker
            v-model="searchKeys.startTime"
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
            v-model="searchKeys.endTime"
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
        <el-table-column v-if="isActive" label="位置" align="center" prop="localtion"/>
        <el-table-column label="材料名称" align="center" prop="materialName"/>
        <el-table-column label="原材料批号" align="center" prop="materialBatch"/>
        <el-table-column label="型号规格" align="center" prop="materialModel" width="100" />
        <el-table-column label="生产类型" prop="newBottleNo" align="center" >
          <template slot-scope="scope">
            {{ scope.row.produceType ? '量产' : '试样' }}
          </template>
        </el-table-column>
        <el-table-column label="更换数量" prop="changeNum" align="center" />
        <el-table-column label="更换人" prop="creatorName" align="center" />
        <el-table-column label="更换时间" prop="createTime" align="center" width="130" />
        <el-table-column label="当前在制量" prop="nowVal" align="center" />
        <el-table-column label="阈值" prop="yuval" align="center" />
        <el-table-column label="失效日期" prop="failureTime" align="center" width="130" />
        <el-table-column label="备注" prop="remark" align="center" show-overflow-tooltip/>
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
    <!-- 给管理点配置 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="viewGpReplaceDialogVisible"
      class="mo-replace-dialog-view"
      title="原材料管理点配置--机台配置"
      width="850px"
      @close="viewGpReplaceDialogVisible = false">
      <div class="replace-item">
        <div class="base">
          <div class="proce_tree">
            <div class="tree">
              <span>基本设备</span>
              <el-tree
                ref="tree"
                :data="hasBaseList"
                :props="defaultProps"
                :default-checked-keys="baseCheckList"
                show-checkbox
                node-key="id"
                default-expand-all
                @check="handleBaseCheck"/>
            </div>
            <div class="tree">
              <span>清洗&匀胶类设备</span>
              <el-tree
                ref="tree1"
                :data="hasWashList"
                :props="defaultProps"
                :default-checked-keys="washCheckList"
                show-checkbox
                node-key="id"
                default-expand-all
                @check="handleWashCheck"/>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sureChecked">确 定</el-button>
        <el-button type="primary" @click="viewGpReplaceDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./rawMaterial.js"></script>

<style scoped>
  .mo-add>>> .el-button {
    background: transparent;
    border-color: transparent;
  }
  .mo-add>>> .el-button:hover {
    background: transparent;
    border-color: transparent;
  }
  .mo-add>>> .el-button:focus {
    background: transparent;
    border-color: transparent;
  }
  .view-mo-replace ::-webkit-scrollbar {/*滚动条整体样式*/
    height: 10px !important;
  }
  .mo-container{
    width: calc(100% + 10px);
    margin-bottom: 10px;
  }
  .mo-container>div{
    margin-bottom: 10px;
    float: left;
    width: 33.33%;
  }
  .module-content{
    /*padding-top: 10px;*/
    padding: 10px 0 0 0;
    height: 315px;
    overflow-y: auto;
  }
  .module-title {
    padding-right: 0;
  }
  .mo-table{
    margin: 0 !important;
  }
  /*.mo-table>>>.el-table__header-wrapper{*/
    /*display: none;*/
    /*!*opacity: 0;*!*/
  /*}*/
  .mo-table>>>.el-table__body-wrapper{
    overflow: auto;
  }
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
    margin-bottom: 16px;
  }
  .input-item{
    float: left;
    margin-top: 14px;
    margin-right: 10px;
  }
  .search-input-item{
    float: left;
    margin-right: 30px;
    margin-top: 0;
  }
  .search-input-item .input-title {
    width: 34px;
  }
  .search-input{
    width: 140px;
  }
  .select-thead-btn:hover {
    background: transparent;
    border: 1px solid transparent;
    color: #009494;
  }
  .proce_tree {
    height: 520px;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
  }
  .tree {
    width: 49%;
    float: left;
  }
  .tree>>> .el-tree {
    height: 480px;
    overflow-y: auto;
    border: 1px solid #ccc;
    padding: 10px 0;
  }
  .tree>>> .el-checkbox {
    margin-left: 0;
  }
  .tree>>> .el-tree-node__content>.el-tree-node__expand-icon {
    padding: 5px;
  }
  .tree span {
    font-weight: 900;
    line-height: 40px;
  }

  @media (max-width: 1632px) {
    /*.el-form-item--small.el-form-item {*/
      /*margin-bottom: 5px;*/
    /*}*/
    .mo-container>div{
    margin-bottom: 10px;
    float: left;
    width: 50%;
  }
  }
</style>
