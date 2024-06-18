import React, { Component } from 'react';
import { connect } from 'react-redux';
import './DoctorExtraInfo.scss'
import { FormattedMessage } from 'react-intl'
import { LANGUAGES } from '../../../utils';
import { getExtraInfoDoctorById } from '../../../services/userService';
import { NumericFormat } from 'react-number-format';
import { lang } from 'moment';

class DoctorExtraInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShowDetailInfo: false,
            extraInfo: {}
        }
    }

    async componentDidMount() {

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        let { language, doctorIdFromParent } = this.props;

        if (prevProps.language !== language) {

        }

        if (prevProps.doctorIdFromParent !== doctorIdFromParent) {
            let res = await getExtraInfoDoctorById(doctorIdFromParent);
            if (res && res.errCode === 0) {
                this.setState({
                    extraInfo: res.data
                })
            }
        }
    }

    showHideDetailInfo = (status) => {
        this.setState({
            isShowDetailInfo: status
        })
    }

    render() {
        let { isShowDetailInfo, extraInfo } = this.state;
        let { language } = this.props
        console.log('check state: ', this.state);

        return (
            <div className='doctor-extra-info-container'>
                <div className='content-up'>
                    <div className='text-address'>
                        <FormattedMessage id='patient.extra-info-doctor.text-address' />
                    </div>
                    <div className='name-clinic'>
                        {extraInfo && extraInfo.nameClinic ? extraInfo.nameClinic : ''}
                    </div>
                    <div className='detail-address'>
                        {extraInfo && extraInfo.addressClinic ? extraInfo.addressClinic : ''}
                    </div>
                </div>
                <div className='content-down'>
                    {isShowDetailInfo === false &&
                        <>
                            <div className='title-price my-2'>
                                <FormattedMessage id='patient.extra-info-doctor.price' />
                                {extraInfo && extraInfo.priceTypeData && language === LANGUAGES.VI &&
                                    <NumericFormat
                                        value={extraInfo.priceTypeData.valueVi}
                                        displayType="text"
                                        thousandSeparator=","
                                        suffix=' VND'
                                    />
                                }
                                {extraInfo && extraInfo.priceTypeData && language === LANGUAGES.EN &&
                                    <NumericFormat
                                        value={extraInfo.priceTypeData.valueEn}
                                        displayType="text"
                                        thousandSeparator=","
                                        suffix=' $'
                                    />
                                }

                            </div>
                            <div className='show-price'>
                                <span onClick={() => this.showHideDetailInfo(true)}>
                                    <FormattedMessage id='patient.extra-info-doctor.detail' />
                                </span>
                            </div>
                        </>
                    }
                    {isShowDetailInfo === true &&
                        <>
                            <div className='title-price my-2'>
                                <FormattedMessage id='patient.extra-info-doctor.price' />
                            </div>
                            <div>
                                <div className='detail-extra-info'>
                                    <div className='price pb-1'>
                                        <span className='left'>
                                            <FormattedMessage id='patient.extra-info-doctor.price' />
                                        </span>
                                        <span className='right'>
                                            {extraInfo && extraInfo.priceTypeData && (
                                                <NumericFormat
                                                    value={language === LANGUAGES.VI ? extraInfo.priceTypeData.valueVi : extraInfo.priceTypeData.valueEn}
                                                    displayType="text"
                                                    thousandSeparator=","
                                                    suffix={language === LANGUAGES.VI ? ' VND' : ' $'}
                                                />
                                            )}
                                        </span>
                                    </div>
                                    <div className='note'>
                                        {extraInfo && extraInfo.note ? extraInfo.note : ''}
                                    </div>
                                </div>
                                <div className='payment py-1'>
                                    <FormattedMessage id='patient.extra-info-doctor.payment' />
                                    {extraInfo && extraInfo.paymentTypeData ? (language === LANGUAGES.VI ? extraInfo.paymentTypeData.valueVi : extraInfo.paymentTypeData.valueEn) : ''}
                                </div>
                            </div>
                            <div className='hide-price'>
                                <span onClick={() => this.showHideDetailInfo(false)}>
                                    <FormattedMessage id='patient.extra-info-doctor.hide-price' />
                                </span>
                            </div>
                        </>
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfo);
