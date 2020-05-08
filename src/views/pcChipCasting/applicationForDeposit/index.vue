<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto">
      <div class="header-btn-group">
        <el-button
          size="small"
          type="primary"
          @click="handleAdd"><svg-icon icon-class="add"/> 新增</el-button>
        <el-button
          :disabled="isDelete"
          class="margin-left"
          size="small"
          type="danger"
          icon="el-icon-delete"
          @click="handleDelete"> 删除</el-button>
        <el-button
          :disabled="isDelete1"
          class="margin-left"
          size="small"
          type="primary"
          @click="conversion"><svg-icon icon-class="zhuanwckd"/> 转为出库单</el-button>
      </div>
      <div class="search-box">
        <div class="left-search-box">
          <div class="input-item">
            <span class="input-title" style="width:50px">类别 </span>
            <el-select v-model="ckNo" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in ckList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width:35px">单号 </span>
            <el-input v-model="oddNum" class="search-input" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title" style="width:35px">日期 </span>
            <el-date-picker
              v-model="beginDate"
              :picker-options="pickerOptionsStart"
              :editable="false"
              class="search-input"
              size="small"
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
              type="date"
              placeholder="结束日期"
              value-format="timestamp"
            />
          </div>
          <div class="input-item">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-search"
              @click="handleSearch" >查询</el-button>
            <el-button
              size="small"
              type="danger"
              @click="clearAll"
            >
              <svg-icon icon-class="clear"/> 重置
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        v-if="isActive===0"
        :data="list"
        element-loading-text="拼命加载中"
        height="calc(100vh - 339px)"
        class="isHover"
        border
        fit
        stripe
        highlight-current-row
        @current-change="handleCurrentChange">
        <el-table-column align="center" label="序号" width="50px">
          <template slot-scope="scope">
            {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
          </template>
        </el-table-column>
        <el-table-column label="单号" width="120" align="center" prop="apply_no" show-overflow-tooltip/>
        <el-table-column label="单据类型" align="center" prop="orderTypeName" show-overflow-tooltip/>
        <el-table-column label="类别" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.type === 0">出库单</span>
            <span v-if="scope.row.type === 1">备货单</span>
          </template>
        </el-table-column>
        <el-table-column label="客户名称" align="center" prop="customerName" show-overflow-tooltip/>
        <el-table-column label="投片数量" align="center" prop="pick_no" show-overflow-tooltip/>
        <el-table-column label="制单人" align="center" prop="creator" show-overflow-tooltip/>
        <el-table-column label="制单日期" align="center" prop="createTime" show-overflow-tooltip/>
        <el-table-column label="审核状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0" style="color:#01485B;font-weight:bold">未挑片</span>
            <span v-if="scope.row.status === 1" style="color: #1C84C6;font-weight: bold">待审核</span>
            <span v-if="scope.row.status === 2" style="color: #009494;font-weight: bold">通过</span>
            <span v-if="scope.row.status === 3" style="color: #f33;font-weight: bold">不通过</span>
            <span v-if="scope.row.status === 4">取消</span>
          </template>
        </el-table-column>
        <el-table-column label="审核人" align="center" prop="auditor" show-overflow-tooltip/>
        <el-table-column label="审核日期" align="center" prop="auditTime" show-overflow-tooltip/>
        <el-table-column label="备注" align="center" prop="remark" width="60" show-overflow-tooltip/>
        <el-table-column label="所用规则" align="center" prop="rules" width="120" show-overflow-tooltipp>
          <template slot-scope="scope">
            <div style="color: #009494;text-decoration: underline;cursor: pointer;" @click="viewRules(scope.row)">{{ scope.row.rules }}</div>
          </template>
        </el-table-column>
        <el-table-column label="规则版本" align="center" prop="version" show-overflow-tooltip/>
        <!-- <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip/> -->
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
      title="新增"
      width="500px"
      @close="handleClose('machineForm')">
      <div style="text-align: center;width: 100%;padding-bottom: 15px;">
        <el-checkbox v-model="isCheck" style="font-weight:bold" @change="getNum">手动挑片</el-checkbox>
      </div>
      <el-form ref="machineForm" :model="machineForm" :rules="rules" status-icon label-width="90px" label-position="right">
        <el-form-item v-if="isCheck" label="WaferID " prop="listStr">
          <el-input v-model="machineForm.listStr" :rows="5" :autosize="{ minRows: 4, maxRows: 6 }" type="textarea" placeholder="" @keyup.native="getNum"/>
        </el-form-item>
        <el-form-item v-if="!isCheck" label="挑片规则 " prop="rules">
          <el-select v-model="machineForm.rules" style="width: 240px;" placeholder="请选择" filterable @change="setKC">
            <el-option
              v-for="item in tpList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
          <span style="margin-left: 5px">库存数：{{ kcnum }}</span>
        </el-form-item>
        <!-- <el-form-item v-if="!isCheck" label="版本 " prop="version">
          <el-input v-model="machineForm.version" placeholder="请输入版本" maxlength="20"/>
        </el-form-item> -->
        <el-form-item label="类别 " prop="types">
          <el-select v-model="machineForm.types" style="width: 370px;" placeholder="请选择" filterable>
            <el-option
              v-for="item in ckList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="单据类型 " prop="djtype">
          <el-select v-model="machineForm.djtype" style="width: 370px;" placeholder="请选择" filterable @change="setCustomer">
            <el-option
              v-for="item in djList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="客户名称 " prop="customer">
          <el-select v-model="machineForm.customer" style="width: 370px;" placeholder="请选择" filterable>
            <el-option
              v-for="item in customersList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="挑片数量 " prop="num">
          <el-input v-model="machineForm.num" :disabled="isCheck" placeholder="请输入挑片数量" maxlength="10"/>
        </el-form-item>
        <el-form-item label="备注 ">
          <el-input v-model="machineForm.remark" type="textarea" placeholder="请输入备注" maxlength="50"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitForm('machineForm')">确 定</el-button>
        <el-button size="small" @click="addDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!--挑片规则明细-->
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="rulesDialogVisible"
      class="padding-dialog"
      title="明细"
      width="600px">
      <div class="input-item" style="margin-top: 0">
        <span class="input-title">规则名称:</span>
        <span style="width: 200px;" >{{ ruleName }}</span>
      </div>
      <div class="input-item" style="margin-top: 0">
        <span class="input-title">版本:</span>
        <span class="search-input" >{{ version }}</span>
      </div>
      <div class="clear-both"/>
      <el-table
        v-loading="listLoading"
        :data="contentList"
        style="margin-top: 10px"
        class="site-table"
        max-height="450"
        element-loading-text="拼命加载中"
        border
        fit>
        <el-table-column align="center" label="字段" width="200" prop="field" show-overflow-tooltip/>
        <el-table-column align="center" label="条件" prop="content" show-overflow-tooltip/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="rulesDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <!--特殊出片明细-->
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="detailDialogVisible"
      class="padding-dialog"
      title="明细"
      width="600px">
      <el-table
        v-loading="listLoading"
        :data="specialList"
        style="margin-top: 10px"
        class="site-table"
        max-height="450"
        element-loading-text="拼命加载中"
        border
        fit>
        <el-table-column align="center" label="序号" width="100">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="WaferID" prop="waferId"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="detailDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .app-container{
    position: relative;
    height: calc(100vh - 262px);
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
    width: 160px;
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
  /* .isHover>>>.el-table__body-wrapper tr{
    cursor: pointer;
  } */
</style>
