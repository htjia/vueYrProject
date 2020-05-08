<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0">
      <div class="search-box">
        <div class="left-search-box">
          <div class="input-item">
            <span class="input-title" style="width: 35px;">光色 </span>
            <el-select v-model="searchKey.color" style="width: 150px;" size="small" placeholder="请选择" filterable>
              <el-option
                v-for="item in colorList"
                :key="item.id"
                :label="item.code"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 90px;">验证版型 </span>
            <el-select v-model="searchKey.yzbx" style="width: 150px;" size="small" placeholder="请选择" filterable>
              <el-option
                v-for="item in substrateFindOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 68px;">尺寸 </span>
            <el-select v-model="searchKey.size" style="width: 150px;" placeholder="请选择" size="small" filterable>
              <el-option
                v-for="item in measureList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
            <el-button
              size="small"
              type="primary"
              icon="el-icon-search"
              style="margin-left:10px"
              @click="fetchData" >查询</el-button>
            <el-button
              size="small"
              type="danger"
              @click="clearAll"
            >
              <svg-icon icon-class="clear"/> 重置
            </el-button>
          </div>
        </div>
        <div class="right-btn-box">
          <el-button
            style="margin-top: 15px"
            class="float-right margin-left"
            size="small"
            type="primary"
            @click="handleAdd('新建检索策略')"><svg-icon icon-class="add"/> 新建检索策略</el-button>
        </div>
      </div>
    </div>
    <div class="app-container">
      <div v-for="item in strategyList" :key="item.id" class="strategy-container">
        <div class="module-container">
          <div class="module-title">
            <div class="module-title-text">{{ item.name }}</div>
            <span style="cursor: pointer;color: #009494;font-size: 18px" @click="handleAdd('编辑检索策略', item)"><svg-icon icon-class="bianji" class="float-right margin-left" style="margin-top: 6px"/></span>
            <span style="cursor: pointer;color: #f56c6c;font-size: 18px" @click="handleDeleteItem(item.id)"><svg-icon icon-class="delete" class="float-right" style="margin-top: 6px"/></span>
          </div>
          <div class="module-content" style="padding-right: 0px">
            <div style="height: 241px; overflow: auto; padding-right: 10px">
              <el-form label-width="65px">
                <el-form-item v-for="(gear, index) in item.gearSplicing" :key="index" :label="setGearPosition(gear.gearPosition)">
                  <el-input v-model="gear.dataRange" :rows="3" type="textarea" disabled/>
                </el-form-item>
              </el-form>
            </div>
            <el-button
              size="mini"
              type="primary"
              @click="handleSearch(item)"
            ><svg-icon icon-class="search"/> 库存检索</el-button>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="addVisable"
      :title="dialogTitle"
      top="80px"
      class="padding-dialog add-dialog"
      width="995px"
      @close="dialogClose('strategyForm')"
    >
      <el-form ref="strategyForm" :model="strategyForm" :rules="rules" :validate-on-rule-change="false" status-icon label-width="100px" size="mini" label-position="right">
        <div class="module-title" style="margin-bottom: 10px">
          <div class="module-title-text">标题</div>
        </div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="光色 " prop="color">
              <el-select v-model="strategyForm.color" style="width: 213px;" placeholder="请选择" filterable>
                <el-option
                  v-for="item in colorList"
                  :key="item.id"
                  :label="item.code"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="验证版型 " prop="yzbx">
              <el-select v-model="strategyForm.yzbx" style="width: 213px;" placeholder="请选择" filterable>
                <el-option
                  v-for="item in substrateFindOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="尺寸 " prop="size">
              <el-select v-model="strategyForm.size" style="width: 213px;" placeholder="请选择" filterable>
                <el-option
                  v-for="item in measureList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-for="(gear, index) in strategyForm.gearList" :key="index">
          <div class="module-title">
            <div class="module-title-text">综合{{ String.fromCharCode(65 + index) }}档</div>
            <div v-if="strategyForm.gearList.length === 1" class="add-params">
              <div v-if="isParams" class="add-params-input">
                <el-select v-model="newParam" clearable size="mini" @change="selectParamsChange">
                  <el-option
                    v-for="(it,ind) in parameter"
                    :key="ind"
                    :label="it.fieldCn"
                    :value="it.field"
                    :disabled="it.disabled"
                  />
                </el-select>
              </div>
              <el-button
                style="margin-right: -8px"
                size="mini"
                type="primary"
                @click="addHandleParams"
              ><svg-icon icon-class="add"/> 新增参数</el-button>
            </div>
          </div>
          <el-form-item
            v-for="(params, paramsIndex) in gear"
            :key="paramsIndex"
            :label="params.fieldCn"
            style="margin-top: 10px"
          >
            <el-form-item
              v-if="params.paramCategory === 1 || params.paramCategory === 0"
              :prop="`gearList.${index}.${paramsIndex}.min`"
              :rules="rules.min"
              class="innerItem"
              label="">
              <el-input v-model="params.min" class="params_input" placeholder="*" step="0.01" type="number" onkeyup="this.value=this.value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')" filterable><span v-if="params.paramCategory === 1" slot="suffix">%</span></el-input> ~
            </el-form-item>
            <el-form-item
              v-if="params.paramCategory === 1 || params.paramCategory === 0"
              :prop="`gearList.${index}.${paramsIndex}.max`"
              :rules="rules.max"
              class="innerItem"
              label="">
              <el-input v-model="params.max" :class="{'short_input': paramsIndex > 6 && strategyForm.gearList.length === 1}" class="params_input" placeholder="*" step="0.01" type="number" onkeyup="this.value=this.value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')" filterable><span v-if="params.paramCategory === 1" slot="suffix">%</span></el-input>
            </el-form-item>
            <span v-if="params.paramCategory === 2">
              <el-form-item
                class="innerItem"
              >
                <el-select v-model="params.min" style="width: 218px" placeholder="请选择" filterable multiple collapse-tags clearable>
                  <el-option
                    v-for="item in levelList"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name"/>
                </el-select>
              </el-form-item>
            </span>
            <span v-if="paramsIndex > 6 && strategyForm.gearList.length === 1" class="svg" @click="deleteParams(index,params)">
              <svg-icon style="color: #F56C6C;cursor: pointer;" icon-class="shanchu"/>
            </span>
          </el-form-item>
          <div style="margin-top: 10px">
            <el-form-item
              class="innerItem"
              label="备注">
              <el-input v-model="remarkList[index]" placeholder="请输入备注" maxlength="50" type="text" style="width: 857px" filterable/>
            </el-form-item>
          </div>
          <div style="text-align: center;margin-top: 5px">
            <el-button v-if="strategyForm.gearList.length > 1 && index !== 0" circle type="danger" size="mini" icon="el-icon-delete" @click="deleteGear(index)"/>
            <el-button v-if="index === strategyForm.gearList.length -1 && index < 2" circle type="primary" size="mini" icon="el-icon-plus" @click="addGear"/>
          </div>
        </div>
        <div class="module-title" style="margin-bottom: 10px">
          <div class="module-title-text">异常原因分析</div>
          <div class="add-params">
            <div v-if="addParams" class="add-params-input">
              <el-select v-model="newAbnormalParam" clearable size="mini" @change="selectAbnormalParamsChange">
                <el-option
                  v-for="(it,ind) in abnormalParameter"
                  :key="ind"
                  :label="it.fieldCn"
                  :value="it.field"
                  :disabled="it.disabled"
                />
              </el-select>
            </div>
            <el-button
              style="margin-right: 0px"
              size="mini"
              type="primary"
              @click="addAbnormalParams"
            ><svg-icon icon-class="add"/> 新增参数</el-button>
          </div>
        </div>
        <el-form-item
          v-for="(item,index) in strategyForm.abnormalReason"
          :key="item.fieldCn"
          :label="item.fieldCn"
          class="abnormal-item"
        >
          <el-form-item
            v-if="item.paramCategory === 0 || item.paramCategory === 1"
            :prop="`abnormalReason.${index}.${item.field}`"
            :rules="rules.abnormalmin"
            class="innerItem"
            label="">
            <el-input v-model="item.min" class="params_input" step="0.01" type="number" onkeyup="this.value=this.value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')" filterable><span v-if="item.paramCategory === 1" slot="suffix">%</span></el-input> ~
          </el-form-item>
          <el-form-item
            v-if="item.paramCategory === 0 || item.paramCategory === 1"
            :prop="`abnormalReason.${index}.${item.field}`"
            :rules="rules.abnormalmax"
            class="innerItem"
            label="">
            <el-input v-model="item.max" class="params_input" filterable step="0.01" type="number" onkeyup="this.value=this.value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"><span v-if="item.paramCategory === 1" slot="suffix">%</span></el-input>
          </el-form-item>
          <span v-if="item.paramCategory === 2">
            <el-form-item
              :prop="`abnormalReason.${index}.visual`"
              :rules="rules.visual"
              class="innerItem"
            >
              <el-select v-model="item.min" class="params_input" placeholder="请选择" filterable style="width: 218px" multiple collapse-tags clearable>
                <el-option
                  v-for="item in abnormalLevelList"
                  :key="item.name"
                  :disabled="item.disabled"
                  :label="item.name"
                  :value="item.name"/>
              </el-select>
            </el-form-item>
          </span>
          <el-form-item
            label="备注">
            <el-input v-model="item.remark" :class="{'short_remark':index > 3}" class="remark_input" placeholder="请输入备注" maxlength="50"/>
          </el-form-item>
          <span v-if="index > 3" class="svg" @click="deleteAbnormalParams(index,item)">
            <svg-icon style="color: #F56C6C;cursor: pointer;" icon-class="shanchu"/>
          </span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="submitForm('strategyForm')">确 定</el-button>
        <el-button type="primary" size="small" @click="addVisable = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="searchVisable"
      :title="searchTitle"
      top="80px"
      class="padding-dialog"
      width="1200px"
      @close="searchDialogClose"
    >
      <div style="margin-bottom: 10px; float: left">
        <span class="input-title" style="width: 40px;">日期 </span>
        <el-date-picker
          v-model="beginDate"
          :picker-options="pickerOptionsStart"
          :editable="false"
          size="small"
          style="width: 130px;"
          type="date"
          placeholder="开始日期"
          value-format="timestamp"
        />
        <span style="display:inline-block;width: 38px;text-align: center"> 至 </span>
        <el-date-picker
          v-model="endDate"
          :picker-options="pickerOptionsEnd"
          :editable="false"
          size="small"
          style="width: 130px;"
          type="date"
          placeholder="结束日期"
          value-format="timestamp"
        />
      </div>
      <el-button
        class="float-right margin-left"
        size="small"
        type="primary"
        @click="handleDialogExport"
      ><svg-icon icon-class="export"/> 导出</el-button>
      <el-button
        size="small"
        type="primary"
        icon="el-icon-search"
        class="float-right"
        @click="searchResult"
      >查 询
      </el-button>
      <el-table
        :data="resultList"
        :span-method="objectSpanMethod"
        element-loading-text="拼命加载中"
        highlight-current-row
        border
        fit
        height="600"
      >
        <el-table-column label="项次" align="center" prop="item" width="110"/>
        <el-table-column label="参数范围" align="center" prop="val" show-overflow-tooltip/>
        <el-table-column label="符合片数" width="80" align="center" prop="value"/>
        <el-table-column label="备注" width="400" align="center" prop="remark" show-overflow-tooltip/>
      </el-table>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./stockDivision.js"></script>

<style scoped>
  .remark_input{
    width: 534px
  }
  .remark_input.short_remark{
    width: 517px
  }
  .add-dialog>>> .el-dialog__body{
    padding-top: 0;
  }
  .params_input{
    width: 100px;
  }
  .params_input.short_input{
    width: 84px;
  }
  .el-form-item .el-form-item {
    margin-bottom: 0;
    display: inline-block;
  }
  .module{
    position: relative;
    padding-left: 5px;
    padding-top: 10px;
    border-top: 1px solid #bbd6d0;
    height: auto;
    width: 100%;
    margin: 5px 0;
  }
  .moduleTitle{
    color: #009494;
    position: absolute;
    top: -13px;
    left: 16px;
    background: #fff;
    height: 20px;
    padding: 5px 15px;
    font-weight: bold;
    font-size: 14px;
    text-align: center;
  }
  .strategy-container{
    float:left;width:33.33%;
    padding: 7.5px
  }
  .module-container{
    box-shadow: none;
    border:1px solid #e2e2e2;
  }
  .module-content{
    height: 300px;
    overflow: auto
  }
  .app-container{
    padding: 7.5px
  }
  .search-box{
    display: flex;
    flex-direction: row;
  }
  .left-search-box{
    flex-grow: 1;
  }
  .right-btn-box{
    width: 75px;
  }
  .input-item{
    float: left;
    margin-top: 15px;
    margin-right: 10px;
  }
  .search-input{
    width: 140px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 204px);
  }
  .el-form-item--mini.el-form-item {
    margin-bottom: 2px;
    display: inline-block;
  }
  .abnormal-item>>> .el-form-item--mini.el-form-item {
    margin-bottom: 12px;
  }
  .add-params{
    width: 96px;
    float: right;
    position: relative;
  }
  .add-params-input{
    padding-left: 15px;
    position: absolute;
    top: 0px;
    width: 170px;
    left: -185px;
  }
  .module-title{
    padding-right: 10px;
  }
  .app-container>>> .el-textarea.is-disabled .el-textarea__inner {
    background-color: #fff;
    border-color: #E4E7ED;
    color: #333;
    cursor: default;
  }
  .app-container>>> .el-form-item__label{
    line-height: 19px;
  }
  .module-container{
    box-shadow: 4px 4px 8px rgba(0,0,0,0.15);
  }
  .app-container>>> .el-form-item {
    margin-bottom: 12px;
  }
</style>
