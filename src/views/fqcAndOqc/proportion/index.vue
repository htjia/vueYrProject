<template>
  <PageHeaderLayout >
    <div class="app-container">
      <el-table
        :data="list"
        element-loading-text="拼命加载中"
        border
        fit>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="检验项" align="center" prop="code"/>
        <el-table-column label="抽检比例（%）" align="center" prop="name">
          <template slot-scope="scope">
            <span v-if="scope.row.edit">
              <el-input v-model="scope.row.name" style="width: 90%" size="small" onkeyup="this.value=this.value.replace(/[^\d]/g,'')" maxlength="3" clearable @input="blInput(scope.row)"/> %
            </span>
            <span v-else>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="mandataryName">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.edit === false"
              size="mini"
              icon="el-icon-edit"
              type="primary"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              v-if="scope.row.edit === true"
              size="mini"
              icon="el-icon-check"
              type="primary"
              @click="handleSubmitItem(scope.row)"
            >保存</el-button>
            <el-button
              v-if="scope.row.edit === true"
              size="mini"
              icon="el-icon-close"
              type="danger"
              @click="handleCancel(scope.row)"
            >取消</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </PageHeaderLayout>
</template>

<script src="./proportion.js"></script>

<style scoped>
  .app-container{
    position: relative;
    height: calc(100vh - 132px);
  }
  .el-checkbox {
    margin-left: 0px;
  }
</style>
