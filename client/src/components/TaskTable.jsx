import React, { useMemo, useEffect, useState, useCallback, useRef } from 'react';
import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table';
import axios from 'axios';
import { format } from 'date-fns';
import { useUser } from '@clerk/clerk-react';
import { FaSearch } from 'react-icons/fa';

const GlobalFilter = ({ filter, setFilter }) => {
  return (
    <span className="mb-4 flex items-center p-4">
      <span className='font-bold'><FaSearch /></span>
      <input
        value={filter || ''}
        onChange={e => setFilter(e.target.value)}
        className="ml-2 border rounded p-1 shadow-md"
        placeholder='Search here'
      />
    </span>
  );
};

const createColumns = (handleCompletedChange) => [
  {
    Header: 'Task No',
    accessor: (row, index) => index + 1,
  },
  {
    Header: 'Title',
    accessor: 'title',
  },
  {
    Header: 'Description',
    accessor: 'description',
  },
  {
    Header: 'Deadline',
    accessor: 'createdDate',
    Cell: ({ value }) => value ? format(new Date(value), 'dd/MM/yyyy') : '-',
  },
  {
    Header: 'Status',
    accessor: 'completed',
    Cell: ({ value, row }) => (
      row.original.completed ? <div className='bg-green-300 text-green-500 font-semibold rounded-xl text-center p-2'>Completed</div> :
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={value || false}
            onChange={() => handleCompletedChange(row.original._id, row, !value)}
          />
          <div
            className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"
          ></div>
        </label>
    ),
  },
  {
    Header: 'Created By',
    accessor: 'name',
  },
  {
    Header: 'Tags',
    accessor: 'tags',
    Cell: ({ value }) => (
      <div>
        {Array.isArray(value) ? value.map((tag, index) => (
          <span
            key={index}
            className="inline-block bg-blue-200 rounded-full px-3 py-1 text-sm font-semibold text-blue-700 mr-2 mb-2"
          >
            {tag}
          </span>
        )) : '-'}
      </div>
    ),
  },
  {
    Header: 'Assigned To',
    accessor: 'assignedUsers',
    Cell: ({ value }) => (
      <ul>
        {Array.isArray(value) ? value.map((user, index) => (
          <li key={index}>{user.email}</li>
        )) : <div className="inline-block bg-blue-200 rounded-full px-3 py-1 text-sm font-semibold text-blue-700 mr-2 mb-2">Everyone</div>}
      </ul>
    ),
  },
  {
    Header: 'Completed By',
    accessor: 'completedBy',
    Cell: ({ value, row }) => row.original.completed ? value : '-',
  },
];

const TaskTable = ({ socket }) => {
  const [data, setData] = useState([]);
  const { user } = useUser();
  const audioRef = useRef(null);

  useEffect(() => {
    if (!socket) return;
    const handleMessageReceived = (datatask) => {
      setData(prev => {
        const exists = prev.some(task => task._id === datatask._id);
        if (exists) {
          return prev.map(task => task._id === datatask._id ? datatask : task);
        } else {
          return [datatask, ...prev];
        }
      });
      audioRef.current.play();
    };

    socket.on("message-recived", handleMessageReceived);

    // Clean up function
    return () => {
      socket.off("message-recived", handleMessageReceived);
    };
  }, [socket, user.id]);

  const filteredData = useMemo(() => {
    return data.filter(task =>
      task.everyone ||
      (Array.isArray(task.assignedUsers) && task.assignedUsers.some(assignedUser => assignedUser.email === user.primaryEmailAddress.emailAddress))
    );
  }, [data, user.primaryEmailAddress.emailAddress]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/task');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleCompletedChange = useCallback(async (id, row, completed) => {
    console.log({ ...row.original })
    try {
      if (!socket) return;
      socket.emit("task-update", { id, data: { ...row.original, completed: true, completedBy: user.firstName } });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }, [user, socket]);

  const columns = useMemo(() => createColumns(handleCompletedChange), [handleCompletedChange]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    state,
    setGlobalFilter,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
  } = useTable(
    {
      columns,
      data: filteredData,
      initialState: { pageIndex: 0, pageSize: 8 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { globalFilter, pageIndex, pageSize } = state;

  return (
    <>
      <audio ref={audioRef} src="/notification.mp3" />
      <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
      <table {...getTableProps()} className="flex-1 min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
          {page.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()} className="px-6 py-4 whitespace-nowrap">
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination mt-4 flex justify-between items-center">
        <div>
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="mr-2 px-2 py-1 border rounded">
            {'<<'}
          </button>
          <button onClick={() => previousPage()} disabled={!canPreviousPage} className="mr-2 px-2 py-1 border rounded">
            {'<'}
          </button>
          <button onClick={() => nextPage()} disabled={!canNextPage} className="mr-2 px-2 py-1 border rounded">
            {'>'}
          </button>
          <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className="mr-2 px-2 py-1 border rounded">
            {'>>'}
          </button>
        </div>
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value));
          }}
          className="ml-2 border rounded"
        >
          {[8, 16, 24, 32, 40, 48, 56].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default TaskTable;
