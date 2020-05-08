<template>
  <PageHeaderLayout >
    <div class="app-container">
      <div class="tab-control">
        <span
          :class="{activeTab: activeTabIndex === 0}"
          @click="tabClick(0)"
        >ITO蒸镀</span>
        <span
          :class="{activeTab: activeTabIndex === 1}"
          class="has-margin-left"
          @click="tabClick(1)"
        >电极蒸镀</span>
        <span
          :class="{activeTab: activeTabIndex === 2}"
          class="has-margin-left"
          @click="tabClick(2)"
        >蚀刻</span>
        <span
          :class="{activeTab: activeTabIndex === 3}"
          class="has-margin-left"
          @click="tabClick(3)"
        >沉积</span>
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        :span-method="objectSpanMethod"
        element-loading-text="拼命加载中"
        class="run-table"
        height="calc(100vh - 203px)"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="50" prop="index"/>
        <el-table-column label="程序" align="center" prop="programName" width="160px" show-overflow-tooltip/>
        <el-table-column label="配置内容" align="center">
          <el-table-column align="center" label="控制项目" prop="controlPragram" width="150px"/>
          <el-table-column align="center" label="测量单位" prop="testUnit"/>
          <el-table-column align="center" label="规格">
            <el-table-column align="center" label="上限USL" prop="usl"/>
            <el-table-column align="center" label="中心限CL" prop="cl"/>
            <el-table-column align="center" label="下限LSL" prop="lsl"/>
          </el-table-column>
          <el-table-column align="center" label="控制">
            <el-table-column align="center" label="上限UCL" prop="ucl"/>
            <el-table-column align="center" label="下限LCL" prop="lcl"/>
          </el-table-column>
          <el-table-column align="center" label="MR-UCL" prop="mrucl"/>
          <el-table-column align="center" label="MR-CL" prop="mrcl"/>
          <el-table-column align="center" label="群组数大小" prop="group"/>
        </el-table-column>
        <el-table-column label="修改人" align="center" prop="createName"/>
        <el-table-column label="修改时间" align="center" prop="createTime" width="100px"/>
        <el-table-column label="审核人" align="center" prop="auditorName"/>
        <el-table-column label="审核时间" align="center" prop="auditTime" width="100px"/>
        <el-table-column label="审核状态" align="center" width="70px">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0" style="color:#1C84C6;font-weight: bold">待审核</span>
            <span v-if="scope.row.status === 1" style="color: #009494;font-weight: bold">通过</span>
            <span v-if="scope.row.status === 2" style="color: #f33;font-weight: bold">不通过</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="status">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible"
      title="修改"
      width="1000px">
      <el-table
        v-loading="listLoading"
        :data="rowList"
        element-loading-text="拼命加载中"
        border
        fit
        stripe>
        <el-table-column align="center" label="控制项目" prop="controlPragram"/>
        <el-table-column align="center" label="测量单位" prop="testUnit"/>
        <el-table-column align="center" label="规格">
          <el-table-column align="center" label="上限USL">
            <template slot-scope="scope">
              <el-input v-model="scope.row.usl" class="search-input" style="width:90%" placeholder="" size="mini" maxlength="20" clearable/>
            </template>
          </el-table-column>
          <el-table-column align="center" label="中心限CL">
            <template slot-scope="scope">
              <el-input v-model="scope.row.cl" class="search-input" style="width:90%" placeholder="" size="mini" maxlength="20" clearable/>
            </template>
          </el-table-column>
          <el-table-column align="center" label="下限LSL">
            <template slot-scope="scope">
              <el-input v-model="scope.row.lsl" class="search-input" style="width:90%" placeholder="" size="mini" maxlength="20" clearable/>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" label="控制">
          <el-table-column align="center" label="上限UCL">
            <template slot-scope="scope">
              <el-input v-model="scope.row.ucl" class="search-input" style="width:90%" placeholder="" size="mini" maxlength="20" clearable/>
            </template>
          </el-table-column>
          <el-table-column align="center" label="上限LCL">
            <template slot-scope="scope">
              <el-input v-model="scope.row.lcl" class="search-input" style="width:90%" placeholder="" size="mini" maxlength="20" clearable/>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" label="MR-UCL">
          <template slot-scope="scope">
            <el-input v-model="scope.row.mrucl" class="search-input" style="width:90%" placeholder="" size="mini" maxlength="20" clearable/>
          </template>
        </el-table-column>
        <el-table-column align="center" label="MR-CL">
          <template slot-scope="scope">
            <el-input v-model="scope.row.mrcl" class="search-input" style="width:90%" placeholder="" size="mini" maxlength="20" clearable/>
          </template>
        </el-table-column>
        <el-table-column align="center" label="群组数大小" prop="group"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm()">确 定</el-button>
        <el-button @click="addDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .app-container{
    position: relative;
    height: calc(100vh - 130px);
  }
  .tab-control span{
    line-height: 30px;
  }
  .el-checkbox {
    margin-left: 0px;
  }
  .run-table ::-webkit-scrollbar {/*滚动条整体样式*/
    height: 10px !important;
  }
</style>
