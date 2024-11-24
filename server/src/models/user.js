// const mongoose = require('mongoose');


// const { Sequelize, Model, DataTypes } = require('sequelize');
// const config = require('../config/main');
// const sequelize = require('sequelize');

// const sequelize = new sequelize (config.database);

// class User extends Model{}

// User.init({
//     firstName: DataTypes.STRING,
//     lastName: DataTypes.STRING,
//     email: DataTypes.STRING
// } ,
// {
//       sequelize,
//     modelName: 'User'
// }
// )

// User.create({
//     firstName: 'John',
//     lastName: 'Doe',
//     email: 'johndoe@example.com'
// })
// .then(user => {
//     console.log(user.toJSON());
// })
// .catch(err => {
//     console.error('Unable to create user:', err);
// });





// const userSchema =new mongoose.Schema({
//     email:{type:String , required:true , unique: true},
//     name : {type:String , required:true},
//     password : {type:String , required:true},
   
// });


// const User =  mongoose.model('user' , userSchema)

// module.exports = User;



// import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

// export interface UserInterface {
//     id: number;
//     firstName: string;
//     lastName: string;
// }

// Entity()
// export class User  UserInterface = {
//     @PrimaryGeneratedColumn()   
  
//     id: number;
  
//     @Column()
//     firstName: string;
  
//     @Column()
//    lastName: string;
  
    
//   }