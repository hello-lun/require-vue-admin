define([
    'components/base/editor/index',
    'framework/mixins/sidebar-form',
    'framework/api/workbentch/v1/Notice',
    'framework/api/organization/v1/Employee'
], function(YchEditor, sideBarForm, Notice, User) {
    'use strict';

    return {
        name: 'SidebarCreateNotice',

        mixins: [sideBarForm],

        components: {
            YchEditor: YchEditor
        },

        mounted: function () {
             this.fetchUserData();
        },

        data: function () {
            var generateData = function () {
                var data = [];
                for (var i = 1; i <= 15; i++) {
                    data.push({
                        ID: i,
                        Name: `员工 ${ i }`,
                        Position: `销售${ i }`
                    });
                }
                return data;
            };
            return {
                formData: {
                    Topic: '',
                    Content: null,
                    AttchFiles: [],
                    Receivers: [],
                    CarbonCopies: []
                },
                rules: {
                    Topic: [
                        { required: true, message: '请输入公告通知主题', trigger: 'blur' }
                    ],
                    Receivers: [
                        { type:'array', required: true, message: '发送人不能少于一个', trigger: 'change' },
                        // { type:'array', min: 2,  message: '发送人不能少于一个', trigger: 'blur' }
                    ]
                },
                userData: []
            }
        },

        methods: {
            fetchUserData: function () {
                var self = this;             
                User.GetAllEmployee().then(function (res) {
                    self.userData = res.Data;
                });
            },

            send: function (next) {
                var userData = this.formatUserData();

                var fileList = this.formatFileList();

                var commitData = _.extend(
                    {}, 
                    this.formData,
                    {
                        Receivers: userData[0],
                        CarbonCopies: userData[1],
                        AttchFiles: fileList
                    }
                );

                var self = this;
               return Notice.CreateNotice(commitData)
                    .then(function () {
                        self.$message.success('通知新建成功');
                       return Promise.resolve;
                    })
                    .catch(function () {
                      
                    });
            },

            formatFileList: function () {
                return _.map(this.formData.AttchFiles, function (val, index) {
                    return val.response;
                });
            },

            // 格式化 接收人 和 抄送人 的提交数据格式
            formatUserData: function () {
                var self = this,
                    receivers = [],
                    carbonCopies = [];

                _.forEach(this.userData, function (item) {
                    var userId = item.ID;

                    if (self.formData.Receivers.indexOf(userId) > -1) {
                        receivers.push(item)
                    }

                    if (self.formData.CarbonCopies.indexOf(userId) > -1) {
                        carbonCopies.push(item)
                    }
                });

                return [receivers, carbonCopies];
            },
           
            handleFileExceed: function(files, fileList) {
                this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },

            handleFileChange: function (file, fileList) {
                this.formData.AttchFiles = fileList;
            },

            // 组装穿梭框的显示名称
            transferRenderFunc: function (h, option) {
                return h('span', {
                    domProps: {
                        textContent: option.Name + ' - ' + option.Position
                    }
                });
            }
        },

        template: `
            <side-bar-form
                :inline="false"
                :model="formData"
                :rules="rules">

                <el-form-item prop="Topic" label="主题">
                    <el-input 
                        v-model="formData.Topic"
                        placeholder="例：关于采购***设备的审批申请">
                    </el-input>
                </el-form-item>

                <el-form-item>
                    <ych-editor 
                        v-model="formData.Content"
                        ref="quillEditor">
                    </ych-editor>
                </el-form-item>

                <el-form-item prop="AttchFiles" label="附件">
                    <ych-upload
                        ref="upload"
                        multiple
                        :limit="3"
                        :max-size="20480"
                        action="http://deva.rapa.xin/File/api/V1/file/UploadPrivate"
                        :on-exceed="handleFileExceed"
                        :on-change="handleFileChange">
                        <el-button 
                            style="display: block;" 
                            icon="el-icon-plus" size="mini">
                        </el-button>
                        <div slot="tip" class="el-upload__tip">
                            文件大小不能超过20MB
                        </div>
                    </ych-upload>
                </el-form-item>

                <el-form-item prop="Receivers" label="发送">
                    <el-transfer
                        v-model="formData.Receivers"
                        filterable
                        :props="{
                            key: 'ID',
                            label: 'Name'
                        }"
                        :render-content="transferRenderFunc"
                        :titles="['人员列表', '发送至']"
                        :button-texts="['删除', '添加']"
                        :data="userData">
                       
                    </el-transfer>
                </el-form-item>

                <el-form-item prop="CarbonCopies" label="抄送">
                    <el-transfer
                        v-model="formData.CarbonCopies"
                        filterable
                        :props="{
                            key: 'ID',
                            label: 'Name'
                        }"
                        :render-content="transferRenderFunc"
                        :titles="['人员列表', '发送至']"
                        :button-texts="['删除', '添加']"
                        :data="userData">
                       
                    </el-transfer>
                </el-form-item>

            </side-bar-form>
        `
    }
});