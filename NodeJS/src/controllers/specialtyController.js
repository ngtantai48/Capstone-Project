import specialtyService from '../services/specialtyService'


let createNewSpecialty = async (req, res) => {
    try {
        let info = await specialtyService.createNewSpecialtyService(req.body)
        return res.status(200).json(info)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: `Error from the server!`
        })
    }
}

let getAllSpecialty = async (req, res) => {
    try {
        let info = await specialtyService.getAllSpecialtyService(req.body)
        return res.status(200).json(info)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: `Error from the server!`
        })
    }
}

let getDetailSpecialtyById = async (req, res) => {
    try {
        let info = await specialtyService.getDetailSpecialtyByIdService(req.query.id, req.query.location)
        return res.status(200).json(info)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: `Error from the server!`
        })
    }
}

module.exports = {
    createNewSpecialty: createNewSpecialty,
    getAllSpecialty: getAllSpecialty,
    getDetailSpecialtyById: getDetailSpecialtyById
}