<template>
  <PageHeaderLayout>
    <div>
      <div class="input-ctn">
        <div class="header-search-add" style="padding: 0; height:100%">
          <div class="module-container">
            <div class="module-title">
              <div class="module-title-text">入库日监控</div>
            </div>
            <div class="module-content">
              <div class="input-item">
                <span class="input-title">入库类型 </span>
                <el-select v-model="searchKey.rklx" class="search-input" size="small" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in storehouseType"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </div>
              <div class="input-item">
                <span class="input-title">光色名称 </span>
                <el-select v-model="searchKey.gsmc" class="search-input" size="small" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in colorList"
                    :key="item.id"
                    :label="item.code"
                    :value="item.id"/>
                </el-select>
              </div>
              <div class="input-item">
                <span class="input-title">尺寸 </span>
                <el-select v-model="searchKey.size" class="search-input" size="small" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in measureList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </div>
              <div class="input-item">
                <span class="input-title">验证版型 </span>
                <el-select v-model="searchKey.yzbx" class="search-input" size="small" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in substrateFindOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </div>
              <div class="input-item">
                <span class="input-title">机台 </span>
                <el-select v-model="searchKey.machine" class="search-input" size="small" placeholder="请选择" filterable multiple collapse-tags>
                  <el-option
                    v-for="item in machineList"
                    :key="item.id"
                    :label="item.code"
                    :value="item.id"/>
                </el-select>
              </div>
              <div class="input-item">
                <span class="input-title">COT/COW </span>
                <el-select v-model="searchKey.cotOrCow" class="search-input" size="small" placeholder="请选择" filterable @change="cotOrCowChange">
                  <el-option
                    v-for="item in cotOrCowList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </div>
              <div class="input-item">
                <span class="input-title">参数选择 </span>
                <el-select v-model="searchKey.params" class="search-input" size="small" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in paramsList"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"/>
                </el-select>
              </div>
              <div class="input-item">
                <span class="input-title">月份 </span>
                <el-date-picker
                  v-model="searchKey.month"
                  :editable="false"
                  class="search-input"
                  size="small"
                  type="month"
                  placeholder="选择月份"
                  value-format="yyyy-MM"
                />
              </div>
              <el-button
                size="small"
                type="primary"
                icon="el-icon-search"
                style="margin-left:75px"
                @click="handleRkSearch" >查询</el-button>
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
      <div class="chart-ctn">
        <div class="header-search-add" style="padding: 0; height:100%">
          <div class="module-container">
            <div class="module-title">
              <div class="module-title-text">验证片{{ titalParams }}日监控</div>
              <el-button
                v-if="!showTable"
                size="mini"
                type="primary"
                style="float: right;"
                @click="handleSwitch"><svg-icon icon-class="shezhi"/> 统计设置</el-button>
              <el-button
                v-if="showTable"
                size="mini"
                type="primary"
                icon="el-icon-check"
                style="float: right;"
                @click="handleSetSelectTable">确 定</el-button>
            </div>
            <div class="module-content">
              <LineChart v-loading="listLoading" v-if="!showTable" id="rkrjk" :datas="options" element-loading-text="拼命加载中" height="370px" width="100%"/>
              <div v-else style="height: 370px;margin-left: 10px;margin-top: -14px;position: relative;">
                <div style="position: absolute;top: 12px;left: 30px;font-weight: bold;z-index: 11;color: #666">是否统计</div>
                <pl-table
                  v-loading="listLoading"
                  ref="runTable"
                  :datas="list"
                  :row-height="22"
                  element-loading-text="拼命加载中"
                  border
                  fit
                  highlight-current-row
                  class="broad-scrollbar-table margin-top"
                  header-drag-style
                  use-virtual
                  @cell-mouse-enter="hoverCall"
                  @selection-change="selectionChange"
                  @cell-click="cellClick"
                  @row-click="rowClick"
                >
                  <!--use-virtual-->
                  <pl-table-column type="selection" width="120">
                    <template slot="header" slot-scope="scope">
                      是否统计
                    </template>
                  </pl-table-column>
                  <pl-table-column align="center" label="机台" prop="machineCode" show-overflow-tooltip/>
                  <pl-table-column align="center" label="RunID" prop="runId" show-overflow-tooltip/>
                  <pl-table-column align="center" label="WaferID" prop="waferId" show-overflow-tooltip/>
                  <pl-table-column align="center" label="统计值" prop="value" show-overflow-tooltip/>
                </pl-table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="margin-top:10px">
      <div class="input-ctn" style="height: 387px">
        <div class="header-search-add" style="padding: 0; height:100%">
          <div class="module-container">
            <div class="module-title">
              <div class="module-title-text">在制日监控</div>
            </div>
            <div class="module-content">
              <div class="input-item">
                <span class="input-title">入库类型 </span>
                <el-select v-model="inMakSearchKey.rklx" class="search-input" size="small" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in storehouseType"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </div>
              <div class="input-item">
                <span class="input-title">光色名称 </span>
                <el-select v-model="inMakSearchKey.gsmc" class="search-input" size="small" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in colorList"
                    :key="item.id"
                    :label="item.code"
                    :value="item.id"/>
                </el-select>
              </div>
              <div class="input-item">
                <span class="input-title">尺寸 </span>
                <el-select v-model="inMakSearchKey.size" class="search-input" size="small" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in measureList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </div>
              <div class="input-item">
                <span class="input-title">验证版型 </span>
                <el-select v-model="inMakSearchKey.yzbx" class="search-input" size="small" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in substrateFindOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </div>
              <div class="input-item">
                <span class="input-title">月份 </span>
                <el-date-picker
                  v-model="inMakSearchKey.month"
                  :editable="false"
                  class="search-input"
                  size="small"
                  type="month"
                  placeholder="选择月份"
                  value-format="yyyy-MM"
                />
              </div>
              <el-button
                size="small"
                type="primary"
                icon="el-icon-search"
                style="margin-left:75px"
                @click="queryZzChartDataFun" >查询</el-button>
              <el-button
                size="small"
                type="danger"
                @click="clearZz"
              >
                <svg-icon icon-class="clear"/> 重置
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="chart-ctn" style="height: 387px">
        <div class="header-search-add" style="padding: 0; height:100%">
          <div class="module-container">
            <div class="module-title">
              <div class="module-title-text">外延片在制监控</div>
            </div>
            <div class="module-content">
              <LineChart v-loading="chartLoading" id="zzrjk" :datas="zzOptions" element-loading-text="拼命加载中" height="310px" width="100%"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageHeaderLayout>
</template>

<script src="./portalfilm.js"></script>

<style scoped>
  .input-ctn{
    float:left;
    width:290px;
    height:440px
  }
  .chart-ctn{
    margin-left:300px;
    height:440px
  }
  .module-content{
    padding-left: 5px
  }
  .input-item{
    margin-bottom: 10px;
    margin-top: 0px;
    margin-right: 0px;
  }
  .el-date-editor.el-input{
    width: 191px;
  }
  .search-input{
    width: 192px;
  }
  .broad-scrollbar-table>>> th .cell .el-checkbox{
    display: none;
  }
  .broad-scrollbar-table>>> td .cell .el-checkbox{
    margin-left: 50px;
  }
  .broad-scrollbar-table>>> .el-table {
    height: 374px !important;
  }
</style>
