// const _ = require('lodash');
// const { parseString } = require('xml2js');
const { ObjectId } = require('mongoose').Types;
// const cookie = require('cookie');
const axios = require('axios');
const socketInit = require('./socketInit');
const controllers = require('./controllers');
const Message = require('./models/Message');

// const io = require('socket.io')(server, {wsEngine: 'ws'});
module.exports = function() {
  const { io } = socketInit;
  const constants = { EVENT: 'event', MESSAGE: 'message' };
  const timestamps = { [constants.EVENT]: {}, [constants.MESSAGE]: {} };

  const recordEventProblem = (data) => {
    axios.post('https://dweet.io/dweet/for/VMT-BAD-DATA', data);
  };

  const recordData = (type, data) => {
    try {
      if (
        timestamps[type][data.user._id] &&
        timestamps[type][data.user._id] > data.timestamp
      ) {
        data.type = type;
        recordEventProblem(data);
      } else timestamps[type][data.user._id] = data.timestamp;
    } catch (err) {
      console.log(err);
    }
  };

  io.use((socket, next) => {
    // const cookief = socket.handshake.headers.cookie;
    // console.log(cookief);
    // const cookies = cookie.parse(cookief);
    // console.log(cookies);
    // @todo middleware after SSO is done

    next();
  });

  io.sockets.on('connection', (socket) => {
    console.log('socket connected: ', socket.id);

    // console.log(socket.getEventNames())
    // if the socket has a jwt cookie find the user and update their socket
    // should we try to detect if the socket is already associated with a user...if so we need to update users on socket disconnect and remove their socket id

    socket.on('JOIN_TEMP', async (data, callback) => {
      socket.join(data.roomId, async () => {
        let user;
        const promises = [];
        // If the user is NOT logged in, create a temp user
        if (!data.userId) {
          try {
            user = await controllers.user.post({
              username: data.username,
              accountType: 'temp',
            });
          } catch (err) {
            console.log('Error creating user ', err);
          }
        } else {
          user = { _id: data.userId, username: data.username };
        }
        socket.user_id = user._id; // store the user id on the socket so we can tell who comes and who goes
        socket.username = user.username;
        const message = {
          _id: data._id,
          user: { _id: user._id, username: 'VMTbot' },
          room: data.roomId,
          messageType: 'JOINED_ROOM',
          text: `${data.username} joined ${data.roomName}`,
          color: data.color,
          autogenerated: true,
          timestamp: new Date().getTime(),
        };
        promises.push(controllers.messages.post(message));
        // If this is the user in the room, update the blank room created from "Try out a Workspace"
        // We will use the existance if the creator field to check if this is firstEntry on the front end
        if (data.firstEntry) {
          promises.push(
            controllers.tabs.put(data.tabId, { tabType: data.roomType })
          );
          promises.push(
            controllers.rooms.put(data.roomId, {
              roomType: data.roomType,
              name: data.roomName,
              // members: [{ user: user._id, role: "facilitator" }],
              // currentMembers: [user._id],
              creator: user._id,
            })
          );
        }
        promises.push(
          controllers.rooms.addCurrentUsers(data.roomId, ObjectId(user._id), {
            user: ObjectId(user._id),
            role: data.firstEntry ? 'facilitator' : 'participant',
            color: data.color,
          })
        );
        let results;
        try {
          results = await Promise.all(promises);
          socket.to(data.roomId).emit('USER_JOINED_TEMP', {
            currentMembers: results[results.length - 1].currentMembers,
            members: results[results.length - 1].members,
            message,
          });
          callback({ room: results[results.length - 1], message, user }, null);
        } catch (err) {
          console.log(err);
        }
      });
    });

    socket.on('JOIN', async (data, cb) => {
      // console.log('user joined: ', data.eventType);
      // console.log('user with data: ', data.user);
      // console.log('from user: ', socket.user_id);
      // console.log(new Date());
      socket.user_id = data.userId; // store the user id on the socket so we can tell who comes and who goes
      socket.username = data.username;
      const promises = [];
      const user = { _id: data.userId, username: data.username };

      socket.join(data.roomId, async () => {
        // update current users of this room
        const message = {
          _id: data._id,
          user: { _id: data.userId, username: 'VMTbot' },
          room: data.roomId,
          text: `${data.username} joined ${data.roomName}`,
          autogenerated: true,
          messageType: 'JOINED_ROOM',
          color: data.color,
          timestamp: new Date().getTime(),
        };
        promises.push(controllers.messages.post(message));
        promises.push(
          controllers.rooms.addCurrentUsers(data.roomId, data.userId)
        ); //
        let results;
        try {
          results = await Promise.all(promises);
          socket.to(data.roomId).emit('USER_JOINED', {
            currentMembers: results[1].currentMembers,
            message,
          });
          // console.log(
          //   data.userId,
          //   ' joined room ',
          //   results[1]._id,
          //   'with socket id',
          //   socket.id
          // );
          return cb({ room: results[1], message, user }, null);
        } catch (err) {
          console.log('ERROR JOINING ROOM for user: ', data.userId);
          return cb(null, err);
        }
      });
    });

    socket.on('LEAVE_ROOM', (roomId, color, cb) => {
      // console.log('user left room: ', roomId);
      // console.log('from user: ', socket.user_id);
      // console.log(new Date());
      socket.leave(roomId);
      leaveRoom(cb);
    });

    socket.on('disconnecting', () => {
      // if they're in a room we need to remove them
      // console.log('socket id: ', socket.user_id);
      const room = Object.keys(socket.rooms).pop(); // they can only be in one room so just grab the last one
      if (room && ObjectId.isValid(room)) {
        socket.leave(room);
        leaveRoom();
      }
    });

    socket.on('disconnect', () => {
      // console.log('socket disconnect');
      // console.log('from user: ', socket.user_id);
      // console.log(new Date());
    });

    socket.on('SYNC_SOCKET', (_id, cb) => {
      if (!_id) {
        // console.log('unknown user connected: ', socket.id);
        cb(null, 'NO USER');
        return;
      }
      controllers.user
        .put(_id, { socketId: socket.id })
        .then(() => {
          cb(`User socketId updated to ${socket.id}`, null);
        })
        .catch((err) => cb(null, err));
    });

    socket.on('SEND_MESSAGE', (data, callback) => {
      recordData(constants.MESSAGE, data);
      const postData = { ...data };
      postData.user = postData.user._id;
      controllers.messages
        .post(postData)
        .then((res) => {
          socket.broadcast
            .to(data.room)
            .emit('RECEIVE_MESSAGE', { ...data, _id: res._id });
          callback(res, null);
        })
        .catch((err) => {
          callback('fail', err);
        });
    });

    socket.on('PENDING_MESSAGE', (data) => {
      socket.broadcast.to(data.room).emit('PENDING_MESSAGE', { ...data });
    });

    socket.on('TAKE_CONTROL', async (data, callback) => {
      // console.log('TAKE_CONTROL', data);
      // console.log('user with data: ', data.user);
      // console.log('from user: ', socket.user_id);
      // console.log(new Date());
      try {
        await Promise.all([
          controllers.messages.post(data),
          controllers.rooms.put(data.room, { controlledBy: data.user._id }),
        ]);
      } catch (err) {
        callback(err, null);
      }
      socket.to(data.room).emit('TOOK_CONTROL', data);
      controllers.rooms
        .getCurrentState(data.room)
        .then(() => {
          // socket.emit('FORCE_SYNC', room);
        })
        .catch((err) => {
          console.error(err);
          callback(err, null);
        });
    });

    socket.on('RELEASE_CONTROL', (data, callback) => {
      // console.log('release control ', data);
      // console.log('user with data: ', data.user);
      // console.log('from user: ', socket.user_id);
      // console.log(new Date());
      controllers.messages.post(data);
      controllers.rooms.put(data.room, { controlledBy: null });
      socket.to(data.room).emit('RELEASED_CONTROL', data);
      callback(null, {});
    });

    socket.on('SEND_EVENT', async (data) => {
      recordData(constants.EVENT, data);
      try {
        socket.broadcast.to(data.room).emit('RECEIVE_EVENT', data);
        await controllers.events.post(data);
      } catch (err) {
        console.log('ERROR SENDING EVENT: ', err);
      }
    });

    socket.on('SWITCH_TAB', (data, callback) => {
      controllers.messages
        .post(data)
        .then(() => {
          socket.broadcast.to(data.room).emit('RECEIVE_MESSAGE', data);
          callback('success', null);
        })
        .catch((err) => {
          callback(null, err);
        });
    });

    socket.on('NEW_TAB', (data, callback) => {
      controllers.messages
        .post(data.message)
        .then(() => {
          socket.broadcast.to(data.message.room).emit('CREATED_TAB', data);
          callback('success');
        })
        .catch((err) => callback('fail', err));
    });

    socket.on('UPDATED_REFERENCES', (data) => {
      const { roomId, updatedEvents } = data;
      console.log('emitting updating refs', roomId, updatedEvents);

      socket.broadcast
        .to(roomId)
        .emit('RECEIVED_UPDATED_REFERENCES', updatedEvents);
    });

    const leaveRoom = function(color, cb) {
      const room = Object.keys(socket.rooms).pop();
      controllers.rooms
        .removeCurrentUsers(room, socket.user_id)
        .then((res) => {
          let removedMember = {};
          if (res && res.currentMembers) {
            const currentMembers = res.currentMembers.filter((member) => {
              if (socket.user_id.toString() === member._id.toString()) {
                removedMember = member;
                return false;
              }
              return true;
            });
            const message = new Message({
              color,
              room,
              user: { _id: removedMember._id, username: 'VMTBot' },
              text: `${removedMember.username} left the room`,
              messageType: 'LEFT_ROOM',
              autogenerated: true,
              timestamp: new Date().getTime(),
            });
            let releasedControl = false;
            // parse to string becayse it is an objectId
            if (
              res.controlledBy &&
              res.controlledBy.toString() === socket.user_id
            ) {
              controllers.rooms.put(room, { controlledBy: null });
              releasedControl = true;
            }
            message.save();
            socket
              .to(room)
              .emit('USER_LEFT', { currentMembers, releasedControl, message });
            // delete socket.rooms;
            // This function can be invoked by the LEAVE_ROOM handler or by disconnecting...in the case of disconnecting
            // there is no callback because
            if (cb) {
              cb('exited!', null);
            }
          }
        })
        .catch((err) => {
          if (socket.user) {
            console.log(
              'ERROR LEAVING ROOM ',
              room,
              ' user: ',
              socket.user._id
            );
          } else {
            console.log('ERROR LEAVING ROOM ', room, ' user not found!');
          }
          console.log('socketid: ', socket.id);
          if (cb) cb(null, err);
        });
    };
  });
};

// const parseXML = (xml) => {
//   return new Promise((resolve, reject) => {
//     parseString(xml, (err, result) => {
//       if (err) return reject(err);
//       return resolve(result);
//     });
//   });
// };
