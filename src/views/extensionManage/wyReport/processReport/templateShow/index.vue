<template>
  <PageHeaderLayout :has_back="true">
    <div class="header-search-add height-auto" style="padding-top: 15px;">
      <div class="header-btn-group">
        <span class="input-title">模板名称:</span><span style="margin-right: 30px">{{ templateName }}</span>
        <el-select v-show="isShowMenu['process-report-handle']" v-model="chartType" class="search-input" style="width: 200px" size="small" placeholder="请选择新增的视图类型" filterable>
          <el-option
            v-for="item in chartTypeOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
        <el-button
          v-show="isShowMenu['process-report-handle']"
          size="small"
          type="primary"
          @click="handleAdd"
        ><svg-icon icon-class="add"/> 新增视图</el-button>
        <el-button
          class="float-right"
          size="small"
          type="primary"
          @click="handleExport"
        ><svg-icon icon-class="export"/> 导出图表</el-button>
        <div class="clear-both"/>
      </div>
      <div style="position: relative;">
        <div class="input-item">
          <span class="input-title">生产类型</span>
          <el-select v-model="searchKeys.sclx" class="search-input" size="small" placeholder="请选择" filterable clearable multiple collapse-tags>
            <el-option
              v-for="item in produceTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title" style="width: 35px;">尺寸</span>
          <el-select v-model="searchKeys.size" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in sizeOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">结构类型</span>
          <el-select v-model="searchKeys.jglx" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in structureTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">机台配置</span>
          <el-select v-model="searchKeys.jt" class="search-input" size="small" placeholder="请选择" filterable clearable multiple collapse-tags>
            <el-option
              v-for="item in machineListOption"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title" style="width: 140px;">COW/COT验证版型</span>
          <el-select v-model="searchKeys.yzbx" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in substrateFindOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">截止日期</span>
          <el-date-picker
            v-model="endDate"
            :picker-options="pickerOptionsStart"
            :editable="false"
            class="search-input"
            size="small"
            type="date"
            placeholder="截止日期"
            value-format="yyyy-MM-dd"
          />
        </div>
        <div class="input-item">
          <span class="input-title">统计周期</span>
          <el-input v-model="searchKeys.zq" class="search-input" placeholder="统计周期" onkeyup="this.value=this.value.replace(/[^\d]/g,'')" size="small" maxlength="2" clearable/>
        </div>
        <div class="input-item">
          <span class="input-title">周期数</span>
          <el-input v-model="searchKeys.zqs" class="search-input" placeholder="周期数" onkeyup="this.value=this.value.replace(/[^\d]/g,'')" size="small" maxlength="1" clearable/>
        </div>
        <div class="input-item">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="handleCreate" >生 成</el-button>
          <el-button
            size="small"
            type="danger"
            @click="clearSearch"
          >
            <svg-icon icon-class="clear"/> 重 置
          </el-button>
        </div>
        <div class="clear-both"/>
      </div>
    </div>
    <div v-loading="listLoading" class="app-container results" element-loading-text="拼命加载中">
      <div v-if="chartList.length === 0" class="no-data">
        <svg-icon class="no-data-icon" icon-class="noData" style="margin-top: 100px"/>
        <div>请输入搜索条件生成图表</div>
      </div>
      <div ref="print">
        <component v-for="(item, index) in chartList" :is="item.chartType" :key="index" :id="index + 'chart'" :datas="item.data"/>
      </div>
    </div>
  </PageHeaderLayout>
</template>

<script src="./show.js"></script>

<style scoped>
  .input-item{
    float: left;
    margin-top: 14px;
    margin-right: 10px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 312px);
  }
  .module-title-text{
    margin-bottom: 10px;
  }
  .module-title {
    margin-bottom: 10px;
  }
  .search-input{
    width: 138px;
  }
  .input-title{
    width: 65px;
  }
  .dialog-input{
    width: 260px;
  }
  .padding-dialog>>> .el-dialog__footer{
    /*text-align: center;*/
  }
  .padding-dialog>>> .el-checkbox {
    margin-left: 138px;
  }
  .img-dialog>>> .el-dialog__header{
    background: #fff;
  }
  .img-dialog>>> .el-dialog__headerbtn .el-dialog__close {
    color: #bbb;
  }
  .padding-dialog>>> .el-dialog__body {
    padding-top: 0px;
  }
  .padding-dialog>>> .el-upload{
    display: none;
  }
</style>
