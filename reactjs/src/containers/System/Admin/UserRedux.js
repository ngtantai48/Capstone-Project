import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { LANGUAGES } from '../../../utils';
import * as actions from '../../../store/actions';
import './UserRedux.scss';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

class UserRedux extends Component {
    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewAvaUrl: '',
            isOpen: false
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
        if (prevProps.genderRedux !== this.props.genderRedux) {
            this.setState({
                genderArr: this.props.genderRedux
            })
        }
        if (prevProps.positionRedux !== this.props.positionRedux) {
            this.setState({
                positionArr: this.props.positionRedux
            })
        }
        if (prevProps.roleRedux !== this.props.roleRedux) {
            this.setState({
                roleArr: this.props.roleRedux
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
    };

    handleOnChangeAvatar = (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewAvaUrl: objectUrl
            })
            console.log('check file 0: ', objectUrl)
        }

    }

    openPreviewAvatar = () => {
        if (!this.state.previewAvaUrl) return;
        this.setState({
            isOpen: true
        })
    }

    render() {
        const { genderArr, positionArr, roleArr } = this.state
        // console.log('check props from redux: ', this.state)
        // let isGetGenders = this.props.isLoadingGender;

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
                                <input className='form-control' type='email' placeholder='Enter email' />
                            </div>
                            <div className='col-3 my-3'>
                                <label><FormattedMessage id='manage-user.password' /></label>
                                <input className='form-control' type='password' placeholder='Enter password' autoComplete='' />
                            </div>
                            <div className='col-3 my-3'>
                                <label><FormattedMessage id='manage-user.first-name' /></label>
                                <input className='form-control' type='text' />
                            </div>
                            <div className='col-3 my-3'>
                                <label><FormattedMessage id='manage-user.last-name' /></label>
                                <input className='form-control' type='text' />
                            </div>
                            <div className='col-3 my-3'>
                                <label><FormattedMessage id='manage-user.phone-number' /></label>
                                <input className='form-control' type='text' />
                            </div>
                            <div className='col-9 my-3'>
                                <label><FormattedMessage id='manage-user.address' /></label>
                                <input className='form-control' type='text' />
                            </div>
                            <div className='col-3 my-3'>
                                <label><FormattedMessage id='manage-user.gender' /></label>
                                <select className="form-select">
                                    {this.renderSelectOptions(genderArr)}
                                </select>
                            </div>
                            <div className='col-3 my-3'>
                                <label><FormattedMessage id='manage-user.position' /></label>
                                <select className="form-select">
                                    {this.renderSelectOptions(positionArr)}
                                </select>
                            </div>
                            <div className='col-3 my-3'>
                                <label><FormattedMessage id='manage-user.role' /></label>
                                <select className="form-select">
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
                                <button className='btn btn-primary'><FormattedMessage id='manage-user.create' /></button>
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
        isLoadingGenderReact: state.admin.isLoadingGender
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
    }

    // processLogout: () => dispatch(actions.processLogout()),
    // changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language))
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
