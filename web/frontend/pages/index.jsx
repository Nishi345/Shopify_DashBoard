import { Layout, LegacyCard, Page } from "@shopify/polaris";
import { useAuthenticatedFetch } from "../hooks";
import { useEffect, useState } from "react";
// import { storeData } from "../data";

export default function HomePage() {
  let fetch = useAuthenticatedFetch();
  const [data, setData] = useState(0);
  const [collectionData, setCollectionData] = useState(0);
  const [orders, setOrders] = useState(0);
  const [fulfill, setFulfill] = useState(0);
  const [remains, setRemains] = useState(0);
  useEffect(() => {
    console.log("fgh");
    fetchProduct();
    fetchCollection();
    fetchOrders();
  }, []);

  async function fetchProduct() {
    try {
      let request = await fetch("/api/products/count");
      let response = await request.json();
      console.log(response);
      setData(response.count);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchCollection() {
    try {
      let request = await fetch("/api/collection/count");
      let response = await request.json();
      console.log(response);
      setCollectionData(response.count);
    } catch (error) {
      console.log(error);
    }
  }
  async function fetchOrders() {
    try {
      let request = await fetch("/api/orders/all");
      let response = await request.json();
      console.log(response.data.length);
      setOrders(response.data.length);
      let fulfillOrders = response.data.filter(
        (item) => item.fulfillment_status === "fulfilled"
      );
      setFulfill(fulfillOrders.length);
      setRemains(response.data.length - fulfillOrders.length);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Page fullWidth>
      <div className="home-section">
        <div className="graphs-section">
          <Layout>
            <Layout.Section oneHalf>
              <LegacyCard title="Total-orders" sectioned>
                <h1>{orders}</h1>
              </LegacyCard>
            </Layout.Section>
            <Layout.Section oneThird>
              <LegacyCard title="Fulfil-orders" sectioned>
                <h1>{fulfill}</h1>
              </LegacyCard>
            </Layout.Section>
            <Layout.Section oneThird>
              <LegacyCard title="Remaining-orders" sectioned>
                <h1>{remains}</h1>
              </LegacyCard>
            </Layout.Section>
            <Layout.Section oneThird>
              <LegacyCard title="Total-Products" sectioned>
                <h1>{data}</h1>
              </LegacyCard>
            </Layout.Section>
            <Layout.Section oneThird>
              <LegacyCard title="Total-Collection" sectioned>
                <h1>{collectionData}</h1>
              </LegacyCard>
            </Layout.Section>
          </Layout>
        </div>
        <div className="cards-section"></div>
      </div>
    </Page>
  );
}
