function WelcomeHeader() {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Dobrodošli nazad!</h1>
        <div style={styles.avatar}>👨‍🎓</div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
  },

  header: {
    backgroundColor: "#071686ff",
    borderRadius: "16px",
    padding: "35px 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    color: "white",
    fontSize: "28px",
    fontWeight: 600,
    margin: 0,
    letterSpacing: "0.5px",
  },

  avatar: {
    width: "100px",
    height: "100px",
    backgroundColor: "#a8d5ba",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "50px",
  },
};

export default WelcomeHeader;
