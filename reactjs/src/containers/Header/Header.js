import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import * as actions from "../../store/actions";
import Navigator from '../../components/Navigator';
import { adminMenu } from './menuApp';
import { LANGUAGES } from '../../utils/constant'
import './Header.scss';

class Header extends Component {

    handleChangeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language)
    }

    render() {
        const { processLogout, language, userInfo } = this.props;
        // console.log('check userInfo: ', userInfo)
        return (
            <div className="header-container">
                {/* thanh navigator */}
                <div className="header-tabs-container">
                    <Navigator menus={adminMenu} />
                </div>

                <div className='languages'>
                    <span className='welcome'>
                        <FormattedMessage id='home-header.welcome' />
                        {userInfo && userInfo.firstName ? userInfo.firstName : ''} !</span>
                    <div className='languages-custom'>
                        <span title='Change the language to Vietnamese' className={language === LANGUAGES.VI ? 'language-vi active' : 'language-vi'} onClick={() => { this.handleChangeLanguage(LANGUAGES.VI) }}>VI</span>
                        <span title='Change the language to English' className={language === LANGUAGES.EN ? 'language-en active' : 'language-en'} onClick={() => { this.handleChangeLanguage(LANGUAGES.EN) }}>EN</span>
                    </div>
                    {/* nút logout */}
                    <div className="btn btn-logout" onClick={processLogout} title='Log out'>
                        <div>Log out</div>
                        <i className="fa-solid fa-right-from-bracket"></i>
                    </div>
                </div>
            </div >
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
