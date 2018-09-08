import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EditArgument.css';
import classnames from 'classnames';
import { UserContext } from '../../UserContext';
import TextInput from '../../components/TextInput/TextInput';
import history from '../../history';
import { guid } from '../../utility';
import Select from 'react-select';

class EditArgument extends React.Component {
  static propTypes = {};

  state = {
    Vote: '',
    Priority: '',
    Content: '',
    priorityDescription: '',
    voteDescription: ''
  };

  constructor(props)
  {
    super(props);
    this.props.data.priorityItems = this.props.data.priorities.map(it => { return { value: it.ID, label: it.Title }; });
    this.props.data.voteItems = this.props.data.votes.map(it => { return { value: it.ID, label: it.ShortDescription }; });
    this.state.voteDescription = this.getVoteDescription(this.props.data.argument.Vote);
    this.state.priorityDescription = this.getPriorityDescription(this.props.data.argument.Priority);
  }

getPriorityDescription(id)
{
  var item = this.props.data.priorities.find(it => it.ID === id);
  return item && item.Description;
}
  
getVoteDescription(id)
{
  var item = this.props.data.votes.find(it => it.ID === id);
  return item && item.Description;
}

updateVote(value) { this.setState({ Vote: value, voteDescription: this.getVoteDescription(value.value) }); }
updatePriority(value) { this.setState({ Priority: value , priorityDescription: this.getPriorityDescription(value.value) }); }
updateContent(value) { this.setState({Content:value}); }

componentWillMount()
{
  var argument = this.props.data;
  if (argument)
  {
    this.setState(argument);
  }
}

async onSave()
{
  var argument = this.props.data.argument;
  argument.Vote = this.state.Vote.value;
  argument.Priority = this.state.Priority.value;
  argument.Content = this.state.Content;
  var text = JSON.stringify(argument);

  var res = await this.props.fetch('/api/setArgument', {method:'POST', body: text, headers: { "Content-Type": "application/json" }});
  var resj = await res.json();
  if (resj.success)
  {
    history.push('/article/' + this.props.data.article.Url);
  }
  else
  {
    console.error(resj.message);
  }
}

placeholderApplyStyle(style)
{
  style["white-space"] = "nowrap";
  style["text-overflow"] = "ellipsis";
  style["overflow"] = "hidden";
  style["max-width"] = "360px";
  return style;
}

onCancel()
{
  history.push('/article/' + this.props.data.article.Url);
}

  render()
  {
      return (
          <div className={s.editArgumentContainer}>
            <div className={s.tokenHeader}>
              <span className={classnames(s.tokenBase, s.tokenA)}>{this.props.data.article.TokenA}</span>
              <span className={classnames(s.tokenBase, s.tokenB)}>{this.props.data.article.TokenB}</span>
            </div>
            <div className={s.editArgumentGrid}>
              <Select
                className={classnames(s.comboBox, s.grid11)}
                options={this.props.data.priorityItems}
                onChange={this.updatePriority.bind(this)}
                placeholder="Виберіть пріоритет"
                styles={{placeholder:this.placeholderApplyStyle}}
                defaultValue={this.props.data.priorityItems.find(it => it.value === this.props.data.argument.Priority)} />
              <Select
                className={classnames(s.comboBox, s.grid12)}
                options={this.props.data.voteItems}
                onChange={this.updateVote.bind(this)}
                placeholder="На користь якого варіанту ваш аргумент?"
                styles={{placeholder:this.placeholderApplyStyle}}
                defaultValue={this.props.data.voteItems.find(it => it.value === this.props.data.argument.Vote)} />
              <div className={classnames(s.descriptionBox, s.grid21)}>
                <span dangerouslySetInnerHTML={{ __html: this.state.priorityDescription }}/>
              </div>
              <div className={classnames(s.descriptionBox, s.grid22)}>
                <span dangerouslySetInnerHTML={{ __html: this.state.voteDescription }}/>
              </div>
            </div>
            <div className={s.contentEditor}></div>
            <div className={s.buttonsContainer}>
              <button className={s.buttonSave} onClick={this.onSave.bind(this)}>Зберегти</button>
              <button className={s.buttonSave} onClick={this.onCancel.bind(this)}>Повернутися</button>
            </div>
          </div>
      );
  }
}

export default withStyles(s)(EditArgument);
