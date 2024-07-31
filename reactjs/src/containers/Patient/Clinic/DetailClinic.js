import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl'
import { LANGUAGES } from '../../../utils';
import './DetailClinic.scss';
import HomeHeader from '../../HomePage/HomeHeader';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtraInfo from '../Doctor/DoctorExtraInfo';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import { getDetailClinicById, getTypeAllCode } from '../../../services/userService';
import _ from 'lodash';


class DefaultClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [],
            dataDetailClinic: {}
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;

            let res = await getDetailClinicById({
                id: id
            });

            if (res && res.errCode === 0) {
                let data = res.data;
                let arrDoctorId = [];

                if (data && !_.isEmpty(res.data)) {
                    let arr = data.doctorClinic;

                    if (arr && arr.length > 0) {
                        arr.map((item) => {
                            arrDoctorId.push(item.doctorId);
                            return item;
                        })
                    }
                }

                this.setState({
                    dataDetailClinic: res.data,
                    arrDoctorId: arrDoctorId,
                })
            }
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        let { language } = this.props;
        if (prevProps.language !== language) {

        }
    }


    render() {
        let { arrDoctorId, dataDetailClinic } = this.state;
        let { language } = this.props;

        return (
            <div className='detail-specialty-container'>
                <HomeHeader />
                <div className='description-specialty'>
                    {dataDetailClinic && !_.isEmpty(dataDetailClinic) &&
                        <>
                            <div style={{ 'font-weight': 'bold', 'font-size': '30px', 'color': '#49bce2' }}>
                                {dataDetailClinic.name}
                            </div>
                            <div className='mt-5'
                                dangerouslySetInnerHTML={{ __html: dataDetailClinic.descriptionHTML }}
                                style={{ 'width': '80%' }}
                            />
                        </>
                    }
                </div>
                <div className='detail-specialty-body pt-2 pb-2'>
                    {arrDoctorId && arrDoctorId.length > 0 && arrDoctorId.map((item, index) => {
                        return (
                            <div className='each-doctor' key={index}>
                                <div className='dt-content-left'>
                                    <div className='profile-doctor'>
                                        <ProfileDoctor
                                            doctorId={item}
                                            isShowDescriptionDoctor={true}
                                            isShowLinkDetail={true}
                                            isShowPrice={false}
                                        // dataTime={dataTime}
                                        />
                                    </div>
                                </div>
                                <div className='dt-content-right'>
                                    <div className='doctor-schedule'>
                                        <DoctorSchedule doctorIdFromParent={item} />
                                    </div>
                                    <div className='doctor-extra-info'>
                                        <DoctorExtraInfo doctorIdFromParent={item} />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div >
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

export default connect(mapStateToProps, mapDispatchToProps)(DefaultClass);
