import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import UserManage from '../containers/System/UserManage';
import UserRedux from '../containers/System/UserRedux';
import Header from '../containers/Header/Header';

class System extends Component {
    render() {
        const { systemMenuPath, isLoggedIn } = this.props;

        return (
            <React.Fragment>
                {isLoggedIn && <Header />}
                <div className="system-container">
                    <div className="system-list">
                        <Switch>
                            <Route path="/system/user-manage" component={UserManage} />
                            <Route path="/system/user-redux" component={UserRedux} />
                            {/* Điều hướng về `systemMenuPath` nếu không có đường dẫn phù hợp */}
                            <Route path="/" render={() => <Redirect to={systemMenuPath || '/system/user-manage'} />} />
                        </Switch>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    systemMenuPath: state.app.systemMenuPath,
    isLoggedIn: state.user.isLoggedIn
});

const mapDispatchToProps = (dispatch) => ({
    // Bạn có thể thêm các hành động Redux nếu cần
});

export default connect(mapStateToProps, mapDispatchToProps)(System);
