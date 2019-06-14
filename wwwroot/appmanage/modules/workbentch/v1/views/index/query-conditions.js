define([
], function() {
    'use strict';
    
    return {
        name: 'QueryConditions',

        data: function () {
            // 默认前30天
            var now = new Date(),
                preThirty = new Date(now - 1000 * 60 * 60 * 24 * 30);

            var dateFormat = function (date) {
                return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            }

            return {
                formData: {
                    Type: 'All',
                    OriginSource: 'IStarted',
                    CreateTime: [dateFormat(preThirty), dateFormat(now)],
                    Keyword: ''
                },
                taskType: {
                    All: '所有',
                    Excute: '执行实施',
                    Approve: '审批申请',
                    Notice: '公告通知'
                },
                taskOriginSource: {
                    IStarted: '我发起的',
                    SendToMe: '发送给我的',
                    CopyToMe: '抄送给我的',
                    All: '全部'
                }
            }
        },

        computed: {
            // 待办单选框组
            taskOriginSourceOfRadio: function () {
                var source = _.extend({}, this.taskOriginSource);
                delete source.CopyToMe;

                return source;
            }
        },

        methods: {
            submit: function () {
                var data = _.extend({}, this.formData);

                data.StartTime = data.CreateTime[0];
                data.EndTime = data.CreateTime[1];

                delete data.CreateTime;
                
                this.$emit('subimit', data);
            }
        },
        
        template: `
            <ych-form ref="ychform" :model="formData">
                <el-row type="flex" justify="space-between">
                    <div>
                        <el-form-item label="">
                            <el-radio-group v-model="formData.OriginSource">
                                <el-radio-button 
                                    v-for="(val, key) in taskOriginSourceOfRadio"
                                    :key="key"
                                    :label="key">
                                    {{ val }}
                                </el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="任务类型">
                            <el-select v-model="formData.Type">
                                <el-option 
                                    v-for="(val, key) in taskType"
                                    :key="key"
                                    :label="val" 
                                    :value="key">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="创建时间">
                            <el-date-picker
                                v-model="formData.CreateTime"
                                type="daterange"
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="关键字搜索">
                            <el-input 
                                v-model="formData.Keyword"
                                placeholder="请输入相关内容进行搜索">
                            </el-input>
                        </el-form-item>
                    </div>
                    
                    <div style="width: 120px;">
                        <el-form-item>
                            <el-button 
                                @click="submit" 
                                type="primary">
                                查询
                            </el-button>
                        </el-form-item>
                    </div>
                </el-row>
            </ych-form>
        `
    }
});