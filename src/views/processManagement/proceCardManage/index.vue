<template>
  <PageHeaderLayout>
    <div class="header-search-add" style="height: auto; position: relative;">
      <div>
        <div class="search-float-box">
          <span style="width: 80px" class="search-title">流程卡名称 </span>
          <el-input
            v-model="proceCardForm.proceCardName"
            type="text"
            size="small"
            placeholder="请输入流程卡名称"
            style="width: 210px"
            maxlength="20"
          />
        </div>
        <div class="search-float-box">
          <span style="width: 80px" class="search-title">流程卡类型 </span>
          <el-select
            v-model="proceCardForm.proceCardType"
            size="small"
            placeholder="请选择流程卡类型"
            style="width: 180px"
            filterable
          >
            <el-option
              v-for="item in proceCardTypeOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </div>
        <div class="search-float-box">
          <span class="search-title">工艺分类 </span>
          <el-select
            v-model="proceCardForm.craftType"
            size="small"
            placeholder="请选择工艺分类"
            style="width: 180px"
            filterable
          >
            <el-option
              v-for="item in craftOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </div>
        <div class="search-float-box">
          <span style="width: 35px" class="search-title">状态 </span>
          <el-select
            v-model="proceCardForm.runType"
            size="small"
            placeholder="请选择状态"
            style="width: 180px"
            filterable
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </div>
        <div class="search-float-box">
          <span style="width: 35px" class="search-title">备注 </span>
          <el-input
            v-model="proceCardForm.remark"
            class="remark-input"
            type="text"
            size="small"
            placeholder="请输入备注"
            maxlength="20"
          />
        </div>
      </div>
      <div class="has-margin-top" style="clear: both">
        <span class="search-title">修改时间 </span>
        <el-date-picker
          v-model="proceCardForm.beginDate"
          :picker-options="pickerOptionsStart"
          :editable="false"
          class="date-picker"
          size="small"
          type="date"
          placeholder="选择开始日期"
          value-format="timestamp"
        />
        <span style="display:inline-block;width: 38px;text-align: center"> 至 </span>
        <el-date-picker
          v-model="proceCardForm.endDate"
          :picker-options="pickerOptionsEnd"
          :editable="false"
          class="date-picker"
          size="small"
          type="date"
          placeholder="选择结束日期"
          value-format="timestamp"
        />
        <span class="search-title short-search-title">修改人 </span>
        <el-input
          v-model="proceCardForm.creator"
          type="text"
          size="small"
          placeholder="请输入修改人"
          style="width: 180px"
          maxlength="20"
        />
      </div>
      <div class="last-modific-date">
        <span style="width: 90px" class="search-title">上次修改时间 </span>
        <el-date-picker
          v-model="proceCardForm.beginModificDate"
          :picker-options="pickerOptionsMStart"
          :editable="false"
          class="date-picker"
          size="small"
          type="date"
          placeholder="选择开始日期"
          value-format="timestamp"
        />
        <span style="display:inline-block;width: 38px;text-align: center"> 至 </span>
        <el-date-picker
          v-model="proceCardForm.endModificDate"
          :picker-options="pickerOptionsMEnd"
          :editable="false"
          class="date-picker"
          size="small"
          type="date"
          placeholder="选择结束日期"
          value-format="timestamp"
        />
        <span style="width: 50px" class="search-title short-search-title">修改人 </span>
        <el-input
          v-model="proceCardForm.modifier"
          type="text"
          size="small"
          placeholder="请输入修改人"
          style="width: 180px;"
          class="modifier-input"
          maxlength="20"
        />
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">查 询</el-button>
        <el-button type="danger" @click="handleClear">
          <svg-icon icon-class="clear"/> 重 置
        </el-button>
      </div>
      <div class="btn-group">
        <el-button type="primary" @click="handleAdd"><svg-icon icon-class="add"/> 新 增</el-button>
      </div>
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        min-width="1600"
        height="calc(100vh - 376px)"
        class="process-card-table broad-scrollbar-table"
        element-loading-text="拼命加载中"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="45" fixed>
          <template slot-scope="scope">{{ scope.$index+1 }}</template>
        </el-table-column>
        <el-table-column label="编号" align="center" prop="code" show-overflow-tooltip width="100" fixed/>
        <el-table-column label="流程卡名称" align="center" prop="name" width="200" show-overflow-tooltip/>
        <el-table-column label="流程卡类型" align="center" prop="type" width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 0">普通流程卡</span>
            <span v-if="scope.row.type === 1">重工流程卡</span>
            <span v-if="scope.row.type === 2">返工流程卡</span>
            <span v-if="scope.row.type === 3">自定义流程卡</span>
          </template>
        </el-table-column>
        <el-table-column label="工艺分类" align="center" prop="craftName" show-overflow-tooltip width="150"/>
        <el-table-column label="状态" align="center" prop="mandataryName" min-width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0" style="color:#009494;font-weight: bold ">启用</span>
            <span v-if="scope.row.status === 1" style="color:#f66;font-weight: bold ">停用</span>
            <span v-if="scope.row.status === 2" style="font-weight: bold ">临时</span>
          </template>
        </el-table-column>
        <el-table-column label="修改时间" align="center" prop="createTime" width="160"/>
        <el-table-column label="修改人" align="center" prop="creator" width="150"/>
        <el-table-column label="上次修改时间" align="center" prop="lastUpdateTime" width="160"/>
        <el-table-column label="修改人" align="center" prop="modifier" width="150"/>
        <el-table-column label="备注" align="center" prop="remark" width="200" show-overflow-tooltip/>
        <el-table-column label="操作" align="center" width="225" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="printPreview(scope.row, scope.$index)">
              <svg-icon icon-class="print"/> 打印预览
            </el-button>
            <el-button
              size="mini"
              icon="el-icon-edit"
              @click="handleEdit(scope.row, scope.$index)"
            >编辑</el-button>
            <el-button
              size="mini"
              icon="el-icon-delete"
              type="danger"
              @click="handleDelete(scope.row)"
            >删除</el-button>
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
            <el-col :span="17">
              <div style="text-align:center;margin-left:7cm;font-weight:bold;font-size:0.8cm;padding:10px 0" v-text="info.name">12</div>
            </el-col>
            <el-col :span="7">
              <div style="text-align:center;padding:5px 0;margin-top: 10px">
                <span style="font-size: 0.6cm;font-weight:bold">流程卡类型:</span>
                <span v-if="info.type === 0" style="font-size:0.7cm;font-weight:bold">普通流程卡</span>
                <span v-if="info.type === 1" style="font-size:0.7cm;font-weight:bold">重工流程卡</span>
                <span v-if="info.type === 2" style="font-size:0.7cm;font-weight:bold">返工流程卡</span>
                <span v-if="info.type === 3" style="font-size:0.7cm;font-weight:bold">自定义流程卡</span>
              </div>
            </el-col>
          </el-row>
          <el-row style="margin:-5px 10px;">
            <el-col :span="8">
              <div style="text-align:left;padding:5px 0;font-size:0.5cm;"><span style="font-weight:bold;">流程卡编号 </span>{{ info.code }}</div>
            </el-col>
            <el-col :span="8">
              <div style="text-align:left;padding:5px 0;font-size:0.5cm;"><span style="font-weight:bold;">工艺分类 </span>{{ info.craftName }}</div>
            </el-col>
            <el-col :span="8">
              <div style="text-align:left;padding:5px 0;font-size:0.5cm;"><span style="font-weight:bold;">备注 </span>{{ info.remark }}</div>
            </el-col>
          </el-row>
          <el-row style="margin:-5px 10px;">
            <el-col :span="24">
              <div style="text-align:left;padding:5px 0;font-size:0.5cm;">
                <span style="font-weight:bold;">流程卡状态 </span>
                <span v-if="info.status === 0" style="font-size:0.5cm;"> 启用</span>
                <span v-if="info.status === 1" style="font-size:0.5cm;"> 停用</span>
                <span v-if="info.status === 2" style="font-size:0.5cm;"> 临时</span>
              </div>
            </el-col>
          </el-row>
          <el-row style="margin:-5px 10px;">
            <el-col :span="24">
              <div style="text-align: left;padding: 5px 0;border-bottom: 1px solid #666;" >
                <el-row>
                  <el-col :span="2.5"><div style="padding-bottom:10px;font-weight: bold;font-size:0.5cm;">对应型号  </div></el-col>
                  <el-col :span="21">
                    <div v-for="item in currentModelList" :key="item.color" style="padding-bottom:5px;font-size:0.5cm;word-wrap: break-word;">
                      <el-row>
                        <el-col :span="2">
                          <div style="font-weight:bold;" v-text="'【'+item.color+'】:'"/>
                        </el-col>
                        <el-col :span="22">
                          <div v-for="obj in item.modelName" :key="obj" style="font-size:0.5cm;float: left;">{{ obj.substring(0,obj.indexOf('#')) }}&nbsp;&nbsp;&nbsp;</div>
                        </el-col>
                      </el-row>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
          <el-row style="margin: 10px;">
            <el-col :span="24">
              <div style="text-align: left;font-weight: bold;padding: 10px 0;font-size:0.5cm;">本批信息</div>
              <div>
                <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" style="width: 278mm;" >
                  <thead>
                    <tr>
                      <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666;">
                        <div style="font-size:0.5cm;" class="cell">批号</div>
                      </th>
                      <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666;">
                        <div style="font-size:0.5cm;" class="cell">型号</div>
                      </th>
                      <th colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666;">
                        <div style="font-size:0.5cm;" class="cell">数量</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666">
                        <div class="cell">&nbsp;</div>
                      </td>
                      <td colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666">
                        <div class="cell">&nbsp;</div>
                      </td>
                      <td colspan="1" rowspan="1" style="text-align:center;height:35px;border:1px solid #666">
                        <div class="cell">&nbsp;</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </el-col>
          </el-row>
          <el-row style="margin: 10px;">
            <el-col :span="24">
              <div style="text-align: left;font-weight: bold;padding: 10px 0;font-size:0.5cm;">前段工序</div>
              <div>
                <table
                  :class="(info.type === 1 || info.type === 2) ? 'abnormal-process-table' : ''"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  class="el-table__header"
                  style="width: 278mm;" >
                  <thead>
                    <tr class>
                      <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width:80px">
                        <div class="cell" style="font-size:0.5cm;">步骤</div>
                      </th>
                      <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 180px;">
                        <div class="cell" style="font-size:0.5cm;">工序</div>
                      </th>
                      <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 180px;">
                        <div class="cell" style="font-size:0.5cm;">制造记录</div>
                      </th>
                      <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 180px;">
                        <div class="cell" style="font-size:0.5cm;">程序</div>
                      </th>
                      <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;">
                        <div class="cell" style="font-size:0.5cm;">接片</div>
                      </th>
                      <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;">
                        <div class="cell" style="font-size:0.5cm;">传片</div>
                      </th>
                      <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;">
                        <div class="cell" style="font-size:0.5cm;">备注</div>
                      </th>
                      <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;">
                        <div class="cell" style="font-size:0.5cm;">日期</div>
                      </th>
                      <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;">
                        <div class="cell" style="font-size:0.5cm;">时间</div>
                      </th>
                      <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;">
                        <div class="cell" style="font-size:0.5cm;">操作员</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in dialogList" :key="item.processId">
                      <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
                        <div class="cell" style="font-size:0.5cm;">{{ index + 1 }}</div>
                      </td>
                      <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
                        <div class="cell" style="font-size:0.5cm;">{{ item.processId }}</div>
                      </td>
                      <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
                        <div class="cell" style="font-size:0.5cm;word-wrap: break-word;">{{ item.remark }}</div>
                      </td>
                      <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
                        <div class="cell" style="font-size:0.5cm;">{{ item.programName }}</div>
                      </td>
                      <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
                        <div class="cell"/>
                      </td>
                      <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
                        <div class="cell"/>
                      </td>
                      <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
                        <div class="cell"/>
                      </td>
                      <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
                        <div class="cell"/>
                      </td>
                      <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
                        <div class="cell"/>
                      </td>
                      <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
                        <div class="cell"/>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </el-col>
          </el-row>
          <el-row style="margin: 10px;border-top:1px solid #666">
            <el-col :span="24">
              <div style="text-align: left;font-weight: bold;padding: 10px 0;font-size: 0.5cm">后段工序</div>
              <div>
                <table
                  :class="(info.type === 1 || info.type === 2) ? 'abnormal-process-table' : ''"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  class="el-table__header"
                  style="width: 100%;" >
                  <tbody>
                    <tr v-for="(item, index) in dialogEndList" :key="item.processId">
                      <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 80px;">
                        <div class="cell" style="font-size:0.5cm;">{{ index + dialogList.length + 1 }}</div>
                      </td>
                      <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 180px;">
                        <div class="cell" style="font-size:0.5cm;">{{ item.processId }}</div>
                      </td>
                      <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 180px;">
                        <div class="cell" style="font-size:0.5cm;">{{ item.remark }}</div>
                      </td>
                      <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 180px;">
                        <div class="cell" style="font-size:0.5cm;word-wrap: break-word;">{{ item.programName }}</div>
                      </td>
                      <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
                        <div class="cell"/>
                      </td>
                      <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
                        <div class="cell"/>
                      </td>
                      <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
                        <div class="cell"/>
                      </td>
                      <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
                        <div class="cell"/>
                      </td>
                      <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
                        <div class="cell"/>
                      </td>
                      <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
                        <div class="cell"/>
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
        <el-button type="primary" @click="printDiv()">打 印</el-button>
        <el-button @click="printDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./proceCardManage.js"></script>

<style scoped>
  .has-margin-top {
    margin-top: 15px;
  }
  .btn-group {
    position: absolute;
    bottom: 15px;
    right: 15px;
  }
  .app-container {
    height: calc(100vh - 299px);
  }
  .search-title {
    font-weight: bold;
    display: inline-block;
    width: 65px;
    text-align: right;
  }
  .search-float-box {
    float: left;
    height: 45px;
  }
  .app-container >>> .cell {
    line-height: 35px;
  }
  .app-container >>> td {
    height: 35px;
  }
  .abnormal-process-table td{
    background-color: #eee;
    box-shadow: #dfdfdf 0px 0px 0px 60px inset;
  }
  .cell{
  }
  .print-dialog>>>.el-dialog__body {
    padding-top: 5px;
  }
  .abnormal-process-table td.has-bancground{
    /*background: #d2e5e5;*/
    background: transparent;
    font-weight: bold;
    box-shadow: darkgrey 0px 0px 0px 60px inset;
  }
  .has-bancground{
    /*background: #d2e5e5;*/
    background: transparent;
    font-weight: bold;
    box-shadow: darkgrey 0px 0px 0px 60px inset;
  }
  /*.process-card-table ::-webkit-scrollbar {!*滚动条整体样式*!*/
    /*height: 10px !important;*/
  /*}*/
  .el-table__fixed-right::before, .el-table__fixed::before{
    height: 0;
  }
  .process-card-table>>>.el-button+.el-button {
    margin-left: 2px;
  }
  .date-picker{
    width: 212px;
  }
  .remark-input{
    width: 212px;
  }
  .last-modific-date{
    margin-top: 10px;
  }
  .modifier-input{
    margin-right: 60px;
  }
  .process-card-table>>>.is-scrolling-none~.el-table__fixed-right{
    height: 100%;
  }
  @media (max-width: 1500px) {
    .search-title {
      width: 105px;
    }
    .date-picker{
      width: 165px;
    }
    .remark-input{
      width: 165px;
    }
    .header-search-add>>>.el-input--small .el-input__inner {
      height: 28px;
      line-height: 28px;
    }
    .search-float-box {
      height: 35px;
    }
    .last-modific-date{
      margin-top: 0px;
    }
    .app-container {
      height: calc(100vh - 300px);
    }
    .modifier-input{
      margin-right: 8px;
    }
    .short-search-title{
      width: 87px;
    }
  }
</style>
