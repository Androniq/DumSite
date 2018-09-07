import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EditArticle.css';
import classnames from 'classnames';
import { UserContext } from '../../UserContext';
import TextInput from '../../components/TextInput/TextInput';
import history from '../../history';
import { guid } from '../../utility';

class EditArticle extends React.Component {
  static propTypes = {};

  state = {
    Title: '',
    PageTitle: '',
    Keywords: '',
    Url: '',    
    TokenA: '',
    TokenB: '',
    ShortA: '',
    ShortB: '',
    Content: ''
  };

updateTitle(value) { this.setState({Title:value}); }
updatePageTitle(value) { this.setState({PageTitle:value}); }
updateKeywords(value) { this.setState({Keywords:value}); }
updateUrl(value) { this.setState({Url:value}); } // somewhere here I regretted I didn't choose Angular
updateTokenA(value) { this.setState({TokenA:value}); }
updateTokenB(value) { this.setState({TokenB:value}); }
updateShortA(value) { this.setState({ShortA:value}); }
updateShortB(value) { this.setState({ShortB:value}); }

componentWillMount()
{
  var article = this.props.data;
  if (article)
  {
    this.setState(article);
  }
}

async onSave()
{
  var article = this.props.data;
  article.Title = this.state.Title;
  article.PageTitle = this.state.PageTitle;
  article.Keywords = this.state.Keywords;
  article.Url = this.state.Url;
  article.TokenA = this.state.TokenA;
  article.TokenB = this.state.TokenB;
  article.ShortA = this.state.ShortA;
  article.ShortB = this.state.ShortB;
  var text = JSON.stringify(article);

  var res = await this.props.fetch('/api/setArticle', {method:'POST', body: text, headers: { "Content-Type": "application/json" }});
    var resj = await res.json();
  if (resj.success)
  {
    history.push('/article/' + article.Url);
  }
  else
  {
    console.error(resj.message);
  }
}

onCancel()
{
  history.push('/article/' + this.props.data.Url);
}

  render()
  {
      return (
          <div className={s.editArticleContainer}>
            <div className={s.editArticleGrid}>
              <TextInput className={classnames(s.textInput, s.grid11)} placeholder="Коротка назва статті, наприклад: Вірно"
                onSave={this.updateTitle.bind(this)} value={this.state.Title}
                hint="Напишіть тут коротку назву, за якою можна буде швидко ідентифікувати статтю: лише підозріла лексема, наприклад, «Вірно»." />
              <TextInput className={classnames(s.textInput, s.grid12)} placeholder="Повна назва статті, наприклад: Вірно чи правильно?"
                onSave={this.updatePageTitle.bind(this)} value={this.state.PageTitle}
                hint="Назва, яка відображатиметься в заголовку вкладки у веб-оглядачі. Бажано використовувати формат: [Підозріла лексема] чи [надійна лексема]?, наприклад: «Вірно чи правильно?»." />
              <TextInput className={classnames(s.textInput, s.grid21)} placeholder="Адреса сторінки латинкою, наприклад: virno"
                onSave={this.updateUrl.bind(this)} value={this.state.Url}
                hint="Фрагмент URL, який використовуватиметься для навігації до цієї сторінки. Повинен бути унікальним (перевірка виконується автоматично). Найкраще, якщо це буде латинізація короткої назви (наприклад, «virno»)." />
              <TextInput className={classnames(s.textInput, s.grid22)} placeholder="Ключові слова через кому: вірно, вірний, вірніше"
                onSave={this.updateKeywords.bind(this)} value={this.state.Keywords}
                hint="Перелік розділених комою ключових слів, за якими користувачі сайту шукатимуть цю статтю. Включіть сюди також похідні та споріднені слова з інших частин мови, наприклад: «співпадіння, співпадати». Важливо вказати саме підозрілу лексему – користувачі рідко шукають статтю за надійною лексемою." />
              <TextInput className={classnames(s.textInput, s.grid31)} placeholder="Лексема А з на́голосом, наприклад: Ві́рно"
                onSave={this.updateTokenA.bind(this)} value={this.state.TokenA}
                hint="«Ліва» (підозріла) лексема. (Якщо вона раптом переможе в голосуванні, то сайт автоматично поміняє лексеми місцями при відображенні.) Використовуйте знак на́голосу і уточнення, наприклад: «Ві́рно (у значенні «правильно»)». Якщо ви не знаєте, як ставити наголос, то просто поставте зірочку (*) після наголошеної літери, наприклад: «Ві*рно» – система сама замінить її на наголос після натиснення кнопки «Зберегти»." />
              <TextInput className={classnames(s.textInput, s.grid32)} placeholder="Лексема Б з на́голосом, наприклад: Пра́вильно"
                onSave={this.updateTokenB.bind(this)} value={this.state.TokenB}
                hint="«Права» (надійна) лексема. (Якщо вона раптом програє в голосуванні, то сайт автоматично поміняє лексеми місцями при відображенні.) Пишіть з великої букви і використовуйте знак на́голосу, наприклад: «Пра́вильно». Якщо ви не знаєте, як ставити наголос, то просто поставте зірочку (*) після наголошеної літери, наприклад: «Ві*рно» – система сама замінить її на наголос після натиснення кнопки «Зберегти»." />
              <TextInput className={classnames(s.textInput, s.grid41)} placeholder="Лексема А коротко, наприклад: вірно"
                onSave={this.updateShortA.bind(this)} value={this.state.ShortA}
                hint="Коротке позначення лексеми А, яке відображатиметься на кнопках для голосування. Його потрібно писати з малої літери і без наголосів. Максимальна довжина – 16 символів. Наприклад: «вірно»." />
              <TextInput className={classnames(s.textInput, s.grid42)} placeholder="Лексема Б коротко, наприклад: правильно"
                onSave={this.updateShortB.bind(this)} value={this.state.ShortB}
                hint="Коротке позначення лексеми Б, яке відображатиметься на кнопках для голосування. Його потрібно писати з малої літери і без наголосів. Максимальна довжина – 16 символів. Наприклад: «правильно»." />
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

export default withStyles(s)(EditArticle);
