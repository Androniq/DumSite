import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Article.css';

class Article extends React.Component {
  static propTypes = {};

  state = {
    article: null,
  };

  componentWillMount() {
    this.callApi()
      .then(res => this.setState({ articles: res.data }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    console.info(this.props);
    const response = await fetch('/api/article/posmishka');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  render() {
    return (
      <div className={s.shostam}>
        <h3>AAA</h3>
      </div>
    );
  }
}

export default withStyles(s)(Article);
