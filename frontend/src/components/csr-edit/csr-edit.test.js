import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';

import { Button, Grid } from '@material-ui/core';

import CSREdit from './csr-edit';

describe('<CSREdit />', () => {
    let shallow = null;
    
    beforeAll(() => {
        shallow = createShallow();
    });
    
    it("CSREdit rendering", () => {
        const mockOnCSRUpdate = jest.fn();
        const wrapper = shallow(<CSREdit onCSRUpdate={mockOnCSRUpdate}/>);
       
        expect(wrapper.find(Button)).toHaveLength(2);
        expect(wrapper.find(Grid)).toHaveLength(4);
    });
});

