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


module.exports = {
    createNewSpecialty: createNewSpecialty,
}