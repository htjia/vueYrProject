<template>
  <div :class="classObj" class="app-wrapper">
    <div class="layout-container">
      <div class="header-bar" style="background:#009494 url('../static/img/top_bg.png') no-repeat top right;">
        <img class="logo-img" src="../../../static/img/yr_logo.png" alt="logo-img">

        <div class="nav-box">
          <!-- <div :class="{active: activeIndex === 1}" class="nav-item" @click="navClick(1)">基础管理</div>
          <div :class="{active: activeIndex === 2}" class="nav-item" @click="navClick(2)">订单管理</div>
          <div :class="{active: activeIndex === 3}" class="nav-item" @click="navClick(3)">生产管理</div>
          <div :class="{active: activeIndex === 4}" class="nav-item" @click="navClick(4)">外延生产管理</div>
          <div :class="{active: activeIndex === 5}" class="nav-item" @click="navClick(5)">芯片生产管理</div>
          <div :class="{active: activeIndex === 6}" class="nav-item" @click="navClick(6)">质量管理</div>
          <div :class="{active: activeIndex === 7}" class="nav-item" @click="navClick(7)">仓库管理</div>
          <div :class="{active: activeIndex === 8}" class="nav-item" @click="navClick(8)">工艺管理</div>
          <div :class="{active: activeIndex === 9}" class="nav-item" @click="navClick(9)">系统管理</div> -->
          <div v-for="item in menuList" :key="item.index" :class="{active: activeIndex === item.index}" class="nav-item" @click="navClick(item.index)">
            {{ item.name }}
          </div>
        </div>
        <div class="header-info" >
          <span><svg-icon icon-class="user"/> 欢迎， {{ getToken }}</span>
          <span class="change-password" @click="changePassword"><span class="cut-line"/><i class="el-icon-edit"/> 修改密码</span>
          <span><span class="cut-line"/>
            <span style="position: relative;cursor: pointer;" @click="viewMsg">
              <svg-icon style="margin-left: 2px; font-size: 15px" icon-class="messages"/>
              <span v-if="msgNum > 0" class="message-num" v-text="msgNum"/>
            </span>
          </span>
          <a class="logout" target="_blank" href="../../../static/Excel/圆融精益制造数据分析平台使用手册.pdf"><span class="cut-line"/><svg-icon icon-class="help"/> 帮助</a>
          <span class="logout" @click="logout"><span class="cut-line"/><svg-icon icon-class="logout"/> 注销</span>
        </div>
      </div>
      <div style="height: calc(100vh - 65px);">
        <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
        <sidebar class="sidebar-container"/>
        <div class="main-container">
          <navbar @refresh = "refresh"/>
          <app-main ref="AppMain"/>
        </div>
      </div>
    </div>
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="changePasswordDialogVisible"
      :before-close="handleClose"
      title="修改密码"
      width="500px">
      <el-form ref="passwordForm" :model="passwordForm" :rules="passwordRules" status-icon label-width="80px" label-position="right">
        <el-form-item label="旧密码" prop="oldPwd">
          <el-input v-model="passwordForm.oldPwd" type="password"/>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input v-model="passwordForm.newPwd" type="password"/>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassWord">
          <el-input v-model="passwordForm.confirmPassWord" type="password"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitPawForm('passwordForm')">确 定</el-button>
        <el-button @click="resetForm('passwordForm')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="viewMsgDialogVisible"
      :before-close="handleClose"
      class="padding-dialog padding-dialog-body"
      title="消息"
      top="80px"
      width="1000px">
      <div class="tab-control">
        <span
          :class="{activeTab: activeTabIndex === 0}"
          @click="tabClick(0)"
        >未处理</span>
        <span
          :class="{activeTab: activeTabIndex === 1}"
          class="has-margin-left"
          @click="tabClick(1)"
        >已处理</span>
      </div>
      <el-table
        :data="list"
        max-height="500"
        element-loading-text="拼命加载中"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="消息名称" align="center" prop="title">
          <template slot-scope="scope">
            <div style="color: #009494;text-decoration: underline;cursor: pointer;" @click="jumpToDetail(scope.row)">{{ scope.row.title }}</div>
          </template>
        </el-table-column>
        <el-table-column label="类型" align="center" prop="type" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 0" style="font-weight: bold;">通知公告</span>
            <span v-if="scope.row.type === 1" style="font-weight: bold;color: #f56c6c">异常报警</span>
          </template>
        </el-table-column>
        <el-table-column label="发起时间" align="center" prop="createTime" width="150"/>
        <el-table-column label="发起人" align="center" prop="creatorName" width="100"/>
        <el-table-column label="状态" align="center" prop="isRead" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.isRead === 0" style="font-weight: bold;color: #f56c6c">未处理</span>
            <span v-if="scope.row.isRead === 1" style="font-weight: bold;color: #1abc9c">已处理</span>
          </template>
        </el-table-column>
        <el-table-column v-if="activeTabIndex === 0" label="操作" align="center" prop="status" width="100">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.isRead === 0"
              size="mini"
              type="primary"
              @click="readMessage(scope.row)"
            ><svg-icon icon-class="chulixx"/>处 理</el-button>
            <el-button
              v-if="scope.row.isRead === 1"
              style="cursor: default;"
              size="mini"
            ><svg-icon icon-class="mujianyan"/> 已 读</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="pageNum"
        :page-sizes="[15, 25, 50]"
        :page-size="pageSize"
        :total="totalPage"
        class="pagination"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
      <el-dialog
        v-drag
        :close-on-click-modal="false"
        :visible.sync="innerDialog"
        top="120px"
        class="padding-dialog"
        append-to-body
        title="消息详情"
        width="930px"
        @close="detailClose"
      >
        <el-form status-icon label-width="80px" label-position="right">
          <el-form-item label="消息名称:" size="mini">
            <div>{{ currentRow.title }}</div>
          </el-form-item>
          <el-form-item label="消息内容:" size="mini">
            <div>{{ currentRow.content }}</div>
          </el-form-item>
          <el-form-item label="附件:" size="mini">
            <div>
              <span
                v-for="item in fileArr"
                :key="item.id"
                style="color: #009494;text-decoration: underline;cursor: pointer;margin-right: 8px"
                @click="downLoadFile(item.id)">{{ item.name }}</span>
            </div>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import router from '../../router'
import store from '../../store'
import { getToken, getUserId } from '@/utils/auth'
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapGetters } from 'vuex'
import { updatePwd } from '@/api/user'
import { getRouters } from '@/api/background/menuManager'
import { messageList, messageRead, findNoReadNum, findByDataId } from '@/api/message'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  data() {
    const validateConfirmPassWord = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('请输入确认密码'))
      } else {
        if (value.length < 6) {
          callback(new Error('密码不能小于 6 位'))
        } else if (value.length > 20) {
          callback(new Error('密码不能大于 20 位'))
        } else if (value !== this.passwordForm.newPwd) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }
    }
    const validateOldPwd = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('请输入旧密码'))
      } else {
        if (this.passwordForm.newPwd === value) {
          callback(new Error('新旧密码不能相同'))
        } else {
          callback()
        }
      }
    }
    const validateNewPwd = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('请输入新密码'))
      } else {
        if (this.passwordForm.oldPwd === value) {
          callback(new Error('新旧密码不能相同'))
        } else {
          callback()
        }
      }
    }
    const obj = {
      baseManage: {
        index: 1,
        name: '基础管理',
        children: []
      },
      orderManage: {
        index: 2,
        name: '订单管理',
        children: [
          {
            router: 'custormization',
            name: '客制化管理',
            children: []
          },
          {
            router: 'orderManagement',
            name: '订单管理',
            children: []
          },
          {
            router: 'orderBasicInfo',
            name: '基础信息管理',
            children: []
          }
        ]
      },
      productionManage: {
        index: 3,
        name: '生产管理',
        children: [
          {
            router: 'pcChipCasting',
            name: '生产计划管理',
            children: [
              {
                router: 'monthlyPlan',
                name: '月度产能规划管理',
                children: []
              },
              {
                router: 'pcChipCasting',
                name: 'PC投片管理',
                children: []
              },
              {
                router: 'applicationForDeposit',
                name: '外延出库申请',
                children: []
              },
              {
                router: 'pcBasicManage',
                name: '基础信息设置',
                children: [
                  {
                    router: 'pickUpRule',
                    name: '挑片规则管理',
                    children: []
                  },
                  {
                    router: 'productModel',
                    name: '产品基础管理',
                    children: []
                  },
                  {
                    router: 'acceptanceCriteria',
                    name: '验证片接收标准',
                    children: []
                  },
                  {
                    router: 'pcBasicManage',
                    name: '基础信息设置',
                    children: []
                  }
                ]
              }
            ]
          },
          {
            router: 'scrapAudit',
            name: '报废片入库',
            children: []
          },
          {
            router: 'abnormalBillsc',
            name: '异常单',
            children: [
              {
                router: 'abnormalBillManagesc',
                name: '异常单管理',
                children: []
              },
              {
                router: 'addAbnormalBillsc',
                name: '新增异常单',
                children: []
              },
              {
                router: 'productionAbnormalhidesc',
                name: '处理产线异常',
                children: []
              }
            ]
          },
          {
            router: 'productManage',
            name: '生管报表',
            children: [
              {
                router: 'wyProductManage',
                name: '外延生管',
                children: [
                  {
                    router: 'dailyWarehousing',
                    name: '外延日入库分布',
                    children: []
                  },
                  {
                    router: 'portalfilm',
                    name: '验证片数据监控',
                    children: []
                  },
                  {
                    router: 'stockDivision',
                    name: '外延库存分布',
                    children: []
                  }
                ]
              },
              {
                router: 'chipProductManage',
                name: '芯片生管',
                children: [
                  {
                    router: 'frontProductionCycle',
                    name: '芯片生管',
                    children: []
                  }
                ]
              }
            ]
          }
        ]
      },
      wyproductionManage: {
        index: 4,
        name: '外延生产管理',
        children: [
          {
            router: 'wyMonthCapacityPlan',
            name: '月度产能规划接收',
            children: []
          },
          {
            router: 'stockManage',
            name: '原材料管理',
            children: [
              {
                router: 'substrate',
                name: '衬底数据管理',
                children: []
              },
              {
                router: 'mocvd',
                name: 'MOCVD大盘管理',
                children: []
              },
              {
                router: 'alni',
                name: '铝氮大盘管理',
                children: []
              },
              {
                router: 'gasReplace',
                name: '气体更换',
                children: []
              },
              {
                router: 'moSource',
                name: 'MO源更换管理',
                children: []
              }
            ]
          },
          // {
          //   router: 'smallBatchSampleReceive',
          //   name: '小批量试样管理',
          //   children: []
          // },
          {
            router: 'produceManage',
            name: '生产过程管理',
            children: [
              {
                router: 'alNiProduce',
                name: '铝氮生产管理',
                children: []
              },
              {
                router: 'movcdProduce',
                name: 'MOCVD生长管理',
                children: []
              },
              {
                router: 'roastProcess',
                name: '烘烤过程管理',
                children: []
              }
            ]
          },
          {
            router: 'inspectionManage',
            name: '检验过程管理',
            children: [
              {
                router: 'testToDo',
                name: '测试待办',
                children: []
              },
              {
                router: 'visualInspection',
                name: '目检检验',
                children: []
              },
              {
                router: 'visualConfirm',
                name: '外延目检确认',
                children: []
              }
            ]
          },
          {
            router: 'chipManage',
            name: '验证片投片管理',
            children: [
              {
                router: 'chipSelect',
                name: '验证片选片',
                children: []
              },
              {
                router: 'chipSend',
                name: '验证片送片',
                children: []
              },
              {
                router: 'chipSearch',
                name: '验证片查询',
                children: []
              }
            ]
          },
          {
            router: 'synthesizeJudgment',
            name: '综合判定管理',
            children: []
          },
          {
            router: 'processEvents',
            name: '工艺事件管理',
            children: []
          },
          {
            router: 'warehouseManage',
            name: '入库管理',
            children: []
          },
          {
            router: 'dataMaintain',
            name: '数据维护',
            children: []
          },
          {
            router: 'abnormalBillwy',
            name: '异常单',
            children: [
              {
                router: 'abnormalBillManagewy',
                name: '异常单管理',
                children: []
              },
              {
                router: 'addAbnormalBillwy',
                name: '新增异常单',
                children: []
              },
              {
                router: 'productionAbnormalhidewy',
                name: '处理产线异常',
                children: []
              }
            ]
          },
          {
            router: 'wyBasicInfoManage',
            name: '基础信息',
            children: [
              {
                router: 'substrateBasicInfo',
                name: '衬底投片设置',
                children: [
                  {
                    router: 'chipInfo',
                    name: '投片信息管理',
                    children: []
                  },
                  {
                    router: 'decideTo',
                    name: '判定指向设置',
                    children: []
                  },
                  {
                    router: 'mocvdInfo',
                    name: 'MOCVD机台设置',
                    children: []
                  }
                ]
              },
              {
                router: 'AlNiBasicInfo',
                name: '铝氮信息设置',
                children: [
                  {
                    router: 'AlNiCase',
                    name: '铝氮卡塞设置',
                    children: []
                  },
                  {
                    router: 'AlNiBarCode',
                    name: '铝氮条码设置',
                    children: []
                  },
                  {
                    router: 'AlNiEngine',
                    name: '铝氮机台设置',
                    children: []
                  },
                  {
                    router: 'AlNiCraft',
                    name: '铝氮工艺设置',
                    children: []
                  }
                ]
              },
              {
                router: 'substrateInfo',
                name: '衬底信息设置',
                children: []
              },
              {
                router: 'visualInspectionSetting',
                name: '目检基础设置',
                children: []
              },
              {
                router: 'alarmRules',
                name: '报警规则设置',
                children: []
              },
              {
                router: 'portalfilm',
                name: '验证片设置',
                children: [
                  {
                    router: 'acceptanceCriteria',
                    name: '验证片接收标准',
                    children: []
                  },
                  {
                    router: 'versionManage',
                    name: '验证版型设置',
                    children: []
                  }
                ]
              }
            ]
          },
          {
            router: 'wyReport',
            name: '外延报表',
            children: [
              {
                router: 'productionReport',
                name: '外延生产报表',
                children: []
              },
              {
                router: 'processReport',
                name: '外延工艺报表',
                children: []
              },
              {
                router: 'templateCreate',
                name: '模板创建',
                children: []
              },
              {
                router: 'templateShow',
                name: '工艺报表展示区',
                children: []
              },
              {
                router: 'substrateType',
                name: '衬底分类',
                children: []
              },
              {
                router: 'jdTimeStatistics',
                name: '稼动时间统计',
                children: []
              },
              {
                router: 'detailsStatistics',
                name: '各项明细统计表',
                children: []
              },
              {
                router: 'STDStatistics',
                name: 'STD>4统计',
                children: []
              },
              {
                router: 'extensionReport',
                name: '外延汇总表',
                children: []
              },
              {
                router: 'productSumReport',
                name: '外延产出汇总报表',
                children: []
              }
            ]
          }
        ]
      },
      xpproductionManage: {
        index: 5,
        name: '芯片生产管理',
        children: [
          {
            router: 'rawMaterialManage',
            name: '原材料管理',
            children: [
              {
                router: 'rawMaterial',
                name: '原材料更换管理',
                children: []
              },
              {
                router: 'smallBatchSampleReceiveXp',
                name: '小批量试样管理',
                children: []
              }
            ]
          },
          {
            router: 'chipProductionTask',
            name: '生产任务管理',
            children: [
              {
                router: 'pcTipOut',
                name: 'PC投片管理',
                children: []
              },
              {
                router: 'xpMonthCapacityPlan',
                name: '月度产能规划接收',
                children: []
              }
            ]
          },
          {
            router: 'progressTracking',
            name: '生产进度跟踪',
            children: []
          },
          {
            router: 'carftPorcess',
            name: '工艺流程管理',
            children: [
              {
                router: 'proceCard',
                name: '返工流程卡管理',
                children: []
              },
              {
                router: 'transitSiteConfig',
                name: '过站站点配置',
                children: []
              }
            ]
          },
          {
            router: 'frontSiteManage',
            name: '前段站点管理',
            children: [
              {
                router: 'cleanSite',
                name: '清洗站点管理',
                children: []
              },
              {
                router: 'corrosionSite',
                name: '腐蚀站点管理',
                children: []
              },
              {
                router: 'gluingSite',
                name: '打胶站点管理',
                children: []
              },
              {
                router: 'degummingSite',
                name: '去胶站点管理',
                children: []
              },
              {
                router: 'photoetchingSite',
                name: '光刻站点管理',
                children: []
              },
              {
                router: 'hardBakingSite',
                name: '硬烤站点管理',
                children: []
              },
              {
                router: 'glueCoating',
                name: '光刻胶涂布管理',
                children: []
              },
              {
                router: 'baseGlueCoating',
                name: '底胶涂布管理',
                children: []
              },
              {
                router: 'developSite',
                name: '显影站点管理',
                children: []
              },
              {
                router: 'pebSite',
                name: 'PEB站点管理',
                children: []
              },
              {
                router: 'evaporationSite',
                name: '蒸镀站点管理',
                children: []
              },
              {
                router: 'etchingSite',
                name: '蚀刻站点管理',
                children: []
              },
              {
                router: 'fuseSite',
                name: '熔合站点管理',
                children: []
              },
              {
                router: 'depositionSite',
                name: '沉积站点管理',
                children: []
              },
              {
                router: 'annealSite',
                name: '退火站点管理',
                children: []
              },
              {
                router: 'degummingMicroscopy',
                name: '去胶镜检站点管理',
                children: []
              },
              {
                router: 'photoetchingMicroscopy',
                name: '光刻镜检站点管理',
                children: []
              },
              {
                router: 'etchingMicroscopy',
                name: '腐蚀镜检站点管理',
                children: []
              },
              {
                router: 'beforLeaving',
                name: '出站镜检站点管理',
                children: []
              },
              {
                router: 'tensileTest',
                name: '拉力测试管理',
                children: []
              },
              {
                router: 'cowTestManage',
                name: 'COW测试管理',
                children: [
                  {
                    router: 'cowOverSite',
                    name: 'COW过站',
                    children: []
                  },
                  {
                    router: 'cowInfo',
                    name: 'COW数据查询',
                    children: []
                  }
                ]
              }
            ]
          },
          {
            router: 'rearSiteManage',
            name: '后段站点管理',
            children: [
              {
                router: 'grindManage',
                name: '研磨管理',
                children: [
                  {
                    router: 'grindOverSite',
                    name: '研磨过站',
                    children: []
                  },
                  {
                    router: 'siteProgress',
                    name: '站内进度查询',
                    children: []
                  }
                ]
              },
              {
                router: 'inciseManage',
                name: '切割管理',
                children: [
                  {
                    router: 'inciseOverSite',
                    name: '切割过站',
                    children: []
                  },
                  {
                    router: 'inciseTag',
                    name: '切割标签',
                    children: []
                  },
                  {
                    router: 'inciseContrast',
                    name: '切割点检管理',
                    children: []
                  }
                ]
              },
              {
                router: 'visualInspectionTest',
                name: '目检测试管理',
                children: [
                  {
                    router: 'visualInspectionInfo',
                    name: '目检过站',
                    children: []
                  }
                ]
              },
              {
                router: 'cotTest',
                name: 'COT测试',
                children: [
                  {
                    router: 'cotCrossingStation',
                    name: 'COT过站',
                    children: []
                  },
                  {
                    router: 'cotTestData',
                    name: 'COT数据查询',
                    children: []
                  }
                ]
              },
              {
                router: 'aoiVisualInspection',
                name: 'AOI目检',
                children: [
                  {
                    router: 'aoiVisualInspection',
                    name: 'AOI数据',
                    children: []
                  }
                ]
              },
              {
                router: 'sorting',
                name: '分选',
                children: [
                  {
                    router: 'retrospectiveDetermination',
                    name: '回测判定',
                    children: []
                  },
                  {
                    router: 'sortingScheduling',
                    name: '分选调度',
                    children: [
                      {
                        router: 'machineScheduling',
                        name: '机台调度',
                        children: []
                      },
                      {
                        router: 'sortingScheduling',
                        name: '分选调度',
                        children: []
                      },
                      {
                        router: 'sortingLimit',
                        name: '分选限制',
                        children: []
                      },
                      {
                        router: 'schedulingLog',
                        name: '调度记录',
                        children: []
                      }
                    ]
                  },
                  {
                    router: 'membraneRetainingCrossingStation',
                    name: '留膜过站',
                    children: []
                  },
                  {
                    router: 'lowerBinData',
                    name: '下Bin数据查询',
                    children: []
                  },
                  {
                    router: 'motherSliceData',
                    name: '母片数据查询',
                    children: []
                  },
                  {
                    router: 'lowerBinPrint',
                    name: '下Bin标签打印',
                    children: []
                  },
                  {
                    router: 'binDocuments',
                    name: 'Bin文档重复监测',
                    children: []
                  }
                ]
              },
              {
                router: 'cleanoutManage',
                name: '清洗管理',
                children: [
                  {
                    router: 'cleanedStation',
                    name: '下BIN清洗',
                    children: []
                  }
                ]
              }
            ]
          },
          {
            router: 'reportManage',
            name: '报表管理',
            children: [
              {
                router: 'spccontrol',
                name: 'SPC控制',
                children: [
                  {
                    router: 'itoeEvaporationSPC',
                    name: 'ITO蒸镀SPC',
                    children: []
                  },
                  {
                    router: 'electrodeEvaporationSPC',
                    name: '电极蒸镀SPC',
                    children: []
                  },
                  {
                    router: 'etchingSPC',
                    name: '蚀刻SPC',
                    children: []
                  },
                  {
                    router: 'depositionSPC',
                    name: '沉积SPC',
                    children: []
                  },
                  {
                    router: 'settingSPC',
                    name: 'SPC配置',
                    children: []
                  }
                ]
              }
            ]
          },
          {
            router: 'abnormalManage',
            name: '异常管理',
            children: [
              {
                router: 'productionAbnormal',
                name: '产线异常',
                children: []
              },
              {
                router: 'productionAbnormalhd',
                name: '后段异常处理',
                children: []
              },
              {
                router: 'addAbnormalBill',
                name: '新增异常单',
                children: []
              },
              {
                router: 'reworkManage',
                name: '返工管理',
                children: []
              },
              {
                router: 'scrapManages',
                name: '报废片管理',
                children: []
              },
              {
                router: 'abnormalBillManagexp',
                name: '异常单管理',
                children: []
              },
              {
                router: 'productionAbnormalhidexp',
                name: '处理产线异常',
                children: []
              }
            ]
          },
          {
            router: 'warehousingSendManage',
            name: '入库管理',
            children: [
              {
                router: 'warehousingSendManage',
                name: '入库送片',
                children: []
              },
              {
                router: 'warehousingLabelPrint',
                name: '标签打印',
                children: []
              },
              {
                router: 'warehousingLabelManage',
                name: '标签管理',
                children: []
              },
              {
                router: 'mappingPrint',
                name: 'mapping彩图打印',
                children: []
              },
              {
                router: 'mappingManage',
                name: 'mapping彩图管理',
                children: []
              }
            ]
          },
          {
            router: 'warehousingDataBase',
            name: '入库数据库',
            children: [
              {
                router: 'square',
                name: '方片库',
                children: []
              },
              {
                router: 'circle',
                name: '圆片库',
                children: []
              }
            ]
          },
          {
            router: 'chipBasicInfo',
            name: '基础信息',
            children: [
              {
                router: 'samplingStandard',
                name: '采样标准设置',
                children: [
                  {
                    router: 'cowSamplingStandard',
                    name: 'COW采样标准',
                    children: []
                  },
                  {
                    router: 'cotSamplingStandard',
                    name: 'COT采样标准',
                    children: []
                  },
                  {
                    router: 'aoiSamplingStandard',
                    name: 'AOI采样标准',
                    children: []
                  }
                ]
              },
              {
                router: 'cotAbnormalCriteria',
                name: 'COT中心异常标准',
                children: []
              },
              {
                router: 'cotGrainCoordinates',
                name: 'COT晶粒坐标设置',
                children: []
              },
              {
                router: 'binSurface',
                name: 'BIN表',
                children: [
                  {
                    router: 'circleSurface',
                    name: '圆片BIN',
                    children: []
                  },
                  {
                    router: 'squareSurface',
                    name: '方片BIN',
                    children: []
                  },
                  {
                    router: 'cotCoefficientCorrection',
                    name: 'COT系数校正',
                    children: []
                  }
                ]
              },
              {
                router: 'machineInfo',
                name: '机台信息',
                children: []
              },
              {
                router: 'grindInfo',
                name: '研磨盘信息',
                children: []
              },
              {
                router: 'exceptionManage',
                name: '异常分类信息',
                children: []
              },
              {
                router: 'grindProcessInfo',
                name: '研磨工艺信息',
                children: []
              },
              {
                router: 'customer',
                name: '客户管理',
                children: []
              },
              {
                router: 'electrodeManage',
                name: '电极材料信息',
                children: []
              },
              {
                router: 'codeManage',
                name: '代码管理',
                children: [
                  {
                    router: 'appearanceClassification',
                    name: '外观分类',
                    children: []
                  },
                  {
                    router: 'brightnessCode',
                    name: '亮度代码',
                    children: []
                  },
                  {
                    router: 'voltageCode',
                    name: '电压代码',
                    children: []
                  },
                  {
                    router: 'wavelengthCode',
                    name: '波长代码',
                    children: []
                  },
                  {
                    router: 'wavelengthFocus',
                    name: '波长集中度',
                    children: []
                  },
                  {
                    router: 'comprehensiveGradeCode',
                    name: '综合等级代码',
                    children: []
                  }
                ]
              },
              {
                router: 'labelManage',
                name: '标签管理',
                children: [
                  {
                    router: 'ygLabel',
                    name: '亿光标签',
                    children: []
                  },
                  {
                    router: 'jzwLabel',
                    name: '佳桌旺标签',
                    children: []
                  },
                  {
                    router: 'gcLabel',
                    name: '国宸标签',
                    children: []
                  },
                  {
                    router: 'rqlLabel',
                    name: '瑞奇朗标签',
                    children: []
                  }
                ]
              }
            ]
          }
        ]
      },
      qualityManage: {
        index: 6,
        name: '质量管理',
        children: [
          {
            router: 'extension',
            name: '外延品保',
            children: [
              {
                router: 'yzpAudit',
                name: '验证片单审核',
                children: []
              },
              {
                router: 'outStorageAudit',
                name: '外延出库审核',
                children: []
              },
              {
                router: 'audit',
                name: '外延入库单审核',
                children: []
              },
              {
                router: 'visualInspection',
                name: '外延目检修正',
                children: []
              },
              {
                router: 'visualAbnormal',
                name: '外延目检异常单查询',
                children: []
              },
              {
                router: 'visualDetailed',
                name: '外延目检明细查询',
                children: []
              },
              {
                router: 'appearanceSampling',
                name: '外延外观抽检',
                children: []
              }
            ]
          },
          {
            router: 'inputQualityControl',
            name: '来料质量控制',
            children: [
              {
                router: 'examinationMaterial',
                name: 'IQC来料检验管理',
                children: []
              },
              {
                router: 'smallBatchSample',
                name: '小批量试样管理',
                children: []
              },
              {
                router: 'firstSample',
                name: '初次试样管理',
                children: []
              },
              {
                router: 'supplier',
                name: '供应商管理',
                children: []
              },
              {
                router: 'basicInfo',
                name: 'IQC基础信息配置',
                children: []
              }
            ]
          },
          {
            router: 'fqcAndOqc',
            name: '芯片品保',
            children: [
              {
                router: 'chipInStorage',
                name: '芯片入库检验',
                children: []
              },
              {
                router: 'chipOutStorage',
                name: '芯片出库检验',
                children: []
              },
              {
                router: 'scrapAuditQC',
                name: '报废片审核',
                children: []
              },
              {
                router: 'chipInConfig',
                name: '芯片入库配置',
                children: [
                  {
                    router: 'packageDefectType',
                    name: '包装缺陷类型配置',
                    children: []
                  },
                  {
                    router: 'waferInStandard',
                    name: '圆片入库标准配置',
                    children: []
                  }
                ]
              },
              {
                router: 'proportion',
                name: '芯片检验比例配置',
                children: []
              }
            ]
          },
          {
            router: 'inputProQualityCtrl',
            name: '制程控制',
            children: [
              {
                router: 'craftParameter',
                name: '工艺参数检验',
                children: []
              },
              {
                router: 'consumePeriod',
                name: '耗材周期检验',
                children: []
              },

              {
                router: 'appearMirror',
                name: '外观镜检检验',
                children: []
              },
              {
                router: 'grindThickness',
                name: '减薄厚度检验',
                children: []
              },
              {
                router: 'otherType',
                name: '其他类型检验',
                children: []
              },
              {
                router: 'workEnvironment',
                name: '加工环境检验',
                children: []
              },
              {
                router: 'workEnvironmentlog',
                name: '加工环境检验数据日报',
                children: []
              },
              {
                router: 'sevenSCheck',
                name: '7S检验',
                children: []
              },
              {
                router: 'basicInfoManage',
                name: '基础信息管理',
                children: [
                  {
                    router: 'craftParameterStandard',
                    name: '工艺参数检验标准',
                    children: []
                  },
                  {
                    router: 'consumePeriodStandard',
                    name: '耗材周期检验标准',
                    children: []
                  },
                  {
                    router: 'appearMirrorStandard',
                    name: '外观镜检检验标准',
                    children: []
                  },
                  {
                    router: 'grindThicknessStandard',
                    name: '减薄厚度检验标准',
                    children: []
                  },
                  {
                    router: 'otherTypeStandard',
                    name: '其他类型检验标准',
                    children: []
                  },
                  {
                    router: 'sevenSStandardSetting',
                    name: '7S检验标准设置',
                    children: []
                  },
                  {
                    router: 'workEnvironmentSetting',
                    name: '加工环境设置',
                    children: []
                  },
                  {
                    router: 'classManage',
                    name: '班别配置管理',
                    children: []
                  }
                ]
              }
            ]
          },
          {
            router: 'scrapAudits',
            name: '报废片审核',
            children: [
              {
                router: 'scrapAuditQC',
                name: '报废片审核',
                children: []
              }
            ]
          },
          {
            router: 'abnormalBill',
            name: '异常单',
            children: [
              {
                router: 'abnormalBillManage',
                name: '异常单管理',
                children: []
              },
              {
                router: 'addAbnormalBill',
                name: '新增异常单',
                children: []
              },
              {
                router: 'productionAbnormalhide',
                name: '处理产线异常',
                children: []
              }
            ]
          },
          {
            router: 'qualityReport',
            name: '质量报表',
            children: [
              {
                router: 'fqcAndOqcReport',
                name: '外延品保报表',
                children: [
                  {
                    router: 'visualInspectionWrongSta',
                    name: '目检误判统计',
                    children: []
                  },
                  {
                    router: 'outGoingInspection',
                    name: '外延出入库检验',
                    children: []
                  },
                  {
                    router: 'svInspectionExceptions',
                    name: '目检异常统计',
                    children: []
                  },
                  {
                    router: 'bfInspectionExceptions',
                    name: '目检报废统计',
                    children: []
                  },
                  {
                    router: 'svInspectionExceptionsfx',
                    name: '目检报废异常分析',
                    children: []
                  }
                ]
              },
              {
                router: 'yzpAuditReport',
                name: '芯片品保报表',
                children: [
                  {
                    router: 'chipInConfig',
                    name: '芯片入库检验',
                    children: []
                  },
                  {
                    router: 'exceptionTotal',
                    name: '异常汇总统计',
                    children: []
                  },
                  {
                    router: 'subTotal',
                    name: '副品入库统计',
                    children: []
                  },
                  {
                    router: 'cowMonitor',
                    name: 'COW数据监控',
                    children: []
                  },
                  {
                    router: 'cotMonitor',
                    name: 'COT数据监控',
                    children: []
                  },
                  {
                    router: 'fqcMonitor',
                    name: 'FQC入库数据监控',
                    children: []
                  }
                ]
              }
            ]
          },
          {
            router: 'qualityBasic',
            name: '基础信息维护',
            children: [
              {
                router: 'baofeiType',
                name: '报废类型',
                children: []
              },
              {
                router: 'exceptionClass',
                name: '异常分类配置',
                children: []
              }
            ]
          }
        ]
      },
      warehouseManage: {
        index: 7,
        name: '仓库管理',
        children: [
          {
            router: 'extensionStorageManage',
            name: '外延仓管理',
            children: [
              {
                router: 'putInStorage',
                name: '入库管理',
                children: []
              },
              {
                router: 'outStorage',
                name: '出库管理',
                children: []
              },
              {
                router: 'backStorageManage',
                name: '退库管理',
                children: [
                  {
                    router: 'backStorage',
                    name: '退库',
                    children: []
                  },
                  {
                    router: 'productionBackStorage',
                    name: '生产退库',
                    children: []
                  }
                ]
              },
              {
                router: 'repertoryManage',
                name: '库存管理',
                children: [
                  {
                    router: 'boxLocationManage',
                    name: '盒位管理',
                    children: []
                  },
                  {
                    router: 'cabinetLocationManage',
                    name: '柜位管理',
                    children: []
                  }
                ]
              },
              {
                router: 'inventoryInquiry',
                name: '库存查询',
                children: []
              },
              {
                router: 'basicSetting',
                name: '基础设置',
                children: []
              }
            ]
          },
          {
            router: 'chipStoreManage',
            name: '芯片仓管理',
            children: [
              {
                router: 'chipPutInStorage',
                name: '入库管理',
                children: []
              },
              {
                router: 'retreatStorage',
                name: '退库管理',
                children: []
              },
              {
                router: 'chipOutStorage',
                name: '出库管理',
                children: []
              },
              {
                router: 'splitPackage',
                name: '分包管理',
                children: []
              },
              {
                router: 'reworkOrder',
                name: '返工单管理',
                children: []
              },
              {
                router: 'stockCheck',
                name: '库存查询',
                children: [
                  {
                    router: 'squareZp',
                    name: '方片库',
                    children: [
                      {
                        router: 'squareZp',
                        name: '方片正品库',
                        children: []
                      },
                      {
                        router: 'squareHh',
                        name: '方片混合Bin库',
                        children: []
                      }
                    ]
                  },
                  {
                    router: 'circleChip',
                    name: '圆片库',
                    children: []
                  }
                ]
              },
              {
                router: 'stockControl',
                name: '库存管理',
                children: []
              },
              {
                router: 'chipBasicSetting',
                name: '基础设置',
                children: []
              }
            ]
          }
        ]
      },
      processManagement: {
        index: 8,
        name: '工艺管理',
        children: [
          {
            router: 'siteManage',
            name: '站点管理',
            children: []
          },
          {
            router: 'proceManage',
            name: '工序管理',
            children: []
          },
          {
            router: 'proceCardManage',
            name: '流程卡管理',
            children: []
          },
          {
            router: 'rearProceCardManage',
            name: '后段流程卡管理',
            children: []
          },
          {
            router: 'colorModelsManage',
            name: '光色管理',
            children: []
          },
          {
            router: 'craftManage',
            name: '工艺分类管理',
            children: []
          },
          {
            router: 'programManage',
            name: '程序管理',
            children: []
          },
          {
            router: 'shopManage',
            name: '车间管理',
            children: []
          },
          {
            router: 'abnormalBillgy',
            name: '异常单',
            children: [
              {
                router: 'abnormalBillManagegy',
                name: '异常单管理',
                children: []
              },
              {
                router: 'addAbnormalBillgy',
                name: '新增异常单',
                children: []
              },
              {
                router: 'productionAbnormalhidegy',
                name: '处理产线异常',
                children: []
              }
            ]
          }
        ]
      },
      sysManage: {
        index: 9,
        name: '系统管理',
        children: [
          {
            router: 'backgroundManagement',
            name: '后台管理',
            children: [
              {
                router: 'roles',
                name: '角色管理',
                children: []
              },
              {
                router: 'user',
                name: '用户管理',
                children: []
              },
              {
                router: 'menuManager',
                name: '菜单管理',
                children: []
              },
              {
                router: 'deptManager',
                name: '部门管理',
                children: []
              },
              {
                router: 'function',
                name: '功能管理',
                children: []
              }
            ]
          },
          {
            router: 'noticeManage',
            name: '公告管理',
            children: []
          },
          {
            router: 'deviceDataSet',
            name: '设备数据采集配置',
            children: [
              {
                router: 'deviceSet',
                name: '设备驱动配置',
                children: []
              },
              {
                router: 'clientSet',
                name: '客户端配置',
                children: []
              },
              {
                router: 'labelManage',
                name: '打印标签管理',
                children: []
              }
            ]
          },
          {
            router: 'queryDesigner',
            name: '查询设计器',
            children: []
          }
        ]
      }
    }
    return {
      innerDialog: false,
      viewMsgDialogVisible: false,
      changePasswordDialogVisible: false,
      activeIndex: 8,
      activeTabIndex: 0,
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      msgNum: 0,
      list: [],
      fileArr: [],
      currentRow: {},
      passwordForm: {
        oldPwd: '',
        newPwd: '',
        confirmPassWord: ''
      },
      passwordRules: {
        oldPwd: [{ required: true, validator: validateOldPwd, trigger: 'blur' }],
        newPwd: [{ required: true, validator: validateNewPwd, trigger: 'blur' }],
        confirmPassWord: [{ required: true, validator: validateConfirmPassWord, trigger: 'blur' }]
      },
      menuList: [],
      menuObj: obj,
      menuIndexObj: {},
      allMenuObj: {}
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    ...mapGetters([
      'name',
      'roles'
    ]),
    getToken
  },
  mounted() {
    this.menuList = []
    this.menuIndexObj = {}
    this.allMenuObj = {}
    getRouters({ userId: getUserId() }).then(response => {
      const data = response.data
      sessionStorage.setItem('roleInfo', JSON.stringify(response.data))
      const keys = Object.keys(this.menuObj)
      if (data !== undefined && data !== null && data.length > 0) {
        for (const item of keys) {
          for (const menu of data) {
            if (menu.path === item) {
              let children = []
              if (this.allMenuObj[this.menuObj[item].index + ''] === undefined) {
                this.allMenuObj[this.menuObj[item].index + ''] = {}
              }
              if (menu.children.length > 0) {
                children = this.findChildren(menu.children, this.menuObj[item].children, this.menuObj[item].index)
              } else {
                this.allMenuObj[this.menuObj[item].index + ''][this.menuObj[item].name] = ''
              }
              this.menuList.push({
                index: this.menuObj[item].index,
                name: this.menuObj[item].name,
                children: children
              })
              this.menuIndexObj[this.menuObj[item].index + ''] = children
            }
          }
        }
        this.activeIndex = this.menuList[0].index
      } else {
        for (const item of keys) {
          this.menuIndexObj[this.menuObj[item].index + ''] = this.menuObj[item].children
          this.menuList.push(this.menuObj[item])
        }
        this.activeIndex = 8
      }
      console.log(this.menuIndexObj)
      const index = sessionStorage.getItem('yr-activeIndex')
      if (index !== null && index !== undefined) {
        this.activeIndex = parseInt(index)
      }
      this.navClick(this.activeIndex)
      this.firstFindNoReadNumFun()
      this.findNoReadNumFun()
    })
  },
  methods: {
    findChildren(list, menuList, index) {
      const children = []
      for (const item of list) {
        for (const menu of menuList) {
          if (menu.name === item.meta.title) {
            let ch = []
            this.allMenuObj[index + ''][menu.name] = ''
            if (item.children.length > 0) {
              ch = this.findChildren(item.children, menu.children, index)
            }
            children.push({
              name: menu.name,
              router: menu.router,
              children: ch
            })
            break
          }
        }
      }
      return children
    },
    detailClose() {
      const params = {
        userId: getUserId(),
        messageId: this.currentRow.id,
        sign: this.currentRow.type === 1
      }
      messageRead(params).then(res => {
        this.firstFindNoReadNumFun()
        this.messageListFind()
      })
    },
    downLoadFile(id) {
      window.open(process.env.BASE_API + `/attachment/down?id=${id}`)
    },
    jumpToDetail(row) {
      this.currentRow = row
      if (row.type === 0) { // 通知公告
        const params = {
          dataId: row.id
        }
        findByDataId(params).then(res => {
          console.log(res.data)
          this.fileArr = res.data
        })
        this.innerDialog = true
      } else { // 异常报警
      }
    },
    navClick(index) {
      let flag = true
      if (sessionStorage.getItem('be-route') !== null && sessionStorage.getItem('be-route') !== undefined) {
        const bRoute = sessionStorage.getItem('be-route').split(',')
        for (const item of bRoute) {
          const url = '/' + item + '/'
          const readyurl = window.location.hash.substring(1, item.length + 3)
          if (url === readyurl) {
            flag = false
            break
          }
        }
      }
      if (flag) {
        sessionStorage.setItem('be-activeIndex', this.activeIndex)
        sessionStorage.setItem('be-route', sessionStorage.getItem('yr-route'))
      }
      this.activeIndex = index
      sessionStorage.setItem('yr-activeIndex', this.activeIndex)
      var roles = []
      for (const item of this.menuIndexObj[index + '']) {
        roles.push(item.router)
      }
      sessionStorage.setItem('yr-route', roles)
      // switch (index) {
      //   case 8 : roles = ['siteManage', 'proceManage', 'proceCardManage', 'colorModelsManage', 'craftManage', 'programManage', 'shopManage']
      //     sessionStorage.setItem('yr-route', ['siteManage', 'proceManage', 'proceCardManage', 'colorModelsManage', 'craftManage', 'programManage', 'shopManage'])
      //     // setTimeout(() => {
      //     //   this.$router.push({ path: '/siteManage/index' })
      //     // }, 300)
      //     break
      //   case 4 : roles = ['stockManage', 'produceManage', 'inspectionManage', 'chipManage', 'synthesizeJudgment', 'extensionReport', 'processEvents', 'warehouseManage', 'dataMaintain', 'wyBasicInfoManage']
      //     sessionStorage.setItem('yr-route', ['stockManage', 'produceManage', 'inspectionManage', 'chipManage', 'synthesizeJudgment', 'extensionReport', 'processEvents', 'warehouseManage', 'dataMaintain', 'wyBasicInfoManage'])
      //     // setTimeout(() => {
      //     //   this.$router.push({ path: '/stockManage/substrate' })
      //     // }, 300)
      //     break
      //   case 5 : roles = ['chipProductionTask', 'progressTracking', 'carftPorcess', 'frontSiteManage', 'rearSiteManage', 'reportManage', 'abnormalManage', 'warehousingSendManage', 'chipBasicInfo']
      //     sessionStorage.setItem('yr-route', ['chipProductionTask', 'progressTracking', 'carftPorcess', 'frontSiteManage', 'rearSiteManage', 'reportManage', 'abnormalManage', 'warehousingSendManage', 'chipBasicInfo'])
      //     // setTimeout(() => {
      //     //   this.$router.push({ path: '/chipProductionTask/pcTipOut' })
      //     // }, 500)
      //     break
      //   case 6 : roles = ['extension']
      //     sessionStorage.setItem('yr-route', ['extension'])
      //     // setTimeout(() => {
      //     //   this.$router.push({ path: '/extension/yzpAudit' })
      //     // }, 500)
      //     break
      //   case 7 : roles = ['extensionStorageManage']
      //     sessionStorage.setItem('yr-route', ['extensionStorageManage'])
      //     // setTimeout(() => {
      //     //   this.$router.push({ path: '/extensionStorageManage/putInStorage' })
      //     // }, 300)
      //     break
      //   case 9 : roles = ['queryDesigner', 'deviceDataSet', 'backgroundManagement', 'noticeManage']
      //     sessionStorage.setItem('yr-route', ['queryDesigner', 'backgroundManagement', 'deviceDataSet', 'noticeManage'])
      //     // setTimeout(() => {
      //     //   this.$router.push({ path: '/queryDesigner/index' })
      //     // }, 300)
      //     break
      //   case 3 : roles = ['pcChipCasting']
      //     sessionStorage.setItem('yr-route', ['pcChipCasting'])
      //     // setTimeout(() => {
      //     //   this.$router.push({ path: '/pcChipCasting/pcChipCasting' })
      //     // }, 500)
      //     break
      // }
      this.generateRoutes(roles)
    },
    tabClick(index) {
      this.pageNum = 1
      this.pageSize = 15
      this.activeTabIndex = index
      this.messageListFind()
    },
    readMessage(row) {
      this.$confirm('确认将此消息设为已读？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          userId: getUserId(),
          messageId: row.id,
          sign: row.type === 1
        }
        console.log(params)
        messageRead(params).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.firstFindNoReadNumFun()
          this.messageListFind()
        })
      })
    },
    findNoReadNumFun() {
      const params = {
        userId: getUserId()
      }
      setInterval(() => {
        findNoReadNum(params).then(res => {
          this.msgNum = res.data
        })
      }, 60000)
    },
    firstFindNoReadNumFun() {
      const params = {
        userId: getUserId()
      }
      findNoReadNum(params).then(res => {
        this.msgNum = res.data
      })
    },
    viewMsg() {
      this.messageListFind()
      this.viewMsgDialogVisible = true
    },
    generateRoutes(roles) {
      var _this = this
      store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
        const item = store.getters.addRouters
        for (const route of item) {
          // let flag = false
          for (let i = 0; i < route.children.length; i++) {
            const child = route.children[i]
            if (_this.allMenuObj[_this.activeIndex] !== undefined && _this.allMenuObj[_this.activeIndex][child.meta.title] !== '') {
              route.children.splice(i, 1)
              i--
            }
          }
        }
        router.addRoutes(item) // 动态添加可访问路由表
      })
    },
    handleClickOutside() {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
    },
    changePassword() {
      this.changePasswordDialogVisible = true
      this.passwordForm.oldPwd = ''
      this.passwordForm.newPwd = ''
      this.passwordForm.confirmPassWord = ''
    },
    // 关闭
    handleClose(done) {
      done()
    },
    // 每页数量改变
    sizeChange(pageSize) {
      this.pageSize = pageSize
      this.messageListFind()
    },
    // 当前页数改变
    currentChange(pageNum) {
      this.pageNum = pageNum
      this.messageListFind()
    },
    messageListFind() {
      const params = {
        userId: getUserId(),
        isRead: this.activeTabIndex === 0 ? 0 : 1,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }
      messageList(params).then(res => {
        if (res.code === 0) {
          this.totalPage = parseInt(res.data.total)
          this.list = res.data.list
        }
      })
    },
    // 修改密码确认
    submitPawForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            oldPassword: this.passwordForm.oldPwd,
            newPassword: this.passwordForm.newPwd,
            userId: getUserId()
          }
          updatePwd(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.changePasswordDialogVisible = false
              this.fetchData()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 取消
    resetForm(formName) {
      this.changePasswordDialogVisible = false
      this.$refs[formName].resetFields()
    },
    logout() {
      this.$confirm('确认注销并返回登录页面？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      }).catch(() => {
      })
    },
    refresh() {
      this.$refs.AppMain.fetchData()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
    .layout-container{
      height: 100%;
      .header-bar{
        width: 100%;
        height: 65px;
        background: #009494;
        .logo-img{
          display: inline-block;
          width: 210px;
          height: 65px;
          margin: 0 12.5px;
          float: left;
        }
        .header-info{
          line-height: 65px;
          margin-right: 20px;
          float: right;
          color:#fff;
          .cut-line{
            display: inline-block;
            height: 12px;
            border-left: 1px solid #fff;
            margin: 0 10px;
          }
          .logout, .change-password{
            cursor: pointer;
          }
        }
      }
    }
  }
  .message-num{
    background: #e25d5d;
    border-radius: 30px;
    color: #fff;
    display: inline-block;
    font-size: xx-small;
    height: 15px;
    line-height: 15px;
    min-width: 15px;
    padding: 0 4px;
    position: absolute;
    right: -8px;
    text-align: center;
    top: -10px;

  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
  .nav-box{
    float: left;
    height: 40px;
    margin-top: 25px;
  }
  .nav-box .nav-item{
    float: left;
    line-height: 36px;
    padding: 0 22px;
    cursor: pointer;
    font-weight: bold;
    color: #fff;
    font-size: 15px;
  }
  .nav-box .nav-item.active{
    background: #fff;
    color: #353c49!important;
    height: 45px;
  }
  .nav-box .nav-item:hover{
    color: #b3d8e4;
  }
  @media (max-width: 1600px) {
    .nav-box .nav-item{
      padding: 0 13px;
    }
  }
  @media (max-width: 1440px) {
    .nav-box .nav-item{
      padding: 0 8px;
    }
  }
</style>
<style scoped>
  .padding-dialog-body>>> .el-dialog__body{
    padding-bottom: 60px !important;
  }
</style>
