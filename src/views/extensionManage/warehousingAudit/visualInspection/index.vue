<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto">
      <div class="header-btn-group" style="height: 45px;">
        <el-button
          v-show="searchType===0"
          size="small"
          type="primary"
          @click="checkFinish"
        ><svg-icon icon-class="jianyanwc"/> 检验完成</el-button>
        <el-button
          v-if="saveType === 0&&searchType===0"
          size="small"
          style="margin-left: 15px;"
          type="primary"
          icon="el-icon-check"
          @click="getErrorList(0)"
        >保存</el-button>
        <el-button
          v-show="searchType===0"
          size="small"
          type="danger"
          style="margin-left: 15px;"
          @click="backList"><svg-icon icon-class="shenheth"/> 退回产线
        </el-button>
        <el-button
          v-if="rowInfo.operation===0&&searchType===1"
          size="small"
          style="margin-left: -10px;"
          type="primary"
          icon="el-icon-check"
          @click="getUpdateList()"
        >更改</el-button>
        <el-button
          v-if="saveType === 1&&searchType===0"
          size="small"
          style="margin-left: 15px;"
          type="primary"
          @click="getErrorList(1)"
        ><svg-icon icon-class="yichangdan"/> 生成异常单</el-button>
        <el-button
          v-if="searchType===1"
          size="small"
          style="margin-left: 15px;"
          type="primary"
          @click="getErrorLists()"
        ><svg-icon icon-class="yichangdan"/> 生成异常单</el-button>
      </div>
      <div class="search-box">
        <div class="left-search-box">
          <div class="input-item">
            <span class="input-title" style="width:50px">RunID </span>
            <el-input v-model="runId" class="search-input" style="width:125px" placeholder="请输入RunID" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title" style="width:35px">机台 </span>
            <el-select v-model="machineValue" class="search-input" style="width:80px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in machineOptions"
                :key="item.id"
                :label="item.code"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width:35px">炉次 </span>
            <el-select v-model="furnaceValue" class="search-input" style="width:80px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in furnaceOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width:65px">完成状态 </span>
            <el-select v-model="checkType" class="search-input" style="width:80px" size="small" placeholder="请选择" filterable>
              <el-option
                v-for="item in finishList"
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
              style="width:135px"
              size="small"
              type="date"
              placeholder="选择开始日期"
              value-format="timestamp"
            />
            <span style="display:inline-block;width: 15px;text-align: center"> 至 </span>
            <el-date-picker
              v-model="endDate"
              :picker-options="pickerOptionsEnd"
              :editable="false"
              class="search-input"
              style="width:135px"
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
      <el-row style="margin-top:-15px">
        <el-col :span="7" style="padding-right:15px">
          <!--单据信息-->
          <div class="titlest">Run TOL：{{ list.length }}</div>
          <el-table
            v-loading="listLoading"
            ref="listTabel"
            :data="list"
            class="mocvd-table run-table"
            height="calc(100vh - 300px)"
            element-loading-text="拼命加载中"
            highlight-current-row
            border
            fit
            @current-change="handleCurrentChange"
          >
            <el-table-column align="center" label="序号" width="50">
              <template slot-scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column label="RunID" align="center" prop="runId" width="115"/>
            <el-table-column label="检验状态" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.checkedStatus === null|| scope.row.checkedStatus === 0" style="color:#E25D5D;font-weight:bold">未检验</span>
                <span v-if="scope.row.checkedStatus === 1" style="color:#1ABC9C;font-weight:bold">已检验</span>
              </template>
            </el-table-column>
            <el-table-column label="修正数量" align="center" prop="checkedNum"/>
          </el-table>
        </el-col>
        <el-col :span="17">
          <div class="titlest">Wafer TOL：{{ anotherList.length }}</div>
          <!--wafer信息-->
          <el-table
            :data="anotherList"
            :row-class-name="tableRowClassColor"
            class="mocvd-table run-table"
            height="calc(100vh - 300px)"
            element-loading-text="拼命加载中"
            border
            fit
            stripe>
            <el-table-column align="center" label="序号" width="150">
              <template slot-scope="scope" show-overflow-tooltip>
                {{ scope.$index+1 }}
              </template>
            </el-table-column>
            <el-table-column label="WaferID" align="center" prop="waferId" width="120"/>
            <el-table-column label="镭刻号" align="center" prop="laserMark" width="120"/>
            <el-table-column label="衬底厂家" align="center" prop="supplier" width="110"/>
            <el-table-column label="目检等级" align="center" prop="oldVisualName" width="80"/>
            <el-table-column label="原因" align="center" prop="oldReasonName" width="120"/>
            <el-table-column align="center" label="修正后等级">
              <template slot-scope="scope">
                <!-- <span>
                  {{ visualReason }}
                </span> -->
                <el-select v-model="scope.row.amendResult" :disabled="(searchType===1&&rowInfo.operation===1)||scope.row.status===1" class="search-input" style="width:80px" size="small" placeholder="请选择" filterable clearable>
                  <el-option
                    v-for="item in levelList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    :disabled="scope.row.oldVisualName === item.name"/>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column align="center" label="修正原因">
              <template slot-scope="scope">
                <el-select v-model="scope.row.amendReasonId" :disabled="(searchType===1&&rowInfo.operation===1)||scope.row.status===1" class="search-input" style="width:80px" size="small" placeholder="请选择" filterable clearable>
                  <el-option
                    v-for="item in reasonList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column align="center" label="外观抽检">
              <template slot-scope="scope">
                <el-select v-model="scope.row.spotCheckId" :disabled="(searchType===1&&rowInfo.operation===1)||scope.row.status===1" class="search-input" style="width:80px" size="small" placeholder="请选择" filterable clearable>
                  <el-option
                    v-for="item in wgList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column align="center" label="抽检人员">
              <template slot-scope="scope">
                <el-input v-model="scope.row.creator" :disabled="(searchType===1&&rowInfo.operation===1)||scope.row.status===1" class="search-input" style="width:80px" size="small" maxlength="10" placeholder="请填写" clearable/>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible"
      title="生成异常单"
      width="1200px"
      class="tip-out-inner-dialog">
      <el-row>
        <el-col :span="6">
          <div class="input-item">
            <span class="input-title">单号 </span>
            <el-input v-model="newCode" :disabled="true" class="search-input" placeholder="" size="small" maxlength="20"/>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="input-item">
            <span class="input-title">状态 </span>
            <el-input v-model="newSatue" :disabled="true" class="search-input" placeholder="" size="small" maxlength="20"/>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="input-item">
            <span class="input-title" style="height:40px">备注 </span>
            <el-input v-model="newRemark" type="textarea" class="search-input" placeholder="请输入备注" size="small" maxlength="50"/>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="input-item">
            <span class="input-title">制单日期 </span>
            <el-date-picker
              v-model="makingDate"
              class="tip-out-input1"
              style="width:150px"
              placeholder="选择时间"
              size="small"
              @change="getBillNo"/>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-bottom:15px">
        <el-col :span="6">
          <div class="input-item">
            <span class="input-title">制单人 </span>
            <el-input v-model="makinger" :disabled="true" class="search-input" placeholder="请输入单号" size="small" maxlength="20"/>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="input-item">
            <span class="input-title">确认日期 </span>
            <el-date-picker
              v-model="confirmData"
              :disabled="true"
              class="tip-out-input1"
              style="width:150px"
              placeholder="选择时间"
              size="small"/>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="input-item">
            <span class="input-title">确认人 </span>
            <el-input v-model="confirmer" :disabled="true" class="search-input" placeholder="" size="small" maxlength="20"/>
          </div>
        </el-col>
        <el-col :span="6" style="text-align:center">
          <el-button
            :disabled="anotherLists.length===0"
            class="margin-top"
            size="small"
            type="primary"
            icon="el-icon-check"
            @click="saveError" >保存</el-button>
            <!-- <el-button
            class="margin-top"
            size="small"
            type="primary"
            @click="reportExcel" ><svg-icon icon-class="export"/> 保存并导出</el-button> -->
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table
            ref="multipleTable"
            :data="anotherLists"
            class="mocvd-table run-table"
            height="570px"
            element-loading-text="拼命加载中"
            border
            fit
            stripe>
            <el-table-column label="RunID" align="center" prop="runId"/>
            <el-table-column label="WaferID" align="center" prop="waferId"/>
            <el-table-column label="镭刻号" align="center" prop="laserMark"/>
            <el-table-column label="目检等级" align="center" prop="oldVisualName" width="100"/>
            <el-table-column label="原因" align="center" prop="oldReasonName"/>
            <el-table-column label="修正后等级" align="center" prop="newVisualName" width="100"/>
            <el-table-column label="修正原因" align="center" prop="newReasonName"/>
          </el-table>
        </el-col>
      </el-row>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
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
  .app-container>>>.el-table .set_yellow td{
    background-color: #FFFFCF;
  }
  .app-container>>>.el-table .set_pink td {
    background-color: #fbdddd;
  }
  .set-borders{
    border: 1px solid #DCDFE6;
    padding-top: 20px;
    padding-bottom: 0px;
    margin: 5px;
    padding: 20px 10px 10px 10px;
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
  .input-item{
    float: left;
    margin-top: 14px;
    margin-right: 10px;
  }
  .search-input{
    width: 155px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 260px);
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
  .mocvd-table >>> .cell{
    line-height: 25px;
  }
  .mocvd-table >>> .el-table__row td{
    height: 25px;
  }
  .mocvd-table >>> .el-input__inner{
    height: 25px;
  }
  .mocvd-table >>> .el-select__caret{
    margin-top: 3px;
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
  .titlest{
    line-height: 25px;
    font-weight: bold;
  }
  .parameter-table>>>.el-table .set_red td{
    background-color: #F56C6C !important;
    color:#ffffff;
  }
  .header-search-add {
    padding: 12px 15px;
  }
</style>
