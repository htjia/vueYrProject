<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0">
      <div class="search-box">
        <div class="left-search-box">
          <div class="input-item">
            <span class="input-title">WaferID </span>
            <el-input v-model="waferId" class="search-input" placeholder="请填写WaferID" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">操作人 </span>
            <el-input v-model="operName" class="search-input" placeholder="请填写操作人" size="small" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">日期 </span>
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
          <div class="input-item">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-search"
              @click="handleSearch" >查询</el-button>
          </div>
          <div class="input-item">
            <el-button
              size="small"
              type="danger"
              @click="clearAll" ><svg-icon icon-class="clear"/> 重 置</el-button>
          </div>
        </div>
        <div class="right-btn-box">
          <el-button
            style="margin-top: 15px"
            class="float-right margin-left"
            size="small"
            type="primary"
            @click="exportAll"><svg-icon icon-class="export"/> 导出</el-button>
          <el-button
            style="margin-top: 15px"
            class="float-right"
            size="small"
            type="primary"
            icon="el-icon-edit"
            @click="editSubstrate" >镭刻号修改</el-button>
        </div>
      </div>
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        height="calc(100vh - 281px)"
        class="run-table"
        highlight-current-row
        border
        fit
        @current-change="handleCurrentChange">
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
          </template>
        </el-table-column>
        <el-table-column label="WaferID" align="center" prop="waferId" width="130"/>
        <el-table-column label="操作时间" align="center" prop="operateTime" width="160"/>
        <el-table-column label="操作人" align="center" prop="operatorName" width="150"/>
        <el-table-column label="修改时状态" align="center" prop="status" width="130">
          <template slot-scope="scope">
            <span v-if="scope.row.status === '0'">衬底投片</span>
            <span v-if="scope.row.status === '1'">生长完成</span>
            <span v-if="scope.row.status === '2'">待补长</span>
            <span v-if="scope.row.status === '4'">目检完成</span>
            <span v-if="scope.row.status === '3'">测试完成</span>
            <span v-if="scope.row.status === '5'">目检测试完成</span>
            <span v-if="scope.row.status === '6'">COW数据返回</span>
            <span v-if="scope.row.status === '7'">已送验证片</span>
            <span v-if="scope.row.status === '8'">已入库</span>
          </template>
        </el-table-column>
        <el-table-column label="修改后镭刻号" align="center" prop="newNo" width="130"/>
        <el-table-column label="修改前镭刻号" align="center" prop="oldNo" width="130"/>
        <el-table-column label="批号(旧)" align="center" prop="lotNum" width="150"/>
        <el-table-column label="盒号(旧)" align="center" prop="boxNum" width="150"/>
        <el-table-column label="影响的表" align="center" prop="involveRangeName"/>
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
      v-drag
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="镭刻号修改"
      width="800px"
      class="edit-dialog">
      <div v-if="rowInfo !== null">
        <div class="title-postion">修改镭刻号</div>
        <div class="module-content set-border">
          <div>
            <span class="stsl input-title" style="margin-left: 15px;">WaferID </span>
            <el-input v-model="rowInfo.waferId" class="search-input" size="small" clearable maxlength="20" @keyup.native="findNewNo"/>
            <span class="input-title" style="margin-left: 15px;width:80px">现镭刻号 </span>
            <el-input v-model="rowInfo.newNo" :disabled="true" class="search-input" size="small" maxlength="20" clearable/>
            <span class="stsl input-title" style="margin-left: 15px;width:80px">新镭刻号 </span>
            <el-input v-model="rowInfo.newsNo" class="search-input" size="small" maxlength="20" clearable/>
          </div>
          <div style="margin-top: 15px;margin-bottom: 15px;">
            <div class="input-title" style="height: 55px;">备注 </div>
            <el-input v-model="rowInfo.remark" type="textarea" placeholder="请输入备注" maxlength="50" style="width: 643px;"/>
          </div>
        </div>
        <div class="title-postion">影响的表</div>
        <div class="module-content set-border">
          <el-checkbox-group v-model="checkList" style="margin-top: 10px;margin-bottom: 20px;">
            <el-checkbox label="外延生产"/>
            <el-checkbox label="外延仓库"/>
            <el-checkbox label="外延品保"/>
            <el-checkbox label="芯片生产"/>
            <el-checkbox label="芯片品保"/>
            <el-checkbox label="芯片仓库"/>
          </el-checkbox-group>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="isDisabled" type="primary" @click="submitForm()">确 定</el-button>
        <el-button @click="resetForm()">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
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
  .right-btn-box{
    width: 260px;
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
  .run-table ::-webkit-scrollbar {/*滚动条整体样式*/
    height: 10px !important;
  }
  .stsl::before{
    content: '*';
    color: #F56C6C;
    margin-right: 4px;
  }
</style>
