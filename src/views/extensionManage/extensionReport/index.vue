<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0">
      <div class="search-box">
        <div class="left-search-box" style="margin-left: -20px;">
          <div class="input-item">
            <span class="input-title">RunID </span>
            <el-input v-model="runId" class="search-input" size="small" placeholder="请输入RunID" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">机台 </span>
            <el-select v-model="machineValue" class="search-input" size="small" style="width:130px" placeholder="请选择" multiple collapse-tags filterable>
              <el-option
                v-for="item in machineOptions"
                :key="item.id"
                :label="item.name"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">炉次 </span>
            <el-select v-model="furnaceValue" class="search-input" size="small" style="width:130px" placeholder="请选择" multiple collapse-tags filterable clearable>
              <el-option
                v-for="item in furnaceOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">尺寸 </span>
            <el-select v-model="cdValue" class="search-input" size="small" style="width:150px" placeholder="请选择" multiple collapse-tags filterable clearable>
              <el-option
                v-for="item in cdfindListOption"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 90px;">Platter_No </span>
            <el-select v-model="mocvdValue" class="search-input" size="small" style="width:195px" placeholder="请选择" multiple collapse-tags filterable clearable>
              <el-option
                v-for="item in mocvdLists"
                :key="item.id"
                :label="item.platterNo"
                :value="item.id"/>
            </el-select>
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
            <el-button
              size="small"
              type="primary"
              class="margin-left"
              icon="el-icon-search"
              @click="handleSearch" >查 询</el-button>
            <el-button
              class="margin-left"
              size="small"
              type="danger"
              @click="clearAll"
            >
              <svg-icon icon-class="clear"/> 重 置
            </el-button>
          </div>
        </div>
        <div class="right-btn-box">
          <el-button
            size="small"
            class="float-right margin-left"
            style="margin-top: 15px"
            type="primary"
            @click="importExcel"
          ><svg-icon icon-class="export"/> 导 出</el-button>
        </div>
      </div>
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        class="broad-scrollbar-table"
        height="calc(100vh - 327px)"
        highlight-current-row
        border
        fit
        @sort-change="getSort">
        <el-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="RunID" width="120" prop="runId" sortable="custom" fixed/>
        <el-table-column align="center" label="Platter_No" width="120" prop="platterNo" sortable="custom"/>
        <!--:render-header="DYrenderHeader"-->
        <el-table-column :render-header="DYrenderHeader" align="center" label="WD" prop="wd" min-width="80px" sortable="custom"/>
        <el-table-column :render-header="DYrenderHeader" align="center" label="5nm" prop="5nm" sortable="custom"/>
        <el-table-column :render-header="DYrenderHeader" align="center" label="8nm" prop="8nm" sortable="custom"/>
        <el-table-column :render-header="DYrenderHeader" align="center" label="STD" prop="std" sortable="custom"/>
        <el-table-column :render-header="DYrenderHeader" align="center" label="STD>2" prop="std2" sortable="custom"/>
        <!-- <el-table-column :render-header="DYrenderHeader" align="center" label=">P30" prop="p30"/> -->
        <el-table-column :render-header="DYrenderHeader" align="center" label="目检降档" prop="p50" width="90px" sortable="custom"/>
        <el-table-column :render-header="DYrenderHeader" align="center" label="R" prop="R" sortable="custom"/>
        <el-table-column :render-header="DYrenderHeader" align="center" label="I.I" prop="ii" sortable="custom"/>
        <el-table-column :render-header="DYrenderHeader" align="center" label="Thick" prop="Thick" sortable="custom"/>
        <el-table-column :render-header="DYrenderHeader" align="center" label="Bow" prop="BOW" sortable="custom"/>
        <el-table-column :render-header="DYrenderHeader" align="center" label="PERIOD" prop="period" min-width="90px" sortable="custom"/>
        <el-table-column :render-header="DYrenderHeader" align="center" label="Al%" prop="AI" sortable="custom"/>
        <el-table-column :render-header="DYrenderHeader" align="center" label="XRD_002" min-width="100px" prop="XRD_002" sortable="custom"/>
        <el-table-column :render-header="DYrenderHeader" align="center" label="XRD_102" min-width="100px" prop="XRD_102" sortable="custom"/>
        <el-table-column :render-header="DYrenderHeader" align="center" label="EL" prop="EL" sortable="custom"/>
        <el-table-column :render-header="DYrenderHeader" align="center" label="EL_VF4" prop="EL_VF4" sortable="custom"/>
        <el-table-column align="center" label="Size" prop="size" sortable="custom"/>
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
    width: 300px;
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
    height: calc(100vh - 250px);
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
  .broad-scrollbar-table>>>.el-table__fixed-body-wrapper {
    height: calc(100vh - 408px) !important;
  }
  .broad-scrollbar-table>>>.el-table__fixed {
    height: calc(100vh - 341px) !important;
  }
  .app-container>>>.el-table .cell p{
    line-height: 15px
  }
  .app-container>>>.el-table th .cell{
    height: 65px
  }
</style>
