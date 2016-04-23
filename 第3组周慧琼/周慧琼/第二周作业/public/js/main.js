/**
 * Created by HOME on 2016/4/21.
 */
var btnAdd = document.querySelector(".btn-add");
var dialog = document.querySelector('.dialog');
var nameObj = document.querySelector("#name"),
    ageObj = document.querySelector("#age");
var dataList = {
    init: function () {
        var that = this;
        var xhr = new XMLHttpRequest();
        xhr.open('get', '/get', true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && /^2\d{2}/.test(xhr.status)) {
                var data = JSON.parse(xhr.responseText);
                that.html(data)
            }
        };
        xhr.send();
    },
    del: function (id) {
        var that = this;
        var xhr = new XMLHttpRequest();
        xhr.open('post', '/delete', true);
        xhr.setRequestHeader('Content-type', 'application/json;chartset=utf-8');
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && /^2\d{2}/.test(xhr.status)) {
                var data = JSON.parse(xhr.responseText);
                that.html(data);
                that.dialogNew('删除成功');
            }
        };
        xhr.send(JSON.stringify({id: id}));
    },
    edit: function (id, name, age) {
        var that = this;
        var xhr = new XMLHttpRequest();
        xhr.open('put', '/edit/' + id + '/' + name + '/' + age + '', true);
        xhr.setRequestHeader('Content-type', 'application/json;chartset=utf-8');
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && /^2\d{2}/.test(xhr.status)) {
                var data = JSON.parse(xhr.responseText);
                that.html(data);
                that.dialogNew('编辑成功');
                that.clearText();
                btnAdd.innerHTML = "确认";
                btnAdd.setAttribute('userId','');
            }
        };
        xhr.send();
    },
    add: function (data) {
        var that = this;
        var xhr = new XMLHttpRequest();
        xhr.open('post', '/add', true);
        xhr.setRequestHeader('Content-type', 'application/json;chartset=utf-8');
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && /^2\d{2}/.test(xhr.status)) {
                var data = JSON.parse(xhr.responseText);
                that.html(data);
                that.clearText();
                that.dialogNew('添加成功');
            }
            ;
        };
        xhr.send(JSON.stringify(data));
    },
    html: function (data) {
        var html = "";
        data.forEach(function (item, index) {
            html += '<tr>' +
                '<td>' + (index + 1) + '</td>' +
                '<td>' + item.name + '</td>' +
                '<td>' + item.age + '</td>' +
                '<td>' +
                '<button type="button" class="btn btn-default btn-del" userId=' + item.id + '>删除</button>' +
                '<button type="button" class="btn btn-primary ml btn-edit" userId=' + item.id + '>编辑</button>' +
                '</td>' +
                '</tr>'
        });
        document.querySelector("#dataList").innerHTML = html;
    },
    clearText: function () {
        nameObj.value = null;
        ageObj.value = null;
    },
    dialogNew: function (text) {
        dialog.innerHTML = text;
        dialog.style.display = 'block';
        var i = 1;
        var timer = setInterval(function () {
            if (i == 0) {
                dialog.style.display = 'none';
                clearInterval(timer);
            };
            ;
            i--;
        }, 1000);
    }
}
dataList.init();
/*
 * DOM元素获取
 * */
var utils = {
    parent: function (curEle) {
        var parent = curEle.parentNode;
        while (parent.nodeType != 1) {
            parent = parent.parentNode;
        }
        ;
        return parent;
    },
    prev: function (curEle) {
        if ("previousElementSibling" in curEle) {
            return curEle.previousElementSibling;
        }
        ;
        var prevNode = curEle.previousSibling;
        while (prevNode.nodeType != 1) {
            prevNode = prevNode.previousSibling;
        }
        ;
        return prevNode;
    },
    prevAll: function (curEle) {
        var prevNode = this.prev(curEle);
        var ary = [];
        while (prevNode) {
            ary.unshift(prevNode);
            prevNode = this.prev(prevNode);
        }
        ;
        return ary;
    },
    children: function (curEle, type) {
        var child = curEle.childNodes, ary = [];
        for (var i = 0; i < child.length; i++) {
            if (child[i].nodeType == 1 && child[i]) {
                if (type) {
                    var reg = new RegExp("^" + type + "$", "i");
                    if (!reg.test(child[i].tagName)) continue;
                }
                ;
                ary.push(child[i]);
            }
            ;
        }
        ;
        return ary;
    },
    replace: function (target) {
        var siblingTd = utils.prevAll(utils.parent(target));
        nameObj.value = siblingTd[1].innerHTML;
        ageObj.value = siblingTd[2].innerHTML;
        btnAdd.innerHTML = "编辑";
        btnAdd.setAttribute('userId', target.getAttribute("userId"));
    }
}
//委托事件
document.body.addEventListener('click', function (event) {
    var target = event.target,
        html = target.tagName.toLowerCase(),
        dataId = target.getAttribute('userId');
    //删除事件
    if (html == 'button' && /btn-del/i.test(target.className) && dataId) {
        dataList.del(dataId);
    }
    ;
    //编辑
    if (html == 'button' && /btn-edit/i.test(target.className) && dataId) {
        utils.replace(target);
    }
    ;
    //增加
    if (html == 'button' && /btn-add/i.test(target.className)) {
        var name = nameObj.value, age = ageObj.value, id = target.getAttribute('userid');
        if (name && age) {
            if (id) {
                dataList.edit(id, name, age);
            } else {
                dataList.add({"name": name, "age": age});
            }
            return;
        }
        ;
        alert("必须填写");
    }
    ;
}, false);
