import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EditArticle.css';
import classnames from 'classnames';
import { UserContext } from '../../UserContext';

class EditArticle extends React.Component {
  static propTypes = {};

  render()
  {
      return (
          <div className={s.editArticleContainer}>
          </div>
      );
  }
}

export default withStyles(s)(EditArticle);
