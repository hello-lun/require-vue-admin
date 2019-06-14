define([
    'components/member-info-dialog/info-tab-pane',
    'components/member-info-dialog/buy-record-tab-pane'
], function(
    infoTabPane,
    buyRecordTabPane
) {
    'use strict';
    
    return {
        name: 'MemberInfoDialog',

        components: {
            InfoTabPane: infoTabPane,
            BuyRecordTabPane: buyRecordTabPane
        },

        props: {
            visible: {
                type: Boolean,
                default: false
            },

            id: String
        },

        data: function () {
            return {
                tabsActive: 'memberInfo'
            }
        },

        computed: {
            dialogVisible: {
                get: function () {
                    return this.visible;
                },

                set: function (val) {
                    this.$emit('update:visible', val);
                    if (val === false) {
                        this.tabsActive = 'memberInfo';
                        this.$emit('update:id', null);
                        this.$refs.info.clearData();
                        this.$refs.buyRecord.clearData();
                    }
                }
            },

            tabActiveIsInfo: function () {
                return this.tabsActive === 'memberInfo'
            }
        },

        template: `
            <el-dialog 
                title="会员资料" 
                width="900px"
                :visible.sync="dialogVisible">

                <el-tabs v-model="tabsActive">
                    <el-tab-pane label="会员资料" name="memberInfo">
                        <info-tab-pane ref="info" :id="id">
                        </info-tab-pane>
                    </el-tab-pane>
                    <el-tab-pane label="购买记录" name="buyRecord">
                        <buy-record-tab-pane 
                            ref="buyRecord" 
                            :is-active="tabActiveIsInfo"
                            :id="id">
                        </buy-record-tab-pane>
                    </el-tab-pane>
                </el-tabs>

                <span slot="footer">
                    <ych-button @click="dialogVisible = false">关闭</ych-button>
                </span>
            </el-dialog>
        `
    }
});