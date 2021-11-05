import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { HomeNav, Modal, Navbar } from '../Components';
import {
  Homepage,
  Login,
  Signup,
  ClassCode,
  Community,
  Logout,
  Profile,
  ForgotPassword,
  ResetPassword,
  ConfirmEmail,
  Unconfirmed,
} from '../Containers';
import {
  Confirmation,
  About,
  NotFound,
  Terms,
  Instructions,
  Faq,
  Contact,
} from '../Layout';
import classes from './main.css';
import Aux from '../Components/HOC/Auxil';
import OauthReturn from '../Components/HOC/OauthReturn';
import { updateUser } from '../store/actions/user';

class Home extends PureComponent {
  state = {
    scrollPosition: 0,
    errorMsgSeen: false,
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll); // @TODO while it would be less dry we should move this out of here and into homeNave and Homepage...
    // having this at the top level causes a complete re-render of the app on every scroll...actually we might just need it on the homeNav
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = (event) => {
    this.setState({
      scrollPosition:
        event.srcElement.scrollingElement.scrollTop / window.innerHeight,
    });
  };

  toggleAdmin = () => {
    const { connectUpdateUser, user } = this.props;
    connectUpdateUser({ inAdminMode: !user.inAdminMode });
  };

  isMobile = () => {
    return window.matchMedia('only screen and (max-width: 760px)').matches;
  };

  isWeekend = () => {
    const today = new Date();
    return !(today.getDay() % 6);
  };

  closeModal = () => {
    this.setState({ errorMsgSeen: true });
  };

  render() {
    const { location, user } = this.props;
    const { scrollPosition, errorMsgSeen } = this.state;
    return (
      <Aux>
        {location.pathname.indexOf('community') > -1 ||
        location.pathname.indexOf('profile') > -1 ||
        location.pathname.indexOf('dashboard') > -1 ? (
          <Navbar fixed user={user} toggleAdmin={this.toggleAdmin} />
        ) : (
          <HomeNav
            isDark={scrollPosition > 0.45}
            page={location.pathname}
            user={user}
            toggleAdmin={this.toggleAdmin}
          />
        )}
        <Modal
          show={(this.isWeekend() || this.isMobile()) && !errorMsgSeen}
          closeModal={this.closeModal}
          height={400}
          width={300}
        >
          {'Welcome to Virtual Math Teams! '}
          <hr />
          {this.isMobile()
            ? 'This Math experience is best viewed on a larger computer screen.'
            : null}
          <br />
          {this.isWeekend()
            ? `VMT is in development and may undergo regular weekend maintenance${
                process.env.REACT_APP_VMT_PROD_MAINT_SCHEDULE
                  ? ` on ${process.env.REACT_APP_VMT_PROD_MAINT_SCHEDULE}`
                  : ''
              }, please contact if uptime is needed.`
            : null}
        </Modal>
        <div
          className={classes.Container}
          style={{
            marginTop: location.pathname.indexOf('explore') > -1 ? 0 : 50,
          }}
        >
          <Switch>
            <Route exact path="/" render={() => <Homepage {...this.props} />} />
            <Route path="/about" component={About} />
            <Route path="/instructions" component={Instructions} />
            <Route path="/terms" component={Terms} />
            <Route path="/faq" component={Faq} />
            <Route path="/contact" component={Contact} />
            <Route path="/community/:resource" component={Community} />
            <Route exact path="/logout" component={Logout} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/classcode" component={ClassCode} />

            <Route path="/confirmation" component={Confirmation} />
            <Route path="/profile" component={Profile} />
            <Route path="/forgotPassword" component={ForgotPassword} />
            <Route path="/resetPassword/:token?" component={ResetPassword} />
            <Route path="/confirmEmail/:token?" component={ConfirmEmail} />
            <Route path="/unconfirmed" component={Unconfirmed} />
            <Route path="/oauth/return" component={OauthReturn} />
            <Route path="/*" component={NotFound} />
          </Switch>
        </div>
      </Aux>
    );
  }
}
// prettier-ignore
export default connect((state) => ({ user: state.user }), {
  connectUpdateUser: updateUser,
})(Home);
