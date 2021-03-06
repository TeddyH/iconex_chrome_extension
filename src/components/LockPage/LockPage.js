import React, { Component } from 'react';
import hash from 'hash.js'
import { routeConstants as ROUTE } from 'constants/index'
import withLanguageProps from 'HOC/withLanguageProps';

const INIT_STATE = {
  passcode: '',
  error: ''
}

@withLanguageProps
class LockPage extends Component {
  constructor(props) {
    super(props);

    this.state = INIT_STATE
  }

  handleChange = (e) => {
    let value = e.target.value
    if (isNaN(value) || value.length > 6) {
      return
    }
    this.setState({
      passcode: value,
      error: ''
    })
  }

  checkPasscode = () => {
    const {passcode} = this.state
    if (passcode === '') {
      this.setState({error: 'lockPasscode'})
      return
    }

    const {passcodeHash} = this.props
    if (passcodeHash !== hash.sha256().update(this.state.passcode).digest('hex')) {
      this.setState({error: 'lockPasscodeExactly'})
      return
    }

    this.props.setUnlock();
    this.props.history.push(ROUTE['mywallet']);
  }

  sendEmail = () => {
    this.props.togglePopup();
    this.props.setPopupType('changePasscode');
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.checkPasscode();
    }
  }

  render() {
    const { I18n } = this.props;
    return (
			<div className="content-holder">
				<div className="logo"><em className="_img"></em></div>
				<div className="pw-group">
					<input type="password" className="txt-type-normal _img" placeholder={I18n.lockPageInputPlaceholder}
            value={this.state.passcode}
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
          />
					{this.state.error !== '' && <p className="error"><em className="_img"></em>{I18n.error[this.state.error]}</p>}
				</div>
				<div className="btn-holder">
					<button className="btn-type-lock" onClick={this.checkPasscode}><span>{I18n.button.confirm}</span></button>
				</div>
        <div className="guide-holder">
				    <p className="forget" onClick={this.sendEmail}>{I18n.lockPageInputForget}</p>
        </div>
			</div>
    );
  }
}

export default LockPage;
