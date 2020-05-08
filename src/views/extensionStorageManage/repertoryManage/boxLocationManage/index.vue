<template>
  <PageHeaderLayout >
    <div class="app-container" style="padding-top: 0px">
      <el-row>
        <el-col :span="11" class="left">
          <div class="module">
            <!--<div class="moduleTitle">原盒号</div>-->
            <div class="input-item" style="margin-right: 0">
              <span class="input-title" style="width: 50px;">原盒号 </span>
              <el-input v-model="leftBoxNo" class="search-input search-input-short" placeholder="请输入原盒号" size="small" maxlength="20" clearable/>
            </div>
            <div class="input-item" style="margin-right: 0">
              <span class="input-title">WaferID </span>
              <el-input v-model="leftWaferId" class="search-input search-input-short" placeholder="请输入WaferID" size="small" maxlength="20" clearable/>
            </div>
            <div class="input-item" style="width: 80px;margin-right: 6px;float:right;">
              <el-button
                :disabled="leftBoxNo === '' && leftWaferId === ''"
                class="margin-left"
                size="small"
                type="primary"
                icon="el-icon-search"
                @click="handleSearch(1)" >查 询</el-button> </div>
          </div>
          <el-table
            ref="waferLtTable"
            :data="leftList"
            row-key="id"
            class="box-table"
            height="calc(100vh - 195px)"
            element-loading-text="拼命加载中"
            highlight-current-row
            border
            fit
            @selection-change="waferCurrentChange"
            @row-click="leftRowClick"
          >
            <el-table-column
              type="selection"
              width="70"/>
            <el-table-column align="center" label="库存片位" width="80">
              <template slot-scope="scope">
                {{ scope.$index+1 }}
              </template>
            </el-table-column>
            <el-table-column label="WaferID" align="center" prop="waferId" width="120" show-overflow-tooltip/>
            <el-table-column label="Laser_Mark" align="center" prop="laserMark" show-overflow-tooltip/>
            <!--<el-table-column label="操作" align="center" prop="">
              <template slot-scope="scope">
                <i @click="handleUp(leftList, scope.$index)"><svg-icon style="color: #009494;font-size: 20px;cursor: pointer;" icon-class="top" /></i>
                <i @click="handleDown(leftList, scope.$index)"><svg-icon style="color: #009494;font-size: 20px;cursor: pointer;" icon-class="bottom" /></i>
              </template>
            </el-table-column>-->
          </el-table>
        </el-col>
        <el-col :span="2" style="text-align: center;font-size: 36px;color: #009494">
          <div class="to-left" style="margin-top: 240px;cursor: pointer;" @click="toLeft">
            <svg-icon icon-class="left"/>
          </div>
          <div style="cursor: pointer;" @click="toRight">
            <svg-icon icon-class="right"/>
          </div>
          <div style="margin-top: 80px">
            <el-button
              :disabled="rightList.length === 0 || leftList.length === 0"
              size="small"
              type="primary"
              icon="el-icon-check"
              @click="handleSubmit"
            > 保存</el-button>
          </div>
        </el-col>
        <el-col :span="11" class="right">
          <div class="module">
            <!--<div class="moduleTitle">目标盒号</div>-->
            <div class="input-item" style="margin-right: 10px">
              <span class="input-title">目标盒号 </span>
              <el-input v-model="rightBoxNo" class="search-input search-input-short" placeholder="请输入目标盒号" size="small" maxlength="20" clearable/>
            </div>
            <div class="input-item" style="margin-right: 0">
              <span class="input-title">WaferID </span>
              <el-input v-model="rightWaferId" class="search-input search-input-short" placeholder="请输入WaferID" size="small" maxlength="20" clearable/>
            </div>
            <div class="input-item" style="width: 80px;margin-right: 7px;float:right;">
              <el-button
                :disabled="rightBoxNo === '' && rightWaferId === ''"
                class="margin-left"
                size="small"
                type="primary"
                icon="el-icon-search"
                @click="handleSearch(2)" >查 询</el-button> </div>
          </div>
          <el-table
            ref="waferRtTable"
            :data="rightList"
            row-key="id"
            class="box-table"
            height="calc(100vh - 195px)"
            element-loading-text="拼命加载中"
            highlight-current-row
            border
            fit
            @selection-change="waferRightCurrentChange"
            @row-click="rightRowClick"
          >
            <el-table-column
              type="selection"
              width="70"/>
            <el-table-column align="center" label="库存片位" width="80">
              <template slot-scope="scope">
                {{ scope.$index+1 }}
              </template>
            </el-table-column>
            <el-table-column label="WaferID" align="center" prop="waferId" width="120" show-overflow-tooltip/>
            <el-table-column label="Laser_Mark" align="center" prop="laserMark" show-overflow-tooltip/>
            <!--<el-table-column label="操作" align="center" prop="">
              <template slot-scope="scope">
                <i @click="handleUp(rightList, scope.$index)"><svg-icon style="color: #009494;font-size: 20px;cursor: pointer;" icon-class="top" /></i>
                <i @click="handleDown(rightList, scope.$index)"><svg-icon style="color: #009494;font-size: 20px;cursor: pointer;" icon-class="bottom" /></i>
              </template>
            </el-table-column>-->
          </el-table>
        </el-col>
      </el-row>
    </div>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .site-table>>> .cell{
    line-height: 37px;
  }
  .site-table>>> td{
    height: 37px;
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
  .search-input{
    width: 150px;
  }
  .short-input{
    width: 126px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 130px);
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
  .input-title-short{
    width: 50px !important;
  }
  .search-input-short{
    width: 65%;
  }
  .module-title-text{
    margin-bottom: 10px;
  }
  .input-container{
    padding: 10px;
    border: 1px solid #b2dfdf;
    padding-right: 0;
    background: #edf7f7;
    margin: 10px 0;
  }
  .input-container .input-title{
    width: 105px;
    font-size: 18px;
  }
  .input-container .input-title-short{
    width: 70px;
    font-size: 18px;
    font-weight: bold;
  }
  .input-container>>> .el-input.is-disabled .el-input__inner {
    background-color: #fff;
    border-color: #E4E7ED;
    cursor: not-allowed;
    font-size: 14px;
    color: #494949;
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
  .abnormal-cause>>> .el-textarea__inner{
    height: 356px!important;
  }
  .module{
    position: relative;
    height: 50px;
    width: 100%;
  }
  .moduleTitle{
    position: absolute;
    top: -13px;
    left: 16px;
    background: #fff;
    padding: 5px 15px;
    font-weight: bold;
    font-size: 14px;
    text-align: center;
  }
  .input-title{
    width: 62px;
  }
  .input-item{
    float: left;
    margin-top: 10px;
    margin-right: 10px;
    width: 40%;
  }
  .box-table>>> td .cell{
    line-height: 27px !important;
    height: 27px !important;
  }
  .box-table>>> th .cell{
    line-height: 38px !important;
    height: 38px !important;
  }
  .box-table>>> td{
    height: 27px !important;
  }
  @media (max-width: 1600px) {
    .box-table>>> td .cell{
      line-height: 20px !important;
      height: 20px !important;
    }
    .box-table>>> th .cell{
      line-height: 33px !important;
      height: 33px !important;
    }
    .box-table>>> td{
      height: 20px !important;
    }
  }
  @media (max-width: 1366px) {
    .box-table>>> td .cell{
      line-height: 15px !important;
      height: 15px !important;
    }
    .box-table>>> th .cell{
      line-height: 26px !important;
      height: 26px !important;
    }
    .box-table>>> td{
      height: 15px !important;
    }
  }
</style>
