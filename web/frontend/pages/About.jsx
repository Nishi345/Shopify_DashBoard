import { Button, Frame, Modal, TextContainer } from "@shopify/polaris";
import { useState, useCallback } from "react";
const About = () => {
  const [active, setActive] = useState(true);

  const handleChange = useCallback(() => setActive(!active), [active]);

  const activator = <Button onClick={handleChange}>Open</Button>;

  return (
    <div style={{ height: "500px" }}>
      <Frame>
        <Modal
          activator={activator}
          open={active}
          onClose={handleChange}
          title="Reach more shoppers with Instagram product tags"
          primaryAction={{
            content: "Add Instagram",
            onAction: handleChange,
          }}
          secondaryActions={[
            {
              content: "Learn more",
              onAction: handleChange,
            },
          ]}
        >
          <Modal.Section>
            <p>
              Use Instagram posts to share your products with millions of
              people. Let shoppers buy from your store without leaving
              Instagram.
            </p>
          </Modal.Section>
        </Modal>
      </Frame>
    </div>
  );
};
export default About;
