<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0">
      <div class="header-btn-group">
        <span style="line-height:50px">&nbsp;</span>
        <el-button
          size="small"
          class="float-right"
          style="margin-top:13px"
          type="primary"
          @click="handleAdd"
        ><svg-icon icon-class="add"/> 新增机台</el-button>
      </div>
      <el-row>
        <el-col :span="24">
          <div class="input-item">
            <span class="input-title" style="width: 40px">工段</span>
            <el-select v-model="section" class="search-input" style="width: 80px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in workshopList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 40px">车间</span>
            <el-select v-model="factory" class="search-input" style="width: 120px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in factoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 40px">工序</span>
            <el-select v-model="processId" class="search-input" style="width: 170px" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in processListspage"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 65px">机台号</span>
            <el-select v-model="machineInfo" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in machineList"
                :key="item.id"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </div>
          <!-- <div class="input-item">
            <span class="input-title">原材料</span>
            <el-input v-model="searchName" class="search-input" placeholder="请输入衬底厂家" size="small" maxlength="20" clearable/>
          </div> -->
          <div class="input-item">
            <span class="input-title" style="width: 65px">修改人</span>
            <el-select v-model="creator" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in userOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">修改时间</span>
            <el-date-picker
              v-model="beginDate"
              :picker-options="pickerOptionsStart"
              :editable="false"
              style="width: 130px"
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
              style="width: 130px"
              class="search-input"
              size="small"
              type="date"
              placeholder="选择结束日期"
              value-format="timestamp"
            />
          </div>
          <div class="input-item">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-search"
              @click="handleSearch" >查 询</el-button>
            <el-button
              size="small"
              type="danger"
              @click="clearSearch"
            >
              <svg-icon icon-class="clear"/> 重 置
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        height="calc(100vh - 342px)"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
          </template>
        </el-table-column>
        <el-table-column label="机台号" align="center" prop="code"/>
        <el-table-column label="工段" align="center" prop="section">
          <template slot-scope="scope">
            <span v-if="scope.row.section === 0">
              前段
            </span>
            <span v-if="scope.row.section === 1">
              后段
            </span>
          </template>
        </el-table-column>
        <el-table-column label="车间" align="center" prop="workshopName"/>
        <el-table-column label="站点" align="center" prop="siteName"/>
        <el-table-column label="工序" align="center" prop="processName"/>
        <el-table-column label="修改人" align="center" prop="creatorName"/>
        <el-table-column label="修改时间" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.createTime.substring(0, 16) }}
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip/>
        <el-table-column label="操作" align="center" prop="status">
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
      title="新增机台"
      width="500px">
      <el-form ref="machineForm" :model="machineForm" :rules="rules" status-icon label-width="75px" label-position="right">
        <el-form-item label="工段 " prop="work">
          <el-select v-model="machineForm.work" style="width:385px" placeholder="请选择" filterable @change="workChange">
            <el-option
              v-for="item in workshopList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="车间 " prop="factory">
          <el-select v-model="machineForm.factory" style="width:385px" placeholder="请选择" filterable @change="findBySiteName">
            <el-option
              v-for="item in factoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="站点 ">
          <el-select v-model="machineForm.site" style="width:385px" placeholder="请选择" filterable clearable @change="findSiteName">
            <el-option
              v-for="item in siteLists"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="工序 ">
          <el-select v-model="machineForm.process" style="width:385px" placeholder="请选择" multiple filterable clearable>
            <el-option
              v-for="item in processLists"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="机台类型 ">
          <el-select v-model="machineForm.type" style="width:385px" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="机台号 " prop="code">
          <el-input v-model="machineForm.code" placeholder="请输入机台号" maxlength="10"/>
        </el-form-item>
        <div v-if="machineForm.type === 0" style="color: rgb(245, 108, 108);/float: left;position: absolute;margin-top: 15px;margin-left: 25px;">*</div>
        <el-form-item v-if="machineForm.type === 0" label="槽位 ">
          <div style="width:100%;margin:5px 0">
            <el-input v-model="newList[0].one" style="width:320px" placeholder="请输入" maxlength="10" @keyup.native="setADDList(newList[0],'one')"/>
            <!-- <el-input v-model="item.two" style="width:110px" placeholder="请输入" maxlength="50" @keyup.native="setADDList(item,'two')"/>
            <el-input v-model="item.three" style="width:110px" placeholder="请输入" maxlength="50" @keyup.native="setADDList(item,'three')"/> -->
            <i v-if="newList.length<10" class="addBtn el-icon-circle-plus" @click="addItem()"/>
          </div>
          <div id="addnewList" style="width:100%;max-height:140px;overflow:auto">
            <div v-for="item in newList" :key="item.index" style="width:100%;margin:5px 0">
              <el-input v-if="item.index>0" v-model="item.one" style="width:320px" placeholder="请输入" maxlength="10" @keyup.native="setADDList(item,'one')"/>
              <!-- <el-input v-model="item.two" style="width:110px" placeholder="请输入" maxlength="50" @keyup.native="setADDList(item,'two')"/>
              <el-input v-model="item.three" style="width:110px" placeholder="请输入" maxlength="50" @keyup.native="setADDList(item,'three')"/> -->
              <!-- <i v-if="item.index === 0&&newList.length<10" class="addBtn el-icon-circle-plus" @click="addItem()"/> -->
              <i v-if="item.index > 0" class="deleteBtn el-icon-remove" @click="deleteItem(item)"/>
            </div>
          </div>
        </el-form-item>
        <div v-if="machineForm.type === 1" style="color: rgb(245, 108, 108);/float: left;position: absolute;margin-top: 15px;margin-left: 11px;">*</div>
        <el-form-item v-if="machineForm.type === 1" label="胶管号 ">
          <div style="width:100%;margin:5px 0">
            <el-input v-model="jgnewList[0].one" style="width:320px" placeholder="请输入" maxlength="10" @keyup.native="jgsetADDList(jgnewList[0],'one')"/>
            <!-- <el-input v-model="item.two" style="width:110px" placeholder="请输入" maxlength="50" @keyup.native="jgsetADDList(item,'two')"/>
            <el-input v-model="item.three" style="width:110px" placeholder="请输入" maxlength="50" @keyup.native="jgsetADDList(item,'three')"/> -->
            <i v-if="jgnewList.length<10" class="addBtn el-icon-circle-plus" @click="jgaddItem()"/>
          </div>
          <div id="addjgnewList" style="width:100%;max-height:140px;overflow:auto">
            <div v-for="item in jgnewList" :key="item.index" style="width:100%;margin:5px 0">
              <el-input v-if="item.index>0" v-model="item.one" style="width:320px" placeholder="请输入" maxlength="10" @keyup.native="jgsetADDList(item,'one')"/>
              <!-- <el-input v-model="item.two" style="width:110px" placeholder="请输入" maxlength="50" @keyup.native="jgsetADDList(item,'two')"/>
              <el-input v-model="item.three" style="width:110px" placeholder="请输入" maxlength="50" @keyup.native="jgsetADDList(item,'three')"/> -->
              <!-- <i v-if="item.index === 0&&jgnewList.length<10" class="addBtn el-icon-circle-plus" @click="jgaddItem()"/> -->
              <i v-if="item.index > 0" class="deleteBtn el-icon-remove" @click="jgdeleteItem(item)"/>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="机台型号 ">
          <el-input v-model="machineForm.model" placeholder="请输入机台型号" maxlength="10"/>
        </el-form-item>
        <el-form-item label="备注 ">
          <el-input v-model="machineForm.remark" type="textarea" placeholder="请输入备注" maxlength="50"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('machineForm')">确 定</el-button>
        <el-button @click="addDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="修改机台"
      width="500px">
      <el-form ref="machineForm" :model="machineForm" :rules="rules" status-icon label-width="75px" label-position="right">
        <el-form-item label="工段 " prop="work">
          <el-select v-model="machineForm.work" style="width:385px" placeholder="请选择" filterable clearable @change="workChange">
            <el-option
              v-for="item in workshopList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="车间 " prop="factory">
          <el-select v-model="machineForm.factory" style="width:385px" placeholder="请选择" filterable clearable @change="findBySiteName">
            <el-option
              v-for="item in factoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="站点 ">
          <el-select v-model="machineForm.site" style="width:385px" placeholder="请选择" filterable clearable @change="findSiteName">
            <el-option
              v-for="item in siteLists"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="工序 ">
          <el-select v-model="machineForm.process" style="width:385px" placeholder="请选择" multiple filterable clearable>
            <el-option
              v-for="item in processLists"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="机台类型 ">
          <el-select v-model="machineForm.type" style="width:385px" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="机台号 " prop="code">
          <el-input v-model="machineForm.code" placeholder="请输入机台号" maxlength="10"/>
        </el-form-item>
        <div v-if="machineForm.type === 0" style="color: rgb(245, 108, 108);/float: left;position: absolute;margin-top: 15px;margin-left: 25px;">*</div>
        <el-form-item v-if="machineForm.type === 0" label="槽位 ">
          <div style="width:100%;margin:5px 0">
            <el-input v-model="newList[0].one" style="width:320px" placeholder="请输入" maxlength="10" @keyup.native="setADDList(newList[0],'one')"/>
            <!-- <el-input v-model="item.two" style="width:110px" placeholder="请输入" maxlength="50" @keyup.native="setADDList(item,'two')"/>
            <el-input v-model="item.three" style="width:110px" placeholder="请输入" maxlength="50" @keyup.native="setADDList(item,'three')"/> -->
            <i v-if="newList.length<10" class="addBtn el-icon-circle-plus" @click="addItem()"/>
          </div>
          <div id="upnewList" style="width:100%;max-height:140px;overflow:auto">
            <div v-for="item in newList" :key="item.index" style="width:100%;margin:5px 0">
              <el-input v-if="item.index>0" v-model="item.one" style="width:320px" placeholder="请输入" maxlength="10" @keyup.native="setADDList(item,'one')"/>
              <!-- <el-input v-model="item.two" style="width:110px" placeholder="请输入" maxlength="50" @keyup.native="setADDList(item,'two')"/>
              <el-input v-model="item.three" style="width:110px" placeholder="请输入" maxlength="50" @keyup.native="setADDList(item,'three')"/> -->
              <!-- <i v-if="item.index === 0&&newList.length<10" class="addBtn el-icon-circle-plus" @click="addItem()"/> -->
              <i v-if="item.index > 0" class="deleteBtn el-icon-remove" @click="deleteItem(item)"/>
            </div>
          </div>
        </el-form-item>
        <div v-if="machineForm.type === 1" style="color: rgb(245, 108, 108);/float: left;position: absolute;margin-top: 15px;margin-left: 11px;">*</div>
        <el-form-item v-if="machineForm.type === 1" label="胶管号 ">
          <div style="width:100%;margin:5px 0">
            <el-input v-model="jgnewList[0].one" style="width:320px" placeholder="请输入" maxlength="10" @keyup.native="jgsetADDList(jgnewList[0],'one')"/>
            <!-- <el-input v-model="item.two" style="width:110px" placeholder="请输入" maxlength="50" @keyup.native="jgsetADDList(item,'two')"/>
            <el-input v-model="item.three" style="width:110px" placeholder="请输入" maxlength="50" @keyup.native="jgsetADDList(item,'three')"/> -->
            <i v-if="jgnewList.length<10" class="addBtn el-icon-circle-plus" @click="jgaddItem()"/>
          </div>
          <div id="upjgnewList" style="width:100%;max-height:140px;overflow:auto">
            <div v-for="item in jgnewList" :key="item.index" style="width:100%;margin:5px 0">
              <el-input v-if="item.index>0" v-model="item.one" style="width:320px" placeholder="请输入" maxlength="10" @keyup.native="jgsetADDList(item,'one')"/>
              <!-- <el-input v-model="item.two" style="width:110px" placeholder="请输入" maxlength="50" @keyup.native="jgsetADDList(item,'two')"/>
              <el-input v-model="item.three" style="width:110px" placeholder="请输入" maxlength="50" @keyup.native="jgsetADDList(item,'three')"/> -->
              <!-- <i v-if="item.index === 0&&jgnewList.length<10" class="addBtn el-icon-circle-plus" @click="jgaddItem()"/> -->
              <i v-if="item.index > 0" class="deleteBtn el-icon-remove" @click="jgdeleteItem(item)"/>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="机台型号 ">
          <el-input v-model="machineForm.model" placeholder="请输入机台型号" maxlength="10"/>
        </el-form-item>
        <el-form-item label="备注 ">
          <el-input v-model="machineForm.remark" type="textarea" placeholder="请输入备注" maxlength="50"/>
        </el-form-item>
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
  .deleteBtn{
    font-size: 30px;
    color: #d56c28;
    cursor: pointer;
    float: right;
    margin-right: 15px;
    margin-top: 5px;
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
  .app-container{
    position: relative;
    height: calc(100vh - 265px);
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
