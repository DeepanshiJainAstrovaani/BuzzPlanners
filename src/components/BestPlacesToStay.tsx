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
        height: 470,
        large: true,
    },
    {
        title: 'Hotel Bluez Hills',
        location: 'Nainital, Uttarakhand',
        image: '/images/stay2.jpg',
        width: 300,
        height: 235,
        large: true
    },
    {
        title: 'Hyatt Residency',
        location: 'Mussoorie, Uttarakhand',
        image: '/images/stay3.jpg',
        width: 300,
        height: 235,
    },
    {
        title: 'Ananda Palace',
        location: 'Rishikesh, Uttarakhand',
        image: '/images/stay4.jpg',
        width: 300,
        height: 235,
    },
    {
        title: 'Royal Orchid',
        location: 'Chandigarh',
        image: '/images/stay5.jpg',
        width: 300,
        height: 235,
    },
];


export default function BestPlacesToStay() {
    const { active } = useExperience();
    const title = active === 'flights' ? 'Best Places To Stay' : active === 'hotels' ? 'Top Stays' : active === 'events' ? 'Top Venues' : 'Best Experiences';
    const subtitle = active === 'events' ? 'Find perfect venues at best prices' : 'At Guaranteed Lowest Prices';

    return (
        <section className="py-5 bg-white">
            <Container>
                <div className="text-center mb-4">
                    <h1 className="fw-bold">{title}</h1>
                    <h3 className="text-muted">{subtitle}</h3>
                </div>

                <Row className="g-3">
                    <Col md={6}>
                        <div className="position-relative h-100">
                            <Image
                                src={stays[0].image}
                                alt={stays[0].title}
                                width={stays[0].width}
                                height={stays[0].height}
                                className="img-fluid rounded-4 object-fit-cover"
                                style={{ width: '100%', height: '100%' }}
                            />
                            <div className="position-absolute text-white p-3" style={{ top: 0, left: 0 }}>
                                <h2 className="mb-0 fw-bold">{stays[0].title}</h2>
                                <h5>{stays[0].location}</h5>
                            </div>
                        </div>
                    </Col>

                    <Col md={6}>
                        <Row className="g-3">
                            {stays.slice(1).map((stay, idx) => (
                                <Col xs={6} key={idx}>
                                    <div className="position-relative">
                                        <Image
                                            src={stay.image}
                                            alt={stay.title}
                                            width={stay.width}
                                            height={stay.height}
                                            className="img-fluid rounded-4 object-fit-cover"
                                            style={{ width: `${stay.width}px`, height: `${stay.height}px` }}
                                        />
                                        <div className="position-absolute text-white p-2" style={{ top: 0, left: 0 }}>
                                            <h2 className="fw-bold d-block">{stay.title}</h2>
                                            <h5>{stay.location}</h5>
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
