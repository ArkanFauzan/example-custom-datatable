import { useState, useEffect } from "react";
import './Datatable.css';

import Pagination from "../componets/Pagination";

function Datatable({headers, filters, data, itemsPerPage}) {

  const [dataFiltered, setDataFiltered] = useState([]); // total data, after filtered (initial source from props.data)
  const [currentItems, setCurrentItems] = useState([]); // total data to be showed in current page
  const [filter, setFilter] = useState({
    available : [
      // {
      //   type : 'input', //or 'select'
      //   fieldName : 'search', // state name in datatable
      //   label : 'Cari',
      //   column : ['username', 'name', 'email', 'registeredDate'], // column to be search
      //   option : [], // only for type === 'select'
      //   operator : 'contains', // or 'exact' (===)
      //   value : ''
      // }
      
      // // will be filled from props.filters

    ],
    sortCol : "",
    sortType : "",
  });

  // for pagination state
  const [itemOffset, setItemOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(1);

  // initial, after "data" is ready (data only called 1 time, after first fetch)
  useEffect(()=> {

    resetFilter();

    setDataFiltered(data); // initial, show all data

    handleResetPagination(data); // reset pagination to page 1

  }, [data]);

  // render data after change filter
  const changeFilteredData = ({available, sortCol, sortType}) => {

    let filtered = [...data]; // initial data
    let resetPagination = false;

    // filter data, by checking available filter
    available.forEach((available, idx) => {

      // filter input text (like input search)
      if (available.type === 'input') {

        if ( available.value.length > 0 ) {

          resetPagination = true;

          filtered = filtered.filter(v => {
  
            let exist = false;
            available.column.forEach(col => {
              if (available.operator === 'exact') {
                if (v[ col ] && v[ col ].toLowerCase() === available.value.toLowerCase()) {
                  exist = true;
                }
              }
              else { // operator === contains
                if (v[ col ] && v[ col ].toLowerCase().includes(available.value.toLowerCase())) {
                  exist = true;
                }
              }
            });
  
            return exist;
          });
        }

      }
      // filter select option, like gender
      else if (available.type === 'select') {

        if (available.value !== '' && available.value !== 'all') {

          resetPagination = true;

          filtered = filtered.filter(v => {

            let exist = false;
            available.column.forEach(col => {
              if (available.operator === 'exact') {
                if (v[ col ] && v[ col ].toLowerCase() === available.value.toLowerCase()) {
                  exist = true;
                }
              }
              else { // operator === contains
                if (v[ col ] && v[ col ].toLowerCase().includes(available.value.toLowerCase())) {
                  exist = true;
                }
              }
            });

            return exist;
          });

        }
      }
    });

    // implement sort (by selected column name "sortCol" and type "ASC or DESC")
    if (sortCol.length > 0 && sortType.length > 0) {

      resetPagination = true;

      filtered.sort((a, b) => {

        if (a[sortCol] && b[sortCol]) {

          const isNumber = /^\d+$/.test(a[sortCol]) && /^\d+$/.test(b[sortCol]);

          if (sortType === 'ASC') {

            if (isNumber) {
              return a[sortCol] - b[sortCol];
            }

            // for string
            let aLower = a[[sortCol]].toLowerCase();
            let bLower = b[[sortCol]].toLowerCase();

            if ( aLower < bLower ){
              return -1;
            }
            if ( aLower > bLower ){
              return 1;
            }
            return 0;

          } else {

            if (isNumber) {
              return b[sortCol] - a[sortCol];
            }

            // for string
            let aLower = a[[sortCol]].toLowerCase();
            let bLower = b[[sortCol]].toLowerCase();

            if ( aLower < bLower ){
              return 1;
            }
            if ( aLower > bLower ){
              return -1;
            }
            return 0;
          }
        }
        else {
          return 0;
        }
      })
    }

    // update filter state
    setFilter(prevState => {
      return {...prevState, sortCol, sortType, available : [...available]};
    })

    // update data state
    setDataFiltered(filtered); // update list data

    // if need to reset pagination
    if (resetPagination) {
      handleResetPagination(filtered);
    }
  }

  // get filter value by fieldname
  const getFilterValue = (fieldName) => {
    let value = '';
    filter.available.forEach(v => {
      if (v.fieldName === fieldName) {
        value = v.value;
      }
    });
    return value;
  }

  const onChangeFilter = (fieldName, value) => {

    const availableFilter = filter.available.map(v=>{
      if (v.fieldName === fieldName) {
        v.value = value;
      }
      return v;
    });

    changeFilteredData({...filter, available: [...availableFilter]});
  }

  const changeSortCol = (val) => {
    changeFilteredData({...filter, sortCol: val});
  }

  const changeSortType = (val) => {
    changeFilteredData({...filter, sortType: val});
  }

  const resetFilter = () => {

    // get available filter (from props.filter)
    let listFilter = {
      available: [...filters.map(v=>{v.value = ''; return v;})], // unset value
      sortCol : '', 
      sortType : ''
    };

    changeFilteredData({ ...listFilter });
    handleResetPagination(dataFiltered); // reset pagination to page 1
  }

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {

    const newOffset = (event.selected * itemsPerPage) % dataFiltered.length;
    setItemOffset(newOffset);

    setCurrentItems(dataFiltered.slice(newOffset, newOffset + itemsPerPage)); // set showed item

    setTotalPage(Math.ceil(dataFiltered.length / itemsPerPage)); // set total page
    
    setCurrentPage(event.selected); // set current page
  };

  // reset pagination to first page
  const handleResetPagination = (data) => {

    setItemOffset(0); // reset offset
  
    setCurrentItems(data.slice(0, 0 + itemsPerPage)); // set showed item

    setTotalPage(Math.ceil(data.length / itemsPerPage)); // set total page
    
    setCurrentPage(0); // set current page
  }

  return (
    <>
      {
        headers.length > 0 && 

        <div className="datatable">

          {/* container filter */}
          <div className="filter-datatable">

            {filters.map((val, idx) => {

              // type input, like "search"
              if (val.type === 'input') {
                return (
                  <div key={idx}>
                    <label>{val.label}</label>
                    <input type="text" onChange={(e)=>onChangeFilter(val.fieldName, e.target.value)} value={getFilterValue(val.fieldName)} />
                  </div>
                )
              }
              // type select, like "gender"
              else if (val.type === 'select') {
                return (
                  <div key={idx}>
                    <label>{val.label}</label>

                    <select onChange={(e)=>onChangeFilter(val.fieldName, e.target.value)} value={getFilterValue(val.fieldName)} >
                      {val.option.map(option => {
                        return <option key={option.value} value={option.value}>{option.label}</option>;
                      })}
                    </select>
                  </div>
                )
              }
            })}

            <div>
              <label>sort</label>

              <select value={filter.sortCol} onChange={(e) => changeSortCol(e.target.value)}>
                <option value="" disabled>--- pilih ---</option>
                {headers.map((header, i) => {
                  return header.sort ? <option key={i} value={header.name}>{header.label}</option> : <></>
                })}
              </select>

              <select value={filter.sortType} onChange={(e) => changeSortType(e.target.value)}>
                <option value="" disabled>--- pilih ---</option>
                <option value="ASC">ASC</option>
                <option value="DESC">DESC</option>
              </select>
            </div>

            <div>
              <button onClick={(e)=>{resetFilter()}}>reset</button>
            </div>
            
          </div>

          <table>
            <thead>
              <tr>
                <td>No.</td>
                {headers.map((header, i) => {
                  return <td key={i}>{header.label}</td>
                })}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((row, i)=>{
                return (
                  <tr key={i}>
                    <td>{itemOffset + i + 1}</td>
                    {headers.map((header, j) => {
                      return <td key={`${i}-${j}`}>{row[header.name] ? row[header.name] : '-' }</td>
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>

          <div className="pagination-datatable">
            <Pagination
              breakLabel="..."
              nextLabel="next >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              forcePage={currentPage}
              pageCount={totalPage}
              previousLabel="< prev"
              renderOnZeroTotalPage={null}
            />
          </div>
        </div>
      }
    </>
  );
}

export default Datatable;