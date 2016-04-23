$(function(){

    function queryList(){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/queryList', true);
        xhr.responseType = 'json';
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status == 200){
                console.log(response)
            }
        };
        xhr.send();
    };

    function addUser(){
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/addUser', true);
        xhr.responseType = 'json';
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status == 200){
                console.log(response)
            }
        };
        var str = 'name='+name+'&phone=';
        xhr.send(jsonify(document.querySelector('#addForm')));
    };

    function jsonify(form){
        var values = [];
        Array.prototype.forEach.call(form.elements, function(element){
            if(element.type == 'text'){
                values[element.name] = element.value;
            }
        });
        return JSON.stringify(values);
    };


    queryList();

});





$('[id^="modify-user-"').on('click', {
    // id: ele.id,
    // uname: ele.uname,
    // userName: ele.userName,
    // sex: ele.sex,
    // phone: ele.phone,
    // description: ele.description,
    // status: ele.status,
    // email: ele.email
}, function(event) {
    // $('#j-update-id-input').val(event.data.id);
    // $("#j-update-name-input").val(event.data.uname);
    // $("#j-update-userName-input").val(event.data.userName);
    // $("input[name='j-update-sex-radio'][value=" + event.data.sex + "]").attr('checked', true);
    // $("#j-update-phone-input").val(event.data.phone);
    // $("#j-update-password-input").val(event.data.password);
    // $("#j-update-description-input").val(event.data.description);
    // $("input[name='j-update-status-radio'][value=" + event.data.status + "]").attr('checked', true);
    // alert(event.data.email);
    // $("#j-update-email-input").val(event.data.email);
    $("#myUpdateModal").modal({
        backdrop: 'static',
    });
}); //END

//新增用户
$('#j-add-btn').on('click', function() {
    $("#myAddModal").modal({
        backdrop: 'static',
    });
    // jQAddConfirmBtn.on('click', {}, function(event) {
    //     var name = $('#j-add-name-input').val();
    //     var userName = $('#j-add-userName-input').val();
    //     var sex = $('input[name="j-add-sex-radio"]:checked').val();
    //     var phone = $('#j-add-phone-input').val();
    //     var description = $('#j-add-description-input').val();
    //     var status = $('input[name="j-add-status-radio"]:checked').val();
    //     var email = $('#j-add-email-input').val();
    //     $.post('../sysUser/save', {
    //         name: name,
    //         userName: userName,
    //         sex: sex,
    //         phone: phone,
    //         description: description,
    //         status: status,
    //         email: email,
    //         password: ''
    //     }, function(ret) {
    //         console.log(ret);
    //         if (ret.code == 0) {
    //             $("#myAddModal").modal('hide');
    //             queryUserList('', pageNum, pageSize);
    //         }
    //     });
    // });
}); // END



