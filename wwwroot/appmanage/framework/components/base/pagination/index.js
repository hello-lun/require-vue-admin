define(function() {
    'use strict';
    
    var Pagination = {
        name: 'YchPagination',

        functional: true,

        render: function (h, context) {
            var tempProps = _.extend({}, context.props),
                pageSizes = [20, 40, 60, 100];

            tempProps.pageSizes = tempProps.pageSizes || pageSizes;
            tempProps.pageSize = tempProps.pageSize || tempProps.pageSizes[0];
            tempProps.layout = tempProps.layout || "total, sizes, prev, pager, next";

            return h('el-pagination', {
                props: tempProps,
                on: context.listeners,
                ref: context.data.ref || null
            })
        }
    }

    Pagination.install = function (Vue) {
        Vue.component(Pagination.name, Pagination);
    };

    return Pagination;
});