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
    this.move = function(offsetX, offsetY){
        this.moveX(offsetX);
        this.moveY(offsetY);
    };
    this.moveX = function(x){
        this.setX(this.left + x);
    };
    this.moveY = function(y){
        this.setY(this.top + y);
    };
    this.setX = function(x){
        this.left = x;
        this.node.style.left = this.left + 'px';
    };
    this.setY = function(y){
        this.top = y;
        this.node.style.top = this.top + 'px';
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
        mn.style.backgroundColor = 'rgb('+(235-20*i)+','+(235-20*i)+','+(235-20*i)+')';
        mn.style.width = options[i].width || (isMobi?'350px':'150px');
        mn.style.height = options[i].height || (isMobi?'70px':'30px');
        mn.style.cursor = 'pointer';
        mn.onclick = options[i].click;
        mn.innerText = options[i].text || '未命名';
        menus.appendChild(mn);
    }
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
}]);