<template>
  <PageHeaderLayout >
    <div class="">
      <HeaderSearchAdd placeholder-text = "采集点名称" @handleSearch="handleSearch" @handleAdd="handleAdd"/>
      <div class="app-container">
        <el-table
          v-loading="listLoading"
          :data="list"
          element-loading-text="拼命加载中"
          height="calc(100vh - 284px)"
          border
          fit
          stripe
          highlight-current-row>
          <el-table-column align="center" label="序号" width="95">
            <template slot-scope="scope">
              {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
            </template>
          </el-table-column>
          <el-table-column label="采集点名称" align="center" prop="siteName"/>
          <el-table-column label="采集模式" align="center" >
            <template slot-scope="scope">
              <div v-if="scope.row.siteMode === 0" >手动模式</div>
              <div v-if="scope.row.siteMode === 1" >自动模式</div>
            </template>
          </el-table-column>
          <!--<el-table-column label="采集点IP" align="center" prop="siteIp"/>-->
          <el-table-column label="机台编号" align="center" prop="machineCode"/>
          <el-table-column label="机台型号" align="center" prop="machineType"/>
          <el-table-column label="使用菜单" align="center" prop="useMenu"/>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEditEqpt(scope.row)"><svg-icon icon-class="shebei"/> 设备列表</el-button>
              <el-button
                size="mini"
                icon="el-icon-edit"
                type="primary"
                @click="handleEdit(scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="pageNum"
          :page-sizes="[15, 30, 40]"
          :page-size="pageSize"
          :total="totalPage"
          class="pagination"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="sizeChange"
          @current-change="currentChange"
        />
      </div>
      <el-dialog
        v-drag
        :close-on-click-modal="false"
        :visible.sync="addDialogVisible"
        title="添加"
        width="500px"
        @close="handleClose('clientForm')">
        <el-form ref="clientForm" :model="clientForm" :rules="rules" label-position="right" status-icon label-width="120px">
          <el-form-item label="采集点名称: " prop="collectionPointName">
            <el-input v-model="clientForm.collectionPointName" maxlength="20" type="text"/>
          </el-form-item>
          <el-form-item label="采集模式: ">
            <el-radio-group v-model="clientForm.siteMode">
              <el-radio label="0">手动模式</el-radio>
              <el-radio label="1">自动模式</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="机台编号: " prop="machineCode" aria-orientation="vertical">
            <el-input v-model="clientForm.machineCode" maxlength="30" style="width: 220px" type="text"/>
            <el-checkbox v-model="clientForm.showCode" >是否可见</el-checkbox>
          </el-form-item>
          <el-form-item label="机台型号: " prop="machineType">
            <el-input v-model="clientForm.machineType" maxlength="10" style="width: 220px" type="text"/>
            <el-checkbox v-model="clientForm.showType" >是否可见</el-checkbox>
          </el-form-item>
          <el-form-item label="使用菜单: " prop="useMenu">
            <el-input v-model="clientForm.useMenu" placeholder="通过;区分多个菜单" maxlength="200" style="width: 220px" type="text"/>
            <el-checkbox v-model="clientForm.showMenu" >是否可见</el-checkbox>
          </el-form-item>
          <el-form-item label="批次号: " prop="machineType">
            <el-input v-model="clientForm.batchNo" maxlength="10" style="width: 220px" type="text"/>
            <el-checkbox v-model="clientForm.showBatch" >是否可见</el-checkbox>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('clientForm')">确 定</el-button>
          <el-button @click="resetForm('clientForm')">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog
        v-drag
        :close-on-click-modal="false"
        :visible.sync="editDialogVisible"
        title="编辑"
        width="500px"
        @close="handleClose('clientForm')">
        <el-form ref="clientForm" :model="clientForm" :rules="rules" label-position="right" status-icon label-width="120px">
          <el-form-item label="采集点名称: " prop="collectionPointName" >
            <el-input v-model="clientForm.collectionPointName" maxlength="20" type="text"/>
          </el-form-item>
          <el-form-item label="采集模式: " >
            <el-radio-group v-model="clientForm.siteMode">
              <el-radio label="0">手动模式</el-radio>
              <el-radio label="1">自动模式</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="机台编号: " prop="machineCode">
            <el-input v-model="clientForm.machineCode" maxlength="30" style="width: 220px" type="text"/>
            <el-checkbox v-model="clientForm.showCode" >是否可见</el-checkbox>
          </el-form-item>
          <el-form-item label="机台型号: " prop="machineType">
            <el-input v-model="clientForm.machineType" maxlength="10" style="width: 220px" type="text"/>
            <el-checkbox v-model="clientForm.showType" >是否可见</el-checkbox>
          </el-form-item>
          <el-form-item label="使用菜单: " prop="useMenu">
            <el-input v-model="clientForm.useMenu" maxlength="200" style="width: 220px" type="text"/>
            <el-checkbox v-model="clientForm.showMenu" >是否可见</el-checkbox>
          </el-form-item>
          <el-form-item label="批次号: " prop="machineType">
            <el-input v-model="clientForm.batchNo" maxlength="10" style="width: 220px" type="text"/>
            <el-checkbox v-model="clientForm.showBatch" >是否可见</el-checkbox>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitEditForm('clientForm')">确 定</el-button>
          <el-button @click="resetForm('clientForm')">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog
        v-drag
        :close-on-click-modal="false"
        :visible.sync="editEqptVisible"
        title="采集点设备列表"
        width="500px"
        class="config-dialog"
      >
        <div class="data-origin">
          <div>
            <div class="data-origin-title">设备列表</div>
            <div class="data-origin-content">
              <el-radio-group v-model="checkedRadio">
                <el-radio v-for="device in deviceList" :key="device.id" :label="device.id" style="display: block;margin-left: 0;margin-bottom: 10px ">{{ device.deviceName }}</el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>
        <el-button type="primary" icon="el-icon-plus" size="mini" style="margin-left: 45%;margin-bottom: 10px" @click="addDeviceDirection">添加</el-button>
        <el-table
          v-loading="listLoading"
          :data="siteDeviceList"
          element-loading-text="拼命加载中"
          border
          fit
          stripe
          max-height="300"
        >
          <el-table-column align="center" label="序号" width="60">
            <template slot-scope="scope">
              {{ scope.$index+1 }}
            </template>
          </el-table-column>
          <el-table-column label="设备名称" align="center" prop="deviceName" width="*" show-overflow-tooltip/>
          <!--<el-table-column label="数据去向" align="center" prop="tableName" show-overflow-tooltip/>-->
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="handleDeleteSiteDevice(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </PageHeaderLayout>
</template>
<script src="./clientSet.js"></script>
<style scoped>
  .data-origin{
    overflow: hidden;
    margin-bottom: 10px;
    border-bottom: 1px solid rgba(0, 139, 139, 0.71);
  }
  .data-origin>div{
    float: left;
    width: 100%;
  }
  .data-origin-content{
    padding: 15px;
    width: 100%;
    height: 260px;
    border:1px solid #009494;
    margin-bottom: 10px;
    overflow-x: hidden ;
    overflow-y: auto ;
  }
  .data-origin-title{
    font-size: 15px;
    text-align: center;
    margin-bottom: 10px;
    font-weight: bold;
    color: #009494;
  }
  .config-dialog>>>.el-dialog__body{
    padding: 16px;
  }
</style>
