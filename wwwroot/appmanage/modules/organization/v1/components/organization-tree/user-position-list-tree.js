define([
    'incss!organization/components/organization-tree/index.css'
], function () {
    'use strict';
    return {
        name: 'UserPositionListTree',
        props: ['selectUserPosition'],
        components: {
           
        },
        created: function () {
            this.asyncGetOrgData();
        },
        mounted: function () {
           
        },
        data: function () {
            return {
                filterText: '',
                treeData: null,
                defaultProps: {
                   // children: 'children', //子级
                    label: 'name'
                }
            }
        },

        watch: {
                   //过滤
           filterText(val) {
             this.$refs.tree.filter(val);
            },
           selectUserPosition: {
               deep: true,//还可以加一个deep，表示跟踪所有对象下的属性
               handler: function (newval, oldval) {
                   this.selectUserPosition = newval;
                    //选中已有员工
                   if (self.selectUserPosition != null && self.selectUserPosition != undefined) {
                       this.$nextTick(function () {
                           var newKey = new Array();
                           var key = self.selectUserPosition;
                           for (var i = 0; i < key.length; i++) {
                               newKey.push(key[i].id);
                           }
                           this.$refs.tree.setCheckedKeys(newKey);
                       });
                   }
               }
           }
        },

        methods: {
            //异步获取组织结构数据
            asyncGetOrgData: function () {
                var self = this;
                //获取所有组织结构
                global.getParentAuthUser(function (user) {
                    var accessToken = user.access_token;
                    $.ajax({
                        headers: {
                            Authorization: "Bearer " + accessToken
                        },
                        type: 'GET',
                        contentType: "application/json",
                        dataType: 'json',
                        url: "organization/api/Department/GetAllByType",
                        data: { Type: 3 },
                        success: function (data) {
                            if (data != null && data != undefined) {
                                self.treeData = data;
                                self.$refs.tree.setCheckedNodes(data);
                            }
                        }
                    });
                });

                //$.get("/api/Department/GetAllByType", { Type:3}, function (data) {
                //    if (data != null && data != undefined) {
                //            self.treeData = data;
                //            self.$refs.tree.setCheckedNodes(data);
                //    }
                //});


                //选中已有员工
                if (self.selectUserPosition != null && self.selectUserPosition != undefined) {
                    this.$nextTick(function () {
                        var newKey = new Array();
                        var key = self.selectUserPosition;
                        for (var i = 0; i < key.length; i++) {
                            newKey.push(key[i].id);
                        }
                        this.$refs.tree.setCheckedKeys(newKey);
                    });
                }
    
            },
                    //过滤数据
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            //获取节点数组
            getCheckedNodes() {            
                return this.$refs.tree.getCheckedNodes();
            },
            //获取key数组
            getCheckedKeys() {
                return this.$refs.tree.getCheckedKeys();
            },
            //根据节点数组选中节点
            setCheckedNodes(data) {
                this.$refs.tree.setCheckedNodes(data);
            },
             //根据key数组选中节点
            setCheckedKeys() {
                this.$refs.tree.setCheckedKeys([]);
            },
            //清空
            resetChecked() {
                this.$refs.tree.setCheckedKeys([]);
            },
            //点击事件
            handleNodeClick(data) {
                var key = this.$refs.tree.getCheckedKeys();
                if (key.length == 0) {
                    this.$refs.tree.setCheckedNodes([data])
                } else {
                    var newKey = new Array();
                    var ischeck = false;
                    for (var i = 0; i < key.length; i++) {
                        if (key[i] == data.id) {
                            ischeck = true; //是否选中
                        } else {
                            newKey.push(key[i]);
                        }
                    }
                    if (ischeck == false) {
                        newKey.push(data.id);
                    }
                    this.$refs.tree.setCheckedKeys(newKey);
                }
             
            },
            //	节点选中状态发生变化时的回调
            handleNodeChange(data,isCheck,childIsCheck) {
            }

        },

        template: `
      <div class="userPositionlist-tree">
        <el-input
        placeholder="输入关键字进行过滤"
         v-model="filterText">
        </el-input>
       <el-tree
         show-checkbox
         node-key="id"
       :data="treeData"
       :props="defaultProps"
       default-expand-all
       :filter-node-method="filterNode"
       ref="tree"
       @node-click="handleNodeClick"
       @check-change="handleNodeChange">
       </el-tree>

      
        
      </div>
    `
    }
});