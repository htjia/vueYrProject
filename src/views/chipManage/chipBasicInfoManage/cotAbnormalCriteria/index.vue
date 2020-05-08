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
            <span class="input-title">启用状态 </span>
            <el-select v-model="isDisable" class="search-input" style="width:100px" size="small" placeholder="请选择" filterable clearable>
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
        <el-table-column label="判断点" align="center" prop="pointstr" width="250" show-overflow-tooltip/>
        <el-table-column label="外围范围" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            ({{ scope.row.axisx }},{{ scope.row.axisy }})
          </template>
        </el-table-column>
        <el-table-column label="VF1阈值最小值" align="center" prop="vf1l"/>
        <el-table-column label="VF1阈值最大值" align="center" prop="vf1h"/>
        <el-table-column label="IR阈值最小值" align="center" prop="irl"/>
        <el-table-column label="IR阈值最大值" align="center" prop="irh"/>
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
      <fieldset class="fieldest" style="width:100%">
        <legend class="legendsty"> 型号选择 </legend>
        <div class="input-item" style="margin-top: 0px;">
          <span class="input-title">型号 </span>
          <el-select v-model="setInfo.model" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in modelList"
              :key="item.id"
              :label="item.code"
              :value="item.code"/>
          </el-select>
        </div>
        <div class="input-item" style="margin-top: 0px;">
          <span class="input-title">光色 </span>
          <el-select v-model="setInfo.color" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in colorList"
              :key="item.id"
              :label="item.code"
              :value="item.code"/>
          </el-select>
        </div>
      </fieldset>
      <fieldset class="fieldest" style="margin-top:15px;width:100%">
        <legend class="legendsty"> 判断点坐标设置 </legend>
        <div>
          <div class="input-item" style="margin-top: 5px;">
            <span class="input-title1">判断点1（中心点） </span>
            (
            <el-input v-model="setInfo.x1" class="search-input xywidth" placeholder="x" size="small" maxlength="8" clearable/>
            ,
            <el-input v-model="setInfo.y1" class="search-input xywidth" placeholder="y" size="small" maxlength="8" clearable/>
            )
          </div>
          <div class="input-item" style="margin-top: 5px;">
            <span class="input-title1">判断点2</span>
            (
            <el-input v-model="setInfo.x2" class="search-input xywidth" placeholder="x" size="small" maxlength="8" clearable/>
            ,
            <el-input v-model="setInfo.y2" class="search-input xywidth" placeholder="y" size="small" maxlength="8" clearable/>
            )
          </div>
        </div>
        <div>
          <div class="input-item" style="margin-top: 5px;">
            <span class="input-title1">判断点3</span>
            (
            <el-input v-model="setInfo.x3" class="search-input xywidth" placeholder="x" size="small" maxlength="8" clearable/>
            ,
            <el-input v-model="setInfo.y3" class="search-input xywidth" placeholder="y" size="small" maxlength="8" clearable/>
            )
          </div>
          <div class="input-item">
            <span class="input-title1">判断点4</span>
            (
            <el-input v-model="setInfo.x4" class="search-input xywidth" placeholder="x" size="small" maxlength="8" clearable/>
            ,
            <el-input v-model="setInfo.y4" class="search-input xywidth" placeholder="y" size="small" maxlength="8" clearable/>
            )
          </div>
        </div>
        <div>
          <div class="input-item">
            <span class="input-title1">判断点5</span>
            (
            <el-input v-model="setInfo.x5" class="search-input xywidth" placeholder="x" size="small" maxlength="8" clearable/>
            ,
            <el-input v-model="setInfo.y5" class="search-input xywidth" placeholder="y" size="small" maxlength="8" clearable/>
            )
          </div>
        </div>
        <div class="rule-info">
          规则说明：系统根据此处设置的判断点进行判断，若判断点处的COT数据全部为空，则视为COT中心点正常；若判断点有一个有值，则视为COT中心异常。
        </div>
      </fieldset>
      <fieldset class="fieldest" style="margin-top:15px;width:100%">
        <legend class="legendsty"> 中心点外圈设置 </legend>
        <p>外圈范围</p>
        <div style="border: 1px solid #DCDFE6;height: 90px;">
          &nbsp;
          <div class="input-item">
            <span class="input-title1">外圈范围 </span>
            (
            <el-input v-model="setInfo.axisx" class="search-input xywidth" placeholder="x" size="small" maxlength="8" clearable/>
            ,
            <el-input v-model="setInfo.axisy" class="search-input xywidth" placeholder="y" size="small" maxlength="8" clearable/>
            )
          </div>
        </div>
        <div class="rule-info" style="margin-top: -30px">
          规则说明：若COT中心点正常，外圈范围指距离中心点外围范围内的点。例如外围范围设置为7*7，则需对中心点外围范围内的(7*7-1=48)个点进行监测。
        </div>
        <p>参数阈值</p>
        <div style="border: 1px solid #DCDFE6;height: 105px;">
          <div class="input-item1">
            <span class="input-title1">VF1阈值 </span>
            (
            <el-input v-model="setInfo.vf1l" class="search-input xywidth" placeholder="最小值" size="small" maxlength="3" clearable/>
            ,
            <el-input v-model="setInfo.vf1h" class="search-input xywidth" placeholder="最大值" size="small" maxlength="3" clearable/>
            )
          </div>
          <div class="input-item1">
            <span class="input-title1">IR阈值 </span>
            (
            <el-input v-model="setInfo.irl" class="search-input xywidth" placeholder="最小值" size="small" maxlength="3" clearable/>
            ,
            <el-input v-model="setInfo.irh" class="search-input xywidth" placeholder="最大值" size="small" maxlength="3" clearable/>
            )
          </div>
        </div>
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
      <fieldset class="fieldest" style="width:100%">
        <legend class="legendsty"> 型号选择 </legend>
        <div class="input-item" style="margin-top: 0px;">
          <span class="input-title">型号 </span>
          <el-select v-model="setInfo.model" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in modelList"
              :key="item.id"
              :label="item.code"
              :value="item.code"/>
          </el-select>
        </div>
        <div class="input-item" style="margin-top: 0px;">
          <span class="input-title">光色 </span>
          <el-select v-model="setInfo.color" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in colorList"
              :key="item.id"
              :label="item.code"
              :value="item.code"/>
          </el-select>
        </div>
      </fieldset>
      <fieldset class="fieldest" style="margin-top:15px;width:100%">
        <legend class="legendsty"> 判断点坐标设置 </legend>
        <div>
          <div class="input-item" style="margin-top: 5px;">
            <span class="input-title1">判断点1（中心点） </span>
            (
            <el-input v-model="setInfo.x1" class="search-input xywidth" placeholder="x" size="small" maxlength="8" clearable/>
            ,
            <el-input v-model="setInfo.y1" class="search-input xywidth" placeholder="y" size="small" maxlength="8" clearable/>
            )
          </div>
          <div class="input-item" style="margin-top: 5px;">
            <span class="input-title1">判断点2</span>
            (
            <el-input v-model="setInfo.x2" class="search-input xywidth" placeholder="x" size="small" maxlength="8" clearable/>
            ,
            <el-input v-model="setInfo.y2" class="search-input xywidth" placeholder="y" size="small" maxlength="8" clearable/>
            )
          </div>
        </div>
        <div>
          <div class="input-item" style="margin-top: 5px;">
            <span class="input-title1">判断点3</span>
            (
            <el-input v-model="setInfo.x3" class="search-input xywidth" placeholder="x" size="small" maxlength="8" clearable/>
            ,
            <el-input v-model="setInfo.y3" class="search-input xywidth" placeholder="y" size="small" maxlength="8" clearable/>
            )
          </div>
          <div class="input-item">
            <span class="input-title1">判断点4</span>
            (
            <el-input v-model="setInfo.x4" class="search-input xywidth" placeholder="x" size="small" maxlength="8" clearable/>
            ,
            <el-input v-model="setInfo.y4" class="search-input xywidth" placeholder="y" size="small" maxlength="8" clearable/>
            )
          </div>
        </div>
        <div>
          <div class="input-item">
            <span class="input-title1">判断点5</span>
            (
            <el-input v-model="setInfo.x5" class="search-input xywidth" placeholder="x" size="small" maxlength="8" clearable/>
            ,
            <el-input v-model="setInfo.y5" class="search-input xywidth" placeholder="y" size="small" maxlength="8" clearable/>
            )
          </div>
        </div>
        <div class="rule-info">
          规则说明：系统根据此处设置的判断点进行判断，若判断点处的COT数据全部为空，则视为COT中心点正常；若判断点有一个有值，则视为COT中心异常。
        </div>
      </fieldset>
      <fieldset class="fieldest" style="margin-top:15px;width:100%">
        <legend class="legendsty"> 中心点外圈设置 </legend>
        <p>外圈范围</p>
        <div style="border: 1px solid #DCDFE6;height: 90px;">
          &nbsp;
          <div class="input-item">
            <span class="input-title1">外圈范围 </span>
            (
            <el-input v-model="setInfo.axisx" class="search-input xywidth" placeholder="x" size="small" maxlength="8" clearable/>
            ,
            <el-input v-model="setInfo.axisy" class="search-input xywidth" placeholder="y" size="small" maxlength="8" clearable/>
            )
          </div>
        </div>
        <div class="rule-info" style="margin-top: -30px">
          规则说明：若COT中心点正常，外圈范围指距离中心点外围范围内的点。例如外围范围设置为7*7，则需对中心点外围范围内的(7*7-1=48)个点进行监测。
        </div>
        <p>参数阈值</p>
        <div style="border: 1px solid #DCDFE6;height: 105px;">
          <div class="input-item1">
            <span class="input-title1">VF1阈值 </span>
            (
            <el-input v-model="setInfo.vf1l" class="search-input xywidth" placeholder="最小值" size="small" maxlength="3" clearable/>
            ,
            <el-input v-model="setInfo.vf1h" class="search-input xywidth" placeholder="最大值" size="small" maxlength="3" clearable/>
            )
          </div>
          <div class="input-item1">
            <span class="input-title1">IR阈值 </span>
            (
            <el-input v-model="setInfo.irl" class="search-input xywidth" placeholder="最小值" size="small" maxlength="3" clearable/>
            ,
            <el-input v-model="setInfo.irh" class="search-input xywidth" placeholder="最大值" size="small" maxlength="3" clearable/>
            )
          </div>
        </div>
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
  .rule-info{
    width: 100%;
    text-align: center;
    float: left;
    margin-top: 15px;
  }
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
  .xywidth{
    width:80px
  }
</style>
