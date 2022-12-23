const express = require('express')
const fs = require('fs')

const app = express()

const{MongoClient} = require('mongodb')
const url = 'mongodb://localhost:27017';
const databaseName = 'Assigmnement'
const client = new MongoClient(url);





app.use(express.json())

/* Create - POST method */
app.post('/hospital/add', (req, res) => {
    //const existUsers = getUserData()
    const userData = req.body
    if (userData.id == null || userData.name == null || userData.lastname == null || userData.email == null || userData.mobile == null || userData.gender == null
        || userData.age == null){
        return res.status(401).send({error: true, msg: 'Employee data missing'})
    }
    /*const findExist = existUsers.find( user => user.name === userData.name )
    if (findExist) {
        return res.status(409).send({error: true, msg: 'Employee Name already exist'})
    }*/

    async function insertData()
    {
        let result = await client.connect();
        db = result.db(databaseName);
        collection = db.collection('employee');
        let data = await collection.insert(userData);
        console.log(data)

    } 
    insertData();
    
    //existUsers.push(userData)

    //saveUserData(existUsers);
    res.send({success: true, msg: 'Employee data added successfully'})

})

/* Read - GET method */
app.get('/hospital/list', (req, res) => {
    /*const users = getUserData()
    res.send(users)*/
    async function getData()
    {
        let result = await client.connect();
        db = result.db(databaseName);
        collection = db.collection('employee');
        let data = await collection.find({}).toArray();
        console.log(data)
        res.send(data)

        /*data.then(function(result) {
            console.log(result) 
            // "Some User token"
        })*/

    }

getData();

})

/* Update - Patch method */
app.patch('/hospital/update/:employeeName/:updateName', (req, res) => {
    
    const employeeName = req.params.employeeName
    const userData = req.body.name
    

    /*const findExist = existUsers.find( user => user.hospitalName === hospitalName )
    if (!findExist) {
        return res.status(409).send({error: true, msg: 'Hospital not exist'})
    }*/

    async function updateData()
    {
        let result = await client.connect();
        db = result.db(databaseName);
        collection = db.collection('employee');
        let data = await collection.update(
            {name:employeeName},
                {
                    $set:{name:updateName}
                }
            );
        console.log(data)
    } 
    updateData();

    res.send({success: true, msg: 'Employee name updated successfully'})
})

/* Delete - Delete method */
app.delete('/hospital/delete/:employeeName', (req, res) => {
    const employeeName = req.params.employeeName
    

   async function deleteData()
    {
        let result = await client.connect();
        db = result.db(databaseName);
        collection = db.collection('employee');
        let data = await collection.deleteOne({name:employeeName});
        console.log(data)
    } 
    deleteData();

    res.send({success: true, msg: 'Employee removed successfully'})
    
})


const saveUserData = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync('hospital.json', stringifyData)
}

const getUserData = (data) => {  
    async function getData()
    {
        let result = await client.connect();
        db = result.db(databaseName);
        collection = db.collection('employee');
        let data = await collection.find({name:data}).toArray();
        console.log(data)

    }  
}

app.listen(3000, () => {
    console.log('Server runs on port 3000')
})