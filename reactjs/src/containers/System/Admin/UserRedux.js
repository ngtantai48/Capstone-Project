import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { LANGUAGES } from '../../../utils';
import * as actions from '../../../store/actions';
import './UserRedux.scss';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import TableManageUser from './TableManageUser';

class UserRedux extends Component {
    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewAvaUrl: '',
            isOpen: false,

            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            gender: '',
            position: '',
            role: '',
            avatar: '',

            arrCheck: { email: '', password: '', firstName: '', lastName: '', phoneNumber: '', address: '', gender: '', position: '', role: '', avatar: '', },
        };
    }

    async componentDidMount() {
        const { getGenderStart, getPositionStart, getRoleStart } = this.props;
        await Promise.all([
            getGenderStart(),
            getPositionStart(),
            getRoleStart()
        ]);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // render => didupdate
        // hiện tại (this) và quá khứ (previous)
        // []  [3]
        // [3]  [3]
        const defaultSelectState = (propName, stateArrName, stateKeyName) => {
            if (prevProps[propName] !== this.props[propName]) {
                const defaultValue = this.props[propName];
                this.setState({
                    [stateArrName]: defaultValue,
                    [stateKeyName]: defaultValue && defaultValue.length > 0 ? defaultValue[0].key : ''
                });
            }
        };

        defaultSelectState('genderRedux', 'genderArr', 'gender');
        defaultSelectState('positionRedux', 'positionArr', 'position');
        defaultSelectState('roleRedux', 'roleArr', 'role');

        if (prevProps.listUsers !== this.props.listUsers) {
            this.setState({
                ...this.state.arrCheck
            })
        }
    }

    renderSelectOptions = (items) => {
        const { language } = this.props;
        return items.map((item, index) => (
            <option key={index} value={item.key}>
                {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
            </option>
        ));
    }

    handleOnChangeAvatar = (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewAvaUrl: objectUrl,
                avatar: file
            })
        }

    }

    openPreviewAvatar = () => {
        if (!this.state.previewAvaUrl) return;
        this.setState({
            isOpen: true
        })
    }

    handleSaveUser = () => {
        let isValid = this.checkValidateInput();
        if (!isValid) {
            return
        } else {
            //fire redux action
            this.props.createNewUser({
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                phoneNumber: this.state.phoneNumber,
                address: this.state.address,
                gender: this.state.gender,
                roleId: this.state.role,
                positionId: this.state.position
            })
        }
    }

    onChangeInput = (event, id) => {
        let copyState = { ...this.state }
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })
    }

    checkValidateInput = () => {
        const { language } = this.props;
        const arrCheckEn = {
            email: 'Email',
            password: 'Password',
            firstName: 'First Name',
            lastName: 'Last Name',
            phoneNumber: 'Phone Number',
            address: 'Address'
        };
        const arrCheckVi = {
            email: 'Email',
            password: 'Mật khẩu',
            firstName: 'Tên',
            lastName: 'Họ',
            phoneNumber: 'Số điện thoại',
            address: 'Địa chỉ'
        };
        const arrCheck = language === 'en' ? arrCheckEn : arrCheckVi;

        for (let key in arrCheck) {
            if (!this.state[key]) {
                let message = language === 'en' ? 'This input is required: ' : 'Ô dữ liệu cần phải nhập vào: ';
                alert(message + arrCheck[key]);
                return false;
            }
        }

        return true;
    }


    render() {
        const { genderArr, positionArr, roleArr } = this.state
        // console.log('check props from redux: ', this.state)
        // let isGetGenders = this.props.isLoadingGender;

        const { email, password, firstName, lastName, phoneNumber, address } = this.state

        return (
            <div className='user-redux-container'>
                <div className='title'>User Redux</div>
                {/* <div>
                    {isGetGenders === true ? 'Loading genders' : ''}
                </div> */}
                <div className="user-redux-body">
                    <div className='container mt-5'>
                        <div className='row'>
                            <div className='col-12 my-3'><FormattedMessage id='manage-user.add' /></div>
                            <div className='col-3 my-3'>
                                <label><FormattedMessage id='manage-user.email' /></label>
                                <input
                                    className='form-control'
                                    type='email'
                                    value={email}
                                    onChange={(event) => this.onChangeInput(event, 'email')}
                                />
                            </div>
                            <div className='col-3 my-3'>
                                <label><FormattedMessage id='manage-user.password' /></label>
                                <input
                                    className='form-control'
                                    type='password'
                                    autoComplete=''
                                    value={password}
                                    onChange={(event) => this.onChangeInput(event, 'password')}
                                />
                            </div>
                            <div className='col-3 my-3'>
                                <label><FormattedMessage id='manage-user.first-name' /></label>
                                <input
                                    className='form-control'
                                    type='text'
                                    value={firstName}
                                    onChange={(event) => this.onChangeInput(event, 'firstName')}
                                />
                            </div>
                            <div className='col-3 my-3'>
                                <label><FormattedMessage id='manage-user.last-name' /></label>
                                <input
                                    className='form-control'
                                    type='text'
                                    value={lastName}
                                    onChange={(event) => this.onChangeInput(event, 'lastName')}
                                />
                            </div>
                            <div className='col-3 my-3'>
                                <label><FormattedMessage id='manage-user.phone-number' /></label>
                                <input
                                    className='form-control'
                                    type='text'
                                    value={phoneNumber}
                                    onChange={(event) => this.onChangeInput(event, 'phoneNumber')}
                                />
                            </div>
                            <div className='col-9 my-3'>
                                <label><FormattedMessage id='manage-user.address' /></label>
                                <input
                                    className='form-control'
                                    type='text'
                                    value={address}
                                    onChange={(event) => this.onChangeInput(event, 'address')}
                                />
                            </div>
                            <div className='col-3 my-3'>
                                <label><FormattedMessage id='manage-user.gender' /></label>
                                <select className="form-select" onChange={(event) => this.onChangeInput(event, 'gender')}>
                                    {this.renderSelectOptions(genderArr)}
                                </select>
                            </div>
                            <div className='col-3 my-3'>
                                <label><FormattedMessage id='manage-user.position' /></label>
                                <select className="form-select" onChange={(event) => this.onChangeInput(event, 'position')}>
                                    {this.renderSelectOptions(positionArr)}
                                </select>
                            </div>
                            <div className='col-3 my-3'>
                                <label><FormattedMessage id='manage-user.role' /></label>
                                <select className="form-select" onChange={(event) => this.onChangeInput(event, 'role')}>
                                    {this.renderSelectOptions(roleArr)}
                                </select>
                            </div>
                            <div className='col-3 my-3'>
                                <label><FormattedMessage id='manage-user.avatar' /></label>
                                <div className='preview-avatar-container'>
                                    <input
                                        className='form-control'
                                        hidden
                                        id='previewAva'
                                        type='file'
                                        accept="image/*"
                                        onChange={(event) => { this.handleOnChangeAvatar(event) }}
                                    />
                                    <label className='label-upload' htmlFor='previewAva'><FormattedMessage id='manage-user.upload-avatar' /><i className="fa-solid fa-upload"></i></label>
                                    <div
                                        className='preview-avatar'
                                        style={{ backgroundImage: `url(${this.state.previewAvaUrl})` }}
                                        onClick={() => { this.openPreviewAvatar() }}
                                    ></div>
                                </div>
                            </div>
                            <div className='col-12 my-3'>
                                <button className='btn btn-primary' onClick={() => this.handleSaveUser()}><FormattedMessage id='manage-user.create' /></button>
                            </div>
                            <div className='col-12 my-5'>
                                <TableManageUser />
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.isOpen === true &&
                    <Lightbox
                        mainSrc={this.state.previewAvaUrl}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                    />
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
        positionRedux: state.admin.positions,
        roleRedux: state.admin.roles,
        isLoadingGenderReact: state.admin.isLoadingGender,
        listUsers: state.admin.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
        createNewUser: (data) => dispatch(actions.createNewUser(data)),
        fetchUserRedux: () => {
            dispatch(actions.fetchAllUsersStart())
        }
    }

    // processLogout: () => dispatch(actions.processLogout()),
    // changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language))
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
