define([
    'quill-editor'
], function(QuillEditor) {
    'use strict';
    // 静态资源
    // var UPLOAD_PATH = 'https://jsonplaceholder.typicode.com/posts/';
    
    var Editor = {
        name: 'YchEditor',

        components: {
            QuillEditor: QuillEditor.quillEditor
        },

        mounted: function () {
            // 绑定editor的图片上传icon点击处理事件
            this.$refs.quillEditor.quill.getModule('toolbar').addHandler('image', this.imgHandler)
        },

        props: {
            value: String,
            height: {
                type:String,
                default: '200px'
            },
            options: {
                type: Object,
                default: function () {
                    return {
                        theme: 'snow',
                        placeholder: '请输入内容',
                        modules: {
                            toolbar: '#toolbar'
                        }
                    }
                }
            }
        },

        data: function () {
            return {
                uploading: false,
                addRange: []
            };
        },

        computed: {
            editorContent: {
                get: function () {
                    return this.value;
                },

                set: function (val) {
                    this.$emit('input', val);
                }
            },

            parentListeners: function () {
                var listeners = _.extend({}, this.$listeners);
                listeners.input && delete listeners.input;
                return listeners;
            }
        },

        methods: {
            instance: function () {
                return this.$refs.quillEditor;
            },

            imgHandler: function () {
                this.uploading = true;
                // 获取当前光标在内容区的位置
                this.addRange = this.$refs.quillEditor.quill.getSelection();
                // 触发选择文件按钮的点击事件
                this.$refs.imgBtn.$el.click();
            },

            uploadSuccess: function (response, file, fileList) {
                console.log(response, file, fileList);
                this.uploading = false;
                var self = this,
                    imageUrl = file.url;

                console.log(imageUrl);

                this.addRange = this.$refs.quillEditor.quill.getSelection();
                this.$nextTick(function () {
                    self.$refs.quillEditor.quill.insertEmbed(
                        self.addRange !== null ? self.addRange.index : 0, 
                        'image', 
                        imageUrl, 
                        'user'
                    );

                    self.$refs['upload'].clearFiles();
                });
            }
        },

        template: `
            <quill-editor
                v-model="editorContent"
                v-loading="uploading"
                element-loading-text="图片上传中..."
                ref="quillEditor"
                :options="options"
                v-on="parentListeners"
                :style="{height: height, 'margin-bottom': '42px'}">
                <div id="toolbar" slot="toolbar">
                    <!-- Add a bold button -->
                    <button class="ql-bold">Bold</button>
                    <button class="ql-italic">Italic</button>
                    <button class="ql-strike">strike</button>
                    <button class="ql-underline">underline</button>

                    <button class="ql-background">background</button>
                    <button class="ql-color">color</button>

                    <!-- Add font size dropdown -->
                    <select class="ql-size">
                        <option value="small"></option>
                        <!-- Note a missing, thus falsy value, is used to reset to default -->
                        <option selected></option>
                        <option value="large"></option>
                        <option value="huge"></option>
                    </select>

                    <button class="ql-align">align</button>
                    <button class="ql-align" value="right">align</button>
                    <button class="ql-align" value="center">align</button>


                    <button class="ql-blockquote">blockquote</button>

                    <!-- Add subscript and superscript buttons -->
                        <button class="ql-list" value="ordered"></button>
                        <button class="ql-list" value="bullet"></button>
                        <!--button class="ql-script" value="sub"></button>
                        <button-- class="ql-script" value="super"></button-->
                        
                    <!-- You can also add your own -->
                    <button class="ql-link"></button>
                    <button class="ql-image"></button>

                    <ych-upload
                        ref="upload"
                        style="display: none;"
                        :on-success="uploadSuccess">
                        <el-button 
                            ref="imgBtn" 
                            slot="trigger" 
                            style="color:buttontext;" type="text" icon="el-icon-picture">
                        </el-button>
                    </ych-upload>
                </div>
            </quill-editor>
        `
    }

    Editor.install = function (Vue) {
        Vue.component(Editor.name, Editor);
    };

    return Editor;
});