/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useRef, useState } from 'react';
import DataTable, { Selector, TableColumn, TableStyles } from 'react-data-table-component';
import { EllipsisVertical, Eye, ListFilterIcon, UserCheck2, UserX } from 'lucide-react';
import OutsideClickHandler from 'react-outside-click-handler';
import { useNavigate } from 'react-router-dom';

import InputField from '../InputField/InputField';
import Select from '../Select/Select';
import routeNames from '../../../navigation/routeNames';
import { User, UserRow } from '../../../types/user.types';
import { formatDate } from '../../../utils/util-date';
import StatusBadge from './StatusBadge';

import './UserTable.scss';

// Users
// https://run.mocky.io/v3/49359cad-1020-4265-9ed1-e17118285de4
// https://designer.mocky.io/manage/delete/49359cad-1020-4265-9ed1-e17118285de4/CKiDUGmxdwu06evi7BfMm9oQBlsh0yzIODie

// User Stats
// https://run.mocky.io/v3/e7e457ca-c4e2-4854-88eb-ad958e293f05
// https://designer.mocky.io/manage/delete/e7e457ca-c4e2-4854-88eb-ad958e293f05/YrjwQo56MxxmPu3lEUZ8vLkSUyj1DJODc9Pt


interface TColumn extends TableColumn<UserRow> {
  selector: (row: UserRow) => any | Selector<UserRow>;
}

const columns: TColumn[] = [
  {
    name: (<div className='table-header-cell'>
      <span>ORGANIZATION</span>
      <ListFilterIcon style={{ width: '16px', height: '16px', marginLeft: '10px', marginBottom: '5px' }} />
    </div>),
    selector: row => row.organization,
    sortable: false,
    sortFunction: () => {
      return 0
    },
    grow: 6,
  },
  {
    name: (<div className='table-header-cell'>
      <span>USERNAME</span>
      <ListFilterIcon style={{ width: '16px', height: '16px', marginLeft: '10px', marginBottom: '5px' }} />
    </div>),
    selector: row => row.username,
    sortable: false,
    grow: 6,
  },
  {
    name: (<div className='table-header-cell'>
      <span>EMAIL</span>
      <ListFilterIcon style={{ width: '16px', height: '16px', marginLeft: '10px', marginBottom: '5px' }} />
    </div>),
    selector: row => row.email,
    sortable: false,
    // cell: row => row.email,
    grow: 6,
  },
  {
    name: (<div className='table-header-cell'>
      <span>PHONE NUMBER</span>
      <ListFilterIcon style={{ width: '16px', height: '16px', marginLeft: '10px', marginBottom: '5px' }} />
    </div>),
    selector: row => row.phoneNumber,
    sortable: false,
    grow: 6,
  },
  {
    name: (<div className='table-header-cell'>
      <span>DATE JOINED</span>
      <ListFilterIcon style={{ width: '16px', height: '16px', marginLeft: '10px', marginBottom: '5px' }} />
    </div>),
    selector: row => formatDate(row.dateJoined),
    sortable: false,
    grow: 6,
  },
  {
    name: (<div className='table-header-cell'>
      <span>STATUS</span>
      <ListFilterIcon style={{ width: '16px', height: '16px', marginLeft: '10px', marginBottom: '5px' }} />
    </div>),
    selector: row => row.status,
    cell: row => <StatusBadge status={row.status} />,
    sortable: false,
    grow: 6,
  },
  {
    name: '',
    selector: row => row.status,
    cell: (row) => {
      const [open, setOpen] = useState(false);

      return (
        <div className='table-cell-option'>
          <EllipsisVertical role='button' style={{ cursor: "pointer" }} onClick={() => setOpen(true)} />

          <OutsideClickHandler
            disabled={!open}
            onOutsideClick={() => setOpen(false)}
          >
            {open && (
              <div className="option-open">
                <div onClick={() => row?.handleViewDetails(row)} className="item">
                  <Eye />

                  <span>View Details</span>
                </div>
                <div className="item">
                  <UserX />

                  <span>Blacklist User</span>
                </div>
                <div className="item">
                  <UserCheck2 />

                  <span>Activate User</span>
                </div>
              </div>
            )}
          </OutsideClickHandler>
        </div>
      )
    },
    grow: 1,
    sortable: false,
  },
];

const customTableStyles: TableStyles = {
  table: {
    style: {
      // border: "1px solid var(--gray-shade-3)",
      // borderRadius: "0.8rem",
      overflow: "hidden",
      // backgroundColor: "var(--base-white)",
    }
  },
  head: {
    style: {
      fontSize: "14px",
      lineHeight: "24px",
      color: "var(--muted-text)",
      marginBottom: '0.8rem',
    }
  },
  headRow: {
    style: {
      // minHeight: "44px",
      backgroundColor: "var(--default-background)",
      borderRadius: "0.8rem",
      border: "none",
      fontWeight: '600',
      fontSize: "12px",
      color: "#545F7D",
      // padding: '0 2.4rem',
    }
  },
  rows: {
    style: {
      borderBottomColor: '#E9ECF2 !important',
      fontWeight: 400,
      // minHeight: "54px",
      // backgroundColor: "var(--base-white)",
      fontSize: "14px",
      lineHeight: "24px",
      color: "#545F7D !important",
      marginBottom: '1.2rem',
    }
  },
  cells: {
    style: {
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "24px",
      color: "#545F7D !important",
    }
  }
}

interface Props {
  data: User[];
}

const UserTable: React.FC<Props> = ({ data }) => {
  const navigate = useNavigate();

  const render = useRef(false);
  const [filterIsOpen, setFilterIsOpen] = useState(false);

  const memoData = useMemo(() => data.map((_data) => ({
    ..._data,
    handleViewDetails(row: UserRow) {
      navigate(`${routeNames.users}/${row.id}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  })), [data]);

  return (
    <div className='data-table'>
      <OutsideClickHandler
        disabled={!filterIsOpen}
        onOutsideClick={() => setFilterIsOpen(false)}
      >
        {filterIsOpen && (
          <div className="filter-modal">
            <div>
              <div className='label'>Organization</div>
              <Select
                options={[
                  {
                    label: 'Lendsqr',
                    value: 'Lendsqr'
                  },
                  {
                    label: 'Irorun',
                    value: 'Irorun'
                  },
                  {
                    label: 'Lendstar',
                    value: 'Lendstar'
                  },
                ]}
              />
            </div>
            <div>
              <div className='label'>Username</div>

              <InputField className='input-field' onChange={() => { }} value='' placeholder='User' />
            </div>
            <div>
              <div className='label'>Email</div>

              <InputField className='input-field' onChange={() => { }} value='' placeholder='Email' />
            </div>
            <div>
              <div className='label'>Date</div>

              <InputField className='input-field' type='date' onChange={() => { }} value='' placeholder='Date' />
            </div>
            <div>
              <div className='label'>Phone Number</div>

              <InputField className='input-field' onChange={() => { }} value='' placeholder='Phone Number' />
            </div>
            <div>
              <div className='label'>Status</div>
              <Select
                options={[
                  {
                    label: 'Inactive',
                    value: 'Inactive'
                  },
                  {
                    label: 'Pending',
                    value: 'Pending'
                  },
                  {
                    label: 'Blacklisted',
                    value: 'Blacklisted'
                  },
                  {
                    label: 'Active',
                    value: 'Active'
                  },
                ]}
              />
            </div>

            <div className="button-wrapper">
              <div className="reset">Reset</div>
              <div className="filter">Filter</div>
            </div>
          </div>
        )}
      </OutsideClickHandler>
      <DataTable
        customStyles={customTableStyles}
        columns={columns}
        data={memoData}
        // pagination
        fixedHeader
        onSort={() => {
          if (render.current) {
            console.log('hello');

            setFilterIsOpen(true);
          } else {
            render.current = true;
          }
        }}
      // fixedHeaderScrollHeight="400px"
      // highlightOnHover
      />

    </div>
  );
};

export default UserTable;
