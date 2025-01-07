require('dotenv').config()
// const RouterOSAPI = require('node-routeros').RouterOSAPI;
// require('dotenv').config()

//         const host = process.env.MIKROTIK_HOST
//         const user = process.env.MIKROTIK_USER
//         const pass = process.env.MIKROTIK_PASSWORD
//         const port = process.env.MIKROTIK_PORT

//         console.log(host, user, pass, port)

// async function getPPPoEUsers(){
//     const conn = new RouterOSAPI({
//         host: process.env.MIKROTIK_HOST,
//         user: process.env.MIKROTIK_USER,
//         password: process.env.MIKROTIK_PASSWORD,
//         port: process.env.MIKROTIK_PORT,           
//     });


// // Connect and get info
//     try{
//         await conn.connect();

//         const users = await conn.write('/ppp/active/print');
//         users.forEach(user =>{
//             console.log(`Username: ${user.name}, IP: ${user.address}, Uptime: ${user.uptime}`)
//         })
//         const secrets = await conn.write('/ppp/secret/print');
//         secrets.forEach(user => {
//            console.log({
//                name: user.name,
//                service: user.service,
//                profile: user.profile,
//                lastOnline: user['last-logged-out'],
//                disabled: user.disabled,
//                password: user.password
               
//            });
//        });
//     // const username = "akumu"
//     // const password = "akumu001"
//     // await conn.write('/ppp/secret/add', [
//     //     '=name=' + username,
//     //     '=password=' + password,
//     //     '=service=pppoe',
//     //     '=profile=5MB',
//     //     '=disabled=no',
//     // ]);
//     // console.log("User added successfully");


//     }catch(error){
//         console.error("Error fetching router info:", error);
//     }finally{
//         conn.close();
//     }
// }

// getPPPoEUsers();
// console.log('Time zone:', process.env.TZ);

// Set default timezone globally in your app
console.log(process.env.TZ);
console.log('Current time:', new Date().toString());