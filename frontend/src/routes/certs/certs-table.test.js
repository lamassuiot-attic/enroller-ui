import React from 'react';
import { createMount } from '@material-ui/core/test-utils';
import { act } from 'react-dom/test-utils';

import { TableContainer, CircularProgress, Snackbar } from '@material-ui/core';

import CertsTable from './certs-table';
import * as auth from '../../services/auth';

describe('<CertsTable />', () => {
    let mount = null;

    beforeAll(() => {
        mount = createMount();
    });

    afterAll(() => {
        mount.cleanUp();
    });
        
    it("CertsTable rendering with no error", async () => {
        const fakeCRTs = {"CRTs": 
            {"CRTs": [{
                    "dn": 'test',
                    'status': 'test',
                    'expirationDate': '210203104455Z',
                    'revocationDate': '',
                    'serial': 1,
                    'filename': 'test.pem'
                },
                {
                    "dn": 'test1',
                    'status': 'test',
                    'expirationDate': '210203104455Z',
                    'revocationDate': '',
                    'serial': 2,
                    'filename': 'test.pem'
                }]
            }
        };

        jest.spyOn(global, "fetch").mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve(fakeCRTs)
            })
        );

        const getKeycloakTokenSpy = jest.spyOn(auth, 'getKeycloakToken').mockImplementation(() => {});

        let wrapper;
        await act(async () => {
            wrapper = mount(<CertsTable/>);
        });
        
        expect(wrapper.find(CircularProgress)).toHaveLength(1);

        wrapper.update();
        
        expect(wrapper.find(CircularProgress)).toHaveLength(0);
        expect(wrapper.find(TableContainer)).toHaveLength(1);

        global.fetch.mockRestore();
        getKeycloakTokenSpy.mockRestore();
    });

    it("CertsTable rendering with error", async () => {
        jest.spyOn(global, "fetch").mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.reject({error: 'Test error'})
            })
        );

        const getKeycloakTokenSpy = jest.spyOn(auth, 'getKeycloakToken').mockImplementation(() => {});

        let wrapper;
        await act(async () => {
            wrapper = mount(<CertsTable/>);
        });

        wrapper.update();
        
        expect(wrapper.find(CircularProgress)).toHaveLength(0);
        expect(wrapper.find(TableContainer)).toHaveLength(0);

        global.fetch.mockRestore();
        getKeycloakTokenSpy.mockRestore();
    });

});

