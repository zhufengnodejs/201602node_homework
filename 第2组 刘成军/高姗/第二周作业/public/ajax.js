var reg=document.querySelector('#reg');
var tableRestful=document.querySelector('#table-restful');
var username=document.querySelector('#username');
var userage=document.querySelector('#userage');
var save=document.querySelector('#save');
var cancel=document.querySelector('#cancel');
var icon=document.querySelector('#icon');
function addClass(ele,strClass){
	//判断样式中是否有这个样式
	var reg=new RegExp("(?:^| +)"+strClass+"(?: +|$)");
	if(!reg.test(ele.ClassName)){//没有验证通过说明没有才增加样式
		ele.className+=" "+strClass;
	}

};
//移除样式
function removeClass(ele,strClass){
	var reg=new RegExp("(?:^| +)"+strClass+"(?: +|$)","g");
	//有可能有多个重复的  第二个参数要用逗号隔开("gim")
	ele.className=ele.className.replace(reg,"")
}
function prevSiblings(ele){
	var a=[];
	var p=ele.previousSibling;
	while(p){
		if(p.nodeType===1){
			a.push(p)
		}
		p= p.previousSibling
	}
	return a
}
//获取用户拼接字符串
function userGet(result){
	var str=''
	str+='<tr><th>ID</th><th>用户名</th><th>年龄</th><th class="text-center">操作</th></tr>';
	for(var i=0;i<result.length;i++){
		str+='<tr><th>'+result[i].id+'</th>'
		str+='<th>'+result[i].name+'</th>'
		str+='<th>'+result[i].age+'</th>'
		str+='<th class="text-center"><button type="button" class="btn btn btn-warning round" id="edit" attr='+result[i].id+'>编辑</button>'
		str+='<button type="button" class="btn btn btn-danger round" id="delete" attr='+result[i].id+'>删除</button></th>'
		str+='</tr>'
	}
	return str
}
function inserUser(url,type){
	addClass(icon,'show')
	var nameV=username.value
	var ageV=userage.value
	if(nameV&&ageV){
		var obj={}
		obj.name=nameV,
			obj.age=ageV
		var xhr=new XMLHttpRequest();
		xhr.open(type,url,true);
		xhr.responseType='json';
		xhr.setRequestHeader('Content-Type','application/json')
		xhr.onreadystatechange=function(){
			if(xhr.readyState==4&&xhr.status==200){
				var res=xhr.response;
				console.log(res);
				user();
				removeClass(icon,'show');
				addClass(icon,'hide')
			}
		}
		xhr.send(JSON.stringify(obj))
		obj=null;
		username.value='';
		userage.value=''
	}
}
//查看所有用户
function user(){
	addClass(icon,'show')
	var xhr=new XMLHttpRequest();
	xhr.open('GET','/users',true);
	xhr.responseType='json'
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4&&xhr.status==200){
			var res=xhr.response;
			var result=userGet(res)
			tableRestful.innerHTML=result;
			removeClass(icon,'show');
			addClass(icon,'hide')
		}
	}
	xhr.send()
}
user();
//点击注册
reg.onclick=function(){
	inserUser('/users','POST')
}
//获取一个用户编辑
tableRestful.addEventListener('click',function(e){
	var target= e.target;
	if(target.getAttribute('id')=='edit'){
		reg.className+=' hide';
		save.className='btn btn btn-primary';
		cancel.className='btn btn btn-default';
		var id=target.getAttribute('attr');
		var parent=target.parentNode;
		var sib=prevSiblings(parent);
		username.value=sib[1].innerHTML;
		userage.value=sib[0].innerHTML;
		save.setAttribute('attr',id);
	}
})
save.onclick=function(){
	var id=this.getAttribute('attr');
	console.log(id);
	if(username.value&&userage.value){
		inserUser('/users/'+id,'PATCH');
		reg.className='btn btn btn-info';
		save.className='btn btn btn-primary hide';
		cancel.className='btn btn btn-default hide';
	}
}
cancel.onclick=function(){
	username.value='';
	userage.value='';
	reg.className='btn btn btn-info';
	save.className='btn btn btn-primary hide';
	cancel.className='btn btn btn-default hide';
}
tableRestful.addEventListener('click',function(e){
	var target= e.target;
	if(target.getAttribute('id')=='delete'){
		addClass(icon,'show')
		var id=target.getAttribute('attr');
		console.log(id)
		var xhr=new XMLHttpRequest();
		xhr.open('DELETE','/users/'+id,true);
		xhr.onreadystatechange=function(){
			if(xhr.readyState==4&&xhr.status==200){
				var res=xhr.response;
				console.log(res)
				user();
				removeClass(icon,'show');
				addClass(icon,'hide')
			}
		}
		xhr.send()
	}
})
