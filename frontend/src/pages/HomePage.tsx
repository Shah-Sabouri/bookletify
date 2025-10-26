import React from "react";

const HomePage: React.FC = () => {
    return (
        <div style={{ padding: "40px", textAlign: "center" }}>
            <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>Welcome to Bookletify 🎶</h1>
            <p style={{ fontSize: "1.2rem", color: "#555", maxWidth: "600px", margin: "0 auto" }}>
                Discover and review your favorite albums.  
                Use the search bar above to explore artists, albums, and classics from the music world.
            </p>
        </div>
    );
};

export default HomePage;
