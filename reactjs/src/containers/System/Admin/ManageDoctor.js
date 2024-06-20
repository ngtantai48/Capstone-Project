import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ManageDoctor.scss';
import { FormattedMessage } from 'react-intl'
import * as actions from '../../../store/actions';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import Select from 'react-select';
import { CRUD_ACTIONS, LANGUAGES } from '../../../utils';
import { getDetailInfoDoctor } from '../../../services/userService';
import { remove as removeDiacritics } from 'diacritics';

const mdParser = new MarkdownIt(/* Markdown-it options */);


class ManageDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // save to Markdown table
            contentMarkdown: '',
            contentHTML: '',
            selectedOption: '',
            description: '',
            hasOldData: false,
            listDoctors: [],

            // save to doctor_info table
            listPrice: [],
            listPayment: [],
            listProvince: [],
            selectedPrice: '',
            selectedPayment: '',
            selectedProvince: '',
            nameClinic: '',
            addressClinic: '',
            note: ''
        }
    }

    async componentDidMount() {
        await this.props.fetchAllDoctorsRedux();
        await this.props.getRequiredDoctorInfoRedux();
    }

    buildDataInputSelect = (inputData, type) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            if (type === 'USERS') {
                inputData.forEach((item) => {
                    let object = {};
                    let labelVi = `${item.lastName} ${item.firstName}`;
                    let labelEn = removeDiacritics(`${item.firstName} ${item.lastName}`);
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.id;
                    result.push(object);
                });
            }

            if (type === 'PRICE') {
                inputData.forEach((item) => {
                    let object = {};
                    let labelVi = `${item.valueVi}`;
                    let labelEn = `${item.valueEn} USD`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                    result.push(object);
                });
            }

            if (type === 'PAYMENT' || type === 'PROVINCE') {
                inputData.forEach((item) => {
                    let object = {};
                    let labelVi = `${item.valueVi}`;
                    let labelEn = `${item.valueEn}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                    result.push(object);
                });
            }
        }
        return result;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let { allDoctors, language, allRequiredDoctorInfo } = this.props;

        if (prevProps.allDoctors !== allDoctors || prevProps.language !== language) {
            let dataSelect = this.buildDataInputSelect(allDoctors, 'USERS')

            this.setState({
                listDoctors: dataSelect
            })
        }

        if (prevProps.allRequiredDoctorInfo !== allRequiredDoctorInfo || prevProps.language !== language) {
            let { resPrice, resPayment, resProvince } = allRequiredDoctorInfo
            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE')
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT')
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE')

            this.setState({
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince
            })
        }
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHTML: html,
        })
    }

    handleSaveContentMarkdown = () => {
        let { hasOldData } = this.state;
        if (this.state.selectedOption && this.state.selectedOption.value) {
            this.props.saveDetailDoctorRedux({
                contentHTML: this.state.contentHTML,
                contentMarkdown: this.state.contentMarkdown,
                description: this.state.description,
                doctorId: this.state.selectedOption.value,
                action: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,

                selectedPrice: this.state.selectedPrice.value,
                selectedPayment: this.state.selectedPayment.value,
                selectedProvince: this.state.selectedProvince.value,
                nameClinic: this.state.nameClinic,
                addressClinic: this.state.addressClinic,
                note: this.state.note
            });

            this.setState({
                contentHTML: '',
                contentMarkdown: '',
                description: '',
                selectedOption: '',
                hasOldData: false,
                selectedPrice: '',
                selectedPayment: '',
                selectedProvince: '',
                nameClinic: '',
                addressClinic: '',
                note: ''
            })
        }
    }

    handleChangeSelect = async (selectedOption) => {
        this.setState({
            selectedOption
        });
        let { listPayment, listPrice, listProvince } = this.state;

        let res = await getDetailInfoDoctor(selectedOption.value);
        if (res && res.errCode === 0 && res.data.Markdown) {
            let markdown = res.data.Markdown;

            let addressClinic = '', nameClinic = '', note = '', paymentId = '', priceId = '', provinceId = '',
                selectedPrice = '', selectedProvince = '', selectedPayment = '';
            if (res.data.Doctor_Info) {
                addressClinic = res.data.Doctor_Info.addressClinic;
                nameClinic = res.data.Doctor_Info.nameClinic;
                note = res.data.Doctor_Info.note;
                priceId = res.data.Doctor_Info.priceId;
                provinceId = res.data.Doctor_Info.provinceId;
                paymentId = res.data.Doctor_Info.paymentId;

                selectedPrice = listPrice.find((item) => {
                    return item && item.value === priceId
                })
                selectedProvince = listProvince.find((item) => {
                    return item && item.value === provinceId
                })
                selectedPayment = listPayment.find((item) => {
                    return item && item.value === paymentId
                })
            }

            this.setState({
                contentHTML: markdown.contentHTML,
                contentMarkdown: markdown.contentMarkdown,
                description: markdown.description,
                hasOldData: true,
                addressClinic: addressClinic,
                nameClinic: nameClinic,
                note: note,
                selectedPrice: selectedPrice,
                selectedProvince: selectedProvince,
                selectedPayment: selectedPayment
            })
        } else {
            this.setState({
                contentHTML: '',
                contentMarkdown: '',
                description: '',
                hasOldData: false,
                addressClinic: '',
                nameClinic: '',
                note: '',
                selectedPrice: '',
                selectedProvince: '',
                selectedPayment: ''
            })
        }
    };

    handleChangeSelectDoctorInfo = async (selectedOption, name) => {
        let stateName = name.name;
        let stateCopy = {
            ...this.state
        };
        stateCopy[stateName] = selectedOption;

        this.setState({
            ...stateCopy
        })
    }

    handleOnChangeText = (event, id) => {
        let stateCopy = { ...this.state };
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy
        })
    }

    handleDeleteInfo = () => {
        this.setState({
            contentHTML: '',
            contentMarkdown: '',
            description: '',
            selectedOption: '',
            hasOldData: false,
            selectedPrice: '',
            selectedPayment: '',
            selectedProvince: '',
            nameClinic: '',
            addressClinic: '',
            note: ''
        })
    }

    render() {
        let { selectedOption, description, listDoctors, hasOldData,
            listPrice, listPayment, listProvince,
            selectedPrice, selectedPayment, selectedProvince,
            nameClinic, addressClinic, note
        } = this.state;

        console.log('check state: ', this.state);

        return (
            <div className='manage-doctor-container'>
                <div className='manage-doctor-title'><FormattedMessage id='detail-doctor.title' /></div>
                <div className='more-infor my-5'>
                    <div className='content-left'>
                        <label><FormattedMessage id='detail-doctor.choose-doctor' /></label>
                        <Select
                            className='mt-2'
                            value={selectedOption}
                            onChange={this.handleChangeSelect}
                            options={listDoctors}
                            placeholder={<FormattedMessage id='detail-doctor.select-doctor' />}
                        />
                    </div>
                    <div className='content-right'>
                        <label><FormattedMessage id='detail-doctor.introduction' /></label>
                        <textarea
                            className='form-control mt-2'
                            rows={4}
                            onChange={(event) => { this.handleOnChangeText(event, 'description') }}
                            value={description}
                        >
                        </textarea>
                    </div>
                </div>
                <div className='more-info-extra row'>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id='manage-doctor.price' /></label>
                        <Select
                            className='mt-2'
                            value={selectedPrice}
                            onChange={this.handleChangeSelectDoctorInfo}
                            options={listPrice}
                            placeholder={<FormattedMessage id='manage-doctor.select-price' />}
                            name='selectedPrice'
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id='manage-doctor.payment' /></label>
                        <Select
                            className='mt-2'
                            value={selectedPayment}
                            onChange={this.handleChangeSelectDoctorInfo}
                            options={listPayment}
                            placeholder={<FormattedMessage id='manage-doctor.select-payment' />}
                            name='selectedPayment'
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id='manage-doctor.province' /></label>
                        <Select
                            className='mt-2'
                            value={selectedProvince}
                            onChange={this.handleChangeSelectDoctorInfo}
                            options={listProvince}
                            placeholder={<FormattedMessage id='manage-doctor.select-province' />}
                            name='selectedProvince'
                        />
                    </div>
                    <div className='col-4 form-group mt-4'>
                        <label><FormattedMessage id='manage-doctor.name-clinic' /></label>
                        <input
                            className='form-control mt-2'
                            onChange={(event) => { this.handleOnChangeText(event, 'nameClinic') }}
                            value={nameClinic}
                        />
                    </div>
                    <div className='col-4 form-group mt-4'>
                        <label><FormattedMessage id='manage-doctor.address-clinic' /></label>
                        <input
                            className='form-control mt-2'
                            onChange={(event) => { this.handleOnChangeText(event, 'addressClinic') }}
                            value={addressClinic}
                        />
                    </div>
                    <div className='col-4 form-group mt-4'>
                        <label><FormattedMessage id='manage-doctor.note' /></label>
                        <input
                            className='form-control mt-2'
                            onChange={(event) => { this.handleOnChangeText(event, 'note') }}
                            value={note}
                        />
                    </div>
                </div>
                <div className='manage-doctor-editor mt-5'>
                    <MdEditor
                        style={{ height: '500px' }}
                        renderHTML={text => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                        value={this.state.contentMarkdown}
                    />
                </div>
                <div className='btn-detail-doctor'>
                    <button
                        className={hasOldData === true ? 'btn btn-warning my-5' : 'btn btn-primary my-5'}
                        onClick={() => this.handleSaveContentMarkdown()}
                    >
                        {hasOldData === true ?
                            <span><FormattedMessage id='detail-doctor.save-info' /></span>
                            :
                            <span><FormattedMessage id='detail-doctor.create-info' /></span>
                        }
                    </button>
                    {hasOldData === true &&
                        <button
                            className='btn btn-secondary mx-5'
                            onClick={() => this.handleDeleteInfo()}
                        >
                            <span><FormattedMessage id='detail-doctor.delete-info' /></span>
                        </button>
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        allDoctors: state.admin.allDoctors,
        allRequiredDoctorInfo: state.admin.allRequiredDoctorInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctorsRedux: () => dispatch(actions.fetchAllDoctors()),
        saveDetailDoctorRedux: (data) => dispatch(actions.saveDetailDoctor(data)),
        getRequiredDoctorInfoRedux: () => dispatch(actions.getRequiredDoctorInfo()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
