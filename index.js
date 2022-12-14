const express = require('express')
const fs = require('fs')

const app = express()

app.use(express.json())

/* Create - POST method */
app.post('/hospital/add', (req, res) => {
    const existUsers = getUserData()
    const userData = req.body
    if (userData.hospitalName == null || userData.patientCount == null || userData.hospitalLocation == null){
        return res.status(401).send({error: true, msg: 'Hospital data missing'})
    }
    const findExist = existUsers.find( user => user.hospitalName === userData.hospitalName )
    if (findExist) {
        return res.status(409).send({error: true, msg: 'Hospital Name already exist'})
    }

    
    existUsers.push(userData)

    saveUserData(existUsers);
    res.send({success: true, msg: 'Hospital data added successfully'})

})

/* Read - GET method */
app.get('/hospital/list', (req, res) => {
    const users = getUserData()
    res.send(users)
})

/* Update - Patch method */
app.patch('/hospital/update/:hospitalName', (req, res) => {
    
    const hospitalName = req.params.hospitalName
    const userData = req.body
    const existUsers = getUserData()

    const findExist = existUsers.find( user => user.hospitalName === hospitalName )
    if (!findExist) {
        return res.status(409).send({error: true, msg: 'Hospital not exist'})
    }

    const updateUser = existUsers.filter( user => user.hospitalName !== hospitalName )

    updateUser.push(userData)

    saveUserData(updateUser)

    res.send({success: true, msg: 'Hospital data updated successfully'})
})

/* Delete - Delete method */
app.delete('/hospital/delete/:hospitalName', (req, res) => {
    const hospitalName = req.params.hospitalName
    const existUsers = getUserData()
    const filterUser = existUsers.filter( user => user.hospitalName !== hospitalName )

    if ( existUsers.length === filterUser.length ) {
        return res.status(409).send({error: true, msg: 'Hospital does not exist'})
    }
    saveUserData(filterUser)

    res.send({success: true, msg: 'Hospital removed successfully'})
    
})


const saveUserData = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync('hospital.json', stringifyData)
}

const getUserData = () => {
    const jsonData = fs.readFileSync('hospital.json')
    return JSON.parse(jsonData)    
}

app.listen(5000, () => {
    console.log('Server runs on port 5000')
})