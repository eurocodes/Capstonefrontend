import React, { Component } from 'react';

class SubmitButton extends Component {
    render() {
        return (
            <div className={ this.props.className }>
                <button className="btn" onClick={ () => this.props.onClick() }>
                    {this.props.text}
                </button>
            </div>
        );
    }
}

export default SubmitButton;