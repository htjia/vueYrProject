<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto">
      <div class="input-item" style="float:left">
        <span class="input-title">产品代码 </span>
        <el-select v-model="product" class="search-input" size="small" placeholder="请选择" filterable clearable>
          <el-option
            v-for="item in productList"
            :key="item.id"
            :label="item.code"
            :value="item.code"/>
        </el-select>
      </div>
      <div class="input-item" style="margin-left:15px;float:left;margin-right:15px">
        <svg-icon icon-class="tiaomasm" style="color:009494;font-size: 24px;margin-right: 10px;height: 20px;"/><el-input v-model="binNo" class="search-input" style="width:200px" placeholder="扫码请录入ChipNo" size="small" maxlength="1024" clearable @keyup.enter.native="fetchData"/>
      </div>
      <el-button
        size="small"
        type="primary"
        icon="el-icon-search"
        @click="handleSearch" >查 询</el-button>
      <!-- <el-button
        size="small"
        type="danger"
        @click="clearCondition"
      >
        <svg-icon icon-class="clear"/> 重 置
      </el-button> -->
      <el-button
        class="float-right margin-left"
        size="small"
        type="primary"
        @click="handleAdd"><svg-icon icon-class="shezhi"/> 回测设置</el-button>
      <el-button
        class="float-right margin-left"
        size="small"
        type="primary"
        @click="handleLog"><svg-icon icon-class="wenben"/> 测试记录</el-button>
      <div class="clear-both"/>
    </div>
    <el-row style="margin-bottom: 10px;margin-top: -5px;">
      <el-col :span="14" style="padding-right: 10px;">
        <div class="setkuai">
          <div class="module-title-text">机台信息</div>
          <div class="setvalue">
            <el-table
              v-loading="listLoading"
              :data="baseList"
              element-loading-text="拼命加载中"
              height="126px"
              border
              fit
              stripe>
              <el-table-column align="center" label="名称" prop="name" width="100px"/>
              <el-table-column label="机台编号" align="center" prop="machine"/>
              <el-table-column label="测试时间" align="center" prop="testTime"/>
            </el-table>
          </div>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="setkuai" style="height: 183px;">
          <div class="module-title-text">测试结果</div>
          <el-row v-if="status===0" class="setvalue" style="height: 146px;">
            <el-col :span="24">
              <div class="linhi tg">
                <svg-icon icon-class="jianyanwc"/> 通过
              </div>
            </el-col>
          </el-row>
          <el-row v-if="status===1" class="setvalue" style="height: 146px;">
            <el-col :span="8" style="border-right:1px solid #e5e5e5">
              <div class="linhi btg">
                <svg-icon icon-class="shanchu1"/> 不通过
              </div>
            </el-col>
            <el-col :span="16" style="padding-left: 15px;">
              <div v-if="remark.length>3" class="linhi" style="line-height: 5px;">
                <div class="errorReason">异常原因</div>
                <div class="divflow">
                  <p v-for="(item,index) in remark" :key="index" class="ptype" icon="el-icon-caret-right"><svg-icon icon-class="xiangyou"/>  {{ item }}</p>
                </div>
              </div>
              <div v-if="remark.length===3" class="linhi" style="line-height: 5px;margin-top: 22px;">
                <div class="errorReason">异常原因</div>
                <div class="divflow">
                  <p v-for="(item,index) in remark" :key="index" class="ptype" icon="el-icon-caret-right"><svg-icon icon-class="xiangyou"/> {{ item }}</p>
                </div>
              </div>
              <div v-if="remark.length===2" class="linhi" style="line-height: 5px;margin-top: 34px;">
                <div class="errorReason">异常原因</div>
                <div class="divflow">
                  <p v-for="(item,index) in remark" :key="index" class="ptype" icon="el-icon-caret-right"><svg-icon icon-class="xiangyou"/> {{ item }}</p>
                </div>
              </div>
              <div v-if="remark.length===1" class="linhi" style="line-height: 5px;margin-top: 47px;">
                <div class="errorReason">异常原因</div>
                <div class="divflow">
                  <p v-for="(item,index) in remark" :key="index" class="ptype" icon="el-icon-caret-right"><svg-icon icon-class="xiangyou"/> {{ item }}</p>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <div class="setkuai">
      <div class="module-title-text">测试对比数据</div>
      <div class="setvalue edit-dialog">
        <el-table
          v-loading="listLoading"
          :data="testlist"
          element-loading-text="拼命加载中"
          border
          fit
          stripe>
          <el-table-column v-if="testlist.length>0" align="center" label="名称" width="100px">
            <template slot-scope="scope">
              <span v-if="scope.$index === 0">回测数据</span>
              <span v-if="scope.$index === 1">档案数据</span>
              <span v-if="scope.$index === 2">抽测标准</span>
            </template>
          </el-table-column>
          <el-table-column v-if="testlist.length===0" align="center" label="名称">
            <template slot-scope="scope">
              <span v-if="scope.$index === 0">回测数据</span>
              <span v-if="scope.$index === 1">档案数据</span>
              <span v-if="scope.$index === 2">抽测标准</span>
            </template>
          </el-table-column>
          <el-table-column v-for="item in backDataOne" :key="item.key" :label="item.label" align="center">
            <template slot-scope="scope">
              {{ scope.row[item.key] }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="setkuai" style="margin-top:10px">
      <div class="module-title-text">BIN表数据</div>
      <div class="setvalue edit-dialog">
        <el-table
          v-loading="listLoading"
          :data="binList"
          element-loading-text="拼命加载中"
          border
          fit
          stripe>
          <el-table-column v-if="binList.length>0" align="center" label="名称" width="100px">
            <template slot-scope="scope">
              <span v-if="scope.$index === 0">回测数据</span>
              <span v-if="scope.$index === 1">BIN表标准</span>
            </template>
          </el-table-column>
          <el-table-column v-if="binList.length===0" align="center" label="名称">
            <template slot-scope="scope">
              <span v-if="scope.$index === 0">回测数据</span>
              <span v-if="scope.$index === 1">BIN表标准</span>
            </template>
          </el-table-column>
          <el-table-column v-for="item in binTitleList" :key="item.key" :label="item.label" align="center">
            <template slot-scope="scope">
              {{ scope.row[item.key] }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="setkuai" style="margin-top:10px">
      <div class="module-title-text">不良统计</div>
      <div class="setvalue edit-dialog">
        <el-table
          v-loading="listLoading"
          :data="blList"
          :span-method="objectSpanMethod"
          element-loading-text="拼命加载中"
          border
          fit
          stripe>
          <el-table-column align="center" label="项" width="100px">
            <template slot-scope="scope">
              <span v-if="scope.$index === 0">数量</span>
              <span v-if="scope.$index === 1">比例</span>
            </template>
          </el-table-column>
          <el-table-column label="不良统计" align="center">
            <el-table-column v-for="item in blTitle" :key="item.key" :label="item.label" align="center">
              <template slot-scope="scope">
                {{ scope.row[item.key] }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="不良总数" align="center" prop="allBlNum" width="100px"/>
          <el-table-column label="抽测总数" align="center" prop="testNum" width="100px"/>
          <el-table-column label="晶粒数" align="center" prop="allNum" width="100px"/>
        </el-table>
      </div>
    </div>
    <div class="setkuai" style="margin-top:10px;margin-bottom: 10px">
      <div class="module-title-text">
        参数分析
        <el-button
          class="float-right"
          size="mini"
          style="margin-top: -6px;margin-right: 10px;"
          type="primary"
          @click="handleQZAdd"><svg-icon icon-class="shezhi"/> 阈值配置</el-button>
      </div>
      <div class="setvalue edit-dialog">
        <el-table
          v-loading="listLoading"
          :data="qzParamsLists"
          :span-method="objectSpanMethod1"
          element-loading-text="拼命加载中"
          border
          fit
          stripe>
          <el-table-column align="center" label="参数">
            <template slot-scope="scope">
              {{ scope.row.field.toUpperCase() }}
            </template>
          </el-table-column>
          <el-table-column label="极下限" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.type === 1 || scope.row.type === 0"> &lt; {{ scope.row.min }}</span>
              <span v-if="scope.row.type !== 1 && scope.row.type !== 0"> {{ scope.row.min }} </span>
            </template>
          </el-table-column>
          <el-table-column label="下限" align="center">
            <el-table-column align="center" label="下限5">
              <template slot-scope="scope">
                <span v-if="scope.row.type === 1"> {{ scope.row.min1 }} %</span>
                <span v-if="scope.row.type !== 1"> {{ scope.row.min1 }} </span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="下限4">
              <template slot-scope="scope">
                <span v-if="scope.row.type === 1"> {{ scope.row.min2 }} %</span>
                <span v-if="scope.row.type !== 1"> {{ scope.row.min2 }} </span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="下限3">
              <template slot-scope="scope">
                <span v-if="scope.row.type === 1">{{ scope.row.min3 }} %</span>
                <span v-if="scope.row.type !== 1"> {{ scope.row.min3 }} </span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="下限2">
              <template slot-scope="scope">
                <span v-if="scope.row.type === 1"> {{ scope.row.min4 }} %</span>
                <span v-if="scope.row.type !== 1"> {{ scope.row.min4 }} </span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="下限1">
              <template slot-scope="scope">
                <span v-if="scope.row.type === 1"> {{ scope.row.min5 }} %</span>
                <span v-if="scope.row.type !== 1"> {{ scope.row.min5 }} </span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="达标" align="center" prop="dab"/>
          <el-table-column label="上限" align="center">
            <el-table-column align="center" label="上限1">
              <template slot-scope="scope">
                <span v-if="scope.row.type === 1"> {{ scope.row.max1 }} %</span>
                <span v-if="scope.row.type !== 1"> {{ scope.row.max1 }} </span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="上限2">
              <template slot-scope="scope">
                <span v-if="scope.row.type === 1"> {{ scope.row.max2 }} %</span>
                <span v-if="scope.row.type !== 1"> {{ scope.row.max2 }} </span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="上限3">
              <template slot-scope="scope">
                <span v-if="scope.row.type === 1"> {{ scope.row.max3 }} %</span>
                <span v-if="scope.row.type !== 1"> {{ scope.row.max3 }} </span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="上限4">
              <template slot-scope="scope">
                <span v-if="scope.row.type === 1">{{ scope.row.max4 }} %</span>
                <span v-if="scope.row.type !== 1"> {{ scope.row.max4 }} </span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="上限5">
              <template slot-scope="scope">
                <span v-if="scope.row.type === 1"> {{ scope.row.max5 }} %</span>
                <span v-if="scope.row.type !== 1"> {{ scope.row.max5 }} </span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="极上限" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.type === 1 || scope.row.type === 0"> &gt; {{ scope.row.max }}</span>
              <span v-if="scope.row.type !== 1 && scope.row.type !== 0"> {{ scope.row.max }} </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible"
      title="设置"
      width="1200px"
      class="edit-dialog">
      <div class="module-title-text" style="margin-top: -15px;">回测标准设置</div>
      <el-row style="margin:15px 0">
        <el-col :span="20">
          <div class="input-item" style="float:left">
            <div class="input-title input-titles">产品代码 </div>
            <el-input v-model="setProduct" class="search-input" style="width: 150px;" placeholder="输入产品代码" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item" style="margin-left:15px;float:left;margin-right:15px">
            <span class="input-title">光色 </span>
            <el-select v-model="color" class="search-input" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in colorList"
                :key="item.id"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </div>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="handleSetSearch" >查 询</el-button>
        </el-col>
        <el-col :span="4" style="text-align:right">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="setParams" >参数配置</el-button>
        </el-col>
      </el-row>
      <el-table
        v-loading="listLoading1"
        :data="setlists"
        :cell-style="tableRowClassColor"
        element-loading-text="拼命加载中"
        height="400px"
        style="margin-bottom:15px"
        border
        fit
        stripe>
        <el-table-column fixed align="center" label="尺寸工艺代码">
          <el-table-column fixed label="代码" align="center" prop="code" width="120px"/>
          <el-table-column fixed label="型号" align="center" prop="model" width="90px"/>
          <el-table-column fixed label="光色" align="center" prop="color" width="90px"/>
        </el-table-column>
        <el-table-column v-for="item in showList" :key="item.field" :label="item.key" align="center">
          <!-- <template slot="header" slot-scope="scope">
            {{ item.key }}
            <el-select v-model="item.type" style="width: 100px;margin-bottom: -15px;" size="mini" placeholder="请选择">
              <el-option
                v-for="item in valueList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </template> -->
          <el-table-column label="下限" align="center">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isCheck" v-model="scope.row[item.field].minVal" maxlength="9" size="mini" type="number" class="inputs" style="width: 90%"/>
              <span v-if="!scope.row.isCheck">{{ scope.row[item.field].minVal }}</span>
              <span v-if="(scope.row.isCheck&&item.key === 'LOP')||(!scope.row.isCheck&&item.key === 'LOP'&&scope.row[item.field].minVal !== ''&&scope.row[item.field].minVal !== null)">%</span>
            </template>
          </el-table-column>
          <el-table-column label="上限" align="center">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isCheck" v-model="scope.row[item.field].maxVal" maxlength="9" size="mini" type="number" class="inputs" style="width: 90%"/>
              <span v-if="!scope.row.isCheck">{{ scope.row[item.field].maxVal }}</span>
              <span v-if="(scope.row.isCheck&&item.key === 'LOP')||(!scope.row.isCheck&&item.key === 'LOP'&&scope.row[item.field].maxVal !== ''&&scope.row[item.field].maxVal !== null)">%</span>
            </template>
          </el-table-column>
          <el-table-column label="极差" align="center">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isCheck" v-model="scope.row[item.field].poor" maxlength="9" size="mini" type="number" class="inputs" style="width: 90%"/>
              <span v-if="!scope.row.isCheck">{{ scope.row[item.field].poor }}</span>
              <span v-if="(scope.row.isCheck&&item.key === 'LOP')||(!scope.row.isCheck&&item.key === 'LOP'&&scope.row[item.field].poor !== ''&&scope.row[item.field].poor !== null)">%</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="操作" align="center" width="165px" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-if="!scope.row.isCheck"
              size="mini"
              type="primary"
              @click="handleSetEdits(scope.$index)"
            ><svg-icon icon-class="canzhaoxz"/> 参照新增</el-button>
            <el-button
              v-if="!scope.row.isCheck"
              size="mini"
              icon="el-icon-edit"
              type="primary"
              @click="handleSetEdit(scope.row)"
            >编辑</el-button>
            <el-button
              v-if="scope.row.isCheck"
              icon="el-icon-check"
              size="mini"
              type="primary"
              @click="handleSaveEdit(scope.row)">保 存
            </el-button>
            <el-button
              v-if="scope.row.isCheck"
              size="mini"
              @click="handleCancelEdit(scope.row)">取 消
            </el-button>
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
        :visible.sync="innerVisible"
        :before-close="cancelTree"
        width="500px"
        top="80px"
        class="tip-out-inner-dialog"
        title="参数配置"
        append-to-body>
        <div class="setTree">
          <el-tree
            ref="tree"
            :data="data2"
            :default-expanded-keys="[1, 2]"
            :default-checked-keys="defaultChecked"
            :props="defaultProps"
            show-checkbox
            node-key="id"/>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="setTree()">确 定</el-button>
          <el-button @click="cancelTree()">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :visible.sync="selectVisible"
        width="300px"
        top="80px"
        class="tip-out-inner-dialog"
        title="选择参照"
        append-to-body>
        <div style="text-align:center">
          <el-select v-model="getset" class="search-input" size="small" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in setlists1"
              :key="item.id"
              :disabled="setlists1[setindex].code===item.code"
              :label="item.code"
              :value="item.code"/>
          </el-select>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="setsedt()">确 定</el-button>
          <el-button @click="selectVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="qzDialogVisible"
      title="阈值配置"
      width="1300px"
      class="edit-dialogx">
      <el-table
        v-loading="listLoading1"
        :data="qzLists"
        element-loading-text="拼命加载中"
        height="400px"
        style="margin-bottom:15px"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" fixed width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="参数" fixed>
          <template slot-scope="scope">
            {{ scope.row.field.toUpperCase() }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="极下限">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isCheck" v-model="scope.row.min" maxlength="6" size="mini" type="number" class="inputs" style="width: 90%"/>
            <span v-if="!scope.row.isCheck">{{ scope.row.min }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="下限5">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isCheck" v-model="scope.row.min1" maxlength="6" size="mini" type="number" class="inputs" style="width: 90%"/>
            <span v-if="!scope.row.isCheck">{{ scope.row.min1 }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="下限4">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isCheck" v-model="scope.row.min2" maxlength="6" size="mini" type="number" class="inputs" style="width: 90%"/>
            <span v-if="!scope.row.isCheck">{{ scope.row.min2 }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="下限3">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isCheck" v-model="scope.row.min3" maxlength="6" size="mini" type="number" class="inputs" style="width: 90%"/>
            <span v-if="!scope.row.isCheck">{{ scope.row.min3 }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="下限2">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isCheck" v-model="scope.row.min4" maxlength="6" size="mini" type="number" class="inputs" style="width: 90%"/>
            <span v-if="!scope.row.isCheck">{{ scope.row.min4 }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="下限1">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isCheck" v-model="scope.row.min5" maxlength="6" size="mini" type="number" class="inputs" style="width: 90%"/>
            <span v-if="!scope.row.isCheck">{{ scope.row.min5 }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="上限1">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isCheck" v-model="scope.row.max1" maxlength="6" size="mini" type="number" class="inputs" style="width: 90%"/>
            <span v-if="!scope.row.isCheck">{{ scope.row.max1 }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="上限2">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isCheck" v-model="scope.row.max2" maxlength="6" size="mini" type="number" class="inputs" style="width: 90%"/>
            <span v-if="!scope.row.isCheck">{{ scope.row.max2 }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="上限3">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isCheck" v-model="scope.row.max3" maxlength="6" size="mini" type="number" class="inputs" style="width: 90%"/>
            <span v-if="!scope.row.isCheck">{{ scope.row.max3 }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="上限4">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isCheck" v-model="scope.row.max4" maxlength="6" size="mini" type="number" class="inputs" style="width: 90%"/>
            <span v-if="!scope.row.isCheck">{{ scope.row.max4 }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="上限5">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isCheck" v-model="scope.row.max5" maxlength="6" size="mini" type="number" class="inputs" style="width: 90%"/>
            <span v-if="!scope.row.isCheck">{{ scope.row.max5 }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="极上限">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isCheck" v-model="scope.row.max" maxlength="6" size="mini" type="number" class="inputs" style="width: 90%"/>
            <span v-if="!scope.row.isCheck">{{ scope.row.max }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="不良数标准">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isCheck" v-model="scope.row.norm" maxlength="6" size="mini" type="number" class="inputs" style="width: 90%"/>
            <span v-if="!scope.row.isCheck">{{ scope.row.norm }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="数值类型" width="100px">
          <template slot-scope="scope">
            <el-select v-model="scope.row.type" :disabled="!scope.row.isCheck" style="width: 90%" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in valueList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="120px">
          <template slot-scope="scope">
            <el-button
              v-if="!scope.row.isCheck"
              size="mini"
              icon="el-icon-edit"
              type="primary"
              @click="handleQZEdit(scope.row)"
            >编辑</el-button>
            <el-button
              v-if="scope.row.isCheck"
              icon="el-icon-check"
              size="mini"
              type="primary"
              @click="handleQZSave(scope.row)">保 存
            </el-button>
            <el-button
              v-if="scope.row.isCheck"
              size="mini"
              @click="handleCancelQZ(scope.row)">取 消
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="logDialogVisible"
      title="回测记录"
      width="1200px"
      class="edit-dialogs stesw">
      <el-row style="margin: 15px 0px;border-bottom: 1px solid #e5e5e5;padding-bottom: 15px;margin-top:-15px">
        <el-col :span="24">
          <div class="input-item" style=";margin-right:15px;float:left">
            <span class="input-title">产品代码 </span>
            <el-select v-model="products" class="search-input" size="small" style="width: 150px;" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in productList"
                :key="item.id"
                :label="item.code"
                :value="item.code"/>
            </el-select>
          </div>
          <div class="input-item" style="float:left">
            <div class="input-title input-titles">BinNo </div>
            <el-input v-model="logBinNo" class="search-input" style="width: 150px;" placeholder="请输入BinNo" size="small" maxlength="50" clearable/>
          </div>
          <div class="input-item" style="margin-left:15px;float:left;margin-right:15px">
            <span class="input-title">时间 </span>
            <el-date-picker
              v-model="beginDate"
              :picker-options="pickerOptionsStart"
              :editable="false"
              class="search-input"
              style="width: 150px;"
              size="small"
              type="date"
              placeholder="选择开始日期"
              value-format="timestamp"
              clearable
            />
            <span style="display:inline-block;width: 38px;text-align: center"> 至 </span>
            <el-date-picker
              v-model="endDate"
              :picker-options="pickerOptionsEnd"
              :editable="false"
              class="search-input"
              style="width: 150px;"
              size="small"
              type="date"
              placeholder="选择结束日期"
              value-format="timestamp"
              clearable
            />
          </div>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="handlelogSearch" >查 询</el-button>
          <el-button
            size="small"
            type="danger"
            @click="clearlogSearch"
          >
            <svg-icon icon-class="clear"/> 重 置
          </el-button>
          <el-button
            size="small"
            class="float-right"
            type="primary"
            @click="exportExcel"
          ><svg-icon icon-class="export"/> 导出</el-button>
        </el-col>
      </el-row>
      <div class="table-top-btn-group">
        <div
          :class="{'active':isActive === 0}"
          @click="navClick(0)"
        >
          通过记录
        </div>
        <div
          :class="{'active':isActive === 1}"
          @click="navClick(1)"
        >
          不通过记录
        </div>
      </div>
      <el-table
        v-loading="listLoading1"
        :data="logList"
        element-loading-text="拼命加载中"
        class="broad-scrollbar-table"
        height="400px"
        style="margin-bottom:15px"
        border
        fit
        stripe>
        <el-table-column align="center" label="ID" prop="binNo" width="200px" fixed/>
        <el-table-column align="center" label="复测数据">
          <el-table-column v-for="item in fcsjList" :key="item.label" :label="item.label" align="center">
            <template slot-scope="scope">
              {{ scope.row[item.key] }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" label="BIN数据">
          <el-table-column v-for="item in binsjList" :key="item.label" :label="item.label" align="center">
            <template slot-scope="scope">
              {{ scope.row[item.key] }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" label="复测标准">
          <el-table-column v-for="item in fcbzList" :key="item.label" :label="item.label" align="center">
            <template slot-scope="scope">
              {{ scope.row[item.key] }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" label="分选测试机台">
          <el-table-column label="型号" align="center" prop="model"/>
          <el-table-column label="光色" align="center" prop="color"/>
          <el-table-column label="分选机" align="center" prop="chooseMachine"/>
          <el-table-column label="分选时间" align="center" prop="chooseTime" width="150px" show-overflow-tooltip/>
          <el-table-column label="测试机" align="center" prop="testMachine"/>
          <el-table-column label="测试时间" align="center" prop="testTime" width="150px" show-overflow-tooltip/>
        </el-table-column>
        <el-table-column align="center" label="不良统计">
          <el-table-column label="抽测总数" align="center" prop="testNum"/>
          <el-table-column v-for="item in logbltjTitle" :key="item.label" :label="item.label" align="center">
            <template slot-scope="scope">
              {{ scope.row[item.key] }}
            </template>
          </el-table-column>
          <el-table-column label="不良总数" align="center" prop="allBlNum3"/>
        </el-table-column>
        <el-table-column v-for="item in column3" :key="item.label" :label="item.label" align="center">
          <el-table-column v-for="items in item.list" :key="items.label" :label="items.label" align="center">
            <el-table-column v-for="it in items.list" :key="it.label" :label="it.label" align="center">
              <template slot-scope="scope">
                {{ scope.row[it.key] }}
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
      </el-table>
      <el-pagination
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
  .input-item {
      margin-top: 0;
  }
  .inputs::-webkit-inner-spin-button,input::-webkit-outer-spin-button {/*屏蔽上下箭头*/
    -webkit-appearance: none;
  }
  input[type="number"]{
    -moz-appearance:none;
  }
  .edit-dialog>>>.el-input .el-input__inner {
    height: 32px !important;
  }
  .errorReason{
    font-size: 17px;
    margin-top: 10px;
    margin-bottom: 5px;
  }
  .divflow{
    max-height: 102px;
    overflow: auto;
  }
  .ptype{
    font-size: 14px;
    font-weight: normal;
  }
  .setTree{
    padding: 15px;
    border: 1px solid #DCDFE6;
    margin-top: 15px;
    height: 485px;
    overflow: auto;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 207px);
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
  .input-titles{
    float: left;
    line-height: 30px;
  }
  .input-items{
    margin-bottom:15px;
  }
  .setkuai{
    background: #ffffff;
  }
  .setvalue{
    padding: 10px 15px
  }
  .module-title-text {
    color: #666;
    font-size: 14px;
    font-weight: bold;
    float: none;
    padding-top: 10px;
    padding-left: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e5e5e5;
  }
  .linhi{
    line-height: 125px;
    border-radius: 5px;
    font-weight: bolder;
    font-size: 2rem;
  }
  .btg{
    color: #F56C6C;
    margin-right: 15px;
    text-align: center;
  }
  .tg{
    color: #009494;
    margin-right: 15px;
    text-align: center;
  }
  .broad-scrollbar-table>>> .el-table__fixed{
    width: 200px !important;
    height: 385px !important;
    background: #fff !important;
  }
  .broad-scrollbar-table>>> .el-table__fixed-body-wrapper{
    height: 311px !important;
    background: #fff !important;
  }
  .edit-dialog>>>.el-dialog__body{
    padding-bottom: 60px;
  }
  .edit-dialogs>>>.el-dialog__body{
    padding-bottom: 20px;
  }
  .edit-dialog ::-webkit-scrollbar {/*滚动条整体样式*/
    height: 10px !important;
  }
  .edit-dialog>>>.el-dialog__body .el-table__fixed{
    width: 300px !important;
    height: 388px !important;
    background: #fff !important;
  }
  .edit-dialog>>>.el-dialog__body .el-table__fixed-right{
    height: 388px !important;
    background: #fff !important;
  }
  .edit-dialog>>>.el-dialog__body .el-table__fixed-body-wrapper{
    height: 315px !important;
    background: #fff !important;
  }
  .edit-dialogx>>>.el-dialog__body{
    padding-bottom: 60px;
  }
  .edit-dialogx ::-webkit-scrollbar {/*滚动条整体样式*/
    height: 10px !important;
  }
  .edit-dialogx>>>.el-dialog__body .el-table__fixed-right{
    height: 388px !important;
    background: #fff !important;
  }
  .edit-dialogx>>>.el-dialog__body .el-table__fixed{
    width: 130px !important;
    height: 388px !important;
    background: #fff !important;
  }
  .edit-dialogx>>>.el-dialog__body .el-table__fixed-body-wrapper{
    height: 351px !important;
    background: #fff !important;
  }
  .stesw >>> .el-dialog__body {
    padding-bottom: 55px;
  }
</style>
