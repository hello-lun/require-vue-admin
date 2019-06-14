define([
  'framework/mixins/sidebar-form',
  'customer/components/sidebar-customer-audit-dialog',
  'api/operation/v1/Customer',
], function (
  sideBarForm,
  sidebarCustomerAuditDialog,
  Customer,
) {
    'use strict';

    return {
      name: 'SidebarCustomerAudit',

      mixins: [sideBarForm],

      components: {
        sidebarCustomerAuditDialog,
      },

      created: function () {
        this.asyncGetDeviceDetail();
      },

      data: function () {
        return {
          base: {
            Code: null,
            Account: null,
            Name: null,
            Status: null,
            AlipayID: null,
            AlipayAuthUrl: null,
          },

          businessStatistics: {
            StoreNum: '',
            DeviceNum: '',
            MemberNum: '',
            OpenNum: '',
            MonthStatistics: '',
            AllStatistics: '',
          },
          businessInfo: {
            Number: null,
            Name: null,
            RegistrationNumber: null,
            CustomerServicesTel: null,
            Address: null,
            WechatApp: '',
          },

          bankAccountInfo: {
            OpenBank: null,
            OpenCity: null,
            OpenBranchBank: null,
            CardNumber: null,
            ValidateAmount: null,
            WeChatCustomerID: '',
            AlipayID: '',
          },

          QCodeInfo: {
            Templates: [],
            NickName: '',
            AppID: '',
            TemplateId: '',
            LastTemplateId: '',
            AduitStatus: '',
            LastAuditStatus: '',
            IsBindApp: false,
          },

          wechatTemplate: '',
          bindWechatVisible: false,

          currentStatus: 3,

          images: {
            IDCardPositive: {
              Url: null,
              Key: null
            },
            IDCardReverse: {
              Url: null,
              Key: null
            },
            BusinessLicense: {
              Url: null,
              Key: null
            },
            StorePicture: {
              Url: null,
              Key: null
            }
          },

          logs: [],

          wechatTemplateInfo: {
            Id: '',
          },

          dataList: [],

          statusEnum: {
            Opening: '营业中',
            NotInformation: '未完善资料'
          },

          imgStyle: {
            'width': '100%'
          }
        }
      },

      computed: {
        id: function () {
          return this.incomingData.id;
        },
        templateStatus: function () {
          let appBindStatus = {
            0: {
              status: '审核成功',
              operation: '',
            },
            1: {
              status: '已驳回',
              operation: '提交审核',
            },
            2: {
              status: '审核中',
              operation: '撤销',
            },
            3: {
              status: '', 
              operation: '提交审核',
            },
            4: {
              status: '',
              operation: '提交审核',
            },
            5: {
              status: '待发布',
              operation: '发布',
            },
            6: {
              status: '已发布',
              operation: '回滚',
            },
            7: {
              status: '审核中',
              operation: '撤销',
            },
            8: {
              status: '审核中',
              operation: '撤销',
            },
          };
          
          if (this.currentStatus > -1) {
            return appBindStatus[this.currentStatus];
          } else {
            return {};
          }
        },
      },

      methods: {
        save: function () {
          var self = this;
          return Customer.Modify(self.handleSubmitData()).then(function() {},function(res) {
            if (res.ResponseStatus.ErrorCode === "2005000013") {
              self.asyncGetDeviceDetail();
              reject();
            }
          });
          // return new Promise(function (resolve, reject) {
          //   Customer
          //     .Modify(self.handleSubmitData())
          //     .then(
          //       function () { resolve(); }, 
          //       function () { reject(); }
          //     )
          //     .catch(function () { reject(); })
          // });
        },

        assignData: function (target,origin) {
          Object.assign(target,origin);
        },

        asyncGetDeviceDetail: function () {
          var self = this;
          Customer
            .AuditData({ ID: this.id })
            .then(function (data) {
    
              self.assignData(self.base,data.Base);
              self.assignData(self.images,data.CustomerImage);
              self.assignData(self.bankAccountInfo,data.BankAccountInfo);
              self.assignData(self.businessInfo,data.BusinessInfo);
              self.assignData(self.logs,data.Logs);
              self.assignData(self.businessStatistics,data.BusinessStatistics);
              self.assignData(self.QCodeInfo,data.QCodeInfo);

              // self.wechatTemplate = self.QCodeInfo.LastTemplateId !== -1 ? self.QCodeInfo.LastTemplateId : '';

              // //回填最新状态的模板id
              // self.wechatTemplateInfo = self.QCodeInfo.Templates.find((item) => {
              //   return item.Id === self.QCodeInfo.LastTemplateId;
              // });
              self.wechatTemplateInfo = self.QCodeInfo.Templates.find((item) => {
                return item.Selected;
              }) || {};

              self.currentStatus = self.wechatTemplateInfo.Status;
              self.wechatTemplate = self.wechatTemplateInfo.Id;

              self.assignData(self.businessInfo, {
                WechatApp: data.NickName,
              });
            });
        },

        // 处理提交数据
        handleSubmitData: function () {
          return _.extend(
            {},
            { 
              ID: this.id,
              Status: this.base.Status,
              ImagesKey: this.handleImgInData(),
              BusinessInfo: this.businessInfo,
              BankAccountInfo: this.bankAccountInfo
            },
          );
        },

        handleImgInData: function () {
          var imgsKey = {};

          for (const key in this.images) {
            if (this.images.hasOwnProperty(key)) {
              imgsKey[key] = this.images[key].Key;
            }
          }

          return imgsKey;
        },

        handleImageBase: function (name, fileName, base64) {
          var imgObj = this.images[name];
          imgObj && _.extend(imgObj, {
            Url: base64,
            Key: fileName
          });
        },

        handleIDCardPositiveImg: function (name, file, base64) {
          this.handleImageBase('IDCardPositive', name, base64);
        },


        handleBusinessLicenseImg: function (name, file, base64) {
          this.handleImageBase('BusinessLicense', name, base64);
        },

        handleStorePictureImg: function (name, file, base64) {
          this.handleImageBase('StorePicture', name, base64);
        },

        handleIDCardReverseImg: function (name, file, base64) {
          this.handleImageBase('IDCardReverse', name, base64);
        },

        asyncGetWechatInfo: function () {
          var self = this;
          Customer.GetAccountBaseInfo({
            CustomerID: this.id,
          }).then(function (res) {
            Object.assign(self.businessInfo, {
              WechatApp: res.NickName,
            });
          });
        },

        bindWechat: function () {
          var self = this;
          Customer.GetAuthUrl({
            State: this.id,
            AuthType: 1,
          }).then(function (res) {
            window.open(res.Authurl);
            self.$alert('请绑定小程序后刷新此界面', '提示', {
              confirmButtonText: '确定',
              type: 'warning',
              callback: action => {
                self.asyncGetDeviceDetail();
              }
            });
          });
        },

        saveReview: function () {
          let _this = this;
          if (this.wechatTemplate === '') {
            this.$message({
              message: '您还没有选择小程序模板',
              type: 'warning'
            });
            return;
          }

          let methods = {
            0: {},
            1: {value: 'BindAppTemplate'},
            2: {
              value: 'CancelAudit',
              warming: function (name) {
                _this.warmingHandle('撤销',name);
              },
            },
            3: {value: 'BindAppTemplate'},
            4: {value: 'BindAppTemplate'},
            5: {
              value: 'WeAppPublish',
              warming: function (name) {
                _this.warmingHandle('发布',name);
              },
            },
            6: {
              value: 'WeAppRollback',
              warming: function (name) {
                _this.warmingHandle('回滚',name);
              },
            },
            7: {
              value: 'CancelAudit',
              warming: function (name) {
                _this.warmingHandle('撤销',name);
              },
            },
            8: {
              value: 'CancelAudit',
              warming: function (name) {
                _this.warmingHandle('撤销',name);
              },
            },
          };

          if (methods[this.currentStatus].warming) {
            methods[this.currentStatus].warming(methods[this.currentStatus]);
          } else {
            methods[this.currentStatus] && this.templateOperationHandle(methods[this.currentStatus]);
          }
        },

        warmingHandle (messages,name) {
          this.$confirm(`是否确认${messages}？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.templateOperationHandle(name,messages);
          }).catch(() => {
          });
        },

        templateOperationHandle: function (methods,messages) {
          Customer[methods.value]({
            CustomerID: this.id,
            TemplateId: this.wechatTemplateInfo.Id,
            TemplateVersion: this.wechatTemplateInfo.Version,
            TemplateDesc: this.wechatTemplateInfo.Name,
          }).then((res) => {
            // 提交审核，绑定小程序模板的时候需要弹框
            if ([1,3,4].indexOf(this.currentStatus) > -1) {
              this.bindWechatVisible = true;
            } else {
              this.$message({
                message: messages + '成功！',
                type: 'success'
              });
              this.asyncGetDeviceDetail();
            }
          });
        },

        selecteChange: function (val) {
          // if (this.QCodeInfo.LastTemplateId === val) {
          //   this.currentStatus = this.QCodeInfo.LastAuditStatus;
          // } else if (this.QCodeInfo.TemplateId === val) {
          //   this.currentStatus = this.QCodeInfo.AduitStatus;
          // }  else if (this.QCodeInfo.AuditingTemplateId === val) {
          //   this.currentStatus = 2;
          // } else {
          //   this.currentStatus = 3;
          // }

          this.wechatTemplateInfo = this.QCodeInfo.Templates.find((item) => {
            return item.Id === val;
          }) || {};

          this.currentStatus = this.wechatTemplateInfo.Status;
        },

        showQRcode: function () {
          window.open(this.QCodeInfo.UnlimitCodeUrl);
        },

        bindAlipay () {
          var self = this;
          window.open(this.base.AlipayAuthUrl);
          self.$alert('请绑定支付宝后刷新此界面', '提示', {
            confirmButtonText: '确定',
            type: 'warning',
            callback: action => {
              self.asyncGetDeviceDetail();
            }
          });
        },
      },

      template: `
        <el-tabs activeName="info">
            <el-tab-pane 
              label="基础信息"
              name="info">
              <ych-sidebar-layout  title="基础信息">
                <ych-form
                  :model="base">

                  <el-form-item prop="Code" label="主体ID">
                    <el-input :value="base.Code" disabled/>
                  </el-form-item>

                  <el-form-item prop="Account" label="主体账号">
                    <el-input :value="base.Account" disabled/>
                  </el-form-item>

                  <el-form-item prop="Name" label="主体名称">
                    <el-input :value="base.Name" disabled/>
                  </el-form-item>

                  <el-form-item prop="Status" label="营业状态">
                    <el-select v-model="base.Status">
                      <el-option 
                        v-for="(value, key) in statusEnum"
                        :key="key"
                        :label="value"
                        :value="key"
                      />
                    </el-select>
                  </el-form-item>

                  <el-form-item prop="WeChatCustomerID" label="微信子商户号">
                    <el-input v-model="bankAccountInfo.WeChatCustomerID" />
                  </el-form-item>

                  <div>
                    <el-form-item prop="AlipayID" label="支付宝PID号">
                      <el-input
                        v-model="base.AlipayID"
                        disabled/>
                    </el-form-item>
                    <el-button type="text" @click="bindAlipay">
                      {{ base.AlipayID ? '重新授权' : '授权'}}
                    </el-button>
                  </div>

                  <div>
                    <el-form-item prop="WechatApp" label="绑定小程序">
                      <el-input
                        placeholder="请选择小程序"
                        v-model="QCodeInfo.NickName"
                        :disabled="QCodeInfo.IsBindApp"
                        disabled/>
                    </el-form-item>
                    <el-button type="text" @click="bindWechat">
                      {{ QCodeInfo.IsBindApp ? '重新绑定' : '绑定'}}
                    </el-button>
                    <el-button
                      type="text"
                      v-show="QCodeInfo.IsBindApp"
                      @click="showQRcode">体验二维码</el-button>
                  </div>

                  <div
                    v-show="QCodeInfo.IsBindApp">
                    <el-form-item
                      prop="Templates"
                      label="小程序模板">
                      <el-select
                        v-model="wechatTemplate"
                        placeholder="请选择小程序模板"
                        @change="selecteChange">
                        <el-option 
                          v-for="item in QCodeInfo.Templates"
                          :key="item.Id"
                          :label="item.Name + '(' + item.Version + ')'"
                          :value="item.Id"
                        />
                      </el-select>
                    </el-form-item>

                    <el-button type="text" v-show="templateStatus.status" style="color: #999999; margin-right: 10px;">{{ templateStatus.status }}</el-button>

                    <el-button type="text" @click="saveReview" style="margin:0;">{{ templateStatus.operation }}</el-button>

                    <div v-if="currentStatus === 1" >
                      <p style="color: red;">
                        审核失败原因：
                      </p>
                      <p style="color: #999999;" v-html="wechatTemplateInfo.Reason"></p>
                    </div>
                  </div>

                </ych-form>
              </ych-sidebar-layout>

              <ych-sidebar-layout title="营业数据">
                <ych-form :model="businessStatistics">

                  <el-form-item prop="StoreNum" label="门店数量">
                    <el-input v-model="businessStatistics.StoreNum" disabled/>
                  </el-form-item>

                  <el-form-item prop="DeviceNum" label="设备数量">
                    <el-input v-model="businessStatistics.DeviceNum" disabled/>
                  </el-form-item>

                  <el-form-item prop="MemberNum" label="会员数量">
                    <el-input v-model="businessStatistics.MemberNum" disabled/>
                  </el-form-item>

                  <el-form-item prop="OpenNum" label="实际营业天数">
                    <el-input v-model="businessStatistics.OpenNum" disabled/>
                  </el-form-item>

                  <el-form-item prop="MonthStatistics" label="本月营收">
                    <el-input v-model="businessStatistics.MonthStatistics" disabled/>
                  </el-form-item>

                  <el-form-item prop="AllStatistics" label="总营收额">
                    <el-input v-model="businessStatistics.AllStatistics" disabled/>
                  </el-form-item>

                </ych-form>
              </ych-sidebar-layout>

            </el-tab-pane>

            <el-tab-pane 
              label="微信商户认证信息"
              name="validate">
              
              <ych-sidebar-layout title="商户信息">
                <ych-form :model="businessInfo">

                <!-- <el-form-item prop="Number" label="商户号">
                    <el-input v-model="businessInfo.Number"/>
                  </el-form-item> -->

                  <el-form-item prop="Name" label="商户名称">
                    <el-input v-model="businessInfo.Name"/>
                  </el-form-item>

                  <el-form-item prop="RegistrationNumber" label="营业执照号">
                    <el-input v-model="businessInfo.RegistrationNumber"/>
                  </el-form-item>

                  <el-form-item prop="ServicesTel" label="客服电话">
                    <el-input v-model="businessInfo.ServicesTel"/>
                  </el-form-item>

                  <ych-form-item 
                    prop="Address" 
                    label="门店地址"
                    double>
                    <el-input v-model="businessInfo.Address"/>
                  </ych-form-item>

                </ych-form>
              </ych-sidebar-layout>
              
              <ych-sidebar-layout title="银行卡账户信息">
                <ych-form :model="bankAccountInfo">

                  <el-form-item prop="OpenBank" label="开户银行">
                    <el-input v-model="bankAccountInfo.OpenBank"/>
                  </el-form-item>

                  <el-form-item prop="OpenCity" label="开户银行城市">
                    <el-input v-model="bankAccountInfo.OpenCity"/>
                  </el-form-item>

                  <el-form-item prop="OpenBranchBank" label="开户支行">
                    <el-input v-model="bankAccountInfo.OpenBranchBank"/>
                  </el-form-item>

                  <el-form-item prop="CardNumber" label="银行卡号">
                    <el-input v-model="bankAccountInfo.CardNumber"/>
                  </el-form-item>

                  <!--  <el-form-item 
                    prop="ValidateAmount" 
                    label="验证款金额">
                    <el-input-number 
                      v-model="bankAccountInfo.ValidateAmount"
                      :min="0.01"
                      :step="0.01"
                      controls-position="right"/> -->
                  </el-form-item>

                </ych-form>
              </ych-sidebar-layout>
              
              <ych-sidebar-layout title="图片信息">
                <ych-form :model="images">

                  <el-form-item prop="IDCardPositive" label="身份证正面">
                    <ych-upload
                      list-type="picture-card"
                      :show-file-list="false"
                      :on-success="handleIDCardPositiveImg">
                      <img 
                        v-if="images.IDCardPositive.Url" 
                        :src="images.IDCardPositive.Url"
                        style="width: 100%"/>
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </ych-upload>
                  </el-form-item>

                  <el-form-item prop="IDCardReverse" label="身份证反面">
                    <ych-upload
                      list-type="picture-card"
                      :show-file-list="false"
                      :on-success="handleIDCardReverseImg">
                      <img 
                        v-if="images.IDCardReverse.Url" 
                        :src="images.IDCardReverse.Url"
                        style="width: 100%"/>
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </ych-upload>
                  </el-form-item>

                  <el-form-item prop="BusinessLicense" label="营业执照">
                    <ych-upload
                      list-type="picture-card"
                      :show-file-list="false"
                      :on-success="handleBusinessLicenseImg">
                      <img 
                        v-if="images.BusinessLicense.Url" 
                        :src="images.BusinessLicense.Url"
                        style="width: 100%"/>
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </ych-upload>
                  </el-form-item>

                  <el-form-item prop="StorePicture" label="店铺门头照">
                    <ych-upload
                      list-type="picture-card"
                      :show-file-list="false"
                      :on-success="handleStorePictureImg">
                      <img 
                        v-if="images.StorePicture.Url" 
                        :src="images.StorePicture.Url"
                        style="width: 100%"/>
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </ych-upload>
                  </el-form-item>

                </ych-form>
              </ych-sidebar-layout>
            </el-tab-pane>

            <ych-sidebar-layout title="修改日志">
              <ul>
                <li 
                  v-for="log in logs"
                  :key="log.Time">
                  {{ log.Time | timeFormate }} - 
                  {{ log.UserRole }}( {{ log.UserName }} ) - 
                  {{ log.ModifyMsg }}
                </li>
              </ul>
            </ych-sidebar-layout>

            <sidebarCustomerAuditDialog
              :bind-wechat-visible.sync="bindWechatVisible"
              :customer-id="id"
              :template-id="wechatTemplateInfo.Id"
              @reflesh="asyncGetDeviceDetail" />
        </el-tabs>
      `
    }
  });