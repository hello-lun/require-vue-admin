define([
    'framework/api/game-project/v1/GameProjectType',
    'framework/api/game-project/v1/GameProject',
    'framework/api/game-project/v1/GameProjectPort',
    'game-project/views/index/game-project',
    'game-project/views/index/game-project-port',
    'game-project/components/sidebar-game-project-type',
    'game-project/components/sidebar-game-project'
], function(
    gameProjectType,
    gameProject,
    gameProjectPort,
    gameProjectList,
    gameProjectPortList,
    sidebarGameProjectType,
    sidebarGameProject
) {
    'use strict';
   
    return {
        name: 'GameProject',
        components: {
            GameProjectList: gameProjectList,
            GameProjectPortList:gameProjectPortList
        },
        created: function () {
            this.asyncGetGameProjectTree();
        },
        data: function () {
            return {            
                GameProjectTypeTreeData: [
                    {
                        Path:[],
                        Childs:[],
                        Name: '全部',
                        ID: 'all'
                    }
                ],
                treeProps: {
                    label: 'Name',
                    children: 'Childs',
                    id: 'ID',
                    path:'Path'
                },
                icons: [],
                tabActive: 'gameProject',
                selectnode:null,
                checkedkeys:['all'],
                treeData:[],
            }
        },
        wath:{
        },
        methods: {
            // 获取项目分类树形菜单
            asyncGetGameProjectTree: function () {
                var self = this;
                gameProjectType.GetTree()
                    .then(function (data) {
                        self.GameProjectTypeTreeData = [{
                            Childs: data.Data,
                            Name: '全部',
                            ID: 'all',
                            Path:[]
                        }];
                        self.treeData=self.GameProjectTypeTreeData;
                       
                    });
                  
            },
             //树形菜单操作事件
            handleTreeCommand: function (item) {
                var self = this;
                self.selectnode=item.data;
                switch (item.type) {
                    case 'addGameProjectType':
                    self.addGameProjectType(item.data,item.node);
                    break;
                    case 'addChildGameProjectType':
                    self.addGameProjectType(item.data,item.node);
                    break;                  
                    case 'addGameProject': 
                    self.addGameProject(item.data,item.node);
                        break;
                    case 'editGameProjectType': 
                     self.editGameProjectType(item.data,item.node);
                          break;
                    case 'deleteGameProjectType': 
                    self.deleteGameProjectType(item.data,item.node);
                        break;           
                }
            },
            //树形节点点击事件
            handleTreeNodeClick: function (data,node) {
             var self = this;
             self.selectnode=data;
             self.tabActive='gameProject';                  
            },

            // 处理树形结构项右侧菜单render
            handleMenuRender: function (item) {
                var data = item.data,
                    node = item.node;
                    if(node.level === 1)
                    {
                        return  { 'addGameProjectType': '新增分类' };
                    }
                    else 
                    {
                        return  { 
                            'addChildGameProjectType': '添加子类型',
                            'addGameProject': '添加项目',
                            'editGameProjectType': '编辑',
                            'deleteGameProjectType': '删除'
                           
                        };
                    }
              
            },
             //新增项目分类
            addGameProjectType: function (data,node) {
                var self = this;                           
                this.sideBar({
                    title: '新增项目分类',
                    datas: {
                       Node: data
                    },
                    modules: [{
                      component: sidebarGameProjectType
                    }],
                    operation: [{
                        label: '保存',
                        value: 'save'
                    }],
                    success: function () {
                        self.$message({
                            message: '添加成功！',
                            type: 'success'
                        });
                        self.asyncGetGameProjectTree();
                        self.checkedkeys=['all'];
                    }
                }).show();
            },  
                 
             //新增项目
             addGameProject: function (data,node) {
                        var self = this;                          
                        this.sideBar({
                            title: '新增项目',
                            datas: {
                               Node:data
                            },
                            modules: [{
                              component: sidebarGameProject
                            }],
                            operation: [{
                                label: '保存',
                                value: 'save'
                            }],
                            success: function (data) {
                                self.$message({
                                    message: '添加成功！',
                                    type: 'success'
                                });
                                //重新加载树形结构
                                //self.asyncGetGameProjectTree();
                                self.checkedkeys=['all'];
                            }
                        }).show();
            },  

            //编辑项目分类
            editGameProjectType: function (data,node){
                var self = this;
                var node=data;
                var  id = data.ID;
                var name=data.Name; 
                this.sideBar({
                    title: '编辑项目分类',
                    datas: {
                        ID: id,
                        Name:name,
                        Node:node
                    },
                    modules: [{
                        component: sidebarGameProjectType
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
                        self.asyncGetGameProjectTree();
                        self.checkedkeys=['all'];
                    }
                }).show();
            },

            // 删除项目分类操作
            deleteGameProjectType: function (data,node) {
                    var self = this;
                    this.$confirm('确定删除项目分类？', '提示', 
                    {
                        confirmButtonText: '删除',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).then(function () {
                        self.callGameProjectTypeDeleteApi(data,node);
                       
                    }
                ).catch(function () 
                    {

                    }
                );
            },

           // 调用删除项目分类接口
            callGameProjectTypeDeleteApi: function (data,node) {
                var self = this;
                gameProjectType.DeleteProjectType({ ID: data.ID})
                .then(function () {
                    self.$message({
                    message: '删除成功！',
                        type: 'success'
                    });
                        self.asyncGetGameProjectTree();
                        if(node.level==3){
                        self.checkedkeys=[''+data.RootID+''];
                        }else{
                            self.checkedkeys=['all'];
                        }
                });
            },
            //刷新树形结构
            handlerefreshData:function(){
                var self = this;
                self.asyncGetGameProjectTree();             
            },
            //无类型时添加项目分类
            handleGameProjectTypeAdd:function(){
                var data = [{
                    Childs:[],
                    Name: '全部',
                    ID: 'all',
                    Path:[]
                }];
                var node=[];
                this.addGameProjectType(data,null);
            }
                           
        },

        template: `
            <el-container 
                :body-style="{'width': '220px'}" 
                style="height: 100%;">
                <el-card :body-style="{'height': '100%'}" >
                    <el-aside 
                        style="height: 100%"
                        width="200px">
                        <ych-tree
                            ref="mainlisttree"
                            :data="GameProjectTypeTreeData"
                            :data-props="treeProps"
                            node-key="ID"
                            :default-expanded-keys="checkedkeys"    
                            @menu-command="handleTreeCommand"
                            :menu-render="handleMenuRender"
                            @node-click="handleTreeNodeClick">
                        </ych-tree>
                    </el-aside>
                </el-card>

                <el-card                  
                    :body-style="{'height': '100%'}" 
                    style="margin-left: 10px;flex: 1;" >

                    <el-tabs v-model="tabActive"   >
                        <el-tab-pane 
                            label="项目管理" 
                            name="gameProject">
                            <game-project-list  
                            :selectnode="selectnode" 
                            :treeData="GameProjectTypeTreeData"
                            @refresh-tree-data="handlerefreshData"
                            @game-project-type-add="handleGameProjectTypeAdd">
                            </game-project-list>
                        </el-tab-pane>

                        <el-tab-pane 
                            label="端口管理" 
                            name="gameProjectPort">
                            <game-project-port-list :selectnode="selectnode">
                            </game-project-port-list>
                        </el-tab-pane>
                   
                    </el-tabs>
                </el-card>

            </el-container>
        `
    }
});