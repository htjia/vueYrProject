<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto">
      <div class="header-btn-group">
        <el-button
          size="small"
          type="primary"
          @click="handleAdd"
        ><svg-icon icon-class="add"/> 新增烘烤</el-button>
        <el-button
          size="small"
          class="float-right"
          type="primary"
          @click="handleExport"
        ><svg-icon icon-class="export"/> 导出</el-button>
      </div>
      <div style="overflow: hidden">
        <div class="input-item">
          <span class="input-title" style="width: 85px;">Platter_No </span>
          <el-input v-model="searchKeys.platterNo" class="search-input" size="small" maxlength="20" placeholder="请输入Platter_No" clearable/>
        </div>
        <div class="input-item">
          <span class="input-title" style="width: 100px;">BAKE炉号 </span>
          <el-select v-model="searchKeys.bake" class="search-input short-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in bakeOptions"
              :key="item.name"
              :label="item.name"
              :value="item.name"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">操作人 </span>
          <el-select v-model="searchKeys.operator" class="search-input short-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">入烤时间 </span>
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
        <div class="input-item" style="float: right;margin-right: 0">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="handleSearch" >查 询</el-button>
          <el-button
            size="small"
            type="danger"
            @click="clearSearch"
          >
            <svg-icon icon-class="clear"/> 重 置
          </el-button>
        </div>
      </div>
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        height="calc(100vh - 358px)"
        element-loading-text="拼命加载中"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="Platter_No" align="center" prop="platterNo"/>
        <el-table-column label="BAKE炉号" align="center" prop="bake" />
        <el-table-column label="盘位" align="center" prop="location"/>
        <el-table-column label="入烤时间" align="center" prop="startTime" width="170"/>
        <el-table-column label="烘烤时长(H)" align="center" prop="duration"/>
        <el-table-column label="出烤时间" align="center" prop="endTime" width="170"/>
        <el-table-column label="操作人" align="center" prop="operator"/>
        <el-table-column label="烘烤状态" align="center" prop="status">
          <template slot-scope="scope">
            <div v-if="scope.row.status === 0">烘烤完成</div>
            <div v-if="scope.row.status === 1" style="background: #f56c6c; color: #fff">二次烘烤</div>
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
      class="heat-dialog"
      title="新增烘烤信息"
      width="800px"
      top="65px"
      @close="handleClose('heatForm')">
      <el-form ref="heatForm" :model="heatForm" :rules="rules" status-icon label-width="110px" label-position="right">
        <el-form-item label="BAKE炉号 " size="mini" prop="bakeNum" class="float-left">
          <el-select v-model="heatForm.bakeNum" placeholder="请选择BAKE炉号" style="width: 140px" filterable>
            <el-option
              v-for="item in bakeOptions"
              :key="item.name"
              :label="item.name"
              :value="item.name"/>
          </el-select>
        </el-form-item>
        <el-form-item label="烘烤时间 " size="mini" prop="heatTime" class="float-left">
          <el-input v-model="heatForm.heatTime" placeholder="请输入烘烤时间" style="width: 140px" type="text" maxlength="2" oninput="this.value=this.value.replace(/[^0-9]/g,'');"/>
        </el-form-item>
        <el-form-item label="操作人 " size="mini" prop="operator">
          <el-select v-model="heatForm.operator" placeholder="请选择操作人" style="width: 140px" filterable>
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="border-top:1px solid #e2e2e2;padding-top: 10px; text-align: center">
        <span class="heat-title margin-right">实入数量</span><el-input v-model="numbers" :disabled="true" size="small" maxlength="20" style="width: 100px"/><span class="heat-title margin-left">盘</span>
        <el-button type="primary" size="small" style="background: #1abb9d;border-color: #1abb9d;margin-left: 65px" @click="submitForm('heatForm')"><svg-icon icon-class="kaishi"/> 开始烘烤</el-button>
      </div>
      <el-table
        ref="waferTable"
        :data="platterList"
        style="margin-top: 10px"
        class="roast-table"
        height="500"
        element-loading-text="拼命加载中"
        highlight-current-row
        border
        fit
      >
        <el-table-column align="center" label="盘位" width="150">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="Platter_No" align="center" prop="laserMark">
          <template slot-scope="scope" style="padding: 5px;">
            <el-input :ref="scope.row.id" v-model="scope.row.platterNo" size="mini" style="width: 98%;" placeholder="扫码自动读取" @blur="inputBlur(scope.row, scope.$index, $event)" @keyup.enter.native="inputBlur(scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="">
          <template slot-scope="scope">
            <i class="el-icon-delete" style="color: #f00;font-size: 16px;cursor: pointer;" @click="deleteItem(scope.row, scope.$index)"/>
            <i @click="handleUp(scope.$index)"><svg-icon style="color: #009494;font-size: 20px;cursor: pointer;" icon-class="top" /></i>
            <i @click="handleDown(scope.$index)"><svg-icon style="color: #009494;font-size: 20px;cursor: pointer;" icon-class="bottom" /></i>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .app-container>>> .cell{
    line-height: 37px;
  }
  .app-container>>> td{
    height: 37px;
  }
  .heat-dialog>>> .cell{
    line-height: 30px;
  }
  .heat-dialog>>> .el-dialog__body{
    padding: 20px
  }
  .heat-dialog>>> td{
    height: 30px;
  }
  .heat-title{
    color: #009494;
  }
  .input-item{
    float: left;
    margin-top: 14px;
    margin-right: 10px;
  }
  .search-input{
    width: 155px;
  }
  .short-input{
    width: 126px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 268px);
  }
  .heat-dialog>>>.el-form-item{
    display: inline-block;
  }
  /*.roast-table>>> .cell{*/
    /*line-height: 21px !important;*/
  /*}*/
  /*.roast-table>>> td{*/
    /*height: 21px !important;*/
  /*}*/
</style>
