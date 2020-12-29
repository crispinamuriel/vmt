/* eslint-disable */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import classes from './graph.css';
import { Aux, Button } from '../../Components';
import { Player } from '../../external/js/api.full.es';
import socket from '../../utils/sockets';
import mongoIdGenerator from '../../utils/createMongoId';
import ControlWarningModal from './ControlWarningModal';
import CheckboxModal from '../../Components/UI/Modal/CheckboxModal';

// import { updatedRoom } from '../../store/actions';

const DesmosActivityGraph = (props) => {
  const [screenPage, setScreenPage] = useState(1);
  // const [activityPlayer, setActivityPlayer] = useState({});
  const [activityUpdates, setActivityUpdates] = useState();
  const [showControlWarning, setShowControlWarning] = useState(false);
  const calculatorRef = useRef();
  const calculatorInst = useRef();


  let receivingData = false;
  let undoing = false;
  let initializing = false;

  // console.log('Your rendered the Activity Graph again!');
  // console.log('InControl? ', props.inControl);

  function allowKeypressCheck(event) {
    if (showControlWarning) {
      event.preventDefault();
    }
  }

  let buildDescription = (username, updates) => {
    //  let eventDetails = JSON.stringify(updates[updates.keys(updates)[0]]);
    let eventDetails = JSON.stringify(updates);
    return `${username} ${eventDetails}`;
  };

  // listener debugger to follow warming modal
  // useEffect(() => {
  //   console.log('Warning listener: ', showControlWarning);
  //   console.log('and control is currently ', props.inControl);
  // }, [showControlWarning]);

  useEffect(() => {
    console.log('~~~~~~activityUpdate listener~~~~~~~~~');
    // console.log("Updates...: ", activityUpdates);
    handleResponseData(activityUpdates);
  }, [activityUpdates]);

  // Event listener callback on the Activity instance
  const handleResponseData = (updates) => {
    if (initializing) return;
    let { room, user, myColor, tab, resetControlTimer, inControl } = props;
    if (undoing) {
      undoing = false;
      return;
    }

    const currentState = updates;
    if (!receivingData) {
      console.log(
        '**** Updates: ',
        currentState,
        ', Controlled by: ',
        inControl,
        ' ****'
      );
      // console.log('On page: ', screenPage);
      if (inControl !== 'ME') {
        // console.log('Oops, you are not in control!');
        // undoing = true;
        // document.activeElement.blur(); // prevent the user from typing anything else N.B. this isnt actually preventing more typing it just removes the cursor
        // we have the global keypress listener to prevent typing if controlWarning is being shown
        setShowControlWarning(true);
        return;
      }
      let description = buildDescription(
        user.username,
        updates
        // stateDifference
      );
      const currentStateString = JSON.stringify(currentState);
      // console.log(this.calculator.getState());
      const newData = {
        _id: mongoIdGenerator(),
        room: room._id,
        tab: tab._id,
        currentState: currentStateString, // desmos events use the currentState field on Event model
        color: myColor,
        user: {
          _id: user._id,
          username: user.username,
        },
        timestamp: new Date().getTime(),
        description,
      };
      // Update the instanvce variables tracking desmos state so they're fresh for the next equality check
      props.addToLog(newData);
      socket.emit('SEND_EVENT', newData, () => {});
      resetControlTimer();
    }
    receivingData = false;
  };

  // Handle the update of the Activity Player state
  function updateActivityState(stateData) {
    let newState = JSON.parse(stateData);
    console.log('Updating this player: ', calculatorInst.current);
    console.log('Received this data: ', newState);
    calculatorInst.current.dangerouslySetResponses(
       newState.studentResponses,
        {timestampEpochMs: newState.timestampEpochMs}
    );
  }

  function initializeListeners() {
    // INITIALIZE EVENT LISTENER
    const { tab, updatedRoom, addNtfToTabs, addToLog } = props;

    socket.removeAllListeners('RECEIVE_EVENT');
    socket.on('RECEIVE_EVENT', (data) => {
      console.log('Socket: Received data: ', data);
      addToLog(data);
      const { room } = props;
      receivingData = true;
      if (data.tab === tab._id) {
        const updatedTabs = room.tabs.map((t) => {
          if (t._id === data.tab) {
            t.currentState = data.currentState;
          }
          return tab;
        });
        updatedRoom(room._id, { tabs: updatedTabs });
        // updatedRoom(room._id, { tabs: updatedTabs });
        updateActivityState(data.currentState);
      } else {
        addNtfToTabs(data.tab);
        receivingData = false;
      }
    });

    // const { user: propsUser } = props;
    // const { settings } = propsUser;
  }

  const fetchData = useCallback(async () => {
    initializing = true;
    // window.addEventListener('keydown', allowKeypressCheck());
    let link = props.tab.desmosLink;
    link = link.split('/');
    const code = link[link.length - 1];
    const URL = `https://teacher.desmos.com/activitybuilder/export/${code}`;
    console.log('adapted activity url: ', URL);
    // calling Desmos to get activity config
    const result = await fetch(URL, {
      headers: { Accept: 'application/json' },
    });
    const data = await result.json();
    console.log('Data: ', data);
    calculatorInst.current = new Player({
      activityConfig: data,
      targetElement: calculatorRef.current,
      onResponseDataUpdated: (responses) => {
        const currentState = {
          studentResponses: responses,
          timestampEpochMs: new Date().getTime(),
        };
        // console.log('Responses updated: ', responses);
        setActivityUpdates(currentState);
      },
    });

    // console.log('player', player);
    // setActivityPlayer(player);
    console.log(
      'Desmos Activity Player initialized Version: ',
      Player.version(),
      'Player state: ',
      calculatorInst.current
    );
    props.setFirstTabLoaded();
    initializing = false;
    initializeListeners();
  });

  useEffect(() => {
    // // TODO handle existing room state?
    // try {

    fetchData();

    return function cleanup() {
      if (calculatorInst.current) {
        calculatorInst.current.destroy();
      }
      window.removeEventListener('keydown', allowKeypressCheck());
    };
  }, []);

  function navigateBy(increment) {
    console.log('chaging page for ', calculatorInst.current);
    let page = calculatorInst.current.getActiveScreenIndex() + increment;
    calculatorInst.current.setActiveScreenIndex(page);
    setScreenPage(page + 1);
  }

  return (
    <Aux>
      <span id="focus" ref={focus} />
      <ControlWarningModal
        showControlWarning={showControlWarning}
        toggleControlWarning={() => {
          setShowControlWarning(false);
        }}
        takeControl={() => {
          // this.calculator.undo();
          props.toggleControl();
          setShowControlWarning(false);
        }}
        inControl={props.inControl}
        cancel={() => {
          // this.calculator.undo();
          setShowControlWarning(false);
        }}
        inAdminMode={props.user.inAdminMode}
      />
      <CheckboxModal
        show={props.showRefWarning}
        infoMessage={props.refWarningMsg}
        closeModal={props.closeRefWarning}
        isChecked={props.doPreventFutureRefWarnings}
        checkboxDataId="ref-warning"
        onSelect={props.togglePreventRefWarning}
      />
      <div id="activityNavigation" className={classes.ActivityNav}>
        <Button theme="Small" id="nav-left" click={() => navigateBy(-1)}>
          Prev
        </Button>
        <span id="show-screen" className={classes.Title}>
          Screen {screenPage}
        </span>
        <Button theme="Small" id="nav-right" click={() => navigateBy(1)}>
          Next
        </Button>
      </div>
      <div className={classes.Activity} id="calculatorParent">
        <div className={classes.Graph} id="calculator" ref={calculatorRef} />
      </div>
    </Aux>
  );
};

DesmosActivityGraph.propTypes = {
  room: PropTypes.shape({}).isRequired,
  tab: PropTypes.shape({}).isRequired,
  user: PropTypes.shape({}).isRequired,
  myColor: PropTypes.string.isRequired,
  resetControlTimer: PropTypes.func.isRequired,
  updatedRoom: PropTypes.func.isRequired,
  inControl: PropTypes.string.isRequired,
  toggleControl: PropTypes.func.isRequired,
  setFirstTabLoaded: PropTypes.func.isRequired,
  addNtfToTabs: PropTypes.func.isRequired,
  referencing: PropTypes.bool.isRequired,
  updateUserSettings: PropTypes.func,
  addToLog: PropTypes.func.isRequired,
};

export default DesmosActivityGraph;
