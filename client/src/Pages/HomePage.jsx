import { useState } from "react";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";
function HomePage() {
  return (
    <div>
        {/* header */}
        <div className="header bg-black overflow-hidden px-4 md:px-10 py-4 md:py-6 box-shadow-md">
            <a href="#default" className="text-white font-bold text-2xl md:text-3xl inline-block">
                AssetTrade
            </a>
            <div className="header-right float-right">
                <Link to="/" className="text-white font-semibold hover:bg-gray-800 px-4 py-2 rounded transition duration-300 inline-block">
                Home
                </Link>
                <a href="#about" className="text-white font-semibold hover:bg-gray-800 px-4 py-2 rounded transition duration-300 inline-block">
                About
                </a>
                <a href="#services" className="text-white font-semibold hover:bg-gray-800 px-4 py-2 rounded transition duration-300 inline-block">
                Services
                </a>
                <a href="#contact" className="text-white font-semibold hover:bg-gray-800 px-4 py-2 rounded transition duration-300 inline-block">
                Contact
                </a>
            </div>
        </div>

        {/*hero-section*/}
        <div className="flex items-center bg-blue-600 dark:bg-gray-900 h-2/5 screen w-full box-border mb-20">
        <img src="hero_image.png" alt="Your Image Description" className="max-w-full h-auto flex-1 ml-10 md:ml-20 rounded-lg" />
        <div className="flex-1 p-8 md:p-16 text-left text-white">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-4 leading-tight">
            Transforming Real Estate through Blockchain Tokenization
          </h1>
          <p className="text-sm md:text-base lg:text-lg mb-4 md:mb-8">
            Seamless asset management and ownership on a decentralized platform. Discover the future of property investment.
          </p>
          <Link to="/register" className="inline-block px-6 py-3 bg-green-500 text-white text-base md:text-lg font-semibold rounded-full transition duration-300 hover:bg-green-600">
            Get Started
          </Link>
        </div>
      </div>


      {/* About Section */}
      <div id="about">
      <div  className="about-heading text-center mb-6 mt-6">
        <h2 className="text-2xl font-bold">About Us</h2>
        </div>
        <div className="about-section flex items-center p-12  border-gray-900 border-4 rounded-lg bg-white transform transition-transform duration-300 w-full max-w-4xl mx-auto hover:scale-103">

        <div className="about-content flex-1 p-4 text-center">
            <h2 className="text-gray-900 text-xl font-bold mb-2">About AssetTrade</h2>
            <p className="text-gray-700 text-lg leading-6">
            AssetHome revolutionizes real estate through blockchain and tokenization. Our decentralized platform leverages Ethereum's solidity and smart contracts for transparent, secure, and accessible real estate asset management.
            </p>
            <p className="text-gray-700 text-lg mt-2 leading-6">
            Join us in reshaping the future of property investment with ease, security, and efficiency. Welcome to the future of real estate on the blockchain!
            </p>
        </div>
        <div className="about-image flex-1 flex justify-end mt-4">
            <img src="about_image.png" alt="About Image" className="max-w-full h-auto rounded-lg" />
        </div>
        </div>
        </div>

    {/* Services section */}
      <div id="services" className="mb-16 mt-12">
        <div className="services-heading text-center mb-12">
          <h2 className="text-3xl font-bold">Our Services</h2>
        </div>
        <div className="services-section flex justify-around mt-auto gap-8">
          <div className="service-box w-1/4 p-6  border-solid border-gray-900 border-4 rounded-lg bg-white transition-transform duration-300 ease-in-out hover:scale-105">
            <img src="trade_icon.gif" alt="Trade Icon" className="max-w-full h-28 mb-4 mx-auto" />
            <h3 className="text-gray-900 text-lg font-bold mb-2 text-center ">Trade</h3>
            <p className="text-gray-700 leading-6 text-md text-center">Effortlessly trade assets on our decentralized platform, ensuring transparency and security.</p>
          </div>
          <div className="service-box w-1/4 p-6  border-solid border-gray-900 border-4 rounded-lg bg-white transition-transform duration-300 ease-in-out hover:scale-105">
            <img src="secure_icon.gif" alt="Secure Icon" className="max-w-full h-28 mb-4 mx-auto" />
            <h3 className="text-gray-900 text-lg font-bold mb-2 text-center">Secure</h3>
            <p className="text-gray-700 leading-6 text-md text-center">Experience the highest level of security with our robust blockchain technology and smart contracts.</p>
          </div>
          <div className="service-box w-1/4 p-6 border-solid border-gray-900 border-4 rounded-lg bg-white transition-transform duration-300 ease-in-out hover:scale-105">
            <img src="fast_icon.gif" alt="Exchange Icon" className="max-w-full h-28 mb-4 mx-auto" />
            <h3 className="text-gray-900 text-lg font-bold mb-2 text-center">Fast Exchange</h3>
            <p className="text-gray-700 leading-6 text-md text-center">Enjoy fast and efficient asset exchange, enhancing your real estate investment experience.</p>
          </div>
        </div>
      </div>
               {/* Contact Section */}
               <div id="contact" className="contact-section text-center px-10 py-5 bg-slate-300">
                <div className="contact-heading mb-7 text-3xl font-bold text-gray-700">
                <h2>Contact Us</h2>
                </div>
                <div className="contact-form max-w-150 mb-0 mt-auto">
                <form>
                    <div className="form-group mb-5">
                    <label htmlFor="name" className=" block text-xl mb-2 text-gray-700">Your Name:</label>
                    <input type="text" id="name" name="name" className=" w-1/2 p-2.5 text-16 border border-solid border-white-300 rounded" required />
                    </div>
                    <div className="form-group">
                    <label htmlFor="email" className=" block text-xl mb-2 text-gray-700">Your Email:</label>
                    <input type="email" id="email" name="email" className=" w-1/2 p-2.5 text-16 border border-solid border-white-300 rounded" required />
                    </div>
                    <div className="form-group">
                    <label htmlFor="message" className=" block text-xl mb-2 text-gray-700">Your Message:</label>
                    <textarea id="message" name="message" rows="6" className=" w-1/2 p-2.5 text-16 border border-solid border-white-300 rounded" required></textarea>
                    </div>
                    <button type="submit" className="contact-submit bg-gray-900 text-white px-3 py-5 text-lg border-none rounded-lg cursor-pointer hover:text-yellow-500">Send Message</button>
                </form>
                </div>
            </div>
    </div>
   
  );
}

export default HomePage;
