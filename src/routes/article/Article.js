import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Article.css';
import classnames from 'classnames';
import Chart from 'react-chartjs-2';
import { UserContext } from '../../UserContext.js';

class Article extends React.Component {
  static propTypes = {};

  state = {
    article: null,
  };

chartData(articleData)
{
  let data =
  {
    labels: ["A", "AB", "EQ", "BA", "B", "S"],
    datasets: [{
      label: 'Популярне голосування, %',
      data: [],
      backgroundColor: [
        'rgba(255, 0, 0, 0.2)',
        'rgba(255, 255, 0, 0.2)',
        'rgba(0, 255, 0, 0.2)',
        'rgba(255, 255, 0, 0.2)',
        'rgba(255, 0, 0, 0.2)',
        'rgba(0, 0, 255, 0.2)'
      ],
      borderColor: [
        'rgba(255, 0, 0, 1)',
        'rgba(255, 255, 0, 1)',
        'rgba(0, 255, 0, 1)',
        'rgba(255, 255, 0, 1)',
        'rgba(255, 0, 0, 1)',
        'rgba(0, 0, 255, 1)'
      ],
      borderWidth: 1
    }]
  };
  if (articleData)
  {
    data.labels = articleData.voteResults.map(function(element) { return element.vote.ShortDescription; });
    data.datasets[0].data = articleData.voteResults.map(function(element) { return element.popularVote; });
  }
  return data;
}

chartOptions()
{
  let options = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };
  return options;
}

  render() {
    return (
      <div className={s.infoArea}>
        <h3 className={s.header}>{this.props.data.article.PageTitle}</h3>
        <div className={s.tokenHeader}
          style={{backgroundColor: this.props.data.result.ColorCode, color: this.props.data.result.WhiteText ? "white" : "black"}}>
          <span className={classnames(s.tokenBase, s.tokenA)}>{this.props.data.article.TokenA}</span>
          <span className={classnames(s.tokenBase, s.tokenB)}>{this.props.data.article.TokenB}</span>
        </div>
        <h3 className={s.generalResult}>{this.props.data.result.Description}</h3>
        <span dangerouslySetInnerHTML={{__html: this.props.data.article.Content}}></span>
        <Chart type="bar" data={this.chartData(this.props.data)} options={this.chartOptions()} />
        <UserContext.Consumer>
          {user => user ? (
            <div className={s.buttonContainer}>
              <button className={s.buttonVote}>Голосувати!</button>
              <button className={s.buttonVote}>Аргументувати...</button>
            </div>
          ) : (
            <div className={s.containerNotAuthorized}>
              <span className={s.textNotAuthorized}>Щоб голосувати, потрібно авторизуватися</span>
            </div>
          )}
        </UserContext.Consumer>
      </div>
    );
  }
}

export default withStyles(s)(Article);
