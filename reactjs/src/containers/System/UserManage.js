import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage.scss';
import { getAllUsers } from '../../services/userService';
class UserManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrUsers: []
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

    /** Life cycle
     * Run component: 
     * 1. Run constructor -> init state 
     * 2. DidMount (set state) // set gia tri truoc khi render ra man hinhn 
     * 3. render
     */

    render() {
        console.log('check render: ', this.state)
        let arrUsers = this.state.arrUsers;
        return (
            <div className="users-container">
                <div className='title text-center'>
                    Manage users with Ngtantai
                </div>
                <div className='users-table mt-4 mx-2'>
                    <table id="customers">
                        <tr>
                            <th>Email</th>
                            <th>Firstname</th>
                            <th>Lastname</th>
                            <th>Address</th>
                            <th>Actions</th>
                        </tr>
                        {
                            arrUsers && arrUsers.map((item, index) => {
                                console.log('check map: ', item, index)
                                return (
                                    <tr>
                                        <td>{item.email}</td>
                                        <td>{item.firstName}</td>
                                        <td>{item.lastName}</td>
                                        <td>{item.address}</td>
                                        <td>
                                            <button className='btn-edit'><i className="fa-solid fa-pencil"></i></button>
                                            <button className='btn-delete'><i className="fa-solid fa-trash-can"></i></button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
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
