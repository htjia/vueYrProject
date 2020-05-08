<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top:0">
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
            @click="importExcel" ><svg-icon icon-class="daochu_1" style="margin-right: 5px"/>导 出</el-button>
        </div>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="input-item">
            <span class="input-title">ChipNo </span>
            <el-input v-model="binNo" class="search-input" style="width:200px" placeholder="请输入ChipNo" size="small" maxlength="100" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">分选机台</span>
            <el-select v-model="machine" class="search-input" style="width: 80px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in machineList"
                :key="item.id"
                :label="item.name"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">产品代码 </span>
            <el-select v-model="productCode" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in productLists"
                :key="item.id"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width:35px">状态 </span>
            <el-select v-model="status" class="search-input" style="width: 100px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in statusList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item" style="margin-left:20px">
            <el-radio v-model="type" label="0">下Bin时间</el-radio>
            <el-radio v-model="type" label="1">导入时间</el-radio>
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
          <div style="float: left; margin-left: 15px">
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
            <el-checkbox v-for="(option, index) in formTheadOptions" :key="index" :label="option" :disabled="index<2" style="width: 180px;margin-left: 15px;margin: 5px;">
              {{ option.thName }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <el-button type="primary" size="mini" style="margin-left: 25px" @click="submitOption">确 定</el-button>
        <el-button size="mini" @click="selectTheadVisble = false">取 消</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        class="broad-scrollbar-table"
        height="calc(100vh - 327px)"
        border
        fit>
        <el-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="ChipNo" width="200" prop="binNo" fixed>
          <template slot-scope="scope">
            <div v-if="scope.row.unFind === 1 " style="color: #e35c5c" >{{ scope.row.binNo }}</div>
            <div v-else >{{ scope.row.binNo }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" width="90" fixed>
          <template slot-scope="scope">
            <span v-if="scope.row.status===1">待回测</span>
            <span v-if="scope.row.status===2">待清洗</span>
            <span v-if="scope.row.status===3">待目检</span>
            <span v-if="scope.row.status===4">待入库</span>
            <span v-if="scope.row.status===5">入库完成</span>
            <span v-if="scope.row.status===6">已出库</span>
          </template>
        </el-table-column>
        <el-table-column v-for="item in formThead" :key="item.thName" :label="item.thName" :width="item.width" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="item.thKey==='status'&&scope.row[item.thKey]===1">待回测</span>
            <span v-if="item.thKey==='status'&&scope.row[item.thKey]===2">待清洗</span>
            <span v-if="item.thKey==='status'&&scope.row[item.thKey]===3">待目检</span>
            <span v-if="item.thKey==='status'&&scope.row[item.thKey]===4">待入库</span>
            <span v-if="item.thKey==='status'&&scope.row[item.thKey]===5">入库完成</span>
            <span v-if="item.thKey==='status'&&scope.row[item.thKey]===6">已出库</span>
            <span v-if="item.thKey==='mother'">
              <div style="color: #009494;font-weight: bold;cursor: pointer;text-decoration:underline" @click="findMather(scope.row)">详情</div>
            </span>
            <span v-if="item.thKey==='info'">
              <div style="color: #009494;font-weight: bold;cursor: pointer;text-decoration:underline" @click="download(scope.row)">文档</div>
            </span>
            <span v-if="item.thKey!=='status'&&item.thKey!=='mother'&&item.thKey!=='info'&&item.thKey!=='binNo'&&item.thKey!=='binType'&&item.thKey!=='productCode'&&item.thKey!=='binTime'&&item.thKey!=='barcode'&&item.thKey!=='allTotal'&&item.thKey!=='binCount'&&item.thKey!=='importTime'&&item.thKey!=='machine'">
              {{ parseFloat(scope.row[item.thKey]+'').toFixed(2) }}
            </span>
            <span v-if="item.thKey==='binNo'||item.thKey==='binType'||item.thKey==='productCode'||item.thKey==='binTime'||item.thKey==='barcode'||item.thKey==='allTotal'||item.thKey==='binCount'||item.thKey==='importTime'||item.thKey==='machine'">
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
      title="母片详情"
      class="import-dialog"
      width="800px">
      <el-table
        v-loading="listLoading"
        :data="motherList"
        :summary-method="getSummaries"
        show-summary
        element-loading-text="拼命加载中"
        class="run-table"
        border
        fit>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="母片ID" align="center">
          <template slot-scope="scope">
            <a class="primarya" @click="openUrl(scope.row)"> {{ scope.row.waferNo }}</a>
          </template>
        </el-table-column>
        <el-table-column label="颗粒数" align="center" prop="graspNo"/>
        <el-table-column label="母片状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">分选中</span>
            <span v-if="scope.row.status === 1">分选完成</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="mulQueryDialogVisible"
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
  .primarya{
    color:#009494;
    text-decoration:underline;
  }
  .import-dialog>>>.el-dialog__body{
    padding: 20px;
    padding-top: 10px;
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
    height: calc(100vh - 250px);
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
