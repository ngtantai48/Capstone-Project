import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from '../../../utils';
import * as actions from '../../../store/actions';
import './UserRedux.scss';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import TableManageUser from './TableManageUser';
import { Buffer } from 'buffer';


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

            action: '',
            userEditid: ''
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
                    [stateKeyName]: defaultValue && defaultValue.length > 0 ? defaultValue[0].keyMap : ''
                });
            }
        };

        defaultSelectState('genderRedux', 'genderArr', 'gender');
        defaultSelectState('positionRedux', 'positionArr', 'position');
        defaultSelectState('roleRedux', 'roleArr', 'role');

        if (prevProps.listUsers !== this.props.listUsers) {
            this.resetFormFields();
        }
    }

    resetFormFields = () => {
        const defaultValues = {
            gender: this.props.genderRedux && this.props.genderRedux.length > 0 ? this.props.genderRedux[0].keyMap : '',
            position: this.props.positionRedux && this.props.positionRedux.length > 0 ? this.props.positionRedux[0].keyMap : '',
            role: this.props.roleRedux && this.props.roleRedux.length > 0 ? this.props.roleRedux[0].keyMap : '',
        };
        this.setState({
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            avatar: '',
            previewAvaUrl: '',
            ...defaultValues,
            action: CRUD_ACTIONS.CREATE
        });
    };

    renderSelectOptions = (items) => {
        const { language } = this.props;
        return items.map((item, index) => (
            <option key={index} value={item.keyMap}>
                {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
            </option>
        ));
    }

    handleOnChangeAvatar = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewAvaUrl: objectUrl,
                avatar: base64
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
        if (!isValid)
            return;

        let { action } = this.state;
        let user = {
            email: this.state.email,
            password: this.state.password,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            phoneNumber: this.state.phoneNumber,
            address: this.state.address,
            gender: this.state.gender,
            positionId: this.state.position,
            roleId: this.state.role,
            avatar: this.state.avatar
        };

        if (action === CRUD_ACTIONS.CREATE) {
            this.props.createNewUser(user);
        }

        if (action === CRUD_ACTIONS.EDIT) {
            user.id = this.state.userEditid;
            if (!this.state.avatar) {
                delete user.avatar;
            }
            this.props.editAUserRedux(user);
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
        const fields = {
            email: language === 'en' ? 'Email' : 'Mật khẩu',
            password: language === 'en' ? 'Password' : 'Mật khẩu',
            firstName: language === 'en' ? 'First Name' : 'Tên',
            lastName: language === 'en' ? 'Last Name' : 'Họ',
            phoneNumber: language === 'en' ? 'Phone Number' : 'Số điện thoại',
            address: language === 'en' ? 'Address' : 'Địa chỉ'
        };

        for (let key in fields) {
            if (!this.state[key]) {
                let message = language === 'en' ? 'This input is required: ' : 'Ô dữ liệu cần phải nhập vào: ';
                alert(message + fields[key]);
                return false;
            }
        }

        return true;
    }

    handleEditUserFromParent = (user) => {
        let imageBase64 = '';
        if (user.image) {
            imageBase64 = new Buffer(user.image, 'base64').toString('binary');
        }
        // console.log('imageBase64: ', user.image);
        // console.log('check handle edit user FromParent: ', user)
        this.setState({
            email: user.email,
            password: 'HARDCODE',
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            address: user.address,
            gender: user.gender,
            role: user.roleId,
            position: user.positionId,
            avatar: '',
            previewAvaUrl: imageBase64,
            action: CRUD_ACTIONS.EDIT,
            userEditid: user.id
        });
    }

    handleCancelUpdate = () => {
        this.resetFormFields();
    }

    handleDelAva = () => {
        this.setState({
            previewAvaUrl: ''
        })
    }


    render() {
        const { genderArr, positionArr, roleArr } = this.state
        // console.log('check props from redux: ', this.state)
        // let isGetGenders = this.props.isLoadingGender;

        const { email, password, firstName, lastName, phoneNumber, address, gender, position, role, previewAvaUrl, action } = this.state

        return (
            <div className='user-redux-container'>
                <div className='title'>User Redux</div>
                {/* <div>
                    {isGetGenders === true ? 'Loading genders' : ''}
                </div> */}
                <div className="user-redux-body">
                    <div className='container mt-5'>
                        <div className='row'>
                            <div className='col-12 my-3'>
                                {this.state.action === CRUD_ACTIONS.EDIT ? <FormattedMessage id='manage-user.edit' /> : <FormattedMessage id='manage-user.add' />}
                            </div>
                            <div className='col-3 my-3'>
                                <label><FormattedMessage id='manage-user.email' /></label>
                                <input
                                    className='form-control'
                                    type='email'
                                    value={email}
                                    onChange={(event) => this.onChangeInput(event, 'email')}
                                    disabled={this.state.action === CRUD_ACTIONS.EDIT ? true : false}
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
                                    disabled={this.state.action === CRUD_ACTIONS.EDIT ? true : false}
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
                                <select className="form-select" onChange={(event) => this.onChangeInput(event, 'gender')} value={gender}>
                                    {this.renderSelectOptions(genderArr)}
                                </select>
                            </div>
                            <div className='col-3 my-3'>
                                <label><FormattedMessage id='manage-user.position' /></label>
                                <select className="form-select" onChange={(event) => this.onChangeInput(event, 'position')} value={position}>
                                    {this.renderSelectOptions(positionArr)}
                                </select>
                            </div>
                            <div className='col-3 my-3'>
                                <label><FormattedMessage id='manage-user.role' /></label>
                                <select className="form-select" onChange={(event) => this.onChangeInput(event, 'role')} value={role}>
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
                                    <div className="d-flex justify-content-between align-items-center">
                                        <label className="label-upload" htmlFor="previewAva">
                                            <FormattedMessage id='manage-user.upload-avatar' />
                                            <i className="fa-solid fa-upload ms-1"></i>
                                        </label>
                                        {(action === CRUD_ACTIONS.EDIT || action === CRUD_ACTIONS.CREATE) && previewAvaUrl && (
                                            <button className="btn btn-danger" onClick={() => this.handleDelAva()}>
                                                <FormattedMessage id='manage-user.del-avatar' />
                                            </button>
                                        )}
                                    </div>
                                    <div
                                        className='preview-avatar'
                                        style={{ backgroundImage: `url(${this.state.previewAvaUrl})` }}
                                        onClick={() => { this.openPreviewAvatar() }}
                                    ></div>
                                </div>
                            </div>
                            <div className='col-12 my-3'>
                                <button
                                    className={this.state.action === CRUD_ACTIONS.EDIT ? 'btn btn-warning' : 'btn btn-primary'}
                                    onClick={() => this.handleSaveUser()}
                                >
                                    <FormattedMessage id={this.state.action === CRUD_ACTIONS.EDIT ? 'manage-user.save' : 'manage-user.create'} />
                                </button>
                                {this.state.action === CRUD_ACTIONS.EDIT && (
                                    <button
                                        className='btn btn-secondary ms-3'
                                        onClick={() => this.handleCancelUpdate()}
                                    >
                                        <FormattedMessage id='manage-user.cancel' />
                                    </button>
                                )}
                            </div>
                            <div className='col-12 my-5'>
                                <TableManageUser
                                    handleEditUserFromParentKey={this.handleEditUserFromParent}
                                    action={this.state.action}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {
                    this.state.isOpen === true &&
                    <Lightbox
                        mainSrc={this.state.previewAvaUrl}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                    />
                }
            </div >
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
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
        editAUserRedux: (data) => dispatch(actions.editAUser(data)),
    }

    // processLogout: () => dispatch(actions.processLogout()),
    // changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language))
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
