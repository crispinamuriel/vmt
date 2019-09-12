/* 1 */
const { ObjectId, ISODate } = require('./utils');

module.exports = [
  {
    _id: ObjectId('5ba289c57223b9429888b9b5'),
    settings: {
      participantsCanCreateTabs: false,
      participantsCanChangePerspective: false,
      controlByTab: false,
    },
    chat: [],
    currentMembers: [],
    tabs: [ObjectId('5c98e1169b093c0c9812b2f2')],
    privacySetting: 'private',
    tempRoom: false,
    controlledBy: null,
    isTrashed: false,
    name: 'room 1',
    description: 'hello',
    members: [
      {
        color: '#f26247',
        _id: ObjectId('5d0d0f0a93908fe576b73ed1'),
        user: ObjectId('5ba289ba7223b9429888b9b4'),
        role: 'facilitator',
      },
    ],
    creator: ObjectId('5ba289ba7223b9429888b9b4'),
    entryCode: 'rare-shrimp-45',
    dueDate: null,
    image:
      'http://tinygraphs.com/spaceinvaders/room 1?theme=berrypie&numcolors=4&size=220&fmt=svg',
    createdAt: ISODate('2018-09-19T17:39:17.490Z'),
    updatedAt: ISODate('2018-09-19T17:39:17.490Z'),
    __v: 0,
  },

  /* 2 */
  {
    _id: ObjectId('5ba289c57223b9429888b9b7'),
    settings: {
      participantsCanCreateTabs: false,
      participantsCanChangePerspective: false,
      controlByTab: false,
    },
    chat: [],
    currentMembers: [],
    tabs: [ObjectId('5d3b493dca44f53a90a9ed35')],
    privacySetting: 'private',
    tempRoom: false,
    controlledBy: null,
    isTrashed: false,
    name: 'request access',
    description: 'hello',
    members: [
      {
        color: '#f26247',
        _id: ObjectId('5d0d0f0a93908fe576b73ed3'),
        user: ObjectId('5ba289ba7223b9429888b9b4'),
        role: 'facilitator',
      },
    ],
    creator: ObjectId('5ba289ba7223b9429888b9b4'),
    entryCode: 'rare-shrimp-10',
    dueDate: null,
    createdAt: ISODate('2018-09-19T17:39:17.490Z'),
    updatedAt: ISODate('2018-09-19T17:39:17.490Z'),
    __v: 0,
  },

  /* 3 */
  {
    _id: ObjectId('5ba289c57223b9429888b9b3'),
    settings: {
      participantsCanCreateTabs: false,
      participantsCanChangePerspective: false,
      controlByTab: false,
    },
    chat: [],
    currentMembers: [],
    tabs: [ObjectId('5d3b493dca44f53a90a9ed35')],
    privacySetting: 'private',
    tempRoom: false,
    controlledBy: null,
    isTrashed: false,
    name: 'wrong entry code room',
    description: 'hello',
    entryCode: 'hello',
    members: [
      {
        color: '#f26247',
        _id: ObjectId('5d0d0f0a93908fe576b73ed8'),
        user: ObjectId('5ba289ba7223b9429888b9b4'),
        role: 'facilitator',
      },
    ],
    creator: ObjectId('5ba289ba7223b9429888b9b4'),
    dueDate: null,
    createdAt: ISODate('2018-09-19T17:39:17.490Z'),
    updatedAt: ISODate('2018-09-19T17:39:17.490Z'),
    __v: 0,
  },

  /* 4 */
  {
    _id: ObjectId('5c2e58e4684f328cbca1d997'),
    settings: {
      participantsCanCreateTabs: false,
      participantsCanChangePerspective: false,
      controlByTab: false,
    },
    chat: [],
    currentMembers: [],
    tabs: [ObjectId('5c2e58e4684f328cbca1d998')],
    privacySetting: 'private',
    tempRoom: false,
    controlledBy: null,
    isTrashed: false,
    name: "Deanna's stand alone room",
    description: '',
    creator: ObjectId('5be1eba75854270cd0920faa'),
    image:
      'http://tinygraphs.com/spaceinvaders/gfggfg?theme=daisygarden&numcolors=4&size=220&fmt=svg',
    members: [
      {
        color: '#f26247',
        _id: ObjectId('5d0d0f0a93908fe576b73eda'),
        user: ObjectId('5be1eba75854270cd0920faa'),
        role: 'facilitator',
      },
    ],
    dueDate: null,
    createdAt: ISODate('2019-01-03T18:48:04.573Z'),
    updatedAt: ISODate('2019-01-03T18:48:04.573Z'),
    __v: 0,
  },

  /* 5 */
  {
    _id: ObjectId('5ba289c57223b9429888b9b6'),
    settings: {
      participantsCanCreateTabs: false,
      participantsCanChangePerspective: false,
      controlByTab: false,
    },
    chat: [],
    currentMembers: [],
    tabs: [ObjectId('5d3b493dca44f53a90a9ed35')],
    privacySetting: 'private',
    tempRoom: false,
    controlledBy: null,
    isTrashed: false,
    name: 'room 2',
    description: 'hello',
    entryCode: 'hello',
    members: [
      {
        color: '#f26247',
        _id: ObjectId('5d0d0f0a93908fe576b73ed6'),
        user: ObjectId('5ba289ba7223b9429888b9b4'),
        role: 'facilitator',
      },
      {
        color: '#f26247',
        _id: ObjectId('5d0d0f0a93908fe576b73ed5'),
        user: ObjectId('5bbbbd9a799302265829f5af'),
        role: 'participant',
      },
    ],
    creator: ObjectId('5ba289ba7223b9429888b9b4'),
    dueDate: null,
    createdAt: ISODate('2018-09-19T17:39:17.490Z'),
    updatedAt: ISODate('2018-09-19T17:39:17.490Z'),
    __v: 0,
  },

  /* 6 */
  {
    _id: ObjectId('5c2e58e4684f328cbca1d99f'),
    settings: {
      participantsCanCreateTabs: false,
      participantsCanChangePerspective: false,
      controlByTab: false,
    },
    chat: [],
    currentMembers: [],
    tabs: [ObjectId('5c2e58e4684f328cbca1d998')],
    privacySetting: 'public',
    tempRoom: false,
    controlledBy: null,
    isTrashed: false,
    name: "Deanna's course 1 room",
    description: '',
    creator: ObjectId('5be1eba75854270cd0920faa'),
    image:
      'http://tinygraphs.com/spaceinvaders/gfggfg?theme=daisygarden&numcolors=4&size=220&fmt=svg',
    members: [
      {
        color: '#f26247',
        _id: ObjectId('5d0d0f0a93908fe576b73edc'),
        user: ObjectId('5be1eba75854270cd0920faa'),
        role: 'facilitator',
      },
    ],
    entryCode: 'testEntrycode',
    dueDate: null,
    createdAt: ISODate('2019-01-03T18:48:04.573Z'),
    updatedAt: ISODate('2019-01-03T18:48:04.573Z'),
    __v: 0,
  },

  /* 7 */
  {
    _id: ObjectId('5c2e58e4684f328cbca1d99e'),
    settings: {
      participantsCanCreateTabs: false,
      participantsCanChangePerspective: false,
      controlByTab: false,
    },
    chat: [],
    currentMembers: [],
    tabs: [ObjectId('5c2e58e4684f328cbca1d998')],
    privacySetting: 'public',
    tempRoom: false,
    controlledBy: null,
    isTrashed: false,
    name: "Deanna's course 2 room",
    description: '',
    creator: ObjectId('5be1eba75854270cd0920faa'),
    image:
      'http://tinygraphs.com/spaceinvaders/gfggfg?theme=daisygarden&numcolors=4&size=220&fmt=svg',
    members: [
      {
        color: '#f26247',
        _id: ObjectId('5d0d0f0a93908fe576b73ede'),
        user: ObjectId('5be1eba75854270cd0920faa'),
        role: 'facilitator',
      },
    ],
    dueDate: null,
    createdAt: ISODate('2019-01-03T18:48:04.573Z'),
    updatedAt: ISODate('2019-01-03T18:48:04.573Z'),
    __v: 0,
  },

  /* 8 */
  {
    _id: ObjectId('5c2e58e4684f328cbca1dace'),
    settings: {
      participantsCanCreateTabs: false,
      participantsCanChangePerspective: false,
      controlByTab: false,
    },
    chat: [],
    currentMembers: [],
    tabs: [ObjectId('5c2e58e4684f328cbca1d998')],
    privacySetting: 'private',
    tempRoom: false,
    controlledBy: null,
    isTrashed: false,
    name: "Q's Admin Room",
    description: '',
    creator: ObjectId('5ba289ba7223b9429888b9ee'),
    image:
      'http://tinygraphs.com/spaceinvaders/gfggfg?theme=daisygarden&numcolors=4&size=220&fmt=svg',
    members: [
      {
        color: '#f26247',
        _id: ObjectId('5d0d0f0a93908fe576b73ee0'),
        user: ObjectId('5ba289ba7223b9429888b9ee'),
        role: 'facilitator',
      },
    ],
    dueDate: null,
    createdAt: ISODate('2019-01-03T18:48:04.573Z'),
    updatedAt: ISODate('2019-01-03T18:48:04.573Z'),
    __v: 0,
  },
  {
    _id: ObjectId('5d0d2ed0535e3a522445f7a7'),
    settings: {
      participantsCanCreateTabs: false,
      participantsCanChangePerspective: false,
      controlByTab: false,
    },
    chat: [
      ObjectId('5d0d2ee62d386ba92eb7e34c'),
      ObjectId('5d0d2eea65fc7fd8b17ccd19'),
      ObjectId('5d0d2efc5faad4ca26214f33'),
      ObjectId('5d0d2f0748e22b165488897c'),
      ObjectId('5d0d2f1634e454ff962b358f'),
      ObjectId('5d0d2f27e99a7ffce8aae28e'),
      ObjectId('5d0d2f2c535e3a522445f7c0'),
    ],
    currentMembers: [],
    tabs: [ObjectId('5d0d2ed0535e3a522445f7a9')],
    privacySetting: 'public',
    tempRoom: false,
    controlledBy: null,
    isTrashed: false,
    name: 'reference room',
    description: 'room for testing the reference tool',
    creator: ObjectId('5d0d2eae535e3a522445f7a4'),
    course: null,
    image:
      'http://tinygraphs.com/spaceinvaders/reference room?theme=heatwave&numcolors=4&size=220&fmt=svg',
    members: [
      {
        color: '#f26247',
        _id: ObjectId('5d0d2ed0535e3a522445f7a8'),
        user: ObjectId('5d0d2eae535e3a522445f7a4'),
        role: 'facilitator',
      },
    ],
    dueDate: null,
    createdAt: ISODate('2019-06-21T19:24:00.104Z'),
    updatedAt: ISODate('2019-06-21T19:25:32.404Z'),
    __v: 0,
  },
];
