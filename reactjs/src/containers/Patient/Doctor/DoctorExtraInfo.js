import React, { Component } from 'react';
import { connect } from 'react-redux';
import './DoctorExtraInfo.scss'
import { FormattedMessage } from 'react-intl'
import { LANGUAGES } from '../../../utils';

class DoctorExtraInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShowDetailInfo: false
        }
    }

    async componentDidMount() {

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        let { language } = this.props;

        if (prevProps.language !== language) {

        }
    }

    showHideDetailInfo = (status) => {
        this.setState({
            isShowDetailInfo: status
        })
    }

    render() {
        let { isShowDetailInfo } = this.state;

        return (
            <div className='doctor-extra-info-container'>
                <div className='content-up'>
                    <div className='text-address'>DIA CHI KHAM</div>
                    <div className='name-clinic'>Phong kham chuyen khoa da lieu</div>
                    <div className='detail-address'>207 Pho Hue - Ha Noi</div>
                </div>
                <div className='content-down'>
                    {isShowDetailInfo === false &&
                        <>
                            <div className='title-price my-2'>GIA KHAM: 250.000d</div>
                            <div className='show-price'>
                                <span onClick={() => this.showHideDetailInfo(true)}>
                                    Xem chi tiet
                                </span>
                            </div>
                        </>
                    }
                    {isShowDetailInfo === true &&
                        <>
                            <div className='title-price my-2'>GIA KHAM:</div>
                            <div>
                                <div className='detail-extra-info'>
                                    <div className='price pb-1'>
                                        <span className='left'>Gia kham</span>
                                        <span className='right'>250.000d</span>
                                    </div>
                                    <div className='note'>
                                        Giá khám chưa bao gồm chi phí chụp chiếu, xét nghiệm
                                    </div>
                                </div>
                                <div className='payment py-1'>
                                    Bệnh viện có thanh toán bằng hình thức tiền mặt và quẹt thẻ
                                </div>
                            </div>
                            <div className='hide-price'>
                                <span onClick={() => this.showHideDetailInfo(false)}>
                                    An bang gia
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
