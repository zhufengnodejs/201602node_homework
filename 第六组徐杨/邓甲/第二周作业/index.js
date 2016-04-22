$(function () {
    var showAll= function () {
        $.ajax({
            method: 'get',
            url: '/users',
            dataType: 'json',
            cache: false,
            async: true,
        }).done(function (result) {
            var str='';
            $.each(result,function (index,item) {
                str+='<ul><li>'+item.id+'</li><li>'+item.name+'</li><li>'+item.movie+'</li><li><a href="javascript:;">删除</a></li></ul>';
            });
            $('#movieList').html('');
            $('#movieList').append(str);
        }).fail(function (err,headers) {
            console.log('404');
        });
    };
    showAll();

    $('#allMovie').on('click', function () {
        showAll();
    });

    $('#movieNameBtn').on('click', function (movie) {
        if($('#movieName').val()===''){
            alert('请输入电影名称');
            return;
        }else {
            movie=$('#movieName').val();
            $.ajax({
                method: 'get',
                url: '/users/'+movie,
                dataType: 'json',
                cache: false,
                async: true,
            }).done(function (result) {
                console.log(result);
                var str='';
                $.each(result,function (index,item) {
                    str+='<ul><li>'+item.id+'</li><li>'+item.name+'</li><li>'+item.movie+'</li><li><a href="javascript:;">删除</a></li></ul>';
                });
                $('#movieList').html('');
                $('#movieList').append(str);
            }).fail(function (err,headers) {
                console.log('404');
            });
        }

    });

    $('#addMovie').on('click', function () {
        var user,name,movie;
        if($('#actor').val()=='' || $('#movie').val()==''){
            alert('请完整填写');
            return;
        }else {
            name=$('#actor').val();
            movie=$('#movie').val();
        }
        user={
            name:name,
            movie:movie
        }
        console.log(user);
        $.ajax({
            type: 'post',
            url: '/users',
            data:user,
            dataType: 'json',
            cache: false,
            async: true,
        }).done(function (result) {
            console.log(result);
        }).fail(function (err,headers) {
            console.log('404');
        });
    });

    $('#movieList').on('click','a', function (e) {
        var id=$(this).parent().parent().children('li').eq(0).html();
        console.log(id);
        e.stopPropagation();
        $.ajax({
            type: 'delete',
            url: '/users/'+id,
            dataType: 'json',
            cache: false,
            async: true,
        }).done(function (result) {
            console.log(result);
            var str='';
            $.each(result,function (index,item) {
                str+='<ul><li>'+item.id+'</li><li>'+item.name+'</li><li>'+item.movie+'</li><li><a href="javascript:;">删除</a></li></ul>';
            });
            $('#movieList').html('');
            $('#movieList').append(str);
        }).fail(function (err,headers) {
            console.log('404');
        });
    });

    $('#submitMovie').on('click', function () {
        var id,user,name,movie;
        if($('#editId').val()=='' || $('#editActor').val()=='' || $('#editMovie').val()==''){
            alert('请完整填写');
            return;
        }else {
            id=$('#editId').val();
            name=$('#editActor').val();
            movie=$('#editMovie').val();
        }
        user={
            id:id,
            name:name,
            movie:movie
        };
        console.log(user);
        $.ajax({
            type: 'put',
            url: '/users/'+id,
            data:user,
            dataType: 'json',
            cache: false,
            async: true,
        }).done(function (result) {
            console.log(result);
        }).fail(function (err,headers) {
            console.log('404');
        });
    });
})
