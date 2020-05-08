<template>
  <PageHeaderLayout >
    <div class="container">
      <div class="left-box">
        <div class="module-container">
          <div class="module-title">
            <div class="module-title-text">盒号</div>
          </div>
          <div class="module-content" style="padding-bottom: 10px;font-weight:bold">
            <div class="input-item">
              <span class="input-title">柜位 </span>
              <el-select v-model="searchKeys.gw" class="search-input" size="small" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in cabinetList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
              <!--<el-input v-model="searchKeys.hh" class="search-input" size="small" maxlength="20" clearable/>-->
            </div>
            <div class="input-item">
              <span class="input-title">盒号 </span>
              <el-input v-model="searchKeys.hh" class="search-input" size="small" maxlength="20" clearable/>
            </div>
            <el-button
              :disabled="searchKeys.gw === '' && searchKeys.hh === ''"
              class="float-left margin-left"
              size="small"
              type="primary"
              icon="el-icon-search"
              @click="handleSearch" >查 询</el-button>
            <div class="cut-bar"/>
            <el-button
              :disabled="selectedRow.length === 0"
              style="margin-top: 35px"
              size="small"
              type="primary"
              @click="handleMove" ><svg-icon icon-class="yidongxx"/> 移 动</el-button>
            <el-table
              v-loading="listLoading"
              ref="boxTable"
              :data="list"
              class="margin-top box-table"
              element-loading-text="拼命加载中"
              height="calc(100vh - 315px)"
              border
              @selection-change="selectionChange"
              @row-click="rowClick">
              <el-table-column
                type="selection"
                width="70"/>
              <el-table-column label="盒号" align="center" prop="boxNo"/>
              <el-table-column label="数量" align="center" prop="count"/>
            </el-table>
          </div>
        </div>
      </div>
      <div class="right-box">
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
              <div class="cabinet-num"><span>{{ item.count }}</span> / <span>{{ item.capacity }}</span></div>
            </div>
            <div class="cabinet" @click="handleAdd"><svg-icon icon-class="addCabinet" style="font-size: 70px;margin-top: 18px"/></div>
          </div>
        </div>
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
    width: 500px;
    position: relative;
  }
  .right-box{
    margin-left: 510px;
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
</style>
