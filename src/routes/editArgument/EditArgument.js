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
    voteDescription: '',
  };

  constructor(props) {
    super(props);
    this.props.data.priorityItems = this.props.data.priorities.map(it => ({
      value: it.ID,
      label: it.Title,
    }));
    this.props.data.voteItems = this.props.data.votes.map(it => ({
      value: it.ID,
      label: it.ShortDescription,
    }));
    this.state.voteDescription = this.getVoteDescription(
      this.props.data.argument.Vote,
    );
    this.state.priorityDescription = this.getPriorityDescription(
      this.props.data.argument.Priority,
    );
  }

  getPriorityDescription(id) {
    const item = this.props.data.priorities.find(it => it.ID === id);
    return item && item.Description;
  }

  getVoteDescription(id) {
    const item = this.props.data.votes.find(it => it.ID === id);
    return item && item.Description;
  }

  updateVote(value) {
    this.setState({
      Vote: value,
      voteDescription: this.getVoteDescription(value.value),
    });
  }
  updatePriority(value) {
    this.setState({
      Priority: value,
      priorityDescription: this.getPriorityDescription(value.value),
    });
  }
  updateContent(value) {
    this.setState({ Content: value });
  }

  componentWillMount() {
    const argument = this.props.data;
    if (argument) {
      this.setState(argument);
    }
  }

  async onSave() {
    const argument = this.props.data;
    argument.Vote = this.state.Vote;
    argument.Priority = this.state.Priority;
    argument.Content = this.state.Content;
    const text = JSON.stringify(argument);

    const res = await this.props.fetch('/api/setArgument', {
      method: 'POST',
      body: text,
      headers: { 'Content-Type': 'application/json' },
    });
    const resj = await res.json();
    if (resj.success) {
      history.push(`/article/${this.props.articleUrl}`);
    } else {
      console.error(resj.message);
    }
  }

  placeholderApplyStyle(style) {
    style['white-space'] = 'nowrap';
    style['text-overflow'] = 'ellipsis';
    style.overflow = 'hidden';
    style['max-width'] = '360px';
    return style;
  }

  onCancel() {
    history.push(`/article/${this.props.articleUrl}`);
  }

  render() {
    return (
      <div className={s.editArgumentContainer}>
        <div className={s.editArgumentGrid}>
          <Select
            className={classnames(s.comboBox, s.grid11)}
            options={this.props.data.priorityItems}
            onChange={this.updatePriority.bind(this)}
            placeholder="Виберіть пріоритет"
            styles={{ placeholder: this.placeholderApplyStyle }}
            defaultValue={this.props.data.priorityItems.find(
              it => it.value === this.props.data.argument.Priority,
            )}
          />
          <Select
            className={classnames(s.comboBox, s.grid12)}
            options={this.props.data.voteItems}
            onChange={this.updateVote.bind(this)}
            placeholder="На користь якого варіанту ваш аргумент?"
            styles={{ placeholder: this.placeholderApplyStyle }}
            defaultValue={this.props.data.voteItems.find(
              it => it.value === this.props.data.argument.Vote,
            )}
          />
          <div className={classnames(s.descriptionBox, s.grid21)}>
            <span
              dangerouslySetInnerHTML={{
                __html: this.state.priorityDescription,
              }}
            />
          </div>
          <div className={classnames(s.descriptionBox, s.grid22)}>
            <span
              dangerouslySetInnerHTML={{ __html: this.state.voteDescription }}
            />
          </div>
        </div>
        <div className={s.contentEditor} />
        <div className={s.buttonsContainer}>
          <button className={s.buttonSave} onClick={this.onSave.bind(this)}>
            Зберегти
          </button>
          <button className={s.buttonSave} onClick={this.onCancel.bind(this)}>
            Повернутися
          </button>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(EditArgument);
