<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0">
      <div style="height: auto;">
        <el-row>
          <el-col :span="23">
            <div class="input-item">
              <span class="input-title">包号 </span>
              <el-input v-model="searchKey.bh" class="search-input" placeholder="请输入包号" size="small" maxlength="20" clearable/>
            </div>
            <div class="input-item">
              <span class="input-title">项次号 </span>
              <el-input v-model="searchKey.xch" class="search-input" placeholder="请输入项次号" size="small" maxlength="20" clearable/>
            </div>
            <div class="input-item">
              <span class="input-title">waferID </span>
              <el-input v-model="searchKey.waferID" class="search-input" placeholder="请输入waferID" size="small" maxlength="20" clearable/>
            </div>
            <div class="input-item">
              <span class="input-title">TapeNo</span>
              <el-input v-model="searchKey.TapeNo" class="search-input" placeholder="请输入TapeNo" size="small" maxlength="20" clearable/>
            </div>
            <div class="input-item">
              <span class="input-title">产品型号 </span>
              <el-select v-model="searchKey.cpxh" class="search-input" size="small" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in productModelOptions"
                  :key="item.id"
                  :label="item.code"
                  :value="item.code"/>
              </el-select>
            </div>
            <div class="input-item">
              <span class="input-title">柜位 </span>
              <el-select v-model="searchKey.gw" class="search-input" size="small" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in cabinetList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </div>
            <div class="input-item">
              <span class="input-title">是否清洗 </span>
              <el-select v-model="searchKey.sfqx" class="search-input" size="small" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in clearOptions"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"/>
              </el-select>
            </div>
            <div class="input-item">
              <span class="input-title">外观品质 </span>
              <el-select v-model="searchKey.pzwg" class="search-input" size="small" placeholder="请选择" filterable clearable>
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
            </div>
            <div class="input-item">
              <span class="input-title">工艺</span>
              <el-select v-model="searchKey.gy" class="search-input" size="small" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in gyList"
                  :key="item.id"
                  :label="item.code"
                  :value="item.code"/>
              </el-select>
            </div>
            <div class="input-item">
              <span class="input-title">入库类型</span>
              <el-select v-model="searchKey.rklx" class="search-input" size="small" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in putInTypeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"/>
              </el-select>
            </div>
            <div class="input-item">
              <span class="input-title">产地</span>
              <el-select v-model="searchKey.cd" class="search-input" size="small" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in placeOriginList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"/>
              </el-select>
            </div>
            <div class="input-item">
              <span class="input-title">标签</span>
              <el-select v-model="searchKey.bq" class="search-input" size="small" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in labelList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"/>
              </el-select>
            </div>
            <div class="input-item">
              <span class="input-title">库存状态</span>
              <el-select v-model="searchKey.kczt" class="search-input" size="small" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in storeOptions"
                  :key="item.name"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </div>
            <div class="input-item">
              <el-radio-group v-model="timeRadio" class="margin-right">
                <el-radio :label="1">初次入库时间</el-radio>
                <el-radio :label="2">入库时间</el-radio>
              </el-radio-group>
              <el-date-picker
                v-model="beginDate"
                :picker-options="pickerOptionsStart"
                :editable="false"
                class="search-input search-input-short"
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
                class="search-input search-input-short"
                size="small"
                type="date"
                placeholder="结束日期"
                value-format="timestamp"
              />
              <el-button
                class="margin-left"
                size="small"
                type="primary"
                icon="el-icon-search"
                @click="handleSearch" >查 询</el-button>
              <el-button
                class="margin-left"
                size="small"
                type="primary"
                icon="el-icon-search"
                @click="paramsSearch" >参数查询</el-button>
              <el-button
                size="small"
                type="danger"
                @click="clearSearch"
              >
                <svg-icon icon-class="clear"/> 重 置
              </el-button>
            </div>
          </el-col>
          <el-col :span="1">
            <div class="clear-both">
              <el-button
                :disabled="list.length === 0 || selectedRunRow.status === '备库' || selectedRunRow.status === '出库' || selectedRunRow.status === '退回产线' || selectedRunRow.status === '返工'"
                class="float-right margin-top"
                size="small"
                type="primary"
                icon="el-icon-search"
                @click="handleInvestigated" >待 查</el-button>
            </div>
          </el-col>
        </el-row>
        <div class="clear-both"/>
      </div>
    </div>
    <div class="app-container">
      <!--(Tol: {{ totalSlice }} 片，{{ totalParticle }} 颗)-->
      <span class="container-title">方片数据库</span>
      <span style="color: #009494; float: right;cursor: pointer;" @click="handleExport">
        <svg-icon icon-class="export"/> 导出
      </span>
      <el-table
        v-loading="listLoading"
        ref="runTable"
        :data="list"
        highlight-current-row
        height="87%"
        class="broad-scrollbar-table margin-top"
        element-loading-text="拼命加载中"
        border
        fit
        @row-click="rowClick"
      >
        <el-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column prop="boxNo" align="center" label="包号" width="135" fixed/>
        <el-table-column prop="sequence" align="center" label="项次号" width="110" fixed/>
        <el-table-column v-for="item in theadOptions" :key="item.thName" :label="item.thName" :prop="item.thKey" :width="item.width" align="center" show-overflow-tooltip/>
        <el-table-column v-for="item in reservedFields" :key="item.id" :label="item.name" :prop="item.code" width="120" align="center" show-overflow-tooltip/>
        <el-table-column v-for="item in theadParamsOptions" :key="item.thName" :label="item.thName" :prop="item.thKey" :width="item.width" align="center" show-overflow-tooltip/>
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
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="paramsSearchDialog"
      class="params-search-dialog"
      title="查询"
      top="80px"
      width="1096px"
      @close="handleClose('remarkForm')">
      <div class="input-item">
        <span class="input-title">波长代码</span>
        <el-select v-model="searchKey.bcdm" class="search-input" size="small" placeholder="请选择" filterable clearable>
          <el-option
            v-for="item in wavelengthList"
            :key="item.code"
            :label="item.code"
            :value="item.code"/>
        </el-select>
      </div>
      <div class="input-item">
        <span class="input-title">亮度代码</span>
        <el-select v-model="searchKey.lddm" class="search-input" size="small" placeholder="请选择" filterable clearable>
          <el-option
            v-for="item in brightnessList"
            :key="item.code"
            :label="item.code"
            :value="item.code"/>
        </el-select>
      </div>
      <div class="input-item">
        <span class="input-title">电压代码</span>
        <el-select v-model="searchKey.dydm" class="search-input" size="small" placeholder="请选择" filterable clearable>
          <el-option
            v-for="item in voltageList"
            :key="item.code"
            :label="item.code"
            :value="item.code"/>
        </el-select>
      </div>
      <div class="input-item" style="margin-right: 0px">
        <span class="input-title">研磨厚度</span>
        <el-input v-model="searchKey.ymhd" class="search-input" placeholder="请输入研磨厚度" size="small" maxlength="20" clearable/>
      </div>
      <div class="input-item">
        <span class="input-title">测试电流</span>
        <el-input v-model="searchKey.csdl" class="search-input" placeholder="请输入测试电流" size="small" maxlength="20" clearable/>
      </div>
      <div class="clear-both"/>
      <div class="cut-line"/>
      <div>
        <span class="params-title">WLD</span>
        <span class="input-title-params">MIN</span>
        <el-input v-model="searchKey.WLDMINmin" class="search-input-params" size="small" type="number" clearable/> ~
        <el-input v-model="searchKey.WLDMINmax" class="search-input-params" size="small" type="number" clearable/>
        <span class="input-title-params">MAX</span>
        <el-input v-model="searchKey.WLDMAXmin" class="search-input-params" size="small" type="number" clearable/> ~
        <el-input v-model="searchKey.WLDMAXmax" class="search-input-params" size="small" type="number" clearable/>
        <span class="input-title-params">AVG</span>
        <el-input v-model="searchKey.WLDAVGmin" class="search-input-params" size="small" type="number" clearable/> ~
        <el-input v-model="searchKey.WLDAVGmax" class="search-input-params" size="small" type="number" clearable/>
        <span class="input-title-params">STD</span>
        <el-input v-model="searchKey.WLDSTDmin" class="search-input-params" size="small" type="number" clearable/> ~
        <el-input v-model="searchKey.WLDSTDmax" class="search-input-params" size="small" type="number" clearable/>
        <!---->
        <span class="params-title">WLP</span>
        <span class="input-title-params">MIN</span>
        <el-input v-model="searchKey.WLPMINmin" class="search-input-params" size="small" type="number" clearable/> ~
        <el-input v-model="searchKey.WLPMINmax" class="search-input-params" size="small" type="number" clearable/>
        <span class="input-title-params">MAX</span>
        <el-input v-model="searchKey.WLPMAXmin" class="search-input-params" size="small" type="number" clearable/> ~
        <el-input v-model="searchKey.WLPMAXmax" class="search-input-params" size="small" type="number" clearable/>
        <span class="input-title-params">AVG</span>
        <el-input v-model="searchKey.WLPAVGmin" class="search-input-params" size="small" type="number" clearable/> ~
        <el-input v-model="searchKey.WLPAVGmax" class="search-input-params" size="small" type="number" clearable/>
        <span class="input-title-params">STD</span>
        <el-input v-model="searchKey.WLPSTDmin" class="search-input-params" size="small" type="number" clearable/> ~
        <el-input v-model="searchKey.WLPSTDmax" class="search-input-params" size="small" type="number" clearable/>
        <!---->
        <span class="params-title">WLC</span>
        <span class="input-title-params">MIN</span>
        <el-input v-model="searchKey.WLCMINmin" class="search-input-params" size="small" type="number" clearable/> ~
        <el-input v-model="searchKey.WLCMINmax" class="search-input-params" size="small" type="number" clearable/>
        <span class="input-title-params">MAX</span>
        <el-input v-model="searchKey.WLCMAXmin" class="search-input-params" size="small" type="number" clearable/> ~
        <el-input v-model="searchKey.WLCMAXmax" class="search-input-params" size="small" type="number" clearable/>
        <span class="input-title-params">AVG</span>
        <el-input v-model="searchKey.WLCAVGmin" class="search-input-params" size="small" type="number" clearable/> ~
        <el-input v-model="searchKey.WLCAVGmax" class="search-input-params" size="small" type="number" clearable/>
        <span class="input-title-params">STD</span>
        <el-input v-model="searchKey.WLCSTDmin" class="search-input-params" size="small" type="number" clearable/> ~
        <el-input v-model="searchKey.WLCSTDmax" class="search-input-params" size="small" type="number" clearable/>
        <!---->
        <span class="params-title">VF1</span>
        <span class="input-title-params">MIN</span>
        <el-input v-model="searchKey.VF1MINmin" class="search-input-params" size="small" type="number" clearable/> ~
        <el-input v-model="searchKey.VF1MINmax" class="search-input-params" size="small" type="number" clearable/>
        <span class="input-title-params">MAX</span>
        <el-input v-model="searchKey.VF1MAXmin" class="search-input-params" size="small" type="number" clearable/> ~
        <el-input v-model="searchKey.VF1MAXmax" class="search-input-params" size="small" type="number" clearable/>
        <span class="input-title-params">AVG</span>
        <el-input v-model="searchKey.VF1AVGmin" class="search-input-params" size="small" type="number" clearable/> ~
        <el-input v-model="searchKey.VF1AVGmax" class="search-input-params" size="small" type="number" clearable/>
        <span class="input-title-params">STD</span>
        <el-input v-model="searchKey.VF1STDmin" class="search-input-params" size="small" type="number" clearable/> ~
        <el-input v-model="searchKey.VF1STDmax" class="search-input-params" size="small" type="number" clearable/>
        <!---->
        <span class="params-title">IR</span>
        <span class="input-title-params">MIN</span>
        <el-input v-model="searchKey.IRMINmin" class="search-input-params" size="small" type="number" clearable/> ~
        <el-input v-model="searchKey.IRMINmax" class="search-input-params" size="small" type="number" clearable/>
        <span class="input-title-params">MAX</span>
        <el-input v-model="searchKey.IRMAXmin" class="search-input-params" size="small" type="number" clearable/> ~
        <el-input v-model="searchKey.IRMAXmax" class="search-input-params" size="small" type="number" clearable/>
        <span class="input-title-params">AVG</span>
        <el-input v-model="searchKey.IRAVGmin" class="search-input-params" size="small" type="number" clearable/> ~
        <el-input v-model="searchKey.IRAVGmax" class="search-input-params" size="small" type="number" clearable/>
        <span class="input-title-params">STD</span>
        <el-input v-model="searchKey.IRSTDmin" class="search-input-params" size="small" type="number" clearable/> ~
        <el-input v-model="searchKey.IRSTDmax" class="search-input-params" size="small" type="number" clearable/>
        <!---->
        <span class="params-title">VZ1</span>
        <span class="input-title-params">MIN</span>
        <el-input v-model="searchKey.VZ1MINmin" class="search-input-params" size="small" type="number" clearable/> ~
        <el-input v-model="searchKey.VZ1MINmax" class="search-input-params" size="small" type="number" clearable/>
        <span class="input-title-params">MAX</span>
        <el-input v-model="searchKey.VZ1MAXmin" class="search-input-params" size="small" type="number" clearable/> ~
        <el-input v-model="searchKey.VZ1MAXmax" class="search-input-params" size="small" type="number" clearable/>
        <span class="input-title-params">AVG</span>
        <el-input v-model="searchKey.VZ1AVGmin" class="search-input-params" size="small" type="number" clearable/> ~
        <el-input v-model="searchKey.VZ1AVGmax" class="search-input-params" size="small" type="number" clearable/>
        <span class="input-title-params">STD</span>
        <el-input v-model="searchKey.VZ1STDmin" class="search-input-params" size="small" type="number" clearable/> ~
        <el-input v-model="searchKey.VZ1STDmax" class="search-input-params" size="small" type="number" clearable/>
        <!---->
        <span class="params-title">LOP1</span>
        <span class="input-title-params">MIN</span>
        <el-input v-model="searchKey.LOP1MINmin" class="search-input-params" size="small" type="number" clearable/> ~
        <el-input v-model="searchKey.LOP1MINmax" class="search-input-params" size="small" type="number" clearable/>
        <span class="input-title-params">MAX</span>
        <el-input v-model="searchKey.LOP1MAXmin" class="search-input-params" size="small" type="number" clearable/> ~
        <el-input v-model="searchKey.LOP1MAXmax" class="search-input-params" size="small" type="number" clearable/>
        <span class="input-title-params">AVG</span>
        <el-input v-model="searchKey.LOP1AVGmin" class="search-input-params" size="small" type="number" clearable/> ~
        <el-input v-model="searchKey.LOP1AVGmax" class="search-input-params" size="small" type="number" clearable/>
        <span class="input-title-params">STD</span>
        <el-input v-model="searchKey.LOP1STDmin" class="search-input-params" size="small" type="number" clearable/> ~
        <el-input v-model="searchKey.LOP1STDmax" class="search-input-params" size="small" type="number" clearable/>
      </div>
      <div class="cut-line"/>
      <span slot="footer" class="dialog-footer" style="text-align: center">
        <el-button type="primary" @click="handleSearchParams">确 定</el-button>
        <el-button @click="paramsSearchDialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .operator-select{
    width: 75px;
  }
  .input-title-long{
    font-weight: bold;
    display: inline-block;
    text-align: right;
    width: 70px;
    padding-right: 5px;
  }
  .broad-scrollbar-table>>> .cell{
    line-height: 30px;
  }
  .broad-scrollbar-table>>> td{
    height: 30px;
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
  .short-input{
    width: 126px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 295px);
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
    width: 180px;
    height: 335px;
    border: 1px solid #e2e2e2;
    position: absolute;
    z-index: 200;
    background: #fff;
    right: 15px;
    top: 60px;
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
    margin-bottom: 10px;
    margin-top: 10px;
  }
  .input-title{
    width: 65px;
  }
  .cow .input-title{
    width: 75px;
  }
  .left-content{
    border: 1px solid #b2dfdf;
    margin-top: 10px;
    padding: 5px 10px 10px 10px;
  }
  .dialog-input{
    width: 232px;
  }
  .dialog-input-base{
    width: 217px;
  }
  .dialog-input-short{
    width: 182px;
  }
  .input-title-short{
    width: 50px !important;
  }
  .search-input-short{
    width: 80px;
  }
  .module-title-text{
    margin-bottom: 10px;
  }
  .search-input{
    width: 140px;
  }
  .input-container{
    padding: 10px;
    border: 1px solid #b2dfdf;
    padding-right: 0;
    background: #edf7f7;
    margin: 10px 0;
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
    color: #494949;
  }
  .padding-dialog>>> .el-dialog__footer{
    text-align: center;
  }
  .submit-btn{
    background: #1abb9d; border-color: #1abb9d;padding: 20px 40px;margin-left: 80px
  }
  .abnormal-cause{
    position: absolute;
    width: 105px;
    top: 63px;
    background: #fff;
    right: 13px;
  }
  .header-search-add>>> .el-input--suffix .el-input__inner {
    padding-right: 15px;
  }
  .container-title{
    font-weight: bold;
    font-size: 16px;
    color: #009494;
  }
  .params-search-dialog>>> .el-dialog__body{
    overflow: hidden;
    padding-top: 0 !important;
  }
  .params-search-dialog>>> .el-dialog__footer{
    text-align: center;
  }
  .params-search-dialog .input-item{
    margin-top: 10px;
  }
  .params-search-dialog .search-input{
    width: 165px;
  }
  .search-input-params{
    width: 88px;
  }
  .input-title-params{
    width: 60px;
    margin-left: 20px;
  }
  .params-title{
    margin-bottom: 15px;
    color: #009494;
    font-weight: bold;
    width: 45px;
    display: inline-block;
  }
</style>
