
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Datatable from "../componets/Datatable";

function Page1() {

  const tableHeader = [
    {name: "username", label : "Username", sort : true},
    {name: "name", label : "Name", sort : true},
    {name: "email", label : "Email", sort : true},
    {name: "gender", label : "Gender", sort : true},
    {name: "registeredDate", label : "Registered Date", sort : true},

    {name: "test_aja_nih", label : "Column test", sort : false}, // hilangkan ini, maka kolom akan hilang. atau coba ganti sort jadi true, (jadi bisa disort)
  ];

  const tableFilter = [
    {
      type : 'input',
      fieldName : 'search', // state name in datatable
      label : 'Cari',
      column : ['username', 'name', 'email', 'registeredDate'],
      option : [],
      operator : 'contains'
    },
    {
      type : 'select',
      fieldName : 'gender', // state name in datatable
      label : 'Jenis kelamin',
      column : ['gender'],
      option : [
        {value: 'all', label: 'All'},
        {value: 'male', label: 'Male'},
        {value: 'female', label: 'Female'}
      ],
      operator : 'exact'
    }
  ]
  const [row, setRow] = useState([]);

  const getUser = async () => {
    try {

      const result = await axios.get('https://randomuser.me/api/?results=75&&seed=aaaaaaaaaa');

      setRow(result.data.results.map((val, i)=>{
        return {
          username: val.login.username,
          name: `${val.name.first} ${val.name.last}`,
          email: val.email,
          gender: val.gender,
          registeredDate : val.registered.date,

          test_aja_nih : `ini cuma buat test (${i})` // hilangkan ini, maka data kolom akan hilang
        }
      }))

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    getUser();
  }, [])

  return (
    <>
      <div>
        <Link to='/'>To Home</Link>
      </div>

      <Datatable headers={tableHeader} filters={tableFilter} data={row} itemsPerPage={5} />
    </>
  );
}

export default Page1;
