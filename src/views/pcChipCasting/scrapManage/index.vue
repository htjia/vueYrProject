<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto">
      <div class="header-btn-group" style="height: 50px;">
        <el-button
          size="small"
          type="primary"
          @click="checkAudit"
        ><svg-icon icon-class="print"/> 报废片入库</el-button>
      </div>
      <div class="search-box">
        <div class="left-search-box">
          <div class="input-item">
            <span class="input-title">WaferID </span>
            <el-input v-model="batchNo" class="search-input" placeholder="请输入批号" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">产品型号 </span>
            <el-select v-model="productModel" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in productLists"
                :key="item.id"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">所属工序 </span>
            <el-select v-model="productModel" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in productLists"
                :key="item.id"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">责任部门 </span>
            <el-select v-model="productModel" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in productLists"
                :key="item.id"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">入库时间 </span>
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
            <span class="input-title">批号 </span>
            <el-input v-model="waferNo" class="search-input" placeholder="请输入片号" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">生产类型 </span>
            <el-select v-model="productModel" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in productLists"
                :key="item.id"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">所属机台 </span>
            <el-select v-model="productModel" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in productLists"
                :key="item.id"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">是否有实物 </span>
            <el-select v-model="productModel" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in productLists"
                :key="item.id"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </div>
        </div>
        <div class="right-btn-box">
          <el-button
            class="float-right margin-top margin-left"
            size="small"
            type="danger"
            @click="clearCondition"
          >
            <svg-icon icon-class="clear"/> 重 置
          </el-button>
          <el-button
            class="float-right margin-top"
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="handleSearch" >查 询</el-button>
        </div>
      </div>
    </div>
    <div class="app-container">
      <div class="table-top-btn-group">
        <div class="active">
          报废片明细
        </div>
      </div>
      <!--单据信息-->
      <el-table
        v-loading="listLoading"
        v-show="isActive === 0"
        ref="listTabel"
        :data="list"
        class="mocvd-table run-table"
        element-loading-text="拼命加载中"
        height="calc(100vh - 380px)"
        highlight-current-row
        border
        fit
        @current-change="handleCurrentChange"
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
          </template>
        </el-table-column>
        <el-table-column label="WaferID" align="center" prop="billNo"/>
        <el-table-column label="批号" align="center" prop="editionType" width="100"/>
        <el-table-column label="片号" align="center" prop="structureType" width="100"/>
        <el-table-column label="衬底号" align="center" prop="substrateType" width="100"/>
        <el-table-column label="产品型号" align="center" prop="substrateType" width="100"/>
        <el-table-column label="衬底号" align="center" prop="substrateType" width="100"/>
        <el-table-column label="版型" align="center" prop="operation" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.operation === '0'">送片</span>
            <span v-if="scope.row.operation === '1'">送样</span>
            <span v-if="scope.row.operation === '2'">破坏测试</span>
          </template>
        </el-table-column>
        <el-table-column label="数量(片)" align="center" prop="creatorName"/>
        <el-table-column label="发生工序" align="center" prop="createTime" width="150" show-overflow-tooltip/>
        <el-table-column label="发生机台" align="center" prop="takerName"/>
        <el-table-column label="报废原因" align="center" prop="takerTime" width="150" show-overflow-tooltip/>
        <el-table-column label="责任部门" align="center" prop="auditResult">
          <template slot-scope="scope">
            <span v-if="scope.row.auditResult === '1'">通过</span>
            <span v-if="scope.row.auditResult === '0'">不通过</span>
            <span v-if="scope.row.auditResult === '2'">待审核</span>
          </template>
        </el-table-column>
        <el-table-column label="责任人" align="center" prop="auditorName" show-overflow-tooltip=""/>
        <el-table-column label="判定人" align="center" prop="auditTime" width="150px" show-overflow-tooltip=""/>
        <el-table-column label="判定时间" align="center" prop="auditTime" width="150px" show-overflow-tooltip=""/>
        <el-table-column label="接收人" align="center" prop="auditTime" width="150px" show-overflow-tooltip=""/>
        <el-table-column label="接收时间" align="center" prop="auditTime" width="150px" show-overflow-tooltip=""/>
        <el-table-column label="借片人" align="center" prop="auditTime" width="150px" show-overflow-tooltip=""/>
        <el-table-column label="借片时间" align="center" prop="auditTime" width="150px" show-overflow-tooltip=""/>
        <el-table-column label="备注" align="center" prop="remark" width="120px" show-overflow-tooltip=""/>
        <el-table-column label="返回时间" align="center" prop="auditTime" width="150px" show-overflow-tooltip=""/>
        <el-table-column label="是否有实物" align="center" prop="auditTime" width="150px" show-overflow-tooltip=""/>
        <el-table-column label="操作" align="center" prop="status">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-delete"
              type="primary"
              @click="handleJP(scope.$index)"
            >借片</el-button>
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
      title="报废片入库"
      width="1200px"
      class="tip-out-inner-dialog">
      <el-row>
        <el-col :span="24">
          <div class="input-item">
            <span class="input-title" style="width:35px">WaferID </span>
            <el-input v-model="sigleNo" class="search-input style-input" style="width: 122px !important" placeholder="请输入单号" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title" style="width:65px">批号 </span>
            <el-input v-model="productNo" class="search-input style-input" style="width:130px" placeholder="请输入产品型号" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title" style="width:65px">生产类型 </span>
            <el-select v-model="tpType" class="search-input style-input" style="width: 90px !important;" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in categoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width:65px">产品型号 </span>
            <el-select v-model="tpType" class="search-input style-input" style="width: 90px !important;" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in categoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <el-button
              size="small"
              type="primary"
              @click="handleSearchLog"
            ><svg-icon icon-class="importRecords"/> 查询</el-button>
          </div>
          <div class="input-item">
            <el-button
              size="small"
              type="primary"
              @click="handleSearchLog"
            ><svg-icon icon-class="importRecords"/> 重置</el-button>
          </div>
        </el-col>
      </el-row>
      <el-table
        v-loading="listLoading"
        :data="anotherlist"
        class="mocvd-table run-table"
        height="400px"
        element-loading-text="拼命加载中"
        border
        fit
        stripe
        @selection-change="handleSelectionChanges">
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column type="selection" label="选择入库" width="55"/>
        <el-table-column label="WaferID" align="center" prop="waferId" width="120"/>
        <el-table-column label="批号" align="center" prop="laserMark" width="120"/>
        <el-table-column label="片号" align="center" prop="frontSubstrate"/>
        <el-table-column label="衬底号" align="center" prop="frontSubstrate"/>
        <el-table-column label="产品型号" align="center" prop="frontSubstrate"/>
        <el-table-column label="投片类型" align="center" prop="visualLevelCode"/>
        <el-table-column label="版型" align="center" prop="isControl">
          <template slot-scope="scope">
            <span v-if="scope.row.isControl === '1'">否</span>
            <span v-if="scope.row.isControl === '0'">是</span>
          </template>
        </el-table-column>
        <el-table-column label="数量(片)" align="center" prop="remark" width="120"/>
        <el-table-column label="发生工序" align="center" prop="editionType" width="120"/>
        <el-table-column label="发生机台" align="center" prop="structureCode"/>
        <el-table-column label="报废原因" align="center" prop="substrateCode" width="120"/>
        <el-table-column label="责任部门" align="center" prop="substrateCode" width="120"/>
        <el-table-column label="责任人" align="center" prop="substrateCode" width="120"/>
        <el-table-column label="判定人" align="center" prop="substrateCode" width="120"/>
        <el-table-column label="判定时间" align="center" prop="substrateCode" width="120"/>
        <el-table-column label="是否有实物" align="center" prop="substrateCode" width="120"/>
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
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setsubmitForm('machineForm')">确 定</el-button>
        <el-button @click="setDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="报废片借片"
      width="500px">
      <div class="waferstyle">
        WaferID M-PW06BC9321051-01
      </div>
      <el-form ref="machineForm" :model="machineForm" :rules="rules" status-icon label-width="120px" label-position="right">
        <el-form-item label="借片人 " prop="yzpMin">
          <el-input v-model="machineForm.yzpMin" placeholder="请输入" maxlength="20"/>
        </el-form-item>
        <el-form-item label="借片时间 " prop="yzpMax">
          <el-input v-model="machineForm.yzpMax" placeholder="请输入" maxlength="20"/>
        </el-form-item>
        <el-form-item label="返回时间 " prop="otherMin">
          <el-input v-model="machineForm.otherMin" placeholder="请输入" maxlength="20"/>
        </el-form-item>
        <el-form-item label="备注 " prop="otherMax">
          <el-input v-model="machineForm.otherMax" placeholder="请输入" maxlength="20"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setsubmitForm('machineForm')">确 定</el-button>
        <el-button @click="setDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .waferstyle{
    margin-bottom: 15px;
    margin-left: 117px;
    font-weight: bold;
  }
  .fieldest{
    border: 1px solid #DCDFE6;
    padding-bottom: 15px;
  }
  .legendsty{
    padding-left:8px;
    padding-right:8px;
    font-weight: bold;
  }
  .tip-out-inner-dialog>>>.el-checkbox{
    margin-left: 20px;
  }
  .normalReasom{
    border: 0px;
    color: #009494;
    cursor: pointer;
  }
  .normalReasom:hover{
    color: #009688;
  }
  .firstRow{
    padding-bottom: 15px;
    margin-bottom: 15px;
    border-bottom: 1px solid #DCDFE6;
  }
  .setTree{
    padding: 15px;
    border: 1px solid #DCDFE6;
    margin-top: 15px;
    height: 425px;
    overflow: auto;
  }
  .getCalss{
    padding: 15px;
  }
  .setInner {
    padding:10px;
    color: #333;
  }
  .buttonType {
    background: #1abb9d;
    color: #fff;
    font-size: 16px;
  }
  .buttonType1 {
    font-size: 15px;
    float: right;
    height: 35px;
    border: 0px;
    padding: 0;
    margin-right: 15px;
    color:#009494;
  }
  .buttonType1:hover{
    color:#009688;
    background-color: #fff;
  }
  .leftType{
    float: left;
    height: 35px;
    margin-left: 15px;
    padding-top: 8px;
    margin-right: 15px;
  }
  .spanColor{
    font-size: 16px;
    font-weight: bold;
    margin-right: 15px;
  }
  .tableTitle{
    width: 100%;
    font-weight: bold;
    font-size: 15px;
    padding-left: 30px;
    margin-bottom: -15px;
    z-index: 99;
    position: relative;
  }
  .input-title{
    width: 65px;
    line-height: 30px;
  }
  .setTitle{
    background: #fff;
    width: 85px;
    text-align: center;
  }
  .set-border{
    border: 1px solid #DCDFE6;
    padding-top: 20px;
    padding-bottom: 0px;
    margin: 5px;
    height: 650px;
    padding: 20px 10px 10px 10px;
  }
  .set-borders{
    border: 1px solid #DCDFE6;
    padding-top: 20px;
    padding-bottom: 0px;
    margin: 5px;
    padding: 20px 10px 10px 10px;
  }
  .input-item{
    float: left;
    margin-top: 14px;
    margin-right: 10px;
  }
  .search-box{
    display: flex;
    flex-direction: row;
  }
  .left-search-box{
    flex-grow: 1;
  }
  .right-btn-box{
    width: 210px;
  }
  .search-input{
    width: 155px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 268px);
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
  .table-top-btn-group>div.active{
    color: #fff;
    background: #009494;
    border-color: #009494;
  }
  .checkstr{
    word-wrap: break-word;
    word-break: break-all;
    overflow: auto;
    line-height: 25px;
    height: 350px;
  }
  .parameter-table>>>.el-table .set_green td{
    background-color: #E35C5C;
    color: #fff;
  }
  .statuType{
    text-align: center;
    font-size: 30px;
    padding: 15px;
    color: #009494;
    font-weight: bold;
    border-bottom: 1px solid #E5E5E5;
  }
  .statuType1{
    text-align: center;
    font-size: 30px;
    padding: 15px;
    color: #E35C5C;
    font-weight: bold;
    border-bottom: 1px solid #E5E5E5;
  }
  .run-table ::-webkit-scrollbar {/*滚动条整体样式*/
    height: 10px !important;
  }
  .app-container>>> .el-table--border {
    border-top: 2px solid #009494;
  }
  .tip-out-inner-dialog>>>.el-dialog__body{
    padding-bottom: 15px;
  }
</style>
