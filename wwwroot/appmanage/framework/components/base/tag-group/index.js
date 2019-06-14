define([
    'incss!framework/components/base/tag-group/styles/index.css'
], function () {
    'use strict';

    var TagGroup = {
        name: 'YchTagGroup',

        props: {
            value: {
                type: Array,
                required: true
            }
        },

        data: function () {
            return {
                inputVisible: false,
                inputValue: ''
            };
        },

        computed: {
            localValue: {
                get: function () {
                    return _.concat([], this.value);
                },

                set: function (val) {
                    this.$emit('input', val);
                }
            }
        },

        methods: {
            handleClose: function(tag) {
                var tagGroupValue = _.concat([], this.localValue);
                tagGroupValue.splice(tagGroupValue.indexOf(tag), 1);

                this.localValue = tagGroupValue;
            },

            showInput: function() {
                var self = this;

                this.inputVisible = true;
                this.$nextTick(function () {
                    self.$refs.saveTagInput.$refs.input.focus();
                });
            },

            handleInputConfirm: function() {
                var self = this,
                    inputValue = this.inputValue,
                    tagGroupValue = _.concat([], this.localValue);

                if (inputValue) {
                    tagGroupValue.push(inputValue);
                    this.localValue = tagGroupValue;
                }
                this.inputVisible = false;
                this.inputValue = '';
            }
        },

        template: `
            <div class="ych-tag-group">
                <el-tag
                    :key="tag"
                    v-for="tag in localValue"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(tag)"
                    size="medium">
                    {{tag}}
                </el-tag>
                <el-input
                    class="ych-tag-group__input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="mini"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm"
                >
                </el-input>
                <el-button 
                    v-else 
                    icon="el-icon-plus" 
                    class="ych-tag-group__btn-new-tag" 
                    size="mini" 
                    @click="showInput">
                    添加
                </el-button>
            </div>
        `
    }

    TagGroup.install = function (Vue) {
        Vue.component(TagGroup.name, TagGroup);
    };

    return TagGroup;
});