import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { LANGUAGES } from '../../../utils';
import * as actions from '../../../store/actions'

class UserRedux extends Component {
    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            // positionArr: [],
            // roleArr: []
        };
    }

    async componentDidMount() {
        this.props.getGenderStart();
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
    }

    // renderSelectOptions = (items) => {
    //     const { language } = this.props;
    //     return items.map((item, index) => (
    //         <option key={index} value={item.key}>
    //             {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
    //         </option>
    //     ));
    // };

    render() {
        let genders = this.state.genderArr;
        let language = this.props.language;
        // const { genderArr, positionArr, roleArr } = this.state;

        console.log('check props from redux: ', this.state.genderArr)

        return (
            <div className='user-redux-container'>
                <div className='title'>User Redux</div>
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
                                    {genders && genders.length > 0 && genders.map((item, index) => {
                                        return (
                                            <option key={index}>
                                                {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                            </option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div className='col-3 my-3'>
                                <label><FormattedMessage id='manage-user.position' /></label>
                                <select className="form-select">
                                    <option selected>Choose...</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </select>
                            </div>
                            <div className='col-3 my-3'>
                                <label><FormattedMessage id='manage-user.role' /></label>
                                <select className="form-select">
                                    <option selected>Choose...</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </select>
                            </div>
                            <div className='col-3 my-3'>
                                <label><FormattedMessage id='manage-user.avatar' /></label>
                                <input type='text' className='form-control'></input>
                            </div>
                            <div className='col-12 my-3'>
                                <button className='btn btn-primary'><FormattedMessage id='manage-user.create' /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart())
    }

    // processLogout: () => dispatch(actions.processLogout()),
    // changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language))
};


export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
