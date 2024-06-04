import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ManageSchedule.scss'
import { FormattedMessage } from 'react-intl'
import Select from 'react-select';
import * as actions from '../../../store/actions';
import { CRUD_ACTIONS, LANGUAGES, dateFormat } from '../../../utils';
import DatePicker from '../../../components/Input/DatePicker';
import moment from 'moment';
import { toast } from 'react-toastify';
import _ from 'lodash';
import { saveBulkScheduleDoctor } from '../../../services/userService';

class ManageSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listDoctors: [],
            selectedDoctor: {},
            currentDate: '',
            rangeTime: []
        }
    }


    async componentDidMount() {
        await this.props.fetchAllDoctorsRedux();
        await this.props.fetchAllScheduleTimeRedux()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let { allDoctors, language, allScheduleTime } = this.props;

        if (prevProps.allDoctors !== allDoctors || prevProps.language !== language) {
            let dataSelect = this.buildDataInputSelect(allDoctors)
            this.setState({
                listDoctors: dataSelect
            })
        }

        if (prevProps.allScheduleTime !== allScheduleTime) {
            let data = allScheduleTime;
            if (data && data.length > 0) {
                data = data.map(item => ({
                    ...item,
                    isSelected: false
                }))
            }
            this.setState({
                rangeTime: data
            })
        }
    }

    buildDataInputSelect = (inputData) => {
        let result = [];
        let { language } = this.props;

        if (inputData && inputData.length > 0) {
            inputData.forEach((item) => {
                let object = {};
                let labelVi = `${item.lastName} ${item.firstName}`;
                let labelEn = `${item.firstName} ${item.lastName}`;

                object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                object.value = item.id;
                result.push(object);
            });
        }
        return result;
    }

    handleChangeSelect = async (selectedOption) => {
        this.setState({
            selectedDoctor: selectedOption,
        });
    };

    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        })
    }

    handleClickBtnTime = (time) => {
        let { rangeTime } = this.state;

        if (rangeTime && rangeTime.length > 0) {
            rangeTime = rangeTime.map((item) => {
                if (item.id === time.id) {
                    item.isSelected = !item.isSelected;
                }
                return item;
            })
            this.setState({
                rangeTime: rangeTime,
            });
        }
    }

    handleSaveSchedule = async () => {
        let { rangeTime, selectedDoctor, currentDate } = this.state;
        let result = [];

        if (selectedDoctor && _.isEmpty(selectedDoctor)) {
            if (this.props.language === LANGUAGES.EN) {
                toast.error("Invalid selected doctor !");
            } else {
                toast.error("Bác sĩ không hợp lệ !");
            }
            return;
        }

        if (!currentDate) {
            if (this.props.language === LANGUAGES.EN) {
                toast.error("Invalid date !");
            } else {
                toast.error("Ngày không hợp lệ !");
            }
            return;
        }

        let formattedDate = new Date(currentDate).getTime();

        if (rangeTime && rangeTime.length > 0) {
            let selectedTime = rangeTime.filter((item) => item.isSelected === true)
            if (selectedTime && selectedTime.length > 0) {
                selectedTime.map((schedule) => {
                    let object = {}
                    object.doctorId = selectedDoctor.value;
                    object.date = formattedDate;
                    object.timeType = schedule.keyMap;
                    result.push(object);

                    return schedule;
                });
            } else {
                toast.error(`Invalid selected time !`)
            }
        }

        let res = await saveBulkScheduleDoctor({
            arrSchedule: result,
            doctorId: selectedDoctor.value,
            formattedDate: formattedDate
        });

        if (res && res.errCode === 0) {
            if (this.props.language === LANGUAGES.EN) {
                toast.success("Save schedule succeed !");
            } else {
                toast.success("Lưu lịch khám thành công !");
            }
        } else {
            if (this.props.language === LANGUAGES.EN) {
                toast.error("Save schedule failed !");
            } else {
                toast.error("Lưu lịch khám thất bại !");
            }
        }
    }

    render() {
        let { listDoctors, selectedDoctor, rangeTime } = this.state;
        let { language } = this.props

        return (
            <div className='manage-schedule-container'>
                <div className='m-s-title'>
                    <FormattedMessage id='manage-schedule.title' />
                </div>
                <div className='container'>
                    <div className='row'>
                        <div className='col-6 form-group'>
                            <label><FormattedMessage id='manage-schedule.choose-doctor' /></label>
                            <Select
                                className='my-2'
                                value={selectedDoctor}
                                onChange={this.handleChangeSelect}
                                options={listDoctors}
                            />
                        </div>
                        <div className='col-6 form-group'>
                            <label><FormattedMessage id='manage-schedule.choose-date' /></label>
                            <DatePicker
                                className='form-control my-2'
                                onChange={this.handleOnChangeDatePicker}
                                value={this.state.currentDate}
                                minDate={new Date()}
                            ></DatePicker>
                        </div>
                        <div className='col-12 pick-hour-container my-4'>
                            {rangeTime && rangeTime.length > 0 &&
                                rangeTime.map((item, index) => {
                                    return (
                                        <button
                                            className={item.isSelected === true ? 'btn-schedule btn btn-warning my-3 active' : 'btn-schedule btn btn-warning my-3'}
                                            key={index}
                                            onClick={() => this.handleClickBtnTime(item)}
                                        >
                                            {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                        </button>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <button className='btn btn-primary mt-2' onClick={() => this.handleSaveSchedule()}><FormattedMessage id='manage-schedule.save' /></button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        allDoctors: state.admin.allDoctors,
        allScheduleTime: state.admin.allScheduleTime
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllDoctorsRedux: () => dispatch(actions.fetchAllDoctors()),
        fetchAllScheduleTimeRedux: () => dispatch(actions.fetchAllScheduleTime()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
