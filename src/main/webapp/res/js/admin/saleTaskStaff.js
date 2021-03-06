layui.use(['table', 'jquery', 'form', 'element'], function () {
    var table = layui.table;
    var $ = jQuery = layui.jquery;
    var form = layui.form;
    var element = layui.element;
    var key = '';
    var opID = '';
    var staff_id = $("#staffId").val();
    var campus_id = $("#campusId").val();

    var postTable = table.render({
        elem: '#post',
        url: 'staff/getAllSaleTask?staff_id='+ staff_id + "&campus_id=" + campus_id,
        toolbar: '#toolBar',
        title: '上班地点',
        cols: [[{
            title: '编号',
            type: 'numbers',
            fixed: 'left',
            width: 70
        }, {
            field: 'campus_name',
            title: '所属校区',
            minWidth: 100,
            sort: true
        },{
            field: 'staff_name',
            title: '员工姓名',
            minWidth: 100,
            sort: true
        },{
            field: 'month',
            title: '统计月份',
            minWidth: 100,
            sort: true
        }, {
            field: 'month_task',
            title: '月任务',
            minWidth: 100,
            sort: true
        }, {
            field: 'week_one',
            title: '第一周',
            minWidth: 100,
            sort: true
        }, {
            field: 'week_two',
            title: '第二周',
            minWidth: 100,
            sort: true
        }, {
            field: 'week_three',
            title: '第三周',
            minWidth: 100,
            sort: true
        }, {
            field: 'week_four',
            title: '第四周',
            minWidth: 100,
            sort: true
        }, {
            field: 'week_five',
            title: '第五周',
            minWidth: 100,
            sort: true
        }, {
            field: 'week_six',
            title: '第六周',
            minWidth: 100,
            sort: true
        },{
            field: 'load_time_str',
            title: '分配时间',
            minWidth: 150
        }, {
            title: '操作',
            toolbar: '#opreationBar',
            fixed: 'right',
            width: 100
        }]],
        page: true
    });





    // 排序事件
    table.on('sort(post)', function (obj) { // 注：tool是工具条事件名，test是table原始容器的属性
        table.reload('post', {
            initSort: obj // 记录初始排序，如果不设的话，将无法标记表头的排序状态。 layui 2.1.1 新增参数
            ,
            where: { // 请求参数（注意：这里面的参数可任意定义，并非下面固定的格式）
                field: obj.field // 排序字段
                ,
                order: obj.type
                // 排序方式
            }
        });
    });

    // 触发事件任务分配
    $('#statistics').on("click", function () {
        layer.open({
            type: 2,
            title: '任务分配',
            shadeClose: true,
            shade: 0.8,
            area: ['80%', '70%'],
            content: 'staff/gotoSaleTask?jsp=manySaleTask&campus_id='+ campus_id
        });
    });

    // 返回按按钮点击事件
    $('#back').on('click', function () {
        $("#post-detailed-div").slideUp('', function () {
            $("#table").slideDown();
        });
    });

    // 监听行工具事件
    table.on('tool(post)', function(obj) {
        var data = obj.data;
        if (obj.event === 'edit') {
            opID = data.staff_id;// 操作数据id
            $('#staff_name').val(data.staff_name);
            $('#month').val(data.month);
            $('#month_task').val(data.month_task);
            $('#week_one').val(data.week_one);
            $('#week_two').val(data.week_two);
            $('#week_three').val(data.week_three);
            $('#week_four').val(data.week_four);
            $('#week_five').val(data.week_five);
            $('#week_six').val(data.week_six);
            $("#table").slideUp('', function() {
                $("#post-detailed-div").slideDown();
            });
            form.render(); // 更新全部000
        }
    });

    // 监听提交
    form.on('submit(updateOrderinit)', function (data) {
        var url = "staff/updateSaleTask?"
            + $("#update-orderinit-form").serialize() + "&staff_id="
            + opID;
        $.ajax({
            type: "post",
            url: url,
            async: true,
            success: function (data) {
                var jsonData = JSON.parse(data);
                if (jsonData.code == 100) {
                    layer.confirm('已完成', {
                        icon: 1,
                        title: '提示'
                    }, function (index) {
                        layer.close(index);
                        window.location.href = window.location.href;
                    });
                } else if (jsonData.code == 101) {
                    layer.confirm('身份已过期，请重新登录', {
                        icon: 2,
                        title: '提示'
                    }, function (index) {
                        layer.close(index);
                        window.location.href = "gotoLogin";
                    });
                } else if (jsonData.code == 102) {
                    layer.msg("访问受限，权限不足");
                } else {
                    layer.msg("未知错误");
                }
            },
            error: function (jqObj) {
            }
        });
        return false;
    });

    // 搜索工具 start
    var filter = new Set();// 需要查询的字段
    filter.add("staff_name");
    filter.add("month");
    filter.add("month_task");
    form.render(); // 更新全部000
    // 字段拦截按钮事件
    $('#filter').on('click', function () {
        $("#filter-ul-div").fadeToggle();
    });
    // 字段拦截收起按钮事件
    $('#close-filter').on('click', function () {
        $("#filter-ul-div").fadeToggle();
    });
    // 搜索按钮事件
    $('#search-i').on('click', function () {
        key = $("#serach-address-key").val();
        searchAdd();
    });
    // 输入框回车事件
    $('#serach-address-key').bind('keypress', function (event) {
        key = $("#serach-address-key").val();
        if (event.keyCode == "13") {
            searchAdd();
        }
    });
    // 查询字段修改事件
    form.on('checkbox(filter)', function (data) {
        if (data.elem.checked) {
            filter.add(data.value);
        } else if (filter.size > 1) {
            filter.delete(data.value);
        } else {
            layer.msg("至少选择一个");
            data.elem.checked = true;
            form.render('checkbox');
        }
    });

    // 开始查询
    function searchAdd() {
        $("#filter-ul-div").fadeOut();
        table.reload('post', {
            url: 'staff/getAllSaleTask?key=' + key + '&filter=' + Array.from(filter) + "&staff_id=" + staff_id + "&campus_id=" + campus_id,
        });
    }

    // 搜索工具 end

    // 重载表格 防止拉伸
    window.reloadTable = function () {
        postTable.reload();
    };
    form.render();
});
