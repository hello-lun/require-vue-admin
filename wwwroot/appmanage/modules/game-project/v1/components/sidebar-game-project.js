define([
    'framework/mixins/sidebar-form',
    'api/game-project/v1/GameProject',
    'components/cascader-game-project-type/index',
    'components/input-code/index',
    'game-project/components/sidebar-game-project-consume-scheme',
    'game-project/components/sidebar-game-project-machine-port',
    'game-project/components/sidebar-game-project-machine-setting',
    'game-project/components/sidebar-game-project-ticket-list',
], function (
    sideBarForm,
    gameProject,
    cascaderGameProjectType,
    inputCode,
    consumeScheme,
    machinePort,
    machineSetting,
    ticketList
) {
        'use strict';
        return {
            name: 'SidebarGameProject',
            mixins: [sideBarForm],
            components: {
                CascaderGameProjectType: cascaderGameProjectType,
                InputCode: inputCode,
                ConsumeScheme: consumeScheme,
                MachinePort: machinePort,
                MachineSetting: machineSetting,
                TicketList: ticketList
            },
            created: function () {
                if (!this.ID && this.incomingData.Node && this.incomingData.Node.Path) {
                    this.formData.ProjectTypeID = this.incomingData.Node.Path;
                }
                this.ID && this.asyncGetGameProjectDetail();
            },
            data: function () {
                var self = this;
                var validateReturn = function (rule, value, callback) {
                    if (self.formData.ProjectTypeID.length == 0) {
                        return callback('项目类型不能为空');
                    }
                    
                    callback();
                };
                return {
                    Node:
                        [
                            {
                                Path: [],
                                Childs: [],
                                Name: '',
                                ID: ''
                            }
                        ],
                    editPort: false,
                    hasProjectType: true,
                    disabledAbility: false,
                    //接入设备类型(卡头,闸机,体育类)
                    enumAbility:
                        [
                            {
                                label: '卡头',
                                value: 'Card'
                            }, {
                                label: '闸机',
                                value: 'Gate'
                            }, {
                                label: '体育类',
                                value: 'Sports'
                            }
                        ],
                    //消费模式
                    enumConsumeMode:
                        [
                            {
                                label: '扣值',
                                value: 'Value'
                            }, {
                                label: '计时',
                                value: 'Time'
                            }
                        ],
                    //刷卡模式枚举
                    enumCardConsumeMode:
                        [
                            {
                                label: '刷卡就消费',
                                value: 'Now'
                            }, {
                                label: '刷卡查询再消费',
                                value: 'Delay'
                            }, {
                                label: '按键消费',
                                value: 'Button'
                            }, {
                                label: '只查询不消费',
                                value: 'None'
                            }
                        ],
                    //进闸扣费方式
                    enumChargeModel: [
                        {
                            label: '请选择',
                            value: 0
                        },
                        {
                            label: '扣基础金额',
                            value: 'ChargeBase'
                        }, {
                            label: '扣封顶金额',
                            value: 'ChargeMax'
                        }
                    ],
                    //出票模式
                    enumLotteryOutType:
                        [
                            {
                                label: '自动',
                                value: 'Auto'
                            }, {
                                label: '电子票',
                                value: 'Ele'
                            }, {
                                label: '实物票',
                                value: 'Phy'
                            }
                        ],
                    enumPortType: [
                        {
                            label: "游戏机P位",
                            value: "GamePlyer",
                        },
                        {
                            label: "入口",
                            value: "GateIn",
                        },
                        {
                            label: "出口",
                            value: "GateOut",
                        },
                        {
                            label: "自动",
                            value: "Auto",
                        }
                    ],
                    formData: {
                        ID: '',
                        //项目名称
                        Name: '',
                        //项目编号
                        Code: '',
                        //项目类别
                        ProjectTypeID: null,
                        ProjectTypeName: '',
                        //是否启用
                        IsEnable: true,
                        //接入设备类型
                        Ability: 'Card',
                        //允许离场时间
                        LeaveTimeSpan: 0,
                        //图片
                        ImageUrl: null,
                        //消费模式
                        ConsumeMode: 'Value',
                        //刷卡间隔秒数
                        CardConsumeDelay: 0,
                        //刷卡模式
                        CardConsumeMode: 'Now',
                        //每局第1扣费列表(最多三个,不能重复)
                        UseValues: [
                            {
                                Amount: 0,
                                UseValue: '',
                                Index: 0,
                                IsShow: true
                            },
                            {
                                Amount: 0,
                                UseValue: '',
                                Index: 1,
                                IsShow: false
                            },
                            {
                                Amount: 0,
                                UseValue: '',
                                Index: 2,
                                IsShow: false
                            }
                        ],
                        //按键第1扣费列表(最多三个,不能重复)
                        UseValues2: [
                            {
                                Amount: 0,
                                UseValue: '',
                                Index: 0,
                                IsShow: true
                            },
                            {
                                Amount: 0,
                                UseValue: '',
                                Index: 1,
                                IsShow: false
                            },
                            {
                                Amount: 0,
                                UseValue: '',
                                Index: 2,
                                IsShow: false
                            }
                        ],
                        //按键第2扣费列表(最多三个,不能重复)
                        UseValues22: [
                            {
                                Amount: 0,
                                UseValue: '',
                                Index: 0,
                                IsShow: true
                            },
                            {
                                Amount: 0,
                                UseValue: '',
                                Index: 1,
                                IsShow: false
                            },
                            {
                                Amount: 0,
                                UseValue: '',
                                Index: 2,
                                IsShow: false
                            }
                        ],
                        //进闸扣费方式
                        ChargeModel: 'ChargeBase',
                        //扣储值类型
                        TimeModeValueType: '',
                        //基础分钟数
                        BaseMinutes: 0,
                        //基础价格
                        BasePrice: 0,
                        //超时分钟数
                        OverMinutes: 0,
                        //超时价格
                        OverPrice: 0,
                        //封顶金额
                        MaxPrice: 0,

                        //机台名称
                        MachineName: '',
                        //机台编号
                        MachineCode: '',
                        //采购金额
                        PurchaseMoney: 0,
                        //采购时间
                        PurchaseTime: '',
                        //供应商
                        Supplier: '',

                        //投币
                        IsCoinIn: true,
                        //出礼品
                        IsGiftOut: false,
                        //出票
                        IsLotteryOut: false,
                        //出币
                        IsCoinOut: false,
                        //出礼品光眼高电平
                        GiftOutEyesPot: false,
                        //出票光眼高电平
                        LotteryEyesPot: false,
                        //出币光眼高电平
                        CoinEyesPot: false,
                        //投币器高电平
                        CoinInPot: false,
                        //出币马达高电平
                        CoinMotorPot: false,
                        //出礼品脉宽
                        GiftOutWidth: 0,
                        //出票马达高电平
                        LotteryMotorPot: false,
                        //投币速度
                        CoinInSpeed: 0,
                        //出票延时
                        LotteryOutDelay: 0,
                        //出币延时
                        CoinOutDelay: 0,
                        //投币脉宽
                        CoinInWidth: 0,
                        //出票放大倍数
                        LotteryOutAmplificationFactor: 0,
                        //出币放大倍数
                        CoinOutAmplificationFactor: 0,
                        //投币识别脉宽
                        CoinInRecognitionWidth: 0,
                        //出币速度
                        CoinOutSpeed: 0,
                        //出票速度
                        LotteryOutSpeed: 0,
                        //投币脉冲数
                        CoinInPulsePerTime: 0,
                        //出币脉宽
                        CoinOutWidth: 0,
                        //出票脉宽
                        LotteryOutWidth: 0,
                        //出币模式
                        CoinOutType: 'Auto',
                        //出票模式
                        LotteryOutType: 'Auto',
                        //P位设置
                        PortData: [],
                        //分类类型(无分类时用到)
                        Format: '',
                        editCoinIn: false,
                        editLotteryOut: false,
                        editCoinOut: false,
                        editGiftOut: false,

                    },
                    formDataBase: null,
                    tabActive: 'consumeScheme',
                    machinePortLable1: 'P位设置',
                    machinePortLable2: '出入口设置',
                    rules: {
                        Name: [
                            { required: true, message: '请填写名称', trigger: 'blur' }
                        ],
                        Code: [
                            { required: true, message: '项目编码不能为空', trigger: 'blur' }
                        ],
                        ProjectTypeID: [
                            { validator: validateReturn, trigger: 'blur' }
                        ],
                        ProjectTypeName: [
                            { validator: validateReturn, trigger: 'blur' }
                        ],


                    },
                }
            },
            computed: {
                //编辑创建ID        
                ID: function () {
                    this.Node = this.incomingData.Node || null;
                    this.formData.Name = this.incomingData.Name || null;
                    var id = this.incomingData.ID || '';
                    this.formData.ID = id;
                    this.editPort = this.incomingData.editPort || false;
                    if (this.editPort == true) {
                        this.tabActive = "machinePort";
                    }
                    if (id == '') {
                        this.disabledAbility = false;
                    } else {
                        this.disabledAbility = true;
                    }
                    return id;
                }
            },
            mounted: function () {
                this.Node = this.incomingData.Node || null;
                this.hasProjectType = this.incomingData.hasProjectType || false;
                this.formData.ProjectTypeName = this.incomingData.ProjectTypeName || null;
                this.formData.Format = this.incomingData.Format || null;
            },
            watch: {
                formData: {
                    deep: true,//还可以加一个deep，表示跟踪所有对象下的属性
                    handler: function (newval, oldval) {
                        if (newval) {
                            this.formDataBase = newval;
                            if (newval.Ability == "Gate") {
                                //刷卡模式枚举
                                this.enumCardConsumeMode = [{
                                    label: '刷卡就消费',
                                    value: 'Now'
                                }, {
                                    label: '刷卡查询再消费',
                                    value: 'Delay'
                                }];
                            } else {
                                //刷卡模式枚举
                                this.enumCardConsumeMode = [{
                                    label: '刷卡就消费',
                                    value: 'Now'
                                }, {
                                    label: '刷卡查询再消费',
                                    value: 'Delay'
                                }, {
                                    label: '按键消费',
                                    value: 'Button'
                                }, {
                                    label: '只查询不消费',
                                    value: 'None'
                                }];
                            }

                        }
                    }
                },

            },
            methods: {
                //验证数据
                validate: function () {
                    this.$refs.form.validate((valid) => {
                        if (valid) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                },
                //保存
                save: function () {
                    var self = this,
                        submitData = this.handleSubmitData();

                    return new Promise(function (resolve, reject) {
                        var thenFn = self.ID
                            ? self.editGameProject(submitData)
                            : self.addGameProject(submitData);

                        thenFn
                            .then(function () {
                                resolve(submitData);
                            }, function () {
                                reject();
                            })
                            .catch(function () {


                            });
                    });
                },
                //编辑
                editGameProject: function (data) {
                    data['ID'] = this.ID;

                    return gameProject.Edit(data);
                },
                //新增
                addGameProject: function (data) {

                    return gameProject.Add(data);

                },
                //处理提交数据
                handleSubmitData: function () {
                    var self = this;
                    var projectTypeID = self.formData.ProjectTypeID;
                    if (projectTypeID.length > 0) {
                        projectTypeID = projectTypeID[projectTypeID.length - 1];
                    } else {
                        projectTypeID = null;
                    }
                    var UseValues1 = [];
                    var UseValues2 = [];
                    if (self.formData.CardConsumeMode == "None") {
                        UseValues1 = [];
                        UseValues2 = [];
                    }
                    else if (self.formData.CardConsumeMode == "Now" || self.formData.CardConsumeMode == "Delay") {
                        self.formData.UseValues.forEach(item => {
                            if (item.UseValue != "") {
                                var model = {
                                    Amount: item.Amount,
                                    UseValue: item.UseValue,
                                    Index: item.Index,
                                };
                                UseValues1.push(model);
                            }
                        })

                        UseValues2 = [];
                    }
                    else if (self.formData.CardConsumeMode == "Button") {

                        self.formData.UseValues2.forEach(item => {
                            if (item.UseValue != "") {
                                var model = {
                                    Amount: item.Amount,
                                    UseValue: item.UseValue,
                                    Index: item.Index,
                                };
                                UseValues1.push(model);
                            }
                        })
                        self.formData.UseValues22.forEach(item => {
                            if (item.UseValue != "") {
                                var model = {
                                    Amount: item.Amount,
                                    UseValue: item.UseValue,
                                    Index: item.Index,
                                };
                                UseValues2.push(model);
                            }
                        })

                    }
                    this.formData.PortData.forEach(item => {
                        if (item.ID.length < 10) {
                            item.ID = "";
                        }
                        if (item.Num == "1P" || item.Num == "2P" || item.Num == "3P" || item.Num == "4P" || item.Num == "5P") {
                            item.PortType = "GamePlyer";
                        }
                        else if (item.Num == "入口1" || item.Num == "入口2") {
                            item.PortType = "GateIn";
                        }
                        else if (item.Num == "出口1" || item.Num == "出口2") {
                            item.PortType = "GateOut";
                        } else {
                            item.PortType = "Auto";
                        }
                        // item.ID=item.PortFlag;
                    });

                    var data = {
                        //项目名称
                        Name: this.formData.Name,
                        //项目编号
                        Code: this.formData.Code,
                        //项目类别ID
                        ProjectTypeID: projectTypeID,
                        //项目类别
                        ProjectTypeName: this.formData.ProjectTypeName,
                        //是否启用
                        IsEnable: this.formData.IsEnable,
                        //接入设备类型
                        Ability: this.formData.Ability,
                        //允许离场时间
                        LeaveTimeSpan: this.formData.LeaveTimeSpan,
                        //图片
                        ImageUrl: this.formData.ImageUrl,

                        //消费模式
                        ConsumeMode: this.formData.ConsumeMode,
                        //刷卡间隔秒数
                        CardConsumeDelay: this.formData.CardConsumeDelay,
                        //刷卡模式
                        CardConsumeMode: this.formData.CardConsumeMode,
                        //第1扣费列表(最多三个,不能重复)
                        UseValues: UseValues1,//this.formData.UseValues,
                        //第2扣费列表(最多三个,不能重复)
                        UseValues2: UseValues2,//this.formData.UseValues2,
                        //进闸扣费方式
                        ChargeModel: this.formData.ChargeModel,
                        //扣储值类型
                        TimeModeValueType: this.formData.TimeModeValueType,
                        //基础分钟数
                        BaseMinutes: this.formData.BaseMinutes,
                        //基础价格
                        BasePrice: this.formData.BasePrice,
                        //超时分钟数
                        OverMinutes: this.formData.OverMinutes,
                        //超时价格
                        OverPrice: this.formData.OverPrice,
                        //封顶金额
                        MaxPrice: this.formData.MaxPrice,

                        //机台名称
                        MachineName: this.formData.MachineName,
                        //机台编号
                        MachineCode: this.formData.MachineCode,
                        //采购金额
                        PurchaseMoney: this.formData.PurchaseMoney,
                        //采购时间
                        PurchaseTime: this.formData.PurchaseTime,
                        //供应商
                        Supplier: this.formData.Supplier,

                        //投币
                        IsCoinIn: this.formData.IsCoinIn,
                        //出礼品
                        IsGiftOut: this.formData.IsGiftOut,
                        //出票
                        IsLotteryOut: this.formData.IsLotteryOut,
                        //出币
                        IsCoinOut: this.formData.IsCoinOut,
                        //出礼品光眼高电平
                        GiftOutEyesPot: this.formData.GiftOutEyesPot,
                        //出票光眼高电平
                        LotteryEyesPot: this.formData.LotteryEyesPot,
                        //出币光眼高电平
                        CoinEyesPot: this.formData.CoinEyesPot,
                        //投币器高电平
                        CoinInPot: this.formData.CoinInPot,
                        //出币马达高电平
                        CoinMotorPot: this.formData.CoinMotorPot,
                        //出礼品脉宽
                        GiftOutWidth: this.formData.GiftOutWidth,
                        //出票马达高电平
                        LotteryMotorPot: this.formData.LotteryMotorPot,
                        //投币速度
                        CoinInSpeed: this.formData.CoinInSpeed,
                        //出票延时
                        LotteryOutDelay: this.formData.LotteryOutDelay,
                        //出币延时
                        CoinOutDelay: this.formData.CoinOutDelay,
                        //投币脉宽
                        CoinInWidth: this.formData.CoinInWidth,
                        //出票放大倍数
                        LotteryOutAmplificationFactor: this.formData.LotteryOutAmplificationFactor,
                        //出币放大倍数
                        CoinOutAmplificationFactor: this.formData.CoinOutAmplificationFactor,
                        //投币识别脉宽
                        CoinInRecognitionWidth: this.formData.CoinInRecognitionWidth,
                        //出币速度
                        CoinOutSpeed: this.formData.CoinOutSpeed,
                        //出票速度
                        LotteryOutSpeed: this.formData.LotteryOutSpeed,
                        //投币脉冲数
                        CoinInPulsePerTime: this.formData.CoinInPulsePerTime,
                        //出币脉宽
                        CoinOutWidth: this.formData.CoinOutWidth,
                        //出票脉宽
                        LotteryOutWidth: this.formData.LotteryOutWidth,
                        //出币模式
                        CoinOutType: this.formData.CoinOutType,
                        //出票模式
                        LotteryOutType: this.formData.enumLotteryOutType,
                        //P位设置
                        PortData: this.formData.PortData,
                        //分类类型(无分类时用到)
                        Format: this.formData.Format
                    };
                    return data;
                },
                //根据ID获取详情  
                asyncGetGameProjectDetail: function () {
                    var self = this;

                    gameProject.GetProject({ ID: this.ID })
                        .then(function (res) {

                            //self.formData.UseValues=res.UseValues;
                            // self.formData.UseValues2=res.UseValues;
                            // self.formData.UseValues22=res.UseValues2;
                            var index1 = 0;
                            res.UseValues.forEach(item => {
                                self.formData.UseValues[index1].Amount = item.Amount;
                                self.formData.UseValues[index1].Index = index1;
                                self.formData.UseValues[index1].UseValue = item.UseValue;
                                self.formData.UseValues[index1].IsShow = true;

                                self.formData.UseValues2[index1].Amount = item.Amount;
                                self.formData.UseValues2[index1].Index = index1;
                                self.formData.UseValues2[index1].UseValue = item.UseValue;
                                self.formData.UseValues2[index1].IsShow = true;

                                index1++;
                            });

                            var index2 = 0;
                            res.UseValues2.forEach(item => {
                                self.formData.UseValues22[index2].Amount = item.Amount;
                                self.formData.UseValues22[index2].Index = index2;
                                self.formData.UseValues22[index2].UseValue = item.UseValue;
                                self.formData.UseValues22[index2].IsShow = true;

                                index2++;
                            });


                            _.extend(self.formData,
                                {
                                    //项目名称                     
                                    Name: res.Name,
                                    //项目编号
                                    Code: res.Code,
                                    //项目类别
                                    ProjectTypeID: res.Path,
                                    //是否启用
                                    IsEnable: res.IsEnable,
                                    //接入设备类型
                                    Ability: res.Ability,
                                    //允许离场时间
                                    LeaveTimeSpan: res.LeaveTimeSpan,
                                    //图片
                                    ImageUrl: res.ImageUrl,

                                    //消费模式                      
                                    ConsumeMode: res.ConsumeMode,
                                    //刷卡间隔秒数
                                    CardConsumeDelay: res.CardConsumeDelay,
                                    //刷卡模式
                                    CardConsumeMode: res.CardConsumeMode,
                                    //第1扣费列表(最多三个,不能重复)
                                    //  UseValues:res.UseValues,
                                    //第2扣费列表(最多三个,不能重复)
                                    //  UseValues2:res.UseValues,
                                    //第2扣费列表(最多三个,不能重复)
                                    //  UseValues22:res.UseValues2,
                                    //进闸扣费方式
                                    ChargeModel: res.ChargeModel,
                                    //扣储值类型
                                    TimeModeValueType: res.TimeModeValueType,
                                    //基础分钟数
                                    BaseMinutes: res.BaseMinutes,
                                    //基础价格
                                    BasePrice: res.BasePrice,
                                    //超时分钟数
                                    OverMinutes: res.OverMinutes,
                                    //超时价格
                                    OverPrice: res.OverPrice,
                                    //封顶金额
                                    MaxPrice: res.MaxPrice,
                                    //机台名称
                                    MachineName: res.MachineName,
                                    //机台编号
                                    MachineCode: res.MachineCode,
                                    //采购金额
                                    PurchaseMoney: res.PurchaseMoney,
                                    //采购时间
                                    PurchaseTime: res.PurchaseTime,
                                    //供应商
                                    Supplier: res.Supplier,

                                    //投币
                                    IsCoinIn: res.IsCoinIn,
                                    //出礼品
                                    IsGiftOut: res.IsGiftOut,
                                    //出票
                                    IsLotteryOut: res.IsLotteryOut,
                                    //出币
                                    IsCoinOut: res.IsCoinOut,
                                    //出礼品光眼高电平
                                    GiftOutEyesPot: res.GiftOutEyesPot,
                                    //出票光眼高电平
                                    LotteryEyesPot: res.LotteryEyesPot,
                                    //出币光眼高电平
                                    CoinEyesPot: res.CoinEyesPot,
                                    //投币器高电平
                                    CoinInPot: res.CoinInPot,
                                    //出币马达高电平
                                    CoinMotorPot: res.CoinMotorPot,
                                    //出礼品脉宽
                                    GiftOutWidth: res.GiftOutWidth,
                                    //出票马达高电平
                                    LotteryMotorPot: res.LotteryMotorPot,
                                    //投币速度
                                    CoinInSpeed: res.CoinInSpeed,
                                    //出票延时
                                    LotteryOutDelay: res.LotteryOutDelay,
                                    //出币延时
                                    CoinOutDelay: res.CoinOutDelay,
                                    //投币脉宽
                                    CoinInWidth: res.CoinInWidth,
                                    //出票放大倍数
                                    LotteryOutAmplificationFactor: res.LotteryOutAmplificationFactor,
                                    //出币放大倍数
                                    CoinOutAmplificationFactor: res.CoinOutAmplificationFactor,
                                    //投币识别脉宽
                                    CoinInRecognitionWidth: res.CoinInRecognitionWidth,
                                    //出币速度
                                    CoinOutSpeed: res.CoinOutSpeed,
                                    //出票速度
                                    LotteryOutSpeed: res.LotteryOutSpeed,
                                    //投币脉冲数
                                    CoinInPulsePerTime: res.CoinInPulsePerTime,
                                    //出币脉宽
                                    CoinOutWidth: res.CoinOutWidth,
                                    //出票脉宽
                                    LotteryOutWidth: res.LotteryOutWidth,
                                    //出币模式
                                    CoinOutType: res.CoinOutType,
                                    //出票模式
                                    LotteryOutType: res.enumLotteryOutType,
                                    //P位设置
                                    PortData: res.PortData

                                });


                        }).then(function () {

                        });


                    if (this.formData.Ability == "Gate") {
                        this.tabActive = 'consumeScheme';
                    }

                },
                //处理离场时间
                handleLeaveTimeSpanChange: function (value) {
                    var self = this;
                    self.$nextTick(function () {
                        if (value == null || value == "" || value == undefined) value = 0;
                        self.formData.LeaveTimeSpan = Math.round(Number(value));
                    });
                },
                //图片上传
                handleFileChange: function (file, fileList) {
                    if (file && file.response) {
                        this.formData.ImageUrl = file.response;
                    }
                },
                //监听消费方案的变化
                handleConsumeSchemeEdit: function (data) {
                    this.formData = data;

                    this.tabActive = 'consumeScheme';

                },
                //监听P位设置的变化
                handlemachinePortEdit: function (data) {
                    this.formData = data;
                    this.tabActive = 'machinePort';

                },
                //监听机台参数设置变化
                handlemachineSettingEdit: function (data) {
                    this.formData = data;
                    this.tabActive = 'machineSetting';
                },

                test: function (val) {
                    this.formData.ProjectTypeID = val;
                    console.log(val, 'test');
                }
            },

            template: `
            <div>
  
                <side-bar-form
                    :model="formData"
                    :rules="rules">

                    <el-form-item 
                        prop="Name" 
                        label="项目名称">
                        <el-input 
                            v-model="formData.Name">
                        </el-input>
                    </el-form-item>

                    <el-form-item 
                        prop="Code" 
                        label="项目编号">
                        <input-code 
                            v-model="formData.Code"
                            type="game-project"
                            :get-code="!Boolean(incomingData.id)"
                            disabled>
                        </input-code>
                    </el-form-item>

                    <ych-form-item  
                        label="项目类型" 
                        key="ProjectTypeID"
                        prop="ProjectTypeID">

                        <cascader-game-project-type
                            v-model="formData.ProjectTypeID">
                        </cascader-game-project-type>                      
                    </ych-form-item >

                    <!--ych-form-item  
                        v-else
                        label="项目类型" 
                        key="ProjectTypeName"
                        prop="ProjectTypeName">
                            <el-input 
                                key="ProjectTypeName"    
                                v-model="formData.ProjectTypeName" disabled>
                            </el-input>
                    </ych-form-item -->

                    <ych-form-item  
                        label="是否启用" 
                        key="IsEnable"
                        prop="IsEnable">                       
                        <el-radio-group v-model="formData.IsEnable" size="mini">
                        <el-radio-button :label="true" border>启用</el-radio-button>
                        <el-radio-button :label="false" border>禁用</el-radio-button>
                        </el-radio-group>                        
                    </ych-form-item >

                    <el-form-item  
                        label="接入设备" 
                        key="Ability"
                        prop="Ability">                       
                        <el-radio-group 
                            :disabled="disabledAbility"
                            v-model="formData.Ability" size="mini">
                            <el-radio-button                         
                                border
                                v-for="item in enumAbility"
                                :key="item.value"
                                :label="item.value">
                                {{item.label}}
                            </el-radio-button>                        
                        </el-radio-group>                        
                    </el-form-item >
                                
                    <el-form-item  
                        v-show="formData.Ability=='Gate'"                
                        label="允许离场时间" 
                        key="LeaveTimeSpan"
                        prop="LeaveTimeSpan">
                        <ych-input-number
                            size="mini"
                            :controls="false"
                            :min="0" 
                            :max="999999999"                              
                            onkeypress="return event.keyCode>=48&&event.keyCode<=57"   
                            v-model="formData.LeaveTimeSpan"
                            @change="handleLeaveTimeSpanChange(formData.LeaveTimeSpan)"
                            >
                                <template slot="append">分钟</template>
                        </ych-input-number>
                    </el-form-item>

                    <el-form-item  
                        label="" 
                        key="LeaveTimeSpan"
                        prop="LeaveTimeSpan" 
                        v-show="formData.Ability!='Gate'"> 
                    </el-form-item >

                    <el-form-item  
                        label="项目图片" 
                        key="ImageUrl"
                        prop="ImageUrl">
                        <ych-upload
                            ref="upload"1
                            :show-file-list="false"
                            list-type="picture-card"
                            accept=".jpg, .jpeg .png"
                            :max-size="20480"
                            :on-change="handleFileChange">
                            <img 
                                v-if="formData.ImageUrl" 
                                :src="formData.ImageUrl.Url" 
                                width="100%">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </ych-upload>
                    </el-form-item>
                                    
                    <el-tabs v-model="tabActive">
                        <el-tab-pane 
                            label="消费方案" 
                            name="consumeScheme">
                            <ych-sidebar-layout>
                                <consume-scheme
                                    ref="fromConsumeScheme" 
                                    :formDataBase="formData" 
                                    :enumConsumeModes="enumConsumeMode"
                                    :enumCardConsumeModes="enumCardConsumeMode"
                                    :enumChargeModels="enumChargeModel"
                                    @consume-scheme-edit="handleConsumeSchemeEdit">
                                </consume-scheme>
                            </ych-sidebar-layout>
                        </el-tab-pane>

                        <el-tab-pane 
                            :label="formData.Ability!='Gate'?
                            machinePortLable1:machinePortLable2"
                            name="machinePort">
                            <ych-sidebar-layout>
                                <machine-port  
                                    :formDataBase="formData"
                                    @machine-port-edit="handlemachinePortEdit">
                                </machine-port>
                            </ych-sidebar-layout>
                        </el-tab-pane>

                        <el-tab-pane 
                            label="机台参数设置" 
                            name="machineSetting"                      
                            v-if="formData.Ability!='Gate'">

                            <ych-sidebar-layout>
                                <machine-setting  
                                    :formDataBase="formData"
                                    @machine-port-edit="handlemachineSettingEdit">
                                </machine-setting>
                            </ych-sidebar-layout>
                        </el-tab-pane>

                        <el-tab-pane                              
                            label="可用套票" 
                            name="ticketList">
                            <ych-sidebar-layout>
                                <ticket-list  
                                    :formDataBase="formData">
                                </ticket-list>
                            </ych-sidebar-layout>
                        </el-tab-pane>
                
                    </el-tabs>
                              
                </side-bar-form>

            </div>
        `
        }
    });