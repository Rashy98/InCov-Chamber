const bodyParser = require('body-parser');
const express = require('express');
const router = require('express').Router();

let Employee = require("../models/employee.model");


const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


router.route('/').get((req, res) => {
    Employee.find()
        .then(employees => res.json(employees))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/viewEmployee').get((req, res) => {
    Employee.find()
        .then(employee => res.json(employee))
        .catch(err => res.status(400).json({success: false, err: err}));
});

router.route('/addEmployee').post((req, res) => {
    // console.log(req.body);

    const newEmployee = new Employee({
        empID: req.body.empID,
        fullName: req.body.fullName,
        dailyReadings : req.body.dailyReadings
    });
    console.log(newEmployee);

    newEmployee.save()
        .then(() => res.json({success: true, msg:'Employee Details added!'}))
        .catch(err => res.status(400).json({success: false, err: err}));
});

router.route('/getEmp').get((req, res) =>{

    Employee.findOne({empID: req.body.empID})
        .then(result => {
            if(result){
                return res.status(200).json({success: true, result: result})
            } else {
                return res.status(400).json({success: false, result: result})
            }

        })
});

// router.route('/:id').delete((req, res) => {
//     Employee.findByIdAndDelete(req.params.id)
//         .then(() => res.json('LecturerNA Details deleted.'))
//         .catch(err => res.status(400).json({success: false, err: err}));
// });
//
router.route('/:id').get((req, res) => {
    Employee.findById(req.params.id)
        .then(lec => res.json(lec))
        .catch(err => res.status(400).json({success: false, err: err}));
});

// router.route('/update/:id').post((req, res) => {
//     Employee.findById(req.params.id)
//         .then(lecturer => {
//             lecturer.fullName = req.body.fullName;
//             lecturer.faculty = req.body.faculty;
//             lecturer.department = req.body.department;
//             lecturer.center = req.body.center;
//             lecturer.building = req.body.building;
//             lecturer.level = req.body.level;
//             lecturer.rank = req.body.rank;
//             lecturer.save()
//                 .then(() => res.json('Lecturer Details updated!'))
//                 .catch(err => res.status(400).json({success: false, err: err}));
//         })
//         .catch(err => res.status(400).json({success: false, err: err}));
// });

router.route('/pushDailyReadings').post(function (req,res){
    Employee.findOneAndUpdate(
        { _id: req.body._id },
        {
            $push: {
                dailyReadings: req.body.dailyReadings
            },
        }
    )
        .then(doc => {
            res.send(doc);
        })
        .catch(err => {
            console.error(err);
        });
});

module.exports = router;
