<template>
  <PageHeaderLayout :has_back="true">
    <div class="header-search-add height-auto">
      <el-row>
        <el-col :span="12" style="text-align:left">
          <el-button
            v-if="findType === 2 || findType === 5"
            size="small"
            type="primary"
            class="buttonTypechuli"
            @click="openCheck" ><svg-icon icon-class="rukedansh"/>  审 核</el-button>
          <el-button
            v-if="findType !== -1"
            size="small"
            type="primary"
            icon="el-icon-check"
            @click="save"
          >
            保 存
          </el-button>
          &nbsp;
        </el-col>
        <el-col :span="12" style="text-align:right">
          <el-button
            v-if="findType !== 0"
            class="margin-left"
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="viewDetailCard" >异常单跟踪</el-button>
          <el-button
            v-if="findType !== 0"
            size="small"
            type="danger"
            style="background-color:#1ABC9C;border-color:#1ABC9C"
            @click="prints"
          >
            <svg-icon icon-class="dayin"/> 打 印
          </el-button>
          <!-- <el-button
            v-if="findType !== 0"
            size="small"
            type="danger"
            @click="add"
          >
            <svg-icon icon-class="clear"/> 导 出
          </el-button> -->
        </el-col>
      </el-row>
    </div>
    <div class="app-container">
      <!-- <div class="title">新增异常单记录</div> -->
      <div class="new-body">
        <el-row >
          <el-col :span="8">
            <el-row>
              <el-col :span="6">
                <div class="labelst">
                  <span class="impLog">*</span>编号
                </div>
              </el-col>
              <el-col :span="18" class="inputbor">
                <el-input v-model="reportNo" :disabled="true" class="search-input" style="width:90%" placeholder="请输入编号" size="small"/>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-row>
              <el-col :span="6">
                <div class="labelst">
                  <span class="impLog">*</span>日期
                </div>
              </el-col>
              <el-col :span="18" class="inputbor">
                <el-date-picker
                  v-model="beginDate"
                  :picker-options="pickerOptionsStart"
                  :editable="false"
                  :disabled="findType !== 0"
                  class="search-input"
                  style="width:90%"
                  size="small"
                  type="date"
                  placeholder="日期"
                  value-format="timestamp"
                />
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-row>
              <el-col :span="6">
                <div class="labelst">
                  <span class="impLog">*</span>异常等级
                </div>
              </el-col>
              <el-col :span="18" class="inputbor">
                <el-select v-model="level" :disabled="findType !== 0" size="small" class="search-input" style="width:90%" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in errorLevel"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row style="margin-top:15px">
          <el-col :span="8">
            <el-row>
              <el-col :span="6">
                <div class="labelsw" style="border-bottom: 0;">
                  <!-- <span class="impLog">*</!-->型号
                </div>
              </el-col>
              <el-col :span="18" class="inputbors" style="border-bottom: 0;border-right:0px">
                <el-input v-model="model" :disabled="findType !== 0" class="search-input" style="width:90%" placeholder="请输入" size="small" maxlength="10"/>
                <!-- <el-select v-model="model" :disabled="findType !== 0" size="small" class="search-input" style="width:90%" filterable placeholder="请选择">
                  <el-option
                    v-for="item in productLists"
                    :key="item.id"
                    :label="item.code"
                    :value="item.code"/>
                </el-select> -->
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-row>
              <el-col :span="6">
                <div class="labelsw" style="border-bottom: 0;">
                  批号
                </div>
              </el-col>
              <el-col :span="18" class="inputbors" style="border-bottom: 0;border-right:0px">
                <el-input v-model="batchNo" :disabled="findType !== 0" class="search-input" style="width:90%" placeholder="请输入" size="small" maxlength="200"/>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-row>
              <el-col :span="6">
                <div class="labelsw" style="border-bottom: 0;">
                  异常工序
                </div>
              </el-col>
              <el-col :span="18" class="inputbors" style="border-bottom: 0;">
                <el-input v-model="process" :disabled="findType !== 0" class="search-input" style="width:90%" placeholder="请输入" size="small" maxlength="100"/>
                <!-- <el-select v-model="process" :disabled="true" size="small" class="search-input" style="width:90%" filterable placeholder="请选择">
                  <el-option
                    v-for="item in processList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select> -->
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-row>
              <el-col :span="6">
                <div class="labelsw">
                  抽检数
                </div>
              </el-col>
              <el-col :span="18" class="inputbors" style="border-right:0px">
                <el-input v-model="checksNum" :disabled="findType !== 0" class="search-input" style="width:90%" placeholder="请输入抽检数" size="small" maxlength="6" @blur="badRate"/>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-row>
              <el-col :span="6">
                <div class="labelsw">
                  不良数量
                </div>
              </el-col>
              <el-col :span="18" class="inputbors" style="border-right:0px">
                <el-input v-model="badNum" :disabled="findType !== 0" class="search-input" style="width:90%" placeholder="请输入不良数量" size="small" maxlength="6" @blur="badRate"/>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-row>
              <el-col :span="6">
                <div class="labelsw">
                  不良率
                </div>
              </el-col>
              <el-col :span="18" class="inputbors">
                <el-input v-model="badRateVal" :disabled="true" class="search-input" style="width:90%" placeholder="" size="small"/>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row class="ppd">
          <el-col :span="24" class="labelsws">
            异常类型
          </el-col>
        </el-row>
        <el-row class="ppd">
          <el-col :span="24" class="labelswr">
            <el-checkbox-group v-model="types" :disabled="findType !== 0" style="width:800px" @change="setIfOther">
              <el-checkbox :label="0">原材料异常</el-checkbox>
              <el-checkbox :label="1">制程异常</el-checkbox>
              <el-checkbox :label="2">成品异常</el-checkbox>
              <el-checkbox :label="3">出货异常</el-checkbox>
              <el-checkbox :label="4">其他</el-checkbox>
            </el-checkbox-group>
            <el-input v-if="types.indexOf(4)>-1" v-model="qtContent" :disabled="findType !== 0" class="search-input" style="float: right;margin-top: -29px;margin-right: 220px;width: 300px;" placeholder="请输入其他说明" size="small" maxlength="20"/>
          </el-col>
        </el-row>
        <el-row class="ppd">
          <el-col :span="24" class="labelsws">
            异常描述（发现部门）
          </el-col>
        </el-row>
        <el-row class="ppd">
          <el-col :span="24" class="labelswr" style="height: 200px;">
            <el-input v-model="badContent" :disabled="findType !== 0" :rows="7" class="search-input" style="width:98%" type="textarea" placeholder="请输入" size="small" maxlength="1000"/>
            <div class="sts">
              <el-upload
                v-if="findType === 0"
                ref="upload"
                :auto-upload="true"
                :on-success="onSuccess"
                :on-error="onError"
                :action="fileUrl"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :with-credentials="true"
                style="float: left; margin-right: 15px"
                accept=".xls,.xlsx,.pdf,.doc,.docx,.ppt,.pptx,.png,.jpg"
                class="upload-demo"
              >
                <el-button v-loading="loading" slot="trigger" size="small" class="uploads" type="primary"><svg-icon icon-class="import"/>  上传文件</el-button>
              </el-upload>
              <div v-if="fileList.length>0" class="stdiv">
                <div class="settex">{{ fileList[0].name }}</div>
                <el-button slot="trigger" size="small" class="uploads" type="primary" @click="download(fileList[0].id)">下载</el-button>
                <el-button v-if="findType === 0" slot="trigger" size="small" class="uploads" type="primary" @click="deleteFiles(0,0)">删除</el-button>
              </div>
              <div v-if="fileList.length>1" class="stdiv">
                <div class="settex">{{ fileList[1].name }}</div>
                <el-button slot="trigger" size="small" class="uploads" type="primary" @click="download(fileList[1].id)">下载</el-button>
                <el-button v-if="findType === 0" slot="trigger" size="small" class="uploads" type="primary" @click="deleteFiles(0,1)">删除</el-button>
              </div>
              <div v-if="fileList.length>2" class="stdiv">
                <div class="settex">{{ fileList[2].name }}</div>
                <el-button slot="trigger" size="small" class="uploads" type="primary" @click="download(fileList[2].id)">下载</el-button>
                <el-button v-if="findType === 0" slot="trigger" size="small" class="uploads" type="primary" @click="deleteFiles(0,2)">删除</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row class="ppd">
          <el-col :span="24" class="labelsws">
            责任部门
          </el-col>
        </el-row>
        <el-row class="ppd">
          <el-col :span="24" class="labelswr">
            <el-checkbox-group v-model="analysesDept" :disabled="findType === -1||findType === 1||findType === 2||findType===3||findType === 4||findType === 6||(billInfo!==null&&billInfo.rowInfo!==undefined&&billInfo.rowInfo.status>3)">
              <el-checkbox :label="0">外延部</el-checkbox>
              <el-checkbox :label="1">芯片部</el-checkbox>
              <el-checkbox :label="2">厂务部</el-checkbox>
              <el-checkbox :label="3">采购部</el-checkbox>
              <el-checkbox :label="4">技术部</el-checkbox>
              <el-checkbox :label="5">生产管理部</el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-row>
        <el-row class="ppd">
          <el-col :span="24" class="labelswr" style="padding-top: 4px;">
            <div style="margin-left: 15px;float:left">
              <span>填写人</span>
              <el-input v-model="createName" :disabled="true" class="search-input" placeholder="" size="small"/>
            </div>
            <div style="margin-right: 15px;float:right">
              <span>审核人</span>
              <el-input v-model="createCheckName" :disabled="true" class="search-input" placeholder="" size="small"/>
              <el-radio-group v-if="findType === 1" v-model="createCheck">
                <el-radio :label="0">通过</el-radio>
                <el-radio :label="1">不通过</el-radio>
              </el-radio-group>
            </div>
          </el-col>
        </el-row>
        <el-row class="ppd">
          <el-col :span="24" class="labelsws">
            原因分析（责任部门）
          </el-col>
        </el-row>
        <el-row class="ppd">
          <el-col :span="24" class="labelswr" style="height: auto;padding-bottom: 15px;">
            <div v-if="billInfo!==null&&billInfo.rowInfo!==undefined&&billInfo.rowInfo.resultDetails.analyses!==undefined&&billInfo.rowInfo.resultDetails.analyses.length>0" class="tab-control" style="margin-left: 15px;text-align: left;margin-right: 15px;">
              <span v-for="(item, index) in billInfo.rowInfo.resultDetails.analyses" :key="item.id" :class="{activeTab:isActivetab === index}" @click="tabAry(index)">
                {{ item.name }}
              </span>
            </div>
            <el-input v-if="billInfo===null||billInfo.rowInfo===undefined||billInfo.rowInfo.resultDetails.analyses===undefined||billInfo.rowInfo.resultDetails.analyses.length===0" :disabled="true" :rows="7" class="search-input" style="width:98%" type="textarea" placeholder="请输入" size="small" maxlength="1000"/>
            <el-input v-if="billInfo!==null&&billInfo.rowInfo!==undefined&&billInfo.rowInfo.resultDetails.analyses!==undefined&&billInfo.rowInfo.resultDetails.analyses.length>0" v-model="billInfo.rowInfo.resultDetails.analyses[isActivetab].content" :disabled="findType !== 3" :rows="7" class="search-input" style="width:98%" type="textarea" placeholder="请输入" size="small" maxlength="1000"/>
            <div class="sts">
              <el-upload
                v-if="billInfo!=null&&billInfo.rowInfo!==undefined&&billInfo.rowInfo.resultDetails.analyses!==undefined&&billInfo.rowInfo.resultDetails.analyses.length>0&&findType === 3"
                ref="upload"
                :auto-upload="true"
                :on-success="onSuccess"
                :on-error="onError"
                :action="fileUrl"
                :show-file-list="false"
                :before-upload="beforeUpload1"
                :with-credentials="true"
                style="float: left; margin-right: 15px"
                accept=".xls,.xlsx,.pdf,.doc,.docx,.ppt,.pptx,.png,.jpg"
                class="upload-demo"
              >
                <el-button v-loading="loading" slot="trigger" size="small" class="uploads" type="primary"><svg-icon icon-class="import"/>  上传文件</el-button>
              </el-upload>
              <div v-if="fileList1.length>0" class="stdiv">
                <div class="settex">{{ fileList1[0].name }}</div>
                <el-button slot="trigger" size="small" class="uploads" type="primary " @click="download(fileList1[0].id)">下载</el-button>
                <el-button v-if="billInfo!=null&&billInfo.rowInfo!==undefined&&billInfo.rowInfo.resultDetails.analyses!==undefined&&billInfo.rowInfo.resultDetails.analyses.length>0&&findType === 3" slot="trigger" size="small" class="uploads" type="primary" @click="deleteFiles(1,0)">删除</el-button>
              </div>
              <div v-if="fileList1.length>1" class="stdiv">
                <div class="settex">{{ fileList1[1].name }}</div>
                <el-button slot="trigger" size="small" class="uploads" type="primary" @click="download(fileList1[1].id)">下载</el-button>
                <el-button v-if="billInfo!=null&&billInfo.rowInfo!==undefined&&billInfo.rowInfo.resultDetails.analyses!==undefined&&billInfo.rowInfo.resultDetails.analyses.length>0&&findType === 3" slot="trigger" size="small" class="uploads" type="primary" @click="deleteFiles(1,1)">删除</el-button>
              </div>
              <div v-if="fileList1.length>2" class="stdiv">
                <div class="settex">{{ fileList1[2].name }}</div>
                <el-button slot="trigger" size="small" class="uploads" type="primary" @click="download(fileList1[2].id)">下载</el-button>
                <el-button v-if="billInfo!=null&&billInfo.rowInfo!==undefined&&billInfo.rowInfo.resultDetails.analyses!==undefined&&billInfo.rowInfo.resultDetails.analyses.length>0&&findType === 3" slot="trigger" size="small" class="uploads" type="primary" @click="deleteFiles(1,2)">删除</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row class="ppd">
          <el-col :span="24" class="labelswr" style="padding-top: 4px;">
            <div style="margin-left: 15px;float:left">
              <span>分析人</span>
              <el-input v-if="billInfo!==null&&billInfo.rowInfo!==undefined&&billInfo.rowInfo.resultDetails.analyses!==undefined&&billInfo.rowInfo.resultDetails.analyses.length>0" v-model="billInfo.rowInfo.resultDetails.analyses[isActivetab].creatorName" :disabled="true" class="search-input" placeholder="" size="small"/>
              <el-input v-if="billInfo===null||billInfo.rowInfo===undefined||billInfo.rowInfo.resultDetails.analyses===undefined||billInfo.rowInfo.resultDetails.analyses.length===0" :disabled="true" class="search-input" placeholder="" size="small"/>
            </div>
            <div style="margin-right: 15px;float:right">
              <span>审核人</span>
              <el-input v-if="billInfo!==null&&billInfo.rowInfo!==undefined&&billInfo.rowInfo.resultDetails.analyses!==undefined&&billInfo.rowInfo.resultDetails.analyses.length>0" v-model="billInfo.rowInfo.resultDetails.analyses[isActivetab].auditorName" :disabled="true" class="search-input" placeholder="" size="small"/>
              <el-input v-if="billInfo===null||billInfo.rowInfo===undefined||billInfo.rowInfo.resultDetails.analyses===undefined||billInfo.rowInfo.resultDetails.analyses.length===0" :disabled="true" class="search-input" placeholder="" size="small"/>
              <el-radio-group v-if="findType === 4" v-model="anycheck">
                <el-radio :label="0">通过</el-radio>
                <el-radio :label="1">不通过</el-radio>
              </el-radio-group>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-row class="ppd">
              <el-col :span="24" class="labelsws">
                临时对策（品保）
              </el-col>
            </el-row>
            <el-row class="ppd">
              <el-col :span="24" class="labelswr" style="height: auto;padding-bottom: 15px;">
                <div style="margin-bottom:10px">
                  <el-radio-group v-model="lstype" :disabled="findType !== 6" @change="getLStype">
                    <el-radio :label="0" style="margin-left: 0px;">返工({{ num0 }}片)</el-radio>
                    <el-radio :label="1" style="margin-left: 0px;">报废({{ num1 }}片)</el-radio>
                    <el-radio :label="2" style="margin-left: 0px;">降级({{ num2 }}片)</el-radio>
                    <el-radio :label="3" style="margin-left: 0px;">其他({{ num3 }}片)</el-radio>
                  </el-radio-group>
                  <el-button :disabled="(findType < 6 && findType !==-1) || findType === 10 || findType === 11" size="mini" type="primary" @click="getLStypes">Wafer详情</el-button>
                </div>
                <el-input v-model="lsContent" :disabled="findType !== 6" :rows="5" class="search-input" style="width:97%" type="textarea" placeholder="请输入" size="small" maxlength="200"/>
                <div :style="{height:height0+'px'}" class="sts">
                  <el-upload
                    v-if="findType === 6"
                    ref="upload"
                    :auto-upload="true"
                    :on-success="onSuccess"
                    :on-error="onError"
                    :action="fileUrl"
                    :show-file-list="false"
                    :before-upload="beforeUpload2"
                    :with-credentials="true"
                    style="float: left; margin-right: 15px"
                    accept=".xls,.xlsx,.pdf,.doc,.docx,.ppt,.pptx,.png,.jpg"
                    class="upload-demo"
                  >
                    <el-button v-loading="loading" slot="trigger" size="small" class="uploads" type="primary"><svg-icon icon-class="import"/>  上传文件</el-button>
                  </el-upload>
                  <div v-if="fileList2.length>0" class="stdivs">
                    <div class="settexs">{{ fileList2[0].name }}</div>
                    <el-button slot="trigger" size="small" class="uploads" type="primary" @click="download(fileList2[0].id)">下载</el-button>
                    <el-button v-if="findType === 6" slot="trigger" size="small" class="uploads" type="primary" @click="deleteFiles(2,0)">删除</el-button>
                  </div>
                  <div v-if="fileList2.length>1" :style="{marginLeft:findType === 6?'77px':'15px'}" class="stdivs">
                    <div class="settexs">{{ fileList2[1].name }}</div>
                    <el-button slot="trigger" size="small" class="uploads" type="primary" @click="download(fileList2[1].id)">下载</el-button>
                    <el-button v-if="findType === 6" slot="trigger" size="small" class="uploads" type="primary" @click="deleteFiles(2,1)">删除</el-button>
                  </div>
                  <div v-if="fileList2.length>2" :style="{marginLeft:findType === 6?'77px':'15px'}" class="stdivs">
                    <div class="settexs">{{ fileList2[2].name }}</div>
                    <el-button slot="trigger" size="small" class="uploads" type="primary" @click="download(fileList2[2].id)">下载</el-button>
                    <el-button v-if="findType === 6" slot="trigger" size="small" class="uploads" type="primary" @click="deleteFiles(1,2)">删除</el-button>
                  </div>
                </div>
              </el-col>
            </el-row>
            <el-row class="ppd">
              <el-col :span="24" class="labelswr" style="padding-top: 4px;">
                <div>
                  <div style="margin-left: 15px;float:left">
                    <span>填写人</span>
                    <el-input v-model="lsName" :disabled="true" class="search-input" style="width:120px" placeholder="" size="small"/>
                  </div>
                  <div style="margin-right: 15px;float:right">
                    <span>审核人</span>
                    <el-input v-model="lsCheckName" :disabled="true" class="search-input" style="width:120px" placeholder="" size="small"/>
                    <el-radio-group v-if="findType === 7" v-model="lsCheckType">
                      <el-radio :label="1">通过</el-radio>
                      <el-radio :label="2">不通过</el-radio>
                    </el-radio-group>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row class="ppd">
              <el-col :span="24" class="labelsws">
                追踪结果（品保）
              </el-col>
            </el-row>
            <el-row class="ppd">
              <el-col :span="24" class="labelswr" style="height: auto;padding-bottom: 15px;">
                <el-input v-model="lszzContent" :disabled="findType !== 8" :rows="7" class="search-input" style="width:97%" type="textarea" placeholder="请输入" size="small" maxlength="200"/>
                <div :style="{height:height0+'px'}" class="sts">
                  <el-upload
                    v-if="findType === 8"
                    ref="upload"
                    :auto-upload="true"
                    :on-success="onSuccess"
                    :on-error="onError"
                    :action="fileUrl"
                    :show-file-list="false"
                    :before-upload="beforeUpload3"
                    :with-credentials="true"
                    style="float: left; margin-right: 15px"
                    accept=".xls,.xlsx,.pdf,.doc,.docx,.ppt,.pptx,.png,.jpg"
                    class="upload-demo"
                  >
                    <el-button v-loading="loading" slot="trigger" size="small" class="uploads" type="primary"><svg-icon icon-class="import"/>  上传文件</el-button>
                  </el-upload>
                  <div v-if="fileList3.length>0" class="stdivs">
                    <div class="settexs">{{ fileList3[0].name }}</div>
                    <el-button slot="trigger" size="small" class="uploads" type="primary" @click="download(fileList3[0].id)">下载</el-button>
                    <el-button v-if="findType === 8" slot="trigger" size="small" class="uploads" type="primary" @click="deleteFiles(3,0)">删除</el-button>
                  </div>
                  <div v-if="fileList3.length>1" :style="{marginLeft:findType === 8?'77px':'15px'}" class="stdivs">
                    <div class="settexs">{{ fileList3[1].name }}</div>
                    <el-button slot="trigger" size="small" class="uploads" type="primary" @click="download(fileList3[1].id)">下载</el-button>
                    <el-button v-if="findType === 8" slot="trigger" size="small" class="uploads" type="primary" @click="deleteFiles(3,1)">删除</el-button>
                  </div>
                  <div v-if="fileList3.length>2" :style="{marginLeft:findType === 8?'77px':'15px'}" class="stdivs">
                    <div class="settexs">{{ fileList3[2].name }}</div>
                    <el-button slot="trigger" size="small" class="uploads" type="primary" @click="download(fileList3[2].id)">下载</el-button>
                    <el-button v-if="findType === 8" slot="trigger" size="small" class="uploads" type="primary" @click="deleteFiles(3,2)">删除</el-button>
                  </div>
                </div>
              </el-col>
            </el-row>
            <el-row class="ppd">
              <el-col :span="24" class="labelswr" style="padding-top: 4px;">
                <div>
                  <div style="margin-left: 15px;float:left">
                    <span>填写人</span>
                    <el-input v-model="lszzName" :disabled="true" class="search-input" style="width:120px" placeholder="" size="small"/>
                  </div>
                  <div style="margin-right: 15px;float:right">
                    <span>审核人</span>
                    <el-input v-model="lszzCheckName" :disabled="true" class="search-input" style="width:120px" placeholder="" size="small"/>
                    <el-radio-group v-if="findType === 9" v-model="lszzCheckType">
                      <el-radio :label="1">通过</el-radio>
                      <el-radio :label="2">不通过</el-radio>
                    </el-radio-group>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-row class="ppd">
              <el-col :span="24" class="labelsws">
                永久对策（责任部门）
              </el-col>
            </el-row>
            <el-row class="ppd">
              <el-col :span="24" class="labelswr" style="height: auto;padding-bottom: 15px;">
                <div v-if="billInfo===null||billInfo.rowInfo===undefined||billInfo.rowInfo.resultDetails.perpetualStrategy===undefined" style="height:38px">
                  &nbsp;
                </div>
                <div v-if="billInfo!==null&&billInfo.rowInfo!==undefined&&billInfo.rowInfo.resultDetails.perpetualStrategy!==undefined&&billInfo.rowInfo.resultDetails.perpetualStrategy.length>0" class="tab-control" style="margin-left: 15px;text-align: left;margin-right: 15px;margin-bottom: 13px;">
                  <span v-for="(item, index) in billInfo.rowInfo.resultDetails.perpetualStrategy" :key="item.id" :class="{activeTab:isActivetabs === index}" @click="tabArys(index)">
                    {{ item.name }}
                  </span>
                </div>
                <el-input v-if="billInfo===null||billInfo.rowInfo===undefined||billInfo.rowInfo.resultDetails.perpetualStrategy===undefined||billInfo.rowInfo.resultDetails.perpetualStrategy.length===0" :disabled="true" :rows="5" class="search-input" style="width:97%" type="textarea" placeholder="请输入" size="small" maxlength="200"/>
                <el-input v-if="billInfo!==null&&billInfo.rowInfo!==undefined&&billInfo.rowInfo.resultDetails.perpetualStrategy!==undefined&&billInfo.rowInfo.resultDetails.perpetualStrategy.length>0" v-model="billInfo.rowInfo.resultDetails.perpetualStrategy[isActivetabs].content" :disabled="findType !== 3&&findType !== 10" :rows="5" class="search-input" style="width:97%" type="textarea" placeholder="请输入" size="small" maxlength="200"/>
                <div :style="{height:height1+'px'}" class="sts">
                  <el-upload
                    v-if="findType === 10||findType === 3"
                    ref="upload"
                    :auto-upload="true"
                    :on-success="onSuccess"
                    :on-error="onError"
                    :action="fileUrl"
                    :show-file-list="false"
                    :before-upload="beforeUpload4"
                    :with-credentials="true"
                    style="float: left; margin-right: 15px"
                    accept=".xls,.xlsx,.pdf,.doc,.docx,.ppt,.pptx,.png,.jpg"
                    class="upload-demo"
                  >
                    <el-button v-loading="loading" slot="trigger" size="small" class="uploads" type="primary"><svg-icon icon-class="import"/>  上传文件</el-button>
                  </el-upload>
                  <div v-if="fileList4.length>0" class="stdivs">
                    <div class="settexs">{{ fileList4[0].name }}</div>
                    <el-button slot="trigger" size="small" class="uploads" type="primary" @click="download(fileList4[0].id)">下载</el-button>
                    <el-button v-if="findType === 10||findType === 3" slot="trigger" size="small" class="uploads" type="primary" @click="deleteFiles(4,0)">删除</el-button>
                  </div>
                  <div v-if="fileList4.length>1" :style="{marginLeft:(findType === 10||findType === 3)?'77px':'15px'}" class="stdivs">
                    <div class="settexs">{{ fileList4[1].name }}</div>
                    <el-button slot="trigger" size="small" class="uploads" type="primary" @click="download(fileList4[1].id)">下载</el-button>
                    <el-button v-if="findType === 10||findType === 3" slot="trigger" size="small" class="uploads" type="primary" @click="deleteFiles(4,1)">删除</el-button>
                  </div>
                  <div v-if="fileList4.length>2" :style="{marginLeft:(findType === 10||findType === 3)?'77px':'15px'}" class="stdivs">
                    <div class="settexs">{{ fileList4[2].name }}</div>
                    <el-button slot="trigger" size="small" class="uploads" type="primary" @click="download(fileList4[2].id)">下载</el-button>
                    <el-button v-if="findType === 10||findType === 3" slot="trigger" size="small" class="uploads" type="primary" @click="deleteFiles(4,2)">删除</el-button>
                  </div>
                </div>
              </el-col>
            </el-row>
            <el-row class="ppd">
              <el-col :span="24" class="labelswr" style="height: auto;">
                <el-row>
                  <el-col :span="12">
                    <span>填写人</span>
                    <el-input v-model="yjName" :disabled="true" class="search-input" placeholder="" size="small"/>
                  </el-col>
                  <el-col :span="12">
                    <el-radio-group v-if="findType === 11" v-model="yjCheckType" style="margin-top: 7px;">
                      <el-radio :label="1">通过</el-radio>
                      <el-radio :label="2">不通过</el-radio>
                    </el-radio-group>
                  </el-col>
                </el-row>
                <el-row style="margin-top:10px;margin-bottom:15px">
                  <el-col :span="12">
                    <span>审核人</span>
                    <el-input v-model="yjCheckName" :disabled="true" class="search-input" placeholder="" size="small"/>
                  </el-col>
                  <el-col :span="12">
                    <span>完成日期</span>
                    <el-date-picker
                      v-model="yjCheckTime"
                      :picker-options="pickerOptionsStart"
                      :editable="false"
                      :disabled="true"
                      class="search-input"
                      size="small"
                      type="date"
                      placeholder="日期"
                      value-format="timestamp"
                    />
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row class="ppd">
              <el-col :span="24" class="labelsws">
                追踪结果（品保）
              </el-col>
            </el-row>
            <el-row class="ppd">
              <el-col :span="24" class="labelswr" style="height: auto;padding-bottom: 15px;">
                <el-input v-model="yjdczzContent" :rows="7" :disabled="yjdcDisable||findType===0||findType===1||findType===13||findType===14||findType===15||findType ===-1" class="search-input" style="width:97%" type="textarea" placeholder="请输入" size="small" maxlength="200"/>
                <div :style="{height:height1+'px'}" class="sts">
                  <el-upload
                    v-if="!yjdcDisable&&findType !== 13&&findType !== 14&&findType !== 15&&findType !==-1&&findType!==0&&findType!==1"
                    ref="upload"
                    :auto-upload="true"
                    :on-success="onSuccess"
                    :on-error="onError"
                    :action="fileUrl"
                    :show-file-list="false"
                    :before-upload="beforeUpload5"
                    :with-credentials="true"
                    style="float: left; margin-right: 15px"
                    accept=".xls,.xlsx,.pdf,.doc,.docx,.ppt,.pptx,.png,.jpg"
                    class="upload-demo"
                  >
                    <el-button v-loading="loading" slot="trigger" size="small" class="uploads" type="primary"><svg-icon icon-class="import"/>  上传文件</el-button>
                  </el-upload>
                  <div v-if="fileList5.length>0" class="stdivs">
                    <div class="settexs">{{ fileList5[0].name }}</div>
                    <el-button slot="trigger" size="small" class="uploads" type="primary" @click="download(fileList5[0].id)">下载</el-button>
                    <el-button v-if="!yjdcDisable&&findType !== 13&&findType !== 14&&findType !== 15" slot="trigger" size="small" class="uploads" type="primary" @click="deleteFiles(5,0)">删除</el-button>
                  </div>
                  <div v-if="fileList5.length>1" :style="{marginLeft:(!yjdcDisable&&findType !== 13&&findType !== 14&&findType !== 15&&findType !==-1&&findType!==0)?'77px':'15px'}" class="stdivs">
                    <div class="settexs">{{ fileList5[1].name }}</div>
                    <el-button slot="trigger" size="small" class="uploads" type="primary" @click="download(fileList5[1].id)">下载</el-button>
                    <el-button v-if="!yjdcDisable&&findType !== 13&&findType !== 14&&findType !== 15" slot="trigger" size="small" class="uploads" type="primary" @click="deleteFiles(5,1)">删除</el-button>
                  </div>
                  <div v-if="fileList5.length>2" :style="{marginLeft:(!yjdcDisable&&findType !== 13&&findType !== 14&&findType !== 15&&findType !==-1&&findType!==0)?'77px':'15px'}" class="stdivs">
                    <div class="settexs">{{ fileList5[2].name }}</div>
                    <el-button slot="trigger" size="small" class="uploads" type="primary" @click="download(fileList5[2].id)">下载</el-button>
                    <el-button v-if="!yjdcDisable&&findType !== 13&&findType !== 14&&findType !== 15" slot="trigger" size="small" class="uploads" type="primary" @click="deleteFiles(5,2)">删除</el-button>
                  </div>
                </div>
              </el-col>
            </el-row>
            <el-row class="ppd">
              <el-col :span="24" class="labelswr" style="height: auto;">
                <el-row>
                  <el-col :span="12">
                    <span>填写人</span>
                    <el-input v-model="yjdczzName" :disabled="true" class="search-input" placeholder="" size="small"/>
                  </el-col>
                  <el-col :span="12">
                    <el-radio-group v-if="findType === 13" v-model="yjdczzCheck" style="margin-top: 7px;">
                      <el-radio :label="1">通过</el-radio>
                      <el-radio :label="2">不通过</el-radio>
                    </el-radio-group>
                  </el-col>
                </el-row>
                <el-row style="margin-top:10px;margin-bottom:15px">
                  <el-col :span="12">
                    <span>审核人</span>
                    <el-input v-model="yjdczzCheckName" :disabled="true" class="search-input" placeholder="" size="small"/>
                  </el-col>
                  <el-col :span="12">
                    <span>完成日期</span>
                    <el-date-picker
                      v-model="yjdczzdate"
                      :picker-options="pickerOptionsStart"
                      :editable="false"
                      :disabled="true"
                      class="search-input"
                      size="small"
                      type="date"
                      placeholder="日期"
                      value-format="timestamp"
                    />
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row class="ppd">
          <el-col :span="24" class="labelsws">
            结案（品保部门）
          </el-col>
        </el-row>
        <el-row class="ppd">
          <el-col :span="24" class="labelswr" style="height: auto;padding-bottom: 15px;">
            <el-radio-group v-model="overqc" :disabled="billInfo===null||billInfo.rowInfo===undefined||billInfo.rowInfo.findPB!==undefined||findType === -1||findType === 4||findType === 11||findType === 10||findType === 0||findType === 1||findType === 3||findType === 15" style="margin-bottom:10px">
              <el-radio :label="0">结案</el-radio>
              <el-radio :label="1">未结案</el-radio>
              <el-radio :label="2">其他</el-radio>
            </el-radio-group>
            <el-input v-model="overContent" :rows="4" :disabled="billInfo===null||billInfo.rowInfo===undefined||billInfo.rowInfo.findPB!==undefined||findType === -1||findType === 4||findType === 10||findType === 0||findType === 1||findType === 3||findType === 15" class="search-input" style="width:98%" type="textarea" placeholder="请输入" size="small" maxlength="200"/>
            <div class="sts">
              <el-upload
                v-if="findType>1&&findType !== 15&&findType !== 3&&findType !== 4&&findType !== 10&&findType !== 11&&findType !== -1"
                ref="upload"
                :auto-upload="true"
                :on-success="onSuccess"
                :on-error="onError"
                :action="fileUrl"
                :show-file-list="false"
                :before-upload="beforeUpload6"
                :with-credentials="true"
                style="float: left; margin-right: 15px"
                accept=".xls,.xlsx,.pdf,.doc,.docx,.ppt,.pptx,.png,.jpg"
                class="upload-demo"
              >
                <el-button v-loading="loading" slot="trigger" size="small" class="uploads" type="primary"><svg-icon icon-class="import"/>  上传文件</el-button>
              </el-upload>
              <div v-if="fileList6.length>0" class="stdiv">
                <div class="settex">{{ fileList6[0].name }}</div>
                <el-button slot="trigger" size="small" class="uploads" type="primary" @click="download(fileList6[0].id)">下载</el-button>
                <el-button v-if="findType>2&&findType !== 15" slot="trigger" size="small" class="uploads" type="primary" @click="deleteFiles(6,0)">删除</el-button>
              </div>
              <div v-if="fileList6.length>1" class="stdiv">
                <div class="settex">{{ fileList6[1].name }}</div>
                <el-button slot="trigger" size="small" class="uploads" type="primary" @click="download(fileList6[1].id)">下载</el-button>
                <el-button v-if="findType>2&&findType !== 15" slot="trigger" size="small" class="uploads" type="primary" @click="deleteFiles(6,1)">删除</el-button>
              </div>
              <div v-if="fileList6.length>2" class="stdiv">
                <div class="settex">{{ fileList6[2].name }}</div>
                <el-button slot="trigger" size="small" class="uploads" type="primary" @click="download(fileList6[2].id)">下载</el-button>
                <el-button v-if="findType>2&&findType !== 15" slot="trigger" size="small" class="uploads" type="primary" @click="deleteFiles(6,2)">删除</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row class="ppd">
          <el-col :span="24" class="labelswr" style="padding-top: 4px;">
            <div style="margin-left: 15px;float:left">
              <span>填写人</span>
              <el-input v-model="overName" :disabled="true" class="search-input" placeholder="" size="small"/>
            </div>
            <div style="margin-right: 15px;float:right">
              <span>审核人</span>
              <el-input v-model="overCheckName" :disabled="true" class="search-input" placeholder="" size="small"/>
              <el-radio-group v-if="findType === 15" v-model="overCheck">
                <el-radio :label="1">通过</el-radio>
                <el-radio :label="2">不通过</el-radio>
              </el-radio-group>
            </div>
          </el-col>
        </el-row>
      </div>
      <div ref="prints" class="print" style="width:285mm;font-size:18px;display:none">
        <div style="border: 1px solid #000;padding-bottom: 10px;color:#000">
          <div style="width: 100%;text-align: center;font-weight: bold;font-size: 28px;margin-top: 15px;color:#000">
            品质异常处理单
            <div style="font-size: 16px;font-weight: normal;padding-right: 15px;position: relative;right: -418px;top: -22px;color:#000">
              <span style="border: 1px solid;padding: 2px 5px;border-right: 0;color:#000">
                一般记录（<span v-if="level === 0">√</span>）
              </span>
              <span style="border: 1px solid;padding: 2px 5px;color:#000">
                重大异常（<span v-if="level === 1">√</span>）
              </span>
            </div>
          </div>
          <el-row style="margin-bottom:5px">
            <el-col :span="12" style="padding-left: 15px;text-align:left;color:#000">
              <div>日期：{{ printDate }}</div>
            </el-col>
            <el-col :span="12" style="padding-right: 15px;text-align:right;color:#000">
              <div>报告编号: {{ reportNo }}</div>
            </el-col>
          </el-row>
          <el-row style="border: 2px solid #000;margin: 0 15px;">
            <el-col :span="3" style="text-align: center;padding: 5px;border-right: 2px solid #000;">
              型号
            </el-col>
            <el-col :span="5" style="text-align: center;padding: 5px;border-right: 2px solid #000;;height: 26px;">
              {{ model }}
            </el-col>
            <el-col :span="3" style="text-align: center;padding: 5px;border-right: 2px solid #000;">
              批号
            </el-col>
            <el-col :span="6" style="text-align: center;padding: 5px;border-right: 2px solid #000;;height: 26px;">
              {{ batchNo }}
            </el-col>
            <el-col :span="3" style="text-align: center;padding: 5px;border-right: 2px solid #000;">
              异常工序
            </el-col>
            <el-col :span="4" style="text-align: center;padding: 5px;;height: 26px;">
              {{ processName }}
            </el-col>
          </el-row>
          <el-row style="border: 2px solid #000;margin: 0 15px;border-top:0">
            <el-col :span="3" style="text-align: center;padding: 5px;border-right: 2px solid #000;">
              抽检数
            </el-col>
            <el-col :span="5" style="text-align: center;padding: 5px;border-right: 2px solid #000;;height: 26px;">
              {{ checksNum }}
            </el-col>
            <el-col :span="3" style="text-align: center;padding: 5px;border-right: 2px solid #000;">
              不良数
            </el-col>
            <el-col :span="6" style="text-align: center;padding: 5px;border-right: 2px solid #000;;height: 26px;">
              {{ badNum }}
            </el-col>
            <el-col :span="3" style="text-align: center;padding: 5px;border-right: 2px solid #000;">
              不良率
            </el-col>
            <el-col :span="4" style="text-align: center;padding: 5px;;height: 26px;">
              {{ badRateVal }}
            </el-col>
          </el-row>
          <el-row style="border: 2px solid #000;margin: 0 15px;border-top:0">
            <el-col :span="24" style="text-align: center;padding: 5px;">
              <input :checked="types.indexOf(0)>-1" type="checkbox" value="0"><span style="margin-left:10px;margin-right:30px">原材料异常</span>
              <input :checked="types.indexOf(1)>-1" type="checkbox" value="1"><span style="margin-left:10px;margin-right:30px">制程异常</span>
              <input :checked="types.indexOf(2)>-1" type="checkbox" value="2"><span style="margin-left:10px;margin-right:30px">成品异常</span>
              <input :checked="types.indexOf(3)>-1" type="checkbox" value="3"><span style="margin-left:10px;margin-right:30px">出货异常</span>
              <input :checked="types.indexOf(4)>-1" type="checkbox" value="4"><span style="margin-left:10px;">其他</span>
              <el-input v-if="types.indexOf(4)>-1" v-model="qtContent" class="search-input" placeholder="请输入其他说明" size="mini" style="font-size: 16px;" maxlength="20"/>
            </el-col>
          </el-row>
          <el-row style="border: 2px solid #000;margin: 0 15px;border-top:0">
            <el-col :span="24">
              <div style="border-bottom: 1px solid rgb(0, 0, 0);text-align: center;padding: 5px;">
                异常描述（发现部门）
              </div>
              <div style="border-bottom: 1px solid rgb(0, 0, 0);text-align: center;">
                <el-input v-model="badContent" :autosize="{ minRows: 6}" style="font-size: 16px;width: 100%;text-align: center;border-radius: 0px;" type="textarea" size="small" maxlength="1000"/>
              </div>
              <el-row style="border-bottom: 1px solid rgb(0, 0, 0);">
                <el-col :span="3" style="padding: 8px;text-align: center;border-right: 1px solid #000;">
                  <div>责任部门</div>
                </el-col>
                <el-col :span="21" style="padding: 5px;text-align: center;padding-top: 9px;">
                  <input :checked="analysesDept.indexOf(0)>-1" type="checkbox" value="0"><span style="margin-left:10px;margin-right:30px">外延部</span>
                  <input :checked="analysesDept.indexOf(1)>-1" type="checkbox" value="1"><span style="margin-left:10px;margin-right:30px">芯片部</span>
                  <input :checked="analysesDept.indexOf(2)>-1" type="checkbox" value="2"><span style="margin-left:10px;margin-right:30px">厂务部</span>
                  <input :checked="analysesDept.indexOf(3)>-1" type="checkbox" value="3"><span style="margin-left:10px;margin-right:30px">采购部</span>
                  <input :checked="analysesDept.indexOf(4)>-1" type="checkbox" value="4"><span style="margin-left:10px;margin-right:30px">技术部</span>
                  <input :checked="analysesDept.indexOf(5)>-1" type="checkbox" value="5"><span style="margin-left:10px;">生产管理部</span>
                </el-col>
              </el-row>
              <el-row style="margin-bottom:5px">
                <el-col :span="12" style="padding: 5px;padding-left: 15px;text-align:left">
                  <div>填写人：{{ createName }}</div>
                </el-col>
                <el-col :span="12" style="padding: 5px;padding-right: 15px;text-align:right">
                  <div>审核人: {{ createCheckName }}</div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row style="border: 2px solid #000;margin: 0 15px;border-top:0">
            <el-col :span="24">
              <div style="border-bottom: 1px solid rgb(0, 0, 0);text-align: center;padding: 5px;">
                原因分析（责任部门）
              </div>
              <div v-if="billInfo!==null&&billInfo.rowInfo!==undefined&&billInfo.rowInfo.resultDetails.analyses!==undefined&&billInfo.rowInfo.resultDetails.analyses.length>1" style="border-bottom: 1px solid rgb(0, 0, 0);text-align: center;">
                <div v-for="(item, index) in billInfo.rowInfo.resultDetails.analyses" :key="item.id">
                  <div style="text-align: left;padding: 5px 15px;">{{ item.name }}</div>
                  <el-input v-model="billInfo.rowInfo.resultDetails.analyses[index].content" :rows="6" style="font-size: 16px;width: 100%;text-align: center;border-radius: 0px;" type="textarea" size="small" maxlength="1000"/>
                  <el-row style="margin-bottom: 5px;border-top: 1px solid #000;border-bottom: 1px solid #000;">
                    <el-col :span="12" style="padding: 5px;padding-left: 15px;text-align:left">
                      <div>分析人：{{ billInfo.rowInfo.resultDetails.analyses[index].creatorName }}</div>
                    </el-col>
                    <el-col :span="12" style="padding: 5px;padding-right: 15px;text-align:right">
                      <div>审核: {{ billInfo.rowInfo.resultDetails.analyses[index].auditorName }}</div>
                    </el-col>
                  </el-row>
                </div>
                <el-input v-if="billInfo!==null&&billInfo.rowInfo!==undefined&&billInfo.rowInfo.resultDetails.analyses!==undefined&&billInfo.rowInfo.resultDetails.analyses.length===1" v-model="billInfo.rowInfo.resultDetails.analyses[0].content" :rows="6" style="font-size: 16px;width: 100%;text-align: center;border-radius: 0px;" type="textarea" size="small" maxlength="1000"/>
                <el-input v-if="billInfo===null||billInfo.rowInfo===undefined||billInfo.rowInfo.resultDetails.analyses===undefined||billInfo.rowInfo.resultDetails.analyses.length===0" :rows="6" style="width: 100%;text-align: center;border-radius: 0px;font-size: 16px;" type="textarea" size="small" maxlength="1000"/>
                <el-row v-if="billInfo!==null&&billInfo.rowInfo!==undefined&&billInfo.rowInfo.resultDetails.analyses!==undefined&&billInfo.rowInfo.resultDetails.analyses.length===1" style="margin-bottom: 5px;border-top: 1px solid #000;">
                  <el-col :span="12" style="padding: 5px;padding-left: 15px;text-align:left">
                    <div>分析人：{{ billInfo.rowInfo.resultDetails.analyses[0].creatorName }}</div>
                  </el-col>
                  <el-col :span="12" style="padding: 5px;padding-right: 15px;text-align:right">
                    <div>审核: {{ billInfo.rowInfo.resultDetails.analyses[0].auditorName }}</div>
                  </el-col>
                </el-row>
              </div>
              <div v-if="billInfo===null||billInfo.rowInfo===undefined||billInfo.rowInfo.resultDetails.analyses===undefined||billInfo.rowInfo.resultDetails.analyses.length<2" style="border-bottom: 1px solid rgb(0, 0, 0);text-align: center;">
                <el-input v-if="billInfo!==null&&billInfo.rowInfo!==undefined&&billInfo.rowInfo.resultDetails.analyses!==undefined&&billInfo.rowInfo.resultDetails.analyses.length===1" v-model="billInfo.rowInfo.resultDetails.analyses[0].content" :rows="6" style="font-size: 16px;width: 100%;text-align: center;border-radius: 0px;" type="textarea" size="small" maxlength="1000"/>
                <el-input v-if="billInfo===null||billInfo.rowInfo===undefined||billInfo.rowInfo.resultDetails.analyses===undefined||billInfo.rowInfo.resultDetails.analyses.length===0" :rows="6" style="width: 100%;text-align: center;border-radius: 0px;font-size: 16px;" type="textarea" size="small" maxlength="1000"/>
                <el-row v-if="billInfo!==null&&billInfo.rowInfo!==undefined&&billInfo.rowInfo.resultDetails.analyses!==undefined&&billInfo.rowInfo.resultDetails.analyses.length===1" style="margin-bottom: 5px;border-top: 1px solid #000;">
                  <el-col :span="12" style="padding: 5px;padding-left: 15px;text-align:left">
                    <div>分析人：{{ billInfo.rowInfo.resultDetails.analyses[0].creatorName }}</div>
                  </el-col>
                  <el-col :span="12" style="padding: 5px;padding-right: 15px;text-align:right">
                    <div>审核: {{ billInfo.rowInfo.resultDetails.analyses[0].auditorName }}</div>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
          <el-row style="border: 2px solid #000;margin: 0 15px;border-top:0">
            <el-col :span="12" style="border-right: 1px solid rgb(0, 0, 0);">
              <div style="border-bottom: 1px solid rgb(0, 0, 0);text-align: center;padding: 5px;">
                临时对策（品保）
              </div>
              <div style="border-bottom: 1px solid rgb(0, 0, 0);text-align: center;">
                <div style="border-bottom: 1px solid rgb(0, 0, 0);text-align: center;padding: 10px;padding-top: 11px;">
                  <input :checked="lstype===0" type="radio" value="0"><span style="margin-left:5px;margin-right:5px">返工({{ num0 }}片)</span>
                  <input :checked="lstype===1" type="radio" value="1"><span style="margin-left:5px;margin-right:5px">报废({{ num1 }}片)</span>
                  <input :checked="lstype===2" type="radio" value="2"><span style="margin-left:5px;margin-right:5px">降级({{ num2 }}片)</span>
                  <input :checked="lstype===3" type="radio" value="3"><span style="margin-left:5px;">其他({{ num3 }}片)</span>
                </div>
                <el-input v-model="lsContent" :rows="5" style="font-size: 16px;width: 100%;text-align: center;border-radius: 0px;" type="textarea" size="small" maxlength="1000"/>
              </div>
              <el-row style="margin-bottom:5px">
                <el-col :span="12" style="padding: 5px;padding-left: 15px;text-align:left">
                  <div>填写人：{{ lsName }}</div>
                </el-col>
                <el-col :span="12" style="padding: 5px;padding-right: 15px;text-align:right">
                  <div>审核: {{ lsCheckName }}</div>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="12">
              <div style="border-bottom: 1px solid rgb(0, 0, 0);text-align: center;padding: 5px;">
                追踪结果（品保）
              </div>
              <div style="border-bottom: 1px solid rgb(0, 0, 0);text-align: center;">
                <el-input v-model="lszzContent" :rows="7" style="font-size: 16px;width: 100%;text-align: center;border-radius: 0px;" type="textarea" size="small" maxlength="1000"/>
              </div>
              <el-row style="margin-bottom:5px">
                <el-col :span="12" style="padding: 5px;padding-left: 15px;text-align:left">
                  <div>填写人：{{ lszzName }}</div>
                </el-col>
                <el-col :span="12" style="padding: 5px;padding-right: 15px;text-align:right">
                  <div>审核: {{ lszzCheckName }}</div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="billInfo===null||billInfo.rowInfo===undefined||billInfo.rowInfo.resultDetails.perpetualStrategy===undefined" style="border: 2px solid #000;margin: 0 15px;border-top:0">
            <el-col :span="12" style="border-right: 1px solid rgb(0, 0, 0);">
              <div style="border-bottom: 1px solid rgb(0, 0, 0);text-align: center;padding: 5px;">
                永久对策（责任部门）
              </div>
              <div style="border-bottom: 1px solid rgb(0, 0, 0);text-align: center;">
                <el-input v-model="text" :rows="5" style="font-size: 16px;width: 100%;text-align: center;border-radius: 0px;" type="textarea" size="small" maxlength="1000"/>
              </div>
              <el-row style="margin-bottom:5px">
                <el-col :span="12" style="padding: 5px;padding-left: 15px;text-align:left">
                  <div>填写人：{{ yjName }}</div>
                </el-col>
                <el-col :span="12" style="padding: 5px;padding-right: 15px;text-align:right">
                  <div>审核: {{ yjCheckName }}</div>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="12">
              <div style="border-bottom: 1px solid rgb(0, 0, 0);text-align: center;padding: 5px;">
                追踪结果（品保）
              </div>
              <div style="border-bottom: 1px solid rgb(0, 0, 0);text-align: center;">
                <el-input v-model="yjdczzContent" :rows="5" style="font-size: 16px;width: 100%;text-align: center;border-radius: 0px;" type="textarea" size="small" maxlength="1000"/>
              </div>
              <el-row style="margin-bottom:5px">
                <el-col :span="12" style="padding: 5px;padding-left: 15px;text-align:left">
                  <div>填写人：{{ yjdczzName }}</div>
                </el-col>
                <el-col :span="12" style="padding: 5px;padding-right: 15px;text-align:right">
                  <div>审核: {{ yjdczzCheckName }}</div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="billInfo!==null&&billInfo.rowInfo!==undefined&&billInfo.rowInfo.resultDetails.perpetualStrategy!==undefined&&billInfo.rowInfo.resultDetails.perpetualStrategy.length === 1" style="border: 2px solid #000;margin: 0 15px;border-top:0">
            <el-col :span="12" style="border-right: 1px solid rgb(0, 0, 0);">
              <div style="border-bottom: 1px solid rgb(0, 0, 0);text-align: center;padding: 5px;">
                永久对策（责任部门）
              </div>
              <div style="border-bottom: 1px solid rgb(0, 0, 0);text-align: center;">
                <el-input v-model="billInfo.rowInfo.resultDetails.perpetualStrategy[0].content" :rows="5" style="font-size: 16px;width: 100%;text-align: center;border-radius: 0px;" type="textarea" size="small" maxlength="1000"/>
              </div>
              <el-row style="margin-bottom:5px">
                <el-col :span="12" style="padding: 5px;padding-left: 15px;text-align:left">
                  <div>填写人：{{ billInfo.rowInfo.resultDetails.perpetualStrategy[0].creatorName }}</div>
                </el-col>
                <el-col :span="12" style="padding: 5px;padding-right: 15px;text-align:right">
                  <div>审核: {{ billInfo.rowInfo.resultDetails.perpetualStrategy[0].auditorName }}</div>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="12">
              <div style="border-bottom: 1px solid rgb(0, 0, 0);text-align: center;padding: 5px;">
                追踪结果（品保）
              </div>
              <div style="border-bottom: 1px solid rgb(0, 0, 0);text-align: center;">
                <el-input v-model="yjdczzContent" :rows="5" style="font-size: 16px;width: 100%;text-align: center;border-radius: 0px;" type="textarea" size="small" maxlength="1000"/>
              </div>
              <el-row style="margin-bottom:5px">
                <el-col :span="12" style="padding: 5px;padding-left: 15px;text-align:left">
                  <div>填写人：{{ yjdczzName }}</div>
                </el-col>
                <el-col :span="12" style="padding: 5px;padding-right: 15px;text-align:right">
                  <div>审核: {{ yjdczzCheckName }}</div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="billInfo!==null&&billInfo.rowInfo!==undefined&&billInfo.rowInfo.resultDetails.perpetualStrategy!==undefined&&billInfo.rowInfo.resultDetails.perpetualStrategy.length > 1" style="border: 2px solid #000;margin: 0 15px;border-top:0">
            <el-col :span="24" style="border-right: 1px solid rgb(0, 0, 0);">
              <div style="border-bottom: 1px solid rgb(0, 0, 0);text-align: center;padding: 5px;">
                永久对策（责任部门）
              </div>
              <div v-for="(item, index) in billInfo.rowInfo.resultDetails.perpetualStrategy" :key="item.id" style="border-bottom: 1px solid rgb(0, 0, 0);text-align: center;">
                <div style="text-align: left;padding-left: 15px;padding-top: 5px;padding-bottom: 5px;">{{ item.name }}</div>
                <el-input v-model="billInfo.rowInfo.resultDetails.perpetualStrategy[index].content" :rows="5" style="font-size: 16px;width: 100%;text-align: center;border-radius: 0px;" type="textarea" size="small" maxlength="1000"/>
                <el-row style="margin-bottom:5px;border-top:1px solid #000">
                  <el-col :span="12" style="padding: 5px;padding-left: 15px;text-align:left">
                    <div>填写人：{{ billInfo.rowInfo.resultDetails.perpetualStrategy[index].creatorName }}</div>
                  </el-col>
                  <el-col :span="12" style="padding: 5px;padding-right: 15px;text-align:right">
                    <div>审核: {{ billInfo.perpetualStrategy[index].auditorName }}</div>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
          <el-row v-if="billInfo!==null&&billInfo.rowInfo!==undefined&&billInfo.rowInfo.resultDetails.perpetualStrategy!==undefined&&billInfo.rowInfo.resultDetails.perpetualStrategy.length > 1" style="border: 2px solid #000;margin: 0 15px;border-top:0">
            <el-col :span="24">
              <div style="border-bottom: 1px solid rgb(0, 0, 0);text-align: center;padding: 5px;">
                追踪结果（品保）
              </div>
              <div style="border-bottom: 1px solid rgb(0, 0, 0);text-align: center;">
                <el-input v-model="yjdczzContent" :rows="5" style="font-size: 16px;width: 100%;text-align: center;border-radius: 0px;" type="textarea" size="small" maxlength="1000"/>
              </div>
              <el-row style="margin-bottom:5px">
                <el-col :span="12" style="padding: 5px;padding-left: 15px;text-align:left">
                  <div>填写人：{{ yjdczzName }}</div>
                </el-col>
                <el-col :span="12" style="padding: 5px;padding-right: 15px;text-align:right">
                  <div>审核: {{ yjdczzCheckName }}</div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row style="border: 2px solid #000;margin: 0 15px;border-top:0">
            <el-col :span="24">
              <div style="border-bottom: 1px solid rgb(0, 0, 0);text-align: center;padding: 5px;">
                结案闭环（品保）
              </div>
              <div style="border-bottom: 1px solid rgb(0, 0, 0);line-height: 32px;">
                <!-- <el-radio-group v-model="overqc" style="padding-bottom: 5px;width: 100%;text-align: center;padding-top: 5px;border-bottom:1px solid #000">
                  <el-radio :label="0">结案</el-radio>
                  <el-radio :label="1">未结案</el-radio>
                  <el-radio :label="2">其他</el-radio>
                </el-radio-group> -->
                <div style="padding-bottom: 0px;width: 100%;text-align: center;padding-top: 1px;border-bottom:1px solid #000">
                  <input :checked="overqc===0" type="radio" value="0"><span style="margin-left:5px;margin-right:5px">结案</span>
                  <input :checked="overqc===1" type="radio" value="1"><span style="margin-left:5px;margin-right:5px">未结案</span>
                  <input :checked="overqc===2" type="radio" value="2"><span style="margin-left:5px;margin-right:5px">其他</span>
                </div>
                <el-input v-model="overContent" :rows="4" style="font-size: 16px;width:100%" type="textarea" size="small" maxlength="200"/>
              </div>
              <el-row style="margin-bottom:5px">
                <el-col :span="12" style="padding: 5px;padding-left: 15px;text-align:left">
                  <div>填写人：{{ overName }}</div>
                </el-col>
                <el-col :span="12" style="padding: 5px;padding-right: 15px;text-align:right">
                  <div>审核: {{ overCheckName }}</div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <!-- <div style="padding-left: 15px;">
            <p>表单传递顺序：</p>
            <p style="margin-left: 85px;">1、发现部门与责任部门系同部门：发现部门→责任部门→品保</p>
            <p style="margin-left: 85px;">2、发现部门与责任部门系不同部门：发现部门→品保→责任部门→品保</p>
          </div> -->
        </div>
        <div data-v-1533022d="" data-v-511c610e="" style="text-align: right;margin-top: 5px;font-weight: bold;margin-right: 15px;">
          <span> From ET/R-QA-017</span>
          <span style="margin-left: 15px;"> Rev:A1</span>
          <span style="margin-left: 15px;"> 20160802</span>
        </div>
      </div>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="showDialog"
      top="60px"
      class="padding-dialogs sssf"
      title="异常单跟踪"
      width="600px">
      <div class="stylsss" style="overflow: auto;">
        <el-steps :active="logList.length" direction="vertical">
          <el-step v-for="(item, index) in logList" :key="index" :description="item.dayVal + ' ' + item.timeVal" :title="item.content" icon="el-icon-circle-check-outline" class="stepsuccess"/>
        </el-steps>
      </div>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="checkDialog"
      top="60px"
      class="padding-dialog"
      title="审核提示"
      width="400px">
      <div style="text-align: center;height: 10px;">
        请选择审核结果
      </div>
      <span slot="footer" class="dialog-footer" style="text-align:center">
        <el-button type="primary" size="small" @click="checkType(0)">通 过</el-button>
        <el-button type="primary" size="small" @click="checkType(1)">不通过</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="lsDialog"
      top="60px"
      class="padding-dialogs"
      title="Wafer详情"
      width="800px">
      <div style="text-align:center">
        <el-table
          v-if="lstype !== 5"
          ref="history"
          :data="list"
          element-loading-text="拼命加载中"
          height="calc(100vh - 329px)"
          class="run-table"
          border
          fit
          stripe
          @selection-change="handleSelectionChange">
          <el-table-column :selectable="checkList" type="selection" width="55"/>
          <el-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="批次号" align="center" prop="batchNo"/>
          <el-table-column label="片号" align="center" prop="waferNo"/>
          <el-table-column label="对策" align="center" prop="types" width="80px"/>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="saveType()">保 存</el-button>
        <el-button type="primary" size="small" @click="lsDialog = false">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="lsDialog1"
      top="60px"
      class="padding-dialogs"
      title="Wafer详情"
      width="800px">
      <div style="text-align:center">
        <el-table
          :data="list"
          element-loading-text="拼命加载中"
          height="calc(100vh - 329px)"
          class="run-table"
          border
          fit
          stripe>
          <el-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="批次号" align="center" prop="batchNo"/>
          <el-table-column label="片号" align="center" prop="waferNo"/>
          <el-table-column label="对策" align="center" prop="types" width="80px"/>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="lsDialog1 = false">关 闭</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .app-container >>> .is-disabled .el-input__inner{
    color: #000;
  }
  .app-container >>> .is-disabled .el-textarea__inner{
    color: #000;
  }
  .app-container >>> .is-disabled.is-checked .el-checkbox__inner{
    background-color: #009494;
    border-color: #009494;
  }
  .app-container >>> .is-disabled.is-checked .el-radio__inner{
    background-color: #009494;
    border-color: #009494;
  }
  .app-container >>> .is-disabled.is-checked .el-checkbox__label{
    color: #009494;
  }
  .app-container >>> .is-disabled .el-checkbox__label{
    color: #606266;
  }
  .app-container >>> .is-disabled .el-radio__label{
    color: #606266;
  }
  .stylsss{
    text-align: center;
    max-height: 500px;
    padding-left: 147px;
    overflow: auto;
    display: flex;
    justify-content: center;
  }
  .sssf>>> .el-dialog__body {
    padding-bottom: 20px;
  }
  .stepsuccess >>> .is-finish {
    color: #009494;
    border-color: #009494;
  }
  .stepsuccess >>> .el-step__title{
    font-weight: bold;
    font-size: 14px;
    color: #666;
  }
  .stepsuccess >>> .el-step__description{
    font-size: 14px;
    position: absolute;
    top: 7px;
    left: -184px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 203px);
  }
  .title{
    font-size: 25px;
    letter-spacing: 3px;
    text-align: center;
    margin-bottom:15px;
  }
  .new-body{
    border: 1px solid #b2dfdf;
    width: 1300px;
    padding: 10px;
    text-align: center;
    margin: 0 auto;
  }
  .impLog{
    color: #F56C6C;
  }
  .search-input{
    width: 200px;
  }
  .labelst{
    height: 40px;
    text-align: right;
    padding-top: 12px;
    padding-right: 15px;
    font-weight: bold;
    font-size: 14px;
  }
  .labelsw{
    height: 40px;
    text-align: right;
    padding-top: 12px;
    padding-right: 15px;
    background: #ebf7f7;
    border: 1px solid #b2dfdf;
    font-weight: bold;
    font-size: 14px;
    border-right: 0px;
  }
  .labelswr{
    height: 40px;
    text-align: center;
    padding-top: 12px;
    border: 1px solid #b2dfdf;
    border-top: 0px;
    font-weight: bold;
    font-size: 14px;
  }
  .labelsws{
    height: 40px;
    text-align: center;
    padding-top: 12px;
    background: #ebf7f7;
    border: 1px solid #b2dfdf;
    border-top: 0px;
    font-weight: bold;
    font-size: 14px;
  }
  .inputbor{
    height: 40px;
    padding-top: 3px;
  }
  .inputbors{
    height: 40px;
    padding-top: 3px;
    border: 1px solid #b2dfdf;
  }
  .ppd{
    padding-right: 0px;
  }
  .uploads{
    background: #fff;
    color: #009494;
    border: 0px;
    padding: 0;
  }
  .sts{
    margin-top: 12px;
    padding-left: 15px;
  }
  .stdiv{
    width: 350px;
    float: left;
    margin-left: 15px;
  }
  .stdivs{
    margin-bottom: 10px;
    margin-left: 15px;
  }
  .settex{
    width: 275px;
    float: left;
    text-align: left;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .settexs{
    width: 455px;
    float: left;
    text-align: left;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .tab-control span{
    width: 90px;
    line-height: 17px;
    padding-bottom: 5px;
  }
  .tab-control{
    margin-bottom: 5px;
  }
  .tab-control span+span{
    width: 90px;
  }
  @media print {
    .print{
        display:block !important;
    }
  }
  .padding-dialog>>> .el-dialog__footer{
    text-align: center;
  }
  .padding-dialogs>>> .el-checkbox{
    margin-left: 20px;
    display: block;
  }
  .buttonTypechuli {
    background: #FFB800;
    border-color:#FFB800;
    color: #fff;
    font-size: 12px;
  }
  .stylsss >>> .el-step__head{
    height: 70px;
  }
</style>
