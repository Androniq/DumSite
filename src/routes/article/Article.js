import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Article.css';

class Article extends React.Component {
  static propTypes = {};

  state = {
    article: null,
  };

  render() {
    return (
      <div className={s.shostam}>
        <h3>{this.props.data.PageTitle}</h3>
      </div>
    );
  }
}

export default withStyles(s)(Article);
