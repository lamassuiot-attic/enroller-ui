import React from 'react';
import { createMount } from '@material-ui/core/test-utils';

import { Typography } from '@material-ui/core';

import CSRInfo from './csr-info';

describe('<CSRInfo />', () => {
  let mount = null;

  beforeAll(() => {
    mount = createMount();
  });

  afterAll(() => {
    mount.cleanUp();
  });

  var mockCSR = {
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
  };

  var mockCSREmpty = {
    id: 1,
    cn: 'test',
    status: 'test',
    c: 'test',
    st: 'test',
    l: 'test',
    o: 'test',
    ou: '',
    mail: '',
    csrpath: '',
  };

  it('CSRInfo rendering', () => {
    const wrapper = mount(<CSRInfo csr={mockCSR} />);
    expect(wrapper.find(Typography)).toHaveLength(3);
  });

  it('CSRInfo test rendering', () => {
    const wrapper = mount(<CSRInfo csr={mockCSR} />);
    expect(wrapper.find('h2').text()).toBe('ID: 1 CN: test Status: test');
    expect(wrapper.find('h3').first().text()).toBe(
      'C: test ST: test L: test O: test'
    );
    expect(wrapper.find('h4').first().text()).toBe(
      'OU: test EMAIL: test CSRFilePath: test'
    );
  });

  it('CSRInfo rendering without OU, EMAIL and CSRPath', () => {
    const wrapper = mount(<CSRInfo csr={mockCSREmpty} />);
    expect(wrapper.find('h4').first().text()).toBe('');
  });
});
