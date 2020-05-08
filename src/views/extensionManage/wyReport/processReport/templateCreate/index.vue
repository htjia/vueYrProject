
<template>
  <PageHeaderLayout :has_back="true">
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
              @click="addTemplate('工艺视图配置')" ><svg-icon icon-class="add"/> 新增工艺视图</el-button>
            <el-button
              size="small"
              type="primary"
              @click="addTemplate('COW/COT视图配置')" ><svg-icon icon-class="add"/> 新增COW/COT视图</el-button>
          </div>
        </div>
        <div class="right-btn-box">
          <el-button
            :disabled="libraryId === ''"
            style="margin-top: 15px"
            class="float-right margin-left"
            size="small"
            type="primary"
            icon="el-icon-check"
            @click="finishedCreateTemplate"> 完成创建</el-button>
        </div>
      </div>
    </div>
    <div class="app-container">
      <div style="width: 1366px; margin: 0 auto;">
        <el-row :gutter="15">
          <el-col :span="9">
            <span class="module-title-text" style="margin-bottom: 15px">{{ moduleTitle }}</span>
            <div class="config-content clear-both">
              <div class="input-item">
                <span class="input-title input-title-long">图表类型 </span>
                <el-select v-if="moduleTitle === '工艺视图配置'" v-model="chartModel" style="width: 370px;" size="small" placeholder="请选择" filterable clearable @change="chartModelChange()">
                  <el-option
                    v-for="item in chartModelOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
                <el-input v-else :disabled="true" value="折线图" style="width: 370px;" size="small"/>
              </div>
              <div class="input-item">
                <span class="input-title input-title-long" style="float: left;">参数配置 </span>
                <div class="tree-box">
                  <el-input v-model="filterText" placeholder="参数搜索" size="small"/>
                  <div class="tree">
                    <el-tree
                      ref="tree"
                      :data="treeList"
                      :props="defaultProps"
                      :filter-node-method="filterNode"
                      :default-expand-all="true"
                      :key="treeKey"
                      show-checkbox
                      node-key="id"
                      @check="checkChange()"
                    />
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="15">
            <span class="module-title-text" style="margin-bottom: 15px">图表预览</span>
            <div class="config-content clear-both">
              <img v-if="chartModel === 0 && moduleTitle === '工艺视图配置'" style="width: 100%;height: 100%;" src="src=../../../static/img/dpsd.png">
              <img v-if="chartModel === 1 && moduleTitle === '工艺视图配置'" style="width: 100%;height: 100%;" src="src=../../../static/img/qbsd.png">
              <img v-if="chartModel === 2 && moduleTitle === '工艺视图配置'" style="width: 100%;height: 100%;" src="src=../../../static/img/gjt.png">
              <img v-if="chartModel === 3 && moduleTitle === '工艺视图配置'" style="width: 100%;height: 100%;" src="src=../../../static/img/zzdj.png">
              <img v-if="moduleTitle !== '工艺视图配置'" style="width: 100%;height: 100%;" src="src=../../../static/img/zxt.png">
            </div>
          </el-col>
        </el-row>
        <div class="cut-line"/>
        <div style="text-align: center">
          <el-button type="primary" icon="el-icon-check" @click="submitForm()">保 存</el-button>
          <el-button icon="el-icon-close" @click="submitCancel()">取 消</el-button>
        </div>
      </div>
    </div>
  </PageHeaderLayout>
</template>

<script src="./create.js"></script>

<style scoped>
  .cut-line{
    border-bottom: 1px solid #e2e2e2;
    margin-bottom: 10px;
    margin-top: 10px;
  }
  .tree-box{
    float: left;
    width: 370px;
    margin-left: 3px;
    border-radius: 4px;
  }
  .tree{
    overflow: auto;
    margin-top: 10px;
    border: 1px solid rgb(226, 226, 226);
    height: 380px;
  }
  .tree>>> .el-tree>.el-tree-node>.el-tree-node__content>.el-checkbox{
    display: none;
  }
  .input-title-long{
    width: 100px;
    text-align: right;
  }
  .config-content{
    border: 1px solid #e2e2e2;
    height: 500px;
  }
  .input-item{
    float: left;
    margin-top: 15px;
    margin-right: 10px;
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
  .search-input{
    width: 200px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 204px);
  }
  .search-input{
    width: 200px;
  }
</style>
