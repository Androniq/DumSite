import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Article.css';
import classnames from 'classnames';
import Chart from 'react-chartjs-2';
import { UserContext } from '../../UserContext.js';
import Popup from "reactjs-popup";
import Collapsible from 'react-collapsible';
import PriorityHeader from '../../components/PriorityHeader/PriorityHeader';
import {
	getLevel,
	checkPrivilege,
	USER_LEVEL_VISITOR,
	USER_LEVEL_MEMBER,
	USER_LEVEL_MODERATOR,
	USER_LEVEL_ADMIN,
  USER_LEVEL_OWNER } from '../../utility';
import history from '../../history';

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
    },
    maintainAspectRatio: true
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

clickEdit()
{
  history.push('/editArticle/' + this.props.data.article.Url);
}

  render() {
    return (
      <div className={s.infoArea}>
        <div className={s.tokenHeader}
          style={{backgroundColor: this.props.data.result.ColorCode, color: this.props.data.result.WhiteText ? "white" : "black"}}>
          <span className={classnames(s.tokenBase, s.tokenA)}>{this.props.data.article.TokenA}</span>
          <span className={classnames(s.tokenBase, s.tokenB)}>{this.props.data.article.TokenB}</span>
        </div>
        <h3 className={s.generalResult}>{this.props.data.result.Description}</h3>
        <span dangerouslySetInnerHTML={{__html: this.props.data.article.Content}}></span>
        <Chart type="horizontalBar" data={this.chartData(this.props.data)} options={this.chartOptions()} />
        <span className={s.totalVotes}>Усього голосів: {this.props.data.totalPopular}</span>
        <UserContext.Consumer>
          {context => context.user ? context.user.confirmed ? !context.user.blocked ? (
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
              {checkPrivilege(context.user, USER_LEVEL_MODERATOR) ? (
              <button className={s.buttonVote} onClick={this.clickEdit.bind(this)} href="">Редагувати</button>
              ):""}
            </div>
          ) : (
            <div className={s.containerNotAuthorized}>
              <span className={s.textNotAuthorized}>Ви не маєте права голосувати</span>
            </div>
          ) : (
            <div className={s.containerNotAuthorized}>
              <span className={s.textNotAuthorized}>Щоб голосувати, потрібно підтвердити свою адресу електронної пошти</span>
            </div>
          ) : (
            <div className={s.containerNotAuthorized}>
              <span className={s.textNotAuthorized}>Щоб голосувати, потрібно авторизуватися</span>
            </div>
          )}
        </UserContext.Consumer>
        <div className={s.prioritiesContainer}>
          {this.props.data.priorityList.map(priority =>
          <div key={priority.priority._id} className={s.priorityContainer}>
            <Collapsible trigger={(
              <PriorityHeader priorityTitle={priority.priority.Title} popularOverride={priority.priority.popularOverride}
                voteFor={priority.voteFor} isOpen={false} />
             )} triggerWhenOpen={(
              <PriorityHeader priorityTitle={priority.priority.Title} popularOverride={priority.priority.popularOverride}
                voteFor={priority.voteFor} isOpen={true} />
            )}
             easing="ease">
            <div className={s.priorityArgs}>
              {priority.arguments.length ? "" : (
                <span className={s.priorityArgsEmpty} />
              )}
              {priority.arguments.map(argument =>
                <div key={argument._id} className={s.argumentContainer}>
                  <div className={s.argumentHeader}>
                    <span className={s.argumentTitle}>{priority.priority.Title}</span>
                    <span className={s.argumentVote}>{argument.voteFor}</span>
                  </div>
                  <div className={s.argumentBody}>
                    <span className={s.argumentBodySpan} dangerouslySetInnerHTML={{__html: argument.Content}} />
                  </div>
                </div>
              )}
            </div>
            </Collapsible>
          </div>
          )}
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Article);
