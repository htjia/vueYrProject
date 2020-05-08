<template>
  <PageHeaderLayout>
    <div class="header-search-add height-auto">
      <el-row>
        <el-col :span="12">
          <div class="left-search-box">
            <div class="input-item" style="margin-top:0px">
              <span class="input-title">编码名称</span>
              <el-input
                v-model="code"
                class="search-input"
                size="small"
                maxlength="20"
                clearable
              />
            </div>
            <div class="input-item" style="margin-top:0px">
              <el-button
                size="small"
                type="primary"
                icon="el-icon-search"
                @click="handleSearch"
              >查询</el-button>
            </div>
          </div>
        </el-col>
        <el-col :span="12" style="text-align: right;">
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
        </el-col>
      </el-row>
    </div>
    <div class="app-container run-table">
      <el-table
        v-loading="listLoading"
        :data="list"
        :cell-style="tableRowClassColor"
        element-loading-text="拼命加载中"
        class="broad-scrollbar-table"
        height="calc(100vh - 285px)"
        border
        fit
        stripe
        highlight-current-row
        @current-change="handleCurrentChange"
      >
        <el-table-column align="center" label="序号" fixed>
          <template slot-scope="scope">{{ scope.$index + 1 + ((pageNum-1)*pageSize) }}</template>
        </el-table-column>
        <el-table-column label="编码名称" align="center" prop="code" width="150px" fixed show-overflow-tooltip/>
        <el-table-column label="入库形式" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.shape === 1">
              方片
            </span>
            <span v-if="scope.row.shape === 0">
              圆片
            </span>
          </template>
        </el-table-column>
        <el-table-column label="芯片型号" align="center" prop="model" show-overflow-tooltip/>
        <el-table-column label="芯片尺寸" align="center" prop="measure" show-overflow-tooltip/>
        <el-table-column label="电极" align="center" prop="electrode" show-overflow-tooltip/>
        <el-table-column label="切割道" align="center" prop="cuttingWay" show-overflow-tooltip/>
        <el-table-column label="芯片外观" align="center" style="display: flex;justify-content: center;">
          <template slot-scope="scope">
            <img v-if="scope.row.iconUrl!==null&&scope.row.iconUrl!==''" :src="'/images/'+scope.row.iconUrl" style="width: 70px;height: 30px;margin-bottom: -10px;">
            <img v-if="scope.row.iconUrl===null||scope.row.iconUrl===''" style="height: 24px;margin-top: 7px;margin-bottom: -7px;" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMi4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0i5Zu+5bGCXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMjQgMjQiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDI0IDI0OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDojNjY2NjY2O30NCjwvc3R5bGU+DQo8dGl0bGU+YWRkeHo8L3RpdGxlPg0KPGc+DQoJPHBhdGggY2xhc3M9InN0MCIgZD0iTTE4LjEsOS4yYzAuOSwwLDEuNy0wLjcsMS43LTEuN2MwLTAuOS0wLjctMS43LTEuNy0xLjdzLTEuNywwLjctMS43LDEuN0MxNi41LDguNSwxNy4yLDkuMiwxOC4xLDkuMnoiLz4NCgk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMjMuMywyLjdjLTAuMS0wLjEtMC4zLTAuMi0wLjUtMC4zTDEyLjIsMS43Yy0wLjIsMC0wLjUsMC4xLTAuNiwwLjNMOS41LDQuNmMtMC4yLDAuMy0wLjIsMC43LDAsMC45bDMuNCwzLjkNCgkJTDkuNCwxNGwwLjgtNGMwLjEtMC4zLDAtMC42LTAuMy0wLjdMNS42LDUuN2wxLjgtMi45YzAuMi0wLjMsMC4xLTAuOC0wLjItMUM3LjEsMS42LDYuOSwxLjYsNi44LDEuNkwxLjIsMkMwLjgsMiwwLjUsMi40LDAuNSwyLjgNCgkJYzAsMCwwLDAsMCwwbDEuMywxOC41YzAsMC40LDAuNCwwLjcsMC44LDAuN2MwLDAsMCwwLDAsMGw0LjEtMC4zYzAuNCwwLDAuNy0wLjQsMC43LTAuOGMwLTAuNC0wLjQtMC43LTAuOC0wLjdsLTMuMywwLjNsLTAuMS0yLjENCgkJTDYsMThjMC40LDAsMC43LTAuNCwwLjctMC44YzAsMCwwLDAsMCwwYzAtMC40LTAuNC0wLjctMC44LTAuN0wzLDE2LjhMMiwzLjRsMy40LTAuMkw0LDUuNGMtMC4yLDAuMy0wLjEsMC43LDAuMiwxbDQuNiwzLjcNCgkJbC0xLjQsNi41YzAsMC4xLDAsMC4yLDAsMC4zYzAsMC4xLDAsMC4yLDAsMC4zbDEuMiwzLjZjMC4xLDAuMywwLjMsMC41LDAuNiwwLjVsMTIuMSwxLjFjMC40LDAsMC44LTAuMywwLjgtMC43YzAsMCwwLDAsMCwwDQoJCWwxLjMtMTguNUMyMy41LDMsMjMuNCwyLjgsMjMuMywyLjd6IE0yMSwxNy4zbC05LjYtMC45Yy0wLjQsMC0wLjgsMC4yLTAuOCwwLjZjMCwwLDAsMCwwLDBjMCwwLjQsMC4zLDAuOCwwLjcsMC44YzAsMCwwLDAsMCwwDQoJCWw5LjYsMC45bC0wLjEsMi4xbC0xMC45LTFMOSwxNy4xbDUuNC03LjJjMC4yLTAuMywwLjItMC43LDAtMC45TDExLDUuMWwxLjUtMS45TDIyLDMuOEwyMSwxNy4zeiIvPg0KPC9nPg0KPC9zdmc+DQo=">
          </template>
        </el-table-column>
        <el-table-column label="标准产出" align="center" prop="standardOutput" show-overflow-tooltip/>
        <el-table-column label="外延规格" align="center" prop="specificationName" show-overflow-tooltip/>
        <el-table-column label="背镀" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.backPlating === 1">
              有
            </span>
            <span v-if="scope.row.backPlating === 0">
              无
            </span>
          </template>
        </el-table-column>
        <el-table-column label="芯片工艺" align="center" prop="chipCraftName" show-overflow-tooltip/>
        <el-table-column label="蒸镀电极" align="center" prop="electrodeCraft" show-overflow-tooltip/>
        <el-table-column label="研磨厚度" align="center" prop="grindPly" show-overflow-tooltip/>
        <el-table-column label="切割工艺" align="center" prop="cuttiongName" show-overflow-tooltip/>
        <el-table-column label="COW测试条件" align="center" prop="cowTest" width="150px" show-overflow-tooltip/>
        <el-table-column label="COT电流测试条件" align="center" prop="currentTest" width="150px" show-overflow-tooltip/>
        <el-table-column label="COT测试档" align="center" prop="cotTest" show-overflow-tooltip/>
        <el-table-column label="COT ESD是否全测" align="center" width="150px">
          <template slot-scope="scope">
            <span v-if="scope.row.cotEsd === 1">
              是
            </span>
            <span v-if="scope.row.cotEsd === 0">
              否
            </span>
          </template>
        </el-table-column>
        <el-table-column label="COT IR测试条件" align="center" prop="cotIr" width="150px" show-overflow-tooltip/>
        <el-table-column label="COT亮度单位" align="center" prop="ldunit" width="120px" show-overflow-tooltip/>
        <el-table-column label="目检" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.visual === 1">
              吸边
            </span>
            <span v-if="scope.row.visual === 0">
              不吸边
            </span>
          </template>
        </el-table-column>
        <el-table-column label="TAPNO" align="center" prop="tapno" show-overflow-tooltip/>
        <el-table-column label="mapping图" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.mapping === 1">
              是
            </span>
            <span v-if="scope.row.mapping === 0">
              否
            </span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" width="150px" show-overflow-tooltip/>
        <el-table-column label="流程卡" align="center" width="150px" show-overflow-tooltip>
          <template slot-scope="scope">
            <a class="primarya" @click="handleReview(scope.row)"> {{ scope.row.flowCardName }}</a>
          </template>
        </el-table-column>
        <!-- <el-table-column label="重工流程卡" align="center" prop="againName" width="150px" show-overflow-tooltip/> -->
        <el-table-column fixed="right" label="状态" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isChecked" @change="setStatus(scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="150px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-edit"
              type="primary"
              @click="handleEdit(scope.row)"
            >修改</el-button>
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
      title="新增产品型号"
      width="1200px"
      @close="handleClose('machineForm')">
      <el-form ref="machineForm" :model="machineForm" :rules="rules" status-icon label-width="90px" label-position="right">
        <fieldset class="fieldest">
          <legend class="legendsty"> 基础信息 </legend>
          <el-row>
            <el-col :span="6">
              <el-form-item label="编码名称 ">
                <el-input v-model="machineForm.code" :disabled="true" size="small" placeholder="" type="text"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="光色 " prop="colors">
                <el-select v-model="machineForm.colors" size="small" placeholder="请选择" filterable @change="getNoAndCode">
                  <el-option
                    v-for="item in colorList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.code"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="投片型号 " prop="tpmodel">
                <el-select v-model="machineForm.tpmodel" size="small" placeholder="请选择" filterable @change="getNoAndCode">
                  <el-option
                    v-for="item in modelList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.code"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="工艺代码 " prop="craft">
                <el-select v-model="machineForm.craft" size="small" placeholder="请选择" filterable @change="getNoAndCode">
                  <el-option
                    v-for="item in gyList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.code"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="电极代码 " prop="electrodes">
                <el-select v-model="machineForm.electrodes" size="small" placeholder="请选择" filterable @change="getNoAndCode">
                  <el-option
                    v-for="item in electrodeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="入库形式 " prop="shape">
                <el-select v-model="machineForm.shape" size="small" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in typeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="芯片型号 ">
                <el-input v-model="machineForm.model" placeholder="请输入" size="small" type="text" maxlength="10"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="芯片尺寸 ">
                <el-input v-model="machineForm.measure" placeholder="请输入" size="small" type="text" maxlength="10"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-bottom:-15px">
            <el-col :span="6">
              <el-form-item label="电极 " prop="electrode">
                <el-input v-model="machineForm.electrode" placeholder="请输入电极" size="small" type="text" maxlength="3"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="流程卡 ">
                <el-select v-model="machineForm.flowcardId" :disabled="true" size="small" placeholder="请选择">
                  <el-option
                    v-for="item in cardList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="6">
              <el-form-item label="重工流程卡 " label-width="100px" prop="againId">
                <el-select v-model="machineForm.againId" size="small" placeholder="请选择">
                  <el-option
                    v-for="item in againcardList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
            </el-col> -->
          </el-row>
        </fieldset>
        <fieldset class="fieldest" style="margin-top:15px">
          <legend class="legendsty"> 芯片前段 </legend>
          <el-row>
            <el-col :span="6">
              <el-form-item label="切割道 " prop="cuttingWay">
                <el-input v-model="machineForm.cuttingWay" placeholder="请输入切割道" size="small" type="text" maxlength="3"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="芯片外观 ">
                <el-upload
                  ref="upload"
                  :auto-upload="true"
                  :on-success="onSuccess"
                  :on-error="onError"
                  :action="fileUrl"
                  :show-file-list="false"
                  :before-upload="beforeUpload"
                  :data="uploadParams"
                  :with-credentials="true"
                  style="float: left; margin-right: 15px"
                  accept=".png,.jpg,.PNG,.JPG"
                  class="upload-demo"
                >
                  <el-button v-loading="loading" v-if="machineForm.url === ''" slot="trigger" size="mini" type="primary"><svg-icon icon-class="shangchuan"/>  上传</el-button>
                  <img v-if="machineForm.url !== ''" :src="machineForm.url" style="width: 100%">
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="标准产出 " prop="standardOutput">
                <el-input v-model="machineForm.standardOutput" placeholder="请输入标准产出" size="small" type="text" maxlength="6"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="外延规格 ">
                <el-select v-model="machineForm.specification" size="small" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in wyggList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-bottom:-15px">
            <el-col :span="6">
              <el-form-item label="背镀 ">
                <el-select v-model="machineForm.backPlating" size="small" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in backPlatingList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="芯片工艺 ">
                <el-select v-model="machineForm.chipCraftId" size="small" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in scChipCraftLists"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="蒸镀电极 " prop="electrodeCraft">
                <el-input v-model="machineForm.electrodeCraft" placeholder="请输入" size="small" type="text" maxlength="10"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="研磨厚度 " prop="grindPly">
                <el-input v-model="machineForm.grindPly" placeholder="请输入" size="small" type="text" maxlength="8"/>
              </el-form-item>
            </el-col>
          </el-row>
        </fieldset>
        <fieldset class="fieldest" style="margin-top:15px">
          <legend class="legendsty"> 芯片后段 </legend>
          <el-row>
            <el-col :span="6">
              <el-form-item label="切割工艺 ">
                <el-select v-model="machineForm.cuttingCraftId" size="small" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in scCuttingCraftLists"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="COW测试条件 " prop="cowTest" label-width="120px">
                <el-input v-model="machineForm.cowTest" placeholder="请输入" size="small" type="text" maxlength="3"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="COT电流测试条件 " prop="currentTest" label-width="140px">
                <el-input v-model="machineForm.currentTest" placeholder="请输入" size="small" type="text" maxlength="3"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="COT测试档 " label-width="100px">
                <el-input v-model="machineForm.cotTest" placeholder="请输入" size="small" type="text" maxlength="5"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="COT IR测试条件 " prop="cotIr" label-width="140px">
                <el-input v-model="machineForm.cotIr" placeholder="请输入" size="small" type="text" maxlength="10"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="COT亮度单位 " prop="ldunit" label-width="110px">
                <el-select v-model="machineForm.ldunit" size="small" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in ldunitList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="TAPNO ">
                <el-input v-model="machineForm.tapno" placeholder="请输入" size="small" type="text" maxlength="10"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-bottom:-15px">
            <el-col :span="12" style="padding-left: 15px;padding-top: 8px;">
              <el-checkbox v-model="machineForm.mapping" style="margin-right: 10px;font-weight:bold">mapping图</el-checkbox>
              <el-checkbox v-model="machineForm.cotEsd" style="margin-right: 10px;font-weight:bold">COT ESD全测</el-checkbox>
              <el-checkbox v-model="machineForm.visual" style="font-weight:bold">目检吸边</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注 " label-width="50px">
                <el-input v-model="machineForm.remark" placeholder="请输入" size="small" type="text" maxlength="50"/>
              </el-form-item>
            </el-col>
          </el-row>
        </fieldset>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitForm('machineForm')">确 定</el-button>
        <el-button size="small" @click="addDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="修改产品型号"
      width="1200px"
      @close="handleClose('machineForm')">
      <el-form ref="machineForm" :model="machineForm" :rules="rules" status-icon label-width="90px" label-position="right">
        <fieldset class="fieldest">
          <legend class="legendsty"> 基础信息 </legend>
          <el-row>
            <el-col :span="6">
              <el-form-item label="编码名称 ">
                <el-input v-model="machineForm.code" :disabled="true" size="small" placeholder="" type="text"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="光色 " prop="colors">
                <el-select v-model="machineForm.colors" :disabled="true" size="small" placeholder="请选择" @change="getNoAndCode">
                  <el-option
                    v-for="item in colorList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.code"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="投片型号 " prop="tpmodel">
                <el-select v-model="machineForm.tpmodel" :disabled="true" size="small" placeholder="请选择" @change="getNoAndCode">
                  <el-option
                    v-for="item in modelList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.code"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="工艺代码 " prop="craft">
                <el-select v-model="machineForm.craft" :disabled="true" size="small" placeholder="请选择" @change="getNoAndCode">
                  <el-option
                    v-for="item in gyList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.code"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="电极代码 " prop="electrodes">
                <el-select v-model="machineForm.electrodes" :disabled="true" size="small" placeholder="请选择" @change="getNoAndCode">
                  <el-option
                    v-for="item in electrodeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="入库形式 " prop="shape">
                <el-select v-model="machineForm.shape" size="small" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in typeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="芯片型号 ">
                <el-input v-model="machineForm.model" placeholder="请输入" size="small" type="text" maxlength="10"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="芯片尺寸 ">
                <el-input v-model="machineForm.measure" placeholder="请输入" size="small" type="text" maxlength="10"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-bottom:-15px">
            <el-col :span="6">
              <el-form-item label="电极 " prop="electrode">
                <el-input v-model="machineForm.electrode" placeholder="请输入电极" size="small" type="text" maxlength="3"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="流程卡 " prop="flowcardId">
                <!-- <el-select v-model="machineForm.flowcardId"  :disabled="true" size="small" placeholder="请选择">
                  <el-option
                    v-for="item in cardList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select> -->
                <el-input v-model="machineForm.flowCardName" :disabled="true" placeholder="请输入流程卡" size="small" type="text" maxlength="30"/>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="6">
              <el-form-item label="重工流程卡 " label-width="100px" prop="againId">
                <el-select v-model="machineForm.againId" size="small" placeholder="请选择">
                  <el-option
                    v-for="item in againcardList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
            </el-col> -->
          </el-row>
        </fieldset>
        <fieldset class="fieldest" style="margin-top:15px">
          <legend class="legendsty"> 芯片前段 </legend>
          <el-row>
            <el-col :span="6">
              <el-form-item label="切割道 " prop="cuttingWay">
                <el-input v-model="machineForm.cuttingWay" placeholder="请输入切割道" size="small" type="text" maxlength="3"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="芯片外观 ">
                <el-upload
                  ref="upload"
                  :auto-upload="true"
                  :on-success="onSuccess"
                  :on-error="onError"
                  :action="fileUrl"
                  :show-file-list="false"
                  :before-upload="beforeUpload"
                  :data="uploadParams"
                  :with-credentials="true"
                  style="float: left; margin-right: 15px"
                  accept=".png,.jpg,.PNG,.JPG"
                  class="upload-demo"
                >
                  <el-button v-loading="loading" v-if="machineForm.url === ''" slot="trigger" size="small" type="primary"><svg-icon icon-class="shangchuan"/>  上传</el-button>
                  <img v-if="machineForm.url !== ''" :src="machineForm.url" style="width: 100%">
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="标准产出 " prop="standardOutput">
                <el-input v-model="machineForm.standardOutput" placeholder="请输入标准产出" size="small" type="text" maxlength="6"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="外延规格 ">
                <el-select v-model="machineForm.specification" size="small" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in wyggList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-bottom:-15px">
            <el-col :span="6">
              <el-form-item label="背镀 ">
                <el-select v-model="machineForm.backPlating" size="small" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in backPlatingList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="芯片工艺 ">
                <el-select v-model="machineForm.chipCraftId" size="small" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in scChipCraftLists"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="蒸镀电极 " prop="electrodeCraft">
                <el-input v-model="machineForm.electrodeCraft" placeholder="请输入" size="small" type="text" maxlength="10"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="研磨厚度 " prop="grindPly">
                <el-input v-model="machineForm.grindPly" placeholder="请输入" size="small" type="text" maxlength="8"/>
              </el-form-item>
            </el-col>
          </el-row>
        </fieldset>
        <fieldset class="fieldest" style="margin-top:15px">
          <legend class="legendsty"> 芯片后段 </legend>
          <el-row>
            <el-col :span="6">
              <el-form-item label="切割工艺 ">
                <el-select v-model="machineForm.cuttingCraftId" size="small" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in scCuttingCraftLists"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="COW测试条件 " prop="cowTest" label-width="120px">
                <el-input v-model="machineForm.cowTest" placeholder="请输入" size="small" type="text" maxlength="3"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="COT电流测试条件 " prop="currentTest" label-width="140px">
                <el-input v-model="machineForm.currentTest" placeholder="请输入" size="small" type="text" maxlength="3"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="COT测试档 " label-width="100px">
                <el-input v-model="machineForm.cotTest" placeholder="请输入" size="small" type="text" maxlength="5"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="COT IR测试条件 " prop="cotIr" label-width="140px">
                <el-input v-model="machineForm.cotIr" placeholder="请输入" size="small" type="text" maxlength="10"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="COT亮度单位 " prop="ldunit" label-width="110px">
                <el-select v-model="machineForm.ldunit" size="small" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in ldunitList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="TAPNO ">
                <el-input v-model="machineForm.tapno" placeholder="请输入" size="small" type="text" maxlength="10"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-bottom:-15px">
            <el-col :span="12" style="padding-left: 15px;padding-top: 8px;">
              <el-checkbox v-model="machineForm.mapping" style="margin-right: 10px;font-weight:bold">mapping图</el-checkbox>
              <el-checkbox v-model="machineForm.cotEsd" style="margin-right: 10px;font-weight:bold">COT ESD全测</el-checkbox>
              <el-checkbox v-model="machineForm.visual" style="font-weight:bold">目检吸边</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注 " label-width="50px">
                <el-input v-model="machineForm.remark" placeholder="请输入" size="small" type="text" maxlength="50"/>
              </el-form-item>
            </el-col>
          </el-row>
        </fieldset>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitEditForm('machineForm')">确 定</el-button>
        <el-button size="small" @click="editDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="innerVisible"
      class="inner-dialog"
      width="1000px"
      top="8vh"
      title="查看流程卡">
      <div style="margin-bottom: 30px">
        <span class="option-items-dialog">
          <span class="option-title">流程卡编号： </span>
          <span v-text="crrentCode">12</span>
        </span>
        <span class="option-items-dialog" style="float: right;">
          <span class="option-title">流程卡类型： </span>
          <span v-if="currentCardType === 0" class="proceCardType">普通流程卡</span>
          <span v-if="currentCardType === 1" class="proceCardType">重工流程卡</span>
          <span v-if="currentCardType === 2" class="proceCardType">返工流程卡</span>
          <span v-if="currentCardType === 3" class="proceCardType">自定义流程卡</span>
        </span>
      </div>
      <div class="has-margin-top">
        <span class="option-items-dialog">
          <el-row>
            <el-col :span="8"><span class="option-title">流程卡名称： </span></el-col>
            <el-col :span="16"><div v-text="currentCardName">生产流程卡</div></el-col>
          </el-row>
        </span>
        <span class="option-items-dialog">
          <el-row>
            <el-col :span="8"><span class="option-title">备注： </span></el-col>
            <el-col :span="16"><div v-text="currentRemark">阿斯顿发射点</div></el-col>
          </el-row>
        </span>
      </div>
      <div class="has-margin-top">
        <span class="option-title">流程卡状态： </span>
        <span v-if="currentStatus === 0">启用</span>
        <span v-if="currentStatus === 1">禁用</span>
        <span v-if="currentStatus === 2">临时</span>
        <span class="option-items-dialog" style="margin-left: 163px">
          <el-row>
            <el-col :span="8"><span class="option-title">工艺分类： </span></el-col>
            <el-col :span="16"><div v-text="currentCraft">工艺1</div></el-col>
          </el-row>
        </span>
      </div>
      <div class="has-margin-top">
        <span class="option-title">对应型号： </span>
        <div class="select-type-box">
          <div v-for="(type,index) in currentModelList" :key="index"><div class="color-title" v-text="'【'+type.color+'】:'"/> <div class="model-box"><span v-for="name in type.modelName" :key="name" class="model-item" style="margin-left: 10px" v-text="name.split('#')[0]"/></div></div>
        </div>
      </div>
      <div class="has-margin-top">
        <span class="option-items-dialog">
          <span class="option-title">修改时间： </span>
          <span v-text="currentCreateTime">2019年11月22日14:12:11</span>
        </span>
        <span class="option-items-dialog">
          <span class="option-title">修改人： </span>
          <span v-text="currentCreator">操作员1</span>
        </span>
      </div>
      <div class="has-margin-top">
        <span class="option-items-dialog">
          <span class="option-title">修改时间： </span>
          <span v-text="currentUpdateTime">2019年11月22日14:12:11</span>
        </span>
        <span class="option-items-dialog">
          <span class="option-title">修改人： </span>
          <span v-text="currentModifier">操作员1</span>
        </span>
      </div>
      <div class="module-container" style="box-shadow: none;border:1px solid #e2e2e2;clear: both;margin-top: 10px">
        <div class="module-title">
          <div class="module-title-text">前段工序</div>
        </div>
        <div class="module-content classes-table">
          <el-table
            v-loading="listLoading"
            :data="dialogList"
            :class="(currentCardType === 1 || currentCardType === 2) ? 'abnormal-process-table' : ''"
            class="dialog-table"
            element-loading-text="拼命加载中"
            border
            fit>
            <el-table-column align="center" label="序号" width="50">
              <template slot-scope="scope">
                <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                  {{ scope.$index+1 }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="站点" align="center" prop="mandataryName">
              <template slot-scope="scope">
                <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                  <el-select v-model="scope.row.siteId" :disabled="true" placeholder="" size="small" style="width: 95%">
                    <el-option
                      v-for="item in forepartSiteOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"/>
                  </el-select>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="工序" align="center" prop="processName">
              <template slot-scope="scope">
                <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                  <div class="has-height" v-text="scope.row.processId"/>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="制造记录" align="center" prop="endTime" show-overflow-tooltip>
              <template slot-scope="scope">
                <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                  <div class="has-height" v-text="scope.row.remark"/>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="程序" align="center">
              <template slot-scope="scope">
                <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                  <el-select v-model="scope.row.programName" :disabled="true" placeholder="" size="small" style="width: 95%">
                    <el-option
                      v-for="item in scope.row.programOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"/>
                  </el-select>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="module-title">
          <div class="module-title-text">后段工序</div>
        </div>
        <div v-if="currentCardType === 2" style="font-size: 26px;margin: 15px">后段工序随原流程卡进行！</div>
        <div v-if="currentCardType !== 2" class="module-content">
          <el-table
            v-loading="listLoading"
            :data="dialogEndList"
            :class="(currentCardType === 1 || currentCardType === 2) ? 'abnormal-process-table' : ''"
            class="dialog-table"
            element-loading-text="拼命加载中"
            border
            fit>
            <el-table-column align="center" label="序号" width="50">
              <template slot-scope="scope">
                <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                  {{ scope.$index+1+ dialogList.length }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="站点" align="center" prop="mandataryName">
              <template slot-scope="scope">
                <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                  <el-select v-model="scope.row.siteId" :disabled="true" placeholder="" size="small" style="width: 95%">
                    <el-option
                      v-for="item in endSiteOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"/>
                  </el-select>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="工序" align="center" prop="processName">
              <template slot-scope="scope">
                <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                  <div v-text="scope.row.processId"/>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="制造记录" align="center" prop="endTime" show-overflow-tooltip>
              <template slot-scope="scope">
                <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                  <div v-text="scope.row.remark"/>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="程序" align="center">
              <template slot-scope="scope">
                <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                  <el-select v-model="scope.row.programName" :disabled="true" placeholder="" size="small" style="width: 95%">
                    <el-option
                      v-for="item in scope.row.programOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"/>
                  </el-select>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
.primarya{
  color:#009494;
  text-decoration:underline;
}
.proce-box{
  display: flex;
  flex-direction: row;
}
.proce-left{
  flex-grow: 1;
}
.proce-right{
  width: 200px;
  flex-shrink: 0;
}
.fieldest{
  border: 1px solid #DCDFE6;
  padding-bottom: 20px;
}
.legendsty{
  padding-left:8px;
  padding-right:8px;
  font-weight: bold;
}
.app-container {
  position: relative;
  height: calc(100vh - 207px);
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
.run-table ::-webkit-scrollbar {/*滚动条整体样式*/
  height: 10px !important;
}
/* .run-table>>>.el-table__body-wrapper tr{
  cursor: pointer;
} */
.option-items-dialog{
  display: inline-block;
  width: 280px;
}
.option-title{
  display: inline-block;
  width: 85px;
  text-align: right;
  font-weight: bold;
}
.proceCardType{
  font-size: 26px;
  vertical-align: sub;
  margin-bottom: 18px;
  color: #009494;
  font-weight: bold;
}
.select-type-box{
  margin-left: 85px;
  width: 888px;
}
.color-title{
  display: inline-block;
  width: 60px;
  margin: 2px 0;
  float: left;
  line-height: 20px;
}
.model-box{
  margin-left: 60px;
  line-height: 25px;
  word-wrap: break-word;
  overflow: hidden;
}
.model-item{
  float: left;
  margin-left: 10px;
}
.has-margin-top{
  margin-top: 15px;
}
.has-bancground{
  background: rgba(181, 184, 218, 0.84);
}
.dialog-table>>>.el-input.is-disabled .el-input__inner {
  background-color: transparent;
  border-color: transparent;
  color: #666;
  cursor: default;
  text-align: center;
}
.dialog-table>>>.el-input.is-disabled .el-input__icon{
  display: none;
}
.inner-dialog>>> .el-dialog__body {
  padding-bottom: 15px;
}
.broad-scrollbar-table>>>.el-table__fixed-right {
  height: calc(100vh - 298px) !important;
}
.broad-scrollbar-table>>>.el-table__fixed-body-wrapper {
  height: calc(100vh - 339px) !important;
}
.broad-scrollbar-table>>>.el-table__fixed {
  height: calc(100vh - 298px) !important;
}
/deep/.el-dialog__body {
  padding-top: 20px;
}
.fieldest>>> .el-form-item{
  margin-bottom: 12px;
}
.fieldest>>> .el-form-item__error {
  padding-top: 0;
}
</style>
