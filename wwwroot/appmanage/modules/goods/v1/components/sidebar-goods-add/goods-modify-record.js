define([
    'api/product/v1/Product'
], function(
    product
) {
    'use strict';
    
    return {
        name: 'CustomAttrDialog',

        props: {
            incomingData: ''
        },

        created: function () {
            this.asyncGetModifyRecord();
        },

        data: function () {
            return {
                dataList: [],

                formData: {
                    UpdatedTimeStart: null,
                    UpdatedTimeEnd: null,
                    Operator: null
                }
            };
        },

        computed: {
            updateTime: {
                get: function () {
                    return [this.formData.UpdatedTimeStart, this.formData.UpdatedTimeEnd]
                },

                set: function (val) {
                    val = val || [];

                    this.formData.UpdatedTimeStart = val[0];
                    this.formData.UpdatedTimeEnd = val[1];
                }
            }
        },

        methods: {
            asyncGetModifyRecord: function () {
                var self = this;
                
                this.$nextTick(function () {
                    var submitData = self.handleSubmitData();

                    product
                        .SerachEditLog(submitData)
                        .then(function (res) {
                            self.dataList = res.Data;
                        });
                });
            },

            handleQueryEvent: function () {
                this.asyncGetModifyRecord();
            },

            handleSubmitData: function() {
                return _.extend(
                    {},
                    this.formData,
                    this.paginationInfo,
                    { 
                        GoodsID: this.incomingData.id,
                        PageSize: 1000,
                        PageIndex: 1
                    }
                );
            }
        },

        template: `
            <ych-sidebar-layout>
                <ych-table
                    :data="dataList"
                    :column-controller="false">

                    <ych-table-column-format
                        prop="UpdatedTime"
                        label="修改时间"
                        width="150"
                        format-type="date"
                        sortable>
                    </ych-table-column-format>

                    <el-table-column
                        prop="Operator"
                        label="修改人"
                        width="100"
                        sortable>
                    </el-table-column>
                    
                    <el-table-column
                        prop="OperatorLog"
                        label="修改记录"
                        sortable>
                    </el-table-column>

                </ych-table>
            </ych-sidebar-layout>
        `
    }
});