require(function () {

    var pageCofig = [{
        "Title": "新增部门",
        "Name": "departmentAdd",
        "Type": "module",
        "View": [{
            "Name": "部门基本信息",
            "URL":  "/components/mainContainer/departmentAdd.js"
        }]
    }, {
        "Title": "编辑部门",
        "Name": "departmentEdit",
        "Type": "module",
        "View": [{
            "Name": "部门基本信息",
            "URL":"/components/mainContainer/departmentEdit.js"
        }]
    }];

    initFn(pageCofig).then(function (page) {

        var vm = new Vue({
            el: '#app',
            data: {
                query: {
                    Name: '',
                    Manager: '',
                    Telephone: '',
                    Address: ''
                },
                customer: [],
                currentRow: null
            },
            mounted: function () {
                //reloadData();
            },
            methods: {

                

                departmentAdd: function () {
                   
                    var me = this;
                    page.departmentAdd.edit({
                        success: function (data) {
                            me.$message({
                                message: '新建成功',
                                type: 'success'
                            });
                            reloadData();
                        }
                    });

                },
                editDepartment: function () {
                    if (!this.currentRow) {
                        this.$message.error('请先选中一条记录');
                        return;
                    }
                    var me = this;
                    page.departmentEdit.edit({
                        datas: {
                            customerID: me.currentRow.ID
                        },
                        success: function (data) {
                            me.$message({
                                message: '编辑成功',
                                type: 'success'
                            });
                            reloadData();
                        }
                    });
                },
                handleCurrentChange: function (value) {
                    this.currentRow = value;
                },
                search: function () {
                    reloadData();
                }
            }
        });

        function reloadData() {
            //$.ajax({
            //    type: "get",
            //    url:"/api/customer/query",
            //    contentType: "application/json",
            //    data: vm.$data.query,
            //    success: function (data) {
            //        vm.$data.customer = data.Data;
            //    }
            //});
        }
    });
});