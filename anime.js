var anime=function(){
    "use strict";
    /*
      パラメーターの名前はparameter
    */
    var context=document.getElementById("anime");
    var ctx=context.getContext("2d");
    var parameter=anime.parameter
    var position={x:parameter.height/2,y:parameter.height/2};
    
    ctx.clearRect(0,0,context.width,context.height);
    //描画
    position.y-=anime.coe.a0/2/anime.fourier.max*parameter.height/2;
    for(var i=1;i<=parameter.num;i++){
	var len=Math.sqrt(Math.pow(anime.coe["a"+i],2)+Math.pow(anime.coe["b"+i],2));
	var rot=Math.atan2(anime.coe["a"+i],anime.coe["b"+i]);
	ctx.beginPath();
	ctx.arc(position.x,position.y,len/anime.fourier.max*parameter.height/2,0,Math.PI*2,true);
	ctx.strokeStyle="black";
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(position.x,position.y);
	position.x-=len*Math.cos(i*Math.PI*anime.theta/parameter.L+rot)/anime.fourier.max*parameter.height/2;
	position.y-=len*Math.sin(i*Math.PI*anime.theta/parameter.L+rot)/anime.fourier.max*parameter.height/2;
	ctx.lineTo(position.x,position.y);
	ctx.strokeStyle="grey";
	ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(position.x,position.y,15,0,Math.PI*2,true);
    ctx.fillStyle="rgb(192,80,77)";
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(position.x,position.y);
    ctx.lineTo(parameter.height,-anime.fourier(anime.theta)+parameter.height/2);
    ctx.strokeStyle="rgb(155,187,89)"
    ctx.stroke();
    
    ctx.beginPath();
    ctx.strokeStyle="black";
    ctx.moveTo(parameter.height,-anime.fourier(anime.theta)+parameter.height/2);
    for(var i=parameter.height;i<parameter.width;i+=parameter.dr){
	ctx.lineTo(i,-anime.fourier(i+anime.theta-parameter.height)+parameter.height/2);
    }
    ctx.stroke();
    
    anime.theta++;
    if(anime.flag!==0)window.requestAnimationFrame(anime);
    else window.cancelAnimationFrame(anime);
};

anime.set=function(){
    "use strict";
    /*
      入力フォームの作成
      パラメーターの名前はname
      buttonの名前はfname
      buttonのclickイベント関数はflink
      パラメーターはparameter
      個体の諸情報はindiv
      valueはvalue
    */
    
    //前準備
    var context=document.getElementById("anime");
    var form=document.createElement("form");
    form.id="setting";
    var table=document.createElement("table");
    var name=anime.para_name;
    var fname=anime.func_name;
    var flink=anime.func_link;
    var para_def=anime.para_default;
    var parameter=anime.parameter;
    Object.freeze(name);
    Object.freeze(fname);
    Object.freeze(flink);
    var tr=[]

    //パラメーターの設定
    for(var i=name.length;i--;){
	if(typeof para_def[i]==="undefind"||MYNS.kbtit931.Vector.isNum(para_def[i])==false)para_def[i]=0;
	else para_def[i]=Number(para_def[i]);
	parameter[name[i]]=para_def[i];
    }
    Object.freeze(para_def);
    
    //canvasの大きさを設定
    context.width=parameter.width;
    context.height=parameter.height;

    //パラメーターの名前を表示する列
    tr[0]=document.createElement("tr");
    for(var i=0,max=name.length;i<max;i++){
	var th=document.createElement("th");
	var text=document.createTextNode(name[i]);
	th.appendChild(text);
	th.width=80;
	tr[0].appendChild(th);
    }
    for(var i=fname.length;i--;){
	var th=document.createElement("th");
	tr[0].appendChild(th);
    }

    //パラメーターを入力する列
    tr[1]=document.createElement("tr");
    for(var i=0,max=name.length;i<max;i++){
	var th=document.createElement("th");
	var input=document.createElement("input");
	input.type="text";
	input.id="input_"+name[i];
	input.size=5;
	input.value=para_def[i];
	th.appendChild(input);
	tr[1].appendChild(th);
    }
    
    //上記列のボタン
    for(var i=0,max=fname.length;i<max;i++){
	var th=document.createElement("th");
	var button=document.createElement("button");
	button.type="button";
	var text=document.createTextNode(fname[i]);
	button.appendChild(text);
	button.addEventListener("click",flink[i],false);
	th.appendChild(button);
	tr[1].appendChild(th);
    }

    //制作したDOMの当てはめ
    table.appendChild(tr[0]);
    table.appendChild(tr[1]);
    form.appendChild(table);
    context.parentNode.insertBefore(form,context);

    anime.theta=0;
    anime.setcoe();
    anime.flag=1;
    //anime()を実行
    window.requestAnimationFrame(anime);
};
anime.parameter={};

anime.para_name=["width","height","dr","num","L",];

anime.para_default=[1200,800,1,5,200];

anime.func_name=["set","write","stop"];

anime.coe={};

anime.para_set=function(){
    "use strict"
    /*
      パラメーターを入力ホームから設定
      パラメーターはparameter
      パラメーター名はname
    */
    var parameter=anime.parameter;
    var name=anime.para_name;
    for(var i=name.length;i--;){
	var para=document.getElementById("input_"+name[i]);
	if(MYNS.kbtit931.Vector.isNum(para.value)==true)parameter[name[i]]=Number(para.value);
	para.value=parameter[name[i]];
    }
    
    //canvasの大きさを設定
    var context=document.getElementById("anime");
    context.width=parameter.width;
    context.height=parameter.height;
};

anime.write=function(){
    "use strict";
    /*
      描画
    */
    anime.para_set();
    anime.setcoe();
    if(anime.flag!==1){
	anime.flag=1;
	anime();
    }
};
anime.setcoe=function(){
    anime.para_set();

    var parameter=anime.parameter;
    var context=document.getElementById("anime");
    var form=document.getElementById("form");
    var coe=document.createElement("form");
    coe.id="coe";
    var table=document.createElement("table");

    tr1=document.createElement("tr");
    var th=document.createElement("th");
    var text=document.createTextNode("a0");
    th.appendChild(text);
    th.width=80;
    tr1.appendChild(th);
    tr2=document.createElement("tr");
    var th=document.createElement("th");
    var input=document.createElement("input");
    input.type="text";
    input.id="a0";
    input.size=5;
    if(document.getElementById("a0")==null||MYNS.kbtit931.Vector.isNum(document.getElementById("a0").value)==false)input.value=typeof anime.coe["a0"]!=="undefined"?anime.coe["a0"]:Math.floor(Math.random()*20);
    else input.value=document.getElementById("a0").value;
    anime.coe["a0"]=Number(input.value);
    th.appendChild(input);
    tr2.appendChild(th);
    table.appendChild(tr1);
    table.appendChild(tr2);
    for(var i=1;i<=anime.parameter.num;i++){
	//パラメーターの名前を表示する列
	tr1=document.createElement("tr");
	var th=document.createElement("th");
	var text=document.createTextNode("a"+i);
	th.appendChild(text);
	th.width=80;
	tr1.appendChild(th);
	var th=document.createElement("th");
	var text=document.createTextNode("b"+i);
	th.appendChild(text);
	th.width=80;
	tr1.appendChild(th);
	
	//パラメーターを入力する列
	tr2=document.createElement("tr");
	var th=document.createElement("th");
	var input=document.createElement("input");
	input.type="text";
	input.id="a"+i;
	input.size=5;
	if(document.getElementById("a"+i)==null||MYNS.kbtit931.Vector.isNum(document.getElementById("a"+i).value)==false)input.value=typeof anime.coe["a"+i]!=="undefined"?anime.coe["a"+i]:Math.floor(Math.random()*20);
	else input.value=document.getElementById("a"+i).value;
	anime.coe["a"+i]=Number(input.value);
	th.appendChild(input);
	tr2.appendChild(th);
	var th=document.createElement("th");
	var input=document.createElement("input");
	input.type="text";
	input.id="b"+i;
	input.size=5;
	if(document.getElementById("b"+i)==null||MYNS.kbtit931.Vector.isNum(document.getElementById("b"+i).value)==false)input.value=typeof anime.coe["b"+i]!=="undefined"?anime.coe["b"+i]:Math.floor(Math.random()*20);
	else input.value=document.getElementById("b"+i).value;
	anime.coe["b"+i]=Number(input.value);
	th.appendChild(input);
	tr2.appendChild(th);

	table.appendChild(tr1);
	table.appendChild(tr2);
    }
    coe.appendChild(table);
    var be_coe=document.getElementById("coe");
    if(be_coe!=null)be_coe.parentNode.removeChild(be_coe);
    context.parentNode.insertBefore(coe,context);

    var max=anime.coe.a0/2;
    for(var i=1;i<=parameter.num;i++){
	max+=Math.sqrt(Math.pow(anime.coe["a"+i],2)+Math.pow(anime.coe["b"+i],2));
    }
    anime.fourier=function(x){
	var sum=0;
	sum+=anime.coe.a0/2;
	for(var i=1;i<=parameter.num;i++){
	    sum+=anime.coe["a"+i]*Math.cos(i*Math.PI*x/parameter.L)+anime.coe["b"+i]*Math.sin(i*Math.PI*x/parameter.L);
	}
	return sum/max*parameter.height/2;
    };
    anime.fourier.max=max;
};
anime.stop=function(){
    "use strict";
    //アニメーションを停止
    if(anime.flag!==0){
	anime.para_set();
	anime.setcoe();
	anime.flag=0;
    }
};
anime.func_link=[anime.setcoe,anime.write,anime.stop];
