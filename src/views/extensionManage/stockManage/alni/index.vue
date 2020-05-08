<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto">
      <div class="header-btn-group">
        <el-button
          size="small"
          type="primary"
          @click="handleAdd"
        ><svg-icon icon-class="add"/> 新增大盘</el-button>
        <el-button
          size="small"
          type="primary"
          class="float-right"
          @click="exportExcel"
        ><svg-icon icon-class="export"/> 导出</el-button>
      </div>
      <el-row>
        <el-col :span="20">
          <div class="input-item">
            <span class="input-title" style="width: 85px">Platter_No</span>
            <el-input v-model="searchKeys.platterNo" style="width: 190px" class="search-input" placeholder="Platter_No" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">厂家名称</span>
            <el-input v-model="searchKeys.manufacturer" class="search-input" placeholder="请输入厂家名称" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">使用状态</span>
            <el-select v-model="searchKeys.status" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in userOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">新增时间</span>
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
            class="float-right margin-top margin-left"
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
      <el-table
        v-loading="listLoading"
        :key="tableKey"
        :data="list"
        height="93%"
        class="broad-scrollbar-table"
        element-loading-text="拼命加载中"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="Platter_No" align="center" prop="platterNo" show-overflow-tooltip min-width="180"/>
        <el-table-column label="初次使用日期" align="center" prop="firstUseDate" width="100" show-overflow-tooltip/>
        <el-table-column label="厂家名称" align="center" prop="manufacturer" show-overflow-tooltip min-width="120"/>
        <el-table-column label="厂家盘号" align="center" prop="manufacturerPlatterNo" show-overflow-tooltip min-width="180"/>
        <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip min-width="120"/>
        <el-table-column label="尺寸" align="center" prop="measureName" show-overflow-tooltip width="50"/>
        <el-table-column label="片数" align="center" prop="slice" show-overflow-tooltip width="50"/>
        <el-table-column label="circle" align="center" prop="name" width="60">
          <template slot-scope="scope">
            <div style="color: #009494;font-weight: bold;cursor: pointer;text-decoration:underline" @click="viewCircleDetail(scope.row)">详情</div>
          </template>
        </el-table-column>
        <el-table-column label="额定使用时长(天)" align="center" prop="ratedLife" show-overflow-tooltip width="120"/>
        <el-table-column label="当前使用时长(天)" align="center" prop="useCount" show-overflow-tooltip width="120"/>
        <el-table-column label="使用状态" align="center" prop="status" width="80">
          <template slot-scope="scope">
            <div v-if="scope.row.status === 0" style="color: #1abc9c;font-weight: bold;">使用中</div>
            <div v-if="scope.row.status === 1" style="color: #f56c6c;font-weight: bold;">已报废</div>
            <div v-if="scope.row.status === 2" style="color: #f56c6c;font-weight: bold;">禁用</div>
          </template>
        </el-table-column>
        <el-table-column label="报废日期" align="center" prop="scrapTime" width="100" show-overflow-tooltip/>
        <el-table-column label="清洗备注" align="center" prop="clearRemark" min-width="120" show-overflow-tooltip/>
        <el-table-column label="操作" align="center" prop="status" width="150">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status !== 1" type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              v-if="scope.row.status !== 0"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="pageNum"
        :page-sizes="[15, 30, 40]"
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
      width="780px"
      @close="handleClose('mocvdForm')">
      <el-form ref="mocvdForm" :model="mocvdForm" :rules="rules" status-icon label-width="110px" label-position="right">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Platter_No" prop="platterNo">
              <el-input v-model="mocvdForm.platterNo" placeholder="请输入Platter_No" maxlength="20"/>
            </el-form-item>
            <el-form-item label="厂家名称" prop="cjmc">
              <el-input v-model="mocvdForm.cjmc" placeholder="请输入厂家名称" maxlength="20"/>
            </el-form-item>
            <el-form-item label="额定天数" prop="edsm">
              <el-input v-model="mocvdForm.edsm" placeholder="请输入额定天数" type="text" maxlength="4" oninput="this.value=this.value.replace(/[^0-9]/g,'');"/>
            </el-form-item>
            <el-form-item label="大盘尺寸" prop="measureId">
              <el-select v-model="mocvdForm.measureId" placeholder="请选择大盘尺寸" style="width: 250px" filterable @change="measureIdChange">
                <el-option
                  v-for="item in measureList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="当前状态" prop="status">
              <el-select v-model="mocvdForm.status" placeholder="请选择当前状态" style="width: 250px" filterable>
                <el-option
                  v-for="item in userOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
            <el-form-item label="厂家盘号" prop="cjph">
              <el-input v-model="mocvdForm.cjph" placeholder="请输入厂家盘号" maxlength="20"/>
            </el-form-item>
            <el-form-item label="大盘片数">
              <el-input v-model="mocvdForm.dpps" :disabled="true" type="text" maxlength="3" oninput="this.value=this.value.replace(/[^0-9]/g,'');"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="circle">
          <el-row>
            <el-col :span="17">
              <el-table
                :key="tableKey"
                :data="circleList"
                highlight-current-row
                border
                fit
                @current-change="circleCurrentChange"
              >
                <el-table-column align="center" label="序号" width="50">
                  <template slot-scope="scope">
                    {{ scope.$index+1 }}
                  </template>
                </el-table-column>
                <el-table-column label="开始" align="center" prop="name">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.cricleStart" type="text" maxlength="3" oninput="this.value=this.value.replace(/[^0-9]/g,'');" size="small" style="width: 95%" @blur="circleStartInputChange(scope.row, scope.$index)"/>
                  </template>
                </el-table-column>
                <el-table-column label="结束" align="center" prop="name">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.cricleEnd" type="text" maxlength="3" oninput="this.value=this.value.replace(/[^0-9]/g,'');" size="small" style="width: 95%" @blur="circleEndInputChange(scope.row, scope.$index)"/>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
            <el-col :span="7">
              <div>
                <el-button
                  class="float-right"
                  size="small"
                  type="primary"
                  @click="addCircle"
                >
                  <svg-icon icon-class="add"/> 新增circle
                </el-button>
              </div>
              <div>
                <el-button
                  class="float-right margin-top"
                  size="small"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteCircle"
                >删除circle
                </el-button>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="mocvdForm.remark" type="textarea" placeholder="请输入备注" maxlength="50"/>
        </el-form-item>
        <el-form-item label="清洗备注" prop="remark">
          <el-input v-model="mocvdForm.clearRemark" type="textarea" placeholder="请输入清洗备注" maxlength="50"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitForm('mocvdForm')">确 定</el-button>
        <el-button size="small" @click="resetForm('mocvdForm')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="编辑"
      width="780px"
      @close="handleClose('mocvdForm')">
      <el-form ref="mocvdForm" :model="mocvdForm" :rules="rules" status-icon label-width="110px" label-position="right">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Platter_No" prop="platterNo">
              <el-input v-model="mocvdForm.platterNo" :disabled="true" placeholder="请输入Platter_No" maxlength="20"/>
            </el-form-item>
            <el-form-item label="厂家名称" prop="cjmc">
              <el-input v-model="mocvdForm.cjmc" :disabled="true" placeholder="请输入厂家名称" maxlength="20"/>
            </el-form-item>
            <el-form-item label="额定天数" prop="edsm">
              <el-input v-model="mocvdForm.edsm" placeholder="请输入额定天数" type="text" maxlength="4" oninput="this.value=this.value.replace(/[^0-9]/g,'');"/>
            </el-form-item>
            <el-form-item label="大盘尺寸" prop="measureId">
              <el-select :disabled="true" v-model="mocvdForm.measureId" placeholder="请选择当前状态" style="width: 250px" filterable @change="measureIdChange">
                <el-option
                  v-for="item in measureList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="当前状态" prop="status">
              <el-select v-model="mocvdForm.status" placeholder="请选择当前状态" style="width: 250px" filterable>
                <el-option
                  v-for="item in userOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
            <el-form-item label="厂家盘号" prop="cjph">
              <el-input v-model="mocvdForm.cjph" :disabled="true" placeholder="请输入厂家盘号" maxlength="20"/>
            </el-form-item>
            <el-form-item label="大盘片数">
              <el-input v-model="mocvdForm.dpps" :disabled="true" type="text" maxlength="3" oninput="this.value=this.value.replace(/[^0-9]/g,'');"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="circle">
          <el-row>
            <el-col :span="17">
              <el-table
                :key="tableKey"
                :data="circleList"
                highlight-current-row
                border
                fit
                @current-change="circleCurrentChange"
              >
                <el-table-column align="center" label="序号" width="50">
                  <template slot-scope="scope">
                    {{ scope.$index+1 }}
                  </template>
                </el-table-column>
                <el-table-column label="开始" align="center" prop="name">
                  <template slot-scope="scope">
                    <el-input :disabled="true" v-model="scope.row.cricleStart" type="text" maxlength="3" oninput="this.value=this.value.replace(/[^0-9]/g,'');" size="small" style="width: 95%" @blur="circleStartInputChange(scope.row, scope.$index)"/>
                  </template>
                </el-table-column>
                <el-table-column label="结束" align="center" prop="name">
                  <template slot-scope="scope">
                    <el-input :disabled="true" v-model="scope.row.cricleEnd" type="text" maxlength="3" oninput="this.value=this.value.replace(/[^0-9]/g,'');" size="small" style="width: 95%" @blur="circleEndInputChange(scope.row, scope.$index)"/>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
            <el-col :span="7">
              <div>
                <el-button
                  :disabled="true"
                  class="float-right"
                  size="small"
                  type="primary"
                  @click="addCircle"
                >
                  <svg-icon icon-class="add"/> 新增circle
                </el-button>
              </div>
              <div>
                <el-button
                  :disabled="true"
                  class="float-right margin-top"
                  size="small"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteCircle"
                >删除circle
                </el-button>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="mocvdForm.remark" type="textarea" placeholder="请输入备注" maxlength="50"/>
        </el-form-item>
        <el-form-item label="清洗备注" prop="remark">
          <el-input v-model="mocvdForm.clearRemark" type="textarea" placeholder="请输入清洗备注" maxlength="50"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitEditForm('mocvdForm')">确 定</el-button>
        <el-button size="small" @click="resetForm('mocvdForm')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="platterCircleVisble"
      class="padding-dialog"
      title="大盘circle"
      width="600px"
    >
      <el-table
        :data="platterCircleList"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="开始" align="center" prop="cricleStart"/>
        <el-table-column label="结束" align="center" prop="cricleEnd"/>
      </el-table>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="platterUsageLogVisble"
      class="padding-dialog"
      title="大盘使用记录"
      width="1200px"
      @click="closePlatterUsageLog"
    >
      <div class="overflow-hidden">
        <div class="input-item">
          <span class="input-title">Platter_No</span>
          <span class="dialog-title-content" v-text="platterNo"/>
        </div>
        <div class="input-item">
          <span class="input-title" style="width: 120px;">累计使用次数</span>
          <span class="dialog-title-content" v-text="cumulativeUsage"/>
        </div>
        <div class="input-item">
          <span class="input-title" style="width: 120px;">剩余使用次数</span>
          <span class="dialog-title-content" v-text="surplusUsage"/>
        </div>
        <el-button
          size="mini"
          type="primary"
          class="float-right margin-left"
        ><svg-icon icon-class="export"/> 导 出</el-button>
        <el-checkbox v-model="hiddenAbnormal" class="float-right" style="margin-top: 5px;margin-right: 15px" @change="handleAbnormal">只看异常</el-checkbox>
      </div>
      <el-table
        :data="recordList"
        class="margin-top"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="RunID" align="center" prop="runId"/>
        <el-table-column label="生长时间" align="center" prop="growTime" width="150"/>
        <el-table-column label="机台" align="center" prop="machineNo"/>
        <el-table-column label="结构类型" align="center" prop="structureType"/>
        <el-table-column label="衬底类型" align="center" prop="substrateType"/>
        <el-table-column label="生产类型" align="center" prop="productionType"/>
        <el-table-column label="异常片位" align="center" prop="abnormalSlice"/>
        <el-table-column label="异常原因" align="center" prop="abnormalReason"/>
        <el-table-column label="异常处理" align="center" prop="abnormalDeal">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleOverlook(scope.row)"><svg-icon icon-class="neglect"/> 忽 略</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./alni.js"></script>

<style scoped>
  .input-item{
    float: left;
    margin-top: 14px;
    margin-right: 10px;
  }
  .search-input{
    width: 140px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 265px);
  }
  .dialog-title-content{
    padding-left: 30px;
  }
  .app-container>>> .cell{
    line-height: 38px;
  }
  .app-container>>> td{
    height: 38px;
  }
</style>
