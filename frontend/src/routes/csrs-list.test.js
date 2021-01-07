import React from 'react';
import { createMount } from '@material-ui/core/test-utils';
import { act } from 'react-dom/test-utils';

import CSRsList from './csrs-list';
import AlertBar from '../components/alert-bar';
import CSRBox from '../components/csr-box';

import {
  updateKeycloakToken,
  isAuthorized,
  AuthorizedElement,
} from '../services/auth/auth';
import { getCSRs } from '../services/api/enroller';

jest.mock('../services/api/enroller');
jest.mock('../services/auth/auth');

describe('<CSRsList />', () => {
  const fakeCSRs = {
    _embedded: {
      csr: [
        {
          id: 1,
          cn: 'test',
          status: 'test',
          c: 'test',
          st: 'test',
          l: 'test',
          o: 'test',
          ou: 'test',
          mail: 'test',
          csrpath: 'test',
        },
        {
          id: 2,
          cn: 'test',
          status: 'test',
          c: 'test',
          st: 'test',
          l: 'test',
          o: 'test',
          ou: 'test',
          mail: 'test',
          csrpath: 'test',
        },
      ],
    },
  };

  let mount = null;

  beforeAll(() => {
    mount = createMount();
  });

  afterAll(() => {
    mount.cleanUp();
  });

  beforeEach(() => {
    updateKeycloakToken.mockImplementation(() => {
      return { success: (callback) => callback() };
    });

    getCSRs.mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(fakeCSRs),
      });
    });

    isAuthorized.mockImplementation(() => {
      return true;
    });

    AuthorizedElement.mockImplementation(({ roles, children }) => {
      return isAuthorized(roles) && children;
    });
  });

  it('CSRsList rendering with no error', async () => {
    let wrapper;
    await act(async () => {
      wrapper = mount(<CSRsList />);
    });
    wrapper.update();

    expect(wrapper.find(CSRBox)).toHaveLength(2);
  });

  it('CSRsList redering empty', async () => {
    getCSRs.mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });

    let wrapper;
    await act(async () => {
      wrapper = mount(<CSRsList />);
    });
    wrapper.update();

    expect(wrapper.find(CSRBox)).toHaveLength(0);
  });

  it('CSRsLists with Enroller API error', async () => {
    getCSRs.mockImplementation(() => {
      return Promise.resolve({
        ok: false,
        text: () => Promise.resolve('error from API'),
      });
    });

    let wrapper;
    await act(async () => {
      wrapper = mount(<CSRsList />);
    });
    wrapper.update();

    expect(wrapper.find(AlertBar)).toHaveLength(1);
    expect(wrapper.find(AlertBar).prop('type')).toBe('error');
  });
});
