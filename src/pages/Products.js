import { useEffect, useState, useContext } from 'react';
import UserContext from '../UserContext';
import UserView from '../components/UserView';
import AdminView from '../components/AdminView';
import Footer from '../components/Footer';


export default function Products() {


  const { user } = useContext(UserContext);


  const [products, setProducts] = useState([]);

  const fetchData = () => {
      fetch(`${process.env.REACT_APP_API_URL}/products/all`)
      .then(res => res.json())
      .then(data => {
          
          console.log(data);

          // Sets the "products" state to map the data retrieved from the fetch request into several "CourseCard" components
          setProducts(data);

      });
  }


  // Retrieves the products from the database upon initial render of the "Products" component
  useEffect(() => {

      fetchData()

  }, []);


  // Component Body
  return (
    <>
      {
               (user.isAdmin === true) ?
                    //Pass the fetchData as props
                   <AdminView productsData={products} fetchData={fetchData} />

                   :

                   <UserView productsData={products} />
      }
      <Footer />
    </>
    
  )
}