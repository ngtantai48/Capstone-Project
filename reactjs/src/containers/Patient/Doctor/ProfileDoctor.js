import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ProfileDoctor.scss'
import { FormattedMessage } from 'react-intl'
import { LANGUAGES } from '../../../utils';
import { getProfileDoctorById } from '../../../services/userService';
import { NumericFormat } from 'react-number-format';
import _ from 'lodash'
import moment from 'moment';

class ProfileDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataProfile: {}
        }
    }

    async componentDidMount() {
        let data = await this.getInfoDoctor(this.props.doctorId);
        this.setState({
            dataProfile: data
        })
    }

    getInfoDoctor = async (id) => {
        let result = {};
        if (id) {
            let res = await getProfileDoctorById(id)
            if (res && res.errCode === 0) {
                result = res.data;
            }
        }
        return result;
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        let { language, doctorId } = this.props;
        if (prevProps.language !== language) {

        }
        if (prevProps.doctorId !== doctorId) {
            // this.getInfoDoctor(this.props.doctorId)
        }
    }

    formatDescription = (description) => {
        return description.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
    }

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    renderTimeBooking = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {

            let time = language === LANGUAGES.VI ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn

            let date = language === LANGUAGES.VI
                ? this.capitalizeFirstLetter(moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY'))
                : moment.unix(+dataTime.date / 1000).locale('en').format('ddd - MM/DD/YYYY')

            return (
                <>
                    <div>{date}<br /> {time} </div>
                    <div className='mt-4'>
                        <i><FormattedMessage id='patient.booking-modal.booking-free' /></i>
                    </div>
                </>
            )
        }
        return <></>
    }

    render() {
        let { dataProfile } = this.state;
        let { language, isShowDescriptionDoctor, dataTime } = this.props;

        let nameVi = '', nameEn = '';
        if (dataProfile && dataProfile.positionData) {
            nameVi = `${dataProfile.positionData.valueVi}, ${dataProfile.lastName} ${dataProfile.firstName}`;
            nameEn = `${dataProfile.positionData.valueEn}, ${dataProfile.firstName} ${dataProfile.lastName}`;
        }

        return (
            <div className='profile-doctor-container'>
                <div className='intro-doctor'>
                    <div
                        className='content-left'
                        style={{ backgroundImage: `url(${dataProfile && dataProfile.image ? dataProfile.image : ''})` }}
                    >
                    </div>
                    <div className='content-right'>
                        <div className='up'>
                            {language === LANGUAGES.VI ? nameVi : nameEn}
                        </div>
                        <div className='down'>
                            {isShowDescriptionDoctor === true ?
                                <>
                                    {dataProfile && dataProfile.Markdown && dataProfile.Markdown.description &&
                                        <span>
                                            {this.formatDescription(dataProfile.Markdown.description)}
                                        </span>
                                    }
                                </>
                                :
                                <>
                                    {this.renderTimeBooking(dataTime)}
                                </>
                            }
                        </div>
                    </div>
                </div>
                <div className='price'>
                    <FormattedMessage id='patient.booking-modal.examination-fee' />
                    {
                        dataProfile?.Doctor_Info && (
                            <NumericFormat
                                className='numeric-format'
                                value={
                                    language === LANGUAGES.VI
                                        ? dataProfile.Doctor_Info.priceTypeData.valueVi
                                        : language === LANGUAGES.EN
                                            ? dataProfile.Doctor_Info.priceTypeData.valueEn
                                            : ''
                                }
                                displayType="text"
                                thousandSeparator=","
                                suffix={language === LANGUAGES.VI ? ' VND' : ' $'}
                            />
                        )
                    }
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);
