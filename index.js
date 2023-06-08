import express, { json } from 'express'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import bcrypt from 'bcrypt'
import fs from'fs'

import dotenv from 'dotenv'


dotenv.config()

const port = process.env.PORT
const env = process.env.ENV 
const jwtSecret = process.env.JWTSECRET
const app = express()
app.use(cors({origin:'http://localhost:19006'}))
app.use(express.json())

app.post('/api/v1/authSignUp',(req,res)=>{
    

    const regexPassword= /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const {email, password} = req.body

    if( !regexPassword.test(password)){
       console.log('entered')
        return res.status(400).send({msg:'invalid password'})
        
    }
    if(! regexEmail.test(email)){
      console.log('entered')
        return res.status(400).send({msg:'invalid email'})
        
    }

     
       fs.readFile('users.json',(err, data)=>{
        if(err){
            console.error('Error reading users file:', err);
            return;
        }
        let users = [];
        if (data.length !== 0) {
          users = JSON.parse(data);
        }
        
        bcrypt.hash( password, 10, (err, hash)=>{
            if(err){
                console.log('error hashing password')
                return
            }

            const user = {
                email,
                password: hash
             }
            const userData = JSON.stringify(user)

            users.push(userData)

            fs.writeFile('users.json', JSON.stringify(users), (err) => {
                if (err) {
                  console.error('Error saving user:', err);
                } else {
                  console.log('User saved successfully.');

                  const token = jwt.sign({email}, jwtSecret)

                  return res.status(201).send({token})
                }
              });

        })

    
  })
})





app.listen(Number(port), ()=>{
    console.log(`listening on port ${port}`)
})

