// const axios = require('axios');
// const express = require('express');
// const router = express.Router();
// const { Account, Transaction, User } = require('../models');

// const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;

// // Endpoint to initiate a deposit
// module.exports.deposit = async (req, res) => {
//   const decoded = req.userData;
//   const patientId = decoded.id;
//   const { amount } = req.body;

//   try {
//     const patient = await User.findByPk(patientId);
//     if (!patient) {
//       return res.status(404).json({ message: 'Patient not found' });
//     }

//     const chapaResponse = await axios.post('https://api.chapa.co/v1/transaction/initialize', {
//       amount,
//       currency: 'ETB',
//       email: patient.email,
//       first_name: patient.name,
//       tx_ref: `deposit_${Date.now()}`,
//       callback_url: `https://localhost:3000/patient/depositCallback/${tx-ref}`,
//       return_url: 'http://yourdomain.com/deposit-success',
//       customizations: {
//         title: 'Deposit Money',
//         description: 'Deposit to your account',
//       },
//     }, {
//       headers: {
//         Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
//       },
//     });

//     const { checkout_url } = chapaResponse.data.data;

//     res.json({ checkout_url });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// // Callback endpoint to handle deposit confirmation
// module.exports.depositCallback = async (req, res) => {
//   const { tx_ref} = req.params;

//   try {
//     if (status === 'success') {
//       const transaction = await axios.get(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
//         headers: {
//           Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
//         },
//       });

//       const { amount,customer } = transaction.data.data;

//       // Find the patient account using customer email
//       const patient = await User.findOne({ where: { email: customer.email } });
//       const patientAccount = await Account.findOne({ where: { userId: patient.id } });

//       // Update balance
//       patientAccount.balance += amount;
//       await patientAccount.save();

//       // Record transaction
//       await Transaction.create({ from_account_id: 1, to_account_id: patientAccount.id, amount, transaction_type: 'deposit' });

//       res.status(200).json({ message: 'Deposit successful and recorded' });
//     } else {
//       res.status(400).json({ message: 'Deposit failed or not completed' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };


