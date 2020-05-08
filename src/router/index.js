import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'
// 若你想不管路由下面的 children 声明的个数都显示你的根路由
// 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由

/**
 * hidden: true                   当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面
 * alwaysShow: true               //当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 //只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 //若你想不管路由下面的 children 声明的个数都显示你的根路由
 //你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noredirect           当设置 noredirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    title: 'title'               设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             设置该路由的图标
    noCache: true                如果设置为true ,则不会被 <keep-alive> 缓存(默认 false)
    roles: ['admin', 'editor']   设置该路由进入的权限，支持多个权限叠加
}
 }
 **/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'home' }
    }]
  },
  {
    path: '/addProceCardManage',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'AddProceCardManage',
        component: () => import('@/views/processManagement/proceCardManage/addProceCardManage/index'),
        meta: { title: '流程卡管理' }
      }
    ]
  }
]
export const asyncRouterMap = [
  { path: '*', redirect: '/404', hidden: true },
  {
    path: '/backgroundManagement',
    name: 'BackgroundManagement',
    component: Layout,
    redirect: '/backgroundManagement/roles',
    alwaysShow: true,
    meta: { title: '后台管理', icon: 'peizhigl' },
    children: [
      {
        path: 'roles',
        name: 'Roles',
        component: () => import('@/views/roles/index'),
        meta: { title: '角色管理', icon: 'jiaose' }
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/user/index'),
        meta: { title: '用户管理', icon: 'userm' }
      },
      {
        path: 'menuManager',
        name: 'MenuManager',
        component: () => import('@/views/menuManager/index'),
        meta: { title: '菜单管理', icon: 'menu' }
      },
      {
        path: 'deptManager',
        name: 'DeptManager',
        component: () => import('@/views/deptManager/index'),
        meta: { title: '部门管理', icon: 'bumengl' }
      },
      {
        path: 'function',
        name: 'Function',
        component: () => import('@/views/function/index'),
        meta: { title: '功能管理', icon: 'gongnenggl' }
      }
    ]
  },
  {
    path: '/noticeManage',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'NoticeManage',
        component: () => import('@/views/noticeManage/index'),
        meta: { title: '公告管理', icon: 'gongggl' }
      }
    ]
  },
  // 圆融项目路由
  // 工艺管理 start
  {
    path: '/siteManage',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'SiteManage',
        component: () => import('@/views/processManagement/siteManage/index'),
        meta: { title: '站点管理', icon: 'site' }
      }
    ]
  },
  {
    path: '/proceManage',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'roceManage',
        component: () => import('@/views/processManagement/proceManage/index'),
        meta: { title: '工序管理', icon: 'gongxugl' }
      }
    ]
  },
  {
    path: '/proceCardManage',
    component: Layout,
    children: [
      {
        path: 'index:id',
        name: 'ProceCardManage',
        component: () => import('@/views/processManagement/proceCardManage/index'),
        meta: { title: '流程卡管理', icon: 'flowCard' }
      }
    ]
  },
  {
    path: '/rearProceCardManage',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'ProceCardManage',
        component: () => import('@/views/processManagement/rearProceCardManage/index'),
        meta: { title: '后段流程卡管理', icon: 'houdlckgl' }
      }
    ]
  },
  {
    path: '/colorModelsManage',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'ColorModelsManage',
        component: () => import('@/views/processManagement/colorModelsManage/index'),
        meta: { title: '光色管理', icon: 'guangsexhgl' }
      }
    ]
  },
  {
    path: '/modelsManage',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'ModelsManage',
        component: () => import('@/views/processManagement/modelsManage/index'),
        meta: { title: '型号管理', icon: 'guangsexhgl' }
      }
    ]
  },
  {
    path: '/craftManage',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'CraftManage',
        component: () => import('@/views/processManagement/craftManage/index'),
        meta: { title: '工艺分类管理', icon: 'gongyifenli' }
      }
    ]
  },
  {
    path: '/programManage',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'ProgramManage',
        component: () => import('@/views/processManagement/programManage/index'),
        meta: { title: '程序管理', icon: 'chengxgl' }
      }
    ]
  },
  {
    path: '/shopManage',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'ShopManage',
        component: () => import('@/views/processManagement/shopManage/index'),
        meta: { title: '车间管理', icon: 'chejiangl' }
      }
    ]
  },
  // 工艺管理 end
  {
    path: '/deviceDataSet',
    name: 'DeviceDataSet',
    component: Layout,
    alwaysShow: true,
    redirect: '/commonSet/collectParam',
    meta: { title: '设备数据采集配置', icon: 'shebei' },
    children: [
      // {
      //   path: '/commonSet',
      //   name: 'CommonSet',
      //   alwaysShow: true,
      //   redirect: '/commonSet/collectParam',
      //   component: () => import('@/views/extensionManage/wyBasicInfoManage/index'),
      //   meta: { title: '通用配置', icon: 'config-ty' },
      //   children: [
      //     {
      //       path: 'collectParam',
      //       name: 'CollectParam',
      //       component: () => import('@/views/deviceCollectSet/commonSet/collectParam/index'),
      //       meta: { title: '采集参数配置', icon: 'config-cs' }
      //     },
      //     {
      //       path: 'deviceSet',
      //       name: 'DeviceSet',
      //       component: () => import('@/views/deviceCollectSet/commonSet/deviceSet/index'),
      //       meta: { title: '设备驱动配置', icon: 'config-sb' }
      //     },
      //     {
      //       path: 'dataDestination',
      //       name: 'DataDestination',
      //       component: () => import('@/views/deviceCollectSet/commonSet/dataDestination/index'),
      //       meta: { title: '数据去向配置', icon: 'config-fx' }
      //     }
      //   ]
      // },
      {
        path: 'deviceSet',
        name: 'DeviceSet',
        component: () => import('@/views/deviceCollectSet/commonSet/deviceSet/index'),
        meta: { title: '设备驱动配置', icon: 'shebeiqdgl' }
      },
      {
        path: 'clientSet',
        name: 'ClientSet',
        // hidden: true,
        component: () => import('@/views/deviceCollectSet/clientSet/clientSet/index'),
        meta: { title: '客户端配置', icon: 'kehudpz' }
      },
      {
        path: 'labelManage',
        name: 'LabelManage',
        component: () => import('@/views/deviceCollectSet/commonSet/labelManage/index'),
        meta: { title: '打印标签管理', icon: 'biaoqiandy' }
      }
    ]
  },
  { // 原材料管理
    path: '/stockManage',
    name: 'StockManage',
    component: Layout,
    redirect: '/stockManage/substrate',
    alwaysShow: true,
    meta: { title: '原材料管理', icon: 'yuancailiaogl' },
    children: [
      {
        path: 'substrate',
        name: 'Substrate',
        component: () => import('@/views/extensionManage/stockManage/substrate/index'),
        meta: { title: '衬底数据管理', icon: 'chendishuju' }
      },
      {
        path: 'mocvd',
        name: 'Mocvd',
        component: () => import('@/views/extensionManage/stockManage/movcd/index'),
        meta: { title: 'MOCVD大盘管理', icon: 'MOVCDdapan' }
      },
      {
        path: 'alni',
        name: 'Alni',
        component: () => import('@/views/extensionManage/stockManage/alni/index'),
        meta: { title: '铝氮大盘管理', icon: 'lvdandapan' }
      },
      {
        path: 'gasReplace',
        name: 'GasReplace',
        component: () => import('@/views/extensionManage/stockManage/gasReplace/index'),
        meta: { title: '气体更换', icon: 'qitigenghuan' }
      },
      {
        path: 'moSource',
        name: 'MoSource',
        component: () => import('@/views/extensionManage/stockManage/moSource/index'),
        meta: { title: 'MO源更换管理', icon: 'moyuangl' }
      }
    ]
  },
  // 外延生产管理 start
  {
    path: '/wyMonthCapacityPlan',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'wyMonthCapacityPlan',
        component: () => import('@/views/extensionManage/wyMonthCapacityPlan/index'),
        meta: { title: '月度产能规划接收', icon: 'ceshidaiban' }
      }
    ]
  },
  {
    path: '/smallBatchSampleReceive',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'smallBatchSampleReceive',
        component: () => import('@/views/iqc/smallBatchSampleReceive/index'),
        meta: { title: '小批量试样管理', icon: 'liezhank' }
      }
    ]
  },
  { // 生产过程管理
    path: '/produceManage',
    name: 'ProduceManage',
    component: Layout,
    redirect: '/produceManage/aiNiProduce',
    alwaysShow: true,
    meta: { title: '生产过程管理', icon: 'shengchangl' },
    children: [
      {
        path: 'alNiProduce',
        name: 'AlNiProduce',
        component: () => import('@/views/extensionManage/produceManage/alNiProduce/index'),
        meta: { title: '铝氮生产管理', icon: 'ldscgl' }
      },
      {
        path: 'movcdProduce',
        name: 'MovcdProduce',
        component: () => import('@/views/extensionManage/produceManage/movcdProduce/index'),
        meta: { title: 'MOCVD生长管理', icon: 'MOVCDszgl' }
      },
      {
        path: 'roastProcess',
        name: 'RoastProcess',
        component: () => import('@/views/extensionManage/produceManage/roastProcess/index'),
        meta: { title: '烘烤过程管理', icon: 'hongkaogcgl' }
      }
    ]
  },
  { // 检验过程管理
    path: '/inspectionManage',
    name: 'InspectionManage',
    component: Layout,
    redirect: '/inspectionManage/substrate',
    alwaysShow: true,
    meta: { title: '检验过程管理', icon: 'jianyangcgl' },
    children: [
      {
        path: 'testToDo',
        name: 'TestToDo',
        component: () => import('@/views/extensionManage/inspectionManage/testToDo/index'),
        meta: { title: '测试待办', icon: 'ceshidaiban' }
      },
      // {
      //   path: 'plInspection',
      //   name: 'plInspection',
      //   component: () => import('@/views/extensionManage/inspectionManage/plInspection/index'),
      //   meta: { title: 'PL检验', icon: 'userm' }
      // },
      // {
      //   path: 'elInspection',
      //   name: 'ElInspection',
      //   component: () => import('@/views/extensionManage/inspectionManage/elInspection/index'),
      //   meta: { title: 'EL检验', icon: 'userm' }
      // },
      // {
      //   path: 'xrdInspection',
      //   name: 'XrdInspection',
      //   component: () => import('@/views/extensionManage/inspectionManage/xrdInspection/index'),
      //   meta: { title: 'XRD检验', icon: 'userm' }
      // },
      {
        path: 'visualInspection',
        name: 'VisualInspection',
        component: () => import('@/views/extensionManage/inspectionManage/visualInspection/index'),
        meta: { title: '目检检验', icon: 'mujianyan' }
      },
      {
        path: 'visualConfirm',
        name: 'visualConfirm',
        component: () => import('@/views/extensionManage/warehousingAudit/visualConfirm/index'),
        meta: { title: '外延目检确认', icon: 'chulixx' }
      }
      // {
      //   path: 'xrdInspectionAbnormal',
      //   name: 'XrdInspectionAbnormal',
      //   component: () => import('@/views/extensionManage/inspectionManage/xrdInspectionAbnormal/index'),
      //   meta: { title: '目检异常单确认', icon: 'userm' }
      // }
    ]
  },
  { // 检验片投片管理
    path: '/chipManage',
    name: 'ChipManage',
    component: Layout,
    redirect: '/chipManage/chipSelect',
    alwaysShow: true,
    meta: { title: '验证片投片管理', icon: 'yanzhengpiangl' },
    children: [
      {
        path: 'chipSelect',
        name: 'ChipSelect',
        component: () => import('@/views/extensionManage/chipManage/chipSelect/index'),
        meta: { title: '验证片选片', icon: 'yanzhenpianxp' }
      },
      {
        path: 'chipSend',
        name: 'ChipSend',
        component: () => import('@/views/extensionManage/chipManage/chipSend/index'),
        meta: { title: '验证片送片', icon: 'yanzhengpiansp' }
      },
      {
        path: 'chipSearch',
        name: 'ChipSearch',
        component: () => import('@/views/extensionManage/chipManage/chipSearch/index'),
        meta: { title: '验证片查询', icon: 'yanzhengpiancx' }
      }
    ]
  },
  { // 综合判定
    path: '/synthesizeJudgment',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'SynthesizeJudgment',
        component: () => import('@/views/extensionManage/synthesizeJudgment/index'),
        meta: { title: '综合判定管理', icon: 'peizhigl' }
      }
    ]
  },
  { // 工艺事件管理
    path: '/processEvents',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'ProcessEvents',
        component: () => import('@/views/extensionManage/processEvents/index'),
        meta: { title: '工艺事件管理', icon: 'gongyishijian' }
      }
    ]
  },
  { // 入库管理
    path: '/warehouseManage',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'WarehouseManage',
        component: () => import('@/views/extensionManage/warehouseManage/index'),
        meta: { title: '入库管理', icon: 'ruku' }
      }
    ]
  },
  { // 数据维护
    path: '/dataMaintain',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'DataMaintain',
        component: () => import('@/views/extensionManage/dataMaintain/index'),
        meta: { title: '数据维护', icon: 'shujuwh' }
      }
    ]
  },
  // { // 异常单管理
  //   path: '/abnormalManage',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'AbnormalManage',
  //       component: () => import('@/views/extensionManage/abnormalManage/index'),
  //       meta: { title: '异常单管理', icon: 'flowCard' }
  //     }
  //   ]
  // },
  {
    path: '/queryDesigner',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'QueryDesigner',
        component: () => import('@/views/queryDesigner/index'),
        meta: { title: '查询设计器', icon: 'chaxunsjq' }
      }
    ]
  },
  // IQC
  {
    path: '/inputQualityControl',
    name: 'InputQualityControl',
    component: Layout,
    redirect: '/inputQualityControl/basicInfoConfig',
    alwaysShow: true,
    meta: { title: '来料质量控制', icon: 'iqc' },
    children: [
      {
        path: 'examinationMaterial',
        name: 'examinationMaterial',
        component: () => import('@/views/iqc/examinationMaterial/index'),
        meta: { title: 'IQC来料检验管理', icon: 'lailjygl' }
      },
      {
        path: 'smallBatchSample',
        name: 'SmallBatchSample',
        component: () => import('@/views/iqc/smallBatchSampleManage/index'),
        meta: { title: '小批量试样管理', icon: 'liezhank' }
      },
      // {
      //   path: 'smallBatchSampleReceive',
      //   name: 'smallBatchSampleReceive',
      //   component: () => import('@/views/iqc/smallBatchSampleReceive/index'),
      //   meta: { title: '小批量试样管理', icon: 'liezhank' }
      // },
      {

        path: 'firstSample',
        name: 'FirstSample',
        component: () => import('@/views/iqc/firstSampleManage/index'),
        meta: { title: '初次试样管理', icon: 'chucisygl' }
      },
      {
        path: 'supplier',
        name: 'Supplier',
        component: () => import('@/views/iqc/supplierManage/index'),
        meta: { title: '供应商管理', icon: 'gongysgl' }
      },
      {
        path: 'basicInfo',
        name: 'BasicInfo',
        component: () => import('@/views/iqc/basicInfoConfig/index'),
        meta: { title: 'IQC基础信息配置', icon: 'xinxisz' }
      }
    ]
  },
  { // 外延质量管理
    path: '/extension',
    name: 'Extension',
    component: Layout,
    redirect: '/extension/yzpAudit',
    alwaysShow: true,
    meta: { title: '外延品保', icon: 'zhilianggl' },
    children: [
      {
        path: 'yzpAudit',
        name: 'yzpAudit',
        component: () => import('@/views/extensionManage/warehousingAudit/yzpAudit/index'),
        meta: { title: '验证片单审核', icon: 'yanzhengpdsh' }
      },
      {
        path: 'outStorageAudit',
        name: 'OutStorageAudit',
        component: () => import('@/views/extensionStorageManage/outStorageAudit/index'),
        meta: { title: '外延出库审核', icon: 'chukushenhe' }
      },
      {
        path: 'audit',
        name: 'audit',
        component: () => import('@/views/extensionManage/warehousingAudit/audit/index'),
        meta: { title: '外延入库单审核', icon: 'rukedansh' }
      },
      {
        path: 'visualInspection',
        name: 'visualInspection',
        component: () => import('@/views/extensionManage/warehousingAudit/visualInspection/index'),
        meta: { title: '外延目检修正', icon: 'mujianyan' }
      },
      {
        path: 'visualAbnormal',
        name: 'visualAbnormal',
        component: () => import('@/views/extensionManage/warehousingAudit/visualAbnormal/index'),
        meta: { title: '外延目检异常单查询', icon: 'jyyc' }
      },
      {
        path: 'visualDetailed',
        name: 'visualDetailed',
        component: () => import('@/views/extensionManage/warehousingAudit/visualDetailed/index'),
        meta: { title: '外延目检明细查询', icon: 'chaxun' }
      },
      {
        path: 'appearanceSampling',
        name: 'appearanceSampling',
        component: () => import('@/views/extensionManage/warehousingAudit/appearanceSampling/index'),
        meta: { title: '外延外观抽检', icon: 'waiguancj' }
      }
    ]
  },
  // FQC+OQC
  {
    path: '/fqcAndOqc',
    name: 'FqcAndOqc',
    component: Layout,
    redirect: '/fqcAndOqc/inChip',
    alwaysShow: true,
    meta: { title: '芯片品保', icon: 'zhilianggk' },
    children: [
      {
        path: 'chipInStorage',
        name: 'ChipInStorage',
        component: () => import('@/views/fqcAndOqc/chipInCheck/index'),
        meta: { title: '芯片入库检验', icon: 'ruku' }
      },
      {
        path: 'chipOutStorage',
        name: 'ChipOutStorage',
        component: () => import('@/views/fqcAndOqc/chipOutCheck/index'),
        meta: { title: '芯片出库检验', icon: 'chukushenhe' }
      },
      {
        path: 'scrapAuditQC',
        name: 'ScrapAuditQC',
        component: () => import('@/views/scrapAudit/scrapAuditQC/index'),
        meta: { title: '报废片审核', icon: 'chukushenhe' }
      },
      {
        path: 'chipInConfig',
        name: 'ChipInConfig',
        component: () => import('@/views/fqcAndOqc/chipInConfig/index'),
        meta: { title: '芯片入库配置', icon: 'chuku' },
        redirect: '/chipInConfig/packageDefectType',
        children: [
          {
            path: 'packageDefectType',
            name: 'PackageDefectType',
            component: () => import('@/views/fqcAndOqc/chipInConfig/packageDefectType/index'),
            meta: { title: '包装缺陷类型配置', icon: 'baozhuangqx' }
          },
          {
            path: 'waferInStandard',
            name: 'WaferInStandard',
            component: () => import('@/views/fqcAndOqc/chipInConfig/waferInStandard/index'),
            meta: { title: '圆片入库标准配置', icon: 'tupianruk' }
          }
        ]
      },
      {
        path: 'proportion',
        name: 'Proportion',
        component: () => import('@/views/fqcAndOqc/proportion/index'),
        meta: { title: '芯片检验比例配置', icon: 'chukushenhe' }
      }
    ]
  },
  // 制程控制
  {
    path: '/inputProQualityCtrl',
    name: 'InputProQualityCtrl',
    component: Layout,
    redirect: '/inputProQualityCtrl/craftParameter',
    alwaysShow: true,
    meta: { title: '制程控制', icon: 'ipqc' },
    children: [
      {
        path: 'craftParameter',
        name: 'CraftParameter',
        component: () => import('@/views/ipqc/craftParamCheck/index'),
        meta: { title: '工艺参数检验', icon: 'gongyishijian' }
      },
      {
        path: 'consumePeriod',
        name: 'ConsumePeriod',
        component: () => import('@/views/ipqc/consumePeriodCheck/index'),
        meta: { title: '耗材周期检验', icon: 'haocaizq' }
      },
      {
        path: 'appearMirror',
        name: 'AppearMirror',
        component: () => import('@/views/ipqc/appearMirrorCheck/index'),
        meta: { title: '外观镜检检验', icon: 'chaxunsjq' }
      },
      {
        path: 'grindThickness',
        name: 'GrindThickness',
        component: () => import('@/views/ipqc/grindThicknessCheck/index'),
        meta: { title: '减薄厚度检验', icon: 'yanmo' }
      },
      {
        path: 'otherType',
        name: 'OtherType',
        component: () => import('@/views/ipqc/otherTypeCheck/index'),
        meta: { title: '其他类型检验', icon: 'mujianyan' }
      },
      {
        path: 'workEnvironment',
        name: 'WorkEnvironment',
        component: () => import('@/views/ipqc/workEnvironmentCheck/index'),
        meta: { title: '加工环境检验', icon: 'gongxugl' }
      },
      {
        path: 'workEnvironmentlog',
        name: 'WorkEnvironmentlog',
        hidden: true,
        component: () => import('@/views/ipqc/workEnvironmentChecklog/index'),
        meta: { title: '加工环境检验数据日报', icon: 'gongxugl' }
      },
      {
        path: 'sevenSCheck',
        name: 'SevenSCheck',
        component: () => import('@/views/ipqc/7SCheck/index'),
        meta: { title: '7S检验', icon: '7sjiany' }
      },
      {
        path: 'basicInfoManage',
        name: 'BasicInfoManage',
        component: () => import('@/views/ipqc/basicInfoManage/index'),
        meta: { title: '基础信息管理', icon: 'xinxisz' },
        redirect: '/basicInfoManage/craftParameterStandard',
        children: [
          {
            path: 'craftParameterStandard',
            name: 'CraftParameterStandard',
            component: () => import('@/views/ipqc/basicInfoManage/craftParamStandard/index'),
            meta: { title: '工艺参数检验标准', icon: 'lishibb' }
          },
          {
            path: 'consumePeriodStandard',
            name: 'ConsumePeriodStandard',
            component: () => import('@/views/ipqc/basicInfoManage/consumePeriodStandard/index'),
            meta: { title: '耗材周期检验标准', icon: 'yuancailiaogl' }
          },
          {
            path: 'appearMirrorStandard',
            name: 'AppearMirrorStandard',
            component: () => import('@/views/ipqc/basicInfoManage/appearMirrorStandard/index'),
            meta: { title: '外观镜检检验标准', icon: 'chaxunsjq' }
          },
          {
            path: 'grindThicknessStandard',
            name: 'GrindThicknessStandard',
            component: () => import('@/views/ipqc/basicInfoManage/grindThicknessStandard/index'),
            meta: { title: '减薄厚度检验标准', icon: 'yanmo' }
          },
          {
            path: 'otherTypeStandard',
            name: 'OtherTypeStandard',
            component: () => import('@/views/ipqc/basicInfoManage/otherTypeStandard/index'),
            meta: { title: '其他类型检验标准', icon: 'lishibb' }
          },
          {
            path: 'sevenSStandardSetting',
            name: 'SevenSStandardSetting',
            component: () => import('@/views/ipqc/basicInfoManage/7SStandardSetting/index'),
            meta: { title: '7S检验标准设置', icon: '7sjiany' }
          },
          {
            path: 'workEnvironmentSetting',
            name: 'WorkEnvironmentSetting',
            component: () => import('@/views/ipqc/basicInfoManage/workEnvironmentSetting/index'),
            meta: { title: '加工环境设置', icon: 'gongxugl' }
          },
          {
            path: 'classManage',
            name: 'ClassManage',
            component: () => import('@/views/ipqc/basicInfoManage/classManage/index'),
            meta: { title: '班别配置管理', icon: 'banbiepz' }
          }
        ]
      }
    ]
  },
  // pc 投片管理
  {
    path: '/pcChipCasting',
    name: 'PcChipCasting',
    component: Layout,
    redirect: '/pcChipCasting/pcChipCasting',
    alwaysShow: true,
    meta: { title: '生产计划管理', icon: 'shengchajhgl' },
    children: [
      {
        path: 'monthlyPlan',
        name: 'MonthlyPlan',
        component: () => import('@/views/pcChipCasting/monthlyPlan/index'),
        meta: { title: '月度产能规划管理', icon: 'ceshidaiban' }
      },
      // {
      //   path: 'scrapManage',
      //   name: 'ScrapManage',
      //   component: () => import('@/views/pcChipCasting/scrapManage/index'),
      //   meta: { title: '报废片管理', icon: 'yanzhengpiancx' }
      // },
      {
        path: 'pcChipCasting',
        name: 'PcChipCasting',
        component: () => import('@/views/pcChipCasting/pcChipCasting/index'),
        meta: { title: 'PC投片管理', icon: 'chenditoup' }
      },
      {
        path: 'applicationForDeposit',
        name: 'ApplicationForDeposit',
        component: () => import('@/views/pcChipCasting/applicationForDeposit/index'),
        meta: { title: '外延出库申请', icon: 'daidingpd' }
      },
      {
        path: '/pcStrateBasicInfo',
        name: 'PcStrateBasicInfo',
        alwaysShow: true,
        component: () => import('@/views/extensionManage/wyBasicInfoManage/index'),
        meta: { title: '基础信息设置', icon: 'chenditoupiansz' },
        redirect: '/pcStrateBasicInfo/pcBasicManage',
        children: [
          {
            path: 'pickUpRule',
            name: 'PickUpRule',
            component: () => import('@/views/pcChipCasting/pickUpRule/index'),
            meta: { title: '挑片规则管理', icon: 'toupianku' }
          },
          {
            path: 'productModel',
            name: 'ProductModel',
            component: () => import('@/views/pcChipCasting/productModel/index'),
            meta: { title: '产品基础管理', icon: 'sanpianku' }
          },
          {
            path: 'acceptanceCriteria',
            name: 'AcceptanceCriteria',
            component: () => import('@/views/extensionManage/wyBasicInfoManage/portalfilm/acceptanceCriteria/index'),
            meta: { title: '验证片接收标准', icon: 'chulixx' }
          },
          {
            path: 'pcBasicManage',
            name: 'PcBasicManage',
            component: () => import('@/views/pcChipCasting/pcBasicManage/index'),
            meta: { title: '基础字段设置', icon: 'xinxisz' }
          }
        ]
      }
    ]
  },
  // 报废片审核
  {
    path: '/scrapAudit',
    component: Layout,
    children: [
      {
        path: 'scrapInStorage',
        name: 'ScrapInStorage',
        component: () => import('@/views/scrapAudit/scrapInStorage/index'),
        meta: { title: '报废片入库', icon: 'baofeiprk' }
      }
    ]
  },
  // 异常单
  {
    path: '/abnormalBill',
    name: 'AbnormalBill',
    component: Layout,
    redirect: '/abnormalBill/abnormalBillManage',
    alwaysShow: true,
    meta: { title: '异常单', icon: 'yichangdan' },
    children: [
      {
        path: 'abnormalBillManage',
        name: 'AbnormalBillManage',
        component: () => import('@/views/abnormalBill/abnormalBillManage/index'),
        meta: { title: '异常单管理', icon: 'shengchajhgl' }
      },
      {
        path: 'addAbnormalBill',
        name: 'AddAbnormalBill',
        hidden: true,
        component: () => import('@/views/abnormalBill/addAbnormalBill/index'),
        meta: { title: '新增异常单', icon: 'yanzhengpdsh' }
      },
      {
        path: 'productionAbnormalhide',
        name: 'ProductionAbnormalhide',
        hidden: true,
        component: () => import('@/views/chipManage/abnormalManage/productionAbnormalhide/index'),
        meta: { title: '处理产线异常', icon: 'chanxyc' }
      }
    ]
  },
  // 生产异常单
  {
    path: '/abnormalBillsc',
    name: 'AbnormalBillsc',
    component: Layout,
    redirect: '/abnormalBillsc/otherAbnormalBillManagesc',
    alwaysShow: true,
    meta: { title: '异常单', icon: 'yichangdan' },
    children: [
      {
        path: 'addAbnormalBillsc',
        name: 'AddAbnormalBillsc',
        hidden: true,
        component: () => import('@/views/abnormalBill/addAbnormalBill/index'),
        meta: { title: '新增异常单', icon: 'yanzhengpdsh' }
      },
      {
        path: 'productionAbnormalhidesc',
        name: 'ProductionAbnormalhidesc',
        hidden: true,
        component: () => import('@/views/chipManage/abnormalManage/productionAbnormalhide/index'),
        meta: { title: '处理产线异常', icon: 'chanxyc' }
      },
      {
        path: 'otherAbnormalBillManagesc',
        name: 'OtherAbnormalBillManagesc',
        component: () => import('@/views/abnormalBill/otherAbnormalBillManage/index'),
        meta: { title: '异常单管理', icon: 'chukushenhe' }
      }
    ]
  },
  // 外延异常单
  {
    path: '/abnormalBillwy',
    name: 'AbnormalBillwy',
    component: Layout,
    redirect: '/abnormalBillwy/otherAbnormalBillManagewy',
    alwaysShow: true,
    meta: { title: '异常单', icon: 'yichangdan' },
    children: [
      {
        path: 'addAbnormalBillwy',
        name: 'AddAbnormalBillwy',
        hidden: true,
        component: () => import('@/views/abnormalBill/addAbnormalBill/index'),
        meta: { title: '新增异常单', icon: 'yanzhengpdsh' }
      },
      {
        path: 'productionAbnormalhidewy',
        name: 'ProductionAbnormalhidewy',
        hidden: true,
        component: () => import('@/views/chipManage/abnormalManage/productionAbnormalhide/index'),
        meta: { title: '处理产线异常', icon: 'chanxyc' }
      },
      {
        path: 'otherAbnormalBillManagewy',
        name: 'OtherAbnormalBillManagewy',
        component: () => import('@/views/abnormalBill/otherAbnormalBillManage/index'),
        meta: { title: '异常单管理', icon: 'chukushenhe' }
      }
    ]
  },
  // 仓库异常单
  // {
  //   path: '/abnormalBillck',
  //   name: 'AbnormalBillck',
  //   component: Layout,
  //   redirect: '/abnormalBillck/otherAbnormalBillManageck',
  //   alwaysShow: true,
  //   meta: { title: '异常单', icon: 'yichangdan' },
  //   children: [
  //     {
  //       path: 'addAbnormalBillck',
  //       name: 'AddAbnormalBillck',
  //       hidden: true,
  //       component: () => import('@/views/abnormalBill/addAbnormalBill/index'),
  //       meta: { title: '新增异常单', icon: 'yanzhengpdsh' }
  //     },
  //     {
  //       path: 'productionAbnormalhideck',
  //       name: 'ProductionAbnormalhideck',
  //       hidden: true,
  //       component: () => import('@/views/chipManage/abnormalManage/productionAbnormalhide/index'),
  //       meta: { title: '处理产线异常', icon: 'chanxyc' }
  //     },
  //     {
  //       path: 'otherAbnormalBillManageck',
  //       name: 'OtherAbnormalBillManageck',
  //       component: () => import('@/views/abnormalBill/otherAbnormalBillManage/index'),
  //       meta: { title: '异常单管理', icon: 'chukushenhe' }
  //     }
  //   ]
  // },
  // 工艺异常单
  {
    path: '/abnormalBillgy',
    name: 'AbnormalBillgy',
    component: Layout,
    redirect: '/abnormalBillgy/otherAbnormalBillManagegy',
    alwaysShow: true,
    meta: { title: '异常单', icon: 'yichangdan' },
    children: [
      {
        path: 'addAbnormalBillgy',
        name: 'AddAbnormalBillgy',
        hidden: true,
        component: () => import('@/views/abnormalBill/addAbnormalBill/index'),
        meta: { title: '新增异常单', icon: 'yanzhengpdsh' }
      },
      {
        path: 'productionAbnormalhidegy',
        name: 'ProductionAbnormalhidegy',
        hidden: true,
        component: () => import('@/views/chipManage/abnormalManage/productionAbnormalhide/index'),
        meta: { title: '处理产线异常', icon: 'chanxyc' }
      },
      {
        path: 'otherAbnormalBillManagegy',
        name: 'OtherAbnormalBillManagegy',
        component: () => import('@/views/abnormalBill/otherAbnormalBillManage/index'),
        meta: { title: '异常单管理', icon: 'chukushenhe' }
      }
    ]
  },
  {
    path: '/productManage',
    name: 'ProductManage',
    component: Layout,
    redirect: '/productManage/wyProductManage',
    alwaysShow: true,
    meta: { title: '生管报表', icon: 'zhilbb' },
    children: [
      {
        path: 'wyProductManage',
        name: 'WyProductManage',
        component: () => import('@/views/qualityReport/fqcAndOqcReport/index'),
        meta: { title: '外延生管', icon: 'baobiaofenx' },
        redirect: '/fqcAndOqcReport/visualInspectionWrongSta',
        children: [
          {
            path: 'dailyWarehousing',
            name: 'DailyWarehousing',
            component: () => import('@/views/extensionManage/wyReport/dailyWarehousing/index'),
            meta: { title: '外延日入库分布', icon: 'rirkfb' }
          },
          {
            path: 'portalfilm',
            name: 'Portalfilm',
            component: () => import('@/views/extensionManage/wyReport/portalfilm/index'),
            meta: { title: '验证片数据监控', icon: 'zhilianggk' }
          },
          {
            path: 'stockDivision',
            name: 'StockDivision',
            component: () => import('@/views/extensionManage/wyReport/stockDivision/index'),
            meta: { title: '外延库存分布', icon: 'kucunfb' }
          }
        ]
      },
      {
        path: 'chipProductManage',
        name: 'ChipProductManage',
        component: () => import('@/views/chipManage/reportManage/index'),
        meta: { title: '芯片生管', icon: 'xppbbb' },
        redirect: '/chipProductManage/frontProductionCycle',
        children: [
          {
            path: 'frontProductionCycle',
            name: 'FrontProductionCycle',
            component: () => import('@/views/chipManage/reportManage/frontProductionCycle/index'),
            meta: { title: '芯片生管', icon: 'shengmzq' }
          }
        ]
      }
    ]
  },
  // 质量报表
  {
    path: '/qualityReport',
    name: 'QualityReport',
    component: Layout,
    redirect: '/qualityReport/fqcAndOqcReport',
    alwaysShow: true,
    meta: { title: '质量报表', icon: 'zhilbb' },
    children: [
      {
        path: 'fqcAndOqcReport',
        name: 'FqcAndOqcReport',
        component: () => import('@/views/qualityReport/fqcAndOqcReport/index'),
        meta: { title: '外延品保报表', icon: 'baobiaofenx' },
        redirect: '/fqcAndOqcReport/visualInspectionWrongSta',
        children: [
          {
            path: 'visualInspectionWrongSta',
            name: 'VisualInspectionWrongSta',
            component: () => import('@/views/qualityReport/fqcAndOqcReport/visualInspectionWrongSta/index'),
            meta: { title: '目检误判统计', icon: 'jyyc' }
          },
          {
            path: 'outGoingInspection',
            name: 'OutGoingInspection',
            component: () => import('@/views/qualityReport/fqcAndOqcReport/outGoingInspection/index'),
            meta: { title: '外延出入库检验', icon: 'churukjj' }
          },
          {
            path: 'svInspectionExceptions',
            name: 'SvInspectionExceptions',
            component: () => import('@/views/qualityReport/fqcAndOqcReport/svInspectionExceptions/index'),
            meta: { title: '目检异常统计', icon: 'jyyc' }
          },
          {
            path: 'bfInspectionExceptions',
            name: 'BfInspectionExceptions',
            component: () => import('@/views/qualityReport/fqcAndOqcReport/bfInspectionExceptions/index'),
            meta: { title: '目检报废统计', icon: 'mjbftj' }
          },
          {
            path: 'svInspectionExceptionsfx',
            name: 'SvInspectionExceptionsfx',
            hidden: true,
            component: () => import('@/views/qualityReport/fqcAndOqcReport/svInspectionExceptionsfx/index'),
            meta: { title: '目检报废异常分析', icon: 'lishibb' }
          }
        ]
      },
      {
        path: 'yzpAuditReport',
        name: 'YzpAuditReport',
        component: () => import('@/views/qualityReport/yzpAuditReport/index'),
        meta: { title: '芯片品保报表', icon: 'xppbbb' },
        redirect: '/YzpAuditReport/chipInConfig',
        children: [
          {
            path: 'chipInConfig',
            name: 'ChipInConfig',
            component: () => import('@/views/qualityReport/yzpAuditReport/chipInConfig/index'),
            meta: { title: '芯片入库检验', icon: 'mujianyan' }
          },
          {
            path: 'exceptionTotal',
            name: 'ExceptionTotal',
            component: () => import('@/views/qualityReport/yzpAuditReport/exceptionTotal/index'),
            meta: { title: '异常汇总统计', icon: 'yichztj' }
          },
          {
            path: 'subTotal',
            name: 'SubTotal',
            component: () => import('@/views/qualityReport/yzpAuditReport/subTotal/index'),
            meta: { title: '副品入库统计', icon: 'fuprktj' }
          },
          {
            path: 'cowMonitor',
            name: 'CowMonitor',
            component: () => import('@/views/qualityReport/yzpAuditReport/cowMonitor/index'),
            meta: { title: 'COW数据监控', icon: 'cowjjk' }
          },
          {
            path: 'cotMonitor',
            name: 'CotMonitor',
            component: () => import('@/views/qualityReport/yzpAuditReport/cotMonitor/index'),
            meta: { title: 'COT数据监控', icon: 'cotsjjk' }
          },
          {
            path: 'fqcMonitor',
            name: 'FqcMonitor',
            component: () => import('@/views/qualityReport/yzpAuditReport/fqcMonitor/index'),
            meta: { title: 'FQC入库数据监控', icon: 'fqcrkjk' }
          }
        ]
      }
    ]
  },
  { // 生产任务管理
    path: '/qualityBasic',
    name: 'QualityBasic',
    component: Layout,
    redirect: '/qualityBasic/baofeiType',
    alwaysShow: true,
    meta: { title: '基础信息维护', icon: 'lvdanxinxsz' },
    children: [
      {
        path: 'baofeiType',
        name: 'BaofeiType',
        component: () => import('@/views/qualityReport/fqcAndOqcReport/baofeiType/index'),
        meta: { title: '报废类型', icon: 'xinxisz' }
      },
      {
        path: 'exceptionClass',
        name: 'ExceptionClass',
        component: () => import('@/views/qualityReport/yzpAuditReport/exceptionClass/index'),
        meta: { title: '异常分类配置', icon: 'baozhuangqx' }
      }
    ]
  },
  // 外延报表
  {
    path: '/wyReport',
    name: 'wyReport',
    component: Layout,
    redirect: '/wyReport/productionReport',
    alwaysShow: true,
    meta: { title: '外延报表', icon: 'baobiaofenx' },
    children: [
      {
        path: 'productionReport',
        name: 'productionReport',
        component: () => import('@/views/extensionManage/wyReport/productionReport/index'),
        meta: { title: '外延生产报表', icon: 'shujufenxi' }
      },
      {
        path: 'templateLibrary',
        name: 'templateLibrary',
        component: () => import('@/views/extensionManage/wyReport/processReport/templateLibrary/index'),
        meta: { title: '外延工艺报表', icon: 'spckongzhi' }
      },
      {
        path: 'templateCreate',
        name: 'templateCreate',
        hidden: true,
        component: () => import('@/views/extensionManage/wyReport/processReport/templateCreate/index'),
        meta: { title: '模板创建', icon: 'sanjicdm' }
      },
      {
        path: 'templateShow',
        name: 'templateShow',
        hidden: true,
        component: () => import('@/views/extensionManage/wyReport/processReport/templateShow/index'),
        meta: { title: '工艺报表展示区', icon: 'sanjicdm' }
      },
      {
        path: 'substrateType',
        name: 'substrateType',
        component: () => import('@/views/extensionManage/wyReport/substrateType/index'),
        meta: { title: '衬底分类', icon: 'chendixinxisz' }
      },
      {
        path: 'jdTimeStatistics',
        name: 'jdTimeStatistics',
        component: () => import('@/views/extensionManage/wyReport/jdTimeStatistics/index'),
        meta: { title: '稼动时间统计', icon: 'daidingpd' }
      },
      {
        path: 'detailsStatistics',
        name: 'detailsStatistics',
        component: () => import('@/views/extensionManage/wyReport/detailsStatistics/index'),
        meta: { title: '各项明细统计表', icon: 'fenxipz' }
      },
      {
        path: 'STDStatistics',
        name: 'STDStatistics',
        component: () => import('@/views/extensionManage/wyReport/STDStatistics/index'),
        meta: { title: 'STD>4统计', icon: 'stdtji' }
      },
      {
        path: 'extensionReport',
        name: 'ExtensionReport',
        component: () => import('@/views/extensionManage/extensionReport/index'),
        meta: { title: '外延汇总表', icon: 'waiyanhuizong' }
      },
      {
        path: 'productSumReport',
        name: 'ProductSumReport',
        component: () => import('@/views/extensionManage/wyReport/productSumReport/index'),
        meta: { title: '外延产出汇总报表', icon: 'fenxi' }
      }
    ]
  },
  {
    path: '/wyBasicInfoManage',
    name: 'WyBasicInfoManage',
    component: Layout,
    alwaysShow: true,
    meta: { title: '基础信息', icon: 'jichuxinxi' },
    redirect: '/substrateBasicInfo/chipInfo',
    children: [
      {
        path: '/substrateBasicInfo',
        name: 'SubstrateBasicInfo',
        alwaysShow: true,
        component: () => import('@/views/extensionManage/wyBasicInfoManage/index'),
        meta: { title: '衬底投片设置', icon: 'chenditoupiansz' },
        redirect: '/substrateBasicInfo/chipInfo',
        children: [
          {
            path: 'chipInfo',
            name: 'ChipInfo',
            component: () => import('@/views/extensionManage/wyBasicInfoManage/substrateBasicInfo/chipInfo/index'),
            meta: { title: '投片信息管理', icon: 'sanjicdm' }
          },
          {
            path: 'decideTo',
            name: 'DecideTo',
            component: () => import('@/views/extensionManage/wyBasicInfoManage/substrateBasicInfo/decideTo/index'),
            meta: { title: '判定指向设置', icon: 'sanjicdm' }
          },
          {
            path: 'mocvdInfo',
            name: 'MocvdInfo',
            component: () => import('@/views/extensionManage/wyBasicInfoManage/substrateBasicInfo/mocvdInfo/index'),
            meta: { title: 'MOCVD机台设置', icon: 'sanjicdm' }
          }
        ]
      },
      {
        path: '/AlNiBasicInfo',
        name: 'AlNiBasicInfo',
        alwaysShow: true,
        component: () => import('@/views/extensionManage/wyBasicInfoManage/index'),
        meta: { title: '铝氮信息设置', icon: 'lvdanxinxsz' },
        redirect: '/AlNiBasicInfo/AlNiCase',
        children: [
          {
            path: 'AlNiCase',
            name: 'AlNiCase',
            component: () => import('@/views/extensionManage/wyBasicInfoManage/AlNiBasicInfo/AlNiCase/index'),
            meta: { title: '铝氮卡塞设置', icon: 'sanjicdm' }
          },
          // {
          //   path: 'AlNiBarCode',
          //   name: 'AlNiBarCode',
          //   component: () => import('@/views/extensionManage/wyBasicInfoManage/AlNiBasicInfo/AlNiBarCode/index'),
          //   meta: { title: '铝氮条码设置', icon: 'sanjicdm' }
          // },
          {
            path: 'AlNiEngine',
            name: 'AlNiEngine',
            component: () => import('@/views/extensionManage/wyBasicInfoManage/AlNiBasicInfo/AlNiEngine/index'),
            meta: { title: '铝氮机台设置', icon: 'sanjicdm' }
          },
          {
            path: 'AlNiCraft',
            name: 'AlNiCraft',
            component: () => import('@/views/extensionManage/wyBasicInfoManage/AlNiBasicInfo/AlNiCraft/index'),
            meta: { title: '铝氮工艺设置', icon: 'sanjicdm' }
          }
        ]
      },
      {
        path: 'substrateInfo',
        name: 'SubstrateInfo',
        component: () => import('@/views/extensionManage/wyBasicInfoManage/substrateInfo/index'),
        meta: { title: '衬底信息设置', icon: 'chendixinxisz' }
      },
      {
        path: 'visualInspectionSetting',
        name: 'VisualInspectionSetting',
        component: () => import('@/views/extensionManage/wyBasicInfoManage/visualInspection/index'),
        meta: { title: '目检基础设置', icon: 'mujianjichusz' }
      },
      {
        path: 'alarmRules',
        name: 'alarmRules',
        component: () => import('@/views/extensionManage/wyBasicInfoManage/alarmRules/chipInfo/index'),
        meta: { title: '报警规则设置', icon: 'baojingguiz' }
      },
      // {
      //   path: '/alarmRules',
      //   name: 'AlarmRules',
      //   alwaysShow: true,
      //   component: () => import('@/views/extensionManage/wyBasicInfoManage/index'),
      //   meta: { title: '报警规则设置', icon: 'cgfenxi' },
      //   redirect: '/alarmRules/ELAlarmRules',
      //   children: [
      //     {
      //       path: 'ELAlarmRules',
      //       name: 'ELAlarmRules',
      //       component: () => import('@/views/extensionManage/wyBasicInfoManage/alarmRules/chipInfo/index'),
      //       meta: { title: 'EL报警规则设置' }
      //     },
      //     {
      //       path: 'grailAlarmRules',
      //       name: 'GrailAlarmRules',
      //       component: () => import('@/views/extensionManage/wyBasicInfoManage/alarmRules/grailAlarmRules/index'),
      //       meta: { title: '大盘报警规则设置' }
      //     }
      //   ]
      // },
      {
        path: '/portalfilm',
        name: 'Portalfilm',
        alwaysShow: true,
        component: () => import('@/views/extensionManage/wyBasicInfoManage/index'),
        meta: { title: '验证片设置', icon: 'jianyansz' },
        redirect: '/alarmRules/ELAlarmRules',
        children: [
          {
            path: 'versionManage',
            name: 'versionManage',
            component: () => import('@/views/extensionManage/wyBasicInfoManage/portalfilm/versionManage/index'),
            meta: { title: '验证版型设置', icon: 'sanjicdm' }
          }
        ]
      }
    ]
  },
  // 芯片管理 start
  // 外延-月度产能规划接收
  { // 原材料管理
    path: '/rawMaterialManage',
    name: 'RawMaterialManage',
    component: Layout,
    alwaysShow: true,
    redirect: '/rawMaterialManage/pcTipOut',
    meta: { title: '原材料管理', icon: 'yuancailiaogl' },
    children: [
      {
        path: 'rawMaterial',
        name: 'RawMaterial',
        component: () => import('@/views/chipManage/rawMaterialManage/rawMaterial/index'),
        meta: { title: '原材料更换管理', icon: 'bwendcfjc' }
      },
      {
        path: 'smallBatchSampleReceiveXp',
        name: 'smallBatchSampleReceiveXp',
        component: () => import('@/views/iqc/smallBatchSampleReceive/index'),
        meta: { title: '小批量试样管理', icon: 'liezhank' }
      }
    ]
  },
  { // 生产任务管理
    path: '/chipProductionTask',
    name: 'ChipProductionTask',
    component: Layout,
    redirect: '/chipProductionTask/pcTipOut',
    alwaysShow: true,
    meta: { title: '生产任务管理', icon: 'lvdanxinxsz' },
    children: [
      {
        path: 'pcTipOut',
        name: 'PcTipOut',
        component: () => import('@/views/chipManage/chipProductionTask/pcTipOut/index'),
        meta: { title: 'PC投片管理', icon: 'chenditoup' }
      },
      {
        path: '/xpMonthCapacityPlan/index',
        name: 'xpMonthCapacityPlan',
        component: () => import('@/views/iqc/xpMonthCapacityPlan/index'),
        meta: { title: '月度产能规划接收', icon: 'ceshidaiban' }
      }
    ]
  },
  { // 生产进度跟踪
    path: '/progressTracking',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'ProgressTracking',
        component: () => import('@/views/chipManage/progressTracking/index'),
        meta: { title: '生产进度跟踪', icon: 'shengchanjd' }
      }
    ]
  },
  { // 工艺流程管理
    path: '/carftPorcess',
    name: 'CarftPorcess',
    component: Layout,
    redirect: '/carftPorcess/proceCard',
    alwaysShow: true,
    meta: { title: '工艺流程管理', icon: 'gongyishijian' },
    children: [
      {
        path: 'proceCard',
        name: 'ProceCard',
        component: () => import('@/views/processManagement/proceCardManage/index'),
        meta: { title: '返工流程卡管理', icon: 'fanglckgl' }
      },
      {
        path: 'transitSiteConfig',
        name: 'TransitSiteConfig',
        component: () => import('@/views/chipManage/carftPorcess/transitSiteConfig/index'),
        meta: { title: '过站站点配置', icon: 'zhandianpz' }
      }
    ]
  },
  { // 前段站点管理
    path: '/frontSiteManage',
    name: 'FrontSiteManage',
    component: Layout,
    redirect: '/frontSiteManage/cleanSite',
    alwaysShow: true,
    meta: { title: '前段站点管理', icon: 'qiandzdgl' },
    children: [
      {
        path: 'cleanSite',
        name: 'CleanSite',
        component: () => import('@/views/chipManage/frontSiteManage/cleanSite/index'),
        meta: { title: '清洗站点管理', icon: 'lishibb' }
      },
      {
        path: 'corrosionSite',
        name: 'CorrosionSite',
        component: () => import('@/views/chipManage/frontSiteManage/corrosionSite/index'),
        meta: { title: '腐蚀站点管理', icon: 'lishibb' }
      },
      {
        path: 'gluingSite',
        name: 'GluingSite',
        component: () => import('@/views/chipManage/frontSiteManage/gluingSite/index'),
        meta: { title: '打胶站点管理', icon: 'lishibb' }
      },
      {
        path: 'degummingSite',
        name: 'DegummingSite',
        component: () => import('@/views/chipManage/frontSiteManage/degummingSite/index'),
        meta: { title: '去胶站点管理', icon: 'lishibb' }
      },
      {
        path: 'photoetchingSite',
        name: 'PhotoetchingSite',
        component: () => import('@/views/chipManage/frontSiteManage/photoetchingSite/index'),
        meta: { title: '光刻站点管理', icon: 'lishibb' }
      },
      {
        path: 'hardBakingSite',
        name: 'HardBakingSite',
        component: () => import('@/views/chipManage/frontSiteManage/hardBakingSite/index'),
        meta: { title: '硬烤站点管理', icon: 'lishibb' }
      },
      {
        path: 'glueCoating',
        name: 'Coating',
        component: () => import('@/views/chipManage/frontSiteManage/glueCoating/index'),
        meta: { title: '光刻胶涂布管理', icon: 'lishibb' }
      },
      {
        path: 'baseGlueCoating',
        name: 'BaseGlueCoating',
        component: () => import('@/views/chipManage/frontSiteManage/baseGlueCoating/index'),
        meta: { title: '底胶涂布管理', icon: 'lishibb' }
      },
      {
        path: 'developSite',
        name: 'DevelopSite',
        component: () => import('@/views/chipManage/frontSiteManage/developSite/index'),
        meta: { title: '显影站点管理', icon: 'lishibb' }
      },
      {
        path: 'pebSite',
        name: 'PebSite',
        component: () => import('@/views/chipManage/frontSiteManage/pebSite/index'),
        meta: { title: 'PEB站点管理', icon: 'lishibb' }
      },
      {
        path: 'evaporationSite',
        name: 'EvaporationSite',
        component: () => import('@/views/chipManage/frontSiteManage/evaporationSite/index'),
        meta: { title: '蒸镀站点管理', icon: 'lishibb' }
      },
      {
        path: 'etchingSite',
        name: 'EtchingSite',
        component: () => import('@/views/chipManage/frontSiteManage/etchingSite/index'),
        meta: { title: '蚀刻站点管理', icon: 'lishibb' }
      },
      {
        path: 'fuseSite',
        name: 'FuseSite',
        component: () => import('@/views/chipManage/frontSiteManage/fuseSite/index'),
        meta: { title: '熔合站点管理', icon: 'lishibb' }
      },
      {
        path: 'depositionSite',
        name: 'DepositionSite',
        component: () => import('@/views/chipManage/frontSiteManage/depositionSite/index'),
        meta: { title: '沉积站点管理', icon: 'lishibb' }
      },
      {
        path: 'annealSite',
        name: 'AnnealSite',
        component: () => import('@/views/chipManage/frontSiteManage/annealSite/index'),
        meta: { title: '退火站点管理', icon: 'lishibb' }
      },
      {
        path: 'degummingMicroscopy',
        name: 'DegummingMicroscopy',
        component: () => import('@/views/chipManage/frontSiteManage/degummingMicroscopy/index'),
        meta: { title: '去胶镜检站点管理', icon: 'lishibb' }
      },
      {
        path: 'photoetchingMicroscopy',
        name: 'HotoetchingMicroscopy',
        component: () => import('@/views/chipManage/frontSiteManage/photoetchingMicroscopy/index'),
        meta: { title: '光刻镜检站点管理', icon: 'lishibb' }
      },
      {
        path: 'etchingMicroscopy',
        name: 'EtchingMicroscopy',
        component: () => import('@/views/chipManage/frontSiteManage/etchingMicroscopy/index'),
        meta: { title: '腐蚀镜检站点管理', icon: 'lishibb' }
      },
      {
        path: 'beforLeaving',
        name: 'BeforLeaving',
        component: () => import('@/views/chipManage/frontSiteManage/beforLeaving/index'),
        meta: { title: '出站镜检站点管理', icon: 'lishibb' }
      },
      {
        path: 'tensileTest',
        name: 'TensileTest',
        component: () => import('@/views/chipManage/rearSiteManage/tensileTest/index'),
        meta: { title: '拉力测试管理', icon: 'lishibb' }
      },
      {
        path: '/cowTestManage',
        name: 'CowTestManage',
        alwaysShow: true,
        component: () => import('@/views/extensionManage/wyBasicInfoManage/index'),
        meta: { title: 'COW测试管理', icon: 'lishibb' },
        redirect: '/cowTestManage/cowOverSite',
        children: [
          {
            path: 'cowOverSite',
            name: 'CowOverSite',
            component: () => import('@/views/chipManage/rearSiteManage/cowTestManage/cowOverSite/index'),
            meta: { title: 'COW过站', icon: 'sanjicdm' }
          },
          {
            path: 'cowInfo',
            name: 'CowInfo',
            component: () => import('@/views/chipManage/rearSiteManage/cowTestManage/cowInfo/index'),
            meta: { title: 'COW数据查询', icon: 'sanjicdm' }
          }
        ]
      }
    ]
  },
  {
    path: '/rearSiteManage',
    name: 'RearSiteManage',
    component: Layout,
    alwaysShow: true,
    meta: { title: '后段站点管理', icon: 'houdzdgl' },
    redirect: '/rearSiteManage/tensileTest',
    children: [
      {
        path: '/grindManage',
        name: 'GrindManage',
        alwaysShow: true,
        component: () => import('@/views/extensionManage/wyBasicInfoManage/index'),
        meta: { title: '研磨管理', icon: 'lishibb' },
        redirect: '/grindManage/grindOverSite',
        children: [
          {
            path: 'grindOverSite',
            name: 'GrindOverSite',
            component: () => import('@/views/chipManage/rearSiteManage/grindManage/grindOverSite/index'),
            meta: { title: '研磨过站', icon: 'sanjicdm' }
          },
          {
            path: 'siteProgress',
            name: 'SiteProgress',
            component: () => import('@/views/chipManage/rearSiteManage/grindManage/siteProgress/index'),
            meta: { title: '站内进度查询', icon: 'sanjicdm' }
          }
        ]
      },
      {
        path: '/inciseManage',
        name: 'InciseManage',
        alwaysShow: true,
        component: () => import('@/views/extensionManage/wyBasicInfoManage/index'),
        meta: { title: '切割管理', icon: 'lishibb' },
        redirect: '/inciseManage/inciseOverSite',
        children: [
          {
            path: 'inciseOverSite',
            name: 'InciseOverSite',
            component: () => import('@/views/chipManage/rearSiteManage/inciseManage/inciseOverSite/index'),
            meta: { title: '切割过站', icon: 'sanjicdm' }
          },
          {
            path: 'inciseTag',
            name: 'InciseTag',
            component: () => import('@/views/chipManage/rearSiteManage/inciseManage/inciseTag/index'),
            meta: { title: '切割标签', icon: 'sanjicdm' }
          },
          {
            path: 'inciseContrast',
            name: 'InciseContrast',
            component: () => import('@/views/chipManage/rearSiteManage/inciseManage/inciseContrast/index'),
            meta: { title: '切割点检管理', icon: 'sanjicdm' }
          }
        ]
      },
      {
        path: '/visualInspectionTest',
        name: 'VisualInspectionTest',
        alwaysShow: true,
        component: () => import('@/views/extensionManage/wyBasicInfoManage/index'),
        meta: { title: '目检测试管理', icon: 'lishibb' },
        redirect: '/visualInspectionTest/viOverSite',
        children: [
          // {
          //   path: 'viOverSite',
          //   name: 'ViOverSite',
          //   component: () => import('@/views/chipManage/rearSiteManage/visualInspectionTest/viOverSite/index'),
          //   meta: { title: '目检过站' }
          // },
          {
            path: 'visualInspectionInfo',
            name: 'VisualInspectionInfo',
            component: () => import('@/views/chipManage/rearSiteManage/visualInspectionTest/visualInspectionInfo/index'),
            meta: { title: '目检过站', icon: 'sanjicdm' }
          }
        ]
      },
      // 后段下半部分
      {
        path: '/cotTest',
        name: 'CotTest',
        alwaysShow: true,
        component: () => import('@/views/extensionManage/wyBasicInfoManage/index'),
        meta: { title: 'COT测试', icon: 'lishibb' },
        redirect: '/cotTest/cotCrossingStation',
        children: [
          {
            path: 'cotCrossingStation',
            name: 'CotCrossingStation',
            component: () => import('@/views/chipManage/rearSiteManage/cotTest/cotCrossingStation/index'),
            meta: { title: 'COT过站', icon: 'sanjicdm' }
          },
          {
            path: 'cotTestData',
            name: 'CotTestDtaa',
            component: () => import('@/views/chipManage/rearSiteManage/cotTest/cotTest/index'),
            meta: { title: 'COT数据查询', icon: 'sanjicdm' }
          }
        ]
      },
      {
        path: '/aoiVisualInspection',
        name: 'AoiVisualInspection',
        alwaysShow: true,
        component: () => import('@/views/extensionManage/wyBasicInfoManage/index'),
        meta: { title: 'AOI目检', icon: 'lishibb' },
        redirect: '/aoiVisualInspection/aoiVisualInspection',
        children: [
          {
            path: 'aoiVisualInspection',
            name: 'aoiVisualInspection',
            component: () => import('@/views/chipManage/rearSiteManage/aoiVisualInspection/aoiVisualInspection/index'),
            meta: { title: 'AOI数据', icon: 'sanjicdm' }
          }
        ]
      },
      {
        path: '/sorting',
        name: 'Sorting',
        alwaysShow: true,
        component: () => import('@/views/extensionManage/wyBasicInfoManage/index'),
        meta: { title: '分选', icon: 'lishibb' },
        redirect: '/sorting/retrospectiveDetermination',
        children: [
          {
            path: 'retrospectiveDetermination',
            name: 'retrospectiveDetermination',
            component: () => import('@/views/chipManage/rearSiteManage/sorting/retrospectiveDetermination/index'),
            meta: { title: '回测判定', icon: 'shengchanjd' }
          },
          {
            path: '/sortingScheduling',
            name: 'SortingScheduling',
            alwaysShow: true,
            component: () => import('@/views/chipManage/reportManage/index'),
            meta: { title: '分选调度', icon: 'fenxuandd' },
            redirect: '/sortingScheduling/machineScheduling',
            children: [
              {
                path: 'machineScheduling',
                name: 'MachineScheduling',
                component: () => import('@/views/chipManage/rearSiteManage/sorting/sortingScheduling/machineScheduling/index'),
                meta: { title: '机台调度', icon: 'sanjicdm' }
              },
              {
                path: 'sortingScheduling',
                name: 'sortingScheduling',
                component: () => import('@/views/chipManage/rearSiteManage/sorting/sortingScheduling/sortingScheduling/index'),
                meta: { title: '分选调度', icon: 'sanjicdm' }
              },
              {
                path: 'sortingLimit',
                name: 'sortingLimit',
                component: () => import('@/views/chipManage/rearSiteManage/sorting/sortingScheduling/sortingLimit/index'),
                meta: { title: '分选限制', icon: 'sanjicdm' }
              },
              {
                path: 'schedulingLog',
                name: 'SchedulingLog',
                component: () => import('@/views/chipManage/rearSiteManage/sorting/sortingScheduling/schedulingLog/index'),
                meta: { title: '调度记录', icon: 'sanjicdm' }
              }
            ]
          },
          {
            path: 'membraneRetainingCrossingStation',
            name: 'membraneRetainingCrossingStation',
            component: () => import('@/views/chipManage/rearSiteManage/sorting/membraneRetainingCrossingStation/index'),
            meta: { title: '留膜过站', icon: 'liumogz' }
          },
          {
            path: 'lowerBinData',
            name: 'lowerBinData',
            component: () => import('@/views/chipManage/rearSiteManage/sorting/lowerBinData/index'),
            meta: { title: '下Bin数据查询', icon: 'shujucxx' }
          },
          {
            path: 'motherSliceData',
            name: 'motherSliceData',
            component: () => import('@/views/chipManage/rearSiteManage/sorting/motherSliceData/index'),
            meta: { title: '母片数据查询', icon: 'yanzhengpiancx' }
          },
          {
            path: 'lowerBinPrint',
            name: 'lowerBinPrint',
            component: () => import('@/views/chipManage/rearSiteManage/sorting/lowerBinPrint/index'),
            meta: { title: '下Bin标签打印', icon: 'biaoqiandy' }
          },
          {
            path: 'binDocuments',
            name: 'binDocuments',
            component: () => import('@/views/chipManage/rearSiteManage/sorting/binDocuments/index'),
            meta: { title: 'Bin文档重复监测', icon: 'bwendcfjc' }
          }
        ]
      },
      {
        path: '/cleanoutManage',
        name: 'CleanoutManage',
        alwaysShow: true,
        component: () => import('@/views/extensionManage/wyBasicInfoManage/index'),
        meta: { title: '清洗管理', icon: 'lishibb' },
        redirect: '/cleanoutManage/CleanedStation',
        children: [
          {
            path: 'cleanedStation',
            name: 'CleanedStation',
            component: () => import('@/views/chipManage/rearSiteManage/cleanoutManage/cleanedStation/index'),
            meta: { title: '下BIN清洗', icon: 'sanjicdm' }
          }
        ]
      }
    ]
  },
  { // 报表管理
    path: '/reportManage',
    name: 'ReportManage',
    component: Layout,
    redirect: '/spccontrol/itoeEvaporationSPC',
    alwaysShow: true,
    meta: { title: '报表管理', icon: 'baobiaofenx' },
    children: [
      {
        path: '/spccontrol',
        name: 'Spccontrol',
        alwaysShow: true,
        component: () => import('@/views/chipManage/reportManage/index'),
        meta: { title: 'SPC控制', icon: 'spckongzhi' },
        redirect: '/spccontrol/itoeEvaporationSPC',
        children: [
          {
            path: 'itoeEvaporationSPC',
            name: 'ItoeEvaporationSPC',
            component: () => import('@/views/chipManage/reportManage/spccontrol/itoeEvaporationSPC/index'),
            meta: { title: 'ITO蒸镀SPC', icon: 'sanjicdm' }
          },
          {
            path: 'electrodeEvaporationSPC',
            name: 'ElectrodeEvaporationSPC',
            component: () => import('@/views/chipManage/reportManage/spccontrol/electrodeEvaporationSPC/index'),
            meta: { title: '电极蒸镀SPC', icon: 'sanjicdm' }
          },
          {
            path: 'etchingSPC',
            name: 'EtchingSPC',
            component: () => import('@/views/chipManage/reportManage/spccontrol/etchingSPC/index'),
            meta: { title: '蚀刻SPC', icon: 'sanjicdm' }
          },
          {
            path: 'depositionSPC',
            name: 'DepositionSPC',
            component: () => import('@/views/chipManage/reportManage/spccontrol/depositionSPC/index'),
            meta: { title: '沉积SPC', icon: 'sanjicdm' }
          },
          {
            path: 'settingSPC',
            name: 'SettingSPC',
            component: () => import('@/views/chipManage/reportManage/spccontrol/settingSPC/index'),
            meta: { title: 'SPC配置', icon: 'sanjicdm' }
          }
        ]
      }
    ]
  },
  { // 异常管理
    path: '/abnormalManage',
    name: 'AbnormalManage',
    component: Layout,
    redirect: '/abnormalManage/productionAbnormal',
    alwaysShow: true,
    meta: { title: '异常管理', icon: 'baojinguize' },
    children: [
      {
        path: 'productionAbnormal',
        name: 'ProductionAbnormal',
        component: () => import('@/views/chipManage/abnormalManage/productionAbnormal/index'),
        meta: { title: '产线异常', icon: 'chanxyc' }
      },
      {
        path: 'productionAbnormalhd',
        name: 'ProductionAbnormalhd',
        component: () => import('@/views/chipManage/abnormalManage/productionAbnormalhd/index'),
        meta: { title: '后段异常处理', icon: 'houdyccl' }
      },
      {
        path: 'addAbnormalBillxp',
        name: 'AddAbnormalBillxp',
        hidden: true,
        component: () => import('@/views/abnormalBill/addAbnormalBill/index'),
        meta: { title: '新增异常单', icon: 'yanzhengpdsh' }
      },
      {
        path: 'reworkManage',
        name: 'ReworkManage',
        component: () => import('@/views/chipManage/abnormalManage/reworkManage/index'),
        meta: { title: '返工管理', icon: 'fangonggl' }
      },
      {
        path: 'scrapManages',
        name: 'ScrapManages',
        component: () => import('@/views/scrapAudit/scrapManage/index'),
        meta: { title: '报废片管理', icon: 'kehudpz' }
      },
      {
        path: 'productionAbnormalhidexp',
        name: 'ProductionAbnormalhidexp',
        hidden: true,
        component: () => import('@/views/chipManage/abnormalManage/productionAbnormalhide/index'),
        meta: { title: '处理产线异常', icon: 'chanxyc' }
      },
      {
        path: 'otherAbnormalBillManagexp',
        name: 'OtherAbnormalBillManagexp',
        component: () => import('@/views/abnormalBill/otherAbnormalBillManage/index'),
        meta: { title: '异常单管理', icon: 'chukushenhe' }
      }
    ]
  },
  { // 芯片入库送片管理
    path: '/warehousingSendManage',
    name: 'WarehousingSendManage',
    component: Layout,
    redirect: '/warehousingSendManage/warehousingSendManage',
    alwaysShow: true,
    meta: { title: '入库管理', icon: 'rukuglx' },
    children: [
      {
        path: 'warehousingSendManage',
        name: 'warehousingSendManage',
        component: () => import('@/views/chipManage/warehousingSendManage/warehousingSendManage/index'),
        meta: { title: '入库送片', icon: 'keruku' }
      },
      {
        path: 'warehousingLabelPrint',
        name: 'WarehousingLabelPrint',
        component: () => import('@/views/chipManage/warehousingSendManage/warehousingLabelPrint/index'),
        meta: { title: '标签打印', icon: 'biaoqiandy' }
      },
      {
        path: 'warehousingLabelManage',
        name: 'WarehousingLabelManage',
        component: () => import('@/views/chipManage/warehousingSendManage/warehousingLabelManage/index'),
        meta: { title: '标签管理', icon: 'biaoqiangl' }
      },
      {
        path: 'mappingPrint',
        name: 'MappingPrint',
        component: () => import('@/views/chipManage/warehousingSendManage/mappingPrint/index'),
        meta: { title: 'mapping彩图打印', icon: 'mpcaitudy' }
      },
      {
        path: 'mappingManage',
        name: 'MappingManage',
        component: () => import('@/views/chipManage/warehousingSendManage/mappingManage/index'),
        meta: { title: 'mapping彩图管理', icon: 'mpcaitugl' }
      }
    ]
  },
  {
    path: '/warehousingDataBase',
    name: 'WarehousingDataBase',
    component: Layout,
    redirect: '/warehousingDataBase/square',
    alwaysShow: true,
    meta: { title: '入库数据库', icon: 'rukusjk' },
    children: [
      {
        path: 'square',
        name: 'Square',
        component: () => import('@/views/chipManage/warehousingDataBase/square/index'),
        meta: { title: '方片库', icon: 'fangpk' }
      },
      {
        path: 'circle',
        name: 'Circle',
        component: () => import('@/views/chipManage/warehousingDataBase/circle/index'),
        meta: { title: '圆片库', icon: 'yuanpk' }
      }
    ]
  },
  // 芯片基础信息
  {
    path: '/chipBasicInfo',
    name: 'ChipBasicInfo',
    component: Layout,
    redirect: '/samplingStandard/cowSamplingStandard',
    alwaysShow: true,
    meta: { title: '基础信息', icon: 'jichuxinxi' },
    children: [
      {
        path: '/samplingStandard',
        name: 'SamplingStandard',
        alwaysShow: true,
        component: () => import('@/views/chipManage/chipBasicInfoManage/index'),
        meta: { title: '采样标准设置', icon: 'lvdanxinxsz' },
        redirect: '/samplingStandard/cowSamplingStandard',
        children: [
          {
            path: 'cowSamplingStandard',
            name: 'CowSamplingStandard',
            component: () => import('@/views/chipManage/chipBasicInfoManage/samplingStandard/cowSamplingStandard/index'),
            meta: { title: 'COW采样标准', icon: 'sanjicdm' }
          },
          {
            path: 'cotSamplingStandard',
            name: 'CotSamplingStandard',
            component: () => import('@/views/chipManage/chipBasicInfoManage/samplingStandard/cotSamplingStandard/index'),
            meta: { title: 'COT采样标准', icon: 'sanjicdm' }
          },
          {
            path: 'aoiSamplingStandard',
            name: 'AoiSamplingStandard',
            component: () => import('@/views/chipManage/chipBasicInfoManage/samplingStandard/aoiSamplingStandard/index'),
            meta: { title: 'AOI采样标准', icon: 'sanjicdm' }
          }
        ]
      },
      {
        path: 'cotAbnormalCriteria',
        name: 'CotAbnormalCriteria',
        component: () => import('@/views/chipManage/chipBasicInfoManage/cotAbnormalCriteria/index'),
        meta: { title: 'COT中心异常标准', icon: 'cotyichangbz' }
      },
      {
        path: 'cotGrainCoordinates',
        name: 'cotGrainCoordinates',
        component: () => import('@/views/chipManage/chipBasicInfoManage/cotGrainCoordinates/index'),
        meta: { title: 'COT晶粒坐标设置', icon: 'cotjinglizb' }
      },
      {
        path: '/binSurface',
        name: 'BinSurface',
        alwaysShow: true,
        component: () => import('@/views/chipManage/chipBasicInfoManage/index'),
        meta: { title: 'BIN表', icon: 'bintable' },
        redirect: '/binSurface/circleSurface',
        children: [
          {
            path: 'circleSurface',
            name: 'CircleSurface',
            component: () => import('@/views/chipManage/chipBasicInfoManage/binSurface/circleSurface/index'),
            meta: { title: '圆片BIN', icon: 'sanjicdm' }
          },
          {
            path: 'squareSurface',
            name: 'SquareSurface',
            component: () => import('@/views/chipManage/chipBasicInfoManage/binSurface/squareSurface/index'),
            meta: { title: '方片BIN', icon: 'sanjicdm' }
          },
          {
            path: 'cotCoefficientCorrection',
            name: 'CotCoefficientCorrection',
            component: () => import('@/views/chipManage/chipBasicInfoManage/binSurface/cotCoefficientCorrection/index'),
            meta: { title: 'COT系数校正', icon: 'sanjicdm' }
          }
        ]
      },
      {
        path: 'machineInfo',
        name: 'MachineInfo',
        component: () => import('@/views/chipManage/chipBasicInfoManage/machineInfo/index'),
        meta: { title: '机台信息', icon: 'peizhigl' }
      },
      {
        path: 'grindInfo',
        name: 'GrindInfo',
        component: () => import('@/views/chipManage/chipBasicInfoManage/grindInfo/index'),
        meta: { title: '研磨盘信息', icon: 'MOVCDdapan' }
      },
      {
        path: 'exceptionManage',
        name: 'ExceptionManage',
        component: () => import('@/views/chipManage/chipBasicInfoManage/exceptionManage/index'),
        meta: { title: '异常分类信息', icon: 'baojingguiz' }
      },
      {
        path: 'grindProcessInfo',
        name: 'GrindProcessInfo',
        component: () => import('@/views/chipManage/chipBasicInfoManage/grindProcessInfo/index'),
        meta: { title: '研磨工艺信息', icon: 'gongyifenli' }
      },
      // {
      //   path: 'tensileTestSetting',
      //   name: 'TensileTestSetting',
      //   component: () => import('@/views/chipManage/chipBasicInfoManage/tensileTestSetting/index'),
      //   meta: { title: '拉力测试设置', icon: 'MOVCDszgl' }
      // },
      {
        path: 'customer',
        name: 'customer',
        component: () => import('@/views/chipManage/chipBasicInfoManage/orderBasicInfo/index'),
        meta: { title: '客户管理', icon: 'MOVCDszgl' }
      },
      {
        path: 'electrodeManage',
        name: 'electrodeManage',
        component: () => import('@/views/chipManage/chipBasicInfoManage/electrodeManage/index'),
        meta: { title: '电极材料信息', icon: 'sanjicdm' }
      },
      {
        path: '/codeManage',
        name: 'CodeManage',
        alwaysShow: true,
        component: () => import('@/views/chipManage/chipBasicInfoManage/index'),
        meta: { title: '代码管理', icon: 'xinxisz' },
        redirect: '/codeManage/appearanceClassification',
        children: [
          {
            path: 'appearanceClassification',
            name: 'AppearanceClassification',
            component: () => import('@/views/chipManage/chipBasicInfoManage/codeManage/appearanceClassification/index'),
            meta: { title: '外观分类', icon: 'sanjicdm' }
          },
          {
            path: 'brightnessCode',
            name: 'BrightnessCode',
            component: () => import('@/views/chipManage/chipBasicInfoManage/codeManage/brightnessCode/index'),
            meta: { title: '亮度代码', icon: 'sanjicdm' }
          },
          {
            path: 'voltageCode',
            name: 'VoltageCode',
            component: () => import('@/views/chipManage/chipBasicInfoManage/codeManage/voltageCode/index'),
            meta: { title: '电压代码', icon: 'sanjicdm' }
          },
          {
            path: 'wavelengthCode',
            name: 'WavelengthCode',
            component: () => import('@/views/chipManage/chipBasicInfoManage/codeManage/wavelengthCode/index'),
            meta: { title: '波长代码', icon: 'sanjicdm' }
          },
          {
            path: 'wavelengthFocus',
            name: 'WavelengthFocus',
            component: () => import('@/views/chipManage/chipBasicInfoManage/codeManage/wavelengthFocus/index'),
            meta: { title: '波长集中度', icon: 'sanjicdm' }
          },
          {
            path: 'comprehensiveGradeCode',
            name: 'ComprehensiveGradeCode',
            component: () => import('@/views/chipManage/chipBasicInfoManage/codeManage/comprehensiveGradeCode/index'),
            meta: { title: '综合等级代码', icon: 'sanjicdm' }
          }
        ]
      },
      {
        path: '/labelManage',
        name: 'labelManage',
        alwaysShow: true,
        component: () => import('@/views/chipManage/chipBasicInfoManage/index'),
        meta: { title: '标签管理', icon: 'biaoqiangl' },
        redirect: '/labelManage/circleSurface',
        children: [
          {
            path: 'ygLabel',
            name: 'YgLabel',
            component: () => import('@/views/chipManage/chipBasicInfoManage/labelManage/ygLabel/index'),
            meta: { title: '亿光标签', icon: 'sanjicdm' }
          },
          {
            path: 'jzwLabel',
            name: 'JzwLabel',
            component: () => import('@/views/chipManage/chipBasicInfoManage/labelManage/jzwLabel/index'),
            meta: { title: '佳桌旺标签', icon: 'sanjicdm' }
          },
          {
            path: 'gcLabel',
            name: 'GcLabel',
            component: () => import('@/views/chipManage/chipBasicInfoManage/labelManage/gcLabel/index'),
            meta: { title: '国宸标签', icon: 'sanjicdm' }
          },
          {
            path: 'rqlLabel',
            name: 'RqlLabel',
            component: () => import('@/views/chipManage/chipBasicInfoManage/labelManage/rqlLabel/index'),
            meta: { title: '瑞奇朗标签', icon: 'sanjicdm' }
          }
        ]
      }
    ]
  },
  // // 芯片-月度产能规划接收
  // {
  //   path: '/xpMonthCapacityPlan',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'xpMonthCapacityPlan',
  //       component: () => import('@/views/iqc/xpMonthCapacityPlan/index'),
  //       meta: { title: '月度产能规划接收', icon: 'ceshidaiban' }
  //     }
  //   ]
  // },
  // 仓库管理extension store
  { // 外延仓库管理
    path: '/extensionStorageManage',
    name: 'ExtensionStorageManage',
    component: Layout,
    redirect: '/extensionStorageManage/putInStorage',
    alwaysShow: true,
    meta: { title: '外延仓管理', icon: 'rukuglx' },
    children: [
      {
        path: 'putInStorage',
        name: 'PutInStorage',
        component: () => import('@/views/extensionStorageManage/putInStorage/index'),
        meta: { title: '入库管理', icon: 'ruku' }
      },
      {
        path: 'outStorage',
        name: 'OutStorage',
        component: () => import('@/views/extensionStorageManage/outStorage/index'),
        meta: { title: '出库管理', icon: 'chuku' }
      },
      {
        path: 'outStorageSelect',
        name: 'OutStorageSelect',
        hidden: true,
        component: () => import('@/views/extensionStorageManage/outStorageSelect/index'),
        meta: { title: '出库管理', icon: 'ldscgl' }
      },
      {
        path: '/backStorageManage',
        name: 'BackStorageManage',
        alwaysShow: true,
        component: () => import('@/views/extensionManage/wyBasicInfoManage/index'),
        meta: { title: '退库管理', icon: 'tuikgl' },
        redirect: '/backStorageManage/backStorage',
        children: [
          {
            path: 'backStorage',
            name: 'BackStorage',
            component: () => import('@/views/extensionStorageManage/backStorageManage/backStorage/index'),
            meta: { title: '退库', icon: 'tuiku' }
          },
          {
            path: 'productionBackStorage',
            name: 'ProductionBackStorage',
            component: () => import('@/views/extensionStorageManage/backStorageManage/productionBackStorage/index'),
            meta: { title: '生产退库', icon: 'shengctk' }
          }
        ]
      },
      {
        path: '/repertoryManage',
        name: 'RepertoryManage',
        alwaysShow: true,
        component: () => import('@/views/extensionManage/wyBasicInfoManage/index'),
        meta: { title: '库存管理', icon: 'kucungl' },
        redirect: '/repertoryManage/boxLocationManage',
        children: [
          {
            path: 'boxLocationManage',
            name: 'BoxLocationManage',
            component: () => import('@/views/extensionStorageManage/repertoryManage/boxLocationManage/index'),
            meta: { title: '盒位管理', icon: 'heweigl' }
          },
          {
            path: 'cabinetLocationManage',
            name: 'CabinetLocationManage',
            component: () => import('@/views/extensionStorageManage/repertoryManage/cabinetLocationManage/index'),
            meta: { title: '柜位管理', icon: 'guiweigl' }
          }
        ]
      },
      {
        path: 'inventoryInquiry',
        name: 'InventoryInquiry',
        component: () => import('@/views/extensionStorageManage/inventoryInquiry/index'),
        meta: { title: '库存查询', icon: 'kucunchaxun' }
      },
      {
        path: 'basicSetting',
        name: 'BasicSetting',
        component: () => import('@/views/extensionStorageManage/basicSetting/index'),
        meta: { title: '基础设置', icon: 'jichuxinxi' }
      }
    ]
  },
  // 芯片仓管理
  {
    path: '/chipStoreManage',
    name: 'chipStoreManage',
    component: Layout,
    redirect: '/chipStoreManage/chipPutInStorage',
    alwaysShow: true,
    meta: { title: '芯片仓管理', icon: 'rukuglx' },
    children: [
      {
        path: 'chipPutInStorage',
        name: 'ChipPutInStorage',
        component: () => import('@/views/chipStoreManage/chipPutInStorage/index'),
        meta: { title: '入库管理', icon: 'ruku' }
      },
      {
        path: 'retreatStorage',
        name: 'RetreatStorage',
        component: () => import('@/views/chipStoreManage/retreatStorage/index'),
        meta: { title: '退库管理', icon: 'tuikgl' }
      },
      {
        path: 'chipOutStorage',
        name: 'ChipOutStorage',
        component: () => import('@/views/chipStoreManage/chipOutStorage/index'),
        meta: { title: '出库管理', icon: 'chuku' }
      },
      {
        path: 'splitPackage',
        name: 'SplitPackage',
        hidden: true,
        component: () => import('@/views/chipStoreManage/splitPackage/index'),
        meta: { title: '分包管理', icon: 'chuku' }
      },
      // {
      //   path: 'reworkOrder',
      //   name: 'ReworkOrder',
      //   component: () => import('@/views/chipStoreManage/reworkOrder/index'),
      //   meta: { title: '返工单管理', icon: 'chuku' }
      // },
      {
        path: '/stockCheck',
        name: 'stockCheck',
        alwaysShow: true,
        component: () => import('@/views/extensionManage/wyBasicInfoManage/index'),
        meta: { title: '库存查询', icon: 'kucunchaxun' },
        redirect: '/stockCheck/squareChip',
        children: [
          {
            path: 'squareChip',
            name: 'SquareChip',
            component: () => import('@/views/extensionManage/wyBasicInfoManage/index'),
            meta: { title: '方片库', icon: 'fangpk' },
            children: [
              {
                path: 'squareZp',
                name: 'squareZp',
                component: () => import('@/views/chipStoreManage/stockCheck/squareZp/index'),
                meta: { title: '方片正品库', icon: 'sanjicdm' }
              },
              {
                path: 'squareHh',
                name: 'squareHh',
                component: () => import('@/views/chipStoreManage/stockCheck/squareHh/index'),
                meta: { title: '方片混合Bin库', icon: 'sanjicdm' }
              }
            ]
          },
          {
            path: 'circleChip',
            name: 'CircleChip',
            component: () => import('@/views/chipStoreManage/stockCheck/circleChip/index'),
            meta: { title: '圆片库', icon: 'yuanpk' }
          }
        ]
      },
      {
        path: 'stockControl',
        name: 'StockControl',
        component: () => import('@/views/chipStoreManage/stockControl/index'),
        meta: { title: '库存管理', icon: 'kucungl' }
      },
      {
        path: 'chipBasicSetting',
        name: 'ChipBasicSetting',
        component: () => import('@/views/chipStoreManage/chipBasicSetting/index'),
        meta: { title: '基础设置', icon: 'jichuxinxi' }
      }
    ]
  },
  {
    path: '/custormization',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'custormization',
        component: () => import('@/views/orderManage/custormization/index'),
        meta: { title: '客制化管理', icon: 'lvdanxinxsz' }
      }
    ]
  },
  {
    path: '/orderManagement',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'orderManagement',
        component: () => import('@/views/orderManage/orderManagement/index'),
        meta: { title: '订单管理', icon: 'lishibb' }
      }
    ]
  },
  {
    path: '/orderBasicInfo',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'orderBasicInfo',
        component: () => import('@/views/orderManage/orderBasicInfo/index'),
        meta: { title: '基础信息管理', icon: 'jichuxinxi' }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
