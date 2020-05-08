<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0">
      <div class="search-box">
        <div class="left-search-box" style="margin-left: -35px;">
          <div class="input-item">
            <span class="input-title">日期 </span>
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
            <span style="display:inline-block;width: 20px;text-align: center"> 至 </span>
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
            <span class="input-title" style="width:35px">型号 </span>
            <el-select v-model="modelType" class="search-input" style="width:80px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in modelOptions"
                :key="item.id"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width:35px">光色 </span>
            <el-select v-model="color" class="search-input" style="width:80px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in colorOptions"
                :key="item.id"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">启动状态 </span>
            <el-select v-model="status" class="search-input" style="width:80px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in statusOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-edit"
              @click="handleSearch" >查询</el-button>
            <el-button
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
            @click="handleAdd"><svg-icon icon-class="add"/> 新增判定标准</el-button>
        </div>
      </div>
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        height="calc(100vh - 284px)"
        class="run-table"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
          </template>
        </el-table-column>
        <el-table-column label="标准名称" align="center" prop="name"/>
        <el-table-column label="修改人" align="center" prop="creatorName"/>
        <el-table-column label="修改时间" align="center" prop="createTime"/>
        <el-table-column label="启用状态" align="center" prop="status">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isChecked" @change="setStatus(scope.row)">启用</el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="name">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleHistory(scope.row)"><svg-icon icon-class="lishibb"/> 历史版本</el-button>
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row, 'out')">删除</el-button>
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
      :visible.sync="editDialogVisible"
      title="修改"
      width="1200px"
      class="edit-dialog">
      <div v-if="rowInfo !== null">
        <div class="tableTitle">
          <div class="setTitle">型号等级</div>
        </div>
        <div class="set-border" style="height: 60px;">
          <div class="input-item" style="margin-top: -5px;">
            <span class="input-title">型号 </span>
            <el-input v-model="rowInfo.model" :disabled="true" class="search-input" size="small"/>
          </div>
          <div class="input-item" style="margin-top: -5px;">
            <span class="input-title">光色 </span>
            <el-input v-model="rowInfo.color" :disabled="true" class="search-input" size="small"/>
          </div>
          <div class="input-item" style="margin-top: -5px;">
            <span class="input-title">标准名称 </span>
            <el-input v-model="rowInfo.name" :disabled="true" class="search-input" size="small"/>
          </div>
        </div>
      </div>
      <div style="padding: 5px;margin-top: -15px;">
        <div>
          <div style="width:50%;float:left;font-size: 15px;font-weight: bold;border-left: 3px solid #009494;padding-left: 6px;margin-top: 15px;">
            判定规则
          </div>
          <div style="width:50%;text-align:right;float:left">
            <el-button type="primary" style="margin-top: 15px;margin-bottom: 5px;" size="mini" @click="addConfig1()">配置</el-button>
          </div>
        </div>
        <div style="height: 500px;padding-top: 48px;">
          <pl-table
            v-if="editDialogVisible"
            :datas="showCheckList"
            :cell-style="tableRowClassColor"
            :row-height="35"
            element-loading-text="拼命加载中"
            class="run-table"
            style="height:100%"
            border
            fit
            stripe
            header-drag-style
            use-virtual
            @cell-dblclick="tableDbEdit">
            <pl-table-column fixed label="等级" align="center" prop="grade" width="100px"/>
            <pl-table-column v-for="(key, index) in showCheckList[0].list" :key="index" :label="key" align="center" width="200px">
              <template slot-scope="scope">
                <el-input v-model="scope.row[key]" class="search-input" size="small" style="width:90%" maxlength="50"/>
              </template>
            </pl-table-column>
          </pl-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitEditForm()">确 定</el-button>
        <el-button size="small" @click="editDialogVisible = false">取 消</el-button>
      </span>
      <el-dialog
        v-drag
        :visible.sync="configDialogVisible1"
        width="800px"
        top="80px"
        class="tip-out-inner-dialog"
        title="配置"
        append-to-body
        @close="handleClose1()">
        <div>
          <el-row>
            <el-col :span="11">
              <div class="tableTitle">
                <div v-if="leftTree1.length > 4" class="setTitle">已选中字段 {{ leftTree1[0].children.length + leftTree1[1].children.length + leftTree1[2].children.length + leftTree1[3].children.length + 1 }} </div>
                <div v-if="leftTree1.length < 5" class="setTitle">已选中字段 {{ leftTree1[0].children.length + leftTree1[1].children.length + leftTree1[2].children.length + leftTree1[3].children.length }} </div>
              </div>
              <div class="set-border" style="height: 590px;">
                <el-tree
                  ref="lefttree1"
                  :data="leftTree1"
                  :props="defaultProps"
                  show-checkbox
                  default-expand-all
                  node-key="id"
                  style="height: 560px;overflow: auto;"
                  highlight-current/>
              </div>
            </el-col>
            <el-col :span="2" style="text-align: center;font-size: 36px;color: #009494">
              <div style="margin-top: 260px;cursor: pointer;" @click="toLeft1">
                <svg-icon icon-class="left"/>
              </div>
              <div style="cursor: pointer;" @click="toRight1">
                <svg-icon icon-class="right"/>
              </div>
            </el-col>
            <el-col :span="11">
              <div class="tableTitle">
                <div v-if="rightTree1.length > 4" class="setTitle">待选中字段 {{ rightTree1[0].children.length + rightTree1[1].children.length + rightTree1[2].children.length + rightTree1[3].children.length + 1 }} </div>
                <div v-if="rightTree1.length < 5" class="setTitle">待选中字段 {{ rightTree1[0].children.length + rightTree1[1].children.length + rightTree1[2].children.length + rightTree1[3].children.length }} </div>
              </div>
              <div class="set-border" style="height: 590px;">
                <el-tree
                  ref="righttree1"
                  :data="rightTree1"
                  :props="defaultProps"
                  show-checkbox
                  default-expand-all
                  node-key="id"
                  style="height: 560px;overflow: auto;"
                  highlight-current/>
              </div>
            </el-col>
          </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="getTitles()">确 定</el-button>
          <el-button size="small" @click="configDialogVisible1 = false">取 消</el-button>
        </span>
      </el-dialog>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible"
      title="新增判定标准"
      width="1200px"
      class="edit-dialog">
      <div>
        <div class="tableTitle">
          <div class="setTitle">型号等级</div>
        </div>
        <div class="set-border" style="height: 60px;">
          <div class="input-item" style="margin-top: -5px;">
            <span class="input-title" style="width:100px">选择已有标准 </span>
            <el-select v-model="allready" class="search-input" size="small" placeholder="请选择" filterable clearable @change="setHasBZ">
              <el-option
                v-for="item in checkOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item" style="margin-top: -5px;">
            <span class="input-title">型号 </span>
            <el-select v-model="newmodel" class="search-input" size="small" placeholder="请选择" filterable clearable @change="produceName">
              <el-option
                v-for="item in modelOptions"
                :key="item.id"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item" style="margin-top: -5px;">
            <span class="input-title">光色 </span>
            <el-select v-model="newcolor" class="search-input" size="small" placeholder="请选择" filterable clearable @change="produceName">
              <el-option
                v-for="item in colorOptions"
                :key="item.id"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item" style="margin-top: -5px;">
            <span class="input-title">标准名称 </span>
            <el-input v-model="newname" :disabled="true" class="search-input" size="small"/>
          </div>
        </div>
      </div>
      <div style="padding:0 5px">
        <div>
          <div style="width:50%;float:left;font-size: 15px;font-weight: bold;border-left: 3px solid #009494;padding-left: 6px;margin-top: 15px;">
            判定规则
          </div>
          <div style="width:50%;text-align:right;float:left">
            <el-button type="primary" style="margin-top: 15px;margin-bottom: 5px;" size="mini" @click="addConfig()">配置</el-button>
          </div>
        </div>
        <div style="height: 500px;padding-top: 48px;">
          <pl-table
            :datas="showCheckList"
            :cell-style="tableRowClassColor"
            :row-height="35"
            element-loading-text="拼命加载中"
            class="run-table"
            style="height:100%"
            border
            fit
            stripe
            header-drag-style
            use-virtual
            @cell-dblclick="tableDbEdit">
            <pl-table-column fixed label="等级" align="center" prop="grade" width="100px"/>
            <pl-table-column v-for="(value, key) in showCheckList[0].key" :key="key" :label="key" align="center" width="200px">
              <template slot-scope="scope">
                <el-input v-model="scope.row[key]" class="search-input" size="small" style="width:90%" maxlength="50"/>
              </template>
            </pl-table-column>
          </pl-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitAddForm()">确 定</el-button>
        <el-button size="small" @click="addDialogVisible = false">取 消</el-button>
      </span>
      <el-dialog
        v-drag
        :visible.sync="configDialogVisible"
        width="800px"
        top="80px"
        class="tip-out-inner-dialog"
        title="配置"
        append-to-body
        @close="handleClose()">
        <div>
          <el-row>
            <el-col :span="11">
              <div class="tableTitle">
                <div v-if="leftTree.length > 4" class="setTitle">已选中字段 {{ leftTree[0].children.length + leftTree[1].children.length + leftTree[2].children.length + leftTree[3].children.length + 1 }} </div>
                <div v-if="leftTree.length < 5" class="setTitle">已选中字段 {{ leftTree[0].children.length + leftTree[1].children.length + leftTree[2].children.length + leftTree[3].children.length }} </div>
              </div>
              <div class="set-border" style="height: 590px;">
                <el-tree
                  ref="lefttree"
                  :data="leftTree"
                  :props="defaultProps"
                  show-checkbox
                  default-expand-all
                  node-key="id"
                  style="height: 560px;overflow: auto;"
                  highlight-current/>
              </div>
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
              <div class="tableTitle">
                <div v-if="rightTree.length > 4" class="setTitle">待选中字段 {{ rightTree[0].children.length + rightTree[1].children.length + rightTree[2].children.length + rightTree[3].children.length + 1 }} </div>
                <div v-if="rightTree.length < 5" class="setTitle">待选中字段 {{ rightTree[0].children.length + rightTree[1].children.length + rightTree[2].children.length + rightTree[3].children.length }} </div>
              </div>
              <div class="set-border" style="height: 590px;">
                <el-tree
                  ref="righttree"
                  :data="rightTree"
                  :props="defaultProps"
                  show-checkbox
                  default-expand-all
                  node-key="id"
                  style="height: 560px;overflow: auto;"
                  highlight-current/>
              </div>
            </el-col>
          </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="getTitle()">确 定</el-button>
          <el-button size="small" @click="configDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="historyDialogVisible"
      title="历史版本"
      width="1200px"
      class="edit-dialog his-log"
      @close="resetForm()">
      <div>
        <div class="tableTitle">
          <div class="setTitle">历史版本</div>
          <!-- <el-button type="primary" style="float: right;margin-right: 15px;margin-bottom: 10px;" size="small" @click="hisVisible = true"><svg-icon icon-class="export"/> 导 出</el-button> -->
        </div>
        <div class="set-border" style="height: 233px;">
          <el-table
            ref="historys"
            :data="historyList"
            :row-height="35"
            element-loading-text="拼命加载中"
            class="run-table ste tip-out-inner-dialog"
            height="200px"
            border
            fit
            highlight-current-row
            @current-change="handleCurrentChange">
            <el-table-column align="center" label="序号" width="50">
              <template slot-scope="scope">
                {{ scope.$index+1 }}
              </template>
            </el-table-column>
            <el-table-column label="标准名称" align="center" prop="name"/>
            <el-table-column label="修改人" align="center" prop="creatorName"/>
            <el-table-column label="修改时间" align="center" prop="createTime"/>
            <el-table-column label="启用状态" align="center" prop="status" width="100px">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.isChecked" @change="isQiYong(scope.row)">启用</el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="160px">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="exportAll(scope.row)">导出</el-button>
                <el-button :disabled="scope.row.isChecked" type="danger" size="mini" icon="el-icon-edit" @click="handleDelete(scope.row, 'in')">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div>
        <div class="tableTitle">
          <div class="setTitle">判定规则</div>
        </div>
        <div class="set-border" style="height: 465px;padding-top: 18px;">
          <pl-table
            :datas="showCheckList"
            :cell-style="tableRowClassColor"
            :row-height="35"
            class="run-table"
            element-loading-text="拼命加载中"
            style="height:100%"
            border
            fit
            stripe
            header-drag-style
            use-virtual>
            <pl-table-column fixed label="等级" align="center" prop="grade" width="100px"/>
            <pl-table-column v-for="(key, index) in showCheckList[0].list" :key="index" :label="key" align="center" width="200px" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row[key] }}
              </template>
            </pl-table-column>
          </pl-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="resetForm()">关 闭</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .parameter-table>>>.el-table .set_yellow td{
    background-color: #fff;
  }
  .tableTitle{
    width: 100%;
    font-weight: bold;
    font-size: 15px;
    padding-left: 18px;
    margin-bottom: -15px;
    z-index: 99;
    position: relative;
  }
  .setTitle{
    background: #fff;
    width: 70px;
    text-align: center;
  }
  .set-border{
    border: 1px solid #DCDFE6;
    padding-top: 20px;
    padding-bottom: 0px;
    margin: 5px;
    height: 495px;
    padding: 20px 10px 10px 10px;
  }
  .edit-dialog>>>.el-dialog__body{
    padding-top: 10px;
  }
  .tip-out-inner-dialog>>>.el-checkbox{
    margin-left: 0;
  }
  .historyss>>>.el-checkbox{
    margin-left: 20px;
  }
  .search-box{
    display: flex;
    flex-direction: row;
  }
  .left-search-box{
    flex-grow: 1;
  }
  .right-btn-box{
    width: 144px;
  }
  .input-item{
    float: left;
    margin-top: 15px;
    margin-right: 10px;
  }
  .search-input{
    width: 135px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 207px);
  }
  .table-top-btn-group{
    overflow: hidden;
  }
  .table-top-btn-group>div{
    float: left;
    margin-left: 15px;
    height: 35px;
    line-height: 35px;
    padding: 0 15px;
    border: 1px solid #e2e2e2;
    cursor: pointer;
  }
  .substrate>div:not(:first-child){
    margin-left: 5px;
  }
  .table-top-btn-group>div.active{
    color: #fff;
    background: #009494;
    border-color: #009494;
  }
  .run-table ::-webkit-scrollbar {/*滚动条整体样式*/
    height: 10px !important;
  }
  .his-log>>> .el-dialog {
    margin-top: 4vh!important;
  }
  .edit-dialog>>>.el-dialog__body .el-table__fixed{
    height: 422px !important;
  }
  .edit-dialog>>>.el-table__fixed-body-wrapper {
    height: 385px !important;
  }
</style>
