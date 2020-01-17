const net = require('net')
const server =  net.createServer()



server.on("connection",(client) => {
    console.log("有鱼儿上钩了")
    client.on("data",(data) => {
        var str = new Array
        str = data.toString().split(" ")
        console.log(data.toString())
        if(str[0] == "GET" && str[1] == "/") {
        client.write("HTTP/1.1 200 OK\n")
        client.write("Content-Type: text/html; charset=UTF-8\n\n")
        client.write("<h1>欢迎回来</h1> \n <a href='/login'>后台管理</a>")
        client.end()
        }
        if(str[0] == "GET" && str[1] == "/admin") {
            let length = parseInt(str.length) 
            let endline = str[length-1]
            var checkstr= new Array()
            checkstr = endline.split("=") //将报文的最后一行转换成数组

            //判断cookie有没有sessid
            if(checkstr[0] == "SESSID"){
                client.write('HTTP/1.1 200 OK\n')
                client.write('Content-Type: text/html;charset=UTF-8\n\n')
                client.write(checkstr[1]) 
            }else{
                //没有cookie就跳转到/login
                client.write('HTTP/1.1 302 OK \n')
                client.write('Content-Type: text/html;charset=UTF-8\n')
                client.write('Location:http://127.0.0.1:8001/login\n\n')
            }    
            client.end()
        }
        if ((str[0] == 'GET') && (str[1] == '/login')) {
            client.write('HTTP/1.1 302 OK\n')
            client.write('Content-Type: text/html;charset=UTF-8\n\n')
            client.write('<form method="post" action="http://127.0.0.1:8001/login"><br>')
            client.write('<span>账号</span><input type="text" name="username" id=""><br>')
            client.write('密码<input type="password" name="pwd" id=""><br>')
            client.write('<input type="submit" value="登录">')
            client.write('</form>')
            client.end()
        }
        if ((str[0]=='POST')&&(str[1] == '/login')){
            let length = parseInt(str.length)
            let endline= str[length-1]
            let array1= new Array() 
            let np = new Array()  //账号密码的数组
            let strran = '' //随机数
            array1 = endline.split("username=")
            np = array1[1].split("&pwd=")
            if ((np[0] == 'admin')&&(np[1]=='123456')) {
                let total = ['0','1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f','g']
                for(key in total ){
                    let num = Math.ceil(Math.random()*13)
                    strran += total[num]
                }
                // } else {
                //     client.write("帐号密码错误！")
                //     client.write('Location: http://127.0.0.1:8888/admin\n\n')

                // }
                    client.write('HTTP/1.1 302 OK \n')
                    client.write('Content-Type: text/html charset = utf-8\n')
                    client.write(`Set-Cookie: SESSID=${strran}\n`)
                    client.write('Location: http://127.0.0.1:8001/admin\n\n')
                    client.end()
                }
            }

        })
        
})

server.listen(8001, () => {
    console.log("核爆程序已启动")
})