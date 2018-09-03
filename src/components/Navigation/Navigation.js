/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Navigation.css';
import Link from '../Link';
import { UserContext } from '../../UserContext.js';

class Navigation extends React.Component {
  render() {
    return (
      <div className={s.root} role="navigation">
        <Link className={s.link} to="/about">
          Про сайт
        </Link>
        <Link className={s.link} to="/contact">
          Контакти
        </Link>
        <span className={s.spacer}> | </span>
        <UserContext.Consumer>
          {user => <span>{user?user.profile.displayName:"NO USER"}</span>}
        </UserContext.Consumer>
        <Link className={s.link} to="/login">
          Увійти
        </Link>
        <span className={s.spacer}>чи</span>
        <Link className={cx(s.link, s.highlight)} to="/register">
          Зареєструватися
        </Link>
      </div>
    );
  }
}

export default withStyles(s)(Navigation);
