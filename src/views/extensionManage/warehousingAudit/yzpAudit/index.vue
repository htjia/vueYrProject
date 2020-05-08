<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto">
      <div class="header-btn-group" style="height: 50px;">
        <el-button
          size="small"
          type="primary"
          @click="checkAudit"
        ><svg-icon icon-class="rukedansh"/> 品保审核</el-button>
        <el-button
          size="small"
          style="margin-left: 15px;"
          type="primary"
          @click="report"
        ><svg-icon icon-class="baobiaofenx"/> 报表</el-button>
        <el-button
          size="small"
          style="margin-left: 15px;"
          type="primary"
          @click="importExcel"
        ><svg-icon icon-class="export"/> 导出</el-button>
      </div>
      <div class="search-box">
        <div class="left-search-box">
          <div class="input-item">
            <span class="input-title" style="width:35px">单号 </span>
            <el-input v-model="billNo" class="search-input" placeholder="请输入单号" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title" style="width:60px">WaferID </span>
            <el-input v-model="waferId" class="search-input" style="width: 190px" placeholder="请输入WaferID" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title" style="width:65px">完成状态 </span>
            <el-select v-model="auditResult" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in examineSelectOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width:65px">导入时间 </span>
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
        <div
          :class="{'active':isActive === 0}"
          @click="navClick(0)"
        >
          单据信息
        </div>
        <div
          :class="{'active':isActive === 1}"
          @click="navClick(1)"
        >
          明细TOL: <span v-text="anothertotalPage"/>
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
        height="calc(100vh - 382px)"
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
        <el-table-column label="单号" align="center" prop="billNo" width="120" show-overflow-tooltip/>
        <el-table-column label="版型" align="center" prop="editionType" width="100"/>
        <el-table-column label="结构类型" align="center" prop="structureType" width="100"/>
        <el-table-column label="衬底工艺" align="center" prop="substrateType" width="100"/>
        <el-table-column label="单据状态" align="center" prop="operation" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.operation === '0'">送片</span>
            <span v-if="scope.row.operation === '1'">送样</span>
            <span v-if="scope.row.operation === '2'">破坏测试</span>
          </template>
        </el-table-column>
        <el-table-column label="送片人" align="center" prop="creatorName"/>
        <el-table-column label="送片日期" align="center" prop="createTime" width="150" show-overflow-tooltip/>
        <el-table-column label="收片人" align="center" prop="takerName"/>
        <el-table-column label="收片日期" align="center" prop="takerTime" width="150" show-overflow-tooltip/>
        <el-table-column label="审核状态" align="center" prop="auditResult">
          <template slot-scope="scope">
            <span v-if="scope.row.auditResult === '1'" style="color: #009494;font-weight: bold">通过</span>
            <span v-if="scope.row.auditResult === '0'" style="color: #f33;font-weight: bold">不通过</span>
            <span v-if="scope.row.auditResult === '2'" style="color:#1C84C6;font-weight: bold">待审核</span>
          </template>
        </el-table-column>
        <el-table-column label="审核人" align="center" prop="auditorName" show-overflow-tooltip=""/>
        <el-table-column label="审核日期" align="center" prop="auditTime" width="150px" show-overflow-tooltip=""/>
        <el-table-column label="备注" align="center" prop="remark" width="120px" show-overflow-tooltip=""/>
      </el-table>
      <!--wafer信息-->
      <el-table
        v-loading="listLoading"
        v-show="isActive === 1"
        :data="anotherlist"
        class="mocvd-table run-table"
        height="calc(100vh - 335px)"
        element-loading-text="拼命加载中"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="RunID" align="center" prop="runId"/>
        <el-table-column label="WaferID" align="center" prop="waferId"/>
        <el-table-column label="镭刻号" align="center" prop="laserMark"/>
        <el-table-column label="正面衬底" align="center" prop="frontSubstrate"/>
        <el-table-column label="目检" align="center" prop="visualLevelCode" width="90"/>
        <el-table-column label="波长" align="center" prop="wavelength" width="90"/>
        <el-table-column label="STD" align="center" prop="std" width="90"/>
        <el-table-column label="控制片" align="center" prop="isControl" width="90">
          <template slot-scope="scope">
            <span v-if="scope.row.isControl === '1'">否</span>
            <span v-if="scope.row.isControl === '0'">是</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" width="150"/>
      </el-table>
      <el-pagination
        v-show="isActive === 0"
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
      title="品保审核"
      width="1200px"
      class="tip-out-inner-dialog">
      <fieldset class="fieldest">
        <legend class="legendsty"> 单据信息 </legend>
        <el-row>
          <el-col :span="5">
            <div class="input-item">
              <span class="input-title">单号 </span>
              <el-input v-model="rowInfos.billNo" :disabled="true" class="search-input" style="width:140px" placeholder="" size="small" maxlength="20" clearable/>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="input-item">
              <span class="input-title">版型 </span>
              <el-input v-model="rowInfos.editionType" :disabled="true" class="search-input" style="width:130px" placeholder="" size="small" maxlength="20" clearable/>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="input-item">
              <span class="input-title">衬底工艺 </span>
              <el-input v-model="rowInfos.substrateType" :disabled="true" class="search-input" placeholder="" size="small" maxlength="20" clearable/>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="input-item">
              <span class="input-title">结构类型 </span>
              <el-input v-model="rowInfos.structureType" :disabled="true" class="search-input" placeholder="" size="small" maxlength="20" clearable/>
            </div>
          </el-col>
          <el-col :span="2" style="text-align: right;">
            <el-button v-if="rowInfos.auditResults !=='1'" :disabled="isDisabled" type="primary" size="small" style="margin-top: 13px;" icon="el-icon-check" @click="qualityAssuranceAudit(1)">通 过</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <div class="input-item">
              <span class="input-title">送片人 </span>
              <el-input v-model="rowInfos.creatorName" :disabled="true" class="search-input" style="width:130px" placeholder="" size="small" maxlength="20" clearable/>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="input-item">
              <span class="input-title">操作 </span>
              <el-input v-model="rowInfos.operationName" :disabled="true" class="search-input" style="width:130px" placeholder="" size="small" maxlength="20" clearable/>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="input-item">
              <span class="input-title">送片日期 </span>
              <el-input v-model="rowInfos.createTime" :disabled="true" class="search-input" style="width:170px" placeholder="" size="small" maxlength="20" clearable/>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="input-item">
              <span class="input-title">备注 </span>
              <el-input v-model="rowInfos.remark" :disabled="true" maxlength="50" size="small" class="tip-out-input1" style="width: 160px;"/>
            </div>
          </el-col>
          <el-col :span="2" style="text-align: right;">
            <el-button v-if="rowInfos.auditResults !=='1'" type="danger" style="margin-top: 13px;width: 77px;" icon="el-icon-close" size="small" @click="qualityAssuranceAudit(0)">不通过</el-button>
            <el-button v-if="rowInfos.auditResults !=='2'" type="primary" style="margin-top: 13px;width: 77px;" size="small" @click="checkBack()"><svg-icon icon-class="fanshen"/> 反 审</el-button>
          </el-col>
        </el-row>
      </fieldset>
      <fieldset class="fieldest" style="margin: 15px 0">
        <legend class="legendsty"> 审核信息 </legend>
        <el-row>
          <!-- <el-col :span="8">
            <div class="input-item">
              <span class="input-title">审核结果 </span>
              <el-select v-model="rowInfos.auditResult" :disabled="rowInfos.auditResults !=='2'" class="search-input" size="small" placeholder="请选择" clearable>
                <el-option
                  v-for="item in examineSelectOptions1"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </div>
          </el-col> -->
          <el-col :span="8">
            <div class="input-item">
              <span class="input-title">审核人 </span>
              <el-select v-model="rowInfos.auditor" :disabled="true" placeholder="请选择" size="small" filterable>
                <el-option
                  v-for="item in userListOption"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  class="tip-out-input1"/>
              </el-select>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="input-item">
              <span class="input-title">审核日期 </span>
              <el-date-picker
                :disabled="true"
                v-model="rowInfos.auditTime"
                class="tip-out-input"
                size="small"
                placeholder="选择时间"/>
            </div>
          </el-col>
        </el-row>
      </fieldset>
      <el-table
        v-loading="listLoading"
        :data="anotherlist"
        class="mocvd-table run-table"
        height="400px"
        element-loading-text="拼命加载中"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="RunID" align="center" prop="runId" width="120"/>
        <el-table-column label="WaferID" align="center" prop="waferId" width="120"/>
        <el-table-column label="镭刻号" align="center" prop="laserMark" width="120"/>
        <el-table-column label="正面衬底" align="center" prop="frontSubstrate" width="120"/>
        <el-table-column label="目检" align="center" prop="visualLevelCode"/>
        <el-table-column label="波长" align="center" prop="wavelength"/>
        <el-table-column label="STD" align="center" prop="std" width="120"/>
        <el-table-column label="控制片" align="center" prop="isControl">
          <template slot-scope="scope">
            <span v-if="scope.row.isControl === '1'">否</span>
            <span v-if="scope.row.isControl === '0'">是</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" width="120"/>
        <el-table-column label="版型" align="center" prop="editionType" width="120"/>
        <el-table-column label="结构类型" align="center" prop="structureCode"/>
        <el-table-column label="衬底工艺" align="center" prop="substrateCode" width="120"/>
      </el-table>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="printDialogVisible"
      class="print-dialog"
      title="打印预览"
      width="1110px"
    >
      <el-form ref="deleagteForm" label-width="0px" label-position="right">&nbsp;</el-form>
      <div id="printDiv" ref="print">
        <div style="border:1px solid #000;width: 284mm;">
          <el-row style="margin: 0 10px;">
            <el-col :span="24">
              <div style="text-align:center;font-weight:bold;font-size:0.8cm;padding:10px 0">验证片送片单</div>
            </el-col>
          </el-row>
          <el-row style="margin:5px 10px;">
            <el-col :span="7">
              <div style="margin-left: 15px;text-align:left;padding:5px 0;font-size:0.5cm;"><span style="font-weight:bold;">单号：</span>{{ rowInfos.billNo }}</div>
            </el-col>
            <el-col :span="7">
              <div style="text-align:left;padding:5px 0;font-size:0.5cm;"><span style="font-weight:bold;">送片人：</span>{{ rowInfos.creatorName }}</div>
            </el-col>
            <el-col :span="10">
              <div style="text-align:left;padding:5px 0;font-size:0.5cm;"><span style="font-weight:bold;">送片日期：</span>{{ rowInfos.createTime }}</div>
            </el-col>
          </el-row>
          <el-row style="margin:5px 10px;">
            <el-col :span="7">
              <div style="margin-left: 15px;text-align:left;padding:5px 0;font-size:0.5cm;"><span style="font-weight:bold;">衬底工艺：</span>{{ rowInfos.substrateType }}</div>
            </el-col>
            <el-col :span="7">
              <div style="text-align:left;padding:5px 0;font-size:0.5cm;"><span style="font-weight:bold;">审核人：</span>{{ rowInfos.auditorName }}</div>
            </el-col>
            <el-col :span="10">
              <div style="text-align:left;padding:5px 0;font-size:0.5cm;"><span style="font-weight:bold;">审核日期：</span>{{ rowInfos.auditTime }}</div>
            </el-col>
          </el-row>
          <el-row style="margin:5px 10px;">
            <el-col :span="4">
              <div style="margin-left: 15px;text-align:left;padding:5px 0;font-size:0.5cm;"><span style="font-weight:bold;">版型：</span>{{ rowInfos.editionType }}</div>
            </el-col>
            <el-col :span="4">
              <div style="text-align:left;padding:5px 0;font-size:0.5cm;"><span style="font-weight:bold;">收片人：</span>{{ rowInfos.takerName }}</div>
            </el-col>
            <el-col :span="8">
              <div style="text-align:left;padding:5px 0;font-size:0.5cm;"><span style="font-weight:bold;">收片日期：</span>{{ rowInfos.takerTime }}</div>
            </el-col>
            <el-col :span="8">
              <div style="text-align:left;padding:5px 0;font-size:0.5cm;"><span style="font-weight:bold;">打印日期：</span>{{ rowInfos.printDate }}</div>
            </el-col>
          </el-row>
          <el-row style="margin: 10px;">
            <el-col :span="24">
              <div>
                <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" style="width: 278mm;" >
                  <thead>
                    <tr>
                      <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666;">
                        <div style="font-size:0.5cm;" class="cell">序号</div>
                      </th>
                      <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666;">
                        <div style="font-size:0.5cm;" class="cell">RunID</div>
                      </th>
                      <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666;">
                        <div style="font-size:0.5cm;" class="cell">WaferID</div>
                      </th>
                      <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666;">
                        <div style="font-size:0.5cm;" class="cell">镭刻号</div>
                      </th>
                      <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666;">
                        <div style="font-size:0.5cm;" class="cell">目检</div>
                      </th>
                      <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666;">
                        <div style="font-size:0.5cm;" class="cell">波长</div>
                      </th>
                      <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666;">
                        <div style="font-size:0.5cm;" class="cell">STD</div>
                      </th>
                      <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666;">
                        <div style="font-size:0.5cm;" class="cell">控制片</div>
                      </th>
                      <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666;">
                        <div style="font-size:0.5cm;" class="cell">备注</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in anotherlist" :key="item.id">
                      <td colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666">
                        <div class="cell">{{ index + 1 }}</div>
                      </td>
                      <td colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666">
                        <div class="cell">{{ item.runId }}</div>
                      </td>
                      <td colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666">
                        <div class="cell">{{ item.waferId }}</div>
                      </td>
                      <td colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666">
                        <div class="cell">{{ item.laserMark }}</div>
                      </td>
                      <td colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666">
                        <div class="cell">{{ item.visualLevelCode }}</div>
                      </td>
                      <td colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666">
                        <div class="cell">{{ item.wavelength }}</div>
                      </td>
                      <td colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666">
                        <div class="cell">{{ item.std }}</div>
                      </td>
                      <td colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666">
                        <div class="cell">
                          <span v-if="item.isControl === '1'">否</span>
                          <span v-if="item.isControl === '0'">是</span>
                        </div>
                      </td>
                      <td colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666">
                        <div class="cell">{{ item.remark }}</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="printDiv()"><svg-icon icon-class="print"/> 打 印</el-button>
        <el-button @click="printDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .fieldest{
    border: 1px solid #DCDFE6;
    padding-bottom: 15px;
  }
  .legendsty{
    padding-left:8px;
    padding-right:8px;
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
    border-bottom: 2px solid #009494;
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
