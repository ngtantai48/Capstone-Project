import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import UserManage from '../containers/System/UserManage';
import ProductManage from '../containers/System/ProductManage';
import RegisterPackageGroupOrAcc from '../containers/System/RegisterPackageGroupOrAcc';

class System extends Component {
    render() {
        const { systemMenuPath } = this.props;

        return (
            <div className="system-container">
                <div className="system-list">
                    <Switch>
                        <Route path="/system/user-manage" component={UserManage} />
                        <Route path="/system/product-manage" component={ProductManage} />
                        <Route path="/system/register-package-group-or-account" component={RegisterPackageGroupOrAcc} />
                        {/* Điều hướng về `systemMenuPath` nếu không có đường dẫn phù hợp */}
                        <Route path="/" render={() => <Redirect to={systemMenuPath || '/system/user-manage'} />} />
                    </Switch>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    systemMenuPath: state.app.systemMenuPath,
});

const mapDispatchToProps = (dispatch) => ({
    // Bạn có thể thêm các hành động Redux nếu cần
});

export default connect(mapStateToProps, mapDispatchToProps)(System);
