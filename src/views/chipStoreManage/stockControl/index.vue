<template>
  <PageHeaderLayout >
    <div class="container">
      <div class="left-box">
        <div class="module-container" style="position: absolute;top: 0;left: 0;width: 100%;z-index: 1003">
          <div class="module-title">
            <div class="module-title-text">柜位</div>
          </div>
          <div class="module-content" style="padding-right: 0;overflow: auto; padding-bottom: 0px">
            <!--v-dragging="{ item: item, list: cabinetList, group: 'cabinet' }"-->
            <div v-for="item in cabinetList" :key="item.id" :class="{ 'cabinetalert':item.count > item.alarm }" class="cabinet" @click="selectCabinet(item, $event)">
              <div style="position: absolute;">
                <span class="icon-span edit-icon" @click="handleEdit(item)">
                  <svg-icon icon-class="bianji01"/>
                </span>
                <span class="icon-span" @click="handleDelete(item)">
                  <svg-icon icon-class="guanbi"/>
                </span>
              </div>
              <div class="cabinet-name">{{ item.name }}</div>
              <div class="cabinet-num"><span>{{ item.count === null ? 0 : item.count }}</span> / <span>{{ item.capacity }}</span></div>
            </div>
            <div class="cabinet" @click="handleAdd"><svg-icon icon-class="addCabinet" style="font-size: 70px;margin-top: 18px"/></div>
          </div>
        </div>
      </div>
      <div class="right-box">
        <el-row :gutter="10">
          <el-col :span="13">
            <div class="right-container">
              <div style="overflow: hidden">
                <div class="input-item" style="margin-right: 0;margin-top: 0px">
                  <span class="input-title" style="width: 35px">包号 </span>
                  <el-input v-model="packageNum" class="search-input" style="width: 140px" size="mini" maxlength="20" clearable/>
                  <el-button
                    class="margin-left"
                    size="mini"
                    type="primary"
                    icon="el-icon-search"
                    @click="handleSearchBox" >查 询</el-button>
                </div>
              </div>
              <!--<div class="box-container">
                <div class="box-container-item theader">
                  <div class="item-selection"/>
                  <div class="item-sort">序号</div>
                  <div class="item-package">包号</div>
                  <div class="item-package-num">数量</div>
                </div>
                <div class="box-scoll-container">
                  <div v-for="(item, index) in list" :key="item.boxNo" :class="{'active-row' : activeIndex === item.boxNo}" class="box-container-item" @click="rowClick(item)">
                    <div class="item-selection"><el-checkbox v-model="item.status"/></div>
                    <div class="item-sort">{{ index + 1 }}</div>
                    <div class="item-package">{{ item.boxNo }}</div>
                    <div class="item-package-num">{{ item.count }}</div>
                  </div>
                </div>
              </div>-->
              <div class="ark-table" style="width: 100%; height: 95%;user-select: none;">
                <pl-table
                  ref="waferTable"
                  :datas="list"
                  :row-height="34"
                  style="height: 100%"
                  border
                  fit
                  highlight-current-row
                  class="broad-scrollbar-table margin-top"
                  header-drag-style
                  use-virtual
                  @cell-mouse-enter="hoverCall"
                  @selection-change="selectionChange"
                >
                  <pl-table-column type="selection" width="45"/>
                  <pl-table-column align="center" label="序号" width="45">
                    <template slot-scope="scope">
                      {{ scope.$index+1 }}
                    </template>
                  </pl-table-column>
                  <pl-table-column label="包号" align="center" prop="boxNo" width="140" show-overflow-tooltip/>
                  <pl-table-column label="数量" align="center" prop="count" show-overflow-tooltip/>
                </pl-table>
              </div>
            </div>
          </el-col>
          <el-col :span="11">
            <div class="right-container">
              <div class="overflow-hidden">
                <el-button
                  :disabled="selectedBox.length < 2"
                  class="margin-left float-right"
                  size="mini"
                  type="primary"
                  @click="handleMerge">
                  <svg-icon icon-class="add"/>
                  合 并</el-button>
                <el-button
                  :disabled="selectedBox.length === 0"
                  class="float-right"
                  size="mini"
                  type="primary"
                  @click="handleMove" ><svg-icon icon-class="yidongxx"/> 移 动</el-button>
              </div>
              <el-table
                v-loading="listLoading"
                :data="waferList"
                class="margin-top box-table"
                element-loading-text="拼命加载中"
                height="calc(100vh - 200px)"
                border
              >
                <el-table-column label="项次号" align="center" prop="sequence" width="100"/>
                <el-table-column label="片号" align="center" prop="code"/>
              </el-table>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div v-if="moveing" class="modal-box"/>
    <div id="points">
      <div class="pointOuter pointPre"><div class="point-inner"/></div>
      <div class="pointOuter pointPre"><div class="point-inner"/></div>
      <div class="pointOuter pointPre"><div class="point-inner"/></div>
      <div class="pointOuter pointPre"><div class="point-inner"/></div>
      <div class="pointOuter pointPre"><div class="point-inner"/></div>
      <div class="pointOuter pointPre"><div class="point-inner"/></div>
      <div class="pointOuter pointPre"><div class="point-inner"/></div>
      <div class="pointOuter pointPre"><div class="point-inner"/></div>
      <div class="pointOuter pointPre"><div class="point-inner"/></div>
      <div class="pointOuter pointPre"><div class="point-inner"/></div>
    </div>
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="selectDialogVisible"
      title="提示"
      width="600px"
      class="selectDialog"
      @close="handleClose('cabinetForm')">
      <span style="font-weight: bold;font-size: 20px;color: #009494">是否确认将以下 {{ selectedBox.length }} 项移动到 {{ cabinetName }} 柜？</span>
      <el-table
        :data="selectedBox"
        class="margin-top box-table"
        element-loading-text="拼命加载中"
        height="500"
        border
      >
        <el-table-column label="序号" align="center" prop="boxNo" width="60"><template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
        </el-table-column>
        <el-table-column label="包号" align="center" prop="boxNo"/>
        <el-table-column label="数量" align="center" prop="count"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitSelect">确 定</el-button>
        <el-button @click="cancelMove">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="mergeDialogVisible"
      title="提示"
      width="600px"
      class="selectDialog"
      @close="handleClose('cabinetForm')">
      <span style="font-weight: bold;font-size: 20px;color: #009494">请选择目标包</span>
      <el-table
        :data="mergeList"
        class="margin-top box-table"
        element-loading-text="拼命加载中"
        height="500"
        border
        @row-click="mergeRowClick"
      >
        <el-table-column align="center" prop="status" width="60">
          <template slot-scope="scope">
            <el-radio :label="scope.row.boxNo" v-model="radio">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column label="序号" align="center" prop="boxNo" width="60"><template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
        </el-table-column>
        <el-table-column label="包号" align="center" prop="boxNo"/>
        <el-table-column label="数量" align="center" prop="count"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitMerge">确 定</el-button>
        <el-button @click="cancelMerge">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible"
      title="添加"
      width="500px"
      @close="handleClose('cabinetForm')">
      <el-form ref="cabinetForm" :model="cabinetForm" :rules="rules" status-icon label-width="80px" label-position="right">
        <el-form-item label="柜位编号" prop="code">
          <el-input v-model="cabinetForm.code" type="text" maxlength="5" placeholder="请输入柜位编号"/>
        </el-form-item>
        <el-form-item label="储存值" prop="storedValue">
          <el-input v-model="cabinetForm.storedValue" type="text" maxlength="6" onkeyup="this.value=this.value.replace(/[^\d]/g,'')" placeholder="请输入储存值" @input="storedValueChange"/>
        </el-form-item>
        <el-form-item label="报警值" prop="alarmValue">
          <el-input v-model="cabinetForm.alarmValue" type="text" maxlength="6" onkeyup="this.value=this.value.replace(/[^\d]/g,'')" placeholder="请输入报警值" @input="alarmValueChange"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('cabinetForm')">确 定</el-button>
        <el-button @click="resetForm('cabinetForm')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="编辑"
      width="500px"
      @close="handleClose('cabinetForm')">
      <el-form ref="cabinetForm" :model="cabinetForm" :rules="rules" status-icon label-width="80px" label-position="right">
        <el-form-item label="柜位编号" prop="code">
          <el-input v-model="cabinetForm.code" type="text" maxlength="5" placeholder="请输入柜位编号"/>
        </el-form-item>
        <el-form-item label="储存值" prop="storedValue">
          <el-input v-model="cabinetForm.storedValue" type="text" maxlength="6" onkeyup="this.value=this.value.replace(/[^\d]/g,'')" placeholder="请输入储存值" @input="storedValueChange"/>
        </el-form-item>
        <el-form-item label="报警值" prop="alarmValue">
          <el-input v-model="cabinetForm.alarmValue" type="text" maxlength="6" onkeyup="this.value=this.value.replace(/[^\d]/g,'')" placeholder="请输入报警值" @input="alarmValueChange"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEditForm('cabinetForm')">确 定</el-button>
        <el-button @click="resetForm('cabinetForm')">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .ark-table>>> .el-checkbox{
    margin-left: 15px;
  }
  .ark-table>>> .el-table--scrollable-x{
    height: calc(100vh - 200px) !important;
  }
  .ark-table>>> .el-table__body-wrapper, .ark-table>>> .el-table__virtual-wrapper{
    height: calc(100vh - 234px) !important;
  }
  .box-container{
    margin-top: 10px;
    border: 1px solid #b2dfdf;
    width: 100%;
    overflow-y: auto;
  }
  .box-scoll-container{
    height: calc(100vh - 234px);
  }
  .box-container-item{
    overflow: hidden;
    border-bottom: 1px solid #b2dfdf;
  }
  .box-container-item.theader{
    background: #d2ecec;
    border-bottom: 2px solid #b2dfdf;
  }
  .box-container-item>>> .el-checkbox{
    margin-left: 0;
  }
  .box-container-item> div{
    float: left;
    height: 30px;
    line-height: 30px;
    text-align: center;
  }
  .active-row{
    background: #CCEAEA;
  }
  .item-selection{
    width: 15%;
  }
  .item-sort{
    width: 15%;
    border-left: 1px solid #b2dfdf;
    border-right: 1px solid #b2dfdf;
  }
  .item-package{
    width: 50%;
    border-right: 1px solid #b2dfdf;
  }
  .item-package-num{
    width: 20%;
  }
  /** 运动小球 *!*/
  .pointPre {  /* 动画的小球 */
    display: none;
  }
  .pointOuter {
    position: absolute;
    z-index: 200000;
    /* 当小球抛出时遵循贝塞尔曲线过渡 */
    -webkit-transition: all 1s cubic-bezier(0.39,-0.4,0.83,0.23) 0s;
    transition: all 1s cubic-bezier(0.39,-0.4,0.83,0.23) 0s;
  }

  .point-inner {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: #009494;
    /* 过渡属性名称 过渡时间 过渡曲线 延迟时间 */
    transition: all 1s ease 0s;
    -webkit-transition: all 1s ease 0s;
  }
  .cabinet{
    float: left;
    width: 112px;
    height: 112px;
    border: 1px solid #86cccc;
    background: #d2ecec;
    margin-bottom: 15px;
    margin-right: 15px;
    text-align: center;
    cursor: pointer;
  }
  .cabinet.cabinetalert{
    background: #f56c6c;
    color: #fff !important;
  }
  .cabinet.cabinetalert .cabinet-name, .cabinet.cabinetalert .icon-span{
    color: #fff !important;
  }
  .icon-span{
    position: absolute;
    top: 5px;
    right: -100px;
    color: #009494;
    font-size: 18px;
    cursor: pointer;
  }
  .edit-icon{
    right: -25px;
  }
  .cabinet-name{
    font-size: 30px;
    color: #009494;
    font-weight: bold;
    margin-top: 30px;
  }
  .cabinet-num{
    margin-top: 5px;
  }
  .modal-box{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .5);
    z-index: 1002;
  }
  .cut-bar{
    height: 10px;
    width: 501px;
    background: #e5e5e5;
    position: absolute;
    top: 60px;
    left: 0;
    z-index: 10;
  }
  .left-box{
    float: left;
    height: calc(100vh - 175px);
    width: 47%;
    position: relative;
  }
  .right-box{
    padding-left: 10px;
    float: left;
    width: 53%;
    position: relative;
  }
  .box-table>>> .cell{
    line-height: 30px;
  }
  .box-table>>> td{
    height: 30px;
  }
  .padding-dialog>>> .cell{
    line-height: 28px;
  }
  .padding-dialog>>> td{
    height: 28px;
  }
  .padding-dialog>>> .el-dialog__footer{
    padding-top: 0;
  }
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 10px;
    top: 3px;
  }
  .input-item{
    float: left;
    margin-right: 10px;
  }
  .input-title{
    width: 35px;
  }
  .search-input{
    width: 136px;
  }
  .module-content{
    position: relative;
    height: calc(100vh - 175px);
  }
  .select-thead-btn{
    width: 45px;
    height: 42px;
    position: absolute;
    z-index: 200;
    background: rgba(0,0,0,.2);
    right: 15px;
    top: 15px;
  }
  .select-thead{
    width: 180px;
    height: 335px;
    border: 1px solid #e2e2e2;
    position: absolute;
    z-index: 200;
    background: #fff;
    right: 15px;
    top: 60px;
  }
  .options-box{
    height: 280px;
    overflow: auto;
    margin-bottom: 10px;
  }
  .dialog-sub-title{
    line-height: 40px;
    text-align: center;
    font-weight: bold;
    font-size: 26px;
    color: #009494;
  }
  .cut-line{
    border-bottom: 1px solid #e2e2e2;
    margin-bottom: 10px;
    margin-top: 10px;
  }
  .left-content{
    border: 1px solid #b2dfdf;
    margin-top: 10px;
    padding: 5px 10px 10px 10px;
  }
  .dialog-input{
    width: 232px;
  }
  .dialog-input-base{
    width: 217px;
  }
  .dialog-input-short{
    width: 182px;
  }
  .module-title-text{
    margin-bottom: 10px;
  }
  .padding-dialog>>> .el-dialog__footer{
    text-align: center;
  }
  .submit-btn{
    background: #1abb9d; border-color: #1abb9d;padding: 20px 40px;margin-left: 80px
  }
  .abnormal-cause{
    position: absolute;
    width: 105px;
    top: 63px;
    background: #fff;
    right: 13px;
  }
  .right-container{
    background: #fff;
    padding: 15px;
    padding-top: 10px;
    height: calc(100vh - 133px);
  }
  .selectDialog >>> .el-dialog__body{
    padding-top: 10px;
  }
  .selectDialog>>> .el-radio{
    margin-left: 18px;
  }
</style>
