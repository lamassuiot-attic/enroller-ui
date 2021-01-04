import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';

import { Grid, Paper } from '@material-ui/core';

import CSRBox from './csr-box';

describe('<CSRBox />', () => {
  let shallow = null;

  beforeAll(() => {
    shallow = createShallow();
  });

  it('CSR Box rendering', () => {
    const mockOnCSRUpdate = jest.fn();
    const wrapper = shallow(<CSRBox onCSRUpdate={mockOnCSRUpdate} />);

    expect(wrapper.find(Paper)).toHaveLength(1);
    expect(wrapper.find(Grid)).toHaveLength(3);
  });
});
