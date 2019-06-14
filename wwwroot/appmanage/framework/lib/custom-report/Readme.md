# <center>自定义报表控件使用及参数配置</center>

### 更新日志
#### **1.1.0（2017-11-06）**
- 框架依赖升级
    > 升级主要原因是<code>Element2.0</code>的table组件增加自定义单元格合并功能

    * <code>Element(UI框架)</code>升级到2.0.x
    * <code>Vue</code>升到2.5.x
- 功能更新

    * 增加单元格合并
        
        * 列clumn增加<code>cellSpan</code>属性, 快捷合并列连续相同单元格
        * 组group增加<code>spanMethod</code>属性，自定义单元格合并方法

    * 修改整体样式
	
---




<br/><br/>
### <span id="helloWorld">Hello world </span>
可以当做模板直接copy使用（记得修改引入文件路径）


    <!DOCTYPE html>
    <html>
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <title></title>
            <meta charset="utf-8" />
            <!-- UI库样式文件  -->
            <link rel="stylesheet" href="../Scripts/CustomReport/lib/element/css/index.css">
            <!-- 自定义报表样式文件  -->
            <link rel="stylesheet" href="../Scripts/CustomReport/css/index.css">
        </head>
        <body>
            <div id="ych-report"></div>
            <script src="../Scripts/jquery-1.10.2.min.js"></script>
            <script src="../Scripts/common.js"></script>
            <!-- vue, 开发环境下可以使用vue.js  -->
            <script src="../Scripts/CustomReport/lib/vue/vue.min.js"></script>
            <!-- UI库  -->
            <script src="../Scripts/CustomReport/lib/element/js/index.js"></script>
            <!-- 自定报表控件配置文件  -->
            <script src="../Scripts/CustomReport/js/ych-report-global.conf.js"></script>
            <!-- 自定义报表js文件  -->
            <script src="../Scripts/CustomReport/js/ych-custom-report.js"></script>
            <script>
                var report = $YchCustomReport({
                    // 查询条件
                    fields: [
                        {
                            field: 'CreateTime',
                            label: '使用时间',
                            dataType: 'DateTime',
                            type: 'date'
                        }
                    ],
                    // 报表
                    groups: [
                        {
                            name: '明细',
                            tableName: 'OnLine_ScanSchemeUseLog',
                            columns: [
                                {
                                    prop: 'Title',
                                    field: 'ScanScheme.Title',
                                    name: '方案名称'
                                }
                            ],
                            btnArray: [
                                {
                                    name: '新增',
                                    // rows: 选中行的数据; 
                                    // finish: 按钮点击后会变成等待状态防止多次点击，还原状态需要调用finish();
                                    clickFunc: function(rows, finish) {
                                		// 注意：在所有逻辑处理完后调用此方法最佳
                                        finish(); 
                                    }
                                }
                            ]
                        }            
                    ]
                });
            </script>
        </body>
    </html>
    
    


<br/><br/>
### 使用步骤
1. 引入css文件（<span style="color: red">注：为了避免样式覆盖，自定义报表样式文件 **必须** 放在所有样式文件的最后</span>）

        <!-- 引入UI库样式文件 -->
        <link rel="stylesheet" href="../Scripts/CustomReport/lib/element/css/index.css">

        <!-- 引入自定义报表样式文件  -->
        <link rel="stylesheet" href="../Scripts/CustomReport/css/index.css">

2. 引入js文件

        <!-- 自定报表的http请求依赖JQuery的ajax  -->
        <script src="../Scripts/jquery-1.10.2.min.js"></script>

        <!-- vue, 开发环境下可以使用vue.js  -->
        <script src="../Scripts/CustomReport/lib/vue/vue.min.js"></script>

        <!-- UI库  -->
        <script src="../Scripts/CustomReport/lib/element/js/index.js"></script>

        <!-- 自定报表控件配置文件  -->
        <script src="../Scripts/CustomReport/js/ych-report-global.conf.js"></script>

        <!-- 自定义报表js文件  -->
        <script src="../Scripts/CustomReport/js/ych-custom-report.js"></script>


3. 初始化报表

        <!DOCTYPE html>
        <html>
            ...
            <body>
                <!-- 用于存放报表的容器，默认#ych-report -->
                <div id="ych-report"></div>
                ...
                <script>
                    $YchCustomReport({
                        // 可省略， el 与 上面容器一致，默认值为'#ych-report'
                        el: '#ych-report',
                        // 其它参数，请查看下面的“具体配置参数”
                        ...
                    });
                </script>
            </body>
        </html>
    
<br/><br/>

<br/><br/>
### 具体配置参数

<style>
    table tr td:nth-child(1) {
        width: 120px
    }

    table tr td:nth-child(2) {
        width: 250px
    }

    table tr td:nth-child(3),
    table tr td:nth-child(4),
    table tr td:nth-child(5),
    table tr td:nth-child(6) {
        width: 100px;
        text-align:center;
    }
</style>
<br/>

- 一级参数

<table>
    <tr>
        <th>参数名称</th>
        <th>说明</th>
        <th>类型</th>
        <th>是否必填</th>
        <th>可选值</th>
        <th>默认值</th>
    </tr>
    <tr>
        <td>el</td>
        <td>存放报表的容器，用css选择器</td>
        <td>String</td>
        <td>否</td>
        <td>-</td>
        <td>#ych-report</td>
    </tr>
    <tr>
        <td>fields</td>
        <td>
            查询条件，
            <a href="#fields">请看具体参数</a>
        </td>
        <td>Array</td>
        <td>是</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>groups</td>
        <td>
            查询条件，
            <a href="#groups">请看具体参数</a>
        </td>
        <td>Array</td>
        <td>是</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>name</td>
        <td>整体报表名称，主要用于导出文件名的前缀</td>
        <td>String</td>
        <td>否</td>
        <td>-</td>
        <td>‘自定义报表’</td>
    </tr>
    <tr>
        <td>isDefaultLoading</td>
        <td>是否默认加载数据</td>
        <td>Boolean</td>
        <td>否</td>
        <td>-</td>
        <td>true</td>
    </tr>
    <tr>
        <td style="text-decoration:line-through">labelWidth</td>
        <td>查询条件标签宽度，<span style="color: red">已废弃</span>(现在会通过获取查询条件label的最长为准，最少长度为4个字符)</td>
        <td>String</td>
        <td>否</td>
        <td>-</td>
        <td>'100px'</td>
    </tr>
    <tr>
        <td>enums</td>
        <td>
            表格配置,<br/>
            格式：{orderStatus: {1: '已付款',2: '已退款'}}<br/>
            <a href="#global">可全局配置</a>
        </td>
        <td>Object</td>
        <td>否</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>dropdown</td>
        <td>
            下拉选择框的自定义查询, 
            <a href="#global">可全局配置</a>
        </td>
        <td>Object</td>
        <td>否</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>cascader</td>
        <td>
            级联选择, 
            <a href="#global">配置方式与'dropdown'一致</a>
        </td>
        <td>Object</td>
        <td>否</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>beforeQuery</td>
        <td>
            查询前的钩子, 主要用作自定义插入查询条件
            <a href="#beforeQuery">例子</a>
        </td>
        <td>Function(wheres, tabIndex)</td>
        <td>否</td>
        <td>-</td>
        <td>-</td>
    </tr>
</table>

<br/>

- <span id="fields">fields参数</span>

<table>
    <tr>
        <th>参数名称</th>
        <th>说明</th>
        <th>类型</th>
        <th>是否必填</th>
        <th>可选值</th>
        <th>默认值</th>
    </tr>
    <tr>
        <td>field</td>
        <td>查询条件字段名</td>
        <td>String</td>
        <td>是</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>type</td>
        <td>
            展示控件类型<br/>
            当值为<code>custom.</code>时，需要结合<code>source</code>使用
        </td>
        <td>String</td>
        <td>是</td>
        <td>
        基础类型：input/select
        /date/daterange/datetime/datetimerange<br/>
        特殊组件： leaguer(会员读取)、period（账期）
        自定义查询：
        'custom.dropdown'(下拉选择)、'custom.cascader'(多级联动选择)
        </td>
        <td>-</td>
    </tr>
    <tr>
        <td>label</td>
        <td>条件标签名称</td>
        <td>String</td>
        <td>非自定义查询时，必填</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>dataType</td>
        <td>数据类型</td>
        <td>String</td>
        <td>非自定义查询时，必填</td>
        <td>
            Guid/String/Int32
            /Decimal/DateTime
        </td>
        <td>-</td>
    </tr>
    <tr>
        <td>defaultValue</td>
        <td>
            默认值，当type为'daterange',需要传入数组
        </td>
        <td>String/Array</td>
        <td>否</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>show</td>
        <td>
            默认是否显示
        </td>
        <td>Boolean</td>
        <td>否</td>
        <td>-</td>
        <td>true</td>
    </tr>
    <tr>
        <td style="text-decoration:line-through">tabShow</td>
        <td>
            需要显示该查询条件的group,使用数组下标值，例如：[0, 1]。默认全部显示
        </td>
        <td>Array</td>
        <td>否</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>placeholder</td>
        <td>占位文本</td>
        <td>String</td>
        <td>否</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>symbols</td>
        <td>
            查询条件符号组,当type为input或日期时起效
            为input时传false是没有符号的输入框。
            默认选中第一个
        </td>
        <td>Array/Boolean</td>
        <td>否</td>
        <td>['eq', 'neq', 'ge', 'le', 'like', 'rg']</td>
        <td>-</td>
    </tr>
    <tr>
        <td>source</td>
        <td>
           组件数据源。<br/>
            可使用枚举：<code>enums.</code>,需要结合顶级参数 或 全局配置的enums使用。<br/>
            当type为<code>custom.</code>,需要结合顶级参数 或 全局配置dropdown使用
        </td>
        <td>String/Object</td>
        <td>否</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>multiple</td>
        <td>
           是否多选，
           当type为<code>select、custom.dropdown</code>时有效
        </td>
        <td>Boolean</td>
        <td>否</td>
        <td>-</td>
        <td>false</td>
    </tr>
</table>

<br/>

- <span id="groups">groups参数</span>

<table>
    <tr>
        <th>参数名称</th>
        <th>说明</th>
        <th>类型</th>
        <th>是否必填</th>
        <th>可选值</th>
        <th>默认值</th>
    </tr>
    <tr>
        <td>name</td>
        <td>查询报表标签名称</td>
        <td>String</td>
        <td>是</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>tableName</td>
        <td>数据表或视图名</td>
        <td>String</td>
        <td>是</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>queryCode</td>
        <td>
            权限码，<a href="#queryCode">具体说明</a>
        </td>
        <td>String</td>
        <td>是</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>columns</td>
        <td>查询字段组，具体参数请看<a href="#groups-clumns">groups-columns参数</a></td>
        <td>Array</td>
        <td>是</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>fields</td>
        <td>当前tab的独有查询条件，参数与上面<a href="#fields">fields</a>一样</td>
        <td>Array</td>
        <td>否</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>fieldsType</td>
        <td>
            当前tab的查询条件使用类型<br/>
            merge: 与 一级参数<code>fields</code>合并,<br/>
            private: 只使用私有的
        </td>
        <td>String</td>
        <td>merge / private</td>
        <td>-</td>
        <td>merge</td>
    </tr>
    <tr>
        <td>export</td>
        <td>是否能导出</td>
        <td>Boolean</td>
        <td>否</td>
        <td>-</td>
        <td>true</td>
    </tr>
    <tr>
        <td>selection</td>
        <td>首列选择按钮</td>
        <td>Boolean</td>
        <td>否</td>
        <td>-</td>
        <td>true</td>
    </tr>
    <tr>
        <td>selectionFixed</td>
        <td>选择列是否浮动</td>
        <td>Boolean</td>
        <td>否</td>
        <td>-</td>
        <td>true</td>
    </tr>
    <tr>
        <td>showStat</td>
        <td>是否显示统计行</td>
        <td>Boolean</td>
        <td>否</td>
        <td>-</td>
        <td>false</td>
    </tr>
    <tr>
        <td>statText</td>
        <td>统计行首列文字</td>
        <td>String</td>
        <td>否</td>
        <td>-</td>
        <td>'合计'</td>
    </tr>
    <tr>
        <td>sortType</td>
        <td>
            排序类型
        </td>
        <td>String</td>
        <td>否</td>
        <td>local/custom</td>
        <td>-</td>
    </tr>
    <tr>
        <td>defaultSort</td>
        <td>
            默认排序列,<br/>例：
            <code>{prop: 'id' //列名, order: 'asc'/'desc'}</code>
        </td>
        <td>Object</td>
        <td>否</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>btnArray</td>
        <td>
           报表右下角按钮。具体格式和使用方式，请看<a href="#helloWorld">Hello World</a>
        </td>
        <td>Array</td>
        <td>否</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>spanMethod</td>
        <td>
            自定义单元格合并方法。如果配置此方法，列的<span style="color: red;">cellSpan属性则失效</span>。<br/>
            <a href="#">具体使用方法</a>
        </td>
        <td>Function(data)</td>
        <td>否</td>
        <td>-</td>
        <td>-</td>
    </tr>
</table>

<br/>

- <span id="groups-clumns">groups-clumns参数</span>

<table>
    <tr>
        <th>参数名称</th>
        <th>说明</th>
        <th>类型</th>
        <th>是否必填</th>
        <th>可选值</th>
        <th>默认值</th>
    </tr>
    <tr>
        <td>prop</td>
        <td>
            列属性名（查询别名）
        </td>
        <td>String</td>
        <td>是</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>field</td>
        <td>
            查询字段名(数据表字段)
        </td>
        <td>String</td>
        <td>是</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>align</td>
        <td>
            对齐方式
        </td>
        <td>String</td>
        <td></td>
        <td>'left'/'right'</td>
        <td>left</td>
    </tr>
    <tr>
        <td>name</td>
        <td>
            列头部名称
        </td>
        <td>String</td>
        <td>是</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>show</td>
        <td>
            是否显示该列
        </td>
        <td>Boolean</td>
        <td>否</td>
        <td>-</td>
        <td>true</td>
    </tr>
    <tr>
        <td>sort</td>
        <td>
            是否排序
        </td>
        <td>Boolean</td>
        <td>否</td>
        <td>-</td>
        <td>false</td>
    </tr>
    <tr>
        <td>width</td>
        <td>
            列宽度，带单位(例：100px)
        </td>
        <td>String</td>
        <td>否</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>enums</td>
        <td>
            使用枚举翻译列，传报表初始化配置枚举值名称
        </td>
        <td>String</td>
        <td>否</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>link</td>
        <td>
            改列是否为链接格式
        </td>
        <td>Function(cellVal, row)</td>
        <td>否</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>formatter</td>
        <td>
            前端格式化,支持HTML，<span style="color:red;">注：如果使用Function方式导出无效</span>
        </td>
        <td>String/Function(cellVal, row)</td>
        <td>否</td>
        <td><code>Currency(货币保留2位小数)、Decimal、Int</code></td>
        <td>-</td>
    </tr>
    <tr>
        <td>backendFormat</td>
        <td>
            后端数据格式化
        </td>
        <td>String</td>
        <td>否</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>stat</td>
        <td>
            列统计类型
        </td>
        <td>String</td>
        <td>否</td>
        <td>sum,max,min<br/>,avg,count</td>
        <td>-</td>
    </tr>
    <tr>
        <td>groupBy</td>
        <td>
            数据分组操作
        </td>
        <td>String</td>
        <td>否</td>
        <td>group,sum,max,<br/>min,avg,count</td>
        <td>-</td>
    </tr>
    <tr>
        <td>fixed</td>
        <td>
            列浮动，默认左浮动
        </td>
        <td>Boolean/String</td>
        <td>否</td>
        <td>'left'/'right'</td>
        <td>false</td>
    </tr>
    <tr>
        <td>tips</td>
        <td>
            列头部提示，支持HTML
        </td>
        <td>String</td>
        <td>否</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>cellSpan</td>
        <td>
            列的单元格合并, 合并原则是相同则合并
        </td>
        <td>Boolean</td>
        <td>否</td>
        <td>-</td>
        <td>false</td>
    </tr>
</table>

<br/>

- <span id="methods">自定义报表实例的方法/属性</span>

<table>
    <tr>
        <th>名称</th>
        <th>说明</th>
        <th>参数</th>
    </tr>
    <tr>
        <td>updateData</td>
        <td>
            自定义报表初始化后，修改查询条件字段的值，主要用于查询条件默认值需要异步查询接口返回
        </td>
        <td>field, value</td>
    </tr>
    <tr>
        <td>conditions</td>
        <td>
            当前查询条件
        </td>
        <td>-</td>
    </tr>
</table>

- <span id="global">全局配置参数</span>

   > 注：初始化配置与全局配置同名，前者会覆盖后者

        var REPORT_GLOBAL_CONFIG = {
            // 下拉
            dropdown: {
                leaguerLevel: {
                    table: 'Mall_LeaguerLevel', // 表或视图名
                    label: '会员级别', 
                    dataType: 'String',
                    // 查询where条件
                    wheres: [
                        {
                            field: 'LevelName', // 字段名
                            compare: 'neq', //查询符号，可选值eq, neq, bt, lt, like, rg(区间)
                            value: 'VIP4'
                            valueBet:   // 当‘compare'为'rg'区间时，需要用到
                        }
                    ]
                    fieldId: 'ID',
                    fieldName: 'LevelName',
                    afterAchieve: function(data) {
                        /**
                        * 下拉选项数据格式
                        * 
                        * Super 分组时用到的关联字段
                        * {
                        *  ID: 'null',
                        *  Name: '空值',
                        *  Super: '123'
                        * }
                        * 
                        **/
                        data.push({
                            ID: 'null',
                            Name: '空值'
                        });

                        return data;
                    }
                }
            },
            enums: {
                orderStatus: {
                    1: '已付款',
                    2: '已退款'
                }
            }
        };


<br>

1. dropdown（下拉选择预设自定义查询）

<table>
    <tr>
        <th>参数名称</th>
        <th>说明</th>
        <th>类型</th>
        <th>是否必填</th>
        <th>可选值</th>
        <th>默认值</th>
    </tr>
    <tr>
        <td>table</td>
        <td>
            数据表或视图名称
        </td>
        <td>String</td>
        <td>是</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>queryCode</td>
        <td>
            权限码，<a href="#queryCode">具体说明</a>
        </td>
        <td>String</td>
        <td>是</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>label</td>
        <td>
            查询条件标签名
        </td>
        <td>String</td>
        <td>是</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>dataType</td>
        <td>
            数据类型
        </td>
        <td>String</td>
        <td>是</td>
        <td>
            <code>Guid/String/Int32
            /Decimal/DateTime</code>
        </td>
        <td>-</td>
    </tr>
    <tr>
        <td>fieldId</td>
        <td>
            下拉选择项的值，数据表字段
        </td>
        <td>String</td>
        <td>是</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>fieldName</td>
        <td>
            下拉选择项显示名称，数据表字段
        </td>
        <td>String</td>
        <td>是</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>fieldSuper</td>
        <td>
            下拉选择项分组关联字段
        </td>
        <td>String</td>
        <td>否</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>wheres</td>
        <td>
            过滤条件，格式看上面
            <a href="#global">例子</a>
        </td>
        <td>Array</td>
        <td>否</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>afterAchieve</td>
        <td>
            获取选项数据后的钩子方法，返回获取的选项数据，数据格式请看上述<a href="#global">例子</a>
        </td>
        <td>Function(data)</td>
        <td>否</td>
        <td>-</td>
        <td>-</td>
    </tr>
</table>

</br></br>

- <span id="beforeQuery">全局查询前钩子方法例子</span>

        var report = $YchCustomReport({
            name: '支付日志',
            beforeQuery: function(where, tabIndex) {
        		// where: 用户选择的查询条件， 
        		// tabIndex: 当前选中的tab的索引
                switch(tabIndex) {
                    case 0:
                        where.push({
                            Compare: "eq",
                            Field: "test1",
                            Value: "123"
                        });
                        break;
                    case 1:
                        where.push({
                            Compare: "eq",
                            Field: "test2",
                            Value: "123"
                        });
                        break;
                }
                return where;
            }
        });

</br></br>


- <span id="spanMethod">自定义单元格合并方法例子</span>

    > 如果没有自定义需求，建议使用列的<code>cellSpan</code>属性

        var report = $YchCustomReport({
            ...
            groups: [{
                tableName: 'Mall_PayLog',
                ...
                /**
                * @augments data
                *  row: 行数据，column: 列实例对象，rowIndex: 行索引，columnINdex: 列索引
                * 
                */
                spanMethod: function(data) {
                    /**
                    * 返回一个数组,第一个元素代表往下合并行数，第二个元素代表往右合并列数
                    * 
                    * 以下是返回举例：
                    *  合并1行1列: [2, 2]
                    *  被合并的单元格：[0, 0]
                    *  正常的单元格：[1, 1]
                    * 
                    */
                    if (data.rowIndex % 2 === 0) {
                        if (data.columnIndex === 1) {
                        return [1, 2];
                        } else if (data.columnIndex === 2) {
                        return [0, 0];
                        }
                    }
                }
            }]
        });

</br></br>

- <span id="queryCode">权限设置说明queryCode</span>


> 在对应的模块BllInfo里添加以下代码：</br>
> BLLInstance.Resolve\<IBLLCustomQueryAuth\>().Add(报表编号,new List\<int\>, typeof(表/视图Model));
第一个参数 报表编号，对应前端设置的报表查询编号，
第二个参数 权限集合，支持多个权限，权限值直接参考 菜单XML里的权限值，
第三个参数 查询的数据表或视图</br></br>
> 公共下拉模块查询:</br>
权限值设置 为null即可。同样写到对应模块BllInfo
BLLInstance.Resolve\<IBLLCustomQueryAuth\>().Add(报表下拉选择数据编号,null, typeof(表/视图Model));
权限继承原权限的设置方式，由于统一入口，通过加入对应的权限字典。
