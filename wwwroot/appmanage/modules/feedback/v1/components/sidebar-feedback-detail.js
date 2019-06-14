define([
  'framework/mixins/sidebar-form',
  'api/operation/v1/Feedback'
], function (
  sideBarForm,
  Feedback
) {
    'use strict';

    return {
      name: 'SidebarFeedbackDetail',

      mixins: [ sideBarForm ],

      created: function () {
        this.asyncGetDeviceDetail();
      },

      data: function () {
        return {
          formData: {
            Telphone: null,
            CreateTime: null,
            CustomerName: null,
            Content: null,
          },
        }
      },

      computed: {
        id: function () {
          return this.incomingData.id;
        }
      },

      methods: {
        asyncGetDeviceDetail: function () {
          var self = this;
          Feedback
            .Detail({ ID: this.id })
            .then(function (data) {
              _.assign(self.formData, data);
            });
        },

      },

      template: `
        <ych-sidebar-layout>
          <ych-form
            :data="formData">

            <el-form-item prop="Telphone" label="反馈人:">
              {{ formData.Telphone }}
            </el-form-item>

            <el-form-item prop="CreateTime" label="反馈时间:">
              {{ formData.CreateTime | timeFormate }}
            </el-form-item>

            <el-form-item prop="CustomerName" label="反馈门店:">
              {{ formData.CustomerName }}
            </el-form-item>

            <ych-form-item prop="CustomerName" label="反馈内容:" double>
              <div v-html="formData.Content"></div>
            </ych-form-item>

          </ych-form>
        </ych-sidebar-layout>
      `
    }
  });