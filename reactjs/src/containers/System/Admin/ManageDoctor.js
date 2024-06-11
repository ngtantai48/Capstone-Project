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
            inputData.forEach((item) => {
                let object = {};
                let labelVi = type === 'USERS' ? `${item.lastName} ${item.firstName}` : item.valueVi;
                let labelEn = type === 'USERS' ? removeDiacritics(`${item.firstName} ${item.lastName}`) : item.valueEn;

                object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                object.value = item.id;
                result.push(object);
            });
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
            let dataSelectPrice = this.buildDataInputSelect(resPrice)
            let dataSelectPayment = this.buildDataInputSelect(resPayment)
            let dataSelectProvince = this.buildDataInputSelect(resProvince)

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
                action: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE
            });
        }
    }

    handleChangeSelect = async (selectedOption) => {
        this.setState({
            selectedOption
        });
        let res = await getDetailInfoDoctor(selectedOption.value);
        if (res && res.errCode === 0 && res.data.Markdown) {
            let markdown = res.data.Markdown
            this.setState({
                contentHTML: markdown.contentHTML,
                contentMarkdown: markdown.contentMarkdown,
                description: markdown.description,
                hasOldData: true
            })
        } else {
            this.setState({
                contentHTML: '',
                contentMarkdown: '',
                description: '',
                hasOldData: false
            })
        }
    };

    handleOnChangeDesc = (event) => {
        this.setState({
            description: event.target.value
        })
    }

    handleDeleteInfo = () => {
        this.setState({
            contentHTML: '',
            contentMarkdown: '',
            description: '',
            selectedOption: '',
            hasOldData: false
        })
    }

    render() {
        let { selectedOption, description, listDoctors, hasOldData, listPrice, listPayment, listProvince } = this.state;
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
                            placeholder={'Chon bac si'}
                        />
                    </div>
                    <div className='content-right'>
                        <label><FormattedMessage id='detail-doctor.introduction' /></label>
                        <textarea
                            className='form-control mt-2'
                            rows={4}
                            onChange={(event) => { this.handleOnChangeDesc(event) }}
                            value={description}
                        >
                        </textarea>
                    </div>
                </div>
                <div className='more-info-extra row' style={{ width: '50%' }}>
                    <div className='col-4 form-group'>
                        <label>Chon gia</label>
                        <Select
                            className='mt-2'
                            // value={selectedOption}
                            // onChange={this.handleChangeSelect}
                            options={listPrice}
                            placeholder={'Chon gia'}
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label>Chon phuong thuc thanh toan</label>
                        <Select
                            className='mt-2'
                            // value={selectedOption}
                            // onChange={this.handleChangeSelect}
                            options={listPayment}
                            placeholder={'Chon phuong thuc thanh toan'}
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label>Chon tinh thanh</label>
                        <Select
                            className='mt-2'
                            // value={selectedOption}
                            // onChange={this.handleChangeSelect}
                            options={listProvince}
                            placeholder={'Chon tinh thanh'}
                        />
                    </div>
                    <div className='col-4 form-group mt-4'>
                        <label>Ten phong kham</label>
                        <input className='form-control mt-2'></input>
                    </div>
                    <div className='col-4 form-group mt-4'>
                        <label>Dia chi phong kham</label>
                        <input className='form-control mt-2'></input>
                    </div>
                    <div className='col-4 form-group mt-4'>
                        <label>Ghi chu</label>
                        <input className='form-control mt-2'></input>
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
                <div>
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
