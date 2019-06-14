define([
    'framework/api/goods/v1/GoodsClass',
    'goods/views/index/goods-info',
    'goods/views/index/goods-class',
    'goods/views/index/goods-custom',
    'incss!goods/styles/index.css'
], function(
    goodsClass,
    goodsInfoList,
    goodsClassList,
    goodsCustomList
) {
    'use strict';
   
    return {
        name: 'PageGoods',

        components: {
            GoodsInfoList: goodsInfoList,
            GoodsClassList: goodsClassList,
            GoodsCustomList: goodsCustomList
        },

        created: function () {
            this.asyncGetGoodsClass();
            var self = this;
            this.$eventBus.$on('goods__goods-class--updated', function () {
                self.asyncGetGoodsClass();
            })
        },

        data: function () {
            return {
                goodsClassData: [],
                treeProps: {
                    label: 'Name',
                    children: 'Childs',
                    id: 'ID'
                },
                tabActive: 'goodsInfo'
            }
        },

        methods: {
            // 获取商品分类
            asyncGetGoodsClass: function () {
                var self = this;

                goodsClass.GetTree()
                    .then(function (data) {
                        self.goodsClassData = [{
                            Childs: data.Data,
                            Name: '所有商品分类',
                            ID: 'all'
                        }];
                    });
            },

            handleTreeCommand: function (item) {
                var data = item.data;
                
                switch (item.type) {
                    case 'edit':
                        this.$refs.goodsClass.editGoodsClass({ID: data.ID});
                        break;
                    
                    case 'add':
                        this.$refs.goodsClass.addGoodsClass();
                        break;

                    case 'delete':
                        this.$refs.goodsClass.deleteGoodsClass({ID: data.ID});
                        break;
                }
            },

            handleTreeNodeClick: function (data) {
            },

            // 处理树形结构项右侧菜单render
            handleMenuRender: function (item) {
                var data = item.data,
                    node = item.node;
                return (node.level === 1) 
                        ? { 'add': '新增级别' }
                        : {
                            'edit': '编辑',
                            'delete': '删除'
                        };
            }
        },

        template: `
            <el-container 
                :body-style="{'width': '220px'}" 
                style="min-height: 100%;">

                <el-card :body-style="{'height': '100%'}" >

                    <el-aside 
                        style="height: 100%"
                        width="200px">

                        <ych-tree
                            ref="mainlisttree"
                            :data="goodsClassData"
                            :data-props="treeProps"
                            node-key="ID"
                            :default-expanded-keys="['all']"
                            @menu-command="handleTreeCommand"
                            :menu-render="handleMenuRender"
                            @node-click="handleTreeNodeClick">
                        </ych-tree>

                    </el-aside>

                </el-card>

                <el-card 
                    :body-style="{'height': '100%'}" 
                    style="margin-left: 10px;flex: 1;">

                    <el-tabs v-model="tabActive">

                        <el-tab-pane 
                            label="商品信息" 
                            name="goodsInfo">
                            <goods-info-list>
                            </goods-info-list>
                        </el-tab-pane>

                        <el-tab-pane 
                            label="商品分类" 
                            name="goodsClass">
                            <goods-class-list 
                                ref="goodsClass"
                                @update-class="asyncGetGoodsClass">
                            </goods-class-list>
                        </el-tab-pane>

                        <el-tab-pane 
                            label="自定义属性" 
                            name="customProps">
                            <goods-custom-list></goods-custom-list>
                        </el-tab-pane>
                    </el-tabs>
                </el-card>

            </el-container>
        `
    }
});