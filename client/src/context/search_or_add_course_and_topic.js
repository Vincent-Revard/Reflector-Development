import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SearchAndAddCourseOrTopic = ({ allNames, type }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedId, setSelectedId] = useState(null);

    const handleChange = event => {
        setSearchTerm(event.target.value);
    };

    const filteredItems = allNames?.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleSelect = (id) => {
        setSelectedId(id);
    };

    return (
        <div>
            <input type="text" placeholder={`Search for a ${type}`} value={searchTerm} onChange={handleChange} />
            {filteredItems?.map(item => (
                <div key={item.id}>
                    <p>{item.name}</p>
                    <button onClick={() => handleSelect(item.id)}>Select this {type}</button>
                </div>
            ))}
            {selectedId && (
                <>
                    <Link to={`/${type}s/${selectedId}/enroll`}>Enroll in this {type}</Link>
                    <Link to={`/${type}s/${selectedId}/unenroll`}>Unenroll from this {type}</Link>
                </>
            )}
        </div>
    );
};

export default SearchAndAddCourseOrTopic;