const express = require('express')
const fs = require('fs');
const users = require('./MOCK_DATA.json')
const app = express()

const PORT = 8000
app.use(express.urlencoded({ extended: false })); 


app.get('/users', (req, res) => {
    return res.json(users);
})

app.get('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find((u) => {
        return u.id === id;
    })

    return res.json(user);
})

app.post('/users', (req, res) => {
    const body = req.body;
    users.push({...body, id : users.length+1});
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
        return res.json({status : "success", id : users.length+1})
    })
})

app.patch('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex((u) => {
        return u.id === id;
    })

    users[userIndex] = { ...users[userIndex], ...req.body };

    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {
        return res.json({ status: 'User updated successfully' });
    });
});


app.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const newUsers = users.filter((u) => {
        return u.id !== id;
    })

    fs.writeFile('./MOCK_DATA.json', JSON.stringify(newUsers), (err) => {
        return res.json({ status: 'User deleted successfully' });
    });
});


app.listen(PORT, () =>{
    console.log(`Server listening at Port ${PORT}`)
})
