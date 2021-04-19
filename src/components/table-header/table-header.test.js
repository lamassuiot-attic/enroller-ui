import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';

import { TableRow, TableCell } from '@material-ui/core';

import CertsTableHeader from './table-header';

describe('<CertsTableHeader />', () => {
  let shallow = null;

  beforeAll(() => {
    shallow = createShallow();
  });

  it('CertsTableHeader rendering', () => {
    const mockOnRequestSort = jest.fn();
    const wrapper = shallow(
      <CertsTableHeader
        onRequestSort={mockOnRequestSort}
        numSelected={0}
        order={'asc'}
        orderBy={'dn'}
        rowCount={2}
      />
    );
    expect(wrapper.find(TableRow)).toHaveLength(1);
    expect(wrapper.find(TableCell)).toHaveLength(9);
  });
});
