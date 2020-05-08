<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto">
      <el-row>
        <el-col :span="12" style="text-align:left">
          <div style="font-weight:bold">
            <span v-if="isActive === 0" class="input-title setcenter"><svg-icon icon-class="tiaomasm" style="color:#009494;margin-right: 10px;font-size: 18px;"/>片号扫描</span>
            <el-input v-if="isActive === 0" v-model="waferNo" class="search-input centerinput" style="width:320px" placeholder="请输入片号" size="small" maxlength="100" @keyup.enter.native="fetchData"/>
            <el-upload
              v-if="isActive === 1"
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
              <el-button v-loading="loading" slot="trigger" size="small" type="primary"><svg-icon icon-class="shangchuan"/>  上传</el-button>
            </el-upload>
          </div>
        </el-col>
        <el-col :span="12" style="text-align:right">
          <el-button
            size="small"
            type="primary"
            @click="printStart"
          ><svg-icon icon-class="print"/> 打印</el-button>
          <el-button
            size="small"
            type="primary"
            @click="printLog"
          ><svg-icon icon-class="lishibb"/> 打印日志</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="app-container">
      <div ref="prints" class="print" style="display:none;width:210mm;font-weight:bold;">
        <div v-for="item in bachList" :key="item.index">
          <el-row>
            <el-col :span="15" style="text-align:left">
              <div>WaferID: {{ item.waferNo }}</div>
              <div style="text-align: left;width: 100%;margin-top: 5px;">
                <img :src="item.imglist" alt="" style="width: 300px;height: 41px;">
              </div>
            </el-col>
            <el-col :span="9" style="text-align:right">
              <div style="margin-bottom: 15px;margin-top: 10px;">Model：{{ item.model }}</div>
              <div>打印日期：{{ printDate }}</div>
            </el-col>
          </el-row>
          <div style="width:210mm;margin:15px 0">
            <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" style="border-top:1px solid #666;width: 210mm;" >
              <thead>
                <tr style="background-color: #d6eeee;color: #666;">
                  <th colspan="1" rowspan="1" style="text-align:center;height:35px;border-left:1px solid #666;border-bottom:2px solid #666">
                    <div style="font-size:0.4cm;" class="cell">Test Item</div>
                  </th>
                  <th colspan="1" rowspan="1" style="text-align:center;height:35px;border-left:1px solid #666;border-bottom:2px solid #666">
                    <div style="font-size:0.4cm;" class="cell">Min</div>
                  </th>
                  <th colspan="1" rowspan="1" style="text-align:center;height:35px;border-left:1px solid #666;border-bottom:2px solid #666">
                    <div style="font-size:0.4cm;" class="cell">Avg</div>
                  </th>
                  <th colspan="1" rowspan="1" style="text-align:center;height:35px;border-left:1px solid #666;border-bottom:2px solid #666">
                    <div style="font-size:0.4cm;" class="cell">Max</div>
                  </th>
                  <th colspan="1" rowspan="1" style="text-align:center;height:35px;border-left:1px solid #666;border-right:1px solid #666;border-bottom:2px solid #666">
                    <div style="font-size:0.4cm;" class="cell">STD</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(it, index) in item.tableList" :key="index" :style="{backgroundColor:index%2!==0?'#ebf7f7':'#FFF'}">
                  <td colspan="1" rowspan="1" style="text-align:center;height:35px;color:#666;border-left:1px solid #666;border-bottom:1px solid #666">
                    <div class="cell">{{ it.item }}</div>
                  </td>
                  <td colspan="1" rowspan="1" style="text-align:center;height:35px;color:#666;border-left:1px solid #666;border-bottom:1px solid #666">
                    <div class="cell">{{ it.min }}</div>
                  </td>
                  <td colspan="1" rowspan="1" style="text-align:center;height:35px;color:#666;border-left:1px solid #666;border-bottom:1px solid #666">
                    <div class="cell">{{ it.max }}</div>
                  </td>
                  <td colspan="1" rowspan="1" style="text-align:center;height:35px;color:#666;border-left:1px solid #666;border-bottom:1px solid #666">
                    <div class="cell">{{ it.avg }}</div>
                  </td>
                  <td colspan="1" rowspan="1" style="text-align:center;height:35px;color:#666;border-left:1px solid #666;border-right:1px solid #666;border-bottom:1px solid #666">
                    <div class="cell">{{ it.std }}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <el-row>
            <div v-for="it in item.options" :key="it.index" :span="12" style="float: left;width: 47%;border: 6px solid #000;padding: 10px;border-radius: 15px;margin-bottom:10px;;margin-left:10px;">
              <chart v-if="it.image === ''" :id="'focharts'+it.index+item.index" :options="it.option" height="300px" width="341px"/>
              <img v-if="it.image !== ''" :src="it.image" alt="">
            </div>
          </el-row>
          <div style="page-break-after:always;">&nbsp;</div>
        </div>
      </div>
      <div>
        <div class="table-top-btn-group">
          <div
            :class="{'active':isActive === 0}"
            @click="navClick(0)"
          >
            批量扫描
          </div>
          <div
            :class="{'active':isActive === 1}"
            @click="navClick(1)"
          >
            文件上传
          </div>
          <span class="input-title" style="float: left;width: 70px;line-height: 35px;">共{{ list.length }}片 </span>
          <!-- <el-checkbox v-model="isRepeat" style="float: right;margin-top: 7px;font-weight: bold;"> 忽略重复</el-checkbox> -->
        </div>
        <el-table
          v-loading="listLoading"
          :data="list"
          element-loading-text="拼命加载中"
          height="calc(100vh - 235px)"
          border
          fit
          stripe>
          <el-table-column label="ID号" align="center" prop="waferNo"/>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                icon="el-icon-delete"
                type="danger"
                @click="deltetItem(scope.$index)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="deleteDialogVisible"
      class="tip-out-inner-dialog"
      title="打印日志"
      width="1200px">
      <div style="padding-bottom: 15px;">
        <span class="input-title" style="margin-left:-35px">时间 </span>
        <el-date-picker
          v-model="beginDate"
          :picker-options="pickerOptionsStart"
          :editable="false"
          class="search-input"
          style="width:130px"
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
          style="width:130px"
          size="small"
          type="date"
          placeholder="结束日期"
          value-format="timestamp"
        />
        <span class="input-title">打印类型 </span>
        <el-select v-model="type" class="search-input centerinput" size="small" placeholder="请选择" filterable clearable>
          <el-option
            v-for="item in typeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
        <el-button
          size="small"
          type="primary"
          @click="printLogSearch"
        ><svg-icon icon-class="export"/> 搜索</el-button>
        <el-button
          class="margin-left"
          size="small"
          type="danger"
          @click="clearAll"
        >
          <svg-icon icon-class="clear"/> 重 置
        </el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :data="logList"
        class="mocvd-table run-table"
        height="450px"
        element-loading-text="拼命加载中"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 + ((logpageNum-1)*logpageSize) }}
          </template>
        </el-table-column>
        <el-table-column label="片号" align="center" prop="sliceNo"/>
        <el-table-column label="打印类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.way === 0">
              单片打印
            </span>
            <span v-if="scope.row.way === 1">
              批量打印
            </span>
          </template>
        </el-table-column>
        <el-table-column label="打印时间" align="center" prop="printTime"/>
        <el-table-column label="操作人" align="center" prop="creatorName"/>
      </el-table>
      <el-pagination
        v-if="logtotalPage>12"
        :current-page="logpageNum"
        :page-sizes="[12, 30, 40]"
        :page-size="logpageSize"
        :total="logtotalPage"
        class="pagination"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="logsizeChange"
        @current-change="logcurrentChange"
      />
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  @media print {
    .print{
        display:block !important;
    }
  }
  .app-container{
    position: relative;
    height: calc(100vh - 205px);
  }
  .tab-control span{
    line-height: 50px;
  }
  .el-checkbox {
    margin-left: 0px;
  }
  .setcenter{
    width: 110px;
  }
  .centerinput{
    width: 220px
  }
  .setPrint{
    text-align: center;
    max-height: calc(100vh - 334px);
    margin-top: 20px;
    display: flex;
    justify-content: center;
    overflow: auto;
  }
  .tip-out-inner-dialog>>>.el-dialog__body{
    padding-bottom: 60px;
  }
  .titles{
    width: 100%;
    text-align: center;
    font-size: 22px;
    padding: 15px;
    color: #009494;
    font-weight: bold;
    border-bottom: 1px solid #e5e5e5;
    margin-bottom: 15px;
    padding-top: 25px;
  }
</style>
