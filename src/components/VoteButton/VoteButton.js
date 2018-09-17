import React from 'react';
import PropTypes from 'prop-types';
import Popup from "reactjs-popup";
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './VoteButton.css';
import classnames from 'classnames';

class VoteButton extends React.Component
{
    static propTypes =
    {
        code: PropTypes.string.isRequired,
        onClick: PropTypes.func,
        ownVote: PropTypes.string.isRequired
    };
    
    state =
    {
    };

    constructor(props)
    {
        super(props);
        this.state.colorStyle = this.getColorStyle(this.props.code);
        this.state.buttonStyle = this.getButtonStyle(this.props.code);
    }

    getColorStyle(code)
    {
        switch (code)
        {
            case 'A':
            case 'B':
                return s.pvButtonRed;
            case 'AB':
            case 'BA':
                return s.pvButtonYellow;
            case 'EQ':
                return s.pvButtonGreen;
            case 'S':
                return s.pvButtonBlue;
        }
        throw { sender: this, message: "Wrong VoteButton code: " + code };
    }

    getButtonStyle(code)
    {
        switch (code)
        {
            case 'A': return s.pvButtonA;
            case 'AB': return s.pvButtonAB;
            case 'EQ': return s.pvButtonEQ;
            case 'BA': return s.pvButtonBA;
            case 'B': return s.pvButtonB;
            case 'S': return s.pvButtonS;
        }
        throw { sender: this, message: "Wrong VoteButton code: " + code };
    }

    cssHighlight(code)
    {
        if (code === this.props.ownVote)
        {
            return s.pvButtonCurrent;
        }
        return null;
    }

    render()
    {
        return (
            <button className={classnames(s.pvButtonBase, this.state.colorStyle, this.state.buttonStyle, this.cssHighlight(this.props.code))}
                onClick={this.props.onClick}>
                {this.props.children}
            </button>
            );
    }
}

export default withStyles(s)(VoteButton);