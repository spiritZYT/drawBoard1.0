var canvas=document.getElementById('canvas');
var context=canvas.getContext('2d');

var type;
var colors=['black'];
//画笔颜色
var mycolor=document.getElementsByClassName('mycolor');
var drawnow_one=document.getElementById('drawnow_one');
function penColor(){
    
    for(var i=0;i<mycolor.length;i++){
        // console.log(mycolor[i])
        //amazing——js
        (function(j){
            mycolor[j].onclick=function(){
                colors.push(mycolor[j].style.backgroundColor);//background不能在node中读出颜色，因为有其他的norepeat等数据
                context.strokeStyle=mycolor[j].style.background;
                drawnow_one.style.background=mycolor[j].style.background;
            }
        })(i) 
   }

}
penColor();

//文件下的二级菜单
// 新建
var newcanvas=document.getElementById('newcanvas');
var right=document.getElementById('right');
var con=document.getElementById('con');

newcanvas.onclick=function(){
    reback('');
    con.removeChild(canvas);
    var canvas1=document.createElement('canvas');
    canvas=canvas1;
    canvas.setAttribute('id','canvas');
    canvas.setAttribute('height','500');
    canvas.setAttribute('width',750);
    
    con.appendChild(canvas);
    canvas=document.getElementById('canvas');
    context=canvas.getContext('2d');
    canvas.onmousedown=drawMyCanvas;
}

//打开本地图片显示到画布
var open=document.getElementById('open');
open.onclick=function(){
    var inpobj=document.createElement('input');
    inpobj.setAttribute('id',"sel");
    inpobj.setAttribute('type',"file");
    header.appendChild(inpobj);

    var subobj=document.createElement('input');
    subobj.setAttribute('id',"sub");
    subobj.setAttribute('type',"button");
    subobj.setAttribute('value',"确认");
    header.appendChild(subobj);

    subobj.onclick=function(){
        var reader=new FileReader();
        if(sel.files){
            var fileObj=sel.files[0];
            console.log(fileObj);
            reader.readAsDataURL(fileObj);
            reader.onload=function(){
                imgData=reader.result;//nase64
                
                var image = new Image();
                image.src = imgData;
              
                image.onload=function(){
                  context.drawImage(image,0,0);
                  var imagedata = context.getImageData(0,0,750,500);
                  context.createImageData(imagedata);
                }
            }
        }
    }
}

//保存
var save=document.getElementById('save');
save.onclick=function(){
    var tf=confirm("您确定将画布转换为png格式图片吗？");
    if(tf){
        var url = canvas.toDataURL("img/png")
        var oA = document.createElement("a");
        oA.download = '';// 下载的文件名，默认'下载'
        oA.href = url;
        document.body.appendChild(oA);
        oA.click();
        oA.remove(); // 下载之后把创建的元素删除
    }
}

//编辑下的二级菜单
//撤销
var rebacklast=document.getElementById('rebacklast');
var restorePoint={};
var restores=[];
var index=0;

rebacklast.onclick=function(){
    restorePoint = restores[index-1];
    context.putImageData(restorePoint, 0, 0);
    index--;
}

//清空
var clear=document.getElementById("clear");
clear.onclick=()=>{
    context.clearRect(0,0,canvas.width, canvas.height);
}


//视图下的二级菜单：隐藏与显示
var tools_board=document.getElementById('tools_board');
var color_board=document.getElementById('color_board');
var status_board=document.getElementById('status_board');
// var status=document.getElementById('status');
var tools_left=document.getElementsByClassName('tools-left')[0];
var tools_right=document.getElementsByClassName('tools-right')[0];
var drawBoard_right=document.getElementById('drawBoard_right');
var drawborad_status=document.getElementsByClassName('drawborad_status')[0];

var flag1=1,flag2=1,flag3=1;

//工具栏
tools_board.onclick=function(){
    if(flag3){
        tools_left.style.display='none';
    tools_right.style.display='none';
        flag3=false;
    }else{
        tools_left.style.display='block';
        tools_right.style.display='block';
        flag3=1;
    }
}
//色板
color_board.onclick=function(){
    if(flag2){
        drawBoard_right.style.display='none';
        flag2=false;
    }else{
        drawBoard_right.style.display='block';
        flag2=1;
    }
}
//状态栏
status_board.onclick=function(){
    if(flag1){
        drawborad_status.style.display='none';
        flag1=false;
    }else{
        drawborad_status.style.display='block';
        flag1=1;
    }
}
//为什么无效
// status.onclick=function(){
//     console.log(2);
// }


//帮助下的二级菜单
//关于画板
var aboutdraw=document.getElementById('aboutdraw');
aboutdraw.onclick=function(){
    alert('我是画板说明书');
}

//工具
//文字
var textBox=document.getElementById('textBox');
var text_style=document.getElementsByClassName('text-style')[0];

var textFlag = false;
var textContent = "";
function writing(x0,y0){
    if (textFlag) {
        textContent = text_style.value;
        if(textContent==''){
            text_style.style.display='none';
        }
        textFlag = false;
        text_style.style['z-index'] = 1;
        text_style.value = "";
        context.beginPath();
        // 写字
        context.font = "28px orbitron";
        context.fillText(textContent,parseInt(text_style.style.left)-110,parseInt(text_style.style.top)-30);
        // console.log(parseInt(text_style.style.left),parseInt(text_style.style.top));
        //fillText中参数不加单位
        
    } else if (!textFlag) { 
        textFlag = true;
        text_style.style.left = x0 + 130 + 'px';
        text_style.style.top = y0 + 30 + 'px';
        // console.log(text_style.style.left,text_style.style.top);
        text_style.style['z-index'] = 3;
    }
    text_style.style.borderColor='black';
   
    restores[index] = restorePoint;
    index++;
}
textBox.onclick=function(){
    type=this.id;
    canvas.style.cursor='text';
    text_style.style.display='block';
    line_status.style.display='none';
    reback(this);
    
}

//橡皮擦
var erase=document.getElementById('erase');
erase.onclick=function(){
    type=this.id;
    canvas.style.cursor="url(./images/erase.ico),auto";
    reback(this);
    displayontools();
}
function drawErase(){
    context.beginPath();
    context.moveTo(x0+10,y0+10);
    canvas.onmousemove = function(event) {
        context.putImageData(restorePoint, 0, 0);
        let x1 = event.clientX - canvas.offsetLeft+10;
        let y1 = event.clientY - canvas.offsetTop+10;
        context.strokeStyle='white';
        context.lineWidth=10;
        context.lineTo(x1,y1);
        context.stroke();
    }
    canvas.onmouseup = function() {
        restores[index] = restorePoint;
        index++;
        this.onmousemove = null;
    }
}

//画线:自由、直线
var line=document.getElementById('line');
var strLine=document.getElementById('strLine');
var line_status=document.getElementsByClassName('line_status')[0];
var thin=document.getElementById('thin');
var thiner=document.getElementById('thiner');
var mid=document.getElementById('mid');
var wid=document.getElementById('wid');
var wider=document.getElementById('wider');

var arr=[thin,thiner,mid,wid,wider];
function penWidth(e){
    for(var i=0;i<5;i++){
        arr[i].style.background='#F0F0F0';
        arr[i].firstChild.style.background='#000'; 
    }
}
//线的粗细
thin.onclick=function(){
    penWidth(thin);
    thin.style.background='purple';
    thin.firstChild.style.background='#fff'; 
    context.lineWidth=1;
}
thiner.onclick=function(){
    penWidth(thiner);
    thiner.style.background='purple';
    thiner.firstChild.style.background='#fff';
    context.lineWidth=3; 
}
mid.onclick=function(){
    penWidth(mid);
    mid.style.background='purple';
    mid.firstChild.style.background='#fff'; 
    context.lineWidth=4;
}
wid.onclick=function(){
    penWidth(wid);
    wid.style.background='purple';
    wid.firstChild.style.background='#fff'; 
    context.lineWidth=5;
}
wider.onclick=function(){
    penWidth(wider);
    wider.style.background='purple';
    wider.firstChild.style.background='#fff'; 
    context.lineWidth=8;
}
line.onclick=function(){
    console.log(colors);
    type=this.id;
    canvas.style.cursor='crosshair';
    reback(this);
    penWidth(wider);
    line_status.style.display='block';
    thin.style.background='purple';
    thin.firstChild.style.background='white';
    context.lineWidth=1;
    text_style.style.display='none';
}
strLine.onclick=function(){
    type=this.id;
    canvas.style.cursor='crosshair';
    reback(this);
    penWidth(wider);
    line_status.style.display='block';
    thin.style.background='purple';
    thin.firstChild.style.background='white';
    context.lineWidth=1;
    text_style.style.display='none';
}
function drawLine(){
    canvas.onmousemove = function(event) {
        context.putImageData(restorePoint, 0, 0);
        var x1 = event.clientX - canvas.offsetLeft;
        var y1 = event.clientY - canvas.offsetTop;

        context.strokeStyle=colors[colors.length-1];
        context.lineTo(x1,y1);
        context.stroke();
    }
    canvas.onmouseup = function() {
        restores[index] = restorePoint;
        index++;
        canvas.onmousemove = null;
    }
}

function drawStrLine(){    
    canvas.onmouseup = function(event) {
        context.putImageData(restorePoint, 0, 0);

        var x1 = event.clientX - canvas.offsetLeft;
        var y1 = event.clientY - canvas.offsetTop;
        context.lineTo(x1,y1);
        
        context.strokeStyle=colors[colors.length-1];
        context.stroke();
        restores[index] = restorePoint;
        index++;
    }
}

//部分工具不显示
function displayontools(){
    line_status.style.display='none';
    text_style.style.display='none';
}

//画矩形
var retangle=document.getElementById("retangle");
retangle.onclick=function(){//箭头函数不能乱用
    type=this.id;
    canvas.style.cursor="url(./images/retangle.ico),auto";
    reback(this);
    displayontools();
}
function drawRectangle(){
    canvas.onmouseup = function(event) {
        context.putImageData(restorePoint, 0, 0);

        this.onmousemove = null;
        var x1 = event.clientX - canvas.offsetLeft;
        var y1 = event.clientY - canvas.offsetTop;
        if(x1-x0!=0&&y1-y0!=0){//防止点击时就多一个
            context.rect(x0,y0,x1-x0,y1-y0);
            console.log(x1-x0,y1-y0);
            
            context.strokeStyle=colors[colors.length-1];
            context.stroke();
            restores[index] = restorePoint;
            index++;
        }
          console.log(restores);  
       
    }
}
//画圆
var circle=document.getElementById('circle');
circle.onclick=function(){
    // circle.value=2;//'cir'不行？console.log(circle.value);
    type=this.id;
    canvas.style.cursor="url(./images/cir.ico),auto";
    reback(this);
    displayontools();
}
function drawCircle(){
    canvas.onmouseup = function(event) {
        context.putImageData(restorePoint, 0, 0);

        this.onmousemove = null;
        var x1 = event.clientX - canvas.offsetLeft;
        var y1 = event.clientY - canvas.offsetTop;
        // 圆心？
        if(x1-x0!=0){
            penColor();  
            context.arc(x1,y1,Math.abs(x1-x0)/2,0,2*Math.PI);
            
            context.strokeStyle=colors[colors.length-1];
            context.stroke();
            restores[index] = restorePoint;
            index++;
        }
        // console.log(restores);
    }
}

//点击工具的状态
var arrtools=[erase,line,strLine,retangle,circle,fillColor,textBox];

function reback(e){
    for(var i=0;i<arrtools.length;i++){
        arrtools[i].style.backgroundColor='#ccc';
    }
    if(e!=''){  
        e.style.backgroundColor='ghostwhite';
    }
    
}


//画布
var x0,y0;
canvas.onmousedown = drawMyCanvas;
function drawMyCanvas(e) {
    console.log(type);
    x0 = e.clientX - this.offsetLeft;
    y0 = e.clientY - this.offsetTop;
    //撤销
    restorePoint = context.getImageData(0, 0, canvas.width, canvas.height);

    if(type=="line"){
        context.beginPath();
        penColor();
        context.moveTo(x0,y0);
        drawLine();
    }else if(type=="strLine"){
        context.beginPath();
        penColor();
        context.moveTo(x0,y0);
        drawStrLine();
    }else if(type=="retangle"){
        context.beginPath();
        context.lineWidth=1;
        penColor();
        drawRectangle();        
    }else if(type=="circle"){
        context.beginPath();
        context.lineWidth=1;
        penColor();
        drawCircle();
    }else if(type=="textBox"){
        writing(x0,y0);
    }else if(type=='erase'){
        drawErase();
    }else if(type=='fillColor'){
        console.log('填充颜色');
    }
}


/* 
颜色填充
后端
*/
