<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 5px">
      <el-row>
        <div class="header-btn-group" >
          <el-button
            style="margin-top: 5px"
            size="small"
            type="primary"
            @click="mulSearchClick" ><svg-icon icon-class="pilcx" style="margin-right: 5px" />批量查询</el-button>
          <el-button
            style="margin-top: 5px"
            class="float-right"
            size="small"
            type="primary"
            icon="shezhilk"
            @click="selectThead" ><svg-icon icon-class="shezhilk" style="margin-right: 5px"/>设置显示列</el-button>
          <!--<el-button-->
          <!--style="margin-top: 5px"-->
          <!--class="float-right"-->
          <!--size="small"-->
          <!--type="primary"-->
          <!--@click="mulDownFile" ><svg-icon icon-class="pilxz" style="margin-right: 5px"/>批量下载</el-button>-->
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
            <span class="input-title" style="width: 50px">批次号</span>
            <el-input v-model="searchKeys.LotNo" class="search-input" placeholder="请输入批次号" size="small" maxlength="50" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">外延机台</span>
            <el-select v-model="searchKeys.wyjt" style="width: 140px" multiple collapse-tags class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in machineList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">产品代码</span>
            <el-select v-model="searchKeys.cpdm" style="width: 190px" multiple collapse-tags class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in productCodeList"
                :key="item.code"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 35px">光色</span>
            <el-select v-model="searchKeys.gs" style="width: 140px" multiple collapse-tags class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in colorList"
                :key="item.color"
                :label="item.color"
                :value="item.color"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 35px">型号</span>
            <el-select v-model="searchKeys.bx" style="width: 140px" multiple collapse-tags class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in modelList"
                :key="item.code"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 35px">工艺</span>
            <el-select v-model="searchKeys.gy" style="width: 140px" multiple collapse-tags class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in craftOptions"
                :key="item.code"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 35px">电极</span>
            <el-select v-model="searchKeys.dj" style="width: 140px" multiple collapse-tags class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in electrodeList"
                :key="item.name"
                :label="item.name"
                :value="item.name"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">测试类型</span>
            <el-select v-model="searchKeys.cslx" multiple collapse-tags class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in categoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">WaferID</span>
            <el-input v-model="searchKeys.WaferNo" style="width: 210px" class="search-input" placeholder="请输入WaferID" size="small" maxlength="50" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 35px">尺寸</span>
            <el-select v-model="searchKeys.cc" style="width: 80px" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in substrateMeasureList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 70px">COW机台</span>
            <el-select v-model="searchKeys.cowjt" style="width: 200px" multiple collapse-tags class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in cowMachineList"
                :key="item.id"
                :label="item.code"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">判断结果</span>
            <el-select v-model="searchKeys.pdjg" style="width: 80px" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in resultOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div style="float: left; height: 46px;">
            <div class="input-item" style="margin-right: 20px;margin-left: 10px">
              <el-radio-group v-model="timeRadio">
                <el-radio :label="0">导入时间</el-radio>
                <el-radio :label="2">测试时间</el-radio>
              </el-radio-group>
            </div>
            <div class="input-item">
              <el-date-picker
                v-model="beginDate"
                :picker-options="pickerOptionsStart"
                :editable="false"
                class="search-input"
                style="width: 165px;"
                size="small"
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
                style="width: 165px;"
                size="small"
                type="datetime"
                placeholder="结束日期"
                value-format="timestamp"
                format="yyyy-MM-dd HH:mm"
              />
            </div>
          </div>
          <div class="input-item" style="margin-top: 20px">
            <el-checkbox v-model="control">控制片</el-checkbox>
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
        </el-col>
      </el-row>
    </div>
    <div class="app-container">
      <div v-if="selectTheadVisble" class="select-thead">
        <div class="options-box">
          <el-checkbox-group v-model="checkboxVal">
            <el-checkbox v-for="option in formTheadOptions" :label="option" :key="option">
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
        :cell-style="cellStyle"
        height="calc(100vh - 430px)"
        element-loading-text="拼命加载中"
        class="broad-scrollbar-table"
        border
        fit
        @sort-change="sortChange"
      >
        <el-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="判定结果" width="100" fixed>
          <template slot-scope="scope">
            <div v-if="scope.row.decisionResults === 0">未判定</div>
            <div v-if="scope.row.decisionResults === 1">YES</div>
            <div v-if="scope.row.decisionResults === 2">NO</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="测试类型" width="100" prop="testType" fixed/>
        <el-table-column align="center" label="批次号" width="200" prop="lotNo" sortable="custom" fixed show-overflow-tooltip/>
        <el-table-column align="center" label="WaferID" width="200" prop="waferNo" sortable="custom" fixed show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.unFind === 1 " style="color: #e35c5c" >{{ scope.row.waferNo }}</div>
            <div v-else >{{ scope.row.waferNo }}</div>
          </template>
        </el-table-column>
        <el-table-column v-for="item in formThead" :key="item.thName" :label="item.thName" :prop="item.thKey" :width="item.thWidth" sortable="custom" align="center" show-overflow-tooltip/>
        <el-table-column align="center" label="原始文件" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <div style="color: #009494;text-decoration: underline;cursor: pointer;" @click="downLoad(scope.row)">查看详情</div>
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
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="downFileVisble"
      class="padding-dialog"
      title="文件下载"
      width="700px"
    >
      <el-table
        :data="fileList"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="文件名" align="center" prop="fileName"/>
        <el-table-column label="操作" align="center" prop="status" width="100">
          <template slot-scope="scope">
            <div style="color: #009494;text-decoration: underline;cursor: pointer;" @click="downLoadFile(scope.row.filePath)">点击下载</div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      title="批量查询"
      width="500px"
      @close="handleClose('mulForm')">
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
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .app-container>>> .cell{
    line-height: 37px;
  }
  .app-container>>> td{
    height: 37px;
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
    width: 180px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 353px);
  }
  .app-container>>> .el-checkbox{
    margin-left: 30px;
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
</style>
