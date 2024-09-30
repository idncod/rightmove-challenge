import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { within } from '@testing-library/dom';
import PropertyListing from '../PropertyListing';

global.fetch = jest.fn(() =>
    new Promise((resolve) => {
        setTimeout(() => {
                resolve({
                    ok: true,
                    json: () =>
                        Promise.resolve([
                            {
                                "id": 73864112,
                                "bedrooms": 3,
                                "summary": "Situated moments from the River Thames in Old Chelsea, this contemporary three bedroom apartment (117sqm) has just undergone an extensive refurbishment and is now presented in exceptional condition and is beautifully interior designed throughout. ",
                                "displayAddress": "CHEYNE WALK, CHELSEA, SW3",
                                "propertyType": "Flat",
                                "price": 1950000,
                                "branchName": "M2 Property, London",
                                "propertyUrl": "/property-for-sale/property-73864112.html",
                                "contactUrl": "/property-for-sale/contactBranch.html?propertyId=73864112",
                                "propertyTitle": "3 bedroom flat for sale",
                                "mainImage": "https://media.rightmove.co.uk/dir/crop/10:9-16:9/34k/33998/73864112/33998_542689_IMG_01_0001_max_476x317.jpg"
                            },
                            {
                                "id": 59309477,
                                "bedrooms": 2,
                                "summary": "This well presented and modern two bedroom flat is situated within a superb development, boasting a stunning reception room with doors to a balcony and a fully fitted kitchen.",
                                "displayAddress": "Renaissance, Lewisham, SE13",
                                "propertyType": "Flat",
                                "price": 599950,
                                "branchName": "Foxtons, Blackheath",
                                "propertyUrl": "/property-for-sale/property-59309477.html",
                                "contactUrl": "/property-for-sale/contactBranch.html?propertyId=59309477",
                                "propertyTitle": "2 bedroom flat for sale",
                                "mainImage": "https://media.rightmove.co.uk/dir/crop/10:9-16:9/76k/75148/59309477/75148_981263_IMG_17_0000_max_476x317.jpg"
                            },
                        ]),
                });
            }, 100);
        })
);



describe('PropertyListing', () => {
    afterEach(() => {
        fetch.mockClear();
    });

    it('should render property cards from the API', async () => {
        await act(async () => {
            render(<PropertyListing />);
        });

        await waitFor(() => {
            const propertiesList = screen.getByRole('list');
            expect(propertiesList).toBeInTheDocument();
        });

        const propertiesList = screen.getByRole('list');
        const propertyCards = await within(propertiesList).getAllByRole('listitem');

        expect(propertyCards).toHaveLength(2);
    });

    it('should render the loading state initially', async () => {
        await act(async () => {
            render(<PropertyListing />);
        });
        expect(
            screen.getByText(/Loading the properties, please wait.../i)
        ).toBeInTheDocument();
    });

    it('should handle an empty list of properties', async () => {
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([]),
            })
        );
        await act(async () => {
            render(<PropertyListing />);
        });

        await waitFor(() => screen.getByText(/No properties satisfy your request./i));

        expect(screen.getByText(/No properties satisfy your request./i)).toBeInTheDocument();
    });

    it('should handle an error during the fetch', async () => {
        fetch.mockImplementationOnce(() =>
            Promise.reject(new Error('Oops! Failed to fetch.'))
        );
        await act(async () => {
            render(<PropertyListing />);
        });

        await waitFor(() => screen.getByText(/Oops! Failed to fetch/i));

        expect(screen.getByText(/Oops! Failed to fetch/i)).toBeInTheDocument();
    });
});


