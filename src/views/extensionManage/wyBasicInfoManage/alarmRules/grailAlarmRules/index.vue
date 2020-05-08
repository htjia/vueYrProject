<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto">
      <div class="header-btn-group">
        <el-button
          size="small"
          type="primary"
        ><svg-icon icon-class="add"/> 导入衬底文档</el-button>
        <el-button
          size="small"
          type="primary"
        ><svg-icon icon-class="add"/> 新增衬底信息</el-button>
        <el-button
          size="small"
          type="primary"
        ><svg-icon icon-class="add"/> 导出excel</el-button>
        <el-button
          size="small"
          class="float-right"
          type="primary"
        ><svg-icon icon-class="add"/> 数据管理</el-button>
        <el-button
          size="small"
          class="float-right"
          type="primary"
        ><svg-icon icon-class="add"/> 导入记录</el-button>
      </div>
      <el-row>
        <el-col :span="22">
          <div class="input-item">
            <span class="input-title">镭刻号 </span>
            <el-input v-model="siteName" class="search-input" placeholder="请输入镭刻号" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">箱号 </span>
            <el-input v-model="siteName" class="search-input" placeholder="请输入箱号" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">S/D </span>
            <el-select v-model="siteType" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in siteSelectOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">供应商 </span>
            <el-input v-model="siteName" class="search-input" placeholder="请输入供应商" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">导入时间 </span>
            <el-date-picker
              v-model="beginDate"
              :picker-options="pickerOptionsStart"
              :editable="false"
              class="search-input"
              size="small"
              type="date"
              placeholder="选择开始日期"
              value-format="timestamp"
            />
            <span style="display:inline-block;width: 38px;text-align: center"> 至 </span>
            <el-date-picker
              v-model="endDate"
              :picker-options="pickerOptionsEnd"
              :editable="false"
              class="search-input"
              size="small"
              type="date"
              placeholder="选择结束日期"
              value-format="timestamp"
            />
          </div>
          <div class="input-item">
            <span class="input-title">批次号 </span>
            <el-input v-model="siteName" class="search-input" placeholder="请输入批次号" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">盒号 </span>
            <el-input v-model="siteName" class="search-input" placeholder="请输入盒号" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">衬底类型 </span>
            <el-select v-model="siteType" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in siteSelectOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">衬底尺寸 </span>
            <el-input v-model="siteName" class="search-input" placeholder="请输入衬底尺寸" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">是否生长 </span>
            <el-select v-model="siteType" class="search-input short-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in siteSelectOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">是否铝氮 </span>
            <el-select v-model="siteType" class="search-input short-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in siteSelectOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
        </el-col>
        <el-col :span="2">
          <div class="clear-both">
            <el-button
              class="float-right margin-top"
              size="small"
              type="primary"
              icon="el-icon-search"
              @click="handleSearch" >查 询</el-button>
          </div>
          <div class="clear-both">
            <el-button
              class="float-right margin-top"
              size="small"
              type="danger"
            >
              <svg-icon icon-class="clear"/> 重 置
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="app-container">
      <div v-if="selectTheadVisble" class="select-thead">
        <div class="options-box">
          <el-checkbox-group v-model="checkboxVal">
            <el-checkbox v-for="(option,index) in formTheadOptions" :key="index" :label="option">
              {{ option }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <el-button type="primary" size="mini" style="margin-left: 25px" @click="submitOption">确 定</el-button>
        <el-button size="mini" @click="resetOption">取 消</el-button>
      </div>
      <div class="select-thead-btn" @click="selectThead">...</div>
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
        <el-table-column v-for="item in formThead" :key="item.thName" :label="item.thName" align="center">
          <template slot-scope="scope">
            {{ scope.row[item.thKey] }}
          </template>
        </el-table-column>
        <!--
        <el-table-column label="导入时间" align="center" prop="name"/>
        <el-table-column label="镭刻号" align="center" prop="name"/>
        <el-table-column label="衬底类型" align="center" prop="mandataryName">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 0">前段站点</span>
            <span v-if="scope.row.type === 1">后段站点</span>
          </template>
        </el-table-column>
        <el-table-column label="衬底尺寸" align="center" prop="name"/>
        <el-table-column label="单/双抛" align="center" prop="name"/>
        <el-table-column label="供应商" align="center" prop="name"/>
        <el-table-column label="批次号" align="center" prop="name"/>
        <el-table-column label="箱号" align="center" prop="name"/>
        <el-table-column label="出场盒号" align="center" prop="name"/>
        <el-table-column label="次序号" align="center" prop="name"/>
        <el-table-column label="铝氮盒号" align="center" prop="name"/>
        <el-table-column label="次序号" align="center" prop="name"/>
        <el-table-column label="散片盒号" align="center" prop="name"/>
        <el-table-column label="次序号" align="center" prop="name"/>
        <el-table-column label="是否生长" align="center" prop="status">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0" style="color: #009494;font-weight: bold">启用</span>
            <span v-if="scope.row.status === 1" style="color: #f33;font-weight: bold">停用</span>
          </template>
        </el-table-column>-->
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
      v-drag
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible"
      title="新增站点"
      width="400px"
      @close="handleClose('siteForm')">
      <el-form ref="siteForm" :model="siteForm" :rules="rules" status-icon label-width="100px" label-position="right">
        <el-form-item label="站点类型 " prop="siteType">
          <el-select v-model="siteForm.siteType" placeholder="请选择站点类型" style="width: 260px" filterable>
            <el-option
              v-for="item in siteOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="站点状态 " prop="siteStatus">
          <el-select v-model="siteForm.siteStatus" placeholder="请选择站点状态" style="width: 260px" filterable>
            <el-option
              v-for="item in siteStatusOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="站点名称 " prop="siteName">
          <el-input v-model="siteForm.siteName" placeholder="请输入站点名称" maxlength="20"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('siteForm')">确 定</el-button>
        <el-button @click="resetForm('siteForm')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="编辑站点"
      width="400px"
      @close="handleClose('siteForm')">
      <el-form ref="siteForm" :model="siteForm" :rules="rules" status-icon label-width="100px" label-position="right">
        <el-form-item v-if="notBastic" label="站点类型 " prop="siteType">
          <el-select v-model="siteForm.siteType" placeholder="请选择站点类型" style="width: 260px" filterable>
            <el-option
              v-for="item in siteOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="notBastic" label="站点状态 " prop="siteType">
          <el-select v-model="siteForm.siteStatus" placeholder="请选择站点状态" style="width: 260px" filterable>
            <el-option
              v-for="item in siteStatusOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="站点名称 " prop="siteName">
          <el-input v-model="siteForm.siteName" placeholder="请输入站点名称" maxlength="20"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEditForm('siteForm')">确 定</el-button>
        <el-button @click="resetForm('siteForm')">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 10px;
    top: 3px;
  }
  .input-item{
    float: left;
    margin-top: 14px;
    margin-right: 10px;
  }
  .search-input{
    width: 155px;
  }
  .short-input{
    width: 126px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 310px);
  }
  .select-thead-btn{
    width: 45px;
    height: 42px;
    position: absolute;
    z-index: 200;
    background: rgba(0,0,0,.2);
    right: 15px;
    top: 15px;
  }
  .select-thead{
    width: 180px;
    height: 335px;
    border: 1px solid #e2e2e2;
    position: absolute;
    z-index: 200;
    background: #fff;
    right: 15px;
    top: 60px;
  }
  .options-box{
    height: 280px;
    overflow: auto;
    margin-bottom: 10px;
  }
</style>
