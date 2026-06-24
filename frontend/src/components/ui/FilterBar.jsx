import React from 'react';
import Input from './Input';
import Select from './Select';

const FilterBar = ({ filters, onFilterChange, onSearch, onReset, cities, serviceTypes }) => {
    return (
        <div className="bg-gray-100 p-6 rounded-lg mb-8">
            <form onSubmit={onSearch} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Input
                    name="search"
                    placeholder="Search..."
                    value={filters.search}
                    onChange={onFilterChange}
                />
                <Select
                    name="postType"
                    value={filters.postType}
                    onChange={onFilterChange}
                    options={[
                        { id: 'rent', name: 'For Rent' },
                        { id: 'sell', name: 'For Sale' }
                    ]}
                />
                <Select
                    name="cityId"
                    value={filters.cityId}
                    onChange={onFilterChange}
                    options={cities}
                />
                <Select
                    name="serviceTypeId"
                    value={filters.serviceTypeId}
                    onChange={onFilterChange}
                    options={serviceTypes}
                />
                <Input
                    type="number"
                    name="minPrice"
                    placeholder="Min Price"
                    value={filters.minPrice}
                    onChange={onFilterChange}
                />
                <Input
                    type="number"
                    name="maxPrice"
                    placeholder="Max Price"
                    value={filters.maxPrice}
                    onChange={onFilterChange}
                />
                <div className="md:col-span-3 lg:col-span-6 flex gap-2">
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Search
                    </button>
                    <button type="button" onClick={onReset} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                        Reset
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FilterBar;