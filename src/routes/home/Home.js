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
    news: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        link: PropTypes.string.isRequired,
        content: PropTypes.string,
      }),
    ).isRequired,
  };

  state = {
    articles: [],
  };

  componentWillMount() {
    this.callApi()
      .then(res => this.setState({ articles: res.data }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/api/getArticles');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          {this.state.articles.map(item => (
            <article key={item._id} className={s.newsItem}>
              <h1 className={s.newsTitle}>
                <a href={`/article/${item.Url}`}>{item.PageTitle}</a>
              </h1>
            </article>
          ))}
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Home);
