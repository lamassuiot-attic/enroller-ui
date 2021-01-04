import React from 'react';
import { createMount } from '@material-ui/core/test-utils';
import { act } from 'react-dom/test-utils';

import { HashRouter } from 'react-router-dom';

import { AppBar, Typography, Toolbar, Button, Avatar } from '@material-ui/core';
import { isAuthorized, AuthorizedElement } from '../../services/auth/auth';

import LamassuAppBar from './app-bar';

jest.mock('../../services/auth/auth');

describe('<LamassuAppBar />', () => {
  let mount = null;

  beforeAll(() => {
    mount = createMount();
  });

  afterAll(() => {
    mount.cleanUp();
  });

  beforeEach(() => {
    isAuthorized.mockImplementation(() => {
      return true;
    });

    AuthorizedElement.mockImplementation(({ roles, children }) => {
      return isAuthorized(roles) && children;
    });
  });

  it('App Bar rendering with all privileges', async () => {
    let wrapper;

    await act(async () => {
      wrapper = mount(
        <HashRouter>
          <LamassuAppBar />
        </HashRouter>
      );
    });
    wrapper.update();

    expect(wrapper.find(AppBar)).toHaveLength(1);
    expect(wrapper.find(Toolbar)).toHaveLength(1);
    expect(wrapper.find(Button)).toHaveLength(5);
    expect(wrapper.find(Typography)).toHaveLength(1);
    expect(wrapper.find(Avatar)).toHaveLength(1);
  });

  it('App Bar rendering with admin privileges', async () => {
    let wrapper;

    isAuthorized.mockImplementation((roles) => {
      return roles.some((role) => role == 'admin');
    });

    await act(async () => {
      wrapper = mount(
        <HashRouter>
          <LamassuAppBar />
        </HashRouter>
      );
    });
    wrapper.update();

    expect(wrapper.find(AppBar)).toHaveLength(1);
    expect(wrapper.find(Toolbar)).toHaveLength(1);
    expect(wrapper.find(Button)).toHaveLength(4);
    expect(wrapper.find(Typography)).toHaveLength(1);
    expect(wrapper.find(Avatar)).toHaveLength(1);
  });

  it('App Bar rendering with operator privileges', async () => {
    let wrapper;

    isAuthorized.mockImplementation((roles) => {
      return roles.some((role) => role == 'operator');
    });

    await act(async () => {
      wrapper = mount(
        <HashRouter>
          <LamassuAppBar />
        </HashRouter>
      );
    });
    wrapper.update();

    expect(wrapper.find(AppBar)).toHaveLength(1);
    expect(wrapper.find(Toolbar)).toHaveLength(1);
    expect(wrapper.find(Button)).toHaveLength(3);
    expect(wrapper.find(Typography)).toHaveLength(1);
    expect(wrapper.find(Avatar)).toHaveLength(1);
  });
});
