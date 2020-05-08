<template>
  <PageHeaderLayout >
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        height="calc(100vh - 210px)"
        highlight-current-row
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="电极名称" align="center" prop="electrode"/>
        <el-table-column label="电极材料" align="center" prop="code">
          <template slot-scope="scope">
            <el-select :disabled="!scope.row.isEdit" v-model="scope.row.materialIdinfos" style="width:90%" size="mini" multiple placeholder="请选择">
              <el-option
                v-for="item in selectList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="status">
          <template slot-scope="scope">
            <el-button
              v-if="!scope.row.isEdit"
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="setEdit(scope.$index)"
            > 编辑</el-button>
            <el-button
              v-if="scope.row.isEdit"
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="save(scope.row)"
            > 保存</el-button>
            <el-button
              v-if="scope.row.isEdit"
              size="mini"
              @click="setEdit(scope.$index)"
            >取消</el-button>
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
    </div>
  </PageHeaderLayout>
</template>

<script src="./orderBasicInfo.js"></script>

<style scoped>
  .app-container{
    position: relative;
    height: calc(100vh - 132px);
  }
  .tab-control span{
    line-height: 50px;
  }
  .el-checkbox {
    margin-left: 0px;
  }
  .header-search {
    margin: 10px 0;
  }
.input-item{
    float: left;
    margin-right: 10px;
    margin-top: 0;
  }
  .search-input{
    width: 180px;
  }
    .close {
      position: absolute;
      z-index: 10;
      right: -800px;
      top: 0;
      width: 800px;
      height: 100%;
      background: #fff;
      transition: all linear 0.3s;
    }
    .open {
      position: absolute;
      z-index: 10;
      right: 0;
      top: 0;
      width: 800px;
      height: 100%;
      background: #b2dfdf;
      transition: all linear 0.3s;
    }
    .header {
      margin: 0 20px;
      height: 56px;
      border-bottom: 1px solid #dddddd;
    }
    p {
      margin-top: 18px;
    }

</style>
