import React from 'react';
import { createMount } from '@material-ui/core/test-utils';
import { act } from 'react-dom/test-utils';

import { Button } from '@material-ui/core';

import CSRModalEdit from './csr-modal-edit';
import CSRModal from '../csr-modal';
import AlertBar from '../alert-bar';
import { updateKeycloakToken } from '../../services/auth/auth';
import {
  downloadCRT,
  acceptCSR,
  denyCSR,
  removeCSR,
  revokeCSR,
} from '../../services/api/enroller';

jest.mock('../../services/auth/auth');
jest.mock('../../services/api/enroller');

describe('<CSRModalEdit />', () => {
  let mount = null;

  const mockHandleInputChange = (operation) => {
    return operation;
  };

  beforeAll(() => {
    mount = createMount();
  });

  afterAll(() => {
    mount.cleanUp();
  });

  beforeEach(() => {
    updateKeycloakToken.mockImplementation(() => {
      return { success: (callback) => callback() };
    });
  });

  it('CSRModalEdit NEW options rendering', async () => {
    const mockOnCSRStatusChange = jest.fn();
    const fakeCSR = {
      id: 1,
      status: 'NEW',
    };
    let wrapper;

    await act(async () => {
      wrapper = mount(
        <CSRModalEdit onCSRStatusChange={mockOnCSRStatusChange} csr={fakeCSR} />
      );
    });
    wrapper.update();

    expect(wrapper.find(Button)).toHaveLength(2);
  });

  it('CSRModalEdit DENIED options redering', async () => {
    const mockOnCSRStatusChange = jest.fn();
    const fakeCSR = {
      id: 1,
      status: 'DENIED',
    };
    let wrapper;

    await act(async () => {
      wrapper = mount(
        <CSRModalEdit onCSRStatusChange={mockOnCSRStatusChange} csr={fakeCSR} />
      );
    });
    wrapper.update();

    expect(wrapper.find(Button)).toHaveLength(1);
  });

  it('CSRModalEdit APPROBED options redering', async () => {
    const mockOnCSRStatusChange = jest.fn();
    const fakeCSR = {
      id: 1,
      status: 'APPROBED',
    };
    let wrapper;

    await act(async () => {
      wrapper = mount(
        <CSRModalEdit onCSRStatusChange={mockOnCSRStatusChange} csr={fakeCSR} />
      );
    });
    wrapper.update();

    expect(wrapper.find(Button)).toHaveLength(2);
  });

  it('CSRModalEdit REVOKED options redering', async () => {
    const mockOnCSRStatusChange = jest.fn();
    const fakeCSR = {
      id: 1,
      status: 'REVOKED',
    };
    let wrapper;

    await act(async () => {
      wrapper = mount(
        <CSRModalEdit onCSRStatusChange={mockOnCSRStatusChange} csr={fakeCSR} />
      );
    });
    wrapper.update();

    expect(wrapper.find(Button)).toHaveLength(1);
  });

  it('CSRModalEdit rendering with correct CRT download', async () => {
    downloadCRT.mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        blob: () => Promise.resolve('test CRT blob'),
      });
    });
    window.URL.createObjectURL = jest.fn();
    const mockOnCSRStatusChange = jest.fn();
    const fakeCSR = {
      id: 1,
      status: 'APPROBED',
    };
    let wrapper;

    await act(async () => {
      wrapper = mount(
        <CSRModalEdit onCSRStatusChange={mockOnCSRStatusChange} csr={fakeCSR} />
      );
    });
    wrapper.update();

    expect(wrapper.find(Button)).toHaveLength(2);

    const downloadButton = wrapper.find(Button).first();

    await act(async () => {
      downloadButton.props().onClick();
    });

    expect(downloadCRT).toHaveBeenCalledTimes(1);
    window.URL.createObjectURL.mockReset();
  });

  it('CSRModalEdit rendering with CRT download error', async () => {
    downloadCRT.mockImplementation(() => {
      return Promise.resolve({
        ok: false,
        text: () => Promise.resolve('error downloading CRT'),
      });
    });
    window.URL.createObjectURL = jest.fn();
    const mockOnCSRStatusChange = jest.fn();
    const fakeCSR = {
      id: 1,
      status: 'APPROBED',
    };
    let wrapper;

    await act(async () => {
      wrapper = mount(
        <CSRModalEdit onCSRStatusChange={mockOnCSRStatusChange} csr={fakeCSR} />
      );
    });
    wrapper.update();

    expect(wrapper.find(Button)).toHaveLength(2);

    const downloadButton = wrapper.find(Button).first();

    await act(async () => {
      downloadButton.props().onClick();
    });

    expect(downloadCRT).toHaveBeenCalledTimes(2);
    wrapper.update();
    expect(wrapper.find(AlertBar)).toHaveLength(1);
    expect(wrapper.find(AlertBar).prop('type')).toBe('error');
    window.URL.createObjectURL.mockReset();
  });

  it('CSRModalEdit rendering with APPROBE operation', async () => {
    const fakeCSR = {
      id: 1,
      status: 'NEW',
    };
    let wrapper;
    const mockOnCSRStatusChange = jest.fn(mockHandleInputChange);

    await act(async () => {
      wrapper = mount(
        <CSRModalEdit onCSRStatusChange={mockOnCSRStatusChange} csr={fakeCSR} />
      );
    });
    wrapper.update();

    expect(wrapper.find(Button)).toHaveLength(2);

    const approbeButton = wrapper.find(Button).first();

    await act(async () => {
      approbeButton.props().onClick();
    });

    expect(mockOnCSRStatusChange).toBeCalled();
    expect(mockOnCSRStatusChange.mock.results[0].value).toBe(acceptCSR);
  });

  it('CSRModalEdit rendering with DENY operation', async () => {
    const fakeCSR = {
      id: 1,
      status: 'NEW',
    };
    let wrapper;
    const mockOnCSRStatusChange = jest.fn(mockHandleInputChange);

    await act(async () => {
      wrapper = mount(
        <CSRModalEdit onCSRStatusChange={mockOnCSRStatusChange} csr={fakeCSR} />
      );
    });
    wrapper.update();

    expect(wrapper.find(Button)).toHaveLength(2);

    const denyButton = wrapper.find(Button).last();

    await act(async () => {
      denyButton.props().onClick();
    });

    expect(mockOnCSRStatusChange).toBeCalled();
    expect(mockOnCSRStatusChange.mock.results[0].value).toBe(denyCSR);
  });

  it('CSRModalEdit rendering with REMOVE operation', async () => {
    const fakeCSR = {
      id: 1,
      status: 'DENIED',
    };
    let wrapper;
    const mockOnCSRStatusChange = jest.fn(mockHandleInputChange);

    await act(async () => {
      wrapper = mount(
        <CSRModalEdit onCSRStatusChange={mockOnCSRStatusChange} csr={fakeCSR} />
      );
    });
    wrapper.update();

    expect(wrapper.find(Button)).toHaveLength(1);

    const removeButton = wrapper.find(Button);

    await act(async () => {
      removeButton.props().onClick();
    });

    expect(mockOnCSRStatusChange).toBeCalled();
    expect(mockOnCSRStatusChange.mock.results[0].value).toBe(removeCSR);
  });

  it('CSRModalEdit rendering with REVOKE operation', async () => {
    const fakeCSR = {
      id: 1,
      status: 'APPROBED',
    };
    let wrapper;
    const mockOnCSRStatusChange = jest.fn(mockHandleInputChange);

    await act(async () => {
      wrapper = mount(
        <CSRModalEdit onCSRStatusChange={mockOnCSRStatusChange} csr={fakeCSR} />
      );
    });
    wrapper.update();

    expect(wrapper.find(Button)).toHaveLength(2);

    const revokeButton = wrapper.find(Button).last();

    await act(async () => {
      revokeButton.props().onClick();
    });

    expect(mockOnCSRStatusChange).toBeCalled();
    expect(mockOnCSRStatusChange.mock.results[0].value).toBe(revokeCSR);
  });
});
