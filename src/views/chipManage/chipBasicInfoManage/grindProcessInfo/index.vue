<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0">
      <div class="search-box">
        <div class="left-search-box">
          <div class="input-item">
            <span class="input-title">产品型号 </span>
            <el-select v-model="productModelId" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in productLists"
                :key="item.id"
                :label="item.code"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">尺寸 </span>
            <el-select v-model="measureId" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in measureList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">修改人 </span>
            <el-select v-model="creator" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in userLists"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-search"
              @click="handleSearch" >查询</el-button>
            <el-button
              class="margin-left"
              size="small"
              type="danger"
              @click="clearAll"
            >
              <svg-icon icon-class="clear"/> 重 置
            </el-button>
          </div>
        </div>
        <div class="right-btn-box">
          <el-button
            style="margin-top: 15px"
            class="float-right margin-left"
            size="small"
            type="primary"
            @click="handleAdd"><svg-icon icon-class="add"/> 新增</el-button>
        </div>
      </div>
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        height="calc(100vh - 285px)"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
          </template>
        </el-table-column>
        <el-table-column label="粘片厚度" align="center" prop="stickPly" show-overflow-tooltip/>
        <el-table-column label="抛光厚度" align="center" prop="grindingPly" show-overflow-tooltip/>
        <el-table-column label="减薄厚度" align="center" prop="polishingPly" show-overflow-tooltip/>
        <el-table-column label="产品型号" align="center" prop="productModelCode"/>
        <el-table-column label="尺寸" align="center" prop="measure" width="100px"/>
        <el-table-column label="修改人" align="center" prop="creatorName" show-overflow-tooltip/>
        <el-table-column label="修改时间" align="center" prop="createTime" show-overflow-tooltip/>
        <el-table-column label="操作" align="center" prop="status" width="180px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-edit"
              type="primary"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              icon="el-icon-delete"
              type="danger"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="pageNum"
        :page-sizes="[12, 30, 40]"
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
      title="新增"
      width="500px"
      @close="handleClose('machineForm')">
      <el-form ref="machineForm" :model="machineForm" :rules="rules" status-icon label-width="130px" label-position="right">
        <el-form-item label="产品型号 " prop="productModelId">
          <el-select v-model="machineForm.productModelId" style="width:295px" placeholder="请选择" filterable clearable @change="scProductModel">
            <el-option
              v-for="item in productLists"
              :key="item.id"
              :label="item.code"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="尺寸" prop="measureId">
          <el-select v-model="machineForm.measureId" style="width:295px" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in measureList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="粘片厚度 " prop="stickPly">
          <el-input v-model="machineForm.stickPly" style="width:295px" placeholder="请输入粘片厚度" maxlength="6"/> um
        </el-form-item>
        <el-form-item label="粘片厚度阈值 ± " prop="stickVal">
          <el-input v-model="machineForm.stickVal" style="width:295px" placeholder="请输入粘片厚度阈值" maxlength="6"/>
        </el-form-item>
        <el-form-item label="减薄厚度 " prop="polishingPly">
          <el-input v-model="machineForm.polishingPly" style="width:295px" placeholder="请输入减薄厚度" maxlength="6"/> um
        </el-form-item>
        <el-form-item label="减薄厚度阈值 ± " prop="polishingVal">
          <el-input v-model="machineForm.polishingVal" style="width:295px" placeholder="请输入减薄厚度阈值" maxlength="6"/>
        </el-form-item>
        <el-form-item label="抛光厚度 ">
          <el-input v-model="machineForm.grindingPly" :disabled="true" style="width:295px" placeholder="请输入抛光厚度" maxlength="6"/> um
        </el-form-item>
        <el-form-item label="抛光厚度阈值 ± " prop="grindingVal">
          <el-input v-model="machineForm.grindingVal" style="width:295px" placeholder="请输入抛光厚度阈值" maxlength="6"/>
        </el-form-item>
        <span style="margin-left:28px;color:#F56C6C">注：此处阈值为上下限，超出阈值范围，则测试数据视为异常。</span>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('machineForm')">确 定</el-button>
        <el-button @click="addDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="修改"
      width="500px"
      @close="handleClose('machineForm')">
      <el-form ref="machineForm" :model="machineForm" :rules="rules" status-icon label-width="130px" label-position="right">
        <el-form-item label="产品型号 " prop="productModelId">
          <el-select v-model="machineForm.productModelId" style="width:295px" placeholder="请选择" clearable @change="scProductModel">
            <el-option
              v-for="item in productLists"
              :key="item.id"
              :label="item.code"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="尺寸" prop="measureId">
          <el-select v-model="machineForm.measureId" style="width:295px" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in measureList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="粘片厚度 " prop="stickPly">
          <el-input v-model="machineForm.stickPly" style="width:295px" placeholder="请输入粘片厚度" maxlength="6"/> um
        </el-form-item>
        <el-form-item label="粘片厚度阈值 ± " prop="stickVal">
          <el-input v-model="machineForm.stickVal" style="width:295px" placeholder="请输入粘片厚度阈值" maxlength="6"/>
        </el-form-item>
        <el-form-item label="减薄厚度 " prop="polishingPly">
          <el-input v-model="machineForm.polishingPly" style="width:295px" placeholder="请输入减薄厚度" maxlength="6"/> um
        </el-form-item>
        <el-form-item label="减薄厚度阈值 ± " prop="polishingVal">
          <el-input v-model="machineForm.polishingVal" style="width:295px" placeholder="请输入减薄厚度阈值" maxlength="6"/>
        </el-form-item>
        <el-form-item label="抛光厚度 ">
          <el-input v-model="machineForm.grindingPly" :disabled="true" style="width:295px" placeholder="请输入抛光厚度" maxlength="6"/> um
        </el-form-item>
        <el-form-item label="抛光厚度阈值 ± " prop="grindingVal">
          <el-input v-model="machineForm.grindingVal" style="width:295px" placeholder="请输入抛光厚度阈值" maxlength="6"/>
        </el-form-item>
        <span style="margin-left:28px;color:#F56C6C">注：此处阈值为上下限，超出阈值范围，则测试数据视为异常。</span>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editsubmitForm('machineForm')">确 定</el-button>
        <el-button @click="editDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .spancol{
    color: #606266;
    font-weight: 700;
    margin-left: 27px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 203px);
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
    width: 160px;
  }
</style>
