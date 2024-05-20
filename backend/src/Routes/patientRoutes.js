const express = require('express');

const { loginPatient } = require('../Controllers/authController');
const router = express.Router();

const { getAllPatient, getPatientById, createPatient, updatePatient, deletePatient , patientDoc} = require('../Controllers/patientController')
const {authenticateUser,authorize} = require('../Middlewares/adminDocMiddleware');


const { getSum } = require('../Controllers/sumController')
router.post('/login', loginPatient)
router.get('/',getAllPatient);
router.post('/register', createPatient);





router.get('/sum', getSum);
router.use(authenticateUser);

router.get('/:id', getPatientById);

// router.get('/', authorize(['Admin']),getAllPatient);

router.get('/:doctorId/:patientId', authorize(['Admin']), patientDoc);

router.put('/:id', authorize(['Admin','patient']), updatePatient);
router.delete('/:id', authorize(['Admin']), deletePatient)



module.exports = router