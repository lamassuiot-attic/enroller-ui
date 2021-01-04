import React from 'react';
import { createMount } from '@material-ui/core/test-utils';
import { act } from 'react-dom/test-utils';

import { Button, Grid } from '@material-ui/core';

import {
  updateKeycloakToken,
  isAuthorized,
  AuthorizedElement,
} from '../../services/auth/auth';
import { downloadCSR, downloadCRT } from '../../services/api/enroller';

import CSREdit from './csr-edit';
import AlertBar from '../alert-bar';

jest.mock('../../services/auth/auth');
jest.mock('../../services/api/enroller');

describe('<CSREdit />', () => {
  let mount = null;

  beforeAll(() => {
    mount = createMount();
  });

  afterAll(() => {
    mount.cleanUp();
  });

  beforeEach(() => {
    updateKeycloakToken.mockImplementation(() => {
      return Promise.resolve();
    });

    isAuthorized.mockImplementation(() => {
      return true;
    });

    AuthorizedElement.mockImplementation(({ roles, children }) => {
      return isAuthorized(roles) && children;
    });
  });

  it('CSREdit rendering with all privileges', async () => {
    let wrapper;
    const fakeCSR = {
      id: 1,
      status: 'APPROBED',
    };
    const mockOnCSRUpdate = jest.fn();
    await act(async () => {
      wrapper = mount(<CSREdit onCSRUpdate={mockOnCSRUpdate} csr={fakeCSR} />);
    });
    wrapper.update();
    expect(wrapper.find(Button)).toHaveLength(3);
    expect(wrapper.find(Grid)).toHaveLength(4);
  });

  it('CSREdit rendering with admin privileges', async () => {
    let wrapper;
    const fakeCSR = {
      id: 1,
      status: 'APPROBED',
    };
    isAuthorized.mockImplementation((roles) => {
      return roles.some((role) => role == 'admin');
    });

    const mockOnCSRUpdate = jest.fn();
    await act(async () => {
      wrapper = mount(<CSREdit onCSRUpdate={mockOnCSRUpdate} csr={fakeCSR} />);
    });
    wrapper.update();

    expect(wrapper.find(Button)).toHaveLength(2);
    expect(wrapper.find(Grid)).toHaveLength(4);
  });

  it('CSREdit rendering with operator privileges', async () => {
    let wrapper;
    const fakeCSR = {
      id: 1,
      status: 'APPROBED',
    };
    isAuthorized.mockImplementation((roles) => {
      return roles.some((role) => role == 'operator');
    });

    const mockOnCSRUpdate = jest.fn();
    await act(async () => {
      wrapper = mount(<CSREdit onCSRUpdate={mockOnCSRUpdate} csr={fakeCSR} />);
    });
    wrapper.update();

    expect(wrapper.find(Button)).toHaveLength(1);
    expect(wrapper.find(Grid)).toHaveLength(1);
  });

  it('CSREdit rendering with correct CSR download', async () => {
    downloadCSR.mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        blob: () => Promise.resolve('test CSR blob'),
      });
    });
    window.URL.createObjectURL = jest.fn();

    let wrapper;
    const fakeCSR = {
      id: 1,
      status: 'APPROBED',
    };

    const mockOnCSRUpdate = jest.fn();
    await act(async () => {
      wrapper = mount(<CSREdit onCSRUpdate={mockOnCSRUpdate} csr={fakeCSR} />);
    });
    wrapper.update();

    const csrDownload = wrapper.find(Button).get(1);

    await act(async () => {
      csrDownload.props.onClick();
    });

    expect(downloadCSR).toHaveBeenCalledTimes(1);
    wrapper.update();
    expect(wrapper.find(AlertBar)).toHaveLength(0);
    window.URL.createObjectURL.mockReset();
  });

  it('CSREdit redering with download CSR error', async () => {
    downloadCSR.mockImplementation(() => {
      return Promise.resolve({
        ok: false,
        text: () => Promise.resolve('error downloading CSR'),
      });
    });
    window.URL.createObjectURL = jest.fn();

    let wrapper;
    const fakeCSR = {
      id: 1,
      status: 'APPROBED',
    };

    const mockOnCSRUpdate = jest.fn();
    await act(async () => {
      wrapper = mount(<CSREdit onCSRUpdate={mockOnCSRUpdate} csr={fakeCSR} />);
    });
    wrapper.update();

    const csrDownload = wrapper.find(Button).get(1);

    await act(async () => {
      csrDownload.props.onClick();
    });

    expect(downloadCSR).toHaveBeenCalledTimes(2);
    wrapper.update();
    expect(wrapper.find(AlertBar)).toHaveLength(1);
    expect(wrapper.find(AlertBar).prop('type')).toBe('error');
    window.URL.createObjectURL.mockReset();
  });

  it('CSREdit rendering with correct CRT download', async () => {
    downloadCRT.mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        blob: () => Promise.resolve('test CRT blob'),
      });
    });
    window.URL.createObjectURL = jest.fn();

    let wrapper;
    const fakeCSR = {
      id: 1,
      status: 'APPROBED',
    };

    const mockOnCSRUpdate = jest.fn();
    await act(async () => {
      wrapper = mount(<CSREdit onCSRUpdate={mockOnCSRUpdate} csr={fakeCSR} />);
    });
    wrapper.update();

    const csrDownload = wrapper.find(Button).get(2);

    await act(async () => {
      csrDownload.props.onClick();
    });

    expect(downloadCRT).toHaveBeenCalledTimes(1);
    wrapper.update();
    expect(wrapper.find(AlertBar)).toHaveLength(0);
    window.URL.createObjectURL.mockReset();
  });

  it('CSREdit rendering with CRT download error', async () => {
    downloadCRT.mockImplementation(() => {
      return Promise.resolve({
        ok: false,
        text: () => Promise.resolve('error downloading CRT'),
      });
    });
    window.URL.createObjectURL = jest.fn();

    let wrapper;
    const fakeCSR = {
      id: 1,
      status: 'APPROBED',
    };

    const mockOnCSRUpdate = jest.fn();
    await act(async () => {
      wrapper = mount(<CSREdit onCSRUpdate={mockOnCSRUpdate} csr={fakeCSR} />);
    });
    wrapper.update();

    const csrDownload = wrapper.find(Button).get(2);

    await act(async () => {
      csrDownload.props.onClick();
    });

    expect(downloadCRT).toHaveBeenCalledTimes(2);
    wrapper.update();
    expect(wrapper.find(AlertBar)).toHaveLength(1);
    expect(wrapper.find(AlertBar).prop('type')).toBe('error');
    window.URL.createObjectURL.mockReset();
  });
});
