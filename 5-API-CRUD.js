const express = require('express')
const fs = require('fs')
const usersData = require('./sample.json')
const app = express()

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const port = 4000

app.get('/users', (req, res) => {
    res.json(usersData)
})

app.get('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if(isNaN(id)) return res.status(400).json({error: "Invalid User ID"})

    const user = usersData.find((u) => {
        return u.id === id;
    })

    if(!user) return res.status(404).json({error: "User not found"})
    
    res.json(user)
})

app.post('/users', (req, res) => {
    const data = req.body;

    if(!data){
        return res.status(400).json({error: "User data is required"})
    }

    const nextId = usersData.length ? Math.max(...usersData.map(u => u.id || 0)) + 1 : 1;
    const user = {id: nextId, ...data};
    usersData.push(user);

    fs.writeFile('./sample.json', JSON.stringify(usersData), (err) => {
        if(err) return res.status(500).json({error: "Failed to save user"})
        return res.status(201).json({message: 'User Created', user})
    })
})

app.patch('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if(isNaN(id)) return res.status(400).json({error: "Invalid User ID"})

    const userId = usersData.findIndex((u) => {
        return u.id === id;
    })

    if(userId === -1) return res.status(404).json({error: "User not found"});

    const data = req.body;
    if(!data){
        return res.status(400).json({error: "User data is required"})
    }

    usersData[userId] = {...usersData[userId], ...data};
    const user = usersData[userId];

    fs.writeFile('./sample.json', JSON.stringify(usersData), (err) => {
        if(err) return res.status(500).json({error: "Failed to update user"})
        return res.status(200).json({message: 'User Updated', user})
    })
})

app.put('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if(isNaN(id)) return res.status(400).json({error: "Invalid User ID"})

    const userId = usersData.findIndex((u) => {
        return u.id === id;
    })

    if(userId === -1) return res.status(404).json({error: "User not found"});

    const data = req.body;
    if(!data){
        return res.status(400).json({error: "User data is required"})
    }

    usersData[userId] = {id, ...data};
    const user = usersData[userId];

    fs.writeFile('./sample.json', JSON.stringify(usersData), (err) => {
        if(err) return res.status(500).json({error: "Failed to update user"})
        return res.status(200).json({message: 'User Updated', user})
    })
})

app.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if(isNaN(id)) return res.status(400).json({error: "Invalid User ID"})

    const userId = usersData.findIndex((u) => {
        return u.id === id;
    })

    if(userId === -1) return res.status(404).json({error: "User not found"});
    // const user = usersData[userId];
    
    // const data = usersData.filter((u) => {
    //     return u.id !== id;
    // })

    // usersData.length = 0;
    // usersData.push(...data);

    const deleted = usersData.splice(userId, 1);

    fs.writeFile('./sample.json', JSON.stringify(usersData), (err) => {
        if(err) return res.status(500).json({error: "Failed to delete user"})
        return res.status(200).json({message: 'User Deleted', deleted})
    })
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
