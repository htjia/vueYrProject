<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0">
      <div class="search-box">
        <div class="left-search-box">
          <div class="input-item">
            <span class="input-title">标签名称 </span>
            <el-input v-model="labelName" class="search-input" style="width: 280px" placeholder="请输入标签名称" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">客户名称 </span>
            <el-select v-model="customerName" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in customerLists"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <el-button
              class="margin-left"
              size="small"
              type="primary"
              icon="el-icon-search"
              @click="fetchData" >查 询</el-button>
            <el-button
              class="margin-left"
              size="small"
              type="danger"
              @click="clearCondition"
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
            @click="handleAdd"><svg-icon icon-class="add"/> 新增标签</el-button>
        </div>
      </div>
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        height="calc(100vh - 238px)"
        border
        fit>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="标签名称" align="center" prop="name"/>
        <el-table-column label="适用片型" align="center" width="100px">
          <template slot-scope="scope">
            <span v-if="scope.row.sliceType === 0">
              圆片
            </span>
            <span v-if="scope.row.sliceType === 1">
              方片
            </span>
          </template>
        </el-table-column>
        <el-table-column label="客户名称" align="center" prop="customerName"/>
        <el-table-column label="修改人" align="center" prop="creatorName" width="120px"/>
        <el-table-column label="修改时间" align="center" prop="createTime"/>
        <el-table-column label="操作" align="center" prop="status">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
            <el-button
              size="mini"
              icon="el-icon-delete"
              type="danger"
              @click="handleDelete(scope.row)"
            >删除</el-button>
            <el-button
              size="mini"
              icon="el-icon-down"
              @click="download(scope.row)"><svg-icon icon-class="pilxz" style="margin-right: 5px"/>下载模版</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible"
      title="新增标签"
      width="1200px">
      <el-row>
        <el-col :span="13">
          <fieldset class="fieldest">
            <legend class="legendsty"> 基础信息 </legend>
            <div class="input-item" style="width:100%;text-align:left">
              <span class="input-title" style="width: 100px;line-height: 30px;">复制已有标签 </span>
              <el-select v-model="alread" class="search-input" size="small" placeholder="请选择" filterable clearable @change="produceName">
                <el-option
                  v-for="item in list"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </div>
            <div class="input-item" style="width:100%;text-align:left">
              <span class="input-title" style="width: 100px;line-height: 30px;">标签名称 </span>
              <el-input v-model="labelNames" class="search-input" style="width: 440px;" placeholder="请输入标签名称" size="small" maxlength="20"/>
            </div>
            <div class="input-item">
              <span class="input-title" style="width: 100px;line-height: 30px;">客户名称 </span>
              <el-select v-model="cuntomerNew" class="search-input" size="small" placeholder="请选择" filterable>
                <el-option
                  v-for="item in customerLists"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </div>
            <div class="input-item">
              <span class="input-title" style="width: 100px;line-height: 30px;">适用片型 </span>
              <el-select v-model="typeName" class="search-input" size="small" placeholder="请选择" filterable>
                <el-option
                  v-for="item in typeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </div>
          </fieldset>
          <fieldset class="fieldest" style="margin-top:15px">
            <legend class="legendsty"> 标签信息 </legend>
            <el-row style="padding-top:15px">
              <el-col :span="12">
                <el-upload
                  ref="upload"
                  :auto-upload="true"
                  :on-success="onSuccess"
                  :on-error="onError"
                  :action="fileUrl"
                  :show-file-list="false"
                  :before-upload="beforeUpload"
                  :with-credentials="true"
                  :data="uploadParams"
                  style="margin-right: 15px"
                  accept=".png,.jpg"
                  class="upload-demo"
                >
                  <el-button v-loading="loading" slot="trigger" size="small" type="primary"><svg-icon icon-class="shangchuan"/>  图片上传</el-button>
                </el-upload>
              </el-col>
              <el-col :span="12">
                <el-upload
                  ref="upload"
                  :auto-upload="true"
                  :on-success="onSuccess"
                  :on-error="onError"
                  :action="fileUrl"
                  :show-file-list="false"
                  :before-upload="beforeUpload"
                  :with-credentials="true"
                  :data="uploadParams"
                  style="margin-right: 15px"
                  accept=".btw"
                  class="upload-demo"
                >
                  <el-button v-loading="loading" slot="trigger" size="small" type="primary"><svg-icon icon-class="shangchuan"/>  文件上传</el-button>
                </el-upload>
              </el-col>
            </el-row>
            <div class="imgClass">
              <img v-if="imgName !== ''" :src="imgName" style="height: 200px">
            </div>
          </fieldset>
        </el-col>
        <el-col :span="11">
          <fieldset class="fieldest">
            <legend class="legendsty"> 变量管理 </legend>
            <div style="width:100%;text-align:right;margin-bottom:15px">
              <el-button type="primary" size="small" @click="openAlready()">选择已有变量</el-button>
              <el-button type="primary" size="small" @click="openNew()">添加变量</el-button>
            </div>
            <el-table
              :data="bllist"
              border
              fit
              height="409px">
              <el-table-column align="center" label="序号" width="50">
                <template slot-scope="scope">
                  {{ scope.$index+1 }}
                </template>
              </el-table-column>
              <el-table-column label="变量名" align="center" prop="param" width="100px" show-overflow-tooltip=""/>
              <el-table-column label="变量值" align="center" prop="sqlstr" show-overflow-tooltip=""/>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" icon="el-icon-edit" @click="sqlEdit(scope.row,scope.$index)">修改</el-button>
                  <el-button
                    size="mini"
                    icon="el-icon-delete"
                    type="danger"
                    @click="sqlDelete(scope.$index)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </fieldset>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="isDisable" type="primary" @click="submitForm()">确 定</el-button>
        <el-button @click="addDialogVisible = false">取 消</el-button>
      </span>
      <el-dialog
        :visible.sync="setDialogVisible"
        width="800px"
        top="80px"
        class="tip-out-inner-dialog"
        title="编辑变量"
        append-to-body
        @close="handleClose('machineForm')">
        <el-form ref="machineForm" :model="machineForm" :rules="rules" status-icon label-width="95px" label-position="right">
          <el-form-item label="变量名 " prop="newName">
            <el-input v-model="machineForm.newName" placeholder="请输入变量名"/>
          </el-form-item>
          <el-form-item label="SQL" prop="newSql">
            <el-input v-model="machineForm.newSql" :autosize="{ minRows: 10}" type="textarea" placeholder="请输入SQL"/>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button :disabled="isDisable" type="primary" @click="getSql('machineForm')">确 定</el-button>
          <el-button @click="setDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :visible.sync="configDialogVisible"
        width="800px"
        top="80px"
        class="tip-out-inner-dialog"
        title="变量选择"
        append-to-body>
        <div>
          <el-row>
            <el-col :span="24">
              <el-table
                ref="multipleTable"
                :data="anotherLists"
                class="mocvd-table run-table"
                height="340px"
                element-loading-text="拼命加载中"
                border
                fit
                @selection-change="handleSelectionChanges">
                <el-table-column type="selection" width="55"/>
                <el-table-column label="变量名" align="center" prop="param" width="100px" show-overflow-tooltip=""/>
                <el-table-column label="值" align="center" prop="sqlstr" show-overflow-tooltip=""/>
              </el-table>
            </el-col>
          </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="getTitle()">确 定</el-button>
          <el-button @click="configDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="修改标签"
      width="1200px">
      <el-row>
        <el-col :span="13">
          <fieldset class="fieldest">
            <legend class="legendsty"> 基础信息 </legend>
            <div class="input-item" style="width:100%;text-align:left">
              <span class="input-title" style="width: 100px;line-height: 30px;">标签名称 </span>
              <el-input v-model="labelNames" :disabled="true" class="search-input" style="width: 440px;" placeholder="请输入标签名称" size="small" maxlength="20"/>
            </div>
            <div class="input-item">
              <span class="input-title" style="width: 100px;line-height: 30px;">客户名称 </span>
              <el-select v-model="cuntomerNew" :disabled="true" class="search-input" size="small" placeholder="请选择" filterable>
                <el-option
                  v-for="item in customerLists"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </div>
            <div class="input-item">
              <span class="input-title" style="width: 100px;line-height: 30px;">适用片型 </span>
              <el-select v-model="typeName" :disabled="true" class="search-input" size="small" placeholder="请选择" filterable>
                <el-option
                  v-for="item in typeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </div>
          </fieldset>
          <fieldset class="fieldest" style="margin-top:15px">
            <legend class="legendsty"> 标签信息 </legend>
            <el-row style="padding-top:15px">
              <el-col :span="12">
                <el-upload
                  ref="upload"
                  :auto-upload="true"
                  :on-success="onSuccess"
                  :on-error="onError"
                  :action="fileUrl"
                  :show-file-list="false"
                  :before-upload="beforeUpload"
                  :with-credentials="true"
                  :data="uploadParams"
                  style="margin-right: 15px"
                  accept=".png,.jpg"
                  class="upload-demo"
                >
                  <el-button v-loading="loading" slot="trigger" size="small" type="primary"><svg-icon icon-class="shangchuan"/>  图片上传</el-button>
                </el-upload>
              </el-col>
              <el-col :span="12">
                <el-upload
                  ref="upload"
                  :auto-upload="true"
                  :on-success="onSuccess"
                  :on-error="onError"
                  :action="fileUrl"
                  :show-file-list="false"
                  :before-upload="beforeUpload"
                  :with-credentials="true"
                  :data="uploadParams"
                  style="margin-right: 15px"
                  accept=".btw"
                  class="upload-demo"
                >
                  <el-button v-loading="loading" slot="trigger" size="small" type="primary"><svg-icon icon-class="shangchuan"/>  文件上传</el-button>
                </el-upload>
              </el-col>
            </el-row>
            <div class="imgClass">
              <img v-if="imgName !== ''" :src="imgName" style="height: 200px">
            </div>
          </fieldset>
        </el-col>
        <el-col :span="11">
          <fieldset class="fieldest">
            <legend class="legendsty"> 变量管理 </legend>
            <div style="width:100%;text-align:right;margin-bottom:15px">
              <el-button type="primary" size="small" @click="openAlready()">选择已有变量</el-button>
              <el-button type="primary" size="small" @click="openNew()">添加变量</el-button>
            </div>
            <el-table
              :data="bllist"
              border
              fit
              height="363px">
              <el-table-column align="center" label="序号" width="50">
                <template slot-scope="scope">
                  {{ scope.$index+1 }}
                </template>
              </el-table-column>
              <el-table-column label="变量名" align="center" prop="param" width="100px" show-overflow-tooltip=""/>
              <el-table-column label="变量值" align="center" prop="sqlstr" show-overflow-tooltip=""/>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" icon="el-icon-edit" @click="sqlEdit(scope.row,scope.$index)">修改</el-button>
                  <el-button
                    size="mini"
                    icon="el-icon-delete"
                    type="danger"
                    @click="sqlDelete(scope.$index)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </fieldset>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="isDisable" type="primary" @click="editsubmitForm()">确 定</el-button>
        <el-button @click="editDialogVisible = false">取 消</el-button>
      </span>
      <el-dialog
        :visible.sync="setDialogVisible"
        width="800px"
        top="80px"
        class="tip-out-inner-dialog"
        title="编辑变量"
        append-to-body
        @close="handleClose('machineForm')">
        <el-form ref="machineForm" :model="machineForm" :rules="rules" status-icon label-width="95px" label-position="right">
          <el-form-item label="变量名 " prop="newName">
            <el-input v-model="machineForm.newName" placeholder="请输入变量名"/>
          </el-form-item>
          <el-form-item label="SQL" prop="newSql">
            <el-input v-model="machineForm.newSql" :autosize="{ minRows: 10}" type="textarea" placeholder="请输入SQL"/>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="getSql('machineForm')">确 定</el-button>
          <el-button @click="setDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :visible.sync="configDialogVisible"
        width="800px"
        top="80px"
        class="tip-out-inner-dialog"
        title="变量选择"
        append-to-body>
        <div>
          <el-row>
            <el-col :span="24">
              <el-table
                ref="multipleTable"
                :data="anotherLists"
                class="mocvd-table run-table"
                height="340px"
                element-loading-text="拼命加载中"
                border
                fit
                @selection-change="handleSelectionChanges">
                <el-table-column type="selection" width="55"/>
                <el-table-column label="变量名" align="center" prop="param" width="100px" show-overflow-tooltip=""/>
                <el-table-column label="值" align="center" prop="sqlstr" show-overflow-tooltip=""/>
              </el-table>
            </el-col>
          </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="getTitle()">确 定</el-button>
          <el-button @click="configDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .imgClass{
      width: 100%;
      margin-top: 15px;
      min-height: 200px;
      border: 1px solid #e5e5e5;
      display: flex;
      align-items: center;
      justify-content: center;

  }
  .tip-out-inner-dialog>>>.el-checkbox{
    margin-left: 20px;
  }
  .tip-out-inner-dialog>>>.el-textarea textarea{
    height: 300px !important;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 208px);
  }
  .fieldest{
    border: 1px solid #DCDFE6;
    padding-bottom: 15px;
  }
  .legendsty{
    padding-left:8px;
    padding-right:8px;
    font-weight: bold;
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
    width: 210px;
  }
  .input-item{
    float: left;
    margin-top: 14px;
    margin-right: 10px;
  }
  .search-input{
    width: 155px;
  }
</style>
