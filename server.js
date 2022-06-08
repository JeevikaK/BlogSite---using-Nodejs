const http = require('http');
const fs = require('fs');
const _ = require('lodash');

const server = http.createServer((req, res) => {
    console.log(req.url, req.method);

    //set header content type
    res.setHeader('Content-Type', 'text/html');

    let path = './views/';
    switch(req.url){
        case '/' :
            path+= 'index.html';
            res.statusCode = 200;     //success
        break;
        case '/about' :
            path+= 'about.html';
            res.statusCode = 200;
        break;
        case '/about-us' :
            res.statusCode = 301;     //resource moved
            res.setHeader('Location', '/about');
            res.end();
        break;
        default :
            path+= '404.html';
            res.statusCode = 404;     //not found
        break;
    }
    
    //reading html file
    fs.readFile(path, (err, data) => {
        if(err){
            console.log(err);
            res.end();
        } else{
            // res.write(data);
            res.end(data);
        }
    });

});

server.listen(3000, 'localhost', () => {
    console.log('listening fo requests on port 3000');
})