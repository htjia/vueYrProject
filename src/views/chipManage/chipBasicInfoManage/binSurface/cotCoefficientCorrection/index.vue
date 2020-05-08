<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0">
      <div class="header-btn-group" style="padding-top: 10px;">
        <span style="line-height:35px">&nbsp;</span>
        <el-button
          size="small"
          style="float:right"
          type="primary"
          @click="handleAdd"
        ><svg-icon icon-class="add"/> 新增修正</el-button>
      </div>
      <div class="search-box">
        <div class="left-search-box">
          <div class="input-item">
            <span class="input-title" style="width:35px">日期 </span>
            <el-date-picker
              v-model="beginDate"
              :picker-options="pickerOptionsStart"
              :editable="false"
              class="search-input"
              size="small"
              type="date"
              placeholder="开始日期"
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
              placeholder="结束日期"
              value-format="timestamp"
            />
          </div>
          <div class="input-item">
            <span class="input-title" style="width:35px">型号 </span>
            <el-select v-model="model" class="search-input" style="width:100px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in modelList"
                :key="item.id"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width:35px">光色 </span>
            <el-select v-model="color" class="search-input" style="width:100px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in colorList"
                :key="item.id"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width:35px">工艺 </span>
            <el-select v-model="gy" class="search-input" style="width:120px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in gyList"
                :key="item.id"
                :label="item.name"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">启用状态 </span>
            <el-select v-model="isDisable" class="search-input" style="width:100px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in disableList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
        </div>
        <div class="right-btn-box">
          <el-button
            class="float-right margin-top margin-left"
            size="small"
            type="danger"
            @click="clearAll"
          >
            <svg-icon icon-class="clear"/> 重 置
          </el-button>
          <el-button
            class="float-right margin-top"
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="handleSearch" >查 询</el-button>
        </div>
      </div>
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        height="calc(100vh - 288px)"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="型号" align="center" prop="model"/>
        <el-table-column label="工艺" align="center" prop="craft"/>
        <el-table-column label="光色" align="center" prop="color"/>
        <el-table-column label="方圆" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 0">圆</span>
            <span v-if="scope.row.type === 1">方</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark"/>
        <el-table-column label="修改人" align="center" prop="creatorName"/>
        <el-table-column label="修改时间" align="center" prop="createTime"/>
        <el-table-column label="是否启用" align="center" prop="status">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isChecked" @change="setStatus(scope.row)">启用</el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="status">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
            <el-button
              size="mini"
              icon="el-icon-delete"
              type="danger"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible"
      title="新增修正"
      width="1200px">
      <fieldset class="fieldest">
        <legend class="legendsty"> 基础信息 </legend>
        <div class="input-item">
          <span class="input-title">型号 </span>
          <el-select v-model="newmodel" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in modelList"
              :key="item.id"
              :label="item.code"
              :value="item.code"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">光色 </span>
          <el-select v-model="newcolor" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in colorList"
              :key="item.id"
              :label="item.code"
              :value="item.code"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">工艺 </span>
          <el-select v-model="newgy" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in gyList"
              :key="item.id"
              :label="item.code"
              :value="item.code"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">方圆 </span>
          <el-select v-model="newtype" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item" style="width:100%;text-align:left">
          <span class="input-title" style="width: 70px;line-height: 60px;">备注 </span>
          <el-input v-model="remark" type="textarea" class="search-input" style="width:1000px" size="small" maxlength="50"/>
        </div>
      </fieldset>
      <fieldset class="fieldest" style="margin-top: 15px;">
        <legend class="legendsty"> 修正信息 </legend>
        <el-table
          :data="showCheckList"
          class="run-table"
          element-loading-text="拼命加载中"
          border
          fit>
          <el-table-column fixed label="参数" align="center" prop="param"/>
          <el-table-column fixed label="Gain" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.gain" class="search-input" size="small" style="width:90%" maxlength="8"/>
            </template>
          </el-table-column>
          <el-table-column fixed label="Offset" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.offset" class="search-input" size="small" style="width:90%" maxlength="8"/>
            </template>
          </el-table-column>
        </el-table>
      </fieldset>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm()">确 定</el-button>
        <el-button @click="addDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="修改"
      width="1200px">
      <fieldset class="fieldest">
        <legend class="legendsty"> 基础信息 </legend>
        <div class="input-item">
          <span class="input-title">型号 </span>
          <el-select v-model="newmodel" class="search-input" size="small" disabled placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in modelList"
              :key="item.id"
              :label="item.code"
              :value="item.code"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">光色 </span>
          <el-select v-model="newcolor" class="search-input" size="small" disabled placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in colorList"
              :key="item.id"
              :label="item.code"
              :value="item.code"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">工艺 </span>
          <el-select v-model="newgy" class="search-input" size="small" disabled placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in gyList"
              :key="item.id"
              :label="item.code"
              :value="item.code"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">方圆 </span>
          <el-select v-model="newtype" class="search-input" size="small" disabled placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item" style="width:100%;text-align:left">
          <span class="input-title" style="width: 70px;line-height: 60px;">备注 </span>
          <el-input v-model="remark" type="textarea" class="search-input" style="width:1000px" size="small" maxlength="50"/>
        </div>
      </fieldset>
      <fieldset class="fieldest" style="margin-top: 15px;">
        <legend class="legendsty"> 修正信息 </legend>
        <el-table
          :data="showCheckList"
          class="run-table"
          element-loading-text="拼命加载中"
          border
          fit>
          <el-table-column fixed label="参数" align="center" prop="param"/>
          <el-table-column fixed label="Gain" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.gain" class="search-input" size="small" style="width:90%" maxlength="8"/>
            </template>
          </el-table-column>
          <el-table-column fixed label="Offset" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.offset" class="search-input" size="small" style="width:90%" maxlength="8"/>
            </template>
          </el-table-column>
        </el-table>
      </fieldset>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editsubmitForm()">确 定</el-button>
        <el-button @click="editDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .app-container{
    position: relative;
    height: calc(100vh - 258px);
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
    width: 140px;
  }
</style>
