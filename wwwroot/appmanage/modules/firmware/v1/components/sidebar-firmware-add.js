define([
  'framework/mixins/sidebar-form',
  'api/operation/v1/Firmware',
  'components/device-type-add-dialog/index',
  'api/operation/v1/DeviceType',
  'api/operation/v1/Assets',
  // 'assets/components/sidebar-assets-add'
], function (
  sideBarForm,
  Firmware,
  DeviceTypeAddDialog,
  DeviceType,
  Assets,
  // SidebarAssetsAdd
) {
    'use strict';

    return {
      name: 'SidebarFirmwareAdd',

      components: {
        DeviceTypeAddDialog: DeviceTypeAddDialog
      },

      mixins: [sideBarForm],

      created: function () {
        this.asyncGetDeviceList();
        this.asyncGetAssetsList();

        this.activatedOfPage();
      },

      data: function () {
        return {
          formData: {
            // 固件包文件 nos/oss key
            FirmwareKey: null,
            // 设备类型编码
            DeviceTypeCode: null,
            // 固件包版本
            Version: null,
            // 固件包名称
            // Name: null,
            // 版本备注说明
            Remarks: null,
            // 资源包ID
            AssetsID: null
          },
          rules: {
            FirmwareKey: [
              { required: true, message: '请上传服务命名规范的固件包', trigger: 'blur' }
            ],
            DeviceTypeCode: [
              { required: true, message: '请选择固件包对应的适用设备', trigger: 'blur' }
            ],
            Remarks: [
              { required: true, message: '请描述说明固件包', trigger: 'blur' }
            ],
          },

          deviceTypeDialogVisible: false,

          deviceList: [],

          assetsList: []

        }
      },

      computed: {
        activated: function () {
          return this.incomingData.activated;
        }
      },

      methods: {
        add: function () {
          var self = this;

          return new Promise(function (resolve, reject) {
            Firmware
              .Add(self.formData)
              .then(function () {
                if (self.$route.query.add === 'true') {
                  self.$confirm('固件版本添加成功!', '提示', {
                    type: 'success',
                    confirmButtonText: '返回上一步'
                  })
                  .then(function () {
                    self.$router.go(-1);
                    resolve();
                  })
                  .catch(function () {
                    resolve();
                  })
                } else {
                  self.$message.success('固件版本添加成功');
                  resolve();
                }
              }, function () {
                reject();
              })
              .catch(function () { reject() });
          });
        },

        asyncGetClassDetail: function () {
          var self = this;
        },

        handleFileExceed: function () {
          this.$message.warning('超出上传个数！');
        },

        // 验证文件是否符合命名规范
        validateFirmwareFileName: function (name) {
          // if (name && name.split('_').length !== 5) {
          //   this.$message.error('文件命名不符合规范');
          //   return false;
          // }

          return true;
        },

        handleFileChange: function (uploadName, file) {
          var fileName = file.name;
          if (this.validateFirmwareFileName(fileName)) {
            this.formData.FirmwareKey = uploadName;

            var fileNameArr = fileName.split('.');
            var FileSplitArr = fileNameArr[0].split('_');

            // this.formData.DeviceTypeCode = FileSplitArr[1];
            this.formData.Version = FileSplitArr[4];
          }
        },

        handleBeforeUpload: function (file) {
          if (!file) return false;
          // 验证文件是否符合命名规范
          return this.validateFirmwareFileName(file.name);
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

        asyncGetAssetsList: function () {
          var self = this;

          Assets
            .Dropdown()
            .then(function (data) {
              self.assetsList = data.List || [];
            });
        },

        handleFileRemove: function () {
          _.assign(this.formData, {
            Name: null,
            Version: null,
            FirmwareKey: null
          });
        },

        addAssets: function () {
          var self = this;

          self.$confirm('当前操作将切换至资源包管理界面！', '添加资源包', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(function () { 
            self.$router.push({
              path: '/assets',
              query: {
                add: 'true'
              }
            });
           })
          .catch(function () {});
        },

        activatedOfPage: function () {
          return this.incomingData.activated(this.asyncGetAssetsList);
        }
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
              <ych-form-item prop="FirmwareKey" label="固件包" double>
                <ych-upload
                  upload-type="public"
                  :limit="1"
                  :before-upload="handleBeforeUpload"
                  :on-exceed="handleFileExceed"
                  :on-success="handleFileChange"
                  :on-remove="handleFileRemove">
                  <el-button 
                    :disabled="Boolean(formData.FirmwareKey)"
                    type="primary">
                    上传
                  </el-button>
                </ych-upload>
              </ych-form-item>

              <el-form-item prop="AssetsID" label="资源包">
                <el-select v-model="formData.AssetsID" clearable>
                  <el-option
                    v-for="item in assetsList"
                    :key="item.ID"
                    :label="item.Name"
                    :value="item.ID">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item>
                <el-button 
                  type="text" 
                  @click="addAssets">
                  添加
                </el-button>
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

              <el-form-item prop="Version" label="版本号">
                <el-input 
                    v-model="formData.Version"
                    disabled>
                </el-input>
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