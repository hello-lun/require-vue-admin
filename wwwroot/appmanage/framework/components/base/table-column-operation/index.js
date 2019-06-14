define([
], function () {
    'use strict';

    var TableColumnOperation = {
        name: 'YchTableColumnOperation',

        props: {
            operation: {
                type: Array,
                default: []
            },
            toggle: Function
        },

        computed: {
            operationChunk: function () {
                return this.handleOperationChunk(this.operation);
            },

            columnWidth: function () {
                var columnWidth = 0,
                    fontWidth = 13,
                    length = this.operation.length,
                    operationChunk = _.chunk(this.operation, 3);

                columnWidth += _.reduce(
                    operationChunk[0], 
                    function (sum, item) {
                        return sum + (item.label.length * fontWidth) + 10;
                    }, 20
                );

                return length > 3 ? columnWidth + 20 : columnWidth;
            }
        },

        methods: {
            handleOperationClick: function (name, data) {
                event.stopPropagation();
                this.$emit('operation-click', name, data);
            },

            handleOperationChunk: function (operation) {
                return (operation.length > 3) ? _.chunk(operation, 3) : [operation, []];
            }
        },

        render: function (h) {
            var self = this, scope;

            var operationBtns = function (operation, data) {
                return _.map(operation, function (item) {
                    return h('el-button', {
                        key: item.value,
                        props: {
                            type: 'text',
                            size: 'small',
                            disabled: self.toggle ? !self.toggle(item.value, scope.row) : false
                        },
                        domProps: {
                            textContent: item.label
                        },
                        on: {
                            click: function () {
                                self.handleOperationClick(item.value, data, scope)
                            }
                        }
                    })
                })
            };

            var dropdownBtn = function (props, data) {
                return h('el-dropdown', {
                    props: {
                        size: 'small'
                    }
                }, [h('el-button', {
                    props: {
                        type: 'text',
                        icon: 'el-icon-arrow-down'
                    },

                    style: {
                        width: '24px',
                        height: '10px',
                        display: 'inline-block'
                    }
                }), h('el-dropdown-menu', {
                    slot: 'dropdown'
                }, _.map(props, function (item) {
                    return h('el-dropdown-item', {
                        key: item.value,
                        nativeOn: {
                            click: function () {
                                self.handleOperationClick(item.value, data);
                            }
                        },

                        props: {
                            command: item.value,
                            disabled: self.toggle ? !self.toggle(item.value, scope.row) : false
                        },

                        domProps: {
                            textContent: item.label
                        }
                    })
                }))]);
            }

            var defaultSlot = function (props) {
                scope = props;

                // var filterOperation = self.displayToggle
                //     ? (self.displayToggle(self.operation, scope.row) || [])
                //     : _.concat([], self.operation);
                var filterOperation = _.concat([], self.operation);

                var chunk = operationChunk(filterOperation),
                    children = [operationBtns(chunk[0], scope.row)];

                chunk[1] 
                && chunk[1].length > 0 
                && children.push(dropdownBtn(chunk[1], scope.row));

                return h('div', children);
            };

            var operationChunk = function (operation) {
                return (operation.length > 3)
                    ? _.chunk(operation, 3)
                    : [operation, []];
            }

            return h('el-table-column', {
                props: {
                    fixed: "right",
                    fit: false,
                    width: this.columnWidth,
                    label: '操作'
                },
                scopedSlots: {
                    default: defaultSlot
                }
            })
        }

    }

    TableColumnOperation.install = function (Vue) {
        Vue.component(TableColumnOperation.name, TableColumnOperation);
    };

    return TableColumnOperation;
});