import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../../utils';
import './ManagePatient.scss';
import moment from 'moment';
import DatePicker from '../../../components/Input/DatePicker';
import { getAllPatientForDoctor } from '../../../services/userService';


class ManagePatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: []
        }
    }

    async componentDidMount() {
        let { userInfo } = this.props;
        let { currentDate } = this.state;
        let formattedDate = new Date(currentDate).getTime();

        this.getDataPatient(userInfo, formattedDate)
    }

    getDataPatient = async (userInfo, formattedDate) => {
        let res = await getAllPatientForDoctor({
            doctorId: userInfo.id,
            date: formattedDate
        })
        console.log('check dataPatient: ', res);
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
        }, () => {
            let { userInfo } = this.props;
            let { currentDate } = this.state;
            let formattedDate = new Date(currentDate).getTime();

            this.getDataPatient(userInfo, formattedDate)
        })
    }

    render() {
        let { dataPatient } = this.state;

        return (
            <div className='manage-patient-container'>
                <div className='m-p-title'>
                    Quan li benh nhan kham benh
                </div>
                <div className='manage-patient-body row'>
                    <div className='col-4 form-group'>
                        <label>Chon ngay kham</label>
                        <DatePicker
                            className='form-control my-2'
                            onChange={this.handleOnChangeDatePicker}
                            value={this.state.currentDate}
                        ></DatePicker>
                    </div>
                    <div className='col-12 table-manage-patient mt-5'>
                        <table style={{ width: '100%' }}>
                            <tbody>
                                <tr>
                                    <th>Stt</th>
                                    <th>Thoi gian</th>
                                    <th>Ho va ten</th>
                                    <th>Dia chi</th>
                                    <th>Gioi tinh</th>
                                    <th>Actions</th>
                                </tr>
                                {dataPatient && dataPatient.length > 0 ?
                                    dataPatient.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.timeTypeDataPatient?.valueVi || 'N/A'}</td>
                                                <td>{item.patientData?.firstName || 'N/A'}</td>
                                                <td>{item.patientData?.address || 'N/A'}</td>
                                                <td>{item.patientData?.genderData?.valueVi || 'N/A'}</td>
                                                <td>
                                                    <button className='btn btn-success me-4'>Xac nhan</button>
                                                    <button className='btn btn-info'>Gui hoa don</button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                    :
                                    <tr className='d-flex justify-content-center'>
                                        No data
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
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
