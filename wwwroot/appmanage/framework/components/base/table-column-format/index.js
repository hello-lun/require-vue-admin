define([
    'moment',
    'numeral'
], function(moment, numeral) {
    'use strict';

    var handleDefaultProps = function (h, context) {
        var fnMap = {
            date: dateFormatter,
            number: numberFormatter,
            currency: currencyFormatter,
            link: linkFormatter
        }

        var defaultProps = fnMap[context.props.formatType];

        return defaultProps && defaultProps(h, context);
    }

    var linkFormatter = function (h, context) {
        return {
            scopedSlots: {
                default: function (scope) {
                    var text = scope.row[context.props.prop],
                        lickClickFn = context.props.linkClick || function () {};

                    return h('el-button', {
                        props: {
                            type: 'text'
                        },
                        domProps: {
                            textContent: text
                        },
                        
                        on: {
                            click: function () {
                                lickClickFn(scope.row);
                            }
                        }
                    });
                }
            }
        };
    };

    var dateFormatter = function (h, context) {
        return {
            props: {
                width: 140
            },
            scopedSlots: {
                default: function (scope) {
                    var value = scope.row[context.props.prop];

                    var time = isNaN(value) ? Date.parse(value) : value;

                    var content = value ? moment(time).format('YYYY-MM-DD HH:mm:ss') : '-';
                    return h('span', content);
                }
            }
        };
    };

    var numberFormatter = function (h, context) {
        return {
            props: {
                align: 'right',
                minWidth: '100px'
            },
            scopedSlots: {
                default: function (scope) {
                    var number = scope.row[context.props.prop];
                    var content = numeral(number).format('0,0');
                    return h('span', content);
                }
            }
        };
    };

    var currencyFormatter = function (h, context) {
        return {
            props: {
                align: 'right',
                minWidth: '100px'
            },
            scopedSlots: {
                default: function (scope) {
                    var value = scope.row[context.props.prop];
                    var content = numeral(value).format('0,0.00');
                    return h('span', content);
                }
            }
        };
    };

    var TableColumnFormat = {
        name: 'YchTableColumnFormat',

        functional: true,

        render: function (h, context) {

            var defaultSetting = handleDefaultProps(h, context);
        
            context.props = _.extend({}, defaultSetting.props, context.props);

            context.scopedSlots = defaultSetting.scopedSlots;
            return h('el-table-column', context, context.children);
        }
    }

    TableColumnFormat.install = function (Vue) {
        Vue.component(TableColumnFormat.name, TableColumnFormat);
    };

    return TableColumnFormat;
});