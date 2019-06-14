define([
    'organization/components/main-container/customer-list',
    'organization/components/main-container/department-list',
    'organization/components/main-container/position-list',
    'organization/components/main-container/user-list',
    'organization/components/main-container/authority-list'
], function (
    customerList,
    departmentList,
    positionList,
    userList,
    authorityList
) {
        'use strict';
        return {
            //点击了哪一个tab
            props: ['selecttab'],
            //渲染一个“元组件”为动态组件
            components: {
                'customerlist': customerList,
                'departmentlist': departmentList,
                'positionlist': positionList,
                'userlist': userList,
                'authoritylist': authorityList
            },
            //创建组件
            created: function () {

            },
            //计算属性和观察者
            computed: {

            },
            //侦听器
            watch: {
                selecttab: {
                    deep: true,//还可以加一个deep，表示跟踪所有对象下的属性
                    handler: function (newval, oldval) {
                        this.selecttab = newval;
                        // if (newval) {                                       
                        //商户tab
                        if (newval.nodeType == 1) {
                            this.activeName = 'customer';
                            this.tabList =
                                [
                                    { label: "商户管理", name: 'customer' },
                                    { label: "部门管理", name: 'department' },
                                    { label: "岗位管理", name: 'position' },
                                    { label: "员工管理", name: 'user' },
                                    // { label: "权限管理", name: 'authority' }
                                ];
                            this.addCustomerShow = false;
                            this.addDepartmentShow = true;
                            this.addPositionShow = true;
                            this.addUserShow = true;
                            // this.saveAuthorityShow = false;
                            // this.saveSuperiorAuthorityShow = false;                            
                        }
                        //部门tab
                        else if (newval.nodeType == 2) {
                            this.activeName = 'department';
                            this.tabList =
                                [
                                    { label: "部门管理", name: 'department' },
                                    { label: "岗位管理", name: 'position' },
                                    { label: "员工管理", name: 'user' },
                                    { label: "权限管理", name: 'authority' }
                                ];
                            this.addCustomerShow = false;
                            this.addDepartmentShow = true;
                            this.addPositionShow = true;
                            this.addUserShow = true;
                            // this.saveAuthorityShow = false;
                            // this.saveSuperiorAuthorityShow = false;

                        }
                        //岗位tab
                        else if (newval.nodeType == 3) {
                            this.activeName = 'user';
                            this.tabList =
                                [
                                    { label: "员工管理", name: 'user' },
                                    { label: "权限管理", name: 'authority' }
                                ];
                            this.addCustomerShow = false;
                            this.addDepartmentShow = false;
                            this.addPositionShow = false;
                            this.addUserShow = true;
                            //  this.saveAuthorityShow = false;
                            //this.saveSuperiorAuthorityShow = false;
                        }
                        //员工tab
                        else if (newval.nodeType == 4) {
                            this.activeName = 'authority';
                            this.tabList =
                                [
                                    { label: "权限管理", name: 'authority' }
                                ];
                            this.addCustomerShow = false;
                            this.addDepartmentShow = false;
                            this.addPositionShow = false;
                            this.addUserShow = false;
                            // this.saveAuthorityShow = true;
                            // this.saveSuperiorAuthorityShow = true;
                        }


                        this.tablename = newval;
                        this.btnname = newval;

                        if (newval != null) {
                            console.log('新', newval.name);
                        }
                        if (oldval != null) {
                            console.log('旧', oldval.name);
                        }


                    }
                },
            },
            data: function () {
                return {
                    activeName: 'customer',
                    tabList: [
                        { label: "商户管理", name: 'customer' },
                        { label: "部门管理", name: 'department' },
                        { label: "岗位管理", name: 'position' },
                        { label: "员工管理", name: 'user' }
                        //,{ label: "权限管理", name: 'authority' }
                    ],
                    addCustomerShow: false,
                    addDepartmentShow: true,
                    addPositionShow: true,
                    addUserShow: true,
                    // saveAuthorityShow: false,
                    // saveSuperiorAuthorityShow: false,
                    tablename: this.selecttab,
                    btnname: this.selecttab,
                    authoritytable: this.selecttab
                };

            },
            methods: {
                //点击tab切换table内容
                handleClick: function (tab, event) {

                    //点击商户tab
                    if (tab.name == "customer") {
                        this.addCustomerShow = false;
                        this.addDepartmentShow = true;
                        this.addPositionShow = true;
                        this.addUserShow = true;
                        //this.saveAuthorityShow = false;
                        //this.saveSuperiorAuthorityShow = false; 
                    }
                    //点击部门tab
                    else if (tab.name == "department") {
                        this.addCustomerShow = false;
                        this.addDepartmentShow = true;
                        this.addPositionShow = true;
                        this.addUserShow = true;
                        //this.saveAuthorityShow = false;
                        //this.saveSuperiorAuthorityShow = false;
                    }
                    //点击岗位tab
                    else if (tab.name == "position") {
                        this.addCustomerShow = false;
                        this.addDepartmentShow = false;
                        this.addPositionShow = true;
                        this.addUserShow = true;
                        this.saveAuthorityShow = false;
                        this.saveSuperiorAuthorityShow = false;
                    }
                    //点击员工tab
                    else if (tab.name == "user") {
                        this.addCustomerShow = false;
                        this.addDepartmentShow = false;
                        this.addPositionShow = false;
                        this.addUserShow = true;
                        //this.saveAuthorityShow = false;
                        //this.saveSuperiorAuthorityShow = false;
                    }
                    //点击权限管理tab
                    else if (tab.name == "authority") {
                        this.addCustomerShow = false;
                        this.addDepartmentShow = false;
                        this.addPositionShow = false;
                        this.addUserShow = false;
                        //this.saveAuthorityShow = true;
                        // //初始化树形加载右边tab
                        // if (this.selecttab == null) {
                        //    this.saveSuperiorAuthorityShow = false;
                        // }
                        // //点击节点加载右边tab
                        // else {
                        //    if (this.selecttab.nodeType != 1) {
                        //         this.saveSuperiorAuthorityShow = true;
                        //     } else {
                        //         this.saveSuperiorAuthorityShow = false;
                        //     }
                        // }
                    }
                },
                addCustomer: function () {

                },
                //新增部门
                addDepartment: function () {
                    this.selectbtn = this.tablename;
                    this.$emit('department-add', this.btnname);


                },
                //编辑部门
                handleDepartmentEidt: function (id) {
                    this.$emit('department-edit', id);
                },
                //删除事件刷新数据
                handleDepartmentDel: function (e) {
                    this.$refs.departmentlistdata[0].refreshDepartmentListData(this.tablename);
                    this.$emit('department-del', this.tablename);
                },

                //新增岗位
                addPosition: function () {
                    this.selectbtn = this.tablename;
                    this.$emit('position-add', this.btnname);
                },
                //编辑岗位
                handlePositionEidt: function (id) {
                    this.$emit('position-edit', id);
                },
                //删除事件刷新数据
                handlePositionDel: function (e) {
                    this.$refs.positionlistdata[0].refreshPositionListData(this.tablename);
                    this.$emit('position-del', this.tablename);
                },
                //新增员工
                addUser: function () {
                    this.selectbtn = this.tablename;
                    this.$emit('user-add', this.btnname);
                },
                //修改员工
                handleUserEidt: function (id) {
                    this.$emit('user-edit', id);
                },
                //删除事件刷新数据
                handleUserDel: function (e) {
                    this.$refs.userlistdata[0].refreshUserListData(this.tablename);
                    this.$emit('user-del', this.tablename);
                },
                //刷新
                refreshData: function (e, nodeType) {
                    console.log(e, "点击节点刷新", nodeType);
                    this.tablename = e;
                    this.btnname = e;
                    if (nodeType == 2) {
                        if (this.$refs.departmentlistdata.length != 0) {
                            this.$refs.departmentlistdata[0].refreshDepartmentListData(this.tablename);
                        }
                    } else if (nodeType == 3) {
                        if (this.$refs.positionlistdata.length != 0) {
                            this.$refs.positionlistdata[0].refreshPositionListData(this.tablename);
                        }
                    } else if (nodeType == 4) {
                        if (this.$refs.userlistdata.length != 0) {
                            var i = this.$refs.userlistdata;
                            this.$refs.userlistdata[0].refreshUserListData(this.tablename);
                        }
                    }
                    if (nodeType > 2) {
                        if (this.$refs.authoritylistdata.length != 0) {
                            this.$refs.authoritylistdata[0].refreshData();
                        }
                    }
                }
            },

            template: `  
    <el-tabs v-model="activeName" @tab-click="handleClick">   
<el-tab-pane v-for="item in tabList" :key="item.id" v-bind:label="item.label" v-bind:name="item.name" >
        <customerlist ref="customerlistdata" :key="item.id" v-if="item.name==='customer'" :selecttable="tablename"  ></customerlist>
        <departmentlist ref="departmentlistdata"  :key="item.id" @edit="handleDepartmentEidt" @del="handleDepartmentDel"  v-if="item.name==='department'"  :selecttable="tablename" ></departmentlist>
        <positionlist ref="positionlistdata" :key="item.id" @edit="handlePositionEidt"  @del="handlePositionDel" v-if="item.name==='position'" :selecttable="tablename"  ></positionlist>
        <userlist 
        ref="userlistdata" 
        :key="item.id" 
        @edit="handleUserEidt"  
        @del="handleUserDel" 
        v-if="item.name==='user'" 
        :selecttable="tablename"   >
        </userlist>
        
        <authoritylist 
        ref="authoritylistdata" 
        :key="item.id" 
        v-if="item.name==='authority'"
        :selecttable="tablename" >
        </authoritylist>

    <el-footer>
                <el-button type="primary" @click.sync="addCustomer"  v-show="addCustomerShow">保存商户</el-button>

                <el-button id="addDepartment" type="primary" @click.sync="addDepartment" v-show="addDepartmentShow" :selectbtn="btnname">新增部门
                    
                </el-button>

                <el-button type="primary" @click.sync="addPosition" v-show="addPositionShow" :selectbtn="btnname">新增岗位</el-button>
                <el-button type="primary" @click.sync="addUser" v-show="addUserShow" :selectbtn="btnname" >新增员工</el-button>
                
        </el-footer>
</el-tab-pane>        
    </el-tabs>
`
        }
    });