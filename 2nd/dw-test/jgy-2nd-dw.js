//uglifyjs jgy-2nd-dw.js  -mo jgy-2nd-dw-dst.js 
window.Jinguanyu = function(id, x, y, src){
    var _this = this;
    this.id = null;
    this.node = null;
    this.width = 100;
    this.height = 100;
    var _tmpImgs; this.src = src || (_tmpImgs=[
        'http://s1.dwstatic.com//duowanvideo//20170421//16//2851325.gif',
        'http://s1.dwstatic.com//duowanvideo//20170421//16//2942787.gif',
        'http://s1.dwstatic.com//duowanvideo//20170421//16//300020.gif',
        'http://s1.dwstatic.com//duowanvideo//20170421//16//3016197.gif',
        'http://s1.dwstatic.com//duowanvideo//20170421//16//3039727.gif',
        'http://s1.dwstatic.com//duowanvideo//20170421//16//3124371.gif',
        'http://s1.dwstatic.com//duowanvideo//20170421//16//3147378.gif',
        'http://s1.dwstatic.com//duowanvideo//20170421//16//3207831.png',
        'http://s1.dwstatic.com//duowanvideo//20170421//16//3228193.png',
        'http://s1.dwstatic.com//duowanvideo//20170421//16//3247997.png',
        'http://s1.dwstatic.com//duowanvideo//20170421//16//3329231.gif',
        'http://s1.dwstatic.com//duowanvideo//20170421//16//335042.gif',
        'http://s1.dwstatic.com//duowanvideo//20170421//16//3424768.gif',
        'http://s1.dwstatic.com//duowanvideo//20170421//16//3446276.gif',
        'http://s1.dwstatic.com//duowanvideo//20170421//16//3519505.png',
        'http://s1.dwstatic.com//duowanvideo//20170421//16//3556417.gif',
        'http://s1.dwstatic.com//duowanvideo//20170421//16//3631577.gif',
        'http://s1.dwstatic.com//duowanvideo//20170421//16//3658309.gif',
        'http://s1.dwstatic.com//duowanvideo//20170421//16//3721262.gif',
        'http://s1.dwstatic.com//duowanvideo//20170421//16//3745153.gif',
        'http://s1.dwstatic.com//duowanvideo//20170421//16//380446.gif',
        'http://s1.dwstatic.com//duowanvideo//20170421//16//3844799.png'
    ])[Math.floor(Math.random()*_tmpImgs.length)];
    this.left = 0;
    this.top = 0;
    this.trendX = 0;//当前水平移动步长（右正左负）
    this.trendY = 0;//当前竖直移动步长（下正上负）
    this.trend = 0;//trendX与trendY的合成步长（非负数）。在内核二级API调用后，才会产生动力，即trend值，方使内核三级API有效。
    this.angle = null;//以纵坐标轴向下方向为基准，逆时针旋转至当前方向时，与基准方向的夹角。在发生移动时，角度将被设置。
    //[内核四级API]【待测试】方盒碰撞检测支持，每次发生动作时都需调用
    this.promiseBoxLimit = function(left1, top1, left2, top2, callback){
        left1 = left1 || 0;
        top1 = top1 || 0;
        left2 = left2 || document.body.scrollWidth;
        top2 = top2 || document.body.scrollHeight;
        var atLeft = this.left <= left1;
        var atRight = this.left + this.width >= left2;
        var atTop = this.top <= top1;
        var atBottom = this.top + this.height >= top2;
        if ('function' == typeof callback) {            
            callback(this, {atLeft:atLeft, atRight:atRight, atTop:atTop, atBottom:atBottom}, {top1:top1, left1:left1, top2:top2, left2:left2});
        } else {
            if (atLeft&&atTop || atTop&&atRight || atRight&&atBottom || atBottom&&atLeft) {
                this.move(-this.trendX, -this.trendY);
            } else if (atTop || atBottom) {
                this.move(this.trendX, -this.trendY);
            } else if (atLeft || atRight) {
                this.move(-this.trendX, this.trendY);
            } else {
                //this.move(this.trendX, this.trendY);//本函数只保证不出界，不负责继续前进
            }
        }
    };
    //[内核三级API]前进
    this.forward = function(offset){
        offset = offset || this.trend;
        if (0 == this.trend) return;//需要内核二级API提供的动力
        var ratio = offset / this.trend;
        this.move(this.trendX * ratio, this.trendY * ratio);
    };
    //[内核三级API]后退
    this.backward = function(offset){
        offset = offset || this.trend;
        if (0 == this.trend) return;//需要内核二级API提供的动力
        var ratio = offset / this.trend;
        this.move(- this.trendX * ratio, - this.trendY * ratio);
    };
    //[内核三级API]左转
    this.leftward = function(offset){
        offset = offset || this.trend;
        if (0 == this.trend) return;//需要内核二级API提供的动力
        var ratio = offset / this.trend;
        if (this.trendX * this.trendY >= 0) {
            this.move(this.trendX * ratio, - this.trendY * ratio);
        } else {
            this.move(- this.trendX * ratio, this.trendY * ratio);
        }
    };
    //[内核三级API]右转
    this.rightward = function(offset){
        offset = offset || this.trend;
        if (0 == this.trend) return;//需要内核二级API提供的动力
        var ratio = offset / this.trend;
        if (this.trendX * this.trendY >= 0) {
            this.move(- this.trendX * ratio, this.trendY * ratio);
        } else {
            this.move(this.trendX * ratio, - this.trendY * ratio);
        }
    };
    //[内核三级API]任意角度转向（以当前运动方向，逆时针旋转的角度）
    this.angleward = function(angle, offset){
        offset = offset || this.trend;
        if (0 == this.trend) return;//需要内核二级API提供的动力
        var ratio = offset / this.trend;
        //var oldAngle = Math.asin(this.trendX/this.trend);
        var offsetX = Math.sin(this.angle + Math.PI*angle/180) * offset;
        var offsetY = Math.cos(this.angle + Math.PI*angle/180) * offset;
        this.move(offsetX, offsetY);
    };
    //[内核二级API] 基础任意角（以纵坐标轴向下方向，逆时针旋转指定角度所指的方向）移动。由于trend值的计算问题，不建议直接设置，应该以调用moveY()来替代之
    this.moveAngle = function(angle, offset){
        var offsetX = Math.sin(Math.PI*angle/180) * offset;
        var offsetY = Math.cos(Math.PI*angle/180) * offset;
        this.setX(this.left + offsetX);
        this.setY(this.top + offsetY);
        this.trendX = offsetX;
        this.trendY = offsetY;
        this.trend = offset;
        this.angle = angle;
    };
    //[内核二级API]基础合成移动
    this.move = function(offsetX, offsetY){
    	var offsetX = offsetX || this.trendX;
    	var offsetY = offsetY || this.trendY;
        this.setX(this.left + offsetX);
        this.setY(this.top + offsetY);
        this.trendX = offsetX;
        this.trendY = offsetY;
        this.trend = Math.sqrt(Math.pow(this.trendX, 2) + Math.pow(this.trendY, 2));
        this.angle = 180 * Math.atan(this.trendX / this.trendY) / Math.PI;
    };
    //[内核二级API]基础水平移动。由于trend值的计算问题，不建议直接设置，应该以调用moveX()来替代之
    this.moveX = function(x){
        this.setX(this.left + x);
        this.setY(this.top);
        this.trendX = x;
        this.trendY = 0;
        this.trend = Math.abs(this.trendX);
        this.angle = x >= 0 ? 90 : -90;
    };
    //[内核二级API]基础纵向移动。由于trend值的计算问题，不建议直接设置，应该以调用moveY()来替代之
    this.moveY = function(y){
        this.setX(this.left);
        this.setY(this.top + y);
        this.trendX = 0;
        this.trendY = y;
        this.trend = Math.abs(this.trendY);
        this.angle = y >= 0 ? 0 : 180;
    };
    //[内核一级API]设定水平坐标
    this.setX = function(x){
        this.left = x;
        this.node.style.left = this.left + 'px';
    };
    //[内核一级API]设定纵向坐标
    this.setY = function(y){
        this.top = y;
        this.node.style.top = this.top + 'px';
    };
    //设定宽度
    this.setWidth = function(w){
        if (! w) return;
        this.width = w;
        this.node.style.width = w + 'px';
    };
    //设定高度
    this.setHeight = function(h){
        if (! h) return;
        this.height = h;
        this.node.style.height = h + 'px';
    };
    this.initPosition = function(){
        this.node.style.position = 'fixed';
        this.node.style.zIndex = 999;
        this.node.style.left = this.left + 'px';
        this.node.style.top = this.top + 'px';
    };
    //旧拖放代码，缺陷：拖动过快会脱离；非全屏时拖动结束时，停放位置错误。
    this.bind = function(){
        this.node.ondrag = function(evt){
            _this.setX(evt.clientX - _this.dragTmp.x);
            _this.setY(evt.clientY - _this.dragTmp.y);
        };
        this.node.ondragstart = function(evt){
            _this.dragTmp = {x:evt.offsetX, y:evt.offsetY};
        };
        this.node.ondragend = function(evt){
            _this.setX(evt.offsetX - _this.dragTmp.x - _this.width);
            _this.setY(evt.offsetY - _this.dragTmp.y - _this.height/2);
            delete _this.dragTmp;
        };
        var _getClientXY = function(e){ //待调用
            var x = 0, y = 0;
            if (e.pageX||e.pageY) {
                x = e.pageX;
                y = e.pageY;
            } else if(e.clientX||e.clientY) {
                x = e.clientX +
                    document.documentElement.scrollLeft +
                    document.body.scrollLeft;
                y = e.clientY +
                    document.documentElement.scrollTop +
                    document.body.scrollTop;
            }
            return {x:x,y:y};
        };
    };
    this.create = function(id, x, y){
        this.id = id || parseInt(+ new Date + Math.random()*1000000);
        this.left = x || 0;
        this.top = y || 0;
        if ('string' == typeof this.src) {
            var img = document.createElement('img');
            img.id = this.id;
            img.src = this.src;
            img.width = this.width;
            img.height = this.height;
            document.body.appendChild(img);
        } else {
            ("" === this.src.id) ? this.src.setAttribute('id', this.id) : (this.id = this.src.id || this.id);
        }
        this.node = document.getElementById(this.id);
    };
    this.create(id, x, y);
    this.initPosition();
    this.bind();
};

//金馆鱼服务0：销毁所有[class=jgy]
function m0(){
    var jgys = document.getElementsByClassName('jgy')
    for (var i in jgys) {
        jgys[i].outerHTML = '';
    }
}
//金馆鱼服务1：斜向移动
function m1(){
    var sb1 = new Jinguanyu('sb1'+Math.random()*100000, 1, 1);
    sb1.node.className = 'jgy';
    setInterval(function(){sb1.move(1, 1)}, 10);
}
//金馆鱼服务2：裂变
function m2(){
    //兼容事件传参或m12传递的参数
    var lastArg = arguments[arguments.length-1];
    var ma = lastArg && ('m12args' in lastArg) ? lastArg.m12args : {};
    
    for (var i = 0; i < 100; i ++) {
        //var sb2 = new Jinguanyu('sb2'+Math.random()*100000+i, left||500, top||500, src||undefined);
        var sb2 = new Jinguanyu('sb2'+Math.random()*100000+i, ma.left||500, ma.top||500, ma.src||undefined);
        sb2.node.className = 'jgy';
        !function(ssbb){
            setInterval(function(){
                var x = [1,-1][Math.floor(Math.random()*2)] * Math.ceil(Math.random()*10);
                var y = [1,-1][Math.floor(Math.random()*2)] * Math.ceil(Math.random()*10);
                ssbb.move(x, y);        
            }, 1);
        }(sb2);
    }
}
//金馆鱼服务3：投放建造基地
function m3(){
    var sb3 = new Jinguanyu('sb3'+Math.random()*100000, 100, 100);
    sb3.node.className = 'jgy';
    var sb3i = 0;
    sb3.node.onclick = function(evt){
        console.log({"点击":['sb3' + sb3i++, sb3.left, sb3.top]});
        var sb33 = new Jinguanyu('sb3' + sb3i++ + +Math.random()*100000, sb3.left, sb3.top, evt.currentTarget.src);
        sb33.node.className = 'jgy';
        !function(sb33inner){
            setInterval(function(){
                var x = [1,-1][Math.floor(Math.random()*2)] * Math.ceil(Math.random()*10);
                var y = [1,-1][Math.floor(Math.random()*2)] * Math.ceil(Math.random()*10);
                sb33inner.move(x, y);       
            }, 1);  
        }(sb33);
    };
}
//金馆鱼服务4：扔垃圾
function m4(){
    var x = Math.random() * (document.body.scrollWidth - 100) + 50;
    var y = Math.random() * (document.body.scrollHeight - 50) + 50;
    var sb4 = new Jinguanyu('sb4'+Math.random()*100000, x, y);
    sb4.node.className = 'jgy';
    !function(sb4inner){
        setInterval(function(){
            var x = [1,-1][Math.floor(Math.random()*2)] * Math.ceil(Math.random()*10);
            var y = [1,-1][Math.floor(Math.random()*2)] * Math.ceil(Math.random()*10);
            sb4inner.move(x, y);
        }, 1);
    }(sb4);
}
//金馆鱼服务5：反射(速度和方向可以对move()进行调整)
function m5(){
    var sb5 = new Jinguanyu('sb5-'+Math.random()*10000, 120, 120);
    sb5.node.className = 'jgy';
    sb5.move(1, 1);
    setInterval(function(){
        var atLeft = sb5.left <= 0;
        var atRight = sb5.left + sb5.width >= document.body.scrollWidth;
        var atTop = sb5.top <= 0;
        var atBottom = sb5.top + sb5.height >= document.body.scrollHeight;
        console.log(sb5.top, sb5.left, sb5.trendY, sb5.trendX);
        console.log(atTop, atRight, atBottom, atLeft);
        if (atLeft&&atTop || atTop&&atRight || atRight&&atBottom || atBottom&&atLeft) {
            sb5.move(-sb5.trendX, -sb5.trendY);
        } else if (atTop || atBottom) {
            sb5.move(sb5.trendX, -sb5.trendY);
        } else if (atLeft || atRight) {
            sb5.move(-sb5.trendX, sb5.trendY);
        } else {
            sb5.move(sb5.trendX, sb5.trendY);
        }
    }, 1);
}
//金馆鱼服务6：射击(点击屏幕两个点，进行路径设定，射击速度根据路径长短而定)，有BUG
function m6(){
    var tmp = document.createElement('div');//添加临时遮罩层
    tmp.innerText = '点击屏幕任意两个位置';
    tmp.style.fontSize = document.body.scrollHeight / 10 + 'px';
    tmp.style.fontFamily = '微软雅黑';
    tmp.style.textAlign = 'center';
    tmp.style.lineHeight = document.body.scrollHeight + 'px';
    tmp.style.zIndex = '+1000';
    tmp.style.position = 'fixed';
    tmp.style.left = '0';
    tmp.style.top = '0';
    tmp.style.width = document.body.scrollWidth + 'px';
    tmp.style.height = document.body.scrollHeight + 'px';
    tmp.style.backgroundColor = 'rgba(0,0,0,0.5)';
    tmp.style.cursor = 'pointer';
    document.body.appendChild(tmp);
    tmp.onclick = function(evt){
        if (undefined === tmp.trendPath) tmp.trendPath = {};
        if (undefined === tmp.trendPath.start) {
            tmp.trendPath.start = [evt.clientX, evt.clientY];
        } else if (undefined === tmp.trendPath.end) {
            tmp.trendPath.end = [evt.clientX, evt.clientY];
        }
        if (tmp.trendPath.start && tmp.trendPath.end) {
            !function(start, end, tmp){
                console.log('开始', start[0], end[0]);
                var tmp_m6 = new Jinguanyu('tmp-m6-'+Math.random()*10000, start[0], start[1]);
                tmp_m6.node.className = 'jgy';
                var moveX = end[0] - start[0];
                var moveY = end[1] - start[1];
                var pathLen = Math.sqrt(Math.pow(moveX, 2) + Math.pow(moveY, 2));
                var screenLen = Math.sqrt(Math.pow(document.body.scrollWidth, 2) + Math.pow(document.body.scrollHeight, 2));
                var speed = Math.ceil((1 - pathLen / screenLen) * 100);
                console.log({speed:speed});
                var minMoveX = moveX, minMoveY = moveY;
                for (var i = 0; i < 3600; i ++) {
                    var tan = Math.tan(i/1800*Math.PI);
                    console.log({tan:tan, move:moveY/moveX});
                    if (Math.abs(tan - moveY/moveX) < 1e-3) {
                        minMoveX = Math.floor((minMoveX>0?10:-10) * tan);
                        minMoveY = minMoveY>0?10:-10;
                        break;
                    }
                }
                setInterval(function(){
                    console.log('hehe', minMoveX, minMoveY);
                    tmp_m6.move(minMoveX, minMoveY);
                }, speed);                    
                tmp.outerHTML = '';
            }(tmp.trendPath.start, tmp.trendPath.end, tmp);
        }
        console.log({trendPath:tmp.trendPath});
    };
}
//金馆鱼服务7：圆场
function m7(){
    var center = [300, 300];
    var radius = 150;
    var sb7 = new Jinguanyu('sb7'+Math.random()*10000, center[0]+radius, center[1]);
    sb7.node.className = 'jgy';
    var i = 0;
    setInterval(function(){
        var left = radius * Math.cos(Math.PI * i / 600) + center[0];
        var top = radius * Math.sin(Math.PI * i / 600) + center[1];
        console.log(left, top);
        sb7.setX(left);
        sb7.setY(top);
        i ++;
    }, 1);
}
//金馆鱼服务8：中毒圆场
function m8(){
    var center = [600, 200];
    var radius = 200;
    for (var i = 0; i < 50; i++) {
        !function(ii){            
            var sb8 = new Jinguanyu('sb7'+Math.random()*10000, center[0]+radius, center[1]);
            sb8.node.className = 'jgy';
            var j = 0;
            setTimeout(function(){                
                setInterval(function(){
                    var left = radius * Math.cos(Math.PI * j / 600) + center[0];
                    var top = radius * Math.sin(Math.PI * j / 600) + center[1];
                    console.log(left, top);
                    sb8.setX(left);
                    sb8.setY(top);
                    j ++;
                }, 1);
            }, ii*100);
        }(i);
    }
}
//金馆鱼服务9：路径复用
function m9(){
    //手动移动，导出路径串
    var tmp = document.createElement('div');//添加临时遮罩层
    tmp.innerHTML = '按住鼠标，随意划一条线，随后松开';
    tmp.style.fontSize = document.body.scrollHeight / 15 + 'px';
    tmp.style.fontFamily = '微软雅黑';
    tmp.style.textAlign = 'center';
    tmp.style.lineHeight = document.body.scrollHeight + 'px';
    tmp.style.zIndex = '+1000';
    tmp.style.position = 'fixed';
    tmp.style.left = '0';
    tmp.style.top = '0';
    tmp.style.width = document.body.scrollWidth + 'px';
    tmp.style.height = document.body.scrollHeight + 'px';
    tmp.style.backgroundColor = 'rgba(0,0,0,0.5)';
    tmp.style.cursor = 'pointer';
    document.body.appendChild(tmp);
    var path = [];
    //输入路径串，开始移动
}
//金馆鱼服务10：外力作用
function m10(){
    alert('还没做呢');
}
//金馆鱼服务11：经典转向
function m11(){
    var sb11 = new Jinguanyu('sb11'+Math.random()*10000, 300, 300);
    sb11.node.className = 'jgy';
    //延时器代码取自：https://github.com/Ltre/Ltre.js/blob/master/time/timing.js
    var timing = function(options){var a=options.a||0,z=options.z||100,step=options.step||+1,amplTop=options.amplTop||+20,amplBot=options.amplBot||-15,delay=options.delay||10;var onStart=options.onStart||function(i){},onTiming=options.onTiming||function(i){},onStop=options.onStop||function(i){};var i=a;!function f(){if(i<z){if(a==i){onStart(i);}else{onTiming(i);}var freq=amplTop-amplBot;var randFreq=amplBot+Math.random()*(amplTop-amplBot);setTimeout(f,delay+randFreq)}else{onStop(i);}i+=step;}()};
    timing({
        z: 200,
        delay: 10,
        onStart: function(i){
            console.log(i);
            sb11.move(2, 2);
        },
        onTiming: function(i){
            console.log(i);
            if (50 == i) {
                sb11.backward();
            } else if (100 == i) {
                sb11.rightward(5);
            } else if (150 == i) {
                sb11.leftward(8);
            } else {
                sb11.forward(3);
            }
        },
        onStop: function(i){
            console.log(i);
            sb11.node.style.width = sb11.width / 2 + 'px';
            sb11.node.style.height = sb11.height / 2 + 'px';
            console.log('wocao');
        }
    });
}
//金馆鱼服务12：复杂转向+反射
function m12(){
	console.log('fuck start');
	console.log( 'document.body.clientWidth', document.body.clientWidth);
	console.log( 'document.body.clientHeight', document.body.clientHeight);
	console.log( 'document.body.offsetWidth', document.body.offsetWidth);
	console.log( 'document.body.offsetHeight', document.body.offsetHeight);
	console.log( 'document.body.scrollWidth', document.body.scrollWidth);
	console.log( 'document.body.scrollHeight', document.body.scrollHeight);
	console.log( 'document.body.scrollTop', document.body.scrollTop);
	console.log( 'document.body.scrollLeft', document.body.scrollLeft);
	console.log( 'window.screenLeft', window.screenLeft);
	console.log( 'window.screenTop', window.screenTop);
	console.log( 'window.screen.width', window.screen.width);
	console.log( 'window.screen.height', window.screen.height);
	console.log('window.screen.availHeight', window.screen.availHeight);
	console.log('window.screen.availWidth', window.screen.availWidth);
	console.log('window.screen.colorDepth', window.screen.colorDepth);
	console.log('window.screen.deviceXDPI', window.screen.deviceXDPI);
	console.log('fuck end');
    var that = this;
    if (that.inZuangbi) {
        alert('有人在装逼，请稍后再装！');
        return false;
    }
    that.inZuangbi = true;
    var sb12 = new Jinguanyu('sb12'+Math.random()*10000, 300, 300);
    sb12.node.className = 'jgy';
    //记录装逼历程
    var record = [];
    var _hook = sb12.move;
    sb12.move = function(){
        record.push([sb12.left, sb12.top]);
        if (false) {//轨迹太卡，暂时禁用
            var div = document.createElement('div');
            div.style.width = '5px';
            div.style.height = '5px';
            div.style.backgroundColor = 'rgb('+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+')';
            div.style.position = 'fixed';
            div.style.left = sb12.left + sb12.width/2 + 'px';
            div.style.top = sb12.top + sb12.height/2 + 'px';
            document.body.appendChild(div);            
        }
        _hook.apply(this, arguments);
    };
    //状态面板
    var div = document.createElement('div');
    div.style.fontFamily = '微软雅黑';
    div.style.fontSize = document.body.scrollWidth / 10 + 'px';
    div.style.lineHeight = document.body.scrollHeight + 'px';
    div.style.textAlign = 'center';
    div.style.position = 'fixed';
    div.style.top = 0;
    div.style.left = 0;
    div.style.zIndex = -1;
    document.body.appendChild(div);
    //延时器代码取自：https://github.com/Ltre/Ltre.js/blob/master/time/timing.js
    var timing = function(options){options.a=options.a||0;options.z=options.z||100;options.step=options.step||+1;options.delay=options.delay||10;options.onStart=options.onStart||function(i){};options.onTiming=options.onTiming||function(i){};options.onStop=options.onStop||function(i){};options.i=options.a;!function f(){if(options.i<options.z){if(options.a==options.i){options.onStart(options)}else{options.onTiming(options)}setTimeout(f,options.delay)}else{options.onStop(options)}options.i+=options.step}()};
    timing({
        z: 1000,
        delay: 15,
        onStart: function(options){
            //console.log(options.i);
            div.innerHTML = '剩余<span style="color:red;">' + options.z + '</span>装逼值';
            sb12.move(2, 2);
        },
        onTiming: function(options){
            //console.log(options.i);
            //这里文字居中有BUG
            div.innerHTML = '<span style="textAlign:center;">剩余<span style="color:red;">' + (options.z - options.i) + '</span>装逼值<span>';
            //边缘检测
            var atLeft = sb12.left <= 0;
            var atRight = sb12.left + sb12.width >= document.body.scrollWidth;
            var atTop = sb12.top <= 0;
            var atBottom = sb12.top + sb12.height >= document.body.scrollHeight;
            if (atLeft&&atTop || atTop&&atRight || atRight&&atBottom || atBottom&&atLeft) {
                sb12.move(-sb12.trendX, -sb12.trendY);
            } else if (atTop || atBottom) {
                sb12.move(sb12.trendX, -sb12.trendY);
            } else if (atLeft || atRight) {
                sb12.move(-sb12.trendX, sb12.trendY);
            } else {
                sb12.move(sb12.trendX, sb12.trendY);
            }
            //计划转向
            var action = ['backward', 'leftward', 'rightward'];
            var maxTrend = 20;
            if (0 == options.i % (Math.ceil(Math.random()*(100-10))+10)) {
                sb12[action[Math.floor(Math.random()*action.length)]] (Math.ceil(Math.random()*maxTrend));//被某数整除，作经典转向
            } else if (0 == options.i % 50) {
                sb12.angleward(-Math.ceil(Math.random()*90), Math.ceil(Math.random()*maxTrend));//被50整除，作随机角度运动，范围90度以内
            } else {
                sb12.forward();
            }
        },
        onStop: function(options){
            //console.log(options.i);
            div.outerHTML = '';
            timing({
                z: 200,
                delay: 10,
                onTiming: function(options){
                    sb12.setWidth(sb12.width + 1);
                    sb12.setHeight(sb12.height + 1);                    
                    sb12.setX(document.body.scrollWidth/2 - sb12.width/2);
                    sb12.setY(document.body.scrollHeight/2 - sb12.height/2);
                },
                onStop: function(options){//最后关头销毁自身，并进行核裂变
                    sb12.node.outerHTML = '';
                    m2({m12args:{src:sb12.src,top:sb12.top,left:sb12.left}});
                }
            });
            that.inZuangbi = false;
            //console.log(record);//显示装逼记录
        }
    });
}
//金馆鱼服务13：读取装逼12的历程
function m13(){
    alert('没做呢');
}
//金馆鱼服务14：选好法器
function m14(){
    window.m14srcs = window.m14srcs || [];//累积已有法器
    window.m14MaxZIndex = 1;//获取所有jgy的最大z-index保证“选择面板”位于最上层
    var jgys = document.getElementsByClassName('jgy');
    for (var i in jgys) {
        if (parseInt(i) >= 0) {            
            var src = jgys[i].src;
            if (undefined !== src && -1 == window.m14srcs.indexOf(src)) window.m14srcs.push(src);
            window.m14MaxZIndex = Math.max(jgys[i].style.zIndex, window.m14MaxZIndex);
        }
    }
    if (! window.m14srcs.length) {
        alert('还木有法器发掘');
        return;
    }
    //选择面板
    var div = document.createElement('div');
    div.style.backgroundColor = 'rgba(0,0,0,0.5)';
    div.style.fontFamily = '微软雅黑';
    div.style.width = '100%';
    div.style.height = document.body.scrollHeight + 'px';
    div.style.fontSize = document.body.scrollHeight / 10 + 'px';
    div.style.lineHeight = document.body.scrollHeight + 'px';
    div.style.textAlign = 'center';
    div.style.position = 'fixed';
    div.style.top = 0;
    div.style.left = 0;
    div.style.zIndex = window.m14MaxZIndex + 1;
    document.body.appendChild(div);
    //按选定的法器替换
    for (var i in window.m14srcs) {
        var img = document.createElement('img');
        img.src = window.m14srcs[i];
        img.id = 'm14-faqi-'+i;
        img.width = 100;
        img.height = 100;
        img.style.cursor = 'pointer';
        img.style.marginTop = document.body.scrollHeight/3 + 'px';
        div.appendChild(img);
        document.getElementById(img.id).onclick = function(evt){
            console.log({img:[evt.currentTarget.nodeName, evt.target.nodeName]});
            var jgys2 = document.getElementsByClassName('jgy');
            for (var j in jgys2) {
                jgys2[j].src = evt.currentTarget.src;
            }
            div.outerHTML = '';//选择完成后销毁自身
        };
    }
    //随机替换法器
    div.onclick = function(evt){
        console.log({div:[evt.currentTarget.nodeName, evt.target.nodeName]});
        if (evt.target == evt.currentTarget) {
            var jgys3 = document.getElementsByClassName('jgy');
            for (var j in jgys3) {
                jgys3[j].src = window.m14srcs[Math.floor(Math.random()*window.m14srcs.length)];
            }
        }
        div.outerHTML = '';
    };
}
//金馆鱼服务15：圈地运动
function m15(){
    var commonDiv = document.createElement('div');
    commonDiv.style.width = '100%';
    commonDiv.style.height = document.body.scrollHeight + 'px';
    document.body.appendChild(commonDiv);
    window.m15tmp = {};
    commonDiv.ondragstart = function(evt){
        alert();
        window.m15tmp.last = {x:evt.clientX, y:evt.clientY};
    };
    commonDiv.ondragend = function(evt){
        window.m15tmp.end = {x:evt.clientX, y:evt.clientY};
        var last = window.m15tmp.last;
        var left = last.x, top = last.y;
        var width = evt.clientX - last.x, height = evt.clientY - last.y;
        var div = document.createElement('div');
        div.id = 'rect-' + left + '-' + top + '-' + width + '-' + height;
        div.style.position = 'fixed';
        div.style.backgroundColor = 'rgba('+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+','+Math.random()+')';
        commonDiv.ondragstart = commonDiv.ondragend = function(){};//销毁绘制事件
        commonDiv.outerHTML = '';//销毁临时拖拽板
    };
}
//金馆鱼服务16：人身劫持
function m16(){
    var sb16 = null;//新来的
    var lyt = null;//老油条
    var timing = function(opt){opt.a=opt.a||0;opt.z=opt.z||100;opt.step=opt.step||+1;opt.delay=opt.delay||10;opt.amplTop=opt.amplTop||+0;opt.amplBot=opt.amplBot||-0;opt.onStart=opt.onStart||function(i){};opt.onTiming=opt.onTiming||function(i){};opt.onStop=opt.onStop||function(i){};opt.i=opt.a;var innerThat=this;this.ctrl={goPause:false,goStop:false,goFirst:false,goLast:false,goPrev:false,goNext:false,goTo:false};~function f(){if(opt.i<=opt.z){var randAmpl=opt.amplBot+Math.random()*(opt.amplTop-opt.amplBot);setTimeout(f,opt.delay+randAmpl);if(innerThat.ctrl.goPause){return}if(innerThat.ctrl.goStop){opt.i=opt.z+opt.step;return}if(innerThat.ctrl.goFirst){innerThat.ctrl.goFirst=false;opt.i=opt.a;return}if(innerThat.ctrl.goLast){innerThat.ctrl.goLast=false;opt.i=opt.z;return}if(innerThat.ctrl.goPrev){innerThat.ctrl.goPrev=false;opt.i-=opt.step;return}if(innerThat.ctrl.goNext){innerThat.ctrl.goNext=false;opt.i+=opt.step;return}if('number'==typeof innerThat.ctrl.goTo&&opt.a<=innerThat.ctrl.goTo&&innerThat.ctrl.goTo<=opt.z){opt.i=innerThat.ctrl.goTo;innerThat.ctrl.goTo=false;return}opt.a==opt.i&&opt.onStart(opt);opt.onTiming(opt);opt.z==opt.i&&opt.onStop(opt)}opt.i+=opt.step}()};
    timing({
        a: 1,
        z: 10000,
        delay: 50,
        onStart: function(){            
            //劫持新来的
            var div = document.createElement('div');
            div.style.width = '50px';
            div.style.height = '50px';
            div.style.borderRadius = '50%';
            document.body.appendChild(div);
            sb16 = new Jinguanyu('sb16'+Math.random()*10000, 200, 200, div);
            sb16.node.className += ' jgy ';
            sb16.move(1, 1);
            //劫持老油条
            lyt = new Jinguanyu('jgy-menus', 300, 300, document.getElementById('jgy-menus'));
            lyt.node.className += ' jgy ';
            lyt.move(-100, -100);
        },
        onTiming: function(opt){
            sb16.node.style.backgroundColor = 'rgba('+parseInt(Math.random()*255)+','+parseInt(Math.random()*255)+','+parseInt(Math.random()*255)+','+Math.random()+')';
            sb16.angleward(Math.random()*360, Math.random()*20);
            lyt.angleward(Math.random()*360, Math.random()*20);
        }
    });
}
//金馆鱼服务17：殊途同归
function m17(){
    var start = [100, 100], end = [900, 500];
    var sb17 = new Jinguanyu('sb17'+Math.random()*10000, start[0], start[1]);
    var sb17start = new Jinguanyu('sb17start'+Math.random()*10000, start[0], start[1]);
    var sb17end = new Jinguanyu('sb17end'+Math.random()*10000, end[0], end[1]);
    sb17.node.className = 'jgy';
    sb17start.node.className = 'jgy';
    sb17end.node.className = 'jgy';
    alert('未完成');
}
//金馆鱼服务18：世界大乱
function m18(){
    var collect = [];
    var timing = function(opt){opt.a=opt.a||0;opt.z=opt.z||100;opt.step=opt.step||+1;opt.delay=opt.delay||10;opt.amplTop=opt.amplTop||+0;opt.amplBot=opt.amplBot||-0;opt.onStart=opt.onStart||function(i){};opt.onTiming=opt.onTiming||function(i){};opt.onStop=opt.onStop||function(i){};opt.i=opt.a;var innerThat=this;this.ctrl={goPause:false,goStop:false,goFirst:false,goLast:false,goPrev:false,goNext:false,goTo:false};~function f(){if(opt.i<=opt.z){var randAmpl=opt.amplBot+Math.random()*(opt.amplTop-opt.amplBot);setTimeout(f,opt.delay+randAmpl);if(innerThat.ctrl.goPause){return}if(innerThat.ctrl.goStop){opt.i=opt.z+opt.step;return}if(innerThat.ctrl.goFirst){innerThat.ctrl.goFirst=false;opt.i=opt.a;return}if(innerThat.ctrl.goLast){innerThat.ctrl.goLast=false;opt.i=opt.z;return}if(innerThat.ctrl.goPrev){innerThat.ctrl.goPrev=false;opt.i-=opt.step;return}if(innerThat.ctrl.goNext){innerThat.ctrl.goNext=false;opt.i+=opt.step;return}if('number'==typeof innerThat.ctrl.goTo&&opt.a<=innerThat.ctrl.goTo&&innerThat.ctrl.goTo<=opt.z){opt.i=innerThat.ctrl.goTo;innerThat.ctrl.goTo=false;return}opt.a==opt.i&&opt.onStart(opt);opt.onTiming(opt);opt.z==opt.i&&opt.onStop(opt)}opt.i+=opt.step}()};
    timing({
        a: 1,
        z: 10000,
        delay: 50,
        amplTop: 60,
        amplBot: 15,
        onStart: function(opt){
            Array.prototype.forEach.call(document.querySelectorAll('*'), function(e){
                if (-1 != ['html', 'head', 'meta', 'title', 'link', 'script', 'style', 'body'].indexOf(e.tagName.toLowerCase())) return;
                var j = new Jinguanyu('', Math.random()*document.body.scrollWidth, Math.random()*document.body.scrollHeight, e);
                j.node.className += ' jgy ';
                j.move(50*Math.random(),50*Math.random());
                collect.push(j);
            });
        },
        onTiming: function(opt){
            collect.forEach(function(e){
                e.angleward(Math.random()*360, Math.random()*50);
                e.promiseBoxLimit();//时刻检测方盒碰撞
            });
        }
    });
}
//金馆鱼服务19：磁力中毒
function m19(){
    var sb19 = new Jinguanyu('sb19'+Math.random()*10000, Math.random()*document.body.scrollWidth, Math.random()*document.body.scrollHeight);
    sb19.node.className = 'jgy jgy-sb19';
    var stl = sb19.node.style;
    stl.border = 'dotted green 34px';
    var list = document.getElementsByClassName('jgy');
    console.log(list);
    setInterval(function(){
        for (var i in list) {
            var o = list[i];
            if (typeof o != 'object') continue;
            if (-1 != o.className.split(' ').indexOf('jgy-sb19')) continue;
            var directGapY = parseInt(o.style.top.replace('px', '')) - sb19.top;
            var directGapX = parseInt(o.style.left.replace('px', '')) - sb19.left;
            var nearY = Math.abs(directGapY) < 200;
            var nearX = Math.abs(directGapX) < 200;
            if (nearY && nearX) {//靠近时
                o.wocaoY || (o.wocaoY = directGapY>0?1:-1);
                o.wocaoX || (o.wocaoX = directGapX>0?1:-1);
                o.style.top = sb19.top + 150 * o.wocaoY + 'px';
                o.style.left = sb19.left + 150 * o.wocaoX + 'px';
            } else {//脱离时
                delete o.wocaoY;
                delete o.wocaoX;
            }
        }
    }, 10);
}
//金馆鱼服务20：遥控器
function m20(){
	alert('稍等几秒...');
    var loadJs = function(url){
        var head = document.getElementsByTagName("head")[0] || document.documentElement;  
        var script = document.createElement("script");   
        head.insertBefore( script, head.firstChild );   
        script.setAttribute("type", "text/javascript");  
        script.setAttribute("src", url);
    };
    loadJs("https://cdn.bootcss.com/socket.io/1.3.5/socket.io.min.js");
    loadJs("https://cdn.bootcss.com/jquery/2.1.4/jquery.min.js");
    setTimeout(function(){
	    loadJs("https://cdn.bootcss.com/jquery.qrcode/1.0/jquery.qrcode.min.js");
    }, 1000);
    var timing = function(opt){opt.a=opt.a||0;opt.z=opt.z||100;opt.step=opt.step||+1;opt.delay=opt.delay||10;opt.amplTop=opt.amplTop||+0;opt.amplBot=opt.amplBot||-0;opt.onStart=opt.onStart||function(i){};opt.onTiming=opt.onTiming||function(i){};opt.onStop=opt.onStop||function(i){};opt.i=opt.a;var innerThat=this;this.ctrl={goPause:false,goStop:false,goFirst:false,goLast:false,goPrev:false,goNext:false,goTo:false};~function f(){if(opt.i<=opt.z){var randAmpl=opt.amplBot+Math.random()*(opt.amplTop-opt.amplBot);setTimeout(f,opt.delay+randAmpl);if(innerThat.ctrl.goPause){return}if(innerThat.ctrl.goStop){opt.i=opt.z+opt.step;return}if(innerThat.ctrl.goFirst){innerThat.ctrl.goFirst=false;opt.i=opt.a;return}if(innerThat.ctrl.goLast){innerThat.ctrl.goLast=false;opt.i=opt.z;return}if(innerThat.ctrl.goPrev){innerThat.ctrl.goPrev=false;opt.i-=opt.step;return}if(innerThat.ctrl.goNext){innerThat.ctrl.goNext=false;opt.i+=opt.step;return}if('number'==typeof innerThat.ctrl.goTo&&opt.a<=innerThat.ctrl.goTo&&innerThat.ctrl.goTo<=opt.z){opt.i=innerThat.ctrl.goTo;innerThat.ctrl.goTo=false;return}opt.a==opt.i&&opt.onStart(opt);opt.onTiming(opt);opt.z==opt.i&&opt.onStop(opt)}opt.i+=opt.step}()};
    
    setTimeout(function(){
        var socket = io.connect('http://io.yooo.moe:3000');
        var qrId = (location.href.match(/\#.*[&]showControlView\=([^&]+)/)||[,-1])[1];
        if (-1 === qrId) { //出现二维码，进入被控模式
            
            var qrId = 'm20-qrcode-'+(+new Date);
            $('body').append('<div id="'+qrId+'" style="position: fixed; z-index: 20; top: 50px; left: 0px; display: none;"></div>');
            $('#'+qrId).css('display','').qrcode({width:300,height:300,text:'http://res.miku.us/#!m20&showControlView='+qrId});
            console.log('http://res.miku.us/#!m20&showControlView='+qrId);
            var sb20 = new Jinguanyu('sb20'+Math.random()*10000, Math.random()*document.body.scrollWidth, Math.random()*document.body.scrollHeight);
            var sb20_static = new Jinguanyu('sb20'+Math.random()*10000, Math.random()*document.body.scrollWidth, Math.random()*document.body.scrollHeight);
            sb20.node.className = 'jgy';
            sb20_static.node.className = 'jgy';
            timing({
                a: 1,
                z: 10000000,
                delay: 5,
                onStart: function(opt){
                    sb20.move(1, 1);
                },
                onTiming: function(opt){
                    sb20.forward();
                    opt.i%50 == 0 && sb20_static.forward(25);//static金馆鱼每0.5秒移动一次
                    sb20.promiseBoxLimit(0, 0, document.body.scrollWidth, document.body.scrollHeight);//时刻检测方盒碰撞
                    sb20_static.promiseBoxLimit(0, 0, document.body.scrollWidth, document.body.scrollHeight);//时刻检测方盒碰撞
                }
            });
            socket.emit('jgy/regCmd', qrId);
            socket.on('jgy/acceptCmd', function(rToken, type, value){
                if (qrId != rToken) return;
                switch (type) {
                    case 'up':
                        sb20.trendY--;
                        sb20_static.moveY(-25);
                        break;
                    case 'down':
                        sb20.trendY++;
                        sb20_static.moveY(25);
                        break;
                    case 'left':
                        sb20.trendX--;
                        sb20_static.moveX(-25);
                        break;
                    case 'right':
                        sb20.trendX++;
                        sb20_static.moveX(25);
                        break;  
                }
            });
            
        } else { //扫码后，进入使用遥控器模式
            
            $('body *').css('display', 'none');
            var style = '<link href="http://yooo.moe/res/lib/lib.css?v=20150513" rel="stylesheet"><style type="text/css">\
                    #h-title{width: 100%; height: 100px; margin: 15px 0; font-size: 80px; text-align: center; line-height: 100px; font-family: 微软雅黑; font-weight: bold;}\
                    .button-font{text-align: center; line-height: 150px; font-size:35px;}\
                    .button-line{width: 100%; height: 150px; margin-bottom: 10px;}\
                    #increace{width:50%; height: 150px; margin-bottom: 10px; display: inline-block;}\
                    #reduce{width:49%; height: 150px; margin-bottom: 10px; display: inline-block;}\
                    .rdall{border-radius: 18px !important;}\
                </style>';
            $('head').append(style);
            var html = '<div id="h-title">金馆鱼遥控器</div>';
            html += '<button data-shell="up" class="shell-btn button-line button-font rdall">上拉</button>\
                <div></div>\
                <button id="increace" data-shell="left" class="shell-btn button-font rdall">左推</button>\
                <button id="reduce" data-shell="right" class="shell-btn button-font rdall">右拽</button>\
                <div></div>\
                <button data-shell="down" class="shell-btn button-line button-font rdall">下扯</button>';
            $('body').append(html);
            setTimeout(function(){
                $('.shell-btn').click(function(){
                    socket.emit('jgy/sendCmd', qrId, $(this).data('shell'));
                });
            }, 500);
            
        }
    }, 2000);
}
//金馆鱼服务21：自定义曲线（失败）(折线每段越短，则曲线越平滑)
function m21(){
    var timing = function(opt){opt.a=opt.a||0;opt.z=opt.z||100;opt.step=opt.step||+1;opt.delay=opt.delay||10;opt.amplTop=opt.amplTop||+0;opt.amplBot=opt.amplBot||-0;opt.onStart=opt.onStart||function(i){};opt.onTiming=opt.onTiming||function(i){};opt.onStop=opt.onStop||function(i){};opt.i=opt.a;var innerThat=this;this.ctrl={goPause:false,goStop:false,goFirst:false,goLast:false,goPrev:false,goNext:false,goTo:false};~function f(){if(opt.i<=opt.z){var randAmpl=opt.amplBot+Math.random()*(opt.amplTop-opt.amplBot);setTimeout(f,opt.delay+randAmpl);if(innerThat.ctrl.goPause){return}if(innerThat.ctrl.goStop){opt.i=opt.z+opt.step;return}if(innerThat.ctrl.goFirst){innerThat.ctrl.goFirst=false;opt.i=opt.a;return}if(innerThat.ctrl.goLast){innerThat.ctrl.goLast=false;opt.i=opt.z;return}if(innerThat.ctrl.goPrev){innerThat.ctrl.goPrev=false;opt.i-=opt.step;return}if(innerThat.ctrl.goNext){innerThat.ctrl.goNext=false;opt.i+=opt.step;return}if('number'==typeof innerThat.ctrl.goTo&&opt.a<=innerThat.ctrl.goTo&&innerThat.ctrl.goTo<=opt.z){opt.i=innerThat.ctrl.goTo;innerThat.ctrl.goTo=false;return}opt.a==opt.i&&opt.onStart(opt);opt.onTiming(opt);opt.z==opt.i&&opt.onStop(opt)}opt.i+=opt.step}()};
    //曲线积分：由弧段组成
    var curveData = [
        [
            50,      //转向角度(C)，最大359度
            5,      //每执行一次转向角度调整，所需行进的直线路程。当前每行进5px，则按角度调整方向
            60,     //速度(px/s)
            2000    //此弧段持续时间(ms)
        ],
        [30, 2, 50, 5000],
        [15, 3, 100, 8000],
        [10, 4, 70, 3000]
    ];
    var sb21 = new Jinguanyu('sb21'+Math.random()*10000, 150, 150);
    sb21.node.className = 'jgy';
    var timeout = 0;
    var timingIslock = {};
    var ivMap = {};
    for (var i in curveData) {
        timingIslock[i] = true;
        var rad = curveData[i];
        var radLen = rad[3] / 1000 * rad[2];//此弧段长度(px)
        ~ function(rad, radLen, iii){
            ivMap[iii] = setInterval(function(){
                if (iii != 0 && timingIslock[iii]) return;//保证以任务串行执行
                clearInterval(ivMap[iii]);
                
                var delay = 10;//10ms作为一次interval，使因js执行时间造成的误差较小
                var loopNum = rad[3] / delay;
                //var trendPerLoop = rad[2] / 1000 * delay;//每次循环，行进里程
                var trendPerLoop = radLen / loopNum;
                var lineNumPerLoop = trendPerLoop / rad[1];
                var sumTrendWent = 0;//此弧段累计已行进里程
                var sumTrendAtlastGo = 0;//上次行进时，累计的里程（用于每次循环行进小于1px的情况）
                var startTime = + new Date;
                timing({
                    a: 0,
                    z: loopNum - 1,
                    step: 1,
                    delay: delay,
                    onStart: function(opt){
                        sb21.moveAngle(30, 1);//设定开始方向为纵轴向下，并行进1px
                    },
                    onTiming: function(opt){
                        console.log({now: new Date - startTime});
                        console.log({i:iii, opt_i:opt.i});
                        
                        sumTrendWent += trendPerLoop;
                        var gapByLastGo = sumTrendWent - sumTrendAtlastGo;
                        var realTrend = 0;
                        if (gapByLastGo >= rad[1]) {
                            sb21.angleward(rad[0], 10);
                        } else {
                            sb21.forward(trendPerLoop);
                        }
                        
                        
                        /* sumTrendWent += trendPerLoop;
                        var gapByLastGo = sumTrendWent - sumTrendAtlastGo;
                        var realTrend = 0;
                        var canGo = false;
                        if (trendPerLoop >= 1) {
                            canGo = true;
                            realTrend = trendPerLoop;
                        } else if (gapByLastGo > 1) {
                            canGo = true;
                            realTrend = gapByLastGo;
                        }
                        
                        console.log({gapByLastGo: gapByLastGo, canGo:canGo, sumTrendWent:sumTrendWent, sumTrendAtlastGo:sumTrendAtlastGo, trendPerLoop:trendPerLoop});
                        if (canGo) {
                            sumTrendAtlastGo = sumTrendWent;
                            console.log({rad0: rad[0], realTrend: realTrend});
                            sb21.angleward(rad[0], realTrend);
                            sb21.promiseBoxLimit();
                        } */
                    },
                    onStop: function(opt){
                        if ((iii + 1) in timingIslock) {
                            timingIslock[iii + 1] = false;
                        }
                    }
                });
            }, 1);
        }(rad, radLen, Number(i));
        timeout += rad[3];
    }
}