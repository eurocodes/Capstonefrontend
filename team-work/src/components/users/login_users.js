import React, { Component } from 'react';
import InputField from '../InputField';
import SubmitButton from '../SubmitButton';
import { setUserSession } from './Helper';

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            buttonDisabled: false
        }
    }

    setInputValue(proerty, val) {
        val = val.trim();
        if (val.length > 30) {
            return;
        }
        this.setState({
            [proerty]: val
        })
    }

    resetForm() {
        this.setState({
            email: '',
            password: '',
            buttonDisabled: false
        })
    }

    async handleLogin() {

        if (!this.state.email) {
            return;
        }
        if (!this.state.password) {
            return;
        }

        this.setState({
            buttonDisabled: true
        })

        try {
            let res = await fetch('http://localhost:4200/api/v1/auth/login', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.state)
            });

            let result = await res.json();
            this.resetForm();
            setUserSession(result.data.token);

            if(result.data.token) {
                this.props.router.push("posts");
            } else{
                this.props.router.push("/");
            }
        } catch (error) {
            console.log(error);
            this.resetForm();
        }
    }

    render() {
        return (
            <div className="wrapper-login">
                <div className="form-wrapper-login">
                    <h3>Staff Login</h3>
                    <InputField className="inputField" type="text" placeholder="Email" value={this.state.email ? this.state.email : ''}
                        onChange={(val) => this.setInputValue('email', val)}
                    />

                    <InputField className="inputField" type="password" placeholder="Password" value={this.state.password ? this.state.password : ''}
                        onChange={(val) => this.setInputValue('password', val)}
                    />

                    <SubmitButton text="Safe Login" disabled={this.state.buttonDisabled} className="myButton"
                        onClick={() => this.handleLogin()}
                    />
                </div>
            </div>
        );
    }
}

export default LoginForm;
