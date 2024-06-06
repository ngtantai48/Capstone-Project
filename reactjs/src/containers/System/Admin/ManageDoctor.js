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
            contentMarkdown: '',
            contentHTML: '',
            selectedOption: '',
            description: '',
            hasOldData: false,

            listDoctors: []
        }
    }

    async componentDidMount() {
        await this.props.fetchAllDoctorsRedux();
    }

    buildDataInputSelect = (inputData) => {
        let result = [];
        let { language } = this.props;
        console.log('check props language: ', language)
        if (inputData && inputData.length > 0) {
            inputData.forEach((item) => {
                let object = {};
                let labelVi = `${item.lastName} ${item.firstName}`;
                let labelEn = removeDiacritics(`${item.firstName} ${item.lastName}`);

                object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                object.value = item.id;
                result.push(object);
            });
        }
        return result;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors)
            this.setState({
                listDoctors: dataSelect
            })
        }

        if (prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors)
            this.setState({
                listDoctors: dataSelect
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
        console.log('check select Doctor: ', res)
    };

    handleOnChangeDesc = (event) => {
        this.setState({
            description: event.target.value
        })
    }

    render() {
        let { selectedOption, description, listDoctors, hasOldData } = this.state;
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
                <div className='manage-doctor-editor'>
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
                            <span><FormattedMessage id='detail-doctor.save-info' /></span> : <span><FormattedMessage id='detail-doctor.create-info' /></span>
                        }
                    </button>
                </div>
            </div >
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        allDoctors: state.admin.allDoctors,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctorsRedux: () => dispatch(actions.fetchAllDoctors()),
        saveDetailDoctorRedux: (data) => dispatch(actions.saveDetailDoctor(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
