/**
 * 金馆鱼二代基础SDK
 * @author Ltre Oreki<ltrele@gmail.com>
 * @since 2015-10-30
 */
window.Jinguanyu = function(id, x, y, src){
    var _this = this;
    this.id = null;
    this.node = null;
    this.width = 100;
    this.height = 100;
    this.src = src || 'http://miku-us-static.smartgslb.com/res/biz/danmu/jinguanyu.gif';
    this.left = 0;
    this.top = 0;
    this.trendX = 0;//当前水平移动步长（右正左负）
    this.trendY = 0;//当前竖直移动步长（下正上负）
    this.trend = 0;//trendX与trendY的合成步长
    this.move = function(offsetX, offsetY){
        this.moveX(offsetX);
        this.moveY(offsetY);
        this.trend = Math.sqrt(Math.pow(this.trendX, 2) + Math.pow(this.trendY, 2));
    };
    this.forward = function(offset){
        offset = offset || this.trend;
        if (0 == this.trend) return;
        var ratio = offset / this.trend;
        this.move(this.trendX * ratio, this.trendY * ratio);
    };
    this.backward = function(offset){
        offset = offset || this.trend;
        if (0 == this.trend) return;
        var ratio = offset / this.trend;
        this.move(- this.trendX * ratio, - this.trendY * ratio);
    };
    this.leftward = function(offset){
        offset = offset || this.trend;
        if (0 == this.trend) return;
        var ratio = offset / this.trend;
        if (this.trendX * this.trendY >= 0) {
            this.move(this.trendX * ratio, - this.trendY * ratio);
        } else {
            this.move(- this.trendX * ratio, this.trendY * ratio);
        }
    };
    this.rightward = function(offset){
        offset = offset || this.trend;
        if (0 == this.trend) return;
        var ratio = offset / this.trend;
        if (this.trendX * this.trendY >= 0) {
            this.move(- this.trendX * ratio, this.trendY * ratio);
        } else {
            this.move(this.trendX * ratio, - this.trendY * ratio);
        }
    };
    this.moveX = function(x){
        this.setX(this.left + x);
        this.trendX = x;
    };
    this.moveY = function(y){
        this.setY(this.top + y);
        this.trendY = y;
    };
    this.setX = function(x){
        this.left = x;
        this.node.style.left = this.left + 'px';
    };
    this.setY = function(y){
        this.top = y;
        this.node.style.top = this.top + 'px';
    };
    this.setWidth = function(w){
        if (! w) return;
        this.width = w;
        this.node.style.width = w + 'px';
    };
    this.setHeight = function(h){
        if (! h) return;
        this.height = h;
        this.node.style.height = h + 'px';
    };
    this.initPosition = function(){
        this.node.style.position = 'fixed';
        this.node.style.zIndex = 1;
        this.node.style.left = this.left + 'px';
        this.node.style.top = this.top + 'px';
    };
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
    };
    this.create = function(id, x, y){
        this.id = id;
        this.left = x || 0;
        this.top = y || 0;
        var img = document.createElement('img');
        img.id = id;
        img.src = this.src;
        document.body.appendChild(img);
        this.node = document.getElementById(id);
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
    for (var i = 0; i < 100; i ++) {
        var sb2 = new Jinguanyu('sb2'+Math.random()*100000+i, 500, 500);
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
        var sb33 = new Jinguanyu('sb3' + sb3i++, sb3.left, sb3.top);
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
    var x = Math.random() * (window.screen.width - 100) + 50;
    var y = Math.random() * (window.screen.height - 50) + 50;
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
        var atRight = sb5.left + sb5.width >= document.body.clientWidth;
        var atTop = sb5.top <= 0;
        var atBottom = sb5.top + sb5.height >= document.body.clientHeight;
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
    tmp.style.fontSize = window.screen.height / 10 + 'px';
    tmp.style.fontFamily = '微软雅黑';
    tmp.style.textAlign = 'center';
    tmp.style.lineHeight = window.screen.height + 'px';
    tmp.style.zIndex = '+1000';
    tmp.style.position = 'fixed';
    tmp.style.left = '0';
    tmp.style.top = '0';
    tmp.style.width = window.screen.width + 'px';
    tmp.style.height = window.screen.height + 'px';
    tmp.style.backgroundColor = 'rgba(0,0,0,0.5)';
    tmp.style.cursor = 'pointer';
    document.body.appendChild(tmp);
    tmp.onclick = function(evt){
        //debugger;
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
                var screenLen = Math.sqrt(Math.pow(window.screen.width, 2) + Math.pow(window.screen.height, 2));
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
    tmp.style.fontSize = window.screen.height / 15 + 'px';
    tmp.style.fontFamily = '微软雅黑';
    tmp.style.textAlign = 'center';
    tmp.style.lineHeight = window.screen.height + 'px';
    tmp.style.zIndex = '+1000';
    tmp.style.position = 'fixed';
    tmp.style.left = '0';
    tmp.style.top = '0';
    tmp.style.width = window.screen.width + 'px';
    tmp.style.height = window.screen.height + 'px';
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
//金馆鱼服务12：经典转向+反射
function m12(){
    var sb12 = new Jinguanyu('sb12'+Math.random()*10000, 300, 300);
    sb12.node.className = 'jgy';
    var div = document.createElement('div');
    div.style.fontFamily = '微软雅黑';
    div.style.fontSize = document.body.clientHeight / 10 + 'px';
    div.style.lineHeight = document.body.clientHeight + 'px';
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
        delay: 10,
        onStart: function(options){
            console.log(options.i);
            div.innerHTML = '剩余<span style="color:red;">' + options.z + '</span>装逼值';
            sb12.move(2, 2);
        },
        onTiming: function(options){
            console.log(options.i);
            //这里文字居中有BUG
            div.innerHTML = '<span style="textAlign:center;">剩余<span style="color:red;">' + (options.z - options.i) + '</span>装逼值<span>';
            //边缘检测
            var atLeft = sb12.left <= 0;
            var atRight = sb12.left + sb12.width >= document.body.clientWidth;
            var atTop = sb12.top <= 0;
            var atBottom = sb12.top + sb12.height >= document.body.clientHeight;
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
                sb12[action[Math.floor(Math.random()*action.length)]] (Math.ceil(Math.random()*maxTrend));
            } else {
                sb12.forward();
            }
        },
        onStop: function(options){
            console.log(options.i);
            div.outerHTML = '';
            timing({
                z: 200,
                delay: 10,
                onTiming: function(options){
                    sb12.setWidth(sb12.width + 1);
                    sb12.setHeight(sb12.height + 1);                    
                    sb12.setX(document.body.clientWidth/2 - sb12.width/2);
                    sb12.setY(document.body.clientHeight/2 - sb12.height/2);
                }
            });
            console.log('wocao', document.body.clientWidth/2 - sb12.width/2, document.body.clientHeight/2 - sb12.height/2);
        }
    });
}
//金馆鱼服务13：角度运动(移动角度有BUG)
function m13(){
    alert('有BUG，还没完成');
    var speed = 5;
    var degree = -30;
    var sb13 = new Jinguanyu('sb13'+Math.random()*10000, 300, 100);
    sb13.node.className = 'jgy';
    var x = speed * Math.sin(Math.PI * degree / 180);
    var y = speed * Math.cos(Math.PI * degree / 180);
    console.log(x, y);
    //延时器代码取自：https://github.com/Ltre/Ltre.js/blob/master/time/timing.js
    var timing = function(options){var a=options.a||0,z=options.z||100,step=options.step||+1,amplTop=options.amplTop||+20,amplBot=options.amplBot||-15,delay=options.delay||10;var onStart=options.onStart||function(i){},onTiming=options.onTiming||function(i){},onStop=options.onStop||function(i){};var i=a;!function f(){if(i<z){if(a==i){onStart(i);}else{onTiming(i);}var freq=amplTop-amplBot;var randFreq=amplBot+Math.random()*(amplTop-amplBot);setTimeout(f,delay+randFreq)}else{onStop(i);}i+=step;}()};
    timing({
        z: 400,
        delay: 10,
        onStart: function(i){
            console.log(i);
            sb13.move(x, y);
        },
        onTiming: function(i){
            console.log(i);
            sb13.forward();
        },
        onStop: function(i){
            console.log(i);
            sb13.node.style.width = sb13.width / 2 + 'px';
            sb13.node.style.height = sb13.height / 2 + 'px';
            console.log('wocao');
        }
    });
}




//实验控制菜单
!function createMenuBar(options){
    var menus = document.createElement('div'); 
    menus.id = 'jgy-menus';
    menus.style.position = 'fixed';
    menus.style.right = 0;
    menus.style.bottom = 0;
    document.body.appendChild(menus);
	
	var isMobi = /Android|webOS|iPhone|Windows Phone|iPod|BlackBerry|SymbianOS/i.test(window.navigator.userAgent) && !/[\?&]pc(?:[=&].*|$)/.test(window.location.href);
    
    var menuBarDisp = ['', 'block'][Math.floor(Math.random()*2)];
    options = options.reverse();
    for (var i in options) {
        var mn = document.createElement('button');
        mn.style.zIndex = 2;
        mn.style.display = menuBarDisp;
        mn.style.textAlign = 'left';
        mn.style.border = 0;
        mn.style.backgroundColor = 'rgb('+(235-10*i)+','+(235-10*i)+','+(235-10*i)+')';
        mn.style.width = options[i].width || (isMobi?'350px':'150px');
        mn.style.height = options[i].height || (isMobi?'70px':'30px');
        mn.style.cursor = 'pointer';
        mn.onclick = options[i].click;
        mn.innerText = options[i].text || '未命名';
        menus.appendChild(mn);
    }
    var autoClickOrder = parseInt((location.href.match(/\#.*[!&]m(\d+)/)||[,-1])[1]); //例：http://res.miku.us/res/js/Jinguanyu/2nd/test.html#m12
    console.log(autoClickOrder);
    console.log(options[autoClickOrder]);
    -1 != autoClickOrder && options[options.length - autoClickOrder - 1].click();
}([{
    text: '0、销毁所有',
    click: m0
}, {
    text: '1、斜向移动',
    click: m1
}, {
    text: '2、核裂变',
    click: m2
}, {
    text: '3、投放建造基地',
    click: m3
}, {
    text: '4、扔垃圾',
    click: m4
}, {
    text: '5、反射',
    click: m5
}, {
    text: '6、射击（有BUG）',
    click: m6
}, {
    text: '7、圆场',
    click: m7
}, {
    text: '8、中毒圆场',
    click: m8
}, {
    text: '9、输入路径',
    click: m9
}, {
    text: '10、路径记忆',
    click: m10
}, {
    text: '11、经典转向',
    click: m11
}, {
    text: '12、经典转向+反射',
    click: m12
}, {
    text: '13、角度运动',
    click: m13
}]);
