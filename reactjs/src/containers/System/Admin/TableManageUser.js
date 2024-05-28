import React, { Component } from 'react';
import { connect } from 'react-redux';
import './TableManageUser.scss';
import * as actions from '../../../store/actions';


class TableManageUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usersRedux: []
        }
    }

    componentDidMount() {
        this.props.fetchUserRedux()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.listUsers !== this.props.listUsers) {
            this.setState({
                usersRedux: this.props.listUsers
            })
        }
    }

    handleDeleteUser = (user) => {
        this.props.deleteAUserRedux(user.id);
    }

    handleEditUser = (user) => {
        this.props.handleEditUserFromParentKey(user)
    }

    render() {
        // console.log('check user: ', this.props.listUsers)
        // console.log('check state: ', this.state.usersRedux)
        let arrUsers = this.state.usersRedux
        return (
            <table id='TableManageUser'>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Phone Number</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                {arrUsers && arrUsers.length > 0 &&
                    arrUsers.map((item, index) => {
                        return (
                            <tbody>
                                <tr key={index}>
                                    <td>{item.email}</td>
                                    <td>{item.firstName}</td>
                                    <td>{item.lastName}</td>
                                    <td>{item.phoneNumber}</td>
                                    <td>{item.address}</td>
                                    <td>
                                        <button onClick={() => { this.handleEditUser(item) }} className='btn-edit'><i className="fa-solid fa-pencil"></i></button>
                                        <button onClick={() => { this.handleDeleteUser(item) }} className='btn-delete'><i className="fa-solid fa-trash-can"></i></button>
                                    </td>
                                </tr>
                            </tbody>
                        )
                    })
                }
            </table>
        );
    }
}

const mapStateToProps = state => {
    return {
        listUsers: state.admin.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchUserRedux: () => {
            dispatch(actions.fetchAllUsersStart())
        },
        deleteAUserRedux: (id) => dispatch(actions.deleteAUser(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);