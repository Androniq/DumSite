/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Home.css';

class Home extends React.Component {
  static propTypes = {
    articles: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        PageTitle: PropTypes.string.isRequired,
        Url: PropTypes.string.isRequired,
      }),
    ).isRequired,
  };

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          {this.props.articles.map(item => (
            <article key={item._id} className={s.newsItem}>
              <h3 className={s.newsTitle}>
                <a href={`/article/${item.Url}`}>{item.PageTitle}</a>
              </h3>
              <div />
            </article>
          ))}
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Home);
