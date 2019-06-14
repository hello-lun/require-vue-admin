define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function fileService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 上传后，访问文件时，网址需要带上授权参数
        this.UploadPrivate = function (data) {
            return this.post('/file/api/v1/file/UploadPrivate', data);
        };

        // 
        this.GenerateUrl = function (data) {
            return this.get('/file/api/v1/file/GenerateUrl', data);
        };

        // 
        this.GeneratePrivateUploadToken = function (data) {
            return this.post('/file/api/v1/file/GeneratePrivateUploadToken', data);
        };

        // 
        this.GeneratePublicUploadToken = function (data) {
            return this.post('/file/api/v1/file/GeneratePublicUploadToken', data);
        };
//{actions}
    }

    tool.inheritPrototype(fileService, BaseModule);

    return new fileService();
});
