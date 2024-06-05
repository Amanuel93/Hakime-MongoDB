const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const Withdrawal = require('../models/Withdrawal');

const setAppointments = async (req, res) => {
  const decoded = req.userData;
  const patientId = decoded.id;

  const { id, gender, age, reason, day, time, duration } = req.body;

  try {
    // Fetch patient, doctor, and their respective accounts
    const patient = await User.findByPk(patientId);
    const patientAccount = await Account.findOne({ where: { userId: patientId } });
    const doctor = await Doctor.findOne({ where: { userId: id } });
    const doctorAccount = await Account.findOne({ where: { userId: id } });

    // Check if patient and doctor exist
    if (!patient || !doctor) {
      return res.status(404).json({ message: 'Patient or doctor not found' });
    }

    // Calculate total amount, doctor fee, and service fee
    const hourlyRate = doctor.hourly_rate;
    const totalMinutes = duration;
    const totalAmount = (hourlyRate / 60) * totalMinutes;
    const serviceFee = totalAmount * 0.15;
    const doctorFee = totalAmount - serviceFee;

    // Check if patient has sufficient balance
    if (patientAccount.balance < totalAmount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Initiate payment for doctor's fee
    const doctorPaymentResponse = await axios.post('https://api.chapa.co/v1/transaction/initialize', {
      amount: doctorFee,
      currency: 'ETB',
      email: doctor.email,
      first_name: doctor.name,
      tx_ref: `tx_${Date.now()}`,
      callback_url: 'http://yourdomain.com/callback-url',
      return_url: 'http://yourdomain.com/success-url',
      customizations: {
        title: 'Doctor Fee Payment',
        description: `Payment for appointment with Dr. ${doctor.name}`,
      },
    }, {
      headers: {
        Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
      },
    });

    // Initiate payment for service fee
    const serviceFeePaymentResponse = await axios.post('https://api.chapa.co/v1/transaction/initialize', {
      amount: serviceFee,
      currency: 'ETB',
      email: 'your@example.com',
      first_name: 'Service Provider',
      tx_ref: `tx_${Date.now()}`,
      callback_url: 'http://yourdomain.com/callback-url',
      return_url: 'http://yourdomain.com/success-url',
      customizations: {
        title: 'Service Fee Payment',
        description: 'Service fee for appointment',
      },
    }, {
      headers: {
        Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
      },
    });

    // Create transaction records for doctor's fee and service fee
    await Transaction.create({ from_account_id: patientAccount.id, to_account_id: doctorAccount.id, amount: doctorFee, transaction_type: 'payment', appointment_id: appointment.id });
    await Transaction.create({ from_account_id: patientAccount.id, to_account_id: 1, amount: serviceFee, transaction_type: 'fee', appointment_id: appointment.id });

    // Create appointment with status pending until payments are confirmed
    const appointment = await Appointment.create({
      patientId,
      doctorId: id,
      gender,
      age,
      reason,
      day,
      time,
      duration,
      hourly_rate: hourlyRate,
      status: 'pending'
    });

    // Redirect the user to the Chapa payment pages
    res.json({ doctorPaymentUrl: doctorPaymentResponse.data.data.checkout_url, serviceFeePaymentUrl: serviceFeePaymentResponse.data.data.checkout_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const completeAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = 'completed';
    await appointment.save();

    res.json({ message: 'Appointment completed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const cancelAppointment = async (req, res) => {
  const { id } = req.params;
  const decoded = req.userData;
  const doctorId = decoded.id;

  try {
    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.doctorId !== doctorId) {
      return res.status(403).json({ message: 'You are not authorized to cancel this appointment' });
    }

    if (appointment.status !== 'confirmed') {
      return res.status(400).json({ message: 'Only confirmed appointments can be canceled' });
    }

    // Find the patient and doctor accounts
    const patientAccount = await Account.findOne({ where: { userId: appointment.patientId } });
    const doctorAccount = await Account.findOne({ where: { userId: appointment.doctorId } });

    if (!patientAccount || !doctorAccount) {
      return res.status(404).json({ message: 'Patient or doctor account not found' });
    }

    // Calculate the refund amount
    const hourlyRate = appointment.hourly_rate;
    const totalMinutes = appointment.duration;
    const totalAmount = (hourlyRate / 60) * totalMinutes;
    const serviceFee = totalAmount * 0.15;
    const doctorFee = totalAmount - serviceFee;

    // Process refund through Chapa
    const refundResponse = await axios.post('https://api.chapa.co/v1/transaction/refund', {
      tx_ref: appointment.tx_ref, // The transaction reference used during payment
      amount: totalAmount,
      currency: 'ETB'
    }, {
      headers: {
        Authorization: `Bearer ${CHAPA_SECRET_KEY}`
      }
    });

    if (refundResponse.data.status !== 'success') {
      return res.status(400).json({ message: 'Refund processing failed' });
    }

    // Update balances
    doctorAccount.balance -= doctorFee;
    patientAccount.balance += totalAmount;
    await doctorAccount.save();
    await patientAccount.save();

    // Record refund transaction
    await Transaction.create({ from_account_id: doctorAccount.id, to_account_id: patientAccount.id, amount: totalAmount, transaction_type: 'refund', appointment_id: appointment.id });

    // Update appointment status
    appointment.status = 'canceled';
    await appointment.save();

    res.json({ message: 'Appointment canceled and refund processed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const withDrawal = async (req, res) => {
  const doctorId = req.userData.id;
  const { amount,accountNumber } = req.body;

  try {
    const doctorAccount = await Account.findOne({ where: { userId: doctorId } });

    // Validate withdrawal amount
    if (amount <= 399) {
      return res.status(400).json({ message: 'Invalid withdrawal amount' });
    }

    // Check if doctor has sufficient balance
    if (doctorAccount.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Check if the doctor has made a withdrawal in the past week
    const lastWithdrawal = await Withdrawal.findOne({
      where: { doctorId },
      order: [['createdAt', 'DESC']]
    });

    if (lastWithdrawal && new Date() - new Date(lastWithdrawal.createdAt) < 7 * 24 * 60 * 60 * 1000) {
      return res.status(400).json({ message: 'Withdrawals are limited to once per week' });
    }

    // Simulate withdrawal processing
    // Deduct withdrawal amount from doctor's account balance
    doctorAccount.balance -= amount;
    await doctorAccount.save();

    // Simulate withdrawal request submission to Ethiopian Commercial Bank API
    const withdrawalResponse = await axios.post('https://examplebankapi.com/withdrawal', {
      accountNumber: accountNumber,
      amount,
      bankCode: 'ETCB',
      // Add any other necessary parameters for withdrawal
    });

    // Handle withdrawal response (this is a hypothetical example)
    if (withdrawalResponse.data.success) {
      // Update withdrawal status in your database
      await Withdrawal.create({ doctorId, amount, status: 'completed' });

      return res.json({ message: 'Withdrawal request submitted successfully' });
    } else {
      // Rollback transaction if withdrawal fails
      doctorAccount.balance += amount;
      await doctorAccount.save();

      return res.status(500).json({ message: 'Withdrawal request failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};







