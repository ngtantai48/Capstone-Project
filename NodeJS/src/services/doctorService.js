import db from "../models/index";


let getTopDoctorHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                ],
                nest: true,
                raw: true
            })

            if (users.length === 0) {
                console.log('No users found with roleId R2');
            } else {
                resolve({
                    errCode: 0,
                    data: users
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}


module.exports = {
    getTopDoctorHome: getTopDoctorHome
}