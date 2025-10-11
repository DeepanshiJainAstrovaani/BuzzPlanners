'use client';

import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';
import { useExperience } from '@/context/ExperienceContext';

const stays = [
    {
        title: 'Kasauli Inn 87324',
        location: 'Kasauli, Himachal',
        image: '/images/stay1.png',
        width: 700,
        height: 350, // Reduced from 470
        large: true,
    },
    {
        title: 'Hotel Bluez Hills',
        location: 'Nainital, Uttarakhand',
        image: '/images/stay2.jpg',
        width: 300,
        height: 170, // Reduced from 235
        large: true
    },
    {
        title: 'Hyatt Residency',
        location: 'Mussoorie, Uttarakhand',
        image: '/images/stay3.jpg',
        width: 300,
        height: 170, // Reduced from 235
    },
    {
        title: 'Ananda Palace',
        location: 'Rishikesh, Uttarakhand',
        image: '/images/stay4.jpg',
        width: 300,
        height: 170, // Reduced from 235
    },
    {
        title: 'Royal Orchid',
        location: 'Chandigarh',
        image: '/images/stay5.jpg',
        width: 300,
        height: 170, // Reduced from 235
    },
];

export default function BestPlacesToStay() {
    const { active } = useExperience();
    const title = active === 'flights' ? 'Best Places To Stay' : active === 'hotels' ? 'Top Stays' : active === 'events' ? 'Top Venues' : 'Best Experiences';
    const subtitle = active === 'events' ? 'Find perfect venues at best prices' : 'At Guaranteed Lowest Prices';

    return (
        <section className="py-5 bg-white px-2 px-md-5">
            <Container>
                <div className="text-center mb-4">
                    <h4 className="fw-bold">{title}</h4>
                    <p className="text-muted">{subtitle}</p>
                </div>

                <Row className="g-3">
                    <Col md={6}>
                        <div className="position-relative" style={{ height: '350px' }}>
                            <Image
                                src={stays[0].image}
                                alt={stays[0].title}
                                width={stays[0].width}
                                height={stays[0].height}
                                className="img-fluid rounded-4 object-fit-cover"
                                style={{ width: '100%', height: '100%' }}
                            />
                            <div className="position-absolute text-white p-3" style={{ top: 0, left: 0 }}>
                                <h5 className="mb-0 fw-bold">{stays[0].title}</h5>
                                <p>{stays[0].location}</p>
                            </div>
                        </div>
                    </Col>

                    <Col md={6}>
                        <Row className="g-3">
                            {stays.slice(1).map((stay, idx) => (
                                <Col xs={6} key={idx}>
                                    <div className="position-relative" style={{ height: '170px' }}>
                                        <Image
                                            src={stay.image}
                                            alt={stay.title}
                                            width={stay.width}
                                            height={stay.height}
                                            className="img-fluid rounded-4 object-fit-cover"
                                            style={{ width: '100%', height: '100%' }}
                                        />
                                        <div className="position-absolute text-white p-2" style={{ top: 0, left: 0 }}>
                                            <h6 className="fw-bold mb-1">{stay.title}</h6>
                                            <small>{stay.location}</small>
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
            </Container>
        </section>
    );
}
