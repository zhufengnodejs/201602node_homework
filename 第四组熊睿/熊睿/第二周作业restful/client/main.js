window.onload = function () {


    /*var handleShow = function () {

     }

     handleShow.prototype = {
     constructor: handleShow,
     init: function () {
     this.type = 0;
     this.puts = document.querySelectorAll('input[name=update_put]');        //PUT更新按钮
     this.patches = document.querySelectorAll('input[name=update_patch]');   //PATCH更新按钮
     this.shows = document.querySelectorAll()
     },
     disOrEnable: function () {

     },
     isNull: function (str) {                    //是否为空
     if(str.length===0 || str === null){
     return true;
     }
     return false;
     },
     isNumber:function(str){                   //是否是数字(不包含空串)
     return /^[0-9]+$/.test(str);
     },
     ajax:function(obj){                       //封装ajax
     var xhr = new XMLHttpRequest();
     xhr.open(obj.type,obj.url);
     xhr.onreadystatechange = function(){
     if(xhr.readyState === 4){
     if((xhr.status >=200 && xhr.status<300)||xhr.status ===304){
     obj.success(xhr.responseText);
     }else{
     obj.fail();
     }
     }
     }
     },
     handleEvent:function(){

     }
     }*/


    var type = '0',                                         //操作类型
        inputs = document.querySelector('#inputs'),
        inputs_inputs = inputs.querySelectorAll('input');       //输入框控制 id/username/pwd
    //buttons = document.querySelector('#buttons'),
    buttons_inputs = buttons.querySelectorAll('input');     //按钮控制   查询全部/单个/添加
    var selcet = document.querySelectorAll('input[type=radio]');    //单选按钮
    var puts = document.querySelectorAll('input[name=update_put]');     //put按钮
    var patchs = document.querySelectorAll('input[name=update_patch]');  //patch按钮
    var _tbody = document.querySelector('table tbody');
    //初始化PUT和PATCH按钮
    (function () {
        for (var i = 0; i < puts.length; i++) {
            puts[i].setAttribute('disabled', 'disabled');
            puts[i].className = 'disabled';
            patchs[i].setAttribute('disabled', 'disabled');
            patchs[i].className = 'disabled';
        }
    })();
    //重置文本
    function initValue() {
        for (var t = 0; t < inputs_inputs.length; t++) {
            inputs_inputs[t].value = "";
        }
    }

    //选项按钮事件
    for (var i = 0; i < selcet.length; i++) {
        selcet[i].addEventListener('click', function () {
            //_tbody.innerHTML = '';
            initValue();
            type = this.value;
            switch (type) {     //每个选项下的状态
                case '0':           //查询全部
                    disOrEnable(inputs_inputs, null);
                    disOrEnable(buttons_inputs, 'getAll');
                    break;
                case '1':           //ID查询
                    disOrEnable(inputs_inputs, 'uid');
                    disOrEnable(buttons_inputs, 'getById');
                    inputs_inputs[0].focus();
                    break;
                case '2':           //添加用户
                    disOrEnable(inputs_inputs, 'uid uname upwd');
                    disOrEnable(buttons_inputs, 'add');
                    inputs_inputs[0].focus();
                    break;
                case '3':           //PUT更新
                    disOrEnable(inputs_inputs, 'uname upwd');
                    disOrEnable(buttons_inputs, '');
                    inputs_inputs[1].focus();
                    puts = document.querySelectorAll('input[name=update_put]');
                    patchs = document.querySelectorAll('input[name=update_patch]')
                    for (var i = 0; i < puts.length; i++) {
                        patchs[i].setAttribute('disabled', 'disabled');
                        patchs[i].className = 'disabled';
                        puts[i].removeAttribute('disabled');
                        puts[i].className = 'enabled';
                    }
                    break;
                case '4':           //PATCH更新
                    disOrEnable(inputs_inputs, 'uname upwd');
                    disOrEnable(buttons_inputs, '');
                    puts = document.querySelectorAll('input[name=update_put]');
                    patchs = document.querySelectorAll('input[name=update_patch]')
                    inputs_inputs[1].focus();
                    for (var i = 0; i < patchs.length; i++) {
                        puts[i].setAttribute('disabled', 'disabled');
                        puts[i].className = 'disabled';
                        patchs[i].removeAttribute('disabled');
                        patchs[i].className = 'enabled';
                    }
                    break;
            }
        }, false);
    }
    selcet[0].click();

    //封装请求
    function ajax(obj) {
        var xhr = new XMLHttpRequest();
        xhr.open(obj.type, obj.url, 'async');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                    obj.success(xhr.responseText);
                } else {
                    obj.fail();
                }
            }
        }
        xhr.send(obj.data);
    }

//封装工具方法
    var util = {
        isNull: function (str) {           //是否为空
            if (str.length <= 0) {
                return true;
            }
            if (str == null) {
                return true;
            }
            return false;
        },
        isNumber: function (str) {         //是否是数字
            return /^[0-9]+$/.test(str);
        }
    }
//添加事件
    var container = document.querySelector('#box');
    container.addEventListener('click', function (event) {
        var event = event || window.event;
        var target = event.target || event.srcElement;
        switch (target.name) {
            case 'add':                         //添加操作
                addUser(target, _tbody);
                break;
            case 'getAll':                     //查询全部
                getAllUsers(target, _tbody);
                break;
            case 'getById':                   //查询单个用户
                getOneById(document.querySelector('input[name=uid]').value, target, _tbody);
                break;
            case 'update_put':                //Put方式更新
                updatePut(target, _tbody);
                break;
            case 'update_patch':             //patch方式更新
                updatePatch(target, _tbody);
                break;
            case 'delete':                  //删除
                deleteUser(target, _tbody);
                break;
            default:
                break;
        }
    }, false);

//按钮显示封装
    function disOrEnable(arr, index) {
        if (arr.length <= 0) {
            throw Error('传入对象为空');
        }
        for (var i = 0; i < puts.length; i++) {
            puts[i].setAttribute('disabled', 'disabled');
            puts[i].className = 'disabled';
            patchs[i].setAttribute('disabled', 'disabled');
            patchs[i].className = 'disabled';
        }
        for (var j = 0; j < arr.length; j++) {           //复位
            arr[j].removeAttribute('disabled');
            arr[j].className = 'enabled';
            if (arr[j].previousElementSibling && arr[j].previousElementSibling != null && arr[j].nodeName !== arr[j].previousElementSibling.nodeName) {
                arr[j].previousElementSibling.className = 'enabled';
            }
        }
        for (var i = 0; i < arr.length; i++) {          //设置
            if ((index || '').indexOf(arr[i].name) !== -1) {
                continue;
            }
            arr[i].className = 'disabled';
            arr[i].setAttribute('disabled', 'disabled');
            if (arr[i].previousElementSibling && arr[i].nodeName !== arr[i].previousElementSibling.nodeName) {
                arr[i].previousElementSibling.className = 'disabled';
            }
        }
    }

//获取全部用户
    function getAllUsers(target, _tbody) {
        target.setAttribute('disabled', 'disabled');
        target.className = 'disabled';
        _tbody.innerHTML = '';
        ajax({
            type: 'get',
            url: '/users',
            data: null,
            success: function (resText) {
                resText = JSON.parse(resText);
                resText.sort(function (obj1, obj2) {
                    return obj1.id - obj2.id;
                })
                var _html = '';
                for (var i = 0; i < resText.length; i++) {
                    _html += tpl(resText[i].id, resText[i].name, resText[i].pwd)
                }
                _tbody.innerHTML = _html;
                var puts = document.querySelectorAll('input[name=update_put]');
                var patchs = document.querySelectorAll('input[name=update_patch]');
                for (var i = 0; i < patchs.length; i++) {
                    puts[i].setAttribute('disabled', 'disabled');
                    puts[i].className = 'disabled';
                    patchs[i].setAttribute('disabled', 'disabled');
                    patchs[i].className = 'disabled';
                }
                target.removeAttribute('disabled');
                target.className = 'enabled';
            },
            fail: function () {
                alert('获取用户失败')
            }
        })
    }

    //获取ID用户
    function getOneById(id, target, _tbody) {
        if (!util.isNumber(id)) {
            alert('id必须是数字组成!');
            return;
        }
        target.setAttribute('disabled', 'disabled');
        target.className = 'disabled';
        _tbody.innerHTML = '';
        ajax({
            type: 'get',
            url: '/users/' + id,
            data: null,
            success: function (resText) {
                if (resText === '') {
                    alert('数据不存在')
                } else {
                    resText = JSON.parse(resText);
                    _tbody.innerHTML = tpl(resText.id, resText.name, resText.pwd);
                }

                var puts = document.querySelectorAll('input[name=update_put]');
                var patchs = document.querySelectorAll('input[name=update_patch]');
                for (var i = 0; i < patchs.length; i++) {
                    puts[i].setAttribute('disabled', 'disabled');
                    puts[i].className = 'disabled';
                    patchs[i].setAttribute('disabled', 'disabled');
                    patchs[i].className = 'disabled';
                }
                target.removeAttribute('disabled');
                target.className = 'enabled';
            },
            fail: function () {
                alert('获取用户失败')
            }

        })
    }

    //删除用户
    function deleteUser(target, _tbody) {
        var id = target.parentNode.parentNode.children[0].innerHTML;
        target.setAttribute('disabled', 'disabled');
        target.className = 'disabled';
        //_tbody.innerHTML = '';
        ajax({
            type: 'delete',
            url: '/users/' + id,
            data: null,
            success: function (resText) {
                if (resText === '') {
                    alert('没有数据')
                } else {
                    resText = JSON.parse(resText);
                    _tbody.removeChild(target.parentNode.parentNode);
                }

                var puts = document.querySelectorAll('input[name=update_put]');
                var patchs = document.querySelectorAll('input[name=update_patch]');
                for (var i = 0; i < patchs.length; i++) {
                    puts[i].setAttribute('disabled', 'disabled');
                    puts[i].className = 'disabled';
                    patchs[i].setAttribute('disabled', 'disabled');
                    patchs[i].className = 'disabled';
                }
                target.removeAttribute('disabled');
                target.className = 'enabled';
            },
            fail: function () {
                alert('删除用户失败')
            }

        })

    }

    //增加用户
    function addUser(target, _tbody) {
        var uname = document.querySelector('input[name=uname]').value,
            upwd = document.querySelector('input[name=upwd]').value,
            uid = document.querySelector('input[name=uid]').value;
        if (util.isNull(uname) || util.isNull(upwd)) {
            alert('用户名或密码不能为空');
            return;
        }
        if (!(/^[0-9]*$/.test(uid))) {
            alert('ID必须是数字');
            return;
        }
        target.setAttribute('disabled', 'disabled');
        target.className = 'disabled';
        //_tbody.innerHTML = '';
        ajax({
            type: 'post',
            url: '/users',
            data: 'id=' + uid + '&uname=' + uname + '&upwd=' + upwd,
            success: function (resText) {
                if (resText === '') {
                    alert('此ID已经存在');
                } else {
                    resText = JSON.parse(resText);
                    var _html = tpl(resText.id, resText.name, resText.pwd)
                    _tbody.innerHTML += _html;
                }

                var puts = document.querySelectorAll('input[name=update_put]');
                var patchs = document.querySelectorAll('input[name=update_patch]');
                for (var i = 0; i < patchs.length; i++) {
                    puts[i].setAttribute('disabled', 'disabled');
                    puts[i].className = 'disabled';
                    patchs[i].setAttribute('disabled', 'disabled');
                    patchs[i].className = 'disabled';
                }
                target.removeAttribute('disabled');
                target.className = 'enabled';
            },
            fail: function () {
                alert('添加用户失败')
            }
        })
    }

    //更新用户put方式（更新全部资源,对象覆盖）
    function updatePut(target, _tbody) {
        var uname = document.querySelector('input[name=uname]').value,
            upwd = document.querySelector('input[name=upwd]').value,
            uid = target.parentNode.parentNode.children[0].innerHTML;
        if (util.isNull(uname) || util.isNull(upwd)) {
            alert('不允许局部更新,请完善信息');
            return;
        }
        target.setAttribute('disabled', 'disabled');
        target.className = 'disabled';
        ajax({
            type: 'put',
            url: '/users/' +uid ,
            data: 'id='+uid+'&name=' + uname + '&pwd=' + upwd,
            success: function (resText) {
                if (resText === '') {
                    alert('非法更新');
                } else {
                    resText = JSON.parse(resText);
                    target.parentNode.parentNode.children[1].innerHTML = resText.name;
                    target.parentNode.parentNode.children[2].innerHTML = resText.pwd;
                }
                target.removeAttribute('disabled');
                target.className = 'enabled';
            },
            fail: function () {
                alert('添加用户失败')
            }
        })
    }


    //更新用户patch方式(更新部分资源，属性覆盖)
    function updatePatch(target, _tbody) {
        var uname = document.querySelector('input[name=uname]').value,
            upwd = document.querySelector('input[name=upwd]').value;
        if (util.isNull(uname) && util.isNull(upwd)) {
            alert('请输入要更新的字段');
            return;
        }
        target.setAttribute('disabled', 'disabled');
        target.className = 'disabled';
        ajax({
            type: 'PATCH',
            url: '/users/' + target.parentNode.parentNode.children[0].innerHTML,
            data: 'name=' + uname + '&pwd=' + upwd+'&age='+10,          //这里的age=10将不会生效
            success: function (resText) {
                if (resText === '') {
                    alert('非法更新');
                } else {
                    resText = JSON.parse(resText);
                    target.parentNode.parentNode.children[1].innerHTML = resText.name;
                    target.parentNode.parentNode.children[2].innerHTML = resText.pwd;
                }
                target.removeAttribute('disabled');
                target.className = 'enabled';
            },
            fail: function () {
                alert('添加用户失败')
            }
        })
    }
}


function tpl(id, name, pwd) {
    return '<tr>'
        + '<td>' + id + '</td>'
        + '<td>' + name + '</td>'
        + '<td>' + pwd + '</td>'
        + '<td><input type="button" value="PUT更新" name="update_put"/></td>'
        + '<td><input type="button" value="PATCH更新" name="update_patch"/></td>'
        + '<td><input type="button" value="删除" name="delete"/></td>'
        + '</tr>'
}

