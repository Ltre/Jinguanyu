/**
 * 金馆鱼二代基础SDK
 * @author Ltre Oreki<ltrele@gmail.com>
 * @since 2015-10-30
 */
window.Jinguanyu = function(id, x, y){
    var _this = this;
    this.id = null;
    this.node = null;
    this.width = 100;
    this.height = 100;
    this.src = 'http://miku-us-static.smartgslb.com/res/biz/danmu/jinguanyu.gif';
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




//金馆鱼服务1：斜向移动
function m1(){
    var sb1 = new Jinguanyu('sb1', 1, 1);
    setInterval(function(){sb1.move(1, 1)}, 10);
}
//金馆鱼服务2：裂变
function m2(){
    for (var i = 0; i < 100; i ++) {
        var sb2 = new Jinguanyu('sb2'+i, 500, 500); 
        !function(ssbb){
            setInterval(function(){
                var x = [1,-1][Math.floor(Math.random()*2)] * Math.ceil(Math.random()*10);
                var y = [1,-1][Math.floor(Math.random()*2)] * Math.ceil(Math.random()*10);
                ssbb.move(x, y);        
            }, 1);
        }(sb2);
    }
}
//金馆鱼服务3：随地克隆
function m3(){
    var sb3 = new Jinguanyu('sb3', 100, 100);
    var sb3i = 0;
    sb3.node.onclick = function(evt){
        console.log({"点击":['sb3' + sb3i++, sb3.left, sb3.top]});
        var sb33 = new Jinguanyu('sb3' + sb3i++, sb3.left, sb3.top);
        !function(sb33inner){
            setInterval(function(){
                var x = [1,-1][Math.floor(Math.random()*2)] * Math.ceil(Math.random()*10);
                var y = [1,-1][Math.floor(Math.random()*2)] * Math.ceil(Math.random()*10);
                sb33inner.move(x, y);       
            }, 1);  
        }(sb33);
    };
}


//实验控制菜单
!function createMenuBar(options){
    var menus = document.createElement('div'); 
    menus.style.position = 'fixed';
    menus.style.right = 0;
    menus.style.bottom = 0;
    document.body.appendChild(menus);
    
    for (var i in options) {
        var mn = document.createElement('button');
        mn.style.width = options[i].width || '200px';
        mn.style.height = options[i].height || '30px';
        mn.onclick = options[i].click;
        mn.innerText = options[i].text || '未命名';
        menus.appendChild(mn);
    }
}([{
    text: '斜向移动',
    click: m1
}, {
    text: '核裂变',
    click: m2
}, {
    text: '一次生成，到处克隆',
    click: m3
}]);