
const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <p>some footers text</p>
        {/* Add any additional content here */}
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#333",
    color: "#fff",
    padding: "20px",
    marginTop: "20px",
    textAlign: "center",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
};

export default Footer;