const Doctor = require('../models/Doctor');
module.exports.checkProfile = async(req, res, next) => {
    try{  
        const decodedToken = req.userData;
        const Id = decodedToken.id;
        const DoctorRow = await Doctor.findOne({ where: { userId:Id } })
        const doctorId = DoctorRow.id;
        const completed = DoctorRow.completed;
        const status = DoctorRow.status;

        if(completed === 'No'){

            return res.status(401).json({
                message: "please, complete your profile to schedule!"
            });
        }else if(status !== 'active'){

            return res.status(401).json({
                message: "please, wait for your approval !"
            });
        }
        
        req.userData = {...req.useData,doctorId};
        next();

    }catch(e){
        return res.status(401).json({
            'message': "Invalid or expired token provided!",
            'error':e
        });
    }
}