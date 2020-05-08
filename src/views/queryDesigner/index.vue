<template>
  <PageHeaderLayout >
    <!-- <div class="header-search-add">
      <span class="has-margin">查询名称 </span>
      <el-input v-model="name" placeholder="请输入查询名称" size="small" style="width: 260px" maxlength="20" clearable/>
      <el-button size="small" style="margin-left: 10px" type="primary" icon="el-icon-search" @click="handleSearch" >查 询</el-button>
      <el-button
        size="small"
        class="float-right-btn"
        type="primary"
        @click="handleAdd"><svg-icon icon-class="add"/> 添 加</el-button>
    </div>-->
    <HeaderSearchAdd placeholder-text = "请输入角色名称" @handleSearch="handleSearch" @handleAdd="handleAdd"/>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        height="calc(100vh - 284px)"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 + ((pageNum-1)*pageSize) }}
          </template>
        </el-table-column>
        <el-table-column label="名称" align="center" prop="mandataryName">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="编码" align="center" prop="code"/>
        <el-table-column label="修改人" align="center" prop="status">
          <template slot-scope="scope">
            {{ scope.row.creatorName }}
          </template>
        </el-table-column>
        <el-table-column label="修改时间" align="center" prop="status">
          <template slot-scope="scope">
            {{ scope.row.creatTime }}
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="status">
          <template slot-scope="scope">
            {{ scope.row.remark }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="450">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
            <el-button size="mini" @click="getListPreview(scope.row.id)"><svg-icon icon-class="search"/> 数据查看</el-button>
            <!-- <el-button size="mini" icon="el-icon-setting" type="info" @click="sqlSet(scope.row)">数据导出</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="pageNum"
        :page-sizes="[15, 30, 40]"
        :page-size="pageSize"
        :total="totalPage"
        class="pagination"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div>
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible"
      title="添加"
      width="1200px"
      @close="handleClose('findForm')">
      <div>
        <el-form ref="findForm" :model="findForm" :rules="rules" status-icon label-width="100px" label-position="right">
          <el-row>
            <el-col :span="8">
              <el-form-item label="查询名称 " prop="name">
                <el-input v-model="findForm.name" placeholder="请输入查询名称" size="small" style="width: 200px" maxlength="100" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="编号 " prop="code">
                <el-input v-model="findForm.code" placeholder="请输入编号" size="small" style="width: 150px" maxlength="10" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="备注 ">
                <el-input v-model="findForm.remark" placeholder="请输入备注名称" size="small" style="width: 350px" maxlength="255" clearable/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div>
        <el-row>
          <el-col :span="6">
            <div style="border: 1px solid #666;margin-top: 15px;padding: 15px;height:500px">
              <el-input v-model="filterText" placeholder="输入关键字进行过滤" style="margin-bottom:15px">&nbsp;</el-input>
              <el-tree ref="tree2" :data="tree" :props="defaultProps" :filter-node-method="filterNode" class="filter-tree" style="height: 415px;overflow: auto;" default-expand-all @node-click="handleNodeClick">&nbsp;</el-tree>
            </div>
          </el-col>
          <el-col :span="18">
            <div style="border: 1px solid #666;border-left: 0px;margin-top: 15px;padding: 15px;height:500px">
              <el-tabs v-model="activeIndex" type="border-card" @tab-click="handleSelect">
                <el-tab-pane label="可视化定制" name="first" style="height:400px;overflow:auto">
                  <el-tabs v-model="activeName" type="card" >
                    <el-tab-pane label="查询内容" name="first1">
                      <el-table
                        v-loading="listLoading"
                        :data="list1"
                        element-loading-text="拼命加载中"
                        border
                        fit
                        stripe>
                        <el-table-column align="center" label="字段中文名">
                          <template slot-scope="scope">
                            {{ scope.row.columnCn }}
                          </template>
                        </el-table-column>
                        <el-table-column label="表中文名" align="center">
                          <template slot-scope="scope">
                            {{ scope.row.tableCn }}
                          </template>
                        </el-table-column>
                        <el-table-column label="字段" align="center">
                          <template slot-scope="scope">
                            {{ scope.row.columnEn }}
                          </template>
                        </el-table-column>
                        <el-table-column label="表名" align="center">
                          <template slot-scope="scope">
                            {{ scope.row.tableEn }}
                          </template>
                        </el-table-column>
                        <el-table-column label="别名" align="center">
                          <template slot-scope="scope">
                            {{ scope.row.alias }}
                          </template>
                        </el-table-column>
                        <el-table-column label="函数" align="center">
                          <template slot-scope="scope">
                            <el-select v-model="scope.row.func" placeholder="选择函数" size="mini" style="width: 110px" filterable>
                              <el-option
                                v-for="item in functionList"
                                :key="item.key"
                                :label="item.value"
                                :value="item.key"/>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center">
                          <template slot-scope="scope">
                            <el-button size="mini" type="danger" icon="el-icon-delete" @click="contentDelete(scope.row)">删除</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                      <el-pagination
                        v-if="totalPage1>15"
                        :current-page="pageNum1"
                        :page-sizes="[15, 30, 40]"
                        :page-size="pageSize1"
                        :total="totalPage1"
                        class="pagination"
                        layout="total, sizes, prev, pager, next, jumper"
                        @size-change="sizeChange1"
                        @current-change="currentChange1"
                      />
                    </el-tab-pane>
                    <el-tab-pane label="查询条件" name="second2">
                      <el-table
                        v-loading="listLoading"
                        :data="list2"
                        element-loading-text="拼命加载中"
                        border
                        fit
                        stripe>
                        <el-table-column align="center" label="字段中文名">
                          <template slot-scope="scope">
                            {{ scope.row.columnCn }}
                          </template>
                        </el-table-column>
                        <el-table-column label="表中文名" align="center">
                          <template slot-scope="scope">
                            {{ scope.row.tableCn }}
                          </template>
                        </el-table-column>
                        <el-table-column label="字段" align="center">
                          <template slot-scope="scope">
                            {{ scope.row.columnEn }}
                          </template>
                        </el-table-column>
                        <el-table-column label="表名" align="center">
                          <template slot-scope="scope">
                            {{ scope.row.tableEn }}
                          </template>
                        </el-table-column>
                        <el-table-column label="条件" align="center">
                          <template slot-scope="scope">
                            <el-select v-model="scope.row.conditions" placeholder="请选择条件值" size="mini" style="width: 110px" filterable>
                              <el-option
                                v-for="item in conditionList"
                                :key="item.key"
                                :label="item.value"
                                :value="item.key"/>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column label="条件值" align="center">
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.val" class="search-input" style="width:90%" placeholder="" size="mini" maxlength="20" clearable/>
                          </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center">
                          <template slot-scope="scope">
                            <el-button size="mini" type="danger" icon="el-icon-delete" @click="conditionDelete(scope.row)">删除</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                      <el-pagination
                        v-if="totalPage2>15"
                        :current-page="pageNum2"
                        :page-sizes="[15, 30, 40]"
                        :page-size="pageSize2"
                        :total="totalPage2"
                        class="pagination"
                        layout="total, sizes, prev, pager, next, jumper"
                        @size-change="sizeChange2"
                        @current-change="currentChange2"
                      />
                    </el-tab-pane>
                    <el-tab-pane label="查询限制" name="third3">
                      <el-table
                        v-loading="listLoading"
                        :data="list3"
                        element-loading-text="拼命加载中"
                        border
                        fit
                        stripe>
                        <el-table-column align="center" label="字段中文名">
                          <template slot-scope="scope">
                            {{ scope.row.columnCn }}
                          </template>
                        </el-table-column>
                        <el-table-column label="表中文名" align="center" prop="mandataryName">
                          <template slot-scope="scope">
                            {{ scope.row.tableCn }}
                          </template>
                        </el-table-column>
                        <el-table-column label="字段" align="center">
                          <template slot-scope="scope">
                            {{ scope.row.columnEn }}
                          </template>
                        </el-table-column>
                        <el-table-column label="表名" align="center" prop="status">
                          <template slot-scope="scope">
                            {{ scope.row.tableEn }}
                          </template>
                        </el-table-column>
                        <el-table-column label="限制类型" align="center" prop="status">
                          <template slot-scope="scope">
                            <el-select v-model="scope.row.astrict" placeholder="限制类型" style="width: 110px" @change="handleChange(scope.row)">
                              <el-option
                                v-for="item in astrictList"
                                :key="item.key"
                                :label="item.value"
                                :value="item.key"/>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column label="限制条件" align="center" prop="status">
                          <template slot-scope="scope">
                            <el-select v-if="scope.row.astrict === 'order by'" v-model="scope.row.astrictVal" placeholder="限制条件" style="width: 110px">
                              <el-option
                                v-for="item in astrictValList"
                                :key="item.key"
                                :label="item.value"
                                :value="item.key"/>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center">
                          <template slot-scope="scope">
                            <el-button size="mini" type="danger" icon="el-icon-delete" @click="astrictUpdate(scope.row)">删除</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                      <el-pagination
                        v-if="totalPage3>15"
                        :current-page="pageNum3"
                        :page-sizes="[15, 30, 40]"
                        :page-size="pageSize3"
                        :total="totalPage3"
                        class="pagination"
                        layout="total, sizes, prev, pager, next, jumper"
                        @size-change="sizeChange3"
                        @current-change="currentChange3"
                      />
                    </el-tab-pane>
                    <el-tab-pane label="数据预览" name="fourth4">
                      <el-table
                        v-loading="listLoading"
                        :data="list4"
                        element-loading-text="拼命加载中"
                        border
                        fit
                        stripe>
                        <el-table-column align="center" label="序号" width="50">
                          <template slot-scope="scope">
                            {{ scope.$index+1 }}
                          </template>
                        </el-table-column>
                        <el-table-column label="数据" align="center" prop="mandataryName">
                          <template slot-scope="scope">
                            <span v-for="(value, key) in scope.row" :key="key">
                              <span v-if="key !== 'id' && key !== 'deviceId'">{{ key }} : {{ value }}</span>
                            </span>
                          </template>
                        </el-table-column>
                      </el-table>
                      <el-pagination
                        v-if="totalPage4>15"
                        :current-page="pageNum4"
                        :page-sizes="[15, 30, 40]"
                        :page-size="pageSize4"
                        :total="totalPage4"
                        class="pagination"
                        layout="total, sizes, prev, pager, next, jumper"
                        @size-change="sizeChange4"
                        @current-change="currentChange4"
                      />
                    </el-tab-pane>
                  </el-tabs>
                </el-tab-pane>
                <el-tab-pane label="手动编写SQL" name="second" style="height:400px;overflow:auto">
                  <el-input :rows="18" v-model="findForm.completeSql" type="textarea" maxlength="2000"/>
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveAdd('findForm')">保 存</el-button>
        <el-button @click="resetEdit('findForm')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="编辑"
      width="1200px"
      @close="handleClose('findForm')">
      <div>
        <el-form ref="findForm" :model="findForm" :rules="rules" status-icon label-width="100px" label-position="right">
          <el-row>
            <el-col :span="8">
              <el-form-item label="查询名称 " prop="name">
                <el-input v-model="findForm.name" placeholder="请输入查询名称" size="small" style="width: 200px" maxlength="100" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="编号 " prop="code">
                <el-input v-model="findForm.code" placeholder="请输入编号" size="small" style="width: 150px" maxlength="10" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="备注 ">
                <el-input v-model="findForm.remark" placeholder="请输入备注名称" size="small" style="width: 350px" maxlength="255" clearable/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div>
        <el-row>
          <el-col :span="6">
            <div style="border: 1px solid #666;margin-top: 15px;padding: 15px;height:500px">
              <el-input v-model="filterText" placeholder="输入关键字进行过滤" style="margin-bottom:15px">&nbsp;</el-input>
              <el-tree ref="tree2" :data="tree" :props="defaultProps" :filter-node-method="filterNode" class="filter-tree" style="height: 415px;overflow: auto;" default-expand-all @node-expand="handleNodeClick" @node-collapse="handleNodeClick" @node-click="handleNodeClick">&nbsp;</el-tree>
            </div>
          </el-col>
          <el-col :span="18">
            <div style="border: 1px solid #666;border-left: 0px;margin-top: 15px;padding: 15px;height:500px">
              <el-tabs v-model="activeIndex" type="border-card" @tab-click="handleSelect">
                <el-tab-pane label="可视化定制" name="first" style="height:400px;overflow:auto">
                  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                    <el-tab-pane label="查询内容" name="first1">
                      <el-table
                        v-loading="listLoading"
                        :data="list1"
                        element-loading-text="拼命加载中"
                        border
                        fit
                        stripe>
                        <el-table-column align="center" label="字段中文名">
                          <template slot-scope="scope">
                            {{ scope.row.columnCn }}
                          </template>
                        </el-table-column>
                        <el-table-column label="表中文名" align="center">
                          <template slot-scope="scope">
                            {{ scope.row.tableCn }}
                          </template>
                        </el-table-column>
                        <el-table-column label="字段" align="center">
                          <template slot-scope="scope">
                            {{ scope.row.columnEn }}
                          </template>
                        </el-table-column>
                        <el-table-column label="表名" align="center">
                          <template slot-scope="scope">
                            {{ scope.row.tableEn }}
                          </template>
                        </el-table-column>
                        <el-table-column label="别名" align="center">
                          <template slot-scope="scope">
                            {{ scope.row.alias }}
                          </template>
                        </el-table-column>
                        <el-table-column label="函数" align="center">
                          <template slot-scope="scope">
                            <el-select v-model="scope.row.func" placeholder="选择函数" style="width: 110px">
                              <el-option
                                v-for="item in functionList"
                                :key="item.key"
                                :label="item.value"
                                :value="item.key"/>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center">
                          <template slot-scope="scope">
                            <el-button size="mini" type="danger" icon="el-icon-delete" @click="contentDelete(scope.row)">删除</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                      <el-pagination
                        v-if="totalPage1>15"
                        :current-page="pageNum1"
                        :page-sizes="[15, 30, 40]"
                        :page-size="pageSize1"
                        :total="totalPage1"
                        class="pagination"
                        layout="total, sizes, prev, pager, next, jumper"
                        @size-change="sizeChange1"
                        @current-change="currentChange1"
                      />
                    </el-tab-pane>
                    <el-tab-pane label="查询条件" name="second2">
                      <el-table
                        v-loading="listLoading"
                        :data="list2"
                        element-loading-text="拼命加载中"
                        border
                        fit
                        stripe>
                        <el-table-column align="center" label="字段中文名">
                          <template slot-scope="scope">
                            {{ scope.row.columnCn }}
                          </template>
                        </el-table-column>
                        <el-table-column label="表中文名" align="center">
                          <template slot-scope="scope">
                            {{ scope.row.tableCn }}
                          </template>
                        </el-table-column>
                        <el-table-column label="字段" align="center">
                          <template slot-scope="scope">
                            {{ scope.row.columnEn }}
                          </template>
                        </el-table-column>
                        <el-table-column label="表名" align="center">
                          <template slot-scope="scope">
                            {{ scope.row.tableEn }}
                          </template>
                        </el-table-column>
                        <el-table-column label="条件" align="center">
                          <template slot-scope="scope">
                            <el-select v-model="scope.row.conditions" placeholder="请选择条件值" style="width: 110px">
                              <el-option
                                v-for="item in conditionList"
                                :key="item.key"
                                :label="item.value"
                                :value="item.key"/>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column label="条件值" align="center">
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.val" class="search-input" style="width:90%" placeholder="" size="mini" maxlength="20" clearable/>
                          </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center">
                          <template slot-scope="scope">
                            <el-button size="mini" type="danger" icon="el-icon-delete" @click="conditionDelete(scope.row)">删除</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                      <el-pagination
                        v-if="totalPage2>15"
                        :current-page="pageNum2"
                        :page-sizes="[15, 30, 40]"
                        :page-size="pageSize2"
                        :total="totalPage2"
                        class="pagination"
                        layout="total, sizes, prev, pager, next, jumper"
                        @size-change="sizeChange2"
                        @current-change="currentChange2"
                      />
                    </el-tab-pane>
                    <el-tab-pane label="查询限制" name="third3">
                      <el-table
                        v-loading="listLoading"
                        :data="list3"
                        element-loading-text="拼命加载中"
                        border
                        fit
                        stripe>
                        <el-table-column align="center" label="字段中文名">
                          <template slot-scope="scope">
                            {{ scope.row.columnCn }}
                          </template>
                        </el-table-column>
                        <el-table-column label="表中文名" align="center" prop="mandataryName">
                          <template slot-scope="scope">
                            {{ scope.row.tableCn }}
                          </template>
                        </el-table-column>
                        <el-table-column label="字段" align="center">
                          <template slot-scope="scope">
                            {{ scope.row.columnEn }}
                          </template>
                        </el-table-column>
                        <el-table-column label="表名" align="center" prop="status">
                          <template slot-scope="scope">
                            {{ scope.row.tableEn }}
                          </template>
                        </el-table-column>
                        <el-table-column label="限制类型" align="center" prop="status">
                          <template slot-scope="scope">
                            <el-select v-model="scope.row.astrict" placeholder="限制类型" style="width: 110px" @change="handleChange(scope.row)">
                              <el-option
                                v-for="item in astrictList"
                                :key="item.key"
                                :label="item.value"
                                :value="item.key"/>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column label="限制条件" align="center" prop="status">
                          <template slot-scope="scope">
                            <el-select v-if="scope.row.astrict === 'order by'" v-model="scope.row.astrictVal" placeholder="限制条件" style="width: 110px">
                              <el-option
                                v-for="item in astrictValList"
                                :key="item.key"
                                :label="item.value"
                                :value="item.key"/>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center">
                          <template slot-scope="scope">
                            <el-button size="mini" type="danger" icon="el-icon-delete" @click="astrictUpdate(scope.row)">删除</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                      <el-pagination
                        v-if="totalPage3>15"
                        :current-page="pageNum3"
                        :page-sizes="[15, 30, 40]"
                        :page-size="pageSize3"
                        :total="totalPage3"
                        class="pagination"
                        layout="total, sizes, prev, pager, next, jumper"
                        @size-change="sizeChange3"
                        @current-change="currentChange3"
                      />
                    </el-tab-pane>
                    <el-tab-pane label="数据预览" name="fourth4">
                      <el-table
                        v-loading="listLoading"
                        :data="list4"
                        element-loading-text="拼命加载中"
                        border
                        fit
                        stripe>
                        <el-table-column align="center" label="序号" width="50">
                          <template slot-scope="scope">
                            {{ scope.$index+1 }}
                          </template>
                        </el-table-column>
                        <el-table-column label="数据" align="center" prop="mandataryName">
                          <template slot-scope="scope">
                            <span v-for="(value, key) in scope.row" :key="key">
                              <span v-if="key !== 'id' && key !== 'deviceId'">{{ key }} : {{ value }} &nbsp;&nbsp;&nbsp;&nbsp;</span>
                            </span>
                          </template>
                        </el-table-column>
                      </el-table>
                      <el-pagination
                        v-if="totalPage4>15"
                        :current-page="pageNum4"
                        :page-sizes="[15, 30, 40]"
                        :page-size="pageSize4"
                        :total="totalPage4"
                        class="pagination"
                        layout="total, sizes, prev, pager, next, jumper"
                        @size-change="sizeChange4"
                        @current-change="currentChange4"
                      />
                    </el-tab-pane>
                  </el-tabs>
                </el-tab-pane>
                <el-tab-pane label="手动编写SQL" name="second" style="height:400px;overflow:auto">
                  <el-input :rows="18" v-model="findForm.completeSql" type="textarea" maxlength="2000"/>
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveEdit('findForm')">保 存</el-button>
        <el-button @click="resetEdit('findForm')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-drag
      :close-on-click-modal="false"
      :visible.sync="previewDialogVisible"
      title="数据查看"
      width="800px">
      <div>
        <el-table
          v-loading="listLoading"
          :data="dataList"
          element-loading-text="拼命加载中"
          border
          fit
          stripe>
          <el-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              {{ scope.$index+1 }}
            </template>
          </el-table-column>
          <el-table-column label="数据" align="center">
            <template slot-scope="scope">
              <span v-for="(value, key) in scope.row" :key="key">
                <span style="margin-right:20px">{{ key }} : {{ value }}</span>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetEdit()">关 闭</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./queryDesigner.js"></script>

<style scoped>
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 10px;
    top: 3px;
  }
  .app-container{
    height: calc(100vh - 207px);
  }
  .el-tabs--top>>>.el-tabs__item.is-top:nth-child(2) {
    padding-left: 20px !important;
  }
  .el-tabs--top>>>.el-tabs__item.is-top:hover {
    color: #009494 !important;
  }
  .el-tabs--top>>>.el-tabs__nav {
    padding-left: 0px !important;
    color: #303133;
  }
  .el-tabs--top>>>.el-tabs__item {
    color: #303133 !important;
  }
  .el-tabs--top>>>.el-tabs__item.is-active {
    color: #009494 !important;
  }
</style>
