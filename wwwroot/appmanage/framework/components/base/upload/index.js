define([
    'util/nos-js-sdk',
    'api/file/v1/File'
], function (
    nosSdk,
    File
) {
    'use strict';

    var Upload = {
        name: 'YchUpload',

        functional: true,

        render: function (h, context) {
            var tempProps = _.extend({}, context.props);

            var baseUrl = window.globalConfig.mock.status ? window.globalConfig.mock.url : '';

            // 默认上传地址
            tempProps.action = tempProps.action || baseUrl + '/file/api/v1/file/UploadPrivate';

            // 上传前获取token
            tempProps.beforeUpload = function (file) {
                // 判断上传文件大小
                if (file.size > (tempProps.maxSize * 1024)) {
                    window.$message.warning(`上传文件大小不能超过${tempProps.maxSize} kb`);
                    return false;
                }

                if (context.props.beforeUpload) {
                    var vaildPass = context.props.beforeUpload(file);
                    if (vaildPass === false) {
                        return false;
                    }
                }

                return true;
            };

            tempProps.httpRequest = function (item) {
                console.log(item);
                var file = item.file;
                var self = this;

                var uploadType = tempProps.uploadType || 'private';
                var fnName = uploadType === 'private' ? 'GeneratePrivateUploadToken' : 'GeneratePublicUploadToken';

                File[fnName]({
                    FileName: file.name,
                  }).then(function (data) {
                    var nosUploader = nosSdk({
                      fileInputEl: '',
                      onProgress: function (res) {
                          res.percent = Number(res.progress);
                          item.onProgress(res);
                      },
                      onError: function (error) {
                        self.currentRate = 100;
                        let msg = typeof error === 'object' ? error.errMsg : error;
                        window.$message.error(msg);
                      },
                    });
            
                    nosUploader.addFile(file);
            
                    var param = {
                      bucketName: data.Bucket,
                      objectName: data.UploadName,
                      token: data.Token,
                    };
            
                    var uploadResult = nosUploader.upload(param);

                    // tempProps.onSuccess(data.UploadName, file);
                    var reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function (e) { 
                        tempProps.onSuccess(data.UploadName, file, this.result);
                    };
                    // return Promise.resolve(data.UploadName, uploadResult);
                  });
            };

            return h('el-upload', {
                ref: context.data.ref,
                // style: {
                //     maxWidth: '250px'
                // },
                props: tempProps
            }, context.children);
        }
    }

    Upload.install = function (Vue) {
        Vue.component(Upload.name, Upload);
    };

    return Upload;
});