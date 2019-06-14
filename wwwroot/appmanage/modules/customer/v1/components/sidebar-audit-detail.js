define([
  'framework/mixins/sidebar-form',
  'api/operation/v1/Audit'
], function (
  sideBarForm,
  Audit
) {
    'use strict';

    return {
      name: 'SidebarAuditDetail',

      mixins: [sideBarForm],

      created: function () {
        this.asyncGetDetail();
      },

      data: function () {
        return {
          auditStatus: null,

          dialogFormVisible: false,
          WeChatCustomerID: '',
          AlipayID: '',
          isReturnPromise: '',

          base: {
            Code: null,
            Account: null,
            Name: null,
            Status: null
          },

          businessInfo: {
            Number: null,
            Name: null,
            RegistrationNumber: null,
            CustomerServicesTel: null,
            Address: null
          },

          bankAccountInfo: {
            OpenBank: null,
            OpenCity: null,
            OpenBranchBank: null,
            CardNumber: null,
            ValidateAmount: null,
            WeChatCustomerID: null,
            AlipayID: null,
          },

          images: {
            IDCardPositive: null,
            IDCardReverse: null,
            BusinessLicense: null,
            StorePicture: null
          },

          logs: [],

          imgStyle: {
            'width': '100%'
          },

          logType: {
            WaitAudit: '待提交微信审核',
            SubmitedAudit: '已提交微信审核',
            RejectedAudit: '已驳回审核',
            ToSubmitVerification: '待提交验证',
            ToVerification: '待验证',
            RejectedVerification: '已驳回验证',
            Completed: '已完成',
          },

          pictureDialogVisible: false,

          dialogImageUrl: '',
        }
      },

      computed: {
        id: function () {
          return this.incomingData.id;
        },

        isShowValidateAmount: function () {
          var showStatus = ['ToVerification', 'RejectedVerification', 'Completed'];
          return ~showStatus.indexOf(this.auditStatus);
        },

        isShowBuessinesNumber: function () {
          var showStatus = ['ToSubmitVerification', 'ToVerification', 'RejectedVerification', 'Completed'];
          return ~showStatus.indexOf(this.auditStatus);
        }
      },
      methods: {
        postWechatPass() {
          var self = this;
          if (!this.WeChatCustomerID) {
            this.$message({
              message: `'请输入微信子商户号'`,
              type: 'warning'
            });
            return;
          }
          Audit.WechatPass({
            ID: this.id,
            BusinessNumber: this.WeChatCustomerID,
            AlipayID: this.AlipayID,
          }).then(function () {
            self.dialogFormVisible = false;
            self.$message.success('资料审核已通过！');
            self.isReturnPromise = 'resolve';
          },function () {
            self.dialogFormVisible = false;
          })
        },
        asyncGetDetail: function () {
          var self = this;
          Audit
            .Detail({ ID: this.id })
            .then(function (data) {
              self.base = data.Base;
              self.images = data.CustomerImage;
              self.bankAccountInfo = data.BankAccountInfo;
              self.businessInfo = data.BusinessInfo;
              self.logs = data.Logs;

              self.auditStatus = data.Status;
            });
        },
        // 微信审核已确认提交
        submit: function () {
          var self = this;
          return this.$confirm(
            '是否已在微信提交新增特约商户的申请？', 
            '提醒'
          ).then(function () {
            return Audit.WechatSubmit({ ID: self.id });
          }).then(function () {
            self.$message.success('已确认提交');
            return Promise.resolve();
          }, function () { return Promise.reject(); });
        },
        closeDialog() {
          this.dialogFormVisible = false;
          this.isReturnPromise  = 'reject';
        },
        // 微信审核通过确认
        wechatPass: function () {
          var _this = this;
          this.dialogFormVisible = true;
          this.isReturnPromise = '';

          return new Promise(function (resolve, reject) {
            _this.$watch('isReturnPromise', function (newVal, oldVal) {
              if (newVal === 'resolve') {
                return resolve();
              } else if (newVal === 'reject') {
                return reject();
              }
            })
          });
        },
        // 微信审核驳回确认
        wechatReject: function () {
          console.log('wechat');
          return this.handleReject('wechat');
        },
        // 主体审核通过
        customerPass: function () {
          var self = this;
          return Audit
                  .CustomerPass({ ID: this.id })
                  .then(function () {
                    self.$message.success('主体审核已通过');
                    return true;
                  }, function () { return Promise.reject(); })
                  .catch(function () { return Promise.reject(); });
        },
        // 审核驳回
        customerReject: function () {
          return this.handleReject('customer');
        },

        handleReject: function (type) {
          var fnName = (type === 'wechat') ? 'WechatReject' : 'CustomerReject';
          var self = this;
          var validator = function (val) {
            if (!val) return false;
            return true;
          };

          return this.$prompt('请填写驳回理由', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValidator: validator,
            inputType: 'textarea',
            inputErrorMessage: '请输入驳回理由'
          })
          .then(function (config) {
            return Audit[fnName]({
              ID: self.id,
              Remarks: config.value
            })
          })
          .then(function () {
            var msg = (type === 'wehcat') ? '微信审核' : '主体审核'
            self.$message.success(msg + '已驳回！');
            return Promise.resolve();
          }, function () { return Promise.reject(); })
          .catch(function () { return Promise.reject(); });
        },

        handlePictureCardPreview: function (name) {
          this.pictureDialogVisible = true;
          this.dialogImageUrl = this.images[name];
        }
      },

      template: `
        <div>
          <ych-sidebar-layout v-if="isShowValidateAmount" title="商户信息">
            <ych-form>
              <el-form-item 
                prop="ValidateAmount" 
                label="验证款金额">
                <el-input 
                  v-model="bankAccountInfo.ValidateAmount"
                  disabled/>
              </el-form-item>
              <el-form-item 
                prop="WeChatCustomerID"
                label="微信子商户号">
                <el-input 
                  v-model="bankAccountInfo.WeChatCustomerID"
                  disabled/>
              </el-form-item>
              <el-form-item 
                prop="AlipayID" 
                label="支付宝子商户号">
                <el-input 
                  v-model="bankAccountInfo.AlipayID"
                  disabled/>
              </el-form-item>
            </ych-form>
          </ych-sidebar-layout>

          <ych-sidebar-layout title="商户信息">
            <ych-form>

              <ych-form-item 
                v-if="isShowBuessinesNumber"
                prop="Number" 
                label="商户号"
                tips="若商户号填写错误，请前往【客户管理】功能中修改该主体商户号">
                <el-input :value="businessInfo.Number" disabled/>
              </ych-form-item>

              <el-form-item prop="Name" label="商户名称">
                <el-input :value="businessInfo.Name" disabled/>
              </el-form-item>

              <el-form-item prop="RegistrationNumber" label="营业执照号">
                <el-input :value="businessInfo.RegistrationNumber" disabled/>
              </el-form-item>

              <el-form-item prop="ServicesTel" label="客服电话">
                <el-input :value="businessInfo.ServicesTel" disabled/>
              </el-form-item>

              <ych-form-item 
                prop="Address" 
                label="门店地址"
                double>
                <el-input :value="businessInfo.Address" disabled/>
              </ych-form-item>

            </ych-form>
          </ych-sidebar-layout>
          
          <ych-sidebar-layout title="银行卡账户信息">
            <ych-form>

              <el-form-item prop="OpenBank" label="开户银行">
                <el-input v-model="bankAccountInfo.OpenBank" disabled/>
              </el-form-item>

              <el-form-item prop="OpenCity" label="开户银行城市">
                <el-input v-model="bankAccountInfo.OpenCity" disabled/>
              </el-form-item>

              <el-form-item prop="OpenBranchBank" label="开户支行">
                <el-input v-model="bankAccountInfo.OpenBranchBank" disabled/>
              </el-form-item>

              <el-form-item prop="CardNumber" label="银行卡号">
                <el-input v-model="bankAccountInfo.CardNumber" disabled/>
              </el-form-item>

            </ych-form>
          </ych-sidebar-layout>
          
          <ych-sidebar-layout title="图片信息">
            <ych-form>

              <el-form-item prop="IDCardPositive" label="身份证正面">
                <ych-upload
                  list-type="picture-card"
                  :show-file-list="false"
                  disabled>
                  <img 
                    @click="handlePictureCardPreview('IDCardPositive')"
                    :src="images.IDCardPositive"
                    style="width: 100%"/>
                </ych-upload>
              </el-form-item>

              <el-form-item prop="IDCardReverse" label="身份证反面">
                <ych-upload
                  list-type="picture-card"
                  :show-file-list="false"
                  disabled>
                  <img 
                    @click="handlePictureCardPreview('IDCardReverse')"
                    :src="images.IDCardReverse"
                    style="width: 100%"/>
                </ych-upload>
              </el-form-item>

              <el-form-item prop="BusinessLicense" label="营业执照">
                <ych-upload
                  list-type="picture-card"
                  :show-file-list="false"
                  disabled>
                  <img 
                    @click="handlePictureCardPreview('BusinessLicense')"
                    :src="images.BusinessLicense"
                    style="width: 100%"/>
                </ych-upload>
              </el-form-item>

              <el-form-item prop="StorePicture" label="店铺门头照">
                <ych-upload
                  list-type="picture-card"
                  :show-file-list="false"
                  disabled>
                  <img 
                    @click="handlePictureCardPreview('StorePicture')"
                    :src="images.StorePicture"
                    style="width: 100%"/>
                </ych-upload>
              </el-form-item>

            </ych-form>
          </ych-sidebar-layout>

          <ych-sidebar-layout title="审核日志">
            <ul>
              <template v-for="log in logs">
              <li :key="log.Time">
                {{ log.LogTime | timeFormate }} - 
                {{ log.UserRole }}( {{ log.UserName }} ) - 
                {{ logType[log.LogType] }}

                <template v-if="log.Remarks">
                  <br/>
                  原因：{{ log.Remarks }}
                </template>
                
              </li>
              </br>
              </template>
            </ul>
          </ych-sidebar-layout>

          <el-dialog
            :visible.sync="pictureDialogVisible"
            :lock-scroll="false"
            :modal-append-to-body="false"
          >
            <img width="100%" :src="dialogImageUrl"/>
          </el-dialog>

          <el-dialog
            title="提示"
            width="550px"
            :visible.sync="dialogFormVisible"
            :append-to-body="true"
            :close-on-click-modal="false"
            :show-close="false"
            :close-on-press-escape="false">
            <div style="width: 70%;margin: 0 auto 20px auto;">
              <p style="margin-bottom: 30px;">请填写该主题的"微信支付子商户号"与"支付宝子商户号"</p>
              <el-input
                v-model="WeChatCustomerID"
                placeholder="微信支付子商户号"
                style="margin-bottom: 20px;"/>
              <el-input
                v-model="AlipayID"
                placeholder="支付宝子商户号"/>
            </div>
            
            <div slot="footer" class="dialog-footer">
              <el-button @click="closeDialog">取 消</el-button>
              <el-button type="primary" @click="postWechatPass">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      `
    }
  });