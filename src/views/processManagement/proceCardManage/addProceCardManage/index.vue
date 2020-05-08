<template>
  <PageHeaderLayout :has_back="true">
    <div class="header-search-add" style="height: auto; position: relative;">
      <div class="proce-box">
        <div class="proce-left">
          <div class="option-items" style="line-height: 30px">
            <span class="option-title">流程卡序号 </span>
            <span v-text="addIndex">12</span>
          </div>
          <div class="option-items">
            <span class="option-title">流程卡编号 </span>
            <el-input v-model="proceCardForm.code" type="text" size="small" placeholder="请输入流程卡编号" onkeyup="value=value.replace(/[\u4e00-\u9fa5]/ig,'')" class="proce-input" maxlength="10"/>
          </div>
          <div class="option-items">
            <span class="option-title">流程卡名称 </span>
            <el-input v-model="proceCardForm.proceCardName" type="text" size="small" placeholder="请输入流程卡名称" class="proce-input" maxlength="20"/>
          </div>
          <div class="option-items">
            <span class="option-title">流程卡类型 </span>
            <el-select v-model="proceCardForm.proceCardType" size="small" placeholder="请选择流程卡类型" class="proce-input" filterable>
              <el-option
                v-for="item in proceCardTypeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="option-items">
            <span class="option-title">工艺分类 </span>
            <el-select v-model="proceCardForm.craftType" size="small" placeholder="请选择工艺类型" class="proce-input" filterable @change="craftTypeChange">
              <el-option
                v-for="item in craftOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="option-items">
            <span class="option-title">流程卡状态 </span>
            <el-select v-model="proceCardForm.runType" size="small" placeholder="请选择状态" class="proce-input" filterable>
              <el-option
                v-for="item in statusOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="option-items">
            <span class="option-title">备注 </span>
            <el-input v-model="proceCardForm.remark" type="text" size="small" placeholder="请输入备注" class="proce-input" maxlength="20"/>
          </div>
        </div>
        <div class="proce-right">
          <div v-if="proceCardForm.proceCardType === 0" class="proceCardType">普通流程卡</div>
          <div v-if="proceCardForm.proceCardType === 1" class="proceCardType">重工流程卡</div>
          <div v-if="proceCardForm.proceCardType === 2" class="proceCardType">返工流程卡</div>
          <div v-if="proceCardForm.proceCardType === 3" class="proceCardType">自定义流程卡</div>
          <el-button
            type="primary"
            @click="handleCopyCard"><svg-icon icon-class="copy"/> 复制流程卡</el-button>
        </div>
      </div>
      <div style="margin: 5px 0">
        <div v-if="proceCardForm.proceCardType === 0" class="option-title" style="float: left;">对应型号 </div>
        <div class="selectTypeBoxOut">
          <el-button
            v-if="proceCardForm.proceCardType === 0"
            type="primary"
            size="mini"
            style="margin-left: 4px;margin-bottom: 0px; margin-top: -5px"
            @click="handleSelectType"><svg-icon icon-class="select"/> 点击选择</el-button>
          <div v-if="!isEdited && proceCardForm.proceCardType === 0">
            <div v-for="item in modelList" :key="item.color"><div class="color-title" v-text="'【'+item.color+'】:'"/><div class="model-box"><div v-for="model in item.modelName" :key="model" class="model-item" v-text="model.split('#')[0]"/></div></div>
          </div>
          <div v-if="isEdited && proceCardForm.proceCardType === 0" style="margin-top: 10px;margin-bottom: -5px">
            <div v-if="outModel1.length !== 0 && colorList.length > 0"><div class="color-title" v-text="'【'+colorList[0].color+'】:'"/><div class="model-box"><span v-for="type in outModel1" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
            <div v-if="outModel2.length !== 0 && colorList.length > 1"><div class="color-title" v-text="'【'+colorList[1].color+'】:'"/><div class="model-box"><span v-for="type in outModel2" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
            <div v-if="outModel3.length !== 0 && colorList.length > 2"><div class="color-title" v-text="'【'+colorList[2].color+'】:'"/><div class="model-box"><span v-for="type in outModel3" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
            <div v-if="outModel4.length !== 0 && colorList.length > 3"><div class="color-title" v-text="'【'+colorList[3].color+'】:'"/><div class="model-box"><span v-for="type in outModel4" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
            <div v-if="outModel5.length !== 0 && colorList.length > 4"><div class="color-title" v-text="'【'+colorList[4].color+'】:'"/><div class="model-box"><span v-for="type in outModel5" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
            <div v-if="outModel6.length !== 0 && colorList.length > 5"><div class="color-title" v-text="'【'+colorList[5].color+'】:'"/><div class="model-box"><span v-for="type in outModel6" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
            <div v-if="outModel7.length !== 0 && colorList.length > 6"><div class="color-title" v-text="'【'+colorList[6].color+'】:'"/><div class="model-box"><span v-for="type in outModel7" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
            <div v-if="outModel8.length !== 0 && colorList.length > 7"><div class="color-title" v-text="'【'+colorList[7].color+'】:'"/><div class="model-box"><span v-for="type in outModel8" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
            <div v-if="outModel9.length !== 0 && colorList.length > 8"><div class="color-title" v-text="'【'+colorList[8].color+'】:'"/><div class="model-box"><span v-for="type in outModel9" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
            <div v-if="outModel10.length !== 0 && colorList.length > 9"><div class="color-title" v-text="'【'+colorList[9].color+'】:'"/><div class="model-box"><span v-for="type in outModel10" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
            <div v-if="outModel11.length !== 0 && colorList.length > 10"><div class="color-title" v-text="'【'+colorList[10].color+'】:'"/><div class="model-box"><span v-for="type in outModel11" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
            <div v-if="outModel12.length !== 0 && colorList.length > 11"><div class="color-title" v-text="'【'+colorList[11].color+'】:'"/><div class="model-box"><span v-for="type in outModel12" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
            <div v-if="outModel13.length !== 0 && colorList.length > 12"><div class="color-title" v-text="'【'+colorList[12].color+'】:'"/><div class="model-box"><span v-for="type in outModel13" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
            <div v-if="outModel14.length !== 0 && colorList.length > 13"><div class="color-title" v-text="'【'+colorList[13].color+'】:'"/><div class="model-box"><span v-for="type in outModel14" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
            <div v-if="outModel15.length !== 0 && colorList.length > 14"><div class="color-title" v-text="'【'+colorList[14].color+'】:'"/><div class="model-box"><span v-for="type in outModel15" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
            <div v-if="outModel16.length !== 0 && colorList.length > 15"><div class="color-title" v-text="'【'+colorList[15].color+'】:'"/><div class="model-box"><span v-for="type in outModel16" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
            <div v-if="outModel17.length !== 0 && colorList.length > 16"><div class="color-title" v-text="'【'+colorList[16].color+'】:'"/><div class="model-box"><span v-for="type in outModel17" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
            <div v-if="outModel18.length !== 0 && colorList.length > 17"><div class="color-title" v-text="'【'+colorList[17].color+'】:'"/><div class="model-box"><span v-for="type in outModel18" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
            <div v-if="outModel19.length !== 0 && colorList.length > 18"><div class="color-title" v-text="'【'+colorList[18].color+'】:'"/><div class="model-box"><span v-for="type in outModel19" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
            <div v-if="outModel20.length !== 0 && colorList.length > 19"><div class="color-title" v-text="'【'+colorList[19].color+'】:'"/><div class="model-box"><span v-for="type in outModel20" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
          </div>
        </div>
      </div>
      <div v-if="edit" style="height: 40px;">
        <div class="option-items" style="line-height: 40px">
          <span class="option-title">修改时间： </span>
          <span v-text="createTime">修改时间</span>
        </div>
        <div class="option-items" style="line-height: 40px;width: 325px;">
          <span class="option-title">修改人： </span>
          <span v-text="creator">修改人</span>
        </div>
      </div>
      <div v-if="edit" style="height: 30px;">
        <div class="option-items" style="line-height: 35px;">
          <span class="option-title" style="width: 110px;">上次修改时间： </span>
          <span v-text="lastUpdateTime">上次修改时间</span>
        </div>
        <div class="option-items" style="line-height: 35px;width: 220px">
          <span class="option-title">修改人： </span>
          <span v-text="modifier">修改人</span>
        </div>
        <el-button
          type="primary"
          size="mini"
          style="margin-left: 4px;margin-bottom: 0px;"
          @click="viewHistoricalVersion"><svg-icon icon-class="history"/> 查看历史版本</el-button>
      </div>
    </div>
    <div class="module-container" style="padding-bottom: 20px">
      <div class="module-title">
        <div class="module-title-text">前段工序</div>
      </div>
      <div class="module-content classes-table">
        <el-table
          v-loading="listLoading"
          :data="list"
          :class="(proceCardForm.proceCardType === 1 || proceCardForm.proceCardType === 2) ? 'abnormal-process-table' : ''"
          class="process-card-table"
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
                <el-select v-model="scope.row.siteId" placeholder="请选择站点" size="small" style="width: 95%" filterable @change="siteChange(scope.row)">
                  <el-option
                    v-for="item in forepartSiteOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="工序" align="center" prop="consignorName">
            <template slot-scope="scope">
              <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                <el-select v-model="scope.row.processId" placeholder="请选择工序" size="small" style="width: 95%" filterable @change="proceChange(scope.row, 1)">
                  <el-option
                    v-for="item in scope.row.proceOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="制造记录" align="center" prop="endTime">
            <template slot-scope="scope">
              <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                <el-input v-model="scope.row.remark" type="text" size="small" style="width: 95%" maxlength="20"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="程序" align="center">
            <template slot-scope="scope">
              <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                <el-select v-model="scope.row.programId" placeholder="请选择程序" size="small" style="width: 95%" filterable>
                  <el-option
                    v-for="item in scope.row.programOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="460px">
            <template slot-scope="scope">
              <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                <el-button
                  type="primary"
                  size="mini"
                  @click="handleInsert(scope.row, scope.$index, 1)"
                ><svg-icon icon-class="insert"/> 插入</el-button>
                <el-button
                  size="mini"
                  @click="handleUp(scope.row, scope.$index, 1)"
                ><svg-icon icon-class="moveUp"/> 上移</el-button>
                <el-button
                  size="mini"
                  @click="handleDown(list, scope.$index, 1)"
                ><svg-icon icon-class="moveDown"/> 下移</el-button>
                <el-button
                  size="mini"
                  class="identifying"
                  @click="handleStar(scope.row)"
                ><svg-icon icon-class="biaoshi"/> 标识</el-button>
                <el-button
                  size="mini"
                  icon="el-icon-delete"
                  type="danger"
                  @click="handleDelete(scope.$index, 1)"
                >删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          class="handle-bush"
          type="primary"
          size="small"
          circle
          @click="handlePush(1)"
        ><svg-icon icon-class="add"/></el-button>
      </div>
      <div class="module-title">
        <div class="module-title-text">后段工序</div>
      </div>
      <div v-if="proceCardForm.proceCardType === 2" style="font-size: 26px;margin: 15px;color:#009494">后段工序随原流程卡进行！</div>
      <div v-if="proceCardForm.proceCardType !== 2" class="module-content" style="padding-bottom: 50px">
        <el-table
          v-loading="listLoading"
          :data="endList"
          :class="(proceCardForm.proceCardType === 1 || proceCardForm.proceCardType === 2) ? 'abnormal-process-table' : ''"
          class="process-card-table"
          element-loading-text="拼命加载中"
          border
          fit>
          <el-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                {{ scope.$index+1+ list.length }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="站点" align="center" prop="mandataryName">
            <template slot-scope="scope">
              <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                <el-select v-model="scope.row.siteId" placeholder="请选择站点" size="small" style="width: 95%" filterable @change="siteChange(scope.row)">
                  <el-option
                    v-for="item in endSiteOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="工序" align="center" prop="consignorName">
            <template slot-scope="scope">
              <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                <el-select v-model="scope.row.processId" placeholder="请选择工序" size="small" style="width: 95%" filterable @change="proceChange(scope.row, 2)">
                  <el-option
                    v-for="item in scope.row.proceOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="制造记录" align="center" prop="endTime">
            <template slot-scope="scope">
              <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                <el-input v-model="scope.row.remark" type="text" size="small" style="width: 95%" maxlength="20"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="程序" align="center">
            <template slot-scope="scope">
              <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                <el-select v-model="scope.row.programId" placeholder="请选择程序" size="small" style="width: 95%" filterable>
                  <el-option
                    v-for="item in scope.row.programOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="460px">
            <template slot-scope="scope">
              <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
                <el-button
                  type="primary"
                  size="mini"
                  @click="handleInsert(scope.row, scope.$index)"
                ><svg-icon icon-class="insert"/> 插入</el-button>
                <el-button
                  size="mini"
                  @click="handleUp(scope.row, scope.$index)"
                ><svg-icon icon-class="moveUp"/> 上移</el-button>
                <el-button
                  size="mini"
                  @click="handleDown(endList, scope.$index)"
                ><svg-icon icon-class="moveDown"/> 下移</el-button>
                <el-button
                  size="mini"
                  class="identifying"
                  @click="handleStar(scope.row)"
                ><svg-icon icon-class="biaoshi"/> 标识</el-button>
                <el-button
                  size="mini"
                  icon="el-icon-delete"
                  type="danger"
                  @click="handleDelete(scope.$index)"
                >删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          class="end-bush"
          type="primary"
          size="small"
          circle
          @click="handlePush(2)"
        ><svg-icon icon-class="add"/></el-button>
      </div>
      <div class="cut-line"/>
      <div class="submit-btn-group">
        <el-button type="primary" @click="submitProseCard">确 定</el-button>
        <el-button @click="cancelProseCard">取 消</el-button>
      </div>
    </div>
    <!--历史版本-->
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="historyDialogVisible"
      title="历史版本"
      width="750px"
      class="model-dialog"
    >
      <el-table
        v-loading="listLoading"
        :data="historyList"
        row-key="id"
        element-loading-text="拼命加载中"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="修改日期" align="center" prop="lastUpdateTime"/>
        <el-table-column label="修改人" align="center" prop="modifier"/>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-edit"
              @click="handleReviewHistory(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="hisTotalPage > 10"
        :total="hisTotalPage"
        :page-size="10"
        :current-page="hisPageNum"
        style="text-align: right;margin: 15px 0 0"
        layout="prev, pager, next"
        @current-change="hisPageChanges"/>
      <el-dialog
        v-drag
        :close-on-click-modal="false"
        :visible.sync="innerVisible"
        class="inner-dialog"
        width="1000px"
        top="8vh"
        title="查看流程卡"
        append-to-body>
        <div style="margin-bottom: 10px;margin-top: -20px;">
          <span class="option-items-dialog">
            <span class="option-title" style="padding-top: 15px;">流程卡编号： </span>
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
        <div class="module-container" style="box-shadow: none;border:1px solid #e2e2e2;clear: both;margin-top: 10px;padding: 15px">
          <el-row style="border-bottom:1px solid #e2e2e2;padding-bottom:10px">
            <el-col :span="2"><span class="option-title">流程卡名称： </span></el-col>
            <el-col :span="9"><div style="padding-left:10px" v-text="currentCardName">生产流程卡</div></el-col>
            <el-col :span="5">
              <span class="option-title">流程卡状态： </span>
              <span v-if="currentStatus === 0">启用</span>
              <span v-if="currentStatus === 1">禁用</span>
              <span v-if="currentStatus === 2">临时</span>
            </el-col>
            <el-col :span="3">
              <span class="option-title">工艺分类： </span>{{ currentCraft }}
            </el-col>
          </el-row>
          <el-row style="border-bottom:1px solid #e2e2e2;padding-bottom:10px;margin-top:15px">
            <span class="option-title" style="text-align:left">对应型号： </span>
            <div class="select-type-box" style="padding-left: 25px">
              <div v-for="type in currentModelList" :key="type"><div class="color-title" v-text="'【'+type.color+'】:'"/> <div class="model-box"><span v-for="name in type.modelName" :key="name" class="model-item" style="margin-left: 10px" v-text="name.split('#')[0]"/></div></div>
            </div>
          </el-row>
          <el-row style="margin-top:15px">
            <el-col :span="6">
              <span class="option-items-dialog" style="width:100%">
                <span class="option-title" style="width:75px">创建时间： </span>
                <span v-text="currentCreateTime">2019年11月22日14:12:11</span>
              </span>
            </el-col>
            <el-col :span="6">
              <span class="option-items-dialog" style="width:100%">
                <span class="option-title" style="width:75px">创建人： </span>
                <span v-text="currentCreator">2019年11月22日14:12:11</span>
              </span>
            </el-col>
            <el-col :span="6">
              <span class="option-items-dialog" style="width:100%">
                <span class="option-title" style="width:75px">修改时间： </span>
                <span v-text="currentCreateTime">2019年11月22日14:12:11</span>
              </span>
            </el-col>
            <el-col :span="6">
              <span class="option-items-dialog" style="width:100%">
                <span class="option-title" style="width:75px">修改人： </span>
                <span v-text="currentUpdateTime">2019年11月22日14:12:11</span>
              </span>
            </el-col>
          </el-row>
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
    </el-dialog>
    <!--复制流程卡-->
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="copyDialogVisible"
      class="copyDialog"
      top="80px"
      title="复制流程卡"
      width="1300px"
    >
      <!--<div class="tab-control">
        <span
          :class="{activeTab: activeTabIndex === ''}"
          @click="tabClick('')"
        >工艺流程卡</span>
        <span
          :class="{activeTab: activeTabIndex === 1}"
          class="has-margin-left"
          @click="tabClick(1)"
        >重工流程卡</span>
        <span
          :class="{activeTab: activeTabIndex === 2}"
          class="has-margin-left"
          @click="tabClick(2)"
        >返工流程卡</span>
      </div>-->
      <el-table
        v-loading="listLoading"
        :data="copyList"
        max-height="600"
        element-loading-text="拼命加载中"
        border
        fit
      >
        <el-table-column align="center" label="序号" min-width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="流程卡名称" align="center" prop="name" min-width="150" show-overflow-tooltip/>
        <el-table-column label="工艺分类" align="center" prop="craftName" min-width="120"/>
        <el-table-column label="状态" align="center" prop="mandataryName" min-width="60">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0" style="color:#009494;font-weight: bold ">启用</span>
            <span v-if="scope.row.status === 1" style="color:#f33;font-weight: bold ">停用</span>
            <span v-if="scope.row.status === 2" style="font-weight: bold ">临时</span>
          </template>
        </el-table-column>
        <el-table-column label="修改时间" align="center" prop="createTime" min-width="150"/>
        <el-table-column label="修改人" align="center" prop="creator" min-width="110"/>
        <el-table-column label="上次修改时间" align="center" prop="lastUpdateTime" min-width="150"/>
        <el-table-column label="修改人" align="center" prop="modifier" min-width="110"/>
        <el-table-column label="备注" align="center" prop="remark" min-width="150" show-overflow-tooltip/>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-search"
              @click="handleReview(scope.row, scope.$index)"
            >查看</el-button>
            <el-button
              size="mini"
              icon="el-icon-document"
              @click="handleCopy(scope.row, scope.$index)"
            >复制</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        v-drag
        :close-on-click-modal="false"
        :visible.sync="innerVisible"
        class="inner-dialog"
        width="1000px"
        top="8vh"
        title="查看流程卡"
        append-to-body>
        <div style="margin-bottom: 10px;margin-top: -10px;">
          <span class="option-items-dialog">
            <span class="option-title" style="padding-top: 15px;">流程卡编号： </span>
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
        <div class="module-container" style="box-shadow: none;border:1px solid #e2e2e2;clear: both;margin-top: 10px;padding: 15px">
          <el-row style="border-bottom:1px solid #e2e2e2;padding-bottom:0px">
            <el-col :span="2"><span class="option-title">流程卡名称： </span></el-col>
            <el-col :span="9"><div style="padding-left:10px" v-text="currentCardName">生产流程卡</div></el-col>
            <el-col :span="5">
              <span class="option-title">流程卡状态： </span>
              <span v-if="currentStatus === 0">启用</span>
              <span v-if="currentStatus === 1">禁用</span>
              <span v-if="currentStatus === 2">临时</span>
            </el-col>
            <el-col :span="3">
              <span class="option-title">工艺分类： </span>{{ currentCraft }}
            </el-col>
            <el-col :span="5" style="padding-top: 25px">
              <el-button
                class="copyBtn"
                size="small"
                type="primary"
                icon="el-icon-document"
                @click="handleInCopy"
              >复制</el-button>
            </el-col>
          </el-row>
          <el-row style="border-bottom:1px solid #e2e2e2;padding-bottom:10px;margin-top:15px">
            <span class="option-title" style="text-align:left">对应型号： </span>
            <div class="select-type-box" style="padding-left: 35px">
              <div v-for="type in currentModelList" :key="type"><div class="color-title" v-text="'【'+type.color+'】:'"/> <div class="model-box"><span v-for="name in type.modelName" :key="name" class="model-item" style="margin-left: 10px" v-text="name.split('#')[0]"/></div></div>
            </div>
          </el-row>
          <el-row style="margin-top:15px">
            <el-col :span="6">
              <span class="option-items-dialog" style="width:100%">
                <span class="option-title" style="width:75px">创建时间： </span>
                <span v-text="currentCreateTime">2019年11月22日14:12:11</span>
              </span>
            </el-col>
            <el-col :span="6">
              <span class="option-items-dialog" style="width:100%">
                <span class="option-title" style="width:75px">创建人： </span>
                <span v-text="currentCreator">2019年11月22日14:12:11</span>
              </span>
            </el-col>
            <el-col :span="6">
              <span class="option-items-dialog" style="width:100%">
                <span class="option-title" style="width:75px">修改时间： </span>
                <span v-text="currentCreateTime">2019年11月22日14:12:11</span>
              </span>
            </el-col>
            <el-col :span="6">
              <span class="option-items-dialog" style="width:100%">
                <span class="option-title" style="width:75px">修改人： </span>
                <span v-text="currentUpdateTime">2019年11月22日14:12:11</span>
              </span>
            </el-col>
          </el-row>
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
        </div>
      </el-dialog>
    </el-dialog>
    <!--选择型号-->
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="typeDialogVisible"
      title="对应型号选择"
      width="800px"
      class="model-dialog"
      @close="closeModelSelectDialog"
    >
      <div style="font-weight: bold;font-size: 15px">对应型号</div>
      <div v-if="model1.length !== 0 && colorList.length > 0"><div class="color-title" v-text="'【'+colorList[0].color+'】:'"/><div class="model-box"><span v-for="type in model1" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
      <div v-if="model2.length !== 0 && colorList.length > 1"><div class="color-title" v-text="'【'+colorList[1].color+'】:'"/><div class="model-box"><span v-for="type in model2" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
      <div v-if="model3.length !== 0 && colorList.length > 2"><div class="color-title" v-text="'【'+colorList[2].color+'】:'"/><div class="model-box"><span v-for="type in model3" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
      <div v-if="model4.length !== 0 && colorList.length > 3"><div class="color-title" v-text="'【'+colorList[3].color+'】:'"/><div class="model-box"><span v-for="type in model4" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
      <div v-if="model5.length !== 0 && colorList.length > 4"><div class="color-title" v-text="'【'+colorList[4].color+'】:'"/><div class="model-box"><span v-for="type in model5" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
      <div v-if="model6.length !== 0 && colorList.length > 5"><div class="color-title" v-text="'【'+colorList[5].color+'】:'"/><div class="model-box"><span v-for="type in model6" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
      <div v-if="model7.length !== 0 && colorList.length > 6"><div class="color-title" v-text="'【'+colorList[6].color+'】:'"/><div class="model-box"><span v-for="type in model7" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
      <div v-if="model8.length !== 0 && colorList.length > 7"><div class="color-title" v-text="'【'+colorList[7].color+'】:'"/><div class="model-box"><span v-for="type in model8" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
      <div v-if="model9.length !== 0 && colorList.length > 8"><div class="color-title" v-text="'【'+colorList[8].color+'】:'"/><div class="model-box"><span v-for="type in model9" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
      <div v-if="model10.length !== 0 && colorList.length > 9"><div class="color-title" v-text="'【'+colorList[9].color+'】:'"/><div class="model-box"><span v-for="type in model10" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
      <div v-if="model11.length !== 0 && colorList.length > 10"><div class="color-title" v-text="'【'+colorList[10].color+'】:'"/><div class="model-box"><span v-for="type in model11" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
      <div v-if="model12.length !== 0 && colorList.length > 11"><div class="color-title" v-text="'【'+colorList[11].color+'】:'"/><div class="model-box"><span v-for="type in model12" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
      <div v-if="model13.length !== 0 && colorList.length > 12"><div class="color-title" v-text="'【'+colorList[12].color+'】:'"/><div class="model-box"><span v-for="type in model13" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
      <div v-if="model14.length !== 0 && colorList.length > 13"><div class="color-title" v-text="'【'+colorList[13].color+'】:'"/><div class="model-box"><span v-for="type in model14" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
      <div v-if="model15.length !== 0 && colorList.length > 14"><div class="color-title" v-text="'【'+colorList[14].color+'】:'"/><div class="model-box"><span v-for="type in model15" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
      <div v-if="model16.length !== 0 && colorList.length > 15"><div class="color-title" v-text="'【'+colorList[15].color+'】:'"/><div class="model-box"><span v-for="type in model16" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
      <div v-if="model17.length !== 0 && colorList.length > 16"><div class="color-title" v-text="'【'+colorList[16].color+'】:'"/><div class="model-box"><span v-for="type in model17" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
      <div v-if="model18.length !== 0 && colorList.length > 17"><div class="color-title" v-text="'【'+colorList[17].color+'】:'"/><div class="model-box"><span v-for="type in model18" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
      <div v-if="model19.length !== 0 && colorList.length > 18"><div class="color-title" v-text="'【'+colorList[18].color+'】:'"/><div class="model-box"><span v-for="type in model19" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
      <div v-if="model20.length !== 0 && colorList.length > 19"><div class="color-title" v-text="'【'+colorList[19].color+'】:'"/><div class="model-box"><span v-for="type in model20" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
      <div class="select-box">
        <div class="select-title">选择光色</div>
        <div class="select-left">
          <div class="color-box">
            <div
              v-for="(color, index) in colorList"
              :key="color.color"
              :class="{active: activeIndex === index}"
              class="select-left-item"
              @click="navClick(index, color.color)"
              v-text="color.color"
            />
          </div>
        </div>
        <div class="select-right">
          <!--<div class="select-title">查找型号</div>-->
          <div>
            <!--<el-input v-model="searchOption" placeholder="请输入型号" size="small" class="searchOptionInput" clearable maxlength="20">
              <template slot="append"><el-button type="primary" icon="el-icon-search" @click="getModelList"/></template>
            </el-input>-->
            <div class="option-box">
              <span id="modelTop" />
              <el-checkbox-group v-if="activeIndex === 0" v-model="model1" @change="handleCheckedTypesChange"><el-checkbox v-for="type in colorModelList" :label="type.code + '#' + type.id" :key="type.id">{{ type.code }}</el-checkbox></el-checkbox-group>
              <el-checkbox-group v-if="activeIndex === 1" v-model="model2" @change="handleCheckedTypesChange"><el-checkbox v-for="type in colorModelList" :label="type.code + '#' + type.id" :key="type.id">{{ type.code }}</el-checkbox></el-checkbox-group>
              <el-checkbox-group v-if="activeIndex === 2" v-model="model3" @change="handleCheckedTypesChange"><el-checkbox v-for="type in colorModelList" :label="type.code + '#' + type.id" :key="type.id">{{ type.code }}</el-checkbox></el-checkbox-group>
              <el-checkbox-group v-if="activeIndex === 3" v-model="model4" @change="handleCheckedTypesChange"><el-checkbox v-for="type in colorModelList" :label="type.code + '#' + type.id" :key="type.id">{{ type.code }}</el-checkbox></el-checkbox-group>
              <el-checkbox-group v-if="activeIndex === 4" v-model="model5" @change="handleCheckedTypesChange"><el-checkbox v-for="type in colorModelList" :label="type.code + '#' + type.id" :key="type.id">{{ type.code }}</el-checkbox></el-checkbox-group>
              <el-checkbox-group v-if="activeIndex === 5" v-model="model6" @change="handleCheckedTypesChange"><el-checkbox v-for="type in colorModelList" :label="type.code + '#' + type.id" :key="type.id">{{ type.code }}</el-checkbox></el-checkbox-group>
              <el-checkbox-group v-if="activeIndex === 6" v-model="model7" @change="handleCheckedTypesChange"><el-checkbox v-for="type in colorModelList" :label="type.code + '#' + type.id" :key="type.id">{{ type.code }}</el-checkbox></el-checkbox-group>
              <el-checkbox-group v-if="activeIndex === 7" v-model="model8" @change="handleCheckedTypesChange"><el-checkbox v-for="type in colorModelList" :label="type.code + '#' + type.id" :key="type.id">{{ type.code }}</el-checkbox></el-checkbox-group>
              <el-checkbox-group v-if="activeIndex === 8" v-model="model9" @change="handleCheckedTypesChange"><el-checkbox v-for="type in colorModelList" :label="type.code + '#' + type.id" :key="type.id">{{ type.code }}</el-checkbox></el-checkbox-group>
              <el-checkbox-group v-if="activeIndex === 9" v-model="model10" @change="handleCheckedTypesChange"><el-checkbox v-for="type in colorModelList" :label="type.code + '#' + type.id" :key="type.id">{{ type.code }}</el-checkbox></el-checkbox-group>
              <el-checkbox-group v-if="activeIndex === 10" v-model="model11" @change="handleCheckedTypesChange"><el-checkbox v-for="type in colorModelList" :label="type.code + '#' + type.id" :key="type.id">{{ type.code }}</el-checkbox></el-checkbox-group>
              <el-checkbox-group v-if="activeIndex === 11" v-model="model12" @change="handleCheckedTypesChange"><el-checkbox v-for="type in colorModelList" :label="type.code + '#' + type.id" :key="type.id">{{ type.code }}</el-checkbox></el-checkbox-group>
              <el-checkbox-group v-if="activeIndex === 12" v-model="model13" @change="handleCheckedTypesChange"><el-checkbox v-for="type in colorModelList" :label="type.code + '#' + type.id" :key="type.id">{{ type.code }}</el-checkbox></el-checkbox-group>
              <el-checkbox-group v-if="activeIndex === 13" v-model="model14" @change="handleCheckedTypesChange"><el-checkbox v-for="type in colorModelList" :label="type.code + '#' + type.id" :key="type.id">{{ type.code }}</el-checkbox></el-checkbox-group>
              <el-checkbox-group v-if="activeIndex === 14" v-model="model15" @change="handleCheckedTypesChange"><el-checkbox v-for="type in colorModelList" :label="type.code + '#' + type.id" :key="type.id">{{ type.code }}</el-checkbox></el-checkbox-group>
              <el-checkbox-group v-if="activeIndex === 15" v-model="model16" @change="handleCheckedTypesChange"><el-checkbox v-for="type in colorModelList" :label="type.code + '#' + type.id" :key="type.id">{{ type.code }}</el-checkbox></el-checkbox-group>
              <el-checkbox-group v-if="activeIndex === 16" v-model="model17" @change="handleCheckedTypesChange"><el-checkbox v-for="type in colorModelList" :label="type.code + '#' + type.id" :key="type.id">{{ type.code }}</el-checkbox></el-checkbox-group>
              <el-checkbox-group v-if="activeIndex === 17" v-model="model18" @change="handleCheckedTypesChange"><el-checkbox v-for="type in colorModelList" :label="type.code + '#' + type.id" :key="type.id">{{ type.code }}</el-checkbox></el-checkbox-group>
              <el-checkbox-group v-if="activeIndex === 18" v-model="model19" @change="handleCheckedTypesChange"><el-checkbox v-for="type in colorModelList" :label="type.code + '#' + type.id" :key="type.id">{{ type.code }}</el-checkbox></el-checkbox-group>
              <el-checkbox-group v-if="activeIndex === 19" v-model="model20" @change="handleCheckedTypesChange"><el-checkbox v-for="type in colorModelList" :label="type.code + '#' + type.id" :key="type.id">{{ type.code }}</el-checkbox></el-checkbox-group>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitModel">确 定</el-button>
        <el-button @click="typeDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!--确认保存-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="siveDialogVisible"
      title="保存确认"
      width="1200px"
    >
      <div :class="{ 'noneMargin': proceCardForm.proceCardType !== 0 }" style="height: auto; position: relative;padding: 0 15px;margin-bottom: 30px">
        <div class="proce-box">
          <div>
            <div class="option-items">
              <span class="option-title">流程卡序号: </span>
              <span v-text="addIndex">12</span>
            </div>
            <div class="option-items">
              <span class="option-title">流程卡编号: </span>
              <span>{{ proceCardForm.code }}</span>
            </div>
            <div class="option-items">
              <span class="option-title">流程卡类型: </span>
              <span v-if="proceCardForm.proceCardType === 0" class="proceCardType">普通流程卡</span>
              <span v-if="proceCardForm.proceCardType === 1" class="proceCardType">重工流程卡</span>
              <span v-if="proceCardForm.proceCardType === 2" class="proceCardType">返工流程卡</span>
              <span v-if="proceCardForm.proceCardType === 3" class="proceCardType">自定义流程卡</span>
            </div>
            <div class="option-items">
              <span class="option-title">流程卡名称: </span>
              <span>{{ proceCardForm.proceCardName }}</span>
            </div>
            <div class="option-items">
              <span class="option-title">工艺分类: </span>
              <span>{{ getCraftName(proceCardForm.craftType) }}</span>
            </div>
            <div class="option-items">
              <span class="option-title">流程卡状态: </span>
              <span v-if="proceCardForm.runType === 0">启用</span>
              <span v-if="proceCardForm.runType === 1">禁用</span>
              <span v-if="proceCardForm.runType === 2">临时</span>
            </div>
            <div class="option-items">
              <span class="option-title">备注: </span>
              <span>{{ proceCardForm.remark }}</span>
            </div>
          </div>
        </div>
        <div style="margin-top: 0px">
          <div v-if="proceCardForm.proceCardType === 0" class="option-title" style="float: left;line-height: 25px">对应型号: </div>
          <div v-if="proceCardForm.proceCardType === 0" class="selectTypeBoxAffirm">
            <div v-if="outModel1.length !== 0 && colorList.length > 0"><div class="color-title" v-text="'【'+colorList[0].color+'】:'"/><div class="model-box"><span v-for="type in outModel1" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
            <div v-if="outModel2.length !== 0 && colorList.length > 1"><div class="color-title" v-text="'【'+colorList[1].color+'】:'"/><div class="model-box"><span v-for="type in outModel2" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
            <div v-if="outModel3.length !== 0 && colorList.length > 2"><div class="color-title" v-text="'【'+colorList[2].color+'】:'"/><div class="model-box"><span v-for="type in outModel3" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
            <div v-if="outModel4.length !== 0 && colorList.length > 3"><div class="color-title" v-text="'【'+colorList[3].color+'】:'"/><div class="model-box"><span v-for="type in outModel4" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
            <div v-if="outModel5.length !== 0 && colorList.length > 4"><div class="color-title" v-text="'【'+colorList[4].color+'】:'"/><div class="model-box"><span v-for="type in outModel5" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
            <div v-if="outModel6.length !== 0 && colorList.length > 5"><div class="color-title" v-text="'【'+colorList[5].color+'】:'"/><div class="model-box"><span v-for="type in outModel6" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
            <div v-if="outModel7.length !== 0 && colorList.length > 6"><div class="color-title" v-text="'【'+colorList[6].color+'】:'"/><div class="model-box"><span v-for="type in outModel7" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
            <div v-if="outModel8.length !== 0 && colorList.length > 7"><div class="color-title" v-text="'【'+colorList[7].color+'】:'"/><div class="model-box"><span v-for="type in outModel8" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
            <div v-if="outModel9.length !== 0 && colorList.length > 8"><div class="color-title" v-text="'【'+colorList[8].color+'】:'"/><div class="model-box"><span v-for="type in outModel9" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
            <div v-if="outModel10.length !== 0 && colorList.length > 9"><div class="color-title" v-text="'【'+colorList[9].color+'】:'"/><div class="model-box"><span v-for="type in outModel10" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
            <div v-if="outModel11.length !== 0 && colorList.length > 10"><div class="color-title" v-text="'【'+colorList[10].color+'】:'"/><div class="model-box"><span v-for="type in outModel11" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
            <div v-if="outModel12.length !== 0 && colorList.length > 11"><div class="color-title" v-text="'【'+colorList[11].color+'】:'"/><div class="model-box"><span v-for="type in outModel12" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
            <div v-if="outModel13.length !== 0 && colorList.length > 12"><div class="color-title" v-text="'【'+colorList[12].color+'】:'"/><div class="model-box"><span v-for="type in outModel13" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
            <div v-if="outModel14.length !== 0 && colorList.length > 13"><div class="color-title" v-text="'【'+colorList[13].color+'】:'"/><div class="model-box"><span v-for="type in outModel14" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
            <div v-if="outModel15.length !== 0 && colorList.length > 14"><div class="color-title" v-text="'【'+colorList[14].color+'】:'"/><div class="model-box"><span v-for="type in outModel15" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
            <div v-if="outModel16.length !== 0 && colorList.length > 15"><div class="color-title" v-text="'【'+colorList[15].color+'】:'"/><div class="model-box"><span v-for="type in outModel16" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
            <div v-if="outModel17.length !== 0 && colorList.length > 16"><div class="color-title" v-text="'【'+colorList[16].color+'】:'"/><div class="model-box"><span v-for="type in outModel17" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
            <div v-if="outModel18.length !== 0 && colorList.length > 17"><div class="color-title" v-text="'【'+colorList[17].color+'】:'"/><div class="model-box"><span v-for="type in outModel18" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
            <div v-if="outModel19.length !== 0 && colorList.length > 18"><div class="color-title" v-text="'【'+colorList[18].color+'】:'"/><div class="model-box"><span v-for="type in outModel19" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
            <div v-if="outModel20.length !== 0 && colorList.length > 19"><div class="color-title" v-text="'【'+colorList[19].color+'】:'"/><div class="model-box"><span v-for="type in outModel20" :key="type" class="model-item" v-text="type.split('#')[0]"/></div></div>
          </div>
        </div>
      </div>
      <div class="module-title-text" style="margin-bottom: 10px">前段工序</div>
      <el-table
        v-loading="listLoading"
        :data="list"
        :class="(proceCardForm.proceCardType === 1 || proceCardForm.proceCardType === 2) ? 'abnormal-process-table' : ''"
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
        <el-table-column label="工序" align="center" prop="consignorName">
          <template slot-scope="scope">
            <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
              <el-select v-model="scope.row.processId" :disabled="true" placeholder="" size="small" style="width: 95%">
                <el-option
                  v-for="item in scope.row.proceOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
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
              <el-select v-model="scope.row.programId" :disabled="true" placeholder="" size="small" style="width: 95%">
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
      <div class="module-title-text" style="float: none;margin-top: 15px;margin-bottom: 10px">后段工序</div>
      <div v-if="proceCardForm.proceCardType === 2" style="font-size: 26px;margin: 15px">后段工序随原流程卡进行！</div>
      <el-table
        v-loading="listLoading"
        v-if="proceCardForm.proceCardType !== 2"
        :data="endList"
        :class="(proceCardForm.proceCardType === 1 || proceCardForm.proceCardType === 2) ? 'abnormal-process-table' : ''"
        class="dialog-table"
        element-loading-text="拼命加载中"
        border
        fit>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
              {{ scope.$index+1+ list.length }}
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
        <el-table-column label="工序" align="center" prop="consignorName">
          <template slot-scope="scope">
            <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
              <el-select v-model="scope.row.processId" :disabled="true" placeholder="" size="small" style="width: 95%">
                <el-option
                  v-for="item in scope.row.proceOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="制造记录" align="center" prop="endTime">
          <template slot-scope="scope">
            <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
              <div class="has-height" v-text="scope.row.remark"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="程序" align="center">
          <template slot-scope="scope">
            <div :class="scope.row.sign === 1 ? 'has-bancground' : ''">
              <el-select v-model="scope.row.programId" :disabled="true" placeholder="" size="small" style="width: 95%">
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
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitProcessForm">确认保存</el-button>
        <el-button @click="siveDialogVisible = false">取消保存</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./addProceCardManage.js"></script>

<style scoped>
  .has-height{
    height: 40px;
  }
  .select-box{
    overflow: hidden;
    border-top: 1px solid #e2e2e2;
    margin-top: 10px;
  }
  .select-title{
    line-height: 40px;
    font-size: 15px;
    font-weight: bold;
  }
  .select-left{
    float: left;
    width: 185px;
  }
  .color-box{
    border:1px solid #ddd;
    max-height: 426px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .select-right{
    margin-left: 200px;
  }
  .option-box{
    border: 1px solid #ddd;
    height: 426px;
    overflow: auto;
  }
  .option-box>>>.el-checkbox{
    margin-left: 0px;
    margin-right: 0px;
    padding-left: 15px;
    line-height: 25px;
    width: 25%;
    float: left;
  }
  .option-box>>>.el-checkbox:hover{
    background: #e5f4f4;
  }
  .option-box>>>.el-checkbox__label{
    padding-left: 25px;
  }
  .model-dialog>>>.el-dialog__body{
    padding: 15px;
  }
  .select-left-item{
    line-height: 40px;
    width: 185px;
    text-align: center;
    border-bottom: 1px solid #ddd;
    cursor: pointer;
  }
  .select-left-item:last-child{
    border-bottom: none
  }
  .active{
    background-color: #e5f4f4;
  }
  .el-checkbox{
    display: block;
  }
  .has-margin-top{
    margin-top: 15px;
  }
  .btn-group{
    position: absolute;
    bottom: 15px;
    right: 15px;
  }
  .option-items{
    float: left;
    width: 350px;
    height: 40px;
  }
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
  .selectTypeBox{
    margin-left: 85px;
    width: calc(100vw - 365px);
  }
  .selectTypeBoxAffirm{
    margin-left: 85px;
    width: calc(100vw - 885px);
  }
  .selectTypeBoxOut{
    margin-left: 85px;
    width: calc(100vw - 365px);
  }
  .select-type-box{
    margin-left: 85px;
    width: 888px;
  }
  .cut-line{
    margin: 10px 0;
    border-bottom: 1px solid #e2e2e2;
    position: relative;
  }
  .copyBtn{
    position: absolute;
    bottom: 10px;
    right: 15px;
  }
  .dialog-sub-title{
    margin-bottom: 10px;
  }
  .inner-dialog>>>.el-dialog__body{
    padding: 15px;
    max-height:800px;
    overflow: auto;
  }
  .handle-bush{
    position: absolute;
    bottom: -24px;
    left: 50%;
    z-index: 2;
    transform: translateX(-50%);
  }
  .end-bush{
    position: absolute;
    bottom: 10px;
    left: 50%;
    z-index: 2;
    transform: translateX(-50%);
  }
  .module-content{
    overflow: initial;
  }
  .module-container{
    overflow: initial;
  }
  .submit-btn-group{
    text-align: center;
    margin-top: 15px;
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
  .abnormal-process-table>>> td{
    background: #f9ebeb;
  }
  input{
    background: transparent;
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
  .proce-input{
    width: 200px;
  }
  .model-rel{
    position: relative;
  }
  .has-bancground{
    background: rgba(181, 184, 218, 0.84);
  }
  .identifying{
    background: #5268a5;
    color: #fff;
  }
  .identifying:hover{
    background: #5268a5;
    /*border: none;*/
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
  .tab-control{
    border-bottom: 2px solid #e2e2e2;
    margin-bottom: 20px;
    padding-bottom: 1px;
  }
  .tab-control span{
    line-height: 35px;
    display: inline-block;
    width: 78px;
    text-align: center;
    cursor: pointer;
  }
  .tab-control span.activeTab{
    box-shadow: 0px 3px 0px #009494;
  }
  .has-margin-left{
    margin-left: 20px;
  }
  .copyDialog>>>.el-dialog__body {
    padding: 15px;
  }
  .process-card-table>>> .cell{
    line-height: 45px;
  }
  .process-card-table>>> td{
    height: 45px;
  }
  .noneMargin{
    margin-bottom: -10px !important;
  }
  @media (max-width: 1440px) {
    .option-items{
      width: 340px;
      height: 35px;
    }
    .option-title{
      width: 95px;
    }
    .header-search-add>>>.el-input--small .el-input__inner {
      height: 28px;
      line-height: 28px;
    }
  }
</style>
