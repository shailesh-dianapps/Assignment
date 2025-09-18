const express = require('express')
const app = express()
const data = require('./MOCK_DATA.json')
const fs = require('fs')

const port = 4000

app.use(express.json())
app.use(express.urlencoded({extended: true}))

// add, delete, update, get, getById

app.get('/users', (req, res) => {
    res.json(data);
})

app.get('/user/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if(isNaN(id)) return res.status(400).json({error: "Invalid user ID"});

    const user = data.find((u) => {
        return u.id === id;
    })

    if(!user) return res.status(404).json({error: "User not found"});
    res.json(user);
})

app.post('/user', (req, res) => {
    const {email} = req.body;
    if(!email) return res.status(400).json({error: "Email is required"});

    const nextId = data.length ? Math.max(...data.map(u => u.id || 0)) + 1 : 1;

    const user = {id: nextId, email}
    data.push(user);

    fs.writeFile('./MOCK_DATA.json', JSON.stringify(data), (err) => {
        if(err){
            console.error("Error writing file:", err);
            return res.status(500).json({error: "Failed to save user"});
        }
        else  res.status(201).json({message: "User Added", user:{id: user.id}});
    })
    
})

app.patch('/user/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if(isNaN(id)) return res.status(400).json({error: "Invalid user ID"});

    const index = data.findIndex(u => u.id === id);
    if(index === -1) return res.status(404).json({error: "User not found"});
  
    Object.assign(data[index], req.body);

    fs.writeFile('./MOCK_DATA.json', JSON.stringify(data), err => {
        if(err) return res.status(500).json({ error: "Failed to update user"});
        res.json({message: "User updated successfully", user: data[index]});
    });

})

app.delete('/user/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if(isNaN(id)) return res.status(400).json({error: "Invalid user ID"});

    const initialLength = data.length;

    const remaining = data.filter((u) => {
        return u.id !== id;
    })

    if(remaining.length === initialLength){
        return res.status(404).json({error: "User not found"});
    }

    data.length = 0;
    data.push(...remaining);

    fs.writeFile('./MOCK_DATA.json', JSON.stringify(data), (err) => {
        if(err){
            console.error("Error writing file:", err);
            return res.status(500).json({error: "Failed to delete user"});
        }
        return res.status(200).json({message: "User deleted", user:{id}});
    })
})


app.listen(port, () =>{
    console.log(`Server listening on port ${port}`)
})
