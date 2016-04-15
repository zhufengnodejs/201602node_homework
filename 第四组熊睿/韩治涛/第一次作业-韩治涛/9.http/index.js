setInterval(function(){
    //创建ajax对象
    var xhr = new XMLHttpRequest;
    //打开链接
    xhr.open('GET','/clock',true);
    //注册回调函数
    xhr.onreadystatechange = function(){
        //如果是ajax对象状态为就绪，并且响应码为200的时候
        if(xhr.readyState == 4 && xhr.status == 200){
            document.querySelector('#clock').innerHTML = xhr.responseText;
        }
    }
    xhr.send();
},5000)