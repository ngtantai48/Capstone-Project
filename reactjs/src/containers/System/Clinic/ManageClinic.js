import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl'
import { LANGUAGES, CommonUtils } from '../../../utils';
import './ManageClinic.scss';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { createNewClinic } from '../../../services/userService';
import { toast } from 'react-toastify';

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            address: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
        }
    }

    async componentDidMount() {

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        let { language } = this.props;
        if (prevProps.language !== language) {

        }
    }

    handleOnChangeInput = (event, id) => {
        let stateCopy = { ...this.state }
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy
        })
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionHTML: html,
            descriptionMarkdown: text,
        })
    }

    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imageBase64: base64
            })
        }
    }

    handleSaveNewClinic = async () => {
        console.log('check state: ', this.state);
        let res = await createNewClinic(this.state);

        if (res && res.errCode === 0) {
            toast.success('Add new clinic success!');
            this.setState({
                name: '',
                address: '',
                descriptionHTML: '',
                descriptionMarkdown: '',
                imageBase64: ''
            })
        } else {
            toast.error('Add new clinic failed!')
            console.log('check res: ', res);
        }
    }

    render() {
        let { name, descriptionMarkdown, address } = this.state;

        return (
            <div className='manage-specialty-container'>
                <div className='ms-title'><FormattedMessage id='manage-clinic.title' /></div>
                <div className='add-new-specialty row'>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id='manage-clinic.clinic-name' /></label>
                        <input className='form-control' type='text' value={name} onChange={(event) => this.handleOnChangeInput(event, 'name')}></input>
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id='manage-clinic.clinic-address' /></label>
                        <input className='form-control' type='text' value={address} onChange={(event) => this.handleOnChangeInput(event, 'address')}></input>
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id='manage-clinic.clinic-img' /></label>
                        <input className='form-control' type='file' accept="image/*" onChange={(event) => this.handleOnChangeImage(event)}></input>
                    </div>
                    <div className='col-12 mt-5'>
                        <MdEditor
                            style={{ height: '400px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={descriptionMarkdown}
                        />
                    </div>
                    <div className='col-12'>
                        <button className='btn-save-specialty btn btn-primary my-4' onClick={() => this.handleSaveNewClinic()}>
                            <FormattedMessage id='manage-clinic.save' />
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language
    }
};

const mapDispatchToProps = (dispatch) => {
    // Bạn có thể thêm các hành động Redux nếu cần
    return {

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
