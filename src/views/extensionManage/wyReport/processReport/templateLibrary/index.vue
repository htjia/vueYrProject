<template>
  <PageHeaderLayout>
    <div class="header-search-add height-auto" style="padding-top: 0">
      <div class="search-box">
        <div class="left-search-box">
          <div class="input-item">
            <span class="input-title">模板名称 </span>
            <el-input v-model="templateName" class="search-input" placeholder="请输入模板名称" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-search"
              @click="handleSearch" >查询</el-button>
          </div>
        </div>
        <div class="right-btn-box">
          <el-button
            v-show="isShowMenu['process-report-handle']"
            style="margin-top: 15px"
            class="float-right margin-left"
            size="small"
            type="primary"
            @click="createTemplate"><svg-icon icon-class="export"/> 创建模板</el-button>
        </div>
      </div>
    </div>
    <div class="tp-container">
      <div v-for="(item, index) in templateList" :key="index" style="padding-right: 10px">
        <div class="module-container">
          <div class="module-title">
            <div class="module-title-text">{{ item.name }}</div>
            <el-button v-show="isShowMenu['process-report-handle']" size="small" class="float-right template-but" style="color: #f56c6c" icon="el-icon-delete" type="text" @click="handleDelete(item.id)"> 删除</el-button>
            <el-button v-show="isShowMenu['process-report-handle']" size="small" class="float-right margin-right template-but" style="color: #3c7794" type="text" @click="handleEdit(item)"><svg-icon icon-class="bianji01"/> 编辑</el-button>
            <el-button size="small" class="float-right margin-right template-but" style="color: #009494" type="text" @click="handleUse(item)"><svg-icon icon-class="remarkInput"/> 使用</el-button>
          </div>
          <div class="module-content">
            <div v-for="(detail, detailInedx) in item.details.slice(0, 4)" :key="detailInedx" class="img-box">
              <img v-if="detail.chartType === '0'" style="width: 100%;height: 100%;" src="src=../../../static/img/dpsd.png">
              <img v-if="detail.chartType === '1'" style="width: 100%;height: 100%;" src="src=../../../static/img/qbsd.png">
              <img v-if="detail.chartType === '2'" style="width: 100%;height: 100%;" src="src=../../../static/img/gjt.png">
              <img v-if="detail.chartType === '3'" style="width: 100%;height: 100%;" src="src=../../../static/img/zzdj.png">
              <img v-if="detail.chartType === '4'" style="width: 100%;height: 100%;" src="src=../../../static/img/zxt.png">
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--编辑模板-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editCurrentTemplate"
      :title="currentTemplate.name"
      class="padding-dialog"
      width="500px"
    >
      <el-table
        ref="newfac"
        :data="currentTemplate.details"
        class="margin-top"
        element-loading-text="拼命加载中"
        height="400px"
        border
        row-key="id"
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="视图类型" align="center" prop="waferNo">
          <template slot-scope="scope">
            <span v-if="scope.row.chartType === '0'">单片散点图</span>
            <span v-if="scope.row.chartType === '1'">圈别散点图</span>
            <span v-if="scope.row.chartType === '2'">股价图</span>
            <span v-if="scope.row.chartType === '3'">柱状图</span>
            <span v-if="scope.row.chartType === '4'">折线图</span>
          </template>
        </el-table-column>
        <el-table-column label="配置参数" align="center" prop="tapeNo">
          <template slot-scope="scope">
            <span>{{ scope.row.leftField + ' ' + scope.row.rightField }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="tapeNo">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-delete"
              type="danger"
              @click="handleDeleteItemChart(scope.row, scope.$index)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button class="float-right margin-left" size="small" type="primary" @click="editCurrentTemplate = false">关 闭</el-button>
        <div class="clear-both"/>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./library.js"></script>

<style scoped>
  .img-box{
    width: 25%;
    float: left;
    height: 100%
  }
  .img-box{
    padding: 0 5px;
  }
  .template-but:hover,.template-but:focus,.template-but:active{
    background: none;
    border-color: transparent;
  }
  .tp-container{
    width: calc(100% + 10px);
    height: calc(100vh - 206px);
    margin-bottom: 10px;
    overflow: auto;
  }
  .tp-container>div{
    margin-bottom: 10px;
    float: left;
    width: 50%;
  }
  .module-content{
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 5px;
    padding-right: 5px;
    height: 160px;
    overflow-y: auto;
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
    width: 200px;
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
  .run-table ::-webkit-scrollbar {/*滚动条整体样式*/
    height: 10px !important;
  }
  .stsl::before{
    content: '*';
    color: #F56C6C;
    margin-right: 4px;
  }
</style>
