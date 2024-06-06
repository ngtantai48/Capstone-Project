import React, { Component } from 'react';
import { connect } from 'react-redux';
import './DoctorSchedule.scss'
import moment from 'moment';
import localization from 'moment/locale/vi'
import { LANGUAGES } from '../../../utils';
import { getScheduleDoctorByDate } from '../../../services/userService';

class DoctorSchedule extends Component {

    constructor(props) {
        super(props);
        this.state = {
            allDays: [],
            allAvailableTime: []
        }
    }

    async componentDidMount() {
        let { language } = this.props;

        // console.log('moment vi: ', moment(new Date()).format('dddd - DD/MM'));
        // console.log('moment en: ', moment(new Date()).locale('en').format('dddd - DD/MM'));
        this.setArrDays(language);
    }

    setArrDays = (language) => {
        let allDays = []

        for (let i = 0; i < 7; i++) {
            let object = {};
            let day = moment(new Date()).add(i, 'days');

            if (i === 0) {
                if (language === LANGUAGES.VI) {
                    object.label = "Hôm nay - " + day.format('DD/MM');
                } else {
                    object.label = "Today - " + day.format('DD/MM');
                }
            } else {
                if (language === LANGUAGES.VI) {
                    object.label = this.capitalizeFirstLetter(day.format('dddd - DD/MM'));
                } else {
                    object.label = this.capitalizeFirstLetter(day.locale('en').format('ddd - DD/MM'));
                }
            }

            object.value = day.startOf('day').valueOf();
            allDays.push(object);
        }
        this.setState({
            allDays: allDays,
        })
    }

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
            this.setArrDays(this.props.language);
        }
    }

    handleOnChangeSelect = async (event) => {
        if (this.props.doctorIdFromParent && this.props.doctorIdFromParent !== -1) {
            let doctorId = this.props.doctorIdFromParent;
            let date = event.target.value;
            let res = await getScheduleDoctorByDate(doctorId, date);
            console.log('check res react: ', res)

            if (res && res.errCode === 0) {
                this.setState({
                    allAvailableTime: res.data ? res.data : []
                })
            }

        }
    }

    render() {
        let { allDays, allAvailableTime } = this.state;
        let { language } = this.props;

        return (
            <div className='doctor-schedule-container'>
                <div className='all-schedule'>
                    <select className='form-select' onChange={(event) => this.handleOnChangeSelect(event)}>
                        {allDays && allDays.length > 0 && allDays.map((item, index) => {
                            return (
                                <option value={item.value} key={index}>{item.label}</option>
                            )
                        })}
                    </select>
                </div>
                <div className='all-available-time'>
                    <div className='text-calendar my-3'>
                        <span><i className="fa-solid fa-calendar-days mx-2"></i>Lịch khám</span>
                    </div>
                    <div className='time-content'>
                        {allAvailableTime && allAvailableTime.length > 0 ?
                            allAvailableTime.map((item, index) => {
                                let timeDisplay = language === LANGUAGES.VI ? item.timeTypeData.valueVi : item.timeTypeData.valueEn
                                return (
                                    <button className='btn btn-secondary mx-2 my-2' key={index}>{timeDisplay}</button>
                                )
                            }) :
                            <div className='mx-2 my-4'>
                                Bac si khong co lich hen trong thoi gian nay, vui long chon thoi gian khac
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language
    }
};

const mapDispatchToProps = (dispatch) => {
    // Bạn có thể thêm các hành động Redux nếu cần
    return {

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
