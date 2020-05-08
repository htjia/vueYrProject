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
            style="margin-top:15px;float:right"
            type="primary"
            @click="handleAdd"
          ><svg-icon icon-class="add"/> 新增</el-button>
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
        <el-table-column label="型号" align="center" prop="model"/>
        <el-table-column label="光色" align="center" prop="color"/>
        <el-table-column label="抽测方式" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.type===0">
              四抽一
            </span>
            <span v-if="scope.row.type===1">
              九抽一
            </span>
          </template>
        </el-table-column>
        <el-table-column label="中心标记点" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            ({{ scope.row.centerX }},{{ scope.row.centerY }})
          </template>
        </el-table-column>
        <el-table-column label="左标记点" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            ({{ scope.row.leftX }},{{ scope.row.leftY }})
          </template>
        </el-table-column>
        <el-table-column label="右标记点" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            ({{ scope.row.rightX }},{{ scope.row.rightY }})
          </template>
        </el-table-column>
        <el-table-column label="上标记点" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            ({{ scope.row.upX }},{{ scope.row.upY }})
          </template>
        </el-table-column>
        <el-table-column label="下标记点" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            ({{ scope.row.downX }},{{ scope.row.downY }})
          </template>
        </el-table-column>
        <el-table-column label="修改人" align="center" prop="creatorName"/>
        <el-table-column label="修改时间" align="center" prop="createTime" show-overflow-tooltip/>
        <el-table-column label="启用状态" align="center" prop="status" width="100px">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isChecked" @change="setStatus(scope.row)">启用</el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="status" width="150px">
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
      title="新增"
      width="1200px">
      <div class="input-item" style="margin-top: -15px;">
        <span class="input-title" style="width:35px">型号 </span>
        <el-select v-model="newModel" class="search-input" size="small" placeholder="请选择" filterable clearable>
          <el-option
            v-for="item in modelList"
            :key="item.id"
            :label="item.code"
            :value="item.code"/>
        </el-select>
      </div>
      <div class="input-item" style="margin-top: -15px;">
        <span class="input-title" style="width:35px">光色 </span>
        <el-select v-model="newColor" class="search-input" size="small" placeholder="请选择" filterable clearable>
          <el-option
            v-for="item in colorList"
            :key="item.id"
            :label="item.code"
            :value="item.code"/>
        </el-select>
      </div>
      <div class="input-item" style="margin-top: -15px;">
        <span class="input-title">抽测方式 </span>
        <el-select v-model="newType" class="search-input" size="small" placeholder="请选择" filterable clearable>
          <el-option
            v-for="item in typeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </div>
      <fieldset class="fieldest" style="margin-top: 35px;width:100%">
        <legend class="legendsty"> Wafer定位晶粒坐标设定 </legend>
        <el-table
          :data="newDataList"
          :span-method="arraySpanMethod"
          element-loading-text="拼命加载中"
          class="run-table ste tip-out-inner-dialog"
          border
          fit>
          <el-table-column align="center" label="中心标记点">
            <el-table-column align="center" label="X">
              <template slot-scope="scope">
                <el-input v-if="scope.$index === 0" v-model="scope.row.centerx" class="search-input" style="width:90%" placeholder="" size="small" maxlength="5" clearable/>
                <span v-if="scope.$index === 1">
                  <span v-if="newDataList[0].centerx.length>0 || newDataList[0].centery.length>0">
                    ( {{ newDataList[0].centerx }} , {{ newDataList[0].centery }} )
                  </span>
                </span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Y">
              <template slot-scope="scope">
                <el-input v-if="scope.$index === 0" v-model="scope.row.centery" class="search-input" style="width:90%" placeholder="" size="small" maxlength="5" clearable/>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="左标记点">
            <el-table-column align="center" label="X">
              <template slot-scope="scope">
                <el-input v-if="scope.$index === 0" v-model="scope.row.leftx" class="search-input" style="width:90%" placeholder="" size="small" maxlength="5" clearable/>
                <span v-if="scope.$index === 1">
                  <span v-if="newDataList[0].leftx.length>0 || newDataList[0].lefty.length>0">
                    ( {{ newDataList[0].leftx }} , {{ newDataList[0].lefty }} )
                  </span>
                </span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Y">
              <template slot-scope="scope">
                <el-input v-if="scope.$index === 0" v-model="scope.row.lefty" class="search-input" style="width:90%" placeholder="" size="small" maxlength="5" clearable/>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="右标记点">
            <el-table-column align="center" label="X">
              <template slot-scope="scope">
                <el-input v-if="scope.$index === 0" v-model="scope.row.rightx" class="search-input" style="width:90%" placeholder="" size="small" maxlength="5" clearable/>
                <span v-if="scope.$index === 1">
                  <span v-if="newDataList[0].rightx.length>0 || newDataList[0].righty.length>0">
                    ( {{ newDataList[0].rightx }} , {{ newDataList[0].righty }} )
                  </span>
                </span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Y">
              <template slot-scope="scope">
                <el-input v-if="scope.$index === 0" v-model="scope.row.righty" class="search-input" style="width:90%" placeholder="" size="small" maxlength="5" clearable/>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="上标记点">
            <el-table-column align="center" label="X">
              <template slot-scope="scope">
                <el-input v-if="scope.$index === 0" v-model="scope.row.topx" class="search-input" style="width:90%" placeholder="" size="small" maxlength="5" clearable/>
                <span v-if="scope.$index === 1">
                  <span v-if="newDataList[0].topx.length>0 || newDataList[0].topy.length>0">
                    ( {{ newDataList[0].topx }} , {{ newDataList[0].topy }} )
                  </span>
                </span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Y">
              <template slot-scope="scope">
                <el-input v-if="scope.$index === 0" v-model="scope.row.topy" class="search-input" style="width:90%" placeholder="" size="small" maxlength="5" clearable/>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="下标记点">
            <el-table-column align="center" label="X">
              <template slot-scope="scope">
                <el-input v-if="scope.$index === 0" v-model="scope.row.downx" class="search-input" style="width:90%" placeholder="" size="small" maxlength="5" clearable/>
                <span v-if="scope.$index === 1">
                  <span v-if="newDataList[0].downx.length>0 || newDataList[0].downy.length>0">
                    ( {{ newDataList[0].downx }} , {{ newDataList[0].downy }} )
                  </span>
                </span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Y">
              <template slot-scope="scope">
                <el-input v-if="scope.$index === 0" v-model="scope.row.downy" class="search-input" style="width:90%" placeholder="" size="small" maxlength="5" clearable/>
              </template>
            </el-table-column>
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
      <div class="input-item" style="margin-top: -15px;">
        <span class="input-title" style="width:35px">型号 </span>
        <el-select v-model="newModel" class="search-input" size="small" placeholder="请选择" filterable clearable>
          <el-option
            v-for="item in modelList"
            :key="item.id"
            :label="item.code"
            :value="item.code"/>
        </el-select>
      </div>
      <div class="input-item" style="margin-top: -15px;">
        <span class="input-title" style="width:35px">光色 </span>
        <el-select v-model="newColor" class="search-input" size="small" placeholder="请选择" filterable clearable>
          <el-option
            v-for="item in colorList"
            :key="item.id"
            :label="item.code"
            :value="item.code"/>
        </el-select>
      </div>
      <div class="input-item" style="margin-top: -15px;">
        <span class="input-title">抽测方式 </span>
        <el-select v-model="newType" class="search-input" size="small" placeholder="请选择" filterable clearable>
          <el-option
            v-for="item in typeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </div>
      <fieldset class="fieldest" style="margin-top: 35px;width:100%">
        <legend class="legendsty"> Wafer定位晶粒坐标设定 </legend>
        <el-table
          :data="newDataList"
          :span-method="arraySpanMethod"
          element-loading-text="拼命加载中"
          class="run-table ste tip-out-inner-dialog"
          border
          fit>
          <el-table-column align="center" label="中心标记点">
            <el-table-column align="center" label="X">
              <template slot-scope="scope">
                <el-input v-if="scope.$index === 0" v-model="scope.row.centerx" class="search-input" style="width:90%" placeholder="" size="small" maxlength="5" clearable/>
                <span v-if="scope.$index === 1">
                  <span v-if="newDataList[0].centerx.length>0 || newDataList[0].centery.length>0">
                    ( {{ newDataList[0].centerx }} , {{ newDataList[0].centery }} )
                  </span>
                </span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Y">
              <template slot-scope="scope">
                <el-input v-if="scope.$index === 0" v-model="scope.row.centery" class="search-input" style="width:90%" placeholder="" size="small" maxlength="5" clearable/>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="左标记点">
            <el-table-column align="center" label="X">
              <template slot-scope="scope">
                <el-input v-if="scope.$index === 0" v-model="scope.row.leftx" class="search-input" style="width:90%" placeholder="" size="small" maxlength="5" clearable/>
                <span v-if="scope.$index === 1">
                  <span v-if="newDataList[0].leftx.length>0 || newDataList[0].lefty.length>0">
                    ( {{ newDataList[0].leftx }} , {{ newDataList[0].lefty }} )
                  </span>
                </span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Y">
              <template slot-scope="scope">
                <el-input v-if="scope.$index === 0" v-model="scope.row.lefty" class="search-input" style="width:90%" placeholder="" size="small" maxlength="5" clearable/>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="右标记点">
            <el-table-column align="center" label="X">
              <template slot-scope="scope">
                <el-input v-if="scope.$index === 0" v-model="scope.row.rightx" class="search-input" style="width:90%" placeholder="" size="small" maxlength="5" clearable/>
                <span v-if="scope.$index === 1">
                  <span v-if="newDataList[0].rightx.length>0 || newDataList[0].righty.length>0">
                    ( {{ newDataList[0].rightx }} , {{ newDataList[0].righty }} )
                  </span>
                </span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Y">
              <template slot-scope="scope">
                <el-input v-if="scope.$index === 0" v-model="scope.row.righty" class="search-input" style="width:90%" placeholder="" size="small" maxlength="5" clearable/>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="上标记点">
            <el-table-column align="center" label="X">
              <template slot-scope="scope">
                <el-input v-if="scope.$index === 0" v-model="scope.row.topx" class="search-input" style="width:90%" placeholder="" size="small" maxlength="5" clearable/>
                <span v-if="scope.$index === 1">
                  <span v-if="newDataList[0].topx.length>0 || newDataList[0].topy.length>0">
                    ( {{ newDataList[0].topx }} , {{ newDataList[0].topy }} )
                  </span>
                </span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Y">
              <template slot-scope="scope">
                <el-input v-if="scope.$index === 0" v-model="scope.row.topy" class="search-input" style="width:90%" placeholder="" size="small" maxlength="5" clearable/>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="下标记点">
            <el-table-column align="center" label="X">
              <template slot-scope="scope">
                <el-input v-if="scope.$index === 0" v-model="scope.row.downx" class="search-input" style="width:90%" placeholder="" size="small" maxlength="5" clearable/>
                <span v-if="scope.$index === 1">
                  <span v-if="newDataList[0].downx.length>0 || newDataList[0].downy.length>0">
                    ( {{ newDataList[0].downx }} , {{ newDataList[0].downy }} )
                  </span>
                </span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Y">
              <template slot-scope="scope">
                <el-input v-if="scope.$index === 0" v-model="scope.row.downy" class="search-input" style="width:90%" placeholder="" size="small" maxlength="5" clearable/>
              </template>
            </el-table-column>
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
    height: calc(100vh - 203px);
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
  .search-input{
    width: 125px;
  }
</style>
