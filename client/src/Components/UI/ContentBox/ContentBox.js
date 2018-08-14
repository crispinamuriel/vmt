// PROPS
  // Title
  // notifications
  // locked
  // contentType

import React from 'react';
import classes from './contentBox.css';
import Icons from './Icons/Icons';
const contentBox = props => {
  let alignClass = classes.Center;
  if (props.align === 'left') alignClass = classes.Left;
  if (props.align === 'right') alignClass = classes.Right;
  const notifications = (props.notifications > 0) ? <div className={classes.Notification}>{props.notifications}</div> : null;
  // const roomTpe = props.roomType ? <
  return (
    <div className={classes.Container} onClick={this.toggleCollapse}>
      {Icons}
      {notifications}
      <div>Icons</div>
      <div className={classes.Title}>{props.title}</div>
      <div className={[classes.Content, alignClass].join(' ')}>
        {props.children}
      </div>
    </div>
  )
}

export default contentBox;
