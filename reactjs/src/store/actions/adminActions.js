import actionTypes from './actionTypes';
import {
    getTypeAllCode,
    createNewUserService,
    getAllUsers,
    deleteUserService,
    editUserService,
    getTopDoctorHomeService,
    getAllDoctors,
    saveDetailDoctorService
} from '../../services/userService';
import { toast } from "react-toastify"


export const fetchGenderStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: actionTypes.FETCH_GENDER_START
            })
            let res = await getTypeAllCode('GENDER');
            if (res && res.errCode === 0) {
                dispatch(fetchGenderSuccess(res.data))
            } else {
                dispatch(fetchGenderFailed());
            }
        } catch (error) {
            dispatch(fetchGenderFailed());
            console.log('fetchGenderStart error: ', error)
        }
    }
}

export const fetchGenderSuccess = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: genderData
})

export const fetchGenderFailed = () => ({
    type: actionTypes.FETCH_GENDER_FAILED
})



export const fetchPositionStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getTypeAllCode('POSITION');
            if (res && res.errCode === 0) {
                dispatch(fetchPositionSuccess(res.data))
            } else {
                dispatch(fetchPositionFailed());
            }
        } catch (error) {
            dispatch(fetchPositionFailed());
            console.log('fetchPositionFailed error: ', error)
        }
    }
}

export const fetchPositionSuccess = (positionData) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data: positionData
})

export const fetchPositionFailed = () => ({
    type: actionTypes.FETCH_POSITION_FAILED
})



export const fetchRoleStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getTypeAllCode('ROLE');
            if (res && res.errCode === 0) {
                dispatch(fetchRoleSuccess(res.data))
            } else {
                dispatch(fetchRoleFailed());
            }
        } catch (error) {
            dispatch(fetchRoleFailed());
            console.log('fetchRoleFailed error: ', error)
        }
    }
}

export const fetchRoleSuccess = (roleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: roleData
})

export const fetchRoleFailed = () => ({
    type: actionTypes.FETCH_ROLE_FAILED
})



export const createNewUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await createNewUserService(data);
            console.log('check create user redux: ', res)
            if (res && res.errCode === 0) {
                toast.success("Create a new user success !")
                dispatch(saveUserSuccess(res.data));
                dispatch(fetchAllUsersStart())
            } else {
                dispatch(saveUserFailed());
            }
        } catch (error) {
            dispatch(saveUserFailed());
            console.log('saveUserFailed error: ', error)
        }
    }
}

export const saveUserSuccess = () => ({
    type: actionTypes.CREATE_USER_SUCCESS
})

export const saveUserFailed = () => ({
    type: actionTypes.CREATE_USER_FAILED
})



export const fetchAllUsersStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllUsers('ALL');
            if (res && res.errCode === 0) {
                const fetchedUsers = res.users;
                const sortedUsers = fetchedUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                dispatch(fetchAllUsersSuccess(sortedUsers));
            } else {
                toast.error("Fetch all user error !")
                dispatch(fetchAllUsersFailed());
            }
        } catch (error) {
            toast.error("Fetch all user error !")
            dispatch(fetchAllUsersFailed());
            console.log('fetchAllUsersFailed error: ', error)
        }
    }
}

export const fetchAllUsersSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_USERS_SUCCESS,
    users: data
})

export const fetchAllUsersFailed = () => ({
    type: actionTypes.FETCH_ALL_USERS_FAILED
})



export const deleteAUser = (userId) => {
    return async (dispatch, getState) => {
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete this user?");
            if (confirmDelete) {
                let res = await deleteUserService(userId);
                if (res && res.errCode === 0) {
                    toast.success("Delete the user success !")
                    dispatch(deleteUserSuccess(res.data));
                    dispatch(fetchAllUsersStart())
                } else {
                    toast.error("Delete the user error !")
                    dispatch(deleteUserFailed());
                }
            }
        } catch (error) {
            toast.error("Delete the user error !")
            dispatch(deleteUserFailed());
            console.log('Delete the user error: ', error)
        }
    }
}

export const deleteUserSuccess = () => ({
    type: actionTypes.DELETE_USER_SUCCESS
})

export const deleteUserFailed = () => ({
    type: actionTypes.DELETE_USER_FAILED
})



export const editAUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await editUserService(data);
            if (res && res.errCode === 0) {
                toast.success(`Update user's info success !`)
                dispatch(editUserSuccess(res.data));
                dispatch(fetchAllUsersStart())
            } else {
                toast.error(`Update user's info error !`)
                dispatch(editUserFailed());
            }
        } catch (error) {
            toast.error(`Update user's info error !`)
            dispatch(editUserFailed());
            console.log(`Update user's info error !`, error)
        }
    }
}

export const editUserSuccess = () => ({
    type: actionTypes.EDIT_USER_SUCCESS
})

export const editUserFailed = () => ({
    type: actionTypes.EDIT_USER_FAILED
})



export const fetchTopDoctor = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getTopDoctorHomeService();
            // console.log('check res: ', res)
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_TOP_DOCTORS_SUCCESS,
                    dataDoctors: res.data
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_TOP_DOCTORS_FAILED,
                })
            }
        } catch (error) {
            console.log('FETCH_TOP_DOCTORS_FAILED: ', error)
            dispatch({
                type: actionTypes.FETCH_TOP_DOCTORS_FAILED,
            })
        }
    }
}



export const fetchAllDoctors = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllDoctors();
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTORS_SUCCESS,
                    dataDr: res.data
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTORS_FAILED,
                })
            }
        } catch (error) {
            console.log('FETCH_ALL_DOCTORS_FAILED: ', error)
            dispatch({
                type: actionTypes.FETCH_ALL_DOCTORS_FAILED,
            })
        }
    }
}

export const saveDetailDoctor = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await saveDetailDoctorService(data);
            if (res && res.errCode === 0) {
                toast.success(`Save information detail Doctor success !`)
                dispatch({
                    type: actionTypes.SAVE_DETAIL_DOCTOR_SUCCESS,
                })
            } else {
                toast.error(`Save information detail Doctor failed !`)
                dispatch({
                    type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED,
                })
            }
        } catch (error) {
            toast.error(`Save information detail Doctor failed !`)
            console.log('SAVE_DETAIL_DOCTORS_FAILED: ', error)
            dispatch({
                type: actionTypes.SAVE_DETAIL_DOCTORS_FAILED,
            })
        }
    }
}


export const fetchAllScheduleTime = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getTypeAllCode("TIME");
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS,
                    dataTime: res.data
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED,
                })
            }
        } catch (error) {
            console.log('FETCH_ALLCODE_SCHEDULE_TIME_FAILED: ', error)
            dispatch({
                type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED,
            })
        }
    }
}


export const getRequiredDoctorInfo = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: actionTypes.FETCH_REQUIRED_DOCTOR_INFO_START
            })
            let resPrice = await getTypeAllCode('PRICE');
            let resPayment = await getTypeAllCode('PAYMENT');
            let resProvince = await getTypeAllCode('PROVINCE');
            if (resPrice && resPrice.errCode === 0
                && resPayment && resPayment.errCode === 0
                && resProvince && resProvince.errCode === 0) {
                let data = {
                    resPrice: resPrice.data,
                    resPayment: resPayment.data,
                    resProvince: resProvince.data,
                }
                dispatch(fetchRequiredDoctorInfoSuccess(data))
            } else {
                dispatch(fetchRequiredDoctorInfoFailed());
            }
        } catch (error) {
            dispatch(fetchRequiredDoctorInfoFailed());
            console.log('getRequiredDoctorInfo error: ', error)
        }
    }
}

export const fetchRequiredDoctorInfoSuccess = (allRequiredData) => ({
    type: actionTypes.FETCH_REQUIRED_DOCTOR_INFO_SUCCESS,
    data: allRequiredData
})

export const fetchRequiredDoctorInfoFailed = () => ({
    type: actionTypes.FETCH_REQUIRED_DOCTOR_INFO_FAILED
})

//start doing end