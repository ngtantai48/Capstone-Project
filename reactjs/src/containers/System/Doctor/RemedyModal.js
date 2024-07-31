import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './RemedyModal.scss';
import { toast } from 'react-toastify';
import moment from 'moment';
import { CommonUtils } from '../../../utils';

class RemedyModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            imgBase64: ''
        }
    }

    async componentDidMount() {
        if (this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email
            })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.dataModal !== this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email
            })
        }
    }

    handleOnChangeEmail = (event) => {
        this.setState({
            email: event.target.value
        })
    }

    handleOnChangeImg = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imgBase64: base64
            })
        }
    }

    handleSendRemedy = () => {
        this.props.sendRemedy(this.state)
    }

    render() {
        let { isOpenModal, closeRemedyModal, dataModal, sendRemedy } = this.props;

        return (
            <div>
                <Modal
                    isOpen={isOpenModal}
                    className='booking-modal-container'
                    size='lg'
                    centered
                // backdrop={true}
                >
                    <div className='modal-header d-flex justify-content-between'>
                        <div className='modal-title'>Gửi hóa đơn khám bệnh thành công</div>
                        <button type='button'
                            className='btn-close me-1'
                            onClick={closeRemedyModal}
                            aria-label='Close'
                        ></button>
                    </div>
                    <ModalBody>
                        <div className='row'>
                            <div className='col-6'>
                                <div className='form-group'>
                                    <label>Email benh nhan</label>
                                    <input className='form-control'
                                        type='email'
                                        value={this.state.email}
                                        onChange={(event) => this.handleOnChangeEmail(event)}
                                    />
                                </div>
                            </div>
                            <div className='col-6'>
                                <label>Chon file don thuoc</label>
                                <input className='form-control'
                                    type='file'
                                    onChange={(event) => this.handleOnChangeImg(event)}
                                />
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color='primary' onClick={() => this.handleSendRemedy()}>Send</Button>
                        <Button color='secondary' onClick={closeRemedyModal}>Cancel</Button>
                    </ModalFooter>
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

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);
