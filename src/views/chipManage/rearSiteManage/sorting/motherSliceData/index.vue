<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top:0">
      <el-row>
        <el-col :span="20">
          <div class="input-item">
            <span class="input-title">WaferID </span>
            <el-input v-model="waferNo" class="search-input" style="width:300px" placeholder="请输入WaferID" size="small" maxlength="100" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">分选机台</span>
            <el-select v-model="machine" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in machineList"
                :key="item.id"
                :label="item.name"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">状态 </span>
            <el-select v-model="status" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in statusList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">分选时间</span>
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
          </div>
        </el-col>
        <el-col :span="4">
          <el-button
            class="float-right margin-top"
            style="margin-left:15px"
            size="small"
            type="danger"
            @click="clearSearch"
          >
            <svg-icon icon-class="clear"/> 重 置
          </el-button>
          <el-button
            class="float-right margin-top"
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="handleSearch" >查 询</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="app-container">
      <div v-if="selectTheadVisble" class="select-thead">
        <div class="options-box">
          <el-checkbox-group v-model="checkboxVal">
            <el-checkbox v-for="(option, index) in formTheadOptions" :key="index" :label="option" style="width: 160px;margin-left: 15px;margin: 5px;">
              {{ option.thName }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <el-button type="primary" size="mini" style="margin-left: 25px" @click="submitOption">确 定</el-button>
        <el-button size="mini" @click="selectTheadVisble = false">取 消</el-button>
      </div>
      <div style="line-height: 40px;">
        &nbsp;
        <el-button type="text" class="select-thead-btn" @click="selectThead"><svg-icon icon-class="shezhi"/> 设置显示列</el-button>
        <el-button type="text" class="select-thead-btn" style="right:30px" icon="el-icon-sold-out" @click="importExcel">导出</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        class="run-table"
        element-loading-text="拼命加载中"
        height="calc(100vh - 318px)"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
          </template>
        </el-table-column>
        <el-table-column v-for="item in formThead" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="item.thKey==='status'&&scope.row[item.thKey]===0">分选中</span>
            <span v-if="item.thKey==='status'&&scope.row[item.thKey]===1">分选完成</span>
            <span v-if="item.thKey==='mother'">
              <div style="color: #009494;font-weight: bold;cursor: pointer;text-decoration:underline" @click="findMather(scope.row)">详情</div>
            </span>
            <span v-if="item.thKey==='info'">
              <div style="color: #009494;font-weight: bold;cursor: pointer;text-decoration:underline" @click="download(scope.row)">文档</div>
            </span>
            <span v-if="item.thKey==='sortRate'||item.thKey==='packRate'">
              {{ scope.row[item.thKey] }}%
            </span>
            <span v-if="item.thKey!=='status'&&item.thKey!=='mother'&&item.thKey!=='info'&&item.thKey!=='sortRate'&&item.thKey!=='packRate'">
              {{ scope.row[item.thKey] }}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="pageNum"
        :page-sizes="[12, 30, 40]"
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
      :visible.sync="addDialogVisible"
      title="分选详情"
      class="import-dialog"
      width="800px">
      <el-table
        v-loading="listLoading"
        :data="motherList"
        :summary-method="getSummaries"
        show-summary
        element-loading-text="拼命加载中"
        border
        fit
      >
        <el-table-column align="center" label="序号">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="ChipNo" align="center">
          <template slot-scope="scope">
            <a class="primarya" @click="openUrl(scope.row)"> {{ scope.row.binNo }}</a>
          </template>
        </el-table-column>
        <el-table-column label="颗粒数" align="center" prop="graspNo"/>
        <el-table-column label="方片状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1">待回测</span>
            <span v-if="scope.row.status === 2">待清洗</span>
            <span v-if="scope.row.status === 3">待目检</span>
            <span v-if="scope.row.status === 4">待入库</span>
            <span v-if="scope.row.status === 5">入库完成</span>
            <span v-if="scope.row.status === 6">已出库</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .import-dialog>>>.el-dialog__body{
    padding: 20px;
    padding-top: 10px;
  }
  .primarya{
    color:#009494;
    text-decoration:underline;
  }
  .deleteBtn{
    font-size: 30px;
    color: #d56c28;
    cursor: pointer;
    float: right;
    margin-right: 15px;
    margin-top: 5px;
  }
  .addBtn{
    transform: translateX(-50%);
    font-size: 30px;
    color: #009494;
    cursor: pointer;
    float: right;
    margin-right: 0px;
    margin-top: 5px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 201px);
  }
  .options-box{
    height: 280px;
    overflow: auto;
    margin-bottom: 10px;
  }
  .select-thead-btn{
    height: 42px;
    position: absolute;
    z-index: 200;
    right: 110px;
    top: 15px;
    border: 0px;
  }
  .select-thead-btn:hover{
    color: #009688;
    background: transparent;
    border: 0px;
  }
  .select-thead-btn:focus{
    color: #009688;
    background: transparent;
    border: 0px;
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
  .tab-control span{
    line-height: 50px;
  }
  .el-checkbox {
    margin-left: 0px;
  }
  .search-box{
    display: flex;
    flex-direction: row;
  }
  .left-search-box{
    flex-grow: 1;
  }
  .right-btn-box{
    width: 260px;
  }
  .input-item{
    float: left;
    margin-top: 15px;
    margin-right: 10px;
  }
  .search-input{
    width: 150px;
  }
  .run-table ::-webkit-scrollbar {/*滚动条整体样式*/
    height: 10px !important;
  }
</style>
