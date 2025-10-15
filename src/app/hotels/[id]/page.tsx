'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Mock hotel detail data
const MOCK_HOTEL_DETAIL = {
  id: '1',
  name: 'Hotel 414 Luxury Stay Near Mall Road',
  location: 'Mall Road, Nainital',
  distance: '0.5 km drive from Mall Road',
  rating: 4.5,
  reviews: 1250,
  price: 3200,
  originalPrice: 4000,
  discount: 20,
  amenities: ['Free WiFi', 'Swimming Pool', 'Restaurant', 'Room Service', 'Gym', 'Couple Friendly'],
  images: ['/images/stay1.png', '/images/stay2.jpg', '/images/stay3.jpg', '/images/stay4.jpg', '/images/stay5.jpg'],
  star: 4,
  description: 'Experience luxury and comfort at Hotel 414, perfectly located near the famous Mall Road. Our hotel offers modern amenities and exceptional service to make your stay memorable.',
  checkInTime: '2:00 PM',
  checkOutTime: '12:00 PM',
  policies: [
    'ID proof required at check-in',
    'No pets allowed',
    'Smoking not allowed',
    'Outside food not allowed'
  ]
};

export default function HotelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [hotel, setHotel] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch hotel details from API
    setTimeout(() => {
      setHotel(MOCK_HOTEL_DETAIL);
      setLoading(false);
    }, 500);
  }, [params?.id]);

  if (loading) {
    return (
      <div>
        <Header />
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading hotel details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div>
        <Header />
        <div className="container py-5">
          <div className="text-center">
            <h4>Hotel not found</h4>
            <button className="btn btn-success mt-3" onClick={() => router.push('/hotels')}>
              Back to Hotels
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div style={{ background: "#f5f6f8", minHeight: "100vh" }}>
        <div className="container py-4">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <button className="btn btn-link p-0 text-decoration-none" onClick={() => router.push('/hotels')}>
                  Hotels
                </button>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {hotel.name}
              </li>
            </ol>
          </nav>

          <div className="row">
            {/* Left Column - Images and Details */}
            <div className="col-lg-8">
              {/* Image Gallery */}
              <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
                <div className="card-body p-4">
                  <div className="row">
                    {/* Main Image */}
                    <div className="col-md-8 mb-3">
                      <img
                        src={hotel.images[selectedImage]}
                        alt={hotel.name}
                        style={{
                          width: '100%',
                          height: '300px',
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                      />
                    </div>
                    {/* Thumbnail Images */}
                    <div className="col-md-4">
                      <div className="d-flex d-md-block gap-2">
                        {hotel.images.slice(0, 4).map((image: string, index: number) => (
                          <img
                            key={index}
                            src={image}
                            alt={`${hotel.name} ${index + 1}`}
                            onClick={() => setSelectedImage(index)}
                            style={{
                              width: '100%',
                              height: '68px',
                              objectFit: 'cover',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              border: selectedImage === index ? '2px solid #0CA04E' : '2px solid transparent',
                              marginBottom: '8px'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hotel Info */}
              <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h3 className="mb-2" style={{ fontWeight: 600, color: '#333' }}>
                        {hotel.name}
                      </h3>
                      <p className="text-muted mb-2">{hotel.location}</p>
                      <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                        {hotel.distance}
                      </p>
                    </div>
                    <div className="text-end">
                      <div
                        className="badge mb-2"
                        style={{
                          backgroundColor: '#FFF3CD',
                          color: '#856404',
                          fontSize: '12px',
                          fontWeight: 600,
                          padding: '4px 8px'
                        }}
                      >
                        ⭐ {hotel.star} Star
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="d-flex align-items-center justify-content-center"
                          style={{
                            backgroundColor: '#0CA04E',
                            color: 'white',
                            width: '32px',
                            height: '24px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 600
                          }}
                        >
                          {hotel.rating}
                        </div>
                        <span style={{ fontSize: '14px', color: '#666' }}>
                          ({hotel.reviews.toLocaleString()} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="mb-4" style={{ lineHeight: '1.6' }}>
                    {hotel.description}
                  </p>

                  {/* Amenities */}
                  <h5 className="mb-3" style={{ fontWeight: 600, fontSize: '18px' }}>Amenities</h5>
                  <div className="row">
                    {hotel.amenities.map((amenity: string, index: number) => (
                      <div key={index} className="col-md-6 col-lg-4 mb-2">
                        <div className="d-flex align-items-center">
                          <span className="text-success me-2">✓</span>
                          <span style={{ fontSize: '14px' }}>{amenity}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Policies */}
                  <h5 className="mb-3 mt-4" style={{ fontWeight: 600, fontSize: '18px' }}>Hotel Policies</h5>
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>Check-in:</strong> {hotel.checkInTime}</p>
                      <p><strong>Check-out:</strong> {hotel.checkOutTime}</p>
                    </div>
                    <div className="col-md-6">
                      <ul className="list-unstyled">
                        {hotel.policies.map((policy: string, index: number) => (
                          <li key={index} className="mb-1">
                            <span className="text-muted me-2">•</span>
                            <span style={{ fontSize: '14px' }}>{policy}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Booking Card */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm" style={{ borderRadius: '12px', position: 'sticky', top: '20px' }}>
                <div className="card-body p-4">
                  {/* Price */}
                  <div className="text-center mb-4">
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                      <span style={{ fontSize: '32px', fontWeight: 700, color: '#333' }}>
                        ₹{hotel.price.toLocaleString()}
                      </span>
                      {hotel.originalPrice && (
                        <span style={{ fontSize: '18px', color: '#999', textDecoration: 'line-through' }}>
                          ₹{hotel.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>Per Night</p>
                    {hotel.discount && (
                      <span
                        className="badge mt-2"
                        style={{
                          backgroundColor: '#0CA04E',
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: 600
                        }}
                      >
                        {hotel.discount}% OFF
                      </span>
                    )}
                  </div>

                  {/* Booking Form */}
                  <form>
                    <div className="mb-3">
                      <label className="form-label" style={{ fontSize: '14px', fontWeight: 600 }}>
                        Check-in Date
                      </label>
                      <input type="date" className="form-control" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" style={{ fontSize: '14px', fontWeight: 600 }}>
                        Check-out Date
                      </label>
                      <input type="date" className="form-control" />
                    </div>
                    <div className="row mb-3">
                      <div className="col-6">
                        <label className="form-label" style={{ fontSize: '14px', fontWeight: 600 }}>
                          Rooms
                        </label>
                        <select className="form-select">
                          <option>1 Room</option>
                          <option>2 Rooms</option>
                          <option>3 Rooms</option>
                        </select>
                      </div>
                      <div className="col-6">
                        <label className="form-label" style={{ fontSize: '14px', fontWeight: 600 }}>
                          Guests
                        </label>
                        <select className="form-select">
                          <option>2 Adults</option>
                          <option>3 Adults</option>
                          <option>4 Adults</option>
                        </select>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="btn w-100"
                      style={{
                        backgroundColor: '#0CA04E',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px',
                        fontSize: '16px',
                        fontWeight: 600
                      }}
                    >
                      Book Now
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
