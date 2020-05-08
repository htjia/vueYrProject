<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0px;">
      <el-row>
        <el-col :span="20">
          <div class="input-item">
            <span class="input-title">ChipNo</span>
            <el-input v-model="binNo" class="search-input" style="width: 200px" placeholder="请输入ChipNo" size="small" maxlength="30" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">操作人</span>
            <el-input v-model="createName" class="search-input" placeholder="请输入操作人" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">类型</span>
            <el-select v-model="type" class="search-input" style="width: 80px" size="small" placeholder="请选择" clearable>
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">时间</span>
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
            class="float-right margin-top"
            style="margin-left:15px;margin-top:15px"
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
            style="margin-top:15px"
            @click="handleSearch" >查 询</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        height="calc(100vh - 232px)"
        border
        fit>
        <el-table-column align="center" label="序号" width="50px">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="ChipNo" align="center" prop="binNo"/>
        <el-table-column label="操作人" align="center" prop="createName"/>
        <el-table-column label="操作时间" align="center" prop="createTime"/>
        <el-table-column label="机台号" align="center" prop="machine"/>
        <el-table-column label="类型" align="center" prop="type">
          <template slot-scope="scope">
            {{ scope.row.type === 0 ? '正常' : '异常' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="machine">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="printLabelagain(scope.row)"
            >补打标签</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .deleteBtn{
    font-size: 30px;
    color: #d56c28;
    cursor: pointer;
    float: right;
    margin-right: 15px;
    margin-top: 5px;
  }
  .addBtn{
    transform: translateX(-50%);
    font-size: 30px;
    color: #009494;
    cursor: pointer;
    float: right;
    margin-right: 0px;
    margin-top: 5px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 202px);
  }
  .options-box{
    height: 280px;
    overflow: auto;
    margin-bottom: 10px;
  }
  .select-thead-btn{
    height: 42px;
    position: absolute;
    z-index: 200;
    right: 110px;
    top: 15px;
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
    width: 150px;
  }
</style>
