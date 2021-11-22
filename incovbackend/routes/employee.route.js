/*
    Employee routes
*/


// Importing needed libraries
const bodyParser = require('body-parser');
const express = require('express');
const router = require('express').Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");


// Importing Employee model
let Employee = require("../models/employee.model");
const validateLoginInput = require("../validation/login");
const validateRegisterInput = require("../validation/register");


const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))


// Retrieve all employee details
router.route('/').get((req, res) => {
    Employee.find()
        .then(employees => res.json(employees))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Retrieve all employee details
router.route('/viewEmployee').get((req, res) => {
    Employee.find()
        .then(employee => res.json(employee))
        .catch(err => res.status(400).json({success: false, err: err}));
});

// Add new employee
router.route('/addEmployee').post((req, res) => {

    const {errors, isValid} = validateRegisterInput(req.body)

    if (!isValid) {
        return res.status(400).json(errors)
    }

    Employee.findOne({username: req.body.username}).then(user => {

        if (user) {
            return res.status(400).json({username: "Username already exists"})
        } else {
            const newEmployee = new Employee({
                empID: req.body.empID,
                fullName: req.body.fullName,
                username: req.body.username,
                password: req.body.password,
                organization: req.body.organization,
                position: req.body.position,
                dailyReadings: req.body.dailyReadings,
                photo: req.body.photo,
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newEmployee.password, salt, (err, hash) => {
                    if (err) throw err;
                    newEmployee.password = hash;

                    newEmployee.save()
                        .then(() => res.json({success: true, msg: 'Employee Details added!'}))
                        .catch(err => res.status(400).json({success: false, err: err}));
                })

            })
        }
    })



});


// Retrieve employee detail for a given employee ID
router.route('/getEmp').post((req, res) => {

    Employee.findOne({empID: req.body.empID})
        .then(result => {
            if (result) {
                return res.status(200).json({success: true, result: result})
            } else {
                return res.status(400).json({success: false, result: result})
            }

        })
});

// Delete employee for a given employee ID
router.route('/:id').delete((req, res) => {
    Employee.findByIdAndDelete(req.params.id)
        .then(() => res.json('Employee  deleted.'))
        .catch(err => res.status(400).json({success: false, err: err}));
});


router.route('/:id').get((req, res) => {
    Employee.findById(req.params.id)
        .then(lec => res.json(lec))
        .catch(err => res.status(400).json({success: false, err: err}));
});

// Update employee detail for a given employee ID
router.route('/update/:id').post((req, res) => {
    Employee.findById(req.params.id)
        .then(emp => {
            emp.empID = req.body.empID;
            emp.fullName = req.body.fullName;
            emp.username = req.body.username;
            emp.password = req.body.password;
            emp.organization = req.body.organization;
            emp.position = req.body.position;
            emp.photo = req.body.photo;

            emp.save()
                .then(() => res.json('Employee Details updated!'))
                .catch(err => res.status(400).json({success: false, err: err}));
        })
        .catch(err => res.status(400).json({success: false, err: err}));
});

// Push daily readings of an employee for a given employee ID
router.route('/pushDailyReadings').post(async function (req, res) {
    const filter = {empID: req.body.empID}
    let _dailyReadings = []
    let size = 0


    await Employee.findOne(
        filter
    ).then(async findSuc => {
        _dailyReadings = await findSuc.dailyReadings
        size = await findSuc.dailyReadings.length
    }).catch(findErr => {
        res.status(400).json({msg: "Failed to find User", payLoad: findErr})
    })

    await Employee.findOneAndUpdate(
        filter,
        {
            $pop : {dailyReadings : 1}
        }
    ).catch(delErr => {
        res.status(400).json({msg: "Failed to Delete last Object", payLoad: delErr})
    })

    await Employee.findOneAndUpdate(
        filter,
        {
            $push : {
                dailyReadings : {
                    heartRate : _dailyReadings[size-1].heartRate,
                    cough : req.body.dailyReadings.cough,
                    anosmia : req.body.dailyReadings.anosmia,
                    fever: req.body.dailyReadings.fever,
                    sob: req.body.dailyReadings.sob,
                    date: req.body.dailyReadings.date,
                    time: req.body.dailyReadings.time
                }
            }
        }
    ).then(doc => {

    }).catch(err => {
        console.log(err)

    })

});

// Update heart rate for a given employee ID
router.route('/updateHeartRate').post(function (req, res) {
    Employee.findByIdAndUpdate(
        {_id: req.body._id},
        {
            $push: {
                dailyReadings: req.body.dailyReadings
            }
        }
    ).then(doc => {
        res.status(200).json(doc)
    })
});

// Retrieve employee heart rate for a given employee ID
router.route('/getHeartRate').post(function (req, res) {
    const filter = {empID: req.body.empID}

    Employee.findOne(
        filter
    ).then(doc => {
        res.status(200).json({msg : "Success", heartRate: doc.dailyReadings[doc.dailyReadings.length - 1].heartRate})
    }).catch(err => {
        res.status(400).json({msg: "Failed", Error: err})
    })
});

// Employee login for the mobile application
router.post("/login", (req, res) => {
    // Form validation
    const {errors, isValid} = validateLoginInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const username = req.body.username;
    const password = req.body.password;

    // Find user by username
    Employee.findOne({username}).then(employee => {
        console.log(employee.username)
        // Check if user exists
        if (!employee) {
            return res.status(404).json({msg: "Username not found", emailnotfound: "Username not found"});
        }
        // Check password
        bcrypt.compare(password, employee.password).then(isMatch => {
            if (isMatch) {
                // User matched
                // Create JWT Payload
                const payload = {
                    _id: employee._id,
                    empID: employee.empID,
                    fullName: employee.fullName,
                    organization: employee.organization
                };
                // Sign token
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: 31556926 // 1 year in seconds
                    },
                    (err, token) => {
                        res.status(200).json({

                            success: true,
                            token: "Bearer " + token,
                            _id: payload._id,
                            empID: payload.empID,
                            organization: payload.organization
                        });
                    }
                );
            } else {
                return res
                    .status(400)
                    .json({msg: "Username or Password Incorrect", passwordincorrect: "Password Incorrect"});
            }
        });
    });
});


module.exports = router;
