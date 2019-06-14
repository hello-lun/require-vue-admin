define([
    'numeral'
], function(numeral) {
    'use strict';
    
    return {
        name: 'number',
        fn: function (value, formate) {
            return numeral(value).format(formate || '0,0');
        }
    }
});