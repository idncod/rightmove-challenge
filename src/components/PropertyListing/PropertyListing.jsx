import React, { useState, useEffect } from 'react';
import PropertyCard from '../PropertyCard';
import './PropertyListing.scss';

const PropertyListing = () => {
    const [properties, setProperties] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const res = await fetch('https://rightmove-challenge.onrender.com/api/properties');
                if(!res.ok) {
                    throw new Error('Failed to fetch properties!');
                }
                const data = await res.json();
                setProperties(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    if(loading) return <div>Loading the properties, please wait...</div>;
    if(error) return <div>Oops! Error {error}</div>;

    return (
        <ul className="PropertyListing">
            {properties.length === 0 ? (
                <li>No properties satisfy your request.</li>
            ) : (
                properties.map((property) => (
                    <li key={property.id}>
                        <PropertyCard {...property} />
                    </li>
                ))
            )}
        </ul>
    );
};

export default PropertyListing;
