import React, { useState, useEffect } from 'react';
import { CardGroup } from 'react-bootstrap';
import PreviewProducts from './PreviewProducts';
import imagesData from '../data/images'; 

export default function FeaturedProducts() {
  const [previews, setPreviews] = useState([]);

  //Fetch data the active product
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/products/active`)
      .then((res) => res.json())
      .then((data) => {
        const featured = [];
        const numbers = [];

        const generateRandomNumbers = () => {
          let randomNum = Math.floor(Math.random() * data.length);

          if (numbers.indexOf(randomNum) === -1) {
            numbers.push(randomNum);
          } else {
            // Recursion
            generateRandomNumbers();
          }
        };

        for (let i = 0; i < 6; i++) {
          generateRandomNumbers();

          const matchingImage = imagesData.find((image) =>
            data[numbers[i]].name.toLowerCase().includes(image.name.toLowerCase())
          );

          featured.push(
            <PreviewProducts
              data={data[numbers[i]]}
              key={data[numbers[i]]._id}
              breakPoint={2}
              imageUrl={matchingImage?.imageUrl}
              style={{
                boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
              }}
            />
          );
        }

        setPreviews(featured);
      });
  }, []);

  return (
    <>
      <h1 className="featured-title">
        Featured Products
      </h1>
      <CardGroup className="justify-content-center">
         {previews}
      </CardGroup>
    </>
  );
}
