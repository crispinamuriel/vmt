import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
// import Filter from 'bad-words';
import Button from '../UI/Button/Button';
import classes from './chat.css';

// const filter = new Filter();
// add words
// const addWordList = [];
// filter.addWords(...addWordList);

const Message = React.forwardRef((props, ref) => {
  const {
    message,
    showReference,
    onClick,
    highlighted,
    id,
    referencing,
    // isSimplified determines the user display options to streamline chat in Room
    isSimplified,
    reference,
  } = props;
  let highlightClass = '';
  let referenceClass = '';
  let referenceArrow = null;

  const nameGen = () => {
    let shortName = message.user.username;
    const maxLen = 12;
    // currently always using abbreviated naming for both detailed and simple chat
    // if (!isSimplified) return shortName;
    if (shortName.includes('@'))
      shortName = shortName.substring(0, shortName.lastIndexOf('@'));
    if (shortName.length > maxLen) shortName = shortName.substring(0, maxLen);
    return shortName;
  };

  if (highlighted) {
    highlightClass = classes.Highlight;
  }
  if (reference) {
    referenceClass = classes.Reference;
    referenceArrow = (
      <Button
        theme="Arrow"
        click={showReference}
        type="button"
        id={message._id}
        data-testid={message._id}
      >
        {message.reference.elementType === 'chat_message' ? (
          <i className="fas fa-arrow-up" />
        ) : (
          <i className="fas fa-arrow-left" />
        )}
      </Button>
    );
  }
  if (message) {
    if (isSimplified && message.autogenerated) return null;
    const oneWeekAgo = moment().subtract(7, 'days');
    const oneYearAgo = moment().subtract(1, 'year');
    const momentTimestamp = moment.unix(message.timestamp / 1000);
    const userName = message.autogenerated ? 'VMTbot' : nameGen();
    let format = 'ddd h:mm:ss a';
    if (momentTimestamp.isBefore(oneYearAgo)) {
      format = 'MMMM Do YYYY, h:mm:ss a';
    } else if (momentTimestamp.isBefore(oneWeekAgo)) {
      format = 'MMMM Do, h:mm:ss a';
    }

    const formattedTimestamp = momentTimestamp.format(format);
    return (
      <div
        key={id}
        ref={ref}
        className={[
          message.autogenerated ? classes.VmtBotEntry : classes.Entry,
          referenceClass,
          highlightClass,
        ].join(' ')}
        style={{
          cursor: message.reference || referencing ? 'pointer' : 'auto',
          color: message.color,
        }}
      >
        <div>
          <b>{userName}: </b>
          <span> {referenceArrow} </span>
          <span
            onClick={onClick}
            onKeyPress={onClick}
            role="button"
            tabIndex="0"
            data-testid={`msg-${id}`}
          >
            {message.text}
          </span>
        </div>
        {/* CONSIDER CONDITIONALLLY FORMATIING THE DATE BASED ON HOW FAR IN THE PAST IT IS
              IF IT WAS LAST WEEK, SAYING THE DAY AND TIME IS MISLEADING */}
        {isSimplified ? null : (
          <div className={classes.Timestamp}>{formattedTimestamp}</div>
        )}
      </div>
    );
  }
  return null;
});

Message.propTypes = {
  message: PropTypes.shape({}).isRequired,
  highlighted: PropTypes.bool,
  id: PropTypes.string.isRequired,
  referencing: PropTypes.bool,
  isSimplified: PropTypes.bool,
  reference: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

Message.defaultProps = {
  highlighted: false,
  referencing: false,
  isSimplified: true,
};
export default Message;
