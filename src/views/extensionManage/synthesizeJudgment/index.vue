<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto">
      <el-row class="header-btn-group" style="margin-top: -10px">
        <el-col :span="24">
          <div class="input-item">
            <span class="input-title">判定规则 </span>
            <el-input v-model="ruleCheck" :disabled="true" class="search-input" placeholder="请选择判定规则" size="small" maxlength="20" clearable/>
            <el-button
              size="small"
              type="primary"
              @click="openCheck"><svg-icon icon-class="pdgz"/></el-button>
          </div>
          <div class="input-item" style="margin-left:5px">
            <el-button
              :disabled="iSdisable"
              size="small"
              type="primary"
              @click="calculate"
            ><svg-icon icon-class="jspd"/> 计算判定</el-button>
            <el-button
              :disabled="iSdisable"
              size="small"
              type="primary"
              @click="mandatory"
            ><svg-icon icon-class="qzjspd"/> 强制计算判定</el-button>
            <!-- <el-button
              :disabled="iSdisable"
              size="small"
              type="primary"
              @click="calculateSpecial"
            ><svg-icon icon-class="qzjspd"/> 特殊计算判定</el-button> -->
            <el-button
              :disabled="iSdisable"
              size="small"
              type="primary"
              @click="undoCalculate"
            ><svg-icon icon-class="cxjs"/> 撤销计算</el-button>
            <el-button
              :disabled="iSdisable"
              size="small"
              type="primary"
              @click="decide(0)"
            ><svg-icon icon-class="keruku"/> 可入库</el-button>
            <el-button
              :disabled="iSdisable"
              size="small"
              type="primary"
              @click="decide(1)"
            ><svg-icon icon-class="daidingpd"/> 待定</el-button>
            <el-button
              :disabled="iSdisable"
              size="small"
              type="primary"
              @click="decide(2)"
            ><svg-icon icon-class="sanpianku"/> 控制片</el-button>
            <el-button
              :disabled="iSdisable"
              size="small"
              type="primary"
              @click="undoDecide"
            ><svg-icon icon-class="cxpd"/> 撤销判定</el-button>
          </div>
        </el-col>
      </el-row>
      <div class="header-height" style="margin-bottom: -20px">
        <el-row>
          <el-col :span="24">
            <div class="input-item">
              <span class="input-title" style="margin-left: -43px;">时间 </span>
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
              <span class="input-title" style="width:50px">RunID </span>
              <el-input v-model="runId" class="search-input" placeholder="请输入RunID" size="small" maxlength="20" clearable/>
            </div>
            <div class="input-item">
              <span class="input-title" style="width:40px">机台 </span>
              <el-select v-model="machineValue" class="search-input" size="mini" style="width:130px;" placeholder="请选择" filterable multiple collapse-tags clearable>
                <el-option
                  v-for="item in machineOptions"
                  :key="item.id"
                  :label="item.code"
                  :value="item.id"/>
              </el-select>
            </div>
            <div class="input-item">
              <span class="input-title">判定结果 </span>
              <el-select v-model="result" class="search-input" size="small" style="width:152px;" placeholder="请选择" filterable multiple collapse-tags clearable>
                <el-option
                  v-for="item in typeOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </div>
            <div class="input-item">
              <span class="input-title" style="width:40px">状态 </span>
              <el-select v-model="type" class="search-input" size="small" style="width:195px;" placeholder="请选择" filterable multiple collapse-tags clearable>
                <el-option
                  v-for="item in determineOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </div>
            <div class="input-item">
              <span class="input-title" style="width:38px">尺寸 </span>
              <el-select v-model="sizeType" class="search-input" style="width:90px;" size="small" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in substrateFindOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </div>
            <div class="input-item">
              <el-checkbox v-model="isRun" style="margin-left: 10px;"/> 按Run排序
            </div>
            &nbsp;
            <div class="right-btn-box" style="width:175px;float:left">
              <el-button
                style="margin-top: 10px"
                class="float-right margin-top margin-left"
                size="small"
                type="danger"
                @click="clearAll"
              >
                <svg-icon icon-class="clear"/> 重 置
              </el-button>
              <el-button
                style="margin-top: 10px"
                class="float-right"
                size="small"
                type="primary"
                icon="el-icon-search"
                @click="handleSearch" >查 询</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="app-container parameter-table" style="padding-top:10px">
      <div class="table-top-btn-group">
        <div
          :class="{'active':isActive === 0}"
          @click="navClick(0)"
        >
          炉次信息
        </div>
        <div
          :class="{'active':isActive === 1}"
          @click="navClick(1)"
        >
          Wafer信息TOL: <span v-text="waferTol"/>
        </div>
      </div>
      <div v-if="selectTheadVisble && isActive === 0" class="select-thead">
        <div class="options-box">
          <el-checkbox-group v-model="checkboxVal">
            <el-checkbox v-for="(option, index) in formTheadOptions" :disabled="index<10" :key="index" :label="option">
              {{ option.thName }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <el-button type="primary" size="mini" style="margin-left: 25px" @click="submitOption">确 定</el-button>
        <el-button size="mini" @click="resetOption">取 消</el-button>
      </div>
      <div v-if="selectTheadVisble1 && isActive === 1" class="select-thead" style="width: 220px;">
        <div class="options-box tip-out-inner-dialog">
          <el-tree
            ref="tree"
            :data="waferTitle"
            :props="defaultProps"
            show-checkbox
            node-key="id"/>
        </div>
        <el-button type="primary" size="mini" style="margin-left: 25px" @click="submitOption1">确 定</el-button>
        <el-button size="mini" @click="resetOption">取 消</el-button>
      </div>
      <el-button v-if="isActive === 0" type="text" class="select-thead-btn" style="right: 205px;" @click="selectThead"><svg-icon icon-class="shezhi"/> 设置显示列</el-button>
      <el-button v-if="isActive === 1" type="text" class="select-thead-btn" @click="selectThead1"><svg-icon icon-class="shezhi"/> 设置显示列</el-button>
      <el-button v-if="isActive === 1" type="text" class="select-thead-btn" style="right: 220px" @click="viewNext"><svg-icon icon-class="xiangxia"/> 下一条</el-button>
      <el-button v-if="isActive === 1" type="text" class="select-thead-btn" style="right: 300px" @click="viewPrevious"><svg-icon icon-class="xiangshang"/> 上一条</el-button>
      <el-button type="text" class="select-thead-btn" style="right:30px" icon="el-icon-sold-out" @click="importExcel">导出</el-button>
      <el-button v-if="isActive === 0" type="text" class="select-thead-btn" style="right:100px" icon="el-icon-sold-out" @click="importExcelwafer">wafer导出</el-button>
      <el-table
        v-loading="listLoading"
        v-if="isActive===0"
        ref="listTabel"
        :data="list"
        :cell-style="tableRowClassColors"
        element-loading-text="拼命加载中"
        class="broad-scrollbar-table"
        height="calc(100vh - 396px)"
        highlight-current-row
        border
        fit
        @current-change="handleCurrentChange"
        @sort-change="getSort">
        <el-table-column v-for="item in formThead" :prop="item.thKey" :key="item.thName" :label="item.thName" :width="item.width" :fixed="item.thKey==='isCow' || item.thKey==='isDecide' || item.thKey==='status' || item.thKey==='runId'" align="center" sortable="custom" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="item.thKey==='hybrid'&&scope.row[item.thKey]===0">否</span>
            <span v-if="item.thKey==='hybrid'&&scope.row[item.thKey]===1">是</span>
            <span v-if="item.thKey==='isCow'&&scope.row[item.thKey]===0">无</span>
            <span v-if="item.thKey==='isCow'&&scope.row[item.thKey]===1">有 ( {{ scope.row.yzcownum }} / {{ scope.row.yznum }} )</span>
            <span v-if="item.thKey==='isCow'&&scope.row[item.thKey]===2">已计算</span>
            <span v-if="item.thKey==='isDecide'&&scope.row[item.thKey]===0">可入库</span>
            <span v-if="item.thKey==='isDecide'&&scope.row[item.thKey]===1">待定</span>
            <span v-if="item.thKey==='isDecide'&&scope.row[item.thKey]===2">控制片</span>
            <span v-if="item.thKey==='isDecide'&&scope.row[item.thKey]===3">报废</span>
            <span v-if="item.thKey==='isDecide'&&scope.row[item.thKey]===4">未判定</span>
            <span v-if="item.thKey==='isDecide'&&scope.row[item.thKey]===5">已入库</span>
            <span v-if="item.thKey==='status'&&scope.row[item.thKey]===0">衬底投片</span>
            <span v-if="item.thKey==='status'&&scope.row[item.thKey]===1">生长完成</span>
            <span v-if="item.thKey==='status'&&scope.row[item.thKey]===2">目检完成</span>
            <span v-if="item.thKey==='status'&&scope.row[item.thKey]===3">测试完成</span>
            <span v-if="item.thKey==='status'&&scope.row[item.thKey]===4">目检测试完成</span>
            <span v-if="item.thKey==='status'&&scope.row[item.thKey]===5">已送验证片</span>
            <span v-if="item.thKey==='status'&&scope.row[item.thKey]===6">全部投片</span>
            <span v-if="item.thKey==='status'&&scope.row[item.thKey]===7">COW数据返回</span>
            <span v-if="item.thKey==='status'&&scope.row[item.thKey]===8">部分入库</span>
            <span v-if="item.thKey==='status'&&scope.row[item.thKey]===9">已入库</span>
            <span v-if="item.thKey!=='alnId'&&item.thKey!=='hybrid'&&item.thKey!=='isDecide'&&item.thKey!=='status'&&item.thKey!=='isCow'">{{ scope.row[item.thKey] }}</span>
            <span v-if="item.thKey==='alnId'&&scope.row[item.thKey]!==null">
              <el-tooltip placement="top">
                <div slot="content">{{ scope.row[item.thKey] }}</div>
                <div style="cursor: pointer">{{ (scope.row[item.thKey]).split(',')[0] }}</div>
              </el-tooltip>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="isActive===0"
        :current-page="pageNum"
        :page-sizes="[12, 30, 40]"
        :page-size="pageSize"
        :total="totalPage"
        class="pagination"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
      <div v-if="isActive===1" style="width: 100%;height:calc(100vh - 350px)">
        <pl-table
          v-loading="listLoading"
          :datas="list1"
          :row-height="35"
          :row-class-name="tableRowClassColor"
          :header-cell-style="setHeader"
          class="broad-scrollbar-table see"
          style="height:100%"
          element-loading-text="拼命加载中"
          highlight-current-row
          border
          fit
          header-drag-style
          use-virtual>
          <pl-table-column v-if="operateList.length>0" label="操作" align="center" fixed>
            <pl-table-column v-for="item in operateList" :prop="item.thKey" :key="item.thName" :label="item.thName" :width="item.width" class="operse" align="center" sortable fixed>
              <template slot-scope="scope">
                <span v-if="scope.row.isTp === 1&&item.thKey==='status'">投片</span>
                <span v-if="scope.row.isTp === 0&&item.thKey==='status'&&scope.row[item.thKey]===0">可入库</span>
                <span v-if="scope.row.isTp === 0&&item.thKey==='status'&&scope.row[item.thKey]===1">待定</span>
                <span v-if="scope.row.isTp === 0&&item.thKey==='status'&&scope.row[item.thKey]===2">控制片</span>
                <span v-if="scope.row.isTp === 0&&item.thKey==='status'&&scope.row[item.thKey]===3">报废</span>
                <span v-if="scope.row.isTp === 0&&item.thKey==='status'&&scope.row[item.thKey]===4">未判定</span>
                <span v-if="scope.row.isTp === 0&&item.thKey==='status'&&scope.row[item.thKey]===5">已入库</span>
                <span v-if="item.thKey==='index'">{{ scope.$index + 1 }}</span>
                <span v-if="item.thKey==='runId'">{{ scope.row[item.thKey] }}</span>
                <span v-if="item.thKey==='waferId'">{{ scope.row[item.thKey] }}</span>
              </template>
            </pl-table-column>
          </pl-table-column>
          <pl-table-column v-if="baseInfoList.length>0" label="基础数据" align="center">
            <pl-table-column v-for="item in baseInfoList" :prop="item.thKey" :key="item.thName" :label="item.thName" :width="item.width" align="center" sortable show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row[item.thKey] }}
              </template>
            </pl-table-column>
          </pl-table-column>
          <pl-table-column v-if="XRDList.length>0" label="XRD" align="center">
            <pl-table-column v-for="item in XRDList" :prop="item.thKey" :key="item.thName" :label="item.thName" :width="item.width" align="center" sortable show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row[item.thKey] }}
              </template>
            </pl-table-column>
          </pl-table-column>
          <pl-table-column v-if="plList.length>0" label="PL" align="center">
            <pl-table-column v-for="item in plList" :prop="item.thKey" :key="item.thName" :label="item.thName" :width="item.width" align="center" sortable show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row[item.thKey] }}
              </template>
            </pl-table-column>
          </pl-table-column>
          <pl-table-column v-if="nasponList.length>0" label="napson" align="center">
            <pl-table-column v-for="item in nasponList" :prop="item.thKey" :key="item.thName" :label="item.thName" align="center" width="70px" sortable show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row[item.thKey] }}
              </template>
            </pl-table-column>
          </pl-table-column>
          <pl-table-column v-if="elList.length>0" label="EL" align="center">
            <pl-table-column v-for="item in elList" :prop="item.thKey" :key="item.thName" :label="item.thName" :width="item.width" align="center" sortable show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row[item.thKey] }}
              </template>
            </pl-table-column>
          </pl-table-column>
          <pl-table-column v-if="cowList.length>0" label="COW" align="center">
            <pl-table-column v-for="item in cowList" :prop="item.thKey" :key="item.thName" :label="item.thName" :width="item.width" align="center" sortable show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row[item.thKey] }}
              </template>
            </pl-table-column>
          </pl-table-column>
          <pl-table-column v-if="otherList.length>0" label="其他" align="center">
            <pl-table-column v-for="item in otherList" :prop="item.thKey" :key="item.thName" :label="item.thName" :width="item.width" align="center" sortable show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.isTp === 0&&item.thKey==='isTp'">否</span>
                <span v-if="scope.row.isTp === 1&&item.thKey==='isTp'">是</span>
                <span v-if="scope.row.isYp === 0&&item.thKey==='isYp'">否</span>
                <span v-if="scope.row.isYp === 1&&item.thKey==='isYp'">是</span>
                <span v-if="item.thKey!=='isTp'&&item.thKey!=='isYp'">{{ scope.row[item.thKey] }}</span>
              </template>
            </pl-table-column>
          </pl-table-column>
          <pl-table-column v-if="levelList.length>0" label="等级判定" align="center">
            <pl-table-column v-for="item in levelList" :prop="item.thKey" :key="item.thName" :label="item.thName" align="center" width="120px" sortable show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="item.thName==='预估COW波长'">{{ scope.row[item.thKey] }}</span>
                <span v-if="item.thName!=='预估COW波长'">{{ scope.row[item.thKey+'R'] }}</span>
              </template>
            </pl-table-column>
          </pl-table-column>
        </pl-table>
      </div>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="setNumDialogVisable"
      title="waferID导出"
      class="padding-dialog"
      width="500px">
      <div class="input-item" style="float: none">
        <span class="input-title">导出行数 </span>
        <el-input v-model="waferNum" size="small" type="text" style="width: 300px" onkeyup="this.value=this.value.replace(/[^\d]/g,'')" maxlength="2" clearable/>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitNumForm()">确 定</el-button>
        <el-button @click="setNumDialogVisable = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible"
      title="判定规则"
      width="1200px">
      <div>
        &nbsp;
        <span class="input-title" style="width:50px">型号 </span>
        <el-select v-model="modelType" class="search-input" size="small" placeholder="请选择" filterable clearable @change="findQuery">
          <el-option
            v-for="item in modelOptions"
            :key="item.id"
            :label="item.code"
            :value="item.code"/>
        </el-select>
        <span class="input-title">光色 </span>
        <el-select v-model="color" class="search-input" size="small" placeholder="请选择" filterable clearable @change="findQuery">
          <el-option
            v-for="item in colorOptions"
            :key="item.id"
            :label="item.code"
            :value="item.code"/>
        </el-select>
        <span v-if="ruleInfo !== null" class="input-title" style="width:200px">已选定标准：{{ ruleInfo.name }} </span>
      </div>
      <div>
        <el-row>
          <el-col :span="8" style="padding:5px">
            <el-table
              ref="checkTabel"
              :data="checkList"
              element-loading-text="拼命加载中"
              class="run-table"
              height="505px"
              highlight-current-row
              border
              fit
              stripe
              @current-change="handleCurrentCheck">
              <el-table-column label="标准名称" align="center" prop="name" width="100px"/>
              <el-table-column label="修改人" align="center" prop="creatorName" width="100px"/>
              <el-table-column label="修改时间" align="center" prop="createTime"/>
            </el-table>
          </el-col>
          <el-col :span="16" style="padding:5px">
            <el-table
              :data="showCheckList"
              element-loading-text="拼命加载中"
              class="run-table"
              highlight-current-row
              border
              fit
              stripe>
              <el-table-column label="等级" align="center" prop="grade"/>
              <el-table-column v-for="(value, key) in showCheckList[0].key" :key="key" :label="key" align="center" width="200px">
                <template slot-scope="scope">
                  {{ scope.row[key] }}
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm()">确 定</el-button>
        <el-button @click="resetForm()">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="qianzhiDialogVisible"
      title="强制计算"
      width="800px">
      <div v-if="rowInfo !== null" style="margin: 15px 0px;margin-top: -15px;">
        判定指向：{{ rowInfo.decide }}
      </div>
      <el-table
        :data="findCowTableList"
        element-loading-text="拼命加载中"
        class="run-table"
        highlight-current-row
        border
        fit
        stripe
        @current-change="handleCurrentChanges">
        <el-table-column label="圈" align="center" prop="circle"/>
        <el-table-column label="片位" align="center">
          <template slot-scope="scope">
            {{ scope.row.waferId.substring(scope.row.waferId.length - 2) }}
          </template>
        </el-table-column>
        <el-table-column label="COW结果" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.cow === 1" style="color:red;cursor: pointer;" @click="setYTD(scope.row)">有</span>
            <span v-if="scope.row.cow !== 1 && scope.row.cows !== ''">已替代</span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitReplaceStr()">确 定</el-button>
        <el-button @click="closeQZJS()">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 10px;
    top: 3px;
  }
  .input-item{
    float: left;
    margin-top: 8px;
    margin-right: 10px;
    line-height: 32px;
  }
  .search-input{
    width: 135px;
  }
  .short-input{
    width: 126px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 292px);
  }
  .select-thead-btn{
    /* width: 45px; */
    height: 42px;
    position: absolute;
    z-index: 200;
    /* background: rgba(0,0,0,.2); */
    right: 110px;
    top: 0px;
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
  .options-box{
    height: 280px;
    overflow: auto;
    margin-bottom: 10px;
  }
  .header-height{
    /* line-height: 60px; */
    padding-bottom: 15px;
    padding-left: 15px;
  }
  .first-header{
    margin-right: -50px;
  }
  .table-top-btn-group{
    overflow: hidden;
  }
  .table-top-btn-group>div{
    float: left;
    margin-left: 15px;
    height: 30px;
    line-height: 30px;
    padding: 0 15px;
    border: 1px solid #e2e2e2;
    cursor: pointer;
  }
  .table-top-btn-group>div.active{
    color: #fff;
    background: #009494;
    border-color: #009494;
  }
  .parameter-table>>>.el-table .set_yellow td{
    background-color: #FFFFCF;
  }
  .parameter-table>>>.el-table .set_red td{
    background-color: #F56C6C !important;
    color:#fff;
  }
  .run-table ::-webkit-scrollbar {/*滚动条整体样式*/
    height: 10px !important;
  }
  .tip-out-inner-dialog>>>.el-checkbox{
    margin-left: 0;
  }
  .app-container>>> .el-table--border {
    border-top: 2px solid #009494;
  }
  .broad-scrollbar-table>>> .is-scrolling-none +.el-table__fixed,
  .broad-scrollbar-table>>> .is-scrolling-none +.el-table__fixed +.el-table__fixed-right {
    height: 100% !important;
  }
  .broad-scrollbar-table>>>.el-table__fixed {
    height: calc(100vh - 410px) !important;
  }
  .broad-scrollbar-table>>>.el-table__fixed-body-wrapper {
    height: calc(100vh - 448px) !important;
  }
  .see>>> .is-scrolling-none +.el-table__fixed,
  .see>>> .is-scrolling-none +.el-table__fixed +.el-table__fixed-right {
    height: 100% !important;
  }
  .see>>>.el-table__fixed {
    height: calc(100vh - 363px) !important;
    width: 370px !important;
  }
  .see>>>.el-table__fixed-body-wrapper {
    height: calc(100vh - 441px) !important;
  }
</style>
