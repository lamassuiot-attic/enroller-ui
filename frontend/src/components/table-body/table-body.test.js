import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';

import { TableRow } from '@material-ui/core';

import CertsTableBody from './table-body';


describe('<CertsTableBody />', () => {
    let shallow = null;

    beforeAll(() => {
        shallow = createShallow();
    });

    const mockCrts = [{
        "dn": 'test',
        'status': 'test',
        'expirationDate': '210203104455Z',
        'revocationDate': '',
        'serial': 1,
        'filename': 'test.pem'
    },
    {
        "dn": 'test',
        'status': 'test',
        'expirationDate': '210203104455Z',
        'revocationDate': '',
        'serial': 2,
        'filename': 'test.pem'
    }]
    
    it("CertsTableBody rendering without empty rows", () => {
        const mockOnHandleClick = jest.fn();
        const mockIsSelected = jest.fn();
        const wrapper = shallow(<CertsTableBody 
                                    onHandleClick={mockOnHandleClick} 
                                    isSelected={mockIsSelected}
                                    emptyRows={0}
                                    crts={mockCrts}
                                    order={'asc'}
                                    orderBy={'dn'}
                                    page={0}
                                    rowsPerPage={5}/>);
        expect(wrapper.find(TableRow)).toHaveLength(2);
    });

    it("CertsTableBody rendering with empty rows", () => {
        const mockOnHandleClick = jest.fn();
        const mockIsSelected = jest.fn();
        const wrapper = shallow(<CertsTableBody 
                                    onHandleClick={mockOnHandleClick} 
                                    isSelected={mockIsSelected}
                                    emptyRows={1}
                                    crts={mockCrts}
                                    order={'asc'}
                                    orderBy={'dn'}
                                    page={0}
                                    rowsPerPage={5}/>);
        expect(wrapper.find(TableRow)).toHaveLength(3);
    });
});

