define(function () {
    'use strict';

    return {
        data: function () {
            return {
                paginationInfo: {
                    PageSize: 20,
                    PageIndex: 1
                },

                paginationTotal: 0,

                paginationUpdateFn: null
            };
        },

        methods: {
            $_pagination_sizeChange: function (size) {
                this.paginationInfo.PageSize = size;
                this.$_pagination_fn();
            },

            $_pagination_currentChange: function (index) {
                this.paginationInfo.PageIndex = index;
                this.$_pagination_fn();
            },

            $_pagination_init: function (index) {
                _.extend(this.paginationInfo, {
                    PageSize: 20,
                    PageIndex: 1
                });
                this.paginationTotal = 0;
            },

            $_pagination_fn: function () {
                var fn = this.paginationUpdateFn;
                fn && fn();
            }
        }
    }
});