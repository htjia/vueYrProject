<template>
  <PageHeaderLayout >
    <el-row :gutter="0">
      <el-col :span="6">
        <div class="header-search-add top-header">
          <svg-icon style="color: #009494; font-size: 32px;margin-right: 10px" icon-class="ruku"/>
          <span>总入库（片）：</span>
          <span class="top-header-value">{{ total }}</span>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="header-search-add top-header">
          <svg-icon style="color: #009494; font-size: 32px;margin-right: 10px" icon-class="manztjrk"/>
          <span>满足条件入库：</span>
          <span class="top-header-value">{{ okNum }} <span v-if="okNumYield">({{ okNumYield }})</span></span>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="header-search-add top-header">
          <svg-icon style="color: #009494; font-size: 32px;margin-right: 10px" icon-class="ngrk"/>
          <span>NG入库：</span>
          <span class="top-header-value">{{ ngNum }} <span v-if="ngNumYield">({{ ngNumYield }})</span></span>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="header-search-add top-header">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="handleSearch" >查询</el-button>
          <el-button
            size="small"
            type="danger"
            @click="clearAll" ><svg-icon icon-class="clear"/> 重 置</el-button>
          <el-button
            size="small"
            type="primary"
            @click="exportAll"><svg-icon icon-class="export"/> 导出</el-button>
        </div>
      </el-col>
    </el-row>
    <div class="header-search-add height-auto" style="padding-top: 10px; padding-bottom: 0">
      <div class="module">
        <div class="moduleTitle">数据源设置</div>
      </div>
      <div class="search-box">
        <div class="input-item">
          <span class="input-title" style="width: 65px;">入库类型 </span>
          <el-select v-model="searchKey.rklx" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in storehouseType"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">光色名称 </span>
          <el-select v-model="searchKey.gsmc" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in colorList"
              :key="item.id"
              :label="item.code"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title" style="width: 40px;">尺寸 </span>
          <el-select v-model="searchKey.size" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in measureList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">验证版型 </span>
          <el-select v-model="searchKey.yzbx" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in substrateFindOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
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
      </div>
      <div class="module" style="margin: 12px 0">
        <div class="moduleTitle">参数范围设置</div>
      </div>
      <div class="add-params-box">
        <div class="params-box">
          <el-form ref="paramsForm" :validate-on-rule-change="false" :model="paramsForm" :rules="rules" size="mini" status-icon label-width="120px" label-position="right">
            <el-form-item
              v-for="(item,index) in paramsForm.paramsList"
              :key="index"
              :label="item.name"
              :class="{'long-title': item.name === 'ESD(200)Yield'}"
            >
              <el-form-item
                v-if="item.paramCategory === 0 || item.paramCategory === 1"
                :prop="`paramsList.${index}.params_minVal`"
                :rules="rules.params_minVal"
                class="innerItem"
                label="">
                <el-input v-model="item.minVal" class="params_input" step="0.01" type="number" onkeyup="this.value=this.value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')" filterable><span v-if="item.paramCategory === 1" slot="suffix">%</span></el-input> ~
              </el-form-item>
              <el-form-item
                v-if="item.paramCategory === 0 || item.paramCategory === 1"
                :prop="`paramsList.${index}.params_maxVal`"
                :rules="rules.params_maxVal"
                class="innerItem"
                label="">
                <el-input v-model="item.maxVal" :class="{'short_input': index > 5}" class="params_input" filterable step="0.01" type="number" onkeyup="this.value=this.value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')" @keyup.native="changeVal(item,index)"><span v-if="item.paramCategory === 1" slot="suffix">%</span></el-input>
              </el-form-item>
              <span v-if="item.paramCategory === 2">
                ≤
                <el-form-item
                  class="innerItem"
                >
                  <el-select v-model="item.minVal" class="params_input" placeholder="请选择" style="width: 193px;" filterable clearable>
                    <el-option
                      v-for="item in levelList"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name"/>
                  </el-select>
                </el-form-item>
              </span>
              <el-radio-group v-if="item.paramCategory === 3" v-model="item.minVal">
                <el-radio label="s">S</el-radio>
                <el-radio label="f">F</el-radio>
                <el-radio label="t">T</el-radio>
                <el-radio label="r">R</el-radio>
              </el-radio-group>
              <span v-if="index > 5" class="svg" @click="deleteParams(index,item)">
                <svg-icon style="color: #F56C6C;cursor: pointer;" icon-class="shanchu"/>
              </span>
            </el-form-item>
          </el-form>
        </div>
        <div class="add-params">
          <div v-if="isParams" class="add-params-input">
            <el-select v-model="newParam" clearable size="mini" @change="selectParamsChange">
              <el-option
                v-for="(it,ind) in parameter"
                :key="ind"
                :label="it.name"
                :value="it.id"
                :disabled="it.disabled"
              />
            </el-select>
          </div>
          <el-button
            size="mini"
            type="primary"
            @click="addHandleParams"
          ><svg-icon icon-class="add"/> 新增参数</el-button>
        </div>
      </div>
    </div>
    <div class="app-container">
      <el-form ref="tableColForm" :validate-on-rule-change="false" :model="tableColForm" :rules="tableColRules" size="mini" status-icon label-width="0px" label-position="right">
        <el-table
          v-loading="listLoading"
          :data="tableForm.list"
          :key="tableKey"
          element-loading-text="拼命加载中"
          height="calc(100vh - 370px)"
          class="run-table broad-scrollbar-table"
          highlight-current-row
          border
          fit
        >
          <el-table-column label="RunID" align="center" prop="runId" width="300" fixed>
            <template slot="header" slot-scope="scope">
              <div style="position: relative;" class="first_col">
                <div class="line"/>
                <div style="display: block">
                  <el-form-item prop="header" class="col_form_item">
                    <el-select v-model="tableColForm.headerParams" class="search-input" style="float: right; width: 120px;margin-top: 2px; margin-right: 3px" size="mini" placeholder="请选择1" filterable>
                      <el-option
                        v-for="item in headerParameter"
                        :key="item.id"
                        :label="item.name"
                        :disabled="item.disabled"
                        :value="item.id + '@' +item.type"/>
                    </el-select>
                  </el-form-item>
                </div>
                <div style="display: block;height: 30px; ">
                  <el-form-item prop="row" class="row_form_item">
                    <el-select v-model="tableColForm.rowParams" class="search-input" style="float: left; width: 120px;margin-left: 3px;margin-top: -1px" size="mini" placeholder="请选择" filterable>
                      <el-option
                        v-for="item in rowParameter"
                        :key="item.id"
                        :label="item.name"
                        :disabled="item.disabled"
                        :value="item.id + '@' +item.type"/>
                    </el-select>
                  </el-form-item>
                </div>
              </div>
            </template>
            <template slot-scope="scope"/>
          </el-table-column>
          <el-table-column v-for="(col, index) in tableColForm.tableHeader" :key="index" :prop="`column${index + 1}`" align="center" width="260px">
            <template slot="header" slot-scope="scope">
              <el-form-item>
                <el-form-item
                  :prop="`tableHeader.${index}.params_minVal`"
                  :rules="tableColRules.params_minVal"
                  class="innerItem"
                  label="">
                  <el-input v-model="col.min" class="col_params_input" step="0.01" type="number" onkeyup="this.value=this.value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')" filterable/> <div>~</div>
                </el-form-item>
                <el-form-item
                  :prop="`tableHeader.${index}.params_maxVal`"
                  :rules="tableColRules.params_maxVal"
                  class="innerItem"
                  label="">
                  <el-input v-model="col.max" class="col_params_input" step="0.01" type="number" onkeyup="this.value=this.value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')" filterable/>
                </el-form-item>
                <div style="float: right;margin-left: 7px">
                  <el-button v-if="index > 3" circle type="danger" size="mini" icon="el-icon-delete" style="margin-top: 13px" @click="deleteTableCol(index)"/>
                  <el-button v-if="index === tableColForm.tableHeader.length-1 && tableColForm.tableHeader.length < 10" circle type="primary" size="mini" icon="el-icon-plus" style="margin-top: 13px" @click="addTableCol"/>
                </div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="lightRatio" align="center" label="亮度占比"/>
        </el-table>
        <el-form
          ref="tableForm"
          :validate-on-rule-change="false"
          :model="tableForm"
          :rules="tableFormRules"
          class="tableForm"
          size="mini"
          status-icon
          label-width="0px"
          label-position="right"
        >
          <el-form-item
            v-for="(row, index) in tableForm.list"
            :key="index"
            class="table_row_item"
          >
            <div v-if="index !== tableForm.list.length - 1">
              <el-form-item
                :prop="`list.${index}.params_minVal`"
                :rules="tableFormRules.params_minVal"
                class="innerItem"
                label="">
                <el-input v-model="row.rowMin" class="row_params_input" step="0.01" type="number" onkeyup="this.value=this.value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')" filterable/> ~
              </el-form-item>
              <el-form-item
                :prop="`list.${index}.params_maxVal`"
                :rules="tableFormRules.params_maxVal"
                class="innerItem"
                label="">
                <el-input v-model="row.rowMax" class="row_params_input" step="0.01" type="number" onkeyup="this.value=this.value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')" filterable/>
              </el-form-item>
              <el-button v-if="index > 3" circle type="danger" size="mini" icon="el-icon-delete" @click="deleteTableRow(index)"/>
              <el-button v-if="index === tableForm.list.length - 2 && tableForm.list.length < 11" circle type="primary" size="mini" icon="el-icon-plus" @click="addTableRow(index)"/>
            </div>
            <div v-else>预估波长占比</div>
          </el-form-item>
        </el-form>
      </el-form>
    </div>
  </PageHeaderLayout>
</template>

<script src="./dailyWarehousing.js"></script>

<style scoped>
  .addBtn{
    color: #009494;
    font-size: 28px;
    position: absolute;
    right: -30px;
  }
  .params_input{
    width: 94px;
  }
  .row_params_input{
    width: 94px;
  }
  .params_input.short_input{
    width: 76px;
  }
  .col_params_input{
    width: 84px;
  }
  .params_input>>> .el-input__suffix-inner {
    position: absolute;
    right: 0;
  }
  .params-box>>> .el-form-item--feedback .el-input__validateIcon {
    margin-right: 5px;
  }
  .el-form-item--mini.el-form-item{
    display: inline-block;
    margin-bottom: 6px;
  }
  .app-container>>> .el-table tr .el-button--mini {
    padding: 5px !important;
  }
  .app-container>>> .el-button+.el-button {
    margin-left: 5px;
  }
  .params-box>>>.el-form-item__error{
    font-size: xx-small;
  }
  .params-box>>>.el-form-item--mini .el-form-item__error{
    padding-top: 0;
  }
  .top-header{
    height: 60px;
    text-align: center;
    font-weight: bold;
    font-size: 15px
  }
  .top-header .top-header-value{
    color: #009494;
    line-height: 32px;
  }
  .module{
    position: relative;
    padding-left: 5px;
    padding-top: -5px;
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
  .line{
    position: absolute;
    width: 300px;
    transform: rotate(11deg);
    border-bottom: 1px solid #aad7d7 ;
    top: 30px;
  }
  .run-table>>> th .cell{
    line-height: 60px !important;
    height: 60px !important;
  }
  .run-table>>> th .el-form-item--mini .el-form-item__error {
    margin-top: -26px;
    color: #F56C6C !important;
    font-weight: normal;
  }
  .run-table>>> td .cell{
    line-height: 33px !important;
    height: 33px !important;
  }
  .run-table>>> th:first-child div{
    line-height: 30px;
    display: block!important;
  }
  .run-table>>> th .el-form-item--mini .el-form-item__content{
    margin-top: 5px;
  }
  .run-table>>> .cell{
    display: block!important;
  }
  .title-postion{
    top: 13px;
    background: #fff;
    z-index: 15;
    position: relative;
    width: 85px;
    padding: 5px;
    left: 16px;
    font-weight: bold;
    font-size: 14px;
    text-align: center;
  }
  .set-border{
    border: 1px solid rgb(220, 223, 230);
    padding-top: 20px;
    padding-bottom: 0px;
  }
  .edit-dialog>>>.el-dialog__body{
    padding-top: 10px;
  }
  .search-box{
    display: flex;
    flex-direction: row;
  }
  .left-search-box{
    flex-grow: 1;
  }
  .add-params-box{
    display: flex;
    flex-direction: row;
  }
  .params-box{
    flex-grow: 1;
  }
  .add-params{
    width: 96px;
    position: relative;
  }
  .add-params-input{
    padding-left: 15px;
    position: absolute;
    top: 0px;
    width: 170px;
    left: -185px;
  }
  .right-btn-box{
    width: 75px;
  }
  .input-item{
    float: left;
    margin-top: 8px;
    margin-right: 10px;
  }
  .search-input{
    width: 97px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 339px);
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
  .substrate>div:not(:first-child){
    margin-left: 5px;
  }
  .table-top-btn-group>div.active{
    color: #fff;
    background: #009494;
    border-color: #009494;
  }
  .broad-scrollbar-table>>> .el-table__fixed {
    background: #fff;
    height: calc(100% - 0px) !important;
  }
  .stsl::before{
    content: '*';
    color: #F56C6C;
    margin-right: 4px;
  }
  .tableForm{
    position: absolute;
    top: 83px;
    left: 20px;
    width: 300px;
    text-align: center;
    z-index: 11
  }
  .run-table>>> th .first_col .el-form-item--mini .el-form-item__content{
    margin-top: 0px;
  }
  .run-table>>> th .first_col .el-form-item--mini.el-form-item{
    margin-bottom: 0;
  }
  .run-table>>> th .col_form_item .el-form-item__error{
    margin-left: 87px;
    margin-top: -30px;
  }
  .run-table>>> th .row_form_item .el-form-item__error{
    margin-left: 128px;
    margin-top: -30px;
  }
  .tableForm>>> .el-input--mini .el-input__inner {
    height: 25px;
    line-height: 25px;
  }
  .tableForm>>> .el-form-item--mini .el-form-item__error {
    padding-top: 0px;
  }
  @media (max-width: 1440px) {
    .run-table>>> td .cell{
      line-height: 29px !important;
      height: 29px !important;
    }
    .run-table>>> td{
      height: 29px !important;
    }
    .tableForm>>> .el-input--mini .el-input__inner {
      height: 20px;
      line-height: 20px;
    }
    .table_row_item{
      height: 24px !important;
    }
    .tableForm{
      top: 78px;
    }
    .tableForm>>> .el-button--mini.is-circle{
      padding: 4px
    }
    .tableForm>>> .el-form-item__error{
      line-height: 0;
    }
  }
</style>
