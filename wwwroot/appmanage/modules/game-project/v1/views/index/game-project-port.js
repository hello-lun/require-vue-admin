define([
    'api/game-project/v1/GameProjectPort',
    'components/cascader-game-project-type/index',
    'game-project/components/game-project-machine-port-dailog',
    'mixins/pagination'
], function (
    gameProjectPort,
    cascaderGameProjectType,
    gameProjectMachinePortDailog,
    pagination
) {
        'use strict';
        // 操作列按钮
        var operationGroup = [
            {
                label: '编辑',
                value: 'edit'
            },
            {
                label: '删除',
                value: 'delete'
            }
        ];
        
        return {
            name: 'GameProjectPortList',
            props: ['selectnode'],
            components: {
                CascaderGameProjectType:cascaderGameProjectType,
                GameProjectMachinePortDailog:gameProjectMachinePortDailog
            },
            mixins: [pagination],
            created: function () {
                 // 初始化分页混合更新方法
            this.paginationUpdateFn = this.asyncGetGameProjectPortList;
                this.asyncGetGameProjectPortList();
            },
            data: function () {
                return {
                    columnOpration: operationGroup,
                    multipleSelection:[],
                    dataList: [],
                    order: {
                        Order: 'PortFlag',
                        OderAsc: false
                    },
                    formData: {
                        ProjectName: '',
                        ProjectCode:'',
                        PortFlag:'',
                        IsEnable:'',
                        ProjectType: ''
                    },
                    enableOptions:
                    [
                        {
                        label: '全部',
                            value: '',
                        }, {
                            label: '正常',
                            value: true
                        }, {
                            label: '禁用',
                            value: false
                        }
                    ],
                    gameProjectTypeOptions:
                    [
                        {
                            Path:[],
                            Childs:[],
                            Name: '',
                            ID: ''
                        }
                    ],                   
                    gameProjectMachinePortDailogVisible: false,
                    editGamePeojectPort:{
                        ID: '',
                        Num: '',
                        PortFlag:'',
                        IsInverse:false,
                        IsEnable:true,
                        PortType:''
                        
                    },

                };
            },
            watch: {
                selectnode: {
                    deep: true,//还可以加一个deep，表示跟踪所有对象下的属性
                    handler: function (newval, oldval) {
                        if (newval) {
                            this.selectnode = newval;
                                                  
                            this.gameProjectTypeOptions=newval;
                            if(newval!=null&&newval!=undefined)
                            {
                            this.formData.ProjectType=newval.ID;
                            }
                        } else {
                        }
                        this.asyncGetGameProjectPortList();
                    }
                }               
            },

            computed: {
            },

            methods: {
                // 获取项目列表
            asyncGetGameProjectPortList: function () {
                    var self = this;                
                    self.$nextTick(function () {                       
                          var submitData = self.handleSubmitData();;
                            gameProjectPort.GetPortList(submitData).then(function (data) {
                                if (data != null && data != undefined) {
                                    self.dataList = data.Data;
                                     self.paginationTotal = data.Total;
                                }
                            });
                    });
            },
             // 处理提交数据
            handleSubmitData: function () {
                if(this.formData.ProjectType=='all'){
                    this.formData.ProjectType='';
                }
                    var finalFormData = _.extend({}, this.formData),
                        statistics = finalFormData.Statistics || [];
    
                    finalFormData.StartTime = statistics[0];
                    finalFormData.EndTime = statistics[1];
                    delete finalFormData.Statistics;
    
                    return _.extend(
                        {},
                        finalFormData,
                        this.paginationInfo,
                        this.order
                    );
            },
            //排序
            handleSortChange: function (data) {
                this.order.Order = data.prop;
                this.order.OderAsc = data.order === 'ascending';
                this.asyncGetGameProjectPortList();
            },
            //操作事件    
            handleOperationColumn: function (name, data) {
                var fnMap = {
                    'edit': this.editGameProject,
                    'delete': this.confirmDeleteGameProject
                };

                var fn = fnMap[name];
                fn && fn(data);
            },

            handleConditionHided: function (prop) {
                this.formData[prop] = null;
            },

           //选中行
           handleSelectionChange: function (val) {                 
                    this.multipleSelection=val;                
           },
  
           //编辑端口
           editGameProject: function (data) {
               var self=this;            
              self.asyncGetGameProjectPortDetail(data.ID);
              self.gameProjectMachinePortDailogVisible=true;
           },
           asyncGetGameProjectPortDetail:function(id){
               var self = this;                            
                gameProjectPort.GetPort({ ID:id})
                    .then(function (res) {
                    _.extend(  self.editGamePeojectPort, { 
                        ID:res.ID,                  
                        Num: res.Num,
                        PortFlag:res.PortFlag,
                        IsInverse:res.IsInverse,
                        IsEnable:res.IsEnable,
                        PortType:res.PortType
                    });});
            
        },
           //选择删除行提示
           confirmDeleteGameProject: function (data) {
            var self = this;
            this.$confirm('确定删除游乐项目端口？', '提示', {
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function () {
                self.deleteGameProject(data.ID);
            }).catch(function () {});
           },
           
           //删除端口
           deleteGameProject: function (id) {
            var self = this;
            gameProjectPort
                .Unbundling({ ID: id})
                .then(function () {
                    self.$message({
                        message: '游乐项目端口删除成功！',
                        type: 'success'
                    });                  
                    self.asyncGetGameProjectPortList();
                });
            },  
            //点击名称
           handleProjectNameClick:function(row){
            this.editGameProject(row);
           },
           saveGameProjectMachinePort:function(){
            this.asyncGetGameProjectPortList();
           },
           deleteGameProjectMachinePort:function(){
            this.asyncGetGameProjectPortList();
           }
   
            },

            template: `
            <div>

            <!----------------------------------编辑Pp位开始----------------------------------->
            <game-project-machine-port-dailog 
                ref="addGameProjectMachinePort"
                :visible.sync="gameProjectMachinePortDailogVisible"   
                :GamePeojectPort="editGamePeojectPort"           
                @submit="saveGameProjectMachinePort"
                @delete="deleteGameProjectMachinePort">
            </game-project-machine-port-dailog>            
            <!----------------------------------编辑p位结束----------------------------------->


                <ych-report-container>
    
                    <ych-report-header 
                        slot="header"
                        @hide-condition="handleConditionHided"
                        @query-click="asyncGetGameProjectPortList">
                    
                            <ych-form-item 
                                label="项目名称"
                                key="ProjectName"
                                prop="ProjectName">
                                <el-input v-model="formData.ProjectName"></el-input>
                            </ych-form-item >

                            <ych-form-item 
                                label="端口编号"
                                key="ProjectCode"
                                prop="ProjectCode">
                                    <el-input v-model="formData.ProjectCode"></el-input>
                            </ych-form-item >

                            <ych-form-item 
                                label="端口标识"
                                key="PortFlag"
                                prop="PortFlag">
                                <el-input v-model="formData.PortFlag"></el-input>
                            </ych-form-item >

                            <ych-form-item
                                label="端口状态"
                                key="IsEnable"
                                prop="IsEnable">
                                    <el-select 
                                        v-model="formData.IsEnable" 
                                        placeholder="请选择">
                                        <el-option
                                            v-for="item in enableOptions"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                            </ych-form-item>         
                    </ych-report-header>

                    <ych-table
                        slot="main"
                        :data="dataList"
                        @sort-change="handleSortChange"
                        @selection-change="handleSelectionChange"
                        :height="400">

                        <el-table-column
                            type="selection"
                            width="30">
                        </el-table-column>
                                                
                        <ych-table-column-format 
                            prop="PortFlag" 
                            label="端口标识" 
                            width="120" 
                            :link-click="handleProjectNameClick" 
                            format-type="link"  sortable>
                        </ych-table-column-format>

                        <el-table-column
                            prop="Num"
                            label="端口编号"
                            width="120" sortable>
                        </el-table-column>

                        <el-table-column
                            prop="ProjectName"
                            label="游乐项目"
                            width="150" sortable>
                        </el-table-column>

                        <el-table-column
                            prop="ProjectTypeName"
                            label="项目分类"
                            width="150" sortable>
                        </el-table-column>
                                
                        <el-table-column              
                            prop="IsEnable"
                            label="状态"
                            min-width="100"
                            sortable>
                                <template slot-scope="scope">
                                    {{ scope.row.IsEnable ? '正常' : '禁用' }}
                                </template>
                        </el-table-column>

                        <el-table-column              
                            prop="IsInverse"
                            label="是否倒置"
                            min-width="100"
                            sortable>
                                <template slot-scope="scope">
                                    {{ scope.row.IsInverse ? '是' : '否' }}
                                </template>
                        </el-table-column>

                        <ych-table-column-operation
                            @operation-click="handleOperationColumn"
                            :operation="columnOpration">
                        </ych-table-column-operation>
                    </ych-table>

                    <template slot="footerLeft">
                                
                    </template>

                    <ych-pagination
                        slot="footerRight"
                        @size-change="$_pagination_sizeChange"
                        @current-change="$_pagination_currentChange"
                        :current-page="paginationInfo.PageIndex"
                        :total="paginationTotal">
                    </ych-pagination>

                </ych-report-container>
            </div>
        `
        }
    });