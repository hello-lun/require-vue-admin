define([
    'components/base/search/index',
    'framework/api/organization/OrganizationStucture',
    'incss!framework/components/organization-tree/index.css'
], function (search, OrganizationStucture) {
    'use strict';

    var operationMap = {
        'addDepartment': '添加部门',
        'addStation': '添加岗位',
        'addEmployee': '添加员工'
    };

    return {
        name: 'OrganizationTree',
        components: {
            Search: search
        },

        created: function () {
            this.asyncGetOrgData();
        },

        data: function () {
            return {
                filterText: '',
                treeData: null,
                defaultProps: {
                    children: 'children',
                    label: 'name'
                }
            }
        },

        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },

        methods: {
            // 异步获取组织结构数据
            asyncGetOrgData: function () {
                var self = this;
                OrganizationStucture.getAll()
                    .then(function(data) {
                        self.treeData = data || [];
                    });
            },

            levelIconClassName: function (level) {
                var iconClassMap = {
                    0: 'ych-icon-zongbu',
                    1: 'ych-icon-shanghuleixing',
                    2: 'ych-icon-shanghu',
                    3: 'ych-icon-bumen',
                    4: 'ych-icon-gangwei',
                    5: 'ych-icon-yuangong',
                }

                return iconClassMap[level] || '';
            },

            handleMenuCommand: function (command) {
                var arr = command.split('-');
                this.$emit('menu-command', arr[0], arr[1]);
            },

            handleLevelShowMenu: function (h, item) {
                var that = this,
                    node = item.node,
                    data = item.data,
                    store = item.store;
                if ([1, 5].indexOf(data.level) === -1) {
                    return h('el-dropdown', {
                        props: {
                            size: 'small',
                            trigger: 'click'
                        },
                        on: {
                            command: that.handleMenuCommand
                        },
                        nativeOn: {
                            click: that.operationMenuClick
                        }
                    }, [
                            h('i', {
                                style: {
                                    color: '#1B73D8',
                                    visibility: 'hidden'
                                },
                                class: ['ych-icon-caidan']
                            }),

                            h('el-dropdown-menu', {
                                slot: 'dropdown'
                            }, _.map(that.filterOperation(data.level), function (value, key) {
                                return h('el-dropdown-item', {
                                    props: {
                                        command: key + '-' + data.id
                                    },
                                    domProps: {
                                        textContent: value
                                    }
                                })
                            })
                            )
                        ]);
                }
            },

            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },

            filterOperation: function (level) {
                return level === 4 ? { 'addEmployee': '添加员工' } : operationMap
            },

            operationMenuClick: function (e) {
                e.stopPropagation();
            },

            renderContent: function (h, item) {
                var that = this,
                    node = item.node,
                    data = item.data,
                    store = item.store;

                return h('div', {
                    style: {
                        flexGrow: 1,
                        paddingRight: '10px',
                        // maxWidth: '166px'
                    },
                    class: ['org-tree-item']
                }, [
                        h('i', {
                            style: {
                                color: '#1B73D8',
                                // paddingRight: '5px'
                            },
                            class: [that.levelIconClassName(data.level)]
                        }),
                        h('span', {
                            class: ['single-ellipsis'],
                            style: {
                                width: 166 - 18 * (node.level || 1) + 'px',
                                lineHeight: '14px',
                                padding: '0 5px',
                                boxSizing: 'border-box'
                            },
                            domProps: {
                                textContent: data.name
                            },
                        }),
                        that.handleLevelShowMenu(h, item)
                    ]);
            },

            handleNodeClick: function (data, node, instance) {
                this.$emit('node-click', data, node, instance);
            },

            refreshData: function (nodedata) {
                console.log(nodedata, "刷新树形菜单");

                this.asyncGetOrgData();

            },
            getRootData: function () {
                if (this.treeData != null) {

                    return this.treeData[0];
                }

            }

        },

        template: `
            <div class="organization-tree">
                <Search class="tree-search-input" v-model="filterText"/>
                <el-tree 
                ref="tree"
                @node-click="handleNodeClick"
                node-key="id"
                :data="treeData"
                :props="defaultProps"
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                :render-content="renderContent"
                :default-expanded-keys="[1]"
                >
                </el-tree>
            </div>
        `
    }
});