import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Article.css';
import classnames from 'classnames';
import Chart from 'react-chartjs-2';
import { UserContext } from '../../UserContext.js';
import Popup from "reactjs-popup";

class Article extends React.Component {
  static propTypes = {};

  state = {
    ownVote: 'N'
  };

  constructor(props)
  {
    super(props);
    this.state = { ownVote: props.data.ownVote };
  }

chartData(articleData)
{
  let data =
  {
    labels: articleData.voteResults.map(function(element) { return element.vote.ShortDescription; }),
    datasets: [{
      label: 'Популярне голосування, %',
      data: articleData.voteResults.map(function(element) { return element.popular; }),
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

getVoteOption(code)
{
  return this.props.data.voteResults.find(function(element) { return element.vote.Code === code; });
}

cssHighlight(code)
{
  if (code === this.state.ownVote)
  {
    return s.pvButtonCurrent;
  }
  return null;
}

clickVote(code)
{
  let optionId = this.getVoteOption(code).vote.ID;
  if (code === this.state.ownVote)
  {
    optionId = 'null';
    code = 'N';
  }
  return async () => this.clickVoteDo(code, optionId);
}

async clickVoteDo(code, optionId)
{
  var resp = await fetch(`/api/sendPopularVote/${this.props.data.article.ID}/${optionId}`);
  var message = await resp.json();
  if (message.success)
  {
    await this.setState({ ownVote: code });
  }
}

voteButton(code, buttonStyle, colorStyle)
{
  return (
    <button className={classnames(s.pvButtonBase, colorStyle, buttonStyle, this.cssHighlight(code))} onClick={this.clickVote(code)}>
      {this.getVoteOption(code).vote.ShortestDescription}
    </button>
  );
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
              <Popup trigger={<button className={s.buttonVote}>Голосувати!</button>} position="top center" modal>
                <div className={s.pvContainer}>
                  {this.voteButton('A', s.pvButtonA, s.pvButtonRed)}
                  {this.voteButton('AB', s.pvButtonAB, s.pvButtonYellow)}
                  {this.voteButton('S', s.pvButtonS, s.pvButtonBlue)}
                  {this.voteButton('EQ', s.pvButtonEQ, s.pvButtonGreen)}
                  {this.voteButton('B', s.pvButtonB, s.pvButtonRed)}
                  {this.voteButton('BA', s.pvButtonBA, s.pvButtonYellow)}
                </div>
              </Popup>              
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
