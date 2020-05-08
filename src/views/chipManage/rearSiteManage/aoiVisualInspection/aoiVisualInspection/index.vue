<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 5px">
      <div class="input-item">
        <span class="input-title" style="width: 40px">片号</span>
        <el-input v-model="searchKeys.ph" class="search-input" placeholder="请输入片号" size="small" maxlength="50" clearable/>
      </div>
      <div class="input-item">
        <span class="input-title">产品代码</span>
        <el-select v-model="searchKeys.cpdm" class="search-input" style="width: 140px" size="small" placeholder="请选择" clearable filterable>
          <el-option
            v-for="item in productCodeList"
            :key="item.id"
            :label="item.code"
            :value="item.id"/>
        </el-select>
      </div>
      <div class="input-item">
        <span class="input-title">机台号</span>
        <el-select v-model="searchKeys.jth" class="search-input" style="width: 140px" size="small" placeholder="请选择" filterable clearable>
          <el-option
            v-for="item in cowMachineList"
            :key="item.id"
            :label="item.code"
            :value="item.id"/>
        </el-select>
      </div>
      <div>
        <div class="input-item">
          <span class="input-title" style="width: 40px">状态</span>
          <el-select v-model="searchKeys.status" class="search-input" style="width: 140px" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in statusOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
          <span class="input-title" style="width: 40px">时间</span>
          <el-date-picker
            v-model="beginDate"
            :picker-options="pickerOptionsStart"
            :editable="false"
            class="search-input"
            size="small"
            style="width: 130px"
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
            style="width: 130px"
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
            size="small"
            type="danger"
            @click="clearSearch"
          >
            <svg-icon icon-class="clear"/> 重 置
          </el-button>
        </div>
      </div>
      <el-button
        class="float-right margin-top margin-left"
        size="small"
        type="primary"
        @click="exportExcel"
      >
        <svg-icon icon-class="export"/> 导 出
      </el-button>
      <el-button
        class="float-right margin-top"
        size="small"
        type="primary"
        @click="selectThead" ><svg-icon icon-class="shezhilk"/> 设置显示列</el-button>
      <div class="clear-both"/>
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
        height="calc(100vh - 342px)"
        class="broad-scrollbar-table"
        element-loading-text="拼命加载中"
        border
      >
        <el-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" width="120" fixed>
          <template slot-scope="scope">
            <div v-if="scope.row.status === 0">待AOI</div>
            <div v-if="scope.row.status === 1">已检验</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="片号" prop="waferNo" width="300" show-overflow-tooltip fixed/>
        <el-table-column v-for="item in formThead" :key="item.thName" :label="item.thName" :render-header="labelHead" align="center" min-width="180px" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[item.thKey] }}
          </template>
        </el-table-column>
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
  .input-title-short{
    width: 50px;
    font-weight: bold;
    padding-right: 5px;
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
    width: 200px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 255px);
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
    width: 420px;
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
</style>
