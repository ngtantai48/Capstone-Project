import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl'
// import { LANGUAGES } from '../../../utils';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './BookingModal.scss'
import ProfileDoctor from '../ProfileDoctor';
import _ from 'lodash'

class BookingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    async componentDidMount() {

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        let { language } = this.props;
        if (prevProps.language !== language) {

        }
    }

    render() {
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
                            <span className='left'>Thong tin dat lich kham benh</span>
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
                                />
                            </div>
                            <div className='row'>
                                <div className='col-6 form-group mt-4'>
                                    <label>Ho ten</label>
                                    <input className='form-control'></input>
                                </div>
                                <div className='col-6 form-group mt-4'>
                                    <label>So dien thoai</label>
                                    <input className='form-control'></input>
                                </div>
                                <div className='col-6 form-group mt-4'>
                                    <label>Dia chi email</label>
                                    <input className='form-control'></input>
                                </div>
                                <div className='col-6 form-group mt-4'>
                                    <label>Dia chi lien he</label>
                                    <input className='form-control'></input>
                                </div>
                                <div className='col-6 form-group mt-4'>
                                    <label>Ly do kham</label>
                                    <input className='form-control'></input>
                                </div>
                                <div className='col-6 form-group mt-4'>
                                    <label>Dat cho ai</label>
                                    <input className='form-control'></input>
                                </div>
                                <div className='col-6 form-group mt-4'>
                                    <label>Gioi tinh</label>
                                    <input className='form-control'></input>
                                </div>
                            </div>
                        </div>
                        <div className='booking-modal-footer'>
                            <div>
                                <button className='btn btn-primary me-4'>Xac nhan</button>
                                <button className='btn btn-secondary' onClick={closeBookingModal}>Huy</button>
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
        language: state.app.language
    }
};

const mapDispatchToProps = (dispatch) => {
    // Bạn có thể thêm các hành động Redux nếu cần
    return {

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
