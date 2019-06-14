define([
    'api/number-generate/v1/Number'
], function(number) {
    'use strict';
    
    return {
        name: 'YchInputCode',

        props: {
            value: {
                required: true
            },

            getCode: {
                type: Boolean,
                // require: true,
                default: true
            },

            type: {
                type: String,
                required: true
            },

            disabled: {
                type: Boolean,
                default: false
            }
        },

        computed: {
            localValue: {
                get: function () {
                    return this.value;
                },

                set: function (val) {
                    this.$emit('input', val);
                }
            }
        },

        watch: {
            getCode: {
                immediate: true,
                handler: function (val, oldVal) {
                    val && this.asyncGetUnifiedCode();
                }
            }
        },

        methods: {
            asyncGetUnifiedCode: function () {
                var self = this;
                number.GenerateByType({type: this.type})
                    .then(function (data) {
                        self.localValue = data.Number;
                    });
            },
        },

        template: `
            <el-input 
                v-model="localValue" disabled>
            </el-input>
        `
    }
});