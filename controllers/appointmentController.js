const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
// const Transaction = require('../models/Transaction');
// const Account = require('../models/Account');
// const Withdrawal = require('../models/Withdrawal');

const setAppointments = async (req, res) => {
  const decoded = req.userData;
  const patientId = decoded.id;

  const { id, gender, age, reason, day, time, duration } = req.body;

  try {
    // Fetch patient and doctor
    const patient = await User.findById(patientId);
    const doctor = await Doctor.findOne({ userId: id });

    // Check if patient and doctor exist
    if (!patient || !doctor) {
      return res.status(404).json({ message: 'Patient or doctor not found' });
    }

    // Create appointment with status 'pending'
    const appointment = await Appointment.create({
      patientId,
      doctorId: id,
      gender,
      age,
      reason,
      day,
      time,
      duration,
      hourly_rate: doctor.hourly_rate,
      status: 'pending'
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get appointments for a doctor or patient with user details
const getAppointments = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Determine the role and get appointments accordingly
    if (user.role === 'doctor') {
      // Get doctor's appointments with patient details
      const doctorAppointments = await Appointment.find({ doctorId: userId })
        .populate({
          path: 'patientId',
          select: 'id image'
        })
        .populate({
          path: 'doctorId',
          select: 'id image'
        })
        .select('id doctorId gender day time status duration hourly_rate');

      return res.json(doctorAppointments);
    } else if (user.role === 'patient') {
      // Get patient's appointments with doctor details
      const patientAppointments = await Appointment.find({ patientId: userId })
        .populate({
          path: 'patientId',
          select: 'id image'
        })
        .populate({
          path: 'doctorId',
          select: 'id image'
        })
        .select('id doctorId gender day time status duration hourly_rate');

      return res.json(patientAppointments);
    } else {
      return res.status(400).json({ error: 'Invalid user role' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while fetching appointments' });
  }
};

    module.exports = {
      setAppointments,
      getAppointments
      }
      
  // const completeAppointment = async (req, res) => {
  //   const { id } = req.params;
  
  //   try {
  //     const appointment = await Appointment.findByPk(id);
  //     if (!appointment) {
  //       return res.status(404).json({ message: 'Appointment not found' });
  //     }
      
  //     const patientAccount = await Account.findOne({ where: { userId: appointment.patientId } });
  //     const doctorAccount = await Account.findOne({ where: { userId: appointment.doctorId } });
      
  //     // Get appointments for a doctor or patient with user details
  //     if (!patientAccount || !doctorAccount) {
  //       return res.status(404).json({ message: 'Patient or doctor account not found' });
  //     }
  
  //     const hourlyRate = appointment.hourly_rate;
  //     const totalMinutes = appointment.duration;
  //     const totalAmount = (hourlyRate / 60) * totalMinutes;
  //     const serviceFee = totalAmount * 0.15;
  //     const doctorFee = totalAmount - serviceFee;
      
  //     if (patientAccount.balance < totalAmount) {
  //       return res.status(400).json({ message: 'Insufficient balance' });
  //     }
  
  //     // Update balances
  //     patientAccount.balance -= totalAmount;
  //     doctorAccount.balance += doctorFee;
  //     await patientAccount.save();
  //     await doctorAccount.save();
  
  //     // Record transactions
  //     await Transaction.create({ from_account_id: patientAccount.id, to_account_id: doctorAccount.id, amount: doctorFee, transaction_type: 'payment', appointment_id: appointment.id });
  //     await Transaction.create({ from_account_id: doctorAccount.id, to_account_id: 1, amount: serviceFee, transaction_type: 'fee', appointment_id: appointment.id });
      
  //     // Update appointment status to 'completed'
  //     appointment.status = 'completed';
  //     await appointment.save();
  
  //     res.json({ message: 'Appointment completed and payment processed successfully' });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: 'Internal server error' });
  //   }
  // };
  
  // const cancelAppointment = async (req, res) => {
  //   const { id } = req.params;
  //   const decoded = req.userData;
  //   const doctorId = decoded.id;
  
  //   try {
  //     const appointment = await Appointment.findByPk(id);
  
  //     if (!appointment) {
  //       return res.status(404).json({ message: 'Appointment not found' });
  //     }
  
  //     if (appointment.doctorId !== doctorId) {
  //       return res.status(403).json({ message: 'You are not authorized to cancel this appointment' });
  //     }
  
  //     if (appointment.status !== 'confirmed') {
  //       return res.status(400).json({ message: 'Only confirmed appointments can be canceled' });
  //     }
  
  //     const patientAccount = await Account.findOne({ where: { userId: appointment.patientId } });
  //     const doctorAccount = await Account.findOne({ where: { userId: appointment.doctorId } });
  
  //     if (!patientAccount || !doctorAccount) {
  //       return res.status(404).json({ message: 'Patient or doctor account not found' });
  //     }
  
  //     const hourlyRate = appointment.hourly_rate;
  //     const totalMinutes = appointment.duration;
  //     const totalAmount = (hourlyRate / 60) * totalMinutes;
  //     const serviceFee = totalAmount * 0.15;
  //     const doctorFee = totalAmount - serviceFee;
  
  //     // Revert balances
  //     doctorAccount.balance -= doctorFee;
  //     patientAccount.balance += totalAmount;
  //     await doctorAccount.save();
  //     await patientAccount.save();
  
  //     // Record refund transaction
  //     await Transaction.create({ from_account_id: doctorAccount.id, to_account_id: patientAccount.id, amount: totalAmount, transaction_type: 'refund', appointment_id: appointment.id });
  
  //     // Update appointment status to 'canceled'
  //     appointment.status = 'canceled';
  //     await appointment.save();
  
  //     res.json({ message: 'Appointment canceled and refund processed successfully' });
  //     } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: 'Internal server error' });
  //   }
  // };

  // const withDrawal = async (req, res) => {
  //   const doctorId = req.userData.id;
  //   const { amount,accountNumber } = req.body;
    
  //   try {
  //     const doctorAccount = await Account.findOne({ where: { userId: doctorId } });
      
  //     // Validate withdrawal amount
  //     if (amount <= 399) {
  //       return res.status(400).json({ message: 'Invalid withdrawal amount' });
  //       }
  
  //     // Check if doctor has sufficient balance
  //     if (doctorAccount.balance < amount) {
  //       return res.status(400).json({ message: 'Insufficient balance' });
  //       }
  
  //       // Check if the doctor has made a withdrawal in the past week
  //     const lastWithdrawal = await Withdrawal.findOne({
  //       where: { doctorId },
  //       order: [['createdAt', 'DESC']]
  //     });
      
  //     if (lastWithdrawal && new Date() - new Date(lastWithdrawal.createdAt) < 7 * 24 * 60 * 60 * 1000) {
  //       return res.status(400).json({ message: 'Withdrawals are limited to once per week' });
  //       }
  
  //     // Simulate withdrawal processing
  //     // Deduct withdrawal amount from doctor's account balance
  //     doctorAccount.balance -= amount;
  //     await doctorAccount.save();
  
  //     // Simulate withdrawal request submission to Ethiopian Commercial Bank API
  //     const withdrawalResponse = await axios.post('https://examplebankapi.com/withdrawal', {
  //       accountNumber: accountNumber,
  //       amount,
  //       bankCode: 'ETCB',
  //       // Add any other necessary parameters for withdrawal
  //     });
  
  //     // Handle withdrawal response (this is a hypothetical example)
  //     if (withdrawalResponse.data.success) {
  //       // Update withdrawal status in your database
  //       await Withdrawal.create({ doctorId, amount, status: 'completed' });
  
  //       return res.json({ message: 'Withdrawal request submitted successfully' });
  //     } else {
  //       // Rollback transaction if withdrawal fails
  //       doctorAccount.balance += amount;
  //       await doctorAccount.save();
  
  //       return res.status(500).json({ message: 'Withdrawal request failed' });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: 'Internal server error' });
  //   }
  // };