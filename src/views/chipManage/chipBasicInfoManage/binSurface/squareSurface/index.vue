<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0">
      <div class="header-btn-group" style="padding-top: 10px;">
        <span style="line-height:35px">&nbsp;</span>
        <!-- <el-button
          size="small"
          style="float:right;margin-left:15px"
          type="primary"
          @click="handleAdds()"
        ><svg-icon icon-class="canzhaoxz"/> 参照新增</el-button> -->
        <el-button
          size="small"
          style="float:right"
          type="primary"
          @click="handleAdd"
        ><svg-icon icon-class="add"/> 新增BIN表</el-button>
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
        height="calc(100vh - 335px)"
        border
        fit
        stripe
        highlight-current-row
        @current-change="handleCurrentChanges">
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
          </template>
        </el-table-column>
        <el-table-column label="名称" align="center" prop="name"/>
        <el-table-column label="版本" align="center" prop="version"/>
        <el-table-column label="修改人" align="center" prop="createName"/>
        <el-table-column label="修改时间" align="center" prop="createTime"/>
        <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip/>
        <el-table-column label="是否启用" align="center" prop="status">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isChecked" @change="setStatus(scope.row)">启用</el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="status">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleHistory(scope.row)"><svg-icon icon-class="lishibb"/> 历史版本</el-button>
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
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
      title="新增BIN表"
      class="edit-dialog"
      width="1200px">
      <fieldset class="fieldest">
        <legend class="legendsty"> 基础信息 </legend>
        <div class="input-item">
          <span class="input-title">型号 </span>
          <el-select v-model="newmodel" class="search-input" size="small" placeholder="请选择" filterable clearable @change="getNewName">
            <el-option
              v-for="item in modelList"
              :key="item.id"
              :label="item.code"
              :value="item.code"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">光色 </span>
          <el-select v-model="newcolor" class="search-input" size="small" placeholder="请选择" filterable clearable @change="getNewName">
            <el-option
              v-for="item in colorList"
              :key="item.id"
              :label="item.code"
              :value="item.code"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">工艺 </span>
          <el-select v-model="newgy" class="search-input" size="small" placeholder="请选择" filterable clearable @change="getNewName">
            <el-option
              v-for="item in gyList"
              :key="item.id"
              :label="item.code"
              :value="item.code"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">标准名称 </span>
          <el-input v-model="newname" :disabled="true" class="search-input" size="small"/>
        </div>
        <div class="input-item">
          <span class="input-title">版本 </span>
          <el-input v-model="newvsersion" :disabled="true" class="search-input" size="small"/>
        </div>
        <div class="input-item" style="width:100%;text-align:left">
          <span class="input-title" style="width: 70px;line-height: 60px;">备注 </span>
          <el-input v-model="remark" type="textarea" class="search-input" style="width:1022px" size="small" maxlength="50"/>
        </div>
      </fieldset>
      <fieldset class="fieldest" style="margin-top: 15px;">
        <legend class="legendsty"> BIN信息 </legend>
        <div style="width:1132px;text-align:left">
          <span class="input-title" style="float: left;width: 85px;line-height: 35px;">导入BIN表 </span>
          <el-upload
            ref="upload"
            :auto-upload="true"
            :on-success="onSuccess"
            :on-error="onError"
            :action="fileUrl"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :with-credentials="true"
            style="float: left; margin-right: 15px"
            accept=".xls,.xlsx"
            class="upload-demo"
          >
            <el-button v-loading="loading" slot="trigger" size="small" type="primary"><svg-icon icon-class="import"/>  导入</el-button>
          </el-upload>
          <el-button
            size="small"
            style="float:left;margin-left:15px"
            type="primary"
            @click="openchenck()"
          ><svg-icon icon-class="canzhaoxz"/> 参照新增</el-button>
        </div>
        <div style="width: 1132px;margin-top: 50px;height:400px">
          <pl-table
            :datas="showCheckList"
            :row-height="35"
            :cell-style="tableRowClassColor"
            style="height:100%"
            class="run-table"
            border
            fit
            header-drag-style
            use-virtual
            element-loading-text="拼命加载中"
            @cell-dblclick="cellDblclick">
            <pl-table-column fixed align="center" label="Bin" width="50">
              <template slot-scope="scope">
                {{ scope.row.level }}
              </template>
            </pl-table-column>
            <pl-table-column label="VFL" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['vf1Min'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['vf1Min'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['vf1Min'].val1 }} ~ {{ checkKeyObj['vf1Min'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['vf1Min'].val1!==null&&checkKeyObj['vf1Min'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['vf1Min'].val3 }} ~ {{ checkKeyObj['vf1Min'].val1 }} {{ checkKeyObj['vf1Min'].val2 }} ~ {{ checkKeyObj['vf1Min'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['vf1Min'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['vf1Min'].val3 }} ~ {{ checkKeyObj['vf1Min'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.vf1Min }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['vf1Min'] === undefined">{{ scope.row.vf1Min }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.vf1Min" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="VFH" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['vf1Max'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['vf1Max'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['vf1Max'].val1 }} ~ {{ checkKeyObj['vf1Max'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['vf1Max'].val1!==null&&checkKeyObj['vf1Max'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['vf1Max'].val3 }} ~ {{ checkKeyObj['vf1Max'].val1 }} {{ checkKeyObj['vf1Max'].val2 }} ~ {{ checkKeyObj['vf1Max'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['vf1Max'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['vf1Max'].val3 }} ~ {{ checkKeyObj['vf1Max'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.vf1Max }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['vf1Max'] === undefined">{{ scope.row.vf1Max }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.vf1Max" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="VF2L" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['vf2Min'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['vf2Min'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['vf2Min'].val1 }} ~ {{ checkKeyObj['vf2Min'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['vf2Min'].val1!==null&&checkKeyObj['vf2Min'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['vf2Min'].val3 }} ~ {{ checkKeyObj['vf2Min'].val1 }} {{ checkKeyObj['vf2Min'].val2 }} ~ {{ checkKeyObj['vf2Min'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['vf2Min'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['vf2Min'].val3 }} ~ {{ checkKeyObj['vf2Min'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.vf2Min }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['vf2Min'] === undefined">{{ scope.row.vf2Min }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.vf2Min" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="VF2H" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['vf2Max'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['vf2Max'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['vf2Max'].val1 }} ~ {{ checkKeyObj['vf2Max'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['vf2Max'].val1!==null&&checkKeyObj['vf2Max'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['vf2Max'].val3 }} ~ {{ checkKeyObj['vf2Max'].val1 }} {{ checkKeyObj['vf2Max'].val2 }} ~ {{ checkKeyObj['vf2Max'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['vf2Max'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['vf2Max'].val3 }} ~ {{ checkKeyObj['vf2Max'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.vf2Max }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['vf2Max'] === undefined">{{ scope.row.vf2Max }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.vf2Max" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="VF3L" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['vf3Min'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['vf3Min'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['vf3Min'].val1 }} ~ {{ checkKeyObj['vf3Min'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['vf3Min'].val1!==null&&checkKeyObj['vf3Min'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['vf3Min'].val3 }} ~ {{ checkKeyObj['vf3Min'].val1 }} {{ checkKeyObj['vf3Min'].val2 }} ~ {{ checkKeyObj['vf3Min'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['vf3Min'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['vf3Min'].val3 }} ~ {{ checkKeyObj['vf3Min'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.vf3Min }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['vf3Min'] === undefined">{{ scope.row.vf3Min }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.vf3Min" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="VF3H" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['vf3Max'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['vf3Max'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['vf3Max'].val1 }} ~ {{ checkKeyObj['vf3Max'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['vf3Max'].val1!==null&&checkKeyObj['vf3Max'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['vf3Max'].val3 }} ~ {{ checkKeyObj['vf3Max'].val1 }} {{ checkKeyObj['vf3Max'].val2 }} ~ {{ checkKeyObj['vf3Max'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['vf3Max'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['vf3Max'].val3 }} ~ {{ checkKeyObj['vf3Max'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.vf3Max }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['vf3Max'] === undefined">{{ scope.row.vf3Max }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.vf3Max" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="VF4L" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['vf4Min'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['vf4Min'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['vf4Min'].val1 }} ~ {{ checkKeyObj['vf4Min'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['vf4Min'].val1!==null&&checkKeyObj['vf4Min'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['vf4Min'].val3 }} ~ {{ checkKeyObj['vf4Min'].val1 }} {{ checkKeyObj['vf4Min'].val2 }} ~ {{ checkKeyObj['vf4Min'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['vf4Min'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['vf4Min'].val3 }} ~ {{ checkKeyObj['vf4Min'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.vf4Min }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['vf4Min'] === undefined">{{ scope.row.vf4Min }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.vf4Min" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="VF4H" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['vf4Max'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['vf4Max'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['vf4Max'].val1 }} ~ {{ checkKeyObj['vf4Max'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['vf4Max'].val1!==null&&checkKeyObj['vf4Max'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['vf4Max'].val3 }} ~ {{ checkKeyObj['vf4Max'].val1 }} {{ checkKeyObj['vf4Max'].val2 }} ~ {{ checkKeyObj['vf4Max'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['vf4Max'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['vf4Max'].val3 }} ~ {{ checkKeyObj['vf4Max'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.vf4Max }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['vf4Max'] === undefined">{{ scope.row.vf4Max }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.vf4Max" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="VFDL" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['vfdMin'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['vfdMin'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['vfdMin'].val1 }} ~ {{ checkKeyObj['vfdMin'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['vfdMin'].val1!==null&&checkKeyObj['vfdMin'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['vfdMin'].val3 }} ~ {{ checkKeyObj['vfdMin'].val1 }} {{ checkKeyObj['vfdMin'].val2 }} ~ {{ checkKeyObj['vfdMin'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['vfdMin'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['vfdMin'].val3 }} ~ {{ checkKeyObj['vfdMin'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.vfdMin }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['vfdMin'] === undefined">{{ scope.row.vfdMin }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.vfdMin" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="VFDH" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['vfdMax'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['vfdMax'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['vfdMax'].val1 }} ~ {{ checkKeyObj['vfdMax'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['vfdMax'].val1!==null&&checkKeyObj['vfdMax'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['vfdMax'].val3 }} ~ {{ checkKeyObj['vfdMax'].val1 }} {{ checkKeyObj['vfdMax'].val2 }} ~ {{ checkKeyObj['vfdMax'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['vfdMax'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['vfdMax'].val3 }} ~ {{ checkKeyObj['vfdMax'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.vfdMax }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['vfdMax'] === undefined">{{ scope.row.vfdMax }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.vfdMax" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="VZL" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['vzMin'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['vzMin'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['vzMin'].val1 }} ~ {{ checkKeyObj['vzMin'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['vzMin'].val1!==null&&checkKeyObj['vzMin'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['vzMin'].val3 }} ~ {{ checkKeyObj['vzMin'].val1 }} {{ checkKeyObj['vzMin'].val2 }} ~ {{ checkKeyObj['vzMin'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['vzMin'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['vzMin'].val3 }} ~ {{ checkKeyObj['vzMin'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.vzMin }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['vzMin'] === undefined">{{ scope.row.vzMin }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.vzMin" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="VZH" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['vzMax'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['vzMax'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['vzMax'].val1 }} ~ {{ checkKeyObj['vzMax'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['vzMax'].val1!==null&&checkKeyObj['vzMax'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['vzMax'].val3 }} ~ {{ checkKeyObj['vzMax'].val1 }} {{ checkKeyObj['vzMax'].val2 }} ~ {{ checkKeyObj['vzMax'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['vzMax'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['vzMax'].val3 }} ~ {{ checkKeyObj['vzMax'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.vzMax }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['vzMax'] === undefined">{{ scope.row.vzMax }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.vzMax" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="IRL" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['irMin'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['irMin'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['irMin'].val1 }} ~ {{ checkKeyObj['irMin'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['irMin'].val1!==null&&checkKeyObj['irMin'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['irMin'].val3 }} ~ {{ checkKeyObj['irMin'].val1 }} {{ checkKeyObj['irMin'].val2 }} ~ {{ checkKeyObj['irMin'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['irMin'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['irMin'].val3 }} ~ {{ checkKeyObj['irMin'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.irMin }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['irMin'] === undefined">{{ scope.row.irMin }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.irMin" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="IRH" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['irMax'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['irMax'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['irMax'].val1 }} ~ {{ checkKeyObj['irMax'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['irMax'].val1!==null&&checkKeyObj['irMax'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['irMax'].val3 }} ~ {{ checkKeyObj['irMax'].val1 }} {{ checkKeyObj['irMax'].val2 }} ~ {{ checkKeyObj['irMax'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['irMax'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['irMax'].val3 }} ~ {{ checkKeyObj['irMax'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.irMax }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['irMax'] === undefined">{{ scope.row.irMax }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.irMax" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="IRESDAL" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['iresdaMin'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['iresdaMin'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['iresdaMin'].val1 }} ~ {{ checkKeyObj['iresdaMin'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['iresdaMin'].val1!==null&&checkKeyObj['iresdaMin'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['iresdaMin'].val3 }} ~ {{ checkKeyObj['iresdaMin'].val1 }} {{ checkKeyObj['iresdaMin'].val2 }} ~ {{ checkKeyObj['iresdaMin'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['iresdaMin'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['iresdaMin'].val3 }} ~ {{ checkKeyObj['iresdaMin'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.iresdaMin }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['iresdaMin'] === undefined">{{ scope.row.iresdaMin }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.iresdaMin" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="IRESDAH" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['iresdaMax'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['iresdaMax'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['iresdaMax'].val1 }} ~ {{ checkKeyObj['iresdaMax'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['iresdaMax'].val1!==null&&checkKeyObj['iresdaMax'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['iresdaMax'].val3 }} ~ {{ checkKeyObj['iresdaMax'].val1 }} {{ checkKeyObj['iresdaMax'].val2 }} ~ {{ checkKeyObj['iresdaMax'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['iresdaMax'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['iresdaMax'].val3 }} ~ {{ checkKeyObj['iresdaMax'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.iresdaMax }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['iresdaMax'] === undefined">{{ scope.row.iresdaMax }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.iresdaMax" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="LOPL" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['lopMin'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['lopMin'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['lopMin'].val1 }} ~ {{ checkKeyObj['lopMin'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['lopMin'].val1!==null&&checkKeyObj['lopMin'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['lopMin'].val3 }} ~ {{ checkKeyObj['lopMin'].val1 }} {{ checkKeyObj['lopMin'].val2 }} ~ {{ checkKeyObj['lopMin'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['lopMin'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['lopMin'].val3 }} ~ {{ checkKeyObj['lopMin'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.lopMin }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['lopMin'] === undefined">{{ scope.row.lopMin }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.lopMin" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="LOPH" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['lopMax'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['lopMax'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['lopMax'].val1 }} ~ {{ checkKeyObj['lopMax'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['lopMax'].val1!==null&&checkKeyObj['lopMax'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['lopMax'].val3 }} ~ {{ checkKeyObj['lopMax'].val1 }} {{ checkKeyObj['lopMax'].val2 }} ~ {{ checkKeyObj['lopMax'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['lopMax'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['lopMax'].val3 }} ~ {{ checkKeyObj['lopMax'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.lopMax }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['lopMax'] === undefined">{{ scope.row.lopMax }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.lopMax" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="WLDL" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['wldMin'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['wldMin'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['wldMin'].val1 }} ~ {{ checkKeyObj['wldMin'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['wldMin'].val1!==null&&checkKeyObj['wldMin'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['wldMin'].val3 }} ~ {{ checkKeyObj['wldMin'].val1 }} {{ checkKeyObj['wldMin'].val2 }} ~ {{ checkKeyObj['wldMin'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['wldMin'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['wldMin'].val3 }} ~ {{ checkKeyObj['wldMin'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.wldMin }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['wldMin'] === undefined">{{ scope.row.wldMin }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.wldMin" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="WLDH" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['wldMax'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['wldMax'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['wldMax'].val1 }} ~ {{ checkKeyObj['wldMax'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['wldMax'].val1!==null&&checkKeyObj['wldMax'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['wldMax'].val3 }} ~ {{ checkKeyObj['wldMax'].val1 }} {{ checkKeyObj['wldMax'].val2 }} ~ {{ checkKeyObj['wldMax'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['wldMax'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['wldMax'].val3 }} ~ {{ checkKeyObj['wldMax'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.wldMax }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['wldMax'] === undefined">{{ scope.row.wldMax }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.wldMax" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="BSL" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['bsMin'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['bsMin'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['bsMin'].val1 }} ~ {{ checkKeyObj['bsMin'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['bsMin'].val1!==null&&checkKeyObj['bsMin'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['bsMin'].val3 }} ~ {{ checkKeyObj['bsMin'].val1 }} {{ checkKeyObj['bsMin'].val2 }} ~ {{ checkKeyObj['bsMin'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['bsMin'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['bsMin'].val3 }} ~ {{ checkKeyObj['bsMin'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.bsMin }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['bsMin'] === undefined">{{ scope.row.bsMin }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.bsMin" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="BSH" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['bsMax'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['bsMax'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['bsMax'].val1 }} ~ {{ checkKeyObj['bsMax'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['bsMax'].val1!==null&&checkKeyObj['bsMax'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['bsMax'].val3 }} ~ {{ checkKeyObj['bsMax'].val1 }} {{ checkKeyObj['bsMax'].val2 }} ~ {{ checkKeyObj['bsMax'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['bsMax'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['bsMax'].val3 }} ~ {{ checkKeyObj['bsMax'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.bsMax }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['bsMax'] === undefined">{{ scope.row.bsMax }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.bsMax" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="DVFL" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['dvfMin'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['dvfMin'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['dvfMin'].val1 }} ~ {{ checkKeyObj['dvfMin'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['dvfMin'].val1!==null&&checkKeyObj['dvfMin'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['dvfMin'].val3 }} ~ {{ checkKeyObj['dvfMin'].val1 }} {{ checkKeyObj['dvfMin'].val2 }} ~ {{ checkKeyObj['dvfMin'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['dvfMin'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['dvfMin'].val3 }} ~ {{ checkKeyObj['dvfMin'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.dvfMin }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['dvfMin'] === undefined">{{ scope.row.dvfMin }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.dvfMin" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="DVFH" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['dvfMax'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['dvfMax'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['dvfMax'].val1 }} ~ {{ checkKeyObj['dvfMax'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['dvfMax'].val1!==null&&checkKeyObj['dvfMax'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['dvfMax'].val3 }} ~ {{ checkKeyObj['dvfMax'].val1 }} {{ checkKeyObj['dvfMax'].val2 }} ~ {{ checkKeyObj['dvfMax'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['dvfMax'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['dvfMax'].val3 }} ~ {{ checkKeyObj['dvfMax'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.dvfMax }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['dvfMax'] === undefined">{{ scope.row.dvfMax }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.dvfMax" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="HWL" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['hwMin'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['hwMin'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['hwMin'].val1 }} ~ {{ checkKeyObj['hwMin'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['hwMin'].val1!==null&&checkKeyObj['hwMin'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['hwMin'].val3 }} ~ {{ checkKeyObj['hwMin'].val1 }} {{ checkKeyObj['hwMin'].val2 }} ~ {{ checkKeyObj['hwMin'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['hwMin'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['hwMin'].val3 }} ~ {{ checkKeyObj['hwMin'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.hwMin }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['hwMin'] === undefined">{{ scope.row.hwMin }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.hwMin" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="HWH" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['hwMax'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['hwMax'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['hwMax'].val1 }} ~ {{ checkKeyObj['hwMax'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['hwMax'].val1!==null&&checkKeyObj['hwMax'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['hwMax'].val3 }} ~ {{ checkKeyObj['hwMax'].val1 }} {{ checkKeyObj['hwMax'].val2 }} ~ {{ checkKeyObj['hwMax'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['hwMax'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['hwMax'].val3 }} ~ {{ checkKeyObj['hwMax'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.hwMax }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['hwMax'] === undefined">{{ scope.row.hwMax }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.hwMax" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="WLPL" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['wlpMin'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['wlpMin'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['wlpMin'].val1 }} ~ {{ checkKeyObj['wlpMin'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['wlpMin'].val1!==null&&checkKeyObj['wlpMin'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['wlpMin'].val3 }} ~ {{ checkKeyObj['wlpMin'].val1 }} {{ checkKeyObj['wlpMin'].val2 }} ~ {{ checkKeyObj['wlpMin'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['wlpMin'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['wlpMin'].val3 }} ~ {{ checkKeyObj['wlpMin'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.wlpMin }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['wlpMin'] === undefined">{{ scope.row.wlpMin }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.wlpMin" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="WLPH" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['wlpMax'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['wlpMax'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['wlpMax'].val1 }} ~ {{ checkKeyObj['wlpMax'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['wlpMax'].val1!==null&&checkKeyObj['wlpMax'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['wlpMax'].val3 }} ~ {{ checkKeyObj['wlpMax'].val1 }} {{ checkKeyObj['wlpMax'].val2 }} ~ {{ checkKeyObj['wlpMax'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['wlpMax'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['wlpMax'].val3 }} ~ {{ checkKeyObj['wlpMax'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.wlpMax }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['wlpMax'] === undefined">{{ scope.row.wlpMax }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.wlpMax" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="主峰差L" align="center" width="98px">
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['wldWlpMin'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['wldWlpMin'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['wldWlpMin'].val1 }} ~ {{ checkKeyObj['wldWlpMin'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['wldWlpMin'].val1!==null&&checkKeyObj['wldWlpMin'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['wldWlpMin'].val3 }} ~ {{ checkKeyObj['wldWlpMin'].val1 }} {{ checkKeyObj['wldWlpMin'].val2 }} ~ {{ checkKeyObj['wldWlpMin'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['wldWlpMin'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['wldWlpMin'].val3 }} ~ {{ checkKeyObj['wldWlpMin'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.wldWlpMin }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['wldWlpMin'] === undefined">{{ scope.row.wldWlpMin }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.wldWlpMin" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="主峰差H" align="center" width="98px">
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['wldWlpMax'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['wldWlpMax'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['wldWlpMax'].val1 }} ~ {{ checkKeyObj['wldWlpMax'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['wldWlpMax'].val1!==null&&checkKeyObj['wldWlpMax'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['wldWlpMax'].val3 }} ~ {{ checkKeyObj['wldWlpMax'].val1 }} {{ checkKeyObj['wldWlpMax'].val2 }} ~ {{ checkKeyObj['wldWlpMax'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['wldWlpMax'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['wldWlpMax'].val3 }} ~ {{ checkKeyObj['wldWlpMax'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.wldWlpMax }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['wldWlpMax'] === undefined">{{ scope.row.wldWlpMax }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.wldWlpMax" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="Type" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.level!==clickId">{{ scope.row.typeName }}</span>
                <el-select v-if="scope.row.level===clickId" v-model="scope.row.type" class="search-input" size="small" style="width:90%" placeholder="请选择" filterable clearable @change="getNewType(scope.row.level)">
                  <el-option
                    v-for="item in typeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </template>
            </pl-table-column>
          </pl-table>
        </div>
      </fieldset>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="setDisable" type="primary" @click="submitForm()">确 定</el-button>
        <el-button @click="addDialogVisible = false">取 消</el-button>
      </span>
      <el-dialog
        :visible.sync="selectVisible"
        width="300px"
        top="80px"
        class="tip-out-inner-dialog"
        title="选择参照"
        append-to-body>
        <div style="text-align:center">
          <el-select v-model="getset" class="search-input" style="width:100%" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in setlists1"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleAdds()">确 定</el-button>
          <el-button @click="selectVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="修改BIN表"
      class="edit-dialog"
      width="1200px">
      <fieldset class="fieldest">
        <legend class="legendsty"> 基础信息 </legend>
        <div class="input-item">
          <span class="input-title">型号 </span>
          <el-select v-model="newmodel" :disabled="true" class="search-input" size="small" placeholder="请选择" filterable clearable @change="getNewName">
            <el-option
              v-for="item in modelList"
              :key="item.id"
              :label="item.code"
              :value="item.code"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">光色 </span>
          <el-select v-model="newcolor" :disabled="true" class="search-input" size="small" placeholder="请选择" filterable clearable @change="getNewName">
            <el-option
              v-for="item in colorList"
              :key="item.id"
              :label="item.code"
              :value="item.code"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">工艺 </span>
          <el-select v-model="newgy" :disabled="true" class="search-input" size="small" placeholder="请选择" filterable clearable @change="getNewName">
            <el-option
              v-for="item in gyList"
              :key="item.id"
              :label="item.code"
              :value="item.code"/>
          </el-select>
        </div>
        <div class="input-item">
          <span class="input-title">标准名称 </span>
          <el-input v-model="newname" :disabled="true" class="search-input" size="small"/>
        </div>
        <div class="input-item">
          <span class="input-title">版本 </span>
          <el-input v-model="newvsersion" :disabled="true" class="search-input" size="small"/>
        </div>
        <div class="input-item" style="width:100%;text-align:left">
          <span class="input-title" style="width: 70px;line-height: 60px;">备注 </span>
          <el-input v-model="remark" type="textarea" class="search-input" style="width:1022px" size="small" maxlength="50"/>
        </div>
      </fieldset>
      <fieldset class="fieldest" style="margin-top: 15px;">
        <legend class="legendsty"> BIN信息 </legend>
        <div v-if="!listLoading" style="width:1132px;text-align:left">
          <span class="input-title" style="float: left;width: 85px;line-height: 35px;">导入BIN表 </span>
          <el-upload
            ref="upload"
            :auto-upload="true"
            :on-success="onSuccess"
            :on-error="onError"
            :action="fileUrl"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :with-credentials="true"
            style="float: left; margin-right: 15px"
            accept=".xls,.xlsx"
            class="upload-demo"
          >
            <el-button v-loading="loading" slot="trigger" size="small" type="primary"><svg-icon icon-class="import"/>  导入</el-button>
          </el-upload>
        </div>
        <div v-if="listLoading" style="width:1132px;text-align:left">
          <span class="input-title" style="float: left;width: 100px;line-height: 35px;">加载中... </span>
        </div>
        <div style="width: 1132px;margin-top: 50px;height:400px">
          <pl-table
            v-loading="listLoading"
            v-if="editDialogVisible"
            :datas="showCheckList"
            :row-height="35"
            :cell-style="tableRowClassColor"
            element-loading-text="拼命加载中"
            style="height:100%"
            class="run-table"
            border
            fit
            header-drag-style
            use-virtual
            @cell-dblclick="cellDblclick">
            <pl-table-column fixed align="center" label="Bin" width="50">
              <template slot-scope="scope">
                {{ scope.row.level }}
              </template>
            </pl-table-column>
            <pl-table-column label="VFL" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['vf1Min'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['vf1Min'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['vf1Min'].val1 }} ~ {{ checkKeyObj['vf1Min'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['vf1Min'].val1!==null&&checkKeyObj['vf1Min'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['vf1Min'].val3 }} ~ {{ checkKeyObj['vf1Min'].val1 }} {{ checkKeyObj['vf1Min'].val2 }} ~ {{ checkKeyObj['vf1Min'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['vf1Min'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['vf1Min'].val3 }} ~ {{ checkKeyObj['vf1Min'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.vf1Min }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['vf1Min'] === undefined">{{ scope.row.vf1Min }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.vf1Min" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="VFH" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['vf1Max'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['vf1Max'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['vf1Max'].val1 }} ~ {{ checkKeyObj['vf1Max'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['vf1Max'].val1!==null&&checkKeyObj['vf1Max'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['vf1Max'].val3 }} ~ {{ checkKeyObj['vf1Max'].val1 }} {{ checkKeyObj['vf1Max'].val2 }} ~ {{ checkKeyObj['vf1Max'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['vf1Max'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['vf1Max'].val3 }} ~ {{ checkKeyObj['vf1Max'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.vf1Max }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['vf1Max'] === undefined">{{ scope.row.vf1Max }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.vf1Max" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="VF2L" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['vf2Min'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['vf2Min'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['vf2Min'].val1 }} ~ {{ checkKeyObj['vf2Min'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['vf2Min'].val1!==null&&checkKeyObj['vf2Min'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['vf2Min'].val3 }} ~ {{ checkKeyObj['vf2Min'].val1 }} {{ checkKeyObj['vf2Min'].val2 }} ~ {{ checkKeyObj['vf2Min'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['vf2Min'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['vf2Min'].val3 }} ~ {{ checkKeyObj['vf2Min'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.vf2Min }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['vf2Min'] === undefined">{{ scope.row.vf2Min }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.vf2Min" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="VF2H" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['vf2Max'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['vf2Max'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['vf2Max'].val1 }} ~ {{ checkKeyObj['vf2Max'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['vf2Max'].val1!==null&&checkKeyObj['vf2Max'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['vf2Max'].val3 }} ~ {{ checkKeyObj['vf2Max'].val1 }} {{ checkKeyObj['vf2Max'].val2 }} ~ {{ checkKeyObj['vf2Max'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['vf2Max'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['vf2Max'].val3 }} ~ {{ checkKeyObj['vf2Max'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.vf2Max }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['vf2Max'] === undefined">{{ scope.row.vf2Max }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.vf2Max" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="VF3L" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['vf3Min'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['vf3Min'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['vf3Min'].val1 }} ~ {{ checkKeyObj['vf3Min'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['vf3Min'].val1!==null&&checkKeyObj['vf3Min'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['vf3Min'].val3 }} ~ {{ checkKeyObj['vf3Min'].val1 }} {{ checkKeyObj['vf3Min'].val2 }} ~ {{ checkKeyObj['vf3Min'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['vf3Min'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['vf3Min'].val3 }} ~ {{ checkKeyObj['vf3Min'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.vf3Min }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['vf3Min'] === undefined">{{ scope.row.vf3Min }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.vf3Min" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="VF3H" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['vf3Max'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['vf3Max'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['vf3Max'].val1 }} ~ {{ checkKeyObj['vf3Max'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['vf3Max'].val1!==null&&checkKeyObj['vf3Max'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['vf3Max'].val3 }} ~ {{ checkKeyObj['vf3Max'].val1 }} {{ checkKeyObj['vf3Max'].val2 }} ~ {{ checkKeyObj['vf3Max'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['vf3Max'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['vf3Max'].val3 }} ~ {{ checkKeyObj['vf3Max'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.vf3Max }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['vf3Max'] === undefined">{{ scope.row.vf3Max }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.vf3Max" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="VF4L" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['vf4Min'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['vf4Min'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['vf4Min'].val1 }} ~ {{ checkKeyObj['vf4Min'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['vf4Min'].val1!==null&&checkKeyObj['vf4Min'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['vf4Min'].val3 }} ~ {{ checkKeyObj['vf4Min'].val1 }} {{ checkKeyObj['vf4Min'].val2 }} ~ {{ checkKeyObj['vf4Min'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['vf4Min'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['vf4Min'].val3 }} ~ {{ checkKeyObj['vf4Min'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.vf4Min }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['vf4Min'] === undefined">{{ scope.row.vf4Min }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.vf4Min" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="VF4H" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['vf4Max'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['vf4Max'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['vf4Max'].val1 }} ~ {{ checkKeyObj['vf4Max'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['vf4Max'].val1!==null&&checkKeyObj['vf4Max'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['vf4Max'].val3 }} ~ {{ checkKeyObj['vf4Max'].val1 }} {{ checkKeyObj['vf4Max'].val2 }} ~ {{ checkKeyObj['vf4Max'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['vf4Max'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['vf4Max'].val3 }} ~ {{ checkKeyObj['vf4Max'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.vf4Max }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['vf4Max'] === undefined">{{ scope.row.vf4Max }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.vf4Max" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="VFDL" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['vfdMin'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['vfdMin'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['vfdMin'].val1 }} ~ {{ checkKeyObj['vfdMin'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['vfdMin'].val1!==null&&checkKeyObj['vfdMin'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['vfdMin'].val3 }} ~ {{ checkKeyObj['vfdMin'].val1 }} {{ checkKeyObj['vfdMin'].val2 }} ~ {{ checkKeyObj['vfdMin'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['vfdMin'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['vfdMin'].val3 }} ~ {{ checkKeyObj['vfdMin'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.vfdMin }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['vfdMin'] === undefined">{{ scope.row.vfdMin }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.vfdMin" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="VFDH" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['vfdMax'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['vfdMax'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['vfdMax'].val1 }} ~ {{ checkKeyObj['vfdMax'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['vfdMax'].val1!==null&&checkKeyObj['vfdMax'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['vfdMax'].val3 }} ~ {{ checkKeyObj['vfdMax'].val1 }} {{ checkKeyObj['vfdMax'].val2 }} ~ {{ checkKeyObj['vfdMax'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['vfdMax'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['vfdMax'].val3 }} ~ {{ checkKeyObj['vfdMax'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.vfdMax }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['vfdMax'] === undefined">{{ scope.row.vfdMax }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.vfdMax" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="VZL" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['vzMin'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['vzMin'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['vzMin'].val1 }} ~ {{ checkKeyObj['vzMin'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['vzMin'].val1!==null&&checkKeyObj['vzMin'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['vzMin'].val3 }} ~ {{ checkKeyObj['vzMin'].val1 }} {{ checkKeyObj['vzMin'].val2 }} ~ {{ checkKeyObj['vzMin'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['vzMin'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['vzMin'].val3 }} ~ {{ checkKeyObj['vzMin'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.vzMin }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['vzMin'] === undefined">{{ scope.row.vzMin }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.vzMin" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="VZH" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['vzMax'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['vzMax'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['vzMax'].val1 }} ~ {{ checkKeyObj['vzMax'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['vzMax'].val1!==null&&checkKeyObj['vzMax'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['vzMax'].val3 }} ~ {{ checkKeyObj['vzMax'].val1 }} {{ checkKeyObj['vzMax'].val2 }} ~ {{ checkKeyObj['vzMax'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['vzMax'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['vzMax'].val3 }} ~ {{ checkKeyObj['vzMax'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.vzMax }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['vzMax'] === undefined">{{ scope.row.vzMax }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.vzMax" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="IRL" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['irMin'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['irMin'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['irMin'].val1 }} ~ {{ checkKeyObj['irMin'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['irMin'].val1!==null&&checkKeyObj['irMin'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['irMin'].val3 }} ~ {{ checkKeyObj['irMin'].val1 }} {{ checkKeyObj['irMin'].val2 }} ~ {{ checkKeyObj['irMin'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['irMin'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['irMin'].val3 }} ~ {{ checkKeyObj['irMin'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.irMin }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['irMin'] === undefined">{{ scope.row.irMin }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.irMin" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="IRH" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['irMax'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['irMax'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['irMax'].val1 }} ~ {{ checkKeyObj['irMax'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['irMax'].val1!==null&&checkKeyObj['irMax'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['irMax'].val3 }} ~ {{ checkKeyObj['irMax'].val1 }} {{ checkKeyObj['irMax'].val2 }} ~ {{ checkKeyObj['irMax'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['irMax'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['irMax'].val3 }} ~ {{ checkKeyObj['irMax'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.irMax }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['irMax'] === undefined">{{ scope.row.irMax }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.irMax" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="IRESDAL" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['iresdaMin'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['iresdaMin'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['iresdaMin'].val1 }} ~ {{ checkKeyObj['iresdaMin'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['iresdaMin'].val1!==null&&checkKeyObj['iresdaMin'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['iresdaMin'].val3 }} ~ {{ checkKeyObj['iresdaMin'].val1 }} {{ checkKeyObj['iresdaMin'].val2 }} ~ {{ checkKeyObj['iresdaMin'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['iresdaMin'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['iresdaMin'].val3 }} ~ {{ checkKeyObj['iresdaMin'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.iresdaMin }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['iresdaMin'] === undefined">{{ scope.row.iresdaMin }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.iresdaMin" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="IRESDAH" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['iresdaMax'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['iresdaMax'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['iresdaMax'].val1 }} ~ {{ checkKeyObj['iresdaMax'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['iresdaMax'].val1!==null&&checkKeyObj['iresdaMax'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['iresdaMax'].val3 }} ~ {{ checkKeyObj['iresdaMax'].val1 }} {{ checkKeyObj['iresdaMax'].val2 }} ~ {{ checkKeyObj['iresdaMax'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['iresdaMax'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['iresdaMax'].val3 }} ~ {{ checkKeyObj['iresdaMax'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.iresdaMax }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['iresdaMax'] === undefined">{{ scope.row.iresdaMax }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.iresdaMax" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="LOPL" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['lopMin'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['lopMin'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['lopMin'].val1 }} ~ {{ checkKeyObj['lopMin'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['lopMin'].val1!==null&&checkKeyObj['lopMin'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['lopMin'].val3 }} ~ {{ checkKeyObj['lopMin'].val1 }} {{ checkKeyObj['lopMin'].val2 }} ~ {{ checkKeyObj['lopMin'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['lopMin'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['lopMin'].val3 }} ~ {{ checkKeyObj['lopMin'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.lopMin }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['lopMin'] === undefined">{{ scope.row.lopMin }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.lopMin" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="LOPH" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['lopMax'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['lopMax'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['lopMax'].val1 }} ~ {{ checkKeyObj['lopMax'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['lopMax'].val1!==null&&checkKeyObj['lopMax'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['lopMax'].val3 }} ~ {{ checkKeyObj['lopMax'].val1 }} {{ checkKeyObj['lopMax'].val2 }} ~ {{ checkKeyObj['lopMax'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['lopMax'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['lopMax'].val3 }} ~ {{ checkKeyObj['lopMax'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.lopMax }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['lopMax'] === undefined">{{ scope.row.lopMax }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.lopMax" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="WLDL" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['wldMin'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['wldMin'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['wldMin'].val1 }} ~ {{ checkKeyObj['wldMin'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['wldMin'].val1!==null&&checkKeyObj['wldMin'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['wldMin'].val3 }} ~ {{ checkKeyObj['wldMin'].val1 }} {{ checkKeyObj['wldMin'].val2 }} ~ {{ checkKeyObj['wldMin'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['wldMin'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['wldMin'].val3 }} ~ {{ checkKeyObj['wldMin'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.wldMin }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['wldMin'] === undefined">{{ scope.row.wldMin }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.wldMin" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="WLDH" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['wldMax'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['wldMax'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['wldMax'].val1 }} ~ {{ checkKeyObj['wldMax'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['wldMax'].val1!==null&&checkKeyObj['wldMax'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['wldMax'].val3 }} ~ {{ checkKeyObj['wldMax'].val1 }} {{ checkKeyObj['wldMax'].val2 }} ~ {{ checkKeyObj['wldMax'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['wldMax'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['wldMax'].val3 }} ~ {{ checkKeyObj['wldMax'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.wldMax }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['wldMax'] === undefined">{{ scope.row.wldMax }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.wldMax" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="BSL" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['bsMin'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['bsMin'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['bsMin'].val1 }} ~ {{ checkKeyObj['bsMin'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['bsMin'].val1!==null&&checkKeyObj['bsMin'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['bsMin'].val3 }} ~ {{ checkKeyObj['bsMin'].val1 }} {{ checkKeyObj['bsMin'].val2 }} ~ {{ checkKeyObj['bsMin'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['bsMin'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['bsMin'].val3 }} ~ {{ checkKeyObj['bsMin'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.bsMin }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['bsMin'] === undefined">{{ scope.row.bsMin }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.bsMin" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="BSH" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['bsMax'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['bsMax'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['bsMax'].val1 }} ~ {{ checkKeyObj['bsMax'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['bsMax'].val1!==null&&checkKeyObj['bsMax'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['bsMax'].val3 }} ~ {{ checkKeyObj['bsMax'].val1 }} {{ checkKeyObj['bsMax'].val2 }} ~ {{ checkKeyObj['bsMax'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['bsMax'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['bsMax'].val3 }} ~ {{ checkKeyObj['bsMax'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.bsMax }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['bsMax'] === undefined">{{ scope.row.bsMax }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.bsMax" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="DVFL" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['dvfMin'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['dvfMin'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['dvfMin'].val1 }} ~ {{ checkKeyObj['dvfMin'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['dvfMin'].val1!==null&&checkKeyObj['dvfMin'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['dvfMin'].val3 }} ~ {{ checkKeyObj['dvfMin'].val1 }} {{ checkKeyObj['dvfMin'].val2 }} ~ {{ checkKeyObj['dvfMin'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['dvfMin'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['dvfMin'].val3 }} ~ {{ checkKeyObj['dvfMin'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.dvfMin }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['dvfMin'] === undefined">{{ scope.row.dvfMin }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.dvfMin" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="DVFH" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['dvfMax'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['dvfMax'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['dvfMax'].val1 }} ~ {{ checkKeyObj['dvfMax'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['dvfMax'].val1!==null&&checkKeyObj['dvfMax'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['dvfMax'].val3 }} ~ {{ checkKeyObj['dvfMax'].val1 }} {{ checkKeyObj['dvfMax'].val2 }} ~ {{ checkKeyObj['dvfMax'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['dvfMax'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['dvfMax'].val3 }} ~ {{ checkKeyObj['dvfMax'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.dvfMax }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['dvfMax'] === undefined">{{ scope.row.dvfMax }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.dvfMax" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="HWL" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['hwMin'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['hwMin'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['hwMin'].val1 }} ~ {{ checkKeyObj['hwMin'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['hwMin'].val1!==null&&checkKeyObj['hwMin'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['hwMin'].val3 }} ~ {{ checkKeyObj['hwMin'].val1 }} {{ checkKeyObj['hwMin'].val2 }} ~ {{ checkKeyObj['hwMin'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['hwMin'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['hwMin'].val3 }} ~ {{ checkKeyObj['hwMin'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.hwMin }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['hwMin'] === undefined">{{ scope.row.hwMin }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.hwMin" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="HWH" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['hwMax'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['hwMax'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['hwMax'].val1 }} ~ {{ checkKeyObj['hwMax'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['hwMax'].val1!==null&&checkKeyObj['hwMax'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['hwMax'].val3 }} ~ {{ checkKeyObj['hwMax'].val1 }} {{ checkKeyObj['hwMax'].val2 }} ~ {{ checkKeyObj['hwMax'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['hwMax'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['hwMax'].val3 }} ~ {{ checkKeyObj['hwMax'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.hwMax }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['hwMax'] === undefined">{{ scope.row.hwMax }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.hwMax" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="WLPL" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['wlpMin'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['wlpMin'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['wlpMin'].val1 }} ~ {{ checkKeyObj['wlpMin'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['wlpMin'].val1!==null&&checkKeyObj['wlpMin'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['wlpMin'].val3 }} ~ {{ checkKeyObj['wlpMin'].val1 }} {{ checkKeyObj['wlpMin'].val2 }} ~ {{ checkKeyObj['wlpMin'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['wlpMin'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['wlpMin'].val3 }} ~ {{ checkKeyObj['wlpMin'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.wlpMin }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['wlpMin'] === undefined">{{ scope.row.wlpMin }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.wlpMin" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="WLPH" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['wlpMax'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['wlpMax'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['wlpMax'].val1 }} ~ {{ checkKeyObj['wlpMax'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['wlpMax'].val1!==null&&checkKeyObj['wlpMax'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['wlpMax'].val3 }} ~ {{ checkKeyObj['wlpMax'].val1 }} {{ checkKeyObj['wlpMax'].val2 }} ~ {{ checkKeyObj['wlpMax'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['wlpMax'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['wlpMax'].val3 }} ~ {{ checkKeyObj['wlpMax'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.wlpMax }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['wlpMax'] === undefined">{{ scope.row.wlpMax }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.wlpMax" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="主峰差L" align="center" width="98px">
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['wldWlpMin'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['wldWlpMin'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['wldWlpMin'].val1 }} ~ {{ checkKeyObj['wldWlpMin'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['wldWlpMin'].val1!==null&&checkKeyObj['wldWlpMin'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['wldWlpMin'].val3 }} ~ {{ checkKeyObj['wldWlpMin'].val1 }} {{ checkKeyObj['wldWlpMin'].val2 }} ~ {{ checkKeyObj['wldWlpMin'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['wldWlpMin'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['wldWlpMin'].val3 }} ~ {{ checkKeyObj['wldWlpMin'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.wldWlpMin }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['wldWlpMin'] === undefined">{{ scope.row.wldWlpMin }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.wldWlpMin" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="主峰差H" align="center" width="98px">
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level!==clickId&&checkKeyObj['wldWlpMax'] !== undefined" placement="top">
                  <div v-if="checkKeyObj['wldWlpMax'].val1!==null&&(scope.row.type === 0 ||scope.row.type===2)" slot="content">
                    设置范围： {{ checkKeyObj['wldWlpMax'].val1 }} ~ {{ checkKeyObj['wldWlpMax'].val2 }}
                  </div>
                  <div v-if="checkKeyObj['wldWlpMax'].val1!==null&&checkKeyObj['wldWlpMax'].val3!==null&&scope.row.type === 1" slot="content">
                    设置范围： {{ checkKeyObj['wldWlpMax'].val3 }} ~ {{ checkKeyObj['wldWlpMax'].val1 }} {{ checkKeyObj['wldWlpMax'].val2 }} ~ {{ checkKeyObj['wldWlpMax'].val4 }}
                  </div>
                  <div v-if="checkKeyObj['wldWlpMax'].val3!==null&&scope.row.type === 3" slot="content">
                    设置范围： {{ checkKeyObj['wldWlpMax'].val3 }} ~ {{ checkKeyObj['wldWlpMax'].val4 }}
                  </div>
                  <div v-if="scope.row.type === 5" slot="content">
                    设置范围： 无
                  </div>
                  <div>{{ scope.row.wldWlpMax }}</div>
                </el-tooltip>
                <span v-if="scope.row.level!==clickId&&checkKeyObj['wldWlpMax'] === undefined">{{ scope.row.wldWlpMax }}</span>
                <el-input v-if="scope.row.level===clickId" v-model="scope.row.wldWlpMax" class="search-input" size="small" style="width:90%" maxlength="8"/>
              </template>
            </pl-table-column>
            <pl-table-column label="Type" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.level!==clickId">{{ scope.row.typeName }}</span>
                <el-select v-if="scope.row.level===clickId" v-model="scope.row.type" class="search-input" size="small" style="width:90%" placeholder="请选择" filterable clearable @change="getNewType(scope.row.level)">
                  <el-option
                    v-for="item in typeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </template>
            </pl-table-column>
          </pl-table>
        </div>
      </fieldset>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="setDisable" type="primary" @click="editsubmitForm()">确 定</el-button>
        <el-button @click="editDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="historyDialogVisible"
      title="历史版本"
      width="1200px"
      class="edit-dialog">
      <fieldset class="fieldest">
        <legend class="legendsty"> 历史版本 </legend>
        <el-table
          ref="history"
          :data="historyList"
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
          <el-table-column label="修改人" align="center" prop="createName"/>
          <el-table-column label="修改时间" align="center" prop="createTime"/>
          <el-table-column label="是否启用" align="center" prop="status">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.isChecked" @change="setStatushis(scope.row)">启用</el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="130px">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="exportAll(scope.row)"><svg-icon icon-class="export"/> 导出</el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </fieldset>
      <fieldset class="fieldest" style="margin-top: 15px;">
        <legend class="legendsty"> 标准详情 </legend>
        <div style="width: 1132px;height:400px">
          <pl-table
            v-loading="listLoading"
            v-if="historyDialogVisible"
            :datas="showCheckList"
            :row-height="35"
            :cell-style="tableRowClassColor"
            element-loading-text="拼命加载中"
            style="height:100%"
            class="run-table"
            border
            fit
            header-drag-style
            use-virtual>
            <pl-table-column fixed align="center" label="Bin" width="50">
              <template slot-scope="scope">
                {{ scope.row.level }}
              </template>
            </pl-table-column>
            <pl-table-column label="VFL" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.vf1Min }}</span>
              </template>
            </pl-table-column>
            <pl-table-column label="VFH" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.vf1Max }}</span>
              </template>
            </pl-table-column>
            <pl-table-column label="VF2L" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.vf2Min }}</span>
              </template>
            </pl-table-column>
            <pl-table-column label="VF2H" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.vf2Max }}</span>
              </template>
            </pl-table-column>
            <pl-table-column label="VF3L" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.vf3Min }}</span>
              </template>
            </pl-table-column>
            <pl-table-column label="VF3H" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.vf3Max }}</span>
              </template>
            </pl-table-column>
            <pl-table-column label="VF4L" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.vf4Min }}</span>
              </template>
            </pl-table-column>
            <pl-table-column label="VF4H" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.vf4Max }}</span>
              </template>
            </pl-table-column>
            <pl-table-column label="VFDL" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.vfdMin }}</span>
              </template>
            </pl-table-column>
            <pl-table-column label="VFDH" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.vfdMax }}</span>
              </template>
            </pl-table-column>
            <pl-table-column label="VZL" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.vzMin }}</span>
              </template>
            </pl-table-column>
            <pl-table-column label="VZH" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.vzMax }}</span>
              </template>
            </pl-table-column>
            <pl-table-column label="IRL" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.irMin }}</span>
              </template>
            </pl-table-column>
            <pl-table-column label="IRH" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.irMax }}</span>
              </template>
            </pl-table-column>
            <pl-table-column label="IRESDAL" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.iresdaMin }}</span>
              </template>
            </pl-table-column>
            <pl-table-column label="IRESDAH" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.iresdaMax }}</span>
              </template>
            </pl-table-column>
            <pl-table-column label="LOPL" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.lopMin }}</span>
              </template>
            </pl-table-column>
            <pl-table-column label="LOPH" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.lopMax }}</span>
              </template>
            </pl-table-column>
            <pl-table-column label="WLDL" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.wldMin }}</span>
              </template>
            </pl-table-column>
            <pl-table-column label="WLDH" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.wldMax }}</span>
              </template>
            </pl-table-column>
            <pl-table-column label="BSL" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.bsMin }}</span>
              </template>
            </pl-table-column>
            <pl-table-column label="BSH" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.bsMax }}</span>
              </template>
            </pl-table-column>
            <pl-table-column label="DVFL" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.dvfMin }}</span>
              </template>
            </pl-table-column>
            <pl-table-column label="DVFH" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.dvfMax }}</span>
              </template>
            </pl-table-column>
            <pl-table-column label="HWL" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.hwMin }}</span>
              </template>
            </pl-table-column>
            <pl-table-column label="HWH" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.hwMax }}</span>
              </template>
            </pl-table-column>
            <pl-table-column label="WLPL" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.wlpMin }}</span>
              </template>
            </pl-table-column>
            <pl-table-column label="WLPH" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.wlpMax }}</span>
              </template>
            </pl-table-column>
            <pl-table-column label="主峰差L" align="center" width="98px">
              <template slot-scope="scope">
                <div>{{ scope.row.wldWlpMin }}</div>
              </template>
            </pl-table-column>
            <pl-table-column label="主峰差H" align="center" width="98px">
              <template slot-scope="scope">
                <div>{{ scope.row.wldWlpMax }}</div>
              </template>
            </pl-table-column>
            <pl-table-column label="Type" align="center" width="65px" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.typeName }}</span>
              </template>
            </pl-table-column>
          </pl-table>
        </div>
      </fieldset>
      <span slot="footer" class="dialog-footer">
        <el-button @click="historyDialogVisible = false">关 闭</el-button>
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
    width: 125px;
  }
  .run-table ::-webkit-scrollbar {/*滚动条整体样式*/
    height: 10px !important;
  }
  /* .run-table>>>.el-table__body-wrapper tr{
    cursor: pointer;
  } */
  .edit-dialog>>>.el-dialog__body .el-table__fixed{
    height: 388px !important;
    background: #fff !important;
  }
  .edit-dialog>>>.el-dialog__body .el-table__fixed-body-wrapper{
    height: 346px !important;
  }
  .edit-dialog>>> .el-table--scrollable-x{
    height: 400px !important;
  }
</style>
