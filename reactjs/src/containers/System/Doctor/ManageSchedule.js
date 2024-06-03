import React, { Component } from 'react';
import { connect } from 'react-redux';

class ManageSchedule extends Component {
    render() {

        return (
            <React.Fragment>
                <div>
                    Manage schedule
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    isLoggedIn: state.user.isLoggedIn
});

const mapDispatchToProps = (dispatch) => ({
    // Bạn có thể thêm các hành động Redux nếu cần
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
