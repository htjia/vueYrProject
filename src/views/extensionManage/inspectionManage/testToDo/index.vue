<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0">
      <div class="search-box">
        <div class="left-search-box">
          <div class="input-item" style="margin-left: -20px;">
            <span class="input-title">RunID </span>
            <el-input v-model="runId" class="search-input" placeholder="请输入RunID" size="small" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">机台 </span>
            <el-select v-model="machineValue" class="search-input" size="small" placeholder="请选择" filterable>
              <el-option
                v-for="item in machineOptions"
                :key="item.id"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">炉次 </span>
            <el-select v-model="furnaceValue" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in furnaceOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">状态 </span>
            <el-select v-model="statusValue" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in statusList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">导入时间 </span>
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
            style="margin-top: 15px"
            class="float-right margin-left"
            size="small"
            type="danger"
            @click="clearAll"
          >
            <svg-icon icon-class="clear"/> 重 置
          </el-button>
          <el-button
            style="margin-top: 15px"
            class="float-right"
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
          Run信息
        </div>
        <div
          :class="{'active':isActive === 1}"
          @click="navClick(1)"
        >
          Wafer信息TOL: <span v-text="waferTol"/>
        </div>
      </div>
      <el-table
        v-loading="listLoading"
        v-show="isActive === 0"
        ref="listTabel"
        :data="list"
        class="mocvd-table broad-scrollbar-table"
        height="calc(100vh - 321px)"
        element-loading-text="拼命加载中"
        highlight-current-row
        border
        fit
        @current-change="handleCurrentChange"
        @cell-dblclick="cellDblclick">
        <el-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
          </template>
        </el-table-column>
        <el-table-column label="RunID" align="center" prop="runId" width="150" fixed/>
        <el-table-column label="Recipe_Name" align="center" prop="recipeName" width="120"/>
        <el-table-column label="状态" align="center" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.finalStatus === '0'">衬底投片</span>
            <span v-if="scope.row.finalStatus === '1'">生长完成</span>
            <span v-if="scope.row.finalStatus === '2'">待补长</span>
            <span v-if="scope.row.finalStatus === '4'">目检完成</span>
            <span v-if="scope.row.finalStatus === '3'">测试完成</span>
            <span v-if="scope.row.finalStatus === '5'">目检测试完成</span>
            <span v-if="scope.row.finalStatus === '6'">COW数据返回</span>
            <span v-if="scope.row.finalStatus === '7'">已送验证片</span>
            <span v-if="scope.row.finalStatus === '8'">已入库</span>
          </template>
        </el-table-column>
        <el-table-column label="结构类型" align="center" prop="structureCode"/>
        <el-table-column label="衬底类型" align="center" prop="substrateCode"/>
        <el-table-column label="生产类型" align="center" prop="produceCode"/>
        <el-table-column label="机台" align="center" prop="machineCode"/>
        <el-table-column label="炉次" align="center" prop="stoveCode"/>
        <el-table-column label="Platter_No" align="center" prop="platterNo" width="120"/>
        <el-table-column label="使用次数" align="center" prop="platterTotal"/>
        <el-table-column label="铝氮ID号" align="center" width="120">
          <template slot-scope="scope">
            {{ scope.row.alnIds[0] }}
          </template>
        </el-table-column>
        <el-table-column label="投片时间" align="center" prop="createTime" width="120" show-overflow-tooltip/>
        <el-table-column label="保存时间" align="center" prop="saveTime" width="120" show-overflow-tooltip/>
        <el-table-column label="目标波长" align="center" prop="wavelength"/>
        <el-table-column label="放片人" align="center" prop="creatorName"/>
        <el-table-column label="开始时间" align="center" prop="startTime" width="120" show-overflow-tooltip/>
        <el-table-column label="待机时间" align="center" prop="standbyTime"/>
        <el-table-column label="运行时间" align="center" prop="runTime"/>
        <el-table-column label="取片人" align="center" prop="takerName"/>
        <el-table-column label="结束时间" align="center" prop="endTime" width="120" show-overflow-tooltip/>
        <el-table-column label="波长调整人" align="center" prop="adjustsName"/>
        <el-table-column label="待机原因" align="center" prop="standbyReasonName"/>
        <el-table-column label="备注" align="center" prop="remark" width="200" show-overflow-tooltip/>
      </el-table>
      <!--wafer信息-->
      <el-table
        v-loading="listLoading"
        v-show="isActive === 1"
        :data="anotherlist"
        class="mocvd-table run-table"
        height="calc(100vh - 321px)"
        element-loading-text="拼命加载中"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="RunID" align="center" prop="runId" width="150px"/>
        <el-table-column label="WaferID" align="center" prop="waferId" width="150px"/>
        <el-table-column label="衬底工艺" align="center" prop="substrateType"/>
        <el-table-column label="铝氮ID" align="center" prop="boxNo" width="150px">
          <template slot-scope="scope">
            {{ scope.row.alnId }}
          </template>
        </el-table-column>
        <el-table-column label="单/双抛" align="center" prop="singleDoubleThrow"/>
        <el-table-column label="衬底尺寸" align="center">
          <template slot-scope="scope">
            {{ scope.row.measureCode }}
          </template>
        </el-table-column>
        <el-table-column label="衬底厂家" align="center" prop="supplier"/>
        <el-table-column label="镭刻号" align="center" prop="laserMark" width="150px"/>
        <el-table-column label="SWR" align="center" prop="swr"/>
        <el-table-column label="目检" align="center" prop="visualLevelCode"/>
        <el-table-column label="原因" align="center" prop="exceptionName"/>
        <el-table-column label="备注" align="center" prop="remark"/>
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
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
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
    margin-top: 15px;
    margin-right: 10px;
  }
  .search-input{
    width: 140px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 207px);
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
  .app-container>>> .el-table--border {
    border-top: 2px solid #009494;
  }
  .table-top-btn-group>div.active{
    color: #fff;
    background: #009494;
    border-color: #009494;
  }
  .broad-scrollbar-table>>>.el-table__fixed-body-wrapper {
    height: calc(100vh - 417px) !important;
  }
  .broad-scrollbar-table>>>.el-table__fixed {
    height: calc(100vh - 376px) !important;
  }
</style>
