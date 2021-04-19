import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';

import { Dialog } from '@material-ui/core';

import CSRModal from './csr-modal';

describe('<CSRModal />', () => {
  let shallow = null;

  beforeAll(() => {
    shallow = createShallow();
  });

  it('CSRModal modal rendering', () => {
    const mockOnCSRUpdate = jest.fn();
    const mockOnModalChange = jest.fn();
    const wrapper = shallow(
      <CSRModal
        onCSRUpdate={mockOnCSRUpdate}
        onModalChange={mockOnModalChange}
        open={true}
      />
    );
    expect(wrapper.find(Dialog)).toHaveLength(1);
  });

  it('CSRModal modal not opened', () => {
    const mockOnCSRUpdate = jest.fn();
    const mockOnModalChange = jest.fn();
    const wrapper = shallow(
      <CSRModal
        onCSRUpdate={mockOnCSRUpdate}
        onModalChange={mockOnModalChange}
        open={false}
      />
    );
    expect(wrapper.find(Dialog).props().open).toBe(false);
  });

  it('CSRModal modal opened', () => {
    const mockOnCSRUpdate = jest.fn();
    const mockOnModalChange = jest.fn();
    const wrapper = shallow(
      <CSRModal
        onCSRUpdate={mockOnCSRUpdate}
        onModalChange={mockOnModalChange}
        open={true}
      />
    );
    expect(wrapper.find(Dialog).props().open).toBe(true);
  });
});
