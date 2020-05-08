<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 10px;padding-bottom: 5px;">
      <div class="header-btn-group">
        <el-button
          :disabled="listLoading"
          size="small"
          type="primary"
          @click="handleAdd"
        ><svg-icon icon-class="addxz"/> 新增投片</el-button>
        <!-- <el-button
          size="small"
          type="primary"
          @click="handleAdd"
        ><svg-icon icon-class="daoru"/> 外部片源导入</el-button> -->
        <el-button
          :disabled="listLoading"
          size="small"
          type="primary"
          style="background-color:#1ABC9C;border-color:#1ABC9C"
          @click="selectWafer"
        ><svg-icon icon-class="xuanzexx"/> 选择Wafer</el-button>
        <el-button
          :disabled="listLoading"
          size="small"
          class="float-right"
          type="primary"
          @click="setNum"
        ><svg-icon icon-class="xinxisz"/> 批号管理</el-button>
        <el-button
          :disabled="listLoading"
          size="small"
          class="float-right"
          type="primary"
          @click="showLog"
        ><svg-icon icon-class="wenben"/> 投片记录</el-button>
        <el-button
          v-if="backInfo !== null"
          :disabled="listLoading"
          size="small"
          class="float-right"
          type="danger"
          icon="el-icon-edit"
          @click="changeEdit"
        > 取消编辑</el-button>
      </div>
      <fieldset class="fieldest">
        <legend class="legendsty"> 投片信息 </legend>
        <el-row>
          <el-col :span="24">
            <div class="input-item" style="margin-top: 0px;margin-bottom:15px">
              <span class="input-title">起始批号</span>
              <el-input
                v-model="startNo"
                class="search-input"
                style="width: 190px;"
                size="small"
                maxlength="20"
                clearable
                @keyup.enter.native="inputBlur()"
              />
            </div>
            <div class="input-item" style="margin-top: 0px;margin-bottom:15px">
              <span class="input-title">任务单号</span>
              <el-input
                v-model="orderNo"
                :disabled="true"
                class="search-input"
                style="width: 135px;"
                size="small"
                maxlength="20"
                clearable
              />
            </div>
            <div class="input-item" style="margin-top: 0px;margin-bottom:15px">
              <span class="input-title" style="width:35px">尺寸</span>
              <el-select :disabled="backInfo !==null" v-model="factory" class="search-input" style="width:110px" size="small" placeholder="请选择" filterable @change="getNoAndCodex">
                <el-option
                  v-for="item in factoryList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </div>
            <div class="input-item" style="margin-top: 0px;margin-bottom:15px">
              <span class="input-title">投片类型</span>
              <el-select :disabled="backInfo !==null" v-model="types" class="search-input" style="width:100px" size="small" placeholder="请选择" filterable @change="getNoAndCodex">
                <el-option
                  v-for="item in categoryList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </div>
            <div class="input-item" style="margin-top: 0px;margin-bottom:15px">
              <span class="input-title">产品型号</span>
              <el-select v-model="product" class="search-input" style="width:120px" size="small" placeholder="请选择" filterable @change="getNoAndCodes">
                <el-option
                  v-for="item in productList"
                  :key="item.id"
                  :label="item.code"
                  :value="item.code"/>
              </el-select>
            </div>
            <div class="input-item" style="margin-top: 0px;margin-bottom:15px">
              <span class="input-title" style="width:35px">片型</span>
              <el-select v-model="typeas" class="search-input" size="small" style="width:80px" placeholder="请选择" @change="xpWarehousLabel">
                <el-option
                  v-for="item in typeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </div>
            <div class="input-item" style="margin-top: 0px;margin-bottom:15px">
              <span class="input-title" style="width:50px">紧急度</span>
              <el-select v-model="urgent" class="search-input" style="width:80px" size="small" placeholder="请选择" filterable>
                <el-option
                  v-for="item in urgentList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </div>
            <div class="input-item" style="margin-top: 0px;margin-bottom:15px">
              <span class="input-title" style="width:50px">流程卡</span>
              <el-select v-model="processCard" class="search-input style-input" style="width: 225px !important" size="small" placeholder="请选择" filterable @change="findFlowCard">
                <el-option
                  v-for="item in cardList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </div>
            <div class="input-item" style="margin-top: 0px;margin-bottom:15px">
              <div class="input-title">入库标签</div>
              <el-select v-model="labelStr" class="search-input style-input" style="width: 225px !important" size="small" placeholder="请选择" filterable>
                <el-option
                  v-for="item in labelList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </div>
            <div class="input-item" style="margin-top: 0px;margin-bottom:15px">
              <div class="input-title" style="width:35px">备注</div>
              <el-input
                v-model="remark"
                class="search-input"
                style="width: 350px;"
                size="small"
                maxlength="50"
                clearable
              />
            </div>
            <div class="input-item" style="margin-top:5px">
              <el-checkbox v-model="isPrintTab" style="margin-right: 5px;">标签打印/预览</el-checkbox>
              <el-checkbox v-model="isPrintCard">打印流程卡</el-checkbox>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div v-show="false" class="input-item">
              <span class="input-title">光色</span>
              <el-select v-model="color" class="search-input style-input" size="small" placeholder="请选择" filterable @change="getNoAndCode">
                <el-option
                  v-for="item in colorList"
                  :key="item.id"
                  :label="item.code"
                  :value="item.code"/>
              </el-select>
            </div>
            <div v-show="false" class="input-item">
              <span class="input-title">型号</span>
              <el-select v-model="models" class="search-input style-input" size="small" placeholder="请选择" filterable @change="getNoAndCode">
                <el-option
                  v-for="item in modelList"
                  :key="item.id"
                  :label="item.code"
                  :value="item.code"/>
              </el-select>
            </div>
            <div v-show="false" class="input-item">
              <span class="input-title">工艺</span>
              <el-select v-model="technology" class="search-input style-input" size="small" placeholder="请选择" filterable @change="getNoAndCode">
                <el-option
                  v-for="item in gyList"
                  :key="item.id"
                  :label="item.code"
                  :value="item.code"/>
              </el-select>
            </div>
            <div v-show="false" class="input-item">
              <span class="input-title">电极</span>
              <el-select v-model="electrode" class="search-input style-input" size="small" placeholder="请选择" filterable @change="getNoAndCode">
                <el-option
                  v-for="item in electrodeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"/>
              </el-select>
            </div>

          </el-col>
        </el-row>
      </fieldset>
      <div v-if="!isSpan" style="margin-top: 5px;text-align:center">
        <a class="primarya" @click="setSpan"><i class="el-icon-arrow-down"/> 展开产品信息</a>
      </div>
      <div v-if="isSpan" style="padding: 0 2px;margin-top: 10px;">
        <div class="pris">
          &nbsp;
          <div class="input-item">
            <span class="input-title stt">芯片型号</span>
            <el-input
              v-model="chipNo"
              :disabled="true"
              class="search-input"
              size="small"
              maxlength="20"
              clearable
            />
          </div>
          <div class="input-item">
            <span class="input-title stt">芯片尺寸</span>
            <el-input
              v-model="mesaSize"
              :disabled="true"
              class="search-input"
              size="small"
              maxlength="20"
              clearable
            />
          </div>
          <div class="input-item">
            <span class="input-title stt">电极</span>
            <el-input
              v-model="electrodes"
              :disabled="true"
              class="search-input"
              size="small"
              maxlength="20"
              clearable
            />
          </div>
          <div class="input-item">
            <span class="input-title stt">切割道</span>
            <el-input
              v-model="cuttingPath"
              :disabled="true"
              class="search-input"
              size="small"
              maxlength="20"
              clearable
            />
          </div>
          <div class="input-item">
            <span class="input-title stt">标准产出</span>
            <el-input
              v-model="standardOutput"
              :disabled="true"
              class="search-input"
              size="small"
              maxlength="20"
              clearable
            />
          </div>
          <div class="input-item">
            <span class="input-title stt">外延规格</span>
            <el-select v-model="specification" :disabled="true" size="small" class="search-input" placeholder="请选择" filterable>
              <el-option
                v-for="item in wyggList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title stt">背镀</span>
            <el-input
              v-model="backPlating"
              :disabled="true"
              class="search-input"
              size="small"
              maxlength="20"
              clearable
            />
          </div>
          <div class="input-item">
            <span class="input-title stt">芯片工艺</span>
            <el-input
              v-model="chipTechnology"
              :disabled="true"
              class="search-input"
              size="small"
              maxlength="20"
              clearable
            />
          </div>
          <div class="input-item">
            <span class="input-title stt">蒸镀电极</span>
            <el-input
              v-model="evaporationElectrode"
              :disabled="true"
              class="search-input"
              size="small"
              maxlength="20"
              clearable
            />
          </div>
          <div class="input-item">
            <span class="input-title stt">研磨厚度</span>
            <el-input
              v-model="grind"
              :disabled="true"
              class="search-input"
              size="small"
              maxlength="20"
              clearable
            />
          </div>
          <div class="input-item">
            <span class="input-title stt">切割工艺</span>
            <el-input
              v-model="cuttingTechnology"
              :disabled="true"
              class="search-input"
              size="small"
              maxlength="20"
              clearable
            />
          </div>
          <div class="input-item">
            <span class="input-title stt" style="width:100px">COW测试条件</span>
            <el-input
              v-model="cowTestConditions"
              :disabled="true"
              class="search-input"
              style="width:151px"
              size="small"
              maxlength="20"
              clearable
            />
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 130px;">COT电流测试条件</span>
            <el-input
              v-model="cotTestConditions"
              :disabled="true"
              class="search-input"
              style="width:101px"
              size="small"
              maxlength="20"
              clearable
            />
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 80px;">COT测试档</span>
            <el-input
              v-model="cotTest"
              :disabled="true"
              class="search-input"
              style="width:151px"
              size="small"
              maxlength="20"
              clearable
            />
          </div>
          <div class="input-item">
            <span class="input-title" style="width: 95px;">COT亮度单位</span>
            <el-input
              v-model="ldunit"
              :disabled="true"
              class="search-input"
              style="width:136px"
              size="small"
              maxlength="20"
              clearable
            />
          </div>
          <div class="input-item" style="margin-top: 20px;">
            <el-checkbox v-model="isCOTTest" :disabled="true" style="margin-right: 10px;">COT ESD是否全测</el-checkbox>
            <el-checkbox v-model="isMj" :disabled="true" style="margin-right: 10px;">目检吸边</el-checkbox>
            <el-checkbox v-model="isMapping" :disabled="true">Mapping图</el-checkbox>
          </div>
        </div>
        <div style="margin-top: 5px;text-align:center">
          <a class="primarya" @click="setSpan"><i class="el-icon-arrow-up"/> 收起产品信息</a>
        </div>
      </div>
    </div>
    <div id="printDiv" ref="print" class="print" style="display:none">
      <div v-for="(beas, indexes) in beachList" :key="indexes" style="width: 284mm;">
        <el-row style="margin: 0 10px;">
          <el-col :span="24">
            <div style="text-align:center;font-weight:bold;font-size:0.8cm;padding:10px 0" v-text="currentCardName">12</div>
          </el-col>
        </el-row>
        <el-row style="margin:-5px 10px;margin-bottom:-10px">
          <el-col :span="24">
            <div>
              <table
                :class="(currentCardType === 1 || currentCardType === 2) ? 'abnormal-process-table' : ''"
                cellspacing="0"
                cellpadding="0"
                border="0"
                class="el-table__header"
                style="width: 278mm;" >
                <thead>
                  <tr class>
                    <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width:320px">
                      <div class="cell" style="font-size:0.5cm;">批号</div>
                    </th>
                    <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 191px;">
                      <div class="cell" style="font-size:0.5cm;">型号</div>
                    </th>
                    <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 204px;">
                      <div class="cell" style="font-size:0.5cm;">数量</div>
                    </th>
                    <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 110px;">
                      <div class="cell" style="font-size:0.5cm;">工艺分类</div>
                    </th>
                    <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 199px;">
                      <div class="cell" style="font-size:0.5cm;">备注</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in beas.titleList" :key="index">
                    <td style="text-align:center;padding:5px;border:1px solid #666">
                      <div class="cell" style="font-size:0.5cm;">{{ item.startNo }}</div>
                    </td>
                    <td style="text-align:center;padding:5px;border:1px solid #666">
                      <div class="cell" style="font-size:0.5cm;">{{ item.models }}</div>
                    </td>
                    <td style="text-align:center;padding:5px;border:1px solid #666">
                      <div class="cell" style="font-size:0.5cm;">{{ item.num }}</div>
                    </td>
                    <td style="text-align:center;padding:5px;border:1px solid #666">
                      <div class="cell" style="font-size:0.5cm;">{{ item.craft }}</div>
                    </td>
                    <td style="text-align:center;padding:5px;border:1px solid #666">
                      <div class="cell" style="font-size:0.5cm;">{{ item.remark }}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </el-col>
        </el-row>
        <el-row style="margin: 10px;">
          <el-col :span="24">
            <div>
              <table
                :class="(currentCardType === 1 || currentCardType === 2) ? 'abnormal-process-table' : ''"
                cellspacing="0"
                cellpadding="0"
                border="0"
                class="el-table__header"
                style="width: 278mm;" >
                <thead>
                  <tr class>
                    <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width:50px">
                      <div class="cell" style="font-size:0.5cm;">步骤</div>
                    </th>
                    <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 170px;">
                      <div class="cell" style="font-size:0.5cm;">工序</div>
                    </th>
                    <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 291px;">
                      <div class="cell" style="font-size:0.5cm;">制造记录</div>
                    </th>
                    <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;">
                      <div class="cell" style="font-size:0.5cm;">接片</div>
                    </th>
                    <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;">
                      <div class="cell" style="font-size:0.5cm;">传片</div>
                    </th>
                    <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;">
                      <div class="cell" style="font-size:0.5cm;">备注</div>
                    </th>
                    <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;">
                      <div class="cell" style="font-size:0.5cm;">日期</div>
                    </th>
                    <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;">
                      <div class="cell" style="font-size:0.5cm;">时间</div>
                    </th>
                    <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;">
                      <div class="cell" style="font-size:0.5cm;">操作员</div>
                    </th>
                    <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 130px;">
                      <div class="cell" style="font-size:0.5cm;">程序</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in dialogList" :key="item.processId">
                    <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
                      <div class="cell" style="font-size:0.45cm;">{{ index + 1 }}</div>
                    </td>
                    <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
                      <div class="cell" style="font-size:0.45cm;">{{ item.processId }}</div>
                    </td>
                    <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
                      <div class="cell" style="font-size:0.45cm;word-wrap: break-word;">{{ item.remark }}</div>
                    </td>
                    <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
                      <div class="cell" style="font-size:0.45cm;">{{ item.programName }}</div>
                    </td>
                    <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
                      <div class="cell"/>
                    </td>
                    <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
                      <div class="cell"/>
                    </td>
                    <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
                      <div class="cell"/>
                    </td>
                    <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
                      <div class="cell"/>
                    </td>
                    <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
                      <div class="cell"/>
                    </td>
                    <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
                      <div class="cell"/>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </el-col>
        </el-row>
        <el-row style="margin: -10px 13px 10px 10px;border-top: 1px solid rgb(102, 102, 102);">
          <el-col :span="24">
            <div v-if="currentCardType === 2" style="font-size: 26px;margin: 15px">后段工序随原流程卡进行！</div>
            <div>
              <table
                :class="(currentCardType === 1 || currentCardType === 2) ? 'abnormal-process-table' : ''"
                cellspacing="0"
                cellpadding="0"
                border="0"
                class="el-table__header"
                style="width: 100%;" >
                <tbody>
                  <tr v-for="(item, index) in dialogEndList" :key="item.processId">
                    <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 50px;">
                      <div class="cell" style="font-size:0.45cm;">{{ index + dialogList.length + 1 }}</div>
                    </td>
                    <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 170px;">
                      <div class="cell" style="font-size:0.45cm;">{{ item.processId }}</div>
                    </td>
                    <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 291px;">
                      <div v-if="item.processId === '研磨' || item.processId === '切割厚度'" class="cell" style="font-size:0.45cm;">{{ item.remark }}{{ polishingPly }}</div>
                      <div v-if="item.processId !== '研磨' && item.processId !== '切割厚度'" class="cell" style="font-size:0.45cm;">{{ item.remark }}</div>
                    </td>
                    <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
                      <div class="cell"/>
                    </td>
                    <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
                      <div class="cell"/>
                    </td>
                    <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
                      <div class="cell"/>
                    </td>
                    <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
                      <div class="cell"/>
                    </td>
                    <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
                      <div class="cell"/>
                    </td>
                    <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
                      <div class="cell"/>
                    </td>
                    <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 130px;">
                      <div class="cell" style="font-size:0.45cm;word-wrap: break-word;">{{ item.programName }}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </el-col>
          <div style="width:100%;margin-top:15px">
            <div style="width:49%;float:left;;border-top:1px solid #000;border-left:1px solid #000;border-right:1px solid #000">
              <table
                cellspacing="0"
                cellpadding="0"
                border="0"
                class="el-table__header">
                <tbody>
                  <tr v-for="(item, index) in beas.printList" :key="index">
                    <td style="text-align:center;padding:5px;border-bottom:1px solid #666">
                      <div class="cell" style="font-size: 0.5cm;float: left;width: 30px;padding-top: 6px;">{{ index+1 }}</div>
                      <div class="cell" style="font-size:0.4cm;float:left;text-align:center">
                        <div>{{ item.wafersNo }}</div>
                        <div style="text-align: center;width: 100%;margin-top: 5px;">
                          <img :src="item.img" alt="" style="width: 240px;height: 20px;">
                        </div>
                      </div>
                      <div class="cell" style="font-size: 0.5cm;width: 127px;float: left;padding-top: 6px;">{{ item.laserMark }}</div>
                      <div class="cell" style="font-size:0.5cm;width: 90px;float:left">
                        <div>{{ item.batchNo }}</div>
                        <div>{{ item.visualLevels }}</div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="beas.printList1.length>0" style="width:49%;float:left;border-top:1px solid #000;border-right:1px solid #000">
              <table
                cellspacing="0"
                cellpadding="0"
                border="0"
                class="el-table__header">
                <tbody>
                  <tr v-for="(item, index) in beas.printList1" :key="index">
                    <td style="text-align:center;padding:5px;border-bottom:1px solid #666">
                      <div class="cell" style="font-size: 0.5cm;float: left;width: 30px;padding-top: 6px;">{{ index+13 }}</div>
                      <div class="cell" style="font-size:0.4cm;float:left;text-align:center">
                        <div>{{ item.wafersNo }}</div>
                        <div style="text-align: center;width: 100%;margin-top: 5px;">
                          <img :src="item.img" alt="" style="width: 240px;height: 20px;">
                        </div>
                      </div>
                      <div class="cell" style="font-size: 0.5cm;width: 127px;float: left;padding-top: 6px;">{{ item.laserMark }}</div>
                      <div class="cell" style="font-size:0.5cm;width: 90px;float:left">
                        <div>{{ item.batchNo }}</div>
                        <div>{{ item.visualLevels }}</div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </el-row>
        <div style="page-break-after:always;">&nbsp;</div>
      </div>
    </div>
    <div id="printDivs" ref="prints" class="print" style="display:none">
      <div v-for="(beas, indexes) in beachLists" :key="indexes" style="width: 284mm;">
        <el-row style="margin: 0 10px;">
          <el-col :span="24">
            <div style="text-align:center;font-weight:bold;font-size:0.8cm;padding:10px 0" v-text="currentCardName1">12</div>
          </el-col>
        </el-row>
        <el-row style="margin:-5px 10px;margin-bottom:-10px">
          <el-col :span="24">
            <div>
              <table
                :class="(currentCardType1 === 1 || currentCardType1 === 2) ? 'abnormal-process-table' : ''"
                cellspacing="0"
                cellpadding="0"
                border="0"
                class="el-table__header"
                style="width: 278mm;" >
                <thead>
                  <tr class>
                    <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width:320px">
                      <div class="cell" style="font-size:0.5cm;">批号</div>
                    </th>
                    <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 191px;">
                      <div class="cell" style="font-size:0.5cm;">型号</div>
                    </th>
                    <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 204px;">
                      <div class="cell" style="font-size:0.5cm;">数量</div>
                    </th>
                    <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 110px;">
                      <div class="cell" style="font-size:0.5cm;">工艺分类</div>
                    </th>
                    <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 199px;">
                      <div class="cell" style="font-size:0.5cm;">备注</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in beas.titleList" :key="index">
                    <td style="text-align:center;padding:5px;border:1px solid #666">
                      <div class="cell" style="font-size:0.5cm;">{{ item.startNo }}</div>
                    </td>
                    <td style="text-align:center;padding:5px;border:1px solid #666">
                      <div class="cell" style="font-size:0.5cm;">{{ item.models }}</div>
                    </td>
                    <td style="text-align:center;padding:5px;border:1px solid #666">
                      <div class="cell" style="font-size:0.5cm;">{{ item.num }}</div>
                    </td>
                    <td style="text-align:center;padding:5px;border:1px solid #666">
                      <div class="cell" style="font-size:0.5cm;">{{ item.craft }}</div>
                    </td>
                    <td style="text-align:center;padding:5px;border:1px solid #666">
                      <div class="cell" style="font-size:0.5cm;">{{ item.remark }}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </el-col>
        </el-row>
        <el-row style="margin: 10px;">
          <el-col :span="24">
            <div>
              <table
                :class="(currentCardType1 === 1 || currentCardType1 === 2) ? 'abnormal-process-table' : ''"
                cellspacing="0"
                cellpadding="0"
                border="0"
                class="el-table__header"
                style="width: 278mm;" >
                <thead>
                  <tr class>
                    <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width:50px">
                      <div class="cell" style="font-size:0.5cm;">步骤</div>
                    </th>
                    <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 170px;">
                      <div class="cell" style="font-size:0.5cm;">工序</div>
                    </th>
                    <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 291px;">
                      <div class="cell" style="font-size:0.5cm;">制造记录</div>
                    </th>
                    <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 45px;">
                      <div class="cell" style="font-size:0.5cm;">接片</div>
                    </th>
                    <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 45px;">
                      <div class="cell" style="font-size:0.5cm;">传片</div>
                    </th>
                    <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 45px;">
                      <div class="cell" style="font-size:0.5cm;">备注</div>
                    </th>
                    <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 45px;">
                      <div class="cell" style="font-size:0.5cm;">日期</div>
                    </th>
                    <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 45px;">
                      <div class="cell" style="font-size:0.5cm;">时间</div>
                    </th>
                    <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;">
                      <div class="cell" style="font-size:0.5cm;">操作员</div>
                    </th>
                    <th colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 130px;">
                      <div class="cell" style="font-size:0.5cm;">程序</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in dialogList1" :key="item.processId">
                    <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
                      <div class="cell" style="font-size:0.45cm;">{{ index + 1 }}</div>
                    </td>
                    <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
                      <div class="cell" style="font-size:0.45cm;">{{ item.processId }}</div>
                    </td>
                    <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
                      <div class="cell" style="font-size:0.45cm;word-wrap: break-word;">{{ item.remark }}</div>
                    </td>
                    <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
                      <div class="cell" style="font-size:0.45cm;">{{ item.programName }}</div>
                    </td>
                    <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
                      <div class="cell"/>
                    </td>
                    <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
                      <div class="cell"/>
                    </td>
                    <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
                      <div class="cell"/>
                    </td>
                    <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
                      <div class="cell"/>
                    </td>
                    <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
                      <div class="cell"/>
                    </td>
                    <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
                      <div class="cell"/>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </el-col>
        </el-row>
        <el-row style="margin: -10px 13px 10px 10px;border-top: 1px solid rgb(102, 102, 102);">
          <el-col :span="24">
            <div v-if="currentCardType1 === 2" style="font-size: 26px;margin: 15px">后段工序随原流程卡进行！</div>
            <div>
              <table
                :class="(currentCardType1 === 1 || currentCardType1 === 2) ? 'abnormal-process-table' : ''"
                cellspacing="0"
                cellpadding="0"
                border="0"
                class="el-table__header"
                style="width: 100%;" >
                <tbody>
                  <tr v-for="(item, index) in dialogEndList1" :key="item.processId">
                    <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 50px;">
                      <div class="cell" style="font-size:0.45cm;">{{ index + dialogList1.length + 1 }}</div>
                    </td>
                    <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 170px;">
                      <div class="cell" style="font-size:0.45cm;">{{ item.processId }}</div>
                    </td>
                    <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 291px;">
                      <div v-if="item.processId === '研磨' || item.processId === '切割厚度'" class="cell" style="font-size:0.45cm;">{{ item.remark }}{{ printRowInfo.polishingPly }}</div>
                      <div v-if="item.processId !== '研磨' && item.processId !== '切割厚度'" class="cell" style="font-size:0.45cm;">{{ item.remark }}</div>
                    </td>
                    <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 45px;">
                      <div class="cell"/>
                    </td>
                    <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 45px;">
                      <div class="cell"/>
                    </td>
                    <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 45px;">
                      <div class="cell"/>
                    </td>
                    <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 45px;">
                      <div class="cell"/>
                    </td>
                    <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 45px;">
                      <div class="cell"/>
                    </td>
                    <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666">
                      <div class="cell"/>
                    </td>
                    <td :class="item.sign === 1 ? 'has-bancground' : ''" colspan="1" rowspan="1" style="text-align:center;padding:5px;border:1px solid #666;width: 130px;">
                      <div class="cell" style="font-size:0.45cm;word-wrap: break-word;">{{ item.programName }}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </el-col>
          <div style="width:100%;margin-top:15px">
            <div style="width:49%;float:left;;border-top:1px solid #000;border-left:1px solid #000;border-right:1px solid #000">
              <table
                cellspacing="0"
                cellpadding="0"
                border="0"
                class="el-table__header">
                <tbody>
                  <tr v-for="(item, index) in beas.printList" :key="index">
                    <td style="text-align:center;padding:5px;border-bottom:1px solid #666">
                      <div class="cell" style="font-size: 0.5cm;float: left;width: 30px;padding-top: 6px;">{{ index+1 }}</div>
                      <div class="cell" style="font-size:0.4cm;float:left;text-align:center">
                        <div>{{ item.wafersNo }}</div>
                        <div style="text-align: center;width: 100%;margin-top: 5px;">
                          <img :src="item.img" alt="" style="width: 240px;height: 20px;">
                        </div>
                      </div>
                      <div class="cell" style="font-size: 0.5cm;width: 127px;float: left;padding-top: 6px;">{{ item.laserMark }}</div>
                      <div class="cell" style="font-size:0.5cm;width: 90px;float:left">
                        <div>{{ item.batchNo }}</div>
                        <div>{{ item.visualLevels }}</div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="beas.printList1.length>0" style="width:49%;float:left;border-right:1px solid #000;border-top:1px solid #000">
              <table
                cellspacing="0"
                cellpadding="0"
                border="0"
                class="el-table__header">
                <tbody>
                  <tr v-for="(item, index) in beas.printList1" :key="index">
                    <td style="text-align:center;padding:5px;border-bottom:1px solid #666">
                      <div class="cell" style="font-size: 0.5cm;float: left;width: 30px;padding-top: 6px;">{{ index+13 }}</div>
                      <div class="cell" style="font-size:0.4cm;float:left;text-align:center">
                        <div>{{ item.wafersNo }}</div>
                        <div style="text-align: center;width: 100%;margin-top: 5px;">
                          <img :src="item.img" alt="" style="width: 240px;height: 20px;">
                        </div>
                      </div>
                      <div class="cell" style="font-size: 0.5cm;width: 127px;float: left;padding-top: 6px;">{{ item.laserMark }}</div>
                      <div class="cell" style="font-size:0.5cm;width: 90px;float:left">
                        <div>{{ item.batchNo }}</div>
                        <div>{{ item.visualLevels }}</div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </el-row>
        <div style="page-break-after:always;">&nbsp;</div>
      </div>
    </div>
    <div class="app-container app-containers run-table run-tablex">
      <div style="font-weight:bold;padding-bottom:5px">
        Wafer TOL: <span style="color:#1ABC9C;">{{ list.length }}</span>
        <el-button type="primary" class="bonst" size="small" @click="importDBF()"><svg-icon icon-class="import" style="color:#009494"/>  导出</el-button>
      </div>
      <pl-table
        v-loading="listLoading"
        v-if="showRealName !== '验证片'"
        :datas="list"
        :row-height="35"
        element-loading-text="拼命加载中"
        class="broad-scrollbar-table"
        style="height:500px"
        border
        fit
        stripe
        header-drag-style
        use-virtual>
        <pl-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </pl-table-column>
        <pl-table-column label="批号" align="center" prop="batchNo" width="200px" fixed show-overflow-tooltip/>
        <pl-table-column label="片号" align="center" prop="waferNo" width="200px" fixed show-overflow-tooltip/>
        <pl-table-column label="外延片号" align="center" prop="wyWaferId" width="120px" show-overflow-tooltip/>
        <pl-table-column label="柜位" align="center" prop="arkName"/>
        <pl-table-column label="出库盒号" align="center" prop="boxNo" width="120px" show-overflow-tooltip/>
        <pl-table-column label="出库片位" align="center" prop="ckSequence"/>
        <pl-table-column label="柜位盒号" align="center" prop="arkBoxNo"/>
        <pl-table-column label="柜位片位" align="center" prop="arkSequence"/>
        <pl-table-column label="衬底类型" align="center" prop="substrateType"/>
        <pl-table-column label="衬底厂家" align="center" prop="supplier"/>
        <pl-table-column label="镭刻号" align="center" prop="laserMark" width="120px" show-overflow-tooltip/>
        <pl-table-column label="目检" align="center" prop="visualLevel"/>
        <pl-table-column label="PL_WD" align="center" prop="wd"/>
        <pl-table-column label="PL_WD_STD" align="center" prop="wdStd" width="150px" show-overflow-tooltip/>
        <pl-table-column label="PL.I.I" align="center" prop="ii"/>
        <pl-table-column label="PL.I.I.Std" align="center" prop="iiStd" width="150px" show-overflow-tooltip/>
        <pl-table-column label="PL_PD" align="center" prop="pdavr" show-overflow-tooltip/>
        <pl-table-column label="PL_Ref" align="center" prop="ref" show-overflow-tooltip/>
        <pl-table-column label="LOP(460)" align="center" prop="lop460" show-overflow-tooltip/>
        <pl-table-column label="综合判定" align="center" prop="result" show-overflow-tooltip/>
        <pl-table-column label="ESD(200)" align="center" prop="esd200" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.esd200 }}%
          </template>
        </pl-table-column>
        <pl-table-column label="ESD去坏(50V)" align="center" prop="esd50" width="150px" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.esd50 }}%
          </template>
        </pl-table-column>
        <pl-table-column label="综合良率" align="center" prop="yieldZh" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.yieldZh }}%
          </template>
        </pl-table-column>
        <pl-table-column label="VF1 Yield" align="center" prop="yieldVf1" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.yieldVf1 }}%
          </template>
        </pl-table-column>
        <pl-table-column label="IR Yield" align="center" prop="yieldIr" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.yieldIr }}%
          </template>
        </pl-table-column>
        <pl-table-column label="VZ Yield" align="center" prop="yieldVz" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.yieldVz }}%
          </template>
        </pl-table-column>
        <pl-table-column label="VF1" align="center" prop="vf1" show-overflow-tooltip/>
        <pl-table-column label="VF2" align="center" prop="vf2" show-overflow-tooltip/>
        <pl-table-column label="WLD1" align="center" prop="wld" show-overflow-tooltip/>
        <pl-table-column label="IR" align="center" prop="lr" show-overflow-tooltip/>
        <pl-table-column label="VZ" align="center" prop="avgVz" show-overflow-tooltip/>
        <pl-table-column label="IV" align="center" prop="avgIv" show-overflow-tooltip/>
        <pl-table-column label="WLD(PL-COW)" align="center" prop="pcwld" width="150px" show-overflow-tooltip/>
        <pl-table-column label="预估COW波长" align="center" prop="ygbc" width="150px" show-overflow-tooltip/>
        <pl-table-column label="ESD(400)" align="center" prop="esd400" show-overflow-tooltip/>
        <pl-table-column label="验证版型" align="center" prop="yzType" show-overflow-tooltip/>
        <pl-table-column label="生产类型" align="center" prop="scType" show-overflow-tooltip/>
        <pl-table-column label="外延盒号" align="center" prop="wyBoxNo" show-overflow-tooltip/>
        <pl-table-column label="ESD去坏（500V）" align="center" prop="esd500" width="150px" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.esd500 }}%
          </template>
        </pl-table-column>
        <pl-table-column label="ESD去坏（300V）" align="center" prop="esd300" width="150px" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.esd300 }}%
          </template>
        </pl-table-column>
        <pl-table-column label="BOW" align="center" prop="bow" show-overflow-tooltip/>
        <pl-table-column label="LINT_STD" align="center" prop="plIntStd" show-overflow-tooltip/>
        <pl-table-column label="Avg_Vf4" align="center" prop="avgVf4" show-overflow-tooltip/>
        <pl-table-column label="Thyristor良率" align="center" prop="thyristor" width="150px" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.thyristor }}%
          </template>
        </pl-table-column>
      </pl-table>
      <pl-table
        v-loading="listLoading"
        v-if="showRealName === '验证片'"
        :datas="list"
        :row-height="35"
        element-loading-text="拼命加载中"
        style="height:500px"
        class="broad-scrollbar-table"
        border
        fit
        header-drag-style
        use-virtual>
        <pl-table-column align="center" label="序号" width="50" fixed>
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </pl-table-column>
        <pl-table-column label="批号" align="center" prop="batchNo" width="200px" fixed show-overflow-tooltip/>
        <pl-table-column label="片号" align="center" prop="waferNo" width="200px" fixed show-overflow-tooltip/>
        <pl-table-column label="RunID" align="center" prop="runId"/>
        <pl-table-column label="WaferID" align="center" prop="waferId"/>
        <pl-table-column label="镭刻号" align="center" prop="laserMark"/>
        <pl-table-column label="正面衬底" align="center" prop="frontSubstrate" width="100px"/>
        <pl-table-column label="目检" align="center" prop="visual" width="80px"/>
        <pl-table-column label="波长" align="center" prop="bochang" width="80px"/>
        <pl-table-column label="STD" align="center" prop="std" width="80px"/>
        <pl-table-column label="控制片" align="center" width="80px">
          <template slot-scope="scope">
            <span v-if="scope.row.kzslice === 1" style="font-weight: bold">是</span>
            <span v-if="scope.row.kzslice === 0" style="font-weight: bold">否</span>
          </template>
        </pl-table-column>
        <pl-table-column label="备注" align="center" prop="remark" show-overflow-tooltip/>
      </pl-table>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="logDialogVisible"
      class="app-containers sts elsd sefdd"
      title="投片记录"
      width="1300px">
      <el-row>
        <el-col :span="24">
          <div class="input-item">
            <span class="input-title" style="width:35px">单号 </span>
            <el-input v-model="sigleNo" class="search-input style-input" style="width: 122px !important" placeholder="请输入单号" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title" style="width:65px">产品型号 </span>
            <el-input v-model="productNo" class="search-input style-input" style="width:130px" placeholder="请输入产品型号" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title" style="width:65px">投片类型 </span>
            <el-select v-model="tpType" class="search-input style-input" style="width: 90px !important;" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in categoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title" style="width:50px">紧急度 </span>
            <el-select v-model="jsd" class="search-input style-input" style="width: 90px !important;" size="small" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in urgentList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <div class="input-item">
            <span class="input-title">投片日期 </span>
            <el-date-picker
              v-model="beginDate"
              :picker-options="pickerOptionsStart"
              :editable="false"
              class="search-input"
              style="width:127px"
              size="small"
              type="date"
              placeholder="开始日期"
              value-format="timestamp"
              clearable
            />
            <span style="display:inline-block;width: 38px;text-align: center"> 至 </span>
            <el-date-picker
              v-model="endDate"
              :picker-options="pickerOptionsEnd"
              :editable="false"
              class="search-input"
              style="width:127px"
              size="small"
              type="date"
              placeholder="结束日期"
              value-format="timestamp"
              clearable
            />
          </div>
          <div class="input-item">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-search"
              @click="handleSearchLog"
            > 查询</el-button>
          </div>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-col :span="3" style="margin-left: 85.33333%;margin-top:15px">
          <el-button
            size="small"
            type="danger"
            @click="tpLogClear"
          ><svg-icon icon-class="shujuguanli"/> 重置</el-button>
        </el-col>
      </el-row> -->
      <div class="table-top-btn-group" style="margin-top:15px">
        <div
          :class="{'active':logogisActive === 0}"
          @click="navClicklog(0)"
        >
          单据信息
        </div>
        <div
          :class="{'active':logogisActive === 1}"
          @click="navClicklog(1)"
        >
          Wafer信息TOL: <span v-text="anotherlistlog.length"/>
        </div>
        <el-button type="primary" class="bonst" style="margin-top: 5px;" size="small" @click="importLog()"><svg-icon icon-class="import" style="color:#009494"/>  导出</el-button>
        <el-button type="primary" class="bonst" style="margin-top: 8px;" size="mini" @click="changepx()"><svg-icon icon-class="change"/> 切换片型</el-button>
      </div>
      <div style="width: 100%;height:400px">
        <pl-table
          v-show="logogisActive === 0"
          ref="listTabels"
          :datas="logList"
          :cell-style="tableRowClassColors"
          :row-height="35"
          element-loading-text="拼命加载中"
          class="broad-scrollbar-table ste tip-out-inner-dialog sses"
          style="height:100%"
          highlight-current-row
          border
          fit
          header-drag-style
          use-virtual
          @current-change="handleCurrentChanges">
          <pl-table-column align="center" label="序号" width="50" fixed>
            <template slot-scope="scope">
              {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
            </template>
          </pl-table-column>
          <pl-table-column label="任务单号" align="center" prop="billNo" width="150px" fixed show-overflow-tooltip/>
          <pl-table-column label="产品型号" align="center" prop="model" width="150px" show-overflow-tooltip/>
          <pl-table-column label="投片数量" align="center" prop="tpNum" show-overflow-tooltip/>
          <pl-table-column label="生产批数" align="center" prop="batchNum" show-overflow-tooltip/>
          <pl-table-column label="投片类型" align="center" prop="category" width="150px" show-overflow-tooltip/>
          <pl-table-column label="片型" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.pattern === 1">
                方片
              </span>
              <span v-if="scope.row.pattern === 0">
                圆片
              </span>
            </template>
          </pl-table-column>
          <!-- <pl-table-column label="光色" align="center" prop="color" show-overflow-tooltip/> -->
          <pl-table-column label="紧急度" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.priority === 1">
                加急
              </span>
              <span v-if="scope.row.priority === 0">
                正常
              </span>
            </template>
          </pl-table-column>
          <!-- <pl-table-column label="电极" align="center" prop="electrode" show-overflow-tooltip/>
          <pl-table-column label="工艺" align="center" prop="craft" show-overflow-tooltip/> -->
          <pl-table-column label="流程卡" align="center" width="150px" show-overflow-tooltip>
            <template slot-scope="scope">
              <a class="primarya" @click="handleReview(scope.row)"> {{ scope.row.flowCardName }}</a>
            </template>
          </pl-table-column>
          <pl-table-column label="标签" align="center" width="150px" show-overflow-tooltip>
            <template slot-scope="scope">
              <a class="primarya" @click="handleImg(scope.row)"> {{ scope.row.label }}</a>
            </template>
          </pl-table-column>
          <pl-table-column label="投片人" align="center" prop="creatorName" width="150px" show-overflow-tooltip/>
          <pl-table-column label="投片日期" align="center" prop="createTime" width="150px" show-overflow-tooltip/>
          <pl-table-column label="投片状态" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.status === 0">待接收</span>
              <span v-if="scope.row.status === 1">已接收</span>
              <span v-if="scope.row.status === 2">已退回</span>
            </template>
          </pl-table-column>
          <pl-table-column fixed="right" label="操作" align="center" width="260px">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="printLabelagain(scope.row)"
              >补打标签</el-button>
              <el-button
                size="mini"
                @click="printLCagain(scope.row)"
              >打印流程卡</el-button>
              <el-button
                v-if="scope.row.status === 2||scope.row.status === 0"
                size="mini"
                type="primary"
                @click="edits(scope.row)"
              >编辑</el-button>
            </template>
          </pl-table-column>
        </pl-table>
        <!--wafer信息-->
        <pl-table
          v-loading="listLoading"
          v-if="showRealNamelog !== '验证片'&&logogisActive === 1"
          :datas="anotherlistlog"
          :row-height="35"
          element-loading-text="拼命加载中"
          style="height:100%"
          border
          fit
          stripe
          header-drag-style
          use-virtual>
          <pl-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </pl-table-column>
          <pl-table-column label="批号" align="center" prop="batchNo" width="200px" show-overflow-tooltip/>
          <pl-table-column label="片号" align="center" prop="waferNo" width="200px" show-overflow-tooltip/>
          <pl-table-column label="RunID" align="center" prop="runId" width="120px" show-overflow-tooltip/>
          <pl-table-column label="WaferID" align="center" prop="wyWaferId" width="120px" show-overflow-tooltip/>
          <pl-table-column label="柜位" align="center" prop="arkName"/>
          <pl-table-column label="出库盒号" align="center" prop="boxNo" width="120px" show-overflow-tooltip/>
          <pl-table-column label="出库片位" align="center" prop="ckSequence"/>
          <pl-table-column label="柜位盒号" align="center" prop="arkBoxNo"/>
          <pl-table-column label="柜位片位" align="center" prop="arkSequence"/>
          <pl-table-column label="衬底类型" align="center" prop="substrateType"/>
          <pl-table-column label="衬底厂家" align="center" prop="supplier"/>
          <pl-table-column label="镭刻号" align="center" prop="laserMark" width="120px" show-overflow-tooltip/>
          <pl-table-column label="目检" align="center" prop="visualLevel"/>
          <pl-table-column label="PL_WD" align="center" prop="wd"/>
          <pl-table-column label="PL_WD_STD" align="center" prop="wdStd" width="150px" show-overflow-tooltip/>
          <pl-table-column label="PL.I.I" align="center" prop="ii"/>
          <pl-table-column label="PL.I.I.Std" align="center" prop="iiStd" width="150px" show-overflow-tooltip/>
          <pl-table-column label="PL_PD" align="center" prop="pdavr" show-overflow-tooltip/>
          <pl-table-column label="PL_Ref" align="center" prop="ref" show-overflow-tooltip/>
          <pl-table-column label="LOP(460)" align="center" prop="lop460" show-overflow-tooltip/>
          <pl-table-column label="综合判定" align="center" prop="result" show-overflow-tooltip/>
          <pl-table-column label="ESD(200)" align="center" prop="esd200" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.esd200 }}%
            </template>
          </pl-table-column>
          <pl-table-column label="ESD去坏(50V)" align="center" prop="esd50" width="150px" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.esd50 }}%
            </template>
          </pl-table-column>
          <pl-table-column label="综合良率" align="center" prop="yieldZh" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.yieldZh }}%
            </template>
          </pl-table-column>
          <pl-table-column label="VF1 Yield" align="center" prop="yieldVf1" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.yieldVf1 }}%
            </template>
          </pl-table-column>
          <pl-table-column label="IR Yield" align="center" prop="yieldIr" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.yieldIr }}%
            </template>
          </pl-table-column>
          <pl-table-column label="VZ Yield" align="center" prop="yieldVz" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.yieldVz }}%
            </template>
          </pl-table-column>
          <pl-table-column label="VF1" align="center" prop="vf1" show-overflow-tooltip/>
          <pl-table-column label="VF2" align="center" prop="vf2" show-overflow-tooltip/>
          <pl-table-column label="WLD1" align="center" prop="wld" show-overflow-tooltip/>
          <pl-table-column label="IR" align="center" prop="lr" show-overflow-tooltip/>
          <pl-table-column label="VZ" align="center" prop="avgVz" show-overflow-tooltip/>
          <pl-table-column label="IV" align="center" prop="avgIv" show-overflow-tooltip/>
          <pl-table-column label="WLD(PL-COW)" align="center" prop="pcwld" width="150px" show-overflow-tooltip/>
          <pl-table-column label="预估COW波长" align="center" prop="ygbc" width="150px" show-overflow-tooltip/>
          <pl-table-column label="ESD(400)" align="center" prop="esd400" show-overflow-tooltip/>
          <pl-table-column label="验证版型" align="center" prop="yzType" show-overflow-tooltip/>
          <pl-table-column label="生产类型" align="center" prop="scType" show-overflow-tooltip/>
          <pl-table-column label="外延盒号" align="center" prop="wyBoxNo" show-overflow-tooltip/>
          <pl-table-column label="ESD去坏（500V）" align="center" prop="esd500" width="150px" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.esd500 }}%
            </template>
          </pl-table-column>
          <pl-table-column label="ESD去坏（300V）" align="center" prop="esd300" width="150px" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.esd300 }}%
            </template>
          </pl-table-column>
          <pl-table-column label="BOW" align="center" prop="bow" show-overflow-tooltip/>
          <pl-table-column label="LINT_STD" align="center" prop="plIntStd" show-overflow-tooltip/>
          <pl-table-column label="Avg_Vf4" align="center" prop="avgVf4" show-overflow-tooltip/>
          <pl-table-column label="Thyristor良率" align="center" prop="thyristor" width="150px" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.thyristor }}%
            </template>
          </pl-table-column>
        </pl-table>
        <pl-table
          v-loading="listLoading"
          v-if="showRealNamelog === '验证片'&&logogisActive === 1"
          :datas="anotherlistlog"
          :row-height="35"
          element-loading-text="拼命加载中"
          style="height:100%"
          class="mocvd-table run-table"
          border
          fit
          stripe
          header-drag-style
          use-virtual>
          <pl-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </pl-table-column>
          <pl-table-column label="批号" align="center" prop="batchNo" width="200px" show-overflow-tooltip/>
          <pl-table-column label="片号" align="center" prop="waferNo" width="200px" show-overflow-tooltip/>
          <pl-table-column label="RunID" align="center" prop="runId" width="120px" show-overflow-tooltip/>
          <pl-table-column label="WaferID" align="center" prop="waferId" width="120px" show-overflow-tooltip/>
          <pl-table-column label="镭刻号" align="center" prop="laserMark" width="120px" show-overflow-tooltip/>
          <pl-table-column label="正面衬底" align="center" prop="frontSubstrate"/>
          <pl-table-column label="目检" align="center" prop="visual"/>
          <pl-table-column label="波长" align="center" prop="bochang"/>
          <pl-table-column label="STD" align="center" prop="std"/>
          <pl-table-column label="控制片" align="center" >
            <template slot-scope="scope">
              <span v-if="scope.row.kzslice === 1" style="font-weight: bold">是</span>
              <span v-if="scope.row.kzslice === 0" style="font-weight: bold">否</span>
            </template>
          </pl-table-column>
          <pl-table-column label="备注" align="center" prop="remark" width="200" show-overflow-tooltip/>
        </pl-table>
      </div>
      <el-pagination
        v-if="totalPage>12&&logogisActive === 0"
        :current-page="pageNum"
        :page-sizes="[12, 30, 40]"
        :page-size="pageSize"
        :total="totalPage"
        class="pagination"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
      <el-dialog
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
                    <el-select v-model="scope.row.siteId" :disabled="true" placeholder="" size="small" style="width: 95%" filterable>
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
      <el-dialog
        v-drag
        :close-on-click-modal="false"
        :visible.sync="imgVisible"
        class="inner-dialog"
        width="500px"
        top="8vh"
        title="查看标签"
        append-to-body>
        <div style="width:100%;text-align: center;">
          <img :src="labelUrl" alt="" style="width:100%">
        </div>
      </el-dialog>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="ckDialogVisible"
      :title="showRealName === '验证片'?'验证片单':'出库单'"
      class="app-containers sts elsd sefdd"
      width="1300px">
      <el-row>
        <el-col :span="24">
          <div class="input-item">
            <span class="input-title" style="width:35px">单号 </span>
            <el-input v-model="sigleNo" class="search-input style-input" style="width:130px" placeholder="请输入单号" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">申请日期 </span>
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
          </div>
          <div class="input-item">
            <el-button
              size="small"
              type="primary"
              @click="handleSearchList"
            ><svg-icon icon-class="importRecords"/> 查询</el-button>
            <el-button
              size="small"
              type="danger"
              @click="showClear"
            ><svg-icon icon-class="shujuguanli"/> 重置</el-button>
          </div>
        </el-col>
      </el-row>
      <div class="table-top-btn-group" style="margin-top:15px">
        <div
          :class="{'active':ckisActive === 0}"
          @click="navClick(0)"
        >
          单据信息
        </div>
        <div
          :class="{'active':ckisActive === 1}"
          @click="navClick(1)"
        >
          Wafer信息TOL: <span v-text="anotherlist.length"/>
        </div>
      </div>
      <div style="width: 100%; height:400px">
        <pl-table
          v-show="showRealName !== '验证片'&&ckisActive===0"
          ref="listTabel"
          :datas="showLists"
          :cell-style="tableRowClassColor"
          :row-height="35"
          element-loading-text="拼命加载中"
          style="height:100%"
          class="run-table ste tip-out-inner-dialog"
          highlight-current-row
          border
          fit
          header-drag-style
          use-virtual
          @current-change="handleCurrentChange">
          <pl-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
            </template>
          </pl-table-column>
          <pl-table-column label="单号" align="center" prop="orderNo" width="150px" show-overflow-tooltip/>
          <pl-table-column label="单据类型" align="center" prop="orderType" show-overflow-tooltip/>
          <pl-table-column label="客户名称" align="center" prop="customer" width="150px" show-overflow-tooltip/>
          <pl-table-column label="申请人" align="center" prop="creator" width="150px" show-overflow-tooltip/>
          <pl-table-column label="申请日期" align="center" prop="createTime" width="150px" show-overflow-tooltip/>
          <pl-table-column label="制单人" align="center" prop="trial" width="150px" show-overflow-tooltip/>
          <pl-table-column label="制单日期" align="center" prop="trialTime" width="150px" show-overflow-tooltip/>
          <pl-table-column label="审核人" align="center" prop="auditor" width="150px" show-overflow-tooltip/>
          <pl-table-column label="审核日期" align="center" prop="auditTime" width="150px" show-overflow-tooltip/>
          <pl-table-column label="所用规则" align="center" prop="ruleName" width="150px" show-overflow-tooltip/>
          <pl-table-column label="规则版本" align="center" prop="ruleVersion" width="150px" show-overflow-tooltip/>
          <pl-table-column label="备注" align="center" prop="remark" width="150px" show-overflow-tooltip/>
          <pl-table-column fixed="right" label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="selectThisList(scope.row)"
              ><svg-icon icon-class="xuanzexx"/> 选择</el-button>
            </template>
          </pl-table-column>
        </pl-table>
        <pl-table
          v-if="showRealName === '验证片'&&ckisActive===0"
          ref="listTabel"
          :datas="showLists"
          :cell-style="tableRowClassColor"
          :row-height="35"
          element-loading-text="拼命加载中"
          style="height:100%"
          class="run-table ste tip-out-inner-dialog"
          highlight-current-row
          border
          fit
          header-drag-style
          use-virtual
          @current-change="handleCurrentChange">
          <pl-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
            </template>
          </pl-table-column>
          <pl-table-column label="单号" align="center" prop="billNo" width="120"/>
          <pl-table-column label="验证版型" align="center" prop="yzType" width="120"/>
          <pl-table-column label="结构类型" align="center" prop="jgType" width="120"/>
          <pl-table-column label="衬底工艺" align="center" prop="cdType" width="120"/>
          <pl-table-column label="单据状态" align="center" prop="operation">
            <template slot-scope="scope">
              <span v-if="scope.row.operation === '0'">送片</span>
              <span v-if="scope.row.operation === '1'">送样</span>
              <span v-if="scope.row.operation === '2'">破坏测试</span>
            </template>
          </pl-table-column>
          <pl-table-column label="送片人" align="center" prop="creatorName"/>
          <pl-table-column label="送片日期" align="center" prop="createTime" width="120" show-overflow-tooltip/>
          <pl-table-column label="收片人" align="center" prop="takerName"/>
          <pl-table-column label="收片日期" align="center" prop="takerTime" width="120" show-overflow-tooltip/>
          <pl-table-column label="审核状态" align="center" prop="auditResult">
            <template slot-scope="scope">
              <span v-if="scope.row.auditResult === '1'" style="color: #009494;font-weight: bold">通过</span>
              <span v-if="scope.row.auditResult === '0'" style="color: #f33;font-weight: bold">不通过</span>
              <span v-if="scope.row.auditResult === '2'" style="color:#1C84C6;font-weight: bold">待审核</span>
            </template>
          </pl-table-column>
          <pl-table-column label="审核人" align="center" prop="auditorName"/>
          <pl-table-column label="备注" align="center" prop="remark" width="200" show-overflow-tooltip/>
          <pl-table-column fixed="right" label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="selectThisList(scope.row)"
              ><svg-icon icon-class="xuanzexx"/> 选择</el-button>
            </template>
          </pl-table-column>
        </pl-table>
        <!--wafer信息-->
        <pl-table
          v-loading="listLoading"
          v-if="showRealName !== '验证片'&&ckisActive === 1"
          :datas="anotherlist"
          :row-height="35"
          element-loading-text="拼命加载中"
          style="height:100%"
          border
          fit
          stripe
          header-drag-style
          use-virtual>
          <pl-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </pl-table-column>
          <pl-table-column label="RunID" align="center" prop="runId" width="120px" show-overflow-tooltip/>
          <pl-table-column label="WaferID" align="center" prop="wyWaferId" width="120px" show-overflow-tooltip/>
          <pl-table-column label="柜位" align="center" prop="arkName"/>
          <pl-table-column label="出库盒号" align="center" prop="boxNo" width="120px" show-overflow-tooltip/>
          <pl-table-column label="出库片位" align="center" prop="ckSequence"/>
          <pl-table-column label="柜位盒号" align="center" prop="arkBoxNo"/>
          <pl-table-column label="柜位片位" align="center" prop="arkSequence"/>
          <pl-table-column label="衬底类型" align="center" prop="substrateType"/>
          <pl-table-column label="衬底厂家" align="center" prop="supplier"/>
          <pl-table-column label="镭刻号" align="center" prop="laserMark" width="120px" show-overflow-tooltip/>
          <pl-table-column label="目检" align="center" prop="visualLevel"/>
          <pl-table-column label="PL_WD" align="center" prop="wd"/>
          <pl-table-column label="PL_WD_STD" align="center" prop="wdStd" width="150px" show-overflow-tooltip/>
          <pl-table-column label="PL.I.I" align="center" prop="ii"/>
          <pl-table-column label="PL.I.I.Std" align="center" prop="iiStd" width="150px" show-overflow-tooltip/>
          <pl-table-column label="PL_PD" align="center" prop="pdavr" show-overflow-tooltip/>
          <pl-table-column label="PL_Ref" align="center" prop="ref" show-overflow-tooltip/>
          <pl-table-column label="LOP(460)" align="center" prop="lop460" show-overflow-tooltip/>
          <pl-table-column label="综合判定" align="center" prop="result" show-overflow-tooltip/>
          <pl-table-column label="ESD(200)" align="center" prop="esd200" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.esd200 }}%
            </template>
          </pl-table-column>
          <pl-table-column label="ESD去坏(50V)" align="center" prop="esd50" width="150px" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.esd50 }}%
            </template>
          </pl-table-column>
          <pl-table-column label="综合良率" align="center" prop="yieldZh" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.yieldZh }}%
            </template>
          </pl-table-column>
          <pl-table-column label="VF1 Yield" align="center" prop="yieldVf1" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.yieldVf1 }}%
            </template>
          </pl-table-column>
          <pl-table-column label="IR Yield" align="center" prop="yieldIr" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.yieldIr }}%
            </template>
          </pl-table-column>
          <pl-table-column label="VZ Yield" align="center" prop="yieldVz" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.yieldVz }}%
            </template>
          </pl-table-column>
          <pl-table-column label="VF1" align="center" prop="vf1" show-overflow-tooltip/>
          <pl-table-column label="VF2" align="center" prop="vf2" show-overflow-tooltip/>
          <pl-table-column label="WLD1" align="center" prop="wld" show-overflow-tooltip/>
          <pl-table-column label="IR" align="center" prop="lr" show-overflow-tooltip/>
          <pl-table-column label="VZ" align="center" prop="avgVz" show-overflow-tooltip/>
          <pl-table-column label="IV" align="center" prop="avgIv" show-overflow-tooltip/>
          <pl-table-column label="WLD(PL-COW)" align="center" prop="pcwld" width="150px" show-overflow-tooltip/>
          <pl-table-column label="预估COW波长" align="center" prop="ygbc" width="150px" show-overflow-tooltip/>
          <pl-table-column label="ESD(400)" align="center" prop="esd400" show-overflow-tooltip/>
          <pl-table-column label="验证版型" align="center" prop="yzType" show-overflow-tooltip/>
          <pl-table-column label="生产类型" align="center" prop="scType" show-overflow-tooltip/>
          <pl-table-column label="外延盒号" align="center" prop="wyBoxNo" show-overflow-tooltip/>
          <pl-table-column label="ESD去坏（500V）" align="center" prop="esd500" width="150px" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.esd500 }}%
            </template>
          </pl-table-column>
          <pl-table-column label="ESD去坏（300V）" align="center" prop="esd300" width="150px" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.esd300 }}%
            </template>
          </pl-table-column>
          <pl-table-column label="BOW" align="center" prop="bow" show-overflow-tooltip/>
          <pl-table-column label="LINT_STD" align="center" prop="plIntStd" show-overflow-tooltip/>
          <pl-table-column label="Avg_Vf4" align="center" prop="avgVf4" show-overflow-tooltip/>
          <pl-table-column label="Thyristor良率" align="center" prop="thyristor" width="150px" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.thyristor }}%
            </template>
          </pl-table-column>
        </pl-table>
        <pl-table
          v-loading="listLoading"
          v-if="showRealName === '验证片'&&ckisActive === 1"
          :datas="anotherlist"
          :row-height="35"
          element-loading-text="拼命加载中"
          style="height:100%"
          class="mocvd-table run-table"
          border
          fit
          stripe
          header-drag-style
          use-virtual>
          <pl-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </pl-table-column>
          <pl-table-column label="RunID" align="center" prop="runId" width="120px" show-overflow-tooltip/>
          <pl-table-column label="WaferID" align="center" prop="waferId" width="120px" show-overflow-tooltip/>
          <pl-table-column label="镭刻号" align="center" prop="laserMark" width="120px" show-overflow-tooltip/>
          <pl-table-column label="正面衬底" align="center" prop="frontSubstrate"/>
          <pl-table-column label="目检" align="center" prop="visual"/>
          <pl-table-column label="波长" align="center" prop="bochang"/>
          <pl-table-column label="STD" align="center" prop="std"/>
          <pl-table-column label="控制片" align="center" >
            <template slot-scope="scope">
              <span v-if="scope.row.kzslice === 1" style="font-weight: bold">是</span>
              <span v-if="scope.row.kzslice === 0" style="font-weight: bold">否</span>
            </template>
          </pl-table-column>
          <pl-table-column label="备注" align="center" prop="remark" width="200" show-overflow-tooltip/>
        </pl-table>
      </div>
      <el-pagination
        v-if="totalPage>12&&ckisActive === 0"
        :current-page="pageNum"
        :page-sizes="[12, 30, 40]"
        :page-size="pageSize"
        :total="totalPage"
        class="pagination"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="cksizeChange"
        @current-change="ckcurrentChange"
      />
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="setDialogVisible"
      title="批号管理"
      width="500px">
      <el-form ref="machineForm" :model="machineForm" :rules="rules" status-icon label-width="120px" label-position="right">
        <el-form-item label="验证片起始号 " prop="yzpMin">
          <el-input v-model="machineForm.yzpMin" placeholder="请输入" maxlength="3" oninput="this.value=this.value.replace(/[^0-9]/g,'');"/>
        </el-form-item>
        <el-form-item label="验证片结束号 " prop="yzpMax">
          <el-input v-model="machineForm.yzpMax" placeholder="请输入" maxlength="3" oninput="this.value=this.value.replace(/[^0-9]/g,'');"/>
        </el-form-item>
        <el-form-item label="其他片起始号 " prop="otherMin">
          <el-input v-model="machineForm.otherMin" placeholder="请输入" maxlength="3" oninput="this.value=this.value.replace(/[^0-9]/g,'');"/>
        </el-form-item>
        <el-form-item label="其他片结束号 " prop="otherMax">
          <el-input v-model="machineForm.otherMax" placeholder="请输入" maxlength="3" oninput="this.value=this.value.replace(/[^0-9]/g,'');"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="setsubmitForm('machineForm')">确 定</el-button>
        <el-button size="small" @click="setDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  @media (min-width: 1500px) {
    .pris {
      width: 100%;
      height: 160px !important;
      border: 1px solid rgb(229, 229, 229);
      padding-top: 0px;
    }
  }
  @media (min-width: 1410px) {
    .pris {
      width: 100%;
      height: 180px;
      border: 1px solid rgb(229, 229, 229);
      padding-top: 0px;
    }
  }
  @media (max-width: 1400px) {
    .pris {
      width: 100%;
      height: 213px;
      border: 1px solid rgb(229, 229, 229);
      padding-top: 0px;
    }
  }
  @media print {
    .print{
        display:block !important;
    }
  }
  .app-container{
    position: relative;
    min-height: 555px;
  }
  .app-containers>>> .el-table--border {
    border-top: 2px solid #009494;
  }
  .waferin{
    margin-top: -26px !important;
    position: absolute;
    z-index: 15;
    width: calc(100% - 45px);
    text-align: right;
  }
  .elsd>>>.el-dialog__body{
    padding-bottom: 60px !important;
  }
  .style-span{
    width:35px;
  }
  .style-span1{
    width:50px;
  }
  .style-input{
    width:130px !important;
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
  .primarya{
    color:#009494;
    cursor: pointer;
  }
  .right-btn-box{
    width: 260px;
  }
  .input-item{
    float: left;
    margin-top: 10px;
    margin-right: 10px;
  }
  .search-input{
    width: 160px;
  }
  .input-title {
    width: 65px
  }
  .fieldest{
    border: 1px solid #DCDFE6;
    padding-bottom: 0px;
    margin-top: 8px;
  }
  .legendsty{
    padding-left:8px;
    padding-right:8px;
    font-weight: bold;
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
  .broad-scrollbar-table>>>.el-table__fixed {
    height: 485px !important;
  }
  .broad-scrollbar-table>>>.el-table__fixed-body-wrapper {
    height: 443px !important;
  }
  .sses>>>.el-table__fixed {
    height: 385px !important;
  }
  .sses>>>.el-table__fixed-body-wrapper {
    height: 343px !important;
  }
  .sts>>>.el-dialog__body{
    padding: 20px;
    padding-top: 10px;
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
  .stt{
    width: 71px;
  }
  .tip-out-inner-dialog>>>.el-table__fixed-right {
    height: 385px !important;
  }
  .tip-out-inner-dialog>>>.el-table__fixed-body-wrapper {
    height: 343px !important;
  }
  .bonst{
    background: #fff;
    border: 0px;
    height: 20px;
    color: #009494;
    font-size: 14px;
    font-weight: bold;
    float:right;
    margin-top: -8px;
  }
  .sts>>> .el-table--scrollable-x{
    height: 400px !important;
  }
  .run-tablex>>> .el-table--scrollable-x{
    height: 500px !important;
  }
  .sefdd>>> .el-table__virtual-wrapper{
    height: 348px !important;
  }
</style>
