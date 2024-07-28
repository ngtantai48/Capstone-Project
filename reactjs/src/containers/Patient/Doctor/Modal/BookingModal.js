import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './BookingModal.scss'
import ProfileDoctor from '../ProfileDoctor';
import _ from 'lodash';
import moment from 'moment';
import DatePicker from '../../../../components/Input/DatePicker';
import * as actions from '../../../../store/actions';
import { LANGUAGES } from '../../../../utils';
import Select from 'react-select';
import { postPatientBookAppointment } from '../../../../services/userService';
import { toast } from 'react-toastify';

class BookingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullName: '',
            phoneNumber: '',
            birthday: '',
            selectedGender: '',
            genders: '',
            email: '',
            address: '',
            reason: '',
            doctorId: '',
            timeType: ''
        }
    }

    async componentDidMount() {
        await this.props.getGenderRedux();
    }

    buildDataGender = (data) => {
        let result = [];
        let language = this.props.language;

        if (data && data.length > 0) {
            data.map((item) => {
                let object = {};
                object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
                object.value = item.keyMap;
                result.push(object);

                return item;
            })
        }
        return result;
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        let { language, genderRedux, dataTime } = this.props;

        if (prevProps.language !== language) {
            this.setState({
                genders: this.buildDataGender(genderRedux)
            })
        }

        if (prevProps.genderRedux !== genderRedux) {
            this.setState({
                genders: this.buildDataGender(genderRedux)
            })
        }

        if (prevProps.dataTime !== dataTime) {
            if (dataTime && !_.isEmpty(dataTime)) {
                let doctorId = dataTime.doctorId;
                let timeType = dataTime.timeType;
                this.setState({
                    doctorId: doctorId,
                    timeType: timeType
                })
            }
        }
    }

    handleOnChangeInput = (event, id) => {
        let valueInput = event.target.value;
        let stateCopy = { ...this.state };
        stateCopy[id] = valueInput;
        this.setState({
            ...stateCopy
        })
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            birthday: date[0]
        })
    }

    handleChangeSelect = (selectedOption) => {
        this.setState({
            selectedGender: selectedOption
        })
    }

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    buildTimeBooking = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            let time = language === LANGUAGES.VI
                ? dataTime.timeTypeData.valueVi
                : dataTime.timeTypeData.valueEn;

            let date = language === LANGUAGES.VI
                ? this.capitalizeFirstLetter(moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY'))
                : moment.unix(+dataTime.date / 1000).locale('en').format('ddd - MM/DD/YYYY');

            return `${date}&ensp;(${time})`;
        }
        return ``;
    }

    buildDoctorName = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            let name = language === LANGUAGES.VI
                ? `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`
                : `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`;

            return name;
        }
        return ``;
    }

    handleConfirmBooking = async () => {
        //validate input
        let date = new Date(this.state.birthday).getTime();
        let timeString = this.buildTimeBooking(this.props.dataTime);
        let doctorName = this.buildDoctorName(this.props.dataTime);

        let res = await postPatientBookAppointment({
            fullName: this.state.fullName,
            phoneNumber: this.state.phoneNumber,
            date: date,
            selectedGender: this.state.selectedGender.value,
            email: this.state.email,
            address: this.state.address,
            reason: this.state.reason,
            doctorId: this.state.doctorId,
            timeType: this.state.timeType,
            language: this.props.language,
            timeString: timeString,
            doctorName: doctorName
        })

        if (res && res.errCode === 0) {
            toast.success('Booking a new appointment success!');
            this.props.closeBookingModal();
        } else {
            toast.error('Booking a new appointment error!')
        }
    }

    render() {
        let { fullName, phoneNumber, birthday, genders, selectedGender, email, address, reason } = this.state
        let { isOpenModal, closeBookingModal, dataTime } = this.props;
        let doctorId = dataTime && !_.isEmpty(dataTime) ? dataTime.doctorId : '';

        return (
            <div>
                <Modal
                    isOpen={isOpenModal}
                    className='booking-modal-container'
                    size='lg'
                    centered
                // backdrop={true}
                >
                    <div className='booking-modal-content'>
                        <div className='booking-modal-header'>
                            <span className='left'><FormattedMessage id='patient.booking-modal.title' /></span>
                            <span className='right' onClick={closeBookingModal}>
                                <i className="fa-solid fa-xmark"></i>
                            </span>
                        </div>
                        <div className='booking-modal-body'>
                            {/* {JSON.stringify(dataTime)} */}
                            <div className='doctor-info'>
                                <ProfileDoctor
                                    doctorId={doctorId}
                                    isShowDescriptionDoctor={false}
                                    dataTime={dataTime}
                                    isShowLinkDetail={false}
                                    isShowPrice={true}
                                />
                            </div>
                            <div className='row'>
                                <div className='col-6 form-group mt-4'>
                                    <label><FormattedMessage id='patient.booking-modal.fullName' /></label>
                                    <input className='form-control'
                                        value={fullName}
                                        onChange={(event) => this.handleOnChangeInput(event, 'fullName')}
                                    />

                                </div>
                                <div className='col-6 form-group mt-4'>
                                    <label><FormattedMessage id='patient.booking-modal.phoneNumber' /></label>
                                    <input className='form-control'
                                        value={phoneNumber}
                                        onChange={(event) => this.handleOnChangeInput(event, 'phoneNumber')}
                                    />
                                </div>
                                <div className='col-6 form-group mt-4'>
                                    <label><FormattedMessage id='patient.booking-modal.birthday' /></label>
                                    <DatePicker
                                        className='form-control'
                                        onChange={this.handleOnChangeDatePicker}
                                        value={birthday}
                                    // minDate={yesterday}
                                    />
                                </div>
                                <div className='col-6 form-group mt-4'>
                                    <label><FormattedMessage id='patient.booking-modal.gender' /></label>
                                    <Select
                                        value={selectedGender}
                                        onChange={this.handleChangeSelect}
                                        options={genders}
                                    />
                                </div>
                                <div className='col-6 form-group mt-4'>
                                    <label><FormattedMessage id='patient.booking-modal.email' /></label>
                                    <input className='form-control'
                                        value={email}
                                        onChange={(event) => this.handleOnChangeInput(event, 'email')}
                                    />
                                </div>
                                <div className='col-6 form-group mt-4'>
                                    <label><FormattedMessage id='patient.booking-modal.address' /></label>
                                    <input className='form-control'
                                        value={address}
                                        onChange={(event) => this.handleOnChangeInput(event, 'address')}
                                    />
                                </div>
                                <div className='col-12 form-group mt-4'>
                                    <label><FormattedMessage id='patient.booking-modal.reason' /></label>
                                    <textarea className='form-control'
                                        value={reason}
                                        onChange={(event) => this.handleOnChangeInput(event, 'reason')}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='booking-modal-footer'>
                            <div>
                                <button className='btn btn-primary me-4' onClick={() => this.handleConfirmBooking()}>
                                    <FormattedMessage id='patient.booking-modal.btnBook' />
                                </button>
                                <button className='btn btn-secondary' onClick={closeBookingModal}>
                                    <FormattedMessage id='patient.booking-modal.btnCancel' />
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
    }
};

const mapDispatchToProps = (dispatch) => {
    // Bạn có thể thêm các hành động Redux nếu cần
    return {
        getGenderRedux: () => dispatch(actions.fetchGenderStart())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
