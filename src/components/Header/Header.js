/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.css';
import Link from '../Link';
import Navigation from '../Navigation';
import logoUrl from './logo-small.png';
import logoUrl2x from './logo-small@2x.png';
import Button from 'react-bootstrap/lib/Button';
import ToggleButton from 'react-bootstrap/lib/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/lib/ToggleButtonGroup';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';

class Header extends React.Component {
	constructor(props)
	{
		super(props);
		this.state = {
			toggle:false,
			buttonClass: s.myButton
		};		
		this.myClick = this.myClick.bind(this);
	}

	myClick()
	{	
		console.log('click');
		this.setState({toggle: !this.state.toggle}, () =>{
			if (this.state.toggle){
				this.setState({buttonClass: s.myButton2})
			}else {
				this.setState({buttonClass: s.myButton})
			}
		})
		
	}
	
  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <Navigation />
          <Link className={s.brand} to="/">
            <img
              src={logoUrl}
              srcSet={`${logoUrl2x} 2x`}
              width="38"
              height="38"
              alt="React"
            />
            <span className={s.brandTxt}>Your 111р Company</span>
          </Link>
          <div className={s.banner}>
            <h1 className={s.bannerTitle}>React</h1>
            <p className={s.bannerDesc}>Complex web apps made easy</p>
			<ButtonToolbar>
				<ButtonGroup name="b">
					<Button className={this.state.buttonClass} onClick={this.myClick}>Кнопка 1</Button>
				</ButtonGroup>
			</ButtonToolbar>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Header);
