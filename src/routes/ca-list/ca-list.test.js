import React from 'react';
import { createMount } from '@material-ui/core/test-utils';
import { act } from 'react-dom/test-utils';

import { ListItem, Card, Button } from '@material-ui/core';

import CAsList from './ca-list';
import AlertBar from '../../components/alert-bar';
import { updateKeycloakToken } from '../../services/auth/auth';
import { getCAs, getCAInfo, deleteCA } from '../../services/api/ca';

jest.mock('../../services/api/ca');
jest.mock('../../services/auth/auth');

describe('<CAsList />', () => {
  const fakeCAInfo = {
    CAInfo: {
      cn: 'test',
      key_type: 'RSA',
      key_bits: 2048,
      c: 'test',
      st: 'test',
      l: 'test',
      o: 'test',
    },
  };

  const fakeCAs = {
    CAs: {
      CAs: [
        {
          ca_name: 'Lamassu CA1 RSA4096',
        },
        {
          ca_name: 'Lamassu CA2 RSA2048',
        },
        {
          ca_name: 'Lamassu CA3 ECC384',
        },
        {
          ca_name: 'Lamassu CA4 ECC256',
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

    getCAs.mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(fakeCAs),
      });
    });
  });

  it('CAsList redering with no error', async () => {
    let wrapper;
    await act(async () => {
      wrapper = mount(<CAsList />);
    });
    wrapper.update();

    expect(wrapper.find(ListItem)).toHaveLength(4);
  });

  it('CAsList rendering empty', async () => {
    getCAs.mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });

    let wrapper;
    await act(async () => {
      wrapper = mount(<CAsList />);
    });
    wrapper.update();

    expect(wrapper.find(ListItem)).toHaveLength(0);
  });

  it('CAsList rendering with CA API error', async () => {
    getCAs.mockImplementation(() => {
      return Promise.resolve({
        ok: false,
        text: () => Promise.resolve('error from API'),
      });
    });

    let wrapper;
    await act(async () => {
      wrapper = mount(<CAsList />);
    });
    wrapper.update();

    expect(wrapper.find(AlertBar)).toHaveLength(1);
    expect(wrapper.find(AlertBar).prop('type')).toBe('error');
    expect(wrapper.find(ListItem)).toHaveLength(0);
  });

  it('CAsList rendering with correct CA Info change', async () => {
    getCAInfo.mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(fakeCAInfo),
      });
    });

    let wrapper;
    await act(async () => {
      wrapper = mount(<CAsList />);
    });
    wrapper.update();

    const ca1 = wrapper.find(ListItem).first();

    await act(async () => {
      ca1.props().onClick();
    });
    expect(getCAInfo).toHaveBeenCalledTimes(1);
    wrapper.update();
    expect(wrapper.find(Card)).toHaveLength(1);
  });

  it('CAsList rendering with CA Info change error', async () => {
    getCAInfo.mockImplementation(() => {
      return Promise.resolve({
        ok: false,
        text: () => Promise.resolve('error from CA API'),
      });
    });

    let wrapper;
    await act(async () => {
      wrapper = mount(<CAsList />);
    });
    wrapper.update();

    const ca1 = wrapper.find(ListItem).first();

    await act(async () => {
      ca1.props().onClick();
    });
    expect(getCAInfo).toHaveBeenCalledTimes(2);
    wrapper.update();
    expect(wrapper.find(Card)).toHaveLength(0);
    expect(wrapper.find(AlertBar)).toHaveLength(1);
    expect(wrapper.find(AlertBar).prop('type')).toBe('error');
  });

  it('CAsList rendering with revoke correct', async () => {
    getCAInfo.mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(fakeCAInfo),
      });
    });

    deleteCA.mockImplementation(() => {
      return Promise.resolve({
        ok: true,
      });
    });

    let wrapper;
    await act(async () => {
      wrapper = mount(<CAsList />);
    });
    wrapper.update();

    expect(wrapper.find(Button).first().prop('disabled')).toBe(true);

    const ca1 = wrapper.find(ListItem).first();

    await act(async () => {
      ca1.props().onClick();
    });
    wrapper.update();

    expect(wrapper.find(Card)).toHaveLength(1);

    const revokeCA = wrapper.find(Button).last();

    await act(async () => {
      revokeCA.props().onClick();
    });
    wrapper.update();

    expect(deleteCA).toHaveBeenCalledTimes(1);
    expect(wrapper.find(AlertBar)).toHaveLength(1);
    expect(wrapper.find(AlertBar).prop('type')).toBe('success');
  });

  it('CAsList rendering with revoke error', async () => {
    getCAInfo.mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(fakeCAInfo),
      });
    });

    deleteCA.mockImplementation(() => {
      return Promise.resolve({
        ok: false,
      });
    });

    let wrapper;
    await act(async () => {
      wrapper = mount(<CAsList />);
    });
    wrapper.update();

    expect(wrapper.find(Button).first().prop('disabled')).toBe(true);

    const ca1 = wrapper.find(ListItem).first();

    await act(async () => {
      ca1.props().onClick();
    });
    wrapper.update();

    expect(wrapper.find(Card)).toHaveLength(1);

    const revokeCA = wrapper.find(Button).last();

    await act(async () => {
      revokeCA.props().onClick();
    });
    wrapper.update();

    expect(deleteCA).toHaveBeenCalledTimes(2);
    expect(wrapper.find(AlertBar)).toHaveLength(1);
    expect(wrapper.find(AlertBar).prop('type')).toBe('error');
  });

  it('CAsList rendering with register into cloud provider', async () => {
    getCAInfo.mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(fakeCAInfo),
      });
    });

    let wrapper;
    await act(async () => {
      wrapper = mount(<CAsList />);
    });
    wrapper.update();

    expect(wrapper.find(Button).first().prop('disabled')).toBe(true);

    const ca1 = wrapper.find(ListItem).first();

    await act(async () => {
      ca1.props().onClick();
    });
    wrapper.update();

    expect(wrapper.find(Card)).toHaveLength(1);

    const registerCA = wrapper.find(Button).first();

    await act(async () => {
      registerCA.props().onClick();
    });
    wrapper.update();

    expect(wrapper.find(AlertBar)).toHaveLength(1);
    expect(wrapper.find(AlertBar).prop('type')).toBe('success');
  });
});
