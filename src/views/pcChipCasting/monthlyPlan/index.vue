<template>
  <PageHeaderLayout>
    <div class="header-search-add height-auto">
      <div class="header-btn-group" style="height: 35px;border:0px">
        <el-button
          size="small"
          type="primary"
          @click="addMonthPlan"
        >
          <svg-icon icon-class="add"/>
          新增月度计划
        </el-button>
        <el-button
          :disabled="list.length === 0"
          size="small"
          style="margin-left: 15px;"
          type="primary"
          icon="el-icon-edit"
          @click="changeMonthPlan"
        >
          修改月度计划
        </el-button>
        <div style="float:right">
          <span class="input-title" style="width:35px">月份 </span>
          <el-date-picker
            v-model="month"
            :editable="false"
            class="search-input"
            size="small"
            type="month"
            placeholder="选择月份"
            value-format="yyyy-MM"
            @change="monthChange"
          />
        </div>
      </div>
    </div>
    <div class="setkuai">
      <div class="module-title-text">生产进度</div>
      <div class="setvalue edit-dialog">
        <el-row>
          <el-col :span="12">
            <div class="production">
              <p/><span style="margin-right: 30px;">已生产</span>
              <p/><span>剩余生产</span>
            </div>
          </el-col>
          <el-col :span="10">
            <el-radio-group v-model="showType" style="margin-top: 2px" @change="changeType">
              <el-radio :label="0">按片查看</el-radio>
              <el-radio :label="1">按颗查看</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="1" class="setbet">
            外延
          </el-col>
          <el-col :span="23">
            <div class="set-content">
              <div style="left: 45%; color: #494949;" class="set-content-item" >
                {{ wyNoRate + '% ' + '(' + wyRealNo + '/' + wyPlanNo + '片)' }}
              </div>
            </div>
            <el-progress :show-text="false" :stroke-width="20" :percentage="wyNoRate" color="#1ABC9C"/>
          </el-col>
          <el-col :span="4"/>
        </el-row>
        <el-row class="mt15">
          <el-col :span="1" class="setbet1">
            芯片
          </el-col>
          <el-col :span="23">
            <div class="set-content">
              <div v-if="xpShow" style="left: 45%; color: #494949;" class="set-content-item">
                {{ xpNoRate + '% ' + '(' + xpRealNo + '/' + xpPlanNo + '片)' }}
              </div>
              <div v-if="!xpShow" style="left: 45%; color: #494949;" class="set-content-item">
                {{ xpkRate + '% ' + '(' + xpRealK + '/' + xpPlanK + 'K)' }}
              </div>
            </div>
            <el-progress v-if="xpShow" :show-text="false" :stroke-width="20" :percentage="xpNoRate" color="#1ABC9C"/>
            <el-progress v-if="!xpShow" :show-text="false" :stroke-width="20" :percentage="xpkRate" color="#1ABC9C"/>
          </el-col>

        </el-row>
      </div>
    </div>
    <div class="app-container mt10">
      <div class="module-title-text">月度产能规划表</div>
      <div style="margin: 0 15px">
        <div class="table-top-btn-group mt10">
          <div
            :class="{'active':isActive === 0}"
            style="border-bottom: none;"
            @click="navClick(0)"
          >
            外延车间
          </div>
          <div
            :class="{'active':isActive === 1}"
            style="border-bottom: none;"
            @click="navClick(1)"
          >
            芯片车间
          </div>
          <el-button
            size="mini"
            type="primary"
            style="float: right"
            @click="changeLog">
            <svg-icon icon-class="lishibb"/>
            变更日志
          </el-button>
        </div>
        <div style="border-bottom: 2px solid #009494"/>
        <!--外延列表-->
        <el-table
          v-loading="listLoading"
          v-show="isActive === 0"
          ref="listTabel"
          :data="list"
          :row-style="cancelRowStyle"
          class="plan-table run-table"
          element-loading-text="拼命加载中"
          height="calc(100vh - 510px)"
          highlight-current-row
          border
          fit >
          <el-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
            </template>
          </el-table-column>
          <el-table-column label="产品" align="center" prop="produce"/>
          <el-table-column label="实际入库(片)" align="center" prop="realNum" width="250"/>
          <el-table-column label="计划入库(片)" align="center" prop="planNo" width="250">
            <template slot-scope="scope">
              <div v-if="scope.row.wyPlanChange.length > 0">{{ scope.row.planNo }}</div>
              <el-tooltip v-if="scope.row.wyPlanChange.length > 0" placement="top-start">
                <div slot="content">
                  <p>变动记录</p>
                  <p v-for="item in scope.row.wyPlanChange" :key="item.createTime">
                    <span v-if="item.changeNum > 0">{{ item.createTime + ' (+' + item.changeNum + ') ' + item.newNo + '片' + ' ' +item.creatorName }}</span>
                    <span v-if="item.changeNum < 0">{{ item.createTime + ' (' + item.changeNum + ') ' + item.newNo + '片' + ' ' +item.creatorName }}</span>
                  </p>
                </div>
                <i class="change-tip-icon">!</i>
              </el-tooltip>
              <div v-if="scope.row.wyPlanChange.length === 0">{{ scope.row.planNo }}</div>
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip width="500"/>
          <el-table-column label="计划状态" align="center" prop="status">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 0" style="color: #009494;font-weight: bold">正常投产</span>
              <span v-if="scope.row.status === 1" style="color: #f33;font-weight: bold">取消投产</span>
            </template>
          </el-table-column>
        </el-table>
        <!--芯片列表-->
        <el-table
          v-loading="listLoading"
          v-show="isActive === 1"
          :data="anotherlist"
          :row-style="cancelRowStyle"
          class="plan-table run-table broad-scrollbar-table"
          height="calc(100vh - 510px)"
          element-loading-text="拼命加载中"
          border
          fit >
          <el-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              {{ scope.$index+1 }}
            </template>
          </el-table-column>
          <el-table-column label="类型" align="center" prop="pattern" width="50">
            <template slot-scope="scope">
              <div v-if="scope.row.pattern === 0">圆片</div>
              <div v-if="scope.row.pattern === 1">方片</div>
            </template>
          </el-table-column>
          <el-table-column label="类别" align="center" prop="category" width="60"/>
          <el-table-column label="型号" align="center" prop="produce" width="100"/>
          <el-table-column label="尺寸" align="center" prop="measure" width="70"/>
          <el-table-column label="衬底" align="center" prop="substrate" width="70"/>
          <el-table-column label="工艺" align="center" prop="craftName" width="50"/>
          <el-table-column label="实际投片(片)" align="center" prop="throwNum" width="100"/>
          <el-table-column label="计划投片(片)" align="center" prop="planTpno">
            <template slot-scope="scope">
              <div v-if="scope.row.ctpno.length > 0">{{ scope.row.planTpno }}</div>
              <el-tooltip v-if="scope.row.ctpno.length > 0" placement="top-start">
                <div slot="content">
                  <p>变动记录</p>
                  <p v-for="item in scope.row.ctpno" :key="item.create_time">
                    <span v-if="item.ctpno > 0">{{ item.create_time + ' (+' + item.ctpno + ') ' + item.new_tpno + '片' + ' ' +item.creatorName }}</span>
                    <span v-if="item.ctpno < 0">{{ item.create_time + ' (' + item.ctpno + ') ' + item.new_tpno + '片' + ' ' +item.creatorName }}</span>
                  </p>
                </div>
                <i class="change-tip-icon">!</i>
              </el-tooltip>
              <div v-if="scope.row.ctpno.length === 0">{{ scope.row.planTpno }}</div>
            </template>
          </el-table-column>
          <el-table-column label="实际入库(片)" align="center" prop="warehousNo"/>
          <el-table-column label="计划入库(片)" align="center" prop="planRkno">
            <template slot-scope="scope">
              <div v-if="scope.row.crkno.length > 0">{{ scope.row.planRkno }}</div>
              <el-tooltip v-if="scope.row.crkno.length > 0" placement="top-start">
                <div slot="content">
                  <p>变动记录</p>
                  <p v-for="item in scope.row.crkno" :key="item.create_time">
                    <span v-if="item.crkno > 0">{{ item.create_time + ' (+' + item.crkno + ') ' + item.new_rkno + '片' + ' ' +item.creatorName }}</span>
                    <span v-if="item.crkno < 0">{{ item.create_time + ' (' + item.crkno + ') ' + item.new_rkno + '片' + ' ' +item.creatorName }}</span>
                  </p>
                </div>
                <i class="change-tip-icon">!</i>
              </el-tooltip>
              <div v-if="scope.row.crkno.length === 0">{{ scope.row.planRkno }}</div>
            </template>
          </el-table-column>
          <el-table-column label="实际入库(K)" align="center" prop="warehousNoK" width="200"/>
          <el-table-column label="计划入库(K)" align="center" prop="planRkk" width="200">
            <template slot-scope="scope">
              <div v-if="scope.row.crkk.length > 0">{{ scope.row.planRkk }}</div>
              <el-tooltip v-if="scope.row.crkk.length > 0" placement="top-start">
                <div slot="content">
                  <p>变动记录</p>
                  <p v-for="item in scope.row.crkk" :key="item.create_time">
                    <span v-if="item.crkk > 0">{{ item.create_time + ' (+' + item.crkk + ') ' + item.new_rkk + 'K' + ' ' +item.creatorName }}</span>
                    <span v-if="item.crkk < 0">{{ item.create_time + ' (' + item.crkk + ') ' + item.new_rkk + 'K' + ' ' +item.creatorName }}</span>
                  </p>
                </div>
                <i class="change-tip-icon">i</i>
              </el-tooltip>
              <div v-if="scope.row.crkk.length === 0">{{ scope.row.planRkk }}</div>
            </template>
          </el-table-column>
          <el-table-column label="分选地" align="center" prop="address"/>
          <el-table-column label="备注" align="center" prop="remark" width="150" show-overflow-tooltip/>
          <el-table-column label="计划状态" align="center" prop="status" width="90">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 0" style="color: #009494;font-weight: bold">正常投产</span>
              <span v-if="scope.row.status === 1" style="color: #f33;font-weight: bold">取消投产</span>
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
        />
      </div>
    </div>
    <!--新增-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible"
      :before-close="handleDialogClose"
      title="新增月度计划"
      width="1200px"
      class="tip-out-inner-dialog"
      @close="addDialogClose">
      <el-row class="dialogBtn">
        <el-col :span="12">
          <div class="input-item">
            <el-button
              size="small"
              type="primary"
              @click="createMonthly"
            >
              <svg-icon icon-class="add"/>
              生成月度计划
            </el-button>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="input-item" style="float:right; margin-right: 0">
            <span class="input-title" style="width:35px">月份 </span>
            <el-date-picker
              v-model="addMonth"
              :editable="false"
              class="search-input"
              size="small"
              type="month"
              placeholder="选择月份"
              value-format="yyyy-MM"
              @change="addMonthChange"
            />
          </div>
        </el-col>
      </el-row>
      <div style="border-bottom: 2px solid #009494;">
        <div class="table-top-btn-group">
          <div
            :class="{'active':isActive2 === 0}"
            @click="navClick2(0)"
          >
            外延车间
          </div>
          <div
            :class="{'active':isActive2 === 1}"
            @click="navClick2(1)"
          >
            芯片车间
          </div>
        </div>
      </div>
      <el-table
        v-loading="listLoading"
        v-show="isActive2 === 0"
        :data="addWyList"
        class="run-table"
        height="450px"
        element-loading-text="拼命加载中"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="120">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="产品" align="center" prop="products" width="235">
          <template slot-scope="scope">
            <el-select v-model="scope.row.products" style="width: 90%" size="small" filterable clearable placeholder="请选择产品">
              <el-option
                v-for="item in productOptions"
                :key="item.id"
                :label="item.productName"
                :value="item.productName"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="计划入库(片)" align="center" prop="planInStorage" width="235">
          <template slot-scope="scope">
            <el-input v-model="scope.row.planInStorage" style="width: 90%" size="small" type="text" maxlength="8" onkeyup="this.value=this.value.replace(/\D/g,'')" clearable placeholder="*输入数量"/>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" width="410">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark" style="width: 90%" size="small" maxlength="50" clearable placeholder="填写备注"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="status">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-delete"
              type="danger"
              @click="delItem(scope.$index)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-loading="listLoading"
        v-show="isActive2 === 1"
        :data="addXpList"
        class="run-table broad-scrollbar-table"
        height="450px"
        element-loading-text="拼命加载中"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="类型" align="center" prop="pattern" width="80">
          <template slot-scope="scope">
            <el-select v-model="scope.row.pattern" style="width:90%" size="mini" filterable clearable placeholder="请选择">
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="类别" align="center" prop="categoryId" width="170">
          <template slot-scope="scope">
            <el-select v-model="scope.row.categoryId" multiple collapse-tags style="width:90%" size="mini" filterable clearable placeholder="请选择类别">
              <el-option
                v-for="item in categoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="型号" align="center" prop="produceId" width="130">
          <template slot-scope="scope">
            <el-select v-model="scope.row.produceId" style="width:90%" size="mini" filterable clearable placeholder="请选择型号" @change="changeProduce(scope.row)">
              <el-option
                v-for="item in modelList"
                :key="item.id"
                :label="item.code"
                :value="item.id"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="MESA尺寸" align="center" prop="measure" width="100">
          <template slot-scope="scope">
            <el-input v-model="scope.row.measure" class="search-input" style="width:90%" placeholder="*填写尺寸" size="mini" maxlength="8" disabled/>
          </template>
        </el-table-column>
        <el-table-column label="衬底" align="center" prop="substrate" width="120">
          <template slot-scope="scope">
            <el-select v-model="scope.row.substrate" style="width:90%" size="mini" filterable clearable placeholder="请选择衬底">
              <el-option
                v-for="item in measureList"
                :key="item.id"
                :label="item.name"
                :value="item.name + '-' + item.craftId + '-' + item.measureId"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="工艺" align="center" prop="craftId" width="60">
          <template slot-scope="scope">
            <el-select v-model="scope.row.craftId" style="width:90%" size="mini" filterable clearable placeholder="请选择工艺">
              <el-option
                v-for="item in gyList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="计划投片(片)" align="center" prop="planTpno" width="120">
          <template slot-scope="scope">
            <el-input v-model="scope.row.planTpno" class="search-input" style="width:90%" onkeyup="this.value=this.value.replace(/\D/g,'')" placeholder="*填写数量" size="mini" type="text" maxlength="8" clearable/>
          </template>
        </el-table-column>
        <el-table-column label="计划入库(片)" align="center" prop="planRkno" width="120">
          <template slot-scope="scope">
            <el-input v-model="scope.row.planRkno" class="search-input" style="width:90%" onkeyup="this.value=this.value.replace(/\D/g,'')" placeholder="*填写数量" size="mini" type="text" maxlength="8" clearable/>
          </template>
        </el-table-column>
        <el-table-column label="计划入库(K)" align="center" prop="planRkk" width="120">
          <template slot-scope="scope">
            <el-input v-model="scope.row.planRkk" class="search-input" style="width:90%" onkeyup="this.value=this.value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d\d).*$/,'$1$2.$3')" placeholder="*填写数量" size="mini" type="text" maxlength="8" clearable/>
          </template>
        </el-table-column>
        <el-table-column label="分选地" align="center" prop="address" width="120">
          <template slot-scope="scope">
            <el-input v-model="scope.row.address" class="search-input" style="width:90%" placeholder="填写分选地" size="mini" maxlength="50" clearable/>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark" class="search-input" style="width:90%" placeholder="填写备注" size="mini" maxlength="50" clearable/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="status" width="100" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-delete"
              type="danger"
              @click="delItem(scope.$index)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="caddbt">
        <i class="addBtn el-icon-circle-plus" @click="addItem"/>
      </div>
    </el-dialog>
    <!--修改-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="changeDialogVisible"
      title="修改月度计划"
      width="1200px"
      class="tip-out-inner-dialog"
      @close="changeDialogClose">
      <el-row class="dialogBtn">
        <el-col :span="12">
          <div class="input-item">
            <el-button
              :disabled="isNotPlan"
              size="small"
              type="primary"
              icon="el-icon-edit"
              @click="editMonthly"
            >
              修改月度计划
            </el-button>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="input-item" style="float:right; margin-right: 0">
            <span class="input-title" style="width:35px">月份 </span>
            <el-date-picker
              v-model="changeMonth"
              :editable="true"
              class="search-input"
              size="small"
              type="month"
              placeholder="选择月份"
              value-format="yyyy-MM"
              @change="dialogMonthChange"
            />
          </div>
        </el-col>
      </el-row>
      <div style="border-bottom: 2px solid #009494;">
        <div class="table-top-btn-group">
          <div
            :class="{'active':isActive3 === 0}"
            @click="navClick3(0)"
          >
            外延车间
          </div>
          <div
            :class="{'active':isActive3 === 1}"
            @click="navClick3(1)"
          >
            芯片车间
          </div>
        </div>
      </div>
      <el-table
        v-loading="listLoading"
        v-show="isActive3 === 0"
        :data="dialogList"
        class="run-table"
        height="450px"
        element-loading-text="拼命加载中"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="120">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="产品" align="center" prop="produce" width="235">
          <template slot-scope="scope">
            <el-select :disabled="scope.row.isDisabled" v-model="scope.row.produce" style="width: 90%" size="small" placeholder="请选择产品" filterable>
              <el-option
                v-for="item in productOptions"
                :key="item.id"
                :label="item.productName"
                :value="item.productName"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="计划入库(片)" align="center" prop="planNo" width="235">
          <template slot-scope="scope">
            <el-input v-model="scope.row.planNo" class="search-input" style="width:90%" placeholder="*填写数量" onkeyup="this.value=this.value.replace(/\D/g,'')" size="mini" type="text" maxlength="8" clearable/>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" width="410">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark" class="search-input" style="width:90%" placeholder="*填写备注" size="mini" maxlength="50" clearable/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="status">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status === 0 && scope.row.isDisabled" type="danger" size="mini" @click="cancelTc(scope.row)">
              取消投产
            </el-button>
            <el-button v-if="scope.row.status === 1 && scope.row.isDisabled" type="primary" size="mini" @click="recoverTc(scope.row)">
              恢复投产
            </el-button>
            <el-button
              v-if="!scope.row.isDisabled"
              size="mini"
              icon="el-icon-delete"
              type="danger"
              @click="delEditItem(scope.$index)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-loading="listLoading"
        v-show="isActive3 === 1"
        :data="dialogAnotherList"
        class="run-table"
        height="450px"
        element-loading-text="拼命加载中"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="类型" align="center" prop="pattern" width="80">
          <template slot-scope="scope">
            <el-select :disabled="scope.row.isDisabled" v-model="scope.row.pattern" style="width:90%" size="mini" placeholder="请选择类型" filterable>
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="类别" align="center" prop="categoryId" width="170">
          <template slot-scope="scope">
            <el-select :disabled="scope.row.isDisabled" v-model="scope.row.categoryId" filterable multiple collapse-tags style="width:90%" size="mini" clearable placeholder="请选择类别">
              <el-option
                v-for="item in categoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="型号" align="center" prop="produceId" width="120">
          <template slot-scope="scope">
            <el-select :disabled="scope.row.isDisabled" v-model="scope.row.produceId" style="width:90%" size="mini" placeholder="请选择型号" filterable @change="changeProduce(scope.row)">
              <el-option
                v-for="item in modelList"
                :key="item.id"
                :label="item.code"
                :value="item.id"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="尺寸" align="center" prop="measure" width="100">
          <template slot-scope="scope">
            <el-input :disabled="scope.row.isDisabled" v-model="scope.row.measure" class="search-input" style="width:90%" placeholder="*填写尺寸" size="mini" maxlength="8"/>
          </template>
        </el-table-column>
        <el-table-column label="衬底" align="center" prop="substrate" width="120">
          <template slot-scope="scope">
            <el-select :disabled="scope.row.isDisabled" v-model="scope.row.substrate" style="width:90%" size="mini" placeholder="请选择衬底" filterable>
              <el-option
                v-for="item in measureList"
                :key="item.id"
                :label="item.name"
                :value="item.name + '-' + item.craftId + '-' + item.measureId"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="工艺" align="center" prop="craftId" width="60">
          <template slot-scope="scope">
            <el-select :disabled="scope.row.isDisabled" v-model="scope.row.craftId" style="width:90%" size="mini" placeholder="请选择工艺" filterable>
              <el-option
                v-for="item in gyList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="计划投片(片)" align="center" prop="planTpno" width="120">
          <template slot-scope="scope">
            <el-input :disabled="scope.row.status === 1" v-model="scope.row.planTpno" class="search-input" style="width:90%" onkeyup="this.value=this.value.replace(/\D/g,'')" placeholder="*填写数量" size="mini" type="text" maxlength="8" clearable/>
          </template>
        </el-table-column>
        <el-table-column label="计划入库(片)" align="center" prop="planRkno" width="120">
          <template slot-scope="scope">
            <el-input :disabled="scope.row.status === 1" v-model="scope.row.planRkno" class="search-input" style="width:90%" onkeyup="this.value=this.value.replace(/\D/g,'')" placeholder="*填写数量" size="mini" type="text" maxlength="8" clearable/>
          </template>
        </el-table-column>
        <el-table-column label="计划入库(K)" align="center" prop="planRkk" width="120">
          <template slot-scope="scope">
            <el-input :disabled="scope.row.status === 1" v-model="scope.row.planRkk" class="search-input" style="width:90%" onkeyup="this.value=this.value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d\d).*$/,'$1$2.$3')" placeholder="*填写数量" size="mini" type="text" maxlength="12" clearable/>
          </template>
        </el-table-column>
        <el-table-column label="分选地" align="center" prop="address" width="120">
          <template slot-scope="scope">
            <el-input :disabled="scope.row.status === 1" v-model="scope.row.address" class="search-input" style="width:90%" placeholder="填写分选地" size="mini" maxlength="50" clearable/>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" width="200">
          <template slot-scope="scope">
            <el-input :disabled="scope.row.status === 1" v-model="scope.row.remark" class="search-input" style="width:90%" placeholder="填写备注" size="mini" maxlength="50" clearable/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="status" width="100" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status === 0 && scope.row.isDisabled" type="danger" size="mini" @click="cancelTc(scope.row)">
              取消投产
            </el-button>
            <el-button v-if="scope.row.status === 1 && scope.row.isDisabled" type="primary" size="mini" @click="recoverTc(scope.row)">
              恢复投产
            </el-button>
            <el-button
              v-if="!scope.row.isDisabled"
              size="mini"
              icon="el-icon-delete"
              type="danger"
              @click="delEditItem(scope.$index)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="!isNotPlan" class="caddbt">
        <i class="addBtn el-icon-circle-plus" @click="addChangeItem"/>
      </div>
    </el-dialog>
    <!--变更日志-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="updateDialogVisible"
      :width="showLogDiv ? '550px' : '800px'"
      title="变更日志">
      <div v-if="changeWyLogList.length === 0 && isActive === 0" style="height: 100px;line-height:65px;text-align: center; font-size: 16px; color: #666;font-weight: bold">
        暂无变更
      </div>
      <div v-if="changeXpLogList.length === 0 && isActive === 1" style="height: 100px;line-height:65px;text-align: center; font-size: 16px; color: #666;font-weight: bold">
        暂无变更
      </div>
      <div v-if="showLogDiv" class="logWyDiv">
        <div v-for="(item, index) in changeWyLogList" :key="index" class="logItem">
          <h3 class="logTittle">
            <span class="titlePoint"/>
            {{ item.createTime + ' 变更' + ' (' + item.creatorName + ')' }}
          </h3>
          <el-collapse v-model="activeLog">
            <el-collapse-item :title="item.produce+ ' -------------------- ' + '计划投片 ' + item.changeNum + '片'" :name="index + 1" :style="{'padding-left':'10px'}">
              <div v-if="item.oldNo !== item.newNo" style="margin-left: 10%">{{ '计划投片 ' + item.oldNo + '片' + ' > > ' + item.newNo + '片' }}
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
      <div v-if="!showLogDiv" class="logXpDiv">
        <div v-for="(item, index) in changeXpLogList" :key="index" class="logItem">
          <h3 class="logTittle">
            <span class="titlePoint"/>
            {{ item.createTime + ' 变更' + ' (' + item.creatorName + ')' }}
          </h3>
          <el-collapse v-model="activeLog">
            <el-collapse-item :title="item.patternName+''+item.category+''+item.produce+''+item.measure+''+item.substrate+''+item.craftName+' -------------- '+'计划投片'+item.tpnoChangeNum+'片'+'计划入库'+item.rknoChangeNum+'片'+item.rkkchangeNum+'K'" :name="index + 1" :style="{'padding-left':'10px'}">
              <div v-if="item.oldTono !== item.newTpno" style="margin-left: 10%">{{ '计划投片 ' + item.oldTono + '片' + ' > >' + item.newTpno + '片' }}
              </div>
              <div v-if="item.oldRkno !== item.newRkno" style="margin-left: 10%">{{ '计划入库 ' + item.oldRkno + '片' + ' > >' + item.newRkno + '片' }}
              </div>
              <div v-if="item.oldRkk !== item.newRkk" style="margin-left: 10%">{{ '计划入库 ' + item.oldRkk + 'K' + ' > > ' + item.newRkk + 'K' }}
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .caddbt {
    position: absolute;
    z-index: 15;
    margin-top: 10px;
    margin-left: 48%;
  }

  .dialogBtn {
    margin-top: -25px;
    margin-bottom: 10px;
    border-bottom: 1px solid #e5e5e5;
    padding-bottom: 10px;
  }

  .addBtn {
    font-size: 30px;
    color: #009494;
    cursor: pointer;
    vertical-align: middle;
  }

  .setbet {
    font-weight: bold;
    text-align: center;
    margin-top: 2px;
  }

  .setbet1 {
    font-weight: bold;
    text-align: center;
    margin-top: 2px;
  }

  .set-content {
    position: relative;
    width: 100%;
    text-align: right;
    font-weight: bold;
    color: #1ABC9C;
  }

  .set-content-item {
    position: absolute;
    bottom: -18px;
    z-index: 10;
  }

  .fieldest {
    border: 1px solid #DCDFE6;
    padding-bottom: 15px;
  }

  .legendsty {
    padding-left: 8px;
    padding-right: 8px;
    font-weight: bold;
  }

  .tip-out-inner-dialog >>> .el-checkbox {
    margin-left: 20px;
  }
  .normalReasom {
    border: 0px;
    color: #009494;
    cursor: pointer;
  }

  .normalReasom:hover {
    color: #009688;
  }

  .firstRow {
    padding-bottom: 15px;
    margin-bottom: 15px;
    border-bottom: 1px solid #DCDFE6;
  }

  .setTree {
    padding: 15px;
    border: 1px solid #DCDFE6;
    margin-top: 15px;
    height: 425px;
    overflow: auto;
  }

  .getCalss {
    padding: 15px;
  }

  .setInner {
    padding: 10px;
    color: #333;
  }

  .buttonType {
    background: #1abb9d;
    color: #fff;
    font-size: 16px;
  }

  .buttonType1 {
    font-size: 15px;
    float: right;
    height: 35px;
    border: 0px;
    padding: 0;
    margin-right: 15px;
    color: #009494;
  }

  .buttonType1:hover {
    color: #009688;
    background-color: #fff;
  }

  .leftType {
    float: left;
    height: 35px;
    margin-left: 15px;
    padding-top: 8px;
    margin-right: 15px;
  }

  .spanColor {
    font-size: 16px;
    font-weight: bold;
    margin-right: 15px;
  }

  .tableTitle {
    width: 100%;
    font-weight: bold;
    font-size: 15px;
    padding-left: 30px;
    margin-bottom: -15px;
    z-index: 99;
    position: relative;
  }

  .input-title {
    width: 65px;
    line-height: 30px;
  }

  .setTitle {
    background: #fff;
    width: 85px;
    text-align: center;
  }

  .set-border {
    border: 1px solid #DCDFE6;
    margin: 5px;
    height: 650px;
    padding: 20px 10px 10px 10px;
  }

  .set-borders {
    border: 1px solid #DCDFE6;
    margin: 5px;
    padding: 20px 10px 10px 10px;
  }

  .input-item {
    float: left;
    margin-top: 14px;
    margin-right: 10px;
  }

  .search-box {
    display: flex;
    flex-direction: row;
  }

  .left-search-box {
    flex-grow: 1;
  }

  .right-btn-box {
    width: 210px;
  }

  .search-input {
    width: 155px;
  }

  .app-container {
    position: relative;
    height: calc(100vh - 360px);
    padding: 0;
  }

  .table-top-btn-group {
    overflow: hidden;
    border-bottom: none !important;
  }

  .table-top-btn-group > div {
    float: left;
    margin-left: 15px;
    height: 35px;
    line-height: 35px;
    padding: 0 15px;
    border: 1px solid #e2e2e2;
    cursor: pointer;
  }

  .table-top-btn-group > div.active {
    color: #fff;
    background: #009494;
    border-color: #009494;
  }

  .checkstr {
    word-wrap: break-word;
    word-break: break-all;
    overflow: auto;
    line-height: 25px;
    height: 350px;
  }

  .parameter-table >>> .el-table .set_green td {
    background-color: #E35C5C;
    color: #fff;
  }

  .statuType {
    text-align: center;
    font-size: 30px;
    padding: 15px;
    color: #009494;
    font-weight: bold;
    border-bottom: 1px solid #E5E5E5;
  }

  .statuType1 {
    text-align: center;
    font-size: 30px;
    padding: 15px;
    color: #E35C5C;
    font-weight: bold;
    border-bottom: 1px solid #E5E5E5;
  }

  .run-table ::-webkit-scrollbar { /*滚动条整体样式*/
    height: 12px !important;
  }

  .app-container >>> .el-table--border {
    border-top: 2px solid #009494;
  }

  .tip-out-inner-dialog >>> .el-dialog__body {
    padding: 15px;
    padding-top: 25px;
    padding-bottom: 50px;
  }
  .setkuai {
    background: #ffffff;
  }

  .setvalue {
    padding: 8px 15px 15px 15px;
  }

  .module-title-text {
    color: #666;
    font-size: 14px;
    font-weight: bold;
    float: none;
    padding: 10px 15px;
    border-bottom: 1px solid #e5e5e5;
  }

  .mt10 {
    margin-top: 10px;
  }

  .mt15 {
    margin-top: 15px;
  }
  .setvalue>>> .el-progress-bar__outer {
    background: #e5e5e5;
  }
  .production {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 10px;
  }

  .production p {
    width: 32px;
    height: 12px;
    background: #E5E5E5;
    border-radius: 2px;
    margin: 0 8px 0 0;
  }
  .production p:first-child {
    background: #1ABC9C;
  }

  .el-radio-group {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .logTittle {
    margin-top: 0;
    margin-bottom: 10px;
  }

  .titlePoint {
    display: inline-block;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #23C6C8;
  }

  .logItem {
    border-left: 4px solid #23C6C8;
    padding-left: 15px;
    padding-bottom: 10px;
  }

  .logItem:last-child {
    border: 0 !important;
  }

  .titlePoint {
    position: absolute;
    left: 15px;
  }

  .change-tip-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    background: red;
    border-radius: 50%;
    color: #fff;
    text-align: center;
    line-height: 16px;
    font-style: normal;
    font-size: 14px;
    font-weight: bold;
    position: absolute;
    right: 10%;
    bottom: 33%;
  }
  .tip-out-inner-dialog>>> .el-table__fixed-right {
    background: #fff!important;
    height: 436px!important;
  }
</style>
