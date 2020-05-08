<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0">
      <div class="search-box">
        <div class="left-search-box">
          <div class="input-item">
            <span class="input-title" style="width: 35px">型号</span>
            <el-select v-model="model" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in productLists"
                :key="item.id"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width:38px">尺寸 </span>
            <el-select v-model="sizeType" class="search-input" style="width:90px;" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in substrateFindOptions"
                :key="item.id"
                :label="item.name"
                :value="item.name"/>
            </el-select>
          </div>
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
            <el-button
              size="small"
              type="primary"
              icon="el-icon-search"
              @click="handleSearch" >查询</el-button>
          </div>
          <div class="input-item">
            <el-button
              size="small"
              type="danger"
              @click="clearAll" ><svg-icon icon-class="clear"/> 重 置</el-button>
          </div>
        </div>
        <div class="right-btn-box">
          <el-button
            style="margin-top: 15px"
            class="float-right margin-left"
            size="small"
            type="primary"
            icon="el-icon-sold-out"
            @click="importExcel()"> 导出</el-button>
        </div>
      </div>
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        height="calc(100vh - 290px)"
        element-loading-text="拼命加载中"
        border
        fit
      >
        <el-table-column align="center" label="型号" prop="productCode"/>
        <el-table-column label="数量" align="center" prop="num"/>
        <el-table-column label="IR良率" align="center" prop="layer">
          <template slot-scope="scope">
            {{ scope.row.yieldIr }}
          </template>
        </el-table-column>
        <el-table-column label="VF1" align="center" prop="vf1"/>
        <el-table-column label="LOP" align="center" prop="lop"/>
        <el-table-column label="WLD" align="center" prop="wld"/>
        <el-table-column label="VF3" align="center" prop="vf3"/>
        <el-table-column label="VF4" align="center" prop="vf4"/>
        <el-table-column label="VZ" align="center" prop="vz"/>
        <el-table-column label="ESD(50V)" align="center" prop="esd50">
          <template slot-scope="scope">
            <span>{{ scope.row.esd50 }}%</span>
          </template>
        </el-table-column>
        <el-table-column label="ESD（200V)" align="center" prop="esd200">
          <template slot-scope="scope">
            <span>{{ scope.row.esd200 }}%</span>
          </template>
        </el-table-column>
        <el-table-column label="DVF" align="center" prop="dvf"/>
        <el-table-column label="综合良率" align="center" prop="slice">
          <template slot-scope="scope">
            <span>{{ scope.row.compreYield }}%</span>
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
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .edit-dialog>>>.el-dialog__body{
    padding: 20px;
  }
  .edit-dialog-table>>>.el-checkbox {
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
  .table-top-btn-group>div.active{
    color: #fff;
    background: #009494;
    border-color: #009494;
  }
  .el-checkbox {
    margin-left: 0px;
  }
</style>
