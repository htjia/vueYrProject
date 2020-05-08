<template>
  <PageHeaderLayout>
    <div class="header-search-add height-auto">
      <div class="header-btn-group">
        <el-button
          size="small"
          type="primary"
          @click="handleAdd(0)"
        ><svg-icon icon-class="add"/> 新增</el-button>
        <el-button
          size="small"
          type="primary"
          @click="handleAdd(1)"
        ><svg-icon icon-class="canzhaoxz"/> 参照新增</el-button>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-edit"
          @click="handleEdit"
        > 修改</el-button>
      </div>
      <el-row>
        <el-col :span="24">
          <div class="left-search-box">
            <div class="input-item">
              <span class="input-title" style="width:35px">光色</span>
              <el-select v-model="color" class="search-input" placeholder="请选择" size="small" filterable clearable>
                <el-option
                  v-for="item in colorList"
                  :key="item.id"
                  :label="item.code"
                  :value="item.code"/>
              </el-select>
            </div>
            <div class="input-item">
              <span class="input-title" style="width:35px">型号</span>
              <el-select v-model="model" class="search-input" placeholder="请选择" size="small" filterable clearable>
                <el-option
                  v-for="item in modelList"
                  :key="item.id"
                  :label="item.code"
                  :value="item.code"/>
              </el-select>
            </div>
            <div class="input-item">
              <span class="input-title">客户编码</span>
              <el-select v-model="rule" class="search-input" placeholder="请选择" size="small" filterable clearable>
                <el-option
                  v-for="item in ruleList"
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
                @click="handleSearch"
              >查询</el-button>
            </div>
            <div class="input-item">
              <el-button
                size="small"
                type="danger"
                @click="clearAll"
              >
                <svg-icon icon-class="clear"/> 重 置
              </el-button>
            </div>
            <div class="input-item" style="padding-top: 6px;">
              <el-checkbox v-model="isDisable" @change="handleAbnormal">显示禁用规则</el-checkbox>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="app-container">
      <el-row>
        <el-col :span="12">
          <el-table
            v-loading="listLoading"
            :data="list"
            element-loading-text="拼命加载中"
            class="isHover"
            height="calc(100vh - 343px)"
            border
            fit
            highlight-current-row
            @current-change="handleCurrentChange"
          >
            <el-table-column align="center" label="序号">
              <template slot-scope="scope">{{ scope.$index + 1 + ((pageNum-1)*pageSize) }}</template>
            </el-table-column>
            <el-table-column label="名称" align="center" prop="name" show-overflow-tooltip/>
            <el-table-column label="版本" align="center" prop="version" show-overflow-tooltip/>
            <el-table-column label="修改人" align="center" prop="creatorName" show-overflow-tooltip/>
            <el-table-column label="修改时间" align="center" prop="createTime" show-overflow-tooltip/>
            <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip/>
            <el-table-column label="库存片数" align="center" prop="count" show-overflow-tooltip/>
            <el-table-column label="启用状态" align="center" prop="status">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.isChecked" @change="setStatus(scope.row)"/>
              </template>
            </el-table-column>
            <el-table-column label="历史版本" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  icon="el-icon-search"
                  type="primary"
                  @click="handleHistory(scope.row)"
                >查看</el-button>
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
        </el-col>
        <el-col :span="12" style="padding-left:15px">
          <el-table
            v-loading="listLoading"
            :data="anotherList"
            element-loading-text="拼命加载中"
            height="calc(100vh - 296px)"
            border
            fit
            stripe
          >
            <el-table-column align="center" label="字段" prop="fieldName" width="150px"/>
            <el-table-column label="条件" align="center" prop="content" show-overflow-tooltip/>
          </el-table>
        </el-col>
      </el-row>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible"
      title="新增规则"
      width="1200px">
      <el-row style="margin-top: -30px;">
        <el-col :span="24">
          <div class="input-item">
            <span class="input-title" style="width:35px">名称 </span>
            <el-input v-model="filedRule.name" class="search-input style-input" style="width:130px" placeholder="请输入名称" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title" style="width:35px">光色 </span>
            <el-select v-model="filedRule.color" class="search-input style-input" style="width:130px" placeholder="请选择" size="small" filterable>
              <el-option
                v-for="item in colorList"
                :key="item.id"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width:35px">型号 </span>
            <el-select v-model="filedRule.model" class="search-input style-input" style="width:130px" placeholder="请选择" size="small" filterable>
              <el-option
                v-for="item in modelList"
                :key="item.id"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">客户编码 </span>
            <el-select v-model="filedRule.rule" class="search-input style-input" style="width:130px" placeholder="请选择" size="small" filterable>
              <el-option
                v-for="item in ruleList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width:50px">版本号 </span>
            <el-input :disabled="true" v-model="filedRule.version" class="search-input style-input" style="width:130px" placeholder="请输入名称" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <el-button type="primary" size="small" @click="addItem()">新增字段</el-button>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="input-item" style="margin-right: 0">
            <span class="input-title" style="width:35px">备注 </span>
            <el-input v-model="filedRule.remark" class="search-input style-input" style="width: 1120px;" placeholder="请输入备注" size="small" maxlength="50" clearable/>
          </div>
        </el-col>
      </el-row>
      <el-table
        ref="newlists"
        :data="newList"
        element-loading-text="拼命加载中"
        class="run-table ste tip-out-inner-dialog"
        style="margin-top:15px"
        height="400px"
        border
        fit>
        <el-table-column align="center" label="字段" width="150px">
          <template slot-scope="scope">
            <el-select v-model="scope.row.field" style="width: 90%;" placeholder="请选择" size="small" filterable @change="fieldChange()">
              <el-option
                v-for="item in newFieldList"
                :key="item.id"
                :label="item.name"
                :value="item.key"
                :disabled="item.disabled"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="条件" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.condition" class="search-input" style="width:90%" placeholder="请输入条件" size="small" maxlength="1000" clearable/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="deleteField(scope.$index)"
            >
              <svg-icon icon-class="clear"/> 删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitForm()">保 存</el-button>
        <el-button size="small" @click="addDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="修改规则"
      width="1200px">
      <el-row style="margin-top: -30px;">
        <el-col :span="24">
          <div class="input-item">
            <span class="input-title" style="width:35px">名称 </span>
            <el-input :disabled="true" v-model="filedRule.name" class="search-input style-input" style="width:130px" placeholder="请输入名称" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title" style="width:35px">光色 </span>
            <el-select :disabled="true" v-model="filedRule.color" class="search-input style-input" style="width:130px" placeholder="请选择" size="small">
              <el-option
                v-for="item in colorList"
                :key="item.id"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width:35px">型号 </span>
            <el-select :disabled="true" v-model="filedRule.model" class="search-input style-input" style="width:130px" placeholder="请选择" size="small">
              <el-option
                v-for="item in modelList"
                :key="item.id"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">客户编码 </span>
            <el-select :disabled="true" v-model="filedRule.rule" class="search-input style-input" style="width:130px" placeholder="请选择" size="small">
              <el-option
                v-for="item in ruleList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width:50px">版本号 </span>
            <el-input :disabled="true" v-model="filedRule.version" class="search-input style-input" style="width:130px" placeholder="请输入名称" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <el-button type="primary" size="small" @click="addItem()">新增字段</el-button>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="input-item">
            <span class="input-title" style="width:35px">备注 </span>
            <el-input v-model="filedRule.remark" class="search-input style-input" style="width: 956px;" placeholder="请输入备注" size="small" maxlength="50" clearable/>
          </div>
        </el-col>
      </el-row>
      <el-table
        :data="newList"
        element-loading-text="拼命加载中"
        class="run-table ste tip-out-inner-dialog"
        style="margin-top:15px"
        height="400px"
        border
        fit>
        <el-table-column align="center" label="字段" width="150px">
          <template slot-scope="scope">
            <el-select v-model="scope.row.field" style="width: 90%;" placeholder="请选择" size="small" filterable @change="fieldChange()">
              <el-option
                v-for="item in newFieldList"
                :key="item.id"
                :label="item.name"
                :value="item.key"
                :disabled="item.disabled"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="条件" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.condition" class="search-input" style="width:90%" placeholder="请输入条件" size="small" maxlength="1000" clearable/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="deleteField(scope.$index)"
            >
              <svg-icon icon-class="clear"/> 删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button size="small" type="primary" @click="submitEditForm()">保 存</el-button>
        <el-button size="small" @click="editDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="historyDialogVisible"
      class="confing-dialog"
      title="历史版本"
      width="1200px">
      <el-row>
        <el-col :span="24" style="margin-top: -10px;">
          <div class="input-item">
            <span class="input-title" style="width:35px">名称 </span>
            <el-input :disabled="true" v-model="filedRule.name" class="search-input style-input" style="width:130px" placeholder="请输入名称" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title" style="width:35px">光色 </span>
            <el-select :disabled="true" v-model="filedRule.color" class="search-input style-input" style="width:130px" placeholder="请选择" size="small">
              <el-option
                v-for="item in colorList"
                :key="item.id"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width:35px">型号 </span>
            <el-select :disabled="true" v-model="filedRule.model" class="search-input style-input" style="width:130px" placeholder="请选择" size="small">
              <el-option
                v-for="item in modelList"
                :key="item.id"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">客户编码 </span>
            <el-select :disabled="true" v-model="filedRule.rule" class="search-input style-input" style="width:130px" placeholder="请选择" size="small">
              <el-option
                v-for="item in ruleList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width:50px">版本号 </span>
            <el-input :disabled="true" v-model="filedRule.version" class="search-input style-input" style="width:130px" placeholder="请输入名称" size="small" maxlength="20" clearable/>
          </div>
        </el-col>
      </el-row>
      <div class="module-title-text" style="margin-bottom: 10px;margin-top: 15px">版本信息</div>
      <el-table
        ref="histroyTable"
        :data="historyList"
        element-loading-text="拼命加载中"
        class="run-table ste tip-out-inner-dialog isHover"
        height="250px"
        border
        fit
        highlight-current-row
        @current-change="handleCurrentChanges">
        <el-table-column align="center" label="版本号" prop="version" width="150px"/>
        <el-table-column align="center" label="名称" prop="name" width="150px"/>
        <el-table-column align="center" label="修改人" prop="creatorName" width="150px"/>
        <el-table-column align="center" label="修改时间" prop="createTime" width="150px"/>
        <el-table-column align="center" label="备注" prop="remark" width="150px"/>
        <el-table-column label="启用状态" align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isChecked" @change="setStatusHistory(scope.row)"/>
          </template>
        </el-table-column>
      </el-table>
      <div class="module-title-text" style="margin-bottom: 10px;margin-top: 15px">参数信息</div>
      <el-table
        :data="historyContentList"
        element-loading-text="拼命加载中"
        class="run-table ste tip-out-inner-dialog"
        height="350px"
        border
        fit>
        <el-table-column align="center" label="字段" prop="fieldName" width="150px"/>
        <el-table-column label="条件" align="center" prop="content" show-overflow-tooltip/>
      </el-table>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
.fieldest{
  border: 1px solid #DCDFE6;
  padding-bottom: 15px;
}
.legendsty{
  padding-left:8px;
  padding-right:8px;
  font-weight: bold;
}
.app-container {
  position: relative;
  background: #e5e5e5;
  padding: 0;
  height: calc(100vh - 265px);
}
.app-container>>> .el-col{
  padding: 15px;
  background: #fff
}
.tab-control span {
  line-height: 50px;
}
.el-checkbox {
  margin-left: 0px;
}
.search-box {
  display: flex;
  flex-direction: row;
}
.left-search-box {
  flex-grow: 1;
}
.right-btn-box {
  width: 260px;
}
.input-item {
  float: left;
  margin-top: 15px;
  margin-right: 10px;
}
.search-input {
  width: 160px;
}
.addBtn{
  transform: translateX(-50%);
  font-size: 30px;
  color: #009494;
  cursor: pointer;
  float: right;
  margin-right: 0px;
  margin-top: 5px;
}
/* .isHover>>>.el-table__body-wrapper tr{
  cursor: pointer;
} */
.confing-dialog>>> .el-dialog__body {
  padding-bottom: 12px;
}
</style>
