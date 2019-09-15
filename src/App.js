import React from 'react';
import ReactDOM from 'react-dom';
import initSqlJs from 'sql.js';

import 'normalize.css';
import 'purecss/build/buttons.css';
import 'purecss/build/forms.css';
import 'purecss/build/tables.css';

import './App.css';
import pokedex from './pokedex/pokedex.sql';

import SQLEdior from './SqlEditor';

function App() {
    const sql = React.useRef();
    const [loading, setLoading] = React.useState(true);
    const [info, setInfo] = React.useState({});

    React.useEffect(() => {
        init();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    async function init() {
        const SQL = await initSqlJs();
        sql.current = new SQL.Database();

        // insert data into database
        sql.current.exec(pokedex);

        // this code is for getting all the tables and displaying the info
        const [{ values: tables }] = sql.current.exec(
            'SELECT name FROM sqlite_master WHERE type="table" AND name NOT LIKE "sqlite_%";'
        );
        const info = tables.flat().reduce((acc, table) => {
            const [{ values }] = sql.current.exec(`PRAGMA table_info(${table})`);
            acc[table] = values.map((row) => row.slice(1, 3));

            return acc;
        }, {});

        setInfo(info);

        setLoading(false);
    }

    return loading ? <div>Loading...</div> : <SQLEdior sql={sql} info={info} />;
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
