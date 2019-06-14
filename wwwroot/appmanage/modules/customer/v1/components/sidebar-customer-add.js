define([
  'framework/mixins/sidebar-form',
  'api/operation/v1/Customer'
], function (
  sideBarForm,
  Customer
) {
    'use strict';

    return {
      name: 'SidebarCustomerAdd',

      mixins: [sideBarForm],

      data: function () {
        return {
          formData: {
            Account: null,
            CustomerName: null,
            Password: 'admin'
          },

          rules: {
            Account: [
              { required: true, message: '请输入账号', trigger: 'blur' }
            ],
            CustomerName: [
              { required: true, message: '请输入主体名称', trigger: 'blur' }
            ]
          },
        }
      },

      methods: {
        save: function () {
          var self = this;
          return Customer
                  .Add(this.formData)
                  .then(function () {
                    self.$message.success('新增客户成功！');
                    return;
                  });
        },

      },

      template: `
        <ych-sidebar-layout>
          <side-bar-form
            :model="formData"
            :rules="rules">

            <el-form-item prop="Account" label="账号">
              <el-input v-model="formData.Account"/>
            </el-form-item>

            <el-form-item prop="CustomerName" label="主体名称">
              <el-input v-model="formData.CustomerName"/>
            </el-form-item>

            <el-form-item prop="Password" label="密码">
              <el-input :value="formData.Password" disabled/>
            </el-form-item>

          </side-bar-form>
        </ych-sidebar-layout>
      `
    }
  });