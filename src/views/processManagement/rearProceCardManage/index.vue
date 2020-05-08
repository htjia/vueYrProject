<template>
  <PageHeaderLayout >
    <div class="app-container parameter-table">
      <el-button
        v-if="!editing"
        class="float-right margin-left"
        size="small"
        type="primary"
        icon="el-icon-edit"
        @click="handleEdit"> 编 辑</el-button>
      <el-button
        v-if="editing"
        class="float-right margin-left"
        size="small"
        type="primary"
        icon="el-icon-close"
        @click="handleCancelEdit"> 取 消</el-button>
      <el-button
        v-if="editing"
        class="float-right margin-left"
        size="small"
        type="primary"
        icon="el-icon-check"
        @click="handleSubmitEdit"> 保 存</el-button>
      <div class="tab-control">
        <span
          :class="{activeTab: activeTabIndex === 0}"
          @click="tabClick(0)"
        >方片工艺</span>
        <span
          :class="{activeTab: activeTabIndex === 1}"
          class="has-margin-left"
          @click="tabClick(1)"
        >圆片工艺</span>
      </div>
      <div style="position: relative;">
        <el-table
          v-loading="listLoading"
          :data="endList"
          height="calc(100vh - 280px)"
          class="process-card-table"
          element-loading-text="拼命加载中"
          border
          fit>
          <el-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                {{ scope.$index+1 }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="站点" align="center" prop="mandataryName">
            <template slot-scope="scope">
              <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                <el-select :disabled="!editing" v-model="scope.row.siteId" placeholder="请选择站点" size="small" style="width: 95%" filterable @change="siteChange(scope.row)">
                  <el-option
                    v-for="item in endSiteOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="工序" align="center" prop="consignorName">
            <template slot-scope="scope">
              <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                <el-select :disabled="!editing" v-model="scope.row.processId" placeholder="请选择工序" size="small" style="width: 95%" filterable @change="proceChange(scope.row)">
                  <el-option
                    v-for="item in scope.row.proceOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="制造记录" align="center" prop="endTime">
            <template slot-scope="scope">
              <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                <el-input :disabled="!editing" v-model="scope.row.remark" type="text" size="small" style="width: 95%" maxlength="20"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="程序" align="center">
            <template slot-scope="scope">
              <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                <el-select :disabled="!editing" v-model="scope.row.programId" placeholder="请选择程序" size="small" style="width: 95%" filterable>
                  <el-option
                    v-for="item in scope.row.programOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="460px">
            <template slot-scope="scope">
              <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                <el-button
                  :disabled="!editing"
                  type="primary"
                  size="mini"
                  @click="handleInsert(scope.row, scope.$index)"
                ><svg-icon icon-class="insert"/> 插入</el-button>
                <el-button
                  :disabled="!editing"
                  size="mini"
                  @click="handleUp(scope.row, scope.$index)"
                ><svg-icon icon-class="moveUp"/> 上移</el-button>
                <el-button
                  :disabled="!editing"
                  size="mini"
                  @click="handleDown(endList, scope.$index)"
                ><svg-icon icon-class="moveDown"/> 下移</el-button>
                <el-button
                  :disabled="!editing"
                  size="mini"
                  class="identifying"
                  @click="handleStar(scope.row)"
                ><svg-icon icon-class="biaoshi"/> 标识</el-button>
                <el-button
                  :disabled="!editing"
                  size="mini"
                  icon="el-icon-delete"
                  type="danger"
                  @click="handleDelete(scope.$index)"
                >删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          :disabled="!editing"
          class="handle-bush"
          type="primary"
          size="small"
          circle
          @click="handlePush()"
        ><svg-icon icon-class="add"/></el-button>
      </div>
    </div>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .handle-bush{
    position: absolute;
    bottom: -40px;
    left: 50%;
    z-index: 2;
    transform: translateX(-50%);
  }
  .has-bancground{
    background: rgba(181, 184, 218, 0.84);
  }
  .identifying{
    background: #5268a5;
    color: #fff;
  }
  .identifying:hover{
    background: #5268a5;
    /*border: none;*/
  }
  .identifying:disabled{
    background: #6d78a5;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 132px);
  }
  .tab-control span{
    line-height: 35px;
  }
  .tab-control span{
    width: 110px;
  }
  .tab-control span+span{
    width: 80px;
  }
  .parameter-table>>>.el-table .errorIcon{
    width:15px;
    height: 15px;
    line-height: 15px;
    background: #009494
  }
  .divshow{
    color: #009688
  }
  .app-container>>> .el-input .el-input__inner {
    height: 30px !important;
  }
</style>
