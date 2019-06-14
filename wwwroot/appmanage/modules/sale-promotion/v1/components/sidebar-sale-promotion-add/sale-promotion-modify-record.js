define([
], function() {
    'use strict';
    
    return {
        name: 'SalePromotionModifyRecord',

        data: function () {
            var self = this;



            return {
                formData: {

                },

                showSetting: {

                },

                rules: {
                }
            };
        },

        methods: {
            validate: function () {
                return this.$refs.form.validate();
            },

            getData: function () {
                return _.extend({
                });
            }
        },

        template: `
            <div>
                <side-bar-form 
                    ref="form"
                    :model="formData"
                    :rules="rules"
                    :inline="false">
                </side-bar-form>
            </div>
        `
    }
});