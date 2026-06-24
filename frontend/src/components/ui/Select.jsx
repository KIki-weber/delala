import React from 'react';

const Select = ({ label, name, value, onChange, options, required = false, disabled = false }) => {
    return (
        <div className="mb-4">
            {label && (
                <label className="block text-gray-700 mb-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <select
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="">Select {label}</option>
                {options.map(option => (
                    <option key={option.id} value={option.id}>
                        {option.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Select;