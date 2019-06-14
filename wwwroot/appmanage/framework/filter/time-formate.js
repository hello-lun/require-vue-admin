define([
    'moment'
], function(moment) {
    'use strict';
    
    return {
        name: 'timeFormate',
        fn: function (value, formate) {
            return value ? moment(value).format(formate || 'YYYY-MM-DD HH:mm:ss') : '';
        }
    }
});