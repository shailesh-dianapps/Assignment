const express = require("express");
const connectDB = require("./connection/conn.js");
const bcrypt = require("bcryptjs");
const {ObjectId} = require("mongodb");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post('/signup', async (req, res) => {
    try{
        // update logic of existing user

        const db = await connectDB();   
        const collection = db.collection('students');

        const {first_name, last_name, age, gender, phone, password, email} = req.body;

        if(!first_name || !last_name || !gender || !age || !email || !phone || !password){
            return res.status(400).json({error: "All fields are required."});
        }

        if(age<=1 || age>=100) return res.status(400).json({error: "Age must be a number between 2 and 99."});

        let genders = ['M', 'F', 'Others'];
        if(!genders.includes(gender)) return res.status(400).json({error: "Gender must be 'M', 'F', or 'Others'."});

        const nameRegex =  /^[a-zA-Z'-]{2,50}$/;
        if(!nameRegex.test(first_name) || !nameRegex.test(last_name)){
            return res.status(400).json({ error: "Names must be 2-50 characters and contain only letters, hyphens"});
        }

        const phoneRegex = /^(?:\+91|91)?[789]\d{9}$/;
        if(!phoneRegex.test(phone)) return res.status(400).json({error: "Invalid phone number format."});

        const passwordRegex = /^.{8,}$/;
        if(!passwordRegex.test(password)) return res.status(400).json({error: "Password must be at least 8 characters"});

        const emailRegex = /^[A-Za-z0-9._%+-]{2,}@[A-Za-z0-9.-]{2,}\.[A-Za-z]{2,}$/;
        if(!emailRegex.test(email)) return res.status(400).json({error: "Invalid email format."});

        const existingEmail = await collection.findOne({email});
        if(existingEmail) return res.status(400).json({error: "Email already exists."});

        const normalizedFirst = first_name.toLowerCase();
        const normalizedLast = last_name.toLowerCase();

        const existingUser = await collection.findOne({first_name: normalizedFirst, last_name: normalizedLast});

        if(existingUser) return res.status(400).json({error: "User already exists."});

        const hashedPassword = await bcrypt.hash(password, 10);

        const newuser = {first_name, last_name, age, gender, phone, password: hashedPassword, email};
        await collection.insertOne(newuser);
        return res.status(200).json({message: "User Created successfully."});
    }
    catch(err){
        console.error("Error in signup:", err);
        return res.status(500).json({error: "Internal Server Error. Please try again later."});
    }
})

app.get('/students', async (req, res) => {
    try{
        const db = await connectDB();   
        const collection = db.collection('students');
        const students = await collection.find({}).toArray();
        res.json(students);
    }
    catch(err){
        console.error("Error fetching students:", err);
        res.status(500).json({error: "Internal Server Error. Please try again later."});
    }
})

app.get('/students/:id', async (req, res) => {
    try{
        const db = await connectDB();   
        const collection = db.collection('students');
        const {id} = req.params;

        if(!ObjectId.isValid(id)) return res.status(400).json({error: "Invalid student ID."});
        const student = await collection.findOne({_id: new ObjectId(id)});
        if(!student) return res.status(404).json({error: "Student not found."});
        res.json(student);
    }
    catch(err){
        console.error("Error fetching student:", err);
        res.status(500).json({error: "Internal Server Error. Please try again later."});
    }
})

app.put('/students/:id', async (req, res) => {
    try{
        const db = await connectDB();   
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
            const emailRegex = /^[A-Za-z0-9._%+-]{2,}@[A-Za-z0-9.-]{2,}\.[A-Za-z]{2,}$/;
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

        // unique validation fails for first_name and last_name.

        const result = await collection.updateOne({_id: new ObjectId(id)}, {$set: updates});
        if(result.matchedCount === 0) return res.status(404).json({error: "Student not found."});
        res.json({message: "Student updated successfully."});
    }
    catch(err){
        console.error("Error updating student:", err);
        res.status(500).json({error: "Internal Server Error. Please try again later."});
    }
});

app.delete('/students/:id', async (req, res) => {
    try{
        const db = await connectDB();   
        const collection = db.collection('students');
        const {id} = req.params;

        if(!ObjectId.isValid(id)) return res.status(400).json({error: "Invalid student ID."});
        const result = await collection.deleteOne({_id: new ObjectId(id)});
        if(result.deletedCount === 0) return res.status(404).json({ error: "Student not found."});
        res.json({message: "Student deleted successfully."});
    }
    catch(err){
        console.error("Error deleting student:", err);
        res.status(500).json({error: "Internal Server Error. Please try again later."});
    }
});

app.listen(port, () => {
    console.log(`Server listening on ${port}`)
})