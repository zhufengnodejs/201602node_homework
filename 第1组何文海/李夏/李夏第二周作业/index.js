$(function(){

    getUsersList();

    var aName = document.querySelector('#j-add-name-input');
    var uName = document.querySelector('#j-update-name-input');
    var aPhone = document.querySelector('#j-add-phone-input');
    var uPhone =document.querySelector('#j-update-phone-input');
    var aBtn = document.querySelector('#j-add-btn');
    var aCBtn = document.querySelector('#j-add-confirm-btn');
    var uCBtn = document.querySelector('#j-update-confirm-btn');
    var tbody = document.querySelector('#j-tbody-cont');

    aBtn.addEventListener('click', function(){
        $("#myAddModal").modal({
            backdrop: 'static',
        });
    });

    aCBtn.addEventListener('click', function(){
        if(aName.value == '' || aPhone.value == ''){
            alert('请输入姓名和手机号码');
            return;
        }
        add();
    });

    var updateId = '';
    uCBtn.addEventListener('click', function(){
        update(updateId);
    });


    //获取全部数据
    function getUsersList(){
        $('#j-tbody-cont').empty();
        ajax({
            url: '/users',
            method: 'GET',
            success: function (response) {
                var data = JSON.parse(response);
                console.log(data);
                parseHtml(data)
            }
        });
    };


    //获取单条数据
    function getUser(id, type){     // type 0-查询 1-修改
        ajax({
            url: "/users/" + id,
            method: 'get',
            success: function (response) {
                var data = JSON.parse(response);
                // 这里的操作最独立出来
                if(type){
                    uName.value = data.name;
                    uPhone.value = data.phone;
                }else{
                    parseHtml(data, 0);
                }
            }
        });
    };

    //删除用户
    function delUser(id){
        //ajax({
        //    url: '/users/' + id,
        //    method: 'delete',
        //    success: function (response) {
        //        var data = JSON.parse(response);
        //        console.log(data);
        //    }
        //});
        $.ajax({
            type: 'delete',
            url: '/users/'+id,
            dataType: 'json',
            cache: false,
            async: true,
        }).done(function (result) {
            getUsersList();
        }).fail(function (err,headers) {
            console.log(err);
        });
    };

    //新增用户
    function add(){
        var user = {
            name: aName.value,
            phone: aPhone.value
        };
        ajax({
            url: '/users',
            method: 'post',
            data: user,
            success: function (response) {
                var response = JSON.parse(response);
                if(response.code == 0){
                    $("#myAddModal").modal('hide');
                    console.log(response.data);
                    parseHtml(response.data, 1);
                    aName.value = aPhone.value = '';
                }else{
                    alert(response.msg);
                }
            }
        });
    };

    function update(id){
        var user = {
            id: id,
            name: uName.value,
            phone: uPhone.value
        };
        //ajax({
        //    url: '/users/' + id,
        //    method: 'put',
        //    data: user,
        //    success: function (response) {
        //        var data = JSON.parse(response);
        //        if(data.code == 0){
        //            getUsersList()
        //        }else{
        //            alert(data.msg);
        //        }
        //    }
        //});
        $.ajax({
            type: 'put',
            url: '/users/'+id,
            data:user,
            dataType: 'json',
            cache: false,
            async: true,
        }).done(function (result) {
            console.log(result);
            $("#myUpdateModal").modal('hide');
            getUsersList();
        }).fail(function (err,headers) {
            console.log(err);
        });
    };

    function parseHtml(data, type){   // data ==> [{"id":0, "name": "lixia", "tel": 18610691354}, {"id":1, "name": "yezi", "tel": 18600000000}];
        // type == 0 查询
        if(type == 0){
            $('#j-tbody-cont').empty();
        }

        var str = '';
        for(var i = 0; i < data.length; i++){
            str += '<tr>';
            str += '<td>'+ data[i].id +'</td>';
            str += '<td>'+ data[i].name +'</td>';
            str += '<td>'+ data[i].phone +'</td>';
            str += '<td>';
            str += '<a type="button" class="btn btn-default btn-sm update-user" id="update-user-'+ data[i].id +'" data-id="'+ data[i].id +'">修改</a>';
            str += '<a type="button" class="btn btn-default btn-sm delele-user" id="delele-user-'+ data[i].id +'" data-id="'+ data[i].id +'">删除</a>';
            str += '</td>';
            str += '</tr>';
        }
        $('#j-tbody-cont').append(str);
    };

    function hasClass(obj, sclass){
        var classArr = obj.classList;
        for(var i = 0; i < classArr.length; i++){
            if(sclass === classArr[i]){
                return true;
            }
        }
        return false;
    };

    function ajax(option){
        option  = option || {};
        option.url = option.url || '';
        option.method = option.method.toUpperCase() || 'POST';
        option.async = option.async || true;
        option.data = option.data || null;
        option.success = option.success || function() {};
        var xhr = new XMLHttpRequest(); //不兼非标准浏览器
        var params = [];
        for(var key in option.data){
            params.push(key + '=' + option.data[key]);
        }
        var postData = params.join('&');
        if(option.method.toUpperCase() === 'POST'){
            xhr.open(option.method, option.url, option.async);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
            xhr.send(postData);
        }
        else if(option.method.toUpperCase() === 'GET'){
            xhr.open(option.method, option.url + '?' + postData, option.async);
            xhr.send(null);
        }
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status == 200){
                option.success(xhr.response);
            }
        };
    };

    tbody.addEventListener('click', function(event){
        var target = event.target;
        if(hasClass(target, "update-user")){
            $("#myUpdateModal").modal({
                backdrop: 'static',
            });
            var id = target.dataset.id;
            updateId = id;
            getUser(id, 1);             //修改信息
        }else if(hasClass(target, "delele-user")){
            var id = target.dataset.id;
            delUser(id);
        }
    },false);

});