define([
    'framework/components/permission-list/index',
    'framework/api/organization/FunctionalAuth'
], function (permissionList, FunctionalAuth) {
    'use strict';

    return {
        props: ['selecttable'],
        //渲染一个“元组件”为动态组件
        components: {
            'permission-list': permissionList
        },
        //创建组件
        created: function () {
            ////请求授权网站取得权限列表
            //this.asyncGetAuthorityData();
        },
        //计算属性和观察者
        computed: {

        },
        //侦听器
        watch: {
            selecttable: {
                deep: true,//还可以加一个deep，表示跟踪所有对象下的属性
                handler: function (newval, oldval) {
                    console.log("选中的节点(" + newval.name + ")---权限");

                    this.selecttable = newval;

                    this.refreshData();
                }
            }
        },
        data: function () {
            return {
                searchKey: '',
            }
        },
        methods: {

            query: function () {
                alert("查询");
            },
            ////请求授权网站取得权限列表
            //asyncGetAuthorityData: function () {
            //    console.log("当前节点" + this.selecttable.name+"  请求授权网站取得权限列表，展示在页面上");
            //},
            ////根据当前已选中的节点id获取已勾选的权限
            //asyncGetNodeAuthorityData: function () {
            //    console.log("当前节点信息id:" + this.selecttable.id+"名称"+ this.selecttable.name+"把当前节点的id传入后台去取已保存好的权限,把已展示在页面上的权限打勾");
            //},
            //请求授权网站取得权限列表
            asyncGetAuthorityData: function () {
                console.log("当前节点" + this.selecttable.name + ";父级节点" + this.selecttable.parentID + "  请求授权网站取得权限列表，展示在页面上");
            },
            //根据当前已选中的节点id获取已勾选的权限
            asyncGetNodeAuthorityData: function () {
                console.log("当前节点信息id:" + this.selecttable.id + "名称" + this.selecttable.name + "把当前节点的id传入后台去取已保存好的权限,把已展示在页面上的权限打勾");
            },
            //保存权限
            saveAuthority: function () {
                var self = this;
                var requst = this.$refs.permission.save();
                FunctionalAuth.save(requst)
                    .then(function (data) {
                        self.$message({
                            message: '保存成功',
                            type: 'success'
                        });

                        self.refreshData();
                    });
            },
            //同步上级权限
            saveSuperiorAuthority: function () {
                var self = this;
                //获取同样的权限
                var requst = this.$refs.permission.save();
                FunctionalAuth.syncSuperiorAuth(requst)
                    .then(function (data) {
                        self.$message({
                            message: '同步上级权限成功',
                            type: 'success'
                        });

                        self.refreshData();
                    });
            },
            //刷新事件
            refreshData: function () {
                //this.asyncGetNodeAuthorityData();
                this.$refs.permission.fetchUserPermissionList();
                console.log("刷新事件" + this.selecttable.name);
            }
        },

        template: ` 
           <div>
                <div>
                    <label>关键字：</label>
                    <el-input 
                        v-model="searchKey" 
                        placeholder="请输入内容">
                    </el-input>
                    <el-button 
                        @click="$refs.permission.search(searchKey)" 
                        type="primary">
                        查询
                    </el-button>
                </div>
                <permission-list 
                    ref="permission" 
                    :selected-node="selecttable">
                </permission-list>
                <el-footer>
                    <el-button 
                        type="primary" 
                        @click.sync="saveAuthority">
                        保存
                    </el-button>
                    <el-button 
                        type="primary" 
                        @click.sync="saveSuperiorAuthority">
                        同步上级权限
                    </el-button>
                    <el-button 
                        type="primary" 
                        @click.sync="refreshData">
                        刷新
                    </el-button>
                </el-footer>
            </div>
        `
    }
});