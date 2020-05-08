<template>
  <PageHeaderLayout>
    <div class="app-container">
      <div class="tab-control">
        <span
          :class="{activeTab: activeTabIndex === 0}"
          @click="tabClick(0)"
        >氢气</span>
        <span
          :class="{activeTab: activeTabIndex === 1}"
          class="has-margin-left"
          @click="tabClick(1)"
        >氨气</span>
        <span
          :class="{activeTab: activeTabIndex === 2}"
          class="has-margin-left"
          @click="tabClick(2)"
        >氮气</span>
        <span
          :class="{activeTab: activeTabIndex === 3}"
          class="has-margin-left"
          @click="tabClick(3)"
        >硅烷</span>
      </div>
      <div class="btn-group">
        <el-button
          v-if="!configuring"
          size="small"
          type="primary"
          class="float-right margin-left"
          @click="handleConfig"
        ><svg-icon icon-class="config"/> 配置</el-button>
        <el-button
          v-if="!configuring"
          size="small"
          type="primary"
          class="float-right"
          @click="gesReplaceRecord"
        ><svg-icon icon-class="replaceRecord"/> 气体切换记录</el-button>
        <el-button
          v-if="configuring"
          size="small"
          type="primary"
          class="float-right margin-left"
          @click="cancelConfig"
        >取 消</el-button>
        <el-button
          v-if="configuring"
          size="small"
          type="primary"
          class="float-right"
          @click="submitConfig"
        >保 存</el-button>
      </div>
      <!--氢气-->
      <div v-if="activeTabIndex === 0" class="gas-box">
        <div class="config-title">氢气更换管理</div>
        <div class="gas-config">
          <div class="start-gas-config">
            <div class="batch-manage">
              <div :class="{'active':h2Active === 'a'}" class="batch-item">A</div>
              <div class="batch-input-box">
                <span class="batch-manage-title margin-right">批次号:</span>
                <el-input v-model="batchA" :disabled="configuring || h2Active === 'a'" type="text" size="mini" placeholder="请输入批次号" maxlength="20" style="width: 140px"/>
                <el-button
                  :disabled="configuring || h2Active === 'a'"
                  type="primary"
                  size="mini"
                  class="margin-left"
                  @click="handleSwitchBatch"><svg-icon icon-class="change"/> 更换</el-button>
              </div>
            </div>
            <div class="batch-manage">
              <div :class="{'active':h2Active === 'b'}" class="batch-item">B</div>
              <div class="batch-input-box">
                <span class="batch-manage-title margin-right">批次号:</span>
                <el-input v-model="batchB" :disabled="configuring || h2Active === 'b'" type="text" size="mini" placeholder="请输入批次号" maxlength="20" style="width: 140px"/>
                <el-button
                  :disabled="configuring || h2Active === 'b'"
                  type="primary"
                  size="mini"
                  class="margin-left"
                  @click="handleSwitchBatch"><svg-icon icon-class="change"/> 更换</el-button>
              </div>
            </div>
            <el-button
              :disabled="configuring"
              size="small"
              type="primary"
              style="position: absolute;top:-50px;left: 150px"
              @click="gasSwitch"><svg-icon icon-class="change"/> 气体切换</el-button>
            <div class="start-bar"/>
            <div class="start-box">
              <div class="top-triangle"/>
              <div class="bottom-triangle"/>
            </div>
            <div class="vmb-box">
              <!--纯化器1-->
              <div :class="{'is-open':chq1Switch === '0'}" class="vmb-box-item chq1">
                <el-input :disabled="true || !configuring" v-model="chq1" placeholder="请输入" type="text" size="mini" maxlength="20" style="width: 120px"/>
                <el-switch
                  v-if="configuring"
                  v-model="chq1Switch"
                  class="chq-switch"
                  active-color="#009494"
                  inactive-color="#aaa"
                  active-value="0"
                  inactive-value="1"
                  @change="chq1SwitchChange"/>
              </div>
              <div class="vmb-box-item vmb1">
                <el-input :disabled="true || !configuring" v-model="vmb1" placeholder="请输入" type="text" size="mini" maxlength="20" style="width: 120px"/>
                <i v-if="configuring" class="addBtn el-icon-circle-plus" @click="addItem(1)"/>
                <div v-if="H2vmbList1.length !== 0" class="across-bar"/>
                <div class="select-item-top-box select-item-box">
                  <div v-for="(item, index) in H2vmbList1" :key="index" class="item">
                    <div class="item-arrows">
                      <i class="triangle"/>
                    </div>
                    <div v-if="index !== 0" class="vertical"/>
                    <i v-if="configuring" class="deleteBtn el-icon-remove" @click="deleteH2Item(index, 1)"/>
                    <el-select :disabled="!configuring" v-model="H2vmbList1[index].machineId" size="small" placeholder="请选择" filterable>
                      <el-option
                        v-for="i in machineList"
                        :key="i.id"
                        :label="i.code"
                        :value="i.id"/>
                    </el-select>
                  </div>
                </div>
              </div>
              <!--纯化器2-->
              <div :class="{'is-open':chq2Switch === '0'}" class="vmb-box-item chq2">
                <el-input :disabled="true || !configuring" v-model="chq2" placeholder="请输入" type="text" size="mini" maxlength="20" style="width: 120px"/>
                <el-switch
                  v-if="configuring"
                  v-model="chq2Switch"
                  class="chq-switch"
                  active-color="#009494"
                  inactive-color="#aaa"
                  active-value="0"
                  inactive-value="1"
                  @change="chq2SwitchChange"
                />
              </div>
              <div class="vmb-box-item vmb2">
                <el-input :disabled="true || !configuring" v-model="vmb2" placeholder="请输入" type="text" size="mini" maxlength="20" style="width: 120px"/>
                <i v-if="configuring" class="addBtn el-icon-circle-plus" @click="addItem(2)"/>
                <div v-if="H2vmbList2.length !== 0" class="across-bar"/>
                <div class="select-item-bottom-box select-item-box">
                  <div v-for="(item, index) in H2vmbList2" :key="index" class="item">
                    <div class="item-arrows">
                      <i class="triangle"/>
                    </div>
                    <div v-if="index !== 0" class="vertical"/>
                    <i v-if="configuring" class="deleteBtn el-icon-remove" @click="deleteH2Item(index, 2)"/>
                    <el-select :disabled="!configuring" v-model="H2vmbList2[index].machineId" size="small" placeholder="请选择" filterable>
                      <el-option
                        v-for="i in machineList"
                        :key="i.id"
                        :label="i.code"
                        :value="i.id"/>
                    </el-select>
                  </div>
                </div>
              </div>
              <div class="h-switch">
                <el-switch
                  v-if="configuring"
                  v-model="hSwitch"
                  active-color="#009494"
                  inactive-color="#aaa"
                  active-value="0"
                  inactive-value="1"
                  @change="hSwitchChange"
                />
                <span class="h-switch-status">H阀状态: <span v-if="hSwitch === '0'" class="is-open"> 已开启</span><span v-if="hSwitch === '1'" class="is-close">已关闭</span></span>
              </div>
              <div class="vmb-bar-top"/>
              <div class="vmb-bar-bottom"/>
              <div :class="{'h-is-open':hSwitch === '0'}" class="vmb-bar-vertical"/>
              <div v-if="hSwitch === '1'" class="vmb-bar-h-close"><svg-icon icon-class="guanfa"/></div>
              <div v-if="hSwitch === '0'" class="vmb-bar-h-close h-open"><svg-icon icon-class="kaifa"/></div>
              <div class="h-bottom"/>
            </div>
          </div>
        </div>
      </div>
      <!--氨气-->
      <div v-if="activeTabIndex === 1" class="gas-box">
        <div class="config-title">氨气更换管理</div>
        <div class="gas-config">
          <div class="start-gas-config">
            <div class="batch-manage">
              <div :class="{'active':h2Active === 'a'}" class="batch-item">A</div>
              <div class="batch-input-box">
                <span class="batch-manage-title margin-right">批次号:</span>
                <el-input v-model="batchA" :disabled="configuring || h2Active === 'a'" type="text" size="mini" placeholder="请输入批次号" maxlength="20" style="width: 140px"/>
                <el-button
                  :disabled="configuring || h2Active === 'a'"
                  type="primary"
                  size="mini"
                  class="margin-left"
                  @click="handleSwitchBatch"><svg-icon icon-class="change"/> 更换</el-button>
              </div>
            </div>
            <div class="batch-manage">
              <div :class="{'active':h2Active === 'b'}" class="batch-item">B</div>
              <div class="batch-input-box">
                <span class="batch-manage-title margin-right">批次号:</span>
                <el-input v-model="batchB" :disabled="configuring || h2Active === 'b'" type="text" size="mini" placeholder="请输入批次号" maxlength="20" style="width: 140px"/>
                <el-button
                  :disabled="configuring || h2Active === 'b'"
                  type="primary"
                  size="mini"
                  class="margin-left"
                  @click="handleSwitchBatch"><svg-icon icon-class="change"/> 更换</el-button>
              </div>
            </div>
            <el-button
              :disabled="configuring"
              size="small"
              type="primary"
              style="position: absolute;top:-50px;left: 150px"
              @click="gasSwitch"><svg-icon icon-class="change"/> 气体切换</el-button>
            <div class="start-bar"/>
            <div class="start-box">
              <div class="top-triangle"/>
              <div class="bottom-triangle"/>
            </div>
            <div class="vmb-box">
              <!--纯化器1-->
              <div :class="{'is-open':chq1Switch === '0'}" class="vmb-box-item chq1">
                <el-input :disabled="true || !configuring" v-model="chq1" placeholder="请输入" type="text" size="mini" maxlength="20" style="width: 120px"/>
                <el-switch
                  v-if="configuring"
                  v-model="chq1Switch"
                  class="chq-switch"
                  active-color="#009494"
                  inactive-color="#aaa"
                  active-value="0"
                  inactive-value="1"
                  @change="chq1SwitchChange"/>
              </div>
              <div class="vmb-box-item vmb1">
                <el-input :disabled="true || !configuring" v-model="vmb1" placeholder="请输入" type="text" size="mini" maxlength="20" style="width: 120px"/>
                <i v-if="configuring" class="addBtn el-icon-circle-plus" @click="addItem(1)"/>
                <div v-if="H2vmbList1.length !== 0" class="across-bar"/>
                <div class="select-item-top-box select-item-box">
                  <div v-for="(item, index) in H2vmbList1" :key="index" class="item">
                    <div class="item-arrows">
                      <i class="triangle"/>
                    </div>
                    <div v-if="index !== 0" class="vertical"/>
                    <i v-if="configuring" class="deleteBtn el-icon-remove" @click="deleteH2Item(index, 1)"/>
                    <el-select :disabled="!configuring" v-model="H2vmbList1[index].machineId" size="small" placeholder="请选择" filterable>
                      <el-option
                        v-for="i in machineList"
                        :key="i.id"
                        :label="i.code"
                        :value="i.id"/>
                    </el-select>
                  </div>
                </div>
              </div>
              <!--纯化器2-->
              <div :class="{'is-open':chq2Switch === '0'}" class="vmb-box-item chq2">
                <el-input :disabled="true || !configuring" v-model="chq2" placeholder="请输入" type="text" size="mini" maxlength="20" style="width: 120px"/>
                <el-switch
                  v-if="configuring"
                  v-model="chq2Switch"
                  class="chq-switch"
                  active-color="#009494"
                  inactive-color="#aaa"
                  active-value="0"
                  inactive-value="1"
                  @change="chq2SwitchChange"
                />
              </div>
              <div class="vmb-box-item vmb2">
                <el-input :disabled="true || !configuring" v-model="vmb2" placeholder="请输入" type="text" size="mini" maxlength="20" style="width: 120px"/>
                <i v-if="configuring" class="addBtn el-icon-circle-plus" @click="addItem(2)"/>
                <div v-if="H2vmbList2.length !== 0" class="across-bar"/>
                <div class="select-item-bottom-box select-item-box">
                  <div v-for="(item, index) in H2vmbList2" :key="index" class="item">
                    <div class="item-arrows">
                      <i class="triangle"/>
                    </div>
                    <div v-if="index !== 0" class="vertical"/>
                    <i v-if="configuring" class="deleteBtn el-icon-remove" @click="deleteH2Item(index, 2)"/>
                    <el-select :disabled="!configuring" v-model="H2vmbList2[index].machineId" size="small" placeholder="请选择" filterable>
                      <el-option
                        v-for="i in machineList"
                        :key="i.id"
                        :label="i.code"
                        :value="i.id"/>
                    </el-select>
                  </div>
                </div>
              </div>
              <div class="h-switch">
                <el-switch
                  v-if="configuring"
                  v-model="hSwitch"
                  active-color="#009494"
                  inactive-color="#aaa"
                  active-value="0"
                  inactive-value="1"
                  @change="hSwitchChange"
                />
                <span class="h-switch-status">H阀状态: <span v-if="hSwitch === '0'" class="is-open">已开启</span><span v-if="hSwitch === '1'" class="is-close">已关闭</span></span>
              </div>
              <div class="vmb-bar-top"/>
              <div class="vmb-bar-bottom"/>
              <div :class="{'h-is-open':hSwitch === '0'}" class="vmb-bar-vertical"/>
              <div v-if="hSwitch === '1'" class="vmb-bar-h-close"><svg-icon icon-class="guanfa"/></div>
              <div v-if="hSwitch === '0'" class="vmb-bar-h-close h-open"><svg-icon icon-class="kaifa"/></div>
              <div class="h-bottom"/>
            </div>
          </div>
        </div>
      </div>
      <!--氮气-->
      <div v-if="activeTabIndex === 2" class="gas-box">
        <div class="config-title">氮气更换管理</div>
        <div class="gas-config">
          <div class="start-gas-config">
            <div style="line-height: 192px;text-align: center">气源</div>
            <el-button
              :disabled="configuring"
              size="small"
              type="primary"
              style="position: absolute;top:-50px;left: 150px"
              @click="N2Switch"><svg-icon icon-class="select"/> 冲 装</el-button>
            <div class="start-bar"/>
            <div class="start-box">
              <div class="top-triangle"/>
              <div class="bottom-triangle"/>
            </div>
            <div class="vmb-box">
              <!--纯化器1-->
              <div :class="{'is-open':chq1Switch === '0'}" class="vmb-box-item chq1">
                <el-input :disabled="true || !configuring" v-model="chq1" placeholder="请输入" type="text" size="mini" maxlength="20" style="width: 120px"/>
                <el-switch
                  v-if="configuring"
                  v-model="chq1Switch"
                  class="chq-switch"
                  active-color="#009494"
                  inactive-color="#aaa"
                  active-value="0"
                  inactive-value="1"
                  @change="chq1SwitchChange"/>
              </div>
              <div class="vmb-box-item vmb1">
                <el-input :disabled="true || !configuring" v-model="vmb1" placeholder="请输入" type="text" size="mini" maxlength="20" style="width: 120px"/>
                <i v-if="configuring" class="addBtn el-icon-circle-plus" @click="addItem(1)"/>
                <div v-if="H2vmbList1.length !== 0" class="across-bar"/>
                <div class="select-item-top-box select-item-box">
                  <div v-for="(item, index) in H2vmbList1" :key="index" class="item">
                    <div class="item-arrows">
                      <i class="triangle"/>
                    </div>
                    <div v-if="index !== 0" class="vertical"/>
                    <i v-if="configuring" class="deleteBtn el-icon-remove" @click="deleteH2Item(index, 1)"/>
                    <el-select :disabled="!configuring" v-model="H2vmbList1[index].machineId" size="small" placeholder="请选择" filterable>
                      <el-option
                        v-for="i in machineList"
                        :key="i.id"
                        :label="i.code"
                        :value="i.id"/>
                    </el-select>
                  </div>
                </div>
              </div>
              <!--纯化器2-->
              <div :class="{'is-open':chq2Switch === '0'}" class="vmb-box-item chq2">
                <el-input :disabled="true || !configuring" v-model="chq2" placeholder="请输入" type="text" size="mini" maxlength="20" style="width: 120px"/>
                <el-switch
                  v-if="configuring"
                  v-model="chq2Switch"
                  class="chq-switch"
                  active-color="#009494"
                  inactive-color="#aaa"
                  active-value="0"
                  inactive-value="1"
                  @change="chq2SwitchChange"
                />
              </div>
              <div class="vmb-box-item vmb2">
                <el-input :disabled="true || !configuring" v-model="vmb2" placeholder="请输入" type="text" size="mini" maxlength="20" style="width: 120px"/>
                <i v-if="configuring" class="addBtn el-icon-circle-plus" @click="addItem(2)"/>
                <div v-if="H2vmbList2.length !== 0" class="across-bar"/>
                <div class="select-item-bottom-box select-item-box">
                  <div v-for="(item, index) in H2vmbList2" :key="index" class="item">
                    <div class="item-arrows">
                      <i class="triangle"/>
                    </div>
                    <div v-if="index !== 0" class="vertical"/>
                    <i v-if="configuring" class="deleteBtn el-icon-remove" @click="deleteH2Item(index, 2)"/>
                    <el-select :disabled="!configuring" v-model="H2vmbList2[index].machineId" size="small" placeholder="请选择" filterable>
                      <el-option
                        v-for="i in machineList"
                        :key="i.id"
                        :label="i.code"
                        :value="i.id"/>
                    </el-select>
                  </div>
                </div>
              </div>
              <div class="h-switch">
                <el-switch
                  v-if="configuring"
                  v-model="hSwitch"
                  active-color="#009494"
                  inactive-color="#aaa"
                  active-value="0"
                  inactive-value="1"
                  @change="hSwitchChange"
                />
                <span class="h-switch-status">H阀状态: <span v-if="hSwitch === '0'" class="is-open">已开启</span><span v-if="hSwitch === '1'" class="is-close">已关闭</span></span>
              </div>
              <div class="vmb-bar-top"/>
              <div class="vmb-bar-bottom"/>
              <div :class="{'h-is-open':hSwitch === '0'}" class="vmb-bar-vertical"/>
              <div v-if="hSwitch === '1'" class="vmb-bar-h-close"><svg-icon icon-class="guanfa"/></div>
              <div v-if="hSwitch === '0'" class="vmb-bar-h-close h-open"><svg-icon icon-class="kaifa"/></div>
              <div class="h-bottom"/>
            </div>
          </div>
        </div>
      </div>
      <!--硅烷-->
      <div v-if="activeTabIndex === 3" class="gas-box sih4-box">
        <div class="config-title">硅烷更换管理</div>
        <div class="gas-config">
          <div class="sih4-start-config">
            <div class="sih4-start-gas">
              <el-button
                :disabled="configuring"
                size="small"
                type="primary"
                style="position: absolute;top:-50px;left: 150px"
                @click="sih4Switch1"><svg-icon icon-class="change"/> 气体切换</el-button>
              <span style="position: absolute;top: -30px;left:0;font-size: 16px;font-weight: bold">1 组气源</span>
              <div class="batch-manage">
                <div :class="{'active':sih4TopActive === 'a'}" class="batch-item">A</div>
                <div class="batch-input-box">
                  <span class="batch-manage-title margin-right">批次号:</span>
                  <el-input v-model="batchA1" :disabled="configuring || sih4TopActive === 'a'" type="text" size="mini" placeholder="请输入批次号" maxlength="20" style="width: 140px"/>
                  <el-button
                    :disabled="configuring || sih4TopActive === 'a'"
                    type="primary"
                    size="mini"
                    class="margin-left"
                    @click="handleSwitchBatch(1)"><svg-icon icon-class="change"/> 更换</el-button>
                </div>
              </div>
              <div class="batch-manage">
                <div :class="{'active':sih4TopActive === 'b'}" class="batch-item">B</div>
                <div class="batch-input-box">
                  <span class="batch-manage-title margin-right">批次号:</span>
                  <el-input v-model="batchB1" :disabled="configuring || sih4TopActive === 'b'" type="text" size="mini" placeholder="请输入批次号" maxlength="20" style="width: 140px"/>
                  <el-button
                    :disabled="configuring || sih4TopActive === 'b'"
                    type="primary"
                    size="mini"
                    class="margin-left"
                    @click="handleSwitchBatch(1)"><svg-icon icon-class="change"/> 更换</el-button>
                </div>
              </div>
            </div>
            <div class="sih4-start-gas">
              <el-button
                :disabled="configuring"
                size="small"
                type="primary"
                style="position: absolute;top:-50px;left: 150px"
                @click="sih4Switch2"><svg-icon icon-class="change"/> 气体切换</el-button>
              <span style="position: absolute;top: -30px;left:0;font-size: 16px;font-weight: bold">2 组气源</span>
              <div class="batch-manage">
                <div :class="{'active':sih4BottomActive === 'a'}" class="batch-item">A</div>
                <div class="batch-input-box">
                  <span class="batch-manage-title margin-right">批次号:</span>
                  <el-input v-model="batchA2" :disabled="configuring || sih4BottomActive === 'a'" type="text" size="mini" placeholder="请输入批次号" maxlength="20" style="width: 140px"/>
                  <el-button
                    :disabled="configuring || sih4BottomActive === 'a'"
                    type="primary"
                    size="mini"
                    class="margin-left"
                    @click="handleSwitchBatch(2)"><svg-icon icon-class="change"/> 更换</el-button>
                </div>
              </div>
              <div class="batch-manage">
                <div :class="{'active':sih4BottomActive === 'b'}" class="batch-item">B</div>
                <div class="batch-input-box">
                  <span class="batch-manage-title margin-right">批次号:</span>
                  <el-input v-model="batchB2" :disabled="configuring || sih4BottomActive === 'b'" type="text" size="mini" placeholder="请输入批次号" maxlength="20" style="width: 140px"/>
                  <el-button
                    :disabled="configuring || sih4BottomActive === 'b'"
                    type="primary"
                    size="mini"
                    class="margin-left"
                    @click="handleSwitchBatch(2)"><svg-icon icon-class="change"/> 更换</el-button>
                </div>
              </div>
            </div>
            <div class="sih4-start-bar"/>
            <div class="sih4-second-bar">
              <div class="h-switch" style="left:120px;top: -120px">
                <el-switch
                  v-if="configuring"
                  v-model="hSwitch"
                  active-color="#009494"
                  inactive-color="#aaa"
                  active-value="0"
                  inactive-value="1"
                  @change="hSwitchChange"
                />
                <span class="h-switch-status">H阀状态: <span v-if="hSwitch === '0'" class="is-open"> 已开启</span><span v-if="hSwitch === '1'" class="is-close">已关闭</span></span>
              </div>
            </div>
            <div :class="{'h-is-open':hSwitch === '0'}" class="sih4-h-vertical">
              <div v-if="hSwitch === '1'" class="sih4-bar-h-close"><svg-icon icon-class="guanfa"/></div>
              <div v-if="hSwitch === '0'" class="sih4-bar-h-close h-open"><svg-icon icon-class="kaifa"/></div>
              <div class="sih4-h-bottom"/>
            </div>
            <div class="sih4-vmb-box">
              <div class="vmb-box-item vmb1">
                <el-input :disabled="true || !configuring" v-model="vmb1" placeholder="请输入" type="text" size="mini" maxlength="20" style="width: 120px"/>
                <i v-if="configuring" class="addBtn el-icon-circle-plus" @click="addItem(1)"/>
                <div v-if="H2vmbList1.length !== 0" class="across-bar"/>
                <div class="select-item-top-box select-item-box">
                  <div v-for="(item, index) in H2vmbList1" :key="index" class="item">
                    <div class="item-arrows">
                      <i class="triangle"/>
                    </div>
                    <div v-if="index !== 0" class="vertical"/>
                    <i v-if="configuring" class="deleteBtn el-icon-remove" @click="deleteH2Item(index, 1)"/>
                    <el-select :disabled="!configuring" v-model="H2vmbList1[index].machineId" size="small" placeholder="请选择" filterable>
                      <el-option
                        v-for="i in machineList"
                        :key="i.id"
                        :label="i.code"
                        :value="i.id"/>
                    </el-select>
                  </div>
                </div>
              </div>
              <div class="vmb-box-item vmb2">
                <el-input :disabled="true || !configuring" v-model="vmb2" placeholder="请输入" type="text" size="mini" maxlength="20" style="width: 120px"/>
                <i v-if="configuring" class="addBtn el-icon-circle-plus" @click="addItem(2)"/>
                <div v-if="H2vmbList2.length !== 0" class="across-bar"/>
                <div class="select-item-bottom-box select-item-box">
                  <div v-for="(item, index) in H2vmbList2" :key="index" class="item">
                    <div class="item-arrows">
                      <i class="triangle"/>
                    </div>
                    <div v-if="index !== 0" class="vertical"/>
                    <i v-if="configuring" class="deleteBtn el-icon-remove" @click="deleteH2Item(index, 2)"/>
                    <el-select :disabled="!configuring" v-model="H2vmbList2[index].machineId" size="small" placeholder="请选择" filterable>
                      <el-option
                        v-for="i in machineList"
                        :key="i.id"
                        :label="i.code"
                        :value="i.id"/>
                    </el-select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-dialog
        v-drag
        :close-on-click-modal="false"
        :visible.sync="switchDialogVisible"
        title="提示"
        width="528px"
        @close="switchDialogClose"
      >
        <div v-if="!determine" style="font-weight: bold; height: 62px;text-align: center;padding-top: 15px" v-text="hintText"/>
        <el-form v-if="determine" ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
          <el-form-item :label="formTitle" required>
            <el-col :span="9">
              <el-form-item prop="date1">
                <el-date-picker
                  v-model="ruleForm.date1"
                  type="date"
                  size="small"
                  style="width: 100%;"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
            <el-col :span="1" style="text-align: center">- </el-col>
            <el-col :span="14">
              <!--<el-form-item prop="date2">
                <el-time-picker
                  v-model="ruleForm.date2"
                  placeholder="选择时间"
                  value-format="HH:mm:ss"
                  size="small"
                  style="width: 100%;"/>
              </el-form-item>-->
              <el-col :span="11">
                <el-form-item>
                  <el-select
                    v-model="ruleForm.hours"
                    size="small"
                    filterable
                    style="width:100px"
                    placeholder="请选择">
                    <el-option
                      v-for="item in hours"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name"
                      class="tip-out-input"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="1" style="text-align: center">: </el-col>
              <el-col :span="11">
                <el-form-item>
                  <el-select
                    v-model="ruleForm.minutes"
                    size="small"
                    filterable
                    class="tip-out-input"
                    style="width:100px"
                    placeholder="请选择">
                    <el-option
                      v-for="item in minutes"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name"/>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-col>
          </el-form-item>
        </el-form>
        <span v-if="!determine" slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="handleSwitch">确 定</el-button>
          <el-button size="small" @click="switchDialogVisible = false">取 消</el-button>
        </span>
        <span v-if="determine" slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="handleSwitchSubmit('ruleForm')">确 定</el-button>
          <el-button size="small" @click="switchDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog
        v-drag
        :close-on-click-modal="false"
        :visible.sync="gesReplaceDialogVisible"
        class="ges-replace-dialog padding-dialog"
        title="气体切换记录"
        width="1100px"
        @close="gesReplaceDialogClose"
      >
        <div style="overflow: hidden;margin-bottom: 10px">
          <div v-if="activeTabIndex !== 2" class="input-item">
            <span class="input-title">批次号 </span>
            <el-input v-model="searchKeys.pch" class="search-input" placeholder="请输入批次号" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title"><span v-if="activeTabIndex !== 2">切换时间 </span><span v-if="activeTabIndex === 2">冲装时间 </span></span>
            <el-date-picker
              v-model="beginDate"
              :picker-options="pickerOptionsStart"
              :editable="false"
              class="search-input"
              size="small"
              type="date"
              placeholder="选择开始日期"
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
              placeholder="选择结束日期"
              value-format="timestamp"
            />
          </div>
          <div class="input-item">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-search"
              @click="gesReplaceRecord" >查 询</el-button>
            <el-button
              class=" margin-left"
              size="small"
              type="danger"
              @click="clearSearch" > <svg-icon icon-class="clear"/> 重 置</el-button>
          </div>
        </div>
        <el-table
          :data="recordList"
          :key="tableKey"
          element-loading-text="拼命加载中"
          max-height="600"
          border
          fit>
          <el-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              {{ scope.$index+1 }}
            </template>
          </el-table-column>
          <el-table-column v-if="activeTabIndex === 3" label="气源位置" align="center" prop="gasLocation">
            <template slot-scope="scope">
              <span v-if="scope.row.gasLocation === 0">1组</span>
              <span v-if="scope.row.gasLocation === 1">2组</span>
            </template>
          </el-table-column>
          <el-table-column v-if="activeTabIndex === 2" label="冲装时间" align="center" prop="replaceTime" width="180"/>
          <el-table-column v-if="activeTabIndex !== 2" label="切换时间" align="center" prop="replaceTime" width="180"/>
          <el-table-column v-if="activeTabIndex !== 2" label="切换前批次" align="center" prop="oldBatch" show-overflow-tooltip/>
          <el-table-column v-if="activeTabIndex !== 2" label="切换后批次" align="center" prop="newBatch" show-overflow-tooltip/>
          <el-table-column label="H阀状态" align="center" prop="statusH">
            <template slot-scope="scope">
              <span v-if="scope.row.statusH === 0">开启</span>
              <span v-if="scope.row.statusH === 1">关闭</span>
            </template>
          </el-table-column>
          <el-table-column v-if="activeTabIndex !== 3" label="1号纯化器状态" align="center" prop="mandataryName">
            <template slot-scope="scope">
              <span v-if="scope.row.statusA === 0">开启</span>
              <span v-if="scope.row.statusA === 1">关闭</span>
            </template>
          </el-table-column>
          <el-table-column v-if="activeTabIndex !== 3" label="2号纯化器状态" align="center" prop="mandataryName">
            <template slot-scope="scope">
              <span v-if="scope.row.statusB === 0">开启</span>
              <span v-if="scope.row.statusB === 1">关闭</span>
            </template>
          </el-table-column>
          <el-table-column v-if="activeTabIndex !== 2" label="切换后位置" align="center" prop="location" width="120"/>
        </el-table>
        <el-pagination
          :current-page="pageNum"
          :page-sizes="[10, 25, 50]"
          :page-size="pageSize"
          :total="totalPage"
          class="pagination"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="sizeChange"
          @current-change="currentChange"
        />
      </el-dialog>
    </div>
  </PageHeaderLayout>
</template>

<script src="./gasReplace.js"></script>

<style scoped>
  .ges-replace-dialog>>>.el-dialog__body{
    padding-top: 0px;
    padding-bottom: 60px;
  }
  .input-item{
    float: left;
    margin-top: 14px;
    margin-right: 10px;
  }
  .search-input{
    width: 145px;
  }
  .sih4-vmb-box{
    width: 162px;
    height: 194px;
    position: absolute;
    bottom: 50%;
    left: 768px;
    transform: translateY(50%);
  }
  .sih4-start-bar{
    position: absolute;
    width: 45px;
    height: 274px;
    border: 11px solid #009494;
    border-left: none;
    right: -45px;
    top: 50%;
    transform: translateY(-50%);
  }
  .sih4-second-bar{
    position: absolute;
    width: 304px;
    height: 120px;
    border: 11px solid #009494;
    border-left: none;
    border-right: none;
    right: -338px;
    background: #fff;
    top: 50%;
    transform: translateY(-50%);
  }
  .deleteBtn{
    position: absolute;
    bottom: 5px;
    right: -30px;
    font-size: 20px;
    color: #d56c28;
    cursor: pointer;
  }
  .triangle{
    position: absolute;
    top: -5px;
    left: 30px;
    width: 0;
    height: 0;
    border: 9px solid;
    border-color: transparent;
    border-left-color: #009494;
  }
  .item{
    width: 150px;
    margin-left: 40px;
    height: 45px;
    position: relative;
  }
  .item-arrows{
    height: 8px;
    width: 30px;
    background: #009494;
    position: absolute;
    left: -41px;
    top: 25px;
  }
  .vertical{
    width: 8px;
    height: 45px;
    background: #009494;
    position: absolute;
    left: -41px;
    bottom: 18px;
  }
  .select-item-top-box{
    width: 240px;
    position: absolute;
    bottom: 13px;
    left: 193px;
    max-height: 314px;
    overflow-y: auto;
  }
  .select-item-bottom-box{
    width: 240px;
    position: absolute;
    top: 0px;
    left: 193px;
    max-height: 314px;
    overflow-y: auto;
  }
  .select-item-box>>>.el-select>.el-input{
    height: 31px;
  }
  .across-bar{
    position: absolute;
    bottom: 25px;
    right: -46px;
    width: 45px;
    height: 8px;
    background: #009494;
  }
  .vmb-box{
    position: absolute;
    width: 400px;
    height: 192px;
    top: 0;
    right: -490px;
    padding: 12px;
  }
  .vmb-box>>>.el-input.is-disabled .el-input__inner,.sih4-start-config>>> .el-input.is-disabled .el-input__inner{
    cursor: default;
    background: #fff;
    color: #494949;
  }
  .vmb-box>>>.el-input.is-disabled .el-input__icon,.sih4-start-config>>> .el-input.is-disabled .el-input__icon{
    display: none;
  }
  .h-switch{
    position: absolute;
    top: -80px;
    left: 12px;
  }
  .vmb-bar-h-close{
    width: 20px;
    height: 20px;
    font-size: 30px;
    position: absolute;
    bottom: 93px;
    left: 190px;
    z-index: 2;
  }
  .vmb-bar-h-close.h-open{
    left: 191px;
  }
  .h-bottom{
    width: 20px;
    height: 20px;
    position: absolute;
    bottom: 84px;
    left: 191px;
    background: #fff;
    z-index: 1;
  }
  .vmb-bar-top{
    width: 86px;
    height: 11px;
    position: absolute;
    background: #009494;
    top: 36px;
    left: 152px;
    z-index: -1;
  }
  .vmb-bar-bottom{
    width: 86px;
    height: 11px;
    position: absolute;
    background: #009494;
    bottom: 36px;
    left: 152px;
    z-index: -1;
  }
  .vmb-bar-vertical{
    width: 11px;
    height: 110px;
    position: absolute;
    background: #ccc;
    bottom: 36px;
    left: 195px;
    z-index: -5;
  }
  .sih4-h-vertical{
    width: 11px;
    height: 98px;
    position: absolute;
    background: #ccc;
    bottom: 178px;
    right: -305px;
    z-index: 1;
  }
  .sih4-bar-h-close{
    font-size: 30px;
    width: 20px;
    height: 50px;
    position: absolute;
    bottom: 18px;
    left: -5px;
    z-index: 2;
    background: transparent;
  }
  .sih4-h-bottom{
    width: 20px;
    height: 20px;
    position: absolute;
    bottom: 40px;
    left: -5px;
    background: #fff;
    z-index: 1;
  }
  .sih4-bar-h-close.h-open{
    left: -4px;
  }
  .sih4-h-vertical.h-is-open{
    background: #009494;
  }
  .vmb-bar-vertical.h-is-open{
    background: #009494;
  }
  .vmb-box-item{
    width: 150px;
    height: 60px;
    border: 1px solid #ccc;
    background: #e2e2e2;
    text-align: center;
    line-height: 57px;
  }
  .vmb-box-item.is-open{
    background: #009494;
    border-color: #009494;
  }
  .vmb1{
    position: absolute;
    top: 12px;
    right: 12px;
  }
  .vmb2{
    position: absolute;
    bottom: 12px;
    right: 12px;
  }
  .addBtn{
    position: absolute;
    top: -35px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 30px;
    color: #009494;
    cursor: pointer;
  }
  .chq1{
    position: absolute;
    top: 12px;
    left: 12px;
  }
  .chq-switch{
    position: absolute;
    top: -25px;
    left: 0px;
  }
  .chq2{
    position: absolute;
    bottom: 12px;
    left: 12px;
  }
  .start-bar{
    position: absolute;
    width: 45px;
    height: 8px;
    background: #009494;
    right: -45px;
    bottom: 50%;
    transform: translateY(50%);
  }
  .start-box{
    position: absolute;
    width: 45px;
    height: 120px;
    border: 8px solid #009494;
    right: -90px;
    bottom: 50%;
    transform: translateY(50%);
    border-right: none;
  }
  .top-triangle{
    position: absolute;
    top: -13px;
    left: 35px;
    width: 0;
    height: 0;
    border: 9px solid;
    border-color: transparent;
    border-left-color: #009494;
  }
  .bottom-triangle{
    position: absolute;
    bottom: -13px;
    left: 35px;
    width: 0;
    height: 0;
    border: 9px solid;
    border-color: transparent;
    border-left-color: #009494;
  }
  .batch-input-box{
    margin-top: 20px;
  }
  .batch-manage-title{
    font-weight: bold;
  }
  .batch-item{
    width: 100px;
    height: 70px;
    line-height: 70px;
    float: right;
    text-align: center;
    font-weight: bold;
    font-size: 18px;
    border: 1px solid #ccc;
    background: #e2e2e2;
  }
  .batch-item.active{
    background: #009494;
    color: #fff;
  }
  .gas-box{
    width: 100%;
    height: calc(100vh - 260px);
    overflow: auto;
  }
  .gas-config{
    width: 100%;
    height: calc(100vh - 280px);
    /*background: #8bcec7;*/
    /*margin-bottom: 1px;*/
    position: absolute;
  }
  .start-gas-config{
    width: 430px;
    height: 192px;
    border: 2px dashed #8bcec7;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    margin-left:13%;
  }
  .sih4-start-config{
    width: 430px;
    height: 454px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    margin-left:13%;
  }
  @media (max-width: 1632px) {
    .sih4-box .batch-item{
      height: 60px;
      line-height: 60px;
    }
    .sih4-box .batch-manage{
      height: 80px;
    }
    .sih4-box .sih4-start-gas{
      height: 168px;
    }
    .sih4-start-config{
      margin-left:0px;
      height: 443px;
    }
    .sih4-h-vertical{
      height: 98px;
      bottom: 173px;
    }
    .start-gas-config{
      margin-left:0px;
    }
    .across-bar{
      right: -15px;
      width: 14px;
    }
    .select-item-top-box, .select-item-bottom-box{
      left: 136px;
      width: 225px;
    }
    .vmb-box-item{
      width: 130px;
    }
    .vmb-bar-top,.vmb-bar-bottom{
      left: 142px;
    }
    .vmb-bar-vertical{
      left: 179px
    }
    .vmb1, .vmb2{
      right:42px
    }
    .vmb-bar-h-close,.h-bottom{
      left: 174px;
    }
    .vmb-bar-h-close.h-open{
      left: 175px;
    }
    .select-item-box{
      max-height: 170px;
    }
  }
  .sih4-start-gas{
    position: relative;
    width: 430px;
    height: 192px;
    border: 1px dashed #8bcec7;
  }
  .sih4-start-gas+.sih4-start-gas{
    margin-top: 70px;
  }
  .batch-manage{
    height: 95px;
    width: 100%;
    padding: 12px;
  }
  .config-title{
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    color: #009494;
  }
  .app-container{
    height: calc(100vh - 133px);
  }
  .btn-group{
    height: 45px;
  }
  .h-switch-status{
    font-size: 16px;
    font-weight: bold;
  }
  .h-switch-status .is-open{
    color: #009494;
  }
  .h-switch-status .is-close{
    color: #f56c6c;
  }
  .app-container>>> .el-input.is-disabled .el-input__inner{
    padding: 0 5px;
    padding-right: 0;
  }
  .el-col-11{
    padding-right: 0!important;
    padding-left: 0!important;
  }
  .el-col-1{
    padding-left: 4px!important;
    padding-right: 12px!important;
  }
</style>
