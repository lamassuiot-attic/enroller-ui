import React from 'react';
import { createMount } from '@material-ui/core/test-utils';

import {
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
} from '@material-ui/icons';
import { SnackbarContent } from '@material-ui/core';

import AlertBar from './alert-bar';

describe('<AlertBar />', () => {
  let mount = null;

  beforeAll(() => {
    mount = createMount();
  });

  afterAll(() => {
    mount.cleanUp();
  });

  it('error message rendering', () => {
    const mockSetMessage = jest.fn();
    const wrapper = mount(
      <AlertBar type="error" message="Error test" setMessage={mockSetMessage} />
    );
    expect(wrapper.find(SnackbarContent).text()).toBe('Error test');
  });

  it('error icon rendering', () => {
    const mockSetMessage = jest.fn();
    const wrapper = mount(
      <AlertBar type="error" message="Error test" setMessage={mockSetMessage} />
    );
    expect(wrapper.find(ErrorIcon)).toHaveLength(1);
  });

  it('success message rendering', () => {
    const mockSetMessage = jest.fn();
    const wrapper = mount(
      <AlertBar
        type="success"
        message="Success test"
        setMessage={mockSetMessage}
      />
    );
    expect(wrapper.find(SnackbarContent).text()).toBe('Success test');
  });

  it('success icon rendering', () => {
    const mockSetMessage = jest.fn();
    const wrapper = mount(
      <AlertBar
        type="success"
        message="Success test"
        setMessage={mockSetMessage}
      />
    );
    expect(wrapper.find(CheckCircleIcon)).toHaveLength(1);
  });
});
