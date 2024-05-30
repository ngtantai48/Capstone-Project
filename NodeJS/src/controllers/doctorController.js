import doctorService from "../services/doctorService"


let getTopDoctorHome = async (req, res) => {
    // let limit = req.query.limit;
    // if (!limit) limit = 10
    let limit = parseInt(req.query.limit, 10);
    if (isNaN(limit) || limit <= 0) limit = 10;
    try {
        let response = await doctorService.getTopDoctorHome(limit);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        });
    }
}

let getAllDoctors = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctors();
        return res.status(200).json(doctors)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: `Error from the server`
        })
    }
}

let postInfoDoctor = async (req, res) => {
    try {
        let response = await doctorService.saveDetailInfoDoctor(req.body)
        return res.status(200).json(response);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: `Error from the server`
        })
    }
}

let getDetailDoctorById = async (req, res) => {
    try {
        // if (!req.query.id) {
        //     return res.status(200).json({
        //         errCode: 3,
        //         errMessage: `Missing req.query.id`
        //     })
        // }
        let info = await doctorService.getDetailDoctorById(req.query.id)
        return res.status(200).json(info)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: `Error from the server !`
        })
    }
}

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    postInfoDoctor: postInfoDoctor,
    getDetailDoctorById: getDetailDoctorById
}