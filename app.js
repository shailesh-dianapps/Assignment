import express from 'express';
import db from "./connection/conn.js";
import bcrypt from "bcryptjs";
import {ObjectId} from 'mongodb';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));


/*
firstName + lastName- unique, case insensitive
age > 1 and age < 100
gender = M, F, Others
password = hashed , valid
phone number - international, valid
email - valid

*/


app.post('/signup', async (req, res) => {
    const collection = await db.collection('students');

    const {first_name, last_name, gender, age, email, phone, password} = req.body;

    if(!first_name || !last_name || !gender || !age || !email || !phone || !password){
        return res.status(400).json({error: "All fields are required."});
    }

    const nameRegex = /^[a-zA-Z'-]{2,50}$/;
    if(!nameRegex.test(first_name) || !nameRegex.test(last_name)){
        return res.status(400).json({ error: "Names must be 2-50 characters and contain only letters, hyphens"});
    }

    if(age<=1 || age>=100) return res.status(400).json({error: "Age must be a number between 2 and 99."});

    const validGenders = ["M", "F", "Others"];
    if(!validGenders.includes(gender)) return res.status(400).json({error: "Gender must be 'M', 'F', or 'Others'."});

    const emailRegex = /(([a-zA-Z]*)?[0-9]{3})@[a-zA-Z]+.[a-zA-Z]+/;
    if(!emailRegex.test(email)) return res.status(400).json({error: "Invalid email format."});

    const phoneRegex = /^(?:\+91|91)?[789]\d{9}$/;
    if(!phoneRegex.test(phone)) return res.status(400).json({error: "Invalid phone number format."});

    const passwordRegex = /^.{8,}$/;
    if(!passwordRegex.test(password)) return res.status(400).json({error: "Password must be at least 8 characters"});

    const existingUser = await collection.findOne({
        $expr: {
            $and: [
                {$eq: [{$toLower: "$first_name"}, first_name.toLowerCase()]},
                {$eq: [{$toLower: "$last_name"}, last_name.toLowerCase()]}
            ]
        }
    });
    if(existingUser) return res.status(400).json({error: "User with same first and last name already exists."});

    const existingEmail = await collection.findOne({email: email});
    if(existingEmail) return res.status(400).json({error: "Email already exists."});

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {first_name, last_name, gender, age, email, phone, password: hashedPassword};
    await collection.insertOne(newUser);
    return res.status(200).json({message: "User Created successfully."});
});

//get
app.get('/students', async (req, res) => {
    const collection = db.collection('students');
    const students = await collection.find({}).toArray();
    res.json(students);
});

//getByID
app.get('/students/:id', async(req, res) => {
    const collection = db.collection('students');
    const {id} = req.params;

    if(!ObjectId.isValid(id)) return res.status(400).json({error: "Invalid student ID."});

    const student = await collection.findOne({_id: new ObjectId(id)});

    if(!student) return res.status(404).json({error: "Student not found."});
    res.json(student);
})

//update
app.put('/students/:id', async (req, res) => {
    const collection = db.collection('students');
    const {id} = req.params;
    const {first_name, last_name, gender, age, email, phone, password} = req.body;

    if(!ObjectId.isValid(id)) return res.status(400).json({error: "Invalid student ID."});

    const updates = {};

    if(first_name) updates.first_name = first_name;
    if(last_name) updates.last_name = last_name;

    if(gender){
        const validGenders = ["M", "F", "Others"];
        if (!validGenders.includes(gender)){
            return res.status(400).json({error: "Gender must be 'M', 'F', or 'Others'."});
        }
        updates.gender = gender;
    }

    if(age){
        if(age<=1 || age>=100) return res.status(400).json({ error: "Age must be between 2 and 99." });
        updates.age = age;
    }

    if(email){
        const emailRegex = /(([a-zA-Z]*)?[0-9]{3})@[a-zA-Z]+.[a-zA-Z]+/;
        if(!emailRegex.test(email)) return res.status(400).json({error: "Invalid email format."});
        updates.email = email;
    }

    if(phone){
        const phoneRegex = /^(?:\+91|91)?[789]\d{9}$/;
        if(!phoneRegex.test(phone)) return res.status(400).json({error: "Invalid phone number format."});
        updates.phone = phone;
    }

    if(password){
        const passwordRegex = /^.{8,}$/;
        if(!passwordRegex.test(password)) return res.status(400).json({error: "Password must be at least 8 characters"});
        updates.password = await bcrypt.hash(password, 10);
    }

    const result = await collection.updateOne({_id: new ObjectId(id)}, {$set: updates});

    res.json({message: "Student updated successfully."});
});


//delete
app.delete('/students/:id', async (req, res) => {
    const collection = db.collection('students');
    const {id} = req.params;

    if(!ObjectId.isValid(id)) return res.status(400).json({error: "Invalid student ID."});

    const result = await collection.deleteOne({_id: new ObjectId(id)});

    res.json({message: "Student deleted successfully."});
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})