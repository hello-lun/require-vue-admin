define([
    'framework/api/price/v1/PricePromotionClass',
    'framework/api/price/v1/PricePromotion',
    'components/cascader-sale-promotion-class/index',
    'modules/sale-promotion/v1/views/index/sale-promotion',
    'modules/sale-promotion/v1/components/sibebar-sale-promotion-class'
], function (
    PricePromotionClass,
    PricePromotion,
    cascaderSalePromotionClass,
    salePromotionList,
    sibebarSalePromotionClass
) {
    'use strict';

    return {
        name: 'PageSalePromotion',

        components: {
            SalePromotionList:salePromotionList
        },

        created: function () {
            this.asyncGetSalePromotion();
        },

        data: function () {
            return {
                salePromotionData: [],
                treeProps: {
                    label: 'Name',
                    children: 'Childs',
                    id: 'ID'
                },
                icons: ['ych-icon-zongbu', 'ych-icon-bumen'],
                tabActive: 'salePromotion'
            }
        },

        methods: {
            asyncGetSalePromotion: function () {
                var self = this;
                PricePromotionClass.GetTree()
                    .then(function (data) {
                        console.log(data)
                        self.salePromotionData = [{
                            Childs: data.Data,
                            Name: '全部',
                            ID: '00000000-0000-0000-0000-000000000000'
                        }];
                    });
            },

            addPromotionClass: function(item){
                const self = this;

                this.sideBar({
                    title: '新增活动分类',
                    datas: {
                        ID: item.ID,
                        isEdit: false
                    },
                    modules: [{
                        component: sibebarSalePromotionClass
                    }],
                    operation: [{
                        label: '保存',
                        value: 'save'
                    }],
                    success: function (data) {
                        self.$message({
                            message: '分类保存成功！',
                            type: 'success'
                        });
                        self.asyncGetSalePromotion();
                    }
                }).show();
            },
            editPromotionClass: function(item){
                const self = this;

                this.sideBar({
                    title: '编辑活动分类',
                    datas: {
                        ID: item.ID,
                        currentItem: item,
                        isEdit: true
                    },
                    modules: [{
                        component: sibebarSalePromotionClass
                    }],
                    operation: [{
                        label: '保存',
                        value: 'save'
                    }],
                    success: function (data) {
                        self.$message({
                            message: '分类保存成功！',
                            type: 'success'
                        });
                        self.asyncGetSalePromotion();
                    }
                }).show();
            },

            handleTreeCommand: function (item) {
                var self = this;
                switch (item.type) {
                    case 'edit':
                        this.editPromotionClass(item.data);
                        break;

                    case 'add':
                        this.addPromotionClass(item.data);
                        break;

                    case 'delete':
                    
                        PricePromotionClass.Delete({ID:item.data.ID}).then(function(data){
                            self.$message({
                                message: '删除活动成功！',
                                type: 'success'
                            });
                            self.asyncGetSalePromotion();
                        });
                        break;
                }
            },

            handleTreeNodeClick: function (data) {
                console.log(data)
                this.$refs.salePromotionList.resetPromotionClassID(data.ID);
            },

            // 处理树形结构项右侧菜单render
            handleMenuRender: function (item) {
                var data = item.data,
                    node = item.node;
                if (data.ID == '00000000-0000-0000-0000-000000000000') {
                    return {
                        'add': '新增子活动'
                    };
                } else {
                    return {
                        'add':'新增子活动',
                        'edit':'重命名',
                        'delete':'删除'
                    }
                }
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
                            :data="salePromotionData"
                            :data-props="treeProps"
                            :level-icon="icons"
                            node-key="ID"
                            :default-expanded-keys="['00000000-0000-0000-0000-000000000000']"
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
                            label="促销方案" 
                            name="salePromotion">
                            <sale-promotion-list ref='salePromotionList'></sale-promotion-list>
                        </el-tab-pane>
                    </el-tabs>
                </el-card>

            </el-container>
        `
    }
});