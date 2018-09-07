import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EditArgument.css';
import classnames from 'classnames';
import { UserContext } from '../../UserContext';
import TextInput from '../../components/TextInput/TextInput';
import history from '../../history';
import { guid } from '../../utility';

class EditArgument extends React.Component {
  static propTypes = {};

  state = {
    Vote: '',
    Priority: '',
    Content: ''
  };

updateVote(value) { this.setState({Vote:value}); }
updatePriority(value) { this.setState({Priority:value}); }
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
  var argument = this.props.data;
  argument.Vote = this.state.Vote;
  argument.Priority = this.state.Priority;
  argument.Content = this.state.Content;
  var text = JSON.stringify(argument);

  var res = await this.props.fetch('/api/setArgument', {method:'POST', body: text, headers: { "Content-Type": "application/json" }});
  var resj = await res.json();
  if (resj.success)
  {
    history.push('/article/' + this.props.articleUrl);
  }
  else
  {
    console.error(resj.message);
  }
}

onCancel()
{
  history.push('/article/' + this.props.articleUrl);
}

  render()
  {
      return (
          <div className={s.editArgumentContainer}>
            <div className={s.editArgumentGrid}>

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
