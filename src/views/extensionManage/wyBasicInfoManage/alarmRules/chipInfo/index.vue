<template>
  <PageHeaderLayout >
    <div class="app-container">
      <!--<div class="tab-control">
        <span
          :class="{activeTab: activeTabIndex === 0}"
          @click="tabClick(0)"
        >PL</span>
        <span
          :class="{activeTab: activeTabIndex === 1}"
          class="has-margin-left"
          @click="tabClick(1)"
        >EL</span>
        <span
          :class="{activeTab: activeTabIndex === 2}"
          class="has-margin-left"
          @click="tabClick(2)"
        >XRD</span>
      </div> -->
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="报警名称" align="center" prop="name"/>
        <el-table-column label="通知范围" align="center" prop="involveScopeName"/>
        <el-table-column label="启用状态" align="center" prop="status">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isChecked" @change="setStatus(scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="status">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="ruleSetting(scope.row)"
            ><svg-icon icon-class="baojinguize"/> 报警规则设定</el-button>
            <el-button
              size="mini"
              type="primary"
              @click="configGroup(scope.row)"
            ><svg-icon icon-class="lvdanxinxsz"/> 通知组配置</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="ruleSettingDialogVisible"
      title="规则设定"
      width="800px">
      <div>
        <el-table
          v-loading="listLoading"
          :data="dplist"
          element-loading-text="拼命加载中"
          border
          fit
        >
          <el-table-column align="center" label="启用状态" width="120px">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.isChecked" @change="setStatuss(scope.row)"/>
            </template>
          </el-table-column>
          <el-table-column label="规则" align="center" prop="status">
            <template slot-scope="scope">
              <div v-if="scope.row.name === 'PL_wd和同圈均值偏差＞'">
                <span>PL_wd和同圈均值偏差＞</span>
                <el-input v-model="scope.row.val" class="search-input inputs" size="small" maxlength="6"/>nm
              </div>
              <div v-if="scope.row.name === 'PL_STD＞'">
                <span style="margin-left: 70px;">PL_STD＞</span>
                <el-input v-model="scope.row.val" class="search-input inputs" size="small" maxlength="6"/>
              </div>
              <div v-if="scope.row.name === 'PL_I.I和同圈均值偏差＜'">
                <span style="margin-left: -10px;">PL_I.I和同圈均值偏差＜</span>
                <el-input v-model="scope.row.val" class="search-input inputs" size="small" maxlength="6"/>
              </div>
              <div v-if="scope.row.name === '目检等级为'">
                <span style="margin-left: -49px;margin-right: 17px;">目检等级为</span>
                <el-select v-model="scope.row.val" class="search-input inputs" size="small" placeholder="请选择" filterable clearable>
                  <el-option
                    v-for="item in levelList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm()">确 定</el-button>
        <el-button @click="resetForm()">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="ruleSettingDialogVisible1"
      class="tip-out-inner-dialog"
      title="规则设定"
      width="800px">
      <div>
        <el-tabs type="border-card" style="height: 300px;">
          <el-tab-pane v-for="(item, i) in cdList" :key="item.id" :label="item.name">
            <el-row>
              <el-col :span="12">
                <div>
                  <span>VF1</span>
                  <el-input v-model="elValueList[i].VF1min" class="search-input inputsx" size="small" maxlength="20"/>
                  <span> ~ </span>
                  <el-input v-model="elValueList[i].VF1max" class="search-input inputsx" size="small" maxlength="20"/>
                </div>
                <div>
                  <span>VF2</span>
                  <el-input v-model="elValueList[i].VF2min" class="search-input inputsx" size="small" maxlength="20"/>
                  <span> ~ </span>
                  <el-input v-model="elValueList[i].VF2max" class="search-input inputsx" size="small" maxlength="20"/>
                </div>
                <div>
                  <span>VF3</span>
                  <el-input v-model="elValueList[i].VF3min" class="search-input inputsx" size="small" maxlength="20"/>
                  <span> ~ </span>
                  <el-input v-model="elValueList[i].VF3max" class="search-input inputsx" size="small" maxlength="20"/>
                </div>
                <div>
                  <span>VF4</span>
                  <el-input v-model="elValueList[i].VF4min" class="search-input inputsx" size="small" maxlength="20"/>
                  <span> ~ </span>
                  <el-input v-model="elValueList[i].VF4max" class="search-input inputsx" size="small" maxlength="20"/>
                </div>
              </el-col>
              <el-col :span="12">
                <div>
                  <span style="margin-left:40px">LOP</span>
                  <el-input v-model="elValueList[i].LOPmin" class="search-input inputsx" size="small" maxlength="20"/>
                  <span> ~ </span>
                  <el-input v-model="elValueList[i].LOPmax" class="search-input inputsx" size="small" maxlength="20"/>
                </div>
                <div>
                  <span>WLD/WLP</span>
                  <el-input v-model="elValueList[i].WLDmin" class="search-input inputsx" size="small" maxlength="20"/>
                  <span> ~ </span>
                  <el-input v-model="elValueList[i].WLDmax" class="search-input inputsx" size="small" maxlength="20"/>
                </div>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormEl()">确 定</el-button>
        <el-button @click="resetForm()">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="configDialogVisible"
      class="tip-out-inner-dialog"
      title="通知组配置"
      width="500px">
      <div style="height: 450px;overflow: auto;">
        <el-tree
          ref="tree"
          :data="treeList"
          :props="defaultProps"
          :default-expanded-keys="expandenList"
          show-checkbox
          node-key="id"/>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormTree()">确 定</el-button>
        <el-button @click="configDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .tip-out-inner-dialog>>>.el-tabs .el-tabs__nav-prev{
    width: 20px;
    padding-left: 8px;
    margin-top: -3px;
  }
  .tip-out-inner-dialog>>>.el-tabs .el-tabs__nav-next{
    width: 20px;
    padding-right: 0px;
    margin-top: -3px;
  }
  .tip-out-inner-dialog>>>.el-tabs__nav .is-top:nth-child(2){
    padding-left: 20px;
  }
  .tip-out-inner-dialog>>>.el-checkbox{
    margin-left: 0;
  }
  .inputs{
    width: 50%;
    margin: 0 15px;
  }
  .inputsx{
    width: 28%;
    margin: 10px 15px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 132px);
  }
  .tab-control span{
    line-height: 50px;
  }
  .short-input{
    width: 100px;
  }
  .tip-out-inner-dialog>>>.el-tabs__header{
    background-color: #d6eeee;
    border-bottom: 1px solid #b2dfdf;
  }
  .tip-out-inner-dialog>>>.el-tabs__header .is-active{
    color: #009494 !important;
    border-right-color: #b2dfdf;
    border-left-color: #b2dfdf;
  }
  .tip-out-inner-dialog>>>.el-tabs__header .is-active:hover{
    color: #009494 !important;
  }
  .tip-out-inner-dialog>>>.el-tabs__header .el-tabs__item{
    color: #666;
    font-weight: bold;
  }
  .tip-out-inner-dialog>>>.el-tabs__header .el-tabs__item:hover{
    color: #666;
    font-weight: bold;
  }
  .tip-out-inner-dialog>>>.el-tabs--border-card{
    border: 1px solid #b2dfdf;
  }
</style>
