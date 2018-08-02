import * as actionTypes from '../actions/actionTypes';

const initialState = {
  username: '',
  userId: '',
  loggedIn: false,
  loggingIn: false,
  myRooms: [],
  myCourses: [],
  myCourseTemplates: [],
  myRoomTemplates: [],
  loginError: '',
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_START:
      return {
        ...state,
        loggingIn: true,
      };
    case actionTypes.LOGIN_FAIL:
      return {
        ...state,
        loggingIn: false,
        loginError: action.error,
      };
    case actionTypes.LOGIN_SUCCESS:
      // login authentication
      return {
        ...state,
        loggedIn: true,
        loggingIn: false,
        username: action.user.username,
        myRooms: action.user.rooms,
        myCourses: action.user.courses,
        myCourseTemplates: action.user.courseTemplates,
        userId: action.user._id,
      }
    case actionTypes.UPDATE_USER_ROOMS:
      return {
        ...state,
        myRooms: [action.newRoom, ...state.myRooms]
      }
    case actionTypes.UPDATE_USER_COURSES:
      return {
        ...state,
        myCourses: [action.newCourse, ...state.myCourses]
      }
    case actionTypes.UPDATE_USER_COURSE_TEMPLATES:
      return {
        ...state,
        myCourseTemplates: [action.newTemplate, ...state.myCourseTemplates],
      }
    case actionTypes.UPDATE_USER_ROOM_TEMPLATES:
      return {
        ...state,
        myRoomTemplates: [action.newTemplate, ...state.myRoomTemplates]
      }
    case actionTypes.CLEAR_ERROR:
      return {
        ...state,
        loginError: '',
      }
    default:
      return state
  }
};

export default reducer;
