$(function () {
    var showAll= function () {
        $.ajax({
            method: 'get',//请求的方法
            url: '/users',//请求的url
            dataType: 'json',//返回的数据类型
            cache: false,//是否缓存 不缓存 ts=Date.now()
            async: true,//是否异步
        }).done(function (result) {//成功处理
            var str='';
            $.each(result,function (index,item) {
                str+='<ul><li>'+item.id+'</li><li>'+item.name+'</li><li>'+item.movie+'</li><li><a href="javascript:;">删除</a></li></ul>';
            });
            $('#movieList').html('');
            $('#movieList').append(str);
        }).fail(function (err,headers) {//错误处理
            console.log('404');
        });
    };
    showAll();

    //显示全部收藏
    $('#allMovie').on('click', function () {
        showAll();
    });

    //按照电影名称查询
    $('#movieNameBtn').on('click', function (movie) {
        if($('#movieName').val()===''){
            alert('请输入电影名称');
            return;
        }else {
            movie=$('#movieName').val();
            $.ajax({
                method: 'get',//请求的方法
                url: '/users/'+movie,//请求的url
                dataType: 'json',//返回的数据类型
                cache: false,//是否缓存 不缓存 ts=Date.now()
                async: true,//是否异步
            }).done(function (result) {//成功处理
                console.log(result);
                var str='';
                $.each(result,function (index,item) {
                    str+='<ul><li>'+item.id+'</li><li>'+item.name+'</li><li>'+item.movie+'</li><li><a href="javascript:;">删除</a></li></ul>';
                });
                $('#movieList').html('');
                $('#movieList').append(str);
            }).fail(function (err,headers) {//错误处理
                console.log('404');
            });
        }

    })

    //新增收藏
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
            type: 'post',//请求的方法
            url: '/users',//请求的url
            data:user,
            dataType: 'json',//返回的数据类型
            cache: false,//是否缓存 不缓存 ts=Date.now()
            async: true,//是否异步
        }).done(function (result) {//成功处理
            console.log(result);
        }).fail(function (err,headers) {//错误处理
            console.log('404');
        });
    });

    //删除
    $('#movieList').on('click','a', function (e) {
        var id=$(this).parent().parent().children('li').eq(0).html();
        console.log(id);
        e.stopPropagation();
        $.ajax({
            type: 'delete',//请求的方法
            url: '/users/'+id,//请求的url
            dataType: 'json',//返回的数据类型
            cache: false,//是否缓存 不缓存 ts=Date.now()
            async: true,//是否异步
        }).done(function (result) {//成功处理
            console.log(result);
            var str='';
            $.each(result,function (index,item) {
                str+='<ul><li>'+item.id+'</li><li>'+item.name+'</li><li>'+item.movie+'</li><li><a href="javascript:;">删除</a></li></ul>';
            });
            $('#movieList').html('');
            $('#movieList').append(str);
        }).fail(function (err,headers) {//错误处理
            console.log('404');
        });
    });

    //修改
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
            type: 'put',//请求的方法
            url: '/users/'+id,//请求的url
            data:user,
            dataType: 'json',//返回的数据类型
            cache: false,//是否缓存 不缓存 ts=Date.now()
            async: true,//是否异步
        }).done(function (result) {//成功处理
            console.log(result);
        }).fail(function (err,headers) {//错误处理
            console.log('404');
        });
    });
})
