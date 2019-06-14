define([
  'fabric',
  'components/ticket-style-layout-manager/fabric-extend/ITextbox',
  'components/ticket-style-layout-manager/param-item',
  'components/ticket-style-layout-manager/param-panel',
  'components/ticket-style-layout-manager/element-params/canvas-params',
  'components/ticket-style-layout-manager/element-params/element-params',
  'components/ticket-style-layout-manager/element-list',
  'components/ticket-style-layout-manager/layout-manager-footer',
  'api/ticket/v1/Ticket',
  'incss!components/ticket-style-layout-manager/styles/index.css'
], function(
  fabric,
  ITextbox,
  ParamItem,
  ParamPanel,
  CanvasParams,
  ElementParams,
  ElementList,
  LayoutManagerFooter,
  Ticket
) {
  'use strict';

  var MM_TO_PX = 3.95;
  
  return {
    name: 'LayoutManager',

    components: {
      ParamItem: ParamItem,
      ParamPanel: ParamPanel,
      CanvasParams: CanvasParams,
      ElementParams: ElementParams,
      ElementList: ElementList,
      LayoutManagerFooter: LayoutManagerFooter
    },

    mounted: function () {
      this.initCanvas();

      document.addEventListener('keyup', this.removeElOfCanvas, false);
    },

    beforeDestroy: function () {
      document.removeEventListener('keyup', this.removeElOfCanvas, false);
    },

    data: function () {
      return {
        // 当前选中元素
        currentEl: '',
        // 已存在画布元素样式
        existEl: [],
        canvas: null,
        baseSetting: {
          left: 10,
          top: 10
        },
        fontDefaultSetting: {
          fontSize: 12,
          fontFamily: '微软雅黑',
          fontWeight: 'normal',
          textAlign: 'left',
        },
        
        // 画板
        canvasSetting: {
          Width: 0,
          Height: 0,
          Rotating: 0
        },

        // 编辑时，存放打印样式JSON数据(用于样式复原)
        printStyleData: {
          ID: null,
          Name: null
        },

        printDataLoading: false
      };
    },

    computed: {
      paramsOfCurrentEl: {
        get: function () {
          var self = this;
          var data = {
            elName: '元素',
            width: 0,
            height: 0,
            top: 0,
            left: 0
          };
          
          if (this.currentEl) {
            _.extend(
              data, 
              _.pick(
                this.currentElInfo, 
                ['width', 'height', 'top', 'left', 'elName', 'fontFamily', 'fontSize', 'type', 'scaleX', 'scaleY', 'rotating']
              )
            );

            // data.name = this.ticketElementList[data.elName].label;
          }

          return data;
        },
        set: function (val) {
          var self = this;

          _.forEach(val, function (value, key) {
            self.currentElInfo.set(key, value);
          })
          this.canvas.requestRenderAll();
        }
      },

      canvasWidth: function () {
        return this.canvasSetting.Width * MM_TO_PX;
      },

      canvasHeight: function () {
        return this.canvasSetting.Height * MM_TO_PX;
      },

      currentElInfo: function () {
        return this.getCurrentEl(this.currentEl) || null;
      }
    },

    watch: {
      canvasWidth: function (val) {
        if (this.canvas) {
          this.canvas.setWidth(val);
        }
      },

      canvasHeight: function (val) {
        if (this.canvas) {
          this.canvas.setHeight(val);
        }
      }
    },

    methods: {
      initCanvas: function () {
        var canvas = this.canvas = new fabric.Canvas('ticket-layout-canvas');
        canvas.on({
          'selection:updated': this.handleELSelected,
          'selection:created': this.handleELSelected,
          'selection:cleared': this.handleELSelectedCleared,
        });
      },
      // 获取当前画布选中元素
      getCurrentEl: function () {
        return this.getElByName(this.currentEl);
      },
      // 根据元素名称获取存在画布的元素
      getElByName: function (name) {
        var self = this;
        return _.find(this.existEl, function (item) {
          return item.elName === name;
        });
      },

      handleELSelectedCleared: function (options) {
        this.currentEl = null;
      },

      handleELSelected: function (options) {
        if (options.target && options.target.elName) {
          this.currentEl = options.target.elName;
        }
      },

      // 处理 新增/保存 需要提交的数据
      handleCommitData: function () {
        var data = {
          ID: this.printStyleData.ID,
          Name: this.printStyleData.Name,
          CanvasParams: this.canvasSetting,
          PrintStyleJSON: JSON.stringify(this.canvas.toJSON([
            'elName', 'lockUniScaling', 'hasControls', 'lockScalingX', 'lockScalingY'
          ]))
        };

        return data;
      },

      // 保存数据
      save: function () {
        var self = this;
        if (!self.printStyleData.Name) {
          self.$message.error('模板名称不能空！');
          return;
        }
        
        var commitData = self.handleCommitData();

        if (self.printStyleData.ID) {
          Ticket
            .UpdatePrintStyle(commitData)
            .then(function () {
              self.$message.success('票打印样式模板，保存成功！');
              self.$refs.footer.update();
            });
        } else {
          Ticket
            .createTicketPrintStyle(commitData)
            .then(function () {
              self.$message.success('票打印样式模板，添加成功！');
              self.$refs.footer.update();
            })
        }
      },

      handleElementMenuSelected: function (name, info) {
        var elInfo = info;
        // 判断选择添加元素是否为合法元素
        if (!elInfo) {
          return;
        }
        // 判断是否已存在画布
        var existElInfo = this.getElByName(name);
        if (existElInfo) {
          this.setActiveObject(existElInfo, 'object：selected');
          return;
        }
        
        var newEl = this.createELement(elInfo, name);
        if(newEl) {
          this.addNewElToCanvas(newEl);
        }
      },

      // 将新建元素添加到canvas
      addNewElToCanvas: function (el) {
        this.existEl.push(el)
        this.canvas.add(el);
        // 默认选中新添加元素
        this.setActiveObject(el);
      },

      // 触发选中元素
      setActiveObject: function (el, eventName) {
        eventName = eventName || null;
        this.canvas.setActiveObject(el, eventName);
        // 重新渲染选择层canvas
        this.canvas.requestRenderAll();
      },
      // 创建新元素
      createELement: function (info, name) {
        
        var createElFn;
        switch (name) {
          case 'ticket-name':
          case 'ticket-price':
          case 'print-time':
          case 'expiry-date':
          case 'order-number':
          case 'serial-number':
            createElFn = this.createTypeForText;
            break;

          case 'remark':
            createElFn = this.createTypeForTextbox;
            break;

          case 'qrcode':
            createElFn = this.createTypeForQrcode;
            break;

          case 'image': 
            createElFn = this.handleUploadImage;
            break;
        }

        return createElFn && createElFn(info, name);
      },

      handleUploadImage: function (element, name) {
        var self = this;
        this.$refs.elementParams.uploadImage(function (file) {
          self.createTypeForImage(file, element, name)
        });
      },

      createTypeForImage: function (file, element, name) {
        var self = this;
        fabric.Image.fromURL(file, function(img) {
          var setting = _.extend({
            elName: name,
            lockUniScaling: true
          }, self.baseSetting);

          _.forEach(setting, function (value, key) {
            img[key] = value;
          })

          self.addNewElToCanvas(img);
        });
      },

      handleImageChange: function (file) {
        var self = this;
        var imageNativeElement = document.createElement('img');
        imageNativeElement.src = file;
        imageNativeElement.onload = function () {
          var imageEl = _.find(self.existEl, function (item) {
            return item.elName === 'image';
          });
  
          imageEl.setElement(imageNativeElement);
          imageEl.setCoords();
          self.canvas.renderAll();
        };
      },

      createTypeForText: function (element, name) {
        var text = new fabric.Text(
          element.text, 
          _.extend({ 
            elName: name,
            hasControls: false,
            lockScalingX: true,
            lockScalingY: true,
          }, this.baseSetting, this.fontDefaultSetting)
        );
        return text;
      },

      createTypeForTextbox: function (element, name) {
        var text = new fabric.ITextbox(
          element.text, 
          _.extend({ 
            elName: name,
            width: this.canvasWidth - 20,
            lockScalingY: true,
            lockRotation: true
          }, this.baseSetting, this.fontDefaultSetting)
        );

        if(this.canvasWidth < this.canvasHeight) {
          text.width = this.canvasWidth - 20;
          // text.wrapText([element.text], text.width);
        }

        return text;
      },

      createTypeForQrcode: function (element, name) {
        var rect = new fabric.Rect({
          left: 10,
          top: 10,
          fill: '#EFEFEF',
          height: 100,
          width: 100,
          stroke: 'black'
        });

        var line1 = new fabric.Path('M 10 10 L 110 110 z', { 
          fill: 'black', 
          selectable: false,
          stroke: 'black'
        });

        var line2 = new fabric.Path('M 10 110 L 110 10 z', {
          filee: 'black',
          stroke: 'black',
          selectable: false
        });

        var text = new fabric.Text('验票二维码', {
          originX: 'center',
          originY: 'center',
          selectable: false,
          fontSize: 12,
          top: 60,
          left: 60
        });

        var qrcode = new fabric.Group([rect, line1, line2, text], _.extend({
          elName: name,
          lockUniScaling: true 
        }, this.baseSetting));

        return qrcode;
      },

      removeElOfCanvas: function (event) {
        if (!this.currentEl || this.currentElInfo.isEditing) return;
        var key = event.key,
            keyCode = event.keyCode;
        if (
          ['Delete', 'Backspace'].indexOf(key) < 0 
          || [8, 46].indexOf(keyCode) < 0
        ) return;

        var self = this;
        _.remove(self.existEl, function (item) {
          return item === self.currentElInfo;
        });

        self.canvas.remove(self.currentElInfo);
        self.currentEl = null;
      },

      handleCurrentStylesChange: function (id) {
        this.printStyleData.ID = id;

        _.extend(this.printStyleData, {
          Name: null,
          PrintStyleJSON: null
        });

        _.extend(this.canvasSetting, {
          Width: 58,
          Height: 300,
          Rotating: 0
        });

        this.existEl = [];
        this.currentEl = null;

        this.canvas.clear();
        if (!id) {
          return;
        }

        this.fetchPrintStylesByID(id);
      },
      // 根据ID获取打印样式
      fetchPrintStylesByID: function (id) {
        var self = this;
        self.printDataLoading = true;
        Ticket
          .GetPrintStlyeByID({ID: id})
          .then(function (res) {
            self.canvasSetting = res.CanvasParams;
            _.extend(
              self.printStyleData, 
              _.pick(res, ['ID', 'Name', 'PrintStyleJSON'])
            );
            self.canvas.loadFromJSON(
              res.PrintStyleJSON, 
              self.handleAfterCanvasLoadJSONData, 
              self.handleCanvasRenderElement
            );
          }, function () {
            self.printDataLoading = false;
          });
      },
      // 处理加载JSON数据后，渲染每个元素后的回调
      handleCanvasRenderElement: function (json, el) {
        this.existEl.push(el);
      },

      handleAfterCanvasLoadJSONData: function () {
        this.printDataLoading = false;
      }
    },

    template: `
      <el-container 
        class="ticket-layout-manager" 
        v-loading="printDataLoading"
        :style="{
          height: pageContainerHeight + 'px'
        }">
        <el-container>
          <element-list
            v-model="currentEl"
            @select="handleElementMenuSelected">
          </element-list>

          <el-main 
            class="ticket-layout-manager__canvase-container">
            <canvas 
              ref="canvas"
              id="ticket-layout-canvas">
            </canvas>

          </el-main>

          <el-aside 
            class="ticket-layout-manager__right" 
            width="175px">

            <div v-show="!currentEl" >
              <param-panel title="">
                <param-item label="模板名称" double>
                  <el-input v-model="printStyleData.Name">
                  </el-input>
                </param-item>
              </param-panel>
              
              <canvas-params
                key="canvas"
                :width.sync="canvasSetting.Width"
                :height.sync="canvasSetting.Height"
                :rotating.sync="canvasSetting.Rotating">
              </canvas-params>
            </div>
            
            <element-params 
              ref="elementParams"
              v-show="currentEl"
              key="other"
              :data.sync="paramsOfCurrentEl"
              @image-change="handleImageChange">
            </element-params>

            <div class="ticket-layout-manager__right-operation">
              <el-row><el-button type="info">查看该样式套票</el-button></el-row>
              <el-row><el-button type="primary">打印测试</el-button></el-row>
              <el-row><el-button @click="save" type="primary">保存</el-button></el-row>
            </div>

          </el-aside>
          
        </el-container>
        
        <el-footer class="ticket-layout-manager__footer">
          <layout-manager-footer 
            ref="footer"
            :value="printStyleData.ID"
            @input="handleCurrentStylesChange">
          </layout-manager-footer>
        </el-footer>
        
      </el-container>
    `
  }
});