define([
  'framework/components/base/search/index',
  'incss!components/base/tree/index.css'
], function (search) {
  'use strict';

  var Tree = {
    name: 'YchTree',

    components: {
      Search: search
    },

    props: {
      data: {
        type: Array
      },

      dataProps: {
        type: Object,
        default: function () {
          return {
            children: 'children',
            label: 'label'
          }
        }
      },

      renderContent: Function,

      levelIcon: {
        type: Array,
        default: function () {
          return [];
        }
      },

      customIcon: Function,

      showMenu: {
        type: Boolean,
        default: true
      },

      menuRender: Function,

      defaultExpandedKeys: {
        type: Array,
        defulat: []
      },
      
      nodeKey: {
        type: String,
        default: 'ID'
      },

      showCheckbox: {
        type: Boolean,
        default: false
      },

      highlightCurrent: {
        type: Boolean,
        default: true
      },

      searchPlaceholder: {
        type: String,
        default: '搜索'
      },

      draggable: {
        type: Boolean,
        default: false
      },

      allowDrag: Function,

      allowDrop: Function,

      checkStrictly: {
        type: Boolean,
        default: false
      }
    },

    data: function () {
      return {
        filterText: '',
        menuIconVisible: false
      }
    },

    computed: {
      tree: function () {
        return this.$refs.tree;
      }
    },

    watch: {
      filterText: function (val) {
        this.$emit('search-change', val);
        this.$refs.tree.filter(val);
      }
    },

    methods: {
      clearSearch: function () {
        this.filterText = null;
      },

      itemWidth: function (item) {
        var hasIcon = this.customIcon || this.levelIcon;

        return (200 - (24 * item.node.level) + (hasIcon ? -18 : 0)) + 'px';
      },

      levelIconClassName: function (item) {
        var level = item.node.level;
        return this.customIcon 
                ? this.customIcon(item) 
                : (this.levelIcon 
                  && this.levelIcon[level - 1]) 
                  || (this.levelIcon[0] || '');
      },

      handleMenuCommand: function (data) {
        this.$emit('menu-command', data);
      },

      handleMenuVisibleChange: function (visible, item) {
        this.menuIconVisible = visible ? item.data[this.dataProps.label] : '';
      },

      handleLevelShowMenu: function (h, item) {
        var that = this,
            node = item.node,
            data = item.data,
            store = item.store;
        
        if (!this.showMenu) {
          return null;
        }

        return h('el-dropdown', {
          class: ['ych-tree__menu'],
          props: {
            size: 'small',
            trigger: 'click'
          },
          on: {
            command: that.handleMenuCommand,
            'visible-change': function (visible) {
              that.handleMenuVisibleChange(visible, item);
            }
          },
          nativeOn: {
            click: that.operationMenuClick
          }
        }, [
          h('i', {
            class: {
              'ych-icon-caidan': true,
              'ych-tree__menu-icon': true,
              'ych-tree__menu-icon--hover': item.data[that.dataProps.label] === that.menuIconVisible
            }
          }),

          h('el-dropdown-menu', {
            slot: 'dropdown'
          }, that.menuRender && _.map(that.menuRender(item), function(value, key) {
              return h('el-dropdown-item', {
                props: {
                  command: _.assign({type: key}, item),
                  key
                },
                domProps: {
                  textContent: value
                }
              })
            })
          )
        ]);
      },

      filterNode: function (value, data) {
        if (!value) return true;
        return data[this.dataProps.label].indexOf(value) !== -1;
      },

      operationMenuClick: function (e) {
        e.stopPropagation();
      },

      renderContentDefault: function(h, item) {
        var that = this,
            node = item.node,
            data = item.data,
            store = item.store;
        
        if (typeof this.renderContent === 'function') {
          return this.renderContent(h, item);
        }

        return h('div', {
          class: ['ych-tree__item']
        }, [
          h('i', {
            class: [
              'ych-tree__item-i', 
              that.levelIconClassName(item)
            ]
          }),
          h('div', {
            class: [
              'single-ellipsis', 
              'ych-tree__text'
            ],
            style: {
              width: that.itemWidth(item),
            }
          }, [h('span', {
            domProps: {
              textContent: data[that.dataProps.label || 'label']
            }
          })]),
          that.handleLevelShowMenu(h, item)
        ]);
      },

      handleNodeClick: function (data, node, instance) {
        this.$emit('node-click', data, node, instance);
      },

      handleCheckChange: function (data, checked, indeterminate) {
        
        this.$emit('check-change', data, checked, indeterminate);
      }
    },

    template: `
      <div class="ych-tree">
        <search 
          class="ych-tree__search-input" 
          :placeholder="searchPlaceholder"
          v-model="filterText"/>
        <el-tree 
          ref="tree"
          @node-click="handleNodeClick"
          @check-change="handleCheckChange"
          :default-expanded-keys="defaultExpandedKeys"
          :node-key="nodeKey"
          :data="data"
          :props="dataProps"
          :expand-on-click-node="false"
          :highlight-current="highlightCurrent"
          :filter-node-method="filterNode"
          :render-content="renderContentDefault"
          :show-checkbox="showCheckbox"
          :check-strictly="checkStrictly"
          
          :draggable="draggable"
          :allow-drag="allowDrag"
          :allow-drop="allowDrop"
          @current-change="$emit('current-change', arguments)"
          @node-drag-start="$emit('node-drag-start', arguments)"
          @node-drag-enter="$emit('node-drag-enter', arguments)"
          @node-drag-leave="$emit('node-drag-leave', arguments)"
          @node-drag-over="$emit('node-drag-start', arguments)"
          @node-drag-end="$emit('node-drag-end', arguments)"
          @node-drop="$emit('node-drop', arguments)">
        </el-tree>
      </div>
    `
  }

  Tree.install = function (Vue) {
    Vue.component(Tree.name, Tree);
  };

  return Tree;
});