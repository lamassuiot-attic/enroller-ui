import React from 'react';
import { createMount } from '@material-ui/core/test-utils';
import { act } from 'react-dom/test-utils';

import * as auth from '../services/auth';
import { CircularProgress } from '@material-ui/core';

import CSRsList from './csrs-list';

describe('<CSRsList />', () => {
    let mount = null;

    beforeAll(() => {
        mount = createMount();
    });

    afterAll(() => {
        mount.cleanUp();
    });
        
    it("CSRsList rendering with no error", async () => {
        const fakeCSRs = {"_embedded": 
            {"csr": [{
                "id": 1,
                "cn": "test",
                "status": "test",
                "c": "test",
                "st": "test",
                "l": "test",
                "o": "test",
                "ou": "test",
                "mail": "test",
                "csrpath": "test"
                }, {
                    "id": 2,
                    "cn": "test",
                    "status": "test",
                    "c": "test",
                    "st": "test",
                    "l": "test",
                    "o": "test",
                    "ou": "test",
                    "mail": "test",
                    "csrpath": "test"
                }]
            }
        };

        jest.spyOn(global, "fetch").mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve(fakeCSRs)
            })
        );

        const getKeycloakTokenSpy = jest.spyOn(auth, 'getKeycloakToken').mockImplementation(() => {});

        let wrapper;
        await act(async () => {
            wrapper = mount(<CSRsList/>);
        });
        wrapper.update();
        
        expect(wrapper.find(CircularProgress)).toHaveLength(0);

        global.fetch.mockRestore();
        getKeycloakTokenSpy.mockRestore();
    });

});

