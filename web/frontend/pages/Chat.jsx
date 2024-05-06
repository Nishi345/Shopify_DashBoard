import React, { useState, useEffect } from "react";
import { Page, Layout, LegacyCard, Grid } from "@shopify/polaris";
import { Add, Delete } from "@mui/icons-material";
import { useAuthenticatedFetch } from "../hooks";

const Chat = () => {
  const [products, setProducts] = useState([]);

  let fetch = useAuthenticatedFetch();

  // Define productHandler to handle product clicks
  let productHandler = (productId) => {
    console.log(productId);
    let searchProduct = products.find((elem) => elem.id === productId);
    console.log(searchProduct);
  };

  let deleteHandler = async () => {
    console.log("@@@");
  };

  let createHandler = async () => {
    console.log("@@@");
  };

  useEffect(() => {
    fetchProductAll();
  }, []);

  const fetchProductAll = async () => {
    try {
      let request = await fetch("/api/products/all?ids=08123463", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      let response = await request.json();
      console.log(response.data);
      setProducts(response?.data);
    } catch (error) {
      console.log(error, "@@@@");
    }
  };

  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          <button className="button" onClick={createHandler}>
            New <Add />
          </button>
          <button className="button" onClick={deleteHandler}>
            New <Delete />
          </button>
        </Layout.Section>
        <Layout.Section>
          <Grid>
            {products.map((data) => {
              return (
                <Grid.Cell
                  key={data.id}
                  columnSpan={{ xs: 6, sm: 6, md: 2, lg: 4, xl: 3 }}
                >
                  <div className="card" onClick={() => productHandler(data.id)}>
                    {/* Pass data.id to productHandler */}
                    <LegacyCard sectioned>
                      <img
                        src={data.image?.src}
                        alt="product media"
                        className="product-image"
                      />

                      <h2 className="product-title">{data.title}</h2>
                      <p className="product-price">{data.variants[0].price}</p>
                    </LegacyCard>
                  </div>
                </Grid.Cell>
              );
            })}
          </Grid>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Chat;
