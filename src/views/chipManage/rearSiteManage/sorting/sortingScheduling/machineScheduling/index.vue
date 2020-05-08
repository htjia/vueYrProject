<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0">
      <div style="text-align:left">
        <div class="input-item">
          <span class="input-title" style="width:60px">机台号</span>
          <el-select v-model="machine" class="search-input" style="width: 80px" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in machineList"
              :key="item.id"
              :label="item.code"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">产品代码 </span>
          <el-select v-model="productCode" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in productLists"
              :key="item.id"
              :label="item.code"
              :value="item.code"/>
          </el-select>
        </div>
        <el-button
          class="margin-top"
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="fetchData" >查 询</el-button>
        <el-button
          class="margin-top"
          style="margin-left:15px"
          size="small"
          type="danger"
          @click="clearSearch"
        >
          <svg-icon icon-class="clear"/> 重 置
        </el-button>
      </div>
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        height="calc(100vh - 235px)"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="分选机台号" align="center" prop="code"/>
        <el-table-column label="产品代码" align="center" prop="fxType"/>
        <el-table-column label="光色" align="center">
          <template slot-scope="scope">
            <el-select v-if="scope.row.isEdit" v-model="scope.row.color" class="search-input" style="width:90%" size="small" placeholder="请选择" filterable clearable @change="getBinList(scope.$index,1)">
              <el-option
                v-for="item in colorList"
                :key="item.id"
                :label="item.code"
                :value="item.code"/>
            </el-select>
            <span v-if="!scope.row.isEdit">
              {{ scope.row.color }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="型号" align="center">
          <template slot-scope="scope">
            <el-select v-if="scope.row.isEdit" v-model="scope.row.model" class="search-input" style="width:90%" size="small" placeholder="请选择" filterable clearable @change="getBinList(scope.$index,1)">
              <el-option
                v-for="item in modelList"
                :key="item.id"
                :label="item.code"
                :value="item.code"/>
            </el-select>
            <span v-if="!scope.row.isEdit">
              {{ scope.row.model }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="工艺" align="center">
          <template slot-scope="scope">
            <el-select v-if="scope.row.isEdit" v-model="scope.row.craft" class="search-input" style="width:90%" size="small" placeholder="请选择" filterable clearable @change="getBinList(scope.$index,1)">
              <el-option
                v-for="item in gyList"
                :key="item.id"
                :label="item.code"
                :value="item.code"/>
            </el-select>
            <span v-if="!scope.row.isEdit">
              {{ scope.row.craft }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="Bin版本" width="250" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-select v-if="scope.row.isEdit" v-model="scope.row.binVersion" multiple collapse-tags class="search-input" style="width:90%" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in findBinLists"
                :key="item.id"
                :label="item.version"
                :value="item.version"/>
            </el-select>
            <span v-if="!scope.row.isEdit">
              {{ scope.row.binVersion }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="COT机台" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-select v-if="scope.row.isEdit" v-model="scope.row.machineCot" multiple collapse-tags class="search-input" style="width:90%" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in cotMachineList"
                :key="item.id"
                :label="item.code"
                :value="item.code"/>
            </el-select>
            <span v-if="!scope.row.isEdit">
              {{ scope.row.machineCot }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="status">
          <template slot-scope="scope">
            <el-button
              v-if="!scope.row.isEdit"
              size="mini"
              icon="el-icon-edit"
              type="primary"
              @click="handleEdit(scope.row,scope.$index)"
            >编辑</el-button>
            <el-button
              v-if="scope.row.isEdit"
              size="mini"
              icon="el-icon-check"
              type="primary"
              @click="handleSave(scope.row)"
            >保存</el-button>
            <el-button
              v-if="scope.row.isEdit"
              style="margin-left:15px"
              size="mini"
              type="danger"
              @click="handCansel(scope.row)"
            ><svg-icon icon-class="clear"/>取消
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .app-container{
    position: relative;
    height: calc(100vh - 203px);
  }
  .tab-control span{
    line-height: 50px;
  }
  .el-checkbox {
    margin-left: 0px;
  }
  .titles{
    width: 100%;
    text-align: center;
    font-size: 22px;
    padding: 15px;
    color: #009494;
    font-weight: bold;
  }
  .input-item{
    float: left;
    margin-top: 15px;
    margin-right: 10px;
  }
  .margin-top{
    margin-top:15px;
  }
  .search-input{
    width: 150px;
  }
</style>
