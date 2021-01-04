import React from 'react';
import { createMount } from '@material-ui/core/test-utils';
import { act } from 'react-dom/test-utils';

import { TableContainer, Button } from '@material-ui/core';

import CertsTable from './certs-table';
import AlertBar from '../../components/alert-bar';

import { updateKeycloakToken } from '../../services/auth/auth';
import { getCRTs, revokeCRT } from '../../services/api/scep';

jest.mock('../../services/api/scep');
jest.mock('../../services/auth/auth');

describe('<CertsTable />', () => {
  const fakeCRTs = {
    CRTs: {
      CRTs: [
        {
          dn: 'test',
          status: 'test',
          expirationDate: '210203104455Z',
          revocationDate: '',
          serial: 1,
          filename: 'test.pem',
        },
        {
          dn: 'test1',
          status: 'test',
          expirationDate: '210203104455Z',
          revocationDate: '',
          serial: 2,
          filename: 'test.pem',
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
      return Promise.resolve();
    });

    getCRTs.mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(fakeCRTs),
      });
    });
  });

  it('CertsTable rendering with no error', async () => {
    let wrapper;
    await act(async () => {
      wrapper = mount(<CertsTable />);
    });
    wrapper.update();

    expect(wrapper.find(TableContainer)).toHaveLength(1);
  });

  it('CertsTable redering empty', async () => {
    getCRTs.mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });

    let wrapper;
    await act(async () => {
      wrapper = mount(<CertsTable />);
    });
    wrapper.update();

    expect(wrapper.find(AlertBar)).toHaveLength(1);
    expect(wrapper.find(AlertBar).prop('type')).toBe('error');
  });

  it('CertsTable rendering with SCEP API error', async () => {
    getCRTs.mockImplementation(() => {
      return Promise.resolve({
        ok: false,
        text: () => Promise.resolve('error from API'),
      });
    });

    let wrapper;
    await act(async () => {
      wrapper = mount(<CertsTable />);
    });
    wrapper.update();

    expect(wrapper.find(AlertBar)).toHaveLength(1);
    expect(wrapper.find(AlertBar).prop('type')).toBe('error');
  });

  it('CertsTable revoke with no error', async () => {
    revokeCRT.mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });

    let wrapper;
    await act(async () => {
      wrapper = mount(<CertsTable />);
    });
    wrapper.update();

    const revokeButton = wrapper.find(Button);

    await act(async () => {
      revokeButton.props().onClick();
    });
    expect(revokeCRT).toHaveBeenCalledTimes(1);
    wrapper.update();
    expect(wrapper.find(AlertBar)).toHaveLength(1);
    expect(wrapper.find(AlertBar).prop('type')).toBe('success');
  });

  it('CertsTable revoke with error', async () => {
    revokeCRT.mockImplementation(() => {
      return Promise.resolve({
        ok: false,
        text: () => Promise.resolve('Error from SCEP API'),
      });
    });

    let wrapper;
    await act(async () => {
      wrapper = mount(<CertsTable />);
    });
    wrapper.update();

    const revokeButton = wrapper.find(Button);

    await act(async () => {
      revokeButton.props().onClick();
    });

    expect(revokeCRT).toHaveBeenCalledTimes(2);
    wrapper.update();
    expect(wrapper.find(AlertBar)).toHaveLength(1);
    expect(wrapper.find(AlertBar).prop('type')).toBe('error');
  });
});
