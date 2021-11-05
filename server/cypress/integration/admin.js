const Q = require('../fixtures/user7');

const adminColor = 'rgb(255, 213, 73)';
const normalColor = 'rgb(45, 145, 242)';

const checkAdminMode = (isOn) => {
  const color = isOn ? adminColor : normalColor;
  cy.get('.fa-user')
    .first()
    .should('have.css', 'background-color')
    .and('eq', color);
};

describe('test admin privileges', function() {
  before(function() {
    cy.task('restoreAll').then(() => cy.login(Q));
  });

  after(function() {
    cy.logout();
  });

  it('Q accesses a room he does not belong to', function() {
    cy.contains('Community').click();
    cy.getTestElement('content-box-room 2').click();
    cy.getTestElement('view-as-admin').click();
    cy.url().should('include', 'myVMT/rooms/5ba289c57223b9429888b9b6/details');
    checkAdminMode(true);
  });

  it('Q can edit and delete this room', function() {
    cy.getTestElement('edit-room').click();
    cy.getTestElement('edit-instructions').type('new instructions');
    cy.getTestElement('save-room').click();
    cy.contains('new instructions').should('exist');
    cy.getTestElement('edit-room').click();
    cy.getTestElement('trash-room').click();
    cy.getTestElement('confirm-trash').click();
    cy.url().should('include', 'myVMT/rooms');
    cy.contains('Community').click();
    cy.getTestElement('content-box-room 2').should('not.exist');
  });

  it('Q accesses a course he does not belong to', function() {
    cy.contains('Courses').click();
    cy.getTestElement('content-box-course 1').click();
    // cy.getTestElement('view-as-admin').click();
    cy.url().should('include', 'courses/5bbb82f72539b95500cf526e/rooms');
  });

  it('Q can edit and delete this course', function() {
    cy.getTestElement('edit-course').click();
    cy.getTestElement('edit-description').type('new description');
    cy.getTestElement('save-course').click();
    cy.contains('new description').should('exist');
    cy.getTestElement('edit-course').click();
    cy.getTestElement('trash-course').click();
    cy.getTestElement('confirm-trash').click();
    cy.url().should('include', 'myVMT/courses');
    cy.contains('Community').click();
    cy.contains('Courses').click();
    cy.getTestElement('content-box-course 1').should('not.exist');
  });

  it('Q accesses an activity he does not belong to', function() {
    cy.contains('Templates').click();
    cy.getTestElement('content-box-ACTIVITY 2').click();
    cy.url().should(
      'include',
      'myVMT/activities/5be1f0c83efa5f308cefb4c0/details'
    );
  });

  it('Q can edit and delete this activity', function() {
    cy.getTestElement('edit-template').click();
    cy.getTestElement('edit-description').type('new description');
    cy.getTestElement('save-template').click();
    cy.contains('new description').should('exist');
    cy.getTestElement('edit-template').click();
    cy.getTestElement('trash-template').click();
    cy.getTestElement('confirm-trash').click();
    cy.url().should('include', 'myVMT/templates');
    cy.contains('Community').click();
    cy.contains('Templates').click();
    cy.getTestElement('content-box-ACTIVITY 2').should('not.exist');
  });

  it('Q makes picard an admin', function() {
    cy.getTestElement('nav-Profile').click({ force: true });
    cy.url().should('include', 'profile');
    cy.getTestElement('admin-list')
      .children()
      .should('have.length', 1);
    cy.getTestElement('member-search').type('picard');
    cy.getTestElement('invite-member-jl_picard').click();
    cy.getTestElement('admin-list')
      .children()
      .should('have.length', 2);
  });

  it('Q turns admin mode on for anonymous viewing', function() {
    cy.getTestElement('edit-Off').click();
    cy.get('.fa-user')
      .first()
      .should('have.css', 'background-color')
      .and('eq', 'rgb(45, 145, 242)');
    cy.getTestElement('edit-On').click();
    cy.get('.fa-user')
      .first()
      .should('have.css', 'background-color')
      .and('eq', 'rgb(255, 213, 73)');
    cy.contains('My VMT').click();
    cy.contains("Q's Admin Room").click();
    cy.getTestElement('Enter').click();
    cy.contains('You are currently in "Admin Mode"').should('exist');
  });
});
