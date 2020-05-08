<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0">
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
            <el-select v-model="model" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in modelList"
                :key="item.id"
                :label="item.code"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width:35px">光色 </span>
            <el-select v-model="color" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in colorList"
                :key="item.id"
                :label="item.code"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">启用状态 </span>
            <el-select v-model="isDisable" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in disableList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <el-button
              class="float-right margin-left"
              size="small"
              type="danger"
              @click="clearAll"
            >
              <svg-icon icon-class="clear"/> 重 置
            </el-button>
            <el-button
              class="float-right"
              size="small"
              type="primary"
              icon="el-icon-search"
              @click="handleSearch" >查 询</el-button>
          </div>
        </div>
        <div class="right-btn-box">
          <el-button
            size="small"
            style="margin-top: 15px;float:right"
            type="primary"
            @click="handleAdd"
          ><svg-icon icon-class="add"/> 新增AOI采样标准</el-button>
        </div>
      </div>
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        height="calc(100vh - 280px)"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
          </template>
        </el-table-column>
        <el-table-column label="标准名称" align="center" prop="name"/>
        <el-table-column label="型号" align="center" prop="model"/>
        <el-table-column label="光色" align="center" prop="color"/>
        <el-table-column label="修改人" align="center" prop="creatorName"/>
        <el-table-column label="修改时间" align="center" prop="createTime"/>
        <el-table-column label="是否启用" align="center" prop="status">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isChecked" @change="setStatus(scope.row)"/>
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
      title="新增AOI采样标准"
      width="800px"
      class="edit-dialog">
      <fieldset class="fieldest" style="width:100%">
        <legend class="legendsty"> 型号选择 </legend>
        <div class="input-item" style="width:100%;text-align:left">
          <span class="input-title" style="width:90px">选择已有标准 </span>
          <el-select v-model="allready" class="search-input" size="small" placeholder="请选择" filterable clearable @change="setHasBZ">
            <el-option
              v-for="item in allreadyList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title" style="width:35px">型号 </span>
          <el-select v-model="newmodel" class="search-input" style="width:180px" size="small" placeholder="请选择" filterable @change="setNewName">
            <el-option
              v-for="item in modelList"
              :key="item.id"
              :label="item.code"
              :value="item.code"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title" style="width:35px">光色 </span>
          <el-select v-model="newcolor" class="search-input" style="width:180px" size="small" placeholder="请选择" filterable @change="setNewName">
            <el-option
              v-for="item in colorList"
              :key="item.id"
              :label="item.code"
              :value="item.code"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">标准名称 </span>
          <el-input v-model="newname" :disabled="true" class="search-input" size="small"/>
        </div>
      </fieldset>
      <!-- <div>
        <el-button type="primary" style="margin: 15px 0px 0px;" size="small" @click="addConfig()">字段配置</el-button>
      </div> -->
      <el-row>
        <el-col :span="24" style="padding: 15px 15px 15px 0;">
          <fieldset class="fieldest" style="width:100%">
            <legend class="legendsty"> 采样条件 </legend>
            <el-button type="primary" style="margin: -10px 0px 5px;" size="small" @click="addCY()">增加</el-button>
            <el-table
              v-loading="listLoading"
              :data="cytjList"
              element-loading-text="拼命加载中"
              height="300px"
              border
              fit
              stripe>
              <el-table-column label="字段" align="center">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.field" class="search-input" size="mini" style="width:90%" placeholder="请选择" filterable>
                    <el-option
                      v-for="item in cowBaseList"
                      :key="item.thKey"
                      :label="item.thName"
                      :value="item.thKey"/>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="操作符" align="center">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.symbol" class="search-input" style="width:90%" size="small" placeholder="请选择" filterable clearable>
                    <el-option
                      v-for="item in sampList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name"/>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="值" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.val" class="search-input" style="width:90%" placeholder="" size="small" maxlength="8" filterable clearable/>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="100px">
                <template slot-scope="scope">
                  <i class="deleteBtn el-icon-remove" style="margin-right: 35px;" @click="removeCY(scope.$index)"/>
                </template>
              </el-table-column>
            </el-table>
          </fieldset>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAddForm()">确 定</el-button>
        <el-button @click="addDialogVisible = false">取 消</el-button>
      </span>
      <el-dialog
        :visible.sync="configDialogVisible"
        width="800px"
        top="80px"
        class="tip-out-inner-dialog"
        title="配置"
        append-to-body>
        <div>
          <el-row>
            <el-col :span="11">
              <fieldset class="fieldest" style="width:100%">
                <legend class="legendsty"> 已选中字段 {{ leftTree[0].children.length }} </legend>
                <el-tree
                  ref="lefttree"
                  :data="leftTree"
                  :props="defaultProps"
                  show-checkbox
                  default-expand-all
                  node-key="id"
                  style="height: 560px;overflow: auto;"
                  highlight-current/>
              </fieldset>
            </el-col>
            <el-col :span="2" style="text-align: center;font-size: 36px;color: #009494">
              <div style="margin-top: 260px;cursor: pointer;" @click="toLeft">
                <svg-icon icon-class="left"/>
              </div>
              <div style="cursor: pointer;" @click="toRight">
                <svg-icon icon-class="right"/>
              </div>
            </el-col>
            <el-col :span="11">
              <fieldset class="fieldest" style="width:100%">
                <legend class="legendsty"> 待选中字段 {{ rightTree[0].children.length }} </legend>
                <el-tree
                  ref="righttree"
                  :data="rightTree"
                  :props="defaultProps"
                  show-checkbox
                  default-expand-all
                  node-key="id"
                  style="height: 560px;overflow: auto;"
                  highlight-current/>
              </fieldset>
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
      :before-close="handleClose"
      title="编辑AOI采样标准"
      width="1200px"
      class="edit-dialog">
      <fieldset class="fieldest" style="width:100%">
        <legend class="legendsty"> 型号选择 </legend>
        <div class="input-item">
          <span class="input-title" style="width:35px">型号 </span>
          <el-select v-model="newmodel" :disabled="true" class="search-input" style="width:180px" size="small" placeholder="请选择" filterable clearable @change="setNewName">
            <el-option
              v-for="item in modelList"
              :key="item.id"
              :label="item.code"
              :value="item.code"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title" style="width:35px">光色 </span>
          <el-select v-model="newcolor" :disabled="true" class="search-input" style="width:180px" size="small" placeholder="请选择" filterable clearable @change="setNewName">
            <el-option
              v-for="item in colorList"
              :key="item.id"
              :label="item.code"
              :value="item.code"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">标准名称 </span>
          <el-input v-model="newname" :disabled="true" class="search-input" size="small"/>
        </div>
      </fieldset>
      <!-- <div>
        <el-button type="primary" style="margin: 15px 0px 0px;" size="small" @click="addConfigs()">字段配置</el-button>
      </!-->
      <el-row>
        <el-col :span="24" style="padding: 15px 15px 15px 0;">
          <fieldset class="fieldest" style="width:100%">
            <legend class="legendsty"> 采样条件 </legend>
            <el-button type="primary" style="margin: -10px 0px 5px;" size="small" @click="addCY()">增加</el-button>
            <el-table
              v-loading="listLoading"
              :data="cytjList"
              element-loading-text="拼命加载中"
              height="300px"
              border
              fit
              stripe>
              <el-table-column label="字段" align="center">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.field" class="search-input" size="mini" style="width:90%" placeholder="请选择" filterable>
                    <el-option
                      v-for="item in cowBaseList"
                      :key="item.thKey"
                      :label="item.thName"
                      :value="item.thKey"/>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="操作符" align="center">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.symbol" class="search-input" style="width:90%" size="small" placeholder="请选择" filterable clearable>
                    <el-option
                      v-for="item in sampList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name"/>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="值" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.val" class="search-input" style="width:90%" placeholder="" size="small" maxlength="8" clearable/>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="100px">
                <template slot-scope="scope">
                  <i class="deleteBtn el-icon-remove" style="margin-right: 35px;" @click="removeCY(scope.$index)"/>
                </template>
              </el-table-column>
            </el-table>
          </fieldset>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEditForm()">确 定</el-button>
        <el-button @click="handleClose()">取 消</el-button>
      </span>
      <el-dialog
        :visible.sync="configDialogVisibles"
        width="800px"
        top="80px"
        class="tip-out-inner-dialog"
        title="配置"
        append-to-body>
        <div>
          <el-row>
            <el-col :span="11">
              <fieldset class="fieldest" style="width:100%">
                <legend class="legendsty"> 已选中字段 {{ leftTree[0].children.length }} </legend>
                <el-tree
                  ref="lefttrees"
                  :data="leftTrees"
                  :props="defaultProps"
                  show-checkbox
                  default-expand-all
                  node-key="id"
                  style="height: 560px;overflow: auto;"
                  highlight-current/>
              </fieldset>
            </el-col>
            <el-col :span="2" style="text-align: center;font-size: 36px;color: #009494">
              <div style="margin-top: 260px;cursor: pointer;" @click="toLefts">
                <svg-icon icon-class="left"/>
              </div>
              <div style="cursor: pointer;" @click="toRights">
                <svg-icon icon-class="right"/>
              </div>
            </el-col>
            <el-col :span="11">
              <fieldset class="fieldest" style="width:100%">
                <legend class="legendsty"> 待选中字段 {{ rightTree[0].children.length }} </legend>
                <el-tree
                  ref="righttrees"
                  :data="rightTrees"
                  :props="defaultProps"
                  show-checkbox
                  default-expand-all
                  node-key="id"
                  style="height: 560px;overflow: auto;"
                  highlight-current/>
              </fieldset>
            </el-col>
          </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="getTitles()">确 定</el-button>
          <el-button @click="configDialogVisibles = false">取 消</el-button>
        </span>
      </el-dialog>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .app-container{
    position: relative;
    height: calc(100vh - 203px);
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
  .tip-out-inner-dialog>>>.el-checkbox{
    margin-left: 0;
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
    width: 125px;
  }
  .deleteBtn{
    margin-right: 8px;
    font-size: 30px;
    color: #d56c28;
    cursor: pointer;
    float: right;
  }
</style>
