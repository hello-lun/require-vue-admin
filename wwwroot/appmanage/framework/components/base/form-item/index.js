define([
    'vue',
    'ELEMENT',
    'components/base/tips/index',
    'incss!components/base/form-item/styles/index.css'
], function(
    Vue,
    ELEMENT,
    tipsComponent
) {
    'use strict';

    var FormItem = {
        name: 'YchFormItem',

        extends: ELEMENT.FormItem,

        props: {
            label: {
                type: String,
                required: true
            },

            prop: {
                required: true
            },

            double: {
                type: Boolean,
                default: false,
            },

            tips: {
                type: String,
                default: ''
            }
        },

        mounted: function () {
            if (this.double) {
                this.$el.querySelector('.el-form-item__content').style.width = '470px';
            }

            if (this.tips) {
                this.renderTips();
            }
        },

        beforeDestroy: function () {
            this.tipsInstance && this.tipsInstance.$destroy();
        },

        data: function () {
            return {
                tipsInstance: null
            };
        },

        methods: {
            renderTips: function () {
                var tipsConstructor = Vue.extend(tipsComponent);
                this.tipsInstance = new tipsConstructor({
                    propsData: {
                        content: this.tips
                    }
                });

                var divDom = document.createElement('div');
                this.$el.append(divDom);
                this.tipsInstance.$mount(divDom);
            }
        }
    }

    FormItem.install = function (Vue) {
        Vue.component(FormItem.name, FormItem);
    };

    return FormItem;
});