<template>
  <PageHeaderLayout >
    <div class="app-container">
      <el-button
        v-show="showAddBtn"
        size="mini"
        class="float-right"
        type="primary"
        @click="handleAdd"
      ><svg-icon icon-class="add"/> 新 增</el-button>
      <div class="tab-control">
        <span
          :class="{activeTab: activeTabIndex === 0}"
          @click="tabClick(0)"
        >材料名称</span>
        <span
          :class="{activeTab: activeTabIndex === 1}"
          class="has-margin-left"
          @click="tabClick(1)"
        >型号规格</span>
        <span
          :class="{activeTab: activeTabIndex === 2}"
          class="has-margin-left"
          @click="tabClick(2)"
        >单位</span>
        <span
          :class="{activeTab: activeTabIndex === 3}"
          class="has-margin-left"
          @click="tabClick(3)"
        >年限</span>
        <span
          :class="{activeTab: activeTabIndex === 4}"
          class="has-margin-left"
          @click="tabClick(4)"
        >过期提醒配置</span>
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        height="calc(100vh - 278px)"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="材料类型" align="center" prop="type">
          <template slot-scope="scope">
            <span v-text="getMaterialType(scope.row.materialType)"/>
          </template>
        </el-table-column>
        <el-table-column v-if=" activeTabIndex !== 4 && activeTabIndex !== 2" label="材料名称" align="center" prop="name"/>
        <el-table-column v-if=" activeTabIndex === 1" label="型号规格" align="center" prop="model"/>
        <el-table-column v-if=" activeTabIndex === 2" label="单位" align="center" prop="unit"/>
        <el-table-column v-if=" activeTabIndex === 3" label="年限(天)" align="center" prop="years"/>
        <el-table-column v-if=" activeTabIndex !== 4" label="备注" align="center" prop="remark" width="460"/>
        <el-table-column v-if=" activeTabIndex !== 4" label="是否启用" align="center" prop="status">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.status" @change="switchChange(scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column v-if=" activeTabIndex === 4" label="报警阈值(天)" align="center" prop="day">
          <template slot-scope="scope">
            <el-input :disabled="!scope.row.edit" v-model="scope.row.threshold" placeholder="请输入报警阈值" type="text" onkeyup="this.value=this.value.replace(/[^\d]/g,'')" max-length="5"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="status" width="180">
          <template slot-scope="scope">
            <el-button
              v-if="activeTabIndex !== 4"
              size="mini"
              icon="el-icon-delete"
              type="danger"
              @click="handleDelete(scope.row)"
            >删除</el-button>
            <el-button
              v-if="activeTabIndex === 4 && scope.row.edit === false"
              size="mini"
              icon="el-icon-edit"
              type="primary"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              v-if="activeTabIndex === 4 && scope.row.edit === true"
              size="mini"
              icon="el-icon-check"
              type="primary"
              @click="handleSubmitItem(scope.row)"
            >保存</el-button>
            <el-button
              v-if="activeTabIndex === 4 && scope.row.edit === true"
              size="mini"
              icon="el-icon-close"
              type="danger"
              @click="handleCancel(scope.row)"
            >取消</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="pageNum"
        :page-sizes="[15, 25, 50]"
        :page-size="pageSize"
        :total="totalPage"
        class="pagination"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div>
    <!--新增材料名称-->
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="addMaterialDialogVisible"
      title="新增材料名称"
      width="500px"
      @close="handleClose('materialForm')">
      <el-form ref="materialForm" :model="materialForm" :rules="materialRules" status-icon label-width="85px" label-position="right">
        <el-form-item label="材料类型 " prop="type">
          <el-select v-model="materialForm.type" style="width: 100%;" placeholder="请选择" filterable>
            <el-option
              v-for="item in materialOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="材料名称 " prop="name">
          <el-input v-model="materialForm.name" placeholder="请输入材料名称" maxlength="20"/>
        </el-form-item>
        <el-form-item label="备注 ">
          <el-input v-model="materialForm.remark" type="textarea" placeholder="请输入备注" maxlength="50"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('materialForm')">确 定</el-button>
        <el-button @click="resetForm('materialForm')">取 消</el-button>
      </span>
    </el-dialog>
    <!--新增型号规格-->
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="addModelDialogVisible"
      title="新增型号规格"
      width="500px"
      @close="handleClose('modelForm')">
      <el-form ref="modelForm" :model="modelForm" :rules="modelRules" status-icon label-width="85px" label-position="right">
        <el-form-item label="材料类型 " prop="type">
          <el-select v-model="modelForm.type" style="width: 100%;" placeholder="请选择" filterable @change="materialTypeChange">
            <el-option
              v-for="item in materialOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="材料名称 " prop="name">
          <el-select v-model="modelForm.name" style="width: 100%;" filterable placeholder="请选择">
            <el-option
              v-for="item in materialNameOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="型号规格 " prop="model">
          <el-input v-model="modelForm.model" placeholder="请输入型号规格" maxlength="20"/>
        </el-form-item>
        <el-form-item label="备注 ">
          <el-input v-model="modelForm.remark" type="textarea" placeholder="请输入备注" maxlength="50"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('modelForm')">确 定</el-button>
        <el-button @click="resetForm('modelForm')">取 消</el-button>
      </span>
    </el-dialog>
    <!--新增单位-->
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="addUnitDialogVisible"
      title="新增单位"
      width="500px"
      @close="handleClose('unitForm')">
      <el-form ref="unitForm" :model="unitForm" :rules="unitRules" status-icon label-width="85px" label-position="right">
        <el-form-item label="材料类型 " prop="type">
          <el-select v-model="unitForm.type" style="width: 100%;" placeholder="请选择" filterable>
            <el-option
              v-for="item in materialOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="单位 " prop="name">
          <el-input v-model="unitForm.name" placeholder="请输入单位" maxlength="5"/>
        </el-form-item>
        <el-form-item label="备注 ">
          <el-input v-model="unitForm.remark" type="textarea" placeholder="请输入备注" maxlength="50"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('unitForm')">确 定</el-button>
        <el-button @click="resetForm('unitForm')">取 消</el-button>
      </span>
    </el-dialog>
    <!--新增年限-->
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="addAgeLimitDialogVisible"
      title="新增年限"
      width="500px"
      @close="handleClose('ageLimitForm')">
      <el-form ref="ageLimitForm" :model="ageLimitForm" :rules="ageLimitRules" status-icon label-width="85px" label-position="right">
        <el-form-item label="材料类型 " prop="type">
          <el-select v-model="ageLimitForm.type" style="width: 100%;" placeholder="请选择" filterable @change="materialTypeChange">
            <el-option
              v-for="item in materialOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="材料名称 " prop="name">
          <el-select v-model="ageLimitForm.name" style="width: 100%;" placeholder="请选择" filterable>
            <el-option
              v-for="item in materialNameOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="年限(天) " prop="year">
          <el-input v-model="ageLimitForm.year" placeholder="请输入年限" type="text" onkeyup="this.value=this.value.replace(/[^\d]/g,'')" maxlength="5" @input="yearChange"/>
        </el-form-item>
        <el-form-item label="备注 ">
          <el-input v-model="ageLimitForm.remark" type="textarea" placeholder="请输入备注" maxlength="50"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ageLimitForm')">确 定</el-button>
        <el-button @click="resetForm('ageLimitForm')">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./basicInfoConfig.js"></script>

<style scoped>
  .app-container{
    position: relative;
    height: calc(100vh - 132px);
  }
  .tab-control span{
    width: 95px;
    line-height: 30px;
  }
  .el-checkbox {
    margin-left: 0px;
  }
  .app-container>>> .cell{
    line-height: 42px;
  }
  .app-container>>> td{
    height: 42px;
  }
</style>
