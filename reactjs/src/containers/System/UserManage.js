import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage.scss';
import { getAllUsers } from '../../services/userService';
import ModalUser from './ModalUser';
class UserManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            isOpenModalUser: false
        }
    }

    async componentDidMount() {
        let response = await getAllUsers('ALL');
        if (response && response.errCode === 0) {
            this.setState({
                arrUsers: response.users
            })
        }
    }

    handleAddNewUser = () => {
        this.setState({
            isOpenModalUser: true
        })
    }

    toggleUserModal = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser
        })
    }

    /** Life cycle
     * Run component: 
     * 1. Run constructor -> init state 
     * 2. DidMount (set state) //  chạy sau render lần đầu tiên, WillMount chay truoc khi render
     * 3. render (re-render)
     */

    render() {
        // console.log('check render: ', this.state)
        let arrUsers = this.state.arrUsers;
        return (
            <div className="users-container">
                <ModalUser toggleFromParent={this.toggleUserModal} isOpen={this.state.isOpenModalUser} test={'abcxyz'}></ModalUser>
                <div className='title text-center'>
                    Manage users with Ngtantai
                </div>
                <div className='mx-1'>
                    <button onClick={() => { this.handleAddNewUser() }} className='btn btn-primary px-3 mt-3 mx-1'><i class="fa-solid fa-user-plus"></i>Add new user</button>
                </div>
                <div className='users-table mt-4 mx-2'>
                    <table id="customers">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Firstname</th>
                                <th>Lastname</th>
                                <th>Address</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {arrUsers && arrUsers.map((item, index) => {
                                console.log('check map: ', item, index);
                                return (
                                    <tr key={index}>
                                        <td>{item.email}</td>
                                        <td>{item.firstName}</td>
                                        <td>{item.lastName}</td>
                                        <td>{item.address}</td>
                                        <td>
                                            <button className='btn-edit'><i className="fa-solid fa-pencil"></i></button>
                                            <button className='btn-delete'><i className="fa-solid fa-trash-can"></i></button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
