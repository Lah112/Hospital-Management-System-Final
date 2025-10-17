import React, { useContext } from 'react';
import { Context } from '../main';
import Hero from '../components/Hero';
import Biography from '../components/Biography';
import Departments from '../components/Departments';
import MessageForm from '../components/MessageForm';
import QRCodeGenerator from '../components/QRCodeGenerator';

const Home = () => {
    const { isAuthenticated, user } = useContext(Context);

    return (
        <>
            <Hero
                title={"Life Care, Where Compassion Meets Excellence in Healthcare "}
                imageUrl={"/hero.png"}
            />
            
            {/* Show QR Code Generator only when user is logged in */}
            {isAuthenticated && <QRCodeGenerator />}
            
            <Biography imageUrl={"/about.png"} />
            <Departments />
            <MessageForm />
        </>
    );
}

export default Home;