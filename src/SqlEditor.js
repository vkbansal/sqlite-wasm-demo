import React from 'react';
import css from './SqlEditor.css';

const DEFAULT_QUERY = `
SELECT
    pokemon.id AS id,
    pokemon.name AS name,
    types.type AS type
FROM
    pokemon
LEFT OUTER JOIN pokemon_types
    ON pokemon_types.pokemon_id = pokemon.id
LEFT OUTER JOIN types
    ON types.id = pokemon_types.type_id
WHERE types.type IS "Grass";
`;

export default function SQLEdior(props) {
    const [query, setQuery] = React.useState(DEFAULT_QUERY.trim());
    const [results, setResults] = React.useState({ columns: [], values: [] });

    function handleChange(e) {
        setQuery(e.target.value);
    }

    function handleClick() {
        if (props.sql && props.sql.current) {
            try {
                const res = props.sql.current.exec(query);
                setResults({
                    columns: res[0] ? res[0].columns : [],
                    values: res[0] ? res[0].values : []
                });
            } catch (e) {
                window.alert(e.message || e);
            }
        } else {
            console.error('SQL not found');
        }
    }

    function handleKeydown(e) {
        if (e.key === 'Enter') {
            e.stopPropagation();
        }
    }

    return (
        <div className={css.main}>
            <form className="pure-form" onSubmit={(e) => e.preventDefault()}>
                <textarea
                    className={css['text-area']}
                    value={query}
                    rows={6}
                    onChange={handleChange}
                    onKeyDown={handleKeydown}
                />
                <div className={css.actions}>
                    <button
                        type="button"
                        onClick={handleClick}
                        className="pure-button pure-button-primary"
                    >
                        Execute
                    </button>
                    <details className={css.details}>
                        <summary>Available tables</summary>
                        <div className={css['details-info']}>
                            {Object.keys(props.info).map((key) => {
                                return (
                                    <pre key={key}>
                                        {`${key} (\n  ${props.info[key]
                                            .map((row) => row.join(': '))
                                            .join(',\n  ')}\n)`}
                                    </pre>
                                );
                            })}
                        </div>
                    </details>
                    <a
                        target="_blank"
                        rel="noreferer noopener"
                        href="https://github.com/fanzeyi/pokemon.json"
                    >
                        Data taken from fanzeyi/pokemon.json
                    </a>
                </div>
            </form>
            <div className={css.results}>
                <h2>Results</h2>
                {results.columns.length > 0 ? (
                    <div className={css['table-wrapper']}>
                        <table className="pure-table pure-table-bordered">
                            <thead>
                                <tr>
                                    {results.columns.map((col, i) => (
                                        <th key={i}>{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {results.values.map((row, i) => (
                                    <tr key={i}>
                                        {row.map((val, j) => (
                                            <td key={`${i}-${j}`}>{val}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className={css['no-results']}>No results to display</div>
                )}
            </div>
        </div>
    );
}
