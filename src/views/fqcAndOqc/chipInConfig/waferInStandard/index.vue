<template>
  <PageHeaderLayout >
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        height="calc(100vh - 160px)"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="标准名称" align="center" prop="name">
          <template slot-scope="scope">
            <span>{{ scope.row.name + '-' + scope.row.version }}</span>
          </template>
        </el-table-column>
        <el-table-column label="正/副品" align="center" prop="name">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 0">正品</span>
            <span v-if="scope.row.type === 1">副品</span>
          </template>
        </el-table-column>
        <el-table-column label="修改人" align="center" prop="creatorName"/>
        <el-table-column label="修改时间" align="center" prop="createTime"/>
        <el-table-column label="操作" align="center" prop="status" width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleHistory(scope.row)"
            ><svg-icon icon-class="lishibb"/> 历史版本</el-button>
            <el-button
              size="mini"
              icon="el-icon-edit"
              type="primary"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="historyDialogVisible"
      class="padding-dialog"
      title="历史版本"
      width="700px"
      top="80px"
      @close="handleClose('updateForm')">
      <div class="module-title">
        <div class="module-title-text">历史版本</div>
      </div>
      <el-table
        v-loading="listLoading"
        ref="historyTable"
        :data="historyList"
        element-loading-text="拼命加载中"
        height="200px"
        border
        fit
        highlight-current-row
        @row-click="rowClick"
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="标准名称" align="center" prop="name">
          <template slot-scope="scope">
            <span>{{ scope.row.name + '-' + scope.row.version }}</span>
          </template>
        </el-table-column>
        <el-table-column label="正/副品" align="center" prop="name">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 0">正品</span>
            <span v-if="scope.row.type === 1">副品</span>
          </template>
        </el-table-column>
        <el-table-column label="修改人" align="center" prop="creatorName"/>
        <el-table-column label="修改时间" align="center" prop="createTime"/>
        <el-table-column label="启用状态" align="center" prop="status">
          <template slot-scope="scope">
            <el-radio :label="scope.row.id" v-model="radio">&nbsp;</el-radio>
          </template>
        </el-table-column>
      </el-table>
      <div class="module-title-text" style="float: none; margin-top:15px">判定规则</div>
      <div class="rule-box">
        <el-form ref="updateForm" :model="updateForm" status-icon label-width="120px" label-position="right">
          <el-form-item label="标准名称" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.name" size="mini"/></el-form-item>
          <el-form-item label="正/副品" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.zf" size="mini"/></el-form-item>
          <el-form-item label="综合良率" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.compreYield" size="mini"/></el-form-item>
          <el-form-item label="VF1良率" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.vf1Yield" size="mini"/></el-form-item>
          <el-form-item label="VF2良率" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.vf2Yield" size="mini"/></el-form-item>
          <el-form-item label="VF3良率" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.vf3Yield" size="mini"/></el-form-item>
          <el-form-item label="VF4良率" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.vf4Yield" size="mini"/></el-form-item>
          <el-form-item label="IR良率" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.irYield" size="mini"/></el-form-item>
          <el-form-item label="DVF良率" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.dvfYield" size="mini"/></el-form-item>
          <el-form-item label="WLD良率" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.wldYield" size="mini"/></el-form-item>
          <el-form-item label="WLP良率" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.wlpYield" size="mini"/></el-form-item>
          <el-form-item label="WLC良率" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.wlcYield" size="mini"/></el-form-item>
          <el-form-item label="VZ良率" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.vzYield" size="mini"/></el-form-item>
          <el-form-item label="LOP1良率" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.ivYield" size="mini"/></el-form-item>
          <el-form-item label="EDS_IR_A良率" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.irEsdAYield" size="mini"/></el-form-item>
          <el-form-item label="WLD_5nm良率" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.wldNm5Yield" size="mini"/></el-form-item>
          <el-form-item label="WLP_5nm良率" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.wlpNm5Yield" size="mini"/></el-form-item>
          <!-- <el-form-item label="IV均值" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.iv_svr" size="mini"/></el-form-item>
          <el-form-item label="VF1均值" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.vf1_svr" size="mini"/></el-form-item>
          <el-form-item label="VZ均值" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.vz_svr" size="mini"/></el-form-item>
          <el-form-item label="Thyristor良率" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.thyristor_yield" size="mini"/></el-form-item>
          <el-form-item label="Thyristor坏点" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.thyristor_bad" size="mini"/></el-form-item>
          <el-form-item label="综合良率" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.compre_yield" size="mini"/></el-form-item>
          <el-form-item label="生产良率" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.product_yield" size="mini"/></el-form-item>
          <el-form-item label="VF1良率" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.vf1_yield" size="mini"/></el-form-item>
          <el-form-item label="VF3良率" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.vf3_yield" size="mini"/></el-form-item>
          <el-form-item label="VF4良率" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.vf4_yield" size="mini"/></el-form-item>
          <el-form-item label="WLD1良率" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.wld1_yield" size="mini"/></el-form-item>
          <el-form-item label="IR良率" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.ir_yield" size="mini"/></el-form-item>
          <el-form-item label="IR_ESD_A良率" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.ir_esd_a_yield" size="mini"/></el-form-item>
          <el-form-item label="VZ良率" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.vz_yield" size="mini"/></el-form-item>
          <el-form-item label="IV良率" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.iv_yield" size="mini"/></el-form-item>
          <el-form-item label="VF2均值" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.vf2_svr" size="mini"/></el-form-item>
          <el-form-item label="VF3均值" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.vf3_svr" size="mini"/></el-form-item>
          <el-form-item label="VF4均值" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.vf4_svr" size="mini"/></el-form-item>
          <el-form-item label="WLD1均值" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.wld1_svr" size="mini"/></el-form-item>
          <el-form-item label="WLD1_STD" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.wld1_std" size="mini"/></el-form-item>
          <el-form-item label="WLP1均值" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.wlp1_svr" size="mini"/></el-form-item>
          <el-form-item label="HW1" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.hw1" size="mini"/></el-form-item>
          <el-form-item label="WLD2均值" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.wld2_svr" size="mini"/></el-form-item>
          <el-form-item label="BS(蓝移)" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.bs" size="mini"/></el-form-item>
          <el-form-item label="IR均值" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.ir_svr" size="mini"/></el-form-item>
          <el-form-item label="扫描数量" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.scan_num" size="mini"/></el-form-item>
          <el-form-item label="总测试数" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.test_num" size="mini"/></el-form-item>
          <el-form-item label="坏点数" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.bad_num" size="mini"/></el-form-item>
          <el-form-item label="机台" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.machine" size="mini"/></el-form-item>
          <el-form-item label="VF1异常占比" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.vf_proportion" size="mini"/></el-form-item>
          <el-form-item label="IR异常占比" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.ir_proportion" size="mini"/></el-form-item> -->
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setHistoryEnable">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      class="padding-dialog"
      title="编辑光电标准"
      width="700px"
      top="80px"
      @close="handleClose('updateForm')">
      <div class="module-title-text" style="float: none; margin-top:15px">判定规则</div>
      <div class="rule-box" style="height: 460px">
        <el-form ref="updateForm" :model="updateForm" status-icon label-width="120px" label-position="right">
          <el-form-item label="标准名称" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.name" size="mini"/></el-form-item>
          <el-form-item label="正/副品" prop="name" size="mini"><el-input :disabled="true" v-model="updateForm.zf" size="mini"/></el-form-item>
          <el-form-item label="综合良率" prop="name" size="mini"><el-input v-model="updateForm.compreYield" size="mini"/></el-form-item>
          <el-form-item label="VF1良率" prop="name" size="mini"><el-input v-model="updateForm.vf1Yield" size="mini"/></el-form-item>
          <el-form-item label="VF2良率" prop="name" size="mini"><el-input v-model="updateForm.vf2Yield" size="mini"/></el-form-item>
          <el-form-item label="VF3良率" prop="name" size="mini"><el-input v-model="updateForm.vf3Yield" size="mini"/></el-form-item>
          <el-form-item label="VF4良率" prop="name" size="mini"><el-input v-model="updateForm.vf4Yield" size="mini"/></el-form-item>
          <el-form-item label="IR良率" prop="name" size="mini"><el-input v-model="updateForm.irYield" size="mini"/></el-form-item>
          <el-form-item label="DVF良率" prop="name" size="mini"><el-input v-model="updateForm.dvfYield" size="mini"/></el-form-item>
          <el-form-item label="WLD良率" prop="name" size="mini"><el-input v-model="updateForm.wldYield" size="mini"/></el-form-item>
          <el-form-item label="WLP良率" prop="name" size="mini"><el-input v-model="updateForm.wlpYield" size="mini"/></el-form-item>
          <el-form-item label="WLC良率" prop="name" size="mini"><el-input v-model="updateForm.wlcYield" size="mini"/></el-form-item>
          <el-form-item label="VZ良率" prop="name" size="mini"><el-input v-model="updateForm.vzYield" size="mini"/></el-form-item>
          <el-form-item label="LOP1良率" prop="name" size="mini"><el-input v-model="updateForm.ivYield" size="mini"/></el-form-item>
          <el-form-item label="EDS_IR_A良率" prop="name" size="mini"><el-input v-model="updateForm.irEsdAYield" size="mini"/></el-form-item>
          <el-form-item label="WLD_5nm良率" prop="name" size="mini"><el-input v-model="updateForm.wldNm5Yield" size="mini"/></el-form-item>
          <el-form-item label="WLP_5nm良率" prop="name" size="mini"><el-input v-model="updateForm.wlpNm5Yield" size="mini"/></el-form-item>
          <!-- <el-form-item label="IV均值" prop="name" size="mini"><el-input v-model="updateForm.iv_svr" size="mini"/></el-form-item>
          <el-form-item label="VF1均值" prop="name" size="mini"><el-input v-model="updateForm.vf1_svr" size="mini"/></el-form-item>
          <el-form-item label="VZ均值" prop="name" size="mini"><el-input v-model="updateForm.vz_svr" size="mini"/></el-form-item>
          <el-form-item label="Thyristor良率" prop="name" size="mini"><el-input v-model="updateForm.thyristor_yield" size="mini"/></el-form-item>
          <el-form-item label="Thyristor坏点" prop="name" size="mini"><el-input v-model="updateForm.thyristor_bad" size="mini"/></el-form-item>
          <el-form-item label="综合良率" prop="name" size="mini"><el-input v-model="updateForm.compre_yield" size="mini"/></el-form-item>
          <el-form-item label="生产良率" prop="name" size="mini"><el-input v-model="updateForm.product_yield" size="mini"/></el-form-item>
          <el-form-item label="VF1良率" prop="name" size="mini"><el-input v-model="updateForm.vf1_yield" size="mini"/></el-form-item>
          <el-form-item label="VF3良率" prop="name" size="mini"><el-input v-model="updateForm.vf3_yield" size="mini"/></el-form-item>
          <el-form-item label="VF4良率" prop="name" size="mini"><el-input v-model="updateForm.vf4_yield" size="mini"/></el-form-item>
          <el-form-item label="WLD1良率" prop="name" size="mini"><el-input v-model="updateForm.wld1_yield" size="mini"/></el-form-item>
          <el-form-item label="IR良率" prop="name" size="mini"><el-input v-model="updateForm.ir_yield" size="mini"/></el-form-item>
          <el-form-item label="IR_ESD_A良率" prop="name" size="mini"><el-input v-model="updateForm.ir_esd_a_yield" size="mini"/></el-form-item>
          <el-form-item label="VZ良率" prop="name" size="mini"><el-input v-model="updateForm.vz_yield" size="mini"/></el-form-item>
          <el-form-item label="IV良率" prop="name" size="mini"><el-input v-model="updateForm.iv_yield" size="mini"/></el-form-item>
          <el-form-item label="VF2均值" prop="name" size="mini"><el-input v-model="updateForm.vf2_svr" size="mini"/></el-form-item>
          <el-form-item label="VF3均值" prop="name" size="mini"><el-input v-model="updateForm.vf3_svr" size="mini"/></el-form-item>
          <el-form-item label="VF4均值" prop="name" size="mini"><el-input v-model="updateForm.vf4_svr" size="mini"/></el-form-item>
          <el-form-item label="WLD1均值" prop="name" size="mini"><el-input v-model="updateForm.wld1_svr" size="mini"/></el-form-item>
          <el-form-item label="WLD1_STD" prop="name" size="mini"><el-input v-model="updateForm.wld1_std" size="mini"/></el-form-item>
          <el-form-item label="WLP1均值" prop="name" size="mini"><el-input v-model="updateForm.wlp1_svr" size="mini"/></el-form-item>
          <el-form-item label="HW1" prop="name" size="mini"><el-input v-model="updateForm.hw1" size="mini"/></el-form-item>
          <el-form-item label="WLD2均值" prop="name" size="mini"><el-input v-model="updateForm.wld2_svr" size="mini"/></el-form-item>
          <el-form-item label="BS(蓝移)" prop="name" size="mini"><el-input v-model="updateForm.bs" size="mini"/></el-form-item>
          <el-form-item label="IR均值" prop="name" size="mini"><el-input v-model="updateForm.ir_svr" size="mini"/></el-form-item>
          <el-form-item label="扫描数量" prop="name" size="mini"><el-input v-model="updateForm.scan_num" size="mini"/></el-form-item>
          <el-form-item label="总测试数" prop="name" size="mini"><el-input v-model="updateForm.test_num" size="mini"/></el-form-item>
          <el-form-item label="坏点数" prop="name" size="mini"><el-input v-model="updateForm.bad_num" size="mini"/></el-form-item>
          <el-form-item label="机台" prop="name" size="mini"><el-input v-model="updateForm.machine" size="mini"/></el-form-item>
          <el-form-item label="VF1异常占比" prop="name" size="mini"><el-input v-model="updateForm.vf_proportion" size="mini"/></el-form-item>
          <el-form-item label="IR异常占比" prop="name" size="mini"><el-input v-model="updateForm.ir_proportion" size="mini"/></el-form-item> -->
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitParamsForm('updateForm')">确 定</el-button>
        <el-button @click="resetForm('updateForm')">取 消</el-button>
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
    line-height: 50px;
  }
  .el-checkbox {
    margin-left: 0px;
  }
  .padding-dialog>>> .el-dialog__body{
    padding-top: 0;
  }
  .rule-box{
    margin-top: 15px;
    border: 1px solid #e2e2e2;
    height: 400px;
    overflow: auto;
    padding: 15px;
    padding-left: 0;
  }
  .rule-box>>> .el-input.is-disabled .el-input__inner {
    background-color: #f8fafd;
    border-color: #e6e8eb;
    color: #494949;
    cursor: not-allowed;
  }
  .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom: 10px;
  }
  .padding-dialog>>> .el-dialog__footer{
    text-align: center;
  }
  .padding-dialog>>> .el-radio{
    margin-left: 18px;
  }
</style>
