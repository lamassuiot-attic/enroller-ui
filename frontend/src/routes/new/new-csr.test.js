import React from 'react';
import { createMount } from '@material-ui/core/test-utils';
import { act } from 'react-dom/test-utils';

import { Container, Grid } from '@material-ui/core';

import NewCSR from './new-csr';
import AlertBar from '../../components/alert-bar';
import { updateKeycloakToken } from '../../services/auth/auth';
import { postCSR } from '../../services/api/enroller';

jest.mock('../../services/api/enroller');
jest.mock('../../services/auth/auth');

describe('<NewCSR />', () => {
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
  });

  it('NewCSR redering with no error', async () => {
    let wrapper;
    await act(async () => {
      wrapper = mount(<NewCSR />);
    });
    wrapper.update();

    expect(wrapper.find(Container)).toHaveLength(1);
    expect(wrapper.find(Grid)).toHaveLength(4);
  });

  it('NewCSR rendering with correct submit', async () => {
    const event = { preventDefault: () => {} };

    postCSR.mockImplementation(() => {
      return Promise.resolve({
        ok: true,
      });
    });

    let wrapper;
    await act(async () => {
      wrapper = mount(<NewCSR />);
    });
    wrapper.update();

    const form = wrapper.find('form');

    await act(async () => {
      form.props().onSubmit(event);
    });

    expect(postCSR).toHaveBeenCalledTimes(1);
    wrapper.update();
    expect(wrapper.find(Container)).toHaveLength(1);
    expect(wrapper.find(Grid)).toHaveLength(4);
    expect(wrapper.find(AlertBar)).toHaveLength(1);
    expect(wrapper.find(AlertBar).prop('type')).toBe('success');
  });

  it('NewCSR rendering with submit error', async () => {
    const event = { preventDefault: () => {} };

    postCSR.mockImplementation(() => {
      return Promise.resolve({
        ok: false,
        text: () => Promise.resolve('error from Enroller API'),
      });
    });

    let wrapper;
    await act(async () => {
      wrapper = mount(<NewCSR />);
    });
    wrapper.update();

    const form = wrapper.find('form');

    await act(async () => {
      form.props().onSubmit(event);
    });

    expect(postCSR).toHaveBeenCalledTimes(2);
    wrapper.update();

    expect(wrapper.find(Container)).toHaveLength(1);
    expect(wrapper.find(Grid)).toHaveLength(4);
    expect(wrapper.find(AlertBar)).toHaveLength(1);
    expect(wrapper.find(AlertBar).prop('type')).toBe('error');
  });
});
