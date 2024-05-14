import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
class RegisterPackageGroupOrAcc extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }

    }



    render() {
        return (
            <div className="text-center">
                register package group or account
            </div>)
    }

}

const mapStateToProps = state => {
    return {

    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPackageGroupOrAcc);
