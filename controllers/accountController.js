// const Account = require('../models/Account');
// const Transaction = require('../models/Transaction');
// const User = require('../models/User');

// const getAccountBalance = async (req, res) => {
//   const userId = req.userData.id; // Assuming userData is added to the request object by middleware

//   try {
//     const account = await Account.findOne({ 
//         where: { userId },
//         include:
//         [
//           {
//           model: Transaction,
//           attributes: ['id', 'from_account_id','to_account_id','amount','transaction_type','appointment_id'], // Select only name and email from the User model
//         }, 
//       ],
//       attributes:['id','balance',]
//     });

//     if (!account) {
//       return res.status(404).json({ message: 'Account not found' });
//     }

//     res.status(200).json({ account});
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// const getTransactions = async (req, res) => {
//   try {
//     const userId = req.userData.id; // Assuming `req.userData` contains authenticated user's info

//     // Find the user's account
//     const account = await Account.findOne({ where: { userId } });

//     if (!account) {
//       return res.status(404).json({ message: 'Account not found' });
//     }

//     // Fetch transactions where the user's account is either the sender or receiver
//     const transactions = await Transaction.findAll({
//       where: {
//         [Sequelize.Op.or]: [
//           { from_account_id: account.id },
//           { to_account_id: account.id }
//         ]
//       },
//       include: [
//         { model: Account, as: 'fromAccount', include: [User] },
//         { model: Account, as: 'toAccount', include: [User] },
//         { model: Appointment }
//       ]
//     });

//     res.status(200).json(transactions);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };


// module.exports = {
//   getAccountBalance,
// };
