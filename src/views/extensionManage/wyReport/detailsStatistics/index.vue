<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0">
      <div class="search-box">
        <div class="left-search-box">
          <div class="input-item">
            <span class="input-title" style="width: 50px">Run_ID </span>
            <el-input v-model="searchKey.runId" class="search-input" placeholder="请输入Run_ID" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">Platter_No </span>
            <el-select v-model="searchKey.platterNo" class="search-input" size="small" placeholder="请选择" filterable>
              <el-option
                v-for="item in platterList"
                :key="item.id"
                :label="item.platterNo"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 40px;">机台 </span>
            <el-select v-model="searchKey.jt" class="search-input" style="width: 100px" size="small" placeholder="请选择" filterable>
              <el-option
                v-for="item in machineList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 50px">炉次号 </span>
            <el-select v-model="searchKey.lch" class="search-input" style="width: 100px" size="small" placeholder="请选择" filterable>
              <el-option
                v-for="item in stoveList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 40px;">日期 </span>
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
      </div>
    </div>
    <div class="app-container">
      <div class="table-top-btn-group">
        <el-button
          class="float-right margin-left"
          size="small"
          type="primary"
          @click="exportAll"><svg-icon icon-class="export"/> 导出</el-button>
        <el-button
          class="float-right margin-left"
          size="small"
          type="primary"
          @click="handleConfig"><svg-icon icon-class="shezhi"/> 配置</el-button>
        <div v-for="item in tableType" :key="item.name" :class="{'active':isActive === item.id}" @click="navClick(item.id)">{{ item.name }}</div>
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        :key="tableKey"
        :cell-style="cellStyle"
        row-key="id"
        element-loading-text="拼命加载中"
        height="calc(100vh - 325px)"
        class="broad-scrollbar-table"
        border
        fit
      >
        <el-table-column label="Run_Id" align="center" prop="runId" width="100"/>
        <el-table-column label="Platter_No" align="center" prop="platterNo"/>
        <el-table-column v-for="item in tableColunms" :label="item.thName" :key="item.thName" :prop="item.thKey" align="center" width="27">
          <template slot-scope="scope">
            <el-tooltip placement="top-start">
              <div slot="content">
                {{ scope.row[item.inventoryKey] }}
              </div>
              <div>{{ scope.row[item.thKey] }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
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
      class="padding-dialog"
      title="配置"
      width="600px"
      @close="configClose"
    >
      <div class="input-item" style="margin-top: 0;margin-bottom: 10px">
        <span class="input-title" style="width: 65px">表格类型 </span>
        <el-select v-model="configTableType" class="search-input" size="small" placeholder="请选择" filterable @change="tableTypeChange">
          <el-option
            v-for="item in tableType"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </div>
      <div v-show="configTableType === 0 || configTableType === 1 || configTableType === 4 || configTableType === 5 || configTableType === 6 || configTableType === 7 || configTableType === 8 || configTableType === 9" class="input-item" style="margin-top: 0;margin-bottom: 10px">
        <el-button size="small" type="primary" icon="el-icon-add" @click="addNewConfig" ><svg-icon icon-class="add"/> 新 增</el-button>
      </div>
      <el-table
        v-show="!isVisual"
        ref="newfac"
        :data="configList"
        class="config-table"
        element-loading-text="拼命加载中"
        height="400px"
        row-key="id"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="范围配置" align="center">
          <el-table-column label="下限" align="center">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isEdit" v-model="scope.row.minVal" class="search-input" size="mini" style="width:90%" type="number" onkeyup="if(this.value.length > 10){this.value = this.value.slice(0, 10)}" clearable/>
              <span v-if="!scope.row.isEdit">{{ scope.row.minVal }}</span>
            </template>
          </el-table-column>
          <el-table-column label="上限" align="center">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isEdit" v-model="scope.row.maxVal" class="search-input" size="mini" style="width:90%" type="number" onkeyup="if(this.value.length > 10){this.value = this.value.slice(0, 10)}" clearable/>
              <span v-if="!scope.row.isEdit">{{ scope.row.maxVal }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" label="颜色" width="50">
          <template slot-scope="scope">
            <el-color-picker :disabled="!scope.row.isEdit" v-model="scope.row.color" size="small"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="status">
          <template slot-scope="scope">
            <el-button
              v-if="!scope.row.isEdit"
              size="mini"
              icon="el-icon-edit"
              type="primary"
              @click="handleEdit(scope.row)"
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
              size="mini"
              icon="el-icon-close"
              type="danger"
              @click="handleCancel"
            >取消</el-button>
            <el-button
              size="mini"
              icon="el-icon-delete"
              type="danger"
              @click="handleDelete(scope.row, scope.$index)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-show="isVisual"
        ref="newfac"
        :data="configList"
        class="config-table"
        element-loading-text="拼命加载中"
        height="400px"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column v-if="configTableType === 2" label="等级" align="center" prop="judgementLevel"/>
        <el-table-column v-if="configTableType === 3" label="目检等级" align="center" prop="visualName"/>
        <el-table-column align="center" label="颜色" width="50">
          <template slot-scope="scope">
            <el-color-picker :disabled="!scope.row.isEdit" v-model="scope.row.color" size="small"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="status">
          <template slot-scope="scope">
            <el-button
              v-if="!scope.row.isEdit"
              size="mini"
              icon="el-icon-edit"
              type="primary"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              v-if="scope.row.isEdit"
              size="mini"
              icon="el-icon-check"
              type="primary"
              @click="handleSaveVisual(scope.row)"
            >保存</el-button>
            <el-button
              v-if="scope.row.isEdit"
              size="mini"
              icon="el-icon-close"
              type="danger"
              @click="handleCancel"
            >取消</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./details.js"></script>

<style scoped>
  .input-title{
    width: 75px;
  }
  .title-postion{
    top: 13px;
    background: #fff;
    z-index: 15;
    position: relative;
    width: 85px;
    padding: 5px;
    left: 16px;
    font-weight: bold;
    font-size: 14px;
    text-align: center;
  }
  .set-border{
    border: 1px solid rgb(220, 223, 230);
    padding-top: 20px;
    padding-bottom: 0px;
  }
  .edit-dialog>>>.el-dialog__body{
    padding-top: 10px;
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
    width: 140px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 204px);
  }
  .table-top-btn-group{
    overflow: hidden;
  }
  .table-top-btn-group>div{
    float: left;
    margin-left: 10px;
    height: 35px;
    line-height: 35px;
    padding: 0 10px;
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
  .run-table ::-webkit-scrollbar {/*滚动条整体样式*/
    height: 10px !important;
  }
  .stsl::before{
    content: '*';
    color: #F56C6C;
    margin-right: 4px;
  }
  .config-table >>> .cell{
    line-height: 28px;
  }
  .config-table >>> .el-table__row td{
    height: 28px;
  }
  .el-table td div{
    vertical-align: middle;
  }
</style>
