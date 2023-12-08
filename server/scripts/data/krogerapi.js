import { writeFile } from 'fs/promises';
import fetch from 'node-fetch';

const accessToken = 'eyJhbGciOiJSUzI1NiIsImprdSI6Imh0dHBzOi8vYXBpLmtyb2dlci5jb20vdjEvLndlbGwta25vd24vandrcy5qc29uIiwia2lkIjoiWjRGZDNtc2tJSDg4aXJ0N0xCNWM2Zz09IiwidHlwIjoiSldUIn0.eyJhdWQiOiJ1c2MzOTAtZmJkYjBlZDQ0ZGI4YjgwODdkZDM1MGY1ZWE5YWU3MjU4MzMzMTExMTY0NTY3MzE3NjUxIiwiZXhwIjoxNzAwODgxODkzLCJpYXQiOjE3MDA4ODAwODgsImlzcyI6ImFwaS5rcm9nZXIuY29tIiwic3ViIjoiZGVkYTdjMzgtZjE2YS01ZGIzLTgzZmUtYTFjZmY2ODc0NTg2Iiwic2NvcGUiOiJwcm9kdWN0LmNvbXBhY3QiLCJhdXRoQXQiOjE3MDA4ODAwOTM2Mzk2NDIwMzYsImF6cCI6InVzYzM5MC1mYmRiMGVkNDRkYjhiODA4N2RkMzUwZjVlYTlhZTcyNTgzMzMxMTExNjQ1NjczMTc2NTEifQ.SBzGTxlmGDh1bJZzpd_OnjFj6T31prEqMAUeSZ_E0ybjUpUtyhrbRhg7jk_pW35EOsyc5tjr2ny0h12g4-WXQdmfBzEqe0DhbYVbS-FIpQ3U2g8tngXcoyJzChN2NPbnREZvwvnsY7zY_5TXR8HRzsZQR3ZoeFq7t1zZRXKoK1J0E1Ew9HRrER8Mf7v_KooRZt1xVw5adbt1HQhfb_P50wvrL7YOZEUP2AWPU6BHclZxHy4o0jXCceGZBs-vd4CBh3mcpqr0ggtcISlVnzgGcFyKKPhcXydAY5WbiFXIyfJ2aJfkLDuWN2kkZD_b3KljjafSeOtkMcCfZESSnxoxbw'; 
const brand = 'Kroger'; // Replace with your desired brand
const searchTerm = 'salmon'; // Replace with your desired search term
const locationId = '01400943'; // Replace with your desired locationId

// Kroger API endpoint for product search
const apiUrl = `https://api.kroger.com/v1/products?filter.brand=${brand}&filter.term=${searchTerm}&filter.locationId=${locationId}`;

// Function to fetch data from the Kroger API and write to a JSON file
async function fetchAndWriteKrogerProductData() {
  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Process the response to include only the "price" section
    const processedData = data.data.map(product => ({
      productId: product.productId,
      upc: product.upc,
      price: product.items.map(item => item.price),
    }));

    // Write the processed Kroger Product Search data to chicken.json
    await writeFile('kroger_salmon_prices.json', JSON.stringify({ data: processedData }, null, 2));
    console.log('Processed product data written to kroger_salmon_pices.json');

  } catch (error) {
    console.error('Error fetching or writing Kroger Product Search data:', error.message);
  }
}

// Call the function to fetch and write product search data
fetchAndWriteKrogerProductData();
