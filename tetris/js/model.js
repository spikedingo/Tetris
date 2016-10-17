// JavaScript Document\
//addLoadEvent
function addLoadEvent(func){
	var oldload = window.onload;
	if (typeof window.onload != "function"){
		window.onload = func;
	}
	else{
		window.onload = function(){
		    oldload();
		    func;
      	}
    }
}

//getByClass
function getByClass(oParent,sClass){
    var tagName = oParent.getElementsByTagName("*");
    var arr = [];
    for (i=0; i<tagName.length; i++){
	    if (tagName[i].className == sClass){
			arr.push(tagName[i]);
		}
	}
	return arr;
}

//数组随机取元素
function getRandomElement(arr)
{
    return arr[Math.floor(Math.random()*arr.length)];
}

function getStyle(obj,attr){
	if(obj.currentStyle){
		return obj.currentStyle[attr];
	}
	else{
		return getComputedStyle(obj,false)[attr];
	}
}

function sortNumber(a,b)
{
return a - b
}

function IsntPC(){
     var userAgentInfo = navigator.userAgent;
     var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
     var flag = false;
     for (var v = 0; v < Agents.length; v++) {
         if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = true; break; }
     }
     return flag;
}

$(function(){


var windowWidth = document.body.scrollWidth;
if (windowWidth >1600) {
	var cube = 40;
}else if(windowWidth > 1080 && windowWidth <= 1600){
	var cube = 30;
}else{
	var cube = parseInt(windowWidth/15/10)*10;
}
var isntPC = IsntPC();
var disLeft = 0;
var disTop = 0;
var canControl = false;
var arrPredicted = [];
var div1 = document.getElementById('div1');
var oDiv = document.getElementById('placed');
var oUl = div1.getElementsByTagName('ul')[0];
var oMoving = document.getElementById('moving');
var saveDiv = document.getElementById('save');
var oNext = document.getElementById('next');
var aDivNext = getByClass(oNext,'nextDiv');
var oPlayBox = document.getElementById('playbox');
var oScore = getByClass(oNext,'score')[0];
var oLines = getByClass(oNext,'linesCleared')[0];
var oTouch = document.getElementById('touchControl');
var bLeft = document.getElementById('bLeft');
var bRight = document.getElementById('bRight');
var bChange = document.getElementById('bChange');
var bStore = document.getElementById('bStore');
var bPlace = document.getElementById('bPlace');
div1.style.width = cube*10+ 'px';
div1.style.height = cube*20 + 'px';
oTouch.style.width = cube*15 + 'px';
oPlayBox.style.width = cube*15 + 'px';
oPlayBox.style.height = cube*20 + 'px';
//游戏区域定位
oUl.style.left = disLeft + 'px';
oUl.style.top = disTop + 'px';
var shadowCol = ['#83ffa9','#6b98ff','#fbff7c','#ffd37c','#93ecff','#fff','#ff6161'];

if (false) {
	saveDiv.style.width = cube*10/4 + 'px';
	saveDiv.style.height = cube*10/4 + 'px';
	oNext.style.width = cube*10/4*3 + 'px';
	oNext.style.height = cube*10/4 + 'px';
	saveDiv.style.top = disTop + cube*20 + 'px';
	saveDiv.style.left = disLeft + 'px';
	oNext.style.top = disTop + cube*20 + 'px';
	oNext.style.left = disLeft + saveDiv.offsetWidth + 'px';
	for (var i = 0; i < aDivNext.length; i++) {
		aDivNext[i].style.width = cube*5 + 'px';
		aDivNext[i].style.height = cube*4 + 'px';
	};
}else{
	saveDiv.style.width = cube*5 + 'px';
	saveDiv.style.height = cube*20/4 + 'px';
	oNext.style.width = cube*5 + 'px';
	oNext.style.height = cube*20/4*3 + 'px';
	saveDiv.style.top = disTop + 'px';
	saveDiv.style.left = disLeft + cube*10 + 'px';
	oNext.style.top = disTop + cube*20/4 + 'px';
	oNext.style.left = disLeft + cube*10 + 'px';
	for (var i = 0; i < aDivNext.length; i++) {
		aDivNext[i].style.width = cube*5 + 'px';
		aDivNext[i].style.height = cube*5 + 'px';
	};
}

//计分变量
var linesCleared = 0;
var scorePlayed = 0;

//初始化方块格式
var T = [[0,0,0,0,1,0,1,1,1], [1,0,0,1,1,0,1,0,0], [1,1,1,0,1,0,0,0,0], [0,0,1,0,1,1,0,0,1]];
var L = [[1,0,0,1,0,0,1,1,0], [1,1,1,1,0,0,0,0,0], [0,1,1,0,0,1,0,0,1], [0,0,0,0,0,1,1,1,1]];
var J = [[0,0,1,0,0,1,0,1,1], [0,0,0,1,0,0,1,1,1], [1,1,0,1,0,0,1,0,0], [1,1,1,0,0,1,0,0,0]];
var O = [[1,1,1,1]];
var I = [[0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0], [0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1]];
var S = [[0,0,0,0,1,1,1,1,0], [0,1,0,0,1,1,0,0,1]];
var Z = [[0,0,0,1,1,0,0,1,1], [0,1,0,1,1,0,1,0,0]];

var shapeType = [T,L,J,O,I,S,Z];
var shapeColor = ['0.gif','1.gif','2.gif','3.gif','4.gif','5.gif','6.gif']

//根据宽度生成包含方块的N*N大小方块，以方便方块旋转
var shapeWidth = [3,2,2,2,1,3,3];

//生成游戏区域
function createTable(){
	for (var i = 0; i < 200; i++) {
		var oLi = document.createElement('li');
		oLi.style.width = cube + 'px';
		oLi.style.height = cube + 'px';
		oLi.style.left = i%10*cube + 'px';
		oLi.style.top = parseInt(i/10)*cube + 'px';
		oLi.style.background = 'black';
		oLi.isSolid = 0;
		oUl.appendChild(oLi);
	};
}



//生成方块对象，对象自身包含各功能。(是否预测，是否已预读方块形状，是否使用存储的方块)
var createNewParts = function(predicting,shape,usingSaved){
	if (usingSaved === 1) {
		this.usingSaved = 1;
	};
	var oPart = document.createElement('div');
	oPart.style.position = 'absolute';
	oPart.style.top = disTop - cube*2 + 'px';
	oPart.style.left = disLeft + 'px';
	oPart.className = 'movingPart';
	this.canSave = 1;
	canControl = true;
	this.dropSpeed = 500;

	//根据情况生成随机或指定形状的方块
	if (arrPredicted.length !== 0) {
		if (shape && predicting !== 1) {
			this.shape = shape;
		}else if (predicting === 1) {
			this.shape = getRandomElement(shapeType);
		  //this.shape = I;
		}else{ this.shape = arrPredicted[0].shape;}
	}else{this.shape = getRandomElement(shapeType)}
	this.shapeNumber = 0;
	var numBorder = Math.sqrt(this.shape[this.shapeNumber].length);
	for (var i = 0; i < this.shape[this.shapeNumber].length; i++) {
		if (this.shape[this.shapeNumber][i] === 1) {
			var partsEle = document.createElement('div');
			var eleImg = document.createElement('img');
			eleImg.style.width = cube + 'px';
			eleImg.style.height = cube + 'px';
			eleImg.src ='img/' + shapeType.indexOf(this.shape) + '.gif';
			partsEle.appendChild(eleImg);
			partsEle.className = 'parts';
			partsEle.style.position = 'absolute';
			partsEle.style.width = cube + 'px';
			partsEle.style.height = cube + 'px';
			oPart.appendChild(partsEle);
		};
	}
	this.objParts = oPart;
	oPart.style.left = oUl.offsetLeft + cube*4 +'px';
	oPart.style.zIndex = 99;
	oMoving.appendChild(oPart);
	this.shapeObj(this,1);
}

createNewParts.prototype = {

	//确定每个方块中小方块的位置以为方块束形
	shapeObj: function(obj,predicting){

		var aDiv = obj.objParts.getElementsByTagName('div');
		var divIndex = 0;
		var cantTrans = 0;
		var tarDisArrX = [];
		var tarDisArrY = [];
		var numBorder = Math.sqrt(obj.shape[obj.shapeNumber].length);
		for (var i = 0; i < obj.shape[obj.shapeNumber].length; i++) {
			if (obj.shape[obj.shapeNumber][i] === 1){
				tarDisArrX.push(i%numBorder*cube);
				tarDisArrY.push(parseInt(i/numBorder)*cube);
			}
		}
		var checkObjCanTransform = obj.canTransform(obj,tarDisArrX,tarDisArrY);
		if ( checkObjCanTransform === true ) {
			divIndex = 0;
			for (var i = 0; i < obj.shape[obj.shapeNumber].length; i++) {
				if(obj.shape[obj.shapeNumber][i] === 1){
					aDiv[divIndex].style.left = i%numBorder*cube + 'px';
					aDiv[divIndex].style.top = parseInt(i/numBorder)*cube + 'px';
					aDiv[divIndex].isPlaced = 0;
					divIndex++;
				}
			};
			if (predicting !== 1) {
				obj.shadowPart(obj);
			};
		}else{
			var tarDisArrXnew = tarDisArrX.map(function(x){return x+checkObjCanTransform*cube});
			var checkAgain = obj.canTransform(obj,tarDisArrXnew,tarDisArrY);
			if (checkAgain === true) {
				var objLeft = obj.objParts.offsetLeft
				obj.objParts.style.left = objLeft + checkObjCanTransform * cube + 'px';
				obj.shapeObj(obj);
				if (predicting !== 1) {
					obj.shadowPart(obj);
				};
			}else{
				obj.cantTransFormEff(obj);
				obj.shapeNumber--;
			}
		}
	},

	//方块变形功能，改变方块shapeNumber再通过shapeObj函数生成形状
	transForm: function(obj){
		obj.shapeNumber ++;
		if (obj.shapeNumber == obj.shape.length) {
			obj.shapeNumber = 0;
		};
		obj.shapeObj(obj);
	},

	//无法变形时会有无法变形的特效
	cantTransFormEff: function(obj){
		var aDiv = obj.objParts.getElementsByTagName('div');
		for (var i = 0; i < aDiv.length; i++) {
			aDiv[i].style.background = 'red';
			var alertImg = aDiv[i].getElementsByTagName('img')[0];
			alertImg.style.opacity = 0;
			alertImg.timerAlert = null;
			startMoveNormal(alertImg,{'opacity':100},alertImg.timerAlert);
		};
	},

	//检测能否变形的函数
	canTransform: function(obj,arr,arr2){
		var aDiv = obj.objParts.getElementsByTagName('div');
		var checkBorder = 0;
		var checkBottom = 0;
		var objCross = 0;
		var crossed = 0;
		var objPlaced = oDiv.getElementsByTagName('div');
		for (var i = 0; i < aDiv.length; i++) {
			var aDivLeft = arr[i] + obj.objParts.offsetLeft;
			var aDivRight = arr[i] + obj.objParts.offsetLeft + aDiv[i].offsetWidth
			if (aDivRight > (cube*10 + disLeft)){
				checkBorder--;
			}else if(aDivLeft < disLeft){
				checkBorder++;
			}
			if (objPlaced.length > 0) {
				for (var j = 0; j < objPlaced.length; j++) {
					if (aDiv[i].offsetLeft + obj.objParts.offsetLeft > objPlaced[j].offsetLeft) {
						if (arr2[i]+obj.objParts.offsetTop === objPlaced[j].offsetTop) {
							if (aDivLeft < objPlaced[j].offsetLeft + objPlaced[j].offsetWidth) {
								objCross++;
								crossed++;
							};
						};
					}else if(aDiv[i].offsetLeft + obj.objParts.offsetLeft < objPlaced[j].offsetLeft){
						if (arr2[i]+obj.objParts.offsetTop === objPlaced[j].offsetTop) {
							if (aDivRight > objPlaced[j].offsetLeft) {
								objCross--;
								crossed++;
							};
						};
					}
				};
			};
		};
		if (checkBorder === 0 && objCross === 0 && crossed === 0 ) {
			return true;
		}else{
			return objCross !== 0 ? objCross : checkBorder;
		}
	},

	//是否触碰Y轴边界-版块最下方or已存在放置的方块
	reachY: function(obj,speed){
		var checkObjY = 0;
		var aDiv = obj.getElementsByTagName('div');
		for (var i = 0; i < aDiv.length; i++) {
			if((aDiv[i].offsetHeight + aDiv[i].offsetTop + obj.offsetTop + speed) > disTop + cube*20){
				checkObjY ++;
			}
			var objPlaced = oDiv.getElementsByTagName('div');
			if (objPlaced.length > 0) {
				var oDivTop = aDiv[i].offsetTop + obj.offsetTop;
				for (var j = 0; j < objPlaced.length; j++) {
					if (objPlaced[j].cleared !== 1) {
						if((aDiv[i].offsetHeight + oDivTop + speed)>objPlaced[j].offsetTop &&
							aDiv[i].offsetLeft + obj.offsetLeft ===
							objPlaced[j].offsetLeft &&
							aDiv[i].offsetHeight + oDivTop <= objPlaced[j].offsetTop){
							checkObjY ++;
						}
					};

				};
			};
		};
		if (checkObjY !== 0 ) { return true };
	},

	//是否触碰X轴边界-版块左右方or已存在放置的方块
	reachX : function(obj,speed,dir){
		var checkObjX = 0;
		var aDiv = obj.objParts.getElementsByTagName('div');
		switch(dir){
			case 'left':
			for (var i = 0; i < aDiv.length; i++) {
				if((aDiv[i].offsetLeft + obj.objParts.offsetLeft + speed)< disLeft ){
					checkObjX++;
				}
				var objPlaced = oDiv.getElementsByTagName('div');
				if (objPlaced.length > 0) {
					var aDivLeft = aDiv[i].offsetLeft + obj.objParts.offsetLeft;
					for (var j = 0; j < objPlaced.length; j++) {
						if (Math.abs(objPlaced[j].offsetTop -
							(aDiv[i].offsetTop+obj.objParts.offsetTop))<cube &&
							(aDivLeft + speed)<
							(objPlaced[j].offsetLeft+objPlaced[j].offsetWidth) &&
							 aDivLeft > objPlaced[j].offsetLeft) {
								checkObjX++;
						};
					};
				};
			};
			break;
			case 'right':
			for (var i = 0; i < aDiv.length; i++) {
				if((aDiv[i].offsetLeft + obj.objParts.offsetLeft +
					aDiv[i].offsetWidth + speed)> cube*10 + disLeft){
					checkObjX++;
				}
				var objPlaced = oDiv.getElementsByTagName('div');
				if (objPlaced.length > 0) {
					var aDivLeft = aDiv[i].offsetLeft + obj.objParts.offsetLeft;
					for (var j = 0; j < objPlaced.length; j++) {
						if (Math.abs(objPlaced[j].offsetTop -
							(aDiv[i].offsetTop+obj.objParts.offsetTop))< cube &&
							(aDivLeft + aDiv[i].offsetWidth + speed)>
							objPlaced[j].offsetLeft && aDivLeft < objPlaced[j].offsetLeft) {
								checkObjX++;
						};
					};
				};
			};
			break;
		}
		if ( checkObjX !== 0 ) { return true }else{
			return false;
		}
	},

	//正在下落方块的下方投影，即使显示方块在最下方放置的状态。
	shadowPart: function(obj){
		var shadowDiv = getByClass(oMoving,'shadowObj')[0];
		var aDiv = obj.objParts.getElementsByTagName('div');

		if (shadowDiv) {
			var arrShadowPart = getByClass(shadowDiv,'shadow');
			obj.shadowObj.style.left = obj.objParts.offsetLeft + 'px';
			obj.shadowObj.style.top = obj.objParts.offsetTop + 'px';
			for (var i = 0; i < aDiv.length; i++) {
				//oShadowPart.style.position = 'absolute';
				arrShadowPart[i].style.left = aDiv[i].offsetLeft + 'px';
				arrShadowPart[i].style.top = aDiv[i].offsetTop + 'px';
			}
		};

		if (!shadowDiv) {
			var oShadow = document.createElement('div');
			oShadow.style.position = 'absolute';
			oShadow.style.left = obj.objParts.offsetLeft + 'px';
			oShadow.style.top = obj.objParts.offsetTop + 'px';
			oShadow.className = 'shadowObj';
			for (var i = 0; i < aDiv.length; i++) {
				var oShadowPart = document.createElement('div');
				oShadowPart.className = 'shadow';
				oShadowPart.style.width = cube +'px';
				oShadowPart.style.height= cube +'px';
				oShadowPart.style.position = 'absolute';
				oShadowPart.style.left = aDiv[i].offsetLeft + 'px';
				oShadowPart.style.top = aDiv[i].offsetTop + 'px';
				oShadowPart.style.border = 'solid 1px black';
				oShadowPart.style.background = shadowCol[shapeType.indexOf(obj.shape)];
				oShadowPart.style.opacity = 0;
				startMoveNormal(oShadowPart,{'opacity':50},oShadowPart.timerOpa)
				oShadow.appendChild(oShadowPart);
			};
			obj.shadowObj = oShadow;
			obj.shadowed = 1;
			oShadow.style.zIndex = 99;
			oMoving.appendChild(oShadow);
		};

		//通过递归确定影子方块的位置
		function shadowPos(obj){
			var shadowTop = obj.shadowObj.offsetTop;
			var cantGoDown = obj.reachY(obj.shadowObj,cube);
			if (cantGoDown !== true) {
				obj.shadowObj.style.top = shadowTop + cube + 'px';
				return shadowPos(obj);
			}else{
				shadowPos = null;
			}
		}

		if (obj.shadowObj.getElementsByTagName('div').length === 4) {
			shadowPos(obj);
		};
	},

	//自动下落函数
	autoMove: function(obj){
		obj.timerHorizon = setInterval(function(){
			var oTop = obj.objParts.offsetTop;
			var checkY = false;
			checkY = obj.reachY(obj.objParts,cube);
			if (checkY !== true) {
				obj.objParts.style.top = oTop + cube + 'px';
				obj.shadowPart(obj);
			}else{
				clearInterval(obj.timerHorizon);
				obj.partPlace(obj);}
		},obj.dropSpeed);
	},

	//控制操作函数
	controlMove: function(obj){
		obj.timerVertical = null;
		obj.timerDelay = null;
		obj.moveDis = 0;
		obj.moveDir = '';
		obj.timerVertical = setInterval(function(){
			var oLeft = obj.objParts.offsetLeft;
			if (obj.moveDis !== 0) {
				var checkX = false;
				checkX = obj.reachX(obj,obj.moveDis,obj.moveDir);
				if (checkX !== true) {
					obj.objParts.style.left = oLeft + obj.moveDis + 'px';
					obj.shadowPart(obj);
				};
			};
		},100);
		obj.timerAccelerate = setInterval(function(){
			var oTop = obj.objParts.offsetTop;
			if (obj.moveDisY !== 0) {
				var checkY = false;
				checkY = obj.reachY(obj.objParts,obj.moveDisY);
				if (checkY !== true) {
					obj.objParts.style.top = oTop + obj.moveDisY + 'px';
				}else{
					clearInterval(obj.timerHorizon);
					obj.partPlace(obj);
				}
			}
		},50);
		function moveNormal(dir){
			if (dir === 1) {
				var direction = 'right';
			}else{
				var direction = 'left';
			}
			if (obj.moveDis === 0){
			    var oLeft = obj.objParts.offsetLeft;
			    var checkX = false;
			    checkX = obj.reachX(obj,cube*dir,direction);
			    if (checkX !== true ) {
			  	    obj.objParts.style.left = oLeft + cube*dir + 'px';
			    };
			  	    obj.shadowPart(obj);
			    obj.timerDelay = setTimeout(function(){
			  	    obj.moveDis = cube*dir;
			  	    obj.moveDir = direction;
			    },200);
			}
		}

		//快速放置函数-按方向键上可瞬间将方块安置在影子方块显示的位置
		function quickPart(){
			obj.objParts.style.top = obj.shadowObj.offsetTop + 'px';
			obj.objParts.style.left = obj.shadowObj.offsetLeft + 'px';
			clearInterval(obj.timerHorizon);
			obj.partPlace(obj);
		}
		function clearMove(){
			clearTimeout(obj.timerDelay);
			obj.moveDis = 0;
			obj.moveDir = '';
			obj.moveDisY= 0;
		}
		bLeft.onmousedown = function(ev){
			var ev = ev || event;
			moveNormal(-1);
			bLeft.onmouseup = function(){
				clearMove()
			}
		}
		bRight.onmousedown = function(ev){
			var ev = ev || event;
			moveNormal(1);
			bRight.onmouseup = function(){
				clearMove()
			}
		}
		bChange.onclick = function(){
			obj.transForm(obj);
		}
		bPlace.onclick = function(){
			quickPart();
		}
		document.onkeydown = function(ev){
			var ev = ev || event;
			if (canControl === true) {
				switch (ev.keyCode){
					case 65:
						moveNormal(-1);
					  	break;
					case 68:
						moveNormal(1);
					  	break;
					case 87:
						quickPart();
						break;
					case 74:
					  obj.transForm(obj);
					  break;
					case 83:
				 		clearInterval(obj.timerHorizon);
				 		obj.autoMoving = 1;
				 		obj.moveDisY = cube;
				 	  break;
				}
				document.documentElement.onkeyup = function(){
					clearTimeout(obj.timerDelay);
					obj.moveDis = 0;
					obj.moveDir = '';
					obj.moveDisY= 0;
					if (obj.autoMoving === 1) {
						clearInterval(obj.timerHorizon);
				 		obj.autoMove(obj);
				 		obj.autoMoving = 0;
					};
				}
			};
		}
	},

	//方块放置函数，在一个div内统一放置，以便检查是否可以消除
	partPlace: function(obj){
		var aDiv = obj.objParts.getElementsByTagName('div');
		var oDisX = obj.objParts.offsetLeft;
		var oDisY = obj.objParts.offsetTop;
		for (var i = 0; i < aDiv.length; i++) {
			var oPlacedPart = document.createElement('div');
			var oPlacedImg = document.createElement('img');
			oPlacedImg.style.width = cube + 'px';
			oPlacedImg.style.height = cube + 'px';
			oPlacedImg.src = 'img/' + shapeType.indexOf(this.shape) + '.gif';
			oPlacedPart.appendChild(oPlacedImg);
			oPlacedPart.className = "parts";
			oPlacedPart.style.position = 'absolute';
			oPlacedPart.style.width = cube + 'px';
			oPlacedPart.style.height = cube + 'px';
			oPlacedPart.style.left = aDiv[i].offsetLeft + oDisX + 'px';
			oPlacedPart.style.top = aDiv[i].offsetTop + oDisY + 'px';
			oPlacedPart.style.zIndex = 99;
			oDiv.appendChild(oPlacedPart);
		};
		clearInterval(obj.timerHorizon);
		oMoving.removeChild(obj.objParts);
		oMoving.removeChild(obj.shadowObj);

		obj.clearing = false;

		obj.checkClear(obj);

		if (obj.clearing === true) {
			canControl = false;
			var sentDelay = setTimeout(function(){
				var oPart = new createNewParts();
				oPart.sentNewPart(oPart);
			},600);
		}else{
			var oPart = new createNewParts();
			oPart.sentNewPart(oPart);
		}
	},

	//检测是否可以消除函数
		//遍历已放置的方块，每行高度作为变量key，将每行的方块各存入arr[key]中，方便检测是否满足消除条件。
	checkClear: function(obj){
		var arr = {};
		var aDivPlaced = oDiv.getElementsByTagName('div');
		for (var i = 0; i < aDivPlaced.length; i++) {
			var key = JSON.stringify(aDivPlaced[i].offsetTop);
			if (!(key in arr)) {
				arr[key]=[];
				arr[key].push(aDivPlaced[i]);
			}else{
				arr[key].push(aDivPlaced[i]);
			}
		};
		var keyHeight = cube*20+disTop;
		var keyArr = [];
		for(key in arr){
			if (arr[key].length === 10) {
				linesCleared++;
				if (key < keyHeight) { keyHeight = key};
				keyArr.push(key);
				arr[key] = arr[key].sort(function(a,b){return a.offsetLeft>b.offsetLeft?1:-1});
				for (var i = 0; i < arr[key].length; i++) {
					obj.clearEffect(arr[key][i],i*10);
				};
			};
		}
		lines1 = keyArr.length;

		switch(keyArr.length){
			case 1: scorePlayed += 100; break;
			case 2: scorePlayed += 300; break;
			case 3: scorePlayed += 600; break;
			case 4: scorePlayed += 1000; break;
		};

		oScore.innerHTML = 'score:' + scorePlayed + 'pts';
		oLines.innerHTML = 'lines:' + linesCleared;
		for (var i = 0; i < keyArr.length; i++) {
			if((keyArr[i]-keyArr[i-1])>cube){
				var keyHeightSecond = Number(keyArr[i]);
				var lines2 = keyArr.length - i;
			}
		};
		if (keyArr.length !== 0) {
			var aDivAfterCleared = oDiv.getElementsByTagName('div');
			obj.clearing = true;
			var timer = setTimeout(function(){
				var oShadowDiv = getByClass(oMoving,'shadowObj')[0];
				if (oShadowDiv) {
					var oShadowTop = oShadowDiv.offsetTop;
					oShadowDiv.style.top = oShadowTop + keyArr.length*cube + 'px';
					startMoveNormal(oShadowDiv,{"top":(oShadowTop + keyArr.length*cube)},oShadowDiv.timerDrop);
				};
				for (var i = 0; i < aDivAfterCleared.length; i++) {
					var oDisY = aDivAfterCleared[i].offsetTop;
					if ( keyHeightSecond && keyHeight< oDisY  && oDisY < keyHeightSecond ){
						startMoveNormal(aDivAfterCleared[i],{"top":(oDisY+lines2*cube)},aDivAfterCleared[i].timerDrop);
					}else if (oDisY < keyHeight) {
						startMoveNormal(aDivAfterCleared[i],{"top":(oDisY+lines1*cube)},aDivAfterCleared[i].timerDrop);
					};
				};
			},200);
		};
	},

	//方块消除特效
	clearEffect: function(obj,time){
		var oWidth = obj.offsetWidth;
		var oHeight = obj.offsetHeight;
		var oTarWidth = parseInt(oWidth * 1.2);
		var oTarHeight = parseInt(oHeight * 1.2);
		var tarLeft = obj.offsetLeft - (parseInt(oWidth * 1.2) - oWidth)/2;
		var tarTop = obj.offsetTop - (parseInt(oHeight * 1.2) - oHeight)/2;
		var oJson = {
								 "width":oTarWidth,
								 "height":oTarHeight,
								 "opacity":0
								};
		function removeObj(obj){ oDiv.removeChild(obj);}
		var timer = setTimeout(function(){
			startMoveNormal(obj,oJson,obj.timerClear,removeObj);
		},time);
	},

	//发派新方块函数
	sentNewPart: function(obj){
		obj.autoMove(obj);
		obj.controlMove(obj);
		obj.saveApart(obj);
		obj.pauseFunction(obj);
		obj.shadowPart(obj);
		obj.predictParts(obj.usingSaved);
	},

	//方块存储功能
	saveApart: function(obj){
		var saved = getByClass(saveDiv,'savedDiv');
		function saveFn(){
			if (obj.canSave === 1) {
				if (saved.length !== 0) {
					saveDiv.removeChild(saved[0]);
				}
				oMoving.removeChild(obj.shadowObj);
				clearInterval(obj.timerHorizon);
				oMoving.removeChild(obj.objParts);
				var aDivPredict = obj.objParts.getElementsByTagName('div');
				obj.objParts.className = 'savedDiv';
				saveDiv.appendChild(obj.objParts);
				obj.saveAndPredictPosition(obj);
				if (saved.length !== 0) {
					var oPart1 = new createNewParts(0,saveDiv.shape,1);
				}else{
					var oPart1 = new createNewParts();
				}
				oPart1.sentNewPart(oPart1);
				oPart1.canSave = 0;
				saveDiv.shape = obj.shape;
			}
		}
		bStore.onclick = function(){
			saveFn();
		}
		document.documentElement.onkeydown = function(ev){
			var ev = ev || event;
			if (ev.keyCode === 75 ) {
				saveFn();
			};
		}
	},

	//确定方块在存储栏的位置，美化显示
	saveAndPredictPosition: function(obj){
		var aDivPredict = obj.objParts.getElementsByTagName('div');
		var predictLengthX = [];
		var predictLengthY = [];
		for (var j = 0; j < aDivPredict.length; j++) {
			//alert(aDivPredict[j].offsetLeft)
			var inArrX = predictLengthX.some(function(x){ return x===aDivPredict[j].offsetLeft});
			var inArrY = predictLengthY.some(function(x){ return x===aDivPredict[j].offsetTop});
			if (inArrX === false) {
				predictLengthX.push(aDivPredict[j].offsetLeft);
			};
			if (inArrY === false) {
				predictLengthY.push(aDivPredict[j].offsetTop);
			};
		};
		predictLengthX = predictLengthX.sort(sortNumber);
		predictLengthY = predictLengthY.sort(sortNumber);
		obj.objParts.style.left = (cube*5-cube*predictLengthX.length)/2-predictLengthX[0] + 'px';
		obj.objParts.style.top = (cube*5-cube*predictLengthY.length)/2-predictLengthY[0] + 'px';
	},

	//生成新方块功能
	predictParts: function(usingSaved){
		if (usingSaved !== 1) {
			if (arrPredicted.length === 0) {
				for (var i = 0; i < aDivNext.length; i++) {
					var oPart = new createNewParts(1);
					oPart.saveAndPredictPosition(oPart);
					oPart.shapeObj(oPart,1)
					oPart.objParts.shape = oPart.shape;
					oPart.objParts.className = 'predicted';
					oMoving.removeChild(oPart.objParts);
					aDivNext[i].appendChild(oPart.objParts);
					arrPredicted.push(oPart.objParts);
				};
			}else{
			  arrPredicted.shift(arrPredicted[0]);
			  var oPart = new createNewParts(1);
				oPart.shapeObj(oPart,1)
				oPart.saveAndPredictPosition(oPart);
				oPart.objParts.shape = oPart.shape;
				oPart.objParts.className = 'predicted';
				oMoving.removeChild(oPart.objParts);
				arrPredicted.push(oPart.objParts);
				for (var i = 0; i < arrPredicted.length; i++) {
					aDivNext[i].innerHTML = '';
					aDivNext[i].appendChild(arrPredicted[i]);
				};
			}
		};
	},

	//暂停功能
	pauseFunction: function(obj){
		var paused = 0;
		document.documentElement.onkeypress = function(ev){
			var ev = ev || event;
			if (ev.keyCode === 13) {
				if (paused === 0) {
					clearInterval(obj.timerHorizon);
					var pauseP = document.createElement('p');
					pauseP.innerHTML = 'PAUSE';
					pauseP.className = 'pause';
					oMoving.appendChild(pauseP);
					pauseP.style.left = (cube*10 - 100)/2 + 'px';
					pauseP.style.top = (cube*20 - 30)/2 + 'px';
					paused = 1;
				}else{
					var pauseP = getByClass(oMoving,'pause')[0];
					oMoving.removeChild(pauseP);
					obj.autoMove(obj);
					paused = 0;
				}
			};
			return false;
		}
	}
}

createTable()
var oPart1 = new createNewParts();
oPart1.sentNewPart(oPart1);


//运动函数
function startMoveNormal(obj, json, timer, fn){
	clearInterval(timer);
	timer=setInterval(function (){
		var bStop=true;
		for(var attr in json){
			var iCur=0;

			if(attr=='opacity'){
				iCur=parseInt(parseFloat(getStyle(obj, attr))*100);
			}else{
				iCur=Math.round(parseFloat(getStyle(obj, attr)));
			}

			var iSpeed=(json[attr]-iCur)/8;
			iSpeed=iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);

			if(iCur!=json[attr]){
				bStop=false;
			}

			if(attr=='opacity'){
				obj.style.filter='alpha(opacity:'+(iCur+iSpeed)+')';
				obj.style.opacity=(iCur+iSpeed)/100;
			}else{
				obj.style[attr]=iCur+iSpeed+'px';
			}
		}
		if(bStop){
			clearInterval(timer);
			if (fn) {fn(obj)};
		}
	}, 10)
}

})


// 1.限制左右边界函数  1
// 2.限制重合函数   1
// 3.限制变形函数   1
// 4.方块不同颜色   1
// 5.消除特效   1
// 6.微调
// 7.集成发放新方块函数 	1
// 8.新方块预读取函数   1
// 9.UI制作 --------------------PAUSE
//							    GAMEOVER
//                              CLEAR
// 10.储存方块功能   1
// 11.计分功能 1
// 12.game over
// 13.Pause  1
// 14.限制变形特效  1
// 15.方块最下方投影   1
// 16.插入音乐
// 17.方块投影速度，方块储存后消除投影bug   1
// 18.按上直接放置  1
