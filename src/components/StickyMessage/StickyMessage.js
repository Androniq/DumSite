import React from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './StickyMessage.css';
import PropTypes from 'prop-types';

class StickyMessage extends React.Component {
    static propTypes = {
        message: PropTypes.string.isRequired,
        visible: PropTypes.bool
    };

    state = { visibilityStyle: s.invisible };

    constructor(props)
    {
      super(props);
    }

  render() {
    return (
        <div className={cx(s.sticky, this.props.visible ? s.visible : s.invisible)}>
            <span className={s.stickyMessage}>{this.props.message}</span>
        </div>
    );
  }
}

export default withStyles(s)(StickyMessage);