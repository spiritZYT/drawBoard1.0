var http = require('http');
var fs = require('fs');

var server= http.createServer(function(request,respone){
    var url = request.url;
    // respone.writeHead(200,{'Content-Type':'text/html'});
    if(url=='/'){
        respone.writeHead(200,{'Content-Type':'text/html'});
         var ns = fs.readFile('./index.html', function(err, data) {
             if (err) {
                 console.error(err);
                 return;
             }
             respone.end(data);
         });
    }else if(url != '/'){
        var surl = '.'+url;
        var type = surl.substr(surl.lastIndexOf(".")+1,surl.length)
        respone.writeHead(200,{'Content-type':"text/"+type});
        var ns = fs.readFile(surl, function(err, data) {
            if (err) {
                console.error(err);
                return;
            }
            respone.end(data);
        });
    } 
}).listen(8080);
 
console.log('服务器开启成功');
