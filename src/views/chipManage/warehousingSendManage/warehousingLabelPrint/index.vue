<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto">
      <el-row>
        <el-col v-if="isActive === 0" :span="16">
          <div style="text-align:left">
            <span class="input-title setcenter">选择打印标签</span>
            <el-select v-model="selects" class="search-input centerinput" style="width: 295px;" size="small" placeholder="请选择" filterable @change="startPrints">
              <el-option
                v-for="item in selectOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
            <span v-if="isshouyg" class="input-title" style="width:70px;margin-left:15px">产品型号 </span>
            <el-select v-if="isshouyg" v-model="products" class="search-input centerinput" size="small" placeholder="请选择" filterable @change="ygfinds">
              <el-option
                v-for="item in productsList"
                :key="item.modelId"
                :label="item.modelName"
                :value="item.modelId"/>
            </el-select>
            <span v-if="isshouyg" class="input-title" style="width:35px;margin-left:15px">品名 </span>
            <el-select v-if="isshouyg" v-model="ygid" class="search-input centerinput" size="small" placeholder="请选择" filterable>
              <el-option
                v-for="item in yglist"
                :key="item.id"
                :label="item.val"
                :value="item.id"/>
            </el-select>
            <span class="input-title setcenter"><svg-icon icon-class="tiaomasm" style="color:#009494;margin-right: 10px;font-size: 18px;"/>片号扫描</span>
            <el-input v-model="waferNo" class="search-input centerinput" style="width:320px" placeholder="请输入片号" size="small" maxlength="100" @keyup.enter.native="fetchData"/>
          </div>
        </el-col>
        <el-col v-if="isActive === 1" :span="16">
          <div style="text-align: left;display: flex;align-items: center;justify-content: left;">
            <span class="input-title setcenter">选择打印标签</span>
            <el-select v-model="selects" class="search-input centerinput" style="width: 295px;" size="small" placeholder="请选择" filterable @change="startPrints">
              <el-option
                v-for="item in selectOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
            <span v-if="isshouyg" class="input-title" style="width:70px;margin-left:15px">产品型号 </span>
            <el-select v-if="isshouyg" v-model="products" class="search-input centerinput" size="small" placeholder="请选择" filterable @change="ygfinds">
              <el-option
                v-for="item in productsList"
                :key="item.modelId"
                :label="item.modelName"
                :value="item.modelId"/>
            </el-select>
            <span v-if="isshouyg" class="input-title" style="width:35px;margin-left:15px">品名 </span>
            <el-select v-if="isshouyg" v-model="ygid" class="search-input centerinput" size="small" placeholder="请选择" filterable>
              <el-option
                v-for="item in yglist"
                :key="item.id"
                :label="item.val"
                :value="item.id"/>
            </el-select>
            <el-upload
              ref="upload"
              :auto-upload="true"
              :on-success="onSuccess"
              :on-error="onError"
              :action="fileUrl"
              :show-file-list="false"
              :before-upload="beforeUpload"
              :with-credentials="true"
              style="margin-left: 15px;width:150px"
              accept=".xls,.xlsx"
              class="upload-demo"
            >
              <el-button v-loading="loading" slot="trigger" size="small" type="primary"><svg-icon icon-class="shangchuan"/>  上传文件</el-button>
            </el-upload>
          </div>
        </el-col>
        <el-col :span="8" style="text-align:right">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="searchImg"
          > 查看</el-button>
          <el-button
            size="small"
            type="primary"
            @click="printStart"
          ><svg-icon icon-class="print"/> 打印</el-button>
          <el-button
            size="small"
            type="primary"
            @click="setttingPrint"
          ><svg-icon icon-class="shezhi"/>  打印设置</el-button>
          <el-button
            size="small"
            type="primary"
            @click="printLog"
          ><svg-icon icon-class="lishibb"/> 打印日志</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="app-container">
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
        <el-checkbox v-model="isRepeat" style="float: right;margin-top: 7px;font-weight: bold;"> 忽略重复</el-checkbox>
      </div>
      <el-table
        v-loading="listLoading"
        ref="newfac"
        :data="list"
        element-loading-text="拼命加载中"
        height="calc(100vh - 270px)"
        border
        fit
        highlight-current-row>
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
    <div ref="prints" class="print" style="width:210mm;font-weight:bold;display:none">
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
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible"
      class="tip-out-inner-dialog"
      title="打印设置"
      width="800px">
      <div style="padding-bottom: 15px;margin-top: -15px;">
        <span class="input-title" style="width:35px">产品 </span>
        <el-select v-model="productInfo" class="search-input centerinput" size="small" placeholder="请选择" filterable clearable>
          <el-option
            v-for="item in productList"
            :key="item.id"
            :label="item.name"
            :value="item.name"/>
        </el-select>
        <!-- <el-select v-model="model" class="search-input centerinput" size="small" placeholder="请选择" filterable clearable>
          <el-option
            v-for="item in modelList"
            :key="item.id"
            :label="item.code"
            :value="item.code"/>
        </el-select> -->
        <!-- <span class="input-title" style="width:35px">光色 </span>
        <el-select v-model="color" class="search-input centerinput" size="small" placeholder="请选择" filterable clearable>
          <el-option
            v-for="item in colorOptions"
            :key="item.id"
            :label="item.code"
            :value="item.code"/>
        </el-select> -->
        <el-button
          size="small"
          type="primary"
          @click="printSetSearch"
        ><svg-icon icon-class="export"/> 搜索</el-button>
        <el-button
          class="margin-left"
          size="small"
          type="danger"
          @click="clearAllSet"
        >
          <svg-icon icon-class="clear"/> 重 置
        </el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :data="settingList"
        class="mocvd-table run-table"
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
        <el-table-column label="型号" align="center" prop="name"/>
        <el-table-column label="是否打印mapping彩图" align="center" prop="status">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isChecked" @change="setStatus(scope.row)">打印</el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="260px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-search"
              @click="handleEdit(scope.row)"
            >查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="settotalPage>12"
        :current-page="setpageNum"
        :page-sizes="[12, 30, 40]"
        :page-size="setpageSize"
        :total="settotalPage"
        class="pagination"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="setsizeChange"
        @current-change="setcurrentChange"
      />
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="checkVisible"
        title="查看"
        width="1200px"
        class="tip-out-inner-dialogs"
        append-to-body>
        <fieldset class="fieldest" style="width: 100%;margin-top: -15px;">
          <legend class="legendsty"> 基础信息 </legend>
          <div class="input-item" style="margin-top:-5px">
            <span class="input-title">型号 </span>
            <el-select v-model="newModel" :disabled="true" class="search-input" size="small" placeholder="请选择" filterable>
              <el-option
                v-for="item in modelList"
                :key="item.id"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item" style="margin-top:-5px">
            <span class="input-title">光色 </span>
            <el-select v-model="newcolor" :disabled="true" class="search-input" size="small" placeholder="请选择" filterable>
              <el-option
                v-for="item in colorOptions"
                :key="item.id"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item" style="margin-top:-5px">
            <span class="input-title">标准名称 </span>
            <el-input v-model="newName" :disabled="true" class="search-input" placeholder="" size="small" maxlength="20"/>
          </div>
        </fieldset>
        <fieldset class="fieldest" style="margin-top:15px;width:100%">
          <legend class="legendsty"> 参数设置 </legend>
          <el-table
            v-loading="listLoading"
            :data="list1"
            element-loading-text="拼命加载中"
            border
            fit
            stripe>
            <el-table-column label="参数" align="center">
              <template slot-scope="scope">
                <el-select v-model="scope.row.field" :disabled="true" class="search-input" size="mini" style="width:90%" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in newFieldList"
                    :key="item.thKey"
                    :label="item.thName"
                    :value="item.thKey"
                    :disabled="item.disabled"/>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="单位" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.unit" :disabled="true" class="search-input" style="width:90%" placeholder="" size="mini" maxlength="20"/>
              </template>
            </el-table-column>
          </el-table>
        </fieldset>
        <fieldset class="fieldest" style="margin-top:15px;width:100%">
          <legend class="legendsty"> 标色设置 </legend>
          <div id="colorSet" style="width: 1125px;overflow: auto;display: inline-flex;">
            <div v-for="(item,index) of list1" :key="index" style="padding:0 5px;width:500px">
              <el-table
                :data="item.newDataList"
                element-loading-text="拼命加载中"
                height="400px"
                class="run-table ste tip-out-inner-dialog"
                border
                fit>
                <el-table-column :label="'Color Index_'+item.field.toUpperCase()" align="center">
                  <el-table-column align="center" label="最小值" prop="min"/>
                  <el-table-column align="center" label="最大值" prop="max"/>
                  <el-table-column align="center" label="显示最小值" prop="showmin"/>
                  <el-table-column align="center" label="显示最大值" prop="showmax"/>
                  <el-table-column align="center" label="颜色">
                    <template slot-scope="scope">
                      <el-color-picker v-model="scope.row.color" :disabled="true"/>
                    </template>
                  </el-table-column>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </fieldset>
        <span slot="footer" class="dialog-footer">
          <el-button @click="checkVisible = false">关 闭</el-button>
        </span>
      </el-dialog>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="deleteDialogVisible"
      class="tip-out-inner-dialog"
      title="打印日志"
      width="1200px">
      <div style="padding-bottom: 15px;margin-top: -15px;">
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
        <span class="input-title">打印标签 </span>
        <el-select v-model="type" class="search-input centerinput" size="small" placeholder="请选择" filterable clearable>
          <el-option
            v-for="item in selectOptions"
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
        <el-table-column label="标签名称" align="center" prop="labelName"/>
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
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="searchDialogVisible"
      class="tip-out-inner-dialog"
      title="查看"
      width="500px">
      <div style="width: 100%;text-align: center;">
        <img :src="imgName" width="100%">
      </div>
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
    height: calc(100vh - 203px);
  }
  .tip-out-inner-dialogs>>>.el-color-picker__color{
    border:0;
  }
  .tip-out-inner-dialogs>>>.cell{
    height: 40px;
  }
  .tip-out-inner-dialogs>>>.el-color-picker{
    height: 30px;
  }
  .table-top-btn-group{
    overflow: hidden;
  }
  .table-top-btn-group>div{
    float: left;
    margin-left: 15px;
    height: 35px;
    line-height: 35px;
    padding: 0 15px;
    border: 1px solid #e2e2e2;
    cursor: pointer;
  }
  .table-top-btn-group>div.active{
    color: #fff;
    background: #009494;
    border-color: #009494;
  }
  .tab-control span{
    line-height: 50px;
  }
  .el-checkbox {
    margin-left: 0px;
  }
  .setcenter{
    width: 90px;
  }
  .centerinput{
    width: 170px
  }
  .setPrint{
    text-align: center;
    max-height: calc(100vh - 334px);
    margin-top: 15px;
  }
  .tip-out-inner-dialog>>>.el-dialog__body{
    padding-bottom: 60px;
  }
  .app-container>>> .el-table--border {
    border-top: 2px solid #009494;
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
  .fieldest{
    border: 1px solid #DCDFE6;
    padding: 15px;
  }
  .legendsty{
    padding-left:8px;
    padding-right:8px;
    font-weight: bold;
  }
  .search-input{
    width: 125px;
  }
  .input-item{
    float: left;
    margin-top: 14px;
    margin-right: 10px;
  }
</style>
