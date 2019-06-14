define([
  'framework/mixins/sidebar-form',
  'components/device-type-add-dialog/index',
  'api/operation/v1/DeviceType',
  'api/operation/v1/Software',
], function (
  sideBarForm,
  DeviceTypeAddDialog,
  DeviceType,
  Software
) {
    'use strict';

    return {
      name: 'SidebarSoftwareAdd',

      components: {
        DeviceTypeAddDialog: DeviceTypeAddDialog
      },

      mixins: [sideBarForm],

      created: function () {
        this.asyncGetDeviceList();
      },

      data: function () {
        return {
          formData: {
            // 软件包文件 nos/oss key
            SoftwareKey: null,
            // 设备类型编码
            DeviceTypeCode: null,
            // 软件包版本
            Version: null,
            // 软件包名称
            Name: null,
            // 版本备注说明
            Remarks: null,
          },
          rules: {
            SoftwareKey: [
              { required: true, message: '请上传服务命名规范的软件包', trigger: 'blur' }
            ],
            DeviceTypeCode: [
              { required: true, message: '请选择软件包对应的适用设备', trigger: 'blur' }
            ],
            Remarks: [
              { required: true, message: '请描述说明软件包', trigger: 'blur' }
            ],
          },

          deviceTypeDialogVisible: false,

          deviceList: []
        }
      },

      methods: {
        add: function () {
          var self = this;

          return new Promise(function (resolve, reject) {
            Software
              .Add(self.formData)
              .then(function () {
                resolve();
                self.$message.success('软件版本添加成功');
              }, function () {
                reject();
              })
              .catch(function () { reject() });
          });
        },

        handleFileExceed: function () {
          this.$message.warning('超出上传个数！');
        },

        // 验证文件是否符合命名规范
        validateSoftwareFileName: function (name) {
          // if (name && name.split('_').length !== 5) {
          //   this.$message.error('文件命名不符合规范');
          //   return false;
          // }

          return true;
        },

        handleFileChange: function (uploadName, file) {
          var fileName = file.name;

          if (this.validateSoftwareFileName(fileName)) {
            this.formData.SoftwareKey = uploadName;

            var fileNameArr = fileName.split('.');
            var FileSplitArr = fileNameArr[0].split('_');

            this.formData.Name = FileSplitArr[0];
            this.formData.DeviceTypeCode = FileSplitArr[1];
            this.formData.Version = FileSplitArr[4];
          }
        },

        handleBeforeUpload: function (file) {
          if (!file) return false;
          // 验证文件是否符合命名规范
          return this.validateSoftwareFileName(file.name);
        },

        handleAfterAddDeviceType: function () {
          this.asyncGetDeviceList();
        },

        asyncGetDeviceList: function () {
          var self = this;

          DeviceType
            .List()
            .then(function (data) {
              self.deviceList = data.List || [];
            });
        },

        handleFileRemove: function () {
          _.assign(this.formData, {
            Name: null,
            Version: null,
            SoftwareKey: null
          });
        },
      },

      template: `
        <div>
          <device-type-add-dialog
            :visible.sync="deviceTypeDialogVisible"
            @success="handleAfterAddDeviceType"
          >
          </device-type-add-dialog>
            
          <side-bar-form
            :model="formData"
            :rules="rules">

            <ych-sidebar-layout title="基础信息">
              <ych-form-item prop="SoftwareKey" label="安装包" double>
                <ych-upload
                  upload-type="public"
                  :limit="1"
                  :before-upload="handleBeforeUpload"
                  :on-exceed="handleFileExceed"
                  :on-success="handleFileChange"
                  :on-remove="handleFileRemove">
                  <el-button 
                    :disabled="Boolean(formData.SoftwareKey)"
                    type="primary">
                    上传
                  </el-button>
                </ych-upload>
              </ych-form-item>

              <el-form-item prop="Name" label="软件名称">
                <el-input 
                    v-model="formData.Name"
                    disabled>
                </el-input>
              </el-form-item>

              <el-form-item prop="Version" label="版本号">
                <el-input 
                    v-model="formData.Version"
                    disabled>
                </el-input>
              </el-form-item>

              <el-form-item prop="DeviceTypeCode" label="适用设备">
                <el-select v-model="formData.DeviceTypeCode" clearable>
                  <el-option
                      v-for="item in deviceList"
                      :key="item.Code"
                      :label="item.Name"
                      :value="item.Code">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item>
                <el-button 
                  type="text" 
                  @click="deviceTypeDialogVisible = true">
                  添加类型
                </el-button>
              </el-form-item>

              <ych-form-item prop="Remarks" label="软件说明" double>
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 4, maxRows: 10}"
                  placeholder="请输入内容"
                  v-model="formData.Remarks">
                </el-input>
              </ych-form-item>

            </ych-sidebar-layout>
              
          </side-bar-form>

        </div>
      `
    }
  });