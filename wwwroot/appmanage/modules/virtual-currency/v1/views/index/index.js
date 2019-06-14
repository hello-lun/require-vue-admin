define([
    'api/virtual-currency/v1/VirtualCurrency',
    'virtual-currency/components/sidebar-virtual-currency',
    'mixins/pagination',
    'incss!virtual-currency/styles/index.css'
], function (
    virtualCurrency,
    SidebarVirtualCurrency,
    pagination
) {
        'use strict';

        return {
            name: 'VirtualCurrency',

            mixins: [pagination],

            created: function () {
                // 初始化分页混合更新方法
                this.paginationUpdateFn = this.asyncGetVirtualCurrency;
            },

            data: function () {
                return {
                    columnOpration: [
                        {
                            label: '修改',
                            value: 'edit'
                        },
                        // {
                        //     label: '删除',
                        //     value: 'delete'
                        // }
                    ],

                    formData: {
                        Name: '',
                        Number: ''
                    },

                    dataList: [],

                    order: {
                        Order: 'Number',
                        OderAsc: false
                    },

                    multipleSelection: [],

                    // 新增选择类型弹窗'预存款','代币(唯一)','彩票(唯一)','积分','自定义'
                    dialogVisible: false,
                    kindSetting: [
                        { ID: 'PreDeposit', Name: '预存款', icon: 'ych-icon-yucunkuan' },
                        { ID: 'Gold', Name: '金币', icon: 'ych-icon-jinbi' },
                        { ID: 'Token', Name: '代币', icon: 'ych-icon-daibi' },
                        { ID: 'Lottery', Name: '彩票', icon: 'ych-icon-caipiao' },
                        { ID: 'Integral', Name: '积分', icon: 'ych-icon-jifen' },
                        { ID: 'Custom', Name: '自定义', icon: 'ych-icon-qita' }
                    ]
                };
            },
            computed: {
                kindDailogWidth: function () {
                    return (this.kindSetting.length * 150 + 124) + 'px';
                }
            },
            methods: {
                asyncGetVirtualCurrency: function () {
                    var self = this,
                        submitData = _.extend(
                            {},
                            // this.formData,
                            this.paginationInfo,
                            this.order
                        );

                    this.$nextTick(function () {
                        virtualCurrency.Search(submitData)
                            .then(function (data) {
                                self.dataList = data.Data;
                                self.paginationTotal = data.Total;
                                // self.pageInfo.PageIndex = data.PageIndex;
                                // self.pageInfo.PageSize = data.PageSize;
                            })
                    });
                },

                handleSortChange: function (data) {
                    this.order.Order = data.prop;
                    this.order.OderAsc = data.order === 'ascending';
                    this.asyncGetVirtualCurrency();
                },

                addVirtualCurrency: function (selectKind) {
                    var self = this;
                    this.sideBar({
                        title: '新增-虚拟货币',
                        datas: {
                            SelectKind: selectKind,
                        },
                        modules: [{
                            component: SidebarVirtualCurrency
                        }],
                        operation: [{
                            label: '保存',
                            value: 'save'
                        }],
                        success: function (data) {
                            self.$message({
                                message: '保存成功！',
                                type: 'success'
                            });
                            self.asyncGetVirtualCurrency();

                        }
                    }).show();
                },
                handleSelectKind: function (selectKind) {
                    this.dialogVisible = false;
                    this.addVirtualCurrency(selectKind);
                },
                editVirtualCurrency: function (id) {
                    var self = this;
                    this.sideBar({
                        title: '编辑-虚拟货币',
                        datas: {
                            id: id
                        },
                        modules: [{
                            component: SidebarVirtualCurrency
                        }],
                        operation: [{
                            label: '保存',
                            value: 'save'
                        }],
                        success: function (data) {
                            self.$message({
                                message: '保存成功！',
                                type: 'success'
                            });
                            self.asyncGetVirtualCurrency();

                        }
                    }).show();
                },

                deleteVirtualCurrency: function (ids) {
                    var self = this,
                        data = ids;
                    /* data = (typeof ids === 'string')
                             ? [ids] 
                             : _.map(this.multipleSelection, function (item) {
                                 return item.ID;
                             });*/

                    this.$confirm('确定删除虚拟货币？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(function () {
                        virtualCurrency.Delete({ ID: data })
                            .then(function () {
                                self.$message({
                                    message: '虚拟货币删除成功！',
                                    type: 'success'
                                });
                                self.asyncGetVirtualCurrency();
                            });
                    }).catch(function () { });
                },

                handleOperationColumn: function (name, data) {
                    switch (name) {
                        case 'edit':
                            this.editVirtualCurrency(data.ID);
                            break;

                        case 'delete':
                            this.deleteVirtualCurrency(data.ID)
                            break;
                    }
                },
                handleVirtualCurrencyClick: function (row) {
                    this.editVirtualCurrency(row.ID)
                },

                handleSelectionChange: function (val) {
                    this.multipleSelection = val;
                },

                // 处理查询条件隐藏，清楚条件
                handleConditionHided: function (prop) {
                    this.formData[prop] = null;
                },
                // 处理有效期
                handleRefund: function (refund) {
                    var refundMap = {
                        true: '是',
                        false: '否'
                    }
                    return refundMap[refund] || '未知';
                },
                // 处理退款
                handleValidity: function (validity) {
                    var validityMap = {
                        true: '是',
                        false: '否'
                    }
                    return validityMap[validity] || '未知';
                },
                //处理来源
                handleSource: function (source) {
                    if (source == null || source == undefined) {
                        return "";
                    }
                    var item = "";
                    source.forEach(element => {
                        item = item + ',' + element;
                    });
                    if (item != "") item = item.substring(1);
                    return item;
                },
                //处理能力
                handleAbility: function (ability) {
                    if (ability == null || ability == undefined) {
                        return "";
                    }
                    var item = "";
                    ability.forEach(element => {
                        item = item + ',' + element;
                    });
                    if (item != "") item = item.substring(1);
                    return item;
                },


            },

            template: `
     
        <el-card :body-style="{'height': '100%'}" style="height: 98%;" >

        <el-dialog
        title="请选择虚拟货币进行快捷设置"
        :width="kindDailogWidth"
        :visible.sync="dialogVisible">
            <el-row 
                type="flex"
                class="goods-info__dialog" 
                :gutter="20">
                <el-col 
                    v-for="item in kindSetting"
                    class="goods-info__dialog-col"
                    :key="item.ID"
                    @click.native="handleSelectKind(item)" 
                    :span="6">

                    <ych-svg-icon :icon="item.icon">
                    </ych-svg-icon>
                    <center> {{ item.Name }}</center>
                </el-col>
            </el-row>
       </el-dialog>

      

            <ych-report-container>          
                <ych-report-header 
                    slot="header"
                    @hide-condition="handleConditionHided"
                    @query-click="asyncGetVirtualCurrency">
                    
                    <!--
                    <ych-form-item 
                        label="货币名称"
                        key="Name"
                        prop="Name">
                        <el-input v-model="formData.Name"></el-input>
                    </ych-form-item >

                    <ych-form-item  
                        label="货币编号" 
                        key="Number"
                        prop="Number">
                        <el-input v-model="formData.Number"></el-input>
                    </ych-form-item >
                    -->
                </ych-report-header>
         
                <ych-table
                    style="margin-top:5px;"
                    slot="main"
                    :data="dataList"
                    :default-sort = "{prop: 'Number', order: 'descending'}"
                    @sort-change="handleSortChange"
                    @selection-change="handleSelectionChange">
                   <!--
                    <el-table-column type="selection"  width="30">
                    </el-table-column>
                    -->

                    <ych-table-column-format prop="Number"  label="货币编号"  width="100" 
                        :link-click="handleVirtualCurrencyClick" format-type="link"   sortable>
                    </ych-table-column-format>
                    
                    <ych-table-column-format prop="Name" label="货币名称" width="110" 
                        :link-click="handleVirtualCurrencyClick" format-type="link"  sortable>
                    </ych-table-column-format>
                    
                    <el-table-column prop="Ability" label="能力"  width="200" sortable>
                        <template slot-scope="scope">
                        <span>
                            {{ 
                                handleAbility(scope.row.Ability) 
                            }}
                        </span>
                      </template>  
                    </el-table-column>

                    <el-table-column prop="Source" label="来源" width="200">  
                    <template slot-scope="scope">
                    <span>
                        {{ 
                            handleSource(scope.row.Source) 
                        }}
                    </span>
                  </template>                
                  </el-table-column>
 
                  <el-table-column prop="Refund" label="支持退款" width="80">         
                  <template slot-scope="scope">
                  <span>
                      {{ 
                          handleRefund(scope.row.Refund) 
                      }}
                  </span>
                </template>
                </el-table-column>

                 <ych-table-column-format prop="Decimal" label="小数位" width="80" format-type="number">
                 </ych-table-column-format>
 
                 <el-table-column prop="Validity"  label="有效期限制" width="90">
                 <template slot-scope="scope">
                 <span>
                     {{ 
                         handleValidity(scope.row.Validity) 
                     }}
                 </span>
               </template>
                </el-table-column>

                <el-table-column
                prop="LastUpdater"
                label="最后修改人"
                width="128">
               </el-table-column>

               <ych-table-column-format prop="LastUpdated" label="最后操作日期" format-type="date">
               </ych-table-column-format>
                
                <ych-table-column-operation
                 @operation-click="handleOperationColumn"
                 :operation="columnOpration">
               </ych-table-column-operation>

                </ych-table>

                <template slot="footerLeft">
                    <ych-button @click="dialogVisible = true"  type="primary">
                        新增虚拟货币
                    </ych-button>
                   <!--
                    <ych-button 
                        :disabled="multipleSelection.length <= 0" 
                        @click="deleteVirtualCurrency">
                        删除
                    </ych-button>
                    -->
                </template>

                <ych-pagination
                    slot="footerRight"
                    @size-change="$_pagination_sizeChange"
                    @current-change="$_pagination_currentChange"
                    :current-page="paginationInfo.PageIndex"
                    :total="paginationTotal">
                </ych-pagination>
           
                </ych-report-container>

            </el-card>
           
        `
        }
    });
