import db from "../models/index";
import { Buffer } from 'buffer';
require('dotenv').config();
import _, { includes } from 'lodash';
const { Op } = require('sequelize');

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;


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

let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password', 'image']
                },
            })

            resolve({
                errCode: 0,
                data: doctors
            })
        } catch (error) {
            reject(error)
        }
    })
}

let saveDetailInfoDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const requiredFields = [
                'doctorId',
                'contentHTML',
                'contentMarkdown',
                'action',
                'selectedPrice',
                'selectedPayment',
                'selectedProvince',
                'nameClinic',
                'addressClinic',
                'note'
            ];

            for (let field of requiredFields) {
                if (!inputData[field]) {
                    return resolve({
                        errCode: 1,
                        errMessage: `Missing parameter: ${field}`
                    });
                }
            }

            // upsert to Markdown
            if (inputData.action === 'CREATE') {
                await db.Markdown.create({
                    contentHTML: inputData.contentHTML,
                    contentMarkdown: inputData.contentMarkdown,
                    description: inputData.description,
                    doctorId: inputData.doctorId
                });
            } else if (inputData.action === 'EDIT') {
                let doctorMarkdown = await db.Markdown.findOne({
                    where: { doctorId: inputData.doctorId },
                    raw: false
                });

                if (doctorMarkdown) {
                    doctorMarkdown.contentHTML = inputData.contentHTML;
                    doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
                    doctorMarkdown.description = inputData.description;
                    // doctorMarkdown.updatedAt = new Date()

                    await doctorMarkdown.save();
                }
            }

            // upsert to Doctor_info table
            let doctorInfo = await db.Doctor_Info.findOne({
                where: {
                    doctorId: inputData.doctorId
                },
                raw: false
            })

            if (doctorInfo) {
                //update
                doctorInfo.priceId = inputData.selectedPrice;
                doctorInfo.provinceId = inputData.selectedProvince;
                doctorInfo.paymentId = inputData.selectedPayment;
                doctorInfo.nameClinic = inputData.nameClinic;
                doctorInfo.addressClinic = inputData.addressClinic;
                doctorInfo.note = inputData.note;

                await doctorInfo.save()
            } else {
                //create
                await db.Doctor_Info.create({
                    doctorId: inputData.doctorId,
                    priceId: inputData.selectedPrice,
                    provinceId: inputData.selectedProvince,
                    paymentId: inputData.selectedPayment,
                    nameClinic: inputData.nameClinic,
                    addressClinic: inputData.addressClinic,
                    note: inputData.note,
                })
            }

            resolve({
                errCode: 0,
                errMessage: `Save info doctor success!`
            });
        } catch (error) {
            reject(error);
        }
    });
}


let getDetailDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required parameter !`
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Markdown, attributes: ['description', 'contentHTML', 'contentMarkdown'] },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor_Info,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                            ]
                        },
                    ],
                    nest: true,
                    raw: false
                })

                if (data && data.image) {
                    data.image = new Buffer.from(data.image, 'base64').toString('binary');
                }

                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let bulkCreateScheduleService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data || !data.arrSchedule || !data.doctorId || !data.formattedDate) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required parameters !`
                });
            } else {
                // Xóa các lịch trình có ngày trong quá khứ
                await db.Schedule.destroy({
                    where: {
                        date: {
                            [Op.lt]: new Date().setHours(0, 0, 0, 0)
                        }
                    }
                });

                let newSchedules = data.arrSchedule;

                if (newSchedules && newSchedules.length > 0) {
                    newSchedules = newSchedules.map((item) => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    });
                }

                // Truy vấn các lịch trình hiện có từ DB
                let existingSchedules = await db.Schedule.findAll({
                    where: {
                        doctorId: data.doctorId,
                        date: data.formattedDate
                    },
                    attributes: ['id', 'timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true
                });

                // Xác định những khoảng thời gian cần xóa
                let toDelete = _.differenceWith(existingSchedules, newSchedules, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                });

                // Xóa các khoảng thời gian cần thiết
                if (toDelete && toDelete.length > 0) {
                    let idsToDelete = toDelete.map(schedule => schedule.id);
                    await db.Schedule.destroy({ where: { id: idsToDelete } });
                }

                // Xác định những khoảng thời gian cần thêm mới
                let toCreate = _.differenceWith(newSchedules, existingSchedules, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                });

                // Thêm các khoảng thời gian mới
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);
                }

                resolve({
                    errCode: 0,
                    errMessage: `OK`
                });
            }
        } catch (error) {
            reject(error);
        }
    });
}

let getScheduleByDateService = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required parameters !`
                })
            } else {
                let dataSchedule = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        {
                            model: db.Allcode,
                            as: 'timeTypeData',
                            attributes: ['valueEn', 'valueVi']
                        },
                    ],
                    order: [['timeType', 'ASC']],
                    raw: false,
                    nest: true
                })

                if (!dataSchedule) {
                    dataSchedule = [];
                }

                resolve({
                    errCode: 0,
                    data: dataSchedule
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getExtraInfoDoctorByIdService = (idInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!idInput) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required parameters !`
                })
            } else {
                let data = await db.Doctor_Info.findOne({
                    where: {
                        doctorId: idInput
                    },
                    attributes: {
                        exclude: ['id', 'doctorId']
                    },
                    include: [
                        { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: false,
                    nest: true
                })

                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    saveDetailInfoDoctor: saveDetailInfoDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateScheduleService: bulkCreateScheduleService,
    getScheduleByDateService: getScheduleByDateService,
    getExtraInfoDoctorByIdService: getExtraInfoDoctorByIdService
}