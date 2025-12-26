import React from 'react';

// Welcome component displays the introduction and a "Get Started" button
const Welcome = ({ onGetStarted }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="welcomeImage">
        <img src="welcome.png" alt="Welcome" />
      </div>
      <h1 className="hkreate">Kreate</h1>

      <p className="text-lg">
        Step into the world of effortless image transformation with Kreate. Today, you'll discover intuitive tools for background removal, precise cropping, and a suite of artistic filters to bring your visions to life. This is just the beginning; as your creative journey evolves, so too will Kreate, growing with you to unlock even more possibilities for your digital artistry. Let's create something amazing!
      </p>


      <button
        onClick={onGetStarted}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
      >
        Get Started
      </button>

      <div className="ma-prop">
        <p className="text-lg">Contact us</p>
        <a href="#features" ><img src="instagram.png" className="Ancher-tag" alt="Instagram"/></a>
        <a href="#features" ><img src="github.png" className="Ancher-tag" alt="GitHub"/></a>
        <a href="#features" ><img src="gmail.png" className="Ancher-tag" alt="Gmail"/></a>
      </div>

      <footer>
        <div className="cards">
          <image src=""/> <image src=""/> <image src=""/> <br/>
          <image src=""/> <image src=""/> <image src=""/>
        </div>
      </footer>

    </div>
  );
};

export default Welcome;
