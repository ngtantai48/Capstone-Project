import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../../utils';
import './ManagePatient.scss';
import moment from 'moment';
import DatePicker from '../../../components/Input/DatePicker';
import { getAllPatientForDoctor, postSendRemedy } from '../../../services/userService';
import { remove as removeDiacritics } from 'diacritics';
import RemedyModal from './RemedyModal';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay';


class ManagePatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: [],
            isOpenRemedyModal: false,
            dataModal: {},
            isShowLoading: false
        }
    }

    async componentDidMount() {
        this.getDataPatient()
    }

    getDataPatient = async () => {
        let { userInfo } = this.props;
        let { currentDate } = this.state;
        let formattedDate = new Date(currentDate).getTime();
        let res = await getAllPatientForDoctor({
            doctorId: userInfo.id,
            date: formattedDate
        })

        if (res && res.errCode === 0) {
            this.setState({
                dataPatient: res.data
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        let { language } = this.props;
        if (prevProps.language !== language) {

        }
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        }, async () => {
            await this.getDataPatient()
        })
    }

    handleBtnConfirm = (item) => {
        let data = {
            doctorId: item.doctorId,
            patientId: item.patientId,
            email: item.patientData.email,
            timeType: item.timeType,
            patientName: item.patientData.firstName
        }

        this.setState({
            isOpenRemedyModal: true,
            dataModal: data
        })
    }

    closeRemedyModal = () => {
        this.setState({
            isOpenRemedyModal: false,
            dataModal: {}
        })
    }

    sendRemedy = async (dataChild) => {
        let { dataModal } = this.state;
        this.setState({
            isShowLoading: true
        })
        let res = await postSendRemedy({
            email: dataChild.email,
            imgBase64: dataChild.imgBase64,
            doctorId: dataModal.doctorId,
            patientId: dataModal.patientId,
            timeType: dataModal.timeType,
            language: this.props.language,
            patientName: dataModal.patientName
        });

        if (res && res.errCode === 0) {
            this.setState({
                isShowLoading: false
            })
            toast.success('Send Remedy Success!');
            this.closeRemedyModal();
            await this.getDataPatient();
        } else {
            this.setState({
                isShowLoading: false
            })
            toast.error('Something wrong!');
            this.closeRemedyModal();
            console.log('Error send remedy: ', res);
        }
    }


    render() {
        let { dataPatient, isOpenRemedyModal, dataModal, isShowLoading } = this.state;
        let { language } = this.props

        return (
            <LoadingOverlay
                active={isShowLoading}
                spinner
                text='Loading...'
            >
                <div className='manage-patient-container'>
                    <div className='m-p-title'>
                        Quản lý bệnh nhân khám bệnh
                    </div>
                    <div className='manage-patient-body row'>
                        <div className='col-4 form-group'>
                            <label>Chọn ngày khám</label>
                            <DatePicker
                                className='form-control my-2'
                                onChange={this.handleOnChangeDatePicker}
                                value={this.state.currentDate}
                            ></DatePicker>
                        </div>
                        <div className='col-12 table-manage-patient mt-5'>
                            <table style={{ width: '100%' }}>
                                <tbody>
                                    <tr style={{ background: '#bdf6ff' }}>
                                        <th>Stt</th>
                                        <th>Thời gian</th>
                                        <th>Họ và tên</th>
                                        <th>Địa chỉ</th>
                                        <th>Giới tính</th>
                                        <th>Actions</th>
                                    </tr>
                                    {dataPatient && dataPatient.length > 0 ?
                                        dataPatient.map((item, index) => {
                                            let time = language === LANGUAGES.VI
                                                ? item.timeTypeDataPatient.valueVi
                                                : item.timeTypeDataPatient.valueEn;

                                            let gender = language === LANGUAGES.VI
                                                ? item.patientData.genderData.valueVi
                                                : item.patientData.genderData.valueEn;

                                            let name = language === LANGUAGES.VI ?
                                                item.patientData?.firstName
                                                : removeDiacritics(item.patientData?.firstName);

                                            let address = language === LANGUAGES.VI ?
                                                item.patientData.address
                                                : removeDiacritics(item.patientData.address);

                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{time}</td>
                                                    <td>{name}</td>
                                                    <td>{address}</td>
                                                    <td>{gender}</td>
                                                    <td>
                                                        <button className='btn btn-success me-4'
                                                            onClick={() => this.handleBtnConfirm(item)}>
                                                            Xác nhận
                                                        </button>
                                                        {/* <button className='btn btn-info'>Gửi hóa đơn</button> */}
                                                    </td>
                                                </tr>
                                            )
                                        })
                                        :
                                        <tr>
                                            <td colSpan={6} style={{ textAlign: 'center', color: 'red', fontSize: '15px' }}>
                                                Không có bệnh nhân khám
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <RemedyModal
                    isOpenModal={isOpenRemedyModal}
                    dataModal={dataModal}
                    closeRemedyModal={this.closeRemedyModal}
                    sendRemedy={this.sendRemedy}
                />
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        userInfo: state.user.userInfo
    }
};

const mapDispatchToProps = (dispatch) => {
    // Bạn có thể thêm các hành động Redux nếu cần
    return {

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
