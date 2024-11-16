
const {createConnection} = require('typeorm');

// const connection = mysql.createConnection({
//     host: '127.0.0.1',
//     user: 'root',
//     password: 'faeze12345678',
//     database: 'my_database' ,
//     port:'3000'
// });

// console.log('kkkkkkkkkkkkkkkkkkkkkkkk')

// connection.connect((error) => {
//     if (error) throw error;
//     console.log('Connected to the MySQL server.');

//     connection.query('SELECT * FROM users', (error, results) => {
//         if (error) throw error;
//         console.log(results);
//     });
// });

 const db = createConnection({
    host: '127.0.0.1',
        user: 'root',
        password: 'faeze12345678',
        database: 'my_database' ,
        port:'3000'
})