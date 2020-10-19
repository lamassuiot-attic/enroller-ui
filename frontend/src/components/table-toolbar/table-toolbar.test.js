import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import { Toolbar, Tooltip } from '@material-ui/core';

import CertsTableToolbar from './table-toolbar';

describe('<CertsTableToolbar />', () => {
    let shallow = null;

    beforeAll(() => {
        shallow = createShallow();
    });
        
    it("CertsTableToolbar rendering without selected", () => {
        const wrapper = shallow(<CertsTableToolbar numSelected={0}/>);
        
        expect(wrapper.find(Toolbar)).toHaveLength(1);
        expect(wrapper.find(Tooltip)).toHaveLength(1);
    });

    it("CertsTableToolbar rendering with selected", () => {
        const wrapper = shallow(<CertsTableToolbar numSelected={1}/>);
        
        expect(wrapper.find(Toolbar)).toHaveLength(1);
        expect(wrapper.find(Tooltip)).toHaveLength(0);
    })

});

