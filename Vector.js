//include namespace.js
/*
  Vectorオブジェクトを定義します。
  コンストラクタにはVectorを配列か、
*/
MYNS.kbtit931.Vector=function(){
    "use strict";
    MYNS.kbtit931.Vector.prototype.set.apply(this,arguments);
};

MYNS.kbtit931.Vector.prototype={
    set:function(){
	//引数が配列で指定される場合と、そうでない場合の対応
	var arr=Array.prototype.slice.call(arguments);
	if(Object.prototype.toString.call(arr[0]) === '[object Array]'){
	    //引数が配列の場合
	    var len=arr[0].length, propo=true,vec=new Array(len),dim=len;
	    for(;len--;){
		propo=propo&&MYNS.kbtit931.Vector.isNum(arr[0][len]);
		vec[len]=Number(arr[0][len]);
	    }
	    if(!propo){
		vec=false;
		dim=false;
	    }
	    if(arr[1]==="chain")var chain=true;
	}
	else{
	    //引数が配列でない場合
	    var len=arr.length,propo=true,vec=new Array(len),dim=len;
	    for(;len--;){
		propo=propo&&MYNS.kbtit931.Vector.isNum(arr[len]);
		vec[len]=Number(arr[len]);
	    }
	    if(!propo){
		vec=false;
		dim=false;
	    }
	}
	Object.defineProperties(this,{
	    "vec":{
		value:Object.freeze(vec),
		enumerable:true,
		configurable:true,
	    },
	    "dim":{
		value:dim,
		enumerable:true,
		configurable:true,
	    },
	    "isVector":{
		value:(vec!==false&&dim!==false),
		enumerable:true,
		configurable:true,
	    },
	});
	if(this.isVector){
	    //falseのVectorではない時
	    var j=dim,sum=0;
	    for(;j--;)sum+=Math.pow(vec[j],2);
	    sum=Math.sqrt(sum);
	    if(sum===1||sum===0||chain===true){
		Object.defineProperties(this,{
		    "norm":{
			value:this,
			enumerable:true,
			configurable:true,
		    },
		    "len":{
			value:this.len||sum,
			enumerable:true,
			configurable:true,
		    },
		});
	    }else{
		var norm_vec=new Array(dim);
		var sum_2=0;
		for(j=dim;j--;){
		    norm_vec[j]=vec[j]/sum;
		    sum_2+=Math.pow(norm_vec[j],2);
		}
		sum_2=Math.sqrt(sum_2);
		for(j=dim;j--;)norm_vec[j]=norm_vec[j]/sum_2;
		norm=new MYNS.kbtit931.Vector(norm_vec,"chain");
		Object.defineProperties(this,{
		    "norm":{
			value:norm,
			enumerable:true,
			configurable:true,
		    },
		    "len":{
			value:sum,
			enumerable:true,
			configurable:true,
		    },
		});
	    }
	}else{
	    //falseのVectorの時
	    Object.defineProperties(this,{
		"norm":{
		    value:this,
		    enumerable:true,
		    configurable:true,
		},
		"len":{
		    value:false,
		    enumerable:true,
		    configurable:true,
		},
	    });
	}
	return this;
    },
    add:function(){
	if(!this.isVector)return MYNS.kbtit931.Vector.create(false);
	var len=arguments.length,dim=this.dim;
	for(var i=len;i--;)if((!(arguments[i] instanceof MYNS.kbtit931.Vector))||dim!==arguments[i].dim)return MYNS.kbtit931.Vector.create(false);;
	var result_vec=this.vec.concat();
	for(var i=dim;i--;)for(var j=len;j--;)result_vec[i]+=arguments[j].vec[i];;
	return MYNS.kbtit931.Vector.create(result_vec);
    },
    inner_p:function(){
	if(!this.isVector)return false;
	var dim=this.dim,v=this.vec;
	if(arguments.length!=1||(!(arguments[0] instanceof MYNS.kbtit931.Vector))||dim!==arguments[0].dim)return false;
	var result=0,u=arguments[0].vec;
	for(var i=dim;i--;)result+=v[i]*u[i];
	return result;
	
    },
    outer_p:function(){
	if(!this.isVector)return false;
	var dim=this.dim,v=this.vec;
	if(dim>3||arguments.length!=1||!(arguments[0] instanceof MYNS.kbtit931.Vector)||dim!=arguments[0].dim)return false;
	var u=arguments[0].vec;
	for(var i=dim;i<3;i++){
	    v.push(0);
	    u.push(0);
	}
	return MYNS.kbtit931.Vector.create([v[1]*u[2]-v[2]*u[1],v[2]*u[0]-v[0]*u[2],v[0]*u[1]-v[1]*u[0]]);
    },
    scal:function(k){
	if(!this.isVector||!MYNS.kbtit931.Vector.isNum(k))return MYNS.kbtit931.Vector.create(false);
	var result=this.vec.concat();
	for(var i=result.length;i--;)result[i]=k*result[i];
	return MYNS.kbtit931.Vector.create(result);
    },
    rot:function(u){
	var inner=this.inner_p(u),v_len=this.len,u_len=u.len;
	if(inner.isVector===false||v_len===0||u_len===0)return false;
	return Math.acos(inner/(v_len*u_len));
    },
    rot_d:function(u){
	//反時計回りを正として自身のベクトルから引数のベクトルを見た時の角度を返します。
	var rot=this.rot(u),outer=this.outer_p(u).vec;
	if(outer===false||rot===false||this.dim>2)return false;
	if(outer[2]<0)return 2*Math.PI-rot;
	else return rot;
    },
};
MYNS.kbtit931.Vector.create=function(){
    var v=new MYNS.kbtit931.Vector();
    return v.set.apply(v,arguments);
}

MYNS.kbtit931.Vector.isNum=function(x){
    "use strict";
    /*
      入力値が数かどうか判別します。
      有限の値でなければfalseを返し、有限の値ならtrueを返します。
      文字列としての数字はtrueが返されます。
    */
    if(isNaN(x)==true||x===true||x===false||x===null||x===""||typeof x==="undefined")return false;
    return isFinite(x);
};
