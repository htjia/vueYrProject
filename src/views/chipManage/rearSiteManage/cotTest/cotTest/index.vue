<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 5px">
      <el-row>
        <div class="header-btn-group">
          <el-button
            style="margin-top: 5px"
            size="small"
            type="primary"
            @click="mulSearchClick" ><svg-icon icon-class="pilcx" style="margin-right: 5px" />批量查询</el-button>
          <el-button
            style="margin-top: 5px"
            size="small"
            type="primary"
            @click="SectionStatisClick" ><svg-icon icon-class="qujfb" style="margin-right: 5px"/>区间分布</el-button>
          <el-button
            style="margin-top: 5px"
            size="small"
            type="primary"
            @click="BinStatisClick" ><svg-icon icon-class="bintable" style="margin-right: 5px"/>Bin分布</el-button>
          <el-button
            style="margin-top: 5px"
            class="float-right"
            size="small"
            type="primary"
            icon="shezhilk"
            @click="selectThead" ><svg-icon icon-class="shezhilk" style="margin-right: 5px"/>设置显示列</el-button>
          <el-button
            style="margin-top: 5px"
            class="float-right"
            size="small"
            type="primary"
            @click="mulDownFile" ><svg-icon icon-class="pilxz" style="margin-right: 5px"/>批量下载</el-button>
          <el-button
            style="margin-top: 5px"
            class="float-right"
            size="small"
            type="primary"
            @click="exportExcel" ><svg-icon icon-class="daochu_1" style="margin-right: 5px"/>导 出</el-button>
        </div>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="input-item">
            <span class="input-title">WaferID</span>
            <el-input v-model="searchKeys.WaferNo" class="search-input" style="width: 210px" placeholder="请输入WaferID" size="small" maxlength="50" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 50px">批次号</span>
            <el-input v-model="searchKeys.LotNo" class="search-input" style="width: 180px" placeholder="请输入批次号" size="small" maxlength="50" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">投片类型</span>
            <el-select v-model="searchKeys.tplx" class="search-input" style="width: 80px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in tpOptions"
                :key="item.id"
                :label="item.name"
                :value="item.name"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">产品代码</span>
            <el-select v-model="searchKeys.cpdm" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="(item,index) in productCodeList"
                :key="index"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">外延机台</span>
            <el-select v-model="searchKeys.wyjt" class="search-input" style="width: 80px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in machineList"
                :key="item.name"
                :label="item.name"
                :value="item.name"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">投产类型</span>
            <el-select v-model="searchKeys.tclx" class="search-input" style="width: 80px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in categoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 40px">尺寸</span>
            <el-select v-model="searchKeys.cc" class="search-input" style="width: 80px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in substrateMeasureList"
                :key="item.name"
                :label="item.name"
                :value="item.name"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">COT机台</span>
            <el-select v-model="searchKeys.cotjt" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in cowMachineList"
                :key="item.code"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">外延片号</span>
            <el-input v-model="searchKeys.wyph" class="search-input" style="width: 180px" placeholder="请输入外延片号" size="small" maxlength="50" clearable/>
          </div>
          <div style="float: left;width: 640px; height: 46px;">
            <div class="input-item" style="margin-right: 20px;">
              <el-radio-group v-model="timeRadio">
                <el-radio :label="0">导入时间</el-radio>
                <el-radio :label="1">测试时间</el-radio>
              </el-radio-group>
            </div>
            <div class="input-item">
              <el-date-picker
                v-model="beginDate"
                :picker-options="pickerOptionsStart"
                :editable="false"
                class="search-input"
                size="small"
                style="width: 170px;"
                type="datetime"
                placeholder="开始日期"
                value-format="timestamp"
                format="yyyy-MM-dd HH:mm"
              />
              <span style="display:inline-block;width: 38px;text-align: center"> 至 </span>
              <el-date-picker
                v-model="endDate"
                :picker-options="pickerOptionsEnd"
                :editable="false"
                class="search-input"
                size="small"
                style="width: 170px;"
                type="datetime"
                placeholder="结束日期"
                value-format="timestamp"
                format="yyyy-MM-dd HH:mm"
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
            ><svg-icon icon-class="clear"/> 重 置</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="app-container">
      <div v-if="selectTheadVisble" class="select-thead">
        <div class="options-box">
          <el-checkbox-group v-model="checkboxVal">
            <el-checkbox v-for="option in formTheadOptions" :label="option" :key="option" width="180">
              {{ option }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <el-button type="primary" size="mini" style="margin-left: 25px" @click="submitOption">确 定</el-button>
        <el-button size="mini" @click="resetOption">取 消</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        :cell-style="tableRowClassColor"
        element-loading-text="拼命加载中"
        class="broad-scrollbar-table"
        highlight-current-row
        border
        height="89%"
        fit
        header-drag-style
        use-virtual
        @current-change="handleCurrentChange"
        @selection-change="selectionChange"
        @cell-mouse-enter="hoverCall"
        @cell-click="cellClick"
        @sort-change="sortChange"
      >
        <el-table-column align="center" type="selection" width="50" fixed/>
        <el-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="测试类型" width="120" prop="categoryName" fixed/>
        <el-table-column align="center" label="WaferID" width="220" sortable="custom" prop="waferNo" show-overflow-tooltip fixed>
          <template slot-scope="scope">
            <div v-if="scope.row.unFind === 1 " style="color: #e35c5c" >{{ scope.row.waferNo }}</div>
            <div v-else >{{ scope.row.waferNo }}</div>
          </template>
        </el-table-column>
        <el-table-column v-for="item in formThead" :key="item.thName" :label="item.thName" :prop="item.thKey" :width="item.thWidth" sortable="custom" align="center" show-overflow-tooltip/>
        <el-table-column align="center" label="原始文件" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <div style="color: #009494;text-decoration: underline;cursor: pointer;" @click="downLoadFile(scope.row.filePath)">点击下载</div>
          </template>
        </el-table-column>
        <!--to do 文档详情-->
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
      :visible.sync="dialogVisible"
      title="批量查询"
      width="500px"
      @close="resetForm('mulForm')">
      <el-form ref="mulForm" :model="mulForm" :rules="mulrules" status-icon label-width="80px" label-position="right">
        <el-form-item label="waferId" prop="mulWaferID">
          <el-input v-model="mulForm.mulWaferID" :rows="10" type="textarea" placeholder="请输入多个WaferID,以换行分割" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('mulForm')">确 定</el-button>
        <el-button @click="resetForm('mulForm')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="SectionDialogVisible"
      :before-close="handleClose"
      title="区间分布统计"
      width="1200px"
      class="edit-dialog">
      <el-row>
        <el-col :span="9" style="padding: 5px 5px 5px 0;">
          <el-row>
            <fieldset class="fieldest" style="width:100%">
              <legend class="legendsty"> VF1 </legend>
              <el-button type="primary" style="margin: -10px 0px 5px;" size="small" @click="vf1Set()">VF1区间设置</el-button>
              <el-table
                v-loading="vf1listLoading"
                :data="vf1SectionList"
                element-loading-text="拼命加载中"
                height="300px"
                border
                fit
                stripe>
                <el-table-column align="center" label="区间起始值" width="100" prop="start" fixed/>
                <el-table-column align="center" label="区间结束值" width="100" prop="end" fixed/>
                <el-table-column align="center" label="数量" width="100" prop="num" fixed/>
                <el-table-column align="center" label="百分比" width="110" prop="percent" fixed/>
              </el-table>
            </fieldset>
          </el-row>
          <el-row>
            <fieldset class="fieldest" style="width:100%">
              <legend class="legendsty"> LOP1 </legend>
              <el-button type="primary" style="margin: -10px 0px 5px;" size="small" @click="lopSet()">LOP1区间设置</el-button>
              <el-table
                v-loading="loplistLoading"
                :data="lopSectionList"
                element-loading-text="拼命加载中"
                height="300px"
                border
                fit
                stripe>
                <el-table-column align="center" label="区间起始值" width="100" prop="start" fixed/>
                <el-table-column align="center" label="区间结束值" width="100" prop="end" fixed/>
                <el-table-column align="center" label="数量" width="100" prop="num" fixed/>
                <el-table-column align="center" label="百分比" width="110" prop="percent" fixed/>
              </el-table>
            </fieldset>
          </el-row>
        </el-col>
        <el-col :span="9" style="padding: 5px 5px 5px 0;">
          <el-row>
            <fieldset class="fieldest" style="width:100%">
              <legend class="legendsty"> IR </legend>
              <el-button type="primary" style="margin: -10px 0px 5px;" size="small" @click="irSet()">IR区间设置</el-button>
              <el-table
                v-loading="irlistLoading"
                :data="irSectionList"
                element-loading-text="拼命加载中"
                height="300px"
                border
                fit
                stripe>
                <el-table-column align="center" label="区间起始值" width="100" prop="start" fixed/>
                <el-table-column align="center" label="区间结束值" width="100" prop="end" fixed/>
                <el-table-column align="center" label="数量" width="100" prop="num" fixed/>
                <el-table-column align="center" label="百分比" width="110" prop="percent" fixed/>
              </el-table>
            </fieldset>
          </el-row>
          <el-row>
            <fieldset class="fieldest" style="width:100%">
              <legend class="legendsty"> WLD1 </legend>
              <el-button type="primary" style="margin: -10px 0px 5px;" size="small" @click="wld1Set()">WLD1区间设置</el-button>
              <el-table
                v-loading="wld1listLoading"
                :data="wld1SectionList"
                element-loading-text="拼命加载中"
                height="300px"
                border
                fit
                stripe>
                <el-table-column align="center" label="区间起始值" width="100" prop="start" fixed/>
                <el-table-column align="center" label="区间结束值" width="100" prop="end" fixed/>
                <el-table-column align="center" label="数量" width="100" prop="num" fixed/>
                <el-table-column align="center" label="百分比" width="110" prop="percent" fixed/>
              </el-table>
            </fieldset>
          </el-row>
        </el-col>
        <el-col :span="6" style="padding: 5px 5px 15px 0;">
          <fieldset class="fieldest" style="width:100%; height: 100%;">
            <legend class="legendsty"> BIN分布 </legend>
            <el-table
              v-loading="binLoading"
              :data="binList"
              height="700px"
              element-loading-text="拼命加载中"
              border
              fit
              stripe>
              <el-table-column align="center" label="BIN" width="70" prop="start" fixed/>
              <el-table-column align="center" label="数量" width="100" prop="num" fixed/>
              <el-table-column align="center" label="百分比" width="110" prop="percent" fixed/>
            </el-table>
          </fieldset>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="SectionDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="SectionSetDialogVisible"
      :before-close="handleClose"
      title= "范围设置"
      width="760px"
      class="edit-dialog">
      <div style="height: 400px">
        <el-col :span="16" style="padding: 5px 5px 15px 0; ">
          <fieldset class="fieldest" style="width:100%; height: 380px">
            <legend class="legendsty"> {{ setTitle }} 范围值 </legend>
            <el-table
              v-loading="listLoading"
              :data="sectionList"
              height="350px"
              element-loading-text="拼命加载中"
              border
              fit
              stripe>
              <el-table-column align="center" label="序号" width="50">
                <template slot-scope="scope">
                  <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                    {{ scope.$index+1 }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="范围值" align="center" prop="sectionValue">
                <template slot-scope="scope">
                  <div>
                    <el-input v-model="scope.row.sectionValue" type="text" size="small" style="width: 95%" maxlength="20"/>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="160px">
                <template slot-scope="scope">
                  <div >
                    <el-button
                      type="primary"
                      size="mini"
                      @click="handleInsert(scope.row, scope.$index, 1)"
                    ><svg-icon icon-class="insert"/> 插入</el-button>
                    <el-button
                      size="mini"
                      icon="el-icon-delete"
                      type="danger"
                      @click="handleDelete(scope.$index, 1)"
                    >删除</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>

          </fieldset>
        </el-col>
        <el-col :span="8" style="padding: 5px 5px 15px 0; ">
          <fieldset class="fieldest" style="width:100%; height: 380px">
            <legend class="legendsty"> 设置 </legend>
            <el-row>
              <div class="input-item">
                <span class="input-title">最小值：</span>
                <el-input v-model="sectionset.minval" class="search-input" style="width: 100px" placeholder="最小值" size="small" maxlength="50" clearable/>
              </div>
            </el-row>
            <el-row>
              <div class="input-item">
                <span class="input-title">最大值：</span>
                <el-input v-model="sectionset.maxval" class="search-input" style="width: 100px" placeholder="最大值" size="small" maxlength="50" clearable/>
              </div>
            </el-row>
            <el-row>
              <div class="input-item">
                <span class="input-title">间隔值：</span>
                <el-input v-model="sectionset.interval" class="search-input" style="width: 100px" placeholder="间隔值" size="small" maxlength="50" clearable/>
              </div>
            </el-row>
            <el-row>
              <div class="input-item">
                <el-row>
                  <el-button type="primary" style="margin-left: 50px" @click="CreatSection">生成</el-button>
                </el-row>
                <el-row>
                  <el-button
                    class="handle-bush"
                    type="primary"
                    style="margin-left: 50px; margin-top: 10px"
                    size="small"
                    @click="handlePush(1)"
                  ><svg-icon icon-class="add"/>添加</el-button>
                </el-row>
              </div>
            </el-row>
          </fieldset>
        </el-col>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="SectionSetOK()">确 定</el-button>
        <el-button @click="SectionSetDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="BinDialogVisible"
      :before-close="handleClose"
      title="BIN分布统计"
      width="1200px"
      class="edit-dialog">
      <el-row style="margin-bottom: 10px">
        <el-button type="primary" @click="ShowBinTitle">{{ titleInfo }}Bin范围信息</el-button>
        <el-button type="primary" @click="ExportBinStatis">导出</el-button>
        <el-button type="primary" @click="BinDialogVisible = false">退出</el-button>
      </el-row>
      <el-row>
        <fieldset class="fieldest" style="width:100%; height: 100%; margin-bottom: 10px">
          <legend class="legendsty"> BIN分布 </legend>
          <div style="width: 1132px; ">
            <el-table
              v-loading="binLoading"
              :data="binList"
              height="420px"
              element-loading-text="拼命加载中"
              class="broad-scrollbar-table"
              use-virtual
              border
              fit>
              <el-table-column align="center" label="BIN" width="70" prop="level" fixed/>
              <el-table-column align="center" label="数量" width="100" prop="num" />
              <el-table-column align="center" label="百分比" width="110" prop="percent" />
              <el-table-column v-for="(item,index) in showBinTitle" :key="index" :label="item.thName" :prop="item.thKey" :width="item.thWidth" align="center" />
            </el-table>
          </div>
        </fieldset>
      </el-row>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .app-container>>> .cell{
    line-height: 36px;
  }
  .app-container>>> td{
    height: 36px;
  }
  .input-title{
    width: 65px;
  }
  .input-item{
    float: left;
    margin-top: 14px;
    margin-right: 10px;
    position: relative;
  }
  /*.input-item>>> .el-radio:last-child {*/
    /*left: 0;*/
    /*margin-right: 0;*/
    /*position: absolute;*/
    /*top: 43px;*/
  /*}*/
  .input-item>>> .el-radio{
    margin-top: 10px;
  }
  .search-input{
    width: 120px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 255px);
  }
  .app-container>>> .el-checkbox{
    margin-left: 30px;
    display: block;
  }
  .app-container>>> .el-table .el-checkbox{
    margin-left: 0;
    display: block;
  }
  .import-dialog>>>.el-dialog__body{
    padding: 20px;
    padding-top: 10px;
  }
  .tab-control span{
    line-height: 50px;
  }
  .el-checkbox {
    margin-left: 0px;
  }
  .header-search-add >>>.el-input--prefix .el-input__inner {
    padding-left: 28px;
    padding-right: 18px;
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
    width: 220px;
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
  .app-container>>> .el-table th div {
    line-height: 34px !important;
    vertical-align: middle;
  }
  .fieldest{
    border: 1px solid #DCDFE6;
    padding: 10px;
  }
</style>
