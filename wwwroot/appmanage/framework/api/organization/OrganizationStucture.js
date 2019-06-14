define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    function OrganizationStucture () {
        var baseUrl =  location.origin +  '/organization/api/v1/OrganizationStucture';
        BaseModule.call(this, baseUrl);

        this.getAll = function (data) {
            var map = {
                'Customer': 0,
                'Store': 1,
                'Department': 2,
                'Position': 3,
                'User': 4
            };

            var recursionFn = function (data) {
                data = data || [];
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];

                    item.nodeType && (item.nodeType = map[item.nodeType]);
                    
                    if (item.children) {
                        item.children = recursionFn(item.children);
                    }
                }

                return data;
            };

            return this.get('/GetAll', data)
                    .then(function(data) {
                        return recursionFn(data.list);
                    });
        }
        
    }

    tool.inheritPrototype(OrganizationStucture, BaseModule);

    return new OrganizationStucture();
});