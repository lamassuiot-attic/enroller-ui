import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';

import { Button } from '@material-ui/core';

import CSRModalEdit from './csr-modal-edit';


describe('<CSRModalEdit />', () => {
    let shallow = null;

    beforeAll(() => {
        shallow = createShallow();
    });
    
    it("CSRModalEdit rendering", () => {
        const mockOnCSRStatusChange = jest.fn();
        const wrapper = shallow(<CSRModalEdit onCSRStatusChange={mockOnCSRStatusChange}/>);
        expect(wrapper.find(Button)).toHaveLength(3);
    });
});

