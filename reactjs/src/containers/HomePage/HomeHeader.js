import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomeHeader.scss';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../utils';
import { withRouter } from 'react-router'

import { changeLanguageApp } from '../../store/actions';

class HomeHeader extends Component {

    changeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language)
    }

    returnToHome = () => {
        if (this.props.history) {
            this.props.history.push('/home')
        }
    }

    render() {
        let language = this.props.language;
        return (
            <React.Fragment>
                <div className='home-header-container'>
                    <div className='home-header-content'>
                        <div className='left-content'>
                            <i className="fa-solid fa-bars"></i>
                            <div className='header-logo' onClick={() => this.returnToHome()}></div>
                        </div>
                        <div className='center-content'>
                            <div className='child-content'>
                                <div><b><FormattedMessage id='home-header.specialty' /></b></div>
                                <div className='subs-title'><FormattedMessage id='home-header.search-doctor' /></div>
                            </div>
                            <div className='child-content'>
                                <div><b><FormattedMessage id='home-header.health-facility' /></b></div>
                                <div className='subs-title'><FormattedMessage id='home-header.select-room' /></div>
                            </div>
                            <div className='child-content'>
                                <div><b><FormattedMessage id='home-header.doctor' /></b></div>
                                <div className='subs-title'><FormattedMessage id='home-header.select-doctor' /></div>
                            </div>
                            <div className='child-content'>
                                <div><b><FormattedMessage id='home-header.fee' /></b></div>
                                <div className='subs-title'><FormattedMessage id='home-header.check-health' /></div>
                            </div>
                        </div>
                        <div className='right-content'>
                            {/* <div className='support'><span><i className="fa-solid fa-headset"></i><FormattedMessage id='home-header.support' /></span></div> */}
                            {/* <div className={language === LANGUAGES.VI ? 'language-vi active' : 'language-vi'}><span onClick={() => { this.changeLanguage(LANGUAGES.VI) }}>VI</span></div> */}
                            {/* <div className={language === LANGUAGES.EN ? 'language-en active' : 'language-en'}><span onClick={() => { this.changeLanguage(LANGUAGES.EN) }}>EN</span></div> */}
                            <span className='support'><i className="fa-solid fa-headset"></i><FormattedMessage id='home-header.support' /></span>
                            <span className={language === LANGUAGES.VI ? 'language-vi active' : 'language-vi'} onClick={() => { this.changeLanguage(LANGUAGES.VI) }}>VI</span>
                            <span className={language === LANGUAGES.EN ? 'language-en active' : 'language-en'} onClick={() => { this.changeLanguage(LANGUAGES.EN) }}>EN</span>
                        </div>
                    </div>
                </div>

                {this.props.isShowBanner === true &&
                    <div className='home-header-banner'>
                        <div className='content-up'>
                            <div className='title1'><FormattedMessage id='banner.title1' /></div>
                            <div className='title2'><FormattedMessage id='banner.title2' /></div>
                            <div className='search'>
                                <i className="fa-solid fa-magnifying-glass"></i>
                                <input type='text' placeholder='Tìm chuyên khoa khám bệnh' />
                            </div>
                        </div>
                        <div className='content-down'>
                            <div className='options'>
                                <div className='option-child'>
                                    <div className='icon-child'><i className="fa-solid fa-hospital"></i></div>
                                    <div className='text-child'><FormattedMessage id='banner.child1' /></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'><i className="fa-solid fa-truck-medical"></i></div>
                                    <div className='text-child'><FormattedMessage id='banner.child2' /></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'><i className="fa-solid fa-hospital-user"></i></div>
                                    <div className='text-child'><FormattedMessage id='banner.child3' /></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'><i className="fa-solid fa-microscope"></i></div>
                                    <div className='text-child'><FormattedMessage id='banner.child4' /></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'><i className="fa-solid fa-user-doctor"></i></div>
                                    <div className='text-child'><FormattedMessage id='banner.child5' /></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'><i className="fa-solid fa-tooth"></i></div>
                                    <div className='text-child'><FormattedMessage id='banner.child6' /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader));
