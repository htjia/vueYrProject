<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0">
      <div class="search-box">
        <div class="left-search-box">
          <div class="input-item">
            <span class="input-title" style="width:35px">型号 </span>
            <el-select v-model="model" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in modelList"
                :key="item.id"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">光色 </span>
            <el-select v-model="color" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in colorOptions"
                :key="item.id"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item">
            <el-button
              class="margin-left"
              size="small"
              type="primary"
              icon="el-icon-search"
              @click="handleSearch" >查 询</el-button>
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
          <el-button
            style="margin-top: 15px"
            class="float-right margin-left"
            size="small"
            type="primary"
            @click="handleAdd1"><svg-icon icon-class="add"/> 参照新增</el-button>
        </div>
      </div>
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        height="calc(100vh - 236px)"
        border
        fit
        stripe
        highlight-current-row
        @current-change="handleCurrentChange">
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="名称" align="center" prop="name"/>
        <el-table-column label="光色" align="center" prop="color"/>
        <el-table-column label="型号" align="center" prop="model"/>
        <el-table-column label="工艺" align="center" prop="craft"/>
        <el-table-column label="修改人" align="center" prop="creatorName"/>
        <el-table-column label="修改时间" align="center" prop="createTime" show-overflow-tooltip=""/>
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
      title="新增"
      width="1200px"
      class="tip-out-inner-dialog">
      <fieldset class="fieldest" style="margin-top: -15px;width:100%">
        <legend class="legendsty"> 基础信息 </legend>
        <div class="input-item" style="margin-top:-5px;width:100%;text-align:left">
          <span class="input-title" style="width: 100px;line-height: 30px;">选择已有标准 </span>
          <el-select v-model="aleady" class="search-input" size="small" placeholder="请选择" filterable @change="alreadyName">
            <el-option
              v-for="item in alList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">型号 </span>
          <el-select v-model="newModel" class="search-input" size="small" placeholder="请选择" filterable @change="produceName">
            <el-option
              v-for="item in modelList"
              :key="item.id"
              :label="item.code"
              :value="item.code"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">光色 </span>
          <el-select v-model="newcolor" class="search-input" size="small" placeholder="请选择" filterable @change="produceName">
            <el-option
              v-for="item in colorOptions"
              :key="item.id"
              :label="item.code"
              :value="item.code"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">工艺 </span>
          <el-select v-model="newcraft" class="search-input" size="small" placeholder="请选择" filterable @change="produceName">
            <el-option
              v-for="item in craftList"
              :key="item.id"
              :label="item.code"
              :value="item.code"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">标准名称 </span>
          <el-input v-model="newName" :disabled="true" class="search-input" placeholder="" size="small" maxlength="20"/>
        </div>
      </fieldset>
      <fieldset class="fieldest" style="margin-top:15px;width:100%">
        <legend class="legendsty"> 参数设置 </legend>
        <div style="margin-top: -15px;">
          <i class="addBtn el-icon-circle-plus" @click="addList()"/>
        </div>
        <el-table
          v-loading="listLoading"
          :data="list1"
          height="208px"
          element-loading-text="拼命加载中"
          border
          fit
          stripe>
          <el-table-column label="参数" align="center">
            <template slot-scope="scope">
              <el-select v-model="scope.row.field" class="search-input" size="mini" style="width:90%" placeholder="请选择" filterable @change="fieldChange">
                <el-option
                  v-for="item in newFieldList"
                  :key="item.thKey"
                  :label="item.thName"
                  :value="item.thKey"
                  :disabled="item.disabled"/>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="单位" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.unit" class="search-input" style="width:90%" placeholder="" size="mini" maxlength="20"/>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="100px">
            <template slot-scope="scope">
              <i v-if="list1.length>1" class="deleteBtn el-icon-remove" style="margin-right: 35px;" @click="deleteList(scope.$index)"/>
            </template>
          </el-table-column>
        </el-table>
      </fieldset>
      <fieldset class="fieldest" style="margin-top:15px;width:100%">
        <legend class="legendsty"> 标色设置 </legend>
        <div id="colorSet" style="width: 1125px;overflow: auto;display: inline-flex;">
          <div v-for="(item,index) of list1" :key="index" style="padding:0 5px;width:500px">
            <div>
              <el-button type="primary" style="margin-bottom:15px" size="mini" icon="el-icon-edit" @click="openSet(index)">自动生成</el-button>
              <i v-if="item.newDataList.length<30" class="addBtn el-icon-circle-plus" @click="addItem(index)"/>
            </div>
            <el-table
              :data="item.newDataList"
              element-loading-text="拼命加载中"
              height="400px"
              class="run-table ste tip-out-inner-dialog"
              border
              fit>
              <el-table-column :label="'Color Index_'+item.field.toUpperCase()" align="center">
                <el-table-column align="center" label="最小值">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.min" class="search-input" style="width:90%" placeholder="" size="mini" maxlength="8" clearable @keyup.native="isNumbersMin(scope.row)"/>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="最大值">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.max" class="search-input" style="width:90%" placeholder="" size="mini" maxlength="8" clearable @keyup.native="isNumbersMax(scope.row)"/>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="显示最小值">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.showmin" class="search-input" style="width:90%" placeholder="" size="mini" maxlength="8" clearable @keyup.native="isNumbersMin(scope.row)"/>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="显示最大值">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.showmax" class="search-input" style="width:90%" placeholder="" size="mini" maxlength="8" clearable @keyup.native="isNumbersMax(scope.row)"/>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="颜色">
                  <template slot-scope="scope">
                    <el-color-picker v-model="scope.row.color"/>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="50px">
                  <template slot-scope="scope">
                    <i v-if="item.newDataList.length>1" class="deleteBtn el-icon-remove" @click="deleteItem(scope.$index,index)"/>
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </fieldset>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm()">确 定</el-button>
        <el-button @click="addDialogVisible = false">取 消</el-button>
      </span>
      <el-dialog
        v-drag
        :close-on-click-modal="false"
        :visible.sync="setDialog"
        width="500px"
        height="490px"
        top="80px"
        class="tip-out-inner-dialog"
        title="自动生成"
        append-to-body>
        <div class="input-item" style="width:100%;text-align:center">
          <span class="input-title" style="width: 100px;line-height: 30px;">计算最小值 </span>
          <el-input v-model="valueMin" class="search-input" style="width:150px" placeholder="" size="small" maxlength="8" clearable @keyup.native="isSevValut1()"/>
        </div>
        <div class="input-item" style="width:100%;text-align:center">
          <span class="input-title" style="width: 100px;line-height: 30px;">计算最大值 </span>
          <el-input v-model="valueMax" class="search-input" style="width:150px" placeholder="" size="small" maxlength="8" clearable @keyup.native="isSevValut2()"/>
        </div>
        <div class="input-item" style="width: 100%;text-align: center;border-bottom: 1px solid #e5e5e5;padding-bottom: 15px;">
          <span class="input-title" style="width: 100px;line-height: 30px;">计算间隔 </span>
          <el-input v-model="tips" class="search-input" style="width:150px" placeholder="" size="small" maxlength="8" clearable @keyup.native="isSevValut5()"/>
        </div>
        <div class="input-item" style="width:100%;text-align:center">
          <span class="input-title" style="width: 100px;line-height: 30px;">显示最小值 </span>
          <el-input v-model="showMin" class="search-input" style="width:150px" placeholder="" size="small" maxlength="8" clearable @keyup.native="isSevValut3()"/>
        </div>
        <div class="input-item" style="width:100%;text-align:center">
          <span class="input-title" style="width: 100px;line-height: 30px;">显示最大值 </span>
          <el-input v-model="showMax" class="search-input" style="width:150px" placeholder="" size="small" maxlength="8" clearable @keyup.native="isSevValut4()"/>
        </div>
        <div class="input-item" style="padding-bottom: 15px;width:100%;text-align:center">
          <span class="input-title" style="width: 100px;line-height: 30px;">显示间隔 </span>
          <el-input v-model="showTips" class="search-input" style="width:150px" placeholder="" size="small" maxlength="8" clearable @keyup.native="isSevValut6()"/>
        </div>
        <div style="width:100%;text-align:center;margin-top:245px">
          定义最大值、最小值、间隔，系统等间距生成区间
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="setValue()">确 定</el-button>
          <el-button @click="setDialog = false">取 消</el-button>
        </span>
      </el-dialog>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="修改"
      width="1200px"
      class="tip-out-inner-dialog">
      <fieldset class="fieldest" style="margin-top: -15px;width:100%">
        <legend class="legendsty"> 基础信息 </legend>
        <div class="input-item" style="margin-top:-5px">
          <span class="input-title">型号 </span>
          <el-select v-model="newModel" :disabled="true" class="search-input" size="small" placeholder="请选择" filterable @change="produceName">
            <el-option
              v-for="item in modelList"
              :key="item.id"
              :label="item.code"
              :value="item.code"/>
          </el-select>
        </div>
        <div class="input-item" style="margin-top:-5px">
          <span class="input-title">光色 </span>
          <el-select v-model="newcolor" :disabled="true" class="search-input" size="small" placeholder="请选择" filterable @change="produceName">
            <el-option
              v-for="item in colorOptions"
              :key="item.id"
              :label="item.code"
              :value="item.code"/>
          </el-select>
        </div>
        <div class="input-item" style="margin-top:-5px">
          <span class="input-title">工艺 </span>
          <el-select v-model="newcraft" :disabled="true" class="search-input" size="small" placeholder="请选择" filterable @change="produceName">
            <el-option
              v-for="item in craftList"
              :key="item.id"
              :label="item.code"
              :value="item.code"/>
          </el-select>
        </div>
        <div class="input-item" style="margin-top:-5px">
          <span class="input-title">标准名称 </span>
          <el-input v-model="newName" :disabled="true" class="search-input" placeholder="" size="small" maxlength="20"/>
        </div>
      </fieldset>
      <fieldset class="fieldest" style="margin-top:15px;width:100%">
        <legend class="legendsty"> 参数设置 </legend>
        <div style="margin-top: -15px;">
          <i class="addBtn el-icon-circle-plus" @click="addList()"/>
        </div>
        <el-table
          v-loading="listLoading"
          :data="list1"
          height="208px"
          element-loading-text="拼命加载中"
          border
          fit
          stripe>
          <el-table-column label="参数" align="center">
            <template slot-scope="scope">
              <el-select v-model="scope.row.field" class="search-input" size="mini" style="width:90%" placeholder="请选择" filterable @change="fieldChange">
                <el-option
                  v-for="item in newFieldList"
                  :key="item.thKey"
                  :label="item.thName"
                  :value="item.thKey"
                  :disabled="item.disabled"/>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="单位" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.unit" class="search-input" style="width:90%" placeholder="" size="mini" maxlength="8"/>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="100px">
            <template slot-scope="scope">
              <i v-if="list1.length>1" class="deleteBtn el-icon-remove" style="margin-right: 35px;" @click="deleteList(scope.$index)"/>
            </template>
          </el-table-column>
        </el-table>
      </fieldset>
      <fieldset class="fieldest" style="margin-top:15px;width:100%">
        <legend class="legendsty"> 标色设置 </legend>
        <div id="colorSet" style="width: 1125px;overflow: auto;display: inline-flex;">
          <div v-for="(item,index) of list1" :key="index" style="padding:0 5px;width:500px">
            <div>
              <el-button type="primary" style="margin-bottom:15px" size="mini" icon="el-icon-edit" @click="openSet(index)">自动生成</el-button>
              <i v-if="item.newDataList.length<30" class="addBtn el-icon-circle-plus" @click="addItem(index)"/>
            </div>
            <el-table
              :data="item.newDataList"
              element-loading-text="拼命加载中"
              height="400px"
              class="run-table ste tip-out-inner-dialog"
              border
              fit>
              <el-table-column :label="'Color Index_'+item.field.toUpperCase()" align="center">
                <el-table-column align="center" label="最小值">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.min" class="search-input" style="width:90%" placeholder="" size="mini" maxlength="8" clearable @keyup.native="isNumbersMin(scope.row)"/>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="最大值">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.max" class="search-input" style="width:90%" placeholder="" size="mini" maxlength="8" clearable @keyup.native="isNumbersMax(scope.row)"/>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="显示最小值">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.showmin" class="search-input" style="width:90%" placeholder="" size="mini" maxlength="8" clearable @keyup.native="isNumbersMin(scope.row)"/>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="显示最大值">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.showmax" class="search-input" style="width:90%" placeholder="" size="mini" maxlength="8" clearable @keyup.native="isNumbersMax(scope.row)"/>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="颜色">
                  <template slot-scope="scope">
                    <el-color-picker v-model="scope.row.color"/>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="50px">
                  <template slot-scope="scope">
                    <i v-if="item.newDataList.length>1" class="deleteBtn el-icon-remove" @click="deleteItem(scope.$index,index)"/>
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </fieldset>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editsubmitForm()">确 定</el-button>
        <el-button @click="editDialogVisible = false">取 消</el-button>
      </span>
      <el-dialog
        v-drag
        :close-on-click-modal="false"
        :visible.sync="setDialog"
        width="500px"
        height="490px"
        top="80px"
        class="tip-out-inner-dialog"
        title="自动生成"
        append-to-body>
        <div class="input-item" style="width:100%;text-align:center">
          <span class="input-title" style="width: 100px;line-height: 30px;">计算最小值 </span>
          <el-input v-model="valueMin" class="search-input" style="width:150px" placeholder="" size="small" maxlength="8" clearable @keyup.native="isSevValut1()"/>
        </div>
        <div class="input-item" style="width:100%;text-align:center">
          <span class="input-title" style="width: 100px;line-height: 30px;">计算最大值 </span>
          <el-input v-model="valueMax" class="search-input" style="width:150px" placeholder="" size="small" maxlength="8" clearable @keyup.native="isSevValut2()"/>
        </div>
        <div class="input-item" style="border-bottom: 1px solid #e5e5e5;padding-bottom: 15px;width:100%;text-align:center">
          <span class="input-title" style="width: 100px;line-height: 30px;">计算间隔 </span>
          <el-input v-model="tips" class="search-input" style="width:150px" placeholder="" size="small" maxlength="8" clearable @keyup.native="isSevValut5()"/>
        </div>
        <div class="input-item" style="width:100%;text-align:center">
          <span class="input-title" style="width: 100px;line-height: 30px;">显示最小值 </span>
          <el-input v-model="showMin" class="search-input" style="width:150px" placeholder="" size="small" maxlength="8" clearable @keyup.native="isSevValut3()"/>
        </div>
        <div class="input-item" style="width:100%;text-align:center">
          <span class="input-title" style="width: 100px;line-height: 30px;">显示最大值 </span>
          <el-input v-model="showMax" class="search-input" style="width:150px" placeholder="" size="small" maxlength="8" clearable @keyup.native="isSevValut4()"/>
        </div>
        <div class="input-item" style="width:100%;text-align:center;padding-bottom: 15px">
          <span class="input-title" style="width: 100px;line-height: 30px;">显示间隔 </span>
          <el-input v-model="showTips" class="search-input" style="width:150px" placeholder="" size="small" maxlength="8" clearable @keyup.native="isSevValut6()"/>
        </div>
        <div style="width:100%;text-align:center;margin-top:245px">
          定义最大值、最小值、间隔，系统等间距生成区间
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="setValue()">确 定</el-button>
          <el-button @click="setDialog = false">取 消</el-button>
        </span>
      </el-dialog>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .deleteBtn{
    margin-right: 8px;
    font-size: 30px;
    color: #d56c28;
    cursor: pointer;
    float: right;
  }
  .addBtn{
    transform: translateX(-50%);
    font-size: 30px;
    color: #009494;
    cursor: pointer;
    float: right;
    margin-right: 0px;
  }
  .rule-info{
    width: 100%;
    text-align: center;
    float: left;
    margin-top: 15px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 206px);
  }
  .tab-control span{
    line-height: 50px;
  }
  .fieldest{
    border: 1px solid #DCDFE6;
    padding: 15px;
  }
  .legendsty{
    padding-left:8px;
    padding-right:8px;
    font-weight: bold;
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
  .input-item1{
    margin-top: 14px;
    margin-right: 25px;
  }
  .search-input{
    width: 125px;
  }
  .input-title1{
    font-weight: bold;
    display: inline-block;
    width: 140px;
    padding-right: 5px;
    text-align: right;
  }
  .tip-out-inner-dialog>>>.el-color-picker__trigger{
    width: 64px;
    padding: 0px;
    height: 30px;
    margin-bottom: -10px;
  }
  .tip-out-inner-dialog>>>.el-color-picker__color{
    border:0;
  }
  .tip-out-inner-dialog>>>.el-color-picker{
    height: 30px;
  }
  .run-table ::-webkit-scrollbar {/*滚动条整体样式*/
    height: 10px !important;
  }
  .tip-out-inner-dialog>>>.el-dialog__body ::-webkit-scrollbar {
    height: 10px !important;
  }
</style>
