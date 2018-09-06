import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Blog.css';
import classnames from 'classnames';
import { UserContext } from '../../UserContext.js';

class Blog extends React.Component {
  static propTypes = {};

  render()
  {
      return (
          <div className={s.blogContainer}>
              <div className={s.blogHeader}>
                <div className={s.blogTitle}>
                    <h2 className={s.blogTitleH}>{this.props.data.Title}</h2>
                </div>
              </div>
              <span dangerouslySetInnerHTML={{__html: this.props.data.Content}} />
          </div>
      );
  }
}

export default withStyles(s)(Blog);
